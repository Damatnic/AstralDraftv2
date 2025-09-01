/**
 * React Hooks for Memory-Safe Operations
 * Provides automatic cleanup and memory leak prevention
 */

import { useEffect, useRef, useCallback, useMemo } from 'react';
import { memoryManager, createMemoryScope } from '../utils/memoryCleanup';

/**
 * Hook for memory-safe timeouts
 */
export function useSafeTimeout() {
  const scope = useRef(createMemoryScope());

  useEffect(() => {
    const currentScope = scope.current;
    return () => {
      currentScope.cleanup();
    };
  }, []);

  const setTimeout = useCallback((callback: () => void, delay: number) => {
    return scope.current.setTimeout(callback, delay);
  }, []);

  const clearTimeout = useCallback((timer: NodeJS.Timeout) => {
    scope.current.clearTimeout(timer);
  }, []);

  return { setTimeout, clearTimeout };
}

/**
 * Hook for memory-safe intervals
 */
export function useSafeInterval() {
  const scope = useRef(createMemoryScope());

  useEffect(() => {
    const currentScope = scope.current;
    return () => {
      currentScope.cleanup();
    };
  }, []);

  const setInterval = useCallback((callback: () => void, delay: number) => {
    return scope.current.setInterval(callback, delay);
  }, []);

  const clearInterval = useCallback((interval: NodeJS.Timeout) => {
    scope.current.clearInterval(interval);
  }, []);

  return { setInterval, clearInterval };
}

/**
 * Hook for memory-safe event listeners
 */
export function useSafeEventListener<K extends keyof WindowEventMap>(
  type: K,
  listener: (event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions
): void;
export function useSafeEventListener<K extends keyof DocumentEventMap>(
  type: K,
  listener: (event: DocumentEventMap[K]) => void,
  options?: AddEventListenerOptions,
  target?: Document
): void;
export function useSafeEventListener<K extends keyof HTMLElementEventMap>(
  type: K,
  listener: (event: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions,
  target?: HTMLElement | null
): void;
export function useSafeEventListener(
  type: string,
  listener: EventListener,
  options?: AddEventListenerOptions,
  target?: EventTarget | null
): void {
  const savedListener = useRef<EventListener>();

  useEffect(() => {
    savedListener.current = listener;
  }, [listener]);

  useEffect(() => {
    const eventTarget = target || window;
    if (!eventTarget) return;

    const eventListener: EventListener = (event) => {
      if (savedListener.current) {
        savedListener.current(event);
      }
    };

    const cleanup = memoryManager.addEventListener(
      eventTarget,
      type,
      eventListener,
      options
    );

    return cleanup;
  }, [type, options, target]);
}

/**
 * Hook for memory-safe intersection observer
 */
export function useSafeIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) {
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observer.current = memoryManager.registerObserver(
      new IntersectionObserver(callback, options)
    );

    return () => {
      if (observer.current) {
        memoryManager.unregisterObserver(observer.current);
        observer.current = null;
      }
    };
  }, [callback, options]);

  const observe = useCallback((element: Element) => {
    observer.current?.observe(element);
  }, []);

  const unobserve = useCallback((element: Element) => {
    observer.current?.unobserve(element);
  }, []);

  const disconnect = useCallback(() => {
    observer.current?.disconnect();
  }, []);

  return { observe, unobserve, disconnect };
}

/**
 * Hook for memory-safe mutation observer
 */
export function useSafeMutationObserver(
  callback: MutationCallback,
  options?: MutationObserverInit
) {
  const observer = useRef<MutationObserver | null>(null);

  useEffect(() => {
    observer.current = memoryManager.registerObserver(
      new MutationObserver(callback)
    );

    return () => {
      if (observer.current) {
        memoryManager.unregisterObserver(observer.current);
        observer.current = null;
      }
    };
  }, [callback]);

  const observe = useCallback((target: Node, options?: MutationObserverInit) => {
    observer.current?.observe(target, options);
  }, []);

  const disconnect = useCallback(() => {
    observer.current?.disconnect();
  }, []);

  const takeRecords = useCallback(() => {
    return observer.current?.takeRecords() || [];
  }, []);

  return { observe, disconnect, takeRecords };
}

/**
 * Hook for memory-safe resize observer
 */
export function useSafeResizeObserver(callback: ResizeObserverCallback) {
  const observer = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    observer.current = memoryManager.registerObserver(
      new ResizeObserver(callback)
    );

    return () => {
      if (observer.current) {
        memoryManager.unregisterObserver(observer.current);
        observer.current = null;
      }
    };
  }, [callback]);

  const observe = useCallback((target: Element, options?: ResizeObserverOptions) => {
    observer.current?.observe(target, options);
  }, []);

  const unobserve = useCallback((target: Element) => {
    observer.current?.unobserve(target);
  }, []);

  const disconnect = useCallback(() => {
    observer.current?.disconnect();
  }, []);

  return { observe, unobserve, disconnect };
}

/**
 * Hook for memory-safe fetch with AbortController
 */
export function useSafeFetch() {
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (controllerRef.current && !controllerRef.current.signal.aborted) {
        controllerRef.current.abort();
      }
    };
  }, []);

  const safeFetch = useCallback(async (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> => {
    // Abort previous request if still pending
    if (controllerRef.current && !controllerRef.current.signal.aborted) {
      controllerRef.current.abort();
    }

    // Create new controller
    controllerRef.current = memoryManager.createAbortController();

    try {
      const response = await fetch(input, {
        ...init,
        signal: controllerRef.current.signal
      });
      return response;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('[SafeFetch] Request aborted');
      }
      throw error;
    }
  }, []);

  const abort = useCallback(() => {
    if (controllerRef.current && !controllerRef.current.signal.aborted) {
      controllerRef.current.abort();
    }
  }, []);

  return { fetch: safeFetch, abort };
}

/**
 * Hook for automatic memory cleanup on component unmount
 */
export function useMemoryCleanup(cleanupFn?: () => void) {
  const scope = useRef(createMemoryScope());

  useEffect(() => {
    const currentScope = scope.current;
    
    if (cleanupFn) {
      currentScope.registerCleanup(cleanupFn);
    }

    return () => {
      currentScope.cleanup();
    };
  }, [cleanupFn]);

  return scope.current;
}

/**
 * Hook to monitor component memory usage
 */
export function useMemoryMonitor(componentName: string) {
  const mountTime = useRef(Date.now());
  const initialMemory = useRef(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const memory = (performance as any).memory;
      if (memory) {
        initialMemory.current = memory.usedJSHeapSize;
        console.log(`[Memory Monitor] ${componentName} mounted - Initial: ${(initialMemory.current / 1024 / 1024).toFixed(2)}MB`);
      }
    }

    return () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const memory = (performance as any).memory;
        if (memory) {
          const finalMemory = memory.usedJSHeapSize;
          const memoryDiff = finalMemory - initialMemory.current;
          const lifetime = Date.now() - mountTime.current;
          
          console.log(`[Memory Monitor] ${componentName} unmounted`, {
            lifetime: `${(lifetime / 1000).toFixed(1)}s`,
            initialMemory: `${(initialMemory.current / 1024 / 1024).toFixed(2)}MB`,
            finalMemory: `${(finalMemory / 1024 / 1024).toFixed(2)}MB`,
            difference: `${memoryDiff > 0 ? '+' : ''}${(memoryDiff / 1024 / 1024).toFixed(2)}MB`
          });

          // Warn if memory increased significantly
          if (memoryDiff > 5 * 1024 * 1024) { // 5MB
            console.warn(`[Memory Leak Warning] ${componentName} may have a memory leak - ${(memoryDiff / 1024 / 1024).toFixed(2)}MB retained`);
          }
        }
      }
    };
  }, [componentName]);
}

/**
 * Hook for debounced callbacks with cleanup
 */
export function useSafeDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const { setTimeout, clearTimeout } = useSafeTimeout();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
      timeoutRef.current = null;
    }, delay);
  }, [callback, delay, setTimeout, clearTimeout]) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [clearTimeout]);

  return debouncedCallback;
}

/**
 * Hook for throttled callbacks with cleanup
 */
export function useSafeThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const { setTimeout } = useSafeTimeout();
  const lastRun = useRef(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const throttledCallback = useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastRun = now - lastRun.current;

    if (timeSinceLastRun >= delay) {
      callback(...args);
      lastRun.current = now;
    } else if (!timeoutRef.current) {
      const remainingTime = delay - timeSinceLastRun;
      timeoutRef.current = setTimeout(() => {
        callback(...args);
        lastRun.current = Date.now();
        timeoutRef.current = null;
      }, remainingTime);
    }
  }, [callback, delay, setTimeout]) as T;

  return throttledCallback;
}

/**
 * Hook for RAF (RequestAnimationFrame) with cleanup
 */
export function useSafeRAF() {
  const rafIds = useRef<Set<number>>(new Set());

  const requestAnimationFrame = useCallback((callback: FrameRequestCallback): number => {
    const id = window.requestAnimationFrame((time) => {
      rafIds.current.delete(id);
      callback(time);
    });
    rafIds.current.add(id);
    return id;
  }, []);

  const cancelAnimationFrame = useCallback((id: number) => {
    window.cancelAnimationFrame(id);
    rafIds.current.delete(id);
  }, []);

  useEffect(() => {
    return () => {
      rafIds.current.forEach(id => window.cancelAnimationFrame(id));
      rafIds.current.clear();
    };
  }, []);

  return { requestAnimationFrame, cancelAnimationFrame };
}

/**
 * Hook to detect and prevent memory leaks
 */
export function useLeakDetector(threshold = 10 * 1024 * 1024) { // 10MB default
  const checkInterval = useRef<NodeJS.Timeout | null>(null);
  const { setInterval, clearInterval } = useSafeInterval();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const memory = (performance as any).memory;
      if (memory) {
        let lastMemory = memory.usedJSHeapSize;
        let consecutiveIncreases = 0;

        checkInterval.current = setInterval(() => {
          const currentMemory = memory.usedJSHeapSize;
          const diff = currentMemory - lastMemory;

          if (diff > threshold) {
            consecutiveIncreases++;
            
            if (consecutiveIncreases >= 3) {
              console.error('[Memory Leak Detected]', {
                current: `${(currentMemory / 1024 / 1024).toFixed(2)}MB`,
                increase: `${(diff / 1024 / 1024).toFixed(2)}MB`,
                consecutiveIncreases
              });

              // Dispatch memory pressure event
              window.dispatchEvent(new CustomEvent('memory-leak-detected', {
                detail: { currentMemory, increase: diff }
              }));

              consecutiveIncreases = 0;
            }
          } else {
            consecutiveIncreases = 0;
          }

          lastMemory = currentMemory;
        }, 5000); // Check every 5 seconds
      }
    }

    return () => {
      if (checkInterval.current) {
        clearInterval(checkInterval.current);
      }
    };
  }, [threshold, setInterval, clearInterval]);
}