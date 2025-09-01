/**
 * Player and NFL Data Types
 * Comprehensive player data models with stats, projections, and metadata
 */

// ==================== BASIC ENUMS AND CONSTANTS ====================

export type PlayerPosition = 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DEF' | 'DST';

export type InjuryStatus = 'healthy' | 'questionable' | 'doubtful' | 'out' | 'ir' | 'pup' | 'suspended';

export type PlayerRole = 'starter' | 'backup' | 'committee' | 'handcuff' | 'rookie' | 'veteran';

export type ConsistencyLevel = 'high' | 'medium' | 'low';

export type UpsideLevel = 'ceiling' | 'steady' | 'floor';

export type SituationChange = 'improved' | 'same' | 'worse' | 'unknown';

export type ScheduleStrength = 'easy' | 'medium' | 'hard';

// ==================== NFL TEAM TYPES ====================

export interface NFLTeam {
  id: string;
  city: string;
  name: string;
  abbreviation: string;
  conference: 'AFC' | 'NFC';
  division: 'North' | 'South' | 'East' | 'West';
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  homeStadium: string;
  byeWeek: number;
  timezone: string;

// ==================== PLAYER STATS ====================

export interface PlayerStats {
  // Passing stats (QB)
  passingYards?: number;
  passingTDs?: number;
  interceptions?: number;
  completions?: number;
  attempts?: number;
  passingCompletionPercentage?: number;
  yardsPerAttempt?: number;
  quarterbackRating?: number;
  
  // Rushing stats (RB, QB)
  rushingYards?: number;
  rushingTDs?: number;
  rushingAttempts?: number;
  yardsPerCarry?: number;
  rushingFumbles?: number;
  
  // Receiving stats (WR, TE, RB)
  receptions?: number;
  receivingYards?: number;
  receivingTDs?: number;
  targets?: number;
  targetShare?: number;
  yardsPerReception?: number;
  yardsAfterCatch?: number;
  receivingFumbles?: number;
  
  // Kicking stats (K)
  fieldGoalsMade?: number;
  fieldGoalsAttempted?: number;
  fieldGoalPercentage?: number;
  extraPointsMade?: number;
  extraPointsAttempted?: number;
  longestFieldGoal?: number;
  fieldGoals0_29?: { made: number; attempted: number };
  fieldGoals30_39?: { made: number; attempted: number };
  fieldGoals40_49?: { made: number; attempted: number };
  fieldGoals50Plus?: { made: number; attempted: number };
  
  // Defense/Special Teams (DEF)
  defensiveTDs?: number;
  sacks?: number;
  interceptionTDs?: number;
  fumbleRecoveries?: number;
  fumbleRecoveryTDs?: number;
  safeties?: number;
  blockedKicks?: number;
  returnTDs?: number;
  pointsAllowed?: number;
  yardsAllowed?: number;
  
  // General stats
  fumbles?: number;
  fantasyPoints?: number;
  gamesPlayed?: number;
  gamesStarted?: number;
  snapCount?: number;
  snapPercentage?: number;

export interface PlayerProjections extends Omit<PlayerStats, 'gamesPlayed' | 'gamesStarted'> {
  projectedFantasyPoints: number;
  weeklyProjections: { [week: number]: number };
  seasonProjection: number;
  confidenceInterval: {
    low: number;
    high: number;
  };
  projectionSource: string;
  lastUpdated: Date;

// ==================== ADVANCED METRICS ====================

export interface AdvancedMetrics {
  // Efficiency metrics
  snapCountPct: number;
  targetSharePct: number;
  redZoneTouches: number;
  goalLineCarries?: number;
  redZoneTargets?: number;
  
  // Situational metrics
  thirdDownConversions?: number;
  fourthDownConversions?: number;
  twoMinuteDrillStats?: {
    attempts: number;
    completions: number;
    touchdowns: number;
  };
  
  // Advanced receiving metrics
  separationYards?: number;
  catchRadius?: number;
  droppedPasses?: number;
  contestedCatchRate?: number;
  
  // Advanced rushing metrics
  yardsAfterContact?: number;
  breakawayRunPercentage?: number;
  redZoneCarryShare?: number;
  
  // Air yards and target quality
  averageDepthOfTarget?: number;
  airYards?: number;
  yardsAfterCatchPerReception?: number;
  
  // Strength of schedule
  strengthOfSchedule: {
    overall: number;
    vsPosition: number;
    playoff: number;
    championship: number;
  };

// ==================== PLAYER METADATA ====================

export interface PlayerBio {
  age: number;
  height: string; // e.g., "6'2""
  weight: number;
  college: string;
  experience: number; // years in NFL
  drafted: {
    year: number;
    round: number;
    pick: number;
    team: string;
  } | null;
  birthDate: Date;
  birthPlace: string;

export interface PlayerContract {
  years: number;
  totalValue: number;
  guaranteedMoney: number;
  averagePerYear: number;
  capHit: number;
  signedDate: Date;
  expirationDate: Date;
  hasPlayerOption: boolean;
  hasTeamOption: boolean;

export interface InjuryHistory {
  date: Date;
  injury: string;
  severity: 'minor' | 'moderate' | 'major' | 'career-threatening';
  expectedRecoveryWeeks: number;
  actualRecoveryWeeks?: number;
  status: InjuryStatus;
  impactOnPerformance?: 'none' | 'minimal' | 'moderate' | 'significant';

export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  source: string;
  author: string;
  publishedAt: Date;
  category: 'injury' | 'trade' | 'performance' | 'personal' | 'team' | 'contract';
  sentiment: 'positive' | 'neutral' | 'negative';
  fantasyImpact: 'bullish' | 'neutral' | 'bearish';
  impactScore: number; // 1-10 scale

// ==================== MAIN PLAYER INTERFACE ====================

export interface Player {
  // Basic Info
  id: string;
  name: string;
  position: PlayerPosition;
  team: NFLTeam;
  jerseyNumber: number;
  
  // Fantasy Relevant Data
  rank: number;
  tier: number;
  adp: number; // Average Draft Position
  auctionValue: number;
  projectedPoints: number;
  
  // Status and Availability
  isActive: boolean;
  isRookie: boolean;
  injuryStatus: InjuryStatus;
  role: PlayerRole;
  
  // Performance Indicators
  consistency: ConsistencyLevel;
  upside: UpsideLevel;
  floor: number;
  ceiling: number;
  
  // Situational Analysis
  situationChange: SituationChange;
  handcuffValue: ConsistencyLevel;
  scheduleStrength: {
    overall: ScheduleStrength;
    playoff: ScheduleStrength;
    championship: ScheduleStrength;
  };
  
  // Data Objects
  stats: PlayerStats;
  projections: PlayerProjections;
  bio: PlayerBio;
  contract?: PlayerContract;
  injuryHistory: InjuryHistory[];
  newsFeed: NewsItem[];
  advancedMetrics: AdvancedMetrics;
  
  // Fantasy-specific metadata
  fantasyRank: number;
  positionRank: number;
  byeWeek: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastStatsUpdate: Date;

// ==================== PLAYER COLLECTIONS ====================

export interface PlayerPool {
  availablePlayers: Player[];
  draftedPlayers: Player[];
  freeAgents: Player[];
  waiverWire: Player[];
  injuredReserve: Player[];

export interface PositionalRankings {
  QB: Player[];
  RB: Player[];
  WR: Player[];
  TE: Player[];
  K: Player[];
  DEF: Player[];

// ==================== PLAYER SEARCH AND FILTERING ====================

export interface PlayerFilter {
  positions?: PlayerPosition[];
  teams?: string[];
  availability?: ('available' | 'drafted' | 'free_agent' | 'waiver')[];
  injuryStatus?: InjuryStatus[];
  minRank?: number;
  maxRank?: number;
  minProjectedPoints?: number;
  maxProjectedPoints?: number;
  rookiesOnly?: boolean;
  byeWeeks?: number[];

export interface PlayerSortOption {
  field: keyof Player | keyof PlayerStats | keyof PlayerProjections;
  direction: 'asc' | 'desc';
  label: string;

// ==================== PLAYER COMPARISONS ====================

export interface PlayerComparison {
  playerA: Player;
  playerB: Player;
  categories: {
    overall: {
      winner: 'A' | 'B' | 'tie';
      scoreA: number;
      scoreB: number;
    };
    stats: {
      [key in keyof PlayerStats]?: {
        winner: 'A' | 'B' | 'tie';
        valueA: number;
        valueB: number;
      };
    };
    projections: {
      winner: 'A' | 'B' | 'tie';
      scoreA: number;
      scoreB: number;
    };
    situation: {
      winner: 'A' | 'B' | 'tie';
      factorA: string;
      factorB: string;
    };
  };
  recommendation: 'A' | 'B' | 'neither';
  reasoning: string;

// ==================== EXPORT ALL ====================

export type {
  PlayerPosition,
  InjuryStatus,
  PlayerRole,
  ConsistencyLevel,
  UpsideLevel,
  SituationChange,
  ScheduleStrength,
  NFLTeam,
  PlayerStats,
  PlayerProjections,
  AdvancedMetrics,
  PlayerBio,
  PlayerContract,
  InjuryHistory,
  NewsItem,
  Player,
  PlayerPool,
  PositionalRankings,
  PlayerFilter,
  PlayerSortOption,
  PlayerComparison,
};