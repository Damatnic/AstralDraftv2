/**
 * System Administration Panel - Phase 3
 * Advanced system configuration, user management, and administrative tools
 */

import React, { useState, useMemo } from 'react';

// Mock context for system administration
const useAppState = () => ({
  dispatch: (_action: { type: string; payload?: string }) => {
    // Mock dispatch function
  }
});

// Administration interfaces
interface SystemAdminProps {
  className?: string;
}

interface UserAccount {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'user' | 'guest';
  status: 'active' | 'suspended' | 'pending' | 'archived';
  lastLogin: string;
  loginCount: number;
  permissions: string[];
  createdAt: string;
  subscription: 'free' | 'premium' | 'enterprise';
}

interface SystemConfig {
  id: string;
  category: 'general' | 'security' | 'performance' | 'features' | 'api';
  key: string;
  value: string | number | boolean;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  options?: string[];
  sensitive: boolean;
  requiresRestart: boolean;
}

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  result: 'success' | 'failure' | 'warning';
}

interface SystemMetrics {
  activeUsers: number;
  totalUsers: number;
  apiRequests: number;
  errorRate: number;
  uptime: number;
  diskUsage: number;
  memoryUsage: number;
  cpuUsage: number;
  networkTraffic: number;
  databaseConnections: number;
}

/**
 * System Administration Panel
 */
const SystemAdministrationPanel: React.FC<SystemAdminProps> = ({ className = '' }) => {
  const { dispatch } = useAppState();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'config' | 'logs' | 'backup'>('dashboard');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userFilter, setUserFilter] = useState<'all' | 'active' | 'suspended' | 'pending'>('all');
  const [logFilter, setLogFilter] = useState<'all' | 'success' | 'failure' | 'warning'>('all');
  const [showSensitive, setShowSensitive] = useState(false);

  // Mock system data
  const systemMetrics: SystemMetrics = useMemo(() => ({
    activeUsers: 1247,
    totalUsers: 15834,
    apiRequests: 892456,
    errorRate: 0.02,
    uptime: 99.97,
    diskUsage: 67.3,
    memoryUsage: 73.2,
    cpuUsage: 28.5,
    networkTraffic: 156.7,
    databaseConnections: 89
  }), []);

  const userAccounts: UserAccount[] = useMemo(() => [
    {
      id: 'user1',
      username: 'admin_user',
      email: 'admin@astraldraft.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2025-09-03T15:30:00Z',
      loginCount: 1456,
      permissions: ['all_access', 'user_management', 'system_config', 'data_export'],
      createdAt: '2024-01-15T10:00:00Z',
      subscription: 'enterprise'
    },
    {
      id: 'user2',
      username: 'league_manager',
      email: 'manager@example.com',
      role: 'manager',
      status: 'active',
      lastLogin: '2025-09-03T14:45:00Z',
      loginCount: 892,
      permissions: ['league_management', 'user_view', 'reports'],
      createdAt: '2024-03-22T09:30:00Z',
      subscription: 'premium'
    },
    {
      id: 'user3',
      username: 'power_user',
      email: 'poweruser@example.com',
      role: 'user',
      status: 'active',
      lastLogin: '2025-09-03T15:15:00Z',
      loginCount: 234,
      permissions: ['advanced_analytics', 'trade_analysis', 'custom_reports'],
      createdAt: '2024-06-10T14:20:00Z',
      subscription: 'premium'
    },
    {
      id: 'user4',
      username: 'suspended_user',
      email: 'suspended@example.com',
      role: 'user',
      status: 'suspended',
      lastLogin: '2025-08-25T11:30:00Z',
      loginCount: 67,
      permissions: ['basic_access'],
      createdAt: '2024-08-15T16:45:00Z',
      subscription: 'free'
    },
    {
      id: 'user5',
      username: 'pending_approval',
      email: 'pending@example.com',
      role: 'user',
      status: 'pending',
      lastLogin: '2025-09-01T08:00:00Z',
      loginCount: 3,
      permissions: ['limited_access'],
      createdAt: '2025-09-01T08:00:00Z',
      subscription: 'free'
    }
  ], []);

  const systemConfigs: SystemConfig[] = useMemo(() => [
    {
      id: 'config1',
      category: 'general',
      key: 'app_name',
      value: 'Astral Draft',
      description: 'Application display name',
      type: 'string',
      sensitive: false,
      requiresRestart: false
    },
    {
      id: 'config2',
      category: 'general',
      key: 'max_users_per_league',
      value: 12,
      description: 'Maximum number of users allowed per league',
      type: 'number',
      sensitive: false,
      requiresRestart: false
    },
    {
      id: 'config3',
      category: 'security',
      key: 'session_timeout',
      value: 1440,
      description: 'User session timeout in minutes',
      type: 'number',
      sensitive: false,
      requiresRestart: false
    },
    {
      id: 'config4',
      category: 'security',
      key: 'api_key',
      value: '*********************',
      description: 'NFL API access key',
      type: 'string',
      sensitive: true,
      requiresRestart: true
    },
    {
      id: 'config5',
      category: 'performance',
      key: 'cache_enabled',
      value: true,
      description: 'Enable application caching',
      type: 'boolean',
      sensitive: false,
      requiresRestart: true
    },
    {
      id: 'config6',
      category: 'features',
      key: 'advanced_analytics',
      value: true,
      description: 'Enable advanced analytics features',
      type: 'boolean',
      sensitive: false,
      requiresRestart: false
    },
    {
      id: 'config7',
      category: 'api',
      key: 'rate_limit',
      value: 1000,
      description: 'API rate limit per hour',
      type: 'number',
      sensitive: false,
      requiresRestart: false
    }
  ], []);

  const auditLogs: AuditLog[] = useMemo(() => [
    {
      id: 'log1',
      timestamp: '2025-09-03T15:30:00Z',
      user: 'admin_user',
      action: 'USER_LOGIN',
      resource: 'Authentication',
      details: 'Successful admin login',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      result: 'success'
    },
    {
      id: 'log2',
      timestamp: '2025-09-03T15:25:00Z',
      user: 'league_manager',
      action: 'CONFIG_UPDATE',
      resource: 'System Configuration',
      details: 'Updated max_users_per_league from 10 to 12',
      ipAddress: '192.168.1.150',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      result: 'success'
    },
    {
      id: 'log3',
      timestamp: '2025-09-03T15:20:00Z',
      user: 'suspended_user',
      action: 'LOGIN_ATTEMPT',
      resource: 'Authentication',
      details: 'Failed login attempt - account suspended',
      ipAddress: '10.0.0.45',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      result: 'failure'
    },
    {
      id: 'log4',
      timestamp: '2025-09-03T15:15:00Z',
      user: 'admin_user',
      action: 'USER_SUSPEND',
      resource: 'User Management',
      details: 'Suspended user account: suspended_user',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      result: 'success'
    },
    {
      id: 'log5',
      timestamp: '2025-09-03T15:10:00Z',
      user: 'power_user',
      action: 'DATA_EXPORT',
      resource: 'User Data',
      details: 'Exported league analytics data',
      ipAddress: '172.16.0.89',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      result: 'warning'
    }
  ], []);

  const getRoleColor = (role: UserAccount['role']) => {
    switch (role) {
      case 'admin': return 'text-red-400 bg-red-500/20';
      case 'manager': return 'text-purple-400 bg-purple-500/20';
      case 'user': return 'text-blue-400 bg-blue-500/20';
      case 'guest': return 'text-gray-400 bg-gray-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusColor = (status: UserAccount['status']) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20';
      case 'suspended': return 'text-red-400 bg-red-500/20';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20';
      case 'archived': return 'text-gray-400 bg-gray-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getSubscriptionColor = (subscription: UserAccount['subscription']) => {
    switch (subscription) {
      case 'enterprise': return 'text-purple-400 bg-purple-500/20';
      case 'premium': return 'text-gold-400 bg-yellow-500/20';
      case 'free': return 'text-gray-400 bg-gray-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getLogResultColor = (result: AuditLog['result']) => {
    switch (result) {
      case 'success': return 'text-green-400 bg-green-500/20';
      case 'failure': return 'text-red-400 bg-red-500/20';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getCategoryColor = (category: SystemConfig['category']) => {
    switch (category) {
      case 'general': return 'text-blue-400 bg-blue-500/20';
      case 'security': return 'text-red-400 bg-red-500/20';
      case 'performance': return 'text-green-400 bg-green-500/20';
      case 'features': return 'text-purple-400 bg-purple-500/20';
      case 'api': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const filteredUsers = userAccounts.filter(user => 
    userFilter === 'all' || user.status === userFilter
  );

  const filteredLogs = auditLogs.filter(log => 
    logFilter === 'all' || log.result === logFilter
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
            System Administration
          </h1>
          <p className="text-gray-400 mt-2">
            Advanced system management, user administration, and configuration
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400">System Online</span>
          </div>
          
          <button 
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' })}
            className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 hover:bg-gray-600/50 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* System Health Alert */}
      {systemMetrics.errorRate > 0.05 && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="text-lg font-semibold text-yellow-400">System Alert</h3>
              <p className="text-yellow-300">
                Error rate elevated: {(systemMetrics.errorRate * 100).toFixed(2)}% - monitoring closely
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex gap-1 bg-gray-800/50 p-1 rounded-lg overflow-x-auto">
        {[
          { key: 'dashboard', label: 'Dashboard', icon: '🏠' },
          { key: 'users', label: 'Users', icon: '👥', count: filteredUsers.filter(u => u.status === 'pending').length },
          { key: 'config', label: 'Configuration', icon: '⚙️' },
          { key: 'logs', label: 'Audit Logs', icon: '📋', count: filteredLogs.filter(l => l.result === 'failure').length },
          { key: 'backup', label: 'Backup & Restore', icon: '💾' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'dashboard' | 'users' | 'config' | 'logs' | 'backup')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
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
      {activeTab === 'dashboard' && (
        <AdminDashboardTab 
          systemMetrics={systemMetrics}
          userAccounts={userAccounts}
          auditLogs={auditLogs}
        />
      )}

      {activeTab === 'users' && (
        <UserManagementTab
          users={filteredUsers}
          userFilter={userFilter}
          setUserFilter={setUserFilter}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          getRoleColor={getRoleColor}
          getStatusColor={getStatusColor}
          getSubscriptionColor={getSubscriptionColor}
          dispatch={dispatch}
        />
      )}

      {activeTab === 'config' && (
        <ConfigurationTab
          configs={systemConfigs}
          showSensitive={showSensitive}
          setShowSensitive={setShowSensitive}
          getCategoryColor={getCategoryColor}
          dispatch={dispatch}
        />
      )}

      {activeTab === 'logs' && (
        <AuditLogsTab
          logs={filteredLogs}
          logFilter={logFilter}
          setLogFilter={setLogFilter}
          getLogResultColor={getLogResultColor}
        />
      )}

      {activeTab === 'backup' && (
        <BackupRestoreTab
          dispatch={dispatch}
        />
      )}
    </div>
  );
};

// Tab Components
interface AdminDashboardTabProps {
  systemMetrics: SystemMetrics;
  userAccounts: UserAccount[];
  auditLogs: AuditLog[];
}

const AdminDashboardTab: React.FC<AdminDashboardTabProps> = ({ 
  systemMetrics, 
  userAccounts, 
  auditLogs 
}) => (
  <div className="space-y-6">
    {/* System Metrics Overview */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
        <div className="text-2xl font-bold text-blue-400">{systemMetrics.activeUsers.toLocaleString()}</div>
        <div className="text-sm text-gray-400">Active Users</div>
      </div>
      <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
        <div className="text-2xl font-bold text-green-400">{systemMetrics.uptime}%</div>
        <div className="text-sm text-gray-400">Uptime</div>
      </div>
      <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
        <div className="text-2xl font-bold text-purple-400">{systemMetrics.apiRequests.toLocaleString()}</div>
        <div className="text-sm text-gray-400">API Requests</div>
      </div>
      <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
        <div className={`text-2xl font-bold ${systemMetrics.errorRate < 0.01 ? 'text-green-400' : 'text-yellow-400'}`}>
          {(systemMetrics.errorRate * 100).toFixed(2)}%
        </div>
        <div className="text-sm text-gray-400">Error Rate</div>
      </div>
    </div>

    {/* Resource Usage */}
    <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Resource Usage</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>CPU Usage</span>
              <span>{systemMetrics.cpuUsage}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${systemMetrics.cpuUsage}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Memory Usage</span>
              <span>{systemMetrics.memoryUsage}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${systemMetrics.memoryUsage}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Disk Usage</span>
              <span>{systemMetrics.diskUsage}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full" 
                style={{ width: `${systemMetrics.diskUsage}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>DB Connections</span>
              <span>{systemMetrics.databaseConnections}/100</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full" 
                style={{ width: `${systemMetrics.databaseConnections}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Recent Activity */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">User Status Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Active Users</span>
            <span className="text-green-400">{userAccounts.filter(u => u.status === 'active').length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Pending Approval</span>
            <span className="text-yellow-400">{userAccounts.filter(u => u.status === 'pending').length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Suspended</span>
            <span className="text-red-400">{userAccounts.filter(u => u.status === 'suspended').length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Total Users</span>
            <span>{userAccounts.length}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {auditLogs.slice(0, 4).map(log => (
            <div key={log.id} className="text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">{log.action.replace('_', ' ')}</span>
                <span className="text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="text-gray-400">{log.user}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

interface UserManagementTabProps {
  users: UserAccount[];
  userFilter: 'all' | 'active' | 'suspended' | 'pending';
  setUserFilter: (filter: 'all' | 'active' | 'suspended' | 'pending') => void;
  selectedUser: string | null;
  setSelectedUser: (id: string | null) => void;
  getRoleColor: (role: UserAccount['role']) => string;
  getStatusColor: (status: UserAccount['status']) => string;
  getSubscriptionColor: (subscription: UserAccount['subscription']) => string;
  dispatch: (action: { type: string; payload?: string }) => void;
}

const UserManagementTab: React.FC<UserManagementTabProps> = ({ 
  users, 
  userFilter, 
  setUserFilter, 
  selectedUser, 
  setSelectedUser, 
  getRoleColor, 
  getStatusColor, 
  getSubscriptionColor, 
  dispatch 
}) => (
  <div className="space-y-6">
    {/* User Filters */}
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        {(['all', 'active', 'suspended', 'pending'] as const).map(filter => (
          <button
            key={filter}
            onClick={() => setUserFilter(filter)}
            className={`px-3 py-1 rounded text-sm transition-colors capitalize ${
              userFilter === filter
                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                : 'bg-gray-700/50 text-gray-400 hover:text-gray-300'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
      <button 
        onClick={() => dispatch({ type: 'CREATE_USER' })}
        className="bg-green-500/20 text-green-300 border border-green-500/30 rounded-lg px-4 py-2 hover:bg-green-500/30 transition-colors"
      >
        Add New User
      </button>
    </div>

    {/* User List */}
    <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700/50">
            <tr>
              <th className="text-left p-4">User</th>
              <th className="text-left p-4">Role</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Subscription</th>
              <th className="text-left p-4">Last Login</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t border-gray-700/50 hover:bg-gray-700/30">
                <td className="p-4">
                  <div>
                    <div className="font-medium">{user.username}</div>
                    <div className="text-sm text-gray-400">{user.email}</div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded ${getSubscriptionColor(user.subscription)}`}>
                    {user.subscription}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-400">
                  {new Date(user.lastLogin).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      {selectedUser === user.id ? 'Hide' : 'View'}
                    </button>
                    <button
                      onClick={() => dispatch({ type: 'EDIT_USER', payload: user.id })}
                      className="text-yellow-400 hover:text-yellow-300 text-sm"
                    >
                      Edit
                    </button>
                    {user.status === 'active' && (
                      <button
                        onClick={() => dispatch({ type: 'SUSPEND_USER', payload: user.id })}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Suspend
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* User Details */}
    {selectedUser && (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        {(() => {
          const user = users.find(u => u.id === selectedUser);
          if (!user) return null;
          
          return (
            <div>
              <h3 className="text-lg font-semibold mb-4">User Details: {user.username}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Account Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span>{user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Created:</span>
                      <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Login Count:</span>
                      <span>{user.loginCount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Permissions</h4>
                  <div className="flex flex-wrap gap-1">
                    {user.permissions.map(permission => (
                      <span key={permission} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                        {permission.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    )}
  </div>
);

interface ConfigurationTabProps {
  configs: SystemConfig[];
  showSensitive: boolean;
  setShowSensitive: (show: boolean) => void;
  getCategoryColor: (category: SystemConfig['category']) => string;
  dispatch: (action: { type: string; payload?: string }) => void;
}

const ConfigurationTab: React.FC<ConfigurationTabProps> = ({ 
  configs, 
  showSensitive, 
  setShowSensitive, 
  getCategoryColor, 
  dispatch 
}) => (
  <div className="space-y-6">
    {/* Configuration Controls */}
    <div className="flex items-center justify-between">
      <button
        onClick={() => setShowSensitive(!showSensitive)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
          showSensitive 
            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' 
            : 'bg-gray-600/50 text-gray-400 border border-gray-600/30'
        }`}
      >
        <span>🔒</span>
        {showSensitive ? 'Hide Sensitive' : 'Show Sensitive'}
      </button>
      
      <button 
        onClick={() => dispatch({ type: 'BACKUP_CONFIG' })}
        className="bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg px-4 py-2 hover:bg-blue-500/30 transition-colors"
      >
        Backup Configuration
      </button>
    </div>

    {/* Configuration by Category */}
    {(['general', 'security', 'performance', 'features', 'api'] as const).map(category => {
      const categoryConfigs = configs.filter(config => config.category === category);
      if (categoryConfigs.length === 0) return null;
      
      return (
        <div key={category} className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs px-3 py-1 rounded ${getCategoryColor(category)}`}>
              {category.toUpperCase()}
            </span>
            <h3 className="text-lg font-semibold capitalize">{category} Configuration</h3>
          </div>
          
          <div className="space-y-4">
            {categoryConfigs.map(config => {
              if (config.sensitive && !showSensitive) return null;
              
              return (
                <div key={config.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{config.key}</span>
                      {config.sensitive && (
                        <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">
                          SENSITIVE
                        </span>
                      )}
                      {config.requiresRestart && (
                        <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">
                          RESTART REQUIRED
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">{config.description}</div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-mono text-sm">
                        {config.sensitive && !showSensitive ? '***' : String(config.value)}
                      </div>
                      <div className="text-xs text-gray-400">{config.type}</div>
                    </div>
                    <button
                      onClick={() => dispatch({ type: 'EDIT_CONFIG', payload: config.id })}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    })}
  </div>
);

interface AuditLogsTabProps {
  logs: AuditLog[];
  logFilter: 'all' | 'success' | 'failure' | 'warning';
  setLogFilter: (filter: 'all' | 'success' | 'failure' | 'warning') => void;
  getLogResultColor: (result: AuditLog['result']) => string;
}

const AuditLogsTab: React.FC<AuditLogsTabProps> = ({ 
  logs, 
  logFilter, 
  setLogFilter, 
  getLogResultColor 
}) => (
  <div className="space-y-4">
    {/* Log Filters */}
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        {(['all', 'success', 'failure', 'warning'] as const).map(filter => (
          <button
            key={filter}
            onClick={() => setLogFilter(filter)}
            className={`px-3 py-1 rounded text-sm transition-colors capitalize ${
              logFilter === filter
                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                : 'bg-gray-700/50 text-gray-400 hover:text-gray-300'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
      <button className="bg-gray-700/50 text-gray-400 hover:text-gray-300 px-3 py-1 rounded text-sm">
        Export Logs
      </button>
    </div>

    {/* Audit Logs */}
    <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
      <div className="max-h-96 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            No audit logs found for the selected filter
          </div>
        ) : (
          <div className="divide-y divide-gray-700/50">
            {logs.map(log => (
              <div key={log.id} className="p-4 hover:bg-gray-700/30">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs px-2 py-1 rounded ${getLogResultColor(log.result)}`}>
                        {log.result.toUpperCase()}
                      </span>
                      <span className="font-medium">{log.action.replace('_', ' ')}</span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-400">{log.resource}</span>
                    </div>
                    <div className="text-gray-300 mb-2">{log.details}</div>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>User: {log.user}</span>
                      <span>IP: {log.ipAddress}</span>
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

interface BackupRestoreTabProps {
  dispatch: (action: { type: string; payload?: string }) => void;
}

const BackupRestoreTab: React.FC<BackupRestoreTabProps> = ({ dispatch }) => (
  <div className="space-y-6">
    {/* Backup Management */}
    <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">System Backup</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-3">Create Backup</h4>
          <div className="space-y-3">
            <button
              onClick={() => dispatch({ type: 'CREATE_FULL_BACKUP' })}
              className="w-full bg-green-500/20 text-green-300 border border-green-500/30 rounded-lg p-3 hover:bg-green-500/30 transition-colors"
            >
              💾 Full System Backup
            </button>
            <button
              onClick={() => dispatch({ type: 'CREATE_DATA_BACKUP' })}
              className="w-full bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg p-3 hover:bg-blue-500/30 transition-colors"
            >
              🗃️ Data Only Backup
            </button>
            <button
              onClick={() => dispatch({ type: 'CREATE_CONFIG_BACKUP' })}
              className="w-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-lg p-3 hover:bg-yellow-500/30 transition-colors"
            >
              ⚙️ Configuration Backup
            </button>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-3">Restore Options</h4>
          <div className="space-y-3">
            <button
              onClick={() => dispatch({ type: 'RESTORE_FROM_BACKUP' })}
              className="w-full bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg p-3 hover:bg-purple-500/30 transition-colors"
            >
              🔄 Restore from Backup
            </button>
            <button
              onClick={() => dispatch({ type: 'SCHEDULED_BACKUP' })}
              className="w-full bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded-lg p-3 hover:bg-orange-500/30 transition-colors"
            >
              ⏰ Schedule Automated Backup
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Recent Backups */}
    <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Backups</h3>
      <div className="space-y-3">
        {[
          { id: '1', name: 'Full System Backup', date: '2025-09-03T12:00:00Z', size: '2.4 GB', type: 'Full' },
          { id: '2', name: 'Daily Data Backup', date: '2025-09-03T06:00:00Z', size: '856 MB', type: 'Data' },
          { id: '3', name: 'Configuration Backup', date: '2025-09-02T18:00:00Z', size: '12 KB', type: 'Config' },
          { id: '4', name: 'Weekly Full Backup', date: '2025-09-01T02:00:00Z', size: '2.1 GB', type: 'Full' }
        ].map(backup => (
          <div key={backup.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
            <div>
              <div className="font-medium">{backup.name}</div>
              <div className="text-sm text-gray-400">
                {new Date(backup.date).toLocaleString()} • {backup.size}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2 py-1 rounded ${
                backup.type === 'Full' ? 'bg-green-500/20 text-green-300' :
                backup.type === 'Data' ? 'bg-blue-500/20 text-blue-300' :
                'bg-yellow-500/20 text-yellow-300'
              }`}>
                {backup.type}
              </span>
              <button className="text-blue-400 hover:text-blue-300 text-sm">
                Download
              </button>
              <button className="text-purple-400 hover:text-purple-300 text-sm">
                Restore
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SystemAdministrationPanel;
