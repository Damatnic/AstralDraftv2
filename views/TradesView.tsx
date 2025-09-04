/**
 * Enhanced Trades View - Complete trade management interface
 */

import { useAppState } from '../contexts/AppContext';
import { motion } from 'framer-motion';
import TradingSystem from '../components/season/TradingSystem';

const TradesView: React.FC = () => {
  const { state, dispatch } = useAppState();
  const league = state.leagues[0];

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
                <span className="text-2xl">🔄</span>
                Trade Center
              </h1>
              <p className="text-secondary">{league?.name} • Trading Hub</p>
            </div>
            
            <div className="text-right">
              <div className="text-white font-semibold">Trade Deadline</div>
              <div className="text-sm text-orange-400">Week 12</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card text-center"
          >
            <div className="text-2xl font-bold text-white">2</div>
            <div className="text-sm text-slate-400">Pending Trades</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card text-center"
          >
            <div className="text-2xl font-bold text-green-400">0</div>
            <div className="text-sm text-slate-400">Completed</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card text-center"
          >
            <div className="text-2xl font-bold text-blue-400">4</div>
            <div className="text-sm text-slate-400">Trade Block</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card text-center"
          >
            <div className="text-2xl font-bold text-orange-400">6</div>
            <div className="text-sm text-slate-400">Weeks Left</div>
          </motion.div>
        </div>

        {/* Main Trading System */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <TradingSystem />
        </motion.div>

        {/* Trade Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 card"
        >
          <h3 className="text-lg font-bold text-white mb-4">💡 Trading Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-semibold mb-2">Best Practices</h4>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• Look for win-win scenarios</li>
                <li>• Consider playoff schedules</li>
                <li>• Trade from strength to address weaknesses</li>
                <li>• Don&apos;t trade just to trade</li>
                <li>• Include a personal message explaining your reasoning</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Timing Matters</h4>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• Trade deadline is Week 12 (November 15)</li>
                <li>• Best time: Weeks 6-10 when needs are clear</li>
                <li>• Avoid trading right before bye weeks</li>
                <li>• Consider injury reports and news</li>
                <li>• Playoff-bound teams value different players</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TradesView;