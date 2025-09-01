/* eslint-disable react-refresh/only-export-components */
/**
 * Mobile Accessibility Utilities
 * Comprehensive accessibility tools and helpers for mobile components
 */


// ARIA live region types
export type LiveRegionPoliteness = &apos;off&apos; | &apos;polite&apos; | &apos;assertive&apos;;

// Screen reader utilities
export const announceToScreenReader = (message: string, politeness: LiveRegionPoliteness = &apos;polite&apos;) => {
}
    const announcement = document.createElement(&apos;div&apos;);
    announcement.setAttribute(&apos;aria-live&apos;, politeness);
    announcement.setAttribute(&apos;aria-atomic&apos;, &apos;true&apos;);
    announcement.setAttribute(&apos;class&apos;, &apos;sr-only&apos;);
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
}
        document.body.removeChild(announcement);
    }, 1000);
};

// Focus management for mobile
export const useFocusManagement = () => {
}
    const focusRef = React.useRef<HTMLElement | null>(null);
    const lastFocusedElement = React.useRef<HTMLElement | null>(null);

    const saveFocus = () => {
}
        lastFocusedElement.current = document.activeElement as HTMLElement;
    };

    const restoreFocus = () => {
}
        if (lastFocusedElement.current && lastFocusedElement.current.focus) {
}
            lastFocusedElement.current.focus();
        }
    };

    const trapFocus = (container: HTMLElement) => {
}
        const focusableElements = container.querySelectorAll(
            &apos;button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])&apos;
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
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
}
                    if (document.activeElement === lastElement) {
}
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        };

        container.addEventListener(&apos;keydown&apos;, handleTabKey);
        firstElement?.focus();

        return () => {
}
            container.removeEventListener(&apos;keydown&apos;, handleTabKey);
        };
    };

    return {
}
        focusRef,
        saveFocus,
        restoreFocus,
//         trapFocus
    };
};

// Touch target accessibility
export const TOUCH_TARGET_SIZE = {
}
    MINIMUM: 44, // WCAG AA minimum
    RECOMMENDED: 48 // WCAG AAA recommended
};

export const validateTouchTarget = (element: HTMLElement): boolean => {
}
    const rect = element.getBoundingClientRect();
    return rect.width >= TOUCH_TARGET_SIZE.MINIMUM && rect.height >= TOUCH_TARGET_SIZE.MINIMUM;
};

// High contrast mode detection
export const useHighContrastMode = () => {
}
    const [isHighContrast, setIsHighContrast] = React.useState(false);

    React.useEffect(() => {
}
        const checkHighContrast = () => {
}
            // Check for Windows high contrast mode
            const testElement = document.createElement(&apos;div&apos;);
            testElement.style.borderColor = &apos;red green&apos;;
            testElement.style.color = &apos;red&apos;;
            document.body.appendChild(testElement);
            
            const computedStyle = window.getComputedStyle(testElement);
            const isHighContrastMode = computedStyle.borderTopColor === computedStyle.borderRightColor;
            
            document.body.removeChild(testElement);
            setIsHighContrast(isHighContrastMode);
        };

        checkHighContrast();
        
        // Check for CSS media query support
        const mediaQuery = window.matchMedia(&apos;(prefers-contrast: high)&apos;);
        const handleChange = (e: MediaQueryListEvent) => {
}
            setIsHighContrast(e.matches);
        };

        if (mediaQuery.addEventListener) {
}
            mediaQuery.addEventListener(&apos;change&apos;, handleChange);
            setIsHighContrast(mediaQuery.matches);
        }

        return () => {
}
            if (mediaQuery.removeEventListener) {
}
                mediaQuery.removeEventListener(&apos;change&apos;, handleChange);
            }
        };
    }, []);

    return isHighContrast;
};

// Reduced motion preference
export const useReducedMotion = () => {
}
    const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

    React.useEffect(() => {
}
        const mediaQuery = window.matchMedia(&apos;(prefers-reduced-motion: reduce)&apos;);
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
}
            setPrefersReducedMotion(e.matches);
        };

        if (mediaQuery.addEventListener) {
}
            mediaQuery.addEventListener(&apos;change&apos;, handleChange);
        }

        return () => {
}
            if (mediaQuery.removeEventListener) {
}
                mediaQuery.removeEventListener(&apos;change&apos;, handleChange);
            }
        };
    }, []);

    return prefersReducedMotion;
};

// Keyboard navigation helpers
export const useKeyboardNavigation = (
    onEnter?: () => void,
    onEscape?: () => void,
    onArrowKeys?: (direction: &apos;up&apos; | &apos;down&apos; | &apos;left&apos; | &apos;right&apos;) => void
) => {
}
    const handleKeyDown = React.useCallback((event: KeyboardEvent) => {
}
        switch (event.key) {
}
            case &apos;Enter&apos;:
            case &apos; &apos;:
                if (onEnter) {
}
                    event.preventDefault();
                    onEnter();
                }
                break;
            case &apos;Escape&apos;:
                if (onEscape) {
}
                    event.preventDefault();
                    onEscape();
                }
                break;
            case &apos;ArrowUp&apos;:
                if (onArrowKeys) {
}
                    event.preventDefault();
                    onArrowKeys(&apos;up&apos;);
                }
                break;
            case &apos;ArrowDown&apos;:
                if (onArrowKeys) {
}
                    event.preventDefault();
                    onArrowKeys(&apos;down&apos;);
                }
                break;
            case &apos;ArrowLeft&apos;:
                if (onArrowKeys) {
}
                    event.preventDefault();
                    onArrowKeys(&apos;left&apos;);
                }
                break;
            case &apos;ArrowRight&apos;:
                if (onArrowKeys) {
}
                    event.preventDefault();
                    onArrowKeys(&apos;right&apos;);
                }
                break;
        }
    }, [onEnter, onEscape, onArrowKeys]);

    React.useEffect(() => {
}
        document.addEventListener(&apos;keydown&apos;, handleKeyDown);
        return () => {
}
            document.removeEventListener(&apos;keydown&apos;, handleKeyDown);
        };
    }, [handleKeyDown]);
};

// Screen reader only text utility
export const VisuallyHidden: React.FC<{ children: React.ReactNode }> = ({ children }: any) => (
    <span className="sr-only">
        {children}
    </span>
);

// Accessible button component
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
}
    variant?: &apos;primary&apos; | &apos;secondary&apos; | &apos;ghost&apos;;
    size?: &apos;small&apos; | &apos;medium&apos; | &apos;large&apos;;
    loading?: boolean;
    children: React.ReactNode;
    srText?: string; // Screen reader only text
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
}
    variant = &apos;primary&apos;,
    size = &apos;medium&apos;,
    loading = false,
    children,
    srText,
    disabled,
    className = &apos;&apos;,
    ...props
}: any) => {
}
    const baseClasses = &apos;inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed&apos;;
    
    const variantClasses = {
}
        primary: &apos;bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500&apos;,
        secondary: &apos;bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500&apos;,
        ghost: &apos;text-gray-700 hover:bg-gray-100 focus:ring-gray-500&apos;
    };

    const sizeClasses = {
}
        small: &apos;px-3 py-2 text-sm min-h-[32px] min-w-[32px]&apos;,
        medium: &apos;px-4 py-2 text-base min-h-[44px] min-w-[44px]&apos;, // WCAG minimum touch target
        large: &apos;px-6 py-3 text-lg min-h-[48px] min-w-[48px]&apos;
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            disabled={disabled || loading}
            aria-disabled={disabled || loading}
            {...props}
        >
            {loading && (
}
                <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            {children}
            {srText && <VisuallyHidden>{srText}</VisuallyHidden>}
        </button>
    );
};

// Live region for announcements
export const LiveRegion: React.FC<{
}
    message: string;
    politeness?: LiveRegionPoliteness;
    clearAfter?: number;
}> = ({ message, politeness = &apos;polite&apos;, clearAfter = 5000 }: any) => {
}
    const [currentMessage, setCurrentMessage] = React.useState(message);

    React.useEffect(() => {
}
        setCurrentMessage(message);
        
        if (clearAfter && message) {
}
            const timer = setTimeout(() => {
}
                setCurrentMessage(&apos;&apos;);
            }, clearAfter);
            
            return () => clearTimeout(timer);
        }
    }, [message, clearAfter]);

    return (
        <div
            aria-live={politeness}
            aria-atomic="true"
            className="sr-only"
        >
            {currentMessage}
        </div>
    );
};

// Color contrast validation
export const getContrastRatio = (foreground: string, background: string): number => {
}
    const getLuminance = (color: string): number => {
}
        const rgb = parseInt(color.replace(&apos;#&apos;, &apos;&apos;), 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = (rgb >> 0) & 0xff;
        
        const [rs, gs, bs] = [r, g, b].map((c: any) => {
}
            const sRGB = c / 255;
            return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
        });
        
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const l1 = getLuminance(foreground);
    const l2 = getLuminance(background);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
};

export const meetsWCAGContrast = (foreground: string, background: string, level: &apos;AA&apos; | &apos;AAA&apos; = &apos;AA&apos;): boolean => {
}
    const ratio = getContrastRatio(foreground, background);
    return level === &apos;AA&apos; ? ratio >= 4.5 : ratio >= 7;
};

// Accessibility testing utilities
export const AccessibilityTester = {
}
    checkTouchTargets: (): string[] => {
}
        const issues: string[] = [];
        const interactiveElements = document.querySelectorAll(&apos;button, a, input, select, textarea, [tabindex]&apos;);
        
        interactiveElements.forEach((element, index) => {
}
            if (!validateTouchTarget(element as HTMLElement)) {
}
                issues.push(`Element ${index + 1} (${element.tagName}) has insufficient touch target size`);
            }
        });
        
        return issues;
    },
    
    checkAriaLabels: (): string[] => {
}
        const issues: string[] = [];
        const interactiveElements = document.querySelectorAll(&apos;button, a, input, select, textarea&apos;);
        
        interactiveElements.forEach((element, index) => {
}
            const hasLabel = element.getAttribute(&apos;aria-label&apos;) || 
                            element.getAttribute(&apos;aria-labelledby&apos;) || 
                            element.textContent?.trim() ||
                            (element as HTMLInputElement).labels?.length;
            
            if (!hasLabel) {
}
                issues.push(`Element ${index + 1} (${element.tagName}) lacks accessible label`);
            }
        });
        
        return issues;
    },
    
    checkKeyboardNavigation: (): string[] => {
}
        const issues: string[] = [];
        const interactiveElements = document.querySelectorAll(&apos;button, a, input, select, textarea&apos;);
        
        interactiveElements.forEach((element, index) => {
}
            const tabIndex = element.getAttribute(&apos;tabindex&apos;);
            if (tabIndex === &apos;-1&apos; && element.tagName !== &apos;DIV&apos;) {
}
                issues.push(`Element ${index + 1} (${element.tagName}) is not keyboard accessible`);
            }
        });
        
        return issues;
    },
    
    runFullAudit: () => {
}
        return {
}
            touchTargets: AccessibilityTester.checkTouchTargets(),
            ariaLabels: AccessibilityTester.checkAriaLabels(),
            keyboardNavigation: AccessibilityTester.checkKeyboardNavigation()
        };
    }
};
