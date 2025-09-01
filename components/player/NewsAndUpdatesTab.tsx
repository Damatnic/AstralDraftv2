/**
 * News and Updates Tab
 * Real-time news integration and player updates
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import { motion } from &apos;framer-motion&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { Player, League, NewsItem } from &apos;../../types&apos;;
import { NewsIcon } from &apos;../icons/NewsIcon&apos;;
import { ClockIcon } from &apos;../icons/ClockIcon&apos;;
import { AlertTriangleIcon } from &apos;../icons/AlertTriangleIcon&apos;;
import { TrendingUpIcon } from &apos;../icons/TrendingUpIcon&apos;;
import { UserIcon } from &apos;../icons/UserIcon&apos;;

interface NewsAndUpdatesTabProps {
}
    player: Player;
    league: League;
    dispatch: React.Dispatch<any>;

}

interface InjuryUpdate {
}
    id: string;
    date: string;
    type: &apos;injury&apos; | &apos;return&apos; | &apos;update&apos;;
    severity: &apos;minor&apos; | &apos;moderate&apos; | &apos;major&apos;;
    description: string;
    expectedReturn?: string;
    source: string;

interface TradeRumor {
}
    id: string;
    date: string;
    probability: number;
    team: string;
    details: string;
    source: string;
    impact: &apos;positive&apos; | &apos;negative&apos; | &apos;neutral&apos;;

}

const NewsAndUpdatesTab: React.FC<NewsAndUpdatesTabProps> = ({
}
    player,
    league,
//     dispatch
}: any) => {
}
    // Helper function to handle injury history as string union type
    const getInjuryStatusInfo = (injuryHistory: string | undefined) => {
}
        if (!injuryHistory) return null;
        
        switch (injuryHistory) {
}
            case &apos;minimal&apos;:
                return {
}
                    level: &apos;Minimal&apos;,
                    description: &apos;Clean injury history with minor concerns&apos;,
                    color: &apos;text-green-400&apos;,
                    bgColor: &apos;bg-green-500/10&apos;,
                    icon: &apos;✅&apos;
                };
            case &apos;moderate&apos;:
                return {
}
                    level: &apos;Moderate&apos;,
                    description: &apos;Some injury concerns that could affect availability&apos;,
                    color: &apos;text-yellow-400&apos;,
                    bgColor: &apos;bg-yellow-500/10&apos;,
                    icon: &apos;⚠️&apos;
                };
            case &apos;extensive&apos;:
                return {
}
                    level: &apos;Extensive&apos;,
                    description: &apos;Significant injury history with high risk&apos;,
                    color: &apos;text-red-400&apos;,
                    bgColor: &apos;bg-red-500/10&apos;,
                    icon: &apos;🚨&apos;
                };
            default:
                return null;

    };

    // Mock data for demonstration - in real app this would come from API
    const recentNews = React.useMemo(() => [
        {
}
            id: &apos;1&apos;,
            headline: `${player.name} Expected to See Increased Targets`,
            summary: `Beat reporters suggest ${player.name} is forming strong chemistry with the quarterback in practice.`,
            url: &apos;#&apos;,
            source: &apos;ESPN&apos;,
            publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            impact: &apos;positive&apos;
        },
        {
}
            id: &apos;2&apos;,
            headline: `${player.team} Offensive Coordinator Comments on Usage`,
            summary: `"We&apos;re going to get ${player.name} involved in more creative ways this season."`,
            url: &apos;#&apos;,
            source: &apos;NFL Network&apos;,
            publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
            impact: &apos;positive&apos;
        },
        {
}
            id: &apos;3&apos;,
            headline: `Training Camp Report: ${player.name} Looks Sharp`,
            summary: `Sources report ${player.name} has been consistently making plays in practice sessions.`,
            url: &apos;#&apos;,
            source: &apos;The Athletic&apos;,
            publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            impact: &apos;positive&apos;

    ], [player.name, player.team]);

    const injuryUpdates: InjuryUpdate[] = React.useMemo(() => {
}
        const injuryInfo = getInjuryStatusInfo(player.injuryHistory);
        if (!injuryInfo) return [];

        // Generate relevant updates based on injury history level
        const updates: InjuryUpdate[] = [];
        
        if (player.injuryHistory === &apos;extensive&apos;) {
}
            updates.push({
}
                id: &apos;1&apos;,
                date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
                type: &apos;update&apos;,
                severity: &apos;major&apos;,
                description: &apos;Medical staff monitoring previous injury site during practice&apos;,
                source: &apos;Team Medical Staff&apos;,
                expectedReturn: &apos;Week 1&apos;
            });
        } else if (player.injuryHistory === &apos;moderate&apos;) {
}
            updates.push({
}
                id: &apos;1&apos;,
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
                type: &apos;update&apos;,
                severity: &apos;minor&apos;,
                description: &apos;Participating fully in practice with no restrictions&apos;,
                source: &apos;Beat Reporter&apos;,
            });

        return updates;
    }, [player.injuryHistory]);

    const tradeRumors: TradeRumor[] = React.useMemo(() => [
        // Mock trade rumors for demonstration
        {
}
            id: &apos;1&apos;,
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            probability: 0.15,
            team: &apos;Multiple Teams&apos;,
            details: `Several contenders reportedly showing interest in ${player.name}&apos;s services`,
            source: &apos;NFL Insider&apos;,
            impact: &apos;neutral&apos;

    ], [player.name]);

    const formatTimeAgo = (dateString: string): string => {
}
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return &apos;Less than an hour ago&apos;;
        if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? &apos;s&apos; : &apos;&apos;} ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? &apos;s&apos; : &apos;&apos;} ago`;
        
        const diffInWeeks = Math.floor(diffInDays / 7);
        return `${diffInWeeks} week${diffInWeeks > 1 ? &apos;s&apos; : &apos;&apos;} ago`;
    };

    const getImpactColor = (impact: string) => {
}
        switch (impact) {
}
            case &apos;positive&apos;: return &apos;text-green-400&apos;;
            case &apos;negative&apos;: return &apos;text-red-400&apos;;
            default: return &apos;text-gray-400&apos;;

    };

    const getImpactIcon = (impact: string) => {
}
        switch (impact) {
}
            case &apos;positive&apos;: return <TrendingUpIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />;
            case &apos;negative&apos;: return <AlertTriangleIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />;
            default: return <NewsIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />;

    };

    const injuryStatusInfo = getInjuryStatusInfo(player.injuryHistory);

    return (
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            {/* Injury Status Overview */}
            {injuryStatusInfo && (
}
                <Widget title="Injury Status">
                    <div className={`p-4 rounded-lg ${injuryStatusInfo.bgColor}`}>
                        <div className="flex items-start gap-3 sm:px-4 md:px-6 lg:px-8">
                            <span className="text-xl sm:px-4 md:px-6 lg:px-8">{injuryStatusInfo.icon}</span>
                            <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                                <div className={`font-semibold ${injuryStatusInfo.color}`}>
                                    {injuryStatusInfo.level} Injury History
                                </div>
                                <p className="text-sm text-[var(--text-secondary)] mt-1 sm:px-4 md:px-6 lg:px-8">
                                    {injuryStatusInfo.description}
                                </p>
                                {injuryUpdates.length > 0 && (
}
                                    <div className="mt-3 text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
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
                <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                    {recentNews.map((news, index) => (
}
                        <motion.div
                            key={news.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 border border-[var(--panel-border)] rounded-lg hover:bg-[var(--panel-border)]/20 transition-colors sm:px-4 md:px-6 lg:px-8"
                        >
                            <div className="flex items-start gap-3 sm:px-4 md:px-6 lg:px-8">
                                <div className={getImpactColor(news.impact)}>
                                    {getImpactIcon(news.impact)}
                                </div>
                                <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                                    <h4 className="font-medium text-[var(--text-primary)] mb-1 sm:px-4 md:px-6 lg:px-8">
                                        {news.headline}
                                    </h4>
                                    <p className="text-sm text-[var(--text-secondary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                                        {news.summary}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                        <div className="flex items-center gap-1 sm:px-4 md:px-6 lg:px-8">
                                            <UserIcon className="w-3 h-3 sm:px-4 md:px-6 lg:px-8" />
                                            {news.source}
                                        </div>
                                        <div className="flex items-center gap-1 sm:px-4 md:px-6 lg:px-8">
                                            <ClockIcon className="w-3 h-3 sm:px-4 md:px-6 lg:px-8" />
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
}
                <Widget title="Injury Updates">
                    <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                        {injuryUpdates.map((update, index) => (
}
                            <motion.div
                                key={update.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-3 border border-[var(--panel-border)] rounded-lg sm:px-4 md:px-6 lg:px-8"
                            >
                                <div className="flex items-start gap-3 sm:px-4 md:px-6 lg:px-8">
                                    <AlertTriangleIcon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
}
                                        update.severity === &apos;major&apos; ? &apos;text-red-400&apos; :
                                        update.severity === &apos;moderate&apos; ? &apos;text-yellow-400&apos; :
                                        &apos;text-green-400&apos;
                                    }`} />
                                    <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                                        <div className="flex items-center gap-2 mb-1 sm:px-4 md:px-6 lg:px-8">
                                            <span className="text-sm font-medium text-[var(--text-primary)] capitalize sm:px-4 md:px-6 lg:px-8">
                                                {update.type}
                                            </span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${
}
                                                update.severity === &apos;major&apos; ? &apos;bg-red-500/20 text-red-400&apos; :
                                                update.severity === &apos;moderate&apos; ? &apos;bg-yellow-500/20 text-yellow-400&apos; :
                                                &apos;bg-green-500/20 text-green-400&apos;
                                            }`}>
                                                {update.severity}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[var(--text-secondary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                                            {update.description}
                                        </p>
                                        {update.expectedReturn && (
}
                                            <div className="text-xs text-blue-400 mb-2 sm:px-4 md:px-6 lg:px-8">
                                                Expected Return: {update.expectedReturn}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                            <div className="flex items-center gap-1 sm:px-4 md:px-6 lg:px-8">
                                                <UserIcon className="w-3 h-3 sm:px-4 md:px-6 lg:px-8" />
                                                {update.source}
                                            </div>
                                            <div className="flex items-center gap-1 sm:px-4 md:px-6 lg:px-8">
                                                <ClockIcon className="w-3 h-3 sm:px-4 md:px-6 lg:px-8" />
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
}
                <Widget title="Trade Rumors">
                    <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                        {tradeRumors.map((rumor, index) => (
}
                            <motion.div
                                key={rumor.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-4 border border-[var(--panel-border)] rounded-lg bg-gradient-to-r from-purple-500/5 to-blue-500/5 sm:px-4 md:px-6 lg:px-8"
                            >
                                <div className="flex items-start justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
                                    <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                        <span className="text-sm font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                            Trade Interest
                                        </span>
                                        <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full sm:px-4 md:px-6 lg:px-8">
                                            {Math.round(rumor.probability * 100)}% probability
                                        </span>
                                    </div>
                                    <span className={`text-xs ${getImpactColor(rumor.impact)}`}>
                                        {rumor.impact}
                                    </span>
                                </div>
                                <p className="text-sm text-[var(--text-secondary)] mb-3 sm:px-4 md:px-6 lg:px-8">
                                    <strong>{rumor.team}:</strong> {rumor.details}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                    <div className="flex items-center gap-1 sm:px-4 md:px-6 lg:px-8">
                                        <UserIcon className="w-3 h-3 sm:px-4 md:px-6 lg:px-8" />
                                        {rumor.source}
                                    </div>
                                    <div className="flex items-center gap-1 sm:px-4 md:px-6 lg:px-8">
                                        <ClockIcon className="w-3 h-3 sm:px-4 md:px-6 lg:px-8" />
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
}
                <Widget title="No Recent News">
                    <div className="text-center py-8 sm:px-4 md:px-6 lg:px-8">
                        <NewsIcon className="w-12 h-12 text-gray-400 mx-auto mb-4 sm:px-4 md:px-6 lg:px-8" />
                        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                            No Recent News
                        </h3>
                        <p className="text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                            Check back later for the latest updates on {player.name}
                        </p>
                    </div>
                </Widget>
            )}
        </div>
    );
};

const NewsAndUpdatesTabWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <NewsAndUpdatesTab {...props} />
  </ErrorBoundary>
);

export default React.memo(NewsAndUpdatesTabWithErrorBoundary);