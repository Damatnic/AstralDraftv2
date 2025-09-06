
import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useMemo } from 'react';
import { useAppState } from '../../contexts/AppContext';
import { useLeague } from '../../hooks/useLeague';
import { Widget } from '../ui/Widget';
import { SwordsIcon } from '../icons/SwordsIcon';
import type { SideBet } from '../../types';
import { AnimatePresence } from 'framer-motion';
import ProposeSideBetModal from '../modals/ProposeSideBetModal';
import { Avatar } from '../ui/Avatar';

const SideBetCard: React.FC<{ bet: SideBet; onRespond: (betId: string, response: 'ACCEPTED' | 'REJECTED') => void; onResolve: (betId: string, winnerId: number) => void; isMyBet: boolean; isMyTurnToRespond: boolean; }> = ({ bet, onRespond, onResolve, isMyBet, isMyTurnToRespond }: any) => {
    const { league, myTeam } = useLeague();
    if (!league || !myTeam) return null;

    const proposer = league.teams.find((t: any) => t.id === bet.proposerId);
    const accepter = league.teams.find((t: any) => t.id === bet.accepterId);

    return (
        <div className="p-2 bg-black/10 rounded-lg sm:px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between text-xs mb-1 sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center gap-1 sm:px-4 md:px-6 lg:px-8">
                    <Avatar avatar={proposer?.avatar || '?'} className="w-4 h-4 rounded-full sm:px-4 md:px-6 lg:px-8" /> {proposer?.name}
                    <span className="text-red-400 sm:px-4 md:px-6 lg:px-8">vs</span>
                    <Avatar avatar={accepter?.avatar || '?'} className="w-4 h-4 rounded-full sm:px-4 md:px-6 lg:px-8" /> {accepter?.name}
                </div>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${bet?.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'}`}>{bet?.status}</span>
            </div>
            <p className="text-sm font-semibold sm:px-4 md:px-6 lg:px-8">"{bet.terms}"</p>
            <p className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Stakes: <span className="italic sm:px-4 md:px-6 lg:px-8">{bet.stakes}</span></p>
            {bet?.status === 'PENDING' && isMyTurnToRespond && (
                 <div className="flex justify-end gap-2 mt-2 sm:px-4 md:px-6 lg:px-8">
                    <button onClick={() => onRespond(bet.id, 'REJECTED')} className="px-2 py-1 text-xs bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 sm:px-4 md:px-6 lg:px-8">Reject</button>
                    <button onClick={() => onRespond(bet.id, 'ACCEPTED')} className="px-2 py-1 text-xs bg-green-500/20 text-green-300 rounded hover:bg-green-500/30 sm:px-4 md:px-6 lg:px-8">Accept</button>
                </div>
            )}
            {bet?.status === 'ACCEPTED' && isMyBet && (
                 <div className="flex justify-end gap-2 mt-2 sm:px-4 md:px-6 lg:px-8">
                    <button onClick={() => onResolve(bet.id, bet.proposerId)} className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30 sm:px-4 md:px-6 lg:px-8">I Won</button>
                    <button onClick={() => onResolve(bet.id, bet.accepterId)} className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30 sm:px-4 md:px-6 lg:px-8">They Won</button>
                </div>
            )}
        </div>
    );
};

const SideBetsWidget: React.FC = () => {
    const { state, dispatch } = useAppState();
    const { league, myTeam } = useLeague();
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    if (!league || !myTeam) return null;

    const myBets = (league.sideBets || []).filter((b: any) => b.proposerId === myTeam.id || b.accepterId === myTeam.id);
    
    const handleRespond = (betId: string, response: 'ACCEPTED' | 'REJECTED') => {
        dispatch({ type: 'RESPOND_TO_SIDE_BET', payload: { leagueId: league.id, betId, response } });
    };

    const handleResolve = (betId: string, winnerId: number) => {
        dispatch({ type: 'RESOLVE_SIDE_BET', payload: { leagueId: league.id, betId, winnerId } });
    };

    return (
        <>
            <Widget title="Side Bets" icon={<SwordsIcon />}>
                <div className="p-3 sm:px-4 md:px-6 lg:px-8">
                    {myBets.length > 0 ? (
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1 sm:px-4 md:px-6 lg:px-8">
                            {myBets.map((bet: any) => (
                                <SideBetCard
                                    key={bet.id}
                                    bet={bet}
                                    onRespond={handleRespond}
                                    onResolve={handleResolve}
                                    isMyBet={bet.proposerId === myTeam.id}
                                    isMyTurnToRespond={bet.accepterId === myTeam.id && bet?.status === 'PENDING'}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-xs text-gray-400 py-4 sm:px-4 md:px-6 lg:px-8">No side bets yet. Start some trouble!</p>
                    )}
                    <button 
                        onClick={() => setIsModalOpen(true)}
                    >
                        Propose a Bet
                    </button>
                </div>
            </Widget>
            <AnimatePresence>
                {isModalOpen && <ProposeSideBetModal onClose={() => setIsModalOpen(false)} />}
            </AnimatePresence>
        </>
    );
};

const SideBetsWidgetWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <SideBetsWidget {...props} />
  </ErrorBoundary>
);

export default React.memo(SideBetsWidgetWithErrorBoundary);
