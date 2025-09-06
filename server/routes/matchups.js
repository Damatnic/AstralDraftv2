/**
 * Matchup Routes
 * Handles fantasy football matchups and scoring
 */

const express = require('express');
const Joi = require('joi');
const Matchup = require('../models/Matchup');
const Team = require('../models/Team');
const League = require('../models/League');
const scoringEngine = require('../services/scoringEngine');
const { authenticateToken } = require('../middleware/auth');
const dbManager = require('../config/database');

const router = express.Router();

// Validation schemas
const createMatchupsSchema = Joi.object({
  leagueId: Joi.string().required(),
  week: Joi.number().min(1).max(18).required()
});

const updateScoreSchema = Joi.object({
  teamId: Joi.string().required(),
  score: Joi.number().min(0).required(),
  lineup: Joi.array().items(Joi.object({
    player: Joi.string().required(),
    position: Joi.string().required(),
    points: Joi.number().default(0),
    projectedPoints: Joi.number().default(0),
    isStarter: Joi.boolean().default(true)
  })).optional()
});

/**
 * POST /api/matchups/create
 * Create weekly matchups for a league
 */
router.post('/create', authenticateToken, async (req, res) => {
  try {
    // Validate input
    const { error, value } = createMatchupsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details[0].message
      });
    }

    const { leagueId, week } = value;

    // Check if user is commissioner
    const league = await League.findById(leagueId);
    if (!league) {
      return res.status(404).json({
        error: 'League not found'
      });
    }

    if (!league.isCommissioner(req.userId)) {
      return res.status(403).json({
        error: 'Only commissioners can create matchups'
      });
    }

    // Check if matchups already exist for this week
    const existingMatchups = await Matchup.find({ leagueId: leagueId, week: week });
    if (existingMatchups.length > 0) {
      return res.status(409).json({
        error: 'Matchups already exist for this week'
      });
    }

    // Create matchups
    const matchups = await Matchup.createWeeklyMatchups(leagueId, week);

    // Clear caches
    await dbManager.cacheDel(`league:${leagueId}:matchups:${week}`);

    res.status(201).json({
      success: true,
      message: 'Matchups created successfully',
      matchups: matchups,
      count: matchups.length
    });

  } catch (error) {
    console.error('Create matchups error:', error);
    res.status(500).json({
      error: 'Failed to create matchups',
      message: error.message
    });
  }
});

/**
 * GET /api/matchups/league/:leagueId/week/:week
 * Get matchups for a specific league and week
 */
router.get('/league/:leagueId/week/:week', authenticateToken, async (req, res) => {
  try {
    const leagueId = req.params.leagueId;
    const week = parseInt(req.params.week);
    const cacheKey = `league:${leagueId}:matchups:${week}`;

    // Try cache first
    const cached = await dbManager.cacheGet(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        matchups: cached,
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

    // Get matchups
    const matchups = await Matchup.getWeeklyMatchups(leagueId, week);

    // Cache for 2 minutes
    await dbManager.cacheSet(cacheKey, matchups, 120);

    res.json({
      success: true,
      matchups: matchups,
      week: week
    });

  } catch (error) {
    console.error('Get weekly matchups error:', error);
    res.status(500).json({
      error: 'Failed to get matchups',
      message: error.message
    });
  }
});

/**
 * GET /api/matchups/league/:leagueId/current
 * Get current week matchups for a league
 */
router.get('/league/:leagueId/current', authenticateToken, async (req, res) => {
  try {
    const leagueId = req.params.leagueId;
    const cacheKey = `league:${leagueId}:matchups:current`;

    // Try cache first
    const cached = await dbManager.cacheGet(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        matchups: cached,
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

    // Get current matchups
    const matchups = await Matchup.getCurrentMatchups(leagueId);

    // Cache for 1 minute
    await dbManager.cacheSet(cacheKey, matchups, 60);

    res.json({
      success: true,
      matchups: matchups
    });

  } catch (error) {
    console.error('Get current matchups error:', error);
    res.status(500).json({
      error: 'Failed to get current matchups',
      message: error.message
    });
  }
});

/**
 * GET /api/matchups/team/:teamId
 * Get all matchups for a specific team
 */
router.get('/team/:teamId', authenticateToken, async (req, res) => {
  try {
    const teamId = req.params.teamId;
    const season = req.query.season ? parseInt(req.query.season) : null;
    const cacheKey = `team:${teamId}:matchups:${season || 'current'}`;

    // Try cache first
    const cached = await dbManager.cacheGet(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        matchups: cached,
        cached: true
      });
    }

    // Check if user owns this team or is in the same league
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        error: 'Team not found'
      });
    }

    const userTeam = await Team.findOne({
      owner: req.userId,
      leagueId: team.leagueId
    });

    if (!userTeam) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    // Get team matchups
    const matchups = await Matchup.getTeamMatchups(teamId, season);

    // Cache for 5 minutes
    await dbManager.cacheSet(cacheKey, matchups, 300);

    res.json({
      success: true,
      matchups: matchups,
      teamId: teamId,
      season: season
    });

  } catch (error) {
    console.error('Get team matchups error:', error);
    res.status(500).json({
      error: 'Failed to get team matchups',
      message: error.message
    });
  }
});

/**
 * GET /api/matchups/:matchupId
 * Get specific matchup details
 */
router.get('/:matchupId', authenticateToken, async (req, res) => {
  try {
    const matchupId = req.params.matchupId;
    const cacheKey = `matchup:${matchupId}:details`;

    // Try cache first
    const cached = await dbManager.cacheGet(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        matchup: cached,
        cached: true
      });
    }

    // Find matchup
    const matchup = await Matchup.findById(matchupId)
      .populate([
        { path: 'homeTeam.teamId', select: 'name owner abbreviation', populate: { path: 'owner', select: 'displayName avatar' } },
        { path: 'awayTeam.teamId', select: 'name owner abbreviation', populate: { path: 'owner', select: 'displayName avatar' } },
        { path: 'homeTeam.lineup.player', select: 'name position team photoUrl' },
        { path: 'awayTeam.lineup.player', select: 'name position team photoUrl' }
      ]);

    if (!matchup) {
      return res.status(404).json({
        error: 'Matchup not found'
      });
    }

    // Check if user has access
    const userTeam = await Team.findOne({
      owner: req.userId,
      leagueId: matchup.leagueId
    });

    if (!userTeam) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    // Cache for 1 minute
    await dbManager.cacheSet(cacheKey, matchup, 60);

    res.json({
      success: true,
      matchup: matchup
    });

  } catch (error) {
    console.error('Get matchup details error:', error);
    res.status(500).json({
      error: 'Failed to get matchup details',
      message: error.message
    });
  }
});

/**
 * POST /api/matchups/:matchupId/update-score
 * Update matchup score (commissioner only)
 */
router.post('/:matchupId/update-score', authenticateToken, async (req, res) => {
  try {
    const matchupId = req.params.matchupId;

    // Validate input
    const { error, value } = updateScoreSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details[0].message
      });
    }

    const { teamId, score, lineup } = value;

    // Find matchup
    const matchup = await Matchup.findById(matchupId).populate('leagueId');
    if (!matchup) {
      return res.status(404).json({
        error: 'Matchup not found'
      });
    }

    // Check if user is commissioner
    if (!matchup.leagueId.isCommissioner(req.userId)) {
      return res.status(403).json({
        error: 'Only commissioners can update scores'
      });
    }

    // Update score
    await matchup.updateScore(teamId, score, lineup);

    // Clear caches
    await dbManager.cacheDel(`matchup:${matchupId}:details`);
    await dbManager.cacheDel(`league:${matchup.leagueId._id}:matchups:${matchup.week}`);

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(`league:${matchup.leagueId._id}`).emit('matchup:score_updated', {
        matchupId: matchupId,
        teamId: teamId,
        score: score,
        updatedBy: req.user.displayName
      });
    }

    res.json({
      success: true,
      message: 'Score updated successfully',
      matchup: matchup
    });

  } catch (error) {
    console.error('Update matchup score error:', error);
    res.status(500).json({
      error: 'Failed to update score',
      message: error.message
    });
  }
});

/**
 * POST /api/matchups/:matchupId/finalize
 * Finalize a matchup (commissioner only)
 */
router.post('/:matchupId/finalize', authenticateToken, async (req, res) => {
  try {
    const matchupId = req.params.matchupId;

    // Find matchup
    const matchup = await Matchup.findById(matchupId).populate('leagueId');
    if (!matchup) {
      return res.status(404).json({
        error: 'Matchup not found'
      });
    }

    // Check if user is commissioner
    if (!matchup.leagueId.isCommissioner(req.userId)) {
      return res.status(403).json({
        error: 'Only commissioners can finalize matchups'
      });
    }

    // Finalize matchup
    await matchup.finalizeMatchup();

    // Clear caches
    await dbManager.cacheDel(`matchup:${matchupId}:details`);
    await dbManager.cacheDel(`league:${matchup.leagueId._id}:matchups:${matchup.week}`);

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(`league:${matchup.leagueId._id}`).emit('matchup:finalized', {
        matchupId: matchupId,
        winner: matchup.winner,
        finalizedBy: req.user.displayName
      });
    }

    res.json({
      success: true,
      message: 'Matchup finalized successfully',
      matchup: matchup
    });

  } catch (error) {
    console.error('Finalize matchup error:', error);
    res.status(500).json({
      error: 'Failed to finalize matchup',
      message: error.message
    });
  }
});

/**
 * POST /api/matchups/update-scores/:leagueId/:week
 * Update live scores for all matchups in a league/week
 */
router.post('/update-scores/:leagueId/:week', authenticateToken, async (req, res) => {
  try {
    const leagueId = req.params.leagueId;
    const week = parseInt(req.params.week);

    // Check if user is commissioner or admin
    const league = await League.findById(leagueId);
    if (!league) {
      return res.status(404).json({
        error: 'League not found'
      });
    }

    const isCommissioner = league.isCommissioner(req.userId);
    const isAdmin = req.user.role === 'ADMIN';

    if (!isCommissioner && !isAdmin) {
      return res.status(403).json({
        error: 'Only commissioners and admins can update scores'
      });
    }

    // Update scores using scoring engine
    const result = await scoringEngine.updateLeagueScoresManually(leagueId, week);

    // Clear caches
    await dbManager.cacheDel(`league:${leagueId}:matchups:${week}`);

    res.json({
      success: true,
      message: 'Scores updated successfully',
      result: result
    });

  } catch (error) {
    console.error('Update league scores error:', error);
    res.status(500).json({
      error: 'Failed to update scores',
      message: error.message
    });
  }
});

/**
 * GET /api/matchups/playoffs/:leagueId
 * Get playoff matchups for a league
 */
router.get('/playoffs/:leagueId', authenticateToken, async (req, res) => {
  try {
    const leagueId = req.params.leagueId;
    const round = req.query.round ? parseInt(req.query.round) : null;
    const cacheKey = `league:${leagueId}:playoffs:${round || 'all'}`;

    // Try cache first
    const cached = await dbManager.cacheGet(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        matchups: cached,
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

    // Get playoff matchups
    const matchups = await Matchup.getPlayoffMatchups(leagueId, round);

    // Cache for 5 minutes
    await dbManager.cacheSet(cacheKey, matchups, 300);

    res.json({
      success: true,
      matchups: matchups,
      round: round
    });

  } catch (error) {
    console.error('Get playoff matchups error:', error);
    res.status(500).json({
      error: 'Failed to get playoff matchups',
      message: error.message
    });
  }
});

/**
 * GET /api/matchups/scoring-stats
 * Get scoring engine statistics
 */
router.get('/scoring-stats', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        error: 'Admin access required'
      });
    }

    const stats = scoringEngine.getStats();

    res.json({
      success: true,
      stats: stats
    });

  } catch (error) {
    console.error('Get scoring stats error:', error);
    res.status(500).json({
      error: 'Failed to get scoring stats',
      message: error.message
    });
  }
});

module.exports = router;