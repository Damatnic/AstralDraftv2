/**
 * CORE FANTASY DATA SERVICE
 * Consolidated service for all fantasy football data operations
 * Replaces multiple scattered services with a unified API
 */

import { Player, Team, League, DraftPick, Trade, WaiverClaim, Matchup } from &apos;../../types&apos;;

// Service imports for gradual migration
import { apiClient } from &apos;../apiClient&apos;;
import { cacheService } from &apos;../enhancedCacheService&apos;;
import { logger } from &apos;../loggingService&apos;;

/**
 * Service Configuration
 */
interface ServiceConfig {
}
  cacheEnabled: boolean;
  cacheDuration: number;
  retryAttempts: number;
  timeout: number;
}

/**
 * Player Statistics Interface
 */
export interface PlayerStats {
}
  playerId: string;
  season: number;
  week?: number;
  passingYards?: number;
  passingTDs?: number;
  rushingYards?: number;
  rushingTDs?: number;
  receivingYards?: number;
  receivingTDs?: number;
  targets?: number;
  receptions?: number;
  fantasyPoints: number;
  projectedPoints?: number;
}

/**
 * Advanced Metrics Interface
 */
export interface AdvancedMetrics {
}
  targetShare: number;
  redZoneTargets: number;
  airYards: number;
  yardsAfterCatch: number;
  opportunityShare: number;
  snapCount: number;
  snapPercentage: number;
  routesRun: number;
  averageDepthOfTarget: number;
}

/**
 * MAIN FANTASY DATA SERVICE CLASS
 */
class FantasyDataService {
}
  private config: ServiceConfig;
  private cache: Map<string, { data: any; timestamp: number }>;

  constructor() {
}
    this.config = {
}
      cacheEnabled: true,
      cacheDuration: 5 * 60 * 1000, // 5 minutes
      retryAttempts: 3,
      timeout: 10000
    };
    this.cache = new Map();
  }

  // ===============================
  // PLAYER DATA OPERATIONS
  // ===============================

  /**
   * Get all players with optional filters
   */
  async getPlayers(filters?: {
}
    position?: string;
    team?: string;
    status?: string;
    searchTerm?: string;
  }): Promise<Player[]> {
}
    const cacheKey = `players_${JSON.stringify(filters || {})}`;
    
    // Check cache first
    const cached = await this.getCached(cacheKey);
    if (cached) return cached;

    try {
}
      const response = await apiClient.get(&apos;/api/players&apos;, { params: filters });
      const players = response.data;
      
      // Cache the result
      await this.setCache(cacheKey, players);
      
      return players;
    } catch (error) {
}
      logger.error(&apos;Failed to fetch players&apos;, error);
      throw new Error(&apos;Unable to retrieve player data&apos;);
    }
  }

  /**
   * Get detailed player information
   */
  async getPlayerDetails(playerId: string): Promise<Player & {
}
    stats: PlayerStats;
    advancedMetrics: AdvancedMetrics;
    schedule: any[];
    news: any[];
  }> {
}
    const cacheKey = `player_${playerId}`;
    const cached = await this.getCached(cacheKey);
    if (cached) return cached;

    try {
}
      const [player, stats, metrics, schedule, news] = await Promise.all([
        apiClient.get(`/api/players/${playerId}`),
        apiClient.get(`/api/players/${playerId}/stats`),
        apiClient.get(`/api/players/${playerId}/metrics`),
        apiClient.get(`/api/players/${playerId}/schedule`),
        apiClient.get(`/api/players/${playerId}/news`)
      ]);

      const details = {
}
        ...player.data,
        stats: stats.data,
        advancedMetrics: metrics.data,
        schedule: schedule.data,
        news: news.data
      };

      await this.setCache(cacheKey, details);
      return details;
    } catch (error) {
}
      logger.error(`Failed to fetch player details for ${playerId}`, error);
      throw error;
    }
  }

  /**
   * Get player projections
   */
  async getPlayerProjections(
    playerId: string,
    week?: number,
    season?: number
  ): Promise<PlayerStats> {
}
    const cacheKey = `projections_${playerId}_${week}_${season}`;
    const cached = await this.getCached(cacheKey);
    if (cached) return cached;

    try {
}
      const response = await apiClient.get(`/api/projections/${playerId}`, {
}
        params: { week, season }
      });
      
      await this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
}
      logger.error(`Failed to fetch projections for player ${playerId}`, error);
      throw error;
    }
  }

  /**
   * Search players with advanced filters
   */
  async searchPlayers(
    query: string,
    options?: {
}
      position?: string[];
      minProjectedPoints?: number;
      maxProjectedPoints?: number;
      availability?: &apos;all&apos; | &apos;available&apos; | &apos;rostered&apos;;
      injuryStatus?: string[];
    }
  ): Promise<Player[]> {
}
    try {
}
      const response = await apiClient.post(&apos;/api/players/search&apos;, {
}
        query,
        ...options
      });
      return response.data;
    } catch (error) {
}
      logger.error(&apos;Player search failed&apos;, error);
      throw error;
    }
  }

  // ===============================
  // TEAM & LEAGUE OPERATIONS
  // ===============================

  /**
   * Get league information
   */
  async getLeague(leagueId: string): Promise<League> {
}
    const cacheKey = `league_${leagueId}`;
    const cached = await this.getCached(cacheKey);
    if (cached) return cached;

    try {
}
      const response = await apiClient.get(`/api/leagues/${leagueId}`);
      await this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
}
      logger.error(`Failed to fetch league ${leagueId}`, error);
      throw error;
    }
  }

  /**
   * Get team roster and details
   */
  async getTeam(teamId: string): Promise<Team> {
}
    const cacheKey = `team_${teamId}`;
    const cached = await this.getCached(cacheKey);
    if (cached) return cached;

    try {
}
      const response = await apiClient.get(`/api/teams/${teamId}`);
      await this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
}
      logger.error(`Failed to fetch team ${teamId}`, error);
      throw error;
    }
  }

  /**
   * Get league standings
   */
  async getStandings(leagueId: string): Promise<any[]> {
}
    const cacheKey = `standings_${leagueId}`;
    const cached = await this.getCached(cacheKey);
    if (cached) return cached;

    try {
}
      const response = await apiClient.get(`/api/leagues/${leagueId}/standings`);
      await this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
}
      logger.error(`Failed to fetch standings for league ${leagueId}`, error);
      throw error;
    }
  }

  // ===============================
  // MATCHUP & SCORING OPERATIONS
  // ===============================

  /**
   * Get current week matchups
   */
  async getMatchups(leagueId: string, week?: number): Promise<Matchup[]> {
}
    const cacheKey = `matchups_${leagueId}_${week}`;
    const cached = await this.getCached(cacheKey);
    if (cached) return cached;

    try {
}
      const response = await apiClient.get(`/api/leagues/${leagueId}/matchups`, {
}
        params: { week }
      });
      await this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
}
      logger.error(`Failed to fetch matchups for league ${leagueId}`, error);
      throw error;
    }
  }

  /**
   * Get live scoring updates
   */
  async getLiveScores(leagueId: string): Promise<any> {
}
    // Don&apos;t cache live scores
    try {
}
      const response = await apiClient.get(`/api/leagues/${leagueId}/live-scores`);
      return response.data;
    } catch (error) {
}
      logger.error(&apos;Failed to fetch live scores&apos;, error);
      throw error;
    }
  }

  /**
   * Calculate projected score for lineup
   */
  async calculateProjectedScore(
    lineup: string[],
    week: number,
    scoringSettings: any
  ): Promise<number> {
}
    try {
}
      const projections = await Promise.all(
        lineup.map((playerId: any) => this.getPlayerProjections(playerId, week))
      );

      return projections.reduce((total, proj) => {
}
        return total + (proj?.fantasyPoints || 0);
      }, 0);
    } catch (error) {
}
      logger.error(&apos;Failed to calculate projected score&apos;, error);
      throw error;
    }
  }

  // ===============================
  // TRANSACTION OPERATIONS
  // ===============================

  /**
   * Submit a trade proposal
   */
  async proposeTrade(trade: Partial<Trade>): Promise<Trade> {
}
    try {
}
      const response = await apiClient.post(&apos;/api/trades&apos;, trade);
      return response.data;
    } catch (error) {
}
      logger.error(&apos;Failed to propose trade&apos;, error);
      throw error;
    }
  }

  /**
   * Get trade history
   */
  async getTradeHistory(leagueId: string): Promise<Trade[]> {
}
    const cacheKey = `trades_${leagueId}`;
    const cached = await this.getCached(cacheKey);
    if (cached) return cached;

    try {
}
      const response = await apiClient.get(`/api/leagues/${leagueId}/trades`);
      await this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
}
      logger.error(&apos;Failed to fetch trade history&apos;, error);
      throw error;
    }
  }

  /**
   * Submit waiver claim
   */
  async submitWaiverClaim(claim: Partial<WaiverClaim>): Promise<WaiverClaim> {
}
    try {
}
      const response = await apiClient.post(&apos;/api/waivers&apos;, claim);
      return response.data;
    } catch (error) {
}
      logger.error(&apos;Failed to submit waiver claim&apos;, error);
      throw error;
    }
  }

  /**
   * Get waiver wire players
   */
  async getWaiverWire(leagueId: string): Promise<Player[]> {
}
    const cacheKey = `waivers_${leagueId}`;
    const cached = await this.getCached(cacheKey);
    if (cached) return cached;

    try {
}
      const response = await apiClient.get(`/api/leagues/${leagueId}/waiver-wire`);
      await this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
}
      logger.error(&apos;Failed to fetch waiver wire&apos;, error);
      throw error;
    }
  }

  // ===============================
  // DRAFT OPERATIONS
  // ===============================

  /**
   * Get draft board
   */
  async getDraftBoard(draftId: string): Promise<DraftPick[]> {
}
    const cacheKey = `draft_${draftId}`;
    const cached = await this.getCached(cacheKey);
    if (cached) return cached;

    try {
}
      const response = await apiClient.get(`/api/drafts/${draftId}/board`);
      await this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
}
      logger.error(&apos;Failed to fetch draft board&apos;, error);
      throw error;
    }
  }

  /**
   * Make draft pick
   */
  async makeDraftPick(
    draftId: string,
    playerId: string,
    teamId: string
  ): Promise<DraftPick> {
}
    try {
}
      const response = await apiClient.post(`/api/drafts/${draftId}/pick`, {
}
        playerId,
//         teamId
      });
      
      // Invalidate draft cache
      this.invalidateCache(`draft_${draftId}`);
      
      return response.data;
    } catch (error) {
}
      logger.error(&apos;Failed to make draft pick&apos;, error);
      throw error;
    }
  }

  /**
   * Get draft rankings
   */
  async getDraftRankings(
    format: &apos;standard&apos; | &apos;ppr&apos; | &apos;half-ppr&apos; = &apos;ppr&apos;
  ): Promise<Player[]> {
}
    const cacheKey = `rankings_${format}`;
    const cached = await this.getCached(cacheKey);
    if (cached) return cached;

    try {
}
      const response = await apiClient.get(&apos;/api/rankings&apos;, {
}
        params: { format }
      });
      await this.setCache(cacheKey, response.data, 60 * 60 * 1000); // Cache for 1 hour
      return response.data;
    } catch (error) {
}
      logger.error(&apos;Failed to fetch draft rankings&apos;, error);
      throw error;
    }
  }

  // ===============================
  // ANALYTICS & INSIGHTS
  // ===============================

  /**
   * Get power rankings for league
   */
  async getPowerRankings(leagueId: string): Promise<any[]> {
}
    const cacheKey = `power_rankings_${leagueId}`;
    const cached = await this.getCached(cacheKey);
    if (cached) return cached;

    try {
}
      const response = await apiClient.get(`/api/leagues/${leagueId}/power-rankings`);
      await this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
}
      logger.error(&apos;Failed to fetch power rankings&apos;, error);
      throw error;
    }
  }

  /**
   * Get playoff probabilities
   */
  async getPlayoffProbabilities(leagueId: string): Promise<any> {
}
    const cacheKey = `playoff_prob_${leagueId}`;
    const cached = await this.getCached(cacheKey);
    if (cached) return cached;

    try {
}
      const response = await apiClient.get(`/api/leagues/${leagueId}/playoff-probabilities`);
      await this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
}
      logger.error(&apos;Failed to fetch playoff probabilities&apos;, error);
      throw error;
    }
  }

  /**
   * Get strength of schedule
   */
  async getStrengthOfSchedule(
    teamId: string,
    weeks?: { start: number; end: number }
  ): Promise<any> {
}
    try {
}
      const response = await apiClient.get(`/api/teams/${teamId}/strength-of-schedule`, {
}
        params: weeks
      });
      return response.data;
    } catch (error) {
}
      logger.error(&apos;Failed to fetch strength of schedule&apos;, error);
      throw error;
    }
  }

  // ===============================
  // CACHE MANAGEMENT
  // ===============================

  private async getCached(key: string): Promise<any | null> {
}
    if (!this.config.cacheEnabled) return null;

    // Check in-memory cache first
    const memCached = this.cache.get(key);
    if (memCached && Date.now() - memCached.timestamp < this.config.cacheDuration) {
}
      return memCached.data;
    }

    // Check persistent cache
    try {
}
      return await cacheService.get(key);
    } catch {
}
      return null;
    }
  }

  private async setCache(
    key: string,
    data: any,
    duration?: number
  ): Promise<void> {
}
    if (!this.config.cacheEnabled) return;

    const ttl = duration || this.config.cacheDuration;

    // Set in-memory cache
    this.cache.set(key, {
}
      data,
      timestamp: Date.now()
    });

    // Set persistent cache
    try {
}
      await cacheService.set(key, data, ttl);
    } catch (error) {
}
      logger.warn(&apos;Failed to set cache&apos;, error);
    }
  }

  private invalidateCache(pattern: string): void {
}
    // Clear matching keys from in-memory cache
    for (const key of this.cache.keys()) {
}
      if (key.includes(pattern)) {
}
        this.cache.delete(key);
      }
    }

    // Clear from persistent cache
    cacheService.invalidate(pattern);
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
}
    this.cache.clear();
    cacheService.clear();
    logger.info(&apos;All cache cleared&apos;);
  }

  /**
   * Update service configuration
   */
  updateConfig(config: Partial<ServiceConfig>): void {
}
    this.config = { ...this.config, ...config };
    logger.info(&apos;Service configuration updated&apos;, config);
  }
}

// Export singleton instance
export const fantasyDataService = new FantasyDataService();

// Export type definitions
export type { Player, Team, League, DraftPick, Trade, WaiverClaim, Matchup };