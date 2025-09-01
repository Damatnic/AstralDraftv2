// Performance monitoring and optimization service
class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    // Monitor navigation timing
    if ('PerformanceObserver' in window) {
      // Long task monitoring
      try {
        const longTaskObserver = new PerformanceObserver((list: any) => {
          for (const entry of list.getEntries()) {
            this.recordMetric('longTask', entry.duration);
            if (entry.duration > 50 && process.env.NODE_ENV === 'development') {
              console.warn(`Long task detected: ${entry.duration}ms`, entry);
            }
          }
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.push(longTaskObserver);
      } catch (e) {
        // Long task API not supported
      }

      // Layout shift monitoring
      try {
        const clsObserver = new PerformanceObserver((list: any) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              this.recordMetric('layoutShift', (entry as any).value);
            }
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        // Layout shift API not supported
      }

      // Resource timing
      try {
        const resourceObserver = new PerformanceObserver((list: any) => {
          for (const entry of list.getEntries()) {
            const resource = entry as PerformanceResourceTiming;
            this.recordMetric('resourceLoad', resource.duration);
            
            // Flag slow resources in development
            if (resource.duration > 1000 && process.env.NODE_ENV === 'development') {
              console.warn(`Slow resource: ${resource.name} took ${resource.duration}ms`);
            }
          }
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
      } catch (e) {
        // Resource timing API not supported
      }
    }
  }

  // Record a performance metric
  recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    const values = this.metrics.get(name)!;
    values.push(value);
    
    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift();
    }
  }

  // Get metric statistics
  getMetricStats(name: string) {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    return {
      count: values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p90: sorted[Math.floor(sorted.length * 0.9)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)]
    };
  }

  // Get all metrics summary
  getAllMetrics() {
    const summary: { [key: string]: any } = {};
    for (const [name] of this.metrics) {
      summary[name] = this.getMetricStats(name);
    }
    return summary;
  }

  // Measure React component render time
  measureComponentRender<T extends any[]>(
    componentName: string,
    renderFn: (...args: T) => any
  ) {
    return (...args: T) => {
      const start = performance.now();
      const result = renderFn(...args);
      const end = performance.now();
      
      this.recordMetric(`component_${componentName}`, end - start);
      
      if (end - start > 16 && process.env.NODE_ENV === 'development') { // Warn if render takes longer than one frame
        console.warn(`Slow render: ${componentName} took ${(end - start).toFixed(2)}ms`);
      }
      
      return result;
    };
  }

  // Measure async operations
  async measureAsync<T>(name: string, asyncFn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      const result = await asyncFn();
      const end = performance.now();
      this.recordMetric(name, end - start);
      return result;
    } catch (error) {
      const end = performance.now();
      this.recordMetric(`${name}_error`, end - start);
      throw error;
    }
  }

  // Get Web Vitals
  getWebVitals() {
    return {
      fcp: this.getFirstContentfulPaint(),
      lcp: this.getLargestContentfulPaint(),
      fid: this.getFirstInputDelay(),
      cls: this.getCumulativeLayoutShift(),
      ttfb: this.getTimeToFirstByte()
    };
  }

  private getFirstContentfulPaint() {
    const entries = performance.getEntriesByType('paint');
    const fcp = entries.find((entry: any) => entry.name === 'first-contentful-paint');
    return fcp ? fcp.startTime : null;
  }

  private getLargestContentfulPaint() {
    const entries = performance.getEntriesByType('largest-contentful-paint');
    return entries.length > 0 ? entries[entries.length - 1].startTime : null;
  }

  private getFirstInputDelay() {
    const stats = this.getMetricStats('firstInput');
    return stats ? stats.max : null;
  }

  private getCumulativeLayoutShift() {
    const stats = this.getMetricStats('layoutShift');
    return stats ? stats.avg : null;
  }

  private getTimeToFirstByte() {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return navigation ? navigation.responseStart - navigation.requestStart : null;
  }

  // Generate performance report
  generateReport() {
    const webVitals = this.getWebVitals();
    const allMetrics = this.getAllMetrics();
    
    return {
      timestamp: new Date().toISOString(),
      webVitals,
      customMetrics: allMetrics,
      recommendations: this.generateRecommendations(webVitals, allMetrics)
    };
  }

  private generateRecommendations(webVitals: any, metrics: any) {
    const recommendations: string[] = [];

    if (webVitals.fcp && webVitals.fcp > 2500) {
      recommendations.push('First Contentful Paint is slow. Consider optimizing critical rendering path.');
    }

    if (webVitals.lcp && webVitals.lcp > 2500) {
      recommendations.push('Largest Contentful Paint is slow. Optimize largest element loading.');
    }

    if (webVitals.cls && webVitals.cls > 0.1) {
      recommendations.push('High Cumulative Layout Shift detected. Ensure proper element sizing.');
    }

    if (metrics.longTask && metrics.longTask.count > 10) {
      recommendations.push('Multiple long tasks detected. Consider code splitting and lazy loading.');
    }

    return recommendations;
  }

  // Clean up observers
  destroy() {
    this.observers.forEach((observer: any) => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }

export const performanceMonitor = new PerformanceMonitor();

// Export singleton instance
export default performanceMonitor;