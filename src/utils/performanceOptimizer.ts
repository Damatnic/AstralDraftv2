/**
 * Performance Optimizer - Enterprise-Grade Performance Enhancement System
 * Implements comprehensive performance optimizations for the fantasy football platform
 */

interface PerformanceMetrics {
}
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  cls: number; // Cumulative Layout Shift
  tbt: number; // Total Blocking Time
  fid: number; // First Input Delay
}

interface OptimizationConfig {
}
  enableLazyLoading: boolean;
  enableImageOptimization: boolean;
  enableServiceWorker: boolean;
  enableVirtualization: boolean;
  enableBundleOptimization: boolean;
  enableMemoryOptimization: boolean;
}

class PerformanceOptimizer {
}
  private config: OptimizationConfig;
  private observer: IntersectionObserver | null = null;
  private performanceEntries: PerformanceEntry[] = [];
  private memoryCleanupInterval: number | null = null;

  constructor(config: Partial<OptimizationConfig> = {}) {
}
    this.config = {
}
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
}
    if (typeof window !== &apos;undefined&apos;) {
}
      this.setupLazyLoading();
      this.setupImageOptimization();
      this.setupMemoryOptimization();
      this.setupPerformanceMonitoring();
      this.preloadCriticalResources();
    }
  }

  private setupLazyLoading() {
}
    if (!this.config.enableLazyLoading || !(&apos;IntersectionObserver&apos; in window)) return;

    this.observer = new IntersectionObserver((entries: any) => {
}
      entries.forEach((entry: any) => {
}
        if (entry.isIntersecting) {
}
          const target = entry.target as HTMLElement;
          
          // Handle lazy-loaded images
          if (target.tagName === &apos;IMG&apos;) {
}
            const img = target as HTMLImageElement;
            const src = img.dataset.src;
            if (src) {
}
              img.src = src;
              img.removeAttribute(&apos;data-src&apos;);
              this.observer?.unobserve(img);
            }
          }
          
          // Handle lazy-loaded components
          if (target.dataset.lazyComponent) {
}
            const componentName = target.dataset.lazyComponent;
            this.loadComponent(componentName, target);
          }
        }
      });
    }, {
}
      rootMargin: &apos;50px&apos;,
      threshold: 0.1
    });

    // Observe existing lazy elements
    document.querySelectorAll(&apos;[data-src], [data-lazy-component]&apos;).forEach((el: any) => {
}
      this.observer?.observe(el);
    });
  }

  private setupImageOptimization() {
}
    if (!this.config.enableImageOptimization) return;

    // Convert images to modern formats and optimize loading
    document.querySelectorAll(&apos;img&apos;).forEach((img: any) => {
}
      this.optimizeImage(img);
    });

    // Set up responsive images
    this.setupResponsiveImages();
  }

  private optimizeImage(img: HTMLImageElement) {
}
    // Add loading="lazy" for images below the fold
    if (!img.hasAttribute(&apos;loading&apos;)) {
}
      const rect = img.getBoundingClientRect();
      if (rect.top > window.innerHeight) {
}
        img.loading = &apos;lazy&apos;;
      }
    }

    // Add proper sizing attributes
    if (!img.hasAttribute(&apos;width&apos;) || !img.hasAttribute(&apos;height&apos;)) {
}
      img.addEventListener(&apos;load&apos;, () => {
}
        if (!img.hasAttribute(&apos;width&apos;)) img.setAttribute(&apos;width&apos;, img.naturalWidth.toString());
        if (!img.hasAttribute(&apos;height&apos;)) img.setAttribute(&apos;height&apos;, img.naturalHeight.toString());
      }, { once: true });
    }
  }

  private setupResponsiveImages() {
}
    // Create WebP/AVIF sources for better compression
    document.querySelectorAll(&apos;img[data-responsive]&apos;).forEach((img: any) => {
}
      this.createResponsiveImage(img as HTMLImageElement);
    });
  }

  private createResponsiveImage(img: HTMLImageElement) {
}
    const picture = document.createElement(&apos;picture&apos;);
    const src = img.src || img.dataset.src || &apos;&apos;;
    const baseName = src.split(&apos;.&apos;).slice(0, -1).join(&apos;.&apos;);
    
    // Add WebP source
    const webpSource = document.createElement(&apos;source&apos;);
    webpSource.srcset = `${baseName}.webp`;
    webpSource.type = &apos;image/webp&apos;;
    
    // Add AVIF source (if supported)
    if (this.supportsAVIF()) {
}
      const avifSource = document.createElement(&apos;source&apos;);
      avifSource.srcset = `${baseName}.avif`;
      avifSource.type = &apos;image/avif&apos;;
      picture.appendChild(avifSource);
    }
    
    picture.appendChild(webpSource);
    picture.appendChild(img.cloneNode(true));
    
    img.parentNode?.replaceChild(picture, img);
  }

  private supportsAVIF(): boolean {
}
    return new Promise<boolean>((resolve: any) => {
}
      const avif = new Image();
      avif.onload = avif.onerror = () => resolve(avif.height === 2);
      avif.src = &apos;data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=&apos;;
    }) as any;
  }

  private setupMemoryOptimization() {
}
    if (!this.config.enableMemoryOptimization) return;

    // Clean up memory every 30 seconds
    this.memoryCleanupInterval = window.setInterval(() => {
}
      this.performMemoryCleanup();
    }, 30000);

    // Clean up on page visibility change
    document.addEventListener(&apos;visibilitychange&apos;, () => {
}
      if (document.hidden) {
}
        this.performMemoryCleanup();
      }
    });
  }

  private performMemoryCleanup() {
}
    // Clear unused images from memory
    document.querySelectorAll(&apos;img&apos;).forEach((img: any) => {
}
      const rect = img.getBoundingClientRect();
      if (rect.top > window.innerHeight * 2 || rect.bottom < -window.innerHeight) {
}
        // Image is far from viewport, clear its data
        if (img.src && !img.src.startsWith(&apos;data:&apos;)) {
}
          img.dataset.originalSrc = img.src;
          img.src = &apos;data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InRyYW5zcGFyZW50Ii8+PC9zdmc+&apos;;
        }
      }
    });

    // Force garbage collection if available
    if (&apos;gc&apos; in window && typeof (window as any).gc === &apos;function&apos;) {
}
      (window as any).gc();
    }
  }

  private setupPerformanceMonitoring() {
}
    // Monitor Core Web Vitals
    this.observeCLS();
    this.observeLCP();
    this.observeFID();
    this.observeFCP();

    // Monitor resource loading
    this.monitorResourcePerformance();
  }

  private observeCLS() {
}
    if (&apos;LayoutShiftList&apos; in window) {
}
      new PerformanceObserver((list: any) => {
}
        let clsValue = 0;
        for (const entry of list.getEntries() as any[]) {
}
          if (!entry.hadRecentInput) {
}
            clsValue += entry.value;
          }
        }
        this.reportMetric(&apos;CLS&apos;, clsValue);
      }).observe({ type: &apos;layout-shift&apos;, buffered: true });
    }
  }

  private observeLCP() {
}
    if (&apos;LargestContentfulPaint&apos; in window) {
}
      new PerformanceObserver((list: any) => {
}
        const entries = list.getEntries() as any[];
        const lastEntry = entries[entries.length - 1];
        this.reportMetric(&apos;LCP&apos;, lastEntry.startTime);
      }).observe({ type: &apos;largest-contentful-paint&apos;, buffered: true });
    }
  }

  private observeFID() {
}
    if (&apos;FirstInputDelay&apos; in window) {
}
      new PerformanceObserver((list: any) => {
}
        for (const entry of list.getEntries() as any[]) {
}
          this.reportMetric(&apos;FID&apos;, entry.processingStart - entry.startTime);
        }
      }).observe({ type: &apos;first-input&apos;, buffered: true });
    }
  }

  private observeFCP() {
}
    if (&apos;PerformancePaintTiming&apos; in window) {
}
      new PerformanceObserver((list: any) => {
}
        for (const entry of list.getEntries()) {
}
          if (entry.name === &apos;first-contentful-paint&apos;) {
}
            this.reportMetric(&apos;FCP&apos;, entry.startTime);
          }
        }
      }).observe({ type: &apos;paint&apos;, buffered: true });
    }
  }

  private monitorResourcePerformance() {
}
    new PerformanceObserver((list: any) => {
}
      for (const entry of list.getEntries()) {
}
        if (entry.entryType === &apos;resource&apos;) {
}
          const resource = entry as PerformanceResourceTiming;
          this.analyzeResourcePerformance(resource);
        }
      }
    }).observe({ type: &apos;resource&apos;, buffered: true });
  }

  private analyzeResourcePerformance(resource: PerformanceResourceTiming) {
}
    const duration = resource.responseEnd - resource.requestStart;
    
    // Flag slow resources
    if (duration > 1000) {
}
      console.warn(`Slow resource detected: ${resource.name} (${duration.toFixed(2)}ms)`);
    }

    // Analyze resource types
    if (resource.name.includes(&apos;.js&apos;)) {
}
      this.reportMetric(&apos;JS_LOAD_TIME&apos;, duration);
    } else if (resource.name.includes(&apos;.css&apos;)) {
}
      this.reportMetric(&apos;CSS_LOAD_TIME&apos;, duration);
    }
  }

  private preloadCriticalResources() {
}
    // Preload critical CSS
    this.preloadResource(&apos;/assets/critical.css&apos;, &apos;style&apos;);
    
    // Preload critical fonts
    this.preloadResource(&apos;/assets/fonts/primary.woff2&apos;, &apos;font&apos;, &apos;font/woff2&apos;);
    
    // Preconnect to external domains
    this.preconnectToDomain(&apos;https://api.sportsdata.io&apos;);
    this.preconnectToDomain(&apos;https://cdnjs.cloudflare.com&apos;);
  }

  private preloadResource(href: string, as: string, type?: string) {
}
    const link = document.createElement(&apos;link&apos;);
    link.rel = &apos;preload&apos;;
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    document.head.appendChild(link);
  }

  private preconnectToDomain(domain: string) {
}
    const link = document.createElement(&apos;link&apos;);
    link.rel = &apos;preconnect&apos;;
    link.href = domain;
    document.head.appendChild(link);
  }

  private async loadComponent(componentName: string, target: HTMLElement) {
}
    try {
}
      // Dynamic import for component
      const module = await import(`../components/${componentName}`);
      const Component = module.default || module[componentName];
      
      // This would integrate with your React rendering system
      // For now, just mark as loaded
      target.setAttribute(&apos;data-loaded&apos;, &apos;true&apos;);
    } catch (error) {
}
      console.error(`Failed to load component: ${componentName}`, error);
    }
  }

  private reportMetric(name: string, value: number) {
}
    // Report to analytics service
    if (window.gtag) {
}
      window.gtag(&apos;event&apos;, &apos;web_vital&apos;, {
}
        name,
        value: Math.round(value),
        event_category: &apos;performance&apos;
      });
    }

    // Store locally for debugging
    if (import.meta.env.DEV) {
}
      console.log(`Performance Metric - ${name}: ${value.toFixed(2)}ms`);
    }
  }

  // Public API methods
  public updateConfig(newConfig: Partial<OptimizationConfig>) {
}
    this.config = { ...this.config, ...newConfig };
  }

  public getPerformanceMetrics(): PerformanceMetrics {
}
    return {
}
      fcp: this.getMetric(&apos;first-contentful-paint&apos;),
      lcp: this.getMetric(&apos;largest-contentful-paint&apos;),
      cls: this.getMetric(&apos;cumulative-layout-shift&apos;),
      tbt: this.calculateTBT(),
      fid: this.getMetric(&apos;first-input-delay&apos;)
    };
  }

  private getMetric(name: string): number {
}
    const entries = performance.getEntriesByName(name);
    return entries.length > 0 ? entries[0].startTime : 0;
  }

  private calculateTBT(): number {
}
    const navigationEntry = performance.getEntriesByType(&apos;navigation&apos;)[0] as PerformanceNavigationTiming;
    if (!navigationEntry) return 0;

    const fcp = this.getMetric(&apos;first-contentful-paint&apos;);
    const tti = navigationEntry.domInteractive;
    
    // Simplified TBT calculation
    return Math.max(0, tti - fcp - 50);
  }

  public optimizeForMobile() {
}
    // Mobile-specific optimizations
    if (&apos;connection&apos; in navigator) {
}
      const connection = (navigator as any).connection;
      if (connection.effectiveType === &apos;2g&apos; || connection.effectiveType === &apos;slow-2g&apos;) {
}
        this.enableDataSaverMode();
      }
    }

    // Reduce animation complexity on mobile
    if (window.innerWidth <= 768) {
}
      document.documentElement.style.setProperty(&apos;--animation-duration&apos;, &apos;0.2s&apos;);
      document.documentElement.style.setProperty(&apos;--transition-duration&apos;, &apos;0.1s&apos;);
    }
  }

  private enableDataSaverMode() {
}
    // Disable non-critical images
    document.querySelectorAll(&apos;img[data-critical="false"]&apos;).forEach((img: any) => {
}
      (img as HTMLImageElement).style.display = &apos;none&apos;;
    });

    // Reduce animation complexity
    document.documentElement.style.setProperty(&apos;--enable-animations&apos;, &apos;0&apos;);
  }

  public destroy() {
}
    if (this.observer) {
}
      this.observer.disconnect();
      this.observer = null;
    }

    if (this.memoryCleanupInterval) {
}
      clearInterval(this.memoryCleanupInterval);
      this.memoryCleanupInterval = null;
    }
  }
}

// Global instance
export const performanceOptimizer = new PerformanceOptimizer();

// Performance monitoring utilities
export class WebVitalsMonitor {
}
  private metrics: Map<string, number> = new Map();

  constructor() {
}
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
}
    // Monitor all Core Web Vitals
    this.monitorCLS();
    this.monitorLCP();
    this.monitorFID();
    this.monitorTTFB();
  }

  private monitorCLS() {
}
    let clsValue = 0;
    let sessionValue = 0;
    let sessionEntries: any[] = [];

    new PerformanceObserver((list: any) => {
}
      for (const entry of list.getEntries() as any[]) {
}
        if (!entry.hadRecentInput) {
}
          const firstSessionEntry = sessionEntries[0];
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

          if (!firstSessionEntry || entry.startTime - lastSessionEntry.startTime > 5000) {
}
            firstSessionEntry && this.reportMetric(&apos;CLS&apos;, sessionValue);
            sessionEntries = [entry];
            sessionValue = entry.value;
          } else {
}
            sessionEntries.push(entry);
            sessionValue += entry.value;
          }

          if (sessionValue > clsValue) {
}
            clsValue = sessionValue;
            this.metrics.set(&apos;CLS&apos;, clsValue);
          }
        }
      }
    }).observe({ type: &apos;layout-shift&apos;, buffered: true });
  }

  private monitorLCP() {
}
    new PerformanceObserver((list: any) => {
}
      const entries = list.getEntries() as any[];
      const lastEntry = entries[entries.length - 1];
      this.metrics.set(&apos;LCP&apos;, lastEntry.startTime);
      this.reportMetric(&apos;LCP&apos;, lastEntry.startTime);
    }).observe({ type: &apos;largest-contentful-paint&apos;, buffered: true });
  }

  private monitorFID() {
}
    new PerformanceObserver((list: any) => {
}
      for (const entry of list.getEntries() as any[]) {
}
        const fid = entry.processingStart - entry.startTime;
        this.metrics.set(&apos;FID&apos;, fid);
        this.reportMetric(&apos;FID&apos;, fid);
      }
    }).observe({ type: &apos;first-input&apos;, buffered: true });
  }

  private monitorTTFB() {
}
    new PerformanceObserver((list: any) => {
}
      for (const entry of list.getEntries()) {
}
        if (entry.entryType === &apos;navigation&apos;) {
}
          const nav = entry as PerformanceNavigationTiming;
          const ttfb = nav.responseStart - nav.requestStart;
          this.metrics.set(&apos;TTFB&apos;, ttfb);
          this.reportMetric(&apos;TTFB&apos;, ttfb);
        }
      }
    }).observe({ type: &apos;navigation&apos;, buffered: true });
  }

  private reportMetric(name: string, value: number) {
}
    // Send to analytics
    if (typeof gtag !== &apos;undefined&apos;) {
}
      gtag(&apos;event&apos;, &apos;web_vital&apos;, {
}
        name,
        value: Math.round(value),
        event_category: &apos;performance&apos;
      });
    }

    // Log in development
    if (import.meta.env.DEV) {
}
      console.log(`Web Vital - ${name}: ${value.toFixed(2)}ms`);
    }
  }

  public getMetrics(): Map<string, number> {
}
    return new Map(this.metrics);
  }

  public getMetric(name: string): number | undefined {
}
    return this.metrics.get(name);
  }
}

export const webVitalsMonitor = new WebVitalsMonitor();