/**
 * React Component Prop Types
 * Comprehensive prop interfaces for all React components
 */

import { Player } from '../models/player';
import { User } from '../models/user';
import { League, Team, Matchup } from '../models/league';
import { DraftState, DraftPick } from '../models/draft';

// ==================== BASE COMPONENT PROPS ====================

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  testId?: string;
  'data-testid'?: string;
  id?: string;
  style?: React.CSSProperties;

export interface InteractiveProps extends BaseComponentProps {
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  tabIndex?: number;
  role?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-controls'?: string;

// ==================== MODAL PROPS ====================

export interface BaseModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  position?: 'center' | 'top' | 'bottom';
  animation?: 'fade' | 'slide' | 'scale' | 'none';

export interface ConfirmModalProps extends BaseModalProps {
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  onConfirm: () => void;
  onCancel?: () => void;
  isLoading?: boolean;

export interface PlayerDetailModalProps extends BaseModalProps {
  player: Player;
  showComparison?: boolean;
  showTrade?: boolean;
  canAddToWatchlist?: boolean;
  onPlayerAction?: (action: string, playerId: string) => void;

// ==================== FORM PROPS ====================

export interface FormFieldProps extends BaseComponentProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  autoComplete?: string;
  autoFocus?: boolean;

export interface InputProps extends FormFieldProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
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
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

export interface SelectProps<T = any> extends FormFieldProps {
  value: T;
  onChange: (value: T) => void;
  options: Array<{
    value: T;
    label: string;
    disabled?: boolean;
    group?: string;
  }>;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';

export interface TextAreaProps extends FormFieldProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  cols?: number;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  maxLength?: number;
  minLength?: number;

export interface CheckboxProps extends FormFieldProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  indeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'switch';

// ==================== BUTTON PROPS ====================

export interface ButtonProps extends InteractiveProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconOnly?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  download?: boolean;

export interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'iconOnly'> {
  icon: React.ReactNode;
  'aria-label': string;
  tooltip?: string;

// ==================== PLAYER COMPONENT PROPS ====================

export interface PlayerCardProps extends BaseComponentProps {
  player: Player;
  variant?: 'compact' | 'default' | 'detailed';
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

export interface PlayerListProps extends BaseComponentProps {
  players: Player[];
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  variant?: 'table' | 'grid' | 'list';
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  selectable?: boolean;
  selectedPlayers?: string[];
  onPlayerSelect?: (playerId: string, selected: boolean) => void;
  onPlayerClick?: (player: Player) => void;
  onSort?: (field: string, direction: 'asc' | 'desc') => void;
  itemsPerPage?: number;
  showPagination?: boolean;

export interface PlayerSearchProps extends BaseComponentProps {
  onSearch: (query: string) => void;
  onFilter: (filters: any) => void;
  placeholder?: string;
  filters?: {
    positions?: string[];
    teams?: string[];
    availability?: string[];
  };
  showFilters?: boolean;
  debounceMs?: number;
  loading?: boolean;

export interface PlayerComparisonProps extends BaseComponentProps {
  players: Player[];
  categories?: string[];
  onRemovePlayer?: (playerId: string) => void;
  onAddPlayer?: () => void;
  maxPlayers?: number;

// ==================== DRAFT COMPONENT PROPS ====================

export interface DraftBoardProps extends BaseComponentProps {
  draftState: DraftState;
  availablePlayers: Player[];
  myTeam: Team;
  onMakePick: (playerId: string) => void;
  onUpdateQueue: (playerIds: string[]) => void;
  canMakePick: boolean;
  recommendations?: any[];
  loading?: boolean;

export interface DraftPickProps extends BaseComponentProps {
  pick: DraftPick;
  team?: Team;
  player?: Player;
  isCurrent?: boolean;
  isMyPick?: boolean;
  variant?: 'compact' | 'detailed';
  onClick?: (pick: DraftPick) => void;

export interface DraftTimerProps extends BaseComponentProps {
  timeRemaining: number;
  totalTime: number;
  isActive: boolean;
  onTimeExpired?: () => void;
  showProgress?: boolean;
  variant?: 'circular' | 'linear' | 'text';
  size?: 'sm' | 'md' | 'lg';

export interface DraftQueueProps extends BaseComponentProps {
  queue: Player[];
  onReorder: (playerIds: string[]) => void;
  onRemove: (playerId: string) => void;
  maxItems?: number;
  sortable?: boolean;

// ==================== TEAM COMPONENT PROPS ====================

export interface TeamCardProps extends BaseComponentProps {
  team: Team;
  variant?: 'compact' | 'default' | 'detailed';
  showRecord?: boolean;
  showRoster?: boolean;
  showStats?: boolean;
  onClick?: (team: Team) => void;
  actions?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: (team: Team) => void;
    disabled?: boolean;
  }>;

export interface TeamRosterProps extends BaseComponentProps {
  team: Team;
  editable?: boolean;
  showBench?: boolean;
  showLineup?: boolean;
  onPlayerMove?: (playerId: string, fromPosition: string, toPosition: string) => void;
  onPlayerDrop?: (playerId: string) => void;
  positions?: string[];

export interface TeamStandingsProps extends BaseComponentProps {
  teams: Team[];
  currentWeek: number;
  showDivisions?: boolean;
  showPlayoffBracket?: boolean;
  interactive?: boolean;
  onTeamClick?: (team: Team) => void;

// ==================== LEAGUE COMPONENT PROPS ====================

export interface LeagueCardProps extends BaseComponentProps {
  league: League;
  variant?: 'compact' | 'default' | 'detailed';
  showSettings?: boolean;
  showMembers?: boolean;
  showActivity?: boolean;
  onClick?: (league: League) => void;
  actions?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: (league: League) => void;
    disabled?: boolean;
  }>;

export interface LeagueSettingsProps extends BaseComponentProps {
  league: League;
  editable?: boolean;
  onSettingChange?: (setting: string, value: any) => void;
  sections?: string[];
  collapsible?: boolean;

export interface LeagueActivityProps extends BaseComponentProps {
  activities: any[];
  loading?: boolean;
  realTime?: boolean;
  maxItems?: number;
  showFilters?: boolean;
  onActivityClick?: (activity: any) => void;

// ==================== MATCHUP COMPONENT PROPS ====================

export interface MatchupCardProps extends BaseComponentProps {
  matchup: Matchup;
  variant?: 'compact' | 'default' | 'detailed';
  showLineups?: boolean;
  showProjections?: boolean;
  showLive?: boolean;
  onClick?: (matchup: Matchup) => void;
  interactive?: boolean;

export interface MatchupLineupProps extends BaseComponentProps {
  matchup: Matchup;
  teamId: string;
  editable?: boolean;
  showBench?: boolean;
  onPlayerClick?: (player: Player) => void;
  onLineupChange?: (lineup: Record<string, string>) => void;

export interface LiveScoringProps extends BaseComponentProps {
  matchup: Matchup;
  showEvents?: boolean;
  showProjections?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;

// ==================== TRADE COMPONENT PROPS ====================

export interface TradeOfferProps extends BaseComponentProps {
  trade: any;
  canRespond?: boolean;
  showAnalysis?: boolean;
  onAccept?: (tradeId: string) => void;
  onReject?: (tradeId: string) => void;
  onCounter?: (tradeId: string) => void;
  onAnalyze?: (tradeId: string) => void;

export interface TradeBuilderProps extends BaseComponentProps {
  myTeam: Team;
  targetTeam: Team;
  onSubmit: (trade: any) => void;
  availablePlayers?: Player[];
  showAnalysis?: boolean;
  draftPicks?: any[];

// ==================== WAIVER COMPONENT PROPS ====================

export interface WaiverClaimProps extends BaseComponentProps {
  claim: any;
  canCancel?: boolean;
  showAdvice?: boolean;
  onCancel?: (claimId: string) => void;
  onModify?: (claimId: string) => void;

export interface WaiverWireProps extends BaseComponentProps {
  players: Player[];
  claims: any[];
  faabBudget: number;
  onSubmitClaim: (playerId: string, bid: number, dropPlayerId?: string) => void;
  showAdvice?: boolean;
  priorities?: any[];

// ==================== ANALYTICS COMPONENT PROPS ====================

export interface ChartProps extends BaseComponentProps {
  data: any[];
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'area';
  title?: string;
  subtitle?: string;
  xAxis?: string;
  yAxis?: string;
  legend?: boolean;
  responsive?: boolean;
  height?: number;
  colors?: string[];
  onDataPointClick?: (data: any) => void;

export interface StatsCardProps extends BaseComponentProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    direction: 'up' | 'down';
    period: string;
  };
  icon?: React.ReactNode;
  variant?: 'default' | 'compact' | 'featured';
  loading?: boolean;
  onClick?: () => void;

export interface AnalyticsDashboardProps extends BaseComponentProps {
  entity: 'team' | 'player' | 'league';
  entityId: string;
  timeframe?: 'week' | 'month' | 'season' | 'all';
  widgets?: string[];
  customizable?: boolean;
  onWidgetAdd?: (widget: string) => void;
  onWidgetRemove?: (widget: string) => void;
  onWidgetReorder?: (widgets: string[]) => void;

// ==================== NAVIGATION COMPONENT PROPS ====================

export interface NavigationProps extends BaseComponentProps {
  user?: User;
  currentView: string;
  onViewChange: (view: string) => void;
  compact?: boolean;
  mobile?: boolean;

export interface BreadcrumbProps extends BaseComponentProps {
  items: Array<{
    label: string;
    href?: string;
    onClick?: () => void;
    active?: boolean;
  }>;
  separator?: React.ReactNode;
  maxItems?: number;

export interface TabsProps extends BaseComponentProps {
  tabs: Array<{
    id: string;
    label: string;
    content: React.ReactNode;
    disabled?: boolean;
    badge?: string | number;
    icon?: React.ReactNode;
  }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';

// ==================== UTILITY COMPONENT PROPS ====================

export interface LoaderProps extends BaseComponentProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  text?: string;
  overlay?: boolean;
  color?: string;

export interface EmptyStateProps extends BaseComponentProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'compact';

export interface ErrorBoundaryProps extends BaseComponentProps {
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetOnPropsChange?: any[];
  resetKeys?: string[];

export interface TooltipProps extends BaseComponentProps {
  content: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  trigger?: 'hover' | 'click' | 'focus';
  delay?: number;
  disabled?: boolean;
  arrow?: boolean;
  interactive?: boolean;

export interface PopoverProps extends BaseComponentProps {
  content: React.ReactNode;
  trigger: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  closeOnClickOutside?: boolean;
  offset?: number;
  arrow?: boolean;

// ==================== RESPONSIVE PROPS ====================

export interface ResponsiveProps {
  mobile?: any;
  tablet?: any;
  desktop?: any;
  largeDesktop?: any;

// ==================== THEME PROPS ====================

export interface ThemeProps {
  theme?: 'light' | 'dark' | 'auto';
  colorScheme?: string;
  variant?: string;
  size?: string;

// ==================== EXPORT ALL ====================

export type {
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