
import { useAppState } from &apos;../contexts/AppContext&apos;;

/**
 * A custom hook to conveniently access the active league and the user&apos;s team within that league.
 * This centralizes lookup logic and simplifies components.
 */
export const useLeague = () => {
}
    const { state } = useAppState();
    const league = state.leagues.find((l: any) => l.id === state.activeLeagueId);
    const myTeam = league?.teams.find((t: any) => t.owner.id === state.user?.id);

    return { league, myTeam };
};