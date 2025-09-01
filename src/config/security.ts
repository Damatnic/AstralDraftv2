/**
 * Security Configuration
 * Centralized security policies and settings
 */

export const SECURITY_CONFIG = {
}
  // Content Security Policy
  csp: {
}
    directives: {
}
      &apos;default-src&apos;: ["&apos;self&apos;"],
      &apos;script-src&apos;: [
        "&apos;self&apos;",
        "&apos;unsafe-inline&apos;", // Required for Vite development
        "&apos;unsafe-eval&apos;", // Required for some React features
        &apos;https://cdn.jsdelivr.net&apos;,
        &apos;https://accounts.google.com&apos;,
        &apos;https://apis.google.com&apos;,
        &apos;chrome-extension:&apos;,
        &apos;moz-extension:&apos;,
        &apos;safari-extension:&apos;
      ],
      &apos;style-src&apos;: [
        "&apos;self&apos;",
        "&apos;unsafe-inline&apos;",
        &apos;https://fonts.googleapis.com&apos;,
        &apos;https://fonts.gstatic.com&apos;
      ],
      &apos;font-src&apos;: [
        "&apos;self&apos;",
        &apos;https://fonts.googleapis.com&apos;,
        &apos;https://fonts.gstatic.com&apos;,
        &apos;data:&apos;
      ],
      &apos;img-src&apos;: [
        "&apos;self&apos;",
        &apos;data:&apos;,
        &apos;blob:&apos;,
        &apos;https:&apos;,
        &apos;https://*.espn.com&apos;,
        &apos;https://*.nfl.com&apos;,
        &apos;https://*.googleapis.com&apos;
      ],
      &apos;connect-src&apos;: [
        "&apos;self&apos;",
        &apos;ws://localhost:*&apos;,
        &apos;wss://localhost:*&apos;,
        &apos;http://localhost:*&apos;,
        &apos;https://localhost:*&apos;,
        &apos;https://astraldraft.netlify.app&apos;,
        &apos;wss://astraldraft.netlify.app&apos;,
        &apos;https://api.gemini.com&apos;,
        &apos;https://generativelanguage.googleapis.com&apos;,
        &apos;https://*.espn.com&apos;,
        &apos;https://api.the-odds-api.com&apos;,
        &apos;https://api.sportsdata.io&apos;,
        &apos;https://accounts.google.com&apos;,
        &apos;https://oauth.googleapis.com&apos;,
        &apos;https://www.googleapis.com&apos;,
        &apos;chrome-extension:&apos;,
        &apos;moz-extension:&apos;,
        &apos;safari-extension:&apos;
      ],
      &apos;manifest-src&apos;: ["&apos;self&apos;"],
      &apos;worker-src&apos;: ["&apos;self&apos;", &apos;blob:&apos;],
      &apos;object-src&apos;: ["&apos;none&apos;"],
      &apos;base-uri&apos;: ["&apos;self&apos;"],
      &apos;form-action&apos;: ["&apos;self&apos;", &apos;https://accounts.google.com&apos;],
      &apos;frame-src&apos;: ["&apos;self&apos;", &apos;https://accounts.google.com&apos;, &apos;https://oauth.googleapis.com&apos;],
      &apos;media-src&apos;: ["&apos;self&apos;", &apos;data:&apos;, &apos;blob:&apos;],
      &apos;upgrade-insecure-requests&apos;: []
    }
  },

  // Security Headers
  headers: {
}
    &apos;X-Content-Type-Options&apos;: &apos;nosniff&apos;,
    &apos;X-XSS-Protection&apos;: &apos;1; mode=block&apos;,
    &apos;Referrer-Policy&apos;: &apos;strict-origin-when-cross-origin&apos;,
    &apos;Permissions-Policy&apos;: [
      &apos;accelerometer=()&apos;,
      &apos;ambient-light-sensor=()&apos;,
      &apos;autoplay=(self)&apos;,
      &apos;battery=()&apos;,
      &apos;camera=()&apos;,
      &apos;cross-origin-isolated=()&apos;,
      &apos;display-capture=()&apos;,
      &apos;document-domain=()&apos;,
      &apos;encrypted-media=()&apos;,
      &apos;execution-while-not-rendered=()&apos;,
      &apos;execution-while-out-of-viewport=()&apos;,
      &apos;fullscreen=(self)&apos;,
      &apos;geolocation=()&apos;,
      &apos;gyroscope=()&apos;,
      &apos;keyboard-map=()&apos;,
      &apos;magnetometer=()&apos;,
      &apos;microphone=()&apos;,
      &apos;midi=()&apos;,
      &apos;navigation-override=()&apos;,
      &apos;payment=()&apos;,
      &apos;picture-in-picture=()&apos;,
      &apos;publickey-credentials-get=()&apos;,
      &apos;screen-wake-lock=()&apos;,
      &apos;sync-xhr=()&apos;,
      &apos;usb=()&apos;,
      &apos;web-share=()&apos;,
      &apos;xr-spatial-tracking=()&apos;
    ].join(&apos;, &apos;)
  },

  // API Security
  api: {
}
    rateLimiting: {
}
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100, // per window
      skipSuccessfulRequests: false,
      skipFailedRequests: false
    },
    encryption: {
}
      algorithm: &apos;AES-GCM&apos;,
      keyLength: 256
    },
    authentication: {
}
      tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours
      refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
      maxLoginAttempts: 5,
      lockoutDuration: 15 * 60 * 1000 // 15 minutes
    }
  },

  // Input Validation
  validation: {
}
    maxInputLength: 10000,
    allowedTags: [], // No HTML tags allowed by default
    allowedAttributes: [],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: [&apos;image/jpeg&apos;, &apos;image/png&apos;, &apos;image/gif&apos;, &apos;image/webp&apos;],
    sanitizeOptions: {
}
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
}
    encryptSensitiveData: true,
    maskPII: true,
    logRetentionDays: 30,
    anonymizeAfterDays: 90,
    purgeAfterDays: 365,
    sensitiveFields: [
      &apos;password&apos;,
      &apos;email&apos;,
      &apos;phone&apos;,
      &apos;ssn&apos;,
      &apos;creditCard&apos;,
      &apos;apiKey&apos;,
      &apos;token&apos;,
      &apos;secret&apos;
    ]
  },

  // Session Security
  session: {
}
    secure: true, // HTTPS only in production
    httpOnly: true,
    sameSite: &apos;strict&apos; as const,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    regenerateOnLogin: true,
    regenerateOnPrivilegeChange: true
  },

  // Environment-specific settings
  development: {
}
    enableSecurityLogging: true,
    allowInsecureConnections: true,
    disableCSP: false,
    enableDebugEndpoints: false
  },

  production: {
}
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
}
  // Generate CSP string from configuration
  generateCSP(): string {
}
    const directives = SECURITY_CONFIG.csp.directives;
    return Object.entries(directives)
      .map(([directive, sources]) => {
}
        if (sources.length === 0) {
}
          return directive;
        }
        return `${directive} ${sources.join(&apos; &apos;)}`;
      })
      .join(&apos;; &apos;);
  },

  // Validate environment-specific security settings
  validateSecurityConfig(): {
}
    isValid: boolean;
    warnings: string[];
    errors: string[];
  } {
}
    const warnings: string[] = [];
    const errors: string[] = [];
    
    const isProduction = import.meta.env.PROD;
    
    if (isProduction) {
}
      // Production-specific validation
      if (SECURITY_CONFIG.development.allowInsecureConnections) {
}
        warnings.push(&apos;Insecure connections allowed in production&apos;);
      }
      
      if (SECURITY_CONFIG.development.enableDebugEndpoints) {
}
        errors.push(&apos;Debug endpoints enabled in production&apos;);
      }
      
      if (!SECURITY_CONFIG.production.enableHSTS) {
}
        warnings.push(&apos;HSTS not enabled in production&apos;);
      }
    } else {
}
      // Development-specific validation
      if (!SECURITY_CONFIG.development.enableSecurityLogging) {
}
        warnings.push(&apos;Security logging disabled in development&apos;);
      }
    }

    // General validation
    if (SECURITY_CONFIG.api.authentication.tokenExpiry < 60000) {
}
      warnings.push(&apos;Token expiry less than 1 minute may cause UX issues&apos;);
    }

    if (SECURITY_CONFIG.validation.maxInputLength > 100000) {
}
      warnings.push(&apos;Very large input length limit may impact performance&apos;);
    }

    return {
}
      isValid: errors.length === 0,
      warnings,
//       errors
    };
  },

  // Get current security level
  getSecurityLevel(): &apos;development&apos; | &apos;production&apos; {
}
    return import.meta.env.PROD ? &apos;production&apos; : &apos;development&apos;;
  },

  // Check if feature is enabled for current environment
  isFeatureEnabled(feature: keyof typeof SECURITY_CONFIG.development): boolean {
}
    const level = this.getSecurityLevel();
    return SECURITY_CONFIG[level][feature] || false;
  }
};

// Export security configuration based on environment
export const getCurrentSecurityConfig = () => {
}
  const level = SecurityUtils.getSecurityLevel();
  return {
}
    ...SECURITY_CONFIG,
    current: SECURITY_CONFIG[level]
  };
};

export default SECURITY_CONFIG;