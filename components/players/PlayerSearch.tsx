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
import { VirtualScroll } from '../../performance/virtual-scrolling';
import { useDebounce } from '../../performance/memory-optimization';

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
}: any) => {
  const { state, dispatch } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
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

    // Apply search query (use debounced value for performance)
    if (debouncedSearchQuery.trim()) {
      players = searchPlayers(debouncedSearchQuery).filter((player: any) => 
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

    return players; // Remove artificial limit, VirtualScroll will handle performance
  }, [availablePlayers, debouncedSearchQuery, selectedPosition, sortBy, excludePlayerIds]);

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
            autoComplete="off"
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
              autoComplete="off"
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
              autoComplete="off"
            >
              <option value="rank">Fantasy Rank</option>
              <option value="name">Name</option>
              <option value="team">Team</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results with Virtual Scrolling */}
      <div className="sm:px-4 md:px-6 lg:px-8">
        {filteredPlayers.length > 0 ? (
          <VirtualScroll
            items={filteredPlayers}
            itemHeight={120}
            containerHeight={400}
            renderItem={(player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.01 }}
                onClick={(e: MouseEvent<HTMLDivElement>) => { e.preventDefault(); handlePlayerClick(player); }}
                className={`player-card ${player.position.toLowerCase()} cursor-pointer group mb-2`}
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
                      onClick={(e: any) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onPlayerSelect?.(player);
                      }}
                      aria-label="Action button"
                      className="add-btn min-h-[44px] min-w-[44px] flex items-center justify-center"
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
            )}
            className="virtual-scroll-container"
          />
        ) : (
          <div className="text-center py-8 text-slate-400">
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

const PlayerSearchWithErrorBoundary: React.FC<PlayerSearchProps> = (props: any) => (
  <ErrorBoundary>
    <PlayerSearch {...props} />
  </ErrorBoundary>
);

export default React.memo(PlayerSearchWithErrorBoundary);