/**
 * Performance Optimization Component
 * Handles Core Web Vitals monitoring and optimization
 */

import React, { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  FCP: number | null;  // First Contentful Paint
  LCP: number | null;  // Largest Contentful Paint
  FID: number | null;  // First Input Delay
  CLS: number | null;  // Cumulative Layout Shift
  TTFB: number | null; // Time to First Byte
  TTI: number | null;  // Time to Interactive
}

interface PerformanceOptimizerProps {
  enableMonitoring?: boolean;
  reportToAnalytics?: boolean;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

/**
 * Web Vitals measurement utilities
 */
class WebVitalsMonitor {
  private metrics: PerformanceMetrics = {
    FCP: null,
    LCP: null,
    FID: null,
    CLS: null,
    TTFB: null,
    TTI: null
  };

  private callbacks: Set<(metrics: PerformanceMetrics) => void> = new Set();
  private observer: PerformanceObserver | null = null;
  private clsValue = 0;
  private clsEntries: PerformanceEntry[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers(): void {
    // Only run in browser environment
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    try {
      // FCP Observer
      this.observePerformanceEntries(['paint'], (entries) => {
        for (const entry of entries) {
          if (entry.name === 'first-contentful-paint') {
            this.updateMetric('FCP', entry.startTime);
          }
        }
      });

      // LCP Observer
      this.observePerformanceEntries(['largest-contentful-paint'], (entries) => {
        const lastEntry = entries[entries.length - 1];
        this.updateMetric('LCP', lastEntry.startTime);
      });

      // FID Observer
      this.observePerformanceEntries(['first-input'], (entries) => {
        const firstEntry = entries[0];
        const fid = firstEntry.processingStart - firstEntry.startTime;
        this.updateMetric('FID', fid);
      });

      // CLS Observer
      this.observePerformanceEntries(['layout-shift'], (entries) => {
        for (const entry of entries) {
          const layoutShift = entry as any;
          if (!layoutShift.hadRecentInput) {
            this.clsValue += layoutShift.value;
            this.clsEntries.push(entry);
          }
        }
        this.updateMetric('CLS', this.clsValue);
      });

      // TTFB
      this.measureTTFB();

      // TTI (approximation)
      this.estimateTTI();

    } catch (error) {
      console.warn('Performance monitoring not available:', error);
    }
  }

  private observePerformanceEntries(
    entryTypes: string[],
    callback: (entries: PerformanceEntry[]) => void
  ): void {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      observer.observe({ entryTypes });
    } catch (error) {
      // Fallback for older browsers
      console.warn(`Performance observer for ${entryTypes.join(', ')} not supported`);
    }
  }

  private measureTTFB(): void {
    const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navTiming) {
      const ttfb = navTiming.responseStart - navTiming.requestStart;
      this.updateMetric('TTFB', ttfb);
    }
  }

  private estimateTTI(): void {
    // Simple TTI approximation - when page is interactive
    const checkTTI = () => {
      if (document.readyState === 'complete') {
        const tti = performance.now();
        this.updateMetric('TTI', tti);
      } else {
        setTimeout(checkTTI, 100);
      }
    };
    checkTTI();
  }

  private updateMetric(metric: keyof PerformanceMetrics, value: number): void {
    this.metrics[metric] = value;
    this.notifyCallbacks();
  }

  private notifyCallbacks(): void {
    this.callbacks.forEach(callback => callback({ ...this.metrics }));
  }

  public subscribe(callback: (metrics: PerformanceMetrics) => void): () => void {
    this.callbacks.add(callback);
    // Return unsubscribe function
    return () => this.callbacks.delete(callback);
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public getScore(): { score: number; rating: 'good' | 'needs-improvement' | 'poor' } {
    const { FCP, LCP, FID, CLS } = this.metrics;
    
    let score = 0;
    let validMetrics = 0;

    // FCP: Good (< 1.8s), Needs Improvement (1.8s - 3.0s), Poor (> 3.0s)
    if (FCP !== null) {
      validMetrics++;
      if (FCP < 1800) score += 100;
      else if (FCP < 3000) score += 50;
      else score += 0;
    }

    // LCP: Good (< 2.5s), Needs Improvement (2.5s - 4.0s), Poor (> 4.0s)
    if (LCP !== null) {
      validMetrics++;
      if (LCP < 2500) score += 100;
      else if (LCP < 4000) score += 50;
      else score += 0;
    }

    // FID: Good (< 100ms), Needs Improvement (100ms - 300ms), Poor (> 300ms)
    if (FID !== null) {
      validMetrics++;
      if (FID < 100) score += 100;
      else if (FID < 300) score += 50;
      else score += 0;
    }

    // CLS: Good (< 0.1), Needs Improvement (0.1 - 0.25), Poor (> 0.25)
    if (CLS !== null) {
      validMetrics++;
      if (CLS < 0.1) score += 100;
      else if (CLS < 0.25) score += 50;
      else score += 0;
    }

    const averageScore = validMetrics > 0 ? score / validMetrics : 0;
    
    let rating: 'good' | 'needs-improvement' | 'poor';
    if (averageScore >= 75) rating = 'good';
    else if (averageScore >= 50) rating = 'needs-improvement';
    else rating = 'poor';

    return { score: Math.round(averageScore), rating };
  }

  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.callbacks.clear();
  }
}

// Singleton instance
const webVitalsMonitor = new WebVitalsMonitor();

/**
 * Performance optimization hooks and utilities
 */
export const usePerformanceMonitoring = (
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void
) => {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>({
    FCP: null,
    LCP: null,
    FID: null,
    CLS: null,
    TTFB: null,
    TTI: null
  });

  React.useEffect(() => {
    const unsubscribe = webVitalsMonitor.subscribe((newMetrics) => {
      setMetrics(newMetrics);
      onMetricsUpdate?.(newMetrics);
    });

    return unsubscribe;
  }, [onMetricsUpdate]);

  return {
    metrics,
    score: webVitalsMonitor.getScore(),
    getMetrics: () => webVitalsMonitor.getMetrics()
  };
};

/**
 * Resource prioritization utilities
 */
export class ResourcePriorityManager {
  private criticalResources = new Set<string>();
  private prefetchedResources = new Set<string>();

  public markAsCritical(url: string): void {
    this.criticalResources.add(url);
    this.preloadResource(url, 'high');
  }

  public prefetchResource(url: string): void {
    if (this.prefetchedResources.has(url)) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.crossOrigin = 'anonymous';
    
    document.head.appendChild(link);
    this.prefetchedResources.add(url);
  }

  public preloadResource(
    url: string, 
    priority: 'high' | 'low' = 'low',
    as: 'script' | 'style' | 'image' | 'font' = 'script'
  ): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = as;
    link.crossOrigin = 'anonymous';
    
    if (priority === 'high') {
      link.setAttribute('importance', 'high');
    }
    
    document.head.appendChild(link);
  }

  public preconnect(origin: string): void {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    
    document.head.appendChild(link);
  }
}

// Singleton instance
export const resourceManager = new ResourcePriorityManager();

/**
 * Core Web Vitals optimization component
 */
const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({
  enableMonitoring = true,
  reportToAnalytics = false,
  onMetricsUpdate
}) => {
  const performanceRef = useRef<HTMLDivElement>(null);

  const { metrics, score } = usePerformanceMonitoring(onMetricsUpdate);

  // Report to analytics if enabled
  useEffect(() => {
    if (reportToAnalytics && metrics.LCP && metrics.FCP) {
      // Report to your analytics service
      if (typeof gtag !== 'undefined') {
        gtag('event', 'web_vitals', {
          custom_parameter_1: 'core_web_vitals',
          metric_name: 'performance_score',
          metric_value: score.score,
          metric_rating: score.rating
        });
      }
    }
  }, [metrics, score, reportToAnalytics]);

  // Optimize images based on viewport
  useEffect(() => {
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              const src = img.dataset.src;
              if (src) {
                img.src = src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
              }
            }
          });
        },
        { rootMargin: '50px' }
      );

      images.forEach(img => imageObserver.observe(img));
    };

    if (enableMonitoring) {
      optimizeImages();
    }
  }, [enableMonitoring]);

  // Preload critical resources
  useEffect(() => {
    // Preload next likely navigation targets
    resourceManager.prefetchResource('/api/players');
    resourceManager.prefetchResource('/api/league');
    
    // Preconnect to external services
    resourceManager.preconnect('https://fonts.googleapis.com');
    resourceManager.preconnect('https://api.sportsdata.io');
  }, []);

  // Monitor long tasks
  useEffect(() => {
    if (!enableMonitoring || !('PerformanceObserver' in window)) return;

    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.warn('Long task detected:', {
            duration: entry.duration,
            startTime: entry.startTime,
            name: entry.name
          });
        }
      }
    });

    try {
      longTaskObserver.observe({ entryTypes: ['longtask'] });
    } catch (error) {
      // Long task API not supported
    }

    return () => longTaskObserver?.disconnect();
  }, [enableMonitoring]);

  // Development mode performance warnings
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && enableMonitoring) {
      const { FCP, LCP, CLS, FID } = metrics;
      
      if (FCP && FCP > 3000) {
        console.warn(`⚠️ Slow FCP: ${FCP.toFixed(2)}ms (target: <1800ms)`);
      }
      
      if (LCP && LCP > 4000) {
        console.warn(`⚠️ Slow LCP: ${LCP.toFixed(2)}ms (target: <2500ms)`);
      }
      
      if (CLS && CLS > 0.25) {
        console.warn(`⚠️ High CLS: ${CLS.toFixed(3)} (target: <0.1)`);
      }
      
      if (FID && FID > 300) {
        console.warn(`⚠️ Slow FID: ${FID.toFixed(2)}ms (target: <100ms)`);
      }
    }
  }, [metrics, enableMonitoring]);

  if (!enableMonitoring) {
    return null;
  }

  return (
    <div ref={performanceRef} style={{ display: 'none' }}>
      {/* Hidden performance monitoring component */}
      <div data-testid="performance-monitor" />
    </div>
  );
};

export default PerformanceOptimizer;