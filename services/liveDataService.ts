
import type { League, Team, GamedayEvent, LiveNewsItem, GamedayEventType, PlayerPosition } from &apos;../types&apos;;
import { realTimeNflDataService } from &apos;./realTimeNflDataService&apos;;
import { oracleLiveDataIntegrationService, type OracleIntelligenceUpdate } from &apos;./oracleLiveDataIntegrationService&apos;;
import type { RealTimeGameEvent, LivePlayerUpdate } from &apos;./realTimeNflDataService&apos;;
import { logger } from &apos;./loggingService&apos;;

// This is a singleton to provide live data integration across the application
class LiveDataService {
}
    private intervalId: ReturnType<typeof setInterval> | null = null;
    private listeners: ((event: GamedayEvent | LiveNewsItem) => void)[] = [];
    private isActive = false;

    constructor() {
}
        this.setupRealTimeListeners();
    }

    /**
     * Set up listeners for real-time NFL data events
     */
    private setupRealTimeListeners(): void {
}
        // Listen to real-time game events and convert to app events
        realTimeNflDataService.subscribe(&apos;game_event&apos;, (event: RealTimeGameEvent) => {
}
            const gamedayEvent: GamedayEvent = {
}
                id: event.id,
                type: this.convertEventType(event.type),
                timestamp: event.timestamp,
                text: event.data.description,
                teamId: 1, // Default team ID
                player: {
}
                    id: parseInt(event.data.playerId || &apos;1&apos;),
                    name: event.data.playerName || &apos;Player&apos;,
                    position: &apos;RB&apos;,
                    team: event.data.team || &apos;NFL&apos;,
                    rank: 1,
                    adp: 1,
                    bye: 0,
                    tier: 1,
                    age: 25,
                    auctionValue: 1,
                    stats: {
}
                        projection: 0,
                        lastYear: 0,
                        vorp: 0,
                        weeklyProjections: {}
                    }
                },
                points: 0
            };
            
            this.emit(gamedayEvent);
        });

        // Listen to player updates
        realTimeNflDataService.subscribe(&apos;player_update&apos;, (update: LivePlayerUpdate) => {
}
            const gamedayEvent: GamedayEvent = {
}
                id: `player_update_${update.playerId}_${Date.now()}`,
                type: &apos;BIG_PLAY&apos;,
                timestamp: update.lastUpdated,
                text: `${update.name} has ${update.stats.fantasyPoints} fantasy points`,
                teamId: 1,
                player: {
}
                    id: parseInt(update.playerId.replace(/\D/g, &apos;&apos;) || &apos;1&apos;),
                    name: update.name,
                    position: (update.position as PlayerPosition) || &apos;RB&apos;,
                    team: update.team,
                    rank: 1,
                    adp: 1,
                    bye: 0,
                    tier: 1,
                    age: 25,
                    auctionValue: 1,
                    stats: {
}
                        projection: update.stats.fantasyPoints,
                        lastYear: 0,
                        vorp: 0,
                        weeklyProjections: {}
                    }
                },
                points: update.stats.fantasyPoints
            };
            
            this.emit(gamedayEvent);
        });

        // Listen to player injuries
        realTimeNflDataService.subscribe(&apos;player_injury&apos;, (data: {
}
            playerId: string;
            name: string;
            team: string;
            oldStatus: string;
            newStatus: string;
            timestamp: number;
        }) => {
}
            const gamedayEvent: GamedayEvent = {
}
                id: `injury_${data.playerId}_${Date.now()}`,
                type: &apos;FUMBLE&apos;, // Using closest available type for negative events
                timestamp: data.timestamp,
                text: `${data.name} injury status: ${data.oldStatus} → ${data.newStatus}`,
                teamId: 1,
                player: {
}
                    id: parseInt(data.playerId.replace(/\D/g, &apos;&apos;) || &apos;1&apos;),
                    name: data.name,
                    position: &apos;RB&apos;,
                    team: data.team,
                    rank: 1,
                    adp: 1,
                    bye: 0,
                    tier: 1,
                    age: 25,
                    auctionValue: 1,
                    stats: {
}
                        projection: 0,
                        lastYear: 0,
                        vorp: 0,
                        weeklyProjections: {}
                    }
                },
                points: -5 // Negative points for injury
            };
            
            this.emit(gamedayEvent);
        });

        // Listen to Oracle intelligence updates
        oracleLiveDataIntegrationService.subscribe(&apos;intelligence_update&apos;, (update: OracleIntelligenceUpdate) => {
}
            const newsItem: LiveNewsItem = {
}
                id: `oracle_${Date.now()}`,
                date: new Date(update.timestamp).toISOString(),
                headline: update.title,
                source: &apos;Oracle AI&apos;
            };
            
            this.emit(newsItem);
        });
    }

    /**
     * Convert real-time event types to app event types
     */
    private convertEventType(eventType: string): GamedayEventType {
}
        const eventTypeMap: { [key: string]: GamedayEventType } = {
}
            &apos;SCORE_UPDATE&apos;: &apos;TOUCHDOWN&apos;,
            &apos;PLAYER_INJURY&apos;: &apos;FUMBLE&apos;,
            &apos;TURNOVER&apos;: &apos;FUMBLE&apos;,
            &apos;RED_ZONE_ENTRY&apos;: &apos;REDZONE_ENTRY&apos;,
            &apos;GAME_START&apos;: &apos;BIG_PLAY&apos;,
            &apos;GAME_END&apos;: &apos;BIG_PLAY&apos;,
            &apos;QUARTER_END&apos;: &apos;BIG_PLAY&apos;
        };
        
        return eventTypeMap[eventType] || &apos;BIG_PLAY&apos;;
    }

    start(_league: League, _myTeam: Team, _opponentTeam: Team) {
}
        if (this.intervalId) {
}
            this.stop();
        }
        
        this.isActive = true;
        
        // Start real-time services
        realTimeNflDataService.start();
        oracleLiveDataIntegrationService.start();
        
        logger.info(&apos;🚀 Live Data Service started with real-time integration&apos;);
        
        // Generate initial welcome event
        this.emit({
}
            id: &apos;welcome_live_data&apos;,
            type: &apos;BIG_PLAY&apos;,
            timestamp: Date.now(),
            text: &apos;Real-time NFL data and Oracle insights are now active&apos;,
            teamId: 1,
            player: {
}
                id: 1,
                name: &apos;Oracle System&apos;,
                position: &apos;QB&apos;,
                team: &apos;NFL&apos;,
                rank: 1,
                adp: 1,
                bye: 0,
                tier: 1,
                age: 25,
                auctionValue: 1,
                stats: {
}
                    projection: 0,
                    lastYear: 0,
                    vorp: 0,
                    weeklyProjections: {}
                }
            },
            points: 5
        });
    }

    stop() {
}
        if (this.intervalId) {
}
            window.clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        this.isActive = false;
        
        // Stop real-time services
        realTimeNflDataService.stop();
        oracleLiveDataIntegrationService.stop();
        
        logger.info(&apos;🛑 Live Data Service stopped&apos;);
    }

    subscribe(listener: (event: GamedayEvent | LiveNewsItem) => void) {
}
        this.listeners.push(listener);
    }

    unsubscribe(listener: (event: GamedayEvent | LiveNewsItem) => void) {
}
        this.listeners = this.listeners.filter((l: any) => l !== listener);
    }

    private emit(event: GamedayEvent | LiveNewsItem) {
}
        this.listeners.forEach((listener: any) => {
}
            try {
}
                listener(event);
            } catch (error) {
}
                console.error(&apos;❌ Error in live data listener:&apos;, error);
            }
        });
    }

    /**
     * Get connection status for all live data services
     */
    getStatus() {
}
        return {
}
            isActive: this.isActive,
            realTimeNfl: realTimeNflDataService.getConnectionStatus(),
            oracleIntegration: oracleLiveDataIntegrationService.getStatus(),
            listeners: this.listeners.length
        };
    }

    /**
     * Force refresh all live data
     */
    async forceRefresh() {
}
        if (this.isActive) {
}
            await realTimeNflDataService.forceRefresh();
        }
    }
}

// Export a single instance to be used across the app
export const liveDataService = new LiveDataService();
