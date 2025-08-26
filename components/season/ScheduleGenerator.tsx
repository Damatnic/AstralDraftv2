/**
 * Schedule Generator Component
 * Creates 14-week regular season + 3-week playoff schedule
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../../contexts/AppContext';
import { Team } from '../../types';

interface Matchup {
  week: number;
  team1Id: number;
  team2Id: number;
  team1Score?: number;
  team2Score?: number;
  isPlayoff?: boolean;
  isChampionship?: boolean;
}

interface ScheduleGeneratorProps {
  onScheduleGenerated?: (schedule: Matchup[]) => void;
  isCommissioner?: boolean;
}

const ScheduleGenerator: React.FC<ScheduleGeneratorProps> = ({
  onScheduleGenerated,
  isCommissioner = false
}) => {
  const { state, dispatch } = useAppState();
  const [schedule, setSchedule] = useState<Matchup[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(1);

  const league = state.leagues[0];
  const teams = league?.teams || [];

  // Generate regular season schedule (14 weeks)
  const generateRegularSeason = (): Matchup[] => {
    const matchups: Matchup[] = [];
    const teamIds = teams.map(team => team.id);
    
    // Round-robin with some randomization
    for (let week = 1; week <= 14; week++) {
      const weekMatchups: Matchup[] = [];
      const availableTeams = [...teamIds];
      
      // Create 5 matchups per week (10 teams = 5 matchups)
      while (availableTeams.length >= 2) {
        const team1Index = Math.floor(Math.random() * availableTeams.length);
        const team1Id = availableTeams.splice(team1Index, 1)[0];
        
        const team2Index = Math.floor(Math.random() * availableTeams.length);
        const team2Id = availableTeams.splice(team2Index, 1)[0];
        
        weekMatchups.push({
          week,
          team1Id,
          team2Id,
          isPlayoff: false
        });
      }
      
      matchups.push(...weekMatchups);
    }
    
    return matchups;
  };

  // Generate playoff schedule (weeks 15-17)
  const generatePlayoffs = (): Matchup[] => {
    const playoffMatchups: Matchup[] = [];
    
    // Week 15: First round of playoffs (6 teams, top 2 get bye)
    // Teams 3v6 and 4v5
    playoffMatchups.push(
      {
        week: 15,
        team1Id: teams[2]?.id || 3, // 3rd seed
        team2Id: teams[5]?.id || 6, // 6th seed
        isPlayoff: true
      },
      {
        week: 15,
        team1Id: teams[3]?.id || 4, // 4th seed
        team2Id: teams[4]?.id || 5, // 5th seed
        isPlayoff: true
      }
    );
    
    // Week 16: Semifinals
    // Winners from week 15 vs top 2 seeds
    playoffMatchups.push(
      {
        week: 16,
        team1Id: teams[0]?.id || 1, // 1st seed
        team2Id: teams[5]?.id || 6, // Winner of 3v6 (placeholder)
        isPlayoff: true
      },
      {
        week: 16,
        team1Id: teams[1]?.id || 2, // 2nd seed
        team2Id: teams[4]?.id || 5, // Winner of 4v5 (placeholder)
        isPlayoff: true
      }
    );
    
    // Week 17: Championship
    playoffMatchups.push({
      week: 17,
      team1Id: teams[0]?.id || 1, // Winner of semifinal 1
      team2Id: teams[1]?.id || 2, // Winner of semifinal 2
      isPlayoff: true,
      isChampionship: true
    });
    
    return playoffMatchups;
  };

  const handleGenerateSchedule = async () => {
    if (!isCommissioner) return;
    
    setIsGenerating(true);
    
    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const regularSeason = generateRegularSeason();
    const playoffs = generatePlayoffs();
    const fullSchedule = [...regularSeason, ...playoffs];
    
    setSchedule(fullSchedule);
    onScheduleGenerated?.(fullSchedule);
    
    setIsGenerating(false);
    
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        message: 'Season schedule generated successfully!',
        type: 'SUCCESS'
      }
    });
  };

  const getTeamName = (teamId: number): string => {
    return teams.find(team => team.id === teamId)?.name || `Team ${teamId}`;
  };

  const getTeamAvatar = (teamId: number): string => {
    return teams.find(team => team.id === teamId)?.avatar || '🏈';
  };

  const getWeekMatchups = (week: number): Matchup[] => {
    return schedule.filter(matchup => matchup.week === week);
  };

  const getWeekType = (week: number): string => {
    if (week <= 14) return 'Regular Season';
    if (week === 15) return 'Wild Card';
    if (week === 16) return 'Semifinals';
    if (week === 17) return 'Championship';
    return 'Season';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Season Schedule</h3>
          <p className="text-slate-400">
            14-week regular season + 3-week playoffs
          </p>
        </div>
        
        {isCommissioner && (
          <button
            onClick={handleGenerateSchedule}
            disabled={isGenerating}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              isGenerating
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </div>
            ) : (
              '📅 Generate Schedule'
            )}
          </button>
        )}
      </div>

      {schedule.length === 0 ? (
        /* No Schedule Generated */
        <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700 text-center">
          <div className="text-4xl mb-4">📅</div>
          <h4 className="text-lg font-semibold text-white mb-2">No Schedule Generated</h4>
          <p className="text-slate-400 mb-4">
            {isCommissioner 
              ? 'Generate the season schedule to begin matchups'
              : 'The commissioner will generate the schedule soon'
            }
          </p>
          {!isCommissioner && (
            <p className="text-sm text-slate-500">
              Schedule will include 14 regular season weeks + 3 playoff weeks
            </p>
          )}
        </div>
      ) : (
        /* Schedule Display */
        <div className="space-y-6">
          {/* Week Navigation */}
          <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-4">
            <button
              onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
              disabled={currentWeek === 1}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded transition-colors"
            >
              ← Previous
            </button>
            
            <div className="text-center">
              <h4 className="text-lg font-bold text-white">
                Week {currentWeek} - {getWeekType(currentWeek)}
              </h4>
              <p className="text-sm text-slate-400">
                {currentWeek <= 14 ? 'Regular Season' : 'Playoffs'}
              </p>
            </div>
            
            <button
              onClick={() => setCurrentWeek(Math.min(17, currentWeek + 1))}
              disabled={currentWeek === 17}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded transition-colors"
            >
              Next →
            </button>
          </div>

          {/* Week Matchups */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getWeekMatchups(currentWeek).map((matchup, index) => (
              <motion.div
                key={`${matchup.week}-${matchup.team1Id}-${matchup.team2Id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  matchup.isChampionship
                    ? 'border-yellow-500 bg-yellow-900/20'
                    : matchup.isPlayoff
                    ? 'border-blue-500 bg-blue-900/20'
                    : 'border-slate-600 bg-slate-700/50'
                }`}
              >
                {matchup.isChampionship && (
                  <div className="text-center mb-3">
                    <span className="px-2 py-1 bg-yellow-600 text-white text-xs font-bold rounded">
                      🏆 CHAMPIONSHIP
                    </span>
                  </div>
                )}
                
                {matchup.isPlayoff && !matchup.isChampionship && (
                  <div className="text-center mb-3">
                    <span className="px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded">
                      🏈 PLAYOFF
                    </span>
                  </div>
                )}

                <div className="space-y-3">
                  {/* Team 1 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getTeamAvatar(matchup.team1Id)}</span>
                      <span className="text-white font-medium">
                        {getTeamName(matchup.team1Id)}
                      </span>
                    </div>
                    <div className="text-white font-bold">
                      {matchup.team1Score || '-'}
                    </div>
                  </div>

                  <div className="text-center text-slate-400 text-sm">vs</div>

                  {/* Team 2 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getTeamAvatar(matchup.team2Id)}</span>
                      <span className="text-white font-medium">
                        {getTeamName(matchup.team2Id)}
                      </span>
                    </div>
                    <div className="text-white font-bold">
                      {matchup.team2Score || '-'}
                    </div>
                  </div>
                </div>

                {/* Matchup Status */}
                <div className="mt-3 pt-3 border-t border-slate-600 text-center">
                  <span className="text-xs text-slate-400">
                    {matchup.team1Score && matchup.team2Score 
                      ? 'Final' 
                      : currentWeek === matchup.week 
                      ? 'This Week' 
                      : currentWeek > matchup.week 
                      ? 'Completed' 
                      : 'Upcoming'
                    }
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Schedule Summary */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <h4 className="font-semibold text-white mb-3">Season Format</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-white font-bold">14</div>
                <div className="text-slate-400">Regular Season</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold">6</div>
                <div className="text-slate-400">Playoff Teams</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold">3</div>
                <div className="text-slate-400">Playoff Weeks</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold">17</div>
                <div className="text-slate-400">Total Weeks</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleGenerator;