/**
 * Draft Service
 * Handles live draft functionality with WebSocket integration
 */

import { apiService } from &apos;./apiService&apos;;
import { socketService } from &apos;./socketService&apos;;

export interface Draft {
}
  id: string;
  leagueId: string;
  type: &apos;snake&apos; | &apos;auction&apos; | &apos;linear&apos;;
  status: &apos;SCHEDULED&apos; | &apos;IN_PROGRESS&apos; | &apos;PAUSED&apos; | &apos;COMPLETED&apos; | &apos;CANCELLED&apos;;
  scheduledDate: string;
  startedAt?: string;
  completedAt?: string;
  settings: {
}
    pickTimeLimit: number;
    rounds: number;
    autoPickEnabled: boolean;
    tradingEnabled: boolean;
    pauseOnDisconnect: boolean;
    auctionSettings?: {
}
      budget: number;
      minBid: number;
      bidIncrement: number;
      nominationTime: number;
      biddingTime: number;
    };
  };
  draftOrder: Array<{
}
    teamId: string;
    position: number;
    isOnline: boolean;
    lastSeen: string;
  }>;
  currentPick: {
}
    round: number;
    pick: number;
    overallPick: number;
    teamId: string;
    timeRemaining: number;
    pickStartedAt?: string;
  };
  picks: DraftPick[];
  chatMessages: ChatMessage[];
  stats: {
}
    totalPickTime: number;
    averagePickTime: number;
    autoPickCount: number;
    tradeCount: number;
    pauseCount: number;
  };
  userTeam?: {
}
    id: string;
    name: string;
    position: number;
  };
  isUserTurn: boolean;
  upcomingPicks: Array<{
}
    round: number;
    pick: number;
    overallPick: number;
    teamId: string;
  }>;
  recentPicks: DraftPick[];
}

export interface DraftPick {
}
  round: number;
  pick: number;
  overallPick: number;
  teamId: string;
  teamName: string;
  playerId: string;
  playerName: string;
  playerPosition: string;
  playerTeam: string;
  pickTime: number;
  isAutoPick: boolean;
  timestamp: string;
}

export interface ChatMessage {
}
  userId: string;
  username: string;
  avatar?: string;
  message: string;
  timestamp: string;
  type: &apos;message&apos; | &apos;pick&apos; | &apos;trade&apos; | &apos;system&apos;;
}

export interface AvailablePlayer {
}
  id: string;
  name: string;
  position: string;
  team: string;
  rankings: {
}
    overall?: number;
    position?: number;
  };
  projections?: {
}
    season?: {
}
      fantasyPoints: {
}
        standard: number;
        ppr: number;
        halfPpr: number;
      };
    };
  };
  photoUrl?: string;
  injuryStatus: {
}
    designation: string;
    description?: string;
  };
}

class DraftService {
}
  private draftCallbacks: Map<string, (data: any) => void> = new Map();
  private currentDraftId: string | null = null;

  constructor() {
}
    this.initializeSocketListeners();
  }

  /**
   * Initialize WebSocket listeners for draft events
   */
  private initializeSocketListeners(): void {
}
    // Draft events
    socketService.on(&apos;draft:started&apos;, (data: any) => this.handleDraftEvent(&apos;started&apos;, data));
    socketService.on(&apos;draft:pick_made&apos;, (data: any) => this.handleDraftEvent(&apos;pick_made&apos;, data));
    socketService.on(&apos;draft:auto_pick&apos;, (data: any) => this.handleDraftEvent(&apos;auto_pick&apos;, data));
    socketService.on(&apos;draft:pick_skipped&apos;, (data: any) => this.handleDraftEvent(&apos;pick_skipped&apos;, data));
    socketService.on(&apos;draft:paused&apos;, (data: any) => this.handleDraftEvent(&apos;paused&apos;, data));
    socketService.on(&apos;draft:resumed&apos;, (data: any) => this.handleDraftEvent(&apos;resumed&apos;, data));
    socketService.on(&apos;draft:pick_timer&apos;, (data: any) => this.handleDraftEvent(&apos;timer_update&apos;, data));
    socketService.on(&apos;draft:chat_message&apos;, (data: any) => this.handleDraftEvent(&apos;chat_message&apos;, data));
    socketService.on(&apos;draft:user_joined&apos;, (data: any) => this.handleDraftEvent(&apos;user_joined&apos;, data));
    socketService.on(&apos;draft:user_left&apos;, (data: any) => this.handleDraftEvent(&apos;user_left&apos;, data));
    socketService.on(&apos;draft:error&apos;, (data: any) => this.handleDraftEvent(&apos;error&apos;, data));
  }

  /**
   * Handle draft events from WebSocket
   */
  private handleDraftEvent(eventType: string, data: any): void {
}
    const callback = this.draftCallbacks.get(eventType);
    if (callback) {
}
      callback(data);
    }

    // Also trigger generic draft update callback
    const updateCallback = this.draftCallbacks.get(&apos;draft_update&apos;);
    if (updateCallback) {
}
      updateCallback({ type: eventType, data });
    }
  }

  /**
   * Subscribe to draft events
   */
  subscribeToDraftEvents(eventType: string, callback: (data: any) => void): void {
}
    this.draftCallbacks.set(eventType, callback);
  }

  /**
   * Unsubscribe from draft events
   */
  unsubscribeFromDraftEvents(eventType: string): void {
}
    this.draftCallbacks.delete(eventType);
  }

  /**
   * Create a new draft
   */
  async createDraft(
    leagueId: string,
    scheduledDate: string,
    settings?: Partial<Draft[&apos;settings&apos;]>
  ): Promise<Draft> {
}
    const response = await apiService.post(&apos;/draft/create&apos;, {
}
      leagueId,
      scheduledDate,
//       settings
    });
    return response.data.draft;
  }

  /**
   * Get draft for a league
   */
  async getDraft(leagueId: string): Promise<Draft> {
}
    const response = await apiService.get(`/draft/league/${leagueId}`);
    return response.data.draft;
  }

  /**
   * Join a draft room (WebSocket)
   */
  async joinDraftRoom(draftId: string, token: string): Promise<void> {
}
    this.currentDraftId = draftId;
    
    // Authenticate with draft room
    socketService.emit(&apos;draft:authenticate&apos;, { token, draftId });
    
    // Wait for authentication response
    return new Promise((resolve, reject) => {
}
      const timeout = setTimeout(() => {
}
        reject(new Error(&apos;Draft authentication timeout&apos;));
      }, 10000);

      socketService.once(&apos;draft:authenticated&apos;, (response: any) => {
}
        clearTimeout(timeout);
        if (response.success) {
}
          resolve();
        } else {
}
          reject(new Error(response.error || &apos;Authentication failed&apos;));
        }
      });

      socketService.once(&apos;draft:error&apos;, (error: any) => {
}
        clearTimeout(timeout);
        reject(new Error(error.error || &apos;Failed to join draft room&apos;));
      });
    });
  }

  /**
   * Leave draft room
   */
  leaveDraftRoom(): void {
}
    if (this.currentDraftId) {
}
      socketService.disconnect();
      this.currentDraftId = null;
      this.draftCallbacks.clear();
    }
  }

  /**
   * Start a draft (commissioner only)
   */
  async startDraft(draftId: string): Promise<Draft> {
}
    const response = await apiService.post(`/draft/${draftId}/start`);
    return response.data.draft;
  }

  /**
   * Make a draft pick
   */
  async makePick(draftId: string, playerId: string, pickTime?: number): Promise<void> {
}
    // Send via WebSocket for real-time response
    socketService.emit(&apos;draft:make_pick&apos;, { playerId, pickTime });
  }

  /**
   * Make a draft pick via API (fallback)
   */
  async makePickAPI(draftId: string, playerId: string, pickTime?: number): Promise<any> {
}
    const response = await apiService.post(`/draft/${draftId}/pick`, {
}
      playerId,
//       pickTime
    });
    return response.data;
  }

  /**
   * Toggle autopick setting
   */
  async toggleAutopick(draftId: string, enabled: boolean): Promise<void> {
}
    socketService.emit(&apos;draft:toggle_autopick&apos;, { enabled });
  }

  /**
   * Pause draft (commissioner only)
   */
  async pauseDraft(draftId: string, reason?: string): Promise<void> {
}
    socketService.emit(&apos;draft:pause&apos;, { reason });
  }

  /**
   * Resume draft (commissioner only)
   */
  async resumeDraft(draftId: string): Promise<void> {
}
    socketService.emit(&apos;draft:resume&apos;);
  }

  /**
   * Send chat message
   */
  async sendChatMessage(draftId: string, message: string): Promise<void> {
}
    socketService.emit(&apos;draft:chat_message&apos;, { message });
  }

  /**
   * Get available players for drafting
   */
  async getAvailablePlayers(
    draftId: string,
    options: {
}
      position?: string;
      limit?: number;
      search?: string;
    } = {}
  ): Promise<AvailablePlayer[]> {
}
    const params = {
}
      position: options.position,
      limit: options.limit || 100,
      search: options.search
    };
    
    const response = await apiService.get(`/draft/${draftId}/available-players`, { params });
    return response.data.players;
  }

  /**
   * Get user&apos;s active drafts
   */
  async getActiveDrafts(): Promise<Draft[]> {
}
    const response = await apiService.get(&apos;/draft/active&apos;);
    return response.data.drafts;
  }

  /**
   * Get draft pick recommendations (AI-powered)
   */
  async getDraftRecommendations(
    draftId: string,
    position?: string,
    count: number = 5
  ): Promise<{
}
    recommendations: Array<{
}
      player: AvailablePlayer;
      reasoning: string;
      confidence: number;
    }>;
    analysis: string;
  }> {
}
    // This would integrate with the Oracle AI service
    try {
}
      const availablePlayers = await this.getAvailablePlayers(draftId, { position, limit: 20 });
      
      // Simple recommendation logic (would be replaced with AI analysis)
      const recommendations = availablePlayers
        .slice(0, count)
        .map((player: any) => ({
}
          player,
          reasoning: `Ranked #${player.rankings.overall || &apos;N/A&apos;} overall, strong ${position || &apos;player&apos;} option`,
          confidence: Math.max(0.6, Math.random() * 0.4 + 0.6)
        }));

      return {
}
        recommendations,
        analysis: `Top ${count} available ${position || &apos;players&apos;} based on rankings and projections.`
      };
    } catch (error) {
}
      console.error(&apos;Error getting draft recommendations:&apos;, error);
      return {
}
        recommendations: [],
        analysis: &apos;Unable to generate recommendations at this time.&apos;
      };
    }
  }

  /**
   * Calculate pick value and timing
   */
  calculatePickValue(pick: DraftPick, averagePickTime: number): {
}
    isGoodValue: boolean;
    pickSpeed: &apos;fast&apos; | &apos;average&apos; | &apos;slow&apos;;
    reasoning: string;
  } {
}
    const playerRank = 999; // Would get from player data
    const expectedRank = pick.overallPick;
    
    const isGoodValue = playerRank <= expectedRank + 10; // Within 10 spots of expected
    
    let pickSpeed: &apos;fast&apos; | &apos;average&apos; | &apos;slow&apos; = &apos;average&apos;;
    if (pick.pickTime < averagePickTime * 0.5) pickSpeed = &apos;fast&apos;;
    else if (pick.pickTime > averagePickTime * 1.5) pickSpeed = &apos;slow&apos;;
    
    let reasoning = `Picked in ${pick.pickTime}s`;
    if (isGoodValue) reasoning += &apos;, good value&apos;;
    if (pick.isAutoPick) reasoning += &apos;, auto-picked&apos;;
    
    return { isGoodValue, pickSpeed, reasoning };
  }

  /**
   * Format pick time for display
   */
  formatPickTime(seconds: number): string {
}
    if (seconds < 60) {
}
      return `${seconds}s`;
    } else {
}
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds}s`;
    }
  }

  /**
   * Get draft progress percentage
   */
  getDraftProgress(draft: Draft): number {
}
    const totalPicks = draft.draftOrder.length * draft.settings.rounds;
    const completedPicks = draft.picks.length;
    return Math.round((completedPicks / totalPicks) * 100);
  }

  /**
   * Get time until user&apos;s next pick
   */
  getTimeUntilNextPick(draft: Draft): {
}
    picksUntilTurn: number;
    estimatedTime: number; // in seconds
  } {
}
    if (!draft.userTeam) {
}
      return { picksUntilTurn: 0, estimatedTime: 0 };
    }

    const userTeamId = draft.userTeam.id;
    const upcomingPicks = draft.upcomingPicks;
    
    const userPickIndex = upcomingPicks.findIndex(pick => pick.teamId === userTeamId);
    
    if (userPickIndex === -1) {
}
      return { picksUntilTurn: 0, estimatedTime: 0 };
    }

    const picksUntilTurn = userPickIndex;
    const estimatedTime = picksUntilTurn * draft.settings.pickTimeLimit;

    return { picksUntilTurn, estimatedTime };
  }

  /**
   * Check if draft can be started
   */
  canStartDraft(draft: Draft): { canStart: boolean; reason?: string } {
}
    if (draft.status !== &apos;SCHEDULED&apos;) {
}
      return { canStart: false, reason: &apos;Draft is not scheduled&apos; };
    }

    if (draft.draftOrder.length < 4) {
}
      return { canStart: false, reason: &apos;Need at least 4 teams to start draft&apos; };
    }

    const now = new Date();
    const scheduledDate = new Date(draft.scheduledDate);
    
    if (now < scheduledDate) {
}
      return { canStart: false, reason: &apos;Draft is not yet scheduled to start&apos; };
    }

    return { canStart: true };
  }

  /**
   * Get draft room status
   */
  getDraftRoomStatus(draft: Draft): {
}
    onlineTeams: number;
    totalTeams: number;
    onlinePercentage: number;
    recentActivity: string;
  } {
}
    const onlineTeams = draft.draftOrder.filter((team: any) => team.isOnline).length;
    const totalTeams = draft.draftOrder.length;
    const onlinePercentage = Math.round((onlineTeams / totalTeams) * 100);
    
    let recentActivity = &apos;No recent activity&apos;;
    if (draft.picks.length > 0) {
}
      const lastPick = draft.picks[draft.picks.length - 1];
      const timeSince = Date.now() - new Date(lastPick.timestamp).getTime();
      const minutesAgo = Math.floor(timeSince / 60000);
      recentActivity = `Last pick ${minutesAgo}m ago`;
    }

    return {
}
      onlineTeams,
      totalTeams,
      onlinePercentage,
//       recentActivity
    };
  }
}

export const draftService = new DraftService();