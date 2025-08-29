/**
 * Oracle Cache Hooks
 * Specialized caching hooks for Oracle prediction system
 */

import { useState, useEffect, useCallback, useMemo } from 'react';

// Enhanced interfaces for type safety
export interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  ttl: number;
  accessed: number;
  version: string;
  size: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
  totalSize: number;
  entryCount: number;
  hitRatio: number;
}

export interface CacheConfig {
  maxSize: number;
  defaultTtl: number;
  enableCompression: boolean;
  enablePersistence: boolean;
  storagePrefix: string;
  evictionPolicy: 'lru' | 'fifo' | 'ttl';
}

export interface PredictionCacheData {
  playerId: string;
  week: number;
  season: number;
  projectedPoints: number;
  confidence: number;
  reasoning: string[];
  modelVersion: string;
  cachedAt: number;
}

export interface AnalyticsCacheData {
  type: 'player_trends' | 'matchup_analysis' | 'injury_impact' | 'weather_impact';
  playerId?: string;
  teamId?: string;
  week?: number;
  season?: number;
  data: Record<string, unknown>;
  cachedAt: number;
}

export interface CacheHookState<T> {
  data: T | null;
  isLoading: boolean;
  isCached: boolean;
  cacheAge: number;
  error: string | null;
  stats: CacheStats;
}

export interface CacheHookActions<T> {
  refresh: () => Promise<void>;
  invalidate: () => void;
  updateCache: (data: T) => void;
  clearCache: () => void;
  getCacheInfo: () => CacheEntry<T> | null;
}

// Default cache configuration
const DEFAULT_CACHE_CONFIG: CacheConfig = {
  maxSize: 50 * 1024 * 1024, // 50MB
  defaultTtl: 300000, // 5 minutes
  enableCompression: false,
  enablePersistence: true,
  storagePrefix: 'oracle_cache_',
  evictionPolicy: 'lru'
};

/**
 * Generic cache hook for Oracle predictions
 */
export function useOraclePredictionCache<T = PredictionCacheData>(
  cacheKey: string,
  fetcher: () => Promise<T>,
  config: Partial<CacheConfig> = {}
): [CacheHookState<T>, CacheHookActions<T>] {
  
  const mergedConfig = useMemo(() => ({ ...DEFAULT_CACHE_CONFIG, ...config }), [config]);
  
  const [state, setState] = useState<CacheHookState<T>>({
    data: null,
    isLoading: false,
    isCached: false,
    cacheAge: 0,
    error: null,
    stats: {
      hits: 0,
      misses: 0,
      evictions: 0,
      totalSize: 0,
      entryCount: 0,
      hitRatio: 0
    }
  });

  // Storage key with prefix
  const storageKey = `${mergedConfig.storagePrefix}${cacheKey}`;

  const loadFromCache = useCallback(async () => {
    try {
      if (!mergedConfig.enablePersistence) return;

      const cached = localStorage.getItem(storageKey);
      if (!cached) {
        setState(prev => ({ ...prev, stats: { ...prev.stats, misses: prev.stats.misses + 1 } }));
        return;
      }

      const entry: CacheEntry<T> = JSON.parse(cached);
      const now = Date.now();

      // Check if expired
      if (now - entry.timestamp > entry.ttl) {
        localStorage.removeItem(storageKey);
        setState(prev => ({ ...prev, stats: { ...prev.stats, misses: prev.stats.misses + 1 } }));
        return;
      }

      // Update access time
      entry.accessed = now;
      localStorage.setItem(storageKey, JSON.stringify(entry));

      setState(prev => ({
        ...prev,
        data: entry.data,
        isCached: true,
        cacheAge: now - entry.timestamp,
        stats: {
          ...prev.stats,
          hits: prev.stats.hits + 1,
          hitRatio: (prev.stats.hits + 1) / (prev.stats.hits + prev.stats.misses + 1)
        }
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: `Cache load error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }));
    }
  }, [storageKey, mergedConfig.enablePersistence]);

  // Load from cache on mount
  useEffect(() => {
    loadFromCache();
  }, [loadFromCache]);

  const saveToCache = useCallback((data: T) => {
    try {
      if (!mergedConfig.enablePersistence) return;

      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl: mergedConfig.defaultTtl,
        accessed: Date.now(),
        version: '1.0',
        size: new Blob([JSON.stringify(data)]).size
      };

      localStorage.setItem(storageKey, JSON.stringify(entry));

      setState(prev => ({
        ...prev,
        data,
        isCached: true,
        cacheAge: 0,
        stats: {
          ...prev.stats,
          entryCount: prev.stats.entryCount + 1,
          totalSize: prev.stats.totalSize + entry.size
        }
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: `Cache save error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }));
    }
  }, [storageKey, mergedConfig]);

  const refresh = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const data = await fetcher();
      saveToCache(data);
      
      setState(prev => ({ 
        ...prev, 
        data, 
        isLoading: false,
        isCached: true,
        cacheAge: 0
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Fetch failed'
      }));
    }
  }, [fetcher, saveToCache]);

  const invalidate = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      setState(prev => ({
        ...prev,
        data: null,
        isCached: false,
        cacheAge: 0,
        stats: {
          ...prev.stats,
          evictions: prev.stats.evictions + 1
        }
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: `Cache invalidation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }));
    }
  }, [storageKey]);

  const updateCache = useCallback((data: T) => {
    saveToCache(data);
  }, [saveToCache]);

  const clearCache = useCallback(() => {
    invalidate();
  }, [invalidate]);

  const getCacheInfo = useCallback((): CacheEntry<T> | null => {
    try {
      const cached = localStorage.getItem(storageKey);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }, [storageKey]);

  const actions: CacheHookActions<T> = {
    refresh,
    invalidate,
    updateCache,
    clearCache,
    getCacheInfo
  };

  return [state, actions];
}

/**
 * Specialized hook for analytics caching
 */
export function useOracleAnalyticsCache(
  playerId: string,
  analyticsType: 'player_trends' | 'matchup_analysis' | 'injury_impact' | 'weather_impact',
  config: Partial<CacheConfig> = {}
) {
  const cacheKey = `analytics_${analyticsType}_${playerId}`;
  
  const fetcher = useCallback(async (): Promise<AnalyticsCacheData> => {
    // Simulate analytics data fetching
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      type: analyticsType,
      playerId,
      data: {
        [analyticsType]: `Mock data for ${playerId}`,
        generated: Date.now()
      },
      cachedAt: Date.now()
    };
  }, [playerId, analyticsType]);

  return useOraclePredictionCache<AnalyticsCacheData>(cacheKey, fetcher, config);
}

/**
 * Hook for batch cache operations
 */
export function useBatchCache() {
  const [operations, setOperations] = useState<{
    pending: number;
    completed: number;
    failed: number;
  }>({
    pending: 0,
    completed: 0,
    failed: 0
  });

  const batchInvalidate = useCallback(async (keys: string[]) => {
    setOperations(prev => ({ ...prev, pending: keys.length }));
    
    let completed = 0;
    let failed = 0;

    for (const key of keys) {
      try {
        localStorage.removeItem(`oracle_cache_${key}`);
        completed++;
      } catch {
        failed++;
      }
    }

    setOperations({ pending: 0, completed, failed });
  }, []);

  const batchRefresh = useCallback(async (
    refreshFunctions: Array<() => Promise<void>>
  ) => {
    setOperations(prev => ({ ...prev, pending: refreshFunctions.length }));
    
    let completed = 0;
    let failed = 0;

    for (const refresh of refreshFunctions) {
      try {
        await refresh();
        completed++;
      } catch {
        failed++;
      }
    }

    setOperations({ pending: 0, completed, failed });
  }, []);

  const clearAllCaches = useCallback(() => {
    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith('oracle_cache_')
      );
      
      keys.forEach(key => localStorage.removeItem(key));
      
      setOperations({
        pending: 0,
        completed: keys.length,
        failed: 0
      });

    } catch {
      setOperations({
        pending: 0,
        completed: 0,
        failed: 1
      });
    }
  }, []);

  return {
    operations,
    batchInvalidate,
    batchRefresh,
    clearAllCaches
  };
}

/**
 * Hook for cache analytics and monitoring
 */
export function useCacheMonitoring() {
  const [metrics, setMetrics] = useState({
    totalCaches: 0,
    totalSize: 0,
    oldestCache: 0,
    newestCache: 0,
    avgCacheAge: 0
  });

  const updateMetrics = useCallback(() => {
    try {
      const cacheKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('oracle_cache_')
      );

      let totalSize = 0;
      let totalAge = 0;
      let oldestCache = Date.now();
      let newestCache = 0;

      cacheKeys.forEach(key => {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const entry: CacheEntry = JSON.parse(item);
            totalSize += entry.size || new Blob([item]).size;
            
            if (entry.timestamp < oldestCache) oldestCache = entry.timestamp;
            if (entry.timestamp > newestCache) newestCache = entry.timestamp;
            
            totalAge += Date.now() - entry.timestamp;
          }
        } catch {
          // Skip invalid entries
        }
      });

      setMetrics({
        totalCaches: cacheKeys.length,
        totalSize,
        oldestCache,
        newestCache,
        avgCacheAge: cacheKeys.length > 0 ? totalAge / cacheKeys.length : 0
      });

    } catch {
      setMetrics({
        totalCaches: 0,
        totalSize: 0,
        oldestCache: 0,
        newestCache: 0,
        avgCacheAge: 0
      });
    }
  }, []);

  // Update metrics periodically
  useEffect(() => {
    updateMetrics();
    const interval = setInterval(updateMetrics, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [updateMetrics]);

  return {
    metrics,
    updateMetrics
  };
}

export default {
  useOraclePredictionCache,
  useOracleAnalyticsCache,
  useBatchCache,
  useCacheMonitoring
};
