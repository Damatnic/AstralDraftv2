/**
 * Mobile Pull-to-Refresh Component
 * Implements native-style pull-to-refresh functionality with smooth animations
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback } from &apos;react&apos;;
import { motion, useMotionValue, useTransform, PanInfo } from &apos;framer-motion&apos;;
import { RefreshCwIcon } from &apos;lucide-react&apos;;
import { useThrottle } from &apos;../../utils/mobilePerformanceUtils&apos;;
import {
}
    announceToScreenReader,
    useReducedMotion,
} from &apos;../../utils/mobileAccessibilityUtils&apos;;

import {
}
//     VisuallyHidden
} from &apos;../../utils/mobileAccessibilityComponents&apos;;interface MobilePullToRefreshProps {
}
    onRefresh: () => Promise<void>;
    children: React.ReactNode;
    refreshThreshold?: number;
    maxPullDistance?: number;
    disabled?: boolean;
    className?: string;

}

const MobilePullToRefresh: React.FC<MobilePullToRefreshProps> = ({ onRefresh,
}
    children,
    refreshThreshold = 80,
    maxPullDistance = 120,
    disabled = false,
    className = &apos;&apos;
 }: any) => {
}
  const [isLoading, setIsLoading] = React.useState(false);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [pullState, setPullState] = React.useState<&apos;idle&apos; | &apos;pulling&apos; | &apos;ready&apos; | &apos;refreshing&apos;>(&apos;idle&apos;);
    
    const pullY = useMotionValue(0);
    const pullProgress = useTransform(pullY, [0, refreshThreshold], [0, 1]);
    const refreshIconRotation = useTransform(pullY, [0, refreshThreshold], [0, 180]);
    
    const containerRef = React.useRef<HTMLDivElement>(null);
    const startScrollTop = React.useRef(0);
    const prefersReducedMotion = useReducedMotion();

    // Announce state changes to screen readers
    React.useEffect(() => {
}
        switch (pullState) {
}
            case &apos;ready&apos;:
                announceToScreenReader(&apos;Ready to refresh, release to refresh content&apos;, &apos;polite&apos;);
                break;
            case &apos;refreshing&apos;:
                announceToScreenReader(&apos;Refreshing content, please wait&apos;, &apos;polite&apos;);
                break;
    }
  }, [pullState]);

    // Keyboard accessibility for refresh
    const handleKeyDown = (event: React.KeyboardEvent) => {
}
        if (event.key === &apos;r&apos; && (event.ctrlKey || event.metaKey)) {
}
            event.preventDefault();
            if (!disabled && !isRefreshing) {
}
                handleRefresh();
    }
  };

    const handleRefresh = async () => {
}
        if (disabled || isRefreshing) return;
        
        setPullState(&apos;refreshing&apos;);
        setIsRefreshing(true);
        announceToScreenReader(&apos;Refreshing content&apos;, &apos;assertive&apos;);
        
        try {
}

            await onRefresh();
            announceToScreenReader(&apos;Content refreshed successfully&apos;, &apos;polite&apos;);
        
    } catch (error) {
}
            announceToScreenReader(&apos;Failed to refresh content&apos;, &apos;assertive&apos;);
        } finally {
}
            setIsRefreshing(false);
            setPullState(&apos;idle&apos;);
            pullY.set(0);

    };

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
    }
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
            pullY.set(0);
            return;

        const deltaY = Math.max(0, info.offset.y);
        const dampedY = Math.min(deltaY * 0.6, maxPullDistance);
        
        pullY.set(dampedY);
        
        if (dampedY >= refreshThreshold) {
}
            setPullState(&apos;ready&apos;);
        } else {
}
            setPullState(&apos;pulling&apos;);

    }, 16); // ~60fps throttling

    const handlePanEnd = async () => {
}
    try {
}

        if (disabled || isRefreshing) return;
        
        if (pullState === &apos;ready&apos;) {
}
            await handleRefresh();
        
    } catch (error) {
}
      console.error(&apos;Error in handlePanEnd:&apos;, error);

    } catch (error) {
}
        console.error(error);
    }else {
}
            setPullState(&apos;idle&apos;);
            pullY.set(0);

    };

    const getPullIndicatorColor = () => {
}
        switch (pullState) {
}
            case &apos;ready&apos;:
                return &apos;text-green-400&apos;;
            case &apos;refreshing&apos;:
                return &apos;text-blue-400&apos;;
            default:
                return &apos;text-gray-400&apos;;

    };

    const getPullIndicatorText = () => {
}
        switch (pullState) {
}
            case &apos;pulling&apos;:
                return &apos;Pull to refresh&apos;;
            case &apos;ready&apos;:
                return &apos;Release to refresh&apos;;
            case &apos;refreshing&apos;:
                return &apos;Refreshing...&apos;;
            default:
                return &apos;&apos;;

    };

    React.useEffect(() => {
}
        if (isRefreshing) {
}
            pullY.set(refreshThreshold);
    }
  }, [isRefreshing, pullY, refreshThreshold]);

    return (
        <section 
            className={`relative h-full overflow-hidden ${className}`}
            aria-label="Pull to refresh content area"
            aria-live="polite"
            aria-busy={isRefreshing}
        >
            <VisuallyHidden>
                <button
                    onClick={handleRefresh}
                    onKeyDown={handleKeyDown}
                    disabled={disabled || isRefreshing}
                    aria-label="Refresh content (Ctrl+R)"
                >
                    Refresh Content
                </button>
            </VisuallyHidden>

            {/* Pull Indicator */}
            <motion.div
                style={{ 
}
                    y: useTransform(pullY, [0, refreshThreshold], [-60, 0]) 
                }}
                className="absolute top-0 left-0 right-0 z-10 sm:px-4 md:px-6 lg:px-8"
            >
                <output
                    className="flex flex-col items-center justify-center h-16 bg-[var(--panel-bg)] border-b border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8"
                    aria-live="polite"
                    aria-label={getPullIndicatorText()}
                >
                    <motion.div
                        style={{ 
}
                            rotate: prefersReducedMotion ? 0 : refreshIconRotation 
                        }}
                        className={`mb-1 ${getPullIndicatorColor()}`}
                        aria-hidden="true"
                    >
                        {pullState === &apos;refreshing&apos; ? (
}
                            <motion.div
                                animate={prefersReducedMotion ? {} : { rotate: 360 }}
                                transition={prefersReducedMotion ? {} : { duration: 1, repeat: Infinity, ease: &apos;linear&apos; }}
                            >
                                <RefreshCwIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
                            </motion.div>
                        ) : (
                            <RefreshCwIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
                        )}
                    </motion.div>
                    <motion.span
                        style={{ opacity: pullProgress }}
                        className={`text-xs font-medium ${getPullIndicatorColor()}`}
                    >
                        {getPullIndicatorText()}
                    </motion.span>
                    <VisuallyHidden>
                        {pullState === &apos;refreshing&apos; && &apos;Content is being refreshed&apos;}
                        {pullState === &apos;ready&apos; && &apos;Release to refresh content&apos;}
                        {pullState === &apos;pulling&apos; && &apos;Continue pulling down to refresh&apos;}
                    </VisuallyHidden>
                </output>
            </motion.div>

            {/* Content Container */}
            <motion.div
                ref={containerRef}
                style={{ y: pullY }}
                onPanStart={handlePanStart}
                onPan={handlePan}
                onPanEnd={handlePanEnd}
                drag={disabled ? false : "y"}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0}
                className="h-full overflow-y-auto overscroll-behavior-y-none mobile-scrollbar sm:px-4 md:px-6 lg:px-8"
                aria-label="Scrollable content"
            >
                {children}
            </motion.div>
        </section>
    );
};

const MobilePullToRefreshWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <MobilePullToRefresh {...props} />
  </ErrorBoundary>
);

export default React.memo(MobilePullToRefreshWithErrorBoundary);
