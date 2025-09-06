/**
 * Waiver Processor Service
 * Handles automated waiver processing and scheduling
 */

const cron = require('node-cron');
const Waiver = require('../models/Waiver');
const League = require('../models/League');
const Team = require('../models/Team');

class WaiverProcessor {
  constructor() {
    this.isProcessing = false;
    this.scheduledJobs = new Map();
    this.processingHistory = [];
  }

  /**
   * Initialize waiver processing scheduler
   */
  initialize() {
    console.log('🔄 Initializing waiver processor...');
    
    // Schedule waiver processing for Wednesday at 3 AM
    this.scheduleWaiverProcessing();
    
    // Schedule cleanup of old claims
    this.scheduleCleanup();
    
    // Schedule priority updates
    this.schedulePriorityUpdates();
    
    console.log('✅ Waiver processor initialized');
  }

  /**
   * Schedule automatic waiver processing
   */
  scheduleWaiverProcessing() {
    // Run every Wednesday at 3:00 AM
    const job = cron.schedule('0 3 * * 3', async () => {
      await this.processAllLeagues();
    }, {
      scheduled: true,
      timezone: 'America/New_York'
    });

    this.scheduledJobs.set('waiver_processing', job);
    console.log('📅 Scheduled waiver processing for Wednesdays at 3:00 AM EST');
  }

  /**
   * Schedule cleanup of old waiver claims
   */
  scheduleCleanup() {
    // Run daily at 4:00 AM
    const job = cron.schedule('0 4 * * *', async () => {
      await this.cleanupOldClaims();
    }, {
      scheduled: true,
      timezone: 'America/New_York'
    });

    this.scheduledJobs.set('cleanup', job);
    console.log('📅 Scheduled waiver cleanup for daily at 4:00 AM EST');
  }

  /**
   * Schedule waiver priority updates
   */
  schedulePriorityUpdates() {
    // Run every Tuesday at 11:59 PM (before waiver processing)
    const job = cron.schedule('59 23 * * 2', async () => {
      await this.updateAllPriorities();
    }, {
      scheduled: true,
      timezone: 'America/New_York'
    });

    this.scheduledJobs.set('priority_update', job);
    console.log('📅 Scheduled priority updates for Tuesdays at 11:59 PM EST');
  }

  /**
   * Process waivers for all active leagues
   */
  async processAllLeagues() {
    if (this.isProcessing) {
      console.log('⚠️ Waiver processing already in progress, skipping...');
      return;
    }

    this.isProcessing = true;
    const startTime = new Date();
    
    console.log('🔄 Starting automated waiver processing for all leagues...');

    try {
      // Get all active leagues
      const activeLeagues = await League.find({ 
        status: 'ACTIVE',
        'settings.waiverSettings': { $exists: true }
      });

      console.log(`📊 Found ${activeLeagues.length} active leagues to process`);

      const results = {
        totalLeagues: activeLeagues.length,
        processedLeagues: 0,
        totalClaims: 0,
        successfulClaims: 0,
        failedClaims: 0,
        errors: []
      };

      // Process each league
      for (const league of activeLeagues) {
        try {
          console.log(`🏈 Processing waivers for league: ${league.name}`);
          
          const leagueResult = await Waiver.processLeagueWaivers(league._id);
          
          results.processedLeagues++;
          results.totalClaims += leagueResult.processed;
          results.successfulClaims += leagueResult.successful;
          results.failedClaims += leagueResult.failed;

          // Send notifications to league members
          await this.sendProcessingNotifications(league._id, leagueResult);

          console.log(`✅ League ${league.name}: ${leagueResult.successful} successful, ${leagueResult.failed} failed`);

        } catch (error) {
          console.error(`❌ Error processing league ${league.name}:`, error);
          results.errors.push({
            leagueId: league._id,
            leagueName: league.name,
            error: error.message
          });
        }
      }

      const endTime = new Date();
      const duration = endTime - startTime;

      // Store processing history
      this.processingHistory.push({
        timestamp: startTime,
        duration: duration,
        results: results
      });

      // Keep only last 50 processing records
      if (this.processingHistory.length > 50) {
        this.processingHistory = this.processingHistory.slice(-50);
      }

      console.log('✅ Automated waiver processing completed');
      console.log(`📊 Results: ${results.successfulClaims} successful, ${results.failedClaims} failed across ${results.processedLeagues} leagues`);
      console.log(`⏱️ Duration: ${Math.round(duration / 1000)}s`);

      return results;

    } catch (error) {
      console.error('❌ Automated waiver processing failed:', error);
      throw error;
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Send processing notifications to league members
   */
  async sendProcessingNotifications(leagueId, results) {
    try {
      // This would integrate with email service and WebSocket notifications
      // For now, just log the notification
      console.log(`📧 Sending waiver processing notifications for league ${leagueId}`);
      
      // Get processed claims for this league
      const processedClaims = await Waiver.find({
        leagueId: leagueId,
        processedAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) } // Last hour
      })
        .populate('teamId', 'name owner')
        .populate('addPlayer.playerId', 'name position team')
        .populate('dropPlayer.playerId', 'name position team');

      // Group by team for individual notifications
      const claimsByTeam = new Map();
      processedClaims.forEach(claim => {
        const teamId = claim.teamId._id.toString();
        if (!claimsByTeam.has(teamId)) {
          claimsByTeam.set(teamId, []);
        }
        claimsByTeam.get(teamId).push(claim);
      });

      // Send notifications to each team owner
      for (const [teamId, claims] of claimsByTeam) {
        await this.sendTeamWaiverNotification(teamId, claims);
      }

    } catch (error) {
      console.error('Error sending waiver notifications:', error);
    }
  }

  /**
   * Send waiver notification to team owner
   */
  async sendTeamWaiverNotification(teamId, claims) {
    try {
      const team = await Team.findById(teamId).populate('owner', 'email displayName');
      if (!team || !team.owner) return;

      const successful = claims.filter(c => c.status === 'SUCCESSFUL');
      const failed = claims.filter(c => c.status === 'FAILED');

      console.log(`📧 Waiver notification for ${team.owner.displayName}: ${successful.length} successful, ${failed.length} failed`);

      // This would send actual email notification
      // For now, just log the details
      if (successful.length > 0) {
        console.log('✅ Successful claims:');
        successful.forEach(claim => {
          console.log(`  - Added ${claim.addPlayer?.playerName} for $${claim.bidAmount}`);
        });
      }

      if (failed.length > 0) {
        console.log('❌ Failed claims:');
        failed.forEach(claim => {
          console.log(`  - Failed to add ${claim.addPlayer?.playerName}: ${claim.failureReason}`);
        });
      }

    } catch (error) {
      console.error('Error sending team waiver notification:', error);
    }
  }

  /**
   * Update waiver priorities for all leagues
   */
  async updateAllPriorities() {
    console.log('🔄 Updating waiver priorities for all leagues...');

    try {
      const activeLeagues = await League.find({ 
        status: 'ACTIVE',
        'settings.waiverSettings.type': { $ne: 'faab' } // Only for priority-based leagues
      });

      let updatedLeagues = 0;

      for (const league of activeLeagues) {
        try {
          await Waiver.updateWaiverPriorities(league._id);
          updatedLeagues++;
        } catch (error) {
          console.error(`Error updating priorities for league ${league.name}:`, error);
        }
      }

      console.log(`✅ Updated waiver priorities for ${updatedLeagues} leagues`);

    } catch (error) {
      console.error('❌ Failed to update waiver priorities:', error);
    }
  }

  /**
   * Clean up old waiver claims
   */
  async cleanupOldClaims() {
    console.log('🧹 Cleaning up old waiver claims...');

    try {
      // Expire old pending claims
      const expiredCount = await Waiver.expireOldClaims();
      
      // Delete very old processed claims (older than 1 year)
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
      const deleteResult = await Waiver.deleteMany({
        status: { $in: ['SUCCESSFUL', 'FAILED', 'CANCELLED'] },
        processedAt: { $lt: oneYearAgo }
      });

      console.log(`✅ Cleanup complete: ${expiredCount} expired, ${deleteResult.deletedCount} deleted`);

    } catch (error) {
      console.error('❌ Cleanup failed:', error);
    }
  }

  /**
   * Process waivers for a specific league manually
   */
  async processLeague(leagueId, userId = null) {
    console.log(`🔄 Manual waiver processing for league ${leagueId}`);

    try {
      const league = await League.findById(leagueId);
      if (!league) {
        throw new Error('League not found');
      }

      const result = await Waiver.processLeagueWaivers(leagueId);
      
      // Send notifications
      await this.sendProcessingNotifications(leagueId, result);

      console.log(`✅ Manual processing complete for ${league.name}: ${result.successful} successful, ${result.failed} failed`);

      return result;

    } catch (error) {
      console.error(`❌ Manual processing failed for league ${leagueId}:`, error);
      throw error;
    }
  }

  /**
   * Get processing statistics
   */
  getProcessingStats() {
    const recent = this.processingHistory.slice(-10);
    
    if (recent.length === 0) {
      return {
        totalRuns: 0,
        averageDuration: 0,
        totalClaims: 0,
        successRate: 0,
        lastRun: null
      };
    }

    const totalClaims = recent.reduce((sum, run) => sum + run.results.totalClaims, 0);
    const successfulClaims = recent.reduce((sum, run) => sum + run.results.successfulClaims, 0);
    const averageDuration = recent.reduce((sum, run) => sum + run.duration, 0) / recent.length;

    return {
      totalRuns: this.processingHistory.length,
      recentRuns: recent.length,
      averageDuration: Math.round(averageDuration / 1000), // seconds
      totalClaims: totalClaims,
      successfulClaims: successfulClaims,
      successRate: totalClaims > 0 ? Math.round((successfulClaims / totalClaims) * 100) : 0,
      lastRun: recent[recent.length - 1]?.timestamp,
      isProcessing: this.isProcessing
    };
  }

  /**
   * Get next processing times for all leagues
   */
  async getNextProcessingTimes() {
    const activeLeagues = await League.find({ 
      status: 'ACTIVE',
      'settings.waiverSettings': { $exists: true }
    }).select('name settings.waiverSettings');

    return activeLeagues.map(league => ({
      leagueId: league._id,
      leagueName: league.name,
      nextProcessing: Waiver.getNextProcessingTime(league),
      waiverType: league.settings.waiverSettings.type
    }));
  }

  /**
   * Stop all scheduled jobs
   */
  stop() {
    console.log('🛑 Stopping waiver processor...');
    
    for (const [name, job] of this.scheduledJobs) {
      job.destroy();
      console.log(`✅ Stopped ${name} job`);
    }
    
    this.scheduledJobs.clear();
    console.log('✅ Waiver processor stopped');
  }

  /**
   * Health check
   */
  healthCheck() {
    return {
      status: 'healthy',
      isProcessing: this.isProcessing,
      scheduledJobs: Array.from(this.scheduledJobs.keys()),
      processingHistory: this.processingHistory.length,
      lastProcessing: this.processingHistory.length > 0 ? 
        this.processingHistory[this.processingHistory.length - 1].timestamp : null
    };
  }
}

// Create singleton instance
const waiverProcessor = new WaiverProcessor();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, stopping waiver processor...');
  waiverProcessor.stop();
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, stopping waiver processor...');
  waiverProcessor.stop();
});

module.exports = waiverProcessor;