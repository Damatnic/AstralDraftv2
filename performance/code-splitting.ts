/**
 * Advanced Code Splitting Utilities
 * Intelligent module loading and bundle optimization
 */

import { ComponentType, lazy } from &apos;react&apos;;

interface ChunkLoadingOptions {
}
  timeout?: number;
  retries?: number;
  priority?: &apos;high&apos; | &apos;normal&apos; | &apos;low&apos;;
  preload?: boolean;
}

interface RouteChunk {
}
  path: string;
  component: () => Promise<{ default: ComponentType<any> }>;
  preload?: boolean;
  priority?: &apos;high&apos; | &apos;normal&apos; | &apos;low&apos;;
}

/**
 * Advanced chunk loader with retry logic and preloading
 */
export class ChunkLoader {
}
  private loadedChunks = new Set<string>();
  private loadingChunks = new Map<string, Promise<any>>();
  private preloadQueue: Array<{ fn: () => Promise<any>; priority: string }> = [];
  private isPreloading = false;

  /**
   * Load a chunk with retry logic
   */
  async loadChunk<T>(
    chunkName: string,
    importFn: () => Promise<T>,
    options: ChunkLoadingOptions = {}
  ): Promise<T> {
}
    const { timeout = 30000, retries = 3 } = options;

    if (this.loadedChunks.has(chunkName)) {
}
      return importFn();
    }

    if (this.loadingChunks.has(chunkName)) {
}
      return this.loadingChunks.get(chunkName)!;
    }

    const loadPromise = this.executeLoad(importFn, timeout, retries);
    this.loadingChunks.set(chunkName, loadPromise);

    try {
}
      const result = await loadPromise;
      this.loadedChunks.add(chunkName);
      this.loadingChunks.delete(chunkName);
      return result;
    } catch (error) {
}
      this.loadingChunks.delete(chunkName);
      throw error;
    }
  }

  private async executeLoad<T>(
    importFn: () => Promise<T>,
    timeout: number,
    maxRetries: number
  ): Promise<T> {
}
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
}
      try {
}
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Import timeout after ${timeout}ms`)), timeout)
        );

        const result = await Promise.race([importFn(), timeoutPromise]);
        return result;
      } catch (error) {
}
        lastError = error as Error;
        
        // Don&apos;t retry on timeout for the last attempt
        if (attempt === maxRetries) break;
        
        // Exponential backoff: 1s, 2s, 4s, 8s...
        const delay = Math.min(1000 * Math.pow(2, attempt), 8000);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        console.warn(`Chunk load attempt ${attempt + 1} failed, retrying in ${delay}ms...`, error);
      }
    }

    throw new Error(`Failed to load chunk after ${maxRetries + 1} attempts: ${lastError.message}`);
  }

  /**
   * Add chunk to preload queue
   */
  preloadChunk(
    chunkName: string,
    importFn: () => Promise<any>,
    priority: &apos;high&apos; | &apos;normal&apos; | &apos;low&apos; = &apos;normal&apos;
  ) {
}
    if (this.loadedChunks.has(chunkName) || this.loadingChunks.has(chunkName)) {
}
      return;
    }

    const preloadFn = () => this.loadChunk(chunkName, importFn);
    
    // Insert based on priority
    if (priority === &apos;high&apos;) {
}
      this.preloadQueue.unshift({ fn: preloadFn, priority });
    } else {
}
      this.preloadQueue.push({ fn: preloadFn, priority });
    }

    this.processPreloadQueue();
  }

  private async processPreloadQueue() {
}
    if (this.isPreloading || this.preloadQueue.length === 0) {
}
      return;
    }

    this.isPreloading = true;

    while (this.preloadQueue.length > 0) {
}
      const { fn } = this.preloadQueue.shift()!;
      
      try {
}
        await fn();
      } catch (error) {
}
        console.warn(&apos;Preload failed:&apos;, error);
      }

      // Add small delay to prevent blocking main thread
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    this.isPreloading = false;
  }

  /**
   * Get loading statistics
   */
  getStats() {
}
    return {
}
      loaded: this.loadedChunks.size,
      loading: this.loadingChunks.size,
      pending: this.preloadQueue.length,
      isPreloading: this.isPreloading
    };
  }

  /**
   * Clear all caches
   */
  clear() {
}
    this.loadedChunks.clear();
    this.loadingChunks.clear();
    this.preloadQueue.length = 0;
    this.isPreloading = false;
  }
}

/**
 * Route-based code splitting
 */
export class RouteSplitter {
}
  private chunkLoader = new ChunkLoader();
  private routes = new Map<string, RouteChunk>();
  
  /**
   * Define route chunks
   */
  defineRoutes(routes: RouteChunk[]) {
}
    routes.forEach(route => {
}
      this.routes.set(route.path, route);
      
      // Preload high-priority routes
      if (route.preload && route.priority === &apos;high&apos;) {
}
        this.chunkLoader.preloadChunk(
          route.path,
          route.component,
          &apos;high&apos;
        );
      }
    });
  }

  /**
   * Get lazy component for route
   */
  getLazyComponent(path: string): ComponentType<any> | null {
}
    const route = this.routes.get(path);
    if (!route) return null;

    return lazy(() => 
      this.chunkLoader.loadChunk(path, route.component, {
}
        priority: route.priority
      })
    );
  }

  /**
   * Preload route based on user interaction
   */
  preloadRoute(path: string, priority: &apos;high&apos; | &apos;normal&apos; | &apos;low&apos; = &apos;normal&apos;) {
}
    const route = this.routes.get(path);
    if (route) {
}
      this.chunkLoader.preloadChunk(path, route.component, priority);
    }
  }

  /**
   * Preload routes likely to be visited next
   */
  preloadLikelyRoutes(currentPath: string) {
}
    const predictions = this.predictNextRoutes(currentPath);
    
    predictions.forEach(({ path, probability }) => {
}
      const priority = probability > 0.7 ? &apos;high&apos; : &apos;normal&apos;;
      this.preloadRoute(path, priority);
    });
  }

  private predictNextRoutes(currentPath: string): Array<{path: string, probability: number}> {
}
    // Simple prediction logic - can be enhanced with ML
    const predictions: Array<{path: string, probability: number}> = [];
    
    // Common navigation patterns
    if (currentPath === &apos;/&apos;) {
}
      predictions.push(
        { path: &apos;/draft&apos;, probability: 0.8 },
        { path: &apos;/players&apos;, probability: 0.6 },
        { path: &apos;/leagues&apos;, probability: 0.5 }
      );
    } else if (currentPath === &apos;/draft&apos;) {
}
      predictions.push(
        { path: &apos;/players&apos;, probability: 0.9 },
        { path: &apos;/analytics&apos;, probability: 0.4 }
      );
    } else if (currentPath.startsWith(&apos;/players&apos;)) {
}
      predictions.push(
        { path: &apos;/draft&apos;, probability: 0.7 },
        { path: &apos;/analytics&apos;, probability: 0.5 }
      );
    }
    
    return predictions;
  }

  getStats() {
}
    return {
}
      definedRoutes: this.routes.size,
      ...this.chunkLoader.getStats()
    };
  }
}

/**
 * Feature-based code splitting
 */
export class FeatureSplitter {
}
  private chunkLoader = new ChunkLoader();
  private features = new Map<string, () => Promise<any>>();
  private featureDependencies = new Map<string, string[]>();

  /**
   * Define feature modules
   */
  defineFeature(
    name: string, 
    importFn: () => Promise<any>,
    dependencies: string[] = []
  ) {
}
    this.features.set(name, importFn);
    this.featureDependencies.set(name, dependencies);
  }

  /**
   * Load feature with dependencies
   */
  async loadFeature(name: string): Promise<any> {
}
    const dependencies = this.featureDependencies.get(name) || [];
    
    // Load dependencies first
    await Promise.all(
      dependencies.map(dep => this.loadFeature(dep))
    );

    // Load the feature itself
    const importFn = this.features.get(name);
    if (!importFn) {
}
      throw new Error(`Feature &apos;${name}&apos; not defined`);
    }

    return this.chunkLoader.loadChunk(name, importFn);
  }

  /**
   * Preload feature and dependencies
   */
  preloadFeature(name: string, priority: &apos;high&apos; | &apos;normal&apos; | &apos;low&apos; = &apos;normal&apos;) {
}
    const dependencies = this.featureDependencies.get(name) || [];
    
    // Preload dependencies
    dependencies.forEach(dep => this.preloadFeature(dep, priority));

    // Preload the feature
    const importFn = this.features.get(name);
    if (importFn) {
}
      this.chunkLoader.preloadChunk(name, importFn, priority);
    }
  }

  /**
   * Create lazy feature component
   */
  createLazyFeature<T extends ComponentType<any>>(name: string): T {
}
    return lazy(async () => {
}
      const module = await this.loadFeature(name);
      return { default: module.default || module };
    }) as T;
  }

  getStats() {
}
    return {
}
      definedFeatures: this.features.size,
      ...this.chunkLoader.getStats()
    };
  }
}

/**
 * Bundle analyzer utilities
 */
export class BundleAnalyzer {
}
  private loadTimes = new Map<string, number[]>();

  /**
   * Track chunk load time
   */
  trackLoadTime(chunkName: string, loadTime: number) {
}
    if (!this.loadTimes.has(chunkName)) {
}
      this.loadTimes.set(chunkName, []);
    }
    
    this.loadTimes.get(chunkName)!.push(loadTime);
    
    // Keep only last 50 measurements
    const times = this.loadTimes.get(chunkName)!;
    if (times.length > 50) {
}
      times.splice(0, times.length - 50);
    }
  }

  /**
   * Get performance metrics
   */
  getMetrics(chunkName?: string) {
}
    if (chunkName) {
}
      const times = this.loadTimes.get(chunkName) || [];
      return this.calculateStats(times);
    }

    const allMetrics: Record<string, any> = {};
    for (const [chunk, times] of this.loadTimes) {
}
      allMetrics[chunk] = this.calculateStats(times);
    }
    
    return allMetrics;
  }

  private calculateStats(times: number[]) {
}
    if (times.length === 0) {
}
      return { count: 0, avg: 0, min: 0, max: 0, p95: 0 };
    }

    const sorted = [...times].sort((a, b) => a - b);
    const sum = times.reduce((a, b) => a + b, 0);
    const avg = sum / times.length;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const p95Index = Math.floor(sorted.length * 0.95);
    const p95 = sorted[p95Index];

    return { count: times.length, avg, min, max, p95 };
  }

  /**
   * Identify slow chunks
   */
  getSlowChunks(threshold = 1000): Array<{name: string, avgTime: number}> {
}
    const slowChunks: Array<{name: string, avgTime: number}> = [];
    
    for (const [chunk, times] of this.loadTimes) {
}
      const stats = this.calculateStats(times);
      if (stats.avg > threshold) {
}
        slowChunks.push({ name: chunk, avgTime: stats.avg });
      }
    }
    
    return slowChunks.sort((a, b) => b.avgTime - a.avgTime);
  }

  /**
   * Generate report
   */
  generateReport() {
}
    const allMetrics = this.getMetrics();
    const slowChunks = this.getSlowChunks();
    
    return {
}
      summary: {
}
        totalChunks: this.loadTimes.size,
        slowChunks: slowChunks.length,
        avgLoadTime: Object.values(allMetrics).reduce(
          (sum: number, metric: any) => sum + metric.avg, 0
        ) / Object.keys(allMetrics).length
      },
      details: allMetrics,
      slowChunks,
      recommendations: this.generateRecommendations(slowChunks)
    };
  }

  private generateRecommendations(slowChunks: Array<{name: string, avgTime: number}>) {
}
    const recommendations: string[] = [];
    
    if (slowChunks.length > 0) {
}
      recommendations.push(`Consider optimizing ${slowChunks.length} slow chunks`);
      
      slowChunks.slice(0, 3).forEach(chunk => {
}
        recommendations.push(
          `${chunk.name}: ${chunk.avgTime.toFixed(0)}ms avg - consider splitting further or optimizing`
        );
      });
    }
    
    return recommendations;
  }
}

// Export singleton instances
export const chunkLoader = new ChunkLoader();
export const routeSplitter = new RouteSplitter();
export const featureSplitter = new FeatureSplitter();
export const bundleAnalyzer = new BundleAnalyzer();

// Utility functions
export function createIntelligentLazy<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  chunkName: string,
  options: ChunkLoadingOptions = {}
): T {
}
  const startTime = performance.now();
  
  return lazy(async () => {
}
    const result = await chunkLoader.loadChunk(chunkName, importFn, options);
    
    const endTime = performance.now();
    bundleAnalyzer.trackLoadTime(chunkName, endTime - startTime);
    
    return result;
  }) as T;
}

export function preloadOnHover(element: HTMLElement, preloadFn: () => void) {
}
  let timeoutId: NodeJS.Timeout;
  
  const handleMouseEnter = () => {
}
    timeoutId = setTimeout(preloadFn, 200); // 200ms delay
  };
  
  const handleMouseLeave = () => {
}
    clearTimeout(timeoutId);
  };
  
  element.addEventListener(&apos;mouseenter&apos;, handleMouseEnter);
  element.addEventListener(&apos;mouseleave&apos;, handleMouseLeave);
  
  return () => {
}
    element.removeEventListener(&apos;mouseenter&apos;, handleMouseEnter);
    element.removeEventListener(&apos;mouseleave&apos;, handleMouseLeave);
    clearTimeout(timeoutId);
  };
}

export function preloadOnVisible(
  element: HTMLElement, 
  preloadFn: () => void,
  options: IntersectionObserverInit = {}
) {
}
  const observer = new IntersectionObserver(
    (entries) => {
}
      entries.forEach(entry => {
}
        if (entry.isIntersecting) {
}
          preloadFn();
          observer.disconnect();
        }
      });
    },
    { rootMargin: &apos;50px&apos;, ...options }
  );
  
  observer.observe(element);
  
  return () => observer.disconnect();
}