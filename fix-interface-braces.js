const fs = require('fs');

function fixInterfaceBraces(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const fixedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        fixedLines.push(line);
        
        // Check if this line starts an interface/type declaration
        if (line.trim().match(/^export\s+(interface|type)\s+\w+/) && line.includes('{')) {
            // Look ahead to find where this interface should end
            let braceCount = 1; // We found one opening brace
            let j = i + 1;
            let foundClosingBrace = false;
            
            while (j < lines.length && braceCount > 0) {
                const nextLine = lines[j];
                
                // Count braces in this line
                for (const char of nextLine) {
                    if (char === '{') braceCount++;
                    if (char === '}') braceCount--;
                }
                
                // If we found the closing brace, we're done
                if (braceCount === 0) {
                    foundClosingBrace = true;
                    break;
                }
                
                // If we hit another export/interface without closing the current one
                if (nextLine.trim().match(/^export\s+(interface|type|const|function)/) && braceCount > 0) {
                    // Add closing brace before this new declaration
                    fixedLines.push('}');
                    fixedLines.push('');
                    foundClosingBrace = true;
                    break;
                }
                
                j++;
            }
        }
    }
    
    const newContent = fixedLines.join('\n');
    fs.writeFileSync(filePath, newContent);
    console.log(`Fixed interface braces in ${filePath}`);
}

// Fix the requests.ts file
fixInterfaceBraces('C:/Users/damat/_REPOS/AD/src/types/api/requests.ts');