/**
 * Player Comparison Tab
 * Side-by-side player analysis and comparison tools
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { Avatar } from &apos;../ui/Avatar&apos;;
import { Player, League } from &apos;../../types&apos;;
import { CompareIcon } from &apos;../icons/CompareIcon&apos;;
import { SearchIcon } from &apos;../icons/SearchIcon&apos;;
import { TrendingUpIcon } from &apos;../icons/TrendingUpIcon&apos;;
import { TrendingDownIcon } from &apos;../icons/TrendingDownIcon&apos;;
import { BarChartIcon } from &apos;../icons/BarChartIcon&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;

interface PlayerComparisonTabProps {
}
    player: Player;
    league: League;
    dispatch: React.Dispatch<any>;

}

interface ComparisonMetric {
}
    label: string;
    player1Value: number;
    player2Value: number;
    format: &apos;number&apos; | &apos;decimal&apos; | &apos;percentage&apos;;
    higherIsBetter: boolean;}

const PlayerComparisonTab: React.FC<PlayerComparisonTabProps> = ({
}
    player,
    league,
//     dispatch
}: any) => {
}
    const { state } = useAppState();
    const [comparePlayer, setComparePlayer] = React.useState<Player | null>(null);
    const [searchQuery, setSearchQuery] = React.useState(&apos;&apos;);
    const [showPlayerSearch, setShowPlayerSearch] = React.useState(false);

    // Get all players in the same position
    const availablePlayers = React.useMemo(() => {
}
        return league.allPlayers.filter((p: any) => 
            p.position === player.position && 
            p.id !== player.id &&
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [league.allPlayers, player.position, player.id, searchQuery]);

    // Helper functions with proper type safety
    const getSafeValue = (value: number | undefined, fallback: number = 0): number => {
}
        return typeof value === &apos;number&apos; && !isNaN(value) ? value : fallback;
    };

    const getTierDisplay = (tier: number | undefined): { text: string; color: string } => {
}
        const safeTier = getSafeValue(tier, 10);
        if (safeTier <= 1) return { text: &apos;Elite&apos;, color: &apos;text-yellow-400&apos; };
        if (safeTier <= 3) return { text: &apos;Tier 1&apos;, color: &apos;text-green-400&apos; };
        if (safeTier <= 6) return { text: &apos;Tier 2&apos;, color: &apos;text-blue-400&apos; };
        if (safeTier <= 10) return { text: &apos;Tier 3&apos;, color: &apos;text-orange-400&apos; };
        return { text: &apos;Deep&apos;, color: &apos;text-gray-400&apos; };
    };

    const formatValue = (value: number, format: string): string => {
}
        switch (format) {
}
            case &apos;decimal&apos;:
                return value.toFixed(1);
            case &apos;percentage&apos;:
                return `${(value * 100).toFixed(1)}%`;
            case &apos;number&apos;:
            default:
                return Math.round(value).toString();

    };

    const getComparisonColor = (player1Value: number, player2Value: number, higherIsBetter: boolean): string => {
}
        if (player1Value === player2Value) return &apos;text-gray-400&apos;;
        
        const isPlayer1Better = higherIsBetter ? player1Value > player2Value : player1Value < player2Value;
        return isPlayer1Better ? &apos;text-green-400&apos; : &apos;text-red-400&apos;;
    };

    // Create comparison metrics with proper type safety
    const getComparisonMetrics = (): ComparisonMetric[] => {
}
        if (!comparePlayer) return [];

        const metrics: ComparisonMetric[] = [
            {
}
                label: &apos;Overall Rank&apos;,
                player1Value: getSafeValue(player.rank, 999),
                player2Value: getSafeValue(comparePlayer.rank, 999),
                format: &apos;number&apos;,
                higherIsBetter: false
            },
            {
}
                label: &apos;ADP&apos;,
                player1Value: getSafeValue(player.adp, 999),
                player2Value: getSafeValue(comparePlayer.adp, 999),
                format: &apos;decimal&apos;,
                higherIsBetter: false
            },
            {
}
                label: &apos;Age&apos;,
                player1Value: getSafeValue(player.age, 25),
                player2Value: getSafeValue(comparePlayer.age, 25),
                format: &apos;number&apos;,
                higherIsBetter: false
            },
            {
}
                label: &apos;Projected Points&apos;,
                player1Value: getSafeValue(player.stats?.projection, 0),
                player2Value: getSafeValue(comparePlayer.stats?.projection, 0),
                format: &apos;decimal&apos;,
                higherIsBetter: true
            },
            {
}
                label: &apos;VORP&apos;,
                player1Value: getSafeValue(player.stats?.vorp, 0),
                player2Value: getSafeValue(comparePlayer.stats?.vorp, 0),
                format: &apos;decimal&apos;,
                higherIsBetter: true

        ];

        // Add position-specific metrics
        if (player.position === &apos;QB&apos;) {
}
            metrics.push(
                {
}
                    label: &apos;Pass Yards&apos;,
                    player1Value: getSafeValue(player.stats?.passingYards, 0),
                    player2Value: getSafeValue(comparePlayer.stats?.passingYards, 0),
                    format: &apos;number&apos;,
                    higherIsBetter: true
                },
                {
}
                    label: &apos;Pass TDs&apos;,
                    player1Value: getSafeValue(player.stats?.passingTouchdowns, 0),
                    player2Value: getSafeValue(comparePlayer.stats?.passingTouchdowns, 0),
                    format: &apos;number&apos;,
                    higherIsBetter: true

            );
        } else if (player.position === &apos;RB&apos;) {
}
            metrics.push(
                {
}
                    label: &apos;Rush Yards&apos;,
                    player1Value: getSafeValue(player.stats?.rushingYards, 0),
                    player2Value: getSafeValue(comparePlayer.stats?.rushingYards, 0),
                    format: &apos;number&apos;,
                    higherIsBetter: true
                },
                {
}
                    label: &apos;Rush TDs&apos;,
                    player1Value: getSafeValue(player.stats?.rushingTouchdowns, 0),
                    player2Value: getSafeValue(comparePlayer.stats?.rushingTouchdowns, 0),
                    format: &apos;number&apos;,
                    higherIsBetter: true

            );
        } else if (player.position === &apos;WR&apos; || player.position === &apos;TE&apos;) {
}
            metrics.push(
                {
}
                    label: &apos;Receptions&apos;,
                    player1Value: getSafeValue(player.stats?.receptions, 0),
                    player2Value: getSafeValue(comparePlayer.stats?.receptions, 0),
                    format: &apos;number&apos;,
                    higherIsBetter: true
                },
                {
}
                    label: &apos;Rec Yards&apos;,
                    player1Value: getSafeValue(player.stats?.receivingYards, 0),
                    player2Value: getSafeValue(comparePlayer.stats?.receivingYards, 0),
                    format: &apos;number&apos;,
                    higherIsBetter: true

            );

        return metrics;
    };

    const comparisonMetrics = getComparisonMetrics();

    const handlePlayerSelect = (selectedPlayer: Player) => {
}
        setComparePlayer(selectedPlayer);
        setShowPlayerSearch(false);
        setSearchQuery(&apos;&apos;);
    };

    const clearComparison = () => {
}
        setComparePlayer(null);
    };

    // Calculate ADP difference with proper safety
    const adpDifference = React.useMemo(() => {
}
        if (!comparePlayer) return null;
        
        const playerAdp = getSafeValue(player.adp, 999);
        const compareAdp = getSafeValue(comparePlayer.adp, 999);
        
        return playerAdp - compareAdp;
    }, [player.adp, comparePlayer?.adp]);

    return (
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            {/* Comparison Header */}
            <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                    <CompareIcon className="w-5 h-5 text-blue-400 sm:px-4 md:px-6 lg:px-8" />
                    <h3 className="text-lg font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                        Player Comparison
                    </h3>
                </div>
                
                {comparePlayer && (
}
                    <button
                        onClick={clearComparison}
                        className="text-sm text-red-400 hover:text-red-300 transition-colors sm:px-4 md:px-6 lg:px-8"
                     aria-label="Action button">
                        Clear Comparison
                    </button>
                )}
            </div>

            {/* Player Selection */}
            {!comparePlayer ? (
}
                <Widget title="Select Player to Compare">
                    <div className="text-center py-8 sm:px-4 md:px-6 lg:px-8">
                        <CompareIcon className="w-12 h-12 text-gray-400 mx-auto mb-4 sm:px-4 md:px-6 lg:px-8" />
                        <h4 className="text-lg font-medium text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                            Compare {player.name}
                        </h4>
                        <p className="text-[var(--text-secondary)] mb-6 sm:px-4 md:px-6 lg:px-8">
                            Select another {player.position} to compare stats and projections
                        </p>
                        
                        <button
                            onClick={() => setShowPlayerSearch(true)}
                        >
                            Choose Player to Compare
                        </button>
                    </div>
                </Widget>
            ) : (
                <>
                    {/* Player Headers */}
                    <div className="grid grid-cols-2 gap-6 sm:px-4 md:px-6 lg:px-8">
                        {/* Current Player */}
                        <Widget title={player.name}>
                            <div className="text-center p-4 sm:px-4 md:px-6 lg:px-8">
                                <Avatar>
                                    avatar={state.playerAvatars[player.id] || &apos;🏈&apos;}
                                    className="mx-auto mb-3 w-16 h-16 text-4xl rounded-full sm:px-4 md:px-6 lg:px-8"
                                />
                                <h4 className="font-semibold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                    {player.name}
                                </h4>
                                <div className="flex items-center justify-center gap-2 text-sm text-[var(--text-secondary)] mt-1 sm:px-4 md:px-6 lg:px-8">
                                    <span>{player.position}</span>
                                    <span>•</span>
                                    <span>{player.team}</span>
                                </div>
                                <div className={`text-sm font-medium mt-1 ${getTierDisplay(player.tier).color}`}>
                                    {getTierDisplay(player.tier).text}
                                </div>
                            </div>
                        </Widget>

                        {/* Comparison Player */}
                        <Widget title={comparePlayer.name}>
                            <div className="text-center p-4 sm:px-4 md:px-6 lg:px-8">
                                <Avatar>
                                    avatar={state.playerAvatars[comparePlayer.id] || &apos;🏈&apos;}
                                    className="mx-auto mb-3 w-16 h-16 text-4xl rounded-full sm:px-4 md:px-6 lg:px-8"
                                />
                                <h4 className="font-semibold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                    {comparePlayer.name}
                                </h4>
                                <div className="flex items-center justify-center gap-2 text-sm text-[var(--text-secondary)] mt-1 sm:px-4 md:px-6 lg:px-8">
                                    <span>{comparePlayer.position}</span>
                                    <span>•</span>
                                    <span>{comparePlayer.team}</span>
                                </div>
                                <div className={`text-sm font-medium mt-1 ${getTierDisplay(comparePlayer.tier).color}`}>
                                    {getTierDisplay(comparePlayer.tier).text}
                                </div>
                            </div>
                        </Widget>
                    </div>

                    {/* ADP Comparison */}
                    {adpDifference !== null && (
}
                        <Widget title="ADP Analysis">
                            <div className="text-center py-4 sm:px-4 md:px-6 lg:px-8">
                                {adpDifference > 0 ? (
}
                                    <div className="text-green-400 sm:px-4 md:px-6 lg:px-8">
                                        <TrendingUpIcon className="w-6 h-6 mx-auto mb-2 sm:px-4 md:px-6 lg:px-8" />
                                        <p className="font-medium sm:px-4 md:px-6 lg:px-8">
                                            {player.name} is drafted {Math.abs(adpDifference).toFixed(1)} spots later
                                        </p>
                                        <p className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                            Potentially better value
                                        </p>
                                    </div>
                                ) : adpDifference < 0 ? (
                                    <div className="text-red-400 sm:px-4 md:px-6 lg:px-8">
                                        <TrendingDownIcon className="w-6 h-6 mx-auto mb-2 sm:px-4 md:px-6 lg:px-8" />
                                        <p className="font-medium sm:px-4 md:px-6 lg:px-8">
                                            {player.name} is drafted {Math.abs(adpDifference).toFixed(1)} spots earlier
                                        </p>
                                        <p className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                            Higher draft cost
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                        <p className="font-medium sm:px-4 md:px-6 lg:px-8">Similar ADP</p>
                                    </div>
                                )}
                            </div>
                        </Widget>
                    )}

                    {/* Metrics Comparison */}
                    <Widget title="Statistical Comparison">
                        <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                            {comparisonMetrics.map((metric, index) => (
}
                                <div key={index} className="flex items-center justify-between py-2 border-b border-[var(--panel-border)] last:border-b-0 sm:px-4 md:px-6 lg:px-8">
                                    <span className="font-medium text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                        {metric.label}
                                    </span>
                                    <div className="flex items-center gap-8 sm:px-4 md:px-6 lg:px-8">
                                        <div className={`text-right ${getComparisonColor(metric.player1Value, metric.player2Value, metric.higherIsBetter)}`}>
                                            {formatValue(metric.player1Value, metric.format)}
                                        </div>
                                        <div className="w-px h-4 bg-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8" />
                                        <div className={`text-right ${getComparisonColor(metric.player2Value, metric.player1Value, metric.higherIsBetter)}`}>
                                            {formatValue(metric.player2Value, metric.format)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Widget>

                    {/* Visual Comparison Charts */}
                    <Widget title="Performance Visualization">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {comparisonMetrics.slice(0, 6).map((metric, index) => (
}
                                <div key={index} className="p-3 bg-[var(--panel-border)]/20 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                    <div className="text-sm font-medium text-[var(--text-secondary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                                        {metric.label}
                                    </div>
                                    <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                        <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                                            <div className="h-2 bg-[var(--panel-border)] rounded-full overflow-hidden sm:px-4 md:px-6 lg:px-8">
                                                <div 
                                                    className="h-full bg-blue-400 transition-all duration-300 sm:px-4 md:px-6 lg:px-8"
                                                    style={{
}
                                                        width: `${Math.max(10, (metric.player1Value / Math.max(metric.player1Value, metric.player2Value, 1)) * 100)}%`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <span className="text-xs font-medium w-12 text-right sm:px-4 md:px-6 lg:px-8">
                                            {formatValue(metric.player1Value, metric.format)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 sm:px-4 md:px-6 lg:px-8">
                                        <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                                            <div className="h-2 bg-[var(--panel-border)] rounded-full overflow-hidden sm:px-4 md:px-6 lg:px-8">
                                                <div 
                                                    className="h-full bg-orange-400 transition-all duration-300 sm:px-4 md:px-6 lg:px-8"
                                                    style={{
}
                                                        width: `${Math.max(10, (metric.player2Value / Math.max(metric.player1Value, metric.player2Value, 1)) * 100)}%`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <span className="text-xs font-medium w-12 text-right sm:px-4 md:px-6 lg:px-8">
                                            {formatValue(metric.player2Value, metric.format)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Widget>
                </>
            )}

            {/* Player Search Modal */}
            <AnimatePresence>
                {showPlayerSearch && (
}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:px-4 md:px-6 lg:px-8"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg max-w-md w-full max-h-[80vh] flex flex-col sm:px-4 md:px-6 lg:px-8"
                        >
                            <div className="p-4 border-b border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3 sm:px-4 md:px-6 lg:px-8">
                                    Select {player.position} to Compare
                                </h3>
                                <div className="relative sm:px-4 md:px-6 lg:px-8">
                                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e: any) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-blue-400 sm:px-4 md:px-6 lg:px-8"
//                                         autoFocus
                                    />
                                </div>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-96 sm:px-4 md:px-6 lg:px-8">
                                {availablePlayers.map((p: any) => (
}
                                    <button
                                        key={p.id}
                                        onClick={() => handlePlayerSelect(p)}
                                    >
                                        <Avatar avatar={state.playerAvatars[p.id] || &apos;⚡&apos;} className="w-10 h-10 text-2xl rounded-full sm:px-4 md:px-6 lg:px-8" />
                                        <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                                            <div className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                                {p.name}
                                            </div>
                                            <div className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                                {p.team} • Rank #{p.rank || &apos;N/A&apos;} • ADP {p.adp?.toFixed(1) || &apos;N/A&apos;}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                                
                                {availablePlayers.length === 0 && (
}
                                    <div className="text-center py-8 text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                        {searchQuery ? &apos;No players found&apos; : `No other ${player.position}s available`}
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-4 border-t border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                                <button
                                    onClick={() => setShowPlayerSearch(false)}
                                >
//                                     Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const PlayerComparisonTabWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <PlayerComparisonTab {...props} />
  </ErrorBoundary>
);

export default React.memo(PlayerComparisonTabWithErrorBoundary);