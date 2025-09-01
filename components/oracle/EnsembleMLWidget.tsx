/**
 * Compact Ensemble ML Widget for Oracle Dashboard
 * Displays key ensemble prediction metrics in a compact format
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Widget } from '../ui/Widget';
import oracleEnsembleMachineLearningService, { 
    EnsemblePredictionDetail,
//     FeatureVector 
} from '../../services/oracleEnsembleMachineLearningService';

interface Props {
    playerId?: string;
    compact?: boolean;
}

const EnsembleMLWidget: React.FC<Props> = ({ playerId, compact = true }: any) => {
    const [prediction, setPrediction] = useState<EnsemblePredictionDetail | null>(null);
    const [loading, setLoading] = useState(false);

    // Sample features for demonstration
    const sampleFeatures: FeatureVector = {
        playerRecentPerformance: [18.5, 16.2, 20.1, 14.8, 19.3],
        playerPositionRank: 8,
        playerInjuryRisk: 0.15,
        playerMatchupDifficulty: 0.7,
        playerTargetShare: 0.28,
        teamOffensiveRank: 5,
        teamDefensiveRank: 12,
        teamHomeAdvantage: 0.6,
        teamRecentForm: [1, 1, 0, 1],
        weatherConditions: [72, 0, 8],
        gameImportance: 0.8,
        restDays: 6,
        travelDistance: 1200,
        headToHeadRecord: [0.6],
        seasonalTrends: [0.15],
        venuePerformance: [0.1],
        timeOfSeason: 0.65,
        weekType: 'REGULAR',
        marketConfidence: 0.85
    };

    useEffect(() => {
        if (playerId) {
            generateQuickPrediction();
    }
  }, [playerId]);

    const generateQuickPrediction = async () => {
        setLoading(true);
        try {

            const result = await oracleEnsembleMachineLearningService
                .generateEnsemblePrediction(sampleFeatures, 'fantasy_points');
            setPrediction(result);
        
    } catch (error) {
        } finally {
            setLoading(false);

    };

    if (compact) {
        return (
            <Widget title="🧠 AI Ensemble Prediction" className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 sm:px-4 md:px-6 lg:px-8">
                <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                    {loading && (
                        <div className="flex items-center justify-center py-6 sm:px-4 md:px-6 lg:px-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 sm:px-4 md:px-6 lg:px-8"></div>
                            <span className="ml-2 text-gray-400 text-sm sm:px-4 md:px-6 lg:px-8">Computing...</span>
                        </div>
                    )}
                    
                    {!loading && prediction && (
                        <>
                            {/* Main Prediction */}
                            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
                                <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                                    <div>
                                        <div className="text-sm text-gray-400 mb-1 sm:px-4 md:px-6 lg:px-8">Ensemble Prediction</div>
                                        <div className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">
                                            {prediction.prediction.toFixed(1)} pts
                                        </div>
                                    </div>
                                    <div className="text-right sm:px-4 md:px-6 lg:px-8">
                                        <div className="text-sm text-gray-400 mb-1 sm:px-4 md:px-6 lg:px-8">Confidence</div>
                                        <div className="text-xl font-bold text-green-400 sm:px-4 md:px-6 lg:px-8">
                                            {(prediction.confidence * 100).toFixed(1)}%
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Model Consensus */}
                            <div className="grid grid-cols-2 gap-3 sm:px-4 md:px-6 lg:px-8">
                                <div className="bg-gray-800/50 rounded-lg p-3 sm:px-4 md:px-6 lg:px-8">
                                    <div className="text-xs text-gray-400 mb-1 sm:px-4 md:px-6 lg:px-8">Model Agreement</div>
                                    <div className="text-lg font-semibold text-blue-400 sm:px-4 md:px-6 lg:px-8">
                                        {(prediction.consensusMetrics.agreementScore * 100).toFixed(0)}%
                                    </div>
                                    <div className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">
                                        {prediction.modelPredictions.length} models
                                    </div>
                                </div>
                                <div className="bg-gray-800/50 rounded-lg p-3 sm:px-4 md:px-6 lg:px-8">
                                    <div className="text-xs text-gray-400 mb-1 sm:px-4 md:px-6 lg:px-8">Uncertainty</div>
                                    <div className="text-lg font-semibold text-yellow-400 sm:px-4 md:px-6 lg:px-8">
                                        {(prediction.uncertaintyMetrics.total * 100).toFixed(0)}%
                                    </div>
                                    <div className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">
                                        ±{prediction.consensusMetrics.standardDeviation.toFixed(1)}
                                    </div>
                                </div>
                            </div>

                            {/* Top Features */}
                            <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                                <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Key Factors</div>
                                <div className="flex flex-wrap gap-2 sm:px-4 md:px-6 lg:px-8">
                                    {prediction.featureContributions.slice(0, 3).map((feature: any) => (
                                        <div
                                            key={feature.feature}
                                            className="flex items-center space-x-1 bg-gray-800/30 rounded px-2 py-1 sm:px-4 md:px-6 lg:px-8"
                                        >
                                            <span className={`w-2 h-2 rounded-full ${
                                                feature.direction === 'POSITIVE' ? 'bg-green-400' : 'bg-red-400'
                                            }`}></span>
                                            <span className="text-xs text-gray-300 capitalize sm:px-4 md:px-6 lg:px-8">
                                                {feature.feature.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}
                                            </span>
                                            <span className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                                ({(feature.importance * 100).toFixed(0)}%)
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Action */}
                            <button
                                onClick={generateQuickPrediction}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8"
                             aria-label="Action button">
                                🔄 Regenerate Prediction
                            </button>
                        </>
                    )}
                    
                    {!loading && !prediction && (
                        <div className="text-center py-6 sm:px-4 md:px-6 lg:px-8">
                            <div className="text-gray-400 mb-2 sm:px-4 md:px-6 lg:px-8">🧠 AI Ensemble Ready</div>
                            <button
                                onClick={generateQuickPrediction}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8"
                             aria-label="Action button">
                                Generate Prediction
                            </button>
                        </div>
                    )}
                </div>
            </Widget>
        );

    // Full widget view (non-compact)
    
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 sm:px-4 md:px-6 lg:px-8"></div>
        <span className="ml-2 sm:px-4 md:px-6 lg:px-8">Loading...</span>
      </div>
    );

  return (
        <Widget title="🧠 Advanced Ensemble Machine Learning" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
            <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
                {prediction && (
                    <>
                        {/* Main Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
                                <div className="text-blue-600 dark:text-blue-400 text-sm font-medium sm:px-4 md:px-6 lg:px-8">
                                    Ensemble Prediction
                                </div>
                                <div className="text-2xl font-bold text-blue-800 dark:text-blue-300 sm:px-4 md:px-6 lg:px-8">
                                    {prediction.prediction.toFixed(1)} pts
                                </div>
                                <div className="text-sm text-blue-600 dark:text-blue-400 sm:px-4 md:px-6 lg:px-8">
                                    Confidence: {(prediction.confidence * 100).toFixed(1)}%
                                </div>
                            </div>

                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
                                <div className="text-green-600 dark:text-green-400 text-sm font-medium sm:px-4 md:px-6 lg:px-8">
                                    Model Consensus
                                </div>
                                <div className="text-2xl font-bold text-green-800 dark:text-green-300 sm:px-4 md:px-6 lg:px-8">
                                    {(prediction.consensusMetrics.agreementScore * 100).toFixed(0)}%
                                </div>
                                <div className="text-sm text-green-600 dark:text-green-400 sm:px-4 md:px-6 lg:px-8">
                                    {prediction.modelPredictions.length} models agree
                                </div>
                            </div>

                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
                                <div className="text-purple-600 dark:text-purple-400 text-sm font-medium sm:px-4 md:px-6 lg:px-8">
                                    Prediction Range
                                </div>
                                <div className="text-2xl font-bold text-purple-800 dark:text-purple-300 sm:px-4 md:px-6 lg:px-8">
                                    ±{prediction.consensusMetrics.standardDeviation.toFixed(1)}
                                </div>
                                <div className="text-sm text-purple-600 dark:text-purple-400 sm:px-4 md:px-6 lg:px-8">
                                    95% CI: [{prediction.consensusMetrics.confidenceInterval[0].toFixed(1)}, {prediction.consensusMetrics.confidenceInterval[1].toFixed(1)}]
                                </div>
                            </div>
                        </div>

                        {/* Model Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {prediction.modelPredictions.map((model: any) => (
                                <motion.div
                                    key={model.modelId}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-gray-800/30 rounded-lg p-3 sm:px-4 md:px-6 lg:px-8"
                                >
                                    <div className="flex justify-between items-center mb-2 sm:px-4 md:px-6 lg:px-8">
                                        <span className="text-sm font-medium text-gray-300 sm:px-4 md:px-6 lg:px-8">
                                            {model.modelName}
                                        </span>
                                        <span className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">
                                            {(model.weight * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                    <div className="text-lg font-bold text-white mb-1 sm:px-4 md:px-6 lg:px-8">
                                        {model.prediction.toFixed(1)}
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-1.5 sm:px-4 md:px-6 lg:px-8">
                                        <div 
                                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300 sm:px-4 md:px-6 lg:px-8"
                                            style={{ width: `${model.confidence * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1 sm:px-4 md:px-6 lg:px-8">
                                        {(model.confidence * 100).toFixed(0)}% confident
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}

                <div className="flex space-x-3 sm:px-4 md:px-6 lg:px-8">
                    <button
                        onClick={generateQuickPrediction}
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors sm:px-4 md:px-6 lg:px-8"
                     aria-label="Action button">
                        {loading ? 'Generating...' : '🔄 Generate New Prediction'}
                    </button>
                </div>
            </div>
        </Widget>
    );
};

const EnsembleMLWidgetWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <EnsembleMLWidget {...props} />
  </ErrorBoundary>
);

export default React.memo(EnsembleMLWidgetWithErrorBoundary);
