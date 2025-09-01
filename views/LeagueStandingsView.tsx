

import { useAppState } from &apos;../contexts/AppContext&apos;;
import { Widget } from &apos;../components/ui/Widget&apos;;
import type { Team, League } from &apos;../types&apos;;
import { Avatar } from &apos;../components/ui/Avatar&apos;;
import { useLeague } from &apos;../hooks/useLeague&apos;;
import { calculateStreak } from &apos;../utils/streaks&apos;;
import { FlameIcon } from &apos;../components/icons/FlameIcon&apos;;
import { SnowflakeIcon } from &apos;../components/icons/SnowflakeIcon&apos;;
import { CompareIcon } from &apos;../components/icons/CompareIcon&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { TrendingUpIcon } from &apos;../components/icons/TrendingUpIcon&apos;;

const LeagueStandingsContent: React.FC<{ league: League; myTeamId: number; myUserId: string; dispatch: React.Dispatch<any> }> = ({ league, myTeamId, myUserId, dispatch }: any) => {
}
    const [selectedTeams, setSelectedTeams] = React.useState<Set<number>>(new Set());
    
    const sortedTeams = [...league.teams].sort((a, b) => {
}
        const aWinPct = a.record.wins + a.record.ties * 0.5;
        const bWinPct = b.record.wins + b.record.ties * 0.5;
        if (aWinPct !== bWinPct) {
}
            return bWinPct - aWinPct;

        // Could add points for as a tie-breaker
        return 0;
    });

    const handleSelectTeam = (teamId: number) => {
}
        setSelectedTeams(prev => {
}
            const newSet = new Set(prev);
            if (newSet.has(teamId)) {
}
                newSet.delete(teamId);
            } else {
}
                if (newSet.size < 2) {
}
                    newSet.add(teamId);


            return newSet;
        });
    };

    const handleCompare = () => {
}
        if (selectedTeams.size === 2) {
}
            const [teamAId, teamBId] = Array.from(selectedTeams);
            dispatch({ type: &apos;SET_TEAMS_TO_COMPARE&apos;, payload: [teamAId, teamBId] });

    };

    return (
        <div className="min-h-screen">
            {/* Navigation Header */}
            <div className="nav-header">
                <div className="flex justify-between items-center">
                    <div>
                        <h1>League Standings</h1>
                        <p className="page-subtitle">{league.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;PROJECTED_STANDINGS&apos; })
                            className="btn btn-secondary flex items-center gap-2"
                        >
                            <TrendingUpIcon /> View Projections
                        </button>
                        <AnimatePresence>
                            {selectedTeams.size === 2 && (
}
                                <motion.button
                                    onClick={handleCompare},
                                        animate: { opacity: 1, scale: 1 },
                                        exit: { opacity: 0, scale: 0.8 },
                                    }}
                                >
                                    <CompareIcon /> Compare Teams
                                </motion.button>
                            )}
                        </AnimatePresence>
                        <button 
                            onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;TEAM_HUB&apos; }) 
                            className="back-btn"
                        >
                            Back to My Team
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4">
                <main>
                    <Widget title={`Current Standings - Week ${league.currentWeek}`}>
                         <div className="p-2">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-black/10">
                                    <tr>
                                        <th className="p-3 w-12"></th>
                                        <th className="p-3">Rank</th>
                                        <th className="p-3">Team</th>
                                        <th className="p-3 text-center">W</th>
                                        <th className="p-3 text-center">L</th>
                                        <th className="p-3 text-center">T</th>
                                        <th className="p-3 text-center">Streak</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedTeams.map((team, i) => {
}
                                        const streak = calculateStreak(team.id, league.schedule, league.currentWeek);
                                        const isSelected = selectedTeams.has(team.id);
                                        return (
                                            <tr key={team.id} className={`border-t border-white/5 ${team.id === myTeamId ? &apos;bg-cyan-500/10&apos; : &apos;&apos;} ${isSelected ? &apos;bg-cyan-500/20&apos; : &apos;&apos;}`}>
                                                <td className="p-3 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => handleSelectTeam(team.id)}
                                                        className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-600 cursor-pointer disabled:cursor-not-allowed"
                                                    />
                                                </td>
                                                <td className="p-3 font-bold text-cyan-400">{i + 1}</td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar avatar={team.avatar} className="w-8 h-8 text-xl rounded-md" />
                                                        <div>
                                                            <button 
                                                                onClick={() => {
}
                                                                    if (team.owner.id === myUserId) {
}
                                                                        dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;PROFILE&apos; }
                                                                    } else {
}
                                                                        dispatch({ type: &apos;SET_MANAGER_PROFILE&apos;, payload: team.owner.id });

                                                                }}
                                                                className="font-semibold text-white text-left hover:underline"
                                                            >
                                                                {team.name}
                                                            </button>
                                                            <p className="text-xs text-secondary">{team.owner.name}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-3 font-mono text-center">{team.record.wins}</td>
                                                <td className="p-3 font-mono text-center">{team.record.losses}</td>
                                                <td className="p-3 font-mono text-center">{team.record.ties}</td>
                                                <td className="p-3 font-mono text-center">
                                                    {streak ? (
}
                                                        <span className={`flex items-center justify-center gap-1 ${streak.type === &apos;W&apos; ? &apos;text-orange-400&apos; : &apos;text-blue-400&apos;}`}>
                                                            {streak.type === &apos;W&apos; ? <FlameIcon /> : <SnowflakeIcon />}
                                                            {streak.count}
                                                        </span>
                                                    ) : &apos;-&apos;}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Widget>
                </main>
            </div>
        </div>
    );
};

const LeagueStandingsView: React.FC = () => {
}
    const { state, dispatch } = useAppState();
    const { league, myTeam } = useLeague();
    
    return (
        <div className="w-full h-full">
            {!league || !myTeam || !state.user ? (
}
                <div className="p-8 text-center w-full h-full flex flex-col items-center justify-center">
                    <p>Select a league to view standings.</p>
                     <button onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;DASHBOARD&apos; }) className="mt-4 px-4 py-2 bg-cyan-500 rounded">
                        Back to Dashboard
                    </button>
                </div>
            ) : (
                <LeagueStandingsContent league={league} myTeamId={myTeam.id} myUserId={state.user.id} dispatch={dispatch} />
            )}
        </div>
    );
};

export default LeagueStandingsView;
