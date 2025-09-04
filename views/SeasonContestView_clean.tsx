import React, { useState, useMemo } from 'react';

// Mock context
const useAppContext = () => ({
  state: {
    league: { 
      id: '1', 
      name: 'Fantasy League', 
      teams: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E', 'Team F']
    },
    myTeam: { id: '1', name: 'My Team' }
  },
  dispatch: (_action: { type: string; payload?: string }) => {
    // Mock dispatch function
  }
});

// Simple Widget component
const Widget: React.FC<{ title: string; className?: string; children: React.ReactNode }> = ({ title, className, children }) => (
  <div className={`bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 ${className || ''}`}>
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

// Simple icons
const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

interface Contest {
  id: string;
  name: string;
  type: 'weekly' | 'monthly' | 'season';
  description: string;
  prize: number;
  startDate: string;
  endDate: string;
  participants: number;
  status: 'active' | 'completed' | 'upcoming';
  winner?: string;
}

const SeasonContestView: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { league, myTeam } = state;
  
  const [selectedTab, setSelectedTab] = useState<'active' | 'upcoming' | 'completed'>('active');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newContest, setNewContest] = useState<Partial<Contest>>({
    name: '',
    type: 'weekly',
    description: '',
    prize: 0
  });

  // Mock contest data
  const mockContests: Contest[] = useMemo(() => [
    {
      id: '1',
      name: 'Weekly High Score',
      type: 'weekly',
      description: 'Highest weekly score wins the pot',
      prize: 50,
      startDate: '2024-01-01',
      endDate: '2024-01-07',
      participants: 8,
      status: 'active'
    },
    {
      id: '2',
      name: 'Monthly Champion',
      type: 'monthly',
      description: 'Best record for the month',
      prize: 100,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      participants: 12,
      status: 'active'
    },
    {
      id: '3',
      name: 'Season Long Accuracy',
      type: 'season',
      description: 'Most accurate start/sit decisions',
      prize: 200,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      participants: 10,
      status: 'completed',
      winner: 'Fantasy Expert'
    }
  ], []);

  const filteredContests = mockContests.filter(contest => contest.status === selectedTab);

  const handleCreateContest = () => {
    // Mock contest creation
    setShowCreateModal(false);
    setNewContest({
      name: '',
      type: 'weekly',
      description: '',
      prize: 0
    });
  };

  if (!league || !myTeam) {
    return (
      <div className="glass-panel p-8 text-center">
        <p className="text-gray-400">League data not available</p>
        <button 
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' })}
          className="glass-button-primary mt-4"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Season Contests
          </h1>
          <p className="text-gray-400 mt-2">
            Compete in special challenges for prizes and bragging rights
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="glass-button-primary flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Create Contest
          </button>
          
          <button 
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'LEAGUE_HUB' })}
            className="glass-button"
          >
            Back to League
          </button>
        </div>
      </div>

      {/* Contest Tabs */}
      <div className="flex gap-1 bg-gray-800/50 p-1 rounded-lg">
        {[
          { key: 'active', label: 'Active', count: mockContests.filter(c => c.status === 'active').length },
          { key: 'upcoming', label: 'Upcoming', count: mockContests.filter(c => c.status === 'upcoming').length },
          { key: 'completed', label: 'Completed', count: mockContests.filter(c => c.status === 'completed').length }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key as 'active' | 'upcoming' | 'completed')}
            className={`flex-1 px-4 py-2 rounded-md transition-all ${
              selectedTab === tab.key
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Contests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContests.map(contest => (
          <ContestCard key={contest.id} contest={contest} />
        ))}
      </div>

      {/* Empty State */}
      {filteredContests.length === 0 && (
        <div className="text-center py-12">
          <TrophyIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <h3 className="text-xl font-semibold mb-2">No {selectedTab} contests</h3>
          <p className="text-gray-400 mb-4">
            {selectedTab === 'active' && 'No contests are currently running'}
            {selectedTab === 'upcoming' && 'No contests are scheduled'}
            {selectedTab === 'completed' && 'No contests have been completed yet'}
          </p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="glass-button-primary"
          >
            Create First Contest
          </button>
        </div>
      )}

      {/* Create Contest Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-white/10 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Create New Contest</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Contest Name</label>
                <input
                  type="text"
                  value={newContest.name || ''}
                  onChange={(e) => setNewContest(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
                  placeholder="Enter contest name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={newContest.description || ''}
                  onChange={(e) => setNewContest(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
                  rows={3}
                  placeholder="Describe the contest rules"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Contest Type</label>
                <select
                  value={newContest.type || 'weekly'}
                  onChange={(e) => setNewContest(prev => ({ ...prev, type: e.target.value as Contest['type'] }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="season">Season Long</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Prize Amount ($)</label>
                <input
                  type="number"
                  value={newContest.prize || 0}
                  onChange={(e) => setNewContest(prev => ({ ...prev, prize: Number(e.target.value) }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
                  min="0"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateContest}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Create Contest
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contest Stats */}
      <Widget title="Contest Statistics">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <div className="text-2xl font-bold">{mockContests.length}</div>
            <div className="text-sm text-gray-400">Total Contests</div>
          </div>
          
          <div className="text-center">
            <TrophyIcon className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
            <div className="text-2xl font-bold">
              ${mockContests.reduce((sum, c) => sum + c.prize, 0)}
            </div>
            <div className="text-sm text-gray-400">Total Prizes</div>
          </div>
          
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 bg-green-400 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-xs">AVG</span>
            </div>
            <div className="text-2xl font-bold">
              {Math.round(mockContests.reduce((sum, c) => sum + c.participants, 0) / mockContests.length)}
            </div>
            <div className="text-sm text-gray-400">Avg Participants</div>
          </div>
        </div>
      </Widget>
    </div>
  );
};

interface ContestCardProps {
  contest: Contest;
}

const ContestCard: React.FC<ContestCardProps> = ({ contest }) => {
  const getStatusColor = (status: Contest['status']) => {
    switch (status) {
      case 'active': return 'border-green-500/30 bg-green-500/5';
      case 'upcoming': return 'border-blue-500/30 bg-blue-500/5';
      case 'completed': return 'border-gray-500/30 bg-gray-500/5';
      default: return 'border-white/10';
    }
  };

  const getTypeColor = (type: Contest['type']) => {
    switch (type) {
      case 'weekly': return 'text-blue-300 bg-blue-500/20';
      case 'monthly': return 'text-purple-300 bg-purple-500/20';
      case 'season': return 'text-orange-300 bg-orange-500/20';
      default: return 'text-gray-300 bg-gray-500/20';
    }
  };

  return (
    <div className={`glass-panel p-6 rounded-lg border ${getStatusColor(contest.status)}`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold">{contest.name}</h3>
        <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(contest.type)}`}>
          {contest.type}
        </span>
      </div>
      
      <p className="text-gray-400 text-sm mb-4">{contest.description}</p>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-400">Prize:</span>
          <span className="font-semibold text-green-400">${contest.prize}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Participants:</span>
          <span className="font-semibold">{contest.participants}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Status:</span>
          <span className={`font-semibold capitalize ${
            contest.status === 'active' ? 'text-green-400' :
            contest.status === 'upcoming' ? 'text-blue-400' : 'text-gray-400'
          }`}>
            {contest.status}
          </span>
        </div>
        
        {contest.winner && (
          <div className="flex justify-between">
            <span className="text-gray-400">Winner:</span>
            <span className="font-semibold text-yellow-400">{contest.winner}</span>
          </div>
        )}
      </div>
      
      {contest.status === 'active' && (
        <button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
          Join Contest
        </button>
      )}
    </div>
  );
};

export default SeasonContestView;
