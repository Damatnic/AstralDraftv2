/**
 * Oracle Historical Analytics View
 * Comprehensive historical prediction tracking, trend analysis, and performance metrics
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    FiBarChart, 
    FiTrendingUp, 
    FiTrendingDown, 
    FiPieChart, 
    FiActivity, 
    FiDownload, 
    FiRefreshCw, 
    FiTarget, 
    FiZap 
} from 'react-icons/fi';
import { 
    LineChart, 
    Line, 
    AreaChart, 
    Area, 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';
import { logger } from '../services/loggingService';

// Type definitions
export type TimeframeType = '7d' | '30d' | '90d' | '1y' | 'all';
export type PredictionType = 'game_outcome' | 'player_performance' | 'trade_analysis' | 'draft_pick';

export interface AnalyticsData {
  date: string;
  accuracy: number;
  predictions: number;
  confidence: number;
  winRate: number;
}

export interface TrendData {
  metric: string;
  current: number;
  previous: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export interface PredictionMetrics {
  total: number;
  correct: number;
  accuracy: number;
  avgConfidence: number;
  byType: Record<PredictionType, { total: number; correct: number; accuracy: number }>;
}

export interface PerformanceMetrics {
  overallAccuracy: number;
  weeklyGrowth: number;
  bestStreak: number;
  currentStreak: number;
  totalPredictions: number;
  confidenceScore: number;
}

const HistoricalAnalyticsView: React.FC = () => {
  // State management
  const [timeframe, setTimeframe] = useState<TimeframeType>('30d');
  const [selectedType, setSelectedType] = useState<PredictionType | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    overallAccuracy: 0,
    weeklyGrowth: 0,
    bestStreak: 0,
    currentStreak: 0,
    totalPredictions: 0,
    confidenceScore: 0
  });
  const [trendData, setTrendData] = useState<TrendData[]>([]);

  // Load analytics data
  const loadAnalyticsData = React.useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Mock data generation for demo
      const mockData = generateMockAnalyticsData(timeframe);
      const mockMetrics = generateMockPerformanceMetrics();
      const mockTrends = generateMockTrendData();
      
      setAnalyticsData(mockData);
      setPerformanceMetrics(mockMetrics);
      setTrendData(mockTrends);
      
      logger.info(`Loaded analytics data for timeframe: ${timeframe}, type: ${selectedType}`);
    } catch (error) {
      logger.error('Failed to load analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [timeframe, selectedType]);

  useEffect(() => {
    loadAnalyticsData();
  }, [loadAnalyticsData]);

  const generateMockAnalyticsData = (period: TimeframeType): AnalyticsData[] => {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
    const data: AnalyticsData[] = [];
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        accuracy: 70 + Math.random() * 25, // 70-95%
        predictions: Math.floor(Math.random() * 20) + 5, // 5-25 predictions
        confidence: 60 + Math.random() * 30, // 60-90%
        winRate: 65 + Math.random() * 25 // 65-90%
      });
    }
    
    return data;
  };

  const generateMockPerformanceMetrics = (): PerformanceMetrics => ({
    overallAccuracy: 78.5 + Math.random() * 15,
    weeklyGrowth: -5 + Math.random() * 15, // -5% to +10%
    bestStreak: Math.floor(Math.random() * 20) + 5,
    currentStreak: Math.floor(Math.random() * 10) + 1,
    totalPredictions: Math.floor(Math.random() * 500) + 100,
    confidenceScore: 75 + Math.random() * 20
  });

  const generateMockTrendData = (): TrendData[] => [
    {
      metric: 'Accuracy',
      current: 82.3,
      previous: 79.1,
      change: 3.2,
      trend: 'up'
    },
    {
      metric: 'Confidence',
      current: 76.8,
      previous: 78.2,
      change: -1.4,
      trend: 'down'
    },
    {
      metric: 'Volume',
      current: 45,
      previous: 38,
      change: 7,
      trend: 'up'
    },
    {
      metric: 'Win Rate',
      current: 84.1,
      previous: 84.1,
      change: 0,
      trend: 'stable'
    }
  ];

  const exportData = (): void => {
    try {
      const csvData = generateCSVData();
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `oracle-analytics-${timeframe}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      logger.info('Analytics data exported successfully');
    } catch (error) {
      logger.error('Failed to export analytics data:', error);
    }
  };

  const generateCSVData = (): string => {
    const headers = ['Date', 'Accuracy', 'Predictions', 'Confidence', 'Win Rate'];
    const rows = analyticsData.map((item: any) => [
      item.date,
      item.accuracy.toFixed(2),
      item.predictions.toString(),
      item.confidence.toFixed(2),
      item.winRate.toFixed(2)
    ]);
    
    return [headers, ...rows].map((row: any) => row.join(',')).join('\n');
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable'): React.ReactNode => {
    switch (trend) {
      case 'up':
        return <FiTrendingUp className="text-green-400" />;
      case 'down':
        return <FiTrendingDown className="text-red-400" />;
      default:
        return <FiActivity className="text-gray-400" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable'): string => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatPercentage = (value: number): string => `${value.toFixed(1)}%`;
  const formatChange = (value: number): string => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Historical Analytics
              </h1>
              <p className="text-gray-300">
                Track your Oracle prediction performance over time
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={exportData}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <FiDownload className="w-4 h-4" />
                <span>Export</span>
              </button>
              
              <button
                onClick={loadAnalyticsData}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Timeframe and Type Selectors */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-gray-300 font-medium">Timeframe:</label>
              <select
                value={timeframe}
                onChange={(e: any) => setTimeframe(e.target.value as TimeframeType)}
                className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-purple-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
                <option value="all">All time</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-gray-300 font-medium">Type:</label>
              <select
                value={selectedType}
                onChange={(e: any) => setSelectedType(e.target.value as PredictionType | 'all')}
                className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-purple-500"
              >
                <option value="all">All predictions</option>
                <option value="game_outcome">Game outcomes</option>
                <option value="player_performance">Player performance</option>
                <option value="trade_analysis">Trade analysis</option>
                <option value="draft_pick">Draft picks</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Performance Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* Overall Accuracy */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <FiTarget className="w-8 h-8 text-purple-400" />
              <span className="text-sm text-gray-400">Overall</span>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {formatPercentage(performanceMetrics.overallAccuracy)}
            </div>
            <div className="text-sm text-gray-400">Accuracy</div>
          </div>

          {/* Weekly Growth */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <FiTrendingUp className="w-8 h-8 text-green-400" />
              <span className="text-sm text-gray-400">Growth</span>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {formatChange(performanceMetrics.weeklyGrowth)}%
            </div>
            <div className="text-sm text-gray-400">This week</div>
          </div>

          {/* Best Streak */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <FiZap className="w-8 h-8 text-yellow-400" />
              <span className="text-sm text-gray-400">Record</span>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {performanceMetrics.bestStreak}
            </div>
            <div className="text-sm text-gray-400">Best streak</div>
          </div>

          {/* Total Predictions */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <FiBarChart className="w-8 h-8 text-blue-400" />
              <span className="text-sm text-gray-400">Volume</span>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {performanceMetrics.totalPredictions.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Total predictions</div>
          </div>
        </motion.div>

        {/* Trend Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <FiActivity className="w-5 h-5 mr-2" />
            Performance Trends
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendData.map((trend, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                <div>
                  <div className="text-sm text-gray-400 mb-1">{trend.metric}</div>
                  <div className="text-xl font-bold text-white">
                    {trend.metric === 'Volume' ? trend.current : formatPercentage(trend.current)}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getTrendIcon(trend.trend)}
                  <span className={`text-sm font-medium ${getTrendColor(trend.trend)}`}>
                    {formatChange(trend.change)}
                    {trend.metric !== 'Volume' && '%'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Accuracy Trend Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <FiTrendingUp className="w-5 h-5 mr-2" />
              Accuracy Trend
            </h3>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickFormatter={(date: any) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Prediction Volume Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <FiBarChart className="w-5 h-5 mr-2" />
              Prediction Volume
            </h3>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickFormatter={(date: any) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Bar dataKey="predictions" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Confidence and Win Rate Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <FiPieChart className="w-5 h-5 mr-2" />
            Confidence vs Win Rate
          </h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(date: any) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="confidence" 
                  stackId="1"
                  stroke="#10B981" 
                  fill="#10B981"
                  fillOpacity={0.3}
                />
                <Area 
                  type="monotone" 
                  dataKey="winRate" 
                  stackId="2"
                  stroke="#F59E0B" 
                  fill="#F59E0B"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <div className="bg-gray-800 rounded-xl p-6 flex items-center space-x-4">
              <FiRefreshCw className="w-6 h-6 text-purple-400 animate-spin" />
              <span className="text-white">Loading analytics data...</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HistoricalAnalyticsView;
