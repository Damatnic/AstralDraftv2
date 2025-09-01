/**
 * Formatting and Display Types
 * Types for consistent data formatting and display across the application
 */

// ==================== BASE FORMATTING TYPES ====================

export interface FormatOptions {
  locale?: string;
  timezone?: string;
  currency?: string;

export interface DisplayConfig {
  theme?: 'light' | 'dark';
  compactMode?: boolean;
  highContrast?: boolean;
  fontSize?: 'sm' | 'md' | 'lg' | 'xl';

// ==================== NUMBER FORMATTING ====================

export interface NumberFormatOptions extends FormatOptions {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  notation?: 'standard' | 'scientific' | 'engineering' | 'compact';
  compactDisplay?: 'short' | 'long';
  useGrouping?: boolean;
  signDisplay?: 'auto' | 'never' | 'always' | 'exceptZero';

export interface CurrencyFormatOptions extends NumberFormatOptions {
  currency: string;
  currencyDisplay?: 'symbol' | 'narrowSymbol' | 'code' | 'name';

export interface PercentageFormatOptions extends NumberFormatOptions {
  style: 'percent';
  minimumFractionDigits?: 1;
  maximumFractionDigits?: 1;

export interface ScoreFormatOptions extends NumberFormatOptions {
  precision?: number;
  showSign?: boolean;
  abbreviate?: boolean;
  color?: boolean;

export interface RankFormatOptions {
  suffix?: boolean; // Show "1st", "2nd", etc.
  showTies?: boolean;
  highlightUser?: boolean;

// ==================== DATE FORMATTING ====================

export interface DateFormatOptions extends FormatOptions {
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  timeStyle?: 'full' | 'long' | 'medium' | 'short';
  weekday?: 'narrow' | 'short' | 'long';
  era?: 'narrow' | 'short' | 'long';
  year?: 'numeric' | '2-digit';
  month?: 'numeric' | '2-digit' | 'narrow' | 'short' | 'long';
  day?: 'numeric' | '2-digit';
  hour?: 'numeric' | '2-digit';
  minute?: 'numeric' | '2-digit';
  second?: 'numeric' | '2-digit';
  timeZoneName?: 'short' | 'long' | 'shortOffset' | 'longOffset' | 'shortGeneric' | 'longGeneric';
  hour12?: boolean;

export interface RelativeDateFormatOptions extends FormatOptions {
  style?: 'long' | 'short' | 'narrow';
  numeric?: 'always' | 'auto';

export interface TimeAgoFormatOptions {
  addSuffix?: boolean;
  includeSeconds?: boolean;

export interface GameTimeFormatOptions extends DateFormatOptions {
  showCountdown?: boolean;
  showTimeZone?: boolean;
  format?: 'full' | 'date-only' | 'time-only' | 'relative';

// ==================== TEXT FORMATTING ====================

export interface TextFormatOptions {
  truncate?: {
    maxLength: number;
    ellipsis?: string;
    wordBreak?: boolean;
  };
  case?: 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'pascal' | 'kebab' | 'snake';
  highlight?: {
    query: string;
    className?: string;
    caseSensitive?: boolean;
  };
  linkify?: {
    className?: string;
    target?: string;
    truncate?: number;
  };

export interface PlayerNameFormatOptions extends TextFormatOptions {
  format?: 'full' | 'first-last' | 'last-first' | 'first-initial' | 'initials';
  showPosition?: boolean;
  showTeam?: boolean;

export interface TeamNameFormatOptions extends TextFormatOptions {
  format?: 'full' | 'city' | 'mascot' | 'abbreviation';
  showLogo?: boolean;
  showRecord?: boolean;

// ==================== PLAYER STAT FORMATTING ====================

export interface StatFormatOptions extends NumberFormatOptions {
  category?: 'passing' | 'rushing' | 'receiving' | 'kicking' | 'defense';
  showLabel?: boolean;
  showProjected?: boolean;
  compareToAverage?: boolean;
  colorCode?: boolean;
  abbreviate?: boolean;

export interface ProjectionFormatOptions extends StatFormatOptions {
  showRange?: boolean;
  confidence?: boolean;
  comparison?: 'none' | 'ranking' | 'tier' | 'average';

export interface FantasyPointsFormatOptions extends ScoreFormatOptions {
  showBreakdown?: boolean;
  showProjection?: boolean;
  showDifference?: boolean;
  highlightBest?: boolean;

// ==================== RECORD AND STANDINGS FORMATTING ====================

export interface RecordFormatOptions {
  format?: 'wins-losses' | 'wins-losses-ties' | 'percentage' | 'games-back';
  showPercentage?: boolean;
  precision?: number;

export interface StandingsFormatOptions {
  showRank?: boolean;
  showDivision?: boolean;
  showWildCard?: boolean;
  showPlayoffIndicator?: boolean;
  highlightUser?: boolean;
  showTiebreakers?: boolean;

// ==================== DRAFT FORMATTING ====================

export interface DraftPickFormatOptions {
  showRound?: boolean;
  showOverall?: boolean;
  showTime?: boolean;
  showGrade?: boolean;
  showValue?: boolean;
  format?: 'compact' | 'detailed';

export interface AuctionValueFormatOptions extends CurrencyFormatOptions {
  showBudgetRemaining?: boolean;
  showValueVsProjection?: boolean;
  highlightDeals?: boolean;
  currency: 'USD'; // Fantasy dollars

export interface DraftGradeFormatOptions {
  showLetter?: boolean;
  showNumeric?: boolean;
  showColor?: boolean;
  showBreakdown?: boolean;

// ==================== TRADE FORMATTING ====================

export interface TradeFormatOptions {
  format?: 'compact' | 'detailed' | 'summary';
  showAnalysis?: boolean;
  showValue?: boolean;
  showFairness?: boolean;
  highlightWinner?: boolean;

export interface TradeAnalysisFormatOptions {
  showScores?: boolean;
  showRecommendation?: boolean;
  showReasoning?: boolean;
  colorCode?: boolean;

// ==================== WAIVER FORMATTING ====================

export interface WaiverFormatOptions {
  showPriority?: boolean;
  showBid?: boolean;
  showAdvice?: boolean;
  format?: 'compact' | 'detailed';

export interface FAABFormatOptions extends CurrencyFormatOptions {
  showRemaining?: boolean;
  showRecommended?: boolean;
  highlightHighBids?: boolean;

// ==================== MATCHUP FORMATTING ====================

export interface MatchupFormatOptions {
  format?: 'scoreboard' | 'detailed' | 'preview' | 'recap';
  showProjections?: boolean;
  showLive?: boolean;
  showWinProbability?: boolean;
  showKey?: string; // Key matchup position

export interface ScoreboardFormatOptions extends ScoreFormatOptions {
  showQuarter?: boolean;
  showTimeRemaining?: boolean;
  showProjected?: boolean;
  showLiveUpdates?: boolean;
  animate?: boolean;

// ==================== CHART AND GRAPH FORMATTING ====================

export interface ChartFormatOptions {
  theme?: 'light' | 'dark';
  colorScheme?: string[];
  responsive?: boolean;
  animation?: boolean;
  tooltip?: {
    enabled: boolean;
    format?: string;
  };
  legend?: {
    position: 'top' | 'bottom' | 'left' | 'right';
    format?: 'compact' | 'detailed';
  };

export interface TrendFormatOptions extends ChartFormatOptions {
  timeframe?: 'week' | 'month' | 'season' | 'career';
  showAverage?: boolean;
  showGoal?: boolean;
  highlightPeaks?: boolean;

// ==================== NOTIFICATION FORMATTING ====================

export interface NotificationFormatOptions extends TextFormatOptions {
  format?: 'toast' | 'banner' | 'inline' | 'modal';
  showIcon?: boolean;
  showActions?: boolean;
  autoDisappear?: {
    enabled: boolean;
    delay: number;
  };
  sound?: {
    enabled: boolean;
    type: string;
  };

// ==================== LIST AND TABLE FORMATTING ====================

export interface ListFormatOptions {
  format?: 'simple' | 'detailed' | 'card' | 'table';
  showImages?: boolean;
  showMetadata?: boolean;
  groupBy?: string;
  sortBy?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  pagination?: {
    enabled: boolean;
    pageSize: number;
  };

export interface TableFormatOptions extends ListFormatOptions {
  columns?: Array<{
    key: string;
    label: string;
    width?: number;
    sortable?: boolean;
    format?: any;
  }>;
  striped?: boolean;
  bordered?: boolean;
  hover?: boolean;
  responsive?: boolean;
  stickyHeader?: boolean;

// ==================== RESPONSIVE FORMATTING ====================

export interface ResponsiveFormatOptions {
  mobile?: any;
  tablet?: any;
  desktop?: any;
  breakpoints?: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };

// ==================== ACCESSIBILITY FORMATTING ====================

export interface AccessibilityFormatOptions {
  screenReader?: {
    enabled: boolean;
    verbose?: boolean;
  };
  highContrast?: boolean;
  largeText?: boolean;
  reducedMotion?: boolean;
  focusVisible?: boolean;
  ariaLabels?: Record<string, string>;

// ==================== THEME-AWARE FORMATTING ====================

export interface ThemeAwareFormatOptions {
  light: any;
  dark: any;
  auto?: boolean;
  system?: boolean;

// ==================== LOCALIZATION FORMATTING ====================

export interface LocalizationFormatOptions extends FormatOptions {
  rtl?: boolean;
  numberSystem?: 'arab' | 'arabext' | 'bali' | 'beng' | 'deva' | 'fullwide' | 'gujr' | 'guru' | 'hanidec' | 'khmr' | 'knda' | 'laoo' | 'latn' | 'limb' | 'mlym' | 'mong' | 'mymr' | 'orya' | 'tamldec' | 'telu' | 'thai' | 'tibt';
  calendar?: 'buddhist' | 'chinese' | 'coptic' | 'ethioaa' | 'ethiopic' | 'gregory' | 'hebrew' | 'indian' | 'islamic' | 'islamicc' | 'iso8601' | 'japanese' | 'persian' | 'roc';

// ==================== COMBINED FORMAT CONFIGURATIONS ====================

export interface PlayerDisplayConfig extends DisplayConfig {
  name: PlayerNameFormatOptions;
  stats: StatFormatOptions;
  projections: ProjectionFormatOptions;
  fantasyPoints: FantasyPointsFormatOptions;
  rank: RankFormatOptions;

export interface TeamDisplayConfig extends DisplayConfig {
  name: TeamNameFormatOptions;
  record: RecordFormatOptions;
  standings: StandingsFormatOptions;

export interface LeagueDisplayConfig extends DisplayConfig {
  matchups: MatchupFormatOptions;
  scoreboard: ScoreboardFormatOptions;
  trades: TradeFormatOptions;
  waivers: WaiverFormatOptions;
  draft: DraftPickFormatOptions;

export interface DashboardDisplayConfig extends DisplayConfig {
  charts: ChartFormatOptions;
  tables: TableFormatOptions;
  notifications: NotificationFormatOptions;
  responsive: ResponsiveFormatOptions;

// ==================== FORMAT HELPER TYPES ====================

export interface FormattedValue<T = any> {
  raw: T;
  formatted: string;
  metadata?: {
    format: string;
    options: any;
    timestamp: Date;
  };

export interface FormatFunction<T = any, O = any> {
  (value: T, options?: O): FormattedValue<T>;

export interface FormatRegistry {
  [key: string]: FormatFunction;

// ==================== EXPORT ALL ====================

export type {
  FormatOptions,
  DisplayConfig,
  NumberFormatOptions,
  CurrencyFormatOptions,
  PercentageFormatOptions,
  ScoreFormatOptions,
  RankFormatOptions,
  DateFormatOptions,
  RelativeDateFormatOptions,
  TimeAgoFormatOptions,
  GameTimeFormatOptions,
  TextFormatOptions,
  PlayerNameFormatOptions,
  TeamNameFormatOptions,
  StatFormatOptions,
  ProjectionFormatOptions,
  FantasyPointsFormatOptions,
  RecordFormatOptions,
  StandingsFormatOptions,
  DraftPickFormatOptions,
  AuctionValueFormatOptions,
  DraftGradeFormatOptions,
  TradeFormatOptions,
  TradeAnalysisFormatOptions,
  WaiverFormatOptions,
  FAABFormatOptions,
  MatchupFormatOptions,
  ScoreboardFormatOptions,
  ChartFormatOptions,
  TrendFormatOptions,
  NotificationFormatOptions,
  ListFormatOptions,
  TableFormatOptions,
  ResponsiveFormatOptions,
  AccessibilityFormatOptions,
  ThemeAwareFormatOptions,
  LocalizationFormatOptions,
  PlayerDisplayConfig,
  TeamDisplayConfig,
  LeagueDisplayConfig,
  DashboardDisplayConfig,
  FormattedValue,
  FormatFunction,
  FormatRegistry,
};