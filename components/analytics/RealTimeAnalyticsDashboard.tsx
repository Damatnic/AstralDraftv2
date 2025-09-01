/**
 * Real-Time Analytics Dashboard
 * Advanced analytics dashboard with real-time metrics, predictive insights, and comprehensive reporting
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useState, useEffect, useCallback, useMemo } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { 
}
  Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
//   ComposedChart
} from &apos;recharts&apos;;
import {
}
  TrendingUp, TrendingDown, Activity, Eye, Download, 
  RefreshCw, AlertTriangle, Lightbulb, Play, Pause
} from &apos;lucide-react&apos;;
import { Card, CardContent, CardHeader, CardTitle } from &apos;../ui/Card&apos;;
import { enhancedAnalyticsService, type RealTimeMetrics, type PredictiveInsight } from &apos;../../services/enhancedAnalyticsService&apos;;

// WebSocket hook with basic implementation for demo
const useWebSocket = (url: string, options: any = {}) => {
}
  const [isLoading, setIsLoading] = React.useState(false);
  const [isConnected, setIsConnected] = React.useState(false);
  const [lastMessage, setLastMessage] = React.useState<string | null>(null);
  
  React.useEffect(() => {
}
    // Mock connection for demo
    setIsConnected(true);
    
    // Simulate periodic messages
    const interval = setInterval(() => {
}
      setLastMessage(JSON.stringify({
}
        type: &apos;metrics_update&apos;,
        payload: { timestamp: new Date().toISOString() }
      }));
    }, 30000);
    
    return () => clearInterval(interval);
  }, [url]);
  
  return {
}
    isConnected,
    lastMessage,
    connect: () => setIsConnected(true),
    disconnect: () => setIsConnected(false),
    reconnect: () => setIsConnected(true)
  };
};

interface DashboardState {
}
  isRealTime: boolean;
  selectedTimeframe: &apos;1h&apos; | &apos;24h&apos; | &apos;7d&apos; | &apos;30d&apos; | &apos;all&apos;;
  selectedMetrics: string[];
  alertsEnabled: boolean;
  autoRefresh: boolean;
  refreshInterval: number;

}

const COLORS = {
}
  primary: &apos;#2563eb&apos;,
  secondary: &apos;#7c3aed&apos;,
  success: &apos;#16a34a&apos;,
  warning: &apos;#d97706&apos;,
  danger: &apos;#dc2626&apos;,
  info: &apos;#0891b2&apos;,
  gradient: [&apos;#2563eb&apos;, &apos;#7c3aed&apos;, &apos;#16a34a&apos;, &apos;#d97706&apos;, &apos;#dc2626&apos;]
};

const RealTimeAnalyticsDashboard: React.FC = () => {
}
  const getAccuracyColor = (accuracy: number) => {
}
    if (accuracy > 75) return COLORS.success;
    if (accuracy > 60) return COLORS.warning;
    return COLORS.danger;
  };

  const getInsightBorderColor = (type: string) => {
}
    if (type === &apos;opportunity&apos;) return &apos;border-green-500 bg-green-50&apos;;
    if (type === &apos;warning&apos;) return &apos;border-yellow-500 bg-yellow-50&apos;;
    if (type === &apos;achievement&apos;) return &apos;border-blue-500 bg-blue-50&apos;;
    return &apos;border-purple-500 bg-purple-50&apos;;
  };

  const getImpactColor = (impact: string) => {
}
    if (impact === &apos;high&apos;) return &apos;bg-red-100 text-red-800&apos;;
    if (impact === &apos;medium&apos;) return &apos;bg-yellow-100 text-yellow-800&apos;;
    return &apos;bg-gray-100 text-gray-800&apos;;
  };
  const [metrics, setMetrics] = useState<RealTimeMetrics | null>(null);
  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<DashboardState>({
}
    isRealTime: true,
    selectedTimeframe: &apos;24h&apos;,
    selectedMetrics: [&apos;accuracy&apos;, &apos;predictions&apos;, &apos;users&apos;, &apos;performance&apos;],
    alertsEnabled: true,
    autoRefresh: true,
    refreshInterval: 30000 // 30 seconds
  });

  // WebSocket connection for real-time updates
  const { isConnected, lastMessage } = useWebSocket(&apos;/ws/analytics&apos;, {
}
    enabled: state.isRealTime,
    reconnectInterval: 5000
  });

  // Auto-refresh interval
  useEffect(() => {
}
    if (!state.autoRefresh) return;

    const interval = setInterval(() => {
}
      loadAnalyticsData();
    }, state.refreshInterval);

    return () => clearInterval(interval);
  }, [state.autoRefresh, state.refreshInterval]);

  // Handle WebSocket messages
  useEffect(() => {
}
    if (lastMessage && state.isRealTime) {
}
      try {
}
        const data = JSON.parse(lastMessage);
        if (data.type === &apos;metrics_update&apos;) {
}
          updateMetrics(data.payload);
        } else if (data.type === &apos;insight_generated&apos;) {
}
          addNewInsight(data.payload);
        }
      } catch (error) {
}
        console.error(&apos;Failed to process WebSocket message:&apos;, error);
      }
    }
  }, [lastMessage, state.isRealTime]);

  const loadAnalyticsData = useCallback(async () => {
}
    try {
}

      setLoading(true);
      setError(null);

      // Load real-time metrics
      const realTimeData = await enhancedAnalyticsService.getRealTimeMetrics(state.selectedTimeframe);
      setMetrics(realTimeData);

      // Load predictive insights
      const insights = await enhancedAnalyticsService.getPredictiveInsights(state.selectedTimeframe);
      setPredictiveInsights(insights);

    } catch (error) {
}
      setError(err instanceof Error ? err.message : &apos;Failed to load analytics data&apos;);
      
      // Use mock data for demo
      setMetrics(generateMockRealTimeMetrics());
      setPredictiveInsights(generateMockPredictiveInsights());
    } finally {
}
      setLoading(false);
    }
  }, [state.selectedTimeframe]);

  useEffect(() => {
}
    loadAnalyticsData();
  }, [loadAnalyticsData]);

  const updateMetrics = useCallback((update: Partial<RealTimeMetrics>) => {
}
    setMetrics(prev => prev ? { ...prev, ...update } : null);
  }, []);

  const addNewInsight = useCallback((insight: PredictiveInsight) => {
}
    setPredictiveInsights(prev => [insight, ...prev.slice(0, 9)]);
  }, []);

  const handleStateChange = (updates: Partial<DashboardState>) => {
}
    setState(prev => ({ ...prev, ...updates }));
  };

  const generateReport = async () => {
}
    try {
}

      const report = await enhancedAnalyticsService.generateAnalyticsReport();
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: &apos;application/json&apos; });
      const url = URL.createObjectURL(blob);
      const a = document.createElement(&apos;a&apos;);
      a.href = url;
      a.download = `analytics-report-${new Date().toISOString().split(&apos;T&apos;)[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
}
      console.error(&apos;Error generating report:&apos;, error);
    }
  };

  const recentPredictionsForChart = useMemo(() => {
}
    if (!metrics) return [];
    return metrics.predictions.recent.map((pred, index) => ({
}
      time: `${23 - index}h ago`,
      accuracy: pred.accuracy,
      confidence: pred.confidence
    }));
  }, [metrics]);

  const performanceIndicators = useMemo(() => {
}
    if (!metrics) return [];
    return [
      {
}
        label: &apos;Accuracy&apos;,
        value: `${metrics.accuracy.current.toFixed(1)}%`,
        change: metrics.accuracy.change24h,
        trend: metrics.accuracy.trend,
        color: getAccuracyColor(metrics.accuracy.current)
      },
      {
}
        label: &apos;Active Users&apos;,
        value: metrics.users.active.toLocaleString(),
        change: metrics.users.newToday,
        trend: &apos;up&apos; as const,
        color: COLORS.info
      },
      {
}
        label: &apos;Success Rate&apos;,
        value: `${metrics.predictions.successRate.toFixed(1)}%`,
        change: 0,
        trend: &apos;stable&apos; as const,
        color: COLORS.primary
      },
      {
}
        label: &apos;Response Time&apos;,
        value: `${metrics.performance.responseTime}ms`,
        change: -5,
        trend: &apos;up&apos; as const,
        color: metrics.performance.responseTime < 200 ? COLORS.success : COLORS.warning
      }
    ];
  }, [metrics]);

  const generateMockRealTimeMetrics = (): RealTimeMetrics => ({
}
    timestamp: new Date().toISOString(),
    accuracy: {
}
      current: 78.5,
      change24h: 2.3,
      trend: &apos;up&apos;,
      predictions: Array.from({ length: 24 }, (_, i) => ({
}
        id: `pred-${i}`,
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        accuracy: 70 + Math.random() * 20,
        confidence: 60 + Math.random() * 40,
        type: [&apos;PLAYER_PERFORMANCE&apos;, &apos;GAME_OUTCOME&apos;, &apos;WEEKLY_SCORING&apos;][Math.floor(Math.random() * 3)]
      }))
    },
    predictions: {
}
      total: 1247,
      active: 89,
      resolved: 1158,
      avgConfidence: 74.2,
      successRate: 68.7
    },
    users: {
}
      active: 342,
      newToday: 28,
      totalPredictions: 5640,
      beatOracleRate: 42.1
    },
    performance: {
}
      responseTime: 145,
      uptime: 99.7,
      errorRate: 0.3,
      throughput: 150
    },
    insights: [
      {
}
        id: &apos;insight-1&apos;,
        type: &apos;opportunity&apos;,
        title: &apos;Accuracy Improvement Opportunity&apos;,
        description: &apos;Player performance predictions show 15% better accuracy during prime time hours&apos;,
        confidence: 87,
        impact: &apos;high&apos;,
        actionable: true
      },
      {
}
        id: &apos;insight-2&apos;,
        type: &apos;trend&apos;,
        title: &apos;User Engagement Trending Up&apos;,
        description: &apos;New user retention increased by 23% this week&apos;,
        confidence: 92,
        impact: &apos;medium&apos;,
        actionable: false
      }
    ];
  };

  const generateMockPredictiveInsights = (): PredictiveInsight[] => [
    {
}
      id: &apos;forecast-1&apos;,
      type: &apos;trend&apos;,
      title: &apos;Accuracy Forecast: Next 7 Days&apos;,
      description: &apos;Model predicts 3-5% accuracy improvement based on historical patterns&apos;,
      confidence: 84,
      timeframe: &apos;7d&apos;,
      actionable: true,
      impact: &apos;medium&apos;,
      recommendations: [
        &apos;Focus on player performance predictions during evening hours&apos;,
        &apos;Implement confidence calibration for high-stakes games&apos;
      ],
      data: {
}
        currentAccuracy: 78.5,
        predicted: 82.1,
        trend: Array.from({ length: 7 }, (_, i) => ({
}
          timestamp: new Date(Date.now() + i * 86400000).toISOString(),
          value: 78.5 + (i * 0.6) + (Math.random() - 0.5) * 2,
          confidence: 84 - i * 2
        }))
      }
    }
  ];

  if (loading && !metrics) {
}
    return (
      <div className="flex items-center justify-center h-96 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center sm:px-4 md:px-6 lg:px-8">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600 sm:px-4 md:px-6 lg:px-8" />
          <p className="text-gray-600 sm:px-4 md:px-6 lg:px-8">Loading real-time analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen sm:px-4 md:px-6 lg:px-8">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1 sm:px-4 md:px-6 lg:px-8">Real-Time Analytics Dashboard</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">
            <div className={`w-2 h-2 rounded-full ${isConnected ? &apos;bg-green-500&apos; : &apos;bg-red-500&apos;}`} />
            <span>{isConnected ? &apos;Connected&apos; : &apos;Disconnected&apos;}</span>
            <span>•</span>
            <span>Last updated: {metrics?.timestamp ? new Date(metrics.timestamp).toLocaleTimeString() : &apos;Never&apos;}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:px-4 md:px-6 lg:px-8">
          <select
            value={state.selectedTimeframe}
            onChange={(e: any) => handleStateChange({ selectedTimeframe: e.target.value as any })}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:px-4 md:px-6 lg:px-8"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
          
          <button
            onClick={() => handleStateChange({ isRealTime: !state.isRealTime }}
            className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
}
              state.isRealTime 
                ? &apos;bg-green-100 text-green-700 hover:bg-green-200&apos; 
                : &apos;bg-gray-100 text-gray-700 hover:bg-gray-200&apos;
            }`}
          >
            {state.isRealTime ? <Play className="h-4 w-4 sm:px-4 md:px-6 lg:px-8" /> : <Pause className="h-4 w-4 sm:px-4 md:px-6 lg:px-8" />}
            {state.isRealTime ? &apos;Real-Time&apos; : &apos;Paused&apos;}
          </button>
          
          <button
            onClick={loadAnalyticsData}
            disabled={loading}
            className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8"
           aria-label="Action button">
            <RefreshCw className={`h-4 w-4 ${loading ? &apos;animate-spin&apos; : &apos;&apos;}`} />
//             Refresh
          </button>
          
          <button
            onClick={generateReport}
            className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8"
           aria-label="Action button">
            <Download className="h-4 w-4 sm:px-4 md:px-6 lg:px-8" />
//             Export
          </button>
        </div>
      </div>

      {error && (
}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
          <AlertTriangle className="h-5 w-5 text-red-600 sm:px-4 md:px-6 lg:px-8" />
          <p className="text-red-800 sm:px-4 md:px-6 lg:px-8">{error}</p>
        </div>
      )}

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceIndicators.map((indicator, index) => (
}
          <motion.div
            key={indicator.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white sm:px-4 md:px-6 lg:px-8">
              <CardContent className="p-6 sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                  <div>
                    <p className="text-sm text-gray-600 mb-1 sm:px-4 md:px-6 lg:px-8">{indicator.label}</p>
                    <p className="text-2xl font-bold sm:px-4 md:px-6 lg:px-8" style={{ color: indicator.color }}>{indicator.value}</p>
                    {indicator.change !== 0 && (
}
                      <div className="flex items-center gap-1 mt-1 sm:px-4 md:px-6 lg:px-8">
                        {indicator.trend === &apos;up&apos; ? (
}
                          <TrendingUp className="h-4 w-4 text-green-600 sm:px-4 md:px-6 lg:px-8" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600 sm:px-4 md:px-6 lg:px-8" />
                        )}
                        <span className={`text-sm ${indicator.change > 0 ? &apos;text-green-600&apos; : &apos;text-red-600&apos;}`}>
                          {indicator.change > 0 ? &apos;+&apos; : &apos;&apos;}{indicator.change}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center sm:px-4 md:px-6 lg:px-8" style={{ backgroundColor: `${indicator.color}20` }}>
                    <Activity className="h-6 w-6 sm:px-4 md:px-6 lg:px-8" style={{ color: indicator.color }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Real-Time Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accuracy Trend Chart */}
        <Card className="bg-white sm:px-4 md:px-6 lg:px-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
              <TrendingUp className="h-5 w-5 sm:px-4 md:px-6 lg:px-8" />
              Accuracy Trend (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={accuracyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip>
                  contentStyle={{ 
}
                    backgroundColor: &apos;white&apos;, 
                    border: &apos;1px solid #e2e8f0&apos;, 
                    borderRadius: &apos;8px&apos;,
                    boxShadow: &apos;0 4px 6px -1px rgba(0, 0, 0, 0.1)&apos;
                  }} 
                />
                <Legend />
                <Area>
                  type="monotone" 
                  dataKey="accuracy" 
                  fill={`${COLORS.primary}20`} 
                  stroke={COLORS.primary} 
                  strokeWidth={2}
                  name="Accuracy %"
                />
                <Line>
                  type="monotone" 
                  dataKey="confidence" 
                  stroke={COLORS.secondary} 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Confidence %"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Predictive Insights */}
        <Card className="bg-white sm:px-4 md:px-6 lg:px-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
              <Lightbulb className="h-5 w-5 sm:px-4 md:px-6 lg:px-8" />
              Predictive Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto sm:px-4 md:px-6 lg:px-8">
              <AnimatePresence>
                {predictiveInsights.slice(0, 3).map((insight, index) => (
}
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow sm:px-4 md:px-6 lg:px-8"
                  >
                    <div className="flex items-start justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
                      <h4 className="font-medium text-gray-900 sm:px-4 md:px-6 lg:px-8">{insight.title}</h4>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full sm:px-4 md:px-6 lg:px-8">
                        {insight.confidence}% confidence
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 sm:px-4 md:px-6 lg:px-8">{insight.description}</p>
                    <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                      <span className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">{insight.timeframe} forecast</span>
                      <div className="flex items-center gap-1 sm:px-4 md:px-6 lg:px-8">
                        <span className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">Impact:</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
}
                          insight.impact === &apos;high&apos; ? &apos;bg-green-100 text-green-800&apos; : &apos;bg-yellow-100 text-yellow-800&apos;
                        }`}>
                          {insight.impact === &apos;high&apos; ? &apos;High&apos; : &apos;Moderate&apos;}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-Time Insights Feed */}
      {metrics?.insights && metrics.insights.length > 0 && (
}
        <Card className="bg-white sm:px-4 md:px-6 lg:px-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
              <Eye className="h-5 w-5 sm:px-4 md:px-6 lg:px-8" />
              Real-Time Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {metrics.insights.map((insight, index) => (
}
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-l-4 ${getInsightBorderColor(insight.type)}`}
                >
                  <div className="flex items-start justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
                    <h4 className="font-medium text-gray-900 sm:px-4 md:px-6 lg:px-8">{insight.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getImpactColor(insight.impact)}`}>
                      {insight.impact}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 sm:px-4 md:px-6 lg:px-8">{insight.description}</p>
                  <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                    <span className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">{insight.confidence}% confidence</span>
                    {insight.actionable && (
}
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full sm:px-4 md:px-6 lg:px-8">
//                         Actionable
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const RealTimeAnalyticsDashboardWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <RealTimeAnalyticsDashboard {...props} />
  </ErrorBoundary>
);

export default React.memo(RealTimeAnalyticsDashboardWithErrorBoundary);
