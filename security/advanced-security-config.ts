/**
 * Advanced Security Configuration
 * Implements enterprise-grade security measures
 */

// Content Security Policy Headers
export const ADVANCED_CSP_CONFIG = {
  directives: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'", // Required for React dev tools
      'https://cdn.jsdelivr.net', // For CDN resources
      'blob:', // For dynamic imports
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for styled-components
      'https://fonts.googleapis.com',
    ],
    'img-src': [
      "'self'",
      'data:', // For base64 images
      'https:', // Allow HTTPS images
      'blob:', // For generated images
    ],
    'font-src': [
      "'self'",
      'https://fonts.gstatic.com',
      'data:', // For base64 fonts
    ],
    'connect-src': [
      "'self'",
      'https:', // Allow HTTPS API calls
      'wss:', // WebSocket connections
      'ws:', // Local WebSocket connections
    ],
    'object-src': ["'none'"], // Block plugins
    'base-uri': ["'self'"], // Restrict base tag
    'form-action': ["'self'"], // Restrict form submissions
    'frame-ancestors': ["'none'"], // Prevent framing
    'manifest-src': ["'self'"], // PWA manifest
    'worker-src': ["'self'", 'blob:'], // Service workers
  },
};

// Security Headers Configuration
export const SECURITY_HEADERS = {
  // Prevent XSS attacks
  'X-XSS-Protection': '1; mode=block',
  
  // Prevent content type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Referrer policy for privacy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // HSTS for HTTPS enforcement
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Feature policy restrictions
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'interest-cohort=()', // Block FLoC
  ].join(', '),
  
  // Cross-origin policies
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
};

// Input Sanitization Rules
export const SANITIZATION_CONFIG = {
  allowedTags: [
    'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li',
    'blockquote', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
  ],
  allowedAttributes: {
    'a': ['href', 'title', 'target'],
    '*': ['class', 'id']
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style']
};

// Rate Limiting Configuration
export const RATE_LIMIT_CONFIG = {
  // API endpoints
  '/api/auth/login': { requests: 5, window: 15 * 60 * 1000 }, // 5 per 15min
  '/api/auth/register': { requests: 3, window: 60 * 60 * 1000 }, // 3 per hour
  '/api/auth/forgot-password': { requests: 3, window: 60 * 60 * 1000 },
  '/api/draft/pick': { requests: 100, window: 60 * 1000 }, // 100 per minute
  '/api/trades/propose': { requests: 10, window: 60 * 1000 }, // 10 per minute
  '/api/chat/send': { requests: 30, window: 60 * 1000 }, // 30 per minute
  '/api/*': { requests: 1000, window: 60 * 60 * 1000 }, // Default: 1000 per hour
};

// Password Policy
export const PASSWORD_POLICY = {
  minLength: 12,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSymbols: true,
  preventCommonPasswords: true,
  preventPersonalInfo: true,
  historyCount: 12, // Prevent reusing last 12 passwords
};

// Session Security
export const SESSION_CONFIG = {
  name: '__Host-session', // Secure prefix
  httpOnly: true,
  secure: true, // HTTPS only
  sameSite: 'strict' as const,
  maxAge: 2 * 60 * 60 * 1000, // 2 hours
  rolling: true, // Extend on activity
  regenerateOnSignIn: true,
};

// API Key Management
export const API_KEY_POLICY = {
  rotationInterval: 90 * 24 * 60 * 60 * 1000, // 90 days
  keyLength: 64, // bytes
  algorithm: 'HS256',
  issuer: 'astral-draft-api',
  audience: 'astral-draft-client',
};

// Audit Logging Configuration
export const AUDIT_CONFIG = {
  events: [
    'user.login',
    'user.logout',
    'user.failed_login',
    'user.password_change',
    'user.email_change',
    'admin.user_action',
    'trade.proposed',
    'trade.accepted',
    'trade.rejected',
    'draft.pick_made',
    'league.settings_changed',
  ],
  retention: 365 * 24 * 60 * 60 * 1000, // 1 year
  encryption: true,
  anonymization: {
    after: 90 * 24 * 60 * 60 * 1000, // 90 days
    fields: ['ip_address', 'user_agent']
  },
};

// Environment-specific Security
export const ENVIRONMENT_SECURITY = {
  development: {
    enableCSP: false, // Too restrictive for dev
    enableHSTS: false,
    allowHttp: true,
    debugMode: true,
  },
  staging: {
    enableCSP: true,
    enableHSTS: true,
    allowHttp: false,
    debugMode: false,
    testingHeaders: true,
  },
  production: {
    enableCSP: true,
    enableHSTS: true,
    allowHttp: false,
    debugMode: false,
    securityReporting: true,
    monitoring: true,
  },
};