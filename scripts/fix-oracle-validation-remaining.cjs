const fs = require('fs');

// Fix all remaining interface issues in OracleCalibrationValidationSection.tsx
const filePath = 'C:\\Users\\damat\\_REPOS\\AD\\components\\oracle\\OracleCalibrationValidationSection.tsx';

// Read the file
let content = fs.readFileSync(filePath, 'utf-8');

// Apply specific fixes based on error lines
const fixes = [
  // Line 372: Missing closing brace for ValidationDemoState  
  {
    search: /(\s+featureImportance\?: any;\s+}\s*)\n\n(\/\/ ===== UTILITY INTERFACES =====)/,
    replace: '$1\n}\n\n$2'
  },
  // Line 382: Missing closing brace for ValidationConfig
  {
    search: /(\s+saveIntermediateResults: boolean;\s*}\s*)\n\n(interface ModelMetadata)/,
    replace: '$1\n}\n\n$2'
  }
];

console.log('Original content length:', content.length);

// Apply the fixes
fixes.forEach((fix, index) => {
  const original = content;
  content = content.replace(fix.search, fix.replace);
  if (content !== original) {
    console.log(`Applied fix ${index + 1} - changed ${original.length} to ${content.length} chars`);
  } else {
    console.log(`Fix ${index + 1} - no match found`);
  }
});

// Also add missing closing braces at the end of interfaces that are cut off
const lines = content.split('\n');
for (let i = 0; i < lines.length - 1; i++) {
  const line = lines[i];
  const nextLine = lines[i + 1];
  
  // If current line ends with ; or }; and next line starts with interface or //, likely missing }
  if ((line.trim().endsWith(';') || line.trim().endsWith('};')) && 
      (nextLine.trim().startsWith('interface ') || nextLine.trim().startsWith('// ====='))) {
    // Count braces to see if interface is unclosed
    let braceCount = 0;
    let interfaceStarted = false;
    
    // Look backwards to find interface start
    for (let j = i; j >= 0; j--) {
      const checkLine = lines[j];
      if (checkLine.includes('interface ') && checkLine.includes('{')) {
        interfaceStarted = true;
      }
      if (interfaceStarted) {
        braceCount += (checkLine.match(/\{/g) || []).length;
        braceCount -= (checkLine.match(/\}/g) || []).length;
      }
      
      if (interfaceStarted && (checkLine.includes('// =====') || j === 0)) {
        break;
      }
    }
    
    if (braceCount > 0 && interfaceStarted) {
      lines[i] = line + '\n}';
      console.log(`Added missing closing brace after line ${i + 1}: ${line.trim()}`);
    }
  }
}

content = lines.join('\n');

// Write the fixed content back
fs.writeFileSync(filePath, content);
console.log('Final content length:', content.length);
console.log('Fixed remaining interface issues in OracleCalibrationValidationSection.tsx');