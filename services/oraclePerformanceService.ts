/**
 * Oracle Performance Service
 * Monitors and optimizes Oracle prediction system performance, analytics, and resource usage
 */

export interface PerformanceMetrics {
  timestamp: Date;
  requestsPerSecond: number;
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  errorRate: number;
  throughput: number;
  concurrentUsers: number;
  memoryUsage: MemoryMetrics;
  cpuUsage: CPUMetrics;
  databaseMetrics: DatabaseMetrics;
  cacheMetrics: CacheMetrics;
  networkMetrics: NetworkMetrics;
}

export interface MemoryMetrics {
  used: number;
  available: number;
  total: number;
  usagePercentage: number;
  heapUsed: number;
  heapTotal: number;
  external: number;
  gcCount: number;
  gcTime: number;
}

export interface CPUMetrics {
  usage: number;
  loadAverage: number[];
  processTime: number;
  systemTime: number;
  userTime: number;
  idleTime: number;
  cores: number;
}

export interface DatabaseMetrics {
  connectionCount: number;
  activeConnections: number;
  queryLatency: number;
  slowQueries: number;
  lockWaitTime: number;
  deadlocks: number;
  bufferHitRatio: number;
  transactionsPerSecond: number;
}

export interface CacheMetrics {
  hitRate: number;
  missRate: number;
  evictionRate: number;
  size: number;
  maxSize: number;
  memoryUsage: number;
  averageAccessTime: number;
  hotKeys: Array<{
    key: string;
    accessCount: number;
    lastAccessed: Date;
  }>;
}

export interface NetworkMetrics {
  bandwidth: number;
  latency: number;
  packetLoss: number;
  connectionErrors: number;
  timeouts: number;
  retries: number;
  bytesTransferred: number;
}

export interface PerformanceAlert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  title: string;
  description: string;
  metric: string;
  threshold: number;
  currentValue: number;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
  actions: AlertAction[];
}

export interface AlertAction {
  type: 'scale_up' | 'scale_down' | 'restart' | 'cache_clear' | 'notify';
  description: string;
  automated: boolean;
  executed: boolean;
  executedAt?: Date;
  result?: string;
}

export interface PerformanceOptimization {
  id: string;
  type: 'cache_optimization' | 'query_optimization' | 'resource_scaling' | 'load_balancing';
  description: string;
  expectedImprovement: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedEffort: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Date;
  completedAt?: Date;
  results?: OptimizationResults;
}

export interface OptimizationResults {
  performanceGain: number;
  costSavings: number;
  resourceReduction: number;
  userExperienceImprovement: string;
  metricsImpacted: Array<{
    metric: string;
    beforeValue: number;
    afterValue: number;
    improvement: number;
  }>;
}

export interface ResourceUsage {
  service: string;
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  cost: number;
  efficiency: number;
  timestamp: Date;
}

export interface PerformanceBaseline {
  metric: string;
  value: number;
  timestamp: Date;
  environment: 'development' | 'staging' | 'production';
  confidence: number;
  variability: number;
}

export interface LoadTestResult {
  id: string;
  name: string;
  configuration: LoadTestConfiguration;
  startTime: Date;
  endTime: Date;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  metrics: PerformanceMetrics[];
  summary: LoadTestSummary;
  bottlenecks: Bottleneck[];
}

export interface LoadTestConfiguration {
  virtualUsers: number;
  duration: number;
  rampUpTime: number;
  targetRPS: number;
  scenarios: TestScenario[];
  environment: string;
}

export interface TestScenario {
  name: string;
  weight: number;
  steps: TestStep[];
}

export interface TestStep {
  action: 'request' | 'wait' | 'think_time' | 'validation';
  parameters: Record<string, unknown>;
  timeout: number;
  retries: number;
}

export interface LoadTestSummary {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  maxResponseTime: number;
  minResponseTime: number;
  requestsPerSecond: number;
  errorRate: number;
  throughput: number;
}

export interface Bottleneck {
  component: string;
  type: 'cpu' | 'memory' | 'disk' | 'network' | 'database' | 'cache';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: string;
  recommendations: string[];
  estimatedCost: number;
}

export interface PerformanceReport {
  id: string;
  title: string;
  description: string;
  period: {
    start: Date;
    end: Date;
  };
  metrics: PerformanceMetrics[];
  trends: PerformanceTrend[];
  alerts: PerformanceAlert[];
  optimizations: PerformanceOptimization[];
  recommendations: string[];
  summary: ReportSummary;
  createdAt: Date;
}

export interface PerformanceTrend {
  metric: string;
  direction: 'improving' | 'degrading' | 'stable';
  change: number;
  changePercentage: number;
  significance: 'low' | 'medium' | 'high';
  dataPoints: Array<{
    timestamp: Date;
    value: number;
  }>;
}

export interface ReportSummary {
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor';
  keyMetrics: Record<string, number>;
  majorIssues: string[];
  achievements: string[];
  nextSteps: string[];
}

class OraclePerformanceService {
  private metrics: PerformanceMetrics[] = [];
  private alerts: PerformanceAlert[] = [];
  private optimizations: PerformanceOptimization[] = [];
  private baselines: PerformanceBaseline[] = [];
  private loadTests: LoadTestResult[] = [];
  private reports: PerformanceReport[] = [];

  private alertThresholds = {
    responseTime: 2000, // ms
    errorRate: 0.05, // 5%
    cpuUsage: 0.8, // 80%
    memoryUsage: 0.85, // 85%
    cacheHitRate: 0.9 // 90%
  };

  /**
   * Collect current performance metrics
   */
  async collectMetrics(): Promise<PerformanceMetrics> {
    const timestamp = new Date();
    
    const metrics: PerformanceMetrics = {
      timestamp,
      requestsPerSecond: this.calculateRequestsPerSecond(),
      averageResponseTime: this.calculateAverageResponseTime(),
      p95ResponseTime: this.calculatePercentileResponseTime(95),
      p99ResponseTime: this.calculatePercentileResponseTime(99),
      errorRate: this.calculateErrorRate(),
      throughput: this.calculateThroughput(),
      concurrentUsers: this.getConcurrentUsers(),
      memoryUsage: this.getMemoryMetrics(),
      cpuUsage: this.getCPUMetrics(),
      databaseMetrics: this.getDatabaseMetrics(),
      cacheMetrics: this.getCacheMetrics(),
      networkMetrics: this.getNetworkMetrics()
    };

    this.metrics.push(metrics);
    this.checkAlerts(metrics);
    
    return metrics;
  }

  /**
   * Get performance metrics for a time range
   */
  getMetrics(startTime: Date, endTime: Date): PerformanceMetrics[] {
    return this.metrics.filter(metric => 
      metric.timestamp >= startTime && metric.timestamp <= endTime
    );
  }

  /**
   * Get current system health status
   */
  getHealthStatus(): {
    status: 'healthy' | 'warning' | 'critical';
    score: number;
    issues: string[];
    uptime: number;
  } {
    const recentMetrics = this.getRecentMetrics(300000); // Last 5 minutes
    if (recentMetrics.length === 0) {
      return {
        status: 'critical',
        score: 0,
        issues: ['No metrics available'],
        uptime: 0
      };
    }

    const latestMetrics = recentMetrics[recentMetrics.length - 1];
    const issues: string[] = [];
    let score = 100;

    // Check various health indicators
    if (latestMetrics.averageResponseTime > this.alertThresholds.responseTime) {
      issues.push('High response time');
      score -= 20;
    }

    if (latestMetrics.errorRate > this.alertThresholds.errorRate) {
      issues.push('High error rate');
      score -= 25;
    }

    if (latestMetrics.cpuUsage.usage > this.alertThresholds.cpuUsage) {
      issues.push('High CPU usage');
      score -= 15;
    }

    if (latestMetrics.memoryUsage.usagePercentage > this.alertThresholds.memoryUsage) {
      issues.push('High memory usage');
      score -= 15;
    }

    if (latestMetrics.cacheMetrics.hitRate < this.alertThresholds.cacheHitRate) {
      issues.push('Low cache hit rate');
      score -= 10;
    }

    const status = score >= 80 ? 'healthy' : score >= 60 ? 'warning' : 'critical';
    const uptime = this.calculateUptime();

    return { status, score, issues, uptime };
  }

  /**
   * Create performance alert
   */
  createAlert(
    type: PerformanceAlert['type'],
    title: string,
    description: string,
    metric: string,
    threshold: number,
    currentValue: number
  ): PerformanceAlert {
    const alert: PerformanceAlert = {
      id: this.generateAlertId(),
      type,
      title,
      description,
      metric,
      threshold,
      currentValue,
      timestamp: new Date(),
      resolved: false,
      actions: this.generateAlertActions(type, metric)
    };

    this.alerts.push(alert);
    this.executeAutomatedActions(alert);

    return alert;
  }

  /**
   * Resolve performance alert
   */
  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (!alert) return false;

    alert.resolved = true;
    alert.resolvedAt = new Date();

    return true;
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): PerformanceAlert[] {
    return this.alerts.filter(alert => !alert.resolved);
  }

  /**
   * Create performance optimization recommendation
   */
  createOptimization(
    type: PerformanceOptimization['type'],
    description: string,
    expectedImprovement: string,
    priority: PerformanceOptimization['priority'],
    estimatedEffort: string
  ): PerformanceOptimization {
    const optimization: PerformanceOptimization = {
      id: this.generateOptimizationId(),
      type,
      description,
      expectedImprovement,
      priority,
      estimatedEffort,
      status: 'pending',
      createdAt: new Date()
    };

    this.optimizations.push(optimization);
    return optimization;
  }

  /**
   * Execute performance optimization
   */
  async executeOptimization(optimizationId: string): Promise<boolean> {
    const optimization = this.optimizations.find(o => o.id === optimizationId);
    if (!optimization) return false;

    optimization.status = 'in_progress';

    try {
      // Simulate optimization execution
      await this.simulateOptimization(optimization);
      
      optimization.status = 'completed';
      optimization.completedAt = new Date();
      
      return true;
    } catch {
      optimization.status = 'cancelled';
      return false;
    }
  }

  /**
   * Run load test
   */
  async runLoadTest(
    name: string,
    configuration: LoadTestConfiguration
  ): Promise<LoadTestResult> {
    const loadTestId = this.generateLoadTestId();
    
    const loadTest: LoadTestResult = {
      id: loadTestId,
      name,
      configuration,
      startTime: new Date(),
      endTime: new Date(),
      status: 'running',
      metrics: [],
      summary: {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        maxResponseTime: 0,
        minResponseTime: 0,
        requestsPerSecond: 0,
        errorRate: 0,
        throughput: 0
      },
      bottlenecks: []
    };

    this.loadTests.push(loadTest);
    
    // Execute load test
    await this.executeLoadTest(loadTest);
    
    return loadTest;
  }

  /**
   * Generate performance report
   */
  generateReport(
    title: string,
    description: string,
    startDate: Date,
    endDate: Date
  ): PerformanceReport {
    const reportId = this.generateReportId();
    const metrics = this.getMetrics(startDate, endDate);
    const trends = this.analyzeTrends(metrics);
    const periodAlerts = this.alerts.filter(alert => 
      alert.timestamp >= startDate && alert.timestamp <= endDate
    );

    const report: PerformanceReport = {
      id: reportId,
      title,
      description,
      period: { start: startDate, end: endDate },
      metrics,
      trends,
      alerts: periodAlerts,
      optimizations: this.optimizations.filter(opt => 
        opt.createdAt >= startDate && opt.createdAt <= endDate
      ),
      recommendations: this.generateRecommendations(metrics, trends),
      summary: this.generateReportSummary(metrics, trends, periodAlerts),
      createdAt: new Date()
    };

    this.reports.push(report);
    return report;
  }

  /**
   * Set performance baseline
   */
  setBaseline(
    metric: string,
    value: number,
    environment: PerformanceBaseline['environment']
  ): PerformanceBaseline {
    const baseline: PerformanceBaseline = {
      metric,
      value,
      timestamp: new Date(),
      environment,
      confidence: 0.95,
      variability: 0.1
    };

    this.baselines.push(baseline);
    return baseline;
  }

  /**
   * Compare current performance to baseline
   */
  compareToBaseline(metric: string, currentValue: number): {
    baseline: number;
    current: number;
    difference: number;
    percentageChange: number;
    status: 'better' | 'worse' | 'same';
  } {
    const baseline = this.baselines
      .filter(b => b.metric === metric)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

    if (!baseline) {
      return {
        baseline: 0,
        current: currentValue,
        difference: 0,
        percentageChange: 0,
        status: 'same'
      };
    }

    const difference = currentValue - baseline.value;
    const percentageChange = (difference / baseline.value) * 100;
    
    let status: 'better' | 'worse' | 'same' = 'same';
    if (Math.abs(percentageChange) > 5) {
      // For metrics like response time, lower is better
      if (metric.includes('time') || metric.includes('error')) {
        status = difference < 0 ? 'better' : 'worse';
      } else {
        // For metrics like throughput, higher is better
        status = difference > 0 ? 'better' : 'worse';
      }
    }

    return {
      baseline: baseline.value,
      current: currentValue,
      difference,
      percentageChange,
      status
    };
  }

  /**
   * Private helper methods
   */
  private calculateRequestsPerSecond(): number {
    // Simulate RPS calculation
    return 150 + Math.random() * 50;
  }

  private calculateAverageResponseTime(): number {
    // Simulate response time calculation
    return 800 + Math.random() * 400;
  }

  private calculatePercentileResponseTime(percentile: number): number {
    // Simulate percentile calculation
    const base = this.calculateAverageResponseTime();
    const multiplier = percentile === 95 ? 1.5 : percentile === 99 ? 2.0 : 1.0;
    return base * multiplier;
  }

  private calculateErrorRate(): number {
    // Simulate error rate calculation
    return Math.random() * 0.02; // 0-2%
  }

  private calculateThroughput(): number {
    // Simulate throughput calculation
    return 50 + Math.random() * 30; // MB/s
  }

  private getConcurrentUsers(): number {
    // Simulate concurrent users
    return Math.floor(100 + Math.random() * 200);
  }

  private getMemoryMetrics(): MemoryMetrics {
    const total = 8 * 1024 * 1024 * 1024; // 8GB
    const used = total * (0.3 + Math.random() * 0.4);
    
    return {
      used,
      available: total - used,
      total,
      usagePercentage: used / total,
      heapUsed: used * 0.6,
      heapTotal: total * 0.8,
      external: used * 0.1,
      gcCount: Math.floor(Math.random() * 100),
      gcTime: Math.random() * 50
    };
  }

  private getCPUMetrics(): CPUMetrics {
    return {
      usage: 0.2 + Math.random() * 0.6,
      loadAverage: [1.5, 1.2, 1.0],
      processTime: Math.random() * 1000,
      systemTime: Math.random() * 500,
      userTime: Math.random() * 500,
      idleTime: Math.random() * 2000,
      cores: 4
    };
  }

  private getDatabaseMetrics(): DatabaseMetrics {
    return {
      connectionCount: Math.floor(10 + Math.random() * 40),
      activeConnections: Math.floor(5 + Math.random() * 20),
      queryLatency: 50 + Math.random() * 100,
      slowQueries: Math.floor(Math.random() * 5),
      lockWaitTime: Math.random() * 100,
      deadlocks: Math.floor(Math.random() * 2),
      bufferHitRatio: 0.85 + Math.random() * 0.1,
      transactionsPerSecond: 100 + Math.random() * 200
    };
  }

  private getCacheMetrics(): CacheMetrics {
    return {
      hitRate: 0.85 + Math.random() * 0.1,
      missRate: 0.1 + Math.random() * 0.05,
      evictionRate: Math.random() * 0.02,
      size: Math.floor(1000 + Math.random() * 4000),
      maxSize: 5000,
      memoryUsage: 100 + Math.random() * 400, // MB
      averageAccessTime: 1 + Math.random() * 5,
      hotKeys: [
        { key: 'user:123', accessCount: 1500, lastAccessed: new Date() },
        { key: 'prediction:456', accessCount: 1200, lastAccessed: new Date() }
      ]
    };
  }

  private getNetworkMetrics(): NetworkMetrics {
    return {
      bandwidth: 100 + Math.random() * 900, // Mbps
      latency: 10 + Math.random() * 40, // ms
      packetLoss: Math.random() * 0.01, // 0-1%
      connectionErrors: Math.floor(Math.random() * 5),
      timeouts: Math.floor(Math.random() * 3),
      retries: Math.floor(Math.random() * 10),
      bytesTransferred: Math.floor(1000000 + Math.random() * 9000000)
    };
  }

  private checkAlerts(metrics: PerformanceMetrics): void {
    // Response time alert
    if (metrics.averageResponseTime > this.alertThresholds.responseTime) {
      this.createAlert(
        'warning',
        'High Response Time',
        `Average response time (${metrics.averageResponseTime}ms) exceeds threshold`,
        'responseTime',
        this.alertThresholds.responseTime,
        metrics.averageResponseTime
      );
    }

    // Error rate alert
    if (metrics.errorRate > this.alertThresholds.errorRate) {
      this.createAlert(
        'critical',
        'High Error Rate',
        `Error rate (${(metrics.errorRate * 100).toFixed(2)}%) exceeds threshold`,
        'errorRate',
        this.alertThresholds.errorRate,
        metrics.errorRate
      );
    }

    // CPU usage alert
    if (metrics.cpuUsage.usage > this.alertThresholds.cpuUsage) {
      this.createAlert(
        'warning',
        'High CPU Usage',
        `CPU usage (${(metrics.cpuUsage.usage * 100).toFixed(1)}%) exceeds threshold`,
        'cpuUsage',
        this.alertThresholds.cpuUsage,
        metrics.cpuUsage.usage
      );
    }
  }

  private generateAlertActions(type: PerformanceAlert['type'], metric: string): AlertAction[] {
    const actions: AlertAction[] = [];

    if (metric === 'cpuUsage' || metric === 'memoryUsage') {
      actions.push({
        type: 'scale_up',
        description: 'Automatically scale up resources',
        automated: true,
        executed: false
      });
    }

    if (metric === 'responseTime') {
      actions.push({
        type: 'cache_clear',
        description: 'Clear and rebuild cache',
        automated: false,
        executed: false
      });
    }

    actions.push({
      type: 'notify',
      description: 'Notify operations team',
      automated: true,
      executed: false
    });

    return actions;
  }

  private executeAutomatedActions(alert: PerformanceAlert): void {
    alert.actions.forEach(action => {
      if (action.automated && !action.executed) {
        // Simulate action execution
        setTimeout(() => {
          action.executed = true;
          action.executedAt = new Date();
          action.result = 'Success';
        }, 1000);
      }
    });
  }

  private async simulateOptimization(_optimization: PerformanceOptimization): Promise<void> {
    // Simulate optimization work
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  private async executeLoadTest(loadTest: LoadTestResult): Promise<void> {
    // Simulate load test execution
    const duration = loadTest.configuration.duration;
    const interval = 1000; // 1 second intervals
    
    for (let i = 0; i < duration; i += interval) {
      const metrics = await this.collectMetrics();
      loadTest.metrics.push(metrics);
      
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate time
    }

    loadTest.status = 'completed';
    loadTest.endTime = new Date();
    loadTest.summary = this.calculateLoadTestSummary(loadTest.metrics);
    loadTest.bottlenecks = this.identifyBottlenecks(loadTest.metrics);
  }

  private calculateLoadTestSummary(metrics: PerformanceMetrics[]): LoadTestSummary {
    if (metrics.length === 0) {
      return {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        maxResponseTime: 0,
        minResponseTime: 0,
        requestsPerSecond: 0,
        errorRate: 0,
        throughput: 0
      };
    }

    const responseTimes = metrics.map(m => m.averageResponseTime);
    const totalRequests = metrics.reduce((sum, m) => sum + m.requestsPerSecond, 0);
    
    return {
      totalRequests,
      successfulRequests: totalRequests * 0.95,
      failedRequests: totalRequests * 0.05,
      averageResponseTime: responseTimes.reduce((sum, rt) => sum + rt, 0) / responseTimes.length,
      maxResponseTime: Math.max(...responseTimes),
      minResponseTime: Math.min(...responseTimes),
      requestsPerSecond: metrics.reduce((sum, m) => sum + m.requestsPerSecond, 0) / metrics.length,
      errorRate: metrics.reduce((sum, m) => sum + m.errorRate, 0) / metrics.length,
      throughput: metrics.reduce((sum, m) => sum + m.throughput, 0) / metrics.length
    };
  }

  private identifyBottlenecks(metrics: PerformanceMetrics[]): Bottleneck[] {
    const bottlenecks: Bottleneck[] = [];
    
    if (metrics.length === 0) return bottlenecks;

    const avgCPU = metrics.reduce((sum, m) => sum + m.cpuUsage.usage, 0) / metrics.length;
    if (avgCPU > 0.8) {
      bottlenecks.push({
        component: 'CPU',
        type: 'cpu',
        severity: 'high',
        description: 'CPU usage consistently above 80%',
        impact: 'Increased response times and potential service degradation',
        recommendations: ['Scale up CPU resources', 'Optimize algorithms', 'Implement caching'],
        estimatedCost: 500
      });
    }

    return bottlenecks;
  }

  private analyzeTrends(metrics: PerformanceMetrics[]): PerformanceTrend[] {
    const trends: PerformanceTrend[] = [];
    
    if (metrics.length < 2) return trends;

    // Analyze response time trend
    const responseTimes = metrics.map(m => ({ timestamp: m.timestamp, value: m.averageResponseTime }));
    const rtTrend = this.calculateTrend(responseTimes);
    
    trends.push({
      metric: 'Average Response Time',
      direction: rtTrend.direction,
      change: rtTrend.change,
      changePercentage: rtTrend.changePercentage,
      significance: rtTrend.significance,
      dataPoints: responseTimes
    });

    return trends;
  }

  private calculateTrend(dataPoints: Array<{ timestamp: Date; value: number }>): {
    direction: 'improving' | 'degrading' | 'stable';
    change: number;
    changePercentage: number;
    significance: 'low' | 'medium' | 'high';
  } {
    if (dataPoints.length < 2) {
      return { direction: 'stable', change: 0, changePercentage: 0, significance: 'low' };
    }

    const first = dataPoints[0].value;
    const last = dataPoints[dataPoints.length - 1].value;
    const change = last - first;
    const changePercentage = (change / first) * 100;

    let direction: 'improving' | 'degrading' | 'stable' = 'stable';
    if (Math.abs(changePercentage) > 5) {
      direction = change < 0 ? 'improving' : 'degrading';
    }

    const significance = Math.abs(changePercentage) > 20 ? 'high' : 
                       Math.abs(changePercentage) > 10 ? 'medium' : 'low';

    return { direction, change, changePercentage, significance };
  }

  private generateRecommendations(metrics: PerformanceMetrics[], trends: PerformanceTrend[]): string[] {
    const recommendations: string[] = [];
    
    if (metrics.length === 0) return recommendations;

    const latestMetrics = metrics[metrics.length - 1];
    
    if (latestMetrics.averageResponseTime > 1000) {
      recommendations.push('Consider implementing response caching to reduce latency');
    }

    if (latestMetrics.cpuUsage.usage > 0.7) {
      recommendations.push('Monitor CPU usage and consider scaling up resources');
    }

    if (latestMetrics.cacheMetrics.hitRate < 0.8) {
      recommendations.push('Optimize cache strategy to improve hit rate');
    }

    // Check trends for degrading performance
    const degradingTrends = trends.filter(t => t.direction === 'degrading' && t.significance === 'high');
    if (degradingTrends.length > 0) {
      recommendations.push('Investigate performance degradation in key metrics');
    }

    return recommendations;
  }

  private generateReportSummary(
    metrics: PerformanceMetrics[], 
    trends: PerformanceTrend[], 
    alerts: PerformanceAlert[]
  ): ReportSummary {
    const criticalAlerts = alerts.filter(a => a.type === 'critical').length;
    const degradingTrends = trends.filter(t => t.direction === 'degrading').length;
    
    let overallHealth: ReportSummary['overallHealth'] = 'excellent';
    if (criticalAlerts > 0 || degradingTrends > 2) {
      overallHealth = 'poor';
    } else if (alerts.length > 5 || degradingTrends > 0) {
      overallHealth = 'fair';
    } else if (alerts.length > 2) {
      overallHealth = 'good';
    }

    const keyMetrics: Record<string, number> = {};
    if (metrics.length > 0) {
      const latest = metrics[metrics.length - 1];
      keyMetrics['Average Response Time'] = latest.averageResponseTime;
      keyMetrics['Error Rate'] = latest.errorRate * 100;
      keyMetrics['CPU Usage'] = latest.cpuUsage.usage * 100;
      keyMetrics['Cache Hit Rate'] = latest.cacheMetrics.hitRate * 100;
    }

    return {
      overallHealth,
      keyMetrics,
      majorIssues: alerts.filter(a => a.type === 'critical').map(a => a.title),
      achievements: trends.filter(t => t.direction === 'improving').map(t => `Improved ${t.metric}`),
      nextSteps: [
        'Continue monitoring key performance indicators',
        'Address any critical alerts promptly',
        'Review and implement optimization recommendations'
      ]
    };
  }

  private getRecentMetrics(milliseconds: number): PerformanceMetrics[] {
    const cutoff = new Date(Date.now() - milliseconds);
    return this.metrics.filter(metric => metric.timestamp >= cutoff);
  }

  private calculateUptime(): number {
    // Simulate uptime calculation (hours)
    return 720 + Math.random() * 1000; // 720+ hours
  }

  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateOptimizationId(): string {
    return `opt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateLoadTestId(): string {
    return `load_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateReportId(): string {
    return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const oraclePerformanceService = new OraclePerformanceService();
export default oraclePerformanceService;
