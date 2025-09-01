/**
 * Accessible Mobile Components
 * React components with built-in accessibility features
 */

import React, { useRef } from &apos;react&apos;;
import { useKeyboardNavigation } from &apos;./mobileAccessibilityUtils&apos;;

/**
 * Accessible button component
 */
interface AccessibleButtonProps {
}
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    ariaLabel?: string;
    className?: string;
    type?: &apos;button&apos; | &apos;submit&apos; | &apos;reset&apos;;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
}
    children,
    onClick,
    disabled = false,
    ariaLabel,
    className = &apos;&apos;,
    type = &apos;button&apos;
}: any) => {
}
    const buttonRef = useRef<HTMLButtonElement>(null);
    useKeyboardNavigation(buttonRef as React.RefObject<HTMLElement>);

    return (
        <button
            ref={buttonRef}
            type={type}
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            className={`${className} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
            {children}
        </button>
    );
};

/**
 * Visually hidden component for screen readers
 */
interface VisuallyHiddenProps {
}
    children: React.ReactNode;
}

export const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({ children }: any) => {
}
    return (
        <span className="sr-only absolute left-[-10000px] top-auto w-[1px] h-[1px] overflow-hidden">
            {children}
        </span>
    );
};

/**
 * Live region component for announcements
 */
interface LiveRegionProps {
}
    children: React.ReactNode;
    politeness?: &apos;polite&apos; | &apos;assertive&apos;;
    atomic?: boolean;
    relevant?: &apos;all&apos; | &apos;additions&apos; | &apos;removals&apos; | &apos;text&apos; | &apos;additions text&apos; | &apos;additions removals&apos; | &apos;removals text&apos; | &apos;text additions&apos; | &apos;text removals&apos; | &apos;removals additions&apos;;
}

export const LiveRegion: React.FC<LiveRegionProps> = ({
}
    children,
    politeness = &apos;polite&apos;,
    atomic = true,
    relevant = &apos;all&apos;
}: any) => {
}
    return (
        <div
            aria-live={politeness}
            aria-atomic={atomic}
            aria-relevant={relevant}
            className="sr-only"
        >
            {children}
        </div>
    );
};
