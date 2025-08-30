/**
 * Current Week Matchups Widget
 * Displays the current week's fantasy matchups with live scores
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../../contexts/AppContext';
import { useLeague } from '../../hooks/useLeague';
import { Widget } from '../ui/Widget';
import { TrophyIcon } from '../icons/TrophyIcon';
import { Avatar } from '../ui/Avatar';
import type { Matchup, Team } from '../../types';

interface MatchupCardProps {
  matchup: Matchup;
  teams: Team[];
  currentUserId?: string;
  onViewMatchup: () => void;
}

const MatchupCard: React.FC<MatchupCardProps> = ({ matchup, teams, currentUserId, onViewMatchup }) => {
  const teamA = teams.find(t => t.id === matchup.teamA.teamId);
  const teamB = teams.find(t => t.id === matchup.teamB.teamId);
  
  if (!teamA || !teamB) return null;
  
  const isUserMatchup = teamA.owner.id === currentUserId || teamB.owner.id === currentUserId;
  const teamAWinning = matchup.teamA.score > matchup.teamB.score;
  const teamBWinning = matchup.teamB.score > matchup.teamA.score;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-lg cursor-pointer transition-all ${
        isUserMatchup 
          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30' 
          : 'bg-white/5 hover:bg-white/10'
      }`}
      onClick={onViewMatchup}
    >
      <div className="flex items-center justify-between">
        {/* Team A */}
        <div className="flex items-center gap-3 flex-1">
          <Avatar avatar={teamA.avatar} className="w-10 h-10" />
          <div>
            <div className="font-semibold text-white">
              {teamA.name}
              {teamAWinning && !matchup.isComplete && (
                <span className="ml-2 text-xs text-green-400">LEADING</span>
              )}
            </div>
            <div className="text-xs text-gray-400">{teamA.owner.name}</div>
          </div>
        </div>
        
        {/* Scores */}
        <div className="flex items-center gap-4 px-4">
          <div className={`text-2xl font-bold ${teamAWinning ? 'text-green-400' : 'text-gray-400'}`}>
            {matchup.teamA.score.toFixed(1)}
          </div>
          <div className="text-gray-500">-</div>
          <div className={`text-2xl font-bold ${teamBWinning ? 'text-green-400' : 'text-gray-400'}`}>
            {matchup.teamB.score.toFixed(1)}
          </div>
        </div>
        
        {/* Team B */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          <div className="text-right">
            <div className="font-semibold text-white">
              {teamB.name}
              {teamBWinning && !matchup.isComplete && (
                <span className="ml-2 text-xs text-green-400">LEADING</span>
              )}
            </div>
            <div className="text-xs text-gray-400">{teamB.owner.name}</div>
          </div>
          <Avatar avatar={teamB.avatar} className="w-10 h-10" />
        </div>
      </div>
      
      {/* Match Status */}
      <div className="mt-3 flex justify-center">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          matchup.isComplete 
            ? 'bg-gray-500/20 text-gray-400' 
            : 'bg-yellow-500/20 text-yellow-400 animate-pulse'
        }`}>
          {matchup.isComplete ? 'FINAL' : 'LIVE'}
        </span>
      </div>
    </motion.div>
  );
};

const CurrentWeekMatchupsWidget: React.FC = () => {
  const { state, dispatch } = useAppState();
  const { league } = useLeague();
  
  if (!league || league.status === 'PRE_DRAFT' || league.status === 'DRAFTING') {
    return null;
  }
  
  const currentWeekMatchups = league.schedule.filter(m => m.week === league.currentWeek);
  const isPlayoffs = league.currentWeek > league.settings.regularSeasonWeeks;
  
  const handleViewMatchup = (matchup: Matchup) => {
    // Navigate to matchup view
    dispatch({ type: 'SET_VIEW', payload: 'MATCHUP' });
  };
  
  return (
    <Widget 
      title={`Week ${league.currentWeek} ${isPlayoffs ? 'Playoffs' : 'Matchups'}`} 
      icon={<TrophyIcon className="w-5 h-5" />}
      className="col-span-2"
    >
      <div className="p-4">
        {/* Week Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">
              {isPlayoffs ? 'Playoff Round' : `Regular Season`}
            </h3>
            <p className="text-xs text-gray-400">
              Games in progress · Live scoring updates
            </p>
          </div>
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'MATCHUP' })}
            className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm font-medium transition-colors"
          >
            View All Scores
          </button>
        </div>
        
        {/* Matchups List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {currentWeekMatchups.length > 0 ? (
            currentWeekMatchups.map((matchup, index) => (
              <MatchupCard
                key={matchup.id || index}
                matchup={matchup}
                teams={league.teams}
                currentUserId={state.user?.id}
                onViewMatchup={() => handleViewMatchup(matchup)}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>No matchups scheduled for this week</p>
            </div>
          )}
        </div>
        
        {/* Quick Stats */}
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-cyan-400">
                {currentWeekMatchups.filter(m => !m.isComplete).length}
              </div>
              <div className="text-xs text-gray-400">Games Live</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {Math.max(...currentWeekMatchups.map(m => Math.max(m.teamA.score, m.teamB.score))).toFixed(1)}
              </div>
              <div className="text-xs text-gray-400">High Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {currentWeekMatchups.filter(m => Math.abs(m.teamA.score - m.teamB.score) < 5).length}
              </div>
              <div className="text-xs text-gray-400">Close Games</div>
            </div>
          </div>
        </div>
      </div>
    </Widget>
  );
};

export default CurrentWeekMatchupsWidget;