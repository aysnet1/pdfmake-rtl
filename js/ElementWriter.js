"use strict";

exports.__esModule = true;
exports.default = void 0;
var _variableType = require("./helpers/variableType");
var _tools = require("./helpers/tools");
var _DocumentContext = _interopRequireDefault(require("./DocumentContext"));
var _events = require("events");
var _rtlUtils = require("./rtlUtils");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * A line/vector writer, which adds elements to current page and sets
 * their positions based on the context
 */
class ElementWriter extends _events.EventEmitter {
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
    if (alignment === 'justify' && !line.newLineForced && !line.lastLineInParagraph && line.inlines.length > 1) {
      let additionalSpacing = (width - lineWidth) / (line.inlines.length - 1);
      for (let i = 1, l = line.inlines.length; i < l; i++) {
        offset = i * additionalSpacing;
        line.inlines[i].x += offset;
        line.inlines[i].justifyShift = additionalSpacing;
      }
    }
  }

  /**
   * Adjust RTL inline positioning - reorder inlines for proper visual display
   * @param {object} line - Line containing RTL text
   * @param {number} availableWidth - Available width for the line
   */
  adjustRTLInlines(line, availableWidth) {
    if (!line.inlines || line.inlines.length === 0) {
      return;
    }
    let rtlInlines = [];
    let ltrInlines = [];

    // Separate RTL, LTR, and neutral inlines using Sticky Direction
    const LTR_REGEX = /[A-Za-z\u00C0-\u024F\u1E00-\u1EFF]/;
    let currentDir = 'rtl'; // Default to RTL since this is an RTL line

    line.inlines.forEach(inline => {
      let hasStrongLTR = LTR_REGEX.test(inline.text);
      let hasStrongRTL = (0, _rtlUtils.containsRTL)(inline.text);
      if (hasStrongLTR && !hasStrongRTL) {
        currentDir = 'ltr';
        ltrInlines.push(inline);
      } else if (hasStrongRTL && !hasStrongLTR) {
        currentDir = 'rtl';
        rtlInlines.push(inline);
      } else if (hasStrongLTR && hasStrongRTL) {
        currentDir = 'rtl';
        rtlInlines.push(inline);
      } else {
        // Neutral - adopt direction of preceding content
        if (currentDir === 'ltr') {
          ltrInlines.push(inline);
        } else {
          rtlInlines.push(inline);
        }
      }
    });
    if (rtlInlines.length > 0) {
      // Reverse RTL inlines for proper visual order
      rtlInlines = reverseWords(rtlInlines);
      let currentX = 0;
      let reorderedInlines = [];

      // Add LTR inlines first
      ltrInlines.forEach(inline => {
        inline.x = currentX;
        currentX += inline.width;
        reorderedInlines.push(inline);
      });

      // Add RTL inlines with bracket mirroring
      const NUMBER_PUNCTUATION_REGEX = /^(\d+)([.:\/\-)(]+)(\s*)$/;
      rtlInlines.forEach(inline => {
        // Apply context-aware bracket mirroring for inlines with RTL characters
        if ((0, _rtlUtils.containsRTL)(inline.text)) {
          inline.text = (0, _rtlUtils.fixArabicTextUsingReplace)(inline.text);
        }

        // Fix number+punctuation rendering in RTL
        if (NUMBER_PUNCTUATION_REGEX.test(inline.text)) {
          inline.text = inline.text.replace(NUMBER_PUNCTUATION_REGEX, ' $3$2$1');
        }
        inline.x = currentX;
        currentX += inline.width;
        reorderedInlines.push(inline);
      });
      line.inlines = reorderedInlines;
    }
  }
  addImage(image, index) {
    let context = this.context();
    let page = context.getCurrentPage();
    let position = this.getCurrentPositionOnPage();
    if (!page || image.absolutePosition === undefined && context.availableHeight < image._height && page.items.length > 0) {
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
    if (!page || node.absolutePosition === undefined && context.availableHeight < height) {
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
    if (!page || image.absolutePosition === undefined && context.availableHeight < image._height && page.items.length > 0) {
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
    if (!page || qr.absolutePosition === undefined && context.availableHeight < qr._height) {
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
    if (!page || attachment.absolutePosition === undefined && context.availableHeight < attachment._height && page.items.length > 0) {
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
        (0, _tools.offsetVector)(vector, offset, 0);
      });
    }
  }
  addVector(vector, ignoreContextX, ignoreContextY, index, forcePage) {
    let context = this.context();
    let page = context.getCurrentPage();
    if ((0, _variableType.isNumber)(forcePage)) {
      page = context.pages[forcePage];
    }
    let position = this.getCurrentPositionOnPage();
    if (page) {
      (0, _tools.offsetVector)(vector, ignoreContextX ? 0 : context.x, ignoreContextY ? 0 : context.y);
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
      item: {
        x: ctx.x,
        y: ctx.y,
        width: width,
        height: height
      }
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
      item: {
        verticalAlignment: verticalAlignment
      }
    };
    page.items.push(item);
    return item;
  }
  endVerticalAlignment(verticalAlignment) {
    let page = this.context().getCurrentPage();
    let item = {
      type: 'endVerticalAlignment',
      item: {
        verticalAlignment: verticalAlignment
      }
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
          l.x = (l.x || 0) + (useBlockXOffset ? block.xOffset || 0 : ctx.x);
          l.y = (l.y || 0) + (useBlockYOffset ? block.yOffset || 0 : ctx.y);
          page.items.push({
            type: 'line',
            item: l
          });
          break;
        case 'vector':
          var v = (0, _tools.pack)(item.item);
          (0, _tools.offsetVector)(v, useBlockXOffset ? block.xOffset || 0 : ctx.x, useBlockYOffset ? block.yOffset || 0 : ctx.y);
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
          var img = (0, _tools.pack)(item.item);
          img.x = (img.x || 0) + (useBlockXOffset ? block.xOffset || 0 : ctx.x);
          img.y = (img.y || 0) + (useBlockYOffset ? block.yOffset || 0 : ctx.y);
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
    if ((0, _variableType.isNumber)(contextOrWidth)) {
      let width = contextOrWidth;
      contextOrWidth = new _DocumentContext.default();
      contextOrWidth.addPage({
        width: width,
        height: height
      }, {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      });
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

/**
 * Reverse word order for RTL display, keeping bracketed groups together
 */
function reverseWords(words) {
  let reversed = [];
  let i = words.length - 1;
  const bracketPairs = {
    '>': '<',
    ']': '[',
    '}': '{'
  };
  while (i >= 0) {
    const word = words[i];
    const closingBracket = word.text.match(/[>\])}]/);
    let wordHasRtl = true;
    if (word && typeof word.text === 'string') {
      wordHasRtl = (0, _rtlUtils.containsRTL)(word.text);
    }
    if (!wordHasRtl && closingBracket) {
      const openingBracket = bracketPairs[closingBracket[0]];
      const group = [word];
      let openFound = false;
      if (!word.text.includes(openingBracket)) {
        for (let j = i - 1; j >= 0; j--) {
          group.unshift(words[j]);
          if (words[j].text.match(/[<\[({]/)) {
            openFound = true;
            i = j - 1;
            break;
          }
        }
      }
      reversed.push(...group);
      if (!openFound) i--;
      continue;
    }
    reversed.push(word);
    i--;
  }
  return reversed;
}
var _default = exports.default = ElementWriter;