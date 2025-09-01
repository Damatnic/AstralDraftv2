/**
 * Enhanced AI Draft Coach Panel
 * Advanced real-time coaching with strategy adjustments and market analysis
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { Player, League, Team } from &apos;../../types&apos;;
import { BrainCircuitIcon } from &apos;../icons/BrainCircuitIcon&apos;;
import { TrendingUpIcon } from &apos;../icons/TrendingUpIcon&apos;;
import { TrendingDownIcon } from &apos;../icons/TrendingDownIcon&apos;;
import { AlertTriangleIcon } from &apos;../icons/AlertTriangleIcon&apos;;
import { CheckIcon } from &apos;../icons/CheckIcon&apos;;
import { BarChartIcon } from &apos;../icons/BarChartIcon&apos;;
import { SearchIcon } from &apos;../icons/SearchIcon&apos;;

interface EnhancedAiDraftCoachProps {
}
    league: League;
    currentTeam: Team;
    availablePlayers: Player[];
    currentPick: number;
    currentRound: number;
    isMyTurn: boolean;
    timeRemaining: number;
    recentPicks: DraftPick[];
    onPlayerSelect: (player: Player) => void;
    onStrategyUpdate: (strategy: DraftStrategy) => void;

}

export interface DraftPick {
}
    pickNumber: number;
    teamId: number;
    playerId: number;
    player: Player;
    timestamp: number;
    adpDifference: number;

}

export interface DraftStrategy {
}
    name: string;
    description: string;
    positionPriority: string[];
    riskTolerance: &apos;conservative&apos; | &apos;moderate&apos; | &apos;aggressive&apos;;
    valueBased: boolean;
    targetPositions: string[];

}

export interface CoachRecommendation {
}
    id: string;
    type: &apos;pick&apos; | &apos;strategy&apos; | &apos;market&apos; | &apos;opponent&apos;;
    priority: &apos;critical&apos; | &apos;high&apos; | &apos;medium&apos; | &apos;low&apos;;
    confidence: number;
    title: string;
    description: string;
    reasoning: string[];
    player?: Player;
    action?: string;
    impact: number;
    timeLeft?: number;

}

export interface OpponentModel {
}
    teamId: number;
    teamName: string;
    tendencies: {
}
        averagePickTime: number;
        positionBias: Record<string, number>;
        reachTendency: number;
        valueTendency: number;
        riskProfile: &apos;conservative&apos; | &apos;moderate&apos; | &apos;aggressive&apos;;
    };
    predictedNextPicks: Player[];
    confidence: number;
    draftStrategy: string;

export interface MarketInefficiency {
}
    id: string;
    type: &apos;undervalued&apos; | &apos;overvalued&apos; | &apos;run_opportunity&apos; | &apos;tier_break&apos;;
    player?: Player;
    position?: string;
    description: string;
    value: number;
    confidence: number;
    timeWindow: number;
    reasoning: string;

}

const EnhancedAiDraftCoach: React.FC<EnhancedAiDraftCoachProps> = ({
}
    league,
    currentTeam,
    availablePlayers,
    currentPick,
    currentRound,
    isMyTurn,
    timeRemaining,
    recentPicks,
    onPlayerSelect,
//     onStrategyUpdate
}: any) => {
}
    const [selectedTab, setSelectedTab] = React.useState<&apos;recommendations&apos; | &apos;opponents&apos; | &apos;market&apos; | &apos;strategy&apos;>(&apos;recommendations&apos;);
    const [recommendations, setRecommendations] = React.useState<CoachRecommendation[]>([]);
    const [opponentModels, setOpponentModels] = React.useState<OpponentModel[]>([]);
    const [marketInefficiencies, setMarketInefficiencies] = React.useState<MarketInefficiency[]>([]);
    const [currentStrategy, setCurrentStrategy] = React.useState<DraftStrategy>({
}
        name: &apos;Balanced Value&apos;,
        description: &apos;Target best available value with positional balance&apos;,
        positionPriority: [&apos;RB&apos;, &apos;WR&apos;, &apos;QB&apos;, &apos;TE&apos;, &apos;K&apos;, &apos;DST&apos;],
        riskTolerance: &apos;moderate&apos;,
        valueBased: true,
        targetPositions: []
    });

    // Generate real-time recommendations
    React.useEffect(() => {
}
        if (isMyTurn && availablePlayers.length > 0) {
}
            generateRecommendations();
    }
  }, [isMyTurn, currentPick, availablePlayers, currentTeam]);

    // Update opponent models based on recent picks
    React.useEffect(() => {
}
        updateOpponentModels();
    }, [recentPicks]);

    // Detect market inefficiencies
    React.useEffect(() => {
}
        detectMarketInefficiencies();
    }, [recentPicks, availablePlayers]);

    const generateRecommendations = React.useCallback(() => {
}
        const newRecommendations: CoachRecommendation[] = [];

        // Get top available players by position
        const topRBs = availablePlayers.filter((p: any) => p.position === &apos;RB&apos;).slice(0, 3);
        const topWRs = availablePlayers.filter((p: any) => p.position === &apos;WR&apos;).slice(0, 3);
        const topQBs = availablePlayers.filter((p: any) => p.position === &apos;QB&apos;).slice(0, 2);

        // Primary pick recommendation
        const topPlayer = availablePlayers[0];
        if (topPlayer) {
}
            newRecommendations.push({
}
                id: &apos;primary-pick&apos;,
                type: &apos;pick&apos;,
                priority: &apos;critical&apos;,
                confidence: 92,
                title: `Draft ${topPlayer.name}`,
                description: `Elite ${topPlayer.position} with exceptional value`,
                reasoning: [
                    `Projected ${topPlayer.stats.projection} points this season`,
                    `ADP: ${topPlayer?.adp} (excellent value at pick ${currentPick})`,
                    `Tier 1 player at premium position`,
                    `Addresses team need for reliable starter`
                ],
                player: topPlayer,
                action: &apos;Draft Now&apos;,
                impact: 85,
                timeLeft: timeRemaining
            });

        // Position-specific recommendations
        if (currentRound <= 3 && topRBs.length > 0) {
}
            newRecommendations.push({
}
                id: &apos;rb-priority&apos;,
                type: &apos;strategy&apos;,
                priority: &apos;high&apos;,
                confidence: 87,
                title: &apos;Secure RB Depth&apos;,
                description: &apos;RB scarcity increasing - consider handcuffing strategy&apos;,
                reasoning: [
                    `Only ${topRBs.length} elite RBs remaining`,
                    &apos;Historical data shows RB runs in early rounds&apos;,
                    &apos;Your roster needs reliable rushing production&apos;
                ],
                impact: 75
            });

        // Urgency recommendations for time pressure
        if (timeRemaining < 30 && isMyTurn) {
}
            newRecommendations.push({
}
                id: &apos;time-pressure&apos;,
                type: &apos;pick&apos;,
                priority: &apos;critical&apos;,
                confidence: 95,
                title: &apos;Quick Decision Needed&apos;,
                description: &apos;Time running low - stick with prepared rankings&apos;,
                reasoning: [
                    &apos;Less than 30 seconds remaining&apos;,
                    &apos;Avoid overthinking - trust your preparation&apos;,
                    &apos;Better to pick good player than auto-draft&apos;
                ],
                impact: 60,
                timeLeft: timeRemaining
            });

        // Market inefficiency alerts
        const undervaluedPlayers = availablePlayers.filter((p: any) => p?.adp > currentPick + 10);
        if (undervaluedPlayers.length > 0) {
}
            newRecommendations.push({
}
                id: &apos;value-opportunity&apos;,
                type: &apos;market&apos;,
                priority: &apos;medium&apos;,
                confidence: 78,
                title: &apos;Value Opportunities Available&apos;,
                description: `${undervaluedPlayers.length} players falling below ADP`,
                reasoning: [
                    &apos;Market creating value opportunities&apos;,
                    &apos;Consider reaching for falling players&apos;,
                    &apos;Other teams may be panicking&apos;
                ],
                impact: 65
            });

        setRecommendations(newRecommendations);
    }, [availablePlayers, currentPick, currentRound, isMyTurn, timeRemaining, currentTeam]);

    const updateOpponentModels = React.useCallback(() => {
}
        const models: OpponentModel[] = league.teams
            .filter((team: any) => team.id !== currentTeam.id)
            .map((team: any) => {
}
                const teamPicks = recentPicks.filter((pick: any) => pick.teamId === team.id);
                const avgPickTime = teamPicks.reduce((sum, pick) => sum + (pick.timestamp || 60), 0) / Math.max(teamPicks.length, 1);
                
                // Calculate position bias based on picks
                const positionCounts: Record<string, number> = {};
                teamPicks.forEach((pick: any) => {
}
                    if (pick.player) {
}
                        positionCounts[pick.player.position] = (positionCounts[pick.player.position] || 0) + 1;

                });

                // Predict next picks based on patterns
                const predictedPicks = availablePlayers
                    .filter((p: any) => {
}
                        const teamRoster = team.roster || [];
                        const positionCount = teamRoster.filter((r: any) => r.position === p.position).length;
                        return positionCount < getPositionLimit(p.position);
                    })
                    .slice(0, 3);

                return {
}
                    teamId: team.id,
                    teamName: team.name,
                    tendencies: {
}
                        averagePickTime: avgPickTime,
                        positionBias: positionCounts,
                        reachTendency: calculateReachTendency(teamPicks),
                        valueTendency: calculateValueTendency(teamPicks),
                        riskProfile: determineRiskProfile(teamPicks)
                    },
                    predictedNextPicks: predictedPicks,
                    confidence: Math.min(95, 50 + teamPicks.length * 10),
                    draftStrategy: inferDraftStrategy(teamPicks, team.roster || [])
                };
            });

        setOpponentModels(models);
    }, [league.teams, currentTeam.id, recentPicks, availablePlayers]);

    const detectMarketInefficiencies = React.useCallback(() => {
}
        const inefficiencies: MarketInefficiency[] = [];

        // Detect position runs
        const recentPositions = recentPicks.slice(-5).map((pick: any) => pick.player?.position);
        const positionCounts = recentPositions.reduce((acc, pos) => {
}
            if (pos) acc[pos] = (acc[pos] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        Object.entries(positionCounts).forEach(([position, count]) => {
}
            if ((count as number) >= 3) {
}
                inefficiencies.push({
}
                    id: `run-${position}`,
                    type: &apos;run_opportunity&apos;,
                    position,
                    description: `${position} run detected - ${count as number} picks in last 5`,
                    value: (count as number) * 10,
                    confidence: 85,
                    timeWindow: 3,
                    reasoning: `Position scarcity increasing, consider targeting ${position} soon`
                });

        });

        // Detect undervalued players
        availablePlayers.slice(0, 20).forEach((player: any) => {
}
            const adpDiff = player?.adp - currentPick;
            if (adpDiff > 15) {
}
                inefficiencies.push({
}
                    id: `undervalued-${player.id}`,
                    type: &apos;undervalued&apos;,
                    player,
                    description: `${player.name} falling ${adpDiff.toFixed(1)} picks below ADP`,
                    value: adpDiff,
                    confidence: 75,
                    timeWindow: 5,
                    reasoning: &apos;Significant value opportunity - player drafted much later than expected&apos;
                });

        });

        // Detect tier breaks
        const positions = [&apos;QB&apos;, &apos;RB&apos;, &apos;WR&apos;, &apos;TE&apos;];
        positions.forEach((position: any) => {
}
            const positionPlayers = availablePlayers.filter((p: any) => p.position === position);
            if (positionPlayers.length >= 2) {
}
                const tierBreak = positionPlayers[0].tier !== positionPlayers[1].tier;
                if (tierBreak) {
}
                    inefficiencies.push({
}
                        id: `tier-${position}`,
                        type: &apos;tier_break&apos;,
                        position,
                        description: `Major tier break at ${position} - last elite option available`,
                        value: 20,
                        confidence: 90,
                        timeWindow: 2,
                        reasoning: `Consider reaching for ${positionPlayers[0].name} before tier drop`
                    });


        });

        setMarketInefficiencies(inefficiencies);
    }, [recentPicks, availablePlayers, currentPick]);

    const getRecommendationIcon = (type: string, priority: string) => {
}
        if (priority === &apos;critical&apos;) return <AlertTriangleIcon className="w-5 h-5 text-red-400 sm:px-4 md:px-6 lg:px-8" />;
        if (type === &apos;pick&apos;) return <CheckIcon className="w-5 h-5 text-green-400 sm:px-4 md:px-6 lg:px-8" />;
        if (type === &apos;market&apos;) return <TrendingUpIcon className="w-5 h-5 text-blue-400 sm:px-4 md:px-6 lg:px-8" />;
        if (type === &apos;strategy&apos;) return <BarChartIcon className="w-5 h-5 text-purple-400 sm:px-4 md:px-6 lg:px-8" />;
        return <BrainCircuitIcon className="w-5 h-5 text-gray-400 sm:px-4 md:px-6 lg:px-8" />;
    };

    const getPriorityColor = (priority: string) => {
}
        switch (priority) {
}
            case &apos;critical&apos;: return &apos;border-red-400 bg-red-500/10&apos;;
            case &apos;high&apos;: return &apos;border-orange-400 bg-orange-500/10&apos;;
            case &apos;medium&apos;: return &apos;border-yellow-400 bg-yellow-500/10&apos;;
            case &apos;low&apos;: return &apos;border-gray-400 bg-gray-500/10&apos;;
            default: return &apos;border-gray-400 bg-gray-500/10&apos;;

    };

    const handleRecommendationAction = (recommendation: CoachRecommendation) => {
}
        if (recommendation.player && recommendation.type === &apos;pick&apos;) {
}
            onPlayerSelect(recommendation.player);
    }
  };

    const tabs = [
        { id: &apos;recommendations&apos;, label: &apos;Recommendations&apos;, icon: <BrainCircuitIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" /> },
        { id: &apos;opponents&apos;, label: &apos;Opponents&apos;, icon: <SearchIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" /> },
        { id: &apos;market&apos;, label: &apos;Market&apos;, icon: <TrendingUpIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" /> },
        { id: &apos;strategy&apos;, label: &apos;Strategy&apos;, icon: <BarChartIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" /> }
    ];

  if (isLoading) {
}
    return (
      <div className="flex justify-center items-center p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 sm:px-4 md:px-6 lg:px-8"></div>
        <span className="ml-2 sm:px-4 md:px-6 lg:px-8">Loading...</span>
      </div>
    );

  return (
        <div className="h-full flex flex-col bg-[var(--panel-bg)] sm:px-4 md:px-6 lg:px-8">
            {/* Header with AI Status */}
            <div className="flex-shrink-0 p-4 border-b border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-3 sm:px-4 md:px-6 lg:px-8">
                    <h3 className="font-bold text-lg text-[var(--text-primary)] flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                        <BrainCircuitIcon className="w-6 h-6 text-blue-400 sm:px-4 md:px-6 lg:px-8" />
                        AI Draft Coach
                    </h3>
                    <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse sm:px-4 md:px-6 lg:px-8"></div>
                        <span className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Active</span>
                    </div>
                </div>
                
                {isMyTurn && (
}
                    <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                            <span className="text-blue-400 font-medium sm:px-4 md:px-6 lg:px-8">Your Turn!</span>
                            <span className="text-blue-400 font-mono sm:px-4 md:px-6 lg:px-8">
                                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, &apos;0&apos;)}
                            </span>
                        </div>
                        <div className="text-sm text-[var(--text-secondary)] mt-1 sm:px-4 md:px-6 lg:px-8">
                            Pick {currentPick} • Round {currentRound}
                        </div>
                    </div>
                )}
            </div>

            {/* Tab Navigation */}
            <div className="flex-shrink-0 border-b border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                <div className="flex overflow-x-auto sm:px-4 md:px-6 lg:px-8">
                    {tabs.map((tab: any) => (
}
                        <button
                            key={tab.id}
                            onClick={() => setSelectedTab(tab.id as any)}`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto sm:px-4 md:px-6 lg:px-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="p-4 h-full sm:px-4 md:px-6 lg:px-8"
                    >
                        {selectedTab === &apos;recommendations&apos; && (
}
                            <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                                {recommendations.map((rec, index) => (
}
                                    <motion.div
                                        key={rec.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`border rounded-lg p-4 cursor-pointer hover:bg-white/5 transition-colors ${getPriorityColor(rec.priority)}`}
                                        onClick={() => handleRecommendationAction(rec)}
                                    >
                                        <div className="flex items-start gap-3 sm:px-4 md:px-6 lg:px-8">
                                            {getRecommendationIcon(rec.type, rec.priority)}
                                            <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                                                <div className="flex items-center justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
                                                    <h4 className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                                        {rec.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                                        <span className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                                            {rec.confidence}% confidence
                                                        </span>
                                                        {rec.timeLeft && rec.timeLeft < 60 && (
}
                                                            <span className="text-xs text-red-400 font-mono sm:px-4 md:px-6 lg:px-8">
                                                                {rec.timeLeft}s
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <p className="text-sm text-[var(--text-secondary)] mb-3 sm:px-4 md:px-6 lg:px-8">
                                                    {rec.description}
                                                </p>
                                                
                                                <div className="space-y-1 sm:px-4 md:px-6 lg:px-8">
                                                    {rec.reasoning.map((reason, idx) => (
}
                                                        <div key={idx} className="flex items-center gap-2 text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                                            <div className="w-1 h-1 bg-current rounded-full sm:px-4 md:px-6 lg:px-8"></div>
                                                            {reason}
                                                        </div>
                                                    ))}
                                                </div>
                                                
                                                {rec.action && (
}
                                                    <button className="mt-3 px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                                                        {rec.action}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                
                                {recommendations.length === 0 && (
}
                                    <div className="text-center py-8 text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                        <BrainCircuitIcon className="w-12 h-12 mx-auto mb-3 opacity-50 sm:px-4 md:px-6 lg:px-8" />
                                        <p>AI is analyzing the draft...</p>
                                        <p className="text-sm sm:px-4 md:px-6 lg:px-8">Recommendations will appear when it&apos;s your turn</p>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {selectedTab === &apos;opponents&apos; && (
}
                            <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                                {opponentModels.map((model, index) => (
}
                                    <motion.div
                                        key={model.teamId}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white/5 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8"
                                    >
                                        <div className="flex items-center justify-between mb-3 sm:px-4 md:px-6 lg:px-8">
                                            <h4 className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                                {model.teamName}
                                            </h4>
                                            <span className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                                {model.confidence}% confidence
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-3 mb-3 sm:px-4 md:px-6 lg:px-8">
                                            <div>
                                                <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Avg Pick Time</div>
                                                <div className="font-mono text-sm text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                                    {Math.round(model.tendencies.averagePickTime)}s
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Strategy</div>
                                                <div className="text-sm text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                                    {model.draftStrategy}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <div className="text-xs text-[var(--text-secondary)] mb-2 sm:px-4 md:px-6 lg:px-8">Likely Next Picks</div>
                                            <div className="space-y-1 sm:px-4 md:px-6 lg:px-8">
                                                {model.predictedNextPicks.slice(0, 2).map((player: any) => (
}
                                                    <div key={player.id} className="text-sm text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                                        {player.name} ({player.position})
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                        
                        {selectedTab === &apos;market&apos; && (
}
                            <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                                {marketInefficiencies.map((inefficiency, index) => (
}
                                    <motion.div
                                        key={inefficiency.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white/5 rounded-lg p-4 border border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8"
                                    >
                                        <div className="flex items-center justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
                                            <h4 className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                                {inefficiency.description}
                                            </h4>
                                            <span className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                                {inefficiency.confidence}% confidence
                                            </span>
                                        </div>
                                        
                                        <p className="text-sm text-[var(--text-secondary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                                            {inefficiency.reasoning}
                                        </p>
                                        
                                        <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
}
                                                inefficiency.type === &apos;undervalued&apos; ? &apos;bg-green-500/20 text-green-400&apos; :
                                                inefficiency.type === &apos;overvalued&apos; ? &apos;bg-red-500/20 text-red-400&apos; :
                                                inefficiency.type === &apos;run_opportunity&apos; ? &apos;bg-yellow-500/20 text-yellow-400&apos; :
                                                &apos;bg-blue-500/20 text-blue-400&apos;
                                            }`}>
                                                {inefficiency.type.replace(&apos;_&apos;, &apos; &apos;).toUpperCase()}
                                            </span>
                                            
                                            <span className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                                Act within {inefficiency.timeWindow} picks
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                                
                                {marketInefficiencies.length === 0 && (
}
                                    <div className="text-center py-8 text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                        <TrendingUpIcon className="w-12 h-12 mx-auto mb-3 opacity-50 sm:px-4 md:px-6 lg:px-8" />
                                        <p>No significant market inefficiencies detected</p>
                                        <p className="text-sm sm:px-4 md:px-6 lg:px-8">Market is following expected patterns</p>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {selectedTab === &apos;strategy&apos; && (
}
                            <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                                <div className="bg-white/5 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
                                    <h4 className="font-medium text-[var(--text-primary)] mb-3 sm:px-4 md:px-6 lg:px-8">Current Strategy</h4>
                                    <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                                        <div>
                                            <span className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Name: </span>
                                            <span className="text-sm text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{currentStrategy.name}</span>
                                        </div>
                                        <div>
                                            <span className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Description: </span>
                                            <span className="text-sm text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{currentStrategy.description}</span>
                                        </div>
                                        <div>
                                            <span className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Risk Tolerance: </span>
                                            <span className="text-sm text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{currentStrategy.riskTolerance}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-white/5 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
                                    <h4 className="font-medium text-[var(--text-primary)] mb-3 sm:px-4 md:px-6 lg:px-8">Position Priority</h4>
                                    <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                                        {currentStrategy.positionPriority.map((position, index) => (
}
                                            <div key={position} className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                                                <span className="text-sm text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                                    {index + 1}. {position}
                                                </span>
                                                <span className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                                    Priority {index + 1}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

// Helper functions
const getPositionLimit = (position: string): number => {
}
    const limits: Record<string, number> = {
}
        &apos;QB&apos;: 2,
        &apos;RB&apos;: 4,
        &apos;WR&apos;: 5,
        &apos;TE&apos;: 2,
        &apos;K&apos;: 1,
        &apos;DST&apos;: 1
    };
    return limits[position] || 1;
};

const calculateReachTendency = (picks: DraftPick[]): number => {
}
    const reaches = picks.filter((pick: any) => pick?.adpDifference > 10).length;
    return Math.min(1, reaches / Math.max(picks.length, 1));
};

const calculateValueTendency = (picks: DraftPick[]): number => {
}
    const values = picks.filter((pick: any) => pick?.adpDifference < -5).length;
    return Math.min(1, values / Math.max(picks.length, 1));
};

const determineRiskProfile = (picks: DraftPick[]): &apos;conservative&apos; | &apos;moderate&apos; | &apos;aggressive&apos; => {
}
    const reachTendency = calculateReachTendency(picks);
    if (reachTendency > 0.3) return &apos;aggressive&apos;;
    if (reachTendency > 0.1) return &apos;moderate&apos;;
    return &apos;conservative&apos;;
};

const inferDraftStrategy = (picks: DraftPick[], roster: Player[]): string => {
}
    const positionCounts: Record<string, number> = {};
    [...picks.map((p: any) => p.player), ...roster].forEach((player: any) => {
}
        if (player) {
}
            positionCounts[player.position] = (positionCounts[player.position] || 0) + 1;

    });

    const rbCount = positionCounts[&apos;RB&apos;] || 0;
    const wrCount = positionCounts[&apos;WR&apos;] || 0;
    
    if (rbCount > wrCount + 1) return &apos;RB Heavy&apos;;
    if (wrCount > rbCount + 1) return &apos;WR Heavy&apos;;
    if (picks.length > 0 && picks.every((p: any) => p?.adpDifference < 5)) return &apos;Value Based&apos;;
    return &apos;Balanced&apos;;
};

const EnhancedAiDraftCoachWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <EnhancedAiDraftCoach {...props} />
  </ErrorBoundary>
);

export default React.memo(EnhancedAiDraftCoachWithErrorBoundary);
