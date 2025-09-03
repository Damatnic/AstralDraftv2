/**
 * Advanced Dashboard View Component - Phase 3
 * Enhanced dashboard with real-time updates, interactive widgets, and improved UX
 */

import React, { useState, useEffect, useMemo } from 'react';

// Mock context for enhanced dashboard
const useAppState = () => ({
  dispatch: (_action: { type: string; payload?: string }) => {
    // Mock dispatch function
  }
});

// Enhanced interfaces for advanced dashboard
interface DashboardViewProps {
  className?: string;
}

interface EnhancedLeagueCardData {
  id: string;
  name: string;
  status: 'DRAFT' | 'IN_SEASON' | 'PLAYOFFS' | 'COMPLETED';
  memberCount: number;
  maxMembers: number;
  myTeam?: {
    name: string;
    record: string;
    rank: number;
    lastScore: number;
  };
  currentWeek?: number;
  nextMatchup?: string;
  lastActivity?: string;
  isCommissioner?: boolean;
  leagueType: 'REDRAFT' | 'DYNASTY' | 'KEEPER';
  scoring: 'STANDARD' | 'PPR' | 'HALF_PPR';
}

interface EnhancedDashboardStats {
  totalLeagues: number;
  activeTeams: number;
  upcomingDrafts: number;
  pendingTrades: number;
  weeklyRank: number;
  weeklyScore: number;
  totalPoints: number;
  winPercentage: number;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: () => void;
  priority: 'high' | 'medium' | 'low';
  badge?: string;
}

interface RecentActivity {
  id: string;
  type: 'TRADE' | 'WAIVER' | 'SCORE' | 'DRAFT' | 'MESSAGE';
  title: string;
  description: string;
  timestamp: string;
  league: string;
  priority: 'high' | 'medium' | 'low';
}

/**
 * Advanced Dashboard View - Next-generation dashboard experience
 */
const AdvancedDashboardView: React.FC<DashboardViewProps> = ({ className = '' }) => {
  const { dispatch } = useAppState();
  const [activeTab, setActiveTab] = useState<'overview' | 'leagues' | 'activity' | 'analytics'>('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [liveUpdates, setLiveUpdates] = useState(true);

  // Enhanced mock data with more realistic information
  const enhancedStats: EnhancedDashboardStats = {
    totalLeagues: 4,
    activeTeams: 3,
    upcomingDrafts: 1,
    pendingTrades: 3,
    weeklyRank: 4,
    weeklyScore: 142.8,
    totalPoints: 1856.3,
    winPercentage: 72.5
  };

  const enhancedLeagues: EnhancedLeagueCardData[] = useMemo(() => [
    {
      id: 'league-1',
      name: 'Championship League 2024',
      status: 'IN_SEASON',
      memberCount: 12,
      maxMembers: 12,
      myTeam: {
        name: 'Dynasty Builders',
        record: '9-4',
        rank: 2,
        lastScore: 156.8
      },
      currentWeek: 14,
      nextMatchup: 'vs Thunder Bolts',
      lastActivity: '2 hours ago',
      isCommissioner: false,
      leagueType: 'REDRAFT',
      scoring: 'PPR'
    },
    {
      id: 'league-2',
      name: 'Dynasty Dynasty Elite',
      status: 'PLAYOFFS',
      memberCount: 10,
      maxMembers: 10,
      myTeam: {
        name: 'Future Champions',
        record: '8-5',
        rank: 4,
        lastScore: 134.2
      },
      currentWeek: 15,
      nextMatchup: 'vs Elite Squad',
      lastActivity: '45 minutes ago',
      isCommissioner: true,
      leagueType: 'DYNASTY',
      scoring: 'HALF_PPR'
    },
    {
      id: 'league-3',
      name: 'Friends & Family League',
      status: 'IN_SEASON',
      memberCount: 8,
      maxMembers: 8,
      myTeam: {
        name: 'The Contenders',
        record: '10-3',
        rank: 1,
        lastScore: 171.5
      },
      currentWeek: 14,
      nextMatchup: 'vs Family Rivals',
      lastActivity: '1 hour ago',
      isCommissioner: false,
      leagueType: 'KEEPER',
      scoring: 'STANDARD'
    },
    {
      id: 'league-4',
      name: 'Startup Draft 2025',
      status: 'DRAFT',
      memberCount: 6,
      maxMembers: 12,
      currentWeek: 0,
      lastActivity: '3 days ago',
      isCommissioner: true,
      leagueType: 'DYNASTY',
      scoring: 'PPR'
    }
  ], []);

  const quickActions: QuickAction[] = useMemo(() => [
    {
      id: 'set-lineup',
      title: 'Set Lineups',
      description: 'Optimize your starting lineup for this week',
      icon: '⚡',
      action: () => dispatch({ type: 'SET_VIEW', payload: 'TEAM_HUB' }),
      priority: 'high',
      badge: '3 teams'
    },
    {
      id: 'check-waivers',
      title: 'Waiver Wire',
      description: 'Browse available players and make claims',
      icon: '🎯',
      action: () => dispatch({ type: 'SET_VIEW', payload: 'WAIVER_WIRE' }),
      priority: 'medium',
      badge: 'New players'
    },
    {
      id: 'review-trades',
      title: 'Trade Center',
      description: 'Review pending trades and explore new deals',
      icon: '🔄',
      action: () => dispatch({ type: 'SET_VIEW', payload: 'TRADES' }),
      priority: 'high',
      badge: '2 pending'
    },
    {
      id: 'draft-prep',
      title: 'Draft Prep',
      description: 'Research players and prepare draft strategy',
      icon: '📊',
      action: () => dispatch({ type: 'SET_VIEW', payload: 'DRAFT_PREP' }),
      priority: 'medium'
    }
  ], [dispatch]);

  const recentActivity: RecentActivity[] = [
    {
      id: 'activity-1',
      type: 'TRADE',
      title: 'Trade Proposal Received',
      description: 'Thunder Bolts wants to trade Travis Kelce for your Davante Adams + 2025 2nd',
      timestamp: '2 hours ago',
      league: 'Championship League 2024',
      priority: 'high'
    },
    {
      id: 'activity-2',
      type: 'SCORE',
      title: 'Weekly Victory!',
      description: 'You won 156.8 - 134.2 against Elite Squad in Dynasty Elite',
      timestamp: '1 day ago',
      league: 'Dynasty Elite',
      priority: 'medium'
    },
    {
      id: 'activity-3',
      type: 'WAIVER',
      title: 'Waiver Claim Successful',
      description: 'You successfully claimed Zach Charbonnet for $15 FAAB',
      timestamp: '2 days ago',
      league: 'Friends & Family League',
      priority: 'low'
    },
    {
      id: 'activity-4',
      type: 'MESSAGE',
      title: 'League Message',
      description: 'Commissioner posted playoff bracket announcement',
      timestamp: '3 days ago',
      league: 'Championship League 2024',
      priority: 'medium'
    }
  ];

  // Simulated real-time updates
  useEffect(() => {
    if (!liveUpdates) return;

    const interval = setInterval(() => {
      // Simulate real-time score updates
      if (Math.random() > 0.8) {
        // Random score update simulation
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [liveUpdates]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const priorityActions = useMemo(() => 
    quickActions.filter(action => action.priority === 'high'), 
    [quickActions]
  );

  const activeLeagues = useMemo(() => 
    enhancedLeagues.filter(league => league.status !== 'COMPLETED'), 
    [enhancedLeagues]
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Enhanced Header with Real-time Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Fantasy Command Center
          </h1>
          <p className="text-gray-400 mt-2">
            Manage all your leagues from one powerful dashboard
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLiveUpdates(!liveUpdates)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              liveUpdates 
                ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                : 'bg-gray-600/50 text-gray-400 border border-gray-600/30'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${liveUpdates ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
            {liveUpdates ? 'Live' : 'Paused'}
          </button>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 hover:bg-gray-600/50 transition-colors flex items-center gap-2"
          >
            <span className={refreshing ? 'animate-spin' : ''}>🔄</span>
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            + Create League
          </button>
        </div>
      </div>

      {/* Enhanced Navigation Tabs */}
      <div className="flex gap-1 bg-gray-800/50 p-1 rounded-lg overflow-x-auto">
        {[
          { key: 'overview', label: 'Overview', count: priorityActions.length },
          { key: 'leagues', label: 'Leagues', count: activeLeagues.length },
          { key: 'activity', label: 'Activity', count: recentActivity.filter(a => a.priority === 'high').length },
          { key: 'analytics', label: 'Analytics', count: 0 }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'overview' | 'leagues' | 'activity' | 'analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Weekly Rank" 
              value={`#${enhancedStats.weeklyRank}`} 
              subtitle="Across all leagues"
              color="blue"
              trend="+2"
            />
            <StatCard 
              title="This Week" 
              value={enhancedStats.weeklyScore.toFixed(1)} 
              subtitle="Total points"
              color="green"
              trend="+12.3"
            />
            <StatCard 
              title="Win Rate" 
              value={`${enhancedStats.winPercentage}%`} 
              subtitle="Season average"
              color="purple"
              trend="+5%"
            />
            <StatCard 
              title="Active Leagues" 
              value={enhancedStats.activeTeams.toString()} 
              subtitle={`${enhancedStats.totalLeagues} total`}
              color="orange"
            />
          </div>

          {/* Priority Actions */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              ⚡ Priority Actions
              {priorityActions.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {priorityActions.length}
                </span>
              )}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {priorityActions.map(action => (
                <QuickActionCard key={action.id} action={action} />
              ))}
            </div>
          </div>

          {/* Recent Activity Preview */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <button 
                onClick={() => setActiveTab('activity')}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                View all →
              </button>
            </div>
            <div className="space-y-3">
              {recentActivity.slice(0, 3).map(activity => (
                <ActivityItem key={activity.id} activity={activity} compact />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'leagues' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enhancedLeagues.map(league => (
              <EnhancedLeagueCard key={league.id} league={league} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="space-y-4">
          {recentActivity.map(activity => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">Performance Analytics</h3>
            <p className="text-gray-400 mb-6">
              Advanced analytics and insights coming soon! Track your performance across all leagues with detailed metrics and trends.
            </p>
            <button 
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'ANALYTICS_HUB' })}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Preview Analytics Hub
            </button>
          </div>
        </div>
      )}

      {/* Create League Modal */}
      {showCreateModal && (
        <CreateLeagueModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};

// Enhanced Components

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, color, trend }) => {
  const colorClasses = {
    blue: 'border-blue-500/30 bg-blue-500/5',
    green: 'border-green-500/30 bg-green-500/5',
    purple: 'border-purple-500/30 bg-purple-500/5',
    orange: 'border-orange-500/30 bg-orange-500/5'
  };

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        {trend && (
          <span className={`text-xs px-2 py-1 rounded ${
            trend.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {trend}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-xs text-gray-500">{subtitle}</div>
    </div>
  );
};

interface QuickActionCardProps {
  action: QuickAction;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ action }) => {
  return (
    <button
      onClick={action.action}
      className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-white/10 hover:border-white/20 transition-all text-left group"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{action.icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold group-hover:text-blue-400 transition-colors">
              {action.title}
            </h4>
            {action.badge && (
              <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded">
                {action.badge}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400">{action.description}</p>
        </div>
      </div>
    </button>
  );
};

interface EnhancedLeagueCardProps {
  league: EnhancedLeagueCardData;
}

const EnhancedLeagueCard: React.FC<EnhancedLeagueCardProps> = ({ league }) => {
  const { dispatch } = useAppState();
  
  const getStatusColor = (status: EnhancedLeagueCardData['status']) => {
    switch (status) {
      case 'DRAFT': return 'border-blue-500/30 bg-blue-500/5';
      case 'IN_SEASON': return 'border-green-500/30 bg-green-500/5';
      case 'PLAYOFFS': return 'border-yellow-500/30 bg-yellow-500/5';
      case 'COMPLETED': return 'border-gray-500/30 bg-gray-500/5';
      default: return 'border-white/10';
    }
  };

  const getStatusText = (status: EnhancedLeagueCardData['status']) => {
    switch (status) {
      case 'DRAFT': return 'Draft in Progress';
      case 'IN_SEASON': return `Week ${league.currentWeek}`;
      case 'PLAYOFFS': return 'Playoffs';
      case 'COMPLETED': return 'Season Complete';
      default: return status;
    }
  };

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border ${getStatusColor(league.status)}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">{league.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>{league.memberCount}/{league.maxMembers} teams</span>
            <span>•</span>
            <span>{league.leagueType}</span>
            <span>•</span>
            <span>{league.scoring}</span>
          </div>
        </div>
        {league.isCommissioner && (
          <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded">
            Commissioner
          </span>
        )}
      </div>

      <div className="mb-4">
        <span className="text-sm font-medium text-gray-400">Status: </span>
        <span className="text-sm font-semibold">{getStatusText(league.status)}</span>
      </div>

      {league.myTeam && (
        <div className="bg-gray-700/30 p-3 rounded-lg mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">{league.myTeam.name}</span>
            <span className="text-sm text-gray-400">#{league.myTeam.rank}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Record: {league.myTeam.record}</span>
            <span className="text-green-400">
              Last: {league.myTeam.lastScore} pts
            </span>
          </div>
          {league.nextMatchup && (
            <div className="text-xs text-gray-500 mt-1">
              Next: {league.nextMatchup}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'TEAM_HUB' })}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors"
        >
          {league.status === 'DRAFT' ? 'Join Draft' : 'Manage Team'}
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'LEAGUE_HUB' })}
          className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 hover:bg-gray-600/50 transition-colors"
        >
          League
        </button>
      </div>
    </div>
  );
};

interface ActivityItemProps {
  activity: RecentActivity;
  compact?: boolean;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, compact = false }) => {
  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'TRADE': return '🔄';
      case 'WAIVER': return '🎯';
      case 'SCORE': return '🏆';
      case 'DRAFT': return '📊';
      case 'MESSAGE': return '💬';
      default: return '📝';
    }
  };

  const getPriorityColor = (priority: RecentActivity['priority']) => {
    switch (priority) {
      case 'high': return 'border-red-500/30 bg-red-500/5';
      case 'medium': return 'border-yellow-500/30 bg-yellow-500/5';
      case 'low': return 'border-gray-500/30 bg-gray-500/5';
      default: return 'border-white/10';
    }
  };

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border ${getPriorityColor(activity.priority)}`}>
      <div className="flex items-start gap-3">
        <span className="text-lg">{getActivityIcon(activity.type)}</span>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold">{activity.title}</h4>
            <span className="text-sm text-gray-400">{activity.timestamp}</span>
          </div>
          {!compact && (
            <p className="text-sm text-gray-400 mb-2">{activity.description}</p>
          )}
          <div className="text-xs text-gray-500">{activity.league}</div>
        </div>
      </div>
    </div>
  );
};

interface CreateLeagueModalProps {
  onClose: () => void;
}

const CreateLeagueModal: React.FC<CreateLeagueModalProps> = ({ onClose }) => {
  const [leagueType, setLeagueType] = useState<'REDRAFT' | 'DYNASTY' | 'KEEPER'>('REDRAFT');
  const [scoring, setScoring] = useState<'STANDARD' | 'PPR' | 'HALF_PPR'>('PPR');
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-white/10 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-6">Create New League</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">League Name</label>
            <input
              type="text"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
              placeholder="Enter league name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">League Type</label>
            <select
              value={leagueType}
              onChange={(e) => setLeagueType(e.target.value as 'REDRAFT' | 'DYNASTY' | 'KEEPER')}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
            >
              <option value="REDRAFT">Redraft</option>
              <option value="DYNASTY">Dynasty</option>
              <option value="KEEPER">Keeper</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Scoring</label>
            <select
              value={scoring}
              onChange={(e) => setScoring(e.target.value as 'STANDARD' | 'PPR' | 'HALF_PPR')}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
            >
              <option value="STANDARD">Standard</option>
              <option value="PPR">PPR</option>
              <option value="HALF_PPR">Half PPR</option>
            </select>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Create League
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedDashboardView;
