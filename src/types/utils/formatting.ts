/**
 * Formatting and Display Types
 * Types for consistent data formatting and display across the application
 */

// ==================== BASE FORMATTING TYPES ====================

export interface FormatOptions {
}
  locale?: string;
  timezone?: string;
  currency?: string;
}

export interface DisplayConfig {
}
  theme?: &apos;light&apos; | &apos;dark&apos;;
  compactMode?: boolean;
  highContrast?: boolean;
  fontSize?: &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos; | &apos;xl&apos;;
}

// ==================== NUMBER FORMATTING ====================

export interface NumberFormatOptions extends FormatOptions {
}
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  notation?: &apos;standard&apos; | &apos;scientific&apos; | &apos;engineering&apos; | &apos;compact&apos;;
  compactDisplay?: &apos;short&apos; | &apos;long&apos;;
  useGrouping?: boolean;
  signDisplay?: &apos;auto&apos; | &apos;never&apos; | &apos;always&apos; | &apos;exceptZero&apos;;
}

export interface CurrencyFormatOptions extends NumberFormatOptions {
}
  currency: string;
  currencyDisplay?: &apos;symbol&apos; | &apos;narrowSymbol&apos; | &apos;code&apos; | &apos;name&apos;;
}

export interface PercentageFormatOptions extends NumberFormatOptions {
}
  style: &apos;percent&apos;;
  minimumFractionDigits?: 1;
  maximumFractionDigits?: 1;
}

export interface ScoreFormatOptions extends NumberFormatOptions {
}
  precision?: number;
  showSign?: boolean;
  abbreviate?: boolean;
  color?: boolean;
}

export interface RankFormatOptions {
}
  suffix?: boolean; // Show "1st", "2nd", etc.
  showTies?: boolean;
  highlightUser?: boolean;
}

// ==================== DATE FORMATTING ====================

export interface DateFormatOptions extends FormatOptions {
}
  dateStyle?: &apos;full&apos; | &apos;long&apos; | &apos;medium&apos; | &apos;short&apos;;
  timeStyle?: &apos;full&apos; | &apos;long&apos; | &apos;medium&apos; | &apos;short&apos;;
  weekday?: &apos;narrow&apos; | &apos;short&apos; | &apos;long&apos;;
  era?: &apos;narrow&apos; | &apos;short&apos; | &apos;long&apos;;
  year?: &apos;numeric&apos; | &apos;2-digit&apos;;
  month?: &apos;numeric&apos; | &apos;2-digit&apos; | &apos;narrow&apos; | &apos;short&apos; | &apos;long&apos;;
  day?: &apos;numeric&apos; | &apos;2-digit&apos;;
  hour?: &apos;numeric&apos; | &apos;2-digit&apos;;
  minute?: &apos;numeric&apos; | &apos;2-digit&apos;;
  second?: &apos;numeric&apos; | &apos;2-digit&apos;;
  timeZoneName?: &apos;short&apos; | &apos;long&apos; | &apos;shortOffset&apos; | &apos;longOffset&apos; | &apos;shortGeneric&apos; | &apos;longGeneric&apos;;
  hour12?: boolean;
}

export interface RelativeDateFormatOptions extends FormatOptions {
}
  style?: &apos;long&apos; | &apos;short&apos; | &apos;narrow&apos;;
  numeric?: &apos;always&apos; | &apos;auto&apos;;
}

export interface TimeAgoFormatOptions {
}
  addSuffix?: boolean;
  includeSeconds?: boolean;
}

export interface GameTimeFormatOptions extends DateFormatOptions {
}
  showCountdown?: boolean;
  showTimeZone?: boolean;
  format?: &apos;full&apos; | &apos;date-only&apos; | &apos;time-only&apos; | &apos;relative&apos;;
}

// ==================== TEXT FORMATTING ====================

export interface TextFormatOptions {
}
  truncate?: {
}
    maxLength: number;
    ellipsis?: string;
    wordBreak?: boolean;
  };
  case?: &apos;upper&apos; | &apos;lower&apos; | &apos;title&apos; | &apos;sentence&apos; | &apos;camel&apos; | &apos;pascal&apos; | &apos;kebab&apos; | &apos;snake&apos;;
  highlight?: {
}
    query: string;
    className?: string;
    caseSensitive?: boolean;
  };
  linkify?: {
}
    className?: string;
    target?: string;
    truncate?: number;
  };
}

export interface PlayerNameFormatOptions extends TextFormatOptions {
}
  format?: &apos;full&apos; | &apos;first-last&apos; | &apos;last-first&apos; | &apos;first-initial&apos; | &apos;initials&apos;;
  showPosition?: boolean;
  showTeam?: boolean;
}

export interface TeamNameFormatOptions extends TextFormatOptions {
}
  format?: &apos;full&apos; | &apos;city&apos; | &apos;mascot&apos; | &apos;abbreviation&apos;;
  showLogo?: boolean;
  showRecord?: boolean;
}

// ==================== PLAYER STAT FORMATTING ====================

export interface StatFormatOptions extends NumberFormatOptions {
}
  category?: &apos;passing&apos; | &apos;rushing&apos; | &apos;receiving&apos; | &apos;kicking&apos; | &apos;defense&apos;;
  showLabel?: boolean;
  showProjected?: boolean;
  compareToAverage?: boolean;
  colorCode?: boolean;
  abbreviate?: boolean;
}

export interface ProjectionFormatOptions extends StatFormatOptions {
}
  showRange?: boolean;
  confidence?: boolean;
  comparison?: &apos;none&apos; | &apos;ranking&apos; | &apos;tier&apos; | &apos;average&apos;;
}

export interface FantasyPointsFormatOptions extends ScoreFormatOptions {
}
  showBreakdown?: boolean;
  showProjection?: boolean;
  showDifference?: boolean;
  highlightBest?: boolean;
}

// ==================== RECORD AND STANDINGS FORMATTING ====================

export interface RecordFormatOptions {
}
  format?: &apos;wins-losses&apos; | &apos;wins-losses-ties&apos; | &apos;percentage&apos; | &apos;games-back&apos;;
  showPercentage?: boolean;
  precision?: number;
}

export interface StandingsFormatOptions {
}
  showRank?: boolean;
  showDivision?: boolean;
  showWildCard?: boolean;
  showPlayoffIndicator?: boolean;
  highlightUser?: boolean;
  showTiebreakers?: boolean;
}

// ==================== DRAFT FORMATTING ====================

export interface DraftPickFormatOptions {
}
  showRound?: boolean;
  showOverall?: boolean;
  showTime?: boolean;
  showGrade?: boolean;
  showValue?: boolean;
  format?: &apos;compact&apos; | &apos;detailed&apos;;
}

export interface AuctionValueFormatOptions extends CurrencyFormatOptions {
}
  showBudgetRemaining?: boolean;
  showValueVsProjection?: boolean;
  highlightDeals?: boolean;
  currency: &apos;USD&apos;; // Fantasy dollars
}

export interface DraftGradeFormatOptions {
}
  showLetter?: boolean;
  showNumeric?: boolean;
  showColor?: boolean;
  showBreakdown?: boolean;
}

// ==================== TRADE FORMATTING ====================

export interface TradeFormatOptions {
}
  format?: &apos;compact&apos; | &apos;detailed&apos; | &apos;summary&apos;;
  showAnalysis?: boolean;
  showValue?: boolean;
  showFairness?: boolean;
  highlightWinner?: boolean;
}

export interface TradeAnalysisFormatOptions {
}
  showScores?: boolean;
  showRecommendation?: boolean;
  showReasoning?: boolean;
  colorCode?: boolean;
}

// ==================== WAIVER FORMATTING ====================

export interface WaiverFormatOptions {
}
  showPriority?: boolean;
  showBid?: boolean;
  showAdvice?: boolean;
  format?: &apos;compact&apos; | &apos;detailed&apos;;
}

export interface FAABFormatOptions extends CurrencyFormatOptions {
}
  showRemaining?: boolean;
  showRecommended?: boolean;
  highlightHighBids?: boolean;
}

// ==================== MATCHUP FORMATTING ====================

export interface MatchupFormatOptions {
}
  format?: &apos;scoreboard&apos; | &apos;detailed&apos; | &apos;preview&apos; | &apos;recap&apos;;
  showProjections?: boolean;
  showLive?: boolean;
  showWinProbability?: boolean;
  showKey?: string; // Key matchup position
}

export interface ScoreboardFormatOptions extends ScoreFormatOptions {
}
  showQuarter?: boolean;
  showTimeRemaining?: boolean;
  showProjected?: boolean;
  showLiveUpdates?: boolean;
  animate?: boolean;
}

// ==================== CHART AND GRAPH FORMATTING ====================

export interface ChartFormatOptions {
}
  theme?: &apos;light&apos; | &apos;dark&apos;;
  colorScheme?: string[];
  responsive?: boolean;
  animation?: boolean;
  tooltip?: {
}
    enabled: boolean;
    format?: string;
  };
  legend?: {
}
    position: &apos;top&apos; | &apos;bottom&apos; | &apos;left&apos; | &apos;right&apos;;
    format?: &apos;compact&apos; | &apos;detailed&apos;;
  };
}

export interface TrendFormatOptions extends ChartFormatOptions {
}
  timeframe?: &apos;week&apos; | &apos;month&apos; | &apos;season&apos; | &apos;career&apos;;
  showAverage?: boolean;
  showGoal?: boolean;
  highlightPeaks?: boolean;
}

// ==================== NOTIFICATION FORMATTING ====================

export interface NotificationFormatOptions extends TextFormatOptions {
}
  format?: &apos;toast&apos; | &apos;banner&apos; | &apos;inline&apos; | &apos;modal&apos;;
  showIcon?: boolean;
  showActions?: boolean;
  autoDisappear?: {
}
    enabled: boolean;
    delay: number;
  };
  sound?: {
}
    enabled: boolean;
    type: string;
  };
}

// ==================== LIST AND TABLE FORMATTING ====================

export interface ListFormatOptions {
}
  format?: &apos;simple&apos; | &apos;detailed&apos; | &apos;card&apos; | &apos;table&apos;;
  showImages?: boolean;
  showMetadata?: boolean;
  groupBy?: string;
  sortBy?: {
}
    field: string;
    direction: &apos;asc&apos; | &apos;desc&apos;;
  };
  pagination?: {
}
    enabled: boolean;
    pageSize: number;
  };
}

export interface TableFormatOptions extends ListFormatOptions {
}
  columns?: Array<{
}
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
}

// ==================== RESPONSIVE FORMATTING ====================

export interface ResponsiveFormatOptions {
}
  mobile?: any;
  tablet?: any;
  desktop?: any;
  breakpoints?: {
}
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

// ==================== ACCESSIBILITY FORMATTING ====================

export interface AccessibilityFormatOptions {
}
  screenReader?: {
}
    enabled: boolean;
    verbose?: boolean;
  };
  highContrast?: boolean;
  largeText?: boolean;
  reducedMotion?: boolean;
  focusVisible?: boolean;
  ariaLabels?: Record<string, string>;
}

// ==================== THEME-AWARE FORMATTING ====================

export interface ThemeAwareFormatOptions {
}
  light: any;
  dark: any;
  auto?: boolean;
  system?: boolean;
}

// ==================== LOCALIZATION FORMATTING ====================

export interface LocalizationFormatOptions extends FormatOptions {
}
  rtl?: boolean;
  numberSystem?: &apos;arab&apos; | &apos;arabext&apos; | &apos;bali&apos; | &apos;beng&apos; | &apos;deva&apos; | &apos;fullwide&apos; | &apos;gujr&apos; | &apos;guru&apos; | &apos;hanidec&apos; | &apos;khmr&apos; | &apos;knda&apos; | &apos;laoo&apos; | &apos;latn&apos; | &apos;limb&apos; | &apos;mlym&apos; | &apos;mong&apos; | &apos;mymr&apos; | &apos;orya&apos; | &apos;tamldec&apos; | &apos;telu&apos; | &apos;thai&apos; | &apos;tibt&apos;;
  calendar?: &apos;buddhist&apos; | &apos;chinese&apos; | &apos;coptic&apos; | &apos;ethioaa&apos; | &apos;ethiopic&apos; | &apos;gregory&apos; | &apos;hebrew&apos; | &apos;indian&apos; | &apos;islamic&apos; | &apos;islamicc&apos; | &apos;iso8601&apos; | &apos;japanese&apos; | &apos;persian&apos; | &apos;roc&apos;;
}

// ==================== COMBINED FORMAT CONFIGURATIONS ====================

export interface PlayerDisplayConfig extends DisplayConfig {
}
  name: PlayerNameFormatOptions;
  stats: StatFormatOptions;
  projections: ProjectionFormatOptions;
  fantasyPoints: FantasyPointsFormatOptions;
  rank: RankFormatOptions;
}

export interface TeamDisplayConfig extends DisplayConfig {
}
  name: TeamNameFormatOptions;
  record: RecordFormatOptions;
  standings: StandingsFormatOptions;
}

export interface LeagueDisplayConfig extends DisplayConfig {
}
  matchups: MatchupFormatOptions;
  scoreboard: ScoreboardFormatOptions;
  trades: TradeFormatOptions;
  waivers: WaiverFormatOptions;
  draft: DraftPickFormatOptions;
}

export interface DashboardDisplayConfig extends DisplayConfig {
}
  charts: ChartFormatOptions;
  tables: TableFormatOptions;
  notifications: NotificationFormatOptions;
  responsive: ResponsiveFormatOptions;
}

// ==================== FORMAT HELPER TYPES ====================

export interface FormattedValue<T = any> {
}
  raw: T;
  formatted: string;
  metadata?: {
}
    format: string;
    options: any;
    timestamp: Date;
  };
}

export interface FormatFunction<T = any, O = any> {
}
  (value: T, options?: O): FormattedValue<T>;
}

export interface FormatRegistry {
}
  [key: string]: FormatFunction;
}

// ==================== EXPORT ALL ====================

export type {
}
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