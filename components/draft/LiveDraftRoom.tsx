/**
 * Live Draft Room Component
 * Premium real-time draft interface with advanced visuals
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
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
  onDraftComplete?: () => void;}

const LiveDraftRoom: React.FC<LiveDraftRoomProps> = ({ isActive = false, 
  onDraftComplete 
 }) => {
  const [isLoading, setIsLoading] = React.useState(false);
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
  const [showParticles, setShowParticles] = useState(false);
  const [recentPick, setRecentPick] = useState<Player | null>(null);
  const [isTimerCritical, setIsTimerCritical] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const draftRoomRef = useRef<HTMLDivElement>(null);

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


      setDraftPicks(picks);

  }, [league?.teams, draftOrder.length, totalRounds]);

  // Timer logic
  useEffect(() => {
    if (isDraftStarted && !isPaused && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleAutoDraft();
            return 90;

          return prev - 1;
        });
      }, 1000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);

    };
  }, [isDraftStarted, isPaused, timeRemaining]);

  // Timer critical state
  useEffect(() => {
    setIsTimerCritical(timeRemaining <= 15 && isDraftStarted && !isPaused);
  }, [timeRemaining, isDraftStarted, isPaused]);

  // Pick celebration effect
  useEffect(() => {
    if (recentPick) {
      setShowParticles(true);
      const timer = setTimeout(() => {
        setShowParticles(false);
        setRecentPick(null);
    }
  }, 3000);
      return () => clearTimeout(timer);

  }, [recentPick]);

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

    });
  };

  const handlePauseDraft = () => {
    setIsPaused(!isPaused);
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        message: isPaused ? 'Draft resumed' : 'Draft paused',
        type: 'INFO'

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
    const availablePlayers = league.allPlayers.filter((player: Player) => 
      !draftPicks.some((pick: DraftPick) => pick.player?.id === player.id)
    );
    
    const bestAvailable = availablePlayers.sort((a, b) => a.fantasyRank - b.fantasyRank)[0];
    
    if (bestAvailable) {
      handlePlayerSelect(bestAvailable);
      
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: `${pickInfo.team?.name} auto-drafted ${bestAvailable.name}`,
          type: 'INFO'

      });

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

      });
      onDraftComplete?.();
      return;

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

  };

  const pickInfo = getCurrentPickInfo();
  const isMyTurn = isUserTurn();

  return (
    <motion.div 
      ref={draftRoomRef}
      className="relative min-h-screen space-y-8 p-6 sm:px-4 md:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Premium Background Effects */}
      <div className="absolute inset-0 -z-10 sm:px-4 md:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 sm:px-4 md:px-6 lg:px-8" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(79,110,247,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.12),transparent_50%)] sm:px-4 md:px-6 lg:px-8" />
        {showParticles && (
          <div className="absolute inset-0 overflow-hidden sm:px-4 md:px-6 lg:px-8">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-primary-400 rounded-full sm:px-4 md:px-6 lg:px-8"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: window.innerHeight + 50,
                  scale: 0,
                  opacity: 0
                }}
                animate={{
                  y: -50,
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Premium Draft Header */}
      <motion.div 
        className="glass-panel-premium p-8 border border-white/10 sm:px-4 md:px-6 lg:px-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6 sm:px-4 md:px-6 lg:px-8">
          <div>
            <motion.h1 
              className="text-4xl font-bold text-gradient mb-2 sm:px-4 md:px-6 lg:px-8"
              initial={{ x: -30 }}
              animate={{ x: 0 }}
            >
              Live Draft Room
            </motion.h1>
            <p className="text-slate-300 text-lg sm:px-4 md:px-6 lg:px-8">
              Round {pickInfo?.pick.round || 1} • Pick {currentPick} of {totalPicks}
            </p>
          </div>
          
          <div className="flex items-center gap-4 sm:px-4 md:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              {!isDraftStarted ? (
                <motion.button
                  key="start"
                  onClick={handleStartDraft}
                  className="btn-success px-8 py-4 text-lg font-bold shadow-[0_0_30px_rgba(16,185,129,0.5)] sm:px-4 md:px-6 lg:px-8"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🚀 Start Draft
                </motion.button>
              ) : (
                <motion.button
                  key="pause"
                  onClick={handlePauseDraft}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isPaused 
                      ? 'btn-success shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-105'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isPaused ? '▶️ Resume' : '⏸️ Pause'}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Premium Current Pick Display */}
        <AnimatePresence>
          {pickInfo && (
            <motion.div 
              className="glass-card p-6 border-l-4 border-primary-500 relative overflow-hidden sm:px-4 md:px-6 lg:px-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              layout
            >
              {/* Animated background for current pick */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-cyan-400/10 to-transparent sm:px-4 md:px-6 lg:px-8"
                animate={isMyTurn ? {
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                } : {}}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              <div className="relative flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center gap-6 sm:px-4 md:px-6 lg:px-8">
                  <motion.div 
                    className="text-5xl sm:px-4 md:px-6 lg:px-8"
                    animate={isMyTurn ? {
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {pickInfo.team?.avatar}
                  </motion.div>
                  
                  <div>
                    <motion.h3 
                      className="text-2xl font-bold text-white mb-1 sm:px-4 md:px-6 lg:px-8"
                      animate={isMyTurn ? { color: ['#ffffff', '#4facfe', '#ffffff'] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {pickInfo.team?.name}
                    </motion.h3>
                    <p className="text-slate-300 text-lg sm:px-4 md:px-6 lg:px-8">{pickInfo.team?.owner.name}</p>
                    
                    <AnimatePresence>
                      {isMyTurn && (
                        <motion.div 
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-cyan-400 text-white text-sm font-bold rounded-full shadow-[0_0_20px_rgba(79,110,247,0.5)] mt-2 sm:px-4 md:px-6 lg:px-8"
                          initial={{ scale: 0, x: -50 }}
                          animate={{ 
                            scale: 1, 
                            x: 0,
                            boxShadow: [
                              '0_0_20px_rgba(79,110,247,0.5)',
                              '0_0_30px_rgba(79,110,247,0.8)',
                              '0_0_20px_rgba(79,110,247,0.5)'

                          }}
                          exit={{ scale: 0, x: 50 }}
                          transition={{ 
                            scale: { type: 'spring', stiffness: 500 },
                            boxShadow: { duration: 2, repeat: Infinity }
                          }}
                        >
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse sm:px-4 md:px-6 lg:px-8" />
                          YOUR TURN
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                {/* Premium Timer */}
                <div className="text-center relative sm:px-4 md:px-6 lg:px-8">
                  <motion.div 
                    className={`text-6xl font-bold relative ${
                      isTimerCritical 
                        ? 'text-red-400' 
                        : timeRemaining <= 30 
                          ? 'text-amber-400' 
                          : 'text-white'
                    }`}
                    animate={isTimerCritical ? {
                      scale: [1, 1.1, 1],
                      textShadow: [
                        '0_0_10px_rgba(239,68,68,0.5)',
                        '0_0_20px_rgba(239,68,68,0.8)',
                        '0_0_10px_rgba(239,68,68,0.5)'

                    } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {timeRemaining}
                    {isTimerCritical && (
                      <motion.div
                        className="absolute -inset-4 border-2 border-red-500 rounded-full sm:px-4 md:px-6 lg:px-8"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                  <div className="text-sm text-slate-400 font-medium mt-1 sm:px-4 md:px-6 lg:px-8">seconds left</div>
                  
                  {/* Timer progress bar */}
                  <div className="w-20 h-1 bg-slate-600 rounded-full mt-2 mx-auto overflow-hidden sm:px-4 md:px-6 lg:px-8">
                    <motion.div
                      className={`h-full rounded-full ${
                        isTimerCritical ? 'bg-red-500' : timeRemaining <= 30 ? 'bg-amber-500' : 'bg-primary-500'
                      }`}
                      animate={{ width: `${(timeRemaining / 90) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Premium Draft Actions */}
      <AnimatePresence>
        {isMyTurn && isDraftStarted && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            className="glass-panel-premium border-2 border-primary-500/30 shadow-[0_0_40px_rgba(79,110,247,0.2)] sm:px-4 md:px-6 lg:px-8"
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="p-8 sm:px-4 md:px-6 lg:px-8">
              <motion.h3 
                className="text-2xl font-bold text-gradient mb-6 flex items-center gap-3 sm:px-4 md:px-6 lg:px-8"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse sm:px-4 md:px-6 lg:px-8" />
                Make Your Pick
              </motion.h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                  onClick={() => setShowPlayerSearch(true)}
                  className="group relative p-6 glass-card border border-primary-500/30 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(79,110,247,0.3)] sm:px-4 md:px-6 lg:px-8"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4 sm:px-4 md:px-6 lg:px-8">
                    <div className="text-3xl group-hover:scale-110 transition-transform sm:px-4 md:px-6 lg:px-8">🔍</div>
                    <div>
                      <div className="text-lg font-bold text-white group-hover:text-primary-300 transition-colors sm:px-4 md:px-6 lg:px-8">
                        Search Players
                      </div>
                      <div className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">Browse available talent</div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 group-hover:from-primary-500/10 to-transparent rounded-xl transition-all duration-300 sm:px-4 md:px-6 lg:px-8" />
                </motion.button>
                
                <motion.button
                  onClick={handleAutoDraft}
                  className="group relative p-6 glass-card border border-slate-500/30 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(100,116,139,0.3)] sm:px-4 md:px-6 lg:px-8"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4 sm:px-4 md:px-6 lg:px-8">
                    <div className="text-3xl group-hover:scale-110 transition-transform sm:px-4 md:px-6 lg:px-8">🤖</div>
                    <div>
                      <div className="text-lg font-bold text-white group-hover:text-slate-300 transition-colors sm:px-4 md:px-6 lg:px-8">
                        Auto Draft
                      </div>
                      <div className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">Let AI pick for you</div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-500/0 group-hover:from-slate-500/10 to-transparent rounded-xl transition-all duration-300 sm:px-4 md:px-6 lg:px-8" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Draft Board */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 sm:px-4 md:px-6 lg:px-8">
        {/* Recent Picks with Premium Styling */}
        <motion.div 
          className="glass-panel p-6 sm:px-4 md:px-6 lg:px-8"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-6 sm:px-4 md:px-6 lg:px-8">
            <div className="text-2xl sm:px-4 md:px-6 lg:px-8">🎯</div>
            <h3 className="text-xl font-bold text-white sm:px-4 md:px-6 lg:px-8">Recent Picks</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-primary-500/50 to-transparent sm:px-4 md:px-6 lg:px-8" />
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin sm:px-4 md:px-6 lg:px-8">
            <AnimatePresence>
              {draftPicks
              .filter((pick: DraftPick) => pick.isComplete)
              .slice(-10)
              .reverse()
              .map((pick, index) => {
                const team = draftOrder.find((t: Team) => t.id === pick.teamId);
                return (
                  <motion.div
                    key={pick.pick}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg sm:px-4 md:px-6 lg:px-8"
                  >
                    <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                      <div className="w-8 h-8 bg-blue-600 text-white text-sm font-bold rounded flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
                        {pick.pick}
                      </div>
                      <div>
                        <p className="text-white font-medium sm:px-4 md:px-6 lg:px-8">{pick.player?.name}</p>
                        <p className="text-xs text-slate-400 sm:px-4 md:px-6 lg:px-8">
                          {team?.name} • Round {pick.round}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                      <div className={`${getPositionColor(pick.player?.position || '')} text-white text-xs font-bold px-2 py-1 rounded`}>
                        {pick.player?.position}
                      </div>
                      <span className="text-slate-400 text-sm sm:px-4 md:px-6 lg:px-8">
                        {NFL_TEAMS[pick.player?.team as keyof typeof NFL_TEAMS]?.name || pick.player?.team}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Team Rosters */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 sm:px-4 md:px-6 lg:px-8">
          <h3 className="text-xl font-bold text-white mb-4 sm:px-4 md:px-6 lg:px-8">Team Rosters</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto sm:px-4 md:px-6 lg:px-8">
            {draftOrder.map((team: Team) => {
              const teamPicks = draftPicks.filter((pick: DraftPick) => 
                pick.teamId === team.id && pick.isComplete
              );
              
              return (
                <div key={team.id} className="p-3 bg-slate-700/50 rounded-lg sm:px-4 md:px-6 lg:px-8">
                  <div className="flex items-center justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                      <span className="text-lg sm:px-4 md:px-6 lg:px-8">{team.avatar}</span>
                      <span className="text-white font-medium sm:px-4 md:px-6 lg:px-8">{team.name}</span>
                    </div>
                    <span className="text-slate-400 text-sm sm:px-4 md:px-6 lg:px-8">
                      {teamPicks.length}/16 picks
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 sm:px-4 md:px-6 lg:px-8">
                    {teamPicks.map((pick: DraftPick) => (
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
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sm:px-4 md:px-6 lg:px-8"
            onClick={() => setShowPlayerSearch(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto sm:px-4 md:px-6 lg:px-8"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 sm:px-4 md:px-6 lg:px-8">
                <h3 className="text-xl font-bold text-white sm:px-4 md:px-6 lg:px-8">
                  Select Your Pick - {timeRemaining}s remaining
                </h3>
                <button
                  onClick={() => setShowPlayerSearch(false)}
                >
                  ×
                </button>
              </div>
              
              <PlayerSearch
                onPlayerSelect={handlePlayerSelect}
                excludePlayerIds={draftPicks
                  .filter((pick: DraftPick) => pick.isComplete && pick.player)
                  .map((pick: DraftPick) => pick.player!.id)

                showAddButton={false}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const LiveDraftRoomWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <LiveDraftRoom {...props} />
  </ErrorBoundary>
);

export default React.memo(LiveDraftRoomWithErrorBoundary);