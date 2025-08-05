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

// Example document with Arabic RTL support
var docDefinition = {
	// Document content
	content: [
		// Header
		{ 
			text: 'Arabic RTL Support Demo', 
			style: 'header',
			alignment: 'center',
			margin: [0, 0, 0, 20]
		},
		
		// LTR Text (English)
		{
			text: 'Left-to-Right (English) text: This is normal English text that flows from left to right.',
			margin: [0, 0, 0, 10]
		},
		
		// RTL Text (Arabic) with supportRTL enabled
		{
			text: 'مرحبا بكم في نظام الكتابة من اليمين إلى اليسار. هذا نص عربي يجب أن يظهر من اليمين إلى اليسار.',
			supportRTL: true,
			margin: [0, 0, 0, 10]
		},
		
		// Mixed text with explicit direction
		{
			text: [
				{ text: 'English text first, then ', supportRTL: false },
				{ text: 'النص العربي الثاني', supportRTL: true, direction: 'rtl' },
				{ text: ' and English again.', supportRTL: false }
			],
			margin: [0, 0, 0, 10]
		},
		
		// Long Arabic text to test line breaking
		{
			text: 'هذا نص عربي طويل جداً يهدف إلى اختبار كسر الأسطر في النصوص العربية. يجب أن ينكسر النص بشكل صحيح من النهاية وليس من البداية. هذا مهم جداً للقراءة الصحيحة للنص العربي. النص العربي يجب أن يتدفق من اليمين إلى اليسار وأن ينكسر بشكل طبيعي.',
			supportRTL: true,
			margin: [0, 0, 0, 20]
		},
		
		// Table with AUTO RTL support (columns will be automatically reversed)
		{
			text: 'Table with AUTO RTL Support (columns automatically reversed):',
			style: 'subheader',
			margin: [0, 0, 0, 10]
		},
		{
			table: {
				headerRows: 1,
				widths: ['33%', '33%', '34%'], 
				body: [
					// Header row - Normal order (will be auto-reversed by supportRTL)
					[
						{ text: 'العمود الأول', supportRTL: true, style: 'tableHeader' },
						{ text: 'العمود الثاني', supportRTL: true, style: 'tableHeader' },
						{ text: 'العمود الثالث', supportRTL: true, style: 'tableHeader' }
					],
					// First data row - Normal order (will be auto-reversed by supportRTL)
					[
						{ 
							text: 'هذا نص عربي طويل يمثل محتوى الخلية الأولى في الصف الأول من الجدول.',
							supportRTL: true
						},
						{ 
							text: 'هذا نص طويل باللغة العربية يمثل محتوى الخلية الثانية لتجربة العرض.',
							supportRTL: true
						},
						{ 
							text: 'هذه الجملة الطويلة مكتوبة لتوضيح كيفية التعامل مع النصوص الطويلة داخل الخلايا.',
							supportRTL: true
						}
					],
					// Second data row - Normal order (will be auto-reversed by supportRTL)
					[
						{ 
							text: 'النص هنا يحتوي على عدد كبير من الكلمات للتأكد من أن التفاف النص يعمل بشكل صحيح.',
							supportRTL: true
						},
						{ 
							text: 'نقوم بإضافة جمل متعددة داخل الخلية للتأكد من التنسيق الصحيح في المستند.',
							supportRTL: true
						},
						{ 
							text: 'يجب أن يتم عرض هذا النص بشكل سليم عند توليد ملف PDF يدعم اللغة العربية.',
							supportRTL: true
						}
					]
				]
			},
			supportRTL: true, // Enable AUTO RTL - columns will be automatically reversed
			layout: {
				fillColor: function (rowIndex, node, columnIndex) {
					return (rowIndex === 0) ? '#CCCCCC' : null;
				}
			},
			margin: [0, 0, 0, 20]
		},
		
		// Right-aligned English text for comparison
		{
			text: 'This is English text aligned to the right (for comparison with Arabic):',
			margin: [0, 0, 0, 5]
		},
		{
			text: 'Right-aligned English text looks different from true RTL text.',
			alignment: 'right',
			margin: [0, 0, 0, 10]
		},
		
		// True RTL Arabic text
		{
			text: 'هذا نص عربي حقيقي من اليمين إلى اليسار:',
			supportRTL: true,
			margin: [0, 0, 0, 5]
		},
		{
			text: 'النص العربي الحقيقي يتدفق طبيعياً من اليمين إلى اليسار.',
			supportRTL: true,
			margin: [0, 0, 0, 20]
		}
	],
	
	// Styles
	styles: {
		header: {
			fontSize: 18,
			bold: true
		},
		subheader: {
			fontSize: 14,
			bold: true
		},
		tableHeader: {
			bold: true,
			fontSize: 13,
			alignment: 'center',
			fillColor: '#CCCCCC'
		}
	},
	
	// Default style
	defaultStyle: {
		fontSize: 12,
		lineHeight: 1.5,
		font: 'Nillima'
	}
};

var now = new Date();

var pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(fs.createWriteStream('examples/pdfs/arabic_rtl.pdf'));
pdfDoc.end();

console.log(new Date() - now);
