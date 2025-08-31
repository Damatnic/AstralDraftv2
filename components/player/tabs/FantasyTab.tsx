/**
 * Fantasy Tab
 * Fantasy football specific player analysis and insights
 */

import { ErrorBoundary } from '../../ui/ErrorBoundary';
import React from 'react';
import { motion } from 'framer-motion';
import { Widget } from '../../ui/Widget';
import { Player, League } from '../../../types';
import { TrophyIcon } from '../../icons/TrophyIcon';
import { TrendingUpIcon } from '../../icons/TrendingUpIcon';
import { AlertTriangleIcon } from '../../icons/AlertTriangleIcon';
import { BarChartIcon } from '../../icons/BarChartIcon';
import { FireIcon } from '../../icons/FireIcon';
import { ShieldCheckIcon } from '../../icons/ShieldCheckIcon';

interface FantasyTabProps {
    player: Player;
    league: League;
    dispatch: React.Dispatch<any>;

}

interface FantasyMetric {
    label: string;
    value: number;
    format: 'number' | 'decimal' | 'percentage';
    trend?: 'up' | 'down' | 'stable';
    color?: string;
}

interface WeeklyProjection {
    week: number;
    projection: number;
    confidence: number;
    matchup: string;
    difficulty: 'easy' | 'medium' | 'hard';

}

const FantasyTab: React.FC<FantasyTabProps> = ({
    player,
    league,
    dispatch
}) => {
    // Helper function to safely handle injury history as string union type
    const getInjuryRisk = (injuryHistory: string | undefined): {
        level: string;
        description: string;
        color: string;
        icon: string;
        riskScore: number;
    } => {
        if (!injuryHistory) {
            return {
                level: 'Unknown',
                description: 'No injury history data available',
                color: 'text-gray-400',
                icon: '❓',
                riskScore: 0.5
            };
        }

        switch (injuryHistory) {
            case 'minimal':
                return {
                    level: 'Low Risk',
                    description: 'Clean injury history with minimal concerns',
                    color: 'text-green-400',
                    icon: '✅',
                    riskScore: 0.1
                };
            case 'moderate':
                return {
                    level: 'Medium Risk', 
                    description: 'Some injury concerns that could affect availability',
                    color: 'text-yellow-400',
                    icon: '⚠️',
                    riskScore: 0.5
                };
            case 'extensive':
                return {
                    level: 'High Risk',
                    description: 'Significant injury history - proceed with caution',
                    color: 'text-red-400',
                    icon: '🚨',
                    riskScore: 0.8
                };
            default:
                return {
                    level: 'Unknown',
                    description: 'Unable to assess injury risk',
                    color: 'text-gray-400',
                    icon: '❓',
                    riskScore: 0.5
                };
        }
    };

    // Generate fantasy metrics with proper null safety
    const fantasyMetrics = React.useMemo((): FantasyMetric[] => {
        const metrics: FantasyMetric[] = [
            {
                label: 'Projected Points',
                value: player.stats?.projection || 0,
                format: 'decimal',
                trend: 'up',
                color: 'text-blue-400'
            },
            {
                label: 'VORP',
                value: player.stats?.vorp || 0,
                format: 'decimal',
                trend: player.stats?.vorp && player.stats.vorp > 0 ? 'up' : 'stable',
                color: 'text-purple-400'
            },
            {
                label: 'ADP',
                value: player.adp || 999,
                format: 'decimal',
                color: 'text-orange-400'
            },
            {
                label: 'Target Share %',
                value: player.stats?.targetShare ? player.stats.targetShare * 100 : 0,
                format: 'decimal',
                trend: 'stable',
                color: 'text-green-400'
            },
            {
                label: 'Red Zone %',
                value: player.stats?.redZoneShare ? player.stats.redZoneShare * 100 : 0,
                format: 'decimal',
                trend: 'up',
                color: 'text-red-400'
            },
            {
                label: 'Snap Count %',
                value: player.stats?.snapShare ? player.stats.snapShare * 100 : 0,
                format: 'decimal',
                trend: 'stable',
                color: 'text-cyan-400'
            }
        ];

        // Add position-specific metrics
        if (player.position === 'RB') {
            metrics.push({
                label: 'Carry Share %',
                value: player.stats?.carryShare ? player.stats.carryShare * 100 : 0,
                format: 'decimal',
                color: 'text-indigo-400'
            });
        }

        return metrics;
    }, [player]);

    // Generate weekly projections
    const weeklyProjections = React.useMemo((): WeeklyProjection[] => {
        const baseProjection = player.stats?.projection || 0;
        const projections: WeeklyProjection[] = [];
        
        for (let week = 1; week <= 17; week++) {
            // Add some variance to make it realistic
            const variance = (Math.random() - 0.5) * 0.3;
            const weeklyProjection = Math.max(0, baseProjection + (baseProjection * variance));
            
            projections.push({
                week,
                projection: weeklyProjection,
                confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
                matchup: `vs TEAM`, // Would be actual opponent in real app
                difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as 'easy' | 'medium' | 'hard'
            });
        }

        return projections.slice(0, 8); // Show first 8 weeks
    }, [player.stats?.projection]);

    const injuryRisk = getInjuryRisk(player.injuryHistory);

    const formatValue = (value: number, format: string): string => {
        switch (format) {
            case 'decimal':
                return value.toFixed(1);
            case 'percentage':
                return `${value.toFixed(1)}%`;
            case 'number':
            default:
                return Math.round(value).toString();
        }
    };

    const getTrendIcon = (trend?: string) => {
        switch (trend) {
            case 'up':
                return <TrendingUpIcon className="w-4 h-4 text-green-400 sm:px-4 md:px-6 lg:px-8" />;
            case 'down':
                return <TrendingUpIcon className="w-4 h-4 text-red-400 rotate-180 sm:px-4 md:px-6 lg:px-8" />;
            default:
                return <BarChartIcon className="w-4 h-4 text-gray-400 sm:px-4 md:px-6 lg:px-8" />;
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'text-green-400 bg-green-500/20';
            case 'medium': return 'text-yellow-400 bg-yellow-500/20';
            case 'hard': return 'text-red-400 bg-red-500/20';
            default: return 'text-gray-400 bg-gray-500/20';
        }
    };

    return (
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            {/* Fantasy Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Key Metrics */}
                <Widget title="Key Fantasy Metrics">
                    <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                        {fantasyMetrics.slice(0, 4).map((metric, index) => (
                            <motion.div
                                key={metric.label}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between py-2 sm:px-4 md:px-6 lg:px-8"
                            >
                                <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                    {getTrendIcon(metric.trend)}
                                    <span className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                        {metric.label}
                                    </span>
                                </div>
                                <div className={`font-medium ${metric.color || 'text-[var(--text-primary)]'}`}>
                                    {formatValue(metric.value, metric.format)}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Widget>

                {/* Injury Risk Assessment */}
                <Widget title="Injury Risk Assessment">
                    <div className="p-4 border border-[var(--panel-border)] rounded-lg sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-start gap-3 sm:px-4 md:px-6 lg:px-8">
                            <span className="text-xl sm:px-4 md:px-6 lg:px-8">{injuryRisk.icon}</span>
                            <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                                <div className={`font-semibold ${injuryRisk.color}`}>
                                    {injuryRisk.level}
                                </div>
                                <p className="text-sm text-[var(--text-secondary)] mt-1 sm:px-4 md:px-6 lg:px-8">
                                    {injuryRisk.description}
                                </p>
                                <div className="mt-3 sm:px-4 md:px-6 lg:px-8">
                                    <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-1 sm:px-4 md:px-6 lg:px-8">
                                        <span>Risk Score</span>
                                        <span>{Math.round(injuryRisk.riskScore * 100)}%</span>
                                    </div>
                                    <div className="h-2 bg-[var(--panel-border)] rounded-full overflow-hidden sm:px-4 md:px-6 lg:px-8">
                                        <div 
                                            className={`h-full transition-all duration-500 ${
                                                injuryRisk.riskScore > 0.7 ? 'bg-red-400' :
                                                injuryRisk.riskScore > 0.4 ? 'bg-yellow-400' :
                                                'bg-green-400'
                                            }`}
                                            style={{ width: `${injuryRisk.riskScore * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Widget>
            </div>

            {/* Advanced Metrics */}
            <Widget title="Advanced Fantasy Metrics">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {fantasyMetrics.map((metric, index) => (
                        <motion.div
                            key={metric.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-4 border border-[var(--panel-border)] rounded-lg text-center sm:px-4 md:px-6 lg:px-8"
                        >
                            <div className="text-xs text-[var(--text-secondary)] mb-1 sm:px-4 md:px-6 lg:px-8">
                                {metric.label}
                            </div>
                            <div className={`text-lg font-bold ${metric.color || 'text-[var(--text-primary)]'}`}>
                                {formatValue(metric.value, metric.format)}
                            </div>
                            {metric.trend && (
                                <div className="mt-1 sm:px-4 md:px-6 lg:px-8">
                                    {getTrendIcon(metric.trend)}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </Widget>

            {/* Weekly Projections */}
            <Widget title="Weekly Projections">
                <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                    {weeklyProjections.map((projection, index) => (
                        <motion.div
                            key={projection.week}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center justify-between p-3 border border-[var(--panel-border)] rounded-lg hover:bg-[var(--panel-border)]/20 transition-colors sm:px-4 md:px-6 lg:px-8"
                        >
                            <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                                <div className="text-sm font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                    Week {projection.week}
                                </div>
                                <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                    {projection.matchup}
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(projection.difficulty)}`}>
                                    {projection.difficulty}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-4 sm:px-4 md:px-6 lg:px-8">
                                <div className="text-right sm:px-4 md:px-6 lg:px-8">
                                    <div className="text-sm font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                        {formatValue(projection.projection, 'decimal')} pts
                                    </div>
                                    <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                        {Math.round(projection.confidence * 100)}% confidence
                                    </div>
                                </div>
                                <div className="w-16 h-2 bg-[var(--panel-border)] rounded-full overflow-hidden sm:px-4 md:px-6 lg:px-8">
                                    <div 
                                        className="h-full bg-blue-400 transition-all duration-300 sm:px-4 md:px-6 lg:px-8"
                                        style={{ width: `${projection.confidence * 100}%` }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Widget>

            {/* Fantasy Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Widget title="Draft Strategy">
                    <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-start gap-3 p-3 border border-[var(--panel-border)] rounded-lg sm:px-4 md:px-6 lg:px-8">
                            <TrophyIcon className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5 sm:px-4 md:px-6 lg:px-8" />
                            <div>
                                <div className="text-sm font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                    Draft Target
                                </div>
                                <div className="text-xs text-[var(--text-secondary)] mt-1 sm:px-4 md:px-6 lg:px-8">
                                    Best value around round {Math.ceil((player.adp || 100) / 12)}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-3 border border-[var(--panel-border)] rounded-lg sm:px-4 md:px-6 lg:px-8">
                            <FireIcon className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5 sm:px-4 md:px-6 lg:px-8" />
                            <div>
                                <div className="text-sm font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                    Upside Potential
                                </div>
                                <div className="text-xs text-[var(--text-secondary)] mt-1 sm:px-4 md:px-6 lg:px-8">
                                    {player.stats?.projection && player.stats.projection > 200 ? 'High' :
                                     player.stats?.projection && player.stats.projection > 150 ? 'Medium' : 'Low'} ceiling player
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 border border-[var(--panel-border)] rounded-lg sm:px-4 md:px-6 lg:px-8">
                            <ShieldCheckIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5 sm:px-4 md:px-6 lg:px-8" />
                            <div>
                                <div className="text-sm font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                    Floor Assessment
                                </div>
                                <div className="text-xs text-[var(--text-secondary)] mt-1 sm:px-4 md:px-6 lg:px-8">
                                    {injuryRisk.riskScore < 0.3 ? 'Safe' : 
                                     injuryRisk.riskScore < 0.6 ? 'Moderate' : 'Risky'} floor due to injury history
                                </div>
                            </div>
                        </div>
                    </div>
                </Widget>

                <Widget title="Season Outlook">
                    <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                        <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg sm:px-4 md:px-6 lg:px-8">
                            <div className="text-sm font-medium text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                                Fantasy Grade: {player.stats?.projection && player.stats.projection > 200 ? 'A' :
                                               player.stats?.projection && player.stats.projection > 150 ? 'B' :
                                               player.stats?.projection && player.stats.projection > 100 ? 'C' : 'D'}
                            </div>
                            <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                Based on projections, injury risk, and team situation
                            </div>
                        </div>
                        
                        <div>
                            <div className="text-sm font-medium text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                                Best Matchup Weeks
                            </div>
                            <div className="text-xs text-[var(--text-secondary)] space-y-1 sm:px-4 md:px-6 lg:px-8">
                                {weeklyProjections
                                    .filter((p: any) => p.difficulty === 'easy')
                                    .slice(0, 3)
                                    .map((p: any) => (
                                        <div key={p.week}>
                                            Week {p.week}: {formatValue(p.projection, 'decimal')} projected points
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                        <div>
                            <div className="text-sm font-medium text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                                Avoid These Weeks
                            </div>
                            <div className="text-xs text-red-400 space-y-1 sm:px-4 md:px-6 lg:px-8">
                                {weeklyProjections
                                    .filter((p: any) => p.difficulty === 'hard')
                                    .slice(0, 2)
                                    .map((p: any) => (
                                        <div key={p.week}>
                                            Week {p.week}: Tough matchup vs {p.matchup}
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </Widget>
            </div>
        </div>
    );
};

const FantasyTabWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <FantasyTab {...props} />
  </ErrorBoundary>
);

export default React.memo(FantasyTabWithErrorBoundary);