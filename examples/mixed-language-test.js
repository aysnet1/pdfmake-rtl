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
    content: [
        { text: 'Mixed Language & Parentheses Fix Test', style: 'header' },

        // 1. Pure English (LTR) - Parentheses should look like (Text)
        { text: '1. Standard English: (Complete) Status', margin: [0, 10] },

        // 2. Pure Arabic (RTL) - Parentheses should mirror correctly automatically or via supportRTL
        { text: '2. Arabic Text: (مكتمل) الحالة', supportRTL: true, margin: [0, 10] },

        // 3. Mixed Line - English start
        { text: '3. Mixed (English Start): Status is (Complete) and translating to (مكتمل)', margin: [0, 10] },

        // 4. Mixed Line - Arabic start
        { text: '4. Mixed (Arabic Start): الحالة هي (مكتمل) وبالأنجليزية (Complete)', supportRTL: true, margin: [0, 10] },

        // 5. The specific case from the user's issue (Mixed list/status)
        { text: '5. Specific Issue Reproduction:', style: 'subheader', margin: [0, 15, 0, 5] },

        {
            text: [
                'Status: (Complete) مكتمل\n',
                'Status: مكتمل (Complete)\n',
                'Status: (Complete) - (مكتمل)\n',
                'Status: (Pending) قيد الانتظار\n'
            ],
            margin: [0, 0, 0, 20]
        },

        // 6. Table with mixed content
        { text: '6. Mixed Content Table', style: 'subheader', margin: [0, 10] },
        {
            table: {
                widths: ['*', '*'],
                body: [
                    ['English Only (LTR)', 'Arabic Only (RTL)'],
                    ['(Pending) Approval', 'موافقة (قيد الانتظار)'],
                    ['User (Admin)', 'مستخدم (مسؤول)'],
                    ['(123) 456-7890', '(١٢٣) ٤٥٦-٧٨٩٠'] // Testing numbers and parens
                ]
            },
            supportRTL: true // Columns will be reversed
        }
    ],
    styles: {
        header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10]
        },
        subheader: {
            fontSize: 14,
            bold: true,
            decoration: 'underline'
        }
    },
    defaultStyle: {
        font: 'Nillima', // Using Nillima for Arabic support
        fontSize: 12
    }
};

var pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(fs.createWriteStream('examples/pdfs/mixed-language-test.pdf'));
pdfDoc.end();

console.log('PDF created at examples/pdfs/mixed-language-test.pdf');
