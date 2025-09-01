/**
 * Mobile Search Interface
 * Touch-optimized search with filters and quick actions for mobile devices
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Player, PlayerPosition } from '../../types';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { 
    SearchIcon,
    FilterIcon,
    XIcon,
    ChevronDownIcon,
    SortAscIcon,
    SortDescIcon,
    StarIcon,
    TrendingUpIcon,
//     TrendingDownIcon
} from 'lucide-react';

interface MobileSearchInterfaceProps {
    players: Player[];
    onPlayerSelect?: (player: Player) => void;
    onSearch?: (query: string) => void;
    placeholder?: string;
    showFilters?: boolean;
    showSorting?: boolean;
    className?: string;


interface SearchFilters {
    positions: PlayerPosition[];
    teams: string[];
    minRank?: number;
    maxRank?: number;
    injured?: boolean;
    available?: boolean;

interface SortOption {
    id: string;
    label: string;
    key: keyof Player | 'projection';
    direction: 'asc' | 'desc';


const MobileSearchInterface: React.FC<MobileSearchInterfaceProps> = ({
    players,
    onPlayerSelect,
    onSearch,
    placeholder = "Search players...",
    showFilters = true,
    showSorting = true,
    className = ''
}: any) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);
    const [selectedSort, setSelectedSort] = React.useState<SortOption | null>(null);
    const [filters, setFilters] = React.useState<SearchFilters>({
        positions: [],
        teams: [],
        minRank: undefined,
        maxRank: undefined,
        injured: undefined,
        available: undefined
    });

    const isMobile = useMediaQuery('(max-width: 768px)');

    const sortOptions: SortOption[] = [
        { id: 'rank', label: 'Overall Rank', key: 'rank', direction: 'asc' },
        { id: 'name', label: 'Name', key: 'name', direction: 'asc' },
        { id: 'position', label: 'Position', key: 'position', direction: 'asc' },
        { id: 'team', label: 'Team', key: 'team', direction: 'asc' },
        { id: 'projection', label: 'Projection', key: 'projection', direction: 'desc' },
        { id: 'adp', label: 'ADP', key: 'adp', direction: 'asc' },
        { id: 'age', label: 'Age', key: 'age', direction: 'asc' }
    ];

    const positions: PlayerPosition[] = ['QB', 'RB', 'WR', 'TE', 'K', 'DST'];
    const teams = Array.from(new Set(players.map((p: any) => p.team))).sort();

    // Type-safe helper functions
    const getInjuryStatus = (injuryHistory: string | undefined): boolean => {
        if (!injuryHistory) return false;
        return injuryHistory === 'moderate' || injuryHistory === 'extensive';
    };

    const getPositionColor = (position: PlayerPosition) => {
        switch (position) {
            case 'QB': return 'text-purple-400 bg-purple-500/20';
            case 'RB': return 'text-green-400 bg-green-500/20';
            case 'WR': return 'text-blue-400 bg-blue-500/20';
            case 'TE': return 'text-orange-400 bg-orange-500/20';
            case 'K': return 'text-yellow-400 bg-yellow-500/20';
            case 'DST': return 'text-red-400 bg-red-500/20';
            default: return 'text-gray-400 bg-gray-500/20';

    };

    const getPlayerValue = (player: Player, key: keyof Player | 'projection'): any => {
        if (key === 'projection') {
            return player.stats?.projection || 0;

        return player[key as keyof Player];
    };

    // Filter and sort players
    const filteredAndSortedPlayers = React.useMemo(() => {
        const filtered = players.filter((player: any) => {
            // Text search
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                if (!player.name.toLowerCase().includes(query) && 
                    !player.team.toLowerCase().includes(query) &&
                    !player.position.toLowerCase().includes(query)) {
                    return false;


            // Position filter
            if (filters.positions.length > 0 && !filters.positions.includes(player.position)) {
                return false;

            // Team filter
            if (filters.teams.length > 0 && !filters.teams.includes(player.team)) {
                return false;

            // Rank filter
            if (filters.minRank && player.rank < filters.minRank) {
                return false;

            if (filters.maxRank && player.rank > filters.maxRank) {
                return false;

            // Injury filter
            if (filters.injured !== undefined) {
                const isInjured = getInjuryStatus(player.injuryHistory);
                if (filters.injured !== isInjured) {
                    return false;


            return true;
        });

        // Sort players
        if (selectedSort) {
            filtered.sort((a, b) => {
                const aValue = getPlayerValue(a, selectedSort.key);
                const bValue = getPlayerValue(b, selectedSort.key);

                if (aValue === undefined && bValue === undefined) return 0;
                if (aValue === undefined) return 1;
                if (bValue === undefined) return -1;

                let comparison = 0;
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    comparison = aValue.localeCompare(bValue);
                } else if (typeof aValue === 'number' && typeof bValue === 'number') {
                    comparison = aValue - bValue;
                } else {
                    comparison = String(aValue).localeCompare(String(bValue));

                return selectedSort.direction === 'desc' ? -comparison : comparison;
            });

        return filtered;
    }, [players, searchQuery, filters, selectedSort]);

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        onSearch?.(query);
    };

    const togglePositionFilter = (position: PlayerPosition) => {
        setFilters(prev => ({
            ...prev,
            positions: prev.positions.includes(position)
                ? prev.positions.filter((p: any) => p !== position)
                : [...prev.positions, position]
        }));
    };

    const toggleTeamFilter = (team: string) => {
        setFilters(prev => ({
            ...prev,
            teams: prev.teams.includes(team)
                ? prev.teams.filter((t: any) => t !== team)
                : [...prev.teams, team]
        }));
    };

    const clearFilters = () => {
        setFilters({
            positions: [],
            teams: [],
            minRank: undefined,
            maxRank: undefined,
            injured: undefined,
            available: undefined
        });
        setSelectedSort(null);
        setSearchQuery('');
    };

    const hasActiveFilters = React.useMemo(() => {
        return filters.positions.length > 0 || 
               filters.teams.length > 0 || 
               filters.minRank !== undefined || 
               filters.maxRank !== undefined ||
               filters.injured !== undefined ||
               selectedSort !== null ||
               searchQuery.length > 0;
    }, [filters, selectedSort, searchQuery]);

    return (
        <div className={`bg-[var(--panel-bg)] border-b border-[var(--panel-border)] ${className}`}>
            {/* Search Bar */}
            <div className="p-4 pb-2 sm:px-4 md:px-6 lg:px-8">
                <div className="relative sm:px-4 md:px-6 lg:px-8">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e: any) => handleSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-blue-400 sm:px-4 md:px-6 lg:px-8"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => handleSearchChange('')}
                        >
                            <XIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Controls */}
            {(showFilters || showSorting) && (
                <div className="px-4 pb-2 sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-center justify-between gap-2 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-center gap-2 overflow-x-auto sm:px-4 md:px-6 lg:px-8">
                            {showFilters && (
                                <button
                                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}`}
                                >
                                    <FilterIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
//                                     Filters
                                    {hasActiveFilters && (
                                        <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center sm:px-4 md:px-6 lg:px-8">
                                            {filters.positions.length + filters.teams.length + 
                                             (selectedSort ? 1 : 0) + (searchQuery ? 1 : 0)}
                                        </span>
                                    )}
                                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${
                                        showAdvancedFilters ? 'rotate-180' : ''
                                    }`} />
                                </button>
                            )}

                            {showSorting && (
                                <div className="flex items-center gap-1 sm:px-4 md:px-6 lg:px-8">
                                    <span className="text-xs text-[var(--text-secondary)] whitespace-nowrap sm:px-4 md:px-6 lg:px-8">Sort by:</span>
                                    <select
                                        value={selectedSort?.id || ''}
                                        onChange={(e: any) => {
                                            const option = sortOptions.find((opt: any) => opt.id === e.target.value);
                                            setSelectedSort(option || null);
                                        }}
                                        className="bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded px-2 py-1 text-sm text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8"
                                    >
                                        <option value="">Default</option>
                                        {sortOptions.map((option: any) => (
                                            <option key={option.id} value={option.id}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-xs text-red-400 hover:text-red-300 whitespace-nowrap sm:px-4 md:px-6 lg:px-8"
                             aria-label="Action button">
                                Clear All
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Advanced Filters */}
            <AnimatePresence>
                {showAdvancedFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-[var(--panel-border)] px-4 py-3 overflow-hidden sm:px-4 md:px-6 lg:px-8"
                    >
                        {/* Position Filters */}
                        <div className="mb-3 sm:px-4 md:px-6 lg:px-8">
                            <div className="text-xs font-medium text-[var(--text-secondary)] mb-2 sm:px-4 md:px-6 lg:px-8">Positions</div>
                            <div className="flex flex-wrap gap-2 sm:px-4 md:px-6 lg:px-8">
                                {positions.map((position: any) => (
                                    <button
                                        key={position}
                                        onClick={() => togglePositionFilter(position)}`}
                                    >
                                        {position}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Team Filters */}
                        <div className="mb-3 sm:px-4 md:px-6 lg:px-8">
                            <div className="text-xs font-medium text-[var(--text-secondary)] mb-2 sm:px-4 md:px-6 lg:px-8">Teams</div>
                            <div className="max-h-24 overflow-y-auto sm:px-4 md:px-6 lg:px-8">
                                <div className="grid grid-cols-4 gap-1 sm:px-4 md:px-6 lg:px-8">
                                    {teams.map((team: any) => (
                                        <button
                                            key={team}
                                            onClick={() => toggleTeamFilter(team)}`}
                                        >
                                            {team}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Rank Range */}
                        <div className="mb-3 sm:px-4 md:px-6 lg:px-8">
                            <div className="text-xs font-medium text-[var(--text-secondary)] mb-2 sm:px-4 md:px-6 lg:px-8">Rank Range</div>
                            <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.minRank || ''}
                                    onChange={(e: any) => setFilters(prev => ({
                                        ...prev,
                                        minRank: e.target.value ? parseInt(e.target.value) : undefined
                                    }}
                                    className="flex-1 px-2 py-1 bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded text-sm sm:px-4 md:px-6 lg:px-8"
                                />
                                <span className="text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">to</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.maxRank || ''}
                                    onChange={(e: any) => setFilters(prev => ({
                                        ...prev,
                                        maxRank: e.target.value ? parseInt(e.target.value) : undefined
                                    }}
                                    className="flex-1 px-2 py-1 bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded text-sm sm:px-4 md:px-6 lg:px-8"
                                />
                            </div>
                        </div>

                        {/* Other Filters */}
                        <div>
                            <div className="text-xs font-medium text-[var(--text-secondary)] mb-2 sm:px-4 md:px-6 lg:px-8">Status</div>
                            <div className="flex gap-2 sm:px-4 md:px-6 lg:px-8">
                                <button
                                    onClick={() = aria-label="Action button"> setFilters(prev => ({
                                        ...prev,
                                        injured: prev.injured === true ? undefined : true
                                    }))}
                                    className={`px-3 py-1 rounded text-xs transition-colors ${
                                        filters.injured === true
                                            ? 'bg-red-500/20 text-red-400'
                                            : 'bg-[var(--panel-bg)] border border-[var(--panel-border)] text-[var(--text-secondary)]'
                                    }`}
                                >
                                    Injured Only
                                </button>
                                <button
                                    onClick={() = aria-label="Action button"> setFilters(prev => ({
                                        ...prev,
                                        injured: prev.injured === false ? undefined : false
                                    }))}
                                    className={`px-3 py-1 rounded text-xs transition-colors ${
                                        filters.injured === false
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-[var(--panel-bg)] border border-[var(--panel-border)] text-[var(--text-secondary)]'
                                    }`}
                                >
                                    Healthy Only
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results Summary */}
            {filteredAndSortedPlayers.length !== players.length && (
                <div className="px-4 py-2 text-xs text-[var(--text-secondary)] border-t border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                    Showing {filteredAndSortedPlayers.length} of {players.length} players
                </div>
            )}

            {/* Player List */}
            <div className="max-h-64 overflow-y-auto sm:px-4 md:px-6 lg:px-8">
                {filteredAndSortedPlayers.map((player, index) => (
                    <motion.div
                        key={player.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="border-b border-[var(--panel-border)] last:border-b-0 sm:px-4 md:px-6 lg:px-8"
                    >
                        <button
                            onClick={() => onPlayerSelect?.(player)}
                        >
                            <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                                <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                                    <div className="flex items-center gap-2 mb-1 sm:px-4 md:px-6 lg:px-8">
                                        <span className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                            {player.name}
                                        </span>
                                        {getInjuryStatus(player.injuryHistory) && (
                                            <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded text-xs sm:px-4 md:px-6 lg:px-8">
//                                                 Injured
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                        <span className="flex items-center gap-1 sm:px-4 md:px-6 lg:px-8">
                                            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                                                getPositionColor(player.position)
                                            }`}>
                                                {player.position}
                                            </span>
                                            {player.team}
                                        </span>
                                        {Boolean(player.rank) && (
                                            <span>#{player.rank}</span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="text-right sm:px-4 md:px-6 lg:px-8">
                                    {Boolean(player.stats?.projection) && (
                                        <div className="text-lg font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                            {player.stats.projection?.toFixed(1)}
                                        </div>
                                    )}
                                    {player.adp && (
                                        <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                            ADP: {player.adp.toFixed(1)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </button>
                    </motion.div>
                ))}
            </div>

            {filteredAndSortedPlayers.length === 0 && (
                <div className="p-8 text-center text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                    <SearchIcon className="w-8 h-8 mx-auto mb-2 opacity-50 sm:px-4 md:px-6 lg:px-8" />
                    <div className="text-sm sm:px-4 md:px-6 lg:px-8">No players found</div>
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="text-xs text-blue-400 hover:text-blue-300 mt-1 sm:px-4 md:px-6 lg:px-8"
                         aria-label="Action button">
                            Clear filters to see all players
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

const MobileSearchInterfaceWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <MobileSearchInterface {...props} />
  </ErrorBoundary>
);

export default React.memo(MobileSearchInterfaceWithErrorBoundary);