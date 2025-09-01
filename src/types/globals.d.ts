/**
 * Global Type Definitions
 * Global types and module declarations for the Astral Draft application
 */

// ==================== GLOBAL AUGMENTATIONS ====================

declare global {
  // Window object extensions
  interface Window {
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
      serviceWorker?: ServiceWorkerContainer;
    };
    
    // Environment variables (for runtime config)
    __ENV__?: {
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
    interface ProcessEnv {
      readonly NODE_ENV: 'development' | 'production' | 'test';
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

// ==================== MODULE DECLARATIONS ====================

// CSS Modules
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;

declare module '*.module.sass' {
  const classes: { [key: string]: string };
  export default classes;

// Asset imports
declare module '*.svg' {
  import React from 'react';
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
  export default SVG;

declare module '*.png' {
  const src: string;
  export default src;

declare module '*.jpg' {
  const src: string;
  export default src;

declare module '*.jpeg' {
  const src: string;
  export default src;

declare module '*.gif' {
  const src: string;
  export default src;

declare module '*.webp' {
  const src: string;
  export default src;

declare module '*.ico' {
  const src: string;
  export default src;

declare module '*.woff' {
  const src: string;
  export default src;

declare module '*.woff2' {
  const src: string;
  export default src;

declare module '*.ttf' {
  const src: string;
  export default src;

declare module '*.eot' {
  const src: string;
  export default src;

// Audio files
declare module '*.mp3' {
  const src: string;
  export default src;

declare module '*.wav' {
  const src: string;
  export default src;

declare module '*.ogg' {
  const src: string;
  export default src;

// Video files
declare module '*.mp4' {
  const src: string;
  export default src;

declare module '*.webm' {
  const src: string;
  export default src;

// Data files
declare module '*.json' {
  const content: any;
  export default content;

declare module '*.xml' {
  const content: string;
  export default content;

declare module '*.txt' {
  const content: string;
  export default content;

// ==================== THIRD-PARTY LIBRARY TYPES ====================

// Chart.js extensions
declare module 'chart.js' {
  interface TooltipModel {
    astralDraftCustomData?: any;
  }

// React extensions
declare module 'react' {
  interface HTMLAttributes<T> {
    // Custom data attributes for fantasy football
    'data-player-id'?: string;
    'data-team-id'?: string;
    'data-league-id'?: string;
    'data-draft-id'?: string;
    'data-position'?: string;
    'data-fantasy-points'?: number;
    'data-rank'?: number;
    'data-tier'?: number;
  }
  
  interface CSSProperties {
    // CSS custom properties for theming
    '--astral-primary-color'?: string;
    '--astral-secondary-color'?: string;
    '--astral-accent-color'?: string;
    '--astral-background-color'?: string;
    '--astral-text-color'?: string;
    '--astral-border-color'?: string;
    '--astral-shadow-color'?: string;
    
    // Fantasy-specific CSS variables
    '--player-tier-color'?: string;
    '--position-color'?: string;
    '--team-primary-color'?: string;
    '--team-secondary-color'?: string;
    '--draft-pick-color'?: string;
    '--fantasy-points-color'?: string;
  }

// ==================== UTILITY TYPE EXPORTS ====================

// Make some utility types available globally
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type Maybe<T> = T | null | undefined;

// ==================== FANTASY FOOTBALL SPECIFIC GLOBALS ====================

// Draft status constants
export const DRAFT_STATUS = {
  SCHEDULED: 'scheduled',
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

// Player positions
export const POSITIONS = {
  QB: 'QB',
  RB: 'RB',
  WR: 'WR',
  TE: 'TE',
  K: 'K',
  DEF: 'DEF',
  FLEX: 'FLEX',
  SUPERFLEX: 'SUPERFLEX'
} as const;

// Injury statuses
export const INJURY_STATUS = {
  HEALTHY: 'healthy',
  QUESTIONABLE: 'questionable',
  DOUBTFUL: 'doubtful',
  OUT: 'out',
  IR: 'ir',
  PUP: 'pup',
  SUSPENDED: 'suspended'
} as const;

// League statuses
export const LEAGUE_STATUS = {
  PRE_DRAFT: 'pre_draft',
  DRAFTING: 'drafting',
  DRAFT_COMPLETE: 'draft_complete',
  IN_SEASON: 'in_season',
  PLAYOFFS: 'playoffs',
  COMPLETE: 'complete',
  ARCHIVED: 'archived'
} as const;

// Scoring formats
export const SCORING_FORMATS = {
  STANDARD: 'standard',
  PPR: 'ppr',
  HALF_PPR: 'half_ppr',
  SUPER_FLEX: 'super_flex',
  TWO_QB: 'two_qb',
  IDP: 'idp'
} as const;

// ==================== ERROR TYPES ====================

export interface AstralDraftError extends Error {
  code: string;
  context?: any;
  timestamp: Date;
  userId?: string;
  leagueId?: string;

export interface ValidationErrorDetail {
  field: string;
  message: string;
  code: string;
  value?: any;}

// ==================== API TYPES ====================

export interface APIConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
  withCredentials: boolean;}

export interface WebSocketConfig {
  url: string;
  protocols?: string[];
  reconnectAttempts: number;
  reconnectInterval: number;
  heartbeatInterval: number;}

// ==================== THEME TYPES ====================}

export interface ThemeConfig {
  name: string;
  colors: {
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
    body: string;
    heading: string;
    mono: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };

// ==================== EXPORT STATEMENT ====================

export {};
