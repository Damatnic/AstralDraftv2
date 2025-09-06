import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Files that need missing braces fixed (based on TS error analysis)
const filesToFix = [
  'components/commissioner/EnhancedMemberManagement.tsx',
  'components/commissioner/SeasonManagement.tsx', 
  'components/comparison/MatchupTrendChart.tsx',
  'components/comparison/MatchupTrendChartFixed.tsx',
  'components/comparison/PlayerComparisonTool.tsx',
  'components/core/Breadcrumbs.tsx',
  'components/core/EnhancedCreateLeagueModal.tsx',
  'components/core/ErrorBoundary.tsx',
  'components/dashboard/AccessibilityDashboard.tsx',
  'components/dashboard/AccessibilityDashboardSimple.tsx',
  'components/dashboard/DataPersistencePanel.tsx',
  'components/dashboard/OracleUserDashboard.tsx',
  'components/examples/GestureExampleComponent.tsx'
];

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
      return;
    }
    
    let content = fs.readFileSync(fullPath, 'utf-8');
    const braceInfo = countBraces(content);
    
    if (braceInfo.missing > 0) {
      console.log(`${filePath}: Missing ${braceInfo.missing} closing braces`);
      const missingBraces = '}'.repeat(braceInfo.missing);
      content = content.trimEnd() + '\n' + missingBraces + '\n';
      fs.writeFileSync(fullPath, content);
      console.log(`Fixed: ${filePath}`);
    } else {
      console.log(`${filePath}: No missing braces`);
    }
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

console.log('Starting batch fix for missing braces...');
filesToFix.forEach(fixFile);
console.log('Batch fix completed!');