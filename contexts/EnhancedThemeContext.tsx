/**
 * Enhanced Theme System - Advanced Dark/Light Mode with Customization
 * Professional theme management with seasonal themes, user preferences, and accessibility
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// =========================================
// THEME TYPES & INTERFACES
// =========================================

export type ThemeMode = 'light' | 'dark' | 'system' | 'auto';

export type ColorScheme = 
  | 'default'
  | 'champion' 
  | 'legend'
  | 'neon'
  | 'sunset'
  | 'ocean'
  | 'forest'
  | 'royal'
  | 'cyberpunk';

export type SeasonalTheme = 
  | 'none'
  | 'preseason'
  | 'regular'
  | 'playoffs'
  | 'championship'
  | 'offseason';

export interface ThemeCustomization {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  borderColor: string;
  glassOpacity: number;
  blurIntensity: number;
  shadowIntensity: number;
  borderRadius: number;
  fontSize: number;
  spacing: number;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  increasedTextSize: boolean;
  focusVisible: boolean;
  colorBlindFriendly: boolean;
  screenReaderOptimized: boolean;
}

export interface ThemeState {
  mode: ThemeMode;
  colorScheme: ColorScheme;
  seasonalTheme: SeasonalTheme;
  customization: ThemeCustomization;
  accessibility: AccessibilitySettings;
  isSystemDark: boolean;
  isInitialized: boolean;
}

export interface ThemeActions {
  setMode: (mode: ThemeMode) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  setSeasonalTheme: (theme: SeasonalTheme) => void;
  updateCustomization: (customization: Partial<ThemeCustomization>) => void;
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  resetTheme: () => void;
  toggleMode: () => void;
  exportTheme: () => string;
  importTheme: (themeData: string) => void;
}

export type ThemeContextType = ThemeState & ThemeActions;

// =========================================
// DEFAULT THEME CONFIGURATIONS
// =========================================

const defaultCustomization: ThemeCustomization = {
  primaryColor: '#4f46e5',
  accentColor: '#06b6d4',
  backgroundColor: '#0f172a',
  surfaceColor: '#1e293b',
  textColor: '#f8fafc',
  borderColor: 'rgba(255, 255, 255, 0.1)',
  glassOpacity: 0.08,
  blurIntensity: 16,
  shadowIntensity: 0.25,
  borderRadius: 12,
  fontSize: 16,
  spacing: 16
};

const defaultAccessibility: AccessibilitySettings = {
  highContrast: false,
  reducedMotion: false,
  increasedTextSize: false,
  focusVisible: true,
  colorBlindFriendly: false,
  screenReaderOptimized: false
};

const colorSchemes: Record<ColorScheme, Partial<ThemeCustomization>> = {
  default: {
    primaryColor: '#4f46e5',
    accentColor: '#06b6d4'
  },
  champion: {
    primaryColor: '#ffd700',
    accentColor: '#ffed4e',
    backgroundColor: '#1a1a0a',
    surfaceColor: '#2a2a1a'
  },
  legend: {
    primaryColor: '#9f7aea',
    accentColor: '#b794f6',
    backgroundColor: '#1a0f2e',
    surfaceColor: '#2d1b3d'
  },
  neon: {
    primaryColor: '#00ffff',
    accentColor: '#ff00ff',
    backgroundColor: '#0a0a0f',
    surfaceColor: '#1a1a2e'
  },
  sunset: {
    primaryColor: '#f59e0b',
    accentColor: '#ec4899',
    backgroundColor: '#1c1917',
    surfaceColor: '#292524'
  },
  ocean: {
    primaryColor: '#0ea5e9',
    accentColor: '#06b6d4',
    backgroundColor: '#0f172a',
    surfaceColor: '#1e293b'
  },
  forest: {
    primaryColor: '#10b981',
    accentColor: '#34d399',
    backgroundColor: '#064e3b',
    surfaceColor: '#065f46'
  },
  royal: {
    primaryColor: '#7c3aed',
    accentColor: '#a855f7',
    backgroundColor: '#1e1b4b',
    surfaceColor: '#312e81'
  },
  cyberpunk: {
    primaryColor: '#ef4444',
    accentColor: '#f59e0b',
    backgroundColor: '#0c0a09',
    surfaceColor: '#1c1917'
  }
};

const seasonalThemes: Record<SeasonalTheme, Partial<ThemeCustomization>> = {
  none: {},
  preseason: {
    primaryColor: '#06b6d4',
    accentColor: '#0ea5e9'
  },
  regular: {
    primaryColor: '#10b981',
    accentColor: '#34d399'
  },
  playoffs: {
    primaryColor: '#f59e0b',
    accentColor: '#fbbf24'
  },
  championship: {
    primaryColor: '#ffd700',
    accentColor: '#ffed4e'
  },
  offseason: {
    primaryColor: '#6b7280',
    accentColor: '#9ca3af'
  }
};

// =========================================
// THEME CONTEXT
// =========================================

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// =========================================
// THEME PROVIDER
// =========================================

interface ThemeProviderProps {
  children: ReactNode;
  storageKey?: string;
  defaultMode?: ThemeMode;
  enableSeasonalThemes?: boolean;
  enableSystemPreference?: boolean;
}

export const EnhancedThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  storageKey = 'astral-draft-theme',
  defaultMode = 'system',
  enableSeasonalThemes = true,
  enableSystemPreference = true
}) => {
  // =========================================
  // STATE MANAGEMENT
  // =========================================

  const [state, setState] = useState<ThemeState>({
    mode: defaultMode,
    colorScheme: 'default',
    seasonalTheme: 'none',
    customization: defaultCustomization,
    accessibility: defaultAccessibility,
    isSystemDark: false,
    isInitialized: false
  });

  // =========================================
  // SYSTEM PREFERENCE DETECTION
  // =========================================

  useEffect(() => {
    if (!enableSystemPreference) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setState(prev => ({ ...prev, isSystemDark: e.matches }));
    };

    setState(prev => ({ ...prev, isSystemDark: mediaQuery.matches }));
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [enableSystemPreference]);

  // =========================================
  // ACCESSIBILITY PREFERENCES
  // =========================================

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setState(prev => ({
        ...prev,
        accessibility: { ...prev.accessibility, reducedMotion: e.matches }
      }));
    };

    const handleContrastChange = (e: MediaQueryListEvent) => {
      setState(prev => ({
        ...prev,
        accessibility: { ...prev.accessibility, highContrast: e.matches }
      }));
    };

    setState(prev => ({
      ...prev,
      accessibility: {
        ...prev.accessibility,
        reducedMotion: prefersReducedMotion.matches,
        highContrast: prefersHighContrast.matches
      }
    }));

    prefersReducedMotion.addEventListener('change', handleMotionChange);
    prefersHighContrast.addEventListener('change', handleContrastChange);

    return () => {
      prefersReducedMotion.removeEventListener('change', handleMotionChange);
      prefersHighContrast.removeEventListener('change', handleContrastChange);
    };
  }, []);

  // =========================================
  // SEASONAL THEME DETECTION
  // =========================================

  useEffect(() => {
    if (!enableSeasonalThemes) return;

    const detectSeasonalTheme = (): SeasonalTheme => {
      const now = new Date();
      const month = now.getMonth();
      const day = now.getDate();

      // August - Preseason
      if (month === 7) return 'preseason';
      
      // September - November - Regular Season
      if (month >= 8 && month <= 10) return 'regular';
      
      // December - January - Playoffs
      if (month === 11 || month === 0) return 'playoffs';
      
      // February - Championship
      if (month === 1 && day <= 14) return 'championship';
      
      // Rest of year - Offseason
      return 'offseason';
    };

    const seasonal = detectSeasonalTheme();
    setState(prev => ({ ...prev, seasonalTheme: seasonal }));
  }, [enableSeasonalThemes]);

  // =========================================
  // LOCAL STORAGE PERSISTENCE
  // =========================================

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setState(prev => ({ 
          ...prev, 
          ...parsed, 
          isInitialized: true 
        }));
      } else {
        setState(prev => ({ ...prev, isInitialized: true }));
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
      setState(prev => ({ ...prev, isInitialized: true }));
    }
  }, [storageKey]);

  useEffect(() => {
    if (state.isInitialized) {
      try {
        const { isSystemDark, isInitialized, ...persistentState } = state;
        localStorage.setItem(storageKey, JSON.stringify(persistentState));
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error);
      }
    }
  }, [state, storageKey]);

  // =========================================
  // THEME CALCULATION
  // =========================================

  const getComputedTheme = (): ThemeCustomization => {
    let computedTheme = { ...state.customization };

    // Apply color scheme
    if (state.colorScheme !== 'default') {
      computedTheme = {
        ...computedTheme,
        ...colorSchemes[state.colorScheme]
      };
    }

    // Apply seasonal theme
    if (state.seasonalTheme !== 'none' && enableSeasonalThemes) {
      computedTheme = {
        ...computedTheme,
        ...seasonalThemes[state.seasonalTheme]
      };
    }

    // Apply accessibility adjustments
    if (state.accessibility.increasedTextSize) {
      computedTheme.fontSize = Math.max(computedTheme.fontSize * 1.25, 18);
    }

    if (state.accessibility.highContrast) {
      // Increase contrast ratios
      computedTheme.shadowIntensity = Math.min(computedTheme.shadowIntensity * 2, 1);
      computedTheme.glassOpacity = Math.min(computedTheme.glassOpacity * 0.5, 0.2);
    }

    return computedTheme;
  };

  // =========================================
  // THEME ACTIONS
  // =========================================

  const actions: ThemeActions = {
    setMode: (mode) => {
      setState(prev => ({ ...prev, mode }));
    },

    setColorScheme: (colorScheme) => {
      setState(prev => ({ ...prev, colorScheme }));
    },

    setSeasonalTheme: (seasonalTheme) => {
      setState(prev => ({ ...prev, seasonalTheme }));
    },

    updateCustomization: (updates) => {
      setState(prev => ({
        ...prev,
        customization: { ...prev.customization, ...updates }
      }));
    },

    updateAccessibility: (updates) => {
      setState(prev => ({
        ...prev,
        accessibility: { ...prev.accessibility, ...updates }
      }));
    },

    resetTheme: () => {
      setState(prev => ({
        ...prev,
        colorScheme: 'default',
        customization: defaultCustomization,
        accessibility: defaultAccessibility
      }));
    },

    toggleMode: () => {
      const modes: ThemeMode[] = ['light', 'dark', 'system'];
      const currentIndex = modes.indexOf(state.mode);
      const nextIndex = (currentIndex + 1) % modes.length;
      setState(prev => ({ ...prev, mode: modes[nextIndex] }));
    },

    exportTheme: () => {
      const exportData = {
        mode: state.mode,
        colorScheme: state.colorScheme,
        customization: state.customization,
        accessibility: state.accessibility,
        version: '1.0'
      };
      return JSON.stringify(exportData, null, 2);
    },

    importTheme: (themeData) => {
      try {
        const parsed = JSON.parse(themeData);
        if (parsed.version === '1.0') {
          setState(prev => ({
            ...prev,
            mode: parsed.mode || prev.mode,
            colorScheme: parsed.colorScheme || prev.colorScheme,
            customization: { ...prev.customization, ...parsed.customization },
            accessibility: { ...prev.accessibility, ...parsed.accessibility }
          }));
        }
      } catch (error) {
        console.error('Failed to import theme:', error);
        throw new Error('Invalid theme data format');
      }
    }
  };

  // =========================================
  // CSS VARIABLE APPLICATION
  // =========================================

  useEffect(() => {
    if (!state.isInitialized) return;

    const isDark = state.mode === 'dark' || (state.mode === 'system' && state.isSystemDark);
    const computedTheme = getComputedTheme();

    const root = document.documentElement;

    // Apply theme mode class
    root.classList.remove('light', 'dark');
    root.classList.add(isDark ? 'dark' : 'light');

    // Apply color scheme class
    root.classList.remove('scheme-default', 'scheme-champion', 'scheme-legend', 'scheme-neon', 'scheme-sunset', 'scheme-ocean', 'scheme-forest', 'scheme-royal', 'scheme-cyberpunk');
    root.classList.add(`scheme-${state.colorScheme}`);

    // Apply seasonal theme class
    root.classList.remove('season-none', 'season-preseason', 'season-regular', 'season-playoffs', 'season-championship', 'season-offseason');
    root.classList.add(`season-${state.seasonalTheme}`);

    // Apply accessibility classes
    state.accessibility.highContrast && root.classList.add('high-contrast');
    state.accessibility.reducedMotion && root.classList.add('reduce-motion');
    state.accessibility.increasedTextSize && root.classList.add('large-text');
    state.accessibility.focusVisible && root.classList.add('focus-visible');
    state.accessibility.colorBlindFriendly && root.classList.add('colorblind-friendly');

    // Apply CSS custom properties
    const cssVars = {
      '--theme-primary': computedTheme.primaryColor,
      '--theme-accent': computedTheme.accentColor,
      '--theme-background': computedTheme.backgroundColor,
      '--theme-surface': computedTheme.surfaceColor,
      '--theme-text': computedTheme.textColor,
      '--theme-border': computedTheme.borderColor,
      '--theme-glass-opacity': computedTheme.glassOpacity.toString(),
      '--theme-blur-intensity': `${computedTheme.blurIntensity}px`,
      '--theme-shadow-intensity': computedTheme.shadowIntensity.toString(),
      '--theme-border-radius': `${computedTheme.borderRadius}px`,
      '--theme-font-size': `${computedTheme.fontSize}px`,
      '--theme-spacing': `${computedTheme.spacing}px`
    };

    Object.entries(cssVars).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Update meta theme-color for mobile browsers
    let metaThemeColor = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.content = computedTheme.backgroundColor;

  }, [state]);

  // =========================================
  // CONTEXT VALUE
  // =========================================

  const contextValue: ThemeContextType = {
    ...state,
    ...actions
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <ThemeContext.Provider value={contextValue}>
      <AnimatePresence>
        {state.isInitialized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen transition-colors duration-300"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </ThemeContext.Provider>
  );
};

// =========================================
// THEME COMPONENTS
// =========================================

interface ThemeSwitcherProps {
  className?: string;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  className = '',
  showLabels = true,
  size = 'md'
}) => {
  const { mode, toggleMode } = useTheme();

  const icons = {
    light: '☀️',
    dark: '🌙',
    system: '🖥️'
  };

  const labels = {
    light: 'Light',
    dark: 'Dark',
    system: 'System'
  };

  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  return (
    <motion.button
      onClick={toggleMode}
      className={`
        ${sizes[size]} 
        flex items-center justify-center gap-2
        bg-glass-medium backdrop-blur-xl 
        border border-glass-border 
        rounded-xl
        text-white
        hover:bg-glass-heavy 
        hover:border-glass-border-strong
        transition-all duration-200
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light'} mode`}
    >
      <span>{icons[mode]}</span>
      {showLabels && size !== 'sm' && (
        <span className="text-sm font-medium">{labels[mode]}</span>
      )}
    </motion.button>
  );
};

interface ColorSchemeSelectorProps {
  className?: string;
}

export const ColorSchemeSelector: React.FC<ColorSchemeSelectorProps> = ({
  className = ''
}) => {
  const { colorScheme, setColorScheme } = useTheme();

  const schemes: { key: ColorScheme; name: string; colors: string[] }[] = [
    { key: 'default', name: 'Default', colors: ['#4f46e5', '#06b6d4'] },
    { key: 'champion', name: 'Champion', colors: ['#ffd700', '#ffed4e'] },
    { key: 'legend', name: 'Legend', colors: ['#9f7aea', '#b794f6'] },
    { key: 'neon', name: 'Neon', colors: ['#00ffff', '#ff00ff'] },
    { key: 'sunset', name: 'Sunset', colors: ['#f59e0b', '#ec4899'] },
    { key: 'ocean', name: 'Ocean', colors: ['#0ea5e9', '#06b6d4'] },
    { key: 'forest', name: 'Forest', colors: ['#10b981', '#34d399'] },
    { key: 'royal', name: 'Royal', colors: ['#7c3aed', '#a855f7'] },
    { key: 'cyberpunk', name: 'Cyberpunk', colors: ['#ef4444', '#f59e0b'] }
  ];

  return (
    <div className={`grid grid-cols-3 gap-2 ${className}`}>
      {schemes.map((scheme) => (
        <motion.button
          key={scheme.key}
          onClick={() => setColorScheme(scheme.key)}
          className={`
            p-3 rounded-xl border-2 transition-all duration-200
            ${colorScheme === scheme.key 
              ? 'border-white bg-glass-medium' 
              : 'border-glass-border bg-glass-light hover:bg-glass-medium'
            }
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-1 mb-2">
            {scheme.colors.map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="text-xs text-white font-medium">{scheme.name}</div>
        </motion.button>
      ))}
    </div>
  );
};

// =========================================
// EXPORTS
// =========================================

export default EnhancedThemeProvider;

export {
  ThemeContext,
  ThemeSwitcher,
  ColorSchemeSelector
};

export type {
  ThemeMode,
  ColorScheme,
  SeasonalTheme,
  ThemeCustomization,
  AccessibilitySettings,
  ThemeState,
  ThemeActions,
  ThemeContextType
};