/**
 * Live Draft Room Component
 * Real-time draft interface for all 10 league members
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../../contexts/AppContext';
import { Player, Team } from '../../types';
import { NFL_TEAMS } from '../../data/nflPlayers';
import PlayerSearch from '../players/PlayerSearch';

interface DraftPick {
  round: number;
  pick: number;
  teamId: number;
  player: Player | null;
  timeRemaining: number;
  isComplete: boolean;
}

interface LiveDraftRoomProps {
  isActive?: boolean;
  onDraftComplete?: () => void;
}

const LiveDraftRoom: React.FC<LiveDraftRoomProps> = ({ 
  isActive = false, 
  onDraftComplete 
}: any) => {
  const { state, dispatch } = useAppState();
  const [currentPick, setCurrentPick] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(90);
  const [isDraftStarted, setIsDraftStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [draftPicks, setDraftPicks] = useState<DraftPick[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showPlayerSearch, setShowPlayerSearch] = useState(false);
  const [draftOrder, setDraftOrder] = useState<Team[]>([]);
  const [autoDraftEnabled, setAutoDraftEnabled] = useState<{[teamId: number]: boolean}>({});
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const league = state.leagues[0];
  const currentUser = state.user;
  const totalPicks = 160; // 16 rounds × 10 teams
  const totalRounds = 16;

  // Initialize draft order and picks
  useEffect(() => {
    if (league?.teams && draftOrder.length === 0) {
      const shuffledTeams = [...league.teams].sort(() => Math.random() - 0.5);
      setDraftOrder(shuffledTeams);
      
      // Initialize all draft picks
      const picks: DraftPick[] = [];
      for (let round = 1; round <= totalRounds; round++) {
        for (let pickInRound = 1; pickInRound <= 10; pickInRound++) {
          const teamIndex = round % 2 === 1 
            ? pickInRound - 1  // Odd rounds: normal order
            : 10 - pickInRound; // Even rounds: reverse order (snake)
          
          picks.push({
            round,
            pick: (round - 1) * 10 + pickInRound,
            teamId: shuffledTeams[teamIndex].id,
            player: null,
            timeRemaining: 90,
            isComplete: false
          });
        }
      }
      setDraftPicks(picks);
    }
  }, [league?.teams, draftOrder.length, totalRounds]);

  // Timer logic
  useEffect(() => {
    if (isDraftStarted && !isPaused && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleAutoDraft();
            return 90;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isDraftStarted, isPaused, timeRemaining]);

  // Sound notifications
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
    }
  }, []);

  const playSound = (type: 'pick' | 'timer' | 'turn') => {
    if (!state.soundEnabled || !audioRef.current) return;
    
    // Simple beep sounds (you could replace with actual audio files)
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    switch (type) {
      case 'pick':
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.3;
        break;
      case 'timer':
        oscillator.frequency.value = 400;
        gainNode.gain.value = 0.2;
        break;
      case 'turn':
        oscillator.frequency.value = 600;
        gainNode.gain.value = 0.4;
        break;
    }
    
    oscillator.start();
    oscillator.stop(context.currentTime + 0.2);
  };

  const getCurrentPickInfo = () => {
    const pick = draftPicks[currentPick - 1];
    if (!pick) return null;
    
    const team = draftOrder.find((t: any) => t.id === pick.teamId);
    return { pick, team };
  };

  const isUserTurn = () => {
    const pickInfo = getCurrentPickInfo();
    return pickInfo?.team?.owner.id === currentUser?.id;
  };

  const handleStartDraft = () => {
    setIsDraftStarted(true);
    setTimeRemaining(90);
    playSound('turn');
    
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        message: 'Draft has started! Good luck everyone!',
        type: 'SUCCESS'
      }
    });
  };

  const handlePauseDraft = () => {
    setIsPaused(!isPaused);
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        message: isPaused ? 'Draft resumed' : 'Draft paused',
        type: 'INFO'
      }
    });
  };

  const handlePlayerSelect = (player: Player) => {
    if (!isUserTurn() || !isDraftStarted) return;
    
    const pickInfo = getCurrentPickInfo();
    if (!pickInfo) return;

    // Add player to team roster
    dispatch({
      type: 'ADD_PLAYER_TO_ROSTER',
      payload: { teamId: pickInfo.team!.id, player }
    });

    // Update draft pick
    const updatedPicks = [...draftPicks];
    updatedPicks[currentPick - 1] = {
      ...pickInfo.pick,
      player,
      isComplete: true
    };
    setDraftPicks(updatedPicks);

    // Move to next pick
    advanceToNextPick(player);
    setShowPlayerSearch(false);
  };

  const handleAutoDraft = () => {
    const pickInfo = getCurrentPickInfo();
    if (!pickInfo) return;

    // Simple auto-draft logic - pick highest ranked available player
    const availablePlayers = league.allPlayers.filter((player: any) => 
      !draftPicks.some((pick: any) => pick.player?.id === player.id)
    );
    
    const bestAvailable = availablePlayers.sort((a, b) => a.fantasyRank - b.fantasyRank)[0];
    
    if (bestAvailable) {
      handlePlayerSelect(bestAvailable);
      
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: `${pickInfo.team?.name} auto-drafted ${bestAvailable.name}`,
          type: 'INFO'
        }
      });
    }
  };

  const advanceToNextPick = (selectedPlayer: Player) => {
    playSound('pick');
    
    if (currentPick >= totalPicks) {
      // Draft complete!
      setIsDraftStarted(false);
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: 'Draft Complete! Good luck this season!',
          type: 'SUCCESS'
        }
      });
      onDraftComplete?.();
      return;
    }

    setCurrentPick(prev => prev + 1);
    setTimeRemaining(90);
    playSound('turn');
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'QB': return 'bg-red-600';
      case 'RB': return 'bg-green-600';
      case 'WR': return 'bg-blue-600';
      case 'TE': return 'bg-yellow-600';
      case 'K': return 'bg-purple-600';
      case 'DST': return 'bg-gray-600';
      default: return 'bg-gray-500';
    }
  };

  const pickInfo = getCurrentPickInfo();
  const isMyTurn = isUserTurn();

  return (
    <div className="space-y-6">
      {/* Draft Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Live Draft Room</h2>
            <p className="text-slate-400">
              Round {pickInfo?.pick.round || 1} • Pick {currentPick} of {totalPicks}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {!isDraftStarted ? (
              <button
                onClick={handleStartDraft}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
              >
                🚀 Start Draft
              </button>
            ) : (
              <button
                onClick={handlePauseDraft}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  isPaused 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                }`}
              >
                {isPaused ? '▶️ Resume' : '⏸️ Pause'}
              </button>
            )}
          </div>
        </div>

        {/* Current Pick Info */}
        {pickInfo && (
          <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-4">
              <span className="text-3xl">{pickInfo.team?.avatar}</span>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {pickInfo.team?.name}
                </h3>
                <p className="text-slate-400">{pickInfo.team?.owner.name}</p>
              </div>
              {isMyTurn && (
                <div className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                  YOUR TURN
                </div>
              )}
            </div>
            
            {/* Timer */}
            <div className="text-center">
              <div className={`text-4xl font-bold ${
                timeRemaining <= 10 ? 'text-red-400' : 'text-white'
              }`}>
                {timeRemaining}s
              </div>
              <div className="text-sm text-slate-400">Time Remaining</div>
            </div>
          </div>
        )}
      </div>

      {/* Draft Actions */}
      {isMyTurn && isDraftStarted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-900/20 border border-blue-600 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">Make Your Pick</h3>
          <div className="flex gap-4">
            <button
              onClick={() => setShowPlayerSearch(true)}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              🔍 Search Players
            </button>
            <button
              onClick={handleAutoDraft}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
            >
              🤖 Auto Draft
            </button>
          </div>
        </motion.div>
      )}

      {/* Draft Board */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Picks */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">Recent Picks</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {draftPicks
              .filter((pick: any) => pick.isComplete)
              .slice(-10)
              .reverse()
              .map((pick, index) => {
                const team = draftOrder.find((t: any) => t.id === pick.teamId);
                return (
                  <motion.div
                    key={pick.pick}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 text-white text-sm font-bold rounded flex items-center justify-center">
                        {pick.pick}
                      </div>
                      <div>
                        <p className="text-white font-medium">{pick.player?.name}</p>
                        <p className="text-xs text-slate-400">
                          {team?.name} • Round {pick.round}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`${getPositionColor(pick.player?.position || '')} text-white text-xs font-bold px-2 py-1 rounded`}>
                        {pick.player?.position}
                      </div>
                      <span className="text-slate-400 text-sm">
                        {NFL_TEAMS[pick.player?.team as keyof typeof NFL_TEAMS]?.name || pick.player?.team}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>

        {/* Team Rosters */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">Team Rosters</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {draftOrder.map((team: any) => {
              const teamPicks = draftPicks.filter((pick: any) => 
                pick.teamId === team.id && pick.isComplete
              );
              
              return (
                <div key={team.id} className="p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{team.avatar}</span>
                      <span className="text-white font-medium">{team.name}</span>
                    </div>
                    <span className="text-slate-400 text-sm">
                      {teamPicks.length}/16 picks
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {teamPicks.map((pick: any) => (
                      <span
                        key={pick.pick}
                        className={`${getPositionColor(pick.player?.position || '')} text-white text-xs px-2 py-1 rounded`}
                      >
                        {pick.player?.position}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Player Search Modal */}
      <AnimatePresence>
        {showPlayerSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPlayerSearch(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e: any) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">
                  Select Your Pick - {timeRemaining}s remaining
                </h3>
                <button
                  onClick={() => setShowPlayerSearch(false)}
                  className="text-slate-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <PlayerSearch
                onPlayerSelect={handlePlayerSelect}
                excludePlayerIds={draftPicks
                  .filter((pick: any) => pick.isComplete && pick.player)
                  .map((pick: any) => pick.player!.id)
                }
                showAddButton={false}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveDraftRoom;