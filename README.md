<!-- [![Node.js CI][githubactions_img]][githubactions_url] -->

# pdfmake-RTL [![GitHub][github_img]][github_url] [![npm][npm_img]][npm_url]

[githubactions_img]: https://github.com/aysnet1/pdfmake-rtl/actions/workflows/node.js.yml/badge.svg?branch=master
[githubactions_url]: https://github.com/aysnet1/pdfmake-rtl/actions
[github_img]: https://img.shields.io/github/release/aysnet1/pdfmake-rtl.svg?colorB=0E7FBF
[github_url]: https://github.com/bpampuch/pdfmake-rtl/releases/latest
[npm_img]: https://img.shields.io/npm/v/pdfmake-rtl.svg?colorB=0E7FBF
[npm_url]: https://www.npmjs.com/package/pdfmake-rtl
[cdnjs_img]: https://img.shields.io/cdnjs/v/pdfmake-rtl.svg?colorB=0E7FBF

<!-- [cndjs_url]: https://cdnjs.com/libraries/pdfmake-rtl -->

**PDFMake RTL** is an enhanced version of PDFMake with **automatic RTL (Right-to-Left) language support** for Arabic, Persian (Farsi), Urdu, and other RTL scripts. No manual configuration needed - just write your content and the library automatically detects and handles RTL text!

All existing PDFMake code works unchanged, with automatic RTL support added!

## 🚀 Key Features

- ✅ **Automatic RTL Detection** - No need to set `rtl` flags
- ✅ **Smart Table Column Reversal** - Arabic/Persian/Urdu tables automatically reverse columns
- ✅ **Unicode Script Detection** - Supports Arabic, Persian, Urdu, and extensions
- ✅ **Automatic Font Selection** - Uses appropriate fonts per language
- ✅ **Proper Text Alignment** - RTL text aligns right, LTR text aligns left
- ✅ **List Bullet Positioning** - Bullets positioned correctly for RTL lists
- ✅ **Mixed Content Support** - Handles Arabic/Persian/Urdu/English mixed content
- ✅ **100% PDFMake Compatible** - Drop-in replacement for PDFMake

## 🌐 Live Demo

👉 [View Live Demo on Netlify](https://pdfmake-rtl.netlify.app)

PDF document generation library for server-side and client-side in pure JavaScript.

Check out [the playground](http://aysnet1.github.io/pdfmake-rtl/playground.html) and [examples](https://github.com/aysnet1/pdfmake-rtl/tree/master/examples).

### Features

#### 🔤 RTL Language Support

- **Automatic RTL detection** for Arabic, Persian (Farsi), Urdu, and other RTL scripts
- **Smart table column reversal** — columns automatically reverse for RTL content
- **Automatic font selection** — uses Cairo font for Arabic, Persian, and Urdu text
- **Proper text alignment** — RTL text automatically aligns right, LTR aligns left
- **List bullet positioning** — bullets and numbers positioned correctly for RTL lists
- **Mixed content handling** — seamlessly handles Arabic/Persian/Urdu/English in the same document
- **Unicode script detection** — supports Arabic, Persian, Urdu characters and extensions

#### 🗒️ Supported RTL Languages

| Language          | Script  | Auto Font |
| ----------------- | ------- | --------- |
| Arabic            | العربية | Cairo     |
| Persian (Farsi)   | فارسی   | Cairo     |
| Urdu              | اردو    | Cairo     |
| Other RTL scripts | —       | Cairo     |

#### 📄 General Features

- line-wrapping,
- text-alignments (left, right, centered, justified),
- numbered and bulleted lists (with RTL-aware bullet positioning),
- tables and columns
  - auto/fixed/star-sized widths,
  - col-spans and row-spans,
  - headers automatically repeated in case of a page-break,
  - **automatic column reversal for RTL content**,
- images and vector graphics,
- convenient styling and style inheritance,
- page headers and footers:
  - static or dynamic content,
  - access to current page number and page count,
- background-layer,
- page dimensions and orientations,
- margins,
- document sections,
- custom page breaks,
- font embedding (Cairo font included for RTL support),
- support for complex, multi-level (nested) structures,
- table of contents,
- helper methods for opening/printing/downloading the generated PDF,
- setting of PDF metadata (e.g. author, subject).

## 📦 Installation

```bash
npm install pdfmake-rtl
```

## ⚡ Quick Start — Browser (Client-Side)

```html
<!-- Load pdfmake-rtl + fonts -->
<script src="https://unpkg.com/pdfmake-rtl/build/pdfmake.min.js"></script>
<script src="https://unpkg.com/pdfmake-rtl/build/vfs_fonts.js"></script>
<script src="https://unpkg.com/pdfmake-rtl/build/fonts/Cairo.js"></script>

<script>
	var dd = {
		rtl: true,
		// If Cairo font isn't applied automatically, set `rtl: true` to force RTL mode or add defaultStyle Cairo
		content: [
			// RTL paragraph — auto-detected, no configuration needed
			{ text: "مرحباً بكم في مكتبة pdfmake-rtl", fontSize: 20, bold: true },
			{
				text: "هذه المكتبة تدعم اللغة العربية تلقائياً",
				margin: [0, 0, 0, 15],
			},

			// RTL table — columns auto-reverse for Arabic content
			{
				table: {
					widths: ["*", "*", "*"],
					body: [
						[
							{ text: "الراتب", bold: true },
							{ text: "القسم", bold: true },
							{ text: "الاسم", bold: true },
						],
						["5000", "تكنولوجيا", "أحمد محمد"],
						["6000", "تسويق", "فاطمة علي"],
					],
				},
			},

			// Force RTL on any table with rtl: true
			{
				table: {
					rtl: true,
					widths: ["*", "*", "*"],
					body: [
						[
							{ text: "Status", bold: true },
							{ text: "Name", bold: true },
							{ text: "#", bold: true },
						],
						["Active", "Ali Hassan", "1"],
						["Active", "Sara Ahmed", "2"],
					],
				},
			},
		],
	};

	pdfMake.createPdf(dd).open();
</script>
```

> 📄 See the full working example: [`examples/simple-rtl-table.html`](examples/simple-rtl-table.html)

## ⚡ Quick Start — Node.js (Server-Side)

```js
var pdfmake = require("pdfmake-rtl");

// Add fonts
// Cairo is the default font for RTL languages (Arabic, Persian, Urdu)
// Roboto is the default font for LTR/Latin text
var Roboto = require("pdfmake-rtl/fonts/Roboto");
pdfmake.addFonts(Roboto);

var Cairo = require("pdfmake-rtl/fonts/Cairo");
pdfmake.addFonts(Cairo);

var dd = {
	// If Cairo font isn't applied automatically, set `rtl: true` to force RTL mode or add defaultStyle Cairo
	rtl: true, // Forces RTL layout direction for the entire document
	content: [
		{ text: "مرحباً بكم في مكتبة pdfmake-rtl", fontSize: 20, bold: true },
		{
			table: {
				widths: ["*", "*", "*"],
				body: [
					[
						{ text: "الراتب", bold: true },
						{ text: "القسم", bold: true },
						{ text: "الاسم", bold: true },
					],
					["5000", "تكنولوجيا", "أحمد محمد"],
					["6000", "تسويق", "فاطمة علي"],
				],
			},
		},
	],
};

var pdf = pdfmake.createPdf(dd);
pdf.write("output.pdf").then(() => console.log("PDF created!"));
```

## Documentation

**Documentation URL: https://pdfmake-rtl.github.io/docs/**

Source of documentation: https://github.com/pdfmake-rtl/docs **Improvements are welcome!**

## Building from sources

using npm:

```
git clone https://github.com/aysnet1/pdfmake-rtl.git
cd pdfmake-rtl
npm install
npm run build
```

using yarn:

```
git clone https://github.com/aysnet1/pdfmake-rtl.git
cd pdfmake-rtl
yarn
yarn run build
```

## License

MIT

## Credits

### pdfmake-rtl

- [@aysnet1](https://github.com/aysnet1) — Creator & Maintainer

### pdfmake (Original Library)

- [@bpampuch](https://github.com/bpampuch) — Founder
- [@liborm85](https://github.com/liborm85) — Maintainer

pdfmake is based on a truly amazing library [pdfkit](https://github.com/devongovett/pdfkit) (credits to [@devongovett](https://github.com/devongovett)).

Thanks to all contributors.

## License

MIT

## Authors pdfmake-rtl

- [@aysnet1](https://github.com/aysnet1)

## Authors pdfmake

- [@bpampuch](https://github.com/bpampuch) (founder)
- [@liborm85](https://github.com/liborm85)

pdfmake is based on a truly amazing library [pdfkit](https://github.com/devongovett/pdfkit) (credits to [@devongovett](https://github.com/devongovett)).

Thanks to all contributors.
