/**
 * Cache Integration Demo
 * Demonstrates intelligent caching in action with real examples
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo, useState } from &apos;react&apos;;
import { motion } from &apos;framer-motion&apos;;
import { DatabaseIcon, ZapIcon, WifiOffIcon, CheckCircleIcon } from &apos;lucide-react&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { useCache, useOfflineCache, useCacheOperations } from &apos;../../hooks/useCache&apos;;

// Mock API functions for demonstration
const mockAPIFunctions = {
}
    fetchPlayerStats: async (playerId: string) => {
}
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        return {
}
            id: playerId,
            name: `Player ${playerId}`,
            points: Math.floor(Math.random() * 100),
            position: [&apos;QB&apos;, &apos;RB&apos;, &apos;WR&apos;, &apos;TE&apos;][Math.floor(Math.random() * 4)],
            team: [&apos;KC&apos;, &apos;SF&apos;, &apos;BUF&apos;, &apos;LAR&apos;][Math.floor(Math.random() * 4)],
            lastUpdated: new Date().toISOString()
        };
    },

    fetchDraftRoomData: async (roomId: string) => {
}
        await new Promise(resolve => setTimeout(resolve, 800));
        return {
}
            id: roomId,
            name: `Draft Room ${roomId}`,
            participants: Math.floor(Math.random() * 12) + 1,
            currentPick: Math.floor(Math.random() * 200) + 1,
            status: [&apos;active&apos;, &apos;paused&apos;, &apos;completed&apos;][Math.floor(Math.random() * 3)],
            lastActivity: new Date().toISOString()
        };
    },

    fetchOraclePrediction: async (predictionId: string) => {
}
        await new Promise(resolve => setTimeout(resolve, 1200));
        return {
}
            id: predictionId,
            player: `Player ${predictionId}`,
            prediction: Math.floor(Math.random() * 50) + 50,
            confidence: Math.floor(Math.random() * 30) + 70,
            factors: [&apos;Weather&apos;, &apos;Matchup&apos;, &apos;Recent Form&apos;, &apos;Injury Status&apos;],
            timestamp: new Date().toISOString()
        };

};

const CacheIntegrationDemo: React.FC = () => {
}
    const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
    const { preloadData } = useCacheOperations();

    // Demo 1: Standard caching with automatic refresh
    const playerCache = useCache(
        &apos;players&apos;,
        &apos;player-123&apos;,
        () => mockAPIFunctions.fetchPlayerStats(&apos;123&apos;),
        {
}
            staleTime: 10 * 1000, // 10 seconds
            cacheTime: 30 * 1000, // 30 seconds
            refreshInterval: 15 * 1000, // Refresh every 15 seconds

    );

    // Demo 2: Offline-aware caching
    const draftCache = useOfflineCache(
        &apos;draft&apos;,
        &apos;room-456&apos;,
        () => mockAPIFunctions.fetchDraftRoomData(&apos;456&apos;),
        {
}
            staleTime: 5 * 1000, // 5 seconds (real-time data)
            cacheTime: 60 * 1000, // 1 minute

    );

    // Demo 3: Manual cache management
    const oracleCache = useCache(
        &apos;oracle&apos;,
        &apos;prediction-789&apos;,
        () => mockAPIFunctions.fetchOraclePrediction(&apos;789&apos;),
        {
}
            enabled: selectedDemo === &apos;oracle&apos;, // Only fetch when selected
            staleTime: 30 * 1000, // 30 seconds
            cacheTime: 5 * 60 * 1000, // 5 minutes

    );

    const demos = [
        {
}
            id: &apos;player&apos;,
            name: &apos;Player Stats Cache&apos;,
            description: &apos;Auto-refreshing player statistics with smart caching&apos;,
            cache: playerCache,
            icon: DatabaseIcon,
            color: &apos;blue&apos;
        },
        {
}
            id: &apos;draft&apos;,
            name: &apos;Offline-Aware Draft&apos;,
            description: &apos;Draft room data with offline fallback&apos;,
            cache: draftCache,
            icon: WifiOffIcon,
            color: &apos;green&apos;
        },
        {
}
            id: &apos;oracle&apos;,
            name: &apos;Oracle Predictions&apos;,
            description: &apos;On-demand Oracle predictions with manual control&apos;,
            cache: oracleCache,
            icon: ZapIcon,
            color: &apos;purple&apos;

    ];

    const handlePreload = async () => {
}
        try {
}

            await preloadData(
                &apos;players&apos;,
                &apos;player-preload&apos;,
                () => mockAPIFunctions.fetchPlayerStats(&apos;preload&apos;),
                { tags: [&apos;preload&apos;, &apos;demo&apos;] }
            );
        
    `p-4 rounded-lg border-2 transition-colors cursor-pointer ${
}
//                                             isActive 
                                                ? `border-${demo.color}-500 bg-${demo.color}-900/20` 
                                                : &apos;border-gray-600 bg-gray-700/50 hover:border-gray-500&apos;
                                        }`}
                                        onClick={() => setSelectedDemo(demo.id)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="flex items-center space-x-3 mb-3 sm:px-4 md:px-6 lg:px-8">
                                            <demo.icon className={`w-6 h-6 text-${demo.color}-400`} />
                                            <span className="font-medium text-white sm:px-4 md:px-6 lg:px-8">{demo.name}</span>
                                        </div>
                                        
                                        <div className="text-sm text-gray-400 mb-3 sm:px-4 md:px-6 lg:px-8">
                                            {demo.description}
                                        </div>

                                        {/* Cache Status */}
                                        <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                                            <div className="flex items-center justify-between text-xs sm:px-4 md:px-6 lg:px-8">
                                                <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Status:</span>
                                                <span className={`flex items-center space-x-1 ${getStatusColor(cache)}`}>
                                                    <span>{getStatusIcon(cache)}</span>
                                                    <span>{getCacheStatusText(cache)}</span>
                                                </span>
                                            </div>
                                            
                                            {Boolean(cache.lastUpdated) && (
}
                                                <div className="flex items-center justify-between text-xs sm:px-4 md:px-6 lg:px-8">
                                                    <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Last Updated:</span>
                                                    <span className="text-gray-300 sm:px-4 md:px-6 lg:px-8">
                                                        {cache.lastUpdated ? new Date(cache.lastUpdated).toLocaleTimeString() : &apos;Never&apos;}
                                                    </span>
                                                </div>
                                            )}

                                            {demo.id === &apos;draft&apos; && &apos;isOnline&apos; in cache && (
}
                                                <div className="flex items-center justify-between text-xs sm:px-4 md:px-6 lg:px-8">
                                                    <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Network:</span>
                                                    <span className={`flex items-center space-x-1 ${
}
                                                        cache.isOnline ? &apos;text-green-400&apos; : &apos;text-red-400&apos;
                                                    }`}>
                                                        <span>{cache.isOnline ? &apos;🟢&apos; : &apos;🔴&apos;}</span>
                                                        <span>{cache.isOnline ? &apos;Online&apos; : &apos;Offline&apos;}</span>
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-3 space-y-2 sm:px-4 md:px-6 lg:px-8">
                                            <button
                                                onClick={(e: any) = aria-label="Action button"> {
}
                                                    e.stopPropagation();
                                                    cache.refetch();
                                                }}
                                                disabled={cache.isFetching}
                                                className="w-full px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-xs rounded transition-colors sm:px-4 md:px-6 lg:px-8"
                                            >
                                                {cache.isFetching ? &apos;Refreshing...&apos; : &apos;Refresh&apos;}
                                            </button>
                                            
                                            <button
                                                onClick={(e: any) = aria-label="Action button"> {
}
                                                    e.stopPropagation();
                                                    cache.invalidate();
                                                }}
                                                className="w-full px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors sm:px-4 md:px-6 lg:px-8"
                                            >
//                                                 Invalidate
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Data Preview */}
                    {selectedDemo && (
}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-800/30 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8"
                        >
                            <h3 className="text-lg font-semibold text-white mb-4 sm:px-4 md:px-6 lg:px-8">
                                Cached Data Preview
                            </h3>
                            <pre className="bg-black/50 rounded-lg p-4 text-sm text-gray-300 overflow-auto sm:px-4 md:px-6 lg:px-8">
                                {JSON.stringify(
}
                                    demos.find((d: any) => d.id === selectedDemo)?.cache.data,
                                    null,
//                                     2
                                )}
                            </pre>
                        </motion.div>
                    )}

                    {/* Cache Operations */}
                    <div className="bg-gray-800/30 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
                        <h3 className="text-lg font-semibold text-white mb-4 sm:px-4 md:px-6 lg:px-8">
                            Advanced Cache Operations
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <button
                                onClick={handlePreload}
                                className="flex items-center justify-center space-x-2 p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8"
                             aria-label="Action button">
                                <DatabaseIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
                                <span>Preload Data</span>
                            </button>
                            
                            <button
                                onClick={() = aria-label="Action button"> {
}
                                    // Force all demos to refresh
                                    playerCache.refetch();
                                    draftCache.refetch();
                                    if (selectedDemo === &apos;oracle&apos;) {
}
                                        oracleCache.refetch();

                                }}
                                className="flex items-center justify-center space-x-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8"
                            >
                                <CheckCircleIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
                                <span>Refresh All</span>
                            </button>
                        </div>
                    </div>

                    {/* Benefits Summary */}
                    <div className="bg-green-900/20 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
                        <h3 className="text-lg font-semibold text-white mb-4 sm:px-4 md:px-6 lg:px-8">
                            ✅ Intelligent Caching Benefits
                        </h3>
                        <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-300">
                            <div>• Reduced API calls and server load</div>
                            <div>• Improved app responsiveness</div>
                            <div>• Offline functionality support</div>
                            <div>• Smart cache invalidation</div>
                            <div>• Memory + IndexedDB storage</div>
                            <div>• Service Worker integration</div>
                            <div>• Automatic stale data refresh</div>
                            <div>• Priority-based cache cleanup</div>
                            <div>• Network-aware strategies</div>
                            <div>• Background data synchronization</div>
                        </div>
                    </div>
                </div>
            </Widget>
        </div>
    );
};

const CacheIntegrationDemoWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <CacheIntegrationDemo {...props} />
  </ErrorBoundary>
);

export default React.memo(CacheIntegrationDemoWithErrorBoundary);
