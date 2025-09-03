/**
 * Oracle Analytics Dashboard Component
 * Clean rewrite focusing on core functionality
 */

import React, { useState, useEffect } from 'react';

interface AnalyticsData {
  totalPredictions: number;
  accuracy: number;
  totalUsers: number;
  weeklyGrowth: number;
}

interface OracleAnalyticsDashboardProps {
  className?: string;
}

/**
 * Simple Oracle Analytics Dashboard
 */
export const OracleAnalyticsDashboard: React.FC<OracleAnalyticsDashboardProps> = ({
  className = ''
}) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalPredictions: 0,
    accuracy: 0,
    totalUsers: 0,
    weeklyGrowth: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load analytics data
  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Mock data for now - replace with real API call
        const mockData: AnalyticsData = {
          totalPredictions: 1250,
          accuracy: 78.5,
          totalUsers: 342,
          weeklyGrowth: 12.3
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setAnalyticsData(mockData);
      } catch (err) {
        setError('Failed to load analytics data');
        console.error('Analytics loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className={`oracle-analytics-dashboard bg-gray-800 rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`oracle-analytics-dashboard bg-gray-800 rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-2xl mb-2">⚠️</div>
            <h3 className="text-white text-lg font-semibold mb-2">Error Loading Analytics</h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`oracle-analytics-dashboard bg-gray-800 rounded-lg p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Oracle Analytics</h2>
        <p className="text-gray-400">Performance metrics and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-700 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Total Predictions</h3>
          <p className="text-3xl font-bold text-white">{analyticsData.totalPredictions.toLocaleString()}</p>
          <p className="text-green-400 text-sm mt-1">+{analyticsData.weeklyGrowth}% this week</p>
        </div>

        <div className="bg-gray-700 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Accuracy Rate</h3>
          <p className="text-3xl font-bold text-white">{analyticsData.accuracy}%</p>
          <p className="text-blue-400 text-sm mt-1">Above average</p>
        </div>

        <div className="bg-gray-700 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Active Users</h3>
          <p className="text-3xl font-bold text-white">{analyticsData.totalUsers}</p>
          <p className="text-purple-400 text-sm mt-1">Engaging weekly</p>
        </div>

        <div className="bg-gray-700 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Growth Rate</h3>
          <p className="text-3xl font-bold text-white">+{analyticsData.weeklyGrowth}%</p>
          <p className="text-green-400 text-sm mt-1">Week over week</p>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="space-y-6">
        <div className="bg-gray-700 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Prediction Accuracy Over Time</h3>
          <div className="h-64 flex items-center justify-center bg-gray-600 rounded-lg">
            <div className="text-center">
              <div className="text-gray-400 text-xl mb-2">📊</div>
              <p className="text-gray-300">Chart visualization coming soon</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Popular Prediction Types</h3>
            <div className="h-48 flex items-center justify-center bg-gray-600 rounded-lg">
              <div className="text-center">
                <div className="text-gray-400 text-xl mb-2">🥧</div>
                <p className="text-gray-300">Pie chart coming soon</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">User Engagement</h3>
            <div className="h-48 flex items-center justify-center bg-gray-600 rounded-lg">
              <div className="text-center">
                <div className="text-gray-400 text-xl mb-2">📈</div>
                <p className="text-gray-300">Engagement metrics coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-600">
        <p className="text-xs text-gray-500 text-center">
          Analytics updated every hour • Last updated: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default OracleAnalyticsDashboard;
