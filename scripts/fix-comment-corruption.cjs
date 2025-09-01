const fs = require('fs');
const path = require('path');
const glob = require('glob');

function fixCommentCorruption(content) {
    let fixed = content;
    
    // Fix single-line comments that lost their '//' prefix
    // Look for lines that appear to be comments but are missing //
    const lines = fixed.split('\n');
    const fixedLines = lines.map((line, index) => {
        const trimmed = line.trim();
        
        // Skip if already has comment syntax
        if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
            return line;
        }
        
        // Skip empty lines
        if (trimmed === '') {
            return line;
        }
        
        // Skip lines that are clearly code
        if (trimmed.match(/^(import|export|const|let|var|function|class|interface|type|enum|\w+\s*[=:(){}]|\w+\s*\()/)) {
            return line;
        }
        
        // Skip JSX/TSX content
        if (trimmed.match(/^[<>]|^\w+\s*[<>=]|^return\s*\(|^\)|^\}|^\{/)) {
            return line;
        }
        
        // Skip obvious code patterns
        if (trimmed.match(/^(if|else|for|while|switch|case|try|catch|finally|throw)\s*[\(\{]?/)) {
            return line;
        }
        
        // If it looks like a descriptive comment (contains common comment words)
        const commentWords = [
            'component', 'function', 'method', 'interface', 'type', 'service', 'api', 'data',
            'fetch', 'load', 'handle', 'process', 'render', 'display', 'show', 'hide',
            'calculate', 'generate', 'create', 'update', 'delete', 'get', 'set',
            'configuration', 'setup', 'initialization', 'cleanup', 'validation',
            'authentication', 'authorization', 'analytics', 'dashboard', 'overview',
            'chart', 'graph', 'table', 'modal', 'dialog', 'form', 'input', 'button',
            'loading', 'error', 'success', 'warning', 'info', 'message',
            'user', 'admin', 'player', 'team', 'league', 'draft', 'trade', 'season'
        ];
        
        const hasCommentWords = commentWords.some(word => 
            trimmed.toLowerCase().includes(word.toLowerCase())
        );
        
        // If it contains comment-like words and doesn't look like code, treat as comment
        if (hasCommentWords && trimmed.length > 10) {
            const indentation = line.match(/^(\s*)/)[1];
            return `${indentation}// ${trimmed}`;
        }
        
        return line;
    });
    
    fixed = fixedLines.join('\n');
    
    // Fix multi-line comment blocks that might be corrupted
    // Look for patterns where comment blocks lost their syntax
    fixed = fixed.replace(/^(\s*)(\/\*\*?\s*)?(\w+[^\/\*\n]*(?:component|function|interface|service|api|method|class|type)[^\/\*\n]*)\s*$/gmi, '$1// $3');
    
    return fixed;
}

function processFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const fixed = fixCommentCorruption(content);
        
        if (content !== fixed) {
            fs.writeFileSync(filePath, fixed, 'utf8');
            console.log(`Fixed comments: ${filePath}`);
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
    
    console.log(`\nCompleted! Fixed comments in ${totalFixed} files.`);
}

if (require.main === module) {
    main();
}

module.exports = { fixCommentCorruption, processFile };