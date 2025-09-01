
import { ErrorBoundary } from &apos;../../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo } from &apos;react&apos;;
import { motion } from &apos;framer-motion&apos;;
import type { Player, NewsItem } from &apos;../../../types&apos;;
import { NewsIcon } from &apos;../../icons/NewsIcon&apos;;
import { useAppState } from &apos;../../../contexts/AppContext&apos;;
import { generatePlayerNickname, summarizeFantasyImpact } from &apos;../../../services/geminiService&apos;;
import { SparklesIcon } from &apos;../../icons/SparklesIcon&apos;;
import LoadingSpinner from &apos;../../ui/LoadingSpinner&apos;;

interface IntelligenceTabProps {
}
  player: Player;

}

const IntelCard: React.FC<{ label: string; value: string; icon: string }> = ({ label, value, icon}: any) => (
    <div className="bg-white/5 p-3 rounded-lg sm:px-4 md:px-6 lg:px-8">
        <p className="text-sm text-gray-400 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">{icon} {label}</p>
        <p className="font-semibold text-white mt-1 sm:px-4 md:px-6 lg:px-8">{value}</p>
    </div>
);

const NewsItemCard: React.FC<{ news: NewsItem }> = ({ news }: any) => {
}
    const { state, dispatch } = useAppState();
    const [isLoading, setIsLoading] = React.useState(false);
    const analysis = state.newsImpactAnalyses[news.headline];

    const handleAnalyze = async () => {
}
    try {
}
        if (analysis) return;
        setIsLoading(true);
        const result = await summarizeFantasyImpact(news.headline);
        if (result) {
}
            dispatch({ type: &apos;SET_NEWS_IMPACT&apos;, payload: { headline: news.headline, analysis: result } });
        }
        setIsLoading(false);
    } catch (error) {
}
      console.error(&apos;Error in handleAnalyze:&apos;, error);
      setIsLoading(false);
    }
  };

    return (
        <div className="bg-white/5 p-3 rounded-lg text-sm sm:px-4 md:px-6 lg:px-8">
            <p className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">{news.headline}</p>
            <p className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">{news.date} - {news.source}</p>
            {analysis ? (
}
                 <div className="mt-2 pt-2 border-t border-white/10 sm:px-4 md:px-6 lg:px-8">
                    <p className="text-xs text-cyan-300/80 font-semibold flex items-center gap-1 sm:px-4 md:px-6 lg:px-8">
                        <SparklesIcon className="w-3 h-3 sm:px-4 md:px-6 lg:px-8" />
                        Oracle&apos;s Take
                    </p>
                    <p className="text-xs italic text-gray-300 sm:px-4 md:px-6 lg:px-8">"{analysis}"</p>
                </div>
            ) : (
                <div className="mt-2 sm:px-4 md:px-6 lg:px-8">
                    <button onClick={handleAnalyze} disabled={isLoading} className="flex items-center gap-1.5 px-2 py-1 bg-cyan-500/10 text-cyan-300 text-xs font-bold rounded-md hover:bg-cyan-500/20 disabled:opacity-50 sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                        {isLoading ? &apos;Analyzing...&apos; : <><SparklesIcon /> Analyze Impact</>}
                    </button>
                </div>
            )}
        </div>
    );
};

const IntelligenceTab: React.FC<IntelligenceTabProps> = ({ player }: any) => {
}
    const { state, dispatch } = useAppState();
    const nickname = state.playerNicknames[player.id];
    const [isGeneratingNickname, setIsGeneratingNickname] = React.useState(false);
    const { astralIntelligence: intel, newsFeed } = player;

    const handleGenerateNickname = async () => {
}
        try {
}
            setIsGeneratingNickname(true);
            const newNickname = await generatePlayerNickname(player);
            if (newNickname) {
}
                dispatch({ type: &apos;SET_PLAYER_NICKNAME&apos;, payload: { playerId: player.id, nickname: newNickname } });
                dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: { message: `Nickname for ${player.name} generated!`, type: &apos;SYSTEM&apos; } });
            } else {
}
                dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: { message: &apos;Could not generate a nickname.&apos;, type: &apos;SYSTEM&apos; } });
            }
            setIsGeneratingNickname(false);
        } catch (error) {
}
            console.error(&apos;Error in handleGenerateNickname:&apos;, error);
            setIsGeneratingNickname(false);
        }
    };

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
            <div>
                <h3 className="font-bold text-lg text-cyan-300 mb-2 sm:px-4 md:px-6 lg:px-8">Astral Intelligence Report</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                    {nickname ? (
}
                        <IntelCard label="Nickname" value={nickname} icon="🏷️" />
                    ) : (
                        <div className="bg-white/5 p-3 rounded-lg flex flex-col items-center justify-center text-center sm:px-4 md:px-6 lg:px-8">
                            <p className="text-xs text-gray-400 mb-2 sm:px-4 md:px-6 lg:px-8">The Oracle can bestow a unique nickname upon this player.</p>
                            <button
                                onClick={handleGenerateNickname}
                                disabled={isGeneratingNickname}
                                className="flex items-center gap-2 px-3 py-1.5 bg-transparent border border-cyan-400/50 text-cyan-300 font-bold text-xs rounded-md hover:bg-cyan-400/20 disabled:opacity-50 sm:px-4 md:px-6 lg:px-8"
                             aria-label="Action button">
                                {isGeneratingNickname ? &apos;Generating...&apos; : <><SparklesIcon /> Generate Nickname</>}
                            </button>
                        </div>
                    )}
                    {intel && (
}
                        <>
                            <IntelCard label="Pregame Ritual" value={intel.pregameRitual} icon="🧘" />
                            <IntelCard label="Offseason Hobby" value={intel.offseasonHobby} icon="🎸" />
                            <IntelCard label="Spirit Animal" value={intel.spiritAnimal} icon="🦅" />
                            <IntelCard label="Signature Celebration" value={intel.signatureCelebration} icon="🎉" />
                            <IntelCard label="Last Known Breakfast" value={intel.lastBreakfast} icon="🥞" />
                        </>
                    )}
                </div>
            </div>
      
            {newsFeed && newsFeed.length > 0 && (
}
                <div>
                    <h3 className="font-bold text-lg text-cyan-300 mb-2 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8"><NewsIcon /> Latest News Feed</h3>
                    <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                        {newsFeed.map((news, i) => (
}
                            <NewsItemCard key={i} news={news} />
                        ))}
                    </div>
                </div>
            )}

            {!intel && (!newsFeed || newsFeed.length === 0) && !nickname &&
}
                <p className="text-gray-500 text-center py-4 sm:px-4 md:px-6 lg:px-8">No special intelligence available. Try generating a nickname!</p>
            }
        </motion.div>
    );
};

const IntelligenceTabWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <IntelligenceTab {...props} />
  </ErrorBoundary>
);

export default React.memo(IntelligenceTabWithErrorBoundary);
