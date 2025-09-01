/**
 * API Endpoint Types
 * Type-safe endpoint definitions with request/response type mappings
 */

import {
}
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
} from &apos;./requests&apos;;

import {
}
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
} from &apos;./responses&apos;;

// ==================== ENDPOINT CONFIGURATION ====================

export interface EndpointConfig {
}
  method: &apos;GET&apos; | &apos;POST&apos; | &apos;PUT&apos; | &apos;PATCH&apos; | &apos;DELETE&apos;;
  path: string;
  authenticated: boolean;
  roles?: string[];
  rateLimit?: {
}
    requests: number;
    window: number; // seconds
  };
  cache?: {
}
    ttl: number; // seconds
    tags?: string[];
  };
}

// ==================== TYPE-SAFE ENDPOINT DEFINITIONS ====================

export interface TypedEndpoint<TRequest = void, TResponse = any> extends EndpointConfig {
}
  requestType?: new () => TRequest;
  responseType?: new () => TResponse;
}

// ==================== AUTHENTICATION ENDPOINTS ====================

export const AuthEndpoints = {
}
  login: {
}
    method: &apos;POST&apos;,
    path: &apos;/auth/login&apos;,
    authenticated: false,
    rateLimit: { requests: 5, window: 300 },
  } as TypedEndpoint<LoginRequest, LoginResponse>,

  register: {
}
    method: &apos;POST&apos;,
    path: &apos;/auth/register&apos;,
    authenticated: false,
    rateLimit: { requests: 3, window: 3600 },
  } as TypedEndpoint<RegisterRequest, RegisterResponse>,

  logout: {
}
    method: &apos;POST&apos;,
    path: &apos;/auth/logout&apos;,
    authenticated: true,
  } as TypedEndpoint<void, ApiResponse<{ success: boolean }>>,

  refresh: {
}
    method: &apos;POST&apos;,
    path: &apos;/auth/refresh&apos;,
    authenticated: false,
    rateLimit: { requests: 10, window: 300 },
  } as TypedEndpoint<RefreshTokenRequest, RefreshTokenResponse>,

  forgotPassword: {
}
    method: &apos;POST&apos;,
    path: &apos;/auth/forgot-password&apos;,
    authenticated: false,
    rateLimit: { requests: 3, window: 1800 },
  } as TypedEndpoint<{ email: string }, ApiResponse<{ message: string }>>,

  resetPassword: {
}
    method: &apos;POST&apos;,
    path: &apos;/auth/reset-password&apos;,
    authenticated: false,
    rateLimit: { requests: 5, window: 300 },
  } as TypedEndpoint<{ token: string; password: string }, ApiResponse<{ success: boolean }>>,

  verifyEmail: {
}
    method: &apos;POST&apos;,
    path: &apos;/auth/verify-email&apos;,
    authenticated: false,
  } as TypedEndpoint<{ token: string }, ApiResponse<{ verified: boolean }>>,
} as const;

// ==================== USER ENDPOINTS ====================

export const UserEndpoints = {
}
  getProfile: {
}
    method: &apos;GET&apos;,
    path: &apos;/users/profile&apos;,
    authenticated: true,
    cache: { ttl: 300 },
  } as TypedEndpoint<void, UserProfileResponse>,

  updateProfile: {
}
    method: &apos;PATCH&apos;,
    path: &apos;/users/profile&apos;,
    authenticated: true,
  } as TypedEndpoint<UpdateUserProfileRequest, UserProfileResponse>,

  uploadAvatar: {
}
    method: &apos;POST&apos;,
    path: &apos;/users/avatar&apos;,
    authenticated: true,
  } as TypedEndpoint<UploadFileRequest, ApiResponse<{ avatarUrl: string }>>,

  getStats: {
}
    method: &apos;GET&apos;,
    path: &apos;/users/stats&apos;,
    authenticated: true,
    cache: { ttl: 600 },
  } as TypedEndpoint<void, ApiResponse<any>>,

  getAchievements: {
}
    method: &apos;GET&apos;,
    path: &apos;/users/achievements&apos;,
    authenticated: true,
    cache: { ttl: 1800 },
  } as TypedEndpoint<void, ApiResponse<any[]>>,

  updatePreferences: {
}
    method: &apos;PATCH&apos;,
    path: &apos;/users/preferences&apos;,
    authenticated: true,
  } as TypedEndpoint<any, ApiResponse<any>>,
} as const;

// ==================== LEAGUE ENDPOINTS ====================

export const LeagueEndpoints = {
}
  list: {
}
    method: &apos;GET&apos;,
    path: &apos;/leagues&apos;,
    authenticated: true,
    cache: { ttl: 60 },
  } as TypedEndpoint<void, ApiResponse<any[]>>,

  create: {
}
    method: &apos;POST&apos;,
    path: &apos;/leagues&apos;,
    authenticated: true,
    rateLimit: { requests: 5, window: 3600 },
  } as TypedEndpoint<CreateLeagueRequest, CreateLeagueResponse>,

  get: {
}
    method: &apos;GET&apos;,
    path: &apos;/leagues/:id&apos;,
    authenticated: true,
    cache: { ttl: 120 },
  } as TypedEndpoint<void, ApiResponse<any>>,

  update: {
}
    method: &apos;PATCH&apos;,
    path: &apos;/leagues/:id&apos;,
    authenticated: true,
    roles: [&apos;COMMISSIONER&apos;],
  } as TypedEndpoint<any, ApiResponse<any>>,

  delete: {
}
    method: &apos;DELETE&apos;,
    path: &apos;/leagues/:id&apos;,
    authenticated: true,
    roles: [&apos;COMMISSIONER&apos;],
  } as TypedEndpoint<void, ApiResponse<{ success: boolean }>>,

  join: {
}
    method: &apos;POST&apos;,
    path: &apos;/leagues/:id/join&apos;,
    authenticated: true,
  } as TypedEndpoint<{ teamName: string; password?: string }, ApiResponse<any>>,

  leave: {
}
    method: &apos;POST&apos;,
    path: &apos;/leagues/:id/leave&apos;,
    authenticated: true,
  } as TypedEndpoint<void, ApiResponse<{ success: boolean }>>,

  invite: {
}
    method: &apos;POST&apos;,
    path: &apos;/leagues/:id/invite&apos;,
    authenticated: true,
    roles: [&apos;COMMISSIONER&apos;],
  } as TypedEndpoint<{ emails: string[] }, ApiResponse<{ invitesSent: number }>>,

  getStandings: {
}
    method: &apos;GET&apos;,
    path: &apos;/leagues/:id/standings&apos;,
    authenticated: true,
    cache: { ttl: 300 },
  } as TypedEndpoint<void, ApiResponse<any>>,

  getSchedule: {
}
    method: &apos;GET&apos;,
    path: &apos;/leagues/:id/schedule&apos;,
    authenticated: true,
    cache: { ttl: 600 },
  } as TypedEndpoint<void, ApiResponse<any[]>>,

  getActivity: {
}
    method: &apos;GET&apos;,
    path: &apos;/leagues/:id/activity&apos;,
    authenticated: true,
    cache: { ttl: 60 },
  } as TypedEndpoint<void, ApiResponse<any[]>>,
} as const;

// ==================== DRAFT ENDPOINTS ====================

export const DraftEndpoints = {
}
  getState: {
}
    method: &apos;GET&apos;,
    path: &apos;/drafts/:id&apos;,
    authenticated: true,
    cache: { ttl: 5 },
  } as TypedEndpoint<void, ApiResponse<any>>,

  start: {
}
    method: &apos;POST&apos;,
    path: &apos;/drafts/:id/start&apos;,
    authenticated: true,
    roles: [&apos;COMMISSIONER&apos;],
  } as TypedEndpoint<void, ApiResponse<{ started: boolean }>>,

  pause: {
}
    method: &apos;POST&apos;,
    path: &apos;/drafts/:id/pause&apos;,
    authenticated: true,
    roles: [&apos;COMMISSIONER&apos;],
  } as TypedEndpoint<void, ApiResponse<{ paused: boolean }>>,

  resume: {
}
    method: &apos;POST&apos;,
    path: &apos;/drafts/:id/resume&apos;,
    authenticated: true,
    roles: [&apos;COMMISSIONER&apos;],
  } as TypedEndpoint<void, ApiResponse<{ resumed: boolean }>>,

  makePick: {
}
    method: &apos;POST&apos;,
    path: &apos;/drafts/:id/pick&apos;,
    authenticated: true,
  } as TypedEndpoint<MakeDraftPickRequest, DraftPickResponse>,

  updateQueue: {
}
    method: &apos;PATCH&apos;,
    path: &apos;/drafts/:id/queue&apos;,
    authenticated: true,
  } as TypedEndpoint<{ playerIds: string[] }, ApiResponse<{ updated: boolean }>>,

  toggleAutoDraft: {
}
    method: &apos;PATCH&apos;,
    path: &apos;/drafts/:id/autodraft&apos;,
    authenticated: true,
  } as TypedEndpoint<{ enabled: boolean }, ApiResponse<{ enabled: boolean }>>,

  bid: {
}
    method: &apos;POST&apos;,
    path: &apos;/drafts/:id/bid&apos;,
    authenticated: true,
  } as TypedEndpoint<{ playerId: string; amount: number }, ApiResponse<any>>,

  nominate: {
}
    method: &apos;POST&apos;,
    path: &apos;/drafts/:id/nominate&apos;,
    authenticated: true,
  } as TypedEndpoint<{ playerId: string }, ApiResponse<any>>,
} as const;

// ==================== PLAYER ENDPOINTS ====================

export const PlayerEndpoints = {
}
  list: {
}
    method: &apos;GET&apos;,
    path: &apos;/players&apos;,
    authenticated: true,
    cache: { ttl: 300 },
  } as TypedEndpoint<GetPlayersRequest, PlayerListResponse>,

  get: {
}
    method: &apos;GET&apos;,
    path: &apos;/players/:id&apos;,
    authenticated: true,
    cache: { ttl: 600 },
  } as TypedEndpoint<void, ApiResponse<any>>,

  getStats: {
}
    method: &apos;GET&apos;,
    path: &apos;/players/:id/stats&apos;,
    authenticated: true,
    cache: { ttl: 1800 },
  } as TypedEndpoint<{ season?: number }, ApiResponse<any>>,

  getNews: {
}
    method: &apos;GET&apos;,
    path: &apos;/players/:id/news&apos;,
    authenticated: true,
    cache: { ttl: 300 },
  } as TypedEndpoint<void, ApiResponse<any[]>>,

  getProjections: {
}
    method: &apos;GET&apos;,
    path: &apos;/players/:id/projections&apos;,
    authenticated: true,
    cache: { ttl: 3600 },
  } as TypedEndpoint<{ week?: number }, ApiResponse<any>>,

  search: {
}
    method: &apos;GET&apos;,
    path: &apos;/players/search&apos;,
    authenticated: true,
    cache: { ttl: 180 },
  } as TypedEndpoint<SearchRequest, PlayerListResponse>,

  compare: {
}
    method: &apos;POST&apos;,
    path: &apos;/players/compare&apos;,
    authenticated: true,
  } as TypedEndpoint<{ playerIds: string[] }, ApiResponse<any>>,

  watchlist: {
}
    method: &apos;GET&apos;,
    path: &apos;/players/watchlist&apos;,
    authenticated: true,
  } as TypedEndpoint<void, ApiResponse<any[]>>,

  addToWatchlist: {
}
    method: &apos;POST&apos;,
    path: &apos;/players/:id/watchlist&apos;,
    authenticated: true,
  } as TypedEndpoint<void, ApiResponse<{ added: boolean }>>,

  removeFromWatchlist: {
}
    method: &apos;DELETE&apos;,
    path: &apos;/players/:id/watchlist&apos;,
    authenticated: true,
  } as TypedEndpoint<void, ApiResponse<{ removed: boolean }>>,
} as const;

// ==================== TRADE ENDPOINTS ====================

export const TradeEndpoints = {
}
  list: {
}
    method: &apos;GET&apos;,
    path: &apos;/leagues/:leagueId/trades&apos;,
    authenticated: true,
    cache: { ttl: 60 },
  } as TypedEndpoint<void, TradeListResponse>,

  propose: {
}
    method: &apos;POST&apos;,
    path: &apos;/leagues/:leagueId/trades&apos;,
    authenticated: true,
    rateLimit: { requests: 10, window: 3600 },
  } as TypedEndpoint<ProposeTradeRequest, ApiResponse<any>>,

  get: {
}
    method: &apos;GET&apos;,
    path: &apos;/trades/:id&apos;,
    authenticated: true,
  } as TypedEndpoint<void, ApiResponse<any>>,

  respond: {
}
    method: &apos;POST&apos;,
    path: &apos;/trades/:id/respond&apos;,
    authenticated: true,
  } as TypedEndpoint<{ action: &apos;ACCEPT&apos; | &apos;REJECT&apos; | &apos;COUNTER&apos; }, ApiResponse<any>>,

  cancel: {
}
    method: &apos;DELETE&apos;,
    path: &apos;/trades/:id&apos;,
    authenticated: true,
  } as TypedEndpoint<void, ApiResponse<{ cancelled: boolean }>>,

  analyze: {
}
    method: &apos;POST&apos;,
    path: &apos;/trades/:id/analyze&apos;,
    authenticated: true,
  } as TypedEndpoint<void, ApiResponse<any>>,

  vote: {
}
    method: &apos;POST&apos;,
    path: &apos;/trades/:id/vote&apos;,
    authenticated: true,
  } as TypedEndpoint<{ vote: &apos;APPROVE&apos; | &apos;VETO&apos; }, ApiResponse<{ voted: boolean }>>,

  history: {
}
    method: &apos;GET&apos;,
    path: &apos;/leagues/:leagueId/trades/history&apos;,
    authenticated: true,
    cache: { ttl: 3600 },
  } as TypedEndpoint<void, ApiResponse<any[]>>,
} as const;

// ==================== WAIVER ENDPOINTS ====================

export const WaiverEndpoints = {
}
  list: {
}
    method: &apos;GET&apos;,
    path: &apos;/leagues/:leagueId/waivers&apos;,
    authenticated: true,
    cache: { ttl: 60 },
  } as TypedEndpoint<void, WaiverListResponse>,

  submit: {
}
    method: &apos;POST&apos;,
    path: &apos;/leagues/:leagueId/waivers&apos;,
    authenticated: true,
    rateLimit: { requests: 20, window: 3600 },
  } as TypedEndpoint<SubmitWaiverClaimRequest, ApiResponse<any>>,

  cancel: {
}
    method: &apos;DELETE&apos;,
    path: &apos;/waivers/:id&apos;,
    authenticated: true,
  } as TypedEndpoint<void, ApiResponse<{ cancelled: boolean }>>,

  process: {
}
    method: &apos;POST&apos;,
    path: &apos;/leagues/:leagueId/waivers/process&apos;,
    authenticated: true,
    roles: [&apos;COMMISSIONER&apos;],
  } as TypedEndpoint<void, ApiResponse<{ processed: number }>>,

  advice: {
}
    method: &apos;POST&apos;,
    path: &apos;/waivers/advice&apos;,
    authenticated: true,
  } as TypedEndpoint<{ playerId: string; teamId: string }, ApiResponse<any>>,

  priority: {
}
    method: &apos;GET&apos;,
    path: &apos;/leagues/:leagueId/waivers/priority&apos;,
    authenticated: true,
  } as TypedEndpoint<void, ApiResponse<any[]>>,

  updatePriority: {
}
    method: &apos;PATCH&apos;,
    path: &apos;/leagues/:leagueId/waivers/priority&apos;,
    authenticated: true,
    roles: [&apos;COMMISSIONER&apos;],
  } as TypedEndpoint<{ order: string[] }, ApiResponse<{ updated: boolean }>>,
} as const;

// ==================== ANALYTICS ENDPOINTS ====================

export const AnalyticsEndpoints = {
}
  team: {
}
    method: &apos;GET&apos;,
    path: &apos;/analytics/teams/:id&apos;,
    authenticated: true,
    cache: { ttl: 600 },
  } as TypedEndpoint<GetAnalyticsRequest, AnalyticsResponse>,

  player: {
}
    method: &apos;GET&apos;,
    path: &apos;/analytics/players/:id&apos;,
    authenticated: true,
    cache: { ttl: 1800 },
  } as TypedEndpoint<GetAnalyticsRequest, AnalyticsResponse>,

  league: {
}
    method: &apos;GET&apos;,
    path: &apos;/analytics/leagues/:id&apos;,
    authenticated: true,
    cache: { ttl: 600 },
  } as TypedEndpoint<GetAnalyticsRequest, AnalyticsResponse>,

  predictions: {
}
    method: &apos;GET&apos;,
    path: &apos;/analytics/predictions&apos;,
    authenticated: true,
    cache: { ttl: 1800 },
  } as TypedEndpoint<{ playerIds?: string[]; week?: number }, ApiResponse<any[]>>,

  trends: {
}
    method: &apos;GET&apos;,
    path: &apos;/analytics/trends&apos;,
    authenticated: true,
    cache: { ttl: 3600 },
  } as TypedEndpoint<{ type: string; timeframe: string }, ApiResponse<any>>,

  powerRankings: {
}
    method: &apos;GET&apos;,
    path: &apos;/analytics/leagues/:id/power-rankings&apos;,
    authenticated: true,
    cache: { ttl: 86400 },
  } as TypedEndpoint<{ week?: number }, ApiResponse<any[]>>,

  lineupOptimizer: {
}
    method: &apos;POST&apos;,
    path: &apos;/analytics/lineup-optimizer&apos;,
    authenticated: true,
  } as TypedEndpoint<{ teamId: string; week: number }, ApiResponse<any>>,

  projections: {
}
    method: &apos;GET&apos;,
    path: &apos;/analytics/projections&apos;,
    authenticated: true,
    cache: { ttl: 7200 },
  } as TypedEndpoint<{ week?: number; position?: string }, ApiResponse<any[]>>,
} as const;

// ==================== MESSAGE ENDPOINTS ====================

export const MessageEndpoints = {
}
  leagueChat: {
}
    method: &apos;GET&apos;,
    path: &apos;/leagues/:leagueId/messages&apos;,
    authenticated: true,
    cache: { ttl: 30 },
  } as TypedEndpoint<void, ApiResponse<any[]>>,

  directMessages: {
}
    method: &apos;GET&apos;,
    path: &apos;/messages/:userId&apos;,
    authenticated: true,
    cache: { ttl: 30 },
  } as TypedEndpoint<void, ApiResponse<any[]>>,

  send: {
}
    method: &apos;POST&apos;,
    path: &apos;/messages&apos;,
    authenticated: true,
    rateLimit: { requests: 30, window: 300 },
  } as TypedEndpoint<SendMessageRequest, ApiResponse<any>>,

  markRead: {
}
    method: &apos;PATCH&apos;,
    path: &apos;/messages/read&apos;,
    authenticated: true,
  } as TypedEndpoint<{ messageIds: string[] }, ApiResponse<{ marked: number }>>,

  delete: {
}
    method: &apos;DELETE&apos;,
    path: &apos;/messages/:id&apos;,
    authenticated: true,
  } as TypedEndpoint<void, ApiResponse<{ deleted: boolean }>>,

  getConversations: {
}
    method: &apos;GET&apos;,
    path: &apos;/messages/conversations&apos;,
    authenticated: true,
    cache: { ttl: 60 },
  } as TypedEndpoint<void, ApiResponse<any[]>>,
} as const;

// ==================== NOTIFICATION ENDPOINTS ====================

export const NotificationEndpoints = {
}
  list: {
}
    method: &apos;GET&apos;,
    path: &apos;/notifications&apos;,
    authenticated: true,
    cache: { ttl: 30 },
  } as TypedEndpoint<void, ApiResponse<any[]>>,

  markRead: {
}
    method: &apos;PATCH&apos;,
    path: &apos;/notifications/read&apos;,
    authenticated: true,
  } as TypedEndpoint<{ notificationIds: string[] }, ApiResponse<{ marked: number }>>,

  markAllRead: {
}
    method: &apos;PATCH&apos;,
    path: &apos;/notifications/read-all&apos;,
    authenticated: true,
  } as TypedEndpoint<void, ApiResponse<{ marked: number }>>,

  updateSettings: {
}
    method: &apos;PATCH&apos;,
    path: &apos;/notifications/settings&apos;,
    authenticated: true,
  } as TypedEndpoint<any, ApiResponse<any>>,

  registerPushToken: {
}
    method: &apos;POST&apos;,
    path: &apos;/notifications/push-token&apos;,
    authenticated: true,
  } as TypedEndpoint<{ token: string; platform: string }, ApiResponse<{ registered: boolean }>>,
} as const;

// ==================== FILE UPLOAD ENDPOINTS ====================

export const FileEndpoints = {
}
  upload: {
}
    method: &apos;POST&apos;,
    path: &apos;/files/upload&apos;,
    authenticated: true,
    rateLimit: { requests: 20, window: 3600 },
  } as TypedEndpoint<UploadFileRequest, ApiResponse<{ url: string; id: string }>>,

  get: {
}
    method: &apos;GET&apos;,
    path: &apos;/files/:id&apos;,
    authenticated: false,
    cache: { ttl: 86400 },
  } as TypedEndpoint<void, any>,

  delete: {
}
    method: &apos;DELETE&apos;,
    path: &apos;/files/:id&apos;,
    authenticated: true,
  } as TypedEndpoint<void, ApiResponse<{ deleted: boolean }>>,
} as const;

// ==================== COMMISSIONER ENDPOINTS ====================

export const CommissionerEndpoints = {
}
  forceAction: {
}
    method: &apos;POST&apos;,
    path: &apos;/commissioner/:leagueId/force-action&apos;,
    authenticated: true,
    roles: [&apos;COMMISSIONER&apos;],
  } as TypedEndpoint<CommissionerActionRequest, ApiResponse<{ success: boolean }>>,

  editRoster: {
}
    method: &apos;PATCH&apos;,
    path: &apos;/commissioner/:leagueId/rosters/:teamId&apos;,
    authenticated: true,
    roles: [&apos;COMMISSIONER&apos;],
  } as TypedEndpoint<any, ApiResponse<{ updated: boolean }>>,

  adjustScore: {
}
    method: &apos;PATCH&apos;,
    path: &apos;/commissioner/:leagueId/scores/:matchupId&apos;,
    authenticated: true,
    roles: [&apos;COMMISSIONER&apos;],
  } as TypedEndpoint<{ adjustments: Record<string, number> }, ApiResponse<{ adjusted: boolean }>>,

  manageTrade: {
}
    method: &apos;PATCH&apos;,
    path: &apos;/commissioner/trades/:tradeId&apos;,
    authenticated: true,
    roles: [&apos;COMMISSIONER&apos;],
  } as TypedEndpoint<{ action: &apos;APPROVE&apos; | &apos;VETO&apos; | &apos;REVERSE&apos; }, ApiResponse<{ success: boolean }>>,

  kickUser: {
}
    method: &apos;DELETE&apos;,
    path: &apos;/commissioner/:leagueId/members/:userId&apos;,
    authenticated: true,
    roles: [&apos;COMMISSIONER&apos;],
  } as TypedEndpoint<{ reason: string }, ApiResponse<{ removed: boolean }>>,

  resetDraft: {
}
    method: &apos;POST&apos;,
    path: &apos;/commissioner/:leagueId/draft/reset&apos;,
    authenticated: true,
    roles: [&apos;COMMISSIONER&apos;],
  } as TypedEndpoint<void, ApiResponse<{ reset: boolean }>>,

  updateSettings: {
}
    method: &apos;PATCH&apos;,
    path: &apos;/commissioner/:leagueId/settings&apos;,
    authenticated: true,
    roles: [&apos;COMMISSIONER&apos;],
  } as TypedEndpoint<any, ApiResponse<{ updated: boolean }>>,
} as const;

// ==================== HEALTH CHECK ENDPOINT ====================

export const SystemEndpoints = {
}
  health: {
}
    method: &apos;GET&apos;,
    path: &apos;/health&apos;,
    authenticated: false,
    cache: { ttl: 30 },
  } as TypedEndpoint<void, ApiResponse<any>>,

  version: {
}
    method: &apos;GET&apos;,
    path: &apos;/version&apos;,
    authenticated: false,
    cache: { ttl: 3600 },
  } as TypedEndpoint<void, ApiResponse<{ version: string; build: string }>>,

  status: {
}
    method: &apos;GET&apos;,
    path: &apos;/status&apos;,
    authenticated: false,
    cache: { ttl: 60 },
  } as TypedEndpoint<void, ApiResponse<any>>,
} as const;

// ==================== ENDPOINT COLLECTIONS ====================

export const AllEndpoints = {
}
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
export type EndpointMethod = &apos;GET&apos; | &apos;POST&apos; | &apos;PUT&apos; | &apos;PATCH&apos; | &apos;DELETE&apos;;

export interface ApiEndpoint {
}
  method: EndpointMethod;
  path: EndpointPath;
  authenticated: boolean;
  roles?: string[];
}

// ==================== EXPORT ALL ====================

export type {
}
  EndpointConfig,
  TypedEndpoint,
  EndpointPath,
  EndpointMethod,
  ApiEndpoint,
};

export {
}
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