/**
 * Sports.io Player Service Integration
 * Fetches live NFL player data from Sports.io API and transforms it for the app
 */

import { apiClient } from &apos;./apiClient&apos;;
import { Player } from &apos;../types&apos;;
import { NFL_PLAYERS_2024 } from &apos;../data/nflPlayers&apos;;

class SportsIOPlayerService {
}
  private cache: Map<string, { data: Player[]; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

  /**
   * Get all NFL players with live data from Sports.io API
   */
  async getAllPlayers(): Promise<Player[]> {
}
    try {
}
      // Check cache first
      const cached = this.getCachedData(&apos;all_players&apos;);
      if (cached) {
}
        console.log(&apos;🏈 Using cached Sports.io player data&apos;);
        return cached;
      }

      console.log(&apos;🌐 Fetching live player data from Sports.io API...&apos;);
      
      // Fetch from Sports.io API
      const sportsIOPlayers = await apiClient.getSportsIOPlayers();
      
      if (sportsIOPlayers && sportsIOPlayers.length > 0) {
}
        console.log(`✅ Fetched ${sportsIOPlayers.length} players from Sports.io API`);
        
        // Transform Sports.io data to our Player format
        const transformedPlayers = this.transformSportsIOPlayers(sportsIOPlayers);
        
        // Cache the result
        this.setCachedData(&apos;all_players&apos;, transformedPlayers);
        
        return transformedPlayers;
      } else {
}
        console.warn(&apos;⚠️ No players returned from Sports.io API, using fallback data&apos;);
        return this.getFallbackPlayers();
      }
    } catch (error) {
}
      console.error(&apos;❌ Failed to fetch from Sports.io API:&apos;, error);
      console.log(&apos;🔄 Falling back to mock data&apos;);
      return this.getFallbackPlayers();
    }
  }

  /**
   * Get players by position
   */
  async getPlayersByPosition(position: string): Promise<Player[]> {
}
    try {
}
      const cacheKey = `players_${position}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) {
}
        return cached;
      }

      console.log(`🌐 Fetching ${position} players from Sports.io API...`);
      
      const sportsIOPlayers = await apiClient.getSportsIOPlayers(position);
      
      if (sportsIOPlayers && sportsIOPlayers.length > 0) {
}
        const transformedPlayers = this.transformSportsIOPlayers(sportsIOPlayers);
        this.setCachedData(cacheKey, transformedPlayers);
        return transformedPlayers;
      } else {
}
        // Fallback to mock data filtered by position
        const fallbackPlayers = this.getFallbackPlayers();
        return fallbackPlayers.filter((player: any) => player.position === position);
      }
    } catch (error) {
}
      console.error(`❌ Failed to fetch ${position} players:`, error);
      const fallbackPlayers = this.getFallbackPlayers();
      return fallbackPlayers.filter((player: any) => player.position === position);
    }
  }

  /**
   * Transform Sports.io player data to our Player interface
   */
  private transformSportsIOPlayers(sportsIOPlayers: any[]): Player[] {
}
    return sportsIOPlayers.map((sportsPlayer, index) => {
}
      const player: Player = {
}
        id: parseInt(sportsPlayer.player_id) || 9000 + index,
        name: sportsPlayer.name || &apos;Unknown Player&apos;,
        position: this.normalizePosition(sportsPlayer.position),
        team: sportsPlayer.team || &apos;FA&apos;,
        jerseyNumber: sportsPlayer.jersey_number || 0,
        age: sportsPlayer.age || 25,
        college: sportsPlayer.college || &apos;Unknown&apos;,
        height: sportsPlayer.height || &apos;6-0&apos;,
        weight: sportsPlayer.weight || 200,
        experience: sportsPlayer.experience || 3,
        fantasyRank: this.calculateFantasyRank(sportsPlayer),
        projectedPoints: sportsPlayer.stats?.fantasy_points || this.estimateProjectedPoints(sportsPlayer.position),
        byeWeek: this.getByeWeek(sportsPlayer.team),
        injuryStatus: this.normalizeInjuryStatus(sportsPlayer.injury_status),
        
        // Stats from Sports.io
        stats: {
}
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
}
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
}
    console.log(&apos;📂 Using mock NFL player data&apos;);
    return NFL_PLAYERS_2024;
  }

  /**
   * Cache management
   */
  private getCachedData(key: string): Player[] | null {
}
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
}
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: Player[]): void {
}
    this.cache.set(key, {
}
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Helper methods for data transformation
   */
  private normalizePosition(position: string): string {
}
    const pos = position?.toUpperCase() || &apos;UNKNOWN&apos;;
    // Map common variations
    const positionMap: Record<string, string> = {
}
      &apos;QUARTERBACK&apos;: &apos;QB&apos;,
      &apos;RUNNING_BACK&apos;: &apos;RB&apos;,
      &apos;RUNNINGBACK&apos;: &apos;RB&apos;,
      &apos;WIDE_RECEIVER&apos;: &apos;WR&apos;,
      &apos;WIDERECEIVER&apos;: &apos;WR&apos;,
      &apos;TIGHT_END&apos;: &apos;TE&apos;,
      &apos;TIGHTEND&apos;: &apos;TE&apos;,
      &apos;KICKER&apos;: &apos;K&apos;,
      &apos;DEFENSE&apos;: &apos;DST&apos;,
      &apos;DEF&apos;: &apos;DST&apos;
    };
    return positionMap[pos] || pos;
  }

  private normalizeInjuryStatus(status: string): &apos;HEALTHY&apos; | &apos;QUESTIONABLE&apos; | &apos;DOUBTFUL&apos; | &apos;OUT&apos; | &apos;IR&apos; {
}
    if (!status) return &apos;HEALTHY&apos;;
    
    const statusUpper = status.toUpperCase();
    if (statusUpper.includes(&apos;OUT&apos;) || statusUpper.includes(&apos;INACTIVE&apos;)) return &apos;OUT&apos;;
    if (statusUpper.includes(&apos;DOUBTFUL&apos;)) return &apos;DOUBTFUL&apos;;
    if (statusUpper.includes(&apos;QUESTIONABLE&apos;) || statusUpper.includes(&apos;PROBABLE&apos;)) return &apos;QUESTIONABLE&apos;;
    if (statusUpper.includes(&apos;IR&apos;) || statusUpper.includes(&apos;INJURED_RESERVE&apos;)) return &apos;IR&apos;;
    return &apos;HEALTHY&apos;;
  }

  private calculateFantasyRank(sportsPlayer: any): number {
}
    // Calculate fantasy rank based on projected fantasy points
    const fantasyPoints = sportsPlayer.stats?.fantasy_points || 0;
    const position = this.normalizePosition(sportsPlayer.position);
    
    // Base rank calculation (lower is better)
    let baseRank = 200 - Math.floor(fantasyPoints * 2);
    
    // Position adjustments
    switch (position) {
}
      case &apos;QB&apos;:
        baseRank = Math.max(1, Math.min(baseRank, 32)); // Top 32 QBs
        break;
      case &apos;RB&apos;:
        baseRank = Math.max(1, Math.min(baseRank, 60)); // Top 60 RBs
        break;
      case &apos;WR&apos;:
        baseRank = Math.max(1, Math.min(baseRank, 80)); // Top 80 WRs
        break;
      case &apos;TE&apos;:
        baseRank = Math.max(1, Math.min(baseRank, 24)); // Top 24 TEs
        break;
      case &apos;K&apos;:
        baseRank = Math.max(1, Math.min(baseRank, 32)); // Top 32 Ks
        break;
      case &apos;DST&apos;:
        baseRank = Math.max(1, Math.min(baseRank, 32)); // Top 32 DSTs
        break;
      default:
        baseRank = Math.max(1, Math.min(baseRank, 300));
    }
    
    return baseRank;
  }

  private estimateProjectedPoints(position: string): number {
}
    // Estimate projected points based on position
    const estimates = {
}
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
}
    // 2024 NFL Bye weeks (approximate)
    const byeWeeks: Record<string, number> = {
}
      &apos;ARI&apos;: 11, &apos;ATL&apos;: 12, &apos;BAL&apos;: 14, &apos;BUF&apos;: 12, &apos;CAR&apos;: 11, &apos;CHI&apos;: 7,
      &apos;CIN&apos;: 12, &apos;CLE&apos;: 10, &apos;DAL&apos;: 7, &apos;DEN&apos;: 14, &apos;DET&apos;: 9, &apos;GB&apos;: 10,
      &apos;HOU&apos;: 14, &apos;IND&apos;: 14, &apos;JAX&apos;: 12, &apos;KC&apos;: 10, &apos;LV&apos;: 10, &apos;LAC&apos;: 5,
      &apos;LAR&apos;: 6, &apos;MIA&apos;: 6, &apos;MIN&apos;: 6, &apos;NE&apos;: 14, &apos;NO&apos;: 12, &apos;NYG&apos;: 11,
      &apos;NYJ&apos;: 12, &apos;PHI&apos;: 5, &apos;PIT&apos;: 9, &apos;SF&apos;: 9, &apos;SEA&apos;: 10, &apos;TB&apos;: 11,
      &apos;TEN&apos;: 5, &apos;WAS&apos;: 14
    };
    return byeWeeks[team] || Math.floor(Math.random() * 14) + 4; // Random bye week 4-17
  }

  /**
   * Clear cache manually if needed
   */
  clearCache(): void {
}
    this.cache.clear();
    console.log(&apos;🗑️ Sports.io player cache cleared&apos;);
  }

  /**
   * Get cache status
   */
  getCacheStatus(): { size: number; keys: string[] } {
}
    return {
}
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
export const sportsIOPlayerService = new SportsIOPlayerService();
export default sportsIOPlayerService;