/**
 * Waiver Routes
 * Handles waiver wire claims, FAAB bidding, and waiver processing
 */

const express = require('express');
const Joi = require('joi');
const Waiver = require('../models/Waiver');
const Team = require('../models/Team');
const Player = require('../models/Player');
const League = require('../models/League');
const { authenticateToken } = require('../middleware/auth');
const dbManager = require('../config/database');

const router = express.Router();

// Validation schemas
const createClaimSchema = Joi.object({
  type: Joi.string().valid('ADD', 'DROP', 'ADD_DROP').required(),
  addPlayerId: Joi.string().when('type', {
    is: Joi.string().valid('ADD', 'ADD_DROP'),
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  dropPlayerId: Joi.string().when('type', {
    is: Joi.string().valid('DROP', 'ADD_DROP'),
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  bidAmount: Joi.number().min(0).default(0),
  notes: Joi.string().max(200).default('')
});

/**
 * POST /api/waivers/claim
 * Submit a waiver claim
 */
router.post('/claim', authenticateToken, async (req, res) => {
  try {
    // Validate input
    const { error, value } = createClaimSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details[0].message
      });
    }

    const claimData = value;

    // Find user's team
    const team = await Team.findOne({ owner: req.userId }).populate('leagueId');
    if (!team) {
      return res.status(404).json({
        error: 'You do not have a team'
      });
    }

    // Check if waivers are open
    const league = team.leagueId;
    const now = new Date();
    const nextProcessing = Waiver.getNextProcessingTime(league);
    
    if (now > nextProcessing) {
      return res.status(400).json({
        error: 'Waiver period has closed for this week'
      });
    }

    // Create waiver claim
    const waiver = await Waiver.createClaim(team._id, claimData);

    // Clear caches
    await dbManager.cacheDel(`team:${team._id}:waivers`);
    await dbManager.cacheDel(`league:${league._id}:waivers`);

    // Populate response
    await waiver.populate([
      { path: 'teamId', select: 'name abbreviation' },
      { path: 'addPlayer.playerId', select: 'name position team rankings photoUrl' },
      { path: 'dropPlayer.playerId', select: 'name position team rankings photoUrl' }
    ]);

    // Emit real-time notification
    const io = req.app.get('io');
    if (io) {
      io.to(`league:${league._id}`).emit('waiver:claim_submitted', {
        teamName: team.name,
        playerName: waiver.addPlayer?.playerName,
        bidAmount: waiver.bidAmount,
        type: waiver.type
      });
    }

    res.status(201).json({
      success: true,
      message: 'Waiver claim submitted successfully',
      waiver: waiver,
      processingTime: nextProcessing
    });

  } catch (error) {
    console.error('Submit waiver claim error:', error);
    res.status(500).json({
      error: 'Failed to submit waiver claim',
      message: error.message
    });
  }
});

/**
 * GET /api/waivers/my-claims
 * Get user's waiver claims
 */
router.get('/my-claims', authenticateToken, async (req, res) => {
  try {
    const status = req.query.status; // PENDING, SUCCESSFUL, FAILED, CANCELLED
    const cacheKey = `user:${req.userId}:waivers:${status || 'all'}`;

    // Try cache first
    const cached = await dbManager.cacheGet(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        claims: cached,
        cached: true
      });
    }

    // Find user's team
    const team = await Team.findOne({ owner: req.userId });
    if (!team) {
      return res.status(404).json({
        error: 'You do not have a team'
      });
    }

    // Get team's waiver claims
    const claims = await Waiver.getTeamClaims(team._id, status);

    // Cache for 2 minutes
    await dbManager.cacheSet(cacheKey, claims, 120);

    res.json({
      success: true,
      claims: claims
    });

  } catch (error) {
    console.error('Get my claims error:', error);
    res.status(500).json({
      error: 'Failed to get waiver claims',
      message: error.message
    });
  }
});

/**
 * GET /api/waivers/league/:leagueId
 * Get all waiver claims for a league
 */
router.get('/league/:leagueId', authenticateToken, async (req, res) => {
  try {
    const leagueId = req.params.leagueId;
    const status = req.query.status;
    const cacheKey = `league:${leagueId}:waivers:${status || 'all'}`;

    // Try cache first
    const cached = await dbManager.cacheGet(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        claims: cached,
        cached: true
      });
    }

    // Check if user has access to this league
    const userTeam = await Team.findOne({
      owner: req.userId,
      leagueId: leagueId
    });

    if (!userTeam) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    // Get league's waiver claims
    const query = { leagueId: leagueId };
    if (status) query.status = status;

    const claims = await Waiver.find(query)
      .populate('teamId', 'name owner abbreviation')
      .populate('addPlayer.playerId', 'name position team rankings photoUrl')
      .populate('dropPlayer.playerId', 'name position team rankings photoUrl')
      .sort({ 'claimDetails.submittedAt': -1 })
      .limit(100);

    // Cache for 5 minutes
    await dbManager.cacheSet(cacheKey, claims, 300);

    res.json({
      success: true,
      claims: claims
    });

  } catch (error) {
    console.error('Get league claims error:', error);
    res.status(500).json({
      error: 'Failed to get league waiver claims',
      message: error.message
    });
  }
});

/**
 * POST /api/waivers/:waiverClaimId/cancel
 * Cancel a pending waiver claim
 */
router.post('/:waiverClaimId/cancel', authenticateToken, async (req, res) => {
  try {
    const waiverClaimId = req.params.waiverClaimId;

    // Find waiver claim
    const waiver = await Waiver.findById(waiverClaimId)
      .populate('teamId', 'name owner');

    if (!waiver) {
      return res.status(404).json({
        error: 'Waiver claim not found'
      });
    }

    // Check if user owns the team
    if (waiver.teamId.owner.toString() !== req.userId.toString()) {
      return res.status(403).json({
        error: 'You can only cancel your own waiver claims'
      });
    }

    // Cancel the claim
    await waiver.cancel(req.userId);

    // Clear caches
    await dbManager.cacheDel(`user:${req.userId}:waivers`);
    await dbManager.cacheDel(`league:${waiver.leagueId}:waivers`);

    // Emit real-time notification
    const io = req.app.get('io');
    if (io) {
      io.to(`league:${waiver.leagueId}`).emit('waiver:claim_cancelled', {
        teamName: waiver.teamId.name,
        playerName: waiver.addPlayer?.playerName
      });
    }

    res.json({
      success: true,
      message: 'Waiver claim cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel waiver claim error:', error);
    res.status(500).json({
      error: 'Failed to cancel waiver claim',
      message: error.message
    });
  }
});

/**
 * GET /api/waivers/available/:leagueId
 * Get available players for waiver claims
 */
router.get('/available/:leagueId', authenticateToken, async (req, res) => {
  try {
    const leagueId = req.params.leagueId;
    const position = req.query.position;
    const limit = parseInt(req.query.limit) || 50;
    const search = req.query.search;

    const cacheKey = `waivers:available:${leagueId}:${position || 'all'}:${limit}:${search || ''}`;

    // Try cache first
    const cached = await dbManager.cacheGet(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        players: cached,
        cached: true
      });
    }

    // Check if user has access to this league
    const userTeam = await Team.findOne({
      owner: req.userId,
      leagueId: leagueId
    });

    if (!userTeam) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    // Get all rostered players in the league
    const teams = await Team.find({ leagueId: leagueId }).select('roster.player');
    const rosteredPlayerIds = teams.reduce((acc, team) => {
      team.roster.forEach(spot => acc.push(spot.player));
      return acc;
    }, []);

    // Build query for available players
    const query = {
      _id: { $nin: rosteredPlayerIds },
      status: 'ACTIVE'
    };

    if (position) query.position = position;
    if (search) {
      query.$text = { $search: search };
    }

    // Get available players
    const players = await Player.find(query)
      .select('name firstName lastName position team jerseyNumber status injuryStatus rankings projections photoUrl')
      .sort(search ? { score: { $meta: 'textScore' } } : { 'rankings.overall': 1 })
      .limit(limit);

    // Add waiver claim info for each player
    const playersWithClaims = await Promise.all(
      players.map(async (player) => {
        const pendingClaims = await Waiver.countDocuments({
          leagueId: leagueId,
          'addPlayer.playerId': player._id,
          status: 'PENDING'
        });

        return {
          ...player.toJSON(),
          pendingClaims: pendingClaims
        };
      })
    );

    // Cache for 5 minutes
    await dbManager.cacheSet(cacheKey, playersWithClaims, 300);

    res.json({
      success: true,
      players: playersWithClaims,
      count: playersWithClaims.length
    });

  } catch (error) {
    console.error('Get available players error:', error);
    res.status(500).json({
      error: 'Failed to get available players',
      message: error.message
    });
  }
});

/**
 * GET /api/waivers/processing-time/:leagueId
 * Get next waiver processing time
 */
router.get('/processing-time/:leagueId', authenticateToken, async (req, res) => {
  try {
    const leagueId = req.params.leagueId;

    // Check if user has access to this league
    const userTeam = await Team.findOne({
      owner: req.userId,
      leagueId: leagueId
    });

    if (!userTeam) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    // Get league
    const league = await League.findById(leagueId);
    if (!league) {
      return res.status(404).json({
        error: 'League not found'
      });
    }

    // Calculate next processing time
    const nextProcessing = Waiver.getNextProcessingTime(league);
    const now = new Date();
    const timeUntilProcessing = nextProcessing.getTime() - now.getTime();

    // Get pending claims count
    const pendingClaims = await Waiver.countDocuments({
      leagueId: leagueId,
      status: 'PENDING'
    });

    res.json({
      success: true,
      nextProcessing: nextProcessing,
      timeUntilProcessing: Math.max(0, timeUntilProcessing),
      hoursUntilProcessing: Math.max(0, Math.floor(timeUntilProcessing / (1000 * 60 * 60))),
      pendingClaims: pendingClaims,
      waiverSettings: league.settings.waiverSettings
    });

  } catch (error) {
    console.error('Get processing time error:', error);
    res.status(500).json({
      error: 'Failed to get processing time',
      message: error.message
    });
  }
});

/**
 * POST /api/waivers/process/:leagueId
 * Process waivers for a league (commissioner or admin only)
 */
router.post('/process/:leagueId', authenticateToken, async (req, res) => {
  try {
    const leagueId = req.params.leagueId;

    // Get league and check permissions
    const league = await League.findById(leagueId);
    if (!league) {
      return res.status(404).json({
        error: 'League not found'
      });
    }

    // Check if user is commissioner or admin
    const isCommissioner = league.isCommissioner(req.userId);
    const isAdmin = req.user.role === 'ADMIN';

    if (!isCommissioner && !isAdmin) {
      return res.status(403).json({
        error: 'Only commissioners and admins can process waivers'
      });
    }

    // Process waivers
    const results = await Waiver.processLeagueWaivers(leagueId);

    // Clear caches
    await dbManager.cacheDel(`league:${leagueId}:waivers`);
    
    // Clear all team waiver caches for this league
    const teams = await Team.find({ leagueId: leagueId }).select('owner');
    for (const team of teams) {
      await dbManager.cacheDel(`user:${team.owner}:waivers`);
    }

    // Emit real-time notification
    const io = req.app.get('io');
    if (io) {
      io.to(`league:${leagueId}`).emit('waiver:processing_complete', {
        results: results,
        processedBy: req.user.displayName
      });
    }

    res.json({
      success: true,
      message: 'Waivers processed successfully',
      results: results
    });

  } catch (error) {
    console.error('Process waivers error:', error);
    res.status(500).json({
      error: 'Failed to process waivers',
      message: error.message
    });
  }
});

/**
 * GET /api/waivers/report/:leagueId
 * Get waiver processing report
 */
router.get('/report/:leagueId', authenticateToken, async (req, res) => {
  try {
    const leagueId = req.params.leagueId;
    const week = parseInt(req.query.week) || null;

    // Check if user has access to this league
    const userTeam = await Team.findOne({
      owner: req.userId,
      leagueId: leagueId
    });

    if (!userTeam) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    // Build query
    const query = { leagueId: leagueId, status: { $in: ['SUCCESSFUL', 'FAILED'] } };
    if (week) query.week = week;

    // Get processed claims
    const claims = await Waiver.find(query)
      .populate('teamId', 'name abbreviation')
      .populate('addPlayer.playerId', 'name position team')
      .populate('dropPlayer.playerId', 'name position team')
      .sort({ processedAt: -1 })
      .limit(100);

    // Generate summary statistics
    const summary = {
      totalClaims: claims.length,
      successful: claims.filter(c => c.status === 'SUCCESSFUL').length,
      failed: claims.filter(c => c.status === 'FAILED').length,
      totalFaabSpent: claims
        .filter(c => c.status === 'SUCCESSFUL')
        .reduce((sum, c) => sum + c.bidAmount, 0),
      averageBid: 0,
      topBids: []
    };

    const successfulClaims = claims.filter(c => c.status === 'SUCCESSFUL' && c.bidAmount > 0);
    if (successfulClaims.length > 0) {
      summary.averageBid = summary.totalFaabSpent / successfulClaims.length;
      summary.topBids = successfulClaims
        .sort((a, b) => b.bidAmount - a.bidAmount)
        .slice(0, 5)
        .map(c => ({
          playerName: c.addPlayer.playerName,
          teamName: c.teamId.name,
          bidAmount: c.bidAmount
        }));
    }

    res.json({
      success: true,
      claims: claims,
      summary: summary,
      week: week
    });

  } catch (error) {
    console.error('Get waiver report error:', error);
    res.status(500).json({
      error: 'Failed to get waiver report',
      message: error.message
    });
  }
});

/**
 * GET /api/waivers/budget/:teamId
 * Get team's FAAB budget information
 */
router.get('/budget/:teamId', authenticateToken, async (req, res) => {
  try {
    const teamId = req.params.teamId;

    // Find team
    const team = await Team.findById(teamId).populate('leagueId');
    if (!team) {
      return res.status(404).json({
        error: 'Team not found'
      });
    }

    // Check if user has access (own team or same league)
    const userTeam = await Team.findOne({
      owner: req.userId,
      leagueId: team.leagueId._id
    });

    if (!userTeam) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    // Get pending claims total
    const pendingClaims = await Waiver.find({
      teamId: teamId,
      status: 'PENDING'
    });

    const pendingBids = pendingClaims.reduce((sum, claim) => sum + claim.bidAmount, 0);

    // Calculate available budget
    const availableBudget = team.faabBudget.remaining - pendingBids;

    res.json({
      success: true,
      budget: {
        total: team.leagueId.settings.waiverSettings.budget || 100,
        remaining: team.faabBudget.remaining,
        spent: team.faabBudget.spent,
        pendingBids: pendingBids,
        available: Math.max(0, availableBudget)
      },
      pendingClaims: pendingClaims.length
    });

  } catch (error) {
    console.error('Get FAAB budget error:', error);
    res.status(500).json({
      error: 'Failed to get FAAB budget',
      message: error.message
    });
  }
});

module.exports = router;