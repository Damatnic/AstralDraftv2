/**
 * News and Updates Tab
 * Real-time news integration and player updates
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Widget } from '../ui/Widget';
import { Player, League, NewsItem } from '../../types';
import { NewsIcon } from '../icons/NewsIcon';
import { ClockIcon } from '../icons/ClockIcon';
import { AlertTriangleIcon } from '../icons/AlertTriangleIcon';
import { TrendingUpIcon } from '../icons/TrendingUpIcon';
import { UserIcon } from '../icons/UserIcon';

interface NewsAndUpdatesTabProps {
    player: Player;
    league: League;
    dispatch: React.Dispatch<any>;
}

interface InjuryUpdate {
    id: string;
    date: string;
    type: 'injury' | 'return' | 'update';
    severity: 'minor' | 'moderate' | 'major';
    description: string;
    expectedReturn?: string;
    source: string;
}

interface TradeRumor {
    id: string;
    date: string;
    probability: number;
    team: string;
    details: string;
    source: string;
    impact: 'positive' | 'negative' | 'neutral';
}

const NewsAndUpdatesTab: React.FC<NewsAndUpdatesTabProps> = ({
    player,
    league,
    dispatch
}: any) => {
    // Helper function to handle injury history as string union type
    const getInjuryStatusInfo = (injuryHistory: string | undefined) => {
        if (!injuryHistory) return null;
        
        switch (injuryHistory) {
            case 'minimal':
                return {
                    level: 'Minimal',
                    description: 'Clean injury history with minor concerns',
                    color: 'text-green-400',
                    bgColor: 'bg-green-500/10',
                    icon: '✅'
                };
            case 'moderate':
                return {
                    level: 'Moderate',
                    description: 'Some injury concerns that could affect availability',
                    color: 'text-yellow-400',
                    bgColor: 'bg-yellow-500/10',
                    icon: '⚠️'
                };
            case 'extensive':
                return {
                    level: 'Extensive',
                    description: 'Significant injury history with high risk',
                    color: 'text-red-400',
                    bgColor: 'bg-red-500/10',
                    icon: '🚨'
                };
            default:
                return null;
        }
    };

    // Mock data for demonstration - in real app this would come from API
    const recentNews = React.useMemo(() => [
        {
            id: '1',
            headline: `${player.name} Expected to See Increased Targets`,
            summary: `Beat reporters suggest ${player.name} is forming strong chemistry with the quarterback in practice.`,
            url: '#',
            source: 'ESPN',
            publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            impact: 'positive'
        },
        {
            id: '2',
            headline: `${player.team} Offensive Coordinator Comments on Usage`,
            summary: `"We're going to get ${player.name} involved in more creative ways this season."`,
            url: '#',
            source: 'NFL Network',
            publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
            impact: 'positive'
        },
        {
            id: '3',
            headline: `Training Camp Report: ${player.name} Looks Sharp`,
            summary: `Sources report ${player.name} has been consistently making plays in practice sessions.`,
            url: '#',
            source: 'The Athletic',
            publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            impact: 'positive'
        }
    ], [player.name, player.team]);

    const injuryUpdates: InjuryUpdate[] = React.useMemo(() => {
        const injuryInfo = getInjuryStatusInfo(player.injuryHistory);
        if (!injuryInfo) return [];

        // Generate relevant updates based on injury history level
        const updates: InjuryUpdate[] = [];
        
        if (player.injuryHistory === 'extensive') {
            updates.push({
                id: '1',
                date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
                type: 'update',
                severity: 'major',
                description: 'Medical staff monitoring previous injury site during practice',
                source: 'Team Medical Staff',
                expectedReturn: 'Week 1'
            });
        } else if (player.injuryHistory === 'moderate') {
            updates.push({
                id: '1',
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
                type: 'update',
                severity: 'minor',
                description: 'Participating fully in practice with no restrictions',
                source: 'Beat Reporter',
            });
        }

        return updates;
    }, [player.injuryHistory]);

    const tradeRumors: TradeRumor[] = React.useMemo(() => [
        // Mock trade rumors for demonstration
        {
            id: '1',
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            probability: 0.15,
            team: 'Multiple Teams',
            details: `Several contenders reportedly showing interest in ${player.name}'s services`,
            source: 'NFL Insider',
            impact: 'neutral'
        }
    ], [player.name]);

    const formatTimeAgo = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Less than an hour ago';
        if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        
        const diffInWeeks = Math.floor(diffInDays / 7);
        return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
    };

    const getImpactColor = (impact: string) => {
        switch (impact) {
            case 'positive': return 'text-green-400';
            case 'negative': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    const getImpactIcon = (impact: string) => {
        switch (impact) {
            case 'positive': return <TrendingUpIcon className="w-4 h-4" />;
            case 'negative': return <AlertTriangleIcon className="w-4 h-4" />;
            default: return <NewsIcon className="w-4 h-4" />;
        }
    };

    const injuryStatusInfo = getInjuryStatusInfo(player.injuryHistory);

    return (
        <div className="space-y-6">
            {/* Injury Status Overview */}
            {injuryStatusInfo && (
                <Widget title="Injury Status">
                    <div className={`p-4 rounded-lg ${injuryStatusInfo.bgColor}`}>
                        <div className="flex items-start gap-3">
                            <span className="text-xl">{injuryStatusInfo.icon}</span>
                            <div className="flex-1">
                                <div className={`font-semibold ${injuryStatusInfo.color}`}>
                                    {injuryStatusInfo.level} Injury History
                                </div>
                                <p className="text-sm text-[var(--text-secondary)] mt-1">
                                    {injuryStatusInfo.description}
                                </p>
                                {injuryUpdates.length > 0 && (
                                    <div className="mt-3 text-xs text-[var(--text-secondary)]">
                                        Last update: {formatTimeAgo(injuryUpdates[0].date)}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Widget>
            )}

            {/* Recent News */}
            <Widget title="Recent News">
                <div className="space-y-4">
                    {recentNews.map((news, index) => (
                        <motion.div
                            key={news.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 border border-[var(--panel-border)] rounded-lg hover:bg-[var(--panel-border)]/20 transition-colors"
                        >
                            <div className="flex items-start gap-3">
                                <div className={getImpactColor(news.impact)}>
                                    {getImpactIcon(news.impact)}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-[var(--text-primary)] mb-1">
                                        {news.headline}
                                    </h4>
                                    <p className="text-sm text-[var(--text-secondary)] mb-2">
                                        {news.summary}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                                        <div className="flex items-center gap-1">
                                            <UserIcon className="w-3 h-3" />
                                            {news.source}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <ClockIcon className="w-3 h-3" />
                                            {formatTimeAgo(news.publishedAt)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Widget>

            {/* Injury Updates */}
            {injuryUpdates.length > 0 && (
                <Widget title="Injury Updates">
                    <div className="space-y-3">
                        {injuryUpdates.map((update, index) => (
                            <motion.div
                                key={update.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-3 border border-[var(--panel-border)] rounded-lg"
                            >
                                <div className="flex items-start gap-3">
                                    <AlertTriangleIcon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                                        update.severity === 'major' ? 'text-red-400' :
                                        update.severity === 'moderate' ? 'text-yellow-400' :
                                        'text-green-400'
                                    }`} />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-medium text-[var(--text-primary)] capitalize">
                                                {update.type}
                                            </span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                update.severity === 'major' ? 'bg-red-500/20 text-red-400' :
                                                update.severity === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-green-500/20 text-green-400'
                                            }`}>
                                                {update.severity}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[var(--text-secondary)] mb-2">
                                            {update.description}
                                        </p>
                                        {update.expectedReturn && (
                                            <div className="text-xs text-blue-400 mb-2">
                                                Expected Return: {update.expectedReturn}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                                            <div className="flex items-center gap-1">
                                                <UserIcon className="w-3 h-3" />
                                                {update.source}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <ClockIcon className="w-3 h-3" />
                                                {formatTimeAgo(update.date)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Widget>
            )}

            {/* Trade Rumors */}
            {tradeRumors.length > 0 && (
                <Widget title="Trade Rumors">
                    <div className="space-y-3">
                        {tradeRumors.map((rumor, index) => (
                            <motion.div
                                key={rumor.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-4 border border-[var(--panel-border)] rounded-lg bg-gradient-to-r from-purple-500/5 to-blue-500/5"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-[var(--text-primary)]">
                                            Trade Interest
                                        </span>
                                        <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full">
                                            {Math.round(rumor.probability * 100)}% probability
                                        </span>
                                    </div>
                                    <span className={`text-xs ${getImpactColor(rumor.impact)}`}>
                                        {rumor.impact}
                                    </span>
                                </div>
                                <p className="text-sm text-[var(--text-secondary)] mb-3">
                                    <strong>{rumor.team}:</strong> {rumor.details}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                                    <div className="flex items-center gap-1">
                                        <UserIcon className="w-3 h-3" />
                                        {rumor.source}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <ClockIcon className="w-3 h-3" />
                                        {formatTimeAgo(rumor.date)}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Widget>
            )}

            {/* News Feed Empty State */}
            {recentNews.length === 0 && injuryUpdates.length === 0 && tradeRumors.length === 0 && (
                <Widget title="No Recent News">
                    <div className="text-center py-8">
                        <NewsIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                            No Recent News
                        </h3>
                        <p className="text-[var(--text-secondary)]">
                            Check back later for the latest updates on {player.name}
                        </p>
                    </div>
                </Widget>
            )}
        </div>
    );
};

export default NewsAndUpdatesTab;