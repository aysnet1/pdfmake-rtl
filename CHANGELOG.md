# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.6] - 2025-08-08

### Added
- Enhanced RTL table handling with improved column reversal for Arabic, Persian, and Urdu text
- New `reverseTableRowPreserveSpans` function to handle complex table structures with colSpan and rowSpan
- Automatic RTL detection and processing for tables containing RTL content
- Support for preserving table header structure in RTL layouts
- Comprehensive test examples for RTL table scenarios

### Improved
- Auto-RTL detection logic now respects explicit `supportRTL: false` setting
- Better handling of nested table headers with mixed span attributes
- Enhanced RTL text processing with proper bidirectional text support
- Improved column reversal algorithm that preserves span relationships

### Fixed
- Fixed RTL table header positioning issues with colSpan and rowSpan elements
- Resolved auto-RTL detection overriding explicit RTL settings
- Fixed column ordering in complex nested header structures
- Corrected span placeholder handling in RTL table reversal

### Technical Details
- Added `processAutoRTLTable` function for intelligent RTL detection
- Enhanced `rtlUtils.js` with span-aware reversal algorithms
- Improved error handling for empty object placeholders in span structures
- Added comprehensive unit tests for RTL table functionality

### Examples Added
- `examples/rtl-nested-header.js` - Demonstrates complex RTL table with nested headers
- `examples/test-simple-rtl-table.js` - Basic RTL table functionality test
- `examples/test-no-spans-rtl-table.js` - RTL table without span elements

### Breaking Changes
- None. All changes are backward compatible.

### Notes
- RTL detection threshold set to 30% RTL content for automatic table reversal
- Headers with span structures are preserved to maintain layout integrity
- Cell-level RTL text rendering (`bidi: true`) applied automatically for RTL content

---

## Previous Versions

This is the first tracked version of the changelog. For earlier changes, please refer to the git commit history.
