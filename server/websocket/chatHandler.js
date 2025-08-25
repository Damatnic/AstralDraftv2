/**
 * Chat WebSocket Handler
 * Handles real-time chat functionality for leagues and drafts
 */

const League = require('../models/League');
const Team = require('../models/Team');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

class ChatSocketHandler {
  constructor(io) {
    this.io = io;
    this.chatRooms = new Map(); // roomId -> room data
    this.userSockets = new Map(); // userId -> socket
  }

  handleConnection(socket) {
    console.log(`Chat socket connected: ${socket.id}`);

    // Handle authentication
    socket.on('chat:authenticate', async (data) => {
      try {
        const { token } = data;
        
        if (!token) {
          socket.emit('chat:error', { error: 'Token required' });
          return;
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Get user data
        const user = await User.findById(userId).select('username displayName avatar');
        if (!user) {
          socket.emit('chat:error', { error: 'User not found' });
          return;
        }

        // Store socket data
        socket.userId = userId;
        socket.user = user;

        // Track user socket
        this.userSockets.set(userId, socket);

        // Send authentication success
        socket.emit('chat:authenticated', {
          success: true,
          user: user
        });

        console.log(`User ${user.displayName} authenticated for chat`);

      } catch (error) {
        console.error('Chat authentication error:', error);
        socket.emit('chat:error', { error: 'Authentication failed' });
      }
    });

    // Handle joining a chat room
    socket.on('chat:join_room', async (data) => {
      try {
        await this.handleJoinRoom(socket, data);
      } catch (error) {
        console.error('Join room error:', error);
        socket.emit('chat:error', { error: 'Failed to join room' });
      }
    });

    // Handle leaving a chat room
    socket.on('chat:leave_room', async (data) => {
      try {
        await this.handleLeaveRoom(socket, data);
      } catch (error) {
        console.error('Leave room error:', error);
        socket.emit('chat:error', { error: 'Failed to leave room' });
      }
    });

    // Handle sending a message
    socket.on('chat:send_message', async (data) => {
      try {
        await this.handleSendMessage(socket, data);
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('chat:error', { error: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('chat:typing_start', (data) => {
      try {
        this.handleTypingStart(socket, data);
      } catch (error) {
        console.error('Typing start error:', error);
      }
    });

    socket.on('chat:typing_stop', (data) => {
      try {
        this.handleTypingStop(socket, data);
      } catch (error) {
        console.error('Typing stop error:', error);
      }
    });

    // Handle message reactions
    socket.on('chat:add_reaction', async (data) => {
      try {
        await this.handleAddReaction(socket, data);
      } catch (error) {
        console.error('Add reaction error:', error);
        socket.emit('chat:error', { error: 'Failed to add reaction' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      try {
        this.handleDisconnection(socket);
      } catch (error) {
        console.error('Chat disconnection error:', error);
      }
    });
  }

  async handleJoinRoom(socket, data) {
    const { roomId, roomType } = data; // roomType: 'league', 'draft', 'direct'
    const { userId } = socket;

    if (!roomId || !roomType) {
      socket.emit('chat:error', { error: 'Room ID and type required' });
      return;
    }

    // Verify user has access to this room
    const hasAccess = await this.verifyRoomAccess(userId, roomId, roomType);
    if (!hasAccess) {
      socket.emit('chat:error', { error: 'Access denied to this room' });
      return;
    }

    // Join the room
    const roomKey = `${roomType}:${roomId}`;
    socket.join(roomKey);
    socket.currentRoom = roomKey;

    // Initialize room if needed
    if (!this.chatRooms.has(roomKey)) {
      this.chatRooms.set(roomKey, {
        id: roomId,
        type: roomType,
        users: new Set(),
        typingUsers: new Set(),
        messageHistory: []
      });
    }

    // Add user to room
    const room = this.chatRooms.get(roomKey);
    room.users.add(userId);

    // Notify room of user joining
    socket.to(roomKey).emit('chat:user_joined', {
      userId: userId,
      username: socket.user.displayName,
      avatar: socket.user.avatar,
      timestamp: new Date()
    });

    // Send room data to user
    socket.emit('chat:room_joined', {
      roomId: roomId,
      roomType: roomType,
      users: Array.from(room.users),
      recentMessages: room.messageHistory.slice(-50) // Last 50 messages
    });

    console.log(`User ${socket.user.displayName} joined chat room ${roomKey}`);
  }

  async handleLeaveRoom(socket, data) {
    const { roomId, roomType } = data;
    const { userId } = socket;

    const roomKey = `${roomType}:${roomId}`;
    
    // Leave the room
    socket.leave(roomKey);
    socket.currentRoom = null;

    // Remove user from room data
    const room = this.chatRooms.get(roomKey);
    if (room) {
      room.users.delete(userId);
      room.typingUsers.delete(userId);

      // Notify room of user leaving
      socket.to(roomKey).emit('chat:user_left', {
        userId: userId,
        username: socket.user.displayName,
        timestamp: new Date()
      });

      // Clean up empty rooms
      if (room.users.size === 0) {
        this.chatRooms.delete(roomKey);
      }
    }

    socket.emit('chat:room_left', { roomId, roomType });
    console.log(`User ${socket.user.displayName} left chat room ${roomKey}`);
  }

  async handleSendMessage(socket, data) {
    const { message, roomId, roomType, replyTo } = data;
    const { userId } = socket;

    if (!message || message.trim().length === 0) {
      socket.emit('chat:error', { error: 'Message cannot be empty' });
      return;
    }

    if (message.length > 1000) {
      socket.emit('chat:error', { error: 'Message too long (max 1000 characters)' });
      return;
    }

    const roomKey = `${roomType}:${roomId}`;
    
    // Verify user is in the room
    if (socket.currentRoom !== roomKey) {
      socket.emit('chat:error', { error: 'You are not in this room' });
      return;
    }

    // Create message object
    const messageObj = {
      id: this.generateMessageId(),
      userId: userId,
      username: socket.user.displayName,
      avatar: socket.user.avatar,
      message: message.trim(),
      timestamp: new Date(),
      replyTo: replyTo || null,
      reactions: {},
      edited: false,
      editedAt: null
    };

    // Add to room history
    const room = this.chatRooms.get(roomKey);
    if (room) {
      room.messageHistory.push(messageObj);
      
      // Keep only last 100 messages in memory
      if (room.messageHistory.length > 100) {
        room.messageHistory = room.messageHistory.slice(-100);
      }

      // Remove user from typing
      room.typingUsers.delete(userId);
    }

    // Broadcast message to room
    this.io.to(roomKey).emit('chat:new_message', messageObj);

    // Store message in database for persistence (optional)
    await this.storeMessage(roomId, roomType, messageObj);

    console.log(`Message sent in ${roomKey}: ${message.substring(0, 50)}...`);
  }

  handleTypingStart(socket, data) {
    const { roomId, roomType } = data;
    const { userId } = socket;

    const roomKey = `${roomType}:${roomId}`;
    
    if (socket.currentRoom !== roomKey) return;

    const room = this.chatRooms.get(roomKey);
    if (room) {
      room.typingUsers.add(userId);

      // Broadcast typing indicator
      socket.to(roomKey).emit('chat:typing_start', {
        userId: userId,
        username: socket.user.displayName
      });

      // Auto-stop typing after 5 seconds
      setTimeout(() => {
        if (room.typingUsers.has(userId)) {
          room.typingUsers.delete(userId);
          socket.to(roomKey).emit('chat:typing_stop', {
            userId: userId,
            username: socket.user.displayName
          });
        }
      }, 5000);
    }
  }

  handleTypingStop(socket, data) {
    const { roomId, roomType } = data;
    const { userId } = socket;

    const roomKey = `${roomType}:${roomId}`;
    
    if (socket.currentRoom !== roomKey) return;

    const room = this.chatRooms.get(roomKey);
    if (room) {
      room.typingUsers.delete(userId);

      // Broadcast typing stop
      socket.to(roomKey).emit('chat:typing_stop', {
        userId: userId,
        username: socket.user.displayName
      });
    }
  }

  async handleAddReaction(socket, data) {
    const { messageId, emoji, roomId, roomType } = data;
    const { userId } = socket;

    const roomKey = `${roomType}:${roomId}`;
    
    if (socket.currentRoom !== roomKey) {
      socket.emit('chat:error', { error: 'You are not in this room' });
      return;
    }

    const room = this.chatRooms.get(roomKey);
    if (!room) return;

    // Find message
    const message = room.messageHistory.find(msg => msg.id === messageId);
    if (!message) {
      socket.emit('chat:error', { error: 'Message not found' });
      return;
    }

    // Add or remove reaction
    if (!message.reactions[emoji]) {
      message.reactions[emoji] = [];
    }

    const userIndex = message.reactions[emoji].indexOf(userId);
    if (userIndex === -1) {
      // Add reaction
      message.reactions[emoji].push(userId);
    } else {
      // Remove reaction
      message.reactions[emoji].splice(userIndex, 1);
      if (message.reactions[emoji].length === 0) {
        delete message.reactions[emoji];
      }
    }

    // Broadcast reaction update
    this.io.to(roomKey).emit('chat:reaction_updated', {
      messageId: messageId,
      emoji: emoji,
      reactions: message.reactions,
      userId: userId,
      action: userIndex === -1 ? 'add' : 'remove'
    });
  }

  handleDisconnection(socket) {
    const { userId, currentRoom } = socket;

    if (userId) {
      // Remove from user sockets
      this.userSockets.delete(userId);

      // Remove from current room
      if (currentRoom) {
        const room = this.chatRooms.get(currentRoom);
        if (room) {
          room.users.delete(userId);
          room.typingUsers.delete(userId);

          // Notify room of user leaving
          socket.to(currentRoom).emit('chat:user_left', {
            userId: userId,
            username: socket.user?.displayName,
            timestamp: new Date()
          });

          // Clean up empty rooms
          if (room.users.size === 0) {
            this.chatRooms.delete(currentRoom);
          }
        }
      }

      console.log(`User ${socket.user?.displayName} disconnected from chat`);
    }
  }

  async verifyRoomAccess(userId, roomId, roomType) {
    try {
      switch (roomType) {
        case 'league':
          // Check if user has a team in this league
          const team = await Team.findOne({
            owner: userId,
            leagueId: roomId
          });
          return !!team;

        case 'draft':
          // Check if user is part of the draft's league
          const Draft = require('../models/Draft');
          const draft = await Draft.findById(roomId);
          if (!draft) return false;
          
          const draftTeam = await Team.findOne({
            owner: userId,
            leagueId: draft.leagueId
          });
          return !!draftTeam;

        case 'direct':
          // For direct messages, check if user is one of the participants
          // This would require a DirectMessage model (not implemented yet)
          return true; // Placeholder

        default:
          return false;
      }
    } catch (error) {
      console.error('Room access verification error:', error);
      return false;
    }
  }

  async storeMessage(roomId, roomType, messageObj) {
    try {
      // This would store messages in database for persistence
      // For now, we'll just keep them in memory
      // In production, you'd want to store in MongoDB with TTL for cleanup
      
      // Example implementation:
      // const ChatMessage = require('../models/ChatMessage');
      // await ChatMessage.create({
      //   roomId: roomId,
      //   roomType: roomType,
      //   userId: messageObj.userId,
      //   message: messageObj.message,
      //   timestamp: messageObj.timestamp,
      //   replyTo: messageObj.replyTo
      // });
      
    } catch (error) {
      console.error('Store message error:', error);
    }
  }

  generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Utility methods
  getUsersInRoom(roomKey) {
    const room = this.chatRooms.get(roomKey);
    return room ? Array.from(room.users) : [];
  }

  getTypingUsers(roomKey) {
    const room = this.chatRooms.get(roomKey);
    return room ? Array.from(room.typingUsers) : [];
  }

  getRoomMessages(roomKey, limit = 50) {
    const room = this.chatRooms.get(roomKey);
    if (!room) return [];
    
    return room.messageHistory.slice(-limit);
  }

  // Cleanup method
  cleanup() {
    this.chatRooms.clear();
    this.userSockets.clear();
  }
}

module.exports = (socket, io) => {
  if (!io.chatHandler) {
    io.chatHandler = new ChatSocketHandler(io);
  }
  
  io.chatHandler.handleConnection(socket);
};