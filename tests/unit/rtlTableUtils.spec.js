const assert = require('assert');
const rtlUtils = require('../../src/rtlUtils');

describe('RTL Table Auto Processing', function () {

	describe('reverseTableRow', function () {
		it('should reverse table row array', function () {
			var row = ['col1', 'col2', 'col3'];
			var reversed = rtlUtils.reverseTableRow(row);
			assert.deepEqual(reversed, ['col3', 'col2', 'col1']);
		});

		it('should handle non-array input', function () {
			assert.equal(rtlUtils.reverseTableRow('not an array'), 'not an array');
			assert.equal(rtlUtils.reverseTableRow(null), null);
		});

		it('should not modify original array', function () {
			var originalRow = ['col1', 'col2', 'col3'];
			var row = originalRow.slice(); // copy
			var reversed = rtlUtils.reverseTableRow(row);
			assert.deepEqual(originalRow, ['col1', 'col2', 'col3']); // original unchanged
			assert.deepEqual(reversed, ['col3', 'col2', 'col1']);
		});
	});

	describe('processRTLTable', function () {
		it('should reverse table body rows when supportRTL is true', function () {
			var tableNode = {
				supportRTL: true,
				table: {
					body: [
						['Header 1', 'Header 2', 'مرحبا'],
						['Cell 1', 'Cell 2', 'خلية']
					],
					widths: ['30%', '40%', '30%']
				}
			};

			var result = rtlUtils.processRTLTable(tableNode);
			
			// Check that rows are reversed
			assert.equal(result.table.body[0][0].text, 'مرحبا');
			assert.equal(result.table.body[0][0].supportRTL, true); // RTL text should have supportRTL
			assert.equal(result.table.body[0][1].text, 'Header 2');
			assert.equal(result.table.body[0][1].supportRTL, undefined); // Non-RTL text should not have supportRTL
			assert.equal(result.table.body[0][2].text, 'Header 1');
			
			// Check that widths are reversed
			assert.deepEqual(result.table.widths, ['30%', '40%', '30%']);
		});

		it('should not process table when supportRTL is false', function () {
			var tableNode = {
				supportRTL: false,
				table: {
					body: [
						['Header 1', 'Header 2', 'Header 3'],
						['Cell 1', 'Cell 2', 'Cell 3']
					]
				}
			};

			var result = rtlUtils.processRTLTable(tableNode);
			
			// Should remain unchanged
			assert.deepEqual(result.table.body[0], ['Header 1', 'Header 2', 'Header 3']);
			assert.deepEqual(result.table.body[1], ['Cell 1', 'Cell 2', 'Cell 3']);
		});

		it('should handle missing table properties gracefully', function () {
			var tableNode1 = { supportRTL: true };
			var tableNode2 = { supportRTL: true, table: {} };
			var tableNode3 = null;

			assert.equal(rtlUtils.processRTLTable(tableNode1), tableNode1);
			assert.equal(rtlUtils.processRTLTable(tableNode2), tableNode2);
			assert.equal(rtlUtils.processRTLTable(tableNode3), tableNode3);
		});

		it('should reverse widths array if present', function () {
			var tableNode = {
				supportRTL: true,
				table: {
					body: [['A', 'B', 'C']],
					widths: [100, 200, 150]
				}
			};

			var result = rtlUtils.processRTLTable(tableNode);
			assert.deepEqual(result.table.widths, [150, 200, 100]);
		});

		it('should work with complex cell objects', function () {
			var tableNode = {
				supportRTL: true,
				table: {
					body: [
						[
							{ text: 'Cell 1', style: 'header' },
							{ text: 'Cell 2', style: 'header' },
							{ text: 'مرحبا', style: 'header' }
						]
					]
				}
			};

			var result = rtlUtils.processRTLTable(tableNode);
			assert.equal(result.table.body[0][0].text, 'مرحبا');
			assert.equal(result.table.body[0][0].supportRTL, true); // RTL text should have supportRTL
			assert.equal(result.table.body[0][1].text, 'Cell 2');
			assert.equal(result.table.body[0][1].supportRTL, undefined); // Non-RTL should not have supportRTL
			assert.equal(result.table.body[0][2].text, 'Cell 1');
		});

		it('should apply supportRTL intelligently based on text content', function () {
			var tableNode = {
				supportRTL: true,
				table: {
					body: [
						['English', 'مرحبا', 'Hello مرحبا', '123']
					]
				}
			};

			var result = rtlUtils.processRTLTable(tableNode);
			// After reversal: ['123', 'Hello مرحبا', 'مرحبا', 'English']
			assert.equal(result.table.body[0][0].text, '123');
			assert.equal(result.table.body[0][0].supportRTL, undefined); // Numbers - no supportRTL
			
			assert.equal(result.table.body[0][1].text, 'Hello مرحبا');
			assert.equal(result.table.body[0][1].supportRTL, true); // Mixed with RTL - has supportRTL
			
			assert.equal(result.table.body[0][2].text, 'مرحبا');
			assert.equal(result.table.body[0][2].supportRTL, true); // Pure RTL - has supportRTL
			
			assert.equal(result.table.body[0][3].text, 'English');
			assert.equal(result.table.body[0][3].supportRTL, undefined); // Pure LTR - no supportRTL
		});
	});

});
