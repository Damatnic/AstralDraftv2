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

const WeeklyReportView: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { league, myTeam } = state;
  
  const [selectedWeek, setSelectedWeek] = useState(13);

  const mockReport = {
    weekNumber: selectedWeek,
    highScore: { team: 'Team A', points: 156.8 },
    lowScore: { team: 'Team D', points: 89.2 },
    upsets: [
      { winner: 'Team E', loser: 'Team B', difference: 12.3 }
    ],
    bestPerformers: [
      { player: 'Josh Allen', team: 'Team A', points: 32.4 },
      { player: 'Christian McCaffrey', team: 'Team C', points: 28.9 }
    ],
    worstPerformers: [
      { player: 'Russell Wilson', team: 'Team D', points: 4.2 }
    ]
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Weekly Report
          </h1>
          <p className="text-gray-400 mt-2">Week {selectedWeek} Recap</p>
        </div>
        
        <div className="flex gap-3">
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(Number(e.target.value))}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
          >
            {Array.from({ length: 17 }, (_, i) => (
              <option key={i + 1} value={i + 1}>Week {i + 1}</option>
            ))}
          </select>
          
          <button 
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' })}
            className="glass-button"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Week Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-green-400">High Score</h3>
          <div className="text-center">
            <div className="text-3xl font-bold">{mockReport.highScore.points}</div>
            <div className="text-gray-400">{mockReport.highScore.team}</div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-red-400">Low Score</h3>
          <div className="text-center">
            <div className="text-3xl font-bold">{mockReport.lowScore.points}</div>
            <div className="text-gray-400">{mockReport.lowScore.team}</div>
          </div>
        </div>
      </div>

      {/* Best Performers */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Best Performers</h3>
        <div className="space-y-3">
          {mockReport.bestPerformers.map((performer, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-green-500/10 rounded-lg">
              <div>
                <div className="font-semibold">{performer.player}</div>
                <div className="text-sm text-gray-400">{performer.team}</div>
              </div>
              <div className="text-xl font-bold text-green-400">
                {performer.points} pts
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Worst Performers */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Worst Performers</h3>
        <div className="space-y-3">
          {mockReport.worstPerformers.map((performer, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-red-500/10 rounded-lg">
              <div>
                <div className="font-semibold">{performer.player}</div>
                <div className="text-sm text-gray-400">{performer.team}</div>
              </div>
              <div className="text-xl font-bold text-red-400">
                {performer.points} pts
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upsets */}
      {mockReport.upsets.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Upsets</h3>
          <div className="space-y-3">
            {mockReport.upsets.map((upset, index) => (
              <div key={index} className="p-3 bg-yellow-500/10 rounded-lg">
                <div className="text-center">
                  <span className="font-semibold text-yellow-400">{upset.winner}</span>
                  <span className="mx-2 text-gray-400">defeated</span>
                  <span className="font-semibold">{upset.loser}</span>
                  <div className="text-sm text-gray-400 mt-1">
                    by {upset.difference} points
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyReportView;
