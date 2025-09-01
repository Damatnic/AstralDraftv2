/**
 * Socket Service
 * Manages WebSocket connections for real-time features
 * Enhanced with automatic memory cleanup and leak prevention
 */

import { io, Socket } from &apos;socket.io-client&apos;;
import { authService } from &apos;./authService&apos;;
import { memoryManager } from &apos;../../utils/memoryCleanup&apos;;

class SocketService {
}
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
}
    if (this.socket?.connected || this.isConnecting) {
}
      return;
    }

    this.isConnecting = true;

    try {
}
      const wsUrl = import.meta.env.VITE_WS_URL || &apos;http://localhost:3001&apos;;
      
      this.socket = io(wsUrl, {
}
        transports: [&apos;websocket&apos;, &apos;polling&apos;],
        timeout: 10000,
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay
      });

      this.setupEventHandlers();
      
      // Wait for connection with managed timeout
      await new Promise<void>((resolve, reject) => {
}
        const timeout = memoryManager.registerTimer(() => {
}
          reject(new Error(&apos;Connection timeout&apos;));
        }, 10000);

        this.socket!.on(&apos;connect&apos;, () => {
}
          memoryManager.clearTimer(timeout);
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          console.log(&apos;✅ WebSocket connected&apos;);
          resolve();
        });

        this.socket!.on(&apos;connect_error&apos;, (error: any) => {
}
          memoryManager.clearTimer(timeout);
          this.isConnecting = false;
          console.error(&apos;❌ WebSocket connection error:&apos;, error);
          reject(error);
        });
      });

    } catch (error) {
}
      this.isConnecting = false;
      console.error(&apos;Failed to connect to WebSocket:&apos;, error);
      throw error;
    }
  }

  /**
   * Disconnect from WebSocket server with full cleanup
   */
  disconnect(): void {
}
    // Clear any pending reconnect timer
    if (this.connectionTimer) {
}
      memoryManager.clearTimer(this.connectionTimer);
      this.connectionTimer = null;
    }

    // Remove all event listeners
    this.eventListeners.forEach((listeners, event) => {
}
      listeners.forEach((listener: any) => {
}
        this.socket?.off(event, listener);
      });
    });
    this.eventListeners.clear();

    // Execute all cleanup functions
    this.cleanupFunctions.forEach((cleanup: any) => {
}
      try {
}
        cleanup();
      } catch (error) {
}
        console.error(&apos;Cleanup error:&apos;, error);
      }
    });
    this.cleanupFunctions.clear();

    // Disconnect socket
    if (this.socket) {
}
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    console.log(&apos;🔌 WebSocket disconnected with full cleanup&apos;);
  }

  /**
   * Setup event handlers for connection management
   */
  private setupEventHandlers(): void {
}
    if (!this.socket) return;

    this.socket.on(&apos;connect&apos;, () => {
}
      console.log(&apos;🔗 WebSocket connected&apos;);
      this.reconnectAttempts = 0;
      
      // Auto-authenticate if user is logged in
      const token = authService.getToken();
      if (token) {
}
        this.authenticate(token);
      }
    });

    this.socket.on(&apos;disconnect&apos;, (reason: any) => {
}
      console.log(&apos;🔌 WebSocket disconnected:&apos;, reason);
      
      // Attempt to reconnect if not intentional
      if (reason === &apos;io server disconnect&apos;) {
}
        // Server disconnected, try to reconnect
        this.attemptReconnect();
      }
    });

    this.socket.on(&apos;reconnect&apos;, (attemptNumber: any) => {
}
      console.log(`🔄 WebSocket reconnected after ${attemptNumber} attempts`);
      this.reconnectAttempts = 0;
    });

    this.socket.on(&apos;reconnect_error&apos;, (error: any) => {
}
      console.error(&apos;❌ WebSocket reconnection error:&apos;, error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
}
        console.error(&apos;❌ Max reconnection attempts reached&apos;);
        this.disconnect();
      }
    });

    this.socket.on(&apos;error&apos;, (error: any) => {
}
      console.error(&apos;❌ WebSocket error:&apos;, error);
    });

    // Re-register all event listeners
    this.eventListeners.forEach((listeners, event) => {
}
      listeners.forEach((listener: any) => {
}
        this.socket!.on(event, listener);
      });
    });
  }

  /**
   * Attempt to reconnect
   */
  private attemptReconnect(): void {
}
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
}
      console.error(&apos;❌ Max reconnection attempts reached&apos;);
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`🔄 Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    this.connectionTimer = memoryManager.registerTimer(() => {
}
      this.connectionTimer = null;
      this.connect().catch(error => {
}
        console.error(&apos;Reconnection failed:&apos;, error);
      });
    }, delay);
  }

  /**
   * Authenticate with the server
   */
  authenticate(token: string): void {
}
    if (this.socket?.connected) {
}
      this.socket.emit(&apos;authenticate&apos;, token);
    }
  }

  /**
   * Emit an event to the server
   */
  emit(event: string, data?: any): void {
}
    if (this.socket?.connected) {
}
      this.socket.emit(event, data);
    } else {
}
      console.warn(&apos;⚠️ Cannot emit event - WebSocket not connected:&apos;, event);
    }
  }

  /**
   * Listen for an event from the server
   */
  on(event: string, callback: Function): void {
}
    // Store the listener for re-registration on reconnect
    if (!this.eventListeners.has(event)) {
}
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);

    // Register with socket if connected
    if (this.socket) {
}
      this.socket.on(event, callback);
    }
  }

  /**
   * Listen for an event once
   */
  once(event: string, callback: Function): void {
}
    if (this.socket) {
}
      this.socket.once(event, callback);
    }
  }

  /**
   * Remove event listener
   */
  off(event: string, callback?: Function): void {
}
    if (callback) {
}
      // Remove specific callback
      const listeners = this.eventListeners.get(event);
      if (listeners) {
}
        const index = listeners.indexOf(callback);
        if (index > -1) {
}
          listeners.splice(index, 1);
        }
      }
      
      if (this.socket) {
}
        this.socket.off(event, callback);
      }
    } else {
}
      // Remove all listeners for event
      this.eventListeners.delete(event);
      
      if (this.socket) {
}
        this.socket.off(event);
      }
    }
  }

  /**
   * Join a room
   */
  joinRoom(room: string): void {
}
    this.emit(&apos;join_room&apos;, { room });
  }

  /**
   * Leave a room
   */
  leaveRoom(room: string): void {
}
    this.emit(&apos;leave_room&apos;, { room });
  }

  /**
   * Subscribe to live updates for a league
   */
  subscribeToLeague(leagueId: string): void {
}
    this.emit(&apos;live:subscribe_league&apos;, { leagueId });
  }

  /**
   * Unsubscribe from league updates
   */
  unsubscribeFromLeague(leagueId: string): void {
}
    this.emit(&apos;live:unsubscribe_league&apos;, { leagueId });
  }

  /**
   * Subscribe to player updates
   */
  subscribeToPlayer(playerId: string): void {
}
    this.emit(&apos;live:subscribe_player&apos;, { playerId });
  }

  /**
   * Unsubscribe from player updates
   */
  unsubscribeFromPlayer(playerId: string): void {
}
    this.emit(&apos;live:unsubscribe_player&apos;, { playerId });
  }

  /**
   * Subscribe to general updates
   */
  subscribeToGeneral(): void {
}
    this.emit(&apos;live:subscribe_general&apos;, {});
  }

  /**
   * Join chat room
   */
  joinChatRoom(roomId: string, roomType: &apos;league&apos; | &apos;draft&apos; | &apos;direct&apos;): void {
}
    this.emit(&apos;chat:join_room&apos;, { roomId, roomType });
  }

  /**
   * Leave chat room
   */
  leaveChatRoom(roomId: string, roomType: &apos;league&apos; | &apos;draft&apos; | &apos;direct&apos;): void {
}
    this.emit(&apos;chat:leave_room&apos;, { roomId, roomType });
  }

  /**
   * Send chat message
   */
  sendChatMessage(message: string, roomId: string, roomType: &apos;league&apos; | &apos;draft&apos; | &apos;direct&apos;, replyTo?: string): void {
}
    this.emit(&apos;chat:send_message&apos;, { message, roomId, roomType, replyTo });
  }

  /**
   * Start typing indicator
   */
  startTyping(roomId: string, roomType: &apos;league&apos; | &apos;draft&apos; | &apos;direct&apos;): void {
}
    this.emit(&apos;chat:typing_start&apos;, { roomId, roomType });
  }

  /**
   * Stop typing indicator
   */
  stopTyping(roomId: string, roomType: &apos;league&apos; | &apos;draft&apos; | &apos;direct&apos;): void {
}
    this.emit(&apos;chat:typing_stop&apos;, { roomId, roomType });
  }

  /**
   * Add reaction to message
   */
  addReaction(messageId: string, emoji: string, roomId: string, roomType: &apos;league&apos; | &apos;draft&apos; | &apos;direct&apos;): void {
}
    this.emit(&apos;chat:add_reaction&apos;, { messageId, emoji, roomId, roomType });
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
}
    return this.socket?.connected || false;
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): {
}
    connected: boolean;
    reconnectAttempts: number;
    maxReconnectAttempts: number;
  } {
}
    return {
}
      connected: this.isConnected(),
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts
    };
  }

  /**
   * Set up automatic connection management with proper cleanup
   */
  setupAutoConnection(): void {
}
    // Connect when user logs in
    const authCleanup = authService.onAuthStateChange((isAuthenticated, user) => {
}
      if (isAuthenticated && user) {
}
        this.connect().catch(error => {
}
          console.error(&apos;Auto-connection failed:&apos;, error);
        });
      } else {
}
        this.disconnect();
      }
    });
    this.cleanupFunctions.add(authCleanup);

    // Handle page visibility changes with cleanup
    this.visibilityHandler = () => {
}
      if (document.visibilityState === &apos;visible&apos; && authService.isAuthenticated()) {
}
        // Page became visible and user is authenticated
        if (!this.isConnected()) {
}
          this.connect().catch(error => {
}
            console.error(&apos;Visibility reconnection failed:&apos;, error);
          });
        }
      } else if (document.visibilityState === &apos;hidden&apos;) {
}
        // Optional: disconnect when page is hidden to save resources
        // this.disconnect();
      }
    };
    
    const visibilityCleanup = memoryManager.addEventListener(
      document,
      &apos;visibilitychange&apos;,
      this.visibilityHandler
    );
    this.cleanupFunctions.add(visibilityCleanup);

    // Handle online/offline events with cleanup
    this.onlineHandler = () => {
}
      if (authService.isAuthenticated() && !this.isConnected()) {
}
        this.connect().catch(error => {
}
          console.error(&apos;Online reconnection failed:&apos;, error);
        });
      }
    };
    
    const onlineCleanup = memoryManager.addEventListener(
      window,
      &apos;online&apos;,
      this.onlineHandler
    );
    this.cleanupFunctions.add(onlineCleanup);

    this.offlineHandler = () => {
}
      console.log(&apos;🔌 Going offline, WebSocket will disconnect&apos;);
    };
    
    const offlineCleanup = memoryManager.addEventListener(
      window,
      &apos;offline&apos;,
      this.offlineHandler
    );
    this.cleanupFunctions.add(offlineCleanup);

    // Register global cleanup
    memoryManager.registerCleanup(() => {
}
      this.disconnect();
    });
  }

  /**
   * Clean up all resources
   */
  cleanup(): void {
}
    this.disconnect();
  }
}

export const socketService = new SocketService();