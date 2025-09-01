/**
 * Season Management Component
 * Advanced season administration and control panel
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { CalendarIcon } from &apos;../icons/CalendarIcon&apos;;
import { PlayIcon } from &apos;../icons/PlayIcon&apos;;
import { PauseIcon } from &apos;../icons/PauseIcon&apos;;
import { StopIcon } from &apos;../icons/StopIcon&apos;;
import { RefreshIcon } from &apos;../icons/RefreshIcon&apos;;
import { AdjustmentsIcon } from &apos;../icons/AdjustmentsIcon&apos;;
import { League } from &apos;../../types&apos;;

interface SeasonManagementProps {
}
    league: League;
    dispatch: React.Dispatch<any>;

}

interface SeasonAction {
}
    type: &apos;ADVANCE_WEEK&apos; | &apos;RESET_WEEK&apos; | &apos;END_SEASON&apos; | &apos;MANUAL_SCORE_ADJUSTMENT&apos; | &apos;FORCE_SYNC&apos;;
    data?: any;}

const SeasonManagement: React.FC<SeasonManagementProps> = ({ league, dispatch }: any) => {
}
    const [showConfirmAction, setShowConfirmAction] = React.useState<SeasonAction | null>(null);
    const [manualScoreMode, setManualScoreMode] = React.useState(false);
    const [selectedMatchup, setSelectedMatchup] = React.useState<string | null>(null);
    const [scoreAdjustment, setScoreAdjustment] = React.useState({ teamId: &apos;&apos;, adjustment: 0, reason: &apos;&apos; });

    // Mock season data
    const seasonInfo = {
}
        currentWeek: 12,
        totalWeeks: 17,
        playoffWeeks: 3,
        regularSeasonWeeks: 14,
        tradeDeadline: &apos;2024-11-15&apos;,
        playoffStart: &apos;2024-12-01&apos;,
        championshipWeek: 17,
        waiverDay: &apos;Wednesday&apos;,
        lockTime: &apos;13:00&apos;
    };

    const weeklyMatchups = [
        { id: &apos;1&apos;, team1: &apos;Alice\&apos;s Aces&apos;, team2: &apos;Smithtown Stallions&apos;, score1: 125.6, score2: 118.2, completed: true },
        { id: &apos;2&apos;, team1: &apos;Thunder Bolts&apos;, team2: &apos;Wilson Warriors&apos;, score1: 98.3, score2: 142.7, completed: true },
        { id: &apos;3&apos;, team1: &apos;Dynasty Dominators&apos;, team2: &apos;Playoff Pushers&apos;, score1: 115.4, score2: 89.6, completed: false },
    ];

    const handleSeasonAction = (action: SeasonAction) => {
}
        setShowConfirmAction(action);
    };

    const confirmSeasonAction = () => {
}
        if (!showConfirmAction) return;

        switch (showConfirmAction.type) {
}
            case &apos;ADVANCE_WEEK&apos;:
                dispatch({ 
}
                    type: &apos;ADVANCE_WEEK&apos;, 
                    payload: { leagueId: league.id, currentWeek: seasonInfo.currentWeek + 1 } 
                });
                dispatch({ 
}
                    type: &apos;ADD_NOTIFICATION&apos;, 
                    payload: { message: `Advanced to Week ${seasonInfo.currentWeek + 1}`, type: &apos;SYSTEM&apos; } 
                });
                break;
            case &apos;RESET_WEEK&apos;:
                dispatch({ 
}
                    type: &apos;RESET_WEEK&apos;, 
                    payload: { leagueId: league.id, week: seasonInfo.currentWeek } 
                });
                break;
            case &apos;END_SEASON&apos;:
                dispatch({ 
}
                    type: &apos;END_SEASON&apos;, 
                    payload: { leagueId: league.id } 
                });
                break;
            case &apos;FORCE_SYNC&apos;:
                dispatch({ 
}
                    type: &apos;FORCE_DATA_SYNC&apos;, 
                    payload: { leagueId: league.id } 
                });
                break;

        setShowConfirmAction(null);
    };

    const handleScoreAdjustment = () => {
}
        if (!scoreAdjustment.teamId || !scoreAdjustment.reason) return;

        dispatch({
}
            type: &apos;MANUAL_SCORE_ADJUSTMENT&apos;,
            payload: {
}
                leagueId: league.id,
                week: seasonInfo.currentWeek,
                teamId: scoreAdjustment.teamId,
                adjustment: scoreAdjustment.adjustment,
                reason: scoreAdjustment.reason

        });

        dispatch({
}
            type: &apos;ADD_AUDIT_LOG&apos;,
            payload: {
}
                action: &apos;Manual Score Adjustment&apos;,
                details: `${scoreAdjustment.adjustment} points to team ${scoreAdjustment.teamId}: ${scoreAdjustment.reason}`,
                commissioner: &apos;Current User&apos;

        });

        setScoreAdjustment({ teamId: &apos;&apos;, adjustment: 0, reason: &apos;&apos; });
        setManualScoreMode(false);
    };

    const getSeasonPhase = () => {
}
        if (seasonInfo.currentWeek <= seasonInfo.regularSeasonWeeks) return &apos;Regular Season&apos;;
        if (seasonInfo.currentWeek <= seasonInfo.regularSeasonWeeks + seasonInfo.playoffWeeks) return &apos;Playoffs&apos;;
        return &apos;Championship&apos;;
    };

    const getWeekProgress = () => {
}
        return (seasonInfo.currentWeek / seasonInfo.totalWeeks) * 100;
    };

    return (
        <Widget title="Season Management" icon={<CalendarIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />}>
            <div className="p-4 space-y-6 sm:px-4 md:px-6 lg:px-8">
                {/* Season Overview */}
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-4 rounded-lg sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-3 sm:px-4 md:px-6 lg:px-8">
                        <h3 className="text-lg font-semibold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                            2024 Season - {getSeasonPhase()}
                        </h3>
                        <div className="text-right sm:px-4 md:px-6 lg:px-8">
                            <div className="text-2xl font-bold text-blue-400 sm:px-4 md:px-6 lg:px-8">Week {seasonInfo.currentWeek}</div>
                            <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">of {seasonInfo.totalWeeks}</div>
                        </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-3 sm:px-4 md:px-6 lg:px-8">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${getWeekProgress()}%` }}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full sm:px-4 md:px-6 lg:px-8"
                        />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div>
                            <div className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Trade Deadline</div>
                            <div className="font-medium sm:px-4 md:px-6 lg:px-8">{new Date(seasonInfo.tradeDeadline).toLocaleDateString()}</div>
                        </div>
                        <div>
                            <div className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Playoffs Start</div>
                            <div className="font-medium sm:px-4 md:px-6 lg:px-8">{new Date(seasonInfo.playoffStart).toLocaleDateString()}</div>
                        </div>
                        <div>
                            <div className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Waiver Day</div>
                            <div className="font-medium sm:px-4 md:px-6 lg:px-8">{seasonInfo.waiverDay}</div>
                        </div>
                        <div>
                            <div className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Lock Time</div>
                            <div className="font-medium sm:px-4 md:px-6 lg:px-8">{seasonInfo.lockTime}</div>
                        </div>
                    </div>
                </div>

                {/* Week Controls */}
                <div className="border border-[var(--panel-border)] rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
                    <h4 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                        <AdjustmentsIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                        Week Controls
                    </h4>
                    
                    <div className="flex flex-wrap gap-2 sm:px-4 md:px-6 lg:px-8">
                        <button
                            onClick={() => handleSeasonAction({ type: &apos;ADVANCE_WEEK&apos; }}
                            className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm sm:px-4 md:px-6 lg:px-8"
                            disabled={seasonInfo.currentWeek >= seasonInfo.totalWeeks}
                        >
                            <PlayIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                            Advance Week
                        </button>
                        
                        <button
                            onClick={() => handleSeasonAction({ type: &apos;RESET_WEEK&apos; }}
                            className="flex items-center gap-2 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm sm:px-4 md:px-6 lg:px-8"
                        >
                            <RefreshIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                            Reset Week
                        </button>
                        
                        <button
                            onClick={() => handleSeasonAction({ type: &apos;FORCE_SYNC&apos; }}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm sm:px-4 md:px-6 lg:px-8"
                        >
                            <RefreshIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                            Force Sync
                        </button>
                        
                        <button
                            onClick={() => setManualScoreMode(!manualScoreMode)}
                        >
                            ✏️ Manual Scoring
                        </button>
                        
                        <button
                            onClick={() => handleSeasonAction({ type: &apos;END_SEASON&apos; }}
                            className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm sm:px-4 md:px-6 lg:px-8"
                        >
                            <StopIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                            End Season
                        </button>
                    </div>
                </div>

                {/* Current Week Matchups */}
                <div className="border border-[var(--panel-border)] rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
                    <h4 className="font-semibold text-[var(--text-primary)] mb-3 sm:px-4 md:px-6 lg:px-8">
                        Week {seasonInfo.currentWeek} Matchups
                    </h4>
                    
                    <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                        {weeklyMatchups.map((matchup: any) => (
}
                            <div
                                key={matchup.id}
                                className="flex items-center justify-between p-3 bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg sm:px-4 md:px-6 lg:px-8"
                            >
                                <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                                    <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                                        <span className="text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{matchup.team1}</span>
                                        <span className="font-bold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{matchup.score1}</span>
                                    </div>
                                    <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                                        <span className="text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{matchup.team2}</span>
                                        <span className="font-bold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{matchup.score2}</span>
                                    </div>
                                </div>
                                
                                <div className="ml-4 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
}
                                        matchup.completed 
                                            ? &apos;bg-green-500/20 text-green-400&apos; 
                                            : &apos;bg-yellow-500/20 text-yellow-400&apos;
                                    }`}>
                                        {matchup.completed ? &apos;Final&apos; : &apos;In Progress&apos;}
                                    </span>
                                    
                                    <button
                                        onClick={() => setSelectedMatchup(selectedMatchup === matchup.id ? null : matchup.id)}
                                    >
                                        ⋮
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Manual Score Adjustment Modal */}
                <AnimatePresence>
                    {manualScoreMode && (
}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 sm:px-4 md:px-6 lg:px-8"
                            onClick={(e: any) => e.target === e.currentTarget && setManualScoreMode(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg shadow-xl p-6 max-w-md w-full sm:px-4 md:px-6 lg:px-8"
                            >
                                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 sm:px-4 md:px-6 lg:px-8">
                                    Manual Score Adjustment
                                </h3>
                                
                                <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                                            Select Team
                                        </label>
                                        <select
                                            value={scoreAdjustment.teamId}
                                            onChange={(e: any) => setScoreAdjustment(prev => ({ ...prev, teamId: e.target.value }}
                                            className="w-full px-3 py-2 border border-[var(--panel-border)] rounded-lg bg-[var(--panel-bg)] text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8"
                                        >
                                            <option value="">Choose team...</option>
                                            <option value="team1">Alice&apos;s Aces</option>
                                            <option value="team2">Smithtown Stallions</option>
                                            <option value="team3">Thunder Bolts</option>
                                            <option value="team4">Wilson Warriors</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                                            Point Adjustment
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={scoreAdjustment.adjustment}
                                            onChange={(e: any) => setScoreAdjustment(prev => ({ ...prev, adjustment: parseFloat(e.target.value) || 0 }}
                                            className="w-full px-3 py-2 border border-[var(--panel-border)] rounded-lg bg-[var(--panel-bg)] text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8"
                                            placeholder="Enter adjustment (+ or -)"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 sm:px-4 md:px-6 lg:px-8">
//                                             Reason
                                        </label>
                                        <textarea
                                            value={scoreAdjustment.reason}
                                            onChange={(e: any) => setScoreAdjustment(prev => ({ ...prev, reason: e.target.value }}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-[var(--panel-border)] rounded-lg bg-[var(--panel-bg)] text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8"
                                            placeholder="Explain the reason for this adjustment..."
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex gap-3 justify-end mt-6 sm:px-4 md:px-6 lg:px-8">
                                    <button
                                        onClick={() => setManualScoreMode(false)}
                                    >
//                                         Cancel
                                    </button>
                                    <button
                                        onClick={handleScoreAdjustment}
                                        disabled={!scoreAdjustment.teamId || !scoreAdjustment.reason}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 sm:px-4 md:px-6 lg:px-8"
                                     aria-label="Action button">
                                        Apply Adjustment
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Confirmation Modal */}
                <AnimatePresence>
                    {showConfirmAction && (
}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 sm:px-4 md:px-6 lg:px-8"
                            onClick={(e: any) => e.target === e.currentTarget && setShowConfirmAction(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg shadow-xl p-6 max-w-md w-full sm:px-4 md:px-6 lg:px-8"
                            >
                                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 sm:px-4 md:px-6 lg:px-8">
                                    Confirm Season Action
                                </h3>
                                <p className="text-[var(--text-secondary)] mb-6 sm:px-4 md:px-6 lg:px-8">
                                    {showConfirmAction.type === &apos;ADVANCE_WEEK&apos; && `Are you sure you want to advance to Week ${seasonInfo.currentWeek + 1}?`}
                                    {showConfirmAction.type === &apos;RESET_WEEK&apos; && &apos;Are you sure you want to reset the current week? This will clear all scores and lineup locks.&apos;}
                                    {showConfirmAction.type === &apos;END_SEASON&apos; && &apos;Are you sure you want to end the season? This action cannot be undone.&apos;}
                                    {showConfirmAction.type === &apos;FORCE_SYNC&apos; && &apos;Force sync all league data with external sources?&apos;}
                                </p>
                                <div className="flex gap-3 justify-end sm:px-4 md:px-6 lg:px-8">
                                    <button
                                        onClick={() => setShowConfirmAction(null)}
                                    >
//                                         Cancel
                                    </button>
                                    <button
                                        onClick={confirmSeasonAction}
                                        className={`px-4 py-2 text-white rounded-lg ${
}
                                            showConfirmAction.type === &apos;END_SEASON&apos; 
                                                ? &apos;bg-red-600 hover:bg-red-700&apos; 
                                                : &apos;bg-blue-600 hover:bg-blue-700&apos;
                                        }`}
                                     aria-label="Action button">
//                                         Confirm
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Widget>
    );
};

const SeasonManagementWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <SeasonManagement {...props} />
  </ErrorBoundary>
);

export default React.memo(SeasonManagementWithErrorBoundary);
