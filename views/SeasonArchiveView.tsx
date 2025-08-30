import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../contexts/AppContext';
import { useLeague } from '../hooks/useLeague';
import { Widget } from '../components/ui/Widget';
import ErrorDisplay from '../components/core/ErrorDisplay';
import { 
    ArchiveIcon, 
    TrophyIcon, 
    CalendarIcon,
    UsersIcon,
    AwardIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    StarIcon,
    MedalIcon
} from 'lucide-react';

interface SeasonRecord {
    year: number;
    champion: {
        teamName: string;
        owner: string;
        record: string;
        points: number;
    };
    runnerUp: {
        teamName: string;
        owner: string;
        record: string;
        points: number;
    };
    thirdPlace: {
        teamName: string;
        owner: string;
    };
    regularSeasonChamp: {
        teamName: string;
        owner: string;
        record: string;
    };
    highestScorer: {
        teamName: string;
        owner: string;
        points: number;
        week: number;
    };
    biggestBlowout: {
        winner: string;
        loser: string;
        score: string;
        week: number;
    };
}

const SeasonArchiveView: React.FC = () => {
    const { state, dispatch } = useAppState();
    const { league } = useLeague();
    const [expandedYear, setExpandedYear] = useState<number | null>(null);

    if (!league) {
        return <ErrorDisplay title="Error" message="Could not load league data." onRetry={() => dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' })} />;
    }

    // Mock historical data - in production this would come from the database
    const seasonHistory: SeasonRecord[] = [
        {
            year: 2024,
            champion: {
                teamName: "Thunder Bolts",
                owner: "Nick Damato",
                record: "12-2",
                points: 1856.4
            },
            runnerUp: {
                teamName: "Storm Chasers",
                owner: "Jon Kornbeck",
                record: "10-4",
                points: 1798.2
            },
            thirdPlace: {
                teamName: "Lightning Strikes",
                owner: "Cason Minor"
            },
            regularSeasonChamp: {
                teamName: "Thunder Bolts",
                owner: "Nick Damato",
                record: "12-2"
            },
            highestScorer: {
                teamName: "Gridiron Giants",
                owner: "Brittany Bergrum",
                points: 186.5,
                week: 8
            },
            biggestBlowout: {
                winner: "Thunder Bolts",
                loser: "End Zone Elite",
                score: "165.3 - 78.9",
                week: 11
            }
        },
        {
            year: 2023,
            champion: {
                teamName: "Field Generals",
                owner: "Jack McCaigue",
                record: "11-3",
                points: 1789.3
            },
            runnerUp: {
                teamName: "Red Zone Raiders",
                owner: "Larry McCaigue",
                record: "9-5",
                points: 1745.8
            },
            thirdPlace: {
                teamName: "Victory Vipers",
                owner: "David Jarvey"
            },
            regularSeasonChamp: {
                teamName: "Field Generals",
                owner: "Jack McCaigue",
                record: "11-3"
            },
            highestScorer: {
                teamName: "Touchdown Titans",
                owner: "Kaity Lorbiecki",
                points: 192.8,
                week: 14
            },
            biggestBlowout: {
                winner: "Field Generals",
                loser: "Blitz Brigade",
                score: "178.4 - 82.1",
                week: 6
            }
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-secondary)]/5 p-4 sm:p-6 lg:p-8">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-wider uppercase text-[var(--text-primary)] flex items-center gap-3">
                        <ArchiveIcon className="w-8 h-8" />
                        Season Archive
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] tracking-widest">{league.name} History</p>
                </div>
                <button 
                    onClick={() => dispatch({ type: 'SET_VIEW', payload: 'LEAGUE_HUB' })} 
                    className="glass-button"
                >
                    Back to League Hub
                </button>
            </header>

            <main className="max-w-6xl mx-auto">
                {/* League Stats Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-pane p-6 mb-6"
                >
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <TrophyIcon className="w-5 h-5 text-yellow-400" />
                        All-Time League Statistics
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-400">{seasonHistory.length}</div>
                            <div className="text-sm text-[var(--text-secondary)]">Seasons Played</div>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                            <div className="text-2xl font-bold text-blue-400">192.8</div>
                            <div className="text-sm text-[var(--text-secondary)]">Highest Score</div>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                            <div className="text-2xl font-bold text-green-400">2</div>
                            <div className="text-sm text-[var(--text-secondary)]">Unique Champions</div>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                            <div className="text-2xl font-bold text-purple-400">96.3</div>
                            <div className="text-sm text-[var(--text-secondary)]">Biggest Victory</div>
                        </div>
                    </div>
                </motion.div>

                {/* Season Records */}
                <div className="space-y-4">
                    {seasonHistory.map((season, index) => (
                        <motion.div
                            key={season.year}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-pane overflow-hidden"
                        >
                            {/* Season Header */}
                            <button
                                onClick={() => setExpandedYear(expandedYear === season.year ? null : season.year)}
                                className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-2xl font-bold text-white">{season.year}</div>
                                    <div className="flex items-center gap-2">
                                        <TrophyIcon className="w-5 h-5 text-yellow-400" />
                                        <span className="text-white font-medium">{season.champion.teamName}</span>
                                        <span className="text-[var(--text-secondary)]">({season.champion.owner})</span>
                                    </div>
                                </div>
                                {expandedYear === season.year ? (
                                    <ChevronUpIcon className="w-5 h-5 text-white" />
                                ) : (
                                    <ChevronDownIcon className="w-5 h-5 text-white" />
                                )}
                            </button>

                            {/* Expanded Season Details */}
                            <AnimatePresence>
                                {expandedYear === season.year && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-white/10"
                                    >
                                        <div className="p-6 space-y-6">
                                            {/* Podium */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="text-center p-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
                                                    <TrophyIcon className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                                                    <h3 className="font-bold text-white">Champion</h3>
                                                    <p className="text-lg font-semibold text-white mt-2">{season.champion.teamName}</p>
                                                    <p className="text-sm text-[var(--text-secondary)]">{season.champion.owner}</p>
                                                    <p className="text-sm text-blue-400 mt-1">{season.champion.record}</p>
                                                    <p className="text-sm text-green-400">{season.champion.points} pts</p>
                                                </div>

                                                <div className="text-center p-4 bg-gradient-to-br from-gray-400/20 to-gray-500/20 rounded-lg border border-gray-400/30">
                                                    <MedalIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                    <h3 className="font-bold text-white">Runner-Up</h3>
                                                    <p className="text-lg font-semibold text-white mt-2">{season.runnerUp.teamName}</p>
                                                    <p className="text-sm text-[var(--text-secondary)]">{season.runnerUp.owner}</p>
                                                    <p className="text-sm text-blue-400 mt-1">{season.runnerUp.record}</p>
                                                    <p className="text-sm text-green-400">{season.runnerUp.points} pts</p>
                                                </div>

                                                <div className="text-center p-4 bg-gradient-to-br from-orange-600/20 to-orange-700/20 rounded-lg border border-orange-600/30">
                                                    <AwardIcon className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                                                    <h3 className="font-bold text-white">Third Place</h3>
                                                    <p className="text-lg font-semibold text-white mt-2">{season.thirdPlace.teamName}</p>
                                                    <p className="text-sm text-[var(--text-secondary)]">{season.thirdPlace.owner}</p>
                                                </div>
                                            </div>

                                            {/* Season Highlights */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="p-4 bg-white/5 rounded-lg">
                                                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                                                        <StarIcon className="w-4 h-4 text-yellow-400" />
                                                        Regular Season Champion
                                                    </h4>
                                                    <p className="text-white">{season.regularSeasonChamp.teamName}</p>
                                                    <p className="text-sm text-[var(--text-secondary)]">
                                                        {season.regularSeasonChamp.owner} ({season.regularSeasonChamp.record})
                                                    </p>
                                                </div>

                                                <div className="p-4 bg-white/5 rounded-lg">
                                                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                                                        <StarIcon className="w-4 h-4 text-green-400" />
                                                        Highest Single Week Score
                                                    </h4>
                                                    <p className="text-white">{season.highestScorer.points} points</p>
                                                    <p className="text-sm text-[var(--text-secondary)]">
                                                        {season.highestScorer.teamName} - Week {season.highestScorer.week}
                                                    </p>
                                                </div>

                                                <div className="p-4 bg-white/5 rounded-lg">
                                                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                                                        <StarIcon className="w-4 h-4 text-red-400" />
                                                        Biggest Blowout
                                                    </h4>
                                                    <p className="text-white">{season.biggestBlowout.score}</p>
                                                    <p className="text-sm text-[var(--text-secondary)]">
                                                        {season.biggestBlowout.winner} def. {season.biggestBlowout.loser} - Week {season.biggestBlowout.week}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {/* No History Message */}
                {seasonHistory.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-pane p-8 text-center"
                    >
                        <ArchiveIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">No History Yet</h2>
                        <p className="text-[var(--text-secondary)]">
                            Season archives will appear here after your first completed season.
                        </p>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default SeasonArchiveView;