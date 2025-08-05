var fonts = {
	Roboto: {
		normal: 'examples/fonts/Roboto-Regular.ttf',
		bold: 'examples/fonts/Roboto-Medium.ttf',
		italics: 'examples/fonts/Roboto-Italic.ttf',
		bolditalics: 'examples/fonts/Roboto-MediumItalic.ttf'
	},

	Nillima: {
		normal: 'examples/fonts/Nillima.ttf',
		bold: 'examples/fonts/Nillima.ttf',
		italics: 'examples/fonts/Nillima.ttf',
		bolditalics: 'examples/fonts/Nillima.ttf'
	}
};

var PdfPrinter = require('../src/printer');
var printer = new PdfPrinter(fonts);
var fs = require('fs');

// Debug test to understand the RTL table issue
var docDefinition = {
	content: [
		{
			text: 'Debug RTL Table Test',
			style: 'header',
			alignment: 'center',
			margin: [0, 0, 0, 20]
		},
		
		// Test 1: Manual RTL with explicit supportRTL on cells
		{
			text: 'Test 1: Manual approach (no auto processing):',
			style: 'subheader',
			margin: [0, 0, 0, 10]
		},
		{
			table: {
				headerRows: 1,
				widths: ['33%', '33%', '34%'],
				body: [
					[
						{ text: 'العمود الثالث', supportRTL: true },
						{ text: 'العمود الثاني', supportRTL: true },
						{ text: 'العمود الأول', supportRTL: true }
					],
					[
						{ text: 'خلية 3', supportRTL: true },
						{ text: 'خلية 2', supportRTL: true },
						{ text: 'خلية 1', supportRTL: true }
					]
				]
			},
			margin: [0, 0, 0, 20]
		},

		// Test 2: Auto RTL processing
		{
			text: 'Test 2: Auto RTL processing (supportRTL: true):',
			style: 'subheader',
			margin: [0, 0, 0, 10]
		},
		{
			table: {
				headerRows: 1,
				widths: ['33%', '33%', '34%'],
				body: [
					['العمود الأول', 'العمود الثاني', 'العمود الثالث'],
					['خلية 1', 'خلية 2', 'خلية 3']
				]
			},
			supportRTL: true,
			margin: [0, 0, 0, 20]
		},

		// Test 3: Only column reversal without supportRTL on cells
		{
			text: 'Test 3: English test with auto reversal:',
			style: 'subheader',
			margin: [0, 0, 0, 10]
		},
		{
			table: {
				headerRows: 1,
				widths: ['33%', '33%', '34%'],
				body: [
					['Column 1', 'Column 2', 'Column 3'],
					['Cell 1', 'Cell 2', 'Cell 3']
				]
			},
			supportRTL: true,
			margin: [0, 0, 0, 20]
		}
	],
	
	styles: {
		header: {
			fontSize: 18,
			bold: true
		},
		subheader: {
			fontSize: 14,
			bold: true
		}
	},
	
	defaultStyle: {
		fontSize: 12,
		lineHeight: 1.5,
		font: 'Nillima'
	}
};

var now = new Date();

var pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(fs.createWriteStream('examples/pdfs/debug_rtl_test.pdf'));
pdfDoc.end();

console.log('Debug RTL test completed in', new Date() - now, 'ms');
