/**
 * Enhanced Player Analysis View Component - Phase 3
 * Advanced player analytics with AI insights, performance trends, and matchup analysis
 */

import React, { useState, useMemo } from 'react';

// Mock context for enhanced player analysis
const useAppState = () => ({
  dispatch: (_action: { type: string; payload?: string }) => {
    // Mock dispatch function
  }
});

// Enhanced interfaces for advanced player analysis
interface EnhancedPlayerAnalysisProps {
  className?: string;
}

interface PlayerAnalytics {
  id: string;
  name: string;
  position: string;
  team: string;
  averagePoints: number;
  projectedPoints: number;
  ceiling: number;
  floor: number;
  consistency: number; // 0-100
  trendScore: number; // -100 to 100
  healthRisk: number; // 0-100
  scheduleRank: number; // 1-32
  targetShare?: number;
  redZoneUsage?: number;
  snapShare?: number;
  aiRating: number; // 0-100
  weeklyScores: number[];
  upcomingMatchups: Array<{
    week: number;
    opponent: string;
    difficulty: 'easy' | 'medium' | 'hard';
    projected: number;
  }>;
  aiInsights: string[];
  comparablePlayers: string[];
}

interface FilterOptions {
  position: string;
  team: string;
  sortBy: 'aiRating' | 'projectedPoints' | 'consistency' | 'trendScore';
  showOnlyOwned: boolean;
  minAiRating: number;
}

/**
 * Enhanced Player Analysis View - Advanced analytics and AI insights
 */
const EnhancedPlayerAnalysisView: React.FC<EnhancedPlayerAnalysisProps> = ({ className = '' }) => {
  const { dispatch } = useAppState();
  const [filters, setFilters] = useState<FilterOptions>({
    position: 'ALL',
    team: 'ALL',
    sortBy: 'aiRating',
    showOnlyOwned: false,
    minAiRating: 0
  });
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerAnalytics | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'detailed'>('grid');

  // Enhanced player analytics data
  const playerAnalytics: PlayerAnalytics[] = useMemo(() => [
    {
      id: 'qb1',
      name: 'Josh Allen',
      position: 'QB',
      team: 'BUF',
      averagePoints: 24.8,
      projectedPoints: 26.2,
      ceiling: 42.0,
      floor: 12.5,
      consistency: 78,
      trendScore: 15,
      healthRisk: 12,
      scheduleRank: 8,
      snapShare: 98,
      aiRating: 94,
      weeklyScores: [28.4, 31.2, 18.6, 25.1, 29.8, 22.3, 33.7, 26.9, 24.1, 28.5, 19.8, 27.2, 30.4],
      upcomingMatchups: [
        { week: 15, opponent: 'DET', difficulty: 'medium', projected: 25.8 },
        { week: 16, opponent: 'NE', difficulty: 'easy', projected: 28.4 },
        { week: 17, opponent: 'NYJ', difficulty: 'easy', projected: 27.2 }
      ],
      aiInsights: [
        'Elite QB1 with consistent 25+ point floor',
        'Strong playoff schedule ahead',
        'Top rushing upside among QBs',
        'Weather concerns in Buffalo late season'
      ],
      comparablePlayers: ['Lamar Jackson', 'Jalen Hurts', 'Patrick Mahomes']
    },
    {
      id: 'rb1',
      name: 'Christian McCaffrey',
      position: 'RB',
      team: 'SF',
      averagePoints: 22.3,
      projectedPoints: 24.1,
      ceiling: 35.8,
      floor: 8.2,
      consistency: 68,
      trendScore: 25,
      healthRisk: 35,
      scheduleRank: 12,
      targetShare: 18.5,
      redZoneUsage: 28,
      snapShare: 85,
      aiRating: 91,
      weeklyScores: [31.8, 28.4, 6.2, 26.7, 22.1, 18.9, 29.3, 24.6, 15.8, 27.2, 21.4, 25.9, 28.1],
      upcomingMatchups: [
        { week: 15, opponent: 'LAR', difficulty: 'medium', projected: 23.6 },
        { week: 16, opponent: 'MIA', difficulty: 'easy', projected: 26.2 },
        { week: 17, opponent: 'DET', difficulty: 'hard', projected: 19.8 }
      ],
      aiInsights: [
        'Elite dual-threat RB when healthy',
        'Injury history creates volatility',
        'Strong target share in PPR formats',
        'Usage concerns in blowouts'
      ],
      comparablePlayers: ['Austin Ekeler', 'Saquon Barkley', 'Dalvin Cook']
    },
    {
      id: 'wr1',
      name: 'Cooper Kupp',
      position: 'WR',
      team: 'LAR',
      averagePoints: 16.8,
      projectedPoints: 18.2,
      ceiling: 28.4,
      floor: 6.1,
      consistency: 71,
      trendScore: -8,
      healthRisk: 22,
      scheduleRank: 18,
      targetShare: 29.2,
      redZoneUsage: 24,
      snapShare: 89,
      aiRating: 86,
      weeklyScores: [19.3, 22.1, 8.4, 18.7, 15.2, 21.6, 14.9, 19.8, 12.3, 20.4, 16.7, 18.1, 17.5],
      upcomingMatchups: [
        { week: 15, opponent: 'SF', difficulty: 'hard', projected: 15.2 },
        { week: 16, opponent: 'NYJ', difficulty: 'medium', projected: 18.8 },
        { week: 17, opponent: 'ARI', difficulty: 'easy', projected: 20.4 }
      ],
      aiInsights: [
        'Target monster in slot coverage',
        'Stafford connection crucial',
        'Playoff schedule gets easier',
        'Age-related decline minimal so far'
      ],
      comparablePlayers: ['Davante Adams', 'Mike Evans', 'Keenan Allen']
    },
    {
      id: 'te1',
      name: 'Travis Kelce',
      position: 'TE',
      team: 'KC',
      averagePoints: 12.4,
      projectedPoints: 13.8,
      ceiling: 22.1,
      floor: 4.2,
      consistency: 58,
      trendScore: -18,
      healthRisk: 8,
      scheduleRank: 14,
      targetShare: 22.1,
      redZoneUsage: 18,
      snapShare: 95,
      aiRating: 78,
      weeklyScores: [11.7, 8.3, 15.2, 9.1, 18.4, 6.8, 12.9, 14.3, 8.7, 16.2, 10.5, 13.8, 9.4],
      upcomingMatchups: [
        { week: 15, opponent: 'CLE', difficulty: 'easy', projected: 14.2 },
        { week: 16, opponent: 'HOU', difficulty: 'medium', projected: 13.1 },
        { week: 17, opponent: 'PIT', difficulty: 'hard', projected: 11.8 }
      ],
      aiInsights: [
        'Age showing in target competition',
        'Still elite red zone weapon',
        'Championship game upside',
        'Consider selling high on name value'
      ],
      comparablePlayers: ['Mark Andrews', 'George Kittle', 'Darren Waller']
    },
    {
      id: 'dst1',
      name: 'Buffalo Defense',
      position: 'DST',
      team: 'BUF',
      averagePoints: 9.2,
      projectedPoints: 10.4,
      ceiling: 18.0,
      floor: -2.0,
      consistency: 64,
      trendScore: 22,
      healthRisk: 5,
      scheduleRank: 6,
      aiRating: 82,
      weeklyScores: [12.0, 8.5, 6.0, 14.0, 9.5, 11.0, 7.5, 13.0, 10.0, 8.0, 12.5, 9.0, 11.5],
      upcomingMatchups: [
        { week: 15, opponent: 'DET', difficulty: 'hard', projected: 7.2 },
        { week: 16, opponent: 'NE', difficulty: 'easy', projected: 12.8 },
        { week: 17, opponent: 'NYJ', difficulty: 'easy', projected: 11.4 }
      ],
      aiInsights: [
        'Elite pass rush creates turnovers',
        'Home field advantage significant',
        'Weather games boost ceiling',
        'Playoff-bound opponent risk'
      ],
      comparablePlayers: ['Philadelphia DST', 'San Francisco DST', 'Dallas DST']
    }
  ], []);

  // Filter and sort players
  const filteredPlayers = useMemo(() => {
    const filtered = playerAnalytics.filter(player => {
      if (filters.position !== 'ALL' && player.position !== filters.position) return false;
      if (filters.team !== 'ALL' && player.team !== filters.team) return false;
      if (player.aiRating < filters.minAiRating) return false;
      if (searchTerm && !player.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });

    return filtered.sort((a, b) => {
      const aValue = a[filters.sortBy];
      const bValue = b[filters.sortBy];
      return typeof aValue === 'number' && typeof bValue === 'number' ? bValue - aValue : 0;
    });
  }, [playerAnalytics, filters, searchTerm]);

  const handlePlayerSelect = (player: PlayerAnalytics) => {
    setSelectedPlayer(player);
  };

  const getGradeColor = (value: number, reverse = false) => {
    if (reverse) value = 100 - value;
    if (value >= 80) return 'text-green-400';
    if (value >= 60) return 'text-yellow-400';
    if (value >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'hard': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
            Player Analytics Hub
          </h1>
          <p className="text-gray-400 mt-2">
            AI-powered player analysis with advanced metrics and matchup insights
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg transition-colors border ${
              showFilters 
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' 
                : 'bg-gray-700/50 text-gray-400 border-gray-600/30'
            }`}
          >
            🔍 Filters
          </button>
          
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'detailed' : 'grid')}
            className="bg-gray-700/50 border border-gray-600/30 rounded-lg px-4 py-2 hover:bg-gray-600/50 transition-colors"
          >
            {viewMode === 'grid' ? '📋 Detailed' : '🔲 Grid'}
          </button>
          
          <button 
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' })}
            className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 hover:bg-gray-600/50 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
            />
          </div>
        </div>

        {showFilters && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Position</label>
                <select
                  value={filters.position}
                  onChange={(e) => setFilters(prev => ({ ...prev, position: e.target.value }))}
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white"
                >
                  <option value="ALL">All Positions</option>
                  <option value="QB">QB</option>
                  <option value="RB">RB</option>
                  <option value="WR">WR</option>
                  <option value="TE">TE</option>
                  <option value="DST">DST</option>
                  <option value="K">K</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as FilterOptions['sortBy'] }))}
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white"
                >
                  <option value="aiRating">AI Rating</option>
                  <option value="projectedPoints">Projected Points</option>
                  <option value="consistency">Consistency</option>
                  <option value="trendScore">Trend Score</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Min AI Rating</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.minAiRating}
                  onChange={(e) => setFilters(prev => ({ ...prev, minAiRating: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <div className="text-xs text-gray-400 mt-1">{filters.minAiRating}+</div>
              </div>
              
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input
                    type="checkbox"
                    checked={filters.showOnlyOwned}
                    onChange={(e) => setFilters(prev => ({ ...prev, showOnlyOwned: e.target.checked }))}
                    className="rounded"
                  />
                  Only Owned
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-green-500/10 border border-white/10 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">
            {filteredPlayers.length} Players Found
          </div>
          <div className="text-sm text-gray-400">
            Sorted by {filters.sortBy.replace(/([A-Z])/g, ' $1').toLowerCase()}
          </div>
        </div>
      </div>

      {/* Player Grid/List */}
      <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {filteredPlayers.map(player => (
          <PlayerAnalyticsCard
            key={player.id}
            player={player}
            viewMode={viewMode}
            onSelect={() => handlePlayerSelect(player)}
            getGradeColor={getGradeColor}
          />
        ))}
      </div>

      {/* Player Detail Modal */}
      {selectedPlayer && (
        <PlayerDetailModal 
          player={selectedPlayer} 
          onClose={() => setSelectedPlayer(null)}
          getGradeColor={getGradeColor}
          getDifficultyColor={getDifficultyColor}
        />
      )}
    </div>
  );
};

// Player Analytics Card Component
interface PlayerAnalyticsCardProps {
  player: PlayerAnalytics;
  viewMode: 'grid' | 'detailed';
  onSelect: () => void;
  getGradeColor: (value: number, reverse?: boolean) => string;
}

const PlayerAnalyticsCard: React.FC<PlayerAnalyticsCardProps> = ({ 
  player, 
  viewMode, 
  onSelect, 
  getGradeColor 
}) => {
  if (viewMode === 'detailed') {
    return (
      <div 
        className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-blue-500/30 transition-all cursor-pointer"
        onClick={onSelect}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold">{player.name}</h3>
            <div className="flex items-center gap-2 text-gray-400">
              <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                {player.position}
              </span>
              <span>{player.team}</span>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getGradeColor(player.aiRating)}`}>
              {player.aiRating}
            </div>
            <div className="text-xs text-gray-400">AI Rating</div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-semibold">{player.projectedPoints}</div>
            <div className="text-xs text-gray-400">Projected</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-semibold ${getGradeColor(player.consistency)}`}>
              {player.consistency}%
            </div>
            <div className="text-xs text-gray-400">Consistency</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-semibold ${
              player.trendScore > 0 ? 'text-green-400' : 
              player.trendScore < 0 ? 'text-red-400' : 'text-gray-400'
            }`}>
              {player.trendScore > 0 ? '+' : ''}{player.trendScore}
            </div>
            <div className="text-xs text-gray-400">Trend</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-semibold ${getGradeColor(player.healthRisk, true)}`}>
              {100 - player.healthRisk}%
            </div>
            <div className="text-xs text-gray-400">Health</div>
          </div>
        </div>

        <div className="text-sm text-gray-300 mb-3">
          <strong>Top Insight:</strong> {player.aiInsights[0]}
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Floor: {player.floor}</span>
          <span className="text-gray-400">Ceiling: {player.ceiling}</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:border-blue-500/30 transition-all cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-bold">{player.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="bg-blue-500/20 text-blue-400 px-1 py-0.5 rounded text-xs">
              {player.position}
            </span>
            <span>{player.team}</span>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-xl font-bold ${getGradeColor(player.aiRating)}`}>
            {player.aiRating}
          </div>
          <div className="text-xs text-gray-400">AI Rating</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-400">Proj:</span> {player.projectedPoints}
        </div>
        <div>
          <span className="text-gray-400">Cons:</span> 
          <span className={getGradeColor(player.consistency)}> {player.consistency}%</span>
        </div>
      </div>
    </div>
  );
};

// Player Detail Modal Component
interface PlayerDetailModalProps {
  player: PlayerAnalytics;
  onClose: () => void;
  getGradeColor: (value: number, reverse?: boolean) => string;
  getDifficultyColor: (difficulty: string) => string;
}

const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({ 
  player, 
  onClose, 
  getGradeColor, 
  getDifficultyColor 
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-white/20 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold">{player.name}</h2>
            <div className="flex items-center gap-2 text-gray-400">
              <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                {player.position}
              </span>
              <span>{player.team}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 p-4 rounded-lg text-center">
              <div className={`text-2xl font-bold ${getGradeColor(player.aiRating)}`}>
                {player.aiRating}
              </div>
              <div className="text-sm text-gray-400">AI Rating</div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold">{player.projectedPoints}</div>
              <div className="text-sm text-gray-400">Projected</div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg text-center">
              <div className={`text-2xl font-bold ${getGradeColor(player.consistency)}`}>
                {player.consistency}%
              </div>
              <div className="text-sm text-gray-400">Consistency</div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg text-center">
              <div className={`text-2xl font-bold ${
                player.trendScore > 0 ? 'text-green-400' : 
                player.trendScore < 0 ? 'text-red-400' : 'text-gray-400'
              }`}>
                {player.trendScore > 0 ? '+' : ''}{player.trendScore}
              </div>
              <div className="text-sm text-gray-400">Trend Score</div>
            </div>
          </div>

          {/* Upcoming Matchups */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Upcoming Matchups</h3>
            <div className="space-y-2">
              {player.upcomingMatchups.map(matchup => (
                <div key={matchup.week} className="bg-gray-800/50 p-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">Week {matchup.week}</span>
                    <span className="font-medium">vs {matchup.opponent}</span>
                    <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(matchup.difficulty)}`}>
                      {matchup.difficulty.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-lg font-semibold">{matchup.projected}</div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div>
            <h3 className="text-lg font-semibold mb-3">AI Insights</h3>
            <div className="space-y-2">
              {player.aiInsights.map((insight, index) => (
                <div key={index} className="bg-gray-800/50 p-3 rounded-lg flex items-start gap-3">
                  <span className="text-blue-400 text-sm">💡</span>
                  <span className="text-gray-300">{insight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Comparable Players */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Similar Players</h3>
            <div className="flex gap-2 flex-wrap">
              {player.comparablePlayers.map(comp => (
                <span key={comp} className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-lg text-sm">
                  {comp}
                </span>
              ))}
            </div>
          </div>

          {/* Advanced Stats */}
          {(player.targetShare || player.redZoneUsage || player.snapShare) && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Advanced Stats</h3>
              <div className="grid grid-cols-3 gap-4">
                {player.targetShare && (
                  <div className="bg-gray-800/50 p-3 rounded-lg text-center">
                    <div className="text-lg font-bold">{player.targetShare}%</div>
                    <div className="text-sm text-gray-400">Target Share</div>
                  </div>
                )}
                {player.redZoneUsage && (
                  <div className="bg-gray-800/50 p-3 rounded-lg text-center">
                    <div className="text-lg font-bold">{player.redZoneUsage}%</div>
                    <div className="text-sm text-gray-400">Red Zone Usage</div>
                  </div>
                )}
                {player.snapShare && (
                  <div className="bg-gray-800/50 p-3 rounded-lg text-center">
                    <div className="text-lg font-bold">{player.snapShare}%</div>
                    <div className="text-sm text-gray-400">Snap Share</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedPlayerAnalysisView;
