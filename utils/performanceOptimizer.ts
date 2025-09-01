/**
 * Performance Optimizer Utility
 * Advanced performance monitoring and optimization for the fantasy football app
 */

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url?: string;}

interface BundleAnalytics {
  totalSize: number;
  gzippedSize: number;
  chunkCount: number;
  largestChunk: string;
  largestChunkSize: number;}

class PerformanceOptimizer {
  private metrics: PerformanceMetric[] = [];
  private observer: PerformanceObserver | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializePerformanceMonitoring();
      this.trackBundleMetrics();
    }
  }

  /**
   * Initialize Core Web Vitals monitoring
   */
  private initializePerformanceMonitoring(): void {
    // Track Largest Contentful Paint (LCP)
    this.trackLCP();
    
    // Track First Input Delay (FID)
    this.trackFID();
    
    // Track Cumulative Layout Shift (CLS)
    this.trackCLS();
    
    // Track custom app metrics
    this.trackCustomMetrics();
  }

  /**
   * Track Largest Contentful Paint
   */
  private trackLCP(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list: any) => {
        list.getEntries().forEach((entry: any) => {
          this.recordMetric('LCP', entry.startTime);
          console.log('🎯 LCP:', entry.startTime.toFixed(2) + 'ms');
        });
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  /**
   * Track First Input Delay
   */
  private trackFID(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list: any) => {
        list.getEntries().forEach((entry: any) => {
          const fid = entry.processingStart - entry.startTime;
          this.recordMetric('FID', fid);
          console.log('⚡ FID:', fid.toFixed(2) + 'ms');
        });
      });
      observer.observe({ entryTypes: ['first-input'] });
    }
  }

  /**
   * Track Cumulative Layout Shift
   */
  private trackCLS(): void {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list: any) => {
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.recordMetric('CLS', clsValue);
            console.log('📏 CLS:', clsValue.toFixed(4));
          }
        });
      });
      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }

  /**
   * Track custom application metrics
   */
  private trackCustomMetrics(): void {
    // Track Time to Interactive (TTI)
    if (document.readyState === 'complete') {
      this.measureTTI();
    } else {
      window.addEventListener('load', () => this.measureTTI());
    }

    // Track component render times
    this.trackComponentRenderTimes();

    // Track route change performance
    this.trackRouteChanges();
  }

  /**
   * Measure Time to Interactive
   */
  private measureTTI(): void {
    const navigationStart = performance.timing.navigationStart;
    const domContentLoaded = performance.timing.domContentLoadedEventEnd;
    const tti = domContentLoaded - navigationStart;
    
    this.recordMetric('TTI', tti);
    console.log('🚀 TTI:', tti.toFixed(2) + 'ms');
  }

  /**
   * Track component render performance
   */
  private trackComponentRenderTimes(): void {
    // Wrap console.time/timeEnd for component measurements
    const originalTime = console.time;
    const originalTimeEnd = console.timeEnd;
    
    console.time = (label: string) => {
      if (label.includes('Component')) {
        performance.mark(`${label}-start`);
      }
      return originalTime.call(console, label);
    };
    
    console.timeEnd = (label: string) => {
      if (label.includes('Component')) {
        performance.mark(`${label}-end`);
        performance.measure(label, `${label}-start`, `${label}-end`);
        
        const measure = performance.getEntriesByName(label)[0];
        this.recordMetric(`Component-${label}`, measure.duration);
        console.log(`🔧 ${label}:`, measure.duration.toFixed(2) + 'ms');
      }
      return originalTimeEnd.call(console, label);
    };
  }

  /**
   * Track route change performance
   */
  private trackRouteChanges(): void {
    let routeChangeStart: number;
    
    // Listen for route changes (assuming you have a custom event)
    window.addEventListener('routeChangeStart', () => {
      routeChangeStart = performance.now();
    });
    
    window.addEventListener('routeChangeComplete', () => {
      const routeChangeDuration = performance.now() - routeChangeStart;
      this.recordMetric('RouteChange', routeChangeDuration);
      console.log('📍 Route Change:', routeChangeDuration.toFixed(2) + 'ms');
    });
  }

  /**
   * Track bundle size metrics
   */
  private trackBundleMetrics(): void {
    // Analyze loaded scripts
    const scripts = Array.from(document.scripts);
    let totalBundleSize = 0;
    
    scripts.forEach((script: any) => {
      if (script.src && script.src.includes('assets/')) {
        // Estimate bundle size from resource timing
        const resourceEntry = performance.getEntriesByName(script.src)[0] as PerformanceResourceTiming;
        if (resourceEntry && resourceEntry.transferSize) {
          totalBundleSize += resourceEntry.transferSize;
        }
      }
    });
    
    if (totalBundleSize > 0) {
      this.recordMetric('TotalBundleSize', totalBundleSize);
      console.log('📦 Total Bundle Size:', (totalBundleSize / 1024).toFixed(2) + 'KB');
    }
  }

  /**
   * Record a performance metric
   */
  recordMetric(name: string, value: number, url?: string): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      url: url || window.location.href
    };
    
    this.metrics.push(metric);
    
    // Send to analytics if configured
    this.sendToAnalytics(metric);
  }

  /**
   * Send metrics to analytics service
   */
  private sendToAnalytics(metric: PerformanceMetric): void {
    // In a real app, you would send this to your analytics service
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Performance Metric:', metric);
    }
    
    // Example: Send to Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'performance_metric', {
        custom_parameter: metric.name,
        value: Math.round(metric.value)
      });
    }
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): { [key: string]: PerformanceMetric[] } {
    const summary: { [key: string]: PerformanceMetric[] } = {};
    
    this.metrics.forEach((metric: any) => {
      if (!summary[metric.name]) {
        summary[metric.name] = [];
      }
      summary[metric.name].push(metric);
    });
    
    return summary;
  }

  /**
   * Get bundle analysis
   */
  getBundleAnalysis(): BundleAnalytics | null {
    const scripts = Array.from(document.scripts);
    const chunks = scripts.filter((script: any) => 
      script.src && script.src.includes('assets/') && script.src.includes('.js')
    );
    
    if (chunks.length === 0) return null;
    
    let totalSize = 0;
    let gzippedSize = 0;
    let largestChunk = '';
    let largestChunkSize = 0;
    
    chunks.forEach((script: any) => {
      const resourceEntry = performance.getEntriesByName(script.src)[0] as PerformanceResourceTiming;
      if (resourceEntry) {
        const size = resourceEntry.transferSize || 0;
        const decodedSize = resourceEntry.decodedBodySize || 0;
        
        totalSize += decodedSize;
        gzippedSize += size;
        
        if (size > largestChunkSize) {
          largestChunkSize = size;
          largestChunk = script.src.split('/').pop() || '';
        }
      }
    });
    
    return {
      totalSize,
      gzippedSize,
      chunkCount: chunks.length,
      largestChunk,
//       largestChunkSize
    };
  }

  /**
   * Generate performance report
   */
  generatePerformanceReport(): string {
    const summary = this.getPerformanceSummary();
    const bundleAnalysis = this.getBundleAnalysis();
    
    let report = '🎯 Performance Report\\n';
    report += '====================\\n\\n';
    
    // Core Web Vitals
    if (summary.LCP) {
      const lcp = summary.LCP[summary.LCP.length - 1].value;
      report += `📊 Largest Contentful Paint: ${lcp.toFixed(2)}ms\\n`;
      report += `   ${lcp < 2500 ? '✅ Good' : lcp < 4000 ? '⚠️ Needs Improvement' : '❌ Poor'}\\n\\n`;
    }
    
    if (summary.FID) {
      const fid = summary.FID[summary.FID.length - 1].value;
      report += `⚡ First Input Delay: ${fid.toFixed(2)}ms\\n`;
      report += `   ${fid < 100 ? '✅ Good' : fid < 300 ? '⚠️ Needs Improvement' : '❌ Poor'}\\n\\n`;
    }
    
    if (summary.CLS) {
      const cls = summary.CLS[summary.CLS.length - 1].value;
      report += `📏 Cumulative Layout Shift: ${cls.toFixed(4)}\\n`;
      report += `   ${cls < 0.1 ? '✅ Good' : cls < 0.25 ? '⚠️ Needs Improvement' : '❌ Poor'}\\n\\n`;
    }
    
    // Bundle Analysis
    if (bundleAnalysis) {
      report += `📦 Bundle Analysis:\\n`;
      report += `   Total Size: ${(bundleAnalysis.totalSize / 1024).toFixed(2)} KB\\n`;
      report += `   Gzipped Size: ${(bundleAnalysis.gzippedSize / 1024).toFixed(2)} KB\\n`;
      report += `   Chunk Count: ${bundleAnalysis.chunkCount}\\n`;
      report += `   Largest Chunk: ${bundleAnalysis.largestChunk} (${(bundleAnalysis.largestChunkSize / 1024).toFixed(2)} KB)\\n\\n`;
    }
    
    // Custom Metrics
    Object.keys(summary).forEach((metricName: any) => {
      if (!['LCP', 'FID', 'CLS'].includes(metricName)) {
        const metric = summary[metricName][summary[metricName].length - 1];
        report += `🔧 ${metricName}: ${metric.value.toFixed(2)}ms\\n`;
      }
    });
    
    return report;
  }

  /**
   * Optimize performance based on current metrics
   */
  optimizePerformance(): string[] {
    const recommendations: string[] = [];
    const summary = this.getPerformanceSummary();
    const bundleAnalysis = this.getBundleAnalysis();
    
    // LCP recommendations
    if (summary.LCP) {
      const lcp = summary.LCP[summary.LCP.length - 1].value;
      if (lcp > 2500) {
        recommendations.push('🎯 Optimize Largest Contentful Paint: Consider lazy loading images, preloading critical resources');
      }
    }
    
    // FID recommendations
    if (summary.FID) {
      const fid = summary.FID[summary.FID.length - 1].value;
      if (fid > 100) {
        recommendations.push('⚡ Reduce First Input Delay: Break up large JavaScript tasks, use React.memo and useCallback');
      }
    }
    
    // Bundle size recommendations
    if (bundleAnalysis && bundleAnalysis.totalSize > 400 * 1024) {
      recommendations.push('📦 Reduce bundle size: Implement code splitting, tree shaking, and remove unused dependencies');
    }
    
    if (bundleAnalysis && bundleAnalysis.chunkCount < 5) {
      recommendations.push('🔀 Improve code splitting: Create more granular chunks for better caching');
    }
    
    return recommendations;
  }

  /**
   * Clean up performance monitoring
   */
  destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.metrics = [];
  }

// Create singleton instance
export const performanceOptimizer = new PerformanceOptimizer();

// Export utilities for manual performance tracking
export const trackComponentRender = (componentName: string, renderTime: number) => {
  performanceOptimizer.recordMetric(`ComponentRender-${componentName}`, renderTime);
};

export const trackUserAction = (actionName: string, duration: number) => {
  performanceOptimizer.recordMetric(`UserAction-${actionName}`, duration);
};

export const trackBundleLoad = (chunkName: string, loadTime: number) => {
  performanceOptimizer.recordMetric(`BundleLoad-${chunkName}`, loadTime);
};

// Helper for tracking async operations
export const trackAsyncOperation = async <T>(
  operationName: string, 
  operation: () => Promise<T>
): Promise<T> => {
  const startTime = performance.now();
  try {

    const result = await operation();
    const duration = performance.now() - startTime;
    performanceOptimizer.recordMetric(`AsyncOperation-${operationName}`, duration);
    return result;
  
    } catch (error) {
        console.error(error);
    `AsyncOperationError-${operationName}`, duration);
    throw error;
  }
};

export default PerformanceOptimizer;