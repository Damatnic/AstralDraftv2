/**
 * Oracle Performance Optimization Hooks
 * Advanced performance monitoring and optimization for Oracle predictions
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// Enhanced interfaces for performance tracking
export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  cpuUsage: number;
  networkLatency: number;
  cacheHitRatio: number;
  errorRate: number;
  throughput: number;
}

export interface OptimizationConfig {
  enableLazyLoading: boolean;
  enableVirtualization: boolean;
  enableMemoization: boolean;
  enablePrefetching: boolean;
  enableCaching: boolean;
  enableCompression: boolean;
  maxConcurrentRequests: number;
  requestTimeout: number;
  retryAttempts: number;
  batchSize: number;
}

export interface ResourceUsage {
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: {
    usage: number;
    cores: number;
  };
  network: {
    bandwidth: number;
    latency: number;
    requests: number;
  };
}

export interface OptimizationState {
  isOptimizing: boolean;
  metrics: PerformanceMetrics;
  recommendations: string[];
  warnings: string[];
  resourceUsage: ResourceUsage;
  lastOptimizedAt: number;
}

export interface CacheStatistics {
  hits: number;
  misses: number;
  size: number;
  maxSize: number;
  evictions: number;
  hitRatio: number;
}

export interface LazyLoadConfig {
  threshold: number;
  rootMargin: string;
  enabled: boolean;
}

// Default configuration
const DEFAULT_OPTIMIZATION_CONFIG: OptimizationConfig = {
  enableLazyLoading: true,
  enableVirtualization: true,
  enableMemoization: true,
  enablePrefetching: false,
  enableCaching: true,
  enableCompression: false,
  maxConcurrentRequests: 6,
  requestTimeout: 10000,
  retryAttempts: 3,
  batchSize: 20
};

/**
 * Main performance optimization hook
 */
export function useOraclePerformanceOptimization(
  config: Partial<OptimizationConfig> = {}
) {
  const mergedConfig = useMemo(() => ({ 
    ...DEFAULT_OPTIMIZATION_CONFIG, 
    ...config 
  }), [config]);

  const [state, setState] = useState<OptimizationState>({
    isOptimizing: false,
    metrics: {
      loadTime: 0,
      renderTime: 0,
      memoryUsage: 0,
      cpuUsage: 0,
      networkLatency: 0,
      cacheHitRatio: 0,
      errorRate: 0,
      throughput: 0
    },
    recommendations: [],
    warnings: [],
    resourceUsage: {
      memory: { used: 0, total: 0, percentage: 0 },
      cpu: { usage: 0, cores: navigator.hardwareConcurrency || 4 },
      network: { bandwidth: 0, latency: 0, requests: 0 }
    },
    lastOptimizedAt: 0
  });

  const metricsRef = useRef<PerformanceMetrics[]>([]);
  const observerRef = useRef<PerformanceObserver | null>(null);

  // Performance monitoring
  const startPerformanceMonitoring = useCallback(() => {
    if (!('PerformanceObserver' in window)) return;

    try {
      observerRef.current = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            
            setState(prev => ({
              ...prev,
              metrics: {
                ...prev.metrics,
                loadTime: navEntry.loadEventEnd - navEntry.fetchStart,
                networkLatency: navEntry.responseStart - navEntry.requestStart
              }
            }));
          }
          
          if (entry.entryType === 'measure') {
            setState(prev => ({
              ...prev,
              metrics: {
                ...prev.metrics,
                renderTime: entry.duration
              }
            }));
          }
        });
      });

      observerRef.current.observe({ 
        entryTypes: ['navigation', 'measure', 'paint'] 
      });

    } catch (error) {
      console.warn('Performance monitoring not available:', error);
    }
  }, []);

  // Memory usage monitoring
  const monitorMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memoryInfo = (performance as unknown as { 
        memory: { 
          usedJSHeapSize: number; 
          totalJSHeapSize: number; 
          jsHeapSizeLimit: number; 
        } 
      }).memory;

      const used = memoryInfo.usedJSHeapSize;
      const total = memoryInfo.totalJSHeapSize;
      const limit = memoryInfo.jsHeapSizeLimit;

      setState(prev => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          memoryUsage: used / (1024 * 1024) // Convert to MB
        },
        resourceUsage: {
          ...prev.resourceUsage,
          memory: {
            used,
            total,
            percentage: (used / limit) * 100
          }
        }
      }));

      // Add warning if memory usage is high
      if ((used / limit) > 0.8) {
        setState(prev => ({
          ...prev,
          warnings: [...prev.warnings.slice(-4), 'High memory usage detected']
        }));
      }
    }
  }, []);

  // Cache optimization
  const optimizeCache = useCallback((cacheStats: CacheStatistics) => {
    const recommendations: string[] = [];

    if (cacheStats.hitRatio < 0.7) {
      recommendations.push('Increase cache size for better hit ratio');
    }

    if (cacheStats.size > cacheStats.maxSize * 0.9) {
      recommendations.push('Consider implementing cache eviction strategy');
    }

    if (cacheStats.evictions > 100) {
      recommendations.push('Cache thrashing detected - review cache keys');
    }

    setState(prev => ({
      ...prev,
      recommendations: [...prev.recommendations, ...recommendations].slice(-10)
    }));

    return recommendations;
  }, []);

  // Network optimization
  const optimizeNetwork = useCallback(() => {
    const connection = (navigator as unknown as { 
      connection?: { 
        effectiveType?: string; 
        downlink?: number; 
        rtt?: number; 
      } 
    }).connection;

    if (connection) {
      const recommendations: string[] = [];

      if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
        recommendations.push('Slow connection detected - enable data compression');
        recommendations.push('Consider reducing payload sizes');
      }

      if (connection.rtt && connection.rtt > 200) {
        recommendations.push('High latency detected - enable request batching');
      }

      setState(prev => ({
        ...prev,
        resourceUsage: {
          ...prev.resourceUsage,
          network: {
            bandwidth: connection.downlink || 0,
            latency: connection.rtt || 0,
            requests: prev.resourceUsage.network.requests
          }
        },
        recommendations: [...prev.recommendations, ...recommendations].slice(-10)
      }));
    }
  }, []);

  // Resource cleanup optimization
  const optimizeResourceCleanup = useCallback(() => {
    // Force garbage collection if available (development only)
    if (process.env.NODE_ENV === 'development' && 'gc' in window) {
      (window as unknown as { gc?: () => void }).gc?.();
    }

    // Clear performance entries to prevent memory leaks
    if ('performance' in window && 'clearMeasures' in performance) {
      performance.clearMeasures();
      performance.clearMarks();
    }

    setState(prev => ({
      ...prev,
      lastOptimizedAt: Date.now()
    }));
  }, []);

  // Main optimization function
  const optimizePerformance = useCallback(async () => {
    setState(prev => ({ ...prev, isOptimizing: true }));

    try {
      // Monitor current performance
      monitorMemoryUsage();
      optimizeNetwork();
      
      // Clean up resources
      optimizeResourceCleanup();

      // Update metrics
      const newMetrics: PerformanceMetrics = {
        loadTime: performance.now(),
        renderTime: 0,
        memoryUsage: state.metrics.memoryUsage,
        cpuUsage: 0,
        networkLatency: state.resourceUsage.network.latency,
        cacheHitRatio: 0,
        errorRate: 0,
        throughput: 0
      };

      metricsRef.current.push(newMetrics);
      if (metricsRef.current.length > 100) {
        metricsRef.current = metricsRef.current.slice(-50);
      }

      setState(prev => ({
        ...prev,
        metrics: newMetrics,
        isOptimizing: false
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        isOptimizing: false,
        warnings: [...prev.warnings.slice(-4), `Optimization error: ${error instanceof Error ? error.message : 'Unknown error'}`]
      }));
    }
  }, [monitorMemoryUsage, optimizeNetwork, optimizeResourceCleanup, state.metrics.memoryUsage, state.resourceUsage.network.latency]);

  // Initialize monitoring
  useEffect(() => {
    startPerformanceMonitoring();
    
    const interval = setInterval(() => {
      monitorMemoryUsage();
      optimizeNetwork();
    }, 5000);

    return () => {
      clearInterval(interval);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [startPerformanceMonitoring, monitorMemoryUsage, optimizeNetwork]);

  return {
    state,
    config: mergedConfig,
    metrics: metricsRef.current,
    optimizePerformance,
    optimizeCache,
    monitorMemoryUsage,
    optimizeNetwork
  };
}

/**
 * Hook for lazy loading optimization
 */
export function useLazyLoading(
  config: LazyLoadConfig = { threshold: 0.1, rootMargin: '50px', enabled: true }
) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!config.enabled || !elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: config.threshold,
        rootMargin: config.rootMargin
      }
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [config.enabled, config.threshold, config.rootMargin]);

  return { isVisible, elementRef };
}

/**
 * Hook for dynamic imports with performance tracking
 */
export function useDynamicImport<T>(
  importFunction: () => Promise<T>,
  dependencies: unknown[] = []
) {
  const [module, setModule] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    importFunction()
      .then((importedModule) => {
        if (!cancelled) {
          setModule(importedModule);
          // Module loaded successfully
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Import failed');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [importFunction, dependencies]);

  return { module, loading, error };
}

/**
 * Hook for virtual scrolling optimization
 */
export function useVirtualScrolling<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);

  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const bufferSize = Math.max(5, Math.floor(visibleCount * 0.5));

  const updateVisibleRange = useCallback((scrollTop: number) => {
    const newStartIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - bufferSize);
    const newEndIndex = Math.min(items.length - 1, newStartIndex + visibleCount + bufferSize * 2);

    setStartIndex(newStartIndex);
    setEndIndex(newEndIndex);
  }, [items.length, itemHeight, visibleCount, bufferSize]);

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index,
      style: {
        position: 'absolute' as const,
        top: (startIndex + index) * itemHeight,
        height: itemHeight
      }
    }));
  }, [items, startIndex, endIndex, itemHeight]);

  const totalHeight = items.length * itemHeight;

  return {
    visibleItems,
    totalHeight,
    updateVisibleRange,
    startIndex,
    endIndex
  };
}

export default {
  useOraclePerformanceOptimization,
  useVirtualScrolling
};
