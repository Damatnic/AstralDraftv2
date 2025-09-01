/**
 * Draft and League Management Types
 * Comprehensive types for draft mechanics, league settings, and real-time draft functionality
 */

import { Player } from &apos;./player&apos;;
import { User } from &apos;./user&apos;;

// ==================== DRAFT ENUMS AND CONSTANTS ====================

export type DraftFormat = &apos;SNAKE&apos; | &apos;AUCTION&apos; | &apos;LINEAR&apos; | &apos;KEEPER&apos; | &apos;DYNASTY&apos;;

export type DraftStatus = &apos;SCHEDULED&apos; | &apos;ACTIVE&apos; | &apos;PAUSED&apos; | &apos;COMPLETED&apos; | &apos;CANCELLED&apos;;

export type PickType = &apos;NORMAL&apos; | &apos;AUTO&apos; | &apos;COMMISSIONER&apos; | &apos;KEEPER&apos;;

export type TimerState = &apos;RUNNING&apos; | &apos;PAUSED&apos; | &apos;EXPIRED&apos; | &apos;DISABLED&apos;;

// ==================== DRAFT PICK TYPES ====================

export interface DraftPick {
}
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
}
  teamId: string;
  playerIds: string[];
  autoPickEnabled: boolean;
  maxAutoPicks?: number;
  positionLimits?: { [position: string]: number };
}

// ==================== DRAFT STATE ====================

export interface DraftTimer {
}
  timePerPick: number; // seconds
  timeRemaining: number; // seconds
  state: TimerState;
  pausedAt?: Date;
  resumedAt?: Date;
  overTime: number; // seconds over limit
}

export interface DraftSettings {
}
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
}
    maxKeepers: number;
    keeperDeadline: Date;
    keeperCosts: &apos;NONE&apos; | &apos;DRAFT_ROUND&apos; | &apos;AUCTION_VALUE&apos;;
  };
}

export interface DraftState {
}
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
}
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
}
  id: string;
  teamId: string;
  playerId: string;
  amount: number;
  timestamp: Date;
  isWinning: boolean;
  isNomination: boolean;
}

export interface TeamBudget {
}
  teamId: string;
  totalBudget: number;
  spent: number;
  remaining: number;
  playersRemaining: number;
  averagePerPlayer: number;
}

// ==================== DRAFT BOARD AND RANKINGS ====================

export interface DraftBoard {
}
  availablePlayers: Player[];
  draftedPlayers: { [teamId: string]: Player[] };
  myTeam: {
}
    teamId: string;
    roster: Player[];
    budget?: number;
    picks: number[];
  };
  recommendations: DraftRecommendation[];
  positionNeeds: { [teamId: string]: PositionNeed[] };
}

export interface DraftRecommendation {
}
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
  | &apos;VALUE&apos; 
  | &apos;POSITIONAL_NEED&apos; 
  | &apos;SAFE_PICK&apos; 
  | &apos;SLEEPER&apos; 
  | &apos;HANDCUFF&apos; 
  | &apos;CEILING_PLAY&apos; 
  | &apos;FLOOR_PLAY&apos;
  | &apos;ROOKIE_UPSIDE&apos;
  | &apos;INJURY_REPLACEMENT&apos;;

export interface PositionNeed {
}
  position: string;
  priority: &apos;HIGH&apos; | &apos;MEDIUM&apos; | &apos;LOW&apos;;
  reason: string;
  suggestedPlayers: string[]; // Player IDs
}

// ==================== DRAFT ANALYTICS ====================

export interface DraftGrade {
}
  teamId: string;
  overall: &apos;A+&apos; | &apos;A&apos; | &apos;A-&apos; | &apos;B+&apos; | &apos;B&apos; | &apos;B-&apos; | &apos;C+&apos; | &apos;C&apos; | &apos;C-&apos; | &apos;D+&apos; | &apos;D&apos; | &apos;F&apos;;
  score: number; // 0-100
  categories: {
}
    value: number;
    need: number;
    upside: number;
    safety: number;
    depth: number;
  };
  bestPick: {
}
    playerId: string;
    player: Player;
    round: number;
    reasoning: string;
  };
  worstPick: {
}
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
}
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
}
    player: Player;
    expectedRound: number;
    actualRound: number;
    reasoning: string;
  }[];
}

// ==================== DRAFT EVENTS ====================

export interface DraftEvent {
}
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
  | &apos;DRAFT_STARTED&apos;
  | &apos;DRAFT_PAUSED&apos; 
  | &apos;DRAFT_RESUMED&apos;
  | &apos;DRAFT_COMPLETED&apos;
  | &apos;PICK_MADE&apos;
  | &apos;AUTO_PICK&apos;
  | &apos;PICK_SKIPPED&apos;
  | &apos;TIME_EXPIRED&apos;
  | &apos;NOMINATION_MADE&apos;
  | &apos;BID_PLACED&apos;
  | &apos;AUCTION_WON&apos;
  | &apos;TRADE_COMPLETED&apos;
  | &apos;TEAM_JOINED&apos;
  | &apos;TEAM_LEFT&apos;
  | &apos;ROUND_COMPLETED&apos;
  | &apos;COMMISSIONER_ACTION&apos;;

// ==================== TRADE TYPES ====================

export interface DraftTrade {
}
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
  status: &apos;PROPOSED&apos; | &apos;ACCEPTED&apos; | &apos;REJECTED&apos; | &apos;EXPIRED&apos;;
  proposedAt: Date;
  respondedAt?: Date;
  expiresAt: Date;
}

export interface TradeAnalysis {
}
  tradeId: string;
  fairnessScore: number; // -100 to 100, 0 is fair
  winner: &apos;TEAM_A&apos; | &apos;TEAM_B&apos; | &apos;FAIR&apos;;
  analysis: {
}
    teamA: {
}
      value: number;
      need: number;
      risk: number;
      summary: string;
    };
    teamB: {
}
      value: number;
      need: number;
      risk: number;
      summary: string;
    };
  };
  recommendation: &apos;ACCEPT&apos; | &apos;REJECT&apos; | &apos;COUNTER&apos;;
  reasoning: string;
}

// ==================== MOCK DRAFT TYPES ====================

export interface MockDraft extends Omit<DraftState, &apos;id&apos; | &apos;leagueId&apos;> {
}
  isMock: true;
  participants: MockParticipant[];
  aiDifficulty: &apos;EASY&apos; | &apos;MEDIUM&apos; | &apos;HARD&apos; | &apos;EXPERT&apos;;
  focusPosition?: string; // Position to focus practice on
  scenarioType?: &apos;STANDARD&apos; | &apos;LATE_DRAFT&apos; | &apos;AUCTION_PRACTICE&apos; | &apos;KEEPER_LEAGUE&apos;;
}

export interface MockParticipant {
}
  id: string;
  name: string;
  isHuman: boolean;
  isUser: boolean; // The actual user
  draftingStyle: &apos;AGGRESSIVE&apos; | &apos;CONSERVATIVE&apos; | &apos;VALUE_BASED&apos; | &apos;POSITIONAL&apos;;
  avatar: string;
}

// ==================== DRAFT PREPARATION ====================

export interface DraftPrep {
}
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
}
  [position: string]: {
}
    playerId: string;
    rank: number;
    notes?: string;
  }[];
}

export interface DraftTargets {
}
  early: string[]; // Rounds 1-3
  middle: string[]; // Rounds 4-8
  late: string[]; // Rounds 9+
  sleepers: string[];
  handcuffs: string[];
}

export interface DraftStrategy {
}
  approach: &apos;RB_HEAVY&apos; | &apos;WR_HEAVY&apos; | &apos;ZERO_RB&apos; | &apos;ZERO_WR&apos; | &apos;BALANCED&apos; | &apos;LATE_ROUND_QB&apos;;
  priorities: string[]; // Position order
  riskTolerance: &apos;HIGH&apos; | &apos;MEDIUM&apos; | &apos;LOW&apos;;
  targetPositions: {
}
    round: number;
    positions: string[];
    reasoning: string;
  }[];
}

export interface CheatSheetEntry {
}
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
}
  tier: number;
  position: string;
  playerIds: string[];
  label: string;
  description: string;
}

// ==================== COMMISSIONER CONTROLS ====================

export interface CommissionerAction {
}
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
  | &apos;PAUSE_DRAFT&apos;
  | &apos;RESUME_DRAFT&apos;
  | &apos;RESET_PICK&apos;
  | &apos;FORCE_PICK&apos;
  | &apos;EDIT_PICK&apos;
  | &apos;RESET_TIMER&apos;
  | &apos;KICK_PARTICIPANT&apos;
  | &apos;CHANGE_ORDER&apos;
  | &apos;REVERSE_TRADE&apos;;

// ==================== EXPORT ALL ====================

export type {
}
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