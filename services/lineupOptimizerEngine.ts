/**
 * Lineup Optimizer Engine
 * Advanced lineup optimization with matchup analysis, weather integration,
 * and ML-powered recommendations
 */

import { Player, Team, League, LineupSlot, ScoringSettings } from '../types';
import { playerPerformanceModel } from './advancedAnalyticsEngine';

/**
 * Advanced Lineup Optimizer
 * Provides optimal lineup recommendations based on multiple factors
 */
export class LineupOptimizerEngine {
  private scoringSettings: ScoringSettings;
  private correlationMatrix: Map<string, Map<string, number>> = new Map();
  private stackingBonus = 1.05; // 5% bonus for QB-WR stacks
  
  constructor(scoringSettings: ScoringSettings) {
    this.scoringSettings = scoringSettings;
    this.initializeCorrelations();
  }

  /**
   * Generate optimal lineup for a given week
   */
  async optimizeLineup(
    team: Team,
    week: number,
    options?: OptimizationOptions
  ): Promise<LineupRecommendation> {
    const availablePlayers = this.getAvailablePlayers(team, options?.excludeInjured);
    const lineupRequirements = this.getLineupRequirements();
    
    // Generate projections for all players
    const playerProjections = await this.generatePlayerProjections(availablePlayers, week);
    
    // Find optimal lineup using dynamic programming
    const optimalLineup = await this.findOptimalLineup(
      playerProjections,
      lineupRequirements,
      options
    );
    
    // Generate alternatives
    const alternatives = await this.generateAlternativeLineups(
      playerProjections,
      lineupRequirements,
      optimalLineup,
      options
    );
    
    // Analyze the lineup
    const analysis = this.analyzeLineup(optimalLineup, playerProjections);
    
    return {
      optimal: optimalLineup,
      alternatives,
      analysis,
      confidence: this.calculateConfidence(optimalLineup, playerProjections)
    };
  }

  /**
   * Compare multiple lineup options
   */
  async compareLineups(
    lineupA: LineupConfiguration,
    lineupB: LineupConfiguration,
    week: number
  ): Promise<LineupComparison> {
    const projectionsA = await this.projectLineupPoints(lineupA, week);
    const projectionsB = await this.projectLineupPoints(lineupB, week);
    
    return {
      lineupA: {
        projectedPoints: projectionsA.total,
        floor: projectionsA.floor,
        ceiling: projectionsA.ceiling,
        volatility: projectionsA.volatility,
        stackBonus: projectionsA.stackBonus
      },
      lineupB: {
        projectedPoints: projectionsB.total,
        floor: projectionsB.floor,
        ceiling: projectionsB.ceiling,
        volatility: projectionsB.volatility,
        stackBonus: projectionsB.stackBonus
      },
      recommendation: projectionsA.total > projectionsB.total ? 'A' : 'B',
      confidenceDelta: Math.abs(projectionsA.total - projectionsB.total) / projectionsA.total,
      analysis: this.generateComparisonAnalysis(projectionsA, projectionsB)
    };
  }

  /**
   * Generate start/sit recommendations
   */
  async getStartSitRecommendations(
    team: Team,
    week: number
  ): Promise<StartSitRecommendation[]> {
    const recommendations: StartSitRecommendation[] = [];
    const projections = await this.generatePlayerProjections(team.players, week);
    
    // Group players by position
    const positionGroups = this.groupByPosition(team.players);
    
    for (const [position, players] of positionGroups.entries()) {
      const sortedPlayers = players
        .map(p => ({
          player: p,
          projection: projections.find(proj => proj.player.id === p.id)!
        }))
        .sort((a, b) => b.projection.projectedPoints - a.projection.projectedPoints);
      
      // Determine how many to start based on position
      const startCount = this.getStartCountForPosition(position);
      
      sortedPlayers.forEach((item, index) => {
        const shouldStart = index < startCount;
        const confidence = this.calculateStartSitConfidence(
          item.projection,
          sortedPlayers,
          index,
          startCount
        );
        
        recommendations.push({
          player: item.player,
          recommendation: shouldStart ? 'START' : 'SIT',
          projectedPoints: item.projection.projectedPoints,
          confidence,
          reasoning: this.generateStartSitReasoning(
            item,
            sortedPlayers,
            shouldStart,
            index,
            startCount
          )
        });
      });
    }
    
    return recommendations;
  }

  /**
   * Optimize lineup for DFS (Daily Fantasy Sports)
   */
  async optimizeForDFS(
    availablePlayers: Player[],
    salaryCap: number,
    contestType: 'GPP' | 'CASH'
  ): Promise<DFSLineupRecommendation> {
    const projections = await this.generatePlayerProjections(availablePlayers, 0);
    
    // Different strategies for tournament vs cash games
    const strategy = contestType === 'GPP' ? 
      this.tournamentStrategy : 
      this.cashGameStrategy;
    
    // Use knapsack algorithm with position constraints
    const optimalLineup = await this.solveDFSOptimization(
      projections,
      salaryCap,
      strategy
    );
    
    // Calculate ownership projections
    const ownershipProjections = this.projectOwnership(optimalLineup);
    
    // Generate GPP leverage plays
    const leveragePlays = contestType === 'GPP' ? 
      this.identifyLeveragePlays(projections, ownershipProjections) : 
      [];
    
    return {
      lineup: optimalLineup,
      totalSalary: optimalLineup.reduce((sum, p) => sum + (p.salary || 0), 0),
      projectedPoints: optimalLineup.reduce((sum, p) => sum + p.projectedPoints, 0),
      ownership: ownershipProjections,
      leveragePlays,
      strategy: strategy.name,
      confidence: this.calculateDFSConfidence(optimalLineup, strategy)
    };
  }

  /**
   * Get flex position recommendations
   */
  async getFlexRecommendations(
    team: Team,
    week: number
  ): Promise<FlexRecommendation[]> {
    const eligiblePlayers = team.players.filter(p => 
      ['RB', 'WR', 'TE'].includes(p.position)
    );
    
    const projections = await this.generatePlayerProjections(eligiblePlayers, week);
    
    // Sort by projected points considering position value
    const recommendations = projections
      .map(proj => ({
        player: proj.player,
        projectedPoints: proj.projectedPoints,
        positionValue: this.calculatePositionValue(proj.player.position),
        matchupRating: proj.matchupRating,
        recommendation: this.generateFlexRecommendation(proj)
      }))
      .sort((a, b) => {
        const scoreA = a.projectedPoints * a.positionValue;
        const scoreB = b.projectedPoints * b.positionValue;
        return scoreB - scoreA;
      });
    
    return recommendations;
  }

  private initializeCorrelations(): void {
    // Initialize player correlation matrix for stacking
    // QB-WR same team correlation
    this.correlationMatrix.set('QB-WR-same', new Map([['correlation', 0.25]]));
    this.correlationMatrix.set('QB-TE-same', new Map([['correlation', 0.15]]));
    this.correlationMatrix.set('RB-DEF-same', new Map([['correlation', 0.10]]));
  }

  private getAvailablePlayers(team: Team, excludeInjured?: boolean): Player[] {
    return team.players.filter(p => {
      if (excludeInjured && p.injuryStatus && p.injuryStatus !== 'Healthy') {
        return false;
      }
      return !p.isSuspended;
    });
  }

  private getLineupRequirements(): LineupRequirements {
    return {
      QB: { min: 1, max: 1 },
      RB: { min: 2, max: 2 },
      WR: { min: 2, max: 2 },
      TE: { min: 1, max: 1 },
      FLEX: { min: 1, max: 1, eligible: ['RB', 'WR', 'TE'] },
      K: { min: 1, max: 1 },
      DEF: { min: 1, max: 1 }
    };
  }

  private async generatePlayerProjections(
    players: Player[],
    week: number
  ): Promise<PlayerProjection[]> {
    const projections: PlayerProjection[] = [];
    
    for (const player of players) {
      const projection = await playerPerformanceModel.generateProjection(
        player,
        this.getOpponentForWeek(player.team, week),
        this.getWeatherForGame(player.team, week),
        player.injuryStatus
      );
      
      projections.push({
        player,
        projectedPoints: projection.projectedPoints,
        floor: projection.floor,
        ceiling: projection.ceiling,
        confidence: projection.confidence,
        boomProbability: projection.boomProbability,
        bustProbability: projection.bustProbability,
        matchupRating: this.calculateMatchupRating(player, week)
      });
    }
    
    return projections;
  }

  private async findOptimalLineup(
    projections: PlayerProjection[],
    requirements: LineupRequirements,
    options?: OptimizationOptions
  ): Promise<LineupConfiguration> {
    const lineup: LineupConfiguration = {
      starters: [],
      bench: [],
      totalProjected: 0
    };
    
    // Sort projections by value (points * confidence)
    const sortedProjections = [...projections].sort((a, b) => {
      const valueA = a.projectedPoints * a.confidence;
      const valueB = b.projectedPoints * b.confidence;
      return valueB - valueA;
    });
    
    // Fill required positions first
    for (const [position, requirement] of Object.entries(requirements)) {
      if (position === 'FLEX') continue; // Handle flex last
      
      const positionPlayers = sortedProjections.filter(p => 
        p.player.position === position && 
        !lineup.starters.some(s => s.id === p.player.id)
      );
      
      for (let i = 0; i < requirement.min && i < positionPlayers.length; i++) {
        lineup.starters.push(positionPlayers[i].player);
        lineup.totalProjected += positionPlayers[i].projectedPoints;
      }
    }
    
    // Fill flex position
    const flexEligible = sortedProjections.filter(p => 
      requirements.FLEX.eligible.includes(p.player.position) &&
      !lineup.starters.some(s => s.id === p.player.id)
    );
    
    if (flexEligible.length > 0) {
      lineup.starters.push(flexEligible[0].player);
      lineup.totalProjected += flexEligible[0].projectedPoints;
    }
    
    // Apply stacking bonus if applicable
    if (options?.preferStacking) {
      lineup.totalProjected *= this.calculateStackingBonus(lineup.starters);
    }
    
    // Remaining players go to bench
    lineup.bench = projections
      .filter(p => !lineup.starters.some(s => s.id === p.player.id))
      .map(p => p.player)
      .slice(0, 6);
    
    return lineup;
  }

  private async generateAlternativeLineups(
    projections: PlayerProjection[],
    requirements: LineupRequirements,
    optimal: LineupConfiguration,
    options?: OptimizationOptions
  ): Promise<LineupConfiguration[]> {
    const alternatives: LineupConfiguration[] = [];
    
    // Generate high-ceiling lineup
    const ceilingLineup = await this.optimizeForCeiling(projections, requirements);
    alternatives.push(ceilingLineup);
    
    // Generate high-floor lineup
    const floorLineup = await this.optimizeForFloor(projections, requirements);
    alternatives.push(floorLineup);
    
    // Generate contrarian lineup
    if (options?.includeContrarian) {
      const contrarianLineup = await this.generateContrarianLineup(projections, requirements);
      alternatives.push(contrarianLineup);
    }
    
    return alternatives;
  }

  private async optimizeForCeiling(
    projections: PlayerProjection[],
    requirements: LineupRequirements
  ): Promise<LineupConfiguration> {
    // Sort by ceiling instead of projected points
    const sortedByCeiling = [...projections].sort((a, b) => b.ceiling - a.ceiling);
    
    return this.buildLineupFromProjections(sortedByCeiling, requirements, 'ceiling');
  }

  private async optimizeForFloor(
    projections: PlayerProjection[],
    requirements: LineupRequirements
  ): Promise<LineupConfiguration> {
    // Sort by floor for safety
    const sortedByFloor = [...projections].sort((a, b) => b.floor - a.floor);
    
    return this.buildLineupFromProjections(sortedByFloor, requirements, 'floor');
  }

  private async generateContrarianLineup(
    projections: PlayerProjection[],
    requirements: LineupRequirements
  ): Promise<LineupConfiguration> {
    // Focus on high variance, low ownership plays
    const contrarianScores = projections.map(p => ({
      ...p,
      contrarianScore: (p.ceiling / p.projectedPoints) * (1 - (p.player.ownership || 50) / 100)
    }));
    
    const sortedContrarian = contrarianScores.sort((a, b) => 
      b.contrarianScore - a.contrarianScore
    );
    
    return this.buildLineupFromProjections(sortedContrarian, requirements, 'contrarian');
  }

  private buildLineupFromProjections(
    sortedProjections: any[],
    requirements: LineupRequirements,
    strategy: string
  ): LineupConfiguration {
    const lineup: LineupConfiguration = {
      starters: [],
      bench: [],
      totalProjected: 0,
      strategy
    };
    
    // Similar logic to findOptimalLineup but with different sorting
    for (const [position, requirement] of Object.entries(requirements)) {
      if (position === 'FLEX') continue;
      
      const positionPlayers = sortedProjections.filter(p => 
        p.player.position === position && 
        !lineup.starters.some(s => s.id === p.player.id)
      );
      
      for (let i = 0; i < requirement.min && i < positionPlayers.length; i++) {
        lineup.starters.push(positionPlayers[i].player);
        lineup.totalProjected += positionPlayers[i].projectedPoints;
      }
    }
    
    // Fill flex
    const flexEligible = sortedProjections.filter(p => 
      ['RB', 'WR', 'TE'].includes(p.player.position) &&
      !lineup.starters.some(s => s.id === p.player.id)
    );
    
    if (flexEligible.length > 0) {
      lineup.starters.push(flexEligible[0].player);
      lineup.totalProjected += flexEligible[0].projectedPoints;
    }
    
    return lineup;
  }

  private analyzeLineup(
    lineup: LineupConfiguration,
    projections: PlayerProjection[]
  ): LineupAnalysis {
    const starterProjections = lineup.starters.map(s => 
      projections.find(p => p.player.id === s.id)!
    );
    
    const totalProjected = starterProjections.reduce((sum, p) => sum + p.projectedPoints, 0);
    const totalFloor = starterProjections.reduce((sum, p) => sum + p.floor, 0);
    const totalCeiling = starterProjections.reduce((sum, p) => sum + p.ceiling, 0);
    
    const avgBoomProbability = starterProjections.reduce((sum, p) => 
      sum + p.boomProbability, 0
    ) / starterProjections.length;
    
    const avgBustProbability = starterProjections.reduce((sum, p) => 
      sum + p.bustProbability, 0
    ) / starterProjections.length;
    
    return {
      totalProjected,
      floor: totalFloor,
      ceiling: totalCeiling,
      volatility: (totalCeiling - totalFloor) / totalProjected,
      boomProbability: avgBoomProbability,
      bustProbability: avgBustProbability,
      stackingBonus: this.calculateStackingBonus(lineup.starters),
      positionStrength: this.analyzePositionStrength(starterProjections),
      weakestLink: this.identifyWeakestLink(starterProjections)
    };
  }

  private calculateStackingBonus(starters: Player[]): number {
    let bonus = 1.0;
    
    // Check for QB-WR/TE stacks
    const qb = starters.find(p => p.position === 'QB');
    if (qb) {
      const sameTeamReceivers = starters.filter(p => 
        ['WR', 'TE'].includes(p.position) && p.team === qb.team
      );
      
      if (sameTeamReceivers.length > 0) {
        bonus *= this.stackingBonus;
      }
    }
    
    return bonus;
  }

  private analyzePositionStrength(projections: PlayerProjection[]): Map<string, number> {
    const strengths = new Map<string, number>();
    
    const positionGroups = this.groupProjectionsByPosition(projections);
    
    for (const [position, group] of positionGroups.entries()) {
      const avgProjection = group.reduce((sum, p) => sum + p.projectedPoints, 0) / group.length;
      const leagueAvg = this.getLeagueAverageForPosition(position);
      strengths.set(position, avgProjection / leagueAvg);
    }
    
    return strengths;
  }

  private identifyWeakestLink(projections: PlayerProjection[]): PlayerProjection {
    return projections.reduce((weakest, current) => 
      current.confidence < weakest.confidence ? current : weakest
    );
  }

  private calculateConfidence(
    lineup: LineupConfiguration,
    projections: PlayerProjection[]
  ): number {
    const starterProjections = lineup.starters.map(s => 
      projections.find(p => p.player.id === s.id)!
    );
    
    const avgConfidence = starterProjections.reduce((sum, p) => 
      sum + p.confidence, 0
    ) / starterProjections.length;
    
    return avgConfidence;
  }

  private async projectLineupPoints(
    lineup: LineupConfiguration,
    week: number
  ): Promise<LineupProjection> {
    const projections = await this.generatePlayerProjections(lineup.starters, week);
    
    const total = projections.reduce((sum, p) => sum + p.projectedPoints, 0);
    const floor = projections.reduce((sum, p) => sum + p.floor, 0);
    const ceiling = projections.reduce((sum, p) => sum + p.ceiling, 0);
    
    return {
      total,
      floor,
      ceiling,
      volatility: (ceiling - floor) / total,
      stackBonus: this.calculateStackingBonus(lineup.starters)
    };
  }

  private generateComparisonAnalysis(
    projectionsA: LineupProjection,
    projectionsB: LineupProjection
  ): string {
    const diff = projectionsA.total - projectionsB.total;
    const pctDiff = (diff / projectionsA.total) * 100;
    
    if (Math.abs(pctDiff) < 2) {
      return 'Both lineups are very close in projected points. Consider other factors like ceiling/floor.';
    } else if (pctDiff > 0) {
      return `Lineup A projects ${Math.abs(pctDiff).toFixed(1)}% more points with ${projectionsA.volatility < projectionsB.volatility ? 'lower' : 'higher'} volatility.`;
    } else {
      return `Lineup B projects ${Math.abs(pctDiff).toFixed(1)}% more points with ${projectionsB.volatility < projectionsA.volatility ? 'lower' : 'higher'} volatility.`;
    }
  }

  private groupByPosition(players: Player[]): Map<string, Player[]> {
    const groups = new Map<string, Player[]>();
    
    players.forEach(player => {
      const group = groups.get(player.position) || [];
      group.push(player);
      groups.set(player.position, group);
    });
    
    return groups;
  }

  private groupProjectionsByPosition(projections: PlayerProjection[]): Map<string, PlayerProjection[]> {
    const groups = new Map<string, PlayerProjection[]>();
    
    projections.forEach(proj => {
      const group = groups.get(proj.player.position) || [];
      group.push(proj);
      groups.set(proj.player.position, group);
    });
    
    return groups;
  }

  private getStartCountForPosition(position: string): number {
    const counts: Record<string, number> = {
      QB: 1,
      RB: 2,
      WR: 2,
      TE: 1,
      K: 1,
      DEF: 1
    };
    return counts[position] || 0;
  }

  private calculateStartSitConfidence(
    projection: PlayerProjection,
    sortedPlayers: any[],
    index: number,
    startCount: number
  ): number {
    if (index < startCount - 1) {
      // Clear starter
      return 0.9;
    } else if (index === startCount - 1 || index === startCount) {
      // Borderline
      const diff = Math.abs(
        projection.projectedPoints - 
        sortedPlayers[startCount - 1].projection.projectedPoints
      );
      return 0.5 + Math.min(0.4, diff / 10);
    } else {
      // Clear sit
      return 0.9;
    }
  }

  private generateStartSitReasoning(
    item: any,
    sortedPlayers: any[],
    shouldStart: boolean,
    index: number,
    startCount: number
  ): string {
    if (shouldStart) {
      if (index === 0) {
        return `Top projected ${item.player.position} with ${item.projection.projectedPoints.toFixed(1)} points`;
      }
      return `Projected for ${item.projection.projectedPoints.toFixed(1)} points, ${index + 1} of ${sortedPlayers.length} at position`;
    } else {
      const starter = sortedPlayers[startCount - 1];
      const diff = starter.projection.projectedPoints - item.projection.projectedPoints;
      return `Projected ${diff.toFixed(1)} points behind the last starter`;
    }
  }

  private tournamentStrategy = {
    name: 'Tournament (GPP)',
    ceilingWeight: 0.7,
    floorWeight: 0.3,
    ownershipWeight: -0.2,
    correlationWeight: 0.3
  };

  private cashGameStrategy = {
    name: 'Cash Game',
    ceilingWeight: 0.3,
    floorWeight: 0.7,
    ownershipWeight: 0.1,
    correlationWeight: 0.1
  };

  private async solveDFSOptimization(
    projections: PlayerProjection[],
    salaryCap: number,
    strategy: any
  ): Promise<Player[]> {
    // Simplified knapsack solution for DFS
    const lineup: Player[] = [];
    let remainingSalary = salaryCap;
    
    // Score each player based on strategy
    const scoredPlayers = projections.map(p => ({
      player: p.player,
      score: (p.projectedPoints * strategy.ceilingWeight) +
             (p.floor * strategy.floorWeight) +
             ((100 - (p.player.ownership || 50)) * strategy.ownershipWeight),
      value: p.projectedPoints / (p.player.salary || 5000)
    }));
    
    // Sort by value
    scoredPlayers.sort((a, b) => b.value - a.value);
    
    // Fill lineup with constraints
    const requirements = this.getLineupRequirements();
    
    for (const [position, requirement] of Object.entries(requirements)) {
      if (position === 'FLEX') continue;
      
      const positionPlayers = scoredPlayers.filter(p => 
        p.player.position === position &&
        p.player.salary <= remainingSalary &&
        !lineup.includes(p.player)
      );
      
      for (let i = 0; i < requirement.min && i < positionPlayers.length; i++) {
        lineup.push(positionPlayers[i].player);
        remainingSalary -= positionPlayers[i].player.salary || 0;
      }
    }
    
    return lineup;
  }

  private projectOwnership(lineup: Player[]): Map<string, number> {
    const ownership = new Map<string, number>();
    
    lineup.forEach(player => {
      // Simplified ownership projection
      const base = player.ownership || 15;
      const adjustment = (player.projectedPoints / player.salary) * 10;
      ownership.set(player.id, Math.min(50, base + adjustment));
    });
    
    return ownership;
  }

  private identifyLeveragePlays(
    projections: PlayerProjection[],
    ownership: Map<string, number>
  ): Player[] {
    // Find low ownership, high ceiling plays
    return projections
      .filter(p => {
        const own = ownership.get(p.player.id) || 20;
        return own < 10 && p.ceiling > p.projectedPoints * 1.5;
      })
      .map(p => p.player)
      .slice(0, 3);
  }

  private calculateDFSConfidence(lineup: Player[], strategy: any): number {
    // Base confidence on salary usage and projected points
    const salaryUsed = lineup.reduce((sum, p) => sum + (p.salary || 0), 0);
    const salaryEfficiency = salaryUsed / 60000; // Assuming 60k cap
    
    const projectedTotal = lineup.reduce((sum, p) => sum + (p.projectedPoints || 0), 0);
    const pointsConfidence = Math.min(1, projectedTotal / 150); // 150 as target
    
    return (salaryEfficiency * 0.3 + pointsConfidence * 0.7);
  }

  private calculatePositionValue(position: string): number {
    const values: Record<string, number> = {
      RB: 1.2,
      WR: 1.1,
      TE: 1.0
    };
    return values[position] || 1.0;
  }

  private generateFlexRecommendation(projection: PlayerProjection): string {
    if (projection.projectedPoints > 12) {
      return 'Strong Flex Play';
    } else if (projection.projectedPoints > 8) {
      return 'Solid Flex Option';
    } else {
      return 'Consider Alternatives';
    }
  }

  private calculateMatchupRating(player: Player, week: number): number {
    // Simplified matchup rating
    return Math.random() * 10;
  }

  private getOpponentForWeek(team: string, week: number): string {
    // Mock implementation
    return 'OPP';
  }

  private getWeatherForGame(team: string, week: number): any {
    // Mock implementation
    return { condition: 'clear', temperature: 72, windSpeed: 5 };
  }

  private getLeagueAverageForPosition(position: string): number {
    const averages: Record<string, number> = {
      QB: 18,
      RB: 12,
      WR: 10,
      TE: 8,
      K: 7,
      DEF: 8
    };
    return averages[position] || 10;
  }
}

// Type definitions
interface OptimizationOptions {
  excludeInjured?: boolean;
  preferStacking?: boolean;
  includeContrarian?: boolean;
  riskTolerance?: 'conservative' | 'balanced' | 'aggressive';
}

interface LineupRecommendation {
  optimal: LineupConfiguration;
  alternatives: LineupConfiguration[];
  analysis: LineupAnalysis;
  confidence: number;
}

interface LineupConfiguration {
  starters: Player[];
  bench: Player[];
  totalProjected: number;
  strategy?: string;
}

interface LineupAnalysis {
  totalProjected: number;
  floor: number;
  ceiling: number;
  volatility: number;
  boomProbability: number;
  bustProbability: number;
  stackingBonus: number;
  positionStrength: Map<string, number>;
  weakestLink: PlayerProjection;
}

interface PlayerProjection {
  player: Player;
  projectedPoints: number;
  floor: number;
  ceiling: number;
  confidence: number;
  boomProbability: number;
  bustProbability: number;
  matchupRating: number;
}

interface LineupRequirements {
  [position: string]: {
    min: number;
    max: number;
    eligible?: string[];
  };
}

interface LineupComparison {
  lineupA: LineupStats;
  lineupB: LineupStats;
  recommendation: 'A' | 'B';
  confidenceDelta: number;
  analysis: string;
}

interface LineupStats {
  projectedPoints: number;
  floor: number;
  ceiling: number;
  volatility: number;
  stackBonus: number;
}

interface StartSitRecommendation {
  player: Player;
  recommendation: 'START' | 'SIT';
  projectedPoints: number;
  confidence: number;
  reasoning: string;
}

interface DFSLineupRecommendation {
  lineup: Player[];
  totalSalary: number;
  projectedPoints: number;
  ownership: Map<string, number>;
  leveragePlays: Player[];
  strategy: string;
  confidence: number;
}

interface FlexRecommendation {
  player: Player;
  projectedPoints: number;
  positionValue: number;
  matchupRating: number;
  recommendation: string;
}

interface LineupProjection {
  total: number;
  floor: number;
  ceiling: number;
  volatility: number;
  stackBonus: number;
}

// Export singleton instance
export const lineupOptimizer = new LineupOptimizerEngine({
  passingTD: 4,
  passingYards: 0.04,
  rushingTD: 6,
  rushingYards: 0.1,
  receivingTD: 6,
  receivingYards: 0.1,
  receptions: 0.5 // Half-PPR
});

export default lineupOptimizer;