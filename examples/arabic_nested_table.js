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

var docDefinition = {
    pageSize: 'A4',
    content: [
        { text: 'مثال جدول مع ترويسة متداخلة (Arabic Nested Table)', style: 'header', alignment: 'center' },
        {
            table: {
                headerRows: 2,
                widths: ['*', 'auto', 100, '*'],
                body: [
                    // Nested Header Row 1
                    // RTL Logic: Column reversal expects Spans to span Right in RTL (Left in LTR)
                    // With reverseTableRowPreserveSpans:
                    // LTR: [ {span 2}, {}, {span 2}, {} ]
                    // RTL: [ {span 2}, {}, {span 2}, {} ] (Reversed groups)
                    // The render will place them correctly.
                    [
                        { text: 'بيانات الموظف', colSpan: 2, alignment: 'center', fillColor: '#eeeeee' },
                        {},
                        { text: 'التفاصيل المالية', colSpan: 2, alignment: 'center', fillColor: '#dddddd' },
                        {}
                    ],
                    // Nested Header Row 2
                    [
                        { text: 'الاسم', alignment: 'right' },
                        { text: 'القسم', alignment: 'right' },
                        { text: 'الراتب', alignment: 'right' },
                        { text: 'المكافآت', alignment: 'right' }
                    ],
                    // Data Rows
                    ['محمد أحمد', 'تقنية المعلومات', '5000', '1000'],
                    ['سارة علي', 'الموارد البشرية', '4500', '500'],
                    ['خالد عمر', 'المبيعات', '6000', '2000']
                ]
            },
            layout: 'lightHorizontalLines',
            margin: [0, 20, 0, 0]
        }
    ],
    styles: {
        header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 20]
        }
    },
    defaultStyle: {
        font: 'Nillima',
        fontSize: 12
    }
};

var pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(fs.createWriteStream('examples/pdfs/arabic_nested_table.pdf'));
pdfDoc.end();

console.log('PDF created at examples/pdfs/arabic_nested_table.pdf');
