/**
 * Real-Time Draft Service V2
 * Advanced draft room functionality with WebSocket integration
 * Supports snake drafts, auction drafts, and dynasty formats
 */

import { enhancedWebSocketService } from &apos;./enhancedWebSocketService&apos;;
import { EventEmitter } from &apos;events&apos;;

// Types and Interfaces
export interface DraftSettings {
}
  id: string;
  leagueId: string;
  type: &apos;snake&apos; | &apos;auction&apos; | &apos;dynasty&apos;;
  rounds: number;
  timePerPick: number; // seconds
  budget?: number; // for auction drafts
  keeperSlots?: number;
  order: string[]; // user IDs in draft order
  reverseOddRounds: boolean; // for snake drafts
  pauseEnabled: boolean;
  autoDraftEnabled: boolean;
}

export interface DraftState {
}
  status: &apos;waiting&apos; | &apos;active&apos; | &apos;paused&apos; | &apos;completed&apos;;
  currentRound: number;
  currentPick: number;
  currentTeam: string;
  timeRemaining: number;
  picks: DraftPick[];
  availablePlayers: Player[];
  teamRosters: Map<string, DraftPick[]>;
  nextPicks: string[]; // next 5 teams to pick
}

export interface DraftPick {
}
  pickNumber: number;
  round: number;
  teamId: string;
  playerId: string;
  playerName: string;
  position: string;
  team: string;
  timestamp: number;
  autoDrafted?: boolean;
  keeperPick?: boolean;
  bid?: number; // for auction drafts
}

export interface Player {
}
  id: string;
  name: string;
  position: string;
  team: string;
  byeWeek: number;
  adp: number; // average draft position
  projectedPoints: number;
  tier: number;
  injury?: {
}
    status: string;
    description: string;
  };
  stats?: {
}
    lastYear: any;
    projected: any;
  };
}

export interface DraftTimer {
}
  total: number;
  remaining: number;
  isRunning: boolean;
  isPaused: boolean;
  warningThreshold: number; // seconds before warning
  criticalThreshold: number; // seconds before critical
}

export interface DraftChat {
}
  messages: ChatMessage[];
  participants: Participant[];
  typingUsers: string[];
}

export interface ChatMessage {
}
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: number;
  type: &apos;message&apos; | &apos;pick&apos; | &apos;trade&apos; | &apos;system&apos;;
  metadata?: any;
}

export interface Participant {
}
  userId: string;
  userName: string;
  teamName: string;
  avatar?: string;
  status: &apos;active&apos; | &apos;idle&apos; | &apos;offline&apos;;
  isCommissioner: boolean;
  autoDraftEnabled: boolean;
}

export interface AutoDraftStrategy {
}
  strategy: &apos;bestAvailable&apos; | &apos;positional&apos; | &apos;balanced&apos; | &apos;custom&apos;;
  positionPriority?: string[];
  avoidPlayers?: string[];
  targetPlayers?: string[];
  maxPlayersPerPosition?: Record<string, number>;
  preferredTeams?: string[];
}

export interface TradeProposal {
}
  id: string;
  from: string;
  to: string;
  fromPicks: number[];
  toPicks: number[];
  status: &apos;pending&apos; | &apos;accepted&apos; | &apos;rejected&apos; | &apos;countered&apos;;
  timestamp: number;
}

// Draft Events
export type DraftEvent = 
  | { type: &apos;draft:started&apos;; data: DraftState }
  | { type: &apos;draft:pick&apos;; data: DraftPick }
  | { type: &apos;draft:timer&apos;; data: DraftTimer }
  | { type: &apos;draft:turn&apos;; data: { teamId: string; pickNumber: number } }
  | { type: &apos;draft:paused&apos;; data: { reason: string; by: string } }
  | { type: &apos;draft:resumed&apos;; data: { by: string } }
  | { type: &apos;draft:completed&apos;; data: { results: DraftResults } }
  | { type: &apos;draft:trade&apos;; data: TradeProposal }
  | { type: &apos;draft:chat&apos;; data: ChatMessage }
  | { type: &apos;draft:typing&apos;; data: { userId: string; isTyping: boolean } }
  | { type: &apos;draft:participant&apos;; data: { participant: Participant; action: &apos;join&apos; | &apos;leave&apos; | &apos;update&apos; } };

export interface DraftResults {
}
  draftId: string;
  completedAt: number;
  totalPicks: number;
  teamRosters: Record<string, DraftPick[]>;
  draftGrades: Record<string, DraftGrade>;
  bestPicks: DraftPick[];
  worstPicks: DraftPick[];
  steals: DraftPick[];
  reaches: DraftPick[];
}

export interface DraftGrade {
}
  teamId: string;
  grade: string; // A+, A, B+, etc.
  score: number; // 0-100
  strengths: string[];
  weaknesses: string[];
  bestPick: DraftPick;
  worstPick: DraftPick;
  projectedFinish: number;
}

// Main Real-Time Draft Service
export class RealTimeDraftService extends EventEmitter {
}
  private ws: typeof enhancedWebSocketService;
  private settings?: DraftSettings;
  private state: DraftState;
  private timer?: DraftTimer;
  private timerInterval?: NodeJS.Timeout;
  private chat: DraftChat;
  private autoDraftStrategies: Map<string, AutoDraftStrategy>;
  private queuedPicks: Map<string, string[]>; // pre-draft queue
  private pickHistory: DraftPick[] = [];
  private undoStack: DraftPick[] = [];
  private soundEnabled = true;
  private notificationsEnabled = true;

  constructor() {
}
    super();
    
    this.ws = enhancedWebSocketService;
    
    this.state = {
}
      status: &apos;waiting&apos;,
      currentRound: 1,
      currentPick: 1,
      currentTeam: &apos;&apos;,
      timeRemaining: 0,
      picks: [],
      availablePlayers: [],
      teamRosters: new Map(),
      nextPicks: []
    };

    this.chat = {
}
      messages: [],
      participants: [],
      typingUsers: []
    };

    this.autoDraftStrategies = new Map();
    this.queuedPicks = new Map();
    
    this.setupEventHandlers();
    this.loadSoundPreferences();
  }

  // Initialize and Join Draft
  async joinDraft(draftId: string, userId: string): Promise<void> {
}
    try {
}
      // Connect to WebSocket if not connected
      if (!this.ws.isConnected()) {
}
        await this.ws.connect();
      }

      // Join draft room
      this.ws.joinDraftRoom(draftId);

      // Subscribe to draft events
      this.subscribeToDraftEvents(draftId);

      // Load draft settings and state
      await this.loadDraftSettings(draftId);
      await this.loadDraftState(draftId);
      await this.loadAvailablePlayers();

      // Announce user joined
      this.sendSystemMessage(`${userId} has joined the draft`);

      this.emit(&apos;draft:joined&apos;, {
}
        draftId,
        userId,
        settings: this.settings,
        state: this.state
      });

    } catch (error) {
}
      console.error(&apos;Failed to join draft:&apos;, error);
      this.emit(&apos;draft:error&apos;, error);
      throw error;
    }
  }

  // Leave Draft
  leaveDraft(): void {
}
    if (this.settings) {
}
      this.ws.leaveDraftRoom(this.settings.id);
      this.stopTimer();
      this.clearState();
      this.emit(&apos;draft:left&apos;);
    }
  }

  // Make a Pick
  async makePick(playerId: string, bid?: number): Promise<void> {
}
    if (!this.canMakePick()) {
}
      throw new Error(&apos;Not your turn to pick&apos;);
    }

    const player = this.state.availablePlayers.find((p: any) => p.id === playerId);
    if (!player) {
}
      throw new Error(&apos;Player not available&apos;);
    }

    // Validate bid for auction drafts
    if (this.settings?.type === &apos;auction&apos; && bid !== undefined) {
}
      const remainingBudget = this.getRemainingBudget(this.state.currentTeam);
      if (bid > remainingBudget) {
}
        throw new Error(&apos;Insufficient budget&apos;);
      }
    }

    const pick: DraftPick = {
}
      pickNumber: this.state.currentPick,
      round: this.state.currentRound,
      teamId: this.state.currentTeam,
      playerId: player.id,
      playerName: player.name,
      position: player.position,
      team: player.team,
      timestamp: Date.now(),
//       bid
    };

    // Send pick to server
    this.ws.makeDraftPick(this.settings!.id, playerId);

    // Optimistically update local state
    this.processPick(pick);

    // Play sound
    this.playSound(&apos;pick&apos;);

    this.emit(&apos;draft:pick:made&apos;, pick);
  }

  // Queue Players for Auto-Draft
  queuePlayer(playerId: string, teamId: string): void {
}
    if (!this.queuedPicks.has(teamId)) {
}
      this.queuedPicks.set(teamId, []);
    }
    
    const queue = this.queuedPicks.get(teamId)!;
    if (!queue.includes(playerId)) {
}
      queue.push(playerId);
      this.emit(&apos;draft:queue:updated&apos;, { teamId, queue });
    }
  }

  removeFromQueue(playerId: string, teamId: string): void {
}
    const queue = this.queuedPicks.get(teamId);
    if (queue) {
}
      const index = queue.indexOf(playerId);
      if (index > -1) {
}
        queue.splice(index, 1);
        this.emit(&apos;draft:queue:updated&apos;, { teamId, queue });
      }
    }
  }

  // Auto-Draft Configuration
  setAutoDraftStrategy(teamId: string, strategy: AutoDraftStrategy): void {
}
    this.autoDraftStrategies.set(teamId, strategy);
    this.emit(&apos;draft:autodraft:configured&apos;, { teamId, strategy });
  }

  enableAutoDraft(teamId: string): void {
}
    if (!this.autoDraftStrategies.has(teamId)) {
}
      // Set default strategy
      this.autoDraftStrategies.set(teamId, {
}
        strategy: &apos;bestAvailable&apos;
      });
    }
    
    this.emit(&apos;draft:autodraft:enabled&apos;, { teamId });
  }

  disableAutoDraft(teamId: string): void {
}
    this.emit(&apos;draft:autodraft:disabled&apos;, { teamId });
  }

  // Timer Management
  private startTimer(duration: number): void {
}
    this.stopTimer();
    
    this.timer = {
}
      total: duration,
      remaining: duration,
      isRunning: true,
      isPaused: false,
      warningThreshold: 30,
      criticalThreshold: 10
    };

    this.timerInterval = setInterval(() => {
}
      if (this.timer && this.timer.isRunning && !this.timer.isPaused) {
}
        this.timer.remaining--;
        
        // Check thresholds
        if (this.timer.remaining === this.timer.warningThreshold) {
}
          this.emit(&apos;draft:timer:warning&apos;);
          this.playSound(&apos;warning&apos;);
        } else if (this.timer.remaining === this.timer.criticalThreshold) {
}
          this.emit(&apos;draft:timer:critical&apos;);
          this.playSound(&apos;critical&apos;);
        } else if (this.timer.remaining === 0) {
}
          this.handleTimerExpired();
        }
        
        this.emit(&apos;draft:timer:tick&apos;, this.timer);
      }
    }, 1000);
  }

  private stopTimer(): void {
}
    if (this.timerInterval) {
}
      clearInterval(this.timerInterval);
      this.timerInterval = undefined;
    }
    this.timer = undefined;
  }

  pauseTimer(): void {
}
    if (this.timer) {
}
      this.timer.isPaused = true;
      this.emit(&apos;draft:timer:paused&apos;);
    }
  }

  resumeTimer(): void {
}
    if (this.timer) {
}
      this.timer.isPaused = false;
      this.emit(&apos;draft:timer:resumed&apos;);
    }
  }

  private handleTimerExpired(): void {
}
    this.stopTimer();
    
    // Auto-draft for current team
    const teamId = this.state.currentTeam;
    const strategy = this.autoDraftStrategies.get(teamId);
    const bestPlayer = this.selectBestPlayer(teamId, strategy);
    
    if (bestPlayer) {
}
      const pick: DraftPick = {
}
        pickNumber: this.state.currentPick,
        round: this.state.currentRound,
        teamId,
        playerId: bestPlayer.id,
        playerName: bestPlayer.name,
        position: bestPlayer.position,
        team: bestPlayer.team,
        timestamp: Date.now(),
        autoDrafted: true
      };
      
      this.processPick(pick);
      this.emit(&apos;draft:autopick&apos;, pick);
      this.playSound(&apos;autopick&apos;);
    }
  }

  // Chat Functionality
  sendMessage(message: string): void {
}
    const chatMessage: ChatMessage = {
}
      id: Date.now().toString(),
      userId: &apos;current-user&apos;, // Get from auth
      userName: &apos;Current User&apos;,
      message,
      timestamp: Date.now(),
      type: &apos;message&apos;
    };

    this.ws.sendMessage(
      this.settings!.id,
      &apos;draft&apos;,
//       message
    );

    // Optimistically add to local chat
    this.chat.messages.push(chatMessage);
    this.emit(&apos;draft:chat:message&apos;, chatMessage);
  }

  startTyping(): void {
}
    this.ws.startTyping(this.settings!.id);
  }

  stopTyping(): void {
}
    this.ws.stopTyping(this.settings!.id);
  }

  // Trade Draft Picks
  proposeTrade(trade: Omit<TradeProposal, &apos;id&apos; | &apos;timestamp&apos; | &apos;status&apos;>): void {
}
    const proposal: TradeProposal = {
}
      ...trade,
      id: Date.now().toString(),
      status: &apos;pending&apos;,
      timestamp: Date.now()
    };

    this.emit(&apos;draft:trade:proposed&apos;, proposal);
  }

  acceptTrade(tradeId: string): void {
}
    this.emit(&apos;draft:trade:accepted&apos;, { tradeId });
  }

  rejectTrade(tradeId: string): void {
}
    this.emit(&apos;draft:trade:rejected&apos;, { tradeId });
  }

  // Commissioner Controls
  pauseDraft(reason: string): void {
}
    if (this.state.status === &apos;active&apos;) {
}
      this.state.status = &apos;paused&apos;;
      this.pauseTimer();
      this.emit(&apos;draft:paused&apos;, { reason });
      this.sendSystemMessage(`Draft paused: ${reason}`);
    }
  }

  resumeDraft(): void {
}
    if (this.state.status === &apos;paused&apos;) {
}
      this.state.status = &apos;active&apos;;
      this.resumeTimer();
      this.emit(&apos;draft:resumed&apos;);
      this.sendSystemMessage(&apos;Draft resumed&apos;);
    }
  }

  undoPick(): void {
}
    if (this.pickHistory.length > 0) {
}
      const lastPick = this.pickHistory.pop()!;
      this.undoStack.push(lastPick);
      
      // Restore player to available
      const player = this.findPlayerById(lastPick.playerId);
      if (player) {
}
        this.state.availablePlayers.push(player);
      }
      
      // Remove from team roster
      const teamRoster = this.state.teamRosters.get(lastPick.teamId);
      if (teamRoster) {
}
        const index = teamRoster.findIndex(p => p.playerId === lastPick.playerId);
        if (index > -1) {
}
          teamRoster.splice(index, 1);
        }
      }
      
      // Revert pick counter
      this.state.currentPick--;
      
      this.emit(&apos;draft:pick:undone&apos;, lastPick);
    }
  }

  redoPick(): void {
}
    if (this.undoStack.length > 0) {
}
      const pick = this.undoStack.pop()!;
      this.processPick(pick);
      this.emit(&apos;draft:pick:redone&apos;, pick);
    }
  }

  // Private Helper Methods
  private subscribeToDraftEvents(draftId: string): void {
}
    // Subscribe to draft-specific WebSocket events
    this.ws.on(&apos;draft:started&apos;, (data: any) => this.handleDraftStarted(data));
    this.ws.on(&apos;draft:pick:made&apos;, (data: any) => this.handlePickMade(data));
    this.ws.on(&apos;draft:timer:update&apos;, (data: any) => this.handleTimerUpdate(data));
    this.ws.on(&apos;draft:turn:change&apos;, (data: any) => this.handleTurnChange(data));
    this.ws.on(&apos;draft:chat:message&apos;, (data: any) => this.handleChatMessage(data));
    this.ws.on(&apos;draft:participant:update&apos;, (data: any) => this.handleParticipantUpdate(data));
    this.ws.on(&apos;draft:completed&apos;, (data: any) => this.handleDraftCompleted(data));
  }

  private setupEventHandlers(): void {
}
    // Handle WebSocket connection events
    this.ws.on(&apos;connected&apos;, () => {
}
      console.log(&apos;Draft service connected to WebSocket&apos;);
    });

    this.ws.on(&apos;disconnected&apos;, () => {
}
      console.log(&apos;Draft service disconnected from WebSocket&apos;);
      this.emit(&apos;draft:disconnected&apos;);
    });

    this.ws.on(&apos;error&apos;, (error: any) => {
}
      console.error(&apos;Draft service WebSocket error:&apos;, error);
      this.emit(&apos;draft:error&apos;, error);
    });
  }

  private async loadDraftSettings(draftId: string): Promise<void> {
}
    // Load from API
    const response = await fetch(`/api/drafts/${draftId}/settings`);
    this.settings = await response.json();
  }

  private async loadDraftState(draftId: string): Promise<void> {
}
    // Load from API
    const response = await fetch(`/api/drafts/${draftId}/state`);
    const state = await response.json();
    
    this.state = {
}
      ...state,
      teamRosters: new Map(Object.entries(state.teamRosters))
    };
  }

  private async loadAvailablePlayers(): Promise<void> {
}
    // Load from API
    const response = await fetch(&apos;/api/players/available&apos;);
    this.state.availablePlayers = await response.json();
  }

  private processPick(pick: DraftPick): void {
}
    // Remove player from available
    const playerIndex = this.state.availablePlayers.findIndex(p => p.id === pick.playerId);
    if (playerIndex > -1) {
}
      this.state.availablePlayers.splice(playerIndex, 1);
    }

    // Add to team roster
    if (!this.state.teamRosters.has(pick.teamId)) {
}
      this.state.teamRosters.set(pick.teamId, []);
    }
    this.state.teamRosters.get(pick.teamId)!.push(pick);

    // Add to pick history
    this.pickHistory.push(pick);
    this.state.picks.push(pick);

    // Clear undo stack
    this.undoStack = [];

    // Advance to next pick
    this.advanceToNextPick();
  }

  private advanceToNextPick(): void {
}
    const totalTeams = this.settings!.order.length;
    const picksPerRound = totalTeams;
    
    this.state.currentPick++;
    
    // Check if round is complete
    if (this.state.currentPick > this.state.currentRound * picksPerRound) {
}
      this.state.currentRound++;
      
      // Check if draft is complete
      if (this.state.currentRound > this.settings!.rounds) {
}
        this.completeDraft();
        return;
      }
    }
    
    // Determine next team
    const pickInRound = ((this.state.currentPick - 1) % picksPerRound) + 1;
    
    if (this.settings!.type === &apos;snake&apos; && this.state.currentRound % 2 === 0) {
}
      // Reverse order for even rounds in snake draft
      this.state.currentTeam = this.settings!.order[totalTeams - pickInRound];
    } else {
}
      this.state.currentTeam = this.settings!.order[pickInRound - 1];
    }
    
    // Update next picks preview
    this.updateNextPicks();
    
    // Start timer for next pick
    if (this.settings!.timePerPick > 0) {
}
      this.startTimer(this.settings!.timePerPick);
    }
    
    // Check if auto-draft is needed
    this.checkAutoDraft();
  }

  private updateNextPicks(): void {
}
    const next = [];
    let tempPick = this.state.currentPick;
    let tempRound = this.state.currentRound;
    
    for (let i = 0; i < 5; i++) {
}
      tempPick++;
      const totalTeams = this.settings!.order.length;
      
      if (tempPick > tempRound * totalTeams) {
}
        tempRound++;
        if (tempRound > this.settings!.rounds) break;
      }
      
      const pickInRound = ((tempPick - 1) % totalTeams) + 1;
      
      if (this.settings!.type === &apos;snake&apos; && tempRound % 2 === 0) {
}
        next.push(this.settings!.order[totalTeams - pickInRound]);
      } else {
}
        next.push(this.settings!.order[pickInRound - 1]);
      }
    }
    
    this.state.nextPicks = next;
  }

  private checkAutoDraft(): void {
}
    const teamId = this.state.currentTeam;
    const participant = this.chat.participants.find((p: any) => p.userId === teamId);
    
    if (participant?.autoDraftEnabled || participant?.status === &apos;offline&apos;) {
}
      // Trigger auto-draft after a short delay
      setTimeout(() => {
}
        if (this.state.currentTeam === teamId) {
}
          this.handleTimerExpired();
        }
      }, 3000);
    }
  }

  private selectBestPlayer(teamId: string, strategy?: AutoDraftStrategy): Player | null {
}
    const roster = this.state.teamRosters.get(teamId) || [];
    const available = [...this.state.availablePlayers];
    
    // Check queued picks first
    const queue = this.queuedPicks.get(teamId);
    if (queue && queue.length > 0) {
}
      for (const playerId of queue) {
}
        const player = available.find((p: any) => p.id === playerId);
        if (player) {
}
          return player;
        }
      }
    }
    
    if (!strategy) {
}
      // Default to best available
      return available.sort((a, b) => a.adp - b.adp)[0];
    }
    
    switch (strategy.strategy) {
}
      case &apos;positional&apos;:
        return this.selectByPosition(available, roster, strategy);
      case &apos;balanced&apos;:
        return this.selectBalanced(available, roster, strategy);
      case &apos;custom&apos;:
        return this.selectCustom(available, roster, strategy);
      default:
        return available.sort((a, b) => a.adp - b.adp)[0];
    }
  }

  private selectByPosition(available: Player[], roster: DraftPick[], strategy: AutoDraftStrategy): Player | null {
}
    const positionCounts = this.getPositionCounts(roster);
    
    for (const position of strategy.positionPriority || [&apos;RB&apos;, &apos;WR&apos;, &apos;QB&apos;, &apos;TE&apos;]) {
}
      const count = positionCounts[position] || 0;
      const max = strategy.maxPlayersPerPosition?.[position] || 5;
      
      if (count < max) {
}
        const players = available.filter((p: any) => p.position === position);
        if (players.length > 0) {
}
          return players.sort((a, b) => a.adp - b.adp)[0];
        }
      }
    }
    
    return available[0];
  }

  private selectBalanced(available: Player[], roster: DraftPick[], strategy: AutoDraftStrategy): Player | null {
}
    const needs = this.calculateTeamNeeds(roster);
    
    // Score each available player based on team needs
    const scoredPlayers = available.map((player: any) => ({
}
      player,
      score: this.scorePlayerForTeam(player, needs)
    }));
    
    scoredPlayers.sort((a, b) => b.score - a.score);
    
    return scoredPlayers[0]?.player || null;
  }

  private selectCustom(available: Player[], roster: DraftPick[], strategy: AutoDraftStrategy): Player | null {
}
    // Filter out avoided players
    let filtered = available.filter((p: any) => 
      !strategy.avoidPlayers?.includes(p.id)
    );
    
    // Prioritize target players
    if (strategy.targetPlayers && strategy.targetPlayers.length > 0) {
}
      const targets = filtered.filter((p: any) => 
        strategy.targetPlayers!.includes(p.id)
      );
      if (targets.length > 0) {
}
        return targets[0];
      }
    }
    
    // Filter by preferred teams
    if (strategy.preferredTeams && strategy.preferredTeams.length > 0) {
}
      const preferred = filtered.filter((p: any) => 
        strategy.preferredTeams!.includes(p.team)
      );
      if (preferred.length > 0) {
}
        filtered = preferred;
      }
    }
    
    return filtered.sort((a, b) => a.adp - b.adp)[0] || null;
  }

  private getPositionCounts(roster: DraftPick[]): Record<string, number> {
}
    const counts: Record<string, number> = {};
    
    for (const pick of roster) {
}
      counts[pick.position] = (counts[pick.position] || 0) + 1;
    }
    
    return counts;
  }

  private calculateTeamNeeds(roster: DraftPick[]): Record<string, number> {
}
    const ideal = {
}
      QB: 2,
      RB: 5,
      WR: 5,
      TE: 2,
      K: 1,
      DEF: 1
    };
    
    const current = this.getPositionCounts(roster);
    const needs: Record<string, number> = {};
    
    for (const [position, target] of Object.entries(ideal)) {
}
      needs[position] = Math.max(0, target - (current[position] || 0));
    }
    
    return needs;
  }

  private scorePlayerForTeam(player: Player, needs: Record<string, number>): number {
}
    const positionNeed = needs[player.position] || 0;
    const adpScore = 100 - (player.adp / 3); // Lower ADP is better
    const needScore = positionNeed * 20;
    const projectedScore = player.projectedPoints / 10;
    
    return adpScore + needScore + projectedScore;
  }

  private getRemainingBudget(teamId: string): number {
}
    if (this.settings?.type !== &apos;auction&apos;) return 0;
    
    const roster = this.state.teamRosters.get(teamId) || [];
    const spent = roster.reduce((total, pick) => total + (pick.bid || 0), 0);
    
    return (this.settings.budget || 200) - spent;
  }

  private canMakePick(): boolean {
}
    // Check if it&apos;s current user&apos;s turn
    // This would be determined by comparing with authenticated user
    return true; // Simplified for now
  }

  private completeDraft(): void {
}
    this.state.status = &apos;completed&apos;;
    this.stopTimer();
    
    // Calculate draft results
    const results = this.calculateDraftResults();
    
    this.emit(&apos;draft:completed&apos;, results);
    this.sendSystemMessage(&apos;Draft completed!&apos;);
  }

  private calculateDraftResults(): DraftResults {
}
    const teamRosters: Record<string, DraftPick[]> = {};
    this.state.teamRosters.forEach((roster, teamId) => {
}
      teamRosters[teamId] = roster;
    });
    
    const draftGrades = this.calculateDraftGrades(teamRosters);
    const bestPicks = this.findBestPicks();
    const worstPicks = this.findWorstPicks();
    const steals = this.findSteals();
    const reaches = this.findReaches();
    
    return {
}
      draftId: this.settings!.id,
      completedAt: Date.now(),
      totalPicks: this.state.picks.length,
      teamRosters,
      draftGrades,
      bestPicks,
      worstPicks,
      steals,
//       reaches
    };
  }

  private calculateDraftGrades(teamRosters: Record<string, DraftPick[]>): Record<string, DraftGrade> {
}
    const grades: Record<string, DraftGrade> = {};
    
    // Calculate grades for each team
    for (const [teamId, roster] of Object.entries(teamRosters)) {
}
      grades[teamId] = this.gradeTeam(teamId, roster);
    }
    
    return grades;
  }

  private gradeTeam(teamId: string, roster: DraftPick[]): DraftGrade {
}
    // Simplified grading logic
    const score = Math.random() * 30 + 70; // 70-100
    const grade = this.scoreToGrade(score);
    
    return {
}
      teamId,
      grade,
      score,
      strengths: [&apos;Strong RB depth&apos;, &apos;Elite QB&apos;],
      weaknesses: [&apos;Weak at TE&apos;],
      bestPick: roster[0],
      worstPick: roster[roster.length - 1],
      projectedFinish: Math.ceil(Math.random() * 10)
    };
  }

  private scoreToGrade(score: number): string {
}
    if (score >= 95) return &apos;A+&apos;;
    if (score >= 90) return &apos;A&apos;;
    if (score >= 87) return &apos;A-&apos;;
    if (score >= 83) return &apos;B+&apos;;
    if (score >= 80) return &apos;B&apos;;
    if (score >= 77) return &apos;B-&apos;;
    if (score >= 73) return &apos;C+&apos;;
    if (score >= 70) return &apos;C&apos;;
    if (score >= 67) return &apos;C-&apos;;
    if (score >= 63) return &apos;D+&apos;;
    if (score >= 60) return &apos;D&apos;;
    return &apos;F&apos;;
  }

  private findBestPicks(): DraftPick[] {
}
    // Find picks that exceeded expectations
    return this.state.picks
      .filter((pick: any) => {
}
        const player = this.findPlayerById(pick.playerId);
        return player && pick.pickNumber > player.adp + 10;
      })
      .slice(0, 5);
  }

  private findWorstPicks(): DraftPick[] {
}
    // Find picks that were reaches
    return this.state.picks
      .filter((pick: any) => {
}
        const player = this.findPlayerById(pick.playerId);
        return player && pick.pickNumber < player.adp - 20;
      })
      .slice(0, 5);
  }

  private findSteals(): DraftPick[] {
}
    // Players drafted well below ADP
    return this.state.picks
      .filter((pick: any) => {
}
        const player = this.findPlayerById(pick.playerId);
        return player && pick.pickNumber > player.adp + 30;
      })
      .slice(0, 10);
  }

  private findReaches(): DraftPick[] {
}
    // Players drafted well above ADP
    return this.state.picks
      .filter((pick: any) => {
}
        const player = this.findPlayerById(pick.playerId);
        return player && pick.pickNumber < player.adp - 30;
      })
      .slice(0, 10);
  }

  private findPlayerById(playerId: string): Player | undefined {
}
    // Search in available players and drafted players
    return this.state.availablePlayers.find((p: any) => p.id === playerId);
  }

  private sendSystemMessage(message: string): void {
}
    const chatMessage: ChatMessage = {
}
      id: Date.now().toString(),
      userId: &apos;system&apos;,
      userName: &apos;System&apos;,
      message,
      timestamp: Date.now(),
      type: &apos;system&apos;
    };
    
    this.chat.messages.push(chatMessage);
    this.emit(&apos;draft:chat:message&apos;, chatMessage);
  }

  private clearState(): void {
}
    this.state = {
}
      status: &apos;waiting&apos;,
      currentRound: 1,
      currentPick: 1,
      currentTeam: &apos;&apos;,
      timeRemaining: 0,
      picks: [],
      availablePlayers: [],
      teamRosters: new Map(),
      nextPicks: []
    };
    
    this.chat = {
}
      messages: [],
      participants: [],
      typingUsers: []
    };
    
    this.pickHistory = [];
    this.undoStack = [];
    this.settings = undefined;
  }

  // Event Handlers
  private handleDraftStarted(data: any): void {
}
    this.state.status = &apos;active&apos;;
    this.emit(&apos;draft:started&apos;, data);
    this.playSound(&apos;start&apos;);
  }

  private handlePickMade(data: any): void {
}
    this.processPick(data);
    this.emit(&apos;draft:pick:made&apos;, data);
  }

  private handleTimerUpdate(data: any): void {
}
    if (this.timer) {
}
      this.timer.remaining = data.remaining;
    }
  }

  private handleTurnChange(data: any): void {
}
    this.state.currentTeam = data.teamId;
    this.state.currentPick = data.pickNumber;
    
    if (this.settings?.timePerPick) {
}
      this.startTimer(this.settings.timePerPick);
    }
    
    this.emit(&apos;draft:turn:change&apos;, data);
    
    // Notify if it&apos;s user&apos;s turn
    if (this.isMyTurn()) {
}
      this.playSound(&apos;yourTurn&apos;);
      this.showNotification(&apos;Your Turn!&apos;, "It&apos;s your turn to draft");
    }
  }

  private handleChatMessage(data: any): void {
}
    this.chat.messages.push(data);
    this.emit(&apos;draft:chat:message&apos;, data);
  }

  private handleParticipantUpdate(data: any): void {
}
    const { participant, action } = data;
    
    if (action === &apos;join&apos;) {
}
      this.chat.participants.push(participant);
    } else if (action === &apos;leave&apos;) {
}
      const index = this.chat.participants.findIndex(p => p.userId === participant.userId);
      if (index > -1) {
}
        this.chat.participants.splice(index, 1);
      }
    } else if (action === &apos;update&apos;) {
}
      const index = this.chat.participants.findIndex(p => p.userId === participant.userId);
      if (index > -1) {
}
        this.chat.participants[index] = participant;
      }
    }
    
    this.emit(&apos;draft:participant:update&apos;, data);
  }

  private handleDraftCompleted(data: any): void {
}
    this.completeDraft();
  }

  // Sound Management
  private loadSoundPreferences(): void {
}
    this.soundEnabled = localStorage.getItem(&apos;draftSoundEnabled&apos;) !== &apos;false&apos;;
    this.notificationsEnabled = localStorage.getItem(&apos;draftNotificationsEnabled&apos;) !== &apos;false&apos;;
  }

  toggleSound(enabled: boolean): void {
}
    this.soundEnabled = enabled;
    localStorage.setItem(&apos;draftSoundEnabled&apos;, enabled.toString());
  }

  toggleNotifications(enabled: boolean): void {
}
    this.notificationsEnabled = enabled;
    localStorage.setItem(&apos;draftNotificationsEnabled&apos;, enabled.toString());
  }

  private playSound(type: &apos;pick&apos; | &apos;yourTurn&apos; | &apos;warning&apos; | &apos;critical&apos; | &apos;autopick&apos; | &apos;start&apos;): void {
}
    if (!this.soundEnabled) return;
    
    // Play appropriate sound file
    const audio = new Audio(`/sounds/draft-${type}.mp3`);
    audio.play().catch(console.error);
  }

  private showNotification(title: string, body: string): void {
}
    if (!this.notificationsEnabled) return;
    
    if (&apos;Notification&apos; in window && Notification.permission === &apos;granted&apos;) {
}
      new Notification(title, {
}
        body,
        icon: &apos;/icon-192x192.png&apos;,
        badge: &apos;/badge-72x72.png&apos;
      });
    }
  }

  private isMyTurn(): boolean {
}
    // Check if current team matches authenticated user
    return true; // Simplified
  }

  // Public API
  getState(): DraftState {
}
    return { ...this.state };
  }

  getSettings(): DraftSettings | undefined {
}
    return this.settings;
  }

  getChat(): DraftChat {
}
    return { ...this.chat };
  }

  getTimer(): DraftTimer | undefined {
}
    return this.timer;
  }

  getQueuedPicks(teamId: string): string[] {
}
    return this.queuedPicks.get(teamId) || [];
  }

  getAutoDraftStrategy(teamId: string): AutoDraftStrategy | undefined {
}
    return this.autoDraftStrategies.get(teamId);
  }
}

// Singleton instance
export const realTimeDraftServiceV2 = new RealTimeDraftService();
export const realTimeDraftService = realTimeDraftServiceV2; // Backward compatibility
export default realTimeDraftServiceV2;