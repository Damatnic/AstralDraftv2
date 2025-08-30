/**
 * Enhanced Team Hub View - Premium team management interface
 * A cutting-edge fantasy football team management experience
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../contexts/AppContext';
import { getUserTeam, getDaysUntilDraft } from '../data/leagueData';
import RosterManagement from '../components/roster/RosterManagement';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import LineupOptimizer from '../components/team/LineupOptimizer';
import { TrophyIcon } from '../components/icons/TrophyIcon';
import { ChartBarIcon } from '../components/icons/ChartBarIcon';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import { UsersIcon } from '../components/icons/UsersIcon';
import { ZapIcon } from '../components/icons/ZapIcon';
import { TrendingUpIcon } from '../components/icons/TrendingUpIcon';
import { DollarSignIcon } from '../components/icons/DollarSignIcon';
import { TargetIcon } from '../components/icons/TargetIcon';
import { FireIcon } from '../components/icons/FireIcon';
import { ShieldCheckIcon } from '../components/icons/ShieldCheckIcon';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import { BrainCircuitIcon } from '../components/icons/BrainCircuitIcon';

// Icon for back navigation
const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }: any) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const EnhancedTeamHubView: React.FC = () => {
  const { state, dispatch } = useAppState();
  const [activeTab, setActiveTab] = useState<'overview' | 'roster' | 'lineup' | 'analytics' | 'schedule'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [showOptimizer, setShowOptimizer] = useState(false);

  const league = state.leagues[0];
  const userTeam = state.user ? getUserTeam(state.user.id) : null;
  const daysUntilDraft = getDaysUntilDraft();

  // Calculate team statistics
  const teamStats = useMemo(() => {
    if (!userTeam) return null;
    
    const totalProjectedPoints = userTeam.roster.reduce((sum, player) => sum + player.projectedPoints, 0);
    const avgPlayerRank = userTeam.roster.reduce((sum, player) => sum + player.fantasyRank, 0) / userTeam.roster.length;
    const positionGroups = userTeam.roster.reduce((acc, player) => {
      acc[player.position] = (acc[player.position] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalProjectedPoints,
      avgPlayerRank,
      positionGroups,
      winProbability: (userTeam.record.wins / (userTeam.record.wins + userTeam.record.losses + 0.001)) * 100,
      streakType: userTeam.record.wins > 3 ? 'hot' : userTeam.record.losses > 3 ? 'cold' : 'neutral',
      playoffChance: 73.2, // Mock data
      powerRanking: 3, // Mock data
      scheduleStrength: 0.52 // Mock data
    };
  }, [userTeam]);

  if (!league || !userTeam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 via-slate-900/20 to-dark-950 flex items-center justify-center">
        <Card variant="elevated" className="max-w-md w-full">
          <CardHeader>
            <CardTitle size="xl">Team Not Found</CardTitle>
            <CardDescription>Unable to load your team information.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' })}
              variant="primary"
              fullWidth
            >
              Back to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <TargetIcon className="w-5 h-5" /> },
    { id: 'roster', label: 'Roster', icon: <UsersIcon className="w-5 h-5" /> },
    { id: 'lineup', label: 'Lineup', icon: <ZapIcon className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <ChartBarIcon className="w-5 h-5" /> },
    { id: 'schedule', label: 'Schedule', icon: <CalendarIcon className="w-5 h-5" /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Team Performance Card */}
            <Card variant="gradient" className="lg:col-span-2" glow glowColor="primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle size="xl">Team Performance</CardTitle>
                    <CardDescription>Real-time analytics and projections</CardDescription>
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <ChartBarIcon className="w-8 h-8 text-primary-400" />
                  </motion.div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <motion.div 
                    className="text-center p-4 bg-white/5 rounded-xl"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-3xl font-bold text-primary-400">
                      {userTeam.record.wins}-{userTeam.record.losses}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">Season Record</div>
                  </motion.div>
                  <motion.div 
                    className="text-center p-4 bg-white/5 rounded-xl"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-3xl font-bold text-secondary-400">
                      {teamStats?.powerRanking}rd
                    </div>
                    <div className="text-sm text-gray-400 mt-1">Power Ranking</div>
                  </motion.div>
                  <motion.div 
                    className="text-center p-4 bg-white/5 rounded-xl"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-3xl font-bold text-accent-400">
                      {teamStats?.playoffChance.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-400 mt-1">Playoff Chance</div>
                  </motion.div>
                  <motion.div 
                    className="text-center p-4 bg-white/5 rounded-xl"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-3xl font-bold text-warning-400">
                      {teamStats?.totalProjectedPoints.toFixed(0)}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">Projected Pts</div>
                  </motion.div>
                </div>

                {/* Win Probability Chart */}
                <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-300">Win Probability Trend</span>
                    <span className="text-xs text-gray-500">Last 5 weeks</span>
                  </div>
                  <div className="h-32 flex items-end gap-2">
                    {[65, 72, 68, 74, 73.2].map((value, index) => (
                      <motion.div
                        key={index}
                        className="flex-1 bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg relative group"
                        initial={{ height: 0 }}
                        animate={{ height: `${value}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          {value}%
                        </span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-500">W9</span>
                    <span className="text-xs text-gray-500">W10</span>
                    <span className="text-xs text-gray-500">W11</span>
                    <span className="text-xs text-gray-500">W12</span>
                    <span className="text-xs text-gray-500">W13</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card variant="elevated" className="h-fit">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your team efficiently</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="primary" 
                  fullWidth 
                  icon={<ZapIcon className="w-4 h-4" />}
                  onClick={() => setShowOptimizer(true)}
                >
                  Optimize Lineup
                </Button>
                <Button 
                  variant="default" 
                  fullWidth 
                  icon={<TrendingUpIcon className="w-4 h-4" />}
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'TRADES' })}
                >
                  Trade Center
                </Button>
                <Button 
                  variant="outline" 
                  fullWidth 
                  icon={<DollarSignIcon className="w-4 h-4" />}
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'WAIVER_WIRE' })}
                >
                  Waiver Wire
                </Button>
                <Button 
                  variant="ghost" 
                  fullWidth 
                  icon={<SparklesIcon className="w-4 h-4" />}
                  onClick={() => setActiveTab('analytics')}
                >
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Position Strength Analysis */}
            <Card variant="default" className="lg:col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Position Strength Analysis</CardTitle>
                    <CardDescription>Your roster composition and depth</CardDescription>
                  </div>
                  <ShieldCheckIcon className="w-6 h-6 text-secondary-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(teamStats?.positionGroups || {}).map(([position, count]) => {
                    const strength = count >= 3 ? 'strong' : count >= 2 ? 'adequate' : 'weak';
                    const strengthColors = {
                      strong: 'from-secondary-500 to-secondary-600',
                      adequate: 'from-primary-500 to-primary-600',
                      weak: 'from-danger-500 to-danger-600'
                    };
                    
                    return (
                      <motion.div
                        key={position}
                        className="relative overflow-hidden rounded-xl bg-white/5 p-4"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-bold text-white">{position}</span>
                          <span className="text-2xl font-bold text-white">{count}</span>
                        </div>
                        <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${strengthColors[strength]}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(count * 33, 100)}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1 capitalize">{strength}</div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case 'roster':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <RosterManagement
              team={userTeam}
              isOwner={true}
              showAddDropButtons={true}
            />
          </motion.div>
        );
        
      case 'lineup':
        return (
          <div className="space-y-6">
            {showOptimizer ? (
              <LineupOptimizer
                team={userTeam}
                league={league}
                dispatch={dispatch}
                canEdit={true}
              />
            ) : (
              <Card variant="gradient" glow glowColor="primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle size="xl">Starting Lineup</CardTitle>
                      <CardDescription>Optimize your lineup for maximum points</CardDescription>
                    </div>
                    <Button
                      variant="primary"
                      icon={<BrainCircuitIcon className="w-4 h-4" />}
                      onClick={() => setShowOptimizer(true)}
                    >
                      AI Optimizer
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Starting Positions */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Starters</h4>
                      {userTeam.roster.slice(0, 9).map((player: any, index: number) => (
                        <motion.div
                          key={player.id}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                              {player.position}
                            </div>
                            <div>
                              <div className="font-medium text-white">{player.name}</div>
                              <div className="text-xs text-gray-500">{player.team} vs {player.opponent || 'TBD'}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-primary-400">{player.projectedPoints}</div>
                            <div className="text-xs text-gray-500">proj pts</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Bench */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Bench</h4>
                      {userTeam.roster.slice(9, 15).map((player: any, index: number) => (
                        <motion.div
                          key={player.id}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors opacity-75"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 0.75, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-dark-700 rounded-full flex items-center justify-center text-gray-400 font-bold">
                              {player.position}
                            </div>
                            <div>
                              <div className="font-medium text-gray-300">{player.name}</div>
                              <div className="text-xs text-gray-600">{player.team}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-500">{player.projectedPoints}</div>
                            <div className="text-xs text-gray-600">bench</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Projected Score */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-400">Total Projected Points</div>
                        <div className="text-3xl font-bold text-white">
                          {userTeam.roster.slice(0, 9).reduce((sum: number, p: any) => sum + p.projectedPoints, 0).toFixed(1)}
                        </div>
                      </div>
                      <FireIcon className="w-8 h-8 text-warning-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );
        
      case 'analytics':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Advanced Metrics */}
            <Card variant="gradient" glow glowColor="secondary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Advanced Metrics</CardTitle>
                  <ChartBarIcon className="w-6 h-6 text-secondary-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Efficiency Metrics */}
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-300">Points Per Game</span>
                      <span className="text-lg font-bold text-secondary-400">112.4</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-300">Optimal Lineup %</span>
                      <span className="text-lg font-bold text-primary-400">87.3%</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-300">Trade Value Index</span>
                      <span className="text-lg font-bold text-accent-400">A+</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-300">Roster Consistency</span>
                      <span className="text-lg font-bold text-warning-400">94.2</span>
                    </div>
                  </div>

                  {/* Performance Radar Chart Mock */}
                  <div className="p-4 bg-gradient-to-br from-white/5 to-white/10 rounded-xl">
                    <h4 className="text-sm font-medium text-gray-400 mb-3">Team Strengths</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Offense', value: 92, color: 'from-danger-500 to-danger-600' },
                        { label: 'Defense', value: 78, color: 'from-primary-500 to-primary-600' },
                        { label: 'Depth', value: 85, color: 'from-secondary-500 to-secondary-600' },
                        { label: 'Upside', value: 88, color: 'from-accent-500 to-accent-600' }
                      ].map((stat: any) => (
                        <div key={stat.label}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-500">{stat.label}</span>
                            <span className="text-gray-400">{stat.value}%</span>
                          </div>
                          <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full bg-gradient-to-r ${stat.color}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${stat.value}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scoring Trends */}
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Scoring Trends</CardTitle>
                  <TrendingUpIcon className="w-6 h-6 text-primary-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end gap-2">
                  {[98, 112, 105, 125, 118, 103, 115, 121, 108, 119].map((score, index) => (
                    <motion.div
                      key={index}
                      className="flex-1 relative group"
                      initial={{ height: 0 }}
                      animate={{ height: `${(score / 125) * 100}%` }}
                      transition={{ delay: index * 0.05, duration: 0.5 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg hover:from-primary-400 hover:to-primary-300 transition-colors" />
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity bg-dark-800 px-2 py-1 rounded">
                        {score}
                      </span>
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-between mt-3">
                  <span className="text-xs text-gray-500">W1</span>
                  <span className="text-xs text-gray-500">W5</span>
                  <span className="text-xs text-gray-500">W10</span>
                </div>
                <div className="mt-4 p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Season Average</span>
                    <span className="text-lg font-bold text-white">112.1 pts</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* MVP Players */}
            <Card variant="default" className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Top Performers</CardTitle>
                  <TrophyIcon className="w-6 h-6 text-warning-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {userTeam.roster.slice(0, 3).map((player: any, index: number) => {
                    const medals = ['🥇', '🥈', '🥉'];
                    return (
                      <motion.div
                        key={player.id}
                        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/10 p-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="absolute top-2 right-2 text-2xl">{medals[index]}</div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                            {player.position}
                          </div>
                          <div>
                            <div className="font-bold text-white">{player.name}</div>
                            <div className="text-xs text-gray-500">{player.team}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-dark-800 rounded p-2">
                            <div className="text-gray-500">Avg Pts</div>
                            <div className="text-white font-bold">{(player.projectedPoints * 1.1).toFixed(1)}</div>
                          </div>
                          <div className="bg-dark-800 rounded p-2">
                            <div className="text-gray-500">Rank</div>
                            <div className="text-white font-bold">#{player.fantasyRank}</div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case 'schedule':
        return (
          <div className="space-y-6">
            {/* Upcoming Matchups */}
            <Card variant="gradient" glow glowColor="accent">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle size="xl">Upcoming Matchups</CardTitle>
                  <CalendarIcon className="w-6 h-6 text-accent-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((week: any) => {
                    const opponent = league.teams[week % league.teams.length];
                    const isHome = week % 2 === 0;
                    return (
                      <motion.div
                        key={week}
                        className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: week * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="text-xs text-gray-500">Week</div>
                              <div className="text-2xl font-bold text-white">{13 + week}</div>
                            </div>
                            <div className="w-px h-12 bg-white/20" />
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm text-gray-400">{isHome ? 'vs' : '@'}</span>
                                <span className="text-lg font-bold text-white">{opponent.name}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>{opponent.record.wins}-{opponent.record.losses}</span>
                                <span>•</span>
                                <span>Rank #{week + 2}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-400">Win Probability</div>
                            <div className="text-2xl font-bold text-secondary-400">{(55 + week * 5).toFixed(0)}%</div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Season Schedule Grid */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Full Season Schedule</CardTitle>
                <CardDescription>Your complete matchup history and upcoming games</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Array.from({ length: 14 }, (_, i) => i + 1).map((week: any) => {
                    const isPast = week <= 12;
                    const isWin = isPast && Math.random() > 0.4;
                    const opponent = league.teams[week % league.teams.length];
                    
                    return (
                      <motion.div
                        key={week}
                        className={`p-3 rounded-lg border ${
                          isPast 
                            ? isWin 
                              ? 'bg-secondary-500/10 border-secondary-500/30' 
                              : 'bg-danger-500/10 border-danger-500/30'
                            : 'bg-white/5 border-white/10'
                        }`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: week * 0.02 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-400">Week {week}</span>
                          {isPast && (
                            <span className={`text-xs font-bold ${
                              isWin ? 'text-secondary-400' : 'text-danger-400'
                            }`}>
                              {isWin ? 'W' : 'L'}
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-medium text-white">
                          {week % 2 === 0 ? 'vs' : '@'} {opponent.name.split(' ')[0]}
                        </div>
                        {isPast && (
                          <div className="text-xs text-gray-500 mt-1">
                            {isWin ? '118' : '102'}-{isWin ? '105' : '115'}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
                
                {/* Playoff Picture */}
                <div className="mt-6 p-4 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-400">Playoff Status</div>
                      <div className="text-lg font-bold text-white">Currently 3rd Seed</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Magic Number</div>
                      <div className="text-2xl font-bold text-secondary-400">2</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-slate-900/10 to-dark-950">
      {/* Premium Glass Header */}
      <motion.div 
        className="sticky top-0 z-50 bg-dark-900/80 backdrop-blur-xl border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' })}
              variant="ghost"
              icon={<ChevronLeftIcon className="w-5 h-5" />}
            >
              Dashboard
            </Button>
            
            <div className="flex items-center gap-4">
              {/* Team Identity */}
              <motion.div 
                className="flex items-center gap-3"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-2xl shadow-lg shadow-primary-500/30">
                    {userTeam.avatar}
                  </div>
                  {teamStats?.streakType === 'hot' && (
                    <motion.div 
                      className="absolute -top-1 -right-1 w-4 h-4 bg-danger-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <FireIcon className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                    </motion.div>
                  )}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">{userTeam.name}</h1>
                  <p className="text-xs text-gray-400">Managed by {userTeam.owner.name}</p>
                </div>
              </motion.div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-lg font-bold text-white">
                  {userTeam.record.wins}-{userTeam.record.losses}
                </div>
                <div className="text-xs text-gray-500">Record</div>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <div className="text-lg font-bold text-secondary-400">
                  #{teamStats?.powerRanking || 1}
                </div>
                <div className="text-xs text-gray-500">Rank</div>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <div className="text-lg font-bold text-primary-400">
                  ${userTeam.faab}
                </div>
                <div className="text-xs text-gray-500">FAAB</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Draft Countdown (if pre-draft) */}
        {league.status === 'PRE_DRAFT' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card variant="gradient" glow glowColor="warning">
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-warning-500/20 rounded-full flex items-center justify-center">
                      <CalendarIcon className="w-6 h-6 text-warning-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Draft Day Approaching!</h2>
                      <p className="text-sm text-gray-400">August 31, 2025 at 7:00 PM</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-warning-400">{daysUntilDraft}</div>
                    <div className="text-xs text-gray-500">days left</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Modern Tab Navigation */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-dark-900/50 backdrop-blur-sm rounded-2xl p-2 border border-white/10">
            <div className="flex gap-2">
              {tabs.map((tab: any) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg shadow-primary-500/30"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative">{tab.icon}</span>
                  <span className="relative font-medium">{tab.label}</span>
                  {tab.id === 'lineup' && showOptimizer && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-2 h-2 bg-secondary-400 rounded-full"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

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

      {/* Floating AI Assistant Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
      >
        <Button
          variant="primary"
          size="lg"
          className="rounded-full shadow-2xl shadow-primary-500/30 w-14 h-14 p-0"
          onClick={() => {
            // Open AI assistant modal
          }}
        >
          <BrainCircuitIcon className="w-6 h-6" />
        </Button>
        <motion.div
          className="absolute -top-2 -right-2 w-4 h-4 bg-secondary-400 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <SparklesIcon className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
        </motion.div>
      </motion.div>

      {/* Performance Indicator */}
      {teamStats?.streakType === 'hot' && (
        <motion.div
          className="fixed bottom-6 left-6 z-40 bg-gradient-to-r from-danger-500 to-warning-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ delay: 1, type: "spring" }}
        >
          <FireIcon className="w-4 h-4" />
          <span className="text-sm font-medium">Hot Streak - 3 Wins</span>
        </motion.div>
      )}

      {/* Lineup Optimizer Modal */}
      <AnimatePresence>
        {showOptimizer && activeTab !== 'lineup' && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowOptimizer(false)}
          >
            <motion.div
              className="max-w-4xl w-full max-h-[90vh] overflow-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e: any) => e.stopPropagation()}
            >
              <Card variant="elevated" className="relative">
                <button
                  onClick={() => setShowOptimizer(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <LineupOptimizer
                  team={userTeam}
                  league={league}
                  dispatch={dispatch}
                  canEdit={true}
                />
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedTeamHubView;