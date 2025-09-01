/**
 * Application Constants Configuration
 * Centralized configuration for performance, error handling, and WebSocket settings
 */

export const PERFORMANCE_CONSTANTS = {
}
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
}
  // Error severity levels
  SEVERITY: {
}
    LOW: &apos;low&apos;,
    MEDIUM: &apos;medium&apos;, 
    HIGH: &apos;high&apos;,
    CRITICAL: &apos;critical&apos;
  },
  
  // Error categories
  CATEGORIES: {
}
    NETWORK: &apos;network&apos;,
    RUNTIME: &apos;runtime&apos;,
    VALIDATION: &apos;validation&apos;,
    AUTHENTICATION: &apos;auth&apos;,
    PERMISSION: &apos;permission&apos;,
    SYSTEM: &apos;system&apos;
  },
  
  // Browser extension error patterns to suppress
  EXTENSION_ERROR_PATTERNS: [
    &apos;extension&apos;,
    &apos;chrome-extension://&apos;,
    &apos;moz-extension://&apos;,
    &apos;safari-extension://&apos;,
    &apos;safari-web-extension://&apos;,
    &apos;message port closed&apos;,
    &apos;Extension context invalidated&apos;,
    &apos;Could not establish connection&apos;,
    &apos;Receiving end does not exist&apos;,
    &apos;runtime.lastError&apos;,
    &apos;Tab no longer exists&apos;,
    &apos;No tab with id&apos;,
    &apos;The message port closed before a response was received&apos;,
    &apos;Extension host has crashed&apos;,
    &apos;Extension was disabled&apos;,
    &apos;chrome.runtime.lastError&apos;,
    &apos;Unchecked runtime.lastError&apos;,
    &apos;WebExtension context&apos;,
    &apos;Extension unloaded&apos;,
    &apos;lastError&apos;
  ],
  
  // API error patterns to handle gracefully
  API_ERROR_PATTERNS: [
    &apos;401 (Unauthorized)&apos;,
    &apos;403 (Forbidden)&apos;,
    &apos;404 (Not Found)&apos;,
    &apos;500 (Internal Server Error)&apos;,
    &apos;502 (Bad Gateway)&apos;,
    &apos;503 (Service Unavailable)&apos;,
    &apos;Network Error&apos;,
    &apos;CORS error&apos;,
    &apos;api.sportsdata.io&apos;
  ],
  
  // Maximum error counts before suppression
  MAX_ERROR_COUNT: 5,
  ERROR_RESET_INTERVAL: 300000 // 5 minutes
} as const;

export const WEBSOCKET_CONSTANTS = {
}
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
}
    CONNECTING: &apos;connecting&apos;,
    CONNECTED: &apos;connected&apos;,
    DISCONNECTED: &apos;disconnected&apos;,
    RECONNECTING: &apos;reconnecting&apos;,
    FAILED: &apos;failed&apos;
  },
  
  // Event types
  EVENTS: {
}
    CONNECT: &apos;connect&apos;,
    DISCONNECT: &apos;disconnect&apos;,
    ERROR: &apos;error&apos;,
    MESSAGE: &apos;message&apos;,
    RECONNECT: &apos;reconnect&apos;,
    HEARTBEAT: &apos;heartbeat&apos;
  }
} as const;

export const CACHE_CONSTANTS = {
}
  // Cache durations (in milliseconds)
  SHORT_CACHE: 5 * 60 * 1000,        // 5 minutes
  MEDIUM_CACHE: 30 * 60 * 1000,      // 30 minutes
  LONG_CACHE: 24 * 60 * 60 * 1000,   // 24 hours
  PERSISTENT_CACHE: 7 * 24 * 60 * 60 * 1000, // 7 days
  
  // Cache keys
  KEYS: {
}
    USER_PREFERENCES: &apos;user_preferences&apos;,
    LEAGUE_DATA: &apos;league_data&apos;,
    PLAYER_STATS: &apos;player_stats&apos;,
    DRAFT_DATA: &apos;draft_data&apos;,
    SETTINGS: &apos;app_settings&apos;
  },
  
  // Storage limits
  MAX_CACHE_SIZE: 50 * 1024 * 1024, // 50MB
  CLEANUP_THRESHOLD: 0.8 // 80% full
} as const;

export const SECURITY_CONSTANTS = {
}
  // Authentication
  TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
  REFRESH_THRESHOLD: 5 * 60 * 1000,  // 5 minutes before expiry
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_COOLDOWN: 15 * 60 * 1000,    // 15 minutes
  
  // Data validation
  MAX_INPUT_LENGTH: 1000,
  MAX_FILE_SIZE: 10 * 1024 * 1024,   // 10MB
  ALLOWED_FILE_TYPES: [
    &apos;image/jpeg&apos;,
    &apos;image/png&apos;,
    &apos;image/gif&apos;,
    &apos;image/webp&apos;,
    &apos;application/pdf&apos;
  ],
  
  // Rate limiting
  API_RATE_LIMIT: 100,               // requests per minute
  UPLOAD_RATE_LIMIT: 10,             // uploads per minute
  SEARCH_RATE_LIMIT: 20              // searches per minute
} as const;

export const UI_CONSTANTS = {
}
  // Breakpoints (matches Tailwind CSS)
  BREAKPOINTS: {
}
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    &apos;2XL&apos;: 1536
  },
  
  // Animation timings
  ANIMATIONS: {
}
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
    VERY_SLOW: 1000
  },
  
  // Z-index layers
  Z_INDEX: {
}
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
}
    AVATAR: {
}
      SM: 32,
      MD: 48,
      LG: 64,
      XL: 96
    },
    BUTTON_HEIGHT: {
}
      SM: 32,
      MD: 40,
      LG: 48
    }
  }
} as const;

export const API_CONSTANTS = {
}
  // Endpoints
  BASE_URL: process.env.NODE_ENV === &apos;production&apos; 
    ? &apos;https://astral-draft.netlify.app/api&apos;
    : &apos;http://localhost:3001/api&apos;,
    
  ENDPOINTS: {
}
    AUTH: &apos;/auth&apos;,
    USERS: &apos;/users&apos;,
    LEAGUES: &apos;/leagues&apos;,
    TEAMS: &apos;/teams&apos;,
    PLAYERS: &apos;/players&apos;,
    DRAFTS: &apos;/drafts&apos;,
    TRADES: &apos;/trades&apos;,
    WAIVERS: &apos;/waivers&apos;,
    ANALYTICS: &apos;/analytics&apos;
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
}
  PERFORMANCE_CONSTANTS,
  ERROR_CONSTANTS,
  WEBSOCKET_CONSTANTS,
  CACHE_CONSTANTS,
  SECURITY_CONSTANTS,
  UI_CONSTANTS,
//   API_CONSTANTS
};