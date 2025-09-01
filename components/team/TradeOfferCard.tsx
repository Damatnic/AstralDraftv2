

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo } from &apos;react&apos;;
import type { TradeOffer, League, Player, DraftPickAsset } from &apos;../../types&apos;;
import { players } from &apos;../../data/players&apos;;
import { ArrowRightLeftIcon } from &apos;../icons/ArrowRightLeftIcon&apos;;
import { SparklesIcon } from &apos;../icons/SparklesIcon&apos;;
import TradeStoryModal from &apos;../modals/TradeStoryModal&apos;;
import { AnimatePresence } from &apos;framer-motion&apos;;
import { ScrollTextIcon } from &apos;../icons/ScrollTextIcon&apos;;
import { generateEventHotTake } from &apos;../../services/geminiService&apos;;

interface TradeOfferCardProps {
}
    offer: TradeOffer;
    league: League;
    myTeamId: number;
    dispatch: React.Dispatch<any>;

}

const statusStyles = {
}
    PENDING: { bg: &apos;bg-yellow-500/10&apos;, text: &apos;text-yellow-300&apos;, label: &apos;Pending&apos; },
    ACCEPTED: { bg: &apos;bg-green-500/10&apos;, text: &apos;text-green-300&apos;, label: &apos;Accepted&apos; },
    REJECTED: { bg: &apos;bg-red-500/10&apos;, text: &apos;text-red-400&apos;, label: &apos;Rejected&apos; },
    VETOED: { bg: &apos;bg-red-900/20&apos;, text: &apos;text-red-400&apos;, label: &apos;Vetoed&apos; },
    FORCED: { bg: &apos;bg-green-900/20&apos;, text: &apos;text-green-300&apos;, label: &apos;Forced&apos; },
};

const TradeOfferCard: React.FC<TradeOfferCardProps> = ({ offer, league, myTeamId, dispatch }: any) => {
}
    const [isStoryModalOpen, setIsStoryModalOpen] = React.useState(false);

    const isIncoming = offer.toTeamId === myTeamId;
    const otherTeamId = isIncoming ? offer.fromTeamId : offer.toTeamId;
    const otherTeam = league.teams.find((t: any) => t.id === otherTeamId);
    const myTeam = league.teams.find((t: any) => t.id === myTeamId)!;

    const playerMap = new Map(players.map((p: any) => [p.id, p]));
    const offeredPlayers = offer.playersOffered.map((id: any) => playerMap.get(id));
    const requestedPlayers = offer.playersRequested.map((id: any) => playerMap.get(id));
    const offeredPicks = offer.draftPicksOffered || [];
    const requestedPicks = offer.draftPicksRequested || [];

    // From my perspective
    const playersGiving = isIncoming ? requestedPlayers : offeredPlayers;
    const playersGetting = isIncoming ? offeredPlayers : requestedPlayers;
    const picksGiving = isIncoming ? requestedPicks : offeredPicks;
    const picksGetting = isIncoming ? offeredPicks : requestedPicks;
    
    const style = statusStyles[offer?.status];

    const getWinnerStyling = () => {
}
        if (!offer.tradeAnalysis || !offer.tradeAnalysis.winner) return { text: &apos;&apos;, color: &apos;text-gray-400&apos; };
        switch(offer.tradeAnalysis.winner) {
}
            case &apos;TEAM_A&apos;: return { text: `${myTeam.name} Wins`, color: &apos;text-green-400&apos; };
            case &apos;TEAM_B&apos;: return { text: `${otherTeam?.name} Wins`, color: &apos;text-red-400&apos; };
            case &apos;EVEN&apos;: return { text: &apos;Fair Trade&apos;, color: &apos;text-yellow-400&apos; };
            default: return { text: &apos;Analysis available&apos;, color: &apos;text-cyan-400&apos; };

    };
    const winnerStyle = getWinnerStyling();

    const handleUpdateStatus = async () => {
}
    try {
}
        dispatch({
}
            type: &apos;UPDATE_TRADE_STATUS&apos;,
            payload: { leagueId: league.id, tradeId: offer.id, status 
}

        });
        dispatch({
}
            type: &apos;ADD_NOTIFICATION&apos;,
            payload: { message: `Trade offer ${status.toLowerCase()}!`, type: &apos;TRADE&apos; }
        });

        // If accepted, post a system message to the chat
        if (status === &apos;ACCEPTED&apos; && otherTeam) {
}
            const fromTeam = league.teams.find((t: any) => t.id === offer.fromTeamId)!;
            const toTeam = league.teams.find((t: any) => t.id === offer.toTeamId)!;

            const formatPicks = (picks: DraftPickAsset[]) => picks.map((p: any) => `${p.season} R${p.round}`).join(&apos;, &apos;);
            const offeredPicksStr = offeredPicks.length > 0 ? ` and picks (${formatPicks(offeredPicks)})` : &apos;&apos;;
            const requestedPicksStr = requestedPicks.length > 0 ? ` and picks (${formatPicks(requestedPicks)})` : &apos;&apos;;
            const tradeDescription = `${fromTeam.name} trades ${offeredPlayers.map((p: any) => p?.name).join(&apos;, &apos;)}${offeredPicksStr} to ${toTeam.name} for ${requestedPlayers.map((p: any) => p?.name).join(&apos;, &apos;)}${requestedPicksStr}.`;
            const aiHotTake = await generateEventHotTake(tradeDescription);
            
            dispatch({
}
                type: &apos;ADD_CHAT_MESSAGE&apos;,
                payload: {
}
                    leagueId: league.id,
                    message: {
}
                        user: { id: &apos;system&apos;, name: &apos;League Event&apos;, avatar: &apos;📣&apos; },
                        text: &apos;&apos;,
                        isSystemMessage: true,
                        tradeEvent: offer,
                        aiHotTake: aiHotTake || undefined,


            });

    };

    const AssetList: React.FC<{ players: (Player | undefined)[], picks: DraftPickAsset[] }> = ({ players, picks }: any) => (
        <div className="text-xs space-y-1 sm:px-4 md:px-6 lg:px-8">
            {players.length > 0 && players.map((p: any) => p && <p key={p.id}>{p.name} ({p.position})</p>)}
            {picks.length > 0 && picks.map((p, i) => <p key={i} className="text-cyan-300 sm:px-4 md:px-6 lg:px-8">{p.season} R{p.round} Pick</p>)}
            {players.length === 0 && picks.length === 0 && <p className="text-gray-500 italic sm:px-4 md:px-6 lg:px-8">Nothing</p>}
        </div>
    );

    return (
        <>
        <div className={`p-3 rounded-lg ${style.bg} border-l-4 ${style.text.replace(&apos;text-&apos;, &apos;border-&apos;)}`}>
            <div className="flex justify-between items-start text-xs sm:px-4 md:px-6 lg:px-8">
                <p>{isIncoming ? `From: ${otherTeam?.name}` : `To: ${otherTeam?.name}`}</p>
                <span className={`px-2 py-0.5 rounded-full font-semibold text-xs ${style.bg} ${style.text}`}>{style.label}</span>
            </div>
            
            <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-start my-2 sm:px-4 md:px-6 lg:px-8">
                <div>
                    <p className="font-bold text-red-400 text-xs mb-1 sm:px-4 md:px-6 lg:px-8">GIVING</p>
                    <AssetList players={playersGiving} picks={picksGiving} />
                </div>
                <div className="pt-4 sm:px-4 md:px-6 lg:px-8">
                    <ArrowRightLeftIcon className="w-5 h-5 text-gray-400 sm:px-4 md:px-6 lg:px-8" />
                </div>
                <div>
                    <p className="font-bold text-green-400 text-xs mb-1 sm:px-4 md:px-6 lg:px-8">GETTING</p>
                    <AssetList players={playersGetting} picks={picksGetting} />
                </div>
            </div>
            
            {offer.tradeAnalysis && (
}
                 <div className="text-xs mt-2 pt-2 border-t border-white/10 flex items-center justify-center gap-2 sm:px-4 md:px-6 lg:px-8">
                    <SparklesIcon className={`w-3 h-3 ${winnerStyle.color}`} />
                    <span className={`font-bold ${winnerStyle.color}`}>{winnerStyle.text}:</span>
                    <span className="italic text-gray-400 sm:px-4 md:px-6 lg:px-8">"{offer.tradeAnalysis.summary}"</span>
                </div>
            )}

            {isIncoming && offer?.status === &apos;PENDING&apos; && (
}
                <div className="flex justify-end gap-2 mt-2 sm:px-4 md:px-6 lg:px-8">
                    <button onClick={() => handleUpdateStatus(&apos;REJECTED&apos;)}
//                         Reject
                    </button>
                    <button onClick={() => handleUpdateStatus(&apos;ACCEPTED&apos;)}
//                         Accept
                    </button>
                </div>
            )}
            {offer?.status !== &apos;PENDING&apos; && myTeamId !== -1 && (
}
                 <div className="flex justify-end mt-2 sm:px-4 md:px-6 lg:px-8">
                    <button onClick={() => setIsStoryModalOpen(true)}
                        <ScrollTextIcon /> View Story
                    </button>
                </div>
            )}
        </div>
        <AnimatePresence>
            {isStoryModalOpen && (
}
                <TradeStoryModal>
                    offer={offer}
                    league={league}
                    onClose={() => setIsStoryModalOpen(false)}
                />
            )}
        </AnimatePresence>
        </>
    );
};

const TradeOfferCardWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <TradeOfferCard {...props} />
  </ErrorBoundary>
);

export default React.memo(TradeOfferCardWithErrorBoundary);