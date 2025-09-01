

import { useAppState } from &apos;../contexts/AppContext&apos;;
import { useLeague } from &apos;../hooks/useLeague&apos;;
import { Widget } from &apos;../components/ui/Widget&apos;;
import ErrorDisplay from &apos;../components/core/ErrorDisplay&apos;;
import { NewspaperIcon } from &apos;../components/icons/NewspaperIcon&apos;;
import { generateLeagueNewspaperContent } from &apos;../services/geminiService&apos;;
import LoadingSpinner from &apos;../components/ui/LoadingSpinner&apos;;
import type { NewspaperContent } from &apos;../types&apos;;
import ReactMarkdown from &apos;react-markdown&apos;;
import { motion } from &apos;framer-motion&apos;;

const LeagueNewspaperView: React.FC = () => {
}
    const { state, dispatch } = useAppState();
    const { league } = useLeague();
    const [newspaper, setNewspaper] = React.useState<NewspaperContent | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [selectedWeek, setSelectedWeek] = React.useState(league ? (league.currentWeek > 1 ? league.currentWeek - 1 : 1) : 1);
    
    const maxWeek = league ? league.currentWeek - 1 : 0;
    const cacheKey = league ? `${league.id}_${selectedWeek}` : &apos;&apos;;

    React.useEffect(() => {
}
        if (!league || !cacheKey || maxWeek < 1) {
}
            setIsLoading(false);
            return;

        const cachedNewspaper = state.leagueNewspapers[cacheKey];
        if (cachedNewspaper) {
}
            setNewspaper(cachedNewspaper);
            setIsLoading(false);
            return;

        setIsLoading(true);
        setError(null);
        generateLeagueNewspaperContent(league, selectedWeek)
            .then(data => {
}
                if (data) {
}
                    setNewspaper(data);
                    dispatch({ type: &apos;SET_LEAGUE_NEWSPAPER&apos;, payload: { key: cacheKey, newspaper: data } });
                } else {
}
                    setError("The Oracle could not write this week&apos;s newspaper.");

            })
            .catch(() => setError("An error occurred while consulting the Oracle."))
            .finally(() => setIsLoading(false));

    }, [league, selectedWeek, cacheKey, state.leagueNewspapers, dispatch, maxWeek]);

    if (!league) {
}
        return <ErrorDisplay title="Error" message="Please select a league." onRetry={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;DASHBOARD&apos; })} />;

     if (maxWeek < 1) {
}
        return <ErrorDisplay title="Not Available" message="The newspaper will be published after Week 1 is complete." onRetry={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;LEAGUE_HUB&apos; })} />;

    return (
        <div className="w-full h-full flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-secondary)]/5">
            <header className="flex-shrink-0 flex justify-between items-center mb-6">
                <div>
                    <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-wider uppercase text-[var(--text-primary)]">
                        League Newspaper
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] tracking-widest">{league.name}</p>
                </div>
                <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2">
                        <button onClick={() => setSelectedWeek(w => w - 1)} className="glass-button px-3 py-1 text-sm">
                            &lt;
                        </button>
                        <span className="font-bold w-24 text-center">Week {selectedWeek} Issue</span>
                        <button onClick={() => setSelectedWeek(w => w + 1)} className="glass-button px-3 py-1 text-sm">
                            &gt;
                        </button>
                    </div>
                    <button onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;LEAGUE_HUB&apos; }) className="glass-button">
                        Back to League Hub
                    </button>
                </div>
            </header>
            <main className="flex-grow glass-pane rounded-2xl overflow-hidden">
                <div className="p-6 md:p-8 h-full overflow-y-auto">
                    {isLoading ? <LoadingSpinner text="The Oracle is on deadline..." /> :
}
                     error ? <ErrorDisplay message={error} /> :
                     newspaper ? (
                        <motion.div
                            key={selectedWeek}
                            {...{
}
                                initial: { opacity: 0 },
                                animate: { opacity: 1 },
                            }}
                        >
                            <h2 className="font-display text-4xl font-black text-center border-b-4 border-double border-white/50 pb-2 mb-4">
                                {newspaper.masthead}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-2 prose prose-sm prose-invert prose-headings:text-cyan-300">
                                    <h3>{newspaper.leadStory.headline}</h3>
                                    <ReactMarkdown>{newspaper.leadStory.content}</ReactMarkdown>
                                </div>
                                <div className="space-y-6">
                                    {newspaper.articles.map((article, i) => (
}
                                        <div key={i} className="prose prose-sm prose-invert prose-headings:text-cyan-300">
                                            <h4>{article.headline}</h4>
                                            <ReactMarkdown>{article.content}</ReactMarkdown>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                     ) : null}
                </div>
            </main>
        </div>
    );
};

export default LeagueNewspaperView;
