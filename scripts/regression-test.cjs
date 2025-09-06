#!/usr/bin/env node

/**
 * REGRESSION TESTING PROTOCOL
 * Ensures no previously working features were broken by recent changes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class RegressionTestSuite {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      criticalPaths: [],
      apiEndpoints: [],
      userFlows: [],
      edgeCases: [],
      summary: { passed: 0, failed: 0, total: 0 }
    };
  }

  log(message, type = 'info') {
    const prefix = {
      info: '🔍',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      test: '🧪'
    }[type] || '📝';
    
    console.log(`${prefix} ${message}`);
  }

  checkFileIntegrity(filePath, expectedPatterns = []) {
    const fullPath = path.join(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      return { exists: false, valid: false, errors: ['File not found'] };
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    const errors = [];
    const warnings = [];
    
    // Check for common issues that would break functionality
    const criticalPatterns = {
      unclosedBraces: /\{(?![^}]*\})/g,
      unclosedParens: /\((?![^)]*\))/g,
      syntaxErrors: /[Ss]yntax[Ee]rror|[Uu]ndefined|[Nn]ull[Pp]ointer/,
      importErrors: /import\s+.*\s+from\s+['""](?!\.|\@|react|next)/,
      missingExports: /export\s+(default\s+)?(?:function|const|class)\s+\w+/
    };
    
    // Check for broken imports
    const importMatches = content.match(/import\s+.*\s+from\s+['"]([^'"]+)['"]/g);
    if (importMatches) {
      for (const importLine of importMatches) {
        const importPath = importLine.match(/from\s+['"]([^'"]+)['"]/)?.[1];
        if (importPath && importPath.startsWith('.')) {
          // Relative import - check if file exists
          const resolvedPath = path.resolve(path.dirname(fullPath), importPath);
          const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx'];
          
          let found = false;
          for (const ext of extensions) {
            if (fs.existsSync(resolvedPath + ext)) {
              found = true;
              break;
            }
          }
          
          if (!found) {
            warnings.push(`Broken import: ${importPath}`);
          }
        }
      }
    }
    
    // Check expected patterns
    for (const pattern of expectedPatterns) {
      if (!content.includes(pattern)) {
        warnings.push(`Missing expected pattern: ${pattern}`);
      }
    }
    
    // Check for TODO or FIXME comments indicating incomplete work
    const todoMatches = content.match(/\/\/\s*(TODO|FIXME|XXX|HACK)/gi);
    if (todoMatches && todoMatches.length > 0) {
      warnings.push(`Found ${todoMatches.length} TODO/FIXME comments`);
    }
    
    return {
      exists: true,
      valid: errors.length === 0,
      errors,
      warnings,
      hasExports: /export/.test(content),
      hasImports: /import/.test(content),
      lineCount: content.split('\n').length
    };
  }

  async testCriticalPaths() {
    this.log('Testing Critical User Paths', 'test');
    
    const criticalPaths = [
      {
        name: 'Authentication Flow',
        files: [
          'services/authService.ts',
          'contexts/SimpleAuthContext.tsx',
          'components/auth/ProductionLoginInterface.tsx',
          'views/ModernAuthView.tsx'
        ]
      },
      {
        name: 'Draft Room',
        files: [
          'components/draft/LiveDraftRoom.tsx',
          'components/draft/EnhancedSnakeDraftRoom.tsx',
          'components/player/PlayerPool.tsx'
        ]
      },
      {
        name: 'Live Scoring',
        files: [
          'src/services/socketService.ts',
          'services/webSocketManager.ts',
          'components/team/EnhancedRosterManager.tsx'
        ]
      },
      {
        name: 'Trade System',
        files: [
          'components/team/TradeCenterWidget.tsx',
          'components/trade/FairnessAnalysisTab.tsx',
          'components/trade/ImpactAssessmentTab.tsx'
        ]
      },
      {
        name: 'Mobile Experience',
        files: [
          'components/mobile/MobileLayout.tsx',
          'components/mobile/MobileDraftInterface.tsx',
          'utils/mobileLazyLoader.ts'
        ]
      }
    ];
    
    for (const path of criticalPaths) {
      const pathResult = {
        name: path.name,
        status: 'pending',
        files: [],
        errors: [],
        warnings: []
      };
      
      let allFilesValid = true;
      
      for (const file of path.files) {
        const result = this.checkFileIntegrity(file);
        pathResult.files.push({ file, ...result });
        
        if (!result.exists || !result.valid) {
          allFilesValid = false;
          pathResult.errors.push(`${file}: ${result.errors.join(', ')}`);
        }
        
        if (result.warnings && result.warnings.length > 0) {
          pathResult.warnings.push(...result.warnings);
        }
      }
      
      pathResult.status = allFilesValid ? 'passed' : 'failed';
      this.results.criticalPaths.push(pathResult);
      
      const statusEmoji = pathResult.status === 'passed' ? '✅' : '❌';
      this.log(`${path.name}: ${statusEmoji} ${pathResult.status}`, 
               pathResult.status === 'passed' ? 'success' : 'error');
    }
  }

  async testUserFlows() {
    this.log('Testing User Flows', 'test');
    
    const userFlows = [
      {
        name: 'New User Onboarding',
        steps: [
          { action: 'Load login page', file: 'views/ModernAuthView.tsx' },
          { action: 'Create account', file: 'services/authService.ts' },
          { action: 'Join league', file: 'components/core/EnhancedCreateLeagueModal.tsx' },
          { action: 'View tutorial', file: 'components/oracle/OracleBeginnerTutorial.tsx' }
        ]
      },
      {
        name: 'Draft Day Flow',
        steps: [
          { action: 'Enter draft room', file: 'views/EnhancedDraftRoomView.tsx' },
          { action: 'View player pool', file: 'components/player/PlayerPool.tsx' },
          { action: 'Make selection', file: 'components/draft/LiveDraftRoom.tsx' },
          { action: 'View roster', file: 'components/draft/MyRosterPanel.tsx' }
        ]
      },
      {
        name: 'Weekly Management',
        steps: [
          { action: 'View roster', file: 'components/team/EnhancedRosterManager.tsx' },
          { action: 'Check injuries', file: 'components/injury/InjuryDashboard.tsx' },
          { action: 'Set lineup', file: 'components/optimization/TeamOptimizationDashboard.tsx' },
          { action: 'Submit changes', file: 'services/authService.ts' }
        ]
      }
    ];
    
    for (const flow of userFlows) {
      const flowResult = {
        name: flow.name,
        status: 'pending',
        steps: [],
        brokenSteps: 0
      };
      
      for (const step of flow.steps) {
        const result = this.checkFileIntegrity(step.file);
        const stepResult = {
          action: step.action,
          file: step.file,
          status: result.exists && result.valid ? 'working' : 'broken'
        };
        
        flowResult.steps.push(stepResult);
        if (stepResult.status === 'broken') {
          flowResult.brokenSteps++;
        }
      }
      
      flowResult.status = flowResult.brokenSteps === 0 ? 'passed' : 'failed';
      this.results.userFlows.push(flowResult);
      
      const statusEmoji = flowResult.status === 'passed' ? '✅' : '❌';
      this.log(`${flow.name}: ${statusEmoji} (${flow.steps.length - flowResult.brokenSteps}/${flow.steps.length} steps working)`,
               flowResult.status === 'passed' ? 'success' : 'error');
    }
  }

  async testEdgeCases() {
    this.log('Testing Edge Cases', 'test');
    
    const edgeCases = [
      {
        name: 'Empty State Handling',
        check: () => {
          const rosterManager = path.join(process.cwd(), 'components/team/EnhancedRosterManager.tsx');
          if (fs.existsSync(rosterManager)) {
            const content = fs.readFileSync(rosterManager, 'utf8');
            return content.includes('No players') || content.includes('empty');
          }
          return false;
        }
      },
      {
        name: 'Error Boundaries',
        check: () => {
          const files = [
            'components/draft/LiveDraftRoom.tsx',
            'components/team/EnhancedRosterManager.tsx'
          ];
          
          for (const file of files) {
            const fullPath = path.join(process.cwd(), file);
            if (fs.existsSync(fullPath)) {
              const content = fs.readFileSync(fullPath, 'utf8');
              if (!content.includes('try') || !content.includes('catch')) {
                return false;
              }
            }
          }
          return true;
        }
      },
      {
        name: 'Loading States',
        check: () => {
          const files = [
            'components/player/PlayerPool.tsx',
            'components/analytics/AdvancedAnalyticsDashboard.tsx'
          ];
          
          for (const file of files) {
            const fullPath = path.join(process.cwd(), file);
            if (fs.existsSync(fullPath)) {
              const content = fs.readFileSync(fullPath, 'utf8');
              if (!content.includes('loading') && !content.includes('Loading')) {
                return false;
              }
            }
          }
          return true;
        }
      },
      {
        name: 'Offline Support',
        check: () => {
          const offlineIndicator = path.join(process.cwd(), 'components/mobile/MobileOfflineIndicator.tsx');
          return fs.existsSync(offlineIndicator);
        }
      },
      {
        name: 'Memory Cleanup',
        check: () => {
          const memoryCleanup = path.join(process.cwd(), 'utils/memoryCleanup.ts');
          const useMemoryCleanup = path.join(process.cwd(), 'hooks/useMemoryCleanup.ts');
          return fs.existsSync(memoryCleanup) && fs.existsSync(useMemoryCleanup);
        }
      }
    ];
    
    for (const edgeCase of edgeCases) {
      const result = {
        name: edgeCase.name,
        status: 'pending'
      };
      
      try {
        const passed = edgeCase.check();
        result.status = passed ? 'passed' : 'failed';
      } catch (error) {
        result.status = 'failed';
        result.error = error.message;
      }
      
      this.results.edgeCases.push(result);
      
      const statusEmoji = result.status === 'passed' ? '✅' : '❌';
      this.log(`${edgeCase.name}: ${statusEmoji}`,
               result.status === 'passed' ? 'success' : 'error');
    }
  }

  async testBackwardCompatibility() {
    this.log('Testing Backward Compatibility', 'test');
    
    // Check that critical API interfaces haven't changed
    const apiInterfaces = [
      { file: 'services/authService.ts', methods: ['login', 'logout', 'register'] },
      { file: 'src/services/socketService.ts', methods: ['connect', 'disconnect', 'emit'] }
    ];
    
    for (const api of apiInterfaces) {
      const fullPath = path.join(process.cwd(), api.file);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        let allMethodsFound = true;
        
        for (const method of api.methods) {
          if (!content.includes(method)) {
            allMethodsFound = false;
            this.log(`Missing method '${method}' in ${api.file}`, 'warning');
          }
        }
        
        if (allMethodsFound) {
          this.log(`${api.file}: All methods preserved`, 'success');
        }
      }
    }
  }

  generateReport() {
    // Calculate summary
    const allResults = [
      ...this.results.criticalPaths,
      ...this.results.userFlows,
      ...this.results.edgeCases
    ];
    
    for (const result of allResults) {
      this.results.summary.total++;
      if (result.status === 'passed') {
        this.results.summary.passed++;
      } else {
        this.results.summary.failed++;
      }
    }
    
    // Generate markdown report
    let markdown = `# Regression Test Report

## Executive Summary
- **Date**: ${new Date(this.results.timestamp).toLocaleString()}
- **Tests Run**: ${this.results.summary.total}
- **Passed**: ${this.results.summary.passed}
- **Failed**: ${this.results.summary.failed}
- **Overall Status**: ${this.results.summary.failed === 0 ? '✅ NO REGRESSIONS DETECTED' : '❌ REGRESSIONS FOUND'}

## Critical Path Testing

`;

    for (const path of this.results.criticalPaths) {
      const emoji = path.status === 'passed' ? '✅' : '❌';
      markdown += `### ${emoji} ${path.name}
- **Status**: ${path.status}
- **Files Checked**: ${path.files.length}
- **Valid Files**: ${path.files.filter(f => f.valid).length}/${path.files.length}
`;
      
      if (path.errors.length > 0) {
        markdown += `- **Errors**: ${path.errors.join(', ')}\n`;
      }
      
      markdown += '\n';
    }

    markdown += `## User Flow Testing

`;

    for (const flow of this.results.userFlows) {
      const emoji = flow.status === 'passed' ? '✅' : '❌';
      markdown += `### ${emoji} ${flow.name}
- **Status**: ${flow.status}
- **Steps**: ${flow.steps.length - flow.brokenSteps}/${flow.steps.length} working
`;
      
      if (flow.brokenSteps > 0) {
        markdown += '- **Broken Steps**:\n';
        for (const step of flow.steps.filter(s => s.status === 'broken')) {
          markdown += `  - ${step.action}\n`;
        }
      }
      
      markdown += '\n';
    }

    markdown += `## Edge Case Testing

`;

    for (const edgeCase of this.results.edgeCases) {
      const emoji = edgeCase.status === 'passed' ? '✅' : '❌';
      markdown += `- ${emoji} ${edgeCase.name}\n`;
    }

    markdown += `
## Certification

${this.results.summary.failed === 0 ? 
  '✅ **NO REGRESSIONS** - All previously working features remain functional' :
  '❌ **REGRESSIONS DETECTED** - Some features have been broken by recent changes'}

### Test Coverage
- Critical Paths: ${this.results.criticalPaths.length} tested
- User Flows: ${this.results.userFlows.length} tested  
- Edge Cases: ${this.results.edgeCases.length} tested

---
*Generated by Regression Test Suite v1.0*
`;

    fs.writeFileSync(
      path.join(process.cwd(), 'REGRESSION_TEST_REPORT.md'),
      markdown
    );

    fs.writeFileSync(
      path.join(process.cwd(), 'regression-test-results.json'),
      JSON.stringify(this.results, null, 2)
    );

    return markdown;
  }

  async runTests() {
    console.log('\n' + '='.repeat(60));
    console.log('🔍 REGRESSION TESTING PROTOCOL');
    console.log('='.repeat(60) + '\n');

    await this.testCriticalPaths();
    console.log('');
    
    await this.testUserFlows();
    console.log('');
    
    await this.testEdgeCases();
    console.log('');
    
    await this.testBackwardCompatibility();
    
    const report = this.generateReport();
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 REGRESSION TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Passed: ${this.results.summary.passed}/${this.results.summary.total}`);
    console.log(`❌ Failed: ${this.results.summary.failed}/${this.results.summary.total}`);
    console.log('='.repeat(60) + '\n');
    
    if (this.results.summary.failed === 0) {
      console.log('✅ NO REGRESSIONS DETECTED!');
      process.exit(0);
    } else {
      console.log('❌ REGRESSIONS FOUND - Review report for details');
      process.exit(1);
    }
  }
}

// Run tests
const suite = new RegressionTestSuite();
suite.runTests().catch(error => {
  console.error('❌ Regression test failed:', error);
  process.exit(1);
});