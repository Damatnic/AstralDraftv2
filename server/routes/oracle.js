/**
 * Oracle Routes
 * Handles AI-powered fantasy football analysis and predictions
 */

const express = require('express');
const Joi = require('joi');
const oracleService = require('../services/oracleService');
const Team = require('../models/Team');
const Player = require('../models/Player');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const dbManager = require('../config/database');

const router = express.Router();

// Validation schemas
const playerAnalysisSchema = Joi.object({
  playerId: Joi.string().required(),
  analysisType: Joi.string().valid('performance', 'injury', 'matchup', 'season').default('performance')
});

const lineupOptimizationSchema = Joi.object({
  teamId: Joi.string().required(),
  week: Joi.number().min(1).max(18).optional()
});

const tradeAnalysisSchema = Joi.object({
  tradeId: Joi.string().required()
});

const waiverRecommendationsSchema = Joi.object({
  leagueId: Joi.string().required(),
  limit: Joi.number().min(1).max(20).default(10)
});

/**
 * POST /api/oracle/analyze-player
 * Get AI analysis for a specific player
 */
router.post('/analyze-player', optionalAuth, async (req, res) => {
  try {
    // Validate input
    const { error, value } = playerAnalysisSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details[0].message
      });
    }

    const { playerId, analysisType } = value;

    // Check if player exists
    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({
        error: 'Player not found'
      });
    }

    // Generate analysis
    const analysis = await oracleService.analyzePlayer(playerId, analysisType);

    res.json({
      success: true,
      player: {
        id: player._id,
        name: player.name,
        position: player.position,
        team: player.team
      },
      analysis: analysis
    });

  } catch (error) {
    console.error('Player analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze player',
      message: error.message
    });
  }
});

/**
 * POST /api/oracle/optimize-lineup
 * Get AI-powered lineup optimization
 */
router.post('/optimize-lineup', authenticateToken, async (req, res) => {
  try {
    // Validate input
    const { error, value } = lineupOptimizationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details[0].message
      });
    }

    const { teamId, week } = value;

    // Check if user owns this team
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        error: 'Team not found'
      });
    }

    if (team.owner.toString() !== req.userId.toString()) {
      return res.status(403).json({
        error: 'You can only optimize your own team\'s lineup'
      });
    }

    // Generate lineup optimization
    const optimization = await oracleService.optimizeLineup(teamId, week);

    res.json({
      success: true,
      team: {
        id: team._id,
        name: team.name
      },
      optimization: optimization
    });

  } catch (error) {
    console.error('Lineup optimization error:', error);
    res.status(500).json({
      error: 'Failed to optimize lineup',
      message: error.message
    });
  }
});

/**
 * POST /api/oracle/analyze-trade
 * Get AI analysis of a trade proposal
 */
router.post('/analyze-trade', authenticateToken, async (req, res) => {
  try {
    // Validate input
    const { error, value } = tradeAnalysisSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details[0].message
      });
    }

    const { tradeId } = value;

    // Check if user has access to this trade
    const Trade = require('../models/Trade');
    const trade = await Trade.findById(tradeId);
    if (!trade) {
      return res.status(404).json({
        error: 'Trade not found'
      });
    }

    // Verify user is part of the league
    const userTeam = await Team.findOne({
      owner: req.userId,
      leagueId: trade.leagueId
    });

    if (!userTeam) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    // Generate trade analysis
    const analysis = await oracleService.analyzeTrade(tradeId);

    res.json({
      success: true,
      trade: {
        id: trade._id,
        status: trade.status
      },
      analysis: analysis
    });

  } catch (error) {
    console.error('Trade analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze trade',
      message: error.message
    });
  }
});

/**
 * POST /api/oracle/waiver-recommendations
 * Get AI-powered waiver wire recommendations
 */
router.post('/waiver-recommendations', authenticateToken, async (req, res) => {
  try {
    // Validate input
    const { error, value } = waiverRecommendationsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details[0].message
      });
    }

    const { leagueId, limit } = value;

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

    // Generate waiver recommendations
    const recommendations = await oracleService.generateWaiverRecommendations(leagueId, limit);

    res.json({
      success: true,
      league: {
        id: leagueId
      },
      recommendations: recommendations
    });

  } catch (error) {
    console.error('Waiver recommendations error:', error);
    res.status(500).json({
      error: 'Failed to generate waiver recommendations',
      message: error.message
    });
  }
});

/**
 * GET /api/oracle/player-insights/:playerId
 * Get comprehensive player insights
 */
router.get('/player-insights/:playerId', optionalAuth, async (req, res) => {
  try {
    const playerId = req.params.playerId;
    const cacheKey = `oracle:insights:${playerId}`;

    // Try cache first
    const cached = await dbManager.cacheGet(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        insights: cached,
        cached: true
      });
    }

    // Check if player exists
    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({
        error: 'Player not found'
      });
    }

    // Generate multiple analyses
    const [performance, injury, matchup, season] = await Promise.all([
      oracleService.analyzePlayer(playerId, 'performance'),
      oracleService.analyzePlayer(playerId, 'injury'),
      oracleService.analyzePlayer(playerId, 'matchup'),
      oracleService.analyzePlayer(playerId, 'season')
    ]);

    const insights = {
      player: {
        id: player._id,
        name: player.name,
        position: player.position,
        team: player.team,
        injuryStatus: player.injuryStatus,
        rankings: player.rankings
      },
      analyses: {
        performance: performance,
        injury: injury,
        matchup: matchup,
        season: season
      },
      generatedAt: new Date()
    };

    // Cache for 30 minutes
    await dbManager.cacheSet(cacheKey, insights, 1800);

    res.json({
      success: true,
      insights: insights
    });

  } catch (error) {
    console.error('Player insights error:', error);
    res.status(500).json({
      error: 'Failed to generate player insights',
      message: error.message
    });
  }
});

/**
 * GET /api/oracle/weekly-predictions
 * Get weekly predictions and insights
 */
router.get('/weekly-predictions', optionalAuth, async (req, res) => {
  try {
    const week = parseInt(req.query.week) || getCurrentWeek();
    const position = req.query.position;
    const limit = parseInt(req.query.limit) || 20;

    const cacheKey = `oracle:weekly:${week}:${position || 'all'}:${limit}`;

    // Try cache first
    const cached = await dbManager.cacheGet(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        predictions: cached,
        cached: true
      });
    }

    // Get top players for the week
    const query = { status: 'ACTIVE' };
    if (position) query.position = position;

    const players = await Player.find(query)
      .sort({ 'rankings.overall': 1 })
      .limit(limit)
      .select('name position team rankings injuryStatus projections');

    // Generate predictions for each player
    const predictions = await Promise.all(
      players.map(async (player) => {
        try {
          const analysis = await oracleService.analyzePlayer(player._id, 'matchup');
          return {
            player: {
              id: player._id,
              name: player.name,
              position: player.position,
              team: player.team,
              ranking: player.rankings.overall
            },
            prediction: analysis,
            projectedPoints: player.projections?.weekly?.find(w => w.week === week)?.fantasyPoints?.ppr || 0
          };
        } catch (error) {
          console.error(`Prediction error for ${player.name}:`, error);
          return null;
        }
      })
    );

    const validPredictions = predictions.filter(p => p !== null);

    // Cache for 2 hours
    await dbManager.cacheSet(cacheKey, validPredictions, 7200);

    res.json({
      success: true,
      week: week,
      position: position || 'all',
      predictions: validPredictions
    });

  } catch (error) {
    console.error('Weekly predictions error:', error);
    res.status(500).json({
      error: 'Failed to generate weekly predictions',
      message: error.message
    });
  }
});

/**
 * GET /api/oracle/trending-players
 * Get trending players with AI insights
 */
router.get('/trending-players', optionalAuth, async (req, res) => {
  try {
    const trendType = req.query.type || 'rising'; // rising, falling, breakout
    const limit = parseInt(req.query.limit) || 10;

    const cacheKey = `oracle:trending:${trendType}:${limit}`;

    // Try cache first
    const cached = await dbManager.cacheGet(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        trending: cached,
        cached: true
      });
    }

    // Get players based on trend type
    let players;
    switch (trendType) {
      case 'rising':
        players = await Player.find({ status: 'ACTIVE' })
          .sort({ 'rankings.overall': 1 })
          .limit(limit * 2);
        break;
      case 'falling':
        players = await Player.find({ 
          status: 'ACTIVE',
          'injuryStatus.designation': { $in: ['QUESTIONABLE', 'DOUBTFUL'] }
        })
          .sort({ 'rankings.overall': 1 })
          .limit(limit * 2);
        break;
      case 'breakout':
        players = await Player.find({ 
          status: 'ACTIVE',
          'rankings.overall': { $gt: 100, $lt: 300 }
        })
          .sort({ 'rankings.overall': 1 })
          .limit(limit * 2);
        break;
      default:
        players = await Player.find({ status: 'ACTIVE' })
          .sort({ 'rankings.overall': 1 })
          .limit(limit * 2);
    }

    // Generate insights for trending players
    const trending = await Promise.all(
      players.slice(0, limit).map(async (player) => {
        try {
          const analysis = await oracleService.analyzePlayer(player._id, 'performance');
          return {
            player: {
              id: player._id,
              name: player.name,
              position: player.position,
              team: player.team,
              ranking: player.rankings.overall
            },
            trendReason: getTrendReason(player, trendType),
            analysis: analysis
          };
        } catch (error) {
          console.error(`Trending analysis error for ${player.name}:`, error);
          return null;
        }
      })
    );

    const validTrending = trending.filter(t => t !== null);

    // Cache for 4 hours
    await dbManager.cacheSet(cacheKey, validTrending, 14400);

    res.json({
      success: true,
      trendType: trendType,
      trending: validTrending
    });

  } catch (error) {
    console.error('Trending players error:', error);
    res.status(500).json({
      error: 'Failed to get trending players',
      message: error.message
    });
  }
});

/**
 * GET /api/oracle/health
 * Get Oracle service health status
 */
router.get('/health', async (req, res) => {
  try {
    const health = await oracleService.healthCheck();
    
    res.json({
      success: true,
      health: health,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Oracle health check error:', error);
    res.status(500).json({
      error: 'Health check failed',
      message: error.message
    });
  }
});

// Helper functions
function getCurrentWeek() {
  const now = new Date();
  const seasonStart = new Date(now.getFullYear(), 8, 1); // September 1st
  const weeksSinceStart = Math.floor((now - seasonStart) / (7 * 24 * 60 * 60 * 1000));
  return Math.min(Math.max(weeksSinceStart + 1, 1), 18);
}

function getTrendReason(player, trendType) {
  switch (trendType) {
    case 'rising':
      return 'Strong recent performance and favorable upcoming schedule';
    case 'falling':
      return 'Injury concerns and declining target share';
    case 'breakout':
      return 'Increased opportunity and positive matchup trends';
    default:
      return 'Notable fantasy football development';
  }
}

module.exports = router;