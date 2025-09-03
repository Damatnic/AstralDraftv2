import fs from 'fs';
import path from 'path';

// Simple patterns to fix
const fixes = [
  // Missing closing braces for interfaces and types
  { pattern: /^\s*export interface \w+.*{[^}]*$/gm, needsClosingBrace: true },
  { pattern: /^\s*interface \w+.*{[^}]*$/gm, needsClosingBrace: true },
  { pattern: /^\s*type \w+.*{[^}]*$/gm, needsClosingBrace: true },
  
  // JSX syntax fixes
  { pattern: /onClick=\{[^}]+\}`\}/g, replacement: match => match.replace('}`}', '}')},
  { pattern: /className=\{[^}]+\}`\}/g, replacement: match => match.replace('}`}', '}')},
  
  // Missing semicolons after interface properties
  { pattern: /^(\s*\w+[?]?\s*:\s*[^;]+)\n(\s*})/gm, replacement: '$1;\n$2' },
  
  // Fix malformed JSX attributes
  { pattern: /(\w+)="[^"]*"\s*`\}/g, replacement: '$1="value"' },
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    fixes.forEach(fix => {
      if (fix.pattern && fix.replacement) {
        const newContent = content.replace(fix.pattern, fix.replacement);
        if (newContent !== content) {
          content = newContent;
          changed = true;
        }
      }
    });
    
    // Fix simple cases where interfaces are missing closing braces
    const lines = content.split('\n');
    let inInterface = false;
    let braceCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.match(/^\s*(export\s+)?interface\s+\w+/)) {
        inInterface = true;
        braceCount = 0;
      }
      
      if (inInterface) {
        braceCount += (line.match(/{/g) || []).length;
        braceCount -= (line.match(/}/g) || []).length;
        
        // If we reach a new declaration or export, close the interface
        if (i > 0 && braceCount > 0 && 
            (line.match(/^\s*(export\s+)?(interface|type|class|function|const|let|var)\s+/) ||
             line.match(/^\s*\/\*\*/))) {
          lines.splice(i, 0, '}');
          changed = true;
          inInterface = false;
        } else if (braceCount === 0 && inInterface) {
          inInterface = false;
        }
      }
    }
    
    if (changed) {
      fs.writeFileSync(filePath, lines.join('\n'));
      console.log(`Fixed: ${filePath}`);
      return true;
    }
    
  } catch (error) {
    // Silently continue
  }
  return false;
}

function scanDirectory(dir) {
  let fixedCount = 0;
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        fixedCount += scanDirectory(fullPath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        if (fixFile(fullPath)) {
          fixedCount++;
        }
      }
    });
  } catch (error) {
    // Silently continue
  }
  
  return fixedCount;
}

const targetDir = 'C:/Users/damat/_REPOS/AD';
console.log('Starting final missing brace fix...');
const fixedFiles = scanDirectory(targetDir);
console.log(`Fixed ${fixedFiles} files with missing braces`);