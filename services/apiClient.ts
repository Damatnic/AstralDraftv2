/**
 * API Client for Astral Draft Fantasy Football Application
 * Handles all external API calls and data fetching
 */

import { logger } from &apos;./loggingService&apos;;

// SportsIO API Interfaces
interface SportsIOGame {
}
  game_id: string;
  date: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  status: &apos;scheduled&apos; | &apos;in_progress&apos; | &apos;completed&apos;;
  quarter?: number;
  time_remaining?: string;
}

interface SportsIOPlayer {
}
  player_id: string;
  name: string;
  position: string;
  team: string;
  injury_status?: string;
  stats: {
}
    passing_yards?: number;
    passing_tds?: number;
    rushing_yards?: number;
    rushing_tds?: number;
    receiving_yards?: number;
    receiving_tds?: number;
    fantasy_points?: number;
  };
}

// ESPN API Interfaces
interface ESPNPlayer {
}
  id: number;
  fullName: string;
  defaultPositionId: number;
  proTeamId: number;
  stats?: unknown[];
  ownership?: {
}
    percentOwned: number;
    percentStarted: number;
  };
}

interface ESPNResponse {
}
  players: ESPNPlayer[];
}

// Transformed Player Interface (Unified)
interface Player {
}
  id: string;
  name: string;
  position: string;
  team: string;
  fantasyPoints?: number;
  projectedPoints?: number;
  injuryStatus?: string;
  ownership?: {
}
    percentOwned: number;
    percentStarted: number;
  };
  stats?: unknown;
}

class ApiClient {
}
  private readonly baseUrl: string;
  private readonly espnApiKey?: string;
  private readonly nflApiKey?: string;
  private readonly yahooApiKey?: string;
  private readonly sportsIOApiKey?: string;
  private readonly rateLimiter: Map<string, number> = new Map();
  private readonly requestQueue: Array<() => Promise<unknown>> = [];

  constructor() {
}
    const env = (import.meta as unknown as { env: Record<string, unknown> }).env;
    this.baseUrl = env?.VITE_API_BASE_URL as string || &apos;http://localhost:3001&apos;;
    this.espnApiKey = env?.VITE_ESPN_API_KEY as string;
    this.nflApiKey = env?.VITE_NFL_API_KEY as string;
    this.yahooApiKey = env?.VITE_YAHOO_API_KEY as string;
    this.sportsIOApiKey = env?.VITE_SPORTS_IO_API_KEY as string;
  }

  /**
   * Rate limiting helper
   */
  private async checkRateLimit(endpoint: string, limit: number = 60): Promise<void> {
}
    const now = Date.now();
    const windowStart = Math.floor(now / 60000) * 60000; // 1-minute window
    const key = `${endpoint}:${windowStart}`;
    
    const requests = this.rateLimiter.get(key) || 0;
    if (requests >= limit) {
}
      const waitTime = 60000 - (now - windowStart);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.rateLimiter.set(key, requests + 1);
  }

  /**
   * Enhanced fetch with authentication and error handling
   */
  private async secureFetch(url: string, options: RequestInit = {}): Promise<Response> {
}
    const defaultOptions: RequestInit = {
}
      headers: {
}
        &apos;Accept&apos;: &apos;application/json&apos;,
        &apos;Content-Type&apos;: &apos;application/json&apos;,
        &apos;X-App-Name&apos;: &apos;AstralDraft&apos;,
        &apos;X-App-Version&apos;: &apos;1.0&apos;,
        ...options.headers
      },
      ...options
    };

    return await this.withRetry(async () => {
}
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
}
        const errorBody = await response.text().catch(() => &apos;Unknown error&apos;);
        throw new Error(`HTTP ${response.status}: ${errorBody}`);
      }
      
      return response;
    });
  }

  /**
   * SportsIO API Integration (Primary Data Source)
   */
  async getSportsIOGames(week?: number): Promise<SportsIOGame[]> {
}
    try {
}
      if (!this.sportsIOApiKey) {
}
        console.warn(&apos;Sports.io API key not configured&apos;);
        return [];
      }

      let url = &apos;https://api.sportsio.io/nfl/games&apos;;
      if (week) {
}
        url += `?week=${week}`;
      }
      
      const response = await fetch(url, {
}
        headers: {
}
          &apos;Accept&apos;: &apos;application/json&apos;,
          &apos;Authorization&apos;: `Bearer ${this.sportsIOApiKey}`
        }
      });

      if (!response.ok) {
}
        throw new Error(`SportsIO API error: ${response.status}`);
      }

      const data = await response.json();
      return data.games || [];
    } catch (error) {
}
      console.error(&apos;Failed to fetch SportsIO games:&apos;, error);
      return [];
    }
  }

  async getSportsIOPlayers(position?: string): Promise<SportsIOPlayer[]> {
}
    try {
}
      if (!this.sportsIOApiKey) {
}
        console.warn(&apos;Sports.io API key not configured&apos;);
        return [];
      }

      let url = &apos;https://api.sportsio.io/nfl/players&apos;;
      if (position) {
}
        url += `?position=${position}`;
      }
      
      const response = await fetch(url, {
}
        headers: {
}
          &apos;Accept&apos;: &apos;application/json&apos;,
          &apos;Authorization&apos;: `Bearer ${this.sportsIOApiKey}`
        }
      });

      if (!response.ok) {
}
        throw new Error(`SportsIO API error: ${response.status}`);
      }

      const data = await response.json();
      return data.players || [];
    } catch (error) {
}
      console.error(&apos;Failed to fetch SportsIO players:&apos;, error);
      return [];
    }
  }

  async getSportsIOLiveScores(): Promise<SportsIOGame[]> {
}
    try {
}
      const url = &apos;https://api.sportsio.io/nfl/games/live&apos;;
      
      const response = await fetch(url, {
}
        headers: {
}
          &apos;Accept&apos;: &apos;application/json&apos;,
          &apos;Authorization&apos;: `Bearer ${this.sportsIOApiKey}`
        }
      });

      if (!response.ok) {
}
        throw new Error(`SportsIO API error: ${response.status}`);
      }

      const data = await response.json();
      return data.games || [];
    } catch (error) {
}
      console.error(&apos;Failed to fetch live scores:&apos;, error);
      return [];
    }
  }

  /**
   * ESPN Fantasy API Integration (Backup Data Source)
   */
  async getESPNPlayers(leagueId?: string): Promise<Player[]> {
}
    // ESPN API completely disabled to prevent CORS and 404 errors
    console.log(&apos;ℹ️ ESPN Players API disabled - preventing network errors&apos;);
    return [];
  }

  async getESPNLeagueInfo(leagueId: string): Promise<unknown> {
}
    // ESPN API completely disabled to prevent CORS and 404 errors
    console.log(&apos;ℹ️ ESPN League API disabled - preventing network errors&apos;);
    return { disabled: true, reason: &apos;ESPN API disabled for error prevention&apos; };
  }

  /**
   * Live Data Integration
   */
  async getLiveScores(): Promise<SportsIOGame[]> {
}
    // Primary: Try SportsIO
    const sportsIOScores = await this.getSportsIOLiveScores();
    if (sportsIOScores.length > 0) {
}
      return sportsIOScores;
    }

    // Fallback: Try other sources
    console.warn(&apos;SportsIO unavailable, using fallback data sources&apos;);
    return [];
  }

  async getPlayerUpdates(position?: string): Promise<Player[]> {
}
    // Primary: Try SportsIO
    const sportsIOPlayers = await this.getSportsIOPlayers(position);
    if (sportsIOPlayers.length > 0) {
}
      // Transform SportsIO to unified Player interface
      return sportsIOPlayers.map((player: any) => ({
}
        id: player.player_id,
        name: player.name,
        position: player.position,
        team: player.team,
        fantasyPoints: player.stats.fantasy_points,
        injuryStatus: player.injury_status,
        stats: player.stats
      }));
    }

    // ESPN fallback disabled - return empty array to prevent 404 errors
    console.log(&apos;ℹ️ ESPN fallback disabled - using SportsData.io only&apos;);
    return [];
  }

  /**
   * Utility methods for data transformation
   */
  private getPositionName(positionId: number): string {
}
    const positions: { [key: number]: string } = {
}
      1: &apos;QB&apos;,
      2: &apos;RB&apos;,
      3: &apos;WR&apos;,
      4: &apos;TE&apos;,
      5: &apos;K&apos;,
      16: &apos;DST&apos;
    };
    return positions[positionId] || &apos;UNKNOWN&apos;;
  }

  private getTeamName(teamId: number): string {
}
    const teams: { [key: number]: string } = {
}
      1: &apos;ATL&apos;, 2: &apos;BUF&apos;, 3: &apos;CHI&apos;, 4: &apos;CIN&apos;, 5: &apos;CLE&apos;, 6: &apos;DAL&apos;,
      7: &apos;DEN&apos;, 8: &apos;DET&apos;, 9: &apos;GB&apos;, 10: &apos;TEN&apos;, 11: &apos;IND&apos;, 12: &apos;KC&apos;,
      13: &apos;LV&apos;, 14: &apos;LAR&apos;, 15: &apos;MIA&apos;, 16: &apos;MIN&apos;, 17: &apos;NE&apos;, 18: &apos;NO&apos;,
      19: &apos;NYG&apos;, 20: &apos;NYJ&apos;, 21: &apos;PHI&apos;, 22: &apos;ARI&apos;, 23: &apos;PIT&apos;, 24: &apos;LAC&apos;,
      25: &apos;SF&apos;, 26: &apos;SEA&apos;, 27: &apos;TB&apos;, 28: &apos;WAS&apos;, 29: &apos;CAR&apos;, 30: &apos;JAX&apos;,
      33: &apos;BAL&apos;, 34: &apos;HOU&apos;
    };
    return teams[teamId] || &apos;UNKNOWN&apos;;
  }

  /**
   * Real-time data polling
   */
  async startLiveUpdates(callback: (data: unknown) => void): Promise<void> {
}
    const updateInterval = 30000; // 30 seconds

    const pollUpdates = async () => {
}
      try {
}
        const [scores, players] = await Promise.all([
          this.getLiveScores(),
          this.getPlayerUpdates()
        ]);

        callback({
}
          scores,
          players,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
}
        console.error(&apos;Error polling live updates:&apos;, error);
      }
    };

    // Initial fetch
    await pollUpdates();

    // Set up interval
    setInterval(pollUpdates, updateInterval);
  }

  /**
   * Oracle Predictions API Integration (Production)
   */
  async getProductionOraclePredictions(week?: number, season?: number): Promise<unknown> {
}
    try {
}
      const cacheKey = `oracle_predictions_${week || &apos;current&apos;}_${season || 2024}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) {
}
        return cached;
      }

      let url = &apos;/api/oracle/predictions/production&apos;;
      const params = new URLSearchParams();
      
      if (week) params.append(&apos;week&apos;, String(week));
      if (season) params.append(&apos;season&apos;, String(season));
      
      if (params.toString()) {
}
        url += `?${params.toString()}`;
      }

      const response = await this.secureFetch(url);
      const data = await response.json();

      if (data.success) {
}
        this.setCachedData(cacheKey, data);
        logger.info(`✅ Fetched ${data.data.predictions.length} production Oracle predictions`);
        return data;
      } else {
}
        throw new Error(data.error || &apos;Failed to fetch Oracle predictions&apos;);
      }
    } catch (error) {
}
      console.error(&apos;❌ Failed to fetch production Oracle predictions:&apos;, error);
      throw error;
    }
  }

  async submitProductionOraclePrediction(
    predictionId: string, 
    userChoice: number, 
    confidence: number
  ): Promise<unknown> {
}
    try {
}
      const url = `/api/oracle/predictions/production/${predictionId}/submit`;
      
      const response = await this.secureFetch(url, {
}
        method: &apos;POST&apos;,
        body: JSON.stringify({
}
          userChoice,
//           confidence
        })
      });

      const data = await response.json();

      if (data.success) {
}
        logger.info(`✅ Successfully submitted production Oracle prediction: ${predictionId}`);
        return data;
      } else {
}
        throw new Error(data.error || &apos;Failed to submit prediction&apos;);
      }
    } catch (error) {
}
      console.error(&apos;❌ Failed to submit production Oracle prediction:&apos;, error);
      throw error;
    }
  }

  async generateProductionOraclePredictions(week: number, season?: number): Promise<unknown> {
}
    try {
}
      const url = &apos;/api/oracle/predictions/production/generate&apos;;
      
      const response = await this.secureFetch(url, {
}
        method: &apos;POST&apos;,
        body: JSON.stringify({
}
          week,
          season: season || 2024
        })
      });

      const data = await response.json();

      if (data.success) {
}
        logger.info(`✅ Generated ${data.data.predictions.length} production Oracle predictions`);
        return data;
      } else {
}
        throw new Error(data.error || &apos;Failed to generate predictions&apos;);
      }
    } catch (error) {
}
      console.error(&apos;❌ Failed to generate production Oracle predictions:&apos;, error);
      throw error;
    }
  }

  async resolveProductionOraclePredictions(week: number, season?: number): Promise<unknown> {
}
    try {
}
      const url = &apos;/api/oracle/predictions/production/resolve&apos;;
      
      const response = await this.secureFetch(url, {
}
        method: &apos;POST&apos;,
        body: JSON.stringify({
}
          week,
          season: season || 2024
        })
      });

      const data = await response.json();

      if (data.success) {
}
        logger.info(`✅ Resolved ${data.data.resolvedCount} production Oracle predictions`);
        return data;
      } else {
}
        throw new Error(data.error || &apos;Failed to resolve predictions&apos;);
      }
    } catch (error) {
}
      console.error(&apos;❌ Failed to resolve production Oracle predictions:&apos;, error);
      throw error;
    }
  }

  /**
   * Cache management for performance
   */
  private readonly cache = new Map<string, { data: unknown; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private getCachedData(key: string): unknown {
}
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
}
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: unknown): void {
}
    this.cache.set(key, {
}
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Error handling and retry logic
   */
  private async withRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
}
    for (let i = 0; i < maxRetries; i++) {
}
      try {
}
        return await fn();
      } catch (error) {
}
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
    throw new Error(&apos;Max retries exceeded&apos;);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;