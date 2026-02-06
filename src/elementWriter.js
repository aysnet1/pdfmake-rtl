'use strict';

var Line = require('./line');
var isNumber = require('./helpers').isNumber;
var pack = require('./helpers').pack;
var offsetVector = require('./helpers').offsetVector;
var DocumentContext = require('./documentContext');
const rtlUtils = require('./rtlUtils');

/**
 * Creates an instance of ElementWriter - a line/vector writer, which adds
 * elements to current page and sets their positions based on the context
 * @param context
 * @param tracker
 */
function ElementWriter(context, tracker) {
	this.context = context;
	this.contextStack = [];
	this.tracker = tracker;
}

function addPageItem(page, item, index) {
	if (index === null || index === undefined || index < 0 || index > page.items.length) {
		page.items.push(item);
	} else {
		page.items.splice(index, 0, item);
	}
}

ElementWriter.prototype.addLine = function (line, dontUpdateContextPosition, index) {
	var height = line.getHeight();
	var context = this.context;
	var page = context.getCurrentPage(),
		position = this.getCurrentPositionOnPage();

	if (context.availableHeight < height || !page) {
		return false;
	}

	line.x = context.x + (line.x || 0);
	line.y = context.y + (line.y || 0);

	this.alignLine(line);

	addPageItem(page, {
		type: 'line',
		item: line
	}, index);
	this.tracker.emit('lineAdded', line);

	if (!dontUpdateContextPosition) {
		context.moveDown(height);
	}

	return position;
};

ElementWriter.prototype.alignLine = function (line) {
	var width = this.context.availableWidth;
	var lineWidth = line.getWidth();

	var alignment = line.inlines && line.inlines.length > 0 && line.inlines[0].alignment;
	var isRTL = line.isRTL && line.isRTL();

	var offset = 0;

	// For RTL lines, we need special handling
	if (isRTL) {
		// If it's RTL and no explicit alignment, default to right
		if (!alignment || alignment === 'left') {
			alignment = 'right';
		}

		// For RTL, we need to reverse the order of inlines and adjust their positions
		this.adjustRTLInlines(line, width);
	}

	switch (alignment) {
		case 'right':
			offset = width - lineWidth;
			break;
		case 'center':
			offset = (width - lineWidth) / 2;
			break;
	}

	if (offset) {
		line.x = (line.x || 0) + offset;
	}

	if (alignment === 'justify' &&
		!line.newLineForced &&
		!line.lastLineInParagraph &&
		line.inlines.length > 1) {
		var additionalSpacing = (width - lineWidth) / (line.inlines.length - 1);

		for (var i = 1, l = line.inlines.length; i < l; i++) {
			offset = i * additionalSpacing;

			line.inlines[i].x += offset;
			line.inlines[i].justifyShift = additionalSpacing;
		}
	}
};

ElementWriter.prototype.addImage = function (image, index, type) {
	var context = this.context;
	var page = context.getCurrentPage(),
		position = this.getCurrentPositionOnPage();

	if (!page || (image.absolutePosition === undefined && context.availableHeight < image._height && page.items.length > 0)) {
		return false;
	}

	if (image._x === undefined) {
		image._x = image.x || 0;
	}

	image.x = context.x + image._x;
	image.y = context.y;

	this.alignImage(image);

	addPageItem(page, {
		type: type || 'image',
		item: image
	}, index);

	context.moveDown(image._height);

	return position;
};

ElementWriter.prototype.addSVG = function (image, index) {
	return this.addImage(image, index, 'svg');
};

ElementWriter.prototype.addQr = function (qr, index) {
	var context = this.context;
	var page = context.getCurrentPage(),
		position = this.getCurrentPositionOnPage();

	if (!page || (qr.absolutePosition === undefined && context.availableHeight < qr._height)) {
		return false;
	}

	if (qr._x === undefined) {
		qr._x = qr.x || 0;
	}

	qr.x = context.x + qr._x;
	qr.y = context.y;

	this.alignImage(qr);

	for (var i = 0, l = qr._canvas.length; i < l; i++) {
		var vector = qr._canvas[i];
		vector.x += qr.x;
		vector.y += qr.y;
		this.addVector(vector, true, true, index);
	}

	context.moveDown(qr._height);

	return position;
};

ElementWriter.prototype.alignImage = function (image) {
	var width = this.context.availableWidth;
	var imageWidth = image._minWidth;
	var offset = 0;
	switch (image._alignment) {
		case 'right':
			offset = width - imageWidth;
			break;
		case 'center':
			offset = (width - imageWidth) / 2;
			break;
	}

	if (offset) {
		image.x = (image.x || 0) + offset;
	}
};

ElementWriter.prototype.alignCanvas = function (node) {
	var width = this.context.availableWidth;
	var canvasWidth = node._minWidth;
	var offset = 0;
	switch (node._alignment) {
		case 'right':
			offset = width - canvasWidth;
			break;
		case 'center':
			offset = (width - canvasWidth) / 2;
			break;
	}
	if (offset) {
		node.canvas.forEach(function (vector) {
			offsetVector(vector, offset, 0);
		});
	}
};

ElementWriter.prototype.addVector = function (vector, ignoreContextX, ignoreContextY, index, forcePage) {
	var context = this.context;
	var page = context.getCurrentPage();
	if (isNumber(forcePage)) {
		page = context.pages[forcePage];
	}
	var position = this.getCurrentPositionOnPage();

	if (page) {
		offsetVector(vector, ignoreContextX ? 0 : context.x, ignoreContextY ? 0 : context.y);
		addPageItem(page, {
			type: 'vector',
			item: vector
		}, index);
		return position;
	}
};

ElementWriter.prototype.beginClip = function (width, height) {
	var ctx = this.context;
	var page = ctx.getCurrentPage();
	page.items.push({
		type: 'beginClip',
		item: { x: ctx.x, y: ctx.y, width: width, height: height }
	});
	return true;
};

ElementWriter.prototype.endClip = function () {
	var ctx = this.context;
	var page = ctx.getCurrentPage();
	page.items.push({
		type: 'endClip'
	});
	return true;
};

/**
 * Adjust RTL inline positioning
 * @param {Line} line - Line containing RTL text
 * @param {number} availableWidth - Available width for the line
 */
ElementWriter.prototype.adjustRTLInlines = function (line, availableWidth) {
	if (!line.inlines || line.inlines.length === 0) {
		return;
	}

	// For RTL text, we need to reverse the visual order of inlines
	// and recalculate their positions from right to left
	var rtlInlines = [];
	var ltrInlines = [];


	// Separate RTL, LTR, and neutral inlines using Sticky Direction
	// Neutrals (numbers, punctuation) adopt the direction of the preceding strong characters.
	var LTR_REGEX = /[A-Za-z\u00C0-\u024F\u1E00-\u1EFF]/;
	var currentDir = 'rtl'; // Default to line's direction (since this is adjustRTLInlines)

	line.inlines.forEach(function (inline) {
		var hasStrongLTR = LTR_REGEX.test(inline.text);
		var hasStrongRTL = rtlUtils.containsRTL(inline.text);

		// First check the inline's own strong directionality
		if (hasStrongLTR && !hasStrongRTL) {
			// Pure LTR inline
			currentDir = 'ltr';
			ltrInlines.push(inline);
		} else if (hasStrongRTL && !hasStrongLTR) {
			// Pure RTL inline
			currentDir = 'rtl';
			rtlInlines.push(inline);
		} else if (hasStrongLTR && hasStrongRTL) {
			// Mixed inline - treat as RTL since we're in an RTL line
			currentDir = 'rtl';
			rtlInlines.push(inline);
		} else {
			// Neutral inline - adopt the direction of preceding content
			if (currentDir === 'ltr') {
				ltrInlines.push(inline);
			} else {
				rtlInlines.push(inline);
			}
		}
	});

	// If we have RTL inlines, reverse their order and recalculate positions
	if (rtlInlines.length > 0) {
		// Reverse the order of RTL inlines for proper display
		rtlInlines.reverse();

		// Recalculate x positions from right to left
		var currentX = 0;
		var reorderedInlines = [];

		// Add LTR inlines first (if any)
		ltrInlines.forEach(function (inline) {

			inline.x = currentX;
			currentX += inline.width;
			reorderedInlines.push(inline);
		});



		// Add RTL inlines (already reversed)
		var NUMBER_PUNCTUATION_REGEX = /^(\d+)([.:\/\-)(]+)(\s*)$/;

		rtlInlines.forEach(function (inline) {
			// Only apply bracket mirroring if the inline actually contains RTL characters.
			// Mixed language inlines like "(Complete)" should not have their brackets flipped.
			if (rtlUtils.containsRTL(inline.text)) {
				inline.text = rtlUtils.fixArabicTextUsingReplace(inline.text);
			}

			// Fix for "3." rendering as ".3" in RTL context.
			// Reorder to Space-Punct-Number ($3$2$1) for correct RTL visual order.
			// Add explicit space ' ' to ensure separation.
			if (NUMBER_PUNCTUATION_REGEX.test(inline.text)) {
				inline.text = inline.text.replace(NUMBER_PUNCTUATION_REGEX, ' ' + '$3$2$1');
			}

			inline.x = currentX;
			currentX += inline.width;
			reorderedInlines.push(inline);
		});
		// Replace the line's inlines with the reordered ones
		line.inlines = reorderedInlines;
	}
};
function reverseWords(words) {
	let reversed = [];
	let i = words.length - 1;

	const bracketPairs = {
		">": "<",
		"]": "[",
		"}": "{",
		")": "(",
	};

	while (i >= 0) {
		const word = words[i];

		const closingBracket = word.text.match(/[>\])}]/);
		let wordHasRtl = true;

		if (word && typeof word.text === "string")
			wordHasRtl = rtlUtils.containsRTL(word.text);

		if (!wordHasRtl && closingBracket) {
			const openingBracket = bracketPairs[closingBracket[0]];

			const group = [word];
			let openFound = false;

			if (!word.text.includes(openingBracket)) {
				// Scan backward to find the matching opening bracket
				for (let j = i - 1; j >= 0; j--) {
					group.unshift(words[j]);
					if (words[j].text.match(/[<\[\(\{]/)) {
						openFound = true;
						i = j - 1; // move index past the group
						break;
					}
				}
			}

			reversed.push(...group);
			if (!openFound) i--; // fallback if no opening bracket found
			continue;
		}

		// Regular word, just push
		reversed.push(word);
		i--;
	}

	return reversed;
}
function cloneLine(line) {
	var result = new Line(line.maxWidth);

	for (var key in line) {
		if (line.hasOwnProperty(key)) {
			result[key] = line[key];
		}
	}

	return result;
}

ElementWriter.prototype.addFragment = function (block, useBlockXOffset, useBlockYOffset, dontUpdateContextPosition) {
	var ctx = this.context;
	var page = ctx.getCurrentPage();

	if (!useBlockXOffset && block.height > ctx.availableHeight) {
		return false;
	}

	block.items.forEach(function (item) {
		switch (item.type) {
			case 'line':
				var l = cloneLine(item.item);

				if (l._node) {
					l._node.positions[0].pageNumber = ctx.page + 1;
				}
				l.x = (l.x || 0) + (useBlockXOffset ? (block.xOffset || 0) : ctx.x);
				l.y = (l.y || 0) + (useBlockYOffset ? (block.yOffset || 0) : ctx.y);

				page.items.push({
					type: 'line',
					item: l
				});
				break;

			case 'vector':
				var v = pack(item.item);

				offsetVector(v, useBlockXOffset ? (block.xOffset || 0) : ctx.x, useBlockYOffset ? (block.yOffset || 0) : ctx.y);
				if (v._isFillColorFromUnbreakable) {
					// If the item is a fillColor from an unbreakable block
					// We have to add it at the beginning of the items body array of the page
					delete v._isFillColorFromUnbreakable;
					const endOfBackgroundItemsIndex = ctx.backgroundLength[ctx.page];
					page.items.splice(endOfBackgroundItemsIndex, 0, {
						type: 'vector',
						item: v
					});
				} else {
					page.items.push({
						type: 'vector',
						item: v
					});
				}
				break;

			case 'image':
			case 'svg':
				var img = pack(item.item);

				img.x = (img.x || 0) + (useBlockXOffset ? (block.xOffset || 0) : ctx.x);
				img.y = (img.y || 0) + (useBlockYOffset ? (block.yOffset || 0) : ctx.y);

				page.items.push({
					type: item.type,
					item: img
				});
				break;
		}
	});

	if (!dontUpdateContextPosition) {
		ctx.moveDown(block.height);
	}

	return true;
};

/**
 * Pushes the provided context onto the stack or creates a new one
 *
 * pushContext(context) - pushes the provided context and makes it current
 * pushContext(width, height) - creates and pushes a new context with the specified width and height
 * pushContext() - creates a new context for unbreakable blocks (with current availableWidth and full-page-height)
 * @param contextOrWidth
 * @param height
 */
ElementWriter.prototype.pushContext = function (contextOrWidth, height) {
	if (contextOrWidth === undefined) {
		height = this.context.getCurrentPage().height - this.context.pageMargins.top - this.context.pageMargins.bottom;
		contextOrWidth = this.context.availableWidth;
	}

	if (isNumber(contextOrWidth)) {
		contextOrWidth = new DocumentContext({ width: contextOrWidth, height: height }, { left: 0, right: 0, top: 0, bottom: 0 });
	}

	this.contextStack.push(this.context);
	this.context = contextOrWidth;
};

ElementWriter.prototype.popContext = function () {
	this.context = this.contextStack.pop();
};

ElementWriter.prototype.getCurrentPositionOnPage = function () {
	return (this.contextStack[0] || this.context).getCurrentPosition();
};


module.exports = ElementWriter;
