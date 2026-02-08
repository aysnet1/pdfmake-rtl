/**
 * Comprehensive RTL Examples for pdfmake-rtlV
 * Demonstrates all RTL features: document-level, content-level, and auto-detection
 */

var pdfmake = require('../js/index');

// Load fonts
var Roboto = require('../fonts/Roboto');
var Cairo = require('../fonts/Cairo');

pdfmake.addFonts(Roboto);
pdfmake.addFonts(Cairo);

// Example 1: Document-level RTL
const docDefinition1 = {
	rtl: true, // Enable RTL for entire document
	content: [
		{ text: 'مثال على المستند بالكامل بالعربية', style: 'header' },
		{ text: 'هذا النص سيتم محاذاته تلقائيًا إلى اليمين باستخدام خط Cairo', margin: [0, 10] },
		{
			ul: [
				'العنصر الأول',
				'العنصر الثاني',
				'العنصر الثالث'
			]
		},
		{
			table: {
				body: [
					['الاسم', 'العمر', 'المدينة'],
					['أحمد', '25', 'القاهرة'],
					['فاطمة', '30', 'دبي']
				]
			}
		}
	],
	styles: {
		header: { fontSize: 18, bold: true, margin: [0, 0, 0, 15] }
	}
};

// Example 2: Content-level RTL
const docDefinition2 = {
	content: [
		{ text: 'Mixed Content Document', style: 'header', alignment: 'center' },
		{ text: 'English paragraph with left alignment', margin: [0, 10] },
		{
			text: 'فقرة عربية مع محاذاة يمين',
			rtl: true, // RTL only for this element
			margin: [0, 10]
		},
		{
			columns: [
				{
					text: 'Left column in English',
					width: '*'
				},
				{
					text: 'العمود الأيمن بالعربية',
					rtl: true,
					width: '*'
				}
			],
			columnGap: 10,
			margin: [0, 10]
		},
		{
			table: {
				body: [
					['English', { text: 'عربي', rtl: true }],
					['Left-to-Right', { text: 'من اليمين إلى اليسار', rtl: true }]
				]
			}
		}
	],
	styles: {
		header: { fontSize: 18, bold: true, margin: [0, 0, 0, 15] }
	}
};

// Example 3: Auto-detection (no rtl property needed)
const docDefinition3 = {
	content: [
		{ text: 'Auto-Detection Example', style: 'header', alignment: 'center' },
		{ text: 'English text will use Roboto font and left alignment', margin: [0, 10] },
		{ text: 'النص العربي سيستخدم خط Cairo ومحاذاة يمين تلقائيًا', margin: [0, 10] },
		{ text: 'متن فارسی به طور خودکار شناسایی می شود', margin: [0, 10] },
		{ text: 'اردو متن خودکار طور پر پہچانا جاتا ہے', margin: [0, 10] },
		{
			ul: [
				'English list item',
				'عنصر قائمة عربي',
				'فارسی فهرست مورد'
			],
			margin: [0, 10]
		}
	],
	styles: {
		header: { fontSize: 18, bold: true, margin: [0, 0, 0, 15] }
	}
};

// Example 4: Complex table with RTL
const docDefinition4 = {
	content: [
		{ text: 'جدول معقد مع RTL', style: 'header' },
		{
			table: {
				rtl: true, // RTL table layout
				headerRows: 2,
				widths: ['auto', '*', '*', '*', 'auto'],
				body: [
					[
						{ text: 'رقم', rowSpan: 2, style: 'tableHeader', alignment: 'center' },
						{ text: 'المعلومات الشخصية', colSpan: 2, style: 'tableHeader', alignment: 'center' },
						{},
						{ text: 'التفاصيل الأكاديمية', colSpan: 2, style: 'tableHeader', alignment: 'center' },
						{}
					],
					[
						{},
						{ text: 'الاسم', style: 'tableHeader', alignment: 'center' },
						{ text: 'اللقب', style: 'tableHeader', alignment: 'center' },
						{ text: 'المستوى', style: 'tableHeader', alignment: 'center' },
						{ text: 'المعدل', style: 'tableHeader', alignment: 'center' }
					],
					['1', 'أحمد', 'بن سالم', 'ثانوي', '15.2'],
					['2', 'سارة', 'محمد', 'إعدادي', '14.5'],
					['3', 'خالد', 'علي', 'جامعي', '16.0']
				]
			}
		}
	],
	styles: {
		header: { fontSize: 18, bold: true, margin: [0, 0, 0, 15] },
		tableHeader: { bold: true, fontSize: 12, fillColor: '#f0f0f0' }
	}
};

// Generate all examples
const examples = [
	{ def: docDefinition1, name: 'document-level-rtl.pdf' },
	{ def: docDefinition2, name: 'content-level-rtl.pdf' },
	{ def: docDefinition3, name: 'auto-detection-rtl.pdf' },
	{ def: docDefinition4, name: 'complex-table-rtl.pdf' }
];

console.log('Generating RTL examples...\n');

var now = new Date();
var completed = 0;

examples.forEach(({ def, name }) => {
	try {
		var pdf = pdfmake.createPdf(def);
		pdf.write('examples/pdfs/' + name).then(() => {
			completed++;
			console.log('✓ Generated: ' + name);
			if (completed === examples.length) {
				console.log('\nAll examples generated successfully in ' + (new Date() - now) + 'ms');
			}
		}, err => {
			console.error('✗ Error generating ' + name + ':', err.message);
		});
	} catch (error) {
		console.error('✗ Error generating ' + name + ':', error.message);
	}
});

