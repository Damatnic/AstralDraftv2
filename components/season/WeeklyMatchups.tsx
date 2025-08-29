/**
 * Weekly Matchups Component
 * Displays head-to-head matchups for each week with live scoring
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../../contexts/AppContext';

interface Matchup {
  id: string;
  week: number;
  homeTeam: any;
  awayTeam: any;
  homeScore: number;
  awayScore: number;
  status: 'upcoming' | 'live' | 'final';
  gameTime?: string;
}

interface WeeklyMatchupsProps {
  selectedWeek?: number;
  showAllWeeks?: boolean;
}

const WeeklyMatchups: React.FC<WeeklyMatchupsProps> = ({ 
  selectedWeek = 1, 
  showAllWeeks: _showAllWeeks = false 
}) => {
  const { state } = useAppState();
  const [currentWeek, setCurrentWeek] = useState(selectedWeek);

  const league = state.leagues[0];

  // Generate season schedule (14 weeks regular season + 3 weeks playoffs)
  const seasonSchedule = useMemo(() => {
    if (!league?.teams || league.teams.length !== 10) return [];

    const teams = [...league.teams];
    const schedule: Matchup[] = [];
    let matchupId = 1;

    // Regular season: 14 weeks
    for (let week = 1; week <= 14; week++) {
      const weekMatchups: Matchup[] = [];
      const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);
      
      // Create 5 matchups per week (10 teams = 5 matchups)
      for (let i = 0; i < shuffledTeams.length; i += 2) {
        if (i + 1 < shuffledTeams.length) {
          const homeTeam = shuffledTeams[i];
          const awayTeam = shuffledTeams[i + 1];
          
          // Simulate scores based on week
          const isCompleted = week < 8; // Weeks 1-7 are completed
          const isLive = week === 8; // Week 8 is live
          
          let homeScore = 0;
          let awayScore = 0;
          let status: 'upcoming' | 'live' | 'final' = 'upcoming';
          
          if (isCompleted) {
            homeScore = Math.floor(Math.random() * 60) + 80; // 80-140 points
            awayScore = Math.floor(Math.random() * 60) + 80;
            status = 'final';
          } else if (isLive) {
            homeScore = Math.floor(Math.random() * 40) + 60; // Partial scores
            awayScore = Math.floor(Math.random() * 40) + 60;
            status = 'live';
          }

          weekMatchups.push({
            id: `matchup-${matchupId++}`,
            week,
            homeTeam,
            awayTeam,
            homeScore,
            awayScore,
            status,
            gameTime: week <= 8 ? 'Sunday 1:00 PM' : 'Sunday 1:00 PM'
          });
        }
      }
      
      schedule.push(...weekMatchups);
    }

    // Playoffs: Weeks 15-17
    const playoffTeams = teams.slice(0, 6); // Top 6 teams make playoffs
    
    // Week 15: Wild Card (3v6, 4v5, 1&2 get byes)
    schedule.push({
      id: `playoff-wc1`,
      week: 15,
      homeTeam: playoffTeams[2], // 3rd seed
      awayTeam: playoffTeams[5], // 6th seed
      homeScore: 0,
      awayScore: 0,
      status: 'upcoming',
      gameTime: 'Sunday 1:00 PM'
    });
    
    schedule.push({
      id: `playoff-wc2`,
      week: 15,
      homeTeam: playoffTeams[3], // 4th seed
      awayTeam: playoffTeams[4], // 5th seed
      homeScore: 0,
      awayScore: 0,
      status: 'upcoming',
      gameTime: 'Sunday 4:00 PM'
    });

    // Week 16: Semifinals
    schedule.push({
      id: `playoff-sf1`,
      week: 16,
      homeTeam: playoffTeams[0], // 1st seed
      awayTeam: playoffTeams[5], // Winner of 4v5 (simulated)
      homeScore: 0,
      awayScore: 0,
      status: 'upcoming',
      gameTime: 'Sunday 1:00 PM'
    });
    
    schedule.push({
      id: `playoff-sf2`,
      week: 16,
      homeTeam: playoffTeams[1], // 2nd seed
      awayTeam: playoffTeams[2], // Winner of 3v6 (simulated)
      homeScore: 0,
      awayScore: 0,
      status: 'upcoming',
      gameTime: 'Sunday 4:00 PM'
    });

    // Week 17: Championship
    schedule.push({
      id: `playoff-final`,
      week: 17,
      homeTeam: playoffTeams[0], // Semifinal winner 1
      awayTeam: playoffTeams[1], // Semifinal winner 2
      homeScore: 0,
      awayScore: 0,
      status: 'upcoming',
      gameTime: 'Sunday 1:00 PM'
    });

    return schedule;
  }, [league?.teams]);

  const currentWeekMatchups = useMemo(() => {
    return seasonSchedule.filter(matchup => matchup.week === currentWeek);
  }, [seasonSchedule, currentWeek]);

  const getMatchupStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'border-green-500 bg-green-900/20';
      case 'final': return 'border-slate-600 bg-slate-800/50';
      case 'upcoming': return 'border-blue-500 bg-blue-900/20';
      default: return 'border-slate-600 bg-slate-800/50';
    }
  };

  const getMatchupStatusText = (status: string) => {
    switch (status) {
      case 'live': return '🔴 LIVE';
      case 'final': return '✅ FINAL';
      case 'upcoming': return '⏰ UPCOMING';
      default: return '';
    }
  };

  const isPlayoffWeek = (week: number) => week >= 15;

  const getWeekTitle = (week: number) => {
    if (week <= 14) return `Week ${week}`;
    if (week === 15) return 'Wild Card';
    if (week === 16) return 'Semifinals';
    if (week === 17) return 'Championship';
    return `Week ${week}`;
  };

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white">
            {getWeekTitle(currentWeek)}
          </h2>
          {isPlayoffWeek(currentWeek) && (
            <span className="px-3 py-1 bg-yellow-600 text-white text-sm font-semibold rounded-full">
              🏆 PLAYOFFS
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
            disabled={currentWeek === 1}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg transition-colors"
          >
            ← Previous
          </button>
          
          <select
            value={currentWeek}
            onChange={(e) => setCurrentWeek(Number(e.target.value))}
            className="px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
          >
            {Array.from({ length: 17 }, (_, i) => i + 1).map(week => (
              <option key={week} value={week}>
                {getWeekTitle(week)}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => setCurrentWeek(Math.min(17, currentWeek + 1))}
            disabled={currentWeek === 17}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg transition-colors"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Matchups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence mode="wait">
          {currentWeekMatchups.map((matchup, index) => (
            <motion.div
              key={matchup.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-xl border-2 p-6 ${getMatchupStatusColor(matchup.status)}`}
            >
              {/* Matchup Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-300">
                    {getMatchupStatusText(matchup.status)}
                  </span>
                  {matchup.status === 'live' && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                <span className="text-sm text-slate-400">{matchup.gameTime}</span>
              </div>

              {/* Teams */}
              <div className="space-y-4">
                {/* Away Team */}
                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{matchup.awayTeam.avatar}</span>
                    <div>
                      <div className="text-white font-semibold">{matchup.awayTeam.name}</div>
                      <div className="text-sm text-slate-400">{matchup.awayTeam.owner.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      matchup.status !== 'upcoming' && matchup.awayScore > matchup.homeScore 
                        ? 'text-green-400' 
                        : 'text-white'
                    }`}>
                      {matchup.status === 'upcoming' ? '-' : matchup.awayScore}
                    </div>
                    {matchup.status === 'live' && (
                      <div className="text-xs text-slate-400">Projected: {matchup.awayScore + 20}</div>
                    )}
                  </div>
                </div>

                {/* VS Divider */}
                <div className="flex items-center justify-center">
                  <span className="px-3 py-1 bg-slate-600 text-slate-300 text-sm font-semibold rounded-full">
                    {matchup.status === 'upcoming' ? 'VS' : 'vs'}
                  </span>
                </div>

                {/* Home Team */}
                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{matchup.homeTeam.avatar}</span>
                    <div>
                      <div className="text-white font-semibold">{matchup.homeTeam.name}</div>
                      <div className="text-sm text-slate-400">{matchup.homeTeam.owner.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      matchup.status !== 'upcoming' && matchup.homeScore > matchup.awayScore 
                        ? 'text-green-400' 
                        : 'text-white'
                    }`}>
                      {matchup.status === 'upcoming' ? '-' : matchup.homeScore}
                    </div>
                    {matchup.status === 'live' && (
                      <div className="text-xs text-slate-400">Projected: {matchup.homeScore + 25}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Matchup Actions */}
              <div className="mt-4 pt-4 border-t border-slate-600">
                <div className="flex items-center justify-between">
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                    View Details
                  </button>
                  {matchup.status === 'live' && (
                    <span className="text-xs text-green-400 font-medium">
                      Updates every 5 minutes
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Week Summary */}
      {currentWeekMatchups.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4">
            {getWeekTitle(currentWeek)} Summary
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-slate-700/50 rounded-lg">
              <div className="text-2xl font-bold text-white">
                {currentWeekMatchups.filter(m => m.status === 'final').length}
              </div>
              <div className="text-sm text-slate-400">Games Complete</div>
            </div>
            
            <div className="text-center p-3 bg-slate-700/50 rounded-lg">
              <div className="text-2xl font-bold text-green-400">
                {currentWeekMatchups.filter(m => m.status === 'live').length}
              </div>
              <div className="text-sm text-slate-400">Games Live</div>
            </div>
            
            <div className="text-center p-3 bg-slate-700/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">
                {currentWeekMatchups.filter(m => m.status === 'upcoming').length}
              </div>
              <div className="text-sm text-slate-400">Games Upcoming</div>
            </div>
          </div>

          {isPlayoffWeek(currentWeek) && (
            <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-400">
                <span className="text-lg">🏆</span>
                <span className="font-semibold">Playoff Week</span>
              </div>
              <p className="text-sm text-yellow-300 mt-1">
                {currentWeek === 15 && "Wild Card Round - Win or go home!"}
                {currentWeek === 16 && "Semifinals - Final four teams compete!"}
                {currentWeek === 17 && "Championship Week - The ultimate showdown!"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeeklyMatchups;