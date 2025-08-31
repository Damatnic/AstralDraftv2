/**
 * Performance Optimizer - Enterprise-Grade Performance Enhancement System
 * Implements comprehensive performance optimizations for the fantasy football platform
 */

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  cls: number; // Cumulative Layout Shift
  tbt: number; // Total Blocking Time
  fid: number; // First Input Delay
}

interface OptimizationConfig {
  enableLazyLoading: boolean;
  enableImageOptimization: boolean;
  enableServiceWorker: boolean;
  enableVirtualization: boolean;
  enableBundleOptimization: boolean;
  enableMemoryOptimization: boolean;
}

class PerformanceOptimizer {
  private config: OptimizationConfig;
  private observer: IntersectionObserver | null = null;
  private performanceEntries: PerformanceEntry[] = [];
  private memoryCleanupInterval: number | null = null;

  constructor(config: Partial<OptimizationConfig> = {}) {
    this.config = {
      enableLazyLoading: true,
      enableImageOptimization: true,
      enableServiceWorker: true,
      enableVirtualization: true,
      enableBundleOptimization: true,
      enableMemoryOptimization: true,
      ...config
    };

    this.initializeOptimizations();
  }

  private initializeOptimizations() {
    if (typeof window !== 'undefined') {
      this.setupLazyLoading();
      this.setupImageOptimization();
      this.setupMemoryOptimization();
      this.setupPerformanceMonitoring();
      this.preloadCriticalResources();
    }
  }

  private setupLazyLoading() {
    if (!this.config.enableLazyLoading || !('IntersectionObserver' in window)) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          
          // Handle lazy-loaded images
          if (target.tagName === 'IMG') {
            const img = target as HTMLImageElement;
            const src = img.dataset.src;
            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
              this.observer?.unobserve(img);
            }
          }
          
          // Handle lazy-loaded components
          if (target.dataset.lazyComponent) {
            const componentName = target.dataset.lazyComponent;
            this.loadComponent(componentName, target);
          }
        }
      });
    }, {
      rootMargin: '50px',
      threshold: 0.1
    });

    // Observe existing lazy elements
    document.querySelectorAll('[data-src], [data-lazy-component]').forEach((el) => {
      this.observer?.observe(el);
    });
  }

  private setupImageOptimization() {
    if (!this.config.enableImageOptimization) return;

    // Convert images to modern formats and optimize loading
    document.querySelectorAll('img').forEach((img) => {
      this.optimizeImage(img);
    });

    // Set up responsive images
    this.setupResponsiveImages();
  }

  private optimizeImage(img: HTMLImageElement) {
    // Add loading="lazy" for images below the fold
    if (!img.hasAttribute('loading')) {
      const rect = img.getBoundingClientRect();
      if (rect.top > window.innerHeight) {
        img.loading = 'lazy';
      }
    }

    // Add proper sizing attributes
    if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
      img.addEventListener('load', () => {
        if (!img.hasAttribute('width')) img.setAttribute('width', img.naturalWidth.toString());
        if (!img.hasAttribute('height')) img.setAttribute('height', img.naturalHeight.toString());
      }, { once: true });
    }
  }

  private setupResponsiveImages() {
    // Create WebP/AVIF sources for better compression
    document.querySelectorAll('img[data-responsive]').forEach((img) => {
      this.createResponsiveImage(img as HTMLImageElement);
    });
  }

  private createResponsiveImage(img: HTMLImageElement) {
    const picture = document.createElement('picture');
    const src = img.src || img.dataset.src || '';
    const baseName = src.split('.').slice(0, -1).join('.');
    
    // Add WebP source
    const webpSource = document.createElement('source');
    webpSource.srcset = `${baseName}.webp`;
    webpSource.type = 'image/webp';
    
    // Add AVIF source (if supported)
    if (this.supportsAVIF()) {
      const avifSource = document.createElement('source');
      avifSource.srcset = `${baseName}.avif`;
      avifSource.type = 'image/avif';
      picture.appendChild(avifSource);
    }
    
    picture.appendChild(webpSource);
    picture.appendChild(img.cloneNode(true));
    
    img.parentNode?.replaceChild(picture, img);
  }

  private supportsAVIF(): boolean {
    return new Promise<boolean>((resolve) => {
      const avif = new Image();
      avif.onload = avif.onerror = () => resolve(avif.height === 2);
      avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
    }) as any;
  }

  private setupMemoryOptimization() {
    if (!this.config.enableMemoryOptimization) return;

    // Clean up memory every 30 seconds
    this.memoryCleanupInterval = window.setInterval(() => {
      this.performMemoryCleanup();
    }, 30000);

    // Clean up on page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.performMemoryCleanup();
      }
    });
  }

  private performMemoryCleanup() {
    // Clear unused images from memory
    document.querySelectorAll('img').forEach((img) => {
      const rect = img.getBoundingClientRect();
      if (rect.top > window.innerHeight * 2 || rect.bottom < -window.innerHeight) {
        // Image is far from viewport, clear its data
        if (img.src && !img.src.startsWith('data:')) {
          img.dataset.originalSrc = img.src;
          img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InRyYW5zcGFyZW50Ii8+PC9zdmc+';
        }
      }
    });

    // Force garbage collection if available
    if ('gc' in window && typeof (window as any).gc === 'function') {
      (window as any).gc();
    }
  }

  private setupPerformanceMonitoring() {
    // Monitor Core Web Vitals
    this.observeCLS();
    this.observeLCP();
    this.observeFID();
    this.observeFCP();

    // Monitor resource loading
    this.monitorResourcePerformance();
  }

  private observeCLS() {
    if ('LayoutShiftList' in window) {
      new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        this.reportMetric('CLS', clsValue);
      }).observe({ type: 'layout-shift', buffered: true });
    }
  }

  private observeLCP() {
    if ('LargestContentfulPaint' in window) {
      new PerformanceObserver((list) => {
        const entries = list.getEntries() as any[];
        const lastEntry = entries[entries.length - 1];
        this.reportMetric('LCP', lastEntry.startTime);
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    }
  }

  private observeFID() {
    if ('FirstInputDelay' in window) {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          this.reportMetric('FID', entry.processingStart - entry.startTime);
        }
      }).observe({ type: 'first-input', buffered: true });
    }
  }

  private observeFCP() {
    if ('PerformancePaintTiming' in window) {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.reportMetric('FCP', entry.startTime);
          }
        }
      }).observe({ type: 'paint', buffered: true });
    }
  }

  private monitorResourcePerformance() {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource') {
          const resource = entry as PerformanceResourceTiming;
          this.analyzeResourcePerformance(resource);
        }
      }
    }).observe({ type: 'resource', buffered: true });
  }

  private analyzeResourcePerformance(resource: PerformanceResourceTiming) {
    const duration = resource.responseEnd - resource.requestStart;
    
    // Flag slow resources
    if (duration > 1000) {
      console.warn(`Slow resource detected: ${resource.name} (${duration.toFixed(2)}ms)`);
    }

    // Analyze resource types
    if (resource.name.includes('.js')) {
      this.reportMetric('JS_LOAD_TIME', duration);
    } else if (resource.name.includes('.css')) {
      this.reportMetric('CSS_LOAD_TIME', duration);
    }
  }

  private preloadCriticalResources() {
    // Preload critical CSS
    this.preloadResource('/assets/critical.css', 'style');
    
    // Preload critical fonts
    this.preloadResource('/assets/fonts/primary.woff2', 'font', 'font/woff2');
    
    // Preconnect to external domains
    this.preconnectToDomain('https://api.sportsdata.io');
    this.preconnectToDomain('https://cdnjs.cloudflare.com');
  }

  private preloadResource(href: string, as: string, type?: string) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    document.head.appendChild(link);
  }

  private preconnectToDomain(domain: string) {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    document.head.appendChild(link);
  }

  private async loadComponent(componentName: string, target: HTMLElement) {
    try {
      // Dynamic import for component
      const module = await import(`../components/${componentName}`);
      const Component = module.default || module[componentName];
      
      // This would integrate with your React rendering system
      // For now, just mark as loaded
      target.setAttribute('data-loaded', 'true');
    } catch (error) {
      console.error(`Failed to load component: ${componentName}`, error);
    }
  }

  private reportMetric(name: string, value: number) {
    // Report to analytics service
    if (window.gtag) {
      window.gtag('event', 'web_vital', {
        name,
        value: Math.round(value),
        event_category: 'performance'
      });
    }

    // Store locally for debugging
    if (import.meta.env.DEV) {
      console.log(`Performance Metric - ${name}: ${value.toFixed(2)}ms`);
    }
  }

  // Public API methods
  public updateConfig(newConfig: Partial<OptimizationConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  public getPerformanceMetrics(): PerformanceMetrics {
    return {
      fcp: this.getMetric('first-contentful-paint'),
      lcp: this.getMetric('largest-contentful-paint'),
      cls: this.getMetric('cumulative-layout-shift'),
      tbt: this.calculateTBT(),
      fid: this.getMetric('first-input-delay')
    };
  }

  private getMetric(name: string): number {
    const entries = performance.getEntriesByName(name);
    return entries.length > 0 ? entries[0].startTime : 0;
  }

  private calculateTBT(): number {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigationEntry) return 0;

    const fcp = this.getMetric('first-contentful-paint');
    const tti = navigationEntry.domInteractive;
    
    // Simplified TBT calculation
    return Math.max(0, tti - fcp - 50);
  }

  public optimizeForMobile() {
    // Mobile-specific optimizations
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
        this.enableDataSaverMode();
      }
    }

    // Reduce animation complexity on mobile
    if (window.innerWidth <= 768) {
      document.documentElement.style.setProperty('--animation-duration', '0.2s');
      document.documentElement.style.setProperty('--transition-duration', '0.1s');
    }
  }

  private enableDataSaverMode() {
    // Disable non-critical images
    document.querySelectorAll('img[data-critical="false"]').forEach((img) => {
      (img as HTMLImageElement).style.display = 'none';
    });

    // Reduce animation complexity
    document.documentElement.style.setProperty('--enable-animations', '0');
  }

  public destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    if (this.memoryCleanupInterval) {
      clearInterval(this.memoryCleanupInterval);
      this.memoryCleanupInterval = null;
    }
  }
}

// Global instance
export const performanceOptimizer = new PerformanceOptimizer();

// Performance monitoring utilities
export class WebVitalsMonitor {
  private metrics: Map<string, number> = new Map();

  constructor() {
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    // Monitor all Core Web Vitals
    this.monitorCLS();
    this.monitorLCP();
    this.monitorFID();
    this.monitorTTFB();
  }

  private monitorCLS() {
    let clsValue = 0;
    let sessionValue = 0;
    let sessionEntries: any[] = [];

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          const firstSessionEntry = sessionEntries[0];
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

          if (!firstSessionEntry || entry.startTime - lastSessionEntry.startTime > 5000) {
            firstSessionEntry && this.reportMetric('CLS', sessionValue);
            sessionEntries = [entry];
            sessionValue = entry.value;
          } else {
            sessionEntries.push(entry);
            sessionValue += entry.value;
          }

          if (sessionValue > clsValue) {
            clsValue = sessionValue;
            this.metrics.set('CLS', clsValue);
          }
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });
  }

  private monitorLCP() {
    new PerformanceObserver((list) => {
      const entries = list.getEntries() as any[];
      const lastEntry = entries[entries.length - 1];
      this.metrics.set('LCP', lastEntry.startTime);
      this.reportMetric('LCP', lastEntry.startTime);
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  }

  private monitorFID() {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        const fid = entry.processingStart - entry.startTime;
        this.metrics.set('FID', fid);
        this.reportMetric('FID', fid);
      }
    }).observe({ type: 'first-input', buffered: true });
  }

  private monitorTTFB() {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const nav = entry as PerformanceNavigationTiming;
          const ttfb = nav.responseStart - nav.requestStart;
          this.metrics.set('TTFB', ttfb);
          this.reportMetric('TTFB', ttfb);
        }
      }
    }).observe({ type: 'navigation', buffered: true });
  }

  private reportMetric(name: string, value: number) {
    // Send to analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'web_vital', {
        name,
        value: Math.round(value),
        event_category: 'performance'
      });
    }

    // Log in development
    if (import.meta.env.DEV) {
      console.log(`Web Vital - ${name}: ${value.toFixed(2)}ms`);
    }
  }

  public getMetrics(): Map<string, number> {
    return new Map(this.metrics);
  }

  public getMetric(name: string): number | undefined {
    return this.metrics.get(name);
  }
}

export const webVitalsMonitor = new WebVitalsMonitor();