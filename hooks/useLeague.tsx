/**
 * Hook for managing league operations
 */

import React from 'react';
import { useAppState } from '../contexts/AppContext';
import { League, Team } from '../types';

interface UseLeagueReturn {
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
  const { state, dispatch } = useAppState();
  const [isLoading, setIsLoading] = React.useState(false);
  
  // Get current league from state
  const league = state.activeLeagueId 
    ? state.leagues.find((l: any) => l.id === state.activeLeagueId) || null
    : null;
  
  // Get user's team in current league
  const myTeam = React.useMemo(() => {
    if (!league || !state.user) return null;
    return league.teams.find((t: any) => t.owner.id === state.user!.id) || null;
  }, [league, state.user]);

  // Check if current user is commissioner
  const isCommissioner = React.useMemo(() => {
    if (!league || !state.user) return false;
    return league.commissionerId === state.user.id;
  }, [league, state.user]);

  const selectLeague = (leagueId: string) => {
    dispatch({
      type: 'SET_ACTIVE_LEAGUE',
      payload: leagueId
    });
  };

  const createLeague = async (leagueData: Partial<League>) => {
    if (!state.user) return;
    
    setIsLoading(true);
    try {
      const newLeague: League = {
        id: `league_${Date.now()}`,
        name: leagueData.name || 'New League',
        commissionerId: state.user.id,
        teams: [],
        members: [state.user],
        status: 'PRE_DRAFT',
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
          draftFormat: 'SNAKE',
          teamCount: 10,
          rosterSize: 16,
          scoring: 'PPR',
          tradeDeadline: 10, // week 10
          playoffFormat: '4_TEAM',
          waiverRule: 'FAAB',
          aiAssistanceLevel: 'FULL',
          ...leagueData.settings
        },
        ...leagueData
      };

      // Add new league to state
      dispatch({
        type: 'SET_LEAGUES',
        payload: [...state.leagues, newLeague]
      });

      // Set as active league
      dispatch({
        type: 'SET_ACTIVE_LEAGUE',
        payload: newLeague.id
      });

      setIsLoading(false);
    
    `${state.user.name}'s Team`,
          owner: state.user,
          avatar: '',
          roster: [],
          budget: 200,
          faab: 100,
          record: { wins: 0, losses: 0, ties: 0 },
          futureDraftPicks: []
        };

        const updatedLeague = {
          ...availableLeague,
          teams: [...availableLeague.teams, newTeam],
          members: [...availableLeague.members, state.user]
        };

        // Update leagues array
        const updatedLeagues = state.leagues.map((l: any) => 
          l.id === availableLeague.id ? updatedLeague : l
        );
        
        dispatch({
          type: 'SET_LEAGUES',
          payload: updatedLeagues
        });

        // Set as active league
        dispatch({
          type: 'SET_ACTIVE_LEAGUE',
          payload: updatedLeague.id
        });
      }
      
      setIsLoading(false);
    
    } catch (error) {
      setIsLoading(false);
    }
  };

  return {
    league,
    myTeam,
    isCommissioner,
    isLoading,
    selectLeague,
    createLeague,
    updateLeagueSettings,
    joinLeague
  };
};