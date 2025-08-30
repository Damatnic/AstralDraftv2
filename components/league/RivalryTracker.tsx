/**
 * Enhanced Head-to-Head Rivalry Tracker - Track epic battles and grudge matches
 */

import React, { useState, useEffect } from 'react';
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
}

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
}

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
}

const RivalryTracker: React.FC<RivalryTrackerProps> = ({
  leagueId,
  userId,
  currentWeek,
  teams
}) => {
  const [selectedRivalry, setSelectedRivalry] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'matrix'>('grid');
  const [filterIntensity, setFilterIntensity] = useState<number>(0);

  // Generate mock rivalries for demonstration
  const generateRivalries = (): Rivalry[] => {
    const rivalries: Rivalry[] = [];
    const nicknames = [
      'The Classic Clash', 'Battle of the Titans', 'The Grudge Match', 'Fire vs Ice',
      'Old School vs New Blood', 'The Heavyweight Bout', 'Brothers in Arms',
      'The Upset Special', 'David vs Goliath', 'The Weekly War'
    ];

    const storylines = [
      'Two championship-caliber teams with contrasting styles clash in epic battles',
      'Former college roommates turned bitter fantasy rivals',
      'The veteran manager vs the analytics rookie in a generational battle',
      'Two teams that always seem to play their best games against each other',
      'A rivalry born from a controversial trade that changed both franchises'
    ];

    // Generate rivalries between random team pairs
    for (let i = 0; i < Math.min(5, teams.length - 1); i++) {
      const team1 = teams[i];
      const team2 = teams[(i + 1) % teams.length];
      
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
          }
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
          }
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
          }
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
          }
        ]
      };
      
      rivalries.push(rivalry);
    }

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
    }
  };

  const filteredRivalries = rivalries.filter(r => r.intensity >= filterIntensity);

  return (
    <div className="bg-dark-800 rounded-xl p-6 border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Swords className="w-6 h-6 text-red-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Rivalry Central</h2>
            <p className="text-gray-400">Head-to-head battles and grudge matches</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Min Intensity:</span>
            <select
              value={filterIntensity}
              onChange={(e) => setFilterIntensity(Number(e.target.value))}
              className="bg-dark-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
            >
              <option value={0}>All (0+)</option>
              <option value={5}>Competitive (5+)</option>
              <option value={7}>Heated (7+)</option>
              <option value={9}>Legendary (9+)</option>
            </select>
          </div>
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'matrix' : 'grid')}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-sm transition-colors"
          >
            {viewMode === 'grid' ? 'Matrix View' : 'Grid View'}
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        // Grid View
        <div className="space-y-4">
          {filteredRivalries.map(rivalry => (
            <motion.div
              key={rivalry.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 bg-dark-700 rounded-lg border border-gray-600 hover:border-red-500/50 transition-all cursor-pointer ${
                selectedRivalry === rivalry.id ? 'border-red-500 bg-red-500/5' : ''
              }`}
              onClick={() => setSelectedRivalry(selectedRivalry === rivalry.id ? null : rivalry.id)}
            >
              {/* Rivalry Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <h3 className="text-xl font-bold text-white">{rivalry.nickname}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getIntensityColor(rivalry.intensity)}`}>
                    {getIntensityLabel(rivalry.intensity)} ({rivalry.intensity}/10)
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  {rivalry.totalMeetings} meetings
                </div>
              </div>

              {/* Teams Matchup */}
              <div className="grid grid-cols-3 gap-4 items-center mb-4">
                {/* Team 1 */}
                <div className="text-center">
                  <div className="font-bold text-white">{rivalry.team1.name}</div>
                  <div className="text-sm text-gray-400">{rivalry.team1.owner}</div>
                  <div className="text-lg font-bold text-green-400">
                    {rivalry.team1.record.wins}-{rivalry.team1.record.losses}
                  </div>
                  <div className="text-xs text-gray-500">
                    {getWinPercentage(rivalry.team1.record.wins, rivalry.team1.record.losses)}% win rate
                  </div>
                </div>

                {/* VS */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400">VS</div>
                  <div className="text-xs text-gray-500">All-time</div>
                </div>

                {/* Team 2 */}
                <div className="text-center">
                  <div className="font-bold text-white">{rivalry.team2.name}</div>
                  <div className="text-sm text-gray-400">{rivalry.team2.owner}</div>
                  <div className="text-lg font-bold text-green-400">
                    {rivalry.team2.record.wins}-{rivalry.team2.record.losses}
                  </div>
                  <div className="text-xs text-gray-500">
                    {getWinPercentage(rivalry.team2.record.wins, rivalry.team2.record.losses)}% win rate
                  </div>
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-4 italic">"{rivalry.storyline}"</p>

              {/* Next Meeting */}
              {rivalry.nextMeeting && (
                <div className="p-3 bg-primary-500/10 border border-primary-500/30 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary-400" />
                      <span className="font-semibold text-primary-400">
                        Next Battle: Week {rivalry.nextMeeting.week}
                      </span>
                    </div>
                    <div className="text-sm text-gray-300">
                      Projected: {rivalry.nextMeeting.projected.team1.toFixed(1)} - {rivalry.nextMeeting.projected.team2.toFixed(1)}
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">Last Meeting</div>
                  <div className="text-white font-semibold">
                    Week {rivalry.team1.record.lastMeeting?.week}
                  </div>
                  <div className="text-xs text-gray-500">
                    {rivalry.team1.record.lastMeeting?.score.team.toFixed(1)} - {rivalry.team1.record.lastMeeting?.score.opponent.toFixed(1)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Closest Game</div>
                  <div className="text-yellow-400 font-semibold">
                    {Math.min(rivalry.team1.record.closestGame.margin, rivalry.team2.record.closestGame.margin).toFixed(1)} pts
                  </div>
                  <div className="text-xs text-gray-500">Week {rivalry.team1.record.closestGame.week}</div>
                </div>
                <div>
                  <div className="text-gray-400">Biggest Blowout</div>
                  <div className="text-red-400 font-semibold">
                    {Math.max(rivalry.team1.record.biggestWin.margin, rivalry.team2.record.biggestWin.margin).toFixed(1)} pts
                  </div>
                  <div className="text-xs text-gray-500">
                    Week {rivalry.team1.record.biggestWin.margin > rivalry.team2.record.biggestWin.margin ? 
                      rivalry.team1.record.biggestWin.week : rivalry.team2.record.biggestWin.week}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Current Streak</div>
                  <div className={`font-semibold ${
                    rivalry.team1.record.streakType === 'win' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {rivalry.team1.record.currentStreak} {rivalry.team1.record.streakType}s
                  </div>
                  <div className="text-xs text-gray-500">{rivalry.team1.name}</div>
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {selectedRivalry === rivalry.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-6 pt-6 border-t border-gray-600 space-y-4"
                  >
                    {/* Memorable Moments */}
                    <div>
                      <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <Crown className="w-4 h-4 text-gold-400" />
                        Legendary Moments
                      </h4>
                      <div className="space-y-2">
                        {rivalry.memorable_moments.map((moment, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-dark-600 rounded-lg">
                            <div className="text-lg">{getMomentIcon(moment.type)}</div>
                            <div className="flex-1">
                              <div className="text-sm text-gray-200">{moment.description}</div>
                              <div className="text-xs text-gray-500">Week {moment.week}, {moment.season}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Season History */}
                    <div>
                      <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-blue-400" />
                        Season History
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-sm text-gray-400">Recent Meetings</div>
                          {Array.from({ length: 5 }, (_, i) => (
                            <div key={i} className="flex justify-between items-center text-sm p-2 bg-dark-600 rounded">
                              <span className="text-gray-300">Week {Math.floor(Math.random() * 14) + 1}</span>
                              <span className="text-white">
                                {(115 + Math.random() * 25).toFixed(1)} - {(110 + Math.random() * 30).toFixed(1)}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm text-gray-400">Key Stats</div>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span>Avg Score Difference:</span>
                              <span>{Math.abs(rivalry.team1.record.avgMargin).toFixed(1)} pts</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Games Decided by <5 pts:</span>
                              <span>{Math.floor(rivalry.totalMeetings * 0.4)}</span>
                            </div>
                            <div className="flex justify-between">
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
        <div className="overflow-x-auto">
          <div className="min-w-[600px] bg-dark-700 rounded-lg p-4">
            <div className="text-center text-gray-400 mb-4 text-sm">Head-to-Head Matrix</div>
            <div className="grid grid-cols-11 gap-2">
              {/* Header row */}
              <div></div>
              {teams.slice(0, 10).map(team => (
                <div key={team.id} className="text-center text-xs text-gray-400 p-1">
                  {team.name.substring(0, 8)}
                </div>
              ))}
              
              {/* Matrix rows */}
              {teams.slice(0, 10).map((teamRow, rowIndex) => (
                <React.Fragment key={teamRow.id}>
                  <div className="text-xs text-gray-400 p-1">
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
                      }
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rivalry Rankings */}
      <div className="mt-6 p-4 bg-dark-700 rounded-lg border border-gray-600">
        <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-gold-400" />
          Hottest Rivalries
        </h3>
        <div className="space-y-2">
          {rivalries
            .sort((a, b) => b.intensity - a.intensity)
            .slice(0, 3)
            .map((rivalry, index) => (
              <div key={rivalry.id} className="flex items-center justify-between p-2 bg-dark-600 rounded">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-gold-400 text-black' :
                    index === 1 ? 'bg-gray-400 text-black' :
                    'bg-amber-600 text-white'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="text-white font-semibold">{rivalry.nickname}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">
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

export default RivalryTracker;