/**
 * Real-Time Strategy Adjustment Service
 * Dynamically adapts draft strategy based on live draft conditions
 */

import { Player, Team, League } from &apos;../types&apos;;
import MarketInefficiencyDetector, { MarketInefficiency } from &apos;./marketInefficiencyDetector&apos;;

export interface DraftStrategy {
}
    id: string;
    name: string;
    description: string;
    active: boolean;
    confidence: number;
    positionPriorities: Record<string, number>;
    riskTolerance: &apos;conservative&apos; | &apos;moderate&apos; | &apos;aggressive&apos;;
    adaptationTriggers: StrategyTrigger[];
    pickGuidelines: PickGuideline[];
    targetPlayers: Player[];
    avoidPlayers: Player[];
    contextualRules: ContextualRule[];
}

export interface StrategyTrigger {
}
    id: string;
    condition: string;
    threshold: number;
    action: string;
    priority: number;
    timesSinceTriggered: number;
}

export interface PickGuideline {
}
    condition: string;
    recommendation: string;
    weight: number;
    roundRelevance: number[];
}

export interface ContextualRule {
}
    scenario: string;
    condition: (context: DraftContext) => boolean;
    adjustment: StrategyAdjustment;
    priority: number;
}

export interface StrategyAdjustment {
}
    positionPriorityChanges: Record<string, number>;
    riskToleranceShift: number;
    targetPlayerUpdates: {
}
        add: Player[];
        remove: Player[];
    };
    reasoningUpdates: string[];
}

export interface DraftContext {
}
    currentRound: number;
    currentPick: number;
    picksRemaining: number;
    availablePlayers: Player[];
    userTeam: Team;
    league: League;
    recentPicks: any[];
    marketInefficiencies: MarketInefficiency[];
    timeRemaining: number;
    isUserTurn: boolean;
    draftFlow: DraftFlow;
}

export interface DraftFlow {
}
    positionRuns: Record<string, number>;
    valueDeviations: number[];
    averagePickTime: number;
    emergentPatterns: string[];
    marketSentiment: &apos;bullish&apos; | &apos;bearish&apos; | &apos;neutral&apos;;
}

export interface StrategyRecommendation {
}
    type: &apos;position_pivot&apos; | &apos;value_hunt&apos; | &apos;safe_pick&apos; | &apos;contrarian&apos; | &apos;need_fill&apos;;
    title: string;
    description: string;
    confidence: number;
    urgency: number;
    reasoning: string[];
    suggestedPlayers: Player[];
    riskLevel: number;
    potentialImpact: number;
}

class RealTimeStrategyAdjustmentService {
}
    private marketDetector: MarketInefficiencyDetector;
    private activeStrategies: Map<string, DraftStrategy>;
    private strategyHistory: StrategyAdjustment[];
    private performanceMetrics: Map<string, number>;

    constructor() {
}
        this.marketDetector = new MarketInefficiencyDetector();
        this.activeStrategies = new Map();
        this.strategyHistory = [];
        this.performanceMetrics = new Map();
        
        this.initializeBaseStrategies();
    }

    private initializeBaseStrategies(): void {
}
        const strategies: DraftStrategy[] = [
            {
}
                id: &apos;balanced-value&apos;,
                name: &apos;Balanced Value&apos;,
                description: &apos;Target best available value with positional balance&apos;,
                active: true,
                confidence: 0.8,
                positionPriorities: { RB: 1.2, WR: 1.1, QB: 0.8, TE: 0.9, K: 0.3, DST: 0.3 },
                riskTolerance: &apos;moderate&apos;,
                adaptationTriggers: [
                    {
}
                        id: &apos;rb-scarcity&apos;,
                        condition: &apos;available_rb_tier1_count < 3&apos;,
                        threshold: 3,
                        action: &apos;increase_rb_priority&apos;,
                        priority: 8,
                        timesSinceTriggered: 0
                    }
                ],
                pickGuidelines: [
                    {
}
                        condition: &apos;round <= 3&apos;,
                        recommendation: &apos;Focus on RB/WR with high floor&apos;,
                        weight: 0.9,
                        roundRelevance: [1, 2, 3]
                    }
                ],
                targetPlayers: [],
                avoidPlayers: [],
                contextualRules: []
            },
            {
}
                id: &apos;zero-rb&apos;,
                name: &apos;Zero RB&apos;,
                description: &apos;Fade early RBs, focus on WR depth and QB&apos;,
                active: false,
                confidence: 0.6,
                positionPriorities: { RB: 0.4, WR: 1.5, QB: 1.3, TE: 1.0, K: 0.3, DST: 0.3 },
                riskTolerance: &apos;aggressive&apos;,
                adaptationTriggers: [
                    {
}
                        id: &apos;wr-run&apos;,
                        condition: &apos;wr_consecutive_picks >= 4&apos;,
                        threshold: 4,
                        action: &apos;pivot_to_rb&apos;,
                        priority: 7,
                        timesSinceTriggered: 0
                    }
                ],
                pickGuidelines: [
                    {
}
                        condition: &apos;round <= 5&apos;,
                        recommendation: &apos;Target elite WRs and QB&apos;,
                        weight: 0.8,
                        roundRelevance: [1, 2, 3, 4, 5]
                    }
                ],
                targetPlayers: [],
                avoidPlayers: [],
                contextualRules: []
            },
            {
}
                id: &apos;robust-rb&apos;,
                name: &apos;Robust RB&apos;,
                description: &apos;Build RB depth early, handcuff strategy&apos;,
                active: false,
                confidence: 0.7,
                positionPriorities: { RB: 1.6, WR: 0.8, QB: 0.7, TE: 0.8, K: 0.3, DST: 0.3 },
                riskTolerance: &apos;conservative&apos;,
                adaptationTriggers: [
                    {
}
                        id: &apos;rb-value&apos;,
                        condition: &apos;rb_adp_value > 10&apos;,
                        threshold: 10,
                        action: &apos;increase_rb_priority&apos;,
                        priority: 9,
                        timesSinceTriggered: 0
                    }
                ],
                pickGuidelines: [
                    {
}
                        condition: &apos;round <= 6&apos;,
                        recommendation: &apos;Prioritize RB depth and handcuffs&apos;,
                        weight: 0.85,
                        roundRelevance: [1, 2, 3, 4, 5, 6]
                    }
                ],
                targetPlayers: [],
                avoidPlayers: [],
                contextualRules: []
            }
        ];

        strategies.forEach((strategy: any) => {
}
            this.activeStrategies.set(strategy.id, strategy);
        });
    }

    public analyzeAndAdjust(context: DraftContext): {
}
        adjustments: StrategyAdjustment[];
        recommendations: StrategyRecommendation[];
        strategyUpdates: DraftStrategy[];
    } {
}
        // Detect market inefficiencies
        const inefficiencies = this.marketDetector.detectInefficiencies(
            context.availablePlayers,
            context.currentPick,
            context.recentPicks,
            {
}
                currentRound: context.currentRound,
                league: context.league,
                draftedPlayers: []
            }
        );

        context.marketInefficiencies = inefficiencies;

        // Analyze draft flow and update context
        this.updateDraftFlow(context);

        // Check for strategy trigger conditions
        const triggeredAdjustments = this.checkStrategyTriggers(context);

        // Generate contextual adjustments
        const contextualAdjustments = this.generateContextualAdjustments(context);

        // Combine all adjustments
        const allAdjustments = [...triggeredAdjustments, ...contextualAdjustments];

        // Apply adjustments to strategies
        const updatedStrategies = this.applyAdjustments(allAdjustments, context);

        // Generate recommendations based on current state
        const recommendations = this.generateRecommendations(context, updatedStrategies);

        return {
}
            adjustments: allAdjustments,
            recommendations,
            strategyUpdates: Array.from(updatedStrategies.values())
        };
    }

    private updateDraftFlow(context: DraftContext): void {
}
        // Analyze position runs
        const positionRuns: Record<string, number> = {};
        const recentPicks = context.recentPicks.slice(-5);
        
        // Count consecutive picks by position
        const positions = [&apos;QB&apos;, &apos;RB&apos;, &apos;WR&apos;, &apos;TE&apos;];
        positions.forEach((position: any) => {
}
            let consecutiveCount = 0;
            for (let i = recentPicks.length - 1; i >= 0; i--) {
}
                if (recentPicks[i].player?.position === position) {
}
                    consecutiveCount++;
                } else {
}
                    break;
                }
            }
            positionRuns[position] = consecutiveCount;
        });

        // Analyze value deviations
        const valueDeviations = context.recentPicks
            .slice(-10)
            .map((pick: any) => pick.adpDifference || 0);

        // Calculate average pick time
        const averagePickTime = context.recentPicks
            .slice(-10)
            .reduce((sum, pick) => sum + (pick.timestamp || 60), 0) / Math.max(context.recentPicks.length, 1);

        // Detect emergent patterns
        const emergentPatterns: string[] = [];
        if (Object.values(positionRuns).some((count: any) => count >= 3)) {
}
            emergentPatterns.push(&apos;positional_run_detected&apos;);
        }
        if (valueDeviations.filter((dev: any) => Math.abs(dev) > 10).length >= 3) {
}
            emergentPatterns.push(&apos;high_volatility&apos;);
        }
        if (averagePickTime > 90) {
}
            emergentPatterns.push(&apos;slow_draft_pace&apos;);
        }

        // Determine market sentiment
        const recentValueSum = valueDeviations.slice(-5).reduce((sum, val) => sum + val, 0);
        let marketSentiment: &apos;bullish&apos; | &apos;bearish&apos; | &apos;neutral&apos; = &apos;neutral&apos;;
        if (recentValueSum > 15) marketSentiment = &apos;bearish&apos;; // Reaching
        else if (recentValueSum < -15) marketSentiment = &apos;bullish&apos;; // Value picks

        context.draftFlow = {
}
            positionRuns,
            valueDeviations,
            averagePickTime,
            emergentPatterns,
//             marketSentiment
        };
    }

    private checkStrategyTriggers(context: DraftContext): StrategyAdjustment[] {
}
        const adjustments: StrategyAdjustment[] = [];

        this.activeStrategies.forEach((strategy: any) => {
}
            strategy.adaptationTriggers.forEach((trigger: any) => {
}
                if (this.evaluateTriggerCondition(trigger, context)) {
}
                    const adjustment = this.createTriggerAdjustment(trigger, context);
                    adjustments.push(adjustment);
                    trigger.timesSinceTriggered = 0;
                } else {
}
                    trigger.timesSinceTriggered++;
                }
            });
        });

        return adjustments;
    }

    private evaluateTriggerCondition(trigger: StrategyTrigger, context: DraftContext): boolean {
}
        switch (trigger.condition) {
}
            case &apos;available_rb_tier1_count < 3&apos;:
                const tier1RBs = context.availablePlayers.filter((p: any) => p.position === &apos;RB&apos; && (p.tier || 10) <= 1);
                return tier1RBs.length < trigger.threshold;

            case &apos;wr_consecutive_picks >= 4&apos;:
                return (context.draftFlow.positionRuns[&apos;WR&apos;] || 0) >= trigger.threshold;

            case &apos;rb_adp_value > 10&apos;:
                const topRBs = context.availablePlayers.filter((p: any) => p.position === &apos;RB&apos;).slice(0, 3);
                const avgValue = topRBs.reduce((sum, p) => sum + ((p.adp || 999) - context.currentPick), 0) / topRBs.length;
                return avgValue > trigger.threshold;

            default:
                return false;
        }
    }

    private createTriggerAdjustment(trigger: StrategyTrigger, context: DraftContext): StrategyAdjustment {
}
        const adjustment: StrategyAdjustment = {
}
            positionPriorityChanges: {},
            riskToleranceShift: 0,
            targetPlayerUpdates: { add: [], remove: [] },
            reasoningUpdates: []
        };

        switch (trigger.action) {
}
            case &apos;increase_rb_priority&apos;:
                adjustment.positionPriorityChanges[&apos;RB&apos;] = 0.3;
                adjustment.reasoningUpdates.push(&apos;Increased RB priority due to scarcity&apos;);
                break;

            case &apos;pivot_to_rb&apos;:
                adjustment.positionPriorityChanges[&apos;RB&apos;] = 0.4;
                adjustment.positionPriorityChanges[&apos;WR&apos;] = -0.2;
                adjustment.reasoningUpdates.push(&apos;Pivoting to RB due to WR run&apos;);
                break;
        }

        return adjustment;
    }

    private generateContextualAdjustments(context: DraftContext): StrategyAdjustment[] {
}
        const adjustments: StrategyAdjustment[] = [];

        // Market inefficiency adjustments
        context.marketInefficiencies.forEach((inefficiency: any) => {
}
            if (inefficiency.severity === &apos;critical&apos; || inefficiency.severity === &apos;high&apos;) {
}
                const adjustment = this.createInefficiencyAdjustment(inefficiency, context);
                if (adjustment) adjustments.push(adjustment);
            }
        });

        // Time pressure adjustments
        if (context.isUserTurn && context.timeRemaining < 30) {
}
            adjustments.push({
}
                positionPriorityChanges: {},
                riskToleranceShift: -0.2, // More conservative under pressure
                targetPlayerUpdates: { add: [], remove: [] },
                reasoningUpdates: [&apos;Reduced risk tolerance due to time pressure&apos;]
            });
        }

        // Late round adjustments
        if (context.currentRound >= 10) {
}
            adjustments.push({
}
                positionPriorityChanges: { &apos;K&apos;: 0.5, &apos;DST&apos;: 0.5 },
                riskToleranceShift: 0.1, // More aggressive in late rounds
                targetPlayerUpdates: { add: [], remove: [] },
                reasoningUpdates: [&apos;Increased K/DST priority in late rounds&apos;]
            });
        }

        return adjustments;
    }

    private createInefficiencyAdjustment(inefficiency: MarketInefficiency, context: DraftContext): StrategyAdjustment | null {
}
        const adjustment: StrategyAdjustment = {
}
            positionPriorityChanges: {},
            riskToleranceShift: 0,
            targetPlayerUpdates: { add: [], remove: [] },
            reasoningUpdates: []
        };

        switch (inefficiency.type) {
}
            case &apos;undervalued&apos;:
                if (inefficiency.player) {
}
                    adjustment.targetPlayerUpdates.add.push(inefficiency.player);
                    adjustment.reasoningUpdates.push(`Target ${inefficiency.player.name} for exceptional value`);
                }
                break;

            case &apos;positional_scarcity&apos;:
                if (inefficiency.position) {
}
                    adjustment.positionPriorityChanges[inefficiency.position] = 0.3;
                    adjustment.reasoningUpdates.push(`Increased ${inefficiency.position} priority due to scarcity`);
                }
                break;

            case &apos;tier_break&apos;:
                if (inefficiency.player) {
}
                    adjustment.targetPlayerUpdates.add.push(inefficiency.player);
                    adjustment.riskToleranceShift = 0.1; // More willing to reach
                    adjustment.reasoningUpdates.push(`Target ${inefficiency.player.name} before tier drop`);
                }
                break;

            case &apos;run_opportunity&apos;:
                if (inefficiency.position) {
}
                    // Decide whether to join or fade the run
                    const userPositionCount = context.userTeam.roster?.filter((p: any) => p.position === inefficiency.position).length || 0;
                    const maxNeeded = this.getPositionMax(inefficiency.position);
                    
                    if (userPositionCount < maxNeeded / 2) {
}
                        adjustment.positionPriorityChanges[inefficiency.position] = 0.2;
                        adjustment.reasoningUpdates.push(`Join ${inefficiency.position} run to address need`);
                    } else {
}
                        adjustment.positionPriorityChanges[inefficiency.position] = -0.1;
                        adjustment.reasoningUpdates.push(`Fade ${inefficiency.position} run - position filled`);
                    }
                }
                break;

            default:
                return null;
        }

        return adjustment;
    }

    private applyAdjustments(adjustments: StrategyAdjustment[], context: DraftContext): Map<string, DraftStrategy> {
}
        const updatedStrategies = new Map<string, DraftStrategy>();

        this.activeStrategies.forEach((strategy, id) => {
}
            const updatedStrategy = { ...strategy };

            // Apply all adjustments to this strategy
            adjustments.forEach((adjustment: any) => {
}
                // Apply position priority changes
                Object.entries(adjustment.positionPriorityChanges).forEach(([position, change]) => {
}
                    updatedStrategy.positionPriorities[position] = Math.max(0, 
                        (updatedStrategy.positionPriorities[position] || 1) + change);
                });

                // Apply risk tolerance shift
                if (adjustment.riskToleranceShift !== 0) {
}
                    const currentRisk = updatedStrategy.riskTolerance === &apos;conservative&apos; ? 0.3 : 
                                      updatedStrategy.riskTolerance === &apos;moderate&apos; ? 0.6 : 0.9;
                    const newRisk = Math.max(0, Math.min(1, currentRisk + adjustment.riskToleranceShift));
                    
                    updatedStrategy.riskTolerance = newRisk < 0.4 ? &apos;conservative&apos; : 
                                                   newRisk < 0.7 ? &apos;moderate&apos; : &apos;aggressive&apos;;
                }

                // Update target and avoid players
                updatedStrategy.targetPlayers.push(...adjustment.targetPlayerUpdates.add);
                updatedStrategy.avoidPlayers.push(...adjustment.targetPlayerUpdates.remove);
            });

            updatedStrategies.set(id, updatedStrategy);
        });

        this.strategyHistory.push(...adjustments);
        return updatedStrategies;
    }

    private generateRecommendations(context: DraftContext, strategies: Map<string, DraftStrategy>): StrategyRecommendation[] {
}
        const recommendations: StrategyRecommendation[] = [];

        // Get the active strategy
        const activeStrategy = Array.from(strategies.values()).find((s: any) => s.active);
        if (!activeStrategy) return recommendations;

        // Position-based recommendations
        const positionRecommendations = this.generatePositionRecommendations(context, activeStrategy);
        recommendations.push(...positionRecommendations);

        // Value-based recommendations
        const valueRecommendations = this.generateValueRecommendations(context, activeStrategy);
        recommendations.push(...valueRecommendations);

        // Market timing recommendations
        const timingRecommendations = this.generateTimingRecommendations(context, activeStrategy);
        recommendations.push(...timingRecommendations);

        // Sort by urgency and confidence
        return recommendations.sort((a, b) => (b.urgency * b.confidence) - (a.urgency * a.confidence));
    }

    private generatePositionRecommendations(context: DraftContext, strategy: DraftStrategy): StrategyRecommendation[] {
}
        const recommendations: StrategyRecommendation[] = [];
        const userRoster = context.userTeam.roster || [];

        // Check for critical position needs
        Object.entries(strategy.positionPriorities).forEach(([position, priority]) => {
}
            const currentCount = userRoster.filter((p: any) => p.position === position).length;
            const maxNeeded = this.getPositionMax(position);
            const needLevel = Math.max(0, maxNeeded - currentCount) / maxNeeded;

            if (needLevel > 0.5 && priority > 1.0) {
}
                const availablePlayers = context.availablePlayers
                    .filter((p: any) => p.position === position)
                    .slice(0, 3);

                if (availablePlayers.length > 0) {
}
                    recommendations.push({
}
                        type: &apos;need_fill&apos;,
                        title: `Address ${position} Need`,
                        description: `Critical ${position} shortage - only ${currentCount}/${maxNeeded} rostered`,
                        confidence: Math.min(95, 60 + needLevel * 30),
                        urgency: Math.min(100, needLevel * 80 + priority * 10),
                        reasoning: [
                            `Current ${position} count: ${currentCount}/${maxNeeded}`,
                            `Position priority: ${(priority * 100).toFixed(0)}%`,
                            `${availablePlayers.length} quality options available`
                        ],
                        suggestedPlayers: availablePlayers,
                        riskLevel: strategy.riskTolerance === &apos;conservative&apos; ? 20 : 
                                  strategy.riskTolerance === &apos;moderate&apos; ? 40 : 60,
                        potentialImpact: needLevel * 25
                    });
                }
            }
        });

        return recommendations;
    }

    private generateValueRecommendations(context: DraftContext, strategy: DraftStrategy): StrategyRecommendation[] {
}
        const recommendations: StrategyRecommendation[] = [];

        // Find significant value opportunities
        const valueOpportunities = context.availablePlayers
            .filter((p: any) => (p.adp || 999) - context.currentPick > 10)
            .slice(0, 5);

        if (valueOpportunities.length > 0) {
}
            recommendations.push({
}
                type: &apos;value_hunt&apos;,
                title: &apos;Value Opportunities Available&apos;,
                description: `${valueOpportunities.length} players falling below ADP`,
                confidence: 80,
                urgency: 70,
                reasoning: [
                    &apos;Market creating value opportunities&apos;,
                    &apos;Players falling significantly below ADP&apos;,
                    &apos;Consider reaching for falling talent&apos;
                ],
                suggestedPlayers: valueOpportunities,
                riskLevel: 30,
                potentialImpact: 20
            });
        }

        return recommendations;
    }

    private generateTimingRecommendations(context: DraftContext, strategy: DraftStrategy): StrategyRecommendation[] {
}
        const recommendations: StrategyRecommendation[] = [];

        // Check for run opportunities
        const highRunPositions = Object.entries(context.draftFlow.positionRuns)
            .filter(([_, count]) => count >= 2)
            .map(([position]) => position);

        highRunPositions.forEach((position: any) => {
}
            const priority = strategy.positionPriorities[position] || 1;
            const availablePlayers = context.availablePlayers
                .filter((p: any) => p.position === position)
                .slice(0, 2);

            if (priority > 0.8 && availablePlayers.length > 0) {
}
                recommendations.push({
}
                    type: &apos;position_pivot&apos;,
                    title: `${position} Run Detected`,
                    description: `Consider joining ${position} run before value disappears`,
                    confidence: 75,
                    urgency: 85,
                    reasoning: [
                        `${context.draftFlow.positionRuns[position]} consecutive ${position} picks`,
                        &apos;Position scarcity increasing rapidly&apos;,
                        &apos;Jump on run before tier drop&apos;
                    ],
                    suggestedPlayers: availablePlayers,
                    riskLevel: 50,
                    potentialImpact: 18
                });
            }
        });

        return recommendations;
    }

    private getPositionMax(position: string): number {
}
        const limits: Record<string, number> = {
}
            &apos;QB&apos;: 2, &apos;RB&apos;: 4, &apos;WR&apos;: 5, &apos;TE&apos;: 2, &apos;K&apos;: 1, &apos;DST&apos;: 1
        };
        return limits[position] || 1;
    }

    public getActiveStrategy(): DraftStrategy | null {
}
        return Array.from(this.activeStrategies.values()).find((s: any) => s.active) || null;
    }

    public switchStrategy(strategyId: string): boolean {
}
        const strategy = this.activeStrategies.get(strategyId);
        if (!strategy) return false;

        // Deactivate all strategies
        this.activeStrategies.forEach((s: any) => s.active = false);
        
        // Activate selected strategy
        strategy.active = true;
        return true;
    }

    public getStrategyHistory(): StrategyAdjustment[] {
}
        return [...this.strategyHistory];
    }
}

export default RealTimeStrategyAdjustmentService;
