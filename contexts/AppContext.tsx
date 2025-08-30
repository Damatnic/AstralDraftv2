import React from 'react';
import type { League, User, View, AppState, ChatMessage, DraftEvent, Player, Team, DraftPick, Notification, AuctionState, TradeOffer, WaiverClaim, CreateLeaguePayload, PlayerPosition, WatchlistInsight, Persona, CustomRanking, LeaguePoll, Announcement, Badge, TopRivalry, LeagueInvitation, DraftPickAsset, DraftCommentaryItem, RecapVideoScene, SideBet, SmartFaabAdvice, GamedayEvent, PlayerAwardType, PlayerAward, NewspaperContent, LeagueSettings } from '../types';
import { players } from '../data/players';
import { LEAGUE_MEMBERS } from '../data/leagueData';
import { LEAGUE_WITH_PLAYERS } from '../data/leagueWithPlayers';
import { sportsIOPlayerService } from '../services/sportsIOPlayerService';

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
    | { type: 'SET_COMMAND_PALETTE_OPEN', payload: boolean }
    | { type: 'UPDATE_TEAM_NAME'; payload: { teamId: number, name: string } }
    | { type: 'ADD_PLAYER_TO_ROSTER'; payload: { teamId: number, player: Player } }
    | { type: 'REMOVE_PLAYER_FROM_ROSTER'; payload: { teamId: number, playerId: number } }
    | { type: 'SET_LINEUP'; payload: { teamId: number, starters: number[], bench: number[] } }
    | { type: 'SET_SEASON_REVIEW_YEAR'; payload: number }
    | { type: 'EDIT_MATCHUPS'; payload: { leagueId: string } }
    | { type: 'SET_WEEKLY_RECAP_SCRIPT'; payload: { key: string, value: any } }
    | { type: 'UPDATE_LEAGUE_PLAYERS'; payload: { leagueId: string, players: Player[] } };
    
const AppContext = React.createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

// Initialize with the main league data including NFL players
const initialState: AppState = {
    theme: 'dark',
    isLoading: false,
    user: null, // Start with no user to show login
    leagues: [LEAGUE_WITH_PLAYERS], // Initialize with our main league including NFL players
    currentView: 'DASHBOARD',
    activeLeagueId: LEAGUE_WITH_PLAYERS.id,
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
    dashboardLayout: ['whatsNext', 'currentWeekMatchups', 'gameWeekStatus', 'leagues', 'standings', 'roster', 'activity', 'performance'],
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
            // Check if user is part of the league
            const isLeagueMember = LEAGUE_MEMBERS.some((member: any) => 
                member.name === user.name || member.id === user.id
            );
            
            if (isLeagueMember) {
                // Find the corresponding league member
                const leagueMember = LEAGUE_MEMBERS.find((member: any) => 
                    member.name === user.name || member.id === user.id
                );
                
                return {
                    ...state,
                    user: leagueMember || user,
                    currentView: 'DASHBOARD',
                    isLoading: false,
                };
            }
            
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
                notifications: state.notifications.filter((n: any) => n.id !== action.payload)
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
            
        case 'UPDATE_TEAM_NAME': {
            const { teamId, name } = action.payload;
            return {
                ...state,
                leagues: state.leagues.map((league: any) => ({
                    ...league,
                    teams: league.teams.map((team: any) => 
                        team.id === teamId ? { ...team, name } : team
                    )
                }))
            };
        }
        
        case 'ADD_PLAYER_TO_ROSTER': {
            const { teamId, player } = action.payload;
            return {
                ...state,
                leagues: state.leagues.map((league: any) => ({
                    ...league,
                    teams: league.teams.map((team: any) => 
                        team.id === teamId 
                            ? { ...team, roster: [...team.roster, player] }
                            : team
                    )
                }))
            };
        }
        
        case 'REMOVE_PLAYER_FROM_ROSTER': {
            const { teamId, playerId } = action.payload;
            return {
                ...state,
                leagues: state.leagues.map((league: any) => ({
                    ...league,
                    teams: league.teams.map((team: any) => 
                        team.id === teamId 
                            ? { ...team, roster: team.roster.filter((p: any) => p.id !== playerId) }
                            : team
                    )
                }))
            };
        }
        
        case 'SET_LINEUP': {
            const { teamId, starters, bench } = action.payload;
            // Implementation for setting lineup
            return state;
        }
        
        case 'SET_SEASON_REVIEW_YEAR': {
            return {
                ...state,
                seasonReviewYear: action.payload
            };
        }
        
        case 'EDIT_MATCHUPS': {
            return {
                ...state,
                editingMatchups: true,
                activeLeagueId: action.payload.leagueId
            };
        }
        
        case 'SET_WEEKLY_RECAP_SCRIPT': {
            return {
                ...state,
                weeklyRecapScript: {
                    ...state.weeklyRecapScript,
                    [action.payload.key]: action.payload.value
                }
            };
        }

        case 'UPDATE_LEAGUE_PLAYERS': {
            const { leagueId, players } = action.payload;
            return {
                ...state,
                leagues: state.leagues.map((league: any) =>
                    league.id === leagueId
                        ? { ...league, allPlayers: players }
                        : league
                )
            };
        }
        
        default:
            return state;
    }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }: any) => {
  const [state, dispatch] = React.useReducer(appReducer, initialState);

  // Load saved user session on mount
  React.useEffect(() => {
    const savedUser = localStorage.getItem('astral_draft_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'LOGIN', payload: user });
      } catch (error) {
      }
    }
  }, []);

  // Save user session when it changes
  React.useEffect(() => {
    if (state.user) {
      localStorage.setItem('astral_draft_user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('astral_draft_user');
    }
  }, [state.user]);

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