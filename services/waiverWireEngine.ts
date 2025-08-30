/**
 * Waiver Wire Intelligence Engine
 * Advanced waiver wire analysis with breakout detection and FAAB optimization
 */

import { Player, Team, League } from '../types';
import { playerPerformanceModel } from './advancedAnalyticsEngine';

/**
 * Waiver Wire Analysis Engine
 * Provides intelligent waiver wire recommendations
 */
export class WaiverWireEngine {
  private trendWindow = 3; // weeks to analyze for trends
  private breakoutThreshold = 1.5; // 50% increase for breakout
  private targetShareWeight = 0.3;
  private snapCountWeight = 0.25;
  private recentPerformanceWeight = 0.25;
  private opportunityWeight = 0.2;

  /**
   * Get top waiver wire recommendations
   */
  async getRecommendations(
    availablePlayers: Player[],
    userTeam: Team,
    league: League,
    faabBudget: number
  ): Promise<WaiverRecommendation[]> {
    const recommendations: WaiverRecommendation[] = [];

    for (const player of availablePlayers) {
      const score = await this.calculateWaiverScore(player);
      const type = this.categorizePickup(player);
      const faabRecommendation = this.calculateFAABRecommendation(
        player,
        score,
        faabBudget,
        type
      );
      const dropCandidate = this.findDropCandidate(userTeam, player);

      recommendations.push({
        player,
        score,
        type,
        faabRecommendation,
        dropCandidate,
        reasoning: this.generateReasoning(player, type, score),
        metrics: await this.getPlayerMetrics(player)
      });
    }

    // Sort by score
    recommendations.sort((a, b) => b.score - a.score);

    return recommendations.slice(0, 10); // Top 10 recommendations
  }

  /**
   * Detect breakout candidates
   */
  async detectBreakoutCandidates(
    players: Player[]
  ): Promise<BreakoutCandidate[]> {
    const candidates: BreakoutCandidate[] = [];

    for (const player of players) {
      const breakoutProbability = await this.calculateBreakoutProbability(player);
      
      if (breakoutProbability > 0.3) { // 30% threshold
        candidates.push({
          player,
          probability: breakoutProbability,
          factors: this.identifyBreakoutFactors(player),
          projectedImprovement: this.projectImprovement(player, breakoutProbability)
        });
      }
    }

    // Sort by probability
    candidates.sort((a, b) => b.probability - a.probability);

    return candidates.slice(0, 5); // Top 5 breakout candidates
  }

  /**
   * Optimize FAAB bidding strategy
   */
  optimizeFAABStrategy(
    targets: Player[],
    budget: number,
    leagueContext: LeagueContext
  ): FAABStrategy {
    const allocations: Map<string, number> = new Map();
    let remainingBudget = budget;

    // Sort targets by priority
    const prioritizedTargets = this.prioritizeTargets(targets, leagueContext);

    for (const target of prioritizedTargets) {
      const optimalBid = this.calculateOptimalBid(
        target,
        remainingBudget,
        leagueContext
      );

      if (optimalBid <= remainingBudget) {
        allocations.set(target.id, optimalBid);
        remainingBudget -= optimalBid;
      }
    }

    return {
      allocations,
      totalSpend: budget - remainingBudget,
      remainingBudget,
      confidence: this.calculateStrategyConfidence(allocations, targets)
    };
  }

  /**
   * Get injury replacement suggestions
   */
  async getInjuryReplacements(
    injuredPlayer: Player,
    availablePlayers: Player[]
  ): Promise<Player[]> {
    const replacements: Array<{ player: Player; similarity: number }> = [];

    for (const player of availablePlayers) {
      if (player.position !== injuredPlayer.position) continue;

      const similarity = this.calculatePlayerSimilarity(injuredPlayer, player);
      const projection = await playerPerformanceModel.generateProjection(
        player,
        'average',
        undefined,
        'Healthy'
      );

      if (projection.projectedPoints > injuredPlayer.projectedPoints * 0.7) {
        replacements.push({ player, similarity });
      }
    }

    // Sort by similarity and projected points
    replacements.sort((a, b) => {
      const scoreA = a.similarity * 0.4 + (a.player.projectedPoints / 20) * 0.6;
      const scoreB = b.similarity * 0.4 + (b.player.projectedPoints / 20) * 0.6;
      return scoreB - scoreA;
    });

    return replacements.slice(0, 3).map(r => r.player);
  }

  /**
   * Analyze waiver wire trends
   */
  analyzeWaiverTrends(
    transactions: WaiverTransaction[],
    timeWindow: number = 7 // days
  ): WaiverTrends {
    const now = Date.now();
    const windowStart = now - (timeWindow * 24 * 60 * 60 * 1000);
    
    const recentTransactions = transactions.filter(
      t => t.timestamp >= windowStart
    );

    // Calculate trending players
    const playerActivity = new Map<string, number>();
    recentTransactions.forEach(t => {
      const count = playerActivity.get(t.playerId) || 0;
      playerActivity.set(t.playerId, count + 1);
    });

    // Calculate position trends
    const positionActivity = new Map<string, number>();
    recentTransactions.forEach(t => {
      const count = positionActivity.get(t.position) || 0;
      positionActivity.set(t.position, count + 1);
    });

    // Find hot pickups
    const hotPickups = Array.from(playerActivity.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([playerId, count]) => ({ playerId, pickupCount: count }));

    return {
      hotPickups,
      positionTrends: Array.from(positionActivity.entries()).map(
        ([position, count]) => ({ position, activity: count })
      ),
      totalActivity: recentTransactions.length,
      averageFAAB: this.calculateAverageFAAB(recentTransactions)
    };
  }

  private async calculateWaiverScore(player: Player): Promise<number> {
    // Base score from recent performance
    const recentPerformance = this.getRecentPerformance(player);
    const performanceScore = recentPerformance * this.recentPerformanceWeight;

    // Target share and opportunity
    const targetShare = this.getTargetShare(player);
    const targetScore = targetShare * this.targetShareWeight;

    // Snap count trend
    const snapTrend = this.getSnapCountTrend(player);
    const snapScore = snapTrend * this.snapCountWeight;

    // Opportunity score
    const opportunity = this.getOpportunityScore(player);
    const oppScore = opportunity * this.opportunityWeight;

    return (performanceScore + targetScore + snapScore + oppScore) * 100;
  }

  private categorizePickup(player: Player): WaiverPickupType {
    const recentTrend = this.getRecentTrend(player);
    const snapCount = this.getLatestSnapCount(player);
    const targetShare = this.getTargetShare(player);

    if (recentTrend > this.breakoutThreshold) {
      return 'breakout';
    }
    if (this.isInjuryReplacement(player)) {
      return 'injury_replacement';
    }
    if (recentTrend > 1.2 && snapCount > 60) {
      return 'trending';
    }
    if (player.projectedPoints > 10 && (player.ownership || 100) < 30) {
      return 'buy_low';
    }
    return 'speculative';
  }

  private calculateFAABRecommendation(
    player: Player,
    score: number,
    budget: number,
    type: WaiverPickupType
  ): number {
    const basePercentage = score / 100 * 0.3; // Max 30% of budget
    
    // Adjust based on type
    const typeMultipliers: Record<WaiverPickupType, number> = {
      breakout: 1.5,
      injury_replacement: 1.3,
      trending: 1.1,
      buy_low: 0.9,
      speculative: 0.7
    };

    const multiplier = typeMultipliers[type] || 1.0;
    const recommendation = Math.floor(budget * basePercentage * multiplier);

    // Cap at 50% of remaining budget
    return Math.min(recommendation, Math.floor(budget * 0.5));
  }

  private findDropCandidate(team: Team, addPlayer: Player): DropCandidate | null {
    // Find worst performer at same position
    const samePositionPlayers = team.players.filter(
      p => p.position === addPlayer.position
    );

    if (samePositionPlayers.length === 0) return null;

    // Sort by projected points
    samePositionPlayers.sort((a, b) => 
      (a.projectedPoints || 0) - (b.projectedPoints || 0)
    );

    const worstPlayer = samePositionPlayers[0];
    
    if ((worstPlayer.projectedPoints || 0) < (addPlayer.projectedPoints || 0)) {
      return {
        player: worstPlayer,
        confidence: Math.min(
          0.95,
          (addPlayer.projectedPoints || 0) / (worstPlayer.projectedPoints || 1) - 1
        )
      };
    }

    return null;
  }

  private async calculateBreakoutProbability(player: Player): Promise<number> {
    const factors: number[] = [];

    // Age factor (younger players more likely to breakout)
    if (player.age && player.age <= 25) {
      factors.push(0.2);
    }

    // Opportunity increase
    const snapTrend = this.getSnapCountTrend(player);
    if (snapTrend > 1.2) {
      factors.push(0.25);
    }

    // Target share increase
    const targetTrend = this.getTargetShareTrend(player);
    if (targetTrend > 1.3) {
      factors.push(0.3);
    }

    // Recent performance spike
    const recentSpike = this.detectPerformanceSpike(player);
    if (recentSpike) {
      factors.push(0.25);
    }

    return Math.min(0.95, factors.reduce((sum, f) => sum + f, 0));
  }

  private identifyBreakoutFactors(player: Player): string[] {
    const factors: string[] = [];

    if (this.getSnapCountTrend(player) > 1.2) {
      factors.push('Increasing snap count');
    }
    if (this.getTargetShareTrend(player) > 1.3) {
      factors.push('Rising target share');
    }
    if (this.detectPerformanceSpike(player)) {
      factors.push('Recent performance spike');
    }
    if (player.age && player.age <= 25) {
      factors.push('Young player with upside');
    }
    if (this.hasWeakCompetition(player)) {
      factors.push('Weak position competition');
    }

    return factors;
  }

  private calculateOptimalBid(
    player: Player,
    budget: number,
    context: LeagueContext
  ): number {
    const baseValue = player.projectedPoints || 10;
    const scarcityMultiplier = this.getPositionScarcity(player.position, context);
    const competitionMultiplier = this.estimateCompetition(player, context);
    
    const optimalBid = baseValue * scarcityMultiplier * competitionMultiplier;
    
    // Cap at reasonable percentage of budget
    return Math.min(Math.floor(optimalBid), Math.floor(budget * 0.4));
  }

  // Mock helper methods
  private getRecentPerformance(player: Player): number {
    return Math.random() * 0.8 + 0.2;
  }

  private getTargetShare(player: Player): number {
    return Math.random() * 0.3 + 0.1;
  }

  private getSnapCountTrend(player: Player): number {
    return Math.random() * 0.5 + 0.8;
  }

  private getOpportunityScore(player: Player): number {
    return Math.random() * 0.7 + 0.3;
  }

  private getRecentTrend(player: Player): number {
    return Math.random() * 0.8 + 0.8;
  }

  private getLatestSnapCount(player: Player): number {
    return Math.random() * 40 + 40;
  }

  private isInjuryReplacement(player: Player): boolean {
    return Math.random() > 0.8;
  }

  private getTargetShareTrend(player: Player): number {
    return Math.random() * 0.6 + 0.9;
  }

  private detectPerformanceSpike(player: Player): boolean {
    return Math.random() > 0.7;
  }

  private hasWeakCompetition(player: Player): boolean {
    return Math.random() > 0.6;
  }

  private projectImprovement(player: Player, probability: number): number {
    return (player.projectedPoints || 10) * (1 + probability * 0.5);
  }

  private calculatePlayerSimilarity(playerA: Player, playerB: Player): number {
    // Simplified similarity calculation
    return Math.random() * 0.5 + 0.5;
  }

  private prioritizeTargets(targets: Player[], context: LeagueContext): Player[] {
    // Sort by projected points and position need
    return [...targets].sort((a, b) => 
      (b.projectedPoints || 0) - (a.projectedPoints || 0)
    );
  }

  private calculateStrategyConfidence(
    allocations: Map<string, number>,
    targets: Player[]
  ): number {
    return Math.min(0.95, 0.7 + (allocations.size / targets.length) * 0.3);
  }

  private getPositionScarcity(position: string, context: LeagueContext): number {
    const scarcityMap: Record<string, number> = {
      RB: 1.3,
      WR: 1.1,
      TE: 1.2,
      QB: 0.9,
      K: 0.7,
      DEF: 0.8
    };
    return scarcityMap[position] || 1.0;
  }

  private estimateCompetition(player: Player, context: LeagueContext): number {
    // Estimate based on ownership and recent trends
    const ownership = player.ownership || 50;
    return 1 + (ownership / 100) * 0.5;
  }

  private calculateAverageFAAB(transactions: WaiverTransaction[]): number {
    if (transactions.length === 0) return 0;
    const total = transactions.reduce((sum, t) => sum + (t.faabAmount || 0), 0);
    return total / transactions.length;
  }

  private async getPlayerMetrics(player: Player): Promise<PlayerMetrics> {
    return {
      targetShare: this.getTargetShare(player),
      snapCount: this.getLatestSnapCount(player),
      redZoneTargets: Math.floor(Math.random() * 5),
      trend: Math.random() > 0.6 ? 'rising' : Math.random() > 0.3 ? 'stable' : 'falling'
    };
  }

  private generateReasoning(
    player: Player,
    type: WaiverPickupType,
    score: number
  ): string {
    const reasonTemplates: Record<WaiverPickupType, string[]> = {
      breakout: [
        'Breakout candidate with increasing opportunity',
        'Usage trending up significantly over last 3 weeks',
        'Perfect storm of opportunity and talent'
      ],
      injury_replacement: [
        'Direct replacement for injured starter',
        'Expected to see significant volume increase',
        'Clear path to starting role'
      ],
      trending: [
        'Consistent target share increase',
        'Snap count trending upward',
        'Emerging as reliable option'
      ],
      buy_low: [
        'Undervalued based on recent performance',
        'Schedule improves significantly',
        'Buy-low opportunity before breakout'
      ],
      speculative: [
        'High-upside stash candidate',
        'Worth a speculative add',
        'Lottery ticket with potential'
      ]
    };

    const templates = reasonTemplates[type] || ['Solid waiver wire addition'];
    return templates[Math.floor(Math.random() * templates.length)];
  }
}

// Type definitions
interface WaiverRecommendation {
  player: Player;
  score: number;
  type: WaiverPickupType;
  faabRecommendation: number;
  dropCandidate: DropCandidate | null;
  reasoning: string;
  metrics: PlayerMetrics;
}

interface BreakoutCandidate {
  player: Player;
  probability: number;
  factors: string[];
  projectedImprovement: number;
}

interface FAABStrategy {
  allocations: Map<string, number>;
  totalSpend: number;
  remainingBudget: number;
  confidence: number;
}

interface WaiverTrends {
  hotPickups: Array<{ playerId: string; pickupCount: number }>;
  positionTrends: Array<{ position: string; activity: number }>;
  totalActivity: number;
  averageFAAB: number;
}

interface WaiverTransaction {
  playerId: string;
  position: string;
  timestamp: number;
  faabAmount?: number;
  teamId: string;
}

interface LeagueContext {
  teamCount: number;
  rosterSize: number;
  positionRequirements: Map<string, number>;
  averageFAABRemaining: number;
}

interface DropCandidate {
  player: Player;
  confidence: number;
}

interface PlayerMetrics {
  targetShare: number;
  snapCount: number;
  redZoneTargets: number;
  trend: 'rising' | 'falling' | 'stable';
}

type WaiverPickupType = 'breakout' | 'injury_replacement' | 'trending' | 'buy_low' | 'speculative';

// Export singleton instance
export const waiverWireEngine = new WaiverWireEngine();

export default waiverWireEngine;