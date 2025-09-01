/**
 * Core Type Definitions for Fantasy Football Platform
 */

// Player Types
export interface Player {
}
  id: string;
  name: string;
  position: string;
  team: string;
  jersey?: number;
  age?: number;
  experience?: number;
  height?: string;
  weight?: number;
  college?: string;
  imageUrl?: string;
  injuryStatus?: &apos;Healthy&apos; | &apos;Questionable&apos; | &apos;Doubtful&apos; | &apos;Out&apos; | &apos;IR&apos;;
  isSuspended?: boolean;
  byeWeek?: number;
  
  // Statistics
  stats?: PlayerStats;
  projectedPoints?: number;
  fantasyPoints?: number;
  fantasyPointsPerGame?: number;
  
  // DFS specific
  salary?: number;
  ownership?: number;
}

export interface PlayerStats {
}
  gamesPlayed: number;
  gamesStarted: number;
  fantasyPoints: number;
  fantasyPointsPerGame: number;
  
  // Offensive stats
  passingYards?: number;
  passingTDs?: number;
  interceptions?: number;
  rushingYards?: number;
  rushingTDs?: number;
  receptions?: number;
  receivingYards?: number;
  receivingTDs?: number;
  targets?: number;
  
  // Defensive stats
  tackles?: number;
  sacks?: number;
  interceptions_def?: number;
  forcedFumbles?: number;
  
  // Kicking stats
  fieldGoalsMade?: number;
  fieldGoalsAttempted?: number;
  extraPointsMade?: number;
  extraPointsAttempted?: number;
}

// Team Types
export interface Team {
}
  id: string;
  ownerId: string;
  name: string;
  logo?: string;
  players: Player[];
  wins: number;
  losses: number;
  ties: number;
  pointsFor: number;
  pointsAgainst: number;
  standing: number;
  playoffSeed?: number;
  isPlayoffTeam?: boolean;
  roster?: Roster;
  draftPicks?: DraftPick[];
}

export interface Roster {
}
  starters: Player[];
  bench: Player[];
  injured?: Player[];
  taxi?: Player[];
  maxSize: number;
}

// League Types
export interface League {
}
  id: string;
  name: string;
  commissionerId: string;
  teams: Team[];
  scoringSettings: ScoringSettings;
  rosterSettings: RosterSettings;
  draftSettings?: DraftSettings;
  waiverSettings?: WaiverSettings;
  tradeSettings?: TradeSettings;
  playoffSettings?: PlayoffSettings;
  season: number;
  currentWeek: number;
  isActive: boolean;
  leagueType: &apos;redraft&apos; | &apos;keeper&apos; | &apos;dynasty&apos;;
}

export interface ScoringSettings {
}
  // Passing
  passingYards: number;
  passingTD: number;
  interception: number;
  
  // Rushing
  rushingYards: number;
  rushingTD: number;
  
  // Receiving
  receivingYards: number;
  receivingTD: number;
  receptions: number; // PPR value
  
  // Misc
  fumble: number;
  twoPointConversion: number;
  
  // Kicking
  fieldGoal0to39?: number;
  fieldGoal40to49?: number;
  fieldGoal50Plus?: number;
  extraPoint?: number;
  
  // Defense
  defensiveTD?: number;
  safety?: number;
  sack?: number;
  interceptionDef?: number;
  fumbleRecovery?: number;
  pointsAllowed0?: number;
  pointsAllowed1to6?: number;
  pointsAllowed7to13?: number;
  pointsAllowed14to20?: number;
  pointsAllowed21to27?: number;
  pointsAllowed28to34?: number;
  pointsAllowed35Plus?: number;
}

export interface RosterSettings {
}
  qb: number;
  rb: number;
  wr: number;
  te: number;
  flex: number;
  k: number;
  def: number;
  bench: number;
  ir?: number;
  taxi?: number;
  totalSize: number;
}

export interface DraftSettings {
}
  type: &apos;snake&apos; | &apos;auction&apos; | &apos;linear&apos;;
  rounds: number;
  timePerPick: number;
  auctionBudget?: number;
  draftDate?: Date;
  draftOrder?: string[];
}

export interface WaiverSettings {
}
  type: &apos;priority&apos; | &apos;faab&apos; | &apos;continuous&apos;;
  waiverPeriod: number; // days
  faabBudget?: number;
  waiverDay?: string;
  waiverTime?: string;
}

export interface TradeSettings {
}
  reviewPeriod: number; // hours
  votesRequired?: number;
  vetoVotes?: number;
  tradeDeadline?: Date;
  allowTradePicks?: boolean;
}

export interface PlayoffSettings {
}
  playoffTeams: number;
  playoffWeeks: number[];
  twoWeekMatchups?: boolean;
  reseedAfterRound?: boolean;
}

// Lineup Types
export interface LineupSlot {
}
  position: string;
  player?: Player;
  isLocked: boolean;
  projectedPoints: number;
  actualPoints?: number;
}

export interface Lineup {
}
  teamId: string;
  week: number;
  slots: LineupSlot[];
  totalProjectedPoints: number;
  totalActualPoints?: number;
  isSubmitted: boolean;
  lastUpdated: Date;
}

// Draft Types
export interface DraftPick {
}
  pickNumber: number;
  round: number;
  teamId: string;
  playerId?: string;
  player?: Player;
  timestamp?: Date;
  isKeeper?: boolean;
  value?: number; // For auction drafts
}

export interface Draft {
}
  id: string;
  leagueId: string;
  status: &apos;pre_draft&apos; | &apos;in_progress&apos; | &apos;completed&apos;;
  currentPick?: number;
  picks: DraftPick[];
  startTime?: Date;
  endTime?: Date;
}

// Trade Types
export interface Trade {
}
  id: string;
  proposingTeamId: string;
  receivingTeamId: string;
  proposingPlayers: Player[];
  receivingPlayers: Player[];
  proposingPicks?: DraftPick[];
  receivingPicks?: DraftPick[];
  status: &apos;pending&apos; | &apos;accepted&apos; | &apos;rejected&apos; | &apos;vetoed&apos; | &apos;expired&apos;;
  proposedDate: Date;
  responseDate?: Date;
  notes?: string;
}

// Waiver Types
export interface WaiverClaim {
}
  id: string;
  teamId: string;
  playerId: string;
  dropPlayerId?: string;
  priority: number;
  bidAmount?: number; // For FAAB
  status: &apos;pending&apos; | &apos;successful&apos; | &apos;failed&apos;;
  processDate?: Date;
}

// Game/Matchup Types
export interface Matchup {
}
  id: string;
  week: number;
  homeTeamId: string;
  awayTeamId: string;
  homeScore?: number;
  awayScore?: number;
  isComplete: boolean;
  isPlayoff?: boolean;
  winnerTeamId?: string;
}

export interface NFLGame {
}
  id: string;
  week: number;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  gameTime: Date;
  isComplete: boolean;
  quarter?: string;
  timeRemaining?: string;
  weather?: WeatherConditions;
}

export interface WeatherConditions {
}
  temperature: number;
  windSpeed: number;
  precipitation: number;
  condition: &apos;clear&apos; | &apos;cloudy&apos; | &apos;rain&apos; | &apos;snow&apos; | &apos;dome&apos;;
}

// Notification Types
export interface Notification {
}
  id: string;
  userId: string;
  type: &apos;trade&apos; | &apos;waiver&apos; | &apos;injury&apos; | &apos;lineup&apos; | &apos;score&apos; | &apos;news&apos;;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
}

// User Types
export interface User {
}
  id: string;
  email: string;
  username: string;
  displayName?: string;
  avatar?: string;
  teams?: Team[];
  leagues?: League[];
  notifications?: Notification[];
  preferences?: UserPreferences;
}

export interface UserPreferences {
}
  emailNotifications: boolean;
  pushNotifications: boolean;
  tradeNotifications: boolean;
  injuryNotifications: boolean;
  lineupReminders: boolean;
  theme: &apos;light&apos; | &apos;dark&apos; | &apos;auto&apos;;
  timezone: string;
}

// Analytics Types
export interface PlayerProjection {
}
  playerId: string;
  week: number;
  projectedPoints: number;
  confidence: number;
  floor: number;
  ceiling: number;
  source: string;
  lastUpdated: Date;
}

export interface TeamAnalytics {
}
  teamId: string;
  powerRanking: number;
  playoffProbability: number;
  championshipProbability: number;
  projectedWins: number;
  projectedLosses: number;
  strengthOfSchedule: number;
  remainingDifficulty: number;
}

// News/Update Types
export interface NewsItem {
}
  id: string;
  playerId?: string;
  teamId?: string;
  headline: string;
  content: string;
  source: string;
  publishedAt: Date;
  impact: &apos;positive&apos; | &apos;negative&apos; | &apos;neutral&apos;;
  tags: string[];
}

// Export all types
export * from &apos;./viewTypes&apos;;