/**
 * Player Search Component
 * Search and filter NFL players for roster management
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useState, useMemo, FC, MouseEvent } from 'react';
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

const PlayerSearch: FC<PlayerSearchProps> = ({
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
    let players = availablePlayers.filter((player: any) => 
      !excludePlayerIds.includes(player.id)
    );

    // Apply position filter
    if (selectedPosition !== 'ALL') {
      players = players.filter((player: any) => player.position === selectedPosition);
    }

    // Apply search query
    if (searchQuery.trim()) {
      players = searchPlayers(searchQuery).filter((player: any) => 
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
    <div className="search-container sm:px-4 md:px-6 lg:px-8">
      {/* Search Header */}
      <div className="mb-6 sm:px-4 md:px-6 lg:px-8">
        <h3 className="text-xl font-bold text-white mb-4 sm:px-4 md:px-6 lg:px-8">Player Search</h3>
        
        {/* Search Input */}
        <div className="input-group mb-4 sm:px-4 md:px-6 lg:px-8">
          <input
            type="search"
            placeholder="Search players by name, team, or position..."
            value={searchQuery}
            onChange={(e: any) => setSearchQuery(e.target.value)}
            autocomplete="off"
            data-form-type="search"
          />
        </div>

        {/* Filters */}
        <div className="search-row sm:px-4 md:px-6 lg:px-8">
          {/* Position Filter */}
          <div className="input-group sm:px-4 md:px-6 lg:px-8">
            <label>Position</label>
            <select
              value={selectedPosition}
              onChange={(e: any) => setSelectedPosition(e.target.value)}
              autocomplete="off"
            >
              {positions.map((pos: any) => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="input-group sm:px-4 md:px-6 lg:px-8">
            <label>Sort By</label>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value as 'rank' | 'name' | 'team')}
              autocomplete="off"
            >
              <option value="rank">Fantasy Rank</option>
              <option value="name">Name</option>
              <option value="team">Team</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-2 max-h-96 overflow-y-auto mobile-scroll custom-scrollbar sm:px-4 md:px-6 lg:px-8">
        <AnimatePresence>
          {filteredPlayers.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.02 }}
              onClick={(e: MouseEvent<HTMLDivElement>) => { e.preventDefault(); handlePlayerClick(player); }}
              className={`player-card ${player.position.toLowerCase()} cursor-pointer group`}
            >
              <div className="player-header sm:px-4 md:px-6 lg:px-8">
                <div className="player-info sm:px-4 md:px-6 lg:px-8">
                  <div className="position-badge sm:px-4 md:px-6 lg:px-8">{player.position}</div>
                  <h3 className="player-name group-hover:text-blue-400 transition-colors sm:px-4 md:px-6 lg:px-8">
                    {player.name}
                  </h3>
                  <p className="player-team sm:px-4 md:px-6 lg:px-8">
                    {NFL_TEAMS[player.team as keyof typeof NFL_TEAMS]?.name || player.team} • #{player.jerseyNumber}
                    {player.age > 0 && ` • ${player.age}y`}
                  </p>
                </div>
                {showAddButton && (
                  <button
                    onClick={(e: any) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onPlayerSelect?.(player);
                    }}
                    aria-label="Action button"
                    className="add-btn min-h-[44px] min-w-[44px] flex items-center justify-center sm:px-4 md:px-6 lg:px-8"
                  >
                    Add
                  </button>
                )}
              </div>

              <div className="player-stats sm:px-4 md:px-6 lg:px-8">
                <div className="stat-item sm:px-4 md:px-6 lg:px-8">
                  <span className="stat-label sm:px-4 md:px-6 lg:px-8">Rank</span>
                  <span className="stat-value sm:px-4 md:px-6 lg:px-8">#{player.fantasyRank}</span>
                </div>
                <div className="stat-item sm:px-4 md:px-6 lg:px-8">
                  <span className="stat-label sm:px-4 md:px-6 lg:px-8">Projection</span>
                  <span className="stat-value sm:px-4 md:px-6 lg:px-8">{player.projectedPoints.toFixed(1)}</span>
                </div>
                <div className="stat-item sm:px-4 md:px-6 lg:px-8">
                  <span className="stat-label sm:px-4 md:px-6 lg:px-8">Status</span>
                  <span className={`stat-value ${getInjuryStatusColor(player.injuryStatus)}`}>
                    {player.injuryStatus}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredPlayers.length === 0 && (
          <div className="text-center py-8 text-slate-400 sm:px-4 md:px-6 lg:px-8">
            {searchQuery ? 'No players found matching your search.' : 'No players available.'}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mt-4 text-sm text-slate-400 text-center sm:px-4 md:px-6 lg:px-8">
        Showing {filteredPlayers.length} of {availablePlayers.length} players
      </div>
    </div>
  );
};

const PlayerSearchWithErrorBoundary: React.FC<PlayerSearchProps> = (props) => (
  <ErrorBoundary>
    <PlayerSearch {...props} />
  </ErrorBoundary>
);

export default React.memo(PlayerSearchWithErrorBoundary);