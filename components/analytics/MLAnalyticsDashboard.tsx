import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useMemo, useState, useEffect } from 'react';
import oracleMachineLearningService, { 
    ModelPerformance, 
    FeatureImportance, 
    PredictionOptimization, 
    Pattern, 
    MLInsight 
} from '../../services/oracleMachineLearningService';

interface MLAnalyticsDashboardProps {
    isActive: boolean;

}

const MLAnalyticsDashboard: React.FC<MLAnalyticsDashboardProps> = ({ isActive }) => {
    const [activeTab, setActiveTab] = useState<'performance' | 'features' | 'patterns' | 'insights'>('performance');
    const [modelPerformance, setModelPerformance] = useState<ModelPerformance[]>([]);
    const [featureImportance, setFeatureImportance] = useState<FeatureImportance[]>([]);
    const [optimizations, setOptimizations] = useState<PredictionOptimization[]>([]);
    const [patterns, setPatterns] = useState<Pattern[]>([]);
    const [insights, setInsights] = useState<MLInsight[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isActive) {
            loadMLAnalytics();
        }
  }, [isActive]);

    const loadMLAnalytics = async () => {
        setLoading(true);
        try {

            const [performance, features, opts, detectedPatterns, mlInsights] = await Promise.all([
                oracleMachineLearningService.analyzeModelPerformance(),
                oracleMachineLearningService.calculateFeatureImportance(),
                oracleMachineLearningService.optimizePredictionAlgorithms(),
                oracleMachineLearningService.detectPredictionPatterns(),
                oracleMachineLearningService.generateMLInsights()
            ]);

            setModelPerformance(performance);
            setFeatureImportance(features);
            setOptimizations(opts);
            setPatterns(detectedPatterns);
            setInsights(mlInsights);
        
        } catch (error) {
            console.error('Error loading ML analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
            case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'LOW': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPerformanceColor = (value: number) => {
        if (value >= 0.8) return 'text-green-600';
        if (value >= 0.7) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getTrendColor = (trend: string) => {
        switch (trend) {
            case 'INCREASING': return 'text-green-600';
            case 'DECREASING': return 'text-red-600';
            default: return 'text-gray-500';
        }
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'INCREASING': return '↗';
            case 'DECREASING': return '↘';
            default: return '→';
        }
    };

    const renderPerformanceTab = () => (
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modelPerformance.map((model: any) => (
                    <div key={model.type} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-4 sm:px-4 md:px-6 lg:px-8">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white sm:px-4 md:px-6 lg:px-8">
                                {model.type.replace('_', ' ')}
                            </h3>
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full sm:px-4 md:px-6 lg:px-8">
                                {model.sampleSize} samples
                            </span>
                        </div>

                        <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                            <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                                <span className="text-sm text-gray-600 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">Accuracy</span>
                                <span className={`font-medium ${getPerformanceColor(model.accuracy)}`}>
                                    {(model.accuracy * 100).toFixed(1)}%
                                </span>
                            </div>
                            
                            <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                                <span className="text-sm text-gray-600 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">Precision</span>
                                <span className={`font-medium ${getPerformanceColor(model.precision)}`}>
                                    {(model.precision * 100).toFixed(1)}%
                                </span>
                            </div>
                            
                            <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                                <span className="text-sm text-gray-600 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">Recall</span>
                                <span className={`font-medium ${getPerformanceColor(model.recall)}`}>
                                    {(model.recall * 100).toFixed(1)}%
                                </span>
                            </div>
                            
                            <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                                <span className="text-sm text-gray-600 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">F1 Score</span>
                                <span className={`font-medium ${getPerformanceColor(model.f1Score)}`}>
                                    {(model.f1Score * 100).toFixed(1)}%
                                </span>
                            </div>
                            
                            <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                                <span className="text-sm text-gray-600 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">Calibration</span>
                                <span className={`font-medium ${getPerformanceColor(model.calibrationScore)}`}>
                                    {(model.calibrationScore * 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 sm:px-4 md:px-6 lg:px-8">
                            <p className="text-xs text-gray-500 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                Last updated: {new Date(model.lastUpdated).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Optimization Recommendations */}
            {optimizations.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sm:px-4 md:px-6 lg:px-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:px-4 md:px-6 lg:px-8">
                        Optimization Recommendations
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {optimizations.map((opt: any) => (
                            <div key={opt.type} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
                                <div className="flex justify-between items-center mb-3 sm:px-4 md:px-6 lg:px-8">
                                    <h4 className="font-medium text-gray-900 dark:text-white sm:px-4 md:px-6 lg:px-8">
                                        {opt.type.replace('_', ' ')}
                                    </h4>
                                    <span className="text-sm text-gray-600 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                        Current: {(opt.currentAccuracy * 100).toFixed(1)}%
                                    </span>
                                </div>
                                
                                <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                                    <div className="text-sm sm:px-4 md:px-6 lg:px-8">
                                        <span className="text-gray-600 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">Optimal Confidence Threshold:</span>
                                        <span className="ml-2 font-medium text-blue-600 dark:text-blue-400 sm:px-4 md:px-6 lg:px-8">
                                            {opt.optimizedConfidenceThreshold}%
                                        </span>
                                    </div>
                                    
                                    <div className="text-sm sm:px-4 md:px-6 lg:px-8">
                                        <span className="text-gray-600 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">Improvement Potential:</span>
                                        <span className="ml-2 font-medium text-green-600 dark:text-green-400 sm:px-4 md:px-6 lg:px-8">
                                            +{(opt.improvementPotential * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                                
                                {opt.identifiedPatterns.length > 0 && (
                                    <div className="mt-3 sm:px-4 md:px-6 lg:px-8">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 sm:px-4 md:px-6 lg:px-8">Key Patterns:</p>
                                        <div className="space-y-1 sm:px-4 md:px-6 lg:px-8">
                                            {opt.identifiedPatterns.slice(0, 2).map((pattern: any) => (
                                                <div key={pattern.name} className="text-xs bg-gray-50 dark:bg-gray-700 rounded p-2 sm:px-4 md:px-6 lg:px-8">
                                                    <span className="font-medium sm:px-4 md:px-6 lg:px-8">{pattern.name}</span>
                                                    <span className="text-gray-600 dark:text-gray-400 ml-2 sm:px-4 md:px-6 lg:px-8">
                                                        ({(pattern.confidence * 100).toFixed(0)}% confidence)
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const renderFeaturesTab = () => (
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sm:px-4 md:px-6 lg:px-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:px-4 md:px-6 lg:px-8">
                    Feature Importance Analysis
                </h3>
                
                <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                    {featureImportance.slice(0, 15).map((feature, index) => (
                        <div key={feature.feature} className="flex items-center justify-between py-2 sm:px-4 md:px-6 lg:px-8">
                            <div className="flex items-center space-x-3 sm:px-4 md:px-6 lg:px-8">
                                <span className="text-sm font-medium text-gray-900 dark:text-white w-4 sm:px-4 md:px-6 lg:px-8">
                                    #{index + 1}
                                </span>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white sm:px-4 md:px-6 lg:px-8">
                                        {feature.feature.replace(/([A-Z])/g, ' $1').trim()}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                        {feature.category}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3 sm:px-4 md:px-6 lg:px-8">
                                <div className="text-right sm:px-4 md:px-6 lg:px-8">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white sm:px-4 md:px-6 lg:px-8">
                                        {(feature.importance * 100).toFixed(1)}%
                                    </p>
                                    <div className="flex items-center space-x-1 sm:px-4 md:px-6 lg:px-8">
                                        <span className={`text-xs ${getTrendColor(feature.trend)}`}>
                                            {getTrendIcon(feature.trend)}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                            {feature.trend.toLowerCase()}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                                    <div 
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300 sm:px-4 md:px-6 lg:px-8"
                                        style={{ width: `${feature.importance * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Feature Categories Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {['PLAYER', 'TEAM', 'GAME', 'HISTORICAL', 'META'].map((category: any) => {
                    const categoryFeatures = featureImportance.filter((f: any) => f.category === category);
                    const avgImportance = categoryFeatures.length > 0 
                        ? categoryFeatures.reduce((sum, f) => sum + f.importance, 0) / categoryFeatures.length 
                        : 0;
                    
                    return (
                        <div key={category} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:px-4 md:px-6 lg:px-8">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2 sm:px-4 md:px-6 lg:px-8">
                                {category}
                            </h4>
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1 sm:px-4 md:px-6 lg:px-8">
                                {(avgImportance * 100).toFixed(1)}%
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                {categoryFeatures.length} features
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderPatternsTab = () => (
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sm:px-4 md:px-6 lg:px-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:px-4 md:px-6 lg:px-8">
                    Detected Prediction Patterns
                </h3>
                
                {patterns.length === 0 ? (
                    <div className="text-center py-8 sm:px-4 md:px-6 lg:px-8">
                        <div className="text-gray-400 dark:text-gray-500 mb-2 sm:px-4 md:px-6 lg:px-8">📊</div>
                        <p className="text-gray-600 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">
                            No significant patterns detected yet. More data needed for pattern analysis.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                        {patterns.map((pattern: any) => (
                            <div key={pattern.name} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
                                <div className="flex items-start justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
                                    <h4 className="font-medium text-gray-900 dark:text-white sm:px-4 md:px-6 lg:px-8">
                                        {pattern.name}
                                    </h4>
                                    <div className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full sm:px-4 md:px-6 lg:px-8">
                                            {(pattern.confidence * 100).toFixed(0)}% confidence
                                        </span>
                                        {pattern.actionable && (
                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full sm:px-4 md:px-6 lg:px-8">
                                                Actionable
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 sm:px-4 md:px-6 lg:px-8">
                                    {pattern.description}
                                </p>
                                
                                <div className="bg-gray-50 dark:bg-gray-700 rounded p-3 sm:px-4 md:px-6 lg:px-8">
                                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 sm:px-4 md:px-6 lg:px-8">
                                        Recommendation:
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                        {pattern.recommendation}
                                    </p>
                                </div>
                                
                                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                    Supporting data points: {pattern.supportingData}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    const renderInsightsTab = () => (
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sm:px-4 md:px-6 lg:px-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:px-4 md:px-6 lg:px-8">
                    Machine Learning Insights
                </h3>
                
                {insights.length === 0 ? (
                    <div className="text-center py-8 sm:px-4 md:px-6 lg:px-8">
                        <div className="text-gray-400 dark:text-gray-500 mb-2 sm:px-4 md:px-6 lg:px-8">🤖</div>
                        <p className="text-gray-600 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">
                            No ML insights available yet. System needs more prediction data to generate insights.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                        {insights.map((insight: any) => (
                            <div 
                                key={`${insight.type}-${insight.title}`}
                                className={`border rounded-lg p-4 ${getSeverityColor(insight.severity)}`}
                            >
                                <div className="flex items-start justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
                                    <h4 className="font-medium sm:px-4 md:px-6 lg:px-8">
                                        {insight.title}
                                    </h4>
                                    <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-50 sm:px-4 md:px-6 lg:px-8">
                                        {insight.severity}
                                    </span>
                                </div>
                                
                                <p className="text-sm mb-3 opacity-90 sm:px-4 md:px-6 lg:px-8">
                                    {insight.description}
                                </p>
                                
                                <div className="bg-white bg-opacity-50 rounded p-3 sm:px-4 md:px-6 lg:px-8">
                                    <p className="text-xs font-medium mb-1 sm:px-4 md:px-6 lg:px-8">
                                        Recommendation:
                                    </p>
                                    <p className="text-sm sm:px-4 md:px-6 lg:px-8">
                                        {insight.recommendation}
                                    </p>
                                </div>
                                
                                <div className="mt-2 text-xs opacity-75 sm:px-4 md:px-6 lg:px-8">
                                    Type: {insight.type.replace('_', ' ').toLowerCase()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12 sm:px-4 md:px-6 lg:px-8">
                <div className="text-center sm:px-4 md:px-6 lg:px-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4 sm:px-4 md:px-6 lg:px-8"></div>
                    <p className="text-gray-600 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">Loading ML Analytics...</p>
                </div>
            </div>
        );
    }

    if (loading) {
    return (
      <div className="flex justify-center items-center p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 sm:px-4 md:px-6 lg:px-8"></div>
        <span className="ml-2 sm:px-4 md:px-6 lg:px-8">Loading...</span>
      </div>
    );
    }

    return (
        <div className="max-w-7xl mx-auto sm:px-4 md:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8 sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center space-x-3 mb-4 sm:px-4 md:px-6 lg:px-8">
                    <div className="text-2xl sm:px-4 md:px-6 lg:px-8">🤖</div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:px-4 md:px-6 lg:px-8">
                            Machine Learning Analytics
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">
                            Continuous improvement through predictive model optimization
                        </p>
                    </div>
                </div>
                
                <button
                    onClick={loadMLAnalytics}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors sm:px-4 md:px-6 lg:px-8"
                 aria-label="Action button">
                    Refresh Analytics
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-8 sm:px-4 md:px-6 lg:px-8">
                <nav className="flex space-x-8 sm:px-4 md:px-6 lg:px-8">
                    {[
                        { id: 'performance', label: 'Model Performance', icon: '📊' },
                        { id: 'features', label: 'Feature Importance', icon: '🎯' },
                        { id: 'patterns', label: 'Patterns', icon: '🔍' },
                        { id: 'insights', label: 'ML Insights', icon: '💡' }
                    ].map((tab: any) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'performance' && renderPerformanceTab()}
            {activeTab === 'features' && renderFeaturesTab()}
            {activeTab === 'patterns' && renderPatternsTab()}
            {activeTab === 'insights' && renderInsightsTab()}
        </div>
    );
};

const MLAnalyticsDashboardWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <MLAnalyticsDashboard {...props} />
  </ErrorBoundary>
);

export default React.memo(MLAnalyticsDashboardWithErrorBoundary);
