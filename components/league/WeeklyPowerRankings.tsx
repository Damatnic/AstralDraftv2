/**
 * AI-Powered Weekly Power Rankings - Intelligent league analysis and predictions
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo, useState, useEffect } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { TrendingUp, TrendingDown, Minus, Crown, Target, Brain, BarChart3, Zap, AlertTriangle } from &apos;lucide-react&apos;;

interface TeamRanking {
}
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
  trend: &apos;up&apos; | &apos;down&apos; | &apos;stable&apos;;
  trendStrength: number; // 1-5
  keyStats: {
}
    avgPointsFor: number;
    avgPointsAgainst: number;
    consistencyScore: number;
    luckFactor: number;
  };
  analysis: {
}
    strengths: string[];
    weaknesses: string[];
    recommendation: string;
    outlook: &apos;hot&apos; | &apos;warming&apos; | &apos;cooling&apos; | &apos;cold&apos;;
  };
  nextWeekMatchup: {
}
    opponent: string;
    difficulty: &apos;easy&apos; | &apos;medium&apos; | &apos;hard&apos;;
    winProbability: number;
  };

interface WeeklyPowerRankingsProps {
}
  leagueId: string;
  week: number;
  teams: TeamRanking[];
  onTeamClick?: (teamId: string) => void;

}

const WeeklyPowerRankings: React.FC<WeeklyPowerRankingsProps> = ({ leagueId,
}
  week,
  teams = [],
//   onTeamClick
 }: any) => {
}
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<&apos;compact&apos; | &apos;detailed&apos;>(&apos;compact&apos;);
  const [sortBy, setSortBy] = useState<&apos;powerScore&apos; | &apos;record&apos; | &apos;pointsFor&apos; | &apos;playoffOdds&apos;>(&apos;powerScore&apos;);

  // Generate real team rankings based on actual league data
  const generateRealRankings = (): TeamRanking[] => {
}
    try {
}
      // Use actual league teams from the context
      const leagueTeams = teams || [];
      
      if (leagueTeams.length === 0) {
}
        return [];

      // Calculate real rankings based on actual team performance
      const rankings = leagueTeams.map((team, index) => {
}
        // Use real team data
        const teamRecord = team.record || { wins: 0, losses: 0 };
        const teamStats = team.stats || { pointsFor: 0, pointsAgainst: 0 };
        const gamesPlayed = teamRecord.wins + teamRecord.losses;
        
        // Calculate real power score based on performance metrics
        const winPercentage = gamesPlayed > 0 ? teamRecord.wins / gamesPlayed : 0;
        const avgPointsFor = gamesPlayed > 0 ? teamStats.pointsFor / gamesPlayed : 0;
        const avgPointsAgainst = gamesPlayed > 0 ? teamStats.pointsAgainst / gamesPlayed : 0;
        const powerScore = Math.round((winPercentage * 40 + (avgPointsFor / 150) * 35 + (1 - avgPointsAgainst / 150) * 25) * 100) / 100;
        
        // Calculate playoff odds based on current standing
        const totalTeams = leagueTeams.length;
        const playoffSpots = Math.max(4, Math.floor(totalTeams / 2));
        const playoffOdds = Math.max(5, Math.min(95, 100 - (index * (90 / totalTeams))));
        
        // Determine trend based on recent performance
        const previousRank = team.previousRank || index + 1;
        const currentRank = index + 1;
        const trend = currentRank < previousRank ? &apos;up&apos; : currentRank > previousRank ? &apos;down&apos; : &apos;stable&apos;;
        
        return {
}
          teamId: team.id,
          teamName: team.name,
          ownerName: team.owner?.name || team.owner?.displayName || &apos;Unknown Owner&apos;,
          currentRank,
          previousRank,
          record: teamRecord,
          pointsFor: Math.round(teamStats.pointsFor * 100) / 100,
          pointsAgainst: Math.round(teamStats.pointsAgainst * 100) / 100,
          powerScore,
          strengthOfSchedule: team.strengthOfSchedule || 0.50,
          projectedRecord: {
}
            wins: Math.round(teamRecord.wins + (14 - week) * winPercentage),
            losses: Math.round(teamRecord.losses + (14 - week) * (1 - winPercentage))
          },
          playoffOdds: Math.round(playoffOdds),
          championshipOdds: Math.round(Math.max(1, playoffOdds / 3)),
          trend,
          trendStrength: Math.abs(currentRank - previousRank) + 1,
          keyStats: {
}
            avgPointsFor: Math.round(avgPointsFor * 100) / 100,
            avgPointsAgainst: Math.round(avgPointsAgainst * 100) / 100,
            consistencyScore: team.consistency || 75,
            luckFactor: team.luckFactor || 0
          },
          analysis: {
}
            strengths: team.strengths || [&apos;Solid roster construction&apos;, &apos;Active management&apos;],
            weaknesses: team.weaknesses || [&apos;Room for improvement&apos;],
            recommendation: currentRank <= playoffSpots / 2 ? &apos;Stay the course, make minor tweaks&apos; : 
                           currentRank <= playoffSpots ? &apos;Active on waiver wire, consider trades&apos; : 
                           &apos;Major roster overhaul needed&apos;,
            outlook: currentRank <= 2 ? &apos;hot&apos; : currentRank <= 5 ? &apos;warming&apos; : currentRank <= 8 ? &apos;cooling&apos; : &apos;cold&apos;
          },
          nextWeekMatchup: {
}
            opponent: team.nextOpponent?.name || &apos;TBD&apos;,
            difficulty: &apos;medium&apos; as const,
            winProbability: Math.round((winPercentage * 70 + 15) * 100) / 100

        };
      });
      
      // Sort by power score and update rankings
      return rankings
        .sort((a, b) => b.powerScore - a.powerScore)
        .map((team, index) => ({ ...team, currentRank: index + 1 }));
    
    } catch (error) {
}
      console.error(&apos;Error generating power rankings:&apos;, error);
      return [];

  };

  const [rankings, setRankings] = useState<TeamRanking[]>([]);
  
  // Load real rankings when component mounts or teams change
  useEffect(() => {
}
    const realRankings = generateRealRankings();
    setRankings(realRankings);
  }, [teams, week]);

  const getTrendIcon = (trend: TeamRanking[&apos;trend&apos;], strength: number) => {
}
    const iconClass = `w-5 h-5 ${strength > 2 ? &apos;animate-pulse&apos; : &apos;&apos;}`;
    
    switch (trend) {
}
      case &apos;up&apos;:
        return <TrendingUp className={`${iconClass} text-green-400`} />;
      case &apos;down&apos;:
        return <TrendingDown className={`${iconClass} text-red-400`} />;
      default:
        return <Minus className={`${iconClass} text-gray-400`} />;

  };

  const getOutlookColor = (outlook: TeamRanking[&apos;analysis&apos;][&apos;outlook&apos;]) => {
}
    switch (outlook) {
}
      case &apos;hot&apos;: return &apos;text-red-400 bg-red-500/20&apos;;
      case &apos;warming&apos;: return &apos;text-orange-400 bg-orange-500/20&apos;;
      case &apos;cooling&apos;: return &apos;text-blue-400 bg-blue-500/20&apos;;
      case &apos;cold&apos;: return &apos;text-gray-400 bg-gray-500/20&apos;;

  };

  const getDifficultyColor = (difficulty: string) => {
}
    switch (difficulty) {
}
      case &apos;easy&apos;: return &apos;text-green-400&apos;;
      case &apos;medium&apos;: return &apos;text-yellow-400&apos;;
      case &apos;hard&apos;: return &apos;text-red-400&apos;;
      default: return &apos;text-gray-400&apos;;

  };

  const generateWeeklyInsight = () => {
}
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
    <div className="bg-dark-800 rounded-xl p-6 border border-gray-700 sm:px-4 md:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
          <Brain className="w-6 h-6 text-purple-400 sm:px-4 md:px-6 lg:px-8" />
          <div>
            <h2 className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">AI Power Rankings</h2>
            <p className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Week {week} • Intelligent Analysis</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value as any)}
          >
            <option value="powerScore">Power Score</option>
            <option value="record">Record</option>
            <option value="pointsFor">Points For</option>
            <option value="playoffOdds">Playoff Odds</option>
          </select>
          
          <button
            onClick={() => setViewMode(viewMode === &apos;compact&apos; ? &apos;detailed&apos; : &apos;compact&apos;)}
          >
            {viewMode === &apos;compact&apos; ? &apos;Detailed&apos; : &apos;Compact&apos;}
          </button>
        </div>
      </div>

      {/* Weekly Insight */}
      <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-2 sm:px-4 md:px-6 lg:px-8">
          <Zap className="w-4 h-4 text-purple-400 sm:px-4 md:px-6 lg:px-8" />
          <span className="text-sm font-semibold text-purple-400 sm:px-4 md:px-6 lg:px-8">AI Weekly Insight</span>
        </div>
        <p className="text-gray-200 text-sm sm:px-4 md:px-6 lg:px-8">{generateWeeklyInsight()}</p>
      </div>

      {/* Rankings List */}
      <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
        {rankings.map((team, index) => (
}
          <motion.div
            key={team.teamId}
//             layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 bg-dark-700 rounded-lg border border-gray-600 hover:border-primary-500/50 transition-all cursor-pointer ${
}
              selectedTeam === team.teamId ? &apos;border-primary-500 bg-primary-500/5&apos; : &apos;&apos;
            }`}
            onClick={() => {
}
              setSelectedTeam(selectedTeam === team.teamId ? null : team.teamId);
              onTeamClick?.(team.teamId);
            }}
          >
            <div className="flex items-center gap-4 sm:px-4 md:px-6 lg:px-8">
              {/* Rank and Trend */}
              <div className="flex items-center gap-2 min-w-[60px] sm:px-4 md:px-6 lg:px-8">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
}
                  index === 0 ? &apos;bg-yellow-500 text-black&apos; :
                  index === 1 ? &apos;bg-gray-400 text-black&apos; :
                  index === 2 ? &apos;bg-amber-600 text-white&apos; :
                  &apos;bg-dark-600 text-white&apos;
                }`}>
                  {index === 0 && <Crown className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />}
                  {index !== 0 && team.currentRank}
                </div>
                {getTrendIcon(team.trend, team.trendStrength)}
              </div>

              {/* Team Info */}
              <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-1 sm:px-4 md:px-6 lg:px-8">
                  <h3 className="font-bold text-white sm:px-4 md:px-6 lg:px-8">{team.teamName}</h3>
                  <div className="flex items-center gap-3 text-sm sm:px-4 md:px-6 lg:px-8">
                    <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Power: {team.powerScore.toFixed(1)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getOutlookColor(team.analysis.outlook)}`}>
                      {team.analysis.outlook.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">
                  <span>{team.ownerName}</span>
                  <div className="flex items-center gap-4 sm:px-4 md:px-6 lg:px-8">
                    <span>{team.record.wins}-{team.record.losses}</span>
                    <span>{team.pointsFor.toFixed(0)} PF</span>
                    <span className="text-green-400 sm:px-4 md:px-6 lg:px-8">{team.playoffOdds.toFixed(0)}% playoffs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed View */}
            <AnimatePresence>
              {selectedTeam === team.teamId && viewMode === &apos;detailed&apos; && (
}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: &apos;auto&apos;, opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 pt-4 border-t border-gray-600 sm:px-4 md:px-6 lg:px-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Stats */}
                    <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                      <h4 className="font-semibold text-white text-sm sm:px-4 md:px-6 lg:px-8">Key Statistics</h4>
                      <div className="space-y-1 text-xs sm:px-4 md:px-6 lg:px-8">
                        <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                          <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Avg Points For:</span>
                          <span className="text-white sm:px-4 md:px-6 lg:px-8">{team.keyStats.avgPointsFor.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                          <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Avg Points Against:</span>
                          <span className="text-white sm:px-4 md:px-6 lg:px-8">{team.keyStats.avgPointsAgainst.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                          <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Consistency Score:</span>
                          <span className="text-white sm:px-4 md:px-6 lg:px-8">{team.keyStats.consistencyScore.toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                          <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Luck Factor:</span>
                          <span className={team.keyStats.luckFactor > 0 ? &apos;text-green-400&apos; : &apos;text-red-400&apos;}>
                            {team.keyStats.luckFactor > 0 ? &apos;+&apos; : &apos;&apos;}{team.keyStats.luckFactor.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Analysis */}
                    <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                      <h4 className="font-semibold text-white text-sm sm:px-4 md:px-6 lg:px-8">AI Analysis</h4>
                      <div className="space-y-2 text-xs sm:px-4 md:px-6 lg:px-8">
                        <div>
                          <span className="text-green-400 sm:px-4 md:px-6 lg:px-8">Strengths:</span>
                          <ul className="text-gray-300 ml-2 sm:px-4 md:px-6 lg:px-8">
                            {team.analysis.strengths.map((strength: any) => (
}
                              <li key={strength}>• {strength}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="text-red-400 sm:px-4 md:px-6 lg:px-8">Weaknesses:</span>
                          <ul className="text-gray-300 ml-2 sm:px-4 md:px-6 lg:px-8">
                            {team.analysis.weaknesses.map((weakness: any) => (
}
                              <li key={weakness}>• {weakness}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="text-blue-400 sm:px-4 md:px-6 lg:px-8">Recommendation:</span>
                          <p className="text-gray-300 ml-2 sm:px-4 md:px-6 lg:px-8">{team.analysis.recommendation}</p>
                        </div>
                      </div>
                    </div>

                    {/* Projections */}
                    <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                      <h4 className="font-semibold text-white text-sm sm:px-4 md:px-6 lg:px-8">Projections</h4>
                      <div className="space-y-1 text-xs sm:px-4 md:px-6 lg:px-8">
                        <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                          <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Projected Record:</span>
                          <span className="text-white sm:px-4 md:px-6 lg:px-8">
                            {team.projectedRecord.wins}-{team.projectedRecord.losses}
                          </span>
                        </div>
                        <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                          <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Championship Odds:</span>
                          <span className="text-yellow-400 sm:px-4 md:px-6 lg:px-8">{team.championshipOdds.toFixed(1)}%</span>
                        </div>
                        <div className="pt-2 sm:px-4 md:px-6 lg:px-8">
                          <div className="flex justify-between items-center mb-1 sm:px-4 md:px-6 lg:px-8">
                            <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Next Week vs {team.nextWeekMatchup.opponent}:</span>
                            <span className={getDifficultyColor(team.nextWeekMatchup.difficulty)}>
                              {team.nextWeekMatchup.difficulty.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                            <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Win Probability:</span>
                            <span className="text-white sm:px-4 md:px-6 lg:px-8">{team.nextWeekMatchup.winProbability.toFixed(0)}%</span>
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
      <div className="mt-6 p-4 bg-dark-700 rounded-lg border border-gray-600 sm:px-4 md:px-6 lg:px-8">
        <h3 className="font-semibold text-white mb-3 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
          <Target className="w-4 h-4 text-primary-400 sm:px-4 md:px-6 lg:px-8" />
          Playoff Picture
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Current Playoff Teams:</span>
            <div className="text-green-400 font-semibold sm:px-4 md:px-6 lg:px-8">
              {rankings.slice(0, 4).map((team: any) => team.teamName.split(&apos; &apos;)[0]).join(&apos;, &apos;)}
            </div>
          </div>
          <div>
            <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">On the Bubble:</span>
            <div className="text-yellow-400 font-semibold sm:px-4 md:px-6 lg:px-8">
              {rankings.slice(4, 6).map((team: any) => team.teamName.split(&apos; &apos;)[0]).join(&apos;, &apos;)}
            </div>
          </div>
          <div>
            <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Long Shots:</span>
            <div className="text-orange-400 font-semibold sm:px-4 md:px-6 lg:px-8">
              {rankings.slice(6, 8).map((team: any) => team.teamName.split(&apos; &apos;)[0]).join(&apos;, &apos;)}
            </div>
          </div>
          <div>
            <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Eliminated:</span>
            <div className="text-red-400 font-semibold sm:px-4 md:px-6 lg:px-8">
              {rankings.slice(8).map((team: any) => team.teamName.split(&apos; &apos;)[0]).join(&apos;, &apos;)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WeeklyPowerRankingsWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <WeeklyPowerRankings {...props} />
  </ErrorBoundary>
);

export default React.memo(WeeklyPowerRankingsWithErrorBoundary);