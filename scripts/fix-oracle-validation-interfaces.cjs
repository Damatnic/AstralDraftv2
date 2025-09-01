const fs = require('fs');

// Fix missing closing braces in interface definitions
const filePath = 'C:\\Users\\damat\\_REPOS\\AD\\components\\oracle\\OracleCalibrationValidationSection.tsx';

// Read the file
let content = fs.readFileSync(filePath, 'utf-8');

// Define the fixes needed based on the error patterns
const fixes = [
  // Line 183: Property or signature expected
  {
    search: /(\s+revalidationFrequency: string;\s+}\s*\n\n\/\/ ===== DEMO)/,
    replace: '$1revalidationFrequency: string;\n  };\n}\n\n// ===== DEMO'
  },
  // Line 371: Missing closing brace for ValidationDemoState
  {
    search: /(\s+featureImportance\?: any;\s+}\s*\n\n\/\/ ===== UTILITY)/,
    replace: '$1featureImportance?: any;\n  };\n}\n\n// ===== UTILITY'
  },
  // Line 400: Missing closing brace for ModelMetadata
  {
    search: /(\s+test\?: number;\s+}\s*\n\n\/\/ ===== BIAS-VARIANCE)/,
    replace: '$1test?: number;\n  };\n}\n\n// ===== BIAS-VARIANCE'
  }
];

// Apply the fixes
fixes.forEach((fix, index) => {
  const original = content;
  content = content.replace(fix.search, fix.replace);
  if (content !== original) {
    console.log(`Applied fix ${index + 1}`);
  }
});

// Write the fixed content back
fs.writeFileSync(filePath, content);
console.log('Fixed interface closing braces in OracleCalibrationValidationSection.tsx');