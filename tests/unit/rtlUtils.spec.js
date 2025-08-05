const assert = require('assert');
const rtlUtils = require('../../src/rtlUtils');

describe('RTL Utils', function () {

	describe('isArabicChar', function () {
		it('should identify Arabic characters correctly', function () {
			assert.equal(rtlUtils.isArabicChar('أ'), true);
			assert.equal(rtlUtils.isArabicChar('ب'), true);
			assert.equal(rtlUtils.isArabicChar('ج'), true);
			assert.equal(rtlUtils.isArabicChar('A'), false);
			assert.equal(rtlUtils.isArabicChar('1'), false);
		});
	});

	describe('isHebrewChar', function () {
		it('should identify Hebrew characters correctly', function () {
			assert.equal(rtlUtils.isHebrewChar('א'), true);
			assert.equal(rtlUtils.isHebrewChar('ב'), true);
			assert.equal(rtlUtils.isHebrewChar('A'), false);
			assert.equal(rtlUtils.isHebrewChar('أ'), false);
		});
	});

	describe('isRTLChar', function () {
		it('should identify RTL characters correctly', function () {
			assert.equal(rtlUtils.isRTLChar('أ'), true);
			assert.equal(rtlUtils.isRTLChar('ب'), true);
			assert.equal(rtlUtils.isRTLChar('א'), true);
			assert.equal(rtlUtils.isRTLChar('A'), false);
			assert.equal(rtlUtils.isRTLChar('1'), false);
		});
	});

	describe('isLTRChar', function () {
		it('should identify LTR characters correctly', function () {
			assert.equal(rtlUtils.isLTRChar('A'), true);
			assert.equal(rtlUtils.isLTRChar('a'), true);
			assert.equal(rtlUtils.isLTRChar('أ'), false);
			assert.equal(rtlUtils.isLTRChar('1'), false);
		});
	});

	describe('getTextDirection', function () {
		it('should detect RTL text correctly', function () {
			assert.equal(rtlUtils.getTextDirection('مرحبا بكم'), 'rtl');
			assert.equal(rtlUtils.getTextDirection('שלום עליכם'), 'rtl');
		});

		it('should detect LTR text correctly', function () {
			assert.equal(rtlUtils.getTextDirection('Hello World'), 'ltr');
			assert.equal(rtlUtils.getTextDirection('Bonjour le monde'), 'ltr');
		});

		it('should handle mixed text', function () {
			// Arabic text should dominate
			assert.equal(rtlUtils.getTextDirection('مرحبا Hello'), 'rtl');
			// English text should dominate
			assert.equal(rtlUtils.getTextDirection('Hello مرحبا World'), 'ltr');
		});

		it('should handle neutral text', function () {
			assert.equal(rtlUtils.getTextDirection('123 456'), 'neutral');
			assert.equal(rtlUtils.getTextDirection(''), 'neutral');
			assert.equal(rtlUtils.getTextDirection(null), 'neutral');
		});
	});

	describe('containsRTL', function () {
		it('should detect presence of RTL characters', function () {
			assert.equal(rtlUtils.containsRTL('مرحبا'), true);
			assert.equal(rtlUtils.containsRTL('Hello مرحبا'), true);
			assert.equal(rtlUtils.containsRTL('Hello World'), false);
			assert.equal(rtlUtils.containsRTL('123'), false);
		});
	});

	describe('isArabicText', function () {
		it('should identify primarily Arabic text', function () {
			assert.equal(rtlUtils.isArabicText('مرحبا بكم في النظام'), true);
			assert.equal(rtlUtils.isArabicText('שלום עליכם'), false); // Hebrew, not Arabic
			assert.equal(rtlUtils.isArabicText('Hello World'), false);
		});

		it('should handle mixed Arabic text', function () {
			assert.equal(rtlUtils.isArabicText('مرحبا Hello'), true); // Arabic dominates
			assert.equal(rtlUtils.isArabicText('Hello مرحبا World Test'), false); // English dominates
		});
	});

	describe('reverseRTLText', function () {
		it('should reverse Arabic word order', function () {
			var original = 'مرحبا بكم في النظام';
			var reversed = rtlUtils.reverseRTLText(original);
			// The exact reversal depends on implementation, but it should be different
			assert.notEqual(reversed, original);
		});

		it('should handle empty or null text', function () {
			assert.equal(rtlUtils.reverseRTLText(''), '');
			assert.equal(rtlUtils.reverseRTLText(null), null);
			assert.equal(rtlUtils.reverseRTLText(undefined), undefined);
		});
	});

	describe('processRTLText', function () {
		it('should process RTL text when supportRTL is true', function () {
			var result = rtlUtils.processRTLText('مرحبا بكم', true);
			assert.equal(result.isRTL, true);
			assert.notEqual(result.text, 'مرحبا بكم'); // Should be processed
		});

		it('should not process text when supportRTL is false', function () {
			var result = rtlUtils.processRTLText('مرحبا بكم', false);
			assert.equal(result.isRTL, false);
			assert.equal(result.text, 'مرحبا بكم'); // Should remain unchanged
		});

		it('should respect explicit direction override', function () {
			var result = rtlUtils.processRTLText('Hello World', true, 'rtl');
			assert.equal(result.isRTL, true);
			
			result = rtlUtils.processRTLText('مرحبا بكم', true, 'ltr');
			assert.equal(result.isRTL, false);
		});

		it('should auto-detect direction when no explicit direction given', function () {
			var arabicResult = rtlUtils.processRTLText('مرحبا بكم', true);
			assert.equal(arabicResult.isRTL, true);
			
			var englishResult = rtlUtils.processRTLText('Hello World', true);
			assert.equal(englishResult.isRTL, false);
		});
	});

});
