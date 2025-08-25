/**
 * Scoring Engine Service
 * Handles real-time fantasy point calculations and score updates
 */

const Player = require('../models/Player');
const Team = require('../models/Team');
const League = require('../models/League');
const Matchup = require('../models/Matchup');
const sportsDataService = require('./sportsDataService');
const dbManager = require('../config/database');

class ScoringEngine {
  constructor() {
    this.isUpdating = false;
    this.updateIntervals = new Map();
    this.scoringCache = new Map();
    this.lastUpdateTime = new Date();
  }

  /**
   * Initialize the scoring engine
   */
  initialize() {
    console.log('🏈 Initializing scoring engine...');
    
    // Start live scoring updates during game time
    this.startLiveScoring();
    
    // Schedule weekly score finalization
    this.scheduleWeeklyFinalization();
    
    console.log('✅ Scoring engine initialized');
  }

  /**
   * Start live scoring updates
   */
  startLiveScoring() {
    // Update scores every 30 seconds during NFL game time
    const liveUpdateInterval = setInterval(async () => {
      if (this.isGameTime()) {
        await this.updateAllLiveScores();
      }
    }, 30000);

    this.updateIntervals.set('live_scoring', liveUpdateInterval);
    console.log('📊 Live scoring updates started (30-second intervals)');
  }

  /**
   * Schedule weekly score finalization
   */
  scheduleWeeklyFinalization() {
    // Finalize scores every Tuesday at 2 AM (after Monday Night Football)
    const finalizationInterval = setInterval(async () => {
      const now = new Date();
      if (now.getDay() === 2 && now.getHours() === 2) { // Tuesday 2 AM
        await this.finalizeWeeklyScores();
      }
    }, 60 * 60 * 1000); // Check every hour

    this.updateIntervals.set('weekly_finalization', finalizationInterval);
    console.log('📅 Weekly score finalization scheduled for Tuesdays at 2 AM');
  }

  /**
   * Check if it's currently NFL game time
   */
  isGameTime() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 4 = Thursday, 1 = Monday
    const hour = now.getHours();

    // Thursday Night Football (8 PM - 12 AM)
    if (day === 4 && hour >= 20) return true;
    
    // Sunday games (1 PM - 12 AM)
    if (day === 0 && hour >= 13) return true;
    
    // Monday Night Football (8 PM - 12 AM)
    if (day === 1 && hour >= 20 && hour <= 23) return true;

    return false;
  }

  /**
   * Update live scores for all active leagues
   */
  async updateAllLiveScores() {
    if (this.isUpdating) {
      console.log('⚠️ Score update already in progress, skipping...');
      return;
    }

    this.isUpdating = true;
    const startTime = new Date();

    try {
      console.log('🔄 Starting live score updates...');

      // Get all active leagues
      const activeLeagues = await League.find({ status: 'ACTIVE' });
      
      let updatedLeagues = 0;
      let updatedMatchups = 0;

      for (const league of activeLeagues) {
        try {
          const currentWeek = league.currentWeek || this.getCurrentNFLWeek();
          const result = await this.updateLeagueScores(league._id, currentWeek);
          
          updatedLeagues++;
          updatedMatchups += result.updatedMatchups;

        } catch (error) {
          console.error(`Error updating league ${league.name}:`, error);
        }
      }

      const duration = new Date() - startTime;
      this.lastUpdateTime = new Date();

      console.log(`✅ Live score update complete: ${updatedMatchups} matchups across ${updatedLeagues} leagues (${Math.round(duration / 1000)}s)`);

    } catch (error) {
      console.error('❌ Live score update failed:', error);
    } finally {
      this.isUpdating = false;
    }
  }

  /**
   * Update scores for a specific league
   */
  async updateLeagueScores(leagueId, week) {
    try {
      // Get current matchups for the week
      const matchups = await Matchup.find({
        leagueId: leagueId,
        week: week,
        status: { $in: ['SCHEDULED', 'IN_PROGRESS'] }
      }).populate([
        { path: 'homeTeam.teamId', populate: { path: 'roster.player' } },
        { path: 'awayTeam.teamId', populate: { path: 'roster.player' } }
      ]);

      let updatedMatchups = 0;

      for (const matchup of matchups) {
        try {
          const updated = await this.updateMatchupScores(matchup);
          if (updated) updatedMatchups++;
        } catch (error) {
          console.error(`Error updating matchup ${matchup._id}:`, error);
        }
      }

      return { updatedMatchups };

    } catch (error) {
      console.error(`Error updating league ${leagueId} scores:`, error);
      throw error;
    }
  }

  /**
   * Update scores for a specific matchup
   */
  async updateMatchupScores(matchup) {
    try {
      const league = await League.findById(matchup.leagueId);
      if (!league) return false;

      // Calculate scores for both teams
      const homeTeamScore = await this.calculateTeamScore(
        matchup.homeTeam.teamId, 
        matchup.week, 
        league.settings.scoringType
      );
      
      const awayTeamScore = await this.calculateTeamScore(
        matchup.awayTeam.teamId, 
        matchup.week, 
        league.settings.scoringType
      );

      // Check if scores have changed
      const homeChanged = Math.abs(matchup.homeTeam.score - homeTeamScore.totalPoints) > 0.01;
      const awayChanged = Math.abs(matchup.awayTeam.score - awayTeamScore.totalPoints) > 0.01;

      if (!homeChanged && !awayChanged) {
        return false; // No changes
      }

      // Update matchup scores
      matchup.homeTeam.score = homeTeamScore.totalPoints;
      matchup.homeTeam.lineup = homeTeamScore.lineup;
      matchup.homeTeam.benchPoints = homeTeamScore.benchPoints;
      matchup.homeTeam.projectedScore = homeTeamScore.projectedPoints;

      matchup.awayTeam.score = awayTeamScore.totalPoints;
      matchup.awayTeam.lineup = awayTeamScore.lineup;
      matchup.awayTeam.benchPoints = awayTeamScore.benchPoints;
      matchup.awayTeam.projectedScore = awayTeamScore.projectedPoints;

      matchup.lastUpdated = new Date();

      // Update status if game has started
      if (matchup.status === 'SCHEDULED' && (homeTeamScore.totalPoints > 0 || awayTeamScore.totalPoints > 0)) {
        matchup.status = 'IN_PROGRESS';
      }

      await matchup.save();

      // Emit real-time score update
      this.emitScoreUpdate(matchup);

      return true;

    } catch (error) {
      console.error(`Error updating matchup scores:`, error);
      return false;
    }
  }

  /**
   * Calculate total fantasy points for a team
   */
  async calculateTeamScore(teamId, week, scoringType = 'ppr') {
    try {
      const cacheKey = `team_score:${teamId}:${week}:${scoringType}`;
      
      // Try cache first (cache for 1 minute during live updates)
      const cached = this.scoringCache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp) < 60000) {
        return cached.data;
      }

      const team = await Team.findById(teamId).populate('roster.player');
      if (!team) {
        throw new Error('Team not found');
      }

      let totalPoints = 0;
      let benchPoints = 0;
      let projectedPoints = 0;
      const lineup = [];

      // Calculate points for each roster spot
      for (const rosterSpot of team.roster) {
        const player = rosterSpot.player;
        if (!player) continue;

        // Get player's weekly stats
        const weeklyStats = await this.getPlayerWeeklyStats(player._id, week);
        const playerPoints = this.calculatePlayerPoints(weeklyStats, scoringType);
        const playerProjected = this.getPlayerProjectedPoints(player, week, scoringType);

        const lineupEntry = {
          player: player._id,
          position: rosterSpot.position,
          points: playerPoints,
          projectedPoints: playerProjected,
          isStarter: rosterSpot.isStarter
        };

        lineup.push(lineupEntry);

        if (rosterSpot.isStarter) {
          totalPoints += playerPoints;
          projectedPoints += playerProjected;
        } else {
          benchPoints += playerPoints;
        }
      }

      const result = {
        totalPoints: Math.round(totalPoints * 100) / 100,
        benchPoints: Math.round(benchPoints * 100) / 100,
        projectedPoints: Math.round(projectedPoints * 100) / 100,
        lineup: lineup
      };

      // Cache the result
      this.scoringCache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      return result;

    } catch (error) {
      console.error(`Error calculating team score for ${teamId}:`, error);
      return {
        totalPoints: 0,
        benchPoints: 0,
        projectedPoints: 0,
        lineup: []
      };
    }
  }

  /**
   * Get player's weekly stats
   */
  async getPlayerWeeklyStats(playerId, week) {
    try {
      const player = await Player.findById(playerId);
      if (!player) return {};

      // Find weekly stats for the specific week
      const weeklyStats = player.weeklyStats.find(w => w.week === week);
      return weeklyStats ? weeklyStats.stats : {};

    } catch (error) {
      console.error(`Error getting weekly stats for player ${playerId}:`, error);
      return {};
    }
  }

  /**
   * Calculate fantasy points for a player based on stats
   */
  calculatePlayerPoints(stats, scoringType = 'ppr') {
    let points = 0;

    if (!stats) return 0;

    // Passing points
    if (stats.passing) {
      points += (stats.passing.yards || 0) * 0.04; // 1 point per 25 yards
      points += (stats.passing.touchdowns || 0) * 4;
      points += (stats.passing.interceptions || 0) * -2;
    }

    // Rushing points
    if (stats.rushing) {
      points += (stats.rushing.yards || 0) * 0.1; // 1 point per 10 yards
      points += (stats.rushing.touchdowns || 0) * 6;
      points += (stats.rushing.fumbles || 0) * -2;
    }

    // Receiving points
    if (stats.receiving) {
      points += (stats.receiving.yards || 0) * 0.1; // 1 point per 10 yards
      points += (stats.receiving.touchdowns || 0) * 6;
      points += (stats.receiving.fumbles || 0) * -2;

      // PPR bonus
      if (scoringType === 'ppr') {
        points += (stats.receiving.receptions || 0) * 1;
      } else if (scoringType === 'half-ppr') {
        points += (stats.receiving.receptions || 0) * 0.5;
      }
    }

    // Kicking points
    if (stats.kicking) {
      points += (stats.kicking.fieldGoalsMade || 0) * 3;
      points += (stats.kicking.extraPointsMade || 0) * 1;
    }

    // Defense/Special Teams points
    if (stats.defense) {
      points += (stats.defense.sacks || 0) * 1;
      points += (stats.defense.interceptions || 0) * 2;
      points += (stats.defense.fumbleRecoveries || 0) * 2;
      points += (stats.defense.defensiveTouchdowns || 0) * 6;
      points += (stats.defense.safeties || 0) * 2;

      // Points allowed (for DST)
      const pointsAllowed = stats.defense.pointsAllowed || 0;
      if (pointsAllowed === 0) points += 10;
      else if (pointsAllowed <= 6) points += 7;
      else if (pointsAllowed <= 13) points += 4;
      else if (pointsAllowed <= 20) points += 1;
      else if (pointsAllowed <= 27) points += 0;
      else if (pointsAllowed <= 34) points += -1;
      else points += -4;
    }

    return Math.round(points * 100) / 100;
  }

  /**
   * Get player's projected points for the week
   */
  getPlayerProjectedPoints(player, week, scoringType = 'ppr') {
    try {
      // Look for weekly projection
      const weeklyProjection = player.projections?.weekly?.find(w => w.week === week);
      if (weeklyProjection && weeklyProjection.fantasyPoints) {
        return weeklyProjection.fantasyPoints[scoringType] || 0;
      }

      // Fallback to season projection divided by games
      const seasonProjection = player.projections?.season?.fantasyPoints?.[scoringType] || 0;
      const gamesRemaining = Math.max(1, 17 - (week - 1));
      
      return Math.round((seasonProjection / gamesRemaining) * 100) / 100;

    } catch (error) {
      console.error(`Error getting projected points for player ${player._id}:`, error);
      return 0;
    }
  }

  /**
   * Finalize scores for the week
   */
  async finalizeWeeklyScores() {
    console.log('🏁 Starting weekly score finalization...');

    try {
      const activeLeagues = await League.find({ status: 'ACTIVE' });
      let finalizedMatchups = 0;

      for (const league of activeLeagues) {
        const currentWeek = league.currentWeek || this.getCurrentNFLWeek();
        
        // Get all matchups for the current week
        const matchups = await Matchup.find({
          leagueId: league._id,
          week: currentWeek,
          status: { $in: ['SCHEDULED', 'IN_PROGRESS'] }
        });

        for (const matchup of matchups) {
          try {
            // Final score update
            await this.updateMatchupScores(matchup);
            
            // Finalize the matchup
            await matchup.finalizeMatchup();
            finalizedMatchups++;

          } catch (error) {
            console.error(`Error finalizing matchup ${matchup._id}:`, error);
          }
        }

        // Advance to next week
        if (currentWeek < 18) {
          league.currentWeek = currentWeek + 1;
          await league.save();
        }
      }

      console.log(`✅ Weekly finalization complete: ${finalizedMatchups} matchups finalized`);

    } catch (error) {
      console.error('❌ Weekly finalization failed:', error);
    }
  }

  /**
   * Emit real-time score update
   */
  emitScoreUpdate(matchup) {
    try {
      // This would emit to WebSocket clients
      const io = global.io; // Assuming io is globally available
      if (io) {
        io.to(`league:${matchup.leagueId}`).emit('score:update', {
          matchupId: matchup._id,
          week: matchup.week,
          homeTeam: {
            teamId: matchup.homeTeam.teamId,
            score: matchup.homeTeam.score,
            projectedScore: matchup.homeTeam.projectedScore
          },
          awayTeam: {
            teamId: matchup.awayTeam.teamId,
            score: matchup.awayTeam.score,
            projectedScore: matchup.awayTeam.projectedScore
          },
          status: matchup.status,
          lastUpdated: matchup.lastUpdated
        });
      }
    } catch (error) {
      console.error('Error emitting score update:', error);
    }
  }

  /**
   * Get current NFL week
   */
  getCurrentNFLWeek() {
    const now = new Date();
    const seasonStart = new Date(now.getFullYear(), 8, 1); // September 1st
    const weeksSinceStart = Math.floor((now - seasonStart) / (7 * 24 * 60 * 60 * 1000));
    return Math.min(Math.max(weeksSinceStart + 1, 1), 18);
  }

  /**
   * Manual score update for a specific league/week
   */
  async updateLeagueScoresManually(leagueId, week) {
    console.log(`🔄 Manual score update for league ${leagueId}, week ${week}`);
    
    try {
      const result = await this.updateLeagueScores(leagueId, week);
      console.log(`✅ Manual update complete: ${result.updatedMatchups} matchups updated`);
      return result;
    } catch (error) {
      console.error('❌ Manual score update failed:', error);
      throw error;
    }
  }

  /**
   * Get scoring statistics
   */
  getStats() {
    return {
      isUpdating: this.isUpdating,
      lastUpdateTime: this.lastUpdateTime,
      cacheSize: this.scoringCache.size,
      activeIntervals: this.updateIntervals.size,
      isGameTime: this.isGameTime(),
      currentNFLWeek: this.getCurrentNFLWeek()
    };
  }

  /**
   * Clear scoring cache
   */
  clearCache() {
    this.scoringCache.clear();
    console.log('🧹 Scoring cache cleared');
  }

  /**
   * Stop the scoring engine
   */
  stop() {
    console.log('🛑 Stopping scoring engine...');
    
    for (const [name, interval] of this.updateIntervals) {
      clearInterval(interval);
      console.log(`✅ Stopped ${name} interval`);
    }
    
    this.updateIntervals.clear();
    this.clearCache();
    
    console.log('✅ Scoring engine stopped');
  }

  /**
   * Health check
   */
  healthCheck() {
    return {
      status: 'healthy',
      isUpdating: this.isUpdating,
      lastUpdate: this.lastUpdateTime,
      cacheSize: this.scoringCache.size,
      intervals: Array.from(this.updateIntervals.keys()),
      isGameTime: this.isGameTime(),
      currentWeek: this.getCurrentNFLWeek()
    };
  }
}

// Create singleton instance
const scoringEngine = new ScoringEngine();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, stopping scoring engine...');
  scoringEngine.stop();
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, stopping scoring engine...');
  scoringEngine.stop();
});

module.exports = scoringEngine;