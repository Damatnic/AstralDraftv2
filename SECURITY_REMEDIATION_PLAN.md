# SECURITY REMEDIATION PLAN
## Astral Draft Platform - Critical Security Fixes

**Priority Level:** EMERGENCY 🚨  
**Timeline:** Immediate action required  
**Risk Status:** Platform currently compromised

---

## PHASE 1: EMERGENCY RESPONSE (0-24 HOURS)

### 🔴 CRITICAL: Exposed Credentials Incident Response

#### IMMEDIATE ACTIONS (Do This NOW):

1. **ROTATE ALL API KEYS**
   ```bash
   # Services requiring immediate key rotation:
   - SportsData.io API
   - Google Gemini API  
   - OpenAI API
   - SendGrid API
   - Stripe API
   ```

2. **SECURE SECRETS MANAGEMENT**
   ```javascript
   // REMOVE from .env files:
   - Delete all API keys from .env
   - Delete all secrets from repository history
   
   // IMPLEMENT secure storage:
   - Use environment variables on hosting platform
   - Never commit secrets to git
   ```

3. **EMERGENCY JWT SECRET ROTATION**
   ```javascript
   // Generate new secure JWT secret
   const crypto = require('crypto');
   const newJwtSecret = crypto.randomBytes(64).toString('hex');
   
   // Update in production environment only
   process.env.JWT_SECRET = newJwtSecret;
   ```

4. **GIT HISTORY CLEANUP**
   ```bash
   # Remove sensitive data from git history
   git filter-branch --force --index-filter \
     'git rm --cached --ignore-unmatch .env' \
     --prune-empty --tag-name-filter cat -- --all
   
   # Force push to remove history
   git push origin --force --all
   ```

---

## PHASE 2: CRITICAL VULNERABILITIES (24-72 HOURS)

### Fix 1: Secure Session Management

**Current Issue:** Tokens stored in localStorage (XSS vulnerable)

**Solution Implementation:**
```javascript
// backend/middleware/sessionConfig.js
const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 3600 // lazy session update
  }),
  cookie: {
    secure: true, // HTTPS only
    httpOnly: true, // No JS access
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    sameSite: 'strict' // CSRF protection
  }
}));
```

**Frontend Migration:**
```javascript
// Remove ALL localStorage usage for sensitive data
// services/authService.ts
class AuthService {
  async login(username, password) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    });
    
    // Token now in httpOnly cookie, not accessible via JS
    if (response.ok) {
      const data = await response.json();
      // Store only non-sensitive user info
      this.currentUser = data.user;
    }
  }
}
```

### Fix 2: Content Security Policy Hardening

**Remove Unsafe Directives:**
```javascript
// server/middleware/securityMiddleware.js
const crypto = require('crypto');

app.use((req, res, next) => {
  // Generate nonce for this request
  const nonce = crypto.randomBytes(16).toString('base64');
  res.locals.nonce = nonce;
  
  const csp = {
    "default-src": ["'self'"],
    "script-src": ["'self'", `'nonce-${nonce}'`],
    "style-src": ["'self'", `'nonce-${nonce}'`, "https://fonts.googleapis.com"],
    "img-src": ["'self'", "data:", "https:"],
    "font-src": ["'self'", "https://fonts.gstatic.com"],
    "connect-src": [
      "'self'",
      "https://api.astraldraft.com",
      "wss://api.astraldraft.com"
    ],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
    "upgrade-insecure-requests": []
  };
  
  const cspString = Object.entries(csp)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
  
  res.setHeader('Content-Security-Policy', cspString);
  next();
});
```

**Update HTML for Nonce:**
```html
<!-- index.html -->
<script nonce="{{nonce}}">
  // Inline scripts must use nonce
</script>
```

### Fix 3: CORS Security

**Implement Strict CORS:**
```javascript
// server/config/cors.js
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://astraldraft.com',
      'https://www.astraldraft.com',
      'https://astraldraft.netlify.app'
    ];
    
    // Allow requests with no origin (mobile apps, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));
```

---

## PHASE 3: COMPLIANCE IMPLEMENTATION (72 HOURS - 1 WEEK)

### GDPR Compliance Package

#### 1. Privacy Policy Implementation
```javascript
// server/routes/legal.js
router.get('/api/legal/privacy-policy', (req, res) => {
  res.json({
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    content: privacyPolicyContent,
    dataController: {
      name: 'Astral Draft Inc.',
      email: 'privacy@astraldraft.com',
      address: 'Company Address'
    }
  });
});
```

#### 2. Cookie Consent System
```javascript
// components/CookieConsent.tsx
import React, { useState, useEffect } from 'react';

export const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  
  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);
  
  const handleAccept = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: false,
      timestamp: new Date().toISOString()
    }));
    setShowBanner(false);
  };
  
  const handleReject = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    }));
    setShowBanner(false);
  };
  
  if (!showBanner) return null;
  
  return (
    <div className="cookie-banner">
      <p>We use cookies to enhance your experience.</p>
      <button onClick={handleAccept}>Accept All</button>
      <button onClick={handleReject}>Reject Non-Essential</button>
      <a href="/privacy">Privacy Policy</a>
    </div>
  );
};
```

#### 3. Data Export Functionality
```javascript
// server/routes/gdpr.js
router.get('/api/user/export-data', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Collect all user data
    const userData = {
      profile: await User.findById(userId),
      leagues: await League.find({ members: userId }),
      transactions: await Transaction.find({ userId }),
      messages: await Message.find({ userId }),
      exportDate: new Date().toISOString()
    };
    
    // Remove sensitive fields
    delete userData.profile.password;
    delete userData.profile.twoFactorSecret;
    
    // Generate JSON export
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="user-data.json"');
    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: 'Export failed' });
  }
});
```

#### 4. Account Deletion
```javascript
// server/routes/gdpr.js
router.delete('/api/user/delete-account', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { password, confirmation } = req.body;
    
    // Verify password
    const user = await User.findById(userId);
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword || confirmation !== 'DELETE') {
      return res.status(400).json({ error: 'Invalid confirmation' });
    }
    
    // Anonymize user data (soft delete for legal compliance)
    await User.findByIdAndUpdate(userId, {
      email: `deleted_${userId}@deleted.com`,
      username: `deleted_user_${userId}`,
      displayName: 'Deleted User',
      personalData: null,
      status: 'DELETED',
      deletedAt: new Date()
    });
    
    // Schedule hard delete after retention period
    scheduleHardDelete(userId, 30); // 30 days
    
    res.json({ message: 'Account scheduled for deletion' });
  } catch (error) {
    res.status(500).json({ error: 'Deletion failed' });
  }
});
```

---

## PHASE 4: SECURITY HARDENING (1 WEEK - 2 WEEKS)

### Enhanced Authentication

#### 1. Implement Argon2 for Password Hashing
```javascript
const argon2 = require('argon2');

// Replace bcrypt with argon2
const hashPassword = async (password) => {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  });
};
```

#### 2. Enforce MFA for Sensitive Operations
```javascript
// middleware/requireMFA.js
const requireMFA = async (req, res, next) => {
  const user = await User.findById(req.userId);
  
  if (!user.twoFactorAuth.enabled) {
    return res.status(403).json({
      error: 'MFA required for this operation',
      mfaEnrollUrl: '/api/auth/mfa/enroll'
    });
  }
  
  const { mfaToken } = req.headers;
  if (!mfaToken || !verifyMFAToken(user, mfaToken)) {
    return res.status(403).json({ error: 'Invalid MFA token' });
  }
  
  next();
};
```

### API Security Enhancements

#### 1. Request Signing
```javascript
// middleware/requestSigning.js
const crypto = require('crypto');

const verifyRequestSignature = (req, res, next) => {
  const signature = req.headers['x-signature'];
  const timestamp = req.headers['x-timestamp'];
  
  // Check timestamp to prevent replay attacks
  const now = Date.now();
  if (Math.abs(now - parseInt(timestamp)) > 300000) { // 5 minutes
    return res.status(401).json({ error: 'Request expired' });
  }
  
  // Verify signature
  const payload = `${timestamp}.${JSON.stringify(req.body)}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.API_SECRET)
    .update(payload)
    .digest('hex');
  
  if (signature !== expectedSignature) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  next();
};
```

#### 2. Advanced Rate Limiting
```javascript
// middleware/advancedRateLimit.js
const RedisStore = require('rate-limit-redis');
const rateLimit = require('express-rate-limit');

const createRateLimit = (options) => {
  return rateLimit({
    store: new RedisStore({
      client: redis,
      prefix: 'rl:',
    }),
    windowMs: options.windowMs || 15 * 60 * 1000,
    max: options.max || 100,
    message: 'Too many requests',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      // Log suspicious activity
      logSuspiciousActivity(req);
      res.status(429).json({
        error: 'Rate limit exceeded',
        retryAfter: req.rateLimit.resetTime
      });
    }
  });
};

// Different limits for different endpoints
app.use('/api/auth/login', createRateLimit({ max: 5, windowMs: 15 * 60 * 1000 }));
app.use('/api/auth/register', createRateLimit({ max: 3, windowMs: 60 * 60 * 1000 }));
app.use('/api/', createRateLimit({ max: 1000, windowMs: 15 * 60 * 1000 }));
```

---

## MONITORING AND ALERTING

### Security Event Logging
```javascript
// services/securityLogger.js
const winston = require('winston');

const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'security.log' }),
    new winston.transports.Console()
  ]
});

// Log security events
const logSecurityEvent = (event) => {
  securityLogger.warn({
    type: event.type,
    userId: event.userId,
    ip: event.ip,
    timestamp: new Date().toISOString(),
    details: event.details
  });
  
  // Alert on critical events
  if (event.severity === 'CRITICAL') {
    sendSecurityAlert(event);
  }
};
```

### Automated Security Scanning
```json
// package.json
{
  "scripts": {
    "security:audit": "npm audit --audit-level=moderate",
    "security:scan": "snyk test",
    "security:monitor": "snyk monitor",
    "security:check": "npm run security:audit && npm run security:scan"
  }
}
```

---

## VALIDATION CHECKLIST

### Week 1 Completion Criteria
- [ ] All API keys rotated and secured
- [ ] JWT secret replaced with secure random
- [ ] Session tokens moved to httpOnly cookies
- [ ] CSP hardened (no unsafe-inline/eval)
- [ ] CORS properly configured
- [ ] Basic GDPR compliance implemented
- [ ] Rate limiting on all endpoints
- [ ] Security logging enabled

### Week 2 Completion Criteria
- [ ] MFA enforced for admin operations
- [ ] Request signing implemented
- [ ] Advanced rate limiting with Redis
- [ ] Data export functionality complete
- [ ] Account deletion process implemented
- [ ] Privacy policy and cookie consent live
- [ ] Security monitoring dashboard active
- [ ] Penetration testing scheduled

---

## INCIDENT RESPONSE CONTACTS

**Security Team Lead:** security@astraldraft.com  
**Data Protection Officer:** dpo@astraldraft.com  
**Emergency Hotline:** [REDACTED]  
**Legal Counsel:** legal@astraldraft.com  

---

**Document Version:** 1.0  
**Last Updated:** 2025-08-31  
**Next Review:** After Phase 1 completion