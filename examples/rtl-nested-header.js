'use strict';

const PdfPrinter = require('../src/printer');
const fs = require('fs');

// Fonts used by examples (paths relative to repo root)
const fonts = {
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

const printer = new PdfPrinter(fonts);

// Your provided docDefinition with auto-RTL detection enabled
const docDefinition = {
	content: [
		{
			table: {

				headerRows: 2,
				widths: ['auto', '*', '*', '*', 'auto', '*'],
				body: [
					// Row 1 (main headers)
					[
						{ text: 'رقم', rowSpan: 2, style: 'tableHeader', alignment: 'center' },
						{},
						{ text: ' الشخصية', colSpan: 2, style: 'tableHeader', alignment: 'center' },
						{},
						{ text: 'التفاصيل الأكاديمية', colSpan: 2, style: 'tableHeader', alignment: 'center' },
						{ text: 'الوصف', style: 'tableHeader', rowSpan: 2 },

					],
					// Row 2 (sub headers)
					[
						{},
						{ text: 'الاسم', style: 'tableHeader', alignment: 'center' },
						{ text: 'اللقب', style: 'tableHeader', alignment: 'center' },
						{ text: 'المستوى', style: 'tableHeader', alignment: 'center' },
						{ text: 'المعدل', style: 'tableHeader', alignment: 'center' },
						{}
					],
					// Data rows
					['1', 'أحمد', 'بن سالم', 'ثانوي', '15.2', 'طالب متميز يسعى للتفوق في دراسته ويحب القراءة والبحث العلمي. يتطلع لدراسة الهندسة والمساهمة في تطوير التكنولوجيا في بلاده'],
					['2', 'سارة', 'محمد', 'إعدادي', '14.5', 'طالبة نشيطة تحب الرياضيات والعلوم وتشارك في الأنشطة المدرسية المختلفة. تهدف لأن تصبح معلمة لتساعد الأجيال القادمة على التعلم والنمو'],
					['3', 'خالد', 'علي', 'جامعي', '16.0', 'طالب جامعي يدرس الطب ويحلم بأن يصبح طبيبا متخصصا لخدمة المجتمع. يتميز بالجدية والالتزام ويحب مساعدة زملائه في الدراسة والبحث العلمي والتطوير المستمر']
				]
			}
		}
	],
	styles: {
		tableHeader: { bold: true, fontSize: 12, color: 'black' }
	},
	defaultStyle: { font: 'Nillima' }
};

const outPath = 'examples/pdfs/rtl-nested-header.pdf';
const pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(fs.createWriteStream(outPath));
pdfDoc.end();
pdfDoc.on('end', () => console.log('Written', outPath));
