/**
 * Draft Routes
 * Handles draft creation, management, and operations
 */

const express = require('express');
const Joi = require('joi');
const Draft = require('../models/Draft');
const League = require('../models/League');
const Team = require('../models/Team');
const Player = require('../models/Player');
const { authenticateToken } = require('../middleware/auth');
const dbManager = require('../config/database');

const router = express.Router();

// Validation schemas
const createDraftSchema = Joi.object({
  leagueId: Joi.string().required(),
  scheduledDate: Joi.date().min('now').required(),
  settings: Joi.object({
    pickTimeLimit: Joi.number().min(30).max(300).default(90),
    rounds: Joi.number().min(10).max(20).default(15),
    autoPickEnabled: Joi.boolean().default(true),
    tradingEnabled: Joi.boolean().default(false),
    pauseOnDisconnect: Joi.boolean().default(true),
    auctionSettings: Joi.object({
      budget: Joi.number().min(100).max(500).default(200),
      minBid: Joi.number().min(1).max(10).default(1),
      bidIncrement: Joi.number().min(1).max(5).default(1),
      nominationTime: Joi.number().min(15).max(60).default(30),
      biddingTime: Joi.number().min(10).max(30).default(15)
    }).optional()
  }).optional()
});

const makePickSchema = Joi.object({
  playerId: Joi.string().required(),
  pickTime: Joi.number().min(0).max(300).optional()
});

const chatMessageSchema = Joi.object({
  message: Joi.string().min(1).max(500).required()
});

/**
 * POST /api/draft/create
 * Create a new draft for a league
 */
router.post('/create', authenticateToken, async (req, res) => {
  try {
    // Validate input
    const { error, value } = createDraftSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details[0].message
      });
    }

    const { leagueId, scheduledDate, settings } = value;

    // Check if user is commissioner of the league
    const league = await League.findById(leagueId);
    if (!league) {
      return res.status(404).json({
        error: 'League not found'
      });
    }

    if (!league.isCommissioner(req.userId)) {
      return res.status(403).json({
        error: 'Only the commissioner can create a draft'
      });
    }

    // Check if draft already exists
    const existingDraft = await Draft.findOne({ 
      leagueId: leagueId,
      status: { $in: ['SCHEDULED', 'IN_PROGRESS', 'PAUSED'] }
    });

    if (existingDraft) {
      return res.status(409).json({
        error: 'Draft already exists for this league'
      });
    }

    // Create draft
    const draft = await Draft.createDraft(leagueId, {
      ...settings,
      scheduledDate: new Date(scheduledDate)
    });

    // Update league status
    league.status = 'DRAFT';
    league.settings.draftDate = new Date(scheduledDate);
    await league.save();

    // Clear cache
    await dbManager.cacheDel(`league:${leagueId}:details`);

    // Populate response
    await draft.populate([
      { path: 'leagueId', select: 'name settings' },
      { path: 'draftOrder.teamId', select: 'name owner abbreviation', populate: { path: 'owner', select: 'username displayName avatar' } }
    ]);

    res.status(201).json({
      success: true,
      message: 'Draft created successfully',
      draft: draft
    });

  } catch (error) {
    console.error('Create draft error:', error);
    res.status(500).json({
      error: 'Failed to create draft',
      message: error.message
    });
  }
});

/**
 * GET /api/draft/league/:leagueId
 * Get draft for a specific league
 */
router.get('/league/:leagueId', authenticateToken, async (req, res) => {
  try {
    const leagueId = req.params.leagueId;
    const cacheKey = `draft:league:${leagueId}`;

    // Try cache first
    const cached = await dbManager.cacheGet(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        draft: cached,
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

    // Find draft
    const draft = await Draft.findOne({ leagueId: leagueId })
      .populate([
        { path: 'leagueId', select: 'name settings' },
        { path: 'draftOrder.teamId', select: 'name owner abbreviation', populate: { path: 'owner', select: 'username displayName avatar' } },
        { path: 'picks.teamId', select: 'name abbreviation' },
        { path: 'picks.playerId', select: 'name position team rankings' },
        { path: 'chatMessages.userId', select: 'username displayName avatar' }
      ]);

    if (!draft) {
      return res.status(404).json({
        error: 'Draft not found'
      });
    }

    // Add user-specific data
    const draftData = draft.toJSON();
    draftData.userTeam = userTeam.toJSON();
    draftData.isUserTurn = draft.currentPick.teamId.toString() === userTeam._id.toString();
    draftData.upcomingPicks = draft.getUpcomingPicks(5);
    draftData.recentPicks = draft.getPickHistory(10);

    // Cache for 30 seconds (short cache for active drafts)
    await dbManager.cacheSet(cacheKey, draftData, 30);

    res.json({
      success: true,
      draft: draftData
    });

  } catch (error) {
    console.error('Get draft error:', error);
    res.status(500).json({
      error: 'Failed to get draft',
      message: error.message
    });
  }
});

/**
 * POST /api/draft/:draftId/start
 * Start a scheduled draft
 */
router.post('/:draftId/start', authenticateToken, async (req, res) => {
  try {
    const draftId = req.params.draftId;

    // Find draft
    const draft = await Draft.findById(draftId).populate('leagueId');
    if (!draft) {
      return res.status(404).json({
        error: 'Draft not found'
      });
    }

    // Check if user is commissioner
    if (!draft.leagueId.isCommissioner(req.userId)) {
      return res.status(403).json({
        error: 'Only the commissioner can start the draft'
      });
    }

    // Start draft
    await draft.start();

    // Clear caches
    await dbManager.cacheDel(`draft:league:${draft.leagueId._id}`);
    await dbManager.cacheDel(`draft:${draftId}`);

    // Emit real-time event (will be handled by WebSocket)
    req.app.get('io')?.to(`draft:${draftId}`).emit('draft:started', {
      draft: draft.toJSON()
    });

    res.json({
      success: true,
      message: 'Draft started successfully',
      draft: draft
    });

  } catch (error) {
    console.error('Start draft error:', error);
    res.status(500).json({
      error: 'Failed to start draft',
      message: error.message
    });
  }
});

/**
 * POST /api/draft/:draftId/pick
 * Make a draft pick
 */
router.post('/:draftId/pick', authenticateToken, async (req, res) => {
  try {
    const draftId = req.params.draftId;

    // Validate input
    const { error, value } = makePickSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details[0].message
      });
    }

    const { playerId, pickTime } = value;

    // Find draft
    const draft = await Draft.findById(draftId);
    if (!draft) {
      return res.status(404).json({
        error: 'Draft not found'
      });
    }

    // Find user's team
    const userTeam = await Team.findOne({
      owner: req.userId,
      leagueId: draft.leagueId
    });

    if (!userTeam) {
      return res.status(403).json({
        error: 'You are not part of this draft'
      });
    }

    // Check if player is available
    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({
        error: 'Player not found'
      });
    }

    // Check if player is already drafted
    const alreadyDrafted = draft.picks.some(pick => 
      pick.playerId.toString() === playerId.toString()
    );

    if (alreadyDrafted) {
      return res.status(409).json({
        error: 'Player already drafted'
      });
    }

    // Make the pick
    await draft.makePick(userTeam._id, playerId, pickTime || 0, false);

    // Add player to team roster
    await userTeam.addPlayer(playerId, 'BENCH', 'draft');

    // Update team draft pick record
    userTeam.draftPicks.push({
      round: draft.currentPick.round,
      pick: draft.currentPick.pick,
      overallPick: draft.currentPick.overallPick,
      player: playerId,
      timeUsed: pickTime || 0
    });
    await userTeam.save();

    // Clear caches
    await dbManager.cacheDel(`draft:league:${draft.leagueId}`);
    await dbManager.cacheDel(`draft:${draftId}`);

    // Add system chat message
    await draft.addChatMessage(
      req.userId,
      `${userTeam.name} selects ${player.name} (${player.position} - ${player.team})`,
      'pick'
    );

    // Emit real-time events
    const io = req.app.get('io');
    if (io) {
      io.to(`draft:${draftId}`).emit('draft:pick', {
        pick: {
          teamId: userTeam._id,
          teamName: userTeam.name,
          playerId: playerId,
          playerName: player.name,
          playerPosition: player.position,
          playerTeam: player.team,
          round: draft.currentPick.round,
          pick: draft.currentPick.pick,
          overallPick: draft.currentPick.overallPick
        },
        currentPick: draft.currentPick,
        isComplete: draft.status === 'COMPLETED'
      });
    }

    res.json({
      success: true,
      message: 'Pick made successfully',
      pick: {
        player: player,
        team: userTeam,
        round: draft.currentPick.round,
        pick: draft.currentPick.pick,
        overallPick: draft.currentPick.overallPick
      },
      draft: {
        currentPick: draft.currentPick,
        status: draft.status,
        isComplete: draft.status === 'COMPLETED'
      }
    });

  } catch (error) {
    console.error('Make pick error:', error);
    res.status(500).json({
      error: 'Failed to make pick',
      message: error.message
    });
  }
});

/**
 * POST /api/draft/:draftId/autopick
 * Enable/disable autopick for user's team
 */
router.post('/:draftId/autopick', authenticateToken, async (req, res) => {
  try {
    const draftId = req.params.draftId;
    const { enabled } = req.body;

    // Find draft
    const draft = await Draft.findById(draftId);
    if (!draft) {
      return res.status(404).json({
        error: 'Draft not found'
      });
    }

    // Find user's team
    const userTeam = await Team.findOne({
      owner: req.userId,
      leagueId: draft.leagueId
    });

    if (!userTeam) {
      return res.status(403).json({
        error: 'You are not part of this draft'
      });
    }

    // Update team autopick setting
    userTeam.settings.autoSetLineup = enabled;
    await userTeam.save();

    res.json({
      success: true,
      message: `Autopick ${enabled ? 'enabled' : 'disabled'}`,
      autopickEnabled: enabled
    });

  } catch (error) {
    console.error('Autopick error:', error);
    res.status(500).json({
      error: 'Failed to update autopick setting',
      message: error.message
    });
  }
});

/**
 * POST /api/draft/:draftId/pause
 * Pause an active draft (commissioner only)
 */
router.post('/:draftId/pause', authenticateToken, async (req, res) => {
  try {
    const draftId = req.params.draftId;
    const { reason } = req.body;

    // Find draft
    const draft = await Draft.findById(draftId).populate('leagueId');
    if (!draft) {
      return res.status(404).json({
        error: 'Draft not found'
      });
    }

    // Check if user is commissioner
    if (!draft.leagueId.isCommissioner(req.userId)) {
      return res.status(403).json({
        error: 'Only the commissioner can pause the draft'
      });
    }

    // Pause draft
    await draft.pause(reason, req.userId);

    // Clear caches
    await dbManager.cacheDel(`draft:league:${draft.leagueId._id}`);
    await dbManager.cacheDel(`draft:${draftId}`);

    // Emit real-time event
    req.app.get('io')?.to(`draft:${draftId}`).emit('draft:paused', {
      reason: reason,
      pausedBy: req.user.displayName
    });

    res.json({
      success: true,
      message: 'Draft paused successfully'
    });

  } catch (error) {
    console.error('Pause draft error:', error);
    res.status(500).json({
      error: 'Failed to pause draft',
      message: error.message
    });
  }
});

/**
 * POST /api/draft/:draftId/resume
 * Resume a paused draft (commissioner only)
 */
router.post('/:draftId/resume', authenticateToken, async (req, res) => {
  try {
    const draftId = req.params.draftId;

    // Find draft
    const draft = await Draft.findById(draftId).populate('leagueId');
    if (!draft) {
      return res.status(404).json({
        error: 'Draft not found'
      });
    }

    // Check if user is commissioner
    if (!draft.leagueId.isCommissioner(req.userId)) {
      return res.status(403).json({
        error: 'Only the commissioner can resume the draft'
      });
    }

    // Resume draft
    await draft.resume();

    // Clear caches
    await dbManager.cacheDel(`draft:league:${draft.leagueId._id}`);
    await dbManager.cacheDel(`draft:${draftId}`);

    // Emit real-time event
    req.app.get('io')?.to(`draft:${draftId}`).emit('draft:resumed', {
      resumedBy: req.user.displayName,
      currentPick: draft.currentPick
    });

    res.json({
      success: true,
      message: 'Draft resumed successfully'
    });

  } catch (error) {
    console.error('Resume draft error:', error);
    res.status(500).json({
      error: 'Failed to resume draft',
      message: error.message
    });
  }
});

/**
 * POST /api/draft/:draftId/chat
 * Send a chat message in the draft room
 */
router.post('/:draftId/chat', authenticateToken, async (req, res) => {
  try {
    const draftId = req.params.draftId;

    // Validate input
    const { error, value } = chatMessageSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details[0].message
      });
    }

    const { message } = value;

    // Find draft
    const draft = await Draft.findById(draftId);
    if (!draft) {
      return res.status(404).json({
        error: 'Draft not found'
      });
    }

    // Check if user has access
    const userTeam = await Team.findOne({
      owner: req.userId,
      leagueId: draft.leagueId
    });

    if (!userTeam) {
      return res.status(403).json({
        error: 'You are not part of this draft'
      });
    }

    // Add chat message
    await draft.addChatMessage(req.userId, message, 'message');

    // Emit real-time event
    req.app.get('io')?.to(`draft:${draftId}`).emit('draft:chat', {
      userId: req.userId,
      username: req.user.displayName,
      avatar: req.user.avatar,
      message: message,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Message sent successfully'
    });

  } catch (error) {
    console.error('Chat message error:', error);
    res.status(500).json({
      error: 'Failed to send message',
      message: error.message
    });
  }
});

/**
 * GET /api/draft/:draftId/available-players
 * Get available players for drafting
 */
router.get('/:draftId/available-players', authenticateToken, async (req, res) => {
  try {
    const draftId = req.params.draftId;
    const position = req.query.position;
    const limit = parseInt(req.query.limit) || 100;
    const search = req.query.search;

    const cacheKey = `draft:${draftId}:available:${position || 'all'}:${limit}:${search || ''}`;

    // Try cache first
    const cached = await dbManager.cacheGet(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        players: cached,
        cached: true
      });
    }

    // Find draft
    const draft = await Draft.findById(draftId);
    if (!draft) {
      return res.status(404).json({
        error: 'Draft not found'
      });
    }

    // Check access
    const userTeam = await Team.findOne({
      owner: req.userId,
      leagueId: draft.leagueId
    });

    if (!userTeam) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    // Get drafted player IDs
    const draftedPlayerIds = draft.picks.map(pick => pick.playerId);

    // Build query
    const query = {
      _id: { $nin: draftedPlayerIds },
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

    // Cache for 1 minute
    await dbManager.cacheSet(cacheKey, players, 60);

    res.json({
      success: true,
      players: players,
      count: players.length
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
 * GET /api/draft/active
 * Get user's active drafts
 */
router.get('/active', authenticateToken, async (req, res) => {
  try {
    // Find user's teams
    const userTeams = await Team.find({ owner: req.userId }).select('leagueId');
    const leagueIds = userTeams.map(team => team.leagueId);

    // Find active drafts
    const drafts = await Draft.find({
      leagueId: { $in: leagueIds },
      status: { $in: ['SCHEDULED', 'IN_PROGRESS', 'PAUSED'] }
    }).populate([
      { path: 'leagueId', select: 'name' },
      { path: 'currentPick.teamId', select: 'name owner', populate: { path: 'owner', select: 'displayName' } }
    ]);

    res.json({
      success: true,
      drafts: drafts
    });

  } catch (error) {
    console.error('Get active drafts error:', error);
    res.status(500).json({
      error: 'Failed to get active drafts',
      message: error.message
    });
  }
});

module.exports = router;