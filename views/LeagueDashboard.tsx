/**
 * Enhanced League Dashboard - Main view with improved UI/UX
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../contexts/AppContext';
import { getDaysUntilDraft, getUserTeam, SEASON_DATES_2025 } from '../data/leagueData';
import { Button } from '../components/ui/Button';
import { View } from '../types';

const EnhancedLeagueDashboard: React.FC = () => {
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

  // Enhanced navigation items with better contrast and styling
  const navItems = [
    { 
      label: 'My Team', 
      icon: '🏈', 
      view: 'TEAM_HUB', 
      gradient: 'from-blue-600 to-blue-800',
      description: 'Manage roster & lineup'
    },
    { 
      label: 'League Hub', 
      icon: '🏆', 
      view: 'LEAGUE_HUB', 
      gradient: 'from-green-600 to-green-800',
      description: 'League overview & stats'
    },
    { 
      label: 'Players', 
      icon: '👥', 
      view: 'PLAYERS', 
      gradient: 'from-purple-600 to-purple-800',
      description: 'Player research & stats'
    },
    { 
      label: 'Draft Prep', 
      icon: '📋', 
      view: 'DRAFT_PREP_CENTER', 
      gradient: 'from-orange-600 to-orange-800',
      description: 'Rankings & strategy'
    },
    { 
      label: 'Standings', 
      icon: '📊', 
      view: 'ENHANCED_LEAGUE_STANDINGS', 
      gradient: 'from-red-600 to-red-800',
      description: 'League standings & playoffs'
    },
    { 
      label: 'Season Hub', 
      icon: '🏈', 
      view: 'SEASON_MANAGEMENT', 
      gradient: 'from-emerald-600 to-emerald-800',
      description: 'Matchups & live scoring'
    },
    { 
      label: 'Messages', 
      icon: '💬', 
      view: 'MESSAGES', 
      gradient: 'from-indigo-600 to-indigo-800',
      description: 'League chat & trades'
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Enhanced Header with Glassmorphism */}
      <header className="nav-header">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🏈</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{league.name}</h1>
                <p className="text-secondary font-medium">Commissioner: Nick Damato</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-white font-bold text-lg">{state.user?.name}</p>
                <p className="text-secondary font-medium">{userTeam?.name}</p>
              </div>
              <Button
                variant="danger"
                onClick={() => dispatch({ type: 'LOGOUT' })}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Draft Countdown Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 p-8 mb-8 text-white shadow-2xl"
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4 text-shadow-lg">🏈 Draft Day Countdown 🏈</h2>
            <p className="text-2xl mb-6 text-orange-100">August 31, 2025 at 7:00 PM</p>
            <div className="flex justify-center gap-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[100px]">
                <div className="text-5xl font-bold text-shadow-lg">{daysUntilDraft}</div>
                <div className="text-sm font-semibold text-orange-100">DAYS</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[100px]">
                <div className="text-5xl font-bold text-shadow-lg">{hoursUntilDraft}</div>
                <div className="text-sm font-semibold text-orange-100">HOURS</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[100px]">
                <div className="text-5xl font-bold text-shadow-lg">{minutesUntilDraft % 60}</div>
                <div className="text-sm font-semibold text-orange-100">MINUTES</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Navigation Grid with Better Spacing */}
        <div className="nav-container mb-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Quick Navigation</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {navItems.map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => dispatch({ type: 'SET_VIEW', payload: item.view as View })}
                className={`card bg-gradient-to-br ${item.gradient} hover:shadow-2xl text-white transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 p-6 min-h-[160px] flex flex-col justify-center items-center text-center group`}
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <div className="text-xl font-bold mb-2 text-shadow-lg">{item.label}</div>
                <div className="text-sm text-white/80 font-medium">{item.description}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Enhanced League Overview */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Enhanced League Members */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="card-header">
              <h3 className="card-title">League Members</h3>
              <p className="card-subtitle">10-team fantasy football league</p>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {league.teams.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                      {team.avatar}
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">{team.name}</p>
                      <p className="text-slate-300 font-medium">{team.owner.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-lg">
                      {team.record.wins}-{team.record.losses}
                    </p>
                    <p className="text-slate-400 font-medium">Record</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced League Settings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <div className="card-header">
              <h3 className="card-title">League Settings</h3>
              <p className="card-subtitle">Configuration & rules</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                <span className="text-slate-300 font-medium">Format</span>
                <span className="text-white font-bold">{league.settings.scoringFormat}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                <span className="text-slate-300 font-medium">Teams</span>
                <span className="text-white font-bold">{league.settings.teamCount}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                <span className="text-slate-300 font-medium">Playoff Teams</span>
                <span className="text-white font-bold">{league.settings.playoffTeams}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                <span className="text-slate-300 font-medium">Draft Type</span>
                <span className="text-white font-bold">{league.settings.draftFormat}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                <span className="text-slate-300 font-medium">Waiver Type</span>
                <span className="text-white font-bold">{league.settings.waiverType}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                <span className="text-slate-300 font-medium">Trade Deadline</span>
                <span className="text-white font-bold">Week {league.settings.tradeDeadline}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-600">
              <h4 className="text-lg font-bold text-white mb-4">Roster Format</h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(league.settings.rosterFormat).map(([position, count]) => (
                  <div key={position} className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                    <span className="text-slate-300 font-medium">{position}</span>
                    <span className="text-white font-bold">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-600">
              <h4 className="text-lg font-bold text-white mb-4">Prize Pool</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-slate-300 font-medium">Entry Fee</span>
                  <span className="text-white font-bold">${league.dues?.amount || 50}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-900/30 rounded-lg border border-green-600/30">
                  <span className="text-green-300 font-medium">1st Place</span>
                  <span className="text-green-400 font-bold">${league.payouts.firstPlace}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-900/30 rounded-lg border border-blue-600/30">
                  <span className="text-blue-300 font-medium">2nd Place</span>
                  <span className="text-blue-400 font-bold">${league.payouts.secondPlace}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-900/30 rounded-lg border border-orange-600/30">
                  <span className="text-orange-300 font-medium">3rd Place</span>
                  <span className="text-orange-400 font-bold">${league.payouts.thirdPlace}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Important Dates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 card"
        >
          <div className="card-header">
            <h3 className="card-title">Important Dates</h3>
            <p className="card-subtitle">Key dates for the 2025 season</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-6 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl text-white shadow-lg">
              <p className="text-orange-100 font-medium mb-2">Draft Day</p>
              <p className="text-white font-bold text-lg">Aug 31, 2025</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl text-white shadow-lg">
              <p className="text-green-100 font-medium mb-2">Season Start</p>
              <p className="text-white font-bold text-lg">Sep 4, 2025</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl text-white shadow-lg">
              <p className="text-blue-100 font-medium mb-2">Trade Deadline</p>
              <p className="text-white font-bold text-lg">Nov 15, 2025</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl text-white shadow-lg">
              <p className="text-purple-100 font-medium mb-2">Championship</p>
              <p className="text-white font-bold text-lg">Jan 4, 2026</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedLeagueDashboard;