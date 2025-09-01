/**
 * Error Tracking and Monitoring Service
 * Comprehensive error collection, reporting, and user experience monitoring
 */

interface ErrorReport {
}
  id: string;
  timestamp: Date;
  error: Error;
  userId?: string;
  userAgent: string;
  url: string;
  component?: string;
  severity: &apos;low&apos; | &apos;medium&apos; | &apos;high&apos; | &apos;critical&apos;;
  context?: Record<string, unknown>;
  stackTrace: string;
  browserInfo: BrowserInfo;
}

interface BrowserInfo {
}
  name: string;
  version: string;
  os: string;
  viewport: { width: number; height: number };
  connection?: string;
}

interface PerformanceMetrics {
}
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

class ErrorTrackingService {
}
  private errorQueue: ErrorReport[] = [];
  private isOnline = navigator.onLine;
  private userId?: string;
  private sessionId: string;
  private errorCounts = new Map<string, number>();
  
  constructor() {
}
    this.sessionId = this.generateSessionId();
    this.setupGlobalErrorHandlers();
    this.setupPerformanceMonitoring();
    this.setupNetworkMonitoring();
  }

  private generateSessionId(): string {
}
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupGlobalErrorHandlers(): void {
}
    // JavaScript errors
    window.addEventListener(&apos;error&apos;, (event: any) => {
}
      this.captureError(
        new Error(event.message),
        {
}
          component: &apos;global&apos;,
          severity: &apos;high&apos;,
          context: {
}
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
          },
        }
      );
    });

    // Unhandled Promise rejections
    window.addEventListener(&apos;unhandledrejection&apos;, (event: any) => {
}
      this.captureError(
        new Error(`Unhandled promise rejection: ${event.reason}`),
        {
}
          component: &apos;promise&apos;,
          severity: &apos;high&apos;,
          context: {
}
            reason: event.reason,
          },
        }
      );
    });

    // React Error Boundary integration
    if (window.reactErrorHandler) {
}
      window.reactErrorHandler = (error: Error, errorInfo: any) => {
}
        this.captureError(error, {
}
          component: &apos;react&apos;,
          severity: &apos;critical&apos;,
          context: errorInfo,
        });
      };
    }
  }

  private setupPerformanceMonitoring(): void {
}
    if (&apos;PerformanceObserver&apos; in window) {
}
      // Web Vitals monitoring
      try {
}
        const observer = new PerformanceObserver((list: any) => {
}
          for (const entry of list.getEntries()) {
}
            this.capturePerformanceMetric(entry);
          }
        });

        observer.observe({ 
}
          entryTypes: [&apos;paint&apos;, &apos;largest-contentful-paint&apos;, &apos;first-input&apos;, &apos;layout-shift&apos;] 
        });
      } catch (error) {
}
        console.warn(&apos;Performance monitoring not available:&apos;, error);
      }
    }

    // Page load metrics
    window.addEventListener(&apos;load&apos;, () => {
}
      setTimeout(() => {
}
        this.capturePageLoadMetrics();
      }, 1000);
    });
  }

  private setupNetworkMonitoring(): void {
}
    window.addEventListener(&apos;online&apos;, () => {
}
      this.isOnline = true;
      this.flushErrorQueue();
    });

    window.addEventListener(&apos;offline&apos;, () => {
}
      this.isOnline = false;
    });
  }

  private getBrowserInfo(): BrowserInfo {
}
    const userAgent = navigator.userAgent;
    const viewport = {
}
      width: window.innerWidth,
      height: window.innerHeight,
    };

    return {
}
      name: this.getBrowserName(userAgent),
      version: this.getBrowserVersion(userAgent),
      os: this.getOS(userAgent),
      viewport,
      connection: (navigator as any).connection?.effectiveType || &apos;unknown&apos;,
    };
  }

  private getBrowserName(userAgent: string): string {
}
    if (userAgent.includes(&apos;Chrome&apos;)) return &apos;Chrome&apos;;
    if (userAgent.includes(&apos;Firefox&apos;)) return &apos;Firefox&apos;;
    if (userAgent.includes(&apos;Safari&apos;) && !userAgent.includes(&apos;Chrome&apos;)) return &apos;Safari&apos;;
    if (userAgent.includes(&apos;Edge&apos;)) return &apos;Edge&apos;;
    return &apos;Unknown&apos;;
  }

  private getBrowserVersion(userAgent: string): string {
}
    const match = userAgent.match(/(?:Chrome|Firefox|Safari|Edge)\/(\d+\.\d+)/);
    return match ? match[1] : &apos;Unknown&apos;;
  }

  private getOS(userAgent: string): string {
}
    if (userAgent.includes(&apos;Windows&apos;)) return &apos;Windows&apos;;
    if (userAgent.includes(&apos;Mac&apos;)) return &apos;macOS&apos;;
    if (userAgent.includes(&apos;Linux&apos;)) return &apos;Linux&apos;;
    if (userAgent.includes(&apos;Android&apos;)) return &apos;Android&apos;;
    if (userAgent.includes(&apos;iOS&apos;)) return &apos;iOS&apos;;
    return &apos;Unknown&apos;;
  }

  public setUserId(userId: string): void {
}
    this.userId = userId;
  }

  public captureError(
    error: Error, 
    options: {
}
      component?: string;
      severity?: &apos;low&apos; | &apos;medium&apos; | &apos;high&apos; | &apos;critical&apos;;
      context?: Record<string, unknown>;
    } = {}
  ): void {
}
    const errorSignature = `${error.name}:${error.message}`;
    
    // Rate limiting - don&apos;t spam identical errors
    const count = this.errorCounts.get(errorSignature) || 0;
    if (count > 5) {
}
      return; // Skip after 5 identical errors
    }
    this.errorCounts.set(errorSignature, count + 1);

    const errorReport: ErrorReport = {
}
      id: this.generateErrorId(),
      timestamp: new Date(),
      error,
      userId: this.userId,
      userAgent: navigator.userAgent,
      url: window.location.href,
      component: options.component,
      severity: options.severity || &apos;medium&apos;,
      context: options.context,
      stackTrace: error.stack || &apos;&apos;,
      browserInfo: this.getBrowserInfo(),
    };

    this.errorQueue.push(errorReport);
    
    // Try to send immediately if online
    if (this.isOnline) {
}
      this.flushErrorQueue();
    }
  }

  private generateErrorId(): string {
}
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async flushErrorQueue(): Promise<void> {
}
    if (this.errorQueue.length === 0 || !this.isOnline) {
}
      return;
    }

    const errorsToSend = [...this.errorQueue];
    this.errorQueue = [];

    try {
}
      await this.sendErrorsToServer(errorsToSend);
    } catch (error) {
}
      console.warn(&apos;Failed to send error reports:&apos;, error);
      // Put errors back in queue for retry
      this.errorQueue.unshift(...errorsToSend);
    }
  }

  private async sendErrorsToServer(errors: ErrorReport[]): Promise<void> {
}
    const endpoint = import.meta.env.VITE_ERROR_REPORTING_URL || &apos;/api/errors&apos;;
    
    const payload = {
}
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      errors: errors.map((error: any) => ({
}
        ...error,
        error: {
}
          name: error.error.name,
          message: error.error.message,
          stack: error.error.stack,
        },
      })),
    };

    const response = await fetch(endpoint, {
}
      method: &apos;POST&apos;,
      headers: {
}
        &apos;Content-Type&apos;: &apos;application/json&apos;,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
}
      throw new Error(`HTTP ${response.status}`);
    }
  }

  private capturePerformanceMetric(entry: PerformanceEntry): void {
}
    const metric = {
}
      name: entry.name,
      value: entry.startTime,
      timestamp: Date.now(),
      sessionId: this.sessionId,
    };

    // Send performance metrics
    this.sendMetricToServer(metric);
  }

  private capturePageLoadMetrics(): void {
}
    if (!performance.timing) return;

    const timing = performance.timing;
    const metrics: PerformanceMetrics = {
}
      loadTime: timing.loadEventEnd - timing.navigationStart,
      domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      cumulativeLayoutShift: 0,
      firstInputDelay: 0,
    };

    // Web Vitals
    if (&apos;PerformanceObserver&apos; in window) {
}
      try {
}
        const paintObserver = new PerformanceObserver((list: any) => {
}
          for (const entry of list.getEntries()) {
}
            if (entry.name === &apos;first-contentful-paint&apos;) {
}
              metrics.firstContentfulPaint = entry.startTime;
            }
          }
        });
        paintObserver.observe({ entryTypes: [&apos;paint&apos;] });
      } catch (error) {
}
        // Silently fail if not supported
      }
    }

    this.sendMetricToServer({
}
      name: &apos;page_load&apos;,
      value: metrics.loadTime,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      details: metrics,
    });
  }

  private async sendMetricToServer(metric: any): Promise<void> {
}
    const endpoint = import.meta.env.VITE_METRICS_URL || &apos;/api/metrics&apos;;
    
    try {
}
      await fetch(endpoint, {
}
        method: &apos;POST&apos;,
        headers: {
}
          &apos;Content-Type&apos;: &apos;application/json&apos;,
        },
        body: JSON.stringify(metric),
      });
    } catch (error) {
}
      // Silently fail for metrics to avoid impacting user experience
      console.debug(&apos;Failed to send metric:&apos;, error);
    }
  }

  public captureUserAction(action: string, context?: Record<string, unknown>): void {
}
    const event = {
}
      type: &apos;user_action&apos;,
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
}
    const event = {
}
      type: &apos;page_view&apos;,
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
}
    return this.sessionId;
  }

  public getErrorCount(): number {
}
    return Array.from(this.errorCounts.values()).reduce((sum, count) => sum + count, 0);
  }
}

// Global singleton instance
export const errorTrackingService = new ErrorTrackingService();

// Make it available globally for React Error Boundaries
if (typeof window !== &apos;undefined&apos;) {
}
  (window as any).errorTrackingService = errorTrackingService;
}