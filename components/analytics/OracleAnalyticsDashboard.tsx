/**
 * Enhanced Oracle Analytics Dashboard Component
 * Real-time integration with Sports.io data and Oracle predictions
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  useOracleAnalytics,
  useOraclePredictionUpdates,
  useOraclePerformanceMetrics,
  useOracleSystemStatus
} from '../../hooks/useEnhancedOracleAnalytics';
import { TrendingUpIcon } from '../icons/TrendingUpIcon';
import { TrendingDownIcon } from '../icons/TrendingDownIcon';
import { ZapIcon } from '../icons/ZapIcon';
import { ActivityIcon } from '../icons/ActivityIcon';
import { TargetIcon } from '../icons/TargetIcon';
import { ClockIcon } from '../icons/ClockIcon';

interface OracleAnalyticsDashboardProps {
  className?: string;
}

/**
 * Enhanced Oracle Analytics Dashboard with Real-time Integration
 */
export const OracleAnalyticsDashboard: React.FC<OracleAnalyticsDashboardProps> = ({
  className = ''
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '24h' | '7d'>('24h');
  
  // Enhanced hooks for real-time data
  const { dashboard, isLoading, error, lastUpdate } = useOracleAnalytics();
  const { updates } = useOraclePredictionUpdates(8);
  const performanceMetrics = useOraclePerformanceMetrics();
  const systemStatus = useOracleSystemStatus();

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-yellow-400';
      case 'poor': return 'text-orange-400';
      case 'offline': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  if (isLoading) {
    return (
      <div className={`oracle-analytics-dashboard bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading real-time analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`oracle-analytics-dashboard bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-2xl mb-2">⚠️</div>
            <h3 className="text-white text-lg font-semibold mb-2">Analytics Unavailable</h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`oracle-analytics-dashboard bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
              <ZapIcon className="w-6 h-6 text-blue-400" />
              Oracle Analytics
            </h2>
            <p className="text-sm text-gray-400">
              Real-time insights powered by live Sports.io data
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* System Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${systemStatus.connectionQuality === 'excellent' ? 'bg-green-400 animate-pulse' : 
                systemStatus.connectionQuality === 'good' ? 'bg-yellow-400' : 
                systemStatus.connectionQuality === 'poor' ? 'bg-orange-400' : 'bg-red-400'}`}></div>
              <span className={`text-xs font-medium ${getStatusColor(systemStatus.connectionQuality)}`}>
                {systemStatus.connectionQuality.toUpperCase()}
              </span>
            </div>
            
            {/* Time Range Selector */}
            <div className="flex bg-slate-700 rounded-lg p-1">
              {(['1h', '24h', '7d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedTimeRange(range)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    selectedTimeRange === range 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Last Update Info */}
        {lastUpdate && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <ClockIcon className="w-3 h-3" />
            Last updated: {formatTimeAgo(lastUpdate)}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Live Players */}
          <motion.div 
            className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Live Players</p>
                <p className="text-2xl font-bold text-white">
                  {dashboard?.livePlayerCount || 0}
                </p>
              </div>
              <ActivityIcon className="w-8 h-8 text-green-400" />
            </div>
            <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
              <TrendingUpIcon className="w-3 h-3" />
              Active tracking
            </div>
          </motion.div>

          {/* Active Games */}
          <motion.div 
            className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Active Games</p>
                <p className="text-2xl font-bold text-white">
                  {dashboard?.activeGames || 0}
                </p>
              </div>
              <TargetIcon className="w-8 h-8 text-blue-400" />
            </div>
            <div className="mt-2 text-xs text-blue-400 flex items-center gap-1">
              <ZapIcon className="w-3 h-3" />
              Real-time data
            </div>
          </motion.div>

          {/* Oracle Accuracy */}
          <motion.div 
            className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Accuracy Today</p>
                <p className="text-2xl font-bold text-white">
                  {performanceMetrics.accuracyToday.toFixed(1)}%
                </p>
              </div>
              <TrendingUpIcon className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="mt-2 text-xs text-yellow-400">
              vs. {performanceMetrics.avgConfidence * 100}% confidence
            </div>
          </motion.div>

          {/* Live Updates */}
          <motion.div 
            className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Live Updates</p>
                <p className="text-2xl font-bold text-white">
                  {performanceMetrics.liveUpdates}
                </p>
              </div>
              <ZapIcon className="w-8 h-8 text-purple-400 animate-pulse" />
            </div>
            <div className="mt-2 text-xs text-purple-400">
              Last minute
            </div>
          </motion.div>
        </div>

        {/* Performance Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performers */}
          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <TrendingUpIcon className="w-5 h-5 text-green-400" />
              Top Performers
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {dashboard?.topPerformers?.slice(0, 5).map((performer, index) => (
                <div key={performer.playerId} className="flex items-center justify-between p-2 rounded bg-slate-600/30">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="text-sm text-white">
                      Player {performer.playerId.slice(-4)}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-green-400">
                    +{performer.performanceMetrics?.vsProjection?.toFixed(1) || 0}%
                  </span>
                </div>
              )) || (
                <div className="text-center py-8 text-gray-500">
                  <p>No performance data available</p>
                  <p className="text-xs mt-1">Data will appear during active games</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Updates */}
          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <ActivityIcon className="w-5 h-5 text-blue-400" />
              Recent Updates
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {updates?.map((update) => (
                <motion.div 
                  key={update.predictionId}
                  className="p-3 rounded bg-slate-600/30 border-l-2 border-blue-400"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-white font-medium">
                        {update.type.replace('_', ' ').toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Confidence: {(update.confidence * 100).toFixed(0)}%
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(new Date(update.timestamp))}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-2 truncate">
                    {update.reasoning}
                  </p>
                </motion.div>
              )) || (
                <div className="text-center py-8 text-gray-500">
                  <p>No recent updates</p>
                  <p className="text-xs mt-1">Oracle predictions will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Game Highlights */}
        {dashboard?.gameHighlights && dashboard.gameHighlights.length > 0 && (
          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <TargetIcon className="w-5 h-5 text-yellow-400" />
              Game Highlights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dashboard.gameHighlights.map((game, index) => (
                <motion.div 
                  key={game.gameId}
                  className="bg-slate-600/30 rounded-lg p-3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">
                      {game.teams}
                    </span>
                    <span className="text-sm text-blue-400">
                      Q{game.quarter}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-white">
                      {game.score}
                    </span>
                    {game.analytics && (
                      <span className="text-xs text-gray-400">
                        Pace: {game.analytics.totalScoringPace?.toFixed(1) || 'N/A'}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OracleAnalyticsDashboard;
