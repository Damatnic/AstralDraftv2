/**
 * Dashboard View Component
 * Clean rewrite focusing on core dashboard functionality
 */

import React, { useState } from 'react';
import { useAppState } from '../contexts/AppContext';

// Simple interfaces for this view
interface DashboardViewProps {
  className?: string;
}

interface LeagueCardData {
  id: string;
  name: string;
  status: string;
  memberCount: number;
  myTeam?: string;
  currentWeek?: number;
}

interface DashboardStats {
  totalLeagues: number;
  activeTeams: number;
  upcomingDrafts: number;
  pendingTrades: number;
}

/**
 * Dashboard View - Main application landing page
 */
const DashboardView: React.FC<DashboardViewProps> = ({ className = '' }) => {
  const { dispatch } = useAppState();
  const [activeTab, setActiveTab] = useState<'overview' | 'leagues' | 'activity'>('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock data for demonstration
  const dashboardStats: DashboardStats = {
    totalLeagues: 3,
    activeTeams: 2,
    upcomingDrafts: 1,
    pendingTrades: 2
  };

  const mockLeagues: LeagueCardData[] = [
    {
      id: 'league-1',
      name: 'Championship League',
      status: 'IN_SEASON',
      memberCount: 12,
      myTeam: 'Dynasty Kings',
      currentWeek: 13
    },
    {
      id: 'league-2',
      name: 'Friends & Family',
      status: 'PLAYOFFS',
      memberCount: 10,
      myTeam: 'Playoff Warriors',
      currentWeek: 15
    },
    {
      id: 'league-3',
      name: 'Work League',
      status: 'DRAFT_COMPLETE',
      memberCount: 8,
      myTeam: 'Office Champions'
    }
  ];

  const handleNavigateToLeague = (leagueId: string) => {
    dispatch({ type: 'SET_ACTIVE_LEAGUE', payload: leagueId });
    dispatch({ type: 'SET_VIEW', payload: 'TEAM_HUB' });
  };

  const handleCreateLeague = () => {
    setShowCreateModal(true);
  };

  const handleNavigateToView = (_view: string) => {
    // Navigate to specified view - placeholder functionality
    dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' });
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{dashboardStats.totalLeagues}</p>
            <p className="text-sm text-gray-600">Total Leagues</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{dashboardStats.activeTeams}</p>
            <p className="text-sm text-gray-600">Active Teams</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{dashboardStats.upcomingDrafts}</p>
            <p className="text-sm text-gray-600">Upcoming Drafts</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{dashboardStats.pendingTrades}</p>
            <p className="text-sm text-gray-600">Pending Trades</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleCreateLeague}
            className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">🏆</div>
              <h4 className="font-medium text-gray-900">Create League</h4>
              <p className="text-sm text-gray-600">Start a new fantasy league</p>
            </div>
          </button>
          
          <button
            onClick={() => handleNavigateToView('MOCK_DRAFT')}
            className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">🎯</div>
              <h4 className="font-medium text-gray-900">Mock Draft</h4>
              <p className="text-sm text-gray-600">Practice your draft strategy</p>
            </div>
          </button>
          
          <button
            onClick={() => handleNavigateToView('PLAYERS')}
            className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">👥</div>
              <h4 className="font-medium text-gray-900">Player Research</h4>
              <p className="text-sm text-gray-600">Analyze player performance</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderLeaguesTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">My Leagues</h3>
        <button
          onClick={handleCreateLeague}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create New League
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockLeagues.map((league) => (
          <div key={league.id} className="bg-white p-6 rounded-lg shadow border">
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900">{league.name}</h4>
              <p className="text-sm text-gray-600">{league.memberCount} members</p>
            </div>
            
            <div className="mb-4">
              <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                league.status === 'IN_SEASON' ? 'bg-green-100 text-green-800' :
                league.status === 'PLAYOFFS' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {league.status.replace('_', ' ')}
              </div>
            </div>
            
            {league.myTeam && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">My Team:</p>
                <p className="font-medium">{league.myTeam}</p>
              </div>
            )}
            
            <button
              onClick={() => handleNavigateToLeague(league.id)}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Team
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderActivityTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
      
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6">
          <div className="space-y-4">
            {[
              { type: 'trade', message: 'Trade proposed in Championship League', time: '2 hours ago' },
              { type: 'waiver', message: 'Waiver claim processed in Friends & Family', time: '4 hours ago' },
              { type: 'lineup', message: 'Lineup set for Week 13 in Work League', time: '1 day ago' },
              { type: 'draft', message: 'Draft completed in Championship League', time: '3 days ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'trade' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'waiver' ? 'bg-green-100 text-green-600' :
                  activity.type === 'lineup' ? 'bg-purple-100 text-purple-600' :
                  'bg-yellow-100 text-yellow-600'
                }`}>
                  {activity.type === 'trade' ? '↔️' :
                   activity.type === 'waiver' ? '📝' :
                   activity.type === 'lineup' ? '⚡' : '🎯'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`dashboard-view p-6 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here&apos;s your fantasy football overview.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview' as const, label: 'Overview' },
                { id: 'leagues' as const, label: 'My Leagues' },
                { id: 'activity' as const, label: 'Recent Activity' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-96">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'leagues' && renderLeaguesTab()}
          {activeTab === 'activity' && renderActivityTab()}
        </div>

        {/* Create League Modal Placeholder */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New League</h3>
              <p className="text-gray-600 mb-6">League creation wizard would appear here.</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    handleNavigateToView('CREATE_LEAGUE');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardView;
