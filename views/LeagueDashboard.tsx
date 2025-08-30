/**
 * Enhanced League Dashboard - Professional UI with modern components
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../contexts/AppContext';
import { getDaysUntilDraft, getUserTeam, SEASON_DATES_2025 } from '../data/leagueData';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { View } from '../types';
import { TrophyIcon, UsersIcon, ClipboardListIcon, ChartBarIcon, CalendarIcon, MessageCircleIcon } from '../components/icons';

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

  // Professional navigation items with icons and gradients
  const navItems = [
    { 
      label: 'My Team', 
      icon: '🏈', 
      view: 'TEAM_HUB', 
      gradient: 'from-blue-500 via-blue-600 to-blue-700',
      glowColor: 'primary' as const,
      description: 'Manage roster & lineup',
      stats: { label: 'Rank', value: userTeam ? `#${userTeam.standings?.rank || 1}` : '#1' }
    },
    { 
      label: 'League Hub', 
      icon: '🏆', 
      view: 'LEAGUE_HUB', 
      gradient: 'from-emerald-500 via-green-600 to-green-700',
      glowColor: 'secondary' as const,
      description: 'League overview & stats',
      stats: { label: 'Teams', value: league.teams.length.toString() }
    },
    { 
      label: 'Players', 
      icon: '👥', 
      view: 'PLAYERS', 
      gradient: 'from-purple-500 via-purple-600 to-purple-700',
      glowColor: 'accent' as const,
      description: 'Player research & stats',
      stats: { label: 'Available', value: '500+' }
    },
    { 
      label: 'Draft Prep', 
      icon: '📋', 
      view: 'DRAFT_PREP_CENTER', 
      gradient: 'from-orange-500 via-orange-600 to-red-600',
      glowColor: 'warning' as const,
      description: 'Rankings & strategy',
      stats: { label: 'Days', value: daysUntilDraft.toString() }
    },
    { 
      label: 'Standings', 
      icon: '📊', 
      view: 'ENHANCED_LEAGUE_STANDINGS', 
      gradient: 'from-red-500 via-rose-600 to-pink-600',
      glowColor: 'danger' as const,
      description: 'League standings & playoffs',
      stats: { label: 'Week', value: '1' }
    },
    { 
      label: 'Season Hub', 
      icon: '⚡', 
      view: 'SEASON_MANAGEMENT', 
      gradient: 'from-cyan-500 via-teal-600 to-emerald-600',
      glowColor: 'secondary' as const,
      description: 'Matchups & live scoring',
      stats: { label: 'Live', value: '0' }
    },
    { 
      label: 'Messages', 
      icon: '💬', 
      view: 'MESSAGES', 
      gradient: 'from-indigo-500 via-indigo-600 to-purple-600',
      glowColor: 'primary' as const,
      description: 'League chat & trades',
      stats: { label: 'New', value: '3' }
    },
    { 
      label: 'Analytics', 
      icon: '📈', 
      view: 'ANALYTICS_HUB', 
      gradient: 'from-slate-500 via-slate-600 to-slate-700',
      glowColor: 'accent' as const,
      description: 'Advanced metrics & insights',
      stats: { label: 'Reports', value: '12' }
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      {/* Professional Header with Glass Effect */}
      <header className="sticky top-0 z-50 bg-dark-900/80 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl blur-xl opacity-50 animate-pulse" />
                <div className="relative w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <span className="text-3xl">🏈</span>
                </div>
              </motion.div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {league.name}
                </h1>
                <p className="text-gray-400 text-sm font-medium">Commissioner: Nick Damato</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-6">
              <Card variant="bordered" padding="sm" className="bg-dark-800/50">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                    <span className="text-lg sm:text-xl font-bold text-white">
                      {state.user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold text-sm sm:text-base">{state.user?.name}</p>
                    <p className="text-gray-400 text-xs sm:text-sm">{userTeam?.name}</p>
                  </div>
                </div>
              </Card>
              <Button
                variant="danger"
                size="sm"
                onClick={() => dispatch({ type: 'LOGOUT' })}
                className="hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all duration-300"
              >
                <span className="mr-2">🚪</span>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Professional Draft Countdown Card */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <Card 
              variant="gradient" 
              className="mb-8 relative overflow-hidden"
              glow
              glowColor="warning"
            >
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 animate-gradient" />
              </div>
              
              <CardContent className="relative z-10">
                <div className="text-center py-4">
                  <motion.h2 
                    className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4 bg-gradient-to-r from-orange-300 via-yellow-300 to-orange-300 bg-clip-text text-transparent"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🏈 DRAFT DAY COUNTDOWN 🏈
                  </motion.h2>
                  <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 text-white/90 font-semibold">August 31, 2025 • 7:00 PM EST</p>
                  
                  <div className="flex justify-center gap-2 sm:gap-4 md:gap-8">
                    {[
                      { value: daysUntilDraft, label: 'DAYS', color: 'from-orange-500 to-red-500' },
                      { value: hoursUntilDraft, label: 'HOURS', color: 'from-red-500 to-pink-500' },
                      { value: minutesUntilDraft % 60, label: 'MINUTES', color: 'from-pink-500 to-purple-500' }
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card 
                          variant="elevated" 
                          padding="sm" 
                          className="min-w-[80px] sm:min-w-[100px] bg-gradient-to-br ${item.color} bg-opacity-20"
                        >
                          <div className="text-center">
                            <motion.div 
                              className="text-3xl sm:text-4xl lg:text-5xl font-black text-white"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 1, delay: index * 0.2, repeat: Infinity, repeatDelay: 3 }}
                            >
                              {item.value}
                            </motion.div>
                            <div className="text-xs font-bold text-white/80 mt-1">{item.label}</div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.div
                    className="mt-6 flex justify-center gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button 
                      variant="primary" 
                      size="lg"
                      onClick={() => dispatch({ type: 'SET_VIEW', payload: 'DRAFT_PREP_CENTER' as View })}
                      className="shadow-[0_0_30px_rgba(251,146,60,0.5)]"
                    >
                      <span className="mr-2">📋</span>
                      Prepare for Draft
                    </Button>
                    <Button 
                      variant="default" 
                      size="lg"
                      onClick={() => dispatch({ type: 'SET_VIEW', payload: 'MOCK_DRAFT' as View })}
                    >
                      <span className="mr-2">🎯</span>
                      Mock Draft
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Professional Navigation Grid */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Quick Navigation
            </h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'LEAGUE_HUB' as View })}
            >
              View All →
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {navItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
                whileHover={{ y: -5 }}
                onClick={() => dispatch({ type: 'SET_VIEW', payload: item.view as View })}
                className="cursor-pointer"
              >
                <Card 
                  variant="elevated" 
                  hover 
                  interactive
                  glow={false}
                  className="h-full relative group overflow-hidden"
                >
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  {/* Glow Effect on Hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.gradient} blur-3xl opacity-20`} />
                  </div>
                  
                  <CardContent className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <motion.div 
                        className="text-4xl"
                        whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.2 }}
                        transition={{ duration: 0.5 }}
                      >
                        {item.icon}
                      </motion.div>
                      <div className="text-right">
                        <div className="text-2xl font-black bg-gradient-to-br ${item.gradient} bg-clip-text text-transparent">
                          {item.stats.value}
                        </div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">
                          {item.stats.label}
                        </div>
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:${item.gradient} group-hover:bg-clip-text transition-all duration-300">
                      {item.label}
                    </h4>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      {item.description}
                    </p>
                    
                    {/* Hover Arrow */}
                    <motion.div 
                      className="absolute bottom-4 right-4 text-gray-600 group-hover:text-white transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                    >
                      →
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Professional League Overview Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* League Members Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <Card variant="elevated" className="h-full">
              <CardHeader separated>
                <CardTitle size="xl">League Members</CardTitle>
                <CardDescription>10-team competitive league • PPR scoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                  {league.teams.map((team, index) => (
                    <motion.div
                      key={team.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.03 }}
                    >
                      <Card 
                        variant="bordered" 
                        padding="sm" 
                        hover
                        className="group cursor-pointer"
                        onClick={() => dispatch({ type: 'SET_VIEW', payload: 'TEAM_COMPARISON' as View })}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <motion.div 
                              className="relative"
                              whileHover={{ scale: 1.1 }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity" />
                              <div className="relative w-12 h-12 bg-gradient-to-br from-primary-500/20 to-accent-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl border border-white/10">
                                {team.avatar}
                              </div>
                            </motion.div>
                            <div>
                              <p className="text-white font-semibold group-hover:text-primary-400 transition-colors">
                                {team.name}
                              </p>
                              <p className="text-gray-400 text-sm">{team.owner.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-lg font-bold text-white">
                                {team.record.wins}-{team.record.losses}
                              </p>
                              <p className="text-xs text-gray-500 uppercase tracking-wider">Record</p>
                            </div>
                            <div className="text-gray-600 group-hover:text-primary-400 transition-colors">
                              →
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
              <CardFooter separated className="justify-center">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'ENHANCED_LEAGUE_STANDINGS' as View })}
                >
                  View Full Standings →
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* League Settings & Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="space-y-6"
          >
            {/* League Settings Card */}
            <Card variant="elevated">
              <CardHeader separated>
                <CardTitle size="xl">League Settings</CardTitle>
                <CardDescription>Configuration & scoring rules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { label: 'Format', value: league.settings.scoringFormat, icon: '⚙️' },
                    { label: 'Teams', value: league.settings.teamCount.toString(), icon: '👥' },
                    { label: 'Playoff Teams', value: league.settings.playoffTeams.toString(), icon: '🏆' },
                    { label: 'Draft Type', value: league.settings.draftFormat, icon: '📋' },
                    { label: 'Waiver Type', value: league.settings.waiverType, icon: '📝' },
                    { label: 'Trade Deadline', value: `Week ${league.settings.tradeDeadline}`, icon: '🔄' },
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                    >
                      <Card variant="bordered" padding="xs" className="hover:bg-white/5 transition-colors">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{item.icon}</span>
                            <span className="text-gray-400 font-medium">{item.label}</span>
                          </div>
                          <span className="text-white font-bold">{item.value}</span>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Prize Pool Card */}
            <Card variant="gradient" glow glowColor="warning">
              <CardHeader>
                <CardTitle size="lg">💰 Prize Pool Distribution</CardTitle>
                <CardDescription>Total pot: ${(league.dues?.amount || 50) * league.teams.length}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { place: '1st Place', amount: league.payouts.firstPlace, color: 'from-yellow-500 to-amber-600', icon: '🥇' },
                    { place: '2nd Place', amount: league.payouts.secondPlace, color: 'from-gray-400 to-gray-500', icon: '🥈' },
                    { place: '3rd Place', amount: league.payouts.thirdPlace, color: 'from-orange-600 to-orange-700', icon: '🥉' },
                  ].map((prize, index) => (
                    <motion.div
                      key={prize.place}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
                    >
                      <Card 
                        variant="elevated" 
                        padding="sm"
                        className={`bg-gradient-to-r ${prize.color} bg-opacity-10 border-0`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{prize.icon}</span>
                            <span className="text-white font-semibold">{prize.place}</span>
                          </div>
                          <div className="text-2xl font-black text-white">
                            ${prize.amount}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Important Dates Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card variant="elevated" className="mt-8">
            <CardHeader separated>
              <CardTitle size="xl">📅 Season Calendar</CardTitle>
              <CardDescription>Important dates for the 2025 season</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { 
                    title: 'Draft Day', 
                    date: 'Aug 31, 2025', 
                    icon: '📋', 
                    gradient: 'from-orange-500 to-red-500',
                    description: '7:00 PM EST'
                  },
                  { 
                    title: 'Season Start', 
                    date: 'Sep 4, 2025', 
                    icon: '🏈', 
                    gradient: 'from-green-500 to-emerald-500',
                    description: 'Week 1 Kickoff'
                  },
                  { 
                    title: 'Trade Deadline', 
                    date: 'Nov 15, 2025', 
                    icon: '🔄', 
                    gradient: 'from-blue-500 to-indigo-500',
                    description: 'Week 11'
                  },
                  { 
                    title: 'Championship', 
                    date: 'Jan 4, 2026', 
                    icon: '🏆', 
                    gradient: 'from-purple-500 to-pink-500',
                    description: 'Week 17 Final'
                  },
                ].map((event, index) => (
                  <motion.div
                    key={event.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Card 
                      variant="gradient" 
                      hover 
                      className="h-full text-center relative overflow-hidden group"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${event.gradient} opacity-20 group-hover:opacity-30 transition-opacity`} />
                      <CardContent className="relative z-10 py-6">
                        <motion.div 
                          className="text-4xl mb-3"
                          animate={{ rotate: [0, -5, 5, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                          {event.icon}
                        </motion.div>
                        <h4 className="text-white font-bold text-lg mb-1">{event.title}</h4>
                        <p className="text-white/90 font-semibold">{event.date}</p>
                        <p className="text-white/70 text-sm mt-1">{event.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Total Teams', value: '10', icon: '👥', color: 'primary' },
            { label: 'Entry Fee', value: '$50', icon: '💵', color: 'secondary' },
            { label: 'Total Prize', value: '$500', icon: '💰', color: 'warning' },
            { label: 'Weeks Left', value: '17', icon: '📅', color: 'accent' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.05 }}
            >
              <Card variant="bordered" hover padding="sm">
                <div className="text-center">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedLeagueDashboard;