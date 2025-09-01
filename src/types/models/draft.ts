/**
 * Draft and League Management Types
 * Comprehensive types for draft mechanics, league settings, and real-time draft functionality
 */

import { Player } from './player';
import { User } from './user';

// ==================== DRAFT ENUMS AND CONSTANTS ====================

export type DraftFormat = 'SNAKE' | 'AUCTION' | 'LINEAR' | 'KEEPER' | 'DYNASTY';

export type DraftStatus = 'SCHEDULED' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';

export type PickType = 'NORMAL' | 'AUTO' | 'COMMISSIONER' | 'KEEPER';

export type TimerState = 'RUNNING' | 'PAUSED' | 'EXPIRED' | 'DISABLED';

// ==================== DRAFT PICK TYPES ====================

export interface DraftPick {
  id: string;
  draftId: string;
  teamId: string;
  playerId: string | null;
  round: number;
  pick: number; // Overall pick number
  pickInRound: number; // Pick number within round
  timestamp: Date | null;
  timeUsed: number; // seconds used for this pick
  type: PickType;
  price?: number; // For auction drafts
  tradedFrom?: string; // Original team ID if pick was traded
  isSkipped: boolean;
  skipReason?: string;
}

export interface DraftQueue {
  teamId: string;
  playerIds: string[];
  autoPickEnabled: boolean;
  maxAutoPicks?: number;
  positionLimits?: { [position: string]: number };
}

// ==================== DRAFT STATE ====================

export interface DraftTimer {
  timePerPick: number; // seconds
  timeRemaining: number; // seconds
  state: TimerState;
  pausedAt?: Date;
  resumedAt?: Date;
  overTime: number; // seconds over limit
}

export interface DraftSettings {
  format: DraftFormat;
  teamCount: number;
  rounds: number;
  timePerPick: number; // seconds
  allowAutoPick: boolean;
  allowCommissionerControl: boolean;
  allowTrades: boolean;
  reverseOrder: boolean; // For snake drafts
  auctionBudget?: number; // For auction drafts
  minimumBid?: number; // For auction drafts
  bidIncrement?: number; // For auction drafts
  nominationTime?: number; // For auction drafts
  biddingTime?: number; // For auction drafts
  keeperSettings?: {
    maxKeepers: number;
    keeperDeadline: Date;
    keeperCosts: 'NONE' | 'DRAFT_ROUND' | 'AUCTION_VALUE';
  };
}

export interface DraftState {
  id: string;
  leagueId: string;
  status: DraftStatus;
  settings: DraftSettings;
  currentPick: number;
  currentRound: number;
  currentTeamId: string;
  draftOrder: string[]; // Array of team IDs
  picks: DraftPick[];
  queues: DraftQueue[];
  timer: DraftTimer;
  startTime: Date | null;
  endTime: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== AUCTION-SPECIFIC TYPES ====================

export interface AuctionState {
  nominatingTeamId: string;
  nominatedPlayerId: string | null;
  currentBid: number;
  highBidderId: string | null;
  timer: DraftTimer;
  lastBidTimestamp: Date;
  bidHistory: BidHistory[];
  isNomination: boolean; // true during nomination phase, false during bidding
}

export interface BidHistory {
  id: string;
  teamId: string;
  playerId: string;
  amount: number;
  timestamp: Date;
  isWinning: boolean;
  isNomination: boolean;
}

export interface TeamBudget {
  teamId: string;
  totalBudget: number;
  spent: number;
  remaining: number;
  playersRemaining: number;
  averagePerPlayer: number;
}

// ==================== DRAFT BOARD AND RANKINGS ====================

export interface DraftBoard {
  availablePlayers: Player[];
  draftedPlayers: { [teamId: string]: Player[] };
  myTeam: {
    teamId: string;
    roster: Player[];
    budget?: number;
    picks: number[];
  };
  recommendations: DraftRecommendation[];
  positionNeeds: { [teamId: string]: PositionNeed[] };
}

export interface DraftRecommendation {
  id: string;
  playerId: string;
  player: Player;
  type: RecommendationType;
  priority: number; // 1-10 scale
  reasoning: string;
  valueScore: number;
  riskScore: number;
  upside: number;
  alternativeOptions?: string[]; // Other player IDs
}

export type RecommendationType = 
  | 'VALUE' 
  | 'POSITIONAL_NEED' 
  | 'SAFE_PICK' 
  | 'SLEEPER' 
  | 'HANDCUFF' 
  | 'CEILING_PLAY' 
  | 'FLOOR_PLAY'
  | 'ROOKIE_UPSIDE'
  | 'INJURY_REPLACEMENT';

export interface PositionNeed {
  position: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
  suggestedPlayers: string[]; // Player IDs
}

// ==================== DRAFT ANALYTICS ====================

export interface DraftGrade {
  teamId: string;
  overall: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'F';
  score: number; // 0-100
  categories: {
    value: number;
    need: number;
    upside: number;
    safety: number;
    depth: number;
  };
  bestPick: {
    playerId: string;
    player: Player;
    round: number;
    reasoning: string;
  };
  worstPick: {
    playerId: string;
    player: Player;
    round: number;
    reasoning: string;
  };
  narrative: string;
  strengths: string[];
  weaknesses: string[];
  projectedRank: number;
}

export interface DraftAnalytics {
  efficiency: number; // How well did teams draft relative to ADP
  valuePicks: number; // Number of players drafted significantly below ADP
  reaches: number; // Number of players drafted significantly above ADP
  averagePickTime: number; // seconds
  totalDraftTime: number; // seconds
  autoPicks: number;
  trades: number;
  positionDistribution: { [position: string]: number };
  teamGrades: DraftGrade[];
  surprises: {
    player: Player;
    expectedRound: number;
    actualRound: number;
    reasoning: string;
  }[];
}

// ==================== DRAFT EVENTS ====================

export interface DraftEvent {
  id: string;
  draftId: string;
  type: DraftEventType;
  timestamp: Date;
  teamId?: string;
  playerId?: string;
  data: Record<string, any>;
  message: string;
}

export type DraftEventType = 
  | 'DRAFT_STARTED'
  | 'DRAFT_PAUSED' 
  | 'DRAFT_RESUMED'
  | 'DRAFT_COMPLETED'
  | 'PICK_MADE'
  | 'AUTO_PICK'
  | 'PICK_SKIPPED'
  | 'TIME_EXPIRED'
  | 'NOMINATION_MADE'
  | 'BID_PLACED'
  | 'AUCTION_WON'
  | 'TRADE_COMPLETED'
  | 'TEAM_JOINED'
  | 'TEAM_LEFT'
  | 'ROUND_COMPLETED'
  | 'COMMISSIONER_ACTION';

// ==================== TRADE TYPES ====================

export interface DraftTrade {
  id: string;
  draftId: string;
  fromTeamId: string;
  toTeamId: string;
  picksOffered: number[]; // Pick numbers
  picksRequested: number[];
  playersOffered: string[]; // Already drafted player IDs
  playersRequested: string[];
  faabOffered?: number; // Future FAAB budget
  faabRequested?: number;
  status: 'PROPOSED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  proposedAt: Date;
  respondedAt?: Date;
  expiresAt: Date;
}

export interface TradeAnalysis {
  tradeId: string;
  fairnessScore: number; // -100 to 100, 0 is fair
  winner: 'TEAM_A' | 'TEAM_B' | 'FAIR';
  analysis: {
    teamA: {
      value: number;
      need: number;
      risk: number;
      summary: string;
    };
    teamB: {
      value: number;
      need: number;
      risk: number;
      summary: string;
    };
  };
  recommendation: 'ACCEPT' | 'REJECT' | 'COUNTER';
  reasoning: string;
}

// ==================== MOCK DRAFT TYPES ====================

export interface MockDraft extends Omit<DraftState, 'id' | 'leagueId'> {
  isMock: true;
  participants: MockParticipant[];
  aiDifficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  focusPosition?: string; // Position to focus practice on
  scenarioType?: 'STANDARD' | 'LATE_DRAFT' | 'AUCTION_PRACTICE' | 'KEEPER_LEAGUE';
}

export interface MockParticipant {
  id: string;
  name: string;
  isHuman: boolean;
  isUser: boolean; // The actual user
  draftingStyle: 'AGGRESSIVE' | 'CONSERVATIVE' | 'VALUE_BASED' | 'POSITIONAL';
  avatar: string;
}

// ==================== DRAFT PREPARATION ====================

export interface DraftPrep {
  userId: string;
  leagueId: string;
  rankings: CustomRankings;
  targets: DraftTargets;
  avoidList: string[]; // Player IDs to avoid
  strategy: DraftStrategy;
  cheatSheet: CheatSheetEntry[];
  notes: { [playerId: string]: string };
  tiers: PlayerTier[];
}

export interface CustomRankings {
  [position: string]: {
    playerId: string;
    rank: number;
    notes?: string;
  }[];
}

export interface DraftTargets {
  early: string[]; // Rounds 1-3
  middle: string[]; // Rounds 4-8
  late: string[]; // Rounds 9+
  sleepers: string[];
  handcuffs: string[];
}

export interface DraftStrategy {
  approach: 'RB_HEAVY' | 'WR_HEAVY' | 'ZERO_RB' | 'ZERO_WR' | 'BALANCED' | 'LATE_ROUND_QB';
  priorities: string[]; // Position order
  riskTolerance: 'HIGH' | 'MEDIUM' | 'LOW';
  targetPositions: {
    round: number;
    positions: string[];
    reasoning: string;
  }[];
}

export interface CheatSheetEntry {
  playerId: string;
  player: Player;
  rank: number;
  tier: number;
  target: boolean;
  avoid: boolean;
  notes: string;
  value: number; // Custom value score
}

export interface PlayerTier {
  tier: number;
  position: string;
  playerIds: string[];
  label: string;
  description: string;
}

// ==================== COMMISSIONER CONTROLS ====================

export interface CommissionerAction {
  id: string;
  draftId: string;
  commissionerId: string;
  action: CommissionerActionType;
  targetTeamId?: string;
  targetPlayerId?: string;
  data: Record<string, any>;
  timestamp: Date;
  reason: string;
}

export type CommissionerActionType = 
  | 'PAUSE_DRAFT'
  | 'RESUME_DRAFT'
  | 'RESET_PICK'
  | 'FORCE_PICK'
  | 'EDIT_PICK'
  | 'RESET_TIMER'
  | 'KICK_PARTICIPANT'
  | 'CHANGE_ORDER'
  | 'REVERSE_TRADE';

// ==================== EXPORT ALL ====================

export type {
  DraftFormat,
  DraftStatus,
  PickType,
  TimerState,
  DraftPick,
  DraftQueue,
  DraftTimer,
  DraftSettings,
  DraftState,
  AuctionState,
  BidHistory,
  TeamBudget,
  DraftBoard,
  DraftRecommendation,
  RecommendationType,
  PositionNeed,
  DraftGrade,
  DraftAnalytics,
  DraftEvent,
  DraftEventType,
  DraftTrade,
  TradeAnalysis,
  MockDraft,
  MockParticipant,
  DraftPrep,
  CustomRankings,
  DraftTargets,
  DraftStrategy,
  CheatSheetEntry,
  PlayerTier,
  CommissionerAction,
  CommissionerActionType,
};