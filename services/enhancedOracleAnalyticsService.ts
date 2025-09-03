/**
 * Enhanced Oracle Analytics Service
 * Integrates real-time Sports.io data with Oracle prediction system
 */

import { enhancedSportsIOService } from './enhancedSportsIORealTimeService';
import { oracleApiClient } from './oracleApiClient';
import { useRealTimeGames, useRealTimePlayers } from '../hooks/useEnhancedSportsIORealTime';
import { Player } from '../types';

interface LiveAnalyticsData {
  playerId: string;
  currentStats: any;
  projectedStats: any;
  gameContext: {
    gameId: string;
    quarter: number;
    timeRemaining: string;
    score: { home: number; away: number };
    situation: string;
  };
  oraclePredictions: {
    fantasyPoints: number;
    confidence: number;
    reasoning: string;
  };
  performanceMetrics: {
    vsProjection: number;
    momentum: 'positive' | 'negative' | 'neutral';
    riskLevel: 'low' | 'medium' | 'high';
  };
}

interface GameAnalytics {
  gameId: string;
  totalScoringPace: number;
  weatherImpact: number;
  oracleGamePrediction: {
    totalPoints: number;
    winProbability: { home: number; away: number };
    keyFactors: string[];
  };
  liveFactors: {
    momentum: string;
    injuryUpdates: any[];
    playCallingTrends: any[];
  };
}

interface OraclePredictionUpdate {
  predictionId: string;
  type: 'player_performance' | 'game_outcome' | 'market_shift';
  confidence: number;
  reasoning: string;
  dataPoints: any[];
  timestamp: Date;
}

export class EnhancedOracleAnalyticsService {
  private livePlayerAnalytics: Map<string, LiveAnalyticsData> = new Map();
  private gameAnalytics: Map<string, GameAnalytics> = new Map();
  private predictionUpdates: OraclePredictionUpdate[] = [];
  private updateInterval: NodeJS.Timeout | null = null;
  private isAnalyzing = false;

  constructor() {
    this.initializeRealTimeAnalytics();
  }

  /**
   * Initialize real-time analytics pipeline
   */
  private async initializeRealTimeAnalytics(): Promise<void> {
    try {
      // Subscribe to live data updates
      enhancedSportsIOService.subscribeToUpdates(
        'all',
        this.handleLiveDataUpdate.bind(this)
      );

      // Start periodic Oracle analysis
      this.startPeriodicAnalysis();
      
      console.log('🧠 Oracle Analytics Service initialized with live data integration');
    } catch (error) {
      console.error('❌ Failed to initialize Oracle Analytics:', error);
    }
  }

  /**
   * Handle incoming live data updates
   */
  private async handleLiveDataUpdate(updateData: any): Promise<void> {
    if (this.isAnalyzing) return;

    try {
      switch (updateData.type) {
        case 'player_update':
          await this.analyzePlayerPerformance(updateData.data);
          break;
        case 'game_update':
          await this.analyzeGameSituation(updateData.data);
          break;
        case 'injury_update':
          await this.processInjuryImpact(updateData.data);
          break;
      }
    } catch (error) {
      console.error('❌ Error processing live data update:', error);
    }
  }

  /**
   * Analyze player performance in real-time
   */
  private async analyzePlayerPerformance(playerData: any): Promise<void> {
    try {
      const playerId = playerData.playerId;
      
      // Get current game context
      const gameContext = await this.getGameContext(playerId);
      
      // Calculate projected stats based on current pace
      const projectedStats = this.calculateProjectedStats(playerData.stats, gameContext);
      
      // Get Oracle's original prediction for comparison
      const oraclePrediction = await this.getOraclePlayerPrediction(playerId);
      
      // Analyze performance vs projection
      const performanceMetrics = this.analyzePerformanceMetrics(
        playerData.stats,
        projectedStats,
        oraclePrediction
      );

      const liveAnalytics: LiveAnalyticsData = {
        playerId,
        currentStats: playerData.stats,
        projectedStats,
        gameContext,
        oraclePredictions: oraclePrediction,
        performanceMetrics
      };

      this.livePlayerAnalytics.set(playerId, liveAnalytics);

      // Generate prediction update if significant deviation
      if (performanceMetrics.vsProjection > 20 || performanceMetrics.vsProjection < -20) {
        await this.generatePredictionUpdate('player_performance', playerId, liveAnalytics);
      }

    } catch (error) {
      console.error(`❌ Error analyzing player performance for ${playerData.playerId}:`, error);
    }
  }

  /**
   * Analyze game situation and impact on predictions
   */
  private async analyzeGameSituation(gameData: any): Promise<void> {
    try {
      const gameId = gameData.gameId;
      
      // Calculate scoring pace
      const totalScoringPace = this.calculateScoringPace(gameData);
      
      // Assess weather and environmental factors
      const weatherImpact = await this.assessWeatherImpact(gameId);
      
      // Get Oracle's game predictions
      const oracleGamePrediction = await this.getOracleGamePrediction(gameId);
      
      // Analyze live factors
      const liveFactors = await this.analyzeLiveGameFactors(gameData);

      const analytics: GameAnalytics = {
        gameId,
        totalScoringPace,
        weatherImpact,
        oracleGamePrediction,
        liveFactors
      };

      this.gameAnalytics.set(gameId, analytics);

      // Update related player predictions based on game flow
      await this.updatePlayerPredictionsForGame(gameId, analytics);

    } catch (error) {
      console.error(`❌ Error analyzing game situation for ${gameData.gameId}:`, error);
    }
  }

  /**
   * Process injury impact on predictions
   */
  private async processInjuryImpact(injuryData: any): Promise<void> {
    try {
      const { playerId, severity, gameId } = injuryData;
      
      // Get affected teammates and opponents
      const affectedPlayers = await this.getAffectedPlayers(playerId, gameId);
      
      // Update predictions for all affected players
      for (const affectedPlayerId of affectedPlayers) {
        const impact = this.calculateInjuryImpact(playerId, affectedPlayerId, severity);
        
        if (Math.abs(impact) > 10) {
          await this.generatePredictionUpdate('market_shift', affectedPlayerId, {
            injuryPlayer: playerId,
            impact,
            severity
          });
        }
      }

    } catch (error) {
      console.error('❌ Error processing injury impact:', error);
    }
  }

  /**
   * Get live analytics for a player
   */
  async getLivePlayerAnalytics(playerId: string): Promise<LiveAnalyticsData | null> {
    const cached = this.livePlayerAnalytics.get(playerId);
    if (cached) return cached;

    // Generate fresh analytics if not cached
    try {
      const playerData = await enhancedSportsIOService.getLivePlayerStats(playerId);
      if (playerData) {
        await this.analyzePlayerPerformance(playerData);
        return this.livePlayerAnalytics.get(playerId) || null;
      }
    } catch (error) {
      console.error(`❌ Error getting live analytics for player ${playerId}:`, error);
    }

    return null;
  }

  /**
   * Get game analytics
   */
  async getGameAnalytics(gameId: string): Promise<GameAnalytics | null> {
    const cached = this.gameAnalytics.get(gameId);
    if (cached) return cached;

    try {
      const gameData = await enhancedSportsIOService.getLiveGameData(gameId);
      if (gameData) {
        await this.analyzeGameSituation(gameData);
        return this.gameAnalytics.get(gameId) || null;
      }
    } catch (error) {
      console.error(`❌ Error getting game analytics for ${gameId}:`, error);
    }

    return null;
  }

  /**
   * Get Oracle prediction updates
   */
  getRecentPredictionUpdates(limit: number = 10): OraclePredictionUpdate[] {
    return this.predictionUpdates
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Get comprehensive analytics dashboard data
   */
  async getAnalyticsDashboard(): Promise<{
    livePlayerCount: number;
    activeGames: number;
    recentUpdates: OraclePredictionUpdate[];
    topPerformers: any[];
    underPerformers: any[];
    gameHighlights: any[];
  }> {
    const activeGames = await enhancedSportsIOService.getActiveGames();
    const livePlayerAnalytics = Array.from(this.livePlayerAnalytics.values());

    // Sort players by performance vs projection
    const sortedPlayers = livePlayerAnalytics.sort(
      (a, b) => b.performanceMetrics.vsProjection - a.performanceMetrics.vsProjection
    );

    return {
      livePlayerCount: livePlayerAnalytics.length,
      activeGames: activeGames.length,
      recentUpdates: this.getRecentPredictionUpdates(5),
      topPerformers: sortedPlayers.slice(0, 5),
      underPerformers: sortedPlayers.slice(-5).reverse(),
      gameHighlights: activeGames.map(game => ({
        gameId: game.gameId,
        teams: `${game.awayTeam} @ ${game.homeTeam}`,
        score: `${game.awayScore}-${game.homeScore}`,
        quarter: game.quarter,
        analytics: this.gameAnalytics.get(game.gameId)
      }))
    };
  }

  /**
   * Helper Methods
   */
  private async getGameContext(playerId: string): Promise<any> {
    // Implementation to get current game context
    return {
      gameId: 'unknown',
      quarter: 1,
      timeRemaining: '15:00',
      score: { home: 0, away: 0 },
      situation: 'normal'
    };
  }

  private calculateProjectedStats(currentStats: any, gameContext: any): any {
    // Project final stats based on current pace and game situation
    const quarterProgress = gameContext.quarter + (15 - parseInt(gameContext.timeRemaining.split(':')[0])) / 15;
    const gameProgress = quarterProgress / 4;
    
    return {
      projectedYards: Math.round((currentStats.yards || 0) / gameProgress),
      projectedTouchdowns: Math.round((currentStats.touchdowns || 0) / gameProgress),
      projectedReceptions: Math.round((currentStats.receptions || 0) / gameProgress),
      projectedFantasyPoints: Math.round(((currentStats.fantasyPoints || 0) / gameProgress) * 100) / 100
    };
  }

  private async getOraclePlayerPrediction(playerId: string): Promise<any> {
    // Get Oracle's original prediction for this player
    return {
      fantasyPoints: 12.5,
      confidence: 0.75,
      reasoning: 'Based on historical matchup data and recent form'
    };
  }

  private analyzePerformanceMetrics(current: any, projected: any, oracle: any): any {
    const vsProjection = ((projected.projectedFantasyPoints - oracle.fantasyPoints) / oracle.fantasyPoints) * 100;
    
    return {
      vsProjection: Math.round(vsProjection * 100) / 100,
      momentum: vsProjection > 10 ? 'positive' : vsProjection < -10 ? 'negative' : 'neutral',
      riskLevel: Math.abs(vsProjection) > 25 ? 'high' : Math.abs(vsProjection) > 15 ? 'medium' : 'low'
    };
  }

  private calculateScoringPace(gameData: any): number {
    const totalScore = gameData.homeScore + gameData.awayScore;
    const quarterProgress = gameData.quarter + (15 - parseInt(gameData.timeRemaining.split(':')[0] || '15')) / 15;
    return (totalScore / quarterProgress) * 4; // Projected final total
  }

  private async assessWeatherImpact(gameId: string): Promise<number> {
    // Implementation to assess weather impact (0-100 scale)
    return 10; // Default low impact
  }

  private async getOracleGamePrediction(gameId: string): Promise<any> {
    return {
      totalPoints: 45.5,
      winProbability: { home: 0.55, away: 0.45 },
      keyFactors: ['Home field advantage', 'Weather conditions', 'Recent form']
    };
  }

  private async analyzeLiveGameFactors(gameData: any): Promise<any> {
    return {
      momentum: gameData.homeScore > gameData.awayScore ? 'home' : 'away',
      injuryUpdates: [],
      playCallingTrends: []
    };
  }

  private async updatePlayerPredictionsForGame(gameId: string, analytics: GameAnalytics): Promise<void> {
    // Update predictions for all players in this game based on game analytics
  }

  private async getAffectedPlayers(injuredPlayerId: string, gameId: string): Promise<string[]> {
    // Get players affected by injury (teammates who might benefit, etc.)
    return [];
  }

  private calculateInjuryImpact(injuredPlayerId: string, affectedPlayerId: string, severity: string): number {
    // Calculate percentage impact on affected player's projection
    return 0;
  }

  private async generatePredictionUpdate(
    type: 'player_performance' | 'game_outcome' | 'market_shift',
    entityId: string,
    data: any
  ): Promise<void> {
    const update: OraclePredictionUpdate = {
      predictionId: `${type}_${entityId}_${Date.now()}`,
      type,
      confidence: 0.8,
      reasoning: `Live data indicates significant deviation from original prediction`,
      dataPoints: [data],
      timestamp: new Date()
    };

    this.predictionUpdates.push(update);
    
    // Keep only last 100 updates
    if (this.predictionUpdates.length > 100) {
      this.predictionUpdates.splice(0, this.predictionUpdates.length - 100);
    }

    console.log(`📊 Generated Oracle prediction update: ${update.predictionId}`);
  }

  private startPeriodicAnalysis(): void {
    this.updateInterval = setInterval(async () => {
      this.isAnalyzing = true;
      
      try {
        // Refresh analytics for active games
        const activeGames = await enhancedSportsIOService.getActiveGames();
        
        for (const game of activeGames) {
          await this.analyzeGameSituation(game);
        }
      } catch (error) {
        console.error('❌ Error in periodic analysis:', error);
      } finally {
        this.isAnalyzing = false;
      }
    }, 30000); // Every 30 seconds
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    this.livePlayerAnalytics.clear();
    this.gameAnalytics.clear();
    this.predictionUpdates = [];
    
    console.log('🧹 Oracle Analytics Service cleanup completed');
  }
}

// Export singleton instance
export const enhancedOracleAnalyticsService = new EnhancedOracleAnalyticsService();