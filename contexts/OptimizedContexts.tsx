/**
 * Optimized Context System
 * Split contexts for better performance and memory management
 */

import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from 'react';
import { memoryManager } from '../utils/memoryCleanup';

// ============= User Context =============
interface UserState {
  user: any | null;
  isAuthenticated: boolean;
  permissions: string[];
}

interface UserActions {
  login: (user: any) => void;
  logout: () => void;
  updatePermissions: (permissions: string[]) => void;
}

const UserContext = createContext<(UserState & UserActions) | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(
    (state: UserState, action: any) => {
      switch (action.type) {
        case 'LOGIN':
          return { 
            ...state, 
            user: action.payload, 
            isAuthenticated: true 
          };
        case 'LOGOUT':
          return { 
            user: null, 
            isAuthenticated: false, 
            permissions: [] 
          };
        case 'UPDATE_PERMISSIONS':
          return { ...state, permissions: action.payload };
        default:
          return state;
      }
    },
    {
      user: null,
      isAuthenticated: false,
      permissions: []
    }
  );

  const actions = useMemo(() => ({
    login: (user: any) => dispatch({ type: 'LOGIN', payload: user }),
    logout: () => dispatch({ type: 'LOGOUT' }),
    updatePermissions: (permissions: string[]) => 
      dispatch({ type: 'UPDATE_PERMISSIONS', payload: permissions })
  }), []);

  const value = useMemo(() => ({ ...state, ...actions }), [state, actions]);

  // Auto-save user to localStorage
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('astral_draft_user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('astral_draft_user');
    }
  }, [state.user]);

  // Load saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('astral_draft_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        actions.login(user);
      } catch (error) {
        console.error('Error loading saved user:', error);
      }
    }
  }, []);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};

// ============= League Context =============
interface LeagueState {
  leagues: any[];
  activeLeagueId: string | null;
  activeLeague: any | null;
}

interface LeagueActions {
  setLeagues: (leagues: any[]) => void;
  selectLeague: (leagueId: string) => void;
  updateLeague: (leagueId: string, updates: any) => void;
}

const LeagueContext = createContext<(LeagueState & LeagueActions) | undefined>(undefined);

export const LeagueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(
    (state: LeagueState, action: any) => {
      switch (action.type) {
        case 'SET_LEAGUES':
          return { 
            ...state, 
            leagues: action.payload,
            activeLeague: action.payload.find((l: any) => l.id === state.activeLeagueId) || null
          };
        case 'SELECT_LEAGUE':
          return { 
            ...state, 
            activeLeagueId: action.payload,
            activeLeague: state.leagues.find(l => l.id === action.payload) || null
          };
        case 'UPDATE_LEAGUE':
          const updatedLeagues = state.leagues.map(l => 
            l.id === action.payload.leagueId 
              ? { ...l, ...action.payload.updates }
              : l
          );
          return {
            ...state,
            leagues: updatedLeagues,
            activeLeague: updatedLeagues.find(l => l.id === state.activeLeagueId) || null
          };
        default:
          return state;
      }
    },
    {
      leagues: [],
      activeLeagueId: null,
      activeLeague: null
    }
  );

  const actions = useMemo(() => ({
    setLeagues: (leagues: any[]) => dispatch({ type: 'SET_LEAGUES', payload: leagues }),
    selectLeague: (leagueId: string) => dispatch({ type: 'SELECT_LEAGUE', payload: leagueId }),
    updateLeague: (leagueId: string, updates: any) => 
      dispatch({ type: 'UPDATE_LEAGUE', payload: { leagueId, updates } })
  }), []);

  const value = useMemo(() => ({ ...state, ...actions }), [state, actions]);

  return <LeagueContext.Provider value={value}>{children}</LeagueContext.Provider>;
};

export const useLeague = () => {
  const context = useContext(LeagueContext);
  if (!context) throw new Error('useLeague must be used within LeagueProvider');
  return context;
};

// ============= UI Context =============
interface UIState {
  theme: 'dark' | 'light';
  currentView: string;
  isMobileNavOpen: boolean;
  isCommandPaletteOpen: boolean;
  notifications: any[];
  soundEnabled: boolean;
  isAudioUnlocked: boolean;
}

interface UIActions {
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setView: (view: string) => void;
  toggleMobileNav: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  addNotification: (notification: any) => void;
  removeNotification: (id: number) => void;
  toggleSound: () => void;
  unlockAudio: () => void;
}

const UIContext = createContext<(UIState & UIActions) | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(
    (state: UIState, action: any) => {
      switch (action.type) {
        case 'SET_THEME':
          document.documentElement.className = action.payload;
          return { ...state, theme: action.payload };
        case 'TOGGLE_THEME':
          const newTheme = state.theme === 'dark' ? 'light' : 'dark';
          document.documentElement.className = newTheme;
          return { ...state, theme: newTheme };
        case 'SET_VIEW':
          return { ...state, currentView: action.payload };
        case 'TOGGLE_MOBILE_NAV':
          return { ...state, isMobileNavOpen: !state.isMobileNavOpen };
        case 'SET_COMMAND_PALETTE_OPEN':
          return { ...state, isCommandPaletteOpen: action.payload };
        case 'ADD_NOTIFICATION':
          return {
            ...state,
            notifications: [...state.notifications, {
              id: Date.now(),
              ...action.payload,
              timestamp: new Date().toISOString()
            }]
          };
        case 'REMOVE_NOTIFICATION':
          return {
            ...state,
            notifications: state.notifications.filter((n: any) => n.id !== action.payload)
          };
        case 'TOGGLE_SOUND':
          return { ...state, soundEnabled: !state.soundEnabled };
        case 'UNLOCK_AUDIO':
          return { ...state, isAudioUnlocked: true };
        default:
          return state;
      }
    },
    {
      theme: 'dark',
      currentView: 'DASHBOARD',
      isMobileNavOpen: false,
      isCommandPaletteOpen: false,
      notifications: [],
      soundEnabled: true,
      isAudioUnlocked: false
    }
  );

  const actions = useMemo(() => ({
    setTheme: (theme: 'dark' | 'light') => dispatch({ type: 'SET_THEME', payload: theme }),
    toggleTheme: () => dispatch({ type: 'TOGGLE_THEME' }),
    setView: (view: string) => dispatch({ type: 'SET_VIEW', payload: view }),
    toggleMobileNav: () => dispatch({ type: 'TOGGLE_MOBILE_NAV' }),
    setCommandPaletteOpen: (open: boolean) => 
      dispatch({ type: 'SET_COMMAND_PALETTE_OPEN', payload: open }),
    addNotification: (notification: any) => 
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification }),
    removeNotification: (id: number) => 
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: id }),
    toggleSound: () => dispatch({ type: 'TOGGLE_SOUND' }),
    unlockAudio: () => dispatch({ type: 'UNLOCK_AUDIO' })
  }), []);

  const value = useMemo(() => ({ ...state, ...actions }), [state, actions]);

  // Auto-clear old notifications (> 5 minutes)
  useEffect(() => {
    const interval = memoryManager.registerInterval(() => {
      const now = Date.now();
      const oldNotifications = state.notifications.filter((n: any) => 
        now - new Date(n.timestamp).getTime() > 300000 // 5 minutes
      );
      oldNotifications.forEach((n: any) => actions.removeNotification(n.id));
    }, 60000); // Check every minute

    return () => memoryManager.clearInterval(interval);
  }, [state.notifications, actions]);

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within UIProvider');
  return context;
};

// ============= Player Data Context =============
interface PlayerDataState {
  players: any[];
  playerDetail: any | null;
  playerDetailInitialTab: string;
  watchlist: any[];
  watchlistInsights: any[];
  playerNotes: Record<string, string>;
  playerNicknames: Record<string, string>;
}

interface PlayerDataActions {
  setPlayers: (players: any[]) => void;
  setPlayerDetail: (player: any | null, tab?: string) => void;
  addToWatchlist: (playerId: string) => void;
  removeFromWatchlist: (playerId: string) => void;
  updatePlayerNote: (playerId: string, note: string) => void;
  updatePlayerNickname: (playerId: string, nickname: string) => void;
}

const PlayerDataContext = createContext<(PlayerDataState & PlayerDataActions) | undefined>(undefined);

export const PlayerDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(
    (state: PlayerDataState, action: any) => {
      switch (action.type) {
        case 'SET_PLAYERS':
          return { ...state, players: action.payload };
        case 'SET_PLAYER_DETAIL':
          return { 
            ...state, 
            playerDetail: action.payload.player,
            playerDetailInitialTab: action.payload.tab || 'overview'
          };
        case 'ADD_TO_WATCHLIST':
          return { 
            ...state, 
            watchlist: [...state.watchlist, action.payload]
          };
        case 'REMOVE_FROM_WATCHLIST':
          return { 
            ...state, 
            watchlist: state.watchlist.filter(id => id !== action.payload)
          };
        case 'UPDATE_PLAYER_NOTE':
          return { 
            ...state, 
            playerNotes: { ...state.playerNotes, [action.payload.playerId]: action.payload.note }
          };
        case 'UPDATE_PLAYER_NICKNAME':
          return { 
            ...state, 
            playerNicknames: { 
              ...state.playerNicknames, 
              [action.payload.playerId]: action.payload.nickname 
            }
          };
        default:
          return state;
      }
    },
    {
      players: [],
      playerDetail: null,
      playerDetailInitialTab: 'overview',
      watchlist: [],
      watchlistInsights: [],
      playerNotes: {},
      playerNicknames: {}
    }
  );

  const actions = useMemo(() => ({
    setPlayers: (players: any[]) => dispatch({ type: 'SET_PLAYERS', payload: players }),
    setPlayerDetail: (player: any | null, tab?: string) => 
      dispatch({ type: 'SET_PLAYER_DETAIL', payload: { player, tab } }),
    addToWatchlist: (playerId: string) => 
      dispatch({ type: 'ADD_TO_WATCHLIST', payload: playerId }),
    removeFromWatchlist: (playerId: string) => 
      dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: playerId }),
    updatePlayerNote: (playerId: string, note: string) => 
      dispatch({ type: 'UPDATE_PLAYER_NOTE', payload: { playerId, note } }),
    updatePlayerNickname: (playerId: string, nickname: string) => 
      dispatch({ type: 'UPDATE_PLAYER_NICKNAME', payload: { playerId, nickname } })
  }), []);

  const value = useMemo(() => ({ ...state, ...actions }), [state, actions]);

  return <PlayerDataContext.Provider value={value}>{children}</PlayerDataContext.Provider>;
};

export const usePlayerData = () => {
  const context = useContext(PlayerDataContext);
  if (!context) throw new Error('usePlayerData must be used within PlayerDataProvider');
  return context;
};

// ============= Combined Provider =============
export const OptimizedProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <UserProvider>
      <UIProvider>
        <LeagueProvider>
          <PlayerDataProvider>
            {children}
          </PlayerDataProvider>
        </LeagueProvider>
      </UIProvider>
    </UserProvider>
  );
};

// ============= Memory Monitoring =============
if (process.env.NODE_ENV === 'development') {
  // Monitor context memory usage
  const monitorContextMemory = () => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const memory = (performance as any).memory;
      if (memory) {
        console.log('[Context Memory]', {
          used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
          total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
          limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`
        });
      }
    }
  };

  // Check memory every 30 seconds in development
  memoryManager.registerInterval(monitorContextMemory, 30000);
}