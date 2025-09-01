/**
 * Performance Monitoring Service
 * Tracks Web Vitals, resource loading, and user experience metrics
 */

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  sessionId: string;
  additionalData?: Record<string, unknown>;
}

interface WebVitals {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

interface ResourceTiming {
  name: string;
  duration: number;
  size?: number;
  type: 'script' | 'stylesheet' | 'image' | 'fetch' | 'other';
}

class PerformanceService {
  private metrics: PerformanceMetric[] = [];
  private sessionId: string;
  private webVitals: WebVitals = {};
  private observers: PerformanceObserver[] = [];
  private isEnabled: boolean;

  constructor() {
    this.sessionId = `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.isEnabled = this.shouldEnablePerformanceMonitoring();
    
    if (this.isEnabled) {
      this.initializePerformanceMonitoring();
    }
  }

  private shouldEnablePerformanceMonitoring(): boolean {
    // Enable in production or when explicitly requested
    return import.meta.env.PROD || 
           import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true' ||
           localStorage.getItem('enable_performance_monitoring') === 'true';
  }

  private initializePerformanceMonitoring(): void {
    if (!('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver not supported');
      return;
    }

    this.setupWebVitalsObservers();
    this.setupResourceTimingObserver();
    this.setupNavigationTimingObserver();
    this.setupLongTaskObserver();

    // Track initial page load
    if (document.readyState === 'complete') {
      this.measureInitialPageLoad();
    } else {
      window.addEventListener('load', () => this.measureInitialPageLoad());
    }
  }

  private setupWebVitalsObservers(): void {
    try {
      // First Contentful Paint
      const paintObserver = new PerformanceObserver((list: any) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.webVitals.fcp = entry.startTime;
            this.recordMetric('web_vitals_fcp', entry.startTime);
          }
        }
      });
      paintObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(paintObserver);

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list: any) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.webVitals.lcp = lastEntry.startTime;
        this.recordMetric('web_vitals_lcp', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // First Input Delay
      const fidObserver = new PerformanceObserver((list: any) => {
        for (const entry of list.getEntries()) {
          const fid = (entry as any).processingStart - entry.startTime;
          this.webVitals.fid = fid;
          this.recordMetric('web_vitals_fid', fid);
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list: any) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        this.webVitals.cls = clsValue;
        this.recordMetric('web_vitals_cls', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);

    } catch (error) {
      console.warn('Failed to setup Web Vitals observers:', error);
    }
  }

  private setupResourceTimingObserver(): void {
    try {
      const resourceObserver = new PerformanceObserver((list: any) => {
        for (const entry of list.getEntries()) {
          this.analyzeResourceTiming(entry as PerformanceResourceTiming);
        }
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);
    } catch (error) {
      console.warn('Failed to setup resource timing observer:', error);
    }
  }

  private setupNavigationTimingObserver(): void {
    try {
      const navObserver = new PerformanceObserver((list: any) => {
        for (const entry of list.getEntries()) {
          this.analyzeNavigationTiming(entry as PerformanceNavigationTiming);
        }
      });
      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navObserver);
    } catch (error) {
      console.warn('Failed to setup navigation timing observer:', error);
    }
  }

  private setupLongTaskObserver(): void {
    try {
      const longTaskObserver = new PerformanceObserver((list: any) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('long_task', entry.duration, {
            startTime: entry.startTime,
            attribution: (entry as any).attribution
          });
        }
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.push(longTaskObserver);
    } catch (error) {
      console.warn('Failed to setup long task observer:', error);
    }
  }

  private analyzeResourceTiming(entry: PerformanceResourceTiming): void {
    const resourceTiming: ResourceTiming = {
      name: entry.name,
      duration: entry.duration,
      size: entry.transferSize || undefined,
      type: this.getResourceType(entry.name, entry.initiatorType)
    };

    // Flag slow resources
    if (entry.duration > 1000) { // > 1 second
      this.recordMetric('slow_resource', entry.duration, {
        resource: resourceTiming,
        url: entry.name
      });
    }

    // Flag large resources
    if (entry.transferSize && entry.transferSize > 100 * 1024) { // > 100KB
      this.recordMetric('large_resource', entry.transferSize, {
        resource: resourceTiming,
        url: entry.name
      });
    }
  }

  private analyzeNavigationTiming(entry: PerformanceNavigationTiming): void {
    const ttfb = entry.responseStart - entry.requestStart;
    this.webVitals.ttfb = ttfb;
    
    this.recordMetric('navigation_ttfb', ttfb);
    this.recordMetric('navigation_dom_content_loaded', entry.domContentLoadedEventEnd - entry.navigationStart);
    this.recordMetric('navigation_load_complete', entry.loadEventEnd - entry.navigationStart);
  }

  private getResourceType(name: string, initiatorType: string): ResourceTiming['type'] {
    if (name.includes('.js') || initiatorType === 'script') return 'script';
    if (name.includes('.css') || initiatorType === 'css') return 'stylesheet';
    if (name.match(/\.(jpg|jpeg|png|gif|svg|webp)/) || initiatorType === 'img') return 'image';
    if (initiatorType === 'fetch' || initiatorType === 'xmlhttprequest') return 'fetch';
    return 'other';
  }

  private measureInitialPageLoad(): void {
    if (!performance.timing) return;

    const timing = performance.timing;
    const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
    const domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart;

    this.recordMetric('page_load_time', pageLoadTime);
    this.recordMetric('dom_ready_time', domReadyTime);
  }

  public recordMetric(name: string, value: number, additionalData?: Record<string, unknown>): void {
    if (!this.isEnabled) return;

    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      additionalData
    };

    this.metrics.push(metric);

    // Send to error tracking service if available
    if (window.errorTrackingService) {
      try {
        window.errorTrackingService.captureUserAction('performance_metric', {
          metric: metric.name,
          value: metric.value,
          additionalData: metric.additionalData
        });
      } catch (error) {
        console.warn('Failed to send performance metric:', error);
      }
    }
  }

  public measureComponentRender(componentName: string, startTime: number): void {
    const renderTime = performance.now() - startTime;
    this.recordMetric('component_render_time', renderTime, {
      component: componentName
    });

    // Flag slow component renders
    if (renderTime > 16) { // > 16ms (60fps threshold)
      this.recordMetric('slow_component_render', renderTime, {
        component: componentName
      });
    }
  }

  public measureAsyncOperation(operationName: string, startTime: number, success: boolean = true): void {
    const duration = performance.now() - startTime;
    this.recordMetric(`async_operation_${success ? 'success' : 'failure'}`, duration, {
      operation: operationName
    });
  }

  public measureUserInteraction(interactionType: string, startTime: number): void {
    const responseTime = performance.now() - startTime;
    this.recordMetric('user_interaction_response', responseTime, {
      interaction: interactionType
    });
  }

  public getWebVitals(): WebVitals {
    return { ...this.webVitals };
  }

  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  public getPerformanceScore(): number {
    const vitals = this.getWebVitals();
    let score = 100;

    // FCP scoring (Good: <1800ms, Needs Improvement: <3000ms, Poor: ≥3000ms)
    if (vitals.fcp) {
      if (vitals.fcp >= 3000) score -= 20;
      else if (vitals.fcp >= 1800) score -= 10;
    }

    // LCP scoring (Good: <2500ms, Needs Improvement: <4000ms, Poor: ≥4000ms)
    if (vitals.lcp) {
      if (vitals.lcp >= 4000) score -= 25;
      else if (vitals.lcp >= 2500) score -= 15;
    }

    // FID scoring (Good: <100ms, Needs Improvement: <300ms, Poor: ≥300ms)
    if (vitals.fid) {
      if (vitals.fid >= 300) score -= 20;
      else if (vitals.fid >= 100) score -= 10;
    }

    // CLS scoring (Good: <0.1, Needs Improvement: <0.25, Poor: ≥0.25)
    if (vitals.cls) {
      if (vitals.cls >= 0.25) score -= 25;
      else if (vitals.cls >= 0.1) score -= 15;
    }

    return Math.max(0, score);
  }

  public generatePerformanceReport(): {
    score: number;
    webVitals: WebVitals;
    recommendations: string[];
    metrics: PerformanceMetric[];
  } {
    const score = this.getPerformanceScore();
    const recommendations: string[] = [];
    const vitals = this.getWebVitals();

    if (vitals.fcp && vitals.fcp > 1800) {
      recommendations.push('Optimize First Contentful Paint by reducing render-blocking resources');
    }
    if (vitals.lcp && vitals.lcp > 2500) {
      recommendations.push('Improve Largest Contentful Paint by optimizing critical resource loading');
    }
    if (vitals.fid && vitals.fid > 100) {
      recommendations.push('Reduce First Input Delay by minimizing main thread blocking');
    }
    if (vitals.cls && vitals.cls > 0.1) {
      recommendations.push('Minimize Cumulative Layout Shift by specifying image dimensions and avoiding dynamic content insertion');
    }

    return {
      score,
      webVitals: vitals,
      recommendations,
      metrics: this.getMetrics()
    };
  }

  public cleanup(): void {
    this.observers.forEach((observer: any) => {
      try {
        observer.disconnect();
      } catch (error) {
        console.warn('Error disconnecting performance observer:', error);
      }
    });
    this.observers = [];
    this.metrics = [];
  }
}

// Create global instance
export const performanceService = new PerformanceService();

// Make available globally
if (typeof window !== 'undefined') {
  (window as any).performanceService = performanceService;
}

// Clean up on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    performanceService.cleanup();
  });
}