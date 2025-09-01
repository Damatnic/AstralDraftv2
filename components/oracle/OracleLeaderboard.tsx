/**
 * Oracle Leaderboard Component
 * Displays rankings, achievements, and competitive Oracle prediction features
 * Integrates with backend /api/oracle/leaderboard endpoint
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo, useState, useEffect } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { 
}
    TrophyIcon, 
    CrownIcon,
    StarIcon,
    TrendingUpIcon,
//     FilterIcon
} from &apos;lucide-react&apos;;
import { Avatar } from &apos;../ui/Avatar&apos;;
// Remove unused import since we&apos;ll use fetch directly

interface LeaderboardEntry {
}

    id: string;
    username: string;
    display_name: string;
    total_predictions: number;
    total_points: number;
    avg_confidence: number;
    oracle_beats: number;
    correct_predictions: number;
    accuracy_rate: number;
    rank?: number;

    } catch (error) {
}
        console.error(error);
    }interface LeaderboardFilters {
}
    timeframe: &apos;week&apos; | &apos;month&apos; | &apos;season&apos; | &apos;all&apos;;
    season: number;
    week?: number;

}

interface OracleLeaderboardProps {
}
    currentUserId?: string;
    showAchievements?: boolean;
    compact?: boolean;}

const OracleLeaderboard: React.FC<OracleLeaderboardProps> = ({
}
    currentUserId,
    showAchievements = true,
    compact = false
}: any) => {
}
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<LeaderboardFilters>({
}
        timeframe: &apos;season&apos;,
        season: 2024
    });
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    // Fetch leaderboard data from backend API
    const fetchLeaderboard = async () => {
}
        try {
}
            setLoading(true);
            setError(null);

            const params = new URLSearchParams({
}
                timeframe: filters.timeframe,
                season: filters.season.toString(),
                limit: compact ? &apos;10&apos; : &apos;20&apos;
            });

            if (filters.week) {
}
                params.append(&apos;week&apos;, filters.week.toString());

            const response = await fetch(`/api/oracle/leaderboard?${params}`, {
}
                method: &apos;GET&apos;,
                headers: {
}
                    &apos;Accept&apos;: &apos;application/json&apos;,
                    &apos;Content-Type&apos;: &apos;application/json&apos;

            });
            
            if (!response.ok) {
}
                throw new Error(`HTTP ${response?.status}: ${response?.statusText}`);

            const data = await response.json();
            
            if (data.success) {
}
                // Add rank numbers to the data
                const rankedData = data.data.map((entry: LeaderboardEntry, index: number) => ({
}
                    ...entry,
                    rank: index + 1
                }));
                setLeaderboardData(rankedData);
                setLastUpdated(new Date());
            } else {
}
                throw new Error(data.error || &apos;Failed to fetch leaderboard&apos;);
  } finally {
}
            setLoading(false);

    };

    // Generate mock data as fallback
    const generateMockLeaderboardData = (): LeaderboardEntry[] => {
}
        const mockUsers = [
            &apos;OracleSlayer&apos;, &apos;PredictionKing&apos;, &apos;FantasyGuru&apos;, &apos;DataMaster&apos;, &apos;StatNinja&apos;,
            &apos;ChampionMaker&apos;, &apos;WeeklyWinner&apos;, &apos;TrendSpotter&apos;, &apos;AccuracyAce&apos;, &apos;PointHunter&apos;
        ];

        return mockUsers.map((username, index) => {
}
            const totalPredictions = Math.floor(15 + Math.random() * 25);
            const correctPredictions = Math.floor(totalPredictions * (0.5 + Math.random() * 0.4));
            const totalPoints = Math.floor(800 - (index * 50) + Math.random() * 200);
            
            return {
}
                id: `user_${index + 1}`,
                username,
                display_name: username,
                total_predictions: totalPredictions,
                total_points: totalPoints,
                avg_confidence: Math.floor(60 + Math.random() * 30),
                oracle_beats: Math.floor(Math.random() * 8),
                correct_predictions: correctPredictions,
                accuracy_rate: Math.round((correctPredictions / totalPredictions) * 100 * 100) / 100,
                rank: index + 1
            };
        });
    };

    // Auto-refresh leaderboard
    useEffect(() => {
}
        fetchLeaderboard();

        // Refresh every 30 seconds if not compact mode
        if (!compact) {
}
            const interval = setInterval(fetchLeaderboard, 30000);
            return () => clearInterval(interval);
    }
  }, [filters, compact]);

    // Handle filter changes
    const handleFilterChange = (key: keyof LeaderboardFilters, value: any) => {
}
        setFilters(prev => ({
}
            ...prev,
            [key]: value,
            // Reset week when changing timeframe
            ...(key === &apos;timeframe&apos; && value !== &apos;week&apos; ? { week: undefined } : {})
        }));
    };

    // Get rank badge color and icon
    const getRankBadge = (rank: number) => {
}
        if (rank === 1) {
}
            return { color: &apos;text-yellow-400 bg-yellow-400/20&apos;, icon: CrownIcon };
        } else if (rank === 2) {
}
            return { color: &apos;text-gray-300 bg-gray-300/20&apos;, icon: TrophyIcon };
        } else if (rank === 3) {
}
            return { color: &apos;text-amber-600 bg-amber-600/20&apos;, icon: TrophyIcon };
        } else if (rank <= 10) {
}
            return { color: &apos;text-blue-400 bg-blue-400/20&apos;, icon: StarIcon };
        } else {
}
            return { color: &apos;text-gray-500 bg-gray-500/20&apos;, icon: TrendingUpIcon };

    };

    // Get accuracy color class
    const getAccuracyColor = (accuracy: number) => {
}
        if (accuracy >= 75) return &apos;text-green-400&apos;;
        if (accuracy >= 60) return &apos;text-yellow-400&apos;;
        return &apos;text-red-400&apos;;
    };

    // Render filter controls
    const renderFilters = () => (
        <div className="flex flex-wrap gap-2 mb-4 sm:px-4 md:px-6 lg:px-8">
            <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                <FilterIcon className="w-4 h-4 text-gray-400 sm:px-4 md:px-6 lg:px-8" />
                <select
                    value={filters.timeframe}
                    onChange={(e: any) => handleFilterChange(&apos;timeframe&apos;, e.target.value)}
                >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="season">Season</option>
                    <option value="all">All Time</option>
                </select>
            </div>

            {filters.timeframe === &apos;week&apos; && (
}
                <input
                    type="number"
                    placeholder="Week"
                    min="1"
                    max="18"
                    value={filters.week || &apos;&apos;}
                    onChange={(e: any) => handleFilterChange(&apos;week&apos;, parseInt(e.target.value) || undefined)}
                />
            )}

            <select
                value={filters.season}
                onChange={(e: any) => handleFilterChange(&apos;season&apos;, parseInt(e.target.value))}
            >
                <option value={2024}>2024 Season</option>
                <option value={2023}>2023 Season</option>
            </select>
        </div>
    );

    // Render leaderboard entry
    const renderLeaderboardEntry = (entry: LeaderboardEntry, index: number) => {
}
        const isCurrentUser = entry.id === currentUserId;
        const badge = getRankBadge(entry.rank || index + 1);
        const IconComponent = badge.icon;

        return (
            <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg border transition-all ${
}
//                     isCurrentUser 
                        ? &apos;bg-blue-500/20 border-blue-400/50 ring-1 ring-blue-400/30&apos; 
                        : &apos;bg-gray-800/50 border-gray-600/50 hover:bg-gray-700/50&apos;
                }`}
            >
                <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-center space-x-3 sm:px-4 md:px-6 lg:px-8">
                        {/* Rank Badge */}
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${badge.color}`}>
                            <IconComponent className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                        </div>

                        {/* User Info */}
                        <div className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                            <Avatar avatar="🏆" className="w-8 h-8 sm:px-4 md:px-6 lg:px-8" />
                            <div>
                                <div className="font-semibold text-white sm:px-4 md:px-6 lg:px-8">
                                    {entry.display_name || entry.username}
                                    {isCurrentUser && <span className="text-blue-400 text-sm ml-1 sm:px-4 md:px-6 lg:px-8">(You)</span>}
                                </div>
                                <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                    {entry.total_predictions} predictions
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center space-x-4 text-sm sm:px-4 md:px-6 lg:px-8">
                        <div className="text-center sm:px-4 md:px-6 lg:px-8">
                            <div className="font-bold text-white sm:px-4 md:px-6 lg:px-8">{entry.total_points}</div>
                            <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Points</div>
                        </div>
                        
                        <div className="text-center sm:px-4 md:px-6 lg:px-8">
                            <div className={`font-bold ${getAccuracyColor(entry.accuracy_rate)}`}>
                                {entry.accuracy_rate}%
                            </div>
                            <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Accuracy</div>
                        </div>

                        {entry.oracle_beats > 0 && (
}
                            <div className="text-center sm:px-4 md:px-6 lg:px-8">
                                <div className="font-bold text-orange-400 sm:px-4 md:px-6 lg:px-8">{entry.oracle_beats}</div>
                                <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Oracle Beats</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Additional stats for non-compact mode */}
                {!compact && (
}
                    <div className="mt-3 pt-3 border-t border-gray-600/30 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-center justify-between text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
                            <span>Correct: {entry.correct_predictions}/{entry.total_predictions}</span>
                            <span>Avg Confidence: {entry.avg_confidence}%</span>
                        </div>
                    </div>
                )}
            </motion.div>
        );
    };

    // Loading state
    if (loading) {
}
        const skeletonItems = Array.from({ length: compact ? 5 : 10 }, (_, i) => `skeleton-${i}`);
        
        return (
            <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                {skeletonItems.map((skeletonId: any) => (
}
                    <div key={skeletonId} className="bg-gray-800/50 rounded-lg p-4 animate-pulse sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                            <div className="flex items-center space-x-3 sm:px-4 md:px-6 lg:px-8">
                                <div className="w-8 h-8 bg-gray-600 rounded-full sm:px-4 md:px-6 lg:px-8"></div>
                                <div className="space-y-1 sm:px-4 md:px-6 lg:px-8">
                                    <div className="w-24 h-4 bg-gray-600 rounded sm:px-4 md:px-6 lg:px-8"></div>
                                    <div className="w-16 h-3 bg-gray-600 rounded sm:px-4 md:px-6 lg:px-8"></div>
                                </div>
                            </div>
                            <div className="flex space-x-4 sm:px-4 md:px-6 lg:px-8">
                                <div className="w-12 h-4 bg-gray-600 rounded sm:px-4 md:px-6 lg:px-8"></div>
                                <div className="w-12 h-4 bg-gray-600 rounded sm:px-4 md:px-6 lg:px-8"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );

    // Error state
    if (error) {
}
        return (
            <div className="text-center py-8 sm:px-4 md:px-6 lg:px-8">
                <div className="text-red-400 mb-2 sm:px-4 md:px-6 lg:px-8">⚠️ Error loading leaderboard</div>
                <div className="text-gray-400 text-sm mb-4 sm:px-4 md:px-6 lg:px-8">{error}</div>
                <button
                    onClick={fetchLeaderboard}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors sm:px-4 md:px-6 lg:px-8"
                 aria-label="Action button">
                    Try Again
                </button>
            </div>
        );

    // Main render
    
  if (isLoading) {
}
    return (
      <div className="flex justify-center items-center p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 sm:px-4 md:px-6 lg:px-8"></div>
        <span className="ml-2 sm:px-4 md:px-6 lg:px-8">Loading...</span>
      </div>
    );

  return (
        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
            {/* Header with refresh info */}
            <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                    <TrophyIcon className="w-5 h-5 text-yellow-400 sm:px-4 md:px-6 lg:px-8" />
                    Oracle Leaderboard
                </h3>
                <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
                    Updated {lastUpdated.toLocaleTimeString()}
                </div>
            </div>

            {/* Filters */}
            {!compact && renderFilters()}

            {/* Leaderboard */}
            <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                <AnimatePresence>
                    {leaderboardData.map((entry, index) => renderLeaderboardEntry(entry, index))}
                </AnimatePresence>
            </div>

            {/* Empty state */}
            {leaderboardData.length === 0 && !loading && (
}
                <div className="text-center py-8 text-gray-400 sm:px-4 md:px-6 lg:px-8">
                    <TrophyIcon className="w-12 h-12 mx-auto mb-2 text-gray-600 sm:px-4 md:px-6 lg:px-8" />
                    <div>No rankings available for the selected timeframe</div>
                    <div className="text-sm mt-1 sm:px-4 md:px-6 lg:px-8">Make some predictions to see rankings!</div>
                </div>
            )}

            {/* Footer with total count */}
            {!compact && leaderboardData.length > 0 && (
}
                <div className="text-center text-xs text-gray-400 pt-2 border-t border-gray-600/30 sm:px-4 md:px-6 lg:px-8">
                    Showing top {leaderboardData.length} Oracle competitors
                </div>
            )}
        </div>
    );
};

const OracleLeaderboardWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <OracleLeaderboard {...props} />
  </ErrorBoundary>
);

export default React.memo(OracleLeaderboardWithErrorBoundary);
