/**
 * Enhanced Theme System - Advanced Dark/Light Mode with Customization
 * Professional theme management with seasonal themes, user preferences, and accessibility
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;

// =========================================
// THEME TYPES & INTERFACES
// =========================================

export type ThemeMode = &apos;light&apos; | &apos;dark&apos; | &apos;system&apos; | &apos;auto&apos;;

export type ColorScheme = 
  | &apos;default&apos;
  | &apos;champion&apos; 
  | &apos;legend&apos;
  | &apos;neon&apos;
  | &apos;sunset&apos;
  | &apos;ocean&apos;
  | &apos;forest&apos;
  | &apos;royal&apos;
  | &apos;cyberpunk&apos;;

export type SeasonalTheme = 
  | &apos;none&apos;
  | &apos;preseason&apos;
  | &apos;regular&apos;
  | &apos;playoffs&apos;
  | &apos;championship&apos;
  | &apos;offseason&apos;;

export interface ThemeCustomization {
}
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
}
  highContrast: boolean;
  reducedMotion: boolean;
  increasedTextSize: boolean;
  focusVisible: boolean;
  colorBlindFriendly: boolean;
  screenReaderOptimized: boolean;

}

export interface ThemeState {
}
  mode: ThemeMode;
  colorScheme: ColorScheme;
  seasonalTheme: SeasonalTheme;
  customization: ThemeCustomization;
  accessibility: AccessibilitySettings;
  isSystemDark: boolean;
  isInitialized: boolean;

}

export interface ThemeActions {
}
  setMode: (mode: ThemeMode) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  setSeasonalTheme: (theme: SeasonalTheme) => void;
  updateCustomization: (customization: Partial<ThemeCustomization>) => void;
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  resetTheme: () => void;
  toggleMode: () => void;
  exportTheme: () => string;
  importTheme: (themeData: string) => void;

export type ThemeContextType = ThemeState & ThemeActions;

// =========================================
// DEFAULT THEME CONFIGURATIONS
// =========================================

}

const defaultCustomization: ThemeCustomization = {
}
  primaryColor: &apos;#4f46e5&apos;,
  accentColor: &apos;#06b6d4&apos;,
  backgroundColor: &apos;#0f172a&apos;,
  surfaceColor: &apos;#1e293b&apos;,
  textColor: &apos;#f8fafc&apos;,
  borderColor: &apos;rgba(255, 255, 255, 0.1)&apos;,
  glassOpacity: 0.08,
  blurIntensity: 16,
  shadowIntensity: 0.25,
  borderRadius: 12,
  fontSize: 16,
  spacing: 16
};

const defaultAccessibility: AccessibilitySettings = {
}
  highContrast: false,
  reducedMotion: false,
  increasedTextSize: false,
  focusVisible: true,
  colorBlindFriendly: false,
  screenReaderOptimized: false
};

const colorSchemes: Record<ColorScheme, Partial<ThemeCustomization>> = {
}
  default: {
}
    primaryColor: &apos;#4f46e5&apos;,
    accentColor: &apos;#06b6d4&apos;
  },
  champion: {
}
    primaryColor: &apos;#ffd700&apos;,
    accentColor: &apos;#ffed4e&apos;,
    backgroundColor: &apos;#1a1a0a&apos;,
    surfaceColor: &apos;#2a2a1a&apos;
  },
  legend: {
}
    primaryColor: &apos;#9f7aea&apos;,
    accentColor: &apos;#b794f6&apos;,
    backgroundColor: &apos;#1a0f2e&apos;,
    surfaceColor: &apos;#2d1b3d&apos;
  },
  neon: {
}
    primaryColor: &apos;#00ffff&apos;,
    accentColor: &apos;#ff00ff&apos;,
    backgroundColor: &apos;#0a0a0f&apos;,
    surfaceColor: &apos;#1a1a2e&apos;
  },
  sunset: {
}
    primaryColor: &apos;#f59e0b&apos;,
    accentColor: &apos;#ec4899&apos;,
    backgroundColor: &apos;#1c1917&apos;,
    surfaceColor: &apos;#292524&apos;
  },
  ocean: {
}
    primaryColor: &apos;#0ea5e9&apos;,
    accentColor: &apos;#06b6d4&apos;,
    backgroundColor: &apos;#0f172a&apos;,
    surfaceColor: &apos;#1e293b&apos;
  },
  forest: {
}
    primaryColor: &apos;#10b981&apos;,
    accentColor: &apos;#34d399&apos;,
    backgroundColor: &apos;#064e3b&apos;,
    surfaceColor: &apos;#065f46&apos;
  },
  royal: {
}
    primaryColor: &apos;#7c3aed&apos;,
    accentColor: &apos;#a855f7&apos;,
    backgroundColor: &apos;#1e1b4b&apos;,
    surfaceColor: &apos;#312e81&apos;
  },
  cyberpunk: {
}
    primaryColor: &apos;#ef4444&apos;,
    accentColor: &apos;#f59e0b&apos;,
    backgroundColor: &apos;#0c0a09&apos;,
    surfaceColor: &apos;#1c1917&apos;

};

const seasonalThemes: Record<SeasonalTheme, Partial<ThemeCustomization>> = {
}
  none: {},
  preseason: {
}
    primaryColor: &apos;#06b6d4&apos;,
    accentColor: &apos;#0ea5e9&apos;
  },
  regular: {
}
    primaryColor: &apos;#10b981&apos;,
    accentColor: &apos;#34d399&apos;
  },
  playoffs: {
}
    primaryColor: &apos;#f59e0b&apos;,
    accentColor: &apos;#fbbf24&apos;
  },
  championship: {
}
    primaryColor: &apos;#ffd700&apos;,
    accentColor: &apos;#ffed4e&apos;
  },
  offseason: {
}
    primaryColor: &apos;#6b7280&apos;,
    accentColor: &apos;#9ca3af&apos;

};

// =========================================
// THEME CONTEXT
// =========================================

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = (): ThemeContextType => {
}
  const context = useContext(ThemeContext);
  if (!context) {
}
    throw new Error(&apos;useTheme must be used within a ThemeProvider&apos;);

  return context;
};

// =========================================
// THEME PROVIDER
// =========================================

interface ThemeProviderProps {
}
  children: ReactNode;
  storageKey?: string;
  defaultMode?: ThemeMode;
  enableSeasonalThemes?: boolean;
  enableSystemPreference?: boolean;

}

export const EnhancedThemeProvider: React.FC<ThemeProviderProps> = ({
}
  children,
  storageKey = &apos;astral-draft-theme&apos;,
  defaultMode = &apos;system&apos;,
  enableSeasonalThemes = true,
  enableSystemPreference = true
}: any) => {
}
  // =========================================
  // STATE MANAGEMENT
  // =========================================

  const [state, setState] = useState<ThemeState>({
}
    mode: defaultMode,
    colorScheme: &apos;default&apos;,
    seasonalTheme: &apos;none&apos;,
    customization: defaultCustomization,
    accessibility: defaultAccessibility,
    isSystemDark: false,
    isInitialized: false
  });

  // =========================================
  // SYSTEM PREFERENCE DETECTION
  // =========================================

  useEffect(() => {
}
    if (!enableSystemPreference) return;

    const mediaQuery = window.matchMedia(&apos;(prefers-color-scheme: dark)&apos;);
    
    const handleChange = (e: MediaQueryListEvent) => {
}
      setState(prev => ({ ...prev, isSystemDark: e.matches }));
    };

    setState(prev => ({ ...prev, isSystemDark: mediaQuery.matches }));
    mediaQuery.addEventListener(&apos;change&apos;, handleChange);

    return () => mediaQuery.removeEventListener(&apos;change&apos;, handleChange);
  }, [enableSystemPreference]);

  // =========================================
  // ACCESSIBILITY PREFERENCES
  // =========================================

  useEffect(() => {
}
    const prefersReducedMotion = window.matchMedia(&apos;(prefers-reduced-motion: reduce)&apos;);
    const prefersHighContrast = window.matchMedia(&apos;(prefers-contrast: high)&apos;);

    const handleMotionChange = (e: MediaQueryListEvent) => {
}
      setState(prev => ({
}
        ...prev,
        accessibility: { ...prev.accessibility, reducedMotion: e.matches }
      }));
    };

    const handleContrastChange = (e: MediaQueryListEvent) => {
}
      setState(prev => ({
}
        ...prev,
        accessibility: { ...prev.accessibility, highContrast: e.matches }
      }));
    };

    setState(prev => ({
}
      ...prev,
      accessibility: {
}
        ...prev.accessibility,
        reducedMotion: prefersReducedMotion.matches,
        highContrast: prefersHighContrast.matches

    }));

    prefersReducedMotion.addEventListener(&apos;change&apos;, handleMotionChange);
    prefersHighContrast.addEventListener(&apos;change&apos;, handleContrastChange);

    return () => {
}
      prefersReducedMotion.removeEventListener(&apos;change&apos;, handleMotionChange);
      prefersHighContrast.removeEventListener(&apos;change&apos;, handleContrastChange);
    };
  }, []);

  // =========================================
  // SEASONAL THEME DETECTION
  // =========================================

  useEffect(() => {
}
    if (!enableSeasonalThemes) return;

    const detectSeasonalTheme = (): SeasonalTheme => {
}
      const now = new Date();
      const month = now.getMonth();
      const day = now.getDate();

      // August - Preseason
      if (month === 7) return &apos;preseason&apos;;
      
      // September - November - Regular Season
      if (month >= 8 && month <= 10) return &apos;regular&apos;;
      
      // December - January - Playoffs
      if (month === 11 || month === 0) return &apos;playoffs&apos;;
      
      // February - Championship
      if (month === 1 && day <= 14) return &apos;championship&apos;;
      
      // Rest of year - Offseason
      return &apos;offseason&apos;;
    };

    const seasonal = detectSeasonalTheme();
    setState(prev => ({ ...prev, seasonalTheme: seasonal }));
  }, [enableSeasonalThemes]);

  // =========================================
  // LOCAL STORAGE PERSISTENCE
  // =========================================

  useEffect(() => {
}
    try {
}
      const stored = localStorage.getItem(storageKey);
      if (stored) {
}
        const parsed = JSON.parse(stored);
        setState(prev => ({ 
}
          ...prev, 
          ...parsed, 
          isInitialized: true 
        }));
      } else {
}
        setState(prev => ({ ...prev, isInitialized: true }));

    } catch (error) {
}
      console.warn(&apos;Failed to load theme from localStorage:&apos;, error);
      setState(prev => ({ ...prev, isInitialized: true }));

  }, [storageKey]);

  useEffect(() => {
}
    if (state.isInitialized) {
}
      try {
}

        const { isSystemDark, isInitialized, ...persistentState } = state;
        localStorage.setItem(storageKey, JSON.stringify(persistentState));

    } catch (error) {
}
        console.warn(&apos;Failed to save theme to localStorage:&apos;, error);


  }, [state, storageKey]);

  // =========================================
  // THEME CALCULATION
  // =========================================

  const getComputedTheme = (): ThemeCustomization => {
}
    let computedTheme = { ...state.customization };

    // Apply color scheme
    if (state.colorScheme !== &apos;default&apos;) {
}
      computedTheme = {
}
        ...computedTheme,
        ...colorSchemes[state.colorScheme]
      };

    // Apply seasonal theme
    if (state.seasonalTheme !== &apos;none&apos; && enableSeasonalThemes) {
}
      computedTheme = {
}
        ...computedTheme,
        ...seasonalThemes[state.seasonalTheme]
      };

    // Apply accessibility adjustments
    if (state.accessibility.increasedTextSize) {
}
      computedTheme.fontSize = Math.max(computedTheme.fontSize * 1.25, 18);

    if (state.accessibility.highContrast) {
}
      // Increase contrast ratios
      computedTheme.shadowIntensity = Math.min(computedTheme.shadowIntensity * 2, 1);
      computedTheme.glassOpacity = Math.min(computedTheme.glassOpacity * 0.5, 0.2);

    return computedTheme;
  };

  // =========================================
  // THEME ACTIONS
  // =========================================

  const actions: ThemeActions = {
}
    setMode: (mode: any) => {
}
      setState(prev => ({ ...prev, mode }));
    },

    setColorScheme: (colorScheme: any) => {
}
      setState(prev => ({ ...prev, colorScheme }));
    },

    setSeasonalTheme: (seasonalTheme: any) => {
}
      setState(prev => ({ ...prev, seasonalTheme }));
    },

    updateCustomization: (updates: any) => {
}
      setState(prev => ({
}
        ...prev,
        customization: { ...prev.customization, ...updates }
      }));
    },

    updateAccessibility: (updates: any) => {
}
      setState(prev => ({
}
        ...prev,
        accessibility: { ...prev.accessibility, ...updates }
      }));
    },

    resetTheme: () => {
}
      setState(prev => ({
}
        ...prev,
        colorScheme: &apos;default&apos;,
        customization: defaultCustomization,
        accessibility: defaultAccessibility
      }));
    },

    toggleMode: () => {
}
      const modes: ThemeMode[] = [&apos;light&apos;, &apos;dark&apos;, &apos;system&apos;];
      const currentIndex = modes.indexOf(state.mode);
      const nextIndex = (currentIndex + 1) % modes.length;
      setState(prev => ({ ...prev, mode: modes[nextIndex] }));
    },

    exportTheme: () => {
}
      const exportData = {
}
        mode: state.mode,
        colorScheme: state.colorScheme,
        customization: state.customization,
        accessibility: state.accessibility,
        version: &apos;1.0&apos;
      };
      return JSON.stringify(exportData, null, 2);
    },

    importTheme: (themeData: any) => {
}
      try {
}
        const parsed = JSON.parse(themeData);
        if (parsed.version === &apos;1.0&apos;) {
}
          setState(prev => ({
}
            ...prev,
            mode: parsed.mode || prev.mode,
            colorScheme: parsed.colorScheme || prev.colorScheme,
            customization: { ...prev.customization, ...parsed.customization },
            accessibility: { ...prev.accessibility, ...parsed.accessibility }
          }));

    } catch (error) {
}
        console.error(&apos;Failed to import theme:&apos;, error);
        throw new Error(&apos;Invalid theme data format&apos;);


  };

  // =========================================
  // CSS VARIABLE APPLICATION
  // =========================================

  useEffect(() => {
}
    if (!state.isInitialized) return;

    const isDark = state.mode === &apos;dark&apos; || (state.mode === &apos;system&apos; && state.isSystemDark);
    const computedTheme = getComputedTheme();

    const root = document.documentElement;

    // Apply theme mode class
    root.classList.remove(&apos;light&apos;, &apos;dark&apos;);
    root.classList.add(isDark ? &apos;dark&apos; : &apos;light&apos;);

    // Apply color scheme class
    root.classList.remove(&apos;scheme-default&apos;, &apos;scheme-champion&apos;, &apos;scheme-legend&apos;, &apos;scheme-neon&apos;, &apos;scheme-sunset&apos;, &apos;scheme-ocean&apos;, &apos;scheme-forest&apos;, &apos;scheme-royal&apos;, &apos;scheme-cyberpunk&apos;);
    root.classList.add(`scheme-${state.colorScheme}`);

    // Apply seasonal theme class
    root.classList.remove(&apos;season-none&apos;, &apos;season-preseason&apos;, &apos;season-regular&apos;, &apos;season-playoffs&apos;, &apos;season-championship&apos;, &apos;season-offseason&apos;);
    root.classList.add(`season-${state.seasonalTheme}`);

    // Apply accessibility classes
    state.accessibility.highContrast && root.classList.add(&apos;high-contrast&apos;);
    state.accessibility.reducedMotion && root.classList.add(&apos;reduce-motion&apos;);
    state.accessibility.increasedTextSize && root.classList.add(&apos;large-text&apos;);
    state.accessibility.focusVisible && root.classList.add(&apos;focus-visible&apos;);
    state.accessibility.colorBlindFriendly && root.classList.add(&apos;colorblind-friendly&apos;);

    // Apply CSS custom properties
    const cssVars = {
}
      &apos;--theme-primary&apos;: computedTheme.primaryColor,
      &apos;--theme-accent&apos;: computedTheme.accentColor,
      &apos;--theme-background&apos;: computedTheme.backgroundColor,
      &apos;--theme-surface&apos;: computedTheme.surfaceColor,
      &apos;--theme-text&apos;: computedTheme.textColor,
      &apos;--theme-border&apos;: computedTheme.borderColor,
      &apos;--theme-glass-opacity&apos;: computedTheme.glassOpacity.toString(),
      &apos;--theme-blur-intensity&apos;: `${computedTheme.blurIntensity}px`,
      &apos;--theme-shadow-intensity&apos;: computedTheme.shadowIntensity.toString(),
      &apos;--theme-border-radius&apos;: `${computedTheme.borderRadius}px`,
      &apos;--theme-font-size&apos;: `${computedTheme.fontSize}px`,
      &apos;--theme-spacing&apos;: `${computedTheme.spacing}px`
    };

    Object.entries(cssVars).forEach(([property, value]) => {
}
      root.style.setProperty(property, value);
    });

    // Update meta theme-color for mobile browsers
    let metaThemeColor = document.querySelector(&apos;meta[name="theme-color"]&apos;) as HTMLMetaElement;
    if (!metaThemeColor) {
}
      metaThemeColor = document.createElement(&apos;meta&apos;);
      metaThemeColor.name = &apos;theme-color&apos;;
      document.head.appendChild(metaThemeColor);

    metaThemeColor.content = computedTheme.backgroundColor;

  }, [state]);

  // =========================================
  // CONTEXT VALUE
  // =========================================

  const contextValue: ThemeContextType = {
}
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
}
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
}
  className?: string;
  showLabels?: boolean;
  size?: &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos;;

}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
}
  className = &apos;&apos;,
  showLabels = true,
  size = &apos;md&apos;
}: any) => {
}
  const { mode, toggleMode } = useTheme();

  const icons = {
}
    light: &apos;☀️&apos;,
    dark: &apos;🌙&apos;,
    system: &apos;🖥️&apos;
  };

  const labels = {
}
    light: &apos;Light&apos;,
    dark: &apos;Dark&apos;,
    system: &apos;System&apos;
  };

  const sizes = {
}
    sm: &apos;w-8 h-8 text-sm&apos;,
    md: &apos;w-10 h-10 text-base&apos;,
    lg: &apos;w-12 h-12 text-lg&apos;
  };

  return (
    <motion.button
      onClick={toggleMode} 
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
      aria-label={`Switch to ${mode === &apos;light&apos; ? &apos;dark&apos; : mode === &apos;dark&apos; ? &apos;system&apos; : &apos;light&apos;} mode`}
    >
      <span>{icons[mode]}</span>
      {showLabels && size !== &apos;sm&apos; && (
}
        <span className="text-sm font-medium">{labels[mode]}</span>
      )}
    </motion.button>
  );
};

interface ColorSchemeSelectorProps {
}
  className?: string;

}

export const ColorSchemeSelector: React.FC<ColorSchemeSelectorProps> = ({
}
  className = &apos;&apos;
}: any) => {
}
  const { colorScheme, setColorScheme } = useTheme();

  const schemes: { key: ColorScheme; name: string; colors: string[] }[] = [
    { key: &apos;default&apos;, name: &apos;Default&apos;, colors: [&apos;#4f46e5&apos;, &apos;#06b6d4&apos;] },
    { key: &apos;champion&apos;, name: &apos;Champion&apos;, colors: [&apos;#ffd700&apos;, &apos;#ffed4e&apos;] },
    { key: &apos;legend&apos;, name: &apos;Legend&apos;, colors: [&apos;#9f7aea&apos;, &apos;#b794f6&apos;] },
    { key: &apos;neon&apos;, name: &apos;Neon&apos;, colors: [&apos;#00ffff&apos;, &apos;#ff00ff&apos;] },
    { key: &apos;sunset&apos;, name: &apos;Sunset&apos;, colors: [&apos;#f59e0b&apos;, &apos;#ec4899&apos;] },
    { key: &apos;ocean&apos;, name: &apos;Ocean&apos;, colors: [&apos;#0ea5e9&apos;, &apos;#06b6d4&apos;] },
    { key: &apos;forest&apos;, name: &apos;Forest&apos;, colors: [&apos;#10b981&apos;, &apos;#34d399&apos;] },
    { key: &apos;royal&apos;, name: &apos;Royal&apos;, colors: [&apos;#7c3aed&apos;, &apos;#a855f7&apos;] },
    { key: &apos;cyberpunk&apos;, name: &apos;Cyberpunk&apos;, colors: [&apos;#ef4444&apos;, &apos;#f59e0b&apos;] }
  ];

  return (
    <div className={`grid grid-cols-3 gap-2 ${className}`}>
      {schemes.map((scheme: any) => (
}
        <motion.button
          key={scheme.key}
          onClick={() => setColorScheme(scheme.key)}
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-1 mb-2">
            {scheme.colors.map((color, index) => (
}
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
}
  ThemeContext,
  ThemeSwitcher,
//   ColorSchemeSelector
};

export type {
}
  ThemeMode,
  ColorScheme,
  SeasonalTheme,
  ThemeCustomization,
  AccessibilitySettings,
  ThemeState,
  ThemeActions,
//   ThemeContextType
};