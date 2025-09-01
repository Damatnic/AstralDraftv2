import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Team, Player, TradeAnalysis, DraftPickAsset, TradeSuggestion } from '../../types';
import { players } from '../../data/players';
import { Modal } from '../ui/Modal';
import { ArrowRightLeftIcon } from '../icons/ArrowRightLeftIcon';
import { SparklesIcon } from '../icons/SparklesIcon';
import { analyzeTrade } from '../../services/geminiService';

interface ProposeTradeModalProps {
    myTeam: Team;
    otherTeam: Team;
    leagueId: string;
    dispatch: React.Dispatch<any>;
    onClose: () => void;
    initialOffer?: Omit<TradeSuggestion, 'toTeamId' | 'rationale'>;

}

const AssetSelectItem: React.FC<{ label: string; subtext: string; isSelected: boolean; onToggle: () => void; }> = ({ label, subtext, isSelected, onToggle }: any) => (
    <div
        onClick={onToggle}
        className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
            isSelected ? 'bg-cyan-500/30 ring-2 ring-cyan-400' : 'bg-black/10 hover:bg-black/20'
        }`}
     role="button" tabIndex={0}>
        <div className={`w-2 h-8 rounded-full ${isSelected ? 'bg-cyan-400' : 'bg-gray-600'}`}></div>
        <div>
            <p className="font-bold text-sm sm:px-4 md:px-6 lg:px-8">{label}</p>
            <p className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">{subtext}</p>
        </div>
    </div>
);

const ProposeTradeModal: React.FC<ProposeTradeModalProps> = ({ myTeam, otherTeam, leagueId, dispatch, onClose, initialOffer }: any) => {
    const [playersToSend, setPlayersToSend] = React.useState<Set<number>>(new Set(initialOffer?.playersToSend));
    const [playersToReceive, setPlayersToReceive] = React.useState<Set<number>>(new Set(initialOffer?.playersToReceive));
    const [picksToSend, setPicksToSend] = React.useState<Set<string>>(new Set()); // key: "season-round"
    const [picksToReceive, setPicksToReceive] = React.useState<Set<string>>(new Set());
    const [analysis, setAnalysis] = React.useState<TradeAnalysis | null>(null);
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);

    const toggleAsset = (id: string | number, list: 'sendPlayer' | 'receivePlayer' | 'sendPick' | 'receivePick') => {
        let state: Set<any>, setState: React.Dispatch<React.SetStateAction<Set<any>>>;
        switch(list) {
            case 'sendPlayer': [state, setState] = [playersToSend, setPlayersToSend]; break;
            case 'receivePlayer': [state, setState] = [playersToReceive, setPlayersToReceive]; break;
            case 'sendPick': [state, setState] = [picksToSend, setPicksToSend]; break;
            case 'receivePick': [state, setState] = [picksToReceive, setPicksToReceive]; break;
        }

        const newSet = new Set(state);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setState(newSet);
        setAnalysis(null); // Reset analysis when trade changes
    };
    
    const stringToPick = (key: string): DraftPickAsset => {
        const [season, round] = key.split('-');
        return { season: parseInt(season), round: parseInt(round) };
    };

    const handleAnalyze = async () => {
        try {
            if ([playersToSend, playersToReceive, picksToSend, picksToReceive].every((s: any) => s.size === 0)) return;
            setIsAnalyzing(true);
            setAnalysis(null);
            
            const toSendP = players.filter((p: any) => playersToSend.has(p.id));
            const toReceiveP = players.filter((p: any) => playersToReceive.has(p.id));
            const toSendDK = Array.from(picksToSend).map(stringToPick);
            const toReceiveDK = Array.from(picksToReceive).map(stringToPick);
            
            const result = await analyzeTrade(myTeam.name, otherTeam.name, toSendP, toReceiveP, toSendDK, toReceiveDK);
            setAnalysis(result);
        } catch (error) {
            console.error('Analysis failed:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSendOffer = () => {
        dispatch({ type: 'ADD_NOTIFICATION', payload: { message: `Trade offer sent to ${otherTeam.name}!`, type: 'TRADE' }});
        onClose();
    };
    
    const getWinnerStyling = () => {
        if (!analysis || !analysis.winner) return { text: '', color: 'text-gray-400' };
        switch(analysis.winner) {
            case 'TEAM_A': return { text: `${myTeam.name} wins`, color: 'text-green-400' };
            case 'TEAM_B': return { text: `${otherTeam.name} wins`, color: 'text-red-400' };
            case 'EVEN': return { text: 'Fair Trade', color: 'text-yellow-400' };
            default: return { text: '', color: 'text-gray-400' };
        }
    };

    const winnerStyle = getWinnerStyling();

    return (
        <Modal isOpen={true} onClose={onClose}>
            <motion.div
                className="glass-pane rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col sm:px-4 md:px-6 lg:px-8"
                {...{
                    initial: { opacity: 0, scale: 0.95 },
                    animate: { opacity: 1, scale: 1 },
                    exit: { opacity: 0, scale: 0.95 },
                }}
            >
                <header className="p-4 border-b border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                    <h2 className="text-xl font-bold font-display text-center sm:px-4 md:px-6 lg:px-8">Propose Trade to {otherTeam.name}</h2>
                </header>

                <main className="flex-grow p-4 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 overflow-y-auto">
                    {/* My Team */}
                    <div className="flex flex-col gap-4 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex flex-col sm:px-4 md:px-6 lg:px-8">
                            <h3 className="font-semibold text-center mb-2 sm:px-4 md:px-6 lg:px-8">{myTeam.name} Gives:</h3>
                            <div className="bg-black/10 p-2 rounded-lg space-y-2 flex-grow h-48 overflow-y-auto sm:px-4 md:px-6 lg:px-8">
                                {myTeam.roster.map((p: any) => <AssetSelectItem key={p.id} label={p.name} subtext={`${p.position} - ${p.team}`} isSelected={playersToSend.has(p.id)} onToggle={() => toggleAsset(p.id, 'sendPlayer')} />)}
                            </div>
                        </div>
                         <div className="flex flex-col sm:px-4 md:px-6 lg:px-8">
                            <h3 className="font-semibold text-center mb-2 sm:px-4 md:px-6 lg:px-8">Draft Picks:</h3>
                            <div className="bg-black/10 p-2 rounded-lg space-y-2 flex-grow h-32 overflow-y-auto sm:px-4 md:px-6 lg:px-8">
                                {(myTeam.futureDraftPicks || []).map((p: any) => <AssetSelectItem key={`${p.season}-${p.round}`} label={`${p.season} Round ${p.round}`} subtext="Draft Pick" isSelected={picksToSend.has(`${p.season}-${p.round}`)} onToggle={() => toggleAsset(`${p.season}-${p.round}`, 'sendPick')} />)}
                            </div>
                        </div>
                    </div>
                    {/* Separator */}
                    <div className="flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
                        <ArrowRightLeftIcon className="w-8 h-8 text-cyan-400 sm:px-4 md:px-6 lg:px-8" />
                    </div>
                    {/* Other Team */}
                    <div className="flex flex-col gap-4 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex flex-col sm:px-4 md:px-6 lg:px-8">
                            <h3 className="font-semibold text-center mb-2 sm:px-4 md:px-6 lg:px-8">{otherTeam.name} Gives:</h3>
                            <div className="bg-black/10 p-2 rounded-lg space-y-2 flex-grow h-48 overflow-y-auto sm:px-4 md:px-6 lg:px-8">
                               {otherTeam.roster.map((p: any) => <AssetSelectItem key={p.id} label={p.name} subtext={`${p.position} - ${p.team}`} isSelected={playersToReceive.has(p.id)} onToggle={() => toggleAsset(p.id, 'receivePlayer')} />)}
                            </div>
                        </div>
                         <div className="flex flex-col sm:px-4 md:px-6 lg:px-8">
                            <h3 className="font-semibold text-center mb-2 sm:px-4 md:px-6 lg:px-8">Draft Picks:</h3>
                            <div className="bg-black/10 p-2 rounded-lg space-y-2 flex-grow h-32 overflow-y-auto sm:px-4 md:px-6 lg:px-8">
                                {(otherTeam.futureDraftPicks || []).map((p: any) => <AssetSelectItem key={`${p.season}-${p.round}`} label={`${p.season} Round ${p.round}`} subtext="Draft Pick" isSelected={picksToReceive.has(`${p.season}-${p.round}`)} onToggle={() => toggleAsset(`${p.season}-${p.round}`, 'receivePick')} />)}
                            </div>
                        </div>
                    </div>
                </main>
                
                 {(analysis || isAnalyzing) && (
                    <div className="p-4 border-t border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                         <h3 className="font-bold text-center text-cyan-300 mb-2 sm:px-4 md:px-6 lg:px-8">Oracle's Analysis</h3>
                         {isAnalyzing ? (
                             <div className="h-20 flex items-center justify-center text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Consulting the cosmos...</div>
                         ) : analysis && (
                            <div className="text-center sm:px-4 md:px-6 lg:px-8">
                                <p className={`font-bold text-lg ${winnerStyle.color}`}>{winnerStyle.text}</p>
                                <p className="text-xs text-gray-300 italic mt-1 sm:px-4 md:px-6 lg:px-8">"{analysis.summary}"</p>
                            </div>
                         )}
                    </div>
                 )}

                <footer className="p-4 flex justify-between items-center gap-4 border-t border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                    <button type="button" onClick={onClose} className="mobile-touch-target px-4 py-3 bg-transparent border border-[var(--panel-border)] text-[var(--text-secondary)] font-bold rounded-lg hover:bg-white/10 sm:px-4 md:px-6 lg:px-8" aria-label="Action button">Cancel</button>
                    <div className="flex gap-2 sm:px-4 md:px-6 lg:px-8">
                        <button onClick={handleAnalyze} disabled={isAnalyzing} className="mobile-touch-target flex items-center gap-2 px-4 py-3 bg-transparent border border-cyan-400/50 text-cyan-300 font-bold rounded-lg hover:bg-cyan-400/20 disabled:opacity-50 sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                            {isAnalyzing ? <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin sm:px-4 md:px-6 lg:px-8"></div> : <SparklesIcon />}
                            Analyze
                        </button>
                        <button onClick={handleSendOffer} className="mobile-touch-target px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-white font-bold rounded-lg sm:px-4 md:px-6 lg:px-8" aria-label="Action button">Send Offer</button>
                    </div>
                </footer>
            </motion.div>
        </Modal>
    );
};

const ProposeTradeModalWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <ProposeTradeModal {...props} />
  </ErrorBoundary>
);

export default React.memo(ProposeTradeModalWithErrorBoundary);