/**
 * Application Constants Configuration
 * Centralized configuration for performance, error handling, and WebSocket settings
 */

export const PERFORMANCE_CONSTANTS = {
  // Performance monitoring thresholds
  IDLE_CALLBACK_TIMEOUT: 5000,
  RENDER_TIMEOUT: 100,
  CRITICAL_RENDER_TIME: 300,
  BUNDLE_SIZE_WARNING: 500 * 1024, // 500KB
  
  // Memory management
  MAX_ERROR_QUEUE_SIZE: 100,
  MAX_METRIC_CACHE_SIZE: 1000,
  CLEANUP_INTERVAL: 60000, // 1 minute
  
  // Network performance
  SLOW_NETWORK_THRESHOLD: 1000,
  TIMEOUT_DURATION: 10000,
  RETRY_DELAY: 1000,
  MAX_RETRIES: 3,
  
  // UI performance
  DEBOUNCE_DELAY: 300,
  THROTTLE_INTERVAL: 100,
  ANIMATION_DURATION: 300,
  SMOOTH_SCROLL_DURATION: 500
} as const;

export const ERROR_CONSTANTS = {
  // Error severity levels
  SEVERITY: {
    LOW: 'low',
    MEDIUM: 'medium', 
    HIGH: 'high',
    CRITICAL: 'critical'
  },
  
  // Error categories
  CATEGORIES: {
    NETWORK: 'network',
    RUNTIME: 'runtime',
    VALIDATION: 'validation',
    AUTHENTICATION: 'auth',
    PERMISSION: 'permission',
    SYSTEM: 'system'
  },
  
  // Browser extension error patterns to suppress
  EXTENSION_ERROR_PATTERNS: [
    'extension',
    'chrome-extension://',
    'moz-extension://',
    'safari-extension://',
    'safari-web-extension://',
    'message port closed',
    'Extension context invalidated',
    'Could not establish connection',
    'Receiving end does not exist',
    'runtime.lastError',
    'Tab no longer exists',
    'No tab with id',
    'The message port closed before a response was received',
    'Extension host has crashed',
    'Extension was disabled',
    'chrome.runtime.lastError',
    'Unchecked runtime.lastError',
    'WebExtension context',
    'Extension unloaded',
    'lastError'
  ],
  
  // API error patterns to handle gracefully
  API_ERROR_PATTERNS: [
    '401 (Unauthorized)',
    '403 (Forbidden)',
    '404 (Not Found)',
    '500 (Internal Server Error)',
    '502 (Bad Gateway)',
    '503 (Service Unavailable)',
    'Network Error',
    'CORS error',
    'api.sportsdata.io'
  ],
  
  // Maximum error counts before suppression
  MAX_ERROR_COUNT: 5,
  ERROR_RESET_INTERVAL: 300000 // 5 minutes
} as const;

export const WEBSOCKET_CONSTANTS = {
  // Connection settings
  CONNECTION_TIMEOUT: 10000,
  RECONNECT_ATTEMPTS: 5,
  RECONNECT_INTERVAL: 3000,
  HEARTBEAT_INTERVAL: 30000,
  
  // Message handling
  MAX_MESSAGE_SIZE: 1024 * 1024, // 1MB
  MESSAGE_QUEUE_SIZE: 100,
  BATCH_SIZE: 10,
  
  // Connection states
  STATES: {
    CONNECTING: 'connecting',
    CONNECTED: 'connected',
    DISCONNECTED: 'disconnected',
    RECONNECTING: 'reconnecting',
    FAILED: 'failed'
  },
  
  // Event types
  EVENTS: {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    ERROR: 'error',
    MESSAGE: 'message',
    RECONNECT: 'reconnect',
    HEARTBEAT: 'heartbeat'
  }
} as const;

export const CACHE_CONSTANTS = {
  // Cache durations (in milliseconds)
  SHORT_CACHE: 5 * 60 * 1000,        // 5 minutes
  MEDIUM_CACHE: 30 * 60 * 1000,      // 30 minutes
  LONG_CACHE: 24 * 60 * 60 * 1000,   // 24 hours
  PERSISTENT_CACHE: 7 * 24 * 60 * 60 * 1000, // 7 days
  
  // Cache keys
  KEYS: {
    USER_PREFERENCES: 'user_preferences',
    LEAGUE_DATA: 'league_data',
    PLAYER_STATS: 'player_stats',
    DRAFT_DATA: 'draft_data',
    SETTINGS: 'app_settings'
  },
  
  // Storage limits
  MAX_CACHE_SIZE: 50 * 1024 * 1024, // 50MB
  CLEANUP_THRESHOLD: 0.8 // 80% full
} as const;

export const SECURITY_CONSTANTS = {
  // Authentication
  TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
  REFRESH_THRESHOLD: 5 * 60 * 1000,  // 5 minutes before expiry
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_COOLDOWN: 15 * 60 * 1000,    // 15 minutes
  
  // Data validation
  MAX_INPUT_LENGTH: 1000,
  MAX_FILE_SIZE: 10 * 1024 * 1024,   // 10MB
  ALLOWED_FILE_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf'
  ],
  
  // Rate limiting
  API_RATE_LIMIT: 100,               // requests per minute
  UPLOAD_RATE_LIMIT: 10,             // uploads per minute
  SEARCH_RATE_LIMIT: 20              // searches per minute
} as const;

export const UI_CONSTANTS = {
  // Breakpoints (matches Tailwind CSS)
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536
  },
  
  // Animation timings
  ANIMATIONS: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
    VERY_SLOW: 1000
  },
  
  // Z-index layers
  Z_INDEX: {
    DROPDOWN: 1000,
    STICKY: 1020,
    FIXED: 1030,
    MODAL_BACKDROP: 1040,
    MODAL: 1050,
    POPOVER: 1060,
    TOOLTIP: 1070,
    NOTIFICATION: 1080,
    DEBUG: 9999
  },
  
  // Component sizes
  SIZES: {
    AVATAR: {
      SM: 32,
      MD: 48,
      LG: 64,
      XL: 96
    },
    BUTTON_HEIGHT: {
      SM: 32,
      MD: 40,
      LG: 48
    }
  }
} as const;

export const API_CONSTANTS = {
  // Endpoints
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://astral-draft.netlify.app/api'
    : 'http://localhost:3001/api',
    
  ENDPOINTS: {
    AUTH: '/auth',
    USERS: '/users',
    LEAGUES: '/leagues',
    TEAMS: '/teams',
    PLAYERS: '/players',
    DRAFTS: '/drafts',
    TRADES: '/trades',
    WAIVERS: '/waivers',
    ANALYTICS: '/analytics'
  },
  
  // Request settings
  TIMEOUT: 30000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  
  // Response codes
  SUCCESS_CODES: [200, 201, 202, 204],
  CLIENT_ERROR_CODES: [400, 401, 403, 404, 422],
  SERVER_ERROR_CODES: [500, 502, 503, 504]
} as const;

export default {
  PERFORMANCE_CONSTANTS,
  ERROR_CONSTANTS,
  WEBSOCKET_CONSTANTS,
  CACHE_CONSTANTS,
  SECURITY_CONSTANTS,
  UI_CONSTANTS,
  API_CONSTANTS
};