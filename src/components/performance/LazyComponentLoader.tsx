/**
 * Lazy Component Loader - Intelligent Dynamic Import System
 * Implements smart lazy loading with performance monitoring and error boundaries
 */

import React, { Suspense, lazy, ComponentType, useEffect, useState, useRef } from 'react';
import { ErrorBoundary } from '../ui/ErrorBoundary';

interface LazyLoaderProps {
  componentPath: string;
  fallback?: React.ComponentType;
  errorFallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  loadingMessage?: string;
  preload?: boolean;
  priority?: 'high' | 'normal' | 'low';
  threshold?: number; // For intersection observer
  children?: React.ReactNode;
}

interface ComponentCache {
  [key: string]: {
    component: ComponentType<any>;
    loadTime: number;
    error?: Error;
  };
}

interface LoadingStats {
  totalLoads: number;
  successfulLoads: number;
  failedLoads: number;
  averageLoadTime: number;
}

class LazyComponentManager {
  private static instance: LazyComponentManager;
  private componentCache: ComponentCache = {};
  private loadingPromises: Map<string, Promise<ComponentType<any>>> = new Map();
  private loadingStats: LoadingStats = {
    totalLoads: 0,
    successfulLoads: 0,
    failedLoads: 0,
    averageLoadTime: 0
  };
  private observer: IntersectionObserver | null = null;

  static getInstance(): LazyComponentManager {
    if (!LazyComponentManager.instance) {
      LazyComponentManager.instance = new LazyComponentManager();
    }
    return LazyComponentManager.instance;
  }

  constructor() {
    this.setupIntersectionObserver();
    this.preloadCriticalComponents();
  }

  private setupIntersectionObserver() {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries: any) => {
          entries.forEach((entry: any) => {
            if (entry.isIntersecting) {
              const element = entry.target as HTMLElement;
              const componentPath = element.dataset.lazyComponent;
              if (componentPath) {
                this.loadComponent(componentPath);
                this.observer?.unobserve(element);
              }
            }
          });
        },
        {
          rootMargin: '100px',
          threshold: 0.1
        }
      );
    }
  }

  private async preloadCriticalComponents() {
    // Preload components that are likely to be needed soon
    const criticalComponents = [
      'views/LeagueDashboard',
      'components/ui/ModernNavigation',
      'components/ui/ErrorBoundary'
    ];

    // Use requestIdleCallback to avoid blocking main thread
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        criticalComponents.forEach((path: any) => {
          this.loadComponent(path, 'low');
        });
      });
    }
  }

  async loadComponent(
    componentPath: string, 
    priority: 'high' | 'normal' | 'low' = 'normal'
  ): Promise<ComponentType<any>> {
    // Check cache first
    const cached = this.componentCache[componentPath];
    if (cached && !cached.error) {
      return cached.component;
    }

    // Check if already loading
    if (this.loadingPromises.has(componentPath)) {
      return this.loadingPromises.get(componentPath)!;
    }

    const startTime = performance.now();
    this.loadingStats.totalLoads++;

    const loadPromise = this.performComponentLoad(componentPath, priority)
      .then((component: any) => {
        const loadTime = performance.now() - startTime;
        
        // Update cache
        this.componentCache[componentPath] = {
          component,
          loadTime
        };

        // Update stats
        this.loadingStats.successfulLoads++;
        this.updateAverageLoadTime(loadTime);

        // Report performance metric
        this.reportLoadMetric(componentPath, loadTime, 'success');

        return component;
      })
      .catch((error: any) => {
        const loadTime = performance.now() - startTime;
        
        // Cache error for retry logic
        this.componentCache[componentPath] = {
          component: this.createErrorComponent(error),
          loadTime,
          error
        };

        this.loadingStats.failedLoads++;
        this.reportLoadMetric(componentPath, loadTime, 'error', error);

        throw error;
      })
      .finally(() => {
        this.loadingPromises.delete(componentPath);
      });

    this.loadingPromises.set(componentPath, loadPromise);
    return loadPromise;
  }

  private async performComponentLoad(
    componentPath: string, 
    priority: 'high' | 'normal' | 'low'
  ): Promise<ComponentType<any>> {
    // Implement priority-based loading
    if (priority === 'low' && this.shouldDeferLoad()) {
      await this.waitForIdleTime();
    }

    try {
      // Dynamic import with proper error handling
      const module = await import(`../../${componentPath}`);
      
      // Handle different export patterns
      return module.default || module[this.getComponentNameFromPath(componentPath)] || module;
    } catch (importError) {
      // Retry with different path variations
      const alternativePaths = this.getAlternativePaths(componentPath);
      
      for (const altPath of alternativePaths) {
        try {
          const module = await import(`../../${altPath}`);
          return module.default || module[this.getComponentNameFromPath(altPath)] || module;
        } catch {
          continue;
        }
      }
      
      throw new Error(`Failed to load component: ${componentPath}`);
    }
  }

  private shouldDeferLoad(): boolean {
    // Defer loading if user is on slow connection or battery is low
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
        return true;
      }
    }

    if ('getBattery' in navigator) {
      navigator.getBattery().then((battery: any) => {
        return battery.level < 0.2 && !battery.charging;
      });
    }

    return false;
  }

  private waitForIdleTime(): Promise<void> {
    return new Promise((resolve: any) => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => resolve(), { timeout: 2000 });
      } else {
        setTimeout(resolve, 100);
      }
    });
  }

  private getComponentNameFromPath(path: string): string {
    const parts = path.split('/');
    const fileName = parts[parts.length - 1];
    return fileName.replace(/\.(tsx?|jsx?)$/, '');
  }

  private getAlternativePaths(path: string): string[] {
    const alternatives = [];
    
    // Try with different extensions
    const basePath = path.replace(/\.(tsx?|jsx?)$/, '');
    alternatives.push(
      `${basePath}.tsx`,
      `${basePath}.ts`,
      `${basePath}.jsx`,
      `${basePath}.js`,
      `${basePath}/index.tsx`,
      `${basePath}/index.ts`,
      `${basePath}/index.jsx`,
      `${basePath}/index.js`
    );

    return alternatives;
  }

  private updateAverageLoadTime(newLoadTime: number) {
    const { averageLoadTime, successfulLoads } = this.loadingStats;
    this.loadingStats.averageLoadTime = 
      (averageLoadTime * (successfulLoads - 1) + newLoadTime) / successfulLoads;
  }

  private reportLoadMetric(
    componentPath: string, 
    loadTime: number, 
    status: 'success' | 'error',
    error?: Error
  ) {
    // Send to performance monitoring service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'component_load', {
        event_category: 'performance',
        component_path: componentPath,
        load_time: Math.round(loadTime),
        status
      });
    }

    // Log for development
    if (import.meta.env.DEV) {
      const statusIcon = status === 'success' ? '✅' : '❌';
      console.log(
        `${statusIcon} Component Load: ${componentPath} (${loadTime.toFixed(2)}ms)`,
        error ? error : ''
      );
    }
  }

  private createErrorComponent(error: Error): ComponentType<any> {
    return () => (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        <div className="text-red-600 dark:text-red-400 text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
          Component Load Failed
        </h3>
        <p className="text-sm text-red-600 dark:text-red-400 text-center mb-4">
          {error.message}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Reload Page
        </button>
      </div>
    );
  }

  observeElement(element: HTMLElement, componentPath: string) {
    if (this.observer) {
      element.dataset.lazyComponent = componentPath;
      this.observer.observe(element);
    }
  }

  getStats(): LoadingStats {
    return { ...this.loadingStats };
  }

  clearCache() {
    this.componentCache = {};
    this.loadingPromises.clear();
  }

  preloadComponent(componentPath: string, priority: 'high' | 'normal' | 'low' = 'normal') {
    return this.loadComponent(componentPath, priority);
  }
}

// Enhanced Loading Component
const SmartLoader: React.FC<{ message?: string; size?: 'sm' | 'md' | 'lg' }> = ({ 
  message = 'Loading...', 
  size = 'md' 
}: any) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 border-4 border-primary-200 dark:border-primary-800 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin"></div>
      </div>
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 animate-pulse">
        {message}
      </p>
    </div>
  );
};

// Default Error Boundary Component
const DefaultErrorFallback: React.FC<{ error: Error; retry: () => void }> = ({ error, retry }: any) => (
  <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
    <div className="text-gray-400 dark:text-gray-600 text-4xl mb-4">⚠️</div>
    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
      Something went wrong
    </h3>
    <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4 max-w-md">
      We encountered an error while loading this component. Please try again.
    </p>
    <button
      onClick={retry}
      className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
    >
      Try Again
    </button>
    {import.meta.env.DEV && (
      <details className="mt-4 text-xs">
        <summary className="cursor-pointer text-gray-500">Error Details</summary>
        <pre className="mt-2 p-2 bg-gray-800 text-gray-200 rounded overflow-auto max-w-md">
          {error.stack}
        </pre>
      </details>
    )}
  </div>
);

// Main Lazy Component Loader
export const LazyComponentLoader: React.FC<LazyLoaderProps> = ({
  componentPath,
  fallback: CustomFallback,
  errorFallback: CustomErrorFallback,
  loadingMessage = 'Loading component...',
  preload = false,
  priority = 'normal',
  threshold = 0.1,
  children
}) => {
  const [retryCount, setRetryCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const manager = LazyComponentManager.getInstance();

  // Create lazy component
  const LazyComponent = lazy(() => manager.loadComponent(componentPath, priority));

  // Preload if requested
  useEffect(() => {
    if (preload) {
      manager.preloadComponent(componentPath, priority);
    }
  }, [componentPath, preload, priority]);

  // Set up intersection observer for on-demand loading
  useEffect(() => {
    if (!preload && containerRef.current) {
      manager.observeElement(containerRef.current, componentPath);
    }
  }, [componentPath, preload]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const ErrorFallback = CustomErrorFallback || DefaultErrorFallback;
  const LoadingFallback = CustomFallback || (() => <SmartLoader message={loadingMessage} />);

  return (
    <div ref={containerRef} className="w-full h-full">
      <ErrorBoundary
        fallback={(error: Error) => <ErrorFallback error={error} retry={handleRetry} />}
        key={retryCount} // Reset error boundary on retry
      >
        <Suspense fallback={<LoadingFallback />}>
          <LazyComponent>
            {children}
          </LazyComponent>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

// Hook for component preloading
export const useLazyPreload = () => {
  const manager = LazyComponentManager.getInstance();

  const preloadComponent = (
    componentPath: string, 
    priority: 'high' | 'normal' | 'low' = 'normal'
  ) => {
    return manager.preloadComponent(componentPath, priority);
  };

  const getLoadingStats = () => {
    return manager.getStats();
  };

  const clearCache = () => {
    manager.clearCache();
  };

  return {
    preloadComponent,
    getLoadingStats,
    clearCache
  };
};

// Higher-order component for easy lazy loading
export const withLazyLoading = <P extends object>(
  componentPath: string,
  options: Partial<LazyLoaderProps> = {}
) => {
  return (props: P) => (
    <LazyComponentLoader componentPath={componentPath} {...options}>
      <div {...props} />
    </LazyComponentLoader>
  );
};

// Route-based lazy loading wrapper
export const LazyRoute: React.FC<{
  path: string;
  component: string;
  preload?: boolean;
  priority?: 'high' | 'normal' | 'low';
  fallback?: React.ComponentType;
}> = ({ component, preload, priority, fallback }: any) => {
  return (
    <LazyComponentLoader
      componentPath={`views/${component}`}
      preload={preload}
      priority={priority}
      fallback={fallback}
    />
  );
};

export default LazyComponentLoader;