/**
 * ASTRAL DRAFT - Comprehensive Extension Function Audit Tool
 * Purpose: Systematic analysis and validation of all extension functions, buttons, and tools
 * Author: Lead Platform Architect
 * Date: 2025-08-30
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ExtensionFunctionAuditor {
  constructor() {
    this.auditResults = {
      totalFiles: 0,
      totalComponents: 0,
      totalFunctions: 0,
      totalButtons: 0,
      totalModals: 0,
      totalServices: 0,
      totalHooks: 0,
      issues: [],
      enhancements: [],
      criticalFindings: [],
      performanceMetrics: {},
      mobileCompatibility: {},
      accessibilityIssues: [],
      timestamp: new Date().toISOString()
    };

    this.functionPatterns = {
      eventHandlers: /\b(onClick|onPress|onSubmit|onChange|onBlur|onFocus|onKeyDown|onKeyUp|onMouseEnter|onMouseLeave|onTouchStart|onTouchEnd)\s*[=:]/g,
      customHandlers: /\bhandle[A-Z]\w*\b/g,
      dispatchers: /dispatch\s*\(\s*\{[^}]*type\s*:/g,
      hooks: /\buse[A-Z]\w*\b/g,
      services: /\w+Service\.\w+/g,
      apiCalls: /\b(fetch|axios|api\.\w+)/g,
      websockets: /\b(socket|ws|websocket)\.\w+/g,
      stateUpdates: /\bset[A-Z]\w*\s*\(/g,
      modalTriggers: /\b(openModal|closeModal|showModal|hideModal)\s*\(/g,
      navigation: /\b(navigate|push|replace|goBack)\s*\(/g
    };

    this.componentTypes = {
      views: [],
      components: [],
      modals: [],
      services: [],
      hooks: [],
      utils: []
    };

    this.criticalAreas = [
      'authentication',
      'payment',
      'draft',
      'trade',
      'scoring',
      'realtime',
      'websocket',
      'notification'
    ];
  }

  async runComprehensiveAudit() {
    console.log('🚀 STARTING COMPREHENSIVE EXTENSION FUNCTION AUDIT');
    console.log('=' .repeat(80));

    try {
      // Phase 1: File Discovery
      await this.discoverAllFiles();
      
      // Phase 2: Component Analysis
      await this.analyzeComponents();
      
      // Phase 3: Function Mapping
      await this.mapAllFunctions();
      
      // Phase 4: Button & Interaction Analysis
      await this.analyzeInteractions();
      
      // Phase 5: Service Integration Check
      await this.checkServiceIntegrations();
      
      // Phase 6: Mobile Compatibility Assessment
      await this.assessMobileCompatibility();
      
      // Phase 7: Accessibility Validation
      await this.validateAccessibility();
      
      // Phase 8: Performance Analysis
      await this.analyzePerformance();
      
      // Phase 9: Error Handling Review
      await this.reviewErrorHandling();
      
      // Phase 10: Generate Recommendations
      await this.generateRecommendations();
      
      // Generate final report
      this.generateAuditReport();
      
    } catch (error) {
      console.error('❌ AUDIT FAILED:', error);
      this.auditResults.criticalFindings.push({
        severity: 'CRITICAL',
        message: `Audit process failed: ${error.message}`
      });
    }
  }

  async discoverAllFiles() {
    console.log('\\n📁 Phase 1: Discovering all files...');
    
    const directories = [
      'components',
      'views',
      'services',
      'hooks',
      'utils',
      'contexts'
    ];

    for (const dir of directories) {
      const dirPath = path.join(process.cwd(), dir);
      if (fs.existsSync(dirPath)) {
        await this.scanDirectory(dirPath, dir);
      }
    }

    console.log(`  ✅ Found ${this.auditResults.totalFiles} files`);
  }

  async scanDirectory(dirPath, category) {
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        await this.scanDirectory(filePath, category);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        this.auditResults.totalFiles++;
        this.componentTypes[category === 'views' ? 'views' : 
                          category === 'components' ? 'components' :
                          category === 'services' ? 'services' :
                          category === 'hooks' ? 'hooks' : 'utils'].push(filePath);
      }
    }
  }

  async analyzeComponents() {
    console.log('\\n🔍 Phase 2: Analyzing components...');
    
    for (const componentFile of this.componentTypes.components) {
      const content = fs.readFileSync(componentFile, 'utf-8');
      
      // Check for proper TypeScript typing
      if (!content.includes(': React.FC') && !content.includes('React.FunctionComponent')) {
        this.auditResults.issues.push({
          file: componentFile,
          type: 'TYPING',
          message: 'Component may lack proper TypeScript typing'
        });
      }
      
      // Check for error boundaries
      if (componentFile.includes('View') && !content.includes('ErrorBoundary')) {
        this.auditResults.enhancements.push({
          file: componentFile,
          type: 'ERROR_HANDLING',
          message: 'View component should be wrapped in ErrorBoundary'
        });
      }
      
      this.auditResults.totalComponents++;
    }
    
    console.log(`  ✅ Analyzed ${this.auditResults.totalComponents} components`);
  }

  async mapAllFunctions() {
    console.log('\\n🗺️ Phase 3: Mapping all functions...');
    
    const allFiles = [
      ...this.componentTypes.views,
      ...this.componentTypes.components
    ];
    
    for (const file of allFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      
      // Count event handlers
      const eventHandlers = content.match(this.functionPatterns.eventHandlers) || [];
      const customHandlers = content.match(this.functionPatterns.customHandlers) || [];
      const dispatchers = content.match(this.functionPatterns.dispatchers) || [];
      
      this.auditResults.totalFunctions += eventHandlers.length + customHandlers.length + dispatchers.length;
      
      // Check for unhandled async operations
      if (content.includes('async') && !content.includes('try') && !content.includes('catch')) {
        this.auditResults.issues.push({
          file,
          type: 'ASYNC_ERROR_HANDLING',
          message: 'Async operations without proper error handling'
        });
      }
    }
    
    console.log(`  ✅ Mapped ${this.auditResults.totalFunctions} functions`);
  }

  async analyzeInteractions() {
    console.log('\\n🖱️ Phase 4: Analyzing buttons and interactions...');
    
    for (const file of this.componentTypes.components) {
      const content = fs.readFileSync(file, 'utf-8');
      
      // Count buttons
      const buttons = content.match(/<(Button|button)/g) || [];
      this.auditResults.totalButtons += buttons.length;
      
      // Check for proper ARIA labels
      buttons.forEach(() => {
        if (!content.includes('aria-label') && !content.includes('aria-labelledby')) {
          this.auditResults.accessibilityIssues.push({
            file,
            type: 'MISSING_ARIA',
            message: 'Button without proper ARIA label'
          });
        }
      });
      
      // Count modals
      const modals = content.match(/<Modal/g) || [];
      this.auditResults.totalModals += modals.length;
    }
    
    console.log(`  ✅ Found ${this.auditResults.totalButtons} buttons, ${this.auditResults.totalModals} modals`);
  }

  async checkServiceIntegrations() {
    console.log('\\n🔌 Phase 5: Checking service integrations...');
    
    for (const file of this.componentTypes.services) {
      const content = fs.readFileSync(file, 'utf-8');
      this.auditResults.totalServices++;
      
      // Check for proper error handling in services
      if (content.includes('fetch') || content.includes('axios')) {
        if (!content.includes('.catch') && !content.includes('try')) {
          this.auditResults.issues.push({
            file,
            type: 'SERVICE_ERROR_HANDLING',
            message: 'Service lacks proper error handling for API calls'
          });
        }
      }
      
      // Check for WebSocket handling
      if (content.includes('WebSocket') || content.includes('socket.io')) {
        if (!content.includes('reconnect') && !content.includes('error')) {
          this.auditResults.enhancements.push({
            file,
            type: 'WEBSOCKET_RESILIENCE',
            message: 'WebSocket service should include reconnection logic'
          });
        }
      }
    }
    
    console.log(`  ✅ Checked ${this.auditResults.totalServices} services`);
  }

  async assessMobileCompatibility() {
    console.log('\\n📱 Phase 6: Assessing mobile compatibility...');
    
    const mobileIssues = [];
    
    for (const file of this.componentTypes.components) {
      const content = fs.readFileSync(file, 'utf-8');
      
      // Check for touch events
      if (content.includes('onClick') && !content.includes('onTouchStart')) {
        mobileIssues.push({
          file,
          type: 'TOUCH_SUPPORT',
          message: 'Component with onClick should also support touch events'
        });
      }
      
      // Check for responsive design
      if (!content.includes('sm:') && !content.includes('md:') && !content.includes('lg:')) {
        mobileIssues.push({
          file,
          type: 'RESPONSIVE_DESIGN',
          message: 'Component may lack responsive design classes'
        });
      }
    }
    
    this.auditResults.mobileCompatibility = {
      totalIssues: mobileIssues.length,
      issues: mobileIssues
    };
    
    console.log(`  ✅ Found ${mobileIssues.length} mobile compatibility issues`);
  }

  async validateAccessibility() {
    console.log('\\n♿ Phase 7: Validating accessibility...');
    
    for (const file of this.componentTypes.components) {
      const content = fs.readFileSync(file, 'utf-8');
      
      // Check for semantic HTML
      if (content.includes('<div onClick') || content.includes('<span onClick')) {
        this.auditResults.accessibilityIssues.push({
          file,
          type: 'SEMANTIC_HTML',
          message: 'Non-semantic element with click handler - use button instead'
        });
      }
      
      // Check for keyboard navigation
      if (content.includes('onClick') && !content.includes('onKeyDown')) {
        this.auditResults.accessibilityIssues.push({
          file,
          type: 'KEYBOARD_NAV',
          message: 'Interactive element lacks keyboard support'
        });
      }
    }
    
    console.log(`  ✅ Found ${this.auditResults.accessibilityIssues.length} accessibility issues`);
  }

  async analyzePerformance() {
    console.log('\\n⚡ Phase 8: Analyzing performance...');
    
    const performanceIssues = [];
    
    for (const file of [...this.componentTypes.components, ...this.componentTypes.views]) {
      const content = fs.readFileSync(file, 'utf-8');
      
      // Check for React.memo usage
      if (content.includes('export default') && !content.includes('React.memo')) {
        performanceIssues.push({
          file,
          type: 'MEMOIZATION',
          message: 'Component could benefit from React.memo'
        });
      }
      
      // Check for useCallback/useMemo
      if (content.includes('useEffect') && !content.includes('useCallback') && !content.includes('useMemo')) {
        performanceIssues.push({
          file,
          type: 'OPTIMIZATION',
          message: 'Component with effects might benefit from useCallback/useMemo'
        });
      }
    }
    
    this.auditResults.performanceMetrics = {
      totalIssues: performanceIssues.length,
      issues: performanceIssues
    };
    
    console.log(`  ✅ Found ${performanceIssues.length} performance optimization opportunities`);
  }

  async reviewErrorHandling() {
    console.log('\\n🛡️ Phase 9: Reviewing error handling...');
    
    for (const area of this.criticalAreas) {
      const relevantFiles = [...this.componentTypes.components, ...this.componentTypes.services]
        .filter(f => f.toLowerCase().includes(area));
      
      for (const file of relevantFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        
        if (!content.includes('try') && !content.includes('catch') && !content.includes('ErrorBoundary')) {
          this.auditResults.criticalFindings.push({
            severity: 'HIGH',
            file,
            area,
            message: `Critical area '${area}' lacks proper error handling`
          });
        }
      }
    }
    
    console.log(`  ✅ Reviewed error handling for ${this.criticalAreas.length} critical areas`);
  }

  async generateRecommendations() {
    console.log('\\n💡 Phase 10: Generating recommendations...');
    
    // Priority 1: Critical Fixes
    if (this.auditResults.criticalFindings.length > 0) {
      console.log('\\n  🚨 CRITICAL FIXES REQUIRED:');
      this.auditResults.criticalFindings.forEach(finding => {
        console.log(`    - ${finding.message} (${finding.file || finding.area})`);
      });
    }
    
    // Priority 2: Accessibility
    if (this.auditResults.accessibilityIssues.length > 10) {
      console.log('\\n  ♿ ACCESSIBILITY IMPROVEMENTS NEEDED');
    }
    
    // Priority 3: Mobile
    if (this.auditResults.mobileCompatibility.totalIssues > 5) {
      console.log('\\n  📱 MOBILE EXPERIENCE ENHANCEMENTS RECOMMENDED');
    }
    
    // Priority 4: Performance
    if (this.auditResults.performanceMetrics.totalIssues > 10) {
      console.log('\\n  ⚡ PERFORMANCE OPTIMIZATIONS AVAILABLE');
    }
  }

  generateAuditReport() {
    console.log('\\n' + '='.repeat(80));
    console.log('📊 COMPREHENSIVE AUDIT REPORT');
    console.log('='.repeat(80));
    
    console.log('\\n📈 STATISTICS:');
    console.log(`  Total Files Analyzed: ${this.auditResults.totalFiles}`);
    console.log(`  Total Components: ${this.auditResults.totalComponents}`);
    console.log(`  Total Functions: ${this.auditResults.totalFunctions}`);
    console.log(`  Total Buttons: ${this.auditResults.totalButtons}`);
    console.log(`  Total Modals: ${this.auditResults.totalModals}`);
    console.log(`  Total Services: ${this.auditResults.totalServices}`);
    
    console.log('\\n⚠️ ISSUES SUMMARY:');
    console.log(`  Critical Findings: ${this.auditResults.criticalFindings.length}`);
    console.log(`  General Issues: ${this.auditResults.issues.length}`);
    console.log(`  Accessibility Issues: ${this.auditResults.accessibilityIssues.length}`);
    console.log(`  Mobile Issues: ${this.auditResults.mobileCompatibility.totalIssues || 0}`);
    console.log(`  Performance Issues: ${this.auditResults.performanceMetrics.totalIssues || 0}`);
    
    console.log('\\n✨ ENHANCEMENT OPPORTUNITIES:');
    console.log(`  Total Enhancements Identified: ${this.auditResults.enhancements.length}`);
    
    // Write detailed report to file
    const reportPath = path.join(process.cwd(), 'EXTENSION_FUNCTION_AUDIT_REPORT.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.auditResults, null, 2));
    console.log(`\\n📄 Detailed report saved to: ${reportPath}`);
    
    console.log('\\n' + '='.repeat(80));
    console.log('✅ AUDIT COMPLETE');
    console.log('='.repeat(80));
    
    return this.auditResults;
  }
}

// Execute audit
const auditor = new ExtensionFunctionAuditor();
auditor.runComprehensiveAudit();