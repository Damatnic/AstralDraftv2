/**
 * Draft WebSocket Handler
 * Handles real-time draft room functionality
 */

const Draft = require('../models/Draft');
const Team = require('../models/Team');
const Player = require('../models/Player');
const jwt = require('jsonwebtoken');

class DraftSocketHandler {
  constructor(io) {
    this.io = io;
    this.draftRooms = new Map(); // draftId -> room data
    this.userSockets = new Map(); // userId -> socket
    this.pickTimers = new Map(); // draftId -> timer
  }

  handleConnection(socket) {
    console.log(`Draft socket connected: ${socket.id}`);

    // Handle authentication
    socket.on('draft:authenticate', async (data) => {
      try {
        const { token, draftId } = data;
        
        if (!token || !draftId) {
          socket.emit('draft:error', { error: 'Token and draft ID required' });
          return;
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Find user's team in this draft
        const draft = await Draft.findById(draftId).populate('leagueId');
        if (!draft) {
          socket.emit('draft:error', { error: 'Draft not found' });
          return;
        }

        const userTeam = await Team.findOne({
          owner: userId,
          leagueId: draft.leagueId._id
        }).populate('owner', 'username displayName avatar');

        if (!userTeam) {
          socket.emit('draft:error', { error: 'Access denied' });
          return;
        }

        // Store socket data
        socket.userId = userId;
        socket.draftId = draftId;
        socket.teamId = userTeam._id.toString();
        socket.user = userTeam.owner;

        // Join draft room
        socket.join(`draft:${draftId}`);
        
        // Track user socket
        this.userSockets.set(userId, socket);

        // Update team online status
        await draft.updateTeamOnlineStatus(userTeam._id, true);

        // Initialize draft room if needed
        if (!this.draftRooms.has(draftId)) {
          await this.initializeDraftRoom(draftId);
        }

        // Send authentication success
        socket.emit('draft:authenticated', {
          success: true,
          user: userTeam.owner,
          team: userTeam,
          draft: await this.getDraftState(draftId)
        });

        // Notify room of user joining
        socket.to(`draft:${draftId}`).emit('draft:user_joined', {
          userId: userId,
          username: userTeam.owner.displayName,
          teamName: userTeam.name,
          avatar: userTeam.owner.avatar
        });

        console.log(`User ${userTeam.owner.displayName} joined draft ${draftId}`);

      } catch (error) {
        console.error('Draft authentication error:', error);
        socket.emit('draft:error', { error: 'Authentication failed' });
      }
    });

    // Handle draft pick
    socket.on('draft:make_pick', async (data) => {
      try {
        await this.handleMakePick(socket, data);
      } catch (error) {
        console.error('Make pick error:', error);
        socket.emit('draft:error', { error: 'Failed to make pick' });
      }
    });

    // Handle chat messages
    socket.on('draft:chat_message', async (data) => {
      try {
        await this.handleChatMessage(socket, data);
      } catch (error) {
        console.error('Chat message error:', error);
        socket.emit('draft:error', { error: 'Failed to send message' });
      }
    });

    // Handle autopick toggle
    socket.on('draft:toggle_autopick', async (data) => {
      try {
        await this.handleToggleAutopick(socket, data);
      } catch (error) {
        console.error('Toggle autopick error:', error);
        socket.emit('draft:error', { error: 'Failed to toggle autopick' });
      }
    });

    // Handle draft pause/resume (commissioner only)
    socket.on('draft:pause', async () => {
      try {
        await this.handlePauseDraft(socket);
      } catch (error) {
        console.error('Pause draft error:', error);
        socket.emit('draft:error', { error: 'Failed to pause draft' });
      }
    });

    socket.on('draft:resume', async () => {
      try {
        await this.handleResumeDraft(socket);
      } catch (error) {
        console.error('Resume draft error:', error);
        socket.emit('draft:error', { error: 'Failed to resume draft' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      try {
        await this.handleDisconnection(socket);
      } catch (error) {
        console.error('Disconnection error:', error);
      }
    });
  }

  async initializeDraftRoom(draftId) {
    try {
      const draft = await Draft.findById(draftId)
        .populate([
          { path: 'leagueId', select: 'name settings' },
          { path: 'draftOrder.teamId', select: 'name owner abbreviation', populate: { path: 'owner', select: 'username displayName avatar' } }
        ]);

      if (!draft) return;

      const roomData = {
        draftId: draftId,
        status: draft.status,
        currentPick: draft.currentPick,
        connectedUsers: new Set(),
        pickTimer: null
      };

      this.draftRooms.set(draftId, roomData);

      // Start pick timer if draft is in progress
      if (draft.status === 'IN_PROGRESS') {
        this.startPickTimer(draftId);
      }

      console.log(`Initialized draft room: ${draftId}`);
    } catch (error) {
      console.error('Initialize draft room error:', error);
    }
  }

  async getDraftState(draftId) {
    try {
      const draft = await Draft.findById(draftId)
        .populate([
          { path: 'leagueId', select: 'name settings' },
          { path: 'draftOrder.teamId', select: 'name owner abbreviation', populate: { path: 'owner', select: 'username displayName avatar' } },
          { path: 'picks.teamId', select: 'name abbreviation' },
          { path: 'picks.playerId', select: 'name position team rankings photoUrl' },
          { path: 'currentPick.teamId', select: 'name owner', populate: { path: 'owner', select: 'displayName' } }
        ]);

      if (!draft) return null;

      return {
        id: draft._id,
        status: draft.status,
        type: draft.type,
        currentPick: draft.currentPick,
        picks: draft.picks.slice(-10), // Last 10 picks
        upcomingPicks: draft.getUpcomingPicks(5),
        draftOrder: draft.draftOrder,
        settings: draft.settings,
        stats: draft.stats,
        chatMessages: draft.chatMessages.slice(-50) // Last 50 messages
      };
    } catch (error) {
      console.error('Get draft state error:', error);
      return null;
    }
  }

  async handleMakePick(socket, data) {
    const { playerId } = data;
    const { draftId, teamId, userId } = socket;

    if (!playerId) {
      socket.emit('draft:error', { error: 'Player ID required' });
      return;
    }

    // Find draft
    const draft = await Draft.findById(draftId);
    if (!draft) {
      socket.emit('draft:error', { error: 'Draft not found' });
      return;
    }

    // Check if it's user's turn
    if (draft.currentPick.teamId.toString() !== teamId) {
      socket.emit('draft:error', { error: 'Not your turn to pick' });
      return;
    }

    // Check if player is available
    const player = await Player.findById(playerId);
    if (!player) {
      socket.emit('draft:error', { error: 'Player not found' });
      return;
    }

    const alreadyDrafted = draft.picks.some(pick => 
      pick.playerId.toString() === playerId.toString()
    );

    if (alreadyDrafted) {
      socket.emit('draft:error', { error: 'Player already drafted' });
      return;
    }

    // Calculate pick time
    const pickStartTime = draft.currentPick.pickStartedAt;
    const pickTime = pickStartTime ? Math.floor((Date.now() - pickStartTime.getTime()) / 1000) : 0;

    // Make the pick
    await draft.makePick(teamId, playerId, pickTime, false);

    // Add player to team roster
    const team = await Team.findById(teamId);
    await team.addPlayer(playerId, 'BENCH', 'draft');

    // Clear pick timer
    this.clearPickTimer(draftId);

    // Add system chat message
    await draft.addChatMessage(
      userId,
      `${team.name} selects ${player.name} (${player.position} - ${player.team})`,
      'pick'
    );

    // Broadcast pick to all users in draft room
    this.io.to(`draft:${draftId}`).emit('draft:pick_made', {
      pick: {
        round: draft.currentPick.round,
        pick: draft.currentPick.pick,
        overallPick: draft.currentPick.overallPick,
        teamId: teamId,
        teamName: team.name,
        playerId: playerId,
        playerName: player.name,
        playerPosition: player.position,
        playerTeam: player.team,
        pickTime: pickTime,
        timestamp: new Date()
      },
      currentPick: draft.currentPick,
      isComplete: draft.status === 'COMPLETED'
    });

    // Start timer for next pick if draft continues
    if (draft.status === 'IN_PROGRESS') {
      this.startPickTimer(draftId);
    }

    // Update draft room data
    const roomData = this.draftRooms.get(draftId);
    if (roomData) {
      roomData.currentPick = draft.currentPick;
      roomData.status = draft.status;
    }

    console.log(`Pick made: ${player.name} to ${team.name} in draft ${draftId}`);
  }

  async handleChatMessage(socket, data) {
    const { message } = data;
    const { draftId, userId } = socket;

    if (!message || message.trim().length === 0) {
      socket.emit('draft:error', { error: 'Message cannot be empty' });
      return;
    }

    if (message.length > 500) {
      socket.emit('draft:error', { error: 'Message too long' });
      return;
    }

    // Find draft and add message
    const draft = await Draft.findById(draftId);
    if (!draft) {
      socket.emit('draft:error', { error: 'Draft not found' });
      return;
    }

    await draft.addChatMessage(userId, message.trim(), 'message');

    // Broadcast message to all users in draft room
    this.io.to(`draft:${draftId}`).emit('draft:chat_message', {
      userId: userId,
      username: socket.user.displayName,
      avatar: socket.user.avatar,
      message: message.trim(),
      timestamp: new Date(),
      type: 'message'
    });
  }

  async handleToggleAutopick(socket, data) {
    const { enabled } = data;
    const { teamId } = socket;

    // Update team autopick setting
    const team = await Team.findById(teamId);
    if (!team) {
      socket.emit('draft:error', { error: 'Team not found' });
      return;
    }

    team.settings.autoSetLineup = enabled;
    await team.save();

    socket.emit('draft:autopick_updated', {
      enabled: enabled
    });
  }

  async handlePauseDraft(socket) {
    const { draftId, userId } = socket;

    // Find draft and check permissions
    const draft = await Draft.findById(draftId).populate('leagueId');
    if (!draft) {
      socket.emit('draft:error', { error: 'Draft not found' });
      return;
    }

    if (!draft.leagueId.isCommissioner(userId)) {
      socket.emit('draft:error', { error: 'Only commissioner can pause draft' });
      return;
    }

    // Pause draft
    await draft.pause('Paused by commissioner', userId);

    // Clear pick timer
    this.clearPickTimer(draftId);

    // Broadcast pause to all users
    this.io.to(`draft:${draftId}`).emit('draft:paused', {
      pausedBy: socket.user.displayName,
      reason: 'Paused by commissioner'
    });

    // Update room data
    const roomData = this.draftRooms.get(draftId);
    if (roomData) {
      roomData.status = 'PAUSED';
    }
  }

  async handleResumeDraft(socket) {
    const { draftId, userId } = socket;

    // Find draft and check permissions
    const draft = await Draft.findById(draftId).populate('leagueId');
    if (!draft) {
      socket.emit('draft:error', { error: 'Draft not found' });
      return;
    }

    if (!draft.leagueId.isCommissioner(userId)) {
      socket.emit('draft:error', { error: 'Only commissioner can resume draft' });
      return;
    }

    // Resume draft
    await draft.resume();

    // Start pick timer
    this.startPickTimer(draftId);

    // Broadcast resume to all users
    this.io.to(`draft:${draftId}`).emit('draft:resumed', {
      resumedBy: socket.user.displayName,
      currentPick: draft.currentPick
    });

    // Update room data
    const roomData = this.draftRooms.get(draftId);
    if (roomData) {
      roomData.status = 'IN_PROGRESS';
      roomData.currentPick = draft.currentPick;
    }
  }

  async handleDisconnection(socket) {
    const { draftId, teamId, userId } = socket;

    if (draftId && teamId) {
      // Update team offline status
      const draft = await Draft.findById(draftId);
      if (draft) {
        await draft.updateTeamOnlineStatus(teamId, false);
      }

      // Remove from user sockets
      this.userSockets.delete(userId);

      // Notify room of user leaving
      socket.to(`draft:${draftId}`).emit('draft:user_left', {
        userId: userId,
        username: socket.user?.displayName,
        teamName: socket.teamName
      });

      console.log(`User ${socket.user?.displayName} left draft ${draftId}`);
    }
  }

  startPickTimer(draftId) {
    // Clear existing timer
    this.clearPickTimer(draftId);

    const roomData = this.draftRooms.get(draftId);
    if (!roomData) return;

    // Start countdown timer
    let timeRemaining = 90; // Default pick time limit
    
    const timer = setInterval(async () => {
      timeRemaining--;

      // Broadcast time update every 10 seconds or last 10 seconds
      if (timeRemaining % 10 === 0 || timeRemaining <= 10) {
        this.io.to(`draft:${draftId}`).emit('draft:pick_timer', {
          timeRemaining: timeRemaining
        });
      }

      // Auto-pick when time expires
      if (timeRemaining <= 0) {
        clearInterval(timer);
        this.pickTimers.delete(draftId);
        
        try {
          await this.handleAutoPick(draftId);
        } catch (error) {
          console.error('Auto-pick error:', error);
        }
      }
    }, 1000);

    this.pickTimers.set(draftId, timer);
  }

  clearPickTimer(draftId) {
    const timer = this.pickTimers.get(draftId);
    if (timer) {
      clearInterval(timer);
      this.pickTimers.delete(draftId);
    }
  }

  async handleAutoPick(draftId) {
    try {
      const draft = await Draft.findById(draftId);
      if (!draft || draft.status !== 'IN_PROGRESS') return;

      // Get current team
      const currentTeam = await Team.findById(draft.currentPick.teamId);
      if (!currentTeam) return;

      // Check if autopick is enabled for this team
      if (!currentTeam.settings.autoSetLineup) {
        // Skip this pick and move to next
        this.io.to(`draft:${draftId}`).emit('draft:pick_skipped', {
          teamName: currentTeam.name,
          reason: 'Autopick disabled'
        });
        
        // Advance to next pick
        draft.advanceToNextPick();
        await draft.save();
        
        // Start timer for next pick
        this.startPickTimer(draftId);
        return;
      }

      // Get drafted players
      const draftedPlayerIds = draft.picks.map(pick => pick.playerId);

      // Find best available player
      const availablePlayer = await Player.findOne({
        _id: { $nin: draftedPlayerIds },
        status: 'ACTIVE'
      }).sort({ 'rankings.overall': 1 });

      if (!availablePlayer) {
        console.error('No available players for autopick');
        return;
      }

      // Make autopick
      await draft.makePick(currentTeam._id, availablePlayer._id, 90, true);

      // Add player to team roster
      await currentTeam.addPlayer(availablePlayer._id, 'BENCH', 'draft');

      // Add system chat message
      await draft.addChatMessage(
        null,
        `AUTO-PICK: ${currentTeam.name} selects ${availablePlayer.name} (${availablePlayer.position} - ${availablePlayer.team})`,
        'system'
      );

      // Broadcast autopick
      this.io.to(`draft:${draftId}`).emit('draft:auto_pick', {
        pick: {
          round: draft.currentPick.round,
          pick: draft.currentPick.pick,
          overallPick: draft.currentPick.overallPick,
          teamId: currentTeam._id,
          teamName: currentTeam.name,
          playerId: availablePlayer._id,
          playerName: availablePlayer.name,
          playerPosition: availablePlayer.position,
          playerTeam: availablePlayer.team,
          isAutoPick: true,
          timestamp: new Date()
        },
        currentPick: draft.currentPick,
        isComplete: draft.status === 'COMPLETED'
      });

      // Start timer for next pick if draft continues
      if (draft.status === 'IN_PROGRESS') {
        this.startPickTimer(draftId);
      }

      console.log(`Auto-pick: ${availablePlayer.name} to ${currentTeam.name} in draft ${draftId}`);

    } catch (error) {
      console.error('Auto-pick error:', error);
    }
  }

  // Cleanup method
  cleanup() {
    // Clear all timers
    for (const timer of this.pickTimers.values()) {
      clearInterval(timer);
    }
    this.pickTimers.clear();
    this.draftRooms.clear();
    this.userSockets.clear();
  }
}

module.exports = (socket, io) => {
  if (!io.draftHandler) {
    io.draftHandler = new DraftSocketHandler(io);
  }
  
  io.draftHandler.handleConnection(socket);
};