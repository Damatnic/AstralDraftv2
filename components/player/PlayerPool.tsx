
import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback } from 'react';
import type { Player } from '../../types';
import PlayerCard from './PlayerCard';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchIcon } from '../icons/SearchIcon';
import { StarFilledIcon } from '../icons/StarFilledIcon';
import { useAppState } from '../../contexts/AppContext';

interface PlayerPoolProps {
  players: Player[];
  onPlayerSelect: (player: Player) => void;
  onAddToQueue: (player: Player) => void;
  onDraftPlayer: (player: Player) => void;
  onNominatePlayer: (player: Player) => void;
  onAddNote: (player: Player) => void;
  isMyTurn: boolean;
  playersToCompare: Player[];
  onToggleCompare: (player: Player) => void;
  queuedPlayerIds: number[];
  draftFormat: 'SNAKE' | 'AUCTION';
  isNominationTurn: boolean;}

const INITIAL_LOAD_COUNT = 50;
const LOAD_MORE_COUNT = 50;


const PlayerPool: React.FC<PlayerPoolProps> = ({ players, onPlayerSelect, onAddToQueue, onDraftPlayer, onNominatePlayer,
    onAddNote, isMyTurn, playersToCompare, onToggleCompare, queuedPlayerIds,
    draftFormat, isNominationTurn 
 }: any) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { state } = useAppState();
  const [search, setSearch] = React.useState('');
  const [positionFilter, setPositionFilter] = React.useState<string>('ALL');
  const [showWatchlistOnly, setShowWatchlistOnly] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<'default' | 'custom'>('default');
  const [visibleCount, setVisibleCount] = React.useState(INITIAL_LOAD_COUNT);

  const filteredPlayers = React.useMemo(() => {
    const initialPool = showWatchlistOnly ? players.filter((p: any) => state.watchlist.includes(p.id)) : players;

    const sortedPool = [...initialPool];
    if (sortBy === 'custom' && state.activeLeagueId && state.customRankings[state.activeLeagueId]) {
      const customRanks = state.customRankings[state.activeLeagueId];
      sortedPool.sort((a, b) => {
        const rankA = customRanks[a.id] ?? Infinity;
        const rankB = customRanks[b.id] ?? Infinity;
        if(rankA !== rankB) return rankA - rankB;
        return a.rank - b.rank; // fallback to default rank
      });

    return sortedPool.filter((p: any) => {
        const searchLower = search.toLowerCase();
        const matchesSearch = p.name.toLowerCase().includes(searchLower) || p.team.toLowerCase().includes(searchLower);
        const matchesPosition = positionFilter === 'ALL' || p.position === positionFilter;
        return matchesSearch && matchesPosition;
    });
  }, [players, search, positionFilter, showWatchlistOnly, state.watchlist, sortBy, state.customRankings, state.activeLeagueId]);

  const playersToShow = filteredPlayers.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPlayers.length;

  const handleLoadMore = () => {
    setVisibleCount(current => current + LOAD_MORE_COUNT);
  };
  
  React.useEffect(() => {
    setVisibleCount(INITIAL_LOAD_COUNT);
  }, [search, positionFilter, showWatchlistOnly, sortBy]);

  const positions = ['ALL', 'QB', 'RB', 'WR', 'TE', 'K', 'DST'];

  return (
    <div className="glass-pane flex flex-col bg-[var(--panel-bg)] border-[var(--panel-border)] rounded-2xl h-full shadow-2xl shadow-black/50 sm:px-4 md:px-6 lg:px-8">
      <div className="flex-shrink-0 p-2 sm:p-3 border-b border-[var(--panel-border)]">
        <h2 className="font-display text-lg sm:text-xl font-bold text-[var(--text-primary)] tracking-wider text-center">AVAILABLE PLAYERS</h2>
        <p className="text-center text-xs sm:text-sm text-cyan-200/70">{players.length} Remaining</p>
      </div>
      <div className="flex-shrink-0 p-1.5 sm:p-2 space-y-2">
         <div className="relative sm:px-4 md:px-6 lg:px-8">
            <input
                type="text"
                placeholder="Search player or team..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-[var(--text-secondary)]" />
         </div>
        <div className="flex gap-1 justify-between items-center flex-wrap sm:px-4 md:px-6 lg:px-8">
            <div className="flex gap-1 flex-wrap sm:px-4 md:px-6 lg:px-8">
                {positions.map((pos: any) => (
                    <button 
                        key={pos} 
                        onClick={() => setPositionFilter(pos)}
                        `}
                    >
                        {pos}
                    </button>
                ))}
            </div>
            <div className="flex gap-1 sm:px-4 md:px-6 lg:px-8">
                <button
                    onClick={() => setShowWatchlistOnly(s => !s)}
                    `}
                >
                    <StarFilledIcon className="h-3 w-3 sm:px-4 md:px-6 lg:px-8" />
                    <span className="hidden sm:inline">Watchlist</span>
                    <span className="sm:hidden">★</span>
                </button>
                <select 
                    value={sortBy} 
                    onChange={e => setSortBy(e.target.value as any)}
                  >
                      <option value="default">Default</option>
                      <option value="custom">Custom</option>
                </select>
            </div>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-1 sm:p-2 space-y-1">
        <AnimatePresence>
            {playersToShow.map((player: any) => (
                <PlayerCard>
                    key={player.id} 
                    player={player} 
                    onSelect={() => onPlayerSelect(player)}
                    onAddToQueue={() => onAddToQueue(player)}
                    onDraft={() => onDraftPlayer(player)}
                    onNominate={() => onNominatePlayer(player)}
                    onAddNote={() => onAddNote(player)}
                    isMyTurn={isMyTurn}
                    onToggleCompare={() => onToggleCompare(player)}
                    isSelectedForCompare={playersToCompare.some((p: any) => p.id === player.id)}
                    isInQueue={queuedPlayerIds.includes(player.id)}
                    isNominationTurn={isNominationTurn}
                />
            ))}
        </AnimatePresence>
        {hasMore && (
            <div className="pt-2 text-center sm:px-4 md:px-6 lg:px-8">
                <button onClick={handleLoadMore} className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-bold text-cyan-300 bg-cyan-500/10 rounded-md hover:bg-cyan-500/20 mobile-touch-target" aria-label="Action button">
                    Load More ({filteredPlayers.length - visibleCount} remaining)
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

const PlayerPoolWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <PlayerPool {...props} />
  </ErrorBoundary>
);

export default React.memo(PlayerPoolWithErrorBoundary);
