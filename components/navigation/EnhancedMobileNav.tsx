/**
 * Enhanced Mobile Navigation Bar
 * Provides advanced mobile navigation with haptic feedback and gesture support
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo, useState, useEffect, useCallback } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { useAdvancedTouch } from &apos;../../hooks/useAdvancedTouch&apos;;
import { useMobileViewport } from &apos;../../hooks/useMobileViewport&apos;;
import { ZapIcon } from &apos;../icons/ZapIcon&apos;;
import { TrophyIcon } from &apos;../icons/TrophyIcon&apos;;
import { UserIcon } from &apos;../icons/UserIcon&apos;;
import { SettingsIcon } from &apos;../icons/SettingsIcon&apos;;
import { ChartBarIcon } from &apos;../icons/ChartBarIcon&apos;;
import { LayoutIcon } from &apos;../icons/LayoutIcon&apos;;
import type { View } from &apos;../../types&apos;;

interface NavigationItem {
}
  id: string;
  label: string;
  icon: React.ReactNode;
  view: View;
  badge?: number;
  disabled?: boolean;

}

interface EnhancedMobileNavProps {
}
  currentView: View;
  onNavigate: (view: View) => void;
  onToggleMenu?: () => void;
  className?: string;}

const navigationItems: NavigationItem[] = [
  {
}
    id: &apos;dashboard&apos;,
    label: &apos;Home&apos;,
    icon: <LayoutIcon />,
    view: &apos;DASHBOARD&apos;
  },
  {
}
    id: &apos;oracle&apos;,
    label: &apos;Oracle&apos;,
    icon: <ZapIcon />,
    view: &apos;BEAT_THE_ORACLE&apos;
  },
  {
}
    id: &apos;analytics&apos;,
    label: &apos;Stats&apos;,
    icon: <ChartBarIcon />,
    view: &apos;ANALYTICS_HUB&apos;
  },
  {
}
    id: &apos;leagues&apos;,
    label: &apos;Leagues&apos;,
    icon: <TrophyIcon />,
    view: &apos;LEAGUE_HUB&apos;
  },
  {
}
    id: &apos;profile&apos;,
    label: &apos;Profile&apos;,
    icon: <UserIcon />,
    view: &apos;PROFILE&apos;

];

export const EnhancedMobileNav: React.FC<EnhancedMobileNavProps> = ({
}
  currentView,
  onNavigate,
  onToggleMenu,
  className = &apos;&apos;
}: any) => {
}
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPressed, setIsPressed] = useState<string | null>(null);
  const [longPressTarget, setLongPressTarget] = useState<string | null>(null);
  
  const { viewportInfo, safeAreaInsets } = useMobileViewport();

  // Handle gesture callback first
  const handleGesture = useCallback((gesture: any) => {
}
    if (gesture.type === &apos;longpress&apos; && longPressTarget) {
}
      // Long press opens context menu or quick actions
      if (onToggleMenu) {
}
        onToggleMenu();


  }, [longPressTarget, onToggleMenu]);
  
  const { triggerHaptic } = useAdvancedTouch({
}
    hapticFeedback: true,
    longPressDelay: 600
  }, handleGesture);

  // Update active index when current view changes
  useEffect(() => {
}
    const index = navigationItems.findIndex((item: any) => item.view === currentView);
    if (index !== -1) {
}
      setActiveIndex(index);
    }
  }, [currentView]);

  const handleNavItemPress = useCallback((item: NavigationItem, index: number) => {
}
    if (item.disabled) return;
    
    setIsPressed(item.id);
    setActiveIndex(index);
    triggerHaptic(&apos;light&apos;);
    
    // Small delay for visual feedback
    setTimeout(() => {
}
      onNavigate(item.view);
      setIsPressed(null);
    }, 100);
  }, [onNavigate, triggerHaptic]);

  const handleLongPress = useCallback((itemId: string) => {
}
    setLongPressTarget(itemId);
    triggerHaptic(&apos;medium&apos;);
  }, [triggerHaptic]);

  return (
    <motion.nav
      className={`
}
        fixed bottom-0 left-0 right-0 z-50
        bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl
        border-t border-gray-200/50 dark:border-gray-700/50
        shadow-lg shadow-black/5
        ${className}
      `}
      style={{
}
        paddingBottom: `calc(var(--safe-area-inset-bottom, 0px) + 8px)`,
        height: `calc(72px + var(--safe-area-inset-bottom, 0px))`
      }}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: &apos;spring&apos;, damping: 20 }}
    >
      {/* Background blur effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-900/60 sm:px-4 md:px-6 lg:px-8" />
      
      {/* Navigation Items */}
      <div className="relative flex items-center justify-around h-full px-4 sm:px-4 md:px-6 lg:px-8">
        {navigationItems.map((item, index) => {
}
          const isActive = activeIndex === index;
          const isCurrentPressed = isPressed === item.id;

  if (isLoading) {
}
    return (
      <div className="flex justify-center items-center p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 sm:px-4 md:px-6 lg:px-8"></div>
        <span className="ml-2 sm:px-4 md:px-6 lg:px-8">Loading...</span>
      </div>
    );

  return (
            <motion.button
              key={item.id}
              onTouchStart={() => handleLongPress(item.id)}
              onClick={() => handleNavItemPress(item, index)}
              className={`
}
                relative flex flex-col items-center justify-center
                min-w-[48px] min-h-[48px] p-2 rounded-xl
                transition-all duration-200 ease-out
                ${item.disabled 
}
                  ? &apos;opacity-40 cursor-not-allowed&apos; 
                  : &apos;cursor-pointer touch-manipulation&apos;

                ${isActive 
}
                  ? &apos;text-blue-600 dark:text-blue-400&apos; 
                  : &apos;text-gray-600 dark:text-gray-400&apos;

                active:scale-95
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
}
                scale: isCurrentPressed ? 0.9 : 1,
                y: isActive ? -2 : 0
              }}
              transition={{ type: &apos;spring&apos;, stiffness: 400, damping: 25 }}
            >
              {/* Active indicator */}
              <AnimatePresence>
                {isActive && (
}
                  <motion.div
                    className="absolute -top-1 left-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full sm:px-4 md:px-6 lg:px-8"
                    style={{ x: &apos;-50%&apos; }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: &apos;spring&apos;, stiffness: 500 }}
                  />
                )}
              </AnimatePresence>

              {/* Icon container */}
              <div className={`
}
                flex items-center justify-center w-6 h-6 mb-1
                transition-transform duration-200
                ${isActive ? &apos;scale-110&apos; : &apos;scale-100&apos;}
              `}>
                {item.icon}
              </div>

              {/* Label */}
              <span className={`
}
                text-xs font-medium leading-none
                transition-all duration-200
                ${isActive ? &apos;font-semibold&apos; : &apos;font-normal&apos;}
              `}>
                {item.label}
              </span>

              {/* Badge */}
              {Boolean(item.badge && item.badge > 0) && (
}
                <motion.div
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 sm:px-4 md:px-6 lg:px-8"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: &apos;spring&apos;, stiffness: 500, delay: 0.1 }}
                >
                  {item.badge && item.badge > 99 ? &apos;99+&apos; : item.badge}
                </motion.div>
              )}

              {/* Ripple effect */}
              {isCurrentPressed && (
}
                <motion.div
                  className="absolute inset-0 bg-blue-500/20 rounded-xl sm:px-4 md:px-6 lg:px-8"
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 1.2, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Gesture hint for new users */}
      <AnimatePresence>
        {longPressTarget && (
}
          <motion.div
            className="absolute -top-12 left-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-lg sm:px-4 md:px-6 lg:px-8"
            style={{ x: &apos;-50%&apos; }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            Hold for quick actions
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const EnhancedMobileNavWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <EnhancedMobileNav {...props} />
  </ErrorBoundary>
);

export default React.memo(EnhancedMobileNavWithErrorBoundary);
