/**
 * Real-Time NFL Data Service
 * Provides live NFL data feeds with WebSocket streaming for Oracle ML integration
 * Integrates ESPN API, NFL API, and weather services for comprehensive real-time data
 */

import { productionSportsDataService } from &apos;./productionSportsDataService&apos;;
import type { NFLGame, NFLPlayer } from &apos;./productionSportsDataService&apos;;

// Real-time data event types
export type RealTimeEventType = 
  | &apos;GAME_START&apos; 
  | &apos;SCORE_UPDATE&apos; 
  | &apos;PLAYER_INJURY&apos; 
  | &apos;PLAYER_STATUS_CHANGE&apos;
  | &apos;WEATHER_UPDATE&apos;
  | &apos;ODDS_UPDATE&apos;
  | &apos;QUARTER_END&apos;
  | &apos;GAME_END&apos;
  | &apos;TIMEOUT&apos;
  | &apos;PENALTY&apos;
  | &apos;TURNOVER&apos;
  | &apos;RED_ZONE_ENTRY&apos;;

export interface RealTimeGameEvent {
}
  id: string;
  type: RealTimeEventType;
  gameId: string;
  timestamp: number;
  data: {
}
    quarter?: number;
    timeRemaining?: string;
    homeScore?: number;
    awayScore?: number;
    playerId?: string;
    playerName?: string;
    team?: string;
    description: string;
    severity?: &apos;low&apos; | &apos;medium&apos; | &apos;high&apos; | &apos;critical&apos;;
    impact?: &apos;positive&apos; | &apos;negative&apos; | &apos;neutral&apos;;
  };
}

export interface LivePlayerUpdate {
}
  playerId: string;
  name: string;
  team: string;
  position: string;
  gameId: string;
  stats: {
}
    passingYards?: number;
    passingTouchdowns?: number;
    rushingYards?: number;
    rushingTouchdowns?: number;
    receivingYards?: number;
    receivingTouchdowns?: number;
    receptions?: number;
    fantasyPoints: number;
  };
  injuryStatus: &apos;healthy&apos; | &apos;questionable&apos; | &apos;doubtful&apos; | &apos;out&apos;;
  lastUpdated: number;
}

export interface LiveGameData {
}
  game: NFLGame;
  events: RealTimeGameEvent[];
  playerUpdates: LivePlayerUpdate[];
  lastUpdated: number;
}

export interface OracleDataUpdate {
}
  type: &apos;prediction_confidence_change&apos; | &apos;new_data_available&apos; | &apos;model_recalibration&apos;;
  data: {
}
    affectedPredictions: string[];
    confidenceChanges: { [predictionId: string]: number };
    newDataSources: string[];
    timestamp: number;
  };
}

// WebSocket connection interface
interface WebSocketConnection {
}
  socket: WebSocket | null;
  isConnected: boolean;
  reconnectAttempts: number;
  subscriptions: Set<string>;
}

class RealTimeNflDataService {
}
  private readonly wsConnection: WebSocketConnection = {
}
    socket: null,
    isConnected: false,
    reconnectAttempts: 0,
    subscriptions: new Set()
  };

  private readonly gameDataCache = new Map<string, LiveGameData>();
  private readonly playerDataCache = new Map<string, LivePlayerUpdate>();
  private readonly eventListeners = new Map<string, Set<(data: any) => void>>();
  
  // Polling intervals for different data types
  private intervals: { [key: string]: NodeJS.Timeout } = {};
  private readonly GAME_POLLING_INTERVAL = 10000; // 10 seconds for live games
  private readonly PLAYER_POLLING_INTERVAL = 30000; // 30 seconds for player stats
  private readonly ODDS_POLLING_INTERVAL = 120000; // 2 minutes for odds

  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private readonly RECONNECT_DELAY = 5000;

  constructor() {
}
    this.initializeConnection();
  }

  /**
   * Initialize WebSocket connection for real-time updates
   */
  private initializeConnection(): void {
}
    // In production, this would connect to a real WebSocket server
    // For now, we&apos;ll use polling as a fallback with simulation of WebSocket events
    console.log(&apos;🔄 Initializing real-time NFL data connection...&apos;);
    
    // Simulate WebSocket connection
    this.wsConnection.isConnected = true;
    this.wsConnection.reconnectAttempts = 0;
    
    // Start polling for live data
    this.startPolling();
  }

  /**
   * Start polling for different types of data
   */
  private startPolling(): void {
}
    // Poll for live game data during active games
    this.intervals.games = setInterval(() => {
}
      this.pollLiveGames();
    }, this.GAME_POLLING_INTERVAL);

    // Poll for player updates
    this.intervals.players = setInterval(() => {
}
      this.pollPlayerUpdates();
    }, this.PLAYER_POLLING_INTERVAL);

    // Poll for odds updates
    this.intervals.odds = setInterval(() => {
}
      this.pollOddsUpdates();
    }, this.ODDS_POLLING_INTERVAL);
  }

  /**
   * Poll for live game data and emit events
   */
  private async pollLiveGames(): Promise<void> {
}
    try {
}
      const liveGames = await productionSportsDataService.getLiveScores();
      
      // Ensure liveGames is iterable (array) before processing
      if (!Array.isArray(liveGames)) {
}
        console.warn(&apos;getLiveScores did not return an array:&apos;, liveGames);
        return;
      }
      
      for (const game of liveGames) {
}
        const cachedGame = this.gameDataCache.get(game.id);
        
        if (!cachedGame || this.hasGameChanged(cachedGame.game, game)) {
}
          const events = this.generateGameEvents(cachedGame?.game, game);
          const playerUpdates = await this.getPlayerUpdatesForGame(game.id);
          
          const liveGameData: LiveGameData = {
}
            game,
            events,
            playerUpdates,
            lastUpdated: Date.now()
          };
          
          this.gameDataCache.set(game.id, liveGameData);
          
          // Emit game events
          events.forEach((event: any) => {
}
            this.emit(&apos;game_event&apos;, event);
          });
          
          // Emit score updates
          if (events.some((e: any) => e.type === &apos;SCORE_UPDATE&apos;)) {
}
            this.emit(&apos;score_update&apos;, {
}
              gameId: game.id,
              homeScore: game.homeScore,
              awayScore: game.awayScore,
              timestamp: Date.now()
            });
          }
        }
      }
    } catch (error) {
}
      console.error(&apos;❌ Error polling live games:&apos;, error);
    }
  }

  /**
   * Poll for player status updates
   */
  private async pollPlayerUpdates(): Promise<void> {
}
    try {
}
      const playerUpdates = await productionSportsDataService.getPlayerUpdates();
      
      // Ensure playerUpdates is iterable (array) before processing
      if (!Array.isArray(playerUpdates)) {
}
        console.warn(&apos;getPlayerUpdates did not return an array:&apos;, playerUpdates);
        return;
      }
      
      for (const player of playerUpdates) {
}
        const cached = this.playerDataCache.get(player.id);
        
        if (!cached || this.hasPlayerChanged(cached, player)) {
}
          const liveUpdate: LivePlayerUpdate = {
}
            playerId: player.id,
            name: player.name,
            team: player.team,
            position: player.position,
            gameId: this.findPlayerGameId(player.id),
            stats: {
}
              passingYards: player.stats.passingYards,
              passingTouchdowns: player.stats.passingTouchdowns,
              rushingYards: player.stats.rushingYards,
              rushingTouchdowns: player.stats.rushingTouchdowns,
              receivingYards: player.stats.receivingYards,
              receivingTouchdowns: player.stats.receivingTouchdowns,
              receptions: player.stats.receptions,
              fantasyPoints: player.stats.fantasyPoints || 0
            },
            injuryStatus: player.injuryStatus || &apos;healthy&apos;,
            lastUpdated: Date.now()
          };
          
          this.playerDataCache.set(player.id, liveUpdate);
          
          // Generate player update events
          if (cached && cached.injuryStatus !== liveUpdate.injuryStatus) {
}
            this.emit(&apos;player_injury&apos;, {
}
              playerId: player.id,
              name: player.name,
              team: player.team,
              oldStatus: cached.injuryStatus,
              newStatus: liveUpdate.injuryStatus,
              timestamp: Date.now()
            });
          }
          
          this.emit(&apos;player_update&apos;, liveUpdate);
        }
      }
    } catch (error) {
}
      console.error(&apos;❌ Error polling player updates:&apos;, error);
    }
  }

  /**
   * Poll for odds updates
   */
  private async pollOddsUpdates(): Promise<void> {
}
    try {
}
      const games = await productionSportsDataService.getCurrentWeekGames();
      
      // Ensure games is iterable (array) before processing
      if (!Array.isArray(games)) {
}
        console.warn(&apos;getCurrentWeekGames did not return an array:&apos;, games);
        return;
      }
      
      for (const game of games) {
}
        if (game.odds) {
}
          this.emit(&apos;odds_update&apos;, {
}
            gameId: game.id,
            odds: game.odds,
            timestamp: Date.now()
          });
        }
      }
    } catch (error) {
}
      console.error(&apos;❌ Error polling odds updates:&apos;, error);
    }
  }

  /**
   * Check if game data has changed
   */
  private hasGameChanged(oldGame: NFLGame | undefined, newGame: NFLGame): boolean {
}
    if (!oldGame) return true;
    
    return (
      oldGame.homeScore !== newGame.homeScore ||
      oldGame.awayScore !== newGame.awayScore ||
      oldGame.status !== newGame.status
    );
  }

  /**
   * Check if player data has changed
   */
  private hasPlayerChanged(oldPlayer: LivePlayerUpdate, newPlayer: NFLPlayer): boolean {
}
    return (
      oldPlayer.injuryStatus !== (newPlayer.injuryStatus || &apos;healthy&apos;) ||
      oldPlayer.stats.fantasyPoints !== (newPlayer.stats.fantasyPoints || 0)
    );
  }

  /**
   * Generate game events based on changes
   */
  private generateGameEvents(oldGame: NFLGame | undefined, newGame: NFLGame): RealTimeGameEvent[] {
}
    const events: RealTimeGameEvent[] = [];
    
    if (!oldGame) {
}
      // New game started
      if (newGame.status === &apos;live&apos;) {
}
        events.push({
}
          id: `${newGame.id}_start_${Date.now()}`,
          type: &apos;GAME_START&apos;,
          gameId: newGame.id,
          timestamp: Date.now(),
          data: {
}
            description: `${newGame.awayTeam.name} @ ${newGame.homeTeam.name} has started`,
            impact: &apos;neutral&apos;
          }
        });
      }
    } else {
}
      // Score changes
      if (oldGame.homeScore !== newGame.homeScore || oldGame.awayScore !== newGame.awayScore) {
}
        events.push({
}
          id: `${newGame.id}_score_${Date.now()}`,
          type: &apos;SCORE_UPDATE&apos;,
          gameId: newGame.id,
          timestamp: Date.now(),
          data: {
}
            homeScore: newGame.homeScore,
            awayScore: newGame.awayScore,
            description: `Score Update: ${newGame.awayTeam.abbreviation} ${newGame.awayScore} - ${newGame.homeTeam.abbreviation} ${newGame.homeScore}`,
            impact: &apos;positive&apos;
          }
        });
      }
      
      // Game status changes
      if (oldGame.status !== newGame.status && newGame.status === &apos;completed&apos;) {
}
        events.push({
}
          id: `${newGame.id}_end_${Date.now()}`,
          type: &apos;GAME_END&apos;,
          gameId: newGame.id,
          timestamp: Date.now(),
          data: {
}
            homeScore: newGame.homeScore,
            awayScore: newGame.awayScore,
            description: `Final: ${newGame.awayTeam.abbreviation} ${newGame.awayScore} - ${newGame.homeTeam.abbreviation} ${newGame.homeScore}`,
            impact: &apos;neutral&apos;
          }
        });
      }
    }
    
    return events;
  }

  /**
   * Find the current game ID for a player
   */
  private findPlayerGameId(playerId: string): string {
}
    // This would lookup current game for player from API
    // For now, return a placeholder
    return `game_week_${this.getCurrentWeek()}_${playerId.substring(0, 8)}`;
  }

  /**
   * Get player updates for a specific game
   */
  private async getPlayerUpdatesForGame(gameId: string): Promise<LivePlayerUpdate[]> {
}
    try {
}
      const allPlayers = await productionSportsDataService.getPlayerUpdates();
      return allPlayers
        .filter((player: any) => this.findPlayerGameId(player.id) === gameId)
        .map((player: any) => ({
}
          playerId: player.id,
          name: player.name,
          team: player.team,
          position: player.position,
          gameId,
          stats: {
}
            passingYards: player.stats.passingYards,
            passingTouchdowns: player.stats.passingTouchdowns,
            rushingYards: player.stats.rushingYards,
            rushingTouchdowns: player.stats.rushingTouchdowns,
            receivingYards: player.stats.receivingYards,
            receivingTouchdowns: player.stats.receivingTouchdowns,
            receptions: player.stats.receptions,
            fantasyPoints: player.stats.fantasyPoints || 0
          },
          injuryStatus: player.injuryStatus || &apos;healthy&apos;,
          lastUpdated: Date.now()
        }));
    } catch (error) {
}
      console.error(&apos;❌ Error getting player updates for game:&apos;, error);
      return [];
    }
  }

  /**
   * Get current NFL week
   */
  private getCurrentWeek(): number {
}
    // Simple calculation for current week - in production this would be more sophisticated
    const now = new Date();
    const seasonStart = new Date(now.getFullYear(), 8, 1); // September 1st
    const weeksSinceStart = Math.floor((now.getTime() - seasonStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
    return Math.min(Math.max(weeksSinceStart + 1, 1), 18);
  }

  /**
   * Subscribe to real-time events
   */
  public subscribe(eventType: string, callback: (data: any) => void): void {
}
    if (!this.eventListeners.has(eventType)) {
}
      this.eventListeners.set(eventType, new Set());
    }
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
}
      listeners.add(callback);
    }
  }

  /**
   * Unsubscribe from real-time events
   */
  public unsubscribe(eventType: string, callback: (data: any) => void): void {
}
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
}
      listeners.delete(callback);
    }
  }

  /**
   * Emit events to subscribers
   */
  private emit(eventType: string, data: any): void {
}
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
}
      listeners.forEach((callback: any) => {
}
        try {
}
          callback(data);
        } catch (error) {
}
          console.error(`❌ Error in event listener for ${eventType}:`, error);
        }
      });
    }
  }

  /**
   * Get live data for specific game
   */
  public getLiveGameData(gameId: string): LiveGameData | null {
}
    return this.gameDataCache.get(gameId) || null;
  }

  /**
   * Get all live games
   */
  public getAllLiveGames(): LiveGameData[] {
}
    return Array.from(this.gameDataCache.values());
  }

  /**
   * Get player updates for specific player
   */
  public getPlayerUpdate(playerId: string): LivePlayerUpdate | null {
}
    return this.playerDataCache.get(playerId) || null;
  }

  /**
   * Force refresh of all data
   */
  public async forceRefresh(): Promise<void> {
}
    await Promise.all([
      this.pollLiveGames(),
      this.pollPlayerUpdates(),
      this.pollOddsUpdates()
    ]);
  }

  /**
   * Start real-time monitoring
   */
  public start(): void {
}
    if (!this.wsConnection.isConnected) {
}
      this.initializeConnection();
    }
    console.log(&apos;🚀 Real-time NFL data service started&apos;);
  }

  /**
   * Stop real-time monitoring
   */
  public stop(): void {
}
    // Clear all intervals
    Object.values(this.intervals).forEach((interval: any) => {
}
      clearInterval(interval);
    });
    this.intervals = {};
    
    // Close WebSocket if connected
    if (this.wsConnection.socket) {
}
      this.wsConnection.socket.close();
      this.wsConnection.socket = null;
    }
    
    this.wsConnection.isConnected = false;
    console.log(&apos;🛑 Real-time NFL data service stopped&apos;);
  }

  /**
   * Get connection status
   */
  public getConnectionStatus(): { isConnected: boolean; reconnectAttempts: number; subscriptions: number } {
}
    return {
}
      isConnected: this.wsConnection.isConnected,
      reconnectAttempts: this.wsConnection.reconnectAttempts,
      subscriptions: this.wsConnection.subscriptions.size
    };
  }
}

// Export singleton instance
export const realTimeNflDataService = new RealTimeNflDataService();
