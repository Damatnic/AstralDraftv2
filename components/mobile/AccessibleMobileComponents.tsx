/**
 * Accessible Mobile Components
 * Enhanced mobile components with full accessibility support
 */

import { motion, AnimatePresence, PanInfo } from &apos;framer-motion&apos;;
import {
}
    announceToScreenReader,
    useKeyboardNavigation,
    useFocusManagement,
    useReducedMotion,
} from &apos;../../utils/mobileAccessibilityUtils&apos;;

import {
}
    AccessibleButton,
    VisuallyHidden,
//     LiveRegion
} from &apos;../../utils/mobileAccessibilityComponents&apos;;
import { useThrottle } from &apos;../../utils/mobilePerformanceUtils&apos;;
import { RefreshCwIcon, ChevronDownIcon } from &apos;lucide-react&apos;;

interface AccessiblePullToRefreshProps {
}
    onRefresh: () => Promise<void>;
    children: React.ReactNode;
    refreshThreshold?: number;
    maxPullDistance?: number;
    disabled?: boolean;
    className?: string;

}

export const AccessiblePullToRefresh: React.FC<AccessiblePullToRefreshProps> = ({
}
    onRefresh,
    children,
    refreshThreshold = 80,
    maxPullDistance = 120,
    disabled = false,
    className = &apos;&apos;
}: any) => {
}
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [pullState, setPullState] = React.useState<&apos;idle&apos; | &apos;pulling&apos; | &apos;ready&apos; | &apos;refreshing&apos;>(&apos;idle&apos;);
    const [announcement, setAnnouncement] = React.useState(&apos;&apos;);
    
    const pullY = React.useRef(0);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const startScrollTop = React.useRef(0);
    const prefersReducedMotion = useReducedMotion();

    const handlePanStart = (event: any, info: PanInfo) => {
}
        if (disabled || isRefreshing) return;
        
        const container = containerRef.current;
        if (!container) return;
        
        startScrollTop.current = container.scrollTop;
        
        // Only allow pull-to-refresh at the top of the scroll
        if (startScrollTop.current <= 0) {
}
            setPullState(&apos;pulling&apos;);
            setAnnouncement(&apos;Pull to refresh started&apos;);

    };

    const handlePan = useThrottle((event: any, info: PanInfo) => {
}
        if (disabled || isRefreshing || pullState === &apos;idle&apos;) return;
        
        const container = containerRef.current;
        if (!container) return;
        
        // Only pull down when at the top
        if (container.scrollTop > 0) {
}
            setPullState(&apos;idle&apos;);
            pullY.current = 0;
            return;

        const deltaY = Math.max(0, info.offset.y);
        const dampedY = Math.min(deltaY * 0.6, maxPullDistance);
        
        pullY.current = dampedY;
        
        if (dampedY >= refreshThreshold && pullState !== &apos;ready&apos;) {
}
            setPullState(&apos;ready&apos;);
            setAnnouncement(&apos;Release to refresh&apos;);
        } else if (dampedY < refreshThreshold && pullState !== &apos;pulling&apos;) {
}
            setPullState(&apos;pulling&apos;);
            setAnnouncement(&apos;Pull further to refresh&apos;);

    }, 16); // 60fps throttling

    const handlePanEnd = async (event: any, info: PanInfo) => {
}
        if (disabled || isRefreshing) return;
        
        if (pullState === &apos;ready&apos;) {
}
            setPullState(&apos;refreshing&apos;);
            setIsRefreshing(true);
            setAnnouncement(&apos;Refreshing content&apos;);
            
            try {
}

                await onRefresh();
                setAnnouncement(&apos;Content refreshed successfully&apos;);
            
    } catch (error) {
}
                setAnnouncement(&apos;Refresh failed. Please try again.&apos;);
            } finally {
}
                setIsRefreshing(false);
                setPullState(&apos;idle&apos;);
                pullY.current = 0;

        } else {
}
            setPullState(&apos;idle&apos;);
            pullY.current = 0;

    };

    // Keyboard support for refresh
    const handleKeyboardRefresh = React.useCallback(async () => {
}
        if (disabled || isRefreshing) return;
        
        setIsRefreshing(true);
        setAnnouncement(&apos;Refreshing content&apos;);
        
        try {
}

            await onRefresh();
            setAnnouncement(&apos;Content refreshed successfully&apos;);
        
    } catch (error) {
}
            setAnnouncement(&apos;Refresh failed. Please try again.&apos;);
        } finally {
}
            setIsRefreshing(false);

    }, [onRefresh, disabled, isRefreshing]);

    useKeyboardNavigation(containerRef as React.RefObject<HTMLElement>);

    const getPullIndicatorColor = () => {
}
        switch (pullState) {
}
            case &apos;ready&apos;:
                return &apos;text-green-500&apos;;
            case &apos;pulling&apos;:
                return &apos;text-blue-500&apos;;
            case &apos;refreshing&apos;:
                return &apos;text-blue-500&apos;;
            default:
                return &apos;text-gray-400&apos;;

    };

    const getStatusText = () => {
}
        switch (pullState) {
}
            case &apos;pulling&apos;:
                return &apos;Pull down to refresh&apos;;
            case &apos;ready&apos;:
                return &apos;Release to refresh&apos;;
            case &apos;refreshing&apos;:
                return &apos;Refreshing...&apos;;
            default:
                return &apos;&apos;;

    };

    return (
        <div className={`relative w-full h-full ${className}`}>
            {/* Live region for announcements */}
            <LiveRegion politeness="polite">{announcement}</LiveRegion>
            
            {/* Refresh button for keyboard users */}
            <div className="absolute top-2 right-2 z-10 sm:px-4 md:px-6 lg:px-8">
                <AccessibleButton>
                    onClick={handleKeyboardRefresh}
                    disabled={disabled || isRefreshing}
                    className="mobile-focus-ring text-sm px-2 py-1 sm:px-4 md:px-6 lg:px-8"
                    ariaLabel="Refresh content"
                >
                    <RefreshCwIcon className={`w-4 h-4 ${isRefreshing ? &apos;animate-spin&apos; : &apos;&apos;}`} />
                    <VisuallyHidden>Refresh</VisuallyHidden>
                </AccessibleButton>
            </div>

            {/* Main content area */}
            <motion.div
                ref={containerRef}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.1}
                onDragStart={handlePanStart}
                onDrag={handlePan}
                onDragEnd={handlePanEnd}
                className="w-full h-full overflow-auto sm:px-4 md:px-6 lg:px-8"
                style={{
}
                    transform: pullY.current > 0 ? `translateY(${pullY.current}px)` : &apos;none&apos;
                }}
                role="main"
                aria-label="Content area with pull-to-refresh"
                tabIndex={0}
            >
                {/* Pull indicator */}
                <AnimatePresence>
                    {pullState !== &apos;idle&apos; && (
}
                        <motion.div
                            initial={prefersReducedMotion ? {} : { opacity: 0, y: -20 }}
                            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                            exit={prefersReducedMotion ? {} : { opacity: 0, y: -20 }}
                            className={`flex flex-col items-center justify-center py-4 ${getPullIndicatorColor()}`}
                            role="status"
                            aria-live="polite"
                            aria-label={getStatusText()}
                        >
                            <motion.div
                                animate={prefersReducedMotion ? {} : {
}
                                    rotate: pullState === &apos;refreshing&apos; ? 360 : 0,
                                    scale: pullState === &apos;ready&apos; ? 1.2 : 1
                                }}
                                transition={{
}
                                    rotate: { duration: 1, repeat: pullState === &apos;refreshing&apos; ? Infinity : 0 },
                                    scale: { duration: 0.2 }
                                }}
                            >
                                {pullState === &apos;refreshing&apos; ? (
}
                                    <RefreshCwIcon className="w-6 h-6 sm:px-4 md:px-6 lg:px-8" />
                                ) : (
                                    <ChevronDownIcon className="w-6 h-6 sm:px-4 md:px-6 lg:px-8" />
                                )}
                            </motion.div>
                            <span className="text-sm mt-2 font-medium sm:px-4 md:px-6 lg:px-8">
                                {getStatusText()}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Content */}
                {children}
            </motion.div>
        </div>
    );
};

interface AccessibleTouchAreaProps {
}
    onTap?: () => void;
    onLongPress?: () => void;
    onSwipe?: (direction: &apos;left&apos; | &apos;right&apos; | &apos;up&apos; | &apos;down&apos;) => void;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
    role?: string;
    ariaLabel?: string;

}

export const AccessibleTouchArea: React.FC<AccessibleTouchAreaProps> = ({
}
    onTap,
    onLongPress,
    onSwipe,
    children,
    className = &apos;&apos;,
    disabled = false,
    role = &apos;button&apos;,
//     ariaLabel
}: any) => {
}
    const [isPressed, setIsPressed] = React.useState(false);
    const longPressTimer = React.useRef<NodeJS.Timeout | undefined>(undefined);
    const prefersReducedMotion = useReducedMotion();

    const handleTapStart = () => {
}
        if (disabled) return;
        setIsPressed(true);
        
        if (onLongPress) {
}
            longPressTimer.current = setTimeout(() => {
}
                onLongPress();
                announceToScreenReader(&apos;Long press action activated&apos;, &apos;polite&apos;);
            }, 500);

    };

    const handleTapEnd = () => {
}
        setIsPressed(false);
        if (longPressTimer.current) {
}
            clearTimeout(longPressTimer.current);

    };

    const handleTap = () => {
}
        if (disabled) return;
        if (onTap) {
}
            onTap();

    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
}
        if (disabled) return;
        
        if (event.key === &apos;Enter&apos; || event.key === &apos; &apos;) {
}
            event.preventDefault();
            if (onTap) {
}
                onTap();


    };

    const handlePan = (event: any, info: PanInfo) => {
}
        if (disabled || !onSwipe) return;
        
        const { offset } = info;
        const threshold = 50;
        
        if (Math.abs(offset.x) > Math.abs(offset.y)) {
}
            // Horizontal swipe
            if (offset.x > threshold) {
}
                onSwipe(&apos;right&apos;);
            } else if (offset.x < -threshold) {
}
                onSwipe(&apos;left&apos;);

        } else {
}
            // Vertical swipe
            if (offset.y > threshold) {
}
                onSwipe(&apos;down&apos;);
            } else if (offset.y < -threshold) {
}
                onSwipe(&apos;up&apos;);


    };

    return (
        <motion.div
            className={`mobile-touch-target mobile-focus-ring ${className} ${disabled ? &apos;opacity-50 cursor-not-allowed&apos; : &apos;cursor-pointer&apos;}`}
            whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
            onTapStart={handleTapStart}
            onTap={handleTap}
            onTapCancel={handleTapEnd}
            onPan={onSwipe ? handlePan : undefined}
            onKeyDown={handleKeyDown}
            role={role}
            aria-label={ariaLabel}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
        >
            {children}
        </motion.div>
    );
};
