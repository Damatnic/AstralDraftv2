const fs = require('fs');
const path = require('path');

/**
 * Script to replace console.log statements with proper logging
 */

// Files to process (most critical ones first)
const filesToProcess = [
  'services/oracleRealTimeService.ts',
  'services/oracleRealTimeBridge.ts', 
  'services/paymentService.ts',
  'services/pushNotificationService.ts',
  'services/performanceMonitoringService.ts',
  'services/realTimeDataService.ts',
  'services/realTimeDataServiceV2.ts',
  'services/realTimeDraftService.ts',
  'services/realTimeNflDataService.ts',
  'services/tradeAnalysisService.ts',
  'services/productionOraclePredictionService.ts',
  'services/realtimeNotificationService.ts'
];

function replaceConsoleStatements(filePath) {
  try {
    const fullPath = path.join(__dirname, filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️ File not found: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let changes = 0;

    // Add logger import if not present
    if (!content.includes('import { logger }')) {
      // Find the last import statement
      const importRegex = /import[^;]+;/g;
      const imports = content.match(importRegex);
      if (imports && imports.length > 0) {
        const lastImport = imports[imports.length - 1];
        const insertPoint = content.indexOf(lastImport) + lastImport.length;
        content = content.slice(0, insertPoint) + '\nimport { logger } from \'./loggingService\';' + content.slice(insertPoint);
        changes++;
      }
    }

    // Replace console.log statements
    const replacements = [
      {
        pattern: /console\.log\(([^)]+)\);?/g,
        replacement: 'logger.info($1);'
      },
      {
        pattern: /console\.error\(([^)]+)\);?/g,
        replacement: 'logger.error($1);'
      },
      {
        pattern: /console\.warn\(([^)]+)\);?/g,
        replacement: 'logger.warn($1);'
      },
      {
        pattern: /console\.debug\(([^)]+)\);?/g,
        replacement: 'logger.debug($1);'
      },
      {
        pattern: /console\.info\(([^)]+)\);?/g,
        replacement: 'logger.info($1);'
      }
    ];

    replacements.forEach(({ pattern, replacement }) => {
      const matches = content.match(pattern);
      if (matches) {
        content = content.replace(pattern, replacement);
        changes += matches.length;
      }
    });

    if (changes > 0) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ ${filePath}: ${changes} console statements replaced`);
    } else {
      console.log(`ℹ️ ${filePath}: No console statements found`);
    }

  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Process all files
console.log('🔄 Starting console statement replacement...\n');

filesToProcess.forEach(filePath => {
  replaceConsoleStatements(filePath);
});

console.log('\n✅ Console statement replacement complete!');
console.log('\n📋 Next steps:');
console.log('1. Review changes with: git diff');
console.log('2. Run ESLint to check: npx eslint services/ --ext .ts');
console.log('3. Test the application: npm run dev');
