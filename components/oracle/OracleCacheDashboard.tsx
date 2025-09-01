/**
 * Oracle Cache Dashboard
 * Real-time cache monitoring and management interface
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useMemo, useState } from 'react';
import { useOracleCacheManager } from '../../hooks/useOracleCacheHooks';
import './OracleCacheDashboard.css';

interface CacheMetricsDisplayProps {
    stats: any;
    isOptimizing: boolean;
    onOptimize: () => Promise<any>;
    onWarmCache: (userId: string) => Promise<void>;
    onClearCache: (tags?: string[]) => void;
}

const OracleCacheDashboard: React.FC<CacheMetricsDisplayProps> = ({
    stats,
    isOptimizing,
    onOptimize,
    onWarmCache,
//     onClearCache
}: any) => {
    const [userId, setUserId] = useState('user123');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [optimizationResults, setOptimizationResults] = useState<any>(null);

    const handleOptimize = async () => {
        try {

            const results = await onOptimize();
            setOptimizationResults(results);
            setTimeout(() => setOptimizationResults(null), 5000);

    } catch (error) {

    };

    const getHealthColor = (score: number) => {
        if (score >= 80) return '#22c55e'; // green
        if (score >= 60) return '#f59e0b'; // yellow
        return '#ef4444'; // red
    };

    const formatPercentage = (value: number) => {
        return `${Math.round(value * 100) / 100}%`;
    };

    if (!stats) {
        return (
            <div className="oracle-cache-dashboard loading sm:px-4 md:px-6 lg:px-8">
                <div className="loading-spinner sm:px-4 md:px-6 lg:px-8"></div>
                <p>Loading cache statistics...</p>
            </div>
        );

    return (
        <div className="oracle-cache-dashboard sm:px-4 md:px-6 lg:px-8">
            <div className="dashboard-header sm:px-4 md:px-6 lg:px-8">
                <h2>🧠 Oracle Cache Dashboard</h2>
                <div className="health-score sm:px-4 md:px-6 lg:px-8">
                    <span 
                        className="health-indicator sm:px-4 md:px-6 lg:px-8"
                        style={{ backgroundColor: getHealthColor(stats.healthScore) }}
                    >
                        {stats.healthScore}
                    </span>
                    <span>Health Score</span>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="metrics-grid sm:px-4 md:px-6 lg:px-8">
                <div className="metric-card sm:px-4 md:px-6 lg:px-8">
                    <div className="metric-icon sm:px-4 md:px-6 lg:px-8">📊</div>
                    <div className="metric-content sm:px-4 md:px-6 lg:px-8">
                        <h3>Hit Rate</h3>
                        <div className="metric-value sm:px-4 md:px-6 lg:px-8">{formatPercentage(stats.hitRate)}</div>
                        <div className="metric-subtitle sm:px-4 md:px-6 lg:px-8">
                            {stats.hits} hits / {stats.hits + stats.misses} requests
                        </div>
                    </div>
                </div>

                <div className="metric-card sm:px-4 md:px-6 lg:px-8">
                    <div className="metric-icon sm:px-4 md:px-6 lg:px-8">💾</div>
                    <div className="metric-content sm:px-4 md:px-6 lg:px-8">
                        <h3>Memory Usage</h3>
                        <div className="metric-value sm:px-4 md:px-6 lg:px-8">{stats.memoryUsage}</div>
                        <div className="metric-subtitle sm:px-4 md:px-6 lg:px-8">
                            {stats.entryCount} entries cached
                        </div>
                    </div>
                </div>

                <div className="metric-card sm:px-4 md:px-6 lg:px-8">
                    <div className="metric-icon sm:px-4 md:px-6 lg:px-8">⚡</div>
                    <div className="metric-content sm:px-4 md:px-6 lg:px-8">
                        <h3>Avg Response</h3>
                        <div className="metric-value sm:px-4 md:px-6 lg:px-8">{Math.round(stats.avgResponseTime)}ms</div>
                        <div className="metric-subtitle sm:px-4 md:px-6 lg:px-8">
                            Cache lookup time
                        </div>
                    </div>
                </div>

                <div className="metric-card sm:px-4 md:px-6 lg:px-8">
                    <div className="metric-icon sm:px-4 md:px-6 lg:px-8">🗑️</div>
                    <div className="metric-content sm:px-4 md:px-6 lg:px-8">
                        <h3>Evictions</h3>
                        <div className="metric-value sm:px-4 md:px-6 lg:px-8">{stats.evictions}</div>
                        <div className="metric-subtitle sm:px-4 md:px-6 lg:px-8">
                            LRU evicted entries
                        </div>
                    </div>
                </div>
            </div>

            {/* Cache Operations */}
            <div className="cache-operations sm:px-4 md:px-6 lg:px-8">
                <div className="operation-section sm:px-4 md:px-6 lg:px-8">
                    <h3>🔧 Cache Operations</h3>
                    <div className="operation-buttons sm:px-4 md:px-6 lg:px-8">
                        <button 
                            className="btn-optimize sm:px-4 md:px-6 lg:px-8"
                            onClick={handleOptimize}
                            disabled={isOptimizing}
                         aria-label="Action button">
                            {isOptimizing ? '🔄 Optimizing...' : '⚡ Optimize Cache'}
                        </button>

                        <div className="warm-cache-control sm:px-4 md:px-6 lg:px-8">
                            <input
                                type="text"
                                placeholder="User ID"
                                value={userId}
                                onChange={(e: any) => setUserId(e.target.value)}
                            />
                            <button 
                                className="btn-warm sm:px-4 md:px-6 lg:px-8"
                                onClick={() => onWarmCache(userId)}
                            >
                                🔥 Warm Cache
                            </button>
                        </div>

                        <div className="clear-cache-control sm:px-4 md:px-6 lg:px-8">
                            <select 
//                                 multiple
                                value={selectedTags}
                                onChange={(e: any) => setSelectedTags(Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value))}
                            >
                                <option value="predictions">Predictions</option>
                                <option value="analytics">Analytics</option>
                                <option value="leaderboard">Leaderboard</option>
                                <option value="user-stats">User Stats</option>
                                <option value="notifications">Notifications</option>
                            </select>
                            <button 
                                className="btn-clear sm:px-4 md:px-6 lg:px-8"
                                onClick={() => onClearCache(selectedTags.length > 0 ? selectedTags : undefined)}
                                🧹 Clear Cache
                            </button>
                        </div>
                    </div>
                </div>

                {optimizationResults && (
                    <div className="optimization-results sm:px-4 md:px-6 lg:px-8">
                        <h4>✨ Optimization Results</h4>
                        <div className="results-grid sm:px-4 md:px-6 lg:px-8">
                            <div className="result-item sm:px-4 md:px-6 lg:px-8">
                                <span>Entries Evicted:</span>
                                <strong>{optimizationResults.entriesEvicted}</strong>
                            </div>
                            <div className="result-item sm:px-4 md:px-6 lg:px-8">
                                <span>Memory Freed:</span>
                                <strong>{(optimizationResults.memoryFreed / 1024).toFixed(1)} KB</strong>
                            </div>
                            <div className="result-item sm:px-4 md:px-6 lg:px-8">
                                <span>Compression Savings:</span>
                                <strong>{(optimizationResults.compressionSavings / 1024).toFixed(1)} KB</strong>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Top Cached Items */}
            <div className="top-items sm:px-4 md:px-6 lg:px-8">
                <h3>🔝 Most Accessed Items</h3>
                <div className="items-list sm:px-4 md:px-6 lg:px-8">
                    {stats.topKeys.map((item: any, index: number) => (
                        <div key={item.key} className="item-row sm:px-4 md:px-6 lg:px-8">
                            <div className="item-rank sm:px-4 md:px-6 lg:px-8">#{index + 1}</div>
                            <div className="item-details sm:px-4 md:px-6 lg:px-8">
                                <div className="item-key sm:px-4 md:px-6 lg:px-8">{item.key}</div>
                                <div className="item-stats sm:px-4 md:px-6 lg:px-8">
                                    {item.accessCount} accesses • {item.size}
                                </div>
                            </div>
                            <div className="item-actions sm:px-4 md:px-6 lg:px-8">
                                <button 
                                    className="btn-invalidate sm:px-4 md:px-6 lg:px-8"
                                    onClick={() => onClearCache([item.key])}
                                >
                                    ❌
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cache Strategies */}
            <div className="cache-strategies sm:px-4 md:px-6 lg:px-8">
                <h3>📋 Cache Strategies</h3>
                <div className="strategies-grid sm:px-4 md:px-6 lg:px-8">
                    {Object.entries(stats.strategies).map(([key, strategy]: [string, any]) => (
                        <div key={key} className="strategy-card sm:px-4 md:px-6 lg:px-8">
                            <div className="strategy-header sm:px-4 md:px-6 lg:px-8">
                                <h4>{strategy.name}</h4>
                                <div className="strategy-priority sm:px-4 md:px-6 lg:px-8">
                                    Priority: {strategy.priority}
                                </div>
                            </div>
                            <div className="strategy-details sm:px-4 md:px-6 lg:px-8">
                                <div className="strategy-row sm:px-4 md:px-6 lg:px-8">
                                    <span>TTL:</span>
                                    <span>{Math.round(strategy.ttl / 1000)}s</span>
                                </div>
                                <div className="strategy-row sm:px-4 md:px-6 lg:px-8">
                                    <span>Prefetch:</span>
                                    <span>{strategy.prefetch ? '✅' : '❌'}</span>
                                </div>
                                <div className="strategy-row sm:px-4 md:px-6 lg:px-8">
                                    <span>Compression:</span>
                                    <span>{strategy.compression ? '✅' : '❌'}</span>
                                </div>
                                <div className="strategy-row sm:px-4 md:px-6 lg:px-8">
                                    <span>Persistence:</span>
                                    <span>{strategy.persistence ? '✅' : '❌'}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Real-time Activity Log */}
            <div className="activity-log sm:px-4 md:px-6 lg:px-8">
                <h3>📝 Recent Activity</h3>
                <div className="log-entries sm:px-4 md:px-6 lg:px-8">
                    <div className="log-entry sm:px-4 md:px-6 lg:px-8">
                        <span className="log-time sm:px-4 md:px-6 lg:px-8">{new Date().toLocaleTimeString()}</span>
                        <span className="log-action hit sm:px-4 md:px-6 lg:px-8">Cache Hit</span>
                        <span className="log-key sm:px-4 md:px-6 lg:px-8">predictions:week:12:user123</span>
                    </div>
                    <div className="log-entry sm:px-4 md:px-6 lg:px-8">
                        <span className="log-time sm:px-4 md:px-6 lg:px-8">{new Date(Date.now() - 30000).toLocaleTimeString()}</span>
                        <span className="log-action miss sm:px-4 md:px-6 lg:px-8">Cache Miss</span>
                        <span className="log-key sm:px-4 md:px-6 lg:px-8">analytics:user456:7d</span>
                    </div>
                    <div className="log-entry sm:px-4 md:px-6 lg:px-8">
                        <span className="log-time sm:px-4 md:px-6 lg:px-8">{new Date(Date.now() - 60000).toLocaleTimeString()}</span>
                        <span className="log-action set sm:px-4 md:px-6 lg:px-8">Cache Set</span>
                        <span className="log-key sm:px-4 md:px-6 lg:px-8">leaderboard:overall</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main component with integrated cache management
const OracleCacheManager: React.FC = () => {
    const { stats, isOptimizing, optimize, warmCache, clearCache } = useOracleCacheManager();

    return (
        <OracleCacheDashboard
            stats={stats}
            isOptimizing={isOptimizing}
            onOptimize={optimize}
            onWarmCache={warmCache}
            onClearCache={clearCache}
        />
    );
};

const OracleCacheManagerWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <OracleCacheManager {...props} />
  </ErrorBoundary>
);

export default React.memo(OracleCacheManagerWithErrorBoundary);
