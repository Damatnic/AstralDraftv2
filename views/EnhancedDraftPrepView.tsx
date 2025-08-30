/**
 * Enhanced Draft Prep Center View
 * Complete draft preparation interface
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../contexts/AppContext';
import { getDaysUntilNextWeek, SEASON_DATES_2025 } from '../data/leagueData';
import DraftOrder from '../components/draft/DraftOrder';
import PlayerSearch from '../components/players/PlayerSearch';
import { getTopPlayersByPosition, DRAFT_TIERS } from '../data/nflPlayers';

const EnhancedDraftPrepView: React.FC = () => {
  const { state, dispatch } = useAppState();
  const [activeTab, setActiveTab] = useState<'order' | 'rankings' | 'tiers' | 'strategy' | 'mock'>('order');

  const league = state.leagues[0];
  const isCommissioner = state.user?.id === league?.commissionerId;
  const daysUntilNextWeek = getDaysUntilNextWeek();
  const draftDate = SEASON_DATES_2025.draftDate;

  const tabs = [
    { id: 'order', label: 'Draft Order', icon: '📋' },
    { id: 'rankings', label: 'Player Rankings', icon: '📊' },
    { id: 'tiers', label: 'Draft Tiers', icon: '🎯' },
    { id: 'strategy', label: 'Strategy Guide', icon: '🧠' },
    { id: 'mock', label: 'Mock Draft', icon: '🎮' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'order':
        return (
          <DraftOrder 
            showRandomizeButton={true}
            isCommissioner={isCommissioner}
          />
        );

      case 'rankings':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Player Rankings</h3>
              <p className="text-slate-400">Top players by position for 2024 season</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top QBs */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-600 rounded"></div>
                  Top Quarterbacks
                </h4>
                <div className="space-y-2">
                  {getTopPlayersByPosition('QB', 5).map((player, index) => (
                    <div key={player.id} className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-red-600 text-white text-xs font-bold rounded flex items-center justify-center">
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-white font-medium">{player.name}</p>
                          <p className="text-xs text-slate-400">{player.team}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">#{player.fantasyRank}</p>
                        <p className="text-xs text-slate-400">{player.projectedPoints.toFixed(0)} pts</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top RBs */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-600 rounded"></div>
                  Top Running Backs
                </h4>
                <div className="space-y-2">
                  {getTopPlayersByPosition('RB', 5).map((player, index) => (
                    <div key={player.id} className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-green-600 text-white text-xs font-bold rounded flex items-center justify-center">
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-white font-medium">{player.name}</p>
                          <p className="text-xs text-slate-400">{player.team}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">#{player.fantasyRank}</p>
                        <p className="text-xs text-slate-400">{player.projectedPoints.toFixed(0)} pts</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top WRs */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  Top Wide Receivers
                </h4>
                <div className="space-y-2">
                  {getTopPlayersByPosition('WR', 5).map((player, index) => (
                    <div key={player.id} className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded flex items-center justify-center">
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-white font-medium">{player.name}</p>
                          <p className="text-xs text-slate-400">{player.team}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">#{player.fantasyRank}</p>
                        <p className="text-xs text-slate-400">{player.projectedPoints.toFixed(0)} pts</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top TEs */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-600 rounded"></div>
                  Top Tight Ends
                </h4>
                <div className="space-y-2">
                  {getTopPlayersByPosition('TE', 5).map((player, index) => (
                    <div key={player.id} className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-yellow-600 text-white text-xs font-bold rounded flex items-center justify-center">
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-white font-medium">{player.name}</p>
                          <p className="text-xs text-slate-400">{player.team}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">#{player.fantasyRank}</p>
                        <p className="text-xs text-slate-400">{player.projectedPoints.toFixed(0)} pts</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'tiers':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Draft Tiers</h3>
              <p className="text-slate-400">Players grouped by talent tiers</p>
            </div>

            <div className="space-y-6">
              {Object.entries(DRAFT_TIERS).map(([position, tiers]) => (
                <div key={position} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <h4 className="font-semibold text-white mb-4">{position} Tiers</h4>
                  <div className="space-y-4">
                    {tiers.map((tier, tierIndex) => (
                      <div key={tierIndex} className="border border-slate-600 rounded-lg p-3">
                        <h5 className="text-sm font-semibold text-slate-300 mb-2">
                          Tier {tier.tier} ({tier.players.length} players)
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {tier.players.map((playerId: any) => {
                            const player = league.allPlayers.find((p: any) => p.id === playerId);
                            return player ? (
                              <span
                                key={playerId}
                                className="px-2 py-1 bg-slate-700 text-white text-xs rounded"
                              >
                                {player.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'strategy':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Draft Strategy Guide</h3>
              <p className="text-slate-400">Tips and strategies for draft success</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Early Round Strategy */}
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  🎯 Early Rounds (1-4)
                </h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• Focus on RB/WR in first 3 rounds</li>
                  <li>• Avoid QB early unless elite tier (Mahomes, Allen)</li>
                  <li>• Target consistent, high-volume players</li>
                  <li>• Consider positional scarcity</li>
                  <li>• Don't reach for your favorite team's players</li>
                </ul>
              </div>

              {/* Middle Round Strategy */}
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  ⚖️ Middle Rounds (5-10)
                </h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• Fill out starting lineup positions</li>
                  <li>• Target QB if you haven't taken one</li>
                  <li>• Look for high-upside WR/RB</li>
                  <li>• Consider TE if elite options available</li>
                  <li>• Start thinking about bye weeks</li>
                </ul>
              </div>

              {/* Late Round Strategy */}
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  💎 Late Rounds (11-16)
                </h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• Target handcuff RBs for your starters</li>
                  <li>• Draft K and DST in final 2 rounds</li>
                  <li>• Look for rookie sleepers</li>
                  <li>• Consider backup QB if yours is injury-prone</li>
                  <li>• Target players with easy early schedules</li>
                </ul>
              </div>

              {/* Position Priority */}
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  📊 Position Priority
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">RB (Rounds 1-3)</span>
                    <span className="text-green-400 font-semibold">HIGH</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">WR (Rounds 1-4)</span>
                    <span className="text-green-400 font-semibold">HIGH</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">QB (Rounds 5-8)</span>
                    <span className="text-yellow-400 font-semibold">MEDIUM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">TE (Rounds 6-10)</span>
                    <span className="text-yellow-400 font-semibold">MEDIUM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">K/DST (Rounds 15-16)</span>
                    <span className="text-red-400 font-semibold">LOW</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'mock':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Mock Draft</h3>
              <p className="text-slate-400">Practice your draft strategy</p>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-8 border border-slate-700 text-center">
              <div className="text-6xl mb-6">🎮</div>
              <h4 className="text-2xl font-bold text-white mb-4">Practice Makes Perfect!</h4>
              <p className="text-slate-400 mb-6">
                Practice your draft strategy with our advanced mock draft simulator before the real draft on August 31st.
              </p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="text-white font-semibold mb-1">Smart AI Opponents</div>
                    <div className="text-slate-400">4 difficulty levels</div>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="text-white font-semibold mb-1">Real Draft Timer</div>
                    <div className="text-slate-400">30-120 seconds per pick</div>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="text-white font-semibold mb-1">Full Features</div>
                    <div className="text-slate-400">Search, filter, auto-pick</div>
                  </div>
                </div>
                <button 
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'MOCK_DRAFT' })}
                  className="glass-button-primary px-6 py-3 font-semibold"
                >
                  Start Mock Draft Now
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-secondary)]/5">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' })}
              className="glass-button"
            >
              ← Back to Dashboard
            </button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl">📋</span>
                Draft Prep Center
              </h1>
              <p className="text-slate-400">{league?.name}</p>
            </div>
            
            <div className="text-right">
              <div className="text-white font-semibold">{daysUntilNextWeek} days</div>
              <div className="text-sm text-orange-400">Until Draft</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Draft Countdown */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 mb-8 text-white text-center"
        >
          <h2 className="text-2xl font-bold mb-2">🏈 Draft Day Countdown</h2>
          <p className="text-lg mb-4">
            {draftDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} at 7:00 PM
          </p>
          <div className="text-3xl font-bold">{daysUntilNextWeek} Days Remaining</div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-slate-800/50 rounded-lg p-1 overflow-x-auto">
            {tabs.map((tab: any) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-colors whitespace-nowrap ${
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

export default EnhancedDraftPrepView;