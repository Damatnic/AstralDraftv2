
import { useAppState } from &apos;../contexts/AppContext&apos;;
import { Widget } from &apos;../components/ui/Widget&apos;;
import { UserIcon } from &apos;../components/icons/UserIcon&apos;;
import { Avatar } from &apos;../components/ui/Avatar&apos;;
import { TrophyIcon } from &apos;../components/icons/TrophyIcon&apos;;
import { BookOpenIcon } from &apos;../components/icons/BookOpenIcon&apos;;
import { calculateManagerStats, calculateCareerHistory } from &apos;../utils/careerStats&apos;;
import RivalryWidget from &apos;../components/manager/RivalryWidget&apos;;
import AchievementsWidget from &apos;../components/profile/AchievementsWidget&apos;;

const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }: any) => (
    <div className="bg-white/5 p-3 rounded-lg text-center">
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
    </div>
);

const ManagerView: React.FC = () => {
}
    const { state, dispatch } = useAppState();
    
    const managerId = state.activeManagerId;
    
    const manager = React.useMemo(() => {
}
        if (!managerId) return null;
        for (const league of state.leagues) {
}
            const member = league.members.find((m: any) => m.id === managerId);
            if (member) return member;

        return null;
    }, [managerId, state.leagues]);

    const stats = React.useMemo(() => {
}
        if (!manager) return { championships: 0, leaguesJoined: 0, trophies: [] };
        return calculateManagerStats(manager, state.leagues);
    }, [manager, state.leagues]);

    const careerHistory = React.useMemo(() => {
}
        if (!managerId) return [];
        return calculateCareerHistory(managerId, state.leagues);
    }, [managerId, state.leagues]);

    if (!manager) {
}
        return (
            <div className="w-full h-full flex flex-col items-center justify-center">
                <p>Manager not found.</p>
                 <button onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;LEAGUE_HUB&apos; }) className="glass-button-primary mt-4">
                    Back to League Hub
                </button>
            </div>
        );

    const memberSinceDate = manager.memberSince
        ? new Date(manager.memberSince).toLocaleDateString(&apos;en-US&apos;, { year: &apos;numeric&apos;, month: &apos;long&apos; })
        : &apos;a long time ago&apos;;

    return (
        <div className="w-full h-full flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-secondary)]/5">
            <header className="flex-shrink-0 flex justify-between items-center mb-6">
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-wider uppercase text-[var(--text-primary)]">
                    Manager Profile
                </h1>
                <button onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;LEAGUE_HUB&apos; }) className="glass-button">
                    Back to League Hub
                </button>
            </header>
            <main className="flex-grow max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-1 space-y-6">
                        <Widget title="Identity" icon={<UserIcon />}>
                            <div className="p-4 flex flex-col items-center text-center">
                                <Avatar avatar={manager.avatar} className="w-28 h-28 text-7xl rounded-full mb-4 ring-4 ring-cyan-400/50" />
                                <h2 className="text-2xl font-bold font-display">{manager.name}</h2>
                                <p className="text-xs text-gray-400">Member since {memberSinceDate}</p>
                                <p className="text-sm text-gray-300 mt-3 italic">"{manager.bio || &apos;No bio set.&apos;}"</p>
                            </div>
                        </Widget>
                        {managerId && <RivalryWidget opponentManagerId={managerId} />}
                        <Widget title="Career Stats">
                            <div className="p-4 grid grid-cols-2 gap-4">
                                <StatCard label="Championships" value={stats.championships} />
                                <StatCard label="Leagues Joined" value={stats.leaguesJoined} />
                            </div>
                        </Widget>
                        <AchievementsWidget badges={manager.badges || []} />
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <Widget title="League History" icon={<BookOpenIcon />}>
                             <div className="p-4 space-y-3">
                                {careerHistory.map((entry: any) => {
}
                                    const league = state.leagues.find((l: any) => l.id === entry.leagueId);
                                    return (
                                        <div key={entry.key} className="bg-black/10 p-3 rounded-lg flex items-center justify-between">
                                            <div>
                                                <p className="font-bold text-white">{entry.season} Season - <span className="text-cyan-300">{entry.leagueName}</span></p>
                                                {entry.isComplete ? (
}
                                                    <p className="text-sm text-gray-300">
                                                        Finished <span className="font-bold">{entry.rank}</span> / {league?.teams.length} ({entry.record.wins}-{entry.record.losses}-{entry.record.ties})
                                                        {entry.isChampion && <span className="ml-2">🏆</span>}
                                                    </p>
                                                ) : (
                                                    <p className="text-sm text-gray-300">Current Record: {entry.record.wins}-{entry.record.losses}-{entry.record.ties} (Rank {entry.rank})</p>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                                {careerHistory.length === 0 && <p className="text-sm text-center text-gray-500 py-4">No league history yet.</p>}
                            </div>
                        </Widget>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ManagerView;
