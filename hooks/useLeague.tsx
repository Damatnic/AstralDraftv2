/**
 * Hook for managing league operations
 */

import { useAppState } from &apos;../contexts/AppContext&apos;;
import { League, Team } from &apos;../types&apos;;

interface UseLeagueReturn {
}
  league: League | null;
  myTeam: Team | null;
  isCommissioner: boolean;
  isLoading: boolean;
  selectLeague: (leagueId: string) => void;
  createLeague: (leagueData: Partial<League>) => Promise<void>;
  updateLeagueSettings: (settings: Record<string, unknown>) => void;
  joinLeague: (_inviteCode: string) => Promise<void>;
}

export const useLeague = (): UseLeagueReturn => {
}
  const { state, dispatch } = useAppState();
  const [isLoading, setIsLoading] = React.useState(false);
  
  // Get current league from state
  const league = state.activeLeagueId 
    ? state.leagues.find((l: any) => l.id === state.activeLeagueId) || null
    : null;
  
  // Get user&apos;s team in current league
  const myTeam = React.useMemo(() => {
}
    if (!league || !state.user) return null;
    return league.teams.find((t: any) => t.owner.id === state.user!.id) || null;
  }, [league, state.user]);

  // Check if current user is commissioner
  const isCommissioner = React.useMemo(() => {
}
    if (!league || !state.user) return false;
    return league.commissionerId === state.user.id;
  }, [league, state.user]);

  const selectLeague = (leagueId: string) => {
}
    dispatch({
}
      type: &apos;SET_ACTIVE_LEAGUE&apos;,
      payload: leagueId
    });
  };

  const createLeague = async (leagueData: Partial<League>) => {
}
    if (!state.user) return;
    
    setIsLoading(true);
    try {
}
      const newLeague: League = {
}
        id: `league_${Date.now()}`,
        name: leagueData.name || &apos;New League&apos;,
        commissionerId: state.user.id,
        teams: [],
        members: [state.user],
        status: &apos;PRE_DRAFT&apos;,
        draftPicks: [],
        draftLog: [],
        chatMessages: [],
        tradeOffers: [],
        waiverClaims: [],
        schedule: [],
        currentWeek: 1,
        allPlayers: [],
        draftCommentary: [],
        settings: {
}
          draftFormat: &apos;SNAKE&apos;,
          teamCount: 10,
          rosterSize: 16,
          scoring: &apos;PPR&apos;,
          tradeDeadline: 10, // week 10
          playoffFormat: &apos;4_TEAM&apos;,
          waiverRule: &apos;FAAB&apos;,
          aiAssistanceLevel: &apos;FULL&apos;,
          ...leagueData.settings
        },
        ...leagueData
      };

      // Add new league to state
      dispatch({
}
        type: &apos;SET_LEAGUES&apos;,
        payload: [...state.leagues, newLeague]
      });

      // Set as active league
      dispatch({
}
        type: &apos;SET_ACTIVE_LEAGUE&apos;,
        payload: newLeague.id
      });

      setIsLoading(false);
    
    `${state.user.name}&apos;s Team`,
          owner: state.user,
          avatar: &apos;&apos;,
          roster: [],
          budget: 200,
          faab: 100,
          record: { wins: 0, losses: 0, ties: 0 },
          futureDraftPicks: []
        };

        const updatedLeague = {
}
          ...availableLeague,
          teams: [...availableLeague.teams, newTeam],
          members: [...availableLeague.members, state.user]
        };

        // Update leagues array
        const updatedLeagues = state.leagues.map((l: any) => 
          l.id === availableLeague.id ? updatedLeague : l
        );
        
        dispatch({
}
          type: &apos;SET_LEAGUES&apos;,
          payload: updatedLeagues
        });

        // Set as active league
        dispatch({
}
          type: &apos;SET_ACTIVE_LEAGUE&apos;,
          payload: updatedLeague.id
        });
      }
      
      setIsLoading(false);
    
    } catch (error) {
}
      setIsLoading(false);
    }
  };

  return {
}
    league,
    myTeam,
    isCommissioner,
    isLoading,
    selectLeague,
    createLeague,
    updateLeagueSettings,
//     joinLeague
  };
};