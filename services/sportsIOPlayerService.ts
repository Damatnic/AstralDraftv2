/**
 * Sports.io Player Service Integration
 * Fetches live NFL player data from Sports.io API and transforms it for the app
 */

import { apiClient } from './apiClient';
import { Player } from '../types';
import { NFL_PLAYERS_2024 } from '../data/nflPlayers';

class SportsIOPlayerService {
  private cache: Map<string, { data: Player[]; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

  /**
   * Get all NFL players with live data from Sports.io API
   */
  async getAllPlayers(): Promise<Player[]> {
    try {
      // Check cache first
      const cached = this.getCachedData('all_players');
      if (cached) {
        console.log('🏈 Using cached Sports.io player data');
        return cached;
      }

      console.log('🌐 Fetching live player data from Sports.io API...');
      
      // Fetch from Sports.io API
      const sportsIOPlayers = await apiClient.getSportsIOPlayers();
      
      if (sportsIOPlayers && sportsIOPlayers.length > 0) {
        console.log(`✅ Fetched ${sportsIOPlayers.length} players from Sports.io API`);
        
        // Transform Sports.io data to our Player format
        const transformedPlayers = this.transformSportsIOPlayers(sportsIOPlayers);
        
        // Cache the result
        this.setCachedData('all_players', transformedPlayers);
        
        return transformedPlayers;
      } else {
        console.warn('⚠️ No players returned from Sports.io API, using fallback data');
        return this.getFallbackPlayers();
      }
    } catch (error) {
      console.error('❌ Failed to fetch from Sports.io API:', error);
      console.log('🔄 Falling back to mock data');
      return this.getFallbackPlayers();
    }
  }

  /**
   * Get players by position
   */
  async getPlayersByPosition(position: string): Promise<Player[]> {
    try {
      const cacheKey = `players_${position}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) {
        return cached;
      }

      console.log(`🌐 Fetching ${position} players from Sports.io API...`);
      
      const sportsIOPlayers = await apiClient.getSportsIOPlayers(position);
      
      if (sportsIOPlayers && sportsIOPlayers.length > 0) {
        const transformedPlayers = this.transformSportsIOPlayers(sportsIOPlayers);
        this.setCachedData(cacheKey, transformedPlayers);
        return transformedPlayers;
      } else {
        // Fallback to mock data filtered by position
        const fallbackPlayers = this.getFallbackPlayers();
        return fallbackPlayers.filter((player: any) => player.position === position);
      }
    } catch (error) {
      console.error(`❌ Failed to fetch ${position} players:`, error);
      const fallbackPlayers = this.getFallbackPlayers();
      return fallbackPlayers.filter((player: any) => player.position === position);
    }
  }

  /**
   * Transform Sports.io player data to our Player interface
   */
  private transformSportsIOPlayers(sportsIOPlayers: any[]): Player[] {
    return sportsIOPlayers.map((sportsPlayer, index) => {
      const player: Player = {
        id: parseInt(sportsPlayer.player_id) || 9000 + index,
        name: sportsPlayer.name || 'Unknown Player',
        position: this.normalizePosition(sportsPlayer.position),
        team: sportsPlayer.team || 'FA',
        jerseyNumber: sportsPlayer.jersey_number || 0,
        age: sportsPlayer.age || 25,
        college: sportsPlayer.college || 'Unknown',
        height: sportsPlayer.height || '6-0',
        weight: sportsPlayer.weight || 200,
        experience: sportsPlayer.experience || 3,
        fantasyRank: this.calculateFantasyRank(sportsPlayer),
        projectedPoints: sportsPlayer.stats?.fantasy_points || this.estimateProjectedPoints(sportsPlayer.position),
        byeWeek: this.getByeWeek(sportsPlayer.team),
        injuryStatus: this.normalizeInjuryStatus(sportsPlayer.injury_status),
        
        // Stats from Sports.io
        stats: {
          passingYards: sportsPlayer.stats?.passing_yards || 0,
          passingTouchdowns: sportsPlayer.stats?.passing_tds || 0,
          rushingYards: sportsPlayer.stats?.rushing_yards || 0,
          rushingTouchdowns: sportsPlayer.stats?.rushing_tds || 0,
          receivingYards: sportsPlayer.stats?.receiving_yards || 0,
          receivingTouchdowns: sportsPlayer.stats?.receiving_tds || 0,
          receptions: sportsPlayer.stats?.receptions || 0,
        },
        
        // Default values for fields not provided by Sports.io
        draftADP: 100,
        rosteredPercentage: Math.random() * 100, // Mock value
        tradedPercentage: Math.random() * 20,    // Mock value
        
        // Fantasy projections
        weeklyProjection: {
          points: sportsPlayer.stats?.fantasy_points || this.estimateProjectedPoints(sportsPlayer.position),
          floor: (sportsPlayer.stats?.fantasy_points || 10) * 0.7,
          ceiling: (sportsPlayer.stats?.fantasy_points || 10) * 1.3,
          confidence: 85
        }
      };

      return player;
    });
  }

  /**
   * Get fallback players (mock data) when API fails
   */
  private getFallbackPlayers(): Player[] {
    console.log('📂 Using mock NFL player data');
    return NFL_PLAYERS_2024;
  }

  /**
   * Cache management
   */
  private getCachedData(key: string): Player[] | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: Player[]): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Helper methods for data transformation
   */
  private normalizePosition(position: string): string {
    const pos = position?.toUpperCase() || 'UNKNOWN';
    // Map common variations
    const positionMap: Record<string, string> = {
      'QUARTERBACK': 'QB',
      'RUNNING_BACK': 'RB',
      'RUNNINGBACK': 'RB',
      'WIDE_RECEIVER': 'WR',
      'WIDERECEIVER': 'WR',
      'TIGHT_END': 'TE',
      'TIGHTEND': 'TE',
      'KICKER': 'K',
      'DEFENSE': 'DST',
      'DEF': 'DST'
    };
    return positionMap[pos] || pos;
  }

  private normalizeInjuryStatus(status: string): 'HEALTHY' | 'QUESTIONABLE' | 'DOUBTFUL' | 'OUT' | 'IR' {
    if (!status) return 'HEALTHY';
    
    const statusUpper = status.toUpperCase();
    if (statusUpper.includes('OUT') || statusUpper.includes('INACTIVE')) return 'OUT';
    if (statusUpper.includes('DOUBTFUL')) return 'DOUBTFUL';
    if (statusUpper.includes('QUESTIONABLE') || statusUpper.includes('PROBABLE')) return 'QUESTIONABLE';
    if (statusUpper.includes('IR') || statusUpper.includes('INJURED_RESERVE')) return 'IR';
    return 'HEALTHY';
  }

  private calculateFantasyRank(sportsPlayer: any): number {
    // Calculate fantasy rank based on projected fantasy points
    const fantasyPoints = sportsPlayer.stats?.fantasy_points || 0;
    const position = this.normalizePosition(sportsPlayer.position);
    
    // Base rank calculation (lower is better)
    let baseRank = 200 - Math.floor(fantasyPoints * 2);
    
    // Position adjustments
    switch (position) {
      case 'QB':
        baseRank = Math.max(1, Math.min(baseRank, 32)); // Top 32 QBs
        break;
      case 'RB':
        baseRank = Math.max(1, Math.min(baseRank, 60)); // Top 60 RBs
        break;
      case 'WR':
        baseRank = Math.max(1, Math.min(baseRank, 80)); // Top 80 WRs
        break;
      case 'TE':
        baseRank = Math.max(1, Math.min(baseRank, 24)); // Top 24 TEs
        break;
      case 'K':
        baseRank = Math.max(1, Math.min(baseRank, 32)); // Top 32 Ks
        break;
      case 'DST':
        baseRank = Math.max(1, Math.min(baseRank, 32)); // Top 32 DSTs
        break;
      default:
        baseRank = Math.max(1, Math.min(baseRank, 300));
    }
    
    return baseRank;
  }

  private estimateProjectedPoints(position: string): number {
    // Estimate projected points based on position
    const estimates = {
      QB: 18,
      RB: 12,
      WR: 10,
      TE: 8,
      K: 7,
      DST: 8
    };
    return estimates[position as keyof typeof estimates] || 5;
  }

  private getByeWeek(team: string): number {
    // 2024 NFL Bye weeks (approximate)
    const byeWeeks: Record<string, number> = {
      'ARI': 11, 'ATL': 12, 'BAL': 14, 'BUF': 12, 'CAR': 11, 'CHI': 7,
      'CIN': 12, 'CLE': 10, 'DAL': 7, 'DEN': 14, 'DET': 9, 'GB': 10,
      'HOU': 14, 'IND': 14, 'JAX': 12, 'KC': 10, 'LV': 10, 'LAC': 5,
      'LAR': 6, 'MIA': 6, 'MIN': 6, 'NE': 14, 'NO': 12, 'NYG': 11,
      'NYJ': 12, 'PHI': 5, 'PIT': 9, 'SF': 9, 'SEA': 10, 'TB': 11,
      'TEN': 5, 'WAS': 14
    };
    return byeWeeks[team] || Math.floor(Math.random() * 14) + 4; // Random bye week 4-17
  }

  /**
   * Clear cache manually if needed
   */
  clearCache(): void {
    this.cache.clear();
    console.log('🗑️ Sports.io player cache cleared');
  }

  /**
   * Get cache status
   */
  getCacheStatus(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
export const sportsIOPlayerService = new SportsIOPlayerService();
export default sportsIOPlayerService;