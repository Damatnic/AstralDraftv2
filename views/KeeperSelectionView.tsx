import { motion } from 'framer-motion';
import { useAppState } from '../contexts/AppContext';
import { useLeague } from '../hooks/useLeague';
import { Widget } from '../components/ui/Widget';
import ErrorDisplay from '../components/core/ErrorDisplay';
import { UsersIcon } from '../components/icons/UsersIcon';
import { CheckCircleIcon, XCircleIcon, ShieldIcon, TrophyIcon } from 'lucide-react';
import type { Player } from '../types';
import { Avatar } from '../components/ui/Avatar';

const KeeperSelectionView: React.FC = () => {
    const { state, dispatch } = useAppState();
    const { league, myTeam } = useLeague();
    const [selectedIds, setSelectedIds] = React.useState<Set<number>>(new Set(myTeam?.keepers || []));
    const [showConfirmation, setShowConfirmation] = React.useState(false);

    if (!league || !myTeam) {
        return <ErrorDisplay title="Error" message="Could not load league data." onRetry={() => dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' })} />;

    const keeperCount = league.settings.keeperCount || 0;

    if (keeperCount === 0) {
        return <ErrorDisplay title="Not a Keeper League" message="This league is not set up for keepers." onRetry={() => dispatch({ type: 'SET_VIEW', payload: 'TEAM_HUB' })} />;

    const handleTogglePlayer = (playerId: number) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(playerId)) {
                newSet.delete(playerId);
            } else {
                if (newSet.size < keeperCount) {
                    newSet.add(playerId);


            return newSet;
        });
    };

    const handleSaveChanges = () => {
        dispatch({
            type: 'SET_KEEPERS',
            payload: { leagueId: league.id, teamId: myTeam.id, keeperPlayerIds: Array.from(selectedIds) }
        });
        dispatch({ type: 'ADD_NOTIFICATION', payload: { message: 'Keeper selections saved!', type: 'SYSTEM' } });
        setShowConfirmation(true);
        setTimeout(() => {
            dispatch({ type: 'SET_VIEW', payload: 'TEAM_HUB' });
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-secondary)]/5 p-4 sm:p-6 lg:p-8">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-wider uppercase text-[var(--text-primary)] flex items-center gap-3">
                        <ShieldIcon className="w-8 h-8" />
                        Select Keepers
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] tracking-widest">{league.name}</p>
                </div>
                <button 
                    onClick={() => dispatch({ type: 'SET_VIEW', payload: 'TEAM_HUB' }) 
                    className="glass-button"
                >
                    Back to Team Hub
                </button>
            </header>

            <main className="max-w-6xl mx-auto">
                {/* Keeper Rules */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-pane p-6 mb-6"
                >
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <TrophyIcon className="w-5 h-5 text-yellow-400" />
                        Keeper Rules
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-white/5 rounded-lg">
                            <div className="text-2xl font-bold text-blue-400">{keeperCount}</div>
                            <div className="text-sm text-[var(--text-secondary)]">Max Keepers</div>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-lg">
                            <div className="text-2xl font-bold text-green-400">{selectedIds.size}</div>
                            <div className="text-sm text-[var(--text-secondary)]">Selected</div>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-lg">
                            <div className="text-2xl font-bold text-purple-400">{keeperCount - selectedIds.size}</div>
                            <div className="text-sm text-[var(--text-secondary)]">Remaining</div>
                        </div>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mt-4">
                        Choose up to {keeperCount} players from your previous season's roster to keep for the upcoming draft. 
                        These picks will replace your first {keeperCount} round draft selections.
                    </p>
                </motion.div>

                {/* Player Selection Grid */}
                <Widget
                    title={`Your Roster (${selectedIds.size}/${keeperCount} selected)`} 
                    icon={<UsersIcon />}
                    className="glass-pane"
                >
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {myTeam.roster.map((player, index) => {
                                const isSelected = selectedIds.has(player.id);
                                return (
                                    <motion.div
                                        key={player.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => handleTogglePlayer(player.id)}`}
                                    >
                                        {/* Selection Indicator */}
                                        <div className="absolute top-2 right-2">
                                            {isSelected ? (
                                                <CheckCircleIcon className="w-5 h-5 text-green-400" />
                                            ) : (
                                                <div className="w-5 h-5 rounded-full border-2 border-gray-400" />
                                            )}
                                        </div>

                                        {/* Player Avatar */}
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white
                                            ${player.position === 'QB' ? 'bg-red-500' :
                                              player.position === 'RB' ? 'bg-green-500' :
                                              player.position === 'WR' ? 'bg-blue-500' :
                                              player.position === 'TE' ? 'bg-yellow-500' :
                                              'bg-gray-500'}`}>
                                            {player.position}
                                        </div>

                                        {/* Player Info */}
                                        <div className="flex-1">
                                            <p className="font-bold text-white">{player.name}</p>
                                            <p className="text-xs text-[var(--text-secondary)]">
                                                {player.position} - {player.team}
                                            </p>
                                            {player.projectedPoints && (
                                                <p className="text-xs text-blue-400 mt-1">
                                                    Proj: {player.projectedPoints.toFixed(1)} pts
                                                </p>
                                            )}
                                        </div>

                                        {/* Keeper Cost */}
                                        {isSelected && (
                                            <div className="text-right">
                                                <p className="text-xs text-[var(--text-secondary)]">Round</p>
                                                <p className="text-lg font-bold text-white">{selectedIds.size}</p>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex justify-between items-center">
                            <button
                                onClick={() => setSelectedIds(new Set())}
                                disabled={selectedIds.size === 0}
                            >
                                <XCircleIcon className="w-4 h-4" />
                                Clear All
                            </button>
                            
                            <button 
                                onClick={handleSaveChanges}
                                disabled={selectedIds.size === 0}
                            >
                                <CheckCircleIcon className="w-5 h-5" />
                                Save Keeper Selections
                            </button>
                        </div>
                    </div>
                </Widget>

                {/* Confirmation Modal */}
                {showConfirmation && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <div className="glass-pane p-8 max-w-md text-center">
                            <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-2">Keepers Saved!</h2>
                            <p className="text-[var(--text-secondary)]">
                                Your {selectedIds.size} keeper selection{selectedIds.size !== 1 ? 's have' : ' has'} been saved.
                            </p>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default KeeperSelectionView;