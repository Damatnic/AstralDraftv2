/**
 * Enhanced Draft Simulation Engine
 * Advanced AI with opponent modeling and market analysis
 */

import { Player, Team, League } from &apos;../types&apos;;

export interface EnhancedAiPersonality {
}
    id: string;
    name: string;
    description: string;
    tendencies: {
}
        reachTendency: number; // 0-1, how likely to reach for players
        valueFocus: number; // 0-1, how much they prioritize ADP value
        positionBalance: number; // 0-1, how balanced vs specialized they draft
        riskTolerance: number; // 0-1, willingness to take risky picks
        needsFocus: number; // 0-1, how much they focus on team needs vs BPA
        recencyBias: number; // 0-1, how much recent performance matters
        trendFollowing: number; // 0-1, how likely to follow positional runs
    };
    positionPriorities: Record<string, number>; // Position weights
    draftStrategy: string;
    adaptability: number; // How much they adjust based on draft flow
}

export interface DraftContext {
}
    currentRound: number;
    currentPick: number;
    availablePlayers: Player[];
    recentPicks: DraftPick[];
    positionRuns: Record<string, number>;
    marketTrends: MarketTrend[];
    timeRemaining: number;
}

export interface DraftPick {
}
    pickNumber: number;
    teamId: number;
    playerId: number;
    player: Player;
    timestamp: number;
    reasoning: string;
    confidence: number;
    adpDifference: number;
    wasReach: boolean;
    strategyAlignment: number;
}

export interface MarketTrend {
}
    position: string;
    direction: &apos;up&apos; | &apos;down&apos; | &apos;stable&apos;;
    magnitude: number;
    confidence: number;
    timeWindow: number;
    causedBy: string[];
}

export interface OpponentBehaviorModel {
}
    teamId: number;
    personality: EnhancedAiPersonality;
    adaptedTendencies: Record<string, number>;
    predictedBehavior: {
}
        nextPositionLikelihood: Record<string, number>;
        reachProbability: number;
        averagePickTime: number;
        panicThreshold: number;
    };
    confidence: number;
    adaptationHistory: AdaptationEvent[];
}

export interface AdaptationEvent {
}
    round: number;
    trigger: string;
    adjustment: Record<string, number>;
    confidence: number;
}

export interface PickRecommendation {
}
    player: Player;
    reasoning: string[];
    confidence: number;
    risk: number;
    value: number;
    strategicFit: number;
    marketTiming: number;
    alternatives: Player[];
}

class EnhancedDraftSimulationEngine {
}
    private aiPersonalities: EnhancedAiPersonality[];
    private opponentModels: Map<number, OpponentBehaviorModel>;
    private marketAnalyzer: MarketAnalyzer;
    private strategyAdvisor: StrategyAdvisor;

    constructor() {
}
        this.aiPersonalities = this.initializeAiPersonalities();
        this.opponentModels = new Map();
        this.marketAnalyzer = new MarketAnalyzer();
        this.strategyAdvisor = new StrategyAdvisor();
    }

    private initializeAiPersonalities(): EnhancedAiPersonality[] {
}
        return [
            {
}
                id: &apos;value-hunter&apos;,
                name: &apos;Value Hunter&apos;,
                description: &apos;Focuses on ADP value and finding steals&apos;,
                tendencies: {
}
                    reachTendency: 0.2,
                    valueFocus: 0.9,
                    positionBalance: 0.7,
                    riskTolerance: 0.6,
                    needsFocus: 0.4,
                    recencyBias: 0.3,
                    trendFollowing: 0.4
                },
                positionPriorities: { &apos;RB&apos;: 1.2, &apos;WR&apos;: 1.1, &apos;QB&apos;: 0.8, &apos;TE&apos;: 0.9, &apos;K&apos;: 0.5, &apos;DST&apos;: 0.5 },
                draftStrategy: &apos;Value-based with opportunistic picks&apos;,
                adaptability: 0.8
            },
            {
}
                id: &apos;zero-rb&apos;,
                name: &apos;Zero RB Advocate&apos;,
                description: &apos;Avoids early RBs, focuses on WR/QB&apos;,
                tendencies: {
}
                    reachTendency: 0.6,
                    valueFocus: 0.5,
                    positionBalance: 0.3,
                    riskTolerance: 0.8,
                    needsFocus: 0.9,
                    recencyBias: 0.4,
                    trendFollowing: 0.2
                },
                positionPriorities: { &apos;RB&apos;: 0.4, &apos;WR&apos;: 1.5, &apos;QB&apos;: 1.3, &apos;TE&apos;: 1.1, &apos;K&apos;: 0.6, &apos;DST&apos;: 0.6 },
                draftStrategy: &apos;Zero RB with early QB/WR focus&apos;,
                adaptability: 0.5
            },
            {
}
                id: &apos;robust-rb&apos;,
                name: &apos;Robust RB&apos;,
                description: &apos;Prioritizes RB depth and reliability&apos;,
                tendencies: {
}
                    reachTendency: 0.4,
                    valueFocus: 0.6,
                    positionBalance: 0.4,
                    riskTolerance: 0.3,
                    needsFocus: 0.8,
                    recencyBias: 0.2,
                    trendFollowing: 0.6
                },
                positionPriorities: { &apos;RB&apos;: 1.6, &apos;WR&apos;: 0.8, &apos;QB&apos;: 0.7, &apos;TE&apos;: 0.8, &apos;K&apos;: 0.5, &apos;DST&apos;: 0.5 },
                draftStrategy: &apos;RB-heavy with handcuff focus&apos;,
                adaptability: 0.6
            },
            {
}
                id: &apos;contrarian&apos;,
                name: &apos;Contrarian&apos;,
                description: &apos;Goes against popular trends and runs&apos;,
                tendencies: {
}
                    reachTendency: 0.7,
                    valueFocus: 0.4,
                    positionBalance: 0.6,
                    riskTolerance: 0.9,
                    needsFocus: 0.5,
                    recencyBias: 0.1,
                    trendFollowing: 0.1
                },
                positionPriorities: { &apos;RB&apos;: 1.0, &apos;WR&apos;: 1.0, &apos;QB&apos;: 1.0, &apos;TE&apos;: 1.0, &apos;K&apos;: 0.8, &apos;DST&apos;: 0.8 },
                draftStrategy: &apos;Anti-trend with contrarian picks&apos;,
                adaptability: 0.9
            },
            {
}
                id: &apos;analytics-focused&apos;,
                name: &apos;Analytics Guru&apos;,
                description: &apos;Relies heavily on projections and advanced metrics&apos;,
                tendencies: {
}
                    reachTendency: 0.3,
                    valueFocus: 0.8,
                    positionBalance: 0.8,
                    riskTolerance: 0.4,
                    needsFocus: 0.6,
                    recencyBias: 0.2,
                    trendFollowing: 0.3
                },
                positionPriorities: { &apos;RB&apos;: 1.1, &apos;WR&apos;: 1.1, &apos;QB&apos;: 0.9, &apos;TE&apos;: 0.9, &apos;K&apos;: 0.4, &apos;DST&apos;: 0.4 },
                draftStrategy: &apos;Projection-based with analytical edge&apos;,
                adaptability: 0.7
            },
            {
}
                id: &apos;panic-drafter&apos;,
                name: &apos;Panic Drafter&apos;,
                description: &apos;Makes emotional decisions under pressure&apos;,
                tendencies: {
}
                    reachTendency: 0.8,
                    valueFocus: 0.3,
                    positionBalance: 0.5,
                    riskTolerance: 0.7,
                    needsFocus: 0.9,
                    recencyBias: 0.8,
                    trendFollowing: 0.9
                },
                positionPriorities: { &apos;RB&apos;: 1.2, &apos;WR&apos;: 1.2, &apos;QB&apos;: 1.0, &apos;TE&apos;: 1.0, &apos;K&apos;: 0.7, &apos;DST&apos;: 0.7 },
                draftStrategy: &apos;Reactive with emotional picks&apos;,
                adaptability: 0.3
            }
        ];
    }

    public initializeOpponentModels(teams: Team[]): void {
}
        teams.forEach((team: any) => {
}
            // Assign personalities (could be based on historical data or random)
            const personality = this.aiPersonalities[Math.floor(Math.random() * this.aiPersonalities.length)];
            
            const model: OpponentBehaviorModel = {
}
                teamId: team.id,
                personality,
                adaptedTendencies: { ...personality.tendencies },
                predictedBehavior: {
}
                    nextPositionLikelihood: this.calculatePositionLikelihood(personality, team.roster || []),
                    reachProbability: personality.tendencies.reachTendency,
                    averagePickTime: 30 + Math.random() * 60, // 30-90 seconds
                    panicThreshold: 0.7
                },
                confidence: 0.5, // Start with medium confidence
                adaptationHistory: []
            };

            this.opponentModels.set(team.id, model);
        });
    }

    public updateOpponentModel(teamId: number, pick: DraftPick, context: DraftContext): void {
}
        const model = this.opponentModels.get(teamId);
        if (!model) return;

        // Analyze the pick for behavioral insights
        const pickAnalysis = this.analyzePickBehavior(pick, model.personality, context);
        
        // Update confidence based on prediction accuracy
        const accuracyScore = this.calculatePredictionAccuracy(pick, model);
        model.confidence = Math.min(0.95, model.confidence + (accuracyScore - 0.5) * 0.1);

        // Adapt tendencies based on observed behavior
        if (pickAnalysis.significantDeviation) {
}
            this.adaptPersonality(model, pickAnalysis, context);
        }

        // Update predicted behavior
        model.predictedBehavior = {
}
            nextPositionLikelihood: this.calculatePositionLikelihood(model.personality, []), // Would use actual roster
            reachProbability: model.adaptedTendencies.reachTendency,
            averagePickTime: model.predictedBehavior.averagePickTime * 0.9 + pick.timestamp * 0.1,
            panicThreshold: model.predictedBehavior.panicThreshold
        };
    }

    public predictOpponentPick(teamId: number, context: DraftContext): PickRecommendation | null {
}
        const model = this.opponentModels.get(teamId);
        if (!model) return null;

        const availablePlayers = context.availablePlayers;
        const scoredPlayers = availablePlayers.map((player: any) => ({
}
            player,
            score: this.calculatePlayerScore(player, model, context),
            reasoning: this.generatePickReasoning(player, model, context)
        }));

        // Sort by score and apply some randomness based on confidence
        scoredPlayers.sort((a, b) => b.score - a.score);
        
        // Add uncertainty based on model confidence
        const uncertaintyFactor = 1 - model.confidence;
        const topCandidates = scoredPlayers.slice(0, Math.max(1, Math.floor(3 * (1 + uncertaintyFactor))));
        
        // Weighted random selection from top candidates
        const selectedCandidate = this.weightedRandomSelection(topCandidates);
        
        if (selectedCandidate) {
}
            return {
}
                player: selectedCandidate.player,
                reasoning: selectedCandidate.reasoning,
                confidence: model.confidence,
                risk: this.calculatePickRisk(selectedCandidate.player, model, context),
                value: this.calculatePickValue(selectedCandidate.player, context),
                strategicFit: this.calculateStrategicFit(selectedCandidate.player, model),
                marketTiming: this.calculateMarketTiming(selectedCandidate.player, context),
                alternatives: topCandidates.slice(1, 4).map((c: any) => c.player)
            };
        }

        return null;
    }

    public analyzeMarketTrends(context: DraftContext): MarketTrend[] {
}
        return this.marketAnalyzer.analyzeTrends(context);
    }

    public generateStrategyRecommendations(userTeam: Team, context: DraftContext): PickRecommendation[] {
}
        return this.strategyAdvisor.generateRecommendations(userTeam, context, this.opponentModels);
    }

    private analyzePickBehavior(pick: DraftPick, personality: EnhancedAiPersonality, context: DraftContext): any {
}
        const expectedReachTendency = personality.tendencies.reachTendency;
        const actualReach = pick.adpDifference > 10 ? 1 : 0;
        const reachDeviation = Math.abs(actualReach - expectedReachTendency);

        const expectedValueFocus = personality.tendencies.valueFocus;
        const actualValueFocus = pick.adpDifference < -5 ? 1 : 0;
        const valueDeviation = Math.abs(actualValueFocus - expectedValueFocus);

        return {
}
            reachDeviation,
            valueDeviation,
            significantDeviation: reachDeviation > 0.3 || valueDeviation > 0.3,
            pickType: this.classifyPick(pick, context)
        };
    }

    private classifyPick(pick: DraftPick, context: DraftContext): string {
}
        if (pick.adpDifference > 15) return &apos;major_reach&apos;;
        if (pick.adpDifference > 5) return &apos;reach&apos;;
        if (pick.adpDifference < -10) return &apos;value&apos;;
        if (context.positionRuns[pick.player.position] >= 3) return &apos;trend_follow&apos;;
        return &apos;standard&apos;;
    }

    private adaptPersonality(model: OpponentBehaviorModel, analysis: any, context: DraftContext): void {
}
        const adaptationStrength = model.personality.adaptability * 0.1;
        
        // Record adaptation event
        model.adaptationHistory.push({
}
            round: context.currentRound,
            trigger: analysis.pickType,
            adjustment: {},
            confidence: model.confidence
        });

        // Adjust tendencies based on observed behavior
        if (analysis.reachDeviation > 0.3) {
}
            const adjustment = analysis.pickType === &apos;reach&apos; ? adaptationStrength : -adaptationStrength;
            model.adaptedTendencies.reachTendency = Math.max(0, Math.min(1, 
                model.adaptedTendencies.reachTendency + adjustment));
        }

        if (analysis.valueDeviation > 0.3) {
}
            const adjustment = analysis.pickType === &apos;value&apos; ? adaptationStrength : -adaptationStrength;
            model.adaptedTendencies.valueFocus = Math.max(0, Math.min(1, 
                model.adaptedTendencies.valueFocus + adjustment));
        }
    }

    private calculatePredictionAccuracy(pick: DraftPick, model: OpponentBehaviorModel): number {
}
        // This would compare predicted vs actual pick
        // For now, return a simulated accuracy score
        const baseAccuracy = 0.5;
        const confidenceBonus = model.confidence * 0.3;
        const randomFactor = (Math.random() - 0.5) * 0.4;
        
        return Math.max(0, Math.min(1, baseAccuracy + confidenceBonus + randomFactor));
    }

    private calculatePositionLikelihood(personality: EnhancedAiPersonality, roster: Player[]): Record<string, number> {
}
        const positionCounts: Record<string, number> = {};
        roster.forEach((player: any) => {
}
            positionCounts[player.position] = (positionCounts[player.position] || 0) + 1;
        });

        const likelihood: Record<string, number> = {};
        Object.entries(personality.positionPriorities).forEach(([position, priority]) => {
}
            const currentCount = positionCounts[position] || 0;
            const maxNeeded = this.getPositionMax(position);
            const need = Math.max(0, maxNeeded - currentCount) / maxNeeded;
            likelihood[position] = priority * need;
        });

        // Normalize to sum to 1
        const total = Object.values(likelihood).reduce((sum, val) => sum + val, 0);
        Object.keys(likelihood).forEach((pos: any) => {
}
            likelihood[pos] = likelihood[pos] / total;
        });

        return likelihood;
    }

    private getPositionMax(position: string): number {
}
        const maxMap: Record<string, number> = {
}
            &apos;QB&apos;: 2, &apos;RB&apos;: 4, &apos;WR&apos;: 5, &apos;TE&apos;: 2, &apos;K&apos;: 1, &apos;DST&apos;: 1
        };
        return maxMap[position] || 1;
    }

    private calculatePlayerScore(player: Player, model: OpponentBehaviorModel, context: DraftContext): number {
}
        const personality = model.personality;
        const tendencies = model.adaptedTendencies;

        // Base score from player quality
        let score = player.stats.projection || 0;

        // Position priority
        const positionPriority = personality.positionPriorities[player.position] || 1;
        score *= positionPriority;

        // Value consideration
        const adpDifference = (player.adp || 999) - context.currentPick;
        if (adpDifference > 0) { // Player available later than ADP
}
            score *= (1 + tendencies.valueFocus * 0.2);
        } else { // Player going earlier than ADP
}
            score *= (1 - tendencies.reachTendency * 0.3);
        }

        // Trend following
        const positionRun = context.positionRuns[player.position] || 0;
        if (positionRun >= 2) {
}
            score *= (1 + tendencies.trendFollowing * 0.15);
        }

        // Recency bias
        const recentPerformance = this.getRecentPerformanceScore(player);
        score *= (1 + tendencies.recencyBias * recentPerformance * 0.1);

        // Risk tolerance
        const playerRisk = this.calculatePlayerRisk(player);
        if (playerRisk > 0.5) {
}
            score *= (1 - (1 - tendencies.riskTolerance) * 0.2);
        }

        return score;
    }

    private calculatePlayerRisk(player: Player): number {
}
        // Simulate risk calculation based on various factors
        let risk = 0;
        
        // Age risk
        if (player.age && player.age > 30) risk += 0.2;
        if (player.age && player.age > 32) risk += 0.2;
        
        // Injury history (simulated)
        const injuryRisk = Math.random() * 0.3;
        risk += injuryRisk;
        
        // Position risk
        if (player.position === &apos;RB&apos;) risk += 0.1;
        
        return Math.min(1, risk);
    }

    private getRecentPerformanceScore(player: Player): number {
}
        // Simulate recent performance score
        return (Math.random() - 0.5) * 2; // -1 to 1
    }

    private generatePickReasoning(player: Player, model: OpponentBehaviorModel, context: DraftContext): string[] {
}
        const reasoning: string[] = [];
        const personality = model.personality;

        reasoning.push(`${personality.name} personality favors this type of pick`);

        if ((player.adp || 999) > context.currentPick + 5) {
}
            reasoning.push(`Good value - ${player.name} typically goes ${((player.adp || 999) - context.currentPick).toFixed(1)} picks later`);
        }

        const positionPriority = personality.positionPriorities[player.position];
        if (positionPriority > 1.2) {
}
            reasoning.push(`High priority position (${player.position}) for this drafter`);
        }

        const positionRun = context.positionRuns[player.position] || 0;
        if (positionRun >= 2 && model.adaptedTendencies.trendFollowing > 0.5) {
}
            reasoning.push(`Following ${player.position} run (${positionRun} recent picks)`);
        }

        return reasoning;
    }

    private calculatePickRisk(player: Player, model: OpponentBehaviorModel, context: DraftContext): number {
}
        return this.calculatePlayerRisk(player);
    }

    private calculatePickValue(player: Player, context: DraftContext): number {
}
        const adpDifference = (player.adp || 999) - context.currentPick;
        return Math.max(0, Math.min(100, 50 + adpDifference * 2));
    }

    private calculateStrategicFit(player: Player, model: OpponentBehaviorModel): number {
}
        const positionPriority = model.personality.positionPriorities[player.position] || 1;
        return Math.min(100, positionPriority * 50);
    }

    private calculateMarketTiming(player: Player, context: DraftContext): number {
}
        const positionRun = context.positionRuns[player.position] || 0;
        if (positionRun >= 3) return 90; // Good timing to grab position
        if (positionRun === 0) return 60; // Neutral timing
        return 75; // Moderate timing
    }

    private weightedRandomSelection(candidates: any[]): any {
}
        if (candidates.length === 0) return null;
        if (candidates.length === 1) return candidates[0];

        // Weight by score with exponential decay
        const weights = candidates.map((c, i) => Math.pow(0.7, i));
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        
        let random = Math.random() * totalWeight;
        for (let i = 0; i < candidates.length; i++) {
}
            random -= weights[i];
            if (random <= 0) return candidates[i];
        }
        
        return candidates[0];
    }
}

class MarketAnalyzer {
}
    analyzeTrends(context: DraftContext): MarketTrend[] {
}
        const trends: MarketTrend[] = [];
        const positions = [&apos;QB&apos;, &apos;RB&apos;, &apos;WR&apos;, &apos;TE&apos;];

        positions.forEach((position: any) => {
}
            const recentPicks = context.recentPicks.slice(-5);
            const positionPicks = recentPicks.filter((pick: any) => pick.player.position === position);
            
            if (positionPicks.length >= 3) {
}
                trends.push({
}
                    position,
                    direction: &apos;up&apos;,
                    magnitude: positionPicks.length / recentPicks.length,
                    confidence: 0.8,
                    timeWindow: 5,
                    causedBy: [`${positionPicks.length} ${position} picks in last 5 selections`]
                });
            }
        });

        return trends;
    }
}

class StrategyAdvisor {
}
    generateRecommendations(userTeam: Team, context: DraftContext, opponentModels: Map<number, OpponentBehaviorModel>): PickRecommendation[] {
}
        const recommendations: PickRecommendation[] = [];
        const availablePlayers = context.availablePlayers.slice(0, 10);

        availablePlayers.forEach((player: any) => {
}
            const recommendation: PickRecommendation = {
}
                player,
                reasoning: this.generateStrategicReasoning(player, userTeam, context, opponentModels),
                confidence: this.calculateRecommendationConfidence(player, userTeam, context),
                risk: this.calculatePlayerRisk(player),
                value: this.calculatePlayerValue(player, context),
                strategicFit: this.calculateUserTeamFit(player, userTeam),
                marketTiming: this.calculateMarketTiming(player, context),
                alternatives: []
            };

            recommendations.push(recommendation);
        });

        return recommendations.sort((a, b) => 
            (b.confidence * b.value * b.strategicFit) - (a.confidence * a.value * a.strategicFit)
        );
    }

    private generateStrategicReasoning(player: Player, userTeam: Team, context: DraftContext, opponentModels: Map<number, OpponentBehaviorModel>): string[] {
}
        const reasoning: string[] = [];

        // Team need analysis
        const rosterCount = userTeam.roster?.filter((p: any) => p.position === player.position).length || 0;
        const maxNeeded = this.getPositionMax(player.position);
        
        if (rosterCount < maxNeeded / 2) {
}
            reasoning.push(`Addresses critical ${player.position} need`);
        }

        // Value analysis
        if ((player.adp || 999) > context.currentPick + 10) {
}
            reasoning.push(`Exceptional value - falling ${((player.adp || 999) - context.currentPick).toFixed(1)} picks`);
        }

        // Opponent behavior prediction
        const likelyToBeTaken = this.predictPlayerTakenSoon(player, context, opponentModels);
        if (likelyToBeTaken > 0.7) {
}
            reasoning.push(`High probability other teams target this player`);
        }

        return reasoning;
    }

    private predictPlayerTakenSoon(player: Player, context: DraftContext, opponentModels: Map<number, OpponentBehaviorModel>): number {
}
        let totalProbability = 0;
        let teamsConsidered = 0;

        opponentModels.forEach((model: any) => {
}
            const positionLikelihood = model.predictedBehavior.nextPositionLikelihood[player.position] || 0;
            totalProbability += positionLikelihood;
            teamsConsidered++;
        });

        return teamsConsidered > 0 ? totalProbability / teamsConsidered : 0;
    }

    private calculateRecommendationConfidence(player: Player, userTeam: Team, context: DraftContext): number {
}
        let confidence = 0.5;

        // Higher confidence for addressing needs
        const rosterCount = userTeam.roster?.filter((p: any) => p.position === player.position).length || 0;
        if (rosterCount === 0) confidence += 0.3;

        // Value confidence
        const adpDifference = (player.adp || 999) - context.currentPick;
        if (adpDifference > 5) confidence += 0.2;

        // Round appropriateness
        if (context.currentRound <= 3 && [&apos;RB&apos;, &apos;WR&apos;].includes(player.position)) {
}
            confidence += 0.2;
        }

        return Math.min(1, confidence);
    }

    private calculatePlayerRisk(player: Player): number {
}
        // Reuse risk calculation from main engine
        return Math.random() * 0.5 + 0.2; // Simplified for now
    }

    private calculatePlayerValue(player: Player, context: DraftContext): number {
}
        const adpDifference = (player.adp || 999) - context.currentPick;
        return Math.max(0, Math.min(100, 50 + adpDifference * 2));
    }

    private calculateUserTeamFit(player: Player, userTeam: Team): number {
}
        const rosterCount = userTeam.roster?.filter((p: any) => p.position === player.position).length || 0;
        const maxNeeded = this.getPositionMax(player.position);
        const need = Math.max(0, maxNeeded - rosterCount) / maxNeeded;
        
        return need * 100;
    }

    private calculateMarketTiming(player: Player, context: DraftContext): number {
}
        const positionRun = context.positionRuns[player.position] || 0;
        if (positionRun >= 3) return 90;
        if (positionRun === 0) return 60;
        return 75;
    }

    private getPositionMax(position: string): number {
}
        const maxMap: Record<string, number> = {
}
            &apos;QB&apos;: 2, &apos;RB&apos;: 4, &apos;WR&apos;: 5, &apos;TE&apos;: 2, &apos;K&apos;: 1, &apos;DST&apos;: 1
        };
        return maxMap[position] || 1;
    }
}

export default EnhancedDraftSimulationEngine;
