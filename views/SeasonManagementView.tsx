/**
 * Season Management View
 * Central hub for all season-long activities: matchups, scoring, waivers
 */

import React, { useState } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { useAppState } from &apos;../contexts/AppContext&apos;;
import WeeklyMatchups from &apos;../components/season/WeeklyMatchups&apos;;
import LiveScoring from &apos;../components/season/LiveScoring&apos;;
import EnhancedWaiverWire from &apos;../components/season/EnhancedWaiverWire&apos;;

const SeasonManagementView: React.FC = () => {
}
  const { state, dispatch } = useAppState();
  const [activeTab, setActiveTab] = useState<&apos;matchups&apos; | &apos;scoring&apos; | &apos;waivers&apos; | &apos;standings&apos;>(&apos;matchups&apos;);
  const [currentWeek] = useState(8); // Simulated current week

  const league = state.leagues[0];
  const currentUser = state.user;

  const tabs = [
    { id: &apos;matchups&apos;, label: &apos;Matchups&apos;, icon: &apos;⚔️&apos;, description: &apos;Weekly head-to-head matchups&apos; },
    { id: &apos;scoring&apos;, label: &apos;Live Scoring&apos;, icon: &apos;📊&apos;, description: &apos;Real-time player scoring&apos; },
    { id: &apos;waivers&apos;, label: &apos;Waiver Wire&apos;, icon: &apos;🔄&apos;, description: &apos;FAAB bidding system&apos; },
    { id: &apos;standings&apos;, label: &apos;Standings&apos;, icon: &apos;🏆&apos;, description: &apos;League standings & playoffs&apos; }
  ];

  // Quick stats for the dashboard
  const quickStats = {
}
    currentWeek,
    totalWeeks: 17,
    playoffWeeks: 3,
    regularSeasonWeeks: 14,
    waiverProcessing: &apos;Tuesday 11:59 PM&apos;,
    nextMatchup: &apos;Sunday 1:00 PM&apos;
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <div className="nav-header">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;DASHBOARD&apos; })}
              className="back-btn"
            >
              ← Back to Dashboard
            </button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl">🏈</span>
                Season Management
              </h1>
              <p className="text-secondary">{league?.name} • Week {currentWeek} of {quickStats.totalWeeks}</p>
            </div>
            
            <div className="text-right">
              <div className="text-white font-semibold">
                {currentWeek <= quickStats.regularSeasonWeeks ? &apos;Regular Season&apos; : &apos;Playoffs&apos;}
              </div>
              <div className="text-sm text-blue-400">
                {quickStats.totalWeeks - currentWeek + 1} weeks remaining
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Season Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">{currentWeek}</span>
              </div>
              <div>
                <div className="text-white font-semibold">Current Week</div>
                <div className="text-sm text-secondary">
                  {currentWeek <= quickStats.regularSeasonWeeks ? &apos;Regular Season&apos; : &apos;Playoffs&apos;}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">⚔️</span>
              </div>
              <div>
                <div className="text-white font-semibold">Next Matchup</div>
                <div className="text-sm text-secondary">{quickStats.nextMatchup}</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🔄</span>
              </div>
              <div>
                <div className="text-white font-semibold">Waivers Process</div>
                <div className="text-sm text-secondary">{quickStats.waiverProcessing}</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🏆</span>
              </div>
              <div>
                <div className="text-white font-semibold">Playoff Weeks</div>
                <div className="text-sm text-secondary">Weeks 15-17</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 bg-slate-800/50 rounded-lg p-2">
            {tabs.map((tab: any) => (
}
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
              >
                <span className="text-2xl">{tab.icon}</span>
                <div className="text-center">
                  <div className="font-medium">{tab.label}</div>
                  <div className="text-xs opacity-75">{tab.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === &apos;matchups&apos; && (
}
            <motion.div
              key="matchups"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <WeeklyMatchups selectedWeek={currentWeek} />
            </motion.div>
          )}

          {activeTab === &apos;scoring&apos; && (
}
            <motion.div
              key="scoring"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <LiveScoring showProjections={true} />
            </motion.div>
          )}

          {activeTab === &apos;waivers&apos; && (
}
            <motion.div
              key="waivers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <EnhancedWaiverWire />
            </motion.div>
          )}

          {activeTab === &apos;standings&apos; && (
}
            <motion.div
              key="standings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-center py-8">
                <h3 className="text-xl font-bold text-white mb-4">League Standings</h3>
                <p className="text-slate-400 mb-6">
                  View detailed standings, playoff picture, and league statistics
                </p>
                <button
                  onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;ENHANCED_LEAGUE_STANDINGS&apos; })}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  View Full Standings
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Season Progress */}
        <div className="mt-8 bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4">Season Progress</h3>
          
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="relative">
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${(currentWeek / quickStats.totalWeeks) * 100}%` }}
                ></div>
              </div>
              
              {/* Week Markers */}
              <div className="flex justify-between mt-2 text-xs text-slate-400">
                <span>Week 1</span>
                <span>Week {quickStats.regularSeasonWeeks}</span>
                <span>Playoffs</span>
                <span>Week {quickStats.totalWeeks}</span>
              </div>
            </div>

            {/* Key Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                <div className="text-white font-semibold">Regular Season</div>
                <div className="text-sm text-slate-400">Weeks 1-{quickStats.regularSeasonWeeks}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {currentWeek <= quickStats.regularSeasonWeeks ? &apos;In Progress&apos; : &apos;Complete&apos;}
                </div>
              </div>
              
              <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                <div className="text-white font-semibold">Playoffs</div>
                <div className="text-sm text-slate-400">Weeks 15-17</div>
                <div className="text-xs text-slate-500 mt-1">
                  {currentWeek >= 15 ? &apos;In Progress&apos; : &apos;Upcoming&apos;}
                </div>
              </div>
              
              <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                <div className="text-white font-semibold">Championship</div>
                <div className="text-sm text-slate-400">Week 17</div>
                <div className="text-xs text-slate-500 mt-1">
                  {currentWeek === 17 ? &apos;This Week!&apos; : currentWeek > 17 ? &apos;Complete&apos; : &apos;Upcoming&apos;}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;TEAM_HUB&apos; })}
            className="p-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-slate-600 rounded-lg transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">👥</span>
              <div>
                <div className="text-white font-semibold">Manage Team</div>
                <div className="text-sm text-slate-400">Set lineup, view roster</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;PLAYERS&apos; })}
            className="p-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-slate-600 rounded-lg transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔍</span>
              <div>
                <div className="text-white font-semibold">Player Research</div>
                <div className="text-sm text-slate-400">Stats, projections, news</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;TRADES&apos; })}
            className="p-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-slate-600 rounded-lg transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔄</span>
              <div>
                <div className="text-white font-semibold">Trade Center</div>
                <div className="text-sm text-slate-400">Propose and review trades</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeasonManagementView;