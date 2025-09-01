/**
 * Secure Production Sports Data Service
 * All API calls routed through backend proxy - no API keys in frontend
 */

import { sportsDataService } from &apos;./secureApiClient&apos;;

// Data interfaces (same as before)
export interface NFLGame {
}
  id: string;
  date: string;
  week: number;
  season: number;
  status: &apos;scheduled&apos; | &apos;live&apos; | &apos;completed&apos;;
  homeTeam: NFLTeam;
  awayTeam: NFLTeam;
  homeScore?: number;
  awayScore?: number;
  venue: string;
  weather?: WeatherConditions;
  odds?: GameOdds;
}

export interface NFLTeam {
}
  id: string;
  name: string;
  abbreviation: string;
  location: string;
  logo: string;
  record: {
}
    wins: number;
    losses: number;
    ties: number;
  };
  stats?: TeamStats;
}

export interface NFLPlayer {
}
  id: string;
  name: string;
  position: string;
  team: string;
  jerseyNumber: number;
  stats: PlayerStats;
  injuryStatus?: &apos;healthy&apos; | &apos;questionable&apos; | &apos;doubtful&apos; | &apos;out&apos;;
  fantasyProjection?: number;
}

export interface PlayerStats {
}
  passingYards?: number;
  passingTouchdowns?: number;
  rushingYards?: number;
  rushingTouchdowns?: number;
  receivingYards?: number;
  receivingTouchdowns?: number;
  receptions?: number;
  fantasyPoints?: number;
  gamesPlayed?: number;
}

export interface TeamStats {
}
  pointsPerGame: number;
  pointsAllowed: number;
  yardsPerGame: number;
  yardsAllowed: number;
  turnoverDifferential: number;
  redZoneEfficiency: number;
  thirdDownConversion: number;
}

export interface GameOdds {
}
  spread: number;
  total: number;
  moneylineHome: number;
  moneylineAway: number;
  lastUpdated: string;
}

export interface WeatherConditions {
}
  temperature: number;
  conditions: string;
  windSpeed: number;
  precipitation: number;
  humidity: number;
}

export interface RealPrediction {
}
  id: string;
  week: number;
  season: number;
  gameId: string;
  type: &apos;spread&apos; | &apos;total&apos; | &apos;moneyline&apos; | &apos;player_prop&apos;;
  question: string;
  options: PredictionOption[];
  deadline: string;
  status: &apos;open&apos; | &apos;closed&apos; | &apos;resolved&apos;;
  resolution?: {
}
    result: number;
    actualValue?: number;
    resolvedAt: string;
  };
}

export interface PredictionOption {
}
  id: number;
  text: string;
  odds: number;
  probability: number;
}

/**
 * Secure Production Sports Data Service
 * All methods use backend proxy - no API keys exposed
 */
class SecureProductionSportsDataService {
}
  private cache = new Map<string, { data: any; expires: number }>();
  
  /**
   * Fetch current NFL games for a specific week
   */
  async getCurrentWeekGames(week: number = 1, season: number = 2024): Promise<NFLGame[]> {
}
    const cacheKey = `games_week_${week}_${season}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
}
      const response = await sportsDataService.getNFLGames(week, season);
      const games = response.data?.events?.map((event: any) => this.parseESPNGame(event)) || [];
      this.setCache(cacheKey, games, 5 * 60 * 1000); // 5 minutes
      return games;
    } catch (error) {
}
      console.error(&apos;Failed to fetch NFL games:&apos;, error);
      return [];
    }
  }

  /**
   * Fetch live game scores and updates
   */
  async getLiveScores(): Promise<NFLGame[]> {
}
    const cacheKey = &apos;live_scores&apos;;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
}
      const response = await sportsDataService.getNFLGames();
      const games = response.data?.events
        ?.filter((event: any) => {
}
          const status = event.competitions[0].status.type.name;
          return [&apos;STATUS_IN_PROGRESS&apos;, &apos;STATUS_HALFTIME&apos;, &apos;STATUS_END_PERIOD&apos;, &apos;STATUS_FINAL&apos;].includes(status);
        })
        .map((event: any) => this.parseESPNGame(event)) || [];
      
      this.setCache(cacheKey, games, 60 * 1000); // 1 minute
      return games;
    } catch (error) {
}
      console.error(&apos;Failed to fetch live scores:&apos;, error);
      return [];
    }
  }

  /**
   * Fetch detailed player information and stats
   */
  async getPlayerDetails(playerId: string): Promise<NFLPlayer | null> {
}
    const cacheKey = `player_${playerId}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
}
      const response = await sportsDataService.getPlayerDetails(playerId);
      const player = this.parseESPNPlayer(response.data);
      this.setCache(cacheKey, player, 60 * 60 * 1000); // 1 hour
      return player;
    } catch (error) {
}
      console.error(`Failed to fetch player ${playerId}:`, error);
      return null;
    }
  }

  /**
   * Fetch betting odds for games
   */
  async getGameOdds(gameDate?: string): Promise<GameOdds[]> {
}
    const cacheKey = `odds_${gameDate || &apos;current&apos;}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
}
      const response = await sportsDataService.getOdds();
      const odds = response.data?.map((game: any) => this.parseOddsData(game)) || [];
      this.setCache(cacheKey, odds, 2 * 60 * 1000); // 2 minutes
      return odds;
    } catch (error) {
}
      console.error(&apos;Failed to fetch odds:&apos;, error);
      return [];
    }
  }

  /**
   * Get API status and usage statistics
   */
  async getAPIStatus(): Promise<{ 
}
    isConnected: boolean; 
    services: { name: string; status: string; hasKey: boolean }[];
  }> {
}
    try {
}
      const status = await sportsDataService.checkStatus();
      return {
}
        isConnected: true,
        services: [
          { name: &apos;ESPN API&apos;, status: &apos;connected&apos;, hasKey: true },
          { name: &apos;The Odds API&apos;, status: status.odds ? &apos;connected&apos; : &apos;no_key&apos;, hasKey: status.odds },
          { name: &apos;Sports.io API&apos;, status: status.sportsio ? &apos;connected&apos; : &apos;no_key&apos;, hasKey: status.sportsio },
          { name: &apos;NFL API&apos;, status: status.nfl ? &apos;connected&apos; : &apos;no_key&apos;, hasKey: status.nfl }
        ]
      };
    } catch (error) {
}
      return {
}
        isConnected: false,
        services: []
      };
    }
  }

  // Cache helpers
  private getFromCache(key: string): any {
}
    const cached = this.cache.get(key);
    if (cached && Date.now() < cached.expires) {
}
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any, ttl: number): void {
}
    this.cache.set(key, { data, expires: Date.now() + ttl });
  }

  // Parsing helpers (same as original)
  private parseESPNGame(event: any): NFLGame {
}
    const competition = event.competitions[0];
    const homeTeam = competition.competitors.find((c: any) => c.homeAway === &apos;home&apos;);
    const awayTeam = competition.competitors.find((c: any) => c.homeAway === &apos;away&apos;);

    return {
}
      id: event.id,
      date: event.date,
      week: event.week?.number || 1,
      season: event.season?.year || new Date().getFullYear(),
      status: this.parseGameStatus(competition.status.type.name),
      homeTeam: this.parseTeam(homeTeam.team),
      awayTeam: this.parseTeam(awayTeam.team),
      homeScore: parseInt(homeTeam.score) || undefined,
      awayScore: parseInt(awayTeam.score) || undefined,
      venue: competition.venue?.fullName || &apos;&apos;,
      weather: this.parseWeather(competition.weather)
    };
  }

  private parseTeam(team: any): NFLTeam {
}
    return {
}
      id: team.id,
      name: team.displayName,
      abbreviation: team.abbreviation,
      location: team.location,
      logo: team.logo,
      record: {
}
        wins: parseInt(team.record?.items?.[0]?.stats?.find((s: any) => s.name === &apos;wins&apos;)?.value) || 0,
        losses: parseInt(team.record?.items?.[0]?.stats?.find((s: any) => s.name === &apos;losses&apos;)?.value) || 0,
        ties: parseInt(team.record?.items?.[0]?.stats?.find((s: any) => s.name === &apos;ties&apos;)?.value) || 0
      }
    };
  }

  private parseGameStatus(status: string): &apos;scheduled&apos; | &apos;live&apos; | &apos;completed&apos; {
}
    if (status.includes(&apos;FINAL&apos;) || status.includes(&apos;END&apos;)) return &apos;completed&apos;;
    if (status.includes(&apos;PROGRESS&apos;) || status.includes(&apos;HALFTIME&apos;)) return &apos;live&apos;;
    return &apos;scheduled&apos;;
  }

  private parseWeather(weather: any): WeatherConditions | undefined {
}
    if (!weather) return undefined;

    return {
}
      temperature: weather.temperature || 70,
      conditions: weather.conditionId || &apos;clear&apos;,
      windSpeed: weather.wind?.speed || 0,
      precipitation: weather.precipitation || 0,
      humidity: weather.humidity || 50
    };
  }

  private parseESPNPlayer(data: any): NFLPlayer {
}
    return {
}
      id: data.id,
      name: data.fullName || data.displayName,
      position: data.position?.abbreviation || &apos;UNKNOWN&apos;,
      team: data.team?.abbreviation || &apos;FA&apos;,
      jerseyNumber: data.jersey || 0,
      stats: this.parsePlayerStats(data.statistics),
      injuryStatus: this.parseInjuryStatus(data.injuries)
    };
  }

  private parsePlayerStats(statistics: any[]): PlayerStats {
}
    if (!statistics || !statistics.length) {
}
      return {};
    }

    const stats = statistics[0]?.stats || [];
    const statMap: Record<string, number> = {};
    
    stats.forEach((stat: any) => {
}
      statMap[stat.shortDisplayName] = parseFloat(stat.value) || 0;
    });

    return {
}
      passingYards: statMap[&apos;YDS&apos;] || statMap[&apos;PASS YDS&apos;],
      passingTouchdowns: statMap[&apos;TD&apos;] || statMap[&apos;PASS TD&apos;],
      rushingYards: statMap[&apos;RUSH YDS&apos;],
      rushingTouchdowns: statMap[&apos;RUSH TD&apos;],
      receivingYards: statMap[&apos;REC YDS&apos;],
      receivingTouchdowns: statMap[&apos;REC TD&apos;],
      receptions: statMap[&apos;REC&apos;],
      fantasyPoints: statMap[&apos;FPTS&apos;],
      gamesPlayed: statMap[&apos;GP&apos;]
    };
  }

  private parseInjuryStatus(injuries: any[]): &apos;healthy&apos; | &apos;questionable&apos; | &apos;doubtful&apos; | &apos;out&apos; {
}
    if (!injuries || !injuries.length) return &apos;healthy&apos;;
    
    const status = injuries[0]?.status?.toLowerCase() || &apos;healthy&apos;;
    if (status.includes(&apos;out&apos;)) return &apos;out&apos;;
    if (status.includes(&apos;doubtful&apos;)) return &apos;doubtful&apos;;
    if (status.includes(&apos;questionable&apos;)) return &apos;questionable&apos;;
    return &apos;healthy&apos;;
  }

  private parseOddsData(game: any): GameOdds {
}
    const h2h = game.bookmakers?.[0]?.markets?.find((m: any) => m.key === &apos;h2h&apos;);
    const spreads = game.bookmakers?.[0]?.markets?.find((m: any) => m.key === &apos;spreads&apos;);
    const totals = game.bookmakers?.[0]?.markets?.find((m: any) => m.key === &apos;totals&apos;);

    return {
}
      spread: parseFloat(spreads?.outcomes?.[0]?.point) || 0,
      total: parseFloat(totals?.outcomes?.[0]?.point) || 0,
      moneylineHome: h2h?.outcomes?.find((o: any) => o.name === &apos;home&apos;)?.price || 0,
      moneylineAway: h2h?.outcomes?.find((o: any) => o.name === &apos;away&apos;)?.price || 0,
      lastUpdated: game.commence_time || new Date().toISOString()
    };
  }
}

// Export singleton instance
export const secureProductionSportsDataService = new SecureProductionSportsDataService();
export default secureProductionSportsDataService;