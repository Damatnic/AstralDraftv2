import React from 'react';
import type { League, User, View, AppState, ChatMessage, DraftEvent, Player, Team, DraftPick, Notification, AuctionState, TradeOffer, WaiverClaim, CreateLeaguePayload, PlayerPosition, WatchlistInsight, Persona, CustomRanking, LeaguePoll, Announcement, Badge, TopRivalry, LeagueInvitation, DraftPickAsset, DraftCommentaryItem, RecapVideoScene, SideBet, SmartFaabAdvice, GamedayEvent, PlayerAwardType, PlayerAward, NewspaperContent, LeagueSettings } from '../types';
import { players } from '../data/players';

type Action =
    | { type: 'SET_LOADING', payload: boolean }
    | { type: 'LOGOUT' }
    | { type: 'TOGGLE_THEME' }
    | { type: 'TOGGLE_SOUND' }
    | { type: 'UNLOCK_AUDIO' }
    | { type: 'SET_VIEW'; payload: View }
    | { type: 'SET_ACTIVE_LEAGUE'; payload: string | null }
    | { type: 'LOGIN'; payload: User }
    | { type: 'SET_USER'; payload: User | null }
    | { type: 'SET_LEAGUES'; payload: League[] }
    | { type: 'SELECT_LEAGUE'; payload: string }
    | { type: 'ADD_NOTIFICATION'; payload: { message: string, type: Notification['type'] } }
    | { type: 'REMOVE_NOTIFICATION'; payload: number }
    | { type: 'SET_PLAYER_DETAIL', payload: { player: Player | null, initialTab?: string }}
    | { type: 'TOGGLE_MOBILE_NAV' }
    | { type: 'SET_COMMAND_PALETTE_OPEN', payload: boolean };
    
const AppContext = React.createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

const initialState: AppState = {
    theme: 'dark',
    isLoading: false,
    user: null, // Start with no user to show login
    leagues: [],
    currentView: 'DASHBOARD',
    activeLeagueId: null,
    playerNotes: {},
    playerNicknames: {},
    playerVolatility: {},
    newsImpactAnalyses: {},
    weeklyRecapScripts: {},
    leagueNewspapers: {},
    smartFaabAdvice: {},
    gamedayEvents: {},
    teamSlogans: {},
    playerQueues: {},
    dashboardLayout: ['whatsNext', 'leagues', 'onTheHotSeat', 'news', 'performance', 'activity', 'watchlist', 'power', 'assistant', 'historicalAnalytics', 'mockDrafts'],
    notifications: [],
    isDraftPaused: false,
    soundEnabled: true,
    isAudioUnlocked: false,
    isCommandPaletteOpen: false,
    activeSeasonReviewYear: null,
    activeArchiveSeason: null,
    watchlist: [],
    watchlistInsights: [],
    activeManagerId: null,
    activePlayerDetail: null,
    activePlayerDetailInitialTab: 'overview',
    notificationPermission: 'default',
    customRankings: {},
    leaguePolls: {},
    leagueAnnouncements: {},
    teamsToCompare: null,
    isMobileNavOpen: false,
    recentCommands: [],
    activityFeed: [],
    directMessages: [],
    userPredictions: {},
    oraclePredictions: {},
    playerAvatars: {},
    reduceMotion: false,
    highContrast: false,
    textSize: 'sm',
};

const appReducer = (state: AppState, action: Action): AppState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'LOGIN': {
            const user = action.payload;
            return {
                ...state,
                user,
                currentView: 'DASHBOARD',
                isLoading: false,
            };
        }
        case 'LOGOUT':
            return {
                ...initialState,
                isLoading: false,
            };
        case 'TOGGLE_THEME': {
            const newTheme = state.theme === 'dark' ? 'light' : 'dark';
            document.documentElement.className = newTheme;
            return { ...state, theme: newTheme };
        }
        case 'TOGGLE_SOUND':
            return { ...state, soundEnabled: !state.soundEnabled };
        case 'UNLOCK_AUDIO':
            return { ...state, isAudioUnlocked: true };
        case 'SET_VIEW':
            return { ...state, currentView: action.payload };
        case 'SET_ACTIVE_LEAGUE':
            return { ...state, activeLeagueId: action.payload };
        case 'SET_USER':
            return { ...state, user: action.payload };
        case 'SET_LEAGUES':
            return { ...state, leagues: action.payload };
        case 'SELECT_LEAGUE':
            return { ...state, activeLeagueId: action.payload };
        case 'ADD_NOTIFICATION':
            return {
                ...state,
                notifications: [...state.notifications, {
                    id: Date.now(),
                    message: action.payload.message,
                    type: action.payload.type,
                    timestamp: new Date().toISOString()
                }]
            };
        case 'REMOVE_NOTIFICATION':
            return {
                ...state,
                notifications: state.notifications.filter(n => n.id !== action.payload)
            };
        case 'SET_PLAYER_DETAIL':
            return {
                ...state,
                activePlayerDetail: action.payload.player,
                activePlayerDetailInitialTab: action.payload.initialTab || 'overview'
            };
        case 'TOGGLE_MOBILE_NAV':
            return { ...state, isMobileNavOpen: !state.isMobileNavOpen };
        case 'SET_COMMAND_PALETTE_OPEN':
            return { ...state, isCommandPaletteOpen: action.payload };
        default:
            return state;
    }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = React.useReducer(appReducer, initialState);

  const contextValue = React.useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
};