/**
 * Player Routes
 * Handles NFL player data, statistics, and rankings
 */

const express = require('express');
const Joi = require('joi');
const Player = require('../models/Player');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const dbManager = require('../config/database');
const sportsDataService = require('../services/sportsDataService');

const router = express.Router();

// Validation schemas
const searchSchema = Joi.object({
  query: Joi.string().min(2).max(50).required(),
  position: Joi.string().valid('QB', 'RB', 'WR', 'TE', 'K', 'DST').optional(),
  team: Joi.string().length(3).uppercase().optional(),
  limit: Joi.number().min(1).max(100).default(50)
});

const rankingsSchema = Joi.object({
  position: Joi.string().valid('QB', 'RB', 'WR', 'TE', 'K', 'DST').optional(),
  scoringType: Joi.string().valid('standard', 'ppr', 'half-ppr').default('ppr'),
  limit: Joi.number().min(1).max(500).default(100)
});

/**
 * GET /api/players/search
 * Search for players by name, position, or team
 */
router.get('/search', optionalAuth, async (req, res) => {
  try {
    // Validate query parameters
    const { error, value } = searchSchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details[0].message
      });
    }

    const { query, position, team, limit } = value;
    const cacheKey = `players:search:${query}:${position || 'all'}:${team || 'all'}:${limit}`;

    // Try cache first
    const cached = await dbManager.cacheGet(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        players: cached,
        cached: true
      });
    }

    // Build search query
    const searchQuery = {
      $text: { $search: query },
      status: 'ACTIVE'
    };

    if (position) searchQuery.position = position;
    if (team) searchQuery.team = team;

    // Execute search
    const players = await Player.find(searchQuery)
      .select('name firstName lastName position team jerseyNumber status injuryStatus rankings projections photoUrl')
      .sort({ 'rankings.overall': 1, score: { $meta: 'textScore' } })
      .limit(limit);

    // Cache results for 10 minutes
    await dbManager.cacheSet(cacheKey, players, 600);

    res.json({
      success: true,
      players: players,
      count: players.length
    });

  } catch (error) {
    console.error('Player search error:', error);
    res.status(500).json({
      error: 'Search failed',
      message: error.message
    });
  }
});

/**
 * GET /api/players/rankings
 * Get player rankings by position and scoring type
 */
router.get('/rankings', optionalAuth, async (req, res) => {
  try {
    // Validate query parameters
    const { error, value } = rankingsSchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details[0].message
      });
    }

    const { position, scoringType, limit } = value;
    const cacheKey = `players:rankings:${position || 'all'}:${scoringType}:${limit}`;

    // Try cache first
    const cached = await dbManager.cacheGet(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        players: cached,
        cached: true
      });
    }

    // Build query
    const query = { status: 'ACTIVE' };
    if (position) query.position = position;

    // Get players with rankings
    const players = await Player.find(query)
      .select('name firstName lastName position team jerseyNumber status injuryStatus rankings projections stats photoUrl')
      .sort({ 'rankings.overall': 1 })
      .limit(limit);

    // Add fantasy points based on scoring type
    const playersWithPoints = players.map(player => {
      const playerObj = player.toJSON();
      playerObj.seasonFantasyPoints = player.calculateSeasonFantasyPoints(scoringType);
      playerObj.projectedPoints = player.projections.season.fantasyPoints[scoringType] || 0;
      return playerObj;
    });

    // Cache results for 15 minutes
    await dbManager.cacheSet(cacheKey, playersWithPoints, 900);

    res.json({
      success: true,
      players: playersWithPoints,
      count: playersWithPoints.length,
      scoringType: scoringType
    });

  } catch (error) {
    console.error('Get rankings error:', error);
    res.status(500).json({
      error: 'Failed to fetch rankings',
      message: error.message
    });
  }
});

/**
 * GET /api/players/:id
 * Get detailed player information
 */
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const playerId = req.params.id;
    const cacheKey = `player:${playerId}:details`;

    // Try cache first
    const cached = await dbManager.cacheGet(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        player: cached,
        cached: true
      });
    }

    // Find player
    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({
        error: 'Player not found'
      });
    }

    // Add calculated fantasy points for different scoring types
    const playerData = player.toJSON();
    playerData.fantasyPoints = {
      standard: player.calculateSeasonFantasyPoints('standard'),
      ppr: player.calculateSeasonFantasyPoints('ppr'),
      halfPpr: player.calculateSeasonFantasyPoints('half-ppr')
    };

    // Add weekly fantasy points
    playerData.weeklyFantasyPoints = player.weeklyStats.map(week => ({
      week: week.week,
      opponent: week.opponent,
      isHome: week.isHome,
      gameDate: week.gameDate,
      fantasyPoints: {
        standard: player.calculateFantasyPoints(week.stats, 'standard'),
        ppr: player.calculateFantasyPoints(week.stats, 'ppr'),
        halfPpr: player.calculateFantasyPoints(week.stats, 'half-ppr')
      },
      stats: week.stats
    }));

    // Cache for 5 minutes
    await dbManager.cacheSet(cacheKey, playerData, 300);

    res.json({
      success: true,
      player: playerData
    });

  } catch (error) {
    console.error('Get player error:', error);
    res.status(500).json({
      error: 'Failed to fetch player',
      message: error.message
    });
  }
});

/**
 * GET /api/players/:id/stats/:week
 * Get player stats for specific week
 */
router.get('/:id/stats/:week', optionalAuth, async (req, res) => {
  try {
    const playerId = req.params.id;
    const week = parseInt(req.params.week);

    if (isNaN(week) || week < 1 || week > 18) {
      return res.status(400).json({
        error: 'Invalid week',
        message: 'Week must be between 1 and 18'
      });
    }

    const cacheKey = `player:${playerId}:stats:week:${week}`;

    // Try cache first
    const cached = await dbManager.cacheGet(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        stats: cached,
        cached: true
      });
    }

    // Find player
    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({
        error: 'Player not found'
      });
    }

    // Get weekly stats
    const weeklyStats = player.weeklyStats.find(w => w.week === week);
    if (!weeklyStats) {
      return res.status(404).json({
        error: 'Stats not found',
        message: `No stats found for week ${week}`
      });
    }

    // Calculate fantasy points
    const statsData = {
      week: week,
      opponent: weeklyStats.opponent,
      isHome: weeklyStats.isHome,
      gameDate: weeklyStats.gameDate,
      stats: weeklyStats.stats,
      fantasyPoints: {
        standard: player.calculateFantasyPoints(weeklyStats.stats, 'standard'),
        ppr: player.calculateFantasyPoints(weeklyStats.stats, 'ppr'),
        halfPpr: player.calculateFantasyPoints(weeklyStats.stats, 'half-ppr')
      }
    };

    // Cache for 1 hour
    await dbManager.cacheSet(cacheKey, statsData, 3600);

    res.json({
      success: true,
      stats: statsData
    });

  } catch (error) {
    console.error('Get player stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch player stats',
      message: error.message
    });
  }
});

/**
 * GET /api/players/position/:position
 * Get all players by position
 */
router.get('/position/:position', optionalAuth, async (req, res) => {
  try {
    const position = req.params.position.toUpperCase();
    const validPositions = ['QB', 'RB', 'WR', 'TE', 'K', 'DST'];

    if (!validPositions.includes(position)) {
      return res.status(400).json({
        error: 'Invalid position',
        message: 'Position must be one of: ' + validPositions.join(', ')
      });
    }

    const limit = parseInt(req.query.limit) || 100;
    const cacheKey = `players:position:${position}:${limit}`;

    // Try cache first
    const cached = await dbManager.cacheGet(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        players: cached,
        cached: true
      });
    }

    // Get players by position
    const players = await Player.find({
      position: position,
      status: 'ACTIVE'
    })
      .select('name firstName lastName position team jerseyNumber status injuryStatus rankings projections stats photoUrl')
      .sort({ 'rankings.position': 1 })
      .limit(limit);

    // Cache for 10 minutes
    await dbManager.cacheSet(cacheKey, players, 600);

    res.json({
      success: true,
      players: players,
      count: players.length,
      position: position
    });

  } catch (error) {
    console.error('Get players by position error:', error);
    res.status(500).json({
      error: 'Failed to fetch players',
      message: error.message
    });
  }
});

/**
 * GET /api/players/team/:team
 * Get all players by NFL team
 */
router.get('/team/:team', optionalAuth, async (req, res) => {
  try {
    const team = req.params.team.toUpperCase();
    const cacheKey = `players:team:${team}`;

    // Try cache first
    const cached = await dbManager.cacheGet(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        players: cached,
        cached: true
      });
    }

    // Get players by team
    const players = await Player.find({
      team: team,
      status: 'ACTIVE'
    })
      .select('name firstName lastName position team jerseyNumber status injuryStatus rankings projections stats photoUrl')
      .sort({ position: 1, 'rankings.position': 1 });

    if (players.length === 0) {
      return res.status(404).json({
        error: 'Team not found',
        message: `No players found for team ${team}`
      });
    }

    // Cache for 10 minutes
    await dbManager.cacheSet(cacheKey, players, 600);

    res.json({
      success: true,
      players: players,
      count: players.length,
      team: team
    });

  } catch (error) {
    console.error('Get players by team error:', error);
    res.status(500).json({
      error: 'Failed to fetch players',
      message: error.message
    });
  }
});

/**
 * GET /api/players/available/:leagueId
 * Get available players for a specific league (not drafted)
 */
router.get('/available/:leagueId', authenticateToken, async (req, res) => {
  try {
    const leagueId = req.params.leagueId;
    const position = req.query.position;
    const limit = parseInt(req.query.limit) || 100;

    const cacheKey = `players:available:${leagueId}:${position || 'all'}:${limit}`;

    // Try cache first
    const cached = await dbManager.cacheGet(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        players: cached,
        cached: true
      });
    }

    // Get all drafted players in this league
    const Team = require('../models/Team');
    const teams = await Team.find({ leagueId: leagueId }).select('roster.player');
    const draftedPlayerIds = teams.reduce((acc, team) => {
      team.roster.forEach(spot => acc.push(spot.player));
      return acc;
    }, []);

    // Get available players
    const query = {
      _id: { $nin: draftedPlayerIds },
      status: 'ACTIVE'
    };

    if (position) query.position = position;

    const players = await Player.find(query)
      .select('name firstName lastName position team jerseyNumber status injuryStatus rankings projections stats photoUrl')
      .sort({ 'rankings.overall': 1 })
      .limit(limit);

    // Cache for 2 minutes (shorter cache for draft-related data)
    await dbManager.cacheSet(cacheKey, players, 120);

    res.json({
      success: true,
      players: players,
      count: players.length,
      leagueId: leagueId
    });

  } catch (error) {
    console.error('Get available players error:', error);
    res.status(500).json({
      error: 'Failed to fetch available players',
      message: error.message
    });
  }
});

/**
 * POST /api/players/sync
 * Sync player data from external API (admin only)
 */
router.post('/sync', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Admin access required'
      });
    }

    // Trigger player data sync
    const result = await sportsDataService.syncPlayers();

    // Clear all player-related caches
    const cacheKeys = [
      'players:rankings:*',
      'players:search:*',
      'players:position:*',
      'players:team:*',
      'players:available:*'
    ];

    for (const pattern of cacheKeys) {
      // Note: This is a simplified cache clear - in production you'd want a more sophisticated cache invalidation
      await dbManager.cacheFlush();
      break; // Just flush all for now
    }

    res.json({
      success: true,
      message: 'Player data sync completed',
      result: result
    });

  } catch (error) {
    console.error('Player sync error:', error);
    res.status(500).json({
      error: 'Sync failed',
      message: error.message
    });
  }
});

/**
 * GET /api/players/news/:id
 * Get latest news for a player
 */
router.get('/news/:id', optionalAuth, async (req, res) => {
  try {
    const playerId = req.params.id;
    const limit = parseInt(req.query.limit) || 10;

    const cacheKey = `player:${playerId}:news:${limit}`;

    // Try cache first
    const cached = await dbManager.cacheGet(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        news: cached,
        cached: true
      });
    }

    // Find player
    const player = await Player.findById(playerId).select('name news');
    if (!player) {
      return res.status(404).json({
        error: 'Player not found'
      });
    }

    // Get latest news
    const news = player.news
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, limit);

    // Cache for 5 minutes
    await dbManager.cacheSet(cacheKey, news, 300);

    res.json({
      success: true,
      news: news,
      player: {
        id: player._id,
        name: player.name
      }
    });

  } catch (error) {
    console.error('Get player news error:', error);
    res.status(500).json({
      error: 'Failed to fetch player news',
      message: error.message
    });
  }
});

module.exports = router;