

import { useAppState } from &apos;../contexts/AppContext&apos;;
import { useLeague } from &apos;../hooks/useLeague&apos;;
import { SeasonStory } from &apos;../types&apos;;
import { generateNarrativeSeasonStory } from &apos;../services/geminiService&apos;;
import ErrorDisplay from &apos;../components/core/ErrorDisplay&apos;;
import LoadingSpinner from &apos;../components/ui/LoadingSpinner&apos;;
import { motion } from &apos;framer-motion&apos;;
import ReactMarkdown from &apos;react-markdown&apos;;

const SeasonStoryView: React.FC = () => {
}
    const { dispatch } = useAppState();
    const { league, myTeam } = useLeague();
    const [storyData, setStoryData] = React.useState<SeasonStory | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
}
        if (myTeam && league && (league.status === &apos;COMPLETE&apos; || league.status === &apos;PLAYOFFS&apos;)) {
}
            setIsLoading(true);
            generateNarrativeSeasonStory(myTeam, league)
                .then(setStoryData)
                .finally(() => setIsLoading(false));
    }
  }, [myTeam, league]);
    
    if (!league || !myTeam) {
}
        return <ErrorDisplay title="Error" message="Could not load league data." onRetry={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;DASHBOARD&apos; })} />;

    if (league.status !== &apos;COMPLETE&apos; && league.status !== &apos;PLAYOFFS&apos;) {
}
        return <ErrorDisplay title="Not Ready" message="Your season story will be available once the season is complete." onRetry={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;TEAM_HUB&apos; })} />;

    return (
        <div className="w-full h-full flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <header className="flex-shrink-0 flex justify-between items-center mb-6">
                <div>
                    <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-wider uppercase text-[var(--text-primary)]">
                        My Season Story
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] tracking-widest">{myTeam.name} - {league.name}</p>
                </div>
                <button onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;TEAM_HUB&apos; }) className="back-btn">
                    Back to Team Hub
                </button>
            </header>
            <main className="flex-grow max-w-4xl mx-auto w-full glass-pane rounded-2xl overflow-hidden">
                 <div className="p-6 md:p-8 h-full overflow-y-auto">
                    {isLoading ? <LoadingSpinner text="The Oracle is chronicling your epic season..." /> :
}
                     storyData ? (
                        <motion.div
                            className="prose prose-invert prose-headings:text-cyan-300 prose-strong:text-yellow-300"
                            {...{
}
                                initial: { opacity: 0 },
                                animate: { opacity: 1 },
                                transition: { duration: 0.8 },
                            }}
                        >
                             <h1>{storyData.title}</h1>
                             <ReactMarkdown>{storyData.narrative}</ReactMarkdown>
                        </motion.div>
                     ) : (
                        <ErrorDisplay title="Could not generate story" message="The Oracle was unable to write your season&apos;s story. Please try again later." />
                     )

                </div>
            </main>
        </div>
    );
};

export default SeasonStoryView;
