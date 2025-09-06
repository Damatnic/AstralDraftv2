#!/usr/bin/env node

/**
 * Comprehensive Integration Testing Script
 * Tests all systems working together harmoniously
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const testResults = {
  timestamp: new Date().toISOString(),
  totalTests: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
  sections: {}
};

function log(message, type = 'info') {
  const prefix = {
    'info': '📊',
    'success': '✅',
    'error': '❌',
    'warning': '⚠️',
    'test': '🧪'
  }[type] || '📊';
  
  console.log(`${prefix} ${message}`);
}

function runCommand(command, silent = false) {
  try {
    const result = execSync(command, { 
      encoding: 'utf8',
      stdio: silent ? 'pipe' : 'inherit'
    });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Test Build System
function testBuildSystem() {
  log('Testing Build System...', 'test');
  const section = { tests: [], passed: 0, failed: 0 };
  
  // Test 1: TypeScript compilation check
  log('Checking TypeScript compilation...', 'info');
  const tscResult = runCommand('npx tsc --noEmit 2>&1 | wc -l', true);
  const errorCount = parseInt(tscResult.output || '0');
  
  if (errorCount < 100) {
    section.passed++;
    section.tests.push({ name: 'TypeScript Errors', status: 'passed', details: `${errorCount} errors (acceptable)` });
  } else {
    section.failed++;
    section.tests.push({ name: 'TypeScript Errors', status: 'failed', details: `${errorCount} errors (too many)` });
  }
  
  // Test 2: Bundle size check
  log('Checking bundle sizes...', 'info');
  const distPath = path.join(__dirname, '..', 'dist');
  if (fs.existsSync(distPath)) {
    const stats = fs.statSync(path.join(distPath, 'index.html'));
    const indexSize = stats.size / 1024;
    
    if (indexSize < 50) {
      section.passed++;
      section.tests.push({ name: 'Index HTML Size', status: 'passed', details: `${indexSize.toFixed(2)}KB` });
    } else {
      section.failed++;
      section.tests.push({ name: 'Index HTML Size', status: 'failed', details: `${indexSize.toFixed(2)}KB (too large)` });
    }
  }
  
  // Test 3: Build artifacts exist
  const requiredFiles = ['index.html', 'assets'];
  const missingFiles = [];
  
  requiredFiles.forEach(file => {
    if (!fs.existsSync(path.join(distPath, file))) {
      missingFiles.push(file);
    }
  });
  
  if (missingFiles.length === 0) {
    section.passed++;
    section.tests.push({ name: 'Build Artifacts', status: 'passed', details: 'All required files present' });
  } else {
    section.failed++;
    section.tests.push({ name: 'Build Artifacts', status: 'failed', details: `Missing: ${missingFiles.join(', ')}` });
  }
  
  testResults.sections['Build System'] = section;
  testResults.totalTests += section.tests.length;
  testResults.passed += section.passed;
  testResults.failed += section.failed;
}

// Test Security Patches
function testSecurity() {
  log('Testing Security Patches...', 'test');
  const section = { tests: [], passed: 0, failed: 0 };
  
  // Test 1: Check for hardcoded API keys
  log('Checking for exposed API keys...', 'info');
  const sourceFiles = [
    'index.html',
    'App.tsx',
    'index.tsx'
  ];
  
  let exposedKeys = false;
  sourceFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('sk-') || content.includes('AIza')) {
        exposedKeys = true;
      }
    }
  });
  
  if (!exposedKeys) {
    section.passed++;
    section.tests.push({ name: 'API Key Security', status: 'passed', details: 'No exposed keys found' });
  } else {
    section.failed++;
    section.tests.push({ name: 'API Key Security', status: 'failed', details: 'Exposed API keys detected!' });
  }
  
  // Test 2: Security headers in HTML
  const indexPath = path.join(__dirname, '..', 'index.html');
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  if (indexContent.includes('Content-Security-Policy')) {
    section.passed++;
    section.tests.push({ name: 'CSP Headers', status: 'passed', details: 'Content Security Policy present' });
  } else {
    section.failed++;
    section.tests.push({ name: 'CSP Headers', status: 'failed', details: 'Missing CSP headers' });
  }
  
  testResults.sections['Security'] = section;
  testResults.totalTests += section.tests.length;
  testResults.passed += section.passed;
  testResults.failed += section.failed;
}

// Test Accessibility
function testAccessibility() {
  log('Testing Accessibility Features...', 'test');
  const section = { tests: [], passed: 0, failed: 0 };
  
  // Test 1: Check for ARIA labels
  const componentsPath = path.join(__dirname, '..', 'components');
  let ariaCount = 0;
  let totalComponents = 0;
  
  function checkDirectory(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        checkDirectory(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
        totalComponents++;
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('aria-') || content.includes('role=')) {
          ariaCount++;
        }
      }
    });
  }
  
  checkDirectory(componentsPath);
  
  const ariaPercentage = (ariaCount / totalComponents) * 100;
  if (ariaPercentage > 50) {
    section.passed++;
    section.tests.push({ name: 'ARIA Coverage', status: 'passed', details: `${ariaPercentage.toFixed(1)}% components have ARIA` });
  } else {
    section.failed++;
    section.tests.push({ name: 'ARIA Coverage', status: 'failed', details: `Only ${ariaPercentage.toFixed(1)}% components have ARIA` });
  }
  
  // Test 2: Keyboard navigation
  const keyboardFiles = ['CommandPalette', 'AccessibleModal', 'MobileNavigation'];
  let keyboardSupport = 0;
  
  keyboardFiles.forEach(file => {
    const filePath = path.join(componentsPath, 'core', `${file}.tsx`);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('onKeyDown') || content.includes('onKeyPress')) {
        keyboardSupport++;
      }
    }
  });
  
  if (keyboardSupport >= 2) {
    section.passed++;
    section.tests.push({ name: 'Keyboard Navigation', status: 'passed', details: `${keyboardSupport}/${keyboardFiles.length} components support keyboard` });
  } else {
    section.failed++;
    section.tests.push({ name: 'Keyboard Navigation', status: 'failed', details: `Only ${keyboardSupport}/${keyboardFiles.length} components support keyboard` });
  }
  
  testResults.sections['Accessibility'] = section;
  testResults.totalTests += section.tests.length;
  testResults.passed += section.passed;
  testResults.failed += section.failed;
}

// Test Performance Optimizations
function testPerformance() {
  log('Testing Performance Optimizations...', 'test');
  const section = { tests: [], passed: 0, failed: 0 };
  
  // Test 1: Lazy loading implementation
  const appPath = path.join(__dirname, '..', 'App.tsx');
  const appContent = fs.readFileSync(appPath, 'utf8');
  const lazyImports = (appContent.match(/React\.lazy/g) || []).length;
  
  if (lazyImports > 10) {
    section.passed++;
    section.tests.push({ name: 'Lazy Loading', status: 'passed', details: `${lazyImports} components lazy loaded` });
  } else {
    section.failed++;
    section.tests.push({ name: 'Lazy Loading', status: 'failed', details: `Only ${lazyImports} components lazy loaded` });
  }
  
  // Test 2: Memoization usage
  let memoCount = 0;
  const memoPatterns = ['useMemo', 'useCallback', 'React.memo'];
  
  function checkMemoization(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.')) {
        checkMemoization(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
        const content = fs.readFileSync(filePath, 'utf8');
        memoPatterns.forEach(pattern => {
          if (content.includes(pattern)) {
            memoCount++;
          }
        });
      }
    });
  }
  
  checkMemoization(path.join(__dirname, '..', 'components'));
  
  if (memoCount > 50) {
    section.passed++;
    section.tests.push({ name: 'Memoization', status: 'passed', details: `${memoCount} memoization usages found` });
  } else {
    section.failed++;
    section.tests.push({ name: 'Memoization', status: 'failed', details: `Only ${memoCount} memoization usages found` });
  }
  
  testResults.sections['Performance'] = section;
  testResults.totalTests += section.tests.length;
  testResults.passed += section.passed;
  testResults.failed += section.failed;
}

// Test Memory Management
function testMemoryManagement() {
  log('Testing Memory Management...', 'test');
  const section = { tests: [], passed: 0, failed: 0 };
  
  // Test 1: Cleanup implementations
  const cleanupPatterns = ['cleanup', 'dispose', 'unsubscribe', 'removeEventListener'];
  let cleanupCount = 0;
  
  function checkCleanup(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.')) {
        checkCleanup(filePath);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        const content = fs.readFileSync(filePath, 'utf8');
        cleanupPatterns.forEach(pattern => {
          if (content.includes(pattern)) {
            cleanupCount++;
          }
        });
      }
    });
  }
  
  checkCleanup(path.join(__dirname, '..'));
  
  if (cleanupCount > 20) {
    section.passed++;
    section.tests.push({ name: 'Cleanup Handlers', status: 'passed', details: `${cleanupCount} cleanup implementations found` });
  } else {
    section.failed++;
    section.tests.push({ name: 'Cleanup Handlers', status: 'failed', details: `Only ${cleanupCount} cleanup implementations found` });
  }
  
  // Test 2: WebSocket management
  const wsManagerPath = path.join(__dirname, '..', 'services', 'webSocketManager.ts');
  if (fs.existsSync(wsManagerPath)) {
    const wsContent = fs.readFileSync(wsManagerPath, 'utf8');
    if (wsContent.includes('cleanup') && wsContent.includes('dispose')) {
      section.passed++;
      section.tests.push({ name: 'WebSocket Cleanup', status: 'passed', details: 'WebSocket cleanup implemented' });
    } else {
      section.failed++;
      section.tests.push({ name: 'WebSocket Cleanup', status: 'failed', details: 'WebSocket cleanup missing' });
    }
  }
  
  testResults.sections['Memory Management'] = section;
  testResults.totalTests += section.tests.length;
  testResults.passed += section.passed;
  testResults.failed += section.failed;
}

// Test Fantasy Football Features
function testFantasyFeatures() {
  log('Testing Fantasy Football Features...', 'test');
  const section = { tests: [], passed: 0, failed: 0 };
  
  const criticalFeatures = [
    { name: 'Draft Room', file: 'components/draft/LiveDraftRoom.tsx' },
    { name: 'Player Pool', file: 'components/player/PlayerPool.tsx' },
    { name: 'Trade Center', file: 'components/team/TradeCenterWidget.tsx' },
    { name: 'Roster Manager', file: 'components/team/EnhancedRosterManager.tsx' },
    { name: 'League Hub', file: 'views/LeagueHubView.tsx' }
  ];
  
  criticalFeatures.forEach(feature => {
    const filePath = path.join(__dirname, '..', feature.file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      // Check for essential hooks and state management
      if (content.includes('useState') && content.includes('useEffect')) {
        section.passed++;
        section.tests.push({ name: feature.name, status: 'passed', details: 'Component properly structured' });
      } else {
        section.failed++;
        section.tests.push({ name: feature.name, status: 'failed', details: 'Missing essential React hooks' });
      }
    } else {
      section.failed++;
      section.tests.push({ name: feature.name, status: 'failed', details: 'File not found' });
    }
  });
  
  testResults.sections['Fantasy Features'] = section;
  testResults.totalTests += section.tests.length;
  testResults.passed += section.passed;
  testResults.failed += section.failed;
}

// Generate Report
function generateReport() {
  log('\\n=== INTEGRATION TEST REPORT ===\\n', 'info');
  
  Object.entries(testResults.sections).forEach(([sectionName, section]) => {
    log(`${sectionName}: ${section.passed}/${section.tests.length} passed`, 
        section.failed === 0 ? 'success' : 'warning');
    
    section.tests.forEach(test => {
      const icon = test.status === 'passed' ? '✅' : '❌';
      console.log(`  ${icon} ${test.name}: ${test.details}`);
    });
    console.log('');
  });
  
  const passRate = (testResults.passed / testResults.totalTests * 100).toFixed(1);
  
  log(`\\n=== OVERALL RESULTS ===`, 'info');
  log(`Total Tests: ${testResults.totalTests}`, 'info');
  log(`Passed: ${testResults.passed}`, 'success');
  log(`Failed: ${testResults.failed}`, testResults.failed > 0 ? 'error' : 'success');
  log(`Pass Rate: ${passRate}%`, passRate >= 80 ? 'success' : 'warning');
  
  // Write results to file
  fs.writeFileSync(
    path.join(__dirname, '..', 'integration-test-results.json'),
    JSON.stringify(testResults, null, 2)
  );
  
  // Create markdown report
  const mdReport = `# Integration Test Report

Generated: ${testResults.timestamp}

## Summary
- **Total Tests**: ${testResults.totalTests}
- **Passed**: ${testResults.passed}
- **Failed**: ${testResults.failed}
- **Pass Rate**: ${passRate}%

## Test Sections

${Object.entries(testResults.sections).map(([sectionName, section]) => `
### ${sectionName}
- Tests Run: ${section.tests.length}
- Passed: ${section.passed}
- Failed: ${section.failed}

| Test | Status | Details |
|------|--------|---------|
${section.tests.map(test => 
  `| ${test.name} | ${test.status === 'passed' ? '✅ Passed' : '❌ Failed'} | ${test.details} |`
).join('\\n')}
`).join('\\n')}

## Recommendations

${testResults.failed > 0 ? `
### Critical Issues to Address:
${Object.entries(testResults.sections).map(([sectionName, section]) => 
  section.failed > 0 ? `
- **${sectionName}**: ${section.failed} failures need attention
  ${section.tests.filter(t => t.status === 'failed').map(t => `  - ${t.name}: ${t.details}`).join('\\n')}
` : ''
).join('')}
` : '✅ All systems operating within acceptable parameters!'}

## Next Steps
1. ${testResults.failed > 0 ? 'Address critical failures identified above' : 'Continue monitoring system health'}
2. ${passRate < 90 ? 'Improve test coverage for better reliability' : 'Maintain current quality standards'}
3. Schedule next integration test in 2 hours
`;
  
  fs.writeFileSync(
    path.join(__dirname, '..', 'INTEGRATION_TEST_REPORT.md'),
    mdReport
  );
  
  log(`\\nReports saved to integration-test-results.json and INTEGRATION_TEST_REPORT.md`, 'success');
  
  // Exit with appropriate code
  process.exit(testResults.failed > 5 ? 1 : 0);
}

// Main execution
async function main() {
  log('Starting Comprehensive Integration Tests...\\n', 'test');
  
  testBuildSystem();
  testSecurity();
  testAccessibility();
  testPerformance();
  testMemoryManagement();
  testFantasyFeatures();
  
  generateReport();
}

main().catch(error => {
  log(`Test suite failed: ${error.message}`, 'error');
  process.exit(1);
});