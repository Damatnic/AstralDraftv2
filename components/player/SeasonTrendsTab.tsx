/**
 * Season Trends Tab
 * Historical performance analysis and trending data
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Widget } from '../ui/Widget';
import { Player, League } from '../../types';
import { TrendingUpIcon } from '../icons/TrendingUpIcon';
import { TrendingDownIcon } from '../icons/TrendingDownIcon';
import { BarChartIcon } from '../icons/BarChartIcon';
import { CalendarIcon } from '../icons/CalendarIcon';

interface SeasonTrendsTabProps {
    player: Player;
    league: League;
    dispatch: React.Dispatch<any>;

}

interface WeeklyPerformance {
    week: number;
    points: number;
    projected: number;
    opponent: string;
    result: 'over' | 'under';
    matchupDifficulty: 'easy' | 'medium' | 'hard';

interface TrendMetric {
    label: string;
    value: number;
    trend: 'up' | 'down' | 'stable';
    changePercent: number;
    timeframe: string;

}

interface SeasonComparison {
    season: number;
    games: number;
    totalPoints: number;
    avgPoints: number;
    rank: number;
    adp: number;}

const SeasonTrendsTab: React.FC<SeasonTrendsTabProps> = ({ player }) => {
    // Mock performance data - in real app this would come from stats API
    const weeklyPerformance: WeeklyPerformance[] = [
        { week: 1, points: 18.5, projected: 16.2, opponent: 'MIA', result: 'over', matchupDifficulty: 'medium' },
        { week: 2, points: 12.3, projected: 15.8, opponent: 'BUF', result: 'under', matchupDifficulty: 'hard' },
        { week: 3, points: 24.7, projected: 17.1, opponent: 'JAX', result: 'over', matchupDifficulty: 'easy' },
        { week: 4, points: 19.2, projected: 16.9, opponent: 'NYJ', result: 'over', matchupDifficulty: 'medium' }
    ];

    const trendMetrics: TrendMetric[] = [
        {
            label: 'Fantasy Points Per Game',
            value: 18.7,
            trend: 'up',
            changePercent: 12.5,
            timeframe: 'Last 3 weeks'
        },
        {
            label: 'Target Share',
            value: 23.8,
            trend: 'up',
            changePercent: 8.2,
            timeframe: 'Season trend'
        },
        {
            label: 'Red Zone Usage',
            value: 15.6,
            trend: 'stable',
            changePercent: 1.1,
            timeframe: 'Last 4 weeks'
        },
        {
            label: 'Snap Count %',
            value: 78.5,
            trend: 'down',
            changePercent: -5.3,
            timeframe: 'Recent games'

    ];

    const seasonComparisons: SeasonComparison[] = [
        { season: 2024, games: 4, totalPoints: 74.7, avgPoints: 18.7, rank: 12, adp: player?.adp ?? 0 },
        { season: 2023, games: 17, totalPoints: 298.4, avgPoints: 17.6, rank: 15, adp: 45 },
        { season: 2022, games: 16, totalPoints: 267.2, avgPoints: 16.7, rank: 22, adp: 62 }
    ];

    const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
        switch (trend) {
            case 'up':
                return <TrendingUpIcon className="w-4 h-4 text-green-400 sm:px-4 md:px-6 lg:px-8" />;
            case 'down':
                return <TrendingDownIcon className="w-4 h-4 text-red-400 sm:px-4 md:px-6 lg:px-8" />;
            default:
                return <BarChartIcon className="w-4 h-4 text-gray-400 sm:px-4 md:px-6 lg:px-8" />;

    };

    const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
        switch (trend) {
            case 'up':
                return 'text-green-400';
            case 'down':
                return 'text-red-400';
            default:
                return 'text-gray-400';

    };

    const getMatchupColor = (difficulty: WeeklyPerformance['matchupDifficulty']) => {
        switch (difficulty) {
            case 'easy':
                return 'bg-green-500/20 text-green-400';
            case 'hard':
                return 'bg-red-500/20 text-red-400';
            default:
                return 'bg-yellow-500/20 text-yellow-400';

    };

    const currentSeasonAvg = weeklyPerformance.reduce((sum, week) => sum + week.points, 0) / weeklyPerformance.length;
    const projectionAccuracy = weeklyPerformance.filter((w: any) => w.result === 'over').length / weeklyPerformance.length * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 sm:px-4 md:px-6 lg:px-8"
        >
            {/* Current Season Overview */}
            <Widget title="2024 Season Progress">
                <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-3 bg-blue-500/10 rounded-lg sm:px-4 md:px-6 lg:px-8">
                            <div className="text-2xl font-bold text-blue-400 sm:px-4 md:px-6 lg:px-8">{currentSeasonAvg.toFixed(1)}</div>
                            <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Avg PPG</div>
                        </div>
                        <div className="text-center p-3 bg-green-500/10 rounded-lg sm:px-4 md:px-6 lg:px-8">
                            <div className="text-2xl font-bold text-green-400 sm:px-4 md:px-6 lg:px-8">{projectionAccuracy.toFixed(0)}%</div>
                            <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Over Projection</div>
                        </div>
                        <div className="text-center p-3 bg-purple-500/10 rounded-lg sm:px-4 md:px-6 lg:px-8">
                            <div className="text-2xl font-bold text-purple-400 sm:px-4 md:px-6 lg:px-8">{weeklyPerformance.length}</div>
                            <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Games Played</div>
                        </div>
                        <div className="text-center p-3 bg-yellow-500/10 rounded-lg sm:px-4 md:px-6 lg:px-8">
                            <div className="text-2xl font-bold text-yellow-400 sm:px-4 md:px-6 lg:px-8">#{player.rank}</div>
                            <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Current Rank</div>
                        </div>
                    </div>

                    {/* Weekly Performance Chart */}
                    <div>
                        <h4 className="font-medium text-[var(--text-primary)] mb-4 sm:px-4 md:px-6 lg:px-8">Weekly Performance</h4>
                        <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                            {weeklyPerformance.map((week: any) => (
                                <div key={week.week} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                    <div className="text-center min-w-[50px] sm:px-4 md:px-6 lg:px-8">
                                        <div className="font-bold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">W{week.week}</div>
                                        <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">{week.opponent}</div>
                                    </div>
                                    
                                    <div className={`px-2 py-1 rounded text-xs font-medium ${getMatchupColor(week.matchupDifficulty)}`}>
                                        {week.matchupDifficulty.toUpperCase()}
                                    </div>
                                    
                                    <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                                        <div className="flex justify-between items-center mb-1 sm:px-4 md:px-6 lg:px-8">
                                            <span className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Actual</span>
                                            <span className="font-bold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{week.points}</span>
                                        </div>
                                        <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                                            <span className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Projected</span>
                                            <span className="text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">{week.projected}</span>
                                        </div>
                                    </div>
                                    
                                    <div className={`text-right min-w-[60px] ${
                                        week.result === 'over' ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                        <div className="font-bold sm:px-4 md:px-6 lg:px-8">
                                            {week.result === 'over' ? '+' : ''}{(week.points - week.projected).toFixed(1)}
                                        </div>
                                        <div className="text-xs sm:px-4 md:px-6 lg:px-8">
                                            {week.result === 'over' ? 'OVER' : 'UNDER'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Widget>

            {/* Trending Metrics */}
            <Widget title="Key Performance Trends">
                <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {trendMetrics.map((metric, index) => (
                            <div key={index} className="p-4 bg-white/5 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                <div className="flex items-center justify-between mb-3 sm:px-4 md:px-6 lg:px-8">
                                    <h4 className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{metric.label}</h4>
                                    {getTrendIcon(metric.trend)}
                                </div>
                                
                                <div className="flex items-end justify-between sm:px-4 md:px-6 lg:px-8">
                                    <div>
                                        <div className="text-2xl font-bold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                            {metric.value}
                                            {metric.label.includes('%') || metric.label.includes('Share') ? '%' : ''}
                                        </div>
                                        <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">{metric.timeframe}</div>
                                    </div>
                                    
                                    <div className={`text-right ${getTrendColor(metric.trend)}`}>
                                        <div className="font-medium sm:px-4 md:px-6 lg:px-8">
                                            {metric.changePercent > 0 ? '+' : ''}{metric.changePercent.toFixed(1)}%
                                        </div>
                                        <div className="text-xs sm:px-4 md:px-6 lg:px-8">change</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Widget>

            {/* Historical Comparison */}
            <Widget title="Season-by-Season Comparison">
                <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                    <div className="overflow-x-auto sm:px-4 md:px-6 lg:px-8">
                        <table className="w-full sm:px-4 md:px-6 lg:px-8">
                            <thead>
                                <tr className="border-b border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                                    <th className="text-left py-3 text-[var(--text-secondary)] text-sm sm:px-4 md:px-6 lg:px-8">Season</th>
                                    <th className="text-right py-3 text-[var(--text-secondary)] text-sm sm:px-4 md:px-6 lg:px-8">Games</th>
                                    <th className="text-right py-3 text-[var(--text-secondary)] text-sm sm:px-4 md:px-6 lg:px-8">Total Pts</th>
                                    <th className="text-right py-3 text-[var(--text-secondary)] text-sm sm:px-4 md:px-6 lg:px-8">Avg PPG</th>
                                    <th className="text-right py-3 text-[var(--text-secondary)] text-sm sm:px-4 md:px-6 lg:px-8">Rank</th>
                                    <th className="text-right py-3 text-[var(--text-secondary)] text-sm sm:px-4 md:px-6 lg:px-8">ADP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {seasonComparisons.map((season: any) => (
                                    <tr key={season.season} className="border-b border-[var(--panel-border)]/50 sm:px-4 md:px-6 lg:px-8">
                                        <td className="py-3 font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                            {season.season}
                                            {season.season === 2024 && (
                                                <span className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded sm:px-4 md:px-6 lg:px-8">
                                                    Current
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 text-right text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{season.games}</td>
                                        <td className="py-3 text-right text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{season.totalPoints.toFixed(1)}</td>
                                        <td className="py-3 text-right font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                            {season.avgPoints.toFixed(1)}
                                        </td>
                                        <td className="py-3 text-right text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">#{season.rank}</td>
                                        <td className="py-3 text-right text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">{season.adp || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-500/10 rounded-lg sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-center gap-2 mb-2 sm:px-4 md:px-6 lg:px-8">
                            <CalendarIcon className="w-5 h-5 text-blue-400 sm:px-4 md:px-6 lg:px-8" />
                            <h4 className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">Season Outlook</h4>
                        </div>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed sm:px-4 md:px-6 lg:px-8">
                            Based on current trends, {player.name} is on pace for a career year. 
                            The {((trendMetrics.find((m: any) => m.label.includes('Points'))?.changePercent || 0) > 0 ? 'upward' : 'downward')} 
                            trend in fantasy production suggests strong {((trendMetrics.find((m: any) => m.label.includes('Points'))?.changePercent || 0) > 0 ? 'growth' : 'regression')} 
                            compared to previous seasons.
                        </p>
                    </div>
                </div>
            </Widget>

            {/* Consistency Analysis */}
            <Widget title="Performance Consistency">
                <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-green-500/10 rounded-lg sm:px-4 md:px-6 lg:px-8">
                            <div className="text-2xl font-bold text-green-400 sm:px-4 md:px-6 lg:px-8">
                                {((weeklyPerformance.filter((w: any) => w.points >= 15).length / weeklyPerformance.length) * 100).toFixed(0)}%
                            </div>
                            <div className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Games with 15+ Points</div>
                        </div>
                        
                        <div className="text-center p-4 bg-blue-500/10 rounded-lg sm:px-4 md:px-6 lg:px-8">
                            <div className="text-2xl font-bold text-blue-400 sm:px-4 md:px-6 lg:px-8">
                                {Math.max(...weeklyPerformance.map((w: any) => w.points)).toFixed(1)}
                            </div>
                            <div className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Season High</div>
                        </div>
                        
                        <div className="text-center p-4 bg-red-500/10 rounded-lg sm:px-4 md:px-6 lg:px-8">
                            <div className="text-2xl font-bold text-red-400 sm:px-4 md:px-6 lg:px-8">
                                {Math.min(...weeklyPerformance.map((w: any) => w.points)).toFixed(1)}
                            </div>
                            <div className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Season Low</div>
                        </div>
                    </div>
                </div>
            </Widget>
        </motion.div>
    );
};

const SeasonTrendsTabWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <SeasonTrendsTab {...props} />
  </ErrorBoundary>
);

export default React.memo(SeasonTrendsTabWithErrorBoundary);
