/**
 * Enhanced League Standings View
 * Complete standings with playoff scenarios and statistics
 */

import React, { useState, useMemo } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { useAppState } from &apos;../contexts/AppContext&apos;;
import ScheduleGenerator from &apos;../components/season/ScheduleGenerator&apos;;

interface TeamStanding {
}
  team: any;
  wins: number;
  losses: number;
  ties: number;
  pointsFor: number;
  pointsAgainst: number;
  winPercentage: number;
  playoffPosition: number;
  playoffStatus: &apos;clinched&apos; | &apos;contending&apos; | &apos;eliminated&apos;;

}

const EnhancedLeagueStandingsView: React.FC = () => {
}
  const { state, dispatch } = useAppState();
  const [activeTab, setActiveTab] = useState<&apos;standings&apos; | &apos;schedule&apos; | &apos;playoffs&apos; | &apos;stats&apos;>(&apos;standings&apos;);
  const [currentWeek] = useState(8); // Simulated current week

  const league = state.leagues[0];
  const isCommissioner = state.user?.id === league?.commissionerId;

  // Calculate standings with simulated data
  const standings = useMemo((): TeamStanding[] => {
}
    if (!league?.teams) return [];

    return league.teams.map((team, index) => {
}
      // Simulate season progress with realistic records
      const simulatedWins = Math.floor(Math.random() * 6) + 2; // 2-7 wins
      const simulatedLosses = currentWeek - 1 - simulatedWins;
      const simulatedPointsFor = Math.floor(Math.random() * 200) + 800; // 800-1000 points
      const simulatedPointsAgainst = Math.floor(Math.random() * 200) + 750; // 750-950 points
      
      return {
}
        team,
        wins: simulatedWins,
        losses: Math.max(0, simulatedLosses),
        ties: 0,
        pointsFor: simulatedPointsFor,
        pointsAgainst: simulatedPointsAgainst,
        winPercentage: simulatedWins / (simulatedWins + Math.max(0, simulatedLosses)),
        playoffPosition: index + 1,
        playoffStatus: index < 6 ? &apos;contending&apos; : &apos;eliminated&apos;
      };
    }).sort((a, b) => {
}
      // Sort by win percentage, then by points for
      if (b.winPercentage !== a.winPercentage) {
}
        return b.winPercentage - a.winPercentage;
      }

      return b.pointsFor - a.pointsFor;
    }).map((standing, index) => ({
}
      ...standing,
      playoffPosition: index + 1,
      playoffStatus: index < 6 ? (index < 2 ? &apos;clinched&apos; : &apos;contending&apos;) : &apos;eliminated&apos;
    }));
  }, [league?.teams, currentWeek]);

  const tabs = [
    { id: &apos;standings&apos;, label: &apos;Standings&apos;, icon: &apos;📊&apos; },
    { id: &apos;schedule&apos;, label: &apos;Schedule&apos;, icon: &apos;📅&apos; },
    { id: &apos;playoffs&apos;, label: &apos;Playoff Picture&apos;, icon: &apos;🏆&apos; },
    { id: &apos;stats&apos;, label: &apos;League Stats&apos;, icon: &apos;📈&apos; }
  ];

  const getPlayoffStatusColor = (status: string) => {
}
    switch (status) {
}
      case &apos;clinched&apos;: return &apos;text-green-400&apos;;
      case &apos;contending&apos;: return &apos;text-yellow-400&apos;;
      case &apos;eliminated&apos;: return &apos;text-red-400&apos;;
      default: return &apos;text-slate-400&apos;;

  }

  const getPlayoffStatusText = (status: string, position: number) => {
}
    switch (status) {
}
      case &apos;clinched&apos;: return position <= 2 ? &apos;Playoff Bye&apos; : &apos;Clinched Playoff&apos;;
      case &apos;contending&apos;: return &apos;In Hunt&apos;;
      case &apos;eliminated&apos;: return &apos;Eliminated&apos;;
      default: return &apos;&apos;;

  }

  const renderTabContent = () => {
}
    switch (activeTab) {
}
      case &apos;standings&apos;:
        return (
          <div className="space-y-6">
            {/* Current Week Info */}
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Week {currentWeek} Standings</h3>
                  <p className="text-slate-400">Regular season through week {currentWeek - 1}</p>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">{17 - currentWeek} weeks</div>
                  <div className="text-sm text-slate-400">Remaining</div>
                </div>
              </div>
            </div>

            {/* Standings Table */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="text-left p-4 text-slate-300 font-semibold">Rank</th>
                      <th className="text-left p-4 text-slate-300 font-semibold">Team</th>
                      <th className="text-center p-4 text-slate-300 font-semibold">Record</th>
                      <th className="text-center p-4 text-slate-300 font-semibold">Win %</th>
                      <th className="text-center p-4 text-slate-300 font-semibold">PF</th>
                      <th className="text-center p-4 text-slate-300 font-semibold">PA</th>
                      <th className="text-center p-4 text-slate-300 font-semibold">Diff</th>
                      <th className="text-center p-4 text-slate-300 font-semibold">Playoff Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((standing, index) => (
}
                      <motion.tr
                        key={standing.team.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`border-t border-slate-600 hover:bg-slate-700/30 transition-colors ${
}
                          standing.playoffPosition <= 6 ? &apos;bg-blue-900/10&apos; : &apos;&apos;
                        }`}
                      >
                        <td className="p-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
}
                            standing.playoffPosition <= 2 
                              ? &apos;bg-green-600 text-white&apos; 
                              : standing.playoffPosition <= 6 
                              ? &apos;bg-blue-600 text-white&apos; 
                              : &apos;bg-slate-600 text-slate-300&apos;
                          }`}>
                            {standing.playoffPosition}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{standing.team.avatar}</span>
                            <div>
                              <div className="text-white font-semibold">{standing.team.name}</div>
                              <div className="text-sm text-slate-400">{standing.team.owner.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-white font-semibold">
                            {standing.wins}-{standing.losses}
                            {standing.ties > 0 && `-${standing.ties}`}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-white">
                            {(standing.winPercentage * 100).toFixed(1)}%
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-white">{standing.pointsFor.toLocaleString()}</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-white">{standing.pointsAgainst.toLocaleString()}</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`font-semibold ${
}
                            standing.pointsFor - standing.pointsAgainst > 0 
                              ? &apos;text-green-400&apos; 
                              : &apos;text-red-400&apos;
                          }`}>
                            {standing.pointsFor - standing.pointsAgainst > 0 ? &apos;+&apos; : &apos;&apos;}
                            {standing.pointsFor - standing.pointsAgainst}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`font-semibold ${getPlayoffStatusColor(standing.playoffStatus)}`}>
                            {getPlayoffStatusText(standing.playoffStatus, standing.playoffPosition)}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Playoff Line */}
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <h4 className="font-semibold text-white mb-3">Playoff Format</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-600 rounded"></div>
                  <span className="text-slate-300">Top 2 teams get first-round bye</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  <span className="text-slate-300">Teams 3-6 make playoffs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-slate-600 rounded"></div>
                  <span className="text-slate-300">Teams 7-10 eliminated</span>
                </div>
              </div>
            </div>
          </div>
        );

      case &apos;schedule&apos;:
        return (
          <ScheduleGenerator>
            isCommissioner={isCommissioner}
            onScheduleGenerated={(schedule: any) => {
}
            }}
          />
        );

      case &apos;playoffs&apos;:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Playoff Picture</h3>
              <p className="text-slate-400">Current playoff seeding</p>
            </div>

            {/* Playoff Bracket Preview */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h4 className="font-semibold text-white mb-4">Current Playoff Seeding</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Round Byes */}
                <div>
                  <h5 className="text-green-400 font-semibold mb-3">🏆 First Round Bye</h5>
                  <div className="space-y-2">
                    {standings.slice(0, 2).map((standing, index) => (
}
                      <div key={standing.team.id} className="flex items-center gap-3 p-3 bg-green-900/20 rounded-lg border border-green-600/30">
                        <span className="w-6 h-6 bg-green-600 text-white text-sm font-bold rounded flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="text-lg">{standing.team.avatar}</span>
                        <div>
                          <div className="text-white font-semibold">{standing.team.name}</div>
                          <div className="text-sm text-green-400">
                            {standing.wins}-{standing.losses} ({(standing.winPercentage * 100).toFixed(1)}%)
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Wild Card Teams */}
                <div>
                  <h5 className="text-blue-400 font-semibold mb-3">🏈 Wild Card Round</h5>
                  <div className="space-y-2">
                    {standings.slice(2, 6).map((standing, index) => (
}
                      <div key={standing.team.id} className="flex items-center gap-3 p-3 bg-blue-900/20 rounded-lg border border-blue-600/30">
                        <span className="w-6 h-6 bg-blue-600 text-white text-sm font-bold rounded flex items-center justify-center">
                          {index + 3}
                        </span>
                        <span className="text-lg">{standing.team.avatar}</span>
                        <div>
                          <div className="text-white font-semibold">{standing.team.name}</div>
                          <div className="text-sm text-blue-400">
                            {standing.wins}-{standing.losses} ({(standing.winPercentage * 100).toFixed(1)}%)
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Playoff Schedule */}
              <div className="mt-6 pt-6 border-t border-slate-600">
                <h5 className="font-semibold text-white mb-3">Playoff Schedule</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                    <div className="text-white font-semibold">Week 15</div>
                    <div className="text-slate-400">Wild Card Round</div>
                    <div className="text-xs text-slate-500 mt-1">3v6, 4v5</div>
                  </div>
                  <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                    <div className="text-white font-semibold">Week 16</div>
                    <div className="text-slate-400">Semifinals</div>
                    <div className="text-xs text-slate-500 mt-1">1v6, 2v5 winners</div>
                  </div>
                  <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                    <div className="text-white font-semibold">Week 17</div>
                    <div className="text-yellow-400">Championship</div>
                    <div className="text-xs text-slate-500 mt-1">Semifinal winners</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case &apos;stats&apos;:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">League Statistics</h3>
              <p className="text-slate-400">Through week {currentWeek - 1}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Highest Scoring Team */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h4 className="font-semibold text-white mb-2">🔥 Highest Scoring</h4>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{standings[0]?.team.avatar}</span>
                  <div>
                    <div className="text-white font-semibold">{standings[0]?.team.name}</div>
                    <div className="text-sm text-green-400">{standings[0]?.pointsFor} points</div>
                  </div>
                </div>
              </div>

              {/* Best Record */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h4 className="font-semibold text-white mb-2">👑 Best Record</h4>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{standings[0]?.team.avatar}</span>
                  <div>
                    <div className="text-white font-semibold">{standings[0]?.team.name}</div>
                    <div className="text-sm text-green-400">
                      {standings[0]?.wins}-{standings[0]?.losses}
                    </div>
                  </div>
                </div>
              </div>

              {/* Most Points Against */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h4 className="font-semibold text-white mb-2">😤 Unluckiest</h4>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{standings[standings.length - 1]?.team.avatar}</span>
                  <div>
                    <div className="text-white font-semibold">{standings[standings.length - 1]?.team.name}</div>
                    <div className="text-sm text-red-400">{standings[standings.length - 1]?.pointsAgainst} PA</div>
                  </div>
                </div>
              </div>

              {/* League Average */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h4 className="font-semibold text-white mb-2">📊 League Average</h4>
                <div>
                  <div className="text-white font-semibold">
                    {Math.round(standings.reduce((sum, s) => sum + s.pointsFor, 0) / standings.length)} PPG
                  </div>
                  <div className="text-sm text-slate-400">Points per game</div>
                </div>
              </div>
            </div>

            {/* Weekly High Scores */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h4 className="font-semibold text-white mb-4">🏆 Weekly High Scores</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: Math.min(6, currentWeek - 1) }, (_, i) => {
}
                  const week = i + 1;
                  const randomTeam = standings[Math.floor(Math.random() * standings.length)];
                  const randomScore = Math.floor(Math.random() * 50) + 120; // 120-170 points
                  
                  return (
                    <div key={week} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-400">Week {week}</span>
                        <span className="text-lg">{randomTeam.team.avatar}</span>
                        <span className="text-white font-medium">{randomTeam.team.name}</span>
                      </div>
                      <span className="text-green-400 font-bold">{randomScore}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;DASHBOARD&apos; })}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              ← Back to Dashboard
            </button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl">📊</span>
                League Standings
              </h1>
              <p className="text-slate-400">{league?.name} • Week {currentWeek}</p>
            </div>
            
            <div className="text-right">
              <div className="text-white font-semibold">Season</div>
              <div className="text-sm text-blue-400">In Progress</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-slate-800/50 rounded-lg p-1 overflow-x-auto">
            {tabs.map((tab: any) => (
}
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
}
                  activeTab === tab.id
                    ? &apos;bg-primary-600 text-white&apos;
                    : &apos;text-gray-300 hover:text-white hover:bg-slate-700&apos;
                }`}
              >
                <span>{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

}

}

export default EnhancedLeagueStandingsView;