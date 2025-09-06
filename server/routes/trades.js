/**
 * Trade Routes
 * Handles trade proposals, acceptance, rejection, and management
 */

const express = require('express');
const Joi = require('joi');
const Trade = require('../models/Trade');
const Team = require('../models/Team');
const Player = require('../models/Player');
const League = require('../models/League');
const { authenticateToken } = require('../middleware/auth');
const dbManager = require('../config/database');

const router = express.Router();

// Validation schemas
const createTradeSchema = Joi.object({
  receivingTeamId: Joi.string().required(),
  offering: Joi.object({
    players: Joi.array().items(Joi.string()).default([]),
    draftPicks: Joi.array().items(Joi.object({
      year: Joi.number().required(),
      round: Joi.number().min(1).max(10).required()
    })).default([]),
    faabMoney: Joi.number().min(0).default(0)
  }).required(),
  requesting: Joi.object({
    players: Joi.array().items(Joi.string()).default([]),
    draftPicks: Joi.array().items(Joi.object({
      year: Joi.number().required(),
      round: Joi.number().min(1).max(10).required()
    })).default([]),
    faabMoney: Joi.number().min(0).default(0)
  }).required(),
  message: Joi.string().max(500).default('')
});

const respondTradeSchema = Joi.object({
  action: Joi.string().valid('accept', 'reject').required(),
  reason: Joi.string().max(200).optional()
});

const voteTradeSchema = Joi.object({
  vote: Joi.string().valid('APPROVE', 'VETO').required(),
  reason: Joi.string().max(200).optional()
});

/**
 * POST /api/trades/propose
 * Propose a new trade
 */
router.post('/propose', authenticateToken, async (req, res) => {
  try {
    // Validate input
    const { error, value } = createTradeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details[0].message
      });
    }

    const { receivingTeamId, offering, requesting, message } = value;

    // Find user's team
    const proposingTeam = await Team.findOne({ owner: req.userId }).populate('leagueId');
    if (!proposingTeam) {
      return res.status(404).json({
        error: 'You do not have a team'
      });
    }

    // Find receiving team
    const receivingTeam = await Team.findById(receivingTeamId);
    if (!receivingTeam) {
      return res.status(404).json({
        error: 'Receiving team not found'
      });
    }

    // Check if teams are in same league
    if (proposingTeam.leagueId._id.toString() !== receivingTeam.leagueId.toString()) {
      return res.status(400).json({
        error: 'Teams must be in the same league'
      });
    }

    // Check if trading is allowed
    const league = proposingTeam.leagueId;
    if (league.settings.tradeSettings.deadline && new Date() > league.settings.tradeSettings.deadline) {
      return res.status(400).json({
        error: 'Trade deadline has passed'
      });
    }

    // Validate offered players belong to proposing team
    const offeringPlayerIds = offering.players;
    const proposingTeamPlayerIds = proposingTeam.roster.map(spot => spot.player.toString());
    
    for (const playerId of offeringPlayerIds) {
      if (!proposingTeamPlayerIds.includes(playerId)) {
        return res.status(400).json({
          error: 'You can only trade players on your roster'
        });
      }
    }

    // Validate requested players belong to receiving team
    const requestingPlayerIds = requesting.players;
    const receivingTeamPlayerIds = receivingTeam.roster.map(spot => spot.player.toString());
    
    for (const playerId of requestingPlayerIds) {
      if (!receivingTeamPlayerIds.includes(playerId)) {
        return res.status(400).json({
          error: 'Requested players must be on the receiving team\'s roster'
        });
      }
    }

    // Check FAAB budget
    if (offering.faabMoney > proposingTeam.faabBudget.remaining) {
      return res.status(400).json({
        error: 'Insufficient FAAB budget'
      });
    }

    if (requesting.faabMoney > receivingTeam.faabBudget.remaining) {
      return res.status(400).json({
        error: 'Receiving team has insufficient FAAB budget'
      });
    }

    // Get player details for trade items
    const offeringPlayers = await Player.find({ _id: { $in: offeringPlayerIds } })
      .select('name position team');
    const requestingPlayers = await Player.find({ _id: { $in: requestingPlayerIds } })
      .select('name position team');

    // Build trade items with player details
    const tradeItems = {
      offering: {
        players: offeringPlayers.map(player => ({
          playerId: player._id,
          playerName: player.name,
          position: player.position,
          team: player.team
        })),
        draftPicks: offering.draftPicks,
        faabMoney: offering.faabMoney
      },
      requesting: {
        players: requestingPlayers.map(player => ({
          playerId: player._id,
          playerName: player.name,
          position: player.position,
          team: player.team
        })),
        draftPicks: requesting.draftPicks,
        faabMoney: requesting.faabMoney
      }
    };

    // Create trade
    const trade = await Trade.createTrade(
      proposingTeam._id,
      receivingTeamId,
      tradeItems,
      message
    );

    // Clear caches
    await dbManager.cacheDel(`team:${proposingTeam._id}:trades`);
    await dbManager.cacheDel(`team:${receivingTeamId}:trades`);

    // Populate response
    await trade.populate([
      { path: 'proposedBy', select: 'name owner abbreviation', populate: { path: 'owner', select: 'displayName' } },
      { path: 'proposedTo', select: 'name owner abbreviation', populate: { path: 'owner', select: 'displayName' } }
    ]);

    // Emit real-time notification
    const io = req.app.get('io');
    if (io) {
      io.to(`league:${league._id}`).emit('trade:proposed', {
        trade: trade,
        proposingTeam: proposingTeam.name,
        receivingTeam: receivingTeam.name
      });
    }

    res.status(201).json({
      success: true,
      message: 'Trade proposed successfully',
      trade: trade
    });

  } catch (error) {
    console.error('Propose trade error:', error);
    res.status(500).json({
      error: 'Failed to propose trade',
      message: error.message
    });
  }
});

/**
 * GET /api/trades/my-trades
 * Get user's active trades
 */
router.get('/my-trades', authenticateToken, async (req, res) => {
  try {
    const cacheKey = `user:${req.userId}:trades`;

    // Try cache first
    const cached = await dbManager.cacheGet(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        trades: cached,
        cached: true
      });
    }

    // Find user's team
    const userTeam = await Team.findOne({ owner: req.userId });
    if (!userTeam) {
      return res.status(404).json({
        error: 'You do not have a team'
      });
    }

    // Get active trades
    const trades = await Trade.getActiveTradesForTeam(userTeam._id);

    // Cache for 2 minutes
    await dbManager.cacheSet(cacheKey, trades, 120);

    res.json({
      success: true,
      trades: trades
    });

  } catch (error) {
    console.error('Get my trades error:', error);
    res.status(500).json({
      error: 'Failed to get trades',
      message: error.message
    });
  }
});

/**
 * GET /api/trades/league/:leagueId
 * Get all trades for a league
 */
router.get('/league/:leagueId', authenticateToken, async (req, res) => {
  try {
    const leagueId = req.params.leagueId;
    const limit = parseInt(req.query.limit) || 50;
    
    const cacheKey = `league:${leagueId}:trades:${limit}`;

    // Try cache first
    const cached = await dbManager.cacheGet(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        trades: cached,
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

    // Get league trades
    const trades = await Trade.getLeagueTrades(leagueId, limit);

    // Cache for 5 minutes
    await dbManager.cacheSet(cacheKey, trades, 300);

    res.json({
      success: true,
      trades: trades
    });

  } catch (error) {
    console.error('Get league trades error:', error);
    res.status(500).json({
      error: 'Failed to get league trades',
      message: error.message
    });
  }
});

/**
 * POST /api/trades/:tradeId/respond
 * Accept or reject a trade
 */
router.post('/:tradeId/respond', authenticateToken, async (req, res) => {
  try {
    const tradeId = req.params.tradeId;

    // Validate input
    const { error, value } = respondTradeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details[0].message
      });
    }

    const { action, reason } = value;

    // Find trade
    const trade = await Trade.findById(tradeId)
      .populate([
        { path: 'proposedBy', select: 'name owner', populate: { path: 'owner', select: 'displayName' } },
        { path: 'proposedTo', select: 'name owner', populate: { path: 'owner', select: 'displayName' } }
      ]);

    if (!trade) {
      return res.status(404).json({
        error: 'Trade not found'
      });
    }

    // Check if user is the receiving team owner
    if (trade.proposedTo.owner._id.toString() !== req.userId.toString()) {
      return res.status(403).json({
        error: 'Only the receiving team can respond to this trade'
      });
    }

    // Respond to trade
    if (action === 'accept') {
      await trade.accept(req.userId);
    } else {
      await trade.reject(req.userId, reason);
    }

    // Clear caches
    await dbManager.cacheDel(`user:${req.userId}:trades`);
    await dbManager.cacheDel(`league:${trade.leagueId}:trades`);

    // Emit real-time notification
    const io = req.app.get('io');
    if (io) {
      io.to(`league:${trade.leagueId}`).emit(`trade:${action}ed`, {
        trade: trade,
        respondingTeam: trade.proposedTo.name,
        proposingTeam: trade.proposedBy.name
      });
    }

    res.json({
      success: true,
      message: `Trade ${action}ed successfully`,
      trade: trade
    });

  } catch (error) {
    console.error('Respond to trade error:', error);
    res.status(500).json({
      error: `Failed to ${req.body.action} trade`,
      message: error.message
    });
  }
});

/**
 * POST /api/trades/:tradeId/cancel
 * Cancel a pending trade
 */
router.post('/:tradeId/cancel', authenticateToken, async (req, res) => {
  try {
    const tradeId = req.params.tradeId;
    const { reason } = req.body;

    // Find trade
    const trade = await Trade.findById(tradeId)
      .populate('proposedBy', 'name owner');

    if (!trade) {
      return res.status(404).json({
        error: 'Trade not found'
      });
    }

    // Cancel trade
    await trade.cancel(req.userId, reason);

    // Clear caches
    await dbManager.cacheDel(`user:${req.userId}:trades`);
    await dbManager.cacheDel(`league:${trade.leagueId}:trades`);

    // Emit real-time notification
    const io = req.app.get('io');
    if (io) {
      io.to(`league:${trade.leagueId}`).emit('trade:cancelled', {
        trade: trade,
        cancelledBy: trade.proposedBy.name
      });
    }

    res.json({
      success: true,
      message: 'Trade cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel trade error:', error);
    res.status(500).json({
      error: 'Failed to cancel trade',
      message: error.message
    });
  }
});

/**
 * POST /api/trades/:tradeId/vote
 * Vote on a trade during review period
 */
router.post('/:tradeId/vote', authenticateToken, async (req, res) => {
  try {
    const tradeId = req.params.tradeId;

    // Validate input
    const { error, value } = voteTradeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details[0].message
      });
    }

    const { vote, reason } = value;

    // Find trade
    const trade = await Trade.findById(tradeId);
    if (!trade) {
      return res.status(404).json({
        error: 'Trade not found'
      });
    }

    // Check if trade is in review period
    if (!trade.reviewPeriod.enabled || trade.status !== 'ACCEPTED') {
      return res.status(400).json({
        error: 'Trade is not in review period'
      });
    }

    // Find user's team in this league
    const userTeam = await Team.findOne({
      owner: req.userId,
      leagueId: trade.leagueId
    });

    if (!userTeam) {
      return res.status(403).json({
        error: 'You are not part of this league'
      });
    }

    // Check if user is involved in the trade (they cannot vote)
    if (userTeam._id.toString() === trade.proposedBy.toString() || 
        userTeam._id.toString() === trade.proposedTo.toString()) {
      return res.status(400).json({
        error: 'Teams involved in the trade cannot vote'
      });
    }

    // Add vote
    await trade.addVote(userTeam._id, vote, reason);

    // Clear caches
    await dbManager.cacheDel(`league:${trade.leagueId}:trades`);

    // Emit real-time notification
    const io = req.app.get('io');
    if (io) {
      io.to(`league:${trade.leagueId}`).emit('trade:vote', {
        tradeId: tradeId,
        vote: vote,
        voterTeam: userTeam.name,
        totalVotes: trade.reviewPeriod.votes.length
      });
    }

    res.json({
      success: true,
      message: 'Vote recorded successfully',
      currentVotes: trade.reviewPeriod.votes.length,
      requiredVotes: trade.reviewPeriod.requiredVotes
    });

  } catch (error) {
    console.error('Vote on trade error:', error);
    res.status(500).json({
      error: 'Failed to record vote',
      message: error.message
    });
  }
});

/**
 * GET /api/trades/:tradeId
 * Get trade details
 */
router.get('/:tradeId', authenticateToken, async (req, res) => {
  try {
    const tradeId = req.params.tradeId;
    const cacheKey = `trade:${tradeId}:details`;

    // Try cache first
    const cached = await dbManager.cacheGet(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        trade: cached,
        cached: true
      });
    }

    // Find trade
    const trade = await Trade.findById(tradeId)
      .populate([
        { path: 'proposedBy', select: 'name owner abbreviation', populate: { path: 'owner', select: 'displayName avatar' } },
        { path: 'proposedTo', select: 'name owner abbreviation', populate: { path: 'owner', select: 'displayName avatar' } },
        { path: 'tradeItems.offering.players.playerId', select: 'name position team rankings photoUrl' },
        { path: 'tradeItems.requesting.players.playerId', select: 'name position team rankings photoUrl' },
        { path: 'reviewPeriod.votes.teamId', select: 'name abbreviation' }
      ]);

    if (!trade) {
      return res.status(404).json({
        error: 'Trade not found'
      });
    }

    // Check if user has access to this trade
    const userTeam = await Team.findOne({
      owner: req.userId,
      leagueId: trade.leagueId
    });

    if (!userTeam) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    // Cache for 2 minutes
    await dbManager.cacheSet(cacheKey, trade, 120);

    res.json({
      success: true,
      trade: trade
    });

  } catch (error) {
    console.error('Get trade details error:', error);
    res.status(500).json({
      error: 'Failed to get trade details',
      message: error.message
    });
  }
});

/**
 * POST /api/trades/expire-old
 * Expire old pending trades (admin/cron job)
 */
router.post('/expire-old', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        error: 'Admin access required'
      });
    }

    const expiredCount = await Trade.expireOldTrades();

    res.json({
      success: true,
      message: `Expired ${expiredCount} old trades`,
      expiredCount: expiredCount
    });

  } catch (error) {
    console.error('Expire old trades error:', error);
    res.status(500).json({
      error: 'Failed to expire old trades',
      message: error.message
    });
  }
});

/**
 * GET /api/trades/analyze/:tradeId
 * Get trade analysis
 */
router.get('/analyze/:tradeId', authenticateToken, async (req, res) => {
  try {
    const tradeId = req.params.tradeId;

    // Find trade
    const trade = await Trade.findById(tradeId);
    if (!trade) {
      return res.status(404).json({
        error: 'Trade not found'
      });
    }

    // Check access
    const userTeam = await Team.findOne({
      owner: req.userId,
      leagueId: trade.leagueId
    });

    if (!userTeam) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    // Analyze trade if not already done
    if (!trade.analysis.analyzedAt) {
      await trade.analyzeTradeValue();
    }

    res.json({
      success: true,
      analysis: trade.analysis
    });

  } catch (error) {
    console.error('Analyze trade error:', error);
    res.status(500).json({
      error: 'Failed to analyze trade',
      message: error.message
    });
  }
});

module.exports = router;