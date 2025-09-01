

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;
import { players } from &apos;../../data/players&apos;;
import type { Player, View } from &apos;../../types&apos;;
import { HistoryIcon } from &apos;../icons/HistoryIcon&apos;;
import { useFocusTrap } from &apos;../../utils/accessibility&apos;;

interface CommandPaletteProps {
}
  [key: string]: unknown;
}

const CommandPalette: React.FC<CommandPaletteProps> = () => {
}
  const [isLoading, setIsLoading] = React.useState(false);
    const { state, dispatch } = useAppState();
    const [query, setQuery] = React.useState(&apos;&apos;);
    const { containerRef } = useFocusTrap(state.isCommandPaletteOpen);

    const leagues = state.leagues.filter((l: any) => !l.isMock);

    React.useEffect(() => {
}
        const handleKeyDown = (e: KeyboardEvent) => {
}
            // Enhanced keyboard navigation
            if ((e.metaKey || e.ctrlKey) && e.key === &apos;k&apos;) {
}
                e.preventDefault();
                dispatch({ type: &apos;SET_COMMAND_PALETTE_OPEN&apos;, payload: !state.isCommandPaletteOpen });

            if (e.key === &apos;Escape&apos;) {
}
                dispatch({ type: &apos;SET_COMMAND_PALETTE_OPEN&apos;, payload: false });
                setQuery(&apos;&apos;); // Clear query on close

            // Quick navigation shortcuts when palette is open
            if (state.isCommandPaletteOpen) {
}
                if (e.key === &apos;ArrowDown&apos; || e.key === &apos;ArrowUp&apos;) {
}
                    e.preventDefault();
                    // Handle arrow navigation (implementation would depend on results structure)

                if (e.key === &apos;Enter&apos;) {
}
                    e.preventDefault();
                    // Handle selection (implementation would depend on selected item)


        };
        window.addEventListener(&apos;keydown&apos;, handleKeyDown);
        return () => window.removeEventListener(&apos;keydown&apos;, handleKeyDown);
    }, [state.isCommandPaletteOpen, dispatch]);
    
    React.useEffect(() => {
}
        if (!state.isCommandPaletteOpen) {
}
            setQuery(&apos;&apos;);
    }
  }, [state.isCommandPaletteOpen]);

    const handleSelectLeague = (id: string) => {
}
        dispatch({ type: &apos;SET_ACTIVE_LEAGUE&apos;, payload: id });
        dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;LEAGUE_HUB&apos; });
        dispatch({ type: &apos;SET_COMMAND_PALETTE_OPEN&apos;, payload: false });

    const handleSelectPlayer = (player: Player) => {
}
        dispatch({ type: &apos;SET_PLAYER_DETAIL&apos;, payload: { player } });
        dispatch({ type: &apos;SET_COMMAND_PALETTE_OPEN&apos;, payload: false });

    const handleSelectView = (view: View, name: string) => {
}
        dispatch({ type: &apos;SET_VIEW&apos;, payload: view });
        dispatch({ type: &apos;LOG_COMMAND&apos;, payload: { name, view }});
        dispatch({ type: &apos;SET_COMMAND_PALETTE_OPEN&apos;, payload: false });

    const commandActions = state.activeLeagueId ? [
        { name: &apos;Go to My Team&apos;, view: &apos;TEAM_HUB&apos; as View },
        { name: &apos;View Standings&apos;, view: &apos;LEAGUE_STANDINGS&apos; as View },
        { name: &apos;Waiver Wire&apos;, view: &apos;WAIVER_WIRE&apos; as View },
        { name: &apos;Power Rankings&apos;, view: &apos;POWER_RANKINGS&apos; as View },
        { name: &apos;Analytics Hub&apos;, view: &apos;ANALYTICS_HUB&apos; as View },
        { name: &apos;Historical Analytics&apos;, view: &apos;HISTORICAL_ANALYTICS&apos; as View },
        { name: &apos;Go to Dashboard&apos;, view: &apos;DASHBOARD&apos; as View },
    ] : [{ name: &apos;Go to Dashboard&apos;, view: &apos;DASHBOARD&apos; as View }];

    const queryLower = query.toLowerCase();

    const filteredPlayers = query.length > 2
        ? players.filter((p: any) => p.name.toLowerCase().includes(queryLower)).slice(0, 5)
        : [];
    
    const filteredActions = query.length > 1
        ? commandActions.filter((a: any) => a.name.toLowerCase().includes(queryLower))
        : [];

    const renderResults = () => {
}
        if (query.length === 0) {
}
            return (
                <>
                    {state.recentCommands.length > 0 && (
}
                         <>
                            <h4 className="px-3 py-1 text-xs text-gray-500 font-semibold uppercase flex items-center gap-2 sm:px-4 md:px-6 lg:px-8"><HistoryIcon className="h-4 w-4 sm:px-4 md:px-6 lg:px-8" /> Recent</h4>
                            {state.recentCommands.map((cmd, i) => (
}
                                <button key={i} onClick={() => handleSelectView(cmd.view, cmd.name)}
                                </button>
                            ))}
                        </>
                    )}
                    <h4 className="px-3 py-1 text-xs text-gray-500 font-semibold uppercase sm:px-4 md:px-6 lg:px-8">My Leagues</h4>
                    {leagues.map((league: any) => (
}
                        <button key={league.id} onClick={() => handleSelectLeague(league.id)}
                        </button>
                    ))}
                </>
            )

        return (
            <>
                {filteredPlayers.length > 0 && (
}
                    <>
                        <h4 className="px-3 py-1 text-xs text-gray-500 font-semibold uppercase sm:px-4 md:px-6 lg:px-8">Players</h4>
                        {filteredPlayers.map((player: any) => (
}
                            <button key={player.id} onClick={() => handleSelectPlayer(player)} <span className="text-gray-500 sm:px-4 md:px-6 lg:px-8">({player.position} - {player.team})</span>
                            </button>
                        ))}
                    </>
                )}
                {filteredActions.length > 0 && (
}
                     <>
                        <h4 className="px-3 py-1 text-xs text-gray-500 font-semibold uppercase sm:px-4 md:px-6 lg:px-8">Navigation</h4>
                        {filteredActions.map((action: any) => (
}
                            <button key={action.view} onClick={() => handleSelectView(action.view, action.name)}
                            </button>
                        ))}
                    </>
                )}
                 {filteredPlayers.length === 0 && filteredActions.length === 0 && (
}
                    <p className="p-4 text-center text-gray-500 sm:px-4 md:px-6 lg:px-8">No results found.</p>
                 )}
            </>
        )
    };

    return (
        <AnimatePresence>
            {state.isCommandPaletteOpen && (
}
                 <motion.div
                    className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-[20vh] sm:px-4 md:px-6 lg:px-8"
                    onClick={() => dispatch({ type: &apos;SET_COMMAND_PALETTE_OPEN&apos;, payload: false })}
                    {...{
}
                        initial: { opacity: 0 },
                        animate: { opacity: 1 },
                        exit: { opacity: 0 },
                    }}
                >
                    <motion.div
                        ref={containerRef as React.RefObject<HTMLDivElement>}
                        className="glass-pane w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8"
                        onClick={(e: any) => e.stopPropagation()},
                            animate: { opacity: 1, y: 0, scale: 1 },
                            exit: { opacity: 0, y: -20, scale: 0.95 },
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Search players or navigate..."
                            className="w-full p-4 bg-transparent text-lg focus:outline-none text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8"
//                             autoFocus
                            value={query}
                            onChange={(e: any) => setQuery(e.target.value)}
                        <div className="border-t border-[var(--panel-border)] p-2 max-h-96 overflow-y-auto sm:px-4 md:px-6 lg:px-8">
                           {renderResults()}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const CommandPaletteWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <CommandPalette {...props} />
  </ErrorBoundary>
);

export default React.memo(CommandPaletteWithErrorBoundary);