/*eslint no-unused-vars: ["error", {"args": "none"}]*/


var pdfmake = require('../js/index'); // only during development, otherwise use the following line
//var pdfmake = require('pdfmake');

var Cairo = require('../fonts/Cairo');
pdfmake.addFonts(Cairo);


var docDefinition = {
	pageSize: 'A4',
	pageMargins: [40, 60, 40, 60],
	content: [
		// Title
		{
			text: 'Complex Mixed Language Document / وثيقة معقدة متعددة اللغات',
			style: 'header',
			alignment: 'center'
		},
		{
			text: 'Generated with pdfmake-rtl / تم الإنشاء بواسطة pdfmake-rtl',
			style: 'subheader',
			alignment: 'center'
		},

		// Mixed Paragraphs with Parentheses
		{ text: '1) تحليل النص المختلط', style: 'sectionHeader' },
		{
			text: [
				'This) system supports (Automatic) RTL detection. ',
				'يدعم هذا النظام الكشف (التلقائي) عن الكتابة من اليمين إلى اليسار. ',
				'Status: (Active) - الحالة: (نشط). ',
				'Verify that (English) text stays LTR and (العربية) text flows RTL. ',
				'Error codes: (404) Not Found, (500) خطأ في الخادم.'
			],
			alignment: 'justify',
			margin: [0, 5, 0, 15]
		},

		// Complex Table
		{ text: '2. Complex Inventory Table / جدول المخزون المعقد', style: 'sectionHeader' },
		{
			table: {
				headerRows: 1,
				widths: ['15%', '35%', '25%', '25%'],
				body: [
					// Header
					[
						{ text: 'ID / رقم', style: 'tableHeader' },
						{ text: 'Description / الوصف', style: 'tableHeader' },
						{ text: 'Category / الفئة', style: 'tableHeader' },
						{ text: 'Status / الحالة', style: 'tableHeader' }
					],
					// Row 1: English Primary
					[
						'MX-101',
						'High Performance Laptop (16GB RAM) with Arabic Keyboard',
						'Electronics / إلكترونيات',
						{ text: '(In Stock) متوفر', color: 'green', bold: true }
					],
					// Row 2: Arabic Primary
					[
						'AR-202',
						'لوحة مفاتيح ميكانيكية (إضاءة RGB) - تدعم اللغتين',
						'Accessories / ملحقات',
						{ text: 'Low Stock (قليل)', color: 'orange' }
					],
					// Row 3: Complex Mixed
					[
						'MX-303',
						{
							text: [
								'Software License (1 Year) ',
								'رخصة برمجيات (سنة واحدة) ',
								'- Enterprise Edition'
							]
						},
						'Software / برمجيات',
						{ text: '(Out of Stock) غير متوفر', color: 'red', bold: true }
					],
					// Row 4: Numbers and Special Chars
					[
						'#99-X',
						'Cable USB-C -> HDMI (4K @ 60Hz)',
						'Cables (كابلات)',
						'Active (نشط)'
					]
				]
			},
			supportRTL: true, // Auto-reverses columns for RTL feel if desired, or keep as is. Matches user content flow.
			layout: 'lightHorizontalLines',
			margin: [0, 5, 0, 15]
		},

		// Mixed Lists
		{ text: '3. Technical Requirements / المتطلبات التقنية', style: 'sectionHeader' },
		{
			ul: [
				'Processor: Intel Core i7 (or equivalent) / معالج إنتل أو ما يعادله',
				'Memory: At least 16GB RAM (32GB recommended) / الذاكرة: 16 جيجابايت على الأقل',
				{
					text: [
						{ text: 'هذا الدعم', bold: true }
					]
				},
				{
					text: 'Network: (5G) capability preferred / الشبكة: يفضل دعم (5G)',
					listType: 'square'
				}
			],
			margin: [0, 5, 0, 15]
		},

		// Nested List / Sub-points
		{ text: '1) المرحلة الأولى', style: 'sectionHeader' },
		{
			ol: [
				'المرحلة الأساسية',
				{
					ol: [
						'المرحلة الأولى',
						'المرحلة الثانية',
						'المرحلة الثالثة'
					]
				},
				'Final Report to be sent to (admin@example.com)'
			]
		},

		// Footer Note
		{
			text: 'Note: This document was generated automatically. ملاحظة: تم إنشاء هذه الوثيقة تلقائياً.',
			style: 'footerText',
			margin: [0, 30, 0, 0]
		}
	],
	styles: {
		header: {
			fontSize: 22,
			bold: true,
			color: '#2c3e50',
			margin: [0, 0, 0, 10]
		},
		subheader: {
			fontSize: 12,
			italics: true,
			color: '#7f8c8d',
			margin: [0, 0, 0, 20]
		},
		sectionHeader: {
			fontSize: 16,
			bold: true,
			color: '#2980b9',
			margin: [0, 10, 0, 5],
			decoration: 'underline'
		},
		tableHeader: {
			bold: true,
			fontSize: 12,
			color: 'black',
			fillColor: '#ecf0f1'
		},
		footerText: {
			fontSize: 10,
			italics: true,
			color: 'gray',
			alignment: 'center'
		}
	},
	defaultStyle: {
		// font: 'Nillima',
		fontSize: 11
	}
};

var now = new Date();

var pdf = pdfmake.createPdf(docDefinition);
pdf.write('examples/pdfs/tables.pdf').then(() => {
	console.log(new Date() - now);
}, err => {
	console.error(err);
});
