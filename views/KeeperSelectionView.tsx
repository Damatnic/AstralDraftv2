import { motion } from &apos;framer-motion&apos;;
import { useAppState } from &apos;../contexts/AppContext&apos;;
import { useLeague } from &apos;../hooks/useLeague&apos;;
import { Widget } from &apos;../components/ui/Widget&apos;;
import ErrorDisplay from &apos;../components/core/ErrorDisplay&apos;;
import { UsersIcon } from &apos;../components/icons/UsersIcon&apos;;
import { CheckCircleIcon, XCircleIcon, ShieldIcon, TrophyIcon } from &apos;lucide-react&apos;;
import type { Player } from &apos;../types&apos;;
import { Avatar } from &apos;../components/ui/Avatar&apos;;

const KeeperSelectionView: React.FC = () => {
}
    const { state, dispatch } = useAppState();
    const { league, myTeam } = useLeague();
    const [selectedIds, setSelectedIds] = React.useState<Set<number>>(new Set(myTeam?.keepers || []));
    const [showConfirmation, setShowConfirmation] = React.useState(false);

    if (!league || !myTeam) {
}
        return <ErrorDisplay title="Error" message="Could not load league data." onRetry={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;DASHBOARD&apos; })} />;

    const keeperCount = league.settings.keeperCount || 0;

    if (keeperCount === 0) {
}
        return <ErrorDisplay title="Not a Keeper League" message="This league is not set up for keepers." onRetry={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;TEAM_HUB&apos; })} />;

    const handleTogglePlayer = (playerId: number) => {
}
        setSelectedIds(prev => {
}
            const newSet = new Set(prev);
            if (newSet.has(playerId)) {
}
                newSet.delete(playerId);
            } else {
}
                if (newSet.size < keeperCount) {
}
                    newSet.add(playerId);


            return newSet;
        });
    };

    const handleSaveChanges = () => {
}
        dispatch({
}
            type: &apos;SET_KEEPERS&apos;,
            payload: { leagueId: league.id, teamId: myTeam.id, keeperPlayerIds: Array.from(selectedIds) }
        });
        dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: { message: &apos;Keeper selections saved!&apos;, type: &apos;SYSTEM&apos; } });
        setShowConfirmation(true);
        setTimeout(() => {
}
            dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;TEAM_HUB&apos; });
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
                    onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;TEAM_HUB&apos; }) 
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
                        Choose up to {keeperCount} players from your previous season&apos;s roster to keep for the upcoming draft. 
                        These picks will replace your first {keeperCount} round draft selections.
                    </p>
                </motion.div>

                {/* Player Selection Grid */}
                <Widget>
                    title={`Your Roster (${selectedIds.size}/${keeperCount} selected)`} 
                    icon={<UsersIcon />}
                    className="glass-pane"
                >
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {myTeam.roster.map((player, index) => {
}
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
}
                                                <CheckCircleIcon className="w-5 h-5 text-green-400" />
                                            ) : (
                                                <div className="w-5 h-5 rounded-full border-2 border-gray-400" />
                                            )}
                                        </div>

                                        {/* Player Avatar */}
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white
}
                                            ${player.position === &apos;QB&apos; ? &apos;bg-red-500&apos; :
}
                                              player.position === &apos;RB&apos; ? &apos;bg-green-500&apos; :
                                              player.position === &apos;WR&apos; ? &apos;bg-blue-500&apos; :
                                              player.position === &apos;TE&apos; ? &apos;bg-yellow-500&apos; :
                                              &apos;bg-gray-500&apos;}`}>
                                            {player.position}
                                        </div>

                                        {/* Player Info */}
                                        <div className="flex-1">
                                            <p className="font-bold text-white">{player.name}</p>
                                            <p className="text-xs text-[var(--text-secondary)]">
                                                {player.position} - {player.team}
                                            </p>
                                            {player.projectedPoints && (
}
                                                <p className="text-xs text-blue-400 mt-1">
                                                    Proj: {player.projectedPoints.toFixed(1)} pts
                                                </p>
                                            )}
                                        </div>

                                        {/* Keeper Cost */}
                                        {isSelected && (
}
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
}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <div className="glass-pane p-8 max-w-md text-center">
                            <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-2">Keepers Saved!</h2>
                            <p className="text-[var(--text-secondary)]">
                                Your {selectedIds.size} keeper selection{selectedIds.size !== 1 ? &apos;s have&apos; : &apos; has&apos;} been saved.
                            </p>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default KeeperSelectionView;