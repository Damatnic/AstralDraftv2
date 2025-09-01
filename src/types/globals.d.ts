/**
 * Global Type Definitions
 * Global types and module declarations for the Astral Draft application
 */

// ==================== GLOBAL AUGMENTATIONS ====================

declare global {
}
  // Window object extensions
  interface Window {
}
    // Analytics
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    
    // Payment processing
    Stripe?: any;
    PayPal?: any;
    
    // Social login
    google?: any;
    FB?: any;
    
    // Push notifications
    webkitNotifications?: any;
    
    // Service worker
    navigator: Navigator & {
}
      serviceWorker?: ServiceWorkerContainer;
    };
    
    // Environment variables (for runtime config)
    __ENV__?: {
}
      NODE_ENV: string;
      API_URL: string;
      WS_URL: string;
      SENTRY_DSN: string;
      [key: string]: string;
    };
    
    // Development tools
    __REDUX_DEVTOOLS_EXTENSION__?: any;
    __ASTRAL_DRAFT_DEBUG__?: boolean;
  }
  
  // Node.js process environment
  namespace NodeJS {
}
    interface ProcessEnv {
}
      readonly NODE_ENV: &apos;development&apos; | &apos;production&apos; | &apos;test&apos;;
      readonly REACT_APP_API_URL: string;
      readonly REACT_APP_WS_URL: string;
      readonly REACT_APP_SENTRY_DSN: string;
      readonly REACT_APP_GOOGLE_CLIENT_ID: string;
      readonly REACT_APP_FACEBOOK_APP_ID: string;
      readonly REACT_APP_STRIPE_PUBLIC_KEY: string;
      readonly REACT_APP_PAYPAL_CLIENT_ID: string;
      readonly REACT_APP_VERSION: string;
      readonly REACT_APP_BUILD: string;
      readonly REACT_APP_DEBUG: string;
      readonly REACT_APP_MOCK_API: string;
    }
  }
}

// ==================== MODULE DECLARATIONS ====================

// CSS Modules
declare module &apos;*.module.css&apos; {
}
  const classes: { [key: string]: string };
  export default classes;
}

declare module &apos;*.module.scss&apos; {
}
  const classes: { [key: string]: string };
  export default classes;
}

declare module &apos;*.module.sass&apos; {
}
  const classes: { [key: string]: string };
  export default classes;
}

// Asset imports
declare module &apos;*.svg&apos; {
}
  import React from &apos;react&apos;;
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}

declare module &apos;*.png&apos; {
}
  const src: string;
  export default src;
}

declare module &apos;*.jpg&apos; {
}
  const src: string;
  export default src;
}

declare module &apos;*.jpeg&apos; {
}
  const src: string;
  export default src;
}

declare module &apos;*.gif&apos; {
}
  const src: string;
  export default src;
}

declare module &apos;*.webp&apos; {
}
  const src: string;
  export default src;
}

declare module &apos;*.ico&apos; {
}
  const src: string;
  export default src;
}

declare module &apos;*.woff&apos; {
}
  const src: string;
  export default src;
}

declare module &apos;*.woff2&apos; {
}
  const src: string;
  export default src;
}

declare module &apos;*.ttf&apos; {
}
  const src: string;
  export default src;
}

declare module &apos;*.eot&apos; {
}
  const src: string;
  export default src;
}

// Audio files
declare module &apos;*.mp3&apos; {
}
  const src: string;
  export default src;
}

declare module &apos;*.wav&apos; {
}
  const src: string;
  export default src;
}

declare module &apos;*.ogg&apos; {
}
  const src: string;
  export default src;
}

// Video files
declare module &apos;*.mp4&apos; {
}
  const src: string;
  export default src;
}

declare module &apos;*.webm&apos; {
}
  const src: string;
  export default src;
}

// Data files
declare module &apos;*.json&apos; {
}
  const content: any;
  export default content;
}

declare module &apos;*.xml&apos; {
}
  const content: string;
  export default content;
}

declare module &apos;*.txt&apos; {
}
  const content: string;
  export default content;
}

// ==================== THIRD-PARTY LIBRARY TYPES ====================

// Chart.js extensions
declare module &apos;chart.js&apos; {
}
  interface TooltipModel {
}
    astralDraftCustomData?: any;
  }
}

// React extensions
declare module &apos;react&apos; {
}
  interface HTMLAttributes<T> {
}
    // Custom data attributes for fantasy football
    &apos;data-player-id&apos;?: string;
    &apos;data-team-id&apos;?: string;
    &apos;data-league-id&apos;?: string;
    &apos;data-draft-id&apos;?: string;
    &apos;data-position&apos;?: string;
    &apos;data-fantasy-points&apos;?: number;
    &apos;data-rank&apos;?: number;
    &apos;data-tier&apos;?: number;
  }
  
  interface CSSProperties {
}
    // CSS custom properties for theming
    &apos;--astral-primary-color&apos;?: string;
    &apos;--astral-secondary-color&apos;?: string;
    &apos;--astral-accent-color&apos;?: string;
    &apos;--astral-background-color&apos;?: string;
    &apos;--astral-text-color&apos;?: string;
    &apos;--astral-border-color&apos;?: string;
    &apos;--astral-shadow-color&apos;?: string;
    
    // Fantasy-specific CSS variables
    &apos;--player-tier-color&apos;?: string;
    &apos;--position-color&apos;?: string;
    &apos;--team-primary-color&apos;?: string;
    &apos;--team-secondary-color&apos;?: string;
    &apos;--draft-pick-color&apos;?: string;
    &apos;--fantasy-points-color&apos;?: string;
  }
}

// ==================== UTILITY TYPE EXPORTS ====================

// Make some utility types available globally
export type DeepPartial<T> = {
}
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepRequired<T> = {
}
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type Maybe<T> = T | null | undefined;

// ==================== FANTASY FOOTBALL SPECIFIC GLOBALS ====================

// Draft status constants
export const DRAFT_STATUS = {
}
  SCHEDULED: &apos;scheduled&apos;,
  ACTIVE: &apos;active&apos;,
  PAUSED: &apos;paused&apos;,
  COMPLETED: &apos;completed&apos;,
  CANCELLED: &apos;cancelled&apos;
} as const;

// Player positions
export const POSITIONS = {
}
  QB: &apos;QB&apos;,
  RB: &apos;RB&apos;,
  WR: &apos;WR&apos;,
  TE: &apos;TE&apos;,
  K: &apos;K&apos;,
  DEF: &apos;DEF&apos;,
  FLEX: &apos;FLEX&apos;,
  SUPERFLEX: &apos;SUPERFLEX&apos;
} as const;

// Injury statuses
export const INJURY_STATUS = {
}
  HEALTHY: &apos;healthy&apos;,
  QUESTIONABLE: &apos;questionable&apos;,
  DOUBTFUL: &apos;doubtful&apos;,
  OUT: &apos;out&apos;,
  IR: &apos;ir&apos;,
  PUP: &apos;pup&apos;,
  SUSPENDED: &apos;suspended&apos;
} as const;

// League statuses
export const LEAGUE_STATUS = {
}
  PRE_DRAFT: &apos;pre_draft&apos;,
  DRAFTING: &apos;drafting&apos;,
  DRAFT_COMPLETE: &apos;draft_complete&apos;,
  IN_SEASON: &apos;in_season&apos;,
  PLAYOFFS: &apos;playoffs&apos;,
  COMPLETE: &apos;complete&apos;,
  ARCHIVED: &apos;archived&apos;
} as const;

// Scoring formats
export const SCORING_FORMATS = {
}
  STANDARD: &apos;standard&apos;,
  PPR: &apos;ppr&apos;,
  HALF_PPR: &apos;half_ppr&apos;,
  SUPER_FLEX: &apos;super_flex&apos;,
  TWO_QB: &apos;two_qb&apos;,
  IDP: &apos;idp&apos;
} as const;

// ==================== ERROR TYPES ====================

export interface AstralDraftError extends Error {
}
  code: string;
  context?: any;
  timestamp: Date;
  userId?: string;
  leagueId?: string;
}

export interface ValidationErrorDetail {
}
  field: string;
  message: string;
  code: string;
  value?: any;
}

// ==================== API TYPES ====================

export interface APIConfig {
}
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
  withCredentials: boolean;
}

export interface WebSocketConfig {
}
  url: string;
  protocols?: string[];
  reconnectAttempts: number;
  reconnectInterval: number;
  heartbeatInterval: number;
}

// ==================== THEME TYPES ====================

export interface ThemeConfig {
}
  name: string;
  colors: {
}
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    shadow: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  fonts: {
}
    body: string;
    heading: string;
    mono: string;
  };
  spacing: {
}
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  breakpoints: {
}
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// ==================== EXPORT STATEMENT ====================

export {};
