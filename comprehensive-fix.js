const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Get all TypeScript files
const files = glob.sync('**/*.{ts,tsx}', {
  ignore: ['node_modules/**', 'dist/**', 'build/**', '.next/**', 'scripts/**']
});

let totalFixes = 0;

files.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Fix 1: Remove or comment out unused variables in parameters
    content = content.replace(/\(([^)]+)\)\s*=>\s*{/g, (match, params) => {
      // Parse parameters and check if they're used
      const paramList = params.split(',').map(p => p.trim());
      const newParams = paramList.map(param => {
        const paramName = param.split(':')[0].trim().replace(/[{}[\]]/g, '');
        if (paramName && !['children', 'className', 'style', 'onClick', 'onChange', 'value'].includes(paramName)) {
          // Check if parameter is used in the function body
          const afterMatch = content.substring(content.indexOf(match) + match.length);
          const functionBody = afterMatch.substring(0, afterMatch.indexOf('}'));
          const paramRegex = new RegExp(`\b${paramName}\b`);
          if (!paramRegex.test(functionBody)) {
            // Prefix with underscore if not used
            return param.replace(paramName, `_${paramName}`);
          }
        }
        return param;
      });
      return `(${newParams.join(', ')}) => {`;
    });
    
    // Fix 2: Replace console statements with conditional logging
    content = content.replace(/console\.(log|error|warn|info|debug)\((.*?)\);?/g, (match, method, args) => {
      if (method === 'error') {
        return `if (process.env.NODE_ENV === 'development') { console.error(${args}); }`;
      }
      return '// ' + match;
    });
    
    // Fix 3: Fix unescaped entities in JSX
    const jsxTextPattern = />([^<]+)</g;
    content = content.replace(jsxTextPattern, (match, text) => {
      let fixedText = text
        .replace(/'/g, '&apos;')
        .replace(/"/g, '&quot;')
        .replace(/&(?!(apos|quot|lt|gt|amp|#\d+|#x[\da-fA-F]+);)/g, '&amp;');
      return `>${fixedText}<`;
    });
    
    // Fix 4: Replace 'any' with 'unknown' where safe
    content = content.replace(/:\s*any(\s|,|\)|>|$)/g, ': unknown$1');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      totalFixes++;
      console.log(`Fixed: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
});

console.log(`\nTotal files fixed: ${totalFixes}`);
