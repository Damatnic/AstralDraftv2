/**
 * Oracle Cache Integration Service
 * Manages caching for Oracle predictions, analytics, and user data
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expires: number;
  hits: number;
  size: number;
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum cache size in MB
  maxEntries?: number; // Maximum number of entries
  compression?: boolean;
  encryption?: boolean;
}

export interface CacheStats {
  totalEntries: number;
  totalSize: number; // in bytes
  hitRate: number;
  missRate: number;
  totalHits: number;
  totalMisses: number;
  averageAccessTime: number;
  oldestEntry: number;
  newestEntry: number;
}

export interface CacheConfig {
  defaultTTL: number;
  maxCacheSize: number;
  maxEntries: number;
  cleanupInterval: number;
  compressionThreshold: number;
  enableMetrics: boolean;
}

export interface PredictionCacheData {
  predictions: unknown[];
  analytics: Record<string, unknown>;
  userStats: Record<string, unknown>;
  leaderboard: unknown[];
  metadata: {
    week: number;
    season: number;
    lastUpdated: number;
  };
}

export interface UserCacheData {
  profile: Record<string, unknown>;
  predictions: unknown[];
  stats: Record<string, unknown>;
  preferences: Record<string, unknown>;
  notifications: unknown[];
}

class OracleCacheIntegrationService {
  private cache = new Map<string, CacheEntry<unknown>>();
  private stats = {
    hits: 0,
    misses: 0,
    totalAccessTime: 0,
    operations: 0
  };
  
  private readonly config: CacheConfig = {
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    maxCacheSize: 50 * 1024 * 1024, // 50MB
    maxEntries: 1000,
    cleanupInterval: 60 * 1000, // 1 minute
    compressionThreshold: 1024, // 1KB
    enableMetrics: true
  };

  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor(customConfig?: Partial<CacheConfig>) {
    if (customConfig) {
      Object.assign(this.config, customConfig);
    }
    this.startCleanupTimer();
  }

  /**
   * Get data from cache
   */
  get<T>(key: string): T | null {
    const startTime = performance.now();
    
    try {
      const entry = this.cache.get(key) as CacheEntry<T> | undefined;
      
      if (!entry) {
        this.recordMiss();
        return null;
      }

      if (Date.now() > entry.expires) {
        this.cache.delete(key);
        this.recordMiss();
        return null;
      }

      entry.hits++;
      this.recordHit();
      
      return entry.data;
    } finally {
      this.recordAccessTime(performance.now() - startTime);
    }
  }

  /**
   * Set data in cache
   */
  set<T>(key: string, data: T, options?: CacheOptions): boolean {
    try {
      const ttl = options?.ttl || this.config.defaultTTL;
      const expires = Date.now() + ttl;
      const serializedData = JSON.stringify(data);
      const size = new Blob([serializedData]).size;

      // Check if we have space
      if (!this.hasSpaceFor(size)) {
        this.evictLRU();
      }

      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        expires,
        hits: 0,
        size
      };

      this.cache.set(key, entry as CacheEntry<unknown>);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Delete entry from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.resetStats();
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const entries = Array.from(this.cache.values());
    const totalSize = entries.reduce((sum, entry) => sum + entry.size, 0);
    const timestamps = entries.map(entry => entry.timestamp);
    
    return {
      totalEntries: this.cache.size,
      totalSize,
      hitRate: this.stats.operations > 0 ? this.stats.hits / this.stats.operations : 0,
      missRate: this.stats.operations > 0 ? this.stats.misses / this.stats.operations : 0,
      totalHits: this.stats.hits,
      totalMisses: this.stats.misses,
      averageAccessTime: this.stats.operations > 0 ? this.stats.totalAccessTime / this.stats.operations : 0,
      oldestEntry: timestamps.length > 0 ? Math.min(...timestamps) : 0,
      newestEntry: timestamps.length > 0 ? Math.max(...timestamps) : 0
    };
  }

  /**
   * Cache Oracle predictions for a specific week
   */
  cachePredictions(week: number, season: number, data: PredictionCacheData): boolean {
    const key = `predictions:${season}:${week}`;
    return this.set(key, data, { ttl: 10 * 60 * 1000 }); // 10 minutes
  }

  /**
   * Get cached Oracle predictions
   */
  getCachedPredictions(week: number, season: number): PredictionCacheData | null {
    const key = `predictions:${season}:${week}`;
    return this.get<PredictionCacheData>(key);
  }

  /**
   * Cache user data
   */
  cacheUserData(userId: string, data: UserCacheData): boolean {
    const key = `user:${userId}`;
    return this.set(key, data, { ttl: 15 * 60 * 1000 }); // 15 minutes
  }

  /**
   * Get cached user data
   */
  getCachedUserData(userId: string): UserCacheData | null {
    const key = `user:${userId}`;
    return this.get<UserCacheData>(key);
  }

  /**
   * Cache Oracle analytics
   */
  cacheAnalytics(type: string, timeframe: string, data: Record<string, unknown>): boolean {
    const key = `analytics:${type}:${timeframe}`;
    return this.set(key, data, { ttl: 30 * 60 * 1000 }); // 30 minutes
  }

  /**
   * Get cached analytics
   */
  getCachedAnalytics(type: string, timeframe: string): Record<string, unknown> | null {
    const key = `analytics:${type}:${timeframe}`;
    return this.get<Record<string, unknown>>(key);
  }

  /**
   * Cache leaderboard data
   */
  cacheLeaderboard(week: number, season: number, data: unknown[]): boolean {
    const key = `leaderboard:${season}:${week}`;
    return this.set(key, data, { ttl: 5 * 60 * 1000 }); // 5 minutes
  }

  /**
   * Get cached leaderboard
   */
  getCachedLeaderboard(week: number, season: number): unknown[] | null {
    const key = `leaderboard:${season}:${week}`;
    return this.get<unknown[]>(key);
  }

  /**
   * Invalidate cache entries by pattern
   */
  invalidatePattern(pattern: string): number {
    let count = 0;
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        count++;
      }
    }
    
    return count;
  }

  /**
   * Invalidate user-specific cache
   */
  invalidateUserCache(_userId: string): number {
    return this.invalidatePattern(`user:${_userId}*`);
  }

  /**
   * Invalidate predictions cache for a specific week
   */
  invalidatePredictionsCache(week?: number, season?: number): number {
    if (week && season) {
      return this.invalidatePattern(`predictions:${season}:${week}`);
    } else if (season) {
      return this.invalidatePattern(`predictions:${season}:*`);
    } else {
      return this.invalidatePattern('predictions:*');
    }
  }

  /**
   * Preload frequently accessed data
   */
  async preloadData(keys: string[]): Promise<void> {
    // In a real implementation, this would fetch data from the API
    // and populate the cache proactively
    keys.forEach(key => {
      if (!this.has(key)) {
        // Placeholder for actual data loading logic
        this.set(key, { placeholder: true }, { ttl: this.config.defaultTTL });
      }
    });
  }

  /**
   * Warm up cache with common data
   */
  async warmupCache(): Promise<void> {
    const currentWeek = this.getCurrentWeek();
    const currentSeason = this.getCurrentSeason();
    
    // Preload current week predictions and analytics
    await this.preloadData([
      `predictions:${currentSeason}:${currentWeek}`,
      `leaderboard:${currentSeason}:${currentWeek}`,
      `analytics:weekly:${currentSeason}:${currentWeek}`,
      'analytics:season:overall'
    ]);
  }

  /**
   * Export cache data for backup
   */
  exportCache(): string {
    const exportData = {
      timestamp: Date.now(),
      config: this.config,
      stats: this.getStats(),
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        data: entry.data,
        expires: entry.expires,
        size: entry.size
      }))
    };
    
    return JSON.stringify(exportData);
  }

  /**
   * Import cache data from backup
   */
  importCache(data: string): boolean {
    try {
      const importData = JSON.parse(data);
      
      if (!importData.entries) return false;
      
      this.cache.clear();
      
      importData.entries.forEach((item: {
        key: string;
        data: unknown;
        expires: number;
        size: number;
      }) => {
        if (Date.now() < item.expires) {
          const entry: CacheEntry<unknown> = {
            data: item.data,
            timestamp: Date.now(),
            expires: item.expires,
            hits: 0,
            size: item.size
          };
          this.cache.set(item.key, entry);
        }
      });
      
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get cache configuration
   */
  getConfig(): CacheConfig {
    return { ...this.config };
  }

  /**
   * Update cache configuration
   */
  updateConfig(newConfig: Partial<CacheConfig>): void {
    Object.assign(this.config, newConfig);
  }

  /**
   * Memory optimization
   */
  optimize(): void {
    this.cleanup();
    this.compactCache();
  }

  /**
   * Private methods
   */
  private startCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expires) {
        expiredKeys.push(key);
      }
    }
    
    expiredKeys.forEach(key => this.cache.delete(key));
  }

  private hasSpaceFor(size: number): boolean {
    const currentSize = this.getCurrentCacheSize();
    return (currentSize + size) <= this.config.maxCacheSize && 
           this.cache.size < this.config.maxEntries;
  }

  private getCurrentCacheSize(): number {
    return Array.from(this.cache.values()).reduce((sum, entry) => sum + entry.size, 0);
  }

  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  private compactCache(): void {
    // Remove entries with very low hit rates
    const averageHits = Array.from(this.cache.values())
      .reduce((sum, entry) => sum + entry.hits, 0) / this.cache.size;
    
    const lowPerformanceKeys: string[] = [];
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.hits < averageHits * 0.1) { // Less than 10% of average hits
        lowPerformanceKeys.push(key);
      }
    }
    
    lowPerformanceKeys.forEach(key => this.cache.delete(key));
  }

  private recordHit(): void {
    this.stats.hits++;
    this.stats.operations++;
  }

  private recordMiss(): void {
    this.stats.misses++;
    this.stats.operations++;
  }

  private recordAccessTime(time: number): void {
    this.stats.totalAccessTime += time;
  }

  private resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      totalAccessTime: 0,
      operations: 0
    };
  }

  private getCurrentWeek(): number {
    // Simplified week calculation - in real app this would be more sophisticated
    const now = new Date();
    const start = new Date(now.getFullYear(), 8, 1); // September 1st
    const diff = now.getTime() - start.getTime();
    return Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1;
  }

  private getCurrentSeason(): number {
    const now = new Date();
    return now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1;
  }

  /**
   * Cleanup resources when service is destroyed
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.cache.clear();
  }
}

// Export singleton instance
export const oracleCacheIntegrationService = new OracleCacheIntegrationService();
export default oracleCacheIntegrationService;
