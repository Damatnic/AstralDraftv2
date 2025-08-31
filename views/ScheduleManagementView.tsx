import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../contexts/AppContext';
import { useLeague } from '../hooks/useLeague';
import { Widget } from '../components/ui/Widget';
import ErrorDisplay from '../components/core/ErrorDisplay';
import { 
    CalendarIcon, 
    RefreshCwIcon, 
    ChevronLeftIcon, 
    ChevronRightIcon,
    TrophyIcon,
    ShuffleIcon,
    SaveIcon,
    AlertCircleIcon
} from 'lucide-react';
import type { Matchup } from '../types';
import { Avatar } from '../components/ui/Avatar';

const MatchupCard: React.FC<{ 
    matchup: Matchup, 
    league: ReturnType<typeof useLeague>['league'],
    onSwap?: () => void,
    isPlayoffs?: boolean 
}> = ({ matchup, league, onSwap, isPlayoffs }) => {
    const teamA = league?.teams.find((t: any) => t.id === matchup.teamA.teamId);
    const teamB = league?.teams.find((t: any) => t.id === matchup.teamB.teamId);

    if (!teamA || !teamB) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-4 rounded-lg flex items-center justify-between transition-all ${
                isPlayoffs ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' : 'bg-white/5 hover:bg-white/10'
            }`}
        >
            <div className="flex items-center gap-3 flex-1">
                <Avatar avatar={teamA.avatar} className="w-10 h-10 rounded-md" />
                <div>
                    <span className="font-semibold text-white">{teamA.name}</span>
                    <p className="text-xs text-[var(--text-secondary)]">{teamA.owner.name}</p>
                </div>
            </div>
            
            <div className="px-4">
                <span className={`font-bold ${isPlayoffs ? 'text-yellow-400' : 'text-red-400'}`}>VS</span>
            </div>
            
            <div className="flex items-center gap-3 flex-1 justify-end">
                <div className="text-right">
                    <span className="font-semibold text-white">{teamB.name}</span>
                    <p className="text-xs text-[var(--text-secondary)]">{teamB.owner.name}</p>
                </div>
                <Avatar avatar={teamB.avatar} className="w-10 h-10 rounded-md" />
            </div>

            {onSwap && (
                <button
                    onClick={onSwap}
                    title="Swap matchup"
                >
                    <ShuffleIcon className="w-4 h-4" />
                </button>
            )}
        </motion.div>
    );
};

const ScheduleManagementView: React.FC = () => {
    const { state, dispatch } = useAppState();
    const { league } = useLeague();
    const [selectedWeek, setSelectedWeek] = useState(1);
    const [editMode, setEditMode] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    if (!league || state.user?.id !== league.commissionerId) {
        return <ErrorDisplay title="Access Denied" message="You are not the commissioner of this league." onRetry={() => dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' })} />;

    if (league.schedule.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-secondary)]/5 p-8">
                <div className="max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-pane p-8 text-center"
                    >
                        <CalendarIcon className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-4">No Schedule Generated</h2>
                        <p className="text-[var(--text-secondary)] mb-6">
                            The league schedule will be automatically generated after the draft is complete.
                        </p>
                        <button
                            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'COMMISSIONER_TOOLS' }}
                            className="glass-button-primary px-6 py-3"
                        >
                            Back to Commissioner Tools
                        </button>
                    </motion.div>
                </div>
            </div>
        );

    const weeklyMatchups = league.schedule.filter((m: any) => m.week === selectedWeek);
    const maxWeek = Math.max(...league.schedule.map((m: any) => m.week));
    const isPlayoffWeek = selectedWeek >= 15; // Weeks 15-17 are playoffs

    const handleRegenerate = () => {
        setShowConfirmation(true);
    };

    const confirmRegenerate = () => {
        dispatch({ type: 'EDIT_MATCHUPS', payload: { leagueId: league.id, week: selectedWeek } });
        dispatch({ type: 'ADD_NOTIFICATION', payload: { 
            message: `Matchups for Week ${selectedWeek} have been regenerated.`, 
            type: 'SYSTEM' 
        }});
        setShowConfirmation(false);
    };

    const handleSwapMatchup = (index: number) => {
        // Logic to swap teams in a matchup
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-secondary)]/5 p-4 sm:p-6 lg:p-8">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-wider uppercase text-[var(--text-primary)] flex items-center gap-3">
                        <CalendarIcon className="w-8 h-8" />
                        Schedule Management
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] tracking-widest">{league.name}</p>
                </div>
                <button 
                    onClick={() => dispatch({ type: 'SET_VIEW', payload: 'COMMISSIONER_TOOLS' }} 
                    className="glass-button"
                >
                    Back to Tools
                </button>
            </header>

            <main className="max-w-4xl mx-auto">
                {/* Season Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-pane p-6 mb-6"
                >
                    <h2 className="text-xl font-bold text-white mb-4">Season Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                            <div className="text-2xl font-bold text-blue-400">17</div>
                            <div className="text-sm text-[var(--text-secondary)]">Total Weeks</div>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                            <div className="text-2xl font-bold text-green-400">14</div>
                            <div className="text-sm text-[var(--text-secondary)]">Regular Season</div>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-400">3</div>
                            <div className="text-sm text-[var(--text-secondary)]">Playoff Weeks</div>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                            <div className="text-2xl font-bold text-purple-400">{weeklyMatchups.length}</div>
                            <div className="text-sm text-[var(--text-secondary)]">Matchups/Week</div>
                        </div>
                    </div>
                </motion.div>

                {/* Week Navigation */}
                <Widget 
                    title={`Week ${selectedWeek} Schedule ${isPlayoffWeek ? '🏆' : ''}`} 
                    icon={<CalendarIcon />}
                    className="glass-pane"
                >
                    <div className="p-4 border-b border-white/10">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setSelectedWeek(w => Math.max(1, w-1))} 
                                    className="glass-button p-2"
                                >
                                    <ChevronLeftIcon className="w-5 h-5" />
                                </button>
                                
                                <select
                                    value={selectedWeek}
                                    onChange={(e: any) => setSelectedWeek(Number(e.target.value))}
                                >
                                    {Array.from({ length: maxWeek }, (_, i) => i + 1).map((week: any) => (
                                        <option key={week} value={week}>
                                            Week {week} {week >= 15 ? '(Playoffs)' : ''}
                                        </option>
                                    ))}
                                </select>
                                
                                <button 
                                    onClick={() => setSelectedWeek(w => Math.min(maxWeek, w+1))} 
                                    className="glass-button p-2"
                                >
                                    <ChevronRightIcon className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setEditMode(!editMode)}`}
                                >
                                    {editMode ? 'Done Editing' : 'Edit Mode'}
                                </button>
                                
                                <button 
                                    onClick={handleRegenerate}
                                >
                                    <RefreshCwIcon className="w-4 h-4 inline mr-2" />
                                    Regenerate
                                </button>
                            </div>
                        </div>

                        {isPlayoffWeek && (
                            <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                                <p className="text-sm text-yellow-300 flex items-center gap-2">
                                    <TrophyIcon className="w-4 h-4" />
                                    Playoff Week - Top teams compete for the championship
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Matchups List */}
                    <div className="p-4 space-y-3">
                        <AnimatePresence mode="wait">
                            {weeklyMatchups.map((matchup, index) => (
                                <MatchupCard 
                                    key={`${matchup.week}-${index}`}
                                    matchup={matchup} 
                                    league={league}
                                    onSwap={editMode ? () => handleSwapMatchup(index) : undefined}
                                    isPlayoffs={isPlayoffWeek}
                                />
                            ))}
                        </AnimatePresence>

                        {weeklyMatchups.length === 0 && (
                            <div className="text-center py-8 text-[var(--text-secondary)]">
                                <AlertCircleIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>No matchups scheduled for this week</p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    {editMode && (
                        <div className="p-4 border-t border-white/10">
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setEditMode(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        // Save changes logic
                                        setEditMode(false);
                                        dispatch({ type: 'ADD_NOTIFICATION', payload: { 
                                            message: 'Schedule changes saved!', 
                                            type: 'SYSTEM' 
                                        }});
                                    }}
                                    className="glass-button-primary px-4 py-2 flex items-center gap-2"
                                >
                                    <SaveIcon className="w-4 h-4" />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}
                </Widget>

                {/* Confirmation Modal */}
                {showConfirmation && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="glass-pane p-6 max-w-md"
                        >
                            <AlertCircleIcon className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white text-center mb-2">
                                Regenerate Week {selectedWeek} Matchups?
                            </h3>
                            <p className="text-[var(--text-secondary)] text-center mb-6">
                                This will create new random matchups for Week {selectedWeek}. 
                                This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowConfirmation(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmRegenerate}
                                >
                                    Regenerate
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default ScheduleManagementView;