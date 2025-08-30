/**
 * Team Optimization Dashboard Component
 * Interactive UI for advanced team optimization and strategic management
 */

import React, { useState, useEffect } from 'react';
import { 
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
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  advancedTeamOptimizer,
  type OptimizedTeam,
  type OptimizationOptions,
  type EnhancedPlayer,
  type TradeTarget,
  type WaiverTarget,
  type LineupConfiguration,
  type StartSitDecision
} from '../../services/advancedTeamOptimizer';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface TeamOptimizationDashboardProps {
  leagueId: string;
  teamId: string;
  currentWeek: number;
  scoringSystem: 'standard' | 'ppr' | 'half_ppr' | 'superflex';
}

export const TeamOptimizationDashboard: React.FC<TeamOptimizationDashboardProps> = ({
  leagueId,
  teamId,
  currentWeek,
  scoringSystem
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [optimizedTeam, setOptimizedTeam] = useState<OptimizedTeam | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'lineup' | 'trades' | 'waivers' | 'strategy'>('overview');
  const [optimizationStrategy, setOptimizationStrategy] = useState<'win_now' | 'balanced' | 'rebuild'>('balanced');
  const [autoOptimize, setAutoOptimize] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);

  useEffect(() => {
    if (autoOptimize) {
      const interval = setInterval(runOptimization, 60 * 60 * 1000); // Every hour
      return () => clearInterval(interval);
    }
  }, [autoOptimize]);

  const runOptimization = async () => {
    setLoading(true);
    try {
      // Get roster data (mock for now)
      const roster = await fetchRoster();
      
      const options: OptimizationOptions = {
        strategy: optimizationStrategy,
        scoringSystem,
        leagueSize: 10,
        currentWeek: selectedWeek,
        playoffWeeks: [14, 15, 16],
        rosterRequirements: {
          qb: { min: 1, max: 2 },
          rb: { min: 2, max: 6 },
          wr: { min: 2, max: 6 },
          te: { min: 1, max: 3 },
          flex: { min: 1, max: 2, eligible: ['RB', 'WR', 'TE'] },
          k: { min: 1, max: 2 },
          def: { min: 1, max: 2 },
          bench: 6,
          ir: 2
        }
      };

      const result = await advancedTeamOptimizer.optimizeTeam(roster, options);
      setOptimizedTeam(result);
      
      if (result.optimizationScore > 80) {
        toast.success(`Team optimized! Score: ${result.optimizationScore.toFixed(1)}/100`);
      } else {
        toast.warning(`Optimization complete. Score: ${result.optimizationScore.toFixed(1)}/100 - Improvements needed`);
      }
    } catch (error) {
      console.error('Optimization failed:', error);
      toast.error('Failed to optimize team');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoster = async (): Promise<EnhancedPlayer[]> => {
    // Mock implementation - would fetch real roster data
    return [];
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Brain },
    { id: 'lineup', label: 'Lineup', icon: Users },
    { id: 'trades', label: 'Trades', icon: ArrowUpRight },
    { id: 'waivers', label: 'Waivers', icon: UserPlus },
    { id: 'strategy', label: 'Strategy', icon: Target }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Brain className="w-8 h-8 text-purple-400" />
                Team Optimization Dashboard
              </h1>
              <p className="text-purple-200 mt-1">
                AI-powered team management and strategic optimization
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Auto-optimize toggle */}
              <div className="flex items-center gap-2">
                <label className="text-white text-sm">Auto-optimize</label>
                <button
                  onClick={() => setAutoOptimize(!autoOptimize)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    autoOptimize ? 'bg-purple-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoOptimize ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Strategy selector */}
              <select
                value={optimizationStrategy}
                onChange={(e) => setOptimizationStrategy(e.target.value as any)}
                className="bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20"
              >
                <option value="win_now">Win Now</option>
                <option value="balanced">Balanced</option>
                <option value="rebuild">Rebuild</option>
              </select>

              {/* Run optimization button */}
              <button
                onClick={runOptimization}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Optimize Now
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-white/10 text-white border-b-2 border-purple-400'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
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
          {activeTab === 'overview' && (
            <OverviewTab optimizedTeam={optimizedTeam} />
          )}
          {activeTab === 'lineup' && (
            <LineupTab optimizedTeam={optimizedTeam} week={selectedWeek} />
          )}
          {activeTab === 'trades' && (
            <TradesTab tradeTargets={optimizedTeam?.tradeTargets || []} />
          )}
          {activeTab === 'waivers' && (
            <WaiversTab waiverTargets={optimizedTeam?.waiverTargets || []} />
          )}
          {activeTab === 'strategy' && (
            <StrategyTab optimizedTeam={optimizedTeam} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab: React.FC<{ optimizedTeam: OptimizedTeam | null }> = ({ optimizedTeam }) => {
  if (!optimizedTeam) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="text-center py-12"
      >
        <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h3 className="text-xl text-white mb-2">No Optimization Data</h3>
        <p className="text-white/60">Run optimization to see results</p>
      </motion.div>
    );
  }

  const metrics = [
    {
      label: 'Optimization Score',
      value: optimizedTeam.optimizationScore.toFixed(1),
      suffix: '/100',
      icon: Brain,
      color: 'purple'
    },
    {
      label: 'Playoff Probability',
      value: (optimizedTeam.projectedOutcome.playoffProbability * 100).toFixed(1),
      suffix: '%',
      icon: Trophy,
      color: 'yellow'
    },
    {
      label: 'Championship Odds',
      value: (optimizedTeam.projectedOutcome.championshipProbability * 100).toFixed(1),
      suffix: '%',
      icon: Award,
      color: 'green'
    },
    {
      label: 'Projected Finish',
      value: optimizedTeam.projectedOutcome.expectedFinish.toFixed(0),
      suffix: 'th',
      icon: Target,
      color: 'blue'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/60 text-sm">{metric.label}</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {metric.value}
                    <span className="text-xl text-white/60">{metric.suffix}</span>
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
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            Roster Analysis
          </h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-green-400 font-semibold mb-2">Strengths</h4>
              <div className="space-y-2">
                {Array.from(optimizedTeam.roster.strengthsByPosition.entries())
                  .filter(([_, score]) => score > 1)
                  .map(([position, score]) => (
                    <div key={position} className="flex justify-between items-center">
                      <span className="text-white/80">{position}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-white/10 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${Math.min(100, score * 50)}%` }}
                          />
                        </div>
                        <span className="text-green-400 text-sm">
                          +{((score - 1) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <h4 className="text-red-400 font-semibold mb-2">Weaknesses</h4>
              <div className="space-y-1">
                {optimizedTeam.roster.weaknesses.map((weakness) => (
                  <div key={weakness} className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-white/80">{weakness}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            Recommendations
          </h3>
          
          <div className="space-y-3">
            {optimizedTeam.roster.recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20"
              >
                <ChevronRight className="w-5 h-5 text-purple-400 mt-0.5" />
                <p className="text-white/90">{rec}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Season Projection */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Season Projection
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-white/60 text-sm mb-1">Weekly Average</p>
            <p className="text-2xl font-bold text-white">
              {optimizedTeam.projectedOutcome.weeklyProjection.toFixed(1)} pts
            </p>
          </div>
          <div>
            <p className="text-white/60 text-sm mb-1">Season Total</p>
            <p className="text-2xl font-bold text-white">
              {optimizedTeam.projectedOutcome.seasonProjection.toFixed(0)} pts
            </p>
          </div>
          <div>
            <p className="text-white/60 text-sm mb-1">Confidence Range</p>
            <p className="text-2xl font-bold text-white">
              {optimizedTeam.projectedOutcome.confidenceInterval[0].toFixed(0)} - {' '}
              {optimizedTeam.projectedOutcome.confidenceInterval[1].toFixed(0)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Lineup Tab Component
const LineupTab: React.FC<{ optimizedTeam: OptimizedTeam | null; week: number }> = ({ optimizedTeam, week }) => {
  if (!optimizedTeam) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <Users className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h3 className="text-xl text-white mb-2">No Lineup Data</h3>
        <p className="text-white/60">Run optimization to see optimal lineup</p>
      </motion.div>
    );
  }

  const lineup = optimizedTeam.weeklyLineup;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Lineup Overview */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Week {week} Optimal Lineup</h3>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-white/60 text-sm">Projected Points</p>
              <p className="text-2xl font-bold text-white">
                {lineup.optimal.projectedPoints.toFixed(1)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-sm">Confidence</p>
              <p className="text-2xl font-bold text-purple-400">
                {(lineup.confidenceScore * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        </div>

        {/* Starting Lineup */}
        <div className="space-y-3">
          {Array.from(lineup.optimal.players.entries()).map(([position, player]) => (
            <div
              key={position}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 text-center">
                  <span className="text-purple-400 font-semibold">{position}</span>
                </div>
                <div>
                  <p className="text-white font-semibold">{player.name}</p>
                  <p className="text-white/60 text-sm">
                    {player.team} vs {player.matchupData.currentWeek.opponent}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">
                  {player.projections.weekly.toFixed(1)} pts
                </p>
                <p className="text-white/60 text-sm">
                  Floor: {player.stats.floor.toFixed(1)} | Ceiling: {player.stats.ceiling.toFixed(1)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Start/Sit Decisions */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">Start/Sit Decisions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lineup.startSitDecisions.slice(0, 6).map((decision) => (
            <div
              key={decision.player.id}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    decision.decision === 'start'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {decision.decision.toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-semibold">{decision.player.name}</p>
                  <p className="text-white/60 text-sm">{decision.reasoning}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm">
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
const TradesTab: React.FC<{ tradeTargets: TradeTarget[] }> = ({ tradeTargets }) => {
  if (tradeTargets.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <ArrowUpRight className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h3 className="text-xl text-white mb-2">No Trade Targets</h3>
        <p className="text-white/60">Run optimization to see trade recommendations</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {tradeTargets.map((target, index) => (
        <motion.div
          key={target.player.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/10"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    target.targetType === 'buy_low'
                      ? 'bg-green-500/20 text-green-400'
                      : target.targetType === 'sell_high'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {target.targetType.replace('_', ' ').toUpperCase()}
                </span>
                <span className="text-white/60">
                  Urgency: {(target.urgency * 100).toFixed(0)}%
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">{target.player.name}</h3>
              <p className="text-white/60">
                {target.player.position} - {target.player.team}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-sm">Target Value</p>
              <p className="text-2xl font-bold text-purple-400">
                {target.targetPrice.toFixed(0)}
              </p>
              <p className="text-white/60 text-sm">
                Fair: {target.fairValue.toFixed(0)}
              </p>
            </div>
          </div>

          <p className="text-white/80 mb-4">{target.reasoning}</p>

          {target.packages.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-white font-semibold">Suggested Packages:</h4>
              {target.packages.slice(0, 2).map((pkg, pkgIndex) => (
                <div
                  key={pkgIndex}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-red-400">Give:</span>
                    <span className="text-white">
                      {pkg.give.map(p => p.name).join(', ')}
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/40" />
                  <div className="flex items-center gap-4">
                    <span className="text-green-400">Get:</span>
                    <span className="text-white">
                      {pkg.receive.map(p => p.name).join(', ')}
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
const WaiversTab: React.FC<{ waiverTargets: WaiverTarget[] }> = ({ waiverTargets }) => {
  if (waiverTargets.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <UserPlus className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h3 className="text-xl text-white mb-2">No Waiver Targets</h3>
        <p className="text-white/60">Run optimization to see waiver recommendations</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {waiverTargets.map((target, index) => (
        <motion.div
          key={target.player.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/10"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-sm font-semibold">
                  Priority #{target.priority}
                </span>
                <span className="text-white/60">
                  Impact: +{target.expectedImpact.toFixed(1)} pts
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{target.player.name}</h3>
              <p className="text-white/60 mb-3">
                {target.player.position} - {target.player.team}
              </p>
              <p className="text-white/80 mb-3">{target.reasoning}</p>
              
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-white/60 text-sm">FAAB Bid</p>
                  <p className="text-xl font-bold text-green-400">
                    ${target.faabBid}
                  </p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Drop</p>
                  <p className="text-lg text-red-400">
                    {target.dropCandidate.name}
                  </p>
                </div>
              </div>
            </div>
            
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Add Claim
            </button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

// Strategy Tab Component
const StrategyTab: React.FC<{ optimizedTeam: OptimizedTeam | null }> = ({ optimizedTeam }) => {
  if (!optimizedTeam) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <Target className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h3 className="text-xl text-white mb-2">No Strategy Data</h3>
        <p className="text-white/60">Run optimization to see strategic recommendations</p>
      </motion.div>
    );
  }

  const strategy = optimizedTeam.seasonStrategy;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Current Phase */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">Season Phase</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <span className="text-lg font-semibold text-white capitalize">
                {strategy.currentPhase.replace('_', ' ')}
              </span>
            </div>
            <p className="text-white/60">
              Approach: <span className="text-purple-400 capitalize">
                {strategy.approach.replace('_', ' ')}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Priorities */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">Strategic Priorities</h3>
        <div className="space-y-4">
          {strategy.priorities.map((priority, index) => (
            <div key={index} className="border-l-4 border-purple-500 pl-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-white font-semibold">{priority.priority}</h4>
                <span className="text-purple-400 text-sm">
                  {(priority.importance * 100).toFixed(0)}% importance
                </span>
              </div>
              <div className="space-y-1">
                {priority.actions.map((action, actionIndex) => (
                  <div key={actionIndex} className="flex items-center gap-2 text-white/80 text-sm">
                    <ChevronRight className="w-4 h-4 text-white/40" />
                    {action}
                  </div>
                ))}
              </div>
              <p className="text-white/60 text-sm mt-2">Timeline: {priority.timeline}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">Season Milestones</h3>
        <div className="space-y-3">
          {strategy.milestones.map((milestone, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <p className="text-white font-semibold">Week {milestone.week}: {milestone.goal}</p>
                <p className="text-white/60 text-sm">
                  {milestone.metric}: {milestone.current}/{milestone.target}
                </p>
              </div>
              <div className="w-32 bg-white/10 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
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

export default TeamOptimizationDashboard;