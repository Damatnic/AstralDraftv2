/**
 * Advanced Security Configuration
 * Implements enterprise-grade security measures
 */

// Content Security Policy Headers
export const ADVANCED_CSP_CONFIG = {
}
  directives: {
}
    &apos;default-src&apos;: ["&apos;self&apos;"],
    &apos;script-src&apos;: [
      "&apos;self&apos;",
      "&apos;unsafe-inline&apos;", // Required for React dev tools
      &apos;https://cdn.jsdelivr.net&apos;, // For CDN resources
      &apos;blob:&apos;, // For dynamic imports
    ],
    &apos;style-src&apos;: [
      "&apos;self&apos;",
      "&apos;unsafe-inline&apos;", // Required for styled-components
      &apos;https://fonts.googleapis.com&apos;,
    ],
    &apos;img-src&apos;: [
      "&apos;self&apos;",
      &apos;data:&apos;, // For base64 images
      &apos;https:&apos;, // Allow HTTPS images
      &apos;blob:&apos;, // For generated images
    ],
    &apos;font-src&apos;: [
      "&apos;self&apos;",
      &apos;https://fonts.gstatic.com&apos;,
      &apos;data:&apos;, // For base64 fonts
    ],
    &apos;connect-src&apos;: [
      "&apos;self&apos;",
      &apos;https:&apos;, // Allow HTTPS API calls
      &apos;wss:&apos;, // WebSocket connections
      &apos;ws:&apos;, // Local WebSocket connections
    ],
    &apos;object-src&apos;: ["&apos;none&apos;"], // Block plugins
    &apos;base-uri&apos;: ["&apos;self&apos;"], // Restrict base tag
    &apos;form-action&apos;: ["&apos;self&apos;"], // Restrict form submissions
    &apos;frame-ancestors&apos;: ["&apos;none&apos;"], // Prevent framing
    &apos;manifest-src&apos;: ["&apos;self&apos;"], // PWA manifest
    &apos;worker-src&apos;: ["&apos;self&apos;", &apos;blob:&apos;], // Service workers
  },
};

// Security Headers Configuration
export const SECURITY_HEADERS = {
}
  // Prevent XSS attacks
  &apos;X-XSS-Protection&apos;: &apos;1; mode=block&apos;,
  
  // Prevent content type sniffing
  &apos;X-Content-Type-Options&apos;: &apos;nosniff&apos;,
  
  // Prevent clickjacking
  &apos;X-Frame-Options&apos;: &apos;DENY&apos;,
  
  // Referrer policy for privacy
  &apos;Referrer-Policy&apos;: &apos;strict-origin-when-cross-origin&apos;,
  
  // HSTS for HTTPS enforcement
  &apos;Strict-Transport-Security&apos;: &apos;max-age=31536000; includeSubDomains; preload&apos;,
  
  // Feature policy restrictions
  &apos;Permissions-Policy&apos;: [
    &apos;camera=()&apos;,
    &apos;microphone=()&apos;,
    &apos;geolocation=()&apos;,
    &apos;interest-cohort=()&apos;, // Block FLoC
  ].join(&apos;, &apos;),
  
  // Cross-origin policies
  &apos;Cross-Origin-Embedder-Policy&apos;: &apos;require-corp&apos;,
  &apos;Cross-Origin-Opener-Policy&apos;: &apos;same-origin&apos;,
  &apos;Cross-Origin-Resource-Policy&apos;: &apos;same-origin&apos;,
};

// Input Sanitization Rules
export const SANITIZATION_CONFIG = {
}
  allowedTags: [
    &apos;b&apos;, &apos;i&apos;, &apos;em&apos;, &apos;strong&apos;, &apos;a&apos;, &apos;p&apos;, &apos;br&apos;, &apos;ul&apos;, &apos;ol&apos;, &apos;li&apos;,
    &apos;blockquote&apos;, &apos;code&apos;, &apos;pre&apos;, &apos;h1&apos;, &apos;h2&apos;, &apos;h3&apos;, &apos;h4&apos;, &apos;h5&apos;, &apos;h6&apos;
  ],
  allowedAttributes: {
}
    &apos;a&apos;: [&apos;href&apos;, &apos;title&apos;, &apos;target&apos;],
    &apos;*&apos;: [&apos;class&apos;, &apos;id&apos;]
  },
  allowedSchemes: [&apos;http&apos;, &apos;https&apos;, &apos;mailto&apos;],
  stripIgnoreTag: true,
  stripIgnoreTagBody: [&apos;script&apos;, &apos;style&apos;]
};

// Rate Limiting Configuration
export const RATE_LIMIT_CONFIG = {
}
  // API endpoints
  &apos;/api/auth/login&apos;: { requests: 5, window: 15 * 60 * 1000 }, // 5 per 15min
  &apos;/api/auth/register&apos;: { requests: 3, window: 60 * 60 * 1000 }, // 3 per hour
  &apos;/api/auth/forgot-password&apos;: { requests: 3, window: 60 * 60 * 1000 },
  &apos;/api/draft/pick&apos;: { requests: 100, window: 60 * 1000 }, // 100 per minute
  &apos;/api/trades/propose&apos;: { requests: 10, window: 60 * 1000 }, // 10 per minute
  &apos;/api/chat/send&apos;: { requests: 30, window: 60 * 1000 }, // 30 per minute
  &apos;/api/*&apos;: { requests: 1000, window: 60 * 60 * 1000 }, // Default: 1000 per hour
};

// Password Policy
export const PASSWORD_POLICY = {
}
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
}
  name: &apos;__Host-session&apos;, // Secure prefix
  httpOnly: true,
  secure: true, // HTTPS only
  sameSite: &apos;strict&apos; as const,
  maxAge: 2 * 60 * 60 * 1000, // 2 hours
  rolling: true, // Extend on activity
  regenerateOnSignIn: true,
};

// API Key Management
export const API_KEY_POLICY = {
}
  rotationInterval: 90 * 24 * 60 * 60 * 1000, // 90 days
  keyLength: 64, // bytes
  algorithm: &apos;HS256&apos;,
  issuer: &apos;astral-draft-api&apos;,
  audience: &apos;astral-draft-client&apos;,
};

// Audit Logging Configuration
export const AUDIT_CONFIG = {
}
  events: [
    &apos;user.login&apos;,
    &apos;user.logout&apos;,
    &apos;user.failed_login&apos;,
    &apos;user.password_change&apos;,
    &apos;user.email_change&apos;,
    &apos;admin.user_action&apos;,
    &apos;trade.proposed&apos;,
    &apos;trade.accepted&apos;,
    &apos;trade.rejected&apos;,
    &apos;draft.pick_made&apos;,
    &apos;league.settings_changed&apos;,
  ],
  retention: 365 * 24 * 60 * 60 * 1000, // 1 year
  encryption: true,
  anonymization: {
}
    after: 90 * 24 * 60 * 60 * 1000, // 90 days
    fields: [&apos;ip_address&apos;, &apos;user_agent&apos;]
  },
};

// Environment-specific Security
export const ENVIRONMENT_SECURITY = {
}
  development: {
}
    enableCSP: false, // Too restrictive for dev
    enableHSTS: false,
    allowHttp: true,
    debugMode: true,
  },
  staging: {
}
    enableCSP: true,
    enableHSTS: true,
    allowHttp: false,
    debugMode: false,
    testingHeaders: true,
  },
  production: {
}
    enableCSP: true,
    enableHSTS: true,
    allowHttp: false,
    debugMode: false,
    securityReporting: true,
    monitoring: true,
  },
};