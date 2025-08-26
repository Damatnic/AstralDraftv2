/**
 * Player Search Component
 * Search and filter NFL players for roster management
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../../contexts/AppContext';
import { searchPlayers, getPlayersByPosition, NFL_TEAMS } from '../../data/nflPlayers';
import { Player } from '../../types';

interface PlayerSearchProps {
  onPlayerSelect?: (player: Player) => void;
  showAddButton?: boolean;
  filterPosition?: string;
  excludePlayerIds?: number[];
}

const PlayerSearch: React.FC<PlayerSearchProps> = ({
  onPlayerSelect,
  showAddButton = false,
  filterPosition,
  excludePlayerIds = []
}) => {
  const { state, dispatch } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPosition, setSelectedPosition] = useState(filterPosition || 'ALL');
  const [sortBy, setSortBy] = useState<'rank' | 'name' | 'team'>('rank');

  const league = state.leagues[0];
  const availablePlayers = league?.allPlayers || [];

  // Filter and search players
  const filteredPlayers = useMemo(() => {
    let players = availablePlayers.filter(player => 
      !excludePlayerIds.includes(player.id)
    );

    // Apply position filter
    if (selectedPosition !== 'ALL') {
      players = players.filter(player => player.position === selectedPosition);
    }

    // Apply search query
    if (searchQuery.trim()) {
      players = searchPlayers(searchQuery).filter(player => 
        !excludePlayerIds.includes(player.id)
      );
    }

    // Sort players
    players.sort((a, b) => {
      switch (sortBy) {
        case 'rank':
          return a.fantasyRank - b.fantasyRank;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'team':
          return a.team.localeCompare(b.team);
        default:
          return a.fantasyRank - b.fantasyRank;
      }
    });

    return players.slice(0, 50); // Limit to 50 results for performance
  }, [availablePlayers, searchQuery, selectedPosition, sortBy, excludePlayerIds]);

  const positions = ['ALL', 'QB', 'RB', 'WR', 'TE', 'K', 'DST'];

  const handlePlayerClick = (player: Player) => {
    if (onPlayerSelect) {
      onPlayerSelect(player);
    } else {
      dispatch({ type: 'SET_PLAYER_DETAIL', payload: { player } });
    }
  };

  const getInjuryStatusColor = (status: string) => {
    switch (status) {
      case 'HEALTHY': return 'text-green-400';
      case 'QUESTIONABLE': return 'text-yellow-400';
      case 'DOUBTFUL': return 'text-orange-400';
      case 'OUT': return 'text-red-400';
      case 'IR': return 'text-red-600';
      default: return 'text-gray-400';
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'QB': return 'bg-red-600';
      case 'RB': return 'bg-green-600';
      case 'WR': return 'bg-blue-600';
      case 'TE': return 'bg-yellow-600';
      case 'K': return 'bg-purple-600';
      case 'DST': return 'bg-gray-600';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="search-container">
      {/* Search Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-4">Player Search</h3>
        
        {/* Search Input */}
        <div className="input-group mb-4">
          <input
            type="text"
            placeholder="Search players by name, team, or position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Filters */}
        <div className="search-row">
          {/* Position Filter */}
          <div className="input-group">
            <label>Position</label>
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="filter-select"
            >
              {positions.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="input-group">
            <label>Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'rank' | 'name' | 'team')}
              className="filter-select"
            >
              <option value="rank">Fantasy Rank</option>
              <option value="name">Name</option>
              <option value="team">Team</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {filteredPlayers.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.02 }}
              onClick={() => handlePlayerClick(player)}
              className={`player-card ${player.position.toLowerCase()} cursor-pointer group`}
            >
              <div className="player-header">
                <div className="player-info">
                  <div className="position-badge">{player.position}</div>
                  <h3 className="player-name group-hover:text-blue-400 transition-colors">
                    {player.name}
                  </h3>
                  <p className="player-team">
                    {NFL_TEAMS[player.team as keyof typeof NFL_TEAMS]?.name || player.team} • #{player.jerseyNumber}
                    {player.age > 0 && ` • ${player.age}y`}
                  </p>
                </div>
                {showAddButton && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayerSelect?.(player);
                    }}
                    className="add-btn"
                  >
                    Add
                  </button>
                )}
              </div>

              <div className="player-stats">
                <div className="stat-item">
                  <span className="stat-label">Rank</span>
                  <span className="stat-value">#{player.fantasyRank}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Projection</span>
                  <span className="stat-value">{player.projectedPoints.toFixed(1)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Status</span>
                  <span className={`stat-value ${getInjuryStatusColor(player.injuryStatus)}`}>
                    {player.injuryStatus}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredPlayers.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            {searchQuery ? 'No players found matching your search.' : 'No players available.'}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mt-4 text-sm text-slate-400 text-center">
        Showing {filteredPlayers.length} of {availablePlayers.length} players
      </div>
    </div>
  );
};

export default PlayerSearch;