/**
 * Authentication Middleware
 * JWT token verification and user authentication
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to authenticate JWT tokens
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Access token required',
        code: 'NO_TOKEN'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists and is active
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    if (user.status !== 'ACTIVE' && user.status !== 'PENDING_VERIFICATION') {
      return res.status(403).json({ 
        error: 'Account suspended or banned',
        code: 'ACCOUNT_SUSPENDED'
      });
    }

    // Check if account is locked
    if (user.isAccountLocked()) {
      return res.status(423).json({ 
        error: 'Account temporarily locked due to failed login attempts',
        code: 'ACCOUNT_LOCKED'
      });
    }

    // Add user info to request
    req.userId = user._id;
    req.user = user;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }

    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      error: 'Authentication failed',
      code: 'AUTH_ERROR'
    });
  }
};

/**
 * Middleware to check if user is admin
 */
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'NO_AUTH'
      });
    }

    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ 
        error: 'Admin access required',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({ 
      error: 'Authorization failed',
      code: 'AUTH_ERROR'
    });
  }
};

/**
 * Middleware to check if user is moderator or admin
 */
const requireModerator = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'NO_AUTH'
      });
    }

    if (!['ADMIN', 'MODERATOR'].includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Moderator access required',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  } catch (error) {
    console.error('Moderator middleware error:', error);
    return res.status(500).json({ 
      error: 'Authorization failed',
      code: 'AUTH_ERROR'
    });
  }
};

/**
 * Middleware to check if user has verified email
 */
const requireEmailVerification = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'NO_AUTH'
      });
    }

    if (!req.user.emailVerified) {
      return res.status(403).json({ 
        error: 'Email verification required',
        code: 'EMAIL_NOT_VERIFIED'
      });
    }

    next();
  } catch (error) {
    console.error('Email verification middleware error:', error);
    return res.status(500).json({ 
      error: 'Verification check failed',
      code: 'VERIFICATION_ERROR'
    });
  }
};

/**
 * Optional authentication - doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      req.userId = null;
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (user && user.status === 'ACTIVE') {
      req.userId = user._id;
      req.user = user;
    } else {
      req.userId = null;
      req.user = null;
    }

    next();
  } catch (error) {
    // Don't fail on optional auth errors
    req.userId = null;
    req.user = null;
    next();
  }
};

/**
 * Rate limiting by user ID
 */
const createUserRateLimit = (windowMs, max) => {
  const attempts = new Map();

  return (req, res, next) => {
    const userId = req.userId || req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old attempts
    const userAttempts = attempts.get(userId) || [];
    const recentAttempts = userAttempts.filter(time => time > windowStart);

    if (recentAttempts.length >= max) {
      return res.status(429).json({
        error: 'Too many requests',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil((recentAttempts[0] + windowMs - now) / 1000)
      });
    }

    // Add current attempt
    recentAttempts.push(now);
    attempts.set(userId, recentAttempts);

    next();
  };
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireModerator,
  requireEmailVerification,
  optionalAuth,
  createUserRateLimit
};