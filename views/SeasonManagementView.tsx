/**
 * Season Management View
 * Central hub for all season-long activities: matchups, scoring, waivers
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../contexts/AppContext';
import WeeklyMatchups from '../components/season/WeeklyMatchups';
import LiveScoring from '../components/season/LiveScoring';
import EnhancedWaiverWire from '../components/season/EnhancedWaiverWire';

const SeasonManagementView: React.FC = () => {
  const { state, dispatch } = useAppState();
  const [activeTab, setActiveTab] = useState<'matchups' | 'scoring' | 'waivers' | 'standings'>('matchups');
  const [currentWeek] = useState(8); // Simulated current week

  const league = state.leagues[0];
  const currentUser = state.user;

  const tabs = [
    { id: 'matchups', label: 'Matchups', icon: '⚔️', description: 'Weekly head-to-head matchups' },
    { id: 'scoring', label: 'Live Scoring', icon: '📊', description: 'Real-time player scoring' },
    { id: 'waivers', label: 'Waiver Wire', icon: '🔄', description: 'FAAB bidding system' },
    { id: 'standings', label: 'Standings', icon: '🏆', description: 'League standings & playoffs' }
  ];

  // Quick stats for the dashboard
  const quickStats = {
    currentWeek,
    totalWeeks: 17,
    playoffWeeks: 3,
    regularSeasonWeeks: 14,
    waiverProcessing: 'Tuesday 11:59 PM',
    nextMatchup: 'Sunday 1:00 PM'
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <div className="nav-header">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' })}
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
                {currentWeek <= quickStats.regularSeasonWeeks ? 'Regular Season' : 'Playoffs'}
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
                  {currentWeek <= quickStats.regularSeasonWeeks ? 'Regular Season' : 'Playoffs'}
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
          {activeTab === 'matchups' && (
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

          {activeTab === 'scoring' && (
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

          {activeTab === 'waivers' && (
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

          {activeTab === 'standings' && (
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
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'ENHANCED_LEAGUE_STANDINGS' })}
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
                  {currentWeek <= quickStats.regularSeasonWeeks ? 'In Progress' : 'Complete'}
                </div>
              </div>
              
              <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                <div className="text-white font-semibold">Playoffs</div>
                <div className="text-sm text-slate-400">Weeks 15-17</div>
                <div className="text-xs text-slate-500 mt-1">
                  {currentWeek >= 15 ? 'In Progress' : 'Upcoming'}
                </div>
              </div>
              
              <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                <div className="text-white font-semibold">Championship</div>
                <div className="text-sm text-slate-400">Week 17</div>
                <div className="text-xs text-slate-500 mt-1">
                  {currentWeek === 17 ? 'This Week!' : currentWeek > 17 ? 'Complete' : 'Upcoming'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'TEAM_HUB' })}
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
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'PLAYERS' })}
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
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'TRADES' })}
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