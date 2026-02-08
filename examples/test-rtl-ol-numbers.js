/**
 * Test: OL list numbers should appear when alignment/direction is set to RTL
 */
var pdfmake = require('../js/index');
var Cairo = require('../fonts/Cairo');
var Roboto = require('../fonts/Roboto');
pdfmake.addFonts(Cairo);
pdfmake.addFonts(Roboto);
pdfmake.addFonts(
	{
		Nillima: {
			normal: 'https://digicole.com' + '/fonts/noto/NotoNaskhArabic-Regular.ttf',
			bold: 'https://digicole.com' + '/fonts/noto/NotoNaskhArabic-Bold.ttf',
			italics: 'https://digicole.com' + '/fonts/noto/NotoNaskhArabic-Regular.ttf',
			bolditalics: 'https://digicole.com' + '/fonts/noto/NotoNaskhArabic-Regular.ttf',
		}
	});
var path = require('path');

var docDefinition = {
	content: [
		{ text: 'Test 1: OL with direction: rtl', style: 'header' },
		{
			ol: [
				'عنصر أول',
				'عنصر ثاني',
				'عنصر ثالث'
			],
			direction: 'rtl',

		},

		{ text: '\nTest 2: OL with alignment: right', style: 'header' },
		{
			ol: [
				'عنصر أول',
				'عنصر ثاني',
				'عنصر ثالث'
			],
			alignment: 'right',
		},

		{ text: '\nTest 3: OL with both alignment: right + direction: rtl', style: 'header' },
		{
			ol: [
				'عنصر أول',
				'عنصر ثاني',
				'عنصر ثالث'
			],
			alignment: 'right',
			direction: 'rtl',
			style: {
				font: 'Nillima',
			}
		},

		{ text: '\nTest 4: OL without alignment/direction (auto-detect)', style: 'header' },
		{
			ol: [
				'عنصر أول',
				'عنصر ثاني',
				'عنصر ثالث'
			],
		}
	],
	styles: {
		header: {
			fontSize: 14,
			bold: true,
			margin: [0, 10, 0, 5]
		},

	},
	defaultStyle: {
		font: 'Roboto',
	}
};

var outputPath = path.join(__dirname, 'pdfs', 'test-rtl-ol-numbers.pdf');
pdfmake.createPdf(docDefinition).write(outputPath).then(function () {
	console.log('PDF generated:', outputPath);
}).catch(function (err) {
	console.error('Error:', err);
});
