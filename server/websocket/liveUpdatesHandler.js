/**
 * Live Updates WebSocket Handler
 * Handles real-time updates for scores, player news, and league events
 */

const League = require('../models/League');
const Team = require('../models/Team');
const Player = require('../models/Player');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

class LiveUpdatesHandler {
  constructor(io) {
    this.io = io;
    this.subscribedUsers = new Map(); // userId -> { socket, subscriptions }
    this.leagueSubscriptions = new Map(); // leagueId -> Set of userIds
    this.playerSubscriptions = new Map(); // playerId -> Set of userIds
    this.updateIntervals = new Map(); // type -> interval
    
    // Start periodic updates
    this.startPeriodicUpdates();
  }

  handleConnection(socket) {
    console.log(`Live updates socket connected: ${socket.id}`);

    // Handle authentication
    socket.on('live:authenticate', async (data) => {
      try {
        const { token } = data;
        
        if (!token) {
          socket.emit('live:error', { error: 'Token required' });
          return;
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Get user data
        const user = await User.findById(userId).select('username displayName avatar');
        if (!user) {
          socket.emit('live:error', { error: 'User not found' });
          return;
        }

        // Store socket data
        socket.userId = userId;
        socket.user = user;

        // Track user socket
        this.subscribedUsers.set(userId, {
          socket: socket,
          subscriptions: {
            leagues: new Set(),
            players: new Set(),
            general: false
          }
        });

        // Send authentication success
        socket.emit('live:authenticated', {
          success: true,
          user: user
        });

        console.log(`User ${user.displayName} authenticated for live updates`);

      } catch (error) {
        console.error('Live updates authentication error:', error);
        socket.emit('live:error', { error: 'Authentication failed' });
      }
    });

    // Handle league subscription
    socket.on('live:subscribe_league', async (data) => {
      try {
        await this.handleSubscribeLeague(socket, data);
      } catch (error) {
        console.error('Subscribe league error:', error);
        socket.emit('live:error', { error: 'Failed to subscribe to league' });
      }
    });

    // Handle player subscription
    socket.on('live:subscribe_player', async (data) => {
      try {
        await this.handleSubscribePlayer(socket, data);
      } catch (error) {
        console.error('Subscribe player error:', error);
        socket.emit('live:error', { error: 'Failed to subscribe to player' });
      }
    });

    // Handle general updates subscription
    socket.on('live:subscribe_general', (data) => {
      try {
        this.handleSubscribeGeneral(socket, data);
      } catch (error) {
        console.error('Subscribe general error:', error);
        socket.emit('live:error', { error: 'Failed to subscribe to general updates' });
      }
    });

    // Handle unsubscribe requests
    socket.on('live:unsubscribe_league', (data) => {
      try {
        this.handleUnsubscribeLeague(socket, data);
      } catch (error) {
        console.error('Unsubscribe league error:', error);
      }
    });

    socket.on('live:unsubscribe_player', (data) => {
      try {
        this.handleUnsubscribePlayer(socket, data);
      } catch (error) {
        console.error('Unsubscribe player error:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      try {
        this.handleDisconnection(socket);
      } catch (error) {
        console.error('Live updates disconnection error:', error);
      }
    });
  }

  async handleSubscribeLeague(socket, data) {
    const { leagueId } = data;
    const { userId } = socket;

    if (!leagueId) {
      socket.emit('live:error', { error: 'League ID required' });
      return;
    }

    // Verify user has access to this league
    const team = await Team.findOne({
      owner: userId,
      leagueId: leagueId
    });

    if (!team) {
      socket.emit('live:error', { error: 'Access denied to this league' });
      return;
    }

    // Add to subscriptions
    const userSub = this.subscribedUsers.get(userId);
    if (userSub) {
      userSub.subscriptions.leagues.add(leagueId);
    }

    // Add to league subscriptions
    if (!this.leagueSubscriptions.has(leagueId)) {
      this.leagueSubscriptions.set(leagueId, new Set());
    }
    this.leagueSubscriptions.get(leagueId).add(userId);

    // Join league room
    socket.join(`league:${leagueId}`);

    // Send current league data
    const league = await League.findById(leagueId);
    const standings = await Team.getLeagueStandings(leagueId);

    socket.emit('live:league_subscribed', {
      leagueId: leagueId,
      league: league,
      standings: standings
    });

    console.log(`User ${socket.user.displayName} subscribed to league ${leagueId}`);
  }

  async handleSubscribePlayer(socket, data) {
    const { playerId } = data;
    const { userId } = socket;

    if (!playerId) {
      socket.emit('live:error', { error: 'Player ID required' });
      return;
    }

    // Verify player exists
    const player = await Player.findById(playerId);
    if (!player) {
      socket.emit('live:error', { error: 'Player not found' });
      return;
    }

    // Add to subscriptions
    const userSub = this.subscribedUsers.get(userId);
    if (userSub) {
      userSub.subscriptions.players.add(playerId);
    }

    // Add to player subscriptions
    if (!this.playerSubscriptions.has(playerId)) {
      this.playerSubscriptions.set(playerId, new Set());
    }
    this.playerSubscriptions.get(playerId).add(userId);

    // Join player room
    socket.join(`player:${playerId}`);

    // Send current player data
    socket.emit('live:player_subscribed', {
      playerId: playerId,
      player: player
    });

    console.log(`User ${socket.user.displayName} subscribed to player ${player.name}`);
  }

  handleSubscribeGeneral(socket, data) {
    const { userId } = socket;

    // Add to general subscriptions
    const userSub = this.subscribedUsers.get(userId);
    if (userSub) {
      userSub.subscriptions.general = true;
    }

    // Join general updates room
    socket.join('general');

    socket.emit('live:general_subscribed', {
      success: true
    });

    console.log(`User ${socket.user.displayName} subscribed to general updates`);
  }

  handleUnsubscribeLeague(socket, data) {
    const { leagueId } = data;
    const { userId } = socket;

    // Remove from subscriptions
    const userSub = this.subscribedUsers.get(userId);
    if (userSub) {
      userSub.subscriptions.leagues.delete(leagueId);
    }

    // Remove from league subscriptions
    const leagueSub = this.leagueSubscriptions.get(leagueId);
    if (leagueSub) {
      leagueSub.delete(userId);
      if (leagueSub.size === 0) {
        this.leagueSubscriptions.delete(leagueId);
      }
    }

    // Leave league room
    socket.leave(`league:${leagueId}`);

    socket.emit('live:league_unsubscribed', { leagueId });
  }

  handleUnsubscribePlayer(socket, data) {
    const { playerId } = data;
    const { userId } = socket;

    // Remove from subscriptions
    const userSub = this.subscribedUsers.get(userId);
    if (userSub) {
      userSub.subscriptions.players.delete(playerId);
    }

    // Remove from player subscriptions
    const playerSub = this.playerSubscriptions.get(playerId);
    if (playerSub) {
      playerSub.delete(userId);
      if (playerSub.size === 0) {
        this.playerSubscriptions.delete(playerId);
      }
    }

    // Leave player room
    socket.leave(`player:${playerId}`);

    socket.emit('live:player_unsubscribed', { playerId });
  }

  handleDisconnection(socket) {
    const { userId } = socket;

    if (userId) {
      // Get user subscriptions
      const userSub = this.subscribedUsers.get(userId);
      if (userSub) {
        // Remove from all league subscriptions
        for (const leagueId of userSub.subscriptions.leagues) {
          const leagueSub = this.leagueSubscriptions.get(leagueId);
          if (leagueSub) {
            leagueSub.delete(userId);
            if (leagueSub.size === 0) {
              this.leagueSubscriptions.delete(leagueId);
            }
          }
        }

        // Remove from all player subscriptions
        for (const playerId of userSub.subscriptions.players) {
          const playerSub = this.playerSubscriptions.get(playerId);
          if (playerSub) {
            playerSub.delete(userId);
            if (playerSub.size === 0) {
              this.playerSubscriptions.delete(playerId);
            }
          }
        }
      }

      // Remove user subscription
      this.subscribedUsers.delete(userId);

      console.log(`User ${socket.user?.displayName} disconnected from live updates`);
    }
  }

  startPeriodicUpdates() {
    // Update scores every 30 seconds during game time
    this.updateIntervals.set('scores', setInterval(() => {
      this.updateScores();
    }, 30000));

    // Update player news every 5 minutes
    this.updateIntervals.set('news', setInterval(() => {
      this.updatePlayerNews();
    }, 300000));

    // Update injury reports every 10 minutes
    this.updateIntervals.set('injuries', setInterval(() => {
      this.updateInjuryReports();
    }, 600000));

    // Update league standings every minute
    this.updateIntervals.set('standings', setInterval(() => {
      this.updateLeagueStandings();
    }, 60000));

    console.log('Started periodic live updates');
  }

  async updateScores() {
    try {
      // This would integrate with real-time scoring API
      // For now, we'll simulate score updates
      
      const currentWeek = await this.getCurrentWeek();
      if (!currentWeek) return;

      // Get all active leagues
      const activeLeagues = await League.find({ status: 'ACTIVE' });

      for (const league of activeLeagues) {
        // Simulate score updates for teams in this league
        const teams = await Team.find({ leagueId: league._id });
        
        for (const team of teams) {
          // Simulate weekly score update
          const weeklyScore = Math.floor(Math.random() * 50) + 80; // 80-130 points
          
          // Broadcast score update to league subscribers
          this.io.to(`league:${league._id}`).emit('live:score_update', {
            leagueId: league._id,
            teamId: team._id,
            teamName: team.name,
            week: currentWeek,
            score: weeklyScore,
            timestamp: new Date()
          });
        }
      }

    } catch (error) {
      console.error('Score update error:', error);
    }
  }

  async updatePlayerNews() {
    try {
      // This would integrate with news API
      // For now, we'll simulate news updates
      
      const recentNews = [
        { type: 'injury', severity: 'low' },
        { type: 'trade', severity: 'high' },
        { type: 'performance', severity: 'medium' },
        { type: 'suspension', severity: 'high' }
      ];

      // Get random players to update
      const players = await Player.aggregate([
        { $match: { status: 'ACTIVE' } },
        { $sample: { size: 5 } }
      ]);

      for (const player of players) {
        const newsItem = recentNews[Math.floor(Math.random() * recentNews.length)];
        
        // Add news to player
        await Player.findByIdAndUpdate(player._id, {
          $push: {
            news: {
              headline: `${player.name} ${newsItem.type} update`,
              content: `Latest ${newsItem.type} news for ${player.name}`,
              source: 'ESPN',
              impact: newsItem.severity.toUpperCase(),
              publishedAt: new Date()
            }
          }
        });

        // Broadcast to player subscribers
        this.io.to(`player:${player._id}`).emit('live:player_news', {
          playerId: player._id,
          playerName: player.name,
          news: {
            headline: `${player.name} ${newsItem.type} update`,
            content: `Latest ${newsItem.type} news for ${player.name}`,
            impact: newsItem.severity.toUpperCase(),
            timestamp: new Date()
          }
        });
      }

    } catch (error) {
      console.error('Player news update error:', error);
    }
  }

  async updateInjuryReports() {
    try {
      // Simulate injury report updates
      const injuryStatuses = ['HEALTHY', 'QUESTIONABLE', 'DOUBTFUL', 'OUT'];
      
      // Get random players to update
      const players = await Player.aggregate([
        { $match: { status: 'ACTIVE' } },
        { $sample: { size: 10 } }
      ]);

      for (const player of players) {
        const newStatus = injuryStatuses[Math.floor(Math.random() * injuryStatuses.length)];
        
        // Update injury status
        await Player.findByIdAndUpdate(player._id, {
          'injuryStatus.designation': newStatus,
          'injuryStatus.updatedAt': new Date()
        });

        // Broadcast to player subscribers
        this.io.to(`player:${player._id}`).emit('live:injury_update', {
          playerId: player._id,
          playerName: player.name,
          injuryStatus: {
            designation: newStatus,
            updatedAt: new Date()
          }
        });
      }

    } catch (error) {
      console.error('Injury report update error:', error);
    }
  }

  async updateLeagueStandings() {
    try {
      // Update standings for all subscribed leagues
      for (const leagueId of this.leagueSubscriptions.keys()) {
        const standings = await Team.getLeagueStandings(leagueId);
        
        // Broadcast standings update
        this.io.to(`league:${leagueId}`).emit('live:standings_update', {
          leagueId: leagueId,
          standings: standings,
          timestamp: new Date()
        });
      }

    } catch (error) {
      console.error('Standings update error:', error);
    }
  }

  async getCurrentWeek() {
    try {
      // This would get the current NFL week
      // For now, return a simulated week
      const now = new Date();
      const seasonStart = new Date(now.getFullYear(), 8, 1); // September 1st
      const weeksSinceStart = Math.floor((now - seasonStart) / (7 * 24 * 60 * 60 * 1000));
      return Math.min(Math.max(weeksSinceStart + 1, 1), 18);
    } catch (error) {
      console.error('Get current week error:', error);
      return 1;
    }
  }

  // Manual update triggers (for testing or admin use)
  async triggerScoreUpdate(leagueId) {
    try {
      const teams = await Team.find({ leagueId: leagueId });
      const currentWeek = await this.getCurrentWeek();
      
      for (const team of teams) {
        const weeklyScore = Math.floor(Math.random() * 50) + 80;
        
        this.io.to(`league:${leagueId}`).emit('live:score_update', {
          leagueId: leagueId,
          teamId: team._id,
          teamName: team.name,
          week: currentWeek,
          score: weeklyScore,
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('Manual score update error:', error);
    }
  }

  async triggerPlayerUpdate(playerId, updateType, data) {
    try {
      const player = await Player.findById(playerId);
      if (!player) return;

      this.io.to(`player:${playerId}`).emit(`live:player_${updateType}`, {
        playerId: playerId,
        playerName: player.name,
        ...data,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Manual player update error:', error);
    }
  }

  // Cleanup method
  cleanup() {
    // Clear all intervals
    for (const interval of this.updateIntervals.values()) {
      clearInterval(interval);
    }
    
    this.updateIntervals.clear();
    this.subscribedUsers.clear();
    this.leagueSubscriptions.clear();
    this.playerSubscriptions.clear();
    
    console.log('Live updates handler cleaned up');
  }

  // Statistics
  getStats() {
    return {
      connectedUsers: this.subscribedUsers.size,
      leagueSubscriptions: this.leagueSubscriptions.size,
      playerSubscriptions: this.playerSubscriptions.size,
      activeIntervals: this.updateIntervals.size
    };
  }
}

module.exports = (socket, io) => {
  if (!io.liveUpdatesHandler) {
    io.liveUpdatesHandler = new LiveUpdatesHandler(io);
  }
  
  io.liveUpdatesHandler.handleConnection(socket);
};