/**
 * Enhanced WebSocket Service
 * Comprehensive real-time communication infrastructure for fantasy football platform
 * Supports draft rooms, live scoring, notifications, chat, and data synchronization
 */

import { io, Socket } from 'socket.io-client';
import { EventEmitter } from 'events';

// Types and Interfaces
export interface WebSocketConfig {
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
  status: 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error';
  attempts: number;
  lastError?: string;
  latency: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface DraftUpdate {
  type: 'pick' | 'trade' | 'timer' | 'turn' | 'complete';
  draftId: string;
  data: any;
  timestamp: number;
}

export interface LiveScoreUpdate {
  gameId: string;
  playerId?: string;
  type: 'score' | 'stat' | 'injury' | 'gameStatus';
  points?: number;
  delta?: number;
  data: any;
  timestamp: number;
}

export interface NotificationPayload {
  id: string;
  type: 'trade' | 'waiver' | 'injury' | 'news' | 'league' | 'system';
  priority: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  data?: any;
  actions?: Array<{
    label: string;
    action: string;
  }>;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  roomType: 'league' | 'draft' | 'trade' | 'direct';
  userId: string;
  userName: string;
  avatar?: string;
  message: string;
  attachments?: Array<{
    type: 'image' | 'player' | 'trade' | 'link';
    data: any;
  }>;
  reactions?: Map<string, string[]>;
  replyTo?: string;
  edited?: boolean;
  timestamp: number;
}

export interface PresenceUpdate {
  userId: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen?: number;
  currentView?: string;
  typing?: {
    roomId: string;
    roomType: string;
  };
}

export interface DataSyncEvent {
  type: 'roster' | 'standings' | 'transactions' | 'settings';
  operation: 'create' | 'update' | 'delete';
  entityId: string;
  data: any;
  version: number;
  timestamp: number;
}

// Message Queue for offline/reconnection handling
class MessageQueue {
  private queue: Array<{ event: string; data: any; timestamp: number }> = [];
  private maxSize = 1000;
  private processing = false;

  add(event: string, data: any): void {
    if (this.queue.length >= this.maxSize) {
      this.queue.shift(); // Remove oldest message
    }
    this.queue.push({
      event,
      data,
      timestamp: Date.now()
    });
  }

  async process(socket: Socket): Promise<void> {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const message = this.queue.shift();
      if (message) {
        socket.emit(message.event, {
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
    this.queue = [];
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Connection Pool Manager
class ConnectionPool {
  private connections: Map<string, Socket> = new Map();
  private maxConnections = 5;

  get(namespace: string, config: Partial<WebSocketConfig>): Socket {
    const key = `${config.url}/${namespace}`;
    
    if (!this.connections.has(key)) {
      if (this.connections.size >= this.maxConnections) {
        // Close least recently used connection
        const lru = this.connections.keys().next().value;
        this.close(lru);
      }
      
      const socket = io(`${config.url}/${namespace}`, {
        ...config,
        multiplex: false
      });
      
      this.connections.set(key, socket);
    }
    
    return this.connections.get(key)!;
  }

  close(key: string): void {
    const socket = this.connections.get(key);
    if (socket) {
      socket.disconnect();
      this.connections.delete(key);
    }
  }

  closeAll(): void {
    this.connections.forEach((socket: any) => socket.disconnect());
    this.connections.clear();
  }
}

// Main Enhanced WebSocket Service
export class EnhancedWebSocketService extends EventEmitter {
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
    super();
    
    this.config = {
      url: import.meta.env.VITE_WS_URL || 'http://localhost:3001',
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 30000,
      timeout: 20000,
      transports: ['websocket', 'polling'],
      secure: import.meta.env.PROD
    };

    this.connectionState = {
      status: 'disconnected',
      attempts: 0,
      latency: 0,
      quality: 'excellent'
    };

    this.messageQueue = new MessageQueue();
    this.connectionPool = new ConnectionPool();
    
    this.setupAutoReconnection();
    this.setupNetworkHandlers();
  }

  // Connection Management
  async connect(authToken?: string, userId?: string): Promise<void> {
    if (this.socket?.connected) {
      console.log('✅ WebSocket already connected');
      return;
    }

    this.authToken = authToken;
    this.userId = userId;
    
    this.updateConnectionState('connecting');

    return new Promise((resolve, reject) => {
      let isResolved = false;
      let timeoutId: NodeJS.Timeout | null = null;
      
      const cleanup = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        
        // Remove temporary event listeners to prevent memory leaks
        if (this.socket && !isResolved) {
          this.socket.off('connect');
          this.socket.off('connect_error');
        }
      };

      const resolveOnce = () => {
        if (!isResolved) {
          isResolved = true;
          cleanup();
          this.onConnect();
          resolve();
        }
      };

      const rejectOnce = (error: Error) => {
        if (!isResolved) {
          isResolved = true;
          cleanup();
          
          // Enhanced error suppression for WebSocket connection failures
          const errorMessage = error.message?.toLowerCase() || '';
          const isWebSocketConnectionError = errorMessage.includes('websocket') ||
                                            errorMessage.includes('connection') ||
                                            errorMessage.includes('network') ||
                                            errorMessage.includes('timeout') ||
                                            errorMessage.includes('refused') ||
                                            errorMessage.includes('unavailable');
          
          // Cleanup socket on error
          if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
          }
          
          if (isWebSocketConnectionError) {
            this.updateConnectionState('disconnected', 'WebSocket unavailable');
            // Create a suppressed error that won't show in console
            const suppressedError = new Error('WebSocket service unavailable - graceful degradation active');
            suppressedError.name = 'WebSocketUnavailable';
            reject(suppressedError);
          } else {
            this.updateConnectionState('error', error.message);
            reject(error);
          }
        }
      };

      // Set timeout with proper cleanup
      timeoutId = setTimeout(() => {
        const timeoutError = new Error('WebSocket connection timeout');
        rejectOnce(timeoutError);
      }, this.config.timeout);

      try {
        this.socket = io(this.config.url, {
          ...this.config,
          auth: authToken ? { token: authToken } : undefined,
          query: userId ? { userId } : undefined,
          forceNew: true // Ensure fresh connection
        });

        this.socket.once('connect', resolveOnce);
        this.socket.once('connect_error', (error: any) => {
          const connectionError = new Error(`WebSocket connection failed: ${error.message || error}`);
          rejectOnce(connectionError);
        });

        this.setupEventHandlers();
        
      } catch (socketCreationError) {
        const creationError = new Error(`Failed to create WebSocket: ${socketCreationError}`);
        rejectOnce(creationError);
      }
    });
  }

  disconnect(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.connectionPool.closeAll();
    
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.updateConnectionState('disconnected');
    this.subscriptions.clear();
    this.messageQueue.clear();
  }

  private onConnect(): void {
    console.log('🚀 WebSocket connected successfully');
    
    this.updateConnectionState('connected');
    this.connectionState.attempts = 0;

    // Authenticate if token available
    if (this.authToken) {
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

    this.emit('connected');
  }

  private authenticate(token: string): void {
    this.emit('auth:request', { token });
    
    this.socket?.emit('authenticate', { token }, (response: any) => {
      if (response.success) {
        console.log('✅ WebSocket authenticated');
        this.emit('auth:success', response.user);
      } else {
        console.error('❌ WebSocket authentication failed:', response.error);
        this.emit('auth:error', response.error);
      }
    });
  }

  // Draft Room Features
  joinDraftRoom(draftId: string): void {
    const room = `draft:${draftId}`;
    this.subscribe(room);
    
    this.emit('draft:join', { draftId });
    
    // Set up draft-specific handlers
    this.on(`${room}:pick`, (data: any) => this.handleDraftPick(data));
    this.on(`${room}:timer`, (data: any) => this.handleDraftTimer(data));
    this.on(`${room}:turn`, (data: any) => this.handleDraftTurn(data));
    this.on(`${room}:chat`, (data: any) => this.handleDraftChat(data));
  }

  leaveDraftRoom(draftId: string): void {
    const room = `draft:${draftId}`;
    this.unsubscribe(room);
    this.emit('draft:leave', { draftId });
  }

  makeDraftPick(draftId: string, playerId: string): void {
    this.emitWithAck('draft:pick', {
      draftId,
      playerId,
      timestamp: Date.now()
    });
  }

  // Live Scoring System
  subscribeToLiveScoring(leagueId: string, weekNumber: number): void {
    const channel = `scoring:${leagueId}:week${weekNumber}`;
    this.subscribe(channel);
    
    this.on(`${channel}:update`, (update: LiveScoreUpdate) => {
      this.emit('scoring:update', update);
      this.updateLocalScoreCache(update);
    });

    this.on(`${channel}:final`, (data: any) => {
      this.emit('scoring:final', data);
    });
  }

  subscribeToPlayer(playerId: string): void {
    const channel = `player:${playerId}`;
    this.subscribe(channel);
    
    this.on(`${channel}:stats`, (data: any) => this.emit('player:stats', data));
    this.on(`${channel}:injury`, (data: any) => this.emit('player:injury', data));
    this.on(`${channel}:news`, (data: any) => this.emit('player:news', data));
  }

  // Real-Time Notifications
  enableNotifications(preferences?: any): void {
    this.emit('notifications:subscribe', preferences);
    
    this.on('notification', (notification: NotificationPayload) => {
      this.handleNotification(notification);
    });
  }

  private handleNotification(notification: NotificationPayload): void {
    // Store notification
    this.storeNotification(notification);
    
    // Emit typed events
    this.emit(`notification:${notification.type}`, notification);
    
    // Handle high priority notifications
    if (notification.priority === 'high') {
      this.showPushNotification(notification);
    }
    
    // Update UI badge
    this.emit('notification:badge:update');
  }

  // Chat & Communication
  sendMessage(roomId: string, roomType: string, message: string, attachments?: any[]): void {
    const chatMessage: Partial<ChatMessage> = {
      roomId,
      roomType: roomType as any,
      userId: this.userId,
      message,
      attachments,
      timestamp: Date.now()
    };

    this.emitWithAck('chat:message', chatMessage);
  }

  startTyping(roomId: string): void {
    this.emit('chat:typing:start', { roomId, userId: this.userId });
  }

  stopTyping(roomId: string): void {
    this.emit('chat:typing:stop', { roomId, userId: this.userId });
  }

  addReaction(messageId: string, emoji: string): void {
    this.emit('chat:reaction', { messageId, emoji, userId: this.userId });
  }

  // Trade Negotiation
  joinTradeNegotiation(tradeId: string): void {
    const room = `trade:${tradeId}`;
    this.subscribe(room);
    
    this.on(`${room}:update`, (data: any) => this.emit('trade:update', data));
    this.on(`${room}:message`, (data: any) => this.emit('trade:message', data));
    this.on(`${room}:counter`, (data: any) => this.emit('trade:counter', data));
  }

  sendTradeOffer(tradeData: any): void {
    this.emitWithAck('trade:propose', tradeData);
  }

  // Data Synchronization
  subscribeToDataSync(entities: string[]): void {
    entities.forEach((entity: any) => {
      const channel = `sync:${entity}`;
      this.subscribe(channel);
      
      this.on(`${channel}:update`, (event: DataSyncEvent) => {
        this.handleDataSync(event);
      });
    });
  }

  private handleDataSync(event: DataSyncEvent): void {
    // Check version for conflict resolution
    if (this.shouldApplySync(event)) {
      this.emit(`sync:${event.type}`, event);
      this.updateLocalCache(event);
    } else {
      this.resolveConflict(event);
    }
  }

  // Presence & User Status
  updatePresence(status: PresenceUpdate['status'], currentView?: string): void {
    const presence: Partial<PresenceUpdate> = {
      userId: this.userId,
      status,
      currentView,
      lastSeen: Date.now()
    };

    this.emit('presence:update', presence);
  }

  subscribeToPresence(userIds: string[]): void {
    userIds.forEach((userId: any) => {
      this.subscribe(`presence:${userId}`);
    });
    
    this.on('presence:change', (update: PresenceUpdate) => {
      this.emit('user:presence', update);
    });
  }

  // Performance & Optimization
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      const start = Date.now();
      
      this.socket?.emit('ping', {}, () => {
        const latency = Date.now() - start;
        this.connectionState.latency = latency;
        this.updateConnectionQuality(latency);
      });
    }, 30000); // Every 30 seconds
  }

  private updateConnectionQuality(latency: number): void {
    if (latency < 50) {
      this.connectionState.quality = 'excellent';
    } else if (latency < 150) {
      this.connectionState.quality = 'good';
    } else if (latency < 300) {
      this.connectionState.quality = 'fair';
    } else {
      this.connectionState.quality = 'poor';
    }
    
    this.emit('connection:quality', this.connectionState.quality);
  }

  private startMetricsCollection(): void {
    this.metricsInterval = setInterval(() => {
      const metrics = {
        messagesSent: 0,
        messagesReceived: 0,
        subscriptions: this.subscriptions.size,
        latency: this.connectionState.latency,
        quality: this.connectionState.quality,
        uptime: Date.now()
      };
      
      this.emit('metrics', metrics);
    }, 60000); // Every minute
  }

  // Reconnection & Recovery
  private setupAutoReconnection(): void {
    this.on('disconnect', (reason: any) => {
      console.log(`📡 Disconnected: ${reason}`);
      
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, attempt reconnection
        this.attemptReconnection();
      }
    });
  }

  private attemptReconnection(): void {
    if (this.connectionState.attempts >= this.config.reconnectionAttempts) {
      this.updateConnectionState('error', 'Max reconnection attempts reached');
      this.emit('connection:failed');
      return;
    }

    this.connectionState.attempts++;
    this.updateConnectionState('reconnecting');

    const delay = Math.min(
      this.config.reconnectionDelay * Math.pow(2, this.connectionState.attempts - 1),
      this.config.reconnectionDelayMax
    );

    console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.connectionState.attempts})`);

    this.reconnectTimer = setTimeout(() => {
      this.connect(this.authToken, this.userId).catch(error => {
        console.error('Reconnection failed:', error);
        this.attemptReconnection();
      });
    }, delay);
  }

  private resubscribe(): void {
    this.subscriptions.forEach((channel: any) => {
      this.socket?.emit('subscribe', { channel });
    });
  }

  // Network State Handlers
  private setupNetworkHandlers(): void {
    window.addEventListener('online', () => {
      console.log('🌐 Network online');
      if (!this.socket?.connected) {
        this.connect(this.authToken, this.userId);
      }
    });

    window.addEventListener('offline', () => {
      console.log('📵 Network offline');
      this.updateConnectionState('disconnected', 'Network offline');
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && !this.socket?.connected) {
        this.connect(this.authToken, this.userId);
      }
    });
  }

  // Helper Methods
  private emit(event: string, data?: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      this.messageQueue.add(event, data);
    }
  }

  private emitWithAck(event: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        this.socket.emit(event, data, (response: any) => {
          if (response.error) {
            reject(response.error);
          } else {
            resolve(response);
          }
        });
      } else {
        this.messageQueue.add(event, data);
        resolve({ queued: true });
      }
    });
  }

  private subscribe(channel: string): void {
    this.subscriptions.add(channel);
    if (this.socket?.connected) {
      this.socket.emit('subscribe', { channel });
    }
  }

  private unsubscribe(channel: string): void {
    this.subscriptions.delete(channel);
    if (this.socket?.connected) {
      this.socket.emit('unsubscribe', { channel });
    }
  }

  private on(event: string, handler: Function): void {
    if (!this.messageHandlers.has(event)) {
      this.messageHandlers.set(event, new Set());
    }
    this.messageHandlers.get(event)!.add(handler);
    
    this.socket?.on(event, handler as any);
  }

  private off(event: string, handler?: Function): void {
    if (handler) {
      this.messageHandlers.get(event)?.delete(handler);
      this.socket?.off(event, handler as any);
    } else {
      this.messageHandlers.delete(event);
      this.socket?.off(event);
    }
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    // Re-register all stored handlers
    this.messageHandlers.forEach((handlers, event) => {
      handlers.forEach((handler: any) => {
        this.socket!.on(event, handler as any);
      });
    });

    // Core event handlers
    this.socket.on('disconnect', (reason: any) => {
      this.updateConnectionState('disconnected', reason);
      this.emit('disconnected', reason);
    });

    this.socket.on('error', (error: any) => {
      console.error('❌ WebSocket error:', error);
      this.emit('error', error);
    });
  }

  private updateConnectionState(status: ConnectionState['status'], error?: string): void {
    this.connectionState.status = status;
    if (error) {
      this.connectionState.lastError = error;
    }
    this.emit('connection:state', this.connectionState);
  }

  private handleDraftPick(data: any): void {
    this.emit('draft:pick:made', data);
  }

  private handleDraftTimer(data: any): void {
    this.emit('draft:timer:update', data);
  }

  private handleDraftTurn(data: any): void {
    this.emit('draft:turn:change', data);
  }

  private handleDraftChat(data: any): void {
    this.emit('draft:chat:message', data);
  }

  private updateLocalScoreCache(update: LiveScoreUpdate): void {
    // Implementation for local score caching
  }

  private storeNotification(notification: NotificationPayload): void {
    // Store in local storage or IndexedDB
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.unshift(notification);
    if (notifications.length > 100) {
      notifications.pop();
    }
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }

  private async showPushNotification(notification: NotificationPayload): Promise<void> {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        tag: notification.id,
        requireInteraction: notification.priority === 'high'
      });
    }
  }

  private shouldApplySync(event: DataSyncEvent): boolean {
    // Version conflict resolution logic
    return true; // Simplified for now
  }

  private resolveConflict(event: DataSyncEvent): void {
    // Conflict resolution strategy
    this.emit('sync:conflict', event);
  }

  private updateLocalCache(event: DataSyncEvent): void {
    // Update local cache implementation
  }

  // Public API
  getConnectionState(): ConnectionState {
    return { ...this.connectionState };
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  getSubscriptions(): string[] {
    return Array.from(this.subscriptions);
  }
}

// Singleton instance
export const enhancedWebSocketService = new EnhancedWebSocketService();
export default enhancedWebSocketService;