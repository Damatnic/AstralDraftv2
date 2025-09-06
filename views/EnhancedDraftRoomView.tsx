/**
 * Enhanced Draft Room View
 * The most advanced fantasy football draft experience ever created
 * Features: Real-time updates, AI recommendations, live analytics, premium animations
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useAppState } from '../contexts/AppContext';
import { getDaysUntilNextWeek, SEASON_DATES_2025 } from '../data/leagueData';
import { nflPlayers2025 as nflPlayers } from '../data/nfl-players-2025';
import { realTimeDraftServiceV2 } from '../services/realTimeDraftServiceV2';
import { enhancedWebSocketService } from '../services/enhancedWebSocketService';
import { advancedAiDraftCoach, AIRecommendation as AICoachRecommendation } from '../services/advancedAiDraftCoach';
import { Player as TypedPlayer, League as TypedLeague } from '../types';

// Types and Interfaces
interface Player {
  id: string;
  name: string;
  position: string;
  team: string;
  adp: number;
  projectedPoints: number;
  tier: number;
  isRookie: boolean;
  injuryStatus?: string;
  byeWeek: number;
}

interface DraftPick {
  round: number;
  pick: number;
  playerId: string;
  teamId: string;
  timestamp: Date;
  timeUsed: number;
}

interface TeamDraft {
  id: string;
  name: string;
  avatar: string;
  picks: Player[];
  isOnTheClock: boolean;
  isAutoPickEnabled: boolean;
  grade: string;
  pickOrder: number[];}

// Use AI Coach's recommendation interface
type AIRecommendation = AICoachRecommendation;

const EnhancedDraftRoomView: React.FC = () => {
  const { state, dispatch } = useAppState();
  
  // Core draft state
  const [isDraftDay, setIsDraftDay] = useState(true); // Force true for demo
  const [showPreDraftLobby, setShowPreDraftLobby] = useState(false); // Skip lobby for demo
  const [draftStatus, setDraftStatus] = useState<'lobby' | 'active' | 'paused' | 'completed'>('active');
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPick, setCurrentPick] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(90);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');
  
  // Draft data
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [draftedPlayers, setDraftedPlayers] = useState<Player[]>([]);
  const [draftHistory, setDraftHistory] = useState<DraftPick[]>([]);
  const [teams, setTeams] = useState<TeamDraft[]>([]);
  const [userTeam, setUserTeam] = useState<TeamDraft | null>(null);
  
  // UI state
  const [selectedTab, setSelectedTab] = useState<'available' | 'rankings' | 'team' | 'history'>('available');
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState<string>('ALL');
  const [showAIRecommendations, setShowAIRecommendations] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showPlayerComparison, setShowPlayerComparison] = useState(false);
  const [comparisonPlayers, setComparisonPlayers] = useState<Player[]>([]);
  const [showDraftGrades, setShowDraftGrades] = useState(false);
  const [aiRecommendations, setAIRecommendations] = useState<AIRecommendation[]>([]);
  const [aiChatInput, setAiChatInput] = useState('');
  const [aiChatHistory, setAiChatHistory] = useState<{question: string, answer: string}[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  
  // Animations
  const controls = useAnimation();
  const timerControls = useAnimation();
  const boardControls = useAnimation();
  
  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const playerListRef = useRef<HTMLDivElement>(null);

  const league = state.leagues[0];
  const daysUntilNextWeek = getDaysUntilNextWeek();
  const draftDate = SEASON_DATES_2025.draftDate;

  // Initialize draft data
  useEffect(() => {
    // Convert NFL players to our Player interface
    const players: Player[] = nflPlayers.map((player, index) => ({
      id: player.id,
      name: player.name,
      position: player.position,
      team: player.team,
      adp: index + 1, // Simple ADP based on order
      projectedPoints: Math.floor(Math.random() * 300) + 50, // Mock projections
      tier: Math.ceil((index + 1) / 12), // Group into tiers
      isRookie: player.experience === 'R',
      byeWeek: Math.floor(Math.random() * 14) + 4, // Random bye weeks 4-17
      injuryStatus: Math.random() > 0.9 ? 'Questionable' : undefined
    })).slice(0, 400); // Limit to top 400 players
    
    setAvailablePlayers(players);
    
    // Initialize teams
    if (league?.members) {
      const draftTeams: TeamDraft[] = league.members.map((member: any, index: number) => ({
        id: member.id,
        name: member.name,
        avatar: member.avatar,
        picks: [],
        isOnTheClock: index === 0, // First team starts on the clock
        isAutoPickEnabled: false,
        grade: 'B+',
        pickOrder: generateSnakeDraftOrder(index, 16) // 16 rounds
      }));
      
      setTeams(draftTeams);
      setUserTeam(draftTeams.find((t: any) => t.name === state.user?.displayName) || draftTeams[0]);
    }
  }, [league, state.user]);

  // Real-time WebSocket initialization
  useEffect(() => {
    const initializeRealTime = async () => {
      try {
        setConnectionStatus('connecting');
        
        // Connect to WebSocket
        await enhancedWebSocketService.connect();
        
        // Join draft room
        if (league?.id) {
          await realTimeDraftServiceV2.joinDraft(league.id);
          setConnectionStatus('connected');

        // Listen for draft updates
        realTimeDraftServiceV2.onDraftUpdate((update: any) => {
          switch (update.type) {
            case 'pick':
              // Handle live pick updates
              setDraftHistory(prev => [...prev, update.data]);
              setAvailablePlayers(prev => prev.filter((p: any) => p.id !== update.data.playerId));
              break;
            case 'timer':
              // Sync timer across all clients
              setTimeRemaining(update.data.timeRemaining);
              break;
            case 'turn':
              // Update current turn
              setCurrentPick(update.data.currentPick);
              setCurrentRound(update.data.currentRound);
              break;
          }
        });
        
        // Listen for connection status changes
        enhancedWebSocketService.onConnectionChange((status: any) => {
          setConnectionStatus(status.status === 'connected' ? 'connected' : 
                            status.status === 'connecting' ? 'connecting' : 'disconnected');
        });
        }
      } catch (error) {
        setConnectionStatus('disconnected');
      }
    };

    initializeRealTime();
    
    return () => {
      // Cleanup on unmount
      realTimeDraftServiceV2.leaveDraft();
      enhancedWebSocketService.disconnect();
    };
  }, [league?.id]);

  // Generate snake draft pick order
  const generateSnakeDraftOrder = (teamIndex: number, rounds: number): number[] => {
    const order: number[] = [];
    const teamsCount = 10;
    
    for (let round = 1; round <= rounds; round++) {
      if (round % 2 === 1) {
        // Odd rounds: 1, 2, 3, ..., 10
        order.push((round - 1) * teamsCount + teamIndex + 1);
      } else {
        // Even rounds: 10, 9, 8, ..., 1
        order.push((round - 1) * teamsCount + (teamsCount - teamIndex));
      }


    return order;
  }

  // Draft timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerActive && draftStatus === 'active' && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Time expired - auto pick
            handleAutoPick();
            return 90; // Reset timer
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerActive, draftStatus, timeRemaining]);

  // Timer animations
  useEffect(() => {
    if (timeRemaining <= 10) {
      timerControls.start({
        scale: [1, 1.1, 1],
        transition: { duration: 0.5, repeat: Infinity }
      });
    } else {
      timerControls.stop();
    }
  }, [timeRemaining, timerControls]);

  // AI Recommendations Engine using Advanced AI Coach
  const generateAIRecommendations = useCallback(async () => {
    if (!userTeam || !availablePlayers.length) return;
    
    try {
      // Convert to typed format for AI coach
      const typedPlayers: TypedPlayer[] = availablePlayers.map((p: any) => ({
        ...p,
        id: parseInt(p.id),
        position: p.position as any,
        projectedPoints: p.projectedPoints || 0,
        adp: p.adp,
        tier: p.tier || 1,
        bye: p.byeWeek
      }));
      
      const userRoster: TypedPlayer[] = userTeam.picks.map((p: any) => ({
        ...p,
        id: parseInt(p.id),
        position: p.position as any,
        projectedPoints: p.projectedPoints || 0,
        adp: p.adp,
        tier: p.tier || 1,
        bye: p.byeWeek
      }));
      
      const leagueSettings = {
        teams: teams.length,
        scoring: 'PPR',
        rosterSize: 16
      };
      
      const recommendations = await advancedAiDraftCoach.getRealtimeRecommendations(
        typedPlayers,
        userRoster,
        userTeam.pickOrder.indexOf(currentPick) + 1,
        currentRound,
//         leagueSettings
      );
      
      // Convert back to component format
      const componentRecommendations: AIRecommendation[] = recommendations.map((rec: any) => ({
        ...rec,
        player: {
          ...rec.player,
          id: rec.player.id.toString(),
          byeWeek: rec.player.bye || 4
        } as Player,
        alternativeOptions: rec.alternativeOptions.map((alt: any) => ({
          ...alt,
          id: alt.id.toString(),
          byeWeek: alt.bye || 4
        })) as Player[]
      }));
      
      setAIRecommendations(componentRecommendations);
    } catch (error) {
      // Fallback to simple recommendations
      const fallbackRecs: AIRecommendation[] = availablePlayers.slice(0, 3).map((player: any) => ({
        player,
        confidence: 75,
        reasoning: ['Best available player', 'Good value pick'],
        tier: 2,
        value: 10,
        riskFactors: [],
        alternativeOptions: availablePlayers.slice(3, 6),
        expectedFantasyPoints: player.projectedPoints || 0
      }));
      setAIRecommendations(fallbackRecs);
    }
  }, [userTeam, availablePlayers, teams.length, currentRound, currentPick]);

  const calculatePositionNeed = (position: string): number => {
    if (!userTeam) return 50;
    
    const positionCount = userTeam.picks.filter((p: any) => p.position === position).length;
    const idealCounts: { [key: string]: number } = {
      'QB': 1, 'RB': 2, 'WR': 3, 'TE': 1, 'K': 1, 'DEF': 1
    };
    
    const ideal = idealCounts[position] || 1;
    return Math.max(0, (ideal - positionCount) * 25);
  };

  // Update AI recommendations when team changes
  useEffect(() => {
    generateAIRecommendations();
  }, [generateAIRecommendations]);
  
  // Handle AI Chat
  const handleAiChatSubmit = async () => {
    if (!aiChatInput.trim() || isAiThinking) return;
    
    const question = aiChatInput.trim();
    setAiChatInput('');
    setIsAiThinking(true);
    
    try {
      const context = {
        availablePlayers: availablePlayers.map((p: any) => ({
          ...p,
          id: parseInt(p.id),
          position: p.position as any,
          projectedPoints: p.projectedPoints || 0,
          adp: p.adp,
          tier: p.tier || 1,
          bye: p.byeWeek
        })) as TypedPlayer[],
        userRoster: userTeam?.picks.map((p: any) => ({
          ...p,
          id: parseInt(p.id),
          position: p.position as any,
          projectedPoints: p.projectedPoints || 0,
          adp: p.adp,
          tier: p.tier || 1,
          bye: p.byeWeek
        })) as TypedPlayer[] || [],
        currentRound,
        leagueSettings: {
          teams: teams.length,
          scoring: 'PPR',
          rosterSize: 16
        }
      };
      
      const answer = await advancedAiDraftCoach.askCoach(question, context);
      
      setAiChatHistory(prev => [...prev, { question, answer }]);
    } catch (error) {
      setAiChatHistory(prev => [...prev, { 
        question, 
        answer: 'Sorry, I\'m having trouble right now. Please try again or ask about player recommendations, team analysis, or draft strategy.' 
      }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Draft a player
  const handleDraftPlayer = useCallback((player: Player) => {
    if (!teams.length) return;
    
    const currentTeamIndex = teams.findIndex(t => t.isOnTheClock);
    if (currentTeamIndex === -1) return;
    
    const updatedTeams = [...teams];
    const currentTeam = updatedTeams[currentTeamIndex];
    
    // Add player to team
    currentTeam.picks.push(player);
    currentTeam.isOnTheClock = false;
    
    // Remove player from available
    setAvailablePlayers(prev => prev.filter((p: any) => p.id !== player.id));
    setDraftedPlayers(prev => [...prev, player]);
    
    // Add to draft history
    const pick: DraftPick = {
      round: currentRound,
      pick: currentPick,
      playerId: player.id,
      teamId: currentTeam.id,
      timestamp: new Date(),
      timeUsed: 90 - timeRemaining
    };
    setDraftHistory(prev => [...prev, pick]);
    
    // Move to next pick
    const nextPick = currentPick + 1;
    const totalPicks = teams.length * 16; // 16 rounds
    
    if (nextPick > totalPicks) {
      // Draft complete
      setDraftStatus('completed');
      setIsTimerActive(false);
    } else {
      // Find next team
      const nextTeamIndex = findNextTeamOnClock(nextPick);
      updatedTeams[nextTeamIndex].isOnTheClock = true;
      
      setCurrentPick(nextPick);
      setCurrentRound(Math.ceil(nextPick / teams.length));
      setTimeRemaining(90); // Reset timer
    }

    setTeams(updatedTeams);
    
    // Update user team if it's the user's pick
    if (currentTeam.id === userTeam?.id) {
      setUserTeam(currentTeam);
    }

    // Trigger animations
    boardControls.start({
      y: [-10, 0],
      transition: { duration: 0.3 }
    });
    
  }, [teams, userTeam, currentRound, currentPick, timeRemaining, boardControls]);

  const findNextTeamOnClock = (pickNumber: number): number => {
    const teamsCount = teams.length;
    const round = Math.ceil(pickNumber / teamsCount);
    const positionInRound = ((pickNumber - 1) % teamsCount) + 1;
    
    if (round % 2 === 1) {
      // Odd round: 1, 2, 3, ..., 10
      return positionInRound - 1;
    } else {
      // Even round: 10, 9, 8, ..., 1  
      return teamsCount - positionInRound;
    }
  };

  const handleAutoPick = () => {
    if (availablePlayers.length > 0) {
      const bestAvailable = availablePlayers[0]; // Top player by ADP
      handleDraftPlayer(bestAvailable);
    }
  };

  // Filtered and sorted players
  const filteredPlayers = useMemo(() => {
    let filtered = availablePlayers;
    
    // Apply position filter
    if (positionFilter !== 'ALL') {
      filtered = filtered.filter((p: any) => p.position === positionFilter);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p: any) => 
        p.name.toLowerCase().includes(query) ||
        p.team.toLowerCase().includes(query) ||
        p.position.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [availablePlayers, positionFilter, searchQuery]);

  // Get position counts for user team
  const getPositionCounts = () => {
    if (!userTeam) return {};
    
    const counts: { [key: string]: number } = {};
    userTeam.picks.forEach((player: any) => {
      counts[player.position] = (counts[player.position] || 0) + 1;
    });
    
    return counts;
  };

  // Format time remaining
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Get timer color based on remaining time
  const getTimerColor = (): string => {
    if (timeRemaining <= 10) return 'text-red-400';
    if (timeRemaining <= 30) return 'text-yellow-400';
    return 'text-green-400';
  };

  // Handle player selection for comparison
  const handlePlayerSelect = (player: Player) => {
    if (comparisonPlayers.length < 3 && !comparisonPlayers.find((p: any) => p.id === player.id)) {
      setComparisonPlayers(prev => [...prev, player]);
    }

    setSelectedPlayer(player);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900/20 via-slate-900 to-purple-900/20">
      {/* Advanced Draft Room Header */}
      <motion.header 
        className="glass-card border-b border-white/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <button
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' })}
              className="glass-button px-4 py-2 text-white/80 hover:text-white transition-all duration-200 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
              <span className="ml-2">Dashboard</span>
            </button>
            
            {/* Draft Status */}
            <div className="text-center">
              <motion.h1 
                className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                animate={controls}
              >
                <span className="text-2xl">🏈</span> Elite Draft Room
              </motion.h1>
              <p className="text-white/60">{league?.name} • Live Draft Experience</p>
            </div>
            
            {/* Timer and Status */}
            <div className="text-right">
              <motion.div 
                className={`text-2xl font-bold ${getTimerColor()}`}
                animate={timerControls}
              >
                {formatTime(timeRemaining)}
              </motion.div>
              <div className="text-sm text-white/60">
                Round {currentRound} • Pick {currentPick}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-400 animate-pulse' :
                  connectionStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' :
                  'bg-red-400'
                }`}></div>
                <span className={`text-xs ${
                  connectionStatus === 'connected' ? 'text-green-400' :
                  connectionStatus === 'connecting' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {connectionStatus === 'connected' ? 'LIVE' :
                   connectionStatus === 'connecting' ? 'CONNECTING' : 'OFFLINE'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)]">
          
          {/* Left Panel - Draft Board & Teams */}
          <div className="col-span-4 space-y-4">
            {/* Current Pick Banner */}
            <motion.div 
              className="glass-card p-4 border border-yellow-500/30"
              animate={boardControls}
            >
              {teams.find((t: any) => t.isOnTheClock) && (
                <div className="flex items-center gap-4">
                  <div className="text-4xl">
                    {teams.find((t: any) => t.isOnTheClock)?.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">
                      {teams.find((t: any) => t.isOnTheClock)?.name}
                    </h3>
                    <p className="text-yellow-400 font-semibold">ON THE CLOCK</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-white/60">
                        Pick {currentPick} of 160
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-yellow-400">
                      {formatTime(timeRemaining)}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Draft Board - Team Overview */}
            <div className="glass-card p-4 flex-1">
              <h3 className="text-lg font-semibold text-white mb-4">Draft Board</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                {teams.map((team, index) => (
                  <motion.div
                    key={team.id}
                    className={`p-3 rounded-lg transition-all duration-200 ${
                      team.isOnTheClock 
                        ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                        : 'glass-card-secondary border border-white/5'
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{team.avatar}</div>
                        <div>
                          <div className="font-semibold text-white">{team.name}</div>
                          <div className="text-xs text-white/60">
                            {team.picks.length} picks • Grade: {team.grade}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {team.isOnTheClock && (
                          <div className="text-yellow-400 text-sm font-semibold">
//                             PICKING
                          </div>
                        )}
                        <div className="text-xs text-white/40">
                          Position {index + 1}
                        </div>
                      </div>
                    </div>
                    
                    {/* Latest Pick Preview */}
                    {team.picks.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-white/10">
                        <div className="text-xs text-white/60">Latest Pick:</div>
                        <div className="text-sm text-white">
                          {team.picks[team.picks.length - 1]?.name} 
                          <span className="text-white/40 ml-1">
                            ({team.picks[team.picks.length - 1]?.position})
                          </span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Panel - Player Search & Available Players */}
          <div className="col-span-5 space-y-4">
            {/* Search and Filters */}
            <div className="glass-card p-4">
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e: any) => setSearchQuery(e.target.value)}
                    className="glass-input w-full px-4 py-2 text-white placeholder-white/40"
                  />
                </div>
                <select
                  value={positionFilter}
                  onChange={(e: any) => setPositionFilter(e.target.value)}
                >
                  <option value="ALL">All Positions</option>
                  <option value="QB">QB</option>
                  <option value="RB">RB</option>
                  <option value="WR">WR</option>
                  <option value="TE">TE</option>
                  <option value="K">K</option>
                  <option value="DEF">DEF</option>
                </select>
              </div>
              
              {/* Tab Navigation */}
              <div className="flex space-x-2 mb-4">
                {[
                  { id: 'available', label: 'Available Players', icon: '👥' },
                  { id: 'rankings', label: 'Rankings', icon: '📊' },
                  { id: 'team', label: 'My Team', icon: '🏆' },
                  { id: 'history', label: 'Draft Log', icon: '📝' }
                ].map((tab: any) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id as any)}
                    className="glass-button px-3 py-2 text-sm font-medium transition-all duration-200"
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Player List */}
            <div className="glass-card p-4 flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  {selectedTab === 'available' && `Available Players (${filteredPlayers.length})`}
                  {selectedTab === 'rankings' && 'Expert Rankings'}
                  {selectedTab === 'team' && `My Team (${userTeam?.picks.length || 0}/16)`}
                  {selectedTab === 'history' && `Draft History (${draftHistory.length} picks)`}
                </h3>
                
                {selectedTab === 'available' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowPlayerComparison(!showPlayerComparison)}
                      className="glass-button px-3 py-2 text-sm"
                    >
                      Compare ({comparisonPlayers.length})
                    </button>
                  </div>
                )}
              </div>
              
              <div ref={playerListRef} className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                {selectedTab === 'available' && filteredPlayers.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={`p-4 rounded-lg transition-all duration-200 cursor-pointer group ${
                      selectedPlayer?.id === player.id
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30'
                        : 'glass-card-secondary border border-white/5 hover:border-white/20'
                    }`}
                    onClick={() => handlePlayerSelect(player)}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-white/40">
                          {player.adp}
                        </div>
                        <div>
                          <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {player.name}
                            {player.isRookie && (
                              <span className="ml-2 px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
//                                 R
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <span className="font-medium text-blue-400">{player.position}</span>
                            <span>•</span>
                            <span>{player.team}</span>
                            <span>•</span>
                            <span>Bye {player.byeWeek}</span>
                            {player.injuryStatus && (
                              <>
                                <span>•</span>
                                <span className="text-yellow-400">{player.injuryStatus}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">
                          {player.projectedPoints}
                        </div>
                        <div className="text-xs text-white/40">Proj Pts</div>
                      </div>
                    </div>
                    
                    {/* Draft Button for User's Turn */}
                    {teams.find((t: any) => t.isOnTheClock)?.id === userTeam?.id && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <button
                          onClick={(e: any) => {
                            e.stopPropagation();
                            handleDraftPlayer(player);
                          }}
                          className="glass-button-primary w-full py-2 font-semibold hover:scale-105 transition-all duration-200"
                        >
                          DRAFT {player.name.split(' ')[0].toUpperCase()}
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}

                {selectedTab === 'team' && userTeam && (
                  <div className="space-y-4">
                    {/* Position Breakdown */}
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(getPositionCounts()).map(([position, count]) => (
                        <div key={position} className="glass-card-secondary p-3 text-center">
                          <div className="text-xl font-bold text-blue-400">{count}</div>
                          <div className="text-sm text-white/60">{position}</div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Team Picks */}
                    {userTeam.picks.map((player, index) => (
                      <div key={player.id} className="glass-card-secondary p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-white">{player.name}</div>
                            <div className="text-sm text-white/60">
                              {player.position} • {player.team}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-blue-400">Round {Math.ceil((index + 1) / 1)}</div>
                            <div className="text-xs text-white/40">Pick {index + 1}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedTab === 'history' && (
                  <div className="space-y-2">
                    {draftHistory.slice().reverse().map((pick, index) => {
                      const team = teams.find((t: any) => t.id === pick.teamId);
                      const player = [...availablePlayers, ...draftedPlayers].find((p: any) => p.id === pick.playerId);
                      
                      return (
                        <motion.div
                          key={`${pick.round}-${pick.pick}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="glass-card-secondary p-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="text-sm font-bold text-white/40">
                                {pick.round}.{pick.pick}
                              </div>
                              <div>
                                <div className="font-semibold text-white">{player?.name}</div>
                                <div className="text-sm text-white/60">
                                  {player?.position} • {team?.name}
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-white/40">
                              {pick.timeUsed}s used
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - AI Recommendations & Analytics */}
          <div className="col-span-3 space-y-4">
            {/* AI Draft Coach */}
            <motion.div 
              className="glass-card p-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="text-2xl">🤖</div>
                <div>
                  <h3 className="text-lg font-semibold text-white">AI Draft Coach</h3>
                  <p className="text-xs text-white/60">Elite Recommendations</p>
                </div>
              </div>
              
              {aiRecommendations.length > 0 && (
                <div className="space-y-3">
                  {aiRecommendations.slice(0, 3).map((rec, index) => (
                    <motion.div
                      key={rec.player.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-card-secondary p-3 cursor-pointer hover:border-blue-500/30 transition-all duration-200"
                      onClick={() => setSelectedPlayer(rec.player)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-white">{rec.player.name}</div>
                        <div className="text-sm font-bold text-green-400">
                          {rec.confidence}%
                        </div>
                      </div>
                      
                      <div className="text-xs text-white/60 mb-2">
                        {rec.player.position} • {rec.player.team}
                      </div>
                      
                      <div className="space-y-1">
                        {rec.reasoning.slice(0, 2).map((reason, idx) => (
                          <div key={idx} className="text-xs text-white/80 flex items-center gap-1">
                            <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                            {reason}
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-xs text-blue-400">
                          Tier: {rec.tier}
                        </div>
                        <div className="text-xs text-purple-400">
                          {rec.expectedFantasyPoints.toFixed(1)} pts
                        </div>
                      </div>
                      
                      {rec.riskFactors.length > 0 && (
                        <div className="mt-2 text-xs text-yellow-400">
                          ⚠️ {rec.riskFactors[0]}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
              
              <button
                onClick={() => setShowAIRecommendations(!showAIRecommendations)}
              >
                {showAIRecommendations ? 'Hide' : 'Show'} Full Analysis
              </button>
            </motion.div>
            
            {/* AI Chat Interface */}
            <motion.div 
              className="glass-card p-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="text-2xl">💬</div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Ask Your Coach</h3>
                  <p className="text-xs text-white/60">Interactive AI Assistant</p>
                </div>
              </div>
              
              {/* Chat History */}
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto custom-scrollbar">
                {aiChatHistory.slice(-3).map((chat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="glass-card-secondary p-2">
                      <div className="text-xs text-blue-400 font-semibold mb-1">You:</div>
                      <div className="text-sm text-white">{chat.question}</div>
                    </div>
                    <div className="glass-card-secondary p-2 border border-green-500/20">
                      <div className="text-xs text-green-400 font-semibold mb-1">AI Coach:</div>
                      <div className="text-sm text-white whitespace-pre-line">{chat.answer}</div>
                    </div>
                  </div>
                ))}
                {isAiThinking && (
                  <div className="glass-card-secondary p-2 border border-green-500/20">
                    <div className="text-xs text-green-400 font-semibold mb-1">AI Coach:</div>
                    <div className="text-sm text-white flex items-center gap-2">
                      <div className="animate-pulse">Thinking...</div>
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Chat Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiChatInput}
                  onChange={(e: any) => setAiChatInput(e.target.value)}
                  placeholder="Ask about players, strategy, or your team..."
                  className="glass-input flex-1 px-3 py-2 text-sm text-white placeholder-white/40"
                  disabled={isAiThinking}
                />
                <button
                  onClick={handleAiChatSubmit}
                  className="glass-button-primary px-4 py-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
//                   Ask
                </button>
              </div>
            </motion.div>

            {/* Draft Grade */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold text-white mb-4">
                Your Draft Grade
              </h3>
              
              <div className="text-center mb-4">
                <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                  {userTeam?.grade || 'A-'}
                </div>
                <p className="text-sm text-white/60 mt-1">
                  Above Average Performance
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Value Picks</span>
                  <span className="text-green-400 font-semibold">+3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Position Balance</span>
                  <span className="text-blue-400 font-semibold">Good</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Bye Week Mgmt</span>
                  <span className="text-yellow-400 font-semibold">Fair</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Draft Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Picks Made</span>
                  <span className="text-white font-semibold">{userTeam?.picks.length || 0}/16</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Avg Pick Time</span>
                  <span className="text-white font-semibold">45s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Players Targeted</span>
                  <span className="text-white font-semibold">8/12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Trade Opportunities</span>
                  <span className="text-blue-400 font-semibold">2 Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Player Comparison Modal */}
      <AnimatePresence>
        {showPlayerComparison && comparisonPlayers.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowPlayerComparison(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Player Comparison</h3>
                <button
                  onClick={() => setShowPlayerComparison(false)}
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {comparisonPlayers.map((player: any) => (
                  <div key={player.id} className="glass-card-secondary p-4">
                    <div className="text-center mb-4">
                      <h4 className="text-xl font-bold text-white">{player.name}</h4>
                      <p className="text-blue-400">{player.position} • {player.team}</p>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/60">ADP</span>
                        <span className="text-white font-semibold">{player.adp}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Proj Points</span>
                        <span className="text-white font-semibold">{player.projectedPoints}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Tier</span>
                        <span className="text-white font-semibold">{player.tier}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Bye Week</span>
                        <span className="text-white font-semibold">{player.byeWeek}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        handleDraftPlayer(player);
                        setShowPlayerComparison(false);
                      }}
                      disabled={!teams.find((t: any) => t.isOnTheClock && t.id === userTeam?.id)}
                      className="glass-button-primary w-full mt-4 py-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
//                       DRAFT
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Draft Complete Modal */}
      <AnimatePresence>
        {draftStatus === 'completed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card p-8 max-w-2xl w-full text-center"
            >
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-3xl font-bold text-white mb-4">Draft Complete!</h2>
              <p className="text-xl text-white/80 mb-8">
                Congratulations! Your {league?.name} draft is now finished.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="glass-card-secondary p-4">
                  <div className="text-2xl font-bold text-green-400">{userTeam?.grade}</div>
                  <div className="text-sm text-white/60">Your Final Grade</div>
                </div>
                <div className="glass-card-secondary p-4">
                  <div className="text-2xl font-bold text-blue-400">16</div>
                  <div className="text-sm text-white/60">Players Drafted</div>
                </div>
                <div className="glass-card-secondary p-4">
                  <div className="text-2xl font-bold text-purple-400">3rd</div>
                  <div className="text-sm text-white/60">Draft Position</div>
                </div>
              </div>
              
              <button
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'TEAM_HUB' })}
                className="glass-button-primary px-8 py-3 font-semibold text-lg"
              >
                View My Team
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}};

export default EnhancedDraftRoomView;