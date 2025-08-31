import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useState, useEffect, useMemo } from 'react';
import { 
  accessibilityMonitoringService, 
  AccessibilityMetrics, 
  ViolationTrend,
  ComponentAccessibilityMetric 
} from '../../services/accessibilityMonitoringService';

interface AccessibilityDashboardProps {
  className?: string;

}

export const AccessibilityDashboard: React.FC<AccessibilityDashboardProps> = ({ className = ''  }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [metrics, setMetrics] = useState<AccessibilityMetrics | null>(null);
  const [history, setHistory] = useState<AccessibilityMetrics[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<7 | 30 | 90>(30);
  const [selectedComponent, setSelectedComponent] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    loadDashboardData();
    setLastUpdated(new Date().toLocaleString());
  }, [selectedTimeRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load from dashboard data file or localStorage
      const dashboardDataPath = 'accessibility-reports/dashboard-data.json';
      
      try {

        const response = await fetch(dashboardDataPath);
        const dashboardData = await response.json();
        setHistory(dashboardData.history || []);
        setMetrics(dashboardData.latestMetrics);
      
    } catch (error) {
        // Fallback to localStorage
        const historyData = accessibilityMonitoringService.getMetricsHistory();
        setHistory(historyData);
        
        if (historyData.length > 0) {
          setMetrics(historyData[0]);


    } catch (error) {
    } finally {
      setLoading(false);

  };

  const trendData = useMemo(() => {
    return accessibilityMonitoringService.getTrendData(selectedTimeRange);
  }, [history, selectedTimeRange]);

  const overallScore = useMemo(() => {
    if (!metrics) return 0;
    const { violationsByLevel, wcagCompliance } = metrics;
    const violationPenalty = 
      (violationsByLevel.critical * 10) +
      (violationsByLevel.serious * 5) +
      (violationsByLevel.moderate * 2) +
      (violationsByLevel.minor * 1);
    return Math.max(0, Math.min(100, wcagCompliance.levelAA - violationPenalty));
  }, [metrics]);

  const trendDirection = useMemo(() => {
    if (trendData.length < 2) return 'stable';
    const recent = trendData[trendData.length - 1];
    const previous = trendData[trendData.length - 2];
    if (recent.total < previous.total) return 'improving';
    if (recent.total > previous.total) return 'declining';
    return 'stable';
  }, [trendData]);

  if (loading) {
    return (
      <div className={`accessibility-dashboard ${className}`}>
        <div className="loading-state sm:px-4 md:px-6 lg:px-8">
          <div className="spinner sm:px-4 md:px-6 lg:px-8" aria-label="Loading accessibility dashboard">
            <span className="sr-only sm:px-4 md:px-6 lg:px-8">Loading...</span>
          </div>
          <p>Loading accessibility metrics...</p>
        </div>
      </div>
    );

  if (!metrics) {
    return (
      <div className={`accessibility-dashboard ${className}`}>
        <div className="empty-state sm:px-4 md:px-6 lg:px-8">
          <h2>No Accessibility Data Available</h2>
          <p>Run accessibility tests to see metrics and trends.</p>
          <button className="btn-primary sm:px-4 md:px-6 lg:px-8" onClick={() => window.location.reload()}>
            Refresh Dashboard
          </button>
        </div>
      </div>
    );

  return (
    <div className={`accessibility-dashboard ${className}`}>
      <header className="dashboard-header sm:px-4 md:px-6 lg:px-8">
        <div className="header-content sm:px-4 md:px-6 lg:px-8">
          <h1>Accessibility Monitoring Dashboard</h1>
          <div className="header-controls sm:px-4 md:px-6 lg:px-8">
            <div className="time-range-selector sm:px-4 md:px-6 lg:px-8">
              <label htmlFor="timeRange">Time Range:</label>
              <select
                id="timeRange"
                value={selectedTimeRange}
                onChange={(e: any) => setSelectedTimeRange(Number(e.target.value) as 7 | 30 | 90)}
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </div>
            <div className="component-selector sm:px-4 md:px-6 lg:px-8">
              <label htmlFor="component">Component:</label>
              <select
                id="component"
                value={selectedComponent}
                onChange={(e: any) => setSelectedComponent(e.target.value)}
                <option value="all">All Components</option>
                {metrics.componentMetrics.map((component: any) => (
                  <option key={component.componentName} value={component.componentName}>
                    {component.componentName}
                  </option>
                ))}
              </select>
            </div>
            <button className="refresh-btn sm:px-4 md:px-6 lg:px-8" onClick={loadDashboardData} aria-label="Refresh dashboard">
              🔄 Refresh
            </button>
          </div>
        </div>
        <div className="last-updated sm:px-4 md:px-6 lg:px-8">
          Last updated: {lastUpdated}
        </div>
      </header>

      <div className="dashboard-grid sm:px-4 md:px-6 lg:px-8">
        {/* Key Metrics Cards */}
        <div className="metrics-cards sm:px-4 md:px-6 lg:px-8">
          <MetricCard
            title="Overall Score"
            value={overallScore}
            unit="%"
            trend={trendDirection}
            color={overallScore >= 90 ? 'success' : overallScore >= 70 ? 'warning' : 'danger'}
          />
          <MetricCard
            title="Total Violations"
            value={metrics.totalViolations}
            trend={trendDirection}
            color={metrics.totalViolations === 0 ? 'success' : metrics.totalViolations <= 5 ? 'warning' : 'danger'}
          />
          <MetricCard
            title="WCAG AA Compliance"
            value={Math.round(metrics.wcagCompliance.levelAA)}
            unit="%"
            trend={trendDirection}
            color={metrics.wcagCompliance.levelAA >= 95 ? 'success' : metrics.wcagCompliance.levelAA >= 80 ? 'warning' : 'danger'}
          />
          <MetricCard
            title="Test Coverage"
            value={Math.round(metrics.testCoverage.coveragePercentage)}
            unit="%"
            trend="stable"
            color={metrics.testCoverage.coveragePercentage >= 90 ? 'success' : metrics.testCoverage.coveragePercentage >= 70 ? 'warning' : 'danger'}
          />
        </div>

        {/* Violations Trend Chart */}
        <div className="chart-container sm:px-4 md:px-6 lg:px-8">
          <h3>Violations Trend (Last {selectedTimeRange} days)</h3>
          <SimpleTrendChart data={trendData} />
        </div>

        {/* Violation Distribution */}
        <div className="chart-container sm:px-4 md:px-6 lg:px-8">
          <h3>Current Violations by Severity</h3>
          <ViolationDistributionChart violationsByLevel={metrics.violationsByLevel} />
        </div>

        {/* Component Status */}
        <div className="component-status sm:px-4 md:px-6 lg:px-8">
          <h3>Component Accessibility Status</h3>
          <ComponentStatusTable components={metrics.componentMetrics} />
        </div>

        {/* WCAG Compliance Levels */}
        <div className="wcag-compliance sm:px-4 md:px-6 lg:px-8">
          <h3>WCAG Compliance Levels</h3>
          <WCAGComplianceChart wcagCompliance={metrics.wcagCompliance} />
        </div>

        {/* Performance Metrics */}
        <div className="performance-metrics sm:px-4 md:px-6 lg:px-8">
          <h3>Performance Metrics</h3>
          <div className="performance-grid sm:px-4 md:px-6 lg:px-8">
            <div className="performance-item sm:px-4 md:px-6 lg:px-8">
              <span className="label sm:px-4 md:px-6 lg:px-8">Test Execution Time:</span>
              <span className="value sm:px-4 md:px-6 lg:px-8">{metrics.performanceMetrics.testExecutionTime.toFixed(2)}s</span>
            </div>
            <div className="performance-item sm:px-4 md:px-6 lg:px-8">
              <span className="label sm:px-4 md:px-6 lg:px-8">Avg Violations per Component:</span>
              <span className="value sm:px-4 md:px-6 lg:px-8">{metrics.performanceMetrics.averageViolationsPerComponent.toFixed(1)}</span>
            </div>
            <div className="performance-item sm:px-4 md:px-6 lg:px-8">
              <span className="label sm:px-4 md:px-6 lg:px-8">Total Components Tested:</span>
              <span className="value sm:px-4 md:px-6 lg:px-8">{metrics.testCoverage.testedComponents}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: number;
  unit?: string;
  trend: 'improving' | 'declining' | 'stable';
  color: 'success' | 'warning' | 'danger';

}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit = '', trend, color }) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      default: return '➡️';

  };

  const getTrendText = () => {
    switch (trend) {
      case 'improving': return 'Improving';
      case 'declining': return 'Declining';
      default: return 'Stable';

  };

  return (
    <div className={`metric-card metric-card--${color}`}>
      <div className="metric-card__header sm:px-4 md:px-6 lg:px-8">
        <h4>{title}</h4>
        <div className={`trend-indicator trend-indicator--${trend}`} title={getTrendText()}>
          {getTrendIcon()}
        </div>
      </div>
      <div className="metric-card__value sm:px-4 md:px-6 lg:px-8">
        {value}
        {unit && <span className="unit sm:px-4 md:px-6 lg:px-8">{unit}</span>}
      </div>
      <div className="metric-card__trend sm:px-4 md:px-6 lg:px-8">
        {getTrendText()}
      </div>
    </div>
  );
};

interface SimpleTrendChartProps {
  data: ViolationTrend[];

}

const SimpleTrendChart: React.FC<SimpleTrendChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map((d: any) => Math.max(d.critical, d.serious, d.moderate, d.minor, d.total)));
  const chartHeight = 200;
  const chartWidth = 100;

  if (data.length === 0) {
    return <div className="no-data sm:px-4 md:px-6 lg:px-8">No trend data available</div>;

  return (
    <div className="simple-trend-chart sm:px-4 md:px-6 lg:px-8">
      <div className="chart-legend sm:px-4 md:px-6 lg:px-8">
        <div className="legend-item sm:px-4 md:px-6 lg:px-8">
          <span className="legend-color critical sm:px-4 md:px-6 lg:px-8"></span>
          <span>Critical</span>
        </div>
        <div className="legend-item sm:px-4 md:px-6 lg:px-8">
          <span className="legend-color serious sm:px-4 md:px-6 lg:px-8"></span>
          <span>Serious</span>
        </div>
        <div className="legend-item sm:px-4 md:px-6 lg:px-8">
          <span className="legend-color moderate sm:px-4 md:px-6 lg:px-8"></span>
          <span>Moderate</span>
        </div>
        <div className="legend-item sm:px-4 md:px-6 lg:px-8">
          <span className="legend-color minor sm:px-4 md:px-6 lg:px-8"></span>
          <span>Minor</span>
        </div>
      </div>
      
      <div className="chart-area sm:px-4 md:px-6 lg:px-8" style={{ height: chartHeight }}>
        <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
            <line
              key={index}
              x1="0"
              x2={chartWidth}
              y1={chartHeight * ratio}
              y2={chartHeight * ratio}
              stroke="#e9ecef"
              strokeWidth="1"
            />
          ))}
          
          {/* Data lines */}
          {data.length > 1 && (
            <>
              {/* Total violations line */}
              <polyline
                fill="none"
                stroke="#6c757d"
                strokeWidth="2"
                points={data.map((d, i) => 
                  `${(i / (data.length - 1)) * chartWidth},${chartHeight - (d.total / maxValue) * chartHeight}`
                ).join(' ')}
              />
              
              {/* Critical violations line */}
              <polyline
                fill="none"
                stroke="#dc3545"
                strokeWidth="2"
                points={data.map((d, i) => 
                  `${(i / (data.length - 1)) * chartWidth},${chartHeight - (d.critical / maxValue) * chartHeight}`
                ).join(' ')}
              />
              
              {/* Serious violations line */}
              <polyline
                fill="none"
                stroke="#fd7e14"
                strokeWidth="2"
                points={data.map((d, i) => 
                  `${(i / (data.length - 1)) * chartWidth},${chartHeight - (d.serious / maxValue) * chartHeight}`
                ).join(' ')}
              />
            </>
          )}
          
          {/* Data points */}
          {data.map((d, i) => (
            <g key={i}>
              <circle
                cx={(i / (data.length - 1)) * chartWidth}
                cy={chartHeight - (d.total / maxValue) * chartHeight}
                r="3"
                fill="#6c757d"
              />
              {d.critical > 0 && (
                <circle
                  cx={(i / (data.length - 1)) * chartWidth}
                  cy={chartHeight - (d.critical / maxValue) * chartHeight}
                  r="3"
                  fill="#dc3545"
                />
              )}
            </g>
          ))}
        </svg>
      </div>
      
      <div className="chart-x-axis sm:px-4 md:px-6 lg:px-8">
        {data.map((d, i) => (
          <span key={i} className="x-axis-label sm:px-4 md:px-6 lg:px-8">
            {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        ))}
      </div>
    </div>
  );
};

interface ViolationDistributionChartProps {
  violationsByLevel: AccessibilityMetrics['violationsByLevel'];

}

const ViolationDistributionChart: React.FC<ViolationDistributionChartProps> = ({ violationsByLevel }) => {
  const total = Object.values(violationsByLevel).reduce((sum, count) => sum + count, 0);
  
  if (total === 0) {
    return <div className="no-violations sm:px-4 md:px-6 lg:px-8">🎉 No violations found!</div>;

  const items = [
    { label: 'Critical', count: violationsByLevel.critical, color: '#dc3545' },
    { label: 'Serious', count: violationsByLevel.serious, color: '#fd7e14' },
    { label: 'Moderate', count: violationsByLevel.moderate, color: '#ffc107' },
    { label: 'Minor', count: violationsByLevel.minor, color: '#28a745' }
  ].filter((item: any) => item.count > 0);

  return (
    <div className="violation-distribution sm:px-4 md:px-6 lg:px-8">
      <div className="distribution-bars sm:px-4 md:px-6 lg:px-8">
        {items.map((item, index) => {
          const percentage = (item.count / total) * 100;
          return (
            <div key={item.label} className="distribution-bar sm:px-4 md:px-6 lg:px-8">
              <div className="bar-label sm:px-4 md:px-6 lg:px-8">
                <span className="label-text sm:px-4 md:px-6 lg:px-8">{item.label}</span>
                <span className="label-count sm:px-4 md:px-6 lg:px-8">{item.count} ({percentage.toFixed(1)}%)</span>
              </div>
              <div className="bar-container sm:px-4 md:px-6 lg:px-8">
                <div 
                  className="bar-fill sm:px-4 md:px-6 lg:px-8"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: item.color
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface ComponentStatusTableProps {
  components: ComponentAccessibilityMetric[];

}

const ComponentStatusTable: React.FC<ComponentStatusTableProps> = ({ components }) => {
  const getStatusIcon = (status: ComponentAccessibilityMetric['status']) => {
    switch (status) {
      case 'passing': return '✅';
      case 'warning': return '⚠️';
      case 'failing': return '❌';
      default: return '❓';

  };

  const getStatusText = (status: ComponentAccessibilityMetric['status']) => {
    switch (status) {
      case 'passing': return 'Passing';
      case 'warning': return 'Warning';
      case 'failing': return 'Failing';
      default: return 'Unknown';

  };

  return (
    <div className="component-table-container sm:px-4 md:px-6 lg:px-8">
      <table className="component-status-table sm:px-4 md:px-6 lg:px-8">
        <thead>
          <tr>
            <th>Component</th>
            <th>Status</th>
            <th>WCAG Score</th>
            <th>Violations</th>
            <th>Last Tested</th>
          </tr>
        </thead>
        <tbody>
          {components.map((component: any) => (
            <tr key={component.componentName} className={`status-${component?.status}`}>
              <td className="component-name sm:px-4 md:px-6 lg:px-8">{component.componentName}</td>
              <td className="status-cell sm:px-4 md:px-6 lg:px-8">
                <span className="status-indicator sm:px-4 md:px-6 lg:px-8">
                  {getStatusIcon(component?.status)}
                  <span className="sr-only sm:px-4 md:px-6 lg:px-8">{getStatusText(component?.status)}</span>
                </span>
                {getStatusText(component?.status)}
              </td>
              <td className="score-cell sm:px-4 md:px-6 lg:px-8">
                <div className="score-bar-container sm:px-4 md:px-6 lg:px-8">
                  <div 
                    className="score-bar sm:px-4 md:px-6 lg:px-8" 
                    style={{ 
                      width: `${component.wcagScore}%`,
                      backgroundColor: component.wcagScore >= 90 ? '#28a745' : 
                                     component.wcagScore >= 70 ? '#ffc107' : '#dc3545'
                    }}
                  ></div>
                  <span className="score-text sm:px-4 md:px-6 lg:px-8">{component.wcagScore}%</span>
                </div>
              </td>
              <td className="violations-cell sm:px-4 md:px-6 lg:px-8">
                <div className="violations-breakdown sm:px-4 md:px-6 lg:px-8">
                  <span className="total sm:px-4 md:px-6 lg:px-8">{component.violationCount}</span>
                  {component.violationCount > 0 && (
                    <div className="violations-detail sm:px-4 md:px-6 lg:px-8">
                      {component.violationsByLevel.critical > 0 && (
                        <span className="critical sm:px-4 md:px-6 lg:px-8" title="Critical violations">
                          🔴 {component.violationsByLevel.critical}
                        </span>
                      )}
                      {component.violationsByLevel.serious > 0 && (
                        <span className="serious sm:px-4 md:px-6 lg:px-8" title="Serious violations">
                          🟠 {component.violationsByLevel.serious}
                        </span>
                      )}
                      {component.violationsByLevel.moderate > 0 && (
                        <span className="moderate sm:px-4 md:px-6 lg:px-8" title="Moderate violations">
                          🟡 {component.violationsByLevel.moderate}
                        </span>
                      )}
                      {component.violationsByLevel.minor > 0 && (
                        <span className="minor sm:px-4 md:px-6 lg:px-8" title="Minor violations">
                          🟢 {component.violationsByLevel.minor}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </td>
              <td className="last-tested-cell sm:px-4 md:px-6 lg:px-8">
                {new Date(component.lastTested).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface WCAGComplianceChartProps {
  wcagCompliance: AccessibilityMetrics['wcagCompliance'];

}

const WCAGComplianceChart: React.FC<WCAGComplianceChartProps> = ({ wcagCompliance }) => {
  const levels = [
    { label: 'Level A', value: wcagCompliance.levelA },
    { label: 'Level AA', value: wcagCompliance.levelAA },
    { label: 'Level AAA', value: wcagCompliance.levelAAA }
  ];

  return (
    <div className="wcag-compliance-chart sm:px-4 md:px-6 lg:px-8">
      {levels.map((level, index) => (
        <div key={level.label} className="compliance-bar sm:px-4 md:px-6 lg:px-8">
          <div className="compliance-label sm:px-4 md:px-6 lg:px-8">
            <span className="label-text sm:px-4 md:px-6 lg:px-8">{level.label}</span>
            <span className="label-percentage sm:px-4 md:px-6 lg:px-8">{Math.round(level.value)}%</span>
          </div>
          <div className="compliance-bar-container sm:px-4 md:px-6 lg:px-8">
            <div 
              className="compliance-bar-fill sm:px-4 md:px-6 lg:px-8"
              style={{ 
                width: `${level.value}%`,
                backgroundColor: level.value >= 95 ? '#28a745' : 
                               level.value >= 80 ? '#ffc107' : '#dc3545'
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const AccessibilityDashboardWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <AccessibilityDashboard {...props} />
  </ErrorBoundary>
);

export default React.memo(AccessibilityDashboardWithErrorBoundary);
