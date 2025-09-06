#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixSyntaxErrors(content) {
    // Pattern 1: Fix mixed const declarations in function parameters
    // Example: ({ const [a, setA] = useState(); param }) => { 
    // Should be: ({ param }) => { const [a, setA] = useState();
    content = content.replace(
        /\(\{\s*(const\s+\[[^\]]+\]\s*=\s*[^;]+;)\s*([^}]+)\s*}\)\s*=>\s*\{/g,
        '({ $2 }) => {\n  $1'
    );
    
    // Pattern 2: Fix try blocks without catch/finally
    // Find try blocks that don't have proper catch/finally structure
    const tryBlockRegex = /(\s*try\s*\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\})\s*(?!(\s*catch\s*\([^)]*\)\s*\{|\s*finally\s*\{))/g;
    content = content.replace(tryBlockRegex, '$1\n    catch (error) {\n        console.error(error);\n    }');
    
    // Pattern 3: Fix malformed template literals that are split by catch blocks
    // Example: `${text} } catch (error) { } more text`
    content = content.replace(
        /`([^`]*)\s*\}\s*catch\s*\([^)]*\)\s*\{[^}]*\}\s*([^`]*)`/g,
        '`$1$2`'
    );
    
    // Pattern 4: Fix orphaned catch blocks without try
    content = content.replace(
        /(?<!try\s*\{[^}]*)\s*\}\s*catch\s*\([^)]*\)\s*\{/g,
        '\n    } catch (error) {'
    );
    
    // Pattern 5: Fix arrow functions with improper body structure  
    content = content.replace(
        /=>\s*\{\s*(const\s+[^=]+=\s*[^;]+;)\s*\}\s*([^{]*)\s*=>/g,
        '=> {\n    $1\n    $2\n}'
    );
    
    return content;
}

// Get all TypeScript/JSX files
const files = glob.sync('components/**/*.{ts,tsx}', {
    cwd: path.join(__dirname, '..'),
});

console.log(`Found ${files.length} component files to check for syntax errors...`);

let fixedFiles = 0;
let errorFiles = 0;

files.forEach((file, index) => {
    const fullPath = path.join(__dirname, '..', file);
    
    try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const fixedContent = fixSyntaxErrors(content);
        
        if (fixedContent !== content) {
            fs.writeFileSync(fullPath, fixedContent);
            fixedFiles++;
            console.log(`✅ Fixed syntax errors in: ${file}`);
        }
        
        if ((index + 1) % 100 === 0) {
            console.log(`Progress: ${index + 1}/${files.length} files processed...`);
        }
    } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
        errorFiles++;
    }
});

console.log(`\n🎉 Syntax error fixing complete!`);
console.log(`✅ Fixed: ${fixedFiles} files`);
console.log(`❌ Errors: ${errorFiles} files`);
console.log(`📄 Total: ${files.length} files processed`);