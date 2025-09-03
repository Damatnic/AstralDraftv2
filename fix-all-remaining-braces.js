import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getFilesWithMissingBraces() {
  try {
    const tscOutput = execSync('npx tsc --noEmit --skipLibCheck', { 
      encoding: 'utf-8',
      cwd: __dirname 
    });
    return [];
  } catch (error) {
    const output = error.stdout || error.message;
    const lines = output.split('\n');
    const files = lines
      .filter(line => line.includes("TS1005") && line.includes("'}' expected") && line.includes(",1)"))
      .map(line => line.split('(')[0])
      .filter((file, index, arr) => arr.indexOf(file) === index); // unique
    return files;
  }
}

function countBraces(content) {
  const openBraces = (content.match(/{/g) || []).length;
  const closeBraces = (content.match(/}/g) || []).length;
  return { openBraces, closeBraces, missing: openBraces - closeBraces };
}

function fixFile(filePath) {
  try {
    const fullPath = path.join(__dirname, filePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`File not found: ${filePath}`);
      return false;
    }
    
    let content = fs.readFileSync(fullPath, 'utf-8');
    const braceInfo = countBraces(content);
    
    if (braceInfo.missing > 0) {
      console.log(`${filePath}: Missing ${braceInfo.missing} closing braces`);
      const missingBraces = '}'.repeat(braceInfo.missing);
      content = content.trimEnd() + '\n' + missingBraces + '\n';
      fs.writeFileSync(fullPath, content);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
    return false;
  }
}

console.log('Getting all files with missing braces...');
const filesToFix = getFilesWithMissingBraces();
console.log(`Found ${filesToFix.length} files with missing braces`);

let fixedCount = 0;
filesToFix.forEach(file => {
  if (fixFile(file)) {
    fixedCount++;
  }
});

console.log(`Fixed ${fixedCount} files with missing braces!`);