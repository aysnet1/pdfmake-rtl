// Simple test for RTL functionality
var rtlUtils = require('../src/rtlUtils');

console.log('Testing RTL utilities...\n');

// Test text direction detection
var arabicText = 'مرحبا بكم في النظام';
var englishText = 'Hello World';
var mixedText = 'Hello مرحبا World';

console.log('Arabic text:', arabicText);
console.log('Direction:', rtlUtils.getTextDirection(arabicText));
console.log('Contains RTL:', rtlUtils.containsRTL(arabicText));
console.log('Is Arabic:', rtlUtils.isArabicText(arabicText));
console.log();

console.log('English text:', englishText);
console.log('Direction:', rtlUtils.getTextDirection(englishText));
console.log('Contains RTL:', rtlUtils.containsRTL(englishText));
console.log();

console.log('Mixed text:', mixedText);
console.log('Direction:', rtlUtils.getTextDirection(mixedText));
console.log('Contains RTL:', rtlUtils.containsRTL(mixedText));
console.log();

// Test RTL processing
console.log('RTL Processing Test:');
var result1 = rtlUtils.processRTLText(arabicText, true);
console.log('Original Arabic:', arabicText);
console.log('Processed Arabic:', result1.text);
console.log('Is RTL:', result1.isRTL);
console.log();

var result2 = rtlUtils.processRTLText(englishText, true);
console.log('Original English:', englishText);
console.log('Processed English:', result2.text);
console.log('Is RTL:', result2.isRTL);
console.log();

console.log('Testing completed successfully!');
