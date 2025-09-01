import { useState, useCallback, useEffect } from 'react';

export interface DraftSession {
  id: string;
  userId: string;
  leagueId: string;
  draftOrder: number[];
  picks: DraftPick[];
  settings: DraftSettings;
  status: 'pending' | 'active' | 'completed' | 'paused';
  createdAt: number;
  updatedAt: number;

export interface DraftPick {
  round: number;
  pick: number;
  playerId: string;
  teamId: string;
  timestamp: number;

export interface DraftSettings {
  rounds: number;
  timePerPick: number;
  draftType: 'snake' | 'linear';
  scoringType: 'standard' | 'ppr' | 'half_ppr';

export interface AnalyticsData {
  id: string;
  userId: string;
  type: 'user_behavior' | 'performance' | 'predictions' | 'draft_analysis';
  data: Record<string, unknown>;
  timestamp: number;
  sessionId: string;

export interface UserPreferences {
  userId: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  autoRefresh: boolean;
  defaultView: string;
  customSettings: Record<string, unknown>;
  updatedAt: number;

export interface OraclePredictionHistory {
  id: string;
  userId: string;
  week: number;
  season: number;
  predictions: PredictionEntry[];
  accuracy: number;
  confidence: number;
  createdAt: number;

export interface PredictionEntry {

  playerId: string;
  projectedPoints: number;
  actualPoints?: number;
  confidence: number;
  reasoning: string[];

    } catch (error) {
        console.error(error);
    }export interface SyncStatus {
  lastSync: number;
  status: 'synced' | 'syncing' | 'error' | 'offline';
  pendingOperations: number;
  errors: SyncError[];

export interface SyncError {
  operation: string;
  error: string;
  timestamp: number;
  retryCount: number;

export interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  ttl: number;
  accessed: number;

export interface DataPersistenceState {
  isInitialized: boolean;
  isOnline: boolean;
  syncStatus: SyncStatus | null;
  error: string | null;

export interface DataPersistenceActions {
  // Draft Sessions
  saveDraftSession: (session: DraftSession) => Promise<void>;
  getDraftSession: (id: string) => Promise<DraftSession | null>;
  getUserDraftSessions: (userId: string) => Promise<DraftSession[]>;
  deleteDraftSession: (id: string) => Promise<void>;
  
  // Analytics
  saveAnalyticsData: (data: AnalyticsData) => Promise<void>;
  getAnalyticsData: (userId: string, type?: string) => Promise<AnalyticsData[]>;
  
  // User Preferences
  saveUserPreferences: (preferences: UserPreferences) => Promise<void>;
  getUserPreferences: (userId: string) => Promise<UserPreferences | null>;
  
  // Oracle Predictions
  saveOraclePrediction: (prediction: OraclePredictionHistory) => Promise<void>;
  getOraclePredictions: (userId: string, week?: number, season?: number) => Promise<OraclePredictionHistory[]>;
  
  // Cache Operations
  cacheData: <T>(key: string, data: T, ttl?: number) => Promise<void>;
  getCachedData: <T>(key: string) => Promise<T | null>;
  clearCache: (pattern?: string) => Promise<void>;
  
  // Sync Operations
  forceSyncAll: () => Promise<void>;
  getSyncStatus: () => Promise<SyncStatus>;
  retryFailedOperations: () => Promise<void>;

export function useDataPersistence(): [DataPersistenceState, DataPersistenceActions] {
  const [state, setState] = useState<DataPersistenceState>({
    isInitialized: false,
    isOnline: navigator.onLine,
    syncStatus: null,
    error: null
  });

  // Storage keys
  const STORAGE_KEYS = {
    DRAFT_SESSIONS: 'draft_sessions',
    ANALYTICS: 'analytics_data',
    USER_PREFERENCES: 'user_preferences',
    ORACLE_PREDICTIONS: 'oracle_predictions',
    CACHE: 'data_cache',
    SYNC_STATUS: 'sync_status'
  };

  // Initialize
  useEffect(() => {
    const initialize = async () => {
      try {
        // Check storage availability
        if (typeof Storage !== 'undefined') {
          const syncStatus: SyncStatus = {
            lastSync: Date.now(),
            status: 'synced',
            pendingOperations: 0,
            errors: []
          };
          
          setState(prev => ({
            ...prev,
            isInitialized: true,
//             syncStatus
          }));
        } else {
          throw new Error('Local storage not available');
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Initialization failed',
          isInitialized: true
        }));
      }
    };

    initialize();
  }, []);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Helper functions
  const getStorageData = <T>(key: string): T[] => {
    try {

      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    
    } catch (error) {
        console.error(error);
    } catch {
      return [];
    }
  };

  const setStorageData = <T>(key: string, data: T[]): void => {
    try {

      localStorage.setItem(key, JSON.stringify(data));
    
    } catch (error) {
        console.error(error);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: `Storage error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }));
    }
  };

  // Draft Session Operations
  const saveDraftSession = useCallback(async (session: DraftSession) => {
    const sessions = getStorageData<DraftSession>(STORAGE_KEYS.DRAFT_SESSIONS);
    const existingIndex = sessions.findIndex(s => s.id === session.id);
    
    if (existingIndex >= 0) {
      sessions[existingIndex] = { ...session, updatedAt: Date.now() };
    } else {
      sessions.push(session);
    }
    
    setStorageData(STORAGE_KEYS.DRAFT_SESSIONS, sessions);
  }, [STORAGE_KEYS.DRAFT_SESSIONS]);

  const getDraftSession = useCallback(async (id: string): Promise<DraftSession | null> => {
    const sessions = getStorageData<DraftSession>(STORAGE_KEYS.DRAFT_SESSIONS);
    return sessions.find((s: any) => s.id === id) || null;
  }, [STORAGE_KEYS.DRAFT_SESSIONS]);

  const getUserDraftSessions = useCallback(async (userId: string): Promise<DraftSession[]> => {
    const sessions = getStorageData<DraftSession>(STORAGE_KEYS.DRAFT_SESSIONS);
    return sessions.filter((s: any) => s.userId === userId);
  }, [STORAGE_KEYS.DRAFT_SESSIONS]);

  const deleteDraftSession = useCallback(async (id: string) => {
    const sessions = getStorageData<DraftSession>(STORAGE_KEYS.DRAFT_SESSIONS);
    const filtered = sessions.filter((s: any) => s.id !== id);
    setStorageData(STORAGE_KEYS.DRAFT_SESSIONS, filtered);
  }, [STORAGE_KEYS.DRAFT_SESSIONS]);

  // Analytics Operations
  const saveAnalyticsData = useCallback(async (data: AnalyticsData) => {
    const analytics = getStorageData<AnalyticsData>(STORAGE_KEYS.ANALYTICS);
    analytics.push(data);
    setStorageData(STORAGE_KEYS.ANALYTICS, analytics);
  }, [STORAGE_KEYS.ANALYTICS]);

  const getAnalyticsData = useCallback(async (userId: string, type?: string): Promise<AnalyticsData[]> => {
    const analytics = getStorageData<AnalyticsData>(STORAGE_KEYS.ANALYTICS);
    return analytics.filter((a: any) => 
      a.userId === userId && (!type || a.type === type)
    );
  }, [STORAGE_KEYS.ANALYTICS]);

  // User Preferences Operations
  const saveUserPreferences = useCallback(async (preferences: UserPreferences) => {
    const prefs = getStorageData<UserPreferences>(STORAGE_KEYS.USER_PREFERENCES);
    const existingIndex = prefs.findIndex(p => p.userId === preferences.userId);
    
    if (existingIndex >= 0) {
      prefs[existingIndex] = { ...preferences, updatedAt: Date.now() };
    } else {
      prefs.push(preferences);
    }
    
    setStorageData(STORAGE_KEYS.USER_PREFERENCES, prefs);
  }, [STORAGE_KEYS.USER_PREFERENCES]);

  const getUserPreferences = useCallback(async (userId: string): Promise<UserPreferences | null> => {
    const prefs = getStorageData<UserPreferences>(STORAGE_KEYS.USER_PREFERENCES);
    return prefs.find((p: any) => p.userId === userId) || null;
  }, [STORAGE_KEYS.USER_PREFERENCES]);

  // Oracle Predictions Operations
  const saveOraclePrediction = useCallback(async (prediction: OraclePredictionHistory) => {
    const predictions = getStorageData<OraclePredictionHistory>(STORAGE_KEYS.ORACLE_PREDICTIONS);
    const existingIndex = predictions.findIndex(p => 
      p.userId === prediction.userId && 
      p.week === prediction.week && 
      p.season === prediction.season
    );
    
    if (existingIndex >= 0) {
      predictions[existingIndex] = prediction;
    } else {
      predictions.push(prediction);
    }
    
    setStorageData(STORAGE_KEYS.ORACLE_PREDICTIONS, predictions);
  }, [STORAGE_KEYS.ORACLE_PREDICTIONS]);

  const getOraclePredictions = useCallback(async (
    userId: string, 
    week?: number, 
    season?: number
  ): Promise<OraclePredictionHistory[]> => {
    const predictions = getStorageData<OraclePredictionHistory>(STORAGE_KEYS.ORACLE_PREDICTIONS);
    return predictions.filter((p: any) => 
      p.userId === userId &&
      (week === undefined || p.week === week) &&
      (season === undefined || p.season === season)
    );
  }, [STORAGE_KEYS.ORACLE_PREDICTIONS]);

  // Cache Operations
  const cacheData = useCallback(async <T>(key: string, data: T, ttl = 3600000): Promise<void> => {
    const cache = getStorageData<{ key: string; entry: CacheEntry<T> }>(STORAGE_KEYS.CACHE);
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      accessed: Date.now()
    };
    
    const existingIndex = cache.findIndex(c => c.key === key);
    if (existingIndex >= 0) {
      cache[existingIndex].entry = entry;
    } else {
      cache.push({ key, entry });
    }
    
    setStorageData(STORAGE_KEYS.CACHE, cache);
  }, [STORAGE_KEYS.CACHE]);

  const getCachedData = useCallback(async <T>(key: string): Promise<T | null> => {
    const cache = getStorageData<{ key: string; entry: CacheEntry<T> }>(STORAGE_KEYS.CACHE);
    const item = cache.find((c: any) => c.key === key);
    
    if (!item) return null;
    
    const { entry } = item;
    const now = Date.now();
    
    // Check if expired
    if (now - entry.timestamp > entry.ttl) {
      // Remove expired entry
      const filtered = cache.filter((c: any) => c.key !== key);
      setStorageData(STORAGE_KEYS.CACHE, filtered);
      return null;
    }
    
    // Update access time
    entry.accessed = now;
    setStorageData(STORAGE_KEYS.CACHE, cache);
    
    return entry.data;
  }, [STORAGE_KEYS.CACHE]);

  const clearCache = useCallback(async (pattern?: string) => {
    if (!pattern) {
      setStorageData(STORAGE_KEYS.CACHE, []);
      return;
    }
    
    const cache = getStorageData<{ key: string; entry: CacheEntry }>(STORAGE_KEYS.CACHE);
    const filtered = cache.filter((c: any) => !c.key.includes(pattern));
    setStorageData(STORAGE_KEYS.CACHE, filtered);
  }, [STORAGE_KEYS.CACHE]);

  // Sync Operations
  const getSyncStatus = useCallback(async (): Promise<SyncStatus> => {
    return state.syncStatus || {
      lastSync: 0,
      status: 'offline',
      pendingOperations: 0,
      errors: []
    };
  }, [state.syncStatus]);

  const forceSyncAll = useCallback(async () => {
    if (!state.isOnline) {
      setState(prev => ({
        ...prev,
        error: 'Cannot sync while offline'
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      syncStatus: {
        ...prev.syncStatus!,
        status: 'syncing'
      }
    }));

    // Simulate sync operation
    await new Promise(resolve => setTimeout(resolve, 1000));

    setState(prev => ({
      ...prev,
      syncStatus: {
        lastSync: Date.now(),
        status: 'synced',
        pendingOperations: 0,
        errors: []
      }
    }));
  }, [state.isOnline]);

  const retryFailedOperations = useCallback(async () => {
    if (!state.syncStatus?.errors.length) return;

    setState(prev => ({
      ...prev,
      syncStatus: {
        ...prev.syncStatus!,
        status: 'syncing'
      }
    }));

    // Simulate retry
    await new Promise(resolve => setTimeout(resolve, 500));

    setState(prev => ({
      ...prev,
      syncStatus: {
        ...prev.syncStatus!,
        status: 'synced',
        errors: []
      }
    }));
  }, [state.syncStatus]);

  const actions: DataPersistenceActions = {
    saveDraftSession,
    getDraftSession,
    getUserDraftSessions,
    deleteDraftSession,
    saveAnalyticsData,
    getAnalyticsData,
    saveUserPreferences,
    getUserPreferences,
    saveOraclePrediction,
    getOraclePredictions,
    cacheData,
    getCachedData,
    clearCache,
    forceSyncAll,
    getSyncStatus,
//     retryFailedOperations
  };

  return [state, actions];

export default useDataPersistence;
