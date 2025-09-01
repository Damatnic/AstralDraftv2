/**
 * Event Handler Types
 * Comprehensive event handler interfaces and WebSocket event types
 */

import { Player } from '../models/player';
import { User } from '../models/user';
import { League, Team } from '../models/league';
import { DraftPick, DraftEvent } from '../models/draft';

// ==================== BASIC EVENT HANDLERS ====================

export type FormChangeHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
export type FormSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => void;
export type ButtonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;
export type GenericClickHandler = (event: React.MouseEvent) => void;
export type KeyboardHandler = (event: React.KeyboardEvent) => void;
export type FocusHandler = (event: React.FocusEvent) => void;
export type BlurHandler = (event: React.FocusEvent) => void;

export type InputChangeHandler<T = string> = (value: T) => void;
export type CheckboxChangeHandler = (checked: boolean) => void;
export type SelectChangeHandler<T = any> = (value: T) => void;
export type MultiSelectChangeHandler<T = any> = (values: T[]) => void;

// ==================== DRAG AND DROP HANDLERS ====================

export type DragStartHandler = (event: React.DragEvent) => void;
export type DragEndHandler = (event: React.DragEvent) => void;
export type DragOverHandler = (event: React.DragEvent) => void;
export type DropHandler = (event: React.DragEvent) => void;

export interface DragDropHandlers {
  onDragStart?: DragStartHandler;
  onDragEnd?: DragEndHandler;
  onDragOver?: DragOverHandler;
  onDrop?: DropHandler;
  onDragEnter?: (event: React.DragEvent) => void;
  onDragLeave?: (event: React.DragEvent) => void;

export interface DragDropResult {
  sourceId: string;
  targetId: string;
  sourceIndex: number;
  targetIndex: number;
  data?: any;

export type ReorderHandler<T = any> = (items: T[]) => void;

// ==================== PLAYER EVENT HANDLERS ====================

export type PlayerSelectHandler = (player: Player) => void;
export type PlayerActionHandler = (action: string, player: Player) => void;
export type PlayerComparisonHandler = (players: Player[]) => void;
export type PlayerWatchlistHandler = (playerId: string, action: 'add' | 'remove') => void;
export type PlayerRankingHandler = (playerId: string, newRank: number) => void;

export interface PlayerEventHandlers {
  onPlayerSelect?: PlayerSelectHandler;
  onPlayerAction?: PlayerActionHandler;
  onPlayerCompare?: (playerId: string) => void;
  onPlayerTrade?: (playerId: string) => void;
  onPlayerDrop?: (playerId: string) => void;
  onPlayerWatchlist?: PlayerWatchlistHandler;
  onPlayerRanking?: PlayerRankingHandler;
  onPlayerNote?: (playerId: string, note: string) => void;

// ==================== DRAFT EVENT HANDLERS ====================

export type DraftPickHandler = (playerId: string, price?: number) => void;
export type DraftQueueUpdateHandler = (playerIds: string[]) => void;
export type DraftTimerHandler = () => void;
export type AuctionBidHandler = (playerId: string, amount: number) => void;
export type DraftNominationHandler = (playerId: string) => void;

export interface DraftEventHandlers {
  onMakePick?: DraftPickHandler;
  onUpdateQueue?: DraftQueueUpdateHandler;
  onAutoDraftToggle?: (enabled: boolean) => void;
  onDraftPause?: DraftTimerHandler;
  onDraftResume?: DraftTimerHandler;
  onTimeExpired?: DraftTimerHandler;
  onBidPlaced?: AuctionBidHandler;
  onPlayerNominated?: DraftNominationHandler;
  onPickAnalysis?: (pick: DraftPick) => void;

// ==================== TEAM EVENT HANDLERS ====================

export type TeamSelectHandler = (team: Team) => void;
export type LineupChangeHandler = (position: string, playerId: string | null) => void;
export type RosterMoveHandler = (playerId: string, fromPosition: string, toPosition: string) => void;
export type TeamSettingsHandler = (setting: string, value: any) => void;

export interface TeamEventHandlers {
  onTeamSelect?: TeamSelectHandler;
  onLineupChange?: LineupChangeHandler;
  onRosterMove?: RosterMoveHandler;
  onPlayerStart?: (playerId: string) => void;
  onPlayerBench?: (playerId: string) => void;
  onPlayerIR?: (playerId: string) => void;
  onTeamSettings?: TeamSettingsHandler;
  onTeamRename?: (newName: string) => void;
  onTeamColorChange?: (primaryColor: string, secondaryColor: string) => void;

// ==================== TRADE EVENT HANDLERS ====================

export type TradeProposalHandler = (toTeamId: string, offer: any) => void;
export type TradeResponseHandler = (tradeId: string, response: 'accept' | 'reject' | 'counter') => void;
export type TradeAnalysisHandler = (tradeId: string) => void;
export type TradeVoteHandler = (tradeId: string, vote: 'approve' | 'veto') => void;

export interface TradeEventHandlers {
  onTradePropose?: TradeProposalHandler;
  onTradeRespond?: TradeResponseHandler;
  onTradeCancel?: (tradeId: string) => void;
  onTradeAnalyze?: TradeAnalysisHandler;
  onTradeVote?: TradeVoteHandler;
  onTradeCounterOffer?: (tradeId: string, counterOffer: any) => void;
  onTradeHistory?: () => void;

// ==================== WAIVER EVENT HANDLERS ====================

export type WaiverClaimHandler = (playerId: string, bid: number, dropPlayerId?: string) => void;
export type WaiverCancelHandler = (claimId: string) => void;
export type WaiverPriorityHandler = (claimIds: string[]) => void;

export interface WaiverEventHandlers {
  onWaiverClaim?: WaiverClaimHandler;
  onWaiverCancel?: WaiverCancelHandler;
  onWaiverPriority?: WaiverPriorityHandler;
  onWaiverAdvice?: (playerId: string) => void;
  onWaiverProcess?: () => void;

// ==================== LEAGUE EVENT HANDLERS ====================

export type LeagueSelectHandler = (league: League) => void;
export type LeagueSettingsHandler = (setting: string, value: any) => void;
export type LeagueInviteHandler = (emails: string[]) => void;
export type LeagueMemberHandler = (userId: string, action: 'kick' | 'promote' | 'demote') => void;

export interface LeagueEventHandlers {
  onLeagueSelect?: LeagueSelectHandler;
  onLeagueSettings?: LeagueSettingsHandler;
  onLeagueInvite?: LeagueInviteHandler;
  onLeagueMember?: LeagueMemberHandler;
  onLeagueJoin?: (leagueId: string, teamName: string) => void;
  onLeagueLeave?: (leagueId: string) => void;
  onLeagueDelete?: (leagueId: string) => void;

// ==================== NAVIGATION EVENT HANDLERS ====================

export type ViewChangeHandler = (view: string, data?: any) => void;
export type TabChangeHandler = (tabId: string) => void;
export type ModalToggleHandler = (modalId: string, isOpen: boolean, data?: any) => void;

export interface NavigationEventHandlers {
  onViewChange?: ViewChangeHandler;
  onTabChange?: TabChangeHandler;
  onModalToggle?: ModalToggleHandler;
  onBack?: () => void;
  onForward?: () => void;
  onHome?: () => void;
  onRefresh?: () => void;

// ==================== SEARCH AND FILTER HANDLERS ====================

export type SearchHandler = (query: string) => void;
export type FilterChangeHandler = (filters: Record<string, any>) => void;
export type SortChangeHandler = (field: string, direction: 'asc' | 'desc') => void;
export type PaginationHandler = (page: number) => void;

export interface SearchFilterHandlers {
  onSearch?: SearchHandler;
  onFilterChange?: FilterChangeHandler;
  onSortChange?: SortChangeHandler;
  onPagination?: PaginationHandler;
  onClearFilters?: () => void;
  onSaveSearch?: (name: string, query: string, filters: any) => void;

// ==================== WEBSOCKET EVENT TYPES ====================

export interface WebSocketMessage {
  id: string;
  type: string;
  payload: any;
  timestamp: Date;
  userId?: string;
  leagueId?: string;

// Draft Events
export type DraftEventType = 
  | 'draft:started'
  | 'draft:paused'
  | 'draft:resumed'
  | 'draft:completed'
  | 'draft:pick_made'
  | 'draft:pick_skipped'
  | 'draft:auto_pick'
  | 'draft:time_update'
  | 'draft:timer_expired'
  | 'draft:bid_placed'
  | 'draft:nomination_made'
  | 'draft:auction_won'
  | 'draft:user_joined'
  | 'draft:user_left'
  | 'draft:queue_updated'
  | 'draft:trade_completed';

export interface DraftWebSocketEvent extends WebSocketMessage {
  type: DraftEventType;
  payload: {
    draftId: string;
    pick?: DraftPick;
    timeRemaining?: number;
    currentTeamId?: string;
    playerId?: string;
    player?: Player;
    bidAmount?: number;
    bidderId?: string;
    userId?: string;
    teamId?: string;
    queue?: string[];
  };

// League Events
export type LeagueEventType =
  | 'league:member_joined'
  | 'league:member_left'
  | 'league:settings_updated'
  | 'league:season_started'
  | 'league:week_advanced'
  | 'league:playoffs_started'
  | 'league:champion_crowned'
  | 'league:trade_proposed'
  | 'league:trade_accepted'
  | 'league:trade_rejected'
  | 'league:waiver_processed'
  | 'league:lineup_locked'
  | 'league:scores_updated';

export interface LeagueWebSocketEvent extends WebSocketMessage {
  type: LeagueEventType;
  payload: {
    leagueId: string;
    userId?: string;
    teamId?: string;
    week?: number;
    setting?: string;
    value?: any;
    tradeId?: string;
    scores?: Record<string, number>;
    lineups?: Record<string, any>;
  };

// Real-time Score Events
export type ScoringEventType =
  | 'score:touchdown'
  | 'score:field_goal'
  | 'score:safety'
  | 'score:interception'
  | 'score:fumble'
  | 'score:big_play'
  | 'score:game_final'
  | 'score:player_update';

export interface ScoringWebSocketEvent extends WebSocketMessage {
  type: ScoringEventType;
  payload: {
    playerId: string;
    player: Player;
    teamId: string;
    points: number;
    totalPoints: number;
    statType: string;
    description: string;
    gameId: string;
    quarter?: number;
    timeRemaining?: string;
  };

// Chat Events
export type ChatEventType =
  | 'chat:message_sent'
  | 'chat:message_edited'
  | 'chat:message_deleted'
  | 'chat:user_typing'
  | 'chat:user_stopped_typing'
  | 'chat:reaction_added'
  | 'chat:reaction_removed';

export interface ChatWebSocketEvent extends WebSocketMessage {
  type: ChatEventType;
  payload: {
    messageId?: string;
    channelId: string;
    userId: string;
    content?: string;
    reaction?: string;
    isTyping?: boolean;
    mentions?: string[];
  };

// System Events
export type SystemEventType =
  | 'system:maintenance_start'
  | 'system:maintenance_end'
  | 'system:update_available'
  | 'system:connection_lost'
  | 'system:connection_restored'
  | 'system:rate_limit_exceeded'
  | 'system:server_overload';

export interface SystemWebSocketEvent extends WebSocketMessage {
  type: SystemEventType;
  payload: {
    message: string;
    severity: 'info' | 'warning' | 'error';
    duration?: number;
    maintenanceWindow?: {
      start: Date;
      end: Date;
    };
  };

// Union type for all WebSocket events
export type AnyWebSocketEvent = 
  | DraftWebSocketEvent 
  | LeagueWebSocketEvent 
  | ScoringWebSocketEvent 
  | ChatWebSocketEvent 
  | SystemWebSocketEvent;

// ==================== WEBSOCKET EVENT HANDLERS ====================

export type WebSocketEventHandler<T extends WebSocketMessage = WebSocketMessage> = (event: T) => void;

export interface WebSocketEventHandlers {
  onDraftEvent?: WebSocketEventHandler<DraftWebSocketEvent>;
  onLeagueEvent?: WebSocketEventHandler<LeagueWebSocketEvent>;
  onScoringEvent?: WebSocketEventHandler<ScoringWebSocketEvent>;
  onChatEvent?: WebSocketEventHandler<ChatWebSocketEvent>;
  onSystemEvent?: WebSocketEventHandler<SystemWebSocketEvent>;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onReconnect?: () => void;
  onError?: (error: Error) => void;

// ==================== NOTIFICATION EVENT HANDLERS ====================

export type NotificationHandler = (notification: any) => void;
export type NotificationActionHandler = (notificationId: string, action: string) => void;

export interface NotificationEventHandlers {
  onNotification?: NotificationHandler;
  onNotificationAction?: NotificationActionHandler;
  onNotificationDismiss?: (notificationId: string) => void;
  onNotificationMarkRead?: (notificationIds: string[]) => void;
  onNotificationSettings?: (settings: any) => void;

// ==================== ANALYTICS EVENT HANDLERS ====================

export type AnalyticsEventHandler = (eventName: string, properties?: Record<string, any>) => void;
export type ChartInteractionHandler = (dataPoint: any, index: number) => void;

export interface AnalyticsEventHandlers {
  onTrackEvent?: AnalyticsEventHandler;
  onChartHover?: ChartInteractionHandler;
  onChartClick?: ChartInteractionHandler;
  onChartZoom?: (range: { start: Date; end: Date }) => void;
  onMetricSelect?: (metric: string) => void;
  onTimeframeChange?: (timeframe: string) => void;

// ==================== ERROR EVENT HANDLERS ====================

export type ErrorHandler = (error: Error) => void;
export type ValidationErrorHandler = (errors: Record<string, string>) => void;

export interface ErrorEventHandlers {
  onError?: ErrorHandler;
  onValidationError?: ValidationErrorHandler;
  onRetry?: () => void;
  onErrorDismiss?: () => void;
  onErrorReport?: (error: Error) => void;

// ==================== LIFECYCLE EVENT HANDLERS ====================

export interface LifecycleEventHandlers {
  onLoad?: () => void;
  onUnload?: () => void;
  onSave?: () => void;
  onReset?: () => void;
  onCancel?: () => void;
  onSuccess?: () => void;
  onFailure?: (error: Error) => void;

// ==================== COMBINED EVENT HANDLERS ====================

export interface AllEventHandlers extends
  PlayerEventHandlers,
  DraftEventHandlers,
  TeamEventHandlers,
  TradeEventHandlers,
  WaiverEventHandlers,
  LeagueEventHandlers,
  NavigationEventHandlers,
  SearchFilterHandlers,
  WebSocketEventHandlers,
  NotificationEventHandlers,
  AnalyticsEventHandlers,
  ErrorEventHandlers,
  LifecycleEventHandlers {}

// ==================== EXPORT ALL ====================

export type {
  FormChangeHandler,
  FormSubmitHandler,
  ButtonClickHandler,
  GenericClickHandler,
  KeyboardHandler,
  FocusHandler,
  BlurHandler,
  InputChangeHandler,
  CheckboxChangeHandler,
  SelectChangeHandler,
  MultiSelectChangeHandler,
  DragStartHandler,
  DragEndHandler,
  DragOverHandler,
  DropHandler,
  DragDropHandlers,
  DragDropResult,
  ReorderHandler,
  PlayerSelectHandler,
  PlayerActionHandler,
  PlayerComparisonHandler,
  PlayerWatchlistHandler,
  PlayerRankingHandler,
  PlayerEventHandlers,
  DraftPickHandler,
  DraftQueueUpdateHandler,
  DraftTimerHandler,
  AuctionBidHandler,
  DraftNominationHandler,
  DraftEventHandlers,
  TeamSelectHandler,
  LineupChangeHandler,
  RosterMoveHandler,
  TeamSettingsHandler,
  TeamEventHandlers,
  TradeProposalHandler,
  TradeResponseHandler,
  TradeAnalysisHandler,
  TradeVoteHandler,
  TradeEventHandlers,
  WaiverClaimHandler,
  WaiverCancelHandler,
  WaiverPriorityHandler,
  WaiverEventHandlers,
  LeagueSelectHandler,
  LeagueSettingsHandler,
  LeagueInviteHandler,
  LeagueMemberHandler,
  LeagueEventHandlers,
  ViewChangeHandler,
  TabChangeHandler,
  ModalToggleHandler,
  NavigationEventHandlers,
  SearchHandler,
  FilterChangeHandler,
  SortChangeHandler,
  PaginationHandler,
  SearchFilterHandlers,
  WebSocketMessage,
  DraftEventType,
  DraftWebSocketEvent,
  LeagueEventType,
  LeagueWebSocketEvent,
  ScoringEventType,
  ScoringWebSocketEvent,
  ChatEventType,
  ChatWebSocketEvent,
  SystemEventType,
  SystemWebSocketEvent,
  AnyWebSocketEvent,
  WebSocketEventHandler,
  WebSocketEventHandlers,
  NotificationHandler,
  NotificationActionHandler,
  NotificationEventHandlers,
  AnalyticsEventHandler,
  ChartInteractionHandler,
  AnalyticsEventHandlers,
  ErrorHandler,
  ValidationErrorHandler,
  ErrorEventHandlers,
  LifecycleEventHandlers,
  AllEventHandlers,
};