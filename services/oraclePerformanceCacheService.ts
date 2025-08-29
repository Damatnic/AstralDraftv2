// Oracle performance cache service - caching and performance optimization

export interface CacheEntry<T = unknown> {
  key: string;
  value: T;
  createdAt: number;
  updatedAt: number;
  accessedAt: number;
  expiresAt: number;
  ttl: number; // time to live in milliseconds
  size: number; // size in bytes
  hits: number;
  metadata: CacheMetadata;
  tags: string[];
}

export interface CacheMetadata {
  source: string;
  version: string;
  compression: boolean;
  encoding: string;
  checksum: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  namespace: string;
}

export interface CacheConfiguration {
  maxSize: number; // maximum cache size in bytes
  maxEntries: number; // maximum number of entries
  defaultTtl: number; // default TTL in milliseconds
  cleanupInterval: number; // cleanup interval in milliseconds
  compressionThreshold: number; // compress entries larger than this
  persistToDisk: boolean;
  diskLocation?: string;
  strategy: CacheStrategy;
  evictionPolicy: EvictionPolicy;
}

export interface CacheStrategy {
  type: 'memory' | 'disk' | 'hybrid' | 'distributed';
  sharding: ShardingConfig;
  replication: ReplicationConfig;
  consistency: 'eventual' | 'strong' | 'weak';
}

export interface ShardingConfig {
  enabled: boolean;
  shardCount: number;
  hashFunction: 'md5' | 'sha1' | 'sha256' | 'murmur3';
  distribution: 'round_robin' | 'consistent_hash' | 'weighted';
}

export interface ReplicationConfig {
  enabled: boolean;
  factor: number; // number of replicas
  strategy: 'master_slave' | 'peer_to_peer' | 'eventual_consistency';
  syncMode: 'async' | 'sync' | 'semi_sync';
}

export interface EvictionPolicy {
  algorithm: 'lru' | 'lfu' | 'fifo' | 'random' | 'ttl' | 'custom';
  maxAge: number; // maximum age in milliseconds
  maxIdleTime: number; // maximum idle time in milliseconds
  memoryPressureThreshold: number; // percentage
  customLogic?: EvictionLogic;
}

export interface EvictionLogic {
  scoreFunction: (entry: CacheEntry) => number;
  threshold: number;
  batchSize: number;
}

export interface CacheStats {
  totalEntries: number;
  totalSize: number; // bytes
  hitCount: number;
  missCount: number;
  hitRate: number; // percentage
  evictionCount: number;
  expirationCount: number;
  errorCount: number;
  memoryUsage: MemoryUsage;
  performance: CachePerformance;
  hotKeys: HotKeyStats[];
}

export interface MemoryUsage {
  used: number; // bytes
  available: number; // bytes
  total: number; // bytes
  percentage: number;
  pressure: 'low' | 'medium' | 'high' | 'critical';
}

export interface CachePerformance {
  averageGetTime: number; // milliseconds
  averageSetTime: number; // milliseconds
  averageDeleteTime: number; // milliseconds
  operationsPerSecond: number;
  throughput: number; // bytes per second
  latencyPercentiles: LatencyPercentiles;
}

export interface LatencyPercentiles {
  p50: number;
  p90: number;
  p95: number;
  p99: number;
  p999: number;
}

export interface HotKeyStats {
  key: string;
  hits: number;
  lastAccessed: number;
  size: number;
  frequency: number; // hits per hour
}

export interface CacheOperation {
  id: string;
  type: 'get' | 'set' | 'delete' | 'clear' | 'expire' | 'refresh';
  key: string;
  timestamp: number;
  duration: number; // milliseconds
  success: boolean;
  error?: string;
  size?: number; // bytes
  metadata: OperationMetadata;
}

export interface OperationMetadata {
  source: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  context: Record<string, string>;
}

export interface CacheWarmupConfig {
  enabled: boolean;
  strategy: 'preload' | 'lazy' | 'predictive' | 'scheduled';
  sources: WarmupSource[];
  schedule: WarmupSchedule;
  priority: number;
  batchSize: number;
  concurrency: number;
}

export interface WarmupSource {
  type: 'database' | 'api' | 'file' | 'computed';
  location: string;
  query?: string;
  transform?: string;
  filters: Record<string, unknown>;
}

export interface WarmupSchedule {
  frequency: 'startup' | 'hourly' | 'daily' | 'weekly' | 'custom';
  cronExpression?: string;
  timezone?: string;
  retryPolicy: RetryPolicy;
}

export interface RetryPolicy {
  maxAttempts: number;
  backoffStrategy: 'linear' | 'exponential' | 'fixed';
  initialDelay: number;
  maxDelay: number;
}

export interface CacheInvalidation {
  strategy: 'manual' | 'ttl' | 'event_based' | 'dependency_based';
  rules: InvalidationRule[];
  cascading: boolean;
  notifications: NotificationConfig;
}

export interface InvalidationRule {
  id: string;
  trigger: InvalidationTrigger;
  scope: InvalidationScope;
  condition: string; // expression
  action: 'delete' | 'refresh' | 'mark_stale';
  delay: number; // milliseconds
}

export interface InvalidationTrigger {
  type: 'time' | 'event' | 'dependency' | 'manual' | 'memory_pressure';
  parameters: Record<string, unknown>;
}

export interface InvalidationScope {
  type: 'key' | 'pattern' | 'tag' | 'namespace' | 'all';
  value: string;
  recursive: boolean;
}

export interface NotificationConfig {
  enabled: boolean;
  channels: NotificationChannel[];
  batching: boolean;
  throttling: ThrottlingConfig;
}

export interface NotificationChannel {
  type: 'webhook' | 'event' | 'log' | 'metric';
  endpoint?: string;
  format: 'json' | 'xml' | 'text';
  filters: string[];
}

export interface ThrottlingConfig {
  maxRate: number; // notifications per second
  windowSize: number; // milliseconds
  burst: number;
}

export interface CacheCluster {
  nodes: CacheNode[];
  coordinator: ClusterCoordinator;
  partitioning: PartitioningStrategy;
  rebalancing: RebalancingConfig;
  failover: FailoverConfig;
}

export interface CacheNode {
  id: string;
  host: string;
  port: number;
  status: 'active' | 'standby' | 'maintenance' | 'failed';
  role: 'master' | 'slave' | 'peer';
  capacity: NodeCapacity;
  health: NodeHealth;
  partitions: string[];
}

export interface NodeCapacity {
  memory: number; // bytes
  disk: number; // bytes
  cpu: number; // cores
  network: number; // bytes per second
  connections: number;
}

export interface NodeHealth {
  status: 'healthy' | 'degraded' | 'critical' | 'failed';
  uptime: number; // milliseconds
  lastHeartbeat: number;
  responseTime: number; // milliseconds
  errorRate: number; // percentage
  metrics: HealthMetrics;
}

export interface HealthMetrics {
  memoryUsage: number; // percentage
  cpuUsage: number; // percentage
  diskUsage: number; // percentage
  networkUtilization: number; // percentage
  connectionCount: number;
  operationsPerSecond: number;
}

export interface ClusterCoordinator {
  algorithm: 'raft' | 'gossip' | 'centralized' | 'hierarchical';
  leaderElection: boolean;
  consensusTimeout: number; // milliseconds
  heartbeatInterval: number; // milliseconds
  splitBrainPrevention: boolean;
}

export interface PartitioningStrategy {
  algorithm: 'consistent_hash' | 'range' | 'directory' | 'hybrid';
  partitionCount: number;
  replicationFactor: number;
  rebalanceThreshold: number; // percentage
}

export interface RebalancingConfig {
  strategy: 'automatic' | 'manual' | 'scheduled';
  threshold: RebalanceThreshold;
  schedule?: string; // cron expression
  migration: MigrationConfig;
}

export interface RebalanceThreshold {
  memoryImbalance: number; // percentage
  loadImbalance: number; // percentage
  nodeFailure: boolean;
  capacityUtilization: number; // percentage
}

export interface MigrationConfig {
  batchSize: number;
  concurrency: number;
  timeout: number; // milliseconds
  verification: boolean;
  rollback: boolean;
}

export interface FailoverConfig {
  enabled: boolean;
  timeout: number; // milliseconds
  retryCount: number;
  strategy: 'immediate' | 'graceful' | 'lazy';
  promotion: PromotionConfig;
}

export interface PromotionConfig {
  automatic: boolean;
  criteria: PromotionCriteria;
  validation: boolean;
  rollback: boolean;
}

export interface PromotionCriteria {
  minUptime: number; // milliseconds
  maxResponseTime: number; // milliseconds
  minHealthScore: number; // 0-1
  dataConsistency: boolean;
}

export interface CacheMetrics {
  timestamp: number;
  period: number; // milliseconds
  operations: OperationMetrics;
  performance: PerformanceMetrics;
  errors: ErrorMetrics;
  capacity: CapacityMetrics;
  trends: TrendMetrics;
}

export interface OperationMetrics {
  gets: OperationStats;
  sets: OperationStats;
  deletes: OperationStats;
  evictions: OperationStats;
  expirations: OperationStats;
}

export interface OperationStats {
  count: number;
  rate: number; // operations per second
  averageLatency: number; // milliseconds
  errors: number;
  errorRate: number; // percentage
}

export interface PerformanceMetrics {
  throughput: number; // bytes per second
  latency: LatencyPercentiles;
  hitRate: number; // percentage
  missRate: number; // percentage
  efficiency: number; // hit rate / total operations
}

export interface ErrorMetrics {
  total: number;
  rate: number; // errors per second
  categories: ErrorCategory[];
  topErrors: TopError[];
}

export interface ErrorCategory {
  type: string;
  count: number;
  percentage: number;
  trend: 'increasing' | 'stable' | 'decreasing';
}

export interface TopError {
  error: string;
  count: number;
  lastOccurrence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
}

export interface CapacityMetrics {
  memory: ResourceMetrics;
  disk: ResourceMetrics;
  entries: ResourceMetrics;
  connections: ResourceMetrics;
}

export interface ResourceMetrics {
  used: number;
  total: number;
  percentage: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  projectedExhaustion?: number; // timestamp
}

export interface TrendMetrics {
  hitRate: TrendData;
  latency: TrendData;
  throughput: TrendData;
  errorRate: TrendData;
  memoryUsage: TrendData;
}

export interface TrendData {
  current: number;
  previous: number;
  change: number; // percentage
  trend: 'improving' | 'stable' | 'degrading';
  confidence: number; // 0-1
}

export interface CacheSearch {
  pattern: string;
  type: 'exact' | 'prefix' | 'suffix' | 'contains' | 'regex' | 'wildcard';
  namespace?: string;
  tags?: string[];
  dateRange?: DateRange;
  sizeRange?: SizeRange;
  accessRange?: AccessRange;
}

export interface DateRange {
  start: number;
  end: number;
}

export interface SizeRange {
  min: number;
  max: number;
}

export interface AccessRange {
  minHits: number;
  maxHits: number;
  minAge: number;
  maxAge: number;
}

export interface SearchResult {
  entries: CacheEntry[];
  totalCount: number;
  executionTime: number; // milliseconds
  cursor?: string; // for pagination
}

export interface CacheBenchmark {
  id: string;
  name: string;
  description: string;
  configuration: BenchmarkConfig;
  results: BenchmarkResults;
  metadata: BenchmarkMetadata;
}

export interface BenchmarkConfig {
  duration: number; // milliseconds
  concurrency: number;
  operations: BenchmarkOperation[];
  dataSet: DataSetConfig;
  warmup: WarmupConfig;
}

export interface BenchmarkOperation {
  type: 'get' | 'set' | 'delete' | 'mixed';
  percentage: number; // 0-100
  keyPattern: string;
  valueSize: ValueSizeConfig;
}

export interface ValueSizeConfig {
  type: 'fixed' | 'random' | 'distribution';
  size: number; // bytes
  min?: number;
  max?: number;
  distribution?: 'uniform' | 'normal' | 'exponential';
}

export interface DataSetConfig {
  keyCount: number;
  keyPattern: string;
  valueType: 'string' | 'object' | 'binary' | 'mixed';
  preload: boolean;
}

export interface WarmupConfig {
  enabled: boolean;
  duration: number; // milliseconds
  operations: number;
}

export interface BenchmarkResults {
  startTime: number;
  endTime: number;
  duration: number; // milliseconds
  totalOperations: number;
  operationsPerSecond: number;
  latency: LatencyPercentiles;
  throughput: number; // bytes per second
  hitRate: number; // percentage
  errorRate: number; // percentage
  operationBreakdown: OperationBreakdown;
}

export interface OperationBreakdown {
  gets: OperationResults;
  sets: OperationResults;
  deletes: OperationResults;
}

export interface OperationResults {
  count: number;
  rate: number; // operations per second
  latency: LatencyPercentiles;
  errors: number;
  errorRate: number; // percentage
}

export interface BenchmarkMetadata {
  environment: string;
  cacheConfig: CacheConfiguration;
  systemInfo: SystemInfo;
  notes: string[];
}

export interface SystemInfo {
  os: string;
  architecture: string;
  cpuCores: number;
  memory: number; // bytes
  jvmVersion?: string;
  nodeVersion?: string;
}

export interface PerformanceCacheService {
  // Cache operations
  get<T>(key: string, options?: GetOptions): Promise<T | null>;
  set<T>(key: string, value: T, options?: SetOptions): Promise<boolean>;
  delete(key: string): Promise<boolean>;
  exists(key: string): Promise<boolean>;
  clear(namespace?: string): Promise<number>;
  
  // Batch operations
  getMultiple<T>(keys: string[]): Promise<Map<string, T>>;
  setMultiple<T>(entries: Map<string, T>, options?: SetOptions): Promise<number>;
  deleteMultiple(keys: string[]): Promise<number>;
  
  // Advanced operations
  increment(key: string, delta?: number): Promise<number>;
  decrement(key: string, delta?: number): Promise<number>;
  expire(key: string, ttl: number): Promise<boolean>;
  touch(key: string): Promise<boolean>;
  
  // Search and pattern operations
  search(search: CacheSearch): Promise<SearchResult>;
  keys(pattern: string, limit?: number): Promise<string[]>;
  scan(cursor: string, pattern?: string, count?: number): Promise<ScanResult>;
  
  // Tag operations
  getByTag(tag: string): Promise<CacheEntry[]>;
  deleteByTag(tag: string): Promise<number>;
  expireByTag(tag: string, ttl: number): Promise<number>;
  
  // Statistics and monitoring
  getStats(): Promise<CacheStats>;
  getMetrics(period?: number): Promise<CacheMetrics>;
  getHealthStatus(): Promise<CacheHealth>;
  
  // Configuration and management
  updateConfig(config: Partial<CacheConfiguration>): Promise<boolean>;
  getConfig(): Promise<CacheConfiguration>;
  flushExpired(): Promise<number>;
  compact(): Promise<CompactionResult>;
  
  // Warmup and preloading
  warmup(config: CacheWarmupConfig): Promise<WarmupResult>;
  preload(keys: string[]): Promise<PreloadResult>;
  
  // Cluster operations
  getClusterInfo(): Promise<CacheCluster>;
  rebalance(): Promise<RebalanceResult>;
  addNode(node: CacheNode): Promise<boolean>;
  removeNode(nodeId: string): Promise<boolean>;
  
  // Backup and restore
  backup(location: string): Promise<BackupResult>;
  restore(location: string, options?: RestoreOptions): Promise<RestoreResult>;
  
  // Benchmarking and testing
  benchmark(config: BenchmarkConfig): Promise<CacheBenchmark>;
  
  // Event handling
  onCacheEvent(event: CacheEventType, handler: CacheEventHandler): void;
  offCacheEvent(event: CacheEventType, handler: CacheEventHandler): void;
}

export interface GetOptions {
  updateAccessTime?: boolean;
  includeMetadata?: boolean;
  timeout?: number;
}

export interface SetOptions {
  ttl?: number;
  tags?: string[];
  compress?: boolean;
  overwrite?: boolean;
  namespace?: string;
  priority?: CacheMetadata['priority'];
}

export interface ScanResult {
  keys: string[];
  cursor: string;
  hasMore: boolean;
}

export interface CacheHealth {
  status: 'healthy' | 'degraded' | 'critical' | 'failed';
  score: number; // 0-1
  issues: HealthIssue[];
  recommendations: HealthRecommendation[];
  lastCheck: number;
}

export interface HealthIssue {
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  description: string;
  impact: string;
  timestamp: number;
}

export interface HealthRecommendation {
  priority: 'low' | 'medium' | 'high' | 'critical';
  action: string;
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
}

export interface CompactionResult {
  entriesCompacted: number;
  spaceSaved: number; // bytes
  duration: number; // milliseconds
  errors: string[];
}

export interface WarmupResult {
  entriesLoaded: number;
  errors: number;
  duration: number; // milliseconds
  sources: SourceResult[];
}

export interface SourceResult {
  source: string;
  entriesLoaded: number;
  errors: number;
  duration: number; // milliseconds
}

export interface PreloadResult {
  requestedKeys: number;
  loadedKeys: number;
  errors: number;
  duration: number; // milliseconds
  failures: string[];
}

export interface RebalanceResult {
  entriesMigrated: number;
  duration: number; // milliseconds
  sourceNodes: string[];
  targetNodes: string[];
  errors: string[];
}

export interface BackupResult {
  entries: number;
  size: number; // bytes
  duration: number; // milliseconds
  location: string;
  checksum: string;
}

export interface RestoreOptions {
  overwrite?: boolean;
  namespace?: string;
  filter?: string; // pattern
  validateChecksum?: boolean;
}

export interface RestoreResult {
  entries: number;
  skipped: number;
  errors: number;
  duration: number; // milliseconds
  warnings: string[];
}

export type CacheEventType = 
  | 'hit' 
  | 'miss' 
  | 'set' 
  | 'delete' 
  | 'expire' 
  | 'evict' 
  | 'clear' 
  | 'error' 
  | 'config_change'
  | 'health_change'
  | 'cluster_change';

export interface CacheEvent {
  type: CacheEventType;
  timestamp: number;
  key?: string;
  namespace?: string;
  data?: Record<string, unknown>;
  error?: string;
}

export type CacheEventHandler = (event: CacheEvent) => void;

class OraclePerformanceCacheService implements PerformanceCacheService {
  private cache: Map<string, CacheEntry>;
  private config: CacheConfiguration;
  private stats: CacheStats;
  private eventHandlers: Map<CacheEventType, Set<CacheEventHandler>>;
  private cleanupTimer?: NodeJS.Timeout;

  constructor(config: CacheConfiguration) {
    this.cache = new Map();
    this.config = config;
    this.eventHandlers = new Map();
    this.stats = this.initializeStats();
    this.startCleanupTimer();
  }

  async get<T>(key: string, options: GetOptions = {}): Promise<T | null> {
    const startTime = Date.now();
    
    try {
      const entry = this.cache.get(key);
      
      if (!entry) {
        this.stats.missCount++;
        this.emitEvent('miss', { key });
        return null;
      }

      // Check expiration
      if (this.isExpired(entry)) {
        this.cache.delete(key);
        this.stats.missCount++;
        this.stats.expirationCount++;
        this.emitEvent('expire', { key });
        return null;
      }

      // Update access time if requested
      if (options.updateAccessTime !== false) {
        entry.accessedAt = Date.now();
        entry.hits++;
      }

      this.stats.hitCount++;
      this.updatePerformanceMetrics('get', Date.now() - startTime);
      this.emitEvent('hit', { key });
      
      return entry.value as T;
    } catch (error) {
      this.stats.errorCount++;
      this.emitEvent('error', { key, error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }

  async set<T>(key: string, value: T, options: SetOptions = {}): Promise<boolean> {
    const startTime = Date.now();
    
    try {
      const now = Date.now();
      const ttl = options.ttl || this.config.defaultTtl;
      const size = this.calculateSize(value);

      // Check if we need to evict entries
      if (this.shouldEvict(size)) {
        await this.evictEntries(size);
      }

      const entry: CacheEntry<T> = {
        key,
        value,
        createdAt: now,
        updatedAt: now,
        accessedAt: now,
        expiresAt: now + ttl,
        ttl,
        size,
        hits: 0,
        metadata: {
          source: 'manual',
          version: '1.0',
          compression: options.compress || false,
          encoding: 'utf8',
          checksum: this.calculateChecksum(value),
          priority: options.priority || 'medium',
          namespace: options.namespace || 'default'
        },
        tags: options.tags || []
      };

      this.cache.set(key, entry as CacheEntry);
      this.updateStats(entry as CacheEntry);
      this.updatePerformanceMetrics('set', Date.now() - startTime);
      this.emitEvent('set', { key, namespace: entry.metadata.namespace });
      
      return true;
    } catch (error) {
      this.stats.errorCount++;
      this.emitEvent('error', { key, error: error instanceof Error ? error.message : 'Unknown error' });
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    const startTime = Date.now();
    
    try {
      const entry = this.cache.get(key);
      const deleted = this.cache.delete(key);
      
      if (deleted && entry) {
        this.stats.totalEntries--;
        this.stats.totalSize -= entry.size;
        this.updatePerformanceMetrics('delete', Date.now() - startTime);
        this.emitEvent('delete', { key, namespace: entry.metadata.namespace });
      }
      
      return deleted;
    } catch (error) {
      this.stats.errorCount++;
      this.emitEvent('error', { key, error: error instanceof Error ? error.message : 'Unknown error' });
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    return entry ? !this.isExpired(entry) : false;
  }

  async clear(namespace?: string): Promise<number> {
    let cleared = 0;
    
    if (namespace) {
      for (const [key, entry] of this.cache.entries()) {
        if (entry.metadata.namespace === namespace) {
          this.cache.delete(key);
          cleared++;
        }
      }
    } else {
      cleared = this.cache.size;
      this.cache.clear();
    }
    
    this.stats.totalEntries -= cleared;
    this.emitEvent('clear', { namespace });
    
    return cleared;
  }

  async getMultiple<T>(keys: string[]): Promise<Map<string, T>> {
    const result = new Map<string, T>();
    
    for (const key of keys) {
      const value = await this.get<T>(key);
      if (value !== null) {
        result.set(key, value);
      }
    }
    
    return result;
  }

  async setMultiple<T>(entries: Map<string, T>, options: SetOptions = {}): Promise<number> {
    let success = 0;
    
    for (const [key, value] of entries.entries()) {
      const result = await this.set(key, value, options);
      if (result) success++;
    }
    
    return success;
  }

  async deleteMultiple(keys: string[]): Promise<number> {
    let deleted = 0;
    
    for (const key of keys) {
      const result = await this.delete(key);
      if (result) deleted++;
    }
    
    return deleted;
  }

  async increment(key: string, delta: number = 1): Promise<number> {
    const current = await this.get<number>(key);
    const newValue = (current || 0) + delta;
    await this.set(key, newValue);
    return newValue;
  }

  async decrement(key: string, delta: number = 1): Promise<number> {
    return this.increment(key, -delta);
  }

  async expire(key: string, ttl: number): Promise<boolean> {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    entry.expiresAt = Date.now() + ttl;
    entry.ttl = ttl;
    return true;
  }

  async touch(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    entry.accessedAt = Date.now();
    return true;
  }

  async search(search: CacheSearch): Promise<SearchResult> {
    const startTime = Date.now();
    const entries: CacheEntry[] = [];
    
    for (const entry of this.cache.values()) {
      if (this.matchesSearch(entry, search)) {
        entries.push(entry);
      }
    }
    
    return {
      entries,
      totalCount: entries.length,
      executionTime: Date.now() - startTime
    };
  }

  async keys(pattern: string, limit: number = 1000): Promise<string[]> {
    const keys: string[] = [];
    const regex = this.patternToRegex(pattern);
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        keys.push(key);
        if (keys.length >= limit) break;
      }
    }
    
    return keys;
  }

  async scan(cursor: string, pattern?: string, count: number = 100): Promise<ScanResult> {
    const keys = Array.from(this.cache.keys());
    const startIndex = parseInt(cursor) || 0;
    const endIndex = Math.min(startIndex + count, keys.length);
    
    let resultKeys = keys.slice(startIndex, endIndex);
    
    if (pattern) {
      const regex = this.patternToRegex(pattern);
      resultKeys = resultKeys.filter(key => regex.test(key));
    }
    
    return {
      keys: resultKeys,
      cursor: endIndex.toString(),
      hasMore: endIndex < keys.length
    };
  }

  async getByTag(tag: string): Promise<CacheEntry[]> {
    const entries: CacheEntry[] = [];
    
    for (const entry of this.cache.values()) {
      if (entry.tags.includes(tag)) {
        entries.push(entry);
      }
    }
    
    return entries;
  }

  async deleteByTag(tag: string): Promise<number> {
    let deleted = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.includes(tag)) {
        this.cache.delete(key);
        deleted++;
      }
    }
    
    this.stats.totalEntries -= deleted;
    return deleted;
  }

  async expireByTag(tag: string, ttl: number): Promise<number> {
    let expired = 0;
    const now = Date.now();
    
    for (const entry of this.cache.values()) {
      if (entry.tags.includes(tag)) {
        entry.expiresAt = now + ttl;
        entry.ttl = ttl;
        expired++;
      }
    }
    
    return expired;
  }

  async getStats(): Promise<CacheStats> {
    this.updateHitRate();
    this.updateMemoryUsage();
    this.updateHotKeys();
    return { ...this.stats };
  }

  async getMetrics(_period?: number): Promise<CacheMetrics> {
    const now = Date.now();
    
    return {
      timestamp: now,
      period: _period || 60000,
      operations: {
        gets: {
          count: this.stats.hitCount + this.stats.missCount,
          rate: this.calculateRate('get'),
          averageLatency: this.stats.performance.averageGetTime,
          errors: 0,
          errorRate: 0
        },
        sets: {
          count: this.stats.totalEntries,
          rate: this.calculateRate('set'),
          averageLatency: this.stats.performance.averageSetTime,
          errors: 0,
          errorRate: 0
        },
        deletes: {
          count: 0,
          rate: this.calculateRate('delete'),
          averageLatency: this.stats.performance.averageDeleteTime,
          errors: 0,
          errorRate: 0
        },
        evictions: {
          count: this.stats.evictionCount,
          rate: 0,
          averageLatency: 0,
          errors: 0,
          errorRate: 0
        },
        expirations: {
          count: this.stats.expirationCount,
          rate: 0,
          averageLatency: 0,
          errors: 0,
          errorRate: 0
        }
      },
      performance: {
        throughput: this.stats.performance.throughput,
        latency: this.stats.performance.latencyPercentiles,
        hitRate: this.stats.hitRate,
        missRate: 100 - this.stats.hitRate,
        efficiency: this.stats.hitRate / 100
      },
      errors: {
        total: this.stats.errorCount,
        rate: 0,
        categories: [],
        topErrors: []
      },
      capacity: {
        memory: {
          used: this.stats.totalSize,
          total: this.config.maxSize,
          percentage: (this.stats.totalSize / this.config.maxSize) * 100,
          trend: 'stable'
        },
        disk: {
          used: 0,
          total: 0,
          percentage: 0,
          trend: 'stable'
        },
        entries: {
          used: this.stats.totalEntries,
          total: this.config.maxEntries,
          percentage: (this.stats.totalEntries / this.config.maxEntries) * 100,
          trend: 'stable'
        },
        connections: {
          used: 0,
          total: 0,
          percentage: 0,
          trend: 'stable'
        }
      },
      trends: {
        hitRate: { current: this.stats.hitRate, previous: this.stats.hitRate, change: 0, trend: 'stable', confidence: 1 },
        latency: { current: this.stats.performance.averageGetTime, previous: this.stats.performance.averageGetTime, change: 0, trend: 'stable', confidence: 1 },
        throughput: { current: this.stats.performance.throughput, previous: this.stats.performance.throughput, change: 0, trend: 'stable', confidence: 1 },
        errorRate: { current: 0, previous: 0, change: 0, trend: 'stable', confidence: 1 },
        memoryUsage: { current: this.stats.memoryUsage.percentage, previous: this.stats.memoryUsage.percentage, change: 0, trend: 'stable', confidence: 1 }
      }
    };
  }

  async getHealthStatus(): Promise<CacheHealth> {
    const issues: HealthIssue[] = [];
    const recommendations: HealthRecommendation[] = [];

    // Check memory usage
    if (this.stats.memoryUsage.percentage > 90) {
      issues.push({
        severity: 'high',
        category: 'memory',
        description: 'Memory usage is above 90%',
        impact: 'Performance degradation and potential evictions',
        timestamp: Date.now()
      });
      
      recommendations.push({
        priority: 'high',
        action: 'increase_memory',
        description: 'Increase cache memory limit or enable more aggressive eviction',
        impact: 'Improved performance and reduced evictions',
        effort: 'medium'
      });
    }

    // Check hit rate
    if (this.stats.hitRate < 80) {
      issues.push({
        severity: 'medium',
        category: 'performance',
        description: 'Hit rate is below 80%',
        impact: 'Increased latency and backend load',
        timestamp: Date.now()
      });
    }

    const score = this.calculateHealthScore(issues);
    const status = score > 0.8 ? 'healthy' : score > 0.6 ? 'degraded' : score > 0.4 ? 'critical' : 'failed';

    return {
      status,
      score,
      issues,
      recommendations,
      lastCheck: Date.now()
    };
  }

  async updateConfig(config: Partial<CacheConfiguration>): Promise<boolean> {
    this.config = { ...this.config, ...config };
    this.emitEvent('config_change', { data: config });
    return true;
  }

  async getConfig(): Promise<CacheConfiguration> {
    return { ...this.config };
  }

  async flushExpired(): Promise<number> {
    let flushed = 0;
    const now = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt <= now) {
        this.cache.delete(key);
        flushed++;
      }
    }
    
    this.stats.totalEntries -= flushed;
    this.stats.expirationCount += flushed;
    
    return flushed;
  }

  async compact(): Promise<CompactionResult> {
    const startTime = Date.now();
    let entriesCompacted = 0;
    let spaceSaved = 0;
    const errors: string[] = [];

    // Remove expired entries
    const expired = await this.flushExpired();
    entriesCompacted += expired;

    // Compress large entries if enabled
    for (const entry of this.cache.values()) {
      if (entry.size > this.config.compressionThreshold && !entry.metadata.compression) {
        try {
          const originalSize = entry.size;
          // Simulate compression
          entry.size = Math.floor(originalSize * 0.7);
          entry.metadata.compression = true;
          spaceSaved += originalSize - entry.size;
          entriesCompacted++;
        } catch (error) {
          errors.push(`Failed to compress entry ${entry.key}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    return {
      entriesCompacted,
      spaceSaved,
      duration: Date.now() - startTime,
      errors
    };
  }

  async warmup(_config: CacheWarmupConfig): Promise<WarmupResult> {
    const startTime = Date.now();
    
    // Mock warmup implementation
    return {
      entriesLoaded: 100,
      errors: 0,
      duration: Date.now() - startTime,
      sources: [
        {
          source: 'database',
          entriesLoaded: 100,
          errors: 0,
          duration: Date.now() - startTime
        }
      ]
    };
  }

  async preload(keys: string[]): Promise<PreloadResult> {
    const startTime = Date.now();
    const failures: string[] = [];
    let loadedKeys = 0;

    for (const key of keys) {
      try {
        // Mock preload - in real implementation would load from source
        await this.set(key, `preloaded_value_${key}`);
        loadedKeys++;
      } catch (error) {
        failures.push(`Failed to preload ${key}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return {
      requestedKeys: keys.length,
      loadedKeys,
      errors: failures.length,
      duration: Date.now() - startTime,
      failures
    };
  }

  async getClusterInfo(): Promise<CacheCluster> {
    // Mock cluster info
    return {
      nodes: [
        {
          id: 'node_1',
          host: 'localhost',
          port: 6379,
          status: 'active',
          role: 'master',
          capacity: {
            memory: this.config.maxSize,
            disk: 0,
            cpu: 4,
            network: 1000000000,
            connections: 1000
          },
          health: {
            status: 'healthy',
            uptime: Date.now() - 3600000,
            lastHeartbeat: Date.now(),
            responseTime: 1,
            errorRate: 0,
            metrics: {
              memoryUsage: this.stats.memoryUsage.percentage,
              cpuUsage: 25,
              diskUsage: 0,
              networkUtilization: 10,
              connectionCount: 150,
              operationsPerSecond: this.stats.performance.operationsPerSecond
            }
          },
          partitions: ['0-16383']
        }
      ],
      coordinator: {
        algorithm: 'raft',
        leaderElection: true,
        consensusTimeout: 5000,
        heartbeatInterval: 1000,
        splitBrainPrevention: true
      },
      partitioning: {
        algorithm: 'consistent_hash',
        partitionCount: 16384,
        replicationFactor: 1,
        rebalanceThreshold: 10
      },
      rebalancing: {
        strategy: 'automatic',
        threshold: {
          memoryImbalance: 20,
          loadImbalance: 15,
          nodeFailure: true,
          capacityUtilization: 80
        },
        migration: {
          batchSize: 100,
          concurrency: 4,
          timeout: 30000,
          verification: true,
          rollback: true
        }
      },
      failover: {
        enabled: true,
        timeout: 5000,
        retryCount: 3,
        strategy: 'graceful',
        promotion: {
          automatic: true,
          criteria: {
            minUptime: 300000,
            maxResponseTime: 100,
            minHealthScore: 0.8,
            dataConsistency: true
          },
          validation: true,
          rollback: true
        }
      }
    };
  }

  async rebalance(): Promise<RebalanceResult> {
    const startTime = Date.now();
    
    // Mock rebalance
    return {
      entriesMigrated: 0,
      duration: Date.now() - startTime,
      sourceNodes: [],
      targetNodes: [],
      errors: []
    };
  }

  async addNode(_node: CacheNode): Promise<boolean> {
    // Mock implementation
    return true;
  }

  async removeNode(_nodeId: string): Promise<boolean> {
    // Mock implementation
    return true;
  }

  async backup(_location: string): Promise<BackupResult> {
    const startTime = Date.now();
    
    return {
      entries: this.cache.size,
      size: this.stats.totalSize,
      duration: Date.now() - startTime,
      location: _location,
      checksum: 'mock_checksum'
    };
  }

  async restore(_location: string, _options?: RestoreOptions): Promise<RestoreResult> {
    const startTime = Date.now();
    
    return {
      entries: 0,
      skipped: 0,
      errors: 0,
      duration: Date.now() - startTime,
      warnings: []
    };
  }

  async benchmark(_config: BenchmarkConfig): Promise<CacheBenchmark> {
    return {
      id: 'benchmark_1',
      name: 'Performance Test',
      description: 'Cache performance benchmark',
      configuration: _config,
      results: {
        startTime: Date.now() - 60000,
        endTime: Date.now(),
        duration: 60000,
        totalOperations: 10000,
        operationsPerSecond: 166.67,
        latency: {
          p50: 1,
          p90: 2,
          p95: 3,
          p99: 5,
          p999: 10
        },
        throughput: 1000000,
        hitRate: 85,
        errorRate: 0,
        operationBreakdown: {
          gets: {
            count: 7000,
            rate: 116.67,
            latency: { p50: 1, p90: 2, p95: 3, p99: 5, p999: 10 },
            errors: 0,
            errorRate: 0
          },
          sets: {
            count: 2000,
            rate: 33.33,
            latency: { p50: 2, p90: 3, p95: 4, p99: 6, p999: 12 },
            errors: 0,
            errorRate: 0
          },
          deletes: {
            count: 1000,
            rate: 16.67,
            latency: { p50: 1, p90: 1, p95: 2, p99: 3, p999: 5 },
            errors: 0,
            errorRate: 0
          }
        }
      },
      metadata: {
        environment: 'test',
        cacheConfig: this.config,
        systemInfo: {
          os: 'linux',
          architecture: 'x64',
          cpuCores: 8,
          memory: 16777216000,
          nodeVersion: '18.0.0'
        },
        notes: []
      }
    };
  }

  onCacheEvent(event: CacheEventType, handler: CacheEventHandler): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);
  }

  offCacheEvent(event: CacheEventType, handler: CacheEventHandler): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  // Private helper methods
  private initializeStats(): CacheStats {
    return {
      totalEntries: 0,
      totalSize: 0,
      hitCount: 0,
      missCount: 0,
      hitRate: 0,
      evictionCount: 0,
      expirationCount: 0,
      errorCount: 0,
      memoryUsage: {
        used: 0,
        available: this.config.maxSize,
        total: this.config.maxSize,
        percentage: 0,
        pressure: 'low'
      },
      performance: {
        averageGetTime: 0,
        averageSetTime: 0,
        averageDeleteTime: 0,
        operationsPerSecond: 0,
        throughput: 0,
        latencyPercentiles: {
          p50: 0,
          p90: 0,
          p95: 0,
          p99: 0,
          p999: 0
        }
      },
      hotKeys: []
    };
  }

  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.flushExpired();
    }, this.config.cleanupInterval);
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() > entry.expiresAt;
  }

  private calculateSize(value: unknown): number {
    // Simple size calculation - in production would be more sophisticated
    if (typeof value === 'string') {
      return value.length * 2; // Approximate Unicode size
    } else if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value).length * 2;
    }
    return 8; // Default size for primitives
  }

  private calculateChecksum(value: unknown): string {
    // Simple checksum - in production would use crypto hash
    const str = typeof value === 'string' ? value : JSON.stringify(value);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  private shouldEvict(newEntrySize: number): boolean {
    const wouldExceedSize = this.stats.totalSize + newEntrySize > this.config.maxSize;
    const wouldExceedEntries = this.stats.totalEntries >= this.config.maxEntries;
    return wouldExceedSize || wouldExceedEntries;
  }

  private async evictEntries(requiredSpace: number): Promise<void> {
    const policy = this.config.evictionPolicy;
    let freedSpace = 0;
    let freedEntries = 0;
    
    const entries = Array.from(this.cache.entries());
    
    // Sort by eviction algorithm
    if (policy.algorithm === 'lru') {
      entries.sort(([, a], [, b]) => a.accessedAt - b.accessedAt);
    } else if (policy.algorithm === 'lfu') {
      entries.sort(([, a], [, b]) => a.hits - b.hits);
    } else if (policy.algorithm === 'fifo') {
      entries.sort(([, a], [, b]) => a.createdAt - b.createdAt);
    }
    
    // Evict entries until we have enough space
    for (const [key, entry] of entries) {
      if (freedSpace >= requiredSpace && freedEntries < 10) break;
      
      this.cache.delete(key);
      freedSpace += entry.size;
      freedEntries++;
      this.stats.evictionCount++;
      this.emitEvent('evict', { key });
    }
    
    this.stats.totalEntries -= freedEntries;
    this.stats.totalSize -= freedSpace;
  }

  private updateStats(entry: CacheEntry): void {
    this.stats.totalEntries++;
    this.stats.totalSize += entry.size;
  }

  private updatePerformanceMetrics(operation: string, duration: number): void {
    if (operation === 'get') {
      this.stats.performance.averageGetTime = 
        (this.stats.performance.averageGetTime + duration) / 2;
    } else if (operation === 'set') {
      this.stats.performance.averageSetTime = 
        (this.stats.performance.averageSetTime + duration) / 2;
    } else if (operation === 'delete') {
      this.stats.performance.averageDeleteTime = 
        (this.stats.performance.averageDeleteTime + duration) / 2;
    }
  }

  private updateHitRate(): void {
    const total = this.stats.hitCount + this.stats.missCount;
    this.stats.hitRate = total > 0 ? (this.stats.hitCount / total) * 100 : 0;
  }

  private updateMemoryUsage(): void {
    this.stats.memoryUsage.used = this.stats.totalSize;
    this.stats.memoryUsage.available = this.config.maxSize - this.stats.totalSize;
    this.stats.memoryUsage.percentage = (this.stats.totalSize / this.config.maxSize) * 100;
    
    if (this.stats.memoryUsage.percentage > 90) {
      this.stats.memoryUsage.pressure = 'critical';
    } else if (this.stats.memoryUsage.percentage > 75) {
      this.stats.memoryUsage.pressure = 'high';
    } else if (this.stats.memoryUsage.percentage > 50) {
      this.stats.memoryUsage.pressure = 'medium';
    } else {
      this.stats.memoryUsage.pressure = 'low';
    }
  }

  private updateHotKeys(): void {
    const hotKeys: HotKeyStats[] = [];
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.hits > 10) { // Threshold for "hot" keys
        hotKeys.push({
          key,
          hits: entry.hits,
          lastAccessed: entry.accessedAt,
          size: entry.size,
          frequency: entry.hits / ((Date.now() - entry.createdAt) / 3600000) // hits per hour
        });
      }
    }
    
    hotKeys.sort((a, b) => b.hits - a.hits);
    this.stats.hotKeys = hotKeys.slice(0, 10); // Top 10 hot keys
  }

  private calculateRate(_operation: string): number {
    // Mock rate calculation - in production would track actual rates
    return 100;
  }

  private calculateHealthScore(issues: HealthIssue[]): number {
    let score = 1.0;
    
    for (const issue of issues) {
      switch (issue.severity) {
        case 'critical':
          score -= 0.3;
          break;
        case 'high':
          score -= 0.2;
          break;
        case 'medium':
          score -= 0.1;
          break;
        case 'low':
          score -= 0.05;
          break;
      }
    }
    
    return Math.max(0, score);
  }

  private matchesSearch(entry: CacheEntry, search: CacheSearch): boolean {
    // Key pattern matching
    const regex = this.patternToRegex(search.pattern);
    if (!regex.test(entry.key)) return false;
    
    // Namespace filtering
    if (search.namespace && entry.metadata.namespace !== search.namespace) {
      return false;
    }
    
    // Tag filtering
    if (search.tags && search.tags.length > 0) {
      const hasTag = search.tags.some(tag => entry.tags.includes(tag));
      if (!hasTag) return false;
    }
    
    // Date range filtering
    if (search.dateRange) {
      if (entry.createdAt < search.dateRange.start || entry.createdAt > search.dateRange.end) {
        return false;
      }
    }
    
    // Size range filtering
    if (search.sizeRange) {
      if (entry.size < search.sizeRange.min || entry.size > search.sizeRange.max) {
        return false;
      }
    }
    
    // Access range filtering
    if (search.accessRange) {
      const age = Date.now() - entry.createdAt;
      if (entry.hits < search.accessRange.minHits || 
          entry.hits > search.accessRange.maxHits ||
          age < search.accessRange.minAge ||
          age > search.accessRange.maxAge) {
        return false;
      }
    }
    
    return true;
  }

  private patternToRegex(pattern: string): RegExp {
    // Convert glob pattern to regex
    const regexPattern = pattern
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');
    
    return new RegExp(`^${regexPattern}$`);
  }

  private emitEvent(type: CacheEventType, data: Partial<CacheEvent> = {}): void {
    const handlers = this.eventHandlers.get(type);
    if (handlers) {
      const event: CacheEvent = {
        type,
        timestamp: Date.now(),
        ...data
      };
      
      for (const handler of handlers) {
        try {
          handler(event);
        } catch {
          // Ignore handler errors to prevent cache operation failures
        }
      }
    }
  }
}

export const oraclePerformanceCacheService = new OraclePerformanceCacheService({
  maxSize: 1024 * 1024 * 100, // 100MB
  maxEntries: 10000,
  defaultTtl: 3600000, // 1 hour
  cleanupInterval: 60000, // 1 minute
  compressionThreshold: 1024, // 1KB
  persistToDisk: false,
  strategy: {
    type: 'memory',
    sharding: {
      enabled: false,
      shardCount: 1,
      hashFunction: 'murmur3',
      distribution: 'consistent_hash'
    },
    replication: {
      enabled: false,
      factor: 1,
      strategy: 'master_slave',
      syncMode: 'async'
    },
    consistency: 'eventual'
  },
  evictionPolicy: {
    algorithm: 'lru',
    maxAge: 86400000, // 24 hours
    maxIdleTime: 3600000, // 1 hour
    memoryPressureThreshold: 80
  }
});

export default oraclePerformanceCacheService;
