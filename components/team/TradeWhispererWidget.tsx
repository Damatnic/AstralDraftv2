
import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback } from &apos;react&apos;;
import { useLeague } from &apos;../../hooks/useLeague&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { MessageCircleIcon } from &apos;../icons/MessageCircleIcon&apos;;
import { proactivelySuggestTrade } from &apos;../../services/geminiService&apos;;
import type { TradeSuggestion } from &apos;../../types&apos;;
import LoadingSpinner from &apos;../ui/LoadingSpinner&apos;;
import { AnimatePresence, motion } from &apos;framer-motion&apos;;

interface TradeWhispererWidgetProps {
}
    onPropose: (suggestion: TradeSuggestion) => void;

}

const TradeWhispererWidget: React.FC<TradeWhispererWidgetProps> = ({ onPropose }: any) => {
}
    const { league, myTeam } = useLeague();
    const [isLoading, setIsLoading] = React.useState(false);
    const [suggestion, setSuggestion] = React.useState<TradeSuggestion | null>(null);

    const handleFindTrade = async () => {
}
        if (!myTeam || !league) return;
        setIsLoading(true);
        setSuggestion(null);
        try {
}

            const result = await proactivelySuggestTrade(myTeam, league);
            setSuggestion(result);
        
    } catch (error) {
}
        } finally {
}
            setIsLoading(false);

    };
    
    const opponent = league?.teams.find((t: any) => t.id === suggestion?.toTeamId);

    return (
        <Widget title="AI Trade Whisperer" icon={<MessageCircleIcon />}>
            <div className="p-3 sm:px-4 md:px-6 lg:px-8">
                <AnimatePresence mode="wait">
                    {isLoading ? (
}
                        <motion.div key="loading" {...{ initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }}>
                            <LoadingSpinner size="sm" text="Scanning the league for opportunities..." />
                        </motion.div>
                    ) : suggestion && opponent ? (
                        <motion.div
                            key="suggestion"
                            {...{
}
                                initial: { opacity: 0, y: 10 },
                                animate: { opacity: 1, y: 0 },
                            }}
                        >
                            <p className="text-xs italic text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">"{suggestion.rationale}"</p>
                            <div className="text-center text-xs font-bold text-gray-400 mb-2 sm:px-4 md:px-6 lg:px-8">Trade with {opponent.name}</div>
                            
                            <div className="flex justify-end gap-2 mt-2 sm:px-4 md:px-6 lg:px-8">
                                <button onClick={() => setSuggestion(null)}
                                <button onClick={() => onPropose(suggestion)}
                            </div>
                        </motion.div>
                    ) : (
                         <motion.div key="default" {...{ initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }}>
                            <p className="text-center text-xs text-gray-400 mb-2 sm:px-4 md:px-6 lg:px-8">Let the Oracle find a mutually beneficial trade to improve your roster.</p>
                            <button onClick={handleFindTrade} className="w-full py-1.5 text-xs font-bold bg-cyan-500/10 text-cyan-300 rounded-md hover:bg-cyan-500/20 sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                                Find a Trade
                            </button>
                         </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Widget>
    );
};

const TradeWhispererWidgetWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <TradeWhispererWidget {...props} />
  </ErrorBoundary>
);

export default React.memo(TradeWhispererWidgetWithErrorBoundary);
