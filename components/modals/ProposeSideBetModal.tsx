
import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo } from &apos;react&apos;;
import { motion } from &apos;framer-motion&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;
import { useLeague } from &apos;../../hooks/useLeague&apos;;
import { Modal } from &apos;../ui/Modal&apos;;
import { SwordsIcon } from &apos;../icons/SwordsIcon&apos;;

interface ProposeSideBetModalProps {
}
    onClose: () => void;

}

const ProposeSideBetModal: React.FC<ProposeSideBetModalProps> = ({ onClose }: any) => {
}
    const { dispatch } = useAppState();
    const { league, myTeam } = useLeague();
    const [opponentId, setOpponentId] = React.useState<string>(&apos;&apos;);
    const [terms, setTerms] = React.useState(&apos;&apos;);
    const [stakes, setStakes] = React.useState(&apos;&apos;);

    if (!league || !myTeam) return null;

    const opponents = league.teams.filter((t: any) => t.id !== myTeam.id);

    const handleSubmit = (e: React.FormEvent) => {
}
        e.preventDefault();
        if (!opponentId || !terms.trim() || !stakes.trim()) {
}
            dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: { message: "All fields are required.", type: &apos;SYSTEM&apos; } });
            return;
        }

        dispatch({
}
            type: &apos;PROPOSE_SIDE_BET&apos;,
            payload: {
}
                leagueId: league.id,
                bet: {
}
                    proposerId: myTeam.id,
                    accepterId: Number(opponentId),
                    terms,
//                     stakes
                }
            }
        });
        dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: { message: &apos;Side bet proposed!&apos;, type: &apos;SYSTEM&apos; } });
        onClose();
    };

    const labelClasses = "block text-sm font-medium text-gray-400 mb-1";
    const inputClasses = "mobile-touch-target w-full bg-black/20 px-3 py-3 rounded-md border border-white/10";

    return (
        <Modal isOpen={true} onClose={onClose}>
            <motion.form
                onSubmit={handleSubmit}
                onClick={e => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <header className="p-4 border-b border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                    <h2 className="text-xl font-bold font-display flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                        <SwordsIcon /> Propose Side Bet
                    </h2>
                </header>
                <main className="p-4 space-y-4 sm:px-4 md:px-6 lg:px-8">
                    <div>
                        <label htmlFor="opponent-select" className={labelClasses}>Opponent</label>
                        <select
                            id="opponent-select"
                            value={opponentId}
                            onChange={e => setOpponentId(e.target.value)}
                        >
                            <option value="" disabled>Select a manager</option>
                            {opponents.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="bet-terms" className={labelClasses}>Bet Terms</label>
                        <input
                            id="bet-terms"
                            type="text"
                            value={terms}
                            onChange={e => setTerms(e.target.value)}
                            placeholder="e.g., My QB outscores yours this week"
                        />
                    </div>
                     <div>
                        <label htmlFor="bet-stakes" className={labelClasses}>The Stakes</label>
                        <input
                            id="bet-stakes"
                            type="text"
                            value={stakes}
                            onChange={e => setStakes(e.target.value)}
                            placeholder="e.g., Loser buys pizza"
                        />
                    </div>
                </main>
                <footer className="p-4 flex justify-end gap-2 border-t border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-bold bg-transparent border border-transparent hover:border-[var(--panel-border)] rounded-md sm:px-4 md:px-6 lg:px-8" aria-label="Action button">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-sm font-bold bg-cyan-500 text-black rounded-md sm:px-4 md:px-6 lg:px-8" aria-label="Action button">Propose Bet</button>
                </footer>
            </motion.form>
        </Modal>
    );
};

const ProposeSideBetModalWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <ProposeSideBetModal {...props} />
  </ErrorBoundary>
);

export default React.memo(ProposeSideBetModalWithErrorBoundary);
