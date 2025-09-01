import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useMemo, useState, useEffect, FC, ChangeEvent } from 'react';
import { 
  Shield, AlertTriangle, Users, Activity, Lock, 
  Globe, Ban, Eye, Download, RefreshCw, TrendingUp,
  Server, Zap, Clock, CheckCircle, XCircle 
} from 'lucide-react';

interface SecurityMetrics {
  totalEvents: number;
  criticalEvents: number;
  blockedIPs: number;
  suspiciousActivities: number;
  mfaEnabled: number;
  totalUsers: number;
  uptime: string;
  lastSecurityScan: string;
}

interface SecurityEvent {
  id: string;
  timestamp: string;
  eventType: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  ip: string;
  description: string;
  location?: string;
  resolved: boolean;
}

interface SecurityThreat {
  type: string;
  count: number;
  lastSeen: string;
  severity: string;
}

interface SystemStatus {
  api: 'healthy' | 'degraded' | 'down';
  database: 'healthy' | 'degraded' | 'down';
  authentication: 'healthy' | 'degraded' | 'down';
  monitoring: 'healthy' | 'degraded' | 'down';
  backups: 'healthy' | 'degraded' | 'down';
}

const SecurityDashboard: FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [recentEvents, setRecentEvents] = useState<SecurityEvent[]>([]);
  const [topThreats, setTopThreats] = useState<SecurityThreat[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSecurityData();
    const interval = setInterval(loadSecurityData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [timeRange]);

  const loadSecurityData = async () => {
    try {
      setRefreshing(true);
      
      // Load security metrics
      const metricsResponse = await fetch(`/api/admin/security/metrics?timeRange=${timeRange}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (metricsResponse.ok) {
        setMetrics(await metricsResponse.json());
      }

      // Load recent security events
      const eventsResponse = await fetch(`/api/admin/security/events?limit=20&timeRange=${timeRange}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (eventsResponse.ok) {
        setRecentEvents(await eventsResponse.json());
      }

      // Load top threats
      const threatsResponse = await fetch(`/api/admin/security/threats?timeRange=${timeRange}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (threatsResponse.ok) {
        setTopThreats(await threatsResponse.json());
      }

      // Load system status
      const statusResponse = await fetch('/api/admin/security/status', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (statusResponse.ok) {
        setSystemStatus(await statusResponse.json());
      }
    } catch (error) {
      console.error('Failed to load security data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const blockIP = async (ip: string) => {
    try {
      await fetch('/api/admin/security/block-ip', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ip })
      });
      
      // Refresh data after blocking
      await loadSecurityData();
    } catch (error) {
      console.error('Failed to block IP:', error);
    }
  };

  const generateSecurityReport = async () => {
    try {
      const response = await fetch(`/api/admin/security/report?timeRange=${timeRange}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `security-report-${timeRange}-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to generate security report:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'HIGH': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'LOW': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />;
      case 'degraded': return <AlertTriangle className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />;
      case 'down': return <XCircle className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />;
      default: return <Clock className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 sm:px-4 md:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 sm:px-4 md:px-6 lg:px-8"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 sm:px-4 md:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
          <Shield className="w-8 h-8 text-blue-600 sm:px-4 md:px-6 lg:px-8" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:px-4 md:px-6 lg:px-8">
              Security Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">
              Monitor security events, threats, and system health
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
          <select
            value={timeRange}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setTimeRange(e.target.value)}
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>

          <button
            onClick={loadSecurityData}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 sm:px-4 md:px-6 lg:px-8"
           aria-label="Action button">
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <button
            onClick={generateSecurityReport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 sm:px-4 md:px-6 lg:px-8"
           aria-label="Action button">
            <Download className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
            Generate Report
          </button>
        </div>
      </div>

      {/* System Status */}
      {systemStatus && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:px-4 md:px-6 lg:px-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
            <Server className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
            System Status
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(systemStatus).map(([service, status]) => (
              <div key={service} className="flex items-center gap-3 p-3 border rounded-lg dark:border-gray-700 sm:px-4 md:px-6 lg:px-8">
                <span className={getStatusColor(status)}>
                  {getStatusIcon(status)}
                </span>
                <div>
                  <p className="font-medium capitalize sm:px-4 md:px-6 lg:px-8">{service}</p>
                  <p className={`text-sm capitalize ${getStatusColor(status)}`}>
                    {status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">
                  Total Events
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white sm:px-4 md:px-6 lg:px-8">
                  {metrics.totalEvents.toLocaleString()}
                </p>
              </div>
              <Activity className="w-8 h-8 text-blue-600 sm:px-4 md:px-6 lg:px-8" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">
                  Critical Events
                </p>
                <p className="text-2xl font-bold text-red-600 sm:px-4 md:px-6 lg:px-8">
                  {metrics.criticalEvents}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600 sm:px-4 md:px-6 lg:px-8" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">
                  Blocked IPs
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white sm:px-4 md:px-6 lg:px-8">
                  {metrics.blockedIPs}
                </p>
              </div>
              <Ban className="w-8 h-8 text-orange-600 sm:px-4 md:px-6 lg:px-8" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">
                  MFA Adoption
                </p>
                <p className="text-2xl font-bold text-green-600 sm:px-4 md:px-6 lg:px-8">
                  {Math.round((metrics.mfaEnabled / metrics.totalUsers) * 100)}%
                </p>
                <p className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">
                  {metrics.mfaEnabled}/{metrics.totalUsers} users
                </p>
              </div>
              <Lock className="w-8 h-8 text-green-600 sm:px-4 md:px-6 lg:px-8" />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Security Events */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:px-4 md:px-6 lg:px-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
            <Eye className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
            Recent Security Events
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto sm:px-4 md:px-6 lg:px-8">
            {recentEvents.map((event) => (
              <div key={event.id} className="border-l-4 border-gray-200 dark:border-gray-700 pl-4 py-2 sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-start justify-between sm:px-4 md:px-6 lg:px-8">
                  <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-center gap-2 mb-1 sm:px-4 md:px-6 lg:px-8">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(event.severity)}`}>
                        {event.severity}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">
                        {event.eventType}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white sm:px-4 md:px-6 lg:px-8">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">
                      <span>IP: {event.ip}</span>
                      {event.location && <span>Location: {event.location}</span>}
                      <span>{new Date(event.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                  {!event.resolved && event.severity === 'CRITICAL' && (
                    <button
                      onClick={() => blockIP(event.ip)}
                    >
                      Block IP
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Threats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:px-4 md:px-6 lg:px-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
            <TrendingUp className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
            Top Security Threats
          </h2>
          <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
            {topThreats.map((threat, index) => (
              <div key={threat.type} className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700 sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
                    <span className="text-sm font-bold sm:px-4 md:px-6 lg:px-8">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium sm:px-4 md:px-6 lg:px-8">{threat.type}</p>
                    <p className="text-sm text-gray-500 sm:px-4 md:px-6 lg:px-8">
                      Last seen: {new Date(threat.lastSeen).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right sm:px-4 md:px-6 lg:px-8">
                  <p className="text-2xl font-bold text-red-600 sm:px-4 md:px-6 lg:px-8">{threat.count}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(threat.severity)}`}>
                    {threat.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:px-4 md:px-6 lg:px-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
          <Zap className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <button className="flex items-center gap-2 px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
            <Ban className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
            Emergency Lockdown
          </button>
          <button className="flex items-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
            <Globe className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
            View Blocked IPs
          </button>
          <button className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
            <Users className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
            User Sessions
          </button>
          <button className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
            <Shield className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
            Security Scan
          </button>
          <button className="flex items-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
            <Activity className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
            Audit Logs
          </button>
        </div>
      </div>
    </div>
  );
};

const SecurityDashboardWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <SecurityDashboard {...props} />
  </ErrorBoundary>
);

export default React.memo(SecurityDashboardWithErrorBoundary);