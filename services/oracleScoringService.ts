/**
 * Oracle Challenge Scoring System
 * Calculates points, rankings, and achievements for Beat The Oracle challenges
 */

export interface ChallengeSubmission {
}
  id: string;
  userId: string;
  predictionId: string;
  userChoice: number;
  confidence: number;
  reasoning?: string;
  submittedAt: Date;
}

export interface ChallengeResult {
}
  predictionId: string;
  correctAnswer: number;
  oracleChoice: number;
  oracleConfidence: number;
  resolvedAt: Date;
}

export interface ScoringResult {
}
  userId: string;
  predictionId: string;
  basePoints: number;
  confidenceBonus: number;
  oracleBeatBonus: number;
  streakMultiplier: number;
  totalPoints: number;
  wasCorrect: boolean;
  beatOracle: boolean;
  newStreak: number;
}

export interface UserScore {
}
  userId: string;
  totalPoints: number;
  correctPredictions: number;
  totalPredictions: number;
  accuracy: number;
  oracleBeats: number;
  currentStreak: number;
  longestStreak: number;
  rank: number;
  level: number;
}

export interface Achievement {
}
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: &apos;bronze&apos; | &apos;silver&apos; | &apos;gold&apos; | &apos;platinum&apos; | &apos;legendary&apos;;
  requirement: {
}
    type: &apos;prediction_count&apos; | &apos;accuracy&apos; | &apos;streak&apos; | &apos;oracle_beats&apos; | &apos;points&apos; | &apos;perfect_week&apos;;
    value: number;
    timeframe?: &apos;week&apos; | &apos;season&apos; | &apos;alltime&apos;;
  };
}

class OracleScoringService {
}
  private readonly basePoints = {
}
    correct: 100,
    incorrect: 0
  };

  private readonly confidenceMultipliers = {
}
    60: 1.0,   // 60-69% confidence
    70: 1.2,   // 70-79% confidence
    80: 1.5,   // 80-89% confidence
    90: 2.0    // 90-100% confidence
  };

  private readonly streakMultipliers = {
}
    0: 1.0,    // No streak
    3: 1.1,    // 3+ streak
    5: 1.2,    // 5+ streak
    7: 1.3,    // 7+ streak
    10: 1.5,   // 10+ streak
    15: 2.0    // 15+ streak
  };

  private readonly oracleBeatBonus = 50; // Bonus for beating Oracle
  private readonly achievements: Achievement[] = [
    // Prediction Count Achievements
    {
}
      id: &apos;first_prediction&apos;,
      name: &apos;First Steps&apos;,
      description: &apos;Made your first Oracle prediction&apos;,
      icon: &apos;👶&apos;,
      tier: &apos;bronze&apos;,
      requirement: { type: &apos;prediction_count&apos;, value: 1 }
    },
    {
}
      id: &apos;prediction_veteran&apos;,
      name: &apos;Prediction Veteran&apos;,
      description: &apos;Made 100 Oracle predictions&apos;,
      icon: &apos;🏈&apos;,
      tier: &apos;silver&apos;,
      requirement: { type: &apos;prediction_count&apos;, value: 100 }
    },
    {
}
      id: &apos;prediction_master&apos;,
      name: &apos;Prediction Master&apos;,
      description: &apos;Made 500 Oracle predictions&apos;,
      icon: &apos;🏆&apos;,
      tier: &apos;gold&apos;,
      requirement: { type: &apos;prediction_count&apos;, value: 500 }
    },

    // Accuracy Achievements
    {
}
      id: &apos;accuracy_rookie&apos;,
      name: &apos;Sharp Eye&apos;,
      description: &apos;Achieve 60% accuracy over 20+ predictions&apos;,
      icon: &apos;🎯&apos;,
      tier: &apos;bronze&apos;,
      requirement: { type: &apos;accuracy&apos;, value: 60 }
    },
    {
}
      id: &apos;accuracy_expert&apos;,
      name: &apos;Oracle Rival&apos;,
      description: &apos;Achieve 75% accuracy over 50+ predictions&apos;,
      icon: &apos;⚡&apos;,
      tier: &apos;gold&apos;,
      requirement: { type: &apos;accuracy&apos;, value: 75 }
    },
    {
}
      id: &apos;accuracy_legendary&apos;,
      name: &apos;Future Sight&apos;,
      description: &apos;Achieve 85% accuracy over 100+ predictions&apos;,
      icon: &apos;🔮&apos;,
      tier: &apos;legendary&apos;,
      requirement: { type: &apos;accuracy&apos;, value: 85 }
    },

    // Streak Achievements
    {
}
      id: &apos;streak_3&apos;,
      name: &apos;Hot Streak&apos;,
      description: &apos;Get 3 predictions correct in a row&apos;,
      icon: &apos;🔥&apos;,
      tier: &apos;bronze&apos;,
      requirement: { type: &apos;streak&apos;, value: 3 }
    },
    {
}
      id: &apos;streak_7&apos;,
      name: &apos;On Fire&apos;,
      description: &apos;Get 7 predictions correct in a row&apos;,
      icon: &apos;🚀&apos;,
      tier: &apos;silver&apos;,
      requirement: { type: &apos;streak&apos;, value: 7 }
    },
    {
}
      id: &apos;streak_15&apos;,
      name: &apos;Unstoppable&apos;,
      description: &apos;Get 15 predictions correct in a row&apos;,
      icon: &apos;⭐&apos;,
      tier: &apos;legendary&apos;,
      requirement: { type: &apos;streak&apos;, value: 15 }
    },

    // Oracle Beat Achievements
    {
}
      id: &apos;oracle_beat_1&apos;,
      name: &apos;David vs Goliath&apos;,
      description: &apos;Beat the Oracle for the first time&apos;,
      icon: &apos;🏹&apos;,
      tier: &apos;bronze&apos;,
      requirement: { type: &apos;oracle_beats&apos;, value: 1 }
    },
    {
}
      id: &apos;oracle_beat_10&apos;,
      name: &apos;Oracle Challenger&apos;,
      description: &apos;Beat the Oracle 10 times&apos;,
      icon: &apos;⚔️&apos;,
      tier: &apos;silver&apos;,
      requirement: { type: &apos;oracle_beats&apos;, value: 10 }
    },
    {
}
      id: &apos;oracle_beat_50&apos;,
      name: &apos;Oracle Slayer&apos;,
      description: &apos;Beat the Oracle 50 times&apos;,
      icon: &apos;👑&apos;,
      tier: &apos;legendary&apos;,
      requirement: { type: &apos;oracle_beats&apos;, value: 50 }
    },

    // Points Achievements
    {
}
      id: &apos;points_1000&apos;,
      name: &apos;Point Collector&apos;,
      description: &apos;Earn 1,000 total points&apos;,
      icon: &apos;💎&apos;,
      tier: &apos;bronze&apos;,
      requirement: { type: &apos;points&apos;, value: 1000 }
    },
    {
}
      id: &apos;points_10000&apos;,
      name: &apos;Point Master&apos;,
      description: &apos;Earn 10,000 total points&apos;,
      icon: &apos;💰&apos;,
      tier: &apos;gold&apos;,
      requirement: { type: &apos;points&apos;, value: 10000 }
    },

    // Perfect Week
    {
}
      id: &apos;perfect_week&apos;,
      name: &apos;Perfect Prophet&apos;,
      description: &apos;Get every prediction correct in a single week&apos;,
      icon: &apos;🌟&apos;,
      tier: &apos;platinum&apos;,
      requirement: { type: &apos;perfect_week&apos;, value: 1, timeframe: &apos;week&apos; }
    }
  ];

  /**
   * Calculate points for a user&apos;s prediction
   */
  calculateScore(
    submission: ChallengeSubmission,
    result: ChallengeResult,
    currentStreak: number
  ): ScoringResult {
}
    const wasCorrect = submission.userChoice === result.correctAnswer;
    const beatOracle = wasCorrect && submission.userChoice !== result.oracleChoice;
    
    // Base points
    const basePoints = wasCorrect ? this.basePoints.correct : this.basePoints.incorrect;
    
    // Confidence bonus (only for correct predictions)
    const confidenceBonus = wasCorrect ? this.calculateConfidenceBonus(submission.confidence, basePoints) : 0;
    
    // Oracle beat bonus
    const oracleBeatBonus = beatOracle ? this.oracleBeatBonus : 0;
    
    // Streak multiplier (only for correct predictions)
    const newStreak = wasCorrect ? currentStreak + 1 : 0;
    const streakMultiplier = wasCorrect ? this.calculateStreakMultiplier(newStreak) : 1;
    
    // Calculate total points
    const pointsBeforeStreak = basePoints + confidenceBonus + oracleBeatBonus;
    const totalPoints = Math.round(pointsBeforeStreak * streakMultiplier);

    return {
}
      userId: submission.userId,
      predictionId: submission.predictionId,
      basePoints,
      confidenceBonus,
      oracleBeatBonus,
      streakMultiplier,
      totalPoints,
      wasCorrect,
      beatOracle,
//       newStreak
    };
  }

  /**
   * Calculate confidence bonus based on user&apos;s confidence level
   */
  private calculateConfidenceBonus(confidence: number, basePoints: number): number {
}
    if (confidence >= 90) return basePoints * (this.confidenceMultipliers[90] - 1);
    if (confidence >= 80) return basePoints * (this.confidenceMultipliers[80] - 1);
    if (confidence >= 70) return basePoints * (this.confidenceMultipliers[70] - 1);
    if (confidence >= 60) return basePoints * (this.confidenceMultipliers[60] - 1);
    return 0;
  }

  /**
   * Calculate streak multiplier based on current streak
   */
  private calculateStreakMultiplier(streak: number): number {
}
    if (streak >= 15) return this.streakMultipliers[15];
    if (streak >= 10) return this.streakMultipliers[10];
    if (streak >= 7) return this.streakMultipliers[7];
    if (streak >= 5) return this.streakMultipliers[5];
    if (streak >= 3) return this.streakMultipliers[3];
    return this.streakMultipliers[0];
  }

  /**
   * Calculate user&apos;s overall score and stats
   */
  calculateUserScore(userId: string, allScores: ScoringResult[]): UserScore {
}
    const userScores = allScores.filter((score: any) => score.userId === userId);
    
    if (userScores.length === 0) {
}
      return {
}
        userId,
        totalPoints: 0,
        correctPredictions: 0,
        totalPredictions: 0,
        accuracy: 0,
        oracleBeats: 0,
        currentStreak: 0,
        longestStreak: 0,
        rank: 0,
        level: 1
      };
    }

    const totalPoints = userScores.reduce((sum, score) => sum + score.totalPoints, 0);
    const correctPredictions = userScores.filter((score: any) => score.wasCorrect).length;
    const totalPredictions = userScores.length;
    const accuracy = totalPredictions > 0 ? (correctPredictions / totalPredictions) * 100 : 0;
    const oracleBeats = userScores.filter((score: any) => score.beatOracle).length;
    
    // Calculate streaks
    const { currentStreak, longestStreak } = this.calculateStreaks(userScores);
    
    // Calculate level (every 500 points = 1 level)
    const level = Math.floor(totalPoints / 500) + 1;

    return {
}
      userId,
      totalPoints,
      correctPredictions,
      totalPredictions,
      accuracy: Math.round(accuracy * 10) / 10,
      oracleBeats,
      currentStreak,
      longestStreak,
      rank: 0, // Will be set when calculating leaderboard
//       level
    };
  }

  /**
   * Calculate current and longest streaks
   */
  private calculateStreaks(scores: ScoringResult[]): { currentStreak: number; longestStreak: number } {
}
    if (scores.length === 0) return { currentStreak: 0, longestStreak: 0 };

    // Sort by prediction date (assuming predictionId contains timestamp info)
    const sortedScores = [...scores].sort((a, b) => a.predictionId.localeCompare(b.predictionId));
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Calculate current streak (from the end)
    for (let i = sortedScores.length - 1; i >= 0; i--) {
}
      if (sortedScores[i].wasCorrect) {
}
        currentStreak++;
      } else {
}
        break;
      }
    }

    // Calculate longest streak
    for (const score of sortedScores) {
}
      if (score.wasCorrect) {
}
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
}
        tempStreak = 0;
      }
    }

    return { currentStreak, longestStreak };
  }

  /**
   * Generate leaderboard with rankings
   */
  generateLeaderboard(allScores: ScoringResult[]): UserScore[] {
}
    const userIds = [...new Set(allScores.map((score: any) => score.userId))];
    const userScores = userIds.map((userId: any) => this.calculateUserScore(userId, allScores));
    
    // Sort by total points (descending)
    userScores.sort((a, b) => b.totalPoints - a.totalPoints);
    
    // Assign ranks
    userScores.forEach((score, index) => {
}
      score.rank = index + 1;
    });

    return userScores;
  }

  /**
   * Check for newly earned achievements
   */
  checkAchievements(userScore: UserScore, previousUserScore?: UserScore): Achievement[] {
}
    const newAchievements: Achievement[] = [];

    for (const achievement of this.achievements) {
}
      // Skip if already earned
      if (previousUserScore && this.hasEarnedAchievement(achievement, previousUserScore)) {
}
        continue;
      }

      // Check if newly earned
      if (this.hasEarnedAchievement(achievement, userScore)) {
}
        newAchievements.push(achievement);
      }
    }

    return newAchievements;
  }

  /**
   * Check if user has earned a specific achievement
   */
  private hasEarnedAchievement(achievement: Achievement, userScore: UserScore): boolean {
}
    const { type, value } = achievement.requirement;

    switch (type) {
}
      case &apos;prediction_count&apos;:
        return userScore.totalPredictions >= value;
      case &apos;accuracy&apos;:
        return userScore.totalPredictions >= 20 && userScore.accuracy >= value;
      case &apos;streak&apos;:
        return userScore.longestStreak >= value;
      case &apos;oracle_beats&apos;:
        return userScore.oracleBeats >= value;
      case &apos;points&apos;:
        return userScore.totalPoints >= value;
      case &apos;perfect_week&apos;: {
}
        // Enhanced implementation: check if user has had a perfect week
        // This checks if user has achieved 100% accuracy in any week with at least 5 predictions
        const hasHadPerfectWeek = userScore.totalPredictions >= 5 && 
                                 userScore.accuracy >= 100 && 
                                 userScore.longestStreak >= 5;
        return hasHadPerfectWeek;
      }
      default:
        return false;
    }
  }

  /**
   * Get all available achievements
   */
  getAchievements(): Achievement[] {
}
    return [...this.achievements];
  }

  /**
   * Get achievements by tier
   */
  getAchievementsByTier(tier: Achievement[&apos;tier&apos;]): Achievement[] {
}
    return this.achievements.filter((achievement: any) => achievement.tier === tier);
  }

  /**
   * Calculate weekly performance with enhanced week filtering
   */
  calculateWeeklyPerformance(userId: string, week: number, allScores: ScoringResult[]): {
}
    weeklyPoints: number;
    weeklyAccuracy: number;
    weeklyPredictions: number;
    weeklyCorrect: number;
    perfectWeek: boolean;
  } {
}
    // Enhanced week filtering: filter by actual week data or prediction metadata
    const weeklyScores = allScores.filter((score: any) => {
}
      if (score.userId !== userId) return false;
      
      // Try multiple approaches to identify week-specific predictions
      if (score.predictionId.includes(`week${week}`) || 
          score.predictionId.includes(`w${week}-`) ||
          score.predictionId.includes(`-${week}-`) ||
          score.predictionId.includes(`_${week}_`)) {
}
        return true;
      }
      
      return false;
    });

    const weeklyPoints = weeklyScores.reduce((sum, score) => sum + score.totalPoints, 0);
    const weeklyPredictions = weeklyScores.length;
    const weeklyCorrect = weeklyScores.filter((score: any) => score.wasCorrect).length;
    const weeklyAccuracy = weeklyPredictions > 0 ? (weeklyCorrect / weeklyPredictions) * 100 : 0;
    const perfectWeek = weeklyPredictions >= 3 && weeklyCorrect === weeklyPredictions;

    return {
}
      weeklyPoints,
      weeklyAccuracy: Math.round(weeklyAccuracy * 10) / 10,
      weeklyPredictions,
      weeklyCorrect,
//       perfectWeek
    };
  }

  /**
   * Calculate advanced streak bonus with decay resistance
   * Enhanced streak calculation that considers confidence and Oracle-beating
   */
  calculateAdvancedStreakBonus(currentStreak: number, confidence: number, beatOracle: boolean): number {
}
    const baseStreakMultiplier = this.calculateStreakMultiplier(currentStreak);
    
    // Additional bonuses for high-confidence correct predictions
    let confidenceBonus = 1;
    if (confidence >= 90) confidenceBonus = 1.2;
    else if (confidence >= 80) confidenceBonus = 1.1;
    else if (confidence >= 70) confidenceBonus = 1.05;
    
    // Extra bonus for beating Oracle during a streak
    const oracleStreakBonus = beatOracle ? 1.15 : 1;
    
    // Streak decay resistance: longer streaks are more valuable
    let decayResistance = 1;
    if (currentStreak >= 10) {
}
      decayResistance = 1.1;
    } else if (currentStreak >= 7) {
}
      decayResistance = 1.05;
    }
    
    return baseStreakMultiplier * confidenceBonus * oracleStreakBonus * decayResistance;
  }

  /**
   * Calculate prediction difficulty modifier
   * Predictions with lower Oracle confidence should be worth more points
   */
  calculateDifficultyModifier(oracleConfidence: number): number {
}
    // Higher difficulty (lower Oracle confidence) = higher multiplier
    if (oracleConfidence < 60) return 1.5;        // Very uncertain Oracle
    if (oracleConfidence < 70) return 1.3;        // Moderately uncertain
    if (oracleConfidence < 80) return 1.2;        // Somewhat uncertain
    if (oracleConfidence < 90) return 1.1;        // Slightly uncertain
    return 1.0;                                   // Confident Oracle
  }

  /**
   * Calculate season-long performance trends
   * Analyze user improvement over time
   */
  calculatePerformanceTrends(userId: string, allScores: ScoringResult[]): {
}
    earlySeasonAccuracy: number;
    recentAccuracy: number;
    improvementTrend: &apos;improving&apos; | &apos;declining&apos; | &apos;stable&apos;;
    consistencyScore: number;
  } {
}
    const userScores = allScores.filter((score: any) => score.userId === userId);
    
    if (userScores.length < 10) {
}
      return {
}
        earlySeasonAccuracy: 0,
        recentAccuracy: 0,
        improvementTrend: &apos;stable&apos;,
        consistencyScore: 0
      };
    }
    
    // Split into early and recent performance
    const splitPoint = Math.floor(userScores.length / 2);
    const earlyScores = userScores.slice(0, splitPoint);
    const recentScores = userScores.slice(splitPoint);
    
    const earlyCorrect = earlyScores.filter((s: any) => s.wasCorrect).length;
    const recentCorrect = recentScores.filter((s: any) => s.wasCorrect).length;
    
    const earlySeasonAccuracy = (earlyCorrect / earlyScores.length) * 100;
    const recentAccuracy = (recentCorrect / recentScores.length) * 100;
    
    // Determine trend
    const accuracyDiff = recentAccuracy - earlySeasonAccuracy;
    let improvementTrend: &apos;improving&apos; | &apos;declining&apos; | &apos;stable&apos;;
    if (accuracyDiff > 5) improvementTrend = &apos;improving&apos;;
    else if (accuracyDiff < -5) improvementTrend = &apos;declining&apos;;
    else improvementTrend = &apos;stable&apos;;
    
    // Calculate consistency (lower variance = higher consistency)
    const accuracies = [earlySeasonAccuracy, recentAccuracy];
    const avgAccuracy = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
    const variance = accuracies.reduce((acc, acc_curr) => acc + Math.pow(acc_curr - avgAccuracy, 2), 0) / accuracies.length;
    const consistencyScore = Math.max(0, 100 - variance);
    
    return {
}
      earlySeasonAccuracy: Math.round(earlySeasonAccuracy * 10) / 10,
      recentAccuracy: Math.round(recentAccuracy * 10) / 10,
      improvementTrend,
      consistencyScore: Math.round(consistencyScore * 10) / 10
    };
  }
}

// Export singleton instance
export const oracleScoringService = new OracleScoringService();
export default oracleScoringService;
