/**
 * Network Optimization Utilities
 * Advanced networking and caching strategies
 */

// Request queue for managing concurrent requests
export class RequestQueue {
}
  private queue: Array<() => Promise<any>> = [];
  private running = 0;
  private maxConcurrent = 6; // Browser typical limit
  
  constructor(maxConcurrent = 6) {
}
    this.maxConcurrent = maxConcurrent;
  }
  
  async add<T>(requestFn: () => Promise<T>): Promise<T> {
}
    return new Promise((resolve, reject) => {
}
      this.queue.push(async () => {
}
        try {
}
          const result = await requestFn();
          resolve(result);
        } catch (error) {
}
          reject(error);
        }
      });
      
      this.processQueue();
    });
  }
  
  private async processQueue() {
}
    if (this.running >= this.maxConcurrent || this.queue.length === 0) {
}
      return;
    }
    
    this.running++;
    const requestFn = this.queue.shift()!;
    
    try {
}
      await requestFn();
    } finally {
}
      this.running--;
      this.processQueue();
    }
  }
  
  clear() {
}
    this.queue.length = 0;
  }
  
  getQueueSize() {
}
    return this.queue.length;
  }
  
  getRunningCount() {
}
    return this.running;
  }
}

// Smart fetch with retries, timeouts, and caching
interface SmartFetchOptions extends RequestInit {
}
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  cache?: &apos;memory&apos; | &apos;storage&apos; | false;
  cacheTime?: number;
  priority?: &apos;high&apos; | &apos;normal&apos; | &apos;low&apos;;
}

class SmartFetcher {
}
  private memoryCache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private requestQueue = new RequestQueue();
  
  async fetch(url: string, options: SmartFetchOptions = {}): Promise<Response> {
}
    const {
}
      timeout = 10000,
      retries = 3,
      retryDelay = 1000,
      cache = &apos;memory&apos;,
      cacheTime = 300000, // 5 minutes
      priority = &apos;normal&apos;,
      ...fetchOptions
    } = options;
    
    // Check cache first
    if (cache && fetchOptions.method !== &apos;POST&apos;) {
}
      const cached = this.getCached(url, cache);
      if (cached) {
}
        return new Response(JSON.stringify(cached), { status: 200 });
      }
    }
    
    const requestFn = () => this.executeRequest(url, fetchOptions, timeout);
    
    // Add to appropriate priority queue
    const response = await this.requestQueue.add(requestFn);
    
    // Cache successful responses
    if (cache && response.ok && fetchOptions.method !== &apos;POST&apos;) {
}
      try {
}
        const clonedResponse = response.clone();
        const data = await clonedResponse.json();
        this.setCached(url, data, cache, cacheTime);
      } catch {
}
        // Failed to cache, continue
      }
    }
    
    return response;
  }
  
  private async executeRequest(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
}
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
}
      const response = await fetch(url, {
}
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
}
      clearTimeout(timeoutId);
      throw error;
    }
  }
  
  private getCached(url: string, cacheType: &apos;memory&apos; | &apos;storage&apos;): any | null {
}
    if (cacheType === &apos;memory&apos;) {
}
      const cached = this.memoryCache.get(url);
      if (cached && Date.now() - cached.timestamp < cached.ttl) {
}
        return cached.data;
      }
      this.memoryCache.delete(url);
    } else if (cacheType === &apos;storage&apos;) {
}
      try {
}
        const cached = localStorage.getItem(`fetch_cache_${url}`);
        if (cached) {
}
          const { data, timestamp, ttl } = JSON.parse(cached);
          if (Date.now() - timestamp < ttl) {
}
            return data;
          }
          localStorage.removeItem(`fetch_cache_${url}`);
        }
      } catch {
}
        // Storage access failed
      }
    }
    return null;
  }
  
  private setCached(url: string, data: any, cacheType: &apos;memory&apos; | &apos;storage&apos;, ttl: number) {
}
    const timestamp = Date.now();
    
    if (cacheType === &apos;memory&apos;) {
}
      this.memoryCache.set(url, { data, timestamp, ttl });
      
      // Clean up old entries periodically
      if (this.memoryCache.size > 100) {
}
        this.cleanMemoryCache();
      }
    } else if (cacheType === &apos;storage&apos;) {
}
      try {
}
        localStorage.setItem(`fetch_cache_${url}`, JSON.stringify({
}
          data, timestamp, ttl
        }));
      } catch {
}
        // Storage full or unavailable
      }
    }
  }
  
  private cleanMemoryCache() {
}
    const now = Date.now();
    for (const [key, cached] of this.memoryCache.entries()) {
}
      if (now - cached.timestamp > cached.ttl) {
}
        this.memoryCache.delete(key);
      }
    }
  }
  
  clearCache() {
}
    this.memoryCache.clear();
    
    // Clear localStorage cache
    try {
}
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
}
        if (key.startsWith(&apos;fetch_cache_&apos;)) {
}
          localStorage.removeItem(key);
        }
      });
    } catch {
}
      // Storage access failed
    }
  }
}

// Resource preloader for critical resources
export class ResourcePreloader {
}
  private preloadedUrls = new Set<string>();
  private preloadPromises = new Map<string, Promise<any>>();
  
  preloadImage(url: string, priority: &apos;high&apos; | &apos;low&apos; = &apos;low&apos;): Promise<HTMLImageElement> {
}
    if (this.preloadPromises.has(url)) {
}
      return this.preloadPromises.get(url)!;
    }
    
    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
}
      const img = new Image();
      img.crossOrigin = &apos;anonymous&apos;;
      
      img.onload = () => {
}
        this.preloadedUrls.add(url);
        resolve(img);
      };
      
      img.onerror = () => {
}
        this.preloadPromises.delete(url);
        reject(new Error(`Failed to preload image: ${url}`));
      };
      
      // Set priority hint if supported
      if (&apos;fetchPriority&apos; in img) {
}
        (img as any).fetchPriority = priority;
      }
      
      img.src = url;
    });
    
    this.preloadPromises.set(url, promise);
    return promise;
  }
  
  preloadScript(url: string, priority: &apos;high&apos; | &apos;low&apos; = &apos;low&apos;): Promise<void> {
}
    if (this.preloadPromises.has(url)) {
}
      return this.preloadPromises.get(url)!;
    }
    
    const promise = new Promise<void>((resolve, reject) => {
}
      const link = document.createElement(&apos;link&apos;);
      link.rel = &apos;preload&apos;;
      link.as = &apos;script&apos;;
      link.href = url;
      
      if (priority === &apos;high&apos;) {
}
        link.setAttribute(&apos;fetchpriority&apos;, &apos;high&apos;);
      }
      
      link.onload = () => {
}
        this.preloadedUrls.add(url);
        resolve();
      };
      
      link.onerror = () => {
}
        this.preloadPromises.delete(url);
        document.head.removeChild(link);
        reject(new Error(`Failed to preload script: ${url}`));
      };
      
      document.head.appendChild(link);
    });
    
    this.preloadPromises.set(url, promise);
    return promise;
  }
  
  preloadFont(url: string, type = &apos;font/woff2&apos;): Promise<void> {
}
    if (this.preloadPromises.has(url)) {
}
      return this.preloadPromises.get(url)!;
    }
    
    const promise = new Promise<void>((resolve, reject) => {
}
      const link = document.createElement(&apos;link&apos;);
      link.rel = &apos;preload&apos;;
      link.as = &apos;font&apos;;
      link.type = type;
      link.href = url;
      link.crossOrigin = &apos;anonymous&apos;;
      
      link.onload = () => {
}
        this.preloadedUrls.add(url);
        resolve();
      };
      
      link.onerror = () => {
}
        this.preloadPromises.delete(url);
        document.head.removeChild(link);
        reject(new Error(`Failed to preload font: ${url}`));
      };
      
      document.head.appendChild(link);
    });
    
    this.preloadPromises.set(url, promise);
    return promise;
  }
  
  isPreloaded(url: string): boolean {
}
    return this.preloadedUrls.has(url);
  }
  
  getPreloadedCount(): number {
}
    return this.preloadedUrls.size;
  }
  
  clear() {
}
    this.preloadedUrls.clear();
    this.preloadPromises.clear();
  }
}

// Connection monitoring and adaptive quality
export class ConnectionMonitor {
}
  private connection: any;
  private listeners: Array<(info: NetworkInfo) => void> = [];
  
  constructor() {
}
    this.connection = (navigator as any).connection || 
                     (navigator as any).mozConnection || 
                     (navigator as any).webkitConnection;
    
    if (this.connection) {
}
      this.connection.addEventListener(&apos;change&apos;, this.handleConnectionChange);
    }
  }
  
  private handleConnectionChange = () => {
}
    const info = this.getNetworkInfo();
    this.listeners.forEach(listener => listener(info));
  }
  
  getNetworkInfo(): NetworkInfo {
}
    if (!this.connection) {
}
      return {
}
        effectiveType: &apos;4g&apos;,
        downlink: 10,
        rtt: 100,
        saveData: false
      };
    }
    
    return {
}
      effectiveType: this.connection.effectiveType || &apos;4g&apos;,
      downlink: this.connection.downlink || 10,
      rtt: this.connection.rtt || 100,
      saveData: this.connection.saveData || false
    };
  }
  
  onNetworkChange(callback: (info: NetworkInfo) => void) {
}
    this.listeners.push(callback);
    
    return () => {
}
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
}
        this.listeners.splice(index, 1);
      }
    };
  }
  
  isSlowConnection(): boolean {
}
    const info = this.getNetworkInfo();
    return info.effectiveType === &apos;slow-2g&apos; || 
           info.effectiveType === &apos;2g&apos; || 
           info.saveData;
  }
  
  getRecommendedImageQuality(): &apos;high&apos; | &apos;medium&apos; | &apos;low&apos; {
}
    const info = this.getNetworkInfo();
    
    if (info.saveData) return &apos;low&apos;;
    
    switch (info.effectiveType) {
}
      case &apos;slow-2g&apos;:
      case &apos;2g&apos;:
        return &apos;low&apos;;
      case &apos;3g&apos;:
        return &apos;medium&apos;;
      default:
        return &apos;high&apos;;
    }
  }
  
  destroy() {
}
    if (this.connection) {
}
      this.connection.removeEventListener(&apos;change&apos;, this.handleConnectionChange);
    }
    this.listeners.length = 0;
  }
}

interface NetworkInfo {
}
  effectiveType: &apos;4g&apos; | &apos;3g&apos; | &apos;2g&apos; | &apos;slow-2g&apos;;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

// Batch request processor
export class BatchProcessor<T, R> {
}
  private batch: T[] = [];
  private batchSize: number;
  private batchTimeout: number;
  private processor: (batch: T[]) => Promise<R[]>;
  private timeoutId: NodeJS.Timeout | null = null;
  private resolvers: Array<{
}
    resolve: (value: R) => void;
    reject: (error: any) => void;
  }> = [];
  
  constructor(
    processor: (batch: T[]) => Promise<R[]>,
    batchSize = 10,
    batchTimeout = 100
  ) {
}
    this.processor = processor;
    this.batchSize = batchSize;
    this.batchTimeout = batchTimeout;
  }
  
  add(item: T): Promise<R> {
}
    return new Promise<R>((resolve, reject) => {
}
      this.batch.push(item);
      this.resolvers.push({ resolve, reject });
      
      if (this.batch.length >= this.batchSize) {
}
        this.processBatch();
      } else if (!this.timeoutId) {
}
        this.timeoutId = setTimeout(() => this.processBatch(), this.batchTimeout);
      }
    });
  }
  
  private async processBatch() {
}
    if (this.batch.length === 0) return;
    
    const currentBatch = [...this.batch];
    const currentResolvers = [...this.resolvers];
    
    this.batch.length = 0;
    this.resolvers.length = 0;
    
    if (this.timeoutId) {
}
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    
    try {
}
      const results = await this.processor(currentBatch);
      
      currentResolvers.forEach((resolver, index) => {
}
        if (results[index] !== undefined) {
}
          resolver.resolve(results[index]);
        } else {
}
          resolver.reject(new Error(&apos;No result for batch item&apos;));
        }
      });
    } catch (error) {
}
      currentResolvers.forEach(resolver => {
}
        resolver.reject(error);
      });
    }
  }
  
  flush(): Promise<void> {
}
    return new Promise(resolve => {
}
      if (this.batch.length === 0) {
}
        resolve();
        return;
      }
      
      const originalLength = this.batch.length;
      this.processBatch().then(() => {
}
        if (this.batch.length === 0) {
}
          resolve();
        } else {
}
          // Still items in batch, wait and try again
          setTimeout(() => this.flush().then(resolve), 10);
        }
      });
    });
  }
}

// Export instances
export const smartFetcher = new SmartFetcher();
export const resourcePreloader = new ResourcePreloader();
export const connectionMonitor = new ConnectionMonitor();

// Utility functions
export function createImageUrl(baseUrl: string, width: number, quality: string = &apos;auto&apos;): string {
}
  const url = new URL(baseUrl);
  url.searchParams.set(&apos;w&apos;, width.toString());
  url.searchParams.set(&apos;q&apos;, quality);
  url.searchParams.set(&apos;f&apos;, &apos;webp&apos;);
  return url.toString();
}

export function createSrcSet(baseUrl: string, widths: number[]): string {
}
  return widths
    .map(width => `${createImageUrl(baseUrl, width)} ${width}w`)
    .join(&apos;, &apos;);
}

export async function prefetchCriticalResources(urls: string[]) {
}
  const promises = urls.map(url => {
}
    if (url.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
}
      return resourcePreloader.preloadImage(url, &apos;high&apos;);
    } else if (url.match(/\.(js|mjs)$/i)) {
}
      return resourcePreloader.preloadScript(url, &apos;high&apos;);
    } else if (url.match(/\.(woff2|woff|ttf|otf)$/i)) {
}
      return resourcePreloader.preloadFont(url);
    } else {
}
      return smartFetcher.fetch(url, { cache: &apos;memory&apos;, priority: &apos;high&apos; });
    }
  });
  
  try {
}
    await Promise.allSettled(promises);
  } catch (error) {
}
    console.warn(&apos;Some resources failed to prefetch:&apos;, error);
  }
}