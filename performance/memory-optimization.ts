/**
 * Memory Optimization Utilities
 * Advanced memory management for React applications
 */

import { useCallback, useRef, useEffect, useMemo } from 'react';

/**
 * Memory usage monitoring
 */
export class MemoryMonitor {
  private static instance: MemoryMonitor;
  private memoryWarningThreshold = 100 * 1024 * 1024; // 100MB
  private criticalThreshold = 200 * 1024 * 1024; // 200MB
  
  static getInstance(): MemoryMonitor {
    if (!MemoryMonitor.instance) {
      MemoryMonitor.instance = new MemoryMonitor();
    }
    return MemoryMonitor.instance;
  }
  
  getCurrentMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }
  
  getMemoryInfo() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        usage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      };
    }
    return null;
  }
  
  checkMemoryPressure(): 'low' | 'medium' | 'high' | 'critical' {
    const usage = this.getCurrentMemoryUsage();
    
    if (usage > this.criticalThreshold) return 'critical';
    if (usage > this.memoryWarningThreshold) return 'high';
    if (usage > this.memoryWarningThreshold * 0.7) return 'medium';
    return 'low';
  }
  
  async triggerGarbageCollection() {
    if ('gc' in window && typeof (window as any).gc === 'function') {
      (window as any).gc();
    }
    
    // Force cleanup of WeakMaps and WeakSets
    await new Promise(resolve => setTimeout(resolve, 0));
  }

/**
 * Object pool for reusing objects
 */
export class ObjectPool<T> {
  private pool: T[] = [];
  private createFn: () => T;
  private resetFn: (item: T) => void;
  private maxSize: number;
  
  constructor(createFn: () => T, resetFn: (item: T) => void, maxSize = 100) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.maxSize = maxSize;
  }
  
  acquire(): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    return this.createFn();
  }
  
  release(item: T): void {
    if (this.pool.length < this.maxSize) {
      this.resetFn(item);
      this.pool.push(item);
    }
  }
  
  clear(): void {
    this.pool.length = 0;
  }
  
  size(): number {
    return this.pool.length;
  }

/**
 * Efficient event listener cleanup
 */
export class EventListenerManager {
  private listeners: Array<{
    target: EventTarget;
    type: string;
    listener: EventListener;
    options?: boolean | AddEventListenerOptions;
  }> = [];
  
  addEventListener(
    target: EventTarget,
    type: string,
    listener: EventListener,
    options?: boolean | AddEventListenerOptions
  ) {
    target.addEventListener(type, listener, options);
    this.listeners.push({ target, type, listener, options });
  }
  
  removeEventListener(target: EventTarget, type: string, listener: EventListener) {
    target.removeEventListener(type, listener);
    this.listeners = this.listeners.filter(
      l => !(l.target === target && l.type === type && l.listener === listener)
    );
  }
  
  removeAllListeners() {
    this.listeners.forEach(({ target, type, listener }) => {
      target.removeEventListener(type, listener);
    });
    this.listeners.length = 0;
  }
  
  getListenerCount(): number {
    return this.listeners.length;
  }

/**
 * Memory-efficient React hooks
 */

// Stable callback that doesn't change reference unless dependencies change
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T,
  dependencies: React.DependencyList
): T {
  const callbackRef = useRef<T>(callback);
  const depsRef = useRef(dependencies);
  
  // Update callback if dependencies changed
  if (!depsRef.current || dependencies.some((dep, i) => dep !== depsRef.current[i])) {
    callbackRef.current = callback;
    depsRef.current = dependencies;
  }
  
  return useCallback(callbackRef.current, []);

// Debounced value that reduces re-renders
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);
  
  return debouncedValue;

// Efficient array operations
export function useArrayOperations<T>() {
  return useMemo(() => ({
    // Add item without mutation
    add: (array: T[], item: T) => [...array, item],
    
    // Remove item by index without mutation
    removeAt: (array: T[], index: number) => [
      ...array.slice(0, index),
      ...array.slice(index + 1)
    ],
    
    // Update item at index without mutation
    updateAt: (array: T[], index: number, newItem: T) => [
      ...array.slice(0, index),
      newItem,
      ...array.slice(index + 1)
    ],
    
    // Batch operations
    batchUpdate: (array: T[], updates: Array<{index: number, item: T}>) => {
      const newArray = [...array];
      updates.forEach(({index, item}) => {
        if (index >= 0 && index < newArray.length) {
          newArray[index] = item;
        }
      });
      return newArray;
    }
  }), []);

/**
 * Component cleanup utilities
 */
export function useComponentCleanup() {
  const cleanupTasks = useRef<(() => void)[]>([]);
  
  const addCleanupTask = useCallback((task: () => void) => {
    cleanupTasks.current.push(task);
  }, []);
  
  const cleanup = useCallback(() => {
    cleanupTasks.current.forEach(task => {
      try {
        task();
      } catch (error) {
        console.warn('Cleanup task failed:', error);
      }
    });
    cleanupTasks.current.length = 0;
  }, []);
  
  useEffect(() => {
    return cleanup;
  }, [cleanup]);
  
  return { addCleanupTask, cleanup };

/**
 * Intersection Observer for efficient visibility detection
 */
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const [entries, setEntries] = useState<IntersectionObserverEntry[]>([]);
  const observer = useRef<IntersectionObserver>();
  
  const observe = useCallback((element: Element) => {
    if (!observer.current) {
      observer.current = new IntersectionObserver((entries) => {
        setEntries(entries);
      }, options);
    }
    
    observer.current.observe(element);
    
    return () => {
      if (observer.current) {
        observer.current.unobserve(element);
      }
    };
  }, [options]);
  
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);
  
  return { entries, observe };

/**
 * Resize Observer for efficient dimension tracking
 */
export function useResizeObserver() {
  const [dimensions, setDimensions] = useState<{width: number, height: number} | null>(null);
  const observer = useRef<ResizeObserver>();
  
  const observe = useCallback((element: Element) => {
    if (!observer.current) {
      observer.current = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          setDimensions({ width, height });
        }
      });
    }
    
    observer.current.observe(element);
    
    return () => {
      if (observer.current) {
        observer.current.unobserve(element);
      }
    };
  }, []);
  
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);
  
  return { dimensions, observe };

/**
 * Memory-efficient data structures
 */
export class LRUCache<K, V> {
  private maxSize: number;
  private cache: Map<K, V>;
  
  constructor(maxSize: number) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }
  
  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }
  
  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove oldest (first) entry
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, value);
  }
  
  has(key: K): boolean {
    return this.cache.has(key);
  }
  
  delete(key: K): boolean {
    return this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  size(): number {
    return this.cache.size;
  }

// Export memory monitor instance
export const memoryMonitor = MemoryMonitor.getInstance();

// Import missing React hooks
import { useState } from 'react';