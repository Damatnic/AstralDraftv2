/**
 * WebSocket Service with Robust Error Handling
 * Provides resilient WebSocket connections with automatic fallback
 */

import { EventEmitter } from &apos;events&apos;;

export interface WebSocketConfig {
}
  url: string;
  reconnectAttempts?: number;
  reconnectDelay?: number;
  heartbeatInterval?: number;
  timeout?: number;
  fallbackToPolling?: boolean;
}

export enum ConnectionState {
}
  DISCONNECTED = &apos;disconnected&apos;,
  CONNECTING = &apos;connecting&apos;,
  CONNECTED = &apos;connected&apos;,
  RECONNECTING = &apos;reconnecting&apos;,
  FAILED = &apos;failed&apos;
}

class ResilientWebSocketService extends EventEmitter {
}
  private socket: WebSocket | null = null;
  private config: Required<WebSocketConfig>;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private reconnectCount = 0;
  private connectionState = ConnectionState.DISCONNECTED;
  private messageQueue: Array<{ event: string; data: any }> = [];
  private isPollingMode = false;
  private pollingTimer: NodeJS.Timeout | null = null;

  constructor(config: WebSocketConfig) {
}
    super();
    
    this.config = {
}
      url: config.url,
      reconnectAttempts: config.reconnectAttempts ?? 5,
      reconnectDelay: config.reconnectDelay ?? 5000,
      heartbeatInterval: config.heartbeatInterval ?? 30000,
      timeout: config.timeout ?? 10000,
      fallbackToPolling: config.fallbackToPolling ?? true
    };
  }

  /**
   * Connect to WebSocket with error handling
   */
  async connect(): Promise<void> {
}
    if (this.connectionState === ConnectionState.CONNECTED) {
}
      console.log(&apos;WebSocket already connected&apos;);
      return;
    }

    if (this.connectionState === ConnectionState.CONNECTING) {
}
      console.log(&apos;WebSocket connection already in progress&apos;);
      return;
    }

    this.setConnectionState(ConnectionState.CONNECTING);

    try {
}
      // Check if WebSocket is available
      if (typeof WebSocket === &apos;undefined&apos;) {
}
        throw new Error(&apos;WebSocket not supported in this environment&apos;);
      }

      // Validate URL
      const wsUrl = this.normalizeWebSocketUrl(this.config.url);
      
      // Create WebSocket connection
      this.socket = new WebSocket(wsUrl);
      
      // Set up timeout for connection
      const connectionTimeout = setTimeout(() => {
}
        if (this.connectionState === ConnectionState.CONNECTING) {
}
          this.handleConnectionTimeout();
        }
      }, this.config.timeout);

      // Set up event handlers
      this.socket.onopen = () => {
}
        clearTimeout(connectionTimeout);
        this.handleOpen();
      };

      this.socket.onclose = (event: any) => {
}
        clearTimeout(connectionTimeout);
        this.handleClose(event);
      };

      this.socket.onerror = (error: any) => {
}
        clearTimeout(connectionTimeout);
        this.handleError(error);
      };

      this.socket.onmessage = (event: any) => {
}
        this.handleMessage(event);
      };

    } catch (error) {
}
      console.error(&apos;Failed to create WebSocket connection:&apos;, error);
      this.handleConnectionFailure();
    }
  }

  /**
   * Normalize WebSocket URL
   */
  private normalizeWebSocketUrl(url: string): string {
}
    // Handle relative URLs
    if (url.startsWith(&apos;/&apos;)) {
}
      const protocol = window.location.protocol === &apos;https:&apos; ? &apos;wss:&apos; : &apos;ws:&apos;;
      return `${protocol}//${window.location.host}${url}`;
    }
    
    // Convert http to ws
    if (url.startsWith(&apos;http://&apos;)) {
}
      return url.replace(&apos;http://&apos;, &apos;ws://&apos;);
    }
    
    // Convert https to wss
    if (url.startsWith(&apos;https://&apos;)) {
}
      return url.replace(&apos;https://&apos;, &apos;wss://&apos;);
    }
    
    return url;
  }

  /**
   * Handle successful connection
   */
  private handleOpen(): void {
}
    console.log(&apos;WebSocket connected successfully&apos;);
    this.setConnectionState(ConnectionState.CONNECTED);
    this.reconnectCount = 0;
    this.isPollingMode = false;
    
    // Stop polling if it was active
    this.stopPolling();
    
    // Start heartbeat
    this.startHeartbeat();
    
    // Process queued messages
    this.processMessageQueue();
    
    // Emit connected event
    this.emit(&apos;connected&apos;);
  }

  /**
   * Handle connection close
   */
  private handleClose(event: CloseEvent): void {
}
    console.log(`WebSocket closed: ${event.code} - ${event.reason}`);
    
    this.stopHeartbeat();
    this.socket = null;
    
    // Determine if we should reconnect
    if (event.code === 1000 || event.code === 1001) {
}
      // Normal closure
      this.setConnectionState(ConnectionState.DISCONNECTED);
      this.emit(&apos;disconnected&apos;, { code: event.code, reason: event.reason });
    } else {
}
      // Abnormal closure - attempt reconnection
      this.attemptReconnection();
    }
  }

  /**
   * Handle connection error
   */
  private handleError(error: Event): void {
}
    console.error(&apos;WebSocket error:&apos;, error);
    this.emit(&apos;error&apos;, error);
    
    // Don&apos;t change state here, let close handler manage state
  }

  /**
   * Handle connection timeout
   */
  private handleConnectionTimeout(): void {
}
    console.warn(&apos;WebSocket connection timeout&apos;);
    
    if (this.socket) {
}
      this.socket.close();
      this.socket = null;
    }
    
    this.handleConnectionFailure();
  }

  /**
   * Handle connection failure
   */
  private handleConnectionFailure(): void {
}
    if (this.reconnectCount < this.config.reconnectAttempts) {
}
      this.attemptReconnection();
    } else if (this.config.fallbackToPolling) {
}
      this.fallbackToPolling();
    } else {
}
      this.setConnectionState(ConnectionState.FAILED);
      this.emit(&apos;failed&apos;, { 
}
        message: &apos;WebSocket connection failed after maximum attempts&apos;,
        reconnectAttempts: this.reconnectCount 
      });
    }
  }

  /**
   * Attempt to reconnect
   */
  private attemptReconnection(): void {
}
    if (this.connectionState === ConnectionState.RECONNECTING) {
}
      return;
    }
    
    this.reconnectCount++;
    this.setConnectionState(ConnectionState.RECONNECTING);
    
    const delay = this.calculateReconnectDelay();
    console.log(`Attempting reconnection #${this.reconnectCount} in ${delay}ms`);
    
    this.reconnectTimer = setTimeout(() => {
}
      this.connect();
    }, delay);
    
    this.emit(&apos;reconnecting&apos;, { 
}
      attempt: this.reconnectCount,
      maxAttempts: this.config.reconnectAttempts,
//       delay 
    });
  }

  /**
   * Calculate exponential backoff delay for reconnection
   */
  private calculateReconnectDelay(): number {
}
    const baseDelay = this.config.reconnectDelay;
    const maxDelay = baseDelay * 10;
    const delay = Math.min(baseDelay * Math.pow(2, this.reconnectCount - 1), maxDelay);
    // Add jitter to prevent thundering herd
    return delay + Math.random() * 1000;
  }

  /**
   * Fallback to polling mode
   */
  private fallbackToPolling(): void {
}
    console.log(&apos;Falling back to polling mode&apos;);
    this.isPollingMode = true;
    this.setConnectionState(ConnectionState.CONNECTED);
    
    this.emit(&apos;fallback&apos;, { mode: &apos;polling&apos; });
    
    // Start polling
    this.startPolling();
  }

  /**
   * Start polling as fallback
   */
  private startPolling(): void {
}
    if (this.pollingTimer) {
}
      return;
    }
    
    const poll = async () => {
}
      try {
}
        // Make HTTP request to get updates
        const response = await fetch(`${this.config.url.replace(/^ws/, &apos;http&apos;)}/poll`, {
}
          method: &apos;POST&apos;,
          headers: { &apos;Content-Type&apos;: &apos;application/json&apos; },
          body: JSON.stringify({ 
}
            lastUpdate: Date.now() - 30000 // Get last 30 seconds of data
          })
        });
        
        if (response.ok) {
}
          const data = await response.json();
          this.emit(&apos;message&apos;, { data: JSON.stringify(data) });
        }
      } catch (error) {
}
        console.warn(&apos;Polling request failed:&apos;, error);
      }
    };
    
    // Poll every 5 seconds
    this.pollingTimer = setInterval(poll, 5000);
    poll(); // Initial poll
  }

  /**
   * Stop polling
   */
  private stopPolling(): void {
}
    if (this.pollingTimer) {
}
      clearInterval(this.pollingTimer);
      this.pollingTimer = null;
    }
  }

  /**
   * Handle incoming message
   */
  private handleMessage(event: MessageEvent): void {
}
    try {
}
      const data = JSON.parse(event.data);
      this.emit(&apos;message&apos;, data);
      
      // Handle specific message types
      if (data.type) {
}
        this.emit(data.type, data.payload);
      }
    } catch (error) {
}
      console.error(&apos;Failed to parse WebSocket message:&apos;, error);
      // Emit raw message as fallback
      this.emit(&apos;raw-message&apos;, event.data);
    }
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
}
    this.stopHeartbeat();
    
    this.heartbeatTimer = setInterval(() => {
}
      if (this.isConnected()) {
}
        this.send(&apos;ping&apos;, { timestamp: Date.now() });
      }
    }, this.config.heartbeatInterval);
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
}
    if (this.heartbeatTimer) {
}
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Send a message
   */
  send(event: string, data: any = {}): void {
}
    const message = { event, data, timestamp: Date.now() };
    
    if (this.isConnected() && !this.isPollingMode) {
}
      try {
}
        this.socket!.send(JSON.stringify(message));
        this.emit(&apos;sent&apos;, message);
      } catch (error) {
}
        console.error(&apos;Failed to send message:&apos;, error);
        this.queueMessage(event, data);
      }
    } else if (this.isPollingMode) {
}
      // In polling mode, queue for next poll or send via HTTP
      this.sendViaHttp(message);
    } else {
}
      // Queue message for when connected
      this.queueMessage(event, data);
    }
  }

  /**
   * Send message via HTTP in polling mode
   */
  private async sendViaHttp(message: any): Promise<void> {
}
    try {
}
      await fetch(`${this.config.url.replace(/^ws/, &apos;http&apos;)}/send`, {
}
        method: &apos;POST&apos;,
        headers: { &apos;Content-Type&apos;: &apos;application/json&apos; },
        body: JSON.stringify(message)
      });
    } catch (error) {
}
      console.error(&apos;Failed to send message via HTTP:&apos;, error);
    }
  }

  /**
   * Queue a message
   */
  private queueMessage(event: string, data: any): void {
}
    this.messageQueue.push({ event, data });
    
    // Limit queue size
    if (this.messageQueue.length > 100) {
}
      this.messageQueue.shift();
    }
  }

  /**
   * Process queued messages
   */
  private processMessageQueue(): void {
}
    while (this.messageQueue.length > 0) {
}
      const message = this.messageQueue.shift();
      if (message) {
}
        this.send(message.event, message.data);
      }
    }
  }

  /**
   * Set connection state
   */
  private setConnectionState(state: ConnectionState): void {
}
    if (this.connectionState !== state) {
}
      const previousState = this.connectionState;
      this.connectionState = state;
      this.emit(&apos;state-change&apos;, { from: previousState, to: state });
    }
  }

  /**
   * Disconnect WebSocket
   */
  disconnect(): void {
}
    // Clear timers
    if (this.reconnectTimer) {
}
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    this.stopHeartbeat();
    this.stopPolling();
    
    // Close socket
    if (this.socket) {
}
      this.socket.close(1000, &apos;Client disconnect&apos;);
      this.socket = null;
    }
    
    // Clear queue
    this.messageQueue = [];
    
    this.setConnectionState(ConnectionState.DISCONNECTED);
    this.emit(&apos;disconnected&apos;, { code: 1000, reason: &apos;Client disconnect&apos; });
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
}
    return this.socket?.readyState === WebSocket.OPEN;
  }

  /**
   * Get connection state
   */
  getState(): ConnectionState {
}
    return this.connectionState;
  }

  /**
   * Get connection info
   */
  getConnectionInfo(): {
}
    state: ConnectionState;
    isPolling: boolean;
    reconnectCount: number;
    queueSize: number;
  } {
}
    return {
}
      state: this.connectionState,
      isPolling: this.isPollingMode,
      reconnectCount: this.reconnectCount,
      queueSize: this.messageQueue.length
    };
  }
}

// Create default WebSocket service
const defaultConfig: WebSocketConfig = {
}
  url: process.env.NODE_ENV === &apos;production&apos; 
    ? &apos;wss://astraldraft.netlify.app/ws&apos;
    : &apos;ws://localhost:3001&apos;,
  reconnectAttempts: 5,
  reconnectDelay: 3000,
  heartbeatInterval: 30000,
  timeout: 10000,
  fallbackToPolling: true
};

export const websocketService = new ResilientWebSocketService(defaultConfig);

// Auto-connect in browser environment
if (typeof window !== &apos;undefined&apos;) {
}
  // Wait for DOM ready
  if (document.readyState === &apos;loading&apos;) {
}
    document.addEventListener(&apos;DOMContentLoaded&apos;, () => {
}
      websocketService.connect().catch(err => {
}
        console.warn(&apos;WebSocket auto-connect failed:&apos;, err);
      });
    });
  } else {
}
    websocketService.connect().catch(err => {
}
      console.warn(&apos;WebSocket auto-connect failed:&apos;, err);
    });
  }
}

export default websocketService;