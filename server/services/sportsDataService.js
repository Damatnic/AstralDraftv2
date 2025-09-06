/**
 * Sports Data Service
 * Integrates with SportsData.io API for NFL player data and statistics
 */

const axios = require('axios');
const Player = require('../models/Player');
const dbManager = require('../config/database');

class SportsDataService {
  constructor() {
    this.apiKey = process.env.SPORTSDATA_API_KEY;
    this.baseUrl = 'https://api.sportsdata.io/v3/nfl';
    this.timeout = 10000;
    
    if (!this.apiKey) {
      console.warn('⚠️ SportsData API key not found. Player data sync will be disabled.');
    }

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      params: {
        key: this.apiKey
      }
    });

    // Rate limiting
    this.lastRequest = 0;
    this.minInterval = 1000; // 1 second between requests
  }

  /**
   * Rate limiting helper
   */
  async rateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequest;
    
    if (timeSinceLastRequest < this.minInterval) {
      const waitTime = this.minInterval - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequest = Date.now();
  }

  /**
   * Make API request with error handling and caching
   */
  async makeRequest(endpoint, cacheKey = null, cacheTTL = 3600) {
    try {
      if (!this.apiKey) {
        throw new Error('SportsData API key not configured');
      }

      // Check cache first
      if (cacheKey) {
        const cached = await dbManager.cacheGet(cacheKey);
        if (cached) {
          return cached;
        }
      }

      // Rate limiting
      await this.rateLimit();

      console.log(`📡 Fetching from SportsData API: ${endpoint}`);
      const response = await this.client.get(endpoint);

      // Cache the response
      if (cacheKey && response.data) {
        await dbManager.cacheSet(cacheKey, response.data, cacheTTL);
      }

      return response.data;

    } catch (error) {
      console.error(`❌ SportsData API error for ${endpoint}:`, error.message);
      
      if (error.response) {
        console.error(`Status: ${error.response.status}, Data:`, error.response.data);
      }
      
      throw error;
    }
  }

  /**
   * Get current NFL season
   */
  getCurrentSeason() {
    const now = new Date();
    const year = now.getFullYear();
    
    // NFL season typically starts in September
    if (now.getMonth() >= 8) { // September or later
      return year;
    } else {
      return year - 1;
    }
  }

  /**
   * Sync all NFL players
   */
  async syncPlayers() {
    try {
      console.log('🔄 Starting player data sync...');
      
      const season = this.getCurrentSeason();
      const players = await this.makeRequest(
        `/scores/json/Players/${season}`,
        `sportsdata:players:${season}`,
        7200 // 2 hours cache
      );

      if (!players || !Array.isArray(players)) {
        throw new Error('Invalid player data received from API');
      }

      console.log(`📊 Processing ${players.length} players...`);

      const bulkOps = [];
      let processed = 0;
      let updated = 0;
      let created = 0;

      for (const apiPlayer of players) {
        try {
          const playerData = this.transformPlayerData(apiPlayer, season);
          
          bulkOps.push({
            updateOne: {
              filter: { externalId: apiPlayer.PlayerID.toString() },
              update: { $set: playerData },
              upsert: true
            }
          });

          processed++;

          // Process in batches of 100
          if (bulkOps.length >= 100) {
            const result = await Player.bulkWrite(bulkOps);
            updated += result.modifiedCount;
            created += result.upsertedCount;
            bulkOps.length = 0; // Clear array
            
            console.log(`📈 Processed ${processed}/${players.length} players...`);
          }

        } catch (error) {
          console.error(`❌ Error processing player ${apiPlayer.Name}:`, error.message);
        }
      }

      // Process remaining players
      if (bulkOps.length > 0) {
        const result = await Player.bulkWrite(bulkOps);
        updated += result.modifiedCount;
        created += result.upsertedCount;
      }

      console.log('✅ Player sync completed');
      console.log(`📊 Stats: ${created} created, ${updated} updated, ${processed} total processed`);

      return {
        success: true,
        processed: processed,
        created: created,
        updated: updated,
        season: season
      };

    } catch (error) {
      console.error('❌ Player sync failed:', error);
      throw error;
    }
  }

  /**
   * Transform API player data to our schema
   */
  transformPlayerData(apiPlayer, season) {
    return {
      externalId: apiPlayer.PlayerID.toString(),
      name: apiPlayer.Name || `${apiPlayer.FirstName} ${apiPlayer.LastName}`,
      firstName: apiPlayer.FirstName || '',
      lastName: apiPlayer.LastName || '',
      position: this.normalizePosition(apiPlayer.Position),
      team: apiPlayer.Team || 'FA',
      jerseyNumber: apiPlayer.Number || null,
      status: this.normalizeStatus(apiPlayer.Status),
      injuryStatus: {
        designation: this.normalizeInjuryStatus(apiPlayer.InjuryStatus),
        description: apiPlayer.InjuryBodyPart || '',
        updatedAt: new Date()
      },
      demographics: {
        age: apiPlayer.Age || null,
        height: apiPlayer.Height || null,
        weight: apiPlayer.Weight || null,
        college: apiPlayer.College || null,
        experience: apiPlayer.Experience || 0,
        birthDate: apiPlayer.BirthDate ? new Date(apiPlayer.BirthDate) : null
      },
      stats: {
        season: season,
        games: {
          played: apiPlayer.Played || 0,
          started: apiPlayer.Started || 0
        },
        passing: {
          attempts: apiPlayer.PassingAttempts || 0,
          completions: apiPlayer.PassingCompletions || 0,
          yards: apiPlayer.PassingYards || 0,
          touchdowns: apiPlayer.PassingTouchdowns || 0,
          interceptions: apiPlayer.PassingInterceptions || 0,
          sacks: apiPlayer.PassingSacks || 0,
          rating: apiPlayer.PassingRating || 0
        },
        rushing: {
          attempts: apiPlayer.RushingAttempts || 0,
          yards: apiPlayer.RushingYards || 0,
          touchdowns: apiPlayer.RushingTouchdowns || 0,
          fumbles: apiPlayer.Fumbles || 0,
          longest: apiPlayer.RushingLong || 0
        },
        receiving: {
          targets: apiPlayer.ReceivingTargets || 0,
          receptions: apiPlayer.Receptions || 0,
          yards: apiPlayer.ReceivingYards || 0,
          touchdowns: apiPlayer.ReceivingTouchdowns || 0,
          fumbles: apiPlayer.FumblesLost || 0,
          longest: apiPlayer.ReceivingLong || 0
        },
        kicking: {
          fieldGoalsMade: apiPlayer.FieldGoalsMade || 0,
          fieldGoalsAttempted: apiPlayer.FieldGoalsAttempted || 0,
          extraPointsMade: apiPlayer.ExtraPointsMade || 0,
          extraPointsAttempted: apiPlayer.ExtraPointsAttempted || 0,
          longest: apiPlayer.FieldGoalsLongestMade || 0
        },
        defense: {
          tackles: apiPlayer.Tackles || 0,
          sacks: apiPlayer.Sacks || 0,
          interceptions: apiPlayer.Interceptions || 0,
          forcedFumbles: apiPlayer.FumblesForced || 0,
          fumbleRecoveries: apiPlayer.FumblesRecovered || 0,
          defensiveTouchdowns: apiPlayer.DefensiveTouchdowns || 0,
          safeties: apiPlayer.Safeties || 0
        }
      },
      byeWeek: apiPlayer.ByeWeek || null,
      isRookie: (apiPlayer.Experience || 0) === 0,
      photoUrl: apiPlayer.PhotoUrl || null,
      lastUpdated: new Date()
    };
  }

  /**
   * Normalize position names
   */
  normalizePosition(position) {
    if (!position) return 'UNKNOWN';
    
    const positionMap = {
      'QB': 'QB',
      'RB': 'RB', 
      'FB': 'RB',
      'WR': 'WR',
      'TE': 'TE',
      'K': 'K',
      'PK': 'K',
      'DEF': 'DST',
      'DST': 'DST'
    };

    return positionMap[position.toUpperCase()] || position.toUpperCase();
  }

  /**
   * Normalize player status
   */
  normalizeStatus(status) {
    if (!status) return 'ACTIVE';
    
    const statusMap = {
      'Active': 'ACTIVE',
      'Injured': 'INJURED',
      'Suspended': 'SUSPENDED',
      'Retired': 'RETIRED',
      'Practice Squad': 'PRACTICE_SQUAD',
      'Inactive': 'INACTIVE'
    };

    return statusMap[status] || 'ACTIVE';
  }

  /**
   * Normalize injury status
   */
  normalizeInjuryStatus(injuryStatus) {
    if (!injuryStatus) return 'HEALTHY';
    
    const statusMap = {
      'Healthy': 'HEALTHY',
      'Questionable': 'QUESTIONABLE',
      'Doubtful': 'DOUBTFUL',
      'Out': 'OUT',
      'Injured Reserve': 'IR',
      'Physically Unable to Perform': 'PUP',
      'Suspended': 'SUSPENDED'
    };

    return statusMap[injuryStatus] || 'HEALTHY';
  }

  /**
   * Sync weekly player statistics
   */
  async syncWeeklyStats(week, season = null) {
    try {
      if (!season) season = this.getCurrentSeason();
      
      console.log(`🔄 Syncing week ${week} stats for ${season} season...`);

      const stats = await this.makeRequest(
        `/stats/json/PlayerGameStatsByWeek/${season}/${week}`,
        `sportsdata:stats:${season}:${week}`,
        1800 // 30 minutes cache
      );

      if (!stats || !Array.isArray(stats)) {
        throw new Error('Invalid stats data received from API');
      }

      console.log(`📊 Processing ${stats.length} player game stats...`);

      let processed = 0;
      let updated = 0;

      for (const gameStat of stats) {
        try {
          const player = await Player.findOne({ 
            externalId: gameStat.PlayerID.toString() 
          });

          if (!player) {
            console.warn(`⚠️ Player not found: ${gameStat.PlayerID}`);
            continue;
          }

          // Transform game stats
          const weeklyStats = {
            passing: {
              attempts: gameStat.PassingAttempts || 0,
              completions: gameStat.PassingCompletions || 0,
              yards: gameStat.PassingYards || 0,
              touchdowns: gameStat.PassingTouchdowns || 0,
              interceptions: gameStat.PassingInterceptions || 0
            },
            rushing: {
              attempts: gameStat.RushingAttempts || 0,
              yards: gameStat.RushingYards || 0,
              touchdowns: gameStat.RushingTouchdowns || 0,
              fumbles: gameStat.Fumbles || 0
            },
            receiving: {
              targets: gameStat.ReceivingTargets || 0,
              receptions: gameStat.Receptions || 0,
              yards: gameStat.ReceivingYards || 0,
              touchdowns: gameStat.ReceivingTouchdowns || 0,
              fumbles: gameStat.FumblesLost || 0
            },
            kicking: {
              fieldGoalsMade: gameStat.FieldGoalsMade || 0,
              fieldGoalsAttempted: gameStat.FieldGoalsAttempted || 0,
              extraPointsMade: gameStat.ExtraPointsMade || 0,
              extraPointsAttempted: gameStat.ExtraPointsAttempted || 0
            },
            defense: {
              tackles: gameStat.Tackles || 0,
              sacks: gameStat.Sacks || 0,
              interceptions: gameStat.Interceptions || 0,
              forcedFumbles: gameStat.FumblesForced || 0,
              fumbleRecoveries: gameStat.FumblesRecovered || 0,
              defensiveTouchdowns: gameStat.DefensiveTouchdowns || 0
            }
          };

          // Update player with weekly stats
          await player.updateWeeklyStats(
            week,
            weeklyStats,
            gameStat.Opponent || 'UNK',
            gameStat.HomeOrAway === 'HOME',
            gameStat.GameDate ? new Date(gameStat.GameDate) : new Date()
          );

          updated++;
          processed++;

          if (processed % 50 === 0) {
            console.log(`📈 Processed ${processed}/${stats.length} game stats...`);
          }

        } catch (error) {
          console.error(`❌ Error processing game stat for player ${gameStat.PlayerID}:`, error.message);
        }
      }

      console.log('✅ Weekly stats sync completed');
      console.log(`📊 Stats: ${updated} players updated, ${processed} total processed`);

      return {
        success: true,
        week: week,
        season: season,
        processed: processed,
        updated: updated
      };

    } catch (error) {
      console.error('❌ Weekly stats sync failed:', error);
      throw error;
    }
  }

  /**
   * Get current week
   */
  async getCurrentWeek() {
    try {
      const season = this.getCurrentSeason();
      const currentWeek = await this.makeRequest(
        `/scores/json/CurrentWeek`,
        `sportsdata:current_week`,
        300 // 5 minutes cache
      );

      return currentWeek || 1;

    } catch (error) {
      console.error('❌ Failed to get current week:', error);
      return 1; // Default to week 1
    }
  }

  /**
   * Sync player rankings and projections
   */
  async syncRankings() {
    try {
      console.log('🔄 Syncing player rankings...');

      // This would typically come from a fantasy rankings API
      // For now, we'll calculate basic rankings based on projected points
      const players = await Player.find({ status: 'ACTIVE' })
        .sort({ 'projections.season.fantasyPoints.ppr': -1 });

      const bulkOps = [];
      const positionRanks = {};

      players.forEach((player, index) => {
        // Overall ranking
        const overallRank = index + 1;
        
        // Position ranking
        if (!positionRanks[player.position]) {
          positionRanks[player.position] = 0;
        }
        positionRanks[player.position]++;
        const positionRank = positionRanks[player.position];

        bulkOps.push({
          updateOne: {
            filter: { _id: player._id },
            update: {
              $set: {
                'rankings.overall': overallRank,
                'rankings.position': positionRank,
                'rankings.lastUpdated': new Date()
              }
            }
          }
        });
      });

      if (bulkOps.length > 0) {
        await Player.bulkWrite(bulkOps);
      }

      console.log(`✅ Rankings updated for ${players.length} players`);

      return {
        success: true,
        updated: players.length
      };

    } catch (error) {
      console.error('❌ Rankings sync failed:', error);
      throw error;
    }
  }

  /**
   * Health check for the service
   */
  async healthCheck() {
    try {
      if (!this.apiKey) {
        return {
          status: 'disabled',
          message: 'API key not configured'
        };
      }

      // Test API connection
      await this.makeRequest('/scores/json/AreAnyGamesInProgress');

      return {
        status: 'healthy',
        message: 'API connection successful'
      };

    } catch (error) {
      return {
        status: 'error',
        message: error.message
      };
    }
  }
}

// Create singleton instance
const sportsDataService = new SportsDataService();

module.exports = sportsDataService;