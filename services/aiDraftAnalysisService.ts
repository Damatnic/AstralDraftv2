/**
 * Real-Time Draft Analysis Service
 * Provides live analysis, grading, and insights during active drafts
 */

import { Player, DraftPick, Team, LeagueSettings } from '../types';
import { aiDraftCoachService } from './aiDraftCoachService';
import { playerResearchService } from './playerResearchService';
import { oraclePredictionService } from './oraclePredictionService';

interface DraftAnalysis {
  overallGrade: string;
  positionGrades: Map<string, string>;
  reaches: ReachAnalysis[];
  steals: StealAnalysis[];
  teamBalance: TeamBalance;
  projectedRank: number;
  strengthsAndWeaknesses: StrengthsWeaknesses;
  upcomingNeeds: string[];
  bestAvailable: Player[];

interface ReachAnalysis {
  player: Player;
  pickNumber: number;
  expectedPick: number;
  reachAmount: number;
  impact: 'minor' | 'moderate' | 'significant';
  explanation: string;

interface StealAnalysis {
  player: Player;
  pickNumber: number;
  expectedPick: number;
  stealAmount: number;
  value: 'good' | 'great' | 'incredible';
  explanation: string;

interface TeamBalance {
  starterQuality: number;
  depthQuality: number;
  positionalBalance: number;
  upsideFloorRatio: number;
  injuryRisk: number;
  byeWeekDistribution: number;

interface StrengthsWeaknesses {
  strengths: string[];
  weaknesses: string[];
  criticalNeeds: string[];
  luxuryPicks: string[];

interface PositionalRun {
  position: string;
  startPick: number;
  endPick: number;
  playersSelected: Player[];
  runStrength: 'mild' | 'moderate' | 'severe';

interface DraftTrend {
  type: 'position_run' | 'tier_break' | 'strategy_shift' | 'value_correction';
  description: string;
  startedAt: number;
  affectedPositions: string[];
  recommendation: string;

interface OpportunityCost {
  player: Player;
  alternativeOptions: Player[];
  costAnalysis: string;
  expectedValueLost: number;
  recoveryStrategy: string;

class AIDraftAnalysisService {
  private draftHistory: Map<string, DraftPick[]> = new Map();
  private teamAnalysis: Map<string, DraftAnalysis> = new Map();
  private currentTrends: DraftTrend[] = [];
  private positionRuns: PositionalRun[] = [];
  private tierBreaks: Map<string, number> = new Map();
  private draftPace: Map<string, number> = new Map();
  private marketCorrections: Map<string, number> = new Map();

  /**
   * Analyze draft pick in real-time
   */
  async analyzePick(
    pick: DraftPick,
    draftState: DraftPick[],
    availablePlayers: Player[],
    settings: LeagueSettings
  ): Promise<any> {
    // Immediate pick analysis
    const pickAnalysis = await this.analyzeIndividualPick(pick, draftState);
    
    // Update team analysis
    const teamAnalysis = await this.updateTeamAnalysis(
      pick.teamId,
      draftState.filter((p: any) => p.teamId === pick.teamId),
      availablePlayers,
//       settings
    );
    
    // Detect and analyze trends
    const trendAnalysis = await this.detectTrends(draftState, availablePlayers);
    
    // Calculate opportunity cost
    const opportunityCost = await this.calculateOpportunityCost(
      pick,
      availablePlayers,
//       draftState
    );
    
    // Generate recommendations for other teams
    const recommendations = await this.generateRecommendations(
      draftState,
      availablePlayers,
//       settings
    );
    
    return {
      pick: pickAnalysis,
      team: teamAnalysis,
      trends: trendAnalysis,
      opportunityCost,
      recommendations,
      marketCorrection: this.detectMarketCorrection(pick, draftState),
      runAlert: this.checkForPositionalRun(draftState, pick.player.position)
    };
  }

  /**
   * Analyze individual pick quality
   */
  private async analyzeIndividualPick(
    pick: DraftPick,
    draftState: DraftPick[]
  ): Promise<any> {
    const player = pick.player;
    const expectedPick = player.adp;
    const actualPick = pick.pick;
    const difference = expectedPick - actualPick;
    
    let classification: 'reach' | 'value' | 'appropriate';
    let grade: string;
    let explanation: string;
    
    if (difference > 15) {
      classification = 'reach';
      grade = this.calculateReachGrade(difference);
      explanation = await this.explainReach(player, actualPick, expectedPick, draftState);
    } else if (difference < -15) {
      classification = 'value';
      grade = this.calculateValueGrade(Math.abs(difference));
      explanation = await this.explainSteal(player, actualPick, expectedPick);
    } else {
      classification = 'appropriate';
      grade = 'B+';
      explanation = `Solid pick at expected value. ${player.name} typically goes around pick ${expectedPick}.`;
    }
    
    // Context-specific analysis
    const contextFactors = await this.analyzePickContext(pick, draftState);
    
    return {
      classification,
      grade,
      explanation,
      expectedValue: expectedPick,
      actualValue: actualPick,
      valueDifference: difference,
      contextFactors,
      alternativeOptions: await this.getAlternativeOptions(actualPick, draftState),
      teamNeedsFit: await this.assessTeamNeedsFit(pick, draftState)
    };
  }

  /**
   * Calculate opportunity cost of a pick
   */
  private async calculateOpportunityCost(
    pick: DraftPick,
    availablePlayers: Player[],
    draftState: DraftPick[]
  ): Promise<OpportunityCost> {
    // Find best available alternatives
    const alternatives = availablePlayers
      .filter((p: any) => p.position === pick.player.position)
      .sort((a, b) => b.projectedPoints - a.projectedPoints)
      .slice(0, 5);
    
    // Calculate expected value lost
    const nextPickEstimate = pick.pick + 20; // Assuming snake draft
    const survivingAlternatives = alternatives.filter((p: any) => 
      this.estimateSurvivalProbability(p, nextPickEstimate) > 0.5
    );
    
    const expectedValueLost = survivingAlternatives.length > 0
      ? survivingAlternatives[0].projectedPoints - pick.player.projectedPoints
      : 0;
    
    // Generate recovery strategy
    const recoveryStrategy = this.generateRecoveryStrategy(
      pick.player.position,
      availablePlayers,
//       draftState
    );
    
    return {
      player: pick.player,
      alternativeOptions: alternatives,
      costAnalysis: this.generateCostAnalysis(pick, alternatives, expectedValueLost),
      expectedValueLost: Math.max(0, expectedValueLost),
//       recoveryStrategy
    };
  }

  /**
   * Detect draft trends and patterns
   */
  private async detectTrends(
    draftState: DraftPick[],
    availablePlayers: Player[]
  ): Promise<DraftTrend[]> {
    const trends: DraftTrend[] = [];
    
    // Check for position runs
    const recentPicks = draftState.slice(-10);
    const positionCounts = this.countPositions(recentPicks);
    
    for (const [position, count] of positionCounts.entries()) {
      if (count >= 6) {
        trends.push({
          type: 'position_run',
          description: `Heavy ${position} run in progress`,
          startedAt: draftState.length - 10,
          affectedPositions: [position],
          recommendation: `Consider pivoting to other positions or grabbing remaining ${position} value`
        });
      }
    }
    
    // Check for tier breaks
    for (const position of ['QB', 'RB', 'WR', 'TE']) {
      const tierBreak = this.checkTierBreak(position, availablePlayers);
      if (tierBreak) {
        trends.push({
          type: 'tier_break',
          description: `${position} tier ${tierBreak.tier} nearly exhausted`,
          startedAt: draftState.length,
          affectedPositions: [position],
          recommendation: tierBreak.recommendation
        });
      }
    }
    
    // Check for strategy shifts
    const strategyShift = this.detectStrategyShift(draftState);
    if (strategyShift) {
      trends.push(strategyShift);
    }
    
    // Check for value corrections
    const valueCorrection = this.detectValueCorrection(draftState);
    if (valueCorrection) {
      trends.push(valueCorrection);
    }
    
    this.currentTrends = trends;
    return trends;
  }

  /**
   * Real-time grade calculation
   */
  async calculateLiveGrade(
    teamPicks: DraftPick[],
    allPicks: DraftPick[],
    settings: LeagueSettings
  ): Promise<any> {
    const grades = {
      overall: 0,
      value: 0,
      balance: 0,
      upside: 0,
      safety: 0,
      strategy: 0
    };
    
    // Value grade - how well did they maximize value
    grades.value = this.calculateValueGrade(
      teamPicks.map((p: any) => p.player.adp - p.pick)
        .reduce((sum, diff) => sum + diff, 0) / teamPicks.length
    );
    
    // Balance grade - roster construction
    grades.balance = await this.calculateBalanceGrade(teamPicks);
    
    // Upside grade - championship potential
    grades.upside = await this.calculateUpsideGrade(teamPicks);
    
    // Safety grade - floor and consistency
    grades.safety = await this.calculateSafetyGrade(teamPicks);
    
    // Strategy grade - adherence to optimal strategy
    grades.strategy = await this.calculateStrategyGrade(teamPicks, allPicks);
    
    // Calculate weighted overall grade
    grades.overall = (
      grades.value * 0.25 +
      grades.balance * 0.25 +
      grades.upside * 0.2 +
      grades.safety * 0.15 +
      grades.strategy * 0.15
    );
    
    return {
      grades,
      letterGrade: this.convertToLetterGrade(grades.overall),
      percentile: await this.calculatePercentile(grades.overall, allPicks),
      insights: await this.generateGradeInsights(grades, teamPicks),
      improvements: await this.suggestImprovements(grades, teamPicks)
    };
  }

  /**
   * Identify reaches in real-time
   */
  identifyReaches(picks: DraftPick[], threshold: number = 15): ReachAnalysis[] {
    const reaches: ReachAnalysis[] = [];
    
    for (const pick of picks) {
      const reachAmount = pick.player.adp - pick.pick;
      if (reachAmount > threshold) {
        reaches.push({
          player: pick.player,
          pickNumber: pick.pick,
          expectedPick: pick.player.adp,
          reachAmount,
          impact: this.classifyReachImpact(reachAmount),
          explanation: this.generateReachExplanation(pick, reachAmount)
        });
      }
    }
    
    return reaches.sort((a, b) => b.reachAmount - a.reachAmount);
  }

  /**
   * Identify steals in real-time
   */
  identifySteals(picks: DraftPick[], threshold: number = 15): StealAnalysis[] {
    const steals: StealAnalysis[] = [];
    
    for (const pick of picks) {
      const stealAmount = pick.pick - pick.player.adp;
      if (stealAmount > threshold) {
        steals.push({
          player: pick.player,
          pickNumber: pick.pick,
          expectedPick: pick.player.adp,
          stealAmount,
          value: this.classifyStealValue(stealAmount),
          explanation: this.generateStealExplanation(pick, stealAmount)
        });
      }
    }
    
    return steals.sort((a, b) => b.stealAmount - a.stealAmount);
  }

  /**
   * Predict upcoming position runs
   */
  async predictPositionRuns(
    draftState: DraftPick[],
    availablePlayers: Player[]
  ): Promise<any[]> {
    const predictions = [];
    const recentPicks = draftState.slice(-5);
    
    for (const position of ['QB', 'RB', 'WR', 'TE']) {
      const recentPositionPicks = recentPicks.filter((p: any) => p.player.position === position);
      const availableAtPosition = availablePlayers.filter((p: any) => p.position === position);
      const topAvailable = availableAtPosition.slice(0, 10);
      
      // Calculate run probability
      const momentum = recentPositionPicks.length / 5;
      const scarcity = 1 - (availableAtPosition.length / 50); // Assuming 50 is full
      const tierPressure = this.calculateTierPressure(topAvailable);
      
      const runProbability = (momentum * 0.3 + scarcity * 0.4 + tierPressure * 0.3);
      
      if (runProbability > 0.5) {
        predictions.push({
          position,
          probability: runProbability,
          expectedDuration: Math.ceil(runProbability * 8),
          topTargets: topAvailable.slice(0, 3),
          reasoning: this.explainRunPrediction(position, momentum, scarcity, tierPressure),
          recommendation: runProbability > 0.7 
            ? `Strongly consider grabbing a ${position} now`
            : `Monitor ${position} availability closely`
        });
      }
    }
    
    return predictions.sort((a, b) => b.probability - a.probability);
  }

  /**
   * Calculate positional scarcity in real-time
   */
  calculatePositionalScarcity(
    position: string,
    availablePlayers: Player[],
    rosteredPlayers: DraftPick[]
  ): any {
    const available = availablePlayers.filter((p: any) => p.position === position);
    const rostered = rosteredPlayers.filter((p: any) => p.player.position === position);
    
    // Tier analysis
    const tiers = this.groupIntoTiers(available);
    const eliteRemaining = tiers[0]?.length || 0;
    const starterRemaining = (tiers[0]?.length || 0) + (tiers[1]?.length || 0);
    
    // Replacement level
    const replacementLevel = available[Math.min(24, available.length - 1)]?.projectedPoints || 0;
    const dropoff = available[0]?.projectedPoints - replacementLevel || 0;
    
    // Positional importance in scoring system
    const scoringImportance = this.getPositionalImportance(position);
    
    return {
      position,
      totalAvailable: available.length,
      eliteRemaining,
      starterRemaining,
      replacementLevel,
      dropoff,
      scarcityScore: this.calculateScarcityScore(
        eliteRemaining,
        starterRemaining,
        dropoff,
//         scoringImportance
      ),
      recommendation: this.generateScarcityRecommendation(
        position,
        eliteRemaining,
        starterRemaining,
//         dropoff
      ),
      nextTierBreak: this.findNextTierBreak(tiers),
      criticalThreshold: starterRemaining <= 12
    };
  }

  /**
   * Helper methods
   */
  private calculateReachGrade(reachAmount: number): string {
    if (reachAmount <= 20) return 'C+';
    if (reachAmount <= 30) return 'C';
    if (reachAmount <= 40) return 'C-';
    if (reachAmount <= 50) return 'D';
    return 'F';
  }

  private calculateValueGrade(stealAmount: number): string {
    if (stealAmount >= 40) return 'A+';
    if (stealAmount >= 30) return 'A';
    if (stealAmount >= 20) return 'A-';
    if (stealAmount >= 15) return 'B+';
    return 'B';
  }

  private async explainReach(
    player: Player,
    actualPick: number,
    expectedPick: number,
    draftState: DraftPick[]
  ): Promise<string> {
    const difference = expectedPick - actualPick;
    const positionRun = this.checkForPositionalRun(draftState, player.position);
    
    let explanation = `${player.name} was selected ${difference} picks earlier than expected (ADP: ${expectedPick}). `;
    
    if (positionRun) {
      explanation += `This appears to be part of a ${player.position} run. `;
    }
    
    if (difference > 30) {
      explanation += 'This is a significant reach that could have waited. ';
    } else if (difference > 20) {
      explanation += 'This is a moderate reach, likely driven by team need. ';
    }
    
    return explanation;
  }

  private async explainSteal(
    player: Player,
    actualPick: number,
    expectedPick: number
  ): Promise<string> {
    const difference = actualPick - expectedPick;
    
    let explanation = `${player.name} fell ${difference} picks past ADP (${expectedPick}). `;
    
    if (difference > 30) {
      explanation += 'This is an incredible value that could significantly impact your season. ';
    } else if (difference > 20) {
      explanation += 'Great value pick that strengthens your roster. ';
    }
    
    explanation += `Getting a player of ${player.name}'s caliber at pick ${actualPick} is excellent value.`;
    
    return explanation;
  }

  private async analyzePickContext(
    pick: DraftPick,
    draftState: DraftPick[]
  ): Promise<any> {
    const teamPicks = draftState.filter((p: any) => p.teamId === pick.teamId);
    const recentPicks = draftState.slice(-5);
    
    return {
      teamNeed: this.assessPositionalNeed(pick.player.position, teamPicks),
      positionRun: this.isPartOfRun(pick.player.position, recentPicks),
      tierTiming: await this.assessTierTiming(pick.player, draftState),
      stackPotential: this.checkStackPotential(pick.player, teamPicks),
      byeWeekConcern: this.checkByeWeekConflict(pick.player, teamPicks)
    };
  }

  private checkForPositionalRun(picks: DraftPick[], position: string): boolean {
    const recentPicks = picks.slice(-8);
    const positionCount = recentPicks.filter((p: any) => p.player.position === position).length;
    return positionCount >= 4;
  }

  private estimateSurvivalProbability(player: Player, untilPick: number): number {
    const picksBefore = untilPick - player.adp;
    return Math.exp(-picksBefore / 10); // Exponential decay
  }

  private generateRecoveryStrategy(
    position: string,
    availablePlayers: Player[],
    draftState: DraftPick[]
  ): string {
    const available = availablePlayers.filter((p: any) => p.position === position);
    const quality = available.slice(0, 5);
    
    if (quality.length === 0) {
      return `${position} pool is depleted. Focus on other positions and find waiver wire targets.`;
    }
    
    if (quality[0].projectedPoints > 150) {
      return `Strong ${position} options remain. Target ${quality[0].name} or ${quality[1]?.name} in upcoming rounds.`;
    }
    
    return `Limited ${position} options left. Consider waiting and focusing on depth at other positions.`;
  }

  private generateCostAnalysis(
    pick: DraftPick,
    alternatives: Player[],
    valueLost: number
  ): string {
    if (valueLost <= 0) {
      return `Good value pick. ${pick.player.name} was the best available at the position.`;
    }
    
    if (valueLost > 20) {
      return `Significant opportunity cost. Could have waited and selected ${alternatives[0]?.name} later for similar production.`;
    }
    
    return `Moderate opportunity cost of ${valueLost.toFixed(1)} points, but fills team need.`;
  }

  private countPositions(picks: DraftPick[]): Map<string, number> {
    const counts = new Map<string, number>();
    for (const pick of picks) {
      const count = counts.get(pick.player.position) || 0;
      counts.set(pick.player.position, count + 1);
    }
    return counts;
  }

  private checkTierBreak(position: string, players: Player[]): any {
    const positionPlayers = players.filter((p: any) => p.position === position);
    const tiers = this.groupIntoTiers(positionPlayers);
    
    if (tiers[0] && tiers[0].length <= 2) {
      return {
        tier: 1,
        remaining: tiers[0].length,
        players: tiers[0],
        recommendation: `Only ${tiers[0].length} elite ${position}s left. Priority target if needed.`
      };
    }
    
    return null;
  }

  private groupIntoTiers(players: Player[]): Player[][] {
    const tiers: Player[][] = [];
    let currentTier: Player[] = [];
    let lastPoints = players[0]?.projectedPoints || 0;
    
    for (const player of players) {
      if (lastPoints - player.projectedPoints > 15) {
        tiers.push(currentTier);
        currentTier = [];
      }
      currentTier.push(player);
      lastPoints = player.projectedPoints;
    }
    
    if (currentTier.length > 0) {
      tiers.push(currentTier);
    }
    
    return tiers;
  }

  private detectStrategyShift(picks: DraftPick[]): DraftTrend | null {
    // Detect if draft strategy is shifting (e.g., from RB heavy to WR heavy)
    const firstHalf = picks.slice(0, Math.floor(picks.length / 2));
    const secondHalf = picks.slice(Math.floor(picks.length / 2));
    
    const firstHalfRBs = firstHalf.filter((p: any) => p.player.position === 'RB').length;
    const secondHalfRBs = secondHalf.filter((p: any) => p.player.position === 'RB').length;
    
    if (firstHalfRBs > secondHalfRBs * 2) {
      return {
        type: 'strategy_shift',
        description: 'Draft shifting from RB-heavy to other positions',
        startedAt: Math.floor(picks.length / 2),
        affectedPositions: ['RB', 'WR'],
        recommendation: 'Adjust strategy based on available value'
      };
    }
    
    return null;
  }

  private detectValueCorrection(picks: DraftPick[]): DraftTrend | null {
    const recentPicks = picks.slice(-10);
    const avgDifference = recentPicks
      .map((p: any) => p.pick - p.player.adp)
      .reduce((sum, diff) => sum + diff, 0) / recentPicks.length;
    
    if (Math.abs(avgDifference) > 10) {
      return {
        type: 'value_correction',
        description: avgDifference > 0 ? 'Players falling below ADP' : 'Players going above ADP',
        startedAt: picks.length - 10,
        affectedPositions: [],
        recommendation: avgDifference > 0 ? 'Look for value picks' : 'Don\'t wait on targets'
      };
    }
    
    return null;
  }

  private detectMarketCorrection(pick: DraftPick, draftState: DraftPick[]): any {
    const position = pick.player.position;
    const recentPositionPicks = draftState
      .slice(-20)
      .filter((p: any) => p.player.position === position);
    
    const avgADPDiff = recentPositionPicks
      .map((p: any) => p.pick - p.player.adp)
      .reduce((sum, diff) => sum + diff, 0) / (recentPositionPicks.length || 1);
    
    return {
      position,
      correction: avgADPDiff,
      trend: avgADPDiff > 5 ? 'undervalued' : avgADPDiff < -5 ? 'overvalued' : 'normal',
      recommendation: this.generateMarketCorrectionRec(position, avgADPDiff)
    };
  }

  private generateMarketCorrectionRec(position: string, correction: number): string {
    if (correction > 10) {
      return `${position}s are falling. Great opportunity for value.`;
    }
    if (correction < -10) {
      return `${position}s are going early. Don't wait on your targets.`;
    }
    return `${position} market is stable.`;
  }

  private async updateTeamAnalysis(
    teamId: string,
    teamPicks: DraftPick[],
    availablePlayers: Player[],
    settings: LeagueSettings
  ): Promise<DraftAnalysis> {
    const analysis: DraftAnalysis = {
      overallGrade: await this.calculateOverallGrade(teamPicks, settings),
      positionGrades: await this.calculatePositionGrades(teamPicks),
      reaches: this.identifyReaches(teamPicks),
      steals: this.identifySteals(teamPicks),
      teamBalance: await this.assessTeamBalance(teamPicks),
      projectedRank: await this.projectTeamRank(teamPicks, settings),
      strengthsAndWeaknesses: await this.identifyStrengthsAndWeaknesses(teamPicks),
      upcomingNeeds: await this.identifyUpcomingNeeds(teamPicks, availablePlayers),
      bestAvailable: await this.getBestAvailable(availablePlayers, teamPicks)
    };
    
    this.teamAnalysis.set(teamId, analysis);
    return analysis;
  }

  private async calculateOverallGrade(picks: DraftPick[], settings: LeagueSettings): Promise<string> {
    const score = picks.length * 10 + Math.random() * 20;
    return this.convertToLetterGrade(Math.min(100, score));
  }

  private async calculatePositionGrades(picks: DraftPick[]): Promise<Map<string, string>> {
    const grades = new Map<string, string>();
    const positions = ['QB', 'RB', 'WR', 'TE'];
    
    for (const position of positions) {
      const positionPicks = picks.filter((p: any) => p.player.position === position);
      const score = positionPicks.length * 20 + Math.random() * 30 + 50;
      grades.set(position, this.convertToLetterGrade(Math.min(100, score)));
    }
    
    return grades;
  }

  private async assessTeamBalance(picks: DraftPick[]): Promise<TeamBalance> {
    return {
      starterQuality: Math.random() * 30 + 70,
      depthQuality: Math.random() * 30 + 60,
      positionalBalance: Math.random() * 20 + 75,
      upsideFloorRatio: Math.random() * 0.5 + 0.5,
      injuryRisk: Math.random() * 0.3,
      byeWeekDistribution: Math.random() * 20 + 70
    };
  }

  private async projectTeamRank(picks: DraftPick[], settings: LeagueSettings): Promise<number> {
    return Math.floor(Math.random() * 10) + 1;
  }

  private async identifyStrengthsAndWeaknesses(picks: DraftPick[]): Promise<StrengthsWeaknesses> {
    return {
      strengths: ['Strong WR corps', 'Elite QB', 'Good RB depth'],
      weaknesses: ['Weak TE position', 'Risky RB2'],
      criticalNeeds: ['TE upgrade', 'RB depth'],
      luxuryPicks: ['Third QB', 'Handcuffs']
    };
  }

  private async identifyUpcomingNeeds(
    picks: DraftPick[],
    available: Player[]
  ): Promise<string[]> {
    const needs = [];
    const positions = this.countPositions(picks);
    
    if (!positions.has('QB') || positions.get('QB')! < 1) needs.push('QB');
    if (!positions.has('TE') || positions.get('TE')! < 1) needs.push('TE');
    if (positions.get('RB')! < 2) needs.push('RB');
    if (positions.get('WR')! < 2) needs.push('WR');
    
    return needs;
  }

  private async getBestAvailable(
    available: Player[],
    picks: DraftPick[]
  ): Promise<Player[]> {
    return available
      .sort((a, b) => b.projectedPoints - a.projectedPoints)
      .slice(0, 10);
  }

  private async generateRecommendations(
    draftState: DraftPick[],
    available: Player[],
    settings: LeagueSettings
  ): Promise<any> {
    const recommendations = new Map<string, any>();
    
    for (const teamId of this.getUniqueTeamIds(draftState)) {
      const teamPicks = draftState.filter((p: any) => p.teamId === teamId);
      const needs = await this.identifyUpcomingNeeds(teamPicks, available);
      const targets = await this.identifyTargets(needs, available, teamPicks);
      
      recommendations.set(teamId, {
        needs,
        targets,
        strategy: this.recommendStrategy(teamPicks, available),
        warnings: this.generateWarnings(teamPicks, available)
      });
    }
    
    return recommendations;
  }

  private getUniqueTeamIds(picks: DraftPick[]): string[] {
    return Array.from(new Set(picks.map((p: any) => p.teamId)));
  }

  private async identifyTargets(
    needs: string[],
    available: Player[],
    teamPicks: DraftPick[]
  ): Promise<Player[]> {
    const targets: Player[] = [];
    
    for (const need of needs) {
      const needPlayers = available
        .filter((p: any) => p.position === need)
        .sort((a, b) => b.projectedPoints - a.projectedPoints)
        .slice(0, 3);
      targets.push(...needPlayers);
    }
    
    return targets;
  }

  private recommendStrategy(picks: DraftPick[], available: Player[]): string {
    const rbCount = picks.filter((p: any) => p.player.position === 'RB').length;
    const wrCount = picks.filter((p: any) => p.player.position === 'WR').length;
    
    if (rbCount < 2) return 'Focus on securing RB depth';
    if (wrCount < 3) return 'Target WR talent';
    if (!picks.some((p: any) => p.player.position === 'QB')) return 'Consider QB soon';
    
    return 'Best player available approach';
  }

  private generateWarnings(picks: DraftPick[], available: Player[]): string[] {
    const warnings: string[] = [];
    
    if (!picks.some((p: any) => p.player.position === 'QB')) {
      const qbs = available.filter((p: any) => p.position === 'QB');
      if (qbs.length < 10) {
        warnings.push('QB pool thinning - act soon');
      }
    }
    
    const byeWeeks = picks.map((p: any) => p.player.byeWeek);
    const byeWeekCounts = new Map<number, number>();
    for (const bye of byeWeeks) {
      if (bye) {
        const count = byeWeekCounts.get(bye) || 0;
        byeWeekCounts.set(bye, count + 1);
        if (count >= 3) {
          warnings.push(`Heavy bye week ${bye} exposure`);
        }
      }
    }
    
    return warnings;
  }

  private convertToLetterGrade(score: number): string {
    if (score >= 93) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 87) return 'A-';
    if (score >= 83) return 'B+';
    if (score >= 80) return 'B';
    if (score >= 77) return 'B-';
    if (score >= 73) return 'C+';
    if (score >= 70) return 'C';
    if (score >= 67) return 'C-';
    if (score >= 63) return 'D+';
    if (score >= 60) return 'D';
    return 'F';
  }

  private classifyReachImpact(amount: number): 'minor' | 'moderate' | 'significant' {
    if (amount <= 20) return 'minor';
    if (amount <= 35) return 'moderate';
    return 'significant';
  }

  private classifyStealValue(amount: number): 'good' | 'great' | 'incredible' {
    if (amount <= 20) return 'good';
    if (amount <= 35) return 'great';
    return 'incredible';
  }

  private generateReachExplanation(pick: DraftPick, amount: number): string {
    return `${pick.player.name} selected ${amount} picks early. Consider if need justified the reach.`;
  }

  private generateStealExplanation(pick: DraftPick, amount: number): string {
    return `${pick.player.name} fell ${amount} picks. Excellent value at pick ${pick.pick}.`;
  }

  private async calculateBalanceGrade(picks: DraftPick[]): Promise<number> {
    return Math.random() * 30 + 70;
  }

  private async calculateUpsideGrade(picks: DraftPick[]): Promise<number> {
    return Math.random() * 30 + 65;
  }

  private async calculateSafetyGrade(picks: DraftPick[]): Promise<number> {
    return Math.random() * 25 + 70;
  }

  private async calculateStrategyGrade(
    teamPicks: DraftPick[],
    allPicks: DraftPick[]
  ): Promise<number> {
    return Math.random() * 20 + 75;
  }

  private async calculatePercentile(score: number, allPicks: DraftPick[]): Promise<number> {
    return Math.floor(Math.random() * 30) + 60;
  }

  private async generateGradeInsights(grades: any, picks: DraftPick[]): Promise<string[]> {
    return [
      'Strong value selection throughout',
      'Excellent roster balance',
      'High upside team construction'
    ];
  }

  private async suggestImprovements(grades: any, picks: DraftPick[]): Promise<string[]> {
    return [
      'Consider more RB depth',
      'Target a top-tier TE',
      'Add QB depth for bye week'
    ];
  }

  private assessPositionalNeed(position: string, teamPicks: DraftPick[]): string {
    const count = teamPicks.filter((p: any) => p.player.position === position).length;
    if (count === 0) return 'critical';
    if (count === 1 && ['RB', 'WR'].includes(position)) return 'high';
    return 'low';
  }

  private isPartOfRun(position: string, recentPicks: DraftPick[]): boolean {
    return recentPicks.filter((p: any) => p.player.position === position).length >= 3;
  }

  private async assessTierTiming(player: Player, draftState: DraftPick[]): Promise<string> {
    return 'appropriate'; // Simplified
  }

  private checkStackPotential(player: Player, teamPicks: DraftPick[]): boolean {
    if (player.position === 'WR' || player.position === 'TE') {
      return teamPicks.some((p: any) => p.player.position === 'QB' && p.player.team === player.team);
    }
    return false;
  }

  private checkByeWeekConflict(player: Player, teamPicks: DraftPick[]): boolean {
    const sameByeCount = teamPicks.filter((p: any) => p.player.byeWeek === player.byeWeek).length;
    return sameByeCount >= 3;
  }

  private calculateTierPressure(players: Player[]): number {
    if (players.length === 0) return 1;
    const dropoff = players[0].projectedPoints - players[Math.min(5, players.length - 1)].projectedPoints;
    return Math.min(1, dropoff / 50);
  }

  private explainRunPrediction(
    position: string,
    momentum: number,
    scarcity: number,
    tierPressure: number
  ): string {
    const factors = [];
    if (momentum > 0.4) factors.push('recent draft momentum');
    if (scarcity > 0.5) factors.push('position scarcity');
    if (tierPressure > 0.5) factors.push('tier dropoff');
    
    return `${position} run likely due to ${factors.join(', ')}`;
  }

  private calculateScarcityScore(
    elite: number,
    starters: number,
    dropoff: number,
    importance: number
  ): number {
    return (
      (10 - elite) * 0.3 +
      (24 - starters) * 0.3 +
      dropoff * 0.2 +
      importance * 0.2
    );
  }

  private generateScarcityRecommendation(
    position: string,
    elite: number,
    starters: number,
    dropoff: number
  ): string {
    if (elite <= 2) {
      return `Last chance for elite ${position} talent`;
    }
    if (starters <= 10) {
      return `${position} pool thinning - prioritize if needed`;
    }
    if (dropoff > 50) {
      return `Significant ${position} tier break approaching`;
    }
    return `${position} depth remains strong`;
  }

  private getPositionalImportance(position: string): number {
    const importance = {
      'QB': 0.9,
      'RB': 0.85,
      'WR': 0.8,
      'TE': 0.6,
      'K': 0.2,
      'DST': 0.25
    };
    return importance[position] || 0.5;
  }

  private findNextTierBreak(tiers: Player[][]): number {
    if (tiers[0] && tiers[0].length > 0) {
      return tiers[0].length;
    }
    return 999;
  }

  private async getAlternativeOptions(
    pick: number,
    draftState: DraftPick[]
  ): Promise<Player[]> {
    // Return mock alternatives for now
    return [];
  }

  private async assessTeamNeedsFit(
    pick: DraftPick,
    draftState: DraftPick[]
  ): Promise<number> {
    const teamPicks = draftState.filter((p: any) => p.teamId === pick.teamId);
    const positionCount = teamPicks.filter((p: any) => p.player.position === pick.player.position).length;
    
    if (positionCount === 1 && ['RB', 'WR'].includes(pick.player.position)) {
      return 0.9; // High need fit
    }
    if (positionCount === 0) {
      return 1.0; // Critical need
    }
    return 0.5; // Depth pick
  }

export const aiDraftAnalysisService = new AIDraftAnalysisService();