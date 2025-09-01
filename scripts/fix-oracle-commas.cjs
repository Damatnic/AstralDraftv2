const fs = require('fs');

// Fix missing commas in array objects
const filePath = 'C:\\Users\\damat\\_REPOS\\AD\\components\\oracle\\OracleCalibrationValidationSection.tsx';

let content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');

let fixedCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  const nextLine = i < lines.length - 1 ? lines[i + 1].trim() : '';
  const nextNextLine = i < lines.length - 2 ? lines[i + 2].trim() : '';
  
  // Pattern: line ends with ', nextLine is empty or whitespace, nextNextLine starts with } or ]
  if (line.includes("'") && (line.endsWith("'") || line.endsWith("';"))) {
    if (nextLine === '' && (nextNextLine.startsWith('}') || nextNextLine.startsWith(']'))) {
      // Missing comma
      if (!line.endsWith(',')) {
        lines[i] = lines[i].replace(/([^,])$/, '$1,');
        console.log(`Fixed missing comma on line ${i + 1}: ${line}`);
        fixedCount++;
      }
    }
  }
  
  // Also fix lines that end with implementation: 'text' followed by blank line and }
  if (line.includes('implementation:') && line.includes("'") && !line.endsWith(',')) {
    if (nextLine === '' && (nextNextLine.startsWith('}') || nextNextLine.startsWith(']'))) {
      lines[i] = lines[i].replace(/([^,])$/, '$1,');
      console.log(`Fixed missing comma after implementation on line ${i + 1}`);
      fixedCount++;
    }
  }
}

content = lines.join('\n');
fs.writeFileSync(filePath, content);
console.log(`Fixed ${fixedCount} missing commas in OracleCalibrationValidationSection.tsx`);