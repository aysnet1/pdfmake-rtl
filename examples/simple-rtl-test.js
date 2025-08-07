var fonts = {
	Nillima: {
		normal: 'examples/fonts/Nillima.ttf',
		bold: 'examples/fonts/Nillima.ttf',
		italics: 'examples/fonts/Nillima.ttf',
		bolditalics: 'examples/fonts/Nillima.ttf'
	},
	Roboto: {
		normal: 'examples/fonts/Roboto-Regular.ttf',
		bold: 'examples/fonts/Roboto-Medium.ttf',
		italics: 'examples/fonts/Roboto-Italic.ttf',
		bolditalics: 'examples/fonts/Roboto-MediumItalic.ttf'
	}
};

var PdfPrinter = require('../src/printer');
var printer = new PdfPrinter(fonts);
var fs = require('fs');

// Simple test to isolate the RTL table issue
const docDefinition = {
  content: [
    {
      table: {
        headerRows: 1,
        widths: ['auto', '*', 'auto', '*'],
        body: [
          [
            { text: 'رقم', style: 'tableHeader', alignment: 'center' },
            { text: 'الوصف', style: 'tableHeader', alignment: 'center' },
            { text: 'الحالة', style: 'tableHeader', alignment: 'center' },
            { text: 'ملاحظات', style: 'tableHeader', alignment: 'center' }
          ],
          [
            { text: '١', alignment: 'center' },
            {
              text: 'هذا نص طويل جداً يوضح كيف يمكن للنص أن يلتف على أكثر من سطر داخل خلية الجدول في ملف PDF باستخدام pdfmake-rtl.',
              alignment: 'right'
            },
            { text: 'مكتمل', alignment: 'center', bold: true, color: 'green' },
            {
              text: 'تمت المراجعة من قبل الفريق، ولا توجد ملاحظات إضافية.',
              alignment: 'right',
              italics: true
            }
          ],
          [
            { text: '٢', alignment: 'center' },
            {
              text: 'وصف مختصر.',
              alignment: 'right'
            },
            { text: 'قيد التنفيذ', alignment: 'center', bold: true, color: 'orange' },
            {
              text: 'ينتظر الموافقة من الإدارة.',
              alignment: 'right',
              italics: true
            }
          ],
          [
            { text: '٣', alignment: 'center' },
            {
              text: 'نص متوسط الطول يوضح بعض التفاصيل المهمة التي تحتاج إلى الانتباه.',
              alignment: 'right'
            },
            { text: 'مؤجل', alignment: 'center', bold: true, color: 'red' },
            {
              text: 'تأجيل بسبب قلة الموارد.',
              alignment: 'right',
              italics: true
            }
          ]
        ]
      },
      layout: {
        fillColor: function (rowIndex, node, columnIndex) {
          return (rowIndex === 0) ? '#CCCCCC' : null;
        },
        hLineWidth: function (i, node) {
          return (i === 0 || i === node.table.body.length) ? 2 : 1;
        },
        vLineWidth: function () {
          return 1;
        },
        hLineColor: function (i) {
          return '#aaa';
        },
        paddingLeft: function () {
          return 8;
        },
        paddingRight: function () {
          return 8;
        }
      }
    }
  ],
  defaultStyle: {
    font: 'Nillima',
    fontSize: 12,
    alignment: 'right'  // Default to RTL alignment
  }
};

var now = new Date();

var pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(fs.createWriteStream('examples/pdfs/simple_rtl_test.pdf'));
pdfDoc.end();

console.log('Simple RTL test completed in', new Date() - now, 'ms');
