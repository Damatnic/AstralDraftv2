/**
 * Enhanced Mobile Navigation Component
 * Provides accessible mobile navigation with proper touch targets
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo } from &apos;react&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { CloseIcon } from &apos;../icons/CloseIcon&apos;;
import { ZapIcon } from &apos;../icons/ZapIcon&apos;;
import { TrophyIcon } from &apos;../icons/TrophyIcon&apos;;
import { UserIcon } from &apos;../icons/UserIcon&apos;;
import { SettingsIcon } from &apos;../icons/SettingsIcon&apos;;
import { ArrowRightIcon } from &apos;../icons/ArrowRightIcon&apos;;
import { ChartBarIcon } from &apos;../icons/ChartBarIcon&apos;;
import { LayoutIcon } from &apos;../icons/LayoutIcon&apos;;
import { LazyImage } from &apos;../ui/LazyImage&apos;;
import type { View } from &apos;../../types&apos;;
import { useFocusTrap } from &apos;../../utils/accessibility&apos;;

interface MobileNavItem {
}
  id: string;
  label: string;
  icon: React.ReactNode;
  view: View;
  badge?: number;
  disabled?: boolean;

}

const MobileNavigation: React.FC = () => {
}
  const [isLoading, setIsLoading] = React.useState(false);
  const { state, dispatch } = useAppState();
  const { isMobileNavOpen } = state;
  const { containerRef } = useFocusTrap(isMobileNavOpen);

  const navigationItems: MobileNavItem[] = [
    {
}
      id: &apos;dashboard&apos;,
      label: &apos;Dashboard&apos;,
      icon: <LayoutIcon />,
      view: &apos;DASHBOARD&apos;
    },
    {
}
      id: &apos;oracle&apos;,
      label: &apos;Beat The Oracle&apos;,
      icon: <ZapIcon />,
      view: &apos;BEAT_THE_ORACLE&apos;
    },
    {
}
      id: &apos;draft&apos;,
      label: &apos;Draft Room&apos;,
      icon: <TrophyIcon />,
      view: &apos;DRAFT_ROOM&apos;
    },
    {
}
      id: &apos;analytics&apos;,
      label: &apos;Analytics Hub&apos;,
      icon: <ChartBarIcon />,
      view: &apos;ANALYTICS_HUB&apos;
    },
    {
}
      id: &apos;historical-analytics&apos;,
      label: &apos;Historical Analytics&apos;,
      icon: <ChartBarIcon />,
      view: &apos;HISTORICAL_ANALYTICS&apos;
    },
    {
}
      id: &apos;leaderboard&apos;,
      label: &apos;Leaderboard&apos;,
      icon: <TrophyIcon />,
      view: &apos;LEADERBOARD&apos;
    },
    {
}
      id: &apos;profile&apos;,
      label: &apos;Profile&apos;,
      icon: <UserIcon />,
      view: &apos;PROFILE&apos;
    },
    {
}
      id: &apos;commissioner&apos;,
      label: &apos;Commissioner Tools&apos;,
      icon: <SettingsIcon />,
      view: &apos;COMMISSIONER_TOOLS&apos;

  ];

  const handleNavItemClick = (view: View) => {
}
    dispatch({ type: &apos;SET_VIEW&apos;, payload: view });
    dispatch({ type: &apos;TOGGLE_MOBILE_NAV&apos; }); // Close nav after selection
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
}
    if (e.target === e.currentTarget) {
}
      dispatch({ type: &apos;TOGGLE_MOBILE_NAV&apos; });

  };

  React.useEffect(() => {
}
    // Prevent body scroll when nav is open
    if (isMobileNavOpen) {
}
      document.body.style.overflow = &apos;hidden&apos;;
    } else {
}
      document.body.style.overflow = &apos;&apos;;

    // Cleanup on unmount
    return () => {
}
      document.body.style.overflow = &apos;&apos;;
    };
  }, [isMobileNavOpen]);

  // Focus trap for accessibility
  React.useEffect(() => {
}
    if (!isMobileNavOpen) return;

    const focusableElements = document.querySelectorAll(
      &apos;.mobile-nav button, .mobile-nav [tabindex="0"]&apos;
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
}
      if (e.key === &apos;Tab&apos;) {
}
        if (e.shiftKey) {
}
          if (document.activeElement === firstElement) {
}
            e.preventDefault();
            lastElement?.focus();

        } else if (document.activeElement === lastElement) {
}
          e.preventDefault();
          firstElement?.focus();


    };

    const handleEscapeKey = (e: KeyboardEvent) => {
}
      if (e.key === &apos;Escape&apos;) {
}
        dispatch({ type: &apos;TOGGLE_MOBILE_NAV&apos; });

    };

    document.addEventListener(&apos;keydown&apos;, handleTabKey);
    document.addEventListener(&apos;keydown&apos;, handleEscapeKey);
    firstElement?.focus();

    return () => {
}
      document.removeEventListener(&apos;keydown&apos;, handleTabKey);
      document.removeEventListener(&apos;keydown&apos;, handleEscapeKey);
    };
  }, [isMobileNavOpen, dispatch]);

  return (
    <AnimatePresence>
      {isMobileNavOpen && (
}
        <motion.dialog
          ref={containerRef as React.RefObject<HTMLDialogElement>}
//           open
          className="mobile-nav fixed inset-0 z-50 flex sm:px-4 md:px-6 lg:px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleOverlayClick}
          aria-label="Mobile Navigation"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm sm:px-4 md:px-6 lg:px-8" />
          
          {/* Navigation Panel */}
          <motion.div
            className="relative ml-auto h-full w-80 max-w-[85vw] bg-slate-900/95 backdrop-blur-xl border-l border-white/10 shadow-2xl sm:px-4 md:px-6 lg:px-8"
            initial={{ x: &apos;100%&apos; }}
            animate={{ x: 0 }}
            exit={{ x: &apos;100%&apos; }}
            transition={{ 
}
              type: &apos;spring&apos;, 
              damping: 25, 
              stiffness: 200,
              duration: 0.3 
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 sm:px-4 md:px-6 lg:px-8">
              <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                <LazyImage>
                  src="/favicon.svg" 
                  alt="Astral Draft" 
                  className="h-8 w-8 sm:px-4 md:px-6 lg:px-8"
                  loading="eager"
                />
                <h2 className="text-xl font-bold text-white font-display sm:px-4 md:px-6 lg:px-8">
                  ASTRAL DRAFT
                </h2>
              </div>
              <button
                onClick={() => dispatch({ type: &apos;TOGGLE_MOBILE_NAV&apos; })}
                className="mobile-touch-target flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors sm:px-4 md:px-6 lg:px-8"
                aria-label="Close navigation"
              >
                <CloseIcon className="w-5 h-5 text-white sm:px-4 md:px-6 lg:px-8" />
              </button>
            </div>

            {/* User Info */}
            <div className="p-6 border-b border-white/10 sm:px-4 md:px-6 lg:px-8">
              <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg sm:px-4 md:px-6 lg:px-8">
                  {(state.user?.name || &apos;G&apos;).charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">{state.user?.name || &apos;Guest&apos;}</h3>
                  <p className="text-white/60 text-sm sm:px-4 md:px-6 lg:px-8">
                    {state.leagues.filter((l: any) => l.members.some((m: any) => m.id === state.user?.id)).length} leagues
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 overflow-y-auto py-4 sm:px-4 md:px-6 lg:px-8" role="navigation">
              <ul className="space-y-2 px-4 sm:px-4 md:px-6 lg:px-8">
                {navigationItems.map((item: any) => (
}
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavItemClick(item.view)}
                      disabled={item.disabled}
                      className={`
}
                        mobile-nav-item group relative flex items-center justify-between w-full p-4 rounded-xl text-left transition-all duration-200
                        ${state.currentView === item.view 
}
                          ? &apos;bg-accent-500/20 text-accent-400 border border-accent-500/30&apos; 
                          : &apos;text-white/80 hover:text-white hover:bg-white/10&apos;

                        ${item.disabled ? &apos;opacity-50 cursor-not-allowed&apos; : &apos;cursor-pointer&apos;}
                        focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:ring-offset-2 focus:ring-offset-slate-900
                      `}
                      aria-current={state.currentView === item.view ? &apos;page&apos; : undefined}
                    >
                      <div className="flex items-center gap-4 sm:px-4 md:px-6 lg:px-8">
                        <div className={`
}
                          w-6 h-6 transition-colors duration-200
                          ${state.currentView === item.view ? &apos;text-accent-400&apos; : &apos;text-white/60 group-hover:text-white&apos;}
                        `}>
                          {item.icon}
                        </div>
                        <span className="font-medium text-base sm:px-4 md:px-6 lg:px-8">
                          {item.label}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                        {Boolean(item.badge && item.badge > 0) && (
}
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center sm:px-4 md:px-6 lg:px-8">
                            {item.badge && item.badge > 99 ? &apos;99+&apos; : item.badge}
                          </span>
                        )}
                        <ArrowRightIcon className={`
}
                          w-4 h-4 transition-all duration-200
                          ${state.currentView === item.view 
}
                            ? &apos;text-accent-400 transform rotate-90&apos; 
                            : &apos;text-white/40 group-hover:text-white/60 group-hover:transform group-hover:translate-x-1&apos;

                        `} />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 sm:px-4 md:px-6 lg:px-8">
              <div className="text-center text-white/60 text-sm sm:px-4 md:px-6 lg:px-8">
                <p>Astral Draft v2.0</p>
                <p className="mt-1 sm:px-4 md:px-6 lg:px-8">Fantasy Football Reimagined</p>
              </div>
            </div>
          </motion.div>
        </motion.dialog>
      )}
    </AnimatePresence>
  );
};

const MobileNavigationWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <MobileNavigation {...props} />
  </ErrorBoundary>
);

export default React.memo(MobileNavigationWithErrorBoundary);
