import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../contexts/AppContext';
import { useLeague } from '../hooks/useLeague';
import ErrorDisplay from '../components/core/ErrorDisplay';
import { 
    TrophyIcon, 
    TargetIcon, 
    DollarSignIcon,
    UsersIcon,
    StarIcon,
    CheckCircleIcon,
    XCircleIcon,
    PlusCircleIcon,
    AwardIcon
} from 'lucide-react';

interface Contest {
    id: string;
    name: string;
    description: string;
    type: 'weekly' | 'season' | 'playoff';
    prize: number;
    participants: string[];
    leader?: {
        teamId: number;
        teamName: string;
        owner: string;
        score: number;
    };
    deadline?: string;
    status: 'active' | 'completed' | 'upcoming';
}

const SeasonContestView: React.FC = () => {
    const { state, dispatch } = useAppState();
    const { league } = useLeague();
    const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newContest, setNewContest] = useState({
        name: '',
        description: '',
        type: 'weekly' as Contest['type'],
        prize: 10
    });

    const isCommissioner = state.user?.id === league?.commissionerId;

    if (!league) {
        return <ErrorDisplay title="Error" message="Could not load league data." onRetry={() => dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' })} />;
    }

    // Mock contest data - in production this would come from the database
    const contests: Contest[] = [
        {
            id: '1',
            name: 'Weekly High Score',
            description: 'Highest scoring team each week wins the pot',
            type: 'weekly',
            prize: 20,
            participants: league.teams.map(t => t.owner.name),
            leader: {
                teamId: 1,
                teamName: 'Thunder Bolts',
                owner: 'Nick Damato',
                score: 156.8
            },
            status: 'active'
        },
        {
            id: '2',
            name: 'Season Long Points',
            description: 'Team with most total points at end of regular season',
            type: 'season',
            prize: 50,
            participants: league.teams.map(t => t.owner.name),
            leader: {
                teamId: 2,
                teamName: 'Storm Chasers',
                owner: 'Jon Kornbeck',
                score: 1234.5
            },
            status: 'active'
        },
        {
            id: '3',
            name: 'Perfect Lineup Challenge',
            description: 'First team to set a perfect optimal lineup wins',
            type: 'season',
            prize: 30,
            participants: ['Nick Damato', 'Jon Kornbeck', 'Cason Minor'],
            status: 'active'
        },
        {
            id: '4',
            name: 'Survivor Pool',
            description: 'Pick one team to win each week, can only use each team once',
            type: 'season',
            prize: 100,
            participants: league.teams.map(t => t.owner.name),
            leader: {
                teamId: 3,
                teamName: 'Lightning Strikes',
                owner: 'Cason Minor',
                score: 8
            },
            status: 'active'
        }
    ];

    const handleCreateContest = () => {
        // Logic to create new contest
        setShowCreateModal(false);
        dispatch({ 
            type: 'ADD_NOTIFICATION', 
            payload: { message: 'Contest created successfully!', type: 'SYSTEM' }
        });
    };

    const handleJoinContest = (_contestId: string) => {
        // Logic to join contest
        dispatch({ 
            type: 'ADD_NOTIFICATION', 
            payload: { message: 'You have joined the contest!', type: 'SYSTEM' }
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
                    onClick={() => dispatch({ type: 'SET_VIEW', payload: 'LEAGUE_HUB' })} 
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
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="glass-button-primary px-4 py-2 flex items-center gap-2"
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
                                {contests.filter(c => c.participants.includes(state.user?.name || '')).length}
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
                        const isParticipating = contest.participants.includes(state.user?.name || '');
                        const isLeading = contest.leader?.owner === state.user?.name;

                        return (
                            <motion.div
                                key={contest.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-pane p-6 hover:ring-2 hover:ring-blue-400/50 transition-all cursor-pointer"
                                onClick={() => setSelectedContest(contest)}
                            >
                                {/* Contest Header */}
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
                                        contest.type === 'weekly' ? 'bg-blue-500/20 text-blue-400' :
                                        contest.type === 'season' ? 'bg-purple-500/20 text-purple-400' :
                                        'bg-yellow-500/20 text-yellow-400'
                                    }`}>
                                        {contest.type.toUpperCase()}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                        contest.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                        contest.status === 'completed' ? 'bg-gray-500/20 text-gray-400' :
                                        'bg-yellow-500/20 text-yellow-400'
                                    }`}>
                                        {contest.status.toUpperCase()}
                                    </span>
                                </div>

                                {/* Current Leader */}
                                {contest.leader && (
                                    <div className="p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg mb-4">
                                        <p className="text-xs text-[var(--text-secondary)] mb-1">Current Leader</p>
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-white">
                                                {contest.leader.teamName}
                                            </span>
                                            <span className="text-yellow-400 font-bold">
                                                {contest.type === 'weekly' ? `${contest.leader.score} pts` : 
                                                 contest.name.includes('Survivor') ? `Week ${contest.leader.score}` :
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
                                        <span className="flex items-center gap-1 text-green-400 text-sm">
                                            <CheckCircleIcon className="w-4 h-4" />
                                            Joined
                                        </span>
                                    ) : (
                                        <button
                                            onClick={(e) => {
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
                                        onChange={(e) => setNewContest(prev => ({ ...prev, name: e.target.value }))}
                                        className="glass-input w-full"
                                        placeholder="e.g., Weekly High Score"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={newContest.description}
                                        onChange={(e) => setNewContest(prev => ({ ...prev, description: e.target.value }))}
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
                                        onChange={(e) => setNewContest(prev => ({ ...prev, type: e.target.value as Contest['type'] }))}
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
                                        onChange={(e) => setNewContest(prev => ({ ...prev, prize: Number(e.target.value) }))}
                                        className="glass-input w-full"
                                        min="0"
                                        step="5"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 glass-button py-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateContest}
                                    className="flex-1 glass-button-primary py-2"
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
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedContest(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="glass-pane p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{selectedContest.name}</h3>
                                    <p className="text-[var(--text-secondary)] mt-1">{selectedContest.description}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedContest(null)}
                                    className="glass-button p-2"
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
                                    <div
                                        key={participant}
                                        className={`flex items-center justify-between p-3 rounded-lg ${
                                            index === 0 ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20' : 'bg-white/5'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`font-bold ${
                                                index === 0 ? 'text-yellow-400' :
                                                index === 1 ? 'text-gray-300' :
                                                index === 2 ? 'text-orange-400' :
                                                'text-white'
                                            }`}>
                                                #{index + 1}
                                            </span>
                                            <span className="text-white">{participant}</span>
                                        </div>
                                        {index === 0 && selectedContest.leader && (
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