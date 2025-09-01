/**
 * Advanced Oracle Analytics and Reporting Dashboard
 * Comprehensive performance tracking with Oracle vs user analysis
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo, useState, useEffect } from &apos;react&apos;;
import { 
}
    LineChart, Line, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from &apos;recharts&apos;;
import {
}
    TrendingUp, TrendingDown, Target, Brain,
    Trophy, Users, Zap,
    Activity, Eye, Award, Download, RefreshCw
} from &apos;lucide-react&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { Card, CardContent, CardHeader, CardTitle } from &apos;../ui/Card&apos;;

interface AdvancedAnalyticsMetrics {
}
    oracle: {
}
        overallAccuracy: number;
        weeklyAccuracy: Array<{ week: number; accuracy: number; predictions: number }>;
        typeAccuracy: Record<string, { accuracy: number; volume: number }>;
        confidenceCalibration: Array<{ range: string; predicted: number; actual: number }>;
        predictionTrends: Array<{ date: string; accuracy: number; volume: number }>;
    };
    users: {
}
        averageAccuracy: number;
        beatOracleRate: number;
        participationTrends: Array<{ week: number; users: number; predictions: number }>;
        confidenceDistribution: Array<{ range: string; count: number; accuracy: number }>;
        topPerformers: Array<{ user: string; accuracy: number; oracleBeats: number }>;
    };
    comparative: {
}
        weeklyComparison: Array<{ 
}
            week: number; 
            oracleAccuracy: number; 
            userAccuracy: number; 
            oracleConfidence: number;
            userConfidence: number;
        }>;
        typeComparison: Array<{
}
            type: string;
            oracleAccuracy: number;
            userAccuracy: number;
            difficulty: number;
        }>;
        confidenceComparison: Array<{
}
            confidenceRange: string;
            oracleAccuracy: number;
            userAccuracy: number;
            oracleVolume: number;
            userVolume: number;
        }>;
    };
    insights: {
}
        performanceGaps: Array<{ metric: string; gap: number; trend: &apos;improving&apos; | &apos;declining&apos; | &apos;stable&apos; }>;
        userBehaviors: Array<{ behavior: string; impact: number; recommendation: string }>;
        marketInefficiencies: Array<{ area: string; opportunity: number; description: string }>;
        predictionPatterns: Array<{ pattern: string; frequency: number; successRate: number }>;
    };
}

interface ReportFilters {
}
    timeframe: &apos;week&apos; | &apos;month&apos; | &apos;season&apos; | &apos;all&apos;;
    predictionTypes: string[];
    confidenceRange: [number, number];
    includedUsers: &apos;all&apos; | &apos;active&apos; | &apos;top10&apos; | &apos;custom&apos;;
    season: number;

}

const AdvancedOracleAnalyticsDashboard: React.FC = () => {
}
  const [isLoading, setIsLoading] = React.useState(false);
    const [metrics, setMetrics] = useState<AdvancedAnalyticsMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [_filters, _setFilters] = useState<ReportFilters>({
}
        timeframe: &apos;season&apos;,
        predictionTypes: [&apos;PLAYER_PERFORMANCE&apos;, &apos;GAME_OUTCOME&apos;, &apos;WEEKLY_SCORING&apos;],
        confidenceRange: [0, 100],
        includedUsers: &apos;all&apos;,
        season: 2024
    });
    const [reportGenerating, setReportGenerating] = useState(false);

    useEffect(() => {
}
        loadAdvancedAnalytics();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadAdvancedAnalytics = async () => {
}
        setLoading(true);
        try {
}

            // Fetch comprehensive analytics data
            const [oracleStats, userStats, comparativeStats] = await Promise.all([
                fetchOraclePerformanceData(),
                fetchUserPerformanceData(), 
                fetchComparativeAnalytics()
            ]);

            const insights = generateAdvancedInsights(oracleStats, userStats, comparativeStats);

            setMetrics({
}
                oracle: oracleStats,
                users: userStats,
                comparative: comparativeStats,
//                 insights
            });
    
    } catch (error) {
}
            // Use mock data for demo
            setMetrics(generateMockAdvancedMetrics());
        } finally {
}
            setLoading(false);
        }
    };

    const fetchOraclePerformanceData = async () => {
}
        try {
}

            const response = await fetch(`/api/oracle/analytics/performance?season=${_filters.season}`);
            return response.json();
        } catch (error) {
}
            console.error(error);
            return null;
        }
    };

    const fetchUserPerformanceData = async () => {
}
        try {
}
            const response = await fetch(`/api/oracle/analytics/users?season=${_filters.season}`);
            return response.json();
        } catch (error) {
}
            console.error(error);
            return null;
        }
    };

    const fetchComparativeAnalytics = async () => {
}
        try {
}
            const response = await fetch(`/api/oracle/analytics/comparative?season=${_filters.season}`);
            return response.json();
        } catch (error) {
}
            console.error(error);
            return null;
        }
    };

    const generateAdvancedInsights = (oracle: any, users: any, comparative: any) => {
}
        // Advanced AI-powered insight generation
        const performanceGaps = [
            { metric: &apos;Overall Accuracy&apos;, gap: oracle.overallAccuracy - users.averageAccuracy, trend: &apos;stable&apos; as const },
            { metric: &apos;Confidence Calibration&apos;, gap: calculateCalibrationGap(oracle, users), trend: &apos;improving&apos; as const },
            { metric: &apos;High-Confidence Predictions&apos;, gap: calculateHighConfidenceGap(oracle, users), trend: &apos;declining&apos; as const }
        ];

        const userBehaviors = [
            { behavior: &apos;Overconfidence Bias&apos;, impact: 15, recommendation: &apos;Users tend to be overconfident in game outcome predictions&apos; },
            { behavior: &apos;Recency Bias&apos;, impact: 12, recommendation: &apos;Users weight recent performance too heavily&apos; },
            { behavior: &apos;Home Team Bias&apos;, impact: 8, recommendation: &apos;Users favor home teams beyond statistical justification&apos; }
        ];

        const marketInefficiencies = [
            { area: &apos;Player Performance Late Season&apos;, opportunity: 22, description: &apos;Users underestimate player fatigue effects&apos; },
            { area: &apos;Weather Impact Predictions&apos;, opportunity: 18, description: &apos;Weather effects consistently undervalued&apos; },
            { area: &apos;Division Rivalry Games&apos;, opportunity: 14, description: &apos;Emotional betting in rivalry matchups&apos; }
        ];

        const predictionPatterns = [
            { pattern: &apos;High Confidence + Low Accuracy&apos;, frequency: 23, successRate: 45 },
            { pattern: &apos;Conservative Betting&apos;, frequency: 67, successRate: 72 },
            { pattern: &apos;Contrarian Picks&apos;, frequency: 12, successRate: 58 }
        ];

        return { performanceGaps, userBehaviors, marketInefficiencies, predictionPatterns };
    };

    const calculateCalibrationGap = (oracle: any, users: any): number => {
}
        // Calculate how well-calibrated predictions are
        return Math.abs(oracle.confidenceCalibration?.[0]?.predicted - oracle.confidenceCalibration?.[0]?.actual) || 5;
    };

    const calculateHighConfidenceGap = (oracle: any, users: any): number => {
}
        // Calculate performance gap in high confidence predictions
        return 12; // Mock calculation
    };

    const generateMockAdvancedMetrics = (): AdvancedAnalyticsMetrics => {
}
        const weeks = Array.from({ length: 18 }, (_, i) => i + 1);
        
        return {
}
            oracle: {
}
                overallAccuracy: 78.5,
                weeklyAccuracy: weeks.map((week: any) => ({
}
                    week,
                    accuracy: 65 + Math.random() * 30,
                    predictions: 3 + Math.floor(Math.random() * 4)
                })),
                typeAccuracy: {
}
                    &apos;PLAYER_PERFORMANCE&apos;: { accuracy: 82, volume: 45 },
                    &apos;GAME_OUTCOME&apos;: { accuracy: 75, volume: 38 },
                    &apos;WEEKLY_SCORING&apos;: { accuracy: 71, volume: 27 }
                },
                confidenceCalibration: [
                    { range: &apos;90-100%&apos;, predicted: 95, actual: 89 },
                    { range: &apos;80-89%&apos;, predicted: 85, actual: 83 },
                    { range: &apos;70-79%&apos;, predicted: 75, actual: 76 },
                    { range: &apos;60-69%&apos;, predicted: 65, actual: 68 }
                ],
                predictionTrends: weeks.map((week: any) => ({
}
                    date: `Week ${week}`,
                    accuracy: 65 + Math.random() * 25,
                    volume: 3 + Math.floor(Math.random() * 4)
                }))
            },
            users: {
}
                averageAccuracy: 64.2,
                beatOracleRate: 28.5,
                participationTrends: weeks.map((week: any) => ({
}
                    week,
                    users: 8 + Math.floor(Math.random() * 15),
                    predictions: 25 + Math.floor(Math.random() * 50)
                })),
                confidenceDistribution: [
                    { range: &apos;90-100%&apos;, count: 12, accuracy: 58 },
                    { range: &apos;80-89%&apos;, count: 28, accuracy: 67 },
                    { range: &apos;70-79%&apos;, count: 45, accuracy: 71 },
                    { range: &apos;60-69%&apos;, count: 38, accuracy: 65 },
                    { range: &apos;50-59%&apos;, count: 22, accuracy: 62 }
                ],
                topPerformers: [
                    { user: &apos;Player 5&apos;, accuracy: 85, oracleBeats: 12 },
                    { user: &apos;Player 3&apos;, accuracy: 82, oracleBeats: 10 },
                    { user: &apos;Player 8&apos;, accuracy: 79, oracleBeats: 9 },
                    { user: &apos;Player 1&apos;, accuracy: 77, oracleBeats: 8 },
                    { user: &apos;Player 7&apos;, accuracy: 75, oracleBeats: 7 }
                ]
            },
            comparative: {
}
                weeklyComparison: weeks.map((week: any) => ({
}
                    week,
                    oracleAccuracy: 65 + Math.random() * 25,
                    userAccuracy: 55 + Math.random() * 25,
                    oracleConfidence: 75 + Math.random() * 20,
                    userConfidence: 68 + Math.random() * 25
                })),
                typeComparison: [
                    { type: &apos;PLAYER_PERFORMANCE&apos;, oracleAccuracy: 82, userAccuracy: 68, difficulty: 7.5 },
                    { type: &apos;GAME_OUTCOME&apos;, oracleAccuracy: 75, userAccuracy: 62, difficulty: 8.2 },
                    { type: &apos;WEEKLY_SCORING&apos;, oracleAccuracy: 71, userAccuracy: 59, difficulty: 8.8 }
                ],
                confidenceComparison: [
                    { confidenceRange: &apos;90-100%&apos;, oracleAccuracy: 89, userAccuracy: 58, oracleVolume: 15, userVolume: 12 },
                    { confidenceRange: &apos;80-89%&apos;, oracleAccuracy: 83, userAccuracy: 67, oracleVolume: 28, userVolume: 28 },
                    { confidenceRange: &apos;70-79%&apos;, oracleAccuracy: 76, userAccuracy: 71, oracleVolume: 32, userVolume: 45 },
                    { confidenceRange: &apos;60-69%&apos;, oracleAccuracy: 68, userAccuracy: 65, oracleVolume: 25, userVolume: 38 }
                ]
            },
            insights: {
}
                performanceGaps: [
                    { metric: &apos;Overall Accuracy&apos;, gap: 14.3, trend: &apos;stable&apos; },
                    { metric: &apos;Confidence Calibration&apos;, gap: 8.7, trend: &apos;improving&apos; },
                    { metric: &apos;High-Confidence Predictions&apos;, gap: 21.5, trend: &apos;declining&apos; }
                ],
                userBehaviors: [
                    { behavior: &apos;Overconfidence Bias&apos;, impact: 15, recommendation: &apos;Users tend to be overconfident in game outcome predictions&apos; },
                    { behavior: &apos;Recency Bias&apos;, impact: 12, recommendation: &apos;Users weight recent performance too heavily&apos; },
                    { behavior: &apos;Home Team Bias&apos;, impact: 8, recommendation: &apos;Users favor home teams beyond statistical justification&apos; }
                ],
                marketInefficiencies: [
                    { area: &apos;Player Performance Late Season&apos;, opportunity: 22, description: &apos;Users underestimate player fatigue effects&apos; },
                    { area: &apos;Weather Impact Predictions&apos;, opportunity: 18, description: &apos;Weather effects consistently undervalued&apos; },
                    { area: &apos;Division Rivalry Games&apos;, opportunity: 14, description: &apos;Emotional betting in rivalry matchups&apos; }
                ],
                predictionPatterns: [
                    { pattern: &apos;High Confidence + Low Accuracy&apos;, frequency: 23, successRate: 45 },
                    { pattern: &apos;Conservative Betting&apos;, frequency: 67, successRate: 72 },
                    { pattern: &apos;Contrarian Picks&apos;, frequency: 12, successRate: 58 }
                ]
            }
        };
    };

    const generateReport = async () => {
}
        setReportGenerating(true);
        try {
}

            // Generate comprehensive PDF report
            const reportData = {
}
                metrics,
                filters: _filters,
                generatedAt: new Date().toISOString(),
                insights: metrics?.insights
            };

            // In a real implementation, this would call a backend service
            const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: &apos;application/json&apos; });
            const url = URL.createObjectURL(blob);
            const a = document.createElement(&apos;a&apos;);
            a.href = url;
            a.download = `oracle-analytics-report-${new Date().toISOString().split(&apos;T&apos;)[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
}
            console.error(&apos;Failed to generate report:&apos;, error);
        } finally {
}
            setReportGenerating(false);
        }
    };

    const MetricCard: React.FC<{
}
        title: string;
        value: string;
        subtitle?: string;
        trend?: &apos;up&apos; | &apos;down&apos; | &apos;stable&apos;;
        icon: React.ReactNode;
        color: string;
    }> = ({ title, value, subtitle, trend, icon, color }: any) => (
        <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-sm text-gray-400">{title}</p>
                        <div className="flex items-center space-x-2">
                            <span className={`text-xl font-bold ${color}`}>{value}</span>
                            {trend && (
}
                                <div className="flex items-center sm:px-4 md:px-6 lg:px-8">
                                    {trend === &apos;up&apos; && <TrendingUp className="w-4 h-4 text-green-400 sm:px-4 md:px-6 lg:px-8" />}
                                    {trend === &apos;down&apos; && <TrendingDown className="w-4 h-4 text-red-400 sm:px-4 md:px-6 lg:px-8" />}
                                    {trend === &apos;stable&apos; && <div className="w-4 h-1 bg-gray-400 rounded sm:px-4 md:px-6 lg:px-8" />}
                                </div>
                            )}
                        </div>
                        {subtitle && <p className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">{subtitle}</p>}
                    </div>
                    <div className={color}>
                        {icon}
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    if (loading) {
}
        return (
            <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
                <div className="text-center sm:px-4 md:px-6 lg:px-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto sm:px-4 md:px-6 lg:px-8"></div>
                    <p className="text-gray-400 mt-2 sm:px-4 md:px-6 lg:px-8">Loading advanced analytics...</p>
                </div>
            </div>
        );

    if (!metrics) {
}
        return (
            <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
                <Widget title="Advanced Analytics" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                    <div className="text-center py-8 sm:px-4 md:px-6 lg:px-8">
                        <Activity className="w-12 h-12 text-gray-500 mx-auto mb-4 sm:px-4 md:px-6 lg:px-8" />
                        <p className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Unable to load analytics data</p>
                        <button 
                            onClick={loadAdvancedAnalytics}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 sm:px-4 md:px-6 lg:px-8"
                         aria-label="Action button">
//                             Retry
                        </button>
                    </div>
                </Widget>
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            {/* Header with Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div>
                    <h2 className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">Advanced Oracle Analytics</h2>
                    <p className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Comprehensive performance tracking and insights</p>
                </div>
                
                <div className="flex space-x-3 sm:px-4 md:px-6 lg:px-8">
                    <button
                        onClick={loadAdvancedAnalytics}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors sm:px-4 md:px-6 lg:px-8"
                     aria-label="Action button">
                        <RefreshCw className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                        <span>Refresh</span>
                    </button>
                    
                    <button
                        onClick={generateReport}
                        disabled={reportGenerating}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 sm:px-4 md:px-6 lg:px-8"
                     aria-label="Action button">
                        <Download className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                        <span>{reportGenerating ? &apos;Generating...&apos; : &apos;Export Report&apos;}</span>
                    </button>
                </div>
            </div>

            {/* Key Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard>
                    title="Oracle Accuracy"
                    value={`${metrics.oracle.overallAccuracy.toFixed(1)}%`}
                    subtitle="Overall performance"
                    trend="stable"
                    icon={<Brain className="w-6 h-6 sm:px-4 md:px-6 lg:px-8" />}
                    color="text-purple-400"
                />
                
                <MetricCard>
                    title="User Average"
                    value={`${metrics.users.averageAccuracy.toFixed(1)}%`}
                    subtitle="Community performance"
                    trend="up"
                    icon={<Users className="w-6 h-6 sm:px-4 md:px-6 lg:px-8" />}
                    color="text-blue-400"
                />
                
                <MetricCard>
                    title="Performance Gap"
                    value={`${(metrics.oracle.overallAccuracy - metrics.users.averageAccuracy).toFixed(1)}%`}
                    subtitle="Oracle advantage"
                    trend="down"
                    icon={<Target className="w-6 h-6 sm:px-4 md:px-6 lg:px-8" />}
                    color="text-green-400"
                />
                
                <MetricCard>
                    title="Oracle Beat Rate"
                    value={`${metrics.users.beatOracleRate.toFixed(1)}%`}
                    subtitle="Users beating Oracle"
                    trend="up"
                    icon={<Trophy className="w-6 h-6 sm:px-4 md:px-6 lg:px-8" />}
                    color="text-yellow-400"
                />
            </div>

            {/* Performance Comparison Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Oracle vs Users Weekly Performance */}
                <Card className="bg-gray-800/50 border-gray-700 sm:px-4 md:px-6 lg:px-8">
                    <CardHeader>
                        <CardTitle className="text-white sm:px-4 md:px-6 lg:px-8">Weekly Performance Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={metrics.comparative.weeklyComparison}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="week" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip>
                                    contentStyle={{ 
}
                                        backgroundColor: &apos;#1F2937&apos;, 
                                        border: &apos;1px solid #374151&apos;,
                                        borderRadius: &apos;0.5rem&apos;
                                    }}
                                />
                                <Legend />
                                <Line>
                                    type="monotone" 
                                    dataKey="oracleAccuracy" 
                                    stroke="#8B5CF6" 
                                    strokeWidth={3}
                                    name="Oracle"
                                    dot={{ fill: &apos;#8B5CF6&apos;, strokeWidth: 2, r: 4 }}
                                />
                                <Line>
                                    type="monotone" 
                                    dataKey="userAccuracy" 
                                    stroke="#3B82F6" 
                                    strokeWidth={3}
                                    name="Users Average"
                                    dot={{ fill: &apos;#3B82F6&apos;, strokeWidth: 2, r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Confidence Calibration Analysis */}
                <Card className="bg-gray-800/50 border-gray-700 sm:px-4 md:px-6 lg:px-8">
                    <CardHeader>
                        <CardTitle className="text-white sm:px-4 md:px-6 lg:px-8">Confidence Calibration</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={metrics.oracle.confidenceCalibration}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="range" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip>
                                    contentStyle={{ 
}
                                        backgroundColor: &apos;#1F2937&apos;, 
                                        border: &apos;1px solid #374151&apos;,
                                        borderRadius: &apos;0.5rem&apos;
                                    }}
                                />
                                <Bar dataKey="predicted" fill="#F59E0B" name="Predicted" />
                                <Bar dataKey="actual" fill="#10B981" name="Actual" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Prediction Type Analysis */}
            <Card className="bg-gray-800/50 border-gray-700 sm:px-4 md:px-6 lg:px-8">
                <CardHeader>
                    <CardTitle className="text-white sm:px-4 md:px-6 lg:px-8">Performance by Prediction Type</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={metrics.comparative.typeComparison}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="type" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip>
                                contentStyle={{ 
}
                                    backgroundColor: &apos;#1F2937&apos;, 
                                    border: &apos;1px solid #374151&apos;,
                                    borderRadius: &apos;0.5rem&apos;
                                }}
                            />
                            <Legend />
                            <Bar dataKey="oracleAccuracy" fill="#8B5CF6" name="Oracle Accuracy" />
                            <Bar dataKey="userAccuracy" fill="#3B82F6" name="User Average" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Advanced Insights Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Gaps */}
                <Card className="bg-gray-800/50 border-gray-700 sm:px-4 md:px-6 lg:px-8">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                            <Target className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
                            <span>Performance Gaps</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                            {metrics.insights.performanceGaps.map((gap, index) => (
}
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                    <div>
                                        <div className="font-medium text-white sm:px-4 md:px-6 lg:px-8">{gap.metric}</div>
                                        <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                            Gap: {gap.gap > 0 ? &apos;+&apos; : &apos;&apos;}{gap.gap.toFixed(1)}%
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                                        {gap.trend === &apos;improving&apos; && <TrendingUp className="w-4 h-4 text-green-400 sm:px-4 md:px-6 lg:px-8" />}
                                        {gap.trend === &apos;declining&apos; && <TrendingDown className="w-4 h-4 text-red-400 sm:px-4 md:px-6 lg:px-8" />}
                                        {gap.trend === &apos;stable&apos; && <div className="w-4 h-1 bg-gray-400 rounded sm:px-4 md:px-6 lg:px-8" />}
                                        <span className="text-xs text-gray-500 capitalize sm:px-4 md:px-6 lg:px-8">{gap.trend}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* User Behavior Analysis */}
                <Card className="bg-gray-800/50 border-gray-700 sm:px-4 md:px-6 lg:px-8">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                            <Eye className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
                            <span>User Behavior Insights</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                            {metrics.insights.userBehaviors.map((behavior, index) => (
}
                                <div key={index} className="p-3 bg-gray-700/30 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                    <div className="flex items-center justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
                                        <div className="font-medium text-white sm:px-4 md:px-6 lg:px-8">{behavior.behavior}</div>
                                        <div className="text-sm text-orange-400 sm:px-4 md:px-6 lg:px-8">{behavior.impact}% impact</div>
                                    </div>
                                    <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">{behavior.recommendation}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Performers and Market Inefficiencies */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Performers */}
                <Card className="bg-gray-800/50 border-gray-700 sm:px-4 md:px-6 lg:px-8">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                            <Award className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
                            <span>Top Performers</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                            {metrics.users.topPerformers.map((performer, index) => (
}
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                    <div className="flex items-center space-x-3 sm:px-4 md:px-6 lg:px-8">
                                        <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full text-white font-bold text-sm sm:px-4 md:px-6 lg:px-8">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <div className="font-medium text-white sm:px-4 md:px-6 lg:px-8">{performer.user}</div>
                                            <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">{performer.oracleBeats} Oracle beats</div>
                                        </div>
                                    </div>
                                    <div className="text-green-400 font-bold sm:px-4 md:px-6 lg:px-8">{performer.accuracy.toFixed(1)}%</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Market Inefficiencies */}
                <Card className="bg-gray-800/50 border-gray-700 sm:px-4 md:px-6 lg:px-8">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                            <Zap className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
                            <span>Market Inefficiencies</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                            {metrics.insights.marketInefficiencies.map((inefficiency, index) => (
}
                                <div key={index} className="p-3 bg-gray-700/30 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                    <div className="flex items-center justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
                                        <div className="font-medium text-white sm:px-4 md:px-6 lg:px-8">{inefficiency.area}</div>
                                        <div className="text-sm text-yellow-400 sm:px-4 md:px-6 lg:px-8">{inefficiency.opportunity}% opportunity</div>
                                    </div>
                                    <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">{inefficiency.description}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const AdvancedOracleAnalyticsDashboardWithErrorBoundary: React.FC<any> = (props: any) => (
  <ErrorBoundary>
    <AdvancedOracleAnalyticsDashboard {...props} />
  </ErrorBoundary>
);

export default React.memo(AdvancedOracleAnalyticsDashboardWithErrorBoundary);
