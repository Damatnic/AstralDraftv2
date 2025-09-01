import { useState, useEffect, useCallback, useRef } from &apos;react&apos;;
import { draftWebSocketService, DraftWebSocketMessage, DraftRoomState } from &apos;../services/draftWebSocketService&apos;;

export interface UseDraftRoomOptions {
}
  leagueId: string;
  userId: string;
  teamId: number;
  autoConnect?: boolean;
}

export interface DraftRoomHookReturn {
}
  // Connection state
  isConnected: boolean;
  connectionStatus: &apos;CONNECTING&apos; | &apos;CONNECTED&apos; | &apos;DISCONNECTED&apos; | &apos;ERROR&apos;;
  
  // Room state
  roomState: DraftRoomState | null;
  participants: Array<{
}
    teamId: number;
    userId: string;
    isOnline: boolean;
    lastSeen: number;
  }>;
  
  // Draft state
  currentPick: number;
  currentRound: number;
  currentPicker: number;
  timeRemaining: number;
  isPaused: boolean;
  isMyTurn: boolean;
  
  // Picks and chat
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
  
  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  makePick: (playerId: number) => void;
  sendChatMessage: (message: string, isTradeProposal?: boolean) => void;
  toggleTimer: () => void;
  
  // Error handling
  error: string | null;
  clearError: () => void;
}

/**
 * Hook for managing real-time draft room functionality
 */
export function useDraftRoom(options: UseDraftRoomOptions): DraftRoomHookReturn {
}
  const { leagueId, userId, teamId, autoConnect = true } = options;
  
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<&apos;CONNECTING&apos; | &apos;CONNECTED&apos; | &apos;DISCONNECTED&apos; | &apos;ERROR&apos;>(&apos;DISCONNECTED&apos;);
  const [roomState, setRoomState] = useState<DraftRoomState | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const messageHandlersRef = useRef<Map<string, (message: DraftWebSocketMessage) => void>>(new Map());
  const connectionCheckInterval = useRef<NodeJS.Timeout | null>(null);

  // Connection management
  const connect = useCallback(async () => {
}
    try {
}

      setError(null);
      setConnectionStatus(&apos;CONNECTING&apos;);
      await draftWebSocketService.connectToDraftRoom(leagueId, userId);

    } catch (error) {
}
        console.error(error);
    } catch (err) {
}
      const errorMessage = err instanceof Error ? err.message : &apos;Failed to connect to draft room&apos;;
      setError(errorMessage);
      setConnectionStatus(&apos;ERROR&apos;);
      console.error(&apos;Draft room connection error:&apos;, err);
    }
  }, [leagueId, userId]);

  const disconnect = useCallback(() => {
}
    draftWebSocketService.disconnect();
    setConnectionStatus(&apos;DISCONNECTED&apos;);
    setIsConnected(false);
    setRoomState(null);
  }, []);

  // Draft actions
  const makePick = useCallback((playerId: number) => {
}
    try {
}

      if (!isConnected) {
}
        throw new Error(&apos;Not connected to draft room&apos;);
      }
      
      if (!roomState || roomState.currentPicker !== teamId) {
}
        throw new Error(&apos;It is not your turn to pick&apos;);
      }
      
      draftWebSocketService.sendPick(leagueId, teamId, playerId);
      setError(null);

    } catch (error) {
}
        console.error(error);
    } catch (err) {
}
      const errorMessage = err instanceof Error ? err.message : &apos;Failed to make pick&apos;;
      setError(errorMessage);
    }
  }, [isConnected, roomState, teamId, leagueId]);

  const sendChatMessage = useCallback((message: string, isTradeProposal = false) => {
}
    try {
}

      if (!isConnected) {
}
        throw new Error(&apos;Not connected to draft room&apos;);
      }
      
      draftWebSocketService.sendChatMessage(leagueId, userId, message, isTradeProposal);
      setError(null);

    } catch (error) {
}
        console.error(error);
    } catch (err) {
}
      const errorMessage = err instanceof Error ? err.message : &apos;Failed to send message&apos;;
      setError(errorMessage);
    }
  }, [isConnected, leagueId, userId]);

  const toggleTimer = useCallback(() => {
}
    try {
}

      if (!isConnected) {
}
        throw new Error(&apos;Not connected to draft room&apos;);
      }
      
      draftWebSocketService.toggleTimer(leagueId);
      setError(null);

    } catch (error) {
}
        console.error(error);
    } catch (err) {
}
      const errorMessage = err instanceof Error ? err.message : &apos;Failed to toggle timer&apos;;
      setError(errorMessage);
    }
  }, [isConnected, leagueId]);

  const clearError = useCallback(() => {
}
    setError(null);
  }, []);

  // Setup message handlers
  useEffect(() => {
}
    const handlers = new Map<string, (message: DraftWebSocketMessage) => void>();

    // Draft status handler
    handlers.set(&apos;DRAFT_STATUS&apos;, (message: any) => {
}
      if (message.type === &apos;DRAFT_STATUS&apos;) {
}
        setRoomState(draftWebSocketService.getRoomState());
        setConnectionStatus(&apos;CONNECTED&apos;);
        setIsConnected(true);
      }
    });

    // Pick made handler
    handlers.set(&apos;PICK_MADE&apos;, (message: any) => {
}
      if (message.type === &apos;PICK_MADE&apos;) {
}
        setRoomState(draftWebSocketService.getRoomState());
        
        // Play notification sound for picks
        if (&apos;serviceWorker&apos; in navigator && &apos;showNotification&apos; in window) {
}
          navigator.serviceWorker.ready.then(registration => {
}
            registration.showNotification(&apos;Draft Pick Made&apos;, {
}
              body: `Team ${message.data.teamId} selected a player`,
              icon: &apos;/favicon.svg&apos;,
              badge: &apos;/favicon.svg&apos;,
              tag: &apos;draft-pick&apos;
            });
          });
        }
      }
    });

    // Timer update handler
    handlers.set(&apos;TIMER_UPDATE&apos;, (message: any) => {
}
      if (message.type === &apos;TIMER_UPDATE&apos;) {
}
        setRoomState(draftWebSocketService.getRoomState());
        
        // Show notification when time is running low
        if (message.data.timeRemaining <= 30 && message.data.currentPicker === teamId) {
}
          if (&apos;serviceWorker&apos; in navigator && &apos;showNotification&apos; in window) {
}
            navigator.serviceWorker.ready.then(registration => {
}
              registration.showNotification(&apos;Your Pick Time is Running Out!&apos;, {
}
                body: `${message.data.timeRemaining} seconds remaining`,
                icon: &apos;/favicon.svg&apos;,
                badge: &apos;/favicon.svg&apos;,
                tag: &apos;draft-timer-warning&apos;,
                requireInteraction: true
              });
            });
          }
        }
      }
    });

    // User joined/left handlers
    handlers.set(&apos;USER_JOINED&apos;, () => {
}
      setRoomState(draftWebSocketService.getRoomState());
    });

    handlers.set(&apos;USER_LEFT&apos;, () => {
}
      setRoomState(draftWebSocketService.getRoomState());
    });

    // Chat message handler
    handlers.set(&apos;CHAT_MESSAGE&apos;, (message: any) => {
}
      if (message.type === &apos;CHAT_MESSAGE&apos;) {
}
        setRoomState(draftWebSocketService.getRoomState());
        
        // Show notification for trade proposals
        if (message.data.isTradeProposal && message.data.userId !== userId) {
}
          if (&apos;serviceWorker&apos; in navigator && &apos;showNotification&apos; in window) {
}
            navigator.serviceWorker.ready.then(registration => {
}
              registration.showNotification(&apos;Trade Proposal Received&apos;, {
}
                body: message.data.message,
                icon: &apos;/favicon.svg&apos;,
                badge: &apos;/favicon.svg&apos;,
                tag: &apos;trade-proposal&apos;
              });
            });
          }
        }
      }
    });

    // Register all handlers
    handlers.forEach((handler, eventType) => {
}
      draftWebSocketService.addEventListener(eventType as DraftWebSocketMessage[&apos;type&apos;], handler);
    });

    messageHandlersRef.current = handlers;

    return () => {
}
      // Cleanup handlers
      handlers.forEach((handler, eventType) => {
}
        draftWebSocketService.removeEventListener(eventType as DraftWebSocketMessage[&apos;type&apos;], handler);
      });
    };
  }, [teamId, userId]);

  // Auto-connect and connection monitoring
  useEffect(() => {
}
    if (autoConnect && leagueId && userId) {
}
      connect();
    }

    // Monitor connection status
    connectionCheckInterval.current = setInterval(() => {
}
      const status = draftWebSocketService.getConnectionStatus();
      setConnectionStatus(status);
      setIsConnected(status === &apos;CONNECTED&apos;);
    }, 1000);

    return () => {
}
      if (connectionCheckInterval.current) {
}
        clearInterval(connectionCheckInterval.current);
      }
    };
  }, [autoConnect, leagueId, userId, connect]);

  // Cleanup on unmount
  useEffect(() => {
}
    return () => {
}
      disconnect();
    };
  }, [disconnect]);

  // Derived state
  const participants = roomState ? Array.from(roomState.participants.values()) : [];
  const currentPick = roomState?.currentPick || 1;
  const currentRound = roomState?.currentRound || 1;
  const currentPicker = roomState?.currentPicker || 1;
  const timeRemaining = roomState?.timeRemaining || 0;
  const isPaused = roomState?.isPaused || false;
  const isMyTurn = roomState?.currentPicker === teamId;
  const picks = roomState?.picks || [];
  const chatMessages = roomState?.chatMessages || [];

  return {
}
    // Connection state
    isConnected,
    connectionStatus,
    
    // Room state
    roomState,
    participants,
    
    // Draft state
    currentPick,
    currentRound,
    currentPicker,
    timeRemaining,
    isPaused,
    isMyTurn,
    
    // Picks and chat
    picks,
    chatMessages,
    
    // Actions
    connect,
    disconnect,
    makePick,
    sendChatMessage,
    toggleTimer,
    
    // Error handling
    error,
//     clearError
  };
}

export default useDraftRoom;
