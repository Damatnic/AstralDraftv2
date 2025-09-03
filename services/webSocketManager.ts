/**
 * Enhanced WebSocket Manager
 * Centralized WebSocket connection management with automatic cleanup
 */

import { memoryManager } from '../utils/memoryCleanup';

interface WebSocketConfig {
  url: string;
  protocols?: string | string[];
  reconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  messageQueueSize?: number;
}

interface WebSocketConnection {
  id: string;
  ws: WebSocket | null;
  config: WebSocketConfig;
  reconnectAttempts: number;
  reconnectTimer?: NodeJS.Timeout;
  heartbeatTimer?: NodeJS.Timeout;
  messageQueue: any[];
  listeners: Map<string, Set<Function>>;
  isClosing: boolean;
  lastActivity: number;
}

class WebSocketManager {
  private connections: Map<string, WebSocketConnection> = new Map();
  private globalListeners: Map<string, Set<Function>> = new Map();
  private monitoringInterval?: NodeJS.Timeout;
  private readonly MAX_CONNECTIONS = 10;
  private readonly CONNECTION_TIMEOUT = 30000; // 30 seconds
  private readonly IDLE_TIMEOUT = 300000; // 5 minutes

  constructor() {
    this.startConnectionMonitoring();
    this.setupCleanupHandlers();
  }

  /**
   * Create or get a WebSocket connection
   */
  connect(id: string, config: WebSocketConfig): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      // Check if connection already exists
      if (this.connections.has(id)) {
        const existing = this.connections.get(id)!;
        if (existing.ws?.readyState === WebSocket.OPEN) {
          resolve(existing.ws);
          return;
        }
      }

      // Check connection limit
      if (this.connections.size >= this.MAX_CONNECTIONS) {
        this.cleanupIdleConnections();
        if (this.connections.size >= this.MAX_CONNECTIONS) {
          reject(new Error(`Maximum WebSocket connections (${this.MAX_CONNECTIONS}) reached`));
          return;
        }
      }

      // Create new connection
      const connection: WebSocketConnection = {
        id,
        ws: null,
        config,
        reconnectAttempts: 0,
        messageQueue: [],
        listeners: new Map(),
        isClosing: false,
        lastActivity: Date.now()
      };

      try {
        const ws = new WebSocket(config.url, config.protocols);
        connection.ws = ws;

        // Set connection timeout
        const connectTimeout = memoryManager.registerTimer(() => {
          if (ws.readyState === WebSocket.CONNECTING) {
            ws.close();
            reject(new Error('WebSocket connection timeout'));
          }
        }, this.CONNECTION_TIMEOUT);

        // Setup event handlers
        ws.onopen = () => {
          memoryManager.clearTimer(connectTimeout);
          console.log(`[WebSocket] Connected: ${id}`);
          connection.lastActivity = Date.now();
          
          // Start heartbeat if configured
          if (config.heartbeatInterval) {
            this.startHeartbeat(connection);
          }

          // Process queued messages
          this.processMessageQueue(connection);

          // Emit open event
          this.emit(id, 'open', { id });
          
          resolve(ws);
        };

        ws.onmessage = (event: any) => {
          connection.lastActivity = Date.now();
          
          try {
            const data = JSON.parse(event.data);
            this.emit(id, 'message', data);
            
            // Handle specific message types
            if (data.type === 'pong') {
              this.emit(id, 'pong', data);
            }
          } catch (error) {
            console.error(`[WebSocket] Parse error for ${id}:`, error);
            this.emit(id, 'error', { type: 'parse', error });
          }
        };

        ws.onerror = (error: any) => {
          console.error(`[WebSocket] Error for ${id}:`, error);
          this.emit(id, 'error', error);
          
          if (ws.readyState === WebSocket.CONNECTING) {
            memoryManager.clearTimer(connectTimeout);
            reject(error);
          }
        };

        ws.onclose = (event: any) => {
          memoryManager.clearTimer(connectTimeout);
          console.log(`[WebSocket] Closed: ${id}`, {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean
          });

          // Stop heartbeat
          if (connection.heartbeatTimer) {
            memoryManager.clearInterval(connection.heartbeatTimer);
            connection.heartbeatTimer = undefined;
          }

          this.emit(id, 'close', event);

          // Handle reconnection
          if (!connection.isClosing && 
              config.reconnect && 
              connection.reconnectAttempts < (config.maxReconnectAttempts || 5)) {
            this.scheduleReconnect(connection);
          } else {
            this.removeConnection(id);
          }
        };

        this.connections.set(id, connection);

      } catch (error) {
        console.error(`[WebSocket] Failed to create connection ${id}:`, error);
        reject(error);
      }
    });
  }

  /**
   * Send a message through a WebSocket connection
   */
  send(id: string, data: any): boolean {
    const connection = this.connections.get(id);
    if (!connection) {
      console.warn(`[WebSocket] Connection not found: ${id}`);
      return false;
    }

    const message = typeof data === 'string' ? data : JSON.stringify(data);

    if (connection.ws?.readyState === WebSocket.OPEN) {
      try {
        connection.ws.send(message);
        connection.lastActivity = Date.now();
        return true;
      } catch (error) {
        console.error(`[WebSocket] Send error for ${id}:`, error);
        this.emit(id, 'error', { type: 'send', error });
        return false;
      }
    } else {
      // Queue message if configured
      if (connection.config.messageQueueSize && 
          connection.messageQueue.length < connection.config.messageQueueSize) {
        connection.messageQueue.push(message);
        console.log(`[WebSocket] Message queued for ${id}`);
      }
      return false;
    }
  }

  /**
   * Close a WebSocket connection
   */
  close(id: string, code?: number, reason?: string): void {
    const connection = this.connections.get(id);
    if (!connection) return;

    connection.isClosing = true;

    // Clear timers
    if (connection.reconnectTimer) {
      memoryManager.clearTimer(connection.reconnectTimer);
      connection.reconnectTimer = undefined;
    }
    if (connection.heartbeatTimer) {
      memoryManager.clearInterval(connection.heartbeatTimer);
      connection.heartbeatTimer = undefined;
    }

    // Close WebSocket
    if (connection.ws) {
      if (connection.ws.readyState === WebSocket.OPEN || 
          connection.ws.readyState === WebSocket.CONNECTING) {
        connection.ws.close(code, reason);
      }
      connection.ws = null;
    }

    // Clear listeners
    connection.listeners.clear();
    
    // Remove from connections
    this.connections.delete(id);
    
    console.log(`[WebSocket] Connection closed: ${id}`);
  }

  /**
   * Close all WebSocket connections
   */
  closeAll(): void {
    console.log('[WebSocket] Closing all connections...');
    
    for (const id of this.connections.keys()) {
      this.close(id);
    }
    
    this.connections.clear();
    this.globalListeners.clear();
    
    if (this.monitoringInterval) {
      memoryManager.clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }
  }

  /**
   * Add an event listener for a connection
   */
  on(id: string, event: string, callback: Function): () => void {
    const connection = this.connections.get(id);
    if (!connection) {
      console.warn(`[WebSocket] Cannot add listener - connection not found: ${id}`);
      return () => {};
    }

    if (!connection.listeners.has(event)) {
      connection.listeners.set(event, new Set());
    }
    
    connection.listeners.get(event)!.add(callback);

    // Return cleanup function
    return () => {
      this.off(id, event, callback);
    };
  }

  /**
   * Remove an event listener
   */
  off(id: string, event: string, callback: Function): void {
    const connection = this.connections.get(id);
    if (!connection) return;

    const listeners = connection.listeners.get(event);
    if (listeners) {
      listeners.delete(callback);
      if (listeners.size === 0) {
        connection.listeners.delete(event);
      }
    }
  }

  /**
   * Add a global event listener
   */
  onGlobal(event: string, callback: Function): () => void {
    if (!this.globalListeners.has(event)) {
      this.globalListeners.set(event, new Set());
    }
    
    this.globalListeners.get(event)!.add(callback);

    return () => {
      this.offGlobal(event, callback);
    };
  }

  /**
   * Remove a global event listener
   */
  offGlobal(event: string, callback: Function): void {
    const listeners = this.globalListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
      if (listeners.size === 0) {
        this.globalListeners.delete(event);
      }
    }
  }

  /**
   * Emit an event
   */
  private emit(id: string, event: string, data?: any): void {
    // Connection-specific listeners
    const connection = this.connections.get(id);
    if (connection) {
      const listeners = connection.listeners.get(event);
      if (listeners) {
        listeners.forEach((callback: any) => {
          try {
            callback(data);
          } catch (error) {
            console.error(`[WebSocket] Listener error for ${id}/${event}:`, error);
          }
        });
      }
    }

    // Global listeners
    const globalListeners = this.globalListeners.get(event);
    if (globalListeners) {
      globalListeners.forEach((callback: any) => {
        try {
          callback({ connectionId: id, ...data });
        } catch (error) {
          console.error(`[WebSocket] Global listener error for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Start heartbeat for a connection
   */
  private startHeartbeat(connection: WebSocketConnection): void {
    if (connection.heartbeatTimer) {
      memoryManager.clearInterval(connection.heartbeatTimer);
    }

    connection.heartbeatTimer = memoryManager.registerInterval(() => {
      if (connection.ws?.readyState === WebSocket.OPEN) {
        this.send(connection.id, { type: 'ping', timestamp: Date.now() });
      }
    }, connection.config.heartbeatInterval!);
  }

  /**
   * Schedule reconnection
   */
  private scheduleReconnect(connection: WebSocketConnection): void {
    connection.reconnectAttempts++;
    
    const delay = Math.min(
      (connection.config.reconnectInterval || 1000) * Math.pow(2, connection.reconnectAttempts - 1),
      30000 // Max 30 seconds
    );

    console.log(`[WebSocket] Scheduling reconnect for ${connection.id} in ${delay}ms (attempt ${connection.reconnectAttempts})`);

    connection.reconnectTimer = memoryManager.registerTimer(() => {
      connection.reconnectTimer = undefined;
      
      if (this.connections.has(connection.id)) {
        this.connect(connection.id, connection.config)
          .then(() => {
            connection.reconnectAttempts = 0;
            console.log(`[WebSocket] Reconnected: ${connection.id}`);
          })
          .catch(error => {
            console.error(`[WebSocket] Reconnection failed for ${connection.id}:`, error);
          });
      }
    }, delay);
  }

  /**
   * Process queued messages
   */
  private processMessageQueue(connection: WebSocketConnection): void {
    if (connection.messageQueue.length === 0) return;

    console.log(`[WebSocket] Processing ${connection.messageQueue.length} queued messages for ${connection.id}`);
    
    while (connection.messageQueue.length > 0 && 
           connection.ws?.readyState === WebSocket.OPEN) {
      const message = connection.messageQueue.shift();
      try {
        connection.ws.send(message);
      } catch (error) {
        console.error(`[WebSocket] Failed to send queued message for ${connection.id}:`, error);
        break;
      }
    }
  }

  /**
   * Remove a connection
   */
  private removeConnection(id: string): void {
    const connection = this.connections.get(id);
    if (!connection) return;

    // Clear all timers
    if (connection.reconnectTimer) {
      memoryManager.clearTimer(connection.reconnectTimer);
    }
    if (connection.heartbeatTimer) {
      memoryManager.clearInterval(connection.heartbeatTimer);
    }

    // Clear listeners
    connection.listeners.clear();
    
    // Remove from map
    this.connections.delete(id);
    
    console.log(`[WebSocket] Connection removed: ${id}`);
  }

  /**
   * Clean up idle connections
   */
  private cleanupIdleConnections(): void {
    const now = Date.now();
    const idsToRemove: string[] = [];

    for (const [id, connection] of this.connections) {
      if (now - connection.lastActivity > this.IDLE_TIMEOUT) {
        idsToRemove.push(id);
      }
    }

    for (const id of idsToRemove) {
      console.log(`[WebSocket] Cleaning up idle connection: ${id}`);
      this.close(id, 1000, 'Idle timeout');
    }
  }

  /**
   * Start connection monitoring
   */
  private startConnectionMonitoring(): void {
    this.monitoringInterval = memoryManager.registerInterval(() => {
      // Clean up idle connections
      this.cleanupIdleConnections();

      // Log connection stats
      const stats = this.getConnectionStats();
      if (stats.total > 0) {
        console.log('[WebSocket] Connection stats:', stats);
      }

      // Check for memory issues
      if (stats.total > this.MAX_CONNECTIONS * 0.8) {
        console.warn(`[WebSocket] High connection count: ${stats.total}/${this.MAX_CONNECTIONS}`);
      }
    }, 60000); // Every minute
  }

  /**
   * Setup cleanup handlers
   */
  private setupCleanupHandlers(): void {
    // Clean up on page unload
    if (typeof window !== 'undefined') {
      memoryManager.addEventListener(window, 'beforeunload', () => {
        this.closeAll();
      });

      // Clean up on visibility change
      memoryManager.addEventListener(document, 'visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          // Close non-critical connections when going to background
          for (const [id, connection] of this.connections) {
            if (!connection.config.reconnect) {
              this.close(id, 1000, 'Page hidden');
            }
          }
        }
      });

      // Handle memory pressure
      memoryManager.addEventListener(window, 'memory-pressure', (event: any) => {
        if (event.detail.level === 'critical') {
          console.warn('[WebSocket] Memory pressure detected, closing non-essential connections');
          
          // Close connections without reconnect enabled
          for (const [id, connection] of this.connections) {
            if (!connection.config.reconnect) {
              this.close(id, 1000, 'Memory pressure');
            }
          }
        }
      });
    }
  }

  /**
   * Get connection statistics
   */
  getConnectionStats(): {
    total: number;
    open: number;
    connecting: number;
    closing: number;
    closed: number;
    totalListeners: number;
    totalQueuedMessages: number;
  } {
    let open = 0;
    let connecting = 0;
    let closing = 0;
    let closed = 0;
    let totalListeners = 0;
    let totalQueuedMessages = 0;

    for (const connection of this.connections.values()) {
      if (!connection.ws) {
        closed++;
      } else {
        switch (connection.ws.readyState) {
          case WebSocket.CONNECTING:
            connecting++;
            break;
          case WebSocket.OPEN:
            open++;
            break;
          case WebSocket.CLOSING:
            closing++;
            break;
          case WebSocket.CLOSED:
            closed++;
            break;
        }
      }

      for (const listeners of connection.listeners.values()) {
        totalListeners += listeners.size;
      }

      totalQueuedMessages += connection.messageQueue.length;
    }

    return {
      total: this.connections.size,
      open,
      connecting,
      closing,
      closed,
      totalListeners,
      totalQueuedMessages
    };
  }

  /**
   * Check if a connection exists and is open
   */
  isConnected(id: string): boolean {
    const connection = this.connections.get(id);
    return connection?.ws?.readyState === WebSocket.OPEN || false;
  }

  /**
   * Get connection state
   */
  getConnectionState(id: string): string | null {
    const connection = this.connections.get(id);
    if (!connection || !connection.ws) return null;

    switch (connection.ws.readyState) {
      case WebSocket.CONNECTING: return 'connecting';
      case WebSocket.OPEN: return 'open';
      case WebSocket.CLOSING: return 'closing';
      case WebSocket.CLOSED: return 'closed';
      default: return 'unknown';
    }
  }
}

// Create singleton instance
export const wsManager = new WebSocketManager();

// Export convenience functions
export const createWebSocket = (id: string, config: WebSocketConfig) => 
  wsManager.connect(id, config);

export const sendWebSocketMessage = (id: string, data: any) => 
  wsManager.send(id, data);

export const closeWebSocket = (id: string, code?: number, reason?: string) => 
  wsManager.close(id, code, reason);

export const onWebSocketMessage = (id: string, event: string, callback: Function) => 
  wsManager.on(id, event, callback);

export const isWebSocketConnected = (id: string) => 
  wsManager.isConnected(id);