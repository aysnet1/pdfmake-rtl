'use strict';

var assert = require('assert');
var rtlUtils = require('../src/rtlUtils');

describe('rtlUtils.reverseTableRowPreserveSpans', function () {
	it('should reverse a row with colSpan groups and keep span starts on the correct side', function () {
		// Original row (LTR):
		// [ rowSpan(2), colSpan(2) start, placeholder, colSpan(2) start, placeholder ]
		var startA = { text: 'المعلومات الشخصية', colSpan: 2 };
		var startB = { text: 'التفاصيل الأكاديمية', colSpan: 2 };
		var row = [
			{ text: 'رقم', rowSpan: 2 },
			startA,
			{},
			startB,
			{}
		];

		var reversed = rtlUtils.reverseTableRowPreserveSpans(row);

		// Expected RTL row after simple reversal:
		// [ placeholder, startB, placeholder, startA, rowSpan cell ]
		assert.strictEqual(reversed.length, 5);
		assert.deepStrictEqual(reversed[0], {}); // last placeholder
		assert.strictEqual(reversed[1], startB); // second colSpan start
		assert.deepStrictEqual(reversed[2], {}); // second placeholder
		assert.strictEqual(reversed[3], startA); // first colSpan start
		assert.strictEqual(reversed[4].rowSpan, 2); // rowSpan cell
	});

	it('should mirror a simple row without spans', function () {
		var row = ['1', 'أحمد', 'بن سالم', 'ثانوي', '15.2'];
		var reversed = rtlUtils.reverseTableRowPreserveSpans(row);
		assert.deepStrictEqual(reversed, row.slice().reverse());
	});
});
