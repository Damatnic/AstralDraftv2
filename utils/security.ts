/**
 * Security Utilities and Configuration
 * Comprehensive security hardening for the Astral Draft application
 */

import DOMPurify from 'isomorphic-dompurify';

// Security Configuration
export const SECURITY_CONFIG = {
  // Content Security Policy
  CSP: {
    // Base CSP for development and production
    base: {
      'default-src': ["'self'"],
      'script-src': [
        "'self'",
        "'unsafe-inline'", // Required for inline scripts in index.html
        "'unsafe-eval'", // Required for development tools (remove in production)
        'https://cdn.jsdelivr.net',
        'https://accounts.google.com',
        'https://apis.google.com',
        'chrome-extension:', // Allow browser extensions
        'moz-extension:',
        'safari-extension:'
      ],
      'style-src': [
        "'self'",
        "'unsafe-inline'", // Required for dynamic styles
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
      ],
      'font-src': [
        "'self'",
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'data:'
      ],
      'img-src': [
        "'self'",
        'data:',
        'blob:',
        'https:',
        'https://*.espn.com',
        'https://*.nfl.com',
        'https://*.googleapis.com'
      ],
      'connect-src': [
        "'self'",
        'ws://localhost:*',
        'wss://localhost:*',
        'http://localhost:*',
        'https://localhost:*',
        'https://astraldraft.netlify.app',
        'wss://astraldraft.netlify.app',
        'https://api.gemini.com',
        'https://generativelanguage.googleapis.com',
        'https://*.espn.com',
        'https://api.the-odds-api.com',
        'https://api.sportsdata.io',
        'https://accounts.google.com',
        'https://oauth.googleapis.com',
        'https://www.googleapis.com',
        'chrome-extension:',
        'moz-extension:',
        'safari-extension:'
      ],
      'manifest-src': ["'self'"],
      'worker-src': ["'self'", 'blob:'],
      'frame-src': [
        "'self'",
        'https://accounts.google.com',
        'https://oauth.googleapis.com'
      ],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': [
        "'self'",
        'https://accounts.google.com'
      ],
      'media-src': ["'self'", 'data:', 'blob:'],
      'upgrade-insecure-requests': []
    },
    
    // Production-specific CSP (stricter)
    production: {
      'script-src': [
        "'self'",
        "'sha256-' + generateHashForInlineScript()", // Use hash instead of unsafe-inline
        'https://cdn.jsdelivr.net',
        'https://accounts.google.com',
        'https://apis.google.com'
      ]
    }
  },

  // Security Headers
  HEADERS: {
    // Strict Transport Security
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    
    // Content Type Options
    'X-Content-Type-Options': 'nosniff',
    
    // Frame Options
    'X-Frame-Options': 'DENY',
    
    // XSS Protection (legacy but still useful)
    'X-XSS-Protection': '1; mode=block',
    
    // Referrer Policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Permissions Policy (formerly Feature Policy)
    'Permissions-Policy': [
      'accelerometer=()',
      'ambient-light-sensor=()',
      'autoplay=(self)',
      'battery=()',
      'camera=()',
      'cross-origin-isolated=()',
      'display-capture=()',
      'document-domain=()',
      'encrypted-media=()',
      'execution-while-not-rendered=()',
      'execution-while-out-of-viewport=()',
      'fullscreen=(self)',
      'geolocation=()',
      'gyroscope=()',
      'keyboard-map=()',
      'magnetometer=()',
      'microphone=()',
      'midi=()',
      'navigation-override=()',
      'payment=()',
      'picture-in-picture=()',
      'publickey-credentials-get=()',
      'screen-wake-lock=()',
      'sync-xhr=()',
      'usb=()',
      'web-share=()',
      'xr-spatial-tracking=()'
    ].join(', '),
    
    // Cross-Origin Policies
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin'
  },

  // Input Validation
  INPUT_VALIDATION: {
    maxLength: 10000,
    allowedTags: ['b', 'i', 'em', 'strong', 'u', 'br', 'p'],
    allowedAttributes: {},
    forbiddenPatterns: [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /data:text\/html/gi,
      /vbscript:/gi
    ]
  }
};

/**
 * Generate hash for inline scripts (for CSP)
 */
function generateHashForInlineScript(): string {
  // This would be generated at build time for production
  return 'placeholder-hash';
}

/**
 * Build CSP string from configuration
 */
export function buildCSPString(environment: 'development' | 'production' = 'development'): string {
  const config = SECURITY_CONFIG.CSP.base;
  const prodOverrides = environment === 'production' ? SECURITY_CONFIG.CSP.production : {};
  
  const mergedConfig = { ...config, ...prodOverrides };
  
  return Object.entries(mergedConfig)
    .map(([directive, sources]) => {
      if (Array.isArray(sources) && sources.length === 0) {
        return directive; // For directives without values like upgrade-insecure-requests
      }
      return `${directive} ${Array.isArray(sources) ? sources.join(' ') : sources}`;
    })
    .join('; ');
}

/**
 * Sanitize HTML content
 */
export function sanitizeHTML(content: string): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  try {
    // Configure DOMPurify
    const cleanContent = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: SECURITY_CONFIG.INPUT_VALIDATION.allowedTags,
      ALLOWED_ATTR: SECURITY_CONFIG.INPUT_VALIDATION.allowedAttributes,
      ALLOW_DATA_ATTR: false,
      ALLOW_UNKNOWN_PROTOCOLS: false,
      RETURN_TRUSTED_TYPE: false
    });

    return cleanContent;
  } catch (error) {
    console.error('HTML sanitization failed:', error);
    return '';
  }
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  let sanitized = input;
  
  // Apply length limit
  if (sanitized.length > SECURITY_CONFIG.INPUT_VALIDATION.maxLength) {
    sanitized = sanitized.substring(0, SECURITY_CONFIG.INPUT_VALIDATION.maxLength);
  }

  // Remove forbidden patterns
  SECURITY_CONFIG.INPUT_VALIDATION.forbiddenPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });

  // Basic XSS prevention
  sanitized = sanitized
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  return sanitized.trim();
}

/**
 * Validate and sanitize JSON input
 */
export function sanitizeJSON(input: any): any {
  try {
    if (typeof input === 'string') {
      input = JSON.parse(input);
    }

    if (typeof input === 'object' && input !== null) {
      return sanitizeObjectRecursively(input);
    }

    return null;
  } catch (error) {
    console.error('JSON sanitization failed:', error);
    return null;
  }
}

/**
 * Recursively sanitize object properties
 */
function sanitizeObjectRecursively(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObjectRecursively(item));
  }

  if (typeof obj === 'object' && obj !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const sanitizedKey = sanitizeInput(key);
      if (sanitizedKey) {
        if (typeof value === 'string') {
          sanitized[sanitizedKey] = sanitizeInput(value);
        } else {
          sanitized[sanitizedKey] = sanitizeObjectRecursively(value);
        }
      }
    }
    return sanitized;
  }

  if (typeof obj === 'string') {
    return sanitizeInput(obj);
  }

  return obj;
}

/**
 * Generate secure random string
 */
export function generateSecureToken(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate URL for safe redirection
 */
export function validateRedirectURL(url: string): boolean {
  try {
    const parsed = new URL(url);
    
    // Only allow HTTPS in production
    if (process.env.NODE_ENV === 'production' && parsed.protocol !== 'https:') {
      return false;
    }

    // Allow localhost for development
    if (process.env.NODE_ENV === 'development' && 
        (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1')) {
      return true;
    }

    // Allow same origin
    if (parsed.origin === window.location.origin) {
      return true;
    }

    // Allow specific trusted domains
    const trustedDomains = [
      'astraldraft.netlify.app',
      'accounts.google.com',
      'oauth.googleapis.com'
    ];

    return trustedDomains.includes(parsed.hostname);
  } catch (error) {
    return false;
  }
}

/**
 * Rate limiting for client-side operations
 */
export class ClientRateLimit {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < this.windowMs);
    
    // Check if under the limit
    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }

    // Record this attempt
    validAttempts.push(now);
    this.attempts.set(identifier, validAttempts);
    
    return true;
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

/**
 * Secure session storage wrapper
 */
export class SecureStorage {
  private static encrypt(data: string, key: string): string {
    // Simple XOR encryption (for demo - use proper encryption in production)
    let encrypted = '';
    for (let i = 0; i < data.length; i++) {
      encrypted += String.fromCharCode(
        data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return btoa(encrypted);
  }

  private static decrypt(encryptedData: string, key: string): string {
    try {
      const data = atob(encryptedData);
      let decrypted = '';
      for (let i = 0; i < data.length; i++) {
        decrypted += String.fromCharCode(
          data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
      }
      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error);
      return '';
    }
  }

  static setItem(key: string, value: any, encryptionKey?: string): void {
    try {
      const serialized = JSON.stringify(value);
      const data = encryptionKey ? this.encrypt(serialized, encryptionKey) : serialized;
      sessionStorage.setItem(key, data);
    } catch (error) {
      console.error('Secure storage set failed:', error);
    }
  }

  static getItem(key: string, encryptionKey?: string): any {
    try {
      const data = sessionStorage.getItem(key);
      if (!data) return null;

      const serialized = encryptionKey ? this.decrypt(data, encryptionKey) : data;
      return JSON.parse(serialized);
    } catch (error) {
      console.error('Secure storage get failed:', error);
      return null;
    }
  }

  static removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }
}

// Export instances for common use cases
export const apiRateLimit = new ClientRateLimit(10, 60000); // 10 requests per minute
export const loginRateLimit = new ClientRateLimit(5, 300000); // 5 attempts per 5 minutes

// Security validation functions
export const SecurityValidators = {
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  },

  isValidPassword: (password: string): boolean => {
    // At least 8 characters, with uppercase, lowercase, number, and special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },

  isValidUsername: (username: string): boolean => {
    // 3-20 characters, alphanumeric and underscores only
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  },

  isValidTeamName: (teamName: string): boolean => {
    // 1-30 characters, no special characters except spaces, hyphens, and apostrophes
    const teamNameRegex = /^[a-zA-Z0-9\s\-']{1,30}$/;
    return teamNameRegex.test(teamName);
  }
};

export default {
  SECURITY_CONFIG,
  buildCSPString,
  sanitizeHTML,
  sanitizeInput,
  sanitizeJSON,
  generateSecureToken,
  validateRedirectURL,
  ClientRateLimit,
  SecureStorage,
  SecurityValidators,
  apiRateLimit,
  loginRateLimit
};