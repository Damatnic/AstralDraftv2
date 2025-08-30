/**
 * Player Comparison Tab
 * Side-by-side player analysis and comparison tools
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Widget } from '../ui/Widget';
import { Avatar } from '../ui/Avatar';
import { Player, League } from '../../types';
import { CompareIcon } from '../icons/CompareIcon';
import { SearchIcon } from '../icons/SearchIcon';
import { TrendingUpIcon } from '../icons/TrendingUpIcon';
import { TrendingDownIcon } from '../icons/TrendingDownIcon';
import { BarChartIcon } from '../icons/BarChartIcon';
import { useAppState } from '../../contexts/AppContext';

interface PlayerComparisonTabProps {
    player: Player;
    league: League;
    dispatch: React.Dispatch<any>;
}

interface ComparisonMetric {
    label: string;
    player1Value: number;
    player2Value: number;
    format: 'number' | 'decimal' | 'percentage';
    higherIsBetter: boolean;
}

const PlayerComparisonTab: React.FC<PlayerComparisonTabProps> = ({
    player,
    league,
    dispatch
}: any) => {
    const { state } = useAppState();
    const [comparePlayer, setComparePlayer] = React.useState<Player | null>(null);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [showPlayerSearch, setShowPlayerSearch] = React.useState(false);

    // Get all players in the same position
    const availablePlayers = React.useMemo(() => {
        return league.allPlayers.filter((p: any) => 
            p.position === player.position && 
            p.id !== player.id &&
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [league.allPlayers, player.position, player.id, searchQuery]);

    // Helper functions with proper type safety
    const getSafeValue = (value: number | undefined, fallback: number = 0): number => {
        return typeof value === 'number' && !isNaN(value) ? value : fallback;
    };

    const getTierDisplay = (tier: number | undefined): { text: string; color: string } => {
        const safeTier = getSafeValue(tier, 10);
        if (safeTier <= 1) return { text: 'Elite', color: 'text-yellow-400' };
        if (safeTier <= 3) return { text: 'Tier 1', color: 'text-green-400' };
        if (safeTier <= 6) return { text: 'Tier 2', color: 'text-blue-400' };
        if (safeTier <= 10) return { text: 'Tier 3', color: 'text-orange-400' };
        return { text: 'Deep', color: 'text-gray-400' };
    };

    const formatValue = (value: number, format: string): string => {
        switch (format) {
            case 'decimal':
                return value.toFixed(1);
            case 'percentage':
                return `${(value * 100).toFixed(1)}%`;
            case 'number':
            default:
                return Math.round(value).toString();
        }
    };

    const getComparisonColor = (player1Value: number, player2Value: number, higherIsBetter: boolean): string => {
        if (player1Value === player2Value) return 'text-gray-400';
        
        const isPlayer1Better = higherIsBetter ? player1Value > player2Value : player1Value < player2Value;
        return isPlayer1Better ? 'text-green-400' : 'text-red-400';
    };

    // Create comparison metrics with proper type safety
    const getComparisonMetrics = (): ComparisonMetric[] => {
        if (!comparePlayer) return [];

        const metrics: ComparisonMetric[] = [
            {
                label: 'Overall Rank',
                player1Value: getSafeValue(player.rank, 999),
                player2Value: getSafeValue(comparePlayer.rank, 999),
                format: 'number',
                higherIsBetter: false
            },
            {
                label: 'ADP',
                player1Value: getSafeValue(player.adp, 999),
                player2Value: getSafeValue(comparePlayer.adp, 999),
                format: 'decimal',
                higherIsBetter: false
            },
            {
                label: 'Age',
                player1Value: getSafeValue(player.age, 25),
                player2Value: getSafeValue(comparePlayer.age, 25),
                format: 'number',
                higherIsBetter: false
            },
            {
                label: 'Projected Points',
                player1Value: getSafeValue(player.stats?.projection, 0),
                player2Value: getSafeValue(comparePlayer.stats?.projection, 0),
                format: 'decimal',
                higherIsBetter: true
            },
            {
                label: 'VORP',
                player1Value: getSafeValue(player.stats?.vorp, 0),
                player2Value: getSafeValue(comparePlayer.stats?.vorp, 0),
                format: 'decimal',
                higherIsBetter: true
            }
        ];

        // Add position-specific metrics
        if (player.position === 'QB') {
            metrics.push(
                {
                    label: 'Pass Yards',
                    player1Value: getSafeValue(player.stats?.passingYards, 0),
                    player2Value: getSafeValue(comparePlayer.stats?.passingYards, 0),
                    format: 'number',
                    higherIsBetter: true
                },
                {
                    label: 'Pass TDs',
                    player1Value: getSafeValue(player.stats?.passingTouchdowns, 0),
                    player2Value: getSafeValue(comparePlayer.stats?.passingTouchdowns, 0),
                    format: 'number',
                    higherIsBetter: true
                }
            );
        } else if (player.position === 'RB') {
            metrics.push(
                {
                    label: 'Rush Yards',
                    player1Value: getSafeValue(player.stats?.rushingYards, 0),
                    player2Value: getSafeValue(comparePlayer.stats?.rushingYards, 0),
                    format: 'number',
                    higherIsBetter: true
                },
                {
                    label: 'Rush TDs',
                    player1Value: getSafeValue(player.stats?.rushingTouchdowns, 0),
                    player2Value: getSafeValue(comparePlayer.stats?.rushingTouchdowns, 0),
                    format: 'number',
                    higherIsBetter: true
                }
            );
        } else if (player.position === 'WR' || player.position === 'TE') {
            metrics.push(
                {
                    label: 'Receptions',
                    player1Value: getSafeValue(player.stats?.receptions, 0),
                    player2Value: getSafeValue(comparePlayer.stats?.receptions, 0),
                    format: 'number',
                    higherIsBetter: true
                },
                {
                    label: 'Rec Yards',
                    player1Value: getSafeValue(player.stats?.receivingYards, 0),
                    player2Value: getSafeValue(comparePlayer.stats?.receivingYards, 0),
                    format: 'number',
                    higherIsBetter: true
                }
            );
        }

        return metrics;
    };

    const comparisonMetrics = getComparisonMetrics();

    const handlePlayerSelect = (selectedPlayer: Player) => {
        setComparePlayer(selectedPlayer);
        setShowPlayerSearch(false);
        setSearchQuery('');
    };

    const clearComparison = () => {
        setComparePlayer(null);
    };

    // Calculate ADP difference with proper safety
    const adpDifference = React.useMemo(() => {
        if (!comparePlayer) return null;
        
        const playerAdp = getSafeValue(player.adp, 999);
        const compareAdp = getSafeValue(comparePlayer.adp, 999);
        
        return playerAdp - compareAdp;
    }, [player.adp, comparePlayer?.adp]);

    return (
        <div className="space-y-6">
            {/* Comparison Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <CompareIcon className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-medium text-[var(--text-primary)]">
                        Player Comparison
                    </h3>
                </div>
                
                {comparePlayer && (
                    <button
                        onClick={clearComparison}
                        className="text-sm text-red-400 hover:text-red-300 transition-colors"
                    >
                        Clear Comparison
                    </button>
                )}
            </div>

            {/* Player Selection */}
            {!comparePlayer ? (
                <Widget title="Select Player to Compare">
                    <div className="text-center py-8">
                        <CompareIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                            Compare {player.name}
                        </h4>
                        <p className="text-[var(--text-secondary)] mb-6">
                            Select another {player.position} to compare stats and projections
                        </p>
                        
                        <button
                            onClick={() => setShowPlayerSearch(true)}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                        >
                            Choose Player to Compare
                        </button>
                    </div>
                </Widget>
            ) : (
                <>
                    {/* Player Headers */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Current Player */}
                        <Widget title={player.name}>
                            <div className="text-center p-4">
                                <Avatar 
                                    avatar={state.playerAvatars[player.id] || '🏈'}
                                    className="mx-auto mb-3 w-16 h-16 text-4xl rounded-full"
                                />
                                <h4 className="font-semibold text-[var(--text-primary)]">
                                    {player.name}
                                </h4>
                                <div className="flex items-center justify-center gap-2 text-sm text-[var(--text-secondary)] mt-1">
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
                            <div className="text-center p-4">
                                <Avatar 
                                    avatar={state.playerAvatars[comparePlayer.id] || '🏈'}
                                    className="mx-auto mb-3 w-16 h-16 text-4xl rounded-full"
                                />
                                <h4 className="font-semibold text-[var(--text-primary)]">
                                    {comparePlayer.name}
                                </h4>
                                <div className="flex items-center justify-center gap-2 text-sm text-[var(--text-secondary)] mt-1">
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
                        <Widget title="ADP Analysis">
                            <div className="text-center py-4">
                                {adpDifference > 0 ? (
                                    <div className="text-green-400">
                                        <TrendingUpIcon className="w-6 h-6 mx-auto mb-2" />
                                        <p className="font-medium">
                                            {player.name} is drafted {Math.abs(adpDifference).toFixed(1)} spots later
                                        </p>
                                        <p className="text-sm text-[var(--text-secondary)]">
                                            Potentially better value
                                        </p>
                                    </div>
                                ) : adpDifference < 0 ? (
                                    <div className="text-red-400">
                                        <TrendingDownIcon className="w-6 h-6 mx-auto mb-2" />
                                        <p className="font-medium">
                                            {player.name} is drafted {Math.abs(adpDifference).toFixed(1)} spots earlier
                                        </p>
                                        <p className="text-sm text-[var(--text-secondary)]">
                                            Higher draft cost
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-gray-400">
                                        <p className="font-medium">Similar ADP</p>
                                    </div>
                                )}
                            </div>
                        </Widget>
                    )}

                    {/* Metrics Comparison */}
                    <Widget title="Statistical Comparison">
                        <div className="space-y-3">
                            {comparisonMetrics.map((metric, index) => (
                                <div key={index} className="flex items-center justify-between py-2 border-b border-[var(--panel-border)] last:border-b-0">
                                    <span className="font-medium text-[var(--text-secondary)]">
                                        {metric.label}
                                    </span>
                                    <div className="flex items-center gap-8">
                                        <div className={`text-right ${getComparisonColor(metric.player1Value, metric.player2Value, metric.higherIsBetter)}`}>
                                            {formatValue(metric.player1Value, metric.format)}
                                        </div>
                                        <div className="w-px h-4 bg-[var(--panel-border)]" />
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
                                <div key={index} className="p-3 bg-[var(--panel-border)]/20 rounded-lg">
                                    <div className="text-sm font-medium text-[var(--text-secondary)] mb-2">
                                        {metric.label}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <div className="h-2 bg-[var(--panel-border)] rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-blue-400 transition-all duration-300"
                                                    style={{
                                                        width: `${Math.max(10, (metric.player1Value / Math.max(metric.player1Value, metric.player2Value, 1)) * 100)}%`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <span className="text-xs font-medium w-12 text-right">
                                            {formatValue(metric.player1Value, metric.format)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex-1">
                                            <div className="h-2 bg-[var(--panel-border)] rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-orange-400 transition-all duration-300"
                                                    style={{
                                                        width: `${Math.max(10, (metric.player2Value / Math.max(metric.player1Value, metric.player2Value, 1)) * 100)}%`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <span className="text-xs font-medium w-12 text-right">
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
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg max-w-md w-full max-h-[80vh] flex flex-col"
                        >
                            <div className="p-4 border-b border-[var(--panel-border)]">
                                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                                    Select {player.position} to Compare
                                </h3>
                                <div className="relative">
                                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] w-4 h-4" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e: any) => setSearchQuery(e.target.value)}
                                        placeholder="Search players..."
                                        className="w-full pl-10 pr-4 py-2 bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-blue-400"
                                        autoFocus
                                    />
                                </div>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-96">
                                {availablePlayers.map((p: any) => (
                                    <button
                                        key={p.id}
                                        onClick={() => handlePlayerSelect(p)}
                                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--panel-border)]/50 transition-colors text-left"
                                    >
                                        <Avatar avatar={state.playerAvatars[p.id] || '⚡'} className="w-10 h-10 text-2xl rounded-full" />
                                        <div className="flex-1">
                                            <div className="font-medium text-[var(--text-primary)]">
                                                {p.name}
                                            </div>
                                            <div className="text-sm text-[var(--text-secondary)]">
                                                {p.team} • Rank #{p.rank || 'N/A'} • ADP {p.adp?.toFixed(1) || 'N/A'}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                                
                                {availablePlayers.length === 0 && (
                                    <div className="text-center py-8 text-[var(--text-secondary)]">
                                        {searchQuery ? 'No players found' : `No other ${player.position}s available`}
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-4 border-t border-[var(--panel-border)]">
                                <button
                                    onClick={() => setShowPlayerSearch(false)}
                                    className="w-full px-4 py-2 border border-[var(--panel-border)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--panel-border)]/50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PlayerComparisonTab;