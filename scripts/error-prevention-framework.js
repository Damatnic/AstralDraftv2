/**
 * 🛡️ ZERO-ERROR PREVENTION FRAMEWORK
 * Comprehensive error detection and prevention system for Astral Draft
 * 
 * This framework implements automated checks to maintain zero-error production environment
 */

const fs = require('fs');
const path = require('path');

class ErrorPreventionFramework {
  constructor() {
    this.config = {
      sourceDir: process.cwd(),
      excludePatterns: [
        'node_modules/**',
        'dist/**',
        '**/*.test.*',
        '**/*.spec.*',
        'coverage/**',
        '.git/**'
      ],
      criticalErrorPatterns: [
        // Console logging in production
        /console\.(log|warn|debug|info)\s*\(/g,
        // Unsafe eval and inline scripts
        /eval\s*\(/g,
        /Function\s*\(/g,
        /new\s+Function/g,
        // Unhandled promises
        /new\s+Promise\s*\([^)]*\)\s*(?!\.(?:then|catch|finally))/g,
        // Missing error boundaries
        /useEffect\s*\([^,]*,\s*\[\]\s*\)/g,
        // Potential memory leaks
        /setInterval\s*\([^)]*\)\s*(?!.*clearInterval)/g,
        /setTimeout\s*\([^)]*\)\s*(?!.*clearTimeout)/g,
        /addEventListener\s*\([^)]*\)\s*(?!.*removeEventListener)/g,
        // Missing dependency arrays
        /useEffect\s*\([^,]*\)\s*(?!,)/g,
        // Unsafe CSP directives
        /'unsafe-inline'/g,
        /'unsafe-eval'/g
      ],
      warningPatterns: [
        // TODO comments in production
        /TODO|FIXME|HACK|XXX/gi,
        // Missing error handling
        /fetch\s*\([^)]*\)\s*(?!\.(?:then|catch))/g,
        /axios\.[a-z]+\s*\([^)]*\)\s*(?!\.(?:then|catch))/g,
        // Missing key props in React
        /\.map\s*\([^)]*\)\s*(?!.*key=)/g
      ]
    };
    
    this.results = {
      critical: [],
      warnings: [],
      passed: [],
      summary: {}
    };
  }

  async run() {
    console.log('🚀 Starting Zero-Error Prevention Framework...\n');
    
    // Run all checks
    await this.scanSourceFiles();
    await this.checkBuildConfiguration();
    await this.validateServiceWorkers();
    await this.checkSecurityPolicies();
    await this.validateErrorBoundaries();
    await this.checkMemoryLeakPrevention();
    await this.validateWebSocketHandling();
    await this.checkThirdPartyIntegrations();
    
    // Generate comprehensive report
    this.generateReport();
    
    return this.results;
  }

  async scanSourceFiles() {
    console.log('📁 Scanning source files for error patterns...');
    
    const files = await this.getSourceFiles();
    let criticalIssues = 0;
    let warnings = 0;

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      const relativePath = path.relative(this.config.sourceDir, file);
      
      // Check critical patterns
      for (const pattern of this.config.criticalErrorPatterns) {
        const matches = [...content.matchAll(new RegExp(pattern.source, pattern.flags || 'g'))];
        for (const match of matches) {
          const lineNumber = content.substring(0, match.index).split('\n').length;
          this.results.critical.push({
            type: 'Critical Error Pattern',
            file: relativePath,
            line: lineNumber,
            pattern: pattern.source,
            match: match[0],
            severity: 'critical'
          });
          criticalIssues++;
        }
      }
      
      // Check warning patterns
      for (const pattern of this.config.warningPatterns) {
        const matches = [...content.matchAll(new RegExp(pattern.source, pattern.flags || 'g'))];
        for (const match of matches) {
          const lineNumber = content.substring(0, match.index).split('\n').length;
          this.results.warnings.push({
            type: 'Warning Pattern',
            file: relativePath,
            line: lineNumber,
            pattern: pattern.source,
            match: match[0],
            severity: 'warning'
          });
          warnings++;
        }
      }
    }

    console.log(`   ✓ Scanned ${files.length} files`);
    console.log(`   🔴 Found ${criticalIssues} critical issues`);
    console.log(`   🟡 Found ${warnings} warnings\n`);
  }

  async checkBuildConfiguration() {
    console.log('⚙️ Checking build configuration...');
    
    const checks = [
      {
        name: 'Vite Configuration',
        path: 'vite.config.ts',
        validator: (content) => {
          return {
            hasSourceMaps: content.includes('sourcemap'),
            hasErrorOverlay: content.includes('errorOverlay'),
            hasMinification: content.includes('minify'),
            hasTreeShaking: !content.includes('treeshake: false')
          };
        }
      },
      {
        name: 'TypeScript Configuration',
        path: 'tsconfig.json',
        validator: (content) => {
          const config = JSON.parse(content);
          return {
            hasStrictMode: config.compilerOptions?.strict === true,
            hasNoImplicitAny: config.compilerOptions?.noImplicitAny !== false,
            hasSourceMap: config.compilerOptions?.sourceMap === true
          };
        }
      }
    ];

    for (const check of checks) {
      const filePath = path.join(this.config.sourceDir, check.path);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const result = check.validator(content);
        
        const issues = Object.entries(result).filter(([_, value]) => !value);
        if (issues.length > 0) {
          this.results.warnings.push({
            type: 'Build Configuration',
            file: check.path,
            issues: issues.map(([key]) => key),
            severity: 'warning'
          });
        } else {
          this.results.passed.push({
            type: 'Build Configuration',
            check: check.name,
            status: 'passed'
          });
        }
      } else {
        this.results.critical.push({
          type: 'Missing Configuration',
          file: check.path,
          severity: 'critical'
        });
      }
    }
    
    console.log('   ✓ Build configuration checked\n');
  }

  async validateServiceWorkers() {
    console.log('🔧 Validating service workers...');
    
    const swFiles = ['public/sw.js', 'sw.js', 'dist/sw.js'];
    let validSW = false;

    for (const swFile of swFiles) {
      const filePath = path.join(this.config.sourceDir, swFile);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        
        const checks = {
          hasErrorHandling: /catch\s*\(/g.test(content),
          hasInstallHandler: /addEventListener\s*\(\s*['"]install['"]/.test(content),
          hasActivateHandler: /addEventListener\s*\(\s*['"]activate['"]/.test(content),
          hasFetchHandler: /addEventListener\s*\(\s*['"]fetch['"]/.test(content),
          hasConsoleLogging: /console\.(log|warn|error)/.test(content)
        };

        if (checks.hasConsoleLogging) {
          this.results.warnings.push({
            type: 'Service Worker Console Logging',
            file: swFile,
            severity: 'warning'
          });
        }

        if (checks.hasErrorHandling && checks.hasInstallHandler) {
          validSW = true;
          this.results.passed.push({
            type: 'Service Worker Validation',
            file: swFile,
            status: 'passed'
          });
        }
        break;
      }
    }

    if (!validSW) {
      this.results.critical.push({
        type: 'Service Worker Missing',
        severity: 'critical'
      });
    }
    
    console.log('   ✓ Service worker validation completed\n');
  }

  async checkSecurityPolicies() {
    console.log('🔒 Checking security policies...');
    
    const indexHtmlPath = path.join(this.config.sourceDir, 'index.html');
    if (fs.existsSync(indexHtmlPath)) {
      const content = fs.readFileSync(indexHtmlPath, 'utf-8');
      
      const hasCSP = /Content-Security-Policy/.test(content);
      const hasUnsafeInline = /'unsafe-inline'/.test(content);
      const hasUnsafeEval = /'unsafe-eval'/.test(content);
      
      if (!hasCSP) {
        this.results.critical.push({
          type: 'Missing CSP',
          file: 'index.html',
          severity: 'critical'
        });
      } else if (hasUnsafeInline || hasUnsafeEval) {
        this.results.critical.push({
          type: 'Unsafe CSP Directives',
          file: 'index.html',
          details: { hasUnsafeInline, hasUnsafeEval },
          severity: 'critical'
        });
      } else {
        this.results.passed.push({
          type: 'Security Policy',
          check: 'CSP Validation',
          status: 'passed'
        });
      }
    }
    
    console.log('   ✓ Security policies checked\n');
  }

  async validateErrorBoundaries() {
    console.log('🛡️ Validating error boundaries...');
    
    const files = await this.getSourceFiles(['**/*.tsx']);
    let hasErrorBoundary = false;
    let componentsWithoutBoundaries = [];

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      const relativePath = path.relative(this.config.sourceDir, file);
      
      if (/class.*extends.*Component/.test(content) && /componentDidCatch/.test(content)) {
        hasErrorBoundary = true;
      }

      // Check for components that should have error boundaries
      if (/export.*function.*[A-Z]/.test(content) || /export.*const.*[A-Z].*=/.test(content)) {
        if (!/ErrorBoundary|withErrorBoundary/.test(content)) {
          componentsWithoutBoundaries.push(relativePath);
        }
      }
    }

    if (!hasErrorBoundary) {
      this.results.critical.push({
        type: 'No Error Boundary Found',
        severity: 'critical'
      });
    }

    if (componentsWithoutBoundaries.length > 5) { // Too many components without boundaries
      this.results.warnings.push({
        type: 'Components Without Error Boundaries',
        count: componentsWithoutBoundaries.length,
        severity: 'warning'
      });
    }
    
    console.log('   ✓ Error boundaries validated\n');
  }

  async checkMemoryLeakPrevention() {
    console.log('🧠 Checking memory leak prevention...');
    
    const files = await this.getSourceFiles(['**/*.ts', '**/*.tsx']);
    let memoryLeakRisks = 0;

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      const relativePath = path.relative(this.config.sourceDir, file);
      
      // Check for useEffect cleanup
      const useEffectMatches = [...content.matchAll(/useEffect\s*\([^}]*}/gs)];
      for (const match of useEffectMatches) {
        const effectContent = match[0];
        const hasCleanup = /return\s*\(\s*\)\s*=>\s*{|return\s*function/.test(effectContent);
        const hasAsyncOperation = /setTimeout|setInterval|addEventListener|subscribe/.test(effectContent);
        
        if (hasAsyncOperation && !hasCleanup) {
          this.results.warnings.push({
            type: 'Potential Memory Leak',
            file: relativePath,
            issue: 'useEffect with async operation without cleanup',
            severity: 'warning'
          });
          memoryLeakRisks++;
        }
      }
    }

    console.log(`   ✓ Found ${memoryLeakRisks} potential memory leak risks\n`);
  }

  async validateWebSocketHandling() {
    console.log('🔌 Validating WebSocket handling...');
    
    const files = await this.getSourceFiles(['**/services/**/*.ts']);
    let wsHandlingIssues = 0;

    for (const file of files) {
      if (file.toLowerCase().includes('websocket') || file.toLowerCase().includes('socket')) {
        const content = fs.readFileSync(file, 'utf-8');
        const relativePath = path.relative(this.config.sourceDir, file);
        
        const checks = {
          hasErrorHandling: /catch|\.on\s*\(\s*['"]error['"]/.test(content),
          hasReconnection: /reconnect|retry/.test(content),
          hasCleanup: /disconnect|close/.test(content),
          hasTimeout: /timeout/.test(content)
        };

        const failedChecks = Object.entries(checks).filter(([_, passed]) => !passed);
        if (failedChecks.length > 0) {
          this.results.warnings.push({
            type: 'WebSocket Handling Issues',
            file: relativePath,
            failedChecks: failedChecks.map(([check]) => check),
            severity: 'warning'
          });
          wsHandlingIssues++;
        }
      }
    }

    console.log(`   ✓ Found ${wsHandlingIssues} WebSocket handling issues\n`);
  }

  async checkThirdPartyIntegrations() {
    console.log('🔗 Checking third-party integrations...');
    
    const packageJsonPath = path.join(this.config.sourceDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      // Check for potentially problematic packages
      const riskyPackages = Object.keys(dependencies).filter(pkg => {
        return pkg.includes('eval') || 
               pkg.includes('unsafe') || 
               dependencies[pkg].includes('beta') ||
               dependencies[pkg].includes('alpha');
      });

      if (riskyPackages.length > 0) {
        this.results.warnings.push({
          type: 'Risky Package Dependencies',
          packages: riskyPackages,
          severity: 'warning'
        });
      }
    }
    
    console.log('   ✓ Third-party integrations checked\n');
  }

  async getSourceFiles(patterns = ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx']) {
    const glob = require('glob');
    const files = [];
    
    for (const pattern of patterns) {
      const matches = glob.sync(pattern, {
        cwd: this.config.sourceDir,
        ignore: this.config.excludePatterns,
        absolute: true
      });
      files.push(...matches);
    }
    
    return [...new Set(files)]; // Remove duplicates
  }

  generateReport() {
    console.log('📊 ZERO-ERROR PREVENTION FRAMEWORK REPORT');
    console.log('=' .repeat(60));
    
    const criticalCount = this.results.critical.length;
    const warningCount = this.results.warnings.length;
    const passedCount = this.results.passed.length;
    
    console.log(`\n🔴 CRITICAL ISSUES: ${criticalCount}`);
    if (criticalCount > 0) {
      this.results.critical.forEach((issue, index) => {
        console.log(`\n${index + 1}. ${issue.type}`);
        if (issue.file) console.log(`   File: ${issue.file}`);
        if (issue.line) console.log(`   Line: ${issue.line}`);
        if (issue.match) console.log(`   Match: ${issue.match}`);
        if (issue.details) console.log(`   Details:`, issue.details);
      });
    }
    
    console.log(`\n🟡 WARNINGS: ${warningCount}`);
    if (warningCount > 0) {
      this.results.warnings.forEach((warning, index) => {
        console.log(`\n${index + 1}. ${warning.type}`);
        if (warning.file) console.log(`   File: ${warning.file}`);
        if (warning.count) console.log(`   Count: ${warning.count}`);
      });
    }
    
    console.log(`\n✅ PASSED CHECKS: ${passedCount}`);
    this.results.passed.forEach((check) => {
      console.log(`   ✓ ${check.type}: ${check.check || check.file}`);
    });
    
    // Overall assessment
    const score = Math.max(0, 100 - (criticalCount * 10 + warningCount * 2));
    console.log('\n' + '='.repeat(60));
    console.log(`OVERALL SECURITY SCORE: ${score}/100`);
    
    if (criticalCount === 0 && warningCount === 0) {
      console.log('🎉 ZERO-ERROR STATUS: ACHIEVED!');
      console.log('✨ Your application meets all error prevention criteria.');
    } else if (criticalCount === 0) {
      console.log('⚠️  ZERO-ERROR STATUS: NEARLY ACHIEVED');
      console.log('🔧 Address warnings to reach perfect zero-error status.');
    } else {
      console.log('🚨 ZERO-ERROR STATUS: NOT ACHIEVED');
      console.log('❌ Critical issues must be resolved immediately.');
    }
    
    console.log('\n' + '='.repeat(60));
    
    // Save detailed report
    const reportPath = path.join(this.config.sourceDir, 'error-prevention-report.json');
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      score,
      status: criticalCount === 0 && warningCount === 0 ? 'ACHIEVED' : 
              criticalCount === 0 ? 'NEARLY_ACHIEVED' : 'NOT_ACHIEVED',
      summary: { criticalCount, warningCount, passedCount },
      details: this.results
    }, null, 2));
    
    console.log(`📄 Detailed report saved to: ${reportPath}`);
    
    return { score, criticalCount, warningCount, passedCount };
  }
}

// CLI interface
if (require.main === module) {
  const framework = new ErrorPreventionFramework();
  
  framework.run()
    .then((results) => {
      const { criticalCount, warningCount } = framework.generateReport();
      process.exit(criticalCount > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error('❌ Error Prevention Framework failed:', error);
      process.exit(1);
    });
}

module.exports = ErrorPreventionFramework;