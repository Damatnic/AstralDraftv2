/**
 * AI Draft Simulation Component
 * Interactive interface for running AI-powered mock drafts
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo, useState, useCallback, useEffect } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { 
}
    PlayIcon, 
    PauseIcon, 
    RotateCcwIcon, 
    SettingsIcon,
    UsersIcon,
    ClockIcon,
    TrophyIcon,
    BarChart3Icon,
//     ZapIcon
} from &apos;lucide-react&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { 
}
    draftSimulationEngine, 
    type SimulationSettings, 
    type SimulationResult, 
    type DraftPick,
    type DraftTeam 
} from &apos;../../services/draftSimulationEngine&apos;;
import { Player } from &apos;../../types&apos;;
import { players } from &apos;../../data/players&apos;;

interface SimulationState {
}
    isRunning: boolean;
    isPaused: boolean;
    currentRound: number;
    currentPick: number;
    currentTeam: DraftTeam | null;
    draftBoard: DraftPick[];
    availablePlayers: Player[];
    timeRemaining: number;

}

const DraftSimulationInterface: React.FC = () => {
}
  const [isLoading, setIsLoading] = React.useState(false);
    const [simulation, setSimulation] = useState<SimulationResult | null>(null);
    const [simulationState, setSimulationState] = useState<SimulationState>({
}
        isRunning: false,
        isPaused: false,
        currentRound: 1,
        currentPick: 1,
        currentTeam: null,
        draftBoard: [],
        availablePlayers: [],
        timeRemaining: 60
    });

    const [settings, setSettings] = useState<SimulationSettings>({
}
        draftType: &apos;snake&apos;,
        rounds: 16,
        teams: 12,
        userPosition: 6,
        scoringType: &apos;ppr&apos;,
        positionLimits: { QB: 3, RB: 8, WR: 8, TE: 3, K: 2, DST: 3 },
        benchSize: 7,
        aiDifficulty: &apos;medium&apos;,
        realtimeSpeed: 2, // 2x speed
        includeRookies: true,
        injuryUpdates: true
    });

    const [showSettings, setShowSettings] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

    // Initialize simulation
    const initializeSimulation = useCallback(async () => {
}
        try {
}

            const newSimulation = await draftSimulationEngine.startSimulation(settings, players);
            setSimulation(newSimulation);
            setSelectedTeam(newSimulation.userTeam.id);
            
            setSimulationState({
}
                isRunning: false,
                isPaused: false,
                currentRound: 1,
                currentPick: 1,
                currentTeam: newSimulation.teams[0],
                draftBoard: [],
                availablePlayers: [...players],
                timeRemaining: 60
            });

    } catch (error) {
}

    }, [settings]);

    // Start/resume simulation
    const startSimulation = useCallback(() => {
}
        if (!simulation) return;
        
        setSimulationState(prev => ({
}
            ...prev,
            isRunning: true,
            isPaused: false
        }));
    }, [simulation]);

    // Pause simulation
    const pauseSimulation = useCallback(() => {
}
        setSimulationState(prev => ({
}
            ...prev,
            isRunning: false,
            isPaused: true
        }));
    }, []);

    // Reset simulation
    const resetSimulation = useCallback(() => {
}
        setSimulation(null);
        setSimulationState({
}
            isRunning: false,
            isPaused: false,
            currentRound: 1,
            currentPick: 1,
            currentTeam: null,
            draftBoard: [],
            availablePlayers: [],
            timeRemaining: 60
        });
    }, []);

    // Simulate next pick
    const simulateNextPick = useCallback(async () => {
}
        if (!simulation || !simulationState.currentTeam) return;

        try {
}
            const pick = draftSimulationEngine.simulateAIPick(
                simulationState.currentTeam,
                simulationState.availablePlayers,
                simulationState.currentRound,
//                 settings
            );

            // Update simulation state
            setSimulationState(prev => {
}
                const newDraftBoard = [...prev.draftBoard, pick];
                const newAvailablePlayers = prev.availablePlayers.filter((p: any) => p.id !== pick.player?.id);
                
                // Calculate next pick
                const nextPickNumber = prev.currentPick + 1;
                const isNewRound = nextPickNumber > settings.teams;
                const newRound = isNewRound ? prev.currentRound + 1 : prev.currentRound;
                const newPick = isNewRound ? 1 : nextPickNumber;
                
                // Determine next team based on snake draft
                let nextTeamIndex = 0;
                if (settings.draftType === &apos;snake&apos;) {
}
                    if (newRound % 2 === 1) {
}
                        nextTeamIndex = newPick - 1;
                    } else {
}
                        nextTeamIndex = settings.teams - newPick;

                } else {
}
                    nextTeamIndex = newPick - 1;

                const nextTeam = simulation.teams[nextTeamIndex];

                return {
}
                    ...prev,
                    currentRound: newRound,
                    currentPick: newPick,
                    currentTeam: nextTeam,
                    draftBoard: newDraftBoard,
                    availablePlayers: newAvailablePlayers,
                    timeRemaining: 60
                };
            });

            // Check if draft is complete
            if (simulationState.currentRound >= settings.rounds) {
}
                setSimulationState(prev => ({ ...prev, isRunning: false }));
                
                // Generate final analytics
                const analytics = draftSimulationEngine.generateAnalytics(simulation);
                setSimulation(prev => prev ? { ...prev, analytics } : null);

    } catch (error) {
}

    }, [simulation, simulationState, settings]);

    // Auto-advance simulation when running
    useEffect(() => {
}
        if (!simulationState.isRunning) return;

        const interval = setInterval(() => {
}
            setSimulationState(prev => {
}
                if (prev.timeRemaining <= 1) {
}
                    simulateNextPick();
                    return { ...prev, timeRemaining: 60 };

                return { ...prev, timeRemaining: prev.timeRemaining - 1 };
            });
        }, 1000 / settings.realtimeSpeed);

        return () => clearInterval(interval);
    }, [simulationState.isRunning, settings.realtimeSpeed, simulateNextPick]);

    // Initialize on mount
    useEffect(() => {
}
        initializeSimulation();
    }, [initializeSimulation]);

    const formatTime = (seconds: number): string => {
}
        return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, &apos;0&apos;)}`;
    };

    const getDraftPosition = (round: number, pick: number): number => {
}
        if (settings.draftType === &apos;snake&apos;) {
}
            if (round % 2 === 1) {
}
                return (round - 1) * settings.teams + pick;
            } else {
}
                return (round - 1) * settings.teams + (settings.teams - pick + 1);

        } else {
}
            return (round - 1) * settings.teams + pick;

    };

    const selectedTeamData = simulation?.teams.find((t: any) => t.id === selectedTeam);

    return (
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            <Widget title="🤖 AI Draft Simulation" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
                    {/* Control Panel */}
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-center space-x-4 sm:px-4 md:px-6 lg:px-8">
                            <div className="flex space-x-2 sm:px-4 md:px-6 lg:px-8">
                                {!simulation ? (
}
                                    <button
                                        onClick={initializeSimulation}
                                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8"
                                     aria-label="Action button">
                                        <PlayIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                        <span>Initialize Draft</span>
                                    </button>
                                ) : (
                                    <>
                                        {simulationState.isRunning ? (
}
                                            <button
                                                onClick={pauseSimulation}
                                                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8"
                                             aria-label="Action button">
                                                <PauseIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                                <span>Pause</span>
                                            </button>
                                        ) : (
                                            <button
                                                onClick={startSimulation}
                                                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8"
                                             aria-label="Action button">
                                                <PlayIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                                <span>{simulationState.isPaused ? &apos;Resume&apos; : &apos;Start&apos;}</span>
                                            </button>
                                        )}
                                        
                                        <button
                                            onClick={simulateNextPick}
                                            disabled={simulationState.isRunning}
                                            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8"
                                         aria-label="Action button">
                                            <ZapIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                            <span>Next Pick</span>
                                        </button>
                                    </>
                                )}
                                
                                <button
                                    onClick={resetSimulation}
                                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8"
                                 aria-label="Action button">
                                    <RotateCcwIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                    <span>Reset</span>
                                </button>
                            </div>

                            <button
                                onClick={() => setShowSettings(!showSettings)}
                            >
                                <SettingsIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                <span>Settings</span>
                            </button>
                        </div>

                        {/* Draft Status */}
                        {simulation && (
}
                            <div className="flex items-center space-x-6 text-sm text-gray-300 sm:px-4 md:px-6 lg:px-8">
                                <div className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                                    <BarChart3Icon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                    <span>Round {simulationState.currentRound}/{settings.rounds}</span>
                                </div>
                                <div className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                                    <UsersIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                    <span>Pick {simulationState.currentPick}/{settings.teams}</span>
                                </div>
                                <div className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                                    <ClockIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                    <span>{formatTime(simulationState.timeRemaining)}</span>
                                </div>
                                {simulationState.currentTeam && (
}
                                    <div className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                                        <span className="font-medium text-blue-400 sm:px-4 md:px-6 lg:px-8">
                                            {simulationState.currentTeam.name} OTC
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Settings Panel */}
                    <AnimatePresence>
                        {showSettings && (
}
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: &apos;auto&apos; }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-gray-800/30 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8"
                            >
                                <DraftSimulationSettingsComponent>
                                    settings={settings}
                                    onSettingsChange={setSettings}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Main Content */}
                    {simulation && (
}
                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Draft Board */}
                            <div className="lg:col-span-2">
                                <DraftBoard>
                                    draftBoard={simulationState.draftBoard}
                                    currentPick={getDraftPosition(simulationState.currentRound, simulationState.currentPick)}
                                    settings={settings}
                                />
                            </div>

                            {/* Team Panel */}
                            <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                                <TeamSelector>
                                    teams={simulation.teams}
                                    selectedTeam={selectedTeam}
                                    onTeamSelect={setSelectedTeam}
                                />
                                
                                {selectedTeamData && (
}
                                    <TeamRoster team={selectedTeamData} />
                                )}

                                {simulation.analytics.userRosterScore > 0 && (
}
                                    <DraftAnalytics analytics={simulation.analytics} />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Features Overview */}
                    <div className="bg-blue-900/20 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
                        <h3 className="text-lg font-semibold text-white mb-4 sm:px-4 md:px-6 lg:px-8">
                            🚀 AI Draft Simulation Features
                        </h3>
                        <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-300">
                            <div>• AI opponents with unique personalities</div>
                            <div>• Multiple draft strategies (Zero RB, Hero RB, etc.)</div>
                            <div>• Real-time draft simulation</div>
                            <div>• Advanced player evaluation algorithms</div>
                            <div>• Snake and linear draft formats</div>
                            <div>• Customizable scoring systems</div>
                            <div>• Draft analytics and insights</div>
                            <div>• Team comparison and rankings</div>
                            <div>• Pick timing and decision modeling</div>
                            <div>• Injury and rookie considerations</div>
                        </div>
                    </div>
                </div>
            </Widget>
        </div>
    );
};

// Settings Component
interface DraftSimulationSettingsProps {
}
    settings: SimulationSettings;
    onSettingsChange: (settings: SimulationSettings) => void;

}

const DraftSimulationSettingsComponent: React.FC<DraftSimulationSettingsProps> = ({
}
    settings,
//     onSettingsChange
}: any) => {
}
    const updateSetting = <K extends keyof SimulationSettings>(
        key: K,
        value: SimulationSettings[K]
    ) => {
}
        onSettingsChange({ ...settings, [key]: value });
    };

    return (
        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
            <h3 className="text-lg font-semibold text-white sm:px-4 md:px-6 lg:px-8">Draft Settings</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="draftType" className="block text-sm font-medium text-gray-300 mb-1 sm:px-4 md:px-6 lg:px-8">
                        Draft Type
                    </label>
                    <select
                        id="draftType"
                        value={settings.draftType}
                        onChange={(e: any) => updateSetting(&apos;draftType&apos;, e.target.value as &apos;snake&apos; | &apos;linear&apos;)}
                    >
                        <option value="snake">Snake Draft</option>
                        <option value="linear">Linear Draft</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="teams" className="block text-sm font-medium text-gray-300 mb-1 sm:px-4 md:px-6 lg:px-8">
//                         Teams
                    </label>
                    <select
                        id="teams"
                        value={settings.teams}
                        onChange={(e: any) => updateSetting(&apos;teams&apos;, Number(e.target.value))}
                    >
                        <option value={8}>8 Teams</option>
                        <option value={10}>10 Teams</option>
                        <option value={12}>12 Teams</option>
                        <option value={14}>14 Teams</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="userPosition" className="block text-sm font-medium text-gray-300 mb-1 sm:px-4 md:px-6 lg:px-8">
                        Your Position
                    </label>
                    <select
                        id="userPosition"
                        value={settings.userPosition}
                        onChange={(e: any) => updateSetting(&apos;userPosition&apos;, Number(e.target.value))}
                    >
                        {Array.from({ length: settings.teams }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {i + 1}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="scoringType" className="block text-sm font-medium text-gray-300 mb-1 sm:px-4 md:px-6 lg:px-8">
//                         Scoring
                    </label>
                    <select
                        id="scoringType"
                        value={settings.scoringType}
                        onChange={(e: any) => updateSetting(&apos;scoringType&apos;, e.target.value as any)}
                    >
                        <option value="standard">Standard</option>
                        <option value="ppr">PPR</option>
                        <option value="half_ppr">Half PPR</option>
                        <option value="superflex">Superflex</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="aiDifficulty" className="block text-sm font-medium text-gray-300 mb-1 sm:px-4 md:px-6 lg:px-8">
                        AI Difficulty
                    </label>
                    <select
                        id="aiDifficulty"
                        value={settings.aiDifficulty}
                        onChange={(e: any) => updateSetting(&apos;aiDifficulty&apos;, e.target.value as any)}
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                        <option value="expert">Expert</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="realtimeSpeed" className="block text-sm font-medium text-gray-300 mb-1 sm:px-4 md:px-6 lg:px-8">
//                         Speed
                    </label>
                    <select
                        id="realtimeSpeed"
                        value={settings.realtimeSpeed}
                        onChange={(e: any) => updateSetting(&apos;realtimeSpeed&apos;, Number(e.target.value))}
                    >
                        <option value={1}>1x Speed</option>
                        <option value={2}>2x Speed</option>
                        <option value={4}>4x Speed</option>
                        <option value={8}>8x Speed</option>
                    </select>
                </div>
            </div>

            <div className="flex space-x-4 sm:px-4 md:px-6 lg:px-8">
                <label className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                    <input
                        type="checkbox"
                        checked={settings.includeRookies}
                        onChange={(e: any) => updateSetting(&apos;includeRookies&apos;, e.target.checked)}
                    />
                    <span className="text-sm text-gray-300 sm:px-4 md:px-6 lg:px-8">Include Rookies</span>
                </label>

                <label className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                    <input
                        type="checkbox"
                        checked={settings?.injuryUpdates}
                        onChange={(e: any) => updateSetting(&apos;injuryUpdates&apos;, e.target.checked)}
                    />
                    <span className="text-sm text-gray-300 sm:px-4 md:px-6 lg:px-8">Injury Updates</span>
                </label>
            </div>
        </div>
    );
};

// Draft Board Component
interface DraftBoardProps {
}
    draftBoard: DraftPick[];
    currentPick: number;
    settings: SimulationSettings;

}

const DraftBoard: React.FC<DraftBoardProps> = ({ 
}
    draftBoard, 
    currentPick, 
//     settings 
}: any) => {
}
    return (
        <Widget title="Draft Board" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
            <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                {draftBoard.length === 0 ? (
}
                    <div className="text-center py-8 text-gray-400 sm:px-4 md:px-6 lg:px-8">
                        Draft hasn&apos;t started yet
                    </div>
                ) : (
                    <div className="space-y-1 sm:px-4 md:px-6 lg:px-8">
                        {draftBoard.slice(-10).map((pick, index) => (
}
                            <motion.div
                                key={pick.overallPick}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg sm:px-4 md:px-6 lg:px-8"
                            >
                                <div className="flex items-center space-x-3 sm:px-4 md:px-6 lg:px-8">
                                    <div className="text-sm font-bold text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                        {pick.overallPick}
                                    </div>
                                    <div>
                                        <div className="font-medium text-white sm:px-4 md:px-6 lg:px-8">
                                            {pick.player?.name}
                                        </div>
                                        <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                            {pick.player?.position} • {pick.player?.team}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right sm:px-4 md:px-6 lg:px-8">
                                    <div className="text-sm font-medium text-blue-400 sm:px-4 md:px-6 lg:px-8">
                                        {pick.teamName}
                                    </div>
                                    <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                        R{pick.round}.{pick.pick}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </Widget>
    );
};

// Team Selector Component
interface TeamSelectorProps {
}
    teams: DraftTeam[];
    selectedTeam: string | null;
    onTeamSelect: (teamId: string) => void;

}

const TeamSelector: React.FC<TeamSelectorProps> = ({
}
    teams,
    selectedTeam,
//     onTeamSelect
}: any) => {
}
    return (
        <Widget title="Teams" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
            <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                {teams.map((team: any) => (
}
                    <button
                        key={team.id}
                        onClick={() => onTeamSelect(team.id)}`}
                    >
                        <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                            <div>
                                <div className="font-medium sm:px-4 md:px-6 lg:px-8">{team.name}</div>
                                <div className="text-xs opacity-75 sm:px-4 md:px-6 lg:px-8">
                                    Pick {team.draftPosition} • {team.strategy.type}
                                </div>
                            </div>
                            <div className="text-sm sm:px-4 md:px-6 lg:px-8">
                                {team.roster.length} players
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </Widget>
    );
};

// Team Roster Component
interface TeamRosterProps {
}
    team: DraftTeam;

}

const TeamRoster: React.FC<TeamRosterProps> = ({ team }: any) => {
}
    return (
        <Widget title={`${team.name} Roster`} className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
            <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                {team.roster.length === 0 ? (
}
                    <div className="text-center py-4 text-gray-400 sm:px-4 md:px-6 lg:px-8">
                        No players drafted yet
                    </div>
                ) : (
                    team.roster.map((player, index) => (
                        <div
                            key={player.id}
                            className="flex items-center justify-between p-2 bg-gray-800/50 rounded sm:px-4 md:px-6 lg:px-8"
                        >
                            <div>
                                <div className="text-sm font-medium text-white sm:px-4 md:px-6 lg:px-8">
                                    {player.name}
                                </div>
                                <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                    {player.position} • {player.team}
                                </div>
                            </div>
                            <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                R{Math.floor(index / 12) + 1}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Widget>
    );
};

// Draft Analytics Component
interface DraftAnalyticsProps {
}
    analytics: any;

}

const DraftAnalytics: React.FC<DraftAnalyticsProps> = ({ analytics }: any) => {
}
    return (
        <Widget title="Draft Analytics" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
            <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-4 sm:px-4 md:px-6 lg:px-8">
                    <div className="bg-green-900/20 rounded-lg p-3 text-center sm:px-4 md:px-6 lg:px-8">
                        <TrophyIcon className="w-6 h-6 mx-auto mb-1 text-green-400 sm:px-4 md:px-6 lg:px-8" />
                        <div className="text-lg font-bold text-white sm:px-4 md:px-6 lg:px-8">#{analytics.userRosterRank}</div>
                        <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Team Rank</div>
                    </div>
                    <div className="bg-blue-900/20 rounded-lg p-3 text-center sm:px-4 md:px-6 lg:px-8">
                        <BarChart3Icon className="w-6 h-6 mx-auto mb-1 text-blue-400 sm:px-4 md:px-6 lg:px-8" />
                        <div className="text-lg font-bold text-white sm:px-4 md:px-6 lg:px-8">{analytics.userRosterScore}</div>
                        <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Team Score</div>
                    </div>
                </div>

                {analytics.strengthsWeaknesses.strengths.length > 0 && (
}
                    <div>
                        <div className="text-sm font-medium text-green-400 mb-1 sm:px-4 md:px-6 lg:px-8">Strengths</div>
                        <div className="text-xs text-gray-300 sm:px-4 md:px-6 lg:px-8">
                            {analytics.strengthsWeaknesses.strengths.join(&apos;, &apos;)}
                        </div>
                    </div>
                )}

                {analytics.strengthsWeaknesses.weaknesses.length > 0 && (
}
                    <div>
                        <div className="text-sm font-medium text-red-400 mb-1 sm:px-4 md:px-6 lg:px-8">Weaknesses</div>
                        <div className="text-xs text-gray-300 sm:px-4 md:px-6 lg:px-8">
                            {analytics.strengthsWeaknesses.weaknesses.join(&apos;, &apos;)}
                        </div>
                    </div>
                )}
            </div>
        </Widget>
    );
};

const DraftSimulationInterfaceWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <DraftSimulationInterface {...props} />
  </ErrorBoundary>
);

export default React.memo(DraftSimulationInterfaceWithErrorBoundary);
