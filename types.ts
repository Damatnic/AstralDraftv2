
export type PlayerPosition = &apos;QB&apos; | &apos;RB&apos; | &apos;WR&apos; | &apos;TE&apos; | &apos;K&apos; | &apos;DST&apos;;
export type Persona = &apos;The Analyst&apos; | &apos;The Gambler&apos; | &apos;The Trash Talker&apos; | &apos;The Cagey Veteran&apos; | &apos;The Homer&apos; | &apos;The Enforcer&apos; | &apos;Tom Brady&apos; | &apos;Bill Belichick&apos; | &apos;Jerry Jones&apos;;

export interface Player {
}
  id: number;
  name: string;
  position: PlayerPosition;
  team: string;
  rank: number;
  adp?: number;
  bye: number;
  tier?: number;
  age?: number;
  auctionValue: number;
  projectedPoints?: number;
  fantasyRank?: number;
  jerseyNumber?: number;
  byeWeek?: number;
  consistency?: &apos;high&apos; | &apos;medium&apos; | &apos;low&apos;;
  upside?: &apos;high&apos; | &apos;medium&apos; | &apos;low&apos;;
  injuryStatus?: &apos;healthy&apos; | &apos;questionable&apos; | &apos;doubtful&apos; | &apos;out&apos;;
  injuryHistory?: &apos;minimal&apos; | &apos;moderate&apos; | &apos;extensive&apos;;
  yearsExperience?: number;
  situationChange?: &apos;improved&apos; | &apos;same&apos; | &apos;worse&apos;;
  role?: &apos;starter&apos; | &apos;backup&apos; | &apos;committee&apos;;
  handcuffValue?: &apos;high&apos; | &apos;medium&apos; | &apos;low&apos;;
  scheduleStrength?: {
}
    overall: &apos;easy&apos; | &apos;medium&apos; | &apos;hard&apos;;
    playoff: &apos;easy&apos; | &apos;medium&apos; | &apos;hard&apos;;
  };
  receptions?: number;
  stats: {
}
    projection: number;
    lastYear: number;
    vorp: number; // Value Over Replacement Player
    weeklyProjections: { [week: number]: number };
    // Position-specific stats
    passingYards?: number;
    passingTouchdowns?: number;
    rushingYards?: number;
    rushingTouchdowns?: number;
    receivingYards?: number;
    receptions?: number;
    targetShare?: number;
    redZoneShare?: number;
    snapShare?: number;
    carryShare?: number;
  };
  bio?: string;
  scoutingReport?: {
}
      summary: string;
      strengths: string[];
      weaknesses: string[];
  };
  contract?: {
}
      years: number;
      amount: string;
      guaranteed: string;
  };
  detailedInjuryHistory?: {
}
      date: string;
      injury: string;
      status: &apos;Active&apos; | &apos;Out&apos; | &apos;Questionable&apos;;
  }[];
  newsFeed?: NewsItem[];
  astralIntelligence?: {
}
      pregameRitual: string;
      offseasonHobby: string;
      signatureCelebration: string;
      spiritAnimal: string;
      lastBreakfast: string;
  };
  advancedMetrics?: AdvancedMetrics;
}

export type BadgeType = &apos;CHAMPION&apos; | &apos;TOP_SCORER&apos; | &apos;WIN_STREAK_3&apos;;

export interface Badge {
}
  id: string;
  type: BadgeType;
  text: string;
  season: number;
}

export interface User {
}
  id: string;
  name: string;
  avatar: string;
  email?: string;
  isCommissioner?: boolean;
  persona?: Persona;
  isReady?: boolean;
  bio?: string;
  memberSince?: number;
  badges?: Badge[];
}

export type ChampionshipProbability = {
}
    week: number;
    probability: number;
};

export type DraftPickAsset = {
}
  season: number;
  round: number;
  originalTeamId?: number; // Tracks original owner if traded
};

export interface Team {
}
  id: number;
  name: string;
  owner: User;
  avatar: string;
  roster: Player[];
  budget: number; // for auction
  faab: number; // for waivers
  faabBudget?: number; // alias for faab - backwards compatibility (optional)
  draftGrade?: DraftGrade;
  record: { wins: number; losses: number; ties: number };
  tradeBlock?: number[];
  chemistryReport?: string | null;
  seasonOutlook?: { prediction: string, keyPlayer: string; } | null;
  headerImage?: string;
  teamNeeds?: { position: PlayerPosition, rationale: string }[];
  awards?: { title: string; week: number; }[];
  championshipProbHistory?: ChampionshipProbability[];
  futureDraftPicks: DraftPickAsset[];
  motto?: string;
  themeSongUrl?: string;
  mascotUrl?: string;
  keepers?: number[]; // player IDs
}

export interface DraftGrade {
}
    overall: &apos;A+&apos; | &apos;A&apos; | &apos;A-&apos; | &apos;B+&apos; | &apos;B&apos; | &apos;B-&apos; | &apos;C+&apos; | &apos;C&apos; | &apos;C-&apos; | &apos;D&apos; | &apos;F&apos;;
    value: number; // 0-100
    need: number; // 0-100
    bestPick: Player;
    biggestReach: Player;
    narrative: string;
}

export interface DraftPick {
}
  overall: number;
  round: number;
  pickInRound: number;
  teamId: number;
  playerId?: number;
  price?: number; // For auction
  timestamp?: number;
}

export type RecommendationType = &apos;VALUE&apos; | &apos;UPSCALE&apos; | &apos;POSITIONAL_NEED&apos; | &apos;SAFE_PICK&apos; | &apos;SLEEPER&apos; | &apos;INJURY_RISK&apos; | &apos;HOT_PROSPECT&apos; | &apos;GAMBIT&apos;;

export interface Recommendation {
}
    id: number;
    player: Player;
    type: RecommendationType;
    reason: string;
}

export interface Analytics {
}
    draftEfficiency: number;
    valuePicks: number;
    championshipProbability: number;
    avgPickTime: number;
}

// Multiplayer & League Types
export type DraftFormat = &apos;SNAKE&apos; | &apos;AUCTION&apos;;

export interface ScoringRule {
}
  stat: string;
  points: number;
}

export interface ScoringSettings {
}
  passing: ScoringRule[];
  rushing: ScoringRule[];
  receiving: ScoringRule[];
  misc: ScoringRule[];
}


export interface LeagueSettings {
}
    draftFormat: DraftFormat;
    teamCount: number;
    rosterSize: number;
    scoring: &apos;PPR&apos; | &apos;Standard&apos; | &apos;Half-PPR&apos;;
    tradeDeadline: number; // week number
    playoffFormat: &apos;4_TEAM&apos; | &apos;6_TEAM&apos;;
    waiverRule: &apos;FAAB&apos; | &apos;REVERSE_ORDER&apos;;
    scoringRules?: ScoringSettings;
    keeperCount?: number;
    aiAssistanceLevel: &apos;FULL&apos; | &apos;BASIC&apos;;
}

export interface AuctionState {
}
    nominatingTeamId: number;
    nominatedPlayerId: number | null;
    currentBid: number;
    highBidderId: number | null;
    timer: number;
    lastBidTimestamp: number;
    bidHistory: { teamId: number, bid: number }[];
}

export interface TradeAnalysis {
}
    summary: string;
    winner: &apos;TEAM_A&apos; | &apos;TEAM_B&apos; | &apos;EVEN&apos; | null;
}

export interface TradeOffer {
}
    id: string;
    fromTeamId: number;
    toTeamId: number;
    playersOffered: number[]; // Player IDs
    playersRequested: number[]; // Player IDs
    draftPicksOffered: DraftPickAsset[];
    draftPicksRequested: DraftPickAsset[];
    status: &apos;PENDING&apos; | &apos;ACCEPTED&apos; | &apos;REJECTED&apos; | &apos;VETOED&apos; | &apos;FORCED&apos;;
    createdAt: number;
    tradeAnalysis?: TradeAnalysis | null;
}

export interface WaiverClaim {
}
    id: string;
    teamId: number;
    playerId: number;
    bid: number;
    playerToDropId?: number;
    status: &apos;PENDING&apos; | &apos;PROCESSED&apos;;
}

export interface WaiverWireAdvice {
}
    summary: string;
    suggestedBid: number;
    optimalDropPlayerId?: number;
}

export type WaiverIntelligenceType = &apos;STORY&apos; | &apos;STREAMING&apos; | &apos;BREAKOUT&apos;;

export interface WaiverIntelligence {
}
    type: WaiverIntelligenceType;
    title: string;
    content: string;
    players: string[];
}

export interface StartSitAdvice {
}
    recommendedPlayerId: number;
    summary: string;
}

export interface WeeklyReportData {
}
    title: string;
    summary: string;
    gameOfWeek: {
}
        teamAName: string;
        teamBName: string;
        reason: string;
    };
    playerOfWeek: {
}
        playerName: string;
        teamName: string;
        stats: string;
        reason: string;
    };
    powerPlay?: {
}
        teamName: string;
        move: string;
        rationale: string;
    };
}

export interface SeasonReviewData {
}
    title: string;
    summary: string;
    superlatives: {
}
        title: string;
        teamName: string;
        rationale: string;
    }[];
    finalPowerRanking: {
}
        teamName: string;
        rank: number;
    }[];
}

export type BriefingItemType = &apos;MATCHUP_PREVIEW&apos; | &apos;WAIVER_GEM&apos; | &apos;ROSTER_WARNING&apos; | &apos;PLAYER_SPOTLIGHT&apos; | &apos;TRADE_TIP&apos; | &apos;ON_THE_HOT_SEAT&apos;;

export interface DailyBriefingItem {
}
    type: BriefingItemType;
    title: string;
    summary: string;
    relatedPlayerIds?: number[];
    playerName?: string;
}

export interface MatchupPlayer {
}
    player: Player;
    projectedScore: number;
    actualScore: number;
    isHot?: boolean; // For RedZone alerts
}

export interface MatchupTeam {
}
    teamId: number;
    score: number;
    roster: MatchupPlayer[];
    seed?: number;
}

export interface Matchup {
}
    id: string;
    week: number;
    teamA: MatchupTeam;
    teamB: MatchupTeam;
}

export interface MatchupAnalysis {
}
    winProbability: number;
    keyPlayerMyTeam: string;
    keyPlayerOpponent: string;
}

export interface PowerRanking {
}
    teamId: number;
    rank: number;
    trend: &apos;up&apos; | &apos;down&apos; | &apos;same&apos;;
    justification: string;
}

export interface AiLineupSuggestion {
}
    recommendedStarters: number[]; // player IDs
    reasoning: string;
}

export type LeagueAwardType = &apos;HIGHEST_SCORE&apos; | &apos;BEST_TRADE&apos; | &apos;BEST_RECORD&apos; | &apos;CLOSEST_MATCHUP&apos;;

export interface LeagueAward {
}
    id: string;
    type: LeagueAwardType;
    season: number;
    teamId: number;
    details: string; // e.g., "185.5 points in Week 8"
}

export interface LeagueHistoryEntry {
}
    season: number;
    championTeamId: number;
    records: {
}
        highestScore: { teamId: number; week: number; score: number; playerName: string; };
    };
    finalStandings: { teamId: number; rank: number; record: { wins: number; losses: number; ties: number } }[];
    leagueAwards?: LeagueAward[];
}

export interface AiProfileData {
}
    name: string;
    avatar: string;
    persona: Persona;
}

export interface CreateLeaguePayload {
}
    id: string;
    name: string;
    settings: LeagueSettings;
    status: &apos;PRE_DRAFT&apos;;
    commissionerId: string;
    userTeamName: string;
    userTeamAvatar: string;
    aiProfiles: AiProfileData[];
}

export interface TopRivalry {
}
    teamAId: number;
    teamBId: number;
    narrative: string;
}

export type ActivityType = &apos;TRADE&apos; | &apos;WAIVER&apos; | &apos;DRAFT&apos;;

export interface ActivityItem {
}
  id: string;
  type: ActivityType;
  timestamp: number;
  content: string;
}

export interface LeagueInvitation {
}
    id: string;
    email: string;
    leagueId: string;
    link: string;
    status: &apos;PENDING&apos; | &apos;ACCEPTED&apos;;
}

export interface DirectMessage {
}
    id: string;
    fromUserId: string;
    toUserId: string;
    text: string;
    timestamp: number;
    isRead: boolean;
}

export interface DraftCommentaryItem {
}
  pickNumber: number;
  text: string;
}

export interface Dues {
}
    [teamId: number]: {
}
        amount: number;
        paid: boolean;
    }
}

export interface Payout {
}
    firstPlace: number;
    secondPlace: number;
    thirdPlace: number;
}

export type GamedayEventType = &apos;TOUCHDOWN&apos; | &apos;FIELD_GOAL&apos; | &apos;INTERCEPTION&apos; | &apos;FUMBLE&apos; | &apos;BIG_PLAY&apos; | &apos;REDZONE_ENTRY&apos;;

export interface GamedayEvent {
}
    id: string;
    timestamp: number;
    text: string;
    teamId: number;
    player: Player;
    type: GamedayEventType;
    points: number;
}

export type PlayerAwardType = &apos;MVP&apos; | &apos;DRAFT_GEM&apos; | &apos;WAIVER_HERO&apos; | &apos;BIGGEST_BUST&apos;;

export interface PlayerAward {
}
    id: string;
    awardType: PlayerAwardType;
    playerId: number;
    season: number;
    awardedByTeamId: number;
}

export interface NewspaperArticle {
}
    headline: string;
    content: string;
}

export interface NewspaperContent {
}
    masthead: string;
    leadStory: NewspaperArticle;
    articles: NewspaperArticle[];
}

export interface League {
}
    id: string;
    name: string;
    settings: LeagueSettings;
    members: User[];
    status: &apos;PRE_DRAFT&apos; | &apos;DRAFTING&apos; | &apos;DRAFT_COMPLETE&apos; | &apos;IN_SEASON&apos; | &apos;PLAYOFFS&apos; | &apos;COMPLETE&apos;;
    commissionerId: string;
    draftPicks: DraftPick[];
    teams: Team[];
    draftLog: DraftEvent[];
    chatMessages: ChatMessage[];
    auctionState?: AuctionState | null;
    tradeOffers: TradeOffer[];
    waiverClaims: WaiverClaim[];
    schedule: Matchup[];
    currentWeek: number;
    playoffBracket?: {
}
        [week: number]: Matchup[];
    };
    isMock?: boolean;
    allPlayers: Player[]; // All available players for comparisons
    isPublic?: boolean;
    history?: LeagueHistoryEntry[];
    topRivalry?: TopRivalry | null;
    logoUrl?: string;
    invitations?: LeagueInvitation[];
    draftCommentary: DraftCommentaryItem[];
    dues?: Dues;
    payouts?: Payout;
    sideBets?: SideBet[];
    playerAwards?: PlayerAward[];
}

export type ChatMessage = {
}
    id: string;
    user: User;
    text: string;
    timestamp: number;
    isSystemMessage?: boolean;
    reactions?: { [emoji: string]: string[] }; // emoji: array of user IDs
    mentions?: string[]; // array of user IDs
    tradeEvent?: TradeOffer;
    aiHotTake?: string;
};

export type DraftEventType = &apos;PICK&apos; | &apos;TRADE&apos; | &apos;PAUSE&apos; | &apos;RESUME&apos; | &apos;NOMINATION&apos; | &apos;BID&apos; | &apos;FIRST_PICK&apos; | &apos;QB_RUSH&apos; | &apos;DRAFT_STEAL&apos; | &apos;THE_REACH&apos; | &apos;MR_IRRELEVANT&apos;;

export interface DraftEvent {
}
    id: string;
    type: DraftEventType;
    timestamp: number;
    content: string;
    teamId?: number;
    playerId?: number;
}

export type View = &apos;AUTH&apos; | &apos;DASHBOARD&apos; | &apos;LEAGUE_HUB&apos; | &apos;CREATE_LEAGUE&apos; | &apos;DRAFT_ROOM&apos; | &apos;LIVE_DRAFT_ROOM&apos; | &apos;SEASON_CONTESTS&apos; | &apos;TEAM_HUB&apos; | &apos;ANALYTICS_HUB&apos; | &apos;REALTIME_ANALYTICS&apos; | &apos;HISTORICAL_ANALYTICS&apos; | &apos;LEAGUE_STANDINGS&apos; | &apos;WAIVER_WIRE&apos; | &apos;MATCHUP&apos; | &apos;POWER_RANKINGS&apos; | &apos;PLAYOFF_BRACKET&apos; | &apos;WEEKLY_REPORT&apos; | &apos;LEAGUE_HISTORY&apos; | &apos;SEASON_REVIEW&apos; | &apos;START_SIT_TOOL&apos; | &apos;ASSISTANT&apos; | &apos;PROFILE&apos; | &apos;LEAGUE_RULES&apos; | &apos;COMMISSIONER_TOOLS&apos; | &apos;DRAFT_STORY&apos; | &apos;MANAGER_PROFILE&apos; | &apos;PROJECT_INTEGRITY&apos; | &apos;EDIT_ROSTER&apos; | &apos;DRAFT_PREP_CENTER&apos; | &apos;PERFORMANCE_TRENDS&apos; | &apos;SEASON_STORY&apos; | &apos;TEAM_COMPARISON&apos; | &apos;EDIT_LEAGUE_SETTINGS&apos; | &apos;SEASON_ARCHIVE&apos; | &apos;LEAGUE_STATS&apos; | &apos;SCHEDULE_MANAGEMENT&apos; | &apos;MESSAGES&apos; | &apos;CHAMPIONSHIP_ODDS&apos; | &apos;PROJECTED_STANDINGS&apos; | &apos;TROPHY_ROOM&apos; | &apos;BEAT_THE_ORACLE&apos; | &apos;LEAGUE_CONSTITUTION&apos; | &apos;CUSTOM_SCORING_EDITOR&apos; | &apos;FINANCE_TRACKER&apos; | &apos;WEEKLY_RECAP_VIDEO&apos; | &apos;GAMEDAY_HOST&apos; | &apos;LEAGUE_NEWSPAPER&apos; | &apos;KEEPER_SELECTION&apos; | &apos;OPEN_LEAGUES&apos; | &apos;LEADERBOARD&apos; | &apos;PLAYERS&apos; | &apos;ENHANCED_LEAGUE_STANDINGS&apos; | &apos;TRADES&apos; | &apos;SEASON_MANAGEMENT&apos; | &apos;MOCK_DRAFT&apos;;

export type PlayerNote = {
}
    text: string;
    audio?: string | null;
};

export type NotificationType = &apos;DRAFT&apos; | &apos;TRADE&apos; | &apos;WAIVER&apos; | &apos;SYSTEM&apos; | &apos;INFO&apos; | &apos;SUCCESS&apos; | &apos;ERROR&apos; | &apos;WARNING&apos;;
export interface Notification {
}
    id: number;
    message: string;
    type: NotificationType;
}

export interface DraftRecapData {
}
    title: string;
    summary: string;
    awards: {
}
        awardTitle: string;
        teamName: string;
        playerName: string;
        rationale: string;
    }[];
}

export type WatchlistInsightType = &apos;MATCHUP_GOOD&apos; | &apos;VALUE_INCREASE&apos; | &apos;RISK_ALERT&apos; | &apos;NEWS_POSITIVE&apos;;

export interface WatchlistInsight {
}
  playerId: number;
  insight: string;
  type: WatchlistInsightType;
}

export interface WebGroundingChunk {
}
    uri?: string;
    title?: string;
}

export interface GroundingChunk {
}
    web?: WebGroundingChunk;
}

export type CustomRanking = { [playerId: number]: number };

export interface LeaguePoll {
}
    id: string;
    question: string;
    options: { id: string; text: string; votes: string[] }[];
    createdBy: string; // user ID
    closesAt: number;
}

export interface Announcement {
}
    id: string;
    title: string;
    content: string;
    timestamp: number;
}

export interface PlayerStory {
}
    title: string;
    narrative: string;
}

export interface TradeStory {
}
    title: string;
    narrative: string;
    winnerDeclared: string;
}

export interface SeasonStory {
}
    title: string;
    narrative: string;
}

export interface TeamComparison {
}
    strengthsA: string[];
    weaknessesA: string[];
    strengthsB: string[];
    weaknessesB: string[];
    analysis: string;
    prediction: string;
}

export type IntegrityTaskStatus = &apos;pending&apos; | &apos;passed&apos; | &apos;failed&apos; | &apos;skipped&apos;;

export interface ScanFinding {
}
    severity: &apos;Critical&apos; | &apos;Warning&apos; | &apos;Passed&apos;;
    description: string;
    taskText: string;
    isCritical: boolean;
}

export interface IntegrityTask {
}
  id: number;
  category: string;
  text: string;
  status: IntegrityTaskStatus;
  isCritical?: boolean;
  details?: string;
}

export interface ChampionshipOddsSimulation {
}
    before: { teamId: number; probability: number; }[];
    after: { teamId: number; probability: number; }[];
}

export interface PlayerVolatility {
}
    boom: number; // 0-100
    bust: number; // 0-100
    narrative: string;
}

export interface ProjectedStanding {
}
    teamId: number;
    projectedWins: number;
    projectedLosses: number;
    projectedTies: number;
    narrative: string;
}

export interface AdvancedMetrics {
}
    snapCountPct: number;
    targetSharePct: number;
    redZoneTouches: number;
}

export type UserPrediction = {
}
    [matchupId: string]: number; // teamId of predicted winner
};

export type NewsItem = {
}
    date: string;
    headline: string;
    source: string;
};

export type LiveNewsItem = NewsItem & { id: string };

export interface RecapVideoScene {
}
    type: &apos;TITLE&apos; | &apos;MATCHUP&apos; | &apos;UPSET&apos; | &apos;TOP_PERFORMER&apos; | &apos;OUTRO&apos;;
    title?: string;
    narration: string;
    teamAName?: string;
    teamBName?: string;
    teamAScore?: number;
    teamBScore?: number;
    playerName?: string;
    playerTeam?: string;
    playerScore?: number;
}

export interface SideBet {
}
  id: string;
  proposerId: number;
  accepterId: number;
  terms: string;
  stakes: string;
  status: &apos;PENDING&apos; | &apos;ACCEPTED&apos; | &apos;REJECTED&apos; | &apos;RESOLVED&apos;;
  winnerId?: number;
}

export interface SmartFaabAdvice {
}
    narrative: string;
    aggressiveBid: number;
    valueBid: number;
}

export interface TradeSuggestion {
}
    playersToSend: number[];
    playersToReceive: number[];
    toTeamId: number;
    rationale: string;
}

export interface AppState {
}
    theme: &apos;dark&apos; | &apos;light&apos;;
    isLoading: boolean;
    user: User | null;
    leagues: League[];
    currentView: View;
    activeLeagueId: string | null;
    playerNotes: { [playerId: number]: PlayerNote };
    playerNicknames: { [playerId: number]: string };
    playerVolatility: { [playerId: number]: PlayerVolatility };
    newsImpactAnalyses: { [headline: string]: string };
    weeklyRecapScripts: { [leagueId_week: string]: RecapVideoScene[] };
    leagueNewspapers: { [leagueId_week: string]: NewspaperContent };
    smartFaabAdvice: { [playerId: number]: SmartFaabAdvice };
    gamedayEvents: { [matchupId: string]: GamedayEvent[] };
    teamSlogans: { [teamId: number]: string };
    playerQueues: { [leagueId:string]: number[] }; // array of player IDs
    dashboardLayout: string[];
    notifications: Notification[];
    isDraftPaused: boolean;
    soundEnabled: boolean;
    isAudioUnlocked: boolean;
    isCommandPaletteOpen: boolean;
    activeSeasonReviewYear: number | null;
    activeArchiveSeason: number | null;
    watchlist: number[]; // Array of player IDs
    watchlistInsights: WatchlistInsight[];
    activeManagerId: string | null;
    activePlayerDetail: Player | null;
    activePlayerDetailInitialTab: string;
    notificationPermission: &apos;default&apos; | &apos;granted&apos; | &apos;denied&apos;;
    customRankings: { [leagueId: string]: CustomRanking };
    leaguePolls: { [leagueId: string]: LeaguePoll[] };
    leagueAnnouncements: { [leagueId: string]: Announcement[] };
    teamsToCompare: [number, number] | null;
    isMobileNavOpen: boolean;
    recentCommands: { name: string, view: View }[];
    activityFeed: ActivityItem[];
    directMessages: DirectMessage[];
    userPredictions: { [leagueId: string]: { [week: number]: UserPrediction } };
    oraclePredictions: { [leagueId: string]: { [week: number]: UserPrediction } };
    playerAvatars: { [playerId: number]: string };
    // Accessibility Settings
    reduceMotion: boolean;
    highContrast: boolean;
    textSize: &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos;;
    // Additional state properties
    seasonReviewYear?: number;
    editingMatchups?: boolean;
    weeklyRecapScript?: { [key: string]: any };
}

// Holdout Validation Result Interface
export interface HoldoutResult {
}
    method: string;
    trainSize: number;
    testSize: number;
    validationSize?: number;
    trainScore: number;
    testScore: number;
    validationScore?: number;
    overfit: number;
    generalizationGap: number;
    metrics: {
}
        mae: number;
        rmse: number;
        r2: number;
        mape: number;
        fantasyAccuracy: number;
        rankingCorrelation: number;
    };
}

// Time Series Validation Result Interface
export interface TimeSeriesResult {
}
    method: string;
    totalSplits: number;
    trainSize: number;
    testSize: number;
    windowSize?: number;
    stepSize?: number;
    avgTrainScore: number;
    avgTestScore: number;
    scoreStability: number;
    temporalConsistency: number;
    splits: Array<{
}
        splitIndex: number;
        trainPeriod: string;
        testPeriod: string;
        trainScore: number;
        testScore: number;
        dataLeakage: boolean;
    }>;
    metrics: {
}
        mae: number;
        rmse: number;
        r2: number;
        mape: number;
        fantasyAccuracy: number;
        rankingCorrelation: number;
        temporalStability: number;
        seasonConsistency: number;
    };
}

// Bootstrap Resampling Result Interface
export interface BootstrapResult {
}
    method: string;
    nBootstraps: number;
    sampleSize: number;
    blockSize?: number;
    replacementRatio: number;
    avgScore: number;
    bootstrapScores: number[];
    confidenceInterval: {
}
        lower: number;
        upper: number;
        level: number;
    };
    statistics: {
}
        mean: number;
        std: number;
        variance: number;
        skewness: number;
        kurtosis: number;
        median: number;
        q25: number;
        q75: number;
    };
    metrics: {
}
        mae: number;
        rmse: number;
        r2: number;
        mape: number;
        fantasyAccuracy: number;
        stabilityIndex: number;
        diversityScore: number;
        robustnessMetric: number;
    };
    convergence: {
}
        converged: boolean;
        requiredSamples: number;
        stabilityThreshold: number;
        finalVariance: number;
    };
}

// Calibration Techniques Result Interface
export interface CalibrationResult {
}
    method: string;
    methodType: &apos;parametric&apos; | &apos;non_parametric&apos; | &apos;bayesian&apos; | &apos;neural&apos;;
    calibrationType: &apos;platt&apos; | &apos;isotonic&apos; | &apos;bayesian&apos; | &apos;temperature&apos;;
    originalBrierScore: number;
    calibratedBrierScore: number;
    brierImprovement: number;
    reliabilityDiagram: {
}
        binEdges: number[];
        binMeans: number[];
        binCounts: number[];
        expectedCalibrationError: number;
        maximumCalibrationError: number;
    };
    calibrationMetrics: {
}
        brierScore: number;
        logLoss: number;
        calibrationError: number;
        reliability: number;
        resolution: number;
        uncertainty: number;
    };
    parameters: {
}
        [key: string]: number | string | boolean;
    };
    predictions: {
}
        original: number[];
        calibrated: number[];
        actualOutcomes: number[];
    };
    performanceMetrics: {
}
        accuracy: number;
        precision: number;
        recall: number;
        f1Score: number;
        auc: number;
        fantasyAccuracy: number;
    };
    calibrationCurve: {
}
        meanPredicted: number[];
        fractionPositives: number[];
        binCounts: number[];
    };
}
