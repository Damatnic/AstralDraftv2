import { Panel, PanelGroup, PanelResizeHandle } from &apos;react-resizable-panels&apos;;
import { useAppState } from &apos;../contexts/AppContext&apos;;

import PlayerPool from &apos;../components/player/PlayerPool&apos;;
import DraftBoard from &apos;../components/draft/DraftBoard&apos;;
import PlayerDetailModal from &apos;../components/player/PlayerDetailModal&apos;;
import PlayerCompareTool from &apos;../components/analytics/PlayerCompareTool&apos;;
import { Player, League, User, AppState } from &apos;../types&apos;;
import { AnimatePresence } from &apos;framer-motion&apos;;
import ChatPanel from &apos;../components/chat/ChatPanel&apos;;
import WarRoomPanel from &apos;../components/strategy/WarRoomPanel&apos;;
import ConversationalOracle from &apos;../components/ai/ConversationalOracle&apos;;
import TurnTimer from &apos;../components/draft/TurnTimer&apos;;
import AuctionPanel from &apos;../components/draft/AuctionPanel&apos;;
import LiveDraftLog from &apos;../components/draft/LiveDraftLog&apos;;
import { useRealtimeDraft } from &apos;../hooks/useRealtimeDraft&apos;;
import { useRealtimeAuction } from &apos;../hooks/useRealtimeAuction&apos;;
import DraftCompleteOverlay from &apos;../components/draft/DraftCompleteOverlay&apos;;
import MyRosterPanel from &apos;../components/draft/MyRosterPanel&apos;;
import { useLeague } from &apos;../hooks/useLeague&apos;;
import CompareTray from &apos;../components/analytics/CompareTray&apos;;
import { useDraftCommentary } from &apos;../hooks/useDraftCommentary&apos;;
import AiCoPilotPanel from &apos;../components/draft/AiCoPilotPanel&apos;;
import { useMediaQuery } from &apos;../hooks/useMediaQuery&apos;;

interface DraftRoomContainerProps {
}
    league: League;
    isPaused: boolean;
    user: User;
    dispatch: React.Dispatch<any>;
    playerNotes: AppState[&apos;playerNotes&apos;];
    playerQueues: AppState[&apos;playerQueues&apos;];

}

const DraftRoomContainer: React.FC<DraftRoomContainerProps> = ({ league, isPaused, user, dispatch, playerNotes, playerQueues }: any) => {
}
    const [playersToCompare, setPlayersToCompare] = React.useState<Player[]>([]);
    const [isCompareModalOpen, setIsCompareModalOpen] = React.useState(false);
    const [activeSideTab, setActiveSideTab] = React.useState(&apos;co-pilot&apos;);
    const isMobile = useMediaQuery(&apos;(max-width: 768px)&apos;);
    
    const snakeDraftState = useRealtimeDraft(league, isPaused, user, dispatch);
    const auctionDraftState = useRealtimeAuction(league, isPaused, user, dispatch);
    useDraftCommentary(league);
    
    const { myTeam } = useLeague();
    const isAuction = league.settings.draftFormat === &apos;AUCTION&apos;;
    
    const draft = isAuction ? auctionDraftState : snakeDraftState;
    const teamOnClockId = !isAuction && snakeDraftState.currentPick > 0 && league.draftPicks.length >= snakeDraftState.currentPick ? league.draftPicks[snakeDraftState.currentPick - 1]?.teamId : undefined;
    const isMyTurnForSnake = !!(myTeam && myTeam.id === teamOnClockId && !isPaused);

    const myQueue = (league && playerQueues[league.id]) || [];

    const handlePlayerSelect = (player: Player) => {
}
        dispatch({ type: &apos;SET_PLAYER_DETAIL&apos;, payload: { player, initialTab: &apos;overview&apos; } });
    };

    const handleOpenNotes = (player: Player) => {
}
        dispatch({ type: &apos;SET_PLAYER_DETAIL&apos;, payload: { player, initialTab: &apos;notes&apos; } });
    };

    const handleToggleCompare = (player: Player) => {
}
        setPlayersToCompare(prev => {
}
            const isAlreadySelected = prev.some((p: any) => p.id === player.id);
            if (isAlreadySelected) {
}
                return prev.filter((p: any) => p.id !== player.id);

            if (prev.length >= 4) {
}
                dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: { message: &apos;Comparison limit of 4 players reached.&apos;, type: &apos;SYSTEM&apos; } });
                return prev;

            return [...prev, player];
        });
    };

    const addToQueue = (player: Player) => {
}
        if (!league) return;
        if (myQueue.includes(player.id)) {
}
            dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: { message: `${player.name} is already in your queue.`, type: &apos;SYSTEM&apos; } });
            return;

        dispatch({
}
            type: &apos;ADD_TO_QUEUE&apos;,
            payload: { leagueId: league.id, playerId: player.id }
        });
        dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: { message: `${player.name} added to queue.`, type: &apos;SYSTEM&apos; }});
    };

    const sidePanelTabs = [
        { id: &apos;co-pilot&apos;, label: &apos;Co-pilot&apos; },
        { id: &apos;oracle&apos;, label: &apos;Oracle&apos; },
        { id: &apos;my_roster&apos;, label: &apos;My Roster&apos; },
        { id: &apos;war_room&apos;, label: &apos;War Room&apos; },
        { id: &apos;chat&apos;, label: &apos;Chat&apos; },
        { id: &apos;log&apos;, label: &apos;Draft Log&apos; },
    ];
    
    return (
        <div className="w-full h-full flex flex-col relative">
            <header className="p-3 sm:p-2 text-center flex-shrink-0 border-b border-[var(--panel-border)] flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 sm:px-4 gap-2 sm:gap-0">
                <button onClick={() => dispatch({type: &apos;SET_VIEW&apos;, payload: &apos;LEAGUE_HUB&apos;})} className="back-btn text-xs sm:text-sm">Back to Hub</button>
                <div className="flex-1 min-w-0">
                    <h1 className="font-display text-lg sm:text-xl md:text-2xl font-bold uppercase text-[var(--text-primary)] truncate">{league.name}</h1>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)]">Live {league.settings.draftFormat} Draft In Progress...</p>
                </div>
                {league.isMock ? (
}
                    <div className="px-3 py-1 bg-indigo-500/20 text-indigo-300 font-bold rounded-full text-xs self-center sm:self-auto">MOCK DRAFT</div>
                ) : (
                    <div className="hidden sm:block w-20"> {/* Spacer for desktop */} </div>
                )}
            </header>
            <div className="p-2 sm:p-3 flex-shrink-0">
                {isAuction ? (
}
                     <AuctionPanel>
                        nominatingTeam={auctionDraftState.nominatingTeam || undefined}
                        nominatedPlayer={auctionDraftState.nominatedPlayer || null}
                        currentBid={auctionDraftState.currentBid}
                        highBidder={auctionDraftState.highBidderTeam}
                        timeLeft={auctionDraftState.timeLeft}
                        myBudget={myTeam?.budget || 0}
                        onPlaceBid={auctionDraftState.placeBid}
                        myTeamId={myTeam?.id}
                        bidHistory={auctionDraftState.bidHistory}
                        teams={league.teams}
                    />
                ) : (
                    <TurnTimer>
                        currentPick={snakeDraftState.currentPick} 
                        teams={league.teams}
                        draftPicks={league.draftPicks}
                        isMyTurn={isMyTurnForSnake}
                        isPaused={isPaused}
                    />
                )}
            </div>
            <PanelGroup direction={isMobile ? &apos;vertical&apos; : &apos;horizontal&apos;} className="flex-grow px-1 sm:px-2 pb-1 sm:pb-2 gap-1 sm:gap-2">
                <Panel defaultSize={isMobile ? 35 : 25} minSize={isMobile ? 25 : 20}>
                    <PlayerPool>
                        players={draft.availablePlayers} 
                        onPlayerSelect={handlePlayerSelect}
                        onAddToQueue={addToQueue}
                        onDraftPlayer={snakeDraftState.draftPlayer}
                        onNominatePlayer={auctionDraftState.nominatePlayer}
                        onAddNote={handleOpenNotes}
                        isMyTurn={isMyTurnForSnake}
                        playersToCompare={playersToCompare}
                        onToggleCompare={handleToggleCompare}
                        queuedPlayerIds={myQueue}
                        draftFormat={league.settings.draftFormat}
                        isNominationTurn={auctionDraftState.isMyNominationTurn}
                    />
                </Panel>
                <PanelResizeHandle className={`bg-black/20 hover:bg-cyan-400/50 transition-colors rounded-full ${isMobile ? &apos;h-1 sm:h-2 w-full&apos; : &apos;w-1 sm:w-2 h-full&apos;} mobile-touch-target`} />
                <Panel defaultSize={isMobile ? 45 : 50} minSize={30}>
                    <DraftBoard>
                        teams={league.teams} 
                        draftPicks={league.draftPicks} 
                        currentPick={snakeDraftState.currentPick}
                        onPlayerSelect={handlePlayerSelect} 
                        draftFormat={league.settings.draftFormat}
                    />
                </Panel>
                 <PanelResizeHandle className={`bg-black/20 hover:bg-cyan-400/50 transition-colors rounded-full ${isMobile ? &apos;h-1 sm:h-2 w-full&apos; : &apos;w-1 sm:w-2 h-full&apos;} mobile-touch-target`} />
                <Panel defaultSize={isMobile ? 20 : 25} minSize={isMobile ? 15 : 20}>
                    <div className="h-full flex flex-col glass-pane rounded-lg sm:rounded-2xl">
                        <div className="flex-shrink-0 border-b border-[var(--panel-border)] px-1 sm:px-2">
                             <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
                                {sidePanelTabs.map((item: any) => (
}
                                    <button
                                    key={item.id}
                                    onClick={() => setActiveSideTab(item.id)} relative py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium transition-colors focus:outline-none border-b-2 whitespace-nowrap mobile-touch-target min-w-fit`}
                                    >
                                    {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex-grow overflow-hidden">
                           {activeSideTab === &apos;co-pilot&apos; && <AiCoPilotPanel />}
                           {activeSideTab === &apos;oracle&apos; && <ConversationalOracle myTeam={myTeam} availablePlayers={draft.availablePlayers} />}
                           {activeSideTab === &apos;my_roster&apos; && <MyRosterPanel team={myTeam} />}
                           {activeSideTab === &apos;war_room&apos; && league && <WarRoomPanel queue={myQueue} leagueId={league.id} dispatch={dispatch} />}
                           {activeSideTab === &apos;chat&apos; && <ChatPanel />}
                           {activeSideTab === &apos;log&apos; && <LiveDraftLog draftPicks={league.draftPicks} teams={league.teams} />}
                        </div>
                    </div>
                </Panel>
            </PanelGroup>

            <CompareTray>
                players={playersToCompare}
                onClear={() => setPlayersToCompare([])}
                onCompare={() => setIsCompareModalOpen(true)}
            />

            <AnimatePresence>
                {league.status === &apos;DRAFT_COMPLETE&apos; && (
}
                    <DraftCompleteOverlay league={league} dispatch={dispatch} />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isCompareModalOpen && playersToCompare.length > 0 && (
}
                    <PlayerCompareTool>
                        players={playersToCompare}
                        onClose={() => setIsCompareModalOpen(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const DraftRoomView: React.FC = () => {
}
    const { state, dispatch } = useAppState();
    const { league } = useLeague();

    return (
        <div className="w-full h-full">
            {!league || !state.user ? (
}
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <p className="text-lg">Error: {!league ? &apos;No active league found&apos; : &apos;Please log in to access the draft room&apos;}.</p>
                    <button onClick={() => dispatch({type: &apos;SET_VIEW&apos;, payload: &apos;DASHBOARD&apos;})} className="btn btn-primary mt-4">Back to Dashboard</button>
                </div>
            ) : league.status === &apos;PRE_DRAFT&apos; ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <p className="text-lg">The draft has not started yet.</p>
                    <button onClick={() => dispatch({type: &apos;SET_VIEW&apos;, payload: &apos;LEAGUE_HUB&apos;})} className="btn btn-primary mt-4">Back to League Hub</button>
                </div>
            ) : (
                <DraftRoomContainer>
                  league={league}
                  isPaused={state.isDraftPaused}
                  user={state.user}
                  dispatch={dispatch}
                  playerNotes={state.playerNotes}
                  playerQueues={state.playerQueues}
                />
            )}
        </div>
    );
};

export default DraftRoomView;