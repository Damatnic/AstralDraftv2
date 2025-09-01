/**
 * Mobile Layout Wrapper
 * Provides responsive layout structure and mobile-specific navigation
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { useMediaQuery } from &apos;../../hooks/useMediaQuery&apos;;
import MobileBottomNavigation from &apos;./MobileBottomNavigation&apos;;
import { View } from &apos;../../types&apos;;
import { 
}
    announceToScreenReader, 
    useReducedMotion,
} from &apos;../../utils/mobileAccessibilityUtils&apos;;

import {
}
//     VisuallyHidden
} from &apos;../../utils/mobileAccessibilityComponents&apos;;

interface MobileLayoutWrapperProps {
}
    children: React.ReactNode;
    currentView: View;
    onViewChange: (view: View) => void;
    showBottomNav?: boolean;
    className?: string;

}

interface MobileLayoutConfig {
}
    hasBottomNav: boolean;
    hasPadding: boolean;
    hasScrollPadding: boolean;
    backgroundColor: string;
}

const MobileLayoutWrapper: React.FC<MobileLayoutWrapperProps> = ({
}
    children,
    currentView,
    onViewChange,
    showBottomNav = true,
    className = &apos;&apos;
}: any) => {
}
  const [isLoading, setIsLoading] = React.useState(false);
    const isMobile = useMediaQuery(&apos;(max-width: 768px)&apos;);
    const isTablet = useMediaQuery(&apos;(max-width: 1024px)&apos;);
    const [isKeyboardVisible, setIsKeyboardVisible] = React.useState(false);
    const [safeAreaInsets, setSafeAreaInsets] = React.useState({
}
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    });
    
    const prefersReducedMotion = useReducedMotion();

    // Announce view changes to screen readers
    React.useEffect(() => {
}
        // Convert view to readable format
        const viewLabel = currentView.replace(/_/g, &apos; &apos;).toLowerCase()
            .replace(/\b\w/g, l => l.toUpperCase());
        announceToScreenReader(`Navigated to ${viewLabel}`, &apos;polite&apos;);
    }, [currentView]);

    // Detect keyboard visibility (mobile virtual keyboards)
    React.useEffect(() => {
}
        if (!isMobile) return;

        const handleResize = () => {
}
            // On mobile, viewport height changes when keyboard appears
            const viewportHeight = window.visualViewport?.height || window.innerHeight;
            const documentHeight = document.documentElement.clientHeight;
            const keyboardHeight = documentHeight - viewportHeight;
            
            setIsKeyboardVisible(keyboardHeight > 150); // Threshold for keyboard detection
        };

        if (window.visualViewport) {
}
            window.visualViewport.addEventListener(&apos;resize&apos;, handleResize);
            return () => window.visualViewport?.removeEventListener(&apos;resize&apos;, handleResize);
        } else {
}
            window.addEventListener(&apos;resize&apos;, handleResize);
            return () => window.removeEventListener(&apos;resize&apos;, handleResize);
        }
    }, [isMobile]);

    // Detect safe area insets for devices with notches
    React.useEffect(() => {
}
        if (!isMobile) return;

        const updateSafeArea = () => {
}
            const computedStyle = getComputedStyle(document.documentElement);
            setSafeAreaInsets({
}
                top: parseInt(computedStyle.getPropertyValue(&apos;--safe-area-inset-top&apos;) || &apos;0&apos;),
                bottom: parseInt(computedStyle.getPropertyValue(&apos;--safe-area-inset-bottom&apos;) || &apos;0&apos;),
                left: parseInt(computedStyle.getPropertyValue(&apos;--safe-area-inset-left&apos;) || &apos;0&apos;),
                right: parseInt(computedStyle.getPropertyValue(&apos;--safe-area-inset-right&apos;) || &apos;0&apos;)
            });
        };

        updateSafeArea();
        window.addEventListener(&apos;orientationchange&apos;, updateSafeArea);
        return () => window.removeEventListener(&apos;orientationchange&apos;, updateSafeArea);
    }, [isMobile]);

    // Layout configuration based on current view
    const getLayoutConfig = (view: View): MobileLayoutConfig => {
}
        const configs: Partial<Record<View, MobileLayoutConfig>> = {
}
            &apos;DASHBOARD&apos;: {
}
                hasBottomNav: true,
                hasPadding: false,
                hasScrollPadding: true,
                backgroundColor: &apos;var(--app-bg)&apos;
            },
            &apos;DRAFT_ROOM&apos;: {
}
                hasBottomNav: false,
                hasPadding: false,
                hasScrollPadding: false,
                backgroundColor: &apos;var(--draft-bg, var(--app-bg))&apos;
            },
            &apos;ANALYTICS_HUB&apos;: {
}
                hasBottomNav: true,
                hasPadding: false,
                hasScrollPadding: true,
                backgroundColor: &apos;var(--app-bg)&apos;
            },
            &apos;TEAM_HUB&apos;: {
}
                hasBottomNav: true,
                hasPadding: true,
                hasScrollPadding: true,
                backgroundColor: &apos;var(--app-bg)&apos;
            },
            &apos;PROFILE&apos;: {
}
                hasBottomNav: true,
                hasPadding: true,
                hasScrollPadding: true,
                backgroundColor: &apos;var(--app-bg)&apos;
            }
        };

        return configs[view] || {
}
            hasBottomNav: true,
            hasPadding: true,
            hasScrollPadding: true,
            backgroundColor: &apos;var(--app-bg)&apos;
        };
    };

    const layoutConfig = getLayoutConfig(currentView);

    // Don&apos;t apply mobile layout on desktop
    if (!isMobile && !isTablet) {
}
        return <>{children}</>;
    }

    const bottomNavHeight = 80; // Height of bottom navigation

    return (
        <main 
            className={`mobile-layout-wrapper ${className}`}
            aria-label={`Mobile layout for ${currentView.replace(/_/g, &apos; &apos;).toLowerCase()}`}
            style={{
}
                height: &apos;100vh&apos;,
                overflow: &apos;hidden&apos;,
                backgroundColor: layoutConfig.backgroundColor,
                paddingTop: safeAreaInsets.top,
                paddingLeft: safeAreaInsets.left,
                paddingRight: safeAreaInsets.right,
                paddingBottom: safeAreaInsets.bottom
            }}
        >
            <VisuallyHidden>
                <h1>Fantasy Football Draft Assistant - {currentView.replace(/_/g, &apos; &apos;)}</h1>
            </VisuallyHidden>

            {/* Main Content Area */}
            <section 
                className="mobile-content-area sm:px-4 md:px-6 lg:px-8"
                aria-label="Main content"
                style={{
}
                    height: `calc(100vh - ${safeAreaInsets.top + safeAreaInsets.bottom}px)`,
                    display: &apos;flex&apos;,
                    flexDirection: &apos;column&apos;
                }}
            >
                {/* Content Container */}
                <div 
                    className="flex-1 relative overflow-hidden sm:px-4 md:px-6 lg:px-8"
                    style={{
}
                        marginBottom: layoutConfig.hasBottomNav && showBottomNav && !isKeyboardVisible 
                            ? `${bottomNavHeight}px` 
                            : 0
                    }}
                >
                    <div 
                        className={`h-full ${layoutConfig.hasPadding ? &apos;p-4&apos; : &apos;&apos;}`}
                        style={{
}
                            paddingBottom: layoutConfig.hasScrollPadding ? &apos;2rem&apos; : 0
                        }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentView}
                                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                                animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
                                transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                                className="h-full sm:px-4 md:px-6 lg:px-8"
                                aria-live="polite"
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Bottom Navigation */}
                <AnimatePresence>
                    {layoutConfig.hasBottomNav && showBottomNav && !isKeyboardVisible && (
}
                        <motion.div
                            initial={prefersReducedMotion ? { opacity: 0 } : { y: bottomNavHeight }}
                            animate={prefersReducedMotion ? { opacity: 1 } : { y: 0 }}
                            exit={prefersReducedMotion ? { opacity: 0 } : { y: bottomNavHeight }}
                            transition={prefersReducedMotion ? { duration: 0 } : { type: &apos;spring&apos;, stiffness: 400, damping: 30 }}
                            className="fixed bottom-0 left-0 right-0 z-50 sm:px-4 md:px-6 lg:px-8"
                            style={{
}
                                paddingLeft: safeAreaInsets.left,
                                paddingRight: safeAreaInsets.right,
                                paddingBottom: safeAreaInsets.bottom
                            }}
                        >
                            <MobileBottomNavigation>
                                activeView={currentView}
                                onViewChange={onViewChange}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* Mobile-specific CSS */}
            <style>{`
}
                .mobile-layout-wrapper {
}
                    -webkit-overflow-scrolling: touch;
                    touch-action: manipulation;
                }

                .mobile-content-area {
}
                    position: relative;
                    z-index: 1;
                }

                /* Handle safe areas for devices with notches */
                @supports (padding: env(safe-area-inset-top)) {
}
                    .mobile-layout-wrapper {
}
                        padding-top: env(safe-area-inset-top);
                        padding-left: env(safe-area-inset-left);
                        padding-right: env(safe-area-inset-right);
                        padding-bottom: env(safe-area-inset-bottom);
                    }
                }

                /* Prevent zoom on input focus */
                @media screen and (max-width: 768px) {
}
                    input, select, textarea {
}
                        font-size: 16px !important;
                    }
                }

                /* Hide scrollbars on mobile but keep functionality */
                @media screen and (max-width: 768px) {
}
                    ::-webkit-scrollbar {
}
                        width: 0px;
                        background: transparent;
                    }
                }

                /* Improve touch performance */
                * {
}
                    -webkit-tap-highlight-color: transparent;
                    -webkit-touch-callout: none;
                    -webkit-user-select: none;
                    user-select: none;
                }

                /* Allow text selection in specific areas */
                input, textarea, [contenteditable] {
}
                    -webkit-user-select: auto;
                    user-select: auto;
                }

                /* Optimize for mobile performance */
                .mobile-content-area * {
}
                    transform: translateZ(0);
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
            `}</style>
        </main>
    );
};

const MobileLayoutWrapperWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <MobileLayoutWrapper {...props} />
  </ErrorBoundary>
);

export default React.memo(MobileLayoutWrapperWithErrorBoundary);
