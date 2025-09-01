#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Common syntax error patterns to fix
const fixPatterns = [
  // Fix extra closing parentheses in map functions
  { pattern: /\)\)\)\}/g, replacement: '))}' },
  
  // Fix missing closing braces for interfaces
  { pattern: /interface\s+\w+\s*\{[^}]*\n\nconst/g, fix: (match) => {
    return match.replace(/\n\nconst/, '}\n\nconst');
  }},
  
  // Fix missing closing braces in useEffect
  { pattern: /useEffect\(\(\)\s*=>\s*\{[^}]*\n\s*\},/g, fix: (match) => {
    const openBraces = (match.match(/\{/g) || []).length;
    const closeBraces = (match.match(/\}/g) || []).length;
    if (openBraces > closeBraces) {
      return match.replace(/\n\s*\},/, '\n    }\n  },');
    }
    return match;
  }},
  
  // Fix try-finally without catch
  { pattern: /try\s*\{([^}]*)\}\s*finally/g, replacement: 'try {$1} catch (error) { console.error(error); } finally' },
  
  // Fix broken template literals
  { pattern: /\$\{Date\.now\(\)\s*\}/g, replacement: '${Date.now()}' },
  
  // Fix missing closing brackets in arrays
  { pattern: /\[\s*'[^']+',\s*'[^']+',\s*'[^']+',\s*'[^']+',\s*'[^']+'\s*\n\s*\]/g, fix: (match) => {
    return match.replace(/\n\s*\]/, '\n        ]');
  }}
];

// Get all TypeScript files with errors
function getFilesWithErrors() {
  try {
    const output = execSync('npx tsc --noEmit 2>&1', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    const files = new Set();
    const lines = output.split('\n');
    
    lines.forEach(line => {
      const match = line.match(/^([^(]+\.tsx?)(\(|:)/);
      if (match) {
        files.add(match[1]);
      }
    });
    
    return Array.from(files);
  } catch (error) {
    // TypeScript will exit with error if compilation fails
    const output = error.stdout || error.output?.join('') || '';
    const files = new Set();
    const lines = output.split('\n');
    
    lines.forEach(line => {
      const match = line.match(/^([^(]+\.tsx?)(\(|:)/);
      if (match) {
        files.add(match[1]);
      }
    });
    
    return Array.from(files);
  }
}

// Fix a single file
function fixFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return false;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  fixPatterns.forEach(({ pattern, replacement, fix }) => {
    if (fix) {
      const newContent = content.replace(pattern, fix);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    } else if (replacement) {
      const newContent = content.replace(pattern, replacement);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    }
  });
  
  // Additional specific fixes
  
  // Fix unclosed if blocks in handle functions
  content = content.replace(/const handle\w+\s*=\s*\([^)]*\)\s*=>\s*\{([^}]*if\s*\([^)]+\)\s*\{[^}]*)\n\s*\};/g, (match, group1) => {
    const openBraces = (group1.match(/\{/g) || []).length;
    const closeBraces = (group1.match(/\}/g) || []).length;
    if (openBraces > closeBraces) {
      return match.replace(/\n\s*\};/, '\n    }\n  };');
    }
    return match;
  });
  
  // Fix missing return statements
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/^\s*\};?\s*$/) && i + 1 < lines.length) {
      const nextLine = lines[i + 1];
      if (nextLine.match(/^\s*\{\s*\/\*/) || nextLine.match(/^\s*<[A-Z]/)) {
        // Looks like JSX starting without return
        const prevLine = i > 0 ? lines[i - 1] : '';
        if (!prevLine.match(/return/)) {
          lines.splice(i + 1, 0, '  return (');
          modified = true;
          // Find the closing
          for (let j = i + 2; j < lines.length; j++) {
            if (lines[j].match(/^};?\s*$/)) {
              lines.splice(j, 0, '  );');
              break;
            }
          }
        }
      }
    }
  }
  
  if (modified) {
    content = lines.join('\n');
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${filePath}`);
    return true;
  }
  
  return false;
}

// Main execution
async function main() {
  console.log('Identifying files with TypeScript errors...');
  const filesWithErrors = getFilesWithErrors();
  
  console.log(`Found ${filesWithErrors.length} files with errors`);
  
  let fixedCount = 0;
  for (const file of filesWithErrors) {
    if (fixFile(file)) {
      fixedCount++;
    }
  }
  
  console.log(`\nFixed ${fixedCount} files`);
  
  // Check remaining errors
  console.log('\nChecking remaining errors...');
  try {
    execSync('npx tsc --noEmit', { stdio: 'inherit' });
    console.log('All TypeScript errors resolved!');
  } catch (error) {
    console.log('Some errors remain. Running detailed analysis...');
    const output = execSync('npx tsc --noEmit 2>&1 | grep -E "TS1005|TS1109|TS1128|TS1003|TS1381" | wc -l', { encoding: 'utf8' });
    console.log(`Remaining syntax errors: ${output.trim()}`);
  }
}

main().catch(console.error);