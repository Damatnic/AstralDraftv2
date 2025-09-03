/**
 * Live Game Tracker Component
 * Real-time NFL game tracking with scores, stats, and fantasy implications
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealTimeGames } from '../../hooks/useEnhancedSportsIORealTime';
import { NFL_TEAMS } from '../../data/nflPlayers';
import { ClockIcon } from '../icons/ClockIcon';
import { PlayIcon } from '../icons/PlayIcon';
import { PauseIcon } from '../icons/PauseIcon';
import { TrophyIcon } from '../icons/TrophyIcon';
import { ChevronRightIcon } from '../icons/ChevronRightIcon';

interface LiveGameTrackerProps {
  className?: string;
  showOnlyActive?: boolean;
  maxGames?: number;
}

const LiveGameTracker: React.FC<LiveGameTrackerProps> = ({
  className = '',
  showOnlyActive = true,
  maxGames = 8
}) => {
  const {
    games,
    activeGames,
    isLoading,
    error,
    lastUpdate,
    isConnected
  } = useRealTimeGames({
    activeOnly: showOnlyActive,
    updateInterval: 5000
  });

  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('compact');

  const displayGames = showOnlyActive ? activeGames : games;
  const limitedGames = displayGames.slice(0, maxGames);

  const getGameStatusInfo = (status: string, quarter: number, timeRemaining: string) => {
    switch (status) {
      case 'scheduled':
        return { text: 'Scheduled', icon: ClockIcon, color: 'text-gray-400' };
      case 'in_progress':
        return { 
          text: `Q${quarter} ${timeRemaining}`, 
          icon: PlayIcon, 
          color: 'text-green-400',
          isLive: true
        };
      case 'halftime':
        return { text: 'Halftime', icon: PauseIcon, color: 'text-yellow-400' };
      case 'final':
        return { text: 'Final', icon: TrophyIcon, color: 'text-blue-400' };
      default:
        return { text: status, icon: ClockIcon, color: 'text-gray-400' };
    }
  };

  const getTeamLogo = (teamCode: string) => {
    // Fallback to team initials if logo not available
    return teamCode.substring(0, 3).toUpperCase();
  };

  const getScoreAnimation = (score: number) => ({
    initial: { scale: 1 },
    animate: { scale: [1, 1.1, 1] },
    transition: { duration: 0.3, ease: "easeInOut" }
  });

  if (isLoading && limitedGames.length === 0) {
    return (
      <div className={`bg-slate-800/50 rounded-xl p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-slate-700 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-slate-800/50 rounded-xl p-6 ${className}`}>
        <div className="text-red-400 text-center">
          <div className="text-lg font-semibold mb-2">Connection Error</div>
          <div className="text-sm text-gray-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-800/50 rounded-xl backdrop-blur-xl border border-slate-700/50 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              Live Games
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              {showOnlyActive ? 'Active games only' : 'All games'} • Last update: {lastUpdate?.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('compact')}
              className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                viewMode === 'compact' 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Compact
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                viewMode === 'detailed' 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Detailed
            </button>
          </div>
        </div>
      </div>

      {/* Games List */}
      <div className="p-6">
        {limitedGames.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              {showOnlyActive ? 'No active games right now' : 'No games available'}
            </div>
            <div className="text-sm text-gray-500">
              {showOnlyActive ? 'Check back during game time!' : 'Games will appear when scheduled'}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {limitedGames.map((game) => {
                const statusInfo = getGameStatusInfo(game.status, game.quarter, game.timeRemaining);
                const StatusIcon = statusInfo.icon;
                const isSelected = selectedGame === game.gameId;

                return (
                  <motion.div
                    key={game.gameId}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ scale: 1.02 }}
                    className={`
                      bg-slate-700/30 rounded-lg p-4 border transition-all duration-300 cursor-pointer
                      ${isSelected 
                        ? 'border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
                        : 'border-slate-600/30 hover:border-slate-500/50'
                      }
                      ${statusInfo.isLive ? 'ring-1 ring-green-400/20' : ''}
                    `}
                    onClick={() => setSelectedGame(isSelected ? null : game.gameId)}
                  >
                    {/* Game Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
                        <span className={`text-sm font-medium ${statusInfo.color}`}>
                          {statusInfo.text}
                        </span>
                        {statusInfo.isLive && (
                          <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full animate-pulse">
                            LIVE
                          </span>
                        )}
                      </div>
                      <ChevronRightIcon 
                        className={`h-4 w-4 text-gray-400 transition-transform ${
                          isSelected ? 'rotate-90' : ''
                        }`} 
                      />
                    </div>

                    {/* Teams and Scores */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Away Team */}
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center text-xs font-bold text-white">
                          {getTeamLogo(game.awayTeam)}
                        </div>
                        <div>
                          <div className="font-semibold text-white">
                            {NFL_TEAMS[game.awayTeam as keyof typeof NFL_TEAMS]?.name || game.awayTeam}
                          </div>
                          <motion.div 
                            className="text-2xl font-bold text-white"
                            key={`${game.gameId}-away-${game.awayScore}`}
                            {...(statusInfo.isLive ? getScoreAnimation(game.awayScore) : {})}
                          >
                            {game.awayScore}
                          </motion.div>
                        </div>
                      </div>

                      {/* Home Team */}
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center text-xs font-bold text-white">
                          {getTeamLogo(game.homeTeam)}
                        </div>
                        <div>
                          <div className="font-semibold text-white">
                            {NFL_TEAMS[game.homeTeam as keyof typeof NFL_TEAMS]?.name || game.homeTeam}
                          </div>
                          <motion.div 
                            className="text-2xl font-bold text-white"
                            key={`${game.gameId}-home-${game.homeScore}`}
                            {...(statusInfo.isLive ? getScoreAnimation(game.homeScore) : {})}
                          >
                            {game.homeScore}
                          </motion.div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isSelected && viewMode === 'detailed' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 mt-4 border-t border-slate-600/30">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <div className="text-gray-400 mb-1">Game Details</div>
                                <div className="text-white">Quarter: {game.quarter}</div>
                                <div className="text-white">Time: {game.timeRemaining}</div>
                              </div>
                              <div>
                                <div className="text-gray-400 mb-1">Fantasy Impact</div>
                                <div className="text-green-400">📈 High scoring pace</div>
                                <div className="text-blue-400">⚡ Weather: Clear</div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer */}
      {limitedGames.length > 0 && (
        <div className="px-6 py-4 border-t border-slate-700/50">
          <div className="flex justify-between items-center text-sm text-gray-400">
            <div>
              Showing {limitedGames.length} of {displayGames.length} games
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Auto-updating every 5 seconds
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveGameTracker;