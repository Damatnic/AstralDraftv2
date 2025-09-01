const fs = require('fs');
const path = require('path');
const glob = require('glob');

// HTML entities to fix
const entityMap = {
    '&gt;': '>',
    '&lt;': '<',
    '&rbrace;': '}',
    '&lbrace;': '{',
    '&quot;': '"',
    '&apos;': "'",
    '&amp;': '&'
};

function fixHtmlEntities(content) {
    let fixed = content;
    
    // Replace HTML entities
    for (const [entity, replacement] of Object.entries(entityMap)) {
        fixed = fixed.replace(new RegExp(entity, 'g'), replacement);
    }
    
    // Fix common syntax issues
    // Fix broken className attributes
    fixed = fixed.replace(/className="([^"]*)`([^`]*)/g, 'className="$1$2"');
    fixed = fixed.replace(/className=`([^`]*)"([^"]*)/g, 'className="$1$2"');
    
    // Fix broken onClick handlers
    fixed = fixed.replace(/onClick=\(\) = aria-label="[^"]*"\> \{/g, 'onClick={() => {');
    
    // Fix comment syntax
    fixed = fixed.replace(/\/\/\s*([A-Za-z][^<>]*)/g, '$1');
    
    // Fix missing closing braces in interfaces and objects
    fixed = fixed.replace(/(\s+)(\w+):\s*([A-Za-z\[\]<>|{}\s]+);(\s*}];\s*\w)/g, '$1$2: $3;$4');
    
    return fixed;
}

function processFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const fixed = fixHtmlEntities(content);
        
        if (content !== fixed) {
            fs.writeFileSync(filePath, fixed, 'utf8');
            console.log(`Fixed: ${filePath}`);
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
        return false;
    }
}

function main() {
    const patterns = [
        'components/**/*.tsx',
        'components/**/*.ts',
        'hooks/**/*.ts',
        'services/**/*.ts',
        'contexts/**/*.tsx',
        'views/**/*.tsx',
        'utils/**/*.ts',
        'types/**/*.ts'
    ];
    
    let totalFixed = 0;
    
    for (const pattern of patterns) {
        const files = glob.sync(pattern);
        console.log(`Processing ${files.length} files for pattern: ${pattern}`);
        
        for (const file of files) {
            if (processFile(file)) {
                totalFixed++;
            }
        }
    }
    
    console.log(`\nCompleted! Fixed ${totalFixed} files.`);
}

if (require.main === module) {
    main();
}

module.exports = { fixHtmlEntities, processFile };