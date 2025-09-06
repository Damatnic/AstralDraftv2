#!/usr/bin/env node

/**
 * JSX Corruption & HTML Entity Fix Script
 * 
 * This script fixes two types of issues:
 * 1. HTML entity encoding corruption (e.g., &lt; → <, &quot; → ", &amp; → &)
 * 2. JSX syntax corruption where attributes are positioned outside/after the opening tag
 * 
 * Example HTML entity corruption:
 * &lt;div&gt; → <div>
 * &quot;text&quot; → "text"
 * 
 * Example JSX corruption:
 * <Button>
 *   onClick={handleClick}
 *   disabled={true}
 * />
 * 
 * Should be:
 * <Button
 *   onClick={handleClick}
 *   disabled={true}
 * />
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const ROOT_DIR = process.cwd();
const EXTENSIONS = ['.tsx', '.ts'];
const EXCLUDE_DIRS = ['node_modules', '.git', 'dist', 'build'];

// Stats tracking
const stats = {
  filesProcessed: 0,
  filesFixed: 0,
  totalReplacements: 0,
  errors: []
};

/**
 * Check if a directory should be excluded
 */
function shouldExcludeDir(dirPath) {
  return EXCLUDE_DIRS.some(excludeDir => 
    dirPath.includes(`/${excludeDir}/`) || 
    dirPath.includes(`\\${excludeDir}\\`) ||
    dirPath.endsWith(`/${excludeDir}`) ||
    dirPath.endsWith(`\\${excludeDir}`)
  );
}

/**
 * Recursively find all TypeScript/TSX files
 */
function findTSXFiles(dir) {
  let results = [];
  
  try {
    const list = fs.readdirSync(dir);
    
    for (const file of list) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat && stat.isDirectory()) {
        if (!shouldExcludeDir(filePath)) {
          results = results.concat(findTSXFiles(filePath));
        }
      } else {
        const ext = path.extname(file);
        if (EXTENSIONS.includes(ext)) {
          results.push(filePath);
        }
      }
    }
  } catch (error) {
    stats.errors.push(`Error reading directory ${dir}: ${error.message}`);
  }
  
  return results;
}

/**
 * Fix JSX corruption, HTML entity encoding issues, and TypeScript interface syntax issues
 */
function fixJSXCorruption(content) {
  let fixedContent = content;
  let replacements = 0;
  
  // FIRST: Fix HTML entity encoding issues
  const htmlEntityReplacements = [
    { pattern: /&quot;/g, replacement: '"', name: 'quotes' },
    { pattern: /&lt;/g, replacement: '<', name: 'less than' },
    { pattern: /&gt;/g, replacement: '>', name: 'greater than' },
    { pattern: /&amp;/g, replacement: '&', name: 'ampersand' },
    { pattern: /&#39;/g, replacement: "'", name: 'apostrophe' },
    { pattern: /&apos;/g, replacement: "'", name: 'apostrophe' },
    { pattern: /&nbsp;/g, replacement: ' ', name: 'non-breaking space' },
    { pattern: /&copy;/g, replacement: '©', name: 'copyright' },
    { pattern: /&reg;/g, replacement: '®', name: 'registered trademark' },
    { pattern: /&trade;/g, replacement: '™', name: 'trademark' },
    { pattern: /&hellip;/g, replacement: '…', name: 'ellipsis' },
    { pattern: /&mdash;/g, replacement: '—', name: 'em dash' },
    { pattern: /&ndash;/g, replacement: '–', name: 'en dash' },
    { pattern: /&ldquo;/g, replacement: '"', name: 'left double quote' },
    { pattern: /&rdquo;/g, replacement: '"', name: 'right double quote' },
    { pattern: /&lsquo;/g, replacement: "'", name: 'left single quote' },
    { pattern: /&rsquo;/g, replacement: "'", name: 'right single quote' }
  ];
  
  // Apply HTML entity fixes
  htmlEntityReplacements.forEach(({ pattern, replacement }) => {
    const matches = fixedContent.match(pattern);
    if (matches) {
      fixedContent = fixedContent.replace(pattern, replacement);
      replacements += matches.length;
    }
  });
  
  // Pattern to match JSX corruption:
  // 1. JSX element opening tag ending with >
  // 2. Followed by newline and whitespace
  // 3. Followed by attribute(s) on separate lines
  // 4. Ending with /> or >
  
  // This regex matches the corruption pattern where attributes come after the >
  const corruptionPattern = /(<[A-Z][a-zA-Z0-9]*>)\s*\n(\s+)([a-zA-Z_][a-zA-Z0-9_]*\s*=[\s\S]*?)\n(\s*\/?>)/gm;
  
  fixedContent = fixedContent.replace(corruptionPattern, (match, openTag, indent, attributes, closeTag) => {
    replacements++;
    
    // Extract the tag name from the opening tag
    const tagName = openTag.slice(1, -1); // Remove < and >
    
    // Clean up attributes - remove extra whitespace and ensure proper formatting
    const cleanedAttributes = attributes.trim();
    
    // Reconstruct the proper JSX syntax
    return `<${tagName}\n${indent}${cleanedAttributes}\n${closeTag}`;
  });
  
  // Also handle multi-line attribute corruption (more complex cases)
  const multiLinePattern = /(<[A-Z][a-zA-Z0-9]*>)\s*\n((?:\s+[a-zA-Z_][a-zA-Z0-9_]*\s*=.*\n)+)(\s*\/?>)/gm;
  
  fixedContent = fixedContent.replace(multiLinePattern, (match, openTag, attributeLines, closeTag) => {
    replacements++;
    
    // Extract the tag name
    const tagName = openTag.slice(1, -1);
    
    // Clean up the attribute lines
    const lines = attributeLines.split('\n').filter(line => line.trim());
    const formattedAttributes = lines.join('\n');
    
    return `<${tagName}\n${formattedAttributes}\n${closeTag}`;
  });
  
  // Fix missing closing braces for interfaces
  // Pattern: interface name { ... properties ... \n\nexport or \n\ninterface or \n\nclass
  const interfacePattern = /((?:export\s+)?interface\s+\w+\s*\{[^}]*)\n\n((?:export\s+)?(?:interface|class|const|function|export))/gm;
  
  fixedContent = fixedContent.replace(interfacePattern, (match, interfaceContent, nextDeclaration) => {
    replacements++;
    return `${interfaceContent}}\n\n${nextDeclaration}`;
  });
  
  // Another pattern for interface followed by comment
  const interfaceCommentPattern = /((?:export\s+)?interface\s+\w+\s*\{[^}]*)\n\n(\/\/.*)/gm;
  
  fixedContent = fixedContent.replace(interfaceCommentPattern, (match, interfaceContent, comment) => {
    replacements++;
    return `${interfaceContent}}\n\n${comment}`;
  });
  
  return { content: fixedContent, replacements };
}

/**
 * Process a single file
 */
function processFile(filePath) {
  try {
    stats.filesProcessed++;
    
    const content = fs.readFileSync(filePath, 'utf8');
    const { content: fixedContent, replacements } = fixJSXCorruption(content);
    
    if (replacements > 0) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      stats.filesFixed++;
      stats.totalReplacements += replacements;
      console.log(`✅ Fixed ${replacements} issue(s) in: ${path.relative(ROOT_DIR, filePath)}`);
    }
    
  } catch (error) {
    stats.errors.push(`Error processing ${filePath}: ${error.message}`);
    console.error(`❌ Error processing ${filePath}: ${error.message}`);
  }
}

/**
 * Main execution function
 */
function main() {
  console.log('🔍 Starting JSX corruption and HTML entity fix...\n');
  console.log('📁 Scanning for TypeScript/TSX files...');
  
  const files = findTSXFiles(ROOT_DIR);
  console.log(`📄 Found ${files.length} TypeScript/TSX files\n`);
  
  console.log('🔧 Processing files...');
  
  for (const file of files) {
    processFile(file);
  }
  
  // Print summary
  console.log('\n📊 Summary:');
  console.log(`Files processed: ${stats.filesProcessed}`);
  console.log(`Files fixed: ${stats.filesFixed}`);
  console.log(`Total replacements: ${stats.totalReplacements}`);
  
  if (stats.errors.length > 0) {
    console.log(`\n❌ Errors encountered: ${stats.errors.length}`);
    stats.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  if (stats.filesFixed > 0) {
    console.log('\n✅ JSX corruption and HTML entity fix completed successfully!');
    console.log('💡 It is recommended to run your build/test commands to verify the fixes.');
  } else {
    console.log('\n✨ No issues found - code is already clean!');
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { fixJSXCorruption, findTSXFiles };