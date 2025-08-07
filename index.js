/**
 * PDFMake RTL - Enhanced PDFMake with automatic RTL support
 * 
 * Supports Arabic, Persian (Farsi), and Urdu languages with automatic
 * text direction detection and table column reversal.
 * 
 * Main entry point for the package
 */

'use strict';

// Export the main PdfPrinter class (same as PDFMake)
const PdfPrinter = require('./src/printer');

// Export RTL utilities for advanced usage
const RTLUtils = require('./src/rtlUtils');

// Export as default (CommonJS)
module.exports = PdfPrinter;

// Export utilities as named exports
module.exports.RTLUtils = RTLUtils;
module.exports.PdfPrinter = PdfPrinter;

// For ES6 imports compatibility
module.exports.default = PdfPrinter;
