/**
 * Advanced Security Middleware
 * Comprehensive security layer for Express applications
 */

import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';
import { 
  SECURITY_HEADERS, 
  RATE_LIMIT_CONFIG, 
  SESSION_CONFIG, 
  ADVANCED_CSP_CONFIG,
//   AUDIT_CONFIG 
} from './advanced-security-config.js';

// Advanced Rate Limiting with Dynamic Adjustments
export const createAdvancedRateLimit = (endpoint: string) => {
  const config = RATE_LIMIT_CONFIG[endpoint] || RATE_LIMIT_CONFIG['/api/*'];
  
  return rateLimit({
    windowMs: config.window,
    max: config.requests,
    message: {
      error: 'Too many requests',
      retryAfter: Math.ceil(config.window / 1000),
//       endpoint
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Dynamic rate limiting based on user behavior
    keyGenerator: (req: Request) => {
      return `${req.ip}:${req.user?.id || 'anonymous'}:${endpoint}`;
    },
    handler: (req: Request, res: Response) => {
      // Log rate limit violations for security monitoring
      console.warn(`Rate limit exceeded for ${req.ip} on ${endpoint}`);
      res.status(429).json({
        error: 'Rate limit exceeded',
        retryAfter: res.getHeaders()['retry-after']
      });
    }
  });
};

// Progressive Request Slowdown
export const createProgressiveSlowdown = (endpoint: string) => {
  const config = RATE_LIMIT_CONFIG[endpoint] || RATE_LIMIT_CONFIG['/api/*'];
  
  return slowDown({
    windowMs: config.window,
    delayAfter: Math.floor(config.requests * 0.5), // Start slowing at 50% of limit
    delayMs: 500, // Initial delay
    maxDelayMs: 5000, // Maximum delay
    skipFailedRequests: true,
    skipSuccessfulRequests: false,
  });
};

// Advanced Helmet Configuration
export const advancedHelmet = () => {
  return helmet({
    contentSecurityPolicy: {
      directives: ADVANCED_CSP_CONFIG.directives,
      reportOnly: process.env.NODE_ENV === 'development',
    },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true
    },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    crossOriginEmbedderPolicy: process.env.NODE_ENV === 'production',
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'same-origin' },
  });
};

// Request Sanitization Middleware
export const sanitizeRequest = (req: Request, res: Response, next: NextFunction) => {
  // Sanitize common injection patterns
  const sanitizeObject = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      // Remove dangerous patterns
      if (typeof value === 'string') {
        sanitized[key] = value
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
          .replace(/javascript:/gi, '') // Remove javascript: protocol
          .replace(/on\w+\s*=/gi, '') // Remove event handlers
          .replace(/expression\s*\(/gi, '') // Remove CSS expressions
          .trim();
      } else {
        sanitized[key] = sanitizeObject(value);
      }
    }
    return sanitized;
  };
  
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
  
  next();
};

// Security Headers Middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Apply all security headers
  Object.entries(SECURITY_HEADERS).forEach(([header, value]) => {
    res.setHeader(header, value);
  });
  
  // Dynamic headers based on content type
  const contentType = res.getHeader('content-type');
  if (contentType && contentType.toString().includes('application/json')) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
  }
  
  next();
};

// Authentication Security Middleware
export const authSecurity = (req: Request, res: Response, next: NextFunction) => {
  // Check for suspicious authentication patterns
  const suspiciousPatterns = [
    /admin/i,
    /test/i,
    /demo/i,
    /password123/i,
    /123456/i,
  ];
  
  if (req.body?.password || req.body?.username) {
    const credentials = `${req.body.username || ''} ${req.body.password || ''}`;
    const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(credentials));
    
    if (isSuspicious) {
      console.warn(`Suspicious login attempt from ${req.ip}: ${req.body.username}`);
      // Add delay to slow down brute force attempts
      setTimeout(() => {
        res.status(401).json({ error: 'Invalid credentials' });
      }, 2000);
      return;
    }
  }
  
  next();
};

// File Upload Security
export const fileUploadSecurity = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file && !req.files) {
    return next();
  }
  
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf'
  ];
  
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  const files = req.files ? Object.values(req.files).flat() : [req.file];
  
  for (const file of files) {
    if (!file) continue;
    
    // Check file type
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        error: 'Invalid file type',
        allowed: allowedTypes
      });
    }
    
    // Check file size
    if (file.size > maxSize) {
      return res.status(400).json({
        error: 'File too large',
        maxSize: `${maxSize / 1024 / 1024}MB`
      });
    }
    
    // Check for executable extensions
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.com', '.scr', '.js', '.vbs'];
    const hasExtension = dangerousExtensions.some(ext => 
      file.originalname.toLowerCase().endsWith(ext)
    );
    
    if (hasExtension) {
      return res.status(400).json({
        error: 'Dangerous file extension detected'
      });
    }
  }
  
  next();
};

// Audit Logging Middleware
export const auditLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Capture response
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - startTime;
    
    // Log significant events
    if (shouldAuditRequest(req, res)) {
      const auditLog = {
        timestamp: new Date().toISOString(),
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration,
        userId: req.user?.id,
        event: determineAuditEvent(req, res),
      };
      
      console.log('AUDIT:', JSON.stringify(auditLog));
    }
    
    return originalSend.call(this, data);
  };
  
  next();
};

// Helper Functions
function shouldAuditRequest(req: Request, res: Response): boolean {
  // Audit authentication endpoints
  if (req.path.includes('/auth/')) return true;
  
  // Audit admin actions
  if (req.path.includes('/admin/')) return true;
  
  // Audit failed requests
  if (res.statusCode >= 400) return true;
  
  // Audit sensitive operations
  const sensitivePatterns = ['/trade', '/draft', '/league'];
  return sensitivePatterns.some(pattern => req.path.includes(pattern));

function determineAuditEvent(req: Request, res: Response): string {
  if (req.path.includes('/auth/login')) return 'user.login';
  if (req.path.includes('/auth/logout')) return 'user.logout';
  if (req.path.includes('/trade')) return 'trade.action';
  if (req.path.includes('/draft')) return 'draft.action';
  return 'api.request';

// Master Security Middleware Stack
export const createSecurityStack = () => {
  return [
    advancedHelmet(),
    securityHeaders,
    sanitizeRequest,
    auditLogger,
    authSecurity,
    fileUploadSecurity,
  ];
};