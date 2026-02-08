var fs = require('fs');

var fontContainer = {
	vfs: {
		'Cairo-Regular.ttf': { data: fs.readFileSync(__dirname + '/../../../fonts/Cairo/Cairo-Regular.ttf', 'base64'), encoding: 'base64' },
		'Cairo-Bold.ttf': { data: fs.readFileSync(__dirname + '/../../../fonts/Cairo/Cairo-Bold.ttf', 'base64'), encoding: 'base64' },
		'Cairo-Light.ttf': { data: fs.readFileSync(__dirname + '/../../../fonts/Cairo/Cairo-Light.ttf', 'base64'), encoding: 'base64' },
		'Cairo-SemiBold.ttf': { data: fs.readFileSync(__dirname + '/../../../fonts/Cairo/Cairo-SemiBold.ttf', 'base64'), encoding: 'base64' }
	},
	fonts: {
		Cairo: {
			normal: 'Cairo-Regular.ttf',
			bold: 'Cairo-Bold.ttf',
			italics: 'Cairo-Light.ttf',
			bolditalics: 'Cairo-SemiBold.ttf'
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
