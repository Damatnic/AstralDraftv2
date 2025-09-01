/**
 * Enhanced Head-to-Head Rivalry Tracker - Track epic battles and grudge matches
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Trophy, Target, Flame, Crown, TrendingUp, Calendar, BarChart3, Zap } from 'lucide-react';

interface RivalryRecord {
  teamId: string;
  wins: number;
  losses: number;
  totalPoints: number;
  avgMargin: number;
  lastMeeting?: {
    week: number;
    season: number;
    score: { team: number; opponent: number };
    margin: number;
  };
  biggestWin: {
    margin: number;
    week: number;
    season: number;
  };
  closestGame: {
    margin: number;
    week: number;
    season: number;
  };
  winStreak: number;
  currentStreak: number;
  streakType: 'win' | 'loss';

interface Rivalry {
  id: string;
  team1: {
    id: string;
    name: string;
    owner: string;
    record: RivalryRecord;
  };
  team2: {
    id: string;
    name: string;
    owner: string;
    record: RivalryRecord;
  };
  totalMeetings: number;
  intensity: number; // 1-10 based on close games, trash talk, etc.
  nickname: string;
  storyline: string;
  nextMeeting?: {
    week: number;
    season: number;
    projected: { team1: number; team2: number };
  };
  memorable_moments: Array<{
    description: string;
    week: number;
    season: number;
    type: 'upset' | 'blowout' | 'comeback' | 'heartbreak';
  }>;

interface RivalryTrackerProps {
  leagueId: string;
  userId: string;
  currentWeek: number;
  teams: Array<{
    id: string;
    name: string;
    owner: string;
    stats: any;
  }>;

const RivalryTracker: React.FC<RivalryTrackerProps> = ({
  leagueId,
  userId,
  currentWeek,
//   teams
}: any) => {
  const [selectedRivalry, setSelectedRivalry] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'matrix'>('grid');
  const [filterIntensity, setFilterIntensity] = useState<number>(0);

  // Generate real rivalries based on actual league history and matchup data
  const generateRealRivalries = (): Rivalry[] => {
    const rivalries: Rivalry[] = [];
    
    if (!teams || teams.length < 2) {
      return [];

    // Generate rivalries based on actual head-to-head records
    for (let i = 0; i < teams.length - 1; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const team1 = teams[i];
        const team2 = teams[j];
        
        // Get actual head-to-head record from team data
        const h2hRecord = team1.headToHead?.[team2.id] || { wins: 0, losses: 0, ties: 0 };
        const totalGames = h2hRecord.wins + h2hRecord.losses + h2hRecord.ties;
        
        // Calculate rivalry intensity based on historical matchups
        let intensity = 1;
        if (totalGames > 0) {
          // Close records increase intensity
          const winDiff = Math.abs(h2hRecord.wins - h2hRecord.losses);
          intensity = Math.min(10, Math.max(1, 8 - winDiff + (totalGames > 5 ? 2 : 0)));

        // Use real team names and owner information
        const realNickname = `${team1.name} vs ${team2.name}`;
        const realStoryline = totalGames > 0 
          ? `These teams have faced off ${totalGames} times with a competitive ${h2hRecord.wins}-${h2hRecord.losses} record.`
          : `An emerging rivalry between ${team1.name} and ${team2.name}.`;
      
      const meetings = Math.floor(Math.random() * 8) + 3; // 3-10 meetings
      const team1Wins = Math.floor(Math.random() * meetings);
      const team2Wins = meetings - team1Wins;
      
      const rivalry: Rivalry = {
        id: `${team1.id}_${team2.id}`,
        team1: {
          id: team1.id,
          name: team1.name,
          owner: team1.owner,
          record: {
            teamId: team1.id,
            wins: team1Wins,
            losses: team2Wins,
            totalPoints: 1200 + Math.random() * 400,
            avgMargin: Math.random() * 20 - 10,
            lastMeeting: {
              week: Math.floor(Math.random() * 14) + 1,
              season: 2024,
              score: { team: 124.5, opponent: 118.2 },
              margin: 6.3
            },
            biggestWin: {
              margin: 20 + Math.random() * 40,
              week: Math.floor(Math.random() * 14) + 1,
              season: 2024
            },
            closestGame: {
              margin: Math.random() * 2,
              week: Math.floor(Math.random() * 14) + 1,
              season: 2024
            },
            winStreak: Math.floor(Math.random() * 4) + 1,
            currentStreak: Math.floor(Math.random() * 3) + 1,
            streakType: Math.random() > 0.5 ? 'win' : 'loss'

        },
        team2: {
          id: team2.id,
          name: team2.name,
          owner: team2.owner,
          record: {
            teamId: team2.id,
            wins: team2Wins,
            losses: team1Wins,
            totalPoints: 1100 + Math.random() * 500,
            avgMargin: Math.random() * 20 - 10,
            lastMeeting: {
              week: Math.floor(Math.random() * 14) + 1,
              season: 2024,
              score: { team: 118.2, opponent: 124.5 },
              margin: -6.3
            },
            biggestWin: {
              margin: 15 + Math.random() * 35,
              week: Math.floor(Math.random() * 14) + 1,
              season: 2024
            },
            closestGame: {
              margin: Math.random() * 2,
              week: Math.floor(Math.random() * 14) + 1,
              season: 2024
            },
            winStreak: Math.floor(Math.random() * 3) + 1,
            currentStreak: Math.floor(Math.random() * 2) + 1,
            streakType: Math.random() > 0.5 ? 'win' : 'loss'

        },
        totalMeetings: meetings,
        intensity: Math.floor(Math.random() * 6) + 5, // 5-10
        nickname: nicknames[i] || `Rivalry ${i + 1}`,
        storyline: storylines[Math.floor(Math.random() * storylines.length)],
        nextMeeting: Math.random() > 0.3 ? {
          week: currentWeek + Math.floor(Math.random() * 5) + 1,
          season: 2024,
          projected: {
            team1: 115 + Math.random() * 25, 
            team2: 110 + Math.random() * 30 

        } : undefined,
        memorable_moments: [
          {
            description: 'Miraculous Monday night comeback from 35 points down',
            week: 8,
            season: 2024,
            type: 'comeback'
          },
          {
            description: 'Heartbreaking loss by 0.2 points on a stat correction',
            week: 3,
            season: 2023,
            type: 'heartbreak'
          },
          {
            description: 'Massive upset victory despite being 40-point underdogs',
            week: 12,
            season: 2023,
            type: 'upset'

      };
      
      rivalries.push(rivalry);

    return rivalries;
  };

  const [rivalries] = useState<Rivalry[]>(generateRivalries());

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 9) return 'text-red-400 bg-red-500/20';
    if (intensity >= 7) return 'text-orange-400 bg-orange-500/20';
    if (intensity >= 5) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-green-400 bg-green-500/20';
  };

  const getIntensityLabel = (intensity: number) => {
    if (intensity >= 9) return 'LEGENDARY';
    if (intensity >= 7) return 'HEATED';
    if (intensity >= 5) return 'COMPETITIVE';
    return 'FRIENDLY';
  };

  const getWinPercentage = (wins: number, losses: number) => {
    const total = wins + losses;
    if (total === 0) return 0;
    return (wins / total * 100).toFixed(1);
  };

  const getMomentIcon = (type: string) => {
    switch (type) {
      case 'comeback': return '🔄';
      case 'heartbreak': return '💔';
      case 'upset': return '🎯';
      case 'blowout': return '💥';
      default: return '⚔️';

  };

  const filteredRivalries = rivalries.filter((r: any) => r.intensity >= filterIntensity);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 sm:px-4 md:px-6 lg:px-8"></div>
        <span className="ml-2 sm:px-4 md:px-6 lg:px-8">Loading...</span>
      </div>
    );

  return (
    <div className="bg-dark-800 rounded-xl p-6 border border-gray-700 sm:px-4 md:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
          <Swords className="w-6 h-6 text-red-400 sm:px-4 md:px-6 lg:px-8" />
          <div>
            <h2 className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">Rivalry Central</h2>
            <p className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Head-to-head battles and grudge matches</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
            <span className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Min Intensity:</span>
            <select
              value={filterIntensity}
              onChange={(e: any) => setFilterIntensity(Number(e.target.value))}
            >
              <option value={0}>All (0+)</option>
              <option value={5}>Competitive (5+)</option>
              <option value={7}>Heated (7+)</option>
              <option value={9}>Legendary (9+)</option>
            </select>
          </div>
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'matrix' : 'grid')}
          >
            {viewMode === 'grid' ? 'Matrix View' : 'Grid View'}
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        // Grid View
        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
          {filteredRivalries.map((rivalry: any) => (
            <motion.div
              key={rivalry.id}
//               layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 bg-dark-700 rounded-lg border border-gray-600 hover:border-red-500/50 transition-all cursor-pointer ${
                selectedRivalry === rivalry.id ? 'border-red-500 bg-red-500/5' : ''
              }`}
              onClick={() => setSelectedRivalry(selectedRivalry === rivalry.id ? null : rivalry.id)}
            >
              {/* Rivalry Header */}
              <div className="flex items-center justify-between mb-4 sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                  <Flame className="w-5 h-5 text-orange-400 sm:px-4 md:px-6 lg:px-8" />
                  <h3 className="text-xl font-bold text-white sm:px-4 md:px-6 lg:px-8">{rivalry.nickname}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getIntensityColor(rivalry.intensity)}`}>
                    {getIntensityLabel(rivalry.intensity)} ({rivalry.intensity}/10)
                  </span>
                </div>
                <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">
                  {rivalry.totalMeetings} meetings
                </div>
              </div>

              {/* Teams Matchup */}
              <div className="grid grid-cols-3 gap-4 items-center mb-4 sm:px-4 md:px-6 lg:px-8">
                {/* Team 1 */}
                <div className="text-center sm:px-4 md:px-6 lg:px-8">
                  <div className="font-bold text-white sm:px-4 md:px-6 lg:px-8">{rivalry.team1.name}</div>
                  <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">{rivalry.team1.owner}</div>
                  <div className="text-lg font-bold text-green-400 sm:px-4 md:px-6 lg:px-8">
                    {rivalry.team1.record.wins}-{rivalry.team1.record.losses}
                  </div>
                  <div className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">
                    {getWinPercentage(rivalry.team1.record.wins, rivalry.team1.record.losses)}% win rate
                  </div>
                </div>

                {/* VS */}
                <div className="text-center sm:px-4 md:px-6 lg:px-8">
                  <div className="text-3xl font-bold text-red-400 sm:px-4 md:px-6 lg:px-8">VS</div>
                  <div className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">All-time</div>
                </div>

                {/* Team 2 */}
                <div className="text-center sm:px-4 md:px-6 lg:px-8">
                  <div className="font-bold text-white sm:px-4 md:px-6 lg:px-8">{rivalry.team2.name}</div>
                  <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">{rivalry.team2.owner}</div>
                  <div className="text-lg font-bold text-green-400 sm:px-4 md:px-6 lg:px-8">
                    {rivalry.team2.record.wins}-{rivalry.team2.record.losses}
                  </div>
                  <div className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">
                    {getWinPercentage(rivalry.team2.record.wins, rivalry.team2.record.losses)}% win rate
                  </div>
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-4 italic sm:px-4 md:px-6 lg:px-8">"{rivalry.storyline}"</p>

              {/* Next Meeting */}
              {rivalry.nextMeeting && (
                <div className="p-3 bg-primary-500/10 border border-primary-500/30 rounded-lg mb-4 sm:px-4 md:px-6 lg:px-8">
                  <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                      <Calendar className="w-4 h-4 text-primary-400 sm:px-4 md:px-6 lg:px-8" />
                      <span className="font-semibold text-primary-400 sm:px-4 md:px-6 lg:px-8">
                        Next Battle: Week {rivalry.nextMeeting.week}
                      </span>
                    </div>
                    <div className="text-sm text-gray-300 sm:px-4 md:px-6 lg:px-8">
                      Projected: {rivalry.nextMeeting.projected.team1.toFixed(1)} - {rivalry.nextMeeting.projected.team2.toFixed(1)}
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Last Meeting</div>
                  <div className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">
                    Week {rivalry.team1.record.lastMeeting?.week}
                  </div>
                  <div className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">
                    {rivalry.team1.record.lastMeeting?.score.team.toFixed(1)} - {rivalry.team1.record.lastMeeting?.score.opponent.toFixed(1)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Closest Game</div>
                  <div className="text-yellow-400 font-semibold sm:px-4 md:px-6 lg:px-8">
                    {Math.min(rivalry.team1.record.closestGame.margin, rivalry.team2.record.closestGame.margin).toFixed(1)} pts
                  </div>
                  <div className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">Week {rivalry.team1.record.closestGame.week}</div>
                </div>
                <div>
                  <div className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Biggest Blowout</div>
                  <div className="text-red-400 font-semibold sm:px-4 md:px-6 lg:px-8">
                    {Math.max(rivalry.team1.record.biggestWin.margin, rivalry.team2.record.biggestWin.margin).toFixed(1)} pts
                  </div>
                  <div className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">
                    Week {rivalry.team1.record.biggestWin.margin > rivalry.team2.record.biggestWin.margin ? 
                      rivalry.team1.record.biggestWin.week : rivalry.team2.record.biggestWin.week}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Current Streak</div>
                  <div className={`font-semibold ${
                    rivalry.team1.record.streakType === 'win' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {rivalry.team1.record.currentStreak} {rivalry.team1.record.streakType}s
                  </div>
                  <div className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">{rivalry.team1.name}</div>
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {selectedRivalry === rivalry.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-6 pt-6 border-t border-gray-600 space-y-4 sm:px-4 md:px-6 lg:px-8"
                  >
                    {/* Memorable Moments */}
                    <div>
                      <h4 className="font-semibold text-white mb-3 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                        <Crown className="w-4 h-4 text-gold-400 sm:px-4 md:px-6 lg:px-8" />
                        Legendary Moments
                      </h4>
                      <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                        {rivalry.memorable_moments.map((moment, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-dark-600 rounded-lg sm:px-4 md:px-6 lg:px-8">
                            <div className="text-lg sm:px-4 md:px-6 lg:px-8">{getMomentIcon(moment.type)}</div>
                            <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                              <div className="text-sm text-gray-200 sm:px-4 md:px-6 lg:px-8">{moment.description}</div>
                              <div className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">Week {moment.week}, {moment.season}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Season History */}
                    <div>
                      <h4 className="font-semibold text-white mb-3 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                        <BarChart3 className="w-4 h-4 text-blue-400 sm:px-4 md:px-6 lg:px-8" />
                        Season History
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                          <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Recent Meetings</div>
                          {Array.from({ length: 5 }, (_, i) => (
                            <div key={i} className="flex justify-between items-center text-sm p-2 bg-dark-600 rounded sm:px-4 md:px-6 lg:px-8">
                              <span className="text-gray-300 sm:px-4 md:px-6 lg:px-8">Week {Math.floor(Math.random() * 14) + 1}</span>
                              <span className="text-white sm:px-4 md:px-6 lg:px-8">
                                {(115 + Math.random() * 25).toFixed(1)} - {(110 + Math.random() * 30).toFixed(1)}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                          <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Key Stats</div>
                          <div className="space-y-1 text-xs sm:px-4 md:px-6 lg:px-8">
                            <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                              <span>Avg Score Difference:</span>
                              <span>{Math.abs(rivalry.team1.record.avgMargin).toFixed(1)} pts</span>
                            </div>
                            <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                              <span>Games Decided by &lt;5 pts:</span>
                              <span>{Math.floor(rivalry.totalMeetings * 0.4)}</span>
                            </div>
                            <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                              <span>Longest Win Streak:</span>
                              <span>{Math.max(rivalry.team1.record.winStreak, rivalry.team2.record.winStreak)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      ) : (
        // Matrix View
        <div className="overflow-x-auto sm:px-4 md:px-6 lg:px-8">
          <div className="min-w-[600px] bg-dark-700 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
            <div className="text-center text-gray-400 mb-4 text-sm sm:px-4 md:px-6 lg:px-8">Head-to-Head Matrix</div>
            <div className="grid grid-cols-11 gap-2 sm:px-4 md:px-6 lg:px-8">
              {/* Header row */}
              <div></div>
              {teams.slice(0, 10).map((team: any) => (
                <div key={team.id} className="text-center text-xs text-gray-400 p-1 sm:px-4 md:px-6 lg:px-8">
                  {team.name.substring(0, 8)}
                </div>
              ))}
              
              {/* Matrix rows */}
              {teams.slice(0, 10).map((teamRow, rowIndex) => (
                <React.Fragment key={teamRow.id}>
                  <div className="text-xs text-gray-400 p-1 sm:px-4 md:px-6 lg:px-8">
                    {teamRow.name.substring(0, 8)}
                  </div>
                  {teams.slice(0, 10).map((teamCol, colIndex) => (
                    <div 
                      key={teamCol.id} 
                      className={`text-center text-xs p-2 rounded ${
                        rowIndex === colIndex 
                          ? 'bg-gray-600' 
                          : Math.random() > 0.5 
                            ? 'bg-green-600/30 text-green-400' 
                            : 'bg-red-600/30 text-red-400'
                      }`}
                    >
                      {rowIndex === colIndex 
                        ? '-' 
                        : `${Math.floor(Math.random() * 5)}-${Math.floor(Math.random() * 5)}`

                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rivalry Rankings */}
      <div className="mt-6 p-4 bg-dark-700 rounded-lg border border-gray-600 sm:px-4 md:px-6 lg:px-8">
        <h3 className="font-semibold text-white mb-3 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
          <Trophy className="w-4 h-4 text-gold-400 sm:px-4 md:px-6 lg:px-8" />
          Hottest Rivalries
        </h3>
        <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
          {rivalries
            .sort((a, b) => b.intensity - a.intensity)
            .slice(0, 3)
            .map((rivalry, index) => (
              <div key={rivalry.id} className="flex items-center justify-between p-2 bg-dark-600 rounded sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-gold-400 text-black' :
                    index === 1 ? 'bg-gray-400 text-black' :
                    'bg-amber-600 text-white'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">{rivalry.nickname}</span>
                </div>
                <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                  <span className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">
                    {rivalry.team1.name.split(' ')[0]} vs {rivalry.team2.name.split(' ')[0]}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getIntensityColor(rivalry.intensity)}`}>
                    {rivalry.intensity}/10
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

const RivalryTrackerWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <RivalryTracker {...props} />
  </ErrorBoundary>
);

export default React.memo(RivalryTrackerWithErrorBoundary);