/**
 * League Dashboard - Main view for the fantasy football league
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../contexts/AppContext';
import { getDaysUntilDraft, getUserTeam, SEASON_DATES_2025 } from '../data/leagueData';

const LeagueDashboard: React.FC = () => {
  const { state, dispatch } = useAppState();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const league = state.leagues[0]; // Main league
  const userTeam = state.user ? getUserTeam(state.user.id) : null;
  const daysUntilDraft = getDaysUntilDraft();
  
  // Calculate draft countdown
  const draftDate = SEASON_DATES_2025.draftDate;
  const timeDiff = draftDate.getTime() - currentTime.getTime();
  const hoursUntilDraft = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesUntilDraft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  // Navigation items
  const navItems = [
    { label: 'My Team', icon: '🏈', view: 'TEAM_HUB', color: 'bg-blue-600' },
    { label: 'League', icon: '🏆', view: 'LEAGUE_HUB', color: 'bg-green-600' },
    { label: 'Players', icon: '👥', view: 'WAIVER_WIRE', color: 'bg-purple-600' },
    { label: 'Draft Prep', icon: '📋', view: 'DRAFT_PREP_CENTER', color: 'bg-orange-600' },
    { label: 'Standings', icon: '📊', view: 'LEAGUE_STANDINGS', color: 'bg-red-600' },
    { label: 'Messages', icon: '💬', view: 'MESSAGES', color: 'bg-indigo-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/favicon.svg" alt="Logo" className="h-10 w-10" />
              <div>
                <h1 className="text-2xl font-bold text-white">{league.name}</h1>
                <p className="text-sm text-slate-400">Commissioner: Nick Damato</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-white font-semibold">{state.user?.name}</p>
                <p className="text-sm text-slate-400">{userTeam?.name}</p>
              </div>
              <button
                onClick={() => dispatch({ type: 'LOGOUT' })}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Draft Countdown Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 mb-8 text-white"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">🏈 Draft Day Countdown 🏈</h2>
            <p className="text-xl mb-4">August 31, 2025 at 7:00 PM</p>
            <div className="flex justify-center gap-8">
              <div>
                <div className="text-4xl font-bold">{daysUntilDraft}</div>
                <div className="text-sm">DAYS</div>
              </div>
              <div>
                <div className="text-4xl font-bold">{hoursUntilDraft}</div>
                <div className="text-sm">HOURS</div>
              </div>
              <div>
                <div className="text-4xl font-bold">{minutesUntilDraft % 60}</div>
                <div className="text-sm">MINUTES</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {navItems.map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => dispatch({ type: 'SET_VIEW', payload: item.view as any })}
              className={`${item.color} hover:opacity-90 rounded-xl p-6 text-white transition-all transform hover:scale-105`}
            >
              <div className="text-4xl mb-2">{item.icon}</div>
              <div className="text-lg font-semibold">{item.label}</div>
            </motion.button>
          ))}
        </div>

        {/* League Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* League Members */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
          >
            <h3 className="text-xl font-bold text-white mb-4">League Members</h3>
            <div className="space-y-3">
              {league.teams.map((team, _index) => (
                <div
                  key={team.id}
                  className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{team.avatar}</span>
                    <div>
                      <p className="text-white font-medium">{team.name}</p>
                      <p className="text-sm text-slate-400">{team.owner.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">
                      {team.record.wins}-{team.record.losses}
                    </p>
                    <p className="text-sm text-slate-400">Record</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* League Settings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
          >
            <h3 className="text-xl font-bold text-white mb-4">League Settings</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Format</span>
                <span className="text-white font-medium">{league.settings.scoringFormat}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Teams</span>
                <span className="text-white font-medium">{league.settings.teamCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Playoff Teams</span>
                <span className="text-white font-medium">{league.settings.playoffTeams}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Draft Type</span>
                <span className="text-white font-medium">{league.settings.draftFormat}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Waiver Type</span>
                <span className="text-white font-medium">{league.settings.waiverType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Trade Deadline</span>
                <span className="text-white font-medium">Week {league.settings.tradeDeadline}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-600">
              <h4 className="text-lg font-semibold text-white mb-3">Roster Format</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(league.settings.rosterFormat).map(([position, count]) => (
                  <div key={position} className="flex justify-between">
                    <span className="text-slate-400">{position}</span>
                    <span className="text-white">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-600">
              <h4 className="text-lg font-semibold text-white mb-3">Prize Pool</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Entry Fee</span>
                  <span className="text-white font-medium">${league.dues?.amount || 50}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">1st Place</span>
                  <span className="text-green-400 font-medium">${league.payouts.firstPlace}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">2nd Place</span>
                  <span className="text-blue-400 font-medium">${league.payouts.secondPlace}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">3rd Place</span>
                  <span className="text-orange-400 font-medium">${league.payouts.thirdPlace}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Important Dates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-xl font-bold text-white mb-4">Important Dates</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-slate-700/50 rounded-lg">
              <p className="text-slate-400 text-sm mb-1">Draft Day</p>
              <p className="text-white font-semibold">Aug 31, 2025</p>
            </div>
            <div className="text-center p-4 bg-slate-700/50 rounded-lg">
              <p className="text-slate-400 text-sm mb-1">Season Start</p>
              <p className="text-white font-semibold">Sep 4, 2025</p>
            </div>
            <div className="text-center p-4 bg-slate-700/50 rounded-lg">
              <p className="text-slate-400 text-sm mb-1">Trade Deadline</p>
              <p className="text-white font-semibold">Nov 15, 2025</p>
            </div>
            <div className="text-center p-4 bg-slate-700/50 rounded-lg">
              <p className="text-slate-400 text-sm mb-1">Championship</p>
              <p className="text-white font-semibold">Jan 4, 2026</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LeagueDashboard;