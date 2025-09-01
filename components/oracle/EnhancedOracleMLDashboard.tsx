/**
 * Enhanced Oracle ML Dashboard
 * Advanced machine learning interface for Oracle prediction accuracy enhancement
 * Features real-time model performance, dynamic weighting, and prediction calibration
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Area, AreaChart, PieChart, Pie, Cell
} from 'recharts';
import oracleAccuracyEnhancementService from '../../services/oracleAccuracyEnhancementService';

interface MLPerformanceData {
    modelName: string;
    recentAccuracy: number;
    longTermAccuracy: number;
    weight: number;
    predictions: number;
    trend: 'improving' | 'stable' | 'declining';

}

interface CalibrationMetrics {
    overconfidenceRate: number;
    underconfidenceRate: number;
    averageCalibrationError: number;
    reliabilityScore: number;

interface EnhancedMLDashboardProps {
    isVisible?: boolean;
    onPredictionTest?: (result: any) => void;

}

const EnhancedOracleMLDashboard: React.FC<EnhancedMLDashboardProps> = ({
    isVisible = true,
    onPredictionTest
}) => {
    const [activeTab, setActiveTab] = useState<'performance' | 'calibration' | 'predictions' | 'insights'>('performance');
    const [modelPerformance, setModelPerformance] = useState<MLPerformanceData[]>([]);
    const [calibrationMetrics, setCalibrationMetrics] = useState<CalibrationMetrics | null>(null);
    const [recentPredictions, setRecentPredictions] = useState<any[]>([]);
    const [isGeneratingPrediction, setIsGeneratingPrediction] = useState(false);
    const [testPredictionResult, setTestPredictionResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isVisible) {
            loadDashboardData();
    }
  }, [isVisible]);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            
            // Load model performance metrics
            const mockModelData: MLPerformanceData[] = [
                {
                    modelName: 'Random Forest',
                    recentAccuracy: 0.834,
                    longTermAccuracy: 0.812,
                    weight: 0.25,
                    predictions: 1247,
                    trend: 'improving'
                },
                {
                    modelName: 'Gradient Boosting',
                    recentAccuracy: 0.851,
                    longTermAccuracy: 0.828,
                    weight: 0.28,
                    predictions: 1198,
                    trend: 'improving'
                },
                {
                    modelName: 'Neural Network',
                    recentAccuracy: 0.792,
                    longTermAccuracy: 0.805,
                    weight: 0.22,
                    predictions: 1156,
                    trend: 'declining'
                },
                {
                    modelName: 'Linear Regression',
                    recentAccuracy: 0.758,
                    longTermAccuracy: 0.771,
                    weight: 0.15,
                    predictions: 1289,
                    trend: 'stable'
                },
                {
                    modelName: 'SVM',
                    recentAccuracy: 0.776,
                    longTermAccuracy: 0.763,
                    weight: 0.10,
                    predictions: 1134,
                    trend: 'improving'

            ];
            
            setModelPerformance(mockModelData);
            
            // Load calibration metrics
            setCalibrationMetrics({
                overconfidenceRate: 0.12,
                underconfidenceRate: 0.08,
                averageCalibrationError: 0.045,
                reliabilityScore: 0.887
            });
            
            // Load recent predictions data
            const mockPredictions = Array.from({ length: 10 }, (_, i) => ({
                id: `pred_${i}`,
                timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
                type: ['PLAYER_PERFORMANCE', 'GAME_OUTCOME', 'WEEKLY_SCORING'][i % 3],
                originalConfidence: 0.6 + Math.random() * 0.3,
                enhancedConfidence: 0.65 + Math.random() * 0.25,
                accuracy: Math.random() > 0.25 ? 1 : 0,
                uncertainty: Math.random() * 0.2
            }));
            
            setRecentPredictions(mockPredictions);
    } catch (error) {
        } finally {
            setLoading(false);

    };

    const getTrendClassName = (trend: 'improving' | 'stable' | 'declining'): string => {
        switch (trend) {
            case 'improving':
                return 'bg-green-100 text-green-800';
            case 'declining':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-yellow-100 text-yellow-800';

    };

    const generateTestPrediction = async () => {
        try {

            setIsGeneratingPrediction(true);
            
            // Mock enhanced prediction generation
            const testFeatures = {
                playerRecentPerformance: [18, 22, 15, 25, 19],
                playerPositionRank: 12,
                playerInjuryRisk: 0.15,
                playerMatchupDifficulty: 6.8,
                playerTargetShare: 0.24,
                teamOffensiveRank: 8,
                teamDefensiveRank: 15,
                teamHomeAdvantage: 1,
                teamRecentForm: [0.8, 0.6, 0.9],
                weatherConditions: [72, 15, 0.1],
                gameImportance: 7.5,
                restDays: 6,
                travelDistance: 850,
                headToHeadRecord: [0.6, 0.4],
                seasonalTrends: [0.75, 0.82, 0.71],
                venuePerformance: [22.3],
                timeOfSeason: 0.56,
                weekType: 'REGULAR' as const,
                marketConfidence: 0.73
            };
            
            const result = await oracleAccuracyEnhancementService.generateEnhancedPrediction(
                testFeatures,
                'PLAYER_PERFORMANCE',
                0.75
            );
            
            setTestPredictionResult(result);
            onPredictionTest?.(result);
            
        );
        
    `${(value * 100).toFixed(1)}%`, '']}
                            labelFormatter={(label: any) => `Model: ${label}`}
                        />
                        <Bar dataKey="recentAccuracy" fill="#3b82f6" name="Recent (30 days)" />
                        <Bar dataKey="longTermAccuracy" fill="#93c5fd" name="Long-term" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Dynamic Weight Distribution */}
            <div className="bg-white rounded-lg p-6 shadow-sm sm:px-4 md:px-6 lg:px-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 sm:px-4 md:px-6 lg:px-8">Dynamic Model Weights</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={modelPerformance}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            dataKey="weight"
                            nameKey="modelName"
                            label={(entry: any) => `${entry.modelName}: ${(entry.weight * 100).toFixed(1)}%`}
                        >
                            {modelPerformance.map((entry: any) => (
                                <Cell key={`cell-${entry.modelName}`} fill={[
                                    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'
        ][modelPerformance.indexOf(entry)]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `${(value * 100).toFixed(1)}%`} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Performance Trends */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {modelPerformance.map((model, index) => (
                    <div key={model.modelName} className="bg-white rounded-lg p-4 shadow-sm sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
                            <h4 className="font-medium text-gray-800 sm:px-4 md:px-6 lg:px-8">{model.modelName}</h4>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTrendClassName(model.trend)}`}>
                                {model.trend}
                            </span>
                        </div>
                        <div className="space-y-1 sm:px-4 md:px-6 lg:px-8">
                            <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                                <span className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">Recent:</span>
                                <span className="text-sm font-medium sm:px-4 md:px-6 lg:px-8">{(model.recentAccuracy * 100).toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                                <span className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">Weight:</span>
                                <span className="text-sm font-medium sm:px-4 md:px-6 lg:px-8">{(model.weight * 100).toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                                <span className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">Predictions:</span>
                                <span className="text-sm font-medium sm:px-4 md:px-6 lg:px-8">{model.predictions.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderCalibrationTab = () => (
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            {/* Calibration Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-6 shadow-sm sm:px-4 md:px-6 lg:px-8">
                    <h3 className="text-sm font-medium text-gray-600 mb-1 sm:px-4 md:px-6 lg:px-8">Reliability Score</h3>
                    <div className="text-2xl font-bold text-blue-600 sm:px-4 md:px-6 lg:px-8">
                        {calibrationMetrics ? (calibrationMetrics.reliabilityScore * 100).toFixed(1) : '--'}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1 sm:px-4 md:px-6 lg:px-8">Overall prediction reliability</div>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm sm:px-4 md:px-6 lg:px-8">
                    <h3 className="text-sm font-medium text-gray-600 mb-1 sm:px-4 md:px-6 lg:px-8">Calibration Error</h3>
                    <div className="text-2xl font-bold text-green-600 sm:px-4 md:px-6 lg:px-8">
                        {calibrationMetrics ? (calibrationMetrics.averageCalibrationError * 100).toFixed(1) : '--'}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1 sm:px-4 md:px-6 lg:px-8">Average prediction vs actual</div>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm sm:px-4 md:px-6 lg:px-8">
                    <h3 className="text-sm font-medium text-gray-600 mb-1 sm:px-4 md:px-6 lg:px-8">Overconfidence</h3>
                    <div className="text-2xl font-bold text-orange-600 sm:px-4 md:px-6 lg:px-8">
                        {calibrationMetrics ? (calibrationMetrics.overconfidenceRate * 100).toFixed(1) : '--'}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1 sm:px-4 md:px-6 lg:px-8">Predictions too confident</div>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm sm:px-4 md:px-6 lg:px-8">
                    <h3 className="text-sm font-medium text-gray-600 mb-1 sm:px-4 md:px-6 lg:px-8">Underconfidence</h3>
                    <div className="text-2xl font-bold text-purple-600 sm:px-4 md:px-6 lg:px-8">
                        {calibrationMetrics ? (calibrationMetrics.underconfidenceRate * 100).toFixed(1) : '--'}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1 sm:px-4 md:px-6 lg:px-8">Predictions too cautious</div>
                </div>
            </div>

            {/* Calibration Chart */}
            <div className="bg-white rounded-lg p-6 shadow-sm sm:px-4 md:px-6 lg:px-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 sm:px-4 md:px-6 lg:px-8">Confidence Calibration Analysis</h3>
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={[
                        { range: '50-60%', predicted: 55, actual: 52 },
                        { range: '60-70%', predicted: 65, actual: 68 },
                        { range: '70-80%', predicted: 75, actual: 76 },
                        { range: '80-90%', predicted: 85, actual: 82 },
                        { range: '90-100%', predicted: 95, actual: 91 }
                    ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" />
                        <YAxis domain={[45, 100]} />
                        <Tooltip formatter={(value: number) => `${value}%`} />
                        <Line type="monotone" dataKey="predicted" stroke="#3b82f6" name="Predicted Confidence" strokeWidth={2} />
                        <Line type="monotone" dataKey="actual" stroke="#10b981" name="Actual Accuracy" strokeWidth={2} />
                        <Line type="monotone" data={[{range: '50-60%', ideal: 55}, {range: '60-70%', ideal: 65}, {range: '70-80%', ideal: 75}, {range: '80-90%', ideal: 85}, {range: '90-100%', ideal: 95}]} dataKey="ideal" stroke="#6b7280" strokeDasharray="5 5" name="Perfect Calibration" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    const renderPredictionsTab = () => (
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            {/* Test Prediction Generator */}
            <div className="bg-white rounded-lg p-6 shadow-sm sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-4 sm:px-4 md:px-6 lg:px-8">
                    <h3 className="text-lg font-semibold text-gray-800 sm:px-4 md:px-6 lg:px-8">Enhanced Prediction Test</h3>
                    <button
                        onClick={generateTestPrediction}
                        disabled={isGeneratingPrediction}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isGeneratingPrediction
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                     aria-label="Action button">
                        {isGeneratingPrediction ? 'Generating...' : 'Generate Test Prediction'}
                    </button>
                </div>
                
                {testPredictionResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-gray-50 rounded-lg sm:px-4 md:px-6 lg:px-8"
                    >
                        <h4 className="font-medium text-gray-800 mb-2 sm:px-4 md:px-6 lg:px-8">Enhanced Prediction Result</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600 sm:px-4 md:px-6 lg:px-8">Original:</span>
                                <div className="font-medium sm:px-4 md:px-6 lg:px-8">{((testPredictionResult.originalConfidence || 0) * 100).toFixed(1)}%</div>
                            </div>
                            <div>
                                <span className="text-gray-600 sm:px-4 md:px-6 lg:px-8">Enhanced:</span>
                                <div className="font-medium text-blue-600 sm:px-4 md:px-6 lg:px-8">{((testPredictionResult.enhancedConfidence || 0) * 100).toFixed(1)}%</div>
                            </div>
                            <div>
                                <span className="text-gray-600 sm:px-4 md:px-6 lg:px-8">Calibrated:</span>
                                <div className="font-medium text-green-600 sm:px-4 md:px-6 lg:px-8">{((testPredictionResult.calibratedConfidence || 0) * 100).toFixed(1)}%</div>
                            </div>
                            <div>
                                <span className="text-gray-600 sm:px-4 md:px-6 lg:px-8">Reliability:</span>
                                <div className="font-medium text-purple-600 sm:px-4 md:px-6 lg:px-8">{((testPredictionResult.reliabilityScore || 0) * 100).toFixed(1)}%</div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Recent Predictions History */}
            <div className="bg-white rounded-lg p-6 shadow-sm sm:px-4 md:px-6 lg:px-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 sm:px-4 md:px-6 lg:px-8">Recent Enhanced Predictions</h3>
                <div className="overflow-x-auto sm:px-4 md:px-6 lg:px-8">
                    <table className="min-w-full sm:px-4 md:px-6 lg:px-8">
                        <thead>
                            <tr className="border-b sm:px-4 md:px-6 lg:px-8">
                                <th className="text-left py-2 text-sm font-medium text-gray-600 sm:px-4 md:px-6 lg:px-8">Date</th>
                                <th className="text-left py-2 text-sm font-medium text-gray-600 sm:px-4 md:px-6 lg:px-8">Type</th>
                                <th className="text-right py-2 text-sm font-medium text-gray-600 sm:px-4 md:px-6 lg:px-8">Original</th>
                                <th className="text-right py-2 text-sm font-medium text-gray-600 sm:px-4 md:px-6 lg:px-8">Enhanced</th>
                                <th className="text-center py-2 text-sm font-medium text-gray-600 sm:px-4 md:px-6 lg:px-8">Result</th>
                                <th className="text-right py-2 text-sm font-medium text-gray-600 sm:px-4 md:px-6 lg:px-8">Uncertainty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentPredictions.map((pred, index) => (
                                <tr key={pred.id} className="border-b hover:bg-gray-50 sm:px-4 md:px-6 lg:px-8">
                                    <td className="py-2 text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">
                                        {new Date(pred.timestamp).toLocaleDateString()}
                                    </td>
                                    <td className="py-2 text-sm text-gray-800 sm:px-4 md:px-6 lg:px-8">{pred.type.replace('_', ' ')}</td>
                                    <td className="py-2 text-sm text-right sm:px-4 md:px-6 lg:px-8">{(pred.originalConfidence * 100).toFixed(1)}%</td>
                                    <td className="py-2 text-sm text-right font-medium text-blue-600 sm:px-4 md:px-6 lg:px-8">
                                        {(pred.enhancedConfidence * 100).toFixed(1)}%
                                    </td>
                                    <td className="py-2 text-center sm:px-4 md:px-6 lg:px-8">
                                        <span className={`inline-flex w-3 h-3 rounded-full ${
                                            pred.accuracy ? 'bg-green-500' : 'bg-red-500'
                                        }`}></span>
                                    </td>
                                    <td className="py-2 text-sm text-right text-gray-600 sm:px-4 md:px-6 lg:px-8">
                                        ±{(pred.uncertainty * 100).toFixed(1)}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderInsightsTab = () => (
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            {/* Key Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm sm:px-4 md:px-6 lg:px-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 sm:px-4 md:px-6 lg:px-8">🎯 Accuracy Improvements</h3>
                    <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                            <span className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">Last 30 days:</span>
                            <span className="font-medium text-green-600 sm:px-4 md:px-6 lg:px-8">+12.3%</span>
                        </div>
                        <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                            <span className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">This week:</span>
                            <span className="font-medium text-green-600 sm:px-4 md:px-6 lg:px-8">+8.1%</span>
                        </div>
                        <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                            <span className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">Best model:</span>
                            <span className="font-medium text-blue-600 sm:px-4 md:px-6 lg:px-8">Gradient Boosting</span>
                        </div>
                        <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                            <span className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">Top prediction type:</span>
                            <span className="font-medium text-purple-600 sm:px-4 md:px-6 lg:px-8">Player Performance</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm sm:px-4 md:px-6 lg:px-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 sm:px-4 md:px-6 lg:px-8">🔧 Optimization Actions</h3>
                    <div className="space-y-3 text-sm sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-start space-x-2 sm:px-4 md:px-6 lg:px-8">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 sm:px-4 md:px-6 lg:px-8"></div>
                            <span className="text-gray-700 sm:px-4 md:px-6 lg:px-8">Increased Gradient Boosting weight by 8% due to recent performance</span>
                        </div>
                        <div className="flex items-start space-x-2 sm:px-4 md:px-6 lg:px-8">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 sm:px-4 md:px-6 lg:px-8"></div>
                            <span className="text-gray-700 sm:px-4 md:px-6 lg:px-8">Neural Network showing declining trend - reduced weight by 5%</span>
                        </div>
                        <div className="flex items-start space-x-2 sm:px-4 md:px-6 lg:px-8">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 sm:px-4 md:px-6 lg:px-8"></div>
                            <span className="text-gray-700 sm:px-4 md:px-6 lg:px-8">Calibration improved overconfidence rate by 3.2%</span>
                        </div>
                        <div className="flex items-start space-x-2 sm:px-4 md:px-6 lg:px-8">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 sm:px-4 md:px-6 lg:px-8"></div>
                            <span className="text-gray-700 sm:px-4 md:px-6 lg:px-8">Feature engineering enhanced prediction variance by 15%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Timeline */}
            <div className="bg-white rounded-lg p-6 shadow-sm sm:px-4 md:px-6 lg:px-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 sm:px-4 md:px-6 lg:px-8">📈 Accuracy Enhancement Timeline</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={[
                        { date: '2024-01-01', baseline: 72, enhanced: 72 },
                        { date: '2024-01-08', baseline: 74, enhanced: 76 },
                        { date: '2024-01-15', baseline: 73, enhanced: 78 },
                        { date: '2024-01-22', baseline: 75, enhanced: 81 },
                        { date: '2024-01-29', baseline: 76, enhanced: 83 },
                        { date: '2024-02-05', baseline: 74, enhanced: 85 },
                        { date: '2024-02-12', baseline: 77, enhanced: 87 }
                    ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={(value: any) => new Date(value).toLocaleDateString()} />
                        <YAxis domain={[65, 90]} />
                        <Tooltip 
                            formatter={(value: number) => [`${value}%`, '']}
                            labelFormatter={(value: any) => new Date(value).toLocaleDateString()}
                        />
                        <Area type="monotone" dataKey="baseline" stackId="1" stroke="#93c5fd" fill="#bfdbfe" name="Baseline Oracle" />
                        <Area type="monotone" dataKey="enhanced" stackId="2" stroke="#3b82f6" fill="#60a5fa" name="Enhanced Oracle" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    if (!isVisible) return null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 sm:px-4 md:px-6 lg:px-8"></div>
        <span className="ml-2 sm:px-4 md:px-6 lg:px-8">Loading...</span>
      </div>
    );

  return (
        <div className="bg-gray-50 min-h-screen p-6 sm:px-4 md:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto sm:px-4 md:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 sm:px-4 md:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 sm:px-4 md:px-6 lg:px-8">🤖 Enhanced Oracle ML Dashboard</h1>
                    <p className="text-gray-600 sm:px-4 md:px-6 lg:px-8">Advanced machine learning analytics for Oracle prediction accuracy enhancement</p>
                </div>

                {/* Tab Navigation */}
                <div className="mb-6 sm:px-4 md:px-6 lg:px-8">
                    <div className="border-b border-gray-200 sm:px-4 md:px-6 lg:px-8">
                        <nav className="-mb-px flex space-x-8 sm:px-4 md:px-6 lg:px-8">
                            {[
                                { id: 'performance', label: '📊 Model Performance', description: 'Real-time accuracy metrics' },
                                { id: 'calibration', label: '🎯 Calibration', description: 'Confidence calibration analysis' },
                                { id: 'predictions', label: '🔮 Predictions', description: 'Enhanced prediction testing' },
                                { id: 'insights', label: '💡 Insights', description: 'Performance insights & trends' }
                            ].map((tab: any) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}`}
                                >
                                    <span>{tab.label}</span>
                                    <span className="ml-2 text-xs text-gray-400 group-hover:text-gray-500 sm:px-4 md:px-6 lg:px-8">
                                        {tab.description}
                                    </span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center h-96 sm:px-4 md:px-6 lg:px-8">
                                <div className="text-center sm:px-4 md:px-6 lg:px-8">
                                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4 sm:px-4 md:px-6 lg:px-8"></div>
                                    <div className="text-gray-600 sm:px-4 md:px-6 lg:px-8">Loading ML dashboard...</div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {activeTab === 'performance' && renderPerformanceTab()}
                                {activeTab === 'calibration' && renderCalibrationTab()}
                                {activeTab === 'predictions' && renderPredictionsTab()}
                                {activeTab === 'insights' && renderInsightsTab()}
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

const EnhancedOracleMLDashboardWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <EnhancedOracleMLDashboard {...props} />
  </ErrorBoundary>
);

export default React.memo(EnhancedOracleMLDashboardWithErrorBoundary);
