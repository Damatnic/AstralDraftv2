/**
 * Advanced Preloading Manager
 * Intelligent resource preloading for optimal performance
 */

import { performanceOptimizer } from './performanceOptimizer';

interface PreloadConfig {
  priority: 'critical' | 'high' | 'medium' | 'low';
  timing: 'immediate' | 'idle' | 'interaction' | 'viewport';
  condition?: () => boolean;
  timeout?: number;
}

interface PreloadableResource {
  id: string;
  loader: () => Promise<any>;
  config: PreloadConfig;
  loaded?: boolean;
  loading?: boolean;
  error?: Error;
}

class PreloadManager {
  private resources: Map<string, PreloadableResource> = new Map();
  private loadedResources: Set<string> = new Set();
  private pendingLoads: Map<string, Promise<any>> = new Map();
  private interactionPreloads: Set<string> = new Set();
  private idleCallbackSupported = typeof requestIdleCallback !== 'undefined';

  constructor() {
    this.initializePreloadStrategies();
  }

  /**
   * Initialize preload strategies
   */
  private initializePreloadStrategies(): void {
    // Preload critical resources immediately
    this.preloadCriticalResources();
    
    // Setup idle preloading
    this.setupIdlePreloading();
    
    // Setup interaction-based preloading
    this.setupInteractionPreloading();
    
    // Setup viewport-based preloading
    this.setupViewportPreloading();
  }

  /**
   * Register a resource for preloading
   */
  registerResource(id: string, loader: () => Promise<any>, config: PreloadConfig): void {
    this.resources.set(id, {
      id,
      loader,
      config,
      loaded: false,
      loading: false
    });

    // Trigger immediate loading if critical
    if (config.timing === 'immediate' || config.priority === 'critical') {
      this.preloadResource(id);
    }
  }

  /**
   * Preload a specific resource
   */
  async preloadResource(id: string): Promise<any> {
    const resource = this.resources.get(id);
    if (!resource) {
      console.warn(`⚠️ PreloadManager: Resource ${id} not found`);
      return null;
    }

    // Check if already loaded or loading
    if (resource.loaded || resource.loading) {
      return this.pendingLoads.get(id) || null;
    }

    // Check condition if provided
    if (resource.config.condition && !resource.config.condition()) {
      return null;
    }

    // Mark as loading
    resource.loading = true;
    
    const startTime = performance.now();
    
    try {
      // Create timeout promise if specified
      const timeoutPromise = resource.config.timeout ? 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error(`Preload timeout for ${id}`)), resource.config.timeout)
        ) : null;

      // Race between loader and timeout
      const loadPromise = resource.loader();
      const promises = timeoutPromise ? [loadPromise, timeoutPromise] : [loadPromise];
      
      this.pendingLoads.set(id, loadPromise);
      
      const result = await Promise.race(promises);
      
      // Mark as loaded
      resource.loaded = true;
      resource.loading = false;
      this.loadedResources.add(id);
      
      // Track performance
      const loadTime = performance.now() - startTime;
      performanceOptimizer.recordMetric(`Preload-${id}`, loadTime);
      
      console.log(`✅ Preloaded ${id} in ${loadTime.toFixed(2)}ms`);
      
      return result;
      
    } catch (error) {
      resource.loading = false;
      resource.error = error as Error;
      
      const loadTime = performance.now() - startTime;
      performanceOptimizer.recordMetric(`PreloadError-${id}`, loadTime);
      
      console.error(`❌ Failed to preload ${id}:`, error);
      
      return null;
    } finally {
      this.pendingLoads.delete(id);
    }
  }

  /**
   * Preload multiple resources
   */
  async preloadMultiple(ids: string[]): Promise<{ [key: string]: any }> {
    const results: { [key: string]: any } = {};
    
    const promises = ids.map(async (id) => {
      results[id] = await this.preloadResource(id);
    });
    
    await Promise.allSettled(promises);
    
    return results;
  }

  /**
   * Get preloaded resource
   */
  getResource(id: string): any {
    if (this.loadedResources.has(id)) {
      return this.pendingLoads.get(id) || null;
    }
    return null;
  }

  /**
   * Check if resource is loaded
   */
  isResourceLoaded(id: string): boolean {
    return this.loadedResources.has(id);
  }

  /**
   * Preload critical resources
   */
  private preloadCriticalResources(): void {
    this.resources.forEach((resource, id) => {
      if (resource.config.priority === 'critical' && resource.config.timing === 'immediate') {
        this.preloadResource(id);
      }
    });
  }

  /**
   * Setup idle preloading
   */
  private setupIdlePreloading(): void {
    const preloadOnIdle = () => {
      this.resources.forEach((resource, id) => {
        if (resource.config.timing === 'idle' && !resource.loaded && !resource.loading) {
          this.preloadResource(id);
        }
      });
    };

    if (this.idleCallbackSupported) {
      requestIdleCallback(preloadOnIdle, { timeout: 5000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(preloadOnIdle, 1000);
    }
  }

  /**
   * Setup interaction-based preloading
   */
  private setupInteractionPreloading(): void {
    // Preload on hover/focus
    const handleInteraction = (event: Event) => {
      const target = event.target as HTMLElement;
      const preloadId = target.dataset.preload;
      
      if (preloadId && !this.interactionPreloads.has(preloadId)) {
        this.interactionPreloads.add(preloadId);
        this.preloadResource(preloadId);
      }
    };

    // Add event listeners for interaction preloading
    document.addEventListener('mouseover', handleInteraction, { passive: true });
    document.addEventListener('focus', handleInteraction, { passive: true });
    document.addEventListener('touchstart', handleInteraction, { passive: true });
  }

  /**
   * Setup viewport-based preloading
   */
  private setupViewportPreloading(): void {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const preloadId = (entry.target as HTMLElement).dataset.preloadViewport;
            if (preloadId) {
              this.preloadResource(preloadId);
              observer.unobserve(entry.target);
            }
          }
        });
      }, {
        rootMargin: '50px'
      });

      // Observe elements with viewport preloading
      document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('[data-preload-viewport]').forEach((element) => {
          observer.observe(element);
        });
      });
    }
  }

  /**
   * Get preload statistics
   */
  getStats(): {
    total: number;
    loaded: number;
    loading: number;
    failed: number;
    byPriority: { [key: string]: number };
    byTiming: { [key: string]: number };
  } {
    const stats = {
      total: this.resources.size,
      loaded: this.loadedResources.size,
      loading: 0,
      failed: 0,
      byPriority: {} as { [key: string]: number },
      byTiming: {} as { [key: string]: number }
    };

    this.resources.forEach((resource) => {
      if (resource.loading) stats.loading++;
      if (resource.error) stats.failed++;
      
      stats.byPriority[resource.config.priority] = (stats.byPriority[resource.config.priority] || 0) + 1;
      stats.byTiming[resource.config.timing] = (stats.byTiming[resource.config.timing] || 0) + 1;
    });

    return stats;
  }

  /**
   * Clear all preload data
   */
  clear(): void {
    this.resources.clear();
    this.loadedResources.clear();
    this.pendingLoads.clear();
    this.interactionPreloads.clear();
  }
}

// Create singleton instance
export const preloadManager = new PreloadManager();

// Convenience functions for common preload scenarios
export const preloadComponent = (id: string, importFn: () => Promise<any>, priority: PreloadConfig['priority'] = 'medium') => {
  preloadManager.registerResource(id, importFn, {
    priority,
    timing: 'idle'
  });
};

export const preloadCriticalComponent = (id: string, importFn: () => Promise<any>) => {
  preloadManager.registerResource(id, importFn, {
    priority: 'critical',
    timing: 'immediate'
  });
};

export const preloadOnHover = (id: string, importFn: () => Promise<any>) => {
  preloadManager.registerResource(id, importFn, {
    priority: 'high',
    timing: 'interaction'
  });
};

export const preloadInViewport = (id: string, importFn: () => Promise<any>) => {
  preloadManager.registerResource(id, importFn, {
    priority: 'medium',
    timing: 'viewport'
  });
};

// Hook for React components
export const usePreload = (id: string) => {
  const [isLoaded, setIsLoaded] = React.useState(preloadManager.isResourceLoaded(id));
  
  React.useEffect(() => {
    const checkLoaded = () => {
      setIsLoaded(preloadManager.isResourceLoaded(id));
    };
    
    const interval = setInterval(checkLoaded, 100);
    
    return () => clearInterval(interval);
  }, [id]);
  
  return {
    isLoaded,
    preload: () => preloadManager.preloadResource(id),
    getResource: () => preloadManager.getResource(id)
  };
};

export default PreloadManager;