const fs = require('fs');
const path = require('path');

const filePath = 'C:\\Users\\damat\\_REPOS\\AD\\components\\auth\\SimplePlayerLogin.tsx';
const content = fs.readFileSync(filePath, 'utf-8');

// Look for the main function and track braces
let braceCount = 0;
let inMainFunction = false;
const lines = content.split('\n');

console.log('Analyzing brace structure in SimplePlayerLogin.tsx:');

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    
    // Check if this is the main function start
    if (line.includes('const SimplePlayerLogin: React.FC') && line.includes(' = ')) {
        inMainFunction = true;
        console.log(`Line ${lineNum}: Main function starts`);
    }
    
    if (inMainFunction) {
        // Count opening braces
        const openBraces = (line.match(/{/g) || []).length;
        const closeBraces = (line.match(/}/g) || []).length;
        
        braceCount += openBraces - closeBraces;
        
        if (openBraces > 0 || closeBraces > 0) {
            console.log(`Line ${lineNum}: ${line.trim()} | Brace count: ${braceCount}`);
        }
        
        // If we reach 0 braces, main function should be closed
        if (braceCount === 0 && lineNum > 20) {
            console.log(`Line ${lineNum}: Main function should end here`);
            inMainFunction = false;
        }
    }
    
    // Check for the error boundary function
    if (line.includes('SimplePlayerLoginWithErrorBoundary')) {
        console.log(`Line ${lineNum}: Error boundary function starts`);
        break;
    }
}

console.log(`Final brace count: ${braceCount}`);