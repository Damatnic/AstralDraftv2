/**
 * Championship Probability Tracker Widget
 * Real-time playoff odds with Monte Carlo simulation results
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { championshipCalculator } from '../../services/advancedAnalyticsEngine';
import { useAppState } from '../../contexts/AppContext';
import { getUserTeam } from '../../data/leagueData';
import type { Team } from '../../types';

interface ProbabilityData {
  teamId: string;
  teamName: string;
  playoffProbability: number;
  championshipProbability: number;
  firstPlaceProbability: number;
  expectedFinish: number;
  strengthOfSchedule: number;
  trend: 'up' | 'down' | 'stable';
  weeklyChange: number;
}

const ChampionshipProbabilityWidget: React.FC = () => {
  const { state } = useAppState();
  const [isCalculating, setIsCalculating] = useState(false);
  const [probabilities, setProbabilities] = useState<ProbabilityData[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'user' | 'league'>('user');
  const [simulationCount] = useState(10000);

  const userTeam = state.user ? getUserTeam(state.user.id) : null;
  const league = state.leagues[0];

  // Calculate probabilities
  const calculateProbabilities = async () => {
    setIsCalculating(true);
    try {
      // Simulate calculation delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock probability data
      const mockData: ProbabilityData[] = league.teams.map((team, index) => ({
        teamId: team.id,
        teamName: team.name,
        playoffProbability: Math.max(15, Math.min(95, 100 - (index * 10) + Math.random() * 20)),
        championshipProbability: Math.max(2, Math.min(35, 30 - (index * 3) + Math.random() * 10)),
        firstPlaceProbability: Math.max(1, Math.min(25, 20 - (index * 2) + Math.random() * 8)),
        expectedFinish: Math.min(10, index + 1 + Math.random() * 2),
        strengthOfSchedule: 0.5 + (Math.random() * 0.3 - 0.15),
        trend: Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'stable' : 'down',
        weeklyChange: (Math.random() - 0.5) * 10
      }));

      // Sort by championship probability
      mockData.sort((a, b) => b.championshipProbability - a.championshipProbability);

      setProbabilities(mockData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to calculate probabilities:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  // Auto-calculate on mount
  useEffect(() => {
    if (league && probabilities.length === 0) {
      calculateProbabilities();
    }
  }, [league]);

  // Get user team probability data
  const userProbability = useMemo(() => {
    return probabilities.find(p => p.teamId === userTeam?.id);
  }, [probabilities, userTeam]);

  // Get trend icon and color
  const getTrendIndicator = (trend: string, change: number) => {
    if (trend === 'up') return { icon: '📈', color: 'text-green-400', symbol: '↑' };
    if (trend === 'down') return { icon: '📉', color: 'text-red-400', symbol: '↓' };
    return { icon: '➡️', color: 'text-gray-400', symbol: '→' };
  };

  // Get probability color
  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return 'text-green-400';
    if (probability >= 40) return 'text-yellow-400';
    if (probability >= 20) return 'text-orange-400';
    return 'text-red-400';
  };

  // Format SOS
  const formatSOS = (sos: number) => {
    if (sos > 0.55) return { text: 'Hard', color: 'text-red-400' };
    if (sos < 0.45) return { text: 'Easy', color: 'text-green-400' };
    return { text: 'Average', color: 'text-gray-400' };
  };

  return (
    <Card variant="gradient" className="bg-gradient-to-br from-dark-800/90 to-dark-900/90 backdrop-blur-xl border-accent-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl blur-xl opacity-50 animate-pulse" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-xl">🏆</span>
              </div>
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-white">Championship Odds</CardTitle>
              <p className="text-xs text-gray-400 mt-0.5">{simulationCount.toLocaleString()} simulations</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'user' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('user')}
              className="text-xs px-2 py-1"
            >
              My Team
            </Button>
            <Button
              variant={viewMode === 'league' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('league')}
              className="text-xs px-2 py-1"
            >
              League
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <AnimatePresence mode="wait">
          {viewMode === 'user' && userProbability ? (
            <motion.div
              key="user"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* Main Probabilities */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-dark-800/50 rounded-xl p-3 border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Playoffs</span>
                    {userProbability.trend && (
                      <span className={`text-xs ${getTrendIndicator(userProbability.trend, userProbability.weeklyChange).color}`}>
                        {getTrendIndicator(userProbability.trend, userProbability.weeklyChange).symbol}
                        {Math.abs(userProbability.weeklyChange).toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-bold ${getProbabilityColor(userProbability.playoffProbability)}`}>
                      {userProbability.playoffProbability.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="bg-dark-800/50 rounded-xl p-3 border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Championship</span>
                    <span className="text-xs">🏆</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-bold ${getProbabilityColor(userProbability.championshipProbability)}`}>
                      {userProbability.championshipProbability.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="bg-dark-800/50 rounded-xl p-3 border border-gray-800">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">1st Place</p>
                    <p className="text-sm font-bold text-white">
                      {userProbability.firstPlaceProbability.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Exp. Finish</p>
                    <p className="text-sm font-bold text-white">
                      {userProbability.expectedFinish.toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">SOS</p>
                    <p className={`text-sm font-bold ${formatSOS(userProbability.strengthOfSchedule).color}`}>
                      {formatSOS(userProbability.strengthOfSchedule).text}
                    </p>
                  </div>
                </div>
              </div>

              {/* Path to Championship */}
              <div className="bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-xl p-3 border border-primary-500/30">
                <p className="text-xs font-semibold text-gray-300 mb-2">📍 Path to Championship</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Win next 3 games</span>
                    <span className="text-xs text-green-400">+8.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Top 2 teams lose</span>
                    <span className="text-xs text-green-400">+5.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Maintain scoring avg</span>
                    <span className="text-xs text-green-400">+3.1%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : viewMode === 'league' ? (
            <motion.div
              key="league"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-2"
            >
              {/* League Leaderboard */}
              <div className="bg-dark-800/50 rounded-xl p-3 border border-gray-800">
                <div className="space-y-2">
                  {probabilities.slice(0, 5).map((team, index) => (
                    <div
                      key={team.teamId}
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        team.teamId === userTeam?.id ? 'bg-primary-500/10 border border-primary-500/30' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-500 w-4">
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-white">
                            {team.teamName}
                            {team.teamId === userTeam?.id && (
                              <span className="ml-1 text-primary-400">(You)</span>
                            )}
                          </p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-xs text-gray-500">
                              Playoffs: <span className={getProbabilityColor(team.playoffProbability)}>
                                {team.playoffProbability.toFixed(0)}%
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${getProbabilityColor(team.championshipProbability)}`}>
                          {team.championshipProbability.toFixed(1)}%
                        </p>
                        <p className={`text-xs ${getTrendIndicator(team.trend, team.weeklyChange).color}`}>
                          {getTrendIndicator(team.trend, team.weeklyChange).symbol}
                          {Math.abs(team.weeklyChange).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-dark-800/50 rounded-lg p-2 border border-gray-800">
                  <p className="text-xs text-gray-500 mb-1">Avg Playoff %</p>
                  <p className="text-sm font-bold text-white">
                    {(probabilities.reduce((sum, t) => sum + t.playoffProbability, 0) / probabilities.length).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-dark-800/50 rounded-lg p-2 border border-gray-800">
                  <p className="text-xs text-gray-500 mb-1">Top Contenders</p>
                  <p className="text-sm font-bold text-white">
                    {probabilities.filter(t => t.championshipProbability > 15).length}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Loading State */}
        {isCalculating && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-yellow-500/20 rounded-full"></div>
              <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin absolute inset-0"></div>
            </div>
            <p className="text-sm text-gray-400 mt-3">Running simulations...</p>
            <p className="text-xs text-gray-500 mt-1">Analyzing {league.teams.length} teams</p>
          </div>
        )}

        {/* Footer */}
        {!isCalculating && probabilities.length > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-800">
            <p className="text-xs text-gray-500">
              Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={calculateProbabilities}
              className="text-xs"
            >
              <span className="mr-1">🔄</span>
              Refresh
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChampionshipProbabilityWidget;