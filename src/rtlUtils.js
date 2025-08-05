'use strict';

/**
 * RTL (Right-to-Left) utilities for handling Arabic and other RTL languages
 */

// Unicode ranges for Arabic script
var ARABIC_RANGE = [
	[0x0600, 0x06FF], // Arabic block
	[0x0750, 0x077F], // Arabic Supplement
	[0x08A0, 0x08FF], // Arabic Extended-A
	[0xFB50, 0xFDFF], // Arabic Presentation Forms-A
	[0xFE70, 0xFEFF]  // Arabic Presentation Forms-B
];

// Unicode ranges for Hebrew script
var HEBREW_RANGE = [
	[0x0590, 0x05FF], // Hebrew block
	[0xFB1D, 0xFB4F]  // Hebrew Presentation Forms
];

// Strong RTL characters (Arabic, Hebrew, etc.)
var RTL_CHARS = /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB1D-\uFB4F\uFB50-\uFDFF\uFE70-\uFEFF]/;

// Strong LTR characters (Latin, etc.)
var LTR_CHARS = /[A-Za-z\u00C0-\u024F\u1E00-\u1EFF]/;

/**
 * Check if a character is in Arabic script
 * @param {string} char - Single character to check
 * @return {boolean} - True if character is Arabic
 */
function isArabicChar(char) {
	var code = char.charCodeAt(0);
	return ARABIC_RANGE.some(function(range) {
		return code >= range[0] && code <= range[1];
	});
}

/**
 * Check if a character is in Hebrew script
 * @param {string} char - Single character to check
 * @return {boolean} - True if character is Hebrew
 */
function isHebrewChar(char) {
	var code = char.charCodeAt(0);
	return HEBREW_RANGE.some(function(range) {
		return code >= range[0] && code <= range[1];
	});
}

/**
 * Check if a character requires RTL rendering
 * @param {string} char - Single character to check
 * @return {boolean} - True if character requires RTL
 */
function isRTLChar(char) {
	return RTL_CHARS.test(char);
}

/**
 * Check if a character is strongly LTR
 * @param {string} char - Single character to check
 * @return {boolean} - True if character is strongly LTR
 */
function isLTRChar(char) {
	return LTR_CHARS.test(char);
}

/**
 * Determine the predominant text direction of a string
 * @param {string} text - Text to analyze
 * @return {string} - 'rtl', 'ltr', or 'neutral'
 */
function getTextDirection(text) {
	if (!text || typeof text !== 'string') {
		return 'neutral';
	}

	var rtlCount = 0;
	var ltrCount = 0;

	for (var i = 0; i < text.length; i++) {
		var char = text.charAt(i);
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
 * Check if text contains any RTL characters
 * @param {string} text - Text to check
 * @return {boolean} - True if text contains RTL characters
 */
function containsRTL(text) {
	if (!text || typeof text !== 'string') {
		return false;
	}
	return RTL_CHARS.test(text);
}

/**
 * Check if text is primarily Arabic
 * @param {string} text - Text to check
 * @return {boolean} - True if text is primarily Arabic
 */
function isArabicText(text) {
	if (!text || typeof text !== 'string') {
		return false;
	}

	var arabicCount = 0;
	var totalStrongChars = 0;

	for (var i = 0; i < text.length; i++) {
		var char = text.charAt(i);
		if (isArabicChar(char)) {
			arabicCount++;
			totalStrongChars++;
		} else if (isRTLChar(char) || isLTRChar(char)) {
			totalStrongChars++;
		}
	}

	// If we have any strong characters and Arabic represents at least 30% 
	// (lowered threshold for mixed text)
	return totalStrongChars > 0 && (arabicCount / totalStrongChars) >= 0.3;
}

/**
 * Reverse the order of words in a line for RTL display
 * This is a simplified approach - for full BiDi support, 
 * a proper Unicode BiDi algorithm implementation would be needed
 * @param {string} text - Text to reverse
 * @return {string} - Reversed text
 */
function reverseRTLText(text) {
	if (!text || typeof text !== 'string') {
		return text;
	}

	// For Arabic text, we need to handle word-level reversal
	// This is a simplified implementation
	var words = text.split(/(\s+)/);
	var reversed = [];

	// Reverse the order of words, but keep spaces in their relative positions
	for (var i = words.length - 1; i >= 0; i--) {
		reversed.push(words[i]);
	}

	return reversed.join('');
}

/**
 * Apply RTL processing to text if needed
 * @param {string} text - Original text
 * @param {boolean} supportRTL - Whether RTL support is enabled
 * @param {string} direction - Explicit direction override ('rtl', 'ltr', or null)
 * @return {Object} - { text: processedText, isRTL: boolean }
 */
function processRTLText(text, supportRTL, direction) {
	if (!text || typeof text !== 'string' || !supportRTL) {
		return { text: text, isRTL: false };
	}

	var isRTL = false;

	if (direction === 'rtl') {
		isRTL = true;
	} else if (direction === 'ltr') {
		isRTL = false;
	} else {
		// Auto-detect direction
		var textDir = getTextDirection(text);
		isRTL = textDir === 'rtl';
	}

	var processedText = text;
	if (isRTL) {
		processedText = reverseRTLText(text);
	}

	return {
		text: processedText,
		isRTL: isRTL
	};
}

/**
 * Reverse table row cells for RTL layout
 * @param {Array} row - Table row array
 * @return {Array} - Reversed row array
 */
function reverseTableRow(row) {
	if (!Array.isArray(row)) {
		return row;
	}
	return row.slice().reverse();
}

/**
 * Process table for RTL layout if supportRTL is enabled
 * @param {Object} tableNode - Table definition object
 * @return {Object} - Processed table node
 */
function processRTLTable(tableNode) {
	if (!tableNode || !tableNode.supportRTL || !tableNode.table || !tableNode.table.body) {
		return tableNode;
	}

	// Don't clone the entire object - just modify the table data in place
	// Reverse each row in the table body for RTL layout
	tableNode.table.body = tableNode.table.body.map(function(row) {
		return reverseTableRow(row);
	});

	// Also reverse the widths array if it exists
	if (tableNode.table.widths && Array.isArray(tableNode.table.widths)) {
		tableNode.table.widths = tableNode.table.widths.slice().reverse();
	}

	return tableNode;
}

module.exports = {
	isArabicChar: isArabicChar,
	isHebrewChar: isHebrewChar,
	isRTLChar: isRTLChar,
	isLTRChar: isLTRChar,
	getTextDirection: getTextDirection,
	containsRTL: containsRTL,
	isArabicText: isArabicText,
	reverseRTLText: reverseRTLText,
	processRTLText: processRTLText,
	reverseTableRow: reverseTableRow,
	processRTLTable: processRTLTable
};
