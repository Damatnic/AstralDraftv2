/**
 * Memory Leak Testing and Audit Utilities
 * Comprehensive tools for detecting and reporting memory leaks
 */

import { memoryManager } from './memoryCleanup';

interface LeakTestResult {
  testName: string;
  passed: boolean;
  initialMemory: number;
  finalMemory: number;
  memoryGrowth: number;
  duration: number;
  leakDetected: boolean;
  details: string;}

interface ComponentLeakTest {
  componentName: string;
  mountCount: number;
  unmountCount: number;
  activeTimers: number;
  activeIntervals: number;
  activeListeners: number;
  memoryRetained: number;
  possibleLeaks: string[];}

class MemoryLeakTester {
  private testResults: LeakTestResult[] = [];
  private componentTests: Map<string, ComponentLeakTest> = new Map();
  private globalListeners = new Map<string, number>();
  private timerCounts = { active: 0, cleared: 0 };
  private intervalCounts = { active: 0, cleared: 0 };

  /**
   * Run a memory leak test
   */
  async runLeakTest(
    testName: string,
    testFn: () => Promise<void>,
    options: {
      iterations?: number;
      delayBetween?: number;
      memoryThreshold?: number;
    } = {}
  ): Promise<LeakTestResult> {
    const {
      iterations = 10,
      delayBetween = 100,
      memoryThreshold = 5 * 1024 * 1024 // 5MB
    } = options;

    console.log(`[Leak Test] Starting: ${testName}`);
    
    // Force garbage collection if available
    this.forceGC();
    await this.delay(500);

    const initialMemory = this.getMemoryUsage();
    const startTime = Date.now();

    // Run test iterations
    for (let i = 0; i < iterations; i++) {
      await testFn();
      await this.delay(delayBetween);
    }

    // Force garbage collection and wait
    this.forceGC();
    await this.delay(1000);

    const finalMemory = this.getMemoryUsage();
    const duration = Date.now() - startTime;
    const memoryGrowth = finalMemory - initialMemory;
    const leakDetected = memoryGrowth > memoryThreshold;

    const result: LeakTestResult = {
      testName,
      passed: !leakDetected,
      initialMemory,
      finalMemory,
      memoryGrowth,
      duration,
      leakDetected,
      details: leakDetected 
        ? `Memory leak detected: ${this.formatBytes(memoryGrowth)} growth after ${iterations} iterations`
        : `No leak detected: ${this.formatBytes(memoryGrowth)} growth is within threshold`
    };

    this.testResults.push(result);
    
    console.log(`[Leak Test] Completed: ${testName}`, {
      passed: result.passed,
      growth: this.formatBytes(memoryGrowth),
      duration: `${duration}ms`
    });

    return result;
  }

  /**
   * Track component lifecycle for leak detection
   */
  trackComponentMount(componentName: string) {
    const existing = this.componentTests.get(componentName) || {
      componentName,
      mountCount: 0,
      unmountCount: 0,
      activeTimers: 0,
      activeIntervals: 0,
      activeListeners: 0,
      memoryRetained: 0,
      possibleLeaks: []
    };

    existing.mountCount++;
    this.componentTests.set(componentName, existing);
  }

  trackComponentUnmount(componentName: string) {
    const test = this.componentTests.get(componentName);
    if (test) {
      test.unmountCount++;
      
      // Check for imbalanced mount/unmount
      if (test.mountCount > test.unmountCount + 1) {
        test.possibleLeaks.push('Component not properly unmounting');
      }
    }
  }

  /**
   * Audit global event listeners
   */
  auditEventListeners(): {
    total: number;
    byType: Map<string, number>;
    suspicious: string[];
  } {
    const listeners = new Map<string, number>();
    const suspicious: string[] = [];

    // Check window listeners
    if (typeof window !== 'undefined') {
      const windowListeners = (window as any).getEventListeners?.(window) || {};
      Object.keys(windowListeners).forEach((event: any) => {
        const count = windowListeners[event].length;
        listeners.set(`window.${event}`, count);
        
        if (count > 10) {
          suspicious.push(`High listener count on window.${event}: ${count}`);
        }
      });
    }

    // Check document listeners
    if (typeof document !== 'undefined') {
      const docListeners = (document as any).getEventListeners?.(document) || {};
      Object.keys(docListeners).forEach((event: any) => {
        const count = docListeners[event].length;
        listeners.set(`document.${event}`, count);
        
        if (count > 10) {
          suspicious.push(`High listener count on document.${event}: ${count}`);
        }
      });
    }

    const total = Array.from(listeners.values()).reduce((sum, count) => sum + count, 0);

    return { total, byType: listeners, suspicious };
  }

  /**
   * Audit active timers and intervals
   */
  auditTimers(): {
    activeTimers: number;
    activeIntervals: number;
    timerLeakRatio: number;
    intervalLeakRatio: number;
  } {
    const stats = memoryManager.getMemoryStats();
    
    const timerLeakRatio = this.timerCounts.active > 0 
      ? (this.timerCounts.active - this.timerCounts.cleared) / this.timerCounts.active
      : 0;
      
    const intervalLeakRatio = this.intervalCounts.active > 0
      ? (this.intervalCounts.active - this.intervalCounts.cleared) / this.intervalCounts.active
      : 0;

    return {
      activeTimers: stats.activeTimers,
      activeIntervals: stats.activeIntervals,
      timerLeakRatio,
//       intervalLeakRatio
    };
  }

  /**
   * Perform comprehensive memory audit
   */
  performFullAudit(): {
    timestamp: string;
    memory: {
      current: number;
      baseline: number;
      peak: number;
      growth: number;
    };
    resources: {
      timers: number;
      intervals: number;
      listeners: number;
      observers: number;
      abortControllers: number;
    };
    components: ComponentLeakTest[];
    testResults: LeakTestResult[];
    issues: string[];
    recommendations: string[];
  } {
    const stats = memoryManager.getMemoryStats();
    const listenerAudit = this.auditEventListeners();
    const timerAudit = this.auditTimers();
    
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check memory growth
    const memoryGrowth = stats.current - stats.baseline;
    if (memoryGrowth > 50 * 1024 * 1024) { // 50MB
      issues.push(`High memory growth: ${this.formatBytes(memoryGrowth)}`);
      recommendations.push('Investigate component lifecycle and data retention');
    }

    // Check timers
    if (stats.activeTimers > 20) {
      issues.push(`Too many active timers: ${stats.activeTimers}`);
      recommendations.push('Review timer usage and ensure proper cleanup');
    }

    // Check intervals
    if (stats.activeIntervals > 10) {
      issues.push(`Too many active intervals: ${stats.activeIntervals}`);
      recommendations.push('Consider consolidating intervals or using RAF');
    }

    // Check listeners
    if (listenerAudit.total > 100) {
      issues.push(`Too many event listeners: ${listenerAudit.total}`);
      recommendations.push('Review event listener usage and use delegation');
    }

    // Check for suspicious patterns
    listenerAudit.suspicious.forEach((issue: any) => issues.push(issue));

    // Check timer leak ratios
    if (timerAudit.timerLeakRatio > 0.2) {
      issues.push(`Timer leak detected: ${(timerAudit.timerLeakRatio * 100).toFixed(1)}% not cleared`);
      recommendations.push('Ensure all timers are cleared on cleanup');
    }

    if (timerAudit.intervalLeakRatio > 0.2) {
      issues.push(`Interval leak detected: ${(timerAudit.intervalLeakRatio * 100).toFixed(1)}% not cleared`);
      recommendations.push('Ensure all intervals are cleared on cleanup');
    }

    // Check component tests
    this.componentTests.forEach((test: any) => {
      if (test.mountCount > test.unmountCount + 1) {
        issues.push(`Component leak: ${test.componentName} (${test.mountCount} mounts, ${test.unmountCount} unmounts)`);
      }
    });

    return {
      timestamp: new Date().toISOString(),
      memory: {
        current: stats.current,
        baseline: stats.baseline,
        peak: stats.peak,
        growth: memoryGrowth
      },
      resources: {
        timers: stats.activeTimers,
        intervals: stats.activeIntervals,
        listeners: stats.activeListeners,
        observers: stats.activeObservers,
        abortControllers: stats.activeAbortControllers
      },
      components: Array.from(this.componentTests.values()),
      testResults: this.testResults,
      issues,
//       recommendations
    };
  }

  /**
   * Generate HTML report
   */
  generateHTMLReport(): string {
    const audit = this.performFullAudit();
    
    return `
<!DOCTYPE html>
<html>
<head>
  <title>Memory Leak Audit Report - ${audit.timestamp}</title>
  <style>
    body { font-family: -apple-system, sans-serif; padding: 20px; background: #1a1a1a; color: #e0e0e0; }
    h1, h2 { color: #4a9eff; }
    .status { padding: 5px 10px; border-radius: 4px; display: inline-block; }
    .pass { background: #2d5a2d; color: #90ee90; }
    .fail { background: #5a2d2d; color: #ff6b6b; }
    .warning { background: #5a5a2d; color: #ffeb3b; }
    .metric { display: inline-block; margin: 10px; padding: 15px; background: #2a2a2a; border-radius: 8px; }
    .metric-value { font-size: 24px; font-weight: bold; color: #4a9eff; }
    .metric-label { font-size: 12px; color: #888; margin-top: 5px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #333; }
    th { background: #2a2a2a; color: #4a9eff; }
    .issue { background: #3a2020; padding: 10px; margin: 5px 0; border-radius: 4px; border-left: 3px solid #ff6b6b; }
    .recommendation { background: #203a20; padding: 10px; margin: 5px 0; border-radius: 4px; border-left: 3px solid #90ee90; }
  </style>
</head>
<body>
  <h1>Memory Leak Audit Report</h1>
  <p>Generated: ${audit.timestamp}</p>
  
  <h2>Memory Overview</h2>
  <div>
    <div class="metric">
      <div class="metric-value">${this.formatBytes(audit.memory.current)}</div>
      <div class="metric-label">Current Usage</div>
    </div>
    <div class="metric">
      <div class="metric-value">${this.formatBytes(audit.memory.growth)}</div>
      <div class="metric-label">Growth from Baseline</div>
    </div>
    <div class="metric">
      <div class="metric-value">${this.formatBytes(audit.memory.peak)}</div>
      <div class="metric-label">Peak Usage</div>
    </div>
  </div>

  <h2>Active Resources</h2>
  <div>
    <div class="metric">
      <div class="metric-value">${audit.resources.timers}</div>
      <div class="metric-label">Active Timers</div>
    </div>
    <div class="metric">
      <div class="metric-value">${audit.resources.intervals}</div>
      <div class="metric-label">Active Intervals</div>
    </div>
    <div class="metric">
      <div class="metric-value">${audit.resources.listeners}</div>
      <div class="metric-label">Event Listeners</div>
    </div>
    <div class="metric">
      <div class="metric-value">${audit.resources.observers}</div>
      <div class="metric-label">Observers</div>
    </div>
  </div>

  <h2>Issues Found (${audit.issues.length})</h2>
  ${audit.issues.length === 0 
    ? '<p class="status pass">No issues detected!</p>'
    : audit.issues.map((issue: any) => `<div class="issue">⚠️ ${issue}</div>`).join('')
  }

  <h2>Recommendations</h2>
  ${audit.recommendations.length === 0
    ? '<p class="status pass">No recommendations - system is healthy!</p>'
    : audit.recommendations.map((rec: any) => `<div class="recommendation">✅ ${rec}</div>`).join('')
  }

  <h2>Component Lifecycle Tests</h2>
  <table>
    <thead>
      <tr>
        <th>Component</th>
        <th>Mounts</th>
        <th>Unmounts</th>
        <th>Status</th>
        <th>Issues</th>
      </tr>
    </thead>
    <tbody>
      ${audit.components.map((comp: any) => `
        <tr>
          <td>${comp.componentName}</td>
          <td>${comp.mountCount}</td>
          <td>${comp.unmountCount}</td>
          <td>
            <span class="status ${comp.mountCount === comp.unmountCount ? 'pass' : 'warning'}">
              ${comp.mountCount === comp.unmountCount ? 'Balanced' : 'Imbalanced'}
            </span>
          </td>
          <td>${comp.possibleLeaks.join(', ') || 'None'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>Memory Leak Tests</h2>
  <table>
    <thead>
      <tr>
        <th>Test Name</th>
        <th>Status</th>
        <th>Memory Growth</th>
        <th>Duration</th>
        <th>Details</th>
      </tr>
    </thead>
    <tbody>
      ${audit.testResults.map((result: any) => `
        <tr>
          <td>${result.testName}</td>
          <td>
            <span class="status ${result.passed ? 'pass' : 'fail'}">
              ${result.passed ? 'PASS' : 'FAIL'}
            </span>
          </td>
          <td>${this.formatBytes(result.memoryGrowth)}</td>
          <td>${result.duration}ms</td>
          <td>${result.details}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</body>
</html>
    `;
  }

  /**
   * Stress test for memory leaks
   */
  async runStressTest(duration: number = 30000): Promise<void> {
    console.log(`[Stress Test] Starting ${duration / 1000} second stress test...`);
    
    const startTime = Date.now();
    const initialMemory = this.getMemoryUsage();
    let iterations = 0;

    while (Date.now() - startTime < duration) {
      // Simulate heavy operations
      const data = new Array(1000).fill(null).map(() => ({
        id: Math.random(),
        data: new Array(100).fill(Math.random())
      }));

      // Create and destroy timers
      const timers = [];
      for (let i = 0; i < 10; i++) {
        timers.push(setTimeout(() => {}, 100));
      }
      timers.forEach(clearTimeout);

      // Create and remove event listeners
      const handler = () => {};
      window.addEventListener('test', handler);
      window.removeEventListener('test', handler);

      iterations++;
      await this.delay(100);
    }

    const finalMemory = this.getMemoryUsage();
    const memoryGrowth = finalMemory - initialMemory;

    console.log(`[Stress Test] Completed`, {
      iterations,
      duration: `${duration / 1000}s`,
      memoryGrowth: this.formatBytes(memoryGrowth),
      avgGrowthPerIteration: this.formatBytes(memoryGrowth / iterations)
    });
  }

  // Helper methods
  private getMemoryUsage(): number {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const memory = (performance as any).memory;
      return memory?.usedJSHeapSize || 0;
    }
    return 0;
  }

  private formatBytes(bytes: number): string {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  }

  private forceGC(): void {
    if (typeof (window as any).gc === 'function') {
      (window as any).gc();
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

// Create singleton instance
export const leakTester = new MemoryLeakTester();

// Export convenience functions
export const runLeakTest = (name: string, fn: () => Promise<void>, options?: any) =>
  leakTester.runLeakTest(name, fn, options);

export const trackComponentMount = (name: string) =>
  leakTester.trackComponentMount(name);

export const trackComponentUnmount = (name: string) =>
  leakTester.trackComponentUnmount(name);

export const auditMemory = () =>
  leakTester.performFullAudit();

export const generateMemoryReport = () =>
  leakTester.generateHTMLReport();