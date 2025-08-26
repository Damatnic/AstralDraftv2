/**
 * Enhanced Team Hub View - Complete team management interface
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../contexts/AppContext';
import { getUserTeam, getDaysUntilDraft } from '../data/leagueData';
import RosterManagement from '../components/roster/RosterManagement';

const EnhancedTeamHubView: React.FC = () => {
  const { state, dispatch } = useAppState();
  const [activeTab, setActiveTab] = useState<'roster' | 'lineup' | 'stats' | 'schedule'>('roster');

  const league = state.leagues[0];
  const userTeam = state.user ? getUserTeam(state.user.id) : null;
  const daysUntilDraft = getDaysUntilDraft();

  if (!league || !userTeam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Team Not Found</h2>
          <p className="text-slate-300 mb-6">Unable to load your team information.</p>
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' })}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'roster', label: 'Roster', icon: '👥' },
    { id: 'lineup', label: 'Lineup', icon: '⚡' },
    { id: 'stats', label: 'Stats', icon: '📊' },
    { id: 'schedule', label: 'Schedule', icon: '📅' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'roster':
        return (
          <RosterManagement
            team={userTeam}
            isOwner={true}
            showAddDropButtons={true}
          />
        );
        
      case 'lineup':
        return (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Starting Lineup</h3>
            <p className="text-slate-400">Set your starting lineup for the upcoming week.</p>
            <div className="mt-6 text-center text-slate-500">
              <div className="text-4xl mb-4">⚡</div>
              <p>Lineup management coming soon!</p>
            </div>
          </div>
        );
        
      case 'stats':
        return (
          <div className="space-y-6">
            {/* Team Performance */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">Team Performance</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-white">
                    {userTeam.record.wins}-{userTeam.record.losses}
                  </div>
                  <div className="text-sm text-slate-400">Record</div>
                </div>
                <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-white">
                    {userTeam.roster.reduce((sum, player) => sum + player.projectedPoints, 0).toFixed(0)}
                  </div>
                  <div className="text-sm text-slate-400">Projected Points</div>
                </div>
                <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-white">
                    ${userTeam.faab}
                  </div>
                  <div className="text-sm text-slate-400">FAAB Remaining</div>
                </div>
                <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-white">
                    {userTeam.roster.length}
                  </div>
                  <div className="text-sm text-slate-400">Roster Size</div>
                </div>
              </div>
            </div>

            {/* Position Breakdown */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">Position Breakdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['QB', 'RB', 'WR', 'TE'].map(position => {
                  const positionPlayers = userTeam.roster.filter(p => p.position === position);
                  const avgRank = positionPlayers.length > 0 
                    ? positionPlayers.reduce((sum, p) => sum + p.fantasyRank, 0) / positionPlayers.length 
                    : 0;
                  
                  return (
                    <div key={position} className="text-center p-4 bg-slate-700/50 rounded-lg">
                      <div className="text-lg font-bold text-white">
                        {positionPlayers.length}
                      </div>
                      <div className="text-sm text-slate-400 mb-1">{position}s</div>
                      {avgRank > 0 && (
                        <div className="text-xs text-slate-500">
                          Avg Rank: #{avgRank.toFixed(0)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
        
      case 'schedule':
        return (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Schedule</h3>
            <p className="text-slate-400">View your upcoming matchups and season schedule.</p>
            <div className="mt-6 text-center text-slate-500">
              <div className="text-4xl mb-4">📅</div>
              <p>Schedule view coming soon!</p>
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
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' })}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              ← Back to Dashboard
            </button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl">{userTeam.avatar}</span>
                {userTeam.name}
              </h1>
              <p className="text-slate-400">Managed by {userTeam.owner.name}</p>
            </div>
            
            <div className="text-right">
              <div className="text-white font-semibold">
                {userTeam.record.wins}-{userTeam.record.losses}
              </div>
              <div className="text-sm text-slate-400">Record</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Draft Countdown (if pre-draft) */}
        {league.status === 'PRE_DRAFT' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-4 mb-6 text-white text-center"
          >
            <h2 className="text-lg font-bold mb-2">🏈 Draft in {daysUntilDraft} days!</h2>
            <p className="text-sm opacity-90">August 31, 2025 at 7:00 PM</p>
          </motion.div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-slate-800/50 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
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

export default EnhancedTeamHubView;