/**
 * Astral Draft Backend Server
 * Express.js server with WebSocket support for real-time features
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

// Import database manager
const dbManager = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const leagueRoutes = require('./routes/leagues');
const playerRoutes = require('./routes/players');
const draftRoutes = require('./routes/draft');
const tradeRoutes = require('./routes/trades');
const waiverRoutes = require('./routes/waivers');
const matchupRoutes = require('./routes/matchups');
const oracleRoutes = require('./routes/oracle');
const mfaRoutes = require('./routes/mfa');
const oauthRoutes = require('./routes/oauth');

// Import services
const sportsDataService = require('./services/sportsDataService');
const waiverProcessor = require('./services/waiverProcessor');
const scoringEngine = require('./services/scoringEngine');
const mfaService = require('./services/mfaService');
const securityAuditService = require('./services/securityAuditService');
const securityMiddleware = require('./middleware/securityMiddleware');

// Import WebSocket handlers
const draftSocketHandler = require('./websocket/draftHandler');
const chatSocketHandler = require('./websocket/chatHandler');
const liveUpdatesHandler = require('./websocket/liveUpdatesHandler');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Make io globally available for services
global.io = io;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: [
        "'self'", 
        "wss:", 
        "ws:",
        // Development WebSocket connections
        ...(process.env.NODE_ENV === 'development' ? [
          "ws://localhost:*",
          "http://localhost:*",
          "ws://127.0.0.1:*",
          "http://127.0.0.1:*"
        ] : []),
        // Production WebSocket connections
        ...(process.env.NODE_ENV === 'production' ? [
          "wss://astraldraft.netlify.app",
          "https://astraldraft.netlify.app"
        ] : []),
        // External APIs
        "https://fonts.googleapis.com",
        "https://fonts.gstatic.com",
        "https://api.gemini.com",
        "https://generativelanguage.googleapis.com",
        "https://*.espn.com",
        "https://api.the-odds-api.com",
        "https://api.sportsdata.io",
        "https://api.openai.com"
      ].filter(Boolean)
    }
  }
}));

app.use(compression());
app.use(morgan('combined'));

// Enhanced security middleware
app.use(securityMiddleware.securityHeaders());
app.use(securityMiddleware.ipBlocking());
app.use(securityMiddleware.botDetection());
app.use(securityMiddleware.xssProtection());
app.use(securityMiddleware.sqlInjectionProtection());
app.use(securityMiddleware.requestSizeLimit('10mb'));

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

// Enhanced rate limiting
const generalLimiter = securityMiddleware.createAdvancedRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
app.use('/api/', generalLimiter);

const speedLimit = securityMiddleware.createSpeedLimit({
  windowMs: 15 * 60 * 1000,
  delayAfter: 50,
  delayMs: 500
});
app.use('/api/', speedLimit);

// Stricter rate limiting for auth endpoints
const authLimiter = securityMiddleware.createAdvancedRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/mfa/', authLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: await dbManager.healthCheck(),
        waiverProcessor: waiverProcessor.healthCheck(),
        scoringEngine: scoringEngine.healthCheck()
      }
    };
    
    res.json(health);
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Make io available to routes
app.set('io', io);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/mfa', mfaRoutes);
app.use('/api/oauth', oauthRoutes);
app.use('/api/leagues', leagueRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/draft', draftRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/waivers', waiverRoutes);
app.use('/api/matchups', matchupRoutes);
app.use('/api/oracle', oracleRoutes);

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle authentication
  socket.on('authenticate', async (token) => {
    try {
      // TODO: Implement JWT token verification
      const user = await verifyToken(token);
      socket.userId = user.id;
      socket.user = user;
      socket.emit('authenticated', { success: true, user });
    } catch (error) {
      socket.emit('authenticated', { success: false, error: 'Invalid token' });
    }
  });

  // Draft room handlers
  draftSocketHandler(socket, io);
  
  // Chat handlers
  chatSocketHandler(socket, io);
  
  // Live updates handlers
  liveUpdatesHandler(socket, io);

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// JWT token verification (placeholder)
async function verifyToken(token) {
  // TODO: Implement actual JWT verification
  // For now, return mock user
  return {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User'
  };
}

const PORT = process.env.PORT || 3001;

// Initialize database and start server
async function startServer() {
  try {
    console.log('🚀 Starting Astral Draft server...');
    
    // Connect to databases
    await dbManager.connect();
    console.log('✅ Database connected');
    
    // Initialize services
    waiverProcessor.initialize();
    console.log('✅ Waiver processor initialized');
    
    scoringEngine.initialize();
    console.log('✅ Scoring engine initialized');
    
    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 Astral Draft server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log('');
      console.log('🎯 Available API Endpoints:');
      console.log('  • Authentication: /api/auth/*');
      console.log('  • Leagues: /api/leagues/*');
      console.log('  • Players: /api/players/*');
      console.log('  • Drafts: /api/draft/*');
      console.log('  • Trades: /api/trades/*');
      console.log('  • Waivers: /api/waivers/*');
      console.log('  • AI Oracle: /api/oracle/*');
      console.log('');
      console.log('🔥 All systems operational!');
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  waiverProcessor.stop();
  scoringEngine.stop();
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  waiverProcessor.stop();
  scoringEngine.stop();
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Start the server
startServer();

module.exports = { app, server, io };
