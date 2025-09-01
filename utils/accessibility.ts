/**
 * Accessibility utilities for mobile-responsive focus management
 * Provides focus trapping, ARIA management, and keyboard navigation support
 */


/**
 * Get all focusable elements within a container
 */
export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
}
  const focusableSelectors = [
    &apos;a[href]&apos;,
    &apos;button:not([disabled])&apos;,
    &apos;textarea:not([disabled])&apos;,
    &apos;input:not([disabled]):not([type="hidden"])&apos;,
    &apos;select:not([disabled])&apos;,
    &apos;[tabindex]:not([tabindex="-1"])&apos;,
    &apos;[contenteditable="true"]&apos;
  ];

  return Array.from(
    container.querySelectorAll(focusableSelectors.join(&apos;, &apos;))
  );
};

/**
 * Focus trap hook for modals and overlays
 */
export const useFocusTrap = (isActive: boolean = true) => {
}
  const containerRef = React.useRef<HTMLElement>(null);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
}
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = getFocusableElements(container);
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Store the previously focused element
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus the first element
    firstElement.focus();

    const handleTabKey = (e: KeyboardEvent) => {
}
      if (e.key !== &apos;Tab&apos;) return;

      // Trap focus within the container
      if (e.shiftKey) {
}
        // Shift + Tab: move backwards
        if (document.activeElement === firstElement) {
}
          e.preventDefault();
          lastElement.focus();
        }
      } else if (document.activeElement === lastElement) {
}
        e.preventDefault();
        firstElement.focus();
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
}
      if (e.key === &apos;Escape&apos;) {
}
        e.preventDefault();
        e.stopPropagation();
        // Trigger a custom event for components to handle
        container.dispatchEvent(new CustomEvent(&apos;focustrap:escape&apos;));
      }
    };

    document.addEventListener(&apos;keydown&apos;, handleTabKey);
    document.addEventListener(&apos;keydown&apos;, handleEscapeKey);

    return () => {
}
      document.removeEventListener(&apos;keydown&apos;, handleTabKey);
      document.removeEventListener(&apos;keydown&apos;, handleEscapeKey);
      
      // Restore focus to the previously focused element
      if (previousFocusRef.current) {
}
        previousFocusRef.current.focus();
      }
    };
  }, [isActive]);

  return { containerRef };
};

/**
 * ARIA live region announcer for screen readers
 */
export class LiveAnnouncer {
}
  private static instance: LiveAnnouncer;
  private liveRegion: HTMLElement | null = null;

  private constructor() {
}
    this.createLiveRegion();
  }

  public static getInstance(): LiveAnnouncer {
}
    if (!LiveAnnouncer.instance) {
}
      LiveAnnouncer.instance = new LiveAnnouncer();
    }
    return LiveAnnouncer.instance;
  }

  private createLiveRegion() {
}
    if (typeof document === &apos;undefined&apos;) return;

    this.liveRegion = document.createElement(&apos;div&apos;);
    this.liveRegion.setAttribute(&apos;aria-live&apos;, &apos;polite&apos;);
    this.liveRegion.setAttribute(&apos;aria-atomic&apos;, &apos;true&apos;);
    this.liveRegion.className = &apos;sr-only&apos;;
    this.liveRegion.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    
    document.body.appendChild(this.liveRegion);
  }

  public announce(message: string, priority: &apos;polite&apos; | &apos;assertive&apos; = &apos;polite&apos;) {
}
    if (!this.liveRegion) return;

    this.liveRegion.setAttribute(&apos;aria-live&apos;, priority);
    this.liveRegion.textContent = message;

    // Clear the message after announcement
    setTimeout(() => {
}
      if (this.liveRegion) {
}
        this.liveRegion.textContent = &apos;&apos;;
      }
    }, 1000);
  }
}

/**
 * Hook for announcing messages to screen readers
 */
export const useAnnouncer = () => {
}
  const announcer = React.useMemo(() => LiveAnnouncer.getInstance(), []);

  const announce = React.useCallback(
    (message: string, priority: &apos;polite&apos; | &apos;assertive&apos; = &apos;polite&apos;) => {
}
      announcer.announce(message, priority);
    },
    [announcer]
  );

  return { announce };
};

/**
 * Enhanced modal accessibility props
 */
export const getModalA11yProps = (
  isOpen: boolean,
  titleId: string,
  descriptionId?: string
) => ({
}
  role: &apos;dialog&apos;,
  &apos;aria-modal&apos;: isOpen,
  &apos;aria-labelledby&apos;: titleId,
  &apos;aria-describedby&apos;: descriptionId,
  &apos;aria-hidden&apos;: !isOpen
});

/**
 * Enhanced button accessibility props
 */
export const getButtonA11yProps = (
  label: string,
  disabled?: boolean,
  pressed?: boolean,
  expanded?: boolean
) => ({
}
  &apos;aria-label&apos;: label,
  &apos;aria-disabled&apos;: disabled,
  &apos;aria-pressed&apos;: pressed,
  &apos;aria-expanded&apos;: expanded,
  role: &apos;button&apos;
});

/**
 * Mobile-specific focus utilities
 */
export const mobileFocusUtils = {
}
  /**
   * Ensure focus is visible on mobile devices
   */
  ensureVisibleFocus: (element: HTMLElement) => {
}
    if (!element) return;

    // Add visible focus indicator for mobile
    element.style.outline = &apos;2px solid #3b82f6&apos;;
    element.style.outlineOffset = &apos;2px&apos;;
    
    // Scroll element into view if needed
    element.scrollIntoView({
}
      behavior: &apos;smooth&apos;,
      block: &apos;nearest&apos;,
      inline: &apos;nearest&apos;
    });
  },

  /**
   * Handle touch vs keyboard focus differently
   */
  setupAccessibleInteraction: (element: HTMLElement) => {
}
    let isUsingKeyboard = false;

    const handleKeydown = (e: KeyboardEvent) => {
}
      if (e.key === &apos;Tab&apos;) {
}
        isUsingKeyboard = true;
      }
    };

    const handleMousedown = () => {
}
      isUsingKeyboard = false;
    };

    const handleFocus = () => {
}
      if (isUsingKeyboard) {
}
        mobileFocusUtils.ensureVisibleFocus(element);
      }
    };

    const handleBlur = () => {
}
      element.style.outline = &apos;&apos;;
      element.style.outlineOffset = &apos;&apos;;
    };

    element.addEventListener(&apos;keydown&apos;, handleKeydown);
    element.addEventListener(&apos;mousedown&apos;, handleMousedown);
    element.addEventListener(&apos;focus&apos;, handleFocus);
    element.addEventListener(&apos;blur&apos;, handleBlur);

    return () => {
}
      element.removeEventListener(&apos;keydown&apos;, handleKeydown);
      element.removeEventListener(&apos;mousedown&apos;, handleMousedown);
      element.removeEventListener(&apos;focus&apos;, handleFocus);
      element.removeEventListener(&apos;blur&apos;, handleBlur);
    };
  }
};

/**
 * Keyboard navigation constants
 */
export const KEYBOARD_KEYS = {
}
  ENTER: &apos;Enter&apos;,
  SPACE: &apos; &apos;,
  ESCAPE: &apos;Escape&apos;,
  TAB: &apos;Tab&apos;,
  ARROW_UP: &apos;ArrowUp&apos;,
  ARROW_DOWN: &apos;ArrowDown&apos;,
  ARROW_LEFT: &apos;ArrowLeft&apos;,
  ARROW_RIGHT: &apos;ArrowRight&apos;,
  HOME: &apos;Home&apos;,
  END: &apos;End&apos;
} as const;

/**
 * Screen reader only text utility
 */
export const srOnlyClasses = &apos;sr-only absolute left-[-10000px] w-[1px] h-[1px] overflow-hidden&apos;;
