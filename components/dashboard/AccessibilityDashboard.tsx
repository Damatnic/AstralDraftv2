import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useState, useEffect, useMemo } from &apos;react&apos;;
import { Line, Bar, Doughnut } from &apos;react-chartjs-2&apos;;
import {
}
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
//   TimeScale
} from &apos;chart.js&apos;;
import &apos;chartjs-adapter-date-fns&apos;;
import { 
}
  accessibilityMonitoringService, 
  AccessibilityMetrics, 
  ViolationTrend,
//   ComponentAccessibilityMetric 
} from &apos;../../services/accessibilityMonitoringService&apos;;

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
//   TimeScale
);

interface AccessibilityDashboardProps {
}
  className?: string;

}

export const AccessibilityDashboard: React.FC<AccessibilityDashboardProps> = ({ className = &apos;&apos;  }: any) => {
}
  const [isLoading, setIsLoading] = React.useState(false);
  const [metrics, setMetrics] = useState<AccessibilityMetrics | null>(null);
  const [history, setHistory] = useState<AccessibilityMetrics[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<7 | 30 | 90>(30);
  const [selectedComponent, setSelectedComponent] = useState<string>(&apos;all&apos;);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(&apos;&apos;);

  useEffect(() => {
}
    loadDashboardData();
    setLastUpdated(new Date().toLocaleString());
  }, [selectedTimeRange]);

  const loadDashboardData = async () => {
}
    setLoading(true);
    try {
}

      // In a real implementation, this would fetch from your testing service
      const historyData = accessibilityMonitoringService.getMetricsHistory();
      setHistory(historyData);
      
      if (historyData.length > 0) {
}
        setMetrics(historyData[0]); // Most recent metrics

    } catch (error) {
}
    } finally {
}
      setLoading(false);

  };

  const trendData = useMemo(() => {
}
    return accessibilityMonitoringService.getTrendData(selectedTimeRange);
  }, [history, selectedTimeRange]);

  const componentTrendData = useMemo(() => {
}
    if (selectedComponent === &apos;all&apos;) return trendData;
    return accessibilityMonitoringService.getComponentTrends(selectedComponent, selectedTimeRange);
  }, [trendData, selectedComponent, selectedTimeRange]);

  const overallScore = useMemo(() => {
}
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
}
    if (trendData.length < 2) return &apos;stable&apos;;
    const recent = trendData[trendData.length - 1];
    const previous = trendData[trendData.length - 2];
    if (recent.total < previous.total) return &apos;improving&apos;;
    if (recent.total > previous.total) return &apos;declining&apos;;
    return &apos;stable&apos;;
  }, [trendData]);

  if (loading) {
}
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
}
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
}
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
          <MetricCard>
            title="Overall Score"
            value={overallScore}
            unit="%"
            trend={trendDirection}
            color={overallScore >= 90 ? &apos;success&apos; : overallScore >= 70 ? &apos;warning&apos; : &apos;danger&apos;}
          />
          <MetricCard>
            title="Total Violations"
            value={metrics.totalViolations}
            trend={trendDirection}
            color={metrics.totalViolations === 0 ? &apos;success&apos; : metrics.totalViolations <= 5 ? &apos;warning&apos; : &apos;danger&apos;}
          />
          <MetricCard>
            title="WCAG AA Compliance"
            value={Math.round(metrics.wcagCompliance.levelAA)}
            unit="%"
            trend={trendDirection}
            color={metrics.wcagCompliance.levelAA >= 95 ? &apos;success&apos; : metrics.wcagCompliance.levelAA >= 80 ? &apos;warning&apos; : &apos;danger&apos;}
          />
          <MetricCard>
            title="Test Coverage"
            value={Math.round(metrics.testCoverage.coveragePercentage)}
            unit="%"
            trend="stable"
            color={metrics.testCoverage.coveragePercentage >= 90 ? &apos;success&apos; : metrics.testCoverage.coveragePercentage >= 70 ? &apos;warning&apos; : &apos;danger&apos;}
          />
        </div>

        {/* Violations Trend Chart */}
        <div className="chart-container sm:px-4 md:px-6 lg:px-8">
          <h3>Violations Trend</h3>
          <ViolationTrendChart data={componentTrendData} />
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
}
  title: string;
  value: number;
  unit?: string;
  trend: &apos;improving&apos; | &apos;declining&apos; | &apos;stable&apos;;
  color: &apos;success&apos; | &apos;warning&apos; | &apos;danger&apos;;

}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit = &apos;&apos;, trend, color }: any) => {
}
  const getTrendIcon = () => {
}
    switch (trend) {
}
      case &apos;improving&apos;: return &apos;📈&apos;;
      case &apos;declining&apos;: return &apos;📉&apos;;
      default: return &apos;➡️&apos;;

  };

  const getTrendText = () => {
}
    switch (trend) {
}
      case &apos;improving&apos;: return &apos;Improving&apos;;
      case &apos;declining&apos;: return &apos;Declining&apos;;
      default: return &apos;Stable&apos;;

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

interface ViolationTrendChartProps {
}
  data: ViolationTrend[];

}

const ViolationTrendChart: React.FC<ViolationTrendChartProps> = ({ data }: any) => {
}
  const chartData = {
}
    labels: data.map((d: any) => d.date),
    datasets: [
      {
}
        label: &apos;Critical&apos;,
        data: data.map((d: any) => d.critical),
        borderColor: &apos;#dc3545&apos;,
        backgroundColor: &apos;rgba(220, 53, 69, 0.1)&apos;,
        tension: 0.1
      },
      {
}
        label: &apos;Serious&apos;,
        data: data.map((d: any) => d.serious),
        borderColor: &apos;#fd7e14&apos;,
        backgroundColor: &apos;rgba(253, 126, 20, 0.1)&apos;,
        tension: 0.1
      },
      {
}
        label: &apos;Moderate&apos;,
        data: data.map((d: any) => d.moderate),
        borderColor: &apos;#ffc107&apos;,
        backgroundColor: &apos;rgba(255, 193, 7, 0.1)&apos;,
        tension: 0.1
      },
      {
}
        label: &apos;Minor&apos;,
        data: data.map((d: any) => d.minor),
        borderColor: &apos;#28a745&apos;,
        backgroundColor: &apos;rgba(40, 167, 69, 0.1)&apos;,
        tension: 0.1

  };

  const options = {
}
    responsive: true,
    plugins: {
}
      legend: {
}
        position: &apos;top&apos; as const,
      },
      title: {
}
        display: false,
      },
    },
    scales: {
}
      y: {
}
        beginAtZero: true,
        ticks: {
}
          stepSize: 1



  };

  return <Line data={chartData} options={options} />;
};

interface ViolationDistributionChartProps {
}
  violationsByLevel: AccessibilityMetrics[&apos;violationsByLevel&apos;];

}

const ViolationDistributionChart: React.FC<ViolationDistributionChartProps> = ({ violationsByLevel }: any) => {
}
  const chartData = {
}
    labels: [&apos;Critical&apos;, &apos;Serious&apos;, &apos;Moderate&apos;, &apos;Minor&apos;],
    datasets: [{
}
      data: [
        violationsByLevel.critical,
        violationsByLevel.serious,
        violationsByLevel.moderate,
        violationsByLevel.minor
      ],
      backgroundColor: [
        &apos;#dc3545&apos;, // Critical - Red
        &apos;#fd7e14&apos;, // Serious - Orange
        &apos;#ffc107&apos;, // Moderate - Yellow
        &apos;#28a745&apos;  // Minor - Green
      ],
      borderWidth: 2,
      borderColor: &apos;#fff&apos;
    }]
  };

  const options = {
}
    responsive: true,
    plugins: {
}
      legend: {
}
        position: &apos;bottom&apos; as const,
      },
      tooltip: {
}
        callbacks: {
}
          label: (context: any) => {
}
            const label = context.label || &apos;&apos;;
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : &apos;0&apos;;
            return `${label}: ${value} (${percentage}%)`;




  };

  return <Doughnut data={chartData} options={options} />;
};

interface ComponentStatusTableProps {
}
  components: ComponentAccessibilityMetric[];

}

const ComponentStatusTable: React.FC<ComponentStatusTableProps> = ({ components }: any) => {
}
  const getStatusIcon = (status: ComponentAccessibilityMetric[&apos;status&apos;]) => {
}
    switch (status) {
}
      case &apos;passing&apos;: return &apos;✅&apos;;
      case &apos;warning&apos;: return &apos;⚠️&apos;;
      case &apos;failing&apos;: return &apos;❌&apos;;
      default: return &apos;❓&apos;;

  };

  const getStatusText = (status: ComponentAccessibilityMetric[&apos;status&apos;]) => {
}
    switch (status) {
}
      case &apos;passing&apos;: return &apos;Passing&apos;;
      case &apos;warning&apos;: return &apos;Warning&apos;;
      case &apos;failing&apos;: return &apos;Failing&apos;;
      default: return &apos;Unknown&apos;;

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
}
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
}
                      width: `${component.wcagScore}%`,
                      backgroundColor: component.wcagScore >= 90 ? &apos;#28a745&apos; : 
                                     component.wcagScore >= 70 ? &apos;#ffc107&apos; : &apos;#dc3545&apos;
                    }}
                  ></div>
                  <span className="score-text sm:px-4 md:px-6 lg:px-8">{component.wcagScore}%</span>
                </div>
              </td>
              <td className="violations-cell sm:px-4 md:px-6 lg:px-8">
                <div className="violations-breakdown sm:px-4 md:px-6 lg:px-8">
                  <span className="total sm:px-4 md:px-6 lg:px-8">{component.violationCount}</span>
                  {component.violationCount > 0 && (
}
                    <div className="violations-detail sm:px-4 md:px-6 lg:px-8">
                      {component.violationsByLevel.critical > 0 && (
}
                        <span className="critical sm:px-4 md:px-6 lg:px-8" title="Critical violations">
                          🔴 {component.violationsByLevel.critical}
                        </span>
                      )}
                      {component.violationsByLevel.serious > 0 && (
}
                        <span className="serious sm:px-4 md:px-6 lg:px-8" title="Serious violations">
                          🟠 {component.violationsByLevel.serious}
                        </span>
                      )}
                      {component.violationsByLevel.moderate > 0 && (
}
                        <span className="moderate sm:px-4 md:px-6 lg:px-8" title="Moderate violations">
                          🟡 {component.violationsByLevel.moderate}
                        </span>
                      )}
                      {component.violationsByLevel.minor > 0 && (
}
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
}
  wcagCompliance: AccessibilityMetrics[&apos;wcagCompliance&apos;];

}

const WCAGComplianceChart: React.FC<WCAGComplianceChartProps> = ({ wcagCompliance }: any) => {
}
  const chartData = {
}
    labels: [&apos;Level A&apos;, &apos;Level AA&apos;, &apos;Level AAA&apos;],
    datasets: [{
}
      label: &apos;WCAG Compliance&apos;,
      data: [
        wcagCompliance.levelA,
        wcagCompliance.levelAA,
        wcagCompliance.levelAAA
      ],
      backgroundColor: [
        wcagCompliance.levelA >= 95 ? &apos;#28a745&apos; : wcagCompliance.levelA >= 80 ? &apos;#ffc107&apos; : &apos;#dc3545&apos;,
        wcagCompliance.levelAA >= 95 ? &apos;#28a745&apos; : wcagCompliance.levelAA >= 80 ? &apos;#ffc107&apos; : &apos;#dc3545&apos;,
        wcagCompliance.levelAAA >= 95 ? &apos;#28a745&apos; : wcagCompliance.levelAAA >= 80 ? &apos;#ffc107&apos; : &apos;#dc3545&apos;
      ],
      borderWidth: 1,
      borderColor: &apos;#fff&apos;
    }]
  };

  const options = {
}
    responsive: true,
    plugins: {
}
      legend: {
}
        display: false

    },
    scales: {
}
      y: {
}
        beginAtZero: true,
        max: 100,
        ticks: {
}
          callback: function(value: any) {
}
            return value + &apos;%&apos;;




  };

  return <Bar data={chartData} options={options} />;
};

const AccessibilityDashboardWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <AccessibilityDashboard {...props} />
  </ErrorBoundary>
);

export default React.memo(AccessibilityDashboardWithErrorBoundary);
