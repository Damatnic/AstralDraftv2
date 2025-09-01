/**
 * API Endpoint Types
 * Type-safe endpoint definitions with request/response type mappings
 */

import {
  // Request types
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  CreateLeagueRequest,
  GetPlayersRequest,
  MakeDraftPickRequest,
  ProposeTradeRequest,
  SubmitWaiverClaimRequest,
  SendMessageRequest,
  UpdateUserProfileRequest,
  GetAnalyticsRequest,
  SearchRequest,
  UploadFileRequest,
  CommissionerActionRequest,
} from './requests';

import {
  // Response types
  LoginResponse,
  RegisterResponse,
  RefreshTokenResponse,
  CreateLeagueResponse,
  PlayerListResponse,
  DraftPickResponse,
  TradeListResponse,
  WaiverListResponse,
  UserProfileResponse,
  AnalyticsResponse,
  ApiResponse,
  ErrorResponse,
} from './responses';

// ==================== ENDPOINT CONFIGURATION ====================

export interface EndpointConfig {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  authenticated: boolean;
  roles?: string[];
  rateLimit?: {
    requests: number;
    window: number; // seconds
  };
  cache?: {
    ttl: number; // seconds
    tags?: string[];
  };
}

// ==================== TYPE-SAFE ENDPOINT DEFINITIONS ====================

export interface TypedEndpoint<TRequest = void, TResponse = any> extends EndpointConfig {
  requestType?: new () => TRequest;
  responseType?: new () => TResponse;
}

// ==================== AUTHENTICATION ENDPOINTS ====================

export const AuthEndpoints = {
  login: {
    method: 'POST',
    path: '/auth/login',
    authenticated: false,
    rateLimit: { requests: 5, window: 300 },
  } as TypedEndpoint<LoginRequest, LoginResponse>,

  register: {
    method: 'POST',
    path: '/auth/register',
    authenticated: false,
    rateLimit: { requests: 3, window: 3600 },
  } as TypedEndpoint<RegisterRequest, RegisterResponse>,

  logout: {
    method: 'POST',
    path: '/auth/logout',
    authenticated: true,
  } as TypedEndpoint<void, ApiResponse<{ success: boolean }>>,

  refresh: {
    method: 'POST',
    path: '/auth/refresh',
    authenticated: false,
    rateLimit: { requests: 10, window: 300 },
  } as TypedEndpoint<RefreshTokenRequest, RefreshTokenResponse>,

  forgotPassword: {
    method: 'POST',
    path: '/auth/forgot-password',
    authenticated: false,
    rateLimit: { requests: 3, window: 1800 },
  } as TypedEndpoint<{ email: string }, ApiResponse<{ message: string }>>,

  resetPassword: {
    method: 'POST',
    path: '/auth/reset-password',
    authenticated: false,
    rateLimit: { requests: 5, window: 300 },
  } as TypedEndpoint<{ token: string; password: string }, ApiResponse<{ success: boolean }>>,

  verifyEmail: {
    method: 'POST',
    path: '/auth/verify-email',
    authenticated: false,
  } as TypedEndpoint<{ token: string }, ApiResponse<{ verified: boolean }>>,
} as const;

// ==================== USER ENDPOINTS ====================

export const UserEndpoints = {
  getProfile: {
    method: 'GET',
    path: '/users/profile',
    authenticated: true,
    cache: { ttl: 300 },
  } as TypedEndpoint<void, UserProfileResponse>,

  updateProfile: {
    method: 'PATCH',
    path: '/users/profile',
    authenticated: true,
  } as TypedEndpoint<UpdateUserProfileRequest, UserProfileResponse>,

  uploadAvatar: {
    method: 'POST',
    path: '/users/avatar',
    authenticated: true,
  } as TypedEndpoint<UploadFileRequest, ApiResponse<{ avatarUrl: string }>>,

  getStats: {
    method: 'GET',
    path: '/users/stats',
    authenticated: true,
    cache: { ttl: 600 },
  } as TypedEndpoint<void, ApiResponse<any>>,

  getAchievements: {
    method: 'GET',
    path: '/users/achievements',
    authenticated: true,
    cache: { ttl: 1800 },
  } as TypedEndpoint<void, ApiResponse<any[]>>,

  updatePreferences: {
    method: 'PATCH',
    path: '/users/preferences',
    authenticated: true,
  } as TypedEndpoint<any, ApiResponse<any>>,
} as const;

// ==================== LEAGUE ENDPOINTS ====================

export const LeagueEndpoints = {
  list: {
    method: 'GET',
    path: '/leagues',
    authenticated: true,
    cache: { ttl: 60 },
  } as TypedEndpoint<void, ApiResponse<any[]>>,

  create: {
    method: 'POST',
    path: '/leagues',
    authenticated: true,
    rateLimit: { requests: 5, window: 3600 },
  } as TypedEndpoint<CreateLeagueRequest, CreateLeagueResponse>,

  get: {
    method: 'GET',
    path: '/leagues/:id',
    authenticated: true,
    cache: { ttl: 120 },
  } as TypedEndpoint<void, ApiResponse<any>>,

  update: {
    method: 'PATCH',
    path: '/leagues/:id',
    authenticated: true,
    roles: ['COMMISSIONER'],
  } as TypedEndpoint<any, ApiResponse<any>>,

  delete: {
    method: 'DELETE',
    path: '/leagues/:id',
    authenticated: true,
    roles: ['COMMISSIONER'],
  } as TypedEndpoint<void, ApiResponse<{ success: boolean }>>,

  join: {
    method: 'POST',
    path: '/leagues/:id/join',
    authenticated: true,
  } as TypedEndpoint<{ teamName: string; password?: string }, ApiResponse<any>>,

  leave: {
    method: 'POST',
    path: '/leagues/:id/leave',
    authenticated: true,
  } as TypedEndpoint<void, ApiResponse<{ success: boolean }>>,

  invite: {
    method: 'POST',
    path: '/leagues/:id/invite',
    authenticated: true,
    roles: ['COMMISSIONER'],
  } as TypedEndpoint<{ emails: string[] }, ApiResponse<{ invitesSent: number }>>,

  getStandings: {
    method: 'GET',
    path: '/leagues/:id/standings',
    authenticated: true,
    cache: { ttl: 300 },
  } as TypedEndpoint<void, ApiResponse<any>>,

  getSchedule: {
    method: 'GET',
    path: '/leagues/:id/schedule',
    authenticated: true,
    cache: { ttl: 600 },
  } as TypedEndpoint<void, ApiResponse<any[]>>,

  getActivity: {
    method: 'GET',
    path: '/leagues/:id/activity',
    authenticated: true,
    cache: { ttl: 60 },
  } as TypedEndpoint<void, ApiResponse<any[]>>,
} as const;

// ==================== DRAFT ENDPOINTS ====================

export const DraftEndpoints = {
  getState: {
    method: 'GET',
    path: '/drafts/:id',
    authenticated: true,
    cache: { ttl: 5 },
  } as TypedEndpoint<void, ApiResponse<any>>,

  start: {
    method: 'POST',
    path: '/drafts/:id/start',
    authenticated: true,
    roles: ['COMMISSIONER'],
  } as TypedEndpoint<void, ApiResponse<{ started: boolean }>>,

  pause: {
    method: 'POST',
    path: '/drafts/:id/pause',
    authenticated: true,
    roles: ['COMMISSIONER'],
  } as TypedEndpoint<void, ApiResponse<{ paused: boolean }>>,

  resume: {
    method: 'POST',
    path: '/drafts/:id/resume',
    authenticated: true,
    roles: ['COMMISSIONER'],
  } as TypedEndpoint<void, ApiResponse<{ resumed: boolean }>>,

  makePick: {
    method: 'POST',
    path: '/drafts/:id/pick',
    authenticated: true,
  } as TypedEndpoint<MakeDraftPickRequest, DraftPickResponse>,

  updateQueue: {
    method: 'PATCH',
    path: '/drafts/:id/queue',
    authenticated: true,
  } as TypedEndpoint<{ playerIds: string[] }, ApiResponse<{ updated: boolean }>>,

  toggleAutoDraft: {
    method: 'PATCH',
    path: '/drafts/:id/autodraft',
    authenticated: true,
  } as TypedEndpoint<{ enabled: boolean }, ApiResponse<{ enabled: boolean }>>,

  bid: {
    method: 'POST',
    path: '/drafts/:id/bid',
    authenticated: true,
  } as TypedEndpoint<{ playerId: string; amount: number }, ApiResponse<any>>,

  nominate: {
    method: 'POST',
    path: '/drafts/:id/nominate',
    authenticated: true,
  } as TypedEndpoint<{ playerId: string }, ApiResponse<any>>,
} as const;

// ==================== PLAYER ENDPOINTS ====================

export const PlayerEndpoints = {
  list: {
    method: 'GET',
    path: '/players',
    authenticated: true,
    cache: { ttl: 300 },
  } as TypedEndpoint<GetPlayersRequest, PlayerListResponse>,

  get: {
    method: 'GET',
    path: '/players/:id',
    authenticated: true,
    cache: { ttl: 600 },
  } as TypedEndpoint<void, ApiResponse<any>>,

  getStats: {
    method: 'GET',
    path: '/players/:id/stats',
    authenticated: true,
    cache: { ttl: 1800 },
  } as TypedEndpoint<{ season?: number }, ApiResponse<any>>,

  getNews: {
    method: 'GET',
    path: '/players/:id/news',
    authenticated: true,
    cache: { ttl: 300 },
  } as TypedEndpoint<void, ApiResponse<any[]>>,

  getProjections: {
    method: 'GET',
    path: '/players/:id/projections',
    authenticated: true,
    cache: { ttl: 3600 },
  } as TypedEndpoint<{ week?: number }, ApiResponse<any>>,

  search: {
    method: 'GET',
    path: '/players/search',
    authenticated: true,
    cache: { ttl: 180 },
  } as TypedEndpoint<SearchRequest, PlayerListResponse>,

  compare: {
    method: 'POST',
    path: '/players/compare',
    authenticated: true,
  } as TypedEndpoint<{ playerIds: string[] }, ApiResponse<any>>,

  watchlist: {
    method: 'GET',
    path: '/players/watchlist',
    authenticated: true,
  } as TypedEndpoint<void, ApiResponse<any[]>>,

  addToWatchlist: {
    method: 'POST',
    path: '/players/:id/watchlist',
    authenticated: true,
  } as TypedEndpoint<void, ApiResponse<{ added: boolean }>>,

  removeFromWatchlist: {
    method: 'DELETE',
    path: '/players/:id/watchlist',
    authenticated: true,
  } as TypedEndpoint<void, ApiResponse<{ removed: boolean }>>,
} as const;

// ==================== TRADE ENDPOINTS ====================

export const TradeEndpoints = {
  list: {
    method: 'GET',
    path: '/leagues/:leagueId/trades',
    authenticated: true,
    cache: { ttl: 60 },
  } as TypedEndpoint<void, TradeListResponse>,

  propose: {
    method: 'POST',
    path: '/leagues/:leagueId/trades',
    authenticated: true,
    rateLimit: { requests: 10, window: 3600 },
  } as TypedEndpoint<ProposeTradeRequest, ApiResponse<any>>,

  get: {
    method: 'GET',
    path: '/trades/:id',
    authenticated: true,
  } as TypedEndpoint<void, ApiResponse<any>>,

  respond: {
    method: 'POST',
    path: '/trades/:id/respond',
    authenticated: true,
  } as TypedEndpoint<{ action: 'ACCEPT' | 'REJECT' | 'COUNTER' }, ApiResponse<any>>,

  cancel: {
    method: 'DELETE',
    path: '/trades/:id',
    authenticated: true,
  } as TypedEndpoint<void, ApiResponse<{ cancelled: boolean }>>,

  analyze: {
    method: 'POST',
    path: '/trades/:id/analyze',
    authenticated: true,
  } as TypedEndpoint<void, ApiResponse<any>>,

  vote: {
    method: 'POST',
    path: '/trades/:id/vote',
    authenticated: true,
  } as TypedEndpoint<{ vote: 'APPROVE' | 'VETO' }, ApiResponse<{ voted: boolean }>>,

  history: {
    method: 'GET',
    path: '/leagues/:leagueId/trades/history',
    authenticated: true,
    cache: { ttl: 3600 },
  } as TypedEndpoint<void, ApiResponse<any[]>>,
} as const;

// ==================== WAIVER ENDPOINTS ====================

export const WaiverEndpoints = {
  list: {
    method: 'GET',
    path: '/leagues/:leagueId/waivers',
    authenticated: true,
    cache: { ttl: 60 },
  } as TypedEndpoint<void, WaiverListResponse>,

  submit: {
    method: 'POST',
    path: '/leagues/:leagueId/waivers',
    authenticated: true,
    rateLimit: { requests: 20, window: 3600 },
  } as TypedEndpoint<SubmitWaiverClaimRequest, ApiResponse<any>>,

  cancel: {
    method: 'DELETE',
    path: '/waivers/:id',
    authenticated: true,
  } as TypedEndpoint<void, ApiResponse<{ cancelled: boolean }>>,

  process: {
    method: 'POST',
    path: '/leagues/:leagueId/waivers/process',
    authenticated: true,
    roles: ['COMMISSIONER'],
  } as TypedEndpoint<void, ApiResponse<{ processed: number }>>,

  advice: {
    method: 'POST',
    path: '/waivers/advice',
    authenticated: true,
  } as TypedEndpoint<{ playerId: string; teamId: string }, ApiResponse<any>>,

  priority: {
    method: 'GET',
    path: '/leagues/:leagueId/waivers/priority',
    authenticated: true,
  } as TypedEndpoint<void, ApiResponse<any[]>>,

  updatePriority: {
    method: 'PATCH',
    path: '/leagues/:leagueId/waivers/priority',
    authenticated: true,
    roles: ['COMMISSIONER'],
  } as TypedEndpoint<{ order: string[] }, ApiResponse<{ updated: boolean }>>,
} as const;

// ==================== ANALYTICS ENDPOINTS ====================

export const AnalyticsEndpoints = {
  team: {
    method: 'GET',
    path: '/analytics/teams/:id',
    authenticated: true,
    cache: { ttl: 600 },
  } as TypedEndpoint<GetAnalyticsRequest, AnalyticsResponse>,

  player: {
    method: 'GET',
    path: '/analytics/players/:id',
    authenticated: true,
    cache: { ttl: 1800 },
  } as TypedEndpoint<GetAnalyticsRequest, AnalyticsResponse>,

  league: {
    method: 'GET',
    path: '/analytics/leagues/:id',
    authenticated: true,
    cache: { ttl: 600 },
  } as TypedEndpoint<GetAnalyticsRequest, AnalyticsResponse>,

  predictions: {
    method: 'GET',
    path: '/analytics/predictions',
    authenticated: true,
    cache: { ttl: 1800 },
  } as TypedEndpoint<{ playerIds?: string[]; week?: number }, ApiResponse<any[]>>,

  trends: {
    method: 'GET',
    path: '/analytics/trends',
    authenticated: true,
    cache: { ttl: 3600 },
  } as TypedEndpoint<{ type: string; timeframe: string }, ApiResponse<any>>,

  powerRankings: {
    method: 'GET',
    path: '/analytics/leagues/:id/power-rankings',
    authenticated: true,
    cache: { ttl: 86400 },
  } as TypedEndpoint<{ week?: number }, ApiResponse<any[]>>,

  lineupOptimizer: {
    method: 'POST',
    path: '/analytics/lineup-optimizer',
    authenticated: true,
  } as TypedEndpoint<{ teamId: string; week: number }, ApiResponse<any>>,

  projections: {
    method: 'GET',
    path: '/analytics/projections',
    authenticated: true,
    cache: { ttl: 7200 },
  } as TypedEndpoint<{ week?: number; position?: string }, ApiResponse<any[]>>,
} as const;

// ==================== MESSAGE ENDPOINTS ====================

export const MessageEndpoints = {
  leagueChat: {
    method: 'GET',
    path: '/leagues/:leagueId/messages',
    authenticated: true,
    cache: { ttl: 30 },
  } as TypedEndpoint<void, ApiResponse<any[]>>,

  directMessages: {
    method: 'GET',
    path: '/messages/:userId',
    authenticated: true,
    cache: { ttl: 30 },
  } as TypedEndpoint<void, ApiResponse<any[]>>,

  send: {
    method: 'POST',
    path: '/messages',
    authenticated: true,
    rateLimit: { requests: 30, window: 300 },
  } as TypedEndpoint<SendMessageRequest, ApiResponse<any>>,

  markRead: {
    method: 'PATCH',
    path: '/messages/read',
    authenticated: true,
  } as TypedEndpoint<{ messageIds: string[] }, ApiResponse<{ marked: number }>>,

  delete: {
    method: 'DELETE',
    path: '/messages/:id',
    authenticated: true,
  } as TypedEndpoint<void, ApiResponse<{ deleted: boolean }>>,

  getConversations: {
    method: 'GET',
    path: '/messages/conversations',
    authenticated: true,
    cache: { ttl: 60 },
  } as TypedEndpoint<void, ApiResponse<any[]>>,
} as const;

// ==================== NOTIFICATION ENDPOINTS ====================

export const NotificationEndpoints = {
  list: {
    method: 'GET',
    path: '/notifications',
    authenticated: true,
    cache: { ttl: 30 },
  } as TypedEndpoint<void, ApiResponse<any[]>>,

  markRead: {
    method: 'PATCH',
    path: '/notifications/read',
    authenticated: true,
  } as TypedEndpoint<{ notificationIds: string[] }, ApiResponse<{ marked: number }>>,

  markAllRead: {
    method: 'PATCH',
    path: '/notifications/read-all',
    authenticated: true,
  } as TypedEndpoint<void, ApiResponse<{ marked: number }>>,

  updateSettings: {
    method: 'PATCH',
    path: '/notifications/settings',
    authenticated: true,
  } as TypedEndpoint<any, ApiResponse<any>>,

  registerPushToken: {
    method: 'POST',
    path: '/notifications/push-token',
    authenticated: true,
  } as TypedEndpoint<{ token: string; platform: string }, ApiResponse<{ registered: boolean }>>,
} as const;

// ==================== FILE UPLOAD ENDPOINTS ====================

export const FileEndpoints = {
  upload: {
    method: 'POST',
    path: '/files/upload',
    authenticated: true,
    rateLimit: { requests: 20, window: 3600 },
  } as TypedEndpoint<UploadFileRequest, ApiResponse<{ url: string; id: string }>>,

  get: {
    method: 'GET',
    path: '/files/:id',
    authenticated: false,
    cache: { ttl: 86400 },
  } as TypedEndpoint<void, any>,

  delete: {
    method: 'DELETE',
    path: '/files/:id',
    authenticated: true,
  } as TypedEndpoint<void, ApiResponse<{ deleted: boolean }>>,
} as const;

// ==================== COMMISSIONER ENDPOINTS ====================

export const CommissionerEndpoints = {
  forceAction: {
    method: 'POST',
    path: '/commissioner/:leagueId/force-action',
    authenticated: true,
    roles: ['COMMISSIONER'],
  } as TypedEndpoint<CommissionerActionRequest, ApiResponse<{ success: boolean }>>,

  editRoster: {
    method: 'PATCH',
    path: '/commissioner/:leagueId/rosters/:teamId',
    authenticated: true,
    roles: ['COMMISSIONER'],
  } as TypedEndpoint<any, ApiResponse<{ updated: boolean }>>,

  adjustScore: {
    method: 'PATCH',
    path: '/commissioner/:leagueId/scores/:matchupId',
    authenticated: true,
    roles: ['COMMISSIONER'],
  } as TypedEndpoint<{ adjustments: Record<string, number> }, ApiResponse<{ adjusted: boolean }>>,

  manageTrade: {
    method: 'PATCH',
    path: '/commissioner/trades/:tradeId',
    authenticated: true,
    roles: ['COMMISSIONER'],
  } as TypedEndpoint<{ action: 'APPROVE' | 'VETO' | 'REVERSE' }, ApiResponse<{ success: boolean }>>,

  kickUser: {
    method: 'DELETE',
    path: '/commissioner/:leagueId/members/:userId',
    authenticated: true,
    roles: ['COMMISSIONER'],
  } as TypedEndpoint<{ reason: string }, ApiResponse<{ removed: boolean }>>,

  resetDraft: {
    method: 'POST',
    path: '/commissioner/:leagueId/draft/reset',
    authenticated: true,
    roles: ['COMMISSIONER'],
  } as TypedEndpoint<void, ApiResponse<{ reset: boolean }>>,

  updateSettings: {
    method: 'PATCH',
    path: '/commissioner/:leagueId/settings',
    authenticated: true,
    roles: ['COMMISSIONER'],
  } as TypedEndpoint<any, ApiResponse<{ updated: boolean }>>,
} as const;

// ==================== HEALTH CHECK ENDPOINT ====================

export const SystemEndpoints = {
  health: {
    method: 'GET',
    path: '/health',
    authenticated: false,
    cache: { ttl: 30 },
  } as TypedEndpoint<void, ApiResponse<any>>,

  version: {
    method: 'GET',
    path: '/version',
    authenticated: false,
    cache: { ttl: 3600 },
  } as TypedEndpoint<void, ApiResponse<{ version: string; build: string }>>,

  status: {
    method: 'GET',
    path: '/status',
    authenticated: false,
    cache: { ttl: 60 },
  } as TypedEndpoint<void, ApiResponse<any>>,
} as const;

// ==================== ENDPOINT COLLECTIONS ====================

export const AllEndpoints = {
  auth: AuthEndpoints,
  users: UserEndpoints,
  leagues: LeagueEndpoints,
  drafts: DraftEndpoints,
  players: PlayerEndpoints,
  trades: TradeEndpoints,
  waivers: WaiverEndpoints,
  analytics: AnalyticsEndpoints,
  messages: MessageEndpoints,
  notifications: NotificationEndpoints,
  files: FileEndpoints,
  commissioner: CommissionerEndpoints,
  system: SystemEndpoints,
} as const;

// ==================== UTILITY TYPES ====================

export type EndpointPath = string;
export type EndpointMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiEndpoint {
  method: EndpointMethod;
  path: EndpointPath;
  authenticated: boolean;
  roles?: string[];
}

// ==================== EXPORT ALL ====================

export type {
  EndpointConfig,
  TypedEndpoint,
  EndpointPath,
  EndpointMethod,
  ApiEndpoint,
};

export {
  AuthEndpoints,
  UserEndpoints,
  LeagueEndpoints,
  DraftEndpoints,
  PlayerEndpoints,
  TradeEndpoints,
  WaiverEndpoints,
  AnalyticsEndpoints,
  MessageEndpoints,
  NotificationEndpoints,
  FileEndpoints,
  CommissionerEndpoints,
  SystemEndpoints,
  AllEndpoints,
};