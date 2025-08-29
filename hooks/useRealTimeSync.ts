/**
 * Real-Time Sync Hook
 * Advanced real-time synchronization system for multiplayer fantasy football
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// Enhanced interfaces for real-time synchronization
export interface SyncState {
  isConnected: boolean;
  isReconnecting: boolean;
  connectionAttempts: number;
  lastSyncAt: number;
  pendingChanges: number;
  syncStatus: 'idle' | 'syncing' | 'error' | 'offline';
  latency: number;
}

export interface SyncMessage {
  id: string;
  type: 'sync' | 'heartbeat' | 'update' | 'conflict' | 'initial';
  timestamp: number;
  userId: string;
  data: Record<string, unknown>;
  priority: 'low' | 'medium' | 'high';
}

export interface ConflictResolution {
  strategy: 'last_write_wins' | 'merge' | 'manual';
  localVersion: number;
  remoteVersion: number;
  resolvedData: Record<string, unknown>;
}

export interface OfflineChange {
  id: string;
  action: 'create' | 'update' | 'delete';
  resourceType: string;
  resourceId: string;
  data: Record<string, unknown>;
  timestamp: number;
  retryCount: number;
}

export interface SyncConfig {
  endpoint: string;
  heartbeatInterval: number;
  reconnectDelay: number;
  maxReconnectAttempts: number;
  enableOfflineMode: boolean;
  conflictResolution: 'last_write_wins' | 'merge' | 'manual';
  batchSize: number;
}

// Default configuration
const DEFAULT_SYNC_CONFIG: SyncConfig = {
  endpoint: process.env.REACT_APP_WS_ENDPOINT || 'ws://localhost:8080',
  heartbeatInterval: 30000,
  reconnectDelay: 1000,
  maxReconnectAttempts: 5,
  enableOfflineMode: true,
  conflictResolution: 'last_write_wins',
  batchSize: 10
};

/**
 * Main real-time sync hook
 */
export function useRealTimeSync(config: Partial<SyncConfig> = {}) {
  const mergedConfig = useMemo(() => ({ 
    ...DEFAULT_SYNC_CONFIG, 
    ...config 
  }), [config]);

  const [state, setState] = useState<SyncState>({
    isConnected: false,
    isReconnecting: false,
    connectionAttempts: 0,
    lastSyncAt: 0,
    pendingChanges: 0,
    syncStatus: 'idle',
    latency: 0
  });

  const [offlineChanges, setOfflineChanges] = useState<OfflineChange[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectRef = useRef<NodeJS.Timeout | null>(null);
  const messageQueueRef = useRef<SyncMessage[]>([]);

  // Connection management
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    setState(prev => ({ 
      ...prev, 
      isReconnecting: true,
      syncStatus: 'syncing'
    }));

    try {
      wsRef.current = new WebSocket(mergedConfig.endpoint);

      wsRef.current.onopen = () => {
        setState(prev => ({
          ...prev,
          isConnected: true,
          isReconnecting: false,
          connectionAttempts: 0,
          syncStatus: 'idle'
        }));

        // Start heartbeat
        startHeartbeat();
        
        // Process offline changes
        processOfflineChanges();
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: SyncMessage = JSON.parse(event.data);
          handleMessage(message);
        } catch {
          setState(prev => ({
            ...prev,
            syncStatus: 'error'
          }));
        }
      };

      wsRef.current.onclose = () => {
        setState(prev => ({
          ...prev,
          isConnected: false,
          syncStatus: 'offline'
        }));

        stopHeartbeat();
        scheduleReconnect();
      };

      wsRef.current.onerror = () => {
        setState(prev => ({
          ...prev,
          syncStatus: 'error'
        }));
      };

    } catch {
      setState(prev => ({
        ...prev,
        isReconnecting: false,
        syncStatus: 'error'
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    stopHeartbeat();
    clearReconnectTimer();
    
    setState(prev => ({
      ...prev,
      isConnected: false,
      isReconnecting: false,
      syncStatus: 'offline'
    }));
  }, []);

  // Heartbeat management
  const startHeartbeat = useCallback(() => {
    stopHeartbeat();
    
    heartbeatRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        const heartbeat: SyncMessage = {
          id: `heartbeat_${Date.now()}`,
          type: 'heartbeat',
          timestamp: Date.now(),
          userId: 'current_user',
          data: {},
          priority: 'low'
        };
        
        sendMessage(heartbeat);
      }
    }, mergedConfig.heartbeatInterval);
  }, []);

  const stopHeartbeat = useCallback(() => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
  }, []);

  // Reconnection management
  const scheduleReconnect = useCallback(() => {
    if (state.connectionAttempts >= mergedConfig.maxReconnectAttempts) {
      setState(prev => ({ ...prev, syncStatus: 'error' }));
      return;
    }

    const delay = mergedConfig.reconnectDelay * Math.pow(2, state.connectionAttempts);
    
    reconnectRef.current = setTimeout(() => {
      setState(prev => ({
        ...prev,
        connectionAttempts: prev.connectionAttempts + 1
      }));
      
      connect();
    }, delay);
  }, [state.connectionAttempts, mergedConfig.maxReconnectAttempts, mergedConfig.reconnectDelay, connect]);

  const clearReconnectTimer = useCallback(() => {
    if (reconnectRef.current) {
      clearTimeout(reconnectRef.current);
      reconnectRef.current = null;
    }
  }, []);

  // Message handling
  const handleMessage = useCallback((message: SyncMessage) => {
    const latency = Date.now() - message.timestamp;
    
    setState(prev => ({
      ...prev,
      lastSyncAt: Date.now(),
      latency: Math.round((prev.latency + latency) / 2) // Moving average
    }));

    switch (message.type) {
      case 'initial':
        handleInitialSync(message);
        break;
      case 'update':
        handleSyncEvent(message);
        break;
      case 'conflict':
        handleConflictNotification(message);
        break;
      case 'heartbeat':
        handlePong(message);
        break;
      case 'sync':
        handleOfflineSync(message);
        break;
      default:
        // Unknown message type
        break;
    }
  }, []);

  const handleInitialSync = useCallback((_message: SyncMessage) => {
    // Handle initial sync data
    setState(prev => ({
      ...prev,
      syncStatus: 'idle',
      lastSyncAt: Date.now()
    }));
  }, []);

  const handleSyncEvent = useCallback((_message: SyncMessage) => {
    // Handle real-time updates
    setState(prev => ({
      ...prev,
      lastSyncAt: Date.now()
    }));
  }, []);

  const handleConflictNotification = useCallback((message: SyncMessage) => {
    // Handle conflict resolution
    const resolution: ConflictResolution = {
      strategy: mergedConfig.conflictResolution,
      localVersion: 1,
      remoteVersion: 2,
      resolvedData: message.data
    };

    // Apply conflict resolution strategy
    if (resolution.strategy === 'last_write_wins') {
      // Accept remote changes
      setState(prev => ({
        ...prev,
        lastSyncAt: Date.now()
      }));
    }
  }, [mergedConfig.conflictResolution]);

  const handlePong = useCallback((message: SyncMessage) => {
    // Handle heartbeat response
    const latency = Date.now() - message.timestamp;
    setState(prev => ({
      ...prev,
      latency: latency
    }));
  }, []);

  const handleOfflineSync = useCallback((_message: SyncMessage) => {
    // Handle offline sync completion
    setState(prev => ({
      ...prev,
      pendingChanges: Math.max(0, prev.pendingChanges - 1),
      lastSyncAt: Date.now()
    }));
  }, []);

  // Message sending
  const sendMessage = useCallback((message: SyncMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify(message));
        return true;
      } catch {
        // Message send failed
        return false;
      }
    }
    
    // Queue message for later
    messageQueueRef.current.push(message);
    return false;
  }, []);

  const queueChange = useCallback((change: Omit<OfflineChange, 'id' | 'timestamp' | 'retryCount'>) => {
    const offlineChange: OfflineChange = {
      ...change,
      id: `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retryCount: 0
    };

    setOfflineChanges(prev => [...prev, offlineChange]);
    
    setState(prev => ({
      ...prev,
      pendingChanges: prev.pendingChanges + 1
    }));
  }, []);

  const syncChange = useCallback((change: OfflineChange) => {
    const message: SyncMessage = {
      id: change.id,
      type: 'sync',
      timestamp: Date.now(),
      userId: 'current_user',
      data: {
        action: change.action,
        resourceType: change.resourceType,
        resourceId: change.resourceId,
        data: change.data
      },
      priority: 'medium'
    };

    const sent = sendMessage(message);
    
    if (sent) {
      // Remove from offline queue
      setOfflineChanges(prev => prev.filter(c => c.id !== change.id));
    } else {
      // Increment retry count
      setOfflineChanges(prev => 
        prev.map(c => 
          c.id === change.id 
            ? { ...c, retryCount: c.retryCount + 1 }
            : c
        )
      );
    }
  }, [sendMessage]);

  const processOfflineChanges = useCallback(() => {
    if (!state.isConnected || offlineChanges.length === 0) return;

    // Process changes in batches
    const batch = offlineChanges.slice(0, mergedConfig.batchSize);
    
    batch.forEach(change => {
      if (change.retryCount < 3) {
        syncChange(change);
      } else {
        // Remove failed changes after 3 retries
        setOfflineChanges(prev => prev.filter(c => c.id !== change.id));
        setState(prev => ({
          ...prev,
          pendingChanges: Math.max(0, prev.pendingChanges - 1)
        }));
      }
    });
  }, [state.isConnected, offlineChanges, mergedConfig.batchSize, syncChange]);

  // Sync operations
  const forceSync = useCallback(() => {
    if (!state.isConnected) {
      connect();
      return;
    }

    processOfflineChanges();
    
    // Send sync request
    const syncMessage: SyncMessage = {
      id: `sync_${Date.now()}`,
      type: 'sync',
      timestamp: Date.now(),
      userId: 'current_user',
      data: { force: true },
      priority: 'high'
    };
    
    sendMessage(syncMessage);
  }, [state.isConnected, connect, processOfflineChanges, sendMessage]);

  // Initialize connection
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, []);

  // Process offline changes when connection is restored
  useEffect(() => {
    if (state.isConnected && offlineChanges.length > 0) {
      processOfflineChanges();
    }
  }, [state.isConnected, offlineChanges.length]);

  return {
    state,
    offlineChanges: offlineChanges.length,
    connect,
    disconnect,
    sendMessage,
    queueChange,
    forceSync,
    isOnline: state.isConnected,
    isPending: state.pendingChanges > 0
  };
}

/**
 * Hook for offline detection
 */
export function useOfflineDetection() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOffline;
}

export default {
  useRealTimeSync,
  useOfflineDetection
};
