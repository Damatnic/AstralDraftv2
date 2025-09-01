import React, { FC, ReactNode } from &apos;react&apos;;
import type { League, User, View, AppState, ChatMessage, DraftEvent, Player, Team, DraftPick, Notification, AuctionState, TradeOffer, WaiverClaim, CreateLeaguePayload, PlayerPosition, WatchlistInsight, Persona, CustomRanking, LeaguePoll, Announcement, Badge, TopRivalry, LeagueInvitation, DraftPickAsset, DraftCommentaryItem, RecapVideoScene, SideBet, SmartFaabAdvice, GamedayEvent, PlayerAwardType, PlayerAward, NewspaperContent, LeagueSettings } from &apos;../types&apos;;
import { players } from &apos;../data/players&apos;;
import { LEAGUE_MEMBERS } from &apos;../data/leagueData&apos;;
import { LEAGUE_WITH_PLAYERS } from &apos;../data/leagueWithPlayers&apos;;
import { sportsIOPlayerService } from &apos;../services/sportsIOPlayerService&apos;;

type Action =
    | { type: &apos;SET_LOADING&apos;, payload: boolean }
    | { type: &apos;LOGOUT&apos; }
    | { type: &apos;TOGGLE_THEME&apos; }
    | { type: &apos;TOGGLE_SOUND&apos; }
    | { type: &apos;UNLOCK_AUDIO&apos; }
    | { type: &apos;SET_VIEW&apos;; payload: View }
    | { type: &apos;SET_ACTIVE_LEAGUE&apos;; payload: string | null }
    | { type: &apos;LOGIN&apos;; payload: User }
    | { type: &apos;SET_USER&apos;; payload: User | null }
    | { type: &apos;SET_LEAGUES&apos;; payload: League[] }
    | { type: &apos;SELECT_LEAGUE&apos;; payload: string }
    | { type: &apos;ADD_NOTIFICATION&apos;; payload: { message: string, type: Notification[&apos;type&apos;] } }
    | { type: &apos;REMOVE_NOTIFICATION&apos;; payload: number }
    | { type: &apos;SET_PLAYER_DETAIL&apos;, payload: { player: Player | null, initialTab?: string }}
    | { type: &apos;TOGGLE_MOBILE_NAV&apos; }
    | { type: &apos;SET_COMMAND_PALETTE_OPEN&apos;, payload: boolean }
    | { type: &apos;UPDATE_TEAM_NAME&apos;; payload: { teamId: number, name: string } }
    | { type: &apos;ADD_PLAYER_TO_ROSTER&apos;; payload: { teamId: number, player: Player } }
    | { type: &apos;REMOVE_PLAYER_FROM_ROSTER&apos;; payload: { teamId: number, playerId: number } }
    | { type: &apos;SET_LINEUP&apos;; payload: { teamId: number, starters: number[], bench: number[] } }
    | { type: &apos;SET_SEASON_REVIEW_YEAR&apos;; payload: number }
    | { type: &apos;EDIT_MATCHUPS&apos;; payload: { leagueId: string } }
    | { type: &apos;SET_WEEKLY_RECAP_SCRIPT&apos;; payload: { key: string, value: unknown } }
    | { type: &apos;UPDATE_LEAGUE_PLAYERS&apos;; payload: { leagueId: string, players: Player[] } };
    
const AppContext = React.createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

// Initialize with the main league data including NFL players
const initialState: AppState = {
}
    theme: &apos;dark&apos;,
    isLoading: false,
    user: null, // Start with no user to show login
    leagues: [LEAGUE_WITH_PLAYERS], // Initialize with our main league including NFL players
    currentView: &apos;DASHBOARD&apos;,
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
    dashboardLayout: [&apos;whatsNext&apos;, &apos;currentWeekMatchups&apos;, &apos;gameWeekStatus&apos;, &apos;leagues&apos;, &apos;standings&apos;, &apos;roster&apos;, &apos;activity&apos;, &apos;performance&apos;],
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
    activePlayerDetailInitialTab: &apos;overview&apos;,
    notificationPermission: &apos;default&apos;,
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
    textSize: &apos;sm&apos;,
};

const appReducer = (state: AppState, action: Action): AppState => {
}
    switch (action.type) {
}
        case &apos;SET_LOADING&apos;:
            return { ...state, isLoading: action.payload };
            
        case &apos;LOGIN&apos;: {
}
            const user = action.payload;
            // Check if user is part of the league
            const isLeagueMember = LEAGUE_MEMBERS.some((member: User) => 
                member.name === user.name || member.id === user.id
            );
            
            if (isLeagueMember) {
}
                // Find the corresponding league member
                const leagueMember = LEAGUE_MEMBERS.find((member: any) => 
                    member.name === user.name || member.id === user.id
                );
                
                return {
}
                    ...state,
                    user: leagueMember || user,
                    currentView: &apos;DASHBOARD&apos;,
                    isLoading: false,
                };
            }

            return {
}
                ...state,
                user,
                currentView: &apos;DASHBOARD&apos;,
                isLoading: false,
            };
        }

        case &apos;LOGOUT&apos;:
            return {
}
                ...initialState,
                isLoading: false,
            };
            
        case &apos;TOGGLE_THEME&apos;: {
}
            const newTheme = state.theme === &apos;dark&apos; ? &apos;light&apos; : &apos;dark&apos;;
            document.documentElement.className = newTheme;
            return { ...state, theme: newTheme };
        }

        case &apos;TOGGLE_SOUND&apos;:
            return { ...state, soundEnabled: !state.soundEnabled };
            
        case &apos;UNLOCK_AUDIO&apos;:
            return { ...state, isAudioUnlocked: true };
            
        case &apos;SET_VIEW&apos;:
            return { ...state, currentView: action.payload };
            
        case &apos;SET_ACTIVE_LEAGUE&apos;:
            return { ...state, activeLeagueId: action.payload };
            
        case &apos;SET_USER&apos;:
            return { ...state, user: action.payload };
            
        case &apos;SET_LEAGUES&apos;:
            return { ...state, leagues: action.payload };
            
        case &apos;SELECT_LEAGUE&apos;:
            return { ...state, activeLeagueId: action.payload };
            
        case &apos;ADD_NOTIFICATION&apos;:
            return {
}
                ...state,
                notifications: [...state.notifications, {
}
                    id: Date.now(),
                    message: action.payload.message,
                    type: action.payload.type,
                    timestamp: new Date().toISOString()
                }]
            };
            
        case &apos;REMOVE_NOTIFICATION&apos;:
            return {
}
                ...state,
                notifications: state.notifications.filter((n: any) => n.id !== action.payload)
            };
            
        case &apos;SET_PLAYER_DETAIL&apos;:
            return {
}
                ...state,
                activePlayerDetail: action.payload.player,
                activePlayerDetailInitialTab: action.payload.initialTab || &apos;overview&apos;
            };
            
        case &apos;TOGGLE_MOBILE_NAV&apos;:
            return { ...state, isMobileNavOpen: !state.isMobileNavOpen };
            
        case &apos;SET_COMMAND_PALETTE_OPEN&apos;:
            return { ...state, isCommandPaletteOpen: action.payload };
            
        case &apos;UPDATE_TEAM_NAME&apos;: {
}
            const { teamId, name } = action.payload;
            return {
}
                ...state,
                leagues: state.leagues.map((league: any) => ({
}
                    ...league,
                    teams: league.teams.map((team: any) => 
                        team.id === teamId ? { ...team, name } : team
                    )
                }))
            };
        }

        case &apos;ADD_PLAYER_TO_ROSTER&apos;: {
}
            const { teamId, player } = action.payload;
            return {
}
                ...state,
                leagues: state.leagues.map((league: any) => ({
}
                    ...league,
                    teams: league.teams.map((team: any) => 
                        team.id === teamId 
                            ? { ...team, roster: [...team.roster, player] }
                            : team
                    )
                }))
            };
        }

        case &apos;REMOVE_PLAYER_FROM_ROSTER&apos;: {
}
            const { teamId, playerId } = action.payload;
            return {
}
                ...state,
                leagues: state.leagues.map((league: any) => ({
}
                    ...league,
                    teams: league.teams.map((team: any) => 
                        team.id === teamId 
                            ? { ...team, roster: team.roster.filter((p: any) => p.id !== playerId) }
                            : team
                    )
                }))
            };
        }

        case &apos;SET_LINEUP&apos;: {
}
            const { teamId, starters, bench } = action.payload;
            // Implementation for setting lineup
            return state;
        }

        case &apos;SET_SEASON_REVIEW_YEAR&apos;: {
}
            return {
}
                ...state,
                seasonReviewYear: action.payload
            };
        }

        case &apos;EDIT_MATCHUPS&apos;: {
}
            return {
}
                ...state,
                editingMatchups: true,
                activeLeagueId: action.payload.leagueId
            };
        }

        case &apos;SET_WEEKLY_RECAP_SCRIPT&apos;: {
}
            return {
}
                ...state,
                weeklyRecapScript: {
}
                    ...state.weeklyRecapScript,
                    [action.payload.key]: action.payload.value
                }
            };
        }

        case &apos;UPDATE_LEAGUE_PLAYERS&apos;: {
}
            const { leagueId, players } = action.payload;
            return {
}
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

interface AppProviderProps {
}
  children: ReactNode;
}

export const AppProvider: FC<AppProviderProps> = ({ children }: any) => {
}
  const [state, dispatch] = React.useReducer(appReducer, initialState);

  // Load saved user session on mount
  React.useEffect(() => {
}
    const savedUser = localStorage.getItem(&apos;astral_draft_user&apos;);
    if (savedUser) {
}
      try {
}
        const user = JSON.parse(savedUser);
        dispatch({ type: &apos;LOGIN&apos;, payload: user });
      } catch (error) {
}
        console.error(&apos;Error parsing saved user:&apos;, error);
      }
    }
  }, []);

  // Save user session when it changes
  React.useEffect(() => {
}
    if (state.user) {
}
      localStorage.setItem(&apos;astral_draft_user&apos;, JSON.stringify(state.user));
    } else {
}
      localStorage.removeItem(&apos;astral_draft_user&apos;);
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
}
  const context = React.useContext(AppContext);
  if (context === undefined) {
}
    throw new Error(&apos;useAppState must be used within an AppProvider&apos;);
  }
  return context;
};