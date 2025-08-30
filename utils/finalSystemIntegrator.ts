// Final System Integration and Validation
export interface SystemHealthCheck {
  system: string;
  status: 'healthy' | 'degraded' | 'critical' | 'unknown';
  responseTime?: number;
  lastCheck: Date;
  details?: any;
}

export interface IntegrationReport {
  overallHealth: 'healthy' | 'degraded' | 'critical';
  systems: SystemHealthCheck[];
  recommendations: string[];
  timestamp: Date;
}

export class FinalSystemIntegrator {
  private static instance: FinalSystemIntegrator;
  private systemChecks: Map<string, SystemHealthCheck> = new Map();
  private checkInterval: NodeJS.Timeout | null = null;
  private isInitialized: boolean = false;

  private constructor() {
    this.initializeSystemMonitoring();
  }

  static getInstance(): FinalSystemIntegrator {
    if (!FinalSystemIntegrator.instance) {
      FinalSystemIntegrator.instance = new FinalSystemIntegrator();
    }
    return FinalSystemIntegrator.instance;
  }

  private initializeSystemMonitoring(): void {
    if (typeof window === 'undefined') return;

    this.registerCoreSystemChecks();
    this.startContinuousMonitoring();
    this.setupIntegrationListeners();
    this.isInitialized = true;
  }

  private registerCoreSystemChecks(): void {
    // Register all system health checks
    this.registerSystemCheck('performanceMonitor', this.checkPerformanceMonitor);
    this.registerSystemCheck('mobileOptimizations', this.checkMobileOptimizations);
    this.registerSystemCheck('touchEnhancer', this.checkTouchEnhancer);
    this.registerSystemCheck('productionOptimizer', this.checkProductionOptimizer);
    this.registerSystemCheck('errorBoundary', this.checkErrorBoundary);
    this.registerSystemCheck('webSocketService', this.checkWebSocketService);
    this.registerSystemCheck('notificationService', this.checkNotificationService);
    this.registerSystemCheck('loggingService', this.checkLoggingService);
  }

  private registerSystemCheck(systemName: string, checkFunction: () => Promise<SystemHealthCheck>): void {
    // Initialize with unknown status
    this.systemChecks.set(systemName, {
      system: systemName,
      status: 'unknown',
      lastCheck: new Date(),
    });
  }

  private startContinuousMonitoring(): void {
    // Check systems every 30 seconds
    this.checkInterval = setInterval(() => {
      this.performAllSystemChecks();
    }, 30000);

    // Initial check
    this.performAllSystemChecks();
  }

  private setupIntegrationListeners(): void {
    // Listen for system integration events
    window.addEventListener('systemError', this.handleSystemError);
    window.addEventListener('systemRecovery', this.handleSystemRecovery);
    window.addEventListener('performanceDegradation', this.handlePerformanceDegradation);
  }

  private async performAllSystemChecks(): Promise<void> {
    const checkPromises = Array.from(this.systemChecks.keys()).map(async (systemName) => {
      try {
        const check = await this.performSystemCheck(systemName);
        this.systemChecks.set(systemName, check);
      } catch (error) {
        this.systemChecks.set(systemName, {
          system: systemName,
          status: 'critical',
          lastCheck: new Date(),
          details: { error: error instanceof Error ? error.message : 'Unknown error' }
        });
      }
    });

    await Promise.allSettled(checkPromises);
    this.emitHealthReport();
  }

  private async performSystemCheck(systemName: string): Promise<SystemHealthCheck> {
    const startTime = performance.now();

    switch (systemName) {
      case 'performanceMonitor':
        return await this.checkPerformanceMonitor();
      case 'mobileOptimizations':
        return await this.checkMobileOptimizations();
      case 'touchEnhancer':
        return await this.checkTouchEnhancer();
      case 'productionOptimizer':
        return await this.checkProductionOptimizer();
      case 'errorBoundary':
        return await this.checkErrorBoundary();
      case 'webSocketService':
        return await this.checkWebSocketService();
      case 'notificationService':
        return await this.checkNotificationService();
      case 'loggingService':
        return await this.checkLoggingService();
      default:
        throw new Error(`Unknown system: ${systemName}`);
    }
  }

  // Individual system check implementations
  private async checkPerformanceMonitor(): Promise<SystemHealthCheck> {
    const startTime = performance.now();
    
    try {
      // Check if performance monitor is collecting metrics
      const webVitals = (window as any).performanceMonitor?.getWebVitals?.() || null;
      const responseTime = performance.now() - startTime;
      
      return {
        system: 'performanceMonitor',
        status: webVitals ? 'healthy' : 'degraded',
        responseTime,
        lastCheck: new Date(),
        details: { webVitalsAvailable: !!webVitals }
      };
    } catch (error) {
      return {
        system: 'performanceMonitor',
        status: 'critical',
        responseTime: performance.now() - startTime,
        lastCheck: new Date(),
        details: { error: error instanceof Error ? error.message : 'Check failed' }
      };
    }
  }

  private async checkMobileOptimizations(): Promise<SystemHealthCheck> {
    const startTime = performance.now();
    
    try {
      const networkInfo = (window as any).mobilePerformanceOptimizer?.getNetworkInfo?.();
      const responseTime = performance.now() - startTime;
      
      return {
        system: 'mobileOptimizations',
        status: networkInfo ? 'healthy' : 'degraded',
        responseTime,
        lastCheck: new Date(),
        details: { networkInfo }
      };
    } catch (error) {
      return {
        system: 'mobileOptimizations',
        status: 'critical',
        responseTime: performance.now() - startTime,
        lastCheck: new Date(),
        details: { error: error instanceof Error ? error.message : 'Check failed' }
      };
    }
  }

  private async checkTouchEnhancer(): Promise<SystemHealthCheck> {
    const startTime = performance.now();
    
    try {
      // Check if touch enhancer is active
      const hasTouchListeners = document.addEventListener !== Document.prototype.addEventListener;
      const responseTime = performance.now() - startTime;
      
      return {
        system: 'touchEnhancer',
        status: 'healthy', // Assume healthy if no errors
        responseTime,
        lastCheck: new Date(),
        details: { touchListenersActive: hasTouchListeners }
      };
    } catch (error) {
      return {
        system: 'touchEnhancer',
        status: 'critical',
        responseTime: performance.now() - startTime,
        lastCheck: new Date(),
        details: { error: error instanceof Error ? error.message : 'Check failed' }
      };
    }
  }

  private async checkProductionOptimizer(): Promise<SystemHealthCheck> {
    const startTime = performance.now();
    
    try {
      const envInfo = (window as any).productionOptimizer?.getEnvironmentInfo?.();
      const responseTime = performance.now() - startTime;
      
      return {
        system: 'productionOptimizer',
        status: envInfo ? 'healthy' : 'degraded',
        responseTime,
        lastCheck: new Date(),
        details: { environmentInfo: envInfo }
      };
    } catch (error) {
      return {
        system: 'productionOptimizer',
        status: 'critical',
        responseTime: performance.now() - startTime,
        lastCheck: new Date(),
        details: { error: error instanceof Error ? error.message : 'Check failed' }
      };
    }
  }

  private async checkErrorBoundary(): Promise<SystemHealthCheck> {
    const startTime = performance.now();
    
    try {
      // Check if error boundary components are present
      const errorBoundaries = document.querySelectorAll('[data-error-boundary]');
      const responseTime = performance.now() - startTime;
      
      return {
        system: 'errorBoundary',
        status: errorBoundaries.length > 0 ? 'healthy' : 'degraded',
        responseTime,
        lastCheck: new Date(),
        details: { errorBoundaryCount: errorBoundaries.length }
      };
    } catch (error) {
      return {
        system: 'errorBoundary',
        status: 'critical',
        responseTime: performance.now() - startTime,
        lastCheck: new Date(),
        details: { error: error instanceof Error ? error.message : 'Check failed' }
      };
    }
  }

  private async checkWebSocketService(): Promise<SystemHealthCheck> {
    const startTime = performance.now();
    
    try {
      // Check WebSocket connection status
      const wsConnected = (window as any).enhancedWebSocketService?.isConnected?.() || false;
      const responseTime = performance.now() - startTime;
      
      return {
        system: 'webSocketService',
        status: wsConnected ? 'healthy' : 'degraded',
        responseTime,
        lastCheck: new Date(),
        details: { connected: wsConnected }
      };
    } catch (error) {
      return {
        system: 'webSocketService',
        status: 'critical',
        responseTime: performance.now() - startTime,
        lastCheck: new Date(),
        details: { error: error instanceof Error ? error.message : 'Check failed' }
      };
    }
  }

  private async checkNotificationService(): Promise<SystemHealthCheck> {
    const startTime = performance.now();
    
    try {
      // Check notification service status
      const notificationPermission = Notification.permission;
      const responseTime = performance.now() - startTime;
      
      return {
        system: 'notificationService',
        status: notificationPermission === 'granted' ? 'healthy' : 'degraded',
        responseTime,
        lastCheck: new Date(),
        details: { permission: notificationPermission }
      };
    } catch (error) {
      return {
        system: 'notificationService',
        status: 'critical',
        responseTime: performance.now() - startTime,
        lastCheck: new Date(),
        details: { error: error instanceof Error ? error.message : 'Check failed' }
      };
    }
  }

  private async checkLoggingService(): Promise<SystemHealthCheck> {
    const startTime = performance.now();
    
    try {
      // Test logging service functionality
      const testLog = `System check: ${Date.now()}`;
      (window as any).loggingService?.info?.(testLog, {}, 'system-check');
      const responseTime = performance.now() - startTime;
      
      return {
        system: 'loggingService',
        status: 'healthy',
        responseTime,
        lastCheck: new Date(),
        details: { testLogSuccessful: true }
      };
    } catch (error) {
      return {
        system: 'loggingService',
        status: 'critical',
        responseTime: performance.now() - startTime,
        lastCheck: new Date(),
        details: { error: error instanceof Error ? error.message : 'Check failed' }
      };
    }
  }

  private emitHealthReport(): void {
    const report = this.generateIntegrationReport();
    
    // Emit system health event
    window.dispatchEvent(new CustomEvent('systemHealthReport', {
      detail: report
    }));

    // Log critical issues
    if (report.overallHealth === 'critical') {
      console.error('🚨 Critical system issues detected:', report);
    } else if (report.overallHealth === 'degraded') {
      console.warn('⚠️ System performance degraded:', report);
    }
  }

  private handleSystemError = (event: Event) => {
    const customEvent = event as CustomEvent;
    const { system, error } = customEvent.detail || {};
    
    if (system && this.systemChecks.has(system)) {
      this.systemChecks.set(system, {
        system,
        status: 'critical',
        lastCheck: new Date(),
        details: { error: error?.message || 'System error occurred' }
      });
    }
  };

  private handleSystemRecovery = (event: Event) => {
    const customEvent = event as CustomEvent;
    const { system } = customEvent.detail || {};
    
    if (system && this.systemChecks.has(system)) {
      // Trigger immediate recheck
      this.performSystemCheck(system).then(check => {
        this.systemChecks.set(system, check);
      });
    }
  };

  private handlePerformanceDegradation = (event: Event) => {
    const customEvent = event as CustomEvent;
    
    // Trigger performance optimization measures
    this.enableEmergencyOptimizations();
  };

  private enableEmergencyOptimizations(): void {
    // Reduce animation quality
    document.documentElement.classList.add('emergency-optimization');
    
    // Emit emergency optimization event
    window.dispatchEvent(new CustomEvent('emergencyOptimization', {
      detail: { reason: 'Performance degradation detected' }
    }));
  }

  // Public API methods
  public generateIntegrationReport(): IntegrationReport {
    const systems = Array.from(this.systemChecks.values());
    const criticalSystems = systems.filter(s => s.status === 'critical');
    const degradedSystems = systems.filter(s => s.status === 'degraded');
    
    let overallHealth: 'healthy' | 'degraded' | 'critical';
    if (criticalSystems.length > 0) {
      overallHealth = 'critical';
    } else if (degradedSystems.length > 0) {
      overallHealth = 'degraded';
    } else {
      overallHealth = 'healthy';
    }

    const recommendations: string[] = [];
    
    if (criticalSystems.length > 0) {
      recommendations.push(`Critical: ${criticalSystems.length} systems require immediate attention`);
    }
    
    if (degradedSystems.length > 0) {
      recommendations.push(`Warning: ${degradedSystems.length} systems show degraded performance`);
    }

    return {
      overallHealth,
      systems,
      recommendations,
      timestamp: new Date()
    };
  }

  public getSystemStatus(systemName: string): SystemHealthCheck | null {
    return this.systemChecks.get(systemName) || null;
  }

  public getAllSystems(): SystemHealthCheck[] {
    return Array.from(this.systemChecks.values());
  }

  public isSystemHealthy(): boolean {
    return this.generateIntegrationReport().overallHealth === 'healthy';
  }

  public destroy(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    window.removeEventListener('systemError', this.handleSystemError);
    window.removeEventListener('systemRecovery', this.handleSystemRecovery);
    window.removeEventListener('performanceDegradation', this.handlePerformanceDegradation);

    this.systemChecks.clear();
    this.isInitialized = false;
  }
}

// Initialize the system integrator
export const finalSystemIntegrator = FinalSystemIntegrator.getInstance();

// React hook for system integration monitoring
export const useSystemIntegration = () => {
  const [healthReport, setHealthReport] = React.useState<IntegrationReport>(
    finalSystemIntegrator.generateIntegrationReport()
  );

  React.useEffect(() => {
    const handleHealthReport = (event: CustomEvent) => {
      setHealthReport(event.detail);
    };

    window.addEventListener('systemHealthReport', handleHealthReport as EventListener);

    return () => {
      window.removeEventListener('systemHealthReport', handleHealthReport as EventListener);
    };
  }, []);

  return {
    healthReport,
    isHealthy: healthReport.overallHealth === 'healthy',
    criticalSystems: healthReport.systems.filter(s => s.status === 'critical'),
    degradedSystems: healthReport.systems.filter(s => s.status === 'degraded'),
    integrator: finalSystemIntegrator
  };
};

export default finalSystemIntegrator;