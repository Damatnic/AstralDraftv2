import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Remaining files with missing braces (based on updated TS error analysis)
const filesToFix = [
  'components/icons/ClearIcon.tsx',
  'components/icons/DownloadIcon.tsx', 
  'components/icons/ExportIcon.tsx',
  'components/icons/RefineIcon.tsx',
  'components/icons/RestoreIcon.tsx',
  'components/icons/TrashIcon.tsx',
  'components/injury/InjuryAlertNotification.tsx',
  'components/layout/MobileEnhancedDashboard.tsx',
  'components/league/LeagueCreationWizard.tsx',
  'components/mobile/AccessibleMobileComponents.tsx',
  'components/mobile/EnhancedMobileOracleInterface.tsx',
  'components/mobile/MobileGestureNavigation.tsx',
  'components/mobile/MobileLayout.tsx',
  'components/mobile/MobileOfflineIndicator.tsx',
  'components/mobile/MobilePlayerSearch.tsx',
  'components/mobile/MobilePullToRefresh.tsx',
  'components/mobile/PWAInstallPrompt.tsx',
  'components/notifications/NotificationCenter.tsx',
  'components/notifications/NotificationDemo.tsx',
  'components/notifications/NotificationToast.tsx'
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

console.log('Starting batch fix for remaining missing braces...');
filesToFix.forEach(fixFile);
console.log('Batch fix completed!');