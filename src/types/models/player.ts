/**
 * Player and NFL Data Types
 * Comprehensive player data models with stats, projections, and metadata
 */

// ==================== BASIC ENUMS AND CONSTANTS ====================

export type PlayerPosition = &apos;QB&apos; | &apos;RB&apos; | &apos;WR&apos; | &apos;TE&apos; | &apos;K&apos; | &apos;DEF&apos; | &apos;DST&apos;;

export type InjuryStatus = &apos;healthy&apos; | &apos;questionable&apos; | &apos;doubtful&apos; | &apos;out&apos; | &apos;ir&apos; | &apos;pup&apos; | &apos;suspended&apos;;

export type PlayerRole = &apos;starter&apos; | &apos;backup&apos; | &apos;committee&apos; | &apos;handcuff&apos; | &apos;rookie&apos; | &apos;veteran&apos;;

export type ConsistencyLevel = &apos;high&apos; | &apos;medium&apos; | &apos;low&apos;;

export type UpsideLevel = &apos;ceiling&apos; | &apos;steady&apos; | &apos;floor&apos;;

export type SituationChange = &apos;improved&apos; | &apos;same&apos; | &apos;worse&apos; | &apos;unknown&apos;;

export type ScheduleStrength = &apos;easy&apos; | &apos;medium&apos; | &apos;hard&apos;;

// ==================== NFL TEAM TYPES ====================

export interface NFLTeam {
}
  id: string;
  city: string;
  name: string;
  abbreviation: string;
  conference: &apos;AFC&apos; | &apos;NFC&apos;;
  division: &apos;North&apos; | &apos;South&apos; | &apos;East&apos; | &apos;West&apos;;
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  homeStadium: string;
  byeWeek: number;
  timezone: string;
}

// ==================== PLAYER STATS ====================

export interface PlayerStats {
}
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
}

export interface PlayerProjections extends Omit<PlayerStats, &apos;gamesPlayed&apos; | &apos;gamesStarted&apos;> {
}
  projectedFantasyPoints: number;
  weeklyProjections: { [week: number]: number };
  seasonProjection: number;
  confidenceInterval: {
}
    low: number;
    high: number;
  };
  projectionSource: string;
  lastUpdated: Date;
}

// ==================== ADVANCED METRICS ====================

export interface AdvancedMetrics {
}
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
}
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
}
    overall: number;
    vsPosition: number;
    playoff: number;
    championship: number;
  };
}

// ==================== PLAYER METADATA ====================

export interface PlayerBio {
}
  age: number;
  height: string; // e.g., "6&apos;2""
  weight: number;
  college: string;
  experience: number; // years in NFL
  drafted: {
}
    year: number;
    round: number;
    pick: number;
    team: string;
  } | null;
  birthDate: Date;
  birthPlace: string;
}

export interface PlayerContract {
}
  years: number;
  totalValue: number;
  guaranteedMoney: number;
  averagePerYear: number;
  capHit: number;
  signedDate: Date;
  expirationDate: Date;
  hasPlayerOption: boolean;
  hasTeamOption: boolean;
}

export interface InjuryHistory {
}
  date: Date;
  injury: string;
  severity: &apos;minor&apos; | &apos;moderate&apos; | &apos;major&apos; | &apos;career-threatening&apos;;
  expectedRecoveryWeeks: number;
  actualRecoveryWeeks?: number;
  status: InjuryStatus;
  impactOnPerformance?: &apos;none&apos; | &apos;minimal&apos; | &apos;moderate&apos; | &apos;significant&apos;;
}

export interface NewsItem {
}
  id: string;
  headline: string;
  summary: string;
  source: string;
  author: string;
  publishedAt: Date;
  category: &apos;injury&apos; | &apos;trade&apos; | &apos;performance&apos; | &apos;personal&apos; | &apos;team&apos; | &apos;contract&apos;;
  sentiment: &apos;positive&apos; | &apos;neutral&apos; | &apos;negative&apos;;
  fantasyImpact: &apos;bullish&apos; | &apos;neutral&apos; | &apos;bearish&apos;;
  impactScore: number; // 1-10 scale
}

// ==================== MAIN PLAYER INTERFACE ====================

export interface Player {
}
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
}
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
}

// ==================== PLAYER COLLECTIONS ====================

export interface PlayerPool {
}
  availablePlayers: Player[];
  draftedPlayers: Player[];
  freeAgents: Player[];
  waiverWire: Player[];
  injuredReserve: Player[];
}

export interface PositionalRankings {
}
  QB: Player[];
  RB: Player[];
  WR: Player[];
  TE: Player[];
  K: Player[];
  DEF: Player[];
}

// ==================== PLAYER SEARCH AND FILTERING ====================

export interface PlayerFilter {
}
  positions?: PlayerPosition[];
  teams?: string[];
  availability?: (&apos;available&apos; | &apos;drafted&apos; | &apos;free_agent&apos; | &apos;waiver&apos;)[];
  injuryStatus?: InjuryStatus[];
  minRank?: number;
  maxRank?: number;
  minProjectedPoints?: number;
  maxProjectedPoints?: number;
  rookiesOnly?: boolean;
  byeWeeks?: number[];
}

export interface PlayerSortOption {
}
  field: keyof Player | keyof PlayerStats | keyof PlayerProjections;
  direction: &apos;asc&apos; | &apos;desc&apos;;
  label: string;
}

// ==================== PLAYER COMPARISONS ====================

export interface PlayerComparison {
}
  playerA: Player;
  playerB: Player;
  categories: {
}
    overall: {
}
      winner: &apos;A&apos; | &apos;B&apos; | &apos;tie&apos;;
      scoreA: number;
      scoreB: number;
    };
    stats: {
}
      [key in keyof PlayerStats]?: {
}
        winner: &apos;A&apos; | &apos;B&apos; | &apos;tie&apos;;
        valueA: number;
        valueB: number;
      };
    };
    projections: {
}
      winner: &apos;A&apos; | &apos;B&apos; | &apos;tie&apos;;
      scoreA: number;
      scoreB: number;
    };
    situation: {
}
      winner: &apos;A&apos; | &apos;B&apos; | &apos;tie&apos;;
      factorA: string;
      factorB: string;
    };
  };
  recommendation: &apos;A&apos; | &apos;B&apos; | &apos;neither&apos;;
  reasoning: string;
}

// ==================== EXPORT ALL ====================

export type {
}
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