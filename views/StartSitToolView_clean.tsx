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
const TargetIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PlayerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

interface Player {
  id: string;
  name: string;
  position: string;
  team: string;
  projectedPoints: number;
  riskLevel: 'low' | 'medium' | 'high';
  isStarting: boolean;
}

interface StartSitRecommendation {
  player: Player;
  action: 'start' | 'sit';
  confidence: number;
  reasoning: string;
}

const StartSitToolView: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { league, myTeam } = state;
  
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedPosition, setSelectedPosition] = useState<string>('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock roster data
  const mockRoster: Player[] = useMemo(() => [
    {
      id: '1',
      name: 'Josh Allen',
      position: 'QB',
      team: 'BUF',
      projectedPoints: 24.5,
      riskLevel: 'low',
      isStarting: true
    },
    {
      id: '2', 
      name: 'Christian McCaffrey',
      position: 'RB',
      team: 'SF',
      projectedPoints: 22.8,
      riskLevel: 'medium',
      isStarting: true
    },
    {
      id: '3',
      name: 'Davante Adams',
      position: 'WR',
      team: 'LV',
      projectedPoints: 18.2,
      riskLevel: 'low',
      isStarting: true
    },
    {
      id: '4',
      name: 'Travis Kelce',
      position: 'TE',
      team: 'KC',
      projectedPoints: 16.5,
      riskLevel: 'low',
      isStarting: true
    },
    {
      id: '5',
      name: 'Daniel Jones',
      position: 'QB',
      team: 'NYG',
      projectedPoints: 18.2,
      riskLevel: 'high',
      isStarting: false
    },
    {
      id: '6',
      name: 'Saquon Barkley',
      position: 'RB',
      team: 'PHI',
      projectedPoints: 19.5,
      riskLevel: 'medium',
      isStarting: false
    }
  ], []);

  // Mock recommendations
  const mockRecommendations: StartSitRecommendation[] = useMemo(() => [
    {
      player: mockRoster[0],
      action: 'start',
      confidence: 95,
      reasoning: 'Elite matchup against weak pass defense. High floor and ceiling.'
    },
    {
      player: mockRoster[4],
      action: 'sit',
      confidence: 78,
      reasoning: 'Tough matchup and inconsistent recent performance.'
    },
    {
      player: mockRoster[5],
      action: 'start',
      confidence: 85,
      reasoning: 'Great matchup potential and high upside this week.'
    }
  ], [mockRoster]);

  const positions = ['all', 'QB', 'RB', 'WR', 'TE', 'FLEX', 'DST', 'K'];
  
  const filteredPlayers = selectedPosition === 'all' 
    ? mockRoster 
    : mockRoster.filter(p => p.position === selectedPosition);

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsAnalyzing(false);
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Start/Sit Tool
          </h1>
          <p className="text-gray-400 mt-2">
            Get AI-powered recommendations for your lineup decisions
          </p>
        </div>
        
        <button 
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'TEAM_HUB' })}
          className="glass-button"
        >
          Back to Team Hub
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-blue-400" />
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(Number(e.target.value))}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
          >
            {Array.from({ length: 17 }, (_, i) => (
              <option key={i + 1} value={i + 1}>Week {i + 1}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <PlayerIcon className="w-5 h-5 text-green-400" />
          <select
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
          >
            {positions.map(pos => (
              <option key={pos} value={pos}>
                {pos === 'all' ? 'All Positions' : pos}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleRunAnalysis}
          disabled={isAnalyzing}
          className="glass-button-primary flex items-center gap-2"
        >
          <TargetIcon className="w-4 h-4" />
          {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
        </button>
      </div>

      {/* Player List */}
      <Widget title={`Your Roster - Week ${selectedWeek}`}>
        <div className="space-y-3">
          {filteredPlayers.map(player => (
            <PlayerRow 
              key={player.id} 
              player={player}
              recommendation={mockRecommendations.find(r => r.player.id === player.id)}
            />
          ))}
        </div>
      </Widget>

      {/* Recommendations Summary */}
      <Widget title="AI Recommendations">
        <div className="space-y-4">
          {mockRecommendations.map(rec => (
            <RecommendationCard key={rec.player.id} recommendation={rec} />
          ))}
        </div>
      </Widget>

      {/* Analysis Summary */}
      <Widget title="Analysis Summary">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <TargetIcon className="w-8 h-8 mx-auto mb-2 text-orange-400" />
            <div className="text-2xl font-bold">{mockRecommendations.length}</div>
            <div className="text-sm text-gray-400">Recommendations</div>
          </div>
          
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 bg-green-400 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-xs">AVG</span>
            </div>
            <div className="text-2xl font-bold">
              {Math.round(mockRecommendations.reduce((sum, r) => sum + r.confidence, 0) / mockRecommendations.length)}%
            </div>
            <div className="text-sm text-gray-400">Avg Confidence</div>
          </div>
          
          <div className="text-center">
            <PlayerIcon className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <div className="text-2xl font-bold">{filteredPlayers.length}</div>
            <div className="text-sm text-gray-400">Players Analyzed</div>
          </div>
        </div>
      </Widget>
    </div>
  );
};

interface PlayerRowProps {
  player: Player;
  recommendation?: StartSitRecommendation;
}

const PlayerRow: React.FC<PlayerRowProps> = ({ player, recommendation }) => {
  const getRiskColor = (risk: Player['riskLevel']) => {
    switch (risk) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getActionColor = (action?: 'start' | 'sit') => {
    switch (action) {
      case 'start': return 'text-green-400 bg-green-500/20';
      case 'sit': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className={`
      glass-panel p-4 rounded-lg border
      ${player.isStarting ? 'border-green-500/30 bg-green-500/5' : 'border-white/10'}
    `}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <div className="font-semibold">{player.name}</div>
            <div className="text-sm text-gray-400">{player.position} - {player.team}</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold">{player.projectedPoints}</div>
            <div className="text-xs text-gray-400">Projected</div>
          </div>
          
          <div className="text-center">
            <div className={`text-sm font-medium ${getRiskColor(player.riskLevel)}`}>
              {player.riskLevel.toUpperCase()}
            </div>
            <div className="text-xs text-gray-400">Risk</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-2 py-1 rounded text-xs font-medium ${
            player.isStarting ? 'text-green-400 bg-green-500/20' : 'text-gray-400 bg-gray-500/20'
          }`}>
            {player.isStarting ? 'Starting' : 'Bench'}
          </div>
          
          {recommendation && (
            <div className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(recommendation.action)}`}>
              {recommendation.action.toUpperCase()} ({recommendation.confidence}%)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface RecommendationCardProps {
  recommendation: StartSitRecommendation;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const { player, action, confidence, reasoning } = recommendation;
  
  return (
    <div className={`
      glass-panel p-4 rounded-lg border
      ${action === 'start' ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}
    `}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold">{player.name}</h4>
          <p className="text-sm text-gray-400">{player.position} - {player.team}</p>
        </div>
        
        <div className="text-right">
          <div className={`text-lg font-bold ${action === 'start' ? 'text-green-400' : 'text-red-400'}`}>
            {action.toUpperCase()}
          </div>
          <div className="text-sm text-gray-400">{confidence}% confidence</div>
        </div>
      </div>
      
      <p className="text-sm text-gray-300">{reasoning}</p>
    </div>
  );
};

export default StartSitToolView;
