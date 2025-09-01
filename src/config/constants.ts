/**
 * Application Constants
 * Centralized location for magic numbers and configuration values
 */

// Performance and Timing Constants
export const PERFORMANCE_CONSTANTS = {
  // Timeout values in milliseconds
  WEBSOCKET_CONNECTION_TIMEOUT: 3000,
  IDLE_CALLBACK_TIMEOUT: 1000,
  ERROR_RATE_LIMIT_COUNT: 5,
  
  // Performance thresholds
  LARGE_CHUNK_WARNING_THRESHOLD: 500 * 1024, // 500KB
  COMPONENT_RENDER_THRESHOLD: 16, // 16ms for 60fps
  
  // Loading delays
  SIMULATED_LOADING_DELAY: 2000,
} as const;

// UI Constants
export const UI_CONSTANTS = {
  // Animation delays
  LOADING_DOT_DELAY_1: 100,
  LOADING_DOT_DELAY_2: 200,
  ANIMATION_DELAY_75: 75,
  
  // Sizes
  LOADING_SPINNER_LARGE: 16, // 4rem
  LOADING_SPINNER_MEDIUM: 12, // 3rem
  LOADING_DOT_SIZE: 2, // 0.5rem
  
  // Grid breakpoints
  MIN_CARD_WIDTH: 250,
  MAX_CONTENT_WIDTH: 800,
  
  // Border radius
  CARD_BORDER_RADIUS: 15,
  BUTTON_BORDER_RADIUS: 8,
} as const;

// Error Handling Constants
export const ERROR_CONSTANTS = {
  MAX_IDENTICAL_ERRORS: 5,
  EXTENSION_ERROR_PATTERNS: [
    'unchecked runtime.lasterror',
    'could not establish connection',
    'receiving end does not exist',
    'message port closed',
    'tab no longer exists',
    'no tab with id',
    'extension context',
    'background.js',
    '[sign in with]',
    'chrome-extension',
    'moz-extension',
    'safari-extension',
  ],
} as const;

// WebSocket Constants
export const WEBSOCKET_CONSTANTS = {
  CONNECTION_TIMEOUT: 3000,
  RECONNECT_INTERVAL: 5000,
  MAX_RECONNECT_ATTEMPTS: 10,
} as const;

// Budget and Financial Constants
export const BUDGET_CONSTANTS = {
  MAX_BID_PERCENTAGE: 0.3, // 30% of budget
  VALUE_MULTIPLIER: 0.8, // 80% of player value
} as const;

// Web Vitals Thresholds (Google's recommended values)
export const WEB_VITALS_THRESHOLDS = {
  // First Contentful Paint
  FCP_GOOD: 1800,
  FCP_NEEDS_IMPROVEMENT: 3000,
  
  // Largest Contentful Paint
  LCP_GOOD: 2500,
  LCP_NEEDS_IMPROVEMENT: 4000,
  
  // First Input Delay
  FID_GOOD: 100,
  FID_NEEDS_IMPROVEMENT: 300,
  
  // Cumulative Layout Shift
  CLS_GOOD: 0.1,
  CLS_NEEDS_IMPROVEMENT: 0.25,
  
  // Performance scoring weights
  SCORE_DEDUCTION_MAJOR: 25,
  SCORE_DEDUCTION_MODERATE: 20,
  SCORE_DEDUCTION_MINOR: 15,
  SCORE_DEDUCTION_SMALL: 10,
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// File Size Limits
export const FILE_SIZE_LIMITS = {
  INLINE_ASSET_LIMIT: 4096, // 4KB
  LARGE_RESOURCE_THRESHOLD: 100 * 1024, // 100KB
  SLOW_RESOURCE_THRESHOLD: 1000, // 1 second
} as const;

// Cache and Storage Constants
export const CACHE_CONSTANTS = {
  DEFAULT_TTL: 3600000, // 1 hour in milliseconds
  LONG_TTL: 86400000, // 24 hours in milliseconds
  SHORT_TTL: 300000, // 5 minutes in milliseconds
} as const;

// Draft and Game Constants
export const GAME_CONSTANTS = {
  MAX_TEAM_SIZE: 12,
  MIN_PLAYERS_PER_POSITION: 1,
  DRAFT_ROUNDS: 16,
  PLAYOFF_WEEKS: [15, 16, 17],
} as const;

// API Constants
export const API_CONSTANTS = {
  DEFAULT_TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// Battery Optimization Levels
export const BATTERY_LEVELS = {
  CRITICAL: 15, // Below 15%
  LOW: 30, // Below 30%
  NORMAL: 50, // Above 50%
} as const;