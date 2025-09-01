/// <reference types="vite/client" />

interface ImportMetaEnv {
}
  readonly VITE_API_BASE_URL: string
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_ENVIRONMENT: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_NOTIFICATIONS: string
  readonly VITE_ENABLE_PWA: string
  readonly VITE_ENABLE_OFFLINE: string
  readonly VITE_ENABLE_BACKGROUND_SYNC: string
  readonly VITE_CACHE_VERSION: string
  readonly VITE_DEBUG_MODE: string
  readonly VITE_MOCK_DATA: string
  readonly VITE_ENABLE_ORACLE: string
  readonly VITE_ORACLE_API_URL: string
  readonly VITE_SPORTS_DATA_API_KEY: string
  readonly VITE_NEON_DATABASE_URL: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
  readonly VITE_GOOGLE_ANALYTICS_ID: string
  readonly VITE_SENTRY_DSN: string
  readonly VITE_WEBSOCKET_URL: string
  readonly VITE_CDN_URL: string
  readonly VITE_FEATURE_FLAGS: string
}

interface ImportMeta {
}
  readonly env: ImportMetaEnv
}

declare global {
}
  interface Window {
}
    loggingService?: {
}
      error: (message: string, data?: any, category?: string) => void;
    };
  }
}