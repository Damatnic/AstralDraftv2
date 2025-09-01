/**
 * Real-time Draft WebSocket Service
 * Manages live draft room connections, pick updates, and timer synchronization
 */

export interface DraftPickMessage {
}
  type: &apos;PICK_MADE&apos;;
  data: {
}
    leagueId: string;
    teamId: number;
    playerId: number;
    pickNumber: number;
    timestamp: number;
    timeRemaining?: number;
  };
}

export interface DraftTimerMessage {
}
  type: &apos;TIMER_UPDATE&apos;;
  data: {
}
    leagueId: string;
    timeRemaining: number;
    currentPicker: number;
    pickNumber: number;
    isPaused: boolean;
  };
}

export interface DraftStatusMessage {
}
  type: &apos;DRAFT_STATUS&apos;;
  data: {
}
    leagueId: string;
    status: &apos;WAITING&apos; | &apos;ACTIVE&apos; | &apos;PAUSED&apos; | &apos;COMPLETED&apos;;
    currentRound: number;
    currentPick: number;
    participants: {
}
      teamId: number;
      userId: string;
      isOnline: boolean;
      lastSeen: number;
    }[];
  };
}

export interface UserJoinMessage {
}
  type: &apos;USER_JOINED&apos;;
  data: {
}
    leagueId: string;
    userId: string;
    teamId: number;
    timestamp: number;
  };
}

export interface UserLeaveMessage {
}
  type: &apos;USER_LEFT&apos;;
  data: {
}
    leagueId: string;
    userId: string;
    teamId: number;
    timestamp: number;
  };
}

export interface DraftChatMessage {
}
  type: &apos;CHAT_MESSAGE&apos;;
  data: {
}
    leagueId: string;
    userId: string;
    message: string;
    timestamp: number;
    isTradeProposal?: boolean;
  };
}

export type DraftWebSocketMessage = 
  | DraftPickMessage 
  | DraftTimerMessage 
  | DraftStatusMessage 
  | UserJoinMessage 
  | UserLeaveMessage 
  | DraftChatMessage;

export interface DraftRoomState {
}
  leagueId: string;
  status: &apos;WAITING&apos; | &apos;ACTIVE&apos; | &apos;PAUSED&apos; | &apos;COMPLETED&apos;;
  currentRound: number;
  currentPick: number;
  currentPicker: number;
  timePerPick: number;
  timeRemaining: number;
  isPaused: boolean;
  participants: Map<string, {
}
    teamId: number;
    userId: string;
    isOnline: boolean;
    lastSeen: number;
  }>;
  picks: Array<{
}
    teamId: number;
    playerId: number;
    pickNumber: number;
    timestamp: number;
  }>;
  chatMessages: Array<{
}
    userId: string;
    message: string;
    timestamp: number;
    isTradeProposal?: boolean;
  }>;
}

class DraftWebSocketService {
}
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly reconnectDelay = 1000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private isConnecting = false;
  
  private readonly listeners: Map<string, ((message: DraftWebSocketMessage) => void)[]> = new Map();
  private roomState: DraftRoomState | null = null;
  
  constructor() {
}
    this.setupEventListeners();
  }

  /**
   * Connect to draft room WebSocket
   */
  async connectToDraftRoom(leagueId: string, userId: string): Promise<void> {
}
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
}
      return;
    }

    this.isConnecting = true;
    
    try {
}
      const wsUrl = this.getWebSocketUrl(leagueId, userId);
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);
      
    } catch (error) {
}
      console.error(&apos;Failed to connect to draft room:&apos;, error);
      this.isConnecting = false;
      throw error;
    }
  }

  /**
   * Disconnect from draft room
   */
  disconnect(): void {
}
    if (this.heartbeatInterval) {
}
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    
    if (this.ws) {
}
      this.ws.close(1000, &apos;User disconnected&apos;);
      this.ws = null;
    }
    
    this.reconnectAttempts = 0;
    this.isConnecting = false;
    this.roomState = null;
  }

  /**
   * Send draft pick
   */
  sendPick(leagueId: string, teamId: number, playerId: number): void {
}
    if (!this.isConnected()) {
}
      throw new Error(&apos;Not connected to draft room&apos;);
    }

    const message: DraftPickMessage = {
}
      type: &apos;PICK_MADE&apos;,
      data: {
}
        leagueId,
        teamId,
        playerId,
        pickNumber: this.roomState?.currentPick || 1,
        timestamp: Date.now()
      }
    };

    this.send(message);
  }

  /**
   * Send chat message
   */
  sendChatMessage(leagueId: string, userId: string, message: string, isTradeProposal = false): void {
}
    if (!this.isConnected()) {
}
      throw new Error(&apos;Not connected to draft room&apos;);
    }

    const chatMessage: DraftChatMessage = {
}
      type: &apos;CHAT_MESSAGE&apos;,
      data: {
}
        leagueId,
        userId,
        message,
        timestamp: Date.now(),
//         isTradeProposal
      }
    };

    this.send(chatMessage);
  }

  /**
   * Pause/resume draft timer
   */
  toggleTimer(leagueId: string): void {
}
    if (!this.isConnected()) {
}
      throw new Error(&apos;Not connected to draft room&apos;);
    }

    this.send({
}
      type: &apos;TIMER_UPDATE&apos;,
      data: {
}
        leagueId,
        timeRemaining: this.roomState?.timeRemaining || 0,
        currentPicker: this.roomState?.currentPicker || 1,
        pickNumber: this.roomState?.currentPick || 1,
        isPaused: !this.roomState?.isPaused
      }
    });
  }

  /**
   * Add event listener for specific message types
   */
  addEventListener(eventType: DraftWebSocketMessage[&apos;type&apos;], callback: (message: DraftWebSocketMessage) => void): void {
}
    if (!this.listeners.has(eventType)) {
}
      this.listeners.set(eventType, []);
    }
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
}
      callbacks.push(callback);
    }
  }

  /**
   * Remove event listener
   */
  removeEventListener(eventType: DraftWebSocketMessage[&apos;type&apos;], callback: (message: DraftWebSocketMessage) => void): void {
}
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
}
      const index = callbacks.indexOf(callback);
      if (index > -1) {
}
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Get current room state
   */
  getRoomState(): DraftRoomState | null {
}
    return this.roomState;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
}
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Get WebSocket connection status
   */
  getConnectionStatus(): &apos;CONNECTING&apos; | &apos;CONNECTED&apos; | &apos;DISCONNECTED&apos; | &apos;ERROR&apos; {
}
    if (this.isConnecting) return &apos;CONNECTING&apos;;
    if (!this.ws) return &apos;DISCONNECTED&apos;;
    
    switch (this.ws.readyState) {
}
      case WebSocket.CONNECTING: return &apos;CONNECTING&apos;;
      case WebSocket.OPEN: return &apos;CONNECTED&apos;;
      case WebSocket.CLOSING:
      case WebSocket.CLOSED: return &apos;DISCONNECTED&apos;;
      default: return &apos;ERROR&apos;;
    }
  }

  private getWebSocketUrl(leagueId: string, userId: string): string {
}
    const host = process.env.NODE_ENV === &apos;production&apos; 
      ? &apos;wss://your-websocket-server.netlify.app&apos;
      : &apos;ws://localhost:3001&apos;;
    
    return `${host}/draft-room?leagueId=${leagueId}&userId=${userId}`;
  }

  private setupEventListeners(): void {
}
    // Handle page visibility changes
    document.addEventListener(&apos;visibilitychange&apos;, () => {
}
      if (document.visibilityState === &apos;visible&apos; && this.ws && this.ws.readyState === WebSocket.CLOSED) {
}
        this.attemptReconnect();
      }
    });

    // Handle beforeunload
    window.addEventListener(&apos;beforeunload&apos;, () => {
}
      this.disconnect();
    });
  }

  private handleOpen(_event: Event): void {
}
    console.log(&apos;Connected to draft room WebSocket&apos;);
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.startHeartbeat();
    
    // Notify listeners of connection
    this.emit({
}
      type: &apos;DRAFT_STATUS&apos;,
      data: {
}
        leagueId: &apos;&apos;,
        status: &apos;WAITING&apos;,
        currentRound: 1,
        currentPick: 1,
        participants: []
      }
    });
  }

  private handleMessage(event: MessageEvent): void {
}
    try {
}
      const message: DraftWebSocketMessage = JSON.parse(event.data);
      this.processMessage(message);
      this.emit(message);
    } catch (error) {
}
      console.error(&apos;Failed to parse WebSocket message:&apos;, error);
    }
  }

  private handleClose(event: CloseEvent): void {
}
    console.log(&apos;Draft room WebSocket closed:&apos;, event.code, event.reason);
    this.isConnecting = false;
    
    if (this.heartbeatInterval) {
}
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    // Attempt reconnection if not intentionally closed
    if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
}
      this.attemptReconnect();
    }
  }

  private handleError(event: Event): void {
}
    console.error(&apos;Draft room WebSocket error:&apos;, event);
    this.isConnecting = false;
  }

  private processMessage(message: DraftWebSocketMessage): void {
}
    switch (message.type) {
}
      case &apos;DRAFT_STATUS&apos;:
        this.updateRoomState(message.data);
        break;
      case &apos;PICK_MADE&apos;:
        this.handlePickMade(message.data);
        break;
      case &apos;TIMER_UPDATE&apos;:
        this.handleTimerUpdate(message.data);
        break;
      case &apos;USER_JOINED&apos;:
        this.handleUserJoined(message.data);
        break;
      case &apos;USER_LEFT&apos;:
        this.handleUserLeft(message.data);
        break;
      case &apos;CHAT_MESSAGE&apos;:
        this.handleChatMessage(message.data);
        break;
    }
  }

  private updateRoomState(data: DraftStatusMessage[&apos;data&apos;]): void {
}
    if (!this.roomState) {
}
      this.roomState = {
}
        leagueId: data.leagueId,
        status: data.status,
        currentRound: data.currentRound,
        currentPick: data.currentPick,
        currentPicker: 1,
        timePerPick: 120, // 2 minutes default
        timeRemaining: 120,
        isPaused: false,
        participants: new Map(),
        picks: [],
        chatMessages: []
      };
    } else {
}
      this.roomState.status = data.status;
      this.roomState.currentRound = data.currentRound;
      this.roomState.currentPick = data.currentPick;
    }

    // Update participants
    data.participants.forEach((participant: any) => {
}
      if (this.roomState) {
}
        this.roomState.participants.set(participant.userId, participant);
      }
    });
  }

  private handlePickMade(data: DraftPickMessage[&apos;data&apos;]): void {
}
    if (this.roomState) {
}
      this.roomState.picks.push({
}
        teamId: data.teamId,
        playerId: data.playerId,
        pickNumber: data.pickNumber,
        timestamp: data.timestamp
      });
      
      // Advance to next pick
      this.roomState.currentPick++;
      this.roomState.timeRemaining = this.roomState.timePerPick;
    }
  }

  private handleTimerUpdate(data: DraftTimerMessage[&apos;data&apos;]): void {
}
    if (this.roomState) {
}
      this.roomState.timeRemaining = data.timeRemaining;
      this.roomState.currentPicker = data.currentPicker;
      this.roomState.currentPick = data.pickNumber;
      this.roomState.isPaused = data.isPaused;
    }
  }

  private handleUserJoined(data: UserJoinMessage[&apos;data&apos;]): void {
}
    if (this.roomState) {
}
      this.roomState.participants.set(data.userId, {
}
        teamId: data.teamId,
        userId: data.userId,
        isOnline: true,
        lastSeen: data.timestamp
      });
    }
  }

  private handleUserLeft(data: UserLeaveMessage[&apos;data&apos;]): void {
}
    if (this.roomState) {
}
      const participant = this.roomState.participants.get(data.userId);
      if (participant) {
}
        participant.isOnline = false;
        participant.lastSeen = data.timestamp;
      }
    }
  }

  private handleChatMessage(data: DraftChatMessage[&apos;data&apos;]): void {
}
    if (this.roomState) {
}
      this.roomState.chatMessages.push({
}
        userId: data.userId,
        message: data.message,
        timestamp: data.timestamp,
        isTradeProposal: data.isTradeProposal
      });
      
      // Keep only last 100 messages
      if (this.roomState.chatMessages.length > 100) {
}
        this.roomState.chatMessages.shift();
      }
    }
  }

  private startHeartbeat(): void {
}
    this.heartbeatInterval = setInterval(() => {
}
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
}
        this.ws.send(JSON.stringify({ type: &apos;PING&apos; }));
      }
    }, 30000); // Send ping every 30 seconds
  }

  private attemptReconnect(): void {
}
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
}
      console.error(&apos;Max reconnection attempts reached&apos;);
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
}
      if (this.roomState) {
}
        this.connectToDraftRoom(this.roomState.leagueId, &apos;&apos;).catch(console.error);
      }
    }, delay);
  }

  private send(message: DraftWebSocketMessage | { type: string }): void {
}
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
}
      this.ws.send(JSON.stringify(message));
    } else {
}
      throw new Error(&apos;WebSocket is not connected&apos;);
    }
  }

  private emit(message: DraftWebSocketMessage): void {
}
    const callbacks = this.listeners.get(message.type);
    if (callbacks) {
}
      callbacks.forEach((callback: any) => {
}
        try {
}
          callback(message);
        } catch (error) {
}
          console.error(&apos;Error in WebSocket event callback:&apos;, error);
        }
      });
    }
  }
}

// Export singleton instance
export const draftWebSocketService = new DraftWebSocketService();
export default draftWebSocketService;
