/**
 * Simplified Modern Dashboard View
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../contexts/AppContext';

const ModernDashboardView: React.FC = () => {
  const { state, dispatch } = useAppState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, <span className="text-blue-400">{state.user?.name || 'Champion'}</span>! 👑
          </h1>
          <p className="text-slate-300 text-lg">
            Your AI-powered fantasy football command center
          </p>
        </motion.div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <span className="text-2xl">🏆</span>
              </div>
              <span className="text-green-400 text-sm font-medium">+12%</span>
            </div>
            <h3 className="text-2xl font-bold text-white">1,842</h3>
            <p className="text-slate-400">Total Points</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <span className="text-2xl">📈</span>
              </div>
              <span className="text-green-400 text-sm font-medium">+5%</span>
            </div>
            <h3 className="text-2xl font-bold text-white">78.5%</h3>
            <p className="text-slate-400">Win Rate</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white">4</h3>
            <p className="text-slate-400">Active Leagues</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <span className="text-green-400 text-sm font-medium">+8%</span>
            </div>
            <h3 className="text-2xl font-bold text-white">A+</h3>
            <p className="text-slate-400">Trade Grade</p>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Top Players */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>⭐</span>
                Top Performers This Week
              </h3>
              
              <div className="space-y-4">
                {[
                  { name: 'Josh Allen', pos: 'QB', team: 'BUF', points: 32.8, status: '🟢' },
                  { name: 'Tyreek Hill', pos: 'WR', team: 'MIA', points: 28.4, status: '🟢' },
                  { name: 'Christian McCaffrey', pos: 'RB', team: 'SF', points: 24.2, status: '🟡' }
                ].map((player, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {player.pos}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{player.name}</h4>
                        <p className="text-slate-400 text-sm">{player.team}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-white">{player.points}</span>
                        <span>{player.status}</span>
                      </div>
                      <p className="text-slate-400 text-sm">pts</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - AI Insights & Quick Actions */}
          <div className="space-y-6">
            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>🧠</span>
                AI Insights
              </h3>
              
              <div className="space-y-3">
                {[
                  { type: '💱', message: 'Consider trading Patrick Mahomes - peak value', confidence: 92 },
                  { type: '⚠️', message: 'Monitor: Cooper Kupp limited in practice', confidence: 78 },
                  { type: '📈', message: 'Waiver Alert: Tank Bigsby trending up', confidence: 85 }
                ].map((insight, i) => (
                  <div key={i} className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-lg">{insight.type}</span>
                      <div className="flex-1">
                        <p className="text-sm text-white">{insight.message}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex-1 h-1 bg-slate-600 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                              style={{ width: `${insight.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-400">{insight.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600"
            >
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'TEAM_HUB' })}
                  className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <span>⚡</span>
                  Set Lineup
                </button>
                <button 
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'LEAGUE_HUB' })}
                  className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <span>🔍</span>
                  Waivers
                </button>
                <button className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2">
                  <span>🔄</span>
                  Trade
                </button>
                <button className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2">
                  <span>💬</span>
                  Chat
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboardView;