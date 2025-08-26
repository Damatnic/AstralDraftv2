/**
 * Simplified Modern Dashboard View
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../contexts/AppContext';

const ModernDashboardView: React.FC = () => {
  const { state, dispatch } = useAppState();

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <div className="nav-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Welcome back, <span className="text-blue-400">{state.user?.name || 'Champion'}</span>! 👑</h1>
            <p className="page-subtitle">Your AI-powered fantasy football command center</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <span className="text-2xl">🏆</span>
              </div>
              <span className="text-green-400 text-sm font-medium">+12%</span>
            </div>
            <h3 className="text-2xl font-bold text-white">1,842</h3>
            <p className="text-secondary">Total Points</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <span className="text-2xl">📈</span>
              </div>
              <span className="text-green-400 text-sm font-medium">+5%</span>
            </div>
            <h3 className="text-2xl font-bold text-white">78.5%</h3>
            <p className="text-secondary">Win Rate</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white">4</h3>
            <p className="text-secondary">Active Leagues</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <span className="text-green-400 text-sm font-medium">+8%</span>
            </div>
            <h3 className="text-2xl font-bold text-white">A+</h3>
            <p className="text-secondary">Trade Grade</p>
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
              className="card"
            >
              <h3 className="card-title flex items-center gap-2">
                <span>⭐</span>
                Top Performers This Week
              </h3>
              
              <div className="space-y-4">
                {[
                  { name: 'Josh Allen', pos: 'QB', team: 'BUF', points: 32.8, status: '🟢' },
                  { name: 'Tyreek Hill', pos: 'WR', team: 'MIA', points: 28.4, status: '🟢' },
                  { name: 'Christian McCaffrey', pos: 'RB', team: 'SF', points: 24.2, status: '🟡' }
                ].map((player, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="position-badge">{player.pos}</div>
                      <div>
                        <h4 className="font-semibold text-white">{player.name}</h4>
                        <p className="text-secondary text-sm">{player.team}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-white">{player.points}</span>
                        <span>{player.status}</span>
                      </div>
                      <p className="text-secondary text-sm">pts</p>
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
              className="card"
            >
              <h3 className="card-title flex items-center gap-2">
                <span>🧠</span>
                AI Insights
              </h3>
              
              <div className="space-y-3">
                {[
                  { type: '💱', message: 'Consider trading Patrick Mahomes - peak value', confidence: 92 },
                  { type: '⚠️', message: 'Monitor: Cooper Kupp limited in practice', confidence: 78 },
                  { type: '📈', message: 'Waiver Alert: Tank Bigsby trending up', confidence: 85 }
                ].map((insight, i) => (
                  <div key={i} className="p-3 bg-slate-700/30 rounded-lg">
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
                          <span className="text-xs text-secondary">{insight.confidence}%</span>
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
              className="card"
            >
              <h3 className="card-title">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'TEAM_HUB' })}
                  className="btn btn-primary flex items-center justify-center gap-2"
                >
                  <span>⚡</span>
                  Set Lineup
                </button>
                <button 
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'LEAGUE_HUB' })}
                  className="btn btn-secondary flex items-center justify-center gap-2"
                >
                  <span>🔍</span>
                  Waivers
                </button>
                <button className="btn btn-secondary flex items-center justify-center gap-2">
                  <span>🔄</span>
                  Trade
                </button>
                <button className="btn btn-secondary flex items-center justify-center gap-2">
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