/**
 * Enhanced Player Profile View
 * Comprehensive player information with advanced stats, news, and comparison tools
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Widget } from '../ui/Widget';
import { Avatar } from '../ui/Avatar';
import { Player, League, NewsItem } from '../../types';
import { SparklesIcon } from '../icons/SparklesIcon';
import { TrendingUpIcon } from '../icons/TrendingUpIcon';
import { TrendingDownIcon } from '../icons/TrendingDownIcon';
import { BarChartIcon } from '../icons/BarChartIcon';
import { NewsIcon } from '../icons/NewsIcon';
import { CompareIcon } from '../icons/CompareIcon';
import { ShareIcon } from '../icons/ShareIcon';
import { HeartIcon } from '../icons/HeartIcon';
import AdvancedStatsTab from './AdvancedStatsTab';
import NewsAndUpdatesTab from './NewsAndUpdatesTab';
import PlayerComparisonTab from './PlayerComparisonTab';
import SeasonTrendsTab from './SeasonTrendsTab';

interface PlayerProfileViewProps {
    player: Player;
    league: League;
    dispatch: React.Dispatch<any>;
    onClose?: () => void;
}

const PlayerProfileView: React.FC<PlayerProfileViewProps> = ({ player, league, dispatch, onClose }: any) => {
    const [selectedTab, setSelectedTab] = React.useState<string>('overview');
    const [isFavorited, setIsFavorited] = React.useState(false);
    const [showShareMenu, setShowShareMenu] = React.useState(false);

    const tabs: { id: string; label: string; icon: React.ReactNode }[] = [
        {
            id: 'overview',
            label: 'Overview',
            icon: <SparklesIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
        },
        {
            id: 'advanced-stats',
            label: 'Advanced Stats',
            icon: <BarChartIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
        },
        {
            id: 'news',
            label: 'News & Updates',
            icon: <NewsIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
        },
        {
            id: 'trends',
            label: 'Season Trends',
            icon: <TrendingUpIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
        },
        {
            id: 'comparison',
            label: 'Compare Players',
            icon: <CompareIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />

    ];

    const positionColors = {
        QB: 'from-red-500/30 to-red-600/20',
        RB: 'from-green-500/30 to-green-600/20',
        WR: 'from-blue-500/30 to-blue-600/20',
        TE: 'from-orange-500/30 to-orange-600/20',
        K: 'from-yellow-500/30 to-yellow-600/20',
        DST: 'from-purple-500/30 to-purple-600/20'
    };

    const getCurrentTrend = () => {
        // Mock trend calculation - in real app this would analyze recent performance
        const recent = player.stats.projection - player.stats.lastYear;
        if (recent > 2) return 'up';
        if (recent < -2) return 'down';
        return 'stable';
    };

    const getTrendIcon = () => {
        const trend = getCurrentTrend();
        switch (trend) {
            case 'up':
                return <TrendingUpIcon className="w-5 h-5 text-green-400 sm:px-4 md:px-6 lg:px-8" />;
            case 'down':
                return <TrendingDownIcon className="w-5 h-5 text-red-400 sm:px-4 md:px-6 lg:px-8" />;
            default:
                return <BarChartIcon className="w-5 h-5 text-gray-400 sm:px-4 md:px-6 lg:px-8" />;

    };

    const handleShare = (platform: string) => {
        const url = `${window.location.origin}/player/${player.id}`;
        const text = `Check out ${player.name} (${player.position}) - ${player.team} on Astral Draft!`;
        
        switch (platform) {
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
                break;
            case 'copy':
                navigator.clipboard.writeText(url);
                // Add toast notification here
                break;

        setShowShareMenu(false);
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] sm:px-4 md:px-6 lg:px-8">
            {/* Header Section */}
            <div className={`relative bg-gradient-to-br ${positionColors[player.position]} border-b border-[var(--panel-border)]`}>
                <div className="p-6 sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-start justify-between mb-4 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-center gap-4 sm:px-4 md:px-6 lg:px-8">
                            <Avatar
                                avatar={player.astralIntelligence?.spiritAnimal?.[0] || '🏈'}
                                className="w-20 h-20 text-3xl rounded-xl border-2 border-white/20 sm:px-4 md:px-6 lg:px-8"
                            />
                            <div>
                                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-1 sm:px-4 md:px-6 lg:px-8">
                                    {player.name}
                                </h1>
                                <div className="flex items-center gap-3 text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                    <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-medium sm:px-4 md:px-6 lg:px-8">
                                        {player.position}
                                    </span>
                                    <span className="text-lg font-semibold sm:px-4 md:px-6 lg:px-8">{player.team}</span>
                                    <span>#{player.rank} Overall</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                            <button
                                onClick={() => setIsFavorited(!isFavorited)}`}
                            >
                                <HeartIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
                            </button>
                            
                            <div className="relative sm:px-4 md:px-6 lg:px-8">
                                <button
                                    onClick={() => setShowShareMenu(!showShareMenu)}
                                >
                                    <ShareIcon className="w-5 h-5 text-gray-400 sm:px-4 md:px-6 lg:px-8" />
                                </button>
                                
                                <AnimatePresence>
                                    {showShareMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                            className="absolute right-0 top-full mt-2 bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg shadow-xl z-50 min-w-[150px] sm:px-4 md:px-6 lg:px-8"
                                        >
                                            <button
                                                onClick={() => handleShare('twitter')}
                                            >
                                                Share on Twitter
                                            </button>
                                            <button
                                                onClick={() => handleShare('copy')}
                                            >
                                                Copy Link
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {onClose && (
                                <button
                                    onClick={onClose}
                                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8"
                                 aria-label="Action button">
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                        <div className="text-center p-3 bg-white/10 rounded-lg sm:px-4 md:px-6 lg:px-8">
                            <div className="text-xl font-bold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{player.stats.projection}</div>
                            <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Projected Pts</div>
                        </div>
                        <div className="text-center p-3 bg-white/10 rounded-lg sm:px-4 md:px-6 lg:px-8">
                            <div className="text-xl font-bold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{player?.adp}</div>
                            <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">ADP</div>
                        </div>
                        <div className="text-center p-3 bg-white/10 rounded-lg sm:px-4 md:px-6 lg:px-8">
                            <div className="text-xl font-bold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">${player.auctionValue}</div>
                            <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Auction Value</div>
                        </div>
                        <div className="text-center p-3 bg-white/10 rounded-lg sm:px-4 md:px-6 lg:px-8">
                            <div className="text-xl font-bold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">Week {player.bye}</div>
                            <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Bye Week</div>
                        </div>
                        <div className="text-center p-3 bg-white/10 rounded-lg sm:px-4 md:px-6 lg:px-8">
                            <div className="flex items-center justify-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                {getTrendIcon()}
                                <div className="text-xl font-bold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                    {player.stats.vorp > 0 ? '+' : ''}{player.stats.vorp.toFixed(1)}
                                </div>
                            </div>
                            <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">VORP</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-[var(--panel-border)] bg-[var(--panel-bg)] sm:px-4 md:px-6 lg:px-8">
                <div className="flex overflow-x-auto sm:px-4 md:px-6 lg:px-8">
                    {tabs.map((tab: any) => (
                        <button
                            key={tab.id}
                            onClick={() => setSelectedTab(tab.id)}`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 sm:px-4 md:px-6 lg:px-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {selectedTab === 'overview' && <OverviewSection player={player} league={league} />}
                        {selectedTab === 'advanced-stats' && <AdvancedStatsTab player={player} league={league} dispatch={dispatch} />}
                        {selectedTab === 'news' && <NewsAndUpdatesTab player={player} league={league} dispatch={dispatch} />}
                        {selectedTab === 'trends' && <SeasonTrendsTab player={player} league={league} dispatch={dispatch} />}
                        {selectedTab === 'comparison' && <PlayerComparisonTab player={player} league={league} dispatch={dispatch} />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

// Overview Section Component
const OverviewSection: React.FC<{ player: Player; league: League }> = ({ player, league }: any) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Player Bio & Info */}
            <div className="lg:col-span-2 space-y-6">
                <Widget title="Player Information">
                    <div className="p-4 space-y-4 sm:px-4 md:px-6 lg:px-8">
                        <div>
                            <h4 className="font-medium text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">Biography</h4>
                            <p className="text-[var(--text-secondary)] leading-relaxed sm:px-4 md:px-6 lg:px-8">
                                {player.bio || "No biography available for this player."}
                            </p>
                        </div>

                        {player.scoutingReport && (
                            <div>
                                <h4 className="font-medium text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">Scouting Report</h4>
                                <p className="text-[var(--text-secondary)] mb-3 sm:px-4 md:px-6 lg:px-8">{player.scoutingReport.summary}</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h5 className="font-medium text-green-400 mb-2 sm:px-4 md:px-6 lg:px-8">Strengths</h5>
                                        <ul className="space-y-1 sm:px-4 md:px-6 lg:px-8">
                                            {player.scoutingReport.strengths.map((strength: any) => (
                                                <li key={strength} className="text-sm text-[var(--text-secondary)] flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full sm:px-4 md:px-6 lg:px-8"></span>
                                                    {strength}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <div>
                                        <h5 className="font-medium text-red-400 mb-2 sm:px-4 md:px-6 lg:px-8">Weaknesses</h5>
                                        <ul className="space-y-1 sm:px-4 md:px-6 lg:px-8">
                                            {player.scoutingReport.weaknesses.map((weakness: any) => (
                                                <li key={weakness} className="text-sm text-[var(--text-secondary)] flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full sm:px-4 md:px-6 lg:px-8"></span>
                                                    {weakness}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Widget>

                {/* Contract Information */}
                {player.contract && (
                    <Widget title="Contract Details">
                        <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                            <div className="grid grid-cols-3 gap-4 sm:px-4 md:px-6 lg:px-8">
                                <div className="text-center p-3 bg-blue-500/10 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                    <div className="text-lg font-bold text-blue-400 sm:px-4 md:px-6 lg:px-8">{player.contract.years} years</div>
                                    <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Contract Length</div>
                                </div>
                                <div className="text-center p-3 bg-green-500/10 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                    <div className="text-lg font-bold text-green-400 sm:px-4 md:px-6 lg:px-8">{player.contract.amount}</div>
                                    <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Total Value</div>
                                </div>
                                <div className="text-center p-3 bg-yellow-500/10 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                    <div className="text-lg font-bold text-yellow-400 sm:px-4 md:px-6 lg:px-8">{player.contract.guaranteed}</div>
                                    <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Guaranteed</div>
                                </div>
                            </div>
                        </div>
                    </Widget>
                )}
            </div>

            {/* Sidebar with Quick Stats and Astral Intelligence */}
            <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
                <Widget title="Fantasy Metrics">
                    <div className="p-4 space-y-3 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                            <span className="text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Tier</span>
                            <span className="font-bold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">Tier {player?.tier}</span>
                        </div>
                        <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                            <span className="text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Age</span>
                            <span className="font-bold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{player?.age} years</span>
                        </div>
                        <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                            <span className="text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Last Year</span>
                            <span className="font-bold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{player.stats.lastYear} pts</span>
                        </div>
                        {player.advancedMetrics && (
                            <>
                                <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                                    <span className="text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Snap %</span>
                                    <span className="font-bold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{player.advancedMetrics.snapCountPct}%</span>
                                </div>
                                <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                                    <span className="text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Target Share</span>
                                    <span className="font-bold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{player.advancedMetrics.targetSharePct}%</span>
                                </div>
                                <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                                    <span className="text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">RZ Touches</span>
                                    <span className="font-bold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{player.advancedMetrics.redZoneTouches}</span>
                                </div>
                            </>
                        )}
                    </div>
                </Widget>

                {player.astralIntelligence && (
                    <Widget title="Astral Intelligence">
                        <div className="p-4 space-y-3 sm:px-4 md:px-6 lg:px-8">
                            <div>
                                <span className="text-[var(--text-secondary)] text-sm sm:px-4 md:px-6 lg:px-8">Spirit Animal</span>
                                <p className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{player.astralIntelligence.spiritAnimal}</p>
                            </div>
                            <div>
                                <span className="text-[var(--text-secondary)] text-sm sm:px-4 md:px-6 lg:px-8">Pregame Ritual</span>
                                <p className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{player.astralIntelligence.pregameRitual}</p>
                            </div>
                            <div>
                                <span className="text-[var(--text-secondary)] text-sm sm:px-4 md:px-6 lg:px-8">Offseason Hobby</span>
                                <p className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{player.astralIntelligence.offseasonHobby}</p>
                            </div>
                            <div>
                                <span className="text-[var(--text-secondary)] text-sm sm:px-4 md:px-6 lg:px-8">Signature Celebration</span>
                                <p className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{player.astralIntelligence.signatureCelebration}</p>
                            </div>
                        </div>
                    </Widget>
                )}
            </div>
        </div>
    );
};

const PlayerProfileViewWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <PlayerProfileView {...props} />
  </ErrorBoundary>
);

export default React.memo(PlayerProfileViewWithErrorBoundary);
