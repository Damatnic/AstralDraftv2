/**
 * Oracle Real-Time Prediction Interface (Refactored)
 * Simplified main interface using extracted components
 */

import React, { useMemo, useState, useEffect, useCallback } from &apos;react&apos;;
import { motion } from &apos;framer-motion&apos;;
import { useAuth } from &apos;../../contexts/SimpleAuthContext&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { ZapIcon } from &apos;../icons/ZapIcon&apos;;
import { oracleApiClient } from &apos;../../services/oracleApiClient&apos;;
import EnsembleMLWidget from &apos;./EnsembleMLWidget&apos;;
import { useOracleWebSocket, OracleWebSocketMessage } from &apos;../../hooks/useOracleWebSocket&apos;;
import UserStatsWidget, { UserStats } from &apos;./UserStatsWidget&apos;;
import RealtimeUpdatesWidget, { RealtimeUpdate } from &apos;./RealtimeUpdatesWidget&apos;;
import PredictionCard, { LivePrediction } from &apos;./PredictionCard&apos;;
import PredictionDetail from &apos;./PredictionDetail&apos;;
import OracleErrorBoundary from &apos;./OracleErrorBoundary&apos;;
import { OracleAnalyticsDashboard } from &apos;../analytics/OracleAnalyticsDashboard&apos;;
import { PredictionResponse } from &apos;../../services/oracleApiClient&apos;;
import { BarChart3, Target, Menu, Settings } from &apos;lucide-react&apos;;
import { useMediaQuery } from &apos;../../hooks/useMediaQuery&apos;;
import { NotificationCenter } from &apos;./NotificationCenter&apos;;
import { NotificationPreferencesComponent } from &apos;./NotificationPreferences&apos;;
import { useOracleNotifications } from &apos;../../hooks/useOracleNotifications&apos;;

interface Props {
}
    week?: number;
    className?: string;

// Interfaces now imported from extracted components

}

const OracleRealTimePredictionInterface: React.FC<Props> = ({ week = 1, 
}
    className = &apos;&apos; 
 }: any) => {
}
  const [isLoading, setIsLoading] = React.useState(false);
    const { user, isAuthenticated } = useAuth();
    
    // Media queries for responsive design
    const isMobile = useMediaQuery(&apos;(max-width: 768px)&apos;);
    
    // Notification system
    const {
}
        scheduleDeadlineNotifications,
        notifyPredictionResult,
        notifyPredictionDeadline,
        notifyAccuracyUpdate,
        notifyStreakMilestone,
//         notifyRankingChange
    } = useOracleNotifications();
    
    // Core State
    const [predictions, setPredictions] = useState<LivePrediction[]>([]);
    const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeView, setActiveView] = useState<&apos;predictions&apos; | &apos;analytics&apos;>(&apos;predictions&apos;);
    const [showNotificationSettings, setShowNotificationSettings] = useState(false);
    
    // Real-time State
    const [realtimeUpdates, setRealtimeUpdates] = useState<RealtimeUpdate[]>([]);
    const [userStats, setUserStats] = useState<UserStats>({
}
        totalPredictions: 0,
        correctPredictions: 0,
        accuracy: 0,
        streak: 0,
        rank: 0
    });
    const [previousStats, setPreviousStats] = useState<UserStats | null>(null);

    // WebSocket Message Handler
    const handleWebSocketMessage = useCallback((data: OracleWebSocketMessage) => {
}
        switch (data.type) {
}
            case &apos;PREDICTION_UPDATE&apos;:
                updatePrediction(data.prediction);
                addRealtimeUpdate({
}
                    id: `update-${Date.now()}`,
                    type: &apos;PREDICTION_UPDATE&apos;,
                    message: `Oracle updated prediction: ${data.prediction.question}`,
                    timestamp: new Date().toISOString(),
                    data: data.prediction
                });
                break;

            case &apos;USER_PREDICTION_SUBMITTED&apos;:
                if (data.userId !== user?.id) {
}
                    addRealtimeUpdate({
}
                        id: `user-${Date.now()}`,
                        type: &apos;USER_JOINED&apos;,
                        message: `${data.username} submitted a prediction`,
                        timestamp: new Date().toISOString()
                    });
                    updateParticipantCount(data.predictionId, data.totalParticipants);

                break;

            case &apos;CONSENSUS_UPDATE&apos;:
                updateConsensus(data.predictionId, data.consensusChoice, data.consensusConfidence);
                addRealtimeUpdate({
}
                    id: `consensus-${Date.now()}`,
                    type: &apos;CONSENSUS_CHANGE&apos;,
                    message: `Community consensus shifted to ${data.consensusChoice}`,
                    timestamp: new Date().toISOString()
                });
                break;

            case &apos;TIME_WARNING&apos;:
                // Show real-time update
                addRealtimeUpdate({
}
                    id: `warning-${Date.now()}`,
                    type: &apos;TIME_WARNING&apos;,
                    message: `⏰ ${data.message}`,
                    timestamp: new Date().toISOString()
                });
                
                // Also trigger a notification if this is a deadline warning
                if (data.predictionId && data.minutesRemaining) {
}
                    const prediction = predictions.find((p: any) => p.id === data.predictionId);
                    if (prediction) {
}
                        notifyPredictionDeadline(data.predictionId, prediction.question, data.minutesRemaining);


                break;

            case &apos;USER_STATS_UPDATE&apos;:
                // Check for significant changes and trigger notifications
                if (previousStats) {
}
                    // Accuracy change notification
                    if (Math.abs(data.stats.accuracy - previousStats.accuracy) >= 5) {
}
                        notifyAccuracyUpdate(data.stats.accuracy, previousStats.accuracy);

                    // Streak milestone notification (new streaks of 3, 5, 10, etc.)
                    if (data.stats.streak > previousStats.streak && 
                        (data.stats.streak === 3 || data.stats.streak === 5 || 
                         data.stats.streak === 10 || data.stats.streak % 10 === 0)) {
}
                        notifyStreakMilestone(data.stats.streak);

                    // Ranking change notification
                    if (data.stats.rank !== previousStats.rank && data.stats.rank > 0) {
}
                        notifyRankingChange(data.stats.rank, previousStats.rank);


                // Update previous stats for next comparison
                setPreviousStats(userStats);
                setUserStats(data.stats);
                break;

            case &apos;PREDICTION_RESOLVED&apos;:
                // Handle when predictions are resolved with results
                if (data.predictionId && data.question && typeof data.userCorrect === &apos;boolean&apos;) {
}
                    const pointsEarned = data.pointsEarned || 0;
                    notifyPredictionResult(data.predictionId, data.question, data.userCorrect, pointsEarned);

                break;

            default:

    }, [user]);

    // WebSocket Hook
    const { connectionStatus, sendMessage } = useOracleWebSocket({
}
        userId: user?.id?.toString() || &apos;&apos;,
        week,
        onMessage: handleWebSocketMessage,
        onError: (errorMsg: any) => setError(errorMsg)
    });

    // Helper Functions
    const addRealtimeUpdate = useCallback((update: RealtimeUpdate) => {
}
        setRealtimeUpdates(prev => [update, ...prev].slice(0, 10));
    }, []);

    const updatePrediction = useCallback((updatedPrediction: Partial<LivePrediction>) => {
}
        setPredictions(prev => prev.map((p: any) => 
            p.id === updatedPrediction.id ? { ...p, ...updatedPrediction } : p
        ));
    }, []);

    const updateParticipantCount = useCallback((predictionId: string, count: number) => {
}
        setPredictions(prev => prev.map((p: any) => 
            p.id === predictionId ? { ...p, participants: count } : p
        ));
    }, []);

    const updateConsensus = useCallback((predictionId: string, choice: number, confidence: number) => {
}
        setPredictions(prev => prev.map((p: any) => 
            p.id === predictionId ? { 
}
                ...p, 
                consensusChoice: choice, 
                consensusConfidence: confidence 
            } : p
        ));
    }, []);

    // Connection status indicator
    const getConnectionStatusColor = () => {
}
        switch (connectionStatus) {
}
            case &apos;connected&apos;: return &apos;bg-green-500 animate-pulse&apos;;
            case &apos;connecting&apos;: return &apos;bg-yellow-500 animate-pulse&apos;;
            default: return &apos;bg-red-500&apos;;

    };

    const selectedPredictionData = predictions.find((p: any) => p.id === selectedPrediction);

    // Load initial predictions
    useEffect(() => {
}
        const loadPredictions = async () => {
}
            if (!isAuthenticated || !user) return;

            setLoading(true);
            setError(null);
            
            try {
}
                // Set auth credentials for Oracle API
                const playerNumber = parseInt(user.id.replace(&apos;player&apos;, &apos;&apos;)) || (user.isAdmin ? 11 : 1);
                oracleApiClient.setAuth(playerNumber, user.pin);
                
                // Check if Oracle backend is available
                const isAvailable = await oracleApiClient.isAvailable();
                if (!isAvailable) {
}
                    throw new Error(&apos;Oracle backend is not available. Please ensure the Oracle server is running.&apos;);

                // Fetch real predictions from backend
                const response = await oracleApiClient.getWeeklyPredictions(week);
                
                if (!response.success) {
}
                    throw new Error(&apos;Failed to load predictions from server&apos;);

                // Convert API response to LivePrediction format
                const livePredictions: LivePrediction[] = response.data.map((p: PredictionResponse) => ({
}
                    id: p.id,
                    week: p.week,
                    type: p.type as any, // Type assertion for compatibility
                    question: p.question,
                    options: p.options.map((opt: any, index: number) => ({
}
                        id: index,
                        text: opt,
                        probability: 1 / p.options.length, // Equal probability for display
                        supportingData: []
                    })),
                    oracleChoice: p.oracleChoice,
                    confidence: p.oracleConfidence,
                    reasoning: p.oracleReasoning,
                    dataPoints: p.dataPoints,
                    timestamp: new Date().toISOString(),
                    participants: p.participantsCount || 0,
                    timeRemaining: p.expiresAt ? new Date(p.expiresAt).getTime() - Date.now() : 0,
                    consensusChoice: p.consensusChoice,
                    consensusConfidence: p.consensusConfidence,
                    userChoice: p.userSubmission?.choice,
                    userConfidence: p.userSubmission?.confidence,
                    isSubmitted: !!p.userSubmission
                }));

                setPredictions(livePredictions);
                
                // Schedule deadline notifications for each prediction
                livePredictions.forEach((prediction: any) => {
}
                    if (prediction.timeRemaining && prediction.timeRemaining > 0) {
}
                        const expiresAt = new Date(Date.now() + prediction.timeRemaining).toISOString();
                        scheduleDeadlineNotifications(prediction.id, prediction.question, expiresAt);

                });
                
                // Auto-select first prediction
                if (livePredictions.length > 0) {
}
                    setSelectedPrediction(livePredictions[0].id);

                // Load user stats
                try {
}
                    const statsResponse = await oracleApiClient.getUserStats(playerNumber);
                    if (statsResponse.success && statsResponse.data) {
}
                        const newStats = {
}
                            totalPredictions: statsResponse.data.totalPredictions,
                            correctPredictions: statsResponse.data.correctPredictions,
                            accuracy: statsResponse.data.accuracy,
                            streak: statsResponse.data.currentStreak,
                            rank: 0 // Will be updated from leaderboard
                        };
                        
                        // Check for stat changes to trigger notifications
                        if (previousStats) {
}
                            // Accuracy change notification
                            if (Math.abs(newStats.accuracy - previousStats.accuracy) >= 5) {
}
                                notifyAccuracyUpdate(newStats.accuracy, previousStats.accuracy);

                            // Streak milestone notification
                            if (newStats.streak > previousStats.streak) {
}
                                notifyStreakMilestone(newStats.streak);

                            // Ranking change notification
                            if (newStats.rank !== previousStats.rank && newStats.rank > 0 && previousStats.rank > 0) {
}
                                notifyRankingChange(newStats.rank, previousStats.rank);


                        setPreviousStats(userStats);
                        setUserStats(newStats);

    `submit-${Date.now()}`,
                type: &apos;USER_JOINED&apos;,
                message: `You submitted your prediction: ${choice}`,
                timestamp: new Date().toISOString()
            });

            // Update participant count if provided in response
            if (response.data?.participantsCount) {
}
                updatePrediction({
}
                    id: predictionId,
                    participants: response.data.participantsCount
                });

            // Check if this was a result notification scenario
            const prediction = predictions.find((p: any) => p.id === predictionId);
            if (prediction && response.data?.isResolved) {
}
                const isCorrect = prediction.oracleChoice === choice;
                const pointsEarned = response.data.pointsEarned || 0;
                notifyPredictionResult(predictionId, prediction.question, isCorrect, pointsEarned);

        );

    }, [isAuthenticated, user, updatePrediction, sendMessage, addRealtimeUpdate]);

    // Authentication guard
    if (!isAuthenticated) {
}
        return (
            <OracleErrorBoundary>
                <Widget title="🔮 Oracle Predictions" className={className}>
                    <div className="text-center py-8 px-4 sm:px-4 md:px-6 lg:px-8">
                        <div className="text-gray-400 mb-6 text-sm sm:text-base">
                            Please log in to access Oracle predictions
                        </div>
                        <button 
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg transition-colors text-sm sm:text-base font-medium min-h-[44px] min-w-[120px]"
                            aria-label="Log in to Oracle Predictions"
                        >
                            Log In
                        </button>
                    </div>
                </Widget>
            </OracleErrorBoundary>
        );

    // Loading state
    if (loading) {
}
        return (
            <OracleErrorBoundary>
                <Widget title="🔮 Oracle Predictions" className={className}>
                    <div className="flex items-center justify-center py-8 px-4 sm:px-4 md:px-6 lg:px-8">
                        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-400"></div>
                        <span className="ml-3 text-gray-400 text-sm sm:text-base">Loading Oracle predictions...</span>
                    </div>
                </Widget>
            </OracleErrorBoundary>
        );

    // Error state
    if (error) {
}
        return (
            <OracleErrorBoundary>
                <Widget title="🔮 Oracle Predictions" className={className}>
                    <div className="text-center py-8 px-4 sm:px-4 md:px-6 lg:px-8">
                        <div className="text-red-400 mb-6 text-sm sm:text-base break-words">{error}</div>
                        <button 
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg transition-colors text-sm sm:text-base font-medium min-h-[44px] min-w-[120px]"
                            aria-label="Retry loading Oracle predictions"
                        >
//                             Retry
                        </button>
                    </div>
                </Widget>
            </OracleErrorBoundary>
        );

    return (
        <OracleErrorBoundary>
            <div className={`oracle-realtime-interface ${className}`}>
                <Widget>
                    title="🔮 Oracle Predictions"
                    className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8"
                >
                    {/* Header with status and view toggle */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6 px-4 sm:px-0">
                        <div className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                            <ZapIcon className="text-blue-400 w-5 h-5 sm:w-6 sm:h-6" />
                            <span className="text-lg sm:text-xl font-semibold">Week {week} Oracle</span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                            {/* View Toggle */}
                            <div className="flex bg-gray-800 rounded-lg p-1 w-full sm:w-auto">
                                <button
                                    onClick={() => setActiveView(&apos;predictions&apos;)}
                                    className={`flex-1 sm:flex-none px-3 py-2 sm:py-1 rounded text-sm font-medium transition-colors min-h-[44px] sm:min-h-0 ${
}
                                        activeView === &apos;predictions&apos; 
                                            ? &apos;bg-blue-600 text-white&apos; 
                                            : &apos;text-gray-400 hover:text-white&apos;
                                    }`}
                                    aria-label="View Predictions"
                                    aria-pressed={activeView === &apos;predictions&apos;}
                                >
                                    <Target className="w-4 h-4 inline mr-1 sm:px-4 md:px-6 lg:px-8" />
//                                     Predictions
                                </button>
                                <button
                                    onClick={() => setActiveView(&apos;analytics&apos;)}
                                    className={`flex-1 sm:flex-none px-3 py-2 sm:py-1 rounded text-sm font-medium transition-colors min-h-[44px] sm:min-h-0 ${
}
                                        activeView === &apos;analytics&apos; 
                                            ? &apos;bg-blue-600 text-white&apos; 
                                            : &apos;text-gray-400 hover:text-white&apos;
                                    }`}
                                    aria-label="View Analytics"
                                    aria-pressed={activeView === &apos;analytics&apos;}
                                >
                                    <BarChart3 className="w-4 h-4 inline mr-1 sm:px-4 md:px-6 lg:px-8" />
//                                     Analytics
                                </button>
                            </div>
                            
                            {/* Notification Center and Settings */}
                            <div className="flex items-center justify-center sm:justify-start space-x-2">
                                <NotificationCenter />
                                
                                <button
                                    onClick={() => setShowNotificationSettings(!showNotificationSettings)}
                                    className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center sm:px-4 md:px-6 lg:px-8"
                                    aria-label="Notification Settings"
                                >
                                    <Settings className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
                                </button>
                            </div>
                            
                            {/* Connection Status */}
                            <div className="flex items-center justify-center sm:justify-start space-x-2 p-2 sm:p-0">
                                <div className={`w-2 h-2 rounded-full ${getConnectionStatusColor()}`} aria-hidden="true"></div>
                                <span className="text-xs sm:text-sm text-gray-400 capitalize">{connectionStatus}</span>
                            </div>
                        </div>
                    </div>

                    {/* Notification Settings Panel */}
                    {showNotificationSettings && (
}
                        <div className="mb-6 px-4 sm:px-0">
                            <NotificationPreferencesComponent>
                                onClose={() => setShowNotificationSettings(false)}
                            />
                        </div>
                    )}

                    {/* Conditional Content Based on Active View */}
                    {activeView === &apos;predictions&apos; ? (
}
                        <div className="px-4 sm:px-0">
                            {/* User Statistics */}
                            <UserStatsWidget stats={userStats} className="mb-4 sm:mb-6" />

                            {/* Main Content - Mobile Stack, Desktop Grid */}
                            {isMobile ? (
}
                                /* Mobile Layout: Stacked */
                                <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
                                    {/* Selected Prediction Detail First on Mobile */}
                                    {selectedPredictionData && (
}
                                        <div className="order-1 sm:px-4 md:px-6 lg:px-8">
                                            <h3 className="text-lg font-semibold text-white mb-3 sm:px-4 md:px-6 lg:px-8">Selected Prediction</h3>
                                            <PredictionDetail>
                                                prediction={selectedPredictionData}
                                                onSubmit={submitPrediction}
                                        </div>
                                    )}

                                    {/* Predictions List */}
                                    <div className="order-2 sm:px-4 md:px-6 lg:px-8">
                                        <div className="flex items-center justify-between mb-3 sm:px-4 md:px-6 lg:px-8">
                                            <h3 className="text-lg font-semibold text-white sm:px-4 md:px-6 lg:px-8">Active Predictions</h3>
                                            <span className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">{predictions.length} available</span>
                                        </div>
                                        
                                        <div className="space-y-3 max-h-80 overflow-y-auto sm:px-4 md:px-6 lg:px-8">
                                            {predictions.map((prediction: any) => (
}
                                                <motion.div
                                                    key={prediction.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                >
                                                    <PredictionCard>
                                                        prediction={prediction}
                                                        isSelected={selectedPrediction === prediction.id}
                                                        onClick={() => setSelectedPrediction(prediction.id)}
//                                                         compact
                                                    />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* AI Ensemble Widget */}
                                    <div className="order-3 sm:px-4 md:px-6 lg:px-8">
                                        <EnsembleMLWidget compact={true} />
                                    </div>

                                    {/* Real-time Updates */}
                                    <div className="order-4 sm:px-4 md:px-6 lg:px-8">
                                        <RealtimeUpdatesWidget>
                                            updates={realtimeUpdates}
//                                             compact
                                            maxUpdates={3}
                                        />
                                    </div>
                                </div>
                            ) : (
                                /* Desktop/Tablet Layout: Grid */
                                <div className="grid lg:grid-cols-2 gap-6">
                                    {/* Left Column: Predictions List */}
                                    <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                                        <div className="flex items-center justify-between mb-3 sm:px-4 md:px-6 lg:px-8">
                                            <h3 className="text-lg font-semibold text-white sm:px-4 md:px-6 lg:px-8">Active Predictions</h3>
                                            <span className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">{predictions.length} available</span>
                                        </div>
                                        
                                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2 sm:px-4 md:px-6 lg:px-8">
                                            {predictions.map((prediction: any) => (
}
                                                <motion.div
                                                    key={prediction.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                >
                                                    <PredictionCard>
                                                        prediction={prediction}
                                                        isSelected={selectedPrediction === prediction.id}
                                                        onClick={() => setSelectedPrediction(prediction.id)}
//                                                         compact
                                                    />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                                        {/* Selected Prediction Detail */}
                                        {selectedPredictionData && (
}
                                            <PredictionDetail>
                                                prediction={selectedPredictionData}
                                                onSubmit={submitPrediction}
                                        )}

                                        {/* AI Ensemble Widget */}
                                        <EnsembleMLWidget compact={true} />

                                        {/* Real-time Updates */}
                                        <RealtimeUpdatesWidget>
                                            updates={realtimeUpdates}
//                                             compact
                                            maxUpdates={5}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Analytics Dashboard */
                        <div className="px-4 sm:px-0">
                            <OracleAnalyticsDashboard />
                        </div>
                    )}
                </Widget>
            </div>
        </OracleErrorBoundary>
    );
};

const OracleRealTimePredictionInterfaceWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <OracleRealTimePredictionInterface {...props} />
  </ErrorBoundary>
);

export default React.memo(OracleRealTimePredictionInterfaceWithErrorBoundary);
