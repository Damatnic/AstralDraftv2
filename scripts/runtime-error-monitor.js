/**
 * 🔍 RUNTIME ERROR MONITORING SYSTEM
 * Real-time error detection and prevention for production environments
 * 
 * This system monitors the application at runtime and provides real-time
 * error detection, reporting, and automatic recovery mechanisms.
 */

const fs = require('fs');
const path = require('path');

class RuntimeErrorMonitor {
  constructor() {
    this.config = {
      errorThreshold: 5, // Max errors before triggering alerts
      memoryThreshold: 100 * 1024 * 1024, // 100MB memory threshold
      responseTimeThreshold: 3000, // 3 seconds response time threshold
      healthCheckInterval: 30000, // 30 seconds health check
      logLevel: process.env.NODE_ENV === 'production' ? 'error' : 'debug'
    };
    
    this.metrics = {
      errors: [],
      warnings: [],
      performance: [],
      memory: [],
      healthStatus: 'healthy'
    };
    
    this.healthCheckTimer = null;
    this.isMonitoring = false;
  }

  start() {
    if (this.isMonitoring) {
      console.log('🔍 Runtime Error Monitor is already running');
      return;
    }

    console.log('🚀 Starting Runtime Error Monitor...');
    this.isMonitoring = true;
    
    this.setupGlobalErrorHandlers();
    this.startHealthChecks();
    this.monitorPerformance();
    this.monitorMemory();
    
    console.log('✅ Runtime Error Monitor is now active');
  }

  stop() {
    if (!this.isMonitoring) {
      return;
    }

    console.log('🛑 Stopping Runtime Error Monitor...');
    this.isMonitoring = false;
    
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = null;
    }
    
    console.log('✅ Runtime Error Monitor stopped');
  }

  setupGlobalErrorHandlers() {
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      this.handleCriticalError('Uncaught Exception', error);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      this.handleCriticalError('Unhandled Promise Rejection', reason, { promise });
    });

    // Handle warnings
    process.on('warning', (warning) => {
      this.handleWarning(warning);
    });

    // Handle memory warnings
    process.on('memoryUsage', (usage) => {
      if (usage.heapUsed > this.config.memoryThreshold) {
        this.handleMemoryWarning(usage);
      }
    });

    console.log('🛡️ Global error handlers configured');
  }

  startHealthChecks() {
    this.healthCheckTimer = setInterval(() => {
      this.performHealthCheck();
    }, this.config.healthCheckInterval);

    console.log('❤️  Health monitoring started');
  }

  performHealthCheck() {
    const health = {
      timestamp: new Date().toISOString(),
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      errorCount: this.metrics.errors.length,
      warningCount: this.metrics.warnings.length,
      status: 'healthy'
    };

    // Check error threshold
    const recentErrors = this.metrics.errors.filter(
      error => Date.now() - error.timestamp < 300000 // Last 5 minutes
    );

    if (recentErrors.length >= this.config.errorThreshold) {
      health.status = 'critical';
      this.triggerAlert('Error threshold exceeded', { 
        count: recentErrors.length, 
        threshold: this.config.errorThreshold 
      });
    }

    // Check memory usage
    if (health.memory.heapUsed > this.config.memoryThreshold) {
      health.status = health.status === 'critical' ? 'critical' : 'warning';
      this.handleMemoryWarning(health.memory);
    }

    this.metrics.healthStatus = health.status;
    this.logHealth(health);
  }

  monitorPerformance() {
    // Monitor HTTP response times if server is present
    if (typeof global.server !== 'undefined') {
      const originalSend = global.server.response.send;
      
      global.server.response.send = function(data) {
        const responseTime = Date.now() - this.startTime;
        
        if (responseTime > this.config.responseTimeThreshold) {
          this.handlePerformanceWarning({
            url: this.req.url,
            method: this.req.method,
            responseTime
          });
        }

        this.metrics.performance.push({
          timestamp: Date.now(),
          url: this.req.url,
          method: this.req.method,
          responseTime,
          status: this.statusCode
        });

        return originalSend.call(this, data);
      }.bind(this);
    }

    console.log('⚡ Performance monitoring enabled');
  }

  monitorMemory() {
    setInterval(() => {
      const usage = process.memoryUsage();
      
      this.metrics.memory.push({
        timestamp: Date.now(),
        ...usage
      });

      // Keep only last 100 memory readings
      if (this.metrics.memory.length > 100) {
        this.metrics.memory = this.metrics.memory.slice(-100);
      }

      // Check for memory leaks (steadily increasing memory)
      if (this.metrics.memory.length >= 10) {
        const recent = this.metrics.memory.slice(-10);
        const trend = this.calculateMemoryTrend(recent);
        
        if (trend > 0.1) { // 10% increase trend
          this.handleMemoryLeak(usage, trend);
        }
      }
    }, 10000); // Check every 10 seconds

    console.log('🧠 Memory monitoring enabled');
  }

  handleCriticalError(type, error, context = {}) {
    const errorRecord = {
      id: this.generateErrorId(),
      timestamp: Date.now(),
      type,
      message: error.message || String(error),
      stack: error.stack,
      context,
      severity: 'critical'
    };

    this.metrics.errors.push(errorRecord);
    this.logError(errorRecord);
    
    // Attempt recovery
    this.attemptRecovery(errorRecord);
    
    // Trigger alert
    this.triggerAlert(`Critical Error: ${type}`, errorRecord);
  }

  handleWarning(warning) {
    const warningRecord = {
      id: this.generateErrorId(),
      timestamp: Date.now(),
      type: 'Warning',
      message: warning.message,
      name: warning.name,
      severity: 'warning'
    };

    this.metrics.warnings.push(warningRecord);
    this.logWarning(warningRecord);
  }

  handleMemoryWarning(usage) {
    const warningRecord = {
      id: this.generateErrorId(),
      timestamp: Date.now(),
      type: 'Memory Usage High',
      usage,
      threshold: this.config.memoryThreshold,
      severity: 'warning'
    };

    this.metrics.warnings.push(warningRecord);
    this.logWarning(warningRecord);
    
    // Suggest garbage collection
    if (global.gc && typeof global.gc === 'function') {
      global.gc();
      console.log('🗑️  Garbage collection triggered');
    }
  }

  handleMemoryLeak(usage, trend) {
    const alertRecord = {
      id: this.generateErrorId(),
      timestamp: Date.now(),
      type: 'Potential Memory Leak',
      usage,
      trend,
      severity: 'critical'
    };

    this.metrics.errors.push(alertRecord);
    this.triggerAlert('Memory Leak Detected', alertRecord);
  }

  handlePerformanceWarning(performanceData) {
    const warningRecord = {
      id: this.generateErrorId(),
      timestamp: Date.now(),
      type: 'Slow Response',
      ...performanceData,
      threshold: this.config.responseTimeThreshold,
      severity: 'warning'
    };

    this.metrics.warnings.push(warningRecord);
    this.logWarning(warningRecord);
  }

  calculateMemoryTrend(memoryReadings) {
    if (memoryReadings.length < 2) return 0;
    
    const first = memoryReadings[0].heapUsed;
    const last = memoryReadings[memoryReadings.length - 1].heapUsed;
    
    return (last - first) / first;
  }

  attemptRecovery(errorRecord) {
    console.log(`🔄 Attempting recovery for error: ${errorRecord.type}`);
    
    // Recovery strategies based on error type
    switch (errorRecord.type) {
      case 'Unhandled Promise Rejection':
        // Log and continue - already handled by preventing crash
        console.log('✅ Promise rejection handled gracefully');
        break;
        
      case 'Uncaught Exception':
        // This is more serious - log extensively and attempt graceful shutdown
        console.log('⚠️  Uncaught exception detected - preparing graceful shutdown');
        this.gracefulShutdown(errorRecord);
        break;
        
      default:
        console.log('ℹ️  No specific recovery strategy for this error type');
    }
  }

  gracefulShutdown(errorRecord) {
    console.log('🛑 Initiating graceful shutdown...');
    
    // Save error report
    this.generateErrorReport();
    
    // Close database connections, clean up resources, etc.
    process.emit('SIGTERM');
  }

  triggerAlert(title, data) {
    const alert = {
      timestamp: new Date().toISOString(),
      title,
      data,
      environment: process.env.NODE_ENV || 'development'
    };

    console.error(`🚨 ALERT: ${title}`);
    console.error(JSON.stringify(alert, null, 2));
    
    // In production, this would send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(alert);
    }
  }

  sendToMonitoringService(alert) {
    // Placeholder for external monitoring service integration
    // Could be Datadog, New Relic, Sentry, etc.
    console.log('📡 Sending alert to monitoring service...');
  }

  generateErrorReport() {
    const report = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      metrics: this.metrics,
      systemInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        pid: process.pid
      }
    };

    const reportPath = path.join(process.cwd(), `error-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📄 Error report saved to: ${reportPath}`);
    return reportPath;
  }

  generateErrorId() {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  logError(error) {
    if (this.config.logLevel === 'debug' || this.config.logLevel === 'error') {
      console.error(`🔴 [${new Date().toISOString()}] ${error.type}: ${error.message}`);
    }
  }

  logWarning(warning) {
    if (this.config.logLevel === 'debug' || this.config.logLevel === 'warning') {
      console.warn(`🟡 [${new Date().toISOString()}] ${warning.type}: ${warning.message}`);
    }
  }

  logHealth(health) {
    if (this.config.logLevel === 'debug') {
      const statusIcon = health.status === 'healthy' ? '💚' : 
                        health.status === 'warning' ? '🟡' : '🔴';
      console.log(`${statusIcon} Health: ${health.status} | Memory: ${Math.round(health.memory.heapUsed / 1024 / 1024)}MB | Errors: ${health.errorCount}`);
    }
  }

  // Public API
  getMetrics() {
    return {
      ...this.metrics,
      systemInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        uptime: process.uptime(),
        memory: process.memoryUsage()
      }
    };
  }

  getHealthStatus() {
    return this.metrics.healthStatus;
  }
}

// Singleton instance
const runtimeMonitor = new RuntimeErrorMonitor();

// Auto-start in production
if (process.env.NODE_ENV === 'production') {
  runtimeMonitor.start();
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📊 Generating final error report...');
  runtimeMonitor.generateErrorReport();
  runtimeMonitor.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📊 Generating final error report...');
  runtimeMonitor.generateErrorReport();
  runtimeMonitor.stop();
  process.exit(0);
});

module.exports = RuntimeErrorMonitor;