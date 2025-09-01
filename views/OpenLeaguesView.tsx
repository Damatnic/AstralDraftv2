import { useAppState } from &apos;../contexts/AppContext&apos;;
import { Widget } from &apos;../components/ui/Widget&apos;;
import { GlobeIcon } from &apos;../components/icons/GlobeIcon&apos;;
import type { League } from &apos;../types&apos;;

const OpenLeaguesView: React.FC = () => {
}
    const { state, dispatch } = useAppState();

    const openLeagues = state.leagues.filter((l: any) => {
}
        const humanMembers = l.members.filter((m: any) => !m.id.startsWith(&apos;ai_&apos;));
        return l.isPublic && humanMembers.length < l.settings.teamCount;
    });
    
    const handleJoin = (leagueId: string) => {
}
        dispatch({ type: &apos;JOIN_OPEN_LEAGUE&apos;, payload: { leagueId } });
        dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: { message: &apos;Successfully joined league!&apos;, type: &apos;SYSTEM&apos; }});
    };

    return (
        <div className="w-full h-full flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <header className="flex-shrink-0 flex justify-between items-center mb-6">
                <div>
                    <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-wider uppercase text-[var(--text-primary)]">
                        Open Leagues
                    </h1>
                </div>
                <button onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;DASHBOARD&apos; }) className="back-btn">
                    Back to Dashboard
                </button>
            </header>
            <main className="flex-grow max-w-2xl mx-auto w-full">
                <Widget title="Public Leagues" icon={<GlobeIcon />}>
                    <div className="p-4 space-y-3">
                        {openLeagues.length > 0 ? (
}
                            openLeagues.map((league: any) => (
                                <div key={league.id} className="p-3 bg-black/10 rounded-lg flex items-center justify-between hover:bg-black/20">
                                    <div>
                                        <p className="font-bold text-white">{league.name}</p>
                                        <p className="text-xs text-secondary">
                                            {league.settings.teamCount} Teams • {league.settings.draftFormat} • {league.settings.scoring}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleJoin(league.id)}
                                    >
//                                         Join
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-sm text-secondary py-8">No open public leagues available right now.</p>
                        )}
                    </div>
                </Widget>
            </main>
        </div>
    );
};

export default OpenLeaguesView;