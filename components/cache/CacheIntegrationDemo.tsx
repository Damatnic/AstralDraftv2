/**
 * Cache Integration Demo
 * Demonstrates intelligent caching in action with real examples
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { DatabaseIcon, ZapIcon, WifiOffIcon, CheckCircleIcon } from 'lucide-react';
import { Widget } from '../ui/Widget';
import { useCache, useOfflineCache, useCacheOperations } from '../../hooks/useCache';

// Mock API functions for demonstration
const mockAPIFunctions = {
    fetchPlayerStats: async (playerId: string) => {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        return {
            id: playerId,
            name: `Player ${playerId}`,
            points: Math.floor(Math.random() * 100),
            position: ['QB', 'RB', 'WR', 'TE'][Math.floor(Math.random() * 4)],
            team: ['KC', 'SF', 'BUF', 'LAR'][Math.floor(Math.random() * 4)],
            lastUpdated: new Date().toISOString()
        };
    },

    fetchDraftRoomData: async (roomId: string) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        return {
            id: roomId,
            name: `Draft Room ${roomId}`,
            participants: Math.floor(Math.random() * 12) + 1,
            currentPick: Math.floor(Math.random() * 200) + 1,
            status: ['active', 'paused', 'completed'][Math.floor(Math.random() * 3)],
            lastActivity: new Date().toISOString()
        };
    },

    fetchOraclePrediction: async (predictionId: string) => {
        await new Promise(resolve => setTimeout(resolve, 1200));
        return {
            id: predictionId,
            player: `Player ${predictionId}`,
            prediction: Math.floor(Math.random() * 50) + 50,
            confidence: Math.floor(Math.random() * 30) + 70,
            factors: ['Weather', 'Matchup', 'Recent Form', 'Injury Status'],
            timestamp: new Date().toISOString()
        };

};

const CacheIntegrationDemo: React.FC = () => {
    const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
    const { preloadData } = useCacheOperations();

    // Demo 1: Standard caching with automatic refresh
    const playerCache = useCache(
        'players',
        'player-123',
        () => mockAPIFunctions.fetchPlayerStats('123'),
        {
            staleTime: 10 * 1000, // 10 seconds
            cacheTime: 30 * 1000, // 30 seconds
            refreshInterval: 15 * 1000, // Refresh every 15 seconds

    );

    // Demo 2: Offline-aware caching
    const draftCache = useOfflineCache(
        'draft',
        'room-456',
        () => mockAPIFunctions.fetchDraftRoomData('456'),
        {
            staleTime: 5 * 1000, // 5 seconds (real-time data)
            cacheTime: 60 * 1000, // 1 minute

    );

    // Demo 3: Manual cache management
    const oracleCache = useCache(
        'oracle',
        'prediction-789',
        () => mockAPIFunctions.fetchOraclePrediction('789'),
        {
            enabled: selectedDemo === 'oracle', // Only fetch when selected
            staleTime: 30 * 1000, // 30 seconds
            cacheTime: 5 * 60 * 1000, // 5 minutes

    );

    const demos = [
        {
            id: 'player',
            name: 'Player Stats Cache',
            description: 'Auto-refreshing player statistics with smart caching',
            cache: playerCache,
            icon: DatabaseIcon,
            color: 'blue'
        },
        {
            id: 'draft',
            name: 'Offline-Aware Draft',
            description: 'Draft room data with offline fallback',
            cache: draftCache,
            icon: WifiOffIcon,
            color: 'green'
        },
        {
            id: 'oracle',
            name: 'Oracle Predictions',
            description: 'On-demand Oracle predictions with manual control',
            cache: oracleCache,
            icon: ZapIcon,
            color: 'purple'

    ];

    const handlePreload = async () => {
        try {

            await preloadData(
                'players',
                'player-preload',
                () => mockAPIFunctions.fetchPlayerStats('preload'),
                { tags: ['preload', 'demo'] }
            );
        
    `p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                                            isActive 
                                                ? `border-${demo.color}-500 bg-${demo.color}-900/20` 
                                                : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
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
                                                <div className="flex items-center justify-between text-xs sm:px-4 md:px-6 lg:px-8">
                                                    <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Last Updated:</span>
                                                    <span className="text-gray-300 sm:px-4 md:px-6 lg:px-8">
                                                        {cache.lastUpdated ? new Date(cache.lastUpdated).toLocaleTimeString() : 'Never'}
                                                    </span>
                                                </div>
                                            )}

                                            {demo.id === 'draft' && 'isOnline' in cache && (
                                                <div className="flex items-center justify-between text-xs sm:px-4 md:px-6 lg:px-8">
                                                    <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Network:</span>
                                                    <span className={`flex items-center space-x-1 ${
                                                        cache.isOnline ? 'text-green-400' : 'text-red-400'
                                                    }`}>
                                                        <span>{cache.isOnline ? '🟢' : '🔴'}</span>
                                                        <span>{cache.isOnline ? 'Online' : 'Offline'}</span>
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-3 space-y-2 sm:px-4 md:px-6 lg:px-8">
                                            <button
                                                onClick={(e: any) = aria-label="Action button"> {
                                                    e.stopPropagation();
                                                    cache.refetch();
                                                }}
                                                disabled={cache.isFetching}
                                                className="w-full px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-xs rounded transition-colors sm:px-4 md:px-6 lg:px-8"
                                            >
                                                {cache.isFetching ? 'Refreshing...' : 'Refresh'}
                                            </button>
                                            
                                            <button
                                                onClick={(e: any) = aria-label="Action button"> {
                                                    e.stopPropagation();
                                                    cache.invalidate();
                                                }}
                                                className="w-full px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors sm:px-4 md:px-6 lg:px-8"
                                            >
                                                Invalidate
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Data Preview */}
                    {selectedDemo && (
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
                                    demos.find((d: any) => d.id === selectedDemo)?.cache.data,
                                    null,
                                    2
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
                                    // Force all demos to refresh
                                    playerCache.refetch();
                                    draftCache.refetch();
                                    if (selectedDemo === 'oracle') {
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

const CacheIntegrationDemoWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <CacheIntegrationDemo {...props} />
  </ErrorBoundary>
);

export default React.memo(CacheIntegrationDemoWithErrorBoundary);
