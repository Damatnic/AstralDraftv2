/**
 * League Management Types
 * Comprehensive types for league settings, teams, seasons, and competitions
 */

import { User } from './user';
import { Player } from './player';
import { DraftState } from './draft';

// ==================== LEAGUE ENUMS ====================

export type LeagueStatus = 'PRE_DRAFT' | 'DRAFTING' | 'DRAFT_COMPLETE' | 'IN_SEASON' | 'PLAYOFFS' | 'COMPLETE' | 'ARCHIVED';

export type LeagueType = 'REDRAFT' | 'KEEPER' | 'DYNASTY' | 'BESTBALL' | 'DAILY' | 'TOURNAMENT';

export type ScoringFormat = 'STANDARD' | 'PPR' | 'HALF_PPR' | 'SUPER_FLEX' | 'TWO_QB' | 'IDP' | 'CUSTOM';

export type WaiverType = 'FAAB' | 'ROLLING' | 'REVERSE_STANDINGS' | 'DAILY_ROLLING';

export type PlayoffFormat = 'SINGLE_ELIMINATION' | 'TWO_WEEK_PLAYOFFS' | 'BRACKET_STYLE';

export type TradeReviewType = 'NONE' | 'COMMISSIONER' | 'LEAGUE_VOTE' | 'VETO_VOTE';

// ==================== SCORING SYSTEM ====================

export interface ScoringRule {
  stat: string;
  points: number;
  label: string;
  category: 'passing' | 'rushing' | 'receiving' | 'kicking' | 'defense' | 'misc';
}

export interface ScoringSettings {
  format: ScoringFormat;
  passingRules: ScoringRule[];
  rushingRules: ScoringRule[];
  receivingRules: ScoringRule[];
  kickingRules: ScoringRule[];
  defenseRules: ScoringRule[];
  miscRules: ScoringRule[];
  fractionalScoring: boolean;
  negativePoints: boolean;
  bonuses: {
    longTouchdown: { distance: number; points: number }[];
    perfectWeek: { points: number };
    highScore: { threshold: number; points: number };
  };
}

// ==================== ROSTER SETTINGS ====================

export interface RosterSettings {
  totalSize: number;
  starters: {
    QB: number;
    RB: number;
    WR: number;
    TE: number;
    FLEX: number;
    SUPERFLEX: number;
    K: number;
    DEF: number;
    IDP?: {
      DL: number;
      LB: number;
      DB: number;
    };
  };
  bench: number;
  ir: number; // Injured Reserve spots
  taxi?: number; // Taxi squad (dynasty)
  maxPerPosition?: {
    QB: number;
    RB: number;
    WR: number;
    TE: number;
    K: number;
    DEF: number;
  };
}

// ==================== LEAGUE SETTINGS ====================

export interface LeagueSettings {
  // Basic Settings
  name: string;
  type: LeagueType;
  teamCount: number;
  divisions?: number;
  
  // Scoring
  scoring: ScoringSettings;
  roster: RosterSettings;
  
  // Season Structure
  regularSeasonWeeks: number;
  playoffTeams: number;
  playoffWeeks: number;
  playoffFormat: PlayoffFormat;
  tradeDeadline: number; // Week number
  
  // Draft Settings
  draftType: 'SNAKE' | 'AUCTION' | 'LINEAR';
  draftDate?: Date;
  keeperSettings?: {
    maxKeepers: number;
    keeperDeadline: Date;
    keeperCosts: boolean;
    rookieKeepers: boolean;
  };
  
  // Transactions
  waiverType: WaiverType;
  faabBudget?: number;
  waiverPeriod: number; // hours
  dailyWaivers: boolean;
  tradeReview: TradeReviewType;
  tradeReviewPeriod: number; // hours
  voteToVeto?: number; // percentage needed
  
  // Advanced Settings
  fractionalScoring: boolean;
  negativeDefensePoints: boolean;
  playoffReseeding: boolean;
  lotteryDraft: boolean;
  rookieDraft?: boolean;
  salaryCapSettings?: {
    enabled: boolean;
    initialBudget: number;
    minSalary: number;
    maxSalary: number;
  };
  
  // Fun Settings
  lastPlaceFinisher?: {
    punishment: string;
    description: string;
  };
  championships?: {
    trophy: string;
    prize: string;
    description: string;
  };
}

// ==================== TEAM TYPES ====================

export interface Team {
  id: string;
  leagueId: string;
  name: string;
  abbreviation: string;
  owner: User;
  
  // Visual Identity
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  helmet?: string;
  jersey?: string;
  
  // Roster
  roster: Player[];
  startingLineup: { [position: string]: string | null }; // position -> player ID
  bench: Player[];
  injuredReserve: Player[];
  taxi?: Player[]; // Dynasty taxi squad
  
  // Season Stats
  record: {
    wins: number;
    losses: number;
    ties: number;
    winPercentage: number;
    playoffAppearances: number;
    championships: number;
  };
  
  // Scoring
  pointsFor: number;
  pointsAgainst: number;
  pointsForAverage: number;
  pointsAgainstAverage: number;
  
  // Transactions
  faabBudget: number;
  faabUsed: number;
  waiverPriority?: number;
  trades: number;
  waiverClaims: number;
  
  // Draft
  draftPosition: number;
  draftGrade?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// ==================== MATCHUP TYPES ====================

export interface Matchup {
  id: string;
  leagueId: string;
  week: number;
  season: number;
  
  homeTeam: {
    id: string;
    team: Team;
    score: number;
    lineup: MatchupLineup;
    projected: number;
  };
  
  awayTeam: {
    id: string;
    team: Team;
    score: number;
    lineup: MatchupLineup;
    projected: number;
  };
  
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'FINAL';
  isPlayoff: boolean;
  playoffRound?: number;
  
  // Game flow data
  timeline?: ScoringEvent[];
  leadChanges: number;
  biggestLead: {
    team: string;
    points: number;
    time: Date;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

export interface MatchupLineup {
  starters: MatchupPlayer[];
  bench: MatchupPlayer[];
  totalScore: number;
  totalProjected: number;
}

export interface MatchupPlayer {
  playerId: string;
  player: Player;
  position: string; // Roster position (QB, RB1, FLEX, etc.)
  score: number;
  projected: number;
  isStarting: boolean;
  gameStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'FINAL';
  isLocked: boolean;
}

export interface ScoringEvent {
  id: string;
  matchupId: string;
  playerId: string;
  player: Player;
  teamId: string;
  points: number;
  totalPoints: number;
  description: string;
  timestamp: Date;
  statType: string;
  quarter?: number;
  timeRemaining?: string;
}

// ==================== STANDINGS ====================

export interface Standings {
  leagueId: string;
  week: number;
  season: number;
  
  teams: StandingsTeam[];
  divisions?: DivisionStandings[];
  
  wildCard?: {
    teams: StandingsTeam[];
    cutoff: number;
  };
  
  lastUpdated: Date;
}

export interface StandingsTeam {
  team: Team;
  rank: number;
  record: {
    wins: number;
    losses: number;
    ties: number;
    winPercentage: number;
  };
  pointsFor: number;
  pointsAgainst: number;
  streak: {
    type: 'W' | 'L' | 'T';
    count: number;
  };
  clinched?: 'PLAYOFFS' | 'DIVISION' | 'BYE' | 'CHAMPIONSHIP';
  eliminated?: boolean;
  divisionRank?: number;
  
  // Playoff probability
  playoffOdds: number;
  championshipOdds: number;
  
  // Tiebreakers
  headToHeadRecord?: { [teamId: string]: string };
  divisionalRecord?: string;
  commonOpponentsRecord?: string;
}

export interface DivisionStandings {
  name: string;
  teams: StandingsTeam[];
}

// ==================== PLAYOFFS ====================

export interface PlayoffBracket {
  leagueId: string;
  season: number;
  format: PlayoffFormat;
  
  rounds: PlayoffRound[];
  champion?: Team;
  runnerUp?: Team;
  thirdPlace?: Team;
  
  createdAt: Date;
  completedAt?: Date;
}

export interface PlayoffRound {
  round: number;
  name: string; // 'Wild Card', 'Divisional', 'Championship'
  week: number;
  matchups: PlayoffMatchup[];
}

export interface PlayoffMatchup {
  id: string;
  round: number;
  seed1: number;
  team1: Team;
  seed2: number;
  team2: Team;
  
  winner?: Team;
  
  // Two-week playoff support
  week1Score?: {
    team1: number;
    team2: number;
  };
  week2Score?: {
    team1: number;
    team2: number;
  };
  totalScore: {
    team1: number;
    team2: number;
  };
  
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'FINAL';
}

// ==================== MAIN LEAGUE INTERFACE ====================

export interface League {
  // Basic Info
  id: string;
  name: string;
  abbreviation: string;
  description?: string;
  avatar: string;
  
  // Structure
  commissioner: User;
  members: User[];
  teams: Team[];
  status: LeagueStatus;
  type: LeagueType;
  
  // Settings
  settings: LeagueSettings;
  
  // Season Data
  currentSeason: number;
  currentWeek: number;
  draftState?: DraftState;
  
  // Schedule and Results
  schedule: Matchup[];
  standings: Standings;
  playoffs?: PlayoffBracket;
  
  // History
  pastSeasons: SeasonSummary[];
  allTimeRecords: AllTimeRecord[];
  
  // Activity
  recentActivity: ActivityItem[];
  tradeHistory: TradeHistoryItem[];
  waiverHistory: WaiverHistoryItem[];
  
  // Configuration
  isPublic: boolean;
  inviteCode?: string;
  password?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  seasonStartDate: Date;
  seasonEndDate: Date;
}

// ==================== HISTORY AND RECORDS ====================

export interface SeasonSummary {
  season: number;
  champion: Team;
  runnerUp: Team;
  regularSeasonChamp: Team;
  
  records: {
    highestScore: { team: Team; score: number; week: number };
    lowestScore: { team: Team; score: number; week: number };
    mostPointsFor: Team;
    mostPointsAgainst: Team;
    biggestBlowout: {
      winner: Team;
      loser: Team;
      margin: number;
      week: number;
    };
  };
  
  standings: StandingsTeam[];
  draftGrades?: { [teamId: string]: string };
}

export interface AllTimeRecord {
  category: string;
  record: number | string;
  holder: Team;
  season: number;
  week?: number;
  date: Date;
}

export interface ActivityItem {
  id: string;
  type: 'TRADE' | 'WAIVER' | 'LINEUP' | 'DRAFT' | 'ADMIN' | 'CHAT';
  user: User;
  description: string;
  timestamp: Date;
  data?: Record<string, any>;
}

export interface TradeHistoryItem {
  id: string;
  date: Date;
  team1: Team;
  team2: Team;
  team1Gets: (Player | { type: 'PICK'; round: number; year: number })[];
  team2Gets: (Player | { type: 'PICK'; round: number; year: number })[];
  status: 'COMPLETED' | 'VETOED' | 'REVERSED';
  votes?: { team: Team; vote: 'APPROVE' | 'VETO' }[];
}

export interface WaiverHistoryItem {
  id: string;
  date: Date;
  team: Team;
  action: 'ADD' | 'DROP';
  player: Player;
  cost: number; // FAAB cost or waiver priority
  successful: boolean;
}

// ==================== LEAGUE CREATION ====================

export interface LeagueTemplate {
  id: string;
  name: string;
  description: string;
  settings: Partial<LeagueSettings>;
  popular: boolean;
  tags: string[];
}

export interface CreateLeagueRequest {
  name: string;
  settings: LeagueSettings;
  templateId?: string;
  inviteEmails?: string[];
}

// ==================== EXPORT ALL ====================

export type {
  LeagueStatus,
  LeagueType,
  ScoringFormat,
  WaiverType,
  PlayoffFormat,
  TradeReviewType,
  ScoringRule,
  ScoringSettings,
  RosterSettings,
  LeagueSettings,
  Team,
  Matchup,
  MatchupLineup,
  MatchupPlayer,
  ScoringEvent,
  Standings,
  StandingsTeam,
  DivisionStandings,
  PlayoffBracket,
  PlayoffRound,
  PlayoffMatchup,
  League,
  SeasonSummary,
  AllTimeRecord,
  ActivityItem,
  TradeHistoryItem,
  WaiverHistoryItem,
  LeagueTemplate,
  CreateLeagueRequest,
};