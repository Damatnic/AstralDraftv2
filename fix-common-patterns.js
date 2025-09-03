const fs = require('fs');
const path = require('path');

// Common problematic patterns to fix
const patterns = [
    // Interface missing closing brace
    {
        regex: /(\s+[a-zA-Z_][a-zA-Z0-9_]*:\s*[^;]+;)\s+(\n\s*(?:const|interface|class|export))/g,
        replacement: '$1\n}\n\n$2'
    },
    // Missing comma in object properties
    {
        regex: /(\s+[a-zA-Z_][a-zA-Z0-9_]*:\s*[^,\n}]+)(\n\s*[a-zA-Z_][a-zA-Z0-9_]*:)/g,
        replacement: '$1,$2'
    },
    // Broken onClick handlers
    {
        regex: /onClick=\{([^}]+)\},\s*$/gm,
        replacement: 'onClick={$1}'
    }
];

function fixFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf-8');
        let originalContent = content;
        let changed = false;
        
        for (const pattern of patterns) {
            content = content.replace(pattern.regex, pattern.replacement);
            if (content !== originalContent) {
                changed = true;
                originalContent = content;
            }
        }
        
        if (changed) {
            fs.writeFileSync(filePath, content);
            console.log(`Fixed patterns in: ${filePath}`);
            return true;
        }
        
        return false;
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
        return false;
    }
}

// Find all TypeScript React files
function findTSXFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.includes('node_modules') && !item.startsWith('.')) {
            files.push(...findTSXFiles(fullPath));
        } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
            files.push(fullPath);
        }
    }
    
    return files;
}

// Get files with current errors
const errorFiles = [
    'components/oracle/OracleCalibrationValidationSection.tsx',
    'components/social/SocialTab.tsx',
    'components/oracle/TrainingDataManager.tsx',
    'components/dashboard/AccessibilityDashboard.tsx',
    'components/oracle/EnhancedOracleMobileInterface.tsx',
    'contexts/EnhancedThemeContext.tsx',
    'src/types/api/requests.ts'
];

let fixedCount = 0;
for (const file of errorFiles) {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
        if (fixFile(fullPath)) {
            fixedCount++;
        }
    }
}

console.log(`Applied pattern fixes to ${fixedCount} files`);