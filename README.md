# PDFMake RTL 
[![npm version](https://badge.fury.io/js/pdfmake-rtl.svg)](https://badge.fury.io/js/pdfmake-rtl)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


**PDFMake RTL** is an enhanced version of PDFMake with **automatic RTL (Right-to-Left) language support** for Arabic, Persian (Farsi), Urdu, and other RTL scripts. No manual configuration needed - just write your content and the library automatically detects and handles RTL text!

All existing PDFMake code works unchanged, with automatic RTL support added!

## 🚀 Key Features

- ✅ **Automatic RTL Detection** - No need to set `supportRTL` flags
- ✅ **Smart Table Column Reversal** - Arabic/Persian/Urdu tables automatically reverse columns  
- ✅ **Unicode Script Detection** - Supports Arabic, Persian, Urdu, and extensions
- ✅ **Automatic Font Selection** - Uses appropriate fonts per language
- ✅ **Proper Text Alignment** - RTL text aligns right, LTR text aligns left
- ✅ **List Bullet Positioning** - Bullets positioned correctly for RTL lists
- ✅ **Mixed Content Support** - Handles Arabic/Persian/Urdu/English mixed content
- ✅ **100% PDFMake Compatible** - Drop-in replacement for PDFMake


## 🌐 Live Demo

👉 [View Live Demo on Netlify](https://pdfmake-rtl.netlify.app)

## 📦 Installation

```bash
npm install pdfmake-rtl
```



## 🎯 Quick Start NodeJs

```javascript
const PdfPrinter = require('pdfmake-rtl');

const fonts = {
  Roboto: {
    normal: './fonts/Roboto-Regular.ttf',
    bold: './fonts/Roboto-Medium.ttf',
  },
  Amiri: {
    normal: './fonts/Amiri-Regular.ttf',
    bold: './fonts/Amiri-Bold.ttf',
  }
};

const printer = new PdfPrinter(fonts);

const docDefinition = {
    // force RTL
  // supportRTL:true,
  content: [
    // English text - automatically aligned left
    'This English text will automatically align left',
    
    // Arabic text - automatically aligned right  
    'هذا النص العربي سيظهر تلقائياً من اليمين إلى اليسار',
    
    // Arabic table - columns automatically reversed
    {
      table: {
        body: [
          ['الاسم الأول', 'الاسم الأخير', 'العمر'],
          ['أحمد', 'محمد', '٢٥'],
          ['فاطمة', 'علي', '٣٠']
        ]
      }
    }
  ]
};

const pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(fs.createWriteStream('document.pdf'));
pdfDoc.end();
```
## 💻 Client-Side Usage

### Browser Integration

Include the RTL-enabled PDFMake in your HTML:

```html
<!DOCTYPE html>
<html>
<head>
    <title>PDFMake RTL Client Example</title>
    <script src="https://unpkg.com/pdfmake-rtl/build/pdfmake.min.js"></script>
    <script src="https://unpkg.com/pdfmake-rtl/build/vfs_fonts.js"></script>
</head>
<body>
    <script>
    
      pdfMake.vfs = vfs;
      pdfMake.fonts = {
        
        Nillima: {
          normal: 'Nillima.ttf',
          bold: 'Nillima.ttf',
          italics: 'Nillima.ttf',
          bolditalics: 'Nillima.ttf',
        },
        Roboto: {
          normal: 'Roboto-Regular.ttf',
          bold: 'Roboto-Medium.ttf',
          italics: 'Roboto-Italic.ttf',
          bolditalics: 'Roboto-MediumItalic.ttf',
        },
      };
        // Arabic/Persian/Urdu content with automatic RTL detection
        const docDefinition = {
             // force RTL
            // supportRTL:true,
            content: [
                // English text (auto-detected as LTR)
                { text: 'English Title', style: 'header' },
                
                // Arabic text (auto-detected as RTL)  
                { text: 'العنوان العربي', style: 'header' },
                
                // Persian text (auto-detected as RTL)
                { text: 'عنوان فارسی', style: 'header' },
                
                // Urdu text (auto-detected as RTL)
                { text: 'اردو عنوان', style: 'header' },
                
                // Mixed content table (auto-detects direction per cell)
                {
                    table: {
                        widths: ['*', '*', '*'],
                        body: [
                            ['Name', 'الاسم', 'نام'],           // Headers
                            ['Ahmed', 'أحمد', 'احمد'],          // Arabic/Persian names
                            ['Fatima', 'فاطمة', 'فاطمہ'],      // Mixed scripts
                            ['Hassan', 'حسن', 'حسن']           // Common across languages
                        ]
                    }
                },
                
                // RTL list (bullets auto-positioned)
                {
                    ul: [
                        'Arabic: العنصر الأول',
                        'Persian: مورد اول', 
                        'Urdu: پہلا آئٹم',
                        'Mixed: Item واحد'
                    ]
                }
            ],
            
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10]
                }
            }
        };

        // Generate and download PDF
        function createPDF() {
            pdfMake.createPdf(docDefinition).download('rtl-document.pdf');
        }
        
        // Or open in new window
        function openPDF() {
            pdfMake.createPdf(docDefinition).open();
        }
    </script>
    
    <button onclick="createPDF()">Download RTL PDF</button>
    <button onclick="openPDF()">Open RTL PDF</button>
</body>
</html>
```

### Advanced Client-Side Features

```javascript
// Custom font configuration for better RTL support
pdfMake.fonts = {
    Roboto: {
        normal: 'https://fonts.googleapis.com/css2?family=Roboto',
        bold: 'https://fonts.googleapis.com/css2?family=Roboto:wght@700'
    },
    Amiri: {
        normal: 'https://fonts.googleapis.com/css2?family=Amiri',
        bold: 'https://fonts.googleapis.com/css2?family=Amiri:wght@700'
    },
    Vazir: {  // Persian font
        normal: 'https://fonts.googleapis.com/css2?family=Vazir',
        bold: 'https://fonts.googleapis.com/css2?family=Vazir:wght@700'
    }
};

// RTL-aware document with automatic detection
const advancedDoc = {
    content: [
        // Automatic language detection and appropriate styling
        { 
            text: 'تقرير شهري - گزارش ماهانه - ماہانہ رپورٹ',
            style: 'title',
            // RTL auto-detected, right-aligned automatically
        },
        
        // Dynamic content with RTL detection
        {
            columns: [
                {
                    width: '*',
                    text: [
                        'Statistics:\n',
                        'المبيعات: ١٢٣٤\n',      // Arabic
                        'فروش: ۱۲۳۴\n',          // Persian  
                        'فروخت: ۱۲۳۴'            // Urdu
                    ]
                },
                {
                    width: '*', 
                    text: [
                        'Performance:\n',
                        'الأداء: ممتاز\n',         // Arabic
                        'عملکرد: عالی\n',         // Persian
                        'کارکردگی: بہترین'        // Urdu
                    ]
                }
            ]
        }
    ],
    
    styles: {
        title: {
            fontSize: 20,
            bold: true,
            margin: [0, 0, 0, 20]
            // alignment automatically set based on content direction
        }
    },
    
    defaultStyle: {
        // RTL languages get Amiri/Vazir, LTR gets Roboto automatically
        font: 'Roboto'
    }
};
```

### React/Vue Integration

```javascript
// React component example
import pdfMake from 'pdfmake-rtl/build/pdfmake';
import pdfFonts from 'pdfmake-rtl/build/vfs_fonts';

pdfMake.vfs = pdfFonts;

const RTLPDFGenerator = () => {
    const generateRTLReport = () => {
        const docDef = {
            content: [
                { text: 'تقرير المشروع', style: 'header' },      // Arabic
                { text: 'گزارش پروژه', style: 'header' },       // Persian  
                { text: 'منصوبہ رپورٹ', style: 'header' },      // Urdu
                
                // Auto-detecting table
                {
                    table: {
                        body: [
                            ['المرحلة', 'مرحله', 'مرحلہ', 'Status'],
                            ['التخطيط', 'طراحی', 'منصوبہ بندی', 'Complete'],
                            ['التنفيذ', 'اجرا', 'عمل درآمد', 'In Progress'],
                            ['الاختبار', 'تست', 'جانچ', 'Pending']
                        ]
                    }
                }
            ]
        };
        
        pdfMake.createPdf(docDef).open();
    };
    
    return <button onClick={generateRTLReport}>Generate RTL Report</button>;
};
```
## 📸 Demo Screenshots

### 🖼️ Example 1 – Multilingual Automatically Detected

![Multilingual PDF Paragraph Demo](https://i.imgur.com/aIbfbww.jpeg)

---

## 🌍 Language Support

### Automatically Detected Scripts

| Language | Unicode Range | Status |
|----------|---------------|--------|
| Arabic | U+0600–U+06FF | ✅ |
| Persian (Farsi) | U+06A9–U+06AF, U+06C0–U+06C3 | ✅ |
| Urdu | U+0679, U+067E, U+0686, U+0688, U+0691, U+0698, U+06A9, U+06BA, U+06BB, U+06BE, U+06C1, U+06C3, U+06CC, U+06D2, U+06D3 | ✅ |
| Arabic Supplement | U+0750–U+077F | ✅ |
| Arabic Extended-A | U+08A0–U+08FF | ✅ |
| Arabic Presentation Forms | U+FB50–U+FDFF, U+FE70–U+FEFF | ✅ |
| Persian/Urdu Special Chars | U+200C–U+200D (ZWNJ/ZWJ) | ✅ |

## 🎨 Language-Specific Examples

### Arabic Document
```javascript
const arabicDoc = {
    content: [
        { text: 'تقرير شهري', style: 'title' },
        { text: 'إعداد: أحمد محمد', style: 'subtitle' },
        {
            table: {
                widths: ['*', '*', '*'],
                body: [
                    ['الاسم', 'المنصب', 'الراتب'],
                    ['أحمد علي', 'مطور', '٥٠٠٠'],
                    ['فاطمة حسن', 'مديرة', '٧٠٠٠']
                ]
            }
        },
        {
            ul: [
                'النقطة الأولى',
                'النقطة الثانية', 
                'النقطة الثالثة'
            ]
        }
    ]
};
```

### Long Text Table Example
```javascript
const longTextTableDoc = {
    content: [
        { text: 'تقرير مفصل - گزارش تفصیلی - تفصیلی رپورٹ', style: 'title' },
        
        // Table with long text content - automatic text wrapping and RTL alignment
        {
            table: {
                widths: ['25%', '35%', '40%'],
                headerRows: 1,
                body: [
                    // Headers
                    [
                        { text: 'القسم\nDepartment\nشعبہ', style: 'tableHeader' },
                        { text: 'الوصف المفصل\nDetailed Description\nتفصیلی تشریح', style: 'tableHeader' },
                        { text: 'الملاحظات والتوصيات\nNotes & Recommendations\nنوٹس اور سفارشات', style: 'tableHeader' }
                    ],
                    
                    // Arabic row with long content
                    [
                        'قسم تطوير البرمجيات',
                        'هذا القسم مسؤول عن تطوير وصيانة جميع التطبيقات والأنظمة البرمجية المستخدمة في الشركة، بما في ذلك أنظمة إدارة قواعد البيانات وتطبيقات الويب والتطبيقات المحمولة',
                        'يُنصح بزيادة عدد المطورين في هذا القسم نظراً للزيادة المتوقعة في المشاريع خلال العام القادم. كما يُفضل الاستثمار في التدريب على التقنيات الحديثة مثل الذكاء الاصطناعي والحوسبة السحابية'
                    ],
                    
                    // Persian row with long content
                    [
                        'بخش توسعه نرم‌افزار',
                        'این بخش مسئول توسعه و نگهداری تمام برنامه‌ها و سیستم‌های نرم‌افزاری مورد استفاده در شرکت است، از جمله سیستم‌های مدیریت پایگاه داده، برنامه‌های وب و برنامه‌های موبایل',
                        'توصیه می‌شود تعداد توسعه‌دهندگان در این بخش افزایش یابد با توجه به افزایش مورد انتظار پروژه‌ها در سال آینده. همچنین بهتر است روی آموزش تکنولوژی‌های جدید مانند هوش مصنوعی و رایانش ابری سرمایه‌گذاری شود'
                    ],
                    
                    // Urdu row with long content
                    [
                        'سافٹ ویئر ڈیولپمنٹ شعبہ',
                        'یہ شعبہ کمپنی میں استعمال ہونے والے تمام ایپلیکیشنز اور سافٹ ویئر سسٹمز کی ترقی اور دیکھ بھال کا ذمہ دار ہے، جن میں ڈیٹا بیس مینجمنٹ سسٹمز، ویب ایپلیکیشنز اور موبائل ایپلیکیشنز شامل ہیں',
                        'آئندہ سال متوقع پروجیکٹس میں اضافے کے پیش نظر اس شعبے میں ڈیولپرز کی تعداد بڑھانے کی سفارش کی جاتی ہے۔ نیز جدید ٹیکنالوجیز جیسے مصنوعی ذہانت اور کلاؤڈ کمپیوٹنگ کی تربیت میں سرمایہ کاری کرنا بہتر ہوگا'
                    ],
                    
                    // Mixed languages row
                    [
                        'Quality Assurance\nضمان الجودة\nتضمین کیفیت\nکوالٹی ایشورنس',
                        'This department ensures software quality through comprehensive testing. يضمن هذا القسم جودة البرمجيات من خلال الاختبار الشامل. این بخش از طریق تست جامع کیفیت نرم‌افزار را تضمین می‌کند. یہ شعبہ جامع ٹیسٹنگ کے ذریعے سافٹ ویئر کی کوالٹی کو یقینی بناتا ہے۔',
                        'Implement automated testing frameworks. تنفيذ إطارات الاختبار التلقائية. چارچوب‌های تست خودکار را پیاده‌سازی کنید. خودکار ٹیسٹنگ فریم ورک کو نافذ کریں۔'
                    ]
                ]
            },
            layout: {
                hLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.body.length) ? 2 : 1;
                },
                vLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                },
                hLineColor: function (i, node) {
                    return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                },
                vLineColor: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                }
            }
        },
        
        // Performance metrics table with numeric data
        {
            text: 'مقاييس الأداء - معیارهای عملکرد - کارکردگی کے معیار',
            style: 'sectionHeader',
            margin: [0, 20, 0, 10]
        },
        {
            table: {
                widths: ['*', '*', '*', '*'],
                body: [
                    ['المقياس\nMetric\nمعیار', 'الهدف\nTarget\nہدف', 'الفعلي\nActual\nحقیقی', 'التقييم\nEvaluation\nتشخیص'],
                    ['نسبة إنجاز المشاريع\nProject Completion Rate\nپروجیکٹ تکمیل کی شرح', '٩٠٪', '٨٥٪', 'جيد - Good - اچھا'],
                    ['رضا العملاء\nCustomer Satisfaction\nکسٹمر کی اطمینان', '٩٥٪', '٩٨٪', 'ممتاز - Excellent - بہترین'],
                    ['زمن الاستجابة\nResponse Time\nجوابی وقت', '< ٢ ساعة\n< 2 hours\n< ۲ گھنٹے', '١.٥ ساعة\n1.5 hours\n۱.۵ گھنٹے', 'ممتاز - Excellent - بہترین']
                ]
            }
        }
    ],
    
    styles: {
        title: {
            fontSize: 22,
            bold: true,
            margin: [0, 0, 0, 20],
            alignment: 'center'
        },
        sectionHeader: {
            fontSize: 16,
            bold: true,
            color: '#2c3e50'
        },
        tableHeader: {
            bold: true,
            fontSize: 12,
            color: 'white',
            fillColor: '#3498db'
        }
    },
    
    defaultStyle: {
        fontSize: 10,
        lineHeight: 1.3
    }
};
```

### Persian (Farsi) Document
```javascript
const persianDoc = {
    content: [
        { text: 'گزارش ماهانه', style: 'title' },
        { text: 'تهیه کننده: علی احمدی', style: 'subtitle' },
        {
            table: {
                widths: ['*', '*', '*'],
                body: [
                    ['نام', 'سمت', 'حقوق'],
                    ['علی رضا', 'برنامه نویس', '۵۰۰۰'],
                    ['فاطمه کریمی', 'مدیر', '۷۰۰۰']
                ]
            }
        },
        {
            ol: [
                'مورد اول',
                'مورد دوم',
                'مورد سوم'
            ]
        }
    ]
};
```

### Urdu Document
```javascript
const urduDoc = {
    content: [
        { text: 'ماہانہ رپورٹ', style: 'title' },
        { text: 'تیار کنندہ: احمد علی', style: 'subtitle' },
        {
            table: {
                widths: ['*', '*', '*'],
                body: [
                    ['نام', 'عہدہ', 'تنخواہ'],
                    ['احمد حسن', 'ڈویلپر', '۵۰۰۰'],
                    ['فاطمہ خان', 'منیجر', '۷۰۰۰']
                ]
            }
        },
        {
            ul: [
                'پہلا نکتہ',
                'دوسرا نکتہ',
                'تیسرا نکتہ'
            ]
        }
    ]
};
```

### Mixed Languages Document
```javascript
const multilingualDoc = {
    content: [
        // Headers in all languages
        { text: 'Project Report - تقرير المشروع - گزارش پروژه - پروجیکٹ رپورٹ', style: 'title' },
        
        // Multi-language table
        {
            table: {
                widths: ['*', '*', '*', '*'],
                body: [
                    ['English', 'العربية', 'فارسی', 'اردو'],
                    ['Name', 'الاسم', 'نام', 'نام'],
                    ['Project', 'المشروع', 'پروژه', 'منصوبہ'],
                    ['Report', 'التقرير', 'گزارش', 'رپورٹ'],
                    ['Complete', 'مكتمل', 'کامل', 'مکمل']
                ]
            }
        },
        
        // Mixed content paragraphs
        { text: 'Status: مكتمل - کامل - مکمل (Complete)', margin: [0, 10] },
        { text: 'Team: الفريق - تیم - ٹیم (Team Members)', margin: [0, 10] }
    ]
};
```

### Advanced Long Text Table with Page Breaks
```javascript
const advancedLongTableDoc = {
    content: [
        { text: 'تقرير شامل للمشاريع - جامع پروژه رپورٹ', style: 'mainTitle' },
        
        // Large table that spans multiple pages with long text content
        {
            table: {
                headerRows: 2,
                widths: ['15%', '25%', '30%', '30%'],
                body: [
                    // Main header
                    [
                        { text: 'المشروع\nProject\nپروژه', style: 'headerStyle', rowSpan: 2 },
                        { text: 'التفاصيل الفنية\nTechnical Details\nتکنیکی تفصیلات', style: 'headerStyle', colSpan: 2 },
                        {},
                        { text: 'الحالة والملاحظات\nStatus & Notes\nحالت اور نوٹس', style: 'headerStyle', rowSpan: 2 }
                    ],
                    // Sub header
                    [
                        {},
                        { text: 'التقنيات المستخدمة\nTechnologies\nٹیکنالوجیز', style: 'subHeaderStyle' },
                        { text: 'المتطلبات والمواصفات\nRequirements\nضروریات', style: 'subHeaderStyle' },
                        {}
                    ],
                    
                    // Project 1 - Very long content
                    [
                        'نظام إدارة المحتوى الإلكتروني\n\nContent Management System\n\nمواد کا نظام',
                        'تم تطوير هذا النظام باستخدام تقنيات حديثة مثل React.js للواجهة الأمامية و Node.js للخادم الخلفي، مع استخدام قاعدة بيانات MongoDB لتخزين البيانات بكفاءة عالية.\n\nDeveloped using modern technologies including React.js for frontend and Node.js for backend, with MongoDB database for efficient data storage.\n\nجدید ٹیکنالوجیز جیسے React.js فرنٹ اینڈ کے لیے اور Node.js بیک اینڈ کے لیے استعمال کرکے تیار کیا گیا، ڈیٹا کو مؤثر طریقے سے محفوظ کرنے کے لیے MongoDB ڈیٹابیس کا استعمال کیا گیا۔',
                        'يجب أن يدعم النظام ما لا يقل عن ١٠٠٠ مستخدم متزامن، مع إمكانية رفع ملفات بحجم يصل إلى ١٠٠ ميجابايت، وتوفير واجهات برمجة تطبيقات RESTful للتكامل مع الأنظمة الأخرى.\n\nSystem must support at least 1000 concurrent users, file uploads up to 100MB, and provide RESTful APIs for integration.\n\nسسٹم کو کم از کم ۱۰۰۰ بیک وقت صارفین کی حمایت کرنی چاہیے، ۱۰۰ میگابائٹ تک فائل اپ لوڈ، اور انٹیگریشن کے لیے RESTful APIs فراہم کرنا چاہیے۔',
                        'المشروع مكتمل بنسبة ٩٥٪ ويتوقع إطلاقه في نهاية هذا الشهر. تم اجتياز جميع اختبارات الأداء والأمان بنجاح.\n\nProject is 95% complete and expected to launch by end of month. All performance and security tests passed successfully.\n\nپروجیکٹ ۹۵٪ مکمل ہے اور اس مہینے کے آخر تک لانچ ہونے کی توقع ہے۔ تمام کارکردگی اور سیکیورٹی ٹیسٹ کامیابی سے پاس ہوئے۔'
                    ],
                    
                    // Project 2
                    [
                        'تطبيق التجارة الإلكترونية\n\nE-commerce Application\n\nای کامرس ایپلیکیشن',
                        'يستخدم التطبيق تقنيات متقدمة مثل Vue.js و Express.js مع قاعدة بيانات PostgreSQL وخدمات الدفع الآمنة مثل Stripe و PayPal.\n\nApplication uses advanced technologies like Vue.js and Express.js with PostgreSQL database and secure payment services like Stripe and PayPal.\n\nایپلیکیشن جدید ٹیکنالوجیز جیسے Vue.js اور Express.js استعمال کرتی ہے PostgreSQL ڈیٹابیس اور محفوظ پیمنٹ سروسز جیسے Stripe اور PayPal کے ساتھ۔',
                        'التطبيق يحتاج إلى دعم عدة عملات ولغات، مع نظام إدارة المخزون المتقدم وتتبع الطلبات في الوقت الفعلي، بالإضافة إلى تحليلات مفصلة للمبيعات.\n\nApplication needs multi-currency and multi-language support, advanced inventory management, real-time order tracking, and detailed sales analytics.\n\nایپلیکیشن کو کئی کرنسیوں اور زبانوں کی حمایت، ایڈوانسڈ انوینٹری منیجمنٹ، ریئل ٹائم آرڈر ٹریکنگ، اور تفصیلی سیلز ایڈالٹکس کی ضرورت ہے۔',
                        'التطوير في المرحلة النهائية مع اكتمال ٨٥٪ من الوظائف الأساسية. يجري حالياً اختبار نظام الدفع والأمان.\n\nDevelopment in final phase with 85% of core features complete. Currently testing payment system and security.\n\nبنیادی فیچرز کے ۸۵٪ مکمل ہونے کے ساتھ ڈیولپمنٹ حتمی مرحلے میں ہے۔ فی الوقت پیمنٹ سسٹم اور سیکیورٹی کو ٹیسٹ کیا جا رہا ہے۔'
                    ],
                    
                    // Project 3
                    [
                        'نظام إدارة الموارد البشرية\n\nHR Management System\n\nHR منیجمنٹ سسٹم',
                        'النظام مبني على تقنيات السحابة مع استخدام Docker للنشر و Kubernetes للتوسع التلقائي، مع قاعدة بيانات MySQL المحسنة للأداء العالي.\n\nSystem built on cloud technologies using Docker for deployment and Kubernetes for auto-scaling, with optimized MySQL database for high performance.\n\nسسٹم کلاؤڈ ٹیکنالوجیز پر بنایا گیا ہے Docker کا استعمال کرتے ہوئے deployment کے لیے اور Kubernetes auto-scaling کے لیے، high performance کے لیے optimized MySQL database کے ساتھ۔',
                        'يجب أن يتضمن النظام إدارة الحضور والانصراف، حساب الرواتب التلقائي، تقييم الأداء، وإدارة الإجازات مع التكامل مع أنظمة المحاسبة الموجودة.\n\nSystem must include attendance management, automatic payroll calculation, performance evaluation, and leave management with integration to existing accounting systems.\n\nسسٹم میں حاضری کا نظام، خودکار تنخواہ کیلکولیشن، کارکردگی کی تشخیص، اور چھٹی کا نظام شامل ہونا چاہیے موجودہ اکاؤنٹنگ سسٹمز کے ساتھ انٹیگریشن کے ساتھ۔',
                        'المشروع في مرحلة التطوير المتوسطة مع اكتمال ٦٠٪ من المتطلبات. تم إنهاء تصميم قاعدة البيانات وواجهات المستخدم.\n\nProject in middle development phase with 60% of requirements complete. Database design and user interfaces completed.\n\nپروجیکٹ درمیانی ڈیولپمنٹ مرحلے میں ہے ۶۰٪ ضروریات مکمل کے ساتھ۔ ڈیٹابیس ڈیزائن اور یوزر انٹرفیسز مکمل۔'
                    ]
                ]
            },
            layout: {
                hLineWidth: function (i, node) {
                    if (i === 0 || i === node.table.body.length) return 2;
                    if (i === 2) return 1.5; // After header
                    return 0.5;
                },
                vLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                },
                hLineColor: function (i, node) {
                    return (i === 0 || i === node.table.body.length) ? '#2c3e50' : '#bdc3c7';
                },
                vLineColor: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? '#2c3e50' : '#bdc3c7';
                },
                paddingLeft: function(i, node) { return 8; },
                paddingRight: function(i, node) { return 8; },
                paddingTop: function(i, node) { return 6; },
                paddingBottom: function(i, node) { return 6; }
            }
        }
    ],
    
    styles: {
        mainTitle: {
            fontSize: 24,
            bold: true,
            margin: [0, 0, 0, 30],
            alignment: 'center',
            color: '#2c3e50'
        },
        headerStyle: {
            bold: true,
            fontSize: 12,
            color: 'white',
            fillColor: '#3498db',
            alignment: 'center'
        },
        subHeaderStyle: {
            bold: true,
            fontSize: 10,
            color: 'white',
            fillColor: '#5dade2',
            alignment: 'center'
        }
    },
    
    defaultStyle: {
        fontSize: 9,
        lineHeight: 1.4
    },
    
    pageMargins: [40, 60, 40, 60]
};
```



### React/Vue Integration

```javascript
// React component example
import pdfMake from 'pdfmake-rtl/build/pdfmake';
import pdfFonts from 'pdfmake-rtl/build/vfs_fonts';

pdfMake.vfs = pdfFonts;

const RTLPDFGenerator = () => {
    const generateRTLReport = () => {
        const docDef = {
            content: [
                { text: 'تقرير المشروع', style: 'header' },      // Arabic
                { text: 'گزارش پروژه', style: 'header' },       // Persian  
                { text: 'منصوبہ رپورٹ', style: 'header' },      // Urdu
                
                // Auto-detecting table
                {
                    table: {
                        body: [
                            ['المرحلة', 'مرحله', 'مرحلہ', 'Status'],
                            ['التخطيط', 'طراحی', 'منصوبہ بندی', 'Complete'],
                            ['التنفيذ', 'اجرا', 'عمل درآمد', 'In Progress'],
                            ['الاختبار', 'تست', 'جانچ', 'Pending']
                        ]
                    }
                }
            ]
        };
        
        pdfMake.createPdf(docDef).open();
    };
    
    return <button onClick={generateRTLReport}>Generate RTL Report</button>;
};
```


PDF document generation library for server-side and client-side usage in pure JavaScript.


### Features

* line-wrapping,
* text-alignments (left, right, centered, justified),
* numbered and bulleted lists,
* tables and columns
  * auto/fixed/star-sized widths,
  * col-spans and row-spans,
  * headers automatically repeated in case of a page-break,
* images and vector graphics,
* convenient styling and style inheritance,
* page headers and footers:
  * static or dynamic content,
  * access to current page number and page count,
* background-layer,
* page dimensions and orientations,
* margins,
* custom page breaks,
* font embedding,
* support for complex, multi-level (nested) structures,
* table of contents,
* helper methods for opening/printing/downloading the generated PDF,
* setting of PDF metadata (e.g. author, subject).

## Documentation

Documentation URL: https://pdfmake.github.io/docs/

## Building from sources version 0.2.x

using npm:
```
git clone --branch 0.2 https://github.com/bpampuch/pdfmake.git
cd pdfmake
npm install
npm run build
```

using yarn:
```
git clone --branch 0.2 https://github.com/bpampuch/pdfmake.git
cd pdfmake
yarn
yarn run build
```

## License
MIT

## Authors pdfmake-rtl
* [@aysnet1](httpss://github.com/aysnet1)

## Authors pdfmake
* [@bpampuch](https://github.com/bpampuch) (founder)
* [@liborm85](https://github.com/liborm85)

pdfmake is based on a truly amazing library [pdfkit](https://github.com/devongovett/pdfkit) (credits to [@devongovett](https://github.com/devongovett)).

Thanks to all contributors.
