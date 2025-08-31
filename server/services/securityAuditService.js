/**
 * Security Audit Service
 * Provides comprehensive security monitoring, logging, and audit capabilities
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const geoip = require('geoip-lite');
const User = require('../models/User');

class SecurityAuditService {
  constructor() {
    this.auditLogPath = process.env.AUDIT_LOG_PATH || './logs/audit.log';
    this.securityLogPath = process.env.SECURITY_LOG_PATH || './logs/security.log';
    this.suspiciousActivities = new Map(); // Store suspicious activity counters
    this.rateLimitViolations = new Map();
    this.bruteForceAttempts = new Map();
    this.initializeLogs();
  }

  /**
   * Initialize log files and directories
   */
  initializeLogs() {
    const logsDir = path.dirname(this.auditLogPath);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    // Create log files if they don't exist
    if (!fs.existsSync(this.auditLogPath)) {
      fs.writeFileSync(this.auditLogPath, '');
    }
    if (!fs.existsSync(this.securityLogPath)) {
      fs.writeFileSync(this.securityLogPath, '');
    }
  }

  /**
   * Log security events
   */
  async logSecurityEvent(eventType, details, req = null) {
    try {
      const timestamp = new Date().toISOString();
      const sessionId = this.generateSessionId();
      
      // Extract request information
      const requestInfo = req ? {
        ip: this.getClientIP(req),
        userAgent: req.get('User-Agent'),
        referer: req.get('Referer'),
        method: req.method,
        url: req.originalUrl,
        headers: this.sanitizeHeaders(req.headers)
      } : null;

      // Get geo location
      const geoInfo = requestInfo ? this.getGeoLocation(requestInfo.ip) : null;

      const logEntry = {
        timestamp,
        sessionId,
        eventType,
        details,
        request: requestInfo,
        geo: geoInfo,
        severity: this.calculateSeverity(eventType),
        hash: this.generateEventHash(eventType, details, requestInfo)
      };

      // Write to security log
      await this.writeToSecurityLog(logEntry);

      // Check for suspicious patterns
      await this.analyzeSuspiciousActivity(logEntry);

      return logEntry;
    } catch (error) {
      console.error('Security logging error:', error);
    }
  }

  /**
   * Log user audit events
   */
  async logAuditEvent(userId, action, resource, details = {}, req = null) {
    try {
      const timestamp = new Date().toISOString();
      const user = userId ? await User.findById(userId).select('email username role') : null;
      
      const auditEntry = {
        timestamp,
        userId,
        user: user ? {
          email: user.email,
          username: user.username,
          role: user.role
        } : null,
        action,
        resource,
        details,
        request: req ? {
          ip: this.getClientIP(req),
          userAgent: req.get('User-Agent'),
          method: req.method,
          url: req.originalUrl
        } : null,
        hash: this.generateEventHash(action, resource, details)
      };

      await this.writeToAuditLog(auditEntry);
      return auditEntry;
    } catch (error) {
      console.error('Audit logging error:', error);
    }
  }

  /**
   * Detect and log suspicious login attempts
   */
  async detectSuspiciousLogin(email, ip, userAgent, success = false) {
    try {
      const key = `login_${email}_${ip}`;
      const now = Date.now();
      const windowMs = 15 * 60 * 1000; // 15 minutes

      if (!this.bruteForceAttempts.has(key)) {
        this.bruteForceAttempts.set(key, []);
      }

      const attempts = this.bruteForceAttempts.get(key);
      
      // Clean old attempts
      const recentAttempts = attempts.filter(time => now - time < windowMs);
      
      if (!success) {
        recentAttempts.push(now);
        this.bruteForceAttempts.set(key, recentAttempts);

        // Check for brute force
        if (recentAttempts.length >= 5) {
          await this.logSecurityEvent('BRUTE_FORCE_DETECTED', {
            email,
            ip,
            userAgent,
            attemptCount: recentAttempts.length,
            timeWindow: '15 minutes'
          });

          // Alert administrators
          await this.alertAdministrators('brute_force', {
            email,
            ip,
            attempts: recentAttempts.length
          });

          return true; // Suspicious activity detected
        }
      } else {
        // Successful login, clear attempts
        this.bruteForceAttempts.delete(key);
      }

      return false;
    } catch (error) {
      console.error('Suspicious login detection error:', error);
      return false;
    }
  }

  /**
   * Monitor for unusual access patterns
   */
  async monitorAccessPatterns(userId, ip, req) {
    try {
      const user = await User.findById(userId);
      if (!user) return;

      const userKey = `access_${userId}`;
      const now = Date.now();

      // Check for location changes
      const currentGeo = this.getGeoLocation(ip);
      const lastLoginGeo = user.lastLoginLocation;

      if (lastLoginGeo && currentGeo) {
        const distance = this.calculateDistance(lastLoginGeo, currentGeo);
        
        // Alert if login from >500 miles away within 1 hour
        const timeSinceLastLogin = now - (user.lastLoginAt?.getTime() || 0);
        const oneHour = 60 * 60 * 1000;

        if (distance > 500 && timeSinceLastLogin < oneHour) {
          await this.logSecurityEvent('SUSPICIOUS_LOCATION_CHANGE', {
            userId,
            previousLocation: lastLoginGeo,
            currentLocation: currentGeo,
            distance: Math.round(distance),
            timeWindow: Math.round(timeSinceLastLogin / 1000 / 60) + ' minutes'
          }, req);
        }
      }

      // Update user's location
      user.lastLoginLocation = currentGeo;
      await user.save();

      // Check for rapid API calls
      if (!this.rateLimitViolations.has(userKey)) {
        this.rateLimitViolations.set(userKey, []);
      }

      const userRequests = this.rateLimitViolations.get(userKey);
      userRequests.push(now);

      // Keep only last 5 minutes of requests
      const fiveMinutesAgo = now - (5 * 60 * 1000);
      const recentRequests = userRequests.filter(time => time > fiveMinutesAgo);
      this.rateLimitViolations.set(userKey, recentRequests);

      // Alert if more than 100 requests in 5 minutes
      if (recentRequests.length > 100) {
        await this.logSecurityEvent('RATE_LIMIT_VIOLATION', {
          userId,
          requestCount: recentRequests.length,
          timeWindow: '5 minutes',
          averageRpm: Math.round(recentRequests.length)
        }, req);
      }

    } catch (error) {
      console.error('Access pattern monitoring error:', error);
    }
  }

  /**
   * Generate comprehensive security report
   */
  async generateSecurityReport(startDate, endDate) {
    try {
      const securityEvents = await this.getSecurityEvents(startDate, endDate);
      const auditEvents = await this.getAuditEvents(startDate, endDate);

      const report = {
        period: {
          start: startDate,
          end: endDate,
          duration: Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + ' days'
        },
        summary: {
          totalSecurityEvents: securityEvents.length,
          totalAuditEvents: auditEvents.length,
          criticalEvents: securityEvents.filter(e => e.severity === 'CRITICAL').length,
          highEvents: securityEvents.filter(e => e.severity === 'HIGH').length,
          mediumEvents: securityEvents.filter(e => e.severity === 'MEDIUM').length,
          lowEvents: securityEvents.filter(e => e.severity === 'LOW').length
        },
        topThreats: this.analyzeTopThreats(securityEvents),
        suspiciousIPs: this.identifySuspiciousIPs(securityEvents),
        userActivities: this.analyzeUserActivities(auditEvents),
        recommendations: this.generateRecommendations(securityEvents)
      };

      return report;
    } catch (error) {
      console.error('Security report generation error:', error);
      throw new Error('Failed to generate security report');
    }
  }

  /**
   * Write to security log
   */
  async writeToSecurityLog(entry) {
    const logLine = JSON.stringify(entry) + '\n';
    fs.appendFileSync(this.securityLogPath, logLine);
  }

  /**
   * Write to audit log
   */
  async writeToAuditLog(entry) {
    const logLine = JSON.stringify(entry) + '\n';
    fs.appendFileSync(this.auditLogPath, logLine);
  }

  /**
   * Analyze suspicious activity patterns
   */
  async analyzeSuspiciousActivity(logEntry) {
    const { eventType, request } = logEntry;
    
    if (!request) return;

    const ip = request.ip;
    const key = `suspicious_${ip}`;

    if (!this.suspiciousActivities.has(key)) {
      this.suspiciousActivities.set(key, {
        events: [],
        score: 0
      });
    }

    const activity = this.suspiciousActivities.get(key);
    activity.events.push({
      timestamp: Date.now(),
      eventType,
      severity: logEntry.severity
    });

    // Calculate suspicion score
    const severityScores = {
      'CRITICAL': 10,
      'HIGH': 5,
      'MEDIUM': 2,
      'LOW': 1
    };

    activity.score += severityScores[logEntry.severity] || 1;

    // Clean old events (keep last 24 hours)
    const dayAgo = Date.now() - (24 * 60 * 60 * 1000);
    activity.events = activity.events.filter(e => e.timestamp > dayAgo);

    // Alert if score is high
    if (activity.score > 50) {
      await this.alertAdministrators('high_suspicion_score', {
        ip,
        score: activity.score,
        eventCount: activity.events.length,
        recentEvents: activity.events.slice(-5)
      });

      // Reset score after alert
      activity.score = Math.floor(activity.score / 2);
    }

    this.suspiciousActivities.set(key, activity);
  }

  /**
   * Alert administrators of security incidents
   */
  async alertAdministrators(alertType, details) {
    try {
      // Log the alert
      await this.logSecurityEvent('ADMIN_ALERT_SENT', {
        alertType,
        details,
        timestamp: new Date().toISOString()
      });

      // In production, send email/SMS/Slack notification
      console.warn(`🚨 SECURITY ALERT [${alertType.toUpperCase()}]:`, details);

      // TODO: Implement actual alerting mechanisms
      // - Email notifications
      // - Slack/Teams webhooks
      // - SMS alerts
      // - SIEM integration
    } catch (error) {
      console.error('Administrator alert error:', error);
    }
  }

  /**
   * Helper methods
   */
  getClientIP(req) {
    return req.ip || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress ||
           (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
           '0.0.0.0';
  }

  getGeoLocation(ip) {
    try {
      const geo = geoip.lookup(ip);
      return geo ? {
        country: geo.country,
        region: geo.region,
        city: geo.city,
        timezone: geo.timezone,
        ll: geo.ll // [latitude, longitude]
      } : null;
    } catch (error) {
      return null;
    }
  }

  calculateDistance(geo1, geo2) {
    if (!geo1?.ll || !geo2?.ll) return 0;

    const [lat1, lon1] = geo1.ll;
    const [lat2, lon2] = geo2.ll;

    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c;
  }

  generateSessionId() {
    return crypto.randomBytes(16).toString('hex');
  }

  generateEventHash(eventType, details, requestInfo) {
    const data = JSON.stringify({ eventType, details, requestInfo });
    return crypto.createHash('sha256').update(data).digest('hex').substring(0, 16);
  }

  sanitizeHeaders(headers) {
    const sanitized = { ...headers };
    delete sanitized.authorization;
    delete sanitized.cookie;
    delete sanitized['x-api-key'];
    return sanitized;
  }

  calculateSeverity(eventType) {
    const severityMap = {
      'BRUTE_FORCE_DETECTED': 'CRITICAL',
      'SUSPICIOUS_LOCATION_CHANGE': 'HIGH',
      'RATE_LIMIT_VIOLATION': 'MEDIUM',
      'FAILED_LOGIN': 'LOW',
      'SUCCESSFUL_LOGIN': 'INFO',
      'PASSWORD_CHANGED': 'MEDIUM',
      'MFA_ENABLED': 'LOW',
      'MFA_DISABLED': 'HIGH',
      'ADMIN_ACTION': 'MEDIUM'
    };

    return severityMap[eventType] || 'LOW';
  }

  analyzeTopThreats(events) {
    const threats = {};
    events.forEach(event => {
      const threat = event.eventType;
      threats[threat] = (threats[threat] || 0) + 1;
    });

    return Object.entries(threats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([threat, count]) => ({ threat, count }));
  }

  identifySuspiciousIPs(events) {
    const ips = {};
    events.forEach(event => {
      if (event.request?.ip) {
        const ip = event.request.ip;
        if (!ips[ip]) {
          ips[ip] = { count: 0, events: [], severity: 0 };
        }
        ips[ip].count++;
        ips[ip].events.push(event.eventType);
        ips[ip].severity += this.getSeverityScore(event.severity);
      }
    });

    return Object.entries(ips)
      .sort(([,a], [,b]) => b.severity - a.severity)
      .slice(0, 10)
      .map(([ip, data]) => ({ ip, ...data }));
  }

  getSeverityScore(severity) {
    const scores = { 'CRITICAL': 10, 'HIGH': 5, 'MEDIUM': 2, 'LOW': 1 };
    return scores[severity] || 0;
  }

  analyzeUserActivities(auditEvents) {
    const users = {};
    auditEvents.forEach(event => {
      if (event.userId) {
        if (!users[event.userId]) {
          users[event.userId] = { actions: [], count: 0 };
        }
        users[event.userId].actions.push(event.action);
        users[event.userId].count++;
      }
    });

    return Object.entries(users)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 10)
      .map(([userId, data]) => ({ userId, ...data }));
  }

  generateRecommendations(events) {
    const recommendations = [];
    
    const bruteForceEvents = events.filter(e => e.eventType === 'BRUTE_FORCE_DETECTED');
    if (bruteForceEvents.length > 10) {
      recommendations.push({
        priority: 'HIGH',
        category: 'Authentication',
        recommendation: 'Implement stricter rate limiting and consider IP blocking',
        reason: `${bruteForceEvents.length} brute force attempts detected`
      });
    }

    const suspiciousLocationEvents = events.filter(e => e.eventType === 'SUSPICIOUS_LOCATION_CHANGE');
    if (suspiciousLocationEvents.length > 5) {
      recommendations.push({
        priority: 'MEDIUM',
        category: 'User Behavior',
        recommendation: 'Enable location-based alerts for users',
        reason: `${suspiciousLocationEvents.length} suspicious location changes detected`
      });
    }

    return recommendations;
  }

  // Placeholder methods for reading log files (implement based on your needs)
  async getSecurityEvents(startDate, endDate) {
    // Read and parse security log file
    // Filter by date range
    // Return parsed events
    return [];
  }

  async getAuditEvents(startDate, endDate) {
    // Read and parse audit log file  
    // Filter by date range
    // Return parsed events
    return [];
  }
}

module.exports = new SecurityAuditService();