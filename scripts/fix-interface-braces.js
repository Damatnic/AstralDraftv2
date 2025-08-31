#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixInterfaceBraces(content) {
    // Find all interface declarations that are missing closing braces
    // Pattern: interface Name { ... without a closing }
    // Look for cases where interface is followed by something other than }
    
    return content.replace(
        /(interface\s+\w+\s*\{[^{}]*)\n(\s*)(const|export|function|interface|class)/g,
        (match, interfaceContent, whitespace, nextKeyword) => {
            // Check if the interface content already has a proper closing brace
            const openBraces = (interfaceContent.match(/\{/g) || []).length;
            const closeBraces = (interfaceContent.match(/\}/g) || []).length;
            
            if (openBraces > closeBraces) {
                // Missing closing brace
                return interfaceContent + '\n}\n\n' + whitespace + nextKeyword;
            }
            return match; // Return unchanged
        }
    );
}

// Get all TypeScript files
const files = glob.sync('{components,contexts,views,hooks,utils}/**/*.{ts,tsx}', {
    cwd: path.join(__dirname, '..'),
});

console.log(`Found ${files.length} files to check for missing interface braces...`);

let fixedFiles = 0;
let errorFiles = 0;

files.forEach((file, index) => {
    const fullPath = path.join(__dirname, '..', file);
    
    try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const fixedContent = fixInterfaceBraces(content);
        
        if (fixedContent !== content) {
            fs.writeFileSync(fullPath, fixedContent);
            fixedFiles++;
            console.log(`✅ Fixed interface braces in: ${file}`);
        }
        
        if ((index + 1) % 200 === 0) {
            console.log(`Progress: ${index + 1}/${files.length} files processed...`);
        }
    } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
        errorFiles++;
    }
});

console.log(`\n🎉 Interface brace fixing complete!`);
console.log(`✅ Fixed: ${fixedFiles} files`);
console.log(`❌ Errors: ${errorFiles} files`);
console.log(`📄 Total: ${files.length} files processed`);