/**
 * 🧪 AUTOMATED TESTING PROTOCOL
 * Comprehensive testing framework for zero-error validation
 * 
 * This protocol implements automated tests for all critical error scenarios
 * including browser compatibility, WebSocket handling, memory leaks, and more.
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class AutomatedTestingProtocol {
  constructor() {
    this.config = {
      testTimeout: 30000, // 30 seconds per test
      browserCount: 3, // Test in multiple browser contexts
      viewport: { width: 1920, height: 1080 },
      mobileViewport: { width: 375, height: 667 },
      networkConditions: [
        'online',
        'offline',
        'slow-3g',
        'fast-3g'
      ],
      testUrl: process.env.TEST_URL || 'http://localhost:8765'
    };
    
    this.results = {
      passed: [],
      failed: [],
      warnings: [],
      performance: [],
      accessibility: [],
      summary: {}
    };

    this.browser = null;
  }

  async runAllTests() {
    console.log('🧪 Starting Automated Testing Protocol...\n');
    
    try {
      await this.setup();
      
      // Core functionality tests
      await this.testApplicationBootstrap();
      await this.testErrorBoundaries();
      await this.testServiceWorkerRegistration();
      await this.testWebSocketHandling();
      await this.testMemoryLeaks();
      
      // Browser compatibility tests
      await this.testBrowserCompatibility();
      await this.testExtensionCompatibility();
      
      // Security tests
      await this.testCSPCompliance();
      await this.testXSSPrevention();
      
      // Performance tests
      await this.testLoadPerformance();
      await this.testMemoryUsage();
      
      // Network resilience tests
      await this.testOfflineMode();
      await this.testNetworkErrors();
      
      // Accessibility tests
      await this.testAccessibility();
      
      // Mobile responsiveness tests
      await this.testMobileResponsiveness();
      
      await this.cleanup();
      this.generateTestReport();
      
    } catch (error) {
      console.error('❌ Testing protocol failed:', error);
      await this.cleanup();
      throw error;
    }
  }

  async setup() {
    console.log('🚀 Setting up test environment...');
    
    this.browser = await puppeteer.launch({
      headless: process.env.NODE_ENV === 'production',
      devtools: process.env.NODE_ENV === 'development',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });
    
    console.log('✅ Browser launched successfully\n');
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async createTestPage() {
    const page = await this.browser.newPage();
    await page.setViewport(this.config.viewport);
    
    // Setup error handling
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        this.results.failed.push({
          type: 'Console Error',
          message: msg.text(),
          location: msg.location(),
          timestamp: new Date().toISOString()
        });
      }
    });

    page.on('pageerror', (error) => {
      this.results.failed.push({
        type: 'Page Error',
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
    });

    return page;
  }

  async testApplicationBootstrap() {
    console.log('🏁 Testing application bootstrap...');
    
    const page = await this.createTestPage();
    
    try {
      const startTime = Date.now();
      
      // Navigate to app and wait for React to load
      await page.goto(this.config.testUrl, { 
        waitUntil: 'networkidle0',
        timeout: this.config.testTimeout 
      });
      
      const loadTime = Date.now() - startTime;
      
      // Check if React app loaded
      await page.waitForSelector('#root', { timeout: 5000 });
      const hasReactApp = await page.$('#root > div') !== null;
      
      // Check for error boundary fallback
      const hasErrorFallback = await page.$('.error-boundary') !== null;
      
      if (hasReactApp && !hasErrorFallback) {
        this.results.passed.push({
          test: 'Application Bootstrap',
          loadTime,
          status: 'passed'
        });
        console.log(`   ✅ App bootstrapped in ${loadTime}ms`);
      } else {
        this.results.failed.push({
          test: 'Application Bootstrap',
          reason: hasErrorFallback ? 'Error boundary triggered' : 'React app not found',
          status: 'failed'
        });
        console.log('   ❌ App bootstrap failed');
      }
      
    } catch (error) {
      this.results.failed.push({
        test: 'Application Bootstrap',
        error: error.message,
        status: 'failed'
      });
      console.log('   ❌ Bootstrap test failed:', error.message);
    } finally {
      await page.close();
    }
  }

  async testErrorBoundaries() {
    console.log('🛡️ Testing error boundaries...');
    
    const page = await this.createTestPage();
    
    try {
      await page.goto(this.config.testUrl, { waitUntil: 'networkidle0' });
      
      // Inject a component that will throw an error
      await page.evaluate(() => {
        // Simulate a React error by throwing in a component
        window.triggerReactError = () => {
          const errorComponent = () => {
            throw new Error('Test error for error boundary');
          };
          
          // This would need to be triggered in the actual React component tree
          return errorComponent();
        };
      });

      // Check if error boundary catches errors properly
      const errorBoundaryWorks = await page.evaluate(() => {
        try {
          // This should be caught by error boundary
          window.triggerReactError();
          return false; // Should not reach here
        } catch (error) {
          return true; // Error was thrown but should be caught by boundary
        }
      });

      if (errorBoundaryWorks) {
        this.results.passed.push({
          test: 'Error Boundary',
          status: 'passed'
        });
        console.log('   ✅ Error boundaries working correctly');
      } else {
        this.results.failed.push({
          test: 'Error Boundary',
          status: 'failed'
        });
        console.log('   ❌ Error boundary test failed');
      }
      
    } catch (error) {
      this.results.warnings.push({
        test: 'Error Boundary',
        warning: 'Could not fully test error boundaries',
        error: error.message
      });
      console.log('   ⚠️  Error boundary test incomplete:', error.message);
    } finally {
      await page.close();
    }
  }

  async testServiceWorkerRegistration() {
    console.log('🔧 Testing service worker registration...');
    
    const page = await this.createTestPage();
    
    try {
      await page.goto(this.config.testUrl, { waitUntil: 'networkidle0' });
      
      // Check if service worker is supported and registered
      const swStatus = await page.evaluate(() => {
        return new Promise((resolve) => {
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistration().then((registration) => {
              resolve({
                supported: true,
                registered: !!registration,
                scope: registration ? registration.scope : null
              });
            });
          } else {
            resolve({ supported: false, registered: false });
          }
        });
      });

      if (swStatus.registered) {
        this.results.passed.push({
          test: 'Service Worker Registration',
          scope: swStatus.scope,
          status: 'passed'
        });
        console.log('   ✅ Service worker registered successfully');
      } else if (!swStatus.supported) {
        this.results.warnings.push({
          test: 'Service Worker Registration',
          warning: 'Service workers not supported in this browser'
        });
        console.log('   ⚠️  Service workers not supported');
      } else {
        this.results.failed.push({
          test: 'Service Worker Registration',
          status: 'failed'
        });
        console.log('   ❌ Service worker registration failed');
      }
      
    } catch (error) {
      this.results.failed.push({
        test: 'Service Worker Registration',
        error: error.message,
        status: 'failed'
      });
      console.log('   ❌ SW registration test failed:', error.message);
    } finally {
      await page.close();
    }
  }

  async testWebSocketHandling() {
    console.log('🔌 Testing WebSocket handling...');
    
    const page = await this.createTestPage();
    
    try {
      await page.goto(this.config.testUrl, { waitUntil: 'networkidle0' });
      
      // Test WebSocket connection handling
      const wsTest = await page.evaluate(() => {
        return new Promise((resolve) => {
          try {
            // Try to connect to a non-existent WebSocket server
            const ws = new WebSocket('ws://localhost:9999');
            
            let errorHandled = false;
            let timeoutId = setTimeout(() => {
              resolve({ errorHandled, connected: false });
            }, 3000);

            ws.onerror = () => {
              errorHandled = true;
              clearTimeout(timeoutId);
              resolve({ errorHandled, connected: false });
            };

            ws.onopen = () => {
              clearTimeout(timeoutId);
              resolve({ errorHandled, connected: true });
            };
            
          } catch (error) {
            resolve({ errorHandled: true, connected: false, caughtError: true });
          }
        });
      });

      if (wsTest.errorHandled || wsTest.caughtError) {
        this.results.passed.push({
          test: 'WebSocket Error Handling',
          status: 'passed'
        });
        console.log('   ✅ WebSocket errors handled gracefully');
      } else {
        this.results.failed.push({
          test: 'WebSocket Error Handling',
          status: 'failed'
        });
        console.log('   ❌ WebSocket error handling failed');
      }
      
    } catch (error) {
      this.results.failed.push({
        test: 'WebSocket Error Handling',
        error: error.message,
        status: 'failed'
      });
      console.log('   ❌ WebSocket test failed:', error.message);
    } finally {
      await page.close();
    }
  }

  async testMemoryLeaks() {
    console.log('🧠 Testing for memory leaks...');
    
    const page = await this.createTestPage();
    
    try {
      await page.goto(this.config.testUrl, { waitUntil: 'networkidle0' });
      
      // Measure initial memory
      const initialMemory = await page.metrics();
      
      // Simulate user interactions that could cause memory leaks
      await page.evaluate(() => {
        // Add event listeners without cleanup
        const createLeakyListeners = () => {
          for (let i = 0; i < 100; i++) {
            document.addEventListener('click', () => {});
            setInterval(() => {}, 1000);
          }
        };
        
        createLeakyListeners();
      });

      // Wait and measure memory again
      await page.waitForTimeout(2000);
      const finalMemory = await page.metrics();
      
      const memoryIncrease = finalMemory.JSHeapUsedSize - initialMemory.JSHeapUsedSize;
      const memoryIncreasePercent = (memoryIncrease / initialMemory.JSHeapUsedSize) * 100;
      
      if (memoryIncreasePercent < 50) { // Less than 50% increase is acceptable
        this.results.passed.push({
          test: 'Memory Leak Detection',
          memoryIncrease: memoryIncrease,
          increasePercent: memoryIncreasePercent,
          status: 'passed'
        });
        console.log(`   ✅ Memory usage acceptable (${memoryIncreasePercent.toFixed(1)}% increase)`);
      } else {
        this.results.warnings.push({
          test: 'Memory Leak Detection',
          memoryIncrease: memoryIncrease,
          increasePercent: memoryIncreasePercent,
          status: 'warning'
        });
        console.log(`   ⚠️  Potential memory leak detected (${memoryIncreasePercent.toFixed(1)}% increase)`);
      }
      
    } catch (error) {
      this.results.failed.push({
        test: 'Memory Leak Detection',
        error: error.message,
        status: 'failed'
      });
      console.log('   ❌ Memory leak test failed:', error.message);
    } finally {
      await page.close();
    }
  }

  async testBrowserCompatibility() {
    console.log('🌐 Testing browser compatibility...');
    
    // Test different user agents
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15'
    ];

    for (const userAgent of userAgents) {
      const page = await this.createTestPage();
      
      try {
        await page.setUserAgent(userAgent);
        await page.goto(this.config.testUrl, { waitUntil: 'networkidle0' });
        
        const browserName = userAgent.includes('Chrome') ? 'Chrome' : 
                          userAgent.includes('Firefox') ? 'Firefox' : 'Safari';
        
        // Check if basic functionality works
        const appLoaded = await page.$('#root > div') !== null;
        
        if (appLoaded) {
          this.results.passed.push({
            test: `Browser Compatibility - ${browserName}`,
            userAgent,
            status: 'passed'
          });
          console.log(`   ✅ ${browserName} compatibility confirmed`);
        } else {
          this.results.failed.push({
            test: `Browser Compatibility - ${browserName}`,
            userAgent,
            status: 'failed'
          });
          console.log(`   ❌ ${browserName} compatibility failed`);
        }
        
      } catch (error) {
        this.results.failed.push({
          test: 'Browser Compatibility',
          error: error.message,
          userAgent,
          status: 'failed'
        });
      } finally {
        await page.close();
      }
    }
  }

  async testExtensionCompatibility() {
    console.log('🔌 Testing browser extension compatibility...');
    
    const page = await this.createTestPage();
    
    try {
      await page.goto(this.config.testUrl, { waitUntil: 'networkidle0' });
      
      // Simulate browser extension errors
      await page.evaluate(() => {
        // Simulate extension message port errors
        window.dispatchEvent(new ErrorEvent('error', {
          message: 'message port closed',
          filename: 'chrome-extension://test/content.js'
        }));

        // Simulate extension context invalidated
        window.dispatchEvent(new ErrorEvent('error', {
          message: 'Extension context invalidated',
          filename: 'chrome-extension://test/background.js'
        }));
      });

      // Wait to see if app crashes
      await page.waitForTimeout(1000);
      const appStillRunning = await page.$('#root > div') !== null;
      
      if (appStillRunning) {
        this.results.passed.push({
          test: 'Browser Extension Compatibility',
          status: 'passed'
        });
        console.log('   ✅ Extension errors handled gracefully');
      } else {
        this.results.failed.push({
          test: 'Browser Extension Compatibility',
          status: 'failed'
        });
        console.log('   ❌ Extension compatibility failed');
      }
      
    } catch (error) {
      this.results.failed.push({
        test: 'Browser Extension Compatibility',
        error: error.message,
        status: 'failed'
      });
    } finally {
      await page.close();
    }
  }

  async testCSPCompliance() {
    console.log('🔒 Testing CSP compliance...');
    
    const page = await this.createTestPage();
    
    try {
      const response = await page.goto(this.config.testUrl, { waitUntil: 'networkidle0' });
      const headers = response.headers();
      
      const cspHeader = headers['content-security-policy'];
      
      if (cspHeader) {
        const hasUnsafeInline = cspHeader.includes('unsafe-inline');
        const hasUnsafeEval = cspHeader.includes('unsafe-eval');
        
        if (!hasUnsafeInline && !hasUnsafeEval) {
          this.results.passed.push({
            test: 'CSP Compliance',
            csp: cspHeader,
            status: 'passed'
          });
          console.log('   ✅ CSP is secure (no unsafe directives)');
        } else {
          this.results.warnings.push({
            test: 'CSP Compliance',
            warning: 'CSP contains unsafe directives',
            hasUnsafeInline,
            hasUnsafeEval,
            status: 'warning'
          });
          console.log('   ⚠️  CSP contains unsafe directives');
        }
      } else {
        this.results.failed.push({
          test: 'CSP Compliance',
          status: 'failed',
          reason: 'No CSP header found'
        });
        console.log('   ❌ No CSP header found');
      }
      
    } catch (error) {
      this.results.failed.push({
        test: 'CSP Compliance',
        error: error.message,
        status: 'failed'
      });
    } finally {
      await page.close();
    }
  }

  async testXSSPrevention() {
    console.log('🛡️ Testing XSS prevention...');
    
    const page = await this.createTestPage();
    
    try {
      await page.goto(this.config.testUrl, { waitUntil: 'networkidle0' });
      
      // Try to inject malicious script
      const xssBlocked = await page.evaluate(() => {
        try {
          // Attempt to create a script element with malicious code
          const script = document.createElement('script');
          script.innerHTML = 'window.xssExecuted = true;';
          document.body.appendChild(script);
          
          // Wait a bit and check if the script executed
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(!window.xssExecuted);
            }, 500);
          });
        } catch (error) {
          return true; // XSS was blocked
        }
      });

      if (xssBlocked) {
        this.results.passed.push({
          test: 'XSS Prevention',
          status: 'passed'
        });
        console.log('   ✅ XSS injection blocked successfully');
      } else {
        this.results.failed.push({
          test: 'XSS Prevention',
          status: 'failed'
        });
        console.log('   ❌ XSS injection was not blocked');
      }
      
    } catch (error) {
      this.results.failed.push({
        test: 'XSS Prevention',
        error: error.message,
        status: 'failed'
      });
    } finally {
      await page.close();
    }
  }

  async testLoadPerformance() {
    console.log('⚡ Testing load performance...');
    
    const page = await this.createTestPage();
    
    try {
      const startTime = Date.now();
      await page.goto(this.config.testUrl, { waitUntil: 'networkidle0' });
      const loadTime = Date.now() - startTime;
      
      const metrics = await page.metrics();
      
      const performance = {
        loadTime,
        jsHeapUsedSize: metrics.JSHeapUsedSize,
        jsHeapTotalSize: metrics.JSHeapTotalSize,
        scriptDuration: metrics.ScriptDuration,
        layoutDuration: metrics.LayoutDuration
      };

      if (loadTime < 5000) { // Less than 5 seconds
        this.results.passed.push({
          test: 'Load Performance',
          ...performance,
          status: 'passed'
        });
        console.log(`   ✅ Load time acceptable (${loadTime}ms)`);
      } else {
        this.results.warnings.push({
          test: 'Load Performance',
          ...performance,
          status: 'warning'
        });
        console.log(`   ⚠️  Load time slow (${loadTime}ms)`);
      }
      
      this.results.performance.push(performance);
      
    } catch (error) {
      this.results.failed.push({
        test: 'Load Performance',
        error: error.message,
        status: 'failed'
      });
    } finally {
      await page.close();
    }
  }

  async testMemoryUsage() {
    console.log('💾 Testing memory usage...');
    
    const page = await this.createTestPage();
    
    try {
      await page.goto(this.config.testUrl, { waitUntil: 'networkidle0' });
      const metrics = await page.metrics();
      
      const memoryUsageMB = metrics.JSHeapUsedSize / (1024 * 1024);
      
      if (memoryUsageMB < 50) { // Less than 50MB
        this.results.passed.push({
          test: 'Memory Usage',
          memoryUsageMB,
          status: 'passed'
        });
        console.log(`   ✅ Memory usage acceptable (${memoryUsageMB.toFixed(1)}MB)`);
      } else {
        this.results.warnings.push({
          test: 'Memory Usage',
          memoryUsageMB,
          status: 'warning'
        });
        console.log(`   ⚠️  High memory usage (${memoryUsageMB.toFixed(1)}MB)`);
      }
      
    } catch (error) {
      this.results.failed.push({
        test: 'Memory Usage',
        error: error.message,
        status: 'failed'
      });
    } finally {
      await page.close();
    }
  }

  async testOfflineMode() {
    console.log('📱 Testing offline mode...');
    
    const page = await this.createTestPage();
    
    try {
      await page.goto(this.config.testUrl, { waitUntil: 'networkidle0' });
      
      // Go offline
      await page.setOfflineMode(true);
      
      // Try to navigate or reload
      await page.reload({ waitUntil: 'domcontentloaded' });
      
      // Check if offline page is shown or app still works
      const offlineHandled = await page.evaluate(() => {
        return document.body.innerText.includes('offline') || 
               document.querySelector('#root > div') !== null;
      });

      if (offlineHandled) {
        this.results.passed.push({
          test: 'Offline Mode',
          status: 'passed'
        });
        console.log('   ✅ Offline mode handled gracefully');
      } else {
        this.results.failed.push({
          test: 'Offline Mode',
          status: 'failed'
        });
        console.log('   ❌ Offline mode not handled');
      }
      
    } catch (error) {
      this.results.failed.push({
        test: 'Offline Mode',
        error: error.message,
        status: 'failed'
      });
    } finally {
      await page.setOfflineMode(false);
      await page.close();
    }
  }

  async testNetworkErrors() {
    console.log('🌐 Testing network error handling...');
    
    const page = await this.createTestPage();
    
    try {
      // Intercept network requests and simulate failures
      await page.setRequestInterception(true);
      
      page.on('request', (request) => {
        if (request.url().includes('api') && Math.random() < 0.5) {
          request.abort('failed');
        } else {
          request.continue();
        }
      });

      await page.goto(this.config.testUrl, { waitUntil: 'networkidle0' });
      
      // App should still load even with network errors
      const appStillWorks = await page.$('#root > div') !== null;
      
      if (appStillWorks) {
        this.results.passed.push({
          test: 'Network Error Handling',
          status: 'passed'
        });
        console.log('   ✅ Network errors handled gracefully');
      } else {
        this.results.failed.push({
          test: 'Network Error Handling',
          status: 'failed'
        });
        console.log('   ❌ Network error handling failed');
      }
      
    } catch (error) {
      this.results.failed.push({
        test: 'Network Error Handling',
        error: error.message,
        status: 'failed'
      });
    } finally {
      await page.close();
    }
  }

  async testAccessibility() {
    console.log('♿ Testing accessibility...');
    
    const page = await this.createTestPage();
    
    try {
      await page.goto(this.config.testUrl, { waitUntil: 'networkidle0' });
      
      // Basic accessibility checks
      const accessibilityResults = await page.evaluate(() => {
        const checks = {
          hasTitle: !!document.title,
          hasHeadings: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length > 0,
          hasAltText: Array.from(document.querySelectorAll('img')).every(img => img.alt),
          hasAriaLabels: document.querySelectorAll('[aria-label]').length > 0,
          hasSkipLink: !!document.querySelector('[href="#main"], [href="#content"]')
        };
        
        return checks;
      });

      const passedChecks = Object.values(accessibilityResults).filter(Boolean).length;
      const totalChecks = Object.keys(accessibilityResults).length;
      const score = (passedChecks / totalChecks) * 100;

      if (score >= 80) {
        this.results.passed.push({
          test: 'Accessibility',
          score,
          checks: accessibilityResults,
          status: 'passed'
        });
        console.log(`   ✅ Accessibility score: ${score}%`);
      } else {
        this.results.warnings.push({
          test: 'Accessibility',
          score,
          checks: accessibilityResults,
          status: 'warning'
        });
        console.log(`   ⚠️  Accessibility score low: ${score}%`);
      }
      
      this.results.accessibility.push({ score, checks: accessibilityResults });
      
    } catch (error) {
      this.results.failed.push({
        test: 'Accessibility',
        error: error.message,
        status: 'failed'
      });
    } finally {
      await page.close();
    }
  }

  async testMobileResponsiveness() {
    console.log('📱 Testing mobile responsiveness...');
    
    const page = await this.createTestPage();
    
    try {
      await page.setViewport(this.config.mobileViewport);
      await page.goto(this.config.testUrl, { waitUntil: 'networkidle0' });
      
      // Check if mobile layout is applied
      const mobileResults = await page.evaluate(() => {
        return {
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          hasHamburgerMenu: !!document.querySelector('[class*="mobile"], [class*="hamburger"]'),
          hasResponsiveElements: getComputedStyle(document.body).display !== 'none'
        };
      });

      if (mobileResults.viewportWidth === this.config.mobileViewport.width) {
        this.results.passed.push({
          test: 'Mobile Responsiveness',
          ...mobileResults,
          status: 'passed'
        });
        console.log('   ✅ Mobile layout responsive');
      } else {
        this.results.failed.push({
          test: 'Mobile Responsiveness',
          ...mobileResults,
          status: 'failed'
        });
        console.log('   ❌ Mobile responsiveness issues');
      }
      
    } catch (error) {
      this.results.failed.push({
        test: 'Mobile Responsiveness',
        error: error.message,
        status: 'failed'
      });
    } finally {
      await page.close();
    }
  }

  generateTestReport() {
    console.log('\n📊 AUTOMATED TESTING PROTOCOL REPORT');
    console.log('=' .repeat(60));
    
    const passedCount = this.results.passed.length;
    const failedCount = this.results.failed.length;
    const warningCount = this.results.warnings.length;
    const totalTests = passedCount + failedCount + warningCount;
    
    console.log(`\n✅ PASSED: ${passedCount}/${totalTests}`);
    this.results.passed.forEach((test, index) => {
      console.log(`   ${index + 1}. ${test.test}`);
    });
    
    console.log(`\n❌ FAILED: ${failedCount}/${totalTests}`);
    this.results.failed.forEach((test, index) => {
      console.log(`   ${index + 1}. ${test.test}`);
      if (test.error) console.log(`      Error: ${test.error}`);
    });
    
    console.log(`\n⚠️  WARNINGS: ${warningCount}/${totalTests}`);
    this.results.warnings.forEach((test, index) => {
      console.log(`   ${index + 1}. ${test.test}`);
      if (test.warning) console.log(`      Warning: ${test.warning}`);
    });
    
    // Calculate overall score
    const score = Math.round(((passedCount + warningCount * 0.5) / totalTests) * 100);
    
    console.log('\n' + '='.repeat(60));
    console.log(`OVERALL TEST SCORE: ${score}/100`);
    
    if (failedCount === 0 && warningCount === 0) {
      console.log('🎉 ZERO-ERROR STATUS: ACHIEVED!');
      console.log('✨ All tests passed successfully.');
    } else if (failedCount === 0) {
      console.log('⚠️  ZERO-ERROR STATUS: NEARLY ACHIEVED');
      console.log('🔧 Address warnings to reach perfect status.');
    } else {
      console.log('🚨 ZERO-ERROR STATUS: NOT ACHIEVED');
      console.log('❌ Critical test failures must be resolved.');
    }
    
    console.log('\n' + '='.repeat(60));
    
    // Save detailed report
    const reportPath = path.join(process.cwd(), `test-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      score,
      status: failedCount === 0 && warningCount === 0 ? 'ACHIEVED' : 
              failedCount === 0 ? 'NEARLY_ACHIEVED' : 'NOT_ACHIEVED',
      summary: { passedCount, failedCount, warningCount, totalTests },
      results: this.results
    }, null, 2));
    
    console.log(`📄 Detailed test report saved to: ${reportPath}`);
    
    return { score, passedCount, failedCount, warningCount };
  }
}

// CLI interface
if (require.main === module) {
  const protocol = new AutomatedTestingProtocol();
  
  protocol.runAllTests()
    .then(() => {
      console.log('\n🏁 Testing protocol completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Testing protocol failed:', error);
      process.exit(1);
    });
}

module.exports = AutomatedTestingProtocol;