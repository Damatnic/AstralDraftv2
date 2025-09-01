/**
 * Trade Opportunity Widget
 * AI-powered trade recommendations and fairness analysis
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo, useState, useEffect } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { Card, CardHeader, CardTitle, CardContent } from &apos;../ui/Card&apos;;
import { Button } from &apos;../ui/Button&apos;;
import { tradeAnalysisEngine } from &apos;../../services/advancedAnalyticsEngine&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;
import { getUserTeam } from &apos;../../data/leagueData&apos;;
import type { Player, Team } from &apos;../../types&apos;;

interface TradeOpportunity {
}
  id: string;
  partnerTeam: Team;
  givePlayers: Player[];
  receivePlayers: Player[];
  fairnessScore: number;
  winProbabilityChange: number;
  recommendation: &apos;ACCEPT&apos; | &apos;REJECT&apos; | &apos;CONSIDER&apos;;
  reasoning: string;
  positionalImpact: {
}
    improves: string[];
    weakens: string[];
  };
  confidence: number;
}

const TradeOpportunityWidget: React.FC = () => {
}
  const [isLoading, setIsLoading] = React.useState(false);
  const { state } = useAppState();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [opportunities, setOpportunities] = useState<TradeOpportunity[]>([]);
  const [selectedOpp, setSelectedOpp] = useState<TradeOpportunity | null>(null);
  const [viewMode, setViewMode] = useState<&apos;opportunities&apos; | &apos;analyzer&apos;>(&apos;opportunities&apos;);

  const userTeam = state.user ? getUserTeam(state.user.id) : null;
  const league = state.leagues[0];

  // Generate mock trade opportunities
  const analyzeTradeOpportunities = async () => {
}
    setIsAnalyzing(true);
    try {
}
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock trade opportunities
      const mockOpportunities: TradeOpportunity[] = [
        {
}
          id: &apos;1&apos;,
          partnerTeam: league.teams[2],
          givePlayers: [
            { id: &apos;1&apos;, name: &apos;Player A&apos;, position: &apos;WR&apos;, team: &apos;DAL&apos;, projectedPoints: 12.5 } as Player
          ],
          receivePlayers: [
            { id: &apos;2&apos;, name: &apos;Player B&apos;, position: &apos;RB&apos;, team: &apos;PHI&apos;, projectedPoints: 14.2 } as Player
          ],
          fairnessScore: 92,
          winProbabilityChange: 3.5,
          recommendation: &apos;ACCEPT&apos;,
          reasoning: &apos;Addresses RB need while selling high on WR depth. Improves playoff odds.&apos;,
          positionalImpact: {
}
            improves: [&apos;RB&apos;],
            weakens: [&apos;WR&apos;]
          },
          confidence: 0.85
        },
        {
}
          id: &apos;2&apos;,
          partnerTeam: league.teams[4],
          givePlayers: [
            { id: &apos;3&apos;, name: &apos;Player C&apos;, position: &apos;TE&apos;, team: &apos;KC&apos;, projectedPoints: 8.8 } as Player,
            { id: &apos;4&apos;, name: &apos;Player D&apos;, position: &apos;RB&apos;, team: &apos;DET&apos;, projectedPoints: 10.2 } as Player
          ],
          receivePlayers: [
            { id: &apos;5&apos;, name: &apos;Player E&apos;, position: &apos;WR&apos;, team: &apos;MIA&apos;, projectedPoints: 15.5 } as Player
          ],
          fairnessScore: 78,
          winProbabilityChange: 1.2,
          recommendation: &apos;CONSIDER&apos;,
          reasoning: &apos;2-for-1 consolidates talent. Consider if you have depth at RB/TE.&apos;,
          positionalImpact: {
}
            improves: [&apos;WR&apos;],
            weakens: [&apos;RB&apos;, &apos;TE&apos;]
          },
          confidence: 0.72
        },
        {
}
          id: &apos;3&apos;,
          partnerTeam: league.teams[6],
          givePlayers: [
            { id: &apos;6&apos;, name: &apos;Player F&apos;, position: &apos;QB&apos;, team: &apos;BUF&apos;, projectedPoints: 22.5 } as Player
          ],
          receivePlayers: [
            { id: &apos;7&apos;, name: &apos;Player G&apos;, position: &apos;QB&apos;, team: &apos;LAC&apos;, projectedPoints: 18.5 } as Player,
            { id: &apos;8&apos;, name: &apos;Player H&apos;, position: &apos;WR&apos;, team: &apos;MIN&apos;, projectedPoints: 11.2 } as Player
          ],
          fairnessScore: 65,
          winProbabilityChange: -2.1,
          recommendation: &apos;REJECT&apos;,
          reasoning: &apos;Significant downgrade at QB not offset by WR addition.&apos;,
          positionalImpact: {
}
            improves: [&apos;WR&apos;],
            weakens: [&apos;QB&apos;]
          },
          confidence: 0.88
        }
      ];

      setOpportunities(mockOpportunities);
      setSelectedOpp(mockOpportunities[0]);
    } catch (error) {
}
      console.error(&apos;Failed to analyze trades:&apos;, error);
    } finally {
}
      setIsAnalyzing(false);
    }
  };

  // Auto-analyze on mount
  useEffect(() => {
}
    if (userTeam && opportunities.length === 0) {
}
      analyzeTradeOpportunities();
    }
  }, [userTeam]);

  const getFairnessColor = (score: number) => {
}
    if (score >= 85) return &apos;text-green-400&apos;;
    if (score >= 70) return &apos;text-yellow-400&apos;;
    return &apos;text-orange-400&apos;;
  };

  const getRecommendationStyle = (rec: string) => {
}
    switch (rec) {
}
      case &apos;ACCEPT&apos;:
        return { bg: &apos;bg-green-500/20&apos;, border: &apos;border-green-500/30&apos;, text: &apos;text-green-400&apos; };
      case &apos;REJECT&apos;:
        return { bg: &apos;bg-red-500/20&apos;, border: &apos;border-red-500/30&apos;, text: &apos;text-red-400&apos; };
      default:
        return { bg: &apos;bg-yellow-500/20&apos;, border: &apos;border-yellow-500/30&apos;, text: &apos;text-yellow-400&apos; };
    }
  };

  const getWinProbColor = (change: number) => {
}
    if (change > 2) return &apos;text-green-400&apos;;
    if (change > 0) return &apos;text-green-300&apos;;
    if (change > -2) return &apos;text-orange-400&apos;;
    return &apos;text-red-400&apos;;
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
            <Button>
              variant={viewMode === &apos;opportunities&apos; ? &apos;primary&apos; : &apos;secondary&apos;}
              size="sm"
              onClick={() => setViewMode(&apos;opportunities&apos;)}
              className="text-xs px-2 py-1 sm:px-4 md:px-6 lg:px-8"
            >
//               Opportunities
            </Button>
            <Button>
              variant={viewMode === &apos;analyzer&apos; ? &apos;primary&apos; : &apos;secondary&apos;}
              size="sm"
              onClick={() => setViewMode(&apos;analyzer&apos;)}
              className="text-xs px-2 py-1 sm:px-4 md:px-6 lg:px-8"
            >
//               Analyzer
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:px-4 md:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {viewMode === &apos;opportunities&apos; && (
}
            <motion.div
              key="opportunities"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2 sm:px-4 md:px-6 lg:px-8"
            >
              {opportunities.map((opp, index) => {
}
                const style = getRecommendationStyle(opp.recommendation);
                return (
                  <motion.div
                    key={opp.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedOpp(opp)}
                    className={`${style.bg} rounded-lg p-3 border ${style.border} cursor-pointer hover:border-opacity-50 transition-all ${
}
                      selectedOpp?.id === opp.id ? &apos;ring-2 ring-primary-500/50&apos; : &apos;&apos;
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
                              {opp.winProbabilityChange > 0 ? &apos;+&apos; : &apos;&apos;}{opp.winProbabilityChange.toFixed(1)}%
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
}
                            <p key={i} className="text-orange-400 sm:px-4 md:px-6 lg:px-8">
                              {p.name} ({p.position})
                            </p>
                          ))}
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1 sm:px-4 md:px-6 lg:px-8">You Get:</p>
                          {opp.receivePlayers.map((p, i) => (
}
                            <p key={i} className="text-green-400 sm:px-4 md:px-6 lg:px-8">
                              {p.name} ({p.position})
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 sm:px-4 md:px-6 lg:px-8">{opp.reasoning}</p>

                    {opp.positionalImpact && (
}
                      <div className="flex items-center gap-3 mt-2 sm:px-4 md:px-6 lg:px-8">
                        {opp.positionalImpact.improves.length > 0 && (
}
                          <div className="flex items-center gap-1 sm:px-4 md:px-6 lg:px-8">
                            <span className="text-xs text-green-400 sm:px-4 md:px-6 lg:px-8">↑</span>
                            <span className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
                              {opp.positionalImpact.improves.join(&apos;, &apos;)}
                            </span>
                          </div>
                        )}
                        {opp.positionalImpact.weakens.length > 0 && (
}
                          <div className="flex items-center gap-1 sm:px-4 md:px-6 lg:px-8">
                            <span className="text-xs text-red-400 sm:px-4 md:px-6 lg:px-8">↓</span>
                            <span className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
                              {opp.positionalImpact.weakens.join(&apos;, &apos;)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {opportunities.length === 0 && !isAnalyzing && (
}
                <div className="text-center py-8 sm:px-4 md:px-6 lg:px-8">
                  <p className="text-gray-400 text-sm sm:px-4 md:px-6 lg:px-8">No trade opportunities found</p>
                  <Button>
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

          {viewMode === &apos;analyzer&apos; && selectedOpp && (
}
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
}
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
}
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
}
                            selectedOpp.fairnessScore >= 85 
                              ? &apos;from-green-400 to-green-500&apos; 
                              : selectedOpp.fairnessScore >= 70 
                              ? &apos;from-yellow-400 to-yellow-500&apos;
                              : &apos;from-orange-400 to-orange-500&apos;
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
                      {selectedOpp.winProbabilityChange > 0 ? &apos;+&apos; : &apos;&apos;}{selectedOpp.winProbabilityChange.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 sm:px-4 md:px-6 lg:px-8">
                <Button>
                  variant="success"
                  size="sm"
                  className="flex-1 sm:px-4 md:px-6 lg:px-8"
                  onClick={() => console.log(&apos;Propose trade&apos;)}
                >
                  <span className="mr-1 sm:px-4 md:px-6 lg:px-8">✓</span>
                  Propose Trade
                </Button>
                <Button>
                  variant="default"
                  size="sm"
                  className="flex-1 sm:px-4 md:px-6 lg:px-8"
                  onClick={() => console.log(&apos;Negotiate&apos;)}
                >
                  <span className="mr-1 sm:px-4 md:px-6 lg:px-8">💬</span>
//                   Negotiate
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {isAnalyzing && (
}
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

const TradeOpportunityWidgetWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <TradeOpportunityWidget {...props} />
  </ErrorBoundary>
);

export default React.memo(TradeOpportunityWidgetWithErrorBoundary);