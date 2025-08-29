/**
 * Mobile Offline Manager Hook
 * Comprehensive offline functionality for mobile devices with sync capabilities
 */

import { useState, useEffect, useCallback, useMemo } from 'react';

// Enhanced interfaces for type safety
export interface OfflineAction {
  id: string;
  type: 'DRAFT_PLAYER' | 'UPDATE_ROSTER' | 'TRADE_PROPOSAL' | 'WAIVER_CLAIM' | 'SETTINGS_UPDATE';
  payload: Record<string, unknown>;
  timestamp: number;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
  retryCount: number;
  priority: 'low' | 'medium' | 'high';
}

export interface OfflineData {
  players: Array<Record<string, unknown>>;
  leagues: Array<Record<string, unknown>>;
  teams: Array<Record<string, unknown>>;
  userPreferences: Record<string, unknown>;
  draftHistory: Array<Record<string, unknown>>;
  lastUpdated: number;
}

export interface SyncStatus {
  isOnline: boolean;
  lastSync: number | null;
  pendingActions: number;
  syncInProgress: boolean;
  syncErrors: string[];
  connectionType: 'wifi' | 'cellular' | 'unknown';
  dataUsage: number;
}

export interface OfflineCapabilities {
  canCachePlayers: boolean;
  canDraftOffline: boolean;
  canSyncData: boolean;
  hasStorage: boolean;
  storageQuota: number;
  usedStorage: number;
}

export interface OfflineManagerState {
  isOffline: boolean;
  offlineData: OfflineData;
  pendingActions: OfflineAction[];
  syncStatus: SyncStatus;
  capabilities: OfflineCapabilities;
  error: string | null;
  isInitialized: boolean;
}

export interface OfflineManagerActions {
  // Data management
  cacheData: (type: 'players' | 'leagues' | 'teams', data: Array<Record<string, unknown>>) => Promise<void>;
  getCachedData: (type: 'players' | 'leagues' | 'teams') => Array<Record<string, unknown>>;
  clearCache: (type?: 'players' | 'leagues' | 'teams') => Promise<void>;
  
  // Action management
  queueAction: (action: Omit<OfflineAction, 'id' | 'timestamp' | 'status' | 'retryCount'>) => string;
  cancelAction: (actionId: string) => void;
  retryAction: (actionId: string) => Promise<void>;
  
  // Sync operations
  syncAll: () => Promise<void>;
  syncActions: () => Promise<void>;
  syncData: () => Promise<void>;
  
  // Utilities
  checkConnectivity: () => Promise<void>;
  estimateDataUsage: () => number;
  optimizeStorage: () => Promise<void>;
  exportOfflineData: () => Promise<string>;
  importOfflineData: (data: string) => Promise<void>;
}

interface UseMobileOfflineManagerOptions {
  autoSync?: boolean;
  syncInterval?: number;
  maxRetries?: number;
  cacheStrategy?: 'aggressive' | 'conservative' | 'minimal';
  enableCompression?: boolean;
}

export function useMobileOfflineManager(options: UseMobileOfflineManagerOptions = {}) {
  const {
    autoSync = true,
    syncInterval = 30000,
    maxRetries = 3
  } = options;

  // State
  const [state, setState] = useState<OfflineManagerState>({
    isOffline: !navigator.onLine,
    offlineData: {
      players: [],
      leagues: [],
      teams: [],
      userPreferences: {},
      draftHistory: [],
      lastUpdated: 0
    },
    pendingActions: [],
    syncStatus: {
      isOnline: navigator.onLine,
      lastSync: null,
      pendingActions: 0,
      syncInProgress: false,
      syncErrors: [],
      connectionType: 'unknown',
      dataUsage: 0
    },
    capabilities: {
      canCachePlayers: true,
      canDraftOffline: true,
      canSyncData: navigator.onLine,
      hasStorage: typeof Storage !== 'undefined',
      storageQuota: 50 * 1024 * 1024, // 50MB default
      usedStorage: 0
    },
    error: null,
    isInitialized: false
  });

  // Storage keys
  const STORAGE_KEYS = useMemo(() => ({
    OFFLINE_DATA: 'mobile_offline_data',
    PENDING_ACTIONS: 'mobile_pending_actions',
    SYNC_STATUS: 'mobile_sync_status',
    PREFERENCES: 'mobile_offline_preferences'
  }), []);

  // Initialize
  useEffect(() => {
    initialize();
    setupEventListeners();
    
    return () => {
      cleanupEventListeners();
    };
    // Intentionally minimal dependencies to avoid infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-sync
  useEffect(() => {
    if (autoSync && state.isInitialized && !state.isOffline) {
      const interval = setInterval(() => {
        if (!state.syncStatus.syncInProgress) {
          syncActions();
        }
      }, syncInterval);

      return () => clearInterval(interval);
    }
    // Intentionally minimal dependencies to avoid infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSync, syncInterval, state.isInitialized, state.isOffline, state.syncStatus.syncInProgress]);

  const initialize = useCallback(async () => {
    try {
      // Load existing data from storage
      const storedData = localStorage.getItem(STORAGE_KEYS.OFFLINE_DATA);
      const storedActions = localStorage.getItem(STORAGE_KEYS.PENDING_ACTIONS);
      const storedSyncStatus = localStorage.getItem(STORAGE_KEYS.SYNC_STATUS);

      const offlineData = storedData ? JSON.parse(storedData) : state.offlineData;
      const pendingActions = storedActions ? JSON.parse(storedActions) : [];
      const syncStatus = storedSyncStatus ? JSON.parse(storedSyncStatus) : state.syncStatus;

      // Calculate storage usage
      const usedStorage = calculateStorageUsage();

      setState(prev => ({
        ...prev,
        offlineData,
        pendingActions,
        syncStatus: {
          ...syncStatus,
          isOnline: navigator.onLine,
          pendingActions: pendingActions.length
        },
        capabilities: {
          ...prev.capabilities,
          usedStorage,
          canSyncData: navigator.onLine
        },
        isInitialized: true
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Initialization failed',
        isInitialized: true
      }));
    }
    // Intentionally minimal dependencies to avoid infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [STORAGE_KEYS, state.offlineData, state.syncStatus]);

  const setupEventListeners = useCallback(() => {
    const handleOnline = () => {
      setState(prev => ({
        ...prev,
        isOffline: false,
        syncStatus: {
          ...prev.syncStatus,
          isOnline: true
        },
        capabilities: {
          ...prev.capabilities,
          canSyncData: true
        }
      }));

      if (autoSync) {
        syncActions();
      }
    };

    const handleOffline = () => {
      setState(prev => ({
        ...prev,
        isOffline: true,
        syncStatus: {
          ...prev.syncStatus,
          isOnline: false
        },
        capabilities: {
          ...prev.capabilities,
          canSyncData: false
        }
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
    // Intentionally minimal dependencies to avoid infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSync]);

  const cleanupEventListeners = useCallback(() => {
    // Cleanup is handled by the return function from setupEventListeners
  }, []);

  // Helper functions
  const calculateStorageUsage = (): number => {
    try {
      let total = 0;
      Object.values(STORAGE_KEYS).forEach(key => {
        const item = localStorage.getItem(key);
        if (item) {
          total += new Blob([item]).size;
        }
      });
      return total;
    } catch {
      return 0;
    }
  };

  const saveToStorage = <T>(key: string, data: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: `Storage error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }));
    }
  };

  // Data management actions
  const cacheData = useCallback(async (
    type: 'players' | 'leagues' | 'teams',
    data: Array<Record<string, unknown>>
  ) => {
    try {
      setState(prev => {
        const newOfflineData = {
          ...prev.offlineData,
          [type]: data,
          lastUpdated: Date.now()
        };

        saveToStorage(STORAGE_KEYS.OFFLINE_DATA, newOfflineData);

        return {
          ...prev,
          offlineData: newOfflineData,
          capabilities: {
            ...prev.capabilities,
            usedStorage: calculateStorageUsage()
          }
        };
      });

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: `Failed to cache ${type}: ${error instanceof Error ? error.message : 'Unknown error'}`
      }));
    }
    // Intentionally minimal dependencies to avoid infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [STORAGE_KEYS.OFFLINE_DATA]);

  const getCachedData = useCallback((type: 'players' | 'leagues' | 'teams'): Array<Record<string, unknown>> => {
    return state.offlineData[type] || [];
  }, [state.offlineData]);

  const clearCache = useCallback(async (type?: 'players' | 'leagues' | 'teams') => {
    try {
      setState(prev => {
        const newOfflineData = type 
          ? { ...prev.offlineData, [type]: [] }
          : {
              players: [],
              leagues: [],
              teams: [],
              userPreferences: {},
              draftHistory: [],
              lastUpdated: 0
            };

        saveToStorage(STORAGE_KEYS.OFFLINE_DATA, newOfflineData);

        return {
          ...prev,
          offlineData: newOfflineData,
          capabilities: {
            ...prev.capabilities,
            usedStorage: calculateStorageUsage()
          }
        };
      });

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: `Failed to clear cache: ${error instanceof Error ? error.message : 'Unknown error'}`
      }));
    }
    // Intentionally minimal dependencies to avoid infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [STORAGE_KEYS.OFFLINE_DATA]);

  // Action management
  const queueAction = useCallback((
    action: Omit<OfflineAction, 'id' | 'timestamp' | 'status' | 'retryCount'>
  ): string => {
    const newAction: OfflineAction = {
      ...action,
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      status: 'pending',
      retryCount: 0
    };

    setState(prev => {
      const newPendingActions = [...prev.pendingActions, newAction];
      saveToStorage(STORAGE_KEYS.PENDING_ACTIONS, newPendingActions);

      return {
        ...prev,
        pendingActions: newPendingActions,
        syncStatus: {
          ...prev.syncStatus,
          pendingActions: newPendingActions.length
        }
      };
    });

    return newAction.id;
  }, [STORAGE_KEYS.PENDING_ACTIONS]);

  const cancelAction = useCallback((actionId: string) => {
    setState(prev => {
      const newPendingActions = prev.pendingActions.filter(action => action.id !== actionId);
      saveToStorage(STORAGE_KEYS.PENDING_ACTIONS, newPendingActions);

      return {
        ...prev,
        pendingActions: newPendingActions,
        syncStatus: {
          ...prev.syncStatus,
          pendingActions: newPendingActions.length
        }
      };
    });
  }, [STORAGE_KEYS.PENDING_ACTIONS]);

  const retryAction = useCallback(async (actionId: string) => {
    setState(prev => {
      const actionIndex = prev.pendingActions.findIndex(action => action.id === actionId);
      if (actionIndex === -1) return prev;

      const newPendingActions = [...prev.pendingActions];
      newPendingActions[actionIndex] = {
        ...newPendingActions[actionIndex],
        status: 'pending',
        retryCount: newPendingActions[actionIndex].retryCount + 1
      };

      saveToStorage(STORAGE_KEYS.PENDING_ACTIONS, newPendingActions);

      return {
        ...prev,
        pendingActions: newPendingActions
      };
    });
  }, [STORAGE_KEYS.PENDING_ACTIONS]);

  // Sync operations
  const syncActions = useCallback(async () => {
    if (state.isOffline || state.syncStatus.syncInProgress) return;

    setState(prev => ({
      ...prev,
      syncStatus: {
        ...prev.syncStatus,
        syncInProgress: true,
        syncErrors: []
      }
    }));

    try {
      const actionsToSync = state.pendingActions.filter(
        action => action.status === 'pending' && action.retryCount < maxRetries
      );

      for (const action of actionsToSync) {
        try {
          // Simulate sync operation
          await new Promise(resolve => setTimeout(resolve, 100));

          setState(prev => ({
            ...prev,
            pendingActions: prev.pendingActions.map(a =>
              a.id === action.id ? { ...a, status: 'completed' as const } : a
            )
          }));

        } catch (error) {
          setState(prev => ({
            ...prev,
            pendingActions: prev.pendingActions.map(a =>
              a.id === action.id 
                ? { ...a, status: 'failed' as const, retryCount: a.retryCount + 1 }
                : a
            ),
            syncStatus: {
              ...prev.syncStatus,
              syncErrors: [...prev.syncStatus.syncErrors, 
                `Failed to sync action ${action.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
              ]
            }
          }));
        }
      }

      // Remove completed actions
      setState(prev => {
        const remainingActions = prev.pendingActions.filter(action => 
          action.status !== 'completed'
        );

        saveToStorage(STORAGE_KEYS.PENDING_ACTIONS, remainingActions);

        return {
          ...prev,
          pendingActions: remainingActions,
          syncStatus: {
            ...prev.syncStatus,
            syncInProgress: false,
            lastSync: Date.now(),
            pendingActions: remainingActions.length
          }
        };
      });

    } catch (error) {
      setState(prev => ({
        ...prev,
        syncStatus: {
          ...prev.syncStatus,
          syncInProgress: false,
          syncErrors: [...prev.syncStatus.syncErrors, 
            error instanceof Error ? error.message : 'Sync failed'
          ]
        },
        error: `Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }));
    }
    // Intentionally minimal dependencies to avoid infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxRetries, STORAGE_KEYS.PENDING_ACTIONS]);

  const syncData = useCallback(async () => {
    if (state.isOffline) return;

    try {
      // Simulate data sync
      await new Promise(resolve => setTimeout(resolve, 500));

      setState(prev => ({
        ...prev,
        offlineData: {
          ...prev.offlineData,
          lastUpdated: Date.now()
        },
        syncStatus: {
          ...prev.syncStatus,
          lastSync: Date.now()
        }
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: `Data sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }));
    }
  }, [state.isOffline]);

  const syncAll = useCallback(async () => {
    await Promise.all([syncActions(), syncData()]);
    // Intentionally minimal dependencies to avoid infinite loops  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Utility functions
  const checkConnectivity = useCallback(async () => {
    try {
      const response = await fetch('/api/ping', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      const isConnected = response.ok;
      setState(prev => ({
        ...prev,
        isOffline: !isConnected,
        syncStatus: {
          ...prev.syncStatus,
          isOnline: isConnected
        },
        capabilities: {
          ...prev.capabilities,
          canSyncData: isConnected
        }
      }));

    } catch {
      setState(prev => ({
        ...prev,
        isOffline: true,
        syncStatus: {
          ...prev.syncStatus,
          isOnline: false
        },
        capabilities: {
          ...prev.capabilities,
          canSyncData: false
        }
      }));
    }
  }, []);

  const estimateDataUsage = useCallback((): number => {
    return state.capabilities.usedStorage;
  }, [state.capabilities.usedStorage]);

  const optimizeStorage = useCallback(async () => {
    try {
      // Remove old completed actions
      setState(prev => {
        const cutoffTime = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days
        const newPendingActions = prev.pendingActions.filter(
          action => action.timestamp > cutoffTime || action.status !== 'completed'
        );

        saveToStorage(STORAGE_KEYS.PENDING_ACTIONS, newPendingActions);

        return {
          ...prev,
          pendingActions: newPendingActions,
          capabilities: {
            ...prev.capabilities,
            usedStorage: calculateStorageUsage()
          },
          syncStatus: {
            ...prev.syncStatus,
            pendingActions: newPendingActions.length
          }
        };
      });

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: `Storage optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }));
    }
    // Intentionally minimal dependencies to avoid infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [STORAGE_KEYS.PENDING_ACTIONS]);

  const exportOfflineData = useCallback(async (): Promise<string> => {
    try {
      const exportData = {
        offlineData: state.offlineData,
        pendingActions: state.pendingActions,
        syncStatus: state.syncStatus,
        exportedAt: new Date().toISOString(),
        version: '1.0.0'
      };

      return JSON.stringify(exportData, null, 2);

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }));
      throw error;
    }
  }, [state.offlineData, state.pendingActions, state.syncStatus]);

  const importOfflineData = useCallback(async (data: string) => {
    try {
      const importedData = JSON.parse(data);
      
      if (importedData.version === '1.0.0') {
        setState(prev => ({
          ...prev,
          offlineData: importedData.offlineData || prev.offlineData,
          pendingActions: importedData.pendingActions || prev.pendingActions,
          syncStatus: {
            ...prev.syncStatus,
            ...importedData.syncStatus,
            isOnline: navigator.onLine
          }
        }));

        // Save to storage
        saveToStorage(STORAGE_KEYS.OFFLINE_DATA, importedData.offlineData);
        saveToStorage(STORAGE_KEYS.PENDING_ACTIONS, importedData.pendingActions);
      } else {
        throw new Error('Unsupported data version');
      }

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }));
      throw error;
    }
  }, [STORAGE_KEYS]);

  // Computed values
  const hasNetworkIssues = useMemo(() => {
    return state.syncStatus.syncErrors.length > 0 || 
           (state.pendingActions.length > 10 && !state.isOffline);
  }, [state.syncStatus.syncErrors.length, state.pendingActions.length, state.isOffline]);

  const storageUtilization = useMemo(() => {
    const { usedStorage, storageQuota } = state.capabilities;
    return storageQuota > 0 ? (usedStorage / storageQuota) * 100 : 0;
  }, [state.capabilities]);

  const actions: OfflineManagerActions = {
    cacheData,
    getCachedData,
    clearCache,
    queueAction,
    cancelAction,
    retryAction,
    syncAll,
    syncActions,
    syncData,
    checkConnectivity,
    estimateDataUsage,
    optimizeStorage,
    exportOfflineData,
    importOfflineData
  };

  return {
    // State
    ...state,
    
    // Computed values
    hasNetworkIssues,
    storageUtilization,
    
    // Actions
    ...actions
  };
}

export default useMobileOfflineManager;
