/**
 * Security Configuration
 * Centralized security policies and settings
 */

export const SECURITY_CONFIG = {
  // Content Security Policy
  csp: {
    directives: {
      'default-src': ["'self'"],
      'script-src': [
        "'self'",
        "'unsafe-inline'", // Required for Vite development
        "'unsafe-eval'", // Required for some React features
        'https://cdn.jsdelivr.net',
        'https://accounts.google.com',
        'https://apis.google.com',
        'chrome-extension:',
        'moz-extension:',
        'safari-extension:'
      ],
      'style-src': [
        "'self'",
        "'unsafe-inline'",
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
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'", 'https://accounts.google.com'],
      'frame-src': ["'self'", 'https://accounts.google.com', 'https://oauth.googleapis.com'],
      'media-src': ["'self'", 'data:', 'blob:'],
      'upgrade-insecure-requests': []
    }
  },

  // Security Headers
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
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
    ].join(', ')
  },

  // API Security
  api: {
    rateLimiting: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100, // per window
      skipSuccessfulRequests: false,
      skipFailedRequests: false
    },
    encryption: {
      algorithm: 'AES-GCM',
      keyLength: 256
    },
    authentication: {
      tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours
      refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
      maxLoginAttempts: 5,
      lockoutDuration: 15 * 60 * 1000 // 15 minutes
    }
  },

  // Input Validation
  validation: {
    maxInputLength: 10000,
    allowedTags: [], // No HTML tags allowed by default
    allowedAttributes: [],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    sanitizeOptions: {
      removeScripts: true,
      removeObjects: true,
      removeEmbeds: true,
      removeIframes: true,
      removeForms: true,
      removeLinks: false
    }
  },

  // Data Protection
  dataProtection: {
    encryptSensitiveData: true,
    maskPII: true,
    logRetentionDays: 30,
    anonymizeAfterDays: 90,
    purgeAfterDays: 365,
    sensitiveFields: [
      'password',
      'email',
      'phone',
      'ssn',
      'creditCard',
      'apiKey',
      'token',
      'secret'
    ]
  },

  // Session Security
  session: {
    secure: true, // HTTPS only in production
    httpOnly: true,
    sameSite: 'strict' as const,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    regenerateOnLogin: true,
    regenerateOnPrivilegeChange: true
  },

  // Environment-specific settings
  development: {
    enableSecurityLogging: true,
    allowInsecureConnections: true,
    disableCSP: false,
    enableDebugEndpoints: false
  },

  production: {
    enableSecurityLogging: true,
    allowInsecureConnections: false,
    disableCSP: false,
    enableDebugEndpoints: false,
    enableHSTS: true,
    hstsMaxAge: 31536000, // 1 year
    hstsIncludeSubdomains: true,
    hstsPreload: true
  }
} as const;

// Security utility functions
export const SecurityUtils = {
  // Generate CSP string from configuration
  generateCSP(): string {
    const directives = SECURITY_CONFIG.csp.directives;
    return Object.entries(directives)
      .map(([directive, sources]) => {
        if (sources.length === 0) {
          return directive;
        }
        return `${directive} ${sources.join(' ')}`;
      })
      .join('; ');
  },

  // Validate environment-specific security settings
  validateSecurityConfig(): {
    isValid: boolean;
    warnings: string[];
    errors: string[];
  } {
    const warnings: string[] = [];
    const errors: string[] = [];
    
    const isProduction = import.meta.env.PROD;
    
    if (isProduction) {
      // Production-specific validation
      if (SECURITY_CONFIG.development.allowInsecureConnections) {
        warnings.push('Insecure connections allowed in production');
      }
      
      if (SECURITY_CONFIG.development.enableDebugEndpoints) {
        errors.push('Debug endpoints enabled in production');
      }
      
      if (!SECURITY_CONFIG.production.enableHSTS) {
        warnings.push('HSTS not enabled in production');
      }
    } else {
      // Development-specific validation
      if (!SECURITY_CONFIG.development.enableSecurityLogging) {
        warnings.push('Security logging disabled in development');
      }
    }

    // General validation
    if (SECURITY_CONFIG.api.authentication.tokenExpiry < 60000) {
      warnings.push('Token expiry less than 1 minute may cause UX issues');
    }

    if (SECURITY_CONFIG.validation.maxInputLength > 100000) {
      warnings.push('Very large input length limit may impact performance');
    }

    return {
      isValid: errors.length === 0,
      warnings,
      errors
    };
  },

  // Get current security level
  getSecurityLevel(): 'development' | 'production' {
    return import.meta.env.PROD ? 'production' : 'development';
  },

  // Check if feature is enabled for current environment
  isFeatureEnabled(feature: keyof typeof SECURITY_CONFIG.development): boolean {
    const level = this.getSecurityLevel();
    return SECURITY_CONFIG[level][feature] || false;
  }
};

// Export security configuration based on environment
export const getCurrentSecurityConfig = () => {
  const level = SecurityUtils.getSecurityLevel();
  return {
    ...SECURITY_CONFIG,
    current: SECURITY_CONFIG[level]
  };
};

export default SECURITY_CONFIG;