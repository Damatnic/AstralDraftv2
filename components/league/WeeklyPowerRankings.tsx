/**
 * AI-Powered Weekly Power Rankings - Intelligent league analysis and predictions
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Crown, Target, Brain, BarChart3, Zap, AlertTriangle } from 'lucide-react';

interface TeamRanking {
  teamId: string;
  teamName: string;
  ownerName: string;
  currentRank: number;
  previousRank: number;
  record: { wins: number; losses: number };
  pointsFor: number;
  pointsAgainst: number;
  powerScore: number;
  strengthOfSchedule: number;
  projectedRecord: { wins: number; losses: number };
  playoffOdds: number;
  championshipOdds: number;
  trend: 'up' | 'down' | 'stable';
  trendStrength: number; // 1-5
  keyStats: {
    avgPointsFor: number;
    avgPointsAgainst: number;
    consistencyScore: number;
    luckFactor: number;
  };
  analysis: {
    strengths: string[];
    weaknesses: string[];
    recommendation: string;
    outlook: 'hot' | 'warming' | 'cooling' | 'cold';
  };
  nextWeekMatchup: {
    opponent: string;
    difficulty: 'easy' | 'medium' | 'hard';
    winProbability: number;
  };
}

interface WeeklyPowerRankingsProps {
  leagueId: string;
  week: number;
  teams: TeamRanking[];
  onTeamClick?: (teamId: string) => void;
}

const WeeklyPowerRankings: React.FC<WeeklyPowerRankingsProps> = ({
  leagueId,
  week,
  teams = [],
  onTeamClick
}) => {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('compact');
  const [sortBy, setSortBy] = useState<'powerScore' | 'record' | 'pointsFor' | 'playoffOdds'>('powerScore');

  // Mock data generator for demonstration
  const generateMockRankings = (): TeamRanking[] => {
    const teamNames = [
      'Dynasty Destroyers', 'Gridiron Gladiators', 'Fantasy Phenoms', 'Championship Chasers',
      'Playoff Predators', 'Touchdown Titans', 'Victory Vampires', 'Elite Eagles',
      'Comeback Kings', 'Draft Day Demons'
    ];

    const owners = [
      'Mike Johnson', 'Sarah Chen', 'Alex Rodriguez', 'Jordan Smith',
      'Taylor Brown', 'Casey Wilson', 'Morgan Davis', 'Riley Martinez',
      'Avery Thompson', 'Quinn Anderson'
    ];

    return teamNames.map((name, index) => {
      const wins = Math.floor(Math.random() * (week + 1));
      const losses = Math.min(week - wins, week);
      const pf = 1200 + Math.random() * 400;
      const pa = 1100 + Math.random() * 400;
      const previousRank = Math.max(1, Math.min(10, index + 1 + Math.floor(Math.random() * 3) - 1));
      const currentRank = index + 1;

      return {
        teamId: `team_${index}`,
        teamName: name,
        ownerName: owners[index],
        currentRank,
        previousRank,
        record: { wins, losses },
        pointsFor: pf,
        pointsAgainst: pa,
        powerScore: 85 - index * 8 + Math.random() * 10,
        strengthOfSchedule: 0.4 + Math.random() * 0.3,
        projectedRecord: { 
          wins: Math.floor(wins + (14 - week) * (0.3 + Math.random() * 0.4)), 
          losses: Math.floor(losses + (14 - week) * (0.3 + Math.random() * 0.4))
        },
        playoffOdds: Math.max(0, Math.min(100, 90 - index * 9 + Math.random() * 20)),
        championshipOdds: Math.max(0, Math.min(50, 30 - index * 3 + Math.random() * 10)),
        trend: currentRank < previousRank ? 'up' : currentRank > previousRank ? 'down' : 'stable',
        trendStrength: Math.abs(currentRank - previousRank) + 1,
        keyStats: {
          avgPointsFor: pf / (wins + losses || 1),
          avgPointsAgainst: pa / (wins + losses || 1),
          consistencyScore: 65 + Math.random() * 30,
          luckFactor: -20 + Math.random() * 40
        },
        analysis: {
          strengths: ['Strong QB play', 'Consistent RB production', 'Deep WR corps'][Math.floor(Math.random() * 3)] ? 
            ['Strong QB play', 'Consistent RB production'] : ['Deep WR corps', 'Solid defense'],
          weaknesses: ['Inconsistent kicking', 'Weak bench', 'Injury concerns'][Math.floor(Math.random() * 3)] ? 
            ['Inconsistent kicking'] : ['Weak bench', 'Injury concerns'],
          recommendation: index < 3 ? 'Stay the course, make minor tweaks' : 
                          index < 7 ? 'Active on waiver wire, consider trades' : 
                          'Major roster overhaul needed',
          outlook: index < 2 ? 'hot' : index < 5 ? 'warming' : index < 8 ? 'cooling' : 'cold'
        },
        nextWeekMatchup: {
          opponent: teamNames[(index + 3) % 10],
          difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as 'easy' | 'medium' | 'hard',
          winProbability: 30 + Math.random() * 40
        }
      };
    }).sort((a, b) => b.powerScore - a.powerScore);
  };

  const [rankings, setRankings] = useState<TeamRanking[]>(generateMockRankings());

  const getTrendIcon = (trend: TeamRanking['trend'], strength: number) => {
    const iconClass = `w-5 h-5 ${strength > 2 ? 'animate-pulse' : ''}`;
    
    switch (trend) {
      case 'up':
        return <TrendingUp className={`${iconClass} text-green-400`} />;
      case 'down':
        return <TrendingDown className={`${iconClass} text-red-400`} />;
      default:
        return <Minus className={`${iconClass} text-gray-400`} />;
    }
  };

  const getOutlookColor = (outlook: TeamRanking['analysis']['outlook']) => {
    switch (outlook) {
      case 'hot': return 'text-red-400 bg-red-500/20';
      case 'warming': return 'text-orange-400 bg-orange-500/20';
      case 'cooling': return 'text-blue-400 bg-blue-500/20';
      case 'cold': return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const generateWeeklyInsight = () => {
    const insights = [
      "The playoff race is heating up with 6 teams within striking distance of the top 4 spots.",
      "This week showed significant parity with the top 8 teams all scoring within 30 points of each other.",
      "Waiver wire activity has intensified as teams make their final push for the playoffs.",
      "Three teams have emerged as legitimate championship contenders based on recent performance.",
      "The bottom tier teams are showing signs of life with improved roster management."
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  };

  return (
    <div className="bg-dark-800 rounded-xl p-6 border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-purple-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">AI Power Rankings</h2>
            <p className="text-gray-400">Week {week} • Intelligent Analysis</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-dark-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="powerScore">Power Score</option>
            <option value="record">Record</option>
            <option value="pointsFor">Points For</option>
            <option value="playoffOdds">Playoff Odds</option>
          </select>
          
          <button
            onClick={() => setViewMode(viewMode === 'compact' ? 'detailed' : 'compact')}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-sm transition-colors"
          >
            {viewMode === 'compact' ? 'Detailed' : 'Compact'}
          </button>
        </div>
      </div>

      {/* Weekly Insight */}
      <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-semibold text-purple-400">AI Weekly Insight</span>
        </div>
        <p className="text-gray-200 text-sm">{generateWeeklyInsight()}</p>
      </div>

      {/* Rankings List */}
      <div className="space-y-3">
        {rankings.map((team, index) => (
          <motion.div
            key={team.teamId}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 bg-dark-700 rounded-lg border border-gray-600 hover:border-primary-500/50 transition-all cursor-pointer ${
              selectedTeam === team.teamId ? 'border-primary-500 bg-primary-500/5' : ''
            }`}
            onClick={() => {
              setSelectedTeam(selectedTeam === team.teamId ? null : team.teamId);
              onTeamClick?.(team.teamId);
            }}
          >
            <div className="flex items-center gap-4">
              {/* Rank and Trend */}
              <div className="flex items-center gap-2 min-w-[60px]">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  index === 0 ? 'bg-yellow-500 text-black' :
                  index === 1 ? 'bg-gray-400 text-black' :
                  index === 2 ? 'bg-amber-600 text-white' :
                  'bg-dark-600 text-white'
                }`}>
                  {index === 0 && <Crown className="w-4 h-4" />}
                  {index !== 0 && team.currentRank}
                </div>
                {getTrendIcon(team.trend, team.trendStrength)}
              </div>

              {/* Team Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-white">{team.teamName}</h3>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-400">Power: {team.powerScore.toFixed(1)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getOutlookColor(team.analysis.outlook)}`}>
                      {team.analysis.outlook.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{team.ownerName}</span>
                  <div className="flex items-center gap-4">
                    <span>{team.record.wins}-{team.record.losses}</span>
                    <span>{team.pointsFor.toFixed(0)} PF</span>
                    <span className="text-green-400">{team.playoffOdds.toFixed(0)}% playoffs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed View */}
            <AnimatePresence>
              {selectedTeam === team.teamId && viewMode === 'detailed' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 pt-4 border-t border-gray-600"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Stats */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-white text-sm">Key Statistics</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Avg Points For:</span>
                          <span className="text-white">{team.keyStats.avgPointsFor.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Avg Points Against:</span>
                          <span className="text-white">{team.keyStats.avgPointsAgainst.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Consistency Score:</span>
                          <span className="text-white">{team.keyStats.consistencyScore.toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Luck Factor:</span>
                          <span className={team.keyStats.luckFactor > 0 ? 'text-green-400' : 'text-red-400'}>
                            {team.keyStats.luckFactor > 0 ? '+' : ''}{team.keyStats.luckFactor.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Analysis */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-white text-sm">AI Analysis</h4>
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-green-400">Strengths:</span>
                          <ul className="text-gray-300 ml-2">
                            {team.analysis.strengths.map(strength => (
                              <li key={strength}>• {strength}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="text-red-400">Weaknesses:</span>
                          <ul className="text-gray-300 ml-2">
                            {team.analysis.weaknesses.map(weakness => (
                              <li key={weakness}>• {weakness}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="text-blue-400">Recommendation:</span>
                          <p className="text-gray-300 ml-2">{team.analysis.recommendation}</p>
                        </div>
                      </div>
                    </div>

                    {/* Projections */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-white text-sm">Projections</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Projected Record:</span>
                          <span className="text-white">
                            {team.projectedRecord.wins}-{team.projectedRecord.losses}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Championship Odds:</span>
                          <span className="text-yellow-400">{team.championshipOdds.toFixed(1)}%</span>
                        </div>
                        <div className="pt-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-400">Next Week vs {team.nextWeekMatchup.opponent}:</span>
                            <span className={getDifficultyColor(team.nextWeekMatchup.difficulty)}>
                              {team.nextWeekMatchup.difficulty.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Win Probability:</span>
                            <span className="text-white">{team.nextWeekMatchup.winProbability.toFixed(0)}%</span>
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

      {/* Playoff Picture */}
      <div className="mt-6 p-4 bg-dark-700 rounded-lg border border-gray-600">
        <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-primary-400" />
          Playoff Picture
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Current Playoff Teams:</span>
            <div className="text-green-400 font-semibold">
              {rankings.slice(0, 4).map(team => team.teamName.split(' ')[0]).join(', ')}
            </div>
          </div>
          <div>
            <span className="text-gray-400">On the Bubble:</span>
            <div className="text-yellow-400 font-semibold">
              {rankings.slice(4, 6).map(team => team.teamName.split(' ')[0]).join(', ')}
            </div>
          </div>
          <div>
            <span className="text-gray-400">Long Shots:</span>
            <div className="text-orange-400 font-semibold">
              {rankings.slice(6, 8).map(team => team.teamName.split(' ')[0]).join(', ')}
            </div>
          </div>
          <div>
            <span className="text-gray-400">Eliminated:</span>
            <div className="text-red-400 font-semibold">
              {rankings.slice(8).map(team => team.teamName.split(' ')[0]).join(', ')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyPowerRankings;