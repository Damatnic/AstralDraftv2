/**
 * Mobile Analytics Dashboard
 * Compact analytics view optimized for mobile devices with touch interactions
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { Player, Team } from &apos;../../types&apos;;
import { useMediaQuery } from &apos;../../hooks/useMediaQuery&apos;;
import MobilePullToRefresh from &apos;./MobilePullToRefresh&apos;;
import { 
}
    BarChart3Icon, 
    TrendingUpIcon, 
    TrendingDownIcon,
    UsersIcon,
    TrophyIcon,
    FilterIcon,
    InfoIcon,
//     ZapIcon
} from &apos;lucide-react&apos;;

interface MobileAnalyticsDashboardProps {
}
    team: Team;
    players: Player[];
    leagueStats?: any;
    onRefresh?: () => Promise<void>;
    className?: string;

}

interface MetricCard {
}
    id: string;
    title: string;
    value: string | number;
    change?: number;
    trend?: &apos;up&apos; | &apos;down&apos; | &apos;stable&apos;;
    color: string;
    icon: React.ReactNode;
    description?: string;

interface ChartData {
}
    label: string;
    value: number;
    color: string;

}

const MobileAnalyticsDashboard: React.FC<MobileAnalyticsDashboardProps> = ({
}
    team,
    players,
    leagueStats,
    onRefresh,
    className = &apos;&apos;
}: any) => {
}
    const isMobile = useMediaQuery(&apos;(max-width: 768px)&apos;);
    const [activeTab, setActiveTab] = React.useState<&apos;overview&apos; | &apos;performance&apos; | &apos;trends&apos; | &apos;roster&apos;>(&apos;overview&apos;);
    const [selectedTimeframe, setSelectedTimeframe] = React.useState<&apos;week&apos; | &apos;month&apos; | &apos;season&apos;>(&apos;week&apos;);
    const [showFilters, setShowFilters] = React.useState(false);
    const [expandedCard, setExpandedCard] = React.useState<string | null>(null);

    // Mock analytics data
    const overviewMetrics: MetricCard[] = [
        {
}
            id: &apos;total_points&apos;,
            title: &apos;Total Points&apos;,
            value: &apos;1,247.6&apos;,
            change: 8.2,
            trend: &apos;up&apos;,
            color: &apos;text-blue-400&apos;,
            icon: <TrophyIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />,
            description: &apos;Season total fantasy points&apos;
        },
        {
}
            id: &apos;avg_points&apos;,
            title: &apos;Avg/Week&apos;,
            value: &apos;89.1&apos;,
            change: -2.3,
            trend: &apos;down&apos;,
            color: &apos;text-green-400&apos;,
            icon: <BarChart3Icon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />,
            description: &apos;Average points per week&apos;
        },
        {
}
            id: &apos;league_rank&apos;,
            title: &apos;League Rank&apos;,
            value: &apos;3rd&apos;,
            trend: &apos;stable&apos;,
            color: &apos;text-purple-400&apos;,
            icon: <UsersIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />,
            description: &apos;Current standings position&apos;
        },
        {
}
            id: &apos;weekly_high&apos;,
            title: &apos;Weekly High&apos;,
            value: &apos;156.8&apos;,
            change: 12.5,
            trend: &apos;up&apos;,
            color: &apos;text-yellow-400&apos;,
            icon: <ZapIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />,
            description: &apos;Highest weekly score&apos;

    ];

    const performanceData: ChartData[] = [
        { label: &apos;QB&apos;, value: 89.2, color: &apos;bg-red-400&apos; },
        { label: &apos;RB&apos;, value: 76.5, color: &apos;bg-green-400&apos; },
        { label: &apos;WR&apos;, value: 82.1, color: &apos;bg-blue-400&apos; },
        { label: &apos;TE&apos;, value: 45.3, color: &apos;bg-yellow-400&apos; },
        { label: &apos;K&apos;, value: 32.1, color: &apos;bg-purple-400&apos; },
        { label: &apos;DST&apos;, value: 28.7, color: &apos;bg-gray-400&apos; }
    ];

    const rosterStrengths = [
        { position: &apos;WR&apos;, strength: 92, weakness: false },
        { position: &apos;QB&apos;, strength: 85, weakness: false },
        { position: &apos;RB&apos;, strength: 78, weakness: false },
        { position: &apos;TE&apos;, strength: 45, weakness: true },
        { position: &apos;K&apos;, strength: 62, weakness: false },
        { position: &apos;DST&apos;, strength: 38, weakness: true }
    ];

    const handleRefresh = async () => {
}
    try {
}

        if (onRefresh) {
}
            await onRefresh();
        
    } catch (error) {
}
      console.error(&apos;Error in handleRefresh:&apos;, error);

    } catch (error) {
}
        console.error(error);
    }else {
}
            // Simulate refresh
            await new Promise(resolve => setTimeout(resolve, 1500));

    };

    const formatTrend = (trend?: &apos;up&apos; | &apos;down&apos; | &apos;stable&apos;, change?: number) => {
}
        if (!trend || trend === &apos;stable&apos;) return null;
        
        return (
            <div className={`flex items-center gap-1 ${trend === &apos;up&apos; ? &apos;text-green-400&apos; : &apos;text-red-400&apos;}`}>
                {trend === &apos;up&apos; ? 
}
                    <TrendingUpIcon className="w-3 h-3 sm:px-4 md:px-6 lg:px-8" /> : 
                    <TrendingDownIcon className="w-3 h-3 sm:px-4 md:px-6 lg:px-8" />

                {change && Boolean(change) && (
}
                    <span className="text-xs font-medium sm:px-4 md:px-6 lg:px-8">
                        {Math.abs(change).toFixed(1)}%
                    </span>
                )}
            </div>
        );
    };

    const renderMetricCard = (metric: MetricCard) => {
}
        const isExpanded = expandedCard === metric.id;
        
        return (
            <motion.div
                key={metric.id}
//                 layout
                onClick={() => setExpandedCard(isExpanded ? null : metric.id)}
                className="bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg p-4 cursor-pointer hover:border-blue-400/50 transition-colors sm:px-4 md:px-6 lg:px-8"
            >
                <div className="flex items-start justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                        <div className={metric.color}>
                            {metric.icon}
                        </div>
                        <span className="text-sm font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                            {metric.title}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                        {formatTrend(metric.trend, metric.change)}
                        {metric.description && (
}
                            <InfoIcon className="w-3 h-3 text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8" />
                        )}
                    </div>
                </div>
                
                <div className="text-2xl font-bold text-[var(--text-primary)] mb-1 sm:px-4 md:px-6 lg:px-8">
                    {metric.value}
                </div>
                
                <AnimatePresence>
                    {isExpanded && metric.description && (
}
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: &apos;auto&apos; }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-sm text-[var(--text-secondary)] mt-2 pt-2 border-t border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8"
                        >
                            {metric.description}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        );
    };

    const renderPositionChart = () => (
        <div className="bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
            <h3 className="font-medium text-[var(--text-primary)] mb-4 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                <BarChart3Icon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                Position Performance
            </h3>
            
            <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                {performanceData.map((item, index) => {
}
                    const maxValue = Math.max(...performanceData.map((d: any) => d.value));
                    const percentage = (item.value / maxValue) * 100;
                    
                    return (
                        <div key={item.label} className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                            <div className="w-8 text-sm font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                {item.label}
                            </div>
                            <div className="flex-1 relative sm:px-4 md:px-6 lg:px-8">
                                <div className="h-6 bg-gray-500/20 rounded overflow-hidden sm:px-4 md:px-6 lg:px-8">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`h-full ${item.color}`}
                                    />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white sm:px-4 md:px-6 lg:px-8">
                                    {item.value}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderRosterAnalysis = () => (
        <div className="bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
            <h3 className="font-medium text-[var(--text-primary)] mb-4 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                <UsersIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                Roster Strengths
            </h3>
            
            <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                {rosterStrengths.map((item: any) => (
}
                    <div key={item.position} className="flex items-center justify-between p-2 rounded sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                            <span className="text-sm font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                {item.position}
                            </span>
                            {item.weakness && (
}
                                <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs sm:px-4 md:px-6 lg:px-8">
//                                     Weak
                                </span>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                            <div className="w-16 h-2 bg-gray-500/20 rounded overflow-hidden sm:px-4 md:px-6 lg:px-8">
                                <div
                                    className={`h-full ${item.weakness ? &apos;bg-red-400&apos; : &apos;bg-green-400&apos;}`}
                                    style={{ width: `${item.strength}%` }}
                                />
                            </div>
                            <span className="text-xs text-[var(--text-secondary)] w-8 sm:px-4 md:px-6 lg:px-8">
                                {item.strength}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderTrendsView = () => (
        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
            <div className="bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
                <h3 className="font-medium text-[var(--text-primary)] mb-3 sm:px-4 md:px-6 lg:px-8">Weekly Trends</h3>
                <div className="grid grid-cols-3 gap-4 text-center sm:px-4 md:px-6 lg:px-8">
                    <div>
                        <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Last 3 Weeks</div>
                        <div className="text-lg font-bold text-green-400 sm:px-4 md:px-6 lg:px-8">↗ +12%</div>
                    </div>
                    <div>
                        <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Consistency</div>
                        <div className="text-lg font-bold text-blue-400 sm:px-4 md:px-6 lg:px-8">85%</div>
                    </div>
                    <div>
                        <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Peak Week</div>
                        <div className="text-lg font-bold text-yellow-400 sm:px-4 md:px-6 lg:px-8">Week 7</div>
                    </div>
                </div>
            </div>
            
            <div className="bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
                <h3 className="font-medium text-[var(--text-primary)] mb-3 sm:px-4 md:px-6 lg:px-8">Matchup Difficulty</h3>
                <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                    {[&apos;Week 15&apos;, &apos;Week 16&apos;, &apos;Week 17&apos;].map((week, index) => {
}
                        const getDifficultyColor = (idx: number) => {
}
                            if (idx === 0) return &apos;bg-green-400&apos;;
                            if (idx === 1) return &apos;bg-yellow-400&apos;;
                            return &apos;bg-red-400&apos;;
                        };
                        
                        const getDifficultyLabel = (idx: number) => {
}
                            if (idx === 0) return &apos;Easy&apos;;
                            if (idx === 1) return &apos;Medium&apos;;
                            return &apos;Hard&apos;;
                        };
                        
                        return (
                            <div key={week} className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                                <span className="text-sm text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{week}</span>
                                <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                    <div className={`w-3 h-3 rounded-full ${getDifficultyColor(index)}`} />
                                    <span className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                        {getDifficultyLabel(index)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    if (!isMobile) {
}
        return null; // Desktop analytics should use the full component

    return (
        <div className={`h-full flex flex-col bg-[var(--app-bg)] ${className}`}>
            {/* Header */}
            <div className="flex-shrink-0 bg-[var(--panel-bg)] border-b border-[var(--panel-border)] sticky top-0 z-10 sm:px-4 md:px-6 lg:px-8">
                <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-4 sm:px-4 md:px-6 lg:px-8">
                        <h1 className="text-xl font-bold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">Analytics</h1>
                        <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                            <select
                                value={selectedTimeframe}
                                onChange={(e: any) => setSelectedTimeframe(e.target.value as any)}
                            >
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="season">Season</option>
                            </select>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <FilterIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                            </button>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex sm:px-4 md:px-6 lg:px-8">
                        {[
}
                            { id: &apos;overview&apos;, label: &apos;Overview&apos; },
                            { id: &apos;performance&apos;, label: &apos;Performance&apos; },
                            { id: &apos;trends&apos;, label: &apos;Trends&apos; },
                            { id: &apos;roster&apos;, label: &apos;Roster&apos; }
                        ].map((tab: any) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden sm:px-4 md:px-6 lg:px-8">
                <MobilePullToRefresh onRefresh={handleRefresh}>
                    <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                {activeTab === &apos;overview&apos; && (
}
                                    <div className="grid grid-cols-2 gap-3 sm:px-4 md:px-6 lg:px-8">
                                        {overviewMetrics.map((metric: any) => renderMetricCard(metric))}
                                    </div>
                                )}

                                {activeTab === &apos;performance&apos; && (
}
                                    <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                                        {renderPositionChart()}
                                    </div>
                                )}

                                {activeTab === &apos;trends&apos; && renderTrendsView()}

                                {activeTab === &apos;roster&apos; && (
}
                                    <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                                        {renderRosterAnalysis()}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </MobilePullToRefresh>
            </div>
        </div>
    );
};

const MobileAnalyticsDashboardWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <MobileAnalyticsDashboard {...props} />
  </ErrorBoundary>
);

export default React.memo(MobileAnalyticsDashboardWithErrorBoundary);
