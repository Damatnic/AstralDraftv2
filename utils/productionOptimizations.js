/**
 * Production Performance Utilities
 * Runtime performance monitoring and optimization for production builds
 */

// Performance monitoring utilities for production
export class ProductionPerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.observers = [];
    this.isInitialized = false;
  }

  initialize() {
    if (typeof window === 'undefined' || this.isInitialized) return;
    
    this.setupPerformanceObservers();
    this.measureCoreWebVitals();
    this.monitorMemoryUsage();
    this.trackUserInteractions();
    this.isInitialized = true;
    
    console.log('🔍 Production Performance Monitor initialized');
  }

  setupPerformanceObservers() {
    // Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
        
        // Log performance score
        if (lastEntry.startTime > 2500) {
          console.warn('⚠️ Poor LCP performance:', lastEntry.startTime + 'ms');
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
    } catch (e) {
      // LCP observer not supported
    }

    // First Input Delay
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.metrics.fid = entry.processingStart - entry.startTime;
          
          if (this.metrics.fid > 100) {
            console.warn('⚠️ Poor FID performance:', this.metrics.fid + 'ms');
          }
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);
    } catch (e) {
      // FID observer not supported
    }

    // Cumulative Layout Shift
    try {
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.metrics.cls = clsValue;
        
        if (clsValue > 0.25) {
          console.warn('⚠️ Poor CLS performance:', clsValue);
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    } catch (e) {
      // CLS observer not supported
    }
  }

  measureCoreWebVitals() {
    // Time to First Byte
    if ('navigation' in performance && 'getEntriesByType' in performance) {
      const navigationEntry = performance.getEntriesByType('navigation')[0];
      if (navigationEntry) {
        this.metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
        this.metrics.domContentLoaded = navigationEntry.domContentLoadedEventEnd - navigationEntry.navigationStart;
        this.metrics.loadComplete = navigationEntry.loadEventEnd - navigationEntry.navigationStart;
      }
    }
  }

  monitorMemoryUsage() {
    if ('memory' in performance) {
      const memory = performance.memory;
      this.metrics.memoryUsed = memory.usedJSHeapSize;
      this.metrics.memoryTotal = memory.totalJSHeapSize;
      this.metrics.memoryLimit = memory.jsHeapSizeLimit;
      
      // Warning for high memory usage
      const memoryUsagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      if (memoryUsagePercent > 80) {
        console.warn('⚠️ High memory usage:', memoryUsagePercent.toFixed(1) + '%');
      }
    }
  }

  trackUserInteractions() {
    // Track long tasks
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        this.metrics.longTasks = (this.metrics.longTasks || 0) + entries.length;
        
        // Warning for long tasks
        entries.forEach(entry => {
          if (entry.duration > 50) {
            console.warn('⚠️ Long task detected:', entry.duration + 'ms');
          }
        });
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.push(longTaskObserver);
    } catch (e) {
      // Long task observer not supported
    }
  }

  getMetrics() {
    return { ...this.metrics };
  }

  getPerformanceScore() {
    let score = 100;
    
    // LCP scoring
    if (this.metrics.lcp > 4000) score -= 25;
    else if (this.metrics.lcp > 2500) score -= 15;
    else if (this.metrics.lcp > 1200) score -= 5;
    
    // FID scoring
    if (this.metrics.fid > 300) score -= 25;
    else if (this.metrics.fid > 100) score -= 15;
    else if (this.metrics.fid > 25) score -= 5;
    
    // CLS scoring
    if (this.metrics.cls > 0.25) score -= 25;
    else if (this.metrics.cls > 0.1) score -= 15;
    else if (this.metrics.cls > 0.05) score -= 5;
    
    return Math.max(0, Math.min(100, score));
  }

  generateReport() {
    const score = this.getPerformanceScore();
    console.log('\n🔍 === PRODUCTION PERFORMANCE REPORT ===\n');
    
    const formatMetric = (value, unit = 'ms') => value ? `${value.toFixed(2)}${unit}` : 'N/A';
    
    console.log('⚡ Core Web Vitals:');
    console.log(`   LCP: ${formatMetric(this.metrics.lcp)} ${this.getScoreIcon(this.metrics.lcp, [1200, 2500])}`);
    console.log(`   FID: ${formatMetric(this.metrics.fid)} ${this.getScoreIcon(this.metrics.fid, [25, 100])}`);
    console.log(`   CLS: ${this.metrics.cls ? this.metrics.cls.toFixed(3) : 'N/A'} ${this.getScoreIcon(this.metrics.cls, [0.05, 0.25], true)}`);
    
    console.log('\n🚀 Loading Performance:');
    console.log(`   TTFB: ${formatMetric(this.metrics.ttfb)}`);
    console.log(`   DOM Ready: ${formatMetric(this.metrics.domContentLoaded)}`);
    console.log(`   Load Complete: ${formatMetric(this.metrics.loadComplete)}`);
    
    if (this.metrics.memoryUsed) {
      console.log('\n🧠 Memory Usage:');
      console.log(`   Used: ${(this.metrics.memoryUsed / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   Total: ${(this.metrics.memoryTotal / 1024 / 1024).toFixed(2)} MB`);
    }
    
    console.log(`\n📊 Overall Performance Score: ${score}/100 ${this.getOverallScoreIcon(score)}`);
    
    return { score, metrics: this.metrics };
  }

  getScoreIcon(value, thresholds, reverse = false) {
    if (!value) return '⏳';
    
    const [good, poor] = thresholds;
    if (reverse) {
      return value <= good ? '✅' : value <= poor ? '⚠️' : '❌';
    } else {
      return value <= good ? '✅' : value <= poor ? '⚠️' : '❌';
    }
  }

  getOverallScoreIcon(score) {
    if (score >= 90) return '🟢 Excellent';
    if (score >= 70) return '🟡 Good';
    if (score >= 50) return '🟠 Needs Improvement';
    return '🔴 Poor';
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.isInitialized = false;
  }
}

// Code splitting utilities
export class CodeSplittingOptimizer {
  static createLazyComponent(importFn, fallback = null) {
    const LazyComponent = React.lazy(importFn);
    
    return function LazyWrapper(props) {
      return React.createElement(
        React.Suspense,
        { fallback: fallback || React.createElement('div', { className: 'loading-spinner' }, 'Loading...') },
        React.createElement(LazyComponent, props)
      );
    };
  }

  static preloadComponent(importFn) {
    const componentImport = importFn();
    
    // Handle both default and named exports
    if (componentImport && typeof componentImport.then === 'function') {
      componentImport.catch(() => {
        // Silently handle preload failures
      });
    }
    
    return componentImport;
  }

  static createPreloadLink(href, as = 'script') {
    if (typeof document === 'undefined') return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    
    document.head.appendChild(link);
    
    return link;
  }
}

// Resource optimization utilities
export class ResourceOptimizer {
  static optimizeImages() {
    if (typeof document === 'undefined') return;
    
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    }
  }

  static prefetchCriticalResources() {
    if (typeof document === 'undefined') return;
    
    const criticalResources = [
      { href: '/fonts/inter.woff2', as: 'font', type: 'font/woff2' },
      { href: '/api/user', as: 'fetch' },
      { href: '/api/leagues', as: 'fetch' }
    ];
    
    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) link.type = resource.type;
      if (resource.as === 'font') link.crossOrigin = 'anonymous';
      
      document.head.appendChild(link);
    });
  }

  static enableServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('✅ Service Worker registered:', registration.scope);
          })
          .catch(error => {
            console.warn('❌ Service Worker registration failed:', error);
          });
      });
    }
  }

  static measureResourceTiming() {
    if (typeof performance === 'undefined') return;
    
    const resources = performance.getEntriesByType('resource');
    const slowResources = resources.filter(resource => resource.duration > 1000);
    
    if (slowResources.length > 0) {
      console.warn('⚠️ Slow loading resources detected:');
      slowResources.forEach(resource => {
        console.warn(`   ${resource.name}: ${resource.duration.toFixed(2)}ms`);
      });
    }
    
    return resources;
  }
}

// Cache optimization utilities
export class CacheOptimizer {
  static setupBrowserCaching() {
    // Set up cache headers for different resource types
    const cacheConfig = {
      'text/css': 31536000, // 1 year for CSS
      'application/javascript': 31536000, // 1 year for JS
      'image/': 2592000, // 30 days for images
      'font/': 31536000, // 1 year for fonts
      'application/json': 3600 // 1 hour for API responses
    };
    
    // This would typically be handled by server configuration
    console.log('📋 Cache configuration:', cacheConfig);
    
    return cacheConfig;
  }

  static clearObsoleteCache() {
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        const obsoleteCaches = cacheNames.filter(cacheName => {
          // Remove old cache versions
          return cacheName.includes('v1') || cacheName.includes('v2') || cacheName.includes('v3');
        });
        
        obsoleteCaches.forEach(cacheName => {
          caches.delete(cacheName);
        });
        
        if (obsoleteCaches.length > 0) {
          console.log('🗑️ Cleared obsolete caches:', obsoleteCaches);
        }
      });
    }
  }
}

// Initialize production optimizations
export function initializeProductionOptimizations() {
  // Only run in production
  if (process.env.NODE_ENV !== 'production') {
    console.log('🔧 Development mode - skipping production optimizations');
    return;
  }
  
  console.log('🚀 Initializing production optimizations...');
  
  // Initialize performance monitoring
  const monitor = new ProductionPerformanceMonitor();
  monitor.initialize();
  
  // Setup resource optimizations
  ResourceOptimizer.optimizeImages();
  ResourceOptimizer.prefetchCriticalResources();
  ResourceOptimizer.enableServiceWorker();
  
  // Setup caching
  CacheOptimizer.clearObsoleteCache();
  
  // Report performance after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      monitor.generateReport();
      ResourceOptimizer.measureResourceTiming();
    }, 2000);
  });
  
  // Report performance on page visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      const report = monitor.generateReport();
      
      // Send analytics if available
      if (typeof gtag !== 'undefined') {
        gtag('event', 'performance_metrics', {
          performance_score: report.score,
          lcp: report.metrics.lcp,
          fid: report.metrics.fid,
          cls: report.metrics.cls
        });
      }
    }
  });
  
  return monitor;
}

export default {
  ProductionPerformanceMonitor,
  CodeSplittingOptimizer,
  ResourceOptimizer,
  CacheOptimizer,
  initializeProductionOptimizations
};
