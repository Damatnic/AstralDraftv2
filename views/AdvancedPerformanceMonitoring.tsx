/**
 * Advanced Performance Monitoring Dashboard - Phase 3
 * Real-time monitoring of component performance, user interactions, and system health
 */

import React, { useState, useMemo, useEffect } from 'react';

// Mock context for performance monitoring
const useAppState = () => ({
  dispatch: (_action: { type: string; payload?: string }) => {
    // Mock dispatch function
  }
});

// Performance monitoring interfaces
interface PerformanceMonitoringProps {
  className?: string;
}

interface ComponentMetrics {
  id: string;
  name: string;
  renderTime: number;
  memoryUsage: number;
  renderCount: number;
  errorCount: number;
  userSessions: number;
  avgSessionTime: number;
  interactionEvents: number;
  lastError?: string;
  health: 'excellent' | 'good' | 'warning' | 'critical';
  trend: 'improving' | 'stable' | 'degrading';
}

interface SystemHealth {
  cpu: number;
  memory: number;
  network: number;
  storage: number;
  apiLatency: number;
  errorRate: number;
  uptime: number;
  activeUsers: number;
}

interface PerformanceAlert {
  id: string;
  type: 'performance' | 'error' | 'usage' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  component: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

/**
 * Advanced Performance Monitoring Dashboard
 */
const AdvancedPerformanceMonitoring: React.FC<PerformanceMonitoringProps> = ({ className = '' }) => {
  const { dispatch } = useAppState();
  const [activeTab, setActiveTab] = useState<'overview' | 'components' | 'alerts' | 'analytics'>('overview');
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  // Mock performance data
  const componentMetrics: ComponentMetrics[] = useMemo(() => [
    {
      id: 'advanced-dashboard',
      name: 'Advanced Dashboard',
      renderTime: 234,
      memoryUsage: 12.4,
      renderCount: 1547,
      errorCount: 0,
      userSessions: 234,
      avgSessionTime: 8.5,
      interactionEvents: 3421,
      health: 'excellent',
      trend: 'stable'
    },
    {
      id: 'player-analytics',
      name: 'Player Analytics Hub',
      renderTime: 156,
      memoryUsage: 8.7,
      renderCount: 892,
      errorCount: 2,
      userSessions: 156,
      avgSessionTime: 12.3,
      interactionEvents: 2134,
      lastError: 'Failed to load player image',
      health: 'good',
      trend: 'improving'
    },
    {
      id: 'trade-analysis',
      name: 'Trade Analysis Center',
      renderTime: 312,
      memoryUsage: 15.2,
      renderCount: 445,
      errorCount: 1,
      userSessions: 89,
      avgSessionTime: 15.7,
      interactionEvents: 1876,
      lastError: 'API timeout on trade calculation',
      health: 'good',
      trend: 'stable'
    },
    {
      id: 'team-hub',
      name: 'Enhanced Team Hub',
      renderTime: 198,
      memoryUsage: 9.8,
      renderCount: 1123,
      errorCount: 0,
      userSessions: 198,
      avgSessionTime: 6.9,
      interactionEvents: 2987,
      health: 'excellent',
      trend: 'improving'
    },
    {
      id: 'integration-hub',
      name: 'Integration Hub',
      renderTime: 89,
      memoryUsage: 4.2,
      renderCount: 67,
      errorCount: 0,
      userSessions: 23,
      avgSessionTime: 3.4,
      interactionEvents: 156,
      health: 'excellent',
      trend: 'stable'
    }
  ], []);

  const systemHealth: SystemHealth = useMemo(() => ({
    cpu: 23.4,
    memory: 67.8,
    network: 12.1,
    storage: 45.3,
    apiLatency: 142,
    errorRate: 0.02,
    uptime: 99.97,
    activeUsers: 1847
  }), []);

  const performanceAlerts: PerformanceAlert[] = useMemo(() => [
    {
      id: 'alert1',
      type: 'performance',
      severity: 'medium',
      component: 'Trade Analysis Center',
      message: 'Render time increased by 15% in last hour',
      timestamp: '2025-09-03T14:45:00Z',
      resolved: false
    },
    {
      id: 'alert2',
      type: 'error',
      severity: 'low',
      component: 'Player Analytics Hub',
      message: '2 non-critical errors in image loading',
      timestamp: '2025-09-03T13:30:00Z',
      resolved: false
    },
    {
      id: 'alert3',
      type: 'usage',
      severity: 'low',
      component: 'System',
      message: 'Peak user load detected - all systems stable',
      timestamp: '2025-09-03T12:15:00Z',
      resolved: true
    }
  ], []);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Simulate data refresh
      // In real implementation, this would fetch new metrics
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getHealthColor = (health: ComponentMetrics['health']) => {
    switch (health) {
      case 'excellent': return 'text-green-400 bg-green-500/20';
      case 'good': return 'text-blue-400 bg-blue-500/20';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20';
      case 'critical': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getTrendIcon = (trend: ComponentMetrics['trend']) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'stable': return '➡️';
      case 'degrading': return '📉';
      default: return '➡️';
    }
  };

  const getSeverityColor = (severity: PerformanceAlert['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getSystemHealthColor = (value: number, type: 'percentage' | 'latency' | 'rate') => {
    if (type === 'latency') {
      if (value < 100) return 'text-green-400';
      if (value < 300) return 'text-yellow-400';
      return 'text-red-400';
    }
    if (type === 'rate') {
      if (value < 0.01) return 'text-green-400';
      if (value < 0.05) return 'text-yellow-400';
      return 'text-red-400';
    }
    // percentage
    if (value < 50) return 'text-green-400';
    if (value < 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  const activeAlerts = performanceAlerts.filter(alert => !alert.resolved);
  const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'critical');

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Performance Monitoring
          </h1>
          <p className="text-gray-400 mt-2">
            Real-time monitoring of Phase 3 enhanced components and system health
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              autoRefresh 
                ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                : 'bg-gray-600/50 text-gray-400 border border-gray-600/30'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
            {autoRefresh ? 'Auto-Refresh' : 'Manual'}
          </button>
          
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
            className="bg-gray-800/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          
          <button 
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' })}
            className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 hover:bg-gray-600/50 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚨</span>
            <div>
              <h3 className="text-lg font-semibold text-red-400">Critical Alerts</h3>
              <p className="text-red-300">
                {criticalAlerts.length} critical issue{criticalAlerts.length !== 1 ? 's' : ''} require immediate attention
              </p>
            </div>
          </div>
        </div>
      )}

      {/* System Health Overview */}
      <div className="bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 border border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">System Health Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getSystemHealthColor(systemHealth.cpu, 'percentage')}`}>
              {systemHealth.cpu}%
            </div>
            <div className="text-sm text-gray-400">CPU Usage</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getSystemHealthColor(systemHealth.memory, 'percentage')}`}>
              {systemHealth.memory}%
            </div>
            <div className="text-sm text-gray-400">Memory Usage</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getSystemHealthColor(systemHealth.apiLatency, 'latency')}`}>
              {systemHealth.apiLatency}ms
            </div>
            <div className="text-sm text-gray-400">API Latency</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {systemHealth.uptime}%
            </div>
            <div className="text-sm text-gray-400">Uptime</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 bg-gray-800/50 p-1 rounded-lg overflow-x-auto">
        {[
          { key: 'overview', label: 'Overview', icon: '📊' },
          { key: 'components', label: 'Components', icon: '🧩' },
          { key: 'alerts', label: 'Alerts', icon: '⚠️', count: activeAlerts.length },
          { key: 'analytics', label: 'Analytics', icon: '📈' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'overview' | 'components' | 'alerts' | 'analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
            {tab.count && tab.count > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab 
          componentMetrics={componentMetrics}
          systemHealth={systemHealth}
          getHealthColor={getHealthColor}
          getTrendIcon={getTrendIcon}
        />
      )}

      {activeTab === 'components' && (
        <ComponentsTab
          componentMetrics={componentMetrics}
          showDetails={showDetails}
          setShowDetails={setShowDetails}
          getHealthColor={getHealthColor}
          getTrendIcon={getTrendIcon}
        />
      )}

      {activeTab === 'alerts' && (
        <AlertsTab
          alerts={performanceAlerts}
          getSeverityColor={getSeverityColor}
        />
      )}

      {activeTab === 'analytics' && (
        <AnalyticsTab
          componentMetrics={componentMetrics}
          timeRange={timeRange}
        />
      )}
    </div>
  );
};

// Tab Components
interface OverviewTabProps {
  componentMetrics: ComponentMetrics[];
  systemHealth: SystemHealth;
  getHealthColor: (health: ComponentMetrics['health']) => string;
  getTrendIcon: (trend: ComponentMetrics['trend']) => string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  componentMetrics, 
  systemHealth, 
  getHealthColor, 
  getTrendIcon 
}) => (
  <div className="space-y-6">
    {/* Performance Summary */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Component Health</h3>
        <div className="space-y-3">
          {componentMetrics.slice(0, 3).map(component => (
            <div key={component.id} className="flex items-center justify-between">
              <span className="text-sm">{component.name}</span>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded ${getHealthColor(component.health)}`}>
                  {component.health}
                </span>
                <span className="text-sm">{getTrendIcon(component.trend)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Avg Render Time</span>
            <span className="text-sm">
              {Math.round(componentMetrics.reduce((sum, c) => sum + c.renderTime, 0) / componentMetrics.length)}ms
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Total Sessions</span>
            <span className="text-sm">
              {componentMetrics.reduce((sum, c) => sum + c.userSessions, 0).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Error Rate</span>
            <span className="text-sm text-green-400">
              {((componentMetrics.reduce((sum, c) => sum + c.errorCount, 0) / 
                 componentMetrics.reduce((sum, c) => sum + c.renderCount, 0)) * 100).toFixed(3)}%
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">User Engagement</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Active Users</span>
            <span className="text-sm">{systemHealth.activeUsers.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Avg Session Time</span>
            <span className="text-sm">
              {(componentMetrics.reduce((sum, c) => sum + c.avgSessionTime, 0) / componentMetrics.length).toFixed(1)}min
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Total Interactions</span>
            <span className="text-sm">
              {componentMetrics.reduce((sum, c) => sum + c.interactionEvents, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

interface ComponentsTabProps {
  componentMetrics: ComponentMetrics[];
  showDetails: string | null;
  setShowDetails: (id: string | null) => void;
  getHealthColor: (health: ComponentMetrics['health']) => string;
  getTrendIcon: (trend: ComponentMetrics['trend']) => string;
}

const ComponentsTab: React.FC<ComponentsTabProps> = ({ 
  componentMetrics, 
  showDetails, 
  setShowDetails, 
  getHealthColor, 
  getTrendIcon 
}) => (
  <div className="space-y-4">
    {componentMetrics.map(component => (
      <div key={component.id} className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">{component.name}</h3>
            <span className={`text-xs px-2 py-1 rounded ${getHealthColor(component.health)}`}>
              {component.health}
            </span>
            <span className="text-lg">{getTrendIcon(component.trend)}</span>
          </div>
          <button
            onClick={() => setShowDetails(showDetails === component.id ? null : component.id)}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            {showDetails === component.id ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold">{component.renderTime}ms</div>
            <div className="text-sm text-gray-400">Render Time</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{component.memoryUsage}MB</div>
            <div className="text-sm text-gray-400">Memory Usage</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{component.userSessions}</div>
            <div className="text-sm text-gray-400">Sessions</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-bold ${component.errorCount > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {component.errorCount}
            </div>
            <div className="text-sm text-gray-400">Errors</div>
          </div>
        </div>
        
        {showDetails === component.id && (
          <div className="mt-4 pt-4 border-t border-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Performance Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Render Count:</span>
                    <span>{component.renderCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg Session Time:</span>
                    <span>{component.avgSessionTime}min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Interaction Events:</span>
                    <span>{component.interactionEvents.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              {component.lastError && (
                <div>
                  <h4 className="font-medium mb-2 text-red-400">Last Error</h4>
                  <div className="bg-red-500/10 border border-red-500/30 rounded p-3 text-sm">
                    {component.lastError}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
);

interface AlertsTabProps {
  alerts: PerformanceAlert[];
  getSeverityColor: (severity: PerformanceAlert['severity']) => string;
}

const AlertsTab: React.FC<AlertsTabProps> = ({ alerts, getSeverityColor }) => (
  <div className="space-y-4">
    {alerts.length === 0 ? (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-8 text-center">
        <h3 className="text-xl font-semibold mb-2">No Alerts</h3>
        <p className="text-gray-400">All systems operating normally</p>
      </div>
    ) : (
      alerts.map(alert => (
        <div key={alert.id} className={`bg-gray-800/50 backdrop-blur-sm border rounded-lg p-6 ${
          alert.resolved ? 'border-gray-600' : 'border-white/10'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-xs px-2 py-1 rounded ${getSeverityColor(alert.severity)}`}>
                  {alert.severity.toUpperCase()}
                </span>
                <span className="text-sm text-gray-400">{alert.type}</span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-400">{alert.component}</span>
              </div>
              <p className="text-gray-300 mb-2">{alert.message}</p>
              <div className="text-sm text-gray-400">
                {new Date(alert.timestamp).toLocaleString()}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {alert.resolved && (
                <span className="text-green-400 text-sm">✓ Resolved</span>
              )}
              <button className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
                {alert.resolved ? 'View Details' : 'Resolve'}
              </button>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
);

interface AnalyticsTabProps {
  componentMetrics: ComponentMetrics[];
  timeRange: string;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ componentMetrics, timeRange }) => (
  <div className="space-y-6">
    <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
      <h3 className="text-xl font-semibold mb-4">Performance Analytics</h3>
      <p className="text-gray-400 mb-6">
        Detailed performance analytics for {timeRange} time range with {componentMetrics.length} components monitored.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">
            {componentMetrics.filter(c => c.health === 'excellent').length}
          </div>
          <div className="text-sm text-gray-400">Excellent Health</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">
            {componentMetrics.filter(c => c.trend === 'improving').length}
          </div>
          <div className="text-sm text-gray-400">Improving Trends</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {componentMetrics.reduce((sum, c) => sum + c.errorCount, 0)}
          </div>
          <div className="text-sm text-gray-400">Total Errors</div>
        </div>
      </div>
    </div>
  </div>
);

export default AdvancedPerformanceMonitoring;
