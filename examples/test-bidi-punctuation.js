/*eslint no-unused-vars: ["error", {"args": "none"}]*/

var pdfmake = require('../js/index');

var Roboto = require('../fonts/Roboto');
pdfmake.addFonts(Roboto);

var Cairo = require('../fonts/Cairo');

pdfmake.addFonts(Cairo);

var dd = {
	defaultStyle: {
		font: 'Cairo',
		fontSize: 14,
	},
	content: [
		// ═══════════════════════════════════════════════════════════
		// TITLE
		// ═══════════════════════════════════════════════════════════
		{ text: 'اختبار الفاصل بين العربية واللاتينية', style: 'header', alignment: 'center' },
		{ text: 'Bidi Punctuation / Separator Test', style: 'subheader', alignment: 'center', font: 'Roboto' },
		{ text: '\n' },

		// ═══════════════════════════════════════════════════════════
		// TEST 1: Slash / between Arabic and English
		// ═══════════════════════════════════════════════════════════
		{ text: 'اختبار 1: علامة / بين العربية والإنجليزية', style: 'sectionHeader' },

		// The "/" should appear BETWEEN Arabic and English, not flipped to the left
		{ text: 'العربية/arabic', margin: [0, 5, 0, 2] },
		{ text: 'عربي/english/عربي', margin: [0, 2, 0, 2] },
		{ text: 'مرحبا/hello', margin: [0, 2, 0, 2] },
		{ text: 'بيانات/data', margin: [0, 2, 0, 2] },
		{ text: '\n' },

		// ═══════════════════════════════════════════════════════════
		// TEST 2: Dash - between Arabic and English
		// ═══════════════════════════════════════════════════════════
		{ text: 'اختبار 2: علامة - بين العربية والإنجليزية', style: 'sectionHeader' },

		{ text: 'العربية-arabic', margin: [0, 5, 0, 2] },
		{ text: 'مرحبا-hello-عالم', margin: [0, 2, 0, 2] },
		{ text: 'اسم-name', margin: [0, 2, 0, 2] },
		{ text: '\n' },

		// ═══════════════════════════════════════════════════════════
		// TEST 3: Parentheses () around mixed text
		// ═══════════════════════════════════════════════════════════
		{ text: 'اختبار 3: أقواس حول نص مختلط', style: 'sectionHeader' },

		{ text: 'العربية (test)', margin: [0, 5, 0, 2] },
		{ text: 'مرحبا (hello) عالم', margin: [0, 2, 0, 2] },
		{ text: '(عربي)', margin: [0, 2, 0, 2] },
		{ text: '( عربي )', margin: [0, 2, 0, 2] },
		{ text: 'الاسم (name) موجود', margin: [0, 2, 0, 2] },
		{ text: '\n' },

		// ═══════════════════════════════════════════════════════════
		// TEST 4: Colon : between Arabic and English
		// ═══════════════════════════════════════════════════════════
		{ text: 'اختبار 4: نقطتان بين العربية والإنجليزية', style: 'sectionHeader' },
		{ text: '1. التاريخ اليوم', margin: [0, 5, 0, 2] },
		{ text: '2) الوقت الآن', margin: [0, 2, 0, 2] },
		{ text: 'مرحبا:hello:عالم', margin: [0, 2, 0, 2] },
		{ text: 'الاسم:name', margin: [0, 5, 0, 2] },
		{ text: 'المدينة:city', margin: [0, 2, 0, 2] },
		{ text: '\n' },

		// ═══════════════════════════════════════════════════════════
		// TEST 5: Multiple separators mixed
		// ═══════════════════════════════════════════════════════════
		{ text: 'اختبار 5: فواصل متعددة مختلطة', style: 'sectionHeader' },

		{ text: 'مرحبا/hello/عالم', margin: [0, 5, 0, 2] },
		{ text: '100/العربية', margin: [0, 2, 0, 2] },
		{ text: 'العربية (test) مع english/عربي', margin: [0, 2, 0, 2] },
		{ text: 'القسم-department/الإدارة-management', margin: [0, 2, 0, 2] },
		{ text: '\n' },

		// ═══════════════════════════════════════════════════════════
		// TEST 6: Persian with separators
		// ═══════════════════════════════════════════════════════════
		{ text: 'اختبار 6: فارسی با جداکننده', style: 'sectionHeader' },

		{ text: 'فارسی/persian', margin: [0, 5, 0, 2] },
		{ text: 'سلام-hello-دنیا', margin: [0, 2, 0, 2] },
		{ text: 'نام (name) است', margin: [0, 2, 0, 2] },
		{ text: '\n' },

		// ═══════════════════════════════════════════════════════════
		// TEST 7: In a table context
		// ═══════════════════════════════════════════════════════════
		{ text: 'اختبار 7: في جدول', style: 'sectionHeader' },
		{ text: '\n' },

		{
			table: {
				rtl: true,
				widths: ['*', '*'],
				body: [
					[
						{ text: 'القيمة', bold: true },
						{ text: 'الحقل', bold: true }
					],
					[
						{ text: 'العربية/arabic' },
						{ text: 'اللغة/language' }
					],
					[
						{ text: 'مرحبا (hello)' },
						{ text: 'التحية/greeting' }
					],
					[
						{ text: 'القسم-department' },
						{ text: 'الوحدة/unit' }
					]
				]
			}
		}
	],
	styles: {
		header: {
			fontSize: 22,
			bold: true,
			margin: [0, 0, 0, 5]
		},
		subheader: {
			fontSize: 16,
			margin: [0, 0, 0, 10]
		},
		sectionHeader: {
			fontSize: 16,
			bold: true,
			color: '#2c3e50',
			margin: [0, 10, 0, 5],
			alignment: 'right'
		}
	}
};

var now = new Date();

var pdf = pdfmake.createPdf(dd);
pdf.write('examples/pdfs/test-bidi-punctuation.pdf').then(function () {
	console.log(new Date() - now);
}, function (err) {
	console.error(err);
});
