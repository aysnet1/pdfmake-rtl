var PdfPrinter = require('../src/printer');
var fs = require('fs');

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

var printer = new PdfPrinter(fonts);

// Test table with headerRows: 2 but no spans
const docDefinition = {
	content: [
		{
			table: {
				supportRTL: false, // Explicitly disable RTL table reversal
				headerRows: 2,
				widths: ['auto', '*', '*', '*', 'auto'],
				body: [
					// Row 1 - Main category headers
					[
						{ text: 'رقم', style: 'tableHeader', alignment: 'center' },
						{ text: 'المعلومات الشخصية', style: 'tableHeader', alignment: 'center' },
						{ text: '', style: 'tableHeader', alignment: 'center' },
						{ text: 'التفاصيل الأكاديمية', style: 'tableHeader', alignment: 'center' },
						{ text: '', style: 'tableHeader', alignment: 'center' }
					],
					// Row 2 - Sub headers
					[
						{ text: '', style: 'tableHeader', alignment: 'center' },
						{ text: 'الاسم', style: 'tableHeader', alignment: 'center' },
						{ text: 'اللقب', style: 'tableHeader', alignment: 'center' },
						{ text: 'المستوى', style: 'tableHeader', alignment: 'center' },
						{ text: 'المعدل', style: 'tableHeader', alignment: 'center' }
					],
					// Data rows
					['1', 'أحمد', 'بن سالم', 'ثانوي', '15.2'],
					['2', 'سارة', 'محمد', 'إعدادي', '14.5'],
					['3', 'خالد', 'علي', 'جامعي', '16.0']
				]
			}
		}
	],
	styles: {
		tableHeader: { bold: true, fontSize: 12, color: 'black' }
	},
	defaultStyle: { font: 'Nillima' }
};

var pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(fs.createWriteStream('examples/pdfs/test-no-spans-rtl-table.pdf'));
pdfDoc.end();

console.log('Written examples/pdfs/test-no-spans-rtl-table.pdf');
