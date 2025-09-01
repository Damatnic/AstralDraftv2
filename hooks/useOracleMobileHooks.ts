/**
 * Oracle Mobile Hooks
 * Custom React hooks for enhanced mobile Oracle experience
 * Touch interactions, gestures, and mobile-specific functionality
 */

import { useState, useEffect, useCallback, useRef } from &apos;react&apos;;
import { useMediaQuery } from &apos;./useMediaQuery&apos;;

// Touch gesture types
export interface TouchGesture {
}
    type: &apos;swipe&apos; | &apos;longpress&apos; | &apos;tap&apos; | &apos;pinch&apos;;
    direction?: &apos;left&apos; | &apos;right&apos; | &apos;up&apos; | &apos;down&apos;;
    deltaX?: number;
    deltaY?: number;
    duration?: number;
    touches?: number;
}

// Mobile Oracle state interface
export interface MobileOracleState {
}
    isKeyboardVisible: boolean;
    orientation: &apos;portrait&apos; | &apos;landscape&apos;;
    viewportHeight: number;
    activeInput: HTMLElement | null;
    lastTouchTime: number;
}

// Hook for Oracle touch gestures
export const useOracleTouchGestures = (
    element: React.RefObject<HTMLElement>,
    onGesture: (gesture: TouchGesture) => void
) => {
}
    const touchStart = useRef<Touch | null>(null);
    const touchStartTime = useRef<number>(0);
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);

    const handleTouchStart = useCallback((e: TouchEvent) => {
}
        touchStart.current = e.touches[0];
        touchStartTime.current = Date.now();

        // Setup long press detection
        longPressTimer.current = setTimeout(() => {
}
            onGesture({
}
                type: &apos;longpress&apos;,
                duration: Date.now() - touchStartTime.current
            });
            
            // Haptic feedback if available
            if (&apos;vibrate&apos; in navigator) {
}
                navigator.vibrate(50);
            }
        }, 500);
    }, [onGesture]);

    const handleTouchMove = useCallback(() => {
}
        // Clear long press timer if user moves finger
        if (longPressTimer.current) {
}
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    }, []);

    const handleTouchEnd = useCallback((e: TouchEvent) => {
}
        if (longPressTimer.current) {
}
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }

        if (!touchStart.current) return;

        const touchEnd = e.changedTouches[0];
        const deltaX = touchEnd.clientX - touchStart.current.clientX;
        const deltaY = touchEnd.clientY - touchStart.current.clientY;
        const duration = Date.now() - touchStartTime.current;

        const minSwipeDistance = 50;
        const maxTapDuration = 200;

        // Detect swipe gestures
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
}
            onGesture({
}
                type: &apos;swipe&apos;,
                direction: deltaX > 0 ? &apos;right&apos; : &apos;left&apos;,
                deltaX,
                deltaY,
//                 duration
            });
        } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > minSwipeDistance) {
}
            onGesture({
}
                type: &apos;swipe&apos;,
                direction: deltaY > 0 ? &apos;down&apos; : &apos;up&apos;,
                deltaX,
                deltaY,
//                 duration
            });
        } else if (duration < maxTapDuration && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
}
            onGesture({
}
                type: &apos;tap&apos;,
//                 duration
            });
        }

        touchStart.current = null;
    }, [onGesture]);

    useEffect(() => {
}
        const currentElement = element.current;
        if (!currentElement) return;

        currentElement.addEventListener(&apos;touchstart&apos;, handleTouchStart, { passive: true });
        currentElement.addEventListener(&apos;touchmove&apos;, handleTouchMove, { passive: true });
        currentElement.addEventListener(&apos;touchend&apos;, handleTouchEnd, { passive: true });

        return () => {
}
            currentElement.removeEventListener(&apos;touchstart&apos;, handleTouchStart);
            currentElement.removeEventListener(&apos;touchmove&apos;, handleTouchMove);
            currentElement.removeEventListener(&apos;touchend&apos;, handleTouchEnd);
        };
    }, [element, handleTouchStart, handleTouchMove, handleTouchEnd]);
};

// Hook for Oracle mobile state management
export const useOracleMobileState = (): MobileOracleState => {
}
    const [state, setState] = useState<MobileOracleState>({
}
        isKeyboardVisible: false,
        orientation: &apos;portrait&apos;,
        viewportHeight: window.innerHeight,
        activeInput: null,
        lastTouchTime: 0
    });

    useEffect(() => {
}
        const handleResize = () => {
}
            const currentHeight = window.innerHeight;
            const isKeyboardVisible = currentHeight < window.screen.height * 0.75;
            
            setState(prev => ({
}
                ...prev,
                viewportHeight: currentHeight,
//                 isKeyboardVisible
            }));
        };

        const handleOrientationChange = () => {
}
            // Use screen.orientation API or fallback
            const angle = screen.orientation?.angle || (window as any).orientation || 0;
            const orientation = Math.abs(angle) === 90 ? &apos;landscape&apos; : &apos;portrait&apos;;
            
            setState(prev => ({
}
                ...prev,
//                 orientation
            }));
        };

        const handleFocusIn = (e: FocusEvent) => {
}
            if (e.target instanceof HTMLElement && 
                (e.target.tagName === &apos;INPUT&apos; || e.target.tagName === &apos;TEXTAREA&apos;)) {
}
                setState(prev => ({
}
                    ...prev,
                    activeInput: e.target as HTMLElement
                }));
            }
        };

        const handleFocusOut = () => {
}
            setState(prev => ({
}
                ...prev,
                activeInput: null
            }));
        };

        const handleTouchStart = () => {
}
            setState(prev => ({
}
                ...prev,
                lastTouchTime: Date.now()
            }));
        };

        window.addEventListener(&apos;resize&apos;, handleResize);
        window.addEventListener(&apos;orientationchange&apos;, handleOrientationChange);
        document.addEventListener(&apos;focusin&apos;, handleFocusIn);
        document.addEventListener(&apos;focusout&apos;, handleFocusOut);
        document.addEventListener(&apos;touchstart&apos;, handleTouchStart, { passive: true });

        // Initial state
        handleOrientationChange();

        return () => {
}
            window.removeEventListener(&apos;resize&apos;, handleResize);
            window.removeEventListener(&apos;orientationchange&apos;, handleOrientationChange);
            document.removeEventListener(&apos;focusin&apos;, handleFocusIn);
            document.removeEventListener(&apos;focusout&apos;, handleFocusOut);
            document.removeEventListener(&apos;touchstart&apos;, handleTouchStart);
        };
    }, []);

    return state;
};

// Hook for Oracle mobile navigation with swipe support
export const useOracleMobileNavigation = (views: string[], initialView: string = views[0]) => {
}
    const [activeView, setActiveView] = useState(initialView);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const isMobile = useMediaQuery(&apos;(max-width: 768px)&apos;);

    const navigateToView = useCallback((viewName: string) => {
}
        if (views.includes(viewName) && viewName !== activeView) {
}
            setIsTransitioning(true);
            setActiveView(viewName);
            
            // Reset transition state after animation
            setTimeout(() => setIsTransitioning(false), 300);
        }
    }, [views, activeView]);

    const navigateNext = useCallback(() => {
}
        const currentIndex = views.indexOf(activeView);
        const nextIndex = (currentIndex + 1) % views.length;
        navigateToView(views[nextIndex]);
    }, [views, activeView, navigateToView]);

    const navigatePrevious = useCallback(() => {
}
        const currentIndex = views.indexOf(activeView);
        const prevIndex = currentIndex === 0 ? views.length - 1 : currentIndex - 1;
        navigateToView(views[prevIndex]);
    }, [views, activeView, navigateToView]);

    const handleSwipeGesture = useCallback((gesture: TouchGesture) => {
}
        if (!isMobile || gesture.type !== &apos;swipe&apos;) return;

        if (gesture.direction === &apos;left&apos;) {
}
            navigateNext();
        } else if (gesture.direction === &apos;right&apos;) {
}
            navigatePrevious();
        }
    }, [isMobile, navigateNext, navigatePrevious]);

    return {
}
        activeView,
        isTransitioning,
        navigateToView,
        navigateNext,
        navigatePrevious,
        handleSwipeGesture,
        viewIndex: views.indexOf(activeView),
        totalViews: views.length
    };
};

// Hook for Oracle mobile form optimization
export const useOracleMobileForm = () => {
}
    const [isSubmitting, setIsSubmitting] = useState(false);
    const mobileState = useOracleMobileState();

    const optimizeInputForMobile = useCallback((inputElement: HTMLInputElement) => {
}
        // Prevent zoom on input focus
        inputElement.setAttribute(&apos;autocomplete&apos;, &apos;off&apos;);
        inputElement.setAttribute(&apos;autocorrect&apos;, &apos;off&apos;);
        inputElement.setAttribute(&apos;autocapitalize&apos;, &apos;off&apos;);
        inputElement.setAttribute(&apos;spellcheck&apos;, &apos;false&apos;);

        // Set appropriate input types for mobile keyboards
        if (inputElement.type === &apos;text&apos;) {
}
            if (inputElement.name?.includes(&apos;email&apos;)) {
}
                inputElement.type = &apos;email&apos;;
            } else if (inputElement.name?.includes(&apos;phone&apos;)) {
}
                inputElement.type = &apos;tel&apos;;
            } else if (inputElement.name?.includes(&apos;number&apos;) || inputElement.name?.includes(&apos;confidence&apos;)) {
}
                inputElement.type = &apos;number&apos;;
            }
        }
    }, []);

    const scrollToActiveInput = useCallback(() => {
}
        if (mobileState.activeInput && mobileState.isKeyboardVisible) {
}
            setTimeout(() => {
}
                mobileState.activeInput?.scrollIntoView({
}
                    behavior: &apos;smooth&apos;,
                    block: &apos;center&apos;
                });
            }, 100);
        }
    }, [mobileState.activeInput, mobileState.isKeyboardVisible]);

    const submitWithHapticFeedback = useCallback(async (submitFunction: () => Promise<void>) => {
}
        setIsSubmitting(true);
        
        try {
}

            await submitFunction();
            
            // Success haptic feedback
            if (&apos;vibrate&apos; in navigator) {
}
                navigator.vibrate([50, 50, 50]);
            }
        
    } catch (error) {
}
        console.error(error);
    } catch (error) {
}
            // Error haptic feedback
            if (&apos;vibrate&apos; in navigator) {
}
                navigator.vibrate([100, 50, 100]);
            }
            throw error;
        } finally {
}
            setIsSubmitting(false);
        }
    }, []);

    // Auto-scroll to active input when keyboard appears
    useEffect(() => {
}
        scrollToActiveInput();
    }, [scrollToActiveInput, mobileState.isKeyboardVisible]);

    return {
}
        isSubmitting,
        mobileState,
        optimizeInputForMobile,
        scrollToActiveInput,
//         submitWithHapticFeedback
    };
};

// Hook for Oracle mobile performance optimization
export const useOracleMobilePerformance = () => {
}
    const [isLowEndDevice, setIsLowEndDevice] = useState(false);
    const [shouldReduceAnimations, setShouldReduceAnimations] = useState(false);

    useEffect(() => {
}
        // Detect low-end devices
        const connection = (navigator as any).connection;
        const memory = (performance as any).memory;
        
        const isSlowConnection = connection?.effectiveType === &apos;2g&apos; || connection?.effectiveType === &apos;slow-2g&apos;;
        const isLowMemory = memory?.usedJSHeapSize > memory?.jsHeapSizeLimit * 0.8;
        const isReducedMotion = window.matchMedia(&apos;(prefers-reduced-motion: reduce)&apos;).matches;
        
        setIsLowEndDevice(isSlowConnection || isLowMemory);
        setShouldReduceAnimations(isReducedMotion || isSlowConnection);
    }, []);

    const getOptimizedAnimationConfig = useCallback(() => {
}
        if (shouldReduceAnimations) {
}
            return {
}
                duration: 0.1,
                ease: &apos;linear&apos;
            };
        }
        
        return {
}
            duration: 0.3,
            ease: &apos;easeOut&apos;
        };
    }, [shouldReduceAnimations]);

    const shouldPreloadContent = useCallback(() => {
}
        return !isLowEndDevice;
    }, [isLowEndDevice]);

    return {
}
        isLowEndDevice,
        shouldReduceAnimations,
        getOptimizedAnimationConfig,
//         shouldPreloadContent
    };
};

// Hook for Oracle mobile accessibility
export const useOracleMobileAccessibility = () => {
}
    const [isHighContrast, setIsHighContrast] = useState(false);
    const [fontSize, setFontSize] = useState(&apos;normal&apos;);

    useEffect(() => {
}
        // Detect high contrast mode
        const highContrastQuery = window.matchMedia(&apos;(prefers-contrast: high)&apos;);
        setIsHighContrast(highContrastQuery.matches);

        const handleContrastChange = (e: MediaQueryListEvent) => {
}
            setIsHighContrast(e.matches);
        };

        highContrastQuery.addEventListener(&apos;change&apos;, handleContrastChange);

        // Detect font size preferences
        const largeTextQuery = window.matchMedia(&apos;(prefers-reduced-motion: reduce)&apos;);
        if (largeTextQuery.matches) {
}
            setFontSize(&apos;large&apos;);
        }

        return () => {
}
            highContrastQuery.removeEventListener(&apos;change&apos;, handleContrastChange);
        };
    }, []);

    const getAccessibilityClasses = useCallback(() => {
}
        const classes = [];
        
        if (isHighContrast) {
}
            classes.push(&apos;high-contrast-mode&apos;);
        }
        
        if (fontSize === &apos;large&apos;) {
}
            classes.push(&apos;large-text-mode&apos;);
        }
        
        return classes.join(&apos; &apos;);
    }, [isHighContrast, fontSize]);

    const announceToScreenReader = useCallback((message: string) => {
}
        const announcement = document.createElement(&apos;div&apos;);
        announcement.setAttribute(&apos;aria-live&apos;, &apos;polite&apos;);
        announcement.setAttribute(&apos;aria-atomic&apos;, &apos;true&apos;);
        announcement.style.position = &apos;absolute&apos;;
        announcement.style.left = &apos;-10000px&apos;;
        announcement.style.width = &apos;1px&apos;;
        announcement.style.height = &apos;1px&apos;;
        announcement.style.overflow = &apos;hidden&apos;;
        announcement.textContent = message;

        document.body.appendChild(announcement);

        setTimeout(() => {
}
            document.body.removeChild(announcement);
        }, 1000);
    }, []);

    return {
}
        isHighContrast,
        fontSize,
        getAccessibilityClasses,
//         announceToScreenReader
    };
};

export default {
}
    useOracleTouchGestures,
    useOracleMobileState,
    useOracleMobileNavigation,
    useOracleMobileForm,
    useOracleMobilePerformance,
//     useOracleMobileAccessibility
};
