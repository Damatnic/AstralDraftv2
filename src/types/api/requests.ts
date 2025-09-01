/**
 * API Request Types
 * Standardized request interfaces for all API endpoints
 */

// ==================== BASE REQUEST TYPES ====================

export interface BaseRequest {
}
  timestamp?: string;
  requestId?: string;
  clientVersion?: string;
}

export interface PaginationParams {
}
  page?: number;
  limit?: number;
  offset?: number;
}

export interface SortParams {
}
  sortBy?: string;
  sortOrder?: &apos;asc&apos; | &apos;desc&apos;;
}

export interface FilterParams {
}
  filters?: Record<string, any>;
  search?: string;
}

export interface PaginatedRequest extends BaseRequest, PaginationParams, SortParams, FilterParams {}

// ==================== AUTHENTICATION REQUESTS ====================

export interface LoginRequest extends BaseRequest {
}
  email: string;
  password: string;
  rememberMe?: boolean;
  captcha?: string;
  mfaCode?: string;
}

export interface RegisterRequest extends BaseRequest {
}
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
}

export interface RefreshTokenRequest extends BaseRequest {
}
  refreshToken: string;
}

export interface ForgotPasswordRequest extends BaseRequest {
}
  email: string;
  captcha?: string;
}

export interface ResetPasswordRequest extends BaseRequest {
}
  token: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest extends BaseRequest {
}
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface VerifyEmailRequest extends BaseRequest {
}
  token: string;
  email: string;
}

// ==================== USER REQUESTS ====================

export interface UpdateUserProfileRequest extends BaseRequest {
}
  firstName?: string;
  lastName?: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  banner?: string;
  location?: {
}
    city: string;
    state: string;
    country: string;
    timezone: string;
  };
  socialLinks?: {
}
    twitter?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    website?: string;
  };
  favoriteNFLTeam?: string;
  fantasyExperience?: &apos;BEGINNER&apos; | &apos;INTERMEDIATE&apos; | &apos;ADVANCED&apos; | &apos;EXPERT&apos;;
  yearsPlaying?: number;
}

export interface UpdateUserPreferencesRequest extends BaseRequest {
}
  notifications?: {
}
    email?: Record<string, boolean>;
    push?: Record<string, boolean>;
    inApp?: Record<string, boolean>;
    frequency?: &apos;REAL_TIME&apos; | &apos;HOURLY&apos; | &apos;DAILY&apos; | &apos;WEEKLY&apos;;
  };
  privacy?: {
}
    profileVisibility?: &apos;PUBLIC&apos; | &apos;FRIENDS&apos; | &apos;LEAGUES_ONLY&apos; | &apos;PRIVATE&apos;;
    showRealName?: boolean;
    showEmail?: boolean;
    showLocation?: boolean;
    showStats?: boolean;
    allowDirectMessages?: boolean;
    allowLeagueInvites?: boolean;
  };
  display?: {
}
    theme?: &apos;LIGHT&apos; | &apos;DARK&apos; | &apos;SYSTEM&apos;;
    language?: string;
    timezone?: string;
    dateFormat?: string;
    timeFormat?: &apos;12H&apos; | &apos;24H&apos;;
    compactMode?: boolean;
    fontSize?: &apos;SMALL&apos; | &apos;MEDIUM&apos; | &apos;LARGE&apos; | &apos;EXTRA_LARGE&apos;;
    highContrast?: boolean;
    reducedMotion?: boolean;
  };
  gameplay?: {
}
    defaultDraftStrategy?: &apos;CONSERVATIVE&apos; | &apos;AGGRESSIVE&apos; | &apos;BALANCED&apos;;
    autoLineupOptimization?: boolean;
    riskTolerance?: &apos;LOW&apos; | &apos;MEDIUM&apos; | &apos;HIGH&apos;;
    favoritePositions?: string[];
    favoriteTeams?: string[];
    customRankings?: boolean;
  };
}

export interface UploadAvatarRequest extends BaseRequest {
}
  file: File;
  crop?: {
}
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// ==================== LEAGUE REQUESTS ====================

export interface CreateLeagueRequest extends BaseRequest {
}
  name: string;
  description?: string;
  avatar?: string;
  type: &apos;REDRAFT&apos; | &apos;KEEPER&apos; | &apos;DYNASTY&apos; | &apos;BESTBALL&apos;;
  isPublic?: boolean;
  password?: string;
  
  settings: {
}
    teamCount: number;
    scoringFormat: &apos;STANDARD&apos; | &apos;PPR&apos; | &apos;HALF_PPR&apos; | &apos;CUSTOM&apos;;
    
    roster: {
}
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
}
      type: &apos;SNAKE&apos; | &apos;AUCTION&apos; | &apos;LINEAR&apos;;
      date?: string;
      timePerPick: number;
      allowAutoDraft: boolean;
    };
    
    season: {
}
      regularSeasonWeeks: number;
      playoffTeams: number;
      playoffWeeks: number;
      tradeDeadline: number;
    };
    
    waivers: {
}
      type: &apos;FAAB&apos; | &apos;ROLLING&apos; | &apos;REVERSE_STANDINGS&apos;;
      faabBudget?: number;
      waiverPeriod: number;
    };
    
    customScoring?: {
}
      passing: Record<string, number>;
      rushing: Record<string, number>;
      receiving: Record<string, number>;
      kicking: Record<string, number>;
      defense: Record<string, number>;
    };
  };
  
  inviteEmails?: string[];
}

export interface UpdateLeagueRequest extends BaseRequest {
}
  leagueId: string;
  name?: string;
  description?: string;
  avatar?: string;
  settings?: Partial<any>; // Will match league settings structure
}

export interface JoinLeagueRequest extends BaseRequest {
}
  inviteCode?: string;
  password?: string;
  teamName: string;
  teamAvatar?: string;
}

export interface LeaveLeagueRequest extends BaseRequest {
}
  leagueId: string;
  reason?: string;
}

export interface InviteToLeagueRequest extends BaseRequest {
}
  leagueId: string;
  emails: string[];
  customMessage?: string;
}

export interface KickFromLeagueRequest extends BaseRequest {
}
  leagueId: string;
  userId: string;
  reason: string;
}

// ==================== TEAM REQUESTS ====================

export interface UpdateTeamRequest extends BaseRequest {
}
  teamId: string;
  name?: string;
  abbreviation?: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export interface SetLineupRequest extends BaseRequest {
}
  teamId: string;
  week?: number;
  lineup: Record<string, string | null>; // position -> playerId
}

export interface UpdateRosterRequest extends BaseRequest {
}
  teamId: string;
  action: &apos;ADD&apos; | &apos;DROP&apos; | &apos;MOVE_TO_IR&apos; | &apos;ACTIVATE_FROM_IR&apos;;
  playerId: string;
  position?: string;
  dropPlayerId?: string;
}

// ==================== DRAFT REQUESTS ====================

export interface StartDraftRequest extends BaseRequest {
}
  leagueId: string;
  draftDate?: string;
  randomizeOrder?: boolean;
  customOrder?: string[];
}

export interface MakeDraftPickRequest extends BaseRequest {
}
  draftId: string;
  playerId: string;
  price?: number; // For auction drafts
}

export interface AutoDraftToggleRequest extends BaseRequest {
}
  draftId: string;
  teamId: string;
  enabled: boolean;
}

export interface UpdateDraftQueueRequest extends BaseRequest {
}
  draftId: string;
  teamId: string;
  playerIds: string[];
}

export interface PauseDraftRequest extends BaseRequest {
}
  draftId: string;
  reason?: string;
}

export interface ResumeDraftRequest extends BaseRequest {
}
  draftId: string;
}

export interface AuctionBidRequest extends BaseRequest {
}
  draftId: string;
  playerId: string;
  amount: number;
}

export interface NominatePlayerRequest extends BaseRequest {
}
  draftId: string;
  playerId: string;
}

// ==================== TRADE REQUESTS ====================

export interface ProposeTradeRequest extends BaseRequest {
}
  leagueId: string;
  toTeamId: string;
  playersOffered: string[];
  playersRequested: string[];
  picksOffered?: Array<{
}
    round: number;
    year: number;
  }>;
  picksRequested?: Array<{
}
    round: number;
    year: number;
  }>;
  faabOffered?: number;
  faabRequested?: number;
  message?: string;
  expiresIn?: number; // hours
}

export interface RespondToTradeRequest extends BaseRequest {
}
  tradeId: string;
  action: &apos;ACCEPT&apos; | &apos;REJECT&apos; | &apos;COUNTER&apos;;
  counterOffer?: {
}
    playersOffered: string[];
    playersRequested: string[];
    picksOffered?: Array<{
}
      round: number;
      year: number;
    }>;
    picksRequested?: Array<{
}
      round: number;
      year: number;
    }>;
    faabOffered?: number;
    faabRequested?: number;
  };
  message?: string;
}

export interface CancelTradeRequest extends BaseRequest {
}
  tradeId: string;
  reason?: string;
}

export interface VoteOnTradeRequest extends BaseRequest {
}
  tradeId: string;
  vote: &apos;APPROVE&apos; | &apos;VETO&apos;;
  reason?: string;
}

// ==================== WAIVER REQUESTS ====================

export interface SubmitWaiverClaimRequest extends BaseRequest {
}
  leagueId: string;
  playerId: string;
  bid: number;
  dropPlayerId?: string;
  priority?: number;
}

export interface CancelWaiverClaimRequest extends BaseRequest {
}
  claimId: string;
}

export interface ProcessWaiversRequest extends BaseRequest {
}
  leagueId: string;
  week?: number;
}

export interface UpdateWaiverPriorityRequest extends BaseRequest {
}
  leagueId: string;
  teamId: string;
  claimIds: string[]; // Ordered by priority
}

// ==================== PLAYER REQUESTS ====================

export interface GetPlayersRequest extends PaginatedRequest {
}
  positions?: string[];
  teams?: string[];
  availability?: &apos;AVAILABLE&apos; | &apos;DRAFTED&apos; | &apos;FREE_AGENT&apos; | &apos;WAIVER&apos;;
  minRank?: number;
  maxRank?: number;
  injuryStatus?: string[];
  rookiesOnly?: boolean;
  sleepersOnly?: boolean;
  byeWeeks?: number[];
}

export interface GetPlayerDetailRequest extends BaseRequest {
}
  playerId: string;
  includeStats?: boolean;
  includeNews?: boolean;
  includeComparisons?: boolean;
  season?: number;
}

export interface UpdatePlayerWatchlistRequest extends BaseRequest {
}
  action: &apos;ADD&apos; | &apos;REMOVE&apos;;
  playerId: string;
}

export interface GetPlayerProjectionsRequest extends BaseRequest {
}
  playerIds?: string[];
  positions?: string[];
  week?: number;
  includeWeekly?: boolean;
}

// ==================== ANALYTICS REQUESTS ====================

export interface GetAnalyticsRequest extends BaseRequest {
}
  type: &apos;TEAM&apos; | &apos;PLAYER&apos; | &apos;LEAGUE&apos; | &apos;MATCHUP&apos;;
  entityId: string;
  timeframe?: &apos;WEEK&apos; | &apos;MONTH&apos; | &apos;SEASON&apos; | &apos;ALL_TIME&apos;;
  metrics?: string[];
  compareWith?: string[];
}

export interface GetPredictionsRequest extends BaseRequest {
}
  playerIds?: string[];
  week?: number;
  includeConfidence?: boolean;
  scenario?: &apos;OPTIMISTIC&apos; | &apos;REALISTIC&apos; | &apos;PESSIMISTIC&apos;;
}

export interface UpdateCustomRankingsRequest extends BaseRequest {
}
  leagueId: string;
  rankings: Array<{
}
    playerId: string;
    rank: number;
    position: string;
  }>;
}

// ==================== MESSAGING REQUESTS ====================

export interface SendMessageRequest extends BaseRequest {
}
  type: &apos;LEAGUE_CHAT&apos; | &apos;DIRECT_MESSAGE&apos; | &apos;TRADE_DISCUSSION&apos;;
  targetId: string; // leagueId or userId or tradeId
  content: string;
  attachments?: Array<{
}
    type: &apos;IMAGE&apos; | &apos;FILE&apos; | &apos;LINK&apos;;
    url: string;
    name?: string;
  }>;
  mentions?: string[]; // User IDs
  parentMessageId?: string; // For replies
}

export interface MarkMessagesReadRequest extends BaseRequest {
}
  messageIds: string[];
}

export interface DeleteMessageRequest extends BaseRequest {
}
  messageId: string;
}

// ==================== SEARCH REQUESTS ====================

export interface SearchRequest extends PaginatedRequest {
}
  query: string;
  type: &apos;PLAYERS&apos; | &apos;LEAGUES&apos; | &apos;USERS&apos; | &apos;ALL&apos;;
  filters?: {
}
    positions?: string[];
    availability?: string;
    minRank?: number;
    maxRank?: number;
  };
  includeHighlights?: boolean;
}

// ==================== NOTIFICATION REQUESTS ====================

export interface UpdateNotificationSettingsRequest extends BaseRequest {
}
  email?: Record<string, boolean>;
  push?: Record<string, boolean>;
  inApp?: Record<string, boolean>;
}

export interface MarkNotificationsReadRequest extends BaseRequest {
}
  notificationIds: string[];
}

export interface RegisterPushTokenRequest extends BaseRequest {
}
  token: string;
  platform: &apos;ios&apos; | &apos;android&apos; | &apos;web&apos;;
}

// ==================== FILE UPLOAD REQUESTS ====================

export interface UploadFileRequest extends BaseRequest {
}
  file: File;
  type: &apos;AVATAR&apos; | &apos;LEAGUE_LOGO&apos; | &apos;TEAM_LOGO&apos; | &apos;ATTACHMENT&apos;;
  entityId?: string;
  crop?: {
}
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// ==================== COMMISSIONER REQUESTS ====================

export interface CommissionerActionRequest extends BaseRequest {
}
  leagueId: string;
  action: &apos;FORCE_TRADE&apos; | &apos;REVERSE_TRADE&apos; | &apos;EDIT_ROSTER&apos; | &apos;ADJUST_SCORE&apos; | &apos;RESET_DRAFT&apos; | &apos;KICK_USER&apos;;
  targetId: string; // teamId, tradeId, etc.
  data: Record<string, any>;
  reason: string;
  notifyAffectedUsers?: boolean;
}

export interface UpdateLeagueSettingsRequest extends BaseRequest {
}
  leagueId: string;
  settings: Record<string, any>;
  reason?: string;
}

export interface ProcessCommissionerVoteRequest extends BaseRequest {
}
  leagueId: string;
  voteId: string;
  decision: &apos;APPROVE&apos; | &apos;REJECT&apos;;
  reason?: string;
}

// ==================== EXPORT ALL ====================

export type {
}
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