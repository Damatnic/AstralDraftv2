/**
 * Mobile Offline Service
 * Enhanced offline functionality specifically for mobile draft management
 */

import { Player, Team, League } from &apos;../types&apos;;
import CacheService from &apos;./cacheService&apos;;

interface DraftPick {
}
    playerId: number;
    teamId: number;
    pick: number;
    timestamp: number;
    round: number;
    pickInRound: number;
}

interface OfflineAction {
}
    id: string;
    type: &apos;DRAFT_PLAYER&apos; | &apos;UPDATE_ROSTER&apos; | &apos;TRADE_PROPOSAL&apos; | &apos;WAIVER_CLAIM&apos; | &apos;SETTINGS_UPDATE&apos;;
    payload: any;
    timestamp: number;
    retryCount: number;
    maxRetries: number;
}

interface OfflineData {
}
    players: Player[];
    teams: Team[];
    leagues: League[];
    userDrafts: DraftPick[];
    lastSync: number;
    version: string;
}

interface OfflineState {
}
    isOffline: boolean;
    hasOfflineData: boolean;
    pendingActions: OfflineAction[];
    lastSync: Date | null;
    syncInProgress: boolean;
}

class MobileOfflineService {
}
    private readonly STORAGE_KEYS = {
}
        OFFLINE_DATA: &apos;astral_offline_data&apos;,
        PENDING_ACTIONS: &apos;astral_pending_actions&apos;,
        OFFLINE_STATE: &apos;astral_offline_state&apos;,
        PLAYER_CACHE: &apos;astral_players_cache&apos;,
        DRAFT_CACHE: &apos;astral_draft_cache&apos;
    };

    private readonly CACHE_DURATION = {
}
        PLAYERS: 24 * 60 * 60 * 1000, // 24 hours
        LEAGUES: 60 * 60 * 1000,     // 1 hour
        DRAFTS: 10 * 60 * 1000,      // 10 minutes
        USER_DATA: 30 * 60 * 1000    // 30 minutes
    };

    private readonly cacheService: CacheService;
    private offlineState: OfflineState;
    private subscribers: Array<(state: OfflineState) => void> = [];
    private networkStatusListener: (() => void) | null = null;

    constructor() {
}
        this.cacheService = new CacheService({
}
            maxSize: 500,
            defaultTTL: this.CACHE_DURATION.LEAGUES,
            enablePersistence: true,
            storagePrefix: &apos;mobile_offline_&apos;
        });

        this.offlineState = this.loadOfflineState();
        this.initializeNetworkMonitoring();
        this.initializePeriodicSync();
    }

    /**
     * Initialize network status monitoring
     */
    private initializeNetworkMonitoring(): void {
}
        const updateOnlineStatus = () => {
}
            const wasOffline = this.offlineState.isOffline;
            this.offlineState.isOffline = !navigator.onLine;
            
            if (wasOffline && navigator.onLine) {
}
                // Just came back online - trigger sync
                this.syncPendingActions();
            }
            
            this.notifySubscribers();
        };

        this.networkStatusListener = updateOnlineStatus;
        window.addEventListener(&apos;online&apos;, updateOnlineStatus);
        window.addEventListener(&apos;offline&apos;, updateOnlineStatus);
        
        // Initial status check
        updateOnlineStatus();
    }

    /**
     * Cache critical draft data for offline use
     */
    async cacheDraftData(players: Player[], leagues: League[], teams: Team[]): Promise<void> {
}
        try {
}
            const offlineData: OfflineData = {
}
                players,
                teams,
                leagues,
                userDrafts: [],
                lastSync: Date.now(),
                version: &apos;1.0.0&apos;
            };

            // Store in multiple locations for redundancy
            localStorage.setItem(this.STORAGE_KEYS.OFFLINE_DATA, JSON.stringify(offlineData));
            
            // Cache individual collections for better performance
            this.cacheService.set(this.STORAGE_KEYS.PLAYER_CACHE, players, this.CACHE_DURATION.PLAYERS);
            this.cacheService.set(&apos;leagues_cache&apos;, leagues, this.CACHE_DURATION.LEAGUES);
            this.cacheService.set(&apos;teams_cache&apos;, teams, this.CACHE_DURATION.USER_DATA);

            this.offlineState.hasOfflineData = true;
            this.offlineState.lastSync = new Date();
            this.saveOfflineState();
            
            console.log(&apos;✅ Draft data cached for offline use&apos;, {
}
                players: players.length,
                leagues: leagues.length,
                teams: teams.length
            });
        } catch (error) {
}
            console.error(&apos;❌ Failed to cache draft data:&apos;, error);
        }
    }

    /**
     * Get cached players with offline fallback
     */
    getCachedPlayers(): Player[] {
}
        try {
}
            // Try cache first
            let players = this.cacheService.get<Player[]>(this.STORAGE_KEYS.PLAYER_CACHE);
            
            if (!players) {
}
                // Fallback to offline data
                const offlineData = this.getOfflineData();
                players = offlineData?.players || [];
            }
            
            return players;
        } catch (error) {
}
            console.error(&apos;❌ Failed to get cached players:&apos;, error);
            return [];
        }
    }

    /**
     * Get cached leagues with offline fallback
     */
    getCachedLeagues(): League[] {
}
        try {
}
            let leagues = this.cacheService.get<League[]>(&apos;leagues_cache&apos;);
            
            if (!leagues) {
}
                const offlineData = this.getOfflineData();
                leagues = offlineData?.leagues || [];
            }
            
            return leagues;
        } catch (error) {
}
            console.error(&apos;❌ Failed to get cached leagues:&apos;, error);
            return [];
        }
    }

    /**
     * Queue action for when back online
     */
    queueOfflineAction(type: OfflineAction[&apos;type&apos;], payload: any): string {
}
        const action: OfflineAction = {
}
            id: `${type}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            type,
            payload,
            timestamp: Date.now(),
            retryCount: 0,
            maxRetries: 3
        };

        this.offlineState.pendingActions.push(action);
        this.savePendingActions();
        
        console.log(&apos;📋 Queued offline action:&apos;, action.type, action.id);
        return action.id;
    }

    /**
     * Execute a draft pick offline
     */
    async draftPlayerOffline(playerId: number, teamId: number, pick: number): Promise<boolean> {
}
        try {
}
            // Cache the pick locally
            const draftPick: DraftPick = {
}
                playerId,
                teamId,
                pick,
                timestamp: Date.now(),
                round: Math.ceil(pick / 12), // Assuming 12 teams
                pickInRound: ((pick - 1) % 12) + 1
            };

            // Store pick in cache
            const existingPicks = this.cacheService.get<DraftPick[]>(this.STORAGE_KEYS.DRAFT_CACHE) || [];
            existingPicks.push(draftPick);
            this.cacheService.set(this.STORAGE_KEYS.DRAFT_CACHE, existingPicks, this.CACHE_DURATION.DRAFTS);

            // Queue for sync when online
            this.queueOfflineAction(&apos;DRAFT_PLAYER&apos;, {
}
                playerId,
                teamId,
                pick,
                timestamp: draftPick.timestamp
            });

            console.log(&apos;✅ Player drafted offline:&apos;, { playerId, teamId, pick });
            return true;
        } catch (error) {
}
            console.error(&apos;❌ Failed to draft player offline:&apos;, error);
            return false;
        }
    }

    /**
     * Sync pending actions when back online
     */
    async syncPendingActions(): Promise<void> {
}
        if (this.offlineState.isOffline || this.offlineState.syncInProgress) {
}
            return;
        }

        this.offlineState.syncInProgress = true;
        this.notifySubscribers();

        try {
}
            const actionsToSync = [...this.offlineState.pendingActions];
            const successfulActions: string[] = [];

            for (const action of actionsToSync) {
}
                try {
}
                    const success = await this.executeAction(action);
                    if (success) {
}
                        successfulActions.push(action.id);
                    } else {
}
                        action.retryCount++;
                        if (action.retryCount >= action.maxRetries) {
}
                            console.warn(&apos;⚠️ Action failed after max retries:&apos;, action.id);
                            successfulActions.push(action.id); // Remove failed actions
                        }
                    }
                } catch (error) {
}
                    console.error(&apos;❌ Failed to sync action:&apos;, action.id, error);
                    action.retryCount++;
                }
            }

            // Remove successful actions
            this.offlineState.pendingActions = this.offlineState.pendingActions.filter(
                action => !successfulActions.includes(action.id)
            );

            this.savePendingActions();
            this.offlineState.lastSync = new Date();
            
            console.log(&apos;✅ Sync completed:&apos;, {
}
                synced: successfulActions.length,
                remaining: this.offlineState.pendingActions.length
            });
        } catch (error) {
}
            console.error(&apos;❌ Sync failed:&apos;, error);
        } finally {
}
            this.offlineState.syncInProgress = false;
            this.saveOfflineState();
            this.notifySubscribers();
        }
    }

    /**
     * Execute a pending action
     */
    private async executeAction(action: OfflineAction): Promise<boolean> {
}
        // This would integrate with your existing API services
        switch (action.type) {
}
            case &apos;DRAFT_PLAYER&apos;:
                // Call your draft API
                return await this.syncDraftPlayer(action.payload);
            case &apos;UPDATE_ROSTER&apos;:
                // Call roster update API
                return await this.syncRosterUpdate(action.payload);
            case &apos;TRADE_PROPOSAL&apos;:
                // Call trade proposal API
                return await this.syncTradeProposal(action.payload);
            default:
                console.warn(&apos;Unknown action type:&apos;, action.type);
                return false;
        }
    }

    /**
     * Sync draft player action
     */
    private async syncDraftPlayer(payload: any): Promise<boolean> {
}
        try {
}
            // Replace with actual API call
            console.log(&apos;🔄 Syncing draft player:&apos;, payload);
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // For now, return true to simulate success
            return true;
        } catch (error) {
}
            console.error(&apos;❌ Failed to sync draft player:&apos;, error);
            return false;
        }
    }

    /**
     * Sync roster update action
     */
    private async syncRosterUpdate(payload: any): Promise<boolean> {
}
        try {
}
            console.log(&apos;🔄 Syncing roster update:&apos;, payload);
            await new Promise(resolve => setTimeout(resolve, 500));
            return true;
        } catch (error) {
}
            console.error(&apos;❌ Failed to sync roster update:&apos;, error);
            return false;
        }
    }

    /**
     * Sync trade proposal action
     */
    private async syncTradeProposal(payload: any): Promise<boolean> {
}
        try {
}
            console.log(&apos;🔄 Syncing trade proposal:&apos;, payload);
            await new Promise(resolve => setTimeout(resolve, 800));
            return true;
        } catch (error) {
}
            console.error(&apos;❌ Failed to sync trade proposal:&apos;, error);
            return false;
        }
    }

    /**
     * Get offline data from storage
     */
    private getOfflineData(): OfflineData | null {
}
        try {
}
            const data = localStorage.getItem(this.STORAGE_KEYS.OFFLINE_DATA);
            return data ? JSON.parse(data) : null;
        } catch (error) {
}
            console.error(&apos;❌ Failed to get offline data:&apos;, error);
            return null;
        }
    }

    /**
     * Load offline state from storage
     */
    private loadOfflineState(): OfflineState {
}
        try {
}
            const stored = localStorage.getItem(this.STORAGE_KEYS.OFFLINE_STATE);
            if (stored) {
}
                const state = JSON.parse(stored);
                return {
}
                    ...state,
                    lastSync: state.lastSync ? new Date(state.lastSync) : null,
                    syncInProgress: false // Always reset sync status on load
                };
            }
        } catch (error) {
}
            console.error(&apos;❌ Failed to load offline state:&apos;, error);
        }

        return {
}
            isOffline: !navigator.onLine,
            hasOfflineData: false,
            pendingActions: [],
            lastSync: null,
            syncInProgress: false
        };
    }

    /**
     * Save offline state to storage
     */
    private saveOfflineState(): void {
}
        try {
}
            localStorage.setItem(this.STORAGE_KEYS.OFFLINE_STATE, JSON.stringify(this.offlineState));
        } catch (error) {
}
            console.error(&apos;❌ Failed to save offline state:&apos;, error);
        }
    }

    /**
     * Save pending actions to storage
     */
    private savePendingActions(): void {
}
        try {
}
            localStorage.setItem(this.STORAGE_KEYS.PENDING_ACTIONS, JSON.stringify(this.offlineState.pendingActions));
        } catch (error) {
}
            console.error(&apos;❌ Failed to save pending actions:&apos;, error);
        }
    }

    /**
     * Initialize periodic sync attempts
     */
    private initializePeriodicSync(): void {
}
        setInterval(() => {
}
            if (!this.offlineState.isOffline && this.offlineState.pendingActions.length > 0) {
}
                this.syncPendingActions();
            }
        }, 30000); // Try sync every 30 seconds when online
    }

    /**
     * Subscribe to offline state changes
     */
    subscribe(callback: (state: OfflineState) => void): () => void {
}
        this.subscribers.push(callback);
        
        // Return unsubscribe function return() => {
}
            const index = this.subscribers.indexOf(callback);
            if (index > -1) {
}
                this.subscribers.splice(index, 1);
            }
        };
    }

    /**
     * Notify all subscribers of state changes
     */
    private notifySubscribers(): void {
}
        this.subscribers.forEach((callback: any) => {
}
            try {
}
                callback(this.offlineState);
            } catch (error) {
}
                console.error(&apos;❌ Subscriber callback failed:&apos;, error);
            }
        });
    }

    /**
     * Get current offline state
     */
    getState(): OfflineState {
}
        return { ...this.offlineState };
    }

    /**
     * Clear all offline data and cache
     */
    clearOfflineData(): void {
}
        try {
}
            Object.values(this.STORAGE_KEYS).forEach((key: any) => {
}
                localStorage.removeItem(key);
            });
            
            this.offlineState = {
}
                isOffline: !navigator.onLine,
                hasOfflineData: false,
                pendingActions: [],
                lastSync: null,
                syncInProgress: false
            };
            
            console.log(&apos;✅ Offline data cleared&apos;);
        } catch (error) {
}
            console.error(&apos;❌ Failed to clear offline data:&apos;, error);
        }
    }

    /**
     * Cleanup resources
     */
    destroy(): void {
}
        if (this.networkStatusListener) {
}
            window.removeEventListener(&apos;online&apos;, this.networkStatusListener);
            window.removeEventListener(&apos;offline&apos;, this.networkStatusListener);
        }
        this.subscribers = [];
    }
}

// Export singleton instance
export const mobileOfflineService = new MobileOfflineService();
export default MobileOfflineService;
