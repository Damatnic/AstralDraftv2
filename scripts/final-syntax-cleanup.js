#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function comprehensiveCleanup(content) {
    let originalContent = content;
    
    // Fix 1: Malformed return statements in useEffect cleanup
    content = content.replace(
        /return\s+\(\s*\)\s*\}\s+([^{}]+\([^)]*\);)/g,
        'return () => {\n      $1\n    };'
    );
    
    // Fix 2: Extra semicolons after closing braces
    content = content.replace(/};\s*;/g, '};');
    
    // Fix 3: Missing opening braces in arrow functions
    content = content.replace(
        /return\s+\(\s*\)\s*\n\s*}\s*([^{}\n]+)/g,
        'return () => {\n      $1\n    };'
    );
    
    // Fix 4: Orphaned catch blocks (try-catch structure issues)
    content = content.replace(
        /\}\s*catch\s*\([^)]*\)\s*\{([^{}]+)\}\s*\}(?!\s*catch)/g,
        (match, catchBody) => {
            return match.replace(/}\s*catch/, '\n    } catch');
        }
    );
    
    // Fix 5: Fix incomplete try blocks
    content = content.replace(
        /try\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}\s*(?!catch|finally)/g,
        'try {\n$1\n    } catch (error) {\n        console.error(error);\n    }'
    );
    
    // Fix 6: Fix malformed function calls in JSX
    content = content.replace(
        /(onClick|onTouchStart|onChange|onSubmit|onFocus|onBlur)\s*=\s*\{\s*([^}]+)\s*\}\s*([^{}\n]+)/g,
        '$1={$2}'
    );
    
    // Fix 7: Fix malformed template literals
    content = content.replace(
        /`([^`]*)\s*\}\s*catch[^`]*`/g,
        '`$1`'
    );
    
    // Fix 8: Fix component parameters with extra type annotations
    content = content.replace(
        /React\.FC<([^>]+)>\s*=\s*\(\{([^}]+)\}:\s*\1\)\s*=>/g,
        'React.FC<$1> = ({ $2 }) =>'
    );
    
    // Fix 9: Fix standalone const declarations in wrong places
    content = content.replace(
        /\(\{\s*(const\s+[^=]+=\s*[^;]+;)\s*([^}]+)\s*\}\)/g,
        '({ $2 }) => {\n    $1'
    );
    
    // Fix 10: Fix method definitions missing proper structure
    content = content.replace(
        /(\w+)\s*\(\s*\)\s*\{\s*([^{}]+)\s*\}\s*\}\s*([^{}]*)\s*\{/g,
        '$1() {\n    $2\n  }\n\n  $3() {'
    );
    
    // Fix 11: Handle broken arrow functions with malformed bodies
    content = content.replace(
        /=>\s*\{([^{}]*)\}\s*([^{}\n]+)\s*=>/g,
        '=> {\n    $1\n    return $2;\n  }'
    );
    
    // Fix 12: Clean up double spaces and normalize formatting
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    content = content.replace(/;\s*;/g, ';');
    
    return content;
}

// Get all component files that might have syntax issues
const files = glob.sync('{components,views,contexts,utils,hooks}/**/*.{ts,tsx}', {
    cwd: path.join(__dirname, '..'),
});

console.log(`Found ${files.length} files for comprehensive syntax cleanup...`);

let fixedFiles = 0;
let errorFiles = 0;

files.forEach((file, index) => {
    const fullPath = path.join(__dirname, '..', file);
    
    try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const cleanedContent = comprehensiveCleanup(content);
        
        if (cleanedContent !== content) {
            fs.writeFileSync(fullPath, cleanedContent);
            fixedFiles++;
            console.log(`✅ Cleaned up: ${file}`);
        }
        
        if ((index + 1) % 200 === 0) {
            console.log(`Progress: ${index + 1}/${files.length} files processed...`);
        }
    } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
        errorFiles++;
    }
});

console.log(`\n🎉 Comprehensive cleanup complete!`);
console.log(`✅ Cleaned: ${fixedFiles} files`);
console.log(`❌ Errors: ${errorFiles} files`);
console.log(`📄 Total: ${files.length} files processed`);

// Final verification: check for common syntax error patterns
console.log('\n🔍 Verifying cleanup...');
const potentialIssues = [];

files.slice(0, 50).forEach(file => { // Sample first 50 files for verification
    const fullPath = path.join(__dirname, '..', file);
    try {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        if (content.match(/}\s*catch\s*\([^)]*\)\s*\{/g)) {
            potentialIssues.push(`${file}: Potentially misplaced catch block`);
        }
        if (content.match(/return\s+\(\s*\)\s*\}/g)) {
            potentialIssues.push(`${file}: Malformed return statement`);
        }
        if (content.match(/try\s*\{[^{}]*\}(?!\s*catch|\s*finally)/g)) {
            potentialIssues.push(`${file}: Try block without catch/finally`);
        }
    } catch (error) {
        // Skip files that can't be read
    }
});

if (potentialIssues.length > 0) {
    console.log('\n⚠️ Potential remaining issues:');
    potentialIssues.forEach(issue => console.log(`  ${issue}`));
} else {
    console.log('\n✅ No obvious syntax issues detected in sampled files!');
}