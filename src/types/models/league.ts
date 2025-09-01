/**
 * League Management Types
 * Comprehensive types for league settings, teams, seasons, and competitions
 */

import { User } from &apos;./user&apos;;
import { Player } from &apos;./player&apos;;
import { DraftState } from &apos;./draft&apos;;

// ==================== LEAGUE ENUMS ====================

export type LeagueStatus = &apos;PRE_DRAFT&apos; | &apos;DRAFTING&apos; | &apos;DRAFT_COMPLETE&apos; | &apos;IN_SEASON&apos; | &apos;PLAYOFFS&apos; | &apos;COMPLETE&apos; | &apos;ARCHIVED&apos;;

export type LeagueType = &apos;REDRAFT&apos; | &apos;KEEPER&apos; | &apos;DYNASTY&apos; | &apos;BESTBALL&apos; | &apos;DAILY&apos; | &apos;TOURNAMENT&apos;;

export type ScoringFormat = &apos;STANDARD&apos; | &apos;PPR&apos; | &apos;HALF_PPR&apos; | &apos;SUPER_FLEX&apos; | &apos;TWO_QB&apos; | &apos;IDP&apos; | &apos;CUSTOM&apos;;

export type WaiverType = &apos;FAAB&apos; | &apos;ROLLING&apos; | &apos;REVERSE_STANDINGS&apos; | &apos;DAILY_ROLLING&apos;;

export type PlayoffFormat = &apos;SINGLE_ELIMINATION&apos; | &apos;TWO_WEEK_PLAYOFFS&apos; | &apos;BRACKET_STYLE&apos;;

export type TradeReviewType = &apos;NONE&apos; | &apos;COMMISSIONER&apos; | &apos;LEAGUE_VOTE&apos; | &apos;VETO_VOTE&apos;;

// ==================== SCORING SYSTEM ====================

export interface ScoringRule {
}
  stat: string;
  points: number;
  label: string;
  category: &apos;passing&apos; | &apos;rushing&apos; | &apos;receiving&apos; | &apos;kicking&apos; | &apos;defense&apos; | &apos;misc&apos;;
}

export interface ScoringSettings {
}
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
}
    longTouchdown: { distance: number; points: number }[];
    perfectWeek: { points: number };
    highScore: { threshold: number; points: number };
  };
}

// ==================== ROSTER SETTINGS ====================

export interface RosterSettings {
}
  totalSize: number;
  starters: {
}
    QB: number;
    RB: number;
    WR: number;
    TE: number;
    FLEX: number;
    SUPERFLEX: number;
    K: number;
    DEF: number;
    IDP?: {
}
      DL: number;
      LB: number;
      DB: number;
    };
  };
  bench: number;
  ir: number; // Injured Reserve spots
  taxi?: number; // Taxi squad (dynasty)
  maxPerPosition?: {
}
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
}
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
  draftType: &apos;SNAKE&apos; | &apos;AUCTION&apos; | &apos;LINEAR&apos;;
  draftDate?: Date;
  keeperSettings?: {
}
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
}
    enabled: boolean;
    initialBudget: number;
    minSalary: number;
    maxSalary: number;
  };
  
  // Fun Settings
  lastPlaceFinisher?: {
}
    punishment: string;
    description: string;
  };
  championships?: {
}
    trophy: string;
    prize: string;
    description: string;
  };
}

// ==================== TEAM TYPES ====================

export interface Team {
}
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
}
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
}
  id: string;
  leagueId: string;
  week: number;
  season: number;
  
  homeTeam: {
}
    id: string;
    team: Team;
    score: number;
    lineup: MatchupLineup;
    projected: number;
  };
  
  awayTeam: {
}
    id: string;
    team: Team;
    score: number;
    lineup: MatchupLineup;
    projected: number;
  };
  
  status: &apos;SCHEDULED&apos; | &apos;IN_PROGRESS&apos; | &apos;FINAL&apos;;
  isPlayoff: boolean;
  playoffRound?: number;
  
  // Game flow data
  timeline?: ScoringEvent[];
  leadChanges: number;
  biggestLead: {
}
    team: string;
    points: number;
    time: Date;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

export interface MatchupLineup {
}
  starters: MatchupPlayer[];
  bench: MatchupPlayer[];
  totalScore: number;
  totalProjected: number;
}

export interface MatchupPlayer {
}
  playerId: string;
  player: Player;
  position: string; // Roster position (QB, RB1, FLEX, etc.)
  score: number;
  projected: number;
  isStarting: boolean;
  gameStatus: &apos;NOT_STARTED&apos; | &apos;IN_PROGRESS&apos; | &apos;FINAL&apos;;
  isLocked: boolean;
}

export interface ScoringEvent {
}
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
}
  leagueId: string;
  week: number;
  season: number;
  
  teams: StandingsTeam[];
  divisions?: DivisionStandings[];
  
  wildCard?: {
}
    teams: StandingsTeam[];
    cutoff: number;
  };
  
  lastUpdated: Date;
}

export interface StandingsTeam {
}
  team: Team;
  rank: number;
  record: {
}
    wins: number;
    losses: number;
    ties: number;
    winPercentage: number;
  };
  pointsFor: number;
  pointsAgainst: number;
  streak: {
}
    type: &apos;W&apos; | &apos;L&apos; | &apos;T&apos;;
    count: number;
  };
  clinched?: &apos;PLAYOFFS&apos; | &apos;DIVISION&apos; | &apos;BYE&apos; | &apos;CHAMPIONSHIP&apos;;
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
}
  name: string;
  teams: StandingsTeam[];
}

// ==================== PLAYOFFS ====================

export interface PlayoffBracket {
}
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
}
  round: number;
  name: string; // &apos;Wild Card&apos;, &apos;Divisional&apos;, &apos;Championship&apos;
  week: number;
  matchups: PlayoffMatchup[];
}

export interface PlayoffMatchup {
}
  id: string;
  round: number;
  seed1: number;
  team1: Team;
  seed2: number;
  team2: Team;
  
  winner?: Team;
  
  // Two-week playoff support
  week1Score?: {
}
    team1: number;
    team2: number;
  };
  week2Score?: {
}
    team1: number;
    team2: number;
  };
  totalScore: {
}
    team1: number;
    team2: number;
  };
  
  status: &apos;SCHEDULED&apos; | &apos;IN_PROGRESS&apos; | &apos;FINAL&apos;;
}

// ==================== MAIN LEAGUE INTERFACE ====================

export interface League {
}
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
}
  season: number;
  champion: Team;
  runnerUp: Team;
  regularSeasonChamp: Team;
  
  records: {
}
    highestScore: { team: Team; score: number; week: number };
    lowestScore: { team: Team; score: number; week: number };
    mostPointsFor: Team;
    mostPointsAgainst: Team;
    biggestBlowout: {
}
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
}
  category: string;
  record: number | string;
  holder: Team;
  season: number;
  week?: number;
  date: Date;
}

export interface ActivityItem {
}
  id: string;
  type: &apos;TRADE&apos; | &apos;WAIVER&apos; | &apos;LINEUP&apos; | &apos;DRAFT&apos; | &apos;ADMIN&apos; | &apos;CHAT&apos;;
  user: User;
  description: string;
  timestamp: Date;
  data?: Record<string, any>;
}

export interface TradeHistoryItem {
}
  id: string;
  date: Date;
  team1: Team;
  team2: Team;
  team1Gets: (Player | { type: &apos;PICK&apos;; round: number; year: number })[];
  team2Gets: (Player | { type: &apos;PICK&apos;; round: number; year: number })[];
  status: &apos;COMPLETED&apos; | &apos;VETOED&apos; | &apos;REVERSED&apos;;
  votes?: { team: Team; vote: &apos;APPROVE&apos; | &apos;VETO&apos; }[];
}

export interface WaiverHistoryItem {
}
  id: string;
  date: Date;
  team: Team;
  action: &apos;ADD&apos; | &apos;DROP&apos;;
  player: Player;
  cost: number; // FAAB cost or waiver priority
  successful: boolean;
}

// ==================== LEAGUE CREATION ====================

export interface LeagueTemplate {
}
  id: string;
  name: string;
  description: string;
  settings: Partial<LeagueSettings>;
  popular: boolean;
  tags: string[];
}

export interface CreateLeagueRequest {
}
  name: string;
  settings: LeagueSettings;
  templateId?: string;
  inviteEmails?: string[];
}

// ==================== EXPORT ALL ====================

export type {
}
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