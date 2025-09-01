/**
 * Team Optimization Dashboard Component
 * Interactive UI for advanced team optimization and strategic management
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo, useState, useEffect } from &apos;react&apos;;
import { 
}
  Brain, 
  TrendingUp, 
  Target, 
  Shield, 
  Award,
  Activity,
  AlertTriangle,
  ChevronRight,
  RefreshCw,
  Settings,
  Users,
  BarChart3,
  Zap,
  Trophy,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Calendar,
  DollarSign,
  UserPlus,
  UserMinus,
  FileText,
//   Info
} from &apos;lucide-react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { 
}
  advancedTeamOptimizer,
  type OptimizedTeam,
  type OptimizationOptions,
  type EnhancedPlayer,
  type TradeTarget,
  type WaiverTarget,
  type LineupConfiguration,
  type StartSitDecision
} from &apos;../../services/advancedTeamOptimizer&apos;;
import { useAuth } from &apos;../../contexts/AuthContext&apos;;
import { toast } from &apos;react-hot-toast&apos;;

interface TeamOptimizationDashboardProps {
}
  leagueId: string;
  teamId: string;
  currentWeek: number;
  scoringSystem: &apos;standard&apos; | &apos;ppr&apos; | &apos;half_ppr&apos; | &apos;superflex&apos;;

}

export const TeamOptimizationDashboard: React.FC<TeamOptimizationDashboardProps> = ({
}
  leagueId,
  teamId,
  currentWeek,
//   scoringSystem
}: any) => {
}
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [optimizedTeam, setOptimizedTeam] = useState<OptimizedTeam | null>(null);
  const [activeTab, setActiveTab] = useState<&apos;overview&apos; | &apos;lineup&apos; | &apos;trades&apos; | &apos;waivers&apos; | &apos;strategy&apos;>(&apos;overview&apos;);
  const [optimizationStrategy, setOptimizationStrategy] = useState<&apos;win_now&apos; | &apos;balanced&apos; | &apos;rebuild&apos;>(&apos;balanced&apos;);
  const [autoOptimize, setAutoOptimize] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);

  useEffect(() => {
}
    if (autoOptimize) {
}
      const interval = setInterval(runOptimization, 60 * 60 * 1000); // Every hour
      return () => clearInterval(interval);
    }
  }, [autoOptimize]);

  const runOptimization = async () => {
}
    setLoading(true);
    try {
}
      // Get roster data (mock for now)
      const roster = await fetchRoster();
      
      const options: OptimizationOptions = {
}
        strategy: optimizationStrategy,
        scoringSystem,
        leagueSize: 10,
        currentWeek: selectedWeek,
        playoffWeeks: [14, 15, 16],
        rosterRequirements: {
}
          qb: { min: 1, max: 2 },
          rb: { min: 2, max: 6 },
          wr: { min: 2, max: 6 },
          te: { min: 1, max: 3 },
          flex: { min: 1, max: 2, eligible: [&apos;RB&apos;, &apos;WR&apos;, &apos;TE&apos;] },
          k: { min: 1, max: 2 },
          def: { min: 1, max: 2 },
          bench: 6,
          ir: 2

      };

      const result = await advancedTeamOptimizer.optimizeTeam(roster, options);
      setOptimizedTeam(result);
      
      if (result.optimizationScore > 80) {
}
        toast.success(`Team optimized! Score: ${result.optimizationScore.toFixed(1)}/100`);
      } else {
}
        toast.warning(`Optimization complete. Score: ${result.optimizationScore.toFixed(1)}/100 - Improvements needed`);
  } finally {
}
      setLoading(false);

  };

  const fetchRoster = async (): Promise<EnhancedPlayer[]> => {
}
    // Mock implementation - would fetch real roster data
    return [];
  };

  const tabs = [
    { id: &apos;overview&apos;, label: &apos;Overview&apos;, icon: Brain },
    { id: &apos;lineup&apos;, label: &apos;Lineup&apos;, icon: Users },
    { id: &apos;trades&apos;, label: &apos;Trades&apos;, icon: ArrowUpRight },
    { id: &apos;waivers&apos;, label: &apos;Waivers&apos;, icon: UserPlus },
    { id: &apos;strategy&apos;, label: &apos;Strategy&apos;, icon: Target }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 sm:px-4 md:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-xl border-b border-white/10 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                <Brain className="w-8 h-8 text-purple-400 sm:px-4 md:px-6 lg:px-8" />
                Team Optimization Dashboard
              </h1>
              <p className="text-purple-200 mt-1 sm:px-4 md:px-6 lg:px-8">
                AI-powered team management and strategic optimization
              </p>
            </div>
            
            <div className="flex items-center gap-4 sm:px-4 md:px-6 lg:px-8">
              {/* Auto-optimize toggle */}
              <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                <label className="text-white text-sm sm:px-4 md:px-6 lg:px-8">Auto-optimize</label>
                <button
                  onClick={() => setAutoOptimize(!autoOptimize)}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
}
                      autoOptimize ? &apos;translate-x-6&apos; : &apos;translate-x-1&apos;
                    }`}
                  />
                </button>
              </div>

              {/* Strategy selector */}
              <select
                value={optimizationStrategy}
                onChange={(e: any) => setOptimizationStrategy(e.target.value as any)}
              >
                <option value="win_now">Win Now</option>
                <option value="balanced">Balanced</option>
                <option value="rebuild">Rebuild</option>
              </select>

              {/* Run optimization button */}
              <button
                onClick={runOptimization}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 sm:px-4 md:px-6 lg:px-8"
               aria-label="Action button">
                {loading ? (
}
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin sm:px-4 md:px-6 lg:px-8" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                    Optimize Now
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6 sm:px-4 md:px-6 lg:px-8">
            {tabs.map((tab: any) => {
}
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}`}
                >
                  <Icon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === &apos;overview&apos; && (
}
            <OverviewTab optimizedTeam={optimizedTeam} />
          )}
          {activeTab === &apos;lineup&apos; && (
}
            <LineupTab optimizedTeam={optimizedTeam} week={selectedWeek} />
          )}
          {activeTab === &apos;trades&apos; && (
}
            <TradesTab tradeTargets={optimizedTeam?.tradeTargets || []} />
          )}
          {activeTab === &apos;waivers&apos; && (
}
            <WaiversTab waiverTargets={optimizedTeam?.waiverTargets || []} />
          )}
          {activeTab === &apos;strategy&apos; && (
}
            <StrategyTab optimizedTeam={optimizedTeam} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab: React.FC<{ optimizedTeam: OptimizedTeam | null }> = ({ optimizedTeam }: any) => {
}
  if (!optimizedTeam) {
}
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="text-center py-12 sm:px-4 md:px-6 lg:px-8"
      >
        <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4 sm:px-4 md:px-6 lg:px-8" />
        <h3 className="text-xl text-white mb-2 sm:px-4 md:px-6 lg:px-8">No Optimization Data</h3>
        <p className="text-white/60 sm:px-4 md:px-6 lg:px-8">Run optimization to see results</p>
      </motion.div>
    );

  const metrics = [
    {
}
      label: &apos;Optimization Score&apos;,
      value: optimizedTeam.optimizationScore.toFixed(1),
      suffix: &apos;/100&apos;,
      icon: Brain,
      color: &apos;purple&apos;
    },
    {
}
      label: &apos;Playoff Probability&apos;,
      value: (optimizedTeam.projectedOutcome.playoffProbability * 100).toFixed(1),
      suffix: &apos;%&apos;,
      icon: Trophy,
      color: &apos;yellow&apos;
    },
    {
}
      label: &apos;Championship Odds&apos;,
      value: (optimizedTeam.projectedOutcome.championshipProbability * 100).toFixed(1),
      suffix: &apos;%&apos;,
      icon: Award,
      color: &apos;green&apos;
    },
    {
}
      label: &apos;Projected Finish&apos;,
      value: optimizedTeam.projectedOutcome.expectedFinish.toFixed(0),
      suffix: &apos;th&apos;,
      icon: Target,
      color: &apos;blue&apos;

  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 sm:px-4 md:px-6 lg:px-8"
    >
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
}
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/10 sm:px-4 md:px-6 lg:px-8"
            >
              <div className="flex items-start justify-between sm:px-4 md:px-6 lg:px-8">
                <div>
                  <p className="text-white/60 text-sm sm:px-4 md:px-6 lg:px-8">{metric.label}</p>
                  <p className="text-3xl font-bold text-white mt-2 sm:px-4 md:px-6 lg:px-8">
                    {metric.value}
                    <span className="text-xl text-white/60 sm:px-4 md:px-6 lg:px-8">{metric.suffix}</span>
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-${metric.color}-500/20`}>
                  <Icon className={`w-6 h-6 text-${metric.color}-400`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Roster Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths and Weaknesses */}
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/10 sm:px-4 md:px-6 lg:px-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
            <Shield className="w-5 h-5 text-green-400 sm:px-4 md:px-6 lg:px-8" />
            Roster Analysis
          </h3>
          
          <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
            <div>
              <h4 className="text-green-400 font-semibold mb-2 sm:px-4 md:px-6 lg:px-8">Strengths</h4>
              <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                {Array.from(optimizedTeam.roster.strengthsByPosition.entries())
}
                  .filter(([_, score]) => score > 1)
                  .map(([position, score]) => (
                    <div key={position} className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                      <span className="text-white/80 sm:px-4 md:px-6 lg:px-8">{position}</span>
                      <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                        <div className="w-32 bg-white/10 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                          <div
                            className="bg-green-500 h-2 rounded-full sm:px-4 md:px-6 lg:px-8"
                            style={{ width: `${Math.min(100, score * 50)}%` }}
                          />
                        </div>
                        <span className="text-green-400 text-sm sm:px-4 md:px-6 lg:px-8">
                          +{((score - 1) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <h4 className="text-red-400 font-semibold mb-2 sm:px-4 md:px-6 lg:px-8">Weaknesses</h4>
              <div className="space-y-1 sm:px-4 md:px-6 lg:px-8">
                {optimizedTeam.roster.weaknesses.map((weakness: any) => (
}
                  <div key={weakness} className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                    <AlertTriangle className="w-4 h-4 text-red-400 sm:px-4 md:px-6 lg:px-8" />
                    <span className="text-white/80 sm:px-4 md:px-6 lg:px-8">{weakness}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/10 sm:px-4 md:px-6 lg:px-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
            <Target className="w-5 h-5 text-purple-400 sm:px-4 md:px-6 lg:px-8" />
//             Recommendations
          </h3>
          
          <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
            {optimizedTeam.roster.recommendations.map((rec, index) => (
}
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20 sm:px-4 md:px-6 lg:px-8"
              >
                <ChevronRight className="w-5 h-5 text-purple-400 mt-0.5 sm:px-4 md:px-6 lg:px-8" />
                <p className="text-white/90 sm:px-4 md:px-6 lg:px-8">{rec}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Season Projection */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/10 sm:px-4 md:px-6 lg:px-8">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
          <TrendingUp className="w-5 h-5 text-blue-400 sm:px-4 md:px-6 lg:px-8" />
          Season Projection
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-white/60 text-sm mb-1 sm:px-4 md:px-6 lg:px-8">Weekly Average</p>
            <p className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">
              {optimizedTeam.projectedOutcome.weeklyProjection.toFixed(1)} pts
            </p>
          </div>
          <div>
            <p className="text-white/60 text-sm mb-1 sm:px-4 md:px-6 lg:px-8">Season Total</p>
            <p className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">
              {optimizedTeam.projectedOutcome.seasonProjection.toFixed(0)} pts
            </p>
          </div>
          <div>
            <p className="text-white/60 text-sm mb-1 sm:px-4 md:px-6 lg:px-8">Confidence Range</p>
            <p className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">
              {optimizedTeam.projectedOutcome.confidenceInterval[0].toFixed(0)} - {&apos; &apos;}
              {optimizedTeam.projectedOutcome.confidenceInterval[1].toFixed(0)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Lineup Tab Component
const LineupTab: React.FC<{ optimizedTeam: OptimizedTeam | null; week: number }> = ({ optimizedTeam, week }: any) => {
}
  if (!optimizedTeam) {
}
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 sm:px-4 md:px-6 lg:px-8"
      >
        <Users className="w-16 h-16 text-purple-400 mx-auto mb-4 sm:px-4 md:px-6 lg:px-8" />
        <h3 className="text-xl text-white mb-2 sm:px-4 md:px-6 lg:px-8">No Lineup Data</h3>
        <p className="text-white/60 sm:px-4 md:px-6 lg:px-8">Run optimization to see optimal lineup</p>
      </motion.div>
    );

  const lineup = optimizedTeam.weeklyLineup;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 sm:px-4 md:px-6 lg:px-8"
    >
      {/* Lineup Overview */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/10 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6 sm:px-4 md:px-6 lg:px-8">
          <h3 className="text-xl font-bold text-white sm:px-4 md:px-6 lg:px-8">Week {week} Optimal Lineup</h3>
          <div className="flex items-center gap-4 sm:px-4 md:px-6 lg:px-8">
            <div className="text-right sm:px-4 md:px-6 lg:px-8">
              <p className="text-white/60 text-sm sm:px-4 md:px-6 lg:px-8">Projected Points</p>
              <p className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">
                {lineup.optimal.projectedPoints.toFixed(1)}
              </p>
            </div>
            <div className="text-right sm:px-4 md:px-6 lg:px-8">
              <p className="text-white/60 text-sm sm:px-4 md:px-6 lg:px-8">Confidence</p>
              <p className="text-2xl font-bold text-purple-400 sm:px-4 md:px-6 lg:px-8">
                {(lineup.confidenceScore * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        </div>

        {/* Starting Lineup */}
        <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
          {Array.from(lineup.optimal.players.entries()).map(([position, player]) => (
}
            <div
              key={position}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors sm:px-4 md:px-6 lg:px-8"
            >
              <div className="flex items-center gap-4 sm:px-4 md:px-6 lg:px-8">
                <div className="w-16 text-center sm:px-4 md:px-6 lg:px-8">
                  <span className="text-purple-400 font-semibold sm:px-4 md:px-6 lg:px-8">{position}</span>
                </div>
                <div>
                  <p className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">{player.name}</p>
                  <p className="text-white/60 text-sm sm:px-4 md:px-6 lg:px-8">
                    {player.team} vs {player.matchupData.currentWeek.opponent}
                  </p>
                </div>
              </div>
              <div className="text-right sm:px-4 md:px-6 lg:px-8">
                <p className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">
                  {player.projections.weekly.toFixed(1)} pts
                </p>
                <p className="text-white/60 text-sm sm:px-4 md:px-6 lg:px-8">
                  Floor: {player.stats.floor.toFixed(1)} | Ceiling: {player.stats.ceiling.toFixed(1)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Start/Sit Decisions */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/10 sm:px-4 md:px-6 lg:px-8">
        <h3 className="text-xl font-bold text-white mb-4 sm:px-4 md:px-6 lg:px-8">Start/Sit Decisions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lineup.startSitDecisions.slice(0, 6).map((decision: any) => (
}
            <div
              key={decision.player.id}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg sm:px-4 md:px-6 lg:px-8"
            >
              <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
}
                    decision.decision === &apos;start&apos;
                      ? &apos;bg-green-500/20 text-green-400&apos;
                      : &apos;bg-red-500/20 text-red-400&apos;
                  }`}
                >
                  {decision.decision.toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">{decision.player.name}</p>
                  <p className="text-white/60 text-sm sm:px-4 md:px-6 lg:px-8">{decision.reasoning}</p>
                </div>
              </div>
              <div className="text-right sm:px-4 md:px-6 lg:px-8">
                <p className="text-white/80 text-sm sm:px-4 md:px-6 lg:px-8">
                  {(decision.confidence * 100).toFixed(0)}% conf
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Trades Tab Component
const TradesTab: React.FC<{ tradeTargets: TradeTarget[] }> = ({ tradeTargets }: any) => {
}
  if (tradeTargets.length === 0) {
}
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 sm:px-4 md:px-6 lg:px-8"
      >
        <ArrowUpRight className="w-16 h-16 text-purple-400 mx-auto mb-4 sm:px-4 md:px-6 lg:px-8" />
        <h3 className="text-xl text-white mb-2 sm:px-4 md:px-6 lg:px-8">No Trade Targets</h3>
        <p className="text-white/60 sm:px-4 md:px-6 lg:px-8">Run optimization to see trade recommendations</p>
      </motion.div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 sm:px-4 md:px-6 lg:px-8"
    >
      {tradeTargets.map((target, index) => (
}
        <motion.div
          key={target.player.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/10 sm:px-4 md:px-6 lg:px-8"
        >
          <div className="flex justify-between items-start mb-4 sm:px-4 md:px-6 lg:px-8">
            <div>
              <div className="flex items-center gap-3 mb-2 sm:px-4 md:px-6 lg:px-8">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
}
                    target.targetType === &apos;buy_low&apos;
                      ? &apos;bg-green-500/20 text-green-400&apos;
                      : target.targetType === &apos;sell_high&apos;
                      ? &apos;bg-red-500/20 text-red-400&apos;
                      : &apos;bg-yellow-500/20 text-yellow-400&apos;
                  }`}
                >
                  {target.targetType.replace(&apos;_&apos;, &apos; &apos;).toUpperCase()}
                </span>
                <span className="text-white/60 sm:px-4 md:px-6 lg:px-8">
                  Urgency: {(target.urgency * 100).toFixed(0)}%
                </span>
              </div>
              <h3 className="text-xl font-bold text-white sm:px-4 md:px-6 lg:px-8">{target.player.name}</h3>
              <p className="text-white/60 sm:px-4 md:px-6 lg:px-8">
                {target.player.position} - {target.player.team}
              </p>
            </div>
            <div className="text-right sm:px-4 md:px-6 lg:px-8">
              <p className="text-white/60 text-sm sm:px-4 md:px-6 lg:px-8">Target Value</p>
              <p className="text-2xl font-bold text-purple-400 sm:px-4 md:px-6 lg:px-8">
                {target.targetPrice.toFixed(0)}
              </p>
              <p className="text-white/60 text-sm sm:px-4 md:px-6 lg:px-8">
                Fair: {target.fairValue.toFixed(0)}
              </p>
            </div>
          </div>

          <p className="text-white/80 mb-4 sm:px-4 md:px-6 lg:px-8">{target.reasoning}</p>

          {target.packages.length > 0 && (
}
            <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
              <h4 className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">Suggested Packages:</h4>
              {target.packages.slice(0, 2).map((pkg, pkgIndex) => (
}
                <div
                  key={pkgIndex}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg sm:px-4 md:px-6 lg:px-8"
                >
                  <div className="flex items-center gap-4 sm:px-4 md:px-6 lg:px-8">
                    <span className="text-red-400 sm:px-4 md:px-6 lg:px-8">Give:</span>
                    <span className="text-white sm:px-4 md:px-6 lg:px-8">
                      {pkg.give.map((p: any) => p.name).join(&apos;, &apos;)}
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/40 sm:px-4 md:px-6 lg:px-8" />
                  <div className="flex items-center gap-4 sm:px-4 md:px-6 lg:px-8">
                    <span className="text-green-400 sm:px-4 md:px-6 lg:px-8">Get:</span>
                    <span className="text-white sm:px-4 md:px-6 lg:px-8">
                      {pkg.receive.map((p: any) => p.name).join(&apos;, &apos;)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Waivers Tab Component
const WaiversTab: React.FC<{ waiverTargets: WaiverTarget[] }> = ({ waiverTargets }: any) => {
}
  if (waiverTargets.length === 0) {
}
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 sm:px-4 md:px-6 lg:px-8"
      >
        <UserPlus className="w-16 h-16 text-purple-400 mx-auto mb-4 sm:px-4 md:px-6 lg:px-8" />
        <h3 className="text-xl text-white mb-2 sm:px-4 md:px-6 lg:px-8">No Waiver Targets</h3>
        <p className="text-white/60 sm:px-4 md:px-6 lg:px-8">Run optimization to see waiver recommendations</p>
      </motion.div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 sm:px-4 md:px-6 lg:px-8"
    >
      {waiverTargets.map((target, index) => (
}
        <motion.div
          key={target.player.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/10 sm:px-4 md:px-6 lg:px-8"
        >
          <div className="flex justify-between items-start sm:px-4 md:px-6 lg:px-8">
            <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-2 sm:px-4 md:px-6 lg:px-8">
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-sm font-semibold sm:px-4 md:px-6 lg:px-8">
                  Priority #{target.priority}
                </span>
                <span className="text-white/60 sm:px-4 md:px-6 lg:px-8">
                  Impact: +{target.expectedImpact.toFixed(1)} pts
                </span>
              </div>
              <h3 className="text-lg font-bold text-white sm:px-4 md:px-6 lg:px-8">{target.player.name}</h3>
              <p className="text-white/60 mb-3 sm:px-4 md:px-6 lg:px-8">
                {target.player.position} - {target.player.team}
              </p>
              <p className="text-white/80 mb-3 sm:px-4 md:px-6 lg:px-8">{target.reasoning}</p>
              
              <div className="flex items-center gap-6 sm:px-4 md:px-6 lg:px-8">
                <div>
                  <p className="text-white/60 text-sm sm:px-4 md:px-6 lg:px-8">FAAB Bid</p>
                  <p className="text-xl font-bold text-green-400 sm:px-4 md:px-6 lg:px-8">
                    ${target.faabBid}
                  </p>
                </div>
                <div>
                  <p className="text-white/60 text-sm sm:px-4 md:px-6 lg:px-8">Drop</p>
                  <p className="text-lg text-red-400 sm:px-4 md:px-6 lg:px-8">
                    {target.dropCandidate.name}
                  </p>
                </div>
              </div>
            </div>
            
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
              Add Claim
            </button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

// Strategy Tab Component
const StrategyTab: React.FC<{ optimizedTeam: OptimizedTeam | null }> = ({ optimizedTeam }: any) => {
}
  if (!optimizedTeam) {
}
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 sm:px-4 md:px-6 lg:px-8"
      >
        <Target className="w-16 h-16 text-purple-400 mx-auto mb-4 sm:px-4 md:px-6 lg:px-8" />
        <h3 className="text-xl text-white mb-2 sm:px-4 md:px-6 lg:px-8">No Strategy Data</h3>
        <p className="text-white/60 sm:px-4 md:px-6 lg:px-8">Run optimization to see strategic recommendations</p>
      </motion.div>
    );

  const strategy = optimizedTeam.seasonStrategy;

  if (isLoading) {
}
    return (
      <div className="flex justify-center items-center p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 sm:px-4 md:px-6 lg:px-8"></div>
        <span className="ml-2 sm:px-4 md:px-6 lg:px-8">Loading...</span>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 sm:px-4 md:px-6 lg:px-8"
    >
      {/* Current Phase */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/10 sm:px-4 md:px-6 lg:px-8">
        <h3 className="text-xl font-bold text-white mb-4 sm:px-4 md:px-6 lg:px-8">Season Phase</h3>
        <div className="flex items-center gap-4 sm:px-4 md:px-6 lg:px-8">
          <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-2 sm:px-4 md:px-6 lg:px-8">
              <Calendar className="w-5 h-5 text-purple-400 sm:px-4 md:px-6 lg:px-8" />
              <span className="text-lg font-semibold text-white capitalize sm:px-4 md:px-6 lg:px-8">
                {strategy.currentPhase.replace(&apos;_&apos;, &apos; &apos;)}
              </span>
            </div>
            <p className="text-white/60 sm:px-4 md:px-6 lg:px-8">
              Approach: <span className="text-purple-400 capitalize sm:px-4 md:px-6 lg:px-8">
                {strategy.approach.replace(&apos;_&apos;, &apos; &apos;)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Priorities */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/10 sm:px-4 md:px-6 lg:px-8">
        <h3 className="text-xl font-bold text-white mb-4 sm:px-4 md:px-6 lg:px-8">Strategic Priorities</h3>
        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
          {strategy.priorities.map((priority, index) => (
}
            <div key={index} className="border-l-4 border-purple-500 pl-4 sm:px-4 md:px-6 lg:px-8">
              <div className="flex justify-between items-start mb-2 sm:px-4 md:px-6 lg:px-8">
                <h4 className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">{priority.priority}</h4>
                <span className="text-purple-400 text-sm sm:px-4 md:px-6 lg:px-8">
                  {(priority.importance * 100).toFixed(0)}% importance
                </span>
              </div>
              <div className="space-y-1 sm:px-4 md:px-6 lg:px-8">
                {priority.actions.map((action, actionIndex) => (
}
                  <div key={actionIndex} className="flex items-center gap-2 text-white/80 text-sm sm:px-4 md:px-6 lg:px-8">
                    <ChevronRight className="w-4 h-4 text-white/40 sm:px-4 md:px-6 lg:px-8" />
                    {action}
                  </div>
                ))}
              </div>
              <p className="text-white/60 text-sm mt-2 sm:px-4 md:px-6 lg:px-8">Timeline: {priority.timeline}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/10 sm:px-4 md:px-6 lg:px-8">
        <h3 className="text-xl font-bold text-white mb-4 sm:px-4 md:px-6 lg:px-8">Season Milestones</h3>
        <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
          {strategy.milestones.map((milestone, index) => (
}
            <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg sm:px-4 md:px-6 lg:px-8">
              <div>
                <p className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">Week {milestone.week}: {milestone.goal}</p>
                <p className="text-white/60 text-sm sm:px-4 md:px-6 lg:px-8">
                  {milestone.metric}: {milestone.current}/{milestone.target}
                </p>
              </div>
              <div className="w-32 bg-white/10 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                <div
                  className="bg-purple-500 h-2 rounded-full sm:px-4 md:px-6 lg:px-8"
                  style={{ width: `${(milestone.current / milestone.target) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const TeamOptimizationDashboardWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <TeamOptimizationDashboard {...props} />
  </ErrorBoundary>
);

export default React.memo(TeamOptimizationDashboardWithErrorBoundary);