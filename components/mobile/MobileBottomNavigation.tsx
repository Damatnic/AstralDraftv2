/**
 * Mobile Bottom Navigation Component
 * Bottom sheet navigation optimized for mobile devices with gesture support
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo, useRef } from &apos;react&apos;;
import { motion, AnimatePresence, PanInfo } from &apos;framer-motion&apos;;
import { View } from &apos;../../types&apos;;
import { useMediaQuery } from &apos;../../hooks/useMediaQuery&apos;;
import { useThrottle } from &apos;../../utils/mobilePerformanceUtils&apos;;
import {
}
    announceToScreenReader,
    useKeyboardNavigation,
//     useReducedMotion
} from &apos;../../utils/mobileAccessibilityUtils&apos;;

import {
}
    VisuallyHidden,
} from &apos;../../utils/mobileAccessibilityComponents&apos;;
import { 
}
    HomeIcon,
    TrophyIcon,
    UsersIcon,
    BarChartIcon,
    UserIcon,
    MessageSquareIcon,
    CalendarIcon,
//     SearchIcon
} from &apos;lucide-react&apos;;

interface MobileBottomNavigationProps {
}
    activeView: View;
    onViewChange: (view: View) => void;
    notificationCount?: number;
    className?: string;

}

interface NavigationItem {
}
    id: View;
    label: string;
    icon: React.ReactNode;
    color: string;
    category: &apos;primary&apos; | &apos;secondary&apos;;
}

const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> = ({
}
    activeView,
    onViewChange,
    notificationCount = 0,
    className = &apos;&apos;
}: any) => {
}
    const isMobile = useMediaQuery(&apos;(max-width: 768px)&apos;);
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [dragY, setDragY] = React.useState(0);
    const prefersReducedMotion = useReducedMotion();
    const navRef = useRef<HTMLDivElement>(null);

    // Keyboard navigation for the bottom nav
    useKeyboardNavigation(navRef as React.RefObject<HTMLElement>);

    const primaryNavItems: NavigationItem[] = [
        {
}
            id: &apos;DASHBOARD&apos;,
            label: &apos;Dashboard&apos;,
            icon: <HomeIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />,
            color: &apos;text-blue-400&apos;,
            category: &apos;primary&apos;
        },
        {
}
            id: &apos;DRAFT_ROOM&apos;,
            label: &apos;Draft&apos;,
            icon: <TrophyIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />,
            color: &apos;text-green-400&apos;,
            category: &apos;primary&apos;
        },
        {
}
            id: &apos;LEAGUE_HUB&apos;,
            label: &apos;League&apos;,
            icon: <UsersIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />,
            color: &apos;text-purple-400&apos;,
            category: &apos;primary&apos;
        },
        {
}
            id: &apos;ANALYTICS_HUB&apos;,
            label: &apos;Analytics&apos;,
            icon: <BarChartIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />,
            color: &apos;text-orange-400&apos;,
            category: &apos;primary&apos;
        },
        {
}
            id: &apos;PROFILE&apos;,
            label: &apos;Profile&apos;,
            icon: <UserIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />,
            color: &apos;text-indigo-400&apos;,
            category: &apos;primary&apos;
        }
    ];

    const secondaryNavItems: NavigationItem[] = [
        {
}
            id: &apos;TEAM_HUB&apos;,
            label: &apos;My Team&apos;,
            icon: <TrophyIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />,
            color: &apos;text-yellow-400&apos;,
            category: &apos;secondary&apos;
        },
        {
}
            id: &apos;MATCHUP&apos;,
            label: &apos;Matchup&apos;,
            icon: <UsersIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />,
            color: &apos;text-red-400&apos;,
            category: &apos;secondary&apos;
        },
        {
}
            id: &apos;WAIVER_WIRE&apos;,
            label: &apos;Waivers&apos;,
            icon: <SearchIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />,
            color: &apos;text-cyan-400&apos;,
            category: &apos;secondary&apos;
        },
        {
}
            id: &apos;MESSAGES&apos;,
            label: &apos;Messages&apos;,
            icon: <MessageSquareIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />,
            color: &apos;text-pink-400&apos;,
            category: &apos;secondary&apos;
        },
        {
}
            id: &apos;LEAGUE_STANDINGS&apos;,
            label: &apos;Standings&apos;,
            icon: <BarChartIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />,
            color: &apos;text-emerald-400&apos;,
            category: &apos;secondary&apos;
        },
        {
}
            id: &apos;WEEKLY_REPORT&apos;,
            label: &apos;Report&apos;,
            icon: <CalendarIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />,
            color: &apos;text-violet-400&apos;,
            category: &apos;secondary&apos;
        }
    ];

    const handleDrag = useThrottle((event: any, info: PanInfo) => {
}
        const newY = Math.max(-100, Math.min(100, info.offset.y));
        setDragY(newY);
    }, 16); // 60fps throttling

    const handleDragEnd = (event: any, info: PanInfo) => {
}
        const threshold = 30;
        
        if (info.offset.y < -threshold) {
}
            setIsExpanded(true);
        } else if (info.offset.y > threshold) {
}
            setIsExpanded(false);
        }
        setDragY(0);
    };

    const renderNavItem = (item: NavigationItem, isActive: boolean) => {
}
        const handleClick = () => {
}
            onViewChange(item.id);
            announceToScreenReader(`Navigated to ${item.label}`, &apos;polite&apos;);
        };

        const buttonId = `nav-${item.id.toLowerCase()}`;
        const hasNotification = item.id === &apos;MESSAGES&apos; && notificationCount > 0;
        const ariaLabel = hasNotification 
            ? `${item.label} (${notificationCount} notifications)`
            : item.label;

        return (
            <motion.button
                key={item.id}
                id={buttonId}
                onClick={handleClick}
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                className={`mobile-touch-target mobile-focus-ring flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
}
//                     isActive
                        ? `${item.color} bg-white/10`
                        : &apos;text-[var(--text-secondary)] hover:text-[var(--text-primary)]&apos;
                }`}
                aria-label={ariaLabel}
                aria-current={isActive ? &apos;page&apos; : undefined}
                role="tab"
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
            >
                <div className="relative sm:px-4 md:px-6 lg:px-8" aria-hidden="true">
                    {item.icon}
                    {hasNotification && (
}
                        <motion.div
                            initial={prefersReducedMotion ? {} : { scale: 0 }}
                            animate={prefersReducedMotion ? {} : { scale: 1 }}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold sm:px-4 md:px-6 lg:px-8"
                            aria-hidden="true"
                        >
                            {notificationCount > 9 ? &apos;9+&apos; : notificationCount}
                        </motion.div>
                    )}
                </div>
                <span className="text-xs mt-1 font-medium sm:px-4 md:px-6 lg:px-8" aria-hidden="true">
                    {item.label}
                </span>
                {hasNotification && (
}
                    <VisuallyHidden>
                        {notificationCount} new notifications
                    </VisuallyHidden>
                )}
            </motion.button>
        );
    };

    if (!isMobile) {
}
        return null;
    }

    return (
        <nav 
            className={`fixed bottom-0 left-0 right-0 z-50 ${className}`}
            aria-label="Main navigation"
            role="navigation"
        >
            {/* Backdrop */}
            <AnimatePresence>
                {isExpanded && (
}
                    <motion.div
                        initial={prefersReducedMotion ? {} : { opacity: 0 }}
                        animate={prefersReducedMotion ? {} : { opacity: 1 }}
                        exit={prefersReducedMotion ? {} : { opacity: 0 }}
                        onClick={() => setIsExpanded(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm sm:px-4 md:px-6 lg:px-8"
                        style={{ zIndex: -1 }}
                        aria-hidden="true"
                    />
                )}
            </AnimatePresence>

            {/* Navigation Panel */}
            <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.1}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                animate={prefersReducedMotion ? {} : {
}
                    y: isExpanded ? -200 : 0,
                    height: isExpanded ? &apos;auto&apos; : 80
                }}
                style={{ y: dragY }}
                className="bg-[var(--panel-bg)]/95 backdrop-blur-lg border-t border-[var(--panel-border)] rounded-t-xl shadow-2xl sm:px-4 md:px-6 lg:px-8"
                role="tablist"
                aria-label="Navigation tabs"
            >
                {/* Drag Handle */}
                <div className="flex justify-center py-2 sm:px-4 md:px-6 lg:px-8">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mobile-touch-target mobile-focus-ring p-2 rounded-lg sm:px-4 md:px-6 lg:px-8"
                        aria-label={isExpanded ? "Collapse navigation" : "Expand navigation"}
                        aria-expanded={isExpanded}
                        aria-controls="secondary-navigation"
                    >
                        <motion.div
                            animate={prefersReducedMotion ? {} : { rotate: isExpanded ? 180 : 0 }}
                            className="w-8 h-1 bg-gray-400 rounded-full sm:px-4 md:px-6 lg:px-8"
                            aria-hidden="true"
                        />
                    </button>
                </div>

                {/* Primary Navigation */}
                <div className="px-4 pb-2 sm:px-4 md:px-6 lg:px-8">
                    <div className="grid grid-cols-5 gap-1 sm:px-4 md:px-6 lg:px-8">
                        {primaryNavItems.map((item: any) => 
}
                            renderNavItem(item, activeView === item.id)
                        )}
                    </div>
                </div>

                {/* Expanded Secondary Navigation */}
                <AnimatePresence>
                    {isExpanded && (
}
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: &apos;auto&apos; }}
                            exit={{ opacity: 0, height: 0 }}
                            className="px-4 pb-6 sm:px-4 md:px-6 lg:px-8"
                        >
                            <div className="border-t border-[var(--panel-border)] pt-4 mb-4 sm:px-4 md:px-6 lg:px-8">
                                <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3 sm:px-4 md:px-6 lg:px-8">
                                    More Options
                                </h3>
                                <div className="grid grid-cols-3 gap-2 sm:px-4 md:px-6 lg:px-8">
                                    {secondaryNavItems.map((item: any) => (
}
                                        <motion.button
                                            key={item.id}
                                            onClick={() => {
}
                                                onViewChange(item.id);
                                                setIsExpanded(false);
                                            }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${
}
                                                activeView === item.id
                                                    ? `${item.color} bg-white/10`
                                                    : &apos;text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5&apos;
                                            }`}
                                        >
                                            {item.icon}
                                            <span className="text-xs mt-1 font-medium sm:px-4 md:px-6 lg:px-8">
                                                {item.label}
                                            </span>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="grid grid-cols-2 gap-2 sm:px-4 md:px-6 lg:px-8">
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center justify-center gap-2 p-3 bg-blue-500/20 text-blue-400 rounded-lg sm:px-4 md:px-6 lg:px-8"
                                    onClick={() => {
}
                                        onViewChange(&apos;DRAFT_ROOM&apos;);
                                        setIsExpanded(false);
                                    }}
                                >
                                    <TrophyIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                    <span className="text-sm font-medium sm:px-4 md:px-6 lg:px-8">Start Draft</span>
                                </motion.button>
                                
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center justify-center gap-2 p-3 bg-green-500/20 text-green-400 rounded-lg sm:px-4 md:px-6 lg:px-8"
                                    onClick={() => {
}
                                        onViewChange(&apos;TEAM_HUB&apos;);
                                        setIsExpanded(false);
                                    }}
                                >
                                    <UsersIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                    <span className="text-sm font-medium sm:px-4 md:px-6 lg:px-8">My Team</span>
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Safe area padding for devices with home indicator */}
                <div className="h-safe-area-inset-bottom sm:px-4 md:px-6 lg:px-8" />
            </motion.div>
        </nav>
    );
};

export default React.memo(MobileBottomNavigation);
