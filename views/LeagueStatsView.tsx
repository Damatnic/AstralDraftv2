
import { useAppState } from &apos;../contexts/AppContext&apos;;
import { useLeague } from &apos;../hooks/useLeague&apos;;
import { Widget } from &apos;../components/ui/Widget&apos;;
import ErrorDisplay from &apos;../components/core/ErrorDisplay&apos;;
import { calculateLeagueStats } from &apos;../utils/stats&apos;;
import type { TeamStats } from &apos;../utils/stats&apos;;
import { Avatar } from &apos;../components/ui/Avatar&apos;;
import { TrophyIcon } from &apos;../components/icons/TrophyIcon&apos;;
import { FlameIcon } from &apos;../components/icons/FlameIcon&apos;;
import { ShieldAlertIcon } from &apos;../components/icons/ShieldAlertIcon&apos;;

const Leaderboard: React.FC<{ title: string; icon: React.ReactNode; data: TeamStats[]; valueKey: keyof TeamStats; subtext?: (stat: TeamStats) => string }> = ({ title, icon, data, valueKey, subtext }: any) => (
    <Widget title={title} icon={icon}>
        <div className="p-2 space-y-1">
            {data.map((stat, index) => (
}
                <div key={stat.teamId} className={`flex items-center gap-3 p-2 rounded-md ${index === 0 ? &apos;bg-yellow-500/10&apos; : &apos;bg-black/10&apos;}`}>
                    <span className="font-bold text-lg w-6 text-center">{index + 1}</span>
                    <Avatar avatar={stat.avatar} className="w-8 h-8 rounded-md" />
                    <div className="flex-grow">
                        <p className="font-semibold text-sm">{stat.teamName}</p>
                        {subtext && <p className="text-xs text-gray-400">{subtext(stat)}</p>}
                    </div>
                    <p className="font-bold text-lg font-mono">
                        {(valueKey === &apos;highestWeek&apos; ? stat.highestWeek.score : stat[valueKey] as number).toFixed(2)}
                    </p>
                </div>
            ))}
        </div>
    </Widget>
);

const LeagueStatsView: React.FC = () => {
}
    const { dispatch } = useAppState();
    const { league } = useLeague();
    
    if (!league || league.status === &apos;PRE_DRAFT&apos; || league.status === &apos;DRAFTING&apos;) {
}
        return <ErrorDisplay title="Not Available" message="League stats will be available once the season starts." onRetry={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;LEAGUE_HUB&apos; })} />;

    const leaderboards = calculateLeagueStats(league);

    return (
        <div className="w-full h-full flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <header className="flex-shrink-0 flex justify-between items-center mb-6">
                <div>
                    <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-wider uppercase text-[var(--text-primary)]">
                        League Statistics
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] tracking-widest">{league.name}</p>
                </div>
                <button onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;LEAGUE_HUB&apos; }) className="back-btn">
                    Back to League Hub
                </button>
            </header>
            <main className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Leaderboard>
                    title="Total Points For"
                    icon={<TrophyIcon />}
                    data={leaderboards.pointsFor}
                    valueKey="totalPointsFor"
                />
                <Leaderboard>
                    title="Best Week"
                    icon={<FlameIcon />}
                    data={leaderboards.highestSingleGame}
                    valueKey="highestWeek"
                    subtext={(stat: any) => `Week ${stat.highestWeek.week}`}
                />
                <Leaderboard>
                    title="Total Points Against"
                    icon={<ShieldAlertIcon />}
                    data={leaderboards.pointsAgainst}
                    valueKey="totalPointsAgainst"
                />
            </main>
        </div>
    );
};

export default LeagueStatsView;