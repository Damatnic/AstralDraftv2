import { useState, useEffect, useCallback, useRef } from &apos;react&apos;;
import { realTimeDraftService, DraftRoom, DraftEvent, DraftPickRequest, ChatMessage, DraftParticipant } from &apos;../services/realTimeDraftService&apos;;
import { DraftPick } from &apos;../types&apos;;
import { useAuth } from &apos;../contexts/AuthContext&apos;;

export interface UseEnhancedRealTimeDraftOptions {
}
  autoConnect?: boolean;
  autoReconnect?: boolean;
}

export interface EnhancedRealTimeDraftState {
}
  isConnected: boolean;
  isConnecting: boolean;
  draftRoom: DraftRoom | null;
  isInRoom: boolean;
  connectionStatus: &apos;connected&apos; | &apos;connecting&apos; | &apos;disconnected&apos;;
  error: string | null;
  participants: DraftParticipant[];
  picks: DraftPick[];
  chatMessages: ChatMessage[];
  currentPick: DraftRoom[&apos;currentPick&apos;] | null;
  isMyTurn: boolean;
  myParticipant: DraftParticipant | null;
}

export function useEnhancedRealTimeDraft(options: UseEnhancedRealTimeDraftOptions = {}) {
}
  const { user } = useAuth();
  const { autoConnect = false, autoReconnect = true } = options;
  
  const [state, setState] = useState<EnhancedRealTimeDraftState>({
}
    isConnected: false,
    isConnecting: false,
    draftRoom: null,
    isInRoom: false,
    connectionStatus: &apos;disconnected&apos;,
    error: null,
    participants: [],
    picks: [],
    chatMessages: [],
    currentPick: null,
    isMyTurn: false,
    myParticipant: null
  });

  const eventListenersRef = useRef<Array<{ event: string; callback: Function }>>([]);

  // Initialize connection on mount if autoConnect is enabled
  useEffect(() => {
}
    if (autoConnect && user) {
}
      connect();
    }

    return () => {
}
      disconnect();
    };
  }, [autoConnect, user]);

  // Setup event listeners
  useEffect(() => {
}
    const listeners = [
      { event: &apos;connection_established&apos;, callback: handleConnectionEstablished },
      { event: &apos;connection_lost&apos;, callback: handleConnectionLost },
      { event: &apos;room_joined&apos;, callback: handleRoomJoined },
      { event: &apos;room_left&apos;, callback: handleRoomLeft },
      { event: &apos;pick_made&apos;, callback: handlePickMade },
      { event: &apos;timer_update&apos;, callback: handleTimerUpdate },
      { event: &apos;participants_updated&apos;, callback: handleParticipantsUpdated },
      { event: &apos;chat_message&apos;, callback: handleChatMessage },
      { event: &apos;draft_status_changed&apos;, callback: handleDraftStatusChanged },
      { event: &apos;draft_event&apos;, callback: handleDraftEvent },
      { event: &apos;error&apos;, callback: handleError },
      { event: &apos;disconnected&apos;, callback: handleDisconnected }
    ];

    // Add event listeners
    listeners.forEach(({ event, callback }: any) => {
}
      realTimeDraftService.on(event, callback);
    });

    eventListenersRef.current = listeners;

    return () => {
}
      // Remove event listeners
      eventListenersRef.current.forEach(({ event, callback }: any) => {
}
        realTimeDraftService.off(event, callback);
      });
    };
  }, []);

  // Update connection status periodically
  useEffect(() => {
}
    const interval = setInterval(() => {
}
      const status = realTimeDraftService.getConnectionStatus();
      const room = realTimeDraftService.getCurrentDraftRoom();
      const inRoom = realTimeDraftService.isInDraftRoom();
      
      setState(prev => ({
}
        ...prev,
        connectionStatus: status,
        isConnected: status === &apos;connected&apos;,
        isConnecting: status === &apos;connecting&apos;,
        draftRoom: room,
        isInRoom: inRoom,
        currentPick: room?.currentPick || null,
        isMyTurn: room ? isUserTurn(room, user?.id) : false,
        myParticipant: room && user ? room.participants.find((p: any) => p.userId === user.id) || null : null
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [user]);

  // Event handlers
  const handleConnectionEstablished = useCallback(() => {
}
    setState(prev => ({
}
      ...prev,
      isConnected: true,
      isConnecting: false,
      connectionStatus: &apos;connected&apos;,
      error: null
    }));
  }, []);

  const handleConnectionLost = useCallback(() => {
}
    setState(prev => ({
}
      ...prev,
      isConnected: false,
      isConnecting: false,
      connectionStatus: &apos;disconnected&apos;
    }));

    if (autoReconnect) {
}
      setTimeout(() => connect(), 2000);
    }
  }, [autoReconnect]);

  const handleRoomJoined = useCallback((room: DraftRoom) => {
}
    setState(prev => ({
}
      ...prev,
      draftRoom: room,
      isInRoom: true,
      participants: room.participants,
      picks: room.picks,
      currentPick: room.currentPick,
      isMyTurn: isUserTurn(room, user?.id),
      myParticipant: user ? room.participants.find((p: any) => p.userId === user.id) || null : null,
      error: null
    }));
  }, [user]);

  const handleRoomLeft = useCallback(() => {
}
    setState(prev => ({
}
      ...prev,
      draftRoom: null,
      isInRoom: false,
      participants: [],
      picks: [],
      currentPick: null,
      isMyTurn: false,
      myParticipant: null
    }));
  }, []);

  const handlePickMade = useCallback((data: { pick: DraftPick; room: DraftRoom }) => {
}
    setState(prev => ({
}
      ...prev,
      draftRoom: data.room,
      picks: data.room.picks,
      participants: data.room.participants,
      currentPick: data.room.currentPick,
      isMyTurn: isUserTurn(data.room, user?.id),
      myParticipant: user ? data.room.participants.find((p: any) => p.userId === user.id) || null : null
    }));

    // Add system message for pick
    const participant = data.room.participants.find((p: any) => p.userId === data.pick.teamId);
    const pickMessage: ChatMessage = {
}
      id: `pick_${Date.now()}`,
      userId: data.pick.teamId,
      username: participant?.username || &apos;Unknown&apos;,
      message: `Made pick #${data.pick.overall} in round ${data.pick.round}`,
      timestamp: new Date().toISOString(),
      type: &apos;pick_announcement&apos;
    };

    setState(prev => ({
}
      ...prev,
      chatMessages: [...prev.chatMessages, pickMessage]
    }));
  }, [user]);

  const handleTimerUpdate = useCallback((data: { timeRemaining: number }) => {
}
    setState(prev => ({
}
      ...prev,
      currentPick: prev.currentPick ? {
}
        ...prev.currentPick,
        timeRemaining: data.timeRemaining
      } : null
    }));
  }, []);

  const handleParticipantsUpdated = useCallback((data: { participants: DraftParticipant[] }) => {
}
    setState(prev => ({
}
      ...prev,
      participants: data.participants,
      myParticipant: user ? data.participants.find((p: any) => p.userId === user.id) || null : null
    }));
  }, [user]);

  const handleChatMessage = useCallback((message: ChatMessage) => {
}
    setState(prev => ({
}
      ...prev,
      chatMessages: [...prev.chatMessages, message]
    }));
  }, []);

  const handleDraftStatusChanged = useCallback((data: { status: DraftRoom[&apos;status&apos;]; room: DraftRoom }) => {
}
    setState(prev => ({
}
      ...prev,
      draftRoom: data.room,
      participants: data.room.participants,
      picks: data.room.picks,
      currentPick: data.room.currentPick,
      isMyTurn: isUserTurn(data.room, user?.id)
    }));
  }, [user]);

  const handleDraftEvent = useCallback((event: DraftEvent) => {
}
    console.log(&apos;Draft event received:&apos;, event);
    // Handle specific draft events as needed
  }, []);

  const handleError = useCallback((error: any) => {
}
    setState(prev => ({
}
      ...prev,
      error: error instanceof Error ? error.message : &apos;An error occurred&apos;
    }));
  }, []);

  const handleDisconnected = useCallback((data: { reason: string }) => {
}
    setState(prev => ({
}
      ...prev,
      isConnected: false,
      connectionStatus: &apos;disconnected&apos;,
      error: `Disconnected: ${data.reason}`
    }));
  }, []);

  // Helper function to determine if it&apos;s the user&apos;s turn
  const isUserTurn = (room: DraftRoom, userId?: number): boolean => {
}
    if (!userId || !room.currentPick) return false;
    return room.currentPick.teamId === userId;
  };

  // Public methods
  const connect = useCallback(async () => {
}
    if (state.isConnected || state.isConnecting) return;

    setState(prev => ({ ...prev, isConnecting: true, error: null }));
    
    try {
}

      await realTimeDraftService.connect();
    
    } catch (error) {
}
        console.error(error);
    } catch (error) {
}
      setState(prev => ({
}
        ...prev,
        isConnecting: false,
        error: error instanceof Error ? error.message : &apos;Failed to connect&apos;
      }));
      throw error;
    }
  }, [state.isConnected, state.isConnecting]);

  const disconnect = useCallback(() => {
}
    realTimeDraftService.disconnect();
    setState(prev => ({
}
      ...prev,
      isConnected: false,
      isConnecting: false,
      connectionStatus: &apos;disconnected&apos;,
      draftRoom: null,
      isInRoom: false,
      participants: [],
      picks: [],
      chatMessages: [],
      currentPick: null,
      isMyTurn: false,
      myParticipant: null
    }));
  }, []);

  const joinDraftRoom = useCallback(async (draftRoomId: string) => {
}
    setState(prev => ({ ...prev, error: null }));
    
    try {
}

      const room = await realTimeDraftService.joinDraftRoom(draftRoomId);
      return room;
    
    } catch (error) {
}
        console.error(error);
    } catch (error) {
}
      setState(prev => ({
}
        ...prev,
        error: error instanceof Error ? error.message : &apos;Failed to join draft room&apos;
      }));
      throw error;
    }
  }, []);

  const leaveDraftRoom = useCallback(async () => {
}
    setState(prev => ({ ...prev, error: null }));
    
    try {
}

      await realTimeDraftService.leaveDraftRoom();
    
    } catch (error) {
}
        console.error(error);
    } catch (error) {
}
      setState(prev => ({
}
        ...prev,
        error: error instanceof Error ? error.message : &apos;Failed to leave draft room&apos;
      }));
      throw error;
    }
  }, []);

  const makePick = useCallback(async (pickRequest: DraftPickRequest) => {
}
    setState(prev => ({ ...prev, error: null }));
    
    try {
}

      await realTimeDraftService.makePick(pickRequest);
    
    } catch (error) {
}
        console.error(error);
    } catch (error) {
}
      setState(prev => ({
}
        ...prev,
        error: error instanceof Error ? error.message : &apos;Failed to make pick&apos;
      }));
      throw error;
    }
  }, []);

  const setAutoPick = useCallback(async (enabled: boolean, playerQueue: string[] = []) => {
}
    setState(prev => ({ ...prev, error: null }));
    
    try {
}

      await realTimeDraftService.setAutoPick(enabled, playerQueue);
    
    } catch (error) {
}
        console.error(error);
    } catch (error) {
}
      setState(prev => ({
}
        ...prev,
        error: error instanceof Error ? error.message : &apos;Failed to set auto pick&apos;
      }));
      throw error;
    }
  }, []);

  const sendChatMessage = useCallback(async (message: string) => {
}
    setState(prev => ({ ...prev, error: null }));
    
    try {
}

      await realTimeDraftService.sendChatMessage(message);
    
    } catch (error) {
}
        console.error(error);
    } catch (error) {
}
      setState(prev => ({
}
        ...prev,
        error: error instanceof Error ? error.message : &apos;Failed to send message&apos;
      }));
      throw error;
    }
  }, []);

  const pauseDraft = useCallback(async (paused: boolean) => {
}
    setState(prev => ({ ...prev, error: null }));
    
    try {
}

      await realTimeDraftService.pauseDraft(paused);
    
    } catch (error) {
}
        console.error(error);
    } catch (error) {
}
      setState(prev => ({
}
        ...prev,
        error: error instanceof Error ? error.message : &apos;Failed to pause/resume draft&apos;
      }));
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
}
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const clearChatMessages = useCallback(() => {
}
    setState(prev => ({ ...prev, chatMessages: [] }));
  }, []);

  return {
}
    // State
    ...state,
    
    // Connection methods
    connect,
    disconnect,
    
    // Room methods
    joinDraftRoom,
    leaveDraftRoom,
    
    // Draft actions
    makePick,
    setAutoPick,
    pauseDraft,
    
    // Chat methods
    sendChatMessage,
    clearChatMessages,
    
    // Utility methods
//     clearError
  };
}

export default useEnhancedRealTimeDraft;
