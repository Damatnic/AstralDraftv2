/**
 * Socket Service
 * Manages WebSocket connections for real-time features
 * Enhanced with automatic memory cleanup and leak prevention
 */

import { io, Socket } from 'socket.io-client';
import { authService } from './authService';
import { memoryManager } from '../../utils/memoryCleanup';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;
  private eventListeners: Map<string, Function[]> = new Map();
  private cleanupFunctions: Set<() => void> = new Set();
  private connectionTimer: NodeJS.Timeout | null = null;
  private visibilityHandler: (() => void) | null = null;
  private onlineHandler: (() => void) | null = null;
  private offlineHandler: (() => void) | null = null;

  /**
   * Connect to WebSocket server
   */
  async connect(): Promise<void> {
    if (this.socket?.connected || this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    try {
      const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:3001';
      
      this.socket = io(wsUrl, {
        transports: ['websocket', 'polling'],
        timeout: 10000,
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay
      });

      this.setupEventHandlers();
      
      // Wait for connection with managed timeout
      await new Promise<void>((resolve, reject) => {
        const timeout = memoryManager.registerTimer(() => {
          reject(new Error('Connection timeout'));
        }, 10000);

        this.socket!.on('connect', () => {
          memoryManager.clearTimer(timeout);
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          console.log('✅ WebSocket connected');
          resolve();
        });

        this.socket!.on('connect_error', (error: any) => {
          memoryManager.clearTimer(timeout);
          this.isConnecting = false;
          console.error('❌ WebSocket connection error:', error);
          reject(error);
        });
      });

    } catch (error) {
      this.isConnecting = false;
      console.error('Failed to connect to WebSocket:', error);
      throw error;
    }
  }

  /**
   * Disconnect from WebSocket server with full cleanup
   */
  disconnect(): void {
    // Clear any pending reconnect timer
    if (this.connectionTimer) {
      memoryManager.clearTimer(this.connectionTimer);
      this.connectionTimer = null;
    }

    // Remove all event listeners
    this.eventListeners.forEach((listeners, event) => {
      listeners.forEach(listener => {
        this.socket?.off(event, listener);
      });
    });
    this.eventListeners.clear();

    // Execute all cleanup functions
    this.cleanupFunctions.forEach(cleanup => {
      try {
        cleanup();
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    });
    this.cleanupFunctions.clear();

    // Disconnect socket
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    console.log('🔌 WebSocket disconnected with full cleanup');
  }

  /**
   * Setup event handlers for connection management
   */
  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('🔗 WebSocket connected');
      this.reconnectAttempts = 0;
      
      // Auto-authenticate if user is logged in
      const token = authService.getToken();
      if (token) {
        this.authenticate(token);
      }
    });

    this.socket.on('disconnect', (reason: any) => {
      console.log('🔌 WebSocket disconnected:', reason);
      
      // Attempt to reconnect if not intentional
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        this.attemptReconnect();
      }
    });

    this.socket.on('reconnect', (attemptNumber: any) => {
      console.log(`🔄 WebSocket reconnected after ${attemptNumber} attempts`);
      this.reconnectAttempts = 0;
    });

    this.socket.on('reconnect_error', (error: any) => {
      console.error('❌ WebSocket reconnection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('❌ Max reconnection attempts reached');
        this.disconnect();
      }
    });

    this.socket.on('error', (error: any) => {
      console.error('❌ WebSocket error:', error);
    });

    // Re-register all event listeners
    this.eventListeners.forEach((listeners, event) => {
      listeners.forEach((listener: any) => {
        this.socket!.on(event, listener);
      });
    });
  }

  /**
   * Attempt to reconnect
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`🔄 Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    this.connectionTimer = memoryManager.registerTimer(() => {
      this.connectionTimer = null;
      this.connect().catch(error => {
        console.error('Reconnection failed:', error);
      });
    }, delay);
  }

  /**
   * Authenticate with the server
   */
  authenticate(token: string): void {
    if (this.socket?.connected) {
      this.socket.emit('authenticate', token);
    }
  }

  /**
   * Emit an event to the server
   */
  emit(event: string, data?: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('⚠️ Cannot emit event - WebSocket not connected:', event);
    }
  }

  /**
   * Listen for an event from the server
   */
  on(event: string, callback: Function): void {
    // Store the listener for re-registration on reconnect
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);

    // Register with socket if connected
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  /**
   * Listen for an event once
   */
  once(event: string, callback: Function): void {
    if (this.socket) {
      this.socket.once(event, callback);
    }
  }

  /**
   * Remove event listener
   */
  off(event: string, callback?: Function): void {
    if (callback) {
      // Remove specific callback
      const listeners = this.eventListeners.get(event);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
      
      if (this.socket) {
        this.socket.off(event, callback);
      }
    } else {
      // Remove all listeners for event
      this.eventListeners.delete(event);
      
      if (this.socket) {
        this.socket.off(event);
      }
    }
  }

  /**
   * Join a room
   */
  joinRoom(room: string): void {
    this.emit('join_room', { room });
  }

  /**
   * Leave a room
   */
  leaveRoom(room: string): void {
    this.emit('leave_room', { room });
  }

  /**
   * Subscribe to live updates for a league
   */
  subscribeToLeague(leagueId: string): void {
    this.emit('live:subscribe_league', { leagueId });
  }

  /**
   * Unsubscribe from league updates
   */
  unsubscribeFromLeague(leagueId: string): void {
    this.emit('live:unsubscribe_league', { leagueId });
  }

  /**
   * Subscribe to player updates
   */
  subscribeToPlayer(playerId: string): void {
    this.emit('live:subscribe_player', { playerId });
  }

  /**
   * Unsubscribe from player updates
   */
  unsubscribeFromPlayer(playerId: string): void {
    this.emit('live:unsubscribe_player', { playerId });
  }

  /**
   * Subscribe to general updates
   */
  subscribeToGeneral(): void {
    this.emit('live:subscribe_general', {});
  }

  /**
   * Join chat room
   */
  joinChatRoom(roomId: string, roomType: 'league' | 'draft' | 'direct'): void {
    this.emit('chat:join_room', { roomId, roomType });
  }

  /**
   * Leave chat room
   */
  leaveChatRoom(roomId: string, roomType: 'league' | 'draft' | 'direct'): void {
    this.emit('chat:leave_room', { roomId, roomType });
  }

  /**
   * Send chat message
   */
  sendChatMessage(message: string, roomId: string, roomType: 'league' | 'draft' | 'direct', replyTo?: string): void {
    this.emit('chat:send_message', { message, roomId, roomType, replyTo });
  }

  /**
   * Start typing indicator
   */
  startTyping(roomId: string, roomType: 'league' | 'draft' | 'direct'): void {
    this.emit('chat:typing_start', { roomId, roomType });
  }

  /**
   * Stop typing indicator
   */
  stopTyping(roomId: string, roomType: 'league' | 'draft' | 'direct'): void {
    this.emit('chat:typing_stop', { roomId, roomType });
  }

  /**
   * Add reaction to message
   */
  addReaction(messageId: string, emoji: string, roomId: string, roomType: 'league' | 'draft' | 'direct'): void {
    this.emit('chat:add_reaction', { messageId, emoji, roomId, roomType });
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): {
    connected: boolean;
    reconnectAttempts: number;
    maxReconnectAttempts: number;
  } {
    return {
      connected: this.isConnected(),
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts
    };
  }

  /**
   * Set up automatic connection management with proper cleanup
   */
  setupAutoConnection(): void {
    // Connect when user logs in
    const authCleanup = authService.onAuthStateChange((isAuthenticated, user) => {
      if (isAuthenticated && user) {
        this.connect().catch(error => {
          console.error('Auto-connection failed:', error);
        });
      } else {
        this.disconnect();
      }
    });
    this.cleanupFunctions.add(authCleanup);

    // Handle page visibility changes with cleanup
    this.visibilityHandler = () => {
      if (document.visibilityState === 'visible' && authService.isAuthenticated()) {
        // Page became visible and user is authenticated
        if (!this.isConnected()) {
          this.connect().catch(error => {
            console.error('Visibility reconnection failed:', error);
          });
        }
      } else if (document.visibilityState === 'hidden') {
        // Optional: disconnect when page is hidden to save resources
        // this.disconnect();
      }
    };
    
    const visibilityCleanup = memoryManager.addEventListener(
      document,
      'visibilitychange',
      this.visibilityHandler
    );
    this.cleanupFunctions.add(visibilityCleanup);

    // Handle online/offline events with cleanup
    this.onlineHandler = () => {
      if (authService.isAuthenticated() && !this.isConnected()) {
        this.connect().catch(error => {
          console.error('Online reconnection failed:', error);
        });
      }
    };
    
    const onlineCleanup = memoryManager.addEventListener(
      window,
      'online',
      this.onlineHandler
    );
    this.cleanupFunctions.add(onlineCleanup);

    this.offlineHandler = () => {
      console.log('🔌 Going offline, WebSocket will disconnect');
    };
    
    const offlineCleanup = memoryManager.addEventListener(
      window,
      'offline',
      this.offlineHandler
    );
    this.cleanupFunctions.add(offlineCleanup);

    // Register global cleanup
    memoryManager.registerCleanup(() => {
      this.disconnect();
    });
  }

  /**
   * Clean up all resources
   */
  cleanup(): void {
    this.disconnect();
  }
}

export const socketService = new SocketService();