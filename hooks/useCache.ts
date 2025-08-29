import { useState, useCallback, useEffect, useRef } from 'react';

export interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

export interface CacheConfig {
  maxSize: number;
  defaultTtl: number;
  enablePersistence: boolean;
  storageKey: string;
  evictionPolicy: 'lru' | 'lfu' | 'ttl';
}

export interface CacheStats {
  size: number;
  hitRate: number;
  missRate: number;
  totalRequests: number;
  totalHits: number;
  totalMisses: number;
  evictions: number;
  lastUpdated: number;
}

export interface CacheState<T = unknown> {
  cache: Map<string, CacheEntry<T>>;
  stats: CacheStats;
  config: CacheConfig;
  lastUpdated: number;
}

export interface CacheActions<T = unknown> {
  get: (key: string) => T | null;
  set: (key: string, value: T, ttl?: number) => void;
  has: (key: string) => boolean;
  delete: (key: string) => boolean;
  clear: () => void;
  invalidate: (pattern?: string | RegExp) => number;
  getStats: () => CacheStats;
  updateConfig: (newConfig: Partial<CacheConfig>) => void;
  preload: (data: Record<string, T>) => void;
  export: () => string;
  import: (data: string) => void;
}

const DEFAULT_CONFIG: CacheConfig = {
  maxSize: 1000,
  defaultTtl: 300000, // 5 minutes
  enablePersistence: false,
  storageKey: 'app-cache',
  evictionPolicy: 'lru'
};

const DEFAULT_STATS: CacheStats = {
  size: 0,
  hitRate: 0,
  missRate: 0,
  totalRequests: 0,
  totalHits: 0,
  totalMisses: 0,
  evictions: 0,
  lastUpdated: Date.now()
};

export function useCache<T = unknown>(initialConfig: Partial<CacheConfig> = {}): [CacheState<T>, CacheActions<T>] {
  const config = { ...DEFAULT_CONFIG, ...initialConfig };
  
  const [state, setState] = useState<CacheState<T>>(() => ({
    cache: new Map(),
    stats: { ...DEFAULT_STATS },
    config,
    lastUpdated: Date.now()
  }));

  const cleanupTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastCleanupRef = useRef<number>(Date.now());

  // Cleanup expired entries
  const cleanup = useCallback(() => {
    const now = Date.now();
    
    setState(prevState => {
      const newCache = new Map(prevState.cache);
      let evicted = 0;

      for (const [key, entry] of newCache.entries()) {
        if (now - entry.timestamp > entry.ttl) {
          newCache.delete(key);
          evicted++;
        }
      }

      if (evicted > 0) {
        return {
          ...prevState,
          cache: newCache,
          stats: {
            ...prevState.stats,
            size: newCache.size,
            evictions: prevState.stats.evictions + evicted,
            lastUpdated: now
          },
          lastUpdated: now
        };
      }

      return prevState;
    });

    lastCleanupRef.current = now;
  }, []);

  // Start cleanup timer
  useEffect(() => {
    cleanupTimerRef.current = setInterval(cleanup, 60000); // Cleanup every minute
    return () => {
      if (cleanupTimerRef.current) {
        clearInterval(cleanupTimerRef.current);
      }
    };
  }, [cleanup]);

  // Evict entries based on policy
  const evictEntries = useCallback((currentCache: Map<string, CacheEntry<T>>, targetSize: number) => {
    const entries = Array.from(currentCache.entries());
    const policy = state.config.evictionPolicy;

    if (policy === 'lru') {
      entries.sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed);
    } else if (policy === 'lfu') {
      entries.sort(([, a], [, b]) => a.accessCount - b.accessCount);
    } else if (policy === 'ttl') {
      const now = Date.now();
      entries.sort(([, a], [, b]) => {
        const remainingA = a.ttl - (now - a.timestamp);
        const remainingB = b.ttl - (now - b.timestamp);
        return remainingA - remainingB;
      });
    }

    const toEvict = entries.length - targetSize;
    const evictedKeys = entries.slice(0, toEvict).map(([key]) => key);
    
    evictedKeys.forEach(key => currentCache.delete(key));
    
    return evictedKeys.length;
  }, [state.config.evictionPolicy]);

  // Cache actions
  const get = useCallback((key: string): T | null => {
    const now = Date.now();
    
    setState(prevState => {
      const entry = prevState.cache.get(key);
      
      if (!entry) {
        // Cache miss
        return {
          ...prevState,
          stats: {
            ...prevState.stats,
            totalRequests: prevState.stats.totalRequests + 1,
            totalMisses: prevState.stats.totalMisses + 1,
            missRate: ((prevState.stats.totalMisses + 1) / (prevState.stats.totalRequests + 1)) * 100,
            hitRate: (prevState.stats.totalHits / (prevState.stats.totalRequests + 1)) * 100,
            lastUpdated: now
          },
          lastUpdated: now
        };
      }

      // Check if expired
      if (now - entry.timestamp > entry.ttl) {
        const newCache = new Map(prevState.cache);
        newCache.delete(key);
        
        return {
          ...prevState,
          cache: newCache,
          stats: {
            ...prevState.stats,
            size: newCache.size,
            totalRequests: prevState.stats.totalRequests + 1,
            totalMisses: prevState.stats.totalMisses + 1,
            missRate: ((prevState.stats.totalMisses + 1) / (prevState.stats.totalRequests + 1)) * 100,
            hitRate: (prevState.stats.totalHits / (prevState.stats.totalRequests + 1)) * 100,
            evictions: prevState.stats.evictions + 1,
            lastUpdated: now
          },
          lastUpdated: now
        };
      }

      // Cache hit - update access info
      const newCache = new Map(prevState.cache);
      const updatedEntry: CacheEntry<T> = {
        ...entry,
        accessCount: entry.accessCount + 1,
        lastAccessed: now
      };
      newCache.set(key, updatedEntry);

      return {
        ...prevState,
        cache: newCache,
        stats: {
          ...prevState.stats,
          totalRequests: prevState.stats.totalRequests + 1,
          totalHits: prevState.stats.totalHits + 1,
          hitRate: ((prevState.stats.totalHits + 1) / (prevState.stats.totalRequests + 1)) * 100,
          missRate: (prevState.stats.totalMisses / (prevState.stats.totalRequests + 1)) * 100,
          lastUpdated: now
        },
        lastUpdated: now
      };
    });

    const entry = state.cache.get(key);
    if (entry && Date.now() - entry.timestamp <= entry.ttl) {
      return entry.data;
    }
    
    return null;
  }, [state.cache]);

  const set = useCallback((key: string, value: T, ttl?: number) => {
    const now = Date.now();
    const entryTtl = ttl || state.config.defaultTtl;

    setState(prevState => {
      const newCache = new Map(prevState.cache);
      
      // Check if we need to evict entries
      let evicted = 0;
      if (newCache.size >= prevState.config.maxSize && !newCache.has(key)) {
        evicted = evictEntries(newCache, prevState.config.maxSize - 1);
      }

      const newEntry: CacheEntry<T> = {
        data: value,
        timestamp: now,
        ttl: entryTtl,
        accessCount: 0,
        lastAccessed: now
      };

      newCache.set(key, newEntry);

      return {
        ...prevState,
        cache: newCache,
        stats: {
          ...prevState.stats,
          size: newCache.size,
          evictions: prevState.stats.evictions + evicted,
          lastUpdated: now
        },
        lastUpdated: now
      };
    });
  }, [state.config.defaultTtl, evictEntries]);

  const has = useCallback((key: string): boolean => {
    const entry = state.cache.get(key);
    if (!entry) return false;
    
    const now = Date.now();
    return now - entry.timestamp <= entry.ttl;
  }, [state.cache]);

  const deleteEntry = useCallback((key: string): boolean => {
    let deleted = false;
    
    setState(prevState => {
      if (prevState.cache.has(key)) {
        const newCache = new Map(prevState.cache);
        newCache.delete(key);
        deleted = true;
        
        return {
          ...prevState,
          cache: newCache,
          stats: {
            ...prevState.stats,
            size: newCache.size,
            lastUpdated: Date.now()
          },
          lastUpdated: Date.now()
        };
      }
      
      return prevState;
    });
    
    return deleted;
  }, []);

  const clear = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      cache: new Map(),
      stats: {
        ...DEFAULT_STATS,
        totalRequests: prevState.stats.totalRequests,
        totalHits: prevState.stats.totalHits,
        totalMisses: prevState.stats.totalMisses,
        evictions: prevState.stats.evictions,
        lastUpdated: Date.now()
      },
      lastUpdated: Date.now()
    }));
  }, []);

  const invalidate = useCallback((pattern?: string | RegExp): number => {
    let invalidated = 0;
    
    setState(prevState => {
      const newCache = new Map(prevState.cache);
      
      if (!pattern) {
        invalidated = newCache.size;
        newCache.clear();
      } else {
        for (const key of newCache.keys()) {
          let shouldDelete = false;
          
          if (typeof pattern === 'string') {
            shouldDelete = key.includes(pattern);
          } else {
            shouldDelete = pattern.test(key);
          }
          
          if (shouldDelete) {
            newCache.delete(key);
            invalidated++;
          }
        }
      }
      
      return {
        ...prevState,
        cache: newCache,
        stats: {
          ...prevState.stats,
          size: newCache.size,
          evictions: prevState.stats.evictions + invalidated,
          lastUpdated: Date.now()
        },
        lastUpdated: Date.now()
      };
    });
    
    return invalidated;
  }, []);

  const getStats = useCallback((): CacheStats => {
    return { ...state.stats };
  }, [state.stats]);

  const updateConfig = useCallback((newConfig: Partial<CacheConfig>) => {
    setState(prevState => ({
      ...prevState,
      config: { ...prevState.config, ...newConfig },
      lastUpdated: Date.now()
    }));
  }, []);

  const preload = useCallback((data: Record<string, T>) => {
    const now = Date.now();
    
    setState(prevState => {
      const newCache = new Map(prevState.cache);
      
      for (const [key, value] of Object.entries(data)) {
        if (!newCache.has(key)) {
          const entry: CacheEntry<T> = {
            data: value,
            timestamp: now,
            ttl: prevState.config.defaultTtl,
            accessCount: 0,
            lastAccessed: now
          };
          
          newCache.set(key, entry);
          
          // Check size limit
          if (newCache.size >= prevState.config.maxSize) {
            break;
          }
        }
      }
      
      return {
        ...prevState,
        cache: newCache,
        stats: {
          ...prevState.stats,
          size: newCache.size,
          lastUpdated: now
        },
        lastUpdated: now
      };
    });
  }, []);

  const exportCache = useCallback((): string => {
    const exportData = {
      cache: Array.from(state.cache.entries()),
      stats: state.stats,
      config: state.config,
      exportedAt: Date.now()
    };
    
    return JSON.stringify(exportData);
  }, [state.cache, state.stats, state.config]);

  const importCache = useCallback((data: string) => {
    try {
      const imported = JSON.parse(data) as {
        cache: [string, CacheEntry<T>][];
        stats: CacheStats;
        config: CacheConfig;
        exportedAt: number;
      };
      
      const now = Date.now();
      const newCache = new Map<string, CacheEntry<T>>();
      
      // Filter out expired entries during import
      for (const [key, entry] of imported.cache) {
        if (now - entry.timestamp <= entry.ttl) {
          newCache.set(key, entry);
        }
      }
      
      setState({
        cache: newCache,
        stats: {
          ...imported.stats,
          size: newCache.size,
          lastUpdated: now
        },
        config: { ...state.config, ...imported.config },
        lastUpdated: now
      });
    } catch {
      // Import failed - ignore and keep current state
    }
  }, [state.config]);

  // Persistence effect
  useEffect(() => {
    if (state.config.enablePersistence) {
      try {
        const exported = exportCache();
        localStorage.setItem(state.config.storageKey, exported);
      } catch {
        // Persistence failed - continue without it
      }
    }
  }, [state.cache, state.config.enablePersistence, state.config.storageKey, exportCache]);

  // Load from persistence on mount
  useEffect(() => {
    if (config.enablePersistence) {
      try {
        const stored = localStorage.getItem(config.storageKey);
        if (stored) {
          importCache(stored);
        }
      } catch {
        // Load failed - start with empty cache
      }
    }
  }, [config.enablePersistence, config.storageKey, importCache]);

  const actions: CacheActions<T> = {
    get,
    set,
    has,
    delete: deleteEntry,
    clear,
    invalidate,
    getStats,
    updateConfig,
    preload,
    export: exportCache,
    import: importCache
  };

  return [state, actions];
}

export default useCache;
