/**
 * Draft Service
 * Handles live draft functionality with WebSocket integration
 */

import { apiService } from './apiService';
import { socketService } from './socketService';

export interface Draft {
  id: string;
  leagueId: string;
  type: 'snake' | 'auction' | 'linear';
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
  scheduledDate: string;
  startedAt?: string;
  completedAt?: string;
  settings: {
    pickTimeLimit: number;
    rounds: number;
    autoPickEnabled: boolean;
    tradingEnabled: boolean;
    pauseOnDisconnect: boolean;
    auctionSettings?: {
      budget: number;
      minBid: number;
      bidIncrement: number;
      nominationTime: number;
      biddingTime: number;
    };
  };
  draftOrder: Array<{
    teamId: string;
    position: number;
    isOnline: boolean;
    lastSeen: string;
  }>;
  currentPick: {
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
    totalPickTime: number;
    averagePickTime: number;
    autoPickCount: number;
    tradeCount: number;
    pauseCount: number;
  };
  userTeam?: {
    id: string;
    name: string;
    position: number;
  };
  isUserTurn: boolean;
  upcomingPicks: Array<{
    round: number;
    pick: number;
    overallPick: number;
    teamId: string;
  }>;
  recentPicks: DraftPick[];
}

export interface DraftPick {
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
  userId: string;
  username: string;
  avatar?: string;
  message: string;
  timestamp: string;
  type: 'message' | 'pick' | 'trade' | 'system';
}

export interface AvailablePlayer {
  id: string;
  name: string;
  position: string;
  team: string;
  rankings: {
    overall?: number;
    position?: number;
  };
  projections?: {
    season?: {
      fantasyPoints: {
        standard: number;
        ppr: number;
        halfPpr: number;
      };
    };
  };
  photoUrl?: string;
  injuryStatus: {
    designation: string;
    description?: string;
  };
}

class DraftService {
  private draftCallbacks: Map<string, (data: any) => void> = new Map();
  private currentDraftId: string | null = null;

  constructor() {
    this.initializeSocketListeners();
  }

  /**
   * Initialize WebSocket listeners for draft events
   */
  private initializeSocketListeners(): void {
    // Draft events
    socketService.on('draft:started', (data: any) => this.handleDraftEvent('started', data));
    socketService.on('draft:pick_made', (data: any) => this.handleDraftEvent('pick_made', data));
    socketService.on('draft:auto_pick', (data: any) => this.handleDraftEvent('auto_pick', data));
    socketService.on('draft:pick_skipped', (data: any) => this.handleDraftEvent('pick_skipped', data));
    socketService.on('draft:paused', (data: any) => this.handleDraftEvent('paused', data));
    socketService.on('draft:resumed', (data: any) => this.handleDraftEvent('resumed', data));
    socketService.on('draft:pick_timer', (data: any) => this.handleDraftEvent('timer_update', data));
    socketService.on('draft:chat_message', (data: any) => this.handleDraftEvent('chat_message', data));
    socketService.on('draft:user_joined', (data: any) => this.handleDraftEvent('user_joined', data));
    socketService.on('draft:user_left', (data: any) => this.handleDraftEvent('user_left', data));
    socketService.on('draft:error', (data: any) => this.handleDraftEvent('error', data));
  }

  /**
   * Handle draft events from WebSocket
   */
  private handleDraftEvent(eventType: string, data: any): void {
    const callback = this.draftCallbacks.get(eventType);
    if (callback) {
      callback(data);
    }

    // Also trigger generic draft update callback
    const updateCallback = this.draftCallbacks.get('draft_update');
    if (updateCallback) {
      updateCallback({ type: eventType, data });
    }
  }

  /**
   * Subscribe to draft events
   */
  subscribeToDraftEvents(eventType: string, callback: (data: any) => void): void {
    this.draftCallbacks.set(eventType, callback);
  }

  /**
   * Unsubscribe from draft events
   */
  unsubscribeFromDraftEvents(eventType: string): void {
    this.draftCallbacks.delete(eventType);
  }

  /**
   * Create a new draft
   */
  async createDraft(
    leagueId: string,
    scheduledDate: string,
    settings?: Partial<Draft['settings']>
  ): Promise<Draft> {
    const response = await apiService.post('/draft/create', {
      leagueId,
      scheduledDate,
      settings
    });
    return response.data.draft;
  }

  /**
   * Get draft for a league
   */
  async getDraft(leagueId: string): Promise<Draft> {
    const response = await apiService.get(`/draft/league/${leagueId}`);
    return response.data.draft;
  }

  /**
   * Join a draft room (WebSocket)
   */
  async joinDraftRoom(draftId: string, token: string): Promise<void> {
    this.currentDraftId = draftId;
    
    // Authenticate with draft room
    socketService.emit('draft:authenticate', { token, draftId });
    
    // Wait for authentication response
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Draft authentication timeout'));
      }, 10000);

      socketService.once('draft:authenticated', (response: any) => {
        clearTimeout(timeout);
        if (response.success) {
          resolve();
        } else {
          reject(new Error(response.error || 'Authentication failed'));
        }
      });

      socketService.once('draft:error', (error: any) => {
        clearTimeout(timeout);
        reject(new Error(error.error || 'Failed to join draft room'));
      });
    });
  }

  /**
   * Leave draft room
   */
  leaveDraftRoom(): void {
    if (this.currentDraftId) {
      socketService.disconnect();
      this.currentDraftId = null;
      this.draftCallbacks.clear();
    }
  }

  /**
   * Start a draft (commissioner only)
   */
  async startDraft(draftId: string): Promise<Draft> {
    const response = await apiService.post(`/draft/${draftId}/start`);
    return response.data.draft;
  }

  /**
   * Make a draft pick
   */
  async makePick(draftId: string, playerId: string, pickTime?: number): Promise<void> {
    // Send via WebSocket for real-time response
    socketService.emit('draft:make_pick', { playerId, pickTime });
  }

  /**
   * Make a draft pick via API (fallback)
   */
  async makePickAPI(draftId: string, playerId: string, pickTime?: number): Promise<any> {
    const response = await apiService.post(`/draft/${draftId}/pick`, {
      playerId,
      pickTime
    });
    return response.data;
  }

  /**
   * Toggle autopick setting
   */
  async toggleAutopick(draftId: string, enabled: boolean): Promise<void> {
    socketService.emit('draft:toggle_autopick', { enabled });
  }

  /**
   * Pause draft (commissioner only)
   */
  async pauseDraft(draftId: string, reason?: string): Promise<void> {
    socketService.emit('draft:pause', { reason });
  }

  /**
   * Resume draft (commissioner only)
   */
  async resumeDraft(draftId: string): Promise<void> {
    socketService.emit('draft:resume');
  }

  /**
   * Send chat message
   */
  async sendChatMessage(draftId: string, message: string): Promise<void> {
    socketService.emit('draft:chat_message', { message });
  }

  /**
   * Get available players for drafting
   */
  async getAvailablePlayers(
    draftId: string,
    options: {
      position?: string;
      limit?: number;
      search?: string;
    } = {}
  ): Promise<AvailablePlayer[]> {
    const params = {
      position: options.position,
      limit: options.limit || 100,
      search: options.search
    };
    
    const response = await apiService.get(`/draft/${draftId}/available-players`, { params });
    return response.data.players;
  }

  /**
   * Get user's active drafts
   */
  async getActiveDrafts(): Promise<Draft[]> {
    const response = await apiService.get('/draft/active');
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
    recommendations: Array<{
      player: AvailablePlayer;
      reasoning: string;
      confidence: number;
    }>;
    analysis: string;
  }> {
    // This would integrate with the Oracle AI service
    try {
      const availablePlayers = await this.getAvailablePlayers(draftId, { position, limit: 20 });
      
      // Simple recommendation logic (would be replaced with AI analysis)
      const recommendations = availablePlayers
        .slice(0, count)
        .map((player: any) => ({
          player,
          reasoning: `Ranked #${player.rankings.overall || 'N/A'} overall, strong ${position || 'player'} option`,
          confidence: Math.max(0.6, Math.random() * 0.4 + 0.6)
        }));

      return {
        recommendations,
        analysis: `Top ${count} available ${position || 'players'} based on rankings and projections.`
      };
    } catch (error) {
      console.error('Error getting draft recommendations:', error);
      return {
        recommendations: [],
        analysis: 'Unable to generate recommendations at this time.'
      };
    }
  }

  /**
   * Calculate pick value and timing
   */
  calculatePickValue(pick: DraftPick, averagePickTime: number): {
    isGoodValue: boolean;
    pickSpeed: 'fast' | 'average' | 'slow';
    reasoning: string;
  } {
    const playerRank = 999; // Would get from player data
    const expectedRank = pick.overallPick;
    
    const isGoodValue = playerRank <= expectedRank + 10; // Within 10 spots of expected
    
    let pickSpeed: 'fast' | 'average' | 'slow' = 'average';
    if (pick.pickTime < averagePickTime * 0.5) pickSpeed = 'fast';
    else if (pick.pickTime > averagePickTime * 1.5) pickSpeed = 'slow';
    
    let reasoning = `Picked in ${pick.pickTime}s`;
    if (isGoodValue) reasoning += ', good value';
    if (pick.isAutoPick) reasoning += ', auto-picked';
    
    return { isGoodValue, pickSpeed, reasoning };
  }

  /**
   * Format pick time for display
   */
  formatPickTime(seconds: number): string {
    if (seconds < 60) {
      return `${seconds}s`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds}s`;
    }
  }

  /**
   * Get draft progress percentage
   */
  getDraftProgress(draft: Draft): number {
    const totalPicks = draft.draftOrder.length * draft.settings.rounds;
    const completedPicks = draft.picks.length;
    return Math.round((completedPicks / totalPicks) * 100);
  }

  /**
   * Get time until user's next pick
   */
  getTimeUntilNextPick(draft: Draft): {
    picksUntilTurn: number;
    estimatedTime: number; // in seconds
  } {
    if (!draft.userTeam) {
      return { picksUntilTurn: 0, estimatedTime: 0 };
    }

    const userTeamId = draft.userTeam.id;
    const upcomingPicks = draft.upcomingPicks;
    
    const userPickIndex = upcomingPicks.findIndex(pick => pick.teamId === userTeamId);
    
    if (userPickIndex === -1) {
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
    if (draft.status !== 'SCHEDULED') {
      return { canStart: false, reason: 'Draft is not scheduled' };
    }

    if (draft.draftOrder.length < 4) {
      return { canStart: false, reason: 'Need at least 4 teams to start draft' };
    }

    const now = new Date();
    const scheduledDate = new Date(draft.scheduledDate);
    
    if (now < scheduledDate) {
      return { canStart: false, reason: 'Draft is not yet scheduled to start' };
    }

    return { canStart: true };
  }

  /**
   * Get draft room status
   */
  getDraftRoomStatus(draft: Draft): {
    onlineTeams: number;
    totalTeams: number;
    onlinePercentage: number;
    recentActivity: string;
  } {
    const onlineTeams = draft.draftOrder.filter((team: any) => team.isOnline).length;
    const totalTeams = draft.draftOrder.length;
    const onlinePercentage = Math.round((onlineTeams / totalTeams) * 100);
    
    let recentActivity = 'No recent activity';
    if (draft.picks.length > 0) {
      const lastPick = draft.picks[draft.picks.length - 1];
      const timeSince = Date.now() - new Date(lastPick.timestamp).getTime();
      const minutesAgo = Math.floor(timeSince / 60000);
      recentActivity = `Last pick ${minutesAgo}m ago`;
    }

    return {
      onlineTeams,
      totalTeams,
      onlinePercentage,
      recentActivity
    };
  }
}

export const draftService = new DraftService();