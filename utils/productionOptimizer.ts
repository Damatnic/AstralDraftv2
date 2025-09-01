// Production Environment Optimizer
export class ProductionOptimizer {
  private static instance: ProductionOptimizer;
  private isProduction: boolean;
  private optimizationsEnabled: boolean = true;

  private constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.initializeProductionOptimizations();
  }

  static getInstance(): ProductionOptimizer {
    if (!ProductionOptimizer.instance) {
      ProductionOptimizer.instance = new ProductionOptimizer();
    }
    return ProductionOptimizer.instance;
  }

  private initializeProductionOptimizations(): void {
    if (typeof window === 'undefined') return;

    if (this.isProduction) {
      this.enableProductionMode();
    } else {
      this.enableDevelopmentMode();
    }
  }

  private enableProductionMode(): void {
    // Remove all console statements in production
    this.disableConsoleLogging();
    
    // Enable performance optimizations
    this.enablePerformanceOptimizations();
    
    // Remove development-only features
    this.removeDevFeatures();
    
    // Enable production error handling
    this.enableProductionErrorHandling();
  }

  private enableDevelopmentMode(): void {
    // Keep console logging for development
    this.enableDevelopmentLogging();
    
    // Enable development tools
    this.enableDevTools();
  }

  private disableConsoleLogging(): void {
    if (this.isProduction) {
      // Override console methods in production
      console.log = () => {};
      console.warn = () => {};
      console.info = () => {};
      
      // Keep error and debug for critical issues
      const originalError = console.error;
      console.error = (...args: any[]) => {
        // Only log critical errors in production
        if (args[0]?.includes?.('Critical') || args[0]?.includes?.('Fatal')) {
          originalError.apply(console, args);
        }
      };
    }
  }

  private enableDevelopmentLogging(): void {
    if (!this.isProduction) {
      // Add development-specific logging helpers
      (window as any).__DEV_LOG__ = (message: string, data?: any) => {
        console.log(`🔧 DEV: ${message}`, data || '');
      };
      
      (window as any).__PERF_LOG__ = (message: string, duration?: number) => {
        console.log(`⚡ PERF: ${message}`, duration ? `${duration}ms` : '');
      };
    }
  }

  private enablePerformanceOptimizations(): void {
    if (this.isProduction) {
      // Safely disable React DevTools in production
      if (typeof window !== 'undefined') {
        try {
          // Check if the property is writable before attempting to set it
          const descriptor = Object.getPropertyDescriptor(window, '__REACT_DEVTOOLS_GLOBAL_HOOK__');
          if (!descriptor || descriptor.writable !== false) {
            (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
              isDisabled: true,
              supportsFiber: true,
              inject: () => {},
              onCommitFiberRoot: () => {},
              onCommitFiberUnmount: () => {},
            };
          }
        } catch (error) {
          console.error(`Dev Error [production optimizer]:`, error);
        }
      }
    }
  }

  // Development-only helper methods
  private showPerformanceStats(): void {
    if (!this.isProduction && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      console.table({
        'DOM Load': `${navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart}ms`,
        'Page Load': `${navigation.loadEventEnd - navigation.loadEventStart}ms`,
        'DNS Lookup': `${navigation.domainLookupEnd - navigation.domainLookupStart}ms`,
        'TCP Connect': `${navigation.connectEnd - navigation.connectStart}ms`,
        'Response Time': `${navigation.responseEnd - navigation.responseStart}ms`,
      });
    }
  }

  private clearAllCaches(): void {
    if (!this.isProduction) {
      // Clear various caches for development testing
      localStorage.clear();
      sessionStorage.clear();
      
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach((name: any) => caches.delete(name));
        });
      }
      
      console.log('🧹 All caches cleared');
    }
  }

  private generatePerformanceReport(): void {
    if (!this.isProduction && 'performance' in window) {
      const report = {
        timestamp: new Date().toISOString(),
        memory: (performance as any).memory ? {
          used: Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round((performance as any).memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round((performance as any).memory.jsHeapSizeLimit / 1024 / 1024),
        } : null,
        navigation: performance.getEntriesByType('navigation')[0],
        resources: performance.getEntriesByType('resource').length,
      };
      
      console.log('📊 Performance Report:', report);
    }
  }

  // Public API methods
  public isProductionMode(): boolean {
    return this.isProduction;
  }

  public enableOptimizations(): void {
    this.optimizationsEnabled = true;
  }

  public disableOptimizations(): void {
    this.optimizationsEnabled = false;
  }

  public getEnvironmentInfo(): {
    isProduction: boolean;
    optimizationsEnabled: boolean;
    userAgent: string;
    timestamp: string;
  } {
    return {
      isProduction: this.isProduction,
      optimizationsEnabled: this.optimizationsEnabled,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };
  }

// Initialize the optimizer
export const productionOptimizer = ProductionOptimizer.getInstance();

// React hook for production optimization
export const useProductionOptimizations = () => {
  const [environmentInfo] = React.useState(productionOptimizer.getEnvironmentInfo());

  React.useEffect(() => {
    // Any additional initialization can go here
    if (environmentInfo.isProduction) {
      // Production-specific setup
      document.documentElement.classList.add('production-optimized');
    } else {
      // Development-specific setup
      document.documentElement.classList.add('development-mode');
    }
  }, [environmentInfo.isProduction]);

  return {
    isProduction: environmentInfo.isProduction,
    optimizationsEnabled: environmentInfo.optimizationsEnabled,
    environmentInfo,
  };
};

export default productionOptimizer;