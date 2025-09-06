/**
 * Enhanced AI Draft Coach Hook
 * Integrates real-time strategy adjustments, opponent modeling, and market analysis
 */

import { useState, useEffect, useMemo } from 'react';
import { Player, Team, League } from '../types';

// Enhanced interfaces for type safety
export interface DraftPick {
    player: Player;
    team: Team;
    pickNumber: number;
    round: number;
    teamId: string;
    playerId: string;
    timestamp: number;
    reasoning?: string[];}

export interface PickRecommendation {
    player: Player;
    score: number;
    reasoning: string[];
    position: string;
    value: number;
    riskLevel: 'low' | 'medium' | 'high';
    priority: number;}

export interface OpponentBehaviorModel {
    teamId: string;
    tendencies: {
        favoredPositions: string[];
        riskTolerance: number;
        valueSeeker: boolean;
        positionPriority: Record<string, number>;
    };
    patterns: {
        averagePickTime: number;
        positionRunLikelihood: number;
        reachLikelihood: number;
    };

export interface MarketInefficiency {
    type: 'undervalued' | 'overvalued' | 'positional_scarcity' | 'tier_break';
    position: string;
    players: Player[];
    description: string;
    severity: number;
    expectedPickRange: [number, number];

export interface DraftStrategy {
    name: string;
    description: string;
    targetPositions: string[];
    riskLevel: 'conservative' | 'balanced' | 'aggressive';
    marketApproach: 'value' | 'need' | 'best_available';

export interface StrategyRecommendation {
    strategy: DraftStrategy;
    reasoning: string[];
    confidence: number;
    situationalFactors: string[];

export interface StrategyAdjustment {
    type: 'position_priority' | 'risk_tolerance' | 'market_timing' | 'opponent_reaction';
    description: string;
    impact: 'low' | 'medium' | 'high';
    reasoning: string[];}

export interface AiCoachConfig {
    enableOpponentModeling: boolean;
    enableMarketAnalysis: boolean;
    enableRealTimeAdjustments: boolean;
    aggressiveness: number; // 0-1 scale
    maxRecommendations: number;
    considerInjuries: boolean;
    considerByes: boolean;}

export interface AiCoachState {
    isActive: boolean;
    recommendations: PickRecommendation[];
    opponentModels: OpponentBehaviorModel[];
    marketInefficiencies: MarketInefficiency[];
    currentStrategy: DraftStrategy | null;
    strategyAdjustments: StrategyAdjustment[];
    confidence: number;
    reasoning: string[];
    analysis: {
        positionNeeds: Record<string, number>;
        valueOpportunities: Player[];
        riskyPicks: Player[];
        safetyPicks: Player[];
    };

export interface DraftContext {
    currentPick: number;
    currentRound: number;
    userTeam: Team;
    availablePlayers: Player[];
    recentPicks: DraftPick[];
    timeRemaining: number;
    league: League;}

const useEnhancedAiDraftCoach = (params: {
    league: League;
    userTeam: Team;
    currentPick: number;
    currentRound: number;
    availablePlayers: Player[];
    recentPicks: DraftPick[];
    timeRemaining: number;
    isUserTurn: boolean;
    config?: AiCoachConfig;
}) => {
    const {
        league,
        userTeam,
        currentPick,
        currentRound,
        availablePlayers,
        recentPicks,
        timeRemaining,
        isUserTurn,
        config = {
            enableOpponentModeling: true,
            enableMarketAnalysis: true,
            enableRealTimeAdjustments: true,
            aggressiveness: 0.6,
            maxRecommendations: 5,
            considerInjuries: true,
            considerByes: false
        }
    } = params;

    // AI Coach State
    const [aiState, setAiState] = useState<AiCoachState>({
        isActive: false,
        recommendations: [],
        opponentModels: [],
        marketInefficiencies: [],
        currentStrategy: null,
        strategyAdjustments: [],
        confidence: 0,
        reasoning: [],
        analysis: {
            positionNeeds: {},
            valueOpportunities: [],
            riskyPicks: [],
            safetyPicks: []
        }
    });

    // Memoized draft context to prevent unnecessary recalculations
    const draftContext = useMemo<DraftContext>(() => ({
        currentPick,
        currentRound,
        userTeam,
        availablePlayers,
        recentPicks,
        timeRemaining,
//         league
    }), [currentPick, currentRound, userTeam, availablePlayers, recentPicks, timeRemaining, league]);

    // Perform comprehensive analysis
    const performComprehensiveAnalysis = async (context: DraftContext) => {
        try {
            // Position needs analysis
            const positionNeeds = analyzePositionNeeds(context.userTeam);
            
            // Market inefficiencies
            const marketInefficiencies = detectMarketInefficiencies(context.availablePlayers, context.recentPicks);
            
            // Opponent modeling
            const opponentModels = config.enableOpponentModeling 
                ? modelOpponentBehavior(context.recentPicks, context.league)
                : [];
            
            // Generate recommendations
            const recommendations = generateRecommendations(
                context.availablePlayers,
                positionNeeds,
                marketInefficiencies,
//                 config
            );

            // Strategy analysis
            const currentStrategy = determineOptimalStrategy(context, config);
            
            setAiState(prev => ({
                ...prev,
                isActive: true,
                recommendations,
                opponentModels,
                marketInefficiencies,
                currentStrategy,
                analysis: {
                    positionNeeds,
                    valueOpportunities: recommendations.slice(0, 3).map((r: any) => r.player),
                    riskyPicks: recommendations.filter((r: any) => r.riskLevel === 'high').map((r: any) => r.player),
                    safetyPicks: recommendations.filter((r: any) => r.riskLevel === 'low').map((r: any) => r.player)
                },
                confidence: calculateConfidence(recommendations, context),
                reasoning: generateAnalysisReasoning(context, recommendations)
            }));

        } catch (error) {
            console.warn('AI Coach analysis failed:', error);
            setAiState(prev => ({
                ...prev,
                isActive: false,
                confidence: 0
            }));
        }
    };

    // Main analysis effect
    useEffect(() => {
        if (isUserTurn && aiState.isActive) {
            performComprehensiveAnalysis(draftContext);
        }
        // Intentionally minimal dependencies to avoid infinite loops
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUserTurn, aiState.isActive]);

    // Real-time strategy adjustments
    useEffect(() => {
        if (config.enableRealTimeAdjustments && recentPicks.length > 0) {
            const adjustments = analyzeRecentPicksForAdjustments(
                recentPicks.slice(-3),
                aiState.currentStrategy,
//                 draftContext
            );
            
            if (adjustments.length > 0) {
                setAiState(prev => ({
                    ...prev,
                    strategyAdjustments: adjustments
                }));
            }
        }
    }, [recentPicks, aiState.currentStrategy, draftContext, config.enableRealTimeAdjustments]);

    // Helper functions
    const analyzePositionNeeds = (team: Team): Record<string, number> => {
        const needs: Record<string, number> = {
            QB: 1,
            RB: 2,
            WR: 3,
            TE: 1,
            K: 1,
            DST: 1
        };

        // Analyze current roster
        team.roster?.forEach((player: any) => {
            if (needs[player.position]) {
                needs[player.position] -= 1;
            }
        });

        // Ensure minimum values
        Object.keys(needs).forEach((pos: any) => {
            needs[pos] = Math.max(0, needs[pos]);
        });

        return needs;
    };

    const detectMarketInefficiencies = (
        players: Player[], 
        picks: DraftPick[]
    ): MarketInefficiency[] => {
        const inefficiencies: MarketInefficiency[] = [];
        
        // Analyze recent position runs
        const positionRuns = calculatePositionRuns(picks);
        
        Object.entries(positionRuns).forEach(([position, runLength]) => {
            if (runLength >= 3) {
                const availableAtPosition = players.filter((p: any) => p.position === position);
                if (availableAtPosition.length > 0) {
                    inefficiencies.push({
                        type: 'positional_scarcity',
                        position,
                        players: availableAtPosition.slice(0, 3),
                        description: `${position} run detected - ${runLength} consecutive picks`,
                        severity: Math.min(runLength / 3, 1),
                        expectedPickRange: [currentPick, currentPick + 5]
                    });
                }
            }
        });

        return inefficiencies;
    };

    const modelOpponentBehavior = (picks: DraftPick[], leagueData: League): OpponentBehaviorModel[] => {
        const models: OpponentBehaviorModel[] = [];
        
        leagueData.teams.forEach((team: any) => {
            const teamPicks = picks.filter((p: any) => p.teamId === team.id.toString());
            
            if (teamPicks.length > 0) {
                const favoredPositions = calculateFavoredPositions(teamPicks);
                
                models.push({
                    teamId: team.id.toString(),
                    tendencies: {
                        favoredPositions,
                        riskTolerance: 0.5,
                        valueSeeker: false,
                        positionPriority: {
                            QB: 1,
                            RB: 2,
                            WR: 3,
                            TE: 4,
                            K: 5,
                            DST: 6
                        }
                    },
                    patterns: {
                        averagePickTime: 30,
                        positionRunLikelihood: 0.3,
                        reachLikelihood: 0.2
                    }
                });
            }
        });

        return models;
    };

    const generateRecommendations = (
        players: Player[],
        needs: Record<string, number>,
        inefficiencies: MarketInefficiency[],
        configuration: AiCoachConfig
    ): PickRecommendation[] => {
        const recommendations: PickRecommendation[] = [];
        
        // Score each available player
        players.slice(0, 20).forEach((player: any) => {
            const needScore = needs[player.position] || 0;
            const valueScore = calculatePlayerValue(player, currentPick);
            const riskScore = calculateRiskLevel(player);
            
            const totalScore = (needScore * 0.4) + (valueScore * 0.6);
            
            if (totalScore > 0.3) {
                recommendations.push({
                    player,
                    score: totalScore,
                    reasoning: [
                        `Position need: ${needScore > 0 ? 'High' : 'Low'}`,
                        `Value at pick ${currentPick}: ${valueScore > 0.7 ? 'Excellent' : valueScore > 0.5 ? 'Good' : 'Fair'}`,
                        `Risk level: ${riskScore}`
                    ],
                    position: player.position,
                    value: valueScore,
                    riskLevel: riskScore,
                    priority: Math.round(totalScore * 10)
                });
            }
        });

        return recommendations
            .sort((a, b) => b.score - a.score)
            .slice(0, configuration.maxRecommendations);
    };

    const determineOptimalStrategy = (context: DraftContext, _configuration: AiCoachConfig): DraftStrategy => {
        const roundFactor = context.currentRound <= 6 ? 'early' : context.currentRound <= 12 ? 'middle' : 'late';
        
        if (roundFactor === 'early') {
            return {
                name: 'Best Available Talent',
                description: 'Focus on highest-value players regardless of position',
                targetPositions: ['RB', 'WR', 'QB'],
                riskLevel: 'balanced',
                marketApproach: 'best_available'
            };
        } else if (roundFactor === 'middle') {
            return {
                name: 'Position-Specific Value',
                description: 'Target specific positional needs with good value',
                targetPositions: Object.keys(context.userTeam.roster || {}).filter((pos: any) => 
                    analyzePositionNeeds(context.userTeam)[pos] > 0
                ),
                riskLevel: 'balanced',
                marketApproach: 'value'
            };
        } else {
            return {
                name: 'Roster Completion',
                description: 'Fill remaining roster spots with upside players',
                targetPositions: ['K', 'DST', 'QB', 'RB', 'WR', 'TE'],
                riskLevel: 'aggressive',
                marketApproach: 'need'
            };
        }
    };

    const analyzeRecentPicksForAdjustments = (
        picks: DraftPick[],
        _strategy: DraftStrategy | null,
        _context: DraftContext
    ): StrategyAdjustment[] => {
        const adjustments: StrategyAdjustment[] = [];
        
        if (picks.length >= 2) {
            const lastTwoPositions = picks.slice(-2).map((p: any) => p.player.position);
            if (lastTwoPositions[0] === lastTwoPositions[1]) {
                adjustments.push({
                    type: 'position_priority',
                    description: `Consider avoiding ${lastTwoPositions[0]} due to recent run`,
                    impact: 'medium',
                    reasoning: ['Position run detected', 'Market may be overvaluing position']
                });
            }
        }

        return adjustments;
    };

    // Utility functions
    const calculatePositionRuns = (picks: DraftPick[]): Record<string, number> => {
        const runs: Record<string, number> = {};
        const recentPicks = picks.slice(-5);
        
        ['QB', 'RB', 'WR', 'TE'].forEach((position: any) => {
            let count = 0;
            for (let i = recentPicks.length - 1; i >= 0; i--) {
                if (recentPicks[i].player?.position === position) {
                    count++;
                } else {
                    break;
                }
            }
            runs[position] = count;
        });

        return runs;
    };

    const calculateFavoredPositions = (picks: DraftPick[]): string[] => {
        const positionCounts: Record<string, number> = {};
        
        picks.forEach((pick: any) => {
            const pos = pick.player.position;
            positionCounts[pos] = (positionCounts[pos] || 0) + 1;
        });

        return Object.entries(positionCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([pos]) => pos);
    };

    const calculatePlayerValue = (player: Player, pickNumber: number): number => {
        // Simple value calculation based on ranking vs pick position
        const expectedPick = 999; // Default ranking if not available
        const value = Math.max(0, 1 - Math.abs(expectedPick - pickNumber) / 50);
        return Math.min(1, value);
    };

    const calculateRiskLevel = (player: Player): 'low' | 'medium' | 'high' => {
        if (player.injuryStatus === 'out' || player.injuryStatus === 'questionable') {
            return 'high';
        }
        if (player.injuryStatus === 'doubtful') {
            return 'medium';
        }
        return 'low';
    };

    const calculateConfidence = (recommendations: PickRecommendation[], context: DraftContext): number => {
        if (recommendations.length === 0) return 0;
        
        const avgScore = recommendations.reduce((sum, rec) => sum + rec.score, 0) / recommendations.length;
        const timeBonus = context.timeRemaining > 30 ? 0.1 : 0;
        
        return Math.min(1, avgScore + timeBonus);
    };

    const generateAnalysisReasoning = (context: DraftContext, recommendations: PickRecommendation[]): string[] => {
        const reasoning: string[] = [];
        
        reasoning.push(`Round ${context.currentRound}, Pick ${context.currentPick}`);
        
        if (recommendations.length > 0) {
            reasoning.push(`Top recommendation: ${recommendations[0].player.name} (${recommendations[0].player.position})`);
            reasoning.push(`Primary reasoning: ${recommendations[0].reasoning[0]}`);
        }
        
        const needs = analyzePositionNeeds(context.userTeam);
        const topNeeds = Object.entries(needs)
            .filter(([, need]) => need > 0)
            .map(([pos]) => pos);
        
        if (topNeeds.length > 0) {
            reasoning.push(`Position needs: ${topNeeds.join(', ')}`);
        }

        return reasoning;
    };

    // Public API
    const getTopRecommendation = (): PickRecommendation | null => {
        return aiState.recommendations[0] || null;
    };

    const getRecommendationsByPosition = (position: string): PickRecommendation[] => {
        return aiState.recommendations.filter((rec: any) => rec.player.position === position);
    };

    const activateCoach = (): void => {
        setAiState(prev => ({ ...prev, isActive: true }));
    };

    const deactivateCoach = (): void => {
        setAiState(prev => ({ ...prev, isActive: false }));
    };

    const forceAnalysisUpdate = (): void => {
        performComprehensiveAnalysis(draftContext);
    };

    return {
        // State
        aiState,
        isActive: aiState.isActive,
        recommendations: aiState.recommendations,
        confidence: aiState.confidence,
        reasoning: aiState.reasoning,
        
        // Analysis
        marketInefficiencies: aiState.marketInefficiencies,
        opponentModels: aiState.opponentModels,
        currentStrategy: aiState.currentStrategy,
        strategyAdjustments: aiState.strategyAdjustments,
        
        // Actions
        getTopRecommendation,
        getRecommendationsByPosition,
        activateCoach,
        deactivateCoach,
        forceAnalysisUpdate,
        
        // Utilities
        analyzePositionNeeds: () => analyzePositionNeeds(userTeam),
        calculatePlayerValue: (player: Player) => calculatePlayerValue(player, currentPick)
    };
};

export default useEnhancedAiDraftCoach;
