/**
 * Enhanced WebSocket Service
 * Comprehensive real-time communication infrastructure for fantasy football platform
 * Supports draft rooms, live scoring, notifications, chat, and data synchronization
 */

import { io, Socket } from &apos;socket.io-client&apos;;
import { EventEmitter } from &apos;events&apos;;

// Types and Interfaces
export interface WebSocketConfig {
}
  url: string;
  autoConnect: boolean;
  reconnection: boolean;
  reconnectionAttempts: number;
  reconnectionDelay: number;
  reconnectionDelayMax: number;
  timeout: number;
  transports: string[];
  secure: boolean;
}

export interface ConnectionState {
}
  status: &apos;connecting&apos; | &apos;connected&apos; | &apos;disconnected&apos; | &apos;reconnecting&apos; | &apos;error&apos;;
  attempts: number;
  lastError?: string;
  latency: number;
  quality: &apos;excellent&apos; | &apos;good&apos; | &apos;fair&apos; | &apos;poor&apos;;
}

export interface DraftUpdate {
}
  type: &apos;pick&apos; | &apos;trade&apos; | &apos;timer&apos; | &apos;turn&apos; | &apos;complete&apos;;
  draftId: string;
  data: any;
  timestamp: number;
}

export interface LiveScoreUpdate {
}
  gameId: string;
  playerId?: string;
  type: &apos;score&apos; | &apos;stat&apos; | &apos;injury&apos; | &apos;gameStatus&apos;;
  points?: number;
  delta?: number;
  data: any;
  timestamp: number;
}

export interface NotificationPayload {
}
  id: string;
  type: &apos;trade&apos; | &apos;waiver&apos; | &apos;injury&apos; | &apos;news&apos; | &apos;league&apos; | &apos;system&apos;;
  priority: &apos;high&apos; | &apos;medium&apos; | &apos;low&apos;;
  title: string;
  message: string;
  data?: any;
  actions?: Array<{
}
    label: string;
    action: string;
  }>;
  timestamp: number;
}

export interface ChatMessage {
}
  id: string;
  roomId: string;
  roomType: &apos;league&apos; | &apos;draft&apos; | &apos;trade&apos; | &apos;direct&apos;;
  userId: string;
  userName: string;
  avatar?: string;
  message: string;
  attachments?: Array<{
}
    type: &apos;image&apos; | &apos;player&apos; | &apos;trade&apos; | &apos;link&apos;;
    data: any;
  }>;
  reactions?: Map<string, string[]>;
  replyTo?: string;
  edited?: boolean;
  timestamp: number;
}

export interface PresenceUpdate {
}
  userId: string;
  status: &apos;online&apos; | &apos;away&apos; | &apos;busy&apos; | &apos;offline&apos;;
  lastSeen?: number;
  currentView?: string;
  typing?: {
}
    roomId: string;
    roomType: string;
  };
}

export interface DataSyncEvent {
}
  type: &apos;roster&apos; | &apos;standings&apos; | &apos;transactions&apos; | &apos;settings&apos;;
  operation: &apos;create&apos; | &apos;update&apos; | &apos;delete&apos;;
  entityId: string;
  data: any;
  version: number;
  timestamp: number;
}

// Message Queue for offline/reconnection handling
class MessageQueue {
}
  private queue: Array<{ event: string; data: any; timestamp: number }> = [];
  private maxSize = 1000;
  private processing = false;

  add(event: string, data: any): void {
}
    if (this.queue.length >= this.maxSize) {
}
      this.queue.shift(); // Remove oldest message
    }
    this.queue.push({
}
      event,
      data,
      timestamp: Date.now()
    });
  }

  async process(socket: Socket): Promise<void> {
}
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
}
      const message = this.queue.shift();
      if (message) {
}
        socket.emit(message.event, {
}
          ...message.data,
          _queued: true,
          _timestamp: message.timestamp
        });
        await this.delay(50); // Throttle to prevent overwhelming server
      }
    }
    
    this.processing = false;
  }

  clear(): void {
}
    this.queue = [];
  }

  private delay(ms: number): Promise<void> {
}
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Connection Pool Manager
class ConnectionPool {
}
  private connections: Map<string, Socket> = new Map();
  private maxConnections = 5;

  get(namespace: string, config: Partial<WebSocketConfig>): Socket {
}
    const key = `${config.url}/${namespace}`;
    
    if (!this.connections.has(key)) {
}
      if (this.connections.size >= this.maxConnections) {
}
        // Close least recently used connection
        const lru = this.connections.keys().next().value;
        this.close(lru);
      }
      
      const socket = io(`${config.url}/${namespace}`, {
}
        ...config,
        multiplex: false
      });
      
      this.connections.set(key, socket);
    }
    
    return this.connections.get(key)!;
  }

  close(key: string): void {
}
    const socket = this.connections.get(key);
    if (socket) {
}
      socket.disconnect();
      this.connections.delete(key);
    }
  }

  closeAll(): void {
}
    this.connections.forEach((socket: any) => socket.disconnect());
    this.connections.clear();
  }
}

// Main Enhanced WebSocket Service
export class EnhancedWebSocketService extends EventEmitter {
}
  private socket: Socket | null = null;
  private config: WebSocketConfig;
  private connectionState: ConnectionState;
  private messageQueue: MessageQueue;
  private connectionPool: ConnectionPool;
  private heartbeatInterval?: NodeJS.Timeout;
  private metricsInterval?: NodeJS.Timeout;
  private subscriptions: Set<string> = new Set();
  private messageHandlers: Map<string, Set<Function>> = new Map();
  private userId?: string;
  private authToken?: string;
  private reconnectTimer?: NodeJS.Timeout;

  constructor() {
}
    super();
    
    this.config = {
}
      url: import.meta.env.VITE_WS_URL || &apos;http://localhost:3001&apos;,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 30000,
      timeout: 20000,
      transports: [&apos;websocket&apos;, &apos;polling&apos;],
      secure: import.meta.env.PROD
    };

    this.connectionState = {
}
      status: &apos;disconnected&apos;,
      attempts: 0,
      latency: 0,
      quality: &apos;excellent&apos;
    };

    this.messageQueue = new MessageQueue();
    this.connectionPool = new ConnectionPool();
    
    this.setupAutoReconnection();
    this.setupNetworkHandlers();
  }

  // Connection Management
  async connect(authToken?: string, userId?: string): Promise<void> {
}
    if (this.socket?.connected) {
}
      console.log(&apos;✅ WebSocket already connected&apos;);
      return;
    }

    this.authToken = authToken;
    this.userId = userId;
    
    this.updateConnectionState(&apos;connecting&apos;);

    return new Promise((resolve, reject) => {
}
      let isResolved = false;
      let timeoutId: NodeJS.Timeout | null = null;
      
      const cleanup = () => {
}
        if (timeoutId) {
}
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        
        // Remove temporary event listeners to prevent memory leaks
        if (this.socket && !isResolved) {
}
          this.socket.off(&apos;connect&apos;);
          this.socket.off(&apos;connect_error&apos;);
        }
      };

      const resolveOnce = () => {
}
        if (!isResolved) {
}
          isResolved = true;
          cleanup();
          this.onConnect();
          resolve();
        }
      };

      const rejectOnce = (error: Error) => {
}
        if (!isResolved) {
}
          isResolved = true;
          cleanup();
          
          // Enhanced error suppression for WebSocket connection failures
          const errorMessage = error.message?.toLowerCase() || &apos;&apos;;
          const isWebSocketConnectionError = errorMessage.includes(&apos;websocket&apos;) ||
                                            errorMessage.includes(&apos;connection&apos;) ||
                                            errorMessage.includes(&apos;network&apos;) ||
                                            errorMessage.includes(&apos;timeout&apos;) ||
                                            errorMessage.includes(&apos;refused&apos;) ||
                                            errorMessage.includes(&apos;unavailable&apos;);
          
          // Cleanup socket on error
          if (this.socket) {
}
            this.socket.disconnect();
            this.socket = null;
          }
          
          if (isWebSocketConnectionError) {
}
            this.updateConnectionState(&apos;disconnected&apos;, &apos;WebSocket unavailable&apos;);
            // Create a suppressed error that won&apos;t show in console
            const suppressedError = new Error(&apos;WebSocket service unavailable - graceful degradation active&apos;);
            suppressedError.name = &apos;WebSocketUnavailable&apos;;
            reject(suppressedError);
          } else {
}
            this.updateConnectionState(&apos;error&apos;, error.message);
            reject(error);
          }
        }
      };

      // Set timeout with proper cleanup
      timeoutId = setTimeout(() => {
}
        const timeoutError = new Error(&apos;WebSocket connection timeout&apos;);
        rejectOnce(timeoutError);
      }, this.config.timeout);

      try {
}
        this.socket = io(this.config.url, {
}
          ...this.config,
          auth: authToken ? { token: authToken } : undefined,
          query: userId ? { userId } : undefined,
          forceNew: true // Ensure fresh connection
        });

        this.socket.once(&apos;connect&apos;, resolveOnce);
        this.socket.once(&apos;connect_error&apos;, (error: any) => {
}
          const connectionError = new Error(`WebSocket connection failed: ${error.message || error}`);
          rejectOnce(connectionError);
        });

        this.setupEventHandlers();
        
      } catch (socketCreationError) {
}
        const creationError = new Error(`Failed to create WebSocket: ${socketCreationError}`);
        rejectOnce(creationError);
      }
    });
  }

  disconnect(): void {
}
    if (this.heartbeatInterval) {
}
      clearInterval(this.heartbeatInterval);
    }
    if (this.metricsInterval) {
}
      clearInterval(this.metricsInterval);
    }
    if (this.reconnectTimer) {
}
      clearTimeout(this.reconnectTimer);
    }

    this.connectionPool.closeAll();
    
    if (this.socket) {
}
      this.socket.disconnect();
      this.socket = null;
    }

    this.updateConnectionState(&apos;disconnected&apos;);
    this.subscriptions.clear();
    this.messageQueue.clear();
  }

  private onConnect(): void {
}
    console.log(&apos;🚀 WebSocket connected successfully&apos;);
    
    this.updateConnectionState(&apos;connected&apos;);
    this.connectionState.attempts = 0;

    // Authenticate if token available
    if (this.authToken) {
}
      this.authenticate(this.authToken);
    }

    // Process queued messages
    this.messageQueue.process(this.socket!);

    // Resubscribe to channels
    this.resubscribe();

    // Start heartbeat
    this.startHeartbeat();

    // Start metrics collection
    this.startMetricsCollection();

    this.emit(&apos;connected&apos;);
  }

  private authenticate(token: string): void {
}
    this.emit(&apos;auth:request&apos;, { token });
    
    this.socket?.emit(&apos;authenticate&apos;, { token }, (response: any) => {
}
      if (response.success) {
}
        console.log(&apos;✅ WebSocket authenticated&apos;);
        this.emit(&apos;auth:success&apos;, response.user);
      } else {
}
        console.error(&apos;❌ WebSocket authentication failed:&apos;, response.error);
        this.emit(&apos;auth:error&apos;, response.error);
      }
    });
  }

  // Draft Room Features
  joinDraftRoom(draftId: string): void {
}
    const room = `draft:${draftId}`;
    this.subscribe(room);
    
    this.emit(&apos;draft:join&apos;, { draftId });
    
    // Set up draft-specific handlers
    this.on(`${room}:pick`, (data: any) => this.handleDraftPick(data));
    this.on(`${room}:timer`, (data: any) => this.handleDraftTimer(data));
    this.on(`${room}:turn`, (data: any) => this.handleDraftTurn(data));
    this.on(`${room}:chat`, (data: any) => this.handleDraftChat(data));
  }

  leaveDraftRoom(draftId: string): void {
}
    const room = `draft:${draftId}`;
    this.unsubscribe(room);
    this.emit(&apos;draft:leave&apos;, { draftId });
  }

  makeDraftPick(draftId: string, playerId: string): void {
}
    this.emitWithAck(&apos;draft:pick&apos;, {
}
      draftId,
      playerId,
      timestamp: Date.now()
    });
  }

  // Live Scoring System
  subscribeToLiveScoring(leagueId: string, weekNumber: number): void {
}
    const channel = `scoring:${leagueId}:week${weekNumber}`;
    this.subscribe(channel);
    
    this.on(`${channel}:update`, (update: LiveScoreUpdate) => {
}
      this.emit(&apos;scoring:update&apos;, update);
      this.updateLocalScoreCache(update);
    });

    this.on(`${channel}:final`, (data: any) => {
}
      this.emit(&apos;scoring:final&apos;, data);
    });
  }

  subscribeToPlayer(playerId: string): void {
}
    const channel = `player:${playerId}`;
    this.subscribe(channel);
    
    this.on(`${channel}:stats`, (data: any) => this.emit(&apos;player:stats&apos;, data));
    this.on(`${channel}:injury`, (data: any) => this.emit(&apos;player:injury&apos;, data));
    this.on(`${channel}:news`, (data: any) => this.emit(&apos;player:news&apos;, data));
  }

  // Real-Time Notifications
  enableNotifications(preferences?: any): void {
}
    this.emit(&apos;notifications:subscribe&apos;, preferences);
    
    this.on(&apos;notification&apos;, (notification: NotificationPayload) => {
}
      this.handleNotification(notification);
    });
  }

  private handleNotification(notification: NotificationPayload): void {
}
    // Store notification
    this.storeNotification(notification);
    
    // Emit typed events
    this.emit(`notification:${notification.type}`, notification);
    
    // Handle high priority notifications
    if (notification.priority === &apos;high&apos;) {
}
      this.showPushNotification(notification);
    }
    
    // Update UI badge
    this.emit(&apos;notification:badge:update&apos;);
  }

  // Chat & Communication
  sendMessage(roomId: string, roomType: string, message: string, attachments?: any[]): void {
}
    const chatMessage: Partial<ChatMessage> = {
}
      roomId,
      roomType: roomType as any,
      userId: this.userId,
      message,
      attachments,
      timestamp: Date.now()
    };

    this.emitWithAck(&apos;chat:message&apos;, chatMessage);
  }

  startTyping(roomId: string): void {
}
    this.emit(&apos;chat:typing:start&apos;, { roomId, userId: this.userId });
  }

  stopTyping(roomId: string): void {
}
    this.emit(&apos;chat:typing:stop&apos;, { roomId, userId: this.userId });
  }

  addReaction(messageId: string, emoji: string): void {
}
    this.emit(&apos;chat:reaction&apos;, { messageId, emoji, userId: this.userId });
  }

  // Trade Negotiation
  joinTradeNegotiation(tradeId: string): void {
}
    const room = `trade:${tradeId}`;
    this.subscribe(room);
    
    this.on(`${room}:update`, (data: any) => this.emit(&apos;trade:update&apos;, data));
    this.on(`${room}:message`, (data: any) => this.emit(&apos;trade:message&apos;, data));
    this.on(`${room}:counter`, (data: any) => this.emit(&apos;trade:counter&apos;, data));
  }

  sendTradeOffer(tradeData: any): void {
}
    this.emitWithAck(&apos;trade:propose&apos;, tradeData);
  }

  // Data Synchronization
  subscribeToDataSync(entities: string[]): void {
}
    entities.forEach((entity: any) => {
}
      const channel = `sync:${entity}`;
      this.subscribe(channel);
      
      this.on(`${channel}:update`, (event: DataSyncEvent) => {
}
        this.handleDataSync(event);
      });
    });
  }

  private handleDataSync(event: DataSyncEvent): void {
}
    // Check version for conflict resolution
    if (this.shouldApplySync(event)) {
}
      this.emit(`sync:${event.type}`, event);
      this.updateLocalCache(event);
    } else {
}
      this.resolveConflict(event);
    }
  }

  // Presence & User Status
  updatePresence(status: PresenceUpdate[&apos;status&apos;], currentView?: string): void {
}
    const presence: Partial<PresenceUpdate> = {
}
      userId: this.userId,
      status,
      currentView,
      lastSeen: Date.now()
    };

    this.emit(&apos;presence:update&apos;, presence);
  }

  subscribeToPresence(userIds: string[]): void {
}
    userIds.forEach((userId: any) => {
}
      this.subscribe(`presence:${userId}`);
    });
    
    this.on(&apos;presence:change&apos;, (update: PresenceUpdate) => {
}
      this.emit(&apos;user:presence&apos;, update);
    });
  }

  // Performance & Optimization
  private startHeartbeat(): void {
}
    this.heartbeatInterval = setInterval(() => {
}
      const start = Date.now();
      
      this.socket?.emit(&apos;ping&apos;, {}, () => {
}
        const latency = Date.now() - start;
        this.connectionState.latency = latency;
        this.updateConnectionQuality(latency);
      });
    }, 30000); // Every 30 seconds
  }

  private updateConnectionQuality(latency: number): void {
}
    if (latency < 50) {
}
      this.connectionState.quality = &apos;excellent&apos;;
    } else if (latency < 150) {
}
      this.connectionState.quality = &apos;good&apos;;
    } else if (latency < 300) {
}
      this.connectionState.quality = &apos;fair&apos;;
    } else {
}
      this.connectionState.quality = &apos;poor&apos;;
    }
    
    this.emit(&apos;connection:quality&apos;, this.connectionState.quality);
  }

  private startMetricsCollection(): void {
}
    this.metricsInterval = setInterval(() => {
}
      const metrics = {
}
        messagesSent: 0,
        messagesReceived: 0,
        subscriptions: this.subscriptions.size,
        latency: this.connectionState.latency,
        quality: this.connectionState.quality,
        uptime: Date.now()
      };
      
      this.emit(&apos;metrics&apos;, metrics);
    }, 60000); // Every minute
  }

  // Reconnection & Recovery
  private setupAutoReconnection(): void {
}
    this.on(&apos;disconnect&apos;, (reason: any) => {
}
      console.log(`📡 Disconnected: ${reason}`);
      
      if (reason === &apos;io server disconnect&apos;) {
}
        // Server initiated disconnect, attempt reconnection
        this.attemptReconnection();
      }
    });
  }

  private attemptReconnection(): void {
}
    if (this.connectionState.attempts >= this.config.reconnectionAttempts) {
}
      this.updateConnectionState(&apos;error&apos;, &apos;Max reconnection attempts reached&apos;);
      this.emit(&apos;connection:failed&apos;);
      return;
    }

    this.connectionState.attempts++;
    this.updateConnectionState(&apos;reconnecting&apos;);

    const delay = Math.min(
      this.config.reconnectionDelay * Math.pow(2, this.connectionState.attempts - 1),
      this.config.reconnectionDelayMax
    );

    console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.connectionState.attempts})`);

    this.reconnectTimer = setTimeout(() => {
}
      this.connect(this.authToken, this.userId).catch(error => {
}
        console.error(&apos;Reconnection failed:&apos;, error);
        this.attemptReconnection();
      });
    }, delay);
  }

  private resubscribe(): void {
}
    this.subscriptions.forEach((channel: any) => {
}
      this.socket?.emit(&apos;subscribe&apos;, { channel });
    });
  }

  // Network State Handlers
  private setupNetworkHandlers(): void {
}
    window.addEventListener(&apos;online&apos;, () => {
}
      console.log(&apos;🌐 Network online&apos;);
      if (!this.socket?.connected) {
}
        this.connect(this.authToken, this.userId);
      }
    });

    window.addEventListener(&apos;offline&apos;, () => {
}
      console.log(&apos;📵 Network offline&apos;);
      this.updateConnectionState(&apos;disconnected&apos;, &apos;Network offline&apos;);
    });

    document.addEventListener(&apos;visibilitychange&apos;, () => {
}
      if (document.visibilityState === &apos;visible&apos; && !this.socket?.connected) {
}
        this.connect(this.authToken, this.userId);
      }
    });
  }

  // Helper Methods
  private emit(event: string, data?: any): void {
}
    if (this.socket?.connected) {
}
      this.socket.emit(event, data);
    } else {
}
      this.messageQueue.add(event, data);
    }
  }

  private emitWithAck(event: string, data: any): Promise<any> {
}
    return new Promise((resolve, reject) => {
}
      if (this.socket?.connected) {
}
        this.socket.emit(event, data, (response: any) => {
}
          if (response.error) {
}
            reject(response.error);
          } else {
}
            resolve(response);
          }
        });
      } else {
}
        this.messageQueue.add(event, data);
        resolve({ queued: true });
      }
    });
  }

  private subscribe(channel: string): void {
}
    this.subscriptions.add(channel);
    if (this.socket?.connected) {
}
      this.socket.emit(&apos;subscribe&apos;, { channel });
    }
  }

  private unsubscribe(channel: string): void {
}
    this.subscriptions.delete(channel);
    if (this.socket?.connected) {
}
      this.socket.emit(&apos;unsubscribe&apos;, { channel });
    }
  }

  private on(event: string, handler: Function): void {
}
    if (!this.messageHandlers.has(event)) {
}
      this.messageHandlers.set(event, new Set());
    }
    this.messageHandlers.get(event)!.add(handler);
    
    this.socket?.on(event, handler as any);
  }

  private off(event: string, handler?: Function): void {
}
    if (handler) {
}
      this.messageHandlers.get(event)?.delete(handler);
      this.socket?.off(event, handler as any);
    } else {
}
      this.messageHandlers.delete(event);
      this.socket?.off(event);
    }
  }

  private setupEventHandlers(): void {
}
    if (!this.socket) return;

    // Re-register all stored handlers
    this.messageHandlers.forEach((handlers, event) => {
}
      handlers.forEach((handler: any) => {
}
        this.socket!.on(event, handler as any);
      });
    });

    // Core event handlers
    this.socket.on(&apos;disconnect&apos;, (reason: any) => {
}
      this.updateConnectionState(&apos;disconnected&apos;, reason);
      this.emit(&apos;disconnected&apos;, reason);
    });

    this.socket.on(&apos;error&apos;, (error: any) => {
}
      console.error(&apos;❌ WebSocket error:&apos;, error);
      this.emit(&apos;error&apos;, error);
    });
  }

  private updateConnectionState(status: ConnectionState[&apos;status&apos;], error?: string): void {
}
    this.connectionState.status = status;
    if (error) {
}
      this.connectionState.lastError = error;
    }
    this.emit(&apos;connection:state&apos;, this.connectionState);
  }

  private handleDraftPick(data: any): void {
}
    this.emit(&apos;draft:pick:made&apos;, data);
  }

  private handleDraftTimer(data: any): void {
}
    this.emit(&apos;draft:timer:update&apos;, data);
  }

  private handleDraftTurn(data: any): void {
}
    this.emit(&apos;draft:turn:change&apos;, data);
  }

  private handleDraftChat(data: any): void {
}
    this.emit(&apos;draft:chat:message&apos;, data);
  }

  private updateLocalScoreCache(update: LiveScoreUpdate): void {
}
    // Implementation for local score caching
  }

  private storeNotification(notification: NotificationPayload): void {
}
    // Store in local storage or IndexedDB
    const notifications = JSON.parse(localStorage.getItem(&apos;notifications&apos;) || &apos;[]&apos;);
    notifications.unshift(notification);
    if (notifications.length > 100) {
}
      notifications.pop();
    }
    localStorage.setItem(&apos;notifications&apos;, JSON.stringify(notifications));
  }

  private async showPushNotification(notification: NotificationPayload): Promise<void> {
}
    if (&apos;Notification&apos; in window && Notification.permission === &apos;granted&apos;) {
}
      new Notification(notification.title, {
}
        body: notification.message,
        icon: &apos;/icon-192x192.png&apos;,
        badge: &apos;/badge-72x72.png&apos;,
        tag: notification.id,
        requireInteraction: notification.priority === &apos;high&apos;
      });
    }
  }

  private shouldApplySync(event: DataSyncEvent): boolean {
}
    // Version conflict resolution logic
    return true; // Simplified for now
  }

  private resolveConflict(event: DataSyncEvent): void {
}
    // Conflict resolution strategy
    this.emit(&apos;sync:conflict&apos;, event);
  }

  private updateLocalCache(event: DataSyncEvent): void {
}
    // Update local cache implementation
  }

  // Public API
  getConnectionState(): ConnectionState {
}
    return { ...this.connectionState };
  }

  isConnected(): boolean {
}
    return this.socket?.connected || false;
  }

  getSocket(): Socket | null {
}
    return this.socket;
  }

  getSubscriptions(): string[] {
}
    return Array.from(this.subscriptions);
  }
}

// Singleton instance
export const enhancedWebSocketService = new EnhancedWebSocketService();
export default enhancedWebSocketService;