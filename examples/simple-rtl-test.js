var fonts = {
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

// Simple test to isolate the RTL table issue
var docDefinition = {
	content: [
		{
			text: 'Simple RTL Table Test',
			style: 'header',
			alignment: 'center',
			margin: [0, 0, 0, 20]
		},
		
		// Test with simple strings - no supportRTL at table level
		{
			text: 'Normal table (no RTL):',
			margin: [0, 0, 0, 10]
		},
		{
			table: {
				body: [
					['A', 'B', 'C'],
					['1', '2', '3']
				]
			},
			margin: [0, 0, 0, 20]
		},
		
		// Test with supportRTL: true but English text
		{
			text: 'English table with supportRTL: true:',
			margin: [0, 0, 0, 10]
		},
		{
			table: {
				body: [
					['A', 'B', 'C'],
					['1', '2', '3']
				]
			},
			supportRTL: true,
			margin: [0, 0, 0, 20]
		},
		
		// Test with Arabic text but no supportRTL
		{
			text: 'Arabic table without supportRTL:',
			margin: [0, 0, 0, 10]
		},
		{
			table: {
				body: [
					['أ', 'ب', 'ج'],
					['1', '2', '3']
				]
			},
			margin: [0, 0, 0, 20]
		},
		
		// Test with Arabic text AND supportRTL: true
		{
			text: 'Arabic table WITH supportRTL: true:',
			margin: [0, 0, 0, 10]
		},
		{
			table: {
				body: [
					['أ', 'ب', 'ج'],
					['1', '2', '3']
				]
			},
			supportRTL: true,
			margin: [0, 0, 0, 20]
		}
	],
	
	styles: {
		header: {
			fontSize: 16,
			bold: true
		}
	},
	
	defaultStyle: {
		fontSize: 12,
		font: 'Nillima'
	}
};

var now = new Date();

var pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(fs.createWriteStream('examples/pdfs/simple_rtl_test.pdf'));
pdfDoc.end();

console.log('Simple RTL test completed in', new Date() - now, 'ms');
