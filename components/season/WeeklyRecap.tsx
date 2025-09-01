/**
 * Weekly Recap Component
 * Comprehensive weekly summary with highlights and analysis
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../../contexts/AppContext';

interface WeeklyHighlight {
  id: string;
  type: 'high_score' | 'upset' | 'blowout' | 'close_game' | 'milestone' | 'streak';
  title: string;
  description: string;
  teamId?: string;
  playerId?: string;
  value: number;
  icon: string;


interface WeeklyAward {
  id: string;
  category: string;
  winner: string;
  teamName: string;
  description: string;
  value: string;
  icon: string;

interface WeeklyRecapProps {
  week?: number;


const WeeklyRecap: React.FC<WeeklyRecapProps> = ({ week = 8 }: any) => {
  const { state } = useAppState();
  const [selectedWeek, setSelectedWeek] = useState(week);

  const league = state.leagues[0];

  // Generate weekly highlights
  const weeklyHighlights = useMemo((): WeeklyHighlight[] => {
    return [
      {
        id: 'highlight-1',
        type: 'high_score',
        title: 'Week High Score',
        description: 'Thunder Bolts dominated with the highest score of the week',
        teamId: 'team-2',
        value: 167.8,
        icon: '🔥'
      },
      {
        id: 'highlight-2',
        type: 'upset',
        title: 'Upset of the Week',
        description: 'Lightning Strikes (8th seed) defeated Storm Chasers (2nd seed)',
        teamId: 'team-8',
        value: 15.4,
        icon: '⚡'
      },
      {
        id: 'highlight-3',
        type: 'close_game',
        title: 'Nail Biter',
        description: 'Gridiron Giants edged out Astral Aces by just 2.1 points',
        teamId: 'team-3',
        value: 2.1,
        icon: '😰'
      },
      {
        id: 'highlight-4',
        type: 'milestone',
        title: 'Season Milestone',
        description: 'Nick Damato reached 1,000 total points for the season',
        teamId: 'team-1',
        value: 1000,
        icon: '🎯'
      },
      {
        id: 'highlight-5',
        type: 'blowout',
        title: 'Blowout Victory',
        description: 'Cosmic Crushers demolished their opponent by 45+ points',
        teamId: 'team-5',
        value: 47.2,
        icon: '💥'

    ];
  }, [selectedWeek]);

  // Generate weekly awards
  const weeklyAwards = useMemo((): WeeklyAward[] => {
    return [
      {
        id: 'award-1',
        category: 'Player of the Week',
        winner: 'Josh Allen',
        teamName: 'Thunder Bolts',
        description: '4 passing TDs, 1 rushing TD, 387 yards',
        value: '34.8 points',
        icon: '👑'
      },
      {
        id: 'award-2',
        category: 'Waiver Wire Hero',
        winner: 'Gus Edwards',
        teamName: 'Lightning Strikes',
        description: 'Picked up Tuesday, scored 18.4 points',
        value: '18.4 points',
        icon: '💎'
      },
      {
        id: 'award-3',
        category: 'Biggest Bust',
        winner: 'Cooper Kupp',
        teamName: 'Gridiron Giants',
        description: 'Expected 16.2, only scored 4.1 points',
        value: '-12.1 vs proj',
        icon: '💔'
      },
      {
        id: 'award-4',
        category: 'Bench Warmer',
        winner: 'Derrick Henry',
        teamName: 'Storm Chasers',
        description: 'Left 22.6 points on the bench',
        value: '22.6 points',
        icon: '🪑'
      },
      {
        id: 'award-5',
        category: 'Lucky Break',
        winner: 'Astral Aces',
        teamName: 'Astral Aces',
        description: 'Won despite being outscored in projections',
        value: '+8.3 luck',
        icon: '🍀'

    ];
  }, [selectedWeek]);

  // Generate matchup results
  const matchupResults = useMemo(() => {
    if (!league?.teams) return [];

    const results = [];
    const teams = [...league.teams];
    
    for (let i = 0; i < teams.length; i += 2) {
      if (i + 1 < teams.length) {
        const team1 = teams[i];
        const team2 = teams[i + 1];
        const score1 = Math.floor(Math.random() * 60) + 90; // 90-150
        const score2 = Math.floor(Math.random() * 60) + 90; // 90-150
        
        results.push({
          id: `matchup-${i}`,
          homeTeam: team1,
          awayTeam: team2,
          homeScore: score1,
          awayScore: score2,
          winner: score1 > score2 ? team1 : team2,
          margin: Math.abs(score1 - score2),
          isUpset: false // Could calculate based on rankings
        });


    return results;
  }, [league?.teams, selectedWeek]);

  const getHighlightColor = (type: string) => {
    switch (type) {
      case 'high_score': return 'border-green-500 bg-green-900/20';
      case 'upset': return 'border-yellow-500 bg-yellow-900/20';
      case 'close_game': return 'border-orange-500 bg-orange-900/20';
      case 'milestone': return 'border-purple-500 bg-purple-900/20';
      case 'blowout': return 'border-red-500 bg-red-900/20';
      case 'streak': return 'border-blue-500 bg-blue-900/20';
      default: return 'border-slate-500 bg-slate-900/20';

  };

  return (
    <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
        <div>
          <h2 className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">Week {selectedWeek} Recap</h2>
          <p className="text-slate-400 sm:px-4 md:px-6 lg:px-8">Highlights, awards, and analysis</p>
        </div>
        
        <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
          <button
            onClick={() => setSelectedWeek(Math.max(1, selectedWeek - 1))}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8"
          >
            ← Previous
          </button>
          
          <select
            value={selectedWeek}
            onChange={(e: any) => setSelectedWeek(Number(e.target.value))}
          >
            {Array.from({ length: 17 }, (_, i) => i + 1).map((weekNum: any) => (
              <option key={weekNum} value={weekNum}>
                Week {weekNum}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => setSelectedWeek(Math.min(17, selectedWeek + 1))}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Week Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center sm:px-4 md:px-6 lg:px-8">
          <div className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">167.8</div>
          <div className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">High Score</div>
        </div>
        <div className="card text-center sm:px-4 md:px-6 lg:px-8">
          <div className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">89.2</div>
          <div className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">Low Score</div>
        </div>
        <div className="card text-center sm:px-4 md:px-6 lg:px-8">
          <div className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">124.5</div>
          <div className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">Average</div>
        </div>
        <div className="card text-center sm:px-4 md:px-6 lg:px-8">
          <div className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">3</div>
          <div className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">Close Games</div>
        </div>
      </div>

      {/* Weekly Highlights */}
      <div className="card sm:px-4 md:px-6 lg:px-8">
        <h3 className="text-xl font-bold text-white mb-4 sm:px-4 md:px-6 lg:px-8">📰 Week {selectedWeek} Highlights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weeklyHighlights.map((highlight, index) => (
            <motion.div
              key={highlight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-2 ${getHighlightColor(highlight.type)}`}
            >
              <div className="flex items-start gap-3 sm:px-4 md:px-6 lg:px-8">
                <span className="text-2xl sm:px-4 md:px-6 lg:px-8">{highlight.icon}</span>
                <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                  <h4 className="text-white font-semibold mb-1 sm:px-4 md:px-6 lg:px-8">{highlight.title}</h4>
                  <p className="text-slate-300 text-sm mb-2 sm:px-4 md:px-6 lg:px-8">{highlight.description}</p>
                  <div className="text-lg font-bold text-white sm:px-4 md:px-6 lg:px-8">
                    {highlight.type === 'milestone' ? highlight.value.toLocaleString() : 
                     highlight.type === 'close_game' ? `${highlight.value} pts` :
                     highlight.type === 'blowout' ? `+${highlight.value} pts` :
                     `${highlight.value} pts`}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Weekly Awards */}
      <div className="card sm:px-4 md:px-6 lg:px-8">
        <h3 className="text-xl font-bold text-white mb-4 sm:px-4 md:px-6 lg:px-8">🏆 Weekly Awards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {weeklyAwards.map((award, index) => (
            <motion.div
              key={award.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 transition-colors sm:px-4 md:px-6 lg:px-8"
            >
              <div className="text-center sm:px-4 md:px-6 lg:px-8">
                <span className="text-3xl mb-2 block sm:px-4 md:px-6 lg:px-8">{award.icon}</span>
                <h4 className="text-white font-semibold mb-1 sm:px-4 md:px-6 lg:px-8">{award.category}</h4>
                <p className="text-blue-400 font-bold sm:px-4 md:px-6 lg:px-8">{award.winner}</p>
                <p className="text-slate-400 text-sm sm:px-4 md:px-6 lg:px-8">{award.teamName}</p>
                <p className="text-slate-300 text-sm mt-2 sm:px-4 md:px-6 lg:px-8">{award.description}</p>
                <div className="text-lg font-bold text-white mt-2 sm:px-4 md:px-6 lg:px-8">{award.value}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Matchup Results */}
      <div className="card sm:px-4 md:px-6 lg:px-8">
        <h3 className="text-xl font-bold text-white mb-4 sm:px-4 md:px-6 lg:px-8">⚔️ Week {selectedWeek} Results</h3>
        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
          {matchupResults.map((matchup, index) => (
            <motion.div
              key={matchup.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg sm:px-4 md:px-6 lg:px-8"
            >
              <div className="flex items-center gap-4 sm:px-4 md:px-6 lg:px-8">
                <div className="text-center sm:px-4 md:px-6 lg:px-8">
                  <span className="text-lg sm:px-4 md:px-6 lg:px-8">{matchup.homeTeam.avatar}</span>
                  <div className="text-white font-semibold text-sm sm:px-4 md:px-6 lg:px-8">{matchup.homeTeam.name}</div>
                </div>
                <div className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">{matchup.homeScore}</div>
              </div>
              
              <div className="text-center sm:px-4 md:px-6 lg:px-8">
                <div className="text-slate-400 text-sm sm:px-4 md:px-6 lg:px-8">vs</div>
                <div className="text-xs text-slate-500 sm:px-4 md:px-6 lg:px-8">
                  {matchup.margin < 10 ? 'Close' : matchup.margin > 30 ? 'Blowout' : 'Win'}
                </div>
              </div>
              
              <div className="flex items-center gap-4 sm:px-4 md:px-6 lg:px-8">
                <div className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">{matchup.awayScore}</div>
                <div className="text-center sm:px-4 md:px-6 lg:px-8">
                  <span className="text-lg sm:px-4 md:px-6 lg:px-8">{matchup.awayTeam.avatar}</span>
                  <div className="text-white font-semibold text-sm sm:px-4 md:px-6 lg:px-8">{matchup.awayTeam.name}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Power Rankings Movement */}
      <div className="card sm:px-4 md:px-6 lg:px-8">
        <h3 className="text-xl font-bold text-white mb-4 sm:px-4 md:px-6 lg:px-8">📈 Power Rankings Movement</h3>
        <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
          {league?.teams?.slice(0, 5).map((team, index) => {
            const movement = Math.floor(Math.random() * 5) - 2; // -2 to +2
            const movementIcon = movement > 0 ? '📈' : movement < 0 ? '📉' : '➡️';
            const movementColor = movement > 0 ? 'text-green-400' : movement < 0 ? 'text-red-400' : 'text-slate-400';
            
            return (
              <div key={team.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                  <span className="w-6 h-6 bg-blue-600 text-white text-sm font-bold rounded flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
                    {index + 1}
                  </span>
                  <span className="text-lg sm:px-4 md:px-6 lg:px-8">{team.avatar}</span>
                  <div>
                    <div className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">{team.name}</div>
                    <div className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">{team.owner.name}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                  <span className="text-lg sm:px-4 md:px-6 lg:px-8">{movementIcon}</span>
                  <span className={`font-semibold ${movementColor}`}>
                    {movement > 0 ? `+${movement}` : movement < 0 ? movement : '—'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Looking Ahead */}
      <div className="card sm:px-4 md:px-6 lg:px-8">
        <h3 className="text-xl font-bold text-white mb-4 sm:px-4 md:px-6 lg:px-8">🔮 Looking Ahead to Week {selectedWeek + 1}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-white font-semibold mb-3 sm:px-4 md:px-6 lg:px-8">Key Matchups</h4>
            <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
              <div className="p-3 bg-slate-700/30 rounded-lg sm:px-4 md:px-6 lg:px-8">
                <div className="text-white font-medium sm:px-4 md:px-6 lg:px-8">Thunder Bolts vs Storm Chasers</div>
                <div className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">Battle for #1 seed</div>
              </div>
              <div className="p-3 bg-slate-700/30 rounded-lg sm:px-4 md:px-6 lg:px-8">
                <div className="text-white font-medium sm:px-4 md:px-6 lg:px-8">Lightning Strikes vs Gridiron Giants</div>
                <div className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">Playoff implications</div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-3 sm:px-4 md:px-6 lg:px-8">Players to Watch</h4>
            <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
              <div className="p-3 bg-slate-700/30 rounded-lg sm:px-4 md:px-6 lg:px-8">
                <div className="text-white font-medium sm:px-4 md:px-6 lg:px-8">Josh Allen (QB)</div>
                <div className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">vs weak secondary</div>
              </div>
              <div className="p-3 bg-slate-700/30 rounded-lg sm:px-4 md:px-6 lg:px-8">
                <div className="text-white font-medium sm:px-4 md:px-6 lg:px-8">Christian McCaffrey (RB)</div>
                <div className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">Coming off bye week</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WeeklyRecapWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <WeeklyRecap {...props} />
  </ErrorBoundary>
);

export default React.memo(WeeklyRecapWithErrorBoundary);