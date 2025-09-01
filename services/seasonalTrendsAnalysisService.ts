/**
 * Seasonal Trends Analysis Service
 * Calculates player performance trends across different parts of the NFL season
 * Provides insights into early/mid/late season performance patterns
 */

import { productionSportsDataService } from &apos;./productionSportsDataService&apos;;

export interface SeasonalTrendData {
}
  playerId: string;
  playerName: string;
  position: string;
  season: number;
  trends: {
}
    earlySeason: SeasonalMetrics;    // Weeks 1-6
    midSeason: SeasonalMetrics;      // Weeks 7-12
    lateSeason: SeasonalMetrics;     // Weeks 13-18
    playoffs: SeasonalMetrics;       // Weeks 19-22
  };
  patterns: SeasonalPattern[];
  analysis: SeasonalAnalysis;
}

export interface SeasonalMetrics {
}
  weeks: number[];
  averageFantasyPoints: number;
  averageTargets?: number;
  averageReceptions?: number;
  averageYards: number;
  averageTouchdowns: number;
  consistencyScore: number;        // 0-100, lower deviation = higher consistency
  ceiling: number;                 // Best performance
  floor: number;                   // Worst performance
  gamesPlayed: number;
  touchesPerGame?: number;
  redZoneTargets?: number;
  snapSharePercentage?: number;
}

export interface SeasonalPattern {
}
  type: &apos;improving&apos; | &apos;declining&apos; | &apos;consistent&apos; | &apos;volatile&apos; | &apos;injury_prone&apos;;
  description: string;
  confidence: number;              // 0-1
  supportingWeeks: number[];
  severity: &apos;low&apos; | &apos;moderate&apos; | &apos;high&apos;;
  fantasyImpact: string;
}

export interface SeasonalAnalysis {
}
  overallTrend: &apos;positive&apos; | &apos;negative&apos; | &apos;stable&apos;;
  bestPeriod: &apos;early&apos; | &apos;mid&apos; | &apos;late&apos; | &apos;playoffs&apos;;
  worstPeriod: &apos;early&apos; | &apos;mid&apos; | &apos;late&apos; | &apos;playoffs&apos;;
  volatility: number;              // Coefficient of variation
  projectedTrend: {
}
    direction: &apos;up&apos; | &apos;down&apos; | &apos;stable&apos;;
    confidence: number;
    reasoning: string[];
  };
  recommendations: string[];
}

export interface WeeklyPlayerData {
}
  week: number;
  opponent: string;
  fantasyPoints: number;
  targets?: number;
  receptions?: number;
  yards: number;
  touchdowns: number;
  touches?: number;
  snapShare?: number;
  gameScript: &apos;positive&apos; | &apos;neutral&apos; | &apos;negative&apos;;
  homeGame: boolean;
  weather?: &apos;dome&apos; | &apos;good&apos; | &apos;poor&apos;;
}

class SeasonalTrendsAnalysisService {
}
  private readonly cache = new Map<string, SeasonalTrendData>();
  private readonly historicalData = new Map<string, WeeklyPlayerData[]>();

  constructor() {
}
    this.initializeMockData();
  }

  /**
   * Generate comprehensive seasonal trends analysis for a player
   */
  async generateSeasonalTrends(
    playerId: string, 
    seasons: number[] = [2023, 2024]
  ): Promise<SeasonalTrendData> {
}
    const cacheKey = `${playerId}_${seasons.join(&apos;_&apos;)}`;
    
    if (this.cache.has(cacheKey)) {
}
      const cachedData = this.cache.get(cacheKey);
      if (cachedData) {
}
        return cachedData;
      }
    }

    try {
}
      // Get player information
      const player = await productionSportsDataService.getPlayerDetails(playerId);
      if (!player) {
}
        throw new Error(`Player ${playerId} not found`);
      }

      // Get historical weekly data
      const weeklyData = await this.getPlayerWeeklyData(playerId, seasons);
      
      // Calculate seasonal metrics
      const trends = this.calculateSeasonalMetrics(weeklyData);
      
      // Detect patterns
      const patterns = this.detectSeasonalPatterns(weeklyData, trends);
      
      // Perform analysis
      const analysis = this.analyzeSeasonalTrends(trends, patterns);

      const seasonalTrendData: SeasonalTrendData = {
}
        playerId,
        playerName: player.name,
        position: player.position,
        season: Math.max(...seasons),
        trends,
        patterns,
//         analysis
      };

      this.cache.set(cacheKey, seasonalTrendData);
      return seasonalTrendData;

    } catch (error) {
}
      console.error(`Error generating seasonal trends for player ${playerId}:`, error);
      return this.generateMockSeasonalData(playerId, &apos;Unknown Player&apos;, &apos;UNKNOWN&apos;);
    }
  }

  /**
   * Get multiple players&apos; seasonal trends for comparison
   */
  async getMultiplePlayerTrends(
    playerIds: string[], 
    seasons: number[] = [2024]
  ): Promise<SeasonalTrendData[]> {
}
    const promises = playerIds.map((playerId: any) => 
      this.generateSeasonalTrends(playerId, seasons)
    );
    
    return Promise.all(promises);
  }

  /**
   * Calculate seasonal trend values for ML models (0-1 normalized)
   */
  async calculateSeasonalTrendValues(playerId: string): Promise<number[]> {
}
    const trends = await this.generateSeasonalTrends(playerId);
    
    // Calculate trend values as ratios between periods
    const early = trends.trends.earlySeason.averageFantasyPoints;
    const mid = trends.trends.midSeason.averageFantasyPoints;
    const late = trends.trends.lateSeason.averageFantasyPoints;
    
    if (early === 0) return [0.5, 0.5, 0.5]; // Default if no data
    
    return [
      Math.min(1, Math.max(0, mid / early)),        // Mid vs Early ratio
      Math.min(1, Math.max(0, late / early)),       // Late vs Early ratio  
      Math.min(1, Math.max(0, late / mid))          // Late vs Mid ratio
    ];
  }

  /**
   * Get player&apos;s weekly performance data
   */
  private async getPlayerWeeklyData(
    playerId: string, 
    seasons: number[]
  ): Promise<WeeklyPlayerData[]> {
}
    // Check cache first
    const cacheKey = `${playerId}_weekly_${seasons.join(&apos;_&apos;)}`;
    if (this.historicalData.has(cacheKey)) {
}
      const cachedData = this.historicalData.get(cacheKey);
      if (cachedData) {
}
        return cachedData;
      }
    }

    // In a real implementation, this would fetch from APIs
    // For now, generate realistic mock data
    const weeklyData = this.generateMockWeeklyData(playerId, seasons);
    this.historicalData.set(cacheKey, weeklyData);
    
    return weeklyData;
  }

  /**
   * Calculate seasonal metrics from weekly data
   */
  private calculateSeasonalMetrics(weeklyData: WeeklyPlayerData[]): SeasonalTrendData[&apos;trends&apos;] {
}
    const earlyWeeks = weeklyData.filter((w: any) => w.week >= 1 && w.week <= 6);
    const midWeeks = weeklyData.filter((w: any) => w.week >= 7 && w.week <= 12);
    const lateWeeks = weeklyData.filter((w: any) => w.week >= 13 && w.week <= 18);
    const playoffWeeks = weeklyData.filter((w: any) => w.week >= 19 && w.week <= 22);

    return {
}
      earlySeason: this.calculatePeriodMetrics(earlyWeeks),
      midSeason: this.calculatePeriodMetrics(midWeeks),
      lateSeason: this.calculatePeriodMetrics(lateWeeks),
      playoffs: this.calculatePeriodMetrics(playoffWeeks)
    };
  }

  /**
   * Calculate metrics for a specific period
   */
  private calculatePeriodMetrics(periodData: WeeklyPlayerData[]): SeasonalMetrics {
}
    if (periodData.length === 0) {
}
      return {
}
        weeks: [],
        averageFantasyPoints: 0,
        averageYards: 0,
        averageTouchdowns: 0,
        consistencyScore: 0,
        ceiling: 0,
        floor: 0,
        gamesPlayed: 0
      };
    }

    const fantasyPoints = periodData.map((w: any) => w.fantasyPoints);
    const yards = periodData.map((w: any) => w.yards);
    const touchdowns = periodData.map((w: any) => w.touchdowns);

    const avgPoints = fantasyPoints.reduce((a, b) => a + b, 0) / fantasyPoints.length;
    const avgYards = yards.reduce((a, b) => a + b, 0) / yards.length;
    const avgTouchdowns = touchdowns.reduce((a, b) => a + b, 0) / touchdowns.length;

    // Calculate consistency (inverse of coefficient of variation)
    const variance = fantasyPoints.reduce((acc, points) => acc + Math.pow(points - avgPoints, 2), 0) / fantasyPoints.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = avgPoints > 0 ? stdDev / avgPoints : 0;
    const consistencyScore = Math.max(0, 100 - (coefficientOfVariation * 100));

    return {
}
      weeks: periodData.map((w: any) => w.week),
      averageFantasyPoints: parseFloat(avgPoints.toFixed(1)),
      averageTargets: periodData.filter((w: any) => w.targets).length > 0 
        ? periodData.reduce((sum, w) => sum + (w.targets || 0), 0) / periodData.filter((w: any) => w.targets).length 
        : undefined,
      averageReceptions: periodData.filter((w: any) => w.receptions).length > 0 
        ? periodData.reduce((sum, w) => sum + (w.receptions || 0), 0) / periodData.filter((w: any) => w.receptions).length 
        : undefined,
      averageYards: parseFloat(avgYards.toFixed(1)),
      averageTouchdowns: parseFloat(avgTouchdowns.toFixed(2)),
      consistencyScore: parseFloat(consistencyScore.toFixed(1)),
      ceiling: Math.max(...fantasyPoints),
      floor: Math.min(...fantasyPoints),
      gamesPlayed: periodData.length,
      touchesPerGame: periodData.filter((w: any) => w.touches).length > 0 
        ? periodData.reduce((sum, w) => sum + (w.touches || 0), 0) / periodData.filter((w: any) => w.touches).length 
        : undefined
    };
  }

  /**
   * Helper function to determine severity based on change percent
   */
  private getSeverityLevel(changePercent: number): &apos;low&apos; | &apos;moderate&apos; | &apos;high&apos; {
}
    const absChange = Math.abs(changePercent);
    if (absChange > 30) return &apos;high&apos;;
    if (absChange > 20) return &apos;moderate&apos;;
    return &apos;low&apos;;
  }

  /**
   * Helper function to determine trend direction
   */
  private getTrendDirection(overallTrend: string): &apos;up&apos; | &apos;down&apos; | &apos;stable&apos; {
}
    if (overallTrend === &apos;positive&apos;) return &apos;up&apos;;
    if (overallTrend === &apos;negative&apos;) return &apos;down&apos;;
    return &apos;stable&apos;;
  }

  /**
   * Detect seasonal patterns in player performance
   */
  private detectSeasonalPatterns(
    weeklyData: WeeklyPlayerData[], 
    trends: SeasonalTrendData[&apos;trends&apos;]
  ): SeasonalPattern[] {
}
    const patterns: SeasonalPattern[] = [];

    // Improvement/Decline pattern
    const earlyAvg = trends.earlySeason.averageFantasyPoints;
    const lateAvg = trends.lateSeason.averageFantasyPoints;
    
    if (earlyAvg > 0) {
}
      const changePercent = ((lateAvg - earlyAvg) / earlyAvg) * 100;
      
      if (changePercent > 15) {
}
        patterns.push({
}
          type: &apos;improving&apos;,
          description: `Strong improvement from early season (${earlyAvg.toFixed(1)}) to late season (${lateAvg.toFixed(1)}) - ${changePercent.toFixed(1)}% increase`,
          confidence: Math.min(0.9, Math.abs(changePercent) / 20),
          supportingWeeks: [...trends.earlySeason.weeks, ...trends.lateSeason.weeks],
          severity: this.getSeverityLevel(changePercent),
          fantasyImpact: &apos;Positive trend suggests higher value in playoffs and following season&apos;
        });
      } else if (changePercent < -15) {
}
        patterns.push({
}
          type: &apos;declining&apos;,
          description: `Notable decline from early season (${earlyAvg.toFixed(1)}) to late season (${lateAvg.toFixed(1)}) - ${Math.abs(changePercent).toFixed(1)}% decrease`,
          confidence: Math.min(0.9, Math.abs(changePercent) / 20),
          supportingWeeks: [...trends.earlySeason.weeks, ...trends.lateSeason.weeks],
          severity: this.getSeverityLevel(changePercent),
          fantasyImpact: &apos;Declining trend suggests potential injury or usage concerns&apos;
        });
      }
    }

    // Consistency pattern
    const avgConsistency = (trends.earlySeason.consistencyScore + trends.midSeason.consistencyScore + trends.lateSeason.consistencyScore) / 3;
    
    if (avgConsistency > 75) {
}
      patterns.push({
}
        type: &apos;consistent&apos;,
        description: `High consistency across all periods (${avgConsistency.toFixed(1)}% average)`,
        confidence: 0.8,
        supportingWeeks: weeklyData.map((w: any) => w.week),
        severity: &apos;low&apos;,
        fantasyImpact: &apos;Reliable floor makes player suitable for consistent lineup usage&apos;
      });
    } else if (avgConsistency < 40) {
}
      patterns.push({
}
        type: &apos;volatile&apos;,
        description: `High volatility across all periods (${avgConsistency.toFixed(1)}% consistency)`,
        confidence: 0.8,
        supportingWeeks: weeklyData.map((w: any) => w.week),
        severity: &apos;high&apos;,
        fantasyImpact: &apos;Boom/bust player with high ceiling but low floor&apos;
      });
    }

    return patterns;
  }

  /**
   * Analyze seasonal trends and provide insights
   */
  private analyzeSeasonalTrends(
    trends: SeasonalTrendData[&apos;trends&apos;],
    patterns: SeasonalPattern[]
  ): SeasonalAnalysis {
}
    const periods = [
      { name: &apos;early&apos;, metrics: trends.earlySeason },
      { name: &apos;mid&apos;, metrics: trends.midSeason },
      { name: &apos;late&apos;, metrics: trends.lateSeason },
      { name: &apos;playoffs&apos;, metrics: trends.playoffs }
    ];

    // Find best and worst periods
    const periodsWithData = periods.filter((p: any) => p.metrics.gamesPlayed > 0);
    
    if (periodsWithData.length === 0) {
}
      // Return default analysis if no data
      return {
}
        overallTrend: &apos;stable&apos;,
        bestPeriod: &apos;early&apos;,
        worstPeriod: &apos;early&apos;,
        volatility: 0,
        projectedTrend: {
}
          direction: &apos;stable&apos;,
          confidence: 0,
          reasoning: [&apos;No historical data available&apos;]
        },
        recommendations: [&apos;Insufficient data for analysis&apos;]
      };
    }

    const bestPeriod = periodsWithData.reduce((best, current) => 
      current.metrics.averageFantasyPoints > best.metrics.averageFantasyPoints ? current : best
    , periodsWithData[0]);
    
    const worstPeriod = periodsWithData.reduce((worst, current) => 
      current.metrics.averageFantasyPoints < worst.metrics.averageFantasyPoints ? current : worst
    , periodsWithData[0]);

    // Calculate overall trend
    const earlyAvg = trends.earlySeason.averageFantasyPoints;
    const lateAvg = trends.lateSeason.averageFantasyPoints;
    let overallTrend: &apos;positive&apos; | &apos;negative&apos; | &apos;stable&apos; = &apos;stable&apos;;
    
    if (earlyAvg > 0) {
}
      const changePercent = ((lateAvg - earlyAvg) / earlyAvg) * 100;
      if (changePercent > 10) overallTrend = &apos;positive&apos;;
      else if (changePercent < -10) overallTrend = &apos;negative&apos;;
    }

    // Calculate volatility
    const allPoints = periodsWithData.map((p: any) => p.metrics.averageFantasyPoints);
    const meanPoints = allPoints.reduce((a, b) => a + b, 0) / allPoints.length;
    const variance = allPoints.reduce((acc, points) => acc + Math.pow(points - meanPoints, 2), 0) / allPoints.length;
    const volatility = meanPoints > 0 ? Math.sqrt(variance) / meanPoints : 0;

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (overallTrend === &apos;positive&apos;) {
}
      recommendations.push(&apos;Consider acquiring for playoffs due to improving trend&apos;);
    } else if (overallTrend === &apos;negative&apos;) {
}
      recommendations.push(&apos;Monitor for potential sell opportunities&apos;);
    }
    
    if (volatility > 0.3) {
}
      recommendations.push(&apos;High volatility makes player better for DFS than season-long&apos;);
    }
    
    if (bestPeriod.name === &apos;late&apos; || bestPeriod.name === &apos;playoffs&apos;) {
}
      recommendations.push(&apos;Strong playoff performer - premium trade target&apos;);
    }

    return {
}
      overallTrend,
      bestPeriod: bestPeriod.name as any,
      worstPeriod: worstPeriod.name as any,
      volatility: parseFloat(volatility.toFixed(3)),
      projectedTrend: {
}
        direction: this.getTrendDirection(overallTrend),
        confidence: Math.min(0.9, periodsWithData.length / 4),
        reasoning: this.generateTrendReasoning(patterns, overallTrend)
      },
//       recommendations
    };
  }

  /**
   * Generate reasoning for trend projections
   */
  private generateTrendReasoning(patterns: SeasonalPattern[], trend: string): string[] {
}
    const reasoning: string[] = [];
    
    patterns.forEach((pattern: any) => {
}
      switch (pattern.type) {
}
        case &apos;improving&apos;:
          reasoning.push(&apos;Showed improvement throughout season&apos;);
          break;
        case &apos;declining&apos;:
          reasoning.push(&apos;Performance declined as season progressed&apos;);
          break;
        case &apos;consistent&apos;:
          reasoning.push(&apos;Maintained consistent performance&apos;);
          break;
        case &apos;volatile&apos;:
          reasoning.push(&apos;High variance in weekly performance&apos;);
          break;
      }
    });

    if (reasoning.length === 0) {
}
      reasoning.push(&apos;Limited historical data available&apos;);
    }

    return reasoning;
  }

  /**
   * Generate mock weekly data for testing
   */
  private generateMockWeeklyData(playerId: string, seasons: number[]): WeeklyPlayerData[] {
}
    const data: WeeklyPlayerData[] = [];
    
    seasons.forEach((_, seasonIndex) => {
}
      // Simulate different performance patterns
      const basePoints = 12 + Math.random() * 8; // Base performance 12-20 points
      const seasonTrend = (Math.random() - 0.5) * 0.5; // -25% to +25% season trend
      
      for (let week = 1; week <= 18; week++) {
}
        // Apply seasonal trend
        const weekFactor = 1 + (seasonTrend * (week - 1) / 17);
        const expectedPoints = basePoints * weekFactor;
        
        // Add some randomness
        const variance = expectedPoints * 0.4;
        const actualPoints = Math.max(0, expectedPoints + (Math.random() - 0.5) * variance);
        
        // Calculate derived stats
        const yards = actualPoints * (8 + Math.random() * 4); // 8-12 yards per point
        const touchdowns = Math.max(0, Math.floor(actualPoints / 8) + (Math.random() > 0.7 ? 1 : 0));
        
        data.push({
}
          week,
          opponent: [&apos;LAR&apos;, &apos;SF&apos;, &apos;SEA&apos;, &apos;ARI&apos;, &apos;DAL&apos;, &apos;NYG&apos;, &apos;PHI&apos;, &apos;WAS&apos;][Math.floor(Math.random() * 8)],
          fantasyPoints: parseFloat(actualPoints.toFixed(1)),
          targets: Math.floor(5 + Math.random() * 8),
          receptions: Math.floor(3 + Math.random() * 6),
          yards: parseFloat(yards.toFixed(1)),
          touchdowns: parseFloat(touchdowns.toFixed(2)),
          touches: Math.floor(actualPoints / 2 + Math.random() * 5),
          snapShare: parseFloat((0.6 + Math.random() * 0.3).toFixed(2)),
          gameScript: [&apos;positive&apos;, &apos;neutral&apos;, &apos;negative&apos;][Math.floor(Math.random() * 3)] as any,
          homeGame: Math.random() > 0.5,
          weather: [&apos;dome&apos;, &apos;good&apos;, &apos;poor&apos;][Math.floor(Math.random() * 3)] as any
        });
      }
    });
    
    return data;
  }

  /**
   * Generate mock seasonal data when real data isn&apos;t available
   */
  private generateMockSeasonalData(
    playerId: string, 
    playerName: string, 
    position: string
  ): SeasonalTrendData {
}
    const weeklyData = this.generateMockWeeklyData(playerId, [2024]);
    const trends = this.calculateSeasonalMetrics(weeklyData);
    const patterns = this.detectSeasonalPatterns(weeklyData, trends);
    const analysis = this.analyzeSeasonalTrends(trends, patterns);

    return {
}
      playerId,
      playerName,
      position,
      season: 2024,
      trends,
      patterns,
//       analysis
    };
  }

  /**
   * Initialize with some mock data for testing
   */
  private initializeMockData(): void {
}
    // This can be expanded with more realistic mock data
    console.log(&apos;Seasonal Trends Analysis Service initialized&apos;);
  }
}

// Export singleton instance
export const seasonalTrendsAnalysisService = new SeasonalTrendsAnalysisService();
export default seasonalTrendsAnalysisService;
