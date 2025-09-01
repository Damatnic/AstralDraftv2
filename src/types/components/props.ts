/**
 * React Component Prop Types
 * Comprehensive prop interfaces for all React components
 */

import { Player } from &apos;../models/player&apos;;
import { User } from &apos;../models/user&apos;;
import { League, Team, Matchup } from &apos;../models/league&apos;;
import { DraftState, DraftPick } from &apos;../models/draft&apos;;

// ==================== BASE COMPONENT PROPS ====================

export interface BaseComponentProps {
}
  className?: string;
  children?: React.ReactNode;
  testId?: string;
  &apos;data-testid&apos;?: string;
  id?: string;
  style?: React.CSSProperties;
}

export interface InteractiveProps extends BaseComponentProps {
}
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  tabIndex?: number;
  role?: string;
  &apos;aria-label&apos;?: string;
  &apos;aria-describedby&apos;?: string;
  &apos;aria-expanded&apos;?: boolean;
  &apos;aria-controls&apos;?: string;
}

// ==================== MODAL PROPS ====================

export interface BaseModalProps extends BaseComponentProps {
}
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  size?: &apos;xs&apos; | &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos; | &apos;xl&apos; | &apos;full&apos;;
  position?: &apos;center&apos; | &apos;top&apos; | &apos;bottom&apos;;
  animation?: &apos;fade&apos; | &apos;slide&apos; | &apos;scale&apos; | &apos;none&apos;;
}

export interface ConfirmModalProps extends BaseModalProps {
}
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: &apos;danger&apos; | &apos;warning&apos; | &apos;info&apos; | &apos;success&apos;;
  onConfirm: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export interface PlayerDetailModalProps extends BaseModalProps {
}
  player: Player;
  showComparison?: boolean;
  showTrade?: boolean;
  canAddToWatchlist?: boolean;
  onPlayerAction?: (action: string, playerId: string) => void;
}

// ==================== FORM PROPS ====================

export interface FormFieldProps extends BaseComponentProps {
}
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  autoComplete?: string;
  autoFocus?: boolean;
}

export interface InputProps extends FormFieldProps {
}
  type?: &apos;text&apos; | &apos;email&apos; | &apos;password&apos; | &apos;number&apos; | &apos;tel&apos; | &apos;url&apos; | &apos;search&apos;;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  maxLength?: number;
  minLength?: number;
  size?: &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos;;
  variant?: &apos;default&apos; | &apos;filled&apos; | &apos;outlined&apos;;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export interface SelectProps<T = any> extends FormFieldProps {
}
  value: T;
  onChange: (value: T) => void;
  options: Array<{
}
    value: T;
    label: string;
    disabled?: boolean;
    group?: string;
  }>;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  loading?: boolean;
  size?: &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos;;
  variant?: &apos;default&apos; | &apos;filled&apos; | &apos;outlined&apos;;
}

export interface TextAreaProps extends FormFieldProps {
}
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  cols?: number;
  resize?: &apos;none&apos; | &apos;both&apos; | &apos;horizontal&apos; | &apos;vertical&apos;;
  maxLength?: number;
  minLength?: number;
}

export interface CheckboxProps extends FormFieldProps {
}
  checked: boolean;
  onChange: (checked: boolean) => void;
  indeterminate?: boolean;
  size?: &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos;;
  variant?: &apos;default&apos; | &apos;switch&apos;;
}

// ==================== BUTTON PROPS ====================

export interface ButtonProps extends InteractiveProps {
}
  variant?: &apos;primary&apos; | &apos;secondary&apos; | &apos;outline&apos; | &apos;ghost&apos; | &apos;danger&apos; | &apos;success&apos; | &apos;warning&apos;;
  size?: &apos;xs&apos; | &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos; | &apos;xl&apos;;
  type?: &apos;button&apos; | &apos;submit&apos; | &apos;reset&apos;;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconOnly?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  download?: boolean;
}

export interface IconButtonProps extends Omit<ButtonProps, &apos;leftIcon&apos; | &apos;rightIcon&apos; | &apos;iconOnly&apos;> {
}
  icon: React.ReactNode;
  &apos;aria-label&apos;: string;
  tooltip?: string;
}

// ==================== PLAYER COMPONENT PROPS ====================

export interface PlayerCardProps extends BaseComponentProps {
}
  player: Player;
  variant?: &apos;compact&apos; | &apos;default&apos; | &apos;detailed&apos;;
  showActions?: boolean;
  showStats?: boolean;
  showProjections?: boolean;
  showRanking?: boolean;
  isOwned?: boolean;
  ownedBy?: string;
  onClick?: (player: Player) => void;
  onAdd?: (player: Player) => void;
  onRemove?: (player: Player) => void;
  onTrade?: (player: Player) => void;
  actionDisabled?: boolean;
  highlight?: boolean;
  isDraftable?: boolean;
}

export interface PlayerListProps extends BaseComponentProps {
}
  players: Player[];
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  variant?: &apos;table&apos; | &apos;grid&apos; | &apos;list&apos;;
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  selectable?: boolean;
  selectedPlayers?: string[];
  onPlayerSelect?: (playerId: string, selected: boolean) => void;
  onPlayerClick?: (player: Player) => void;
  onSort?: (field: string, direction: &apos;asc&apos; | &apos;desc&apos;) => void;
  itemsPerPage?: number;
  showPagination?: boolean;
}

export interface PlayerSearchProps extends BaseComponentProps {
}
  onSearch: (query: string) => void;
  onFilter: (filters: any) => void;
  placeholder?: string;
  filters?: {
}
    positions?: string[];
    teams?: string[];
    availability?: string[];
  };
  showFilters?: boolean;
  debounceMs?: number;
  loading?: boolean;
}

export interface PlayerComparisonProps extends BaseComponentProps {
}
  players: Player[];
  categories?: string[];
  onRemovePlayer?: (playerId: string) => void;
  onAddPlayer?: () => void;
  maxPlayers?: number;
}

// ==================== DRAFT COMPONENT PROPS ====================

export interface DraftBoardProps extends BaseComponentProps {
}
  draftState: DraftState;
  availablePlayers: Player[];
  myTeam: Team;
  onMakePick: (playerId: string) => void;
  onUpdateQueue: (playerIds: string[]) => void;
  canMakePick: boolean;
  recommendations?: any[];
  loading?: boolean;
}

export interface DraftPickProps extends BaseComponentProps {
}
  pick: DraftPick;
  team?: Team;
  player?: Player;
  isCurrent?: boolean;
  isMyPick?: boolean;
  variant?: &apos;compact&apos; | &apos;detailed&apos;;
  onClick?: (pick: DraftPick) => void;
}

export interface DraftTimerProps extends BaseComponentProps {
}
  timeRemaining: number;
  totalTime: number;
  isActive: boolean;
  onTimeExpired?: () => void;
  showProgress?: boolean;
  variant?: &apos;circular&apos; | &apos;linear&apos; | &apos;text&apos;;
  size?: &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos;;
}

export interface DraftQueueProps extends BaseComponentProps {
}
  queue: Player[];
  onReorder: (playerIds: string[]) => void;
  onRemove: (playerId: string) => void;
  maxItems?: number;
  sortable?: boolean;
}

// ==================== TEAM COMPONENT PROPS ====================

export interface TeamCardProps extends BaseComponentProps {
}
  team: Team;
  variant?: &apos;compact&apos; | &apos;default&apos; | &apos;detailed&apos;;
  showRecord?: boolean;
  showRoster?: boolean;
  showStats?: boolean;
  onClick?: (team: Team) => void;
  actions?: Array<{
}
    label: string;
    icon?: React.ReactNode;
    onClick: (team: Team) => void;
    disabled?: boolean;
  }>;
}

export interface TeamRosterProps extends BaseComponentProps {
}
  team: Team;
  editable?: boolean;
  showBench?: boolean;
  showLineup?: boolean;
  onPlayerMove?: (playerId: string, fromPosition: string, toPosition: string) => void;
  onPlayerDrop?: (playerId: string) => void;
  positions?: string[];
}

export interface TeamStandingsProps extends BaseComponentProps {
}
  teams: Team[];
  currentWeek: number;
  showDivisions?: boolean;
  showPlayoffBracket?: boolean;
  interactive?: boolean;
  onTeamClick?: (team: Team) => void;
}

// ==================== LEAGUE COMPONENT PROPS ====================

export interface LeagueCardProps extends BaseComponentProps {
}
  league: League;
  variant?: &apos;compact&apos; | &apos;default&apos; | &apos;detailed&apos;;
  showSettings?: boolean;
  showMembers?: boolean;
  showActivity?: boolean;
  onClick?: (league: League) => void;
  actions?: Array<{
}
    label: string;
    icon?: React.ReactNode;
    onClick: (league: League) => void;
    disabled?: boolean;
  }>;
}

export interface LeagueSettingsProps extends BaseComponentProps {
}
  league: League;
  editable?: boolean;
  onSettingChange?: (setting: string, value: any) => void;
  sections?: string[];
  collapsible?: boolean;
}

export interface LeagueActivityProps extends BaseComponentProps {
}
  activities: any[];
  loading?: boolean;
  realTime?: boolean;
  maxItems?: number;
  showFilters?: boolean;
  onActivityClick?: (activity: any) => void;
}

// ==================== MATCHUP COMPONENT PROPS ====================

export interface MatchupCardProps extends BaseComponentProps {
}
  matchup: Matchup;
  variant?: &apos;compact&apos; | &apos;default&apos; | &apos;detailed&apos;;
  showLineups?: boolean;
  showProjections?: boolean;
  showLive?: boolean;
  onClick?: (matchup: Matchup) => void;
  interactive?: boolean;
}

export interface MatchupLineupProps extends BaseComponentProps {
}
  matchup: Matchup;
  teamId: string;
  editable?: boolean;
  showBench?: boolean;
  onPlayerClick?: (player: Player) => void;
  onLineupChange?: (lineup: Record<string, string>) => void;
}

export interface LiveScoringProps extends BaseComponentProps {
}
  matchup: Matchup;
  showEvents?: boolean;
  showProjections?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

// ==================== TRADE COMPONENT PROPS ====================

export interface TradeOfferProps extends BaseComponentProps {
}
  trade: any;
  canRespond?: boolean;
  showAnalysis?: boolean;
  onAccept?: (tradeId: string) => void;
  onReject?: (tradeId: string) => void;
  onCounter?: (tradeId: string) => void;
  onAnalyze?: (tradeId: string) => void;
}

export interface TradeBuilderProps extends BaseComponentProps {
}
  myTeam: Team;
  targetTeam: Team;
  onSubmit: (trade: any) => void;
  availablePlayers?: Player[];
  showAnalysis?: boolean;
  draftPicks?: any[];
}

// ==================== WAIVER COMPONENT PROPS ====================

export interface WaiverClaimProps extends BaseComponentProps {
}
  claim: any;
  canCancel?: boolean;
  showAdvice?: boolean;
  onCancel?: (claimId: string) => void;
  onModify?: (claimId: string) => void;
}

export interface WaiverWireProps extends BaseComponentProps {
}
  players: Player[];
  claims: any[];
  faabBudget: number;
  onSubmitClaim: (playerId: string, bid: number, dropPlayerId?: string) => void;
  showAdvice?: boolean;
  priorities?: any[];
}

// ==================== ANALYTICS COMPONENT PROPS ====================

export interface ChartProps extends BaseComponentProps {
}
  data: any[];
  type: &apos;line&apos; | &apos;bar&apos; | &apos;pie&apos; | &apos;scatter&apos; | &apos;area&apos;;
  title?: string;
  subtitle?: string;
  xAxis?: string;
  yAxis?: string;
  legend?: boolean;
  responsive?: boolean;
  height?: number;
  colors?: string[];
  onDataPointClick?: (data: any) => void;
}

export interface StatsCardProps extends BaseComponentProps {
}
  title: string;
  value: string | number;
  change?: {
}
    value: number;
    direction: &apos;up&apos; | &apos;down&apos;;
    period: string;
  };
  icon?: React.ReactNode;
  variant?: &apos;default&apos; | &apos;compact&apos; | &apos;featured&apos;;
  loading?: boolean;
  onClick?: () => void;
}

export interface AnalyticsDashboardProps extends BaseComponentProps {
}
  entity: &apos;team&apos; | &apos;player&apos; | &apos;league&apos;;
  entityId: string;
  timeframe?: &apos;week&apos; | &apos;month&apos; | &apos;season&apos; | &apos;all&apos;;
  widgets?: string[];
  customizable?: boolean;
  onWidgetAdd?: (widget: string) => void;
  onWidgetRemove?: (widget: string) => void;
  onWidgetReorder?: (widgets: string[]) => void;
}

// ==================== NAVIGATION COMPONENT PROPS ====================

export interface NavigationProps extends BaseComponentProps {
}
  user?: User;
  currentView: string;
  onViewChange: (view: string) => void;
  compact?: boolean;
  mobile?: boolean;
}

export interface BreadcrumbProps extends BaseComponentProps {
}
  items: Array<{
}
    label: string;
    href?: string;
    onClick?: () => void;
    active?: boolean;
  }>;
  separator?: React.ReactNode;
  maxItems?: number;
}

export interface TabsProps extends BaseComponentProps {
}
  tabs: Array<{
}
    id: string;
    label: string;
    content: React.ReactNode;
    disabled?: boolean;
    badge?: string | number;
    icon?: React.ReactNode;
  }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: &apos;default&apos; | &apos;pills&apos; | &apos;underline&apos;;
  orientation?: &apos;horizontal&apos; | &apos;vertical&apos;;
  size?: &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos;;
}

// ==================== UTILITY COMPONENT PROPS ====================

export interface LoaderProps extends BaseComponentProps {
}
  size?: &apos;xs&apos; | &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos; | &apos;xl&apos;;
  variant?: &apos;spinner&apos; | &apos;dots&apos; | &apos;pulse&apos; | &apos;skeleton&apos;;
  text?: string;
  overlay?: boolean;
  color?: string;
}

export interface EmptyStateProps extends BaseComponentProps {
}
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
}
    label: string;
    onClick: () => void;
  };
  variant?: &apos;default&apos; | &apos;compact&apos;;
}

export interface ErrorBoundaryProps extends BaseComponentProps {
}
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetOnPropsChange?: any[];
  resetKeys?: string[];
}

export interface TooltipProps extends BaseComponentProps {
}
  content: React.ReactNode;
  placement?: &apos;top&apos; | &apos;bottom&apos; | &apos;left&apos; | &apos;right&apos; | &apos;auto&apos;;
  trigger?: &apos;hover&apos; | &apos;click&apos; | &apos;focus&apos;;
  delay?: number;
  disabled?: boolean;
  arrow?: boolean;
  interactive?: boolean;
}

export interface PopoverProps extends BaseComponentProps {
}
  content: React.ReactNode;
  trigger: React.ReactNode;
  placement?: &apos;top&apos; | &apos;bottom&apos; | &apos;left&apos; | &apos;right&apos; | &apos;auto&apos;;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  closeOnClickOutside?: boolean;
  offset?: number;
  arrow?: boolean;
}

// ==================== RESPONSIVE PROPS ====================

export interface ResponsiveProps {
}
  mobile?: any;
  tablet?: any;
  desktop?: any;
  largeDesktop?: any;
}

// ==================== THEME PROPS ====================

export interface ThemeProps {
}
  theme?: &apos;light&apos; | &apos;dark&apos; | &apos;auto&apos;;
  colorScheme?: string;
  variant?: string;
  size?: string;
}

// ==================== EXPORT ALL ====================

export type {
}
  BaseComponentProps,
  InteractiveProps,
  BaseModalProps,
  ConfirmModalProps,
  PlayerDetailModalProps,
  FormFieldProps,
  InputProps,
  SelectProps,
  TextAreaProps,
  CheckboxProps,
  ButtonProps,
  IconButtonProps,
  PlayerCardProps,
  PlayerListProps,
  PlayerSearchProps,
  PlayerComparisonProps,
  DraftBoardProps,
  DraftPickProps,
  DraftTimerProps,
  DraftQueueProps,
  TeamCardProps,
  TeamRosterProps,
  TeamStandingsProps,
  LeagueCardProps,
  LeagueSettingsProps,
  LeagueActivityProps,
  MatchupCardProps,
  MatchupLineupProps,
  LiveScoringProps,
  TradeOfferProps,
  TradeBuilderProps,
  WaiverClaimProps,
  WaiverWireProps,
  ChartProps,
  StatsCardProps,
  AnalyticsDashboardProps,
  NavigationProps,
  BreadcrumbProps,
  TabsProps,
  LoaderProps,
  EmptyStateProps,
  ErrorBoundaryProps,
  TooltipProps,
  PopoverProps,
  ResponsiveProps,
  ThemeProps,
};