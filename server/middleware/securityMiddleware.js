/**
 * Security Middleware Collection
 * Comprehensive security middleware for request protection, validation, and monitoring
 */

const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const csrf = require('csrf');
const crypto = require('crypto');
const geoip = require('geoip-lite');
const inputValidationService = require('../services/inputValidationService');
const securityAuditService = require('../services/securityAuditService');

// Initialize CSRF protection
const csrfProtection = csrf();

class SecurityMiddleware {
  constructor() {
    this.suspiciousIPs = new Set();
    this.blockedIPs = new Set();
    this.rateLimitStore = new Map();
    this.csrfTokens = new Map();
    
    // Bot detection patterns
    this.botPatterns = [
      /bot/i, /crawler/i, /spider/i, /scraper/i,
      /curl/i, /wget/i, /python/i, /java/i,
      /selenium/i, /phantom/i, /headless/i
    ];

    // Malicious patterns in requests
    this.maliciousPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /onload\s*=/gi,
      /onerror\s*=/gi,
      /eval\s*\(/gi,
      /union\s+select/gi,
      /drop\s+table/gi,
      /delete\s+from/gi,
      /insert\s+into/gi
    ];
  }

  /**
   * Advanced Rate Limiting
   */
  createAdvancedRateLimit(options = {}) {
    const {
      windowMs = 15 * 60 * 1000, // 15 minutes
      max = 100,
      skipSuccessfulRequests = false,
      skipFailedRequests = false,
      keyGenerator = null
    } = options;

    return rateLimit({
      windowMs,
      max,
      skipSuccessfulRequests,
      skipFailedRequests,
      keyGenerator: keyGenerator || ((req) => {
        // Use user ID if authenticated, otherwise IP
        return req.userId || this.getClientIP(req);
      }),
      handler: async (req, res) => {
        const clientIP = this.getClientIP(req);
        
        // Log rate limit violation
        await securityAuditService.logSecurityEvent('RATE_LIMIT_EXCEEDED', {
          ip: clientIP,
          userAgent: req.get('User-Agent'),
          endpoint: req.path,
          limit: max,
          window: windowMs
        }, req);

        // Add IP to suspicious list if repeatedly hitting limits
        this.flagSuspiciousIP(clientIP);

        res.status(429).json({
          error: 'Too many requests',
          retryAfter: Math.round(windowMs / 1000),
          message: 'You have exceeded the rate limit. Please try again later.'
        });
      },
      standardHeaders: true,
      legacyHeaders: false
    });
  }

  /**
   * Speed Limiting (Progressive Delay)
   */
  createSpeedLimit(options = {}) {
    const {
      windowMs = 15 * 60 * 1000,
      delayAfter = 50,
      delayMs = 500,
      maxDelayMs = 20000
    } = options;

    return slowDown({
      windowMs,
      delayAfter,
      delayMs,
      maxDelayMs,
      skipSuccessfulRequests: false,
      onLimitReached: async (req, res) => {
        const clientIP = this.getClientIP(req);
        await securityAuditService.logSecurityEvent('SPEED_LIMIT_REACHED', {
          ip: clientIP,
          endpoint: req.path,
          delayAfter,
          currentDelay: delayMs
        }, req);
      }
    });
  }

  /**
   * CSRF Protection Middleware
   */
  csrfProtection() {
    return async (req, res, next) => {
      try {
        // Skip for GET, HEAD, OPTIONS
        if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
          return next();
        }

        // Skip for API endpoints with proper bearer tokens
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
          return next();
        }

        const token = req.headers['x-csrf-token'] || 
                     req.body._csrf || 
                     req.query._csrf;

        if (!token) {
          return res.status(403).json({ 
            error: 'CSRF token required',
            code: 'CSRF_TOKEN_MISSING'
          });
        }

        // Verify token
        if (!this.verifyCsrfToken(token, req.sessionID || this.getClientIP(req))) {
          await securityAuditService.logSecurityEvent('CSRF_TOKEN_INVALID', {
            ip: this.getClientIP(req),
            token: token.substring(0, 8) + '...',
            endpoint: req.path
          }, req);

          return res.status(403).json({ 
            error: 'Invalid CSRF token',
            code: 'CSRF_TOKEN_INVALID'
          });
        }

        next();
      } catch (error) {
        console.error('CSRF protection error:', error);
        res.status(500).json({ error: 'CSRF validation failed' });
      }
    };
  }

  /**
   * Generate CSRF Token
   */
  generateCsrfToken(sessionId) {
    const secret = process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production';
    const timestamp = Date.now();
    const randomBytes = crypto.randomBytes(16).toString('hex');
    const payload = `${sessionId}:${timestamp}:${randomBytes}`;
    const hash = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    const token = Buffer.from(`${payload}:${hash}`).toString('base64');
    
    // Store token with expiration
    this.csrfTokens.set(token, {
      sessionId,
      timestamp,
      expires: timestamp + (60 * 60 * 1000) // 1 hour
    });
    
    return token;
  }

  /**
   * Verify CSRF Token
   */
  verifyCsrfToken(token, sessionId) {
    try {
      const tokenData = this.csrfTokens.get(token);
      if (!tokenData) return false;

      // Check expiration
      if (Date.now() > tokenData.expires) {
        this.csrfTokens.delete(token);
        return false;
      }

      // Verify session
      if (tokenData.sessionId !== sessionId) {
        return false;
      }

      const decoded = Buffer.from(token, 'base64').toString();
      const [sessionPart, timestamp, randomBytes, hash] = decoded.split(':');
      
      const secret = process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production';
      const expectedHash = crypto.createHmac('sha256', secret)
        .update(`${sessionPart}:${timestamp}:${randomBytes}`)
        .digest('hex');

      return hash === expectedHash;
    } catch (error) {
      return false;
    }
  }

  /**
   * Input Validation Middleware
   */
  validateInput(schema) {
    return async (req, res, next) => {
      try {
        const validation = inputValidationService.validateAPIRequest(req.body, schema);
        
        if (!validation.isValid) {
          await securityAuditService.logSecurityEvent('INPUT_VALIDATION_FAILED', {
            ip: this.getClientIP(req),
            endpoint: req.path,
            errors: validation.errors,
            payload: this.sanitizeLogData(req.body)
          }, req);

          return res.status(400).json({
            error: 'Input validation failed',
            details: validation.errors
          });
        }

        // Replace request body with sanitized data
        req.body = validation.sanitizedData;
        next();
      } catch (error) {
        console.error('Input validation error:', error);
        res.status(500).json({ error: 'Input validation failed' });
      }
    };
  }

  /**
   * XSS Protection Middleware
   */
  xssProtection() {
    return async (req, res, next) => {
      try {
        const suspicious = this.detectXSS(req);
        
        if (suspicious.detected) {
          await securityAuditService.logSecurityEvent('XSS_ATTEMPT_DETECTED', {
            ip: this.getClientIP(req),
            userAgent: req.get('User-Agent'),
            endpoint: req.path,
            patterns: suspicious.patterns,
            payload: this.sanitizeLogData(req.body)
          }, req);

          this.flagSuspiciousIP(this.getClientIP(req));

          return res.status(400).json({
            error: 'Potentially malicious content detected',
            code: 'XSS_DETECTED'
          });
        }

        next();
      } catch (error) {
        console.error('XSS protection error:', error);
        next();
      }
    };
  }

  /**
   * SQL Injection Protection
   */
  sqlInjectionProtection() {
    return async (req, res, next) => {
      try {
        const suspicious = this.detectSQLInjection(req);
        
        if (suspicious.detected) {
          await securityAuditService.logSecurityEvent('SQL_INJECTION_ATTEMPT', {
            ip: this.getClientIP(req),
            userAgent: req.get('User-Agent'),
            endpoint: req.path,
            patterns: suspicious.patterns,
            payload: this.sanitizeLogData(req.body)
          }, req);

          this.flagSuspiciousIP(this.getClientIP(req));

          return res.status(400).json({
            error: 'Potentially malicious query detected',
            code: 'SQL_INJECTION_DETECTED'
          });
        }

        next();
      } catch (error) {
        console.error('SQL injection protection error:', error);
        next();
      }
    };
  }

  /**
   * Bot Detection Middleware
   */
  botDetection() {
    return async (req, res, next) => {
      try {
        const userAgent = req.get('User-Agent') || '';
        const isBot = this.botPatterns.some(pattern => pattern.test(userAgent));
        
        if (isBot) {
          await securityAuditService.logSecurityEvent('BOT_DETECTED', {
            ip: this.getClientIP(req),
            userAgent,
            endpoint: req.path
          }, req);

          // Allow legitimate bots but with restrictions
          if (this.isLegitimateBot(userAgent)) {
            req.isBot = true;
            return next();
          }

          // Block suspicious bots
          return res.status(403).json({
            error: 'Automated requests not allowed',
            code: 'BOT_BLOCKED'
          });
        }

        next();
      } catch (error) {
        console.error('Bot detection error:', error);
        next();
      }
    };
  }

  /**
   * IP Blocking Middleware
   */
  ipBlocking() {
    return async (req, res, next) => {
      try {
        const clientIP = this.getClientIP(req);
        
        if (this.blockedIPs.has(clientIP)) {
          await securityAuditService.logSecurityEvent('BLOCKED_IP_ACCESS_ATTEMPT', {
            ip: clientIP,
            endpoint: req.path
          }, req);

          return res.status(403).json({
            error: 'Access denied',
            code: 'IP_BLOCKED'
          });
        }

        next();
      } catch (error) {
        console.error('IP blocking error:', error);
        next();
      }
    };
  }

  /**
   * Geographic Restrictions
   */
  geoRestriction(allowedCountries = [], blockedCountries = []) {
    return async (req, res, next) => {
      try {
        const clientIP = this.getClientIP(req);
        const geo = geoip.lookup(clientIP);
        
        if (!geo) {
          // Allow if we can't determine location
          return next();
        }

        // Block specific countries
        if (blockedCountries.includes(geo.country)) {
          await securityAuditService.logSecurityEvent('GEO_BLOCKED_ACCESS', {
            ip: clientIP,
            country: geo.country,
            city: geo.city,
            endpoint: req.path
          }, req);

          return res.status(403).json({
            error: 'Access not available in your location',
            code: 'GEO_BLOCKED'
          });
        }

        // Restrict to allowed countries if specified
        if (allowedCountries.length > 0 && !allowedCountries.includes(geo.country)) {
          await securityAuditService.logSecurityEvent('GEO_RESTRICTED_ACCESS', {
            ip: clientIP,
            country: geo.country,
            city: geo.city,
            endpoint: req.path
          }, req);

          return res.status(403).json({
            error: 'Service not available in your location',
            code: 'GEO_RESTRICTED'
          });
        }

        next();
      } catch (error) {
        console.error('Geo restriction error:', error);
        next();
      }
    };
  }

  /**
   * Request Size Limiting
   */
  requestSizeLimit(maxSize = '10mb') {
    return (req, res, next) => {
      const size = parseInt(req.get('content-length')) || 0;
      const maxBytes = this.parseSize(maxSize);

      if (size > maxBytes) {
        securityAuditService.logSecurityEvent('REQUEST_SIZE_EXCEEDED', {
          ip: this.getClientIP(req),
          size,
          maxSize: maxBytes,
          endpoint: req.path
        }, req);

        return res.status(413).json({
          error: 'Request entity too large',
          maxSize: maxSize
        });
      }

      next();
    };
  }

  /**
   * Security Headers Middleware
   */
  securityHeaders() {
    return (req, res, next) => {
      // Content Security Policy
      res.setHeader('Content-Security-Policy', 
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "img-src 'self' data: https:; " +
        "connect-src 'self' wss: ws: https:;"
      );

      // Other security headers
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
      res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
      res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');

      // Remove server information
      res.removeHeader('X-Powered-By');
      
      next();
    };
  }

  /**
   * Helper Methods
   */
  getClientIP(req) {
    return req.ip || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress ||
           '0.0.0.0';
  }

  flagSuspiciousIP(ip) {
    this.suspiciousIPs.add(ip);
    
    // Auto-block after multiple suspicious activities
    setTimeout(() => {
      if (this.suspiciousIPs.has(ip)) {
        this.blockedIPs.add(ip);
        console.warn(`🚨 IP ${ip} has been automatically blocked due to suspicious activity`);
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

  detectXSS(req) {
    const testData = JSON.stringify({
      body: req.body,
      query: req.query,
      params: req.params
    });

    const detectedPatterns = [];
    
    this.maliciousPatterns.forEach((pattern, index) => {
      if (pattern.test(testData)) {
        detectedPatterns.push(`pattern_${index}`);
      }
    });

    return {
      detected: detectedPatterns.length > 0,
      patterns: detectedPatterns
    };
  }

  detectSQLInjection(req) {
    const testData = JSON.stringify({
      body: req.body,
      query: req.query,
      params: req.params
    });

    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
      /(--|\/\*|\*\/)/g,
      /(\bOR\b|\bAND\b).*(\b=\b)/gi,
      /['"`;]/g
    ];

    const detectedPatterns = [];
    
    sqlPatterns.forEach((pattern, index) => {
      if (pattern.test(testData)) {
        detectedPatterns.push(`sql_pattern_${index}`);
      }
    });

    return {
      detected: detectedPatterns.length > 0,
      patterns: detectedPatterns
    };
  }

  isLegitimateBot(userAgent) {
    const legitimateBots = [
      /googlebot/i,
      /bingbot/i,
      /slurp/i, // Yahoo
      /duckduckbot/i,
      /baiduspider/i,
      /yandexbot/i,
      /facebookexternalhit/i,
      /twitterbot/i,
      /linkedinbot/i
    ];

    return legitimateBots.some(pattern => pattern.test(userAgent));
  }

  sanitizeLogData(data) {
    if (!data) return data;
    
    const sanitized = { ...data };
    
    // Remove sensitive fields from logs
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth'];
    sensitiveFields.forEach(field => {
      Object.keys(sanitized).forEach(key => {
        if (key.toLowerCase().includes(field.toLowerCase())) {
          sanitized[key] = '[REDACTED]';
        }
      });
    });

    return sanitized;
  }

  parseSize(size) {
    const units = {
      'b': 1,
      'kb': 1024,
      'mb': 1024 * 1024,
      'gb': 1024 * 1024 * 1024
    };

    const match = size.toString().toLowerCase().match(/^(\d+(?:\.\d+)?)(b|kb|mb|gb)?$/);
    if (!match) return 0;

    const [, num, unit = 'b'] = match;
    return Math.floor(parseFloat(num) * units[unit]);
  }

  /**
   * Block IP Address
   */
  blockIP(ip, duration = 24 * 60 * 60 * 1000) {
    this.blockedIPs.add(ip);
    console.warn(`🚨 IP ${ip} blocked for ${duration / 1000 / 60 / 60} hours`);
    
    // Auto-unblock after duration
    setTimeout(() => {
      this.blockedIPs.delete(ip);
      console.info(`✅ IP ${ip} unblocked`);
    }, duration);
  }

  /**
   * Unblock IP Address
   */
  unblockIP(ip) {
    this.blockedIPs.delete(ip);
    this.suspiciousIPs.delete(ip);
    console.info(`✅ IP ${ip} unblocked manually`);
  }

  /**
   * Get Security Status
   */
  getSecurityStatus() {
    return {
      blockedIPs: Array.from(this.blockedIPs),
      suspiciousIPs: Array.from(this.suspiciousIPs),
      activeTokens: this.csrfTokens.size,
      rateLimitEntries: this.rateLimitStore.size
    };
  }
}

module.exports = new SecurityMiddleware();