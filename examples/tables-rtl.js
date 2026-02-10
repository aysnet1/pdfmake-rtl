/*eslint no-unused-vars: ["error", {"args": "none"}]*/


var pdfmake = require('../js/index'); // only during development, otherwise use the following line
//var pdfmake = require('pdfmake');

var Roboto = require('../fonts/Roboto');
pdfmake.addFonts(Roboto);

var Cairo = require('../fonts/Cairo');
pdfmake.addFonts(Cairo);


var docDefinition = {

	content: [
		// ═══════════════════════════════════════════════════════════════
		// TITLE
		// ═══════════════════════════════════════════════════════════════
		{ text: 'Comprehensive RTL Tables — All Styles & Languages', style: 'header', alignment: 'center' },
		{ text: 'جداول شاملة متعددة اللغات والأنماط', style: 'header', alignment: 'center' },
		{ text: 'Arabic · French · English · Persian · Urdu', alignment: 'center', margin: [0, 0, 0, 15], color: '#666' },

		// ═══════════════════════════════════════════════════════════════
		// TABLE 1: Five Languages — Auto RTL Detection (no manual alignment)
		// Font and direction are auto-detected from text content
		// ═══════════════════════════════════════════════════════════════
		{ text: 'Table 1: Auto RTL Detection — Five Languages', style: 'subheader' },
		{ text: 'No alignment or direction set — the system auto-detects RTL/LTR from text content and picks Cairo/Roboto automatically.', style: 'description' },
		{
			style: 'tableExample',
			table: {
				widths: ['*', '*', '*', '*', '*'],
				headerRows: 1,
				body: [
					[
						{ text: 'English', style: 'tableHeader', alignment: 'center' },
						{ text: 'العربية', style: 'tableHeader', alignment: 'center' },
						{ text: 'Français', style: 'tableHeader', alignment: 'center' },
						{ text: 'فارسی', style: 'tableHeader', alignment: 'center' },
						{ text: 'اردو', style: 'tableHeader', alignment: 'center' }
					],
					[
						'Hello World',
						'مرحباً بالعالم',
						'Bonjour le monde',
						'سلام دنیا',
						'ہیلو دنیا'
					],
					[
						'Thank you',
						'شكراً لك',
						'Merci beaucoup',
						'متشکرم',
						'شکریہ'
					],
					[
						'Good morning',
						'صباح الخير',
						'Bonjour',
						'صبح بخیر',
						'صبح بخیر'
					],
					[
						'Welcome',
						'أهلاً وسهلاً',
						'Bienvenue',
						'خوش آمدید',
						'خوش آمدید'
					],
					[
						'Goodbye',
						'مع السلامة',
						'Au revoir',
						'خداحافظ',
						'خدا حافظ'
					]
				]
			},
			layout: 'lightHorizontalLines'
		},

		// ═══════════════════════════════════════════════════════════════
		// TABLE 2: Force RTL with table: { rtl: true } — inside table object
		// ═══════════════════════════════════════════════════════════════
		{ text: 'Table 2: Force RTL — table: { rtl: true } (inside table object)', style: 'subheader' },
		{ text: 'rtl: true is set directly on the table object. Columns are reversed and all cells right-aligned automatically.', style: 'description' },
		{
			style: 'tableExample',
			table: {
				rtl: true,
				widths: ['*', '*', '*', '*', '*'],
				headerRows: 1,
				body: [
					[
						{ text: 'اردو', style: 'tableHeader' },
						{ text: 'فارسی', style: 'tableHeader' },
						{ text: 'Français', style: 'tableHeader' },
						{ text: 'العربية', style: 'tableHeader' },
						{ text: 'English', style: 'tableHeader' }
					],
					[
						'پاکستان',
						'ایران',
						'France',
						'مصر',
						'United States'
					],
					[
						'اسلام آباد',
						'تهران',
						'Paris',
						'القاهرة',
						'Washington'
					],
					[
						'اردو زبان',
						'زبان فارسی',
						'Langue française',
						'اللغة العربية',
						'English language'
					]
				]
			}
		},

		// ═══════════════════════════════════════════════════════════════
		// TABLE 2b: Same table WITHOUT rtl — Auto-detect for comparison
		// ═══════════════════════════════════════════════════════════════
		{ text: 'Table 2b: Same Data — Auto-detect (no rtl: true)', style: 'subheader' },
		{ text: 'Same content as Table 2, but without rtl: true. Auto-detect still reverses because >30% cells are RTL.', style: 'description' },
		{
			style: 'tableExample',
			table: {
				widths: ['*', '*', '*', '*', '*'],
				headerRows: 1,
				body: [
					[
						{ text: 'اردو', style: 'tableHeader' },
						{ text: 'فارسی', style: 'tableHeader' },
						{ text: 'Français', style: 'tableHeader' },
						{ text: 'العربية', style: 'tableHeader' },
						{ text: 'English', style: 'tableHeader' }
					],
					[
						'پاکستان',
						'ایران',
						'France',
						'مصر',
						'United States'
					],
					[
						'اسلام آباد',
						'تهران',
						'Paris',
						'القاهرة',
						'Washington'
					],
					[
						'اردو زبان',
						'زبان فارسی',
						'Langue française',
						'اللغة العربية',
						'English language'
					]
				]
			}
		},

		// ═══════════════════════════════════════════════════════════════
		// TABLE 2c: Force RTL on mostly-English table
		// ═══════════════════════════════════════════════════════════════
		{ text: 'Table 2c: Force RTL on English-majority Table', style: 'subheader' },
		{ text: 'This table is mostly English (auto-detect would NOT reverse it). But rtl: true forces RTL layout.', style: 'description' },
		{
			style: 'tableExample',
			table: {
				rtl: true,
				widths: [100, '*', '*'],
				headerRows: 1,
				body: [
					[
						{ text: 'ID', style: 'tableHeader', alignment: 'center' },
						{ text: 'Product Name', style: 'tableHeader' },
						{ text: 'الحالة', style: 'tableHeader' }
					],
					[
						{ text: 'P-001', alignment: 'center' },
						'Premium Web Hosting',
						'نشط'
					],
					[
						{ text: 'P-002', alignment: 'center' },
						'Cloud Storage 500GB',
						'معلق'
					],
					[
						{ text: 'P-003', alignment: 'center' },
						'SSL Certificate',
						'نشط'
					]
				]
			}
		},

		// ═══════════════════════════════════════════════════════════════
		// TABLE 2d: 100% English WITHOUT rtl: true (normal LTR)
		// ═══════════════════════════════════════════════════════════════
		{ text: 'Table 2d: — Without rtl (Normal LTR)', style: 'subheader' },
		{ text: 'Pure English table, no rtl set. Columns render left-to-right as normal.', style: 'description' },
		{
			style: 'tableExample',
			table: {
				widths: [40, '*', 80, 80, 80],
				headerRows: 1,
				body: [
					[
						{ text: '#', style: 'tableHeader', alignment: 'center', fillColor: '#37474F', color: 'white' },
						{ text: 'Employee Name', style: 'tableHeader', fillColor: '#37474F', color: 'white' },
						{ text: 'Department', style: 'tableHeader', alignment: 'center', fillColor: '#37474F', color: 'white' },
						{ text: 'Position', style: 'tableHeader', alignment: 'center', fillColor: '#37474F', color: 'white' },
						{ text: 'Salary', style: 'tableHeader', alignment: 'center', fillColor: '#37474F', color: 'white' }
					],
					[
						{ text: '1', alignment: 'center' },
						'John Smith',
						{ text: 'Engineering', alignment: 'center' },
						{ text: 'Senior Dev', alignment: 'center' },
						{ text: '$95,000', alignment: 'center' }
					],
					[
						{ text: '2', alignment: 'center', fillColor: '#F5F5F5' },
						{ text: 'Sarah Johnson', fillColor: '#F5F5F5' },
						{ text: 'Marketing', alignment: 'center', fillColor: '#F5F5F5' },
						{ text: 'Manager', alignment: 'center', fillColor: '#F5F5F5' },
						{ text: '$88,000', alignment: 'center', fillColor: '#F5F5F5' }
					],
					[
						{ text: '3', alignment: 'center' },
						'Michael Brown',
						{ text: 'Sales', alignment: 'center' },
						{ text: 'Director', alignment: 'center' },
						{ text: '$102,000', alignment: 'center' }
					],
					[
						{ text: '4', alignment: 'center', fillColor: '#F5F5F5' },
						{ text: 'Emily Davis', fillColor: '#F5F5F5' },
						{ text: 'Design', alignment: 'center', fillColor: '#F5F5F5' },
						{ text: 'Lead', alignment: 'center', fillColor: '#F5F5F5' },
						{ text: '$91,000', alignment: 'center', fillColor: '#F5F5F5' }
					],
					[
						{ text: '5', alignment: 'center' },
						'Robert Wilson',
						{ text: 'Finance', alignment: 'center' },
						{ text: 'Analyst', alignment: 'center' },
						{ text: '$78,000', alignment: 'center' }
					]
				]
			}
		},

		// ═══════════════════════════════════════════════════════════════
		// TABLE 2e: 100% English WITH rtl: true (forced RTL)
		// ═══════════════════════════════════════════════════════════════
		{ text: 'Table 2e: 100% English — With rtl: true (Forced RTL)', style: 'subheader' },
		{ text: 'Exact same data as Table 2d, but with rtl: true. Columns are reversed: Salary appears first (left), # appears last (right).', style: 'description' },
		{
			style: 'tableExample',
			table: {
				rtl: true,
				widths: [40, '*', 80, 80, 80],
				headerRows: 1,
				body: [
					[
						{ text: '#', style: 'tableHeader', alignment: 'center', fillColor: '#1565C0', color: 'white' },
						{ text: 'Employee Name', style: 'tableHeader', fillColor: '#1565C0', color: 'white' },
						{ text: 'Department', style: 'tableHeader', alignment: 'center', fillColor: '#1565C0', color: 'white' },
						{ text: 'Position', style: 'tableHeader', alignment: 'center', fillColor: '#1565C0', color: 'white' },
						{ text: 'Salary', style: 'tableHeader', alignment: 'center', fillColor: '#1565C0', color: 'white' }
					],
					[
						{ text: '1', alignment: 'center' },
						'John Smith',
						{ text: 'Engineering', alignment: 'center' },
						{ text: 'Senior Dev', alignment: 'center' },
						{ text: '$95,000', alignment: 'center' }
					],
					[
						{ text: '2', alignment: 'center', fillColor: '#E3F2FD' },
						{ text: 'Sarah Johnson', fillColor: '#E3F2FD' },
						{ text: 'Marketing', alignment: 'center', fillColor: '#E3F2FD' },
						{ text: 'Manager', alignment: 'center', fillColor: '#E3F2FD' },
						{ text: '$88,000', alignment: 'center', fillColor: '#E3F2FD' }
					],
					[
						{ text: '3', alignment: 'center' },
						'Michael Brown',
						{ text: 'Sales', alignment: 'center' },
						{ text: 'Director', alignment: 'center' },
						{ text: '$102,000', alignment: 'center' }
					],
					[
						{ text: '4', alignment: 'center', fillColor: '#E3F2FD' },
						{ text: 'Emily Davis', fillColor: '#E3F2FD' },
						{ text: 'Design', alignment: 'center', fillColor: '#E3F2FD' },
						{ text: 'Lead', alignment: 'center', fillColor: '#E3F2FD' },
						{ text: '$91,000', alignment: 'center', fillColor: '#E3F2FD' }
					],
					[
						{ text: '5', alignment: 'center' },
						'Robert Wilson',
						{ text: 'Finance', alignment: 'center' },
						{ text: 'Analyst', alignment: 'center' },
						{ text: '$78,000', alignment: 'center' }
					]
				]
			}
		},

		// ═══════════════════════════════════════════════════════════════
		// TABLE 3: Per-Cell alignment — Mixed RTL/LTR in same table
		// ═══════════════════════════════════════════════════════════════
		{ text: 'Table 3: Per-Cell Custom Alignment — Mixed RTL/LTR', style: 'subheader' },
		{ text: 'Each cell has its own alignment. RTL cells use alignment: \'right\', LTR cells use alignment: \'left\'.', style: 'description' },
		{
			style: 'tableExample',
			table: {
				widths: [80, '*', '*'],
				headerRows: 1,
				body: [
					[
						{ text: 'Language', style: 'tableHeader', alignment: 'center' },
						{ text: 'Greeting', style: 'tableHeader', alignment: 'center' },
						{ text: 'Farewell', style: 'tableHeader', alignment: 'center' }
					],
					[
						{ text: 'العربية', alignment: 'right', bold: true },
						{ text: 'السلام عليكم ورحمة الله وبركاته', alignment: 'right' },
						{ text: 'مع السلامة يا صديقي العزيز', alignment: 'right' }
					],
					[
						{ text: 'English', alignment: 'left', bold: true },
						{ text: 'Hello and welcome to our meeting', alignment: 'left' },
						{ text: 'Goodbye and see you next time', alignment: 'left' }
					],
					[
						{ text: 'Français', alignment: 'left', bold: true },
						{ text: 'Bonjour et bienvenue à notre réunion', alignment: 'left' },
						{ text: 'Au revoir et à la prochaine', alignment: 'left' }
					],
					[
						{ text: 'فارسی', alignment: 'right', bold: true },
						{ text: 'سلام و خوش آمدید به جلسه ما', alignment: 'right' },
						{ text: 'خداحافظ و تا دیدار بعدی', alignment: 'right' }
					],
					[
						{ text: 'اردو', alignment: 'right', bold: true },
						{ text: 'السلام علیکم اور خوش آمدید', alignment: 'right' },
						{ text: 'خدا حافظ اور پھر ملیں گے', alignment: 'right' }
					]
				]
			}
		},

		// ═══════════════════════════════════════════════════════════════
		// TABLE 4: Styled Rows — alternating fillColor + bold/italic
		// ═══════════════════════════════════════════════════════════════
		{ text: 'Table 4: Styled Rows — Colors, Bold, Italics', style: 'subheader' },
		{ text: 'Alternating row colors with bold and italic styling per language. Font auto-detected.', style: 'description' },
		{
			style: 'tableExample',
			rtl: true, // Force RTL for this table to demonstrate auto-alignment + column reversal with styling
			table: {
				widths: [30, '*', '*', '*', '*', '*'],
				headerRows: 1,
				body: [
					[
						{ text: '#', style: 'tableHeader', fillColor: '#37474F', color: 'white', alignment: 'center' },
						{ text: 'English', style: 'tableHeader', fillColor: '#37474F', color: 'white', alignment: 'center' },
						{ text: 'العربية', style: 'tableHeader', fillColor: '#37474F', color: 'white', alignment: 'center' },
						{ text: 'Français', style: 'tableHeader', fillColor: '#37474F', color: 'white', alignment: 'center' },
						{ text: 'فارسی', style: 'tableHeader', fillColor: '#37474F', color: 'white', alignment: 'center' },
						{ text: 'اردو', style: 'tableHeader', fillColor: '#37474F', color: 'white', alignment: 'center' }
					],
					[
						{ text: '1', alignment: 'center', fillColor: '#E3F2FD' },
						{ text: 'Book', fillColor: '#E3F2FD' },
						{ text: 'كتاب', fillColor: '#E3F2FD', bold: true },
						{ text: 'Livre', fillColor: '#E3F2FD' },
						{ text: 'کتاب', fillColor: '#E3F2FD', bold: true },
						{ text: 'کتاب', fillColor: '#E3F2FD', bold: true }
					],
					[
						{ text: '2', alignment: 'center' },
						{ text: 'School', italics: true },
						{ text: 'مدرسة', bold: true },
						{ text: 'École', italics: true },
						{ text: 'مدرسه', bold: true },
						{ text: 'مدرسہ', bold: true }
					],
					[
						{ text: '3', alignment: 'center', fillColor: '#E3F2FD' },
						{ text: 'Computer', fillColor: '#E3F2FD' },
						{ text: 'حاسوب', fillColor: '#E3F2FD', bold: true },
						{ text: 'Ordinateur', fillColor: '#E3F2FD' },
						{ text: 'رایانه', fillColor: '#E3F2FD', bold: true },
						{ text: 'کمپیوٹر', fillColor: '#E3F2FD', bold: true }
					],
					[
						{ text: '4', alignment: 'center' },
						{ text: 'University' },
						{ text: 'جامعة', bold: true },
						{ text: 'Université' },
						{ text: 'دانشگاه', bold: true },
						{ text: 'یونیورسٹی', bold: true }
					],
					[
						{ text: '5', alignment: 'center', fillColor: '#E3F2FD' },
						{ text: 'Hospital', fillColor: '#E3F2FD' },
						{ text: 'مستشفى', fillColor: '#E3F2FD', bold: true },
						{ text: 'Hôpital', fillColor: '#E3F2FD' },
						{ text: 'بیمارستان', fillColor: '#E3F2FD', bold: true },
						{ text: 'ہسپتال', fillColor: '#E3F2FD', bold: true }
					]
				]
			}
		},

		// ═══════════════════════════════════════════════════════════════
		// TABLE 5: ColSpan & RowSpan — Complex merge with RTL
		// ═══════════════════════════════════════════════════════════════
		{ text: 'Table 5: ColSpan & RowSpan — Complex Merge with RTL', style: 'subheader' },
		{ text: 'Demonstrates column spanning and row spanning with mixed RTL/LTR content.', style: 'description' },
		{
			style: 'tableExample',
			table: {
				widths: ['*', '*', '*', '*'],
				headerRows: 1,
				body: [
					[
						{ text: 'معلومات الطالب — Student Information', style: 'tableHeader', colSpan: 4, alignment: 'center', fillColor: '#1565C0', color: 'white' },
						{}, {}, {}
					],
					[
						{ text: 'الاسم / Name', bold: true, alignment: 'center', fillColor: '#E8EAF6' },
						{ text: 'البلد / Country', bold: true, alignment: 'center', fillColor: '#E8EAF6' },
						{ text: 'اللغة / Langue', bold: true, alignment: 'center', fillColor: '#E8EAF6' },
						{ text: 'الدرجة / Grade', bold: true, alignment: 'center', fillColor: '#E8EAF6' }
					],
					[
						{ text: 'أحمد محمد', alignment: 'right' },
						{ text: 'مصر — Egypt', alignment: 'center' },
						{ text: 'العربية', alignment: 'right' },
						{ text: 'A+', alignment: 'center', bold: true, color: '#2E7D32' }
					],
					[
						{ text: 'Pierre Dupont', alignment: 'left' },
						{ text: 'France', alignment: 'center' },
						{ text: 'Français', alignment: 'left' },
						{ text: 'A', alignment: 'center', bold: true, color: '#2E7D32' }
					],
					[
						{ text: 'علی رضایی', alignment: 'right' },
						{ text: 'ایران — Iran', alignment: 'center' },
						{ text: 'فارسی', alignment: 'right' },
						{ text: 'B+', alignment: 'center', bold: true, color: '#F57F17' }
					],
					[
						{ text: 'عمران خان', alignment: 'right' },
						{ text: 'پاکستان — Pakistan', alignment: 'center' },
						{ text: 'اردو', alignment: 'right' },
						{ text: 'A', alignment: 'center', bold: true, color: '#2E7D32' }
					],
					[
						{ text: 'المعدل العام / Overall GPA: 3.85', colSpan: 4, alignment: 'center', bold: true, fillColor: '#C8E6C9' },
						{}, {}, {}
					]
				]
			}
		},

		// ═══════════════════════════════════════════════════════════════
		// TABLE 6: Nested Tables — Table inside Table with RTL
		// ═══════════════════════════════════════════════════════════════
		{ text: 'Table 6: Nested Tables — Arabic & French Details', style: 'subheader' },
		{ text: 'A table with inner sub-tables. Each sub-table has its own style. Auto RTL detects font per cell.', style: 'description' },
		{
			style: 'tableExample',
			table: {
				widths: ['*', '*'],
				headerRows: 1,
				body: [
					[
						{ text: 'القسم العربي / Arabic Section', style: 'tableHeader', alignment: 'center', fillColor: '#FFF3E0' },
						{ text: 'Section Française / French Section', style: 'tableHeader', alignment: 'center', fillColor: '#E8EAF6' }
					],
					[
						{
							stack: [
								{ text: 'المعلومات الشخصية', bold: true, alignment: 'right', margin: [0, 0, 0, 5] },
								{
									table: {
										widths: ['*', 80],
										body: [
											[
												{ text: 'الاسم', alignment: 'right', bold: true, fillColor: '#FFF3E0' },

												{ text: 'محمد أحمد العلي', alignment: 'right' },
											],
											[
												{ text: 'المدينة', alignment: 'right', bold: true, fillColor: '#FFF3E0' },
												{ text: 'القاهرة، مصر', alignment: 'right' },

											],
											[
												{ text: 'المهنة', alignment: 'right', bold: true, fillColor: '#FFF3E0' },
												{ text: 'مهندس برمجيات', alignment: 'right' },
											]
										]
									}
								}
							]
						},
						{
							stack: [
								{ text: 'Information personnelles', bold: true, margin: [0, 0, 0, 5] },
								{
									table: {
										widths: [80, '*'],
										body: [
											[
												{ text: 'Nom', bold: true, fillColor: '#E8EAF6' },
												'Pierre Dupont'
											],
											[
												{ text: 'Ville', bold: true, fillColor: '#E8EAF6' },
												'Paris, France'
											],
											[
												{ text: 'Métier', bold: true, fillColor: '#E8EAF6' },
												'Ingénieur logiciel'
											]
										]
									}
								}
							]
						}
					],
					[
						{
							stack: [
								{ text: 'المهارات', bold: true, alignment: 'right', margin: [0, 5, 0, 5] },
								{
									alignment: 'right',
									ul: [
										'تطوير تطبيقات الويب',
										'قواعد البيانات',
										'الذكاء الاصطناعي'
									]
								}
							]
						},
						{
							stack: [
								{ text: 'Compétences', bold: true, margin: [0, 5, 0, 5] },
								{
									ul: [
										'Développement web',
										'Bases de données',
										'Intelligence artificielle'
									]
								}
							]
						}
					]
				]
			}
		},

		// ═══════════════════════════════════════════════════════════════
		// TABLE 7: Custom Font per Cell — Overriding auto-detect
		// ═══════════════════════════════════════════════════════════════
		{ text: 'Table 7: Custom Font Override — font: \'Cairo\' on LTR, font: \'Roboto\' Explicitly', style: 'subheader' },
		{ text: 'Demonstrates that item-level font overrides auto-detection. French text forced to Cairo, Arabic text forced to Roboto.', style: 'description' },
		{
			style: 'tableExample',
			table: {
				widths: ['*', '*', '*'],
				headerRows: 1,
				body: [
					[
						{ text: 'Text', style: 'tableHeader', alignment: 'center' },
						{ text: 'Font Used', style: 'tableHeader', alignment: 'center' },
						{ text: 'Mode', style: 'tableHeader', alignment: 'center' }
					],
					[
						'Bonjour le monde',
						'Roboto (auto)',
						'Auto-detect'
					],
					[
						{ text: 'Bonjour le monde', font: 'Cairo' },
						'Cairo (forced)',
						'Custom font override'
					],
					[
						'مرحباً بالعالم',
						'Cairo (auto)',
						'Auto-detect'
					],
					[
						{ text: 'مرحباً بالعالم', font: 'Roboto' },
						'Roboto (forced)',
						'Custom font override'
					],
					[
						'Hello World',
						'Roboto (auto)',
						'Auto-detect'
					],
					[
						{ text: 'Hello World', font: 'Cairo' },
						'Cairo (forced)',
						'Custom font override'
					]
				]
			}
		},

		// ═══════════════════════════════════════════════════════════════
		// TABLE 8: Named Styles — Using style definitions for RTL
		// ═══════════════════════════════════════════════════════════════
		{ text: 'Table 8: Named Styles — RTL Styles via Style Definitions', style: 'subheader' },
		{ text: 'Cells use named styles (arabicCell, persianCell, urduCell, frenchCell) defined in the styles object.', style: 'description' },
		{
			style: 'tableExample',
			table: {
				widths: ['*', '*', '*', '*'],
				headerRows: 1,
				body: [
					[
						{ text: 'العربية', style: ['tableHeader', 'rtlHeader'] },
						{ text: 'فارسی', style: ['tableHeader', 'rtlHeader'] },
						{ text: 'اردو', style: ['tableHeader', 'rtlHeader'] },
						{ text: 'Français', style: ['tableHeader', 'ltrHeader'] }
					],
					[
						{ text: 'التعليم الإلكتروني', style: 'arabicCell' },
						{ text: 'آموزش الکترونیکی', style: 'persianCell' },
						{ text: 'آن لائن تعلیم', style: 'urduCell' },
						{ text: 'Apprentissage en ligne', style: 'frenchCell' }
					],
					[
						{ text: 'الذكاء الاصطناعي', style: 'arabicCell' },
						{ text: 'هوش مصنوعی', style: 'persianCell' },
						{ text: 'مصنوعی ذہانت', style: 'urduCell' },
						{ text: 'Intelligence artificielle', style: 'frenchCell' }
					],
					[
						{ text: 'الحوسبة السحابية', style: 'arabicCell' },
						{ text: 'رایانش ابری', style: 'persianCell' },
						{ text: 'کلاؤڈ کمپیوٹنگ', style: 'urduCell' },
						{ text: 'Cloud computing', style: 'frenchCell' }
					],
					[
						{ text: 'أمن المعلومات', style: 'arabicCell' },
						{ text: 'امنیت اطلاعات', style: 'persianCell' },
						{ text: 'انفارمیشن سیکیورٹی', style: 'urduCell' },
						{ text: 'Sécurité informatique', style: 'frenchCell' }
					]
				]
			}
		},

		// ═══════════════════════════════════════════════════════════════
		// TABLE 9: defaultStyle font — All text uses Cairo unless overridden
		// ═══════════════════════════════════════════════════════════════
		{ text: 'Table 9: defaultStyle Font Priority Test', style: 'subheader' },
		{ text: 'This document uses defaultStyle: { font: \'Roboto\' }. Auto-detect picks Cairo for Arabic text. Explicit font: \'Cairo\' overrides for English.', style: 'description' },
		{
			style: 'tableExample',
			table: {
				widths: ['*', '*', '*'],
				headerRows: 1,
				body: [
					[
						{ text: 'Content', style: 'tableHeader', alignment: 'center' },
						{ text: 'Font Source', style: 'tableHeader', alignment: 'center' },
						{ text: 'Priority Level', style: 'tableHeader', alignment: 'center' }
					],
					[
						'Hello World',
						'defaultStyle → Roboto',
						'Level 3: defaultStyle'
					],
					[
						'مرحباً بالعالم',
						'Auto-detect → Cairo',
						'Level 4: Auto-detect'
					],
					[
						{ text: 'Hello World', font: 'Cairo' },
						'Item font → Cairo',
						'Level 1: Item font'
					],
					[
						{ text: 'Styled Text', style: 'frenchCell' },
						'Named style → Roboto',
						'Level 2: Named style'
					]
				]
			}
		},

		// ═══════════════════════════════════════════════════════════════
		// TABLE 10: Force RTL with table: { rtl: true } — Ordered List inside cells
		// ═══════════════════════════════════════════════════════════════
		{ text: 'Table 10: RTL Table with Ordered Lists Inside Cells', style: 'subheader' },
		{ text: 'Uses table: { rtl: true }. Each cell contains an ordered list in different languages.', style: 'description' },
		{
			style: 'tableExample',
			table: {
				rtl: true,
				widths: ['*', '*'],
				headerRows: 1,
				body: [
					[
						{ text: 'خطوات عربية', style: 'tableHeader', alignment: 'center', fillColor: '#E8EAF6' },
						{ text: 'مراحل فارسی', style: 'tableHeader', alignment: 'center', fillColor: '#FFF3E0' }
					],
					[
						{
							ol: [
								'تحليل المتطلبات',
								'تصميم النظام',
								'تطوير البرمجيات',
								'اختبار الجودة',
								'النشر والصيانة'
							]
						},
						{
							ol: [
								'تحلیل نیازها',
								'طراحی سیستم',
								'توسعه نرم‌افزار',
								'آزمایش کیفیت',
								'استقرار و نگهداری'
							]
						}
					],
					[
						{ text: 'قائمة اردو', style: 'tableHeader', alignment: 'center', fillColor: '#E0F2F1' },
						{ text: 'English Steps', style: 'tableHeader', alignment: 'center', fillColor: '#FCE4EC' }
					],
					[
						{
							ol: [
								'ضروریات کا تجزیہ',
								'نظام کی ڈیزائننگ',
								'سافٹ ویئر ڈویلپمنٹ',
								'کوالٹی ٹیسٹنگ',
								'تعیناتی اور دیکھ بھال'
							]
						},
						{
							direction: 'ltr',
							alignment: 'left',
							ol: [
								'Requirements Analysis',
								'System Design',
								'Software Development',
								'Quality Testing',
								'Deployment & Maintenance'
							]
						}
					]
				]
			}
		},

		// ═══════════════════════════════════════════════════════════════
		// TABLE 11: Mixed Inline Text inside Table Cells
		// ═══════════════════════════════════════════════════════════════
		{ text: 'Table 11: Mixed Inline Text in Cells — Multi-script in One Cell', style: 'subheader' },
		{ text: 'Each cell contains mixed Arabic/Latin inline text with different colors and styles.', style: 'description' },
		{
			style: 'tableExample',
			table: {
				widths: ['*', '*'],
				headerRows: 1,
				body: [
					[
						{ text: 'Description', style: 'tableHeader', alignment: 'center' },
						{ text: 'Mixed Content', style: 'tableHeader', alignment: 'center' }
					],
					[
						'Arabic + English',
						{
							text: [
								{ text: 'المشروع ', bold: true, color: '#1565C0' },
								'Project Alpha ',
								{ text: 'يبدأ في ', color: '#666' },
								{ text: '2026', bold: true }
							]
						}
					],
					[
						'Persian + French',
						{
							text: [
								{ text: 'برنامه ', bold: true, color: '#2E7D32' },
								'Programme ',
								{ text: 'شروع می‌شود ', color: '#666' },
								{ text: 'bientôt', italics: true }
							]
						}
					],
					[
						'Urdu + English',
						{
							text: [
								{ text: 'پروجیکٹ ', bold: true, color: '#E65100' },
								'Development ',
								{ text: 'شروع ہوتا ہے ', color: '#666' },
								{ text: 'soon', italics: true }
							]
						}
					],
					[
						'All Five Languages',
						{
							text: [
								{ text: 'Hello ', color: '#1565C0' },
								{ text: 'مرحباً ', color: '#2E7D32', bold: true },
								{ text: 'Bonjour ', color: '#E65100' },
								{ text: 'سلام ', color: '#6A1B9A', bold: true },
								{ text: 'ہیلو', color: '#C62828', bold: true }
							]
						}
					]
				]
			}
		},

		// ═══════════════════════════════════════════════════════════════
		// TABLE 12: Full Complex Table — Invoice/Report Style
		// ═══════════════════════════════════════════════════════════════
		{ text: 'Table 12: Complex Invoice / فاتورة — Full RTL Report', style: 'subheader' },
		{ text: 'A realistic invoice table with header, items, totals, and bilingual labels.', style: 'description' },
		{
			style: 'tableExample',
			table: {
				rtl: true,
				widths: [30, '*', 60, 60, 80],
				headerRows: 2,
				body: [
					[
						{ text: 'فاتورة — Invoice #2026-001', colSpan: 5, alignment: 'center', bold: true, fontSize: 14, fillColor: '#1565C0', color: 'white', margin: [0, 5, 0, 5] },
						{}, {}, {}, {}
					],
					[
						{ text: '#', style: 'tableHeader', alignment: 'center', fillColor: '#E8EAF6' },
						{ text: 'الوصف / Description', style: 'tableHeader', alignment: 'center', fillColor: '#E8EAF6' },
						{ text: 'الكمية / Qty', style: 'tableHeader', alignment: 'center', fillColor: '#E8EAF6' },
						{ text: 'السعر / Price', style: 'tableHeader', alignment: 'center', fillColor: '#E8EAF6' },
						{ text: 'المجموع / Total', style: 'tableHeader', alignment: 'center', fillColor: '#E8EAF6' }
					],
					[
						{ text: '1', alignment: 'center' },
						{ text: 'تطوير موقع إلكتروني — Website Development', alignment: 'right' },
						{ text: '1', alignment: 'center' },
						{ text: '$5,000', alignment: 'center' },
						{ text: '$5,000', alignment: 'center', bold: true }
					],
					[
						{ text: '2', alignment: 'center' },
						{ text: 'تصميم واجهة المستخدم — UI/UX Design', alignment: 'right' },
						{ text: '1', alignment: 'center' },
						{ text: '$3,000', alignment: 'center' },
						{ text: '$3,000', alignment: 'center', bold: true }
					],
					[
						{ text: '3', alignment: 'center' },
						{ text: 'Hébergement cloud — استضافة سحابية', alignment: 'right' },
						{ text: '12', alignment: 'center' },
						{ text: '$100', alignment: 'center' },
						{ text: '$1,200', alignment: 'center', bold: true }
					],
					[
						{ text: '4', alignment: 'center' },
						{ text: 'پشتیبانی فنی — Support technique', alignment: 'right' },
						{ text: '6', alignment: 'center' },
						{ text: '$200', alignment: 'center' },
						{ text: '$1,200', alignment: 'center', bold: true }
					],
					[
						{ text: '', border: [false, false, false, false] },
						{ text: '', border: [false, false, false, false] },
						{ text: '', border: [false, false, false, false] },
						{ text: 'المجموع الفرعي\nSubtotal', alignment: 'center', bold: true, fillColor: '#F5F5F5' },
						{ text: '$10,400', alignment: 'center', bold: true, fillColor: '#F5F5F5' }
					],
					[
						{ text: '', border: [false, false, false, false] },
						{ text: '', border: [false, false, false, false] },
						{ text: '', border: [false, false, false, false] },
						{ text: 'الضريبة / Tax\n(10%)', alignment: 'center', fillColor: '#F5F5F5' },
						{ text: '$1,040', alignment: 'center', fillColor: '#F5F5F5' }
					],
					[
						{ text: '', border: [false, false, false, false] },
						{ text: '', border: [false, false, false, false] },
						{ text: '', border: [false, false, false, false] },
						{ text: 'الإجمالي\nGrand Total', alignment: 'center', bold: true, fillColor: '#C8E6C9', fontSize: 12 },
						{ text: '$11,440', alignment: 'center', bold: true, fillColor: '#C8E6C9', fontSize: 14, color: '#1B5E20' }
					]
				]
			}
		},

		// ═══════════════════════════════════════════════════════════════
		// TABLE 13: Unordered Lists in Styled Table
		// ═══════════════════════════════════════════════════════════════
		{ text: 'Table 13: Unordered Lists — Styled UL in Five Languages', style: 'subheader' },
		{ text: 'Each column has a bullet list in a different language. Auto RTL detection handles alignment.', style: 'description' },
		{
			style: 'tableExample',
			table: {
				widths: ['*', '*', '*'],
				headerRows: 1,
				body: [
					[
						{ text: 'العربية — Arabic', style: 'tableHeader', alignment: 'center', fillColor: '#E3F2FD' },
						{ text: 'Français — French', style: 'tableHeader', alignment: 'center', fillColor: '#FFF3E0' },
						{ text: 'فارسی — Persian', style: 'tableHeader', alignment: 'center', fillColor: '#E8F5E9' }
					],
					[
						{
							alignment: 'right',
							ul: [
								'تحليل البيانات',
								'التعلم الآلي',
								'معالجة اللغة الطبيعية',
								{ text: 'الشبكات العصبية', bold: true }
							]
						},
						{
							ul: [
								'Analyse de données',
								'Apprentissage automatique',
								'Traitement du langauge naturel',
								{ text: 'Réseaux neuronaux', bold: true }
							]
						},
						{
							alignment: 'right',
							ul: [
								'تحلیل داده‌ها',
								'یادگیری ماشینی',
								'پردازش زبان طبیعی',
								{ text: 'شبکه‌های عصبی', bold: true }
							]
						}
					]
				]
			}
		},

		// ═══════════════════════════════════════════════════════════════
		// TABLE 14: table: { rtl: true } with alignment:'right' combined
		// ═══════════════════════════════════════════════════════════════
		{ text: 'Table 14: rtl: true + alignment Combined', style: 'subheader' },
		{ text: 'Table uses table: { rtl: true } AND explicit alignment: \'right\'. Both properties work together.', style: 'description' },
		{
			style: 'tableExample',
			alignment: 'right',
			table: {
				rtl: true,
				widths: ['*', '*', '*'],
				headerRows: 1,
				body: [
					[
						{ text: 'العمود الأول', style: 'tableHeader', alignment: 'center' },
						{ text: 'العمود الثاني', style: 'tableHeader', alignment: 'center' },
						{ text: 'العمود الثالث', style: 'tableHeader', alignment: 'center' }
					],
					[
						'بيانات عربية في العمود الأول',
						'محتوى العمود الثاني بالعربية',
						'نص عربي في العمود الثالث'
					],
					[
						'داده‌های فارسی در ستون اول',
						'محتوای ستون دوم به فارسی',
						'متن فارسی در ستون سوم'
					],
					[
						'پہلے کالم میں اردو ڈیٹا',
						'دوسرے کالم میں اردو مواد',
						'تیسرے کالم میں اردو متن'
					]
				]
			}
		},

		// ═══════════════════════════════════════════════════════════════
		// TABLE 15: Colored Borders & Custom Layout
		// ═══════════════════════════════════════════════════════════════
		{ text: 'Table 15: Custom Layout — Colored Borders & No Lines', style: 'subheader' },
		{ text: 'Uses custom layout functions for colored header borders and alternating row fills.', style: 'description' },
		{
			style: 'tableExample',
			table: {
				widths: ['*', '*', '*', '*', '*'],
				headerRows: 1,
				body: [
					[
						{ text: 'EN', bold: true, alignment: 'center' },
						{ text: 'AR', bold: true, alignment: 'center' },
						{ text: 'FR', bold: true, alignment: 'center' },
						{ text: 'FA', bold: true, alignment: 'center' },
						{ text: 'UR', bold: true, alignment: 'center' }
					],
					[
						'Peace',
						'سلام',
						'Paix',
						'صلح',
						'امن'
					],
					[
						'Freedom',
						'حرية',
						'Liberté',
						'آزادی',
						'آزادی'
					],
					[
						'Justice',
						'عدالة',
						'Justice',
						'عدالت',
						'انصاف'
					],
					[
						'Knowledge',
						'معرفة',
						'Connaissance',
						'دانش',
						'علم'
					],
					[
						'Friendship',
						'صداقة',
						'Amitié',
						'دوستی',
						'دوستی'
					]
				]
			},
			layout: {
				hLineWidth: function (i, node) {
					return (i === 0 || i === 1 || i === node.table.body.length) ? 2 : 0.5;
				},
				vLineWidth: function () {
					return 0;
				},
				hLineColor: function (i) {
					return (i === 0 || i === 1) ? '#1565C0' : '#E0E0E0';
				},
				fillColor: function (rowIndex) {
					if (rowIndex === 0) { return '#E3F2FD'; }
					return (rowIndex % 2 === 0) ? '#FAFAFA' : null;
				},
				paddingTop: function () { return 6; },
				paddingBottom: function () { return 6; }
			}
		}
	],

	// ═══════════════════════════════════════════════════════════════
	// STYLES
	// ═══════════════════════════════════════════════════════════════
	styles: {
		header: {
			fontSize: 18,
			bold: true,
			margin: [0, 0, 0, 5]
		},
		subheader: {
			fontSize: 14,
			bold: true,
			margin: [0, 20, 0, 3],
			color: '#1565C0'
		},
		description: {
			fontSize: 9,
			italics: true,
			color: '#888',
			margin: [0, 0, 0, 5]
		},
		tableExample: {
			margin: [0, 5, 0, 10]
		},
		tableHeader: {
			bold: true,
			fontSize: 11,
			color: '#333'
		},
		// RTL named styles
		rtlHeader: {
			alignment: 'center',
			fillColor: '#E8EAF6'
		},
		ltrHeader: {
			alignment: 'center',
			fillColor: '#FFF3E0'
		},
		arabicCell: {
			alignment: 'right',
			color: '#1565C0'
		},
		persianCell: {
			alignment: 'right',
			color: '#2E7D32'
		},
		urduCell: {
			alignment: 'right',
			color: '#E65100'
		},
		frenchCell: {
			alignment: 'left',
			color: '#6A1B9A'
		},
		sectionHeader: {
			fontSize: 12,
			bold: true,
			margin: [0, 10, 0, 5]
		}
	},
	defaultStyle: {
		fontSize: 10
	}
};

var now = new Date();

var pdf = pdfmake.createPdf(docDefinition);
pdf.write('examples/pdfs/tables-rtl.pdf').then(() => {
	console.log(new Date() - now);
}, err => {
	console.error(err);
});
