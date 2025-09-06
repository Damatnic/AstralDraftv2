/**
 * Admin Dashboard Component
 * Main dashboard interface for platform administration
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useState, useEffect } from 'react';
import {
  adminService,
  AdminDashboardData,
  UserSummary,
  ContestSummary,
  type OracleMetrics
} from '../../services/adminService';

// Dashboard overview component
const DashboardOverview: React.FC<{
  data: AdminDashboardData['overview'] 
}> = ({ data }: any) => {
  // const [isLoading, setIsLoading] = React.useState(false); // TODO: Implement loading state
  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return '✅';
      case 'warning': return '⚠️';
      case 'critical': return '🚨';
      default: return '❓';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Users */}
      <div className="bg-white p-6 rounded-lg shadow-md border sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
          <div>
            <p className="text-sm font-medium text-gray-600 sm:px-4 md:px-6 lg:px-8">Total Users</p>
            <p className="text-2xl font-bold text-gray-900 sm:px-4 md:px-6 lg:px-8">{data.totalUsers.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full sm:px-4 md:px-6 lg:px-8">
            <span className="text-2xl sm:px-4 md:px-6 lg:px-8">👥</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2 sm:px-4 md:px-6 lg:px-8">{data.activeUsers} active users</p>
      </div>

      {/* Total Contests */}
      <div className="bg-white p-6 rounded-lg shadow-md border sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
          <div>
            <p className="text-sm font-medium text-gray-600 sm:px-4 md:px-6 lg:px-8">Total Contests</p>
            <p className="text-2xl font-bold text-gray-900 sm:px-4 md:px-6 lg:px-8">{data.totalContests.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-green-100 rounded-full sm:px-4 md:px-6 lg:px-8">
            <span className="text-2xl sm:px-4 md:px-6 lg:px-8">🏆</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2 sm:px-4 md:px-6 lg:px-8">{data.activeContests} active contests</p>
      </div>

      {/* Total Revenue */}
      <div className="bg-white p-6 rounded-lg shadow-md border sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
          <div>
            <p className="text-sm font-medium text-gray-600 sm:px-4 md:px-6 lg:px-8">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900 sm:px-4 md:px-6 lg:px-8">${data.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-purple-100 rounded-full sm:px-4 md:px-6 lg:px-8">
            <span className="text-2xl sm:px-4 md:px-6 lg:px-8">💰</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2 sm:px-4 md:px-6 lg:px-8">${data.todayRevenue} today</p>
      </div>

      {/* System Health */}
      <div className="bg-white p-6 rounded-lg shadow-md border sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
          <div>
            <p className="text-sm font-medium text-gray-600 sm:px-4 md:px-6 lg:px-8">System Health</p>
            <p className={`text-2xl font-bold ${getHealthColor(data.systemHealth)}`}>
              {data.systemHealth.toUpperCase()}
            </p>
          </div>
          <div className="p-3 bg-orange-100 rounded-full sm:px-4 md:px-6 lg:px-8">
            <span className="text-2xl sm:px-4 md:px-6 lg:px-8">{getHealthIcon(data.systemHealth)}</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2 sm:px-4 md:px-6 lg:px-8">{data.pendingIssues} pending issues</p>
      </div>
    </div>
  );
};

// User management component
const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    riskLevel: '',
    searchTerm: ''
  });

  const loadUsers = React.useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminService.getAllUsers(1, 50, filters);
      setUsers(result.users);
      setTotalUsers(result.total);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleStatusChange = async (userId: string, status: string) => {
    const reason = prompt(`Reason for changing status to ${status}:`);
    if (reason) {
      await adminService.updateUserStatus('admin_001', userId, status, reason);
      loadUsers();
    }
  };

  React.useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      case 'banned': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-red-100 text-red-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">User Management</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">Loading...</td>
              </tr>
            ) : (
              <>
                {users.map((user: any) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.username}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(user?.status)}`}>
                        {user?.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap sm:px-4 md:px-6 lg:px-8">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskBadgeColor(user.riskScore)}`}>
                      {user.riskScore}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 sm:px-4 md:px-6 lg:px-8">
                    <div>{user.totalContests} contests</div>
                    <div>${user.totalSpent} spent</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 sm:px-4 md:px-6 lg:px-8">
                    ${user.accountBalance}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium sm:px-4 md:px-6 lg:px-8">
                    <div className="flex space-x-2 sm:px-4 md:px-6 lg:px-8">
                      <button
                        onClick={() => handleStatusChange(user.id, user?.status === 'active' ? 'suspended' : 'active')}
                        className={`px-3 py-1 rounded text-xs ${
                          user?.status === 'active' 
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {user?.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleStatusChange(user.id, 'banned')}
                        className="px-3 py-1 rounded text-xs bg-red-100 text-red-800 hover:bg-red-200 sm:px-4 md:px-6 lg:px-8"
                      >
                        Ban
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </>
          )}
        </tbody>
        </table>
      </div>
    </div>
  );
};

// Contest management component
const ContestManagement: React.FC = () => {
  const [contests, setContests] = useState<ContestSummary[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadContests();
  }, []);

  const loadContests = async () => {
    setLoading(true);
    try {
      const result = await adminService.getAllContests(1, 50);
      setContests(result.contests);
    } catch (error) {
      console.error('Operation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelContest = async (contestId: string) => {
    try {
      const reason = prompt('Reason for cancelling contest:');
      if (reason) {
        await adminService.cancelContest('admin_001', contestId, reason);
        loadContests();
      }
    } catch (error) {
      console.error('Failed to cancel contest:', error);
    }
  };

  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">Contest Management</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contest</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prize Pool</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">Loading...</td>
              </tr>
            ) : (
              <>
                {contests.map((contest: any) => (
                  <tr key={contest.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{contest.name}</div>
                      <div className="text-sm text-gray-500">{contest.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(contest?.status)}`}>
                      {contest?.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 sm:px-4 md:px-6 lg:px-8">
                    {contest.participantCount} / {contest.maxParticipants}
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1 sm:px-4 md:px-6 lg:px-8">
                      <div 
                        className="bg-blue-600 h-2 rounded-full sm:px-4 md:px-6 lg:px-8" 
                        style={{ width: `${(contest.participantCount / contest.maxParticipants) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 sm:px-4 md:px-6 lg:px-8">
                    ${contest.prizePool.toLocaleString()}
                    <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">${contest.entryFee} entry</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 sm:px-4 md:px-6 lg:px-8">
                    <div>Start: {new Date(contest.startDate).toLocaleDateString()}</div>
                    <div>End: {new Date(contest.endDate).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium sm:px-4 md:px-6 lg:px-8">
                    <div className="flex space-x-2 sm:px-4 md:px-6 lg:px-8">
                      <button className="text-blue-600 hover:text-blue-900 sm:px-4 md:px-6 lg:px-8">
                        View
                      </button>
                      {contest?.status === 'active' && (
                        <button
                          onClick={() => handleCancelContest(contest.id)}
                          className="text-red-600 hover:text-red-900 sm:px-4 md:px-6 lg:px-8"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </>
          )}
        </tbody>
        </table>
      </div>
    </div>
  );
};

// Oracle metrics component
const OracleMetricsPanel: React.FC = () => {
  const [metrics, setMetrics] = useState<OracleMetrics | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const data = await adminService.getOracleMetrics();
      setMetrics(data);
    } catch (error) {
      console.error('Operation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="bg-white rounded-lg shadow-md p-6 sm:px-4 md:px-6 lg:px-8">Loading Oracle metrics...</div>;
  }

  if (!metrics) {
    return <div className="bg-white rounded-lg shadow-md p-6 sm:px-4 md:px-6 lg:px-8">Failed to load Oracle metrics</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md sm:px-4 md:px-6 lg:px-8">
      <div className="px-6 py-4 border-b border-gray-200 sm:px-4 md:px-6 lg:px-8">
        <h3 className="text-lg font-medium text-gray-900 sm:px-4 md:px-6 lg:px-8">Oracle Performance</h3>
      </div>
      
      <div className="p-6 sm:px-4 md:px-6 lg:px-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center sm:px-4 md:px-6 lg:px-8">
            <div className="text-3xl font-bold text-blue-600 sm:px-4 md:px-6 lg:px-8">{metrics.totalPredictions}</div>
            <div className="text-sm text-gray-500 sm:px-4 md:px-6 lg:px-8">Total Predictions</div>
          </div>
          <div className="text-center sm:px-4 md:px-6 lg:px-8">
            <div className="text-3xl font-bold text-green-600 sm:px-4 md:px-6 lg:px-8">
              {(metrics.accuracyRate * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500 sm:px-4 md:px-6 lg:px-8">Accuracy Rate</div>
          </div>
          <div className="text-center sm:px-4 md:px-6 lg:px-8">
            <div className="text-3xl font-bold text-purple-600 sm:px-4 md:px-6 lg:px-8">
              {(metrics.averageConfidence * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500 sm:px-4 md:px-6 lg:px-8">Avg Confidence</div>
          </div>
        </div>

        {/* Performance by Category */}
        <div className="mb-6 sm:px-4 md:px-6 lg:px-8">
          <h4 className="text-md font-medium text-gray-900 mb-4 sm:px-4 md:px-6 lg:px-8">Performance by Category</h4>
          <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
            {Object.entries(metrics.performanceByCategory).map(([category, stats]) => (
              <div key={category} className="border rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-2 sm:px-4 md:px-6 lg:px-8">
                  <span className="font-medium text-gray-900 sm:px-4 md:px-6 lg:px-8">{category}</span>
                  <span className="text-sm text-gray-500 sm:px-4 md:px-6 lg:px-8">{stats.predictions} predictions</span>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:px-4 md:px-6 lg:px-8">
                  <div>
                    <div className="text-sm text-gray-500 sm:px-4 md:px-6 lg:px-8">Accuracy</div>
                    <div className="text-lg font-semibold text-green-600 sm:px-4 md:px-6 lg:px-8">
                      {(stats.accuracy * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 sm:px-4 md:px-6 lg:px-8">Confidence</div>
                    <div className="text-lg font-semibold text-purple-600 sm:px-4 md:px-6 lg:px-8">
                      {(stats.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Engagement */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4 sm:px-4 md:px-6 lg:px-8">User Engagement</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg sm:px-4 md:px-6 lg:px-8">
              <div className="text-2xl font-bold text-gray-900 sm:px-4 md:px-6 lg:px-8">{metrics.userEngagement.followingOracle}</div>
              <div className="text-sm text-gray-500 sm:px-4 md:px-6 lg:px-8">Following Oracle</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg sm:px-4 md:px-6 lg:px-8">
              <div className="text-2xl font-bold text-gray-900 sm:px-4 md:px-6 lg:px-8">
                {(metrics.userEngagement.averageAgreementRate * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500 sm:px-4 md:px-6 lg:px-8">Agreement Rate</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg sm:px-4 md:px-6 lg:px-8">
              <div className="text-2xl font-bold text-gray-900 sm:px-4 md:px-6 lg:px-8">
                {(metrics.userEngagement.oracleBeatRate * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500 sm:px-4 md:px-6 lg:px-8">Oracle Beat Rate</div>
            </div>
          </div>
        </div>

        {/* Oracle Controls */}
        <div className="mt-6 pt-6 border-t border-gray-200 sm:px-4 md:px-6 lg:px-8">
          <div className="flex space-x-4 sm:px-4 md:px-6 lg:px-8">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-4 md:px-6 lg:px-8">
              Update Configuration
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 sm:px-4 md:px-6 lg:px-8">
              Trigger Retrain
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 sm:px-4 md:px-6 lg:px-8">
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main admin dashboard component
const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'contests' | 'payments' | 'oracle' | 'system'>('overview');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await adminService.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && dashboardData && (
          <div>
            <DashboardOverview data={dashboardData.overview} />
            
            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Users */}
              <div className="bg-white rounded-lg shadow-md sm:px-4 md:px-6 lg:px-8">
                <div className="px-6 py-4 border-b border-gray-200 sm:px-4 md:px-6 lg:px-8">
                  <h3 className="text-lg font-medium text-gray-900 sm:px-4 md:px-6 lg:px-8">Recent Users</h3>
                </div>
                <div className="p-6 sm:px-4 md:px-6 lg:px-8">
                  <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                    {dashboardData.recentActivity.newUsers.slice(0, 5).map((user: any) => (
                      <div key={user.id} className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                        <div>
                          <div className="font-medium text-gray-900 sm:px-4 md:px-6 lg:px-8">{user.username}</div>
                          <div className="text-sm text-gray-500 sm:px-4 md:px-6 lg:px-8">{user.email}</div>
                        </div>
                        <div className="text-sm text-gray-500 sm:px-4 md:px-6 lg:px-8">
                          {new Date(user.joinDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* System Alerts */}
              <div className="bg-white rounded-lg shadow-md sm:px-4 md:px-6 lg:px-8">
                <div className="px-6 py-4 border-b border-gray-200 sm:px-4 md:px-6 lg:px-8">
                  <h3 className="text-lg font-medium text-gray-900 sm:px-4 md:px-6 lg:px-8">System Alerts</h3>
                </div>
                <div className="p-6 sm:px-4 md:px-6 lg:px-8">
                  {dashboardData.recentActivity.systemAlerts.length === 0 ? (
                    <div className="text-center text-gray-500 py-8 sm:px-4 md:px-6 lg:px-8">
                      <span className="text-4xl sm:px-4 md:px-6 lg:px-8">✅</span>
                      <div className="mt-2 sm:px-4 md:px-6 lg:px-8">No system alerts</div>
                      <div className="text-sm sm:px-4 md:px-6 lg:px-8">All systems are running normally</div>
                    </div>
                  ) : (
                    <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                      {dashboardData.recentActivity.systemAlerts.map((alert: any) => (
                        <div key={alert.id} className="border-l-4 border-red-400 bg-red-50 p-4 sm:px-4 md:px-6 lg:px-8">
                          <div className="flex sm:px-4 md:px-6 lg:px-8">
                            <div className="flex-shrink-0 sm:px-4 md:px-6 lg:px-8">
                              <span className="text-red-400 sm:px-4 md:px-6 lg:px-8">⚠️</span>
                            </div>
                            <div className="ml-3 sm:px-4 md:px-6 lg:px-8">
                              <p className="text-sm text-red-700 sm:px-4 md:px-6 lg:px-8">{alert.message}</p>
                              <p className="text-xs text-red-500 mt-1 sm:px-4 md:px-6 lg:px-8">
                                {new Date(alert.lastOccurrence).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'contests' && <ContestManagement />}
        {activeTab === 'oracle' && <OracleMetricsPanel />}
        
        {activeTab === 'payments' && (
          <div className="bg-white rounded-lg shadow-md p-6 sm:px-4 md:px-6 lg:px-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4 sm:px-4 md:px-6 lg:px-8">Payment Management</h3>
            <p className="text-gray-500 sm:px-4 md:px-6 lg:px-8">Payment management interface coming soon...</p>
          </div>
        )}
        
        {activeTab === 'system' && (
          <div className="bg-white rounded-lg shadow-md p-6 sm:px-4 md:px-6 lg:px-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4 sm:px-4 md:px-6 lg:px-8">System Management</h3>
            <p className="text-gray-500 sm:px-4 md:px-6 lg:px-8">System management interface coming soon...</p>
          </div>
        )}
      </div>
    </>
  );
};

const AdminDashboardWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <AdminDashboard {...props} />
  </ErrorBoundary>
);

export default React.memo(AdminDashboardWithErrorBoundary);
