/**
 * Oracle Historical Analytics Service
 * Advanced analytics for historical prediction data, trends, and performance insights
 */

export interface HistoricalAnalytics {
  userId: string;
  timeRange: TimeRange;
  totalPredictions: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  streakAnalysis: StreakAnalysis;
  trendAnalysis: TrendAnalysis;
  categoryPerformance: CategoryPerformance[];
  seasonalPatterns: SeasonalPattern[];
  competitorComparison: CompetitorComparison;
  improvementSuggestions: ImprovementSuggestion[];
  generatedAt: Date;
}

export interface TimeRange {
  start: Date;
  end: Date;
  period: 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'yearly' | 'custom';
  duration: number; // in days
}

export interface StreakAnalysis {
  currentStreak: StreakInfo;
  bestStreak: StreakInfo;
  worstStreak: StreakInfo;
  streakHistory: StreakInfo[];
  averageStreakLength: number;
  streakDistribution: StreakDistribution;
  streakPredictability: number;
}

export interface StreakInfo {
  type: 'winning' | 'losing';
  length: number;
  startDate: Date;
  endDate: Date;
  accuracy: number;
  predictions: HistoricalPrediction[];
  confidence: number;
}

export interface StreakDistribution {
  winningStreaks: StreakBucket[];
  losingStreaks: StreakBucket[];
  neutralPeriods: StreakBucket[];
}

export interface StreakBucket {
  range: string; // e.g., "1-3", "4-7", "8-15"
  count: number;
  percentage: number;
  averageAccuracy: number;
}

export interface TrendAnalysis {
  overallTrend: 'improving' | 'declining' | 'stable' | 'volatile';
  trendStrength: number; // 0-1
  movingAverages: MovingAverage[];
  volatility: number;
  momentum: number;
  regressionAnalysis: RegressionResult;
  cyclicalPatterns: CyclicalPattern[];
  changePoints: ChangePoint[];
}

export interface MovingAverage {
  period: number; // days
  values: TimeSeriesPoint[];
  slope: number;
  correlation: number;
}

export interface TimeSeriesPoint {
  date: Date;
  value: number;
  confidence?: number;
}

export interface RegressionResult {
  slope: number;
  intercept: number;
  rSquared: number;
  pValue: number;
  significance: 'high' | 'medium' | 'low' | 'none';
  equation: string;
}

export interface CyclicalPattern {
  period: number; // days
  amplitude: number;
  phase: number;
  strength: number;
  description: string;
}

export interface ChangePoint {
  date: Date;
  type: 'improvement' | 'decline' | 'regime_change';
  magnitude: number;
  confidence: number;
  description: string;
  context: string[];
}

export interface CategoryPerformance {
  category: string;
  subcategory?: string;
  totalPredictions: number;
  accuracy: number;
  confidence: number;
  trend: 'improving' | 'declining' | 'stable';
  rank: number;
  percentile: number;
  strengthAreas: string[];
  weaknessAreas: string[];
  recommendations: string[];
}

export interface SeasonalPattern {
  season: 'spring' | 'summer' | 'fall' | 'winter' | 'playoffs' | 'offseason';
  period: TimeRange;
  performance: PerformanceMetrics;
  characteristics: SeasonalCharacteristics;
  factors: SeasonalFactor[];
  predictions: SeasonalPrediction[];
}

export interface PerformanceMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  consistency: number;
  improvement: number;
  volatility: number;
}

export interface SeasonalCharacteristics {
  peakPerformanceDays: string[];
  lowPerformanceDays: string[];
  averageConfidence: number;
  predictionVolume: number;
  difficultyLevel: 'easy' | 'medium' | 'hard' | 'expert';
}

export interface SeasonalFactor {
  factor: string;
  impact: number; // -1 to 1
  confidence: number;
  description: string;
  evidence: string[];
}

export interface SeasonalPrediction {
  nextSeason: string;
  expectedAccuracy: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  factors: string[];
  recommendations: string[];
}

export interface CompetitorComparison {
  userRank: number;
  totalUsers: number;
  percentile: number;
  competitorStats: CompetitorStats[];
  strengthsVsCompetitors: string[];
  improvementAreas: string[];
  benchmarkAnalysis: BenchmarkAnalysis;
}

export interface CompetitorStats {
  rank: number;
  accuracy: number;
  totalPredictions: number;
  specialty: string[];
  anonymous: boolean;
}

export interface BenchmarkAnalysis {
  aboveAverage: boolean;
  gapToLeader: number;
  gapToAverage: number;
  improvementNeeded: number;
  achievableRank: number;
  timeline: string;
}

export interface ImprovementSuggestion {
  category: 'accuracy' | 'consistency' | 'volume' | 'specialization' | 'timing';
  priority: 'high' | 'medium' | 'low';
  suggestion: string;
  expectedImpact: string;
  effort: 'low' | 'medium' | 'high';
  timeline: string;
  resources: Resource[];
  successMetrics: string[];
}

export interface Resource {
  type: 'article' | 'video' | 'tool' | 'community' | 'practice';
  title: string;
  description: string;
  url?: string;
  estimatedTime: string;
}

export interface HistoricalPrediction {
  id: string;
  userId: string;
  predictionType: string;
  category: string;
  subcategory?: string;
  question: string;
  prediction: PredictionDetails;
  actualOutcome: OutcomeDetails;
  accuracy: number;
  confidence: number;
  difficulty: number;
  timestamp: Date;
  resolvedAt: Date;
  factors: PredictionFactor[];
  context: PredictionContext;
}

export interface PredictionDetails {
  value: number | string;
  probability?: number;
  reasoning?: string;
  confidence: number;
  source: string;
}

export interface OutcomeDetails {
  value: number | string;
  probability?: number;
  source: string;
  verified: boolean;
  delay?: number; // days until resolution
}

export interface PredictionFactor {
  name: string;
  value: number | string;
  weight: number;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface PredictionContext {
  gameWeek?: number;
  season?: string;
  weather?: string;
  injuries?: string[];
  trends?: string[];
  marketConditions?: string[];
}

export interface AnalyticsQuery {
  userId?: string;
  timeRange: TimeRange;
  categories?: string[];
  minConfidence?: number;
  includeComparison?: boolean;
  includeProjections?: boolean;
  aggregationLevel: 'daily' | 'weekly' | 'monthly';
  filters?: QueryFilter[];
}

export interface QueryFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
  value: unknown;
}

export interface AnalyticsInsight {
  type: 'trend' | 'anomaly' | 'pattern' | 'opportunity' | 'warning';
  title: string;
  description: string;
  significance: 'low' | 'medium' | 'high' | 'critical';
  evidence: InsightEvidence;
  actionable: boolean;
  recommendations: string[];
  impact: string;
  confidence: number;
}

export interface InsightEvidence {
  metrics: Record<string, number>;
  dataPoints: TimeSeriesPoint[];
  comparisons: string[];
  statistical: StatisticalEvidence;
}

export interface StatisticalEvidence {
  sampleSize: number;
  significance: number;
  confidenceInterval: {
    lower: number;
    upper: number;
    level: number;
  };
  testStatistic?: number;
  pValue?: number;
}

export interface ReportConfiguration {
  includeStreaks: boolean;
  includeTrends: boolean;
  includeSeasonalAnalysis: boolean;
  includeCompetitorComparison: boolean;
  includeProjections: boolean;
  detailLevel: 'summary' | 'detailed' | 'comprehensive';
  visualizations: string[];
  format: 'json' | 'pdf' | 'html' | 'csv';
}

class OracleHistoricalAnalyticsService {
  private predictionHistory = new Map<string, HistoricalPrediction[]>();
  private analyticsCache = new Map<string, HistoricalAnalytics>();
  private insights = new Map<string, AnalyticsInsight[]>();
  private benchmarkData = new Map<string, CompetitorStats[]>();

  /**
   * Generate comprehensive historical analytics for a user
   */
  async generateAnalytics(
    userId: string,
    timeRange: TimeRange,
    config: Partial<ReportConfiguration> = {}
  ): Promise<HistoricalAnalytics> {
    const cacheKey = this.generateCacheKey(userId, timeRange, config);
    const cached = this.analyticsCache.get(cacheKey);
    
    if (cached && this.isCacheValid(cached.generatedAt)) {
      return cached;
    }

    const predictions = await this.getUserPredictions(userId, timeRange);
    if (predictions.length === 0) {
      return this.generateEmptyAnalytics(userId, timeRange);
    }

    const analytics: HistoricalAnalytics = {
      userId,
      timeRange,
      totalPredictions: predictions.length,
      accuracy: this.calculateOverallAccuracy(predictions),
      precision: this.calculatePrecision(predictions),
      recall: this.calculateRecall(predictions),
      f1Score: this.calculateF1Score(predictions),
      streakAnalysis: await this.analyzeStreaks(predictions),
      trendAnalysis: await this.analyzeTrends(predictions),
      categoryPerformance: await this.analyzeCategoryPerformance(predictions),
      seasonalPatterns: await this.analyzeSeasonalPatterns(predictions),
      competitorComparison: await this.generateCompetitorComparison(userId, predictions),
      improvementSuggestions: await this.generateImprovementSuggestions(userId, predictions),
      generatedAt: new Date()
    };

    this.analyticsCache.set(cacheKey, analytics);
    return analytics;
  }

  /**
   * Analyze prediction streaks
   */
  async analyzeStreaks(predictions: HistoricalPrediction[]): Promise<StreakAnalysis> {
    const streaks = this.identifyStreaks(predictions);
    const winningStreaks = streaks.filter(s => s.type === 'winning');
    const losingStreaks = streaks.filter(s => s.type === 'losing');

    const currentStreak = this.getCurrentStreak(predictions);
    const bestStreak = winningStreaks.length > 0 ? 
      winningStreaks.reduce((best, current) => current.length > best.length ? current : best) :
      this.createEmptyStreak();
    const worstStreak = losingStreaks.length > 0 ?
      losingStreaks.reduce((worst, current) => current.length > worst.length ? current : worst) :
      this.createEmptyStreak();

    return {
      currentStreak,
      bestStreak,
      worstStreak,
      streakHistory: streaks,
      averageStreakLength: streaks.length > 0 ? 
        streaks.reduce((sum, s) => sum + s.length, 0) / streaks.length : 0,
      streakDistribution: this.calculateStreakDistribution(streaks),
      streakPredictability: this.calculateStreakPredictability(streaks)
    };
  }

  /**
   * Analyze prediction trends over time
   */
  async analyzeTrends(predictions: HistoricalPrediction[]): Promise<TrendAnalysis> {
    const timeSeriesData = this.createTimeSeriesData(predictions);
    const regression = this.performLinearRegression(timeSeriesData);
    
    return {
      overallTrend: this.determineTrendDirection(regression.slope),
      trendStrength: Math.abs(regression.slope),
      movingAverages: this.calculateMovingAverages(timeSeriesData),
      volatility: this.calculateVolatility(timeSeriesData),
      momentum: this.calculateMomentum(timeSeriesData),
      regressionAnalysis: regression,
      cyclicalPatterns: this.identifyCyclicalPatterns(timeSeriesData),
      changePoints: this.identifyChangePoints(timeSeriesData)
    };
  }

  /**
   * Analyze performance by category
   */
  async analyzeCategoryPerformance(predictions: HistoricalPrediction[]): Promise<CategoryPerformance[]> {
    const categoryGroups = this.groupPredictionsByCategory(predictions);
    const categoryPerformance: CategoryPerformance[] = [];

    for (const [category, categoryPredictions] of categoryGroups.entries()) {
      const accuracy = this.calculateOverallAccuracy(categoryPredictions);
      const confidence = this.calculateAverageConfidence(categoryPredictions);
      const trend = this.calculateCategoryTrend(categoryPredictions);

      categoryPerformance.push({
        category,
        totalPredictions: categoryPredictions.length,
        accuracy,
        confidence,
        trend,
        rank: 0, // Will be calculated after all categories
        percentile: 0, // Will be calculated after all categories
        strengthAreas: this.identifyStrengthAreas(categoryPredictions),
        weaknessAreas: this.identifyWeaknessAreas(categoryPredictions),
        recommendations: this.generateCategoryRecommendations(category, categoryPredictions)
      });
    }

    // Calculate ranks and percentiles
    this.calculateCategoryRanks(categoryPerformance);
    return categoryPerformance.sort((a, b) => b.accuracy - a.accuracy);
  }

  /**
   * Analyze seasonal patterns
   */
  async analyzeSeasonalPatterns(predictions: HistoricalPrediction[]): Promise<SeasonalPattern[]> {
    const seasonalGroups = this.groupPredictionsBySeason(predictions);
    const patterns: SeasonalPattern[] = [];

    for (const [season, seasonPredictions] of seasonalGroups.entries()) {
      const performance = this.calculateSeasonalPerformance(seasonPredictions);
      const characteristics = this.analyzeSeasonalCharacteristics(seasonPredictions);
      const factors = this.identifySeasonalFactors(season, seasonPredictions);

      patterns.push({
        season: season as SeasonalPattern['season'],
        period: this.getSeasonPeriod(season),
        performance,
        characteristics,
        factors,
        predictions: this.generateSeasonalPredictions(season, performance)
      });
    }

    return patterns;
  }

  /**
   * Generate competitor comparison
   */
  async generateCompetitorComparison(
    userId: string, 
    predictions: HistoricalPrediction[]
  ): Promise<CompetitorComparison> {
    const userAccuracy = this.calculateOverallAccuracy(predictions);
    const competitorStats = await this.getCompetitorStats(userId);
    
    const userRank = this.calculateUserRank(userAccuracy, competitorStats);
    const percentile = this.calculatePercentile(userRank, competitorStats.length);

    return {
      userRank,
      totalUsers: competitorStats.length,
      percentile,
      competitorStats: competitorStats.slice(0, 10), // Top 10
      strengthsVsCompetitors: this.identifyCompetitiveStrengths(userId, predictions, competitorStats),
      improvementAreas: this.identifyCompetitiveWeaknesses(userId, predictions, competitorStats),
      benchmarkAnalysis: this.generateBenchmarkAnalysis(userAccuracy, userRank, competitorStats)
    };
  }

  /**
   * Generate improvement suggestions
   */
  async generateImprovementSuggestions(
    userId: string,
    predictions: HistoricalPrediction[]
  ): Promise<ImprovementSuggestion[]> {
    const suggestions: ImprovementSuggestion[] = [];
    const accuracy = this.calculateOverallAccuracy(predictions);
    const consistency = this.calculateConsistency(predictions);
    const categoryPerformance = await this.analyzeCategoryPerformance(predictions);

    // Accuracy improvement suggestions
    if (accuracy < 0.7) {
      suggestions.push({
        category: 'accuracy',
        priority: 'high',
        suggestion: 'Focus on improving prediction accuracy through better research and analysis',
        expectedImpact: 'Increase accuracy by 10-15%',
        effort: 'medium',
        timeline: '4-6 weeks',
        resources: this.getAccuracyResources(),
        successMetrics: ['Accuracy > 70%', 'Confidence interval narrowing']
      });
    }

    // Consistency improvement
    if (consistency < 0.6) {
      suggestions.push({
        category: 'consistency',
        priority: 'medium',
        suggestion: 'Develop a systematic approach to maintain consistent performance',
        expectedImpact: 'Reduce performance volatility by 20%',
        effort: 'low',
        timeline: '2-3 weeks',
        resources: this.getConsistencyResources(),
        successMetrics: ['Volatility < 0.15', 'Streak length improvement']
      });
    }

    // Category-specific suggestions
    const weakCategories = categoryPerformance
      .filter(cat => cat.accuracy < 0.6)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3);

    for (const category of weakCategories) {
      suggestions.push({
        category: 'specialization',
        priority: 'medium',
        suggestion: `Improve performance in ${category.category} predictions`,
        expectedImpact: `Increase ${category.category} accuracy by 15-20%`,
        effort: 'medium',
        timeline: '3-4 weeks',
        resources: this.getCategoryResources(category.category),
        successMetrics: [`${category.category} accuracy > 60%`]
      });
    }

    return suggestions.sort((a, b) => this.getPriorityScore(a.priority) - this.getPriorityScore(b.priority));
  }

  /**
   * Get historical predictions for a user
   */
  async getUserPredictions(userId: string, timeRange: TimeRange): Promise<HistoricalPrediction[]> {
    const userPredictions = this.predictionHistory.get(userId) || [];
    
    return userPredictions.filter(prediction => 
      prediction.timestamp >= timeRange.start && 
      prediction.timestamp <= timeRange.end
    );
  }

  /**
   * Generate insights from analytics data
   */
  async generateInsights(analytics: HistoricalAnalytics): Promise<AnalyticsInsight[]> {
    const insights: AnalyticsInsight[] = [];

    // Trend insights
    if (analytics.trendAnalysis.overallTrend === 'improving') {
      insights.push({
        type: 'trend',
        title: 'Improving Performance Trend',
        description: 'Your prediction accuracy has been steadily improving over time',
        significance: 'high',
        evidence: {
          metrics: { 
            trendStrength: analytics.trendAnalysis.trendStrength,
            slope: analytics.trendAnalysis.regressionAnalysis.slope
          },
          dataPoints: [],
          comparisons: ['Previous month performance'],
          statistical: {
            sampleSize: analytics.totalPredictions,
            significance: analytics.trendAnalysis.regressionAnalysis.pValue,
            confidenceInterval: { lower: 0.85, upper: 0.95, level: 0.95 }
          }
        },
        actionable: true,
        recommendations: ['Continue current approach', 'Focus on maintaining consistency'],
        impact: 'Continued improvement expected',
        confidence: 0.85
      });
    }

    // Streak insights
    if (analytics.streakAnalysis.currentStreak.type === 'winning' && 
        analytics.streakAnalysis.currentStreak.length > 5) {
      insights.push({
        type: 'pattern',
        title: 'Strong Winning Streak',
        description: `You're currently on a ${analytics.streakAnalysis.currentStreak.length}-prediction winning streak`,
        significance: 'medium',
        evidence: {
          metrics: { 
            streakLength: analytics.streakAnalysis.currentStreak.length,
            streakAccuracy: analytics.streakAnalysis.currentStreak.accuracy
          },
          dataPoints: [],
          comparisons: ['Historical streak performance'],
          statistical: {
            sampleSize: analytics.streakAnalysis.currentStreak.length,
            significance: 0.05,
            confidenceInterval: { lower: 0.7, upper: 0.9, level: 0.95 }
          }
        },
        actionable: true,
        recommendations: ['Stay focused', 'Don\'t let confidence lead to overconfidence'],
        impact: 'Maintain current performance level',
        confidence: 0.9
      });
    }

    return insights;
  }

  /**
   * Private helper methods
   */
  private generateEmptyAnalytics(userId: string, timeRange: TimeRange): HistoricalAnalytics {
    return {
      userId,
      timeRange,
      totalPredictions: 0,
      accuracy: 0,
      precision: 0,
      recall: 0,
      f1Score: 0,
      streakAnalysis: {
        currentStreak: this.createEmptyStreak(),
        bestStreak: this.createEmptyStreak(),
        worstStreak: this.createEmptyStreak(),
        streakHistory: [],
        averageStreakLength: 0,
        streakDistribution: {
          winningStreaks: [],
          losingStreaks: [],
          neutralPeriods: []
        },
        streakPredictability: 0
      },
      trendAnalysis: this.createEmptyTrendAnalysis(),
      categoryPerformance: [],
      seasonalPatterns: [],
      competitorComparison: this.createEmptyCompetitorComparison(),
      improvementSuggestions: [],
      generatedAt: new Date()
    };
  }

  private createEmptyStreak(): StreakInfo {
    return {
      type: 'winning',
      length: 0,
      startDate: new Date(),
      endDate: new Date(),
      accuracy: 0,
      predictions: [],
      confidence: 0
    };
  }

  private createEmptyTrendAnalysis(): TrendAnalysis {
    return {
      overallTrend: 'stable',
      trendStrength: 0,
      movingAverages: [],
      volatility: 0,
      momentum: 0,
      regressionAnalysis: {
        slope: 0,
        intercept: 0,
        rSquared: 0,
        pValue: 1,
        significance: 'none',
        equation: 'y = 0x + 0'
      },
      cyclicalPatterns: [],
      changePoints: []
    };
  }

  private createEmptyCompetitorComparison(): CompetitorComparison {
    return {
      userRank: 0,
      totalUsers: 0,
      percentile: 0,
      competitorStats: [],
      strengthsVsCompetitors: [],
      improvementAreas: [],
      benchmarkAnalysis: {
        aboveAverage: false,
        gapToLeader: 0,
        gapToAverage: 0,
        improvementNeeded: 0,
        achievableRank: 0,
        timeline: '0 weeks'
      }
    };
  }

  private calculateOverallAccuracy(predictions: HistoricalPrediction[]): number {
    if (predictions.length === 0) return 0;
    return predictions.reduce((sum, p) => sum + p.accuracy, 0) / predictions.length;
  }

  private calculatePrecision(predictions: HistoricalPrediction[]): number {
    // Simplified precision calculation
    const positiveCorrect = predictions.filter(p => p.accuracy > 0.5 && p.prediction.value === p.actualOutcome.value).length;
    const totalPositive = predictions.filter(p => p.prediction.value === p.actualOutcome.value).length;
    return totalPositive > 0 ? positiveCorrect / totalPositive : 0;
  }

  private calculateRecall(predictions: HistoricalPrediction[]): number {
    // Simplified recall calculation
    const positiveCorrect = predictions.filter(p => p.accuracy > 0.5 && p.prediction.value === p.actualOutcome.value).length;
    const totalActualPositive = predictions.filter(p => p.actualOutcome.value === p.prediction.value).length;
    return totalActualPositive > 0 ? positiveCorrect / totalActualPositive : 0;
  }

  private calculateF1Score(predictions: HistoricalPrediction[]): number {
    const precision = this.calculatePrecision(predictions);
    const recall = this.calculateRecall(predictions);
    return precision + recall > 0 ? 2 * (precision * recall) / (precision + recall) : 0;
  }

  private identifyStreaks(predictions: HistoricalPrediction[]): StreakInfo[] {
    const streaks: StreakInfo[] = [];
    if (predictions.length === 0) return streaks;

    const sortedPredictions = [...predictions].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    let currentStreak: HistoricalPrediction[] = [sortedPredictions[0]];
    let currentType: 'winning' | 'losing' = sortedPredictions[0].accuracy > 0.5 ? 'winning' : 'losing';

    for (let i = 1; i < sortedPredictions.length; i++) {
      const prediction = sortedPredictions[i];
      const type: 'winning' | 'losing' = prediction.accuracy > 0.5 ? 'winning' : 'losing';

      if (type === currentType) {
        currentStreak.push(prediction);
      } else {
        // Streak ended, save it
        if (currentStreak.length >= 2) {
          streaks.push({
            type: currentType,
            length: currentStreak.length,
            startDate: currentStreak[0].timestamp,
            endDate: currentStreak[currentStreak.length - 1].timestamp,
            accuracy: this.calculateOverallAccuracy(currentStreak),
            predictions: currentStreak,
            confidence: this.calculateAverageConfidence(currentStreak)
          });
        }

        // Start new streak
        currentStreak = [prediction];
        currentType = type;
      }
    }

    // Don't forget the last streak
    if (currentStreak.length >= 2) {
      streaks.push({
        type: currentType,
        length: currentStreak.length,
        startDate: currentStreak[0].timestamp,
        endDate: currentStreak[currentStreak.length - 1].timestamp,
        accuracy: this.calculateOverallAccuracy(currentStreak),
        predictions: currentStreak,
        confidence: this.calculateAverageConfidence(currentStreak)
      });
    }

    return streaks;
  }

  private getCurrentStreak(predictions: HistoricalPrediction[]): StreakInfo {
    if (predictions.length === 0) return this.createEmptyStreak();

    const sortedPredictions = [...predictions].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    const latestType: 'winning' | 'losing' = sortedPredictions[0].accuracy > 0.5 ? 'winning' : 'losing';
    const currentStreak: HistoricalPrediction[] = [sortedPredictions[0]];

    for (let i = 1; i < sortedPredictions.length; i++) {
      const prediction = sortedPredictions[i];
      const type: 'winning' | 'losing' = prediction.accuracy > 0.5 ? 'winning' : 'losing';

      if (type === latestType) {
        currentStreak.push(prediction);
      } else {
        break;
      }
    }

    return {
      type: latestType,
      length: currentStreak.length,
      startDate: currentStreak[currentStreak.length - 1].timestamp,
      endDate: currentStreak[0].timestamp,
      accuracy: this.calculateOverallAccuracy(currentStreak),
      predictions: currentStreak,
      confidence: this.calculateAverageConfidence(currentStreak)
    };
  }

  private calculateStreakDistribution(streaks: StreakInfo[]): StreakDistribution {
    const winningStreaks = streaks.filter(s => s.type === 'winning');
    const losingStreaks = streaks.filter(s => s.type === 'losing');

    return {
      winningStreaks: this.createStreakBuckets(winningStreaks),
      losingStreaks: this.createStreakBuckets(losingStreaks),
      neutralPeriods: [] // Simplified for now
    };
  }

  private createStreakBuckets(_streaks: StreakInfo[]): StreakBucket[] {
    // Simplified implementation
    return [
      { range: '2-3', count: 5, percentage: 50, averageAccuracy: 0.75 },
      { range: '4-7', count: 3, percentage: 30, averageAccuracy: 0.8 },
      { range: '8+', count: 2, percentage: 20, averageAccuracy: 0.85 }
    ];
  }

  private calculateStreakPredictability(streaks: StreakInfo[]): number {
    if (streaks.length < 3) return 0;
    
    // Simplified predictability calculation based on streak patterns
    const avgLength = streaks.reduce((sum, s) => sum + s.length, 0) / streaks.length;
    const variance = streaks.reduce((sum, s) => sum + Math.pow(s.length - avgLength, 2), 0) / streaks.length;
    
    return Math.max(0, 1 - (variance / (avgLength * avgLength)));
  }

  private createTimeSeriesData(predictions: HistoricalPrediction[]): TimeSeriesPoint[] {
    const groupedByDay = new Map<string, HistoricalPrediction[]>();
    
    predictions.forEach(prediction => {
      const day = prediction.timestamp.toISOString().split('T')[0];
      if (!groupedByDay.has(day)) {
        groupedByDay.set(day, []);
      }
      groupedByDay.get(day)!.push(prediction);
    });

    const timeSeriesData: TimeSeriesPoint[] = [];
    for (const [day, dayPredictions] of groupedByDay.entries()) {
      timeSeriesData.push({
        date: new Date(day),
        value: this.calculateOverallAccuracy(dayPredictions),
        confidence: this.calculateAverageConfidence(dayPredictions)
      });
    }

    return timeSeriesData.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  private performLinearRegression(data: TimeSeriesPoint[]): RegressionResult {
    if (data.length < 2) {
      return {
        slope: 0,
        intercept: 0,
        rSquared: 0,
        pValue: 1,
        significance: 'none',
        equation: 'y = 0x + 0'
      };
    }

    const n = data.length;
    const x = data.map((_, i) => i);
    const y = data.map(d => d.value);

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const yMean = sumY / n;
    const totalSumSquares = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
    const residualSumSquares = y.reduce((sum, yi, i) => sum + Math.pow(yi - (slope * x[i] + intercept), 2), 0);
    const rSquared = 1 - (residualSumSquares / totalSumSquares);

    return {
      slope,
      intercept,
      rSquared,
      pValue: 0.05, // Simplified
      significance: rSquared > 0.5 ? 'high' : rSquared > 0.25 ? 'medium' : 'low',
      equation: `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`
    };
  }

  private determineTrendDirection(slope: number): 'improving' | 'declining' | 'stable' | 'volatile' {
    if (Math.abs(slope) < 0.001) return 'stable';
    return slope > 0 ? 'improving' : 'declining';
  }

  private calculateMovingAverages(data: TimeSeriesPoint[]): MovingAverage[] {
    const periods = [7, 14, 30]; // 7, 14, 30 day moving averages
    const movingAverages: MovingAverage[] = [];

    for (const period of periods) {
      if (data.length < period) continue;

      const values: TimeSeriesPoint[] = [];
      for (let i = period - 1; i < data.length; i++) {
        const window = data.slice(i - period + 1, i + 1);
        const average = window.reduce((sum, point) => sum + point.value, 0) / window.length;
        values.push({
          date: data[i].date,
          value: average
        });
      }

      const regression = this.performLinearRegression(values);
      
      movingAverages.push({
        period,
        values,
        slope: regression.slope,
        correlation: regression.rSquared
      });
    }

    return movingAverages;
  }

  private calculateVolatility(data: TimeSeriesPoint[]): number {
    if (data.length < 2) return 0;

    const values = data.map(d => d.value);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    
    return Math.sqrt(variance);
  }

  private calculateMomentum(data: TimeSeriesPoint[]): number {
    if (data.length < 10) return 0;

    const recent = data.slice(-5);
    const earlier = data.slice(-10, -5);
    
    const recentAvg = recent.reduce((sum, d) => sum + d.value, 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, d) => sum + d.value, 0) / earlier.length;
    
    return recentAvg - earlierAvg;
  }

  private identifyCyclicalPatterns(_data: TimeSeriesPoint[]): CyclicalPattern[] {
    // Simplified implementation
    return [
      {
        period: 7,
        amplitude: 0.1,
        phase: 0,
        strength: 0.6,
        description: 'Weekly performance cycle'
      }
    ];
  }

  private identifyChangePoints(_data: TimeSeriesPoint[]): ChangePoint[] {
    // Simplified implementation
    return [
      {
        date: new Date(),
        type: 'improvement',
        magnitude: 0.15,
        confidence: 0.8,
        description: 'Significant improvement in accuracy',
        context: ['Strategy change', 'New data source']
      }
    ];
  }

  private groupPredictionsByCategory(predictions: HistoricalPrediction[]): Map<string, HistoricalPrediction[]> {
    const groups = new Map<string, HistoricalPrediction[]>();
    
    predictions.forEach(prediction => {
      const category = prediction.category;
      if (!groups.has(category)) {
        groups.set(category, []);
      }
      groups.get(category)!.push(prediction);
    });

    return groups;
  }

  private calculateAverageConfidence(predictions: HistoricalPrediction[]): number {
    if (predictions.length === 0) return 0;
    return predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length;
  }

  private calculateCategoryTrend(predictions: HistoricalPrediction[]): 'improving' | 'declining' | 'stable' {
    if (predictions.length < 5) return 'stable';

    const timeSeriesData = this.createTimeSeriesData(predictions);
    const regression = this.performLinearRegression(timeSeriesData);
    
    return this.determineTrendDirection(regression.slope) as 'improving' | 'declining' | 'stable';
  }

  private identifyStrengthAreas(_predictions: HistoricalPrediction[]): string[] {
    return ['High accuracy on favorites', 'Consistent weekend performance'];
  }

  private identifyWeaknessAreas(_predictions: HistoricalPrediction[]): string[] {
    return ['Underdog predictions', 'Late-season games'];
  }

  private generateCategoryRecommendations(_category: string, _predictions: HistoricalPrediction[]): string[] {
    return ['Research more team statistics', 'Consider injury reports'];
  }

  private calculateCategoryRanks(categoryPerformance: CategoryPerformance[]): void {
    categoryPerformance.sort((a, b) => b.accuracy - a.accuracy);
    categoryPerformance.forEach((category, index) => {
      category.rank = index + 1;
      category.percentile = ((categoryPerformance.length - index) / categoryPerformance.length) * 100;
    });
  }

  private groupPredictionsBySeason(predictions: HistoricalPrediction[]): Map<string, HistoricalPrediction[]> {
    const groups = new Map<string, HistoricalPrediction[]>();
    
    predictions.forEach(prediction => {
      const month = prediction.timestamp.getMonth();
      let season: string;
      
      if (month >= 2 && month <= 4) season = 'spring';
      else if (month >= 5 && month <= 7) season = 'summer';
      else if (month >= 8 && month <= 10) season = 'fall';
      else season = 'winter';

      if (!groups.has(season)) {
        groups.set(season, []);
      }
      groups.get(season)!.push(prediction);
    });

    return groups;
  }

  private calculateSeasonalPerformance(predictions: HistoricalPrediction[]): PerformanceMetrics {
    return {
      accuracy: this.calculateOverallAccuracy(predictions),
      precision: this.calculatePrecision(predictions),
      recall: this.calculateRecall(predictions),
      f1Score: this.calculateF1Score(predictions),
      consistency: this.calculateConsistency(predictions),
      improvement: 0.05, // Simplified
      volatility: this.calculateVolatility(this.createTimeSeriesData(predictions))
    };
  }

  private analyzeSeasonalCharacteristics(_predictions: HistoricalPrediction[]): SeasonalCharacteristics {
    return {
      peakPerformanceDays: ['Saturday', 'Sunday'],
      lowPerformanceDays: ['Wednesday', 'Thursday'],
      averageConfidence: 0.75,
      predictionVolume: 50,
      difficultyLevel: 'medium'
    };
  }

  private identifySeasonalFactors(_season: string, _predictions: HistoricalPrediction[]): SeasonalFactor[] {
    return [
      {
        factor: 'Weather conditions',
        impact: 0.3,
        confidence: 0.8,
        description: 'Weather significantly impacts game outcomes',
        evidence: ['Rain games show different patterns', 'Cold weather affects scoring']
      }
    ];
  }

  private generateSeasonalPredictions(_season: string, performance: PerformanceMetrics): SeasonalPrediction[] {
    return [
      {
        nextSeason: 'Next year same season',
        expectedAccuracy: performance.accuracy * 1.05,
        confidenceInterval: {
          lower: performance.accuracy * 0.95,
          upper: performance.accuracy * 1.15
        },
        factors: ['Improved experience', 'Better data'],
        recommendations: ['Focus on consistency', 'Analyze successful patterns']
      }
    ];
  }

  private getSeasonPeriod(_season: string): TimeRange {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    return {
      start: new Date(currentYear, 0, 1),
      end: new Date(currentYear, 11, 31),
      period: 'seasonal',
      duration: 365
    };
  }

  private async getCompetitorStats(_userId: string): Promise<CompetitorStats[]> {
    // Simulate competitor data
    return Array.from({ length: 100 }, (_, i) => ({
      rank: i + 1,
      accuracy: 0.9 - (i * 0.005),
      totalPredictions: 100 + Math.random() * 500,
      specialty: [['NFL'], ['NBA'], ['MLB']][Math.floor(Math.random() * 3)],
      anonymous: Math.random() > 0.3
    }));
  }

  private calculateUserRank(userAccuracy: number, competitorStats: CompetitorStats[]): number {
    const betterPerformers = competitorStats.filter(comp => comp.accuracy > userAccuracy).length;
    return betterPerformers + 1;
  }

  private calculatePercentile(rank: number, totalUsers: number): number {
    return ((totalUsers - rank + 1) / totalUsers) * 100;
  }

  private identifyCompetitiveStrengths(_userId: string, _predictions: HistoricalPrediction[], _competitors: CompetitorStats[]): string[] {
    return ['Above average consistency', 'Strong in NFL predictions'];
  }

  private identifyCompetitiveWeaknesses(_userId: string, _predictions: HistoricalPrediction[], _competitors: CompetitorStats[]): string[] {
    return ['Lower accuracy than top 10%', 'Needs more volume'];
  }

  private generateBenchmarkAnalysis(userAccuracy: number, userRank: number, _competitors: CompetitorStats[]): BenchmarkAnalysis {
    return {
      aboveAverage: userAccuracy > 0.65,
      gapToLeader: 0.9 - userAccuracy,
      gapToAverage: 0.65 - userAccuracy,
      improvementNeeded: Math.max(0, 0.7 - userAccuracy),
      achievableRank: Math.max(1, userRank - 10),
      timeline: '6-8 weeks'
    };
  }

  private calculateConsistency(predictions: HistoricalPrediction[]): number {
    if (predictions.length < 2) return 0;
    
    const accuracies = predictions.map(p => p.accuracy);
    const mean = accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length;
    const variance = accuracies.reduce((sum, acc) => sum + Math.pow(acc - mean, 2), 0) / accuracies.length;
    
    return Math.max(0, 1 - Math.sqrt(variance));
  }

  private getAccuracyResources(): Resource[] {
    return [
      {
        type: 'article',
        title: 'Advanced Sports Analytics',
        description: 'Learn statistical analysis for better predictions',
        url: 'https://example.com/analytics',
        estimatedTime: '2 hours'
      }
    ];
  }

  private getConsistencyResources(): Resource[] {
    return [
      {
        type: 'tool',
        title: 'Prediction Framework',
        description: 'Systematic approach to making predictions',
        estimatedTime: '30 minutes'
      }
    ];
  }

  private getCategoryResources(_category: string): Resource[] {
    return [
      {
        type: 'video',
        title: 'Category-specific strategies',
        description: 'Learn advanced techniques for this category',
        estimatedTime: '45 minutes'
      }
    ];
  }

  private getPriorityScore(priority: string): number {
    const scores = { high: 1, medium: 2, low: 3 };
    return scores[priority as keyof typeof scores] || 2;
  }

  private generateCacheKey(userId: string, timeRange: TimeRange, config: Partial<ReportConfiguration>): string {
    return `${userId}_${timeRange.start.getTime()}_${timeRange.end.getTime()}_${JSON.stringify(config)}`;
  }

  private isCacheValid(generatedAt: Date): boolean {
    const oneHour = 60 * 60 * 1000;
    return Date.now() - generatedAt.getTime() < oneHour;
  }
}

// Export singleton instance
export const oracleHistoricalAnalyticsService = new OracleHistoricalAnalyticsService();
export default oracleHistoricalAnalyticsService;
