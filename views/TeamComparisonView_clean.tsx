import React, { useState } from 'react';

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

const TeamComparisonView: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { league, myTeam } = state;
  
  const [selectedTeamA, setSelectedTeamA] = useState('Team A');
  const [selectedTeamB, setSelectedTeamB] = useState('Team B');

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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            Team Comparison
          </h1>
          <p className="text-gray-400 mt-2">{league.name}</p>
        </div>
        
        <button 
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'LEAGUE_STANDINGS' })}
          className="glass-button"
        >
          Back to Standings
        </button>
      </div>

      {/* Team Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Team A</label>
          <select
            value={selectedTeamA}
            onChange={(e) => setSelectedTeamA(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
          >
            {league.teams?.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Team B</label>
          <select
            value={selectedTeamB}
            onChange={(e) => setSelectedTeamB(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
          >
            {league.teams?.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeamCard teamName={selectedTeamA} />
        <TeamCard teamName={selectedTeamB} />
      </div>

      {/* Comparison Stats */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Head-to-Head Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">8-5</div>
            <div className="text-sm text-gray-400">{selectedTeamA} Record</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">VS</div>
            <div className="text-sm text-gray-400">Season Matchup</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">7-6</div>
            <div className="text-sm text-gray-400">{selectedTeamB} Record</div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TeamCardProps {
  teamName: string;
}

const TeamCard: React.FC<TeamCardProps> = ({ teamName }) => {
  const mockStats = {
    pointsFor: 1456.8,
    pointsAgainst: 1234.5,
    record: '8-5',
    averagePoints: 112.1,
    rank: 3
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">{teamName}</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-400">Record:</span>
          <span className="font-semibold">{mockStats.record}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Points For:</span>
          <span className="font-semibold text-green-400">{mockStats.pointsFor}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Points Against:</span>
          <span className="font-semibold text-red-400">{mockStats.pointsAgainst}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Average Points:</span>
          <span className="font-semibold">{mockStats.averagePoints}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">League Rank:</span>
          <span className="font-semibold text-yellow-400">#{mockStats.rank}</span>
        </div>
      </div>
    </div>
  );
};

export default TeamComparisonView;
