#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function finalCleanupPass(content) {
    let result = content;
    
    // Fix 1: Remove duplicate onClick handlers like {onClick}{onClick}
    result = result.replace(
        /(onClick|onTouchStart|onChange|onSubmit|onFocus|onBlur|onKeyDown|onKeyUp)\s*=\s*\{([^}]+)\}\s*\{[^}]+\}/g,
        '$1={$2}'
    );
    
    // Fix 2: Remove duplicated function calls like onChange={func}{func}
    result = result.replace(
        /(onChange|onClick|onSubmit|onFocus|onBlur)\s*=\s*\{([^}]+)\}\s*\{[^}]+\}/g,
        '$1={$2}'
    );
    
    // Fix 3: Fix className problems with duplicated expressions
    result = result.replace(
        /className\s*=\s*\{([^}]+)\}\s*\{[^}]+\}/g,
        'className={$1}'
    );
    
    // Fix 4: Remove duplicate catch blocks
    result = result.replace(
        /\}\s*catch\s*\([^)]*\)\s*\{\s*console\.error\([^)]+\);\s*\}\s*catch\s*\([^)]*\)\s*\{/g,
        '} catch (error) {'
    );
    
    // Fix 5: Fix malformed try-catch structures with extra blocks
    result = result.replace(
        /try\s*\{\s*\n\s*([^{}]+)\s*\n\s*\}\s*catch\s*\([^)]*\)\s*\{\s*console\.error\([^)]+\);\s*\}\s*catch\s*\([^)]*\)\s*\{/g,
        'try {\n        $1\n    } catch (error) {'
    );
    
    // Fix 6: Clean up extra whitespace and normalize
    result = result.replace(/\n\s*\n\s*\n/g, '\n\n');
    result = result.replace(/\s*;\s*;/g, ';');
    
    // Fix 7: Remove trailing incomplete strings and template literals
    result = result.replace(/`[^`]*withErrorBoundary[^`]*`;\s*$/, '');
    
    // Fix 8: Fix incomplete JSX attributes
    result = result.replace(
        /(value|placeholder|type|id|name|htmlFor)\s*=\s*\{([^}]+)\}\s*\{[^}]+\}/g,
        '$1={$2}'
    );
    
    // Fix 9: Remove orphaned closing braces and brackets
    result = result.replace(/^\s*\}\s*$/gm, '');
    result = result.replace(/^\s*\]\s*$/gm, '');
    
    return result;
}

// Get all files that may have been affected by the cleanup
const files = glob.sync('{components,views,contexts}/**/*.{ts,tsx}', {
    cwd: path.join(__dirname, '..'),
});

console.log(`Found ${files.length} files for final cleanup pass...`);

let fixedFiles = 0;

files.forEach((file, index) => {
    const fullPath = path.join(__dirname, '..', file);
    
    try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const cleanedContent = finalCleanupPass(content);
        
        if (cleanedContent !== content) {
            fs.writeFileSync(fullPath, cleanedContent);
            fixedFiles++;
            console.log(`✅ Final cleanup: ${file}`);
        }
        
        if ((index + 1) % 200 === 0) {
            console.log(`Progress: ${index + 1}/${files.length} files processed...`);
        }
    } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
    }
});

console.log(`\n🎉 Final cleanup pass complete!`);
console.log(`✅ Cleaned: ${fixedFiles} files`);
console.log(`📄 Total: ${files.length} files processed`);