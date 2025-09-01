/**
 * Enhanced Analytics Dashboard Component
 * Comprehensive analytics dashboard with performance metrics, predictive insights, and advanced visualization
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo, useState, useEffect } from &apos;react&apos;;
import { motion } from &apos;framer-motion&apos;;
import {
}
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from &apos;recharts&apos;;
import {
}
  TrendingUp, TrendingDown, Target, Brain, 
  Calendar, Download, RefreshCw,
  BarChart3, LineChart as LineChartIcon,
  RadarIcon, AlertCircle
} from &apos;lucide-react&apos;;
import { Card, CardHeader, CardTitle, CardContent } from &apos;../ui/Card&apos;;
import { Tabs, TabsList, TabsTrigger, TabsContent } from &apos;../ui/ShadcnTabs&apos;;
import { Progress } from &apos;../ui/Progress&apos;;
import { Badge } from &apos;../ui/Badge&apos;;
import { useAuth } from &apos;../../contexts/AuthContext&apos;;
import { useEnhancedAnalytics } from &apos;../../hooks/useEnhancedAnalytics&apos;;

interface EnhancedAnalyticsDashboardProps {
}
  className?: string;
  onExport?: (data: any) => void;

}

interface PerformanceMetric {
}
  id: string;
  name: string;
  value: number;
  change: number;
  trend: &apos;up&apos; | &apos;down&apos; | &apos;stable&apos;;
  format: &apos;percentage&apos; | &apos;number&apos; | &apos;currency&apos; | &apos;time&apos;;
  color: string;
  description?: string;
}

interface ChartConfig {
}
  type: &apos;line&apos; | &apos;area&apos; | &apos;bar&apos; | &apos;pie&apos; | &apos;radar&apos; | &apos;scatter&apos;;
  title: string;
  data: any[];
  config: any;
}

const EnhancedAnalyticsDashboard: React.FC<EnhancedAnalyticsDashboardProps> = ({
}
  className = &apos;&apos;,
//   onExport
}: any) => {
}
  const { isAuthenticated } = useAuth();
  const {
}
    report,
    metrics,
    insights,
    charts,
    loading,
    error,
    refresh,
    exportData,
    setTimeRange,
//     timeRange
  } = useEnhancedAnalytics({ timeRange: 7, autoRefresh: false });

  // State management
  const [activeTab, setActiveTab] = useState(&apos;overview&apos;);
  const [refreshing, setRefreshing] = useState(false);

  const refreshData = async () => {
}
    try {
}

    setRefreshing(true);
    await refresh();
    setRefreshing(false);

    } catch (error) {
}
      console.error(&apos;Error in refreshData:&apos;, error);
    } finally {
}
      setRefreshing(false);
    }
  };

  const exportAnalytics = async () => {
}
    try {
}
      const data = await exportData(&apos;json&apos;);
      
      if (onExport) {
}
        onExport(JSON.parse(data));
      } else {
}
        // Default export as JSON
        const blob = new Blob([data], { type: &apos;application/json&apos; });
        const url = URL.createObjectURL(blob);
        const a = document.createElement(&apos;a&apos;);
        a.href = url;
        a.download = `analytics-${timeRange}d-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
}
      console.error(&apos;Error in exportAnalytics:&apos;, error);
    }
  };

  if (!isAuthenticated) {
}
    return (
      <div className={`enhanced-analytics-dashboard ${className}`}>
        <Card>
          <CardContent className="p-8 text-center sm:px-4 md:px-6 lg:px-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4 sm:px-4 md:px-6 lg:px-8" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2 sm:px-4 md:px-6 lg:px-8">Authentication Required</h3>
            <p className="text-gray-600 sm:px-4 md:px-6 lg:px-8">Please sign in to access your analytics dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
}
    return (
      <div className={`enhanced-analytics-dashboard ${className}`}>
        <Card>
          <CardContent className="p-8 text-center sm:px-4 md:px-6 lg:px-8">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4 sm:px-4 md:px-6 lg:px-8" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2 sm:px-4 md:px-6 lg:px-8">Error Loading Analytics</h3>
            <p className="text-gray-600 mb-4 sm:px-4 md:px-6 lg:px-8">{error}</p>
            <button
              onClick={refreshData}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 sm:px-4 md:px-6 lg:px-8"
             aria-label="Action button">
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
}
    return (
      <div className={`enhanced-analytics-dashboard ${className}`}>
        <Card>
          <CardContent className="p-8 text-center sm:px-4 md:px-6 lg:px-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4 sm:px-4 md:px-6 lg:px-8" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2 sm:px-4 md:px-6 lg:px-8">Authentication Required</h3>
            <p className="text-gray-600 sm:px-4 md:px-6 lg:px-8">Please sign in to access your analytics dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
}
    return (
      <div className="flex justify-center items-center p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 sm:px-4 md:px-6 lg:px-8"></div>
        <span className="ml-2 sm:px-4 md:px-6 lg:px-8">Loading...</span>
      </div>
    );
  }

  return (
    <div className={`enhanced-analytics-dashboard space-y-6 ${className}`}>
      {/* Header with controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:px-4 md:px-6 lg:px-8">Enhanced Analytics Dashboard</h1>
          <p className="text-gray-600 sm:px-4 md:px-6 lg:px-8">Comprehensive performance insights and predictive analytics</p>
        </div>
        
        <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
          <select 
            value={timeRange} 
            onChange={(e: any) => setTimeRange(parseInt(e.target.value))}
          >
            <option value={1}>24 Hours</option>
            <option value={7}>7 Days</option>
            <option value={30}>30 Days</option>
            <option value={90}>90 Days</option>
            <option value={365}>1 Year</option>
          </select>
          
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 sm:px-4 md:px-6 lg:px-8"
           aria-label="Action button">
            <RefreshCw className={`w-4 h-4 ${refreshing ? &apos;animate-spin&apos; : &apos;&apos;}`} />
          </button>
          
          <button
            onClick={exportAnalytics}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-4 md:px-6 lg:px-8"
           aria-label="Action button">
            <Download className="w-4 h-4 mr-1 sm:px-4 md:px-6 lg:px-8" />
//             Export
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 sm:px-4 md:px-6 lg:px-8">
                <div className="animate-pulse sm:px-4 md:px-6 lg:px-8">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 sm:px-4 md:px-6 lg:px-8"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3 mb-4 sm:px-4 md:px-6 lg:px-8"></div>
                  <div className="h-32 bg-gray-200 rounded sm:px-4 md:px-6 lg:px-8"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Main content */}
      {!loading && (
}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 sm:px-4 md:px-6 lg:px-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="comparative">Comparative</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            {/* Key metrics grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {metrics && [
}
                {
}
                  id: &apos;accuracy&apos;,
                  name: &apos;Overall Accuracy&apos;,
                  value: metrics.accuracy.overall * 100,
                  change: metrics.accuracy.trend * 100,
                  trend: metrics.accuracy.trend >= 0 ? &apos;up&apos; : &apos;down&apos;,
                  format: &apos;percentage&apos;,
                  color: &apos;#10B981&apos;,
                  description: &apos;Overall prediction accuracy across all categories&apos;
                },
                {
}
                  id: &apos;win_rate&apos;,
                  name: &apos;User Win Rate&apos;,
                  value: metrics.performance.userWinRate * 100,
                  change: 0,
                  trend: &apos;stable&apos;,
                  format: &apos;percentage&apos;,
                  color: &apos;#3B82F6&apos;,
                  description: &apos;Your success rate against Oracle predictions&apos;
                },
                {
}
                  id: &apos;predictions&apos;,
                  name: &apos;Total Predictions&apos;,
                  value: metrics.engagement.totalPredictions,
                  change: 0,
                  trend: &apos;stable&apos;,
                  format: &apos;number&apos;,
                  color: &apos;#8B5CF6&apos;,
                  description: &apos;Total number of predictions made&apos;
                },
                {
}
                  id: &apos;confidence&apos;,
                  name: &apos;Confidence Correlation&apos;,
                  value: metrics.performance.confidenceCorrelation * 100,
                  change: 0,
                  trend: &apos;stable&apos;,
                  format: &apos;percentage&apos;,
                  color: &apos;#F59E0B&apos;,
                  description: &apos;How well confidence levels predict actual outcomes&apos;
                },
                {
}
                  id: &apos;consistency&apos;,
                  name: &apos;Weekly Consistency&apos;,
                  value: metrics.accuracy.weeklyConsistency,
                  change: 0,
                  trend: &apos;stable&apos;,
                  format: &apos;percentage&apos;,
                  color: &apos;#06B6D4&apos;,
                  description: &apos;Consistency of performance across weeks&apos;
                },
                {
}
                  id: &apos;percentile&apos;,
                  name: &apos;User Percentile&apos;,
                  value: metrics.comparative.userPercentile,
                  change: 0,
                  trend: &apos;stable&apos;,
                  format: &apos;number&apos;,
                  color: &apos;#EF4444&apos;,
                  description: &apos;Your ranking compared to other users&apos;
                }
              ].map((metric: any) => (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-lg transition-shadow sm:px-4 md:px-6 lg:px-8">
                    <CardContent className="p-6 sm:px-4 md:px-6 lg:px-8">
                      <div className="flex items-center justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
                        <h3 className="text-sm font-medium text-gray-600 sm:px-4 md:px-6 lg:px-8">{metric.name}</h3>
                        <div className={`flex items-center text-sm ${
}
                          metric.trend === &apos;up&apos; ? &apos;text-green-600&apos; : 
                          metric.trend === &apos;down&apos; ? &apos;text-red-600&apos; : &apos;text-gray-600&apos;
                        }`}>
                          {metric.trend === &apos;up&apos; && <TrendingUp className="w-4 h-4 mr-1 sm:px-4 md:px-6 lg:px-8" />}
                          {metric.trend === &apos;down&apos; && <TrendingDown className="w-4 h-4 mr-1 sm:px-4 md:px-6 lg:px-8" />}
                          {metric.change > 0 ? &apos;+&apos; : &apos;&apos;}{metric.change.toFixed(1)}%
                        </div>
                      </div>
                      
                      <div className="flex items-center mb-3 sm:px-4 md:px-6 lg:px-8">
                        <span className="text-2xl font-bold text-gray-900 sm:px-4 md:px-6 lg:px-8">
                          {metric.format === &apos;percentage&apos; ? 
}
                            `${metric.value.toFixed(1)}%` : 
                            metric.value.toLocaleString()
                          }
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3 sm:px-4 md:px-6 lg:px-8">
                        <div
                          className="h-2 rounded-full transition-all duration-500 sm:px-4 md:px-6 lg:px-8"
                          style={{ 
}
                            width: `${Math.min(100, metric.value)}%`,
                            backgroundColor: metric.color
                          }}
                        />
                      </div>

                      {metric.description && (
}
                        <p className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">{metric.description}</p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Charts grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {charts.map((chart, index) => (
}
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                        {chart.type === &apos;line&apos; && <LineChartIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />}
                        {chart.type === &apos;bar&apos; && <BarChart3 className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />}
                        {chart.type === &apos;radar&apos; && <RadarIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />}
                        {chart.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 sm:px-4 md:px-6 lg:px-8">
                        <ResponsiveContainer width="100%" height="100%">
                          {chart.type === &apos;line&apos; ? (
}
                            <LineChart data={chart.data}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey={chart.config.xAxisKey} />
                              <YAxis />
                              <Tooltip />
                              <Line>
                                type="monotone" 
                                dataKey={chart.config.yAxisKey}
                                stroke={chart.config.color}
                                strokeWidth={2}
                                dot={{ fill: chart.config.color, strokeWidth: 2, r: 4 }}
                              />
                            </LineChart>
                          ) : chart.type === &apos;bar&apos; ? (
                            <BarChart data={chart.data}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey={chart.config.xAxisKey} />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey={chart.config.yAxisKey} fill="#3B82F6" />
                            </BarChart>
                          ) : chart.type === &apos;radar&apos; ? (
                            <RadarChart data={chart.data}>
                              <PolarGrid />
                              <PolarAngleAxis dataKey={chart.config.angleKey} />
                              <PolarRadiusAxis />
                              <Radar>
                                name="Performance"
                                dataKey={chart.config.radiusKey}
                                stroke={chart.config.color}
                                fill={chart.config.color}
                                fillOpacity={0.3}
                              />
                              <Tooltip />
                            </RadarChart>
                          ) : (
                            <div>Chart type not supported</div>
                          )}
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance details */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                  {metrics && Object.entries(metrics.accuracy.byCategory).map(([type, accuracy]) => (
}
                    <div key={type} className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                      <span className="text-sm font-medium sm:px-4 md:px-6 lg:px-8">{type}</span>
                      <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                        <div className="w-24 bg-gray-200 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                          <div
                            className="h-2 bg-blue-500 rounded-full sm:px-4 md:px-6 lg:px-8"
                            style={{ width: `${accuracy * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12 sm:px-4 md:px-6 lg:px-8">
                          {(accuracy * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Weekly consistency */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Performance Consistency</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Simple placeholder for weekly performance chart */}
                  <div className="h-64 flex items-center justify-center text-gray-500 sm:px-4 md:px-6 lg:px-8">
                    Weekly performance chart will be displayed here
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {insights.map((insight, index) => (
}
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow sm:px-4 md:px-6 lg:px-8">
                    <CardHeader>
                      <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                        <CardTitle className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                          <Brain className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
                          {insight.title}
                        </CardTitle>
                        <Badge>
                          variant={insight.confidence > 80 ? &apos;default&apos; : &apos;secondary&apos;}
                        >
                          {insight.confidence}% confident
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                      <div className="flex items-center gap-4 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                          <Target className="w-4 h-4 text-blue-500 sm:px-4 md:px-6 lg:px-8" />
                          <span className="text-sm font-medium sm:px-4 md:px-6 lg:px-8">Impact:</span>
                          <Badge variant="default" className={
}
                            insight.impact === &apos;high&apos; ? &apos;border-red-300 text-red-700&apos; :
                            insight.impact === &apos;medium&apos; ? &apos;border-yellow-300 text-yellow-700&apos; :
                            &apos;border-green-300 text-green-700&apos;
                          }>
                            {insight.impact}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                          <Calendar className="w-4 h-4 text-gray-500 sm:px-4 md:px-6 lg:px-8" />
                          <span className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">{insight.timeframe}</span>
                        </div>
                      </div>

                      {insight.recommendations && insight.recommendations.length > 0 && (
}
                        <div>
                          <h4 className="text-sm font-medium mb-2 sm:px-4 md:px-6 lg:px-8">Recommendations:</h4>
                          <ul className="text-sm text-gray-600 space-y-1 sm:px-4 md:px-6 lg:px-8">
                            {insight.recommendations.map((rec: string, i: number) => (
}
                              <li key={`rec-${insight.id}-${i}`} className="flex items-start gap-2 sm:px-4 md:px-6 lg:px-8">
                                <span className="text-blue-500 mt-1 sm:px-4 md:px-6 lg:px-8">•</span>
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {insight.data?.potentialGain && (
}
                        <div className="bg-green-50 p-3 rounded-lg sm:px-4 md:px-6 lg:px-8">
                          <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                            <TrendingUp className="w-4 h-4 text-green-600 sm:px-4 md:px-6 lg:px-8" />
                            <span className="text-sm font-medium text-green-800 sm:px-4 md:px-6 lg:px-8">
                              Potential Improvement: {insight.data.potentialGain}
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Comparative Tab */}
          <TabsContent value="comparative" className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            {metrics && (
}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Accuracy Comparison</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                    <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                      <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                        <span className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">Your Performance</span>
                        <span className="font-medium sm:px-4 md:px-6 lg:px-8">
                          {(metrics.accuracy.overall * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                        <span className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">Community Average</span>
                        <span className="font-medium sm:px-4 md:px-6 lg:px-8">65.0%</span>
                      </div>
                      <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                        <span className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">Top 10%</span>
                        <span className="font-medium sm:px-4 md:px-6 lg:px-8">85.0%</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t sm:px-4 md:px-6 lg:px-8">
                      <div className="flex items-center justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
                        <span className="text-sm font-medium sm:px-4 md:px-6 lg:px-8">Your Percentile</span>
                        <Badge variant={metrics.comparative.userPercentile > 75 ? &apos;default&apos; : &apos;secondary&apos;}>
                          {metrics.comparative.userPercentile}th
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 sm:px-4 md:px-6 lg:px-8">
                        <div
                          className="h-3 rounded-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 sm:px-4 md:px-6 lg:px-8"
                          style={{ width: `${metrics.comparative.userPercentile}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                    <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                      <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                        <span className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">Win Rate</span>
                        <span className="font-medium sm:px-4 md:px-6 lg:px-8">
                          {(metrics.performance.userWinRate * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                        <span className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">Confidence Correlation</span>
                        <span className="font-medium sm:px-4 md:px-6 lg:px-8">
                          {(metrics.performance.confidenceCorrelation * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                        <span className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">Weekly Consistency</span>
                        <span className="font-medium sm:px-4 md:px-6 lg:px-8">
                          {metrics.accuracy.weeklyConsistency.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Engagement Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                    <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                      <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                        <span className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">Total Predictions</span>
                        <span className="font-medium sm:px-4 md:px-6 lg:px-8">{metrics.engagement.totalPredictions}</span>
                      </div>
                      <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                        <span className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">Average Confidence</span>
                        <span className="font-medium sm:px-4 md:px-6 lg:px-8">
                          {(metrics.engagement.averageConfidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                        <span className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">Current Streak</span>
                        <span className="font-medium sm:px-4 md:px-6 lg:px-8">{metrics.engagement.streakData.current}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

const EnhancedAnalyticsDashboardWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <EnhancedAnalyticsDashboard {...props} />
  </ErrorBoundary>
);

export default React.memo(EnhancedAnalyticsDashboardWithErrorBoundary);
