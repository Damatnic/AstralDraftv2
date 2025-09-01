

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback } from &apos;react&apos;;
import type { Team, League, AiLineupSuggestion } from &apos;../../types&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { BrainCircuitIcon } from &apos;../icons/BrainCircuitIcon&apos;;
import { getAiOptimalLineup } from &apos;../../services/geminiService&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import LoadingSpinner from &apos;../ui/LoadingSpinner&apos;;

interface AiCoManagerWidgetProps {
}
    team: Team;
    league: League;
    dispatch: React.Dispatch<any>;

}

const AiCoManagerWidget: React.FC<AiCoManagerWidgetProps> = ({ team, league, dispatch }: any) => {
}
    const [isLoading, setIsLoading] = React.useState(false);
    const [suggestion, setSuggestion] = React.useState<AiLineupSuggestion | null>(null);

    const handleGetLineup = async () => {
}
        setIsLoading(true);
        setSuggestion(null);
        try {
}

            const result = await getAiOptimalLineup(team, league);
            setSuggestion(result);
        
    } catch (error) {
}
            dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: { message: "Could not get a lineup suggestion.", type: &apos;SYSTEM&apos; } });
        } finally {
}
            setIsLoading(false);

    };

    const handleAcceptLineup = () => {
}
        if (!suggestion) return;
        dispatch({
}
            type: &apos;SET_LINEUP&apos;,
            payload: { leagueId: league.id, teamId: team.id, playerIds: suggestion.recommendedStarters }
        });
        dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: { message: &apos;Optimal lineup has been set!&apos;, type: &apos;SYSTEM&apos; }});
        setSuggestion(null);
    };

    return (
        <Widget title="AI Co-Manager" icon={<BrainCircuitIcon />}>
            <div className="p-3 sm:px-4 md:px-6 lg:px-8">
                <AnimatePresence mode="wait">
                    {isLoading ? (
}
                        <motion.div key="loading" {...{ initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }}>
                            <LoadingSpinner size="sm" text="Optimizing your lineup..." />
                        </motion.div>
                    ) : suggestion ? (
                        <motion.div
                            key="suggestion"
                            {...{
}
                                initial: { opacity: 0, y: 10 },
                                animate: { opacity: 1, y: 0 },
                            }}
                        >
                            <p className="text-xs text-cyan-300 font-bold sm:px-4 md:px-6 lg:px-8">Oracle&apos;s Recommendation:</p>
                            <p className="text-xs italic text-gray-300 my-1 sm:px-4 md:px-6 lg:px-8">"{suggestion.reasoning}"</p>
                            <div className="flex gap-2 mt-2 sm:px-4 md:px-6 lg:px-8">
                                <button onClick={() => setSuggestion(null)}
                                <button onClick={handleAcceptLineup} className="flex-1 px-2 py-1 text-xs font-bold rounded-md bg-green-500 text-white hover:bg-green-400 sm:px-4 md:px-6 lg:px-8" aria-label="Action button">Set Lineup</button>
                            </div>
                        </motion.div>
                    ) : (
                         <motion.div key="default" {...{ initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }}>
                            <p className="text-center text-xs text-gray-400 mb-2 sm:px-4 md:px-6 lg:px-8">Let the Oracle recommend your best starting lineup for this week.</p>
                            <button onClick={handleGetLineup} className="w-full py-1.5 text-xs font-bold bg-cyan-500/10 text-cyan-300 rounded-md hover:bg-cyan-500/20 sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                                Get Optimal Lineup
                            </button>
                         </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Widget>
    );
};

const AiCoManagerWidgetWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <AiCoManagerWidget {...props} />
  </ErrorBoundary>
);

export default React.memo(AiCoManagerWidgetWithErrorBoundary);
