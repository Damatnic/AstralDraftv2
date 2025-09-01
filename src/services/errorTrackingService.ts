/**
 * Error Tracking and Monitoring Service
 * Comprehensive error collection, reporting, and user experience monitoring
 */

interface ErrorReport {
  id: string;
  timestamp: Date;
  error: Error;
  userId?: string;
  userAgent: string;
  url: string;
  component?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, unknown>;
  stackTrace: string;
  browserInfo: BrowserInfo;
}

interface BrowserInfo {
  name: string;
  version: string;
  os: string;
  viewport: { width: number; height: number };
  connection?: string;
}

interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

class ErrorTrackingService {
  private errorQueue: ErrorReport[] = [];
  private isOnline = navigator.onLine;
  private userId?: string;
  private sessionId: string;
  private errorCounts = new Map<string, number>();
  
  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupGlobalErrorHandlers();
    this.setupPerformanceMonitoring();
    this.setupNetworkMonitoring();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupGlobalErrorHandlers(): void {
    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.captureError(
        new Error(event.message),
        {
          component: 'global',
          severity: 'high',
          context: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
          },
        }
      );
    });

    // Unhandled Promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(
        new Error(`Unhandled promise rejection: ${event.reason}`),
        {
          component: 'promise',
          severity: 'high',
          context: {
            reason: event.reason,
          },
        }
      );
    });

    // React Error Boundary integration
    if (window.reactErrorHandler) {
      window.reactErrorHandler = (error: Error, errorInfo: any) => {
        this.captureError(error, {
          component: 'react',
          severity: 'critical',
          context: errorInfo,
        });
      };
    }
  }

  private setupPerformanceMonitoring(): void {
    if ('PerformanceObserver' in window) {
      // Web Vitals monitoring
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.capturePerformanceMetric(entry);
          }
        });

        observer.observe({ 
          entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] 
        });
      } catch (error) {
        console.warn('Performance monitoring not available:', error);
      }
    }

    // Page load metrics
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.capturePageLoadMetrics();
      }, 1000);
    });
  }

  private setupNetworkMonitoring(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushErrorQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private getBrowserInfo(): BrowserInfo {
    const userAgent = navigator.userAgent;
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    return {
      name: this.getBrowserName(userAgent),
      version: this.getBrowserVersion(userAgent),
      os: this.getOS(userAgent),
      viewport,
      connection: (navigator as any).connection?.effectiveType || 'unknown',
    };
  }

  private getBrowserName(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private getBrowserVersion(userAgent: string): string {
    const match = userAgent.match(/(?:Chrome|Firefox|Safari|Edge)\/(\d+\.\d+)/);
    return match ? match[1] : 'Unknown';
  }

  private getOS(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  public setUserId(userId: string): void {
    this.userId = userId;
  }

  public captureError(
    error: Error, 
    options: {
      component?: string;
      severity?: 'low' | 'medium' | 'high' | 'critical';
      context?: Record<string, unknown>;
    } = {}
  ): void {
    const errorSignature = `${error.name}:${error.message}`;
    
    // Rate limiting - don't spam identical errors
    const count = this.errorCounts.get(errorSignature) || 0;
    if (count > 5) {
      return; // Skip after 5 identical errors
    }
    this.errorCounts.set(errorSignature, count + 1);

    const errorReport: ErrorReport = {
      id: this.generateErrorId(),
      timestamp: new Date(),
      error,
      userId: this.userId,
      userAgent: navigator.userAgent,
      url: window.location.href,
      component: options.component,
      severity: options.severity || 'medium',
      context: options.context,
      stackTrace: error.stack || '',
      browserInfo: this.getBrowserInfo(),
    };

    this.errorQueue.push(errorReport);
    
    // Try to send immediately if online
    if (this.isOnline) {
      this.flushErrorQueue();
    }
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async flushErrorQueue(): Promise<void> {
    if (this.errorQueue.length === 0 || !this.isOnline) {
      return;
    }

    const errorsToSend = [...this.errorQueue];
    this.errorQueue = [];

    try {
      await this.sendErrorsToServer(errorsToSend);
    } catch (error) {
      console.warn('Failed to send error reports:', error);
      // Put errors back in queue for retry
      this.errorQueue.unshift(...errorsToSend);
    }
  }

  private async sendErrorsToServer(errors: ErrorReport[]): Promise<void> {
    const endpoint = import.meta.env.VITE_ERROR_REPORTING_URL || '/api/errors';
    
    const payload = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      errors: errors.map(error => ({
        ...error,
        error: {
          name: error.error.name,
          message: error.error.message,
          stack: error.error.stack,
        },
      })),
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
  }

  private capturePerformanceMetric(entry: PerformanceEntry): void {
    const metric = {
      name: entry.name,
      value: entry.startTime,
      timestamp: Date.now(),
      sessionId: this.sessionId,
    };

    // Send performance metrics
    this.sendMetricToServer(metric);
  }

  private capturePageLoadMetrics(): void {
    if (!performance.timing) return;

    const timing = performance.timing;
    const metrics: PerformanceMetrics = {
      loadTime: timing.loadEventEnd - timing.navigationStart,
      domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      cumulativeLayoutShift: 0,
      firstInputDelay: 0,
    };

    // Web Vitals
    if ('PerformanceObserver' in window) {
      try {
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              metrics.firstContentfulPaint = entry.startTime;
            }
          }
        });
        paintObserver.observe({ entryTypes: ['paint'] });
      } catch (error) {
        // Silently fail if not supported
      }
    }

    this.sendMetricToServer({
      name: 'page_load',
      value: metrics.loadTime,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      details: metrics,
    });
  }

  private async sendMetricToServer(metric: any): Promise<void> {
    const endpoint = import.meta.env.VITE_METRICS_URL || '/api/metrics';
    
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metric),
      });
    } catch (error) {
      // Silently fail for metrics to avoid impacting user experience
      console.debug('Failed to send metric:', error);
    }
  }

  public captureUserAction(action: string, context?: Record<string, unknown>): void {
    const event = {
      type: 'user_action',
      action,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      url: window.location.href,
      context,
    };

    this.sendMetricToServer(event);
  }

  public capturePageView(page: string): void {
    const event = {
      type: 'page_view',
      page,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      browserInfo: this.getBrowserInfo(),
    };

    this.sendMetricToServer(event);
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public getErrorCount(): number {
    return Array.from(this.errorCounts.values()).reduce((sum, count) => sum + count, 0);
  }
}

// Global singleton instance
export const errorTrackingService = new ErrorTrackingService();

// Make it available globally for React Error Boundaries
if (typeof window !== 'undefined') {
  (window as any).errorTrackingService = errorTrackingService;
}