/**
 * Oracle Analytics Service
 * Tracks prediction accuracy, user performance, and provides insights
 */

export interface OracleAnalytics {
}
    predictionAccuracy: number;
    userWinRate: number;
    totalPredictions: number;
    totalUserChallenges: number;
    confidenceByType: Record<string, number>;
    accuracyTrends: AccuracyTrend[];
    topPredictionTypes: PredictionTypeStats[];
    userInsights: UserInsight[];
}

export interface AccuracyTrend {
}
    week: number;
    accuracy: number;
    totalPredictions: number;
    userWins: number;
}

export interface PredictionTypeStats {
}
    type: string;
    accuracy: number;
    totalPredictions: number;
    avgConfidence: number;
    userSuccessRate: number;
}

export interface UserInsight {
}
    type: &apos;SUCCESS_PATTERN&apos; | &apos;IMPROVEMENT_AREA&apos; | &apos;STREAK_POTENTIAL&apos; | &apos;RECOMMENDATION&apos;;
    title: string;
    description: string;
    data?: any;
}

export interface OraclePerformanceMetrics {
}
    overallAccuracy: number;
    weeklyAccuracy: Record<number, number>;
    typeAccuracy: Record<string, number>;
    confidenceCorrelation: number;
    calibrationScore: number;
}

class OracleAnalyticsService {
}
    private readonly STORAGE_KEY = &apos;oracleAnalytics&apos;;
    private readonly PREDICTIONS_KEY = &apos;oraclePredictions&apos;;
    private readonly USER_CHALLENGES_KEY = &apos;userChallenges&apos;;

    /**
     * Get comprehensive Oracle analytics
     */
    async getAnalytics(): Promise<OracleAnalytics> {
}
        const [predictions, userChallenges] = await Promise.all([
            this.getStoredPredictions(),
            this.getStoredUserChallenges()
        ]);

        const predictionAccuracy = this.calculatePredictionAccuracy(predictions);
        const userWinRate = this.calculateUserWinRate(userChallenges);
        const confidenceByType = this.analyzeConfidenceByType(predictions);
        const accuracyTrends = this.calculateAccuracyTrends(predictions, userChallenges);
        const topPredictionTypes = this.analyzePredictionTypes(predictions, userChallenges);
        const userInsights = await this.generateUserInsights(predictions, userChallenges);

        return {
}
            predictionAccuracy,
            userWinRate,
            totalPredictions: predictions.length,
            totalUserChallenges: userChallenges.length,
            confidenceByType,
            accuracyTrends,
            topPredictionTypes,
//             userInsights
        };
    }

    /**
     * Record prediction result for analytics
     */
    async recordPredictionResult(
        predictionId: string,
        actualResult: number,
        userPrediction?: number
    ): Promise<void> {
}
        const predictions = await this.getStoredPredictions();
        const prediction = predictions.find((p: any) => p.id === predictionId);
        
        if (prediction) {
}
            const updatedPrediction = {
}
                ...prediction,
                actualResult,
                isCorrect: prediction.oracleChoice === actualResult,
                userCorrect: userPrediction !== undefined ? userPrediction === actualResult : undefined,
                recordedAt: new Date().toISOString()
            };

            const updatedPredictions = predictions.map((p: any) => 
                p.id === predictionId ? updatedPrediction : p
            );

            await this.storePredictions(updatedPredictions);
        }
    }

    /**
     * Get Oracle performance metrics
     */
    async getOraclePerformanceMetrics(): Promise<OraclePerformanceMetrics> {
}
        const predictions = await this.getStoredPredictions();
        const completedPredictions = predictions.filter((p: any) => p.actualResult !== undefined);

        const overallAccuracy = this.calculatePredictionAccuracy(completedPredictions);
        const weeklyAccuracy = this.calculateWeeklyAccuracy(completedPredictions);
        const typeAccuracy = this.calculateTypeAccuracy(completedPredictions);
        const confidenceCorrelation = this.calculateConfidenceCorrelation(completedPredictions);
        const calibrationScore = this.calculateCalibrationScore(completedPredictions);

        return {
}
            overallAccuracy,
            weeklyAccuracy,
            typeAccuracy,
            confidenceCorrelation,
//             calibrationScore
        };
    }

    /**
     * Generate personalized insights for users
     */
    private async generateUserInsights(
        predictions: any[],
        userChallenges: any[]
    ): Promise<UserInsight[]> {
}
        const insights: UserInsight[] = [];

        // Success pattern analysis
        const successPatterns = this.analyzeSuccessPatterns(userChallenges);
        if (successPatterns.bestType) {
}
            insights.push({
}
                type: &apos;SUCCESS_PATTERN&apos;,
                title: &apos;Your Strongest Prediction Category&apos;,
                description: `You have a ${Math.round(successPatterns.bestAccuracy * 100)}% success rate in ${successPatterns.bestType} predictions`,
                data: { type: successPatterns.bestType, accuracy: successPatterns.bestAccuracy }
            });
        }

        // Improvement area analysis
        const improvementAreas = this.analyzeImprovementAreas(userChallenges);
        if (improvementAreas.weakestType) {
}
            insights.push({
}
                type: &apos;IMPROVEMENT_AREA&apos;,
                title: &apos;Area for Improvement&apos;,
                description: `Focus on ${improvementAreas.weakestType} predictions to boost your overall performance`,
                data: { type: improvementAreas.weakestType, accuracy: improvementAreas.weakestAccuracy }
            });
        }

        // Streak analysis
        const streakPotential = this.analyzeStreakPotential(userChallenges);
        if (streakPotential.currentStreak > 0) {
}
            insights.push({
}
                type: &apos;STREAK_POTENTIAL&apos;,
                title: &apos;Hot Streak Alert!&apos;,
                description: `You&apos;re on a ${streakPotential.currentStreak}-challenge winning streak`,
                data: { streak: streakPotential.currentStreak, potential: streakPotential.potential }
            });
        }

        // AI-powered recommendations
        const recommendations = await this.generateAIRecommendations(userChallenges, predictions);
        insights.push(...recommendations);

        return insights;
    }

    /**
     * Generate AI-powered recommendations
     */
    private async generateAIRecommendations(
        userChallenges: any[],
        predictions: any[]
    ): Promise<UserInsight[]> {
}
        const recommendations: UserInsight[] = [];

        // Analyze user patterns vs Oracle accuracy
        const userAccuracy = this.calculateUserWinRate(userChallenges);
        const oracleAccuracy = this.calculatePredictionAccuracy(predictions);

        if (userAccuracy < oracleAccuracy * 0.8) {
}
            recommendations.push({
}
                type: &apos;RECOMMENDATION&apos;,
                title: &apos;Follow the Oracle More Closely&apos;,
                description: `The Oracle has ${Math.round(oracleAccuracy * 100)}% accuracy vs your ${Math.round(userAccuracy * 100)}%. Consider aligning your predictions more closely.`
            });
        }

        // Recommend challenging the Oracle when confidence is low
        const lowConfidencePredictions = predictions.filter((p: any) => p.confidence < 70);
        if (lowConfidencePredictions.length > 0) {
}
            recommendations.push({
}
                type: &apos;RECOMMENDATION&apos;,
                title: &apos;Challenge Low-Confidence Predictions&apos;,
                description: &apos;The Oracle seems uncertain on some predictions. These might be good opportunities to trust your instincts.&apos;
            });
        }

        return recommendations;
    }

    // Analysis helper methods
    private calculatePredictionAccuracy(predictions: any[]): number {
}
        const completedPredictions = predictions.filter((p: any) => p.actualResult !== undefined);
        if (completedPredictions.length === 0) return 0;

        const correctPredictions = completedPredictions.filter((p: any) => p.isCorrect);
        return correctPredictions.length / completedPredictions.length;
    }

    private calculateUserWinRate(userChallenges: any[]): number {
}
        if (userChallenges.length === 0) return 0;
        const wins = userChallenges.filter((c: any) => c.userCorrect === true);
        return wins.length / userChallenges.length;
    }

    private analyzeConfidenceByType(predictions: any[]): Record<string, number> {
}
        const typeConfidence: Record<string, { total: number; count: number }> = {};

        predictions.forEach((prediction: any) => {
}
            const type = prediction.type;
            if (!typeConfidence[type]) {
}
                typeConfidence[type] = { total: 0, count: 0 };
            }
            typeConfidence[type].total += prediction.confidence;
            typeConfidence[type].count += 1;
        });

        return Object.keys(typeConfidence).reduce((acc, type) => {
}
            acc[type] = typeConfidence[type].total / typeConfidence[type].count;
            return acc;
        }, {} as Record<string, number>);
    }

    private calculateAccuracyTrends(predictions: any[], userChallenges: any[]): AccuracyTrend[] {
}
        const weeklyData: Record<number, { predictions: any[]; userChallenges: any[] }> = {};

        // Group by week
        predictions.forEach((p: any) => {
}
            if (!weeklyData[p.week]) weeklyData[p.week] = { predictions: [], userChallenges: [] };
            weeklyData[p.week].predictions.push(p);
        });

        userChallenges.forEach((c: any) => {
}
            if (!weeklyData[c.week]) weeklyData[c.week] = { predictions: [], userChallenges: [] };
            weeklyData[c.week].userChallenges.push(c);
        });

        return Object.keys(weeklyData).map((week: any) => {
}
            const weekNum = parseInt(week);
            const data = weeklyData[weekNum];
            
            return {
}
                week: weekNum,
                accuracy: this.calculatePredictionAccuracy(data.predictions),
                totalPredictions: data.predictions.length,
                userWins: data.userChallenges.filter((c: any) => c.userCorrect).length
            };
        }).sort((a, b) => a.week - b.week);
    }

    private analyzePredictionTypes(predictions: any[], userChallenges: any[]): PredictionTypeStats[] {
}
        const types = [...new Set(predictions.map((p: any) => p.type))];
        
        return types.map((type: any) => {
}
            const typePredictions = predictions.filter((p: any) => p.type === type);
            const typeUserChallenges = userChallenges.filter((c: any) => c.type === type);

            return {
}
                type,
                accuracy: this.calculatePredictionAccuracy(typePredictions),
                totalPredictions: typePredictions.length,
                avgConfidence: typePredictions.reduce((sum, p) => sum + p.confidence, 0) / typePredictions.length,
                userSuccessRate: this.calculateUserWinRate(typeUserChallenges)
            };
        });
    }

    private analyzeSuccessPatterns(userChallenges: any[]): { bestType?: string; bestAccuracy: number } {
}
        const typeStats = this.calculateUserStatsByType(userChallenges);
        const bestType = Object.keys(typeStats).reduce((best, type) => 
            typeStats[type].accuracy > (typeStats[best]?.accuracy || 0) ? type : best, 
            &apos;&apos;
        );

        return {
}
            bestType: bestType || undefined,
            bestAccuracy: typeStats[bestType]?.accuracy || 0
        };
    }

    private analyzeImprovementAreas(userChallenges: any[]): { weakestType?: string; weakestAccuracy: number } {
}
        const typeStats = this.calculateUserStatsByType(userChallenges);
        const weakestType = Object.keys(typeStats).reduce((worst, type) => 
            typeStats[type].accuracy < (typeStats[worst]?.accuracy || Infinity) ? type : worst, 
            &apos;&apos;
        );

        return {
}
            weakestType: weakestType || undefined,
            weakestAccuracy: typeStats[weakestType]?.accuracy || 0
        };
    }

    private analyzeStreakPotential(userChallenges: any[]): { currentStreak: number; potential: string } {
}
        const sortedChallenges = [...userChallenges].sort((a, b) => 
            new Date(b.timestamp || &apos;&apos;).getTime() - new Date(a.timestamp || &apos;&apos;).getTime()
        );

        let currentStreak = 0;
        for (const challenge of sortedChallenges) {
}
            if (challenge.userCorrect) {
}
                currentStreak++;
            } else {
}
                break;
            }
        }

        let potential: string;
        if (currentStreak >= 3) {
}
            potential = &apos;HIGH&apos;;
        } else if (currentStreak >= 1) {
}
            potential = &apos;MEDIUM&apos;;
        } else {
}
            potential = &apos;LOW&apos;;
        }

        return {
}
            currentStreak,
//             potential
        };
    }

    private calculateUserStatsByType(userChallenges: any[]): Record<string, { accuracy: number; count: number }> {
}
        const typeStats: Record<string, { correct: number; total: number }> = {};

        userChallenges.forEach((challenge: any) => {
}
            if (!typeStats[challenge.type]) {
}
                typeStats[challenge.type] = { correct: 0, total: 0 };
            }
            typeStats[challenge.type].total++;
            if (challenge.userCorrect) {
}
                typeStats[challenge.type].correct++;
            }
        });

        return Object.keys(typeStats).reduce((acc, type) => {
}
            acc[type] = {
}
                accuracy: typeStats[type].correct / typeStats[type].total,
                count: typeStats[type].total
            };
            return acc;
        }, {} as Record<string, { accuracy: number; count: number }>);
    }

    private calculateWeeklyAccuracy(predictions: any[]): Record<number, number> {
}
        const weeklyStats: Record<number, { correct: number; total: number }> = {};

        predictions.forEach((prediction: any) => {
}
            if (!weeklyStats[prediction.week]) {
}
                weeklyStats[prediction.week] = { correct: 0, total: 0 };
            }
            weeklyStats[prediction.week].total++;
            if (prediction.isCorrect) {
}
                weeklyStats[prediction.week].correct++;
            }
        });

        return Object.keys(weeklyStats).reduce((acc, week) => {
}
            const weekNum = parseInt(week);
            acc[weekNum] = weeklyStats[weekNum].correct / weeklyStats[weekNum].total;
            return acc;
        }, {} as Record<number, number>);
    }

    private calculateTypeAccuracy(predictions: any[]): Record<string, number> {
}
        const typeStats: Record<string, { correct: number; total: number }> = {};

        predictions.forEach((prediction: any) => {
}
            if (!typeStats[prediction.type]) {
}
                typeStats[prediction.type] = { correct: 0, total: 0 };
            }
            typeStats[prediction.type].total++;
            if (prediction.isCorrect) {
}
                typeStats[prediction.type].correct++;
            }
        });

        return Object.keys(typeStats).reduce((acc, type) => {
}
            acc[type] = typeStats[type].correct / typeStats[type].total;
            return acc;
        }, {} as Record<string, number>);
    }

    private calculateConfidenceCorrelation(predictions: any[]): number {
}
        if (predictions.length < 2) return 0;

        // Calculate correlation between confidence and accuracy
        const confidenceAccuracyPairs = predictions.map((p: any) => [
            p.confidence,
            p.isCorrect ? 100 : 0
        ]);

        return this.calculateCorrelation(confidenceAccuracyPairs);
    }

    private calculateCalibrationScore(predictions: any[]): number {
}
        // Measure how well confidence levels match actual accuracy
        const confidenceBuckets: Record<string, { correct: number; total: number }> = {};

        predictions.forEach((prediction: any) => {
}
            const bucket = Math.floor(prediction.confidence / 10) * 10; // 0-10, 10-20, etc.
            const bucketKey = `${bucket}-${bucket + 10}`;
            
            if (!confidenceBuckets[bucketKey]) {
}
                confidenceBuckets[bucketKey] = { correct: 0, total: 0 };
            }
            
            confidenceBuckets[bucketKey].total++;
            if (prediction.isCorrect) {
}
                confidenceBuckets[bucketKey].correct++;
            }
        });

        // Calculate average deviation between confidence and actual accuracy
        let totalDeviation = 0;
        let bucketCount = 0;

        Object.keys(confidenceBuckets).forEach((bucket: any) => {
}
            const stats = confidenceBuckets[bucket];
            const actualAccuracy = stats.correct / stats.total;
            const expectedConfidence = parseInt(bucket.split(&apos;-&apos;)[0]) / 100;
            
            totalDeviation += Math.abs(actualAccuracy - expectedConfidence);
            bucketCount++;
        });

        return bucketCount > 0 ? 1 - (totalDeviation / bucketCount) : 0;
    }

    private calculateCorrelation(pairs: number[][]): number {
}
        const n = pairs.length;
        if (n < 2) return 0;

        const sumX = pairs.reduce((sum, pair) => sum + pair[0], 0);
        const sumY = pairs.reduce((sum, pair) => sum + pair[1], 0);
        const sumXY = pairs.reduce((sum, pair) => sum + pair[0] * pair[1], 0);
        const sumX2 = pairs.reduce((sum, pair) => sum + pair[0] * pair[0], 0);
        const sumY2 = pairs.reduce((sum, pair) => sum + pair[1] * pair[1], 0);

        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

        return denominator === 0 ? 0 : numerator / denominator;
    }

    // Storage methods
    private async getStoredPredictions(): Promise<any[]> {
}
        try {
}
            const stored = localStorage.getItem(this.PREDICTIONS_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
}
            console.error(&apos;Failed to load stored predictions:&apos;, error);
            return [];
        }
    }

    private async getStoredUserChallenges(): Promise<any[]> {
}
        try {
}
            const stored = localStorage.getItem(this.USER_CHALLENGES_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
}
            console.error(&apos;Failed to load stored user challenges:&apos;, error);
            return [];
        }
    }

    private async storePredictions(predictions: any[]): Promise<void> {
}
        try {
}
            localStorage.setItem(this.PREDICTIONS_KEY, JSON.stringify(predictions));
        } catch (error) {
}
            console.error(&apos;Failed to store predictions:&apos;, error);
        }
    }

    private async storeUserChallenges(challenges: any[]): Promise<void> {
}
        try {
}
            localStorage.setItem(this.USER_CHALLENGES_KEY, JSON.stringify(challenges));
        } catch (error) {
}
            console.error(&apos;Failed to store user challenges:&apos;, error);
        }
    }
}

// Export singleton instance
export const oracleAnalyticsService = new OracleAnalyticsService();
export default oracleAnalyticsService;
