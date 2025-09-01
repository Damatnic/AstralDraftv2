/**
 * Performance Monitoring Service
 * Tracks Web Vitals, resource loading, and user experience metrics
 */

interface PerformanceMetric {
}
  name: string;
  value: number;
  timestamp: number;
  sessionId: string;
  additionalData?: Record<string, unknown>;
}

interface WebVitals {
}
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

interface ResourceTiming {
}
  name: string;
  duration: number;
  size?: number;
  type: &apos;script&apos; | &apos;stylesheet&apos; | &apos;image&apos; | &apos;fetch&apos; | &apos;other&apos;;
}

class PerformanceService {
}
  private metrics: PerformanceMetric[] = [];
  private sessionId: string;
  private webVitals: WebVitals = {};
  private observers: PerformanceObserver[] = [];
  private isEnabled: boolean;

  constructor() {
}
    this.sessionId = `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.isEnabled = this.shouldEnablePerformanceMonitoring();
    
    if (this.isEnabled) {
}
      this.initializePerformanceMonitoring();
    }
  }

  private shouldEnablePerformanceMonitoring(): boolean {
}
    // Enable in production or when explicitly requested
    return import.meta.env.PROD || 
           import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === &apos;true&apos; ||
           localStorage.getItem(&apos;enable_performance_monitoring&apos;) === &apos;true&apos;;
  }

  private initializePerformanceMonitoring(): void {
}
    if (!(&apos;PerformanceObserver&apos; in window)) {
}
      console.warn(&apos;PerformanceObserver not supported&apos;);
      return;
    }

    this.setupWebVitalsObservers();
    this.setupResourceTimingObserver();
    this.setupNavigationTimingObserver();
    this.setupLongTaskObserver();

    // Track initial page load
    if (document.readyState === &apos;complete&apos;) {
}
      this.measureInitialPageLoad();
    } else {
}
      window.addEventListener(&apos;load&apos;, () => this.measureInitialPageLoad());
    }
  }

  private setupWebVitalsObservers(): void {
}
    try {
}
      // First Contentful Paint
      const paintObserver = new PerformanceObserver((list: any) => {
}
        for (const entry of list.getEntries()) {
}
          if (entry.name === &apos;first-contentful-paint&apos;) {
}
            this.webVitals.fcp = entry.startTime;
            this.recordMetric(&apos;web_vitals_fcp&apos;, entry.startTime);
          }
        }
      });
      paintObserver.observe({ entryTypes: [&apos;paint&apos;] });
      this.observers.push(paintObserver);

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list: any) => {
}
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.webVitals.lcp = lastEntry.startTime;
        this.recordMetric(&apos;web_vitals_lcp&apos;, lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: [&apos;largest-contentful-paint&apos;] });
      this.observers.push(lcpObserver);

      // First Input Delay
      const fidObserver = new PerformanceObserver((list: any) => {
}
        for (const entry of list.getEntries()) {
}
          const fid = (entry as any).processingStart - entry.startTime;
          this.webVitals.fid = fid;
          this.recordMetric(&apos;web_vitals_fid&apos;, fid);
        }
      });
      fidObserver.observe({ entryTypes: [&apos;first-input&apos;] });
      this.observers.push(fidObserver);

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list: any) => {
}
        for (const entry of list.getEntries()) {
}
          if (!(entry as any).hadRecentInput) {
}
            clsValue += (entry as any).value;
          }
        }
        this.webVitals.cls = clsValue;
        this.recordMetric(&apos;web_vitals_cls&apos;, clsValue);
      });
      clsObserver.observe({ entryTypes: [&apos;layout-shift&apos;] });
      this.observers.push(clsObserver);

    } catch (error) {
}
      console.warn(&apos;Failed to setup Web Vitals observers:&apos;, error);
    }
  }

  private setupResourceTimingObserver(): void {
}
    try {
}
      const resourceObserver = new PerformanceObserver((list: any) => {
}
        for (const entry of list.getEntries()) {
}
          this.analyzeResourceTiming(entry as PerformanceResourceTiming);
        }
      });
      resourceObserver.observe({ entryTypes: [&apos;resource&apos;] });
      this.observers.push(resourceObserver);
    } catch (error) {
}
      console.warn(&apos;Failed to setup resource timing observer:&apos;, error);
    }
  }

  private setupNavigationTimingObserver(): void {
}
    try {
}
      const navObserver = new PerformanceObserver((list: any) => {
}
        for (const entry of list.getEntries()) {
}
          this.analyzeNavigationTiming(entry as PerformanceNavigationTiming);
        }
      });
      navObserver.observe({ entryTypes: [&apos;navigation&apos;] });
      this.observers.push(navObserver);
    } catch (error) {
}
      console.warn(&apos;Failed to setup navigation timing observer:&apos;, error);
    }
  }

  private setupLongTaskObserver(): void {
}
    try {
}
      const longTaskObserver = new PerformanceObserver((list: any) => {
}
        for (const entry of list.getEntries()) {
}
          this.recordMetric(&apos;long_task&apos;, entry.duration, {
}
            startTime: entry.startTime,
            attribution: (entry as any).attribution
          });
        }
      });
      longTaskObserver.observe({ entryTypes: [&apos;longtask&apos;] });
      this.observers.push(longTaskObserver);
    } catch (error) {
}
      console.warn(&apos;Failed to setup long task observer:&apos;, error);
    }
  }

  private analyzeResourceTiming(entry: PerformanceResourceTiming): void {
}
    const resourceTiming: ResourceTiming = {
}
      name: entry.name,
      duration: entry.duration,
      size: entry.transferSize || undefined,
      type: this.getResourceType(entry.name, entry.initiatorType)
    };

    // Flag slow resources
    if (entry.duration > 1000) { // > 1 second
}
      this.recordMetric(&apos;slow_resource&apos;, entry.duration, {
}
        resource: resourceTiming,
        url: entry.name
      });
    }

    // Flag large resources
    if (entry.transferSize && entry.transferSize > 100 * 1024) { // > 100KB
}
      this.recordMetric(&apos;large_resource&apos;, entry.transferSize, {
}
        resource: resourceTiming,
        url: entry.name
      });
    }
  }

  private analyzeNavigationTiming(entry: PerformanceNavigationTiming): void {
}
    const ttfb = entry.responseStart - entry.requestStart;
    this.webVitals.ttfb = ttfb;
    
    this.recordMetric(&apos;navigation_ttfb&apos;, ttfb);
    this.recordMetric(&apos;navigation_dom_content_loaded&apos;, entry.domContentLoadedEventEnd - entry.navigationStart);
    this.recordMetric(&apos;navigation_load_complete&apos;, entry.loadEventEnd - entry.navigationStart);
  }

  private getResourceType(name: string, initiatorType: string): ResourceTiming[&apos;type&apos;] {
}
    if (name.includes(&apos;.js&apos;) || initiatorType === &apos;script&apos;) return &apos;script&apos;;
    if (name.includes(&apos;.css&apos;) || initiatorType === &apos;css&apos;) return &apos;stylesheet&apos;;
    if (name.match(/\.(jpg|jpeg|png|gif|svg|webp)/) || initiatorType === &apos;img&apos;) return &apos;image&apos;;
    if (initiatorType === &apos;fetch&apos; || initiatorType === &apos;xmlhttprequest&apos;) return &apos;fetch&apos;;
    return &apos;other&apos;;
  }

  private measureInitialPageLoad(): void {
}
    if (!performance.timing) return;

    const timing = performance.timing;
    const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
    const domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart;

    this.recordMetric(&apos;page_load_time&apos;, pageLoadTime);
    this.recordMetric(&apos;dom_ready_time&apos;, domReadyTime);
  }

  public recordMetric(name: string, value: number, additionalData?: Record<string, unknown>): void {
}
    if (!this.isEnabled) return;

    const metric: PerformanceMetric = {
}
      name,
      value,
      timestamp: Date.now(),
      sessionId: this.sessionId,
//       additionalData
    };

    this.metrics.push(metric);

    // Send to error tracking service if available
    if (window.errorTrackingService) {
}
      try {
}
        window.errorTrackingService.captureUserAction(&apos;performance_metric&apos;, {
}
          metric: metric.name,
          value: metric.value,
          additionalData: metric.additionalData
        });
      } catch (error) {
}
        console.warn(&apos;Failed to send performance metric:&apos;, error);
      }
    }
  }

  public measureComponentRender(componentName: string, startTime: number): void {
}
    const renderTime = performance.now() - startTime;
    this.recordMetric(&apos;component_render_time&apos;, renderTime, {
}
      component: componentName
    });

    // Flag slow component renders
    if (renderTime > 16) { // > 16ms (60fps threshold)
}
      this.recordMetric(&apos;slow_component_render&apos;, renderTime, {
}
        component: componentName
      });
    }
  }

  public measureAsyncOperation(operationName: string, startTime: number, success: boolean = true): void {
}
    const duration = performance.now() - startTime;
    this.recordMetric(`async_operation_${success ? &apos;success&apos; : &apos;failure&apos;}`, duration, {
}
      operation: operationName
    });
  }

  public measureUserInteraction(interactionType: string, startTime: number): void {
}
    const responseTime = performance.now() - startTime;
    this.recordMetric(&apos;user_interaction_response&apos;, responseTime, {
}
      interaction: interactionType
    });
  }

  public getWebVitals(): WebVitals {
}
    return { ...this.webVitals };
  }

  public getMetrics(): PerformanceMetric[] {
}
    return [...this.metrics];
  }

  public getPerformanceScore(): number {
}
    const vitals = this.getWebVitals();
    let score = 100;

    // FCP scoring (Good: <1800ms, Needs Improvement: <3000ms, Poor: ≥3000ms)
    if (vitals.fcp) {
}
      if (vitals.fcp >= 3000) score -= 20;
      else if (vitals.fcp >= 1800) score -= 10;
    }

    // LCP scoring (Good: <2500ms, Needs Improvement: <4000ms, Poor: ≥4000ms)
    if (vitals.lcp) {
}
      if (vitals.lcp >= 4000) score -= 25;
      else if (vitals.lcp >= 2500) score -= 15;
    }

    // FID scoring (Good: <100ms, Needs Improvement: <300ms, Poor: ≥300ms)
    if (vitals.fid) {
}
      if (vitals.fid >= 300) score -= 20;
      else if (vitals.fid >= 100) score -= 10;
    }

    // CLS scoring (Good: <0.1, Needs Improvement: <0.25, Poor: ≥0.25)
    if (vitals.cls) {
}
      if (vitals.cls >= 0.25) score -= 25;
      else if (vitals.cls >= 0.1) score -= 15;
    }

    return Math.max(0, score);
  }

  public generatePerformanceReport(): {
}
    score: number;
    webVitals: WebVitals;
    recommendations: string[];
    metrics: PerformanceMetric[];
  } {
}
    const score = this.getPerformanceScore();
    const recommendations: string[] = [];
    const vitals = this.getWebVitals();

    if (vitals.fcp && vitals.fcp > 1800) {
}
      recommendations.push(&apos;Optimize First Contentful Paint by reducing render-blocking resources&apos;);
    }
    if (vitals.lcp && vitals.lcp > 2500) {
}
      recommendations.push(&apos;Improve Largest Contentful Paint by optimizing critical resource loading&apos;);
    }
    if (vitals.fid && vitals.fid > 100) {
}
      recommendations.push(&apos;Reduce First Input Delay by minimizing main thread blocking&apos;);
    }
    if (vitals.cls && vitals.cls > 0.1) {
}
      recommendations.push(&apos;Minimize Cumulative Layout Shift by specifying image dimensions and avoiding dynamic content insertion&apos;);
    }

    return {
}
      score,
      webVitals: vitals,
      recommendations,
      metrics: this.getMetrics()
    };
  }

  public cleanup(): void {
}
    this.observers.forEach((observer: any) => {
}
      try {
}
        observer.disconnect();
      } catch (error) {
}
        console.warn(&apos;Error disconnecting performance observer:&apos;, error);
      }
    });
    this.observers = [];
    this.metrics = [];
  }
}

// Create global instance
export const performanceService = new PerformanceService();

// Make available globally
if (typeof window !== &apos;undefined&apos;) {
}
  (window as any).performanceService = performanceService;
}

// Clean up on page unload
if (typeof window !== &apos;undefined&apos;) {
}
  window.addEventListener(&apos;beforeunload&apos;, () => {
}
    performanceService.cleanup();
  });
}