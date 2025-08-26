/**
 * Trades View - Trade management interface
 */

import React from 'react';
import { useAppState } from '../contexts/AppContext';
import { motion } from 'framer-motion';

const TradesView: React.FC = () => {
  const { state, dispatch } = useAppState();
  const league = state.leagues[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' })}
            className="mb-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            ← Back to Dashboard
          </button>
          
          <h1 className="text-4xl font-bold text-white mb-2">Trade Center</h1>
          <p className="text-slate-300">Propose and manage trades with other teams</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trade Proposals */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
          >
            <h2 className="text-xl font-bold text-white mb-4">Active Trade Proposals</h2>
            {league.tradeOffers.length === 0 ? (
              <p className="text-slate-400">No active trade proposals</p>
            ) : (
              <div className="space-y-4">
                {league.tradeOffers.map((trade, index) => (
                  <div key={index} className="p-4 bg-slate-700/50 rounded-lg">
                    <p className="text-white">Trade details would go here</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Trade Block */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
          >
            <h2 className="text-xl font-bold text-white mb-4">Trade Block</h2>
            <p className="text-slate-400">Players available for trade from other teams</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Propose New Trade
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TradesView;