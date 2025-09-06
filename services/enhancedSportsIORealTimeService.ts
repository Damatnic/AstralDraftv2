/**
 * Enhanced Sports.io Real-Time Service
 * Advanced integration with Sports.io API for live NFL data streaming
 */

import { RealTimeDataPipeline } from './realTimeDataPipeline';
import { sportsIOPlayerService } from './sportsIOPlayerService';
import { Player, Game, LiveScore, PlayerStats } from '../types';
import { apiClient } from './apiClient';

interface LiveGameData {
  gameId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  quarter: number;
  timeRemaining: string;
  status: 'scheduled' | 'in_progress' | 'final' | 'halftime';
  lastUpdate: Date;
}

interface LivePlayerUpdate {
  playerId: string;
  stats: Partial<PlayerStats>;
  fantasyPoints: number;
  lastPlay?: string;
  gameContext: {
    gameId: string;
    quarter: number;
    timeRemaining: string;
  };
  timestamp: Date;
}

interface RealTimeSubscription {
  id: string;
  type: 'player' | 'game' | 'team' | 'all';
  entityId?: string;
  callback: (data: any) => void;
  active: boolean;
}

export class EnhancedSportsIORealTimeService {
  private pipeline: RealTimeDataPipeline;
  private subscriptions: Map<string, RealTimeSubscription> = new Map();
  private liveGames: Map<string, LiveGameData> = new Map();
  private playerUpdates: Map<string, LivePlayerUpdate> = new Map();
  private updateInterval: NodeJS.Timeout | null = null;
  private webSocketUrl = process.env.VITE_SPORTSIO_WS_URL || 'wss://api.sportsdata.io/v3/nfl/scores/ws';
  private isConnected = false;

  constructor() {
    this.pipeline = new RealTimeDataPipeline();
    this.initializeRealTimeConnection();
  }

  /**
   * Initialize WebSocket connection to Sports.io
   */
  private async initializeRealTimeConnection(): Promise<void> {
    try {
      await this.pipeline.connect(this.webSocketUrl, {
        auth: {
          apiKey: process.env.VITE_SPORTS_DATA_API_KEY,
        },
        socketOptions: {
          forceNew: true,
        }
      });

      this.isConnected = true;
      this.setupEventHandlers();
      this.startPeriodicUpdates();
      
      console.log('🏈 Connected to Sports.io real-time data stream');
    } catch (error) {
      console.error('❌ Failed to connect to Sports.io real-time:', error);
      this.fallbackToPolling();
    }
  }

  /**
   * Setup WebSocket event handlers
   */
  private setupEventHandlers(): void {
    // Live game updates
    this.pipeline.subscribe('game_update', (gameData: LiveGameData) => {
      this.handleGameUpdate(gameData);
    });

    // Player performance updates
    this.pipeline.subscribe('player_update', (playerData: LivePlayerUpdate) => {
      this.handlePlayerUpdate(playerData);
    });

    // Score updates
    this.pipeline.subscribe('score_update', (scoreData: LiveScore) => {
      this.handleScoreUpdate(scoreData);
    });

    // Injury reports
    this.pipeline.subscribe('injury_update', (injuryData: any) => {
      this.handleInjuryUpdate(injuryData);
    });
  }

  /**
   * Subscribe to real-time updates
   */
  subscribeToUpdates(
    type: 'player' | 'game' | 'team' | 'all',
    callback: (data: any) => void,
    entityId?: string
  ): string {
    const subscriptionId = `${type}_${entityId || 'all'}_${Date.now()}`;
    
    const subscription: RealTimeSubscription = {
      id: subscriptionId,
      type,
      entityId,
      callback,
      active: true
    };

    this.subscriptions.set(subscriptionId, subscription);
    
    console.log(`📡 Subscribed to ${type} updates:`, subscriptionId);
    return subscriptionId;
  }

  /**
   * Unsubscribe from updates
   */
  unsubscribe(subscriptionId: string): void {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      subscription.active = false;
      this.subscriptions.delete(subscriptionId);
      console.log(`🔇 Unsubscribed from updates:`, subscriptionId);
    }
  }

  /**
   * Get live player statistics
   */
  async getLivePlayerStats(playerId: string): Promise<LivePlayerUpdate | null> {
    try {
      // First check our cache
      const cached = this.playerUpdates.get(playerId);
      if (cached && this.isRecentUpdate(cached.timestamp)) {
        return cached;
      }

      // Fetch fresh data from Sports.io API
      const playerData = await apiClient.getSportsIOPlayer(playerId);
      if (playerData) {
        const liveUpdate: LivePlayerUpdate = {
          playerId,
          stats: playerData.stats,
          fantasyPoints: this.calculateFantasyPoints(playerData.stats),
          gameContext: await this.getPlayerGameContext(playerId),
          timestamp: new Date()
        };

        this.playerUpdates.set(playerId, liveUpdate);
        return liveUpdate;
      }

      return null;
    } catch (error) {
      console.error(`❌ Failed to get live stats for player ${playerId}:`, error);
      return null;
    }
  }

  /**
   * Get live game data
   */
  async getLiveGameData(gameId: string): Promise<LiveGameData | null> {
    try {
      const cached = this.liveGames.get(gameId);
      if (cached && this.isRecentUpdate(cached.lastUpdate)) {
        return cached;
      }

      const gameData = await apiClient.getSportsIOGame(gameId);
      if (gameData) {
        const liveGame: LiveGameData = {
          gameId,
          homeTeam: gameData.home_team,
          awayTeam: gameData.away_team,
          homeScore: gameData.home_score,
          awayScore: gameData.away_score,
          quarter: gameData.quarter || 1,
          timeRemaining: gameData.time_remaining || '15:00',
          status: gameData.status,
          lastUpdate: new Date()
        };

        this.liveGames.set(gameId, liveGame);
        return liveGame;
      }

      return null;
    } catch (error) {
      console.error(`❌ Failed to get live game data for ${gameId}:`, error);
      return null;
    }
  }

  /**
   * Get all active games with live data
   */
  async getActiveGames(): Promise<LiveGameData[]> {
    try {
      const games = await apiClient.getSportsIOGames();
      const activeGames: LiveGameData[] = [];

      for (const game of games) {
        if (game.status === 'in_progress') {
          const liveData = await this.getLiveGameData(game.game_id);
          if (liveData) {
            activeGames.push(liveData);
          }
        }
      }

      return activeGames;
    } catch (error) {
      console.error('❌ Failed to get active games:', error);
      return [];
    }
  }

  /**
   * Handle game updates from WebSocket
   */
  private handleGameUpdate(gameData: LiveGameData): void {
    this.liveGames.set(gameData.gameId, gameData);
    
    // Notify subscribers
    for (const [id, subscription] of this.subscriptions) {
      if (!subscription.active) continue;
      
      if (subscription.type === 'game' || subscription.type === 'all') {
        if (!subscription.entityId || subscription.entityId === gameData.gameId) {
          subscription.callback({
            type: 'game_update',
            data: gameData
          });
        }
      }
    }
  }

  /**
   * Handle player updates from WebSocket
   */
  private handlePlayerUpdate(playerData: LivePlayerUpdate): void {
    this.playerUpdates.set(playerData.playerId, playerData);
    
    // Notify subscribers
    for (const [id, subscription] of this.subscriptions) {
      if (!subscription.active) continue;
      
      if (subscription.type === 'player' || subscription.type === 'all') {
        if (!subscription.entityId || subscription.entityId === playerData.playerId) {
          subscription.callback({
            type: 'player_update',
            data: playerData
          });
        }
      }
    }
  }

  /**
   * Handle score updates
   */
  private handleScoreUpdate(scoreData: LiveScore): void {
    // Update game scores and notify subscribers
    const gameUpdate = this.liveGames.get(scoreData.gameId);
    if (gameUpdate) {
      gameUpdate.homeScore = scoreData.homeScore;
      gameUpdate.awayScore = scoreData.awayScore;
      gameUpdate.lastUpdate = new Date();
      
      this.handleGameUpdate(gameUpdate);
    }
  }

  /**
   * Handle injury updates
   */
  private handleInjuryUpdate(injuryData: any): void {
    // Notify subscribers about injury status changes
    for (const [id, subscription] of this.subscriptions) {
      if (!subscription.active) continue;
      
      if (subscription.type === 'player' || subscription.type === 'all') {
        subscription.callback({
          type: 'injury_update',
          data: injuryData
        });
      }
    }
  }

  /**
   * Calculate fantasy points from player stats
   */
  private calculateFantasyPoints(stats: any): number {
    let points = 0;
    
    // Passing
    points += (stats.passing_yards || 0) * 0.04;
    points += (stats.passing_tds || 0) * 4;
    points -= (stats.interceptions || 0) * 2;
    
    // Rushing
    points += (stats.rushing_yards || 0) * 0.1;
    points += (stats.rushing_tds || 0) * 6;
    
    // Receiving
    points += (stats.receiving_yards || 0) * 0.1;
    points += (stats.receiving_tds || 0) * 6;
    points += (stats.receptions || 0) * 1; // PPR
    
    return Math.round(points * 100) / 100;
  }

  /**
   * Get game context for a player
   */
  private async getPlayerGameContext(playerId: string): Promise<any> {
    // Implementation to get current game context for player
    return {
      gameId: 'unknown',
      quarter: 1,
      timeRemaining: '15:00'
    };
  }

  /**
   * Check if update is recent (within 30 seconds)
   */
  private isRecentUpdate(timestamp: Date): boolean {
    return Date.now() - timestamp.getTime() < 30000;
  }

  /**
   * Fallback to polling when WebSocket is unavailable
   */
  private fallbackToPolling(): void {
    console.log('🔄 Falling back to polling mode for real-time updates');
    
    this.updateInterval = setInterval(async () => {
      try {
        // Poll for active games
        const activeGames = await this.getActiveGames();
        
        for (const game of activeGames) {
          this.handleGameUpdate(game);
        }
      } catch (error) {
        console.error('❌ Error in polling update:', error);
      }
    }, 10000); // Poll every 10 seconds
  }

  /**
   * Start periodic updates for cached data
   */
  private startPeriodicUpdates(): void {
    this.updateInterval = setInterval(async () => {
      // Refresh active game data every 30 seconds
      try {
        const activeGames = await this.getActiveGames();
        // Process updates...
      } catch (error) {
        console.error('❌ Error in periodic update:', error);
      }
    }, 30000);
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    // Clear all subscriptions
    for (const [id, subscription] of this.subscriptions) {
      subscription.active = false;
    }
    this.subscriptions.clear();
    
    // Disconnect pipeline
    this.pipeline.disconnect?.();
    this.isConnected = false;
    
    console.log('🧹 Real-time service cleanup completed');
  }
}

// Export singleton instance
export const enhancedSportsIOService = new EnhancedSportsIORealTimeService();