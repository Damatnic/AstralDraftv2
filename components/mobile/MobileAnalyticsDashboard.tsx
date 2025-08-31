/**
 * Mobile Analytics Dashboard
 * Compact analytics view optimized for mobile devices with touch interactions
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Player, Team } from '../../types';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import MobilePullToRefresh from './MobilePullToRefresh';
import { 
    BarChart3Icon, 
    TrendingUpIcon, 
    TrendingDownIcon,
    UsersIcon,
    TrophyIcon,
    FilterIcon,
    InfoIcon,
    ZapIcon
} from 'lucide-react';

interface MobileAnalyticsDashboardProps {
    team: Team;
    players: Player[];
    leagueStats?: any;
    onRefresh?: () => Promise<void>;
    className?: string;

}

interface MetricCard {
    id: string;
    title: string;
    value: string | number;
    change?: number;
    trend?: 'up' | 'down' | 'stable';
    color: string;
    icon: React.ReactNode;
    description?: string;

interface ChartData {
    label: string;
    value: number;
    color: string;

}

const MobileAnalyticsDashboard: React.FC<MobileAnalyticsDashboardProps> = ({
    team,
    players,
    leagueStats,
    onRefresh,
    className = ''
}) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [activeTab, setActiveTab] = React.useState<'overview' | 'performance' | 'trends' | 'roster'>('overview');
    const [selectedTimeframe, setSelectedTimeframe] = React.useState<'week' | 'month' | 'season'>('week');
    const [showFilters, setShowFilters] = React.useState(false);
    const [expandedCard, setExpandedCard] = React.useState<string | null>(null);

    // Mock analytics data
    const overviewMetrics: MetricCard[] = [
        {
            id: 'total_points',
            title: 'Total Points',
            value: '1,247.6',
            change: 8.2,
            trend: 'up',
            color: 'text-blue-400',
            icon: <TrophyIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />,
            description: 'Season total fantasy points'
        },
        {
            id: 'avg_points',
            title: 'Avg/Week',
            value: '89.1',
            change: -2.3,
            trend: 'down',
            color: 'text-green-400',
            icon: <BarChart3Icon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />,
            description: 'Average points per week'
        },
        {
            id: 'league_rank',
            title: 'League Rank',
            value: '3rd',
            trend: 'stable',
            color: 'text-purple-400',
            icon: <UsersIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />,
            description: 'Current standings position'
        },
        {
            id: 'weekly_high',
            title: 'Weekly High',
            value: '156.8',
            change: 12.5,
            trend: 'up',
            color: 'text-yellow-400',
            icon: <ZapIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />,
            description: 'Highest weekly score'

    ];

    const performanceData: ChartData[] = [
        { label: 'QB', value: 89.2, color: 'bg-red-400' },
        { label: 'RB', value: 76.5, color: 'bg-green-400' },
        { label: 'WR', value: 82.1, color: 'bg-blue-400' },
        { label: 'TE', value: 45.3, color: 'bg-yellow-400' },
        { label: 'K', value: 32.1, color: 'bg-purple-400' },
        { label: 'DST', value: 28.7, color: 'bg-gray-400' }
    ];

    const rosterStrengths = [
        { position: 'WR', strength: 92, weakness: false },
        { position: 'QB', strength: 85, weakness: false },
        { position: 'RB', strength: 78, weakness: false },
        { position: 'TE', strength: 45, weakness: true },
        { position: 'K', strength: 62, weakness: false },
        { position: 'DST', strength: 38, weakness: true }
    ];

    const handleRefresh = async () => {
    try {

        if (onRefresh) {
            await onRefresh();
        
    } catch (error) {
      console.error('Error in handleRefresh:', error);

    } catch (error) {
        console.error(error);
    }else {
            // Simulate refresh
            await new Promise(resolve => setTimeout(resolve, 1500));

    };

    const formatTrend = (trend?: 'up' | 'down' | 'stable', change?: number) => {
        if (!trend || trend === 'stable') return null;
        
        return (
            <div className={`flex items-center gap-1 ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {trend === 'up' ? 
                    <TrendingUpIcon className="w-3 h-3 sm:px-4 md:px-6 lg:px-8" /> : 
                    <TrendingDownIcon className="w-3 h-3 sm:px-4 md:px-6 lg:px-8" />

                {change && Boolean(change) && (
                    <span className="text-xs font-medium sm:px-4 md:px-6 lg:px-8">
                        {Math.abs(change).toFixed(1)}%
                    </span>
                )}
            </div>
        );
    };

    const renderMetricCard = (metric: MetricCard) => {
        const isExpanded = expandedCard === metric.id;
        
        return (
            <motion.div
                key={metric.id}
                layout
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
                            <InfoIcon className="w-3 h-3 text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8" />
                        )}
                    </div>
                </div>
                
                <div className="text-2xl font-bold text-[var(--text-primary)] mb-1 sm:px-4 md:px-6 lg:px-8">
                    {metric.value}
                </div>
                
                <AnimatePresence>
                    {isExpanded && metric.description && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
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
                    <div key={item.position} className="flex items-center justify-between p-2 rounded sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                            <span className="text-sm font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                {item.position}
                            </span>
                            {item.weakness && (
                                <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs sm:px-4 md:px-6 lg:px-8">
                                    Weak
                                </span>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                            <div className="w-16 h-2 bg-gray-500/20 rounded overflow-hidden sm:px-4 md:px-6 lg:px-8">
                                <div
                                    className={`h-full ${item.weakness ? 'bg-red-400' : 'bg-green-400'}`}
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
                    {['Week 15', 'Week 16', 'Week 17'].map((week, index) => {
                        const getDifficultyColor = (idx: number) => {
                            if (idx === 0) return 'bg-green-400';
                            if (idx === 1) return 'bg-yellow-400';
                            return 'bg-red-400';
                        };
                        
                        const getDifficultyLabel = (idx: number) => {
                            if (idx === 0) return 'Easy';
                            if (idx === 1) return 'Medium';
                            return 'Hard';
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
                            { id: 'overview', label: 'Overview' },
                            { id: 'performance', label: 'Performance' },
                            { id: 'trends', label: 'Trends' },
                            { id: 'roster', label: 'Roster' }
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
                                {activeTab === 'overview' && (
                                    <div className="grid grid-cols-2 gap-3 sm:px-4 md:px-6 lg:px-8">
                                        {overviewMetrics.map((metric: any) => renderMetricCard(metric))}
                                    </div>
                                )}

                                {activeTab === 'performance' && (
                                    <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                                        {renderPositionChart()}
                                    </div>
                                )}

                                {activeTab === 'trends' && renderTrendsView()}

                                {activeTab === 'roster' && (
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

const MobileAnalyticsDashboardWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <MobileAnalyticsDashboard {...props} />
  </ErrorBoundary>
);

export default React.memo(MobileAnalyticsDashboardWithErrorBoundary);
