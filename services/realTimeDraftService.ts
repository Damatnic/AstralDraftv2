/**
 * Enhanced Real-Time Draft Service
 * Provides comprehensive WebSocket-based draft functionality with participant tracking,
 * live updates, pick notifications, and synchronized state management
 */

import { io, Socket } from &apos;socket.io-client&apos;;
import { DraftPick } from &apos;../types&apos;;
import { authService } from &apos;./authService&apos;;
import { dataPersistenceService } from &apos;./dataPersistenceService&apos;;

export interface DraftParticipant {
}
  userId: number;
  username: string;
  pickOrder: number;
  budget?: number;
  roster: DraftPick[];
  isOnline: boolean;
  lastActivity?: string;
}

export interface DraftRoom {
}
  id: string;
  leagueId: string;
  status: &apos;pending&apos; | &apos;active&apos; | &apos;paused&apos; | &apos;completed&apos;;
  currentPick: {
}
    round: number;
    pickNumber: number;
    teamId: number;
    timeRemaining: number;
  };
  participants: DraftParticipant[];
  picks: DraftPick[];
  settings: {
}
    rounds: number;
    timePerPick: number;
    draftType: &apos;snake&apos; | &apos;auction&apos;;
    pauseOnDisconnect: boolean;
    autoPickEnabled: boolean;
  };
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

export interface DraftEvent {
}
  type: &apos;pick_made&apos; | &apos;timer_update&apos; | &apos;participant_joined&apos; | &apos;participant_left&apos; | &apos;draft_paused&apos; | &apos;draft_resumed&apos; | &apos;chat_message&apos;;
  data: any;
  timestamp: string;
  userId?: number;
}

export interface DraftPickRequest {
}
  playerId: string;
  playerName: string;
  position: string;
  team: string;
}

export interface ChatMessage {
}
  id: string;
  userId: number;
  username: string;
  message: string;
  timestamp: string;
  type: &apos;message&apos; | &apos;system&apos; | &apos;pick_announcement&apos;;
}

class RealTimeDraftService {
}
  private socket: Socket | null = null;
  private currentDraftRoom: DraftRoom | null = null;
  private connectionAttempts = 0;
  private readonly maxConnectionAttempts = 3;
  private readonly listeners: Map<string, Function[]> = new Map();
  private isConnecting = false;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  constructor() {
}
    this.setupEventHandlers();
  }

  /**
   * Initialize connection to draft server
   */
  async connect(): Promise<void> {
}
    if (this.socket?.connected || this.isConnecting) {
}
      return;
    }

    const sessionToken = authService.getSessionToken();
    if (!sessionToken) {
}
      throw new Error(&apos;User not authenticated&apos;);
    }

    this.isConnecting = true;

    try {
}
      const serverUrl = (import.meta as any).env?.VITE_WEBSOCKET_URL || &apos;ws://localhost:3001&apos;;
      
      this.socket = io(serverUrl, {
}
        auth: {
}
          token: sessionToken
        },
        transports: [&apos;websocket&apos;, &apos;polling&apos;],
        timeout: 10000,
        retries: 3
      });

      await new Promise<void>((resolve, reject) => {
}
        const timeout = setTimeout(() => {
}
          reject(new Error(&apos;Connection timeout&apos;));
        }, 10000);

        this.socket!.on(&apos;connect&apos;, () => {
}
          clearTimeout(timeout);
          this.connectionAttempts = 0;
          this.isConnecting = false;
          console.log(&apos;✅ Connected to draft server&apos;);
          this.emit(&apos;connection_established&apos;);
          resolve();
        });

        this.socket!.on(&apos;connect_error&apos;, (error: any) => {
}
          clearTimeout(timeout);
          this.isConnecting = false;
          console.error(&apos;❌ Draft server connection failed:&apos;, error);
          reject(new Error(error instanceof Error ? error.message : &apos;Connection failed&apos;));
        });
      });

      this.setupSocketEventHandlers();
    } catch (error) {
}
      this.isConnecting = false;
      this.connectionAttempts++;
      
      if (this.connectionAttempts < this.maxConnectionAttempts) {
}
        console.log(`Retrying connection (${this.connectionAttempts}/${this.maxConnectionAttempts})...`);
        this.reconnectTimeout = setTimeout(() => this.connect(), 2000 * this.connectionAttempts);
      } else {
}
        console.error(&apos;Max connection attempts reached&apos;);
        throw error;
      }
    }
  }

  /**
   * Disconnect from draft server
   */
  disconnect(): void {
}
    if (this.reconnectTimeout) {
}
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.socket) {
}
      this.socket.disconnect();
      this.socket = null;
    }

    this.currentDraftRoom = null;
    this.connectionAttempts = 0;
    this.isConnecting = false;
    this.emit(&apos;connection_lost&apos;);
  }

  /**
   * Join a draft room
   */
  async joinDraftRoom(draftRoomId: string): Promise<DraftRoom> {
}
    if (!this.socket?.connected) {
}
      await this.connect();
    }

    return new Promise((resolve, reject) => {
}
      const timeout = setTimeout(() => {
}
        reject(new Error(&apos;Join room timeout&apos;));
      }, 5000);

      this.socket!.emit(&apos;join_draft_room&apos;, { draftRoomId }, (response: any) => {
}
        clearTimeout(timeout);
        
        if (response.success) {
}
          this.currentDraftRoom = response.room;
          this.emit(&apos;room_joined&apos;, response.room);
          resolve(response.room);
        } else {
}
          reject(new Error(response.error || &apos;Failed to join draft room&apos;));
        }
      });
    });
  }

  /**
   * Leave current draft room
   */
  async leaveDraftRoom(): Promise<void> {
}
    if (!this.socket?.connected || !this.currentDraftRoom) {
}
      return;
    }

    return new Promise((resolve, reject) => {
}
      const timeout = setTimeout(() => {
}
        reject(new Error(&apos;Leave room timeout&apos;));
      }, 3000);

      if (!this.currentDraftRoom) {
}
        return reject(new Error(&apos;Not in a draft room.&apos;));
      }
      this.socket?.emit(&apos;leave_draft_room&apos;, { draftRoomId: this.currentDraftRoom.id }, (response: any) => {
}
        clearTimeout(timeout);
        
        if (response.success) {
}
          this.currentDraftRoom = null;
          this.emit(&apos;room_left&apos;);
          resolve();
        } else {
}
          reject(new Error(response.error || &apos;Failed to leave draft room&apos;));
        }
      });
    });
  }

  /**
   * Make a draft pick
   */
  async makePick(pickRequest: DraftPickRequest): Promise<void> {
}
    if (!this.socket?.connected || !this.currentDraftRoom) {
}
      throw new Error(&apos;Not connected to draft room&apos;);
    }

    return new Promise((resolve, reject) => {
}
      const timeout = setTimeout(() => {
}
        reject(new Error(&apos;Pick timeout&apos;));
      }, 5000);

      if (!this.currentDraftRoom) {
}
        return reject(new Error(&apos;Not in a draft room.&apos;));
      }
      this.socket?.emit(&apos;make_pick&apos;, {
}
        draftRoomId: this.currentDraftRoom.id,
        pick: pickRequest
      }, (response: any) => {
}
        clearTimeout(timeout);
        
        if (response.success) {
}
          // Save pick to local storage
          this.saveDraftPickLocally(response.pick);
          resolve();
        } else {
}
          reject(new Error(response.error || &apos;Failed to make pick&apos;));
        }
      });
    });
  }

  /**
   * Set auto-pick preferences
   */
  async setAutoPick(enabled: boolean, playerQueue: string[] = []): Promise<void> {
}
    if (!this.socket?.connected || !this.currentDraftRoom) {
}
      throw new Error(&apos;Not connected to draft room&apos;);
    }

    return new Promise((resolve, reject) => {
}
      if (!this.currentDraftRoom) {
}
        return reject(new Error(&apos;Not in a draft room.&apos;));
      }
      this.socket?.emit(&apos;set_auto_pick&apos;, {
}
        draftRoomId: this.currentDraftRoom.id,
        enabled,
//         playerQueue
      }, (response: any) => {
}
        if (response.success) {
}
          resolve();
        } else {
}
          reject(new Error(response.error || &apos;Failed to set auto pick&apos;));
        }
      });
    });
  }

  /**
   * Send chat message
   */
  async sendChatMessage(message: string): Promise<void> {
}
    if (!this.socket?.connected || !this.currentDraftRoom) {
}
      throw new Error(&apos;Not connected to draft room&apos;);
    }

    if (!this.currentDraftRoom) {
}
      throw new Error(&apos;Not in a draft room.&apos;);
    }
    this.socket.emit(&apos;chat_message&apos;, {
}
      draftRoomId: this.currentDraftRoom.id,
//       message
    });
  }

  /**
   * Pause/Resume draft (commissioners only)
   */
  async pauseDraft(paused: boolean): Promise<void> {
}
    if (!this.socket?.connected || !this.currentDraftRoom) {
}
      throw new Error(&apos;Not connected to draft room&apos;);
    }

    return new Promise((resolve, reject) => {
}
      if (!this.currentDraftRoom) {
}
        return reject(new Error(&apos;Not in a draft room.&apos;));
      }
      this.socket?.emit(&apos;pause_draft&apos;, {
}
        draftRoomId: this.currentDraftRoom.id,
//         paused
      }, (response: any) => {
}
        if (response.success) {
}
          resolve();
        } else {
}
          reject(new Error(response.error || &apos;Failed to pause/resume draft&apos;));
        }
      });
    });
  }

  /**
   * Get current draft room state
   */
  getCurrentDraftRoom(): DraftRoom | null {
}
    return this.currentDraftRoom;
  }

  /**
   * Check if connected to a draft room
   */
  isInDraftRoom(): boolean {
}
    return this.currentDraftRoom !== null && this.socket?.connected === true;
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): &apos;connected&apos; | &apos;connecting&apos; | &apos;disconnected&apos; {
}
    if (this.socket?.connected) return &apos;connected&apos;;
    if (this.isConnecting) return &apos;connecting&apos;;
    return &apos;disconnected&apos;;
  }

  /**
   * Setup socket event handlers
   */
  private setupSocketEventHandlers(): void {
}
    if (!this.socket) return;

    // Draft events
    this.socket.on(&apos;draft_event&apos;, (event: DraftEvent) => {
}
      this.handleDraftEvent(event);
    });

    // Pick made
    this.socket.on(&apos;pick_made&apos;, (data: { pick: DraftPick; room: DraftRoom }) => {
}
      this.currentDraftRoom = data.room;
      this.saveDraftPickLocally(data.pick);
      this.emit(&apos;pick_made&apos;, data);
    });

    // Timer updates
    this.socket.on(&apos;timer_update&apos;, (data: { timeRemaining: number }) => {
}
      if (this.currentDraftRoom) {
}
        this.currentDraftRoom.currentPick.timeRemaining = data.timeRemaining;
        this.emit(&apos;timer_update&apos;, data);
      }
    });

    // Participant updates
    this.socket.on(&apos;participant_update&apos;, (data: { participants: DraftParticipant[] }) => {
}
      if (this.currentDraftRoom) {
}
        this.currentDraftRoom.participants = data.participants;
        this.emit(&apos;participants_updated&apos;, data);
      }
    });

    // Chat messages
    this.socket.on(&apos;chat_message&apos;, (message: ChatMessage) => {
}
      this.emit(&apos;chat_message&apos;, message);
    });

    // Draft status changes
    this.socket.on(&apos;draft_status_changed&apos;, (data: { status: DraftRoom[&apos;status&apos;]; room: DraftRoom }) => {
}
      this.currentDraftRoom = data.room;
      this.emit(&apos;draft_status_changed&apos;, data);
    });

    // Error handling
    this.socket.on(&apos;error&apos;, (error: any) => {
}
      console.error(&apos;Draft socket error:&apos;, error);
      this.emit(&apos;error&apos;, error);
    });

    // Disconnection handling
    this.socket.on(&apos;disconnect&apos;, (reason: string) => {
}
      console.log(&apos;Disconnected from draft server:&apos;, reason);
      this.emit(&apos;disconnected&apos;, { reason });
      
      // Attempt to reconnect if not intentional
      if (reason === &apos;io server disconnect&apos;) {
}
        setTimeout(() => this.connect(), 2000);
      }
    });
  }

  /**
   * Handle incoming draft events
   */
  private handleDraftEvent(event: DraftEvent): void {
}
    console.log(&apos;Draft event received:&apos;, event);
    
    switch (event.type) {
}
      case &apos;pick_made&apos;:
        this.saveDraftPickLocally(event.data.pick);
        break;
      case &apos;draft_paused&apos;:
      case &apos;draft_resumed&apos;:
        if (this.currentDraftRoom) {
}
          this.currentDraftRoom.status = event.data.status;
        }
        break;
    }

    this.emit(&apos;draft_event&apos;, event);
  }

  /**
   * Save draft pick to local storage
   */
  private async saveDraftPickLocally(pick: DraftPick): Promise<void> {
}
    try {
}
      const service = await dataPersistenceService;
      
      // Save individual pick analytics data
      const analyticsData = {
}
        id: `pick_${pick.playerId}_${Date.now()}`,
        userId: authService.getCurrentUser()?.id || 0,
        type: &apos;draft_performance&apos; as const,
        data: {
}
          pick,
          draftRoomId: this.currentDraftRoom?.id,
          timestamp: new Date().toISOString()
        },
        season: 2024,
        createdAt: new Date().toISOString()
      };

      await service.saveAnalyticsData(analyticsData);
      console.log(&apos;✅ Draft pick saved locally:&apos;, pick);
    } catch (error) {
}
      console.error(&apos;Failed to save draft pick locally:&apos;, error);
    }
  }

  /**
   * Setup general event handlers
   */
  private setupEventHandlers(): void {
}
    // Handle browser visibility changes
    document.addEventListener(&apos;visibilitychange&apos;, () => {
}
      if (document.visibilityState === &apos;visible&apos; && this.currentDraftRoom && !this.socket?.connected) {
}
        console.log(&apos;Tab became visible, reconnecting to draft...&apos;);
        this.connect();
      }
    });

    // Handle before unload
    window.addEventListener(&apos;beforeunload&apos;, () => {
}
      if (this.currentDraftRoom) {
}
        this.leaveDraftRoom();
      }
    });
  }

  /**
   * Event emitter functionality
   */
  on(event: string, callback: Function): void {
}
    if (!this.listeners.has(event)) {
}
      this.listeners.set(event, []);
    }
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
}
      eventListeners.push(callback);
    }
  }

  off(event: string, callback: Function): void {
}
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
}
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
}
        eventListeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any): void {
}
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
}
      eventListeners.forEach((callback: any) => callback(data));
    }
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
}
    this.disconnect();
    this.listeners.clear();
    
    // Remove event listeners
    document.removeEventListener(&apos;visibilitychange&apos;, this.setupEventHandlers);
    window.removeEventListener(&apos;beforeunload&apos;, this.setupEventHandlers);
  }
}

export const realTimeDraftService = new RealTimeDraftService();
export default realTimeDraftService;
