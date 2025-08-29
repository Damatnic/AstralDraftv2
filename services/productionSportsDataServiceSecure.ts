/**
 * Secure Production Sports Data Service
 * All API calls routed through backend proxy - no API keys in frontend
 */

import { sportsDataService } from './secureApiClient';

// Data interfaces
export interface NFLGame {
  id: string;
  date: string;
  week: number;
  season: number;
  status: 'scheduled' | 'live' | 'completed';
  homeTeam: NFLTeam;
  awayTeam: NFLTeam;
  homeScore?: number;
  awayScore?: number;
  venue: string;
  weather?: WeatherConditions;
  odds?: GameOdds;
}

export interface NFLTeam {
  id: string;
  name: string;
  abbreviation: string;
  location: string;
  logo: string;
  record: {
    wins: number;
    losses: number;
    ties: number;
  };
  stats?: TeamStats;
}

export interface NFLPlayer {
  id: string;
  name: string;
  position: string;
  team: string;
  jerseyNumber: number;
  stats: PlayerStats;
  injuryStatus?: 'healthy' | 'questionable' | 'doubtful' | 'out';
  fantasyProjection?: number;
}

export interface PlayerStats {
  passingYards?: number;
  passingTouchdowns?: number;
  interceptions?: number;
  rushingYards?: number;
  rushingTouchdowns?: number;
  receptions?: number;
  receivingYards?: number;
  receivingTouchdowns?: number;
  fantasyPoints?: number;
}

export interface TeamStats {
  pointsFor: number;
  pointsAgainst: number;
  totalYards: number;
  passingYards: number;
  rushingYards: number;
  turnovers: number;
}

export interface WeatherConditions {
  temperature: number;
  condition: string;
  windSpeed: number;
  humidity: number;
}

export interface GameOdds {
  spread: number;
  total: number;
  moneylineHome: number;
  moneylineAway: number;
  lastUpdated: string;
}

export interface InjuryReport {
  playerId: string;
  playerName: string;
  position: string;
  team: string;
  injuryStatus: 'healthy' | 'questionable' | 'doubtful' | 'out';
  injury: string;
  dateReported: string;
  weeklyStatus?: {
    week: number;
    status: string;
    practiceStatus: string[];
    resolvedAt: string;
  };
}

export interface PredictionOption {
  id: number;
  text: string;
  odds: number;
  probability: number;
}

// ESPN API response types
interface ESPNEvent {
  id: string;
  date: string;
  week?: { number: number };
  season?: { year: number };
  status: { type: { name: string; state: string } };
  competitions: ESPNCompetition[];
  venue?: { fullName: string };
  weather?: ESPNWeather;
}

interface ESPNCompetition {
  id: string;
  competitors: ESPNCompetitor[];
  status: { type: { name: string } };
  venue?: { fullName: string };
}

interface ESPNCompetitor {
  id: string;
  team: ESPNTeam;
  homeAway: 'home' | 'away';
  score?: string;
  record?: { items: Array<{ stats: Array<{ name: string; value: string }> }> };
}

interface ESPNTeam {
  id: string;
  name: string;
  abbreviation: string;
  location: string;
  logos?: Array<{ href: string }>;
}

interface ESPNWeather {
  temperature: number;
  conditionId: string;
  condition: string;
  windSpeed: number;
  humidity: number;
}

interface ESPNPlayerData {
  id: string;
  fullName: string;
  position: { abbreviation: string };
  team: { abbreviation: string };
  jersey: string;
  statistics?: ESPNPlayerStats[];
  injuries?: Array<{ status: string; type: string }>;
}

interface ESPNPlayerStats {
  splits: { categories: Array<{ stats: Array<{ name: string; value: number }> }> };
}

interface OddsGame {
  id: string;
  commence_time: string;
  bookmakers?: Array<{
    markets: Array<{
      key: string;
      outcomes: Array<{
        name: string;
        price?: number;
        point?: string;
      }>;
    }>;
  }>;
}

interface CacheEntry<T> {
  data: T;
  expires: number;
}

/**
 * Secure Production Sports Data Service
 * All methods use backend proxy - no API keys exposed
 */
class SecureProductionSportsDataService {
  private cache = new Map<string, CacheEntry<unknown>>();
  
  /**
   * Fetch current NFL games for a specific week
   */
  async getCurrentWeekGames(week: number = 1, season: number = 2024): Promise<NFLGame[]> {
    const cacheKey = `games_week_${week}_${season}`;
    const cached = this.getFromCache<NFLGame[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await sportsDataService.getNFLGames(week, season);
      const events = response.data?.events as ESPNEvent[] | undefined;
      const games = events?.map((event: ESPNEvent) => this.parseESPNGame(event)) || [];
      this.setCache(cacheKey, games, 5 * 60 * 1000); // 5 minutes
      return games;
    } catch {
      console.error('Failed to fetch NFL games');
      return [];
    }
  }

  /**
   * Fetch live game scores and updates
   */
  async getLiveScores(): Promise<NFLGame[]> {
    const cacheKey = 'live_scores';
    const cached = this.getFromCache<NFLGame[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await sportsDataService.getNFLGames();
      const events = response.data?.events as ESPNEvent[] | undefined;
      const games = events
        ?.filter((event: ESPNEvent) => {
          const status = event.competitions[0].status.type.name;
          return ['STATUS_IN_PROGRESS', 'STATUS_HALFTIME', 'STATUS_END_PERIOD', 'STATUS_FINAL'].includes(status);
        })
        .map((event: ESPNEvent) => this.parseESPNGame(event)) || [];
      
      this.setCache(cacheKey, games, 60 * 1000); // 1 minute
      return games;
    } catch {
      console.error('Failed to fetch live scores');
      return [];
    }
  }

  /**
   * Fetch detailed player information and stats
   */
  async getPlayerDetails(playerId: string): Promise<NFLPlayer | null> {
    const cacheKey = `player_${playerId}`;
    const cached = this.getFromCache<NFLPlayer>(cacheKey);
    if (cached) return cached;

    try {
      const response = await sportsDataService.getPlayerDetails(playerId);
      const player = this.parseESPNPlayer(response.data as ESPNPlayerData);
      this.setCache(cacheKey, player, 60 * 60 * 1000); // 1 hour
      return player;
    } catch {
      console.error(`Failed to fetch player ${playerId}`);
      return null;
    }
  }

  /**
   * Fetch betting odds for games
   */
  async getGameOdds(gameDate?: string): Promise<GameOdds[]> {
    const cacheKey = `odds_${gameDate || 'current'}`;
    const cached = this.getFromCache<GameOdds[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await sportsDataService.getOdds();
      const oddsData = response.data as OddsGame[] | undefined;
      const odds = oddsData?.map((game: OddsGame) => this.parseOddsData(game)) || [];
      this.setCache(cacheKey, odds, 2 * 60 * 1000); // 2 minutes
      return odds;
    } catch {
      console.error('Failed to fetch odds');
      return [];
    }
  }

  /**
   * Get API status and usage statistics
   */
  async getAPIStatus(): Promise<{ 
    isConnected: boolean; 
    services: { name: string; status: string; hasKey: boolean }[];
  }> {
    try {
      const status = await sportsDataService.checkStatus();
      return {
        isConnected: true,
        services: [
          { name: 'ESPN API', status: 'connected', hasKey: true },
          { name: 'The Odds API', status: status.odds ? 'connected' : 'no_key', hasKey: status.odds },
          { name: 'Sports.io API', status: status.sportsio ? 'connected' : 'no_key', hasKey: status.sportsio },
          { name: 'NFL API', status: status.nfl ? 'connected' : 'no_key', hasKey: status.nfl }
        ]
      };
    } catch {
      return {
        isConnected: false,
        services: []
      };
    }
  }

  // Cache helpers
  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key) as CacheEntry<T> | undefined;
    if (cached && Date.now() < cached.expires) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, { data, expires: Date.now() + ttl });
  }

  private parseESPNGame(event: ESPNEvent): NFLGame {
    const competition = event.competitions[0];
    const homeTeam = competition.competitors.find((c: ESPNCompetitor) => c.homeAway === 'home');
    const awayTeam = competition.competitors.find((c: ESPNCompetitor) => c.homeAway === 'away');

    return {
      id: event.id,
      date: event.date,
      week: event.week?.number || 1,
      season: event.season?.year || 2024,
      status: this.mapGameStatus(event.status.type.name),
      homeTeam: this.parseTeam(homeTeam!.team),
      awayTeam: this.parseTeam(awayTeam!.team),
      homeScore: homeTeam?.score ? parseInt(homeTeam.score) : undefined,
      awayScore: awayTeam?.score ? parseInt(awayTeam.score) : undefined,
      venue: competition.venue?.fullName || event.venue?.fullName || '',
      weather: event.weather ? this.parseWeather(event.weather) : undefined
    };
  }

  private parseTeam(team: ESPNTeam): NFLTeam {
    return {
      id: team.id,
      name: team.name,
      abbreviation: team.abbreviation,
      location: team.location,
      logo: team.logos?.[0]?.href || '',
      record: {
        wins: 0,
        losses: 0,
        ties: 0
      }
    };
  }

  private parseWeather(weather: ESPNWeather): WeatherConditions {
    return {
      temperature: weather.temperature,
      condition: weather.condition,
      windSpeed: weather.windSpeed,
      humidity: weather.humidity
    };
  }

  private parseESPNPlayer(data: ESPNPlayerData): NFLPlayer {
    return {
      id: data.id,
      name: data.fullName,
      position: data.position.abbreviation,
      team: data.team.abbreviation,
      jerseyNumber: parseInt(data.jersey) || 0,
      stats: this.parsePlayerStats(data.statistics || []),
      injuryStatus: this.parseInjuryStatus(data.injuries || [])
    };
  }

  private parsePlayerStats(statistics: ESPNPlayerStats[]): PlayerStats {
    const stats: PlayerStats = {};
    
    statistics.forEach((statGroup: ESPNPlayerStats) => {
      statGroup.splits.categories.forEach(category => {
        category.stats.forEach(stat => {
          switch (stat.name) {
            case 'passingYards':
              stats.passingYards = stat.value;
              break;
            case 'passingTouchdowns':
              stats.passingTouchdowns = stat.value;
              break;
            case 'interceptions':
              stats.interceptions = stat.value;
              break;
            case 'rushingYards':
              stats.rushingYards = stat.value;
              break;
            case 'rushingTouchdowns':
              stats.rushingTouchdowns = stat.value;
              break;
            case 'receptions':
              stats.receptions = stat.value;
              break;
            case 'receivingYards':
              stats.receivingYards = stat.value;
              break;
            case 'receivingTouchdowns':
              stats.receivingTouchdowns = stat.value;
              break;
          }
        });
      });
    });

    return stats;
  }

  private parseInjuryStatus(injuries: Array<{ status: string; type: string }>): 'healthy' | 'questionable' | 'doubtful' | 'out' {
    if (!injuries.length) return 'healthy';
    
    const status = injuries[0].status.toLowerCase();
    if (status.includes('out')) return 'out';
    if (status.includes('doubtful')) return 'doubtful';
    if (status.includes('questionable')) return 'questionable';
    return 'healthy';
  }

  private parseOddsData(game: OddsGame): GameOdds {
    const markets = game.bookmakers?.[0]?.markets || [];
    const h2h = markets.find((m) => m.key === 'h2h');
    const spreads = markets.find((m) => m.key === 'spreads');
    const totals = markets.find((m) => m.key === 'totals');

    return {
      spread: parseFloat(spreads?.outcomes?.[0]?.point || '0') || 0,
      total: parseFloat(totals?.outcomes?.[0]?.point || '0') || 0,
      moneylineHome: h2h?.outcomes?.find((o) => o.name === 'home')?.price || 0,
      moneylineAway: h2h?.outcomes?.find((o) => o.name === 'away')?.price || 0,
      lastUpdated: game.commence_time || new Date().toISOString()
    };
  }

  private mapGameStatus(espnStatus: string): 'scheduled' | 'live' | 'completed' {
    switch (espnStatus) {
      case 'STATUS_SCHEDULED':
        return 'scheduled';
      case 'STATUS_IN_PROGRESS':
      case 'STATUS_HALFTIME':
      case 'STATUS_END_PERIOD':
        return 'live';
      case 'STATUS_FINAL':
      case 'STATUS_FINAL_OT':
        return 'completed';
      default:
        return 'scheduled';
    }
  }
}

// Export singleton instance
export const secureProductionSportsDataService = new SecureProductionSportsDataService();
export default secureProductionSportsDataService;