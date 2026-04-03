var fs = require('fs');

var fontContainer = {
	vfs: {
		'Rubik-Regular.ttf': { data: fs.readFileSync(__dirname + '/../../../fonts/Rubik/Rubik-Regular.ttf', 'base64'), encoding: 'base64' },
		'Rubik-Bold.ttf': { data: fs.readFileSync(__dirname + '/../../../fonts/Rubik/Rubik-Bold.ttf', 'base64'), encoding: 'base64' },
		'Rubik-Italic.ttf': { data: fs.readFileSync(__dirname + '/../../../fonts/Rubik/Rubik-Italic.ttf', 'base64'), encoding: 'base64' },
		'Rubik-BoldItalic.ttf': { data: fs.readFileSync(__dirname + '/../../../fonts/Rubik/Rubik-BoldItalic.ttf', 'base64'), encoding: 'base64' }
	},
	fonts: {
		Rubik: {
			normal: 'Rubik-Regular.ttf',
			bold: 'Rubik-Bold.ttf',
			italics: 'Rubik-Italic.ttf',
			bolditalics: 'Rubik-BoldItalic.ttf'
		}
	}
};

var _global = typeof window === 'object' ? window : typeof global === 'object' ? global : typeof self === 'object' ? self : this;
if (typeof _global.pdfMake !== 'undefined' && typeof _global.pdfMake.addFontContainer !== 'undefined') {
	_global.pdfMake.addFontContainer(fontContainer);
}

if (typeof module !== 'undefined') {
	module.exports = fontContainer;
}