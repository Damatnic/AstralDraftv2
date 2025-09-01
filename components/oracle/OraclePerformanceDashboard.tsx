/**
 * Oracle Performance Dashboard Component
 * Showcases UI performance optimizations for real-time Oracle interactions
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useState, useEffect, useCallback, useMemo, memo } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { 
}
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Area, AreaChart
} from &apos;recharts&apos;;
import { 
}
    Activity, 
    Zap, 
    Clock, 
    Database, 
    TrendingUp, 
    Settings,
    RefreshCw,
//     CheckCircle
} from &apos;lucide-react&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { useMediaQuery } from &apos;../../hooks/useMediaQuery&apos;;
import {
}
    useOraclePerformanceMonitoring,
    useThrottledOracleUpdates,
    useOptimizedUserInput,
//     useBatchedAnalyticsUpdates
} from &apos;../../hooks/useOraclePerformanceOptimization&apos;;
import oraclePerformanceOptimizationService from &apos;../../services/oraclePerformanceOptimizationService&apos;;

// Memoized performance metric card
const PerformanceMetricCard = memo(({ 
}
    title, 
    value, 
    unit, 
    trend, 
    icon: Icon,
    color = &apos;blue&apos; 
}: {
}
    title: string;
    value: number;
    unit: string;
    trend?: &apos;up&apos; | &apos;down&apos; | &apos;stable&apos;;
    icon: React.ComponentType<any>;
    color?: string;
}) => {
}
    const colorClasses = {
}
        blue: &apos;text-blue-600 bg-blue-100&apos;,
        green: &apos;text-green-600 bg-green-100&apos;,
        orange: &apos;text-orange-600 bg-orange-100&apos;,
        purple: &apos;text-purple-600 bg-purple-100&apos;
    };

    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 sm:px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
                <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`}>
                    <Icon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
                </div>
                {trend && (
}
                    <div className={`text-xs px-2 py-1 rounded ${
}
                        trend === &apos;up&apos; ? &apos;bg-green-100 text-green-600&apos; :
                        trend === &apos;down&apos; ? &apos;bg-red-100 text-red-600&apos; :
                        &apos;bg-gray-100 text-gray-600&apos;
                    }`}>
                        {trend === &apos;up&apos; ? &apos;↑&apos; : trend === &apos;down&apos; ? &apos;↓&apos; : &apos;→&apos;}
                    </div>
                )}
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white sm:px-4 md:px-6 lg:px-8">
                {value.toFixed(value < 10 ? 2 : 0)}{unit}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">{title}</div>
        </div>
    );
});

// Memoized real-time updates list
const RealTimeUpdatesList = memo(({ updates, maxVisible = 5 }: {
}
    updates: any[];
    maxVisible?: number;
}) => {
}
    const visibleUpdates = useMemo(() => 
        updates.slice(-maxVisible).reverse(), 
        [updates, maxVisible]
    );

    return (
        <div className="space-y-2 max-h-40 overflow-y-auto sm:px-4 md:px-6 lg:px-8">
            <AnimatePresence>
                {visibleUpdates.map((update, index) => (
}
                    <motion.div
                        key={`${update.id}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded sm:px-4 md:px-6 lg:px-8"
                    >
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse sm:px-4 md:px-6 lg:px-8"></div>
                        <div className="flex-1 text-sm text-gray-700 dark:text-gray-300 sm:px-4 md:px-6 lg:px-8">
                            {update.message}
                        </div>
                        <div className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">
                            {new Date(update.timestamp).toLocaleTimeString()}
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
});

// Memoized performance chart
const PerformanceChart = memo(({ data, height = 200 }: {
}
    data: any[];
    height?: number;
}) => {
}
    const chartData = useMemo(() => 
        data.map((item, index) => ({
}
            time: index,
            renderTime: item.renderTime || 0,
            cacheHitRate: item.cacheHitRate || 0,
            memoryUsage: item.memoryUsage || 0
        })),
        [data]
    );

    return (
        <ResponsiveContainer width="100%" height={height}>
            <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line>
                    type="monotone" 
                    dataKey="renderTime" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Render Time (ms)"
                />
                <Line>
                    type="monotone" 
                    dataKey="cacheHitRate" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="Cache Hit Rate (%)"
                />
            </LineChart>
        </ResponsiveContainer>
    );
});

// Debounced settings panel
const SettingsPanel = memo(({ 
}
    onConfigUpdate,
//     currentConfig 
}: {
}
    onConfigUpdate: (config: any) => void;
    currentConfig: any;
}) => {
}
    const { value: debounceMs, setValue: setDebounceMs } = useOptimizedUserInput(
        currentConfig.userInputDebounceMs?.toString() || &apos;300&apos;
    );
    
    const { value: throttleMs, setValue: setThrottleMs } = useOptimizedUserInput(
        currentConfig.realTimeUpdateThrottleMs?.toString() || &apos;100&apos;
    );

    const handleSave = useCallback(() => {
}
        onConfigUpdate({
}
            userInputDebounceMs: parseInt(debounceMs) || 300,
            realTimeUpdateThrottleMs: parseInt(throttleMs) || 100
        });
    }, [debounceMs, throttleMs, onConfigUpdate]);

    return (
        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">
                    Input Debounce (ms)
                </label>
                <input
                    type="number"
                    value={debounceMs}
                    onChange={(e: any) => setDebounceMs(e.target.value)}
                    min="0"
                    max="2000"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">
                    Update Throttle (ms)
                </label>
                <input
                    type="number"
                    value={throttleMs}
                    onChange={(e: any) => setThrottleMs(e.target.value)}
                    min="0"
                    max="1000"
                />
            </div>
            
            <button
                onClick={handleSave}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8"
             aria-label="Action button">
                Apply Settings
            </button>
        </div>
    );
});

// Main dashboard component
const OraclePerformanceDashboard: React.FC<{
}
    className?: string;
}> = ({ className = &apos;&apos; }: any) => {
}
    const isMobile = useMediaQuery(&apos;(max-width: 768px)&apos;);
    
    // Performance monitoring
    const { metrics, startRenderMeasurement, endRenderMeasurement } = useOraclePerformanceMonitoring();
    
    // Real-time updates
    const { updates, addUpdate } = useThrottledOracleUpdates();
    
    // Batched analytics
    const { batchedUpdates, addAnalyticsUpdate } = useBatchedAnalyticsUpdates();
    
    // Local state
    const [activeTab, setActiveTab] = useState<&apos;overview&apos; | &apos;performance&apos; | &apos;settings&apos;>(&apos;overview&apos;);
    const [showSettings, setShowSettings] = useState(false);
    const [performanceHistory, setPerformanceHistory] = useState<any[]>([]);
    const [isOptimizing, setIsOptimizing] = useState(false);

    // Performance measurement
    useEffect(() => {
}
        startRenderMeasurement();
        return () => {
}
            endRenderMeasurement();
        };
    });

    // Simulate real-time updates
    useEffect(() => {
}
        const interval = setInterval(() => {
}
            const updateTypes = [&apos;PREDICTION_UPDATE&apos;, &apos;USER_JOINED&apos;, &apos;CONSENSUS_CHANGE&apos;];
            const randomType = updateTypes[Math.floor(Math.random() * updateTypes.length)];
            
            addUpdate({
}
                id: `update-${Date.now()}`,
                type: randomType,
                message: `Simulated ${randomType.toLowerCase().replace(&apos;_&apos;, &apos; &apos;)}`,
                timestamp: new Date().toISOString()
            });
            
            // Add analytics update
            addAnalyticsUpdate({
}
                type: &apos;performance_metric&apos;,
                value: Math.random() * 100,
                timestamp: new Date().toISOString()
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [addUpdate, addAnalyticsUpdate]);

    // Track performance history
    useEffect(() => {
}
    const interval = setInterval(() => {
}
            setPerformanceHistory(prev => [
                ...prev.slice(-19), // Keep last 20 entries
                {
}
                    timestamp: Date.now(),
                    renderTime: metrics.averageRenderTime,
                    cacheHitRate: metrics.cacheHitRate,
                    memoryUsage: metrics.memoryUsage

            ]);
    , 1000);

        return () => clearInterval(interval);
    }
  }, [metrics]);

    // Handle performance optimization
    const handleOptimization = useCallback(async () 
} {
}
        setIsOptimizing(true);
        try {
}
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate optimization
            oraclePerformanceOptimizationService.optimizePerformance();
            addUpdate({
}
                id: `optimization-${Date.now()}`,
                type: &apos;SYSTEM_OPTIMIZATION&apos;,
                message: &apos;Performance optimization completed&apos;,
                timestamp: new Date().toISOString()
            });
        } finally {
}
            setIsOptimizing(false);

    }, [addUpdate]);

    // Handle configuration updates
    const handleConfigUpdate = useCallback((newConfig: any) => {
}
        oraclePerformanceOptimizationService.updateConfig(newConfig);
        addUpdate({
}
            id: `config-${Date.now()}`,
            type: &apos;CONFIG_UPDATE&apos;,
            message: &apos;Performance configuration updated&apos;,
            timestamp: new Date().toISOString()
        });
    }, [addUpdate]);

    const renderOverviewTab = () => (
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            {/* Performance metrics grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <PerformanceMetricCard>
                    title="Render Time"
                    value={metrics.averageRenderTime}
                    unit="ms"
                    icon={Clock}
                    color="blue"
                    trend={metrics.averageRenderTime < 16 ? &apos;up&apos; : &apos;stable&apos;}
                />
                <PerformanceMetricCard>
                    title="Cache Hit Rate"
                    value={metrics.cacheHitRate}
                    unit="%"
                    icon={Database}
                    color="green"
                    trend="up"
                />
                <PerformanceMetricCard>
                    title="Memory Usage"
                    value={metrics.memoryUsage}
                    unit="MB"
                    icon={Activity}
                    color="orange"
                    trend="stable"
                />
                <PerformanceMetricCard>
                    title="Render Count"
                    value={metrics.renderCount}
                    unit=""
                    icon={TrendingUp}
                    color="purple"
                    trend="up"
                />
            </div>

            {/* Real-time updates */}
            <Widget title="Real-Time Updates" className="bg-white dark:bg-gray-800 sm:px-4 md:px-6 lg:px-8">
                <RealTimeUpdatesList updates={updates} maxVisible={isMobile ? 3 : 5} />
            </Widget>

            {/* Optimization controls */}
            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={handleOptimization}
                    disabled={isOptimizing}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8"
                 aria-label="Action button">
                    {isOptimizing ? (
}
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent sm:px-4 md:px-6 lg:px-8"></div>
                            <span>Optimizing...</span>
                        </>
                    ) : (
                        <>
                            <Zap className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                            <span>Optimize Performance</span>
                        </>
                    )}
                </button>
                
                <button
                    onClick={() => setShowSettings(!showSettings)}
                >
                    <Settings className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                    <span>Settings</span>
                </button>
            </div>
        </div>
    );

    const renderPerformanceTab = () => (
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            <Widget title="Performance Trends" className="bg-white dark:bg-gray-800 sm:px-4 md:px-6 lg:px-8">
                <PerformanceChart data={performanceHistory} height={isMobile ? 200 : 300} />
            </Widget>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Widget title="Batched Updates" className="bg-white dark:bg-gray-800 sm:px-4 md:px-6 lg:px-8">
                    <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                        <div className="text-sm text-gray-600 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">
                            Processing {batchedUpdates.length} batched analytics updates
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 sm:px-4 md:px-6 lg:px-8">
                            <div className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">
                                Last batch: {batchedUpdates.length > 0 ? 
}
                                    new Date(batchedUpdates[batchedUpdates.length - 1]?.timestamp || Date.now()).toLocaleTimeString() :
                                    &apos;No updates&apos;

                            </div>
                        </div>
                    </div>
                </Widget>
                
                <Widget title="Optimization Status" className="bg-white dark:bg-gray-800 sm:px-4 md:px-6 lg:px-8">
                    <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                            <CheckCircle className="w-4 h-4 text-green-500 sm:px-4 md:px-6 lg:px-8" />
                            <span className="text-sm sm:px-4 md:px-6 lg:px-8">Virtual scrolling enabled</span>
                        </div>
                        <div className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                            <CheckCircle className="w-4 h-4 text-green-500 sm:px-4 md:px-6 lg:px-8" />
                            <span className="text-sm sm:px-4 md:px-6 lg:px-8">Debounced user input</span>
                        </div>
                        <div className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                            <CheckCircle className="w-4 h-4 text-green-500 sm:px-4 md:px-6 lg:px-8" />
                            <span className="text-sm sm:px-4 md:px-6 lg:px-8">Throttled updates</span>
                        </div>
                        <div className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                            <CheckCircle className="w-4 h-4 text-green-500 sm:px-4 md:px-6 lg:px-8" />
                            <span className="text-sm sm:px-4 md:px-6 lg:px-8">Intelligent caching</span>
                        </div>
                    </div>
                </Widget>
            </div>
        </div>
    );

  if (isLoading) {
}
    return (
      <div className="flex justify-center items-center p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 sm:px-4 md:px-6 lg:px-8"></div>
        <span className="ml-2 sm:px-4 md:px-6 lg:px-8">Loading...</span>
      </div>
    );

  return (
        <div className={`oracle-performance-dashboard ${className}`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:px-4 md:px-6 lg:px-8">
                        Performance Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">
                        Real-time Oracle UI performance monitoring and optimization
                    </p>
                </div>
                
                <div className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                    <button
                        onClick={() => setActiveTab(&apos;overview&apos;)}`}
                    >
//                         Overview
                    </button>
                    <button
                        onClick={() => setActiveTab(&apos;performance&apos;)}`}
                    >
//                         Performance
                    </button>
                </div>
            </div>

            {/* Settings panel */}
            <AnimatePresence>
                {showSettings && (
}
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: &apos;auto&apos; }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 sm:px-4 md:px-6 lg:px-8"
                    >
                        <Widget title="Performance Settings" className="bg-white dark:bg-gray-800 sm:px-4 md:px-6 lg:px-8">
                            <SettingsPanel>
                                onConfigUpdate={handleConfigUpdate}
                                currentConfig={oraclePerformanceOptimizationService}
                            />
                        </Widget>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tab content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === &apos;overview&apos; ? renderOverviewTab() : renderPerformanceTab()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default memo(OraclePerformanceDashboard);
