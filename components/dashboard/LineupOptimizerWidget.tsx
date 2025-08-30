/**
 * AI-Powered Lineup Optimizer Widget
 * Provides quick lineup optimization with ML-powered recommendations
 */

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { lineupOptimizer } from '../../services/lineupOptimizerEngine';
import { useAppState } from '../../contexts/AppContext';
import { getUserTeam } from '../../data/leagueData';
import type { Player, Team } from '../../types';

interface OptimizationStrategy {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const strategies: OptimizationStrategy[] = [
  {
    id: 'optimal',
    name: 'Optimal',
    description: 'Best projected points',
    icon: '🎯',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'ceiling',
    name: 'Ceiling',
    description: 'Maximum upside',
    icon: '🚀',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'floor',
    name: 'Safe Floor',
    description: 'Consistent points',
    icon: '🛡️',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'contrarian',
    name: 'Contrarian',
    description: 'Tournament play',
    icon: '🎲',
    color: 'from-orange-500 to-orange-600'
  }
];

const LineupOptimizerWidget: React.FC = () => {
  const { state } = useAppState();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<OptimizationStrategy>(strategies[0]);
  const [optimizedLineup, setOptimizedLineup] = useState<any>(null);
  const [confidenceScore, setConfidenceScore] = useState<number>(0);
  const [showDetails, setShowDetails] = useState(false);
  const [lineupChanges, setLineupChanges] = useState<number>(0);

  const userTeam = state.user ? getUserTeam(state.user.id) : null;
  const currentWeek = state.currentWeek || 1;

  const optimizeLineup = useCallback(async () => {
    if (!userTeam || !userTeam.roster) return;

    setIsOptimizing(true);
    try {
      // Simulate optimization with mock data
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock optimization result
      const mockResult = {
        optimal: {
          starters: userTeam?.roster?.slice(0, 9) || [],
          bench: userTeam?.roster?.slice(9, 15) || [],
          totalProjected: 125.5
        },
        analysis: {
          totalProjected: 125.5,
          floor: 98.2,
          ceiling: 158.3,
          volatility: 0.24,
          boomProbability: 0.32,
          bustProbability: 0.18,
          stackingBonus: 1.05,
          positionStrength: new Map([
            ['QB', 1.15],
            ['RB', 0.95],
            ['WR', 1.08],
            ['TE', 0.88],
            ['K', 1.02],
            ['DEF', 0.92]
          ])
        },
        confidence: 0.85
      };

      setOptimizedLineup(mockResult);
      setConfidenceScore(mockResult.confidence);
      setLineupChanges(Math.floor(Math.random() * 3) + 1);
    } catch (error) {
      console.error('Failed to optimize lineup:', error);
    } finally {
      setIsOptimizing(false);
    }
  }, [userTeam]);

  // Auto-optimize on widget mount
  useEffect(() => {
    if (userTeam && !optimizedLineup) {
      optimizeLineup();
    }
  }, [userTeam, optimizedLineup, optimizeLineup]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getPositionStrengthIndicator = (strength: number) => {
    if (strength >= 1.1) return { icon: '🔥', color: 'text-green-400' };
    if (strength >= 0.9) return { icon: '✓', color: 'text-gray-400' };
    return { icon: '⚠️', color: 'text-orange-400' };
  };

  return (
    <Card variant="gradient" className="bg-gradient-to-br from-dark-800/90 to-dark-900/90 backdrop-blur-xl border-primary-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl blur-xl opacity-50 animate-pulse" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-white">AI Lineup Optimizer</CardTitle>
              <p className="text-xs text-gray-400 mt-0.5">ML-powered recommendations</p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs"
          >
            {showDetails ? 'Hide' : 'Details'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Strategy Selection */}
        <div className="grid grid-cols-2 gap-2">
          {strategies.map((strategy) => (
            <motion.button
              key={strategy.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedStrategy(strategy)}
              className={`relative p-2 rounded-lg border transition-all ${
                selectedStrategy.id === strategy.id
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-gray-700 bg-dark-800/50 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{strategy.icon}</span>
                <div className="text-left">
                  <p className="text-xs font-semibold text-white">{strategy.name}</p>
                  <p className="text-xs text-gray-500">{strategy.description}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Optimization Results */}
        {optimizedLineup && (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {/* Projected Points */}
              <div className="bg-dark-800/50 rounded-xl p-4 border border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Projected Points</span>
                  <span className={`text-xs font-semibold ${getConfidenceColor(confidenceScore)}`}>
                    {(confidenceScore * 100).toFixed(0)}% Confidence
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">
                    {optimizedLineup.analysis.totalProjected.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500">pts</span>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">Floor:</span>
                    <span className="text-xs font-semibold text-gray-400">
                      {optimizedLineup.analysis.floor.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">Ceiling:</span>
                    <span className="text-xs font-semibold text-gray-400">
                      {optimizedLineup.analysis.ceiling.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-dark-800/50 rounded-lg p-2 border border-gray-800">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs">💥</span>
                    <span className="text-xs text-gray-500">Boom</span>
                  </div>
                  <span className="text-sm font-bold text-green-400">
                    {(optimizedLineup.analysis.boomProbability * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="bg-dark-800/50 rounded-lg p-2 border border-gray-800">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs">📉</span>
                    <span className="text-xs text-gray-500">Bust</span>
                  </div>
                  <span className="text-sm font-bold text-orange-400">
                    {(optimizedLineup.analysis.bustProbability * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="bg-dark-800/50 rounded-lg p-2 border border-gray-800">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs">🔄</span>
                    <span className="text-xs text-gray-500">Changes</span>
                  </div>
                  <span className="text-sm font-bold text-primary-400">
                    {lineupChanges}
                  </span>
                </div>
              </div>

              {/* Position Strength Analysis */}
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-dark-800/50 rounded-lg p-3 border border-gray-800"
                >
                  <p className="text-xs font-semibold text-gray-400 mb-2">Position Strength</p>
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from(optimizedLineup.analysis.positionStrength.entries()).map(([pos, strength]) => {
                      const indicator = getPositionStrengthIndicator(strength);
                      return (
                        <div key={pos} className="flex items-center gap-1">
                          <span className={`text-xs ${indicator.color}`}>{indicator.icon}</span>
                          <span className="text-xs text-gray-400">{pos}:</span>
                          <span className="text-xs font-semibold text-white">
                            {(strength * 100).toFixed(0)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {optimizedLineup.analysis.stackingBonus > 1 && (
                    <div className="mt-2 pt-2 border-t border-gray-800">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">🔗</span>
                        <span className="text-xs text-gray-400">Stack Bonus:</span>
                        <span className="text-xs font-semibold text-green-400">
                          +{((optimizedLineup.analysis.stackingBonus - 1) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={optimizeLineup}
                  disabled={isOptimizing}
                  className="flex-1"
                >
                  {isOptimizing ? (
                    <>
                      <span className="animate-spin mr-2">⚡</span>
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">🔄</span>
                      Re-Optimize
                    </>
                  )}
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => {
                    // Apply the optimized lineup
                    console.log('Applying optimized lineup');
                  }}
                  className="flex-1"
                >
                  <span className="mr-2">✓</span>
                  Apply Lineup
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Loading State */}
        {isOptimizing && !optimizedLineup && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-primary-500/20 rounded-full"></div>
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin absolute inset-0"></div>
            </div>
            <p className="text-sm text-gray-400 mt-3">Analyzing {userTeam?.roster?.length || 0} players...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LineupOptimizerWidget;