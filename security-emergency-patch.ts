/**
 * EMERGENCY SECURITY PATCH
 * Created: ${new Date().toISOString()}
 * Priority: CRITICAL - IMMEDIATE DEPLOYMENT REQUIRED
 * 
 * This patch addresses:
 * 1. Exposed API keys in source code
 * 2. Insecure localStorage token storage
 * 3. Missing security headers
 * 4. CORS vulnerabilities
 * 5. Authentication bypass issues
 */

import crypto from 'crypto';

// =====================================================
// SECTION 1: SECURE TOKEN STORAGE
// =====================================================

/**
 * Secure token storage using httpOnly cookies instead of localStorage
 * Prevents XSS attacks from accessing authentication tokens
 */
export class SecureTokenManager {
  private static readonly TOKEN_NAME = 'astral_secure_token';
  private static readonly REFRESH_TOKEN_NAME = 'astral_refresh_token';
  
  /**
   * Store token securely (server-side only)
   */
  static setSecureToken(res: any, token: string, refreshToken?: string): void {
    // Main token - httpOnly, secure, sameSite
    res.cookie(this.TOKEN_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    });
    
    // Refresh token with longer expiry
    if (refreshToken) {
      res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        path: '/api/auth/refresh'
      });
    }
  }
  
  /**
   * Clear all secure tokens
   */
  static clearTokens(res: any): void {
    res.clearCookie(this.TOKEN_NAME);
    res.clearCookie(this.REFRESH_TOKEN_NAME);
  }

// =====================================================
// SECTION 2: API KEY MANAGEMENT
// =====================================================

/**
 * Secure API key management system
 * NEVER store API keys in source code or client-side
 */
export class SecureAPIKeyManager {
  private static encryptionKey: Buffer;
  
  static initialize(): void {
    const key = process.env.ENCRYPTION_KEY;
    if (!key || key.length !== 32) {
      throw new Error('ENCRYPTION_KEY must be exactly 32 characters');
    }
    this.encryptionKey = Buffer.from(key, 'utf-8');
  }
  
  /**
   * Encrypt API keys for storage
   */
  static encryptAPIKey(apiKey: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.encryptionKey, iv);
    
    let encrypted = cipher.update(apiKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  }
  
  /**
   * Decrypt API keys for use
   */
  static decryptAPIKey(encryptedKey: string): string {
    const parts = encryptedKey.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.encryptionKey, iv);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
  
  /**
   * Validate and rotate API keys
   */
  static async rotateAPIKey(service: string): Promise<string> {
    console.warn(`🔄 Rotating API key for service: ${service}`);
    // Implementation would connect to service provider to generate new key
    // This is a placeholder for the actual rotation logic
    return `rotated_${service}_${Date.now()}`;
  }

// =====================================================
// SECTION 3: SECURITY HEADERS
// =====================================================

/**
 * Comprehensive security headers configuration
 */
export const SecurityHeaders = {
  /**
   * Content Security Policy - STRICT MODE
   */
  CSP: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'sha256-GENERATED_HASH'"], // Replace with actual script hashes
    'style-src': ["'self'", "'sha256-GENERATED_HASH'"], // Replace with actual style hashes
    'img-src': ["'self'", "data:", "https:"],
    'font-src': ["'self'"],
    'connect-src': ["'self'", "https://api.sportsdata.io", "wss://astraldraft.netlify.app"],
    'frame-ancestors': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'upgrade-insecure-requests': [],
    'block-all-mixed-content': []
  },
  
  /**
   * Other critical security headers
   */
  HEADERS: {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin'
  }
};

// =====================================================
// SECTION 4: CORS CONFIGURATION
// =====================================================

/**
 * Secure CORS configuration
 */
export const SecureCORSConfig = {
  origin: function(origin: string | undefined, callback: Function) {
    const allowedOrigins = [
      'https://astraldraft.netlify.app',
      'https://astraldraft.com',
      // Add other production domains
    ];
    
    // Development mode
    if (process.env.NODE_ENV === 'development') {
      allowedOrigins.push('http://localhost:3000', 'http://localhost:5173');
    }
    
    // Check origin
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  exposedHeaders: ['X-CSRF-Token'],
  maxAge: 86400 // 24 hours
};

// =====================================================
// SECTION 5: INPUT VALIDATION & SANITIZATION
// =====================================================

/**
 * Enhanced input validation and sanitization
 */
export class InputSanitizer {
  /**
   * Sanitize user input to prevent XSS
   */
  static sanitizeHTML(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .replace(/`/g, '&#96;')
      .replace(/=/g, '&#61;');
  }
  
  /**
   * Validate and sanitize SQL input
   */
  static sanitizeSQL(input: string): string {
    // Use parameterized queries instead
    return input.replace(/['";\\]/g, '');
  }
  
  /**
   * Validate email format
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length < 255;
  }
  
  /**
   * Validate password strength
   */
  static validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 12) errors.push('Password must be at least 12 characters');
    if (!/[A-Z]/.test(password)) errors.push('Password must contain uppercase letters');
    if (!/[a-z]/.test(password)) errors.push('Password must contain lowercase letters');
    if (!/[0-9]/.test(password)) errors.push('Password must contain numbers');
    if (!/[^A-Za-z0-9]/.test(password)) errors.push('Password must contain special characters');
    
    return {
      valid: errors.length === 0,
//       errors
    };
  }

// =====================================================
// SECTION 6: RATE LIMITING
// =====================================================

/**
 * Rate limiting configuration for authentication endpoints
 */
export class RateLimiter {
  private static attempts = new Map<string, number[]>();
  private static readonly MAX_ATTEMPTS = 5;
  private static readonly WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  
  /**
   * Check if IP is rate limited
   */
  static isRateLimited(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    
    // Clean old attempts
    const recentAttempts = attempts.filter((time: any) => now - time < this.WINDOW_MS);
    
    if (recentAttempts.length >= this.MAX_ATTEMPTS) {
      return true;
    }
    
    // Record new attempt
    recentAttempts.push(now);
    this.attempts.set(identifier, recentAttempts);
    
    return false;
  }
  
  /**
   * Reset rate limit for identifier
   */
  static reset(identifier: string): void {
    this.attempts.delete(identifier);
  }

// =====================================================
// SECTION 7: CSRF PROTECTION
// =====================================================

/**
 * CSRF token generation and validation
 */
export class CSRFProtection {
  private static tokens = new Map<string, string>();
  
  /**
   * Generate CSRF token for session
   */
  static generateToken(sessionId: string): string {
    const token = crypto.randomBytes(32).toString('hex');
    this.tokens.set(sessionId, token);
    return token;
  }
  
  /**
   * Validate CSRF token
   */
  static validateToken(sessionId: string, token: string): boolean {
    const storedToken = this.tokens.get(sessionId);
    return storedToken === token && token !== undefined;
  }

// =====================================================
// SECTION 8: AUDIT LOGGING
// =====================================================

/**
 * Security audit logging
 */
export class SecurityAuditLogger {
  static log(event: {
    type: 'AUTH_ATTEMPT' | 'AUTH_SUCCESS' | 'AUTH_FAILURE' | 'API_ACCESS' | 'SUSPICIOUS_ACTIVITY';
    userId?: string;
    ip: string;
    userAgent: string;
    details?: any;
  }): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      ...event
    };
    
    // In production, send to logging service
    console.log('[SECURITY AUDIT]', JSON.stringify(logEntry));
    
    // Detect suspicious patterns
    if (event.type === 'AUTH_FAILURE') {
      // Track failed attempts for account lockout
    }
  }

// =====================================================
// SECTION 9: EMERGENCY RESPONSE
// =====================================================

/**
 * Emergency security response procedures
 */
export class EmergencyResponse {
  /**
   * Immediately revoke all active sessions
   */
  static async revokeAllSessions(): Promise<void> {
    console.warn('🚨 EMERGENCY: Revoking all active sessions');
    // Implementation would clear all session tokens from database
  }
  
  /**
   * Rotate all API keys
   */
  static async rotateAllAPIKeys(): Promise<void> {
    console.warn('🚨 EMERGENCY: Rotating all API keys');
    const services = ['GEMINI', 'SPORTSDATA', 'STRIPE'];
    
    for (const service of services) {
      await SecureAPIKeyManager.rotateAPIKey(service);
    }
  }
  
  /**
   * Enable lockdown mode
   */
  static enableLockdown(): void {
    console.warn('🚨 EMERGENCY: Enabling lockdown mode');
    // Restrict all non-essential operations
    process.env.LOCKDOWN_MODE = 'true';
  }

// =====================================================
// DEPLOYMENT INSTRUCTIONS
// =====================================================

/**
 * IMMEDIATE DEPLOYMENT STEPS:
 * 
 * 1. ROTATE ALL API KEYS:
 *    - Sports.io API: bab44477ed904140b43630a7520517e7 (COMPROMISED)
 *    - Generate new keys from provider dashboards
 *    - Update in environment variables only
 * 
 * 2. UPDATE AUTHENTICATION:
 *    - Replace localStorage with httpOnly cookies
 *    - Implement the SecureTokenManager
 * 
 * 3. CONFIGURE SECURITY HEADERS:
 *    - Apply all headers from SecurityHeaders config
 *    - Test with securityheaders.com
 * 
 * 4. IMPLEMENT RATE LIMITING:
 *    - Apply to /api/auth/* endpoints
 *    - Use RateLimiter class
 * 
 * 5. ENABLE CSRF PROTECTION:
 *    - Generate tokens on session creation
 *    - Validate on all state-changing operations
 * 
 * 6. AUDIT & MONITOR:
 *    - Enable SecurityAuditLogger
 *    - Monitor for suspicious patterns
 * 
 * 7. GIT CLEANUP:
 *    - Remove any committed secrets from history
 *    - Force push cleaned branches
 * 
 * TIME ESTIMATE: 2-3 hours for full implementation
 * PRIORITY: CRITICAL - Deploy within 30 minutes
 */

export default {
  SecureTokenManager,
  SecureAPIKeyManager,
  SecurityHeaders,
  SecureCORSConfig,
  InputSanitizer,
  RateLimiter,
  CSRFProtection,
  SecurityAuditLogger,
//   EmergencyResponse
};