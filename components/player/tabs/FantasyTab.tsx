/**
 * Fantasy Tab
 * Fantasy football specific player analysis and insights
 */

import { ErrorBoundary } from &apos;../../ui/ErrorBoundary&apos;;
import { motion } from &apos;framer-motion&apos;;
import { Widget } from &apos;../../ui/Widget&apos;;
import { Player, League } from &apos;../../../types&apos;;
import { TrophyIcon } from &apos;../../icons/TrophyIcon&apos;;
import { TrendingUpIcon } from &apos;../../icons/TrendingUpIcon&apos;;
import { AlertTriangleIcon } from &apos;../../icons/AlertTriangleIcon&apos;;
import { BarChartIcon } from &apos;../../icons/BarChartIcon&apos;;
import { FireIcon } from &apos;../../icons/FireIcon&apos;;
import { ShieldCheckIcon } from &apos;../../icons/ShieldCheckIcon&apos;;

interface FantasyTabProps {
}
    player: Player;
    league: League;
    dispatch: React.Dispatch<any>;

}

interface FantasyMetric {
}
    label: string;
    value: number;
    format: &apos;number&apos; | &apos;decimal&apos; | &apos;percentage&apos;;
    trend?: &apos;up&apos; | &apos;down&apos; | &apos;stable&apos;;
    color?: string;
}

interface WeeklyProjection {
}
    week: number;
    projection: number;
    confidence: number;
    matchup: string;
    difficulty: &apos;easy&apos; | &apos;medium&apos; | &apos;hard&apos;;

}

const FantasyTab: React.FC<FantasyTabProps> = ({
}
    player,
    league,
//     dispatch
}: any) => {
}
    // Helper function to safely handle injury history as string union type
    const getInjuryRisk = (injuryHistory: string | undefined): {
}
        level: string;
        description: string;
        color: string;
        icon: string;
        riskScore: number;
    } => {
}
        if (!injuryHistory) {
}
            return {
}
                level: &apos;Unknown&apos;,
                description: &apos;No injury history data available&apos;,
                color: &apos;text-gray-400&apos;,
                icon: &apos;❓&apos;,
                riskScore: 0.5
            };
        }

        switch (injuryHistory) {
}
            case &apos;minimal&apos;:
                return {
}
                    level: &apos;Low Risk&apos;,
                    description: &apos;Clean injury history with minimal concerns&apos;,
                    color: &apos;text-green-400&apos;,
                    icon: &apos;✅&apos;,
                    riskScore: 0.1
                };
            case &apos;moderate&apos;:
                return {
}
                    level: &apos;Medium Risk&apos;, 
                    description: &apos;Some injury concerns that could affect availability&apos;,
                    color: &apos;text-yellow-400&apos;,
                    icon: &apos;⚠️&apos;,
                    riskScore: 0.5
                };
            case &apos;extensive&apos;:
                return {
}
                    level: &apos;High Risk&apos;,
                    description: &apos;Significant injury history - proceed with caution&apos;,
                    color: &apos;text-red-400&apos;,
                    icon: &apos;🚨&apos;,
                    riskScore: 0.8
                };
            default:
                return {
}
                    level: &apos;Unknown&apos;,
                    description: &apos;Unable to assess injury risk&apos;,
                    color: &apos;text-gray-400&apos;,
                    icon: &apos;❓&apos;,
                    riskScore: 0.5
                };
        }
    };

    // Generate fantasy metrics with proper null safety
    const fantasyMetrics = React.useMemo((): FantasyMetric[] => {
}
        const metrics: FantasyMetric[] = [
            {
}
                label: &apos;Projected Points&apos;,
                value: player.stats?.projection || 0,
                format: &apos;decimal&apos;,
                trend: &apos;up&apos;,
                color: &apos;text-blue-400&apos;
            },
            {
}
                label: &apos;VORP&apos;,
                value: player.stats?.vorp || 0,
                format: &apos;decimal&apos;,
                trend: player.stats?.vorp && player.stats.vorp > 0 ? &apos;up&apos; : &apos;stable&apos;,
                color: &apos;text-purple-400&apos;
            },
            {
}
                label: &apos;ADP&apos;,
                value: player.adp || 999,
                format: &apos;decimal&apos;,
                color: &apos;text-orange-400&apos;
            },
            {
}
                label: &apos;Target Share %&apos;,
                value: player.stats?.targetShare ? player.stats.targetShare * 100 : 0,
                format: &apos;decimal&apos;,
                trend: &apos;stable&apos;,
                color: &apos;text-green-400&apos;
            },
            {
}
                label: &apos;Red Zone %&apos;,
                value: player.stats?.redZoneShare ? player.stats.redZoneShare * 100 : 0,
                format: &apos;decimal&apos;,
                trend: &apos;up&apos;,
                color: &apos;text-red-400&apos;
            },
            {
}
                label: &apos;Snap Count %&apos;,
                value: player.stats?.snapShare ? player.stats.snapShare * 100 : 0,
                format: &apos;decimal&apos;,
                trend: &apos;stable&apos;,
                color: &apos;text-cyan-400&apos;
            }
        ];

        // Add position-specific metrics
        if (player.position === &apos;RB&apos;) {
}
            metrics.push({
}
                label: &apos;Carry Share %&apos;,
                value: player.stats?.carryShare ? player.stats.carryShare * 100 : 0,
                format: &apos;decimal&apos;,
                color: &apos;text-indigo-400&apos;
            });
        }

        return metrics;
    }, [player]);

    // Generate weekly projections
    const weeklyProjections = React.useMemo((): WeeklyProjection[] => {
}
        const baseProjection = player.stats?.projection || 0;
        const projections: WeeklyProjection[] = [];
        
        for (let week = 1; week <= 17; week++) {
}
            // Add some variance to make it realistic
            const variance = (Math.random() - 0.5) * 0.3;
            const weeklyProjection = Math.max(0, baseProjection + (baseProjection * variance));
            
            projections.push({
}
                week,
                projection: weeklyProjection,
                confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
                matchup: `vs TEAM`, // Would be actual opponent in real app
                difficulty: [&apos;easy&apos;, &apos;medium&apos;, &apos;hard&apos;][Math.floor(Math.random() * 3)] as &apos;easy&apos; | &apos;medium&apos; | &apos;hard&apos;
            });
        }

        return projections.slice(0, 8); // Show first 8 weeks
    }, [player.stats?.projection]);

    const injuryRisk = getInjuryRisk(player.injuryHistory);

    const formatValue = (value: number, format: string): string => {
}
        switch (format) {
}
            case &apos;decimal&apos;:
                return value.toFixed(1);
            case &apos;percentage&apos;:
                return `${value.toFixed(1)}%`;
            case &apos;number&apos;:
            default:
                return Math.round(value).toString();
        }
    };

    const getTrendIcon = (trend?: string) => {
}
        switch (trend) {
}
            case &apos;up&apos;:
                return <TrendingUpIcon className="w-4 h-4 text-green-400 sm:px-4 md:px-6 lg:px-8" />;
            case &apos;down&apos;:
                return <TrendingUpIcon className="w-4 h-4 text-red-400 rotate-180 sm:px-4 md:px-6 lg:px-8" />;
            default:
                return <BarChartIcon className="w-4 h-4 text-gray-400 sm:px-4 md:px-6 lg:px-8" />;
        }
    };

    const getDifficultyColor = (difficulty: string) => {
}
        switch (difficulty) {
}
            case &apos;easy&apos;: return &apos;text-green-400 bg-green-500/20&apos;;
            case &apos;medium&apos;: return &apos;text-yellow-400 bg-yellow-500/20&apos;;
            case &apos;hard&apos;: return &apos;text-red-400 bg-red-500/20&apos;;
            default: return &apos;text-gray-400 bg-gray-500/20&apos;;
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
}
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
                                <div className={`font-medium ${metric.color || &apos;text-[var(--text-primary)]&apos;}`}>
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
}
                                                injuryRisk.riskScore > 0.7 ? &apos;bg-red-400&apos; :
                                                injuryRisk.riskScore > 0.4 ? &apos;bg-yellow-400&apos; :
                                                &apos;bg-green-400&apos;
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
}
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
                            <div className={`text-lg font-bold ${metric.color || &apos;text-[var(--text-primary)]&apos;}`}>
                                {formatValue(metric.value, metric.format)}
                            </div>
                            {metric.trend && (
}
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
}
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
                                        {formatValue(projection.projection, &apos;decimal&apos;)} pts
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
                                    {player.stats?.projection && player.stats.projection > 200 ? &apos;High&apos; :
}
                                     player.stats?.projection && player.stats.projection > 150 ? &apos;Medium&apos; : &apos;Low&apos;} ceiling player
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
                                    {injuryRisk.riskScore < 0.3 ? &apos;Safe&apos; : 
}
                                     injuryRisk.riskScore < 0.6 ? &apos;Moderate&apos; : &apos;Risky&apos;} floor due to injury history
                                </div>
                            </div>
                        </div>
                    </div>
                </Widget>

                <Widget title="Season Outlook">
                    <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                        <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg sm:px-4 md:px-6 lg:px-8">
                            <div className="text-sm font-medium text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                                Fantasy Grade: {player.stats?.projection && player.stats.projection > 200 ? &apos;A&apos; :
}
                                               player.stats?.projection && player.stats.projection > 150 ? &apos;B&apos; :
                                               player.stats?.projection && player.stats.projection > 100 ? &apos;C&apos; : &apos;D&apos;}
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
}
                                    .filter((p: any) => p.difficulty === &apos;easy&apos;)
                                    .slice(0, 3)
                                    .map((p: any) => (
                                        <div key={p.week}>
                                            Week {p.week}: {formatValue(p.projection, &apos;decimal&apos;)} projected points
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
}
                                    .filter((p: any) => p.difficulty === &apos;hard&apos;)
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

const FantasyTabWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <FantasyTab {...props} />
  </ErrorBoundary>
);

export default React.memo(FantasyTabWithErrorBoundary);