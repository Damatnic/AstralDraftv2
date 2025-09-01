/**
 * Security Tests
 * XSS prevention, input sanitization, and security vulnerability tests
 */

import { sanitizeHTML } from '../../utils/security';
import { validateAuthToken } from '../auth/tokenValidator';
import { escapeHtml } from '../utils/stringUtils';

// Mock DOMPurify for testing
const mockDOMPurify = {
  sanitize: jest.fn((input: any) => input.replace(/<script.*?>.*?<\/script>/gi, '')),
};

jest.mock('isomorphic-dompurify', () => ({
  default: mockDOMPurify,
}));

describe('Security Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('XSS Prevention', () => {
    test('should prevent basic script injection', () => {
      const maliciousInput = '<script>alert("XSS")</script>';
      const sanitized = sanitizeHTML(maliciousInput);
      
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('alert(');
      expect(mockDOMPurify.sanitize).toHaveBeenCalledWith(maliciousInput);
    });

    test('should prevent event handler injection', () => {
      const maliciousInput = '<img src="x" onerror="alert(\'XSS\')">';
      const sanitized = sanitizeHTML(maliciousInput);
      
      expect(sanitized).not.toContain('onerror');
      expect(sanitized).not.toContain('alert');
    });

    test('should prevent javascript: protocol injection', () => {
      const maliciousInput = '<a href="javascript:alert(\'XSS\')">Click me</a>';
      const sanitized = sanitizeHTML(maliciousInput);
      
      expect(sanitized).not.toContain('javascript:');
      expect(sanitized).not.toContain('alert');
    });

    test('should prevent data: URL with script', () => {
      const maliciousInput = '<iframe src="data:text/html;base64,PHNjcmlwdD5hbGVydCgiWFNTIik8L3NjcmlwdD4="></iframe>';
      const sanitized = sanitizeHTML(maliciousInput);
      
      expect(sanitized).not.toContain('data:text/html');
    });

    test('should allow safe HTML elements', () => {
      const safeHTML = '<p>This is <strong>safe</strong> content</p>';
      const sanitized = sanitizeHTML(safeHTML);
      
      expect(sanitized).toContain('<p>');
      expect(sanitized).toContain('<strong>');
      expect(sanitized).toContain('safe');
    });

    test('should handle nested XSS attempts', () => {
      const maliciousInput = '<div><script>alert("XSS")</script><p>Content</p></div>';
      const sanitized = sanitizeHTML(maliciousInput);
      
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('<p>Content</p>');
    });
  });

  describe('HTML Escaping', () => {
    test('should escape basic HTML characters', () => {
      const input = '<div>Test & "quotes"</div>';
      const escaped = escapeHtml(input);
      
      expect(escaped).toBe('&lt;div&gt;Test &amp; &quot;quotes&quot;&lt;/div&gt;');
    });

    test('should handle empty strings', () => {
      expect(escapeHtml('')).toBe('');
      expect(escapeHtml(null)).toBe('');
      expect(escapeHtml(undefined)).toBe('');
    });

    test('should handle special characters', () => {
      const input = "It's a 'test' & \"example\"";
      const escaped = escapeHtml(input);
      
      expect(escaped).toContain('&#x27;'); // Single quote
      expect(escaped).toContain('&quot;'); // Double quote
      expect(escaped).toContain('&amp;'); // Ampersand
    });
  });

  describe('Authentication Token Validation', () => {
    test('should validate properly formatted JWT tokens', () => {
      const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      const result = validateAuthToken(validToken);
      
      expect(result.valid).toBe(true);
    });

    test('should reject malformed tokens', () => {
      const invalidToken = 'invalid.token.here';
      const result = validateAuthToken(invalidToken);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid token format');
    });

    test('should reject expired tokens', () => {
      // Token with past expiry time
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZXhwIjoxNTE2MjM5MDIyfQ.invalid';
      const result = validateAuthToken(expiredToken);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Token expired');
    });

    test('should handle token injection attempts', () => {
      const maliciousToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.<script>alert("XSS")</script>.signature';
      const result = validateAuthToken(maliciousToken);
      
      expect(result.valid).toBe(false);
    });
  });

  describe('Input Validation', () => {
    test('should validate email addresses', () => {
      const { validateEmail } = require('../utils/validators');
      
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });

    test('should validate team names', () => {
      const { validateTeamName } = require('../utils/validators');
      
      expect(validateTeamName('Valid Team Name')).toBe(true);
      expect(validateTeamName('')).toBe(false);
      expect(validateTeamName('A'.repeat(51))).toBe(false); // Too long
      expect(validateTeamName('<script>alert("XSS")</script>')).toBe(false);
    });

    test('should validate numeric inputs', () => {
      const { validatePlayerId } = require('../utils/validators');
      
      expect(validatePlayerId(123)).toBe(true);
      expect(validatePlayerId(-1)).toBe(false);
      expect(validatePlayerId(0)).toBe(false);
      expect(validatePlayerId('123')).toBe(false); // Should be number
    });
  });

  describe('CSRF Protection', () => {
    test('should generate valid CSRF tokens', () => {
      const { generateCSRFToken } = require('../security/csrf');
      
      const token = generateCSRFToken();
      expect(token).toMatch(/^[a-f0-9]{64}$/); // 64 character hex string
    });

    test('should validate CSRF tokens', () => {
      const { generateCSRFToken, validateCSRFToken } = require('../security/csrf');
      
      const token = generateCSRFToken();
      expect(validateCSRFToken(token)).toBe(true);
      expect(validateCSRFToken('invalid-token')).toBe(false);
    });
  });

  describe('Content Security Policy', () => {
    test('should validate CSP-compliant content', () => {
      const { validateCSPContent } = require('../security/csp');
      
      const safeContent = 'This is safe text content';
      expect(validateCSPContent(safeContent)).toBe(true);
      
      const unsafeContent = 'eval("malicious code")';
      expect(validateCSPContent(unsafeContent)).toBe(false);
    });
  });

  describe('Rate Limiting', () => {
    test('should track API request rates', () => {
      const { RateLimiter } = require('../security/rateLimiter');
      
      const limiter = new RateLimiter({ maxRequests: 5, windowMs: 60000 });
      
      // Should allow first 5 requests
      for (let i = 0; i < 5; i++) {
        expect(limiter.checkLimit('user-123')).toBe(true);
      }
      
      // Should block 6th request
      expect(limiter.checkLimit('user-123')).toBe(false);
    });
  });

  describe('Password Security', () => {
    test('should enforce strong password requirements', () => {
      const { validatePassword } = require('../auth/passwordValidator');
      
      expect(validatePassword('Password123!')).toBe(true);
      expect(validatePassword('weak')).toBe(false);
      expect(validatePassword('NoNumbers!')).toBe(false);
      expect(validatePassword('nonumbers123')).toBe(false);
    });

    test('should prevent common passwords', () => {
      const { validatePassword } = require('../auth/passwordValidator');
      
      expect(validatePassword('password123')).toBe(false);
      expect(validatePassword('123456789')).toBe(false);
      expect(validatePassword('qwerty123')).toBe(false);
    });
  });

  describe('File Upload Security', () => {
    test('should validate file types', () => {
      const { validateFileType } = require('../utils/fileValidator');
      
      expect(validateFileType('image.jpg')).toBe(true);
      expect(validateFileType('image.png')).toBe(true);
      expect(validateFileType('script.js')).toBe(false);
      expect(validateFileType('malware.exe')).toBe(false);
    });

    test('should check file size limits', () => {
      const { validateFileSize } = require('../utils/fileValidator');
      
      expect(validateFileSize(1024 * 1024)).toBe(true); // 1MB
      expect(validateFileSize(10 * 1024 * 1024)).toBe(false); // 10MB - too large
    });
  });

  describe('SQL Injection Prevention', () => {
    test('should sanitize database queries', () => {
      const { sanitizeQuery } = require('../database/queryBuilder');
      
      const maliciousInput = "'; DROP TABLE users; --";
      const sanitized = sanitizeQuery(maliciousInput);
      
      expect(sanitized).not.toContain('DROP TABLE');
      expect(sanitized).not.toContain('--');
    });
  });
});