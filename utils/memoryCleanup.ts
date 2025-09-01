/**
 * Memory Cleanup Utilities
 * Centralized memory leak prevention and cleanup system
 */

// Track all active timers, intervals, and listeners
class MemoryCleanupManager {
}
  private timers = new Set<NodeJS.Timeout>();
  private intervals = new Set<NodeJS.Timeout>();
  private listeners = new Map<EventTarget, Map<string, Set<EventListener>>>();
  private observers = new Set<MutationObserver | IntersectionObserver | PerformanceObserver | ResizeObserver>();
  private abortControllers = new Set<AbortController>();
  private cleanupCallbacks = new Set<() => void>();
  private memoryUsage = {
}
    baseline: 0,
    current: 0,
    peak: 0,
    leaks: 0
  };

  constructor() {
}
    this.initializeMemoryMonitoring();
  }

  /**
   * Initialize memory monitoring
   */
  private initializeMemoryMonitoring() {
}
    if (typeof window !== &apos;undefined&apos; && &apos;performance&apos; in window) {
}
      const memory = (performance as any).memory;
      if (memory) {
}
        this.memoryUsage.baseline = memory.usedJSHeapSize;
        this.memoryUsage.current = memory.usedJSHeapSize;
        
        // Monitor memory usage every 10 seconds
        const monitorInterval = setInterval(() => {
}
          this.checkMemoryUsage();
        }, 10000);
        
        // Store the interval for cleanup
        this.intervals.add(monitorInterval);
      }
    }
  }

  /**
   * Check current memory usage and detect potential leaks
   */
  private checkMemoryUsage() {
}
    if (typeof window === &apos;undefined&apos; || !(&apos;performance&apos; in window)) return;
    
    const memory = (performance as any).memory;
    if (!memory) return;

    const currentUsage = memory.usedJSHeapSize;
    const previousUsage = this.memoryUsage.current;
    
    this.memoryUsage.current = currentUsage;
    this.memoryUsage.peak = Math.max(this.memoryUsage.peak, currentUsage);

    // Detect potential memory leak (consistent growth over 50MB from baseline)
    const growthFromBaseline = currentUsage - this.memoryUsage.baseline;
    if (growthFromBaseline > 50 * 1024 * 1024) { // 50MB
}
      this.memoryUsage.leaks++;
      console.warn(&apos;[Memory Leak Detected]&apos;, {
}
        baseline: this.formatBytes(this.memoryUsage.baseline),
        current: this.formatBytes(currentUsage),
        growth: this.formatBytes(growthFromBaseline),
        leakCount: this.memoryUsage.leaks
      });
      
      // Trigger emergency cleanup if memory usage is critical
      if (growthFromBaseline > 100 * 1024 * 1024) { // 100MB
}
        this.performEmergencyCleanup();
      }
    }
  }

  /**
   * Format bytes to human readable format
   */
  private formatBytes(bytes: number): string {
}
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  }

  /**
   * Perform emergency cleanup when memory is critical
   */
  private performEmergencyCleanup() {
}
    console.warn(&apos;[Emergency Memory Cleanup] Performing aggressive cleanup...&apos;);
    
    // Clear all non-essential caches
    if (&apos;caches&apos; in window) {
}
      caches.keys().then(names => {
}
        names.forEach((name: any) => {
}
          if (!name.includes(&apos;essential&apos;)) {
}
            caches.delete(name);
          }
        });
      });
    }

    // Force garbage collection if available (Chrome with --expose-gc flag)
    if (typeof (window as any).gc === &apos;function&apos;) {
}
      (window as any).gc();
    }

    // Dispatch custom event for components to clean up
    window.dispatchEvent(new CustomEvent(&apos;memory-pressure&apos;, { 
}
      detail: { level: &apos;critical&apos; } 
    }));
  }

  /**
   * Register a timer and return wrapped timer ID
   */
  registerTimer(callback: () => void, delay: number): NodeJS.Timeout {
}
    const timer = setTimeout(() => {
}
      this.timers.delete(timer);
      callback();
    }, delay);
    this.timers.add(timer);
    return timer;
  }

  /**
   * Register an interval and return wrapped interval ID
   */
  registerInterval(callback: () => void, delay: number): NodeJS.Timeout {
}
    const interval = setInterval(callback, delay);
    this.intervals.add(interval);
    return interval;
  }

  /**
   * Clear a registered timer
   */
  clearTimer(timer: NodeJS.Timeout) {
}
    if (this.timers.has(timer)) {
}
      clearTimeout(timer);
      this.timers.delete(timer);
    }
  }

  /**
   * Clear a registered interval
   */
  clearInterval(interval: NodeJS.Timeout) {
}
    if (this.intervals.has(interval)) {
}
      clearInterval(interval);
      this.intervals.delete(interval);
    }
  }

  /**
   * Register an event listener with automatic cleanup
   */
  addEventListener(
    target: EventTarget,
    type: string,
    listener: EventListener,
    options?: AddEventListenerOptions
  ): () => void {
}
    // Get or create listener map for target
    if (!this.listeners.has(target)) {
}
      this.listeners.set(target, new Map());
    }
    
    const targetListeners = this.listeners.get(target)!;
    
    // Get or create listener set for event type
    if (!targetListeners.has(type)) {
}
      targetListeners.set(type, new Set());
    }
    
    const typeListeners = targetListeners.get(type)!;
    typeListeners.add(listener);
    
    // Add the actual listener
    target.addEventListener(type, listener, options);
    
    // Return cleanup function return() => {
}
      this.removeEventListener(target, type, listener, options);
    };
  }

  /**
   * Remove a registered event listener
   */
  removeEventListener(
    target: EventTarget,
    type: string,
    listener: EventListener,
    options?: EventListenerOptions
  ) {
}
    const targetListeners = this.listeners.get(target);
    if (!targetListeners) return;
    
    const typeListeners = targetListeners.get(type);
    if (!typeListeners) return;
    
    typeListeners.delete(listener);
    target.removeEventListener(type, listener, options);
    
    // Clean up empty maps
    if (typeListeners.size === 0) {
}
      targetListeners.delete(type);
    }
    if (targetListeners.size === 0) {
}
      this.listeners.delete(target);
    }
  }

  /**
   * Register an observer with automatic cleanup
   */
  registerObserver<T extends MutationObserver | IntersectionObserver | PerformanceObserver | ResizeObserver>(
    observer: T
  ): T {
}
    this.observers.add(observer);
    return observer;
  }

  /**
   * Unregister and disconnect an observer
   */
  unregisterObserver(observer: MutationObserver | IntersectionObserver | PerformanceObserver | ResizeObserver) {
}
    if (this.observers.has(observer)) {
}
      observer.disconnect();
      this.observers.delete(observer);
    }
  }

  /**
   * Create an AbortController with automatic cleanup
   */
  createAbortController(): AbortController {
}
    const controller = new AbortController();
    this.abortControllers.add(controller);
    return controller;
  }

  /**
   * Register a cleanup callback
   */
  registerCleanup(callback: () => void) {
}
    this.cleanupCallbacks.add(callback);
  }

  /**
   * Clean up all registered resources
   */
  cleanup() {
}
    console.log(&apos;[Memory Cleanup] Starting comprehensive cleanup...&apos;);
    
    // Clear all timers
    this.timers.forEach((timer: any) => clearTimeout(timer));
    this.timers.clear();
    
    // Clear all intervals
    this.intervals.forEach((interval: any) => clearInterval(interval));
    this.intervals.clear();
    
    // Remove all event listeners
    this.listeners.forEach((typeMap, target) => {
}
      typeMap.forEach((listeners, type) => {
}
        listeners.forEach((listener: any) => {
}
          target.removeEventListener(type, listener);
        });
      });
    });
    this.listeners.clear();
    
    // Disconnect all observers
    this.observers.forEach((observer: any) => observer.disconnect());
    this.observers.clear();
    
    // Abort all controllers
    this.abortControllers.forEach((controller: any) => {
}
      if (!controller.signal.aborted) {
}
        controller.abort();
      }
    });
    this.abortControllers.clear();
    
    // Execute all cleanup callbacks
    this.cleanupCallbacks.forEach((callback: any) => {
}
      try {
}
        callback();
      } catch (error) {
}
        console.error(&apos;[Memory Cleanup] Error in cleanup callback:&apos;, error);
      }
    });
    this.cleanupCallbacks.clear();
    
    console.log(&apos;[Memory Cleanup] Cleanup complete&apos;);
  }

  /**
   * Get current memory statistics
   */
  getMemoryStats() {
}
    return {
}
      ...this.memoryUsage,
      activeTimers: this.timers.size,
      activeIntervals: this.intervals.size,
      activeListeners: Array.from(this.listeners.values()).reduce(
        (sum, typeMap) => sum + Array.from(typeMap.values()).reduce(
          (typeSum, listeners) => typeSum + listeners.size, 0
        ), 0
      ),
      activeObservers: this.observers.size,
      activeAbortControllers: this.abortControllers.size,
      cleanupCallbacks: this.cleanupCallbacks.size
    };
  }

  /**
   * Create a scoped cleanup manager for a component
   */
  createScope(): ComponentMemoryScope {
}
    return new ComponentMemoryScope(this);
  }
}

/**
 * Component-scoped memory management
 */
class ComponentMemoryScope {
}
  private manager: MemoryCleanupManager;
  private scopeTimers = new Set<NodeJS.Timeout>();
  private scopeIntervals = new Set<NodeJS.Timeout>();
  private scopeCleanups = new Set<() => void>();

  constructor(manager: MemoryCleanupManager) {
}
    this.manager = manager;
  }

  /**
   * Register a timer in this scope
   */
  setTimeout(callback: () => void, delay: number): NodeJS.Timeout {
}
    const timer = this.manager.registerTimer(() => {
}
      this.scopeTimers.delete(timer);
      callback();
    }, delay);
    this.scopeTimers.add(timer);
    return timer;
  }

  /**
   * Register an interval in this scope
   */
  setInterval(callback: () => void, delay: number): NodeJS.Timeout {
}
    const interval = this.manager.registerInterval(callback, delay);
    this.scopeIntervals.add(interval);
    return interval;
  }

  /**
   * Clear a timer in this scope
   */
  clearTimeout(timer: NodeJS.Timeout) {
}
    if (this.scopeTimers.has(timer)) {
}
      this.manager.clearTimer(timer);
      this.scopeTimers.delete(timer);
    }
  }

  /**
   * Clear an interval in this scope
   */
  clearInterval(interval: NodeJS.Timeout) {
}
    if (this.scopeIntervals.has(interval)) {
}
      this.manager.clearInterval(interval);
      this.scopeIntervals.delete(interval);
    }
  }

  /**
   * Add event listener in this scope
   */
  addEventListener(
    target: EventTarget,
    type: string,
    listener: EventListener,
    options?: AddEventListenerOptions
  ): () => void {
}
    const cleanup = this.manager.addEventListener(target, type, listener, options);
    this.scopeCleanups.add(cleanup);
    return cleanup;
  }

  /**
   * Register cleanup callback for this scope
   */
  registerCleanup(callback: () => void) {
}
    this.scopeCleanups.add(callback);
    this.manager.registerCleanup(callback);
  }

  /**
   * Clean up all resources in this scope
   */
  cleanup() {
}
    // Clear all scope timers
    this.scopeTimers.forEach((timer: any) => this.manager.clearTimer(timer));
    this.scopeTimers.clear();
    
    // Clear all scope intervals
    this.scopeIntervals.forEach((interval: any) => this.manager.clearInterval(interval));
    this.scopeIntervals.clear();
    
    // Execute all scope cleanups
    this.scopeCleanups.forEach((cleanup: any) => {
}
      try {
}
        cleanup();
      } catch (error) {
}
        console.error(&apos;[Scope Cleanup] Error:&apos;, error);
      }
    });
    this.scopeCleanups.clear();
  }
}

// Create singleton instance
export const memoryManager = new MemoryCleanupManager();

// Export convenience functions
export const managedSetTimeout = (callback: () => void, delay: number) => 
  memoryManager.registerTimer(callback, delay);

export const managedSetInterval = (callback: () => void, delay: number) => 
  memoryManager.registerInterval(callback, delay);

export const managedAddEventListener = (
  target: EventTarget,
  type: string,
  listener: EventListener,
  options?: AddEventListenerOptions
) => memoryManager.addEventListener(target, type, listener, options);

export const createMemoryScope = () => memoryManager.createScope();

// Auto-cleanup on page unload
if (typeof window !== &apos;undefined&apos;) {
}
  window.addEventListener(&apos;beforeunload&apos;, () => {
}
    memoryManager.cleanup();
  });
  
  // Also cleanup on visibility change (mobile background)
  document.addEventListener(&apos;visibilitychange&apos;, () => {
}
    if (document.visibilityState === &apos;hidden&apos;) {
}
      // Partial cleanup when going to background
      const stats = memoryManager.getMemoryStats();
      if (stats.current > stats.baseline + 30 * 1024 * 1024) { // 30MB growth
}
        console.log(&apos;[Memory Cleanup] Performing background cleanup...&apos;);
        memoryManager.cleanup();
      }
    }
  });
}