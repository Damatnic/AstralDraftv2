/**
 * API Types Barrel Export
 * Central export for all API-related types
 */

// Request types
export * from './requests';

// Response types
export * from './responses';

// Endpoint types
export * from './endpoints';

// Re-export commonly used types
export type {
  // Base types
  BaseRequest,
  PaginatedRequest,
  ApiResponse,
  ErrorResponse,
  PaginatedResponse,
  PaginationMeta,
  
  // Authentication
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RefreshTokenResponse,
  
  // User
  UpdateUserProfileRequest,
  UserProfileResponse,
  UserStatsResponse,
  
  // League
  CreateLeagueRequest,
  LeagueListResponse,
  LeagueDetailResponse,
  CreateLeagueResponse,
  
  // Draft
  MakeDraftPickRequest,
  DraftStateResponse,
  DraftPickResponse,
  
  // Player
  GetPlayersRequest,
  PlayerListResponse,
  PlayerDetailResponse,
  
  // Trade
  ProposeTradeRequest,
  TradeListResponse,
  TradeAnalysisResponse,
  
  // Waiver
  SubmitWaiverClaimRequest,
  WaiverListResponse,
  WaiverAdviceResponse,
  
  // Analytics
  GetAnalyticsRequest,
  AnalyticsResponse,
  
  // Generic operations
  CreateResponse,
  UpdateResponse,
//   DeleteResponse
} from './requests';

export type {
  // Endpoints
  EndpointConfig,
  TypedEndpoint,
  ApiEndpoint,
  EndpointMethod,
//   EndpointPath
} from './endpoints';

// Endpoint collections
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
//   AllEndpoints
} from './endpoints';