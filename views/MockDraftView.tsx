/**
 * Mock Draft View - Practice drafts with AI opponents
 * Full-featured mock draft simulator for league members to prepare
 */

import React, { useState, useEffect, useCallback } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { useAppState } from &apos;../contexts/AppContext&apos;;
import { NFLPlayer } from &apos;../types&apos;;
import { NFL_PLAYERS_2024 } from &apos;../data/nflPlayers&apos;;
import PlayerSearch from &apos;../components/players/PlayerSearch&apos;;
import { 
}
  PlayIcon, 
  PauseIcon, 
  RotateCcwIcon, 
  SettingsIcon,
  TrophyIcon,
  ClockIcon,
  UsersIcon,
  ZapIcon,
  BrainIcon,
  ChevronRightIcon,
  CheckCircleIcon,
//   XCircleIcon
} from &apos;lucide-react&apos;;

interface MockDraftSettings {
}
  draftSpeed: &apos;instant&apos; | &apos;fast&apos; | &apos;realistic&apos;;
  aiDifficulty: &apos;easy&apos; | &apos;medium&apos; | &apos;hard&apos; | &apos;expert&apos;;
  draftPosition: number;
  teamCount: number;
  rounds: number;
  timerSeconds: number;
  enableTrades: boolean;
  enableKeepers: boolean;
  scoringFormat: &apos;standard&apos; | &apos;ppr&apos; | &apos;halfPpr&apos;;

}

interface DraftPick {
}
  round: number;
  pick: number;
  overall: number;
  teamId: number;
  player: NFLPlayer;
  timestamp: Date;
  isUserPick: boolean;
}

interface MockTeam {
}
  id: number;
  name: string;
  owner: string;
  isUser: boolean;
  roster: NFLPlayer[];
  draftStrategy?: &apos;balanced&apos; | &apos;rb-heavy&apos; | &apos;wr-heavy&apos; | &apos;best-available&apos;;
  needs: string[];

}

const MockDraftView: React.FC = () => {
}
  const { state, dispatch } = useAppState();
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isDraftActive, setIsDraftActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPick, setCurrentPick] = useState(1);
  const [currentRound, setCurrentRound] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(90);
  const [draftHistory, setDraftHistory] = useState<DraftPick[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<NFLPlayer[]>([...NFL_PLAYERS_2024]);
  const [teams, setTeams] = useState<MockTeam[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<NFLPlayer | null>(null);
  const [showPlayerSearch, setShowPlayerSearch] = useState(false);
  const [draftComplete, setDraftComplete] = useState(false);
  
  const [settings, setSettings] = useState<MockDraftSettings>({
}
    draftSpeed: &apos;realistic&apos;,
    aiDifficulty: &apos;medium&apos;,
    draftPosition: 5,
    teamCount: 10,
    rounds: 16,
    timerSeconds: 90,
    enableTrades: false,
    enableKeepers: false,
    scoringFormat: &apos;ppr&apos;
  });

  // Initialize teams
  const initializeTeams = useCallback(() => {
}
    const mockTeams: MockTeam[] = [];
    const teamNames = [
      &apos;Thunder Bolts&apos;, &apos;Storm Chasers&apos;, &apos;Lightning Strikes&apos;, &apos;Gridiron Giants&apos;,
      &apos;Field Generals&apos;, &apos;End Zone Elite&apos;, &apos;Touchdown Titans&apos;, &apos;Red Zone Raiders&apos;,
      &apos;Blitz Brigade&apos;, &apos;Victory Vipers&apos;
    ];
    
    const aiStrategies: MockTeam[&apos;draftStrategy&apos;][] = [
      &apos;balanced&apos;, &apos;rb-heavy&apos;, &apos;wr-heavy&apos;, &apos;best-available&apos;
    ];

    for (let i = 0; i < settings.teamCount; i++) {
}
      mockTeams.push({
}
        id: i + 1,
        name: i === settings.draftPosition - 1 ? &apos;Your Team&apos; : teamNames[i],
        owner: i === settings.draftPosition - 1 ? state.user?.name || &apos;You&apos; : `AI Manager ${i + 1}`,
        isUser: i === settings.draftPosition - 1,
        roster: [],
        draftStrategy: i === settings.draftPosition - 1 ? undefined : aiStrategies[Math.floor(Math.random() * aiStrategies.length)],
        needs: [&apos;QB&apos;, &apos;RB&apos;, &apos;RB&apos;, &apos;WR&apos;, &apos;WR&apos;, &apos;WR&apos;, &apos;TE&apos;, &apos;FLEX&apos;, &apos;K&apos;, &apos;DST&apos;]
      });
    }

    setTeams(mockTeams);
  }, [settings, state.user]);

  // Get current picking team
  const getCurrentPickingTeam = useCallback((): MockTeam | undefined => {
}
    const pickInRound = ((currentPick - 1) % settings.teamCount) + 1;
    const isEvenRound = currentRound % 2 === 0;
    const teamIndex = isEvenRound 
      ? settings.teamCount - pickInRound
      : pickInRound - 1;
    return teams[teamIndex];
  }, [currentPick, currentRound, settings.teamCount, teams]);

  // AI Draft Logic
  const makeAIPick = useCallback((team: MockTeam) => {
}
    let selectedPlayer: NFLPlayer | null = null;
    
    // AI difficulty affects decision quality
    const randomFactor = settings.aiDifficulty === &apos;easy&apos; ? 0.3 : 
                        settings.aiDifficulty === &apos;medium&apos; ? 0.15 : 
                        settings.aiDifficulty === &apos;hard&apos; ? 0.05 : 0;
    
    // Filter by team needs
    const positionNeeds = team.needs.filter((need: any) => 
      !team.roster.some((p: any) => p.position === need)
    );
    
    // Get top available players
    const topPlayers = [...availablePlayers]
      .sort((a, b) => a.adp - b.adp)
      .slice(0, 20);
    
    // Apply strategy
    switch (team.draftStrategy) {
}
      case &apos;rb-heavy&apos;:
        selectedPlayer = topPlayers.find((p: any) => p.position === &apos;RB&apos;) || topPlayers[0];
        break;
      case &apos;wr-heavy&apos;:
        selectedPlayer = topPlayers.find((p: any) => p.position === &apos;WR&apos;) || topPlayers[0];
        break;
      case &apos;balanced&apos;:
        selectedPlayer = topPlayers.find((p: any) => positionNeeds.includes(p.position)) || topPlayers[0];
        break;
      default:
        selectedPlayer = topPlayers[0];
    }

    // Add randomness based on difficulty
    if (Math.random() < randomFactor && topPlayers.length > 5) {
}
      const randomIndex = Math.floor(Math.random() * 5) + 1;
      selectedPlayer = topPlayers[randomIndex] || selectedPlayer;
    }

    return selectedPlayer;
  }, [availablePlayers, settings.aiDifficulty]);

  // Process a draft pick
  const processPick = useCallback((player: NFLPlayer, team: MockTeam) => {
}
    const pick: DraftPick = {
}
      round: currentRound,
      pick: ((currentPick - 1) % settings.teamCount) + 1,
      overall: currentPick,
      teamId: team.id,
      player,
      timestamp: new Date(),
      isUserPick: team.isUser
    };
    
    // Update draft history
    setDraftHistory(prev => [...prev, pick]);
    
    // Remove player from available
    setAvailablePlayers(prev => prev.filter((p: any) => p.id !== player.id));
    
    // Add player to team roster
    setTeams(prev => prev.map((t: any) => 
      t.id === team.id 
        ? { ...t, roster: [...t.roster, player] }
        : t
    ));
    
    // Update team needs
    const positionIndex = team.needs.indexOf(player.position);
    if (positionIndex > -1) {
}
      setTeams(prev => prev.map((t: any) => 
        t.id === team.id 
          ? { ...t, needs: t.needs.filter((_, i) => i !== positionIndex) }
          : t
      ));
    }

    // Move to next pick
    if (currentPick >= settings.teamCount * settings.rounds) {
}
      setDraftComplete(true);
      setIsDraftActive(false);
    } else {
}
      setCurrentPick(prev => prev + 1);
      if ((currentPick % settings.teamCount) === 0) {
}
        setCurrentRound(prev => prev + 1);
      }
      setTimeRemaining(settings.timerSeconds);
    }
  }, [currentPick, currentRound, settings]);

  // Timer effect
  useEffect(() => {
}
    if (!isDraftActive || isPaused || draftComplete) return;
    
    const currentTeam = getCurrentPickingTeam();
    if (!currentTeam) return;
    
    // AI picks
    if (!currentTeam.isUser) {
}
      const delay = settings.draftSpeed === &apos;instant&apos; ? 100 :
                   settings.draftSpeed === &apos;fast&apos; ? 1000 : 3000;
      
      const timeout = setTimeout(() => {
}
        const aiPick = makeAIPick(currentTeam);
        if (aiPick) {
}
          processPick(aiPick, currentTeam);
        }
      }, delay);
      
      return () => clearTimeout(timeout);
    }

    // User timer
    const interval = setInterval(() => {
}
      setTimeRemaining(prev => {
}
        if (prev <= 1) {
}
          // Auto-pick for user
          const autoPick = availablePlayers[0];
          if (autoPick && currentTeam) {
}
            processPick(autoPick, currentTeam);
          }
          return settings.timerSeconds;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isDraftActive, isPaused, draftComplete, getCurrentPickingTeam, makeAIPick, processPick, settings, availablePlayers]);

  // Start mock draft
  const startDraft = () => {
}
    initializeTeams();
    setIsSetupComplete(true);
    setIsDraftActive(true);
    setCurrentPick(1);
    setCurrentRound(1);
    setDraftHistory([]);
    setAvailablePlayers([...NFL_PLAYERS_2024]);
    setDraftComplete(false);
  };

  // Reset draft
  const resetDraft = () => {
}
    setIsSetupComplete(false);
    setIsDraftActive(false);
    setCurrentPick(1);
    setCurrentRound(1);
    setDraftHistory([]);
    setAvailablePlayers([...NFL_PLAYERS_2024]);
    setTeams([]);
    setDraftComplete(false);
    setTimeRemaining(settings.timerSeconds);
  };

  // Make user pick
  const makeUserPick = () => {
}
    const currentTeam = getCurrentPickingTeam();
    if (currentTeam?.isUser && selectedPlayer) {
}
      processPick(selectedPlayer, currentTeam);
      setSelectedPlayer(null);
    }
  };

  const currentTeam = getCurrentPickingTeam();
  const isUserTurn = currentTeam?.isUser || false;

  if (!isSetupComplete) {
}
    // Setup Screen
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-secondary)]/5 p-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-pane p-8"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                <TrophyIcon className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">Mock Draft Simulator</h1>
              <p className="text-[var(--text-secondary)]">Practice your draft strategy before the real thing</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Draft Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
                  Draft Settings
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Your Draft Position
                  </label>
                  <select
                    value={settings.draftPosition}
                    onChange={(e: any) => setSettings(prev => ({ ...prev, draftPosition: Number(e.target.value) }))}
                    className="glass-input w-full"
                  >
                    {Array.from({ length: settings.teamCount }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Pick #{i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Number of Teams
                  </label>
                  <select
                    value={settings.teamCount}
                    onChange={(e: any) => setSettings(prev => ({ ...prev, teamCount: Number(e.target.value) }))}
                    className="glass-input w-full"
                  >
                    <option value={8}>8 Teams</option>
                    <option value={10}>10 Teams</option>
                    <option value={12}>12 Teams</option>
                    <option value={14}>14 Teams</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Number of Rounds
                  </label>
                  <select
                    value={settings.rounds}
                    onChange={(e: any) => setSettings(prev => ({ ...prev, rounds: Number(e.target.value) }))}
                    className="glass-input w-full"
                  >
                    <option value={10}>10 Rounds</option>
                    <option value={12}>12 Rounds</option>
                    <option value={14}>14 Rounds</option>
                    <option value={16}>16 Rounds (Full)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Scoring Format
                  </label>
                  <select
                    value={settings.scoringFormat}
                    onChange={(e: any) => setSettings(prev => ({ ...prev, scoringFormat: e.target.value as any }))}
                    className="glass-input w-full"
                  >
                    <option value="standard">Standard</option>
                    <option value="ppr">PPR</option>
                    <option value="halfPpr">Half PPR</option>
                  </select>
                </div>
              </div>

              {/* AI Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <BrainIcon className="w-5 h-5" />
                  AI Settings
                </h3>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    AI Difficulty
                  </label>
                  <select
                    value={settings.aiDifficulty}
                    onChange={(e: any) => setSettings(prev => ({ ...prev, aiDifficulty: e.target.value as any }))}
                    className="glass-input w-full"
                  >
                    <option value="easy">Easy - Random picks</option>
                    <option value="medium">Medium - Basic strategy</option>
                    <option value="hard">Hard - Smart drafting</option>
                    <option value="expert">Expert - Optimal picks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Draft Speed
                  </label>
                  <select
                    value={settings.draftSpeed}
                    onChange={(e: any) => setSettings(prev => ({ ...prev, draftSpeed: e.target.value as any }))}
                    className="glass-input w-full"
                  >
                    <option value="instant">Instant</option>
                    <option value="fast">Fast (1 sec)</option>
                    <option value="realistic">Realistic (3 sec)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Timer (seconds)
                  </label>
                  <select
                    value={settings.timerSeconds}
                    onChange={(e: any) => setSettings(prev => ({ ...prev, timerSeconds: Number(e.target.value) }))}
                    className="glass-input w-full"
                  >
                    <option value={30}>30 seconds</option>
                    <option value={60}>60 seconds</option>
                    <option value={90}>90 seconds</option>
                    <option value={120}>120 seconds</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.enableTrades}
                      onChange={(e: any) => setSettings(prev => ({ ...prev, enableTrades: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm text-[var(--text-secondary)]">Enable Draft Pick Trades</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.enableKeepers}
                      onChange={(e: any) => setSettings(prev => ({ ...prev, enableKeepers: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm text-[var(--text-secondary)]">Enable Keeper Players</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="glass-pane p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Mock Draft Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                  <span>Real draft timer with auto-pick</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                  <span>Smart AI opponents with strategies</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                  <span>Full player search and filtering</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                  <span>Draft history and analysis</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                  <span>Team roster management</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                  <span>Export draft results</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={startDraft}
                className="glass-button px-6 py-2 flex items-center gap-2"
              >
                <PlayIcon className="w-5 h-5" />
                Start Mock Draft
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Draft Room
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-secondary)]/5">
      {/* Header */}
      <div className="glass-pane border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">Mock Draft Room</h1>
            <div className="flex items-center gap-2">
              <span className="text-[var(--text-secondary)]">Round</span>
              <span className="text-xl font-bold text-white">{currentRound}/{settings.rounds}</span>
              <span className="text-[var(--text-secondary)] ml-4">Pick</span>
              <span className="text-xl font-bold text-white">{currentPick}/{settings.teamCount * settings.rounds}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isUserTurn && !draftComplete && (
}
              <div className="flex items-center gap-2 text-white">
                <ClockIcon className="w-5 h-5" />
                <span className="text-2xl font-bold">{timeRemaining}s</span>
              </div>
            )}
            
            <button
              onClick={() => setIsPaused(!isPaused)}
              disabled={draftComplete}
              className="glass-button p-2"
            >
              {isPaused ? <PlayIcon className="w-5 h-5" /> : <PauseIcon className="w-5 h-5" />}
            </button>
            
            <button
              onClick={resetDraft}
              className="glass-button p-2"
            >
              <RotateCcwIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Draft Board */}
        <div className="lg:col-span-2 space-y-4">
          {/* Current Pick */}
          {!draftComplete && (
}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass-pane p-4 ${isUserTurn ? &apos;border-2 border-green-400&apos; : &apos;&apos;}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {isUserTurn ? &apos;Your Pick!&apos; : `${currentTeam?.name} is picking...`}
                  </h3>
                  <p className="text-[var(--text-secondary)]">
                    Pick #{currentPick} Overall (Round {currentRound}, Pick {((currentPick - 1) % settings.teamCount) + 1})
                  </p>
                </div>
                {isUserTurn && (
}
                  <button
                    onClick={() => setShowPlayerSearch(true)}
                    className="glass-button px-4 py-2"
                  >
                    Search Players
                  </button>
                )}
              </div>

              {isUserTurn && selectedPlayer && (
}
                <div className="flex items-center justify-between p-3 glass-pane">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
}
                      ${selectedPlayer.position === &apos;QB&apos; ? &apos;bg-red-500&apos; :
}
                        selectedPlayer.position === &apos;RB&apos; ? &apos;bg-green-500&apos; :
                        selectedPlayer.position === &apos;WR&apos; ? &apos;bg-blue-500&apos; :
                        selectedPlayer.position === &apos;TE&apos; ? &apos;bg-yellow-500&apos; :
                        &apos;bg-gray-500&apos;}`}>
                      {selectedPlayer.position}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{selectedPlayer.name}</p>
                      <p className="text-sm text-[var(--text-secondary)]">{selectedPlayer.team} • ADP: {selectedPlayer.adp}</p>
                    </div>
                  </div>
                  <button
                    onClick={makeUserPick}
                    className="glass-button px-4 py-2 bg-green-500 text-white"
                  >
                    Draft Player
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Draft Complete */}
          {draftComplete && (
}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-pane p-8 text-center"
            >
              <TrophyIcon className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">Mock Draft Complete!</h2>
              <p className="text-[var(--text-secondary)] mb-6">
                Review your team below and try different strategies
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={resetDraft}
                  className="glass-button px-6 py-2"
                >
                  Start New Mock Draft
                </button>
                <button
                  onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;DRAFT_PREP_CENTER&apos; })}
                  className="glass-button px-6 py-2"
                >
                  Back to Draft Prep
                </button>
              </div>
            </motion.div>
          )}

          {/* Recent Picks */}
          <div className="glass-pane p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Picks</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {draftHistory.slice(-10).reverse().map((pick, index) => (
}
                  <motion.div
                    key={`${pick.round}-${pick.pick}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center justify-between p-3 rounded-lg ${
}
                      pick.isUserPick ? &apos;bg-green-500/20 border border-green-500/30&apos; : &apos;bg-white/5&apos;
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-[var(--text-secondary)]">
                        {pick.overall}.
                      </span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white
}
                        ${pick.player.position === &apos;QB&apos; ? &apos;bg-red-500&apos; :
}
                          pick.player.position === &apos;RB&apos; ? &apos;bg-green-500&apos; :
                          pick.player.position === &apos;WR&apos; ? &apos;bg-blue-500&apos; :
                          pick.player.position === &apos;TE&apos; ? &apos;bg-yellow-500&apos; :
                          &apos;bg-gray-500&apos;}`}>
                        {pick.player.position}
                      </div>
                      <div>
                        <p className="font-medium text-white">{pick.player.name}</p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {pick.player.team} • {teams.find((t: any) => t.id === pick.teamId)?.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[var(--text-secondary)]">
                        R{pick.round}.{pick.pick}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Your Team */}
          <div className="glass-pane p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Your Team</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {teams.find((t: any) => t.isUser)?.roster.map((player, index) => (
}
                <div
                  key={player.id}
                  className="flex items-center gap-2 p-2 bg-white/5 rounded-lg"
                >
                  <span className="text-sm text-[var(--text-secondary)]">{index + 1}.</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white
}
                    ${player.position === &apos;QB&apos; ? &apos;bg-red-500&apos; :
}
                      player.position === &apos;RB&apos; ? &apos;bg-green-500&apos; :
                      player.position === &apos;WR&apos; ? &apos;bg-blue-500&apos; :
                      player.position === &apos;TE&apos; ? &apos;bg-yellow-500&apos; :
                      &apos;bg-gray-500&apos;}`}>
                    {player.position}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{player.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{player.team}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Boards */}
        <div className="space-y-4">
          <div className="glass-pane p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Draft Order</h3>
            <div className="space-y-2">
              {teams.map((team, index) => (
}
                <div
                  key={team.id}
                  className={`flex items-center justify-between p-2 rounded-lg ${
}
                    getCurrentPickingTeam()?.id === team.id ? &apos;bg-blue-500/20 border border-blue-500/30&apos; :
                    team.isUser ? &apos;bg-green-500/10&apos; : &apos;bg-white/5&apos;
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[var(--text-secondary)]">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {team.name}
                        {team.isUser && &apos; (You)&apos;}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {team.roster.length} players
                      </p>
                    </div>
                  </div>
                  {team.draftStrategy && (
}
                    <span className="text-xs px-2 py-1 bg-white/10 rounded">
                      {team.draftStrategy}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Top Available */}
          <div className="glass-pane p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Top Available</h3>
            <div className="space-y-2">
              {availablePlayers.slice(0, 10).map((player: any) => (
}
                <div
                  key={player.id}
                  className="flex items-center justify-between p-2 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer"
                  onClick={() => isUserTurn && setSelectedPlayer(player)}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white
}
                      ${player.position === &apos;QB&apos; ? &apos;bg-red-500&apos; :
}
                        player.position === &apos;RB&apos; ? &apos;bg-green-500&apos; :
                        player.position === &apos;WR&apos; ? &apos;bg-blue-500&apos; :
                        player.position === &apos;TE&apos; ? &apos;bg-yellow-500&apos; :
                        &apos;bg-gray-500&apos;}`}>
                      {player.position}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{player.name}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{player.team}</p>
                    </div>
                  </div>
                  <span className="text-xs text-[var(--text-secondary)]">
                    ADP {player.adp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Player Search Modal */}
      {showPlayerSearch && (
}
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-pane p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Select Player</h2>
              <button
                onClick={() => setShowPlayerSearch(false)}
                className="glass-button p-2"
              >
                <XCircleIcon className="w-5 h-5" />
              </button>
            </div>
            <PlayerSearch>
              players={availablePlayers}
              onSelectPlayer={(player: any) => {
}
                setSelectedPlayer(player);
                setShowPlayerSearch(false);
              }}
              showStats={true}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MockDraftView;