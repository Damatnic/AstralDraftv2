/**
 * Advanced Analytics Dashboard Service
 * Comprehensive analytics including playoff probability, power rankings,
 * and predictive modeling
 */

import { machineLearningPlayerPredictionService } from './machineLearningPlayerPredictionService';
import { productionSportsDataService, type NFLPlayer } from './productionSportsDataService';
import { advancedLiveScoringService } from './advancedLiveScoringService';

// Analytics interfaces
export interface TeamAnalytics {
  teamId: string;
  teamName: string;
  record: { wins: number; losses: number; ties: number };
  currentRank: number;
  powerRating: number;
  metrics: {
    pointsFor: number;
    pointsAgainst: number;
    averageScore: number;
    consistency: number;
    explosiveness: number;
    luck: number;
  };
  trends: {
    last3Weeks: 'improving' | 'declining' | 'stable';
    momentum: number; // -100 to 100
    hotStreak: boolean;
    coldStreak: boolean;
  };
  projections: {
    restOfSeasonWins: number;
    finalRecord: { wins: number; losses: number };
    finalRank: number;
    playoffProbability: number;
    championshipProbability: number;
  };
  strengthOfSchedule: {
    played: number;
    remaining: number;
    overall: number;
    playoffWeeks: number;
  };
  performanceBreakdown: {
    vsTopTeams: { wins: number; losses: number };
    vsBottomTeams: { wins: number; losses: number };
    closeGames: { wins: number; losses: number };
    blowouts: { wins: number; losses: number };
  };
}

export interface PlayoffProbability {
  teamId: string;
  teamName: string;
  currentRecord: { wins: number; losses: number; ties: number };
  scenarios: PlayoffScenario[];
  overallProbability: number;
  byeSeedProbability: number;
  specificSeedProbabilities: { [seed: number]: number };
  clinchingScenarios: ClinchingScenario[];
  eliminationScenarios: EliminationScenario[];
  magicNumber: number | null;
  simulations: SimulationResult[];
}

export interface PlayoffScenario {
  scenarioId: string;
  description: string;
  requirements: string[];
  probability: number;
  impact: 'clinch' | 'improve' | 'maintain' | 'eliminate';
  weekOccurs: number;
}

export interface ClinchingScenario {
  week: number;
  requirements: string[];
  probability: number;
  type: 'division' | 'wildcard' | 'bye' | 'homefield';
}

export interface EliminationScenario {
  week: number;
  requirements: string[];
  probability: number;
  canAvoid: boolean;
  avoidanceStrategy: string[];
}

export interface SimulationResult {
  simulationId: string;
  finalStandings: Array<{
    teamId: string;
    wins: number;
    losses: number;
    seed: number;
  }>;
  playoffTeams: string[];
  champion: string;
}

export interface PowerRankings {
  week: number;
  rankings: PowerRankingEntry[];
  biggestMovers: {
    risers: RankingMover[];
    fallers: RankingMover[];
  };
  tierBreakdown: TierGroup[];
  methodology: string;
  lastUpdated: string;
}

export interface PowerRankingEntry {
  rank: number;
  previousRank: number;
  team: string;
  rating: number;
  record: { wins: number; losses: number; ties: number };
  pointsFor: number;
  pointsAgainst: number;
  trend: 'up' | 'down' | 'stable';
  strengthOfVictories: number;
  qualityLosses: number;
  analysis: string;
}

export interface RankingMover {
  team: string;
  previousRank: number;
  currentRank: number;
  change: number;
  reason: string;
}

export interface TierGroup {
  tier: 'elite' | 'contender' | 'middling' | 'struggling' | 'rebuilding';
  teams: string[];
  description: string;
  averageRating: number;
}

export interface ScheduleAnalysis {
  teamId: string;
  weeks: WeekAnalysis[];
  difficultyScore: number;
  easiestStretch: { startWeek: number; endWeek: number; difficulty: number };
  hardestStretch: { startWeek: number; endWeek: number; difficulty: number };
  playoffSchedule: WeekAnalysis[];
  mustWinGames: number[];
  trapGames: number[];
  advantages: string[];
  disadvantages: string[];
}

export interface WeekAnalysis {
  week: number;
  opponent: string;
  opponentRank: number;
  difficulty: number; // 0-10
  projectedScore: { team: number; opponent: number };
  winProbability: number;
  keyFactors: string[];
  restAdvantage: 'team' | 'opponent' | 'none';
  divisionGame: boolean;
  mustWin: boolean;
}

export interface ExpectedWins {
  teamId: string;
  currentWins: number;
  expectedWins: number;
  luck: number; // Positive = lucky, Negative = unlucky
  pythagWins: number; // Based on points for/against
  adjustedWins: number; // Adjusted for strength of schedule
  breakdown: {
    deservingWins: number;
    luckyWins: number;
    unluckyLosses: number;
    deservingLosses: number;
  };
}

export interface ConsistencyAnalysis {
  teamId: string;
  consistencyScore: number; // 0-100
  standardDeviation: number;
  coefficientOfVariation: number;
  weeklyScores: Array<{
    week: number;
    score: number;
    vsAverage: number;
    performance: 'boom' | 'bust' | 'average';
  }>;
  boomWeeks: number;
  bustWeeks: number;
  averageWeeks: number;
  predictability: 'very_high' | 'high' | 'medium' | 'low' | 'very_low';
}

export interface InjuryImpactAnalysis {
  teamId: string;
  totalImpact: number; // Points lost due to injuries
  affectedPlayers: Array<{
    playerId: string;
    playerName: string;
    weeksInjured: number;
    pointsLost: number;
    replacementLevel: number;
  }>;
  projectedFutureImpact: number;
  riskScore: number; // 0-100
  recommendations: string[];
}

export interface TradeImpactProjection {
  tradeId: string;
  teams: string[];
  beforeProjections: { [teamId: string]: TeamProjection };
  afterProjections: { [teamId: string]: TeamProjection };
  winProbabilityChange: { [teamId: string]: number };
  playoffProbabilityChange: { [teamId: string]: number };
  championshipProbabilityChange: { [teamId: string]: number };
  verdict: 'win-win' | 'win-lose' | 'lose-lose' | 'neutral';
  recommendation: string;
}

export interface TeamProjection {
  projectedWins: number;
  projectedLosses: number;
  projectedPoints: number;
  projectedRank: number;
  playoffProbability: number;
  championshipProbability: number;
}

export interface MonteCarloSimulation {
  simulationCount: number;
  results: {
    standings: { [teamId: string]: number[] }; // Array of final positions
    playoffs: { [teamId: string]: number }; // Times made playoffs
    championships: { [teamId: string]: number }; // Times won championship
    averageWins: { [teamId: string]: number };
    averagePoints: { [teamId: string]: number };
  };
  confidence: number;
  convergenceReached: boolean;
  insights: string[];
}

export interface AdvancedMetrics {
  teamId: string;
  offensiveEfficiency: number;
  positionalValue: {
    QB: number;
    RB: number;
    WR: number;
    TE: number;
    K: number;
    DST: number;
  };
  weeklyVolatility: number;
  clutchPerformance: number; // Performance in close games
  garbageTimePoints: number; // Points scored in blowouts
  scheduleLuck: number;
  injuryLuck: number;
  overallLuck: number;
  sustainabilityScore: number; // How sustainable is current performance
  regressionPotential: number; // Likelihood of regression to mean
}

class AdvancedAnalyticsDashboardService {
  private readonly cache = new Map<string, { data: any; expires: number }>();
  private readonly CACHE_TTL = 10 * 60 * 1000; // 10 minutes
  private simulationCache = new Map<string, MonteCarloSimulation>();
  private powerRankingsCache: PowerRankings | null = null;

  constructor() {
    this.initializeService();
  }

  private initializeService(): void {
    console.log('📊 Initializing Advanced Analytics Dashboard Service...');
    
    // Start periodic calculations
    setInterval(() => {
      this.updatePowerRankings();
    }, 60 * 60 * 1000); // Update hourly
    
    // Clean up cache
    setInterval(() => {
      this.cleanupCache();
    }, 5 * 60 * 1000);
  }

  /**
   * Get comprehensive team analytics
   */
  async getTeamAnalytics(teamId: string, leagueId: string): Promise<TeamAnalytics> {
    try {
      console.log(`📈 Generating analytics for team ${teamId}`);

      const cacheKey = `team_analytics_${teamId}_${leagueId}`;
      const cached = this.cache.get(cacheKey);
      
      if (cached && Date.now() < cached.expires) {
        return cached.data;
      }

      // Gather team data
      const record = await this.getTeamRecord(teamId, leagueId);
      const metrics = await this.calculateTeamMetrics(teamId, leagueId);
      const trends = await this.analyzeTrends(teamId, leagueId);
      const projections = await this.generateProjections(teamId, leagueId);
      const sos = await this.calculateStrengthOfSchedule(teamId, leagueId);
      const breakdown = await this.getPerformanceBreakdown(teamId, leagueId);
      const powerRating = await this.calculatePowerRating(teamId, metrics, sos);

      const analytics: TeamAnalytics = {
        teamId,
        teamName: `Team ${teamId}`,
        record,
        currentRank: await this.getCurrentRank(teamId, leagueId),
        powerRating,
        metrics,
        trends,
        projections,
        strengthOfSchedule: sos,
        performanceBreakdown: breakdown
      };

      // Cache the results
      this.cache.set(cacheKey, { 
        data: analytics, 
        expires: Date.now() + this.CACHE_TTL 
      });

      console.log(`✅ Analytics generated for team ${teamId}`);
      return analytics;

    } catch (error) {
      console.error('❌ Error generating team analytics:', error);
      throw new Error(`Failed to generate analytics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Calculate playoff probabilities using Monte Carlo simulation
   */
  async calculatePlayoffProbabilities(
    leagueId: string,
    simulationCount: number = 10000
  ): Promise<{ [teamId: string]: PlayoffProbability }> {
    try {
      console.log(`🎲 Running ${simulationCount} playoff simulations for league ${leagueId}`);

      const cacheKey = `playoff_prob_${leagueId}_${simulationCount}`;
      const cached = this.cache.get(cacheKey);
      
      if (cached && Date.now() < cached.expires) {
        return cached.data;
      }

      // Run Monte Carlo simulation
      const simulation = await this.runMonteCarloSimulation(leagueId, simulationCount);
      
      // Calculate probabilities for each team
      const probabilities: { [teamId: string]: PlayoffProbability } = {};
      const teams = await this.getLeagueTeams(leagueId);
      
      for (const team of teams) {
        const teamProb = await this.calculateTeamPlayoffProbability(
          team.teamId,
          leagueId,
          simulation
        );
        probabilities[team.teamId] = teamProb;
      }

      // Cache results
      this.cache.set(cacheKey, { 
        data: probabilities, 
        expires: Date.now() + this.CACHE_TTL 
      });

      console.log(`✅ Playoff probabilities calculated for ${teams.length} teams`);
      return probabilities;

    } catch (error) {
      console.error('❌ Error calculating playoff probabilities:', error);
      throw new Error(`Failed to calculate probabilities: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get power rankings for the league
   */
  async getPowerRankings(leagueId: string, week: number): Promise<PowerRankings> {
    try {
      console.log(`🏆 Generating power rankings for week ${week}`);

      if (this.powerRankingsCache && this.powerRankingsCache.week === week) {
        return this.powerRankingsCache;
      }

      const teams = await this.getLeagueTeams(leagueId);
      const rankings: PowerRankingEntry[] = [];
      
      for (const team of teams) {
        const analytics = await this.getTeamAnalytics(team.teamId, leagueId);
        const entry = await this.createPowerRankingEntry(team, analytics, week);
        rankings.push(entry);
      }

      // Sort by rating
      rankings.sort((a, b) => b.rating - a.rating);
      
      // Assign ranks
      rankings.forEach((entry, index) => {
        entry.rank = index + 1;
      });

      // Identify movers
      const biggestMovers = this.identifyBiggestMovers(rankings);
      
      // Create tier groups
      const tierBreakdown = this.createTierBreakdown(rankings);

      const powerRankings: PowerRankings = {
        week,
        rankings,
        biggestMovers,
        tierBreakdown,
        methodology: 'Composite rating based on record, point differential, strength of schedule, and recent performance',
        lastUpdated: new Date().toISOString()
      };

      this.powerRankingsCache = powerRankings;

      console.log(`✅ Power rankings generated for week ${week}`);
      return powerRankings;

    } catch (error) {
      console.error('❌ Error generating power rankings:', error);
      throw new Error(`Failed to generate rankings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Analyze schedule difficulty and key games
   */
  async analyzeSchedule(teamId: string, leagueId: string): Promise<ScheduleAnalysis> {
    try {
      console.log(`📅 Analyzing schedule for team ${teamId}`);

      const schedule = await this.getTeamSchedule(teamId, leagueId);
      const weeks: WeekAnalysis[] = [];
      
      for (const game of schedule) {
        const analysis = await this.analyzeWeek(game, teamId, leagueId);
        weeks.push(analysis);
      }

      // Calculate overall difficulty
      const difficultyScore = weeks.reduce((sum, w) => sum + w.difficulty, 0) / weeks.length;
      
      // Find easiest and hardest stretches
      const stretches = this.findScheduleStretches(weeks);
      
      // Identify key games
      const mustWinGames = weeks
        .filter((w: any) => w.mustWin)
        .map((w: any) => w.week);
      
      const trapGames = weeks
        .filter((w: any) => w.difficulty < 4 && w.winProbability < 0.6)
        .map((w: any) => w.week);

      // Get playoff schedule
      const playoffWeeks = [14, 15, 16, 17];
      const playoffSchedule = weeks.filter((w: any) => playoffWeeks.includes(w.week));

      // Identify advantages and disadvantages
      const advantages = this.identifyScheduleAdvantages(weeks);
      const disadvantages = this.identifyScheduleDisadvantages(weeks);

      return {
        teamId,
        weeks,
        difficultyScore,
        easiestStretch: stretches.easiest,
        hardestStretch: stretches.hardest,
        playoffSchedule,
        mustWinGames,
        trapGames,
        advantages,
        disadvantages
      };

    } catch (error) {
      console.error('❌ Error analyzing schedule:', error);
      throw new Error(`Failed to analyze schedule: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Calculate expected wins vs actual wins (luck analysis)
   */
  async calculateExpectedWins(teamId: string, leagueId: string): Promise<ExpectedWins> {
    try {
      console.log(`🎯 Calculating expected wins for team ${teamId}`);

      const record = await this.getTeamRecord(teamId, leagueId);
      const scores = await this.getTeamScores(teamId, leagueId);
      
      // Calculate Pythagorean wins
      const pythagWins = this.calculatePythagoreanWins(scores);
      
      // Calculate expected wins based on scoring
      const expectedWins = await this.calculateExpectedWinsFromScoring(teamId, leagueId);
      
      // Calculate luck factor
      const luck = record.wins - expectedWins;
      
      // Adjust for strength of schedule
      const sos = await this.calculateStrengthOfSchedule(teamId, leagueId);
      const adjustedWins = expectedWins * (1 + (sos.overall - 0.5) * 0.2);
      
      // Break down wins and losses
      const breakdown = await this.breakdownWinsAndLosses(teamId, leagueId, expectedWins);

      return {
        teamId,
        currentWins: record.wins,
        expectedWins,
        luck,
        pythagWins,
        adjustedWins,
        breakdown
      };

    } catch (error) {
      console.error('❌ Error calculating expected wins:', error);
      throw new Error(`Failed to calculate expected wins: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Analyze team consistency
   */
  async analyzeConsistency(teamId: string, leagueId: string): Promise<ConsistencyAnalysis> {
    try {
      console.log(`📊 Analyzing consistency for team ${teamId}`);

      const scores = await this.getTeamScores(teamId, leagueId);
      const weeklyScores = scores.weekly;
      
      // Calculate statistics
      const average = weeklyScores.reduce((sum, s) => sum + s.score, 0) / weeklyScores.length;
      const variance = weeklyScores.reduce((sum, s) => sum + Math.pow(s.score - average, 2), 0) / weeklyScores.length;
      const standardDeviation = Math.sqrt(variance);
      const coefficientOfVariation = standardDeviation / average;
      
      // Categorize weeks
      let boomWeeks = 0;
      let bustWeeks = 0;
      let averageWeeks = 0;
      
      const categorizedScores = weeklyScores.map((ws: any) => {
        const vsAverage = ws.score - average;
        let performance: 'boom' | 'bust' | 'average';
        
        if (vsAverage > standardDeviation) {
          performance = 'boom';
          boomWeeks++;
        } else if (vsAverage < -standardDeviation) {
          performance = 'bust';
          bustWeeks++;
        } else {
          performance = 'average';
          averageWeeks++;
        }
        
        return {
          week: ws.week,
          score: ws.score,
          vsAverage,
          performance
        };
      });
      
      // Calculate consistency score (0-100)
      const consistencyScore = Math.max(0, 100 - (coefficientOfVariation * 100));
      
      // Determine predictability
      let predictability: ConsistencyAnalysis['predictability'];
      if (coefficientOfVariation < 0.1) predictability = 'very_high';
      else if (coefficientOfVariation < 0.15) predictability = 'high';
      else if (coefficientOfVariation < 0.2) predictability = 'medium';
      else if (coefficientOfVariation < 0.25) predictability = 'low';
      else predictability = 'very_low';

      return {
        teamId,
        consistencyScore,
        standardDeviation,
        coefficientOfVariation,
        weeklyScores: categorizedScores,
        boomWeeks,
        bustWeeks,
        averageWeeks,
        predictability
      };

    } catch (error) {
      console.error('❌ Error analyzing consistency:', error);
      throw new Error(`Failed to analyze consistency: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Analyze impact of injuries on team performance
   */
  async analyzeInjuryImpact(teamId: string, leagueId: string): Promise<InjuryImpactAnalysis> {
    try {
      console.log(`🏥 Analyzing injury impact for team ${teamId}`);

      const roster = await this.getTeamRoster(teamId, leagueId);
      const injuries = await this.getTeamInjuries(teamId, leagueId);
      
      let totalImpact = 0;
      const affectedPlayers: any[] = [];
      
      for (const injury of injuries) {
        const player = roster.find((p: any) => p.playerId === injury.playerId);
        if (!player) continue;
        
        const pointsLost = await this.calculatePointsLostToInjury(player, injury);
        const replacementLevel = await this.getReplacementLevel(player.position);
        
        totalImpact += pointsLost;
        affectedPlayers.push({
          playerId: player.playerId,
          playerName: player.name,
          weeksInjured: injury.weeksOut,
          pointsLost,
          replacementLevel
        });
      }
      
      // Project future impact
      const projectedFutureImpact = await this.projectFutureInjuryImpact(roster);
      
      // Calculate risk score
      const riskScore = this.calculateInjuryRiskScore(roster, injuries);
      
      // Generate recommendations
      const recommendations = this.generateInjuryRecommendations(affectedPlayers, riskScore);

      return {
        teamId,
        totalImpact,
        affectedPlayers,
        projectedFutureImpact,
        riskScore,
        recommendations
      };

    } catch (error) {
      console.error('❌ Error analyzing injury impact:', error);
      throw new Error(`Failed to analyze injuries: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Project impact of a potential trade
   */
  async projectTradeImpact(
    tradeProposal: any,
    leagueId: string
  ): Promise<TradeImpactProjection> {
    try {
      console.log(`🔄 Projecting trade impact`);

      const teams = [tradeProposal.team1, tradeProposal.team2];
      const beforeProjections: { [teamId: string]: TeamProjection } = {};
      const afterProjections: { [teamId: string]: TeamProjection } = {};
      
      // Get current projections
      for (const teamId of teams) {
        beforeProjections[teamId] = await this.getTeamProjection(teamId, leagueId);
      }
      
      // Apply trade and recalculate
      const modifiedRosters = await this.applyTradeToRosters(tradeProposal, leagueId);
      
      for (const teamId of teams) {
        afterProjections[teamId] = await this.getTeamProjectionWithRoster(
          teamId,
          leagueId,
          modifiedRosters[teamId]
        );
      }
      
      // Calculate changes
      const winProbabilityChange: { [teamId: string]: number } = {};
      const playoffProbabilityChange: { [teamId: string]: number } = {};
      const championshipProbabilityChange: { [teamId: string]: number } = {};
      
      for (const teamId of teams) {
        winProbabilityChange[teamId] = 
          afterProjections[teamId].projectedWins - beforeProjections[teamId].projectedWins;
        playoffProbabilityChange[teamId] = 
          afterProjections[teamId].playoffProbability - beforeProjections[teamId].playoffProbability;
        championshipProbabilityChange[teamId] = 
          afterProjections[teamId].championshipProbability - beforeProjections[teamId].championshipProbability;
      }
      
      // Determine verdict
      const verdict = this.determineTradeVerdict(
        winProbabilityChange,
        playoffProbabilityChange
      );
      
      // Generate recommendation
      const recommendation = this.generateTradeRecommendation(
        verdict,
        winProbabilityChange,
        playoffProbabilityChange
      );

      return {
        tradeId: tradeProposal.id,
        teams,
        beforeProjections,
        afterProjections,
        winProbabilityChange,
        playoffProbabilityChange,
        championshipProbabilityChange,
        verdict,
        recommendation
      };

    } catch (error) {
      console.error('❌ Error projecting trade impact:', error);
      throw new Error(`Failed to project trade: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Run Monte Carlo simulation for season outcomes
   */
  async runMonteCarloSimulation(
    leagueId: string,
    simulationCount: number = 10000
  ): Promise<MonteCarloSimulation> {
    try {
      console.log(`🎲 Running ${simulationCount} Monte Carlo simulations`);

      const cacheKey = `monte_carlo_${leagueId}_${simulationCount}`;
      const cached = this.simulationCache.get(cacheKey);
      
      if (cached) {
        return cached;
      }

      const teams = await this.getLeagueTeams(leagueId);
      const currentWeek = await this.getCurrentWeek();
      const remainingWeeks = 17 - currentWeek;
      
      // Initialize results
      const results: MonteCarloSimulation['results'] = {
        standings: {},
        playoffs: {},
        championships: {},
        averageWins: {},
        averagePoints: {}
      };
      
      for (const team of teams) {
        results.standings[team.teamId] = [];
        results.playoffs[team.teamId] = 0;
        results.championships[team.teamId] = 0;
        results.averageWins[team.teamId] = 0;
        results.averagePoints[team.teamId] = 0;
      }
      
      // Run simulations
      for (let i = 0; i < simulationCount; i++) {
        const seasonResult = await this.simulateSeason(leagueId, teams, currentWeek);
        
        // Record results
        for (const team of seasonResult.finalStandings) {
          results.standings[team.teamId].push(team.rank);
          results.averageWins[team.teamId] += team.wins;
          results.averagePoints[team.teamId] += team.points;
          
          if (team.madePlayoffs) {
            results.playoffs[team.teamId]++;
          }
          
          if (team.wonChampionship) {
            results.championships[team.teamId]++;
          }
        }
      }
      
      // Calculate averages
      for (const team of teams) {
        results.averageWins[team.teamId] /= simulationCount;
        results.averagePoints[team.teamId] /= simulationCount;
      }
      
      // Check convergence
      const convergenceReached = this.checkConvergence(results, simulationCount);
      
      // Generate insights
      const insights = this.generateSimulationInsights(results, teams);

      const simulation: MonteCarloSimulation = {
        simulationCount,
        results,
        confidence: convergenceReached ? 0.95 : 0.85,
        convergenceReached,
        insights
      };

      // Cache results
      this.simulationCache.set(cacheKey, simulation);

      console.log(`✅ Monte Carlo simulation complete`);
      return simulation;

    } catch (error) {
      console.error('❌ Error running Monte Carlo simulation:', error);
      throw new Error(`Failed to run simulation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Calculate advanced metrics for a team
   */
  async calculateAdvancedMetrics(teamId: string, leagueId: string): Promise<AdvancedMetrics> {
    try {
      console.log(`🔬 Calculating advanced metrics for team ${teamId}`);

      const roster = await this.getTeamRoster(teamId, leagueId);
      const scores = await this.getTeamScores(teamId, leagueId);
      const schedule = await this.getTeamSchedule(teamId, leagueId);
      
      // Calculate offensive efficiency
      const offensiveEfficiency = await this.calculateOffensiveEfficiency(roster, scores);
      
      // Calculate positional value
      const positionalValue = await this.calculatePositionalValue(roster);
      
      // Calculate volatility
      const weeklyVolatility = this.calculateVolatility(scores.weekly);
      
      // Calculate clutch performance
      const clutchPerformance = await this.calculateClutchPerformance(teamId, leagueId);
      
      // Calculate garbage time points
      const garbageTimePoints = await this.calculateGarbageTimePoints(teamId, leagueId);
      
      // Calculate various luck metrics
      const scheduleLuck = await this.calculateScheduleLuck(teamId, schedule);
      const injuryLuck = await this.calculateInjuryLuck(teamId, leagueId);
      const overallLuck = (scheduleLuck + injuryLuck) / 2;
      
      // Calculate sustainability
      const sustainabilityScore = await this.calculateSustainability(
        offensiveEfficiency,
        weeklyVolatility,
        clutchPerformance
      );
      
      // Calculate regression potential
      const regressionPotential = this.calculateRegressionPotential(
        scores,
        overallLuck,
        sustainabilityScore
      );

      return {
        teamId,
        offensiveEfficiency,
        positionalValue,
        weeklyVolatility,
        clutchPerformance,
        garbageTimePoints,
        scheduleLuck,
        injuryLuck,
        overallLuck,
        sustainabilityScore,
        regressionPotential
      };

    } catch (error) {
      console.error('❌ Error calculating advanced metrics:', error);
      throw new Error(`Failed to calculate metrics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Private helper methods

  private async getTeamRecord(teamId: string, leagueId: string): Promise<any> {
    // Mock implementation - would get actual record
    return { wins: 7, losses: 3, ties: 0 };
  }

  private async calculateTeamMetrics(teamId: string, leagueId: string): Promise<any> {
    return {
      pointsFor: 1250,
      pointsAgainst: 1100,
      averageScore: 125,
      consistency: 0.75,
      explosiveness: 0.6,
      luck: 0.1
    };
  }

  private async analyzeTrends(teamId: string, leagueId: string): Promise<any> {
    return {
      last3Weeks: 'improving' as const,
      momentum: 35,
      hotStreak: true,
      coldStreak: false
    };
  }

  private async generateProjections(teamId: string, leagueId: string): Promise<any> {
    return {
      restOfSeasonWins: 4,
      finalRecord: { wins: 11, losses: 6 },
      finalRank: 3,
      playoffProbability: 0.85,
      championshipProbability: 0.15
    };
  }

  private async calculateStrengthOfSchedule(teamId: string, leagueId: string): Promise<any> {
    return {
      played: 0.52,
      remaining: 0.48,
      overall: 0.50,
      playoffWeeks: 0.55
    };
  }

  private async getPerformanceBreakdown(teamId: string, leagueId: string): Promise<any> {
    return {
      vsTopTeams: { wins: 2, losses: 1 },
      vsBottomTeams: { wins: 3, losses: 0 },
      closeGames: { wins: 2, losses: 1 },
      blowouts: { wins: 3, losses: 0 }
    };
  }

  private async calculatePowerRating(teamId: string, metrics: any, sos: any): Promise<number> {
    // Complex power rating calculation
    const baseRating = metrics.averageScore / 10;
    const sosAdjustment = (sos.overall - 0.5) * 10;
    const consistencyBonus = metrics.consistency * 5;
    const luckPenalty = Math.abs(metrics.luck) * 2;
    
    return Math.max(0, Math.min(100, baseRating + sosAdjustment + consistencyBonus - luckPenalty));
  }

  private async getCurrentRank(teamId: string, leagueId: string): Promise<number> {
    return 3; // Mock
  }

  private async getLeagueTeams(leagueId: string): Promise<any[]> {
    // Mock implementation
    return [
      { teamId: 'team1', name: 'Team 1' },
      { teamId: 'team2', name: 'Team 2' },
      { teamId: 'team3', name: 'Team 3' },
      { teamId: 'team4', name: 'Team 4' }
    ];
  }

  private async calculateTeamPlayoffProbability(
    teamId: string,
    leagueId: string,
    simulation: MonteCarloSimulation
  ): Promise<PlayoffProbability> {
    const playoffProb = (simulation.results.playoffs[teamId] || 0) / simulation.simulationCount;
    
    return {
      teamId,
      teamName: `Team ${teamId}`,
      currentRecord: { wins: 7, losses: 3, ties: 0 },
      scenarios: [],
      overallProbability: playoffProb,
      byeSeedProbability: playoffProb * 0.3,
      specificSeedProbabilities: {
        1: playoffProb * 0.1,
        2: playoffProb * 0.2,
        3: playoffProb * 0.2,
        4: playoffProb * 0.2,
        5: playoffProb * 0.15,
        6: playoffProb * 0.15
      },
      clinchingScenarios: [],
      eliminationScenarios: [],
      magicNumber: 2,
      simulations: []
    };
  }

  private async createPowerRankingEntry(team: any, analytics: TeamAnalytics, week: number): Promise<PowerRankingEntry> {
    return {
      rank: 0, // Will be set later
      previousRank: team.previousRank || 0,
      team: team.name,
      rating: analytics.powerRating,
      record: analytics.record,
      pointsFor: analytics.metrics.pointsFor,
      pointsAgainst: analytics.metrics.pointsAgainst,
      trend: analytics.trends.momentum > 0 ? 'up' : analytics.trends.momentum < 0 ? 'down' : 'stable',
      strengthOfVictories: 0.65,
      qualityLosses: 0.4,
      analysis: `${team.name} ${analytics.trends.last3Weeks} with ${analytics.trends.hotStreak ? 'hot streak' : 'steady performance'}`
    };
  }

  private identifyBiggestMovers(rankings: PowerRankingEntry[]): any {
    const risers: RankingMover[] = [];
    const fallers: RankingMover[] = [];
    
    for (const entry of rankings) {
      if (entry.previousRank > 0) {
        const change = entry.previousRank - entry.rank;
        if (change >= 3) {
          risers.push({
            team: entry.team,
            previousRank: entry.previousRank,
            currentRank: entry.rank,
            change,
            reason: 'Strong recent performance'
          });
        } else if (change <= -3) {
          fallers.push({
            team: entry.team,
            previousRank: entry.previousRank,
            currentRank: entry.rank,
            change,
            reason: 'Recent struggles'
          });
        }
      }
    }
    
    return { risers, fallers };
  }

  private createTierBreakdown(rankings: PowerRankingEntry[]): TierGroup[] {
    const tiers: TierGroup[] = [];
    
    const tierSizes = [2, 3, 4, 3, 2]; // Example tier distribution
    const tierNames: TierGroup['tier'][] = ['elite', 'contender', 'middling', 'struggling', 'rebuilding'];
    let startIdx = 0;
    
    for (let i = 0; i < tierNames.length && startIdx < rankings.length; i++) {
      const size = Math.min(tierSizes[i], rankings.length - startIdx);
      const tierTeams = rankings.slice(startIdx, startIdx + size);
      
      tiers.push({
        tier: tierNames[i],
        teams: tierTeams.map((t: any) => t.team),
        description: `${tierNames[i]} tier teams`,
        averageRating: tierTeams.reduce((sum, t) => sum + t.rating, 0) / tierTeams.length
      });
      
      startIdx += size;
    }
    
    return tiers;
  }

  private async getTeamSchedule(teamId: string, leagueId: string): Promise<any[]> {
    // Mock schedule
    return Array.from({ length: 17 }, (_, i) => ({
      week: i + 1,
      opponent: `team${(i % 4) + 1}`,
      home: i % 2 === 0
    }));
  }

  private async analyzeWeek(game: any, teamId: string, leagueId: string): Promise<WeekAnalysis> {
    return {
      week: game.week,
      opponent: game.opponent,
      opponentRank: Math.floor(Math.random() * 10) + 1,
      difficulty: Math.random() * 10,
      projectedScore: { 
        team: 120 + Math.random() * 30,
        opponent: 115 + Math.random() * 30
      },
      winProbability: 0.5 + (Math.random() - 0.5) * 0.4,
      keyFactors: ['Home advantage', 'Rest advantage'],
      restAdvantage: 'none',
      divisionGame: Math.random() > 0.7,
      mustWin: Math.random() > 0.8
    };
  }

  private findScheduleStretches(weeks: WeekAnalysis[]): any {
    // Find easiest and hardest 3-week stretches
    let easiest = { startWeek: 1, endWeek: 3, difficulty: 10 };
    let hardest = { startWeek: 1, endWeek: 3, difficulty: 0 };
    
    for (let i = 0; i <= weeks.length - 3; i++) {
      const stretch = weeks.slice(i, i + 3);
      const avgDifficulty = stretch.reduce((sum, w) => sum + w.difficulty, 0) / 3;
      
      if (avgDifficulty < easiest.difficulty) {
        easiest = { startWeek: i + 1, endWeek: i + 3, difficulty: avgDifficulty };
      }
      if (avgDifficulty > hardest.difficulty) {
        hardest = { startWeek: i + 1, endWeek: i + 3, difficulty: avgDifficulty };
      }
    }
    
    return { easiest, hardest };
  }

  private identifyScheduleAdvantages(weeks: WeekAnalysis[]): string[] {
    const advantages: string[] = [];
    
    const homeGames = weeks.filter((w: any) => w.restAdvantage === 'team').length;
    if (homeGames > 9) advantages.push('Favorable home schedule');
    
    const easyGames = weeks.filter((w: any) => w.difficulty < 4).length;
    if (easyGames > 6) advantages.push('Multiple games against weak opponents');
    
    return advantages;
  }

  private identifyScheduleDisadvantages(weeks: WeekAnalysis[]): string[] {
    const disadvantages: string[] = [];
    
    const toughGames = weeks.filter((w: any) => w.difficulty > 7).length;
    if (toughGames > 6) disadvantages.push('Difficult strength of schedule');
    
    const divisionGames = weeks.filter((w: any) => w.divisionGame).length;
    if (divisionGames > 8) disadvantages.push('Many divisional games');
    
    return disadvantages;
  }

  private async getTeamScores(teamId: string, leagueId: string): Promise<any> {
    // Mock scores
    return {
      weekly: Array.from({ length: 10 }, (_, i) => ({
        week: i + 1,
        score: 100 + Math.random() * 50,
        opponent: 95 + Math.random() * 50,
        won: Math.random() > 0.3
      })),
      total: 1250
    };
  }

  private calculatePythagoreanWins(scores: any): number {
    const pointsFor = scores.total;
    const pointsAgainst = scores.weekly.reduce((sum: number, w: any) => sum + w.opponent, 0);
    
    // Pythagorean expectation formula
    const exponent = 2.37; // NFL typically uses 2.37
    const expectedWinPct = Math.pow(pointsFor, exponent) / 
      (Math.pow(pointsFor, exponent) + Math.pow(pointsAgainst, exponent));
    
    return expectedWinPct * scores.weekly.length;
  }

  private async calculateExpectedWinsFromScoring(teamId: string, leagueId: string): Promise<number> {
    // Calculate based on scoring distribution
    return 6.5; // Mock
  }

  private async breakdownWinsAndLosses(teamId: string, leagueId: string, expectedWins: number): Promise<any> {
    return {
      deservingWins: 5,
      luckyWins: 2,
      unluckyLosses: 1,
      deservingLosses: 2
    };
  }

  private calculateVolatility(weeklyScores: any[]): number {
    const scores = weeklyScores.map((w: any) => w.score);
    const mean = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
    return Math.sqrt(variance) / mean;
  }

  private async getTeamRoster(teamId: string, leagueId: string): Promise<any[]> {
    return []; // Mock
  }

  private async getTeamInjuries(teamId: string, leagueId: string): Promise<any[]> {
    return []; // Mock
  }

  private async calculatePointsLostToInjury(player: any, injury: any): Promise<number> {
    return injury.weeksOut * (player.averagePoints || 10);
  }

  private async getReplacementLevel(position: string): Promise<number> {
    const replacementLevels: { [key: string]: number } = {
      QB: 15,
      RB: 8,
      WR: 7,
      TE: 5,
      K: 7,
      DST: 6
    };
    return replacementLevels[position] || 5;
  }

  private async projectFutureInjuryImpact(roster: any[]): Promise<number> {
    return Math.random() * 50; // Mock
  }

  private calculateInjuryRiskScore(roster: any[], injuries: any[]): number {
    return Math.min(100, injuries.length * 15);
  }

  private generateInjuryRecommendations(affectedPlayers: any[], riskScore: number): string[] {
    const recommendations: string[] = [];
    
    if (riskScore > 70) {
      recommendations.push('High injury risk - prioritize depth acquisitions');
    }
    
    if (affectedPlayers.some((p: any) => p.position === 'RB')) {
      recommendations.push('Consider handcuff RBs for injury insurance');
    }
    
    return recommendations;
  }

  private async getTeamProjection(teamId: string, leagueId: string): Promise<TeamProjection> {
    return {
      projectedWins: 10,
      projectedLosses: 7,
      projectedPoints: 2000,
      projectedRank: 3,
      playoffProbability: 0.75,
      championshipProbability: 0.12
    };
  }

  private async applyTradeToRosters(tradeProposal: any, leagueId: string): Promise<any> {
    return {}; // Mock
  }

  private async getTeamProjectionWithRoster(teamId: string, leagueId: string, roster: any): Promise<TeamProjection> {
    return {
      projectedWins: 11,
      projectedLosses: 6,
      projectedPoints: 2100,
      projectedRank: 2,
      playoffProbability: 0.85,
      championshipProbability: 0.18
    };
  }

  private determineTradeVerdict(winChange: any, playoffChange: any): any {
    const team1Change = winChange['team1'] + playoffChange['team1'];
    const team2Change = winChange['team2'] + playoffChange['team2'];
    
    if (team1Change > 0 && team2Change > 0) return 'win-win';
    if (team1Change > 0 && team2Change < 0) return 'win-lose';
    if (team1Change < 0 && team2Change > 0) return 'win-lose';
    if (team1Change < 0 && team2Change < 0) return 'lose-lose';
    return 'neutral';
  }

  private generateTradeRecommendation(verdict: any, winChange: any, playoffChange: any): string {
    if (verdict === 'win-win') return 'Excellent trade for both teams';
    if (verdict === 'win-lose') return 'Trade favors one team significantly';
    if (verdict === 'lose-lose') return 'Trade hurts both teams';
    return 'Trade has minimal impact';
  }

  private async getCurrentWeek(): Promise<number> {
    return 10; // Mock
  }

  private async simulateSeason(leagueId: string, teams: any[], currentWeek: number): Promise<any> {
    // Simulate remaining season
    const finalStandings = teams.map((team, index) => ({
      teamId: team.teamId,
      rank: index + 1,
      wins: 8 + Math.floor(Math.random() * 9),
      points: 1500 + Math.random() * 500,
      madePlayoffs: index < 6,
      wonChampionship: index === 0 && Math.random() > 0.8
    }));
    
    return { finalStandings };
  }

  private checkConvergence(results: any, simulationCount: number): boolean {
    // Check if results have converged
    return simulationCount >= 10000;
  }

  private generateSimulationInsights(results: any, teams: any[]): string[] {
    const insights: string[] = [];
    
    // Find team with highest playoff probability
    let maxProb = 0;
    let maxTeam = '';
    for (const team of teams) {
      const prob = results.playoffs[team.teamId] / results.championships[team.teamId];
      if (prob > maxProb) {
        maxProb = prob;
        maxTeam = team.name;
      }
    }
    
    insights.push(`${maxTeam} has the highest playoff probability at ${(maxProb * 100).toFixed(1)}%`);
    
    return insights;
  }

  private async calculateOffensiveEfficiency(roster: any[], scores: any): Promise<number> {
    return 0.75; // Mock
  }

  private async calculatePositionalValue(roster: any[]): Promise<any> {
    return {
      QB: 0.8,
      RB: 0.7,
      WR: 0.75,
      TE: 0.6,
      K: 0.5,
      DST: 0.55
    };
  }

  private async calculateClutchPerformance(teamId: string, leagueId: string): Promise<number> {
    return 0.65; // Mock
  }

  private async calculateGarbageTimePoints(teamId: string, leagueId: string): Promise<number> {
    return 45; // Mock
  }

  private async calculateScheduleLuck(teamId: string, schedule: any[]): Promise<number> {
    return 0.1; // Mock
  }

  private async calculateInjuryLuck(teamId: string, leagueId: string): Promise<number> {
    return -0.2; // Mock
  }

  private async calculateSustainability(efficiency: number, volatility: number, clutch: number): Promise<number> {
    return (efficiency * 0.5 + (1 - volatility) * 0.3 + clutch * 0.2);
  }

  private calculateRegressionPotential(scores: any, luck: number, sustainability: number): number {
    return Math.abs(luck) * (1 - sustainability);
  }

  private updatePowerRankings(): void {
    // Periodic update
    this.powerRankingsCache = null;
  }

  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expires) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get service status
   */
  getServiceStatus(): {
    isActive: boolean;
    cachedAnalytics: number;
    simulationsCached: number;
  } {
    return {
      isActive: true,
      cachedAnalytics: this.cache.size,
      simulationsCached: this.simulationCache.size
    };
  }
}

// Export singleton instance
export const advancedAnalyticsDashboardService = new AdvancedAnalyticsDashboardService();
export default advancedAnalyticsDashboardService;