/**
 * Enhanced Auto-Draft Service for Fantasy Football
 * Implements sophisticated draft strategies for automatic team selection
 */

import { Player, Team, PlayerPosition } from '../types';
import { players } from '../data/players';
import { TEAMS_2025 } from '../data/leagueData';
import draftSimulationEngine, { 
  DraftPick, 
  DraftTeam, 
  SimulationSettings,
  DraftStrategy,
//   AIPersonality
} from './draftSimulationEngine';

// Position requirements for a complete roster
export interface RosterRequirements {
  QB: { min: 1, max: 3, starter: 1 };
  RB: { min: 2, max: 6, starter: 2 };
  WR: { min: 2, max: 6, starter: 2 };
  TE: { min: 1, max: 3, starter: 1 };
  K: { min: 1, max: 2, starter: 1 };
  DST: { min: 1, max: 2, starter: 1 };
  FLEX: { positions: ['RB', 'WR', 'TE'], count: 2 };
  BENCH: { count: 6 };

// Draft result for each team
export interface TeamDraftResult {
  team: Team;
  draftPicks: DraftPick[];
  roster: Player[];
  starters: Player[];
  bench: Player[];
  analytics: {
    projectedPoints: number;
    strengthOfSchedule: number;
    positionStrengths: PlayerPosition[];
    positionWeaknesses: PlayerPosition[];
    bestValue: Player | null;
    biggestReach: Player | null;
    sleepers: Player[];
    handcuffs: Player[];
  };

// Auto-draft configuration
export interface AutoDraftConfig {
  leagueSize: number;
  scoringType: 'standard' | 'ppr' | 'half_ppr';
  userTeamId?: number;
  userStrategy?: DraftStrategy;
  simulateFullLeague: boolean;
  roundLimit?: number;
  allowTrades?: boolean;

// Advanced player evaluation metrics
interface PlayerEvaluation {
  player: Player;
  value: number;
  positionalScarcity: number;
  tierDrop: number;
  consistency: number;
  upside: number;
  scheduleAdjustment: number;
  stackingBonus: number;
  byeWeekPenalty: number;

class AutoDraftService {
  private rosterRequirements: RosterRequirements = {
    QB: { min: 1, max: 3, starter: 1 },
    RB: { min: 2, max: 6, starter: 2 },
    WR: { min: 2, max: 6, starter: 2 },
    TE: { min: 1, max: 3, starter: 1 },
    K: { min: 1, max: 2, starter: 1 },
    DST: { min: 1, max: 2, starter: 1 },
    FLEX: { positions: ['RB', 'WR', 'TE'], count: 2 },
    BENCH: { count: 6 }
  };

  private draftedPlayers: Set<number> = new Set();
  private teamRosters: Map<number, Player[]> = new Map();
  private draftHistory: DraftPick[] = [];
  private availablePlayers: Player[] = [];

  /**
   * Execute full auto-draft for entire league
   */
  async executeAutoDraft(config: AutoDraftConfig): Promise<TeamDraftResult[]> {
    console.log('🚀 Starting Auto-Draft for', config.leagueSize, 'teams');
    
    // Initialize draft state
    this.initializeDraft();
    
    // Setup teams with strategies
    const teams = this.setupTeamsWithStrategies(config);
    
    // Calculate total rounds needed
    const totalRounds = this.calculateTotalRounds();
    const roundLimit = config.roundLimit || totalRounds;
    
    // Execute draft rounds
    for (let round = 1; round <= roundLimit; round++) {
      await this.executeDraftRound(round, teams, config);
    }
    
    // Generate results for each team
    const results = this.generateDraftResults(teams, config);
    
    // Optimize user team if specified
    if (config.userTeamId) {
      const userResult = results.find((r: any) => r.team.id === config.userTeamId);
      if (userResult) {
        this.optimizeUserTeam(userResult, config);
      }
    }
    
    console.log('✅ Auto-Draft Complete!');
    return results;
  }

  /**
   * Generate optimal team for user
   */
  async generateOptimalUserTeam(userId: number = 1): Promise<TeamDraftResult> {
    console.log('🎯 Generating optimal team for user');
    
    // Reset draft state
    this.initializeDraft();
    
    // Create optimal strategy for user
    const optimalStrategy: DraftStrategy = {
      type: 'balanced',
      riskTolerance: 'moderate',
      positionPriority: ['RB', 'WR', 'QB', 'TE', 'RB', 'WR', 'DST', 'K'] as PlayerPosition[],
      rookiePreference: 0.3,
      valueBased: true,
      targetADP: false
    };
    
    // Create user team configuration
    const userTeam = TEAMS_2025.find((t: any) => t.id === userId) || TEAMS_2025[0];
    const roster: Player[] = [];
    
    // Execute value-based drafting
    const positionTargets = this.getOptimalPositionTargets();
    
    for (const target of positionTargets) {
      const player = this.selectBestAvailablePlayer(
        target.position,
        roster,
        target.round,
        'ppr'
      );
      
      if (player && !this.draftedPlayers.has(player.id)) {
        roster.push(player);
        this.draftedPlayers.add(player.id);
      }
    }
    
    // Fill remaining spots with best available
    while (roster.length < 16) {
      const player = this.getBestValuePlayer(roster, 'ppr');
      if (player) {
        roster.push(player);
        this.draftedPlayers.add(player.id);
      } else {
        break;
      }
    }
    
    // Generate analytics
    const result: TeamDraftResult = {
      team: { ...userTeam, roster },
      draftPicks: this.generateDraftPicksForRoster(roster, userId),
      roster,
      starters: this.selectOptimalStarters(roster),
      bench: this.selectBench(roster),
      analytics: this.analyzeTeamStrength(roster, 'ppr')
    };
    
    console.log('✨ Optimal team generated with projected points:', result.analytics.projectedPoints);
    return result;
  }

  /**
   * Initialize draft state
   */
  private initializeDraft(): void {
    this.draftedPlayers.clear();
    this.teamRosters.clear();
    this.draftHistory = [];
    this.availablePlayers = [...players].sort((a, b) => a.rank - b.rank);
  }

  /**
   * Setup teams with diverse strategies
   */
  private setupTeamsWithStrategies(config: AutoDraftConfig): DraftTeam[] {
    const strategies = this.getVariedStrategies();
    const personalities = this.getVariedPersonalities();
    
    return TEAMS_2025.slice(0, config.leagueSize).map((team, index) => {
      const strategy = config.userTeamId === team.id && config.userStrategy
        ? config.userStrategy
        : strategies[index % strategies.length];
      
      const personality = personalities[index % personalities.length];
      
      return {
        id: `team_${team.id}`,
        name: team.name,
        owner: team.owner.name,
        draftPosition: index + 1,
        strategy,
        needs: ['QB', 'RB', 'RB', 'WR', 'WR', 'TE', 'FLEX', 'FLEX', 'K', 'DST'] as PlayerPosition[],
        roster: [],
        aiPersonality: personality,
        pickHistory: [],
        tendencies: {
          averagePickTime: 30,
          positionBias: this.getPositionBias(strategy),
          tierBreaking: 'upside',
          handcuffing: strategy.riskTolerance === 'conservative',
          streamingDST: true,
          lateQB: strategy.type === 'zero_rb',
          rookieHype: personality.sleepers,
          injuryAversion: strategy.riskTolerance === 'conservative' ? 0.8 : 0.4
        }
      };
    });
  }

  /**
   * Execute a single draft round
   */
  private async executeDraftRound(
    round: number, 
    teams: DraftTeam[], 
    config: AutoDraftConfig
  ): Promise<void> {
    console.log(`📍 Round ${round} starting...`);
    
    // Determine pick order (snake draft)
    const pickOrder = round % 2 === 1 
      ? teams 
      : [...teams].reverse();
    
    for (const team of pickOrder) {
      const pick = await this.makeTeamPick(team, round, config);
      if (pick && pick.player) {
        this.draftHistory.push(pick);
        this.draftedPlayers.add(pick.player.id);
        
        // Update team roster
        const teamRoster = this.teamRosters.get(parseInt(team.id.split('_')[1])) || [];
        teamRoster.push(pick.player);
        this.teamRosters.set(parseInt(team.id.split('_')[1]), teamRoster);
      }
    }
  }

  /**
   * Make pick for a specific team
   */
  private async makeTeamPick(
    team: DraftTeam, 
    round: number, 
    config: AutoDraftConfig
  ): Promise<DraftPick | null> {
    // Get available players
    const available = this.availablePlayers.filter((p: any) => !this.draftedPlayers.has(p.id));
    
    if (available.length === 0) return null;
    
    // Use simulation engine for AI picks
    const settings: SimulationSettings = {
      draftType: 'snake',
      rounds: 16,
      teams: config.leagueSize,
      userPosition: team.draftPosition,
      scoringType: config.scoringType,
      positionLimits: {
        QB: 3, RB: 6, WR: 6, TE: 3, K: 2, DST: 2
      },
      benchSize: 6,
      aiDifficulty: 'expert',
      realtimeSpeed: 1,
      includeRookies: true,
      injuryUpdates: true
    };
    
    const pick = draftSimulationEngine.simulateAIPick(
      team,
      available,
      round,
//       settings
    );
    
    return pick;
  }

  /**
   * Select best available player for position
   */
  private selectBestAvailablePlayer(
    position: PlayerPosition | PlayerPosition[],
    currentRoster: Player[],
    round: number,
    scoringType: string
  ): Player | null {
    const positions = Array.isArray(position) ? position : [position];
    const available = this.availablePlayers.filter((p: any) => 
      !this.draftedPlayers.has(p.id) && 
      positions.includes(p.position)
    );
    
    if (available.length === 0) return null;
    
    // Evaluate each player
    const evaluations = available.map((player: any) => ({
      player,
      evaluation: this.evaluatePlayer(player, currentRoster, round, scoringType)
    }));
    
    // Sort by evaluation value
    evaluations.sort((a, b) => b.evaluation.value - a.evaluation.value);
    
    return evaluations[0]?.player || null;
  }

  /**
   * Get best value player regardless of position
   */
  private getBestValuePlayer(
    currentRoster: Player[],
    scoringType: string
  ): Player | null {
    const available = this.availablePlayers.filter((p: any) => !this.draftedPlayers.has(p.id));
    
    // Check position limits
    const needsPositions = this.getNeededPositions(currentRoster);
    const validPlayers = available.filter((p: any) => needsPositions.includes(p.position));
    
    if (validPlayers.length === 0) return null;
    
    // Find best value
    const evaluations = validPlayers.map((player: any) => ({
      player,
      value: this.calculatePlayerValue(player, currentRoster, scoringType)
    }));
    
    evaluations.sort((a, b) => b.value - a.value);
    return evaluations[0]?.player || null;
  }

  /**
   * Evaluate player with advanced metrics
   */
  private evaluatePlayer(
    player: Player,
    roster: Player[],
    round: number,
    scoringType: string
  ): PlayerEvaluation {
    const baseValue = this.calculatePlayerValue(player, roster, scoringType);
    const scarcity = this.calculatePositionalScarcity(player.position, round);
    const tierDrop = this.calculateTierDrop(player);
    const consistency = this.evaluateConsistency(player);
    const upside = this.evaluateUpside(player);
    const schedule = this.evaluateSchedule(player);
    const stacking = this.calculateStackingBonus(player, roster);
    const byePenalty = this.calculateByeWeekPenalty(player, roster);
    
    const totalValue = baseValue * 
      (1 + scarcity * 0.2) * 
      (1 + tierDrop * 0.15) * 
      (1 + consistency * 0.1) * 
      (1 + upside * 0.1) * 
      (1 + schedule * 0.05) * 
      (1 + stacking * 0.05) * 
      (1 - byePenalty * 0.1);
    
    return {
      player,
      value: totalValue,
      positionalScarcity: scarcity,
      tierDrop,
      consistency,
      upside,
      scheduleAdjustment: schedule,
      stackingBonus: stacking,
      byeWeekPenalty: byePenalty
    };
  }

  /**
   * Calculate base player value
   */
  private calculatePlayerValue(
    player: Player,
    roster: Player[],
    scoringType: string
  ): number {
    let value = player.projectedPoints || 100;
    
    // Apply scoring type adjustments
    if (scoringType === 'ppr') {
      if (player.position === 'WR' || player.position === 'RB') {
        value *= 1.15;
      }
    } else if (scoringType === 'half_ppr') {
      if (player.position === 'WR' || player.position === 'RB') {
        value *= 1.07;
      }
    }
    
    // Adjust for position need
    const positionCount = roster.filter((p: any) => p.position === player.position).length;
    const requirements = this.rosterRequirements[player.position as keyof RosterRequirements];
    
    if (requirements && 'min' in requirements) {
      if (positionCount < requirements.min) {
        value *= 1.3; // High need
      } else if (positionCount >= requirements.max) {
        value *= 0.7; // Position filled
      }
    }
    
    return value;
  }

  /**
   * Calculate positional scarcity
   */
  private calculatePositionalScarcity(position: PlayerPosition, round: number): number {
    const available = this.availablePlayers.filter((p: any) => 
      !this.draftedPlayers.has(p.id) && p.position === position
    );
    
    const topTierAvailable = available.filter((p: any) => p.tier && p.tier <= 3).length;
    const totalAvailable = available.length;
    
    // Early rounds - focus on scarce elite talent
    if (round <= 5) {
      if (topTierAvailable <= 2) return 0.8;
      if (topTierAvailable <= 5) return 0.5;
      return 0.2;
    }
    
    // Middle rounds - balanced approach
    if (round <= 10) {
      if (totalAvailable <= 10) return 0.6;
      if (totalAvailable <= 20) return 0.3;
      return 0.1;
    }
    
    // Late rounds - depth matters
    if (totalAvailable <= 5) return 0.4;
    return 0;
  }

  /**
   * Calculate tier drop value
   */
  private calculateTierDrop(player: Player): number {
    if (!player.tier) return 0;
    
    const sameTierPlayers = this.availablePlayers.filter((p: any) => 
      !this.draftedPlayers.has(p.id) && 
      p.position === player.position && 
      p.tier === player.tier
    );
    
    const nextTierPlayers = this.availablePlayers.filter((p: any) => 
      !this.draftedPlayers.has(p.id) && 
      p.position === player.position && 
      p.tier === (player.tier! + 1)
    );
    
    // Last player in tier - high value
    if (sameTierPlayers.length <= 2) {
      if (nextTierPlayers.length > 0) return 0.6;
      return 0.8;
    }
    
    return 0;
  }

  /**
   * Evaluate player consistency
   */
  private evaluateConsistency(player: Player): number {
    if (player.consistency === 'high') return 0.3;
    if (player.consistency === 'medium') return 0.1;
    return -0.1;
  }

  /**
   * Evaluate player upside
   */
  private evaluateUpside(player: Player): number {
    if (player.upside === 'high') return 0.4;
    if (player.upside === 'medium') return 0.15;
    return 0;
  }

  /**
   * Evaluate schedule strength
   */
  private evaluateSchedule(player: Player): number {
    if (!player.scheduleStrength) return 0;
    
    if (player.scheduleStrength.overall === 'easy') return 0.2;
    if (player.scheduleStrength.overall === 'hard') return -0.15;
    
    // Playoff schedule is more important
    if (player.scheduleStrength.playoff === 'easy') return 0.3;
    if (player.scheduleStrength.playoff === 'hard') return -0.2;
    
    return 0;
  }

  /**
   * Calculate stacking bonus (QB-WR from same team)
   */
  private calculateStackingBonus(player: Player, roster: Player[]): number {
    // QB-WR stack
    if (player.position === 'WR') {
      const hasQBFromTeam = roster.some((p: any) => 
        p.position === 'QB' && p.team === player.team
      );
      if (hasQBFromTeam) return 0.15;
    }
    
    // WR-WR stack (risky but high ceiling)
    if (player.position === 'WR') {
      const wrFromTeam = roster.filter((p: any) => 
        p.position === 'WR' && p.team === player.team
      ).length;
      if (wrFromTeam === 1) return 0.05;
      if (wrFromTeam >= 2) return -0.1; // Too many eggs in one basket
    }
    
    return 0;
  }

  /**
   * Calculate bye week penalty
   */
  private calculateByeWeekPenalty(player: Player, roster: Player[]): number {
    const sameByePlayers = roster.filter((p: any) => 
      p.bye === player.bye && p.position === player.position
    ).length;
    
    // Penalize if too many players at same position have same bye
    if (sameByePlayers >= 2) return 0.3;
    if (sameByePlayers >= 1) return 0.1;
    
    return 0;
  }

  /**
   * Get optimal position targets for value-based drafting
   */
  private getOptimalPositionTargets(): Array<{position: PlayerPosition[], round: number}> {
    return [
      { position: ['RB'], round: 1 },           // Elite RB
      { position: ['RB', 'WR'], round: 2 },     // RB or Elite WR
      { position: ['WR'], round: 3 },           // WR1
      { position: ['RB', 'WR'], round: 4 },     // Flex
      { position: ['QB'], round: 5 },           // QB1
      { position: ['WR', 'RB'], round: 6 },     // Depth
      { position: ['TE'], round: 7 },           // TE1
      { position: ['RB', 'WR'], round: 8 },     // Flex depth
      { position: ['WR', 'RB'], round: 9 },     // Bench
      { position: ['QB', 'TE'], round: 10 },    // Backup/upside
      { position: ['RB', 'WR'], round: 11 },    // Bench depth
      { position: ['DST'], round: 12 },         // Defense
      { position: ['RB', 'WR'], round: 13 },    // Sleepers
      { position: ['K'], round: 14 },           // Kicker
      { position: ['RB', 'WR'], round: 15 },    // Lottery tickets
      { position: ['QB', 'TE', 'RB', 'WR'], round: 16 } // Best available
    ];
  }

  /**
   * Get positions still needed for roster
   */
  private getNeededPositions(roster: Player[]): PlayerPosition[] {
    const needed: PlayerPosition[] = [];
    const positions: PlayerPosition[] = ['QB', 'RB', 'WR', 'TE', 'K', 'DST'];
    
    for (const pos of positions) {
      const count = roster.filter((p: any) => p.position === pos).length;
      const req = this.rosterRequirements[pos as keyof RosterRequirements];
      
      if (req && 'max' in req && count < req.max) {
        needed.push(pos);
      }
    }
    
    return needed;
  }

  /**
   * Select optimal starting lineup
   */
  private selectOptimalStarters(roster: Player[]): Player[] {
    const starters: Player[] = [];
    
    // Fill required starters
    const addStarter = (position: PlayerPosition, count: number) => {
      const players = roster
        .filter((p: any) => p.position === position && !starters.includes(p))
        .sort((a, b) => (b.projectedPoints || 0) - (a.projectedPoints || 0))
        .slice(0, count);
      starters.push(...players);
    };
    
    addStarter('QB', 1);
    addStarter('RB', 2);
    addStarter('WR', 2);
    addStarter('TE', 1);
    
    // Fill FLEX spots (RB/WR/TE)
    const flexEligible = roster
      .filter((p: any) => ['RB', 'WR', 'TE'].includes(p.position) && !starters.includes(p))
      .sort((a, b) => (b.projectedPoints || 0) - (a.projectedPoints || 0))
      .slice(0, 2);
    starters.push(...flexEligible);
    
    addStarter('K', 1);
    addStarter('DST', 1);
    
    return starters;
  }

  /**
   * Select bench players
   */
  private selectBench(roster: Player[]): Player[] {
    const starters = this.selectOptimalStarters(roster);
    return roster.filter((p: any) => !starters.includes(p));
  }

  /**
   * Analyze team strength and weaknesses
   */
  private analyzeTeamStrength(roster: Player[], scoringType: string): TeamDraftResult['analytics'] {
    const starters = this.selectOptimalStarters(roster);
    
    // Calculate projected points
    const projectedPoints = starters.reduce((sum, p) => 
      sum + (p.projectedPoints || 0), 0
    );
    
    // Analyze position strengths/weaknesses
    const positionStrengths: PlayerPosition[] = [];
    const positionWeaknesses: PlayerPosition[] = [];
    
    const positions: PlayerPosition[] = ['QB', 'RB', 'WR', 'TE'];
    for (const pos of positions) {
      const players = roster.filter((p: any) => p.position === pos);
      const avgRank = players.reduce((sum, p) => sum + p.rank, 0) / players.length;
      
      if (avgRank <= 50) positionStrengths.push(pos);
      if (avgRank >= 100) positionWeaknesses.push(pos);
    }
    
    // Find best value pick
    const bestValue = roster.reduce((best, player) => {
      const expectedRank = player.adp || player.rank;
      const actualPick = roster.indexOf(player) + 1;
      const value = expectedRank - actualPick;
      
      if (!best || value > (best.adp! - roster.indexOf(best) - 1)) {
        return player;
      }
      return best;
    }, null as Player | null);
    
    // Find biggest reach
    const biggestReach = roster.reduce((worst, player) => {
      const expectedRank = player.adp || player.rank;
      const actualPick = roster.indexOf(player) + 1;
      const reach = actualPick - expectedRank;
      
      if (!worst || reach > (roster.indexOf(worst) + 1 - (worst.adp || worst.rank))) {
        return player;
      }
      return worst;
    }, null as Player | null);
    
    // Find sleepers (late round high upside)
    const sleepers = roster
      .filter((p, idx) => idx >= 10 && p.upside === 'high')
      .slice(0, 3);
    
    // Find handcuffs
    const handcuffs = roster.filter((p: any) => 
      p.role === 'backup' && p.handcuffValue === 'high'
    );
    
    // Calculate strength of schedule
    const scheduleStrength = roster.reduce((sum, p) => {
      if (p.scheduleStrength?.overall === 'easy') return sum + 1;
      if (p.scheduleStrength?.overall === 'hard') return sum - 1;
      return sum;
    }, 0) / roster.length;
    
    return {
      projectedPoints,
      strengthOfSchedule: scheduleStrength,
      positionStrengths,
      positionWeaknesses,
      bestValue,
      biggestReach,
      sleepers,
//       handcuffs
    };
  }

  /**
   * Generate draft picks for a roster
   */
  private generateDraftPicksForRoster(roster: Player[], teamId: number): DraftPick[] {
    return roster.map((player, index) => ({
      overall: index + 1,
      round: Math.floor(index / 10) + 1,
      pickInRound: (index % 10) + 1,
      teamId,
      playerId: player.id,
      timestamp: Date.now()
    }));
  }

  /**
   * Generate draft results for all teams
   */
  private generateDraftResults(teams: DraftTeam[], config: AutoDraftConfig): TeamDraftResult[] {
    return teams.map((draftTeam: any) => {
      const teamId = parseInt(draftTeam.id.split('_')[1]);
      const roster = this.teamRosters.get(teamId) || [];
      const team = TEAMS_2025.find((t: any) => t.id === teamId)!;
      
      return {
        team: { ...team, roster },
        draftPicks: this.draftHistory.filter((p: any) => p.teamId === teamId),
        roster,
        starters: this.selectOptimalStarters(roster),
        bench: this.selectBench(roster),
        analytics: this.analyzeTeamStrength(roster, config.scoringType)
      };
    });
  }

  /**
   * Optimize user team with advanced strategies
   */
  private optimizeUserTeam(result: TeamDraftResult, config: AutoDraftConfig): void {
    console.log('🔧 Optimizing user team lineup...');
    
    // Re-evaluate starters based on matchups
    result.starters = this.selectOptimalStarters(result.roster);
    
    // Identify trade targets
    const tradeTargets = this.identifyTradeTargets(result.roster);
    
    // Add optimization notes to analytics
    console.log('📊 User team optimization complete');
    console.log('- Projected Points:', result.analytics.projectedPoints);
    console.log('- Strengths:', result.analytics.positionStrengths);
    console.log('- Weaknesses:', result.analytics.positionWeaknesses);
    if (tradeTargets.length > 0) {
      console.log('- Trade Targets:', tradeTargets.map((p: any) => p.name));
    }
  }

  /**
   * Identify potential trade targets
   */
  private identifyTradeTargets(roster: Player[]): Player[] {
    const weakPositions = this.analyzeTeamStrength(roster, 'ppr').positionWeaknesses;
    
    return this.availablePlayers
      .filter((p: any) => weakPositions.includes(p.position))
      .filter((p: any) => p.rank <= 50)
      .slice(0, 5);
  }

  /**
   * Get varied draft strategies
   */
  private getVariedStrategies(): DraftStrategy[] {
    return [
      {
        type: 'balanced',
        riskTolerance: 'moderate',
        positionPriority: ['RB', 'WR', 'QB', 'TE', 'RB', 'WR', 'DST', 'K'] as PlayerPosition[],
        rookiePreference: 0.4,
        valueBased: true,
        targetADP: true
      },
      {
        type: 'rb_heavy',
        riskTolerance: 'conservative',
        positionPriority: ['RB', 'RB', 'WR', 'RB', 'QB', 'WR', 'TE', 'DST'] as PlayerPosition[],
        rookiePreference: 0.2,
        valueBased: false,
        targetADP: false
      },
      {
        type: 'wr_heavy',
        riskTolerance: 'moderate',
        positionPriority: ['WR', 'WR', 'RB', 'WR', 'QB', 'RB', 'TE', 'WR'] as PlayerPosition[],
        rookiePreference: 0.5,
        valueBased: true,
        targetADP: false
      },
      {
        type: 'zero_rb',
        riskTolerance: 'aggressive',
        positionPriority: ['WR', 'WR', 'TE', 'WR', 'QB', 'WR', 'RB', 'RB'] as PlayerPosition[],
        rookiePreference: 0.7,
        valueBased: true,
        targetADP: false
      },
      {
        type: 'hero_rb',
        riskTolerance: 'moderate',
        positionPriority: ['RB', 'WR', 'WR', 'TE', 'QB', 'WR', 'RB', 'WR'] as PlayerPosition[],
        rookiePreference: 0.4,
        valueBased: true,
        targetADP: true
      },
      {
        type: 'best_available',
        riskTolerance: 'aggressive',
        positionPriority: ['RB', 'WR', 'RB', 'WR', 'QB', 'TE', 'RB', 'WR'] as PlayerPosition[],
        rookiePreference: 0.6,
        valueBased: true,
        targetADP: false
      }
    ];
  }

  /**
   * Get varied AI personalities
   */
  private getVariedPersonalities(): AIPersonality[] {
    return [
      {
        name: 'The Analyst',
        description: 'Data-driven, methodical drafter',
        decisionSpeed: 'slow',
        research_level: 'expert',
        tradeAggression: 0.4,
        reaches: 0.1,
        sleepers: 0.7,
        consistency: 0.95
      },
      {
        name: 'The Gunslinger',
        description: 'Aggressive, boom-or-bust approach',
        decisionSpeed: 'fast',
        research_level: 'informed',
        tradeAggression: 0.8,
        reaches: 0.6,
        sleepers: 0.8,
        consistency: 0.5
      },
      {
        name: 'The Traditionalist',
        description: 'Follows conventional wisdom',
        decisionSpeed: 'moderate',
        research_level: 'informed',
        tradeAggression: 0.3,
        reaches: 0.2,
        sleepers: 0.3,
        consistency: 0.85
      },
      {
        name: 'The Contrarian',
        description: 'Goes against the grain',
        decisionSpeed: 'fast',
        research_level: 'expert',
        tradeAggression: 0.6,
        reaches: 0.5,
        sleepers: 0.9,
        consistency: 0.6
      },
      {
        name: 'The Rookie',
        description: 'New to fantasy, learning',
        decisionSpeed: 'slow',
        research_level: 'casual',
        tradeAggression: 0.2,
        reaches: 0.4,
        sleepers: 0.2,
        consistency: 0.7
      }
    ];
  }

  /**
   * Get position bias based on strategy
   */
  private getPositionBias(strategy: DraftStrategy): Record<PlayerPosition, number> {
    const baseBias = {
      QB: 1.0,
      RB: 1.0,
      WR: 1.0,
      TE: 1.0,
      K: 0.8,
      DST: 0.8
    };
    
    switch (strategy.type) {
      case 'rb_heavy':
        return { ...baseBias, RB: 1.4, WR: 0.9 };
      case 'wr_heavy':
        return { ...baseBias, WR: 1.3, RB: 0.9 };
      case 'zero_rb':
        return { ...baseBias, WR: 1.5, TE: 1.2, RB: 0.6 };
      case 'hero_rb':
        return { ...baseBias, RB: 1.2, WR: 1.2 };
      default:
        return baseBias;
    }
  }

  /**
   * Calculate total rounds needed
   */
  private calculateTotalRounds(): number {
    const totalPositions = 16; // Standard roster size
    return totalPositions;
  }

// Export singleton instance
export const autoDraftService = new AutoDraftService();
export default autoDraftService;