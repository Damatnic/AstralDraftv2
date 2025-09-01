
import { ErrorBoundary } from &apos;./ErrorBoundary&apos;;
import React, { useCallback, useMemo } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;
import { ChevronDownIcon } from &apos;../icons/ChevronDownIcon&apos;;
import { Avatar } from &apos;./Avatar&apos;;

const TeamSwitcher: React.FC = () => {
}
  const [isLoading, setIsLoading] = React.useState(false);
    const { state, dispatch } = useAppState();
    const [isOpen, setIsOpen] = React.useState(false);
    const wrapperRef = React.useRef<HTMLDivElement>(null);

    const activeLeague = state.leagues.find((l: any) => l.id === state.activeLeagueId);
    const myActiveTeam = activeLeague?.teams.find((t: any) => t.owner.id === state.user?.id);
    
    const otherTeams = state.leagues
        .filter((l: any) => !l.isMock && l.id !== state.activeLeagueId)
        .map((l: any) => ({
}
            leagueId: l.id,
            team: l.teams.find((t: any) => t.owner.id === state.user?.id)
        }))
        .filter((item: any) => item.team);

    React.useEffect(() => {
}
        function handleClickOutside(event: MouseEvent) {
}
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
}
                setIsOpen(false);


        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [wrapperRef]);
    
    const handleSwitch = (leagueId: string) => {
}
        dispatch({ type: &apos;SET_ACTIVE_LEAGUE&apos;, payload: leagueId });
        dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;TEAM_HUB&apos; });
        setIsOpen(false);

    return (
        <div className="relative sm:px-4 md:px-6 lg:px-8" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
            >
                {myActiveTeam ? (
}
                    <>
                        <Avatar avatar={myActiveTeam.avatar} className="w-6 h-6 rounded sm:px-4 md:px-6 lg:px-8" />
                        <span className="text-sm font-semibold hidden md:block">{myActiveTeam.name}</span>
                    </>
                ) : (
                    <span className="text-sm font-semibold sm:px-4 md:px-6 lg:px-8">Select Team</span>
                )}
                 <ChevronDownIcon />
            </button>
            <AnimatePresence>
                {isOpen && otherTeams.length > 0 && (
}
                    <motion.div
                        className="absolute top-full right-0 mt-2 w-64 bg-slate-800/90 backdrop-blur-md border border-white/10 rounded-lg shadow-lg z-50 p-2 sm:px-4 md:px-6 lg:px-8"
                        {...{
}
                            initial: { opacity: 0, y: -10 },
                            animate: { opacity: 1, y: 0 },
                            exit: { opacity: 0, y: -10 },
                        }}
                    >
                        {otherTeams.map((item: any) => (
}
                            item.team && (
                                <button
                                    key={item.leagueId}
                                    onClick={() => handleSwitch(item.leagueId)}
                                >
                                    <Avatar avatar={item.team.avatar} className="w-8 h-8 rounded-md sm:px-4 md:px-6 lg:px-8" />
                                    <div>
                                        <p className="font-semibold text-sm sm:px-4 md:px-6 lg:px-8">{item.team.name}</p>
                                        <p className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">{state.leagues.find((l: any) => l.id === item.leagueId)?.name}</p>
                                    </div>
                                </button>
                            )
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const TeamSwitcherWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <TeamSwitcher {...props} />
  </ErrorBoundary>
);

export default React.memo(TeamSwitcherWithErrorBoundary);
