/**
 * Enhanced Mobile Dashboard View
 * Mobile-responsive dashboard with touch-friendly components
 */

import { useAppState } from &apos;../contexts/AppContext&apos;;
import { useMediaQuery } from &apos;../hooks/useMediaQuery&apos;;
import { motion } from &apos;framer-motion&apos;;
import { View } from &apos;../types&apos;;
import MobilePullToRefresh from &apos;../components/mobile/MobilePullToRefresh&apos;;
import { 
}
    TrophyIcon,
    BarChart3Icon,
    UsersIcon,
    CalendarIcon,
    TrendingUpIcon,
    BellIcon,
    PlusIcon,
//     SearchIcon
} from &apos;lucide-react&apos;;

interface MobileDashboardWidgetProps {
}
    title: string;
    icon: React.ReactNode;
    value: string | number;
    subtitle?: string;
    trend?: &apos;up&apos; | &apos;down&apos; | &apos;stable&apos;;
    color: string;
    onClick?: () => void;

}

const MobileDashboardWidget: React.FC<MobileDashboardWidgetProps> = ({
}
    title,
    icon,
    value,
    subtitle,
    trend,
    color,
//     onClick
}: any) => {
}
    const getTrendColor = (trendType: &apos;up&apos; | &apos;down&apos; | &apos;stable&apos;) => {
}
        switch (trendType) {
}
            case &apos;up&apos;: return &apos;text-green-400&apos;;
            case &apos;down&apos;: return &apos;text-red-400&apos;;
            default: return &apos;text-gray-400&apos;;

    };

    return (
        <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={onClick}`}
        >
            <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${color}`}>
                    {icon}
                </div>
                {trend && (
}
                    <div className={`text-xs ${getTrendColor(trend)}`}>
                        <TrendingUpIcon className={`w-3 h-3 ${trend === &apos;down&apos; ? &apos;rotate-180&apos; : &apos;&apos;}`} />
                    </div>
                )}
            </div>
            
            <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                {value}
            </div>
            
            <div className="text-sm text-[var(--text-secondary)]">
                {title}
            </div>
            
            {subtitle && (
}
                <div className="text-xs text-[var(--text-tertiary)] mt-1">
                    {subtitle}
                </div>
            )}
        </motion.div>
    );
};

interface QuickActionProps {
}
    icon: React.ReactNode;
    label: string;
    color: string;
    onClick: () => void;

}

const QuickAction: React.FC<QuickActionProps> = ({ icon, label, color, onClick }: any) => (
    <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onClick}`}
    >
        <div className="w-8 h-8 flex items-center justify-center">
            {icon}
        </div>
        <span className="text-xs text-[var(--text-primary)] font-medium">
            {label}
        </span>
    </motion.button>
);

const EnhancedDashboardView: React.FC = () => {
}
    const { state, dispatch } = useAppState();
    const isMobile = useMediaQuery(&apos;(max-width: 768px)&apos;);
    const activeLeague = state.leagues.find((l: any) => l.id === state.activeLeagueId);

    const handleRefresh = async () => {
}
        // Simulate data refresh
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Here you would typically trigger actual data fetching
    };

    const handleViewChange = (view: View) => {
}
        dispatch({ type: &apos;SET_VIEW&apos;, payload: view });
    };

    const mockData = {
}
        totalPoints: &apos;1,247.6&apos;,
        weeklyRank: &apos;3rd&apos;,
        leagueCount: state.leagues.length,
        activeMatchups: 2,
        notifications: 5
    };

    if (isMobile) {
}
        return (
            <div className="h-full bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-secondary)]/5">
                <MobilePullToRefresh onRefresh={handleRefresh}>
                    <div className="p-4 space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-[var(--text-primary)]">
//                                     Dashboard
                                </h1>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    Welcome back, {state.user?.name || &apos;User&apos;}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                                    <SearchIcon className="w-5 h-5" />
                                </button>
                                <button className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                                    <BellIcon className="w-5 h-5" />
                                    {mockData.notifications > 0 && (
}
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                            {mockData.notifications}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <MobileDashboardWidget>
                                title="Total Points"
                                icon={<TrophyIcon className="w-5 h-5 text-white" />}
                                value={mockData.totalPoints}
                                subtitle="Season total"
                                trend="up"
                                color="bg-blue-500"
                                onClick={() => handleViewChange(&apos;ANALYTICS_HUB&apos;)}
                            
                            <MobileDashboardWidget>
                                title="Weekly Rank"
                                icon={<BarChart3Icon className="w-5 h-5 text-white" />}
                                value={mockData.weeklyRank}
                                subtitle="This week"
                                trend="stable"
                                color="bg-green-500"
                                onClick={() => handleViewChange(&apos;LEAGUE_STANDINGS&apos;)}
                            
                            <MobileDashboardWidget>
                                title="My Leagues"
                                icon={<UsersIcon className="w-5 h-5 text-white" />}
                                value={mockData.leagueCount}
                                subtitle="Active leagues"
                                color="bg-purple-500"
                                onClick={() => handleViewChange(&apos;LEAGUE_HUB&apos;)}
                            
                            <MobileDashboardWidget>
                                title="Matchups"
                                icon={<CalendarIcon className="w-5 h-5 text-white" />}
                                value={mockData.activeMatchups}
                                subtitle="This week"
                                color="bg-orange-500"
                                onClick={() => handleViewChange(&apos;MATCHUP&apos;)}
                        </div>

                        {/* Quick Actions */}
                        <div>
                            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                                Quick Actions
                            </h2>
                            <div className="grid grid-cols-4 gap-3">
                                <QuickAction>
                                    icon={<PlusIcon className="w-5 h-5 text-blue-400" />}
                                    label="Create League"
                                    color="bg-blue-500/10"
                                    onClick={() => handleViewChange(&apos;CREATE_LEAGUE&apos;)}
                                
                                <QuickAction>
                                    icon={<TrophyIcon className="w-5 h-5 text-green-400" />}
                                    label="Draft Room"
                                    color="bg-green-500/10"
                                    onClick={() => handleViewChange(&apos;DRAFT_ROOM&apos;)}
                                
                                <QuickAction>
                                    icon={<BarChart3Icon className="w-5 h-5 text-purple-400" />}
                                    label="Analytics"
                                    color="bg-purple-500/10"
                                    onClick={() => handleViewChange(&apos;ANALYTICS_HUB&apos;)}
                                
                                <QuickAction>
                                    icon={<UsersIcon className="w-5 h-5 text-orange-400" />}
                                    label="Teams"
                                    color="bg-orange-500/10"
                                    onClick={() => handleViewChange(&apos;TEAM_HUB&apos;)}
                            </div>
                        </div>

                        {/* Active League Summary */}
                        {activeLeague && (
}
                            <div>
                                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                                    Current League
                                </h2>
                                <motion.div
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleViewChange(&apos;LEAGUE_HUB&apos;)}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-medium text-[var(--text-primary)]">
                                            {activeLeague.name}
                                        </h3>
                                        <span className="text-sm text-[var(--text-secondary)]">
                                            Week {activeLeague.currentWeek}
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <div className="text-lg font-bold text-[var(--text-primary)]">
                                                {activeLeague.teams.length}
                                            </div>
                                            <div className="text-xs text-[var(--text-secondary)]">
//                                                 Teams
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <div className="text-lg font-bold text-[var(--text-primary)]">
                                                {activeLeague.schedule?.filter((m: any) => m.week === activeLeague.currentWeek).length || 0}
                                            </div>
                                            <div className="text-xs text-[var(--text-secondary)]">
//                                                 Matchups
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <div className="text-lg font-bold text-[var(--text-primary)]">
                                                $200
                                            </div>
                                            <div className="text-xs text-[var(--text-secondary)]">
//                                                 Budget
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}

                        {/* Recent Activity */}
                        <div>
                            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                                Recent Activity
                            </h2>
                            <div className="space-y-2">
                                {[
}
                                    { text: "John drafted Patrick Mahomes", time: "2 minutes ago", type: "draft" },
                                    { text: "Trade proposal received", time: "1 hour ago", type: "trade" },
                                    { text: "Waiver claim processed", time: "3 hours ago", type: "waiver" }
                                ].map((activity: any) => (
                                    <div key={`${activity.type}-${activity.time}`} className="glass-pane rounded-lg p-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-[var(--text-primary)]">
                                                {activity.text}
                                            </span>
                                            <span className="text-xs text-[var(--text-secondary)]">
                                                {activity.time}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom padding for mobile navigation */}
                        <div className="h-20" />
                    </div>
                </MobilePullToRefresh>
            </div>
        );

    // Fallback to original dashboard for desktop
    return (
        <div className="p-6 bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-secondary)]/5 min-h-screen">
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">
//                 Dashboard
            </h1>
            <p className="text-[var(--text-secondary)]">
                This is the desktop version of the dashboard.
                Mobile optimizations are active on screens ≤ 768px wide.
            </p>
        </div>
    );
};

export default EnhancedDashboardView;
