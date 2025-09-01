/**
 * API Request Types
 * Standardized request interfaces for all API endpoints
 */

// ==================== BASE REQUEST TYPES ====================

export interface BaseRequest {
  timestamp?: string;
  requestId?: string;
  clientVersion?: string;

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';

export interface FilterParams {
  filters?: Record<string, any>;
  search?: string;

export interface PaginatedRequest extends BaseRequest, PaginationParams, SortParams, FilterParams {}

// ==================== AUTHENTICATION REQUESTS ====================

export interface LoginRequest extends BaseRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
  captcha?: string;
  mfaCode?: string;

export interface RegisterRequest extends BaseRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  agreeToTerms: boolean;
  subscribeToNewsletter?: boolean;
  inviteCode?: string;
  referralCode?: string;

export interface RefreshTokenRequest extends BaseRequest {
  refreshToken: string;

export interface ForgotPasswordRequest extends BaseRequest {
  email: string;
  captcha?: string;

export interface ResetPasswordRequest extends BaseRequest {
  token: string;
  email: string;
  password: string;
  confirmPassword: string;

export interface ChangePasswordRequest extends BaseRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;

export interface VerifyEmailRequest extends BaseRequest {
  token: string;
  email: string;

// ==================== USER REQUESTS ====================

export interface UpdateUserProfileRequest extends BaseRequest {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  banner?: string;
  location?: {
    city: string;
    state: string;
    country: string;
    timezone: string;
  };
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    website?: string;
  };
  favoriteNFLTeam?: string;
  fantasyExperience?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  yearsPlaying?: number;

export interface UpdateUserPreferencesRequest extends BaseRequest {
  notifications?: {
    email?: Record<string, boolean>;
    push?: Record<string, boolean>;
    inApp?: Record<string, boolean>;
    frequency?: 'REAL_TIME' | 'HOURLY' | 'DAILY' | 'WEEKLY';
  };
  privacy?: {
    profileVisibility?: 'PUBLIC' | 'FRIENDS' | 'LEAGUES_ONLY' | 'PRIVATE';
    showRealName?: boolean;
    showEmail?: boolean;
    showLocation?: boolean;
    showStats?: boolean;
    allowDirectMessages?: boolean;
    allowLeagueInvites?: boolean;
  };
  display?: {
    theme?: 'LIGHT' | 'DARK' | 'SYSTEM';
    language?: string;
    timezone?: string;
    dateFormat?: string;
    timeFormat?: '12H' | '24H';
    compactMode?: boolean;
    fontSize?: 'SMALL' | 'MEDIUM' | 'LARGE' | 'EXTRA_LARGE';
    highContrast?: boolean;
    reducedMotion?: boolean;
  };
  gameplay?: {
    defaultDraftStrategy?: 'CONSERVATIVE' | 'AGGRESSIVE' | 'BALANCED';
    autoLineupOptimization?: boolean;
    riskTolerance?: 'LOW' | 'MEDIUM' | 'HIGH';
    favoritePositions?: string[];
    favoriteTeams?: string[];
    customRankings?: boolean;
  };

export interface UploadAvatarRequest extends BaseRequest {
  file: File;
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };

// ==================== LEAGUE REQUESTS ====================

export interface CreateLeagueRequest extends BaseRequest {
  name: string;
  description?: string;
  avatar?: string;
  type: 'REDRAFT' | 'KEEPER' | 'DYNASTY' | 'BESTBALL';
  isPublic?: boolean;
  password?: string;
  
  settings: {
    teamCount: number;
    scoringFormat: 'STANDARD' | 'PPR' | 'HALF_PPR' | 'CUSTOM';
    
    roster: {
      qb: number;
      rb: number;
      wr: number;
      te: number;
      flex: number;
      superflex?: number;
      k: number;
      def: number;
      bench: number;
      ir: number;
    };
    
    draft: {
      type: 'SNAKE' | 'AUCTION' | 'LINEAR';
      date?: string;
      timePerPick: number;
      allowAutoDraft: boolean;
    };
    
    season: {
      regularSeasonWeeks: number;
      playoffTeams: number;
      playoffWeeks: number;
      tradeDeadline: number;
    };
    
    waivers: {
      type: 'FAAB' | 'ROLLING' | 'REVERSE_STANDINGS';
      faabBudget?: number;
      waiverPeriod: number;
    };
    
    customScoring?: {
      passing: Record<string, number>;
      rushing: Record<string, number>;
      receiving: Record<string, number>;
      kicking: Record<string, number>;
      defense: Record<string, number>;
    };
  };
  
  inviteEmails?: string[];

export interface UpdateLeagueRequest extends BaseRequest {
  leagueId: string;
  name?: string;
  description?: string;
  avatar?: string;
  settings?: Partial<any>; // Will match league settings structure

export interface JoinLeagueRequest extends BaseRequest {
  inviteCode?: string;
  password?: string;
  teamName: string;
  teamAvatar?: string;

export interface LeaveLeagueRequest extends BaseRequest {
  leagueId: string;
  reason?: string;

export interface InviteToLeagueRequest extends BaseRequest {
  leagueId: string;
  emails: string[];
  customMessage?: string;

export interface KickFromLeagueRequest extends BaseRequest {
  leagueId: string;
  userId: string;
  reason: string;

// ==================== TEAM REQUESTS ====================

export interface UpdateTeamRequest extends BaseRequest {
  teamId: string;
  name?: string;
  abbreviation?: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;

export interface SetLineupRequest extends BaseRequest {
  teamId: string;
  week?: number;
  lineup: Record<string, string | null>; // position -> playerId

export interface UpdateRosterRequest extends BaseRequest {
  teamId: string;
  action: 'ADD' | 'DROP' | 'MOVE_TO_IR' | 'ACTIVATE_FROM_IR';
  playerId: string;
  position?: string;
  dropPlayerId?: string;

// ==================== DRAFT REQUESTS ====================

export interface StartDraftRequest extends BaseRequest {
  leagueId: string;
  draftDate?: string;
  randomizeOrder?: boolean;
  customOrder?: string[];

export interface MakeDraftPickRequest extends BaseRequest {
  draftId: string;
  playerId: string;
  price?: number; // For auction drafts

export interface AutoDraftToggleRequest extends BaseRequest {
  draftId: string;
  teamId: string;
  enabled: boolean;

export interface UpdateDraftQueueRequest extends BaseRequest {
  draftId: string;
  teamId: string;
  playerIds: string[];

export interface PauseDraftRequest extends BaseRequest {
  draftId: string;
  reason?: string;

export interface ResumeDraftRequest extends BaseRequest {
  draftId: string;

export interface AuctionBidRequest extends BaseRequest {
  draftId: string;
  playerId: string;
  amount: number;

export interface NominatePlayerRequest extends BaseRequest {
  draftId: string;
  playerId: string;

// ==================== TRADE REQUESTS ====================

export interface ProposeTradeRequest extends BaseRequest {
  leagueId: string;
  toTeamId: string;
  playersOffered: string[];
  playersRequested: string[];
  picksOffered?: Array<{
    round: number;
    year: number;
  }>;
  picksRequested?: Array<{
    round: number;
    year: number;
  }>;
  faabOffered?: number;
  faabRequested?: number;
  message?: string;
  expiresIn?: number; // hours

export interface RespondToTradeRequest extends BaseRequest {
  tradeId: string;
  action: 'ACCEPT' | 'REJECT' | 'COUNTER';
  counterOffer?: {
    playersOffered: string[];
    playersRequested: string[];
    picksOffered?: Array<{
      round: number;
      year: number;
    }>;
    picksRequested?: Array<{
      round: number;
      year: number;
    }>;
    faabOffered?: number;
    faabRequested?: number;
  };
  message?: string;

export interface CancelTradeRequest extends BaseRequest {
  tradeId: string;
  reason?: string;

export interface VoteOnTradeRequest extends BaseRequest {
  tradeId: string;
  vote: 'APPROVE' | 'VETO';
  reason?: string;

// ==================== WAIVER REQUESTS ====================

export interface SubmitWaiverClaimRequest extends BaseRequest {
  leagueId: string;
  playerId: string;
  bid: number;
  dropPlayerId?: string;
  priority?: number;

export interface CancelWaiverClaimRequest extends BaseRequest {
  claimId: string;

export interface ProcessWaiversRequest extends BaseRequest {
  leagueId: string;
  week?: number;

export interface UpdateWaiverPriorityRequest extends BaseRequest {
  leagueId: string;
  teamId: string;
  claimIds: string[]; // Ordered by priority

// ==================== PLAYER REQUESTS ====================

export interface GetPlayersRequest extends PaginatedRequest {
  positions?: string[];
  teams?: string[];
  availability?: 'AVAILABLE' | 'DRAFTED' | 'FREE_AGENT' | 'WAIVER';
  minRank?: number;
  maxRank?: number;
  injuryStatus?: string[];
  rookiesOnly?: boolean;
  sleepersOnly?: boolean;
  byeWeeks?: number[];

export interface GetPlayerDetailRequest extends BaseRequest {
  playerId: string;
  includeStats?: boolean;
  includeNews?: boolean;
  includeComparisons?: boolean;
  season?: number;

export interface UpdatePlayerWatchlistRequest extends BaseRequest {
  action: 'ADD' | 'REMOVE';
  playerId: string;

export interface GetPlayerProjectionsRequest extends BaseRequest {
  playerIds?: string[];
  positions?: string[];
  week?: number;
  includeWeekly?: boolean;

// ==================== ANALYTICS REQUESTS ====================

export interface GetAnalyticsRequest extends BaseRequest {
  type: 'TEAM' | 'PLAYER' | 'LEAGUE' | 'MATCHUP';
  entityId: string;
  timeframe?: 'WEEK' | 'MONTH' | 'SEASON' | 'ALL_TIME';
  metrics?: string[];
  compareWith?: string[];

export interface GetPredictionsRequest extends BaseRequest {
  playerIds?: string[];
  week?: number;
  includeConfidence?: boolean;
  scenario?: 'OPTIMISTIC' | 'REALISTIC' | 'PESSIMISTIC';

export interface UpdateCustomRankingsRequest extends BaseRequest {
  leagueId: string;
  rankings: Array<{
    playerId: string;
    rank: number;
    position: string;
  }>;

// ==================== MESSAGING REQUESTS ====================

export interface SendMessageRequest extends BaseRequest {
  type: 'LEAGUE_CHAT' | 'DIRECT_MESSAGE' | 'TRADE_DISCUSSION';
  targetId: string; // leagueId or userId or tradeId
  content: string;
  attachments?: Array<{
    type: 'IMAGE' | 'FILE' | 'LINK';
    url: string;
    name?: string;
  }>;
  mentions?: string[]; // User IDs
  parentMessageId?: string; // For replies

export interface MarkMessagesReadRequest extends BaseRequest {
  messageIds: string[];

export interface DeleteMessageRequest extends BaseRequest {
  messageId: string;

// ==================== SEARCH REQUESTS ====================

export interface SearchRequest extends PaginatedRequest {
  query: string;
  type: 'PLAYERS' | 'LEAGUES' | 'USERS' | 'ALL';
  filters?: {
    positions?: string[];
    availability?: string;
    minRank?: number;
    maxRank?: number;
  };
  includeHighlights?: boolean;

// ==================== NOTIFICATION REQUESTS ====================

export interface UpdateNotificationSettingsRequest extends BaseRequest {
  email?: Record<string, boolean>;
  push?: Record<string, boolean>;
  inApp?: Record<string, boolean>;

export interface MarkNotificationsReadRequest extends BaseRequest {
  notificationIds: string[];

export interface RegisterPushTokenRequest extends BaseRequest {
  token: string;
  platform: 'ios' | 'android' | 'web';

// ==================== FILE UPLOAD REQUESTS ====================

export interface UploadFileRequest extends BaseRequest {
  file: File;
  type: 'AVATAR' | 'LEAGUE_LOGO' | 'TEAM_LOGO' | 'ATTACHMENT';
  entityId?: string;
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };

// ==================== COMMISSIONER REQUESTS ====================

export interface CommissionerActionRequest extends BaseRequest {
  leagueId: string;
  action: 'FORCE_TRADE' | 'REVERSE_TRADE' | 'EDIT_ROSTER' | 'ADJUST_SCORE' | 'RESET_DRAFT' | 'KICK_USER';
  targetId: string; // teamId, tradeId, etc.
  data: Record<string, any>;
  reason: string;
  notifyAffectedUsers?: boolean;

export interface UpdateLeagueSettingsRequest extends BaseRequest {
  leagueId: string;
  settings: Record<string, any>;
  reason?: string;

export interface ProcessCommissionerVoteRequest extends BaseRequest {
  leagueId: string;
  voteId: string;
  decision: 'APPROVE' | 'REJECT';
  reason?: string;

// ==================== EXPORT ALL ====================

export type {
  BaseRequest,
  PaginationParams,
  SortParams,
  FilterParams,
  PaginatedRequest,
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  VerifyEmailRequest,
  UpdateUserProfileRequest,
  UpdateUserPreferencesRequest,
  UploadAvatarRequest,
  CreateLeagueRequest,
  UpdateLeagueRequest,
  JoinLeagueRequest,
  LeaveLeagueRequest,
  InviteToLeagueRequest,
  KickFromLeagueRequest,
  UpdateTeamRequest,
  SetLineupRequest,
  UpdateRosterRequest,
  StartDraftRequest,
  MakeDraftPickRequest,
  AutoDraftToggleRequest,
  UpdateDraftQueueRequest,
  PauseDraftRequest,
  ResumeDraftRequest,
  AuctionBidRequest,
  NominatePlayerRequest,
  ProposeTradeRequest,
  RespondToTradeRequest,
  CancelTradeRequest,
  VoteOnTradeRequest,
  SubmitWaiverClaimRequest,
  CancelWaiverClaimRequest,
  ProcessWaiversRequest,
  UpdateWaiverPriorityRequest,
  GetPlayersRequest,
  GetPlayerDetailRequest,
  UpdatePlayerWatchlistRequest,
  GetPlayerProjectionsRequest,
  GetAnalyticsRequest,
  GetPredictionsRequest,
  UpdateCustomRankingsRequest,
  SendMessageRequest,
  MarkMessagesReadRequest,
  DeleteMessageRequest,
  SearchRequest,
  UpdateNotificationSettingsRequest,
  MarkNotificationsReadRequest,
  RegisterPushTokenRequest,
  UploadFileRequest,
  CommissionerActionRequest,
  UpdateLeagueSettingsRequest,
  ProcessCommissionerVoteRequest,
};