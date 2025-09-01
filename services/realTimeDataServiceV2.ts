/**
 * Real-Time Sports Data Service
 * Handles live updates for Oracle predictions, game scores, player stats, and injury reports
 */

import { apiClient } from &apos;./apiClient&apos;;
import { oraclePredictionService } from &apos;./oraclePredictionService&apos;;

export interface LiveGameUpdate {
}
    gameId: string;
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    quarter: number;
    timeRemaining: string;
    status: &apos;PRE_GAME&apos; | &apos;IN_PROGRESS&apos; | &apos;HALFTIME&apos; | &apos;FINAL&apos; | &apos;POSTPONED&apos;;
    lastUpdate: string;
}

export interface LivePlayerUpdate {
}
    playerId: string;
    name: string;
    position: string;
    team: string;
    fantasyPoints: number;
    isActive: boolean;
    injuryStatus?: string;
    lastUpdate: string;
}

export interface InjuryAlert {
}
    playerId: string;
    playerName: string;
    team: string;
    injuryType: string;
    severity: &apos;MINOR&apos; | &apos;MODERATE&apos; | &apos;SEVERE&apos; | &apos;SEASON_ENDING&apos;;
    expectedReturn?: string;
    timestamp: string;
    gameImpact: &apos;NONE&apos; | &apos;LIMITED&apos; | &apos;OUT&apos; | &apos;DOUBTFUL&apos;;
}

export interface PredictionUpdate {
}
    predictionId: string;
    newConfidence: number;
    updatedReasoning: string;
    triggerEvent: string;
    timestamp: string;
}

export type UpdateCallback = (update: any) => void;

class RealTimeDataService {
}
    private isActive = false;
    private readonly updateInterval: number = 30000; // 30 seconds default
    private readonly gameTimeInterval: number = 10000; // 10 seconds during games
    private readonly injuryCheckInterval: number = 60000; // 1 minute for injury updates
    
    private readonly gameUpdateCallbacks: UpdateCallback[] = [];
    private readonly playerUpdateCallbacks: UpdateCallback[] = [];
    private readonly injuryAlertCallbacks: UpdateCallback[] = [];
    private readonly predictionUpdateCallbacks: UpdateCallback[] = [];
    
    private intervals: NodeJS.Timeout[] = [];
    private readonly lastGameUpdates: Map<string, LiveGameUpdate> = new Map();
    private readonly lastPlayerUpdates: Map<string, LivePlayerUpdate> = new Map();
    private readonly activeGames: Set<string> = new Set();

    /**
     * Start real-time data monitoring
     */
    async startRealTimeUpdates(): Promise<void> {
}
        if (this.isActive) {
}
            console.log(&apos;Real-time updates already active&apos;);
            return;
        }

        this.isActive = true;
        console.log(&apos;🚀 Starting real-time sports data monitoring...&apos;);

        // Initialize with current game state
        await this.initializeGameState();

        // Set up periodic updates
        this.setupGameUpdates();
        this.setupPlayerUpdates();
        this.setupInjuryMonitoring();
        this.setupPredictionRefresh();

        console.log(&apos;✅ Real-time monitoring active&apos;);
    }

    /**
     * Stop all real-time updates
     */
    stopRealTimeUpdates(): void {
}
        this.isActive = false;
        this.intervals.forEach((interval: any) => clearInterval(interval));
        this.intervals = [];
        console.log(&apos;🛑 Real-time updates stopped&apos;);
    }

    /**
     * Register callbacks for different update types
     */
    onGameUpdate(callback: UpdateCallback): void {
}
        this.gameUpdateCallbacks.push(callback);
    }

    onPlayerUpdate(callback: UpdateCallback): void {
}
        this.playerUpdateCallbacks.push(callback);
    }

    onInjuryAlert(callback: UpdateCallback): void {
}
        this.injuryAlertCallbacks.push(callback);
    }

    onPredictionUpdate(callback: UpdateCallback): void {
}
        this.predictionUpdateCallbacks.push(callback);
    }

    /**
     * Initialize current game state
     */
    private async initializeGameState(): Promise<void> {
}
        try {
}
            const currentWeek = this.getCurrentNFLWeek();
            const games = await apiClient.getSportsIOGames(currentWeek);

            // Track active games using correct API structure
            games.forEach((game: any) => {
}
                if (game.status === &apos;in_progress&apos;) {
}
                    this.activeGames.add(game.game_id);
                }
            });

            console.log(`📊 Initialized with ${games.length} games, ${this.activeGames.size} active`);
        } catch (error) {
}
            console.error(&apos;Failed to initialize game state:&apos;, error);
        }
    }

    /**
     * Set up game score updates
     */
    private setupGameUpdates(): void {
}
        const updateGames = async () => {
}
            if (!this.isActive) return;

            try {
}
                const currentWeek = this.getCurrentNFLWeek();
                const games = await apiClient.getSportsIOGames(currentWeek);
                
                for (const game of games) {
}
                    const lastUpdate = this.lastGameUpdates.get(game.game_id);
                    
                    // Check if game has meaningful updates
                    if (this.hasGameChanged(game, lastUpdate)) {
}
                        const liveUpdate: LiveGameUpdate = {
}
                            gameId: game.game_id,
                            homeTeam: game.home_team,
                            awayTeam: game.away_team,
                            homeScore: game.home_score || 0,
                            awayScore: game.away_score || 0,
                            quarter: game.quarter || 0,
                            timeRemaining: game.time_remaining || &apos;&apos;,
                            status: this.mapGameStatus(game.status),
                            lastUpdate: new Date().toISOString()
                        };

                        this.lastGameUpdates.set(game.game_id, liveUpdate);
                        this.notifyGameUpdateCallbacks(liveUpdate);

                        // Update active games tracking
                        if (liveUpdate.status === &apos;IN_PROGRESS&apos;) {
}
                            this.activeGames.add(game.game_id);
                        } else if (liveUpdate.status === &apos;FINAL&apos;) {
}
                            this.activeGames.delete(game.game_id);
                        }
                    }
                }
            } catch (error) {
}
                console.error(&apos;Game update failed:&apos;, error);
            }
        };

        // Use faster updates during game time
        const interval = this.activeGames.size > 0 ? this.gameTimeInterval : this.updateInterval;
        const gameInterval = setInterval(updateGames, interval);
        this.intervals.push(gameInterval);

        // Initial update
        updateGames();
    }

    /**
     * Set up player performance updates
     */
    private setupPlayerUpdates(): void {
}
        const updatePlayers = async () => {
}
            if (!this.isActive) return;

            try {
}
                const players = await apiClient.getPlayerUpdates();
                
                for (const player of players) {
}
                    const lastUpdate = this.lastPlayerUpdates.get(player.id);
                    
                    if (this.hasPlayerChanged(player, lastUpdate)) {
}
                        const liveUpdate: LivePlayerUpdate = {
}
                            playerId: player.id,
                            name: player.name,
                            position: player.position,
                            team: player.team,
                            fantasyPoints: this.calculateFantasyPoints(player),
                            isActive: !player.injuryStatus || player.injuryStatus === &apos;healthy&apos;,
                            injuryStatus: player.injuryStatus,
                            lastUpdate: new Date().toISOString()
                        };

                        this.lastPlayerUpdates.set(player.id, liveUpdate);
                        this.notifyPlayerUpdateCallbacks(liveUpdate);
                    }
                }
            } catch (error) {
}
                console.error(&apos;Player update failed:&apos;, error);
            }
        };

        const playerInterval = setInterval(updatePlayers, this.updateInterval);
        this.intervals.push(playerInterval);
        updatePlayers();
    }

    /**
     * Set up injury monitoring
     */
    private setupInjuryMonitoring(): void {
}
        const checkInjuries = async () => {
}
            if (!this.isActive) return;

            try {
}
                // Simulate injury monitoring - in production, integrate with injury API
                const players = await apiClient.getPlayerUpdates();
                const injuredPlayers = players.filter((p: any) => p.injuryStatus && p.injuryStatus !== &apos;healthy&apos;);
                
                for (const player of injuredPlayers) {
}
                    if (this.isNewInjury(player)) {
}
                        const alert: InjuryAlert = {
}
                            playerId: player.id,
                            playerName: player.name,
                            team: player.team,
                            injuryType: player.injuryStatus || &apos;Unknown&apos;,
                            severity: this.mapInjurySeverity(player.injuryStatus || &apos;&apos;),
                            timestamp: new Date().toISOString(),
                            gameImpact: this.assessGameImpact(player.injuryStatus || &apos;&apos;)
                        };

                        this.notifyInjuryAlertCallbacks(alert);
                        
                        // Trigger prediction updates for significant injuries
                        if (alert.severity === &apos;SEVERE&apos; || alert.severity === &apos;SEASON_ENDING&apos;) {
}
                            await this.triggerPredictionUpdate(`Major injury: ${alert.playerName}`, alert);
                        }
                    }
                }
            } catch (error) {
}
                console.error(&apos;Injury monitoring failed:&apos;, error);
            }
        };

        const injuryInterval = setInterval(checkInjuries, this.injuryCheckInterval);
        this.intervals.push(injuryInterval);
        checkInjuries();
    }

    /**
     * Set up prediction refresh based on live events
     */
    private setupPredictionRefresh(): void {
}
        const refreshPredictions = async () => {
}
            if (!this.isActive) return;

            try {
}
                const currentWeek = this.getCurrentNFLWeek();
                const predictions = await oraclePredictionService.generateWeeklyPredictions(currentWeek);
                
                // Check if any predictions need confidence adjustments
                for (const prediction of predictions) {
}
                    const shouldUpdate = await this.shouldUpdatePrediction(prediction);
                    if (shouldUpdate.update) {
}
                        const update: PredictionUpdate = {
}
                            predictionId: prediction.id,
                            newConfidence: shouldUpdate.newConfidence,
                            updatedReasoning: shouldUpdate.reasoning,
                            triggerEvent: shouldUpdate.trigger,
                            timestamp: new Date().toISOString()
                        };
                        
                        this.notifyPredictionUpdateCallbacks(update);
                    }
                }
            } catch (error) {
}
                console.error(&apos;Prediction refresh failed:&apos;, error);
            }
        };

        const predictionInterval = setInterval(refreshPredictions, this.updateInterval * 3); // Every 90 seconds
        this.intervals.push(predictionInterval);
    }

    // Helper methods
    private hasGameChanged(current: any, last?: LiveGameUpdate): boolean {
}
        if (!last) return true;
        
        return (
            current.home_score !== last.homeScore ||
            current.away_score !== last.awayScore ||
            current.quarter !== last.quarter ||
            current.status !== this.mapGameStatusReverse(last.status) ||
            current.time_remaining !== last.timeRemaining
        );
    }

    private hasPlayerChanged(current: any, last?: LivePlayerUpdate): boolean {
}
        if (!last) return true;
        
        const currentFantasyPoints = this.calculateFantasyPoints(current);
        const currentIsActive = !current.injury_status || current.injury_status === &apos;healthy&apos;;
        
        return (
            currentFantasyPoints !== last.fantasyPoints ||
            currentIsActive !== last.isActive ||
            current.injury_status !== last.injuryStatus
        );
    }

    private calculateFantasyPoints(player: any): number {
}
        const stats = player.stats || {};
        let points = 0;
        
        // Standard fantasy scoring
        points += (stats.passing_yards || 0) * 0.04; // 1 point per 25 passing yards
        points += (stats.passing_tds || 0) * 4; // 4 points per passing TD
        points += (stats.rushing_yards || 0) * 0.1; // 1 point per 10 rushing yards
        points += (stats.rushing_tds || 0) * 6; // 6 points per rushing TD
        points += (stats.receiving_yards || 0) * 0.1; // 1 point per 10 receiving yards
        points += (stats.receiving_tds || 0) * 6; // 6 points per receiving TD
        points += (stats.receptions || 0) * 1; // 1 point per reception (PPR)
        
        return Math.round(points * 10) / 10; // Round to 1 decimal
    }

    private mapGameStatus(status: string): LiveGameUpdate[&apos;status&apos;] {
}
        const statusMap: Record<string, LiveGameUpdate[&apos;status&apos;]> = {
}
            &apos;scheduled&apos;: &apos;PRE_GAME&apos;,
            &apos;in_progress&apos;: &apos;IN_PROGRESS&apos;,
            &apos;completed&apos;: &apos;FINAL&apos;
        };
        return statusMap[status] || &apos;PRE_GAME&apos;;
    }

    private mapGameStatusReverse(status: LiveGameUpdate[&apos;status&apos;]): string {
}
        const statusMap: Record<LiveGameUpdate[&apos;status&apos;], string> = {
}
            &apos;PRE_GAME&apos;: &apos;scheduled&apos;,
            &apos;IN_PROGRESS&apos;: &apos;in_progress&apos;,
            &apos;HALFTIME&apos;: &apos;in_progress&apos;,
            &apos;FINAL&apos;: &apos;completed&apos;,
            &apos;POSTPONED&apos;: &apos;scheduled&apos;
        };
        return statusMap[status] || &apos;scheduled&apos;;
    }

    private mapInjurySeverity(injuryStatus: string): InjuryAlert[&apos;severity&apos;] {
}
        const lowerStatus = injuryStatus.toLowerCase();
        if (lowerStatus.includes(&apos;out&apos;) || lowerStatus.includes(&apos;ir&apos;)) return &apos;SEASON_ENDING&apos;;
        if (lowerStatus.includes(&apos;doubtful&apos;)) return &apos;SEVERE&apos;;
        if (lowerStatus.includes(&apos;questionable&apos;)) return &apos;MODERATE&apos;;
        return &apos;MINOR&apos;;
    }

    private assessGameImpact(injuryStatus: string): InjuryAlert[&apos;gameImpact&apos;] {
}
        const lowerStatus = injuryStatus.toLowerCase();
        if (lowerStatus.includes(&apos;out&apos;)) return &apos;OUT&apos;;
        if (lowerStatus.includes(&apos;doubtful&apos;)) return &apos;DOUBTFUL&apos;;
        if (lowerStatus.includes(&apos;questionable&apos;)) return &apos;LIMITED&apos;;
        return &apos;NONE&apos;;
    }

    private isNewInjury(player: any): boolean {
}
        // Simple check - in production, maintain injury history
        const lastUpdate = this.lastPlayerUpdates.get(player.player_id);
        return !lastUpdate || lastUpdate.injuryStatus !== player.injury_status;
    }

    private async shouldUpdatePrediction(prediction: any): Promise<{
}
        update: boolean;
        newConfidence: number;
        reasoning: string;
        trigger: string;
    }> {
}
        // Simplified logic - in production, implement sophisticated analysis
        return {
}
            update: false,
            newConfidence: prediction.confidence,
            reasoning: prediction.reasoning,
            trigger: &apos;&apos;
        };
    }

    private async triggerPredictionUpdate(trigger: string, data: any): Promise<void> {
}
        console.log(`🔄 Prediction update triggered: ${trigger}`, data);
        // Could regenerate specific predictions here
    }

    private getCurrentNFLWeek(): number {
}
        // Calculate current NFL week based on season schedule
        const now = new Date();
        const seasonStart = new Date(now.getFullYear(), 8, 1); // September 1st
        const diffTime = Math.abs(now.getTime() - seasonStart.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.min(Math.max(Math.ceil(diffDays / 7), 1), 18); // NFL has 18 weeks
    }

    // Callback notification methods
    private notifyGameUpdateCallbacks(update: LiveGameUpdate): void {
}
        this.gameUpdateCallbacks.forEach((callback: any) => {
}
            try {
}
                callback(update);
            } catch (error) {
}
                console.error(&apos;Game update callback error:&apos;, error);
            }
        });
    }

    private notifyPlayerUpdateCallbacks(update: LivePlayerUpdate): void {
}
        this.playerUpdateCallbacks.forEach((callback: any) => {
}
            try {
}
                callback(update);
            } catch (error) {
}
                console.error(&apos;Player update callback error:&apos;, error);
            }
        });
    }

    private notifyInjuryAlertCallbacks(alert: InjuryAlert): void {
}
        this.injuryAlertCallbacks.forEach((callback: any) => {
}
            try {
}
                callback(alert);
            } catch (error) {
}
                console.error(&apos;Injury alert callback error:&apos;, error);
            }
        });
    }

    private notifyPredictionUpdateCallbacks(update: PredictionUpdate): void {
}
        this.predictionUpdateCallbacks.forEach((callback: any) => {
}
            try {
}
                callback(update);
            } catch (error) {
}
                console.error(&apos;Prediction update callback error:&apos;, error);
            }
        });
    }
}

// Export singleton instance
export const realTimeDataService = new RealTimeDataService();
export default realTimeDataService;
