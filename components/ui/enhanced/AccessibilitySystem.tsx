/**
 * Accessibility System - WCAG 2.1 AA Compliance & Universal Design
 * Comprehensive accessibility features including screen readers, keyboard navigation, and inclusive design
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { 
  useCallback, 
  useMemo, 
  createContext, 
  useContext, 
  useEffect, 
  useState, 
  useRef, 
  ReactNode, 
  KeyboardEvent,
  FocusEvent,
  MouseEvent
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// =========================================
// TYPES & INTERFACES
// =========================================

interface AccessibilityState {
  screenReaderMode: boolean;
  highContrastMode: boolean;
  reducedMotionMode: boolean;
  largeTextMode: boolean;
  keyboardNavigationMode: boolean;
  focusIndicatorMode: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  announcements: Announcement[];

}

interface Announcement {
  id: string;
  message: string;
  priority: 'polite' | 'assertive';
  timestamp: number;

interface AccessibilityActions {
  toggleScreenReader: () => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  toggleLargeText: () => void;
  toggleKeyboardNavigation: () => void;
  toggleFocusIndicator: () => void;
  setColorBlindMode: (mode: AccessibilityState['colorBlindMode']) => void;
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  clearAnnouncements: () => void;

type AccessibilityContextType = AccessibilityState & AccessibilityActions;

// =========================================
// ACCESSIBILITY CONTEXT
// =========================================}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

}

export const useAccessibility = (): AccessibilityContextType => {
  const [isLoading, setIsLoading] = React.useState(false);
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');

  return context;
};

// =========================================
// ACCESSIBILITY PROVIDER
// =========================================

interface AccessibilityProviderProps {
  children: ReactNode;
  storageKey?: string;

}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({
  children,
  storageKey = 'astral-draft-accessibility'
}: any) => {
  const [state, setState] = useState<AccessibilityState>({
    screenReaderMode: false,
    highContrastMode: false,
    reducedMotionMode: false,
    largeTextMode: false,
    keyboardNavigationMode: false,
    focusIndicatorMode: true,
    colorBlindMode: 'none',
    announcements: []
  });

  // =========================================
  // SYSTEM PREFERENCE DETECTION
  // =========================================

  useEffect(() => {
    // Detect system preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
    const prefersLargeText = window.matchMedia('(prefers-reduced-transparency: reduce)');

    const updatePreferences = () => {
      setState(prev => ({
        ...prev,
        reducedMotionMode: prefersReducedMotion.matches,
        highContrastMode: prefersHighContrast.matches
      }));
    };

    updatePreferences();

    prefersReducedMotion.addEventListener('change', updatePreferences);
    prefersHighContrast.addEventListener('change', updatePreferences);

    return () => {
      prefersReducedMotion.removeEventListener('change', updatePreferences);
      prefersHighContrast.removeEventListener('change', updatePreferences);
    };
  }, []);

  // =========================================
  // KEYBOARD NAVIGATION DETECTION
  // =========================================

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setState(prev => ({ ...prev, keyboardNavigationMode: true }));
    };

    const handleMouseDown = () 
} {
      setState(prev => ({ ...prev, keyboardNavigationMode: false }));
    };

    document.addEventListener('keydown', handleKeyDown as any);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown as any);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // =========================================
  // SCREEN READER DETECTION
  // =========================================

  useEffect(() => {
    const detectScreenReader = () => {
      // Check for common screen reader indicators
      const hasScreenReader = 
        window.speechSynthesis !== undefined ||
        'SpeechSynthesisUtterance' in window ||
        navigator.userAgent.includes('NVDA') ||
        navigator.userAgent.includes('JAWS') ||
        navigator.userAgent.includes('VoiceOver');

      if (hasScreenReader) {
        setState(prev => ({ ...prev, screenReaderMode: true }));

    };

    detectScreenReader();
  }, []);

  // =========================================
  // PERSISTENCE
  // =========================================

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {

        const parsed = JSON.parse(stored);
        setState(prev => ({ ...prev, ...parsed, announcements: [] }));

    } catch (error) {
        console.warn('Failed to load accessibility settings:', error);


  }, [storageKey]);

  useEffect(() => {
    const { announcements, ...persistentState } = state;
    localStorage.setItem(storageKey, JSON.stringify(persistentState));
  }, [state, storageKey]);

  // =========================================
  // CSS CLASS APPLICATION
  // =========================================

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply accessibility classes
    root.classList.toggle('a11y-high-contrast', state.highContrastMode);
    root.classList.toggle('a11y-reduced-motion', state.reducedMotionMode);
    root.classList.toggle('a11y-large-text', state.largeTextMode);
    root.classList.toggle('a11y-keyboard-nav', state.keyboardNavigationMode);
    root.classList.toggle('a11y-focus-visible', state.focusIndicatorMode);
    root.classList.toggle('a11y-screen-reader', state.screenReaderMode);
    
    // Apply color blind mode
    root.classList.remove('a11y-protanopia', 'a11y-deuteranopia', 'a11y-tritanopia');
    if (state.colorBlindMode !== 'none') {
      root.classList.add(`a11y-${state.colorBlindMode}`);

    // Set CSS custom properties
    root.style.setProperty('--a11y-focus-width', state.focusIndicatorMode ? '3px' : '0px');
    root.style.setProperty('--a11y-font-scale', state.largeTextMode ? '1.25' : '1');
    root.style.setProperty('--a11y-motion-scale', state.reducedMotionMode ? '0' : '1');
    
  }, [state]);

  // =========================================
  // ACTIONS
  // =========================================

  const actions: AccessibilityActions = {
    toggleScreenReader: () => {
      setState(prev => ({ ...prev, screenReaderMode: !prev.screenReaderMode }));
    },

    toggleHighContrast: () => {
      setState(prev => ({ ...prev, highContrastMode: !prev.highContrastMode }));
    },

    toggleReducedMotion: () => {
      setState(prev => ({ ...prev, reducedMotionMode: !prev.reducedMotionMode }));
    },

    toggleLargeText: () => {
      setState(prev => ({ ...prev, largeTextMode: !prev.largeTextMode }));
    },

    toggleKeyboardNavigation: () => {
      setState(prev => ({ ...prev, keyboardNavigationMode: !prev.keyboardNavigationMode }));
    },

    toggleFocusIndicator: () => {
      setState(prev => ({ ...prev, focusIndicatorMode: !prev.focusIndicatorMode }));
    },

    setColorBlindMode: (mode: any) => {
      setState(prev => ({ ...prev, colorBlindMode: mode }));
    },

    announce: (message, priority = 'polite') => {
      const announcement: Announcement = {
        id: Math.random().toString(36).substr(2, 9),
        message,
        priority,
        timestamp: Date.now()
      };

      setState(prev => ({
        ...prev,
        announcements: [...prev.announcements, announcement]
      }));

      // Auto-remove after delay
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          announcements: prev.announcements.filter((a: any) => a.id !== announcement.id)
        }));
      }, 5000);
    },

    clearAnnouncements: () => {
      setState(prev => ({ ...prev, announcements: [] }));

  };

  const contextValue: AccessibilityContextType = {
    ...state,
    ...actions
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
      <LiveRegion announcements={state.announcements} />
    </AccessibilityContext.Provider>
  );
};

// =========================================
// LIVE REGION FOR ANNOUNCEMENTS
// =========================================

interface LiveRegionProps {
  announcements: Announcement[];

}

const LiveRegion: React.FC<LiveRegionProps> = ({ announcements }: any) => {
  return (
    <>
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only sm:px-4 md:px-6 lg:px-8"
        role="status"
      >
        {announcements
          .filter((a: any) => a.priority === 'polite')
          .slice(-1)
          .map((a: any) => (
            <div key={a.id}>{a.message}</div>
          ))

      </div>
      
      <div
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only sm:px-4 md:px-6 lg:px-8"
        role="alert"
      >
        {announcements
          .filter((a: any) => a.priority === 'assertive')
          .slice(-1)
          .map((a: any) => (
            <div key={a.id}>{a.message}</div>
          ))

      </div>
    </>
  );
};

// =========================================
// ACCESSIBLE COMPONENTS
// =========================================

interface AccessibleButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  role?: string;

}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  role = 'button',
  ...props
}) => {
  const { announce } = useAccessibility();
  const [isFocused, setIsFocused] = useState(false);

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
      announce(`Button ${ariaLabel || 'activated'}`, 'polite');

  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const handleFocus = (e: FocusEvent<HTMLButtonElement>) => {
    setIsFocused(true);
    announce(`Button ${ariaLabel || children} focused`, 'polite');
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-glass-medium hover:bg-glass-heavy text-white border border-glass-border',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  };

  return (
    <motion.button
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        font-semibold rounded-lg
        focus:outline-none focus:ring-4 focus:ring-primary-500/50
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200
        ${isFocused ? 'ring-4 ring-primary-500/50' : ''}
        ${className}
      `}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      disabled={disabled}
      role={role}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// =========================================
// ACCESSIBLE INPUT
// =========================================

interface AccessibleInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  id?: string;

}

export const AccessibleInput: React.FC<AccessibleInputProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  disabled = false,
  required = false,
  error,
  hint,
  className = '',
  id: providedId,
  ...props
}) => {
  const { announce } = useAccessibility();
  const [isFocused, setIsFocused] = useState(false);
  const id = providedId || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
    const announcement = `${label} input focused${hint ? `. ${hint}` : ''}`;
    announce(announcement, 'polite');
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (error) {
      announce(`${label} has error: ${error}`, 'assertive');

  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label 
        htmlFor={id}
        className="block text-sm font-medium text-white sm:px-4 md:px-6 lg:px-8"
      >
        {label}
        {required && <span className="text-red-500 ml-1 sm:px-4 md:px-6 lg:px-8" aria-label="required">*</span>}
      </label>
      
      {hint && (
        <p id={hintId} className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">
          {hint}
        </p>
      )}
      
      <input
        id={id}
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={`${hint ? hintId : ''} ${error ? errorId : ''}`.trim()}
        className={`
          w-full px-4 py-3 
          bg-glass-light border border-glass-border rounded-lg
          text-white placeholder-gray-400
          focus:outline-none focus:ring-4 focus:ring-primary-500/50 focus:border-primary-500
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
          ${error ? 'border-red-500 focus:ring-red-500/50' : ''}
          ${isFocused ? 'ring-4 ring-primary-500/50 border-primary-500' : ''}
        `}
        {...props}
      />
      
      {error && (
        <p id={errorId} className="text-sm text-red-500 sm:px-4 md:px-6 lg:px-8" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// =========================================
// SKIP LINKS
// =========================================

interface SkipLinkProps {
  href: string;
  children: ReactNode;
  className?: string;

}

export const SkipLink: React.FC<SkipLinkProps> = ({
  href,
  children,
  className = ''
}: any) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleFocus = () => setIsVisible(true);
  const handleBlur = () => setIsVisible(false);

  return (
    <a
      href={href}
      onFocus={handleFocus}
      className={`
        absolute top-4 left-4 z-50
        px-4 py-2 bg-primary-600 text-white
        font-semibold rounded-lg
        focus:outline-none focus:ring-4 focus:ring-primary-500/50
        transform transition-transform duration-200
        ${isVisible ? 'translate-y-0' : '-translate-y-20 opacity-0'}
        ${className}
      `}
    >
      {children}
    </a>
  );
};

// =========================================
// FOCUS TRAP
// =========================================

interface FocusTrapProps {
  children: ReactNode;
  active?: boolean;
  restoreFocus?: boolean;
  className?: string;

}

export const FocusTrap: React.FC<FocusTrapProps> = ({
  children,
  active = true,
  restoreFocus = true,
  className = ''
}: any) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    // Store the currently focused element
    lastFocusedElement.current = document.activeElement as HTMLElement;

    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();

      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();


    };

    // Focus the first element
    firstElement?.focus();

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      
      // Restore focus to the previously focused element
      if (restoreFocus && lastFocusedElement.current) {
        lastFocusedElement.current.focus();

    };
  }, [active, restoreFocus]);

  if (!active) {
    return <>{children}</>;

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

// =========================================
// ACCESSIBILITY SETTINGS PANEL
// =========================================

export const AccessibilityPanel: React.FC = () => {
  const {
    screenReaderMode,
    highContrastMode,
    reducedMotionMode,
    largeTextMode,
    focusIndicatorMode,
    colorBlindMode,
    toggleScreenReader,
    toggleHighContrast,
    toggleReducedMotion,
    toggleLargeText,
    toggleFocusIndicator,
    setColorBlindMode
  } = useAccessibility();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AccessibleButton
        onClick={() => setIsOpen(true)}
        aria-label="Open accessibility settings"
        variant="default"
        className="fixed top-4 right-4 z-50 sm:px-4 md:px-6 lg:px-8"
      >
        ♿ A11y
      </AccessibleButton>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 sm:px-4 md:px-6 lg:px-8"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <FocusTrap active={isOpen}>
              <motion.div
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100%' }}
                className="fixed top-0 right-0 w-full max-w-md h-full bg-dark-900 border-l border-gray-700 z-50 overflow-y-auto sm:px-4 md:px-6 lg:px-8"
              >
                <div className="p-6 sm:px-4 md:px-6 lg:px-8">
                  <div className="flex items-center justify-between mb-6 sm:px-4 md:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">Accessibility Settings</h2>
                    <AccessibleButton
                      onClick={() => setIsOpen(false)}
                      aria-label="Close accessibility settings"
                      variant="default"
                      size="sm"
                    >
                      ✕
                    </AccessibleButton>
                  </div>

                  <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
                    {/* Vision Settings */}
                    <section>
                      <h3 className="text-lg font-semibold text-white mb-4 sm:px-4 md:px-6 lg:px-8">Vision</h3>
                      <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                        <label className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                          <span className="text-white sm:px-4 md:px-6 lg:px-8">High Contrast</span>
                          <input
                            type="checkbox"
                            checked={highContrastMode}
                            onChange={toggleHighContrast}
                          />
                        </label>

                        <label className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                          <span className="text-white sm:px-4 md:px-6 lg:px-8">Large Text</span>
                          <input
                            type="checkbox"
                            checked={largeTextMode}
                            onChange={toggleLargeText}
                          />
                        </label>

                        <label className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                          <span className="text-white sm:px-4 md:px-6 lg:px-8">Focus Indicators</span>
                          <input
                            type="checkbox"
                            checked={focusIndicatorMode}
                            onChange={toggleFocusIndicator}
                          />
                        </label>

                        <div>
                          <label className="block text-white mb-2 sm:px-4 md:px-6 lg:px-8">Color Blind Support</label>
                          <select
                            value={colorBlindMode}
                            onChange={(e: any) => setColorBlindMode(e.target.value as any)}
                          >
                            <option value="none">None</option>
                            <option value="protanopia">Protanopia (Red-blind)</option>
                            <option value="deuteranopia">Deuteranopia (Green-blind)</option>
                            <option value="tritanopia">Tritanopia (Blue-blind)</option>
                          </select>
                        </div>
                      </div>
                    </section>

                    {/* Motion Settings */}
                    <section>
                      <h3 className="text-lg font-semibold text-white mb-4 sm:px-4 md:px-6 lg:px-8">Motion</h3>
                      <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                        <label className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                          <span className="text-white sm:px-4 md:px-6 lg:px-8">Reduced Motion</span>
                          <input
                            type="checkbox"
                            checked={reducedMotionMode}
                            onChange={toggleReducedMotion}
                          />
                        </label>
                      </div>
                    </section>

                    {/* Screen Reader Settings */}
                    <section>
                      <h3 className="text-lg font-semibold text-white mb-4 sm:px-4 md:px-6 lg:px-8">Screen Reader</h3>
                      <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                        <label className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                          <span className="text-white sm:px-4 md:px-6 lg:px-8">Screen Reader Mode</span>
                          <input
                            type="checkbox"
                            checked={screenReaderMode}
                            onChange={toggleScreenReader}
                          />
                        </label>
                      </div>
                    </section>
                  </div>
                </div>
              </motion.div>
            </FocusTrap>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// =========================================
// EXPORTS
// =========================================

export default {
  AccessibilityProvider,
  useAccessibility,
  AccessibleButton,
  AccessibleInput,
  SkipLink,
  FocusTrap,
  AccessibilityPanel,
  LiveRegion
};