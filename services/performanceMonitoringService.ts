/**
 * Performance Monitoring Service
 * Tracks bundle performance, loading times, and optimization metrics
 */

export interface PerformanceMetrics {
}
  bundleSize: number;
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
  totalBlockingTime: number;
}

export interface BundleAnalysis {
}
  totalSize: number;
  gzippedSize: number;
  chunks: ChunkAnalysis[];
  duplicates: string[];
  largestAssets: AssetAnalysis[];
}

export interface ChunkAnalysis {
}
  name: string;
  size: number;
  gzippedSize: number;
  modules: string[];
  loadPriority: &apos;high&apos; | &apos;medium&apos; | &apos;low&apos;;
}

export interface AssetAnalysis {
}
  name: string;
  size: number;
  type: &apos;js&apos; | &apos;css&apos; | &apos;image&apos; | &apos;font&apos; | &apos;other&apos;;
  optimization: OptimizationSuggestion[];
}

export interface OptimizationSuggestion {
}
  type: &apos;code-split&apos; | &apos;lazy-load&apos; | &apos;compress&apos; | &apos;cache&apos; | &apos;minify&apos;;
  description: string;
  impact: &apos;high&apos; | &apos;medium&apos; | &apos;low&apos;;
  estimatedSavings: number;
}

class PerformanceMonitoringService {
}
  private metrics: PerformanceMetrics | null = null;
  private observer: PerformanceObserver | null = null;

  /**
   * Initialize performance monitoring
   */
  public init(): void {
}
    if (typeof window === &apos;undefined&apos;) return;

    this.collectWebVitals();
    this.monitorResourceLoading();
    this.trackUserInteractions();
  }

  /**
   * Collect Core Web Vitals metrics
   */
  private collectWebVitals(): void {
}
    // First Contentful Paint
    this.measureFCP();
    
    // Largest Contentful Paint
    this.measureLCP();
    
    // Cumulative Layout Shift
    this.measureCLS();
    
    // First Input Delay
    this.measureFID();
    
    // Time to Interactive
    this.measureTTI();
  }

  private measureFCP(): void {
}
    const fcpObserver = new PerformanceObserver((list: any) => {
}
      const entries = list.getEntries();
      const fcp = entries.find((entry: any) => entry.name === &apos;first-contentful-paint&apos;);
      if (fcp) {
}
        this.updateMetric(&apos;firstContentfulPaint&apos;, fcp.startTime);
        console.log(&apos;FCP:&apos;, fcp.startTime);
      }
    });
    fcpObserver.observe({ entryTypes: [&apos;paint&apos;] });
  }

  private measureLCP(): void {
}
    const lcpObserver = new PerformanceObserver((list: any) => {
}
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.updateMetric(&apos;largestContentfulPaint&apos;, lastEntry.startTime);
      console.log(&apos;LCP:&apos;, lastEntry.startTime);
    });
    lcpObserver.observe({ entryTypes: [&apos;largest-contentful-paint&apos;] });
  }

  private measureCLS(): void {
}
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list: any) => {
}
      for (const entry of list.getEntries() as any[]) {
}
        if (!entry.hadRecentInput) {
}
          clsValue += entry.value;
        }
      }
      this.updateMetric(&apos;cumulativeLayoutShift&apos;, clsValue);
      console.log(&apos;CLS:&apos;, clsValue);
    });
    clsObserver.observe({ entryTypes: [&apos;layout-shift&apos;] });
  }

  private measureFID(): void {
}
    const fidObserver = new PerformanceObserver((list: any) => {
}
      for (const entry of list.getEntries() as any[]) {
}
        this.updateMetric(&apos;firstInputDelay&apos;, entry.processingStart - entry.startTime);
        console.log(&apos;FID:&apos;, entry.processingStart - entry.startTime);
      }
    });
    fidObserver.observe({ entryTypes: [&apos;first-input&apos;] });
  }

  private measureTTI(): void {
}
    // Simplified TTI measurement
    const navigationEntry = performance.getEntriesByType(&apos;navigation&apos;)[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
}
      const tti = navigationEntry.domInteractive - navigationEntry.fetchStart;
      this.updateMetric(&apos;timeToInteractive&apos;, tti);
      console.log(&apos;TTI:&apos;, tti);
    }
  }

  /**
   * Monitor resource loading performance
   */
  private monitorResourceLoading(): void {
}
    const resourceObserver = new PerformanceObserver((list: any) => {
}
      for (const entry of list.getEntries()) {
}
        const resource = entry as PerformanceResourceTiming;
        if (resource.initiatorType === &apos;script&apos; || resource.initiatorType === &apos;link&apos;) {
}
          console.log(`Resource: ${resource.name}, Duration: ${resource.duration}ms`);
        }
      }
    });
    resourceObserver.observe({ entryTypes: [&apos;resource&apos;] });
  }

  /**
   * Track user interactions for performance impact
   */
  private trackUserInteractions(): void {
}
    // Track long tasks that block the main thread
    if (&apos;PerformanceObserver&apos; in window) {
}
      const longTaskObserver = new PerformanceObserver((list: any) => {
}
        for (const entry of list.getEntries()) {
}
          console.warn(`Long task detected: ${entry.duration}ms`);
        }
      });
      
      try {
}
        longTaskObserver.observe({ entryTypes: [&apos;longtask&apos;] });
      } catch (e) {
}
        // Browser doesn&apos;t support longtask entries
        console.log(&apos;Long task monitoring not supported&apos;);
      }
    }
  }

  /**
   * Analyze bundle composition and suggest optimizations
   */
  public async analyzeBundlePerformance(): Promise<BundleAnalysis> {
}
    // This would typically be called during build time
    // For runtime analysis, we can estimate based on loaded resources
    const resources = performance.getEntriesByType(&apos;resource&apos;) as PerformanceResourceTiming[];
    
    const jsResources = resources.filter((r: any) => r.name.endsWith(&apos;.js&apos;));
    const cssResources = resources.filter((r: any) => r.name.endsWith(&apos;.css&apos;));
    
    const chunks: ChunkAnalysis[] = jsResources.map((resource: any) => ({
}
      name: resource.name.split(&apos;/&apos;).pop() || &apos;unknown&apos;,
      size: resource.transferSize || 0,
      gzippedSize: resource.encodedBodySize || 0,
      modules: [], // Would need build-time analysis
      loadPriority: this.determineLoadPriority(resource)
    }));

    const largestAssets: AssetAnalysis[] = resources
      .sort((a, b) => (b.transferSize || 0) - (a.transferSize || 0))
      .slice(0, 10)
      .map((resource: any) => ({
}
        name: resource.name.split(&apos;/&apos;).pop() || &apos;unknown&apos;,
        size: resource.transferSize || 0,
        type: this.getAssetType(resource.name),
        optimization: this.suggestOptimizations(resource)
      }));

    return {
}
      totalSize: resources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
      gzippedSize: resources.reduce((sum, r) => sum + (r.encodedBodySize || 0), 0),
      chunks,
      duplicates: [], // Would need build-time analysis
//       largestAssets
    };
  }

  private determineLoadPriority(resource: PerformanceResourceTiming): &apos;high&apos; | &apos;medium&apos; | &apos;low&apos; {
}
    if (resource.name.includes(&apos;vendor-react&apos;) || resource.name.includes(&apos;index-&apos;)) {
}
      return &apos;high&apos;;
    }
    if (resource.name.includes(&apos;vendor-&apos;) || resource.name.includes(&apos;feature-&apos;)) {
}
      return &apos;medium&apos;;
    }
    return &apos;low&apos;;
  }

  private getAssetType(filename: string): &apos;js&apos; | &apos;css&apos; | &apos;image&apos; | &apos;font&apos; | &apos;other&apos; {
}
    if (filename.endsWith(&apos;.js&apos;)) return &apos;js&apos;;
    if (filename.endsWith(&apos;.css&apos;)) return &apos;css&apos;;
    if (filename.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) return &apos;image&apos;;
    if (filename.match(/\.(woff|woff2|ttf|eot)$/)) return &apos;font&apos;;
    return &apos;other&apos;;
  }

  private suggestOptimizations(resource: PerformanceResourceTiming): OptimizationSuggestion[] {
}
    const suggestions: OptimizationSuggestion[] = [];
    const size = resource.transferSize || 0;

    if (size > 500000) { // > 500KB
}
      suggestions.push({
}
        type: &apos;code-split&apos;,
        description: &apos;Consider code splitting this large bundle&apos;,
        impact: &apos;high&apos;,
        estimatedSavings: size * 0.3
      });
    }

    if (size > 100000 && resource.name.includes(&apos;vendor-&apos;)) { // > 100KB vendor
}
      suggestions.push({
}
        type: &apos;lazy-load&apos;,
        description: &apos;Consider lazy loading this vendor chunk&apos;,
        impact: &apos;medium&apos;,
        estimatedSavings: size * 0.5
      });
    }

    return suggestions;
  }

  /**
   * Get current performance metrics
   */
  public getMetrics(): PerformanceMetrics | null {
}
    return this.metrics;
  }

  /**
   * Update a specific metric
   */
  private updateMetric(key: keyof PerformanceMetrics, value: number): void {
}
    if (!this.metrics) {
}
      this.metrics = {
}
        bundleSize: 0,
        loadTime: 0,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        cumulativeLayoutShift: 0,
        firstInputDelay: 0,
        timeToInteractive: 0,
        totalBlockingTime: 0
      };
    }
    this.metrics[key] = value;
  }

  /**
   * Generate performance report
   */
  public generateReport(): string {
}
    const metrics = this.getMetrics();
    if (!metrics) return &apos;No metrics available&apos;;

    return `
Performance Report:
- First Contentful Paint: ${metrics.firstContentfulPaint.toFixed(2)}ms
- Largest Contentful Paint: ${metrics.largestContentfulPaint.toFixed(2)}ms
- Cumulative Layout Shift: ${metrics.cumulativeLayoutShift.toFixed(3)}
- First Input Delay: ${metrics.firstInputDelay.toFixed(2)}ms
- Time to Interactive: ${metrics.timeToInteractive.toFixed(2)}ms

Recommendations:
- FCP should be < 1800ms (${metrics.firstContentfulPaint < 1800 ? &apos;✓&apos; : &apos;✗&apos;})
- LCP should be < 2500ms (${metrics.largestContentfulPaint < 2500 ? &apos;✓&apos; : &apos;✗&apos;})
- CLS should be < 0.1 (${metrics.cumulativeLayoutShift < 0.1 ? &apos;✓&apos; : &apos;✗&apos;})
- FID should be < 100ms (${metrics.firstInputDelay < 100 ? &apos;✓&apos; : &apos;✗&apos;})
`;
  }

  /**
   * Cleanup performance monitoring
   */
  public destroy(): void {
}
    if (this.observer) {
}
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

export const performanceMonitoringService = new PerformanceMonitoringService();
export default performanceMonitoringService;
