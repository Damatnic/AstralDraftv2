/**
 * Trade Opportunity Widget
 * AI-powered trade recommendations and fairness analysis
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { tradeAnalysisEngine } from '../../services/advancedAnalyticsEngine';
import { useAppState } from '../../contexts/AppContext';
import { getUserTeam } from '../../data/leagueData';
import type { Player, Team } from '../../types';

interface TradeOpportunity {
  id: string;
  partnerTeam: Team;
  givePlayers: Player[];
  receivePlayers: Player[];
  fairnessScore: number;
  winProbabilityChange: number;
  recommendation: 'ACCEPT' | 'REJECT' | 'CONSIDER';
  reasoning: string;
  positionalImpact: {
    improves: string[];
    weakens: string[];
  };
  confidence: number;
}

const TradeOpportunityWidget: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { state } = useAppState();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [opportunities, setOpportunities] = useState<TradeOpportunity[]>([]);
  const [selectedOpp, setSelectedOpp] = useState<TradeOpportunity | null>(null);
  const [viewMode, setViewMode] = useState<'opportunities' | 'analyzer'>('opportunities');

  const userTeam = state.user ? getUserTeam(state.user.id) : null;
  const league = state.leagues[0];

  // Generate mock trade opportunities
  const analyzeTradeOpportunities = async () => {
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock trade opportunities
      const mockOpportunities: TradeOpportunity[] = [
        {
          id: '1',
          partnerTeam: league.teams[2],
          givePlayers: [
            { id: '1', name: 'Player A', position: 'WR', team: 'DAL', projectedPoints: 12.5 } as Player
          ],
          receivePlayers: [
            { id: '2', name: 'Player B', position: 'RB', team: 'PHI', projectedPoints: 14.2 } as Player
          ],
          fairnessScore: 92,
          winProbabilityChange: 3.5,
          recommendation: 'ACCEPT',
          reasoning: 'Addresses RB need while selling high on WR depth. Improves playoff odds.',
          positionalImpact: {
            improves: ['RB'],
            weakens: ['WR']
          },
          confidence: 0.85
        },
        {
          id: '2',
          partnerTeam: league.teams[4],
          givePlayers: [
            { id: '3', name: 'Player C', position: 'TE', team: 'KC', projectedPoints: 8.8 } as Player,
            { id: '4', name: 'Player D', position: 'RB', team: 'DET', projectedPoints: 10.2 } as Player
          ],
          receivePlayers: [
            { id: '5', name: 'Player E', position: 'WR', team: 'MIA', projectedPoints: 15.5 } as Player
          ],
          fairnessScore: 78,
          winProbabilityChange: 1.2,
          recommendation: 'CONSIDER',
          reasoning: '2-for-1 consolidates talent. Consider if you have depth at RB/TE.',
          positionalImpact: {
            improves: ['WR'],
            weakens: ['RB', 'TE']
          },
          confidence: 0.72
        },
        {
          id: '3',
          partnerTeam: league.teams[6],
          givePlayers: [
            { id: '6', name: 'Player F', position: 'QB', team: 'BUF', projectedPoints: 22.5 } as Player
          ],
          receivePlayers: [
            { id: '7', name: 'Player G', position: 'QB', team: 'LAC', projectedPoints: 18.5 } as Player,
            { id: '8', name: 'Player H', position: 'WR', team: 'MIN', projectedPoints: 11.2 } as Player
          ],
          fairnessScore: 65,
          winProbabilityChange: -2.1,
          recommendation: 'REJECT',
          reasoning: 'Significant downgrade at QB not offset by WR addition.',
          positionalImpact: {
            improves: ['WR'],
            weakens: ['QB']
          },
          confidence: 0.88
        }
      ];

      setOpportunities(mockOpportunities);
      setSelectedOpp(mockOpportunities[0]);
    } catch (error) {
      console.error('Failed to analyze trades:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Auto-analyze on mount
  useEffect(() => {
    if (userTeam && opportunities.length === 0) {
      analyzeTradeOpportunities();

  }, [userTeam]);

  const getFairnessColor = (score: number) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getRecommendationStyle = (rec: string) => {
    switch (rec) {
      case 'ACCEPT':
        return { bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-400' };
      case 'REJECT':
        return { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400' };
      default:
        return { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400' };

  };

  const getWinProbColor = (change: number) => {
    if (change > 2) return 'text-green-400';
    if (change > 0) return 'text-green-300';
    if (change > -2) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <Card variant="gradient" className="bg-gradient-to-br from-dark-800/90 to-dark-900/90 backdrop-blur-xl border-blue-500/20 sm:px-4 md:px-6 lg:px-8">
      <CardHeader className="pb-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
            <div className="relative sm:px-4 md:px-6 lg:px-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur-xl opacity-50 animate-pulse sm:px-4 md:px-6 lg:px-8" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
                <span className="text-xl sm:px-4 md:px-6 lg:px-8">🤝</span>
              </div>
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-white sm:px-4 md:px-6 lg:px-8">Trade Analyzer</CardTitle>
              <p className="text-xs text-gray-400 mt-0.5 sm:px-4 md:px-6 lg:px-8">AI-powered trade evaluation</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
            <Button
              variant={viewMode === 'opportunities' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('opportunities')}
              className="text-xs px-2 py-1 sm:px-4 md:px-6 lg:px-8"
            >
              Opportunities
            </Button>
            <Button
              variant={viewMode === 'analyzer' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('analyzer')}
              className="text-xs px-2 py-1 sm:px-4 md:px-6 lg:px-8"
            >
              Analyzer
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:px-4 md:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {viewMode === 'opportunities' && (
            <motion.div
              key="opportunities"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2 sm:px-4 md:px-6 lg:px-8"
            >
              {opportunities.map((opp, index) => {
                const style = getRecommendationStyle(opp.recommendation);
                return (
                  <motion.div
                    key={opp.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedOpp(opp)}
                    className={`${style.bg} rounded-lg p-3 border ${style.border} cursor-pointer hover:border-opacity-50 transition-all ${
                      selectedOpp?.id === opp.id ? 'ring-2 ring-primary-500/50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
                      <div>
                        <div className="flex items-center gap-2 mb-1 sm:px-4 md:px-6 lg:px-8">
                          <span className={`text-xs font-bold ${style.text} uppercase`}>
                            {opp.recommendation}
                          </span>
                          <span className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
                            with {opp.partnerTeam.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                          <div className="flex items-center gap-1 sm:px-4 md:px-6 lg:px-8">
                            <span className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">Fairness:</span>
                            <span className={`text-xs font-bold ${getFairnessColor(opp.fairnessScore)}`}>
                              {opp.fairnessScore}%
                            </span>
                          </div>
                          <div className="flex items-center gap-1 sm:px-4 md:px-6 lg:px-8">
                            <span className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">Win Δ:</span>
                            <span className={`text-xs font-bold ${getWinProbColor(opp.winProbabilityChange)}`}>
                              {opp.winProbabilityChange > 0 ? '+' : ''}{opp.winProbabilityChange.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right sm:px-4 md:px-6 lg:px-8">
                        <p className="text-xs font-semibold text-gray-400 sm:px-4 md:px-6 lg:px-8">
                          {(opp.confidence * 100).toFixed(0)}% conf
                        </p>
                      </div>
                    </div>

                    <div className="bg-dark-900/50 rounded-md p-2 mb-2 sm:px-4 md:px-6 lg:px-8">
                      <div className="grid grid-cols-2 gap-2 text-xs sm:px-4 md:px-6 lg:px-8">
                        <div>
                          <p className="text-gray-500 mb-1 sm:px-4 md:px-6 lg:px-8">You Give:</p>
                          {opp.givePlayers.map((p, i) => (
                            <p key={i} className="text-orange-400 sm:px-4 md:px-6 lg:px-8">
                              {p.name} ({p.position})
                            </p>
                          ))}
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1 sm:px-4 md:px-6 lg:px-8">You Get:</p>
                          {opp.receivePlayers.map((p, i) => (
                            <p key={i} className="text-green-400 sm:px-4 md:px-6 lg:px-8">
                              {p.name} ({p.position})
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 sm:px-4 md:px-6 lg:px-8">{opp.reasoning}</p>

                    {opp.positionalImpact && (
                      <div className="flex items-center gap-3 mt-2 sm:px-4 md:px-6 lg:px-8">
                        {opp.positionalImpact.improves.length > 0 && (
                          <div className="flex items-center gap-1 sm:px-4 md:px-6 lg:px-8">
                            <span className="text-xs text-green-400 sm:px-4 md:px-6 lg:px-8">↑</span>
                            <span className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
                              {opp.positionalImpact.improves.join(', ')}
                            </span>
                          </div>
                        )}
                        {opp.positionalImpact.weakens.length > 0 && (
                          <div className="flex items-center gap-1 sm:px-4 md:px-6 lg:px-8">
                            <span className="text-xs text-red-400 sm:px-4 md:px-6 lg:px-8">↓</span>
                            <span className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
                              {opp.positionalImpact.weakens.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {opportunities.length === 0 && !isAnalyzing && (
                <div className="text-center py-8 sm:px-4 md:px-6 lg:px-8">
                  <p className="text-gray-400 text-sm sm:px-4 md:px-6 lg:px-8">No trade opportunities found</p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={analyzeTradeOpportunities}
                    className="mt-3 sm:px-4 md:px-6 lg:px-8"
                  >
                    Analyze Trades
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {viewMode === 'analyzer' && selectedOpp && (
            <motion.div
              key="analyzer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3 sm:px-4 md:px-6 lg:px-8"
            >
              {/* Trade Details */}
              <div className="bg-dark-800/50 rounded-xl p-4 border border-gray-800 sm:px-4 md:px-6 lg:px-8">
                <p className="text-sm font-semibold text-white mb-3 sm:px-4 md:px-6 lg:px-8">Trade Details</p>
                <div className="grid grid-cols-2 gap-4 sm:px-4 md:px-6 lg:px-8">
                  <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                    <p className="text-xs text-gray-500 uppercase tracking-wider sm:px-4 md:px-6 lg:px-8">You Send</p>
                    {selectedOpp.givePlayers.map((player, i) => (
                      <div key={i} className="bg-orange-500/10 rounded-lg p-2 border border-orange-500/20 sm:px-4 md:px-6 lg:px-8">
                        <p className="text-sm font-semibold text-white sm:px-4 md:px-6 lg:px-8">{player.name}</p>
                        <p className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
                          {player.position} - {player.team} • {player.projectedPoints?.toFixed(1)} pts
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                    <p className="text-xs text-gray-500 uppercase tracking-wider sm:px-4 md:px-6 lg:px-8">You Receive</p>
                    {selectedOpp.receivePlayers.map((player, i) => (
                      <div key={i} className="bg-green-500/10 rounded-lg p-2 border border-green-500/20 sm:px-4 md:px-6 lg:px-8">
                        <p className="text-sm font-semibold text-white sm:px-4 md:px-6 lg:px-8">{player.name}</p>
                        <p className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
                          {player.position} - {player.team} • {player.projectedPoints?.toFixed(1)} pts
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Impact Analysis */}
              <div className="bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-xl p-3 border border-primary-500/30 sm:px-4 md:px-6 lg:px-8">
                <p className="text-xs font-semibold text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">📊 Impact Analysis</p>
                <div className="grid grid-cols-2 gap-3 sm:px-4 md:px-6 lg:px-8">
                  <div>
                    <p className="text-xs text-gray-500 mb-1 sm:px-4 md:px-6 lg:px-8">Fairness Score</p>
                    <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                      <div className="flex-1 h-2 bg-dark-800 rounded-full overflow-hidden sm:px-4 md:px-6 lg:px-8">
                        <div 
                          className={`h-full bg-gradient-to-r ${
                            selectedOpp.fairnessScore >= 85 
                              ? 'from-green-400 to-green-500' 
                              : selectedOpp.fairnessScore >= 70 
                              ? 'from-yellow-400 to-yellow-500'
                              : 'from-orange-400 to-orange-500'
                          }`}
                          style={{ width: `${selectedOpp.fairnessScore}%` }}
                        />
                      </div>
                      <span className={`text-xs font-bold ${getFairnessColor(selectedOpp.fairnessScore)}`}>
                        {selectedOpp.fairnessScore}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1 sm:px-4 md:px-6 lg:px-8">Win Probability</p>
                    <p className={`text-sm font-bold ${getWinProbColor(selectedOpp.winProbabilityChange)}`}>
                      {selectedOpp.winProbabilityChange > 0 ? '+' : ''}{selectedOpp.winProbabilityChange.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 sm:px-4 md:px-6 lg:px-8">
                <Button
                  variant="success"
                  size="sm"
                  className="flex-1 sm:px-4 md:px-6 lg:px-8"
                  onClick={() => console.log('Propose trade')}
                >
                  <span className="mr-1 sm:px-4 md:px-6 lg:px-8">✓</span>
                  Propose Trade
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1 sm:px-4 md:px-6 lg:px-8"
                  onClick={() => console.log('Negotiate')}
                >
                  <span className="mr-1 sm:px-4 md:px-6 lg:px-8">💬</span>
                  Negotiate
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center py-6 sm:px-4 md:px-6 lg:px-8">
            <div className="relative sm:px-4 md:px-6 lg:px-8">
              <div className="w-10 h-10 border-3 border-blue-500/20 rounded-full sm:px-4 md:px-6 lg:px-8"></div>
              <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin absolute inset-0 sm:px-4 md:px-6 lg:px-8"></div>
            </div>
            <p className="text-xs text-gray-400 mt-2 sm:px-4 md:px-6 lg:px-8">Analyzing trade opportunities...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const TradeOpportunityWidgetWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <TradeOpportunityWidget {...props} />
  </ErrorBoundary>
);

export default React.memo(TradeOpportunityWidgetWithErrorBoundary);