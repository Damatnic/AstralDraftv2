/**
 * Auto-Draft Interface Component
 * UI for executing automatic drafts for the entire league
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo, useState, useCallback, useEffect } from &apos;react&apos;;
import { 
}
  Zap, Play, Settings, TrendingUp, Users, Trophy, 
  AlertCircle, CheckCircle, Target, Brain, Sparkles,
  ChevronRight, Info, BarChart, Shield, Gauge
} from &apos;lucide-react&apos;;
import { Player, Team, PlayerPosition } from &apos;../../types&apos;;
import autoDraftService, { 
}
  TeamDraftResult, 
  AutoDraftConfig,
//   RosterRequirements 
} from &apos;../../services/autoDraftService&apos;;
import { TEAMS_2025 } from &apos;../../data/leagueData&apos;;

interface AutoDraftInterfaceProps {
}
  onDraftComplete?: (results: TeamDraftResult[]) => void;
  userId?: number;

}

const AutoDraftInterface: React.FC<AutoDraftInterfaceProps> = ({ onDraftComplete,
}
  userId = 1 
 }: any) => {
}
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftResults, setDraftResults] = useState<TeamDraftResult[] | null>(null);
  const [userResult, setUserResult] = useState<TeamDraftResult | null>(null);
  const [currentPick, setCurrentPick] = useState<string>(&apos;&apos;);
  const [draftProgress, setDraftProgress] = useState(0);
  const [selectedStrategy, setSelectedStrategy] = useState<string>(&apos;balanced&apos;);
  const [scoringType, setScoringType] = useState<&apos;standard&apos; | &apos;ppr&apos; | &apos;half_ppr&apos;>(&apos;ppr&apos;);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<&apos;overview&apos; | &apos;roster&apos; | &apos;analytics&apos; | &apos;league&apos;>(&apos;overview&apos;);

  // Draft strategies
  const strategies = [
    { 
}
      id: &apos;balanced&apos;, 
      name: &apos;Balanced&apos;, 
      icon: &apos;⚖️&apos;,
      description: &apos;Mix of RB/WR with value-based picks&apos;,
      color: &apos;bg-blue-500&apos;
    },
    { 
}
      id: &apos;rb_heavy&apos;, 
      name: &apos;RB Heavy&apos;, 
      icon: &apos;🏃&apos;,
      description: &apos;Prioritize running backs early&apos;,
      color: &apos;bg-green-500&apos;
    },
    { 
}
      id: &apos;wr_heavy&apos;, 
      name: &apos;WR Heavy&apos;, 
      icon: &apos;🎯&apos;,
      description: &apos;Load up on wide receivers&apos;,
      color: &apos;bg-purple-500&apos;
    },
    { 
}
      id: &apos;zero_rb&apos;, 
      name: &apos;Zero RB&apos;, 
      icon: &apos;🚫&apos;,
      description: &apos;Skip RBs early, focus on WR/TE&apos;,
      color: &apos;bg-red-500&apos;
    },
    { 
}
      id: &apos;hero_rb&apos;, 
      name: &apos;Hero RB&apos;, 
      icon: &apos;🦸&apos;,
      description: &apos;One elite RB, then WRs&apos;,
      color: &apos;bg-orange-500&apos;
    },
    { 
}
      id: &apos;best_available&apos;, 
      name: &apos;Best Available&apos;, 
      icon: &apos;📊&apos;,
      description: &apos;Pure value-based drafting&apos;,
      color: &apos;bg-indigo-500&apos;

  ];

  /**
   * Execute full league auto-draft
   */
  const executeAutoDraft = useCallback(async () => {
}
    setIsDrafting(true);
    setDraftProgress(0);
    setCurrentPick(&apos;Initializing draft...&apos;);

    try {
}
      // Simulate draft progress
      const progressInterval = setInterval(() => {
}
        setDraftProgress(prev => Math.min(prev + 5, 95));
      }, 500);

      const config: AutoDraftConfig = {
}
        leagueSize: 10,
        scoringType,
        userTeamId: userId,
        userStrategy: {
}
          type: selectedStrategy as any,
          riskTolerance: &apos;moderate&apos;,
          positionPriority: [&apos;RB&apos;, &apos;WR&apos;, &apos;QB&apos;, &apos;TE&apos;, &apos;RB&apos;, &apos;WR&apos;, &apos;DST&apos;, &apos;K&apos;] as PlayerPosition[],
          rookiePreference: 0.4,
          valueBased: true,
          targetADP: selectedStrategy === &apos;balanced&apos;
        },
        simulateFullLeague: true
      };

      const results = await autoDraftService.executeAutoDraft(config);
      
      clearInterval(progressInterval);
      setDraftProgress(100);
      setDraftResults(results);
      
      // Find user&apos;s team result
      const userTeamResult = results.find((r: any) => r.team.id === userId);
      setUserResult(userTeamResult || null);
      
      if (onDraftComplete) {
}
        onDraftComplete(results);

      setCurrentPick(&apos;Draft complete!&apos;);
    } catch (error) {
}
      console.error(&apos;Draft failed:&apos;, error);
      setCurrentPick(&apos;Draft failed. Please try again.&apos;);
    } finally {
}
      setIsDrafting(false);

  }, [selectedStrategy, scoringType, userId, onDraftComplete]);

  /**
   * Generate optimal team for user only
   */
  const generateOptimalTeam = useCallback(async () => {
}
    setIsDrafting(true);
    setCurrentPick(&apos;Generating optimal team...&apos;);

    try {
}

      const result = await autoDraftService.generateOptimalUserTeam(userId);
      setUserResult(result);
      setDraftResults([result]);
      setCurrentPick(&apos;Optimal team generated!&apos;);
    
    } catch (error) {
}
      console.error(&apos;Failed to generate optimal team:&apos;, error);
      setCurrentPick(&apos;Generation failed. Please try again.&apos;);
    } finally {
}
      setIsDrafting(false);

  }, [userId]);

  /**
   * Format position with color
   */
  const getPositionColor = (position: PlayerPosition): string => {
}
    const colors: Record<PlayerPosition, string> = {
}
      QB: &apos;text-red-500&apos;,
      RB: &apos;text-green-500&apos;,
      WR: &apos;text-blue-500&apos;,
      TE: &apos;text-orange-500&apos;,
      K: &apos;text-purple-500&apos;,
      DST: &apos;text-gray-500&apos;
    };
    return colors[position] || &apos;text-gray-400&apos;;
  };

  /**
   * Render draft settings panel
   */
  const renderSettings = () => (
    <div className="bg-gray-800 rounded-lg p-6 mb-6 sm:px-4 md:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-4 sm:px-4 md:px-6 lg:px-8">
        <h3 className="text-xl font-bold flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
          <Settings className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
          Draft Settings
        </h3>
        <button
          onClick={() => setShowSettings(!showSettings)}
        >
          {showSettings ? &apos;Hide&apos; : &apos;Show&apos;}
        </button>
      </div>

      {showSettings && (
}
        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
          {/* Scoring Type */}
          <div>
            <label className="block text-sm font-medium mb-2 sm:px-4 md:px-6 lg:px-8">Scoring Format</label>
            <div className="flex gap-2 sm:px-4 md:px-6 lg:px-8">
              {([&apos;standard&apos;, &apos;ppr&apos;, &apos;half_ppr&apos;] as const).map((type: any) => (
}
                <button
                  key={type}
                  onClick={() => setScoringType(type)}`}
                >
                  {type === &apos;ppr&apos; ? &apos;PPR&apos; : type === &apos;half_ppr&apos; ? &apos;Half PPR&apos; : &apos;Standard&apos;}
                </button>
              ))}
            </div>
          </div>

          {/* Draft Strategy */}
          <div>
            <label className="block text-sm font-medium mb-2 sm:px-4 md:px-6 lg:px-8">Draft Strategy</label>
            <div className="grid grid-cols-3 gap-2 sm:px-4 md:px-6 lg:px-8">
              {strategies.map((strategy: any) => (
}
                <button
                  key={strategy.id}
                  onClick={() => setSelectedStrategy(strategy.id)}`}
                  title={strategy.description}
                >
                  <div className="text-2xl mb-1 sm:px-4 md:px-6 lg:px-8">{strategy.icon}</div>
                  <div className="text-xs font-medium sm:px-4 md:px-6 lg:px-8">{strategy.name}</div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2 sm:px-4 md:px-6 lg:px-8">
              {strategies.find((s: any) => s.id === selectedStrategy)?.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  /**
   * Render draft controls
   */
  const renderControls = () => (
    <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-6 mb-6 sm:px-4 md:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-4 sm:px-4 md:px-6 lg:px-8">
        <div>
          <h2 className="text-2xl font-bold mb-2 sm:px-4 md:px-6 lg:px-8">Auto-Draft System</h2>
          <p className="text-gray-300 sm:px-4 md:px-6 lg:px-8">
            Intelligent drafting powered by advanced analytics
          </p>
        </div>
        <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
          <Brain className="w-8 h-8 text-blue-400 sm:px-4 md:px-6 lg:px-8" />
          <Sparkles className="w-6 h-6 text-yellow-400 sm:px-4 md:px-6 lg:px-8" />
        </div>
      </div>

      <div className="flex gap-4 sm:px-4 md:px-6 lg:px-8">
        <button
          onClick={executeAutoDraft}
          disabled={isDrafting}
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 
                     text-white font-bold py-3 px-6 rounded-lg transition-all
                     flex items-center justify-center gap-2 sm:px-4 md:px-6 lg:px-8"
         aria-label="Action button">
          {isDrafting ? (
}
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white sm:px-4 md:px-6 lg:px-8" />
              Drafting...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
              Start Full League Draft
            </>
          )}
        </button>

        <button
          onClick={generateOptimalTeam}
          disabled={isDrafting}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 
                     text-white font-bold py-3 px-6 rounded-lg transition-all
                     flex items-center justify-center gap-2 sm:px-4 md:px-6 lg:px-8"
         aria-label="Action button">
          {isDrafting ? (
}
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white sm:px-4 md:px-6 lg:px-8" />
              Generating...
            </>
          ) : (
            <>
              <Target className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
              Generate Optimal Team
            </>
          )}
        </button>
      </div>

      {isDrafting && (
}
        <div className="mt-4 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
            <span className="text-sm text-gray-300 sm:px-4 md:px-6 lg:px-8">{currentPick}</span>
            <span className="text-sm text-gray-300 sm:px-4 md:px-6 lg:px-8">{draftProgress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all sm:px-4 md:px-6 lg:px-8"
              style={{ width: `${draftProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );

  /**
   * Render user team overview
   */
  const renderUserTeamOverview = () => {
}
    if (!userResult) return null;

    const { team, analytics, starters, bench } = userResult;

    return (
      <div className="bg-gray-800 rounded-lg p-6 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 sm:px-4 md:px-6 lg:px-8">
          <h3 className="text-2xl font-bold flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
            <Trophy className="w-6 h-6 text-yellow-500 sm:px-4 md:px-6 lg:px-8" />
            {team.name}
          </h3>
          <div className="flex items-center gap-4 sm:px-4 md:px-6 lg:px-8">
            <div className="text-center sm:px-4 md:px-6 lg:px-8">
              <div className="text-2xl font-bold text-green-400 sm:px-4 md:px-6 lg:px-8">
                {Math.round(analytics.projectedPoints)}
              </div>
              <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Projected Points</div>
            </div>
            <div className="text-center sm:px-4 md:px-6 lg:px-8">
              <div className="text-2xl font-bold text-blue-400 sm:px-4 md:px-6 lg:px-8">
                {team.roster.length}
              </div>
              <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Players</div>
            </div>
          </div>
        </div>

        {/* Position Summary */}
        <div className="grid grid-cols-6 gap-2 mb-6 sm:px-4 md:px-6 lg:px-8">
          {([&apos;QB&apos;, &apos;RB&apos;, &apos;WR&apos;, &apos;TE&apos;, &apos;K&apos;, &apos;DST&apos;] as PlayerPosition[]).map((pos: any) => {
}
            const count = team.roster.filter((p: any) => p.position === pos).length;
            const isStrength = analytics.positionStrengths.includes(pos);
            const isWeakness = analytics.positionWeaknesses.includes(pos);
            
            return (
              <div 
                key={pos}
                className={`p-3 rounded-lg text-center ${
}
                  isStrength ? &apos;bg-green-900/50 border border-green-500&apos; :
                  isWeakness ? &apos;bg-red-900/50 border border-red-500&apos; :
                  &apos;bg-gray-700&apos;
                }`}
              >
                <div className={`font-bold ${getPositionColor(pos)}`}>
                  {pos}
                </div>
                <div className="text-xl font-bold sm:px-4 md:px-6 lg:px-8">{count}</div>
                {isStrength && <CheckCircle className="w-4 h-4 text-green-400 mx-auto mt-1 sm:px-4 md:px-6 lg:px-8" />}
                {isWeakness && <AlertCircle className="w-4 h-4 text-red-400 mx-auto mt-1 sm:px-4 md:px-6 lg:px-8" />}
              </div>
            );
          })}
        </div>

        {/* Key Insights */}
        <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
          {analytics.bestValue && (
}
            <div className="flex items-center gap-2 text-green-400 sm:px-4 md:px-6 lg:px-8">
              <TrendingUp className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
              <span className="text-sm sm:px-4 md:px-6 lg:px-8">
                Best Value: {analytics.bestValue.name} ({analytics.bestValue.position})
              </span>
            </div>
          )}
          
          {analytics.sleepers.length > 0 && (
}
            <div className="flex items-center gap-2 text-purple-400 sm:px-4 md:px-6 lg:px-8">
              <Sparkles className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
              <span className="text-sm sm:px-4 md:px-6 lg:px-8">
                Sleepers: {analytics.sleepers.map((p: any) => p.name).join(&apos;, &apos;)}
              </span>
            </div>
          )}

          {analytics.positionStrengths.length > 0 && (
}
            <div className="flex items-center gap-2 text-blue-400 sm:px-4 md:px-6 lg:px-8">
              <Shield className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
              <span className="text-sm sm:px-4 md:px-6 lg:px-8">
                Strengths: {analytics.positionStrengths.join(&apos;, &apos;)}
              </span>
            </div>
          )}

          {analytics.positionWeaknesses.length > 0 && (
}
            <div className="flex items-center gap-2 text-orange-400 sm:px-4 md:px-6 lg:px-8">
              <AlertCircle className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
              <span className="text-sm sm:px-4 md:px-6 lg:px-8">
                Needs Improvement: {analytics.positionWeaknesses.join(&apos;, &apos;)}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  /**
   * Render roster tab
   */
  const renderRosterTab = () => {
}
    if (!userResult) return null;

    const { starters, bench } = userResult;

    return (
      <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
        {/* Starters */}
        <div className="bg-gray-800 rounded-lg p-6 sm:px-4 md:px-6 lg:px-8">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
            <Users className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
            Starting Lineup
          </h4>
          <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
            {starters.map((player, idx) => (
}
              <div 
                key={player.id}
                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg
                           hover:bg-gray-600 transition-colors sm:px-4 md:px-6 lg:px-8"
              >
                <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                  <span className="text-sm text-gray-400 w-8 sm:px-4 md:px-6 lg:px-8">{idx + 1}</span>
                  <span className={`font-bold ${getPositionColor(player.position)} w-10`}>
                    {player.position}
                  </span>
                  <span className="font-medium sm:px-4 md:px-6 lg:px-8">{player.name}</span>
                  <span className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">{player.team}</span>
                </div>
                <div className="flex items-center gap-4 sm:px-4 md:px-6 lg:px-8">
                  <span className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Bye: {player.bye}</span>
                  <span className="font-bold text-green-400 sm:px-4 md:px-6 lg:px-8">
                    {player.projectedPoints?.toFixed(1)} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bench */}
        <div className="bg-gray-800 rounded-lg p-6 sm:px-4 md:px-6 lg:px-8">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
            <Shield className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
//             Bench
          </h4>
          <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
            {bench.map((player, idx) => (
}
              <div 
                key={player.id}
                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg
                           hover:bg-gray-600 transition-colors sm:px-4 md:px-6 lg:px-8"
              >
                <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                  <span className="text-sm text-gray-400 w-8 sm:px-4 md:px-6 lg:px-8">B{idx + 1}</span>
                  <span className={`font-bold ${getPositionColor(player.position)} w-10`}>
                    {player.position}
                  </span>
                  <span className="font-medium sm:px-4 md:px-6 lg:px-8">{player.name}</span>
                  <span className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">{player.team}</span>
                </div>
                <div className="flex items-center gap-4 sm:px-4 md:px-6 lg:px-8">
                  <span className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Bye: {player.bye}</span>
                  <span className="font-bold text-blue-400 sm:px-4 md:px-6 lg:px-8">
                    {player.projectedPoints?.toFixed(1)} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /**
   * Render analytics tab
   */
  const renderAnalyticsTab = () => {
}
    if (!userResult) return null;

    const { analytics, roster } = userResult;

    // Calculate position distribution
    const positionCounts = roster.reduce((acc, player) => {
}
      acc[player.position] = (acc[player.position] || 0) + 1;
      return acc;
    }, {} as Record<PlayerPosition, number>);

    // Calculate tier distribution
    const tierCounts = roster.reduce((acc, player) => {
}
      const tier = player.tier || 5;
      acc[tier] = (acc[tier] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <div className="bg-gray-800 rounded-lg p-6 sm:px-4 md:px-6 lg:px-8">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
            <BarChart className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
            Performance Metrics
          </h4>
          <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
            <div>
              <div className="flex justify-between mb-1 sm:px-4 md:px-6 lg:px-8">
                <span className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Projected Points</span>
                <span className="font-bold text-green-400 sm:px-4 md:px-6 lg:px-8">
                  {Math.round(analytics.projectedPoints)}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                <div 
                  className="bg-green-500 h-2 rounded-full sm:px-4 md:px-6 lg:px-8"
                  style={{ width: `${Math.min(100, (analytics.projectedPoints / 2000) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 sm:px-4 md:px-6 lg:px-8">
                <span className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Schedule Strength</span>
                <span className="font-bold text-blue-400 sm:px-4 md:px-6 lg:px-8">
                  {analytics.strengthOfSchedule > 0 ? &apos;Easy&apos; : 
}
                   analytics.strengthOfSchedule < 0 ? &apos;Hard&apos; : &apos;Average&apos;}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                <div 
                  className="bg-blue-500 h-2 rounded-full sm:px-4 md:px-6 lg:px-8"
                  style={{ width: `${50 + (analytics.strengthOfSchedule * 25)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 sm:px-4 md:px-6 lg:px-8">
                <span className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Team Balance</span>
                <span className="font-bold text-purple-400 sm:px-4 md:px-6 lg:px-8">
                  {analytics.positionStrengths.length > analytics.positionWeaknesses.length ? 
}
                   &apos;Strong&apos; : &apos;Needs Work&apos;}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                <div 
                  className="bg-purple-500 h-2 rounded-full sm:px-4 md:px-6 lg:px-8"
                  style={{ 
}
                    width: `${(analytics.positionStrengths.length / 6) * 100}%` 
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Position Distribution */}
        <div className="bg-gray-800 rounded-lg p-6 sm:px-4 md:px-6 lg:px-8">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
            <Users className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
            Position Distribution
          </h4>
          <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
            {Object.entries(positionCounts).map(([pos, count]) => (
}
              <div key={pos} className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                <span className={`font-bold w-10 ${getPositionColor(pos as PlayerPosition)}`}>
                  {pos}
                </span>
                <div className="flex-1 bg-gray-700 rounded-full h-6 relative sm:px-4 md:px-6 lg:px-8">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-blue-400 
                               rounded-full flex items-center justify-end pr-2 sm:px-4 md:px-6 lg:px-8"
                    style={{ width: `${(count / roster.length) * 100}%` }}
                  >
                    <span className="text-xs font-bold sm:px-4 md:px-6 lg:px-8">{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Value Picks */}
        <div className="bg-gray-800 rounded-lg p-6 sm:px-4 md:px-6 lg:px-8">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
            <TrendingUp className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
            Value Analysis
          </h4>
          <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
            {analytics.bestValue && (
}
              <div className="p-3 bg-green-900/30 border border-green-500 rounded-lg sm:px-4 md:px-6 lg:px-8">
                <div className="font-bold text-green-400 mb-1 sm:px-4 md:px-6 lg:px-8">Best Value Pick</div>
                <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                  <span>{analytics.bestValue.name}</span>
                  <span className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">
                    {analytics.bestValue.position} - Round {Math.ceil((analytics.bestValue.adp || 100) / 10)}
                  </span>
                </div>
              </div>
            )}

            {analytics.biggestReach && (
}
              <div className="p-3 bg-orange-900/30 border border-orange-500 rounded-lg sm:px-4 md:px-6 lg:px-8">
                <div className="font-bold text-orange-400 mb-1 sm:px-4 md:px-6 lg:px-8">Biggest Reach</div>
                <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                  <span>{analytics.biggestReach.name}</span>
                  <span className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">
                    {analytics.biggestReach.position} - Reached by {
}
                      Math.abs((analytics.biggestReach.adp || 50) - roster.indexOf(analytics.biggestReach))
                    } spots
                  </span>
                </div>
              </div>
            )}

            {analytics.sleepers.length > 0 && (
}
              <div className="p-3 bg-purple-900/30 border border-purple-500 rounded-lg sm:px-4 md:px-6 lg:px-8">
                <div className="font-bold text-purple-400 mb-1 sm:px-4 md:px-6 lg:px-8">Sleeper Picks</div>
                {analytics.sleepers.slice(0, 3).map((player: any) => (
}
                  <div key={player.id} className="flex items-center justify-between mt-1 sm:px-4 md:px-6 lg:px-8">
                    <span className="text-sm sm:px-4 md:px-6 lg:px-8">{player.name}</span>
                    <span className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">{player.position}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tier Distribution */}
        <div className="bg-gray-800 rounded-lg p-6 sm:px-4 md:px-6 lg:px-8">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
            <Gauge className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
            Player Tiers
          </h4>
          <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
            {[1, 2, 3, 4, 5].map((tier: any) => {
}
              const count = tierCounts[tier] || 0;
              const percentage = (count / roster.length) * 100;
              
              return (
                <div key={tier} className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                  <span className="text-sm text-gray-400 w-16 sm:px-4 md:px-6 lg:px-8">Tier {tier}</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-4 relative sm:px-4 md:px-6 lg:px-8">
                    <div 
                      className={`absolute inset-y-0 left-0 rounded-full ${
}
                        tier === 1 ? &apos;bg-yellow-500&apos; :
                        tier === 2 ? &apos;bg-blue-500&apos; :
                        tier === 3 ? &apos;bg-green-500&apos; :
                        tier === 4 ? &apos;bg-orange-500&apos; :
                        &apos;bg-gray-500&apos;
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold w-8 sm:px-4 md:px-6 lg:px-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  /**
   * Render league results tab
   */
  const renderLeagueTab = () => {
}
    if (!draftResults || draftResults.length === 0) return null;

    return (
      <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
        <div className="bg-gray-800 rounded-lg p-6 sm:px-4 md:px-6 lg:px-8">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
            <Trophy className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
            League Draft Results
          </h4>
          <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
            {draftResults
}
              .sort((a, b) => b.analytics.projectedPoints - a.analytics.projectedPoints)
              .map((result, idx) => (
                <div 
                  key={result.team.id}
                  className={`p-4 rounded-lg transition-all ${
}
                    result.team.id === userId 
                      ? &apos;bg-blue-900/30 border border-blue-500&apos; 
                      : &apos;bg-gray-700 hover:bg-gray-600&apos;
                  }`}
                >
                  <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                      <span className="text-2xl font-bold text-gray-400 sm:px-4 md:px-6 lg:px-8">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="font-bold flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                          {result.team.name}
                          {result.team.id === userId && (
}
                            <span className="text-xs bg-blue-600 px-2 py-1 rounded sm:px-4 md:px-6 lg:px-8">YOU</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">
                          {result.team.owner.name}
                        </div>
                      </div>
                    </div>
                    <div className="text-right sm:px-4 md:px-6 lg:px-8">
                      <div className="text-xl font-bold text-green-400 sm:px-4 md:px-6 lg:px-8">
                        {Math.round(result.analytics.projectedPoints)} pts
                      </div>
                      <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
                        Strengths: {result.analytics.positionStrengths.join(&apos;, &apos;) || &apos;Balanced&apos;}
                      </div>
                    </div>
                  </div>

                  {/* Top players */}
                  <div className="mt-3 flex gap-2 flex-wrap sm:px-4 md:px-6 lg:px-8">
                    {result.roster.slice(0, 5).map((player: any) => (
}
                      <span 
                        key={player.id}
                        className="text-xs bg-gray-600 px-2 py-1 rounded sm:px-4 md:px-6 lg:px-8"
                      >
                        {player.name} ({player.position})
                      </span>
                    ))}
                    {result.roster.length > 5 && (
}
                      <span className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
                        +{result.roster.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 sm:px-4 md:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
            <Zap className="w-10 h-10 text-yellow-500 sm:px-4 md:px-6 lg:px-8" />
            Auto-Draft System
          </h1>
          <p className="text-gray-400 sm:px-4 md:px-6 lg:px-8">
            Advanced AI-powered drafting for optimal team construction
          </p>
        </div>

        {/* Settings Panel */}
        {renderSettings()}

        {/* Draft Controls */}
        {renderControls()}

        {/* Results Section */}
        {(userResult || draftResults) && (
}
          <>
            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-700 sm:px-4 md:px-6 lg:px-8">
              {[
}
                { id: &apos;overview&apos;, label: &apos;Overview&apos;, icon: Info },
                { id: &apos;roster&apos;, label: &apos;Roster&apos;, icon: Users },
                { id: &apos;analytics&apos;, label: &apos;Analytics&apos;, icon: BarChart },
                { id: &apos;league&apos;, label: &apos;League Results&apos;, icon: Trophy }
              ].map((tab: any) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}`}
                >
                  <tab.icon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in sm:px-4 md:px-6 lg:px-8">
              {activeTab === &apos;overview&apos; && renderUserTeamOverview()}
              {activeTab === &apos;roster&apos; && renderRosterTab()}
              {activeTab === &apos;analytics&apos; && renderAnalyticsTab()}
              {activeTab === &apos;league&apos; && renderLeagueTab()}
            </div>
          </>
        )}

        {/* Empty State */}
        {!userResult && !draftResults && !isDrafting && (
}
          <div className="text-center py-12 sm:px-4 md:px-6 lg:px-8">
            <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4 sm:px-4 md:px-6 lg:px-8" />
            <h3 className="text-xl font-bold mb-2 sm:px-4 md:px-6 lg:px-8">Ready to Draft</h3>
            <p className="text-gray-400 sm:px-4 md:px-6 lg:px-8">
              Configure your settings and start the auto-draft to build your championship team
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const AutoDraftInterfaceWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <AutoDraftInterface {...props} />
  </ErrorBoundary>
);

export default React.memo(AutoDraftInterfaceWithErrorBoundary);