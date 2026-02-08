"use strict";

exports.__esModule = true;
exports.applyRTLToNode = applyRTLToNode;
exports.containsRTL = containsRTL;
exports.fixArabicTextUsingReplace = fixArabicTextUsingReplace;
exports.getTextDirection = getTextDirection;
exports.isArabicChar = isArabicChar;
exports.isLTRChar = isLTRChar;
exports.isPersianChar = isPersianChar;
exports.isRTLChar = isRTLChar;
exports.isUrduChar = isUrduChar;
exports.processRTLElement = processRTLElement;
exports.processRTLList = processRTLList;
exports.processRTLTable = processRTLTable;
/**
 * RTL (Right-to-Left) utilities for handling Arabic, Persian (Farsi), and Urdu languages
 * Production-ready module for pdfmake RTL support
 */

// Unicode ranges for Arabic script (includes Persian and Urdu characters)
const ARABIC_RANGE = [[0x0600, 0x06FF],
// Arabic block
[0x0750, 0x077F],
// Arabic Supplement
[0x08A0, 0x08FF],
// Arabic Extended-A
[0xFB50, 0xFDFF],
// Arabic Presentation Forms-A
[0xFE70, 0xFEFF] // Arabic Presentation Forms-B
];

// Unicode ranges for Persian (Farsi) specific characters
const PERSIAN_RANGE = [[0x06A9, 0x06AF],
// Persian Kaf, Gaf
[0x06C0, 0x06C3],
// Persian Heh, Teh Marbuta variants
[0x06CC, 0x06CE],
// Persian Yeh variants
[0x06D0, 0x06D5],
// Persian Yeh Barree, Arabic-Indic digits
[0x200C, 0x200D] // Zero Width Non-Joiner, Zero Width Joiner (used in Persian)
];

// Unicode ranges for Urdu specific characters
const URDU_RANGE = [[0x0679, 0x0679],
// Urdu Tteh
[0x067E, 0x067E],
// Urdu Peh
[0x0686, 0x0686],
// Urdu Tcheh
[0x0688, 0x0688],
// Urdu Ddal
[0x0691, 0x0691],
// Urdu Rreh
[0x0698, 0x0698],
// Urdu Jeh
[0x06A9, 0x06A9],
// Urdu Keheh
[0x06AF, 0x06AF],
// Urdu Gaf
[0x06BA, 0x06BA],
// Urdu Noon Ghunna
[0x06BE, 0x06BE],
// Urdu Heh Doachashmee
[0x06C1, 0x06C1],
// Urdu Heh Goal
[0x06D2, 0x06D2],
// Urdu Yeh Barree
[0x06D3, 0x06D3] // Urdu Yeh Barree with Hamza
];

// Strong RTL characters (Arabic, Persian, Urdu)
const RTL_CHARS = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u200C-\u200D]/;

// Strong LTR characters (Latin, etc.)
const LTR_CHARS = /[A-Za-z\u00C0-\u024F\u1E00-\u1EFF]/;

/**
 * Check if a character is in Arabic script (includes Persian and Urdu)
 * @param {string} char - Single character to check
 * @returns {boolean} - True if character is Arabic/Persian/Urdu
 */
function isArabicChar(char) {
  const code = char.charCodeAt(0);
  return ARABIC_RANGE.some(range => code >= range[0] && code <= range[1]);
}

/**
 * Check if a character is in Persian (Farsi) script
 * @param {string} char - Single character to check
 * @returns {boolean} - True if character is Persian
 */
function isPersianChar(char) {
  const code = char.charCodeAt(0);
  return PERSIAN_RANGE.some(range => code >= range[0] && code <= range[1]) || isArabicChar(char);
}

/**
 * Check if a character is in Urdu script
 * @param {string} char - Single character to check
 * @returns {boolean} - True if character is Urdu
 */
function isUrduChar(char) {
  const code = char.charCodeAt(0);
  return URDU_RANGE.some(range => code >= range[0] && code <= range[1]) || isArabicChar(char);
}

/**
 * Check if a character requires RTL rendering
 * @param {string} char - Single character to check
 * @returns {boolean} - True if character requires RTL
 */
function isRTLChar(char) {
  return RTL_CHARS.test(char);
}

/**
 * Check if a character is strongly LTR
 * @param {string} char - Single character to check
 * @returns {boolean} - True if character is strongly LTR
 */
function isLTRChar(char) {
  return LTR_CHARS.test(char);
}

/**
 * Check if text contains any RTL characters
 * @param {string} text - Text to check
 * @returns {boolean} - True if text contains RTL characters
 */
function containsRTL(text) {
  if (!text || typeof text !== 'string') {
    return false;
  }
  return RTL_CHARS.test(text);
}

/**
 * Determine the predominant text direction of a string
 * @param {string} text - Text to analyze
 * @returns {string} - 'rtl', 'ltr', or 'neutral'
 */
function getTextDirection(text) {
  if (!text || typeof text !== 'string') {
    return 'neutral';
  }
  let rtlCount = 0;
  let ltrCount = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i);
    if (isRTLChar(char)) {
      rtlCount++;
    } else if (isLTRChar(char)) {
      ltrCount++;
    }
  }

  // If we have any strong directional characters
  if (rtlCount > 0 || ltrCount > 0) {
    if (rtlCount > ltrCount) {
      return 'rtl';
    } else if (ltrCount > rtlCount) {
      return 'ltr';
    } else {
      // Equal counts - slight preference for RTL if both exist
      return rtlCount > 0 ? 'rtl' : 'ltr';
    }
  }
  return 'neutral';
}

/**
 * Fix bracket directionality for RTL text
 * Only mirrors brackets that are in RTL context (adjacent to RTL characters)
 * Brackets next to numbers or LTR text are preserved (e.g. "1)" stays as "1)")
 * @param {string} text - Text to process
 * @returns {string} - Text with contextually mirrored brackets
 */
function fixArabicTextUsingReplace(text) {
  if (!text || typeof text !== 'string') {
    return text;
  }

  // Remove leading dot if present
  if (text.startsWith('.')) {
    text = text.slice(1);
  }
  const DIGIT_OR_LTR = /[0-9A-Za-z\u00C0-\u024F\u1E00-\u1EFF]/;
  const mirrorMap = {
    '(': ')',
    ')': '(',
    '[': ']',
    ']': '[',
    '{': '}',
    '}': '{',
    '<': '>',
    '>': '<'
  };
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (mirrorMap[ch] !== undefined) {
      // Find the previous non-space character
      let prevChar = null;
      for (let j = i - 1; j >= 0; j--) {
        if (text[j] !== ' ') {
          prevChar = text[j];
          break;
        }
      }
      // Find the next non-space character
      let nextChar = null;
      for (let j = i + 1; j < text.length; j++) {
        if (text[j] !== ' ') {
          nextChar = text[j];
          break;
        }
      }

      // If previous char is a digit or LTR letter, bracket belongs to it — don't mirror
      // e.g. "1)" or "a)" — the bracket is part of numbering
      if (prevChar && DIGIT_OR_LTR.test(prevChar)) {
        result += ch;
      }
      // If next char is a digit or LTR letter and no RTL before, don't mirror
      // e.g. "(Hello"
      else if (!prevChar && nextChar && DIGIT_OR_LTR.test(nextChar)) {
        result += ch;
      }
      // Otherwise mirror — bracket is in RTL context
      else {
        result += mirrorMap[ch];
      }
    } else {
      result += ch;
    }
  }
  return result;
}

/**
 * Apply RTL properties to a node
 * @param {object} node - Document node
 * @param {boolean} forceRTL - Force RTL regardless of content
 * @returns {object} - Node with RTL properties applied
 */
function applyRTLToNode(node, forceRTL = false) {
  if (!node || typeof node !== 'object') {
    return node;
  }

  // Determine if node should be RTL
  let shouldBeRTL = forceRTL;
  if (!forceRTL && node.text) {
    const textStr = typeof node.text === 'string' ? node.text : Array.isArray(node.text) ? node.text.join('') : '';
    shouldBeRTL = getTextDirection(textStr) === 'rtl';
  }
  if (shouldBeRTL) {
    // Set structural RTL properties (alignment, font)
    // Text shaping (bracket mirroring) is handled at render time in ElementWriter
    if (!node.alignment) {
      node.alignment = 'right';
    }
    if (node.font === undefined && !node.font) {
      node.font = 'Cairo'; // Default RTL font
    }
  }
  return node;
}

/**
 * Process table for RTL layout
 * @param {object} tableNode - Table definition object
 * @param {boolean} forceRTL - Force RTL layout
 * @returns {object} - Processed table node
 */
function processRTLTable(tableNode, forceRTL = false) {
  if (!tableNode || !tableNode.table || !tableNode.table.body) {
    return tableNode;
  }

  // Determine if table should be RTL
  let shouldBeRTL = forceRTL;
  if (!forceRTL) {
    // Auto-detect based on content
    let rtlCellCount = 0;
    let totalCells = 0;
    tableNode.table.body.forEach(row => {
      if (Array.isArray(row)) {
        row.forEach(cell => {
          totalCells++;
          const cellText = typeof cell === 'string' ? cell : cell && cell.text ? typeof cell.text === 'string' ? cell.text : String(cell.text) : '';
          if (containsRTL(cellText)) {
            rtlCellCount++;
          }
        });
      }
    });

    // If more than 30% of cells contain RTL content, treat as RTL table
    shouldBeRTL = totalCells > 0 && rtlCellCount / totalCells >= 0.3;
  }
  if (shouldBeRTL) {
    // Reverse table columns for RTL layout
    tableNode.table.body = tableNode.table.body.map(row => {
      if (Array.isArray(row)) {
        return row.slice().reverse();
      }
      return row;
    });

    // Reverse widths if defined
    if (tableNode.table.widths && Array.isArray(tableNode.table.widths)) {
      tableNode.table.widths = tableNode.table.widths.slice().reverse();
    }

    // Apply RTL properties to cells (skip empty span placeholders)
    tableNode.table.body = tableNode.table.body.map(row => {
      if (Array.isArray(row)) {
        return row.map(cell => {
          // Convert string cells to objects so we can set font
          if (typeof cell === 'string') {
            return {
              text: cell,
              alignment: 'right',
              font: 'Cairo'
            };
          }
          // Skip null/undefined
          if (!cell || typeof cell !== 'object') return cell;
          // Skip empty span placeholders {} — they must stay empty for colSpan/rowSpan
          if (Object.keys(cell).length === 0) return cell;
          // Skip cells that are only span markers (e.g. {_span: true})
          if (cell._span) return cell;
          return applyRTLToNode(cell, true);
        });
      }
      return row;
    });
  }
  return tableNode;
}

/**
 * Process list items for RTL support
 * @param {Array} listItems - ul/ol content
 * @param {boolean} forceRTL - Force RTL layout
 * @returns {Array} - Processed list
 */
function processRTLList(listItems, forceRTL = false) {
  if (!listItems || !Array.isArray(listItems)) {
    return listItems;
  }
  return listItems.map(item => {
    if (typeof item === 'string') {
      const shouldBeRTL = forceRTL || getTextDirection(item) === 'rtl';
      if (shouldBeRTL) {
        return {
          text: item,
          alignment: 'right',
          font: 'Cairo'
        };
      }
      return item;
    }
    if (typeof item === 'object') {
      const shouldBeRTL = forceRTL || item.text && getTextDirection(String(item.text)) === 'rtl';
      if (shouldBeRTL) {
        item = applyRTLToNode(item, true);
      }

      // Process nested lists recursively
      if (item.ul) {
        item.ul = processRTLList(item.ul, forceRTL);
      }
      if (item.ol) {
        item.ol = processRTLList(item.ol, forceRTL);
      }
    }
    return item;
  });
}

/**
 * Process document element for RTL support
 * @param {any} element - Document element
 * @param {boolean} forceRTL - Force RTL layout
 * @returns {any} - Processed element
 */
function processRTLElement(element, forceRTL = false) {
  if (!element) {
    return element;
  }

  // Handle arrays
  if (Array.isArray(element)) {
    return element.map(item => processRTLElement(item, forceRTL));
  }

  // Handle strings
  if (typeof element === 'string') {
    const shouldBeRTL = forceRTL || getTextDirection(element) === 'rtl';
    if (shouldBeRTL) {
      return {
        text: element,
        alignment: 'right',
        font: 'Cairo'
      };
    }
    return element;
  }

  // Handle objects
  if (typeof element === 'object') {
    // Check for explicit rtl property
    const elementForceRTL = element.rtl === true || forceRTL;

    // Process text nodes
    if (element.text !== undefined) {
      element = applyRTLToNode(element, elementForceRTL);
    }

    // Process tables
    if (element.table) {
      element = processRTLTable(element, elementForceRTL);
    }

    // Process lists
    if (element.ul) {
      element.ul = processRTLList(element.ul, elementForceRTL);
    }
    if (element.ol) {
      element.ol = processRTLList(element.ol, elementForceRTL);
    }

    // Process columns
    if (element.columns && Array.isArray(element.columns)) {
      element.columns = element.columns.map(col => processRTLElement(col, elementForceRTL));
    }

    // Process stack
    if (element.stack && Array.isArray(element.stack)) {
      element.stack = element.stack.map(item => processRTLElement(item, elementForceRTL));
    }
  }
  return element;
}