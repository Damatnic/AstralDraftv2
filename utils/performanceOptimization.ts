/**
 * EMERGENCY PERFORMANCE OPTIMIZATION MODULE
 * Critical performance enhancements for bundle size and load time reduction
 */

import { lazy, LazyExoticComponent, ComponentType } from 'react';

// Memory leak cleanup utilities
export class MemoryLeakPrevention {
  private static intervals = new Set<NodeJS.Timeout>();
  private static timeouts = new Set<NodeJS.Timeout>();
  private static animationFrames = new Set<number>();
  private static observers = new Set<ResizeObserver | IntersectionObserver | MutationObserver>();
  private static eventListeners = new Map<EventTarget, Map<string, EventListener>>();
  private static websockets = new Set<WebSocket>();

  static registerInterval(id: NodeJS.Timeout): void {
    this.intervals.add(id);
  }

  static registerTimeout(id: NodeJS.Timeout): void {
    this.timeouts.add(id);
  }

  static registerAnimationFrame(id: number): void {
    this.animationFrames.add(id);
  }

  static registerObserver(observer: ResizeObserver | IntersectionObserver | MutationObserver): void {
    this.observers.add(observer);
  }

  static registerWebSocket(ws: WebSocket): void {
    this.websockets.add(ws);
  }

  static addEventListener(target: EventTarget, event: string, listener: EventListener): void {
    if (!this.eventListeners.has(target)) {
      this.eventListeners.set(target, new Map());
    }
    this.eventListeners.get(target)?.set(event, listener);
  }

  static cleanup(): void {
    // Clear all intervals
    this.intervals.forEach(id => clearInterval(id));
    this.intervals.clear();

    // Clear all timeouts
    this.timeouts.forEach(id => clearTimeout(id));
    this.timeouts.clear();

    // Cancel all animation frames
    this.animationFrames.forEach(id => cancelAnimationFrame(id));
    this.animationFrames.clear();

    // Disconnect all observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();

    // Remove all event listeners
    this.eventListeners.forEach((listeners, target) => {
      listeners.forEach((listener, event) => {
        target.removeEventListener(event, listener);
      });
    });
    this.eventListeners.clear();

    // Close all websockets
    this.websockets.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    });
    this.websockets.clear();
  }
}

// Enhanced lazy loading with retry logic and prefetch
export function enhancedLazy<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: {
    prefetch?: boolean;
    retries?: number;
    delay?: number;
  } = {}
): LazyExoticComponent<T> {
  const { prefetch = false, retries = 3, delay = 1000 } = options;

  // Prefetch on idle
  if (prefetch && 'requestIdleCallback' in window) {
    requestIdleCallback(() => {
      importFunc().catch(() => {
        // Silent fail for prefetch
      });
    });
  }

  // Retry logic for lazy loading
  const lazyWithRetry = lazy(() => {
    const retry = async (retriesLeft: number): Promise<{ default: T }> => {
      try {
        return await importFunc();
      } catch (error) {
        if (retriesLeft > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
          return retry(retriesLeft - 1);
        }
        throw error;
      }
    };
    return retry(retries);
  });

  return lazyWithRetry;
}

// Optimized lodash imports
export const optimizedLodash = {
  debounce: () => import('lodash/debounce').then(m => m.default),
  throttle: () => import('lodash/throttle').then(m => m.default),
  cloneDeep: () => import('lodash/cloneDeep').then(m => m.default),
  isEqual: () => import('lodash/isEqual').then(m => m.default),
  merge: () => import('lodash/merge').then(m => m.default),
  uniqBy: () => import('lodash/uniqBy').then(m => m.default),
  sortBy: () => import('lodash/sortBy').then(m => m.default),
  groupBy: () => import('lodash/groupBy').then(m => m.default),
};

// Resource hints for critical assets
export function addResourceHints(): void {
  const head = document.head;

  // Preconnect to critical domains
  const preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://api.stripe.com',
  ];

  preconnectDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    head.appendChild(link);
  });

  // DNS prefetch for non-critical domains
  const dnsPrefetchDomains = [
    'https://www.google-analytics.com',
    'https://stats.g.doubleclick.net',
  ];

  dnsPrefetchDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    head.appendChild(link);
  });

  // Preload critical fonts
  const criticalFonts = [
    '/fonts/inter-var.woff2',
  ];

  criticalFonts.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.href = font;
    link.crossOrigin = 'anonymous';
    head.appendChild(link);
  });
}

// Intersection Observer for lazy loading components
export function createLazyObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.01,
    ...options,
  };

  const observer = new IntersectionObserver(callback, defaultOptions);
  MemoryLeakPrevention.registerObserver(observer);
  return observer;
}

// Optimize images with lazy loading and srcset
export function optimizeImage(src: string, alt: string, sizes?: string): {
  src: string;
  srcSet: string;
  sizes: string;
  alt: string;
  loading: 'lazy' | 'eager';
  decoding: 'async' | 'sync' | 'auto';
} {
  const baseUrl = src.replace(/\.[^.]+$/, '');
  const extension = src.match(/\.[^.]+$/)?.[0] || '.jpg';

  return {
    src,
    srcSet: `
      ${baseUrl}-320w${extension} 320w,
      ${baseUrl}-640w${extension} 640w,
      ${baseUrl}-1024w${extension} 1024w,
      ${baseUrl}-1920w${extension} 1920w
    `,
    sizes: sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    alt,
    loading: 'lazy',
    decoding: 'async',
  };
}

// Performance monitoring with Core Web Vitals
export class CoreWebVitalsMonitor {
  private static metrics = {
    LCP: 0,
    FID: 0,
    CLS: 0,
    FCP: 0,
    TTFB: 0,
  };

  static init(): void {
    if (!('PerformanceObserver' in window)) return;

    // Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.metrics.LCP = lastEntry.renderTime || lastEntry.loadTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      MemoryLeakPrevention.registerObserver(lcpObserver as any);
    } catch (e) {
      // Silent fail
    }

    // First Input Delay
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const firstEntry = entries[0] as any;
        this.metrics.FID = firstEntry.processingStart - firstEntry.startTime;
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      MemoryLeakPrevention.registerObserver(fidObserver as any);
    } catch (e) {
      // Silent fail
    }

    // Cumulative Layout Shift
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.metrics.CLS = clsValue;
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      MemoryLeakPrevention.registerObserver(clsObserver as any);
    } catch (e) {
      // Silent fail
    }

    // First Contentful Paint & Time to First Byte
    if ('performance' in window && 'getEntriesByType' in performance) {
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.FCP = entry.startTime;
        }
      });

      const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navEntries.length > 0) {
        this.metrics.TTFB = navEntries[0].responseStart - navEntries[0].requestStart;
      }
    }
  }

  static getMetrics() {
    return { ...this.metrics };
  }

  static report(): void {
    console.log('Core Web Vitals:', this.metrics);
    
    // Send to analytics
    if ('navigator' in window && 'sendBeacon' in navigator) {
      navigator.sendBeacon('/api/analytics/performance', JSON.stringify(this.metrics));
    }
  }
}

// Request idle callback polyfill
if (!('requestIdleCallback' in window)) {
  (window as any).requestIdleCallback = (callback: IdleRequestCallback) => {
    const start = Date.now();
    return setTimeout(() => {
      callback({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
      } as IdleDeadline);
    }, 1);
  };
}

if (!('cancelIdleCallback' in window)) {
  (window as any).cancelIdleCallback = (id: number) => {
    clearTimeout(id);
  };
}

// Initialize performance optimizations
export function initPerformanceOptimizations(): void {
  // Add resource hints
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addResourceHints);
  } else {
    addResourceHints();
  }

  // Initialize Core Web Vitals monitoring
  CoreWebVitalsMonitor.init();

  // Report metrics on page unload
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      CoreWebVitalsMonitor.report();
    }
  });

  // Cleanup on unload
  window.addEventListener('beforeunload', () => {
    MemoryLeakPrevention.cleanup();
  });
}

// Bundle size analysis helper
export function analyzeBundleSize(): void {
  if (process.env.NODE_ENV === 'production') return;

  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));

  const resources = [
    ...scripts.map(s => ({ url: s.src, type: 'script' })),
    ...styles.map(s => ({ url: (s as HTMLLinkElement).href, type: 'style' })),
  ];

  Promise.all(
    resources.map(async (resource) => {
      try {
        const response = await fetch(resource.url);
        const text = await response.text();
        const size = new TextEncoder().encode(text).length;
        return { ...resource, size };
      } catch {
        return { ...resource, size: 0 };
      }
    })
  ).then(results => {
    const totalSize = results.reduce((acc, r) => acc + r.size, 0);
    console.table(results.sort((a, b) => b.size - a.size));
    console.log(`Total bundle size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  });
}

// Export utilities
export default {
  MemoryLeakPrevention,
  enhancedLazy,
  optimizedLodash,
  addResourceHints,
  createLazyObserver,
  optimizeImage,
  CoreWebVitalsMonitor,
  initPerformanceOptimizations,
  analyzeBundleSize,
};