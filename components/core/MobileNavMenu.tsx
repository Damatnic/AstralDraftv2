
import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo } from &apos;react&apos;;
import { motion } from &apos;framer-motion&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;
import { View } from &apos;../../types&apos;;
import { CloseIcon } from &apos;../icons/CloseIcon&apos;;
import { Avatar } from &apos;../ui/Avatar&apos;;

const navItems: { id: View, label: string }[] = [
    { id: &apos;DASHBOARD&apos;, label: &apos;Dashboard&apos; },
    { id: &apos;LEAGUE_HUB&apos;, label: &apos;League Hub&apos; },
    { id: &apos;TEAM_HUB&apos;, label: &apos;Team Hub&apos; },
    { id: &apos;ASSISTANT&apos;, label: &apos;AI Assistant&apos; },
];

const MobileNavMenu: React.FC = () => {
}
    const { state, dispatch } = useAppState();

    const handleNav = (view: View) => {
}
        dispatch({ type: &apos;SET_VIEW&apos;, payload: view });
        dispatch({ type: &apos;TOGGLE_MOBILE_NAV&apos; });
    };

    return (
        <motion.div
            className="fixed inset-0 bg-black/60 z-50 sm:px-4 md:px-6 lg:px-8"
            onClick={() => dispatch({ type: &apos;TOGGLE_MOBILE_NAV&apos; })}
            {...{
}
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
            }}
        >
            <motion.div
                className="absolute top-0 right-0 h-full w-4/5 max-w-sm bg-slate-900/90 backdrop-blur-lg border-l border-white/10 flex flex-col sm:px-4 md:px-6 lg:px-8"
                onClick={(e: any) => e.stopPropagation()},
                    animate: { x: &apos;0%&apos; },
                    exit: { x: &apos;100%&apos; },
                    transition: { type: &apos;spring&apos;, stiffness: 300, damping: 30 },
                }}
            >
                <header className="p-4 flex justify-between items-center border-b border-white/10 sm:px-4 md:px-6 lg:px-8">
                    <h2 className="font-display font-bold text-lg sm:px-4 md:px-6 lg:px-8">Menu</h2>
                    <button onClick={() => dispatch({ type: &apos;TOGGLE_MOBILE_NAV&apos; }} className="p-1 rounded-full hover:bg-white/10 sm:px-4 md:px-6 lg:px-8">
                        <CloseIcon />
                    </button>
                </header>
                <nav className="flex-grow p-4 space-y-2 sm:px-4 md:px-6 lg:px-8">
                    {navItems.map((item: any) => {
}
                        const isDisabled = (item.id === &apos;LEAGUE_HUB&apos; || item.id === &apos;TEAM_HUB&apos;) && !state.activeLeagueId;
                        return (
                             <button
                                key={item.id}
                                onClick={() => handleNav(item.id)}
                                className={`w-full text-left p-3 text-lg font-semibold rounded-lg transition-colors focus:outline-none ${
}
                                    isDisabled ? &apos;opacity-50 cursor-not-allowed&apos; : &apos;hover:bg-cyan-400/10 hover:text-cyan-300&apos;
                                }`}
                            >
                               {item.label}
                            </button>
                        )
                    })}
                </nav>
                 <footer className="p-4 border-t border-white/10 sm:px-4 md:px-6 lg:px-8">
                     <button 
                        onClick={() => handleNav(&apos;PROFILE&apos;)}
                    >
                        <Avatar avatar={state.user?.avatar || &apos;/&apos;} className="w-10 h-10 text-2xl rounded-full sm:px-4 md:px-6 lg:px-8" />
                        <span className="font-semibold sm:px-4 md:px-6 lg:px-8">{state.user?.name || &apos;Guest&apos;}</span>
                    </button>
                </footer>
            </motion.div>
        </motion.div>
    );
};

const MobileNavMenuWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <MobileNavMenu {...props} />
  </ErrorBoundary>
);

export default React.memo(MobileNavMenuWithErrorBoundary);
