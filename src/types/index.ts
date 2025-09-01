/**
 * Core Type Definitions for Astral Draft
 * Comprehensive type system to replace 110+ 'any' types
 */

// ==================== PLAYER AND TEAM TYPES ====================

export interface Player {
  id: number;
  name: string;
  position: 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DEF';
  team: string;
  projectedPoints: number;
  averageDraftPosition: number;
  tier: number;
  byeWeek: number;
  injury?: {
    status: 'healthy' | 'questionable' | 'doubtful' | 'out';
    description?: string;
  };
  stats?: PlayerStats;
  isRookie?: boolean;
  age?: number;
  height?: string;
  weight?: number;
}

export interface PlayerStats {
  passingYards?: number;
  passingTDs?: number;
  interceptions?: number;
  rushingYards?: number;
  rushingTDs?: number;
  receptions?: number;
  receivingYards?: number;
  receivingTDs?: number;
  fumbles?: number;
  fieldGoalsMade?: number;
  fieldGoalsAttempted?: number;
  extraPointsMade?: number;
  defensiveTDs?: number;
  sacks?: number;
  safeties?: number;
}

export interface Team {
  id: number;
  name: string;
  owner: string;
  roster: Player[];
  record: {
    wins: number;
    losses: number;
    ties: number;
  };
  totalPoints: number;
  projectedPoints?: number;
  waiversUsed?: number;
  tradesCompleted?: number;
}

// ==================== DRAFT TYPES ====================

export interface DraftPick {
  pick: number;
  round: number;
  teamId: number;
  playerId?: number;
  timeSelected?: Date;
  timeRemaining?: number;
  isAutoPick?: boolean;
}

export interface DraftState {
  isActive: boolean;
  currentPick: number;
  currentTeamId: number;
  picks: DraftPick[];
  timePerPick: number;
  draftType: 'snake' | 'linear' | 'auction';
  startTime?: Date;
  pausedAt?: Date;
  totalRounds: number;
  leagueId: number;
}

export interface DraftBoard {
  availablePlayers: Player[];
  draftedPlayers: Player[];
  myTeam: Team;
  allTeams: Team[];
  currentPick: DraftPick;
  upcomingPicks: DraftPick[];
}

// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  timestamp: string;
  status?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==================== USER AND AUTH TYPES ====================

export interface User {
  id: number;
  name: string;
  email: string;
  teamName: string;
  avatar: string;
  isCommissioner: boolean;
  isAuthenticated: boolean;
  preferences: UserPreferences;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  autoRefresh: boolean;
  draftReminders: boolean;
  emailUpdates: boolean;
  soundEffects: boolean;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  token?: string;
}

// ==================== LEAGUE TYPES ====================

export interface League {
  id: number;
  name: string;
  commissioner: User;
  teams: Team[];
  settings: LeagueSettings;
  season: number;
  isActive: boolean;
  draftCompleted: boolean;
  currentWeek: number;
}

export interface LeagueSettings {
  teamCount: number;
  rosterSize: number;
  benchSize: number;
  tradingEnabled: boolean;
  waiverPeriod: number;
  playoffWeeks: number;
  scoringSystem: ScoringSystem;
  draftSettings: DraftSettings;
}

export interface ScoringSystem {
  passingTD: number;
  passingYard: number;
  rushingTD: number;
  rushingYard: number;
  receivingTD: number;
  receivingYard: number;
  reception: number;
  interception: number;
  fumble: number;
  fieldGoal: number;
  extraPoint: number;
  safety: number;
  defensiveTD: number;
}

export interface DraftSettings {
  type: 'snake' | 'linear' | 'auction';
  timePerPick: number;
  rounds: number;
  scheduledStart?: Date;
  allowAutoDraft: boolean;
}

// ==================== NOTIFICATION TYPES ====================

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

// ==================== VIEW AND UI TYPES ====================

export type ViewType = 
  | 'dashboard' 
  | 'draft-room' 
  | 'team-hub' 
  | 'players' 
  | 'trades' 
  | 'waivers' 
  | 'standings' 
  | 'messages' 
  | 'admin';

export interface ViewState {
  currentView: ViewType;
  previousView?: ViewType;
  viewData?: Record<string, unknown>;
}

export interface ModalState {
  isOpen: boolean;
  type?: string;
  data?: Record<string, unknown>;
  onClose?: () => void;
}

// ==================== ERROR TYPES ====================

export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: Date;
  userId?: number;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// ==================== ANALYTICS TYPES ====================

export interface PredictionFactors {
  playerForm: number;
  matchupDifficulty: number;
  weatherImpact: number;
  injuryRisk: number;
  teamOffense: number;
  recentPerformance: number[];
}

export interface CompositeScore {
  overall: number;
  confidence: number;
  factors: PredictionFactors;
  recommendation: 'start' | 'bench' | 'flex';
}

// ==================== WEBSOCKET TYPES ====================

export interface WebSocketMessage {
  type: string;
  payload: Record<string, unknown>;
  timestamp: Date;
  userId?: number;
}

export interface DraftUpdate extends WebSocketMessage {
  type: 'draft_pick' | 'draft_pause' | 'draft_resume' | 'time_update';
  payload: {
    pick?: DraftPick;
    timeRemaining?: number;
    currentTeamId?: number;
  };
}

// ==================== UTILITY TYPES ====================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: string;
  direction: SortDirection;
}

export interface FilterConfig {
  field: string;
  value: unknown;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'in';
}

// ==================== EVENT HANDLER TYPES ====================

export type FormChangeHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
export type FormSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => void;
export type ButtonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;
export type GenericClickHandler = (event: React.MouseEvent) => void;