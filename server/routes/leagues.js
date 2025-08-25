/**
 * League Routes
 * Handles league creation, management, and operations
 */

const express = require('express');
const Joi = require('joi');
const League = require('../models/League');
const Team = require('../models/Team');
const User = require('../models/User');
const { authenticateToken, requireEmailVerification } = require('../middleware/auth');
const dbManager = require('../config/database');

const router = express.Router();

// Validation schemas
const createLeagueSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required(),
  description: Joi.string().max(500).optional(),
  maxTeams: Joi.number().min(4).max(20).default(10),
  scoringType: Joi.string().valid('standard', 'ppr', 'half-ppr', 'superflex').default('ppr'),
  draftType: Joi.string().valid('snake', 'auction', 'linear').default('snake'),
  isPublic: Joi.boolean().default(false),
  password: Joi.string().min(4).max(50).optional(),
  draftDate: Joi.date().min('now').optional(),
  settings: Joi.object().optional()
});

const joinLeagueSchema = Joi.object({
  inviteCode: Joi.string().length(8).uppercase().required(),
  password: Joi.string().optional(),
  teamName: Joi.string().trim().min(3).max(50).required()
});

const updateLeagueSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).optional(),
  description: Joi.string().max(500).optional(),
  draftDate: Joi.date().min('now').optional(),
  settings: Joi.object().optional()
});

/**
 * GET /api/leagues
 * Get user's leagues
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const cacheKey = `user:${req.userId}:leagues`;
    
    // Try cache first
    const cached = await dbManager.cacheGet(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        leagues: cached,
        cached: true
      });
    }

    // Find teams owned by user
    const teams = await Team.find({ owner: req.userId })
      .populate({
        path: 'leagueId',
        populate: {
          path: 'commissionerId',
          select: 'username displayName avatar'
        }
      })
      .sort({ createdAt: -1 });

    const leagues = teams.map(team => ({
      ...team.leagueId.toJSON(),
      userTeam: {
        id: team._id,
        name: team.name,
        abbreviation: team.abbreviation,
        logo: team.logo,
        record: team.record,
        points: team.points,
        draftPosition: team.draftPosition
      }
    }));

    // Cache for 5 minutes
    await dbManager.cacheSet(cacheKey, leagues, 300);

    res.json({
      success: true,
      leagues: leagues
    });

  } catch (error) {
    console.error('Get leagues error:', error);
    res.status(500).json({
      error: 'Failed to fetch leagues',
      message: error.message
    });
  }
});

/**
 * POST /api/leagues
 * Create a new league
 */
router.post('/', authenticateToken, requireEmailVerification, async (req, res) => {
  try {
    // Validate input
    const { error, value } = createLeagueSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details[0].message
      });
    }

    const leagueData = value;

    // Generate unique invite code
    const inviteCode = await League.generateInviteCode();

    // Create league
    const league = new League({
      ...leagueData,
      commissionerId: req.userId,
      inviteCode: inviteCode,
      season: new Date().getFullYear()
    });

    await league.save();

    // Create commissioner's team
    const commissionerTeam = new Team({
      name: `${req.user.displayName}'s Team`,
      abbreviation: req.user.displayName.substring(0, 4).toUpperCase(),
      owner: req.userId,
      leagueId: league._id,
      draftPosition: 1 // Commissioner gets first pick by default
    });

    await commissionerTeam.save();

    // Update user stats
    await User.findByIdAndUpdate(req.userId, {
      $inc: { 'stats.totalLeagues': 1 }
    });

    // Clear user's leagues cache
    await dbManager.cacheDel(`user:${req.userId}:leagues`);

    // Populate response
    await league.populate('commissionerId', 'username displayName avatar');

    res.status(201).json({
      success: true,
      message: 'League created successfully',
      league: {
        ...league.toJSON(),
        userTeam: commissionerTeam.toJSON()
      }
    });

  } catch (error) {
    console.error('Create league error:', error);
    res.status(500).json({
      error: 'Failed to create league',
      message: error.message
    });
  }
});

/**
 * GET /api/leagues/public
 * Get public leagues available to join
 */
router.get('/public', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const cacheKey = `public:leagues:${page}:${limit}`;
    
    // Try cache first
    const cached = await dbManager.cacheGet(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        ...cached,
        cached: true
      });
    }

    // Find public leagues that aren't full
    const leagues = await League.aggregate([
      {
        $match: {
          isPublic: true,
          status: 'DRAFT'
        }
      },
      {
        $lookup: {
          from: 'teams',
          localField: '_id',
          foreignField: 'leagueId',
          as: 'teams'
        }
      },
      {
        $addFields: {
          teamCount: { $size: '$teams' }
        }
      },
      {
        $match: {
          $expr: { $lt: ['$teamCount', '$settings.maxTeams'] }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'commissionerId',
          foreignField: '_id',
          as: 'commissioner',
          pipeline: [
            { $project: { username: 1, displayName: 1, avatar: 1 } }
          ]
        }
      },
      {
        $unwind: '$commissioner'
      },
      {
        $project: {
          name: 1,
          description: 1,
          commissioner: 1,
          teamCount: 1,
          'settings.maxTeams': 1,
          'settings.scoringType': 1,
          'settings.draftType': 1,
          draftDate: '$settings.draftDate',
          createdAt: 1
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    ]);

    const total = await League.countDocuments({
      isPublic: true,
      status: 'DRAFT'
    });

    const result = {
      leagues: leagues,
      pagination: {
        page: page,
        limit: limit,
        total: total,
        pages: Math.ceil(total / limit)
      }
    };

    // Cache for 2 minutes
    await dbManager.cacheSet(cacheKey, result, 120);

    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('Get public leagues error:', error);
    res.status(500).json({
      error: 'Failed to fetch public leagues',
      message: error.message
    });
  }
});

/**
 * POST /api/leagues/join
 * Join a league by invite code
 */
router.post('/join', authenticateToken, requireEmailVerification, async (req, res) => {
  try {
    // Validate input
    const { error, value } = joinLeagueSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details[0].message
      });
    }

    const { inviteCode, password, teamName } = value;

    // Find league
    const league = await League.findOne({ inviteCode: inviteCode });
    if (!league) {
      return res.status(404).json({
        error: 'League not found',
        message: 'Invalid invite code'
      });
    }

    // Check if league is joinable
    if (!league.canJoin()) {
      return res.status(400).json({
        error: 'Cannot join league',
        message: 'League is full or no longer accepting new members'
      });
    }

    // Check password if required
    if (league.password && league.password !== password) {
      return res.status(401).json({
        error: 'Invalid password',
        message: 'Incorrect league password'
      });
    }

    // Check if user already has a team in this league
    const existingTeam = await Team.findOne({
      owner: req.userId,
      leagueId: league._id
    });

    if (existingTeam) {
      return res.status(409).json({
        error: 'Already in league',
        message: 'You already have a team in this league'
      });
    }

    // Get current team count for draft position
    const teamCount = await Team.countDocuments({ leagueId: league._id });

    // Create team
    const team = new Team({
      name: teamName,
      abbreviation: teamName.substring(0, 4).toUpperCase(),
      owner: req.userId,
      leagueId: league._id,
      draftPosition: teamCount + 1
    });

    await team.save();

    // Update user stats
    await User.findByIdAndUpdate(req.userId, {
      $inc: { 'stats.totalLeagues': 1 }
    });

    // Clear caches
    await dbManager.cacheDel(`user:${req.userId}:leagues`);
    await dbManager.cacheDel(`league:${league._id}:teams`);

    // Populate response
    await team.populate('owner', 'username displayName avatar');
    await league.populate('commissionerId', 'username displayName avatar');

    res.json({
      success: true,
      message: 'Successfully joined league',
      league: league.toJSON(),
      team: team.toJSON()
    });

  } catch (error) {
    console.error('Join league error:', error);
    res.status(500).json({
      error: 'Failed to join league',
      message: error.message
    });
  }
});

/**
 * GET /api/leagues/:id
 * Get league details
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const leagueId = req.params.id;
    const cacheKey = `league:${leagueId}:details`;

    // Try cache first
    const cached = await dbManager.cacheGet(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        league: cached,
        cached: true
      });
    }

    // Find league
    const league = await League.findById(leagueId)
      .populate('commissionerId', 'username displayName avatar');

    if (!league) {
      return res.status(404).json({
        error: 'League not found'
      });
    }

    // Check if user has access to this league
    const userTeam = await Team.findOne({
      owner: req.userId,
      leagueId: leagueId
    });

    if (!userTeam && !league.isPublic) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have access to this league'
      });
    }

    // Get all teams in league
    const teams = await Team.find({ leagueId: leagueId })
      .populate('owner', 'username displayName avatar')
      .sort({ 'record.wins': -1, 'points.pointsFor': -1 });

    const leagueData = {
      ...league.toJSON(),
      teams: teams,
      userTeam: userTeam ? userTeam.toJSON() : null,
      isCommissioner: league.isCommissioner(req.userId)
    };

    // Cache for 2 minutes
    await dbManager.cacheSet(cacheKey, leagueData, 120);

    res.json({
      success: true,
      league: leagueData
    });

  } catch (error) {
    console.error('Get league error:', error);
    res.status(500).json({
      error: 'Failed to fetch league',
      message: error.message
    });
  }
});

/**
 * PUT /api/leagues/:id
 * Update league settings (commissioner only)
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const leagueId = req.params.id;

    // Validate input
    const { error, value } = updateLeagueSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details[0].message
      });
    }

    // Find league
    const league = await League.findById(leagueId);
    if (!league) {
      return res.status(404).json({
        error: 'League not found'
      });
    }

    // Check if user is commissioner
    if (!league.isCommissioner(req.userId)) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Only the commissioner can update league settings'
      });
    }

    // Update league
    Object.assign(league, value);
    await league.save();

    // Clear caches
    await dbManager.cacheDel(`league:${leagueId}:details`);
    await dbManager.cacheDel(`user:${req.userId}:leagues`);

    res.json({
      success: true,
      message: 'League updated successfully',
      league: league.toJSON()
    });

  } catch (error) {
    console.error('Update league error:', error);
    res.status(500).json({
      error: 'Failed to update league',
      message: error.message
    });
  }
});

/**
 * DELETE /api/leagues/:id
 * Delete league (commissioner only)
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const leagueId = req.params.id;

    // Find league
    const league = await League.findById(leagueId);
    if (!league) {
      return res.status(404).json({
        error: 'League not found'
      });
    }

    // Check if user is commissioner
    if (!league.isCommissioner(req.userId)) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Only the commissioner can delete the league'
      });
    }

    // Check if league can be deleted (only if draft hasn't started)
    if (league.status !== 'DRAFT') {
      return res.status(400).json({
        error: 'Cannot delete league',
        message: 'League cannot be deleted after draft has started'
      });
    }

    // Delete all teams in league
    await Team.deleteMany({ leagueId: leagueId });

    // Delete league
    await League.findByIdAndDelete(leagueId);

    // Clear caches
    await dbManager.cacheDel(`league:${leagueId}:details`);
    await dbManager.cacheDel(`user:${req.userId}:leagues`);

    res.json({
      success: true,
      message: 'League deleted successfully'
    });

  } catch (error) {
    console.error('Delete league error:', error);
    res.status(500).json({
      error: 'Failed to delete league',
      message: error.message
    });
  }
});

/**
 * GET /api/leagues/:id/standings
 * Get league standings
 */
router.get('/:id/standings', authenticateToken, async (req, res) => {
  try {
    const leagueId = req.params.id;
    const cacheKey = `league:${leagueId}:standings`;

    // Try cache first
    const cached = await dbManager.cacheGet(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        standings: cached,
        cached: true
      });
    }

    // Verify user has access to league
    const userTeam = await Team.findOne({
      owner: req.userId,
      leagueId: leagueId
    });

    if (!userTeam) {
      const league = await League.findById(leagueId);
      if (!league || !league.isPublic) {
        return res.status(403).json({
          error: 'Access denied'
        });
      }
    }

    // Get standings
    const standings = await Team.getLeagueStandings(leagueId);

    // Cache for 5 minutes
    await dbManager.cacheSet(cacheKey, standings, 300);

    res.json({
      success: true,
      standings: standings
    });

  } catch (error) {
    console.error('Get standings error:', error);
    res.status(500).json({
      error: 'Failed to fetch standings',
      message: error.message
    });
  }
});

/**
 * POST /api/leagues/:id/leave
 * Leave a league
 */
router.post('/:id/leave', authenticateToken, async (req, res) => {
  try {
    const leagueId = req.params.id;

    // Find user's team in league
    const team = await Team.findOne({
      owner: req.userId,
      leagueId: leagueId
    });

    if (!team) {
      return res.status(404).json({
        error: 'Team not found',
        message: 'You are not a member of this league'
      });
    }

    // Find league
    const league = await League.findById(leagueId);
    if (!league) {
      return res.status(404).json({
        error: 'League not found'
      });
    }

    // Check if user is commissioner
    if (league.isCommissioner(req.userId)) {
      return res.status(400).json({
        error: 'Cannot leave league',
        message: 'Commissioners cannot leave their own league. Transfer ownership or delete the league instead.'
      });
    }

    // Check if league has started
    if (league.status !== 'DRAFT') {
      return res.status(400).json({
        error: 'Cannot leave league',
        message: 'Cannot leave league after draft has started'
      });
    }

    // Delete team
    await Team.findByIdAndDelete(team._id);

    // Update user stats
    await User.findByIdAndUpdate(req.userId, {
      $inc: { 'stats.totalLeagues': -1 }
    });

    // Clear caches
    await dbManager.cacheDel(`user:${req.userId}:leagues`);
    await dbManager.cacheDel(`league:${leagueId}:details`);
    await dbManager.cacheDel(`league:${leagueId}:standings`);

    res.json({
      success: true,
      message: 'Successfully left league'
    });

  } catch (error) {
    console.error('Leave league error:', error);
    res.status(500).json({
      error: 'Failed to leave league',
      message: error.message
    });
  }
});

module.exports = router;