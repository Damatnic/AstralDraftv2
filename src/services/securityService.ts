/**
 * Security Service
 * Provides comprehensive security monitoring, validation, and protection
 */

interface SecurityViolation {
  id: string;
  type: 'xss' | 'csrf' | 'injection' | 'content_security' | 'data_leak' | 'unauthorized_access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  context?: Record<string, unknown>;
  timestamp: Date;
  blocked: boolean;

interface SecurityConfig {
  enableCSPValidation: boolean;
  enableXSSProtection: boolean;
  enableInputSanitization: boolean;
  enableAPIKeyProtection: boolean;
  enableContentValidation: boolean;
  logSecurityEvents: boolean;

class SecurityService {
  private violations: SecurityViolation[] = [];
  private sessionId: string;
  private config: SecurityConfig;

  // Dangerous patterns to detect
  private readonly XSS_PATTERNS = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /eval\s*\(/gi,
    /document\.write/gi,
    /innerHTML\s*=/gi
  ];

  private readonly INJECTION_PATTERNS = [
    /['";]\s*(union|select|insert|update|delete|drop|create|alter|exec|execute)/gi,
    /\b(union|select|insert|update|delete|drop|create|alter)\b.*\b(from|where|into|values)\b/gi,
    /--\s*$/gm,
    /\/\*.*?\*\//gs
  ];

  private readonly SENSITIVE_DATA_PATTERNS = [
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email
    /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, // Credit card
    /\b\d{3}-\d{2}-\d{4}\b/g, // SSN
    /sk-[a-zA-Z0-9]{48}/g, // OpenAI API key pattern
    /AIza[0-9A-Za-z-_]{35}/g, // Google API key pattern
    /\b[A-Z0-9]{32}\b/g // Generic API key pattern
  ];

  constructor() {
    this.sessionId = `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.config = {
      enableCSPValidation: import.meta.env.PROD || import.meta.env.VITE_ENABLE_SECURITY === 'true',
      enableXSSProtection: true,
      enableInputSanitization: true,
      enableAPIKeyProtection: true,
      enableContentValidation: true,
      logSecurityEvents: import.meta.env.PROD || import.meta.env.VITE_ENABLE_SECURITY_LOGGING === 'true'
    };

    this.initializeSecurity();
  }

  private initializeSecurity(): void {
    if (typeof window === 'undefined') return;

    // Set up CSP violation reporting
    if (this.config.enableCSPValidation) {
      this.setupCSPReporting();
    }

    // Monitor DOM mutations for XSS attempts
    if (this.config.enableXSSProtection) {
      this.setupXSSProtection();
    }

    // Secure console to prevent information leakage
    this.secureConsole();

    // Monitor localStorage/sessionStorage for sensitive data
    this.setupStorageMonitoring();
  }

  private setupCSPReporting(): void {
    document.addEventListener('securitypolicyviolation', (event: any) => {
      this.reportViolation({
        type: 'content_security',
        severity: 'high',
        message: `CSP violation: ${event.violatedDirective}`,
        context: {
          blockedURI: event.blockedURI,
          documentURI: event.documentURI,
          effectiveDirective: event.effectiveDirective,
          sourceFile: event.sourceFile,
          lineNumber: event.lineNumber
        },
        blocked: true
      });
    });
  }

  private setupXSSProtection(): void {
    if (!window.MutationObserver) return;

    const observer = new MutationObserver((mutations: any) => {
      mutations.forEach((mutation: any) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node: any) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.scanElementForXSS(node as Element);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['onclick', 'onload', 'onerror', 'onmouseover']
    });
  }

  private scanElementForXSS(element: Element): void {
    const innerHTML = element.innerHTML;
    const outerHTML = element.outerHTML;

    // Check for XSS patterns
    this.XSS_PATTERNS.forEach((pattern: any) => {
      if (pattern.test(innerHTML) || pattern.test(outerHTML)) {
        this.reportViolation({
          type: 'xss',
          severity: 'critical',
          message: 'Potential XSS attempt detected in DOM',
          context: {
            element: element.tagName,
            content: innerHTML.substring(0, 200),
            pattern: pattern.source
          },
          blocked: false
        });
      }
    });

    // Check attributes for dangerous content
    Array.from(element.attributes).forEach((attr: any) => {
      if (attr.name.startsWith('on') && attr.value) {
        this.reportViolation({
          type: 'xss',
          severity: 'high',
          message: 'Dangerous event handler attribute detected',
          context: {
            element: element.tagName,
            attribute: attr.name,
            value: attr.value
          },
          blocked: false
        });
      }
    });
  }

  private secureConsole(): void {
    if (!import.meta.env.PROD) return; // Only in production

    const originalMethods = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info,
      debug: console.debug
    };

    // Override console methods to prevent sensitive data leakage
    Object.keys(originalMethods).forEach((method: any) => {
      (console as any)[method] = (...args: any[]) => {
        const filteredArgs = args.map((arg: any) => this.sanitizeOutput(arg));
        (originalMethods as any)[method](...filteredArgs);
      };
    });
  }

  private sanitizeOutput(data: any): any {
    if (typeof data === 'string') {
      return this.removeSensitiveData(data);
    }
    
    if (typeof data === 'object' && data !== null) {
      const sanitized = { ...data };
      Object.keys(sanitized).forEach((key: any) => {
        if (this.isSensitiveKey(key)) {
          sanitized[key] = '***REDACTED***';
        } else if (typeof sanitized[key] === 'string') {
          sanitized[key] = this.removeSensitiveData(sanitized[key]);
        }
      });
      return sanitized;
    }

    return data;
  }

  private isSensitiveKey(key: string): boolean {
    const sensitiveKeys = [
      'password', 'pass', 'pwd', 'secret', 'token', 'key', 'api_key', 
      'apikey', 'auth', 'authorization', 'credential', 'private'
    ];
    return sensitiveKeys.some((sensitive: any) => key.toLowerCase().includes(sensitive));
  }

  private setupStorageMonitoring(): void {
    const originalSetItem = Storage.prototype.setItem;
    const securityService = this;

    Storage.prototype.setItem = function(key: string, value: string) {
      if (securityService.config.enableAPIKeyProtection) {
        if (securityService.containsSensitiveData(value)) {
          securityService.reportViolation({
            type: 'data_leak',
            severity: 'high',
            message: 'Attempt to store sensitive data in storage',
            context: {
              key, 
              storageType: this.constructor.name,
              dataPreview: value.substring(0, 50) + '...'
            },
            blocked: false
          });
        }
      }
      return originalSetItem.call(this, key, value);
    };
  }

  public validateInput(input: string, context: string = 'unknown'): {
    isValid: boolean;
    sanitized: string;
    violations: string[];
  } {
    const violations: string[] = [];
    let sanitized = input;

    if (!this.config.enableInputSanitization) {
      return { isValid: true, sanitized: input, violations: [] };
    }

    // Check for XSS patterns
    this.XSS_PATTERNS.forEach((pattern: any) => {
      if (pattern.test(input)) {
        violations.push(`XSS pattern detected: ${pattern.source}`);
        sanitized = sanitized.replace(pattern, '');
      }
    });

    // Check for injection patterns
    this.INJECTION_PATTERNS.forEach((pattern: any) => {
      if (pattern.test(input)) {
        violations.push(`Injection pattern detected: ${pattern.source}`);
        sanitized = sanitized.replace(pattern, '');
      }
    });

    // Report violations
    if (violations.length > 0) {
      this.reportViolation({
        type: 'injection',
        severity: 'high',
        message: 'Malicious input detected and sanitized',
        context: {
          originalInput: input.substring(0, 200),
          sanitizedInput: sanitized.substring(0, 200),
          inputContext: context,
//           violations
        },
        blocked: true
      });
    }

    return {
      isValid: violations.length === 0,
      sanitized,
//       violations
    };
  }

  public containsSensitiveData(text: string): boolean {
    return this.SENSITIVE_DATA_PATTERNS.some((pattern: any) => pattern.test(text));
  }

  public removeSensitiveData(text: string): string {
    let cleaned = text;
    this.SENSITIVE_DATA_PATTERNS.forEach((pattern: any) => {
      cleaned = cleaned.replace(pattern, '***REDACTED***');
    });
    return cleaned;
  }

  public validateAPIKey(apiKey: string): boolean {
    if (!this.config.enableAPIKeyProtection) return true;

    // Basic API key validation
    if (!apiKey || apiKey.length < 10) {
      return false;
    }

    // Check if it's a test/dummy key
    const testPatterns = [
      /^test/i,
      /^dummy/i,
      /^fake/i,
      /^mock/i,
      /123456/
    ];

    if (testPatterns.some((pattern: any) => pattern.test(apiKey))) {
      this.reportViolation({
        type: 'unauthorized_access',
        severity: 'medium',
        message: 'Test/dummy API key detected',
        context: { keyPrefix: apiKey.substring(0, 10) },
        blocked: false
      });
      return false;
    }

    return true;
  }

  public generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const array = new Uint8Array(length);
    
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(array);
    } else {
      // Fallback for older browsers
      for (let i = 0; i < length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }

    return Array.from(array, byte => chars[byte % chars.length]).join('');
  }

  public hashSensitiveData(data: string, salt?: string): Promise<string> {
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error('Web Crypto API not available');
    }

    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data + (salt || ''));

    return window.crypto.subtle.digest('SHA-256', dataBuffer).then(hashBuffer => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((byte: any) => byte.toString(16).padStart(2, '0')).join('');
    });
  }

  private reportViolation(violation: Omit<SecurityViolation, 'id' | 'timestamp'>): void {
    const fullViolation: SecurityViolation = {
      id: `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...violation
    };

    this.violations.push(fullViolation);

    if (this.config.logSecurityEvents) {
      console.warn('Security violation detected:', fullViolation);
    }

    // Send to error tracking service
    if (window.errorTrackingService) {
      try {
        window.errorTrackingService.captureError(
          new Error(`Security violation: ${violation.message}`),
          {
            component: 'security-service',
            severity: violation.severity === 'critical' ? 'critical' : 'high',
            context: {
              securityViolation: fullViolation,
              sessionId: this.sessionId
            }
          }
        );
      } catch (error) {
        console.warn('Failed to report security violation to tracking service:', error);
      }
    }
  }

  public getViolations(): SecurityViolation[] {
    return [...this.violations];
  }

  public getSecuritySummary(): {
    totalViolations: number;
    violationsBySeverity: Record<string, number>;
    violationsByType: Record<string, number>;
    recentViolations: SecurityViolation[];
  } {
    const violationsBySeverity = this.violations.reduce((acc, v) => {
      acc[v.severity] = (acc[v.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const violationsByType = this.violations.reduce((acc, v) => {
      acc[v.type] = (acc[v.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentViolations = this.violations
      .filter((v: any) => Date.now() - v.timestamp.getTime() < 24 * 60 * 60 * 1000) // Last 24 hours
      .slice(-10); // Last 10 violations

    return {
      totalViolations: this.violations.length,
      violationsBySeverity,
      violationsByType,
//       recentViolations
    };
  }

  public clearViolations(): void {
    this.violations = [];
  }

// Global singleton instance
export const securityService = new SecurityService();

// Make it available globally
if (typeof window !== 'undefined') {
  (window as any).securityService = securityService;
