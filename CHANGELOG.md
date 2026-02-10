# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.2] - 2026-02-10

### Added

- RTL table grid right-alignment: tables with `rtl: true` or auto-detected RTL now draw borders and grid lines starting from the right side of the page
- Internal `_rtl` flag on table nodes for the drawing phase (`TableProcessor` / `LayoutBuilder`)
- New RTL table example in `examples/tables-rtl.js` demonstrating right-aligned grid

### Changed

- Package renamed from `pdfmake-rtl` to `@digicole/pdfmake-rtl` (scoped npm package)

### Fixed

- Fixed RTL tables with `widths: ['auto', …]` rendering their grid/borders flush-left instead of flush-right
- `TableProcessor.beginTable()` now shifts `rowSpanData` positions right by the unused space for RTL tables
- `LayoutBuilder.processRow()` now shifts `context.x` right so cell content aligns with the right-aligned grid

---

## [2.1.1] - 2026-02-10

### Added

- Browser example `examples/simple-rtl-table.html` for quick RTL testing in the browser
- README quick-start sections for Node.js and browser usage

### Fixed

- Complete rewrite of `adjustRTLInlines()` with proper bidi-like run-based reordering (7-step algorithm) for correct punctuation placement in mixed RTL/LTR text
- Stack-based balanced bracket pair detection with UBA Rule L4 mirroring for parentheses in RTL context
- Brackets adjacent to numbers or LTR text are now preserved correctly (e.g. `1)` stays as `1)`)

---

## [2.1.0] - 2026-02-08

### Added

- Major version upgrade with significant architectural improvements
- Full rewrite of RTL processing pipeline for better performance and reliability
- Support for RTL list tables with proper right-to-left rendering
- RTL-aware ordered and unordered list handling within table cells

### Improved

- Overall RTL text rendering quality and consistency
- Performance optimizations for large documents with mixed LTR/RTL content

### Fixed

- Fixed mixed character rendering issues with combined LTR/RTL scripts
- Fixed mixed language text handling for Arabic, Persian, Urdu alongside Latin characters
- Corrected bidirectional text reordering in mixed-language paragraphs

### Breaking Changes

- Major version bump; review migration guide for upgrading from v1.x

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
