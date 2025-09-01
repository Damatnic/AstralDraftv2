/**
 * Advanced Security Middleware
 * Comprehensive security layer for Express applications
 */

import rateLimit from &apos;express-rate-limit&apos;;
import slowDown from &apos;express-slow-down&apos;;
import helmet from &apos;helmet&apos;;
import { Request, Response, NextFunction } from &apos;express&apos;;
import { 
}
  SECURITY_HEADERS, 
  RATE_LIMIT_CONFIG, 
  SESSION_CONFIG, 
  ADVANCED_CSP_CONFIG,
//   AUDIT_CONFIG 
} from &apos;./advanced-security-config.js&apos;;

// Advanced Rate Limiting with Dynamic Adjustments
export const createAdvancedRateLimit = (endpoint: string) => {
}
  const config = RATE_LIMIT_CONFIG[endpoint] || RATE_LIMIT_CONFIG[&apos;/api/*&apos;];
  
  return rateLimit({
}
    windowMs: config.window,
    max: config.requests,
    message: {
}
      error: &apos;Too many requests&apos;,
      retryAfter: Math.ceil(config.window / 1000),
//       endpoint
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Dynamic rate limiting based on user behavior
    keyGenerator: (req: Request) => {
}
      return `${req.ip}:${req.user?.id || &apos;anonymous&apos;}:${endpoint}`;
    },
    handler: (req: Request, res: Response) => {
}
      // Log rate limit violations for security monitoring
      console.warn(`Rate limit exceeded for ${req.ip} on ${endpoint}`);
      res.status(429).json({
}
        error: &apos;Rate limit exceeded&apos;,
        retryAfter: res.getHeaders()[&apos;retry-after&apos;]
      });
    }
  });
};

// Progressive Request Slowdown
export const createProgressiveSlowdown = (endpoint: string) => {
}
  const config = RATE_LIMIT_CONFIG[endpoint] || RATE_LIMIT_CONFIG[&apos;/api/*&apos;];
  
  return slowDown({
}
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
}
  return helmet({
}
    contentSecurityPolicy: {
}
      directives: ADVANCED_CSP_CONFIG.directives,
      reportOnly: process.env.NODE_ENV === &apos;development&apos;,
    },
    hsts: {
}
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true
    },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: &apos;strict-origin-when-cross-origin&apos; },
    crossOriginEmbedderPolicy: process.env.NODE_ENV === &apos;production&apos;,
    crossOriginOpenerPolicy: { policy: &apos;same-origin&apos; },
    crossOriginResourcePolicy: { policy: &apos;same-origin&apos; },
  });
};

// Request Sanitization Middleware
export const sanitizeRequest = (req: Request, res: Response, next: NextFunction) => {
}
  // Sanitize common injection patterns
  const sanitizeObject = (obj: any): any => {
}
    if (typeof obj !== &apos;object&apos; || obj === null) {
}
      return obj;
    }
    
    if (Array.isArray(obj)) {
}
      return obj.map(sanitizeObject);
    }
    
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
}
      // Remove dangerous patterns
      if (typeof value === &apos;string&apos;) {
}
        sanitized[key] = value
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, &apos;&apos;) // Remove script tags
          .replace(/javascript:/gi, &apos;&apos;) // Remove javascript: protocol
          .replace(/on\w+\s*=/gi, &apos;&apos;) // Remove event handlers
          .replace(/expression\s*\(/gi, &apos;&apos;) // Remove CSS expressions
          .trim();
      } else {
}
        sanitized[key] = sanitizeObject(value);
      }
    }
    return sanitized;
  };
  
  if (req.body) {
}
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
}
    req.query = sanitizeObject(req.query);
  }
  if (req.params) {
}
    req.params = sanitizeObject(req.params);
  }
  
  next();
};

// Security Headers Middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
}
  // Apply all security headers
  Object.entries(SECURITY_HEADERS).forEach(([header, value]) => {
}
    res.setHeader(header, value);
  });
  
  // Dynamic headers based on content type
  const contentType = res.getHeader(&apos;content-type&apos;);
  if (contentType && contentType.toString().includes(&apos;application/json&apos;)) {
}
    res.setHeader(&apos;X-Content-Type-Options&apos;, &apos;nosniff&apos;);
  }
  
  next();
};

// Authentication Security Middleware
export const authSecurity = (req: Request, res: Response, next: NextFunction) => {
}
  // Check for suspicious authentication patterns
  const suspiciousPatterns = [
    /admin/i,
    /test/i,
    /demo/i,
    /password123/i,
    /123456/i,
  ];
  
  if (req.body?.password || req.body?.username) {
}
    const credentials = `${req.body.username || &apos;&apos;} ${req.body.password || &apos;&apos;}`;
    const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(credentials));
    
    if (isSuspicious) {
}
      console.warn(`Suspicious login attempt from ${req.ip}: ${req.body.username}`);
      // Add delay to slow down brute force attempts
      setTimeout(() => {
}
        res.status(401).json({ error: &apos;Invalid credentials&apos; });
      }, 2000);
      return;
    }
  }
  
  next();
};

// File Upload Security
export const fileUploadSecurity = (req: Request, res: Response, next: NextFunction) => {
}
  if (!req.file && !req.files) {
}
    return next();
  }
  
  const allowedTypes = [
    &apos;image/jpeg&apos;,
    &apos;image/png&apos;,
    &apos;image/gif&apos;,
    &apos;image/webp&apos;,
    &apos;application/pdf&apos;
  ];
  
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  const files = req.files ? Object.values(req.files).flat() : [req.file];
  
  for (const file of files) {
}
    if (!file) continue;
    
    // Check file type
    if (!allowedTypes.includes(file.mimetype)) {
}
      return res.status(400).json({
}
        error: &apos;Invalid file type&apos;,
        allowed: allowedTypes
      });
    }
    
    // Check file size
    if (file.size > maxSize) {
}
      return res.status(400).json({
}
        error: &apos;File too large&apos;,
        maxSize: `${maxSize / 1024 / 1024}MB`
      });
    }
    
    // Check for executable extensions
    const dangerousExtensions = [&apos;.exe&apos;, &apos;.bat&apos;, &apos;.cmd&apos;, &apos;.com&apos;, &apos;.scr&apos;, &apos;.js&apos;, &apos;.vbs&apos;];
    const hasExtension = dangerousExtensions.some(ext => 
      file.originalname.toLowerCase().endsWith(ext)
    );
    
    if (hasExtension) {
}
      return res.status(400).json({
}
        error: &apos;Dangerous file extension detected&apos;
      });
    }
  }
  
  next();
};

// Audit Logging Middleware
export const auditLogger = (req: Request, res: Response, next: NextFunction) => {
}
  const startTime = Date.now();
  
  // Capture response
  const originalSend = res.send;
  res.send = function(data) {
}
    const duration = Date.now() - startTime;
    
    // Log significant events
    if (shouldAuditRequest(req, res)) {
}
      const auditLog = {
}
        timestamp: new Date().toISOString(),
        ip: req.ip,
        userAgent: req.get(&apos;User-Agent&apos;),
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration,
        userId: req.user?.id,
        event: determineAuditEvent(req, res),
      };
      
      console.log(&apos;AUDIT:&apos;, JSON.stringify(auditLog));
    }
    
    return originalSend.call(this, data);
  };
  
  next();
};

// Helper Functions
function shouldAuditRequest(req: Request, res: Response): boolean {
}
  // Audit authentication endpoints
  if (req.path.includes(&apos;/auth/&apos;)) return true;
  
  // Audit admin actions
  if (req.path.includes(&apos;/admin/&apos;)) return true;
  
  // Audit failed requests
  if (res.statusCode >= 400) return true;
  
  // Audit sensitive operations
  const sensitivePatterns = [&apos;/trade&apos;, &apos;/draft&apos;, &apos;/league&apos;];
  return sensitivePatterns.some(pattern => req.path.includes(pattern));
}

function determineAuditEvent(req: Request, res: Response): string {
}
  if (req.path.includes(&apos;/auth/login&apos;)) return &apos;user.login&apos;;
  if (req.path.includes(&apos;/auth/logout&apos;)) return &apos;user.logout&apos;;
  if (req.path.includes(&apos;/trade&apos;)) return &apos;trade.action&apos;;
  if (req.path.includes(&apos;/draft&apos;)) return &apos;draft.action&apos;;
  return &apos;api.request&apos;;
}

// Master Security Middleware Stack
export const createSecurityStack = () => {
}
  return [
    advancedHelmet(),
    securityHeaders,
    sanitizeRequest,
    auditLogger,
    authSecurity,
    fileUploadSecurity,
  ];
};