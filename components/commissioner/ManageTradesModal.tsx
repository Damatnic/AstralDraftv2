

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../../contexts/AppContext';
import type { League, TradeOffer } from '../../types';
import { Modal } from '../ui/Modal';
import { CloseIcon } from '../icons/CloseIcon';
import TradeOfferCard from '../team/TradeOfferCard';
import { GavelIcon } from '../icons/GavelIcon';
import EmptyState from '../ui/EmptyState';
import { ArrowRightLeftIcon } from '../icons/ArrowRightLeftIcon';
import { AlertTriangleIcon } from '../icons/AlertTriangleIcon';

interface ManageTradesModalProps {
    league: League;
    onClose: () => void;
}

const ManageTradesModal: React.FC<ManageTradesModalProps> = ({ league, onClose }: any) => {
    const { state, dispatch } = useAppState();
    const pendingOffers = league.tradeOffers.filter((o: any) => o?.status === 'PENDING');
    const isTradeDeadlinePassed = league.currentWeek > league.settings.tradeDeadline;

    const handleForce = (offer: TradeOffer) => {
        if (window.confirm("Are you sure you want to force this trade to be accepted?")) {
            dispatch({ type: 'UPDATE_TRADE_STATUS', payload: { leagueId: league.id, tradeId: offer.id, status: 'FORCED' } });
            dispatch({ type: 'ADD_NOTIFICATION', payload: { message: 'Trade has been forced by commissioner.', type: 'SYSTEM' } });

    };
    
    const handleVeto = (offer: TradeOffer) => {
        if (window.confirm("Are you sure you want to veto this trade?")) {
            dispatch({ type: 'UPDATE_TRADE_STATUS', payload: { leagueId: league.id, tradeId: offer.id, status: 'VETOED' } });
            dispatch({ type: 'ADD_NOTIFICATION', payload: { message: 'Trade has been vetoed by commissioner.', type: 'SYSTEM' } });

    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            <motion.div
                className="glass-pane rounded-xl shadow-2xl w-full max-w-xl max-h-[80vh] flex flex-col sm:px-4 md:px-6 lg:px-8"
                onClick={e => e.stopPropagation()},
                    animate: { opacity: 1, scale: 1 },
                }}
            >
                <header className="p-4 border-b border-[var(--panel-border)] flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                    <h2 className="text-xl font-bold font-display flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                        <ArrowRightLeftIcon /> Manage Pending Trades
                    </h2>
                    <button onClick={onClose} className="mobile-touch-target p-3 rounded-full hover:bg-white/10 sm:px-4 md:px-6 lg:px-8" aria-label="Close modal"><CloseIcon /></button>
                </header>
                <main className="flex-grow p-4 space-y-3 overflow-y-auto sm:px-4 md:px-6 lg:px-8">
                    {isTradeDeadlinePassed && (
                        <div className="p-3 bg-yellow-500/10 text-yellow-300 text-xs rounded-lg flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                            <AlertTriangleIcon className="h-4 w-4 sm:px-4 md:px-6 lg:px-8" />
                            <strong>Warning:</strong> The league's trade deadline (Week {league.settings.tradeDeadline}) has passed. Any action here is a commissioner override.
                        </div>
                    )}
                    {pendingOffers.length === 0 ? (
                        <EmptyState message="There are no pending trades in the league." />
                    ) : (
                        pendingOffers.map((offer: any) => (
                            <div key={offer.id} className="bg-black/10 p-2 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                <TradeOfferCard offer={offer} league={league} myTeamId={-1} dispatch={dispatch} />
                                <div className="flex justify-end gap-2 mt-2 sm:px-4 md:px-6 lg:px-8">
                                    <button
                                        onClick={() => handleVeto(offer)}
                                        className="px-3 py-1 text-xs font-bold bg-red-500/20 text-red-300 rounded-md hover:bg-red-500/30 flex items-center gap-1 sm:px-4 md:px-6 lg:px-8"
                                    >
                                        <GavelIcon /> Veto
                                    </button>
                                     <button
                                        onClick={() => handleForce(offer)}
                                        className="px-3 py-1 text-xs font-bold bg-green-500/20 text-green-300 rounded-md hover:bg-green-500/30 flex items-center gap-1 sm:px-4 md:px-6 lg:px-8"
                                    >
                                        <GavelIcon /> Force
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </main>
                <footer className="p-4 border-t border-[var(--panel-border)] text-center sm:px-4 md:px-6 lg:px-8">
                    <button onClick={onClose} className="px-6 py-2 bg-cyan-500 text-black font-bold text-sm rounded-md sm:px-4 md:px-6 lg:px-8">
//                         Done
                    </button>
                </footer>
            </motion.div>
        </Modal>
    );
};

const ManageTradesModalWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <ManageTradesModal {...props} />
  </ErrorBoundary>
);

export default React.memo(ManageTradesModalWithErrorBoundary);