/**
 * Waiver Wire Intelligence Widget
 * AI-powered waiver wire recommendations with breakout detection
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { waiverWireEngine } from '../../services/waiverWireEngine';
import { useAppState } from '../../contexts/AppContext';
import { getUserTeam } from '../../data/leagueData';
import type { Player } from '../../types';

interface WaiverRecommendation {
  player: Player;
  score: number;
  type: 'breakout' | 'injury_replacement' | 'trending' | 'buy_low';
  reasoning: string;
  faabRecommendation: number;
  addDropSuggestion?: {
    drop: Player;
    confidence: number;
  };
  metrics: {
    targetShare: number;
    snapCount: number;
    redZoneTargets: number;
    trend: 'rising' | 'falling' | 'stable';
  };

interface BreakoutCandidate {
  player: Player;
  probability: number;
  factors: string[];
  nextOpponent: string;
  projectedPoints: number;

const WaiverWireIntelligenceWidget: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { state } = useAppState();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<WaiverRecommendation[]>([]);
  const [breakoutCandidates, setBreakoutCandidates] = useState<BreakoutCandidate[]>([]);
  const [faabBudget] = useState(100);
  const [faabSpent] = useState(25);
  const [viewMode, setViewMode] = useState<'recommendations' | 'breakouts' | 'trends'>('recommendations');
  const [selectedPosition, setSelectedPosition] = useState<string>('ALL');

  const userTeam = state.user ? getUserTeam(state.user.id) : null;
  const currentWeek = state.currentWeek || 1;

  // Mock player data for demonstration
  const mockPlayers: Partial<Player>[] = [
    {
      id: '1',
      name: 'Rashee Rice',
      position: 'WR',
      team: 'KC',
      points: 15.2,
      projectedPoints: 12.5,
      ownership: 42
    },
    {
      id: '2',
      name: 'Tank Dell',
      position: 'WR',
      team: 'HOU',
      points: 13.8,
      projectedPoints: 11.2,
      ownership: 38
    },
    {
      id: '3',
      name: 'Chuba Hubbard',
      position: 'RB',
      team: 'CAR',
      points: 11.5,
      projectedPoints: 10.8,
      ownership: 28
    },
    {
      id: '4',
      name: 'Sam LaPorta',
      position: 'TE',
      team: 'DET',
      points: 9.2,
      projectedPoints: 8.5,
      ownership: 35
    },
    {
      id: '5',
      name: 'Jaylen Warren',
      position: 'RB',
      team: 'PIT',
      points: 10.1,
      projectedPoints: 9.8,
      ownership: 31
    }
  ];

  const analyzeWaiverWire = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate mock recommendations
      const mockRecommendations: WaiverRecommendation[] = mockPlayers.map((player, index) => ({
        player: player as Player,
        score: 85 - (index * 5) + Math.random() * 10,
        type: index === 0 ? 'breakout' : index === 1 ? 'trending' : index === 2 ? 'injury_replacement' : 'buy_low',
        reasoning: getReasoningForType(index),
        faabRecommendation: Math.max(5, Math.floor((85 - index * 10) / 2)),
        addDropSuggestion: index < 3 && userTeam?.roster?.length ? {
          drop: userTeam.roster[userTeam.roster.length - 1 - index] || ({} as Player),
          confidence: 0.75 + Math.random() * 0.2
        } : undefined,
        metrics: {
          targetShare: 0.15 + Math.random() * 0.15,
          snapCount: 60 + Math.random() * 30,
          redZoneTargets: Math.floor(Math.random() * 5),
          trend: Math.random() > 0.6 ? 'rising' : Math.random() > 0.3 ? 'stable' : 'falling'
        }
      }));

      // Generate breakout candidates
      const mockBreakouts: BreakoutCandidate[] = mockPlayers.slice(0, 3).map((player, index) => ({
        player: player as Player,
        probability: 0.65 - (index * 0.15) + Math.random() * 0.1,
        factors: getBreakoutFactors(index),
        nextOpponent: ['NYG', 'WAS', 'CAR'][index],
        projectedPoints: (player.projectedPoints || 10) * (1.2 + Math.random() * 0.3)
      }));

      setRecommendations(mockRecommendations);
      setBreakoutCandidates(mockBreakouts);
    } catch (error) {
      console.error('Failed to analyze waiver wire:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [userTeam, mockPlayers]);

  // Auto-analyze on mount
  useEffect(() => {
    if (userTeam && recommendations.length === 0) {
      analyzeWaiverWire();
    }
  }, [userTeam, recommendations.length, analyzeWaiverWire]);

  const getReasoningForType = (index: number): string => {
    const reasons = [
      'Target share increased 35% over last 2 weeks. Elite matchup vs NYG.',
      'Snap count trending up. Averaging 8 targets per game last 3 weeks.',
      'Starting RB ruled out. Expected to see 15+ touches.',
      'Buy-low opportunity after tough matchups. Schedule lightens significantly.',
      'Breakout candidate with increasing red zone usage.'
    ];
    return reasons[index] || reasons[0];
  };

  const getBreakoutFactors = (index: number): string[] => {
    const factors = [
      ['Increased snap %', 'Elite matchup', 'Target share rising'],
      ['RZ opportunities', 'Weak opponent', 'Volume trending up'],
      ['Injury to starter', 'Favorable game script', 'High implied total']
    ];
    return factors[index] || factors[0];
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'breakout': return '🚀';
      case 'trending': return '📈';
      case 'injury_replacement': return '🏥';
      case 'buy_low': return '💎';
      default: return '📊';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'breakout': return 'from-purple-500 to-pink-500';
      case 'trending': return 'from-green-500 to-emerald-500';
      case 'injury_replacement': return 'from-orange-500 to-red-500';
      case 'buy_low': return 'from-blue-500 to-indigo-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return { icon: '↗️', color: 'text-green-400' };
      case 'falling': return { icon: '↘️', color: 'text-red-400' };
      default: return { icon: '→', color: 'text-gray-400' };
    }
  };

  const filteredRecommendations = selectedPosition === 'ALL' 
    ? recommendations 
    : recommendations.filter((r: any) => r.player.position === selectedPosition);

  return (
    <Card variant="gradient" className="bg-gradient-to-br from-dark-800/90 to-dark-900/90 backdrop-blur-xl border-green-500/20 sm:px-4 md:px-6 lg:px-8">
      <CardHeader className="pb-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
            <div className="relative sm:px-4 md:px-6 lg:px-8">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl blur-xl opacity-50 animate-pulse sm:px-4 md:px-6 lg:px-8" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
                <span className="text-xl sm:px-4 md:px-6 lg:px-8">🎯</span>
              </div>
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-white sm:px-4 md:px-6 lg:px-8">Waiver Wire AI</CardTitle>
              <p className="text-xs text-gray-400 mt-0.5 sm:px-4 md:px-6 lg:px-8">FAAB: ${faabBudget - faabSpent} remaining</p>
            </div>
          </div>
          <Button>
            variant="ghost"
            size="sm"
            onClick={analyzeWaiverWire}
            disabled={isAnalyzing}
            className="text-xs sm:px-4 md:px-6 lg:px-8"
          >
            {isAnalyzing ? '⚡' : '🔄'}
          </Button>
        </div>

        {/* View Mode Tabs */}
        <div className="flex gap-1 mt-3 sm:px-4 md:px-6 lg:px-8">
          {['recommendations', 'breakouts', 'trends'].map((mode: any) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode as any)}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:px-4 md:px-6 lg:px-8">
        {/* Position Filter */}
        {viewMode === 'recommendations' && (
          <div className="flex gap-1 sm:px-4 md:px-6 lg:px-8">
            {['ALL', 'RB', 'WR', 'TE'].map((pos: any) => (
              <button
                key={pos}
                onClick={() => setSelectedPosition(pos)}
              >
                {pos}
              </button>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {viewMode === 'recommendations' && (
            <motion.div
              key="recommendations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2 sm:px-4 md:px-6 lg:px-8"
            >
              {filteredRecommendations.slice(0, 4).map((rec, index) => (
                <motion.div
                  key={rec.player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-dark-800/50 rounded-lg p-3 border border-gray-800 hover:border-gray-700 transition-colors sm:px-4 md:px-6 lg:px-8"
                >
                  <div className="flex items-start justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getTypeColor(rec.type)} flex items-center justify-center`}>
                        <span className="text-sm sm:px-4 md:px-6 lg:px-8">{getTypeIcon(rec.type)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white sm:px-4 md:px-6 lg:px-8">
                          {rec.player.name}
                        </p>
                        <p className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
                          {rec.player.position} - {rec.player.team}
                        </p>
                      </div>
                    </div>
                    <div className="text-right sm:px-4 md:px-6 lg:px-8">
                      <p className="text-xs font-bold text-green-400 sm:px-4 md:px-6 lg:px-8">
                        ${rec.faabRecommendation}
                      </p>
                      <p className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">FAAB</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">{rec.reasoning}</p>

                  <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                      <div className="flex items-center gap-1 sm:px-4 md:px-6 lg:px-8">
                        <span className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">Targets:</span>
                        <span className="text-xs font-semibold text-white sm:px-4 md:px-6 lg:px-8">
                          {(rec.metrics.targetShare * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1 sm:px-4 md:px-6 lg:px-8">
                        <span className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">Snaps:</span>
                        <span className="text-xs font-semibold text-white sm:px-4 md:px-6 lg:px-8">
                          {rec.metrics.snapCount.toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1 sm:px-4 md:px-6 lg:px-8">
                        <span className={`text-xs ${getTrendIcon(rec.metrics.trend).color}`}>
                          {getTrendIcon(rec.metrics.trend).icon}
                        </span>
                      </div>
                    </div>
                    {rec.addDropSuggestion && (
                      <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
                        Drop: <span className="text-orange-400 sm:px-4 md:px-6 lg:px-8">{rec.addDropSuggestion.drop.name}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {viewMode === 'breakouts' && (
            <motion.div
              key="breakouts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2 sm:px-4 md:px-6 lg:px-8"
            >
              {breakoutCandidates.map((candidate, index) => (
                <motion.div
                  key={candidate.player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-3 border border-purple-500/30 sm:px-4 md:px-6 lg:px-8"
                >
                  <div className="flex items-center justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
                    <div>
                      <p className="text-sm font-semibold text-white sm:px-4 md:px-6 lg:px-8">
                        {candidate.player.name}
                      </p>
                      <p className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
                        vs {candidate.nextOpponent} • {candidate.player.position}
                      </p>
                    </div>
                    <div className="text-right sm:px-4 md:px-6 lg:px-8">
                      <p className="text-lg font-bold text-purple-400 sm:px-4 md:px-6 lg:px-8">
                        {(candidate.probability * 100).toFixed(0)}%
                      </p>
                      <p className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">Breakout</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-2 sm:px-4 md:px-6 lg:px-8">
                    {candidate.factors.map((factor, i) => (
                      <span key={i} className="px-2 py-0.5 bg-purple-500/20 text-xs text-purple-300 rounded-md sm:px-4 md:px-6 lg:px-8">
                        {factor}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                    <span className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
                      Projected: <span className="font-semibold text-white sm:px-4 md:px-6 lg:px-8">
                        {candidate.projectedPoints.toFixed(1)} pts
                      </span>
                    </span>
                    <Button>
                      variant="primary"
                      size="sm"
                      className="text-xs px-2 py-1 sm:px-4 md:px-6 lg:px-8"
                    >
                      Add to Watchlist
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {viewMode === 'trends' && (
            <motion.div
              key="trends"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3 sm:px-4 md:px-6 lg:px-8"
            >
              <div className="bg-dark-800/50 rounded-lg p-3 border border-gray-800 sm:px-4 md:px-6 lg:px-8">
                <p className="text-xs font-semibold text-gray-400 mb-2 sm:px-4 md:px-6 lg:px-8">🔥 Hot Pickups (Last 24h)</p>
                <div className="space-y-1 sm:px-4 md:px-6 lg:px-8">
                  {['Rashee Rice (+42%)', 'Tank Dell (+38%)', 'Sam LaPorta (+31%)'].map((player, i) => (
                    <div key={i} className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                      <span className="text-xs text-gray-300 sm:px-4 md:px-6 lg:px-8">{player.split(' (')[0]}</span>
                      <span className="text-xs text-green-400 sm:px-4 md:px-6 lg:px-8">{player.match(/\(([^)]+)\)/)?.[1]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-dark-800/50 rounded-lg p-3 border border-gray-800 sm:px-4 md:px-6 lg:px-8">
                <p className="text-xs font-semibold text-gray-400 mb-2 sm:px-4 md:px-6 lg:px-8">📉 Dropping Fast</p>
                <div className="space-y-1 sm:px-4 md:px-6 lg:px-8">
                  {['Player A (-22%)', 'Player B (-18%)', 'Player C (-15%)'].map((player, i) => (
                    <div key={i} className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                      <span className="text-xs text-gray-300 sm:px-4 md:px-6 lg:px-8">{player.split(' (')[0]}</span>
                      <span className="text-xs text-red-400 sm:px-4 md:px-6 lg:px-8">{player.match(/\(([^)]+)\)/)?.[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center py-6 sm:px-4 md:px-6 lg:px-8">
            <div className="relative sm:px-4 md:px-6 lg:px-8">
              <div className="w-10 h-10 border-3 border-green-500/20 rounded-full sm:px-4 md:px-6 lg:px-8"></div>
              <div className="w-10 h-10 border-3 border-green-500 border-t-transparent rounded-full animate-spin absolute inset-0 sm:px-4 md:px-6 lg:px-8"></div>
            </div>
            <p className="text-xs text-gray-400 mt-2 sm:px-4 md:px-6 lg:px-8">Analyzing waiver wire...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const WaiverWireIntelligenceWidgetWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <WaiverWireIntelligenceWidget {...props} />
  </ErrorBoundary>
);

export default React.memo(WaiverWireIntelligenceWidgetWithErrorBoundary);