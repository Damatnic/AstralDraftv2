/**
 * Oracle Analytics Service
 * Tracks prediction accuracy, user performance, and provides insights
 */

export interface OracleAnalytics {
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
  week: number;
  accuracy: number;
  totalPredictions: number;
  userWins: number;
}

export interface PredictionTypeStats {
  type: string;
  accuracy: number;
  totalPredictions: number;
  avgConfidence: number;
  userSuccessRate: number;
}

export interface UserInsight {
  type: 'SUCCESS_PATTERN' | 'IMPROVEMENT_AREA' | 'STREAK_POTENTIAL' | 'RECOMMENDATION';
  title: string;
  description: string;
  data?: {
    type?: string;
    accuracy?: number;
    streak?: number;
    value?: number;
    [key: string]: unknown;
  };
}

export interface OraclePerformanceMetrics {
  overallAccuracy: number;
  weeklyAccuracy: Record<number, number>;
  typeAccuracy: Record<string, number>;
  confidenceCorrelation: number;
  calibrationScore: number;
}

export interface OraclePrediction {
  id: string;
  userId: string;
  gameId: string;
  predictionType: string;
  choice: number;
  confidence: number;
  isCorrect: boolean;
  submittedAt: Date;
  resolvedAt?: Date;
  week: number;
  season: number;
}

export interface UserChallenge {
  id: string;
  userId: string;
  predictionId: string;
  userChoice: number;
  oracleChoice: number;
  isUserCorrect: boolean;
  submittedAt: Date;
  resolvedAt?: Date;
  pointsEarned: number;
  week: number;
  season: number;
}

export interface SuccessPattern {
  bestType: string | null;
  bestAccuracy: number;
  worstType: string | null;
  worstAccuracy: number;
  totalChallenges: number;
}

export interface StreakAnalysis {
  currentStreak: number;
  longestStreak: number;
  streakType: 'win' | 'loss' | 'none';
  potentialStreak: number;
}

export interface CalibrationData {
  confidence: number;
  accuracy: number;
  count: number;
}

class OracleAnalyticsService {
  private readonly STORAGE_KEY = 'oracleAnalytics';
  private readonly PREDICTIONS_KEY = 'oraclePredictions';
  private readonly USER_CHALLENGES_KEY = 'userChallenges';

  /**
   * Get comprehensive analytics for Oracle performance
   */
  async getOracleAnalytics(userId?: string): Promise<OracleAnalytics> {
    const predictions = this.getPredictions();
    const userChallenges = this.getUserChallenges(userId);
    
    const predictionAccuracy = this.calculatePredictionAccuracy(predictions);
    const userWinRate = this.calculateUserWinRate(userChallenges);
    const accuracyTrends = this.calculateAccuracyTrends(predictions);
    const topPredictionTypes = this.getTopPredictionTypes(predictions, userChallenges);
    const userInsights = await this.generateUserInsights(predictions, userChallenges);

    return {
      predictionAccuracy,
      userWinRate,
      totalPredictions: predictions.length,
      totalUserChallenges: userChallenges.length,
      confidenceByType: this.calculateConfidenceByType(predictions),
      accuracyTrends,
      topPredictionTypes,
      userInsights
    };
  }

  /**
   * Calculate Oracle's overall prediction accuracy
   */
  private calculatePredictionAccuracy(predictions: OraclePrediction[]): number {
    if (predictions.length === 0) return 0;
    
    const correctPredictions = predictions.filter(p => p.isCorrect).length;
    return correctPredictions / predictions.length;
  }

  /**
   * Calculate user's win rate against Oracle
   */
  private calculateUserWinRate(userChallenges: UserChallenge[]): number {
    if (userChallenges.length === 0) return 0;
    
    const userWins = userChallenges.filter(c => c.isUserCorrect).length;
    return userWins / userChallenges.length;
  }

  /**
   * Get detailed performance metrics
   */
  async getPerformanceMetrics(timeframe?: 'week' | 'month' | 'season'): Promise<OraclePerformanceMetrics> {
    const predictions = this.getPredictions();
    const filteredPredictions = this.filterByTimeframe(predictions, timeframe);

    const overallAccuracy = this.calculatePredictionAccuracy(filteredPredictions);
    const weeklyAccuracy = this.calculateWeeklyAccuracy(filteredPredictions);
    const typeAccuracy = this.calculateTypeAccuracy(filteredPredictions);
    const confidenceCorrelation = this.calculateConfidenceCorrelation(filteredPredictions);
    const calibrationScore = this.calculateCalibrationScore(filteredPredictions);

    return {
      overallAccuracy,
      weeklyAccuracy,
      typeAccuracy,
      confidenceCorrelation,
      calibrationScore
    };
  }

  /**
   * Generate personalized insights for users
   */
  private async generateUserInsights(
    predictions: OraclePrediction[],
    userChallenges: UserChallenge[]
  ): Promise<UserInsight[]> {
    const insights: UserInsight[] = [];

    // Success pattern analysis
    const successPatterns = this.analyzeSuccessPatterns(userChallenges);
    if (successPatterns.bestType) {
      insights.push({
        type: 'SUCCESS_PATTERN',
        title: 'Your Strongest Prediction Category',
        description: `You have a ${Math.round(successPatterns.bestAccuracy * 100)}% success rate in ${successPatterns.bestType} predictions`,
        data: { type: successPatterns.bestType, accuracy: successPatterns.bestAccuracy }
      });
    }

    // Improvement area analysis
    if (successPatterns.worstType && successPatterns.worstAccuracy < 0.4) {
      insights.push({
        type: 'IMPROVEMENT_AREA',
        title: 'Area for Improvement',
        description: `Consider focusing on ${successPatterns.worstType} predictions where you have ${Math.round(successPatterns.worstAccuracy * 100)}% accuracy`,
        data: { type: successPatterns.worstType, accuracy: successPatterns.worstAccuracy }
      });
    }

    // Streak analysis
    const streakAnalysis = this.analyzeStreaks(userChallenges);
    if (streakAnalysis.currentStreak >= 3) {
      insights.push({
        type: 'STREAK_POTENTIAL',
        title: `${streakAnalysis.currentStreak} Prediction Streak!`,
        description: `You're on a ${streakAnalysis.currentStreak} prediction winning streak. Keep it up!`,
        data: { streak: streakAnalysis.currentStreak }
      });
    }

    // Recommendations
    const recommendations = this.generateRecommendations(userChallenges, predictions);
    insights.push(...recommendations);

    return insights;
  }

  /**
   * Analyze user success patterns by prediction type
   */
  private analyzeSuccessPatterns(userChallenges: UserChallenge[]): SuccessPattern {
    const typeStats: Record<string, { correct: number; total: number }> = {};

    // Group challenges by prediction type (would need to join with predictions)
    userChallenges.forEach(challenge => {
      const type = 'general'; // Placeholder - would need prediction type from join
      if (!typeStats[type]) {
        typeStats[type] = { correct: 0, total: 0 };
      }
      typeStats[type].total++;
      if (challenge.isUserCorrect) {
        typeStats[type].correct++;
      }
    });

    let bestType: string | null = null;
    let bestAccuracy = 0;
    let worstType: string | null = null;
    let worstAccuracy = 1;

    Object.entries(typeStats).forEach(([type, stats]) => {
      const accuracy = stats.correct / stats.total;
      if (accuracy > bestAccuracy) {
        bestAccuracy = accuracy;
        bestType = type;
      }
      if (accuracy < worstAccuracy) {
        worstAccuracy = accuracy;
        worstType = type;
      }
    });

    return {
      bestType,
      bestAccuracy,
      worstType,
      worstAccuracy,
      totalChallenges: userChallenges.length
    };
  }

  /**
   * Analyze winning/losing streaks
   */
  private analyzeStreaks(userChallenges: UserChallenge[]): StreakAnalysis {
    if (userChallenges.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        streakType: 'none',
        potentialStreak: 0
      };
    }

    const sortedChallenges = [...userChallenges].sort((a, b) => 
      new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
    );

    let currentStreak = 0;
    let longestStreak = 0;
    let currentStreakType: 'win' | 'loss' | 'none' = 'none';
    
    // Calculate current streak (from most recent)
    for (let i = sortedChallenges.length - 1; i >= 0; i--) {
      const isWin = sortedChallenges[i].isUserCorrect;
      
      if (i === sortedChallenges.length - 1) {
        currentStreak = 1;
        currentStreakType = isWin ? 'win' : 'loss';
      } else {
        const shouldContinue = currentStreakType === 'win' ? isWin : !isWin;
        if (shouldContinue) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    let tempStreak = 0;
    let tempType: 'win' | 'loss' | 'none' = 'none';

    sortedChallenges.forEach((challenge, index) => {
      const isWin = challenge.isUserCorrect;
      
      if (index === 0) {
        tempStreak = 1;
        tempType = isWin ? 'win' : 'loss';
      } else {
        const shouldContinue = tempType === 'win' ? isWin : !isWin;
        if (shouldContinue) {
          tempStreak++;
        } else {
          if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
          }
          tempStreak = 1;
          tempType = isWin ? 'win' : 'loss';
        }
      }
    });

    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }

    return {
      currentStreak,
      longestStreak,
      streakType: currentStreakType,
      potentialStreak: currentStreakType === 'win' ? currentStreak + 1 : 1
    };
  }

  /**
   * Calculate accuracy trends over time
   */
  private calculateAccuracyTrends(predictions: OraclePrediction[]): AccuracyTrend[] {
    const weeklyStats: Record<number, { correct: number; total: number; userWins: number }> = {};

    predictions.forEach(prediction => {
      const week = prediction.week;
      if (!weeklyStats[week]) {
        weeklyStats[week] = { correct: 0, total: 0, userWins: 0 };
      }
      weeklyStats[week].total++;
      if (prediction.isCorrect) {
        weeklyStats[week].correct++;
      }
    });

    return Object.entries(weeklyStats)
      .map(([week, stats]) => ({
        week: parseInt(week),
        accuracy: stats.correct / stats.total,
        totalPredictions: stats.total,
        userWins: stats.userWins
      }))
      .sort((a, b) => a.week - b.week);
  }

  /**
   * Get top performing prediction types
   */
  private getTopPredictionTypes(
    predictions: OraclePrediction[],
    userChallenges: UserChallenge[]
  ): PredictionTypeStats[] {
    const typeStats: Record<string, {
      correct: number;
      total: number;
      totalConfidence: number;
      userCorrect: number;
      userTotal: number;
    }> = {};

    // Analyze Oracle predictions
    predictions.forEach(prediction => {
      const type = prediction.predictionType;
      if (!typeStats[type]) {
        typeStats[type] = {
          correct: 0,
          total: 0,
          totalConfidence: 0,
          userCorrect: 0,
          userTotal: 0
        };
      }
      
      typeStats[type].total++;
      typeStats[type].totalConfidence += prediction.confidence;
      if (prediction.isCorrect) {
        typeStats[type].correct++;
      }
    });

    // Analyze user challenges (would need join with predictions for type)
    userChallenges.forEach(challenge => {
      const type = 'general'; // Placeholder
      if (typeStats[type]) {
        typeStats[type].userTotal++;
        if (challenge.isUserCorrect) {
          typeStats[type].userCorrect++;
        }
      }
    });

    return Object.entries(typeStats)
      .map(([type, stats]) => ({
        type,
        accuracy: stats.correct / stats.total,
        totalPredictions: stats.total,
        avgConfidence: stats.totalConfidence / stats.total,
        userSuccessRate: stats.userTotal > 0 ? stats.userCorrect / stats.userTotal : 0
      }))
      .sort((a, b) => b.accuracy - a.accuracy);
  }

  /**
   * Calculate confidence by type
   */
  private calculateConfidenceByType(predictions: OraclePrediction[]): Record<string, number> {
    const confidenceByType: Record<string, { total: number; count: number }> = {};

    predictions.forEach(prediction => {
      const type = prediction.predictionType;
      if (!confidenceByType[type]) {
        confidenceByType[type] = { total: 0, count: 0 };
      }
      confidenceByType[type].total += prediction.confidence;
      confidenceByType[type].count++;
    });

    const result: Record<string, number> = {};
    Object.entries(confidenceByType).forEach(([type, data]) => {
      result[type] = data.total / data.count;
    });

    return result;
  }

  /**
   * Calculate weekly accuracy breakdown
   */
  private calculateWeeklyAccuracy(predictions: OraclePrediction[]): Record<number, number> {
    const weeklyStats: Record<number, { correct: number; total: number }> = {};

    predictions.forEach(prediction => {
      const week = prediction.week;
      if (!weeklyStats[week]) {
        weeklyStats[week] = { correct: 0, total: 0 };
      }
      weeklyStats[week].total++;
      if (prediction.isCorrect) {
        weeklyStats[week].correct++;
      }
    });

    const result: Record<number, number> = {};
    Object.entries(weeklyStats).forEach(([week, stats]) => {
      result[parseInt(week)] = stats.correct / stats.total;
    });

    return result;
  }

  /**
   * Calculate accuracy by prediction type
   */
  private calculateTypeAccuracy(predictions: OraclePrediction[]): Record<string, number> {
    const typeStats: Record<string, { correct: number; total: number }> = {};

    predictions.forEach(prediction => {
      const type = prediction.predictionType;
      if (!typeStats[type]) {
        typeStats[type] = { correct: 0, total: 0 };
      }
      typeStats[type].total++;
      if (prediction.isCorrect) {
        typeStats[type].correct++;
      }
    });

    const result: Record<string, number> = {};
    Object.entries(typeStats).forEach(([type, stats]) => {
      result[type] = stats.correct / stats.total;
    });

    return result;
  }

  /**
   * Calculate correlation between confidence and accuracy
   */
  private calculateConfidenceCorrelation(predictions: OraclePrediction[]): number {
    if (predictions.length < 2) return 0;

    const validPredictions = predictions.filter(p => 
      typeof p.confidence === 'number' && !isNaN(p.confidence)
    );

    if (validPredictions.length < 2) return 0;

    const n = validPredictions.length;
    const confidences = validPredictions.map(p => p.confidence);
    const accuracies = validPredictions.map(p => p.isCorrect ? 1 : 0);

    const meanConfidence = confidences.reduce((sum, c) => sum + c, 0) / n;
    const meanAccuracy = accuracies.reduce((sum: number, a) => sum + a, 0) / n;

    let numerator = 0;
    let confDenominator = 0;
    let accDenominator = 0;

    for (let i = 0; i < n; i++) {
      const confDiff = confidences[i] - meanConfidence;
      const accDiff = accuracies[i] - meanAccuracy;
      
      numerator += confDiff * accDiff;
      confDenominator += confDiff * confDiff;
      accDenominator += accDiff * accDiff;
    }

    const denominator = Math.sqrt(confDenominator * accDenominator);
    return denominator === 0 ? 0 : numerator / denominator;
  }

  /**
   * Calculate calibration score (how well confidence matches actual accuracy)
   */
  private calculateCalibrationScore(predictions: OraclePrediction[]): number {
    const confidenceBuckets: Record<string, CalibrationData> = {};

    predictions.forEach(prediction => {
      const bucket = Math.floor(prediction.confidence * 10) / 10; // 0.1 intervals
      const bucketKey = bucket.toString();
      
      if (!confidenceBuckets[bucketKey]) {
        confidenceBuckets[bucketKey] = { confidence: bucket, accuracy: 0, count: 0 };
      }
      
      confidenceBuckets[bucketKey].count++;
      if (prediction.isCorrect) {
        confidenceBuckets[bucketKey].accuracy++;
      }
    });

    // Calculate calibration error
    let totalError = 0;
    let totalCount = 0;

    Object.values(confidenceBuckets).forEach(bucket => {
      if (bucket.count > 0) {
        const actualAccuracy = bucket.accuracy / bucket.count;
        const error = Math.abs(bucket.confidence - actualAccuracy);
        totalError += error * bucket.count;
        totalCount += bucket.count;
      }
    });

    return totalCount > 0 ? 1 - (totalError / totalCount) : 0;
  }

  /**
   * Filter predictions by timeframe
   */
  private filterByTimeframe(
    predictions: OraclePrediction[],
    timeframe?: 'week' | 'month' | 'season'
  ): OraclePrediction[] {
    if (!timeframe) return predictions;

    const now = new Date();
    const cutoffDate = new Date();

    switch (timeframe) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'season':
        cutoffDate.setMonth(0, 1); // Start of year
        break;
    }

    return predictions.filter(p => new Date(p.submittedAt) >= cutoffDate);
  }

  /**
   * Generate personalized recommendations
   */
  private generateRecommendations(
    userChallenges: UserChallenge[],
    _predictions: OraclePrediction[]
  ): UserInsight[] {
    const recommendations: UserInsight[] = [];

    if (userChallenges.length < 5) {
      recommendations.push({
        type: 'RECOMMENDATION',
        title: 'Start Building Your Track Record',
        description: 'Challenge the Oracle on more predictions to build your analytics profile and unlock insights.',
        data: { value: 5 - userChallenges.length }
      });
    }

    // Add more sophisticated recommendations based on data patterns
    const recentAccuracy = this.calculateRecentAccuracy(userChallenges);
    if (recentAccuracy < 0.4 && userChallenges.length > 10) {
      recommendations.push({
        type: 'RECOMMENDATION',
        title: 'Focus on High-Confidence Predictions',
        description: 'Your recent accuracy is below 40%. Try focusing on predictions where you feel most confident.',
        data: { accuracy: recentAccuracy }
      });
    }

    return recommendations;
  }

  /**
   * Calculate recent accuracy (last 10 challenges)
   */
  private calculateRecentAccuracy(userChallenges: UserChallenge[]): number {
    const recentChallenges = userChallenges
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .slice(0, 10);

    if (recentChallenges.length === 0) return 0;

    const correct = recentChallenges.filter(c => c.isUserCorrect).length;
    return correct / recentChallenges.length;
  }

  /**
   * Get stored predictions
   */
  private getPredictions(): OraclePrediction[] {
    try {
      const stored = localStorage.getItem(this.PREDICTIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Get user challenges
   */
  private getUserChallenges(userId?: string): UserChallenge[] {
    try {
      const stored = localStorage.getItem(this.USER_CHALLENGES_KEY);
      const allChallenges: UserChallenge[] = stored ? JSON.parse(stored) : [];
      
      if (userId) {
        return allChallenges.filter(c => c.userId === userId);
      }
      
      return allChallenges;
    } catch {
      return [];
    }
  }

  /**
   * Store predictions
   */
  storePrediction(prediction: OraclePrediction): void {
    const predictions = this.getPredictions();
    predictions.push(prediction);
    localStorage.setItem(this.PREDICTIONS_KEY, JSON.stringify(predictions));
  }

  /**
   * Store user challenge
   */
  storeUserChallenge(challenge: UserChallenge): void {
    const challenges = this.getUserChallenges();
    challenges.push(challenge);
    localStorage.setItem(this.USER_CHALLENGES_KEY, JSON.stringify(challenges));
  }

  /**
   * Clear all analytics data
   */
  clearAnalytics(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.PREDICTIONS_KEY);
    localStorage.removeItem(this.USER_CHALLENGES_KEY);
  }
}

export const oracleAnalyticsService = new OracleAnalyticsService();
export default oracleAnalyticsService;
