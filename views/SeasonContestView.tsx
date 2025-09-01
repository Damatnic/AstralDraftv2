import React, { useState } from &apos;react&apos;;
import { motion } from &apos;framer-motion&apos;;
import { useAppState } from &apos;../contexts/AppContext&apos;;
import { useLeague } from &apos;../hooks/useLeague&apos;;
import ErrorDisplay from &apos;../components/core/ErrorDisplay&apos;;
import { 
}
    TrophyIcon, 
    TargetIcon, 
    DollarSignIcon,
    UsersIcon,
    StarIcon,
    CheckCircleIcon,
    XCircleIcon,
    PlusCircleIcon,
//     AwardIcon
} from &apos;lucide-react&apos;;

interface Contest {
}
    id: string;
    name: string;
    description: string;
    type: &apos;weekly&apos; | &apos;season&apos; | &apos;playoff&apos;;
    prize: number;
    participants: string[];
    leader?: {
}
        teamId: number;
        teamName: string;
        owner: string;
        score: number;
    };
    deadline?: string;
    status: &apos;active&apos; | &apos;completed&apos; | &apos;upcoming&apos;;

const SeasonContestView: React.FC = () => {
}
    const { state, dispatch } = useAppState();
    const { league } = useLeague();
    const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newContest, setNewContest] = useState({
}
        name: &apos;&apos;,
        description: &apos;&apos;,
        type: &apos;weekly&apos; as Contest[&apos;type&apos;],
        prize: 10
    });

    const isCommissioner = state.user?.id === league?.commissionerId;

    if (!league) {
}
        return <ErrorDisplay title="Error" message="Could not load league data." onRetry={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;DASHBOARD&apos; })} />;

    // Mock contest data - in production this would come from the database
    const contests: Contest[] = [
        {
}
            id: &apos;1&apos;,
            name: &apos;Weekly High Score&apos;,
            description: &apos;Highest scoring team each week wins the pot&apos;,
            type: &apos;weekly&apos;,
            prize: 20,
            participants: league.teams.map((t: any) => t.owner.name),
            leader: {
}
                teamId: 1,
                teamName: &apos;Thunder Bolts&apos;,
                owner: &apos;Nick Damato&apos;,
                score: 156.8
            },
            status: &apos;active&apos;
        },
        {
}
            id: &apos;2&apos;,
            name: &apos;Season Long Points&apos;,
            description: &apos;Team with most total points at end of regular season&apos;,
            type: &apos;season&apos;,
            prize: 50,
            participants: league.teams.map((t: any) => t.owner.name),
            leader: {
}
                teamId: 2,
                teamName: &apos;Storm Chasers&apos;,
                owner: &apos;Jon Kornbeck&apos;,
                score: 1234.5
            },
            status: &apos;active&apos;
        },
        {
}
            id: &apos;3&apos;,
            name: &apos;Perfect Lineup Challenge&apos;,
            description: &apos;First team to set a perfect optimal lineup wins&apos;,
            type: &apos;season&apos;,
            prize: 30,
            participants: [&apos;Nick Damato&apos;, &apos;Jon Kornbeck&apos;, &apos;Cason Minor&apos;],
            status: &apos;active&apos;
        },
        {
}
            id: &apos;4&apos;,
            name: &apos;Survivor Pool&apos;,
            description: &apos;Pick one team to win each week, can only use each team once&apos;,
            type: &apos;season&apos;,
            prize: 100,
            participants: league.teams.map((t: any) => t.owner.name),
            leader: {
}
                teamId: 3,
                teamName: &apos;Lightning Strikes&apos;,
                owner: &apos;Cason Minor&apos;,
                score: 8
            },
            status: &apos;active&apos;

    ];

    const handleCreateContest = () => {
}
        // Logic to create new contest
        setShowCreateModal(false);
        dispatch({ 
}
            type: &apos;ADD_NOTIFICATION&apos;, 
            payload: { message: &apos;Contest created successfully!&apos;, type: &apos;SYSTEM&apos; }
        });
    };

    const handleJoinContest = (_contestId: string) => {
}
        // Logic to join contest
        dispatch({ 
}
            type: &apos;ADD_NOTIFICATION&apos;, 
            payload: { message: &apos;You have joined the contest!&apos;, type: &apos;SYSTEM&apos; }
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-secondary)]/5 p-4 sm:p-6 lg:p-8">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-wider uppercase text-[var(--text-primary)] flex items-center gap-3">
                        <TrophyIcon className="w-8 h-8 text-yellow-400" />
                        Season Contests
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] tracking-widest">{league.name} Side Bets & Challenges</p>
                </div>
                <button 
                    onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;LEAGUE_HUB&apos; }) 
                    className="glass-button"
                >
                    Back to League Hub
                </button>
            </header>

            <main className="max-w-6xl mx-auto">
                {/* Contest Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-pane p-6 mb-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <AwardIcon className="w-5 h-5 text-blue-400" />
                            Active Contests
                        </h2>
                        {isCommissioner && (
}
                            <button
                                onClick={() => setShowCreateModal(true)}
                            >
                                <PlusCircleIcon className="w-4 h-4" />
                                Create Contest
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                            <div className="text-2xl font-bold text-blue-400">{contests.length}</div>
                            <div className="text-sm text-[var(--text-secondary)]">Active Contests</div>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                            <div className="text-2xl font-bold text-green-400">
                                ${contests.reduce((sum, c) => sum + c.prize, 0)}
                            </div>
                            <div className="text-sm text-[var(--text-secondary)]">Total Prize Pool</div>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                            <div className="text-2xl font-bold text-purple-400">
                                {contests.filter((c: any) => c.participants.includes(state.user?.name || &apos;&apos;)).length}
                            </div>
                            <div className="text-sm text-[var(--text-secondary)]">Your Contests</div>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-400">2</div>
                            <div className="text-sm text-[var(--text-secondary)]">Leading</div>
                        </div>
                    </div>
                </motion.div>

                {/* Contest Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {contests.map((contest, index) => {
}
                        const isParticipating = contest.participants.includes(state.user?.name || &apos;&apos;);
                        const isLeading = contest.leader?.owner === state.user?.name;

                        return (
                            <motion.div
                                key={contest.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-pane p-6 hover:ring-2 hover:ring-blue-400/50 transition-all cursor-pointer"
                                onClick={() => setSelectedContest(contest)}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            {contest.name}
                                            {isLeading && <StarIcon className="w-4 h-4 text-yellow-400" />}
                                        </h3>
                                        <p className="text-sm text-[var(--text-secondary)] mt-1">
                                            {contest.description}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-green-400">${contest.prize}</div>
                                        <div className="text-xs text-[var(--text-secondary)]">Prize</div>
                                    </div>
                                </div>

                                {/* Contest Type Badge */}
                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
}
                                        contest.type === &apos;weekly&apos; ? &apos;bg-blue-500/20 text-blue-400&apos; :
                                        contest.type === &apos;season&apos; ? &apos;bg-purple-500/20 text-purple-400&apos; :
                                        &apos;bg-yellow-500/20 text-yellow-400&apos;
                                    }`}>
                                        {contest.type.toUpperCase()}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
}
                                        contest.status === &apos;active&apos; ? &apos;bg-green-500/20 text-green-400&apos; :
                                        contest.status === &apos;completed&apos; ? &apos;bg-gray-500/20 text-gray-400&apos; :
                                        &apos;bg-yellow-500/20 text-yellow-400&apos;
                                    }`}>
                                        {contest.status.toUpperCase()}
                                    </span>
                                </div>

                                {/* Current Leader */}
                                {contest.leader && (
}
                                    <div className="p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg mb-4">
                                        <p className="text-xs text-[var(--text-secondary)] mb-1">Current Leader</p>
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-white">
                                                {contest.leader.teamName}
                                            </span>
                                            <span className="text-yellow-400 font-bold">
                                                {contest.type === &apos;weekly&apos; ? `${contest.leader.score} pts` : 
                                                 contest.name.includes(&apos;Survivor&apos;) ? `Week ${contest.leader.score}` :
                                                 `${contest.leader.score} pts`}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Participants */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <UsersIcon className="w-4 h-4 text-[var(--text-secondary)]" />
                                        <span className="text-sm text-[var(--text-secondary)]">
                                            {contest.participants.length} participants
                                        </span>
                                    </div>
                                    {isParticipating ? (
}
                                        <span className="flex items-center gap-1 text-green-400 text-sm">
                                            <CheckCircleIcon className="w-4 h-4" />
//                                             Joined
                                        </span>
                                    ) : (
                                        <button
                                            onClick={(e: any) => {
}
                                                e.stopPropagation();
                                                handleJoinContest(contest.id);
                                            }}
                                            className="glass-button px-3 py-1 text-sm"
                                        >
                                            Join Contest
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Create Contest Modal */}
                {showCreateModal && (
}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="glass-pane p-6 max-w-md w-full"
                        >
                            <h3 className="text-xl font-bold text-white mb-4">Create New Contest</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                        Contest Name
                                    </label>
                                    <input
                                        type="text"
                                        value={newContest.name}
                                        onChange={(e: any) => setNewContest(prev => ({ ...prev, name: e.target.value }}
                                        className="glass-input w-full"
                                        placeholder="e.g., Weekly High Score"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
//                                         Description
                                    </label>
                                    <textarea
                                        value={newContest.description}
                                        onChange={(e: any) => setNewContest(prev => ({ ...prev, description: e.target.value }}
                                        className="glass-input w-full h-20"
                                        placeholder="Describe the contest rules..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                        Contest Type
                                    </label>
                                    <select
                                        value={newContest.type}
                                        onChange={(e: any) => setNewContest(prev => ({ ...prev, type: e.target.value as Contest[&apos;type&apos;] }}
                                        className="glass-input w-full"
                                    >
                                        <option value="weekly">Weekly</option>
                                        <option value="season">Season Long</option>
                                        <option value="playoff">Playoff</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                        Prize Amount ($)
                                    </label>
                                    <input
                                        type="number"
                                        value={newContest.prize}
                                        onChange={(e: any) => setNewContest(prev => ({ ...prev, prize: Number(e.target.value) }}
                                        className="glass-input w-full"
                                        min="0"
                                        step="5"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                >
//                                     Cancel
                                </button>
                                <button
                                    onClick={handleCreateContest}
                                    disabled={!newContest.name || !newContest.description}
                                >
                                    Create Contest
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Contest Details Modal */}
                {selectedContest && (
}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedContest(null)}
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="glass-pane p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                            onClick={(e: any) => e.stopPropagation()}
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{selectedContest.name}</h3>
                                    <p className="text-[var(--text-secondary)] mt-1">{selectedContest.description}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedContest(null)}
                                >
                                    <XCircleIcon className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Contest Stats */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="text-center p-3 bg-white/5 rounded-lg">
                                    <DollarSignIcon className="w-6 h-6 text-green-400 mx-auto mb-1" />
                                    <div className="text-xl font-bold text-white">${selectedContest.prize}</div>
                                    <div className="text-xs text-[var(--text-secondary)]">Prize Pool</div>
                                </div>
                                <div className="text-center p-3 bg-white/5 rounded-lg">
                                    <UsersIcon className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                                    <div className="text-xl font-bold text-white">{selectedContest.participants.length}</div>
                                    <div className="text-xs text-[var(--text-secondary)]">Participants</div>
                                </div>
                                <div className="text-center p-3 bg-white/5 rounded-lg">
                                    <TargetIcon className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                                    <div className="text-xl font-bold text-white capitalize">{selectedContest.type}</div>
                                    <div className="text-xs text-[var(--text-secondary)]">Contest Type</div>
                                </div>
                            </div>

                            {/* Leaderboard */}
                            <div className="space-y-2">
                                <h4 className="font-semibold text-white mb-3">Leaderboard</h4>
                                {selectedContest.participants.map((participant, index) => (
}
                                    <div
                                        key={participant}
                                        className={`flex items-center justify-between p-3 rounded-lg ${
}
                                            index === 0 ? &apos;bg-gradient-to-r from-yellow-500/20 to-orange-500/20&apos; : &apos;bg-white/5&apos;
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`font-bold ${
}
                                                index === 0 ? &apos;text-yellow-400&apos; :
                                                index === 1 ? &apos;text-gray-300&apos; :
                                                index === 2 ? &apos;text-orange-400&apos; :
                                                &apos;text-white&apos;
                                            }`}>
                                                #{index + 1}
                                            </span>
                                            <span className="text-white">{participant}</span>
                                        </div>
                                        {index === 0 && selectedContest.leader && (
}
                                            <span className="text-yellow-400 font-bold">
                                                {selectedContest.leader.score} pts
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default SeasonContestView;