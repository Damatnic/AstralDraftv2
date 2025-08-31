import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { Widget } from '../ui/Widget';
import { ZapIcon } from '../icons/ZapIcon';
import { useAppState } from '../../contexts/AppContext';
import { oracleAnalyticsService, type OracleAnalytics, type OraclePerformanceMetrics, type UserInsight } from '../../services/oracleAnalyticsService';
import AdvancedEnsembleMLDashboard from './AdvancedEnsembleMLDashboard';

interface PerformanceChartProps {
    data: Array<{ week: number; accuracy: number; userWins: number; totalPredictions: number }>;

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data  }) => {
  const [isLoading, setIsLoading] = React.useState(false);
    const maxAccuracy = Math.max(...data.map((d: any) => d.accuracy), 1);
    const maxUserWins = Math.max(...data.map((d: any) => d.userWins), 1);

    return (
        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                <span className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Weekly Performance Trends</span>
                <div className="flex items-center space-x-4 text-xs sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-center space-x-1 sm:px-4 md:px-6 lg:px-8">
                        <div className="w-3 h-3 bg-blue-500 rounded sm:px-4 md:px-6 lg:px-8"></div>
                        <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Oracle Accuracy</span>
                    </div>
                    <div className="flex items-center space-x-1 sm:px-4 md:px-6 lg:px-8">
                        <div className="w-3 h-3 bg-green-500 rounded sm:px-4 md:px-6 lg:px-8"></div>
                        <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Your Wins</span>
                    </div>
                </div>
            </div>
            
            <div className="relative h-32 bg-gray-800/30 rounded-lg p-3 sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-end justify-between h-full space-x-2 sm:px-4 md:px-6 lg:px-8">
                    {data.map((item, index) => (
                        <div key={item.week} className="flex-1 flex flex-col items-center sm:px-4 md:px-6 lg:px-8">
                            <div className="flex flex-col space-y-1 w-full sm:px-4 md:px-6 lg:px-8">
                                {/* Oracle accuracy bar */}
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(item.accuracy / maxAccuracy) * 60}px` }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-blue-500 rounded-sm sm:px-4 md:px-6 lg:px-8"
                                    title={`Oracle: ${(item.accuracy * 100).toFixed(1)}% accurate`}
                                />
                                {/* User wins bar */}
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(item.userWins / maxUserWins) * 40}px` }}
                                    transition={{ delay: index * 0.1 + 0.2 }}
                                    className="bg-green-500 rounded-sm sm:px-4 md:px-6 lg:px-8"
                                    title={`You: ${item.userWins} wins`}
                                />
                            </div>
                            <span className="text-xs text-gray-500 mt-1 sm:px-4 md:px-6 lg:px-8">W{item.week}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

interface ConfidenceAnalysisProps {
    confidenceByType: Record<string, number>;
    typeAccuracy: Record<string, number>;

}

const ConfidenceAnalysis: React.FC<ConfidenceAnalysisProps> = ({ confidenceByType, typeAccuracy }) => {
    const predictionTypes = Object.keys(confidenceByType);

    return (
        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
            <span className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Prediction Type Analysis</span>
            <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                {predictionTypes.map((type: any) => {
                    const confidence = confidenceByType[type] || 0;
                    const accuracy = typeAccuracy[type] || 0;
                    const isWellCalibrated = Math.abs(confidence - accuracy * 100) < 10;
                    
                    return (
                        <div key={type} className="bg-gray-800/30 rounded-lg p-3 sm:px-4 md:px-6 lg:px-8">
                            <div className="flex items-center justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
                                <span className="text-sm font-medium text-white capitalize sm:px-4 md:px-6 lg:px-8">
                                    {type.toLowerCase().replace('_', ' ')}
                                </span>
                                <div className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                                    <span className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                        {confidence.toFixed(1)}% conf
                                    </span>
                                    <span className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                        {(accuracy * 100).toFixed(1)}% acc
                                    </span>
                                    {isWellCalibrated && (
                                        <span className="text-xs text-green-400 sm:px-4 md:px-6 lg:px-8">✓ Calibrated</span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex space-x-2 sm:px-4 md:px-6 lg:px-8">
                                {/* Confidence bar */}
                                <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                                    <div className="w-full bg-gray-700 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${confidence}%` }}
                                            className="bg-blue-500 h-2 rounded-full sm:px-4 md:px-6 lg:px-8"
                                        />
                                    </div>
                                </div>
                                {/* Accuracy bar */}
                                <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                                    <div className="w-full bg-gray-700 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${accuracy * 100}%` }}
                                            className="bg-green-500 h-2 rounded-full sm:px-4 md:px-6 lg:px-8"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

interface InsightCardProps {
    insight: UserInsight;

}

const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
    const getInsightIcon = (type: UserInsight['type']) => {
        switch (type) {
            case 'SUCCESS_PATTERN':
                return '🎯';
            case 'IMPROVEMENT_AREA':
                return '📈';
            case 'STREAK_POTENTIAL':
                return '🔥';
            case 'RECOMMENDATION':
                return '💡';
            default:
                return '📊';

    };

    const getInsightColor = (type: UserInsight['type']) => {
        switch (type) {
            case 'SUCCESS_PATTERN':
                return 'border-green-500/40 bg-green-500/10';
            case 'IMPROVEMENT_AREA':
                return 'border-yellow-500/40 bg-yellow-500/10';
            case 'STREAK_POTENTIAL':
                return 'border-red-500/40 bg-red-500/10';
            case 'RECOMMENDATION':
                return 'border-blue-500/40 bg-blue-500/10';
            default:
                return 'border-gray-500/40 bg-gray-500/10';

    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border rounded-lg p-3 ${getInsightColor(insight.type)}`}
        >
            <div className="flex items-start space-x-3 sm:px-4 md:px-6 lg:px-8">
                <span className="text-lg sm:px-4 md:px-6 lg:px-8">{getInsightIcon(insight.type)}</span>
                <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                    <h4 className="font-medium text-white text-sm sm:px-4 md:px-6 lg:px-8">{insight.title}</h4>
                    <p className="text-xs text-gray-300 mt-1 sm:px-4 md:px-6 lg:px-8">{insight.description}</p>
                </div>
            </div>
        </motion.div>
    );
};

interface MetricCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: 'up' | 'down' | 'neutral';
    color?: string;

}

const MetricCard: React.FC<MetricCardProps> = ({ 
    title, 
    value, 
    subtitle, 
    trend = 'neutral',
    color = 'text-blue-400'
}) => {
    const getTrendIcon = () => {
        switch (trend) {
            case 'up':
                return '↗️';
            case 'down':
                return '↘️';
            default:
                return '';

    };

    return (
        <div className="bg-gray-800/30 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-1 sm:px-4 md:px-6 lg:px-8">
                <span className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">{title}</span>
                {trend !== 'neutral' && (
                    <span className="text-xs sm:px-4 md:px-6 lg:px-8">{getTrendIcon()}</span>
                )}
            </div>
            <div className={`text-2xl font-bold ${color}`}>
                {typeof value === 'number' && value < 1 && value > 0 
                    ? `${(value * 100).toFixed(1)}%`
                    : value

            </div>
            {subtitle && (
                <div className="text-xs text-gray-500 mt-1 sm:px-4 md:px-6 lg:px-8">{subtitle}</div>
            )}
        </div>
    );
};

export const OracleAnalyticsDashboard: React.FC = () => {
    const { dispatch } = useAppState();
    const [analytics, setAnalytics] = React.useState<OracleAnalytics | null>(null);
    const [performanceMetrics, setPerformanceMetrics] = React.useState<OraclePerformanceMetrics | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [isTrainingModels, setIsTrainingModels] = React.useState(false);

    React.useEffect(() => {
        const loadAnalytics = async () => {
            try {

                setLoading(true);
                setError(null);
                
                const [analyticsData, metricsData] = await Promise.all([
                    oracleAnalyticsService.getAnalytics(),
                    oracleAnalyticsService.getOraclePerformanceMetrics()
                ]);
                
                setAnalytics(analyticsData);
                setPerformanceMetrics(metricsData);
            
    } catch (error) {
        console.error(error);
    `${analytics.totalUserChallenges} challenges`}
                    color="text-green-400"
                />
                <MetricCard
                    title="Prediction Quality"
                    value={performanceMetrics.calibrationScore}
                    subtitle="Confidence calibration"
                    color="text-purple-400"
                />
                <MetricCard
                    title="Confidence Correlation"
                    value={performanceMetrics.confidenceCorrelation}
                    subtitle="Accuracy vs confidence"
                    color="text-yellow-400"
                />
            </div>

            {/* Advanced Machine Learning Dashboard */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <AdvancedEnsembleMLDashboard />
            </motion.div>

            {/* Performance Trends */}
            <Widget title="Performance Trends" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                {analytics.accuracyTrends.length > 0 ? (
                    <PerformanceChart data={analytics.accuracyTrends} />
                ) : (
                    <div className="text-center py-8 text-gray-400 sm:px-4 md:px-6 lg:px-8">
                        <p>Complete challenges across multiple weeks to see trends</p>
                    </div>
                )}
            </Widget>

            {/* Prediction Type Analysis */}
            <Widget title="Prediction Analysis by Type" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                {Object.keys(analytics.confidenceByType).length > 0 ? (
                    <ConfidenceAnalysis 
                        confidenceByType={analytics.confidenceByType}
                        typeAccuracy={performanceMetrics.typeAccuracy}
                    />
                ) : (
                    <div className="text-center py-8 text-gray-400 sm:px-4 md:px-6 lg:px-8">
                        <p>Complete more challenges to see detailed type analysis</p>
                    </div>
                )}
            </Widget>

            {/* Top Prediction Types */}
            <Widget title="Your Strongest Categories" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                    {analytics.topPredictionTypes.length > 0 ? (
                        (() => {
                            const sortedTypes = [...analytics.topPredictionTypes].sort((a, b) => b.userSuccessRate - a.userSuccessRate);
                            return sortedTypes.slice(0, 3).map((type, index) => (
                                <motion.div
                                    key={type.type}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center justify-between bg-gray-800/30 rounded-lg p-3 sm:px-4 md:px-6 lg:px-8"
                                >
                                    <div className="flex items-center space-x-3 sm:px-4 md:px-6 lg:px-8">
                                        <span className="text-lg font-bold text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                            #{index + 1}
                                        </span>
                                        <div>
                                            <span className="text-white font-medium capitalize sm:px-4 md:px-6 lg:px-8">
                                                {type.type.toLowerCase().replace('_', ' ')}
                                            </span>
                                            <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                                {type.totalPredictions} predictions
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right sm:px-4 md:px-6 lg:px-8">
                                        <div className="text-green-400 font-bold sm:px-4 md:px-6 lg:px-8">
                                            {(type.userSuccessRate * 100).toFixed(1)}%
                                        </div>
                                        <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                            vs Oracle: {(type.accuracy * 100).toFixed(1)}%
                                        </div>
                                    </div>
                                </motion.div>
                            ));
                        })()
                    ) : (
                        <div className="text-center py-8 text-gray-400 sm:px-4 md:px-6 lg:px-8">
                            <p>Complete more challenges to see your strongest categories</p>
                        </div>
                    )}
                </div>
            </Widget>

            {/* Personalized Insights */}
            <Widget title="Personalized Insights" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                    {analytics.userInsights.length > 0 ? (
                        analytics.userInsights.map((insight: any) => (
                            <InsightCard key={`${insight.type}-${insight.title}`} insight={insight} />
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-400 sm:px-4 md:px-6 lg:px-8">
                            <p>Complete more challenges to unlock personalized insights</p>
                        </div>
                    )}
                </div>
            </Widget>

            {/* Summary Stats */}
            <Widget title="Session Summary" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center sm:px-4 md:px-6 lg:px-8">
                        <div className="text-2xl font-bold text-blue-400 sm:px-4 md:px-6 lg:px-8">
                            {analytics.totalPredictions}
                        </div>
                        <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Oracle Predictions</div>
                    </div>
                    <div className="text-center sm:px-4 md:px-6 lg:px-8">
                        <div className="text-2xl font-bold text-green-400 sm:px-4 md:px-6 lg:px-8">
                            {analytics.totalUserChallenges}
                        </div>
                        <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Your Challenges</div>
                    </div>
                    <div className="text-center sm:px-4 md:px-6 lg:px-8">
                        <div className="text-2xl font-bold text-purple-400 sm:px-4 md:px-6 lg:px-8">
                            {Object.keys(analytics.confidenceByType).length}
                        </div>
                        <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Prediction Types</div>
                    </div>
                    <div className="text-center sm:px-4 md:px-6 lg:px-8">
                        <div className="text-2xl font-bold text-yellow-400 sm:px-4 md:px-6 lg:px-8">
                            {analytics.userInsights.length}
                        </div>
                        <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Active Insights</div>
                    </div>
                </div>
            </Widget>
        </div>
    );
};

const OracleAnalyticsDashboardWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <OracleAnalyticsDashboard {...props} />
  </ErrorBoundary>
);

export default React.memo(OracleAnalyticsDashboardWithErrorBoundary);
