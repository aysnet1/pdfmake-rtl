// Client-side example for PDFMake RTL
// Include this after pdfmake.min.js and vfs_fonts.js

/**
 * PDFMake RTL Client-Side Utils
 * Simplified version for browser usage
 */
const PDFMakeRTL = {
    
    /**
     * Check if a character is RTL
     * @param char
     */
    isRTLChar(char) {
        const code = char.charCodeAt(0);
        return (code >= 0x0600 && code <= 0x06FF) ||  // Arabic
               (code >= 0x06A9 && code <= 0x06AF) ||  // Persian
               (code >= 0x06C0 && code <= 0x06C3) ||  // Persian Extended
               (code >= 0x0679 && code <= 0x0679) ||  // Urdu Tteh
               (code >= 0x067E && code <= 0x067E) ||  // Urdu Peh
               (code >= 0x0686 && code <= 0x0686) ||  // Urdu Tcheh
               (code >= 0x0750 && code <= 0x077F) ||  // Arabic Supplement
               (code >= 0xFE70 && code <= 0xFEFF);    // Arabic Presentation Forms
    },
    
    /**
     * Detect text direction
     * @param text
     */
    getTextDirection(text) {
        if (!text) return 'neutral';
        
        let rtlCount = 0;
        let ltrCount = 0;
        
        for (let i = 0; i < text.length; i++) {
            const char = text.charAt(i);
            if (this.isRTLChar(char)) {
                rtlCount++;
            } else if (/[A-Za-z]/.test(char)) {
                ltrCount++;
            }
        }
        
        if (rtlCount > ltrCount) return 'rtl';
        if (ltrCount > rtlCount) return 'ltr';
        return rtlCount > 0 ? 'rtl' : 'neutral';
    },
    
    /**
     * Check if text contains RTL characters
     * @param text
     */
    containsRTL(text) {
        if (!text) return false;
        return text.split('').some(char => this.isRTLChar(char));
    },
    
    /**
     * Auto-apply RTL properties to text element
     * @param element
     */
    autoApplyRTL(element) {
        if (!element) return element;
        
        if (typeof element === 'string') {
            const direction = this.getTextDirection(element);
            if (direction === 'rtl') {
                return {
                    text: element,
                    alignment: 'right'
                };
            }
            return element;
        }
        
        if (typeof element === 'object' && element.text) {
            const direction = this.getTextDirection(element.text);
            if (direction === 'rtl' && !element.alignment) {
                element.alignment = 'right';
            } else if (direction === 'ltr' && !element.alignment) {
                element.alignment = 'left';
            }
        }
        
        return element;
    },
    
    /**
     * Process table for RTL (reverse columns if contains RTL content)
     * @param table
     */
    processRTLTable(table) {
        if (!table || !table.body) return table;
        
        // Check if table contains significant RTL content
        let rtlCells = 0;
        let totalCells = 0;
        
        table.body.forEach(row => {
            if (Array.isArray(row)) {
                row.forEach(cell => {
                    totalCells++;
                    const cellText = typeof cell === 'string' ? cell : (cell && cell.text ? cell.text : '');
                    if (this.containsRTL(cellText)) {
                        rtlCells++;
                    }
                });
            }
        });
        
        // If more than 30% RTL content, reverse columns
        if (totalCells > 0 && (rtlCells / totalCells) >= 0.3) {
            table.body = table.body.map(row => {
                if (Array.isArray(row)) {
                    return row.slice().reverse();
                }
                return row;
            });
            
            // Also reverse widths if defined
            if (table.widths && Array.isArray(table.widths)) {
                table.widths = table.widths.slice().reverse();
            }
        }
        
        return table;
    },
    
    /**
     * Process entire document for RTL
     * @param docDef
     */
    processDocument(docDef) {
        const processElement = (element) => {
            if (!element) return element;
            
            if (Array.isArray(element)) {
                return element.map(processElement);
            }
            
            // Process text elements
            if (typeof element === 'string' || (element && element.text)) {
                element = this.autoApplyRTL(element);
            }
            
            // Process tables
            if (element && element.table) {
                element.table = this.processRTLTable(element.table);
            }
            
            // Process lists
            if (element && element.ul) {
                element.ul = element.ul.map(item => this.autoApplyRTL(item));
            }
            if (element && element.ol) {
                element.ol = element.ol.map(item => this.autoApplyRTL(item));
            }
            
            // Process columns
            if (element && element.columns) {
                element.columns = element.columns.map(processElement);
            }
            
            return element;
        };
        
        if (docDef.content) {
            docDef.content = processElement(docDef.content);
        }
        
        return docDef;
    }
};

/**
 * Enhanced pdfMake.createPdf with automatic RTL processing
 */
if (typeof pdfMake !== 'undefined') {
    const originalCreatePdf = pdfMake.createPdf;
    
    pdfMake.createPdfRTL = function(docDefinition, tableLayouts, fonts, vfs) {
        // Process document for RTL before creating PDF
        const processedDoc = PDFMakeRTL.processDocument(JSON.parse(JSON.stringify(docDefinition)));
        return originalCreatePdf.call(this, processedDoc, tableLayouts, fonts, vfs);
    };
}

/**
 * Usage Examples:
 */

// Example 1: Basic RTL document
function createRTLDocument() {
    const docDefinition = {
        content: [
            'English text',
            'النص العربي',
            'עברית',
            {
                table: {
                    body: [
                        ['Name', 'الاسم', 'Age'],
                        ['Ahmed', 'أحمد', '25'],
                        ['Sarah', 'سارة', '30']
                    ]
                }
            }
        ]
    };
    
    // Use enhanced method for automatic RTL processing
    pdfMake.createPdfRTL(docDefinition).download('rtl-document.pdf');
}

// Example 2: Manual control
function createManualRTLDocument() {
    const docDefinition = {
        content: [
            'English text (will be left-aligned)',
            PDFMakeRTL.autoApplyRTL('النص العربي'), // Manually apply RTL
            {
                text: 'Custom styled RTL text',
                alignment: PDFMakeRTL.getTextDirection('نص مخصص') === 'rtl' ? 'right' : 'left'
            }
        ]
    };
    
    pdfMake.createPdf(docDefinition).download('manual-rtl-document.pdf');
}

// Example 3: Test RTL detection
function testRTLDetection() {
    const testTexts = [
        'Hello World',
        'مرحبا بالعالم',
        'سلام دنیا',
        'اردو میں سلام',
        'Mixed text مرحبا hello'
    ];
    
    testTexts.forEach(text => {
        console.log(`"${text}":`, {
            direction: PDFMakeRTL.getTextDirection(text),
            hasRTL: PDFMakeRTL.containsRTL(text)
        });
    });
}

// Make utils globally available
window.PDFMakeRTL = PDFMakeRTL;
