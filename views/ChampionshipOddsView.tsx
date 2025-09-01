
import { useAppState } from &apos;../contexts/AppContext&apos;;
import { useLeague } from &apos;../hooks/useLeague&apos;;
import { Widget } from &apos;../components/ui/Widget&apos;;
import ErrorDisplay from &apos;../components/core/ErrorDisplay&apos;;
import { generateChampionshipProbabilities } from &apos;../services/geminiService&apos;;
import { TrophyIcon } from &apos;../components/icons/TrophyIcon&apos;;
import LoadingSpinner from &apos;../components/ui/LoadingSpinner&apos;;
import ChampionshipProbChart from &apos;../components/analytics/ChampionshipProbChart&apos;;
import { Avatar } from &apos;../components/ui/Avatar&apos;;
import { AnimatePresence } from &apos;framer-motion&apos;;
import TradeScenarioModal from &apos;../components/modals/TradeScenarioModal&apos;;
import { FlaskConicalIcon } from &apos;../components/icons/FlaskConicalIcon&apos;;

const ChampionshipOddsView: React.FC = () => {
}
    const { state, dispatch } = useAppState();
    const { league } = useLeague();
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSimModalOpen, setIsSimModalOpen] = React.useState(false);

    React.useEffect(() => {
}
        const needsUpdate = league?.teams.some((t: any) => {
}
            const history = t.championshipProbHistory || [];
            return !history.some((h: any) => h.week === league.currentWeek);
        });

        if (league && needsUpdate && (league.status === &apos;IN_SEASON&apos; || league.status === &apos;PLAYOFFS&apos;)) {
}
            setIsLoading(true);
            generateChampionshipProbabilities(league)
                .then(data => {
}
                    if (data) {
}
                        dispatch({ type: &apos;SET_CHAMPIONSHIP_PROBS&apos;, payload: { leagueId: league.id, data } });

                })
                .finally(() => setIsLoading(false));

    }, [league, dispatch]);

    if (!league || !(league.status === &apos;IN_SEASON&apos; || league.status === &apos;PLAYOFFS&apos; || league.status === &apos;COMPLETE&apos;)) {
}
        return <ErrorDisplay title="Not Available" message="Championship odds are calculated during the season." onRetry={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;ANALYTICS_HUB&apos; })} />;

    if (league.settings.aiAssistanceLevel === &apos;BASIC&apos;) {
}
        return <ErrorDisplay title="Feature Disabled" message="Championship Odds are disabled in leagues with Basic AI Assistance." onRetry={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;ANALYTICS_HUB&apos; })} />;

    const rankedTeams = [...league.teams]
        .map((team: any) => {
}
            const history = team.championshipProbHistory || [];
            const currentProb = history.length > 0 ? history.find((h: any) => h.week === league.currentWeek)?.probability ?? history[history.length - 1].probability : 0;
            return { ...team, currentProb };
        })
        .sort((a, b) => b.currentProb - a.currentProb);

    return (
        <div className="w-full h-full flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <header className="flex-shrink-0 flex justify-between items-center mb-6">
                <div>
                    <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-wider uppercase text-[var(--text-primary)]">
                        Championship Odds
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] tracking-widest">{league.name}</p>
                </div>
                <div className="flex items-center gap-2">
                     <button 
                        onClick={() => setIsSimModalOpen(true)}
                    >
                        <FlaskConicalIcon /> Run Trade Scenario
                    </button>
                    <button onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;ANALYTICS_HUB&apos; }) className="back-btn">
                        Back to Analytics Hub
                    </button>
                </div>
            </header>
            <main className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Widget title="Probability Trends" icon={<TrophyIcon />}>
                        <div className="p-4 h-[60vh]">
                            {isLoading ? <LoadingSpinner text="Calculating probabilities..." /> : <ChampionshipProbChart league={league} />}
                        </div>
                    </Widget>
                </div>
                <div className="lg:col-span-1">
                     <Widget title={`Current Odds - Week ${league.currentWeek}`}>
                        <div className="p-2 space-y-1 max-h-[60vh] overflow-y-auto">
                            {rankedTeams.map((team, index) => (
}
                                <div key={team.id} className={`flex items-center justify-between p-2 rounded-md ${index === 0 ? &apos;bg-yellow-500/10&apos; : &apos;bg-black/10&apos;}`}>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold w-6">{index + 1}</span>
                                        <Avatar avatar={team.avatar} className="w-8 h-8 rounded-md" />
                                        <p className="font-semibold text-sm">{team.name}</p>
                                    </div>
                                    <p className="font-bold text-yellow-300">{team.currentProb.toFixed(1)}%</p>
                                </div>
                            ))}
                        </div>
                    </Widget>
                </div>
            </main>
             <AnimatePresence>
                {isSimModalOpen && (
}
                    <TradeScenarioModal>
                        league={league}
                        onClose={() => setIsSimModalOpen(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChampionshipOddsView;
