

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo } from &apos;react&apos;;
import { motion } from &apos;framer-motion&apos;;
import type { Team, Player, League, ChampionshipOddsSimulation } from &apos;../../types&apos;;
import { players } from &apos;../../data/players&apos;;
import { Modal } from &apos;../ui/Modal&apos;;
import { ArrowRightLeftIcon } from &apos;../icons/ArrowRightLeftIcon&apos;;
import { SparklesIcon } from &apos;../icons/SparklesIcon&apos;;
import { simulateTradeImpactOnOdds } from &apos;../../services/geminiService&apos;;
import { useLeague } from &apos;../../hooks/useLeague&apos;;
import LoadingSpinner from &apos;../ui/LoadingSpinner&apos;;
import { ArrowDownIcon } from &apos;../icons/ArrowDownIcon&apos;;
import { ArrowUpIcon } from &apos;../icons/ArrowUpIcon&apos;;
import { MinusIcon } from &apos;../icons/MinusIcon&apos;;

interface TradeScenarioModalProps {
}
    league: League;
    onClose: () => void;

}

const PlayerSelectItem: React.FC<{ player: Player; isSelected: boolean; onToggle: () => void }> = ({ player, isSelected, onToggle }: any) => (
    <div
        onClick={onToggle}
        className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
}
            isSelected ? &apos;bg-cyan-500/30 ring-2 ring-cyan-400&apos; : &apos;bg-black/10 hover:bg-black/20&apos;
        }`}
     role="button" tabIndex={0}>
        <div>
            <p className="font-bold text-sm sm:px-4 md:px-6 lg:px-8">{player.name}</p>
            <p className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">{player.position} - {player.team}</p>
        </div>
    </div>
);

const SimulationResult: React.FC<{ result: ChampionshipOddsSimulation, league: League, myTeamId: number, opponentTeamId: number }> = ({ result, league, myTeamId, opponentTeamId }: any) => {
}
    const changes = result.after.map((after: any) => {
}
        const before = result.before.find((b: any) => b.teamId === after.teamId);
        const change = before ? after.probability - before.probability : 0;
        return {
}
            team: league.teams.find((t: any) => t.id === after.teamId),
            before: before?.probability,
            after: after.probability,
//             change
        };
    }).sort((a,b) => b.change - a.change);

    const ChangeIndicator = ({ change }: { change: number }) => {
}
        if (Math.abs(change) < 0.1) return <MinusIcon className="text-gray-400 sm:px-4 md:px-6 lg:px-8" />;
        if (change > 0) return <ArrowUpIcon className="text-green-400 sm:px-4 md:px-6 lg:px-8" />;
        return <ArrowDownIcon className="text-red-400 sm:px-4 md:px-6 lg:px-8" />;
    };

    return (
        <div className="p-4 bg-black/20 rounded-lg sm:px-4 md:px-6 lg:px-8">
            <h4 className="font-bold text-lg text-center text-cyan-300 mb-2 sm:px-4 md:px-6 lg:px-8">Simulation Results</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto sm:px-4 md:px-6 lg:px-8">
                {changes.map(({ team, before, after, change }: any) => (
                    <div key={team?.id} className={`p-2 rounded-md flex items-center justify-between text-sm ${team?.id === myTeamId || team?.id === opponentTeamId ? &apos;bg-cyan-900/50&apos; : &apos;&apos;}`}>
                        <span>{team?.name}</span>
                        <div className="flex items-center gap-2 font-mono sm:px-4 md:px-6 lg:px-8">
                            <span>{before?.toFixed(1)}%</span>
                            <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">→</span>
                            <span className="font-bold sm:px-4 md:px-6 lg:px-8">{after.toFixed(1)}%</span>
                            <div className="w-16 text-right flex items-center justify-end gap-1 sm:px-4 md:px-6 lg:px-8">
                                <ChangeIndicator change={change} />
                                <span className={change > 0 ? &apos;text-green-400&apos; : change < 0 ? &apos;text-red-400&apos; : &apos;text-gray-400&apos;}>
                                    ({change > 0 && &apos;+&apos;}{change.toFixed(1)}%)
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TradeScenarioModal: React.FC<TradeScenarioModalProps> = ({ league, onClose }: any) => {
}
    const { myTeam } = useLeague();
    const [opponentId, setOpponentId] = React.useState<number | null>(null);
    const [playersToSend, setPlayersToSend] = React.useState<Set<number>>(new Set());
    const [playersToReceive, setPlayersToReceive] = React.useState<Set<number>>(new Set());
    const [simulationResult, setSimulationResult] = React.useState<ChampionshipOddsSimulation | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const opponentTeam = league.teams.find((t: any) => t.id === opponentId);

    const togglePlayer = (playerId: number, list: &apos;send&apos; | &apos;receive&apos;) => {
}
        const [state, setState] = list === &apos;send&apos; ? [playersToSend, setPlayersToSend] : [playersToReceive, setPlayersToReceive];
        const newSet = new Set(state);
        if (newSet.has(playerId)) newSet.delete(playerId);
        else newSet.add(playerId);
        setState(newSet);
        setSimulationResult(null);
    };

    const handleSimulate = async () => {
}
    try {
}
        if (!myTeam || !opponentTeam || (playersToSend.size === 0 && playersToReceive.size === 0)) return;
        setIsLoading(true);
        setSimulationResult(null);

        const toSend = players.filter((p: any) => playersToSend.has(p.id));
        const toReceive = players.filter((p: any) => playersToReceive.has(p.id));

        const after = await simulateTradeImpactOnOdds(league, myTeam, opponentTeam, toSend, toReceive);

        if (after) {
}
            const before = league.teams.map((t: any) => ({
}
                teamId: t.id,
                probability: t.championshipProbHistory?.find((h: any) => h.week === league.currentWeek)?.probability || 0,
            
    }));
            setSimulationResult({ before, after });

        setIsLoading(false);
    };
    
    return (
        <Modal isOpen={true} onClose={onClose}>
            <motion.div
                className="glass-pane rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col sm:px-4 md:px-6 lg:px-8"
                {...{
}
                    initial: { opacity: 0, scale: 0.95 },
                    animate: { opacity: 1, scale: 1 },
                }}
            >
                <header className="p-4 border-b border-[var(--panel-border)] text-center sm:px-4 md:px-6 lg:px-8">
                    <h2 className="text-xl font-bold font-display sm:px-4 md:px-6 lg:px-8">"What If?" Trade Simulator</h2>
                </header>

                <main className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col sm:px-4 md:px-6 lg:px-8">
                        <h3 className="font-semibold text-center mb-2 sm:px-4 md:px-6 lg:px-8">{myTeam?.name} Gives:</h3>
                        <div className="bg-black/10 p-2 rounded-lg space-y-2 flex-grow h-48 overflow-y-auto sm:px-4 md:px-6 lg:px-8">
                            {myTeam?.roster.map((p: any) => <PlayerSelectItem key={p.id} player={p} isSelected={playersToSend.has(p.id)} onToggle={() => togglePlayer(p.id, &apos;send&apos;)} />)}
                        </div>
                    </div>
                    <div className="flex flex-col sm:px-4 md:px-6 lg:px-8">
                         <label htmlFor="opponent-select" className="block text-sm text-center font-medium text-gray-400 mb-1 sm:px-4 md:px-6 lg:px-8">Trade with:</label>
                        <select
                            id="opponent-select"
                            value={opponentId || &apos;&apos;}
                            onChange={(e: any) => {
}
                                setOpponentId(Number(e.target.value));
                                setPlayersToReceive(new Set());
                                setSimulationResult(null);
                            }}
                            className="w-full bg-black/20 p-2 rounded-md border border-white/10 mb-2 sm:px-4 md:px-6 lg:px-8"
                        >
                            <option value="" disabled>Select a Team</option>
                            {league.teams.filter((t: any) => t.id !== myTeam?.id).map((t: any) => (
}
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                        <div className={`bg-black/10 p-2 rounded-lg space-y-2 flex-grow h-48 overflow-y-auto ${!opponentTeam ? &apos;flex items-center justify-center text-gray-500&apos; : &apos;&apos;}`}>
                            {opponentTeam ? 
}
                                opponentTeam.roster.map((p: any) => <PlayerSelectItem key={p.id} player={p} isSelected={playersToReceive.has(p.id)} onToggle={() => togglePlayer(p.id, &apos;receive&apos;)} />)
                               : <p>Select an opponent to see their roster.</p>

                        </div>
                    </div>
                </main>

                <div className="px-4 pb-4 sm:px-4 md:px-6 lg:px-8">
                     {isLoading ? <LoadingSpinner size="sm" text="Simulating season outcomes..." /> :
}
                      simulationResult && myTeam && opponentTeam ? <SimulationResult result={simulationResult} league={league} myTeamId={myTeam.id} opponentTeamId={opponentTeam.id} /> : null

                </div>
                
                <footer className="p-4 flex justify-between items-center border-t border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                    <button type="button" onClick={onClose} className="mobile-touch-target px-4 py-3 bg-transparent border border-transparent hover:border-[var(--panel-border)] text-[var(--text-secondary)] font-bold rounded-lg sm:px-4 md:px-6 lg:px-8" aria-label="Action button">Close</button>
                    <button onClick={handleSimulate} disabled={!opponentTeam || isLoading} className="mobile-touch-target flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-lg disabled:opacity-50 sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                        <SparklesIcon />
                        Simulate Impact
                    </button>
                </footer>
            </motion.div>
        </Modal>
    );
};

const TradeScenarioModalWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <TradeScenarioModal {...props} />
  </ErrorBoundary>
);

export default React.memo(TradeScenarioModalWithErrorBoundary);