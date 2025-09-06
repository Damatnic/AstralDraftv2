const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

// Create Express app
const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Handled by Netlify headers
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: [
    'https://astraldraft.netlify.app',
    'https://astral-draft.netlify.app',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8765'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mock API endpoints for development
app.get('/leagues', (req, res) => {
  res.json({
    leagues: [
      {
        id: '1',
        name: 'Championship League',
        members: 12,
        status: 'active',
        draftDate: '2024-09-01T19:00:00Z'
      }
    ]
  });
});

app.get('/players', (req, res) => {
  res.json({
    players: [
      {
        id: '1',
        name: 'Josh Allen',
        position: 'QB',
        team: 'BUF',
        projectedPoints: 24.5,
        adp: 1.2
      },
      {
        id: '2',
        name: 'Christian McCaffrey',
        position: 'RB',
        team: 'SF',
        projectedPoints: 22.8,
        adp: 2.1
      }
    ]
  });
});

app.get('/oracle/predictions', (req, res) => {
  res.json({
    predictions: [
      {
        playerId: '1',
        week: 1,
        projectedPoints: 24.5,
        confidence: 0.85,
        factors: ['Strong matchup', 'Home game', 'Weather favorable']
      }
    ]
  });
});

// Authentication endpoints
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock authentication
  if (email && password) {
    res.json({
      success: true,
      user: {
        id: '1',
        email: email,
        name: 'Demo User',
        leagues: ['1']
      },
      token: 'mock-jwt-token'
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Email and password required'
    });
  }
});

app.post('/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  
  if (email && password && name) {
    res.json({
      success: true,
      user: {
        id: '2',
        email: email,
        name: name,
        leagues: []
      },
      token: 'mock-jwt-token'
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Email, password, and name required'
    });
  }
});

// Draft endpoints
app.get('/draft/:leagueId', (req, res) => {
  const { leagueId } = req.params;
  
  res.json({
    draftId: `draft-${leagueId}`,
    status: 'active',
    currentPick: 1,
    currentTeam: 'team-1',
    timeRemaining: 90,
    picks: []
  });
});

app.post('/draft/:leagueId/pick', (req, res) => {
  const { leagueId } = req.params;
  const { playerId, teamId } = req.body;
  
  res.json({
    success: true,
    pick: {
      playerId,
      teamId,
      pickNumber: 1,
      timestamp: new Date().toISOString()
    }
  });
});

// Analytics endpoints
app.get('/analytics/player/:playerId', (req, res) => {
  const { playerId } = req.params;
  
  res.json({
    playerId,
    stats: {
      projectedPoints: 18.5,
      consistency: 0.78,
      upside: 0.85,
      floor: 12.2,
      ceiling: 28.4
    },
    trends: {
      last4Weeks: [16.2, 18.8, 22.1, 19.5],
      seasonProjection: 285.6
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Export the serverless function
module.exports.handler = serverless(app);