/**
 * EMERGENCY SECURITY MIDDLEWARE
 * Priority: CRITICAL - Deploy immediately
 * 
 * This middleware implements emergency security patches for:
 * - Secure token management
 * - API key protection
 * - Security headers
 * - CORS hardening
 * - Rate limiting
 * - CSRF protection
 */

const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// =====================================================
// SECURE TOKEN MANAGEMENT
// =====================================================

/**
 * Configure secure cookie settings
 */
const secureCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/'
};

/**
 * Set secure authentication token
 */
function setSecureToken(res, token, refreshToken) {
  res.cookie('astral_token', token, secureCookieOptions);
  
  if (refreshToken) {
    res.cookie('astral_refresh', refreshToken, {
      ...secureCookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/api/auth/refresh'
    });
  }
}

/**
 * Clear secure tokens
 */
function clearSecureTokens(res) {
  res.clearCookie('astral_token');
  res.clearCookie('astral_refresh');
}

// =====================================================
// SECURITY HEADERS
// =====================================================

/**
 * Configure comprehensive security headers
 */
function configureSecurityHeaders(app) {
  // Use Helmet for basic security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'"],
        connectSrc: ["'self'", "https://api.sportsdata.io", "wss://astraldraft.netlify.app"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: [],
        blockAllMixedContent: []
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    frameguard: { action: 'deny' },
    xssFilter: true,
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
  }));
  
  // Additional security headers
  app.use((req, res, next) => {
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
    next();
  });
}

// =====================================================
// CORS CONFIGURATION
// =====================================================

/**
 * Secure CORS configuration
 */
const corsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = [
      'https://astraldraft.netlify.app',
      'https://astraldraft.com'
    ];
    
    // Development mode
    if (process.env.NODE_ENV === 'development') {
      allowedOrigins.push('http://localhost:3000', 'http://localhost:5173');
    }
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy violation from origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  exposedHeaders: ['X-CSRF-Token'],
  maxAge: 86400 // 24 hours
};

// =====================================================
// RATE LIMITING
// =====================================================

/**
 * Auth endpoint rate limiter
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    // Log suspicious activity
    console.warn(`[SECURITY] Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: req.rateLimit.resetTime
    });
  }
});

/**
 * General API rate limiter
 */
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false
});

// =====================================================
// CSRF PROTECTION
// =====================================================

const csrfTokens = new Map();

/**
 * Generate CSRF token
 */
function generateCSRFToken(sessionId) {
  const token = crypto.randomBytes(32).toString('hex');
  csrfTokens.set(sessionId, token);
  return token;
}

/**
 * Validate CSRF token
 */
function validateCSRFToken(sessionId, token) {
  const storedToken = csrfTokens.get(sessionId);
  return storedToken === token && token !== undefined;
}

/**
 * CSRF middleware
 */
function csrfProtection(req, res, next) {
  // Skip for GET requests
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return next();
  }
  
  const sessionId = req.session?.id || req.cookies?.sessionId;
  const token = req.headers['x-csrf-token'] || req.body?._csrf;
  
  if (!sessionId || !validateCSRFToken(sessionId, token)) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  
  next();
}

// =====================================================
// INPUT VALIDATION
// =====================================================

/**
 * Sanitize user input
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
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
 * Input validation middleware
 */
function validateInput(req, res, next) {
  // Sanitize all string inputs
  for (const key in req.body) {
    if (typeof req.body[key] === 'string') {
      req.body[key] = sanitizeInput(req.body[key]);
    }
  }
  
  for (const key in req.query) {
    if (typeof req.query[key] === 'string') {
      req.query[key] = sanitizeInput(req.query[key]);
    }
  }
  
  next();
}

// =====================================================
// API KEY PROTECTION
// =====================================================

/**
 * Protect API keys from exposure
 */
function protectAPIKeys(req, res, next) {
  // Remove any API keys from response
  const originalJson = res.json;
  res.json = function(data) {
    const sanitized = JSON.parse(JSON.stringify(data, (key, value) => {
      // Remove any field that looks like an API key
      if (typeof value === 'string' && 
          (key.toLowerCase().includes('key') || 
           key.toLowerCase().includes('token') ||
           key.toLowerCase().includes('secret') ||
           value.includes('sk-') ||
           value.includes('AIza'))) {
        return '[REDACTED]';
      }
      return value;
    }));
    return originalJson.call(this, sanitized);
  };
  
  next();
}

// =====================================================
// AUDIT LOGGING
// =====================================================

/**
 * Security audit logging
 */
function auditLog(req, res, next) {
  const startTime = Date.now();
  
  // Log response
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id || 'anonymous'
    };
    
    // Log security-relevant events
    if (req.path.includes('/auth') || res.statusCode >= 400) {
      console.log('[SECURITY AUDIT]', JSON.stringify(logEntry));
    }
  });
  
  next();
}

// =====================================================
// EMERGENCY LOCKDOWN
// =====================================================

/**
 * Emergency lockdown mode
 */
function emergencyLockdown(req, res, next) {
  if (process.env.LOCKDOWN_MODE === 'true') {
    // Only allow essential endpoints
    const essentialPaths = ['/api/health', '/api/status'];
    if (!essentialPaths.includes(req.path)) {
      return res.status(503).json({
        error: 'Service temporarily unavailable for maintenance'
      });
    }
  }
  next();
}

// =====================================================
// EXPORT MIDDLEWARE
// =====================================================

module.exports = {
  // Core security middleware
  configureSecurityHeaders,
  corsOptions,
  
  // Rate limiting
  authLimiter,
  apiLimiter,
  
  // CSRF protection
  generateCSRFToken,
  validateCSRFToken,
  csrfProtection,
  
  // Input validation
  sanitizeInput,
  validateInput,
  
  // API protection
  protectAPIKeys,
  
  // Logging
  auditLog,
  
  // Emergency
  emergencyLockdown,
  
  // Token management
  setSecureToken,
  clearSecureTokens,
  
  // Apply all middleware
  applyEmergencySecurityMiddleware: function(app) {
    // Order matters!
    app.use(emergencyLockdown);
    app.use(auditLog);
    app.use(validateInput);
    app.use(protectAPIKeys);
    
    // Configure headers
    configureSecurityHeaders(app);
    
    // Apply rate limiting to specific routes
    app.use('/api/auth/login', authLimiter);
    app.use('/api/auth/register', authLimiter);
    app.use('/api/auth/reset-password', authLimiter);
    app.use('/api', apiLimiter);
    
    console.log('✅ Emergency security middleware applied successfully');
  }
};

/**
 * DEPLOYMENT INSTRUCTIONS:
 * 
 * 1. Install required packages:
 *    npm install express-rate-limit helmet
 * 
 * 2. In server/index.js, add at the top:
 *    const emergencySecurity = require('./middleware/emergencySecurityMiddleware');
 *    emergencySecurity.applyEmergencySecurityMiddleware(app);
 * 
 * 3. Update all auth endpoints to use:
 *    - setSecureToken() instead of sending tokens in response body
 *    - clearSecureTokens() on logout
 * 
 * 4. Generate CSRF tokens for sessions:
 *    - On login: generateCSRFToken(sessionId)
 *    - Send token in response header: X-CSRF-Token
 * 
 * 5. Test all endpoints with:
 *    - Rate limiting verification
 *    - CSRF token validation
 *    - Security header checks
 * 
 * PRIORITY: CRITICAL - Deploy within 15 minutes
 */