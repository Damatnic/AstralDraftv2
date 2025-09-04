/**
 * Performance Monitoring Service
 * Tracks Web Vitals, bundle performance, and user experience metrics
 */

interface PerformanceMetrics {
  // Core Web Vitals
  fcp?: number;  // First Contentful Paint
  lcp?: number;  // Largest Contentful Paint  
  fid?: number;  // First Input Delay
  cls?: number;  // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
  
  // Custom metrics
  bundleSize?: number;
  loadTime?: number;
  renderTime?: number;
  interactionTime?: number;
  memoryUsage?: number;
  
  // Context
  timestamp: number;
  userAgent: string;
  connectionType?: string;
  viewportSize: { width: number; height: number };
  route: string;
}

interface PerformanceBudget {
  fcp: number;      // < 1.8s (good)
  lcp: number;      // < 2.5s (good)  
  fid: number;      // < 100ms (good)
  cls: number;      // < 0.1 (good)
  ttfb: number;     // < 600ms (good)
  bundleSize: number; // < 200KB (target)
}

class PerformanceService {
  private metrics: PerformanceMetrics[] = [];
  private observer: PerformanceObserver | null = null;
  private isMonitoring = false;
  
  // Performance budgets (thresholds)
  private budget: PerformanceBudget = {
    fcp: 1800,      // 1.8s
    lcp: 2500,      // 2.5s
    fid: 100,       // 100ms
    cls: 0.1,       // 0.1
    ttfb: 600,      // 600ms
    bundleSize: 204800 // 200KB
  };

  /**
   * Initialize performance monitoring
   */
  initialize(): void {
    if (typeof window === 'undefined' || this.isMonitoring) return;

    this.isMonitoring = true;
    this.setupWebVitalsTracking();
    this.setupCustomTracking();
    this.setupMemoryTracking();
    this.setupNavigationTracking();

    console.log('🚀 Performance monitoring initialized');
  }

  /**
   * Track Core Web Vitals using PerformanceObserver
   */
  private setupWebVitalsTracking(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      // Track FCP (First Contentful Paint)
      this.observeMetric('paint', (entries) => {
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          this.recordMetric('fcp', fcpEntry.startTime);
        }
      });

      // Track LCP (Largest Contentful Paint)
      this.observeMetric('largest-contentful-paint', (entries) => {
        const lcpEntry = entries[entries.length - 1];
        if (lcpEntry) {
          this.recordMetric('lcp', lcpEntry.startTime);
        }
      });

      // Track FID (First Input Delay)
      this.observeMetric('first-input', (entries) => {
        const fidEntry = entries[0];
        if (fidEntry) {
          this.recordMetric('fid', fidEntry.processingStart - fidEntry.startTime);
        }
      });

      // Track CLS (Cumulative Layout Shift)
      let clsValue = 0;
      this.observeMetric('layout-shift', (entries) => {
        for (const entry of entries) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        this.recordMetric('cls', clsValue);
      });

    } catch (error) {
      console.warn('Failed to setup Web Vitals tracking:', error);
    }
  }

  /**
   * Setup custom performance tracking
   */
  private setupCustomTracking(): void {
    // Track page load time
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.recordMetric('loadTime', navigation.loadEventEnd - navigation.fetchStart);
        this.recordMetric('ttfb', navigation.responseStart - navigation.fetchStart);
      }

      // Track bundle size from resource timing
      this.trackBundleSize();
    });

    // Track route changes (for SPAs)
    this.trackRouteChanges();
  }

  /**
   * Track memory usage
   */
  private setupMemoryTracking(): void {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.recordMetric('memoryUsage', memory.usedJSHeapSize / 1024 / 1024); // MB
      }, 30000); // Every 30 seconds
    }
  }

  /**
   * Track navigation timing
   */
  private setupNavigationTracking(): void {
    // Track initial page load
    if (document.readyState === 'complete') {
      this.recordNavigationMetrics();
    } else {
      window.addEventListener('load', () => this.recordNavigationMetrics());
    }
  }

  /**
   * Helper to observe performance metrics
   */
  private observeMetric(type: string, callback: (entries: PerformanceEntry[]) => void): void {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      observer.observe({ type, buffered: true });
    } catch (error) {
      console.warn(`Failed to observe ${type}:`, error);
    }
  }

  /**
   * Record a performance metric
   */
  private recordMetric(name: keyof PerformanceMetrics, value: number): void {
    const currentRoute = window.location.pathname;
    const timestamp = Date.now();

    // Update or create metrics entry
    let currentMetrics = this.metrics.find(m => 
      m.route === currentRoute && 
      Math.abs(m.timestamp - timestamp) < 5000 // Within 5 seconds
    );

    if (!currentMetrics) {
      currentMetrics = {
        timestamp,
        userAgent: navigator.userAgent,
        connectionType: this.getConnectionType(),
        viewportSize: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        route: currentRoute
      };
      this.metrics.push(currentMetrics);
    }

    currentMetrics[name] = value;

    // Check performance budget
    this.checkPerformanceBudget(name, value);

    console.log(`📊 Performance: ${name} = ${value.toFixed(2)}${this.getUnit(name)}`);
  }

  /**
   * Track bundle size from resource timing
   */
  private trackBundleSize(): void {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    let totalSize = 0;

    resources.forEach(resource => {
      if (resource.name.includes('.js') || resource.name.includes('.css')) {
        totalSize += resource.transferSize || 0;
      }
    });

    if (totalSize > 0) {
      this.recordMetric('bundleSize', totalSize);
    }
  }

  /**
   * Track route changes for SPA navigation
   */
  private trackRouteChanges(): void {
    let currentPath = window.location.pathname;
    
    const checkForRouteChange = () => {
      if (window.location.pathname !== currentPath) {
        currentPath = window.location.pathname;
        this.recordRouteChange(currentPath);
      }
    };

    // Check for route changes
    window.addEventListener('popstate', checkForRouteChange);
    
    // Override pushState/replaceState for React Router
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      setTimeout(checkForRouteChange, 0);
    };

    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      setTimeout(checkForRouteChange, 0);
    };
  }

  /**
   * Record navigation metrics
   */
  private recordNavigationMetrics(): void {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      this.recordMetric('renderTime', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
    }
  }

  /**
   * Record route change
   */
  private recordRouteChange(route: string): void {
    const startTime = performance.now();
    
    // Measure time until next paint
    requestAnimationFrame(() => {
      const endTime = performance.now();
      this.recordMetric('interactionTime', endTime - startTime);
    });
  }

  /**
   * Check if metrics exceed performance budget
   */
  private checkPerformanceBudget(metric: keyof PerformanceMetrics, value: number): void {
    const budgetValue = this.budget[metric as keyof PerformanceBudget];
    if (budgetValue && value > budgetValue) {
      console.warn(`⚠️ Performance Budget Exceeded: ${metric} = ${value.toFixed(2)} (budget: ${budgetValue})`);
      
      // Could send to monitoring service here
      this.reportPerformanceIssue(metric, value, budgetValue);
    }
  }

  /**
   * Get connection type
   */
  private getConnectionType(): string {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    return connection ? connection.effectiveType || connection.type : 'unknown';
  }

  /**
   * Get unit for metric
   */
  private getUnit(metric: keyof PerformanceMetrics): string {
    switch (metric) {
      case 'fcp':
      case 'lcp':
      case 'fid':
      case 'ttfb':
      case 'loadTime':
      case 'renderTime':
      case 'interactionTime':
        return 'ms';
      case 'cls':
        return '';
      case 'bundleSize':
        return 'bytes';
      case 'memoryUsage':
        return 'MB';
      default:
        return '';
    }
  }

  /**
   * Report performance issue
   */
  private reportPerformanceIssue(metric: string, value: number, budget: number): void {
    // In a real app, you'd send this to your monitoring service
    console.error(`Performance Issue: ${metric} exceeded budget by ${((value / budget - 1) * 100).toFixed(1)}%`);
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): any {
    const latest = this.metrics[this.metrics.length - 1];
    if (!latest) return null;

    return {
      webVitals: {
        fcp: { value: latest.fcp, budget: this.budget.fcp, status: this.getStatus('fcp', latest.fcp) },
        lcp: { value: latest.lcp, budget: this.budget.lcp, status: this.getStatus('lcp', latest.lcp) },
        fid: { value: latest.fid, budget: this.budget.fid, status: this.getStatus('fid', latest.fid) },
        cls: { value: latest.cls, budget: this.budget.cls, status: this.getStatus('cls', latest.cls) }
      },
      customMetrics: {
        loadTime: latest.loadTime,
        bundleSize: latest.bundleSize,
        memoryUsage: latest.memoryUsage
      },
      context: {
        route: latest.route,
        viewport: latest.viewportSize,
        connection: latest.connectionType
      }
    };
  }

  /**
   * Get status for metric
   */
  private getStatus(metric: keyof PerformanceBudget, value?: number): 'good' | 'needs-improvement' | 'poor' {
    if (!value) return 'poor';
    
    const budget = this.budget[metric];
    const goodThreshold = budget * 0.75;
    
    if (value <= goodThreshold) return 'good';
    if (value <= budget) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Clear metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.isMonitoring = false;
    console.log('🛑 Performance monitoring stopped');
  }
}

// Export singleton instance
export const performanceService = new PerformanceService();
export default performanceService;