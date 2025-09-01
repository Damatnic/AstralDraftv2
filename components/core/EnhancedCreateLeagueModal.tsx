/**
 * Enhanced League Setup Component
 * Integrates the 10 provided player names with Oracle ML services for advanced league creation
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '../ui/Modal';
import { SparklesIcon } from '../icons/SparklesIcon';
import { Avatar } from '../ui/Avatar';
import { generateTeamBranding, generateAiTeamProfile } from '../../services/geminiService';
import type { LeagueSettings, User, CreateLeaguePayload, AiProfileData } from '../../types';

// The 10 provided player names
const PLAYER_NAMES = [
  'Jack',
  'Jon', 
  'Hartley',
  'Jarvey',
  'Cason',
  'Larry',
  'Renee',
  'Kaity',
  'Nick',
  'Brittany'
] as const;

interface PlayerSetup {
  name: string;
  teamName: string;
  avatar: string;
  isUser: boolean;
  aiProfile?: AiProfileData;


interface EnhancedCreateLeagueModalProps {
  onClose: () => void;
  user: User;
  dispatch: React.Dispatch<any>;}

const EnhancedCreateLeagueModal: React.FC<EnhancedCreateLeagueModalProps> = ({ 
  onClose, 
  user, 
//   dispatch 
}: any) => {
  // League Configuration
  const [leagueName, setLeagueName] = useState('Astral Draft Championship');
  const [selectedPlayerCount, setSelectedPlayerCount] = useState(10);
  const [draftFormat, setDraftFormat] = useState<LeagueSettings['draftFormat']>('SNAKE');
  const [scoring, setScoring] = useState<LeagueSettings['scoring']>('PPR');
  const [aiAssistanceLevel, setAiAssistanceLevel] = useState<LeagueSettings['aiAssistanceLevel']>('FULL');

  // Player Setup
  const [players, setPlayers] = useState<PlayerSetup[]>([]);
  const [selectedUserPlayer, setSelectedUserPlayer] = useState<string>('');
  
  // UI State
  const [currentStep, setCurrentStep] = useState<'config' | 'players' | 'review'>('config');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generateProgress, setGenerateProgress] = useState(0);

  // Oracle ML Integration Settings
  const [oraclePredictions, setOraclePredictions] = useState(true);
  const [advancedAnalytics, setAdvancedAnalytics] = useState(true);
  const [injuryTracking, setInjuryTracking] = useState(true);
  const [tradeAnalysis, setTradeAnalysis] = useState(true);
  const [waiverAnalysis, setWaiverAnalysis] = useState(true);

  // Initialize players based on selected count
  useEffect(() => {
    const availableNames = PLAYER_NAMES.slice(0, selectedPlayerCount);
    const initialPlayers: PlayerSetup[] = availableNames.map((name, index) => ({
      name,
      teamName: `${name}'s Team`,
      avatar: `🎯`, // Default avatar
      isUser: index === 0, // First player is user by default
      aiProfile: undefined
    }));
    
    setPlayers(initialPlayers);
    setSelectedUserPlayer(availableNames[0]);
  }, [selectedPlayerCount]);

  const handleGenerateAllTeamBranding = async () => {
    setIsGenerating(true);
    setGenerateProgress(0);
    
    try {
      const updates = [...players];
      const totalPlayers = players.length;
      
      for (let i = 0; i < players.length; i++) {
        const player = players[i];
        setGenerateProgress(((i + 1) / totalPlayers) * 100);
        
        // Generate team branding for each player
        const branding = await generateTeamBranding(player.name);
        if (branding) {
          updates[i] = {
            ...player,
            teamName: branding.teamName,
            avatar: branding.avatar
          };

        // Generate AI profile for non-user players
        if (!player.isUser) {
          const aiProfile = await generateAiTeamProfile(leagueName);
          if (aiProfile) {
            updates[i].aiProfile = aiProfile;


        // Update state incrementally for visual feedback
        setPlayers([...updates]);

      dispatch({ 
        type: 'ADD_NOTIFICATION', 
        payload: {
          message: 'Successfully generated team branding and AI profiles!', 
          type: 'SYSTEM' 

      });
    });
    } finally {
      setIsGenerating(false);
      setGenerateProgress(0);

  };

  const handleUserPlayerChange = (playerName: string) => {
    setSelectedUserPlayer(playerName);
    setPlayers(prev => prev.map((p: any) => ({
      ...p,
      isUser: p.name === playerName
    })));
  };

  const handleCustomizePlayer = (index: number, updates: Partial<PlayerSetup>) => {
    setPlayers(prev => prev.map((p, i) => 
      i === index ? { ...p, ...updates } : p
    ));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Find user player
      const userPlayer = players.find((p: any) => p.isUser);
      if (!userPlayer) {
        throw new Error('No user player selected');

      // Prepare AI profiles for non-user players
      const aiProfiles = players
        .filter((p: any) => !p.isUser)
        .map((p: any) => p.aiProfile)
        .filter((profile): profile is AiProfileData => Boolean(profile));

      // Create enhanced league payload with Oracle ML integration
      const newLeague: CreateLeaguePayload & {
        oracleConfig: {
          predictions: boolean;
          advancedAnalytics: boolean;
          injuryTracking: boolean;
          tradeAnalysis: boolean;
          waiverAnalysis: boolean;
        };
        playerSetup: PlayerSetup[];
      } = {
        id: `league_${Date.now()}`,
        name: leagueName,
        settings: {
          draftFormat,
          teamCount: selectedPlayerCount,
          scoring,
          rosterSize: 16,
          tradeDeadline: 10,
          playoffFormat: '4_TEAM',
          waiverRule: 'FAAB',
          aiAssistanceLevel,
        },
        status: 'PRE_DRAFT' as const,
        commissionerId: user.id,
        userTeamName: userPlayer.teamName,
        userTeamAvatar: userPlayer.avatar,
        aiProfiles,
        oracleConfig: {
          predictions: oraclePredictions,
          advancedAnalytics,
          injuryTracking,
          tradeAnalysis,
//           waiverAnalysis
        },
        playerSetup: players
      };

      dispatch({ type: 'CREATE_ENHANCED_LEAGUE', payload: newLeague });
      dispatch({ 
        type: 'ADD_NOTIFICATION', 
        payload: {
          message: `Enhanced league "${leagueName}" created with Oracle ML integration!`, 
          type: 'SYSTEM' 

      });
      
      onClose();
    });
    } finally {
      setIsSubmitting(false);

  };

  const renderConfigurationStep = () => (
    <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
          <div>
            <label htmlFor="league-name-input" className="block text-sm font-medium text-[var(--text-secondary)] mb-2 sm:px-4 md:px-6 lg:px-8">
              League Name
            </label>
            <input
              id="league-name-input"
              type="text"
              value={leagueName}
              onChange={(e: any) => setLeagueName(e.target.value)}
//               required
            />
          </div>

          <div>
            <label htmlFor="player-count-range" className="block text-sm font-medium text-[var(--text-secondary)] mb-2 sm:px-4 md:px-6 lg:px-8">
              Number of Players: <span className="font-bold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{selectedPlayerCount}</span>
            </label>
            <input
              id="player-count-range"
              type="range"
              min="8"
              max="10"
              value={selectedPlayerCount}
              onChange={(e: any) => setSelectedPlayerCount(Number(e.target.value))}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1 sm:px-4 md:px-6 lg:px-8">
              <span>8 players</span>
              <span>10 players (Full roster)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:px-4 md:px-6 lg:px-8">
            <div>
              <span className="block text-sm font-medium text-[var(--text-secondary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                Draft Format
              </span>
              <div className="flex gap-2 sm:px-4 md:px-6 lg:px-8">
                <button
                  type="button"
                  onClick={() => setDraftFormat('SNAKE')}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                    draftFormat === 'SNAKE' 
                      ? 'bg-cyan-400 text-black' 
                      : 'bg-black/10 hover:bg-black/20'
                  }`}
                >
//                   Snake
                </button>
                <button
                  type="button"
                  onClick={() => setDraftFormat('AUCTION')}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                    draftFormat === 'AUCTION' 
                      ? 'bg-cyan-400 text-black' 
                      : 'bg-black/10 hover:bg-black/20'
                  }`}
                >
//                   Auction
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="scoring-select" className="block text-sm font-medium text-[var(--text-secondary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                Scoring Format
              </label>
              <select
                id="scoring-select"
                value={scoring}
                onChange={(e: any) => setScoring(e.target.value as LeagueSettings['scoring'])}
              >
                <option value="PPR">PPR</option>
                <option value="Half-PPR">Half-PPR</option>
                <option value="Standard">Standard</option>
                <option value="Superflex">Superflex</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column - Oracle ML Integration */}
        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
          <div className="p-4 bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg sm:px-4 md:px-6 lg:px-8">
            <h3 className="text-lg font-bold text-purple-300 mb-3 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
              <SparklesIcon />
              Oracle ML Features
            </h3>
            
            <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
              <label className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                <input
                  type="checkbox"
                  checked={oraclePredictions}
                  onChange={(e: any) => setOraclePredictions(e.target.checked)}
                />
                <span className="text-sm sm:px-4 md:px-6 lg:px-8">Oracle Predictions & Challenges</span>
              </label>
              
              <label className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                <input
                  type="checkbox"
                  checked={advancedAnalytics}
                  onChange={(e: any) => setAdvancedAnalytics(e.target.checked)}
                />
                <span className="text-sm sm:px-4 md:px-6 lg:px-8">Advanced Player Analytics</span>
              </label>
              
              <label className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                <input
                  type="checkbox"
                  checked={injuryTracking}
                  onChange={(e: any) => setInjuryTracking(e.target.checked)}
                />
                <span className="text-sm sm:px-4 md:px-6 lg:px-8">Real-time Injury Tracking</span>
              </label>
              
              <label className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                <input
                  type="checkbox"
                  checked={tradeAnalysis}
                  onChange={(e: any) => setTradeAnalysis(e.target.checked)}
                />
                <span className="text-sm sm:px-4 md:px-6 lg:px-8">ML-Powered Trade Analysis</span>
              </label>
              
              <label className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                <input
                  type="checkbox"
                  checked={waiverAnalysis}
                  onChange={(e: any) => setWaiverAnalysis(e.target.checked)}
                />
                <span className="text-sm sm:px-4 md:px-6 lg:px-8">Waiver Wire Intelligence</span>
              </label>
            </div>
          </div>

          <div>
            <span className="block text-sm font-medium text-[var(--text-secondary)] mb-2 sm:px-4 md:px-6 lg:px-8">
              AI Assistance Level
            </span>
            <div className="flex gap-2 sm:px-4 md:px-6 lg:px-8">
              <button
                type="button"
                onClick={() => setAiAssistanceLevel('FULL')}
                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                  aiAssistanceLevel === 'FULL' 
                    ? 'bg-cyan-400 text-black' 
                    : 'bg-black/10 hover:bg-black/20'
                }`}
              >
//                 Full
              </button>
              <button
                type="button"
                onClick={() => setAiAssistanceLevel('BASIC')}
                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                  aiAssistanceLevel === 'BASIC' 
                    ? 'bg-cyan-400 text-black' 
                    : 'bg-black/10 hover:bg-black/20'
                }`}
              >
//                 Basic
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlayersStep = () => (
    <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
      <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
        <h3 className="text-xl font-bold sm:px-4 md:px-6 lg:px-8">Player Setup</h3>
        <button
          type="button"
          onClick={handleGenerateAllTeamBranding}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-sm rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 sm:px-4 md:px-6 lg:px-8"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin sm:px-4 md:px-6 lg:px-8"></div>
              <span>Generating... {Math.round(generateProgress)}%</span>
            </>
          ) : (
            <>
              <SparklesIcon />
              <span>Generate All Team Branding</span>
            </>
          )}
        </button>
      </div>

      <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg sm:px-4 md:px-6 lg:px-8">
        <span className="block text-sm font-medium text-blue-300 mb-2 sm:px-4 md:px-6 lg:px-8">
          Which player are you?
        </span>
        <select
          value={selectedUserPlayer}
          onChange={(e: any) => handleUserPlayerChange(e.target.value)}
          aria-label="Select which player you are"
        >
          {players.map((player: any) => (
            <option key={player.name} value={player.name}>
              {player.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {players.map((player, index) => (
          <motion.div
            key={player.name}
//             layout
            className={`p-4 rounded-lg border transition-all ${
              player.isUser 
                ? 'bg-green-900/20 border-green-500/50' 
                : 'bg-black/10 border-[var(--panel-border)]'
            }`}
          >
            <div className="flex items-center gap-3 mb-3 sm:px-4 md:px-6 lg:px-8">
              <Avatar avatar={player.avatar} className="w-12 h-12 text-2xl rounded-lg sm:px-4 md:px-6 lg:px-8" />
              <div className="flex-grow sm:px-4 md:px-6 lg:px-8">
                <div className="font-bold text-sm sm:px-4 md:px-6 lg:px-8">{player.name}</div>
                {player.isUser && (
                  <div className="text-xs text-green-400 font-medium sm:px-4 md:px-6 lg:px-8">You</div>
                )}
              </div>
            </div>
            
            <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
              <input
                type="text"
                value={player.teamName}
                onChange={(e: any) => handleCustomizePlayer(index, { teamName: e.target.value }}
                className="w-full bg-black/20 border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 sm:px-4 md:px-6 lg:px-8"
                placeholder="Team name"
              />
              
              {player.aiProfile && (
                <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
                  <div>Persona: {player.aiProfile.persona}</div>
                  <div>Name: {player.aiProfile.name}</div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
      <h3 className="text-xl font-bold sm:px-4 md:px-6 lg:px-8">Review & Create League</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
          <div className="p-4 bg-black/10 rounded-lg sm:px-4 md:px-6 lg:px-8">
            <h4 className="font-bold mb-2 sm:px-4 md:px-6 lg:px-8">League Configuration</h4>
            <div className="space-y-1 text-sm text-gray-300 sm:px-4 md:px-6 lg:px-8">
              <div><span className="text-gray-500 sm:px-4 md:px-6 lg:px-8">Name:</span> {leagueName}</div>
              <div><span className="text-gray-500 sm:px-4 md:px-6 lg:px-8">Players:</span> {selectedPlayerCount}</div>
              <div><span className="text-gray-500 sm:px-4 md:px-6 lg:px-8">Draft:</span> {draftFormat}</div>
              <div><span className="text-gray-500 sm:px-4 md:px-6 lg:px-8">Scoring:</span> {scoring}</div>
              <div><span className="text-gray-500 sm:px-4 md:px-6 lg:px-8">AI Level:</span> {aiAssistanceLevel}</div>
            </div>
          </div>

          <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg sm:px-4 md:px-6 lg:px-8">
            <h4 className="font-bold mb-2 text-purple-300 sm:px-4 md:px-6 lg:px-8">Oracle ML Features</h4>
            <div className="space-y-1 text-sm sm:px-4 md:px-6 lg:px-8">
              <div className={`${oraclePredictions ? 'text-green-400' : 'text-gray-500'}`}>
                {oraclePredictions ? '✓' : '✗'} Oracle Predictions & Challenges
              </div>
              <div className={`${advancedAnalytics ? 'text-green-400' : 'text-gray-500'}`}>
                {advancedAnalytics ? '✓' : '✗'} Advanced Analytics
              </div>
              <div className={`${injuryTracking ? 'text-green-400' : 'text-gray-500'}`}>
                {injuryTracking ? '✓' : '✗'} Injury Tracking
              </div>
              <div className={`${tradeAnalysis ? 'text-green-400' : 'text-gray-500'}`}>
                {tradeAnalysis ? '✓' : '✗'} Trade Analysis
              </div>
              <div className={`${waiverAnalysis ? 'text-green-400' : 'text-gray-500'}`}>
                {waiverAnalysis ? '✓' : '✗'} Waiver Intelligence
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
          <div className="p-4 bg-black/10 rounded-lg sm:px-4 md:px-6 lg:px-8">
            <h4 className="font-bold mb-2 sm:px-4 md:px-6 lg:px-8">Player Roster</h4>
            <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
              {players.map((player: any) => (
                <div key={player.name} className="flex items-center gap-2 text-sm sm:px-4 md:px-6 lg:px-8">
                  <Avatar avatar={player.avatar} className="w-6 h-6 text-sm rounded sm:px-4 md:px-6 lg:px-8" />
                  <span className={player.isUser ? 'text-green-400 font-bold' : 'text-gray-300'}>
                    {player.name}
                  </span>
                  <span className="text-gray-500 sm:px-4 md:px-6 lg:px-8">- {player.teamName}</span>
                  {player.isUser && <span className="text-xs text-green-400 sm:px-4 md:px-6 lg:px-8">(You)</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Modal isOpen={true} onClose={onClose}>
      <motion.div 
        className="glass-pane rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto sm:px-4 md:px-6 lg:px-8"
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        onClick={(e: any) => e.stopPropagation()}
      >
        <header className="p-6 border-b border-[var(--panel-border)] flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
          <div>
            <h2 className="text-2xl font-bold font-display text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
              Create Enhanced League
            </h2>
            <p className="text-sm text-gray-400 mt-1 sm:px-4 md:px-6 lg:px-8">
              {currentStep === 'config' && 'Step 1 of 3'}
              {currentStep === 'players' && 'Step 2 of 3'}
              {currentStep === 'review' && 'Step 3 of 3'}
            </p>
          </div>
          
          <div className="flex gap-2 sm:px-4 md:px-6 lg:px-8">
            {['config', 'players', 'review'].map((step, index) => {
              let bgColor = 'bg-gray-800';
              if (currentStep === step) {
                bgColor = 'bg-cyan-400';
              } else if (['config', 'players'].indexOf(currentStep) > index) {
                bgColor = 'bg-gray-600';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 sm:px-4 md:px-6 lg:px-8"></div>
        <span className="ml-2 sm:px-4 md:px-6 lg:px-8">Loading...</span>
      </div>
    );

  return (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full transition-colors ${bgColor}`}
                />
              );
            })}
          </div>
        </header>

        <main className="p-6 sm:px-4 md:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {currentStep === 'config' && (
              <motion.div
                key="config"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {renderConfigurationStep()}
              </motion.div>
            )}
            
            {currentStep === 'players' && (
              <motion.div
                key="players"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {renderPlayersStep()}
              </motion.div>
            )}
            
            {currentStep === 'review' && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {renderReviewStep()}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="p-6 flex justify-between border-t border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
          <div>
            {currentStep !== 'config' && (
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 'players') setCurrentStep('config');
                  if (currentStep === 'review') setCurrentStep('players');
                }}
                className="px-4 py-2 bg-transparent border border-[var(--panel-border)] text-[var(--text-secondary)] font-bold rounded-lg hover:bg-white/10 transition-colors sm:px-4 md:px-6 lg:px-8"
              >
//                 Back
              </button>
            )}
          </div>
          
          <div className="flex gap-4 sm:px-4 md:px-6 lg:px-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-transparent border border-[var(--panel-border)] text-[var(--text-secondary)] font-bold rounded-lg hover:bg-white/10 transition-colors sm:px-4 md:px-6 lg:px-8"
            >
//               Cancel
            </button>
            
            {currentStep === 'review' ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-cyan-500 text-white font-bold rounded-lg shadow-md hover:from-green-600 hover:to-cyan-600 transition-colors disabled:opacity-60 disabled:cursor-wait sm:px-4 md:px-6 lg:px-8"
              >
                {isSubmitting ? 'Creating League...' : 'Create League'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 'config') setCurrentStep('players');
                  if (currentStep === 'players') setCurrentStep('review');
                }}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-lg shadow-md hover:from-purple-600 hover:to-blue-600 transition-colors sm:px-4 md:px-6 lg:px-8"
              >
                {currentStep === 'config' ? 'Configure Players' : 'Review & Create'}
              </button>
            )}
          </div>
        </footer>
      </motion.div>
    </Modal>
  );
};

const EnhancedCreateLeagueModalWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <EnhancedCreateLeagueModal {...props} />
  </ErrorBoundary>
);

export default React.memo(EnhancedCreateLeagueModalWithErrorBoundary);
