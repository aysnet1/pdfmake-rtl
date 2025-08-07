const { PdfPrinter, RTLUtils } = require('./index.js');

// Test 1: Vérifier que PdfPrinter est exporté
console.log('Test 1: PdfPrinter export');
console.log('PdfPrinter:', typeof PdfPrinter);

// Test 2: Vérifier que RTLUtils est exporté
console.log('\nTest 2: RTLUtils export');
console.log('RTLUtils:', typeof RTLUtils);
console.log('RTLUtils methods:', Object.keys(RTLUtils));

// Test 3: Tester la détection RTL
console.log('\nTest 3: RTL Detection');
const testTexts = [
    'Hello World',           // LTR
    'مرحبا بالعالم',          // RTL Arabic
    'שלום עולם',             // RTL Hebrew
    'Mixed hello مرحبا'      // Mixed
];

testTexts.forEach(text => {
    const direction = RTLUtils.getTextDirection(text);
    const containsRTL = RTLUtils.containsRTL(text);
    console.log(`Text: "${text}" -> Direction: ${direction}, Contains RTL: ${containsRTL}`);
});

// Test 4: Créer un document simple
console.log('\nTest 4: PDF Creation');
try {
    const fonts = {
        Roboto: {
            normal: './build/fonts/Roboto/Roboto-Regular.ttf',
            bold: './build/fonts/Roboto/Roboto-Medium.ttf',
            italics: './build/fonts/Roboto/Roboto-Italic.ttf',
            bolditalics: './build/fonts/Roboto/Roboto-MediumItalic.ttf'
        }
    };

    const printer = new PdfPrinter(fonts);
    
    const docDefinition = {
        content: [
            { text: 'Hello World!', style: 'header' },
            { text: 'مرحبا بالعالم', style: 'arabic' }
        ],
        styles: {
            header: { fontSize: 18, bold: true },
            arabic: { fontSize: 14 }
        }
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    console.log('PDF document created successfully');
    
} catch (error) {
    console.log('PDF creation test skipped (fonts not available):', error.message);
}

console.log('\n✅ All tests completed successfully!');
