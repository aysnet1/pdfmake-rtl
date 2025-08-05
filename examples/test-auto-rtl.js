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

// Test automatic RTL table processing
var docDefinition = {
	content: [
		{
			text: 'Automatic RTL Table Processing Test',
			style: 'header',
			alignment: 'center',
			margin: [0, 0, 0, 20]
		},
		
		// Normal order table (LTR columns)
		{
			text: 'Normal LTR Table (Original Order):',
			style: 'subheader',
			margin: [0, 0, 0, 10]
		},
		{
			table: {
				headerRows: 1,
				widths: ['33%', '33%', '34%'],
				body: [
					['Column 1', 'Column 2', 'Column 3'],
					['Cell 1', 'Cell 2', 'Cell 3'],
					['Data 1', 'Data 2', 'Data 3']
				]
			},
			margin: [0, 0, 0, 20]
		},
		
		// Auto RTL table - columns should be automatically reversed
		{
			text: 'Auto RTL Table (supportRTL: true - columns automatically reversed):',
			style: 'subheader',
			margin: [0, 0, 0, 10]
		},
		{
			table: {
				headerRows: 1,
				widths: ['33%', '33%', '34%'],
				body: [
					// Simple strings - supportRTL will be added automatically
					['العمود الأول', 'العمود الثاني', 'العمود الثالث'],
					[
						'هذا نص عربي للخلية الأولى',
						'هذا نص عربي للخلية الثانية',
						'هذا نص عربي للخلية الثالثة'
					],
					[
						'بيانات الصف الثاني - الخلية الأولى',
						'بيانات الصف الثاني - الخلية الثانية',
						'بيانات الصف الثاني - الخلية الثالثة'
					]
				]
			},
			supportRTL: true, // This will automatically reverse column order AND add supportRTL to cells
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
pdfDoc.pipe(fs.createWriteStream('examples/pdfs/auto_rtl_test.pdf'));
pdfDoc.end();

console.log('Auto RTL test completed in', new Date() - now, 'ms');
