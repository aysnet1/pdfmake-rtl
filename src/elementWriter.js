import { isNumber } from './helpers/variableType';
import { pack, offsetVector } from './helpers/tools';
import DocumentContext from './DocumentContext';
import { EventEmitter } from 'events';
import { containsRTL, fixArabicTextUsingReplace } from './rtlUtils';

/**
 * A line/vector writer, which adds elements to current page and sets
 * their positions based on the context
 */
class ElementWriter extends EventEmitter {

	/**
	 * @param {DocumentContext} context
	 */
	constructor(context) {
		super();
		this._context = context;
		this.contextStack = [];
	}

	/**
	 * @returns {DocumentContext}
	 */
	context() {
		return this._context;
	}

	addLine(line, dontUpdateContextPosition, index) {
		let height = line.getHeight();
		let context = this.context();
		let page = context.getCurrentPage();
		let position = this.getCurrentPositionOnPage();

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
		this.emit('lineAdded', line);

		if (!dontUpdateContextPosition) {
			context.moveDown(height);
		}

		return position;
	}

	alignLine(line) {
		// Skip alignment for list marker lines - their position is manually
		// calculated in processList and should not be affected by inherited
		// alignment or direction properties
		if (line.listMarker) {
			return;
		}

		let width = this.context().availableWidth;
		let lineWidth = line.getWidth();

		let alignment = line.inlines && line.inlines.length > 0 && line.inlines[0].alignment;
		let isRTL = line.isRTL && line.isRTL();

		let offset = 0;

		// For RTL lines, apply special handling
		if (isRTL) {
			if (!alignment || alignment === 'left') {
				alignment = 'right';
			}
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
			let additionalSpacing = (width - lineWidth) / (line.inlines.length - 1);

			for (let i = 1, l = line.inlines.length; i < l; i++) {
				offset = i * additionalSpacing;

				line.inlines[i].x += offset;
				line.inlines[i].justifyShift = additionalSpacing;
			}
		}
	}

	/**
	 * Adjust RTL inline positioning - reorder inlines for proper visual display.
	 *
	 * Implements a simplified Unicode Bidirectional Algorithm (UBA):
	 * 0. Pre-split inlines at RTL↔neutral boundaries so punctuation like "/" between
	 *    Arabic and Latin text is treated as a separate neutral inline
	 * 1. Classify each inline as RTL, LTR, or neutral
	 * 2. Group consecutive same-direction inlines into directional "runs"
	 * 3. Resolve neutral runs: attach to adjacent run based on surrounding context
	 * 4. Reverse the order of runs (base direction is RTL)
	 * 5. Within each LTR run keep order; within each RTL run reverse inlines
	 * 6. Recalculate x positions
	 *
	 * This preserves the positional relationship between adjacent text and
	 * punctuation (e.g. "العربية/arabic" keeps the "/" attached correctly).
	 *
	 * @param {object} line - Line containing RTL text
	 */
	adjustRTLInlines(line) {
		if (!line.inlines || line.inlines.length === 0) {
			return;
		}

		const LTR_REGEX = /[A-Za-z\u00C0-\u024F\u1E00-\u1EFF]/;
		const NUMBER_PUNCTUATION_REGEX = /^(\d+)([.:/\-)(]+)(\s*)$/;
		// Characters that are "boundary neutral" — separators/punctuation between scripts
		const BOUNDARY_NEUTRAL = /[\//\\\-()[\]{}<>:;.,!?@#$%^&*_=+|~`'"،؛؟\s]/;

		// --- Step 0: Pre-split inlines at RTL↔neutral and LTR↔neutral boundaries ---
		// e.g. "العربية/" → ["العربية", "/"]  and  "hello-" → ["hello", "-"]
		let splitInlines = [];
		line.inlines.forEach(inline => {
			let text = inline.text;
			if (!text || text.length === 0) {
				splitInlines.push(inline);
				return;
			}

			let hasStrongRTL = containsRTL(text);
			let hasStrongLTR = LTR_REGEX.test(text);

			// Only split if the inline has strong directional chars AND trailing/leading neutrals
			if ((hasStrongRTL || hasStrongLTR) && text.length > 1) {
				// Split trailing neutral characters (e.g. "العربية/" → "العربية" + "/")
				let trailingStart = text.length;
				while (trailingStart > 0) {
					let ch = text[trailingStart - 1];
					if (BOUNDARY_NEUTRAL.test(ch) && !containsRTL(ch) && !LTR_REGEX.test(ch)) {
						trailingStart--;
					} else {
						break;
					}
				}

				// Split leading neutral characters (e.g. "/العربية" → "/" + "العربية")
				let leadingEnd = 0;
				while (leadingEnd < text.length) {
					let ch = text[leadingEnd];
					if (BOUNDARY_NEUTRAL.test(ch) && !containsRTL(ch) && !LTR_REGEX.test(ch)) {
						leadingEnd++;
					} else {
						break;
					}
				}

				// Only split if there's a meaningful core left
				if ((leadingEnd > 0 || trailingStart < text.length) && leadingEnd < trailingStart) {
					let leadingText = text.slice(0, leadingEnd);
					let coreText = text.slice(leadingEnd, trailingStart);
					let trailingText = text.slice(trailingStart);

					if (leadingText) {
						let clone = Object.assign({}, inline);
						clone.text = leadingText;
						clone.width = inline.font ? inline.font.widthOfString(leadingText, inline.fontSize, inline.fontFeatures) + ((inline.characterSpacing || 0) * (leadingText.length - 1)) : 0;
						clone._isSplit = true;
						splitInlines.push(clone);
					}

					if (coreText) {
						let clone = Object.assign({}, inline);
						clone.text = coreText;
						clone.width = inline.font ? inline.font.widthOfString(coreText, inline.fontSize, inline.fontFeatures) + ((inline.characterSpacing || 0) * (coreText.length - 1)) : 0;
						clone._isSplit = true;
						splitInlines.push(clone);
					}

					if (trailingText) {
						let clone = Object.assign({}, inline);
						clone.text = trailingText;
						clone.width = inline.font ? inline.font.widthOfString(trailingText, inline.fontSize, inline.fontFeatures) + ((inline.characterSpacing || 0) * (trailingText.length - 1)) : 0;
						clone._isSplit = true;
						splitInlines.push(clone);
					}
				} else {
					splitInlines.push(inline);
				}
			} else {
				splitInlines.push(inline);
			}
		});

		// --- Step 1: Classify each inline ---
		const classified = splitInlines.map(inline => {
			let hasStrongLTR = LTR_REGEX.test(inline.text);
			let hasStrongRTL = containsRTL(inline.text);
			let dir;
			if (hasStrongRTL && hasStrongLTR) {
				// Mixed — treat as RTL (predominant for RTL lines)
				dir = 'rtl';
			} else if (hasStrongRTL) {
				dir = 'rtl';
			} else if (hasStrongLTR) {
				dir = 'ltr';
			} else {
				dir = 'neutral'; // punctuation, digits, spaces only
			}
			return { inline, dir };
		});

		// --- Step 2: Build directional runs (groups of consecutive same-direction) ---
		let runs = [];
		let currentRun = null;
		classified.forEach(item => {
			if (!currentRun || currentRun.dir !== item.dir) {
				currentRun = { dir: item.dir, inlines: [] };
				runs.push(currentRun);
			}
			currentRun.inlines.push(item.inline);
		});

		// --- Step 3: Resolve neutral runs ---
		// Step 3a: Bracket pair resolution (UBA rule N0).
		// Find matching bracket pairs across runs. If the content between
		// a "(" neutral run and a ")" neutral run is predominantly one direction,
		// merge the opening bracket, content, and closing bracket into that direction.
		const OPEN_BRACKETS = /[(\\[{<]/;
	//	const CLOSE_BRACKETS = /[)\]}>]/;
		const BRACKET_MATCH = { '(': ')', '[': ']', '{': '}', '<': '>' };

		for (let i = 0; i < runs.length; i++) {
			if (runs[i].dir !== 'neutral') continue;

			// Check if this neutral run contains an opening bracket
			let openBracket = null;
			for (let k = 0; k < runs[i].inlines.length; k++) {
				let txt = runs[i].inlines[k].text.trim();
				if (OPEN_BRACKETS.test(txt)) {
					openBracket = txt.match(OPEN_BRACKETS)[0];
					break;
				}
			}
			if (!openBracket) continue;

			let closeBracket = BRACKET_MATCH[openBracket];

			// Search forward for the matching closing bracket
			for (let j = i + 1; j < runs.length; j++) {
				if (runs[j].dir === 'neutral') {
					let hasClose = false;
					for (let k = 0; k < runs[j].inlines.length; k++) {
						if (runs[j].inlines[k].text.indexOf(closeBracket) >= 0) {
							hasClose = true;
							break;
						}
					}
					if (!hasClose) continue;

					// Found matching close bracket at run j.
					// Determine predominant direction of content between i and j
					let innerLtr = 0, innerRtl = 0;
					for (let m = i + 1; m < j; m++) {
						if (runs[m].dir === 'ltr') innerLtr += runs[m].inlines.length;
						else if (runs[m].dir === 'rtl') innerRtl += runs[m].inlines.length;
					}

					// Resolve bracket pair to inner content direction, or LTR if neutral-only
					let pairDir = innerLtr >= innerRtl ? 'ltr' : 'rtl';

					// Set the direction for the opening and closing bracket runs
					runs[i].dir = pairDir;
					runs[j].dir = pairDir;
					break; // only match the first closing bracket
				}
			}
		}

		// Step 3b: General neutral resolution.
		// A neutral run takes the direction of its neighbors. If both neighbors
		// agree, use that direction. If they disagree, use the base direction (RTL).
		// If only one neighbor exists, use that neighbor's resolved direction.
		for (let i = 0; i < runs.length; i++) {
			if (runs[i].dir !== 'neutral') continue;

			let prevDir = null;
			for (let j = i - 1; j >= 0; j--) {
				if (runs[j].dir !== 'neutral') { prevDir = runs[j].dir; break; }
			}
			let nextDir = null;
			for (let j = i + 1; j < runs.length; j++) {
				if (runs[j].dir !== 'neutral') { nextDir = runs[j].dir; break; }
			}

			if (prevDir && nextDir) {
				runs[i].dir = (prevDir === nextDir) ? prevDir : 'rtl';
			} else if (prevDir) {
				runs[i].dir = prevDir;
			} else if (nextDir) {
				runs[i].dir = nextDir;
			} else {
				runs[i].dir = 'rtl'; // all neutral → base direction
			}
		}

		// --- Step 3c: Merge adjacent runs that now share the same direction ---
		let merged = [runs[0]];
		for (let i = 1; i < runs.length; i++) {
			let last = merged[merged.length - 1];
			if (last.dir === runs[i].dir) {
				last.inlines = last.inlines.concat(runs[i].inlines);
			} else {
				merged.push(runs[i]);
			}
		}
		runs = merged;

		// --- Step 4: Reverse run order (base direction is RTL) ---
		runs.reverse();

		// --- Step 5: Within each RTL run, reverse the inline order ---
		runs.forEach(run => {
			if (run.dir === 'rtl') {
				run.inlines.reverse();
			}
			// LTR runs keep their original inline order
		});

		// --- Step 6: Flatten, apply bracket mirroring, recalculate x positions ---
		// UBA Rule L4: after reordering, mirror bracket glyphs in RTL context
		let reorderedInlines = [];
		let currentX = 0;
		const MIRROR_MAP = { '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{', '<': '>', '>': '<' };

		runs.forEach(run => {
			run.inlines.forEach(inline => {
				// Apply context-aware bracket mirroring for RTL inlines that contain Arabic text
				if (run.dir === 'rtl' && containsRTL(inline.text)) {
					inline.text = fixArabicTextUsingReplace(inline.text);
				}

				// UBA Rule L4: Mirror standalone bracket characters in RTL runs.
				// After Step 5 reversed the inline order, brackets like "(" and ")"
				// are in swapped positions. Mirroring the glyph restores correct visuals.
				// e.g. reversed ")" at position 0 → mirror to "(" → visually correct.
				if (run.dir === 'rtl' && !containsRTL(inline.text) && !LTR_REGEX.test(inline.text)) {
					let mirrored = '';
					for (let c = 0; c < inline.text.length; c++) {
						let ch = inline.text[c];
						mirrored += MIRROR_MAP[ch] !== undefined ? MIRROR_MAP[ch] : ch;
					}
					inline.text = mirrored;
				}

				// Fix number+punctuation rendering in RTL context
				if (run.dir === 'rtl' && NUMBER_PUNCTUATION_REGEX.test(inline.text)) {
					inline.text = inline.text.replace(NUMBER_PUNCTUATION_REGEX, ' $3$2$1');
				}

				inline.x = currentX;
				currentX += inline.width;
				reorderedInlines.push(inline);
			});
		});

		line.inlines = reorderedInlines;
	}

	addImage(image, index) {
		let context = this.context();
		let page = context.getCurrentPage();
		let position = this.getCurrentPositionOnPage();

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
			type: 'image',
			item: image
		}, index);

		context.moveDown(image._height);

		return position;
	}

	addCanvas(node, index) {
		let context = this.context();
		let page = context.getCurrentPage();
		let positions = [];
		let height = node._minHeight;

		if (!page || (node.absolutePosition === undefined && context.availableHeight < height)) {
			// TODO: support for canvas larger than a page
			// TODO: support for other overflow methods

			return false;
		}

		this.alignCanvas(node);

		node.canvas.forEach(function (vector) {
			let position = this.addVector(vector, false, false, index);
			positions.push(position);
			if (index !== undefined) {
				index++;
			}
		}, this);

		context.moveDown(height);

		return positions;
	}

	addSVG(image, index) {
		// TODO: same as addImage
		let context = this.context();
		let page = context.getCurrentPage();
		let position = this.getCurrentPositionOnPage();

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
			type: 'svg',
			item: image
		}, index);

		context.moveDown(image._height);

		return position;
	}

	addQr(qr, index) {
		let context = this.context();
		let page = context.getCurrentPage();
		let position = this.getCurrentPositionOnPage();

		if (!page || (qr.absolutePosition === undefined && context.availableHeight < qr._height)) {
			return false;
		}

		if (qr._x === undefined) {
			qr._x = qr.x || 0;
		}

		qr.x = context.x + qr._x;
		qr.y = context.y;

		this.alignImage(qr);

		for (let i = 0, l = qr._canvas.length; i < l; i++) {
			let vector = qr._canvas[i];
			vector.x += qr.x;
			vector.y += qr.y;
			this.addVector(vector, true, true, index);
		}

		context.moveDown(qr._height);

		return position;
	}

	addAttachment(attachment, index) {
		let context = this.context();
		let page = context.getCurrentPage();
		let position = this.getCurrentPositionOnPage();

		if (!page || (attachment.absolutePosition === undefined && context.availableHeight < attachment._height && page.items.length > 0)) {
			return false;
		}

		if (attachment._x === undefined) {
			attachment._x = attachment.x || 0;
		}

		attachment.x = context.x + attachment._x;
		attachment.y = context.y;

		addPageItem(page, {
			type: 'attachment',
			item: attachment
		}, index);

		context.moveDown(attachment._height);

		return position;
	}

	alignImage(image) {
		let width = this.context().availableWidth;
		let imageWidth = image._minWidth;
		let offset = 0;
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
	}

	alignCanvas(node) {
		let width = this.context().availableWidth;
		let canvasWidth = node._minWidth;
		let offset = 0;
		switch (node._alignment) {
			case 'right':
				offset = width - canvasWidth;
				break;
			case 'center':
				offset = (width - canvasWidth) / 2;
				break;
		}
		if (offset) {
			node.canvas.forEach(vector => {
				offsetVector(vector, offset, 0);
			});
		}
	}

	addVector(vector, ignoreContextX, ignoreContextY, index, forcePage) {
		let context = this.context();
		let page = context.getCurrentPage();
		if (isNumber(forcePage)) {
			page = context.pages[forcePage];
		}
		let position = this.getCurrentPositionOnPage();

		if (page) {
			offsetVector(vector, ignoreContextX ? 0 : context.x, ignoreContextY ? 0 : context.y);
			addPageItem(page, {
				type: 'vector',
				item: vector
			}, index);
			return position;
		}
	}

	beginClip(width, height) {
		let ctx = this.context();
		let page = ctx.getCurrentPage();
		page.items.push({
			type: 'beginClip',
			item: { x: ctx.x, y: ctx.y, width: width, height: height }
		});
		return true;
	}

	endClip() {
		let ctx = this.context();
		let page = ctx.getCurrentPage();
		page.items.push({
			type: 'endClip'
		});
		return true;
	}

	beginVerticalAlignment(verticalAlignment) {
		let page = this.context().getCurrentPage();
		let item = {
			type: 'beginVerticalAlignment',
			item: { verticalAlignment: verticalAlignment }
		};
		page.items.push(item);
		return item;
	}

	endVerticalAlignment(verticalAlignment) {
		let page = this.context().getCurrentPage();
		let item = {
			type: 'endVerticalAlignment',
			item: { verticalAlignment: verticalAlignment }
		};
		page.items.push(item);
		return item;
	}

	addFragment(block, useBlockXOffset, useBlockYOffset, dontUpdateContextPosition) {
		let ctx = this.context();
		let page = ctx.getCurrentPage();

		if (!useBlockXOffset && block.height > ctx.availableHeight) {
			return false;
		}

		block.items.forEach(item => {
			switch (item.type) {
				case 'line':
					var l = item.item.clone();

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
				case 'beginClip':
				case 'endClip':
				case 'beginVerticalAlignment':
				case 'endVerticalAlignment':
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
	}

	/**
	 * Pushes the provided context onto the stack or creates a new one
	 *
	 * pushContext(context) - pushes the provided context and makes it current
	 * pushContext(width, height) - creates and pushes a new context with the specified width and height
	 * pushContext() - creates a new context for unbreakable blocks (with current availableWidth and full-page-height)
	 *
	 * @param {DocumentContext|number} contextOrWidth
	 * @param {number} height
	 */
	pushContext(contextOrWidth, height) {
		if (contextOrWidth === undefined) {
			height = this.context().getCurrentPage().height - this.context().pageMargins.top - this.context().pageMargins.bottom;
			contextOrWidth = this.context().availableWidth;
		}

		if (isNumber(contextOrWidth)) {
			let width = contextOrWidth;
			contextOrWidth = new DocumentContext();
			contextOrWidth.addPage({ width: width, height: height }, { left: 0, right: 0, top: 0, bottom: 0 });
		}

		this.contextStack.push(this.context());
		this._context = contextOrWidth;
	}

	popContext() {
		this._context = this.contextStack.pop();
	}

	getCurrentPositionOnPage() {
		return (this.contextStack[0] || this.context()).getCurrentPosition();
	}
}

function addPageItem(page, item, index) {
	if (index === null || index === undefined || index < 0 || index > page.items.length) {
		page.items.push(item);
	} else {
		page.items.splice(index, 0, item);
	}
}

export default ElementWriter;
