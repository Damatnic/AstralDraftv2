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
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      {/* Search Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-4">Player Search</h3>
        
        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search players by name, team, or position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          {/* Position Filter */}
          <div>
            <label className="block text-sm text-slate-400 mb-1">Position</label>
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="p-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-400"
            >
              {positions.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm text-slate-400 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'rank' | 'name' | 'team')}
              className="p-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-400"
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
              className="flex items-center justify-between p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-4">
                {/* Position Badge */}
                <div className={`${getPositionColor(player.position)} text-white text-xs font-bold px-2 py-1 rounded`}>
                  {player.position}
                </div>

                {/* Player Info */}
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                      {player.name}
                    </h4>
                    <span className={`text-xs ${getInjuryStatusColor(player.injuryStatus)}`}>
                      ●
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span>{NFL_TEAMS[player.team as keyof typeof NFL_TEAMS]?.name || player.team}</span>
                    <span>•</span>
                    <span>#{player.jerseyNumber}</span>
                    {player.age > 0 && (
                      <>
                        <span>•</span>
                        <span>{player.age}y</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Fantasy Stats */}
                <div className="text-right">
                  <div className="text-white font-semibold">
                    Rank #{player.fantasyRank}
                  </div>
                  <div className="text-sm text-slate-400">
                    {player.projectedPoints.toFixed(1)} proj
                  </div>
                </div>

                {/* Add Button */}
                {showAddButton && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayerSelect?.(player);
                    }}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                  >
                    Add
                  </button>
                )}
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