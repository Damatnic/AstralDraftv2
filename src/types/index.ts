/**
 * Astral Draft Type System - Main Barrel Export
 * Comprehensive type system for the fantasy football platform
 * 
 * This file serves as the main entry point for all type definitions in the Astral Draft application.
 * It provides organized exports and convenient aliases for frequently used types.
 * 
 * Usage:
 * ```typescript
 * import { Player, League, DraftState, ApiResponse } from '@/types';
 * import type { PlayerCardProps, TradeEventHandlers } from '@/types';
 * ```
 */

// ==================== MODELS ====================
// Core business logic types for fantasy football entities

export * from './models';
export type {
  // Player types
  Player,
  PlayerStats,
  PlayerProjections,
  NFLTeam,
  PlayerPosition,
  InjuryStatus,
  AdvancedMetrics,
  PlayerFilter,
  PlayerComparison,
  
  // User types
  User,
  UserProfile,
  UserPreferences,
  UserStats,
  Achievement,
  Badge,
  Subscription,
  AuthSession,
  AuthState,
  
  // League types
  League,
  Team,
  Matchup,
  LeagueSettings,
  ScoringSettings,
  RosterSettings,
  Standings,
  PlayoffBracket,
  LeagueStatus,
  LeagueType,
  
  // Draft types
  DraftState,
  DraftPick,
  DraftBoard,
  DraftSettings,
  DraftGrade,
  DraftAnalytics,
  DraftEvent,
  DraftFormat,
  AuctionState,
  MockDraft,
//   DraftPrep
} from './models';

// ==================== API ====================
// Type-safe API layer with requests, responses, and endpoints

export * from './api';
export type {
  // Core API types
  ApiResponse,
  ErrorResponse,
  PaginatedResponse,
  PaginationMeta,
  
  // Authentication
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RefreshTokenResponse,
  
  // Common request patterns
  BaseRequest,
  PaginatedRequest,
  CreateResponse,
  UpdateResponse,
  DeleteResponse,
  
  // Domain-specific API types
  UserProfileResponse,
  LeagueDetailResponse,
  PlayerListResponse,
  DraftStateResponse,
  TradeListResponse,
//   WaiverListResponse
} from './api';

// Export endpoint definitions
export {
  AuthEndpoints,
  UserEndpoints,
  LeagueEndpoints,
  DraftEndpoints,
  PlayerEndpoints,
  TradeEndpoints,
  WaiverEndpoints,
  AnalyticsEndpoints,
//   AllEndpoints
} from './api';

// ==================== COMPONENTS ====================
// React component props and event handler types

export * from './components';
export type {
  // Base component types
  BaseComponentProps,
  InteractiveProps,
  
  // Common props
  ButtonProps,
  InputProps,
  SelectProps,
  ModalProps,
  
  // Fantasy-specific component props
  PlayerCardProps,
  TeamRosterProps,
  DraftBoardProps,
  MatchupCardProps,
  TradeBuilderProps,
  WaiverWireProps,
  
  // Event handlers
  PlayerEventHandlers,
  DraftEventHandlers,
  TradeEventHandlers,
  WebSocketEventHandlers,
  
  // WebSocket events
  DraftWebSocketEvent,
  LeagueWebSocketEvent,
  ScoringWebSocketEvent,
//   AnyWebSocketEvent
} from './components';

// ==================== UTILITIES ====================
// Common utility types, validation, and formatting

export * from './utils';
export type {
  // Common utilities
  Nullable,
  Optional,
  Maybe,
  DeepPartial,
  DeepRequired,
  LoadingState,
  Result,
  AsyncResult,
  
  // Branded types for type safety
  UserId,
  LeagueId,
  PlayerId,
  TeamId,
  DraftId,
  
  // Pagination and sorting
  PaginationInfo,
  PaginatedData,
  SortConfig,
  FilterConfig,
  
  // Validation
  ValidationResult,
  ValidationError,
  ValidationSchema,
  UserValidationSchema,
  LeagueValidationSchema,
  
  // Formatting
  PlayerDisplayConfig,
  TeamDisplayConfig,
  LeagueDisplayConfig,
  FormatOptions,
  NumberFormatOptions,
//   DateFormatOptions
} from './utils';

// ==================== CONVENIENT TYPE ALIASES ====================
// Frequently used type combinations and shortcuts

// API Response shortcuts
export type PlayerResponse = ApiResponse<Player>;
export type PlayersResponse = PaginatedResponse<Player>;
export type LeagueResponse = ApiResponse<League>;
export type LeaguesResponse = PaginatedResponse<League>;
export type TeamResponse = ApiResponse<Team>;
export type DraftResponse = ApiResponse<DraftState>;

// Common ID types
export type EntityId = string;
export type TimestampString = string;
export type ISODateString = string;

// Component prop shortcuts
export type PlayerProps = PlayerCardProps;
export type TeamProps = TeamRosterProps;
export type LeagueProps = LeagueSettingsProps;
export type DraftProps = DraftBoardProps;

// Event handler shortcuts  
export type PlayerHandler = (player: Player) => void;
export type TeamHandler = (team: Team) => void;
export type LeagueHandler = (league: League) => void;
export type ErrorHandler = (error: Error) => void;

// ==================== GLOBAL CONSTANTS ====================
// Re-export useful constants from globals

export type {
  AstralDraftError,
  ValidationErrorDetail,
  APIConfig,
  WebSocketConfig,
//   ThemeConfig
} from './globals';

// ==================== TYPE GUARDS ====================
// Utility functions for runtime type checking

export const isPlayer = (obj: any): obj is Player => {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string' && obj.position;
};

export const isUser = (obj: any): obj is User => {
  return obj && typeof obj.id === 'string' && typeof obj.username === 'string' && obj.profile;
};

export const isLeague = (obj: any): obj is League => {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string' && obj.teams && obj.settings;
};

export const isDraftState = (obj: any): obj is DraftState => {
  return obj && typeof obj.id === 'string' && obj.status && obj.picks && obj.draftOrder;
};

export const isApiResponse = <T>(obj: any): obj is ApiResponse<T> => {
  return obj && typeof obj.success === 'boolean' && obj.data !== undefined;
};

export const isErrorResponse = (obj: any): obj is ErrorResponse => {
  return obj && obj.success === false && obj.error;
};

// ==================== UTILITY FUNCTIONS ====================
// Helper functions for working with types

/**
 * Creates a type-safe key extractor function
 */
export const createKeyExtractor = <T, K extends keyof T>(key: K) => {
  return (item: T): T[K] => item[key];
};

/**
 * Creates a type-safe property selector function
 */
export const createSelector = <T, R>(selector: (item: T) => R) => {
  return (item: T): R => selector(item);
};

/**
 * Type-safe object keys function
 */
export const getTypedKeys = <T extends Record<string, any>>(obj: T): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[];
};

/**
 * Type-safe object entries function
 */
export const getTypedEntries = <T extends Record<string, any>>(obj: T): [keyof T, T[keyof T]][] => {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
};

// ==================== DOCUMENTATION ====================

/**
 * @fileoverview Astral Draft Type System
 * 
 * This comprehensive type system provides:
 * 
 * 1. **Models** - Core business entities (Player, User, League, Draft, Team, etc.)
 * 2. **API** - Request/response types and endpoint definitions
 * 3. **Components** - React component props and event handlers  
 * 4. **Utils** - Common utilities, validation, and formatting types
 * 5. **Global** - Global type definitions and module declarations
 * 
 * The type system is organized to:
 * - Eliminate 'any' types throughout the codebase
 * - Provide compile-time safety for API calls
 * - Standardize component interfaces
 * - Enable proper IntelliSense and autocompletion
 * - Support runtime type checking with type guards
 * - Facilitate refactoring and maintenance
 * 
 * Key Features:
 * - Branded types for ID safety (UserId, PlayerId, etc.)
 * - Discriminated unions for state management
 * - Generic types for reusability
 * - Comprehensive validation schemas
 * - WebSocket event type safety
 * - Responsive and accessibility type support
 * - Internationalization type support
 * 
 * Usage Patterns:
 * ```typescript
 * // Import specific types
 * import type { Player, League } from '@/types';
 * 
 * // Import component props
 * import type { PlayerCardProps } from '@/types';
 * 
 * // Import API types
 * import type { ApiResponse, PlayerListResponse } from '@/types';
 * 
 * // Import utilities
 * import type { Nullable, LoadingState } from '@/types';
 * 
 * // Import endpoints
 * import { PlayerEndpoints } from '@/types';
 * ```
 */

// Export statement to make this a module
export {};