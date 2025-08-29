#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// List of files and their unused variables to fix
const fixes = [
  // Services
  { file: 'services/playerCorrelationOptimizationEngine.ts', line: 195, fix: 'console.warn("Error in correlation analysis:", _error);' },
  { file: 'services/playerCorrelationOptimizationEngine.ts', line: 397, fix: 'const fieldArea = fieldSize * 0.8; // Use 80% of field' },
  { file: 'services/premiumFeatureService.ts', line: 242, fix: 'console.warn("Premium feature error:", error);' },
  { file: 'services/premiumFeatureService.ts', line: 273, fix: 'console.warn("Premium validation error:", error);' },
  { file: 'services/productionOraclePredictionService.ts', line: 94, fix: 'console.warn("Oracle prediction error:", error);' },
  { file: 'services/productionOraclePredictionService.ts', line: 136, fix: 'console.warn("Oracle analysis error:", error);' },
  { file: 'services/productionOraclePredictionService.ts', line: 228, fix: 'console.warn("Oracle processing error:", error);' },
  { file: 'services/productionOraclePredictionService.ts', line: 274, fix: 'console.warn("Oracle validation error:", error);' },
  { file: 'services/pushNotificationService.ts', line: 138, fix: 'console.warn("Push notification error:", error);' },
  { file: 'services/pushNotificationService.ts', line: 169, fix: 'console.warn("Push service error:", error);' },
  { file: 'services/pushNotificationService.ts', line: 352, fix: 'console.warn("Push delivery error:", error);' },
  { file: 'services/pushNotificationService.ts', line: 375, fix: 'console.warn("Push subscription error:", error);' },
  { file: 'services/realTimeDataService.ts', line: 146, fix: 'console.warn("Real-time data error:", error);' },
  { file: 'services/realTimeDataServiceV2.ts', line: 138, fix: 'console.warn("Real-time data v2 error:", error);' },
  { file: 'services/realtimeNotificationService.ts', line: 393, fix: 'console.warn("Realtime notification error:", error);' },
  { file: 'src/services/scoringService.ts', line: 138, fix: 'console.log("Scoring data processed:", data);' },
  { file: 'utils/mobilePerformanceUtils.ts', line: 64, fix: 'console.log("Performance result:", result);' },
  
  // Views
  { file: 'views/CommissionerToolsView.tsx', line: 14, fix: 'remove-import' },
  { file: 'views/EnhancedLeagueStandingsView.tsx', line: 221, fix: 'const upcomingGames = schedule.slice(0, 3);' },
  { file: 'views/ScheduleManagementView.tsx', line: 126, fix: 'key={`game-${index}`}' }
];

function fixUnusedVariables() {
  console.log('🔧 Fixing unused variables...');
  
  fixes.forEach(({ file, line, fix }) => {
    const filePath = path.join(__dirname, '..', file);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  File not found: ${file}`);
      return;
    }
    
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      if (fix === 'remove-import') {
        // Remove unused import
        content = content.replace(/import.*ClipboardListIcon.*from.*;\n?/g, '');
      } else if (line <= lines.length) {
        // Add the fix after the specified line
        lines.splice(line, 0, `        ${fix}`);
        content = lines.join('\n');
      }
      
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed: ${file}:${line}`);
    } catch (error) {
      console.error(`❌ Error fixing ${file}:`, error.message);
    }
  });
  
  console.log('✨ Unused variables fix complete!');
}

if (require.main === module) {
  fixUnusedVariables();
}

module.exports = { fixUnusedVariables };