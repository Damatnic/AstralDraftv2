

import React, { useCallback } from &apos;react&apos;;
import { AnimatePresence, motion } from &apos;framer-motion&apos;;
import type { League, Team, Player } from &apos;../../types&apos;;
import { players } from &apos;../../data/players&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import ManageTradeBlockModal from &apos;./ManageTradeBlockModal&apos;;
import { CloseIcon } from &apos;../icons/CloseIcon&apos;;
import { ScalesIcon } from &apos;../icons/ScalesIcon&apos;;
import { Tabs } from &apos;../ui/Tabs&apos;;
import TradeOfferCard from &apos;./TradeOfferCard&apos;;
import useSound from &apos;../../hooks/useSound&apos;;
import EmptyState from &apos;../ui/EmptyState&apos;;
import { InboxIcon } from &apos;../icons/InboxIcon&apos;;
import { PaperPlaneIcon } from &apos;../icons/PaperPlaneIcon&apos;;
import { EmptyTumbleweedIcon } from &apos;../icons/EmptyTumbleweedIcon&apos;;

export const TradeCenterWidget: React.FC<{
}
  const [isLoading, setIsLoading] = React.useState(false); league: League; team: Team; dispatch: React.Dispatch<any> }> = ({ league, team, dispatch }: any) => {
}
    const [isBlockModalOpen, setIsBlockModalOpen] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState(&apos;incoming&apos;);
    
    const incomingOffers = league.tradeOffers.filter((o: any) => o.toTeamId === team.id && o?.status === &apos;PENDING&apos;);
    const outgoingOffers = league.tradeOffers.filter((o: any) => o.fromTeamId === team.id);
    const completedOffers = league.tradeOffers.filter((o: any) => o?.status !== &apos;PENDING&apos; && (o.toTeamId === team.id || o.fromTeamId === team.id));

    const playTradeSound = useSound(&apos;tradeOffer&apos;, 0.5);
    const prevIncomingOffersCount = React.useRef(incomingOffers.length);
    
    React.useEffect(() => {
}
        if (incomingOffers.length > prevIncomingOffersCount.current) {
}
            playTradeSound();

        prevIncomingOffersCount.current = incomingOffers.length;
    }
  }, [incomingOffers.length, playTradeSound]);

    const myBlockedPlayers = React.useMemo(() => {
}
        const playerMap = new Map(players.map((p: any) => [p.id, p]));
        return (team.tradeBlock || []).map((id: any) => playerMap.get(id)).filter(Boolean) as Player[];
    }, [team.tradeBlock]);

    const handleRemoveFromBlock = (playerId: number) => {
}
        dispatch({ type: &apos;REMOVE_FROM_TRADE_BLOCK&apos;, payload: { leagueId: league.id, teamId: team.id, playerId } });
    };

    const tabItems = [
        { id: &apos;incoming&apos;, label: `Incoming (${incomingOffers.length})` },
        { id: &apos;outgoing&apos;, label: &apos;Outgoing&apos; },
        { id: &apos;block&apos;, label: &apos;Trade Block&apos; },
    ];
    
    const renderContent = () => {
}
        switch (activeTab) {
}
            case &apos;incoming&apos;:
                return incomingOffers.length > 0 ? (
                    <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                        {incomingOffers.map((offer: any) => <TradeOfferCard key={offer.id} offer={offer} league={league} myTeamId={team.id} dispatch={dispatch} />)}
                    </div>
                ) : <EmptyState illustration={<InboxIcon />} message="No pending incoming offers." />;
            case &apos;outgoing&apos;:
                 return outgoingOffers.length > 0 ? (
                    <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                        {outgoingOffers.map((offer: any) => <TradeOfferCard key={offer.id} offer={offer} league={league} myTeamId={team.id} dispatch={dispatch} />)}
                    </div>
                ) : <EmptyState illustration={<PaperPlaneIcon />} message="You haven&apos;t sent any offers." />;
            case &apos;block&apos;:
                return (
                    <div>
                        {myBlockedPlayers.length > 0 ? (
}
                            <div className="space-y-1 sm:px-4 md:px-6 lg:px-8">
                                {myBlockedPlayers.map((p: any) => (
}
                                    <div key={p.id} className="flex items-center justify-between text-xs bg-black/10 p-1.5 rounded-md sm:px-4 md:px-6 lg:px-8">
                                        <span>{p.name} <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">({p.position})</span></span>
                                        <button onClick={() => handleRemoveFromBlock(p.id)} className="mobile-touch-target text-gray-500 hover:text-red-400 p-3 rounded-full sm:px-4 md:px-6 lg:px-8" aria-label="Remove from block"><CloseIcon className="w-3 h-3 sm:px-4 md:px-6 lg:px-8"/></button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState illustration={<EmptyTumbleweedIcon />} message="You have no players on the block." />
                        )}
                        <button onClick={() => setIsBlockModalOpen(true)} className="w-full mt-2 py-1.5 text-xs font-bold bg-cyan-500/10 text-cyan-300 rounded-md hover:bg-cyan-500/20 sm:px-4 md:px-6 lg:px-8">
                            Manage My Block
                        </button>
                    </div>
                );
            default:
                return null;


    return (
        <>
            <Widget title="Trade Center" icon={<ScalesIcon />}>
                <div className="px-3 border-b border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                    <Tabs items={tabItems} activeTab={activeTab} onTabChange={setActiveTab} />
                </div>
                <div className="p-3 sm:px-4 md:px-6 lg:px-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            {...{
}
                                initial: { opacity: 0, y: 10 },
                                animate: { opacity: 1, y: 0 },
                                exit: { opacity: 0, y: -10 },
                                transition: { duration: 0.2 },
                            }}
                        >
                           {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </Widget>
            <AnimatePresence>
                {isBlockModalOpen && <ManageTradeBlockModal team={team} leagueId={league.id} dispatch={dispatch} onClose={() => setIsBlockModalOpen(false)} />}
            </AnimatePresence>
        </>
    );
};