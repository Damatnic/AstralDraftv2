/**
 * Optimized Context System
 * Split contexts for better performance and memory management
 */

import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from &apos;react&apos;;
import { memoryManager } from &apos;../utils/memoryCleanup&apos;;

// ============= User Context =============
interface UserState {
}
  user: any | null;
  isAuthenticated: boolean;
  permissions: string[];
}

interface UserActions {
}
  login: (user: any) => void;
  logout: () => void;
  updatePermissions: (permissions: string[]) => void;
}

const UserContext = createContext<(UserState & UserActions) | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }: any) => {
}
  const [state, dispatch] = useReducer(
    (state: UserState, action: any) => {
}
      switch (action.type) {
}
        case &apos;LOGIN&apos;:
          return { 
}
            ...state, 
            user: action.payload, 
            isAuthenticated: true 
          };
        case &apos;LOGOUT&apos;:
          return { 
}
            user: null, 
            isAuthenticated: false, 
            permissions: [] 
          };
        case &apos;UPDATE_PERMISSIONS&apos;:
          return { ...state, permissions: action.payload };
        default:
          return state;
      }
    },
    {
}
      user: null,
      isAuthenticated: false,
      permissions: []
    }
  );

  const actions = useMemo(() => ({
}
    login: (user: any) => dispatch({ type: &apos;LOGIN&apos;, payload: user }),
    logout: () => dispatch({ type: &apos;LOGOUT&apos; }),
    updatePermissions: (permissions: string[]) => 
      dispatch({ type: &apos;UPDATE_PERMISSIONS&apos;, payload: permissions })
  }), []);

  const value = useMemo(() => ({ ...state, ...actions }), [state, actions]);

  // Auto-save user to localStorage
  useEffect(() => {
}
    if (state.user) {
}
      localStorage.setItem(&apos;astral_draft_user&apos;, JSON.stringify(state.user));
    } else {
}
      localStorage.removeItem(&apos;astral_draft_user&apos;);
    }
  }, [state.user]);

  // Load saved user on mount
  useEffect(() => {
}
    const savedUser = localStorage.getItem(&apos;astral_draft_user&apos;);
    if (savedUser) {
}
      try {
}
        const user = JSON.parse(savedUser);
        actions.login(user);
      } catch (error) {
}
        console.error(&apos;Error loading saved user:&apos;, error);
      }
    }
  }, []);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
}
  const context = useContext(UserContext);
  if (!context) throw new Error(&apos;useUser must be used within UserProvider&apos;);
  return context;
};

// ============= League Context =============
interface LeagueState {
}
  leagues: any[];
  activeLeagueId: string | null;
  activeLeague: any | null;
}

interface LeagueActions {
}
  setLeagues: (leagues: any[]) => void;
  selectLeague: (leagueId: string) => void;
  updateLeague: (leagueId: string, updates: any) => void;
}

const LeagueContext = createContext<(LeagueState & LeagueActions) | undefined>(undefined);

export const LeagueProvider: React.FC<{ children: React.ReactNode }> = ({ children }: any) => {
}
  const [state, dispatch] = useReducer(
    (state: LeagueState, action: any) => {
}
      switch (action.type) {
}
        case &apos;SET_LEAGUES&apos;:
          return { 
}
            ...state, 
            leagues: action.payload,
            activeLeague: action.payload.find((l: any) => l.id === state.activeLeagueId) || null
          };
        case &apos;SELECT_LEAGUE&apos;:
          return { 
}
            ...state, 
            activeLeagueId: action.payload,
            activeLeague: state.leagues.find((l: any) => l.id === action.payload) || null
          };
        case &apos;UPDATE_LEAGUE&apos;:
          const updatedLeagues = state.leagues.map((l: any) => 
            l.id === action.payload.leagueId 
              ? { ...l, ...action.payload.updates }
              : l
          );
          return {
}
            ...state,
            leagues: updatedLeagues,
            activeLeague: updatedLeagues.find((l: any) => l.id === state.activeLeagueId) || null
          };
        default:
          return state;
      }
    },
    {
}
      leagues: [],
      activeLeagueId: null,
      activeLeague: null
    }
  );

  const actions = useMemo(() => ({
}
    setLeagues: (leagues: any[]) => dispatch({ type: &apos;SET_LEAGUES&apos;, payload: leagues }),
    selectLeague: (leagueId: string) => dispatch({ type: &apos;SELECT_LEAGUE&apos;, payload: leagueId }),
    updateLeague: (leagueId: string, updates: any) => 
      dispatch({ type: &apos;UPDATE_LEAGUE&apos;, payload: { leagueId, updates } })
  }), []);

  const value = useMemo(() => ({ ...state, ...actions }), [state, actions]);

  return <LeagueContext.Provider value={value}>{children}</LeagueContext.Provider>;
};

export const useLeague = () => {
}
  const context = useContext(LeagueContext);
  if (!context) throw new Error(&apos;useLeague must be used within LeagueProvider&apos;);
  return context;
};

// ============= UI Context =============
interface UIState {
}
  theme: &apos;dark&apos; | &apos;light&apos;;
  currentView: string;
  isMobileNavOpen: boolean;
  isCommandPaletteOpen: boolean;
  notifications: any[];
  soundEnabled: boolean;
  isAudioUnlocked: boolean;
}

interface UIActions {
}
  setTheme: (theme: &apos;dark&apos; | &apos;light&apos;) => void;
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

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }: any) => {
}
  const [state, dispatch] = useReducer(
    (state: UIState, action: any) => {
}
      switch (action.type) {
}
        case &apos;SET_THEME&apos;:
          document.documentElement.className = action.payload;
          return { ...state, theme: action.payload };
        case &apos;TOGGLE_THEME&apos;:
          const newTheme = state.theme === &apos;dark&apos; ? &apos;light&apos; : &apos;dark&apos;;
          document.documentElement.className = newTheme;
          return { ...state, theme: newTheme };
        case &apos;SET_VIEW&apos;:
          return { ...state, currentView: action.payload };
        case &apos;TOGGLE_MOBILE_NAV&apos;:
          return { ...state, isMobileNavOpen: !state.isMobileNavOpen };
        case &apos;SET_COMMAND_PALETTE_OPEN&apos;:
          return { ...state, isCommandPaletteOpen: action.payload };
        case &apos;ADD_NOTIFICATION&apos;:
          return {
}
            ...state,
            notifications: [...state.notifications, {
}
              id: Date.now(),
              ...action.payload,
              timestamp: new Date().toISOString()
            }]
          };
        case &apos;REMOVE_NOTIFICATION&apos;:
          return {
}
            ...state,
            notifications: state.notifications.filter((n: any) => n.id !== action.payload)
          };
        case &apos;TOGGLE_SOUND&apos;:
          return { ...state, soundEnabled: !state.soundEnabled };
        case &apos;UNLOCK_AUDIO&apos;:
          return { ...state, isAudioUnlocked: true };
        default:
          return state;
      }
    },
    {
}
      theme: &apos;dark&apos;,
      currentView: &apos;DASHBOARD&apos;,
      isMobileNavOpen: false,
      isCommandPaletteOpen: false,
      notifications: [],
      soundEnabled: true,
      isAudioUnlocked: false
    }
  );

  const actions = useMemo(() => ({
}
    setTheme: (theme: &apos;dark&apos; | &apos;light&apos;) => dispatch({ type: &apos;SET_THEME&apos;, payload: theme }),
    toggleTheme: () => dispatch({ type: &apos;TOGGLE_THEME&apos; }),
    setView: (view: string) => dispatch({ type: &apos;SET_VIEW&apos;, payload: view }),
    toggleMobileNav: () => dispatch({ type: &apos;TOGGLE_MOBILE_NAV&apos; }),
    setCommandPaletteOpen: (open: boolean) => 
      dispatch({ type: &apos;SET_COMMAND_PALETTE_OPEN&apos;, payload: open }),
    addNotification: (notification: any) => 
      dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: notification }),
    removeNotification: (id: number) => 
      dispatch({ type: &apos;REMOVE_NOTIFICATION&apos;, payload: id }),
    toggleSound: () => dispatch({ type: &apos;TOGGLE_SOUND&apos; }),
    unlockAudio: () => dispatch({ type: &apos;UNLOCK_AUDIO&apos; })
  }), []);

  const value = useMemo(() => ({ ...state, ...actions }), [state, actions]);

  // Auto-clear old notifications (> 5 minutes)
  useEffect(() => {
}
    const interval = memoryManager.registerInterval(() => {
}
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
}
  const context = useContext(UIContext);
  if (!context) throw new Error(&apos;useUI must be used within UIProvider&apos;);
  return context;
};

// ============= Player Data Context =============
interface PlayerDataState {
}
  players: any[];
  playerDetail: any | null;
  playerDetailInitialTab: string;
  watchlist: any[];
  watchlistInsights: any[];
  playerNotes: Record<string, string>;
  playerNicknames: Record<string, string>;
}

interface PlayerDataActions {
}
  setPlayers: (players: any[]) => void;
  setPlayerDetail: (player: any | null, tab?: string) => void;
  addToWatchlist: (playerId: string) => void;
  removeFromWatchlist: (playerId: string) => void;
  updatePlayerNote: (playerId: string, note: string) => void;
  updatePlayerNickname: (playerId: string, nickname: string) => void;
}

const PlayerDataContext = createContext<(PlayerDataState & PlayerDataActions) | undefined>(undefined);

export const PlayerDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }: any) => {
}
  const [state, dispatch] = useReducer(
    (state: PlayerDataState, action: any) => {
}
      switch (action.type) {
}
        case &apos;SET_PLAYERS&apos;:
          return { ...state, players: action.payload };
        case &apos;SET_PLAYER_DETAIL&apos;:
          return { 
}
            ...state, 
            playerDetail: action.payload.player,
            playerDetailInitialTab: action.payload.tab || &apos;overview&apos;
          };
        case &apos;ADD_TO_WATCHLIST&apos;:
          return { 
}
            ...state, 
            watchlist: [...state.watchlist, action.payload]
          };
        case &apos;REMOVE_FROM_WATCHLIST&apos;:
          return { 
}
            ...state, 
            watchlist: state.watchlist.filter((id: any) => id !== action.payload)
          };
        case &apos;UPDATE_PLAYER_NOTE&apos;:
          return { 
}
            ...state, 
            playerNotes: { ...state.playerNotes, [action.payload.playerId]: action.payload.note }
          };
        case &apos;UPDATE_PLAYER_NICKNAME&apos;:
          return { 
}
            ...state, 
            playerNicknames: {
}
              ...state.playerNicknames, 
              [action.payload.playerId]: action.payload.nickname 
            }
          };
        default:
          return state;
      }
    },
    {
}
      players: [],
      playerDetail: null,
      playerDetailInitialTab: &apos;overview&apos;,
      watchlist: [],
      watchlistInsights: [],
      playerNotes: {},
      playerNicknames: {}
    }
  );

  const actions = useMemo(() => ({
}
    setPlayers: (players: any[]) => dispatch({ type: &apos;SET_PLAYERS&apos;, payload: players }),
    setPlayerDetail: (player: any | null, tab?: string) => 
      dispatch({ type: &apos;SET_PLAYER_DETAIL&apos;, payload: { player, tab } }),
    addToWatchlist: (playerId: string) => 
      dispatch({ type: &apos;ADD_TO_WATCHLIST&apos;, payload: playerId }),
    removeFromWatchlist: (playerId: string) => 
      dispatch({ type: &apos;REMOVE_FROM_WATCHLIST&apos;, payload: playerId }),
    updatePlayerNote: (playerId: string, note: string) => 
      dispatch({ type: &apos;UPDATE_PLAYER_NOTE&apos;, payload: { playerId, note } }),
    updatePlayerNickname: (playerId: string, nickname: string) => 
      dispatch({ type: &apos;UPDATE_PLAYER_NICKNAME&apos;, payload: { playerId, nickname } })
  }), []);

  const value = useMemo(() => ({ ...state, ...actions }), [state, actions]);

  return <PlayerDataContext.Provider value={value}>{children}</PlayerDataContext.Provider>;
};

export const usePlayerData = () => {
}
  const context = useContext(PlayerDataContext);
  if (!context) throw new Error(&apos;usePlayerData must be used within PlayerDataProvider&apos;);
  return context;
};

// ============= Combined Provider =============
export const OptimizedProviders: React.FC<{ children: React.ReactNode }> = ({ children }: any) => {
}
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
if (process.env.NODE_ENV === &apos;development&apos;) {
}
  // Monitor context memory usage
  const monitorContextMemory = () => {
}
    if (typeof window !== &apos;undefined&apos; && &apos;performance&apos; in window) {
}
      const memory = (performance as any).memory;
      if (memory) {
}
        console.log(&apos;[Context Memory]&apos;, {
}
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