/**
 * Enhanced Commissioner Tools View
 * Complete administrative interface for league commissioners
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../contexts/AppContext';
import CommissionerTools from '../components/commissioner/CommissionerTools';

const EnhancedCommissionerToolsView: React.FC = () => {
  const { state, dispatch } = useAppState();

  const league = state.leagues[0];
  const isCommissioner = state.user?.id === league?.commissionerId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-secondary)]/5">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' }}
              className="glass-button"
            >
              ← Back to Dashboard
            </button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl">👑</span>
                Commissioner Tools
              </h1>
              <p className="text-slate-400">{league?.name}</p>
            </div>
            
            <div className="text-right">
              <div className="text-white font-semibold">{state.user?.name}</div>
              <div className="text-sm text-yellow-400">Commissioner</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!isCommissioner ? (
          /* Access Denied */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 text-center">
              <div className="text-6xl mb-6">🔒</div>
              <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
              <p className="text-slate-400 mb-6">
                You must be the league commissioner to access these administrative tools.
              </p>
              <div className="space-y-2 text-sm text-slate-500">
                <p>Current Commissioner: Nick Damato</p>
                <p>Your Role: League Member</p>
              </div>
              <button
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' }}
                className="glass-button-primary mt-6 px-6 py-3"
              >
                Return to Dashboard
              </button>
            </div>
          </motion.div>
        ) : (
          /* Commissioner Tools */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CommissionerTools isCommissioner={true} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EnhancedCommissionerToolsView;