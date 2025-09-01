
import { ErrorBoundary } from &apos;../../ui/ErrorBoundary&apos;;
import { motion } from &apos;framer-motion&apos;;
import type { Player, League, PlayerStory } from &apos;../../../types&apos;;
import { generatePlayerStory } from &apos;../../../services/geminiService&apos;;
import LoadingSpinner from &apos;../../ui/LoadingSpinner&apos;;
import ReactMarkdown from &apos;react-markdown&apos;;

interface StoryTabProps {
}
  player: Player;
  league: League;

}

const StoryTab: React.FC<StoryTabProps> = ({ player, league }: any) => {
}
    const [story, setStory] = React.useState<PlayerStory | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
}
        const fetchStory = async () => {
}
            setIsLoading(true);
            setError(null);
            try {
}
                const result = await generatePlayerStory(player, league);
                setStory(result);
            } catch (error) {
}
                setError("The Oracle couldn&apos;t write this player&apos;s story.");
            } finally {
}
                setIsLoading(false);
            }
        };
        fetchStory();
    }, [player, league]);

    return (
        <motion.div
            className="space-y-6 sm:px-4 md:px-6 lg:px-8"
            {...{
}
                initial: { opacity: 0, x: -10 },
                animate: { opacity: 1, x: 0 },
                transition: { duration: 0.3 },
            }}
        >
            {isLoading && <LoadingSpinner text="Chronicling this player&apos;s journey..." />}
            {error && <p className="text-center text-red-400 sm:px-4 md:px-6 lg:px-8">{error}</p>}
            {story && (
}
                 <div className="prose prose-invert prose-headings:text-cyan-300 prose-strong:text-yellow-300 sm:px-4 md:px-6 lg:px-8">
                    <h2>{story.title}</h2>
                    <ReactMarkdown>{story.narrative}</ReactMarkdown>
                </div>
            )}
        </motion.div>
    );
};

const StoryTabWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <StoryTab {...props} />
  </ErrorBoundary>
);

export default React.memo(StoryTabWithErrorBoundary);
