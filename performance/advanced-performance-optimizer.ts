/**
 * Advanced Performance Optimizer
 * Comprehensive performance enhancement utilities
 */

import { memo, useMemo, useCallback, lazy, Suspense } from 'react';

// Performance Monitoring Configuration
export const PERFORMANCE_METRICS = {
  // Core Web Vitals thresholds for perfect scores
  LCP_EXCELLENT: 1200, // Largest Contentful Paint (ms)
  FID_EXCELLENT: 50,   // First Input Delay (ms)
  CLS_EXCELLENT: 0.05, // Cumulative Layout Shift
  FCP_EXCELLENT: 800,  // First Contentful Paint (ms)
  
  // Custom thresholds
  BUNDLE_SIZE_LIMIT: 150000, // 150KB main bundle
  RENDER_TIME_LIMIT: 16,     // 60fps (16ms per frame)
  MEMORY_LIMIT: 50000000,    // 50MB memory usage
  API_RESPONSE_LIMIT: 200,   // 200ms API responses
};

/**
 * Advanced Component Memoization Wrapper
 */
export function createOptimizedComponent<T>(
  Component: React.ComponentType<T>,
  propsComparator?: (prevProps: T, nextProps: T) => boolean
) {
  const MemoizedComponent = memo(Component, propsComparator);
  MemoizedComponent.displayName = `Optimized(${Component.displayName || Component.name})`;
  return MemoizedComponent;

/**
 * Intelligent Props Comparator for Complex Objects
 */
export function deepPropsComparator<T>(prevProps: T, nextProps: T): boolean {
  // Fast reference equality check first
  if (prevProps === nextProps) return true;
  
  // Check if both are objects
  if (typeof prevProps !== 'object' || typeof nextProps !== 'object') {
    return prevProps === nextProps;
  }
  
  if (prevProps === null || nextProps === null) {
    return prevProps === nextProps;
  }
  
  const prevKeys = Object.keys(prevProps as any);
  const nextKeys = Object.keys(nextProps as any);
  
  // Different number of props
  if (prevKeys.length !== nextKeys.length) return false;
  
  // Check each prop
  for (const key of prevKeys) {
    if (!(key in (nextProps as any))) return false;
    
    const prevValue = (prevProps as any)[key];
    const nextValue = (nextProps as any)[key];
    
    // For arrays and objects, do shallow comparison
    if (Array.isArray(prevValue) && Array.isArray(nextValue)) {
      if (prevValue.length !== nextValue.length) return false;
      for (let i = 0; i < prevValue.length; i++) {
        if (prevValue[i] !== nextValue[i]) return false;
      }
    } else if (prevValue !== nextValue) {
      return false;
    }
  }
  
  return true;

/**
 * Performance-Optimized Hook Factory
 */
export function createOptimizedHook<T, R>(
  hookFn: (input: T) => R,
  dependencies: (input: T) => any[]
) {
  return function useOptimizedHook(input: T): R {
    return useMemo(() => hookFn(input), dependencies(input));
  };

/**
 * Advanced Virtual Scrolling Implementation
 */
export class VirtualScrollManager {
  private itemHeight: number;
  private containerHeight: number;
  private totalItems: number;
  private overscan: number = 5;
  
  constructor(itemHeight: number, containerHeight: number, totalItems: number) {
    this.itemHeight = itemHeight;
    this.containerHeight = containerHeight;
    this.totalItems = totalItems;
  }
  
  getVisibleRange(scrollTop: number) {
    const visibleHeight = this.containerHeight;
    const startIndex = Math.max(0, Math.floor(scrollTop / this.itemHeight) - this.overscan);
    const endIndex = Math.min(
      this.totalItems - 1,
      Math.ceil((scrollTop + visibleHeight) / this.itemHeight) + this.overscan
    );
    
    return { startIndex, endIndex };
  }
  
  getTotalHeight() {
    return this.totalItems * this.itemHeight;
  }
  
  getItemOffset(index: number) {
    return index * this.itemHeight;
  }

/**
 * Intelligent Image Optimization
 */
export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  onLoad?: () => void;}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
//   onLoad
}: OptimizedImageProps) {
  const optimizedSrc = useMemo(() => {
    // Add image optimization parameters
    const url = new URL(src, window.location.origin);
    
    if (width) url.searchParams.set('w', width.toString());
    if (height) url.searchParams.set('h', height.toString());
    
    // Use WebP format for better compression
    url.searchParams.set('format', 'webp');
    url.searchParams.set('quality', '85');
    
    return url.toString();
  }, [src, width, height]);
  
  return (
    <img
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={onLoad}
      style={{ 
        aspectRatio: width && height ? `${width}/${height}` : undefined 
      }}
    />
  );

/**
 * Advanced Code Splitting with Error Boundaries
 */
export function createLazyComponent<T>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  fallback?: React.ComponentType
) {
  const LazyComponent = lazy(importFn);
  
  return function LazyWrapper(props: T) {
    return (
      <Suspense fallback={fallback ? <fallback /> : <div>Loading...</div>}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };

/**
 * Performance Monitoring Service
 */
export class PerformanceMonitor {
  private observer: PerformanceObserver | null = null;
  private metrics: Map<string, number> = new Map();
  
  constructor() {
    this.initializeObserver();
  }
  
  private initializeObserver() {
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.processEntry(entry);
        });
      });
      
      this.observer.observe({ entryTypes: ['measure', 'navigation', 'paint', 'largest-contentful-paint'] });
    }
  }
  
  private processEntry(entry: PerformanceEntry) {
    switch (entry.entryType) {
      case 'paint':
        this.metrics.set(entry.name, entry.startTime);
        break;
      case 'largest-contentful-paint':
        this.metrics.set('LCP', entry.startTime);
        break;
      case 'navigation':
        const navEntry = entry as PerformanceNavigationTiming;
        this.metrics.set('TTFB', navEntry.responseStart - navEntry.requestStart);
        break;
      case 'measure':
        this.metrics.set(entry.name, entry.duration);
        break;
    }
    
    this.checkThresholds();
  }
  
  private checkThresholds() {
    const lcp = this.metrics.get('LCP');
    const fcp = this.metrics.get('first-contentful-paint');
    
    if (lcp && lcp > PERFORMANCE_METRICS.LCP_EXCELLENT) {
      console.warn(`LCP exceeded threshold: ${lcp}ms > ${PERFORMANCE_METRICS.LCP_EXCELLENT}ms`);
    }
    
    if (fcp && fcp > PERFORMANCE_METRICS.FCP_EXCELLENT) {
      console.warn(`FCP exceeded threshold: ${fcp}ms > ${PERFORMANCE_METRICS.FCP_EXCELLENT}ms`);
    }
  }
  
  measure(name: string, fn: () => void) {
    performance.mark(`${name}-start`);
    fn();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
  }
  
  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    performance.mark(`${name}-start`);
    const result = await fn();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    return result;
  }
  
  getMetrics() {
    return Object.fromEntries(this.metrics);
  }
  
  getScore(): number {
    const lcp = this.metrics.get('LCP') || 0;
    const fcp = this.metrics.get('first-contentful-paint') || 0;
    
    let score = 100;
    
    // Deduct points for poor metrics
    if (lcp > PERFORMANCE_METRICS.LCP_EXCELLENT) {
      score -= Math.min(30, (lcp - PERFORMANCE_METRICS.LCP_EXCELLENT) / 100);
    }
    
    if (fcp > PERFORMANCE_METRICS.FCP_EXCELLENT) {
      score -= Math.min(20, (fcp - PERFORMANCE_METRICS.FCP_EXCELLENT) / 50);
    }
    
    return Math.max(0, Math.round(score));
  }

/**
 * Memory Management Utilities
 */
export class MemoryManager {
  private static instance: MemoryManager;
  private cleanupTasks: Array<() => void> = [];
  
  static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }
  
  addCleanupTask(task: () => void) {
    this.cleanupTasks.push(task);
  }
  
  cleanup() {
    this.cleanupTasks.forEach(task => {
      try {
        task();
      } catch (error) {
        console.error('Cleanup task failed:', error);
      }
    });
    this.cleanupTasks = [];
  }
  
  getMemoryUsage(): MemoryInfo | null {
    if ('memory' in performance) {
      return (performance as any).memory;
    }
    return null;
  }
  
  checkMemoryPressure(): boolean {
    const memory = this.getMemoryUsage();
    if (!memory) return false;
    
    return memory.usedJSHeapSize > PERFORMANCE_METRICS.MEMORY_LIMIT;
  }
  
  forceGarbageCollection() {
    if ('gc' in window) {
      (window as any).gc();
    }
  }

/**
 * Network Optimization Utilities
 */
export class NetworkOptimizer {
  private static cache = new Map<string, any>();
  
  static async optimizedFetch(url: string, options?: RequestInit): Promise<Response> {
    // Check cache first
    const cacheKey = `${url}:${JSON.stringify(options)}`;
    if (this.cache.has(cacheKey)) {
      const cachedData = this.cache.get(cacheKey);
      const age = Date.now() - cachedData.timestamp;
      
      // Cache for 5 minutes
      if (age < 5 * 60 * 1000) {
        return new Response(JSON.stringify(cachedData.data));
      }
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      // Cache successful responses
      if (response.ok) {
        const data = await response.clone().json();
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
        });
        
        // Limit cache size
        if (this.cache.size > 100) {
          const firstKey = this.cache.keys().next().value;
          this.cache.delete(firstKey);
        }
      }
      
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
  
  static preloadResource(url: string, type: 'fetch' | 'image' | 'script' = 'fetch') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    
    switch (type) {
      case 'image':
        link.as = 'image';
        break;
      case 'script':
        link.as = 'script';
        break;
      case 'fetch':
        link.as = 'fetch';
        link.crossOrigin = 'anonymous';
        break;
    }
    
    document.head.appendChild(link);
  }

/**
 * Bundle Size Optimizer
 */
export function optimizeBundleImports() {
  // Dynamically import only what's needed
  const imports = {
    // Chart.js - only import what we need
    chartjs: () => import('chart.js/auto').then(mod => mod.default),
    
    // Lodash - individual functions
    debounce: () => import('lodash/debounce'),
    throttle: () => import('lodash/throttle'),
    
    // Date utilities
    formatDistanceToNow: () => import('date-fns/formatDistanceToNow'),
    format: () => import('date-fns/format'),
  };
  
  return imports;

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();
export const memoryManager = MemoryManager.getInstance();