/**
 * Standardized navigation utilities for view components
 * Provides consistent navigation patterns and helpers for better UX
 */

// Standard navigation destinations
export const NAVIGATION_ROUTES = {
}
  DASHBOARD: &apos;DASHBOARD&apos;,
  LEAGUE_HUB: &apos;LEAGUE_HUB&apos;,
  TEAM_HUB: &apos;TEAM_HUB&apos;,
  ANALYTICS_HUB: &apos;ANALYTICS_HUB&apos;,
  DRAFT_ROOM: &apos;DRAFT_ROOM&apos;,
  COMMISSIONER_TOOLS: &apos;COMMISSIONER_TOOLS&apos;,
  SETTINGS: &apos;SETTINGS&apos;,
  PROFILE: &apos;PROFILE&apos;,
  ASSISTANT: &apos;ASSISTANT&apos;,
} as const;

export type NavigationRoute = keyof typeof NAVIGATION_ROUTES;

// Common navigation patterns
export interface NavigationAction {
}
  type: &apos;navigate&apos; | &apos;back&apos; | &apos;forward&apos; | &apos;replace&apos;;
  route: string;
  data?: any;
  preserveHistory?: boolean;
}

// Standard button styles for navigation
export const NAVIGATION_BUTTON_STYLES = {
}
  primary: "px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200",
  secondary: "px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors duration-200",
  back: "px-4 py-2 bg-gray-600/20 text-gray-300 rounded-lg text-sm hover:bg-gray-600/30 transition-colors duration-200",
  danger: "px-4 py-2 bg-red-500/20 text-red-300 rounded-lg text-sm hover:bg-red-500/30 transition-colors duration-200",
  success: "px-4 py-2 bg-green-500/20 text-green-300 rounded-lg text-sm hover:bg-green-500/30 transition-colors duration-200",
  warning: "px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-lg text-sm hover:bg-yellow-500/30 transition-colors duration-200",
} as const;

// Helper to create navigation handler
export const createNavigationHandler = (
  dispatch: React.Dispatch<any>,
  route: string,
  data?: any
) => {
}
  return () => {
}
    if (data) {
}
      // If data is provided, might need to set additional state
      Object.keys(data).forEach((key: any) => {
}
        if (key !== &apos;view&apos;) {
}
          dispatch({ type: `SET_${key.toUpperCase()}`, payload: data[key] });
        }
      });
    }
    dispatch({ type: &apos;SET_VIEW&apos;, payload: route });
  };
};

// Standard back navigation patterns
export const BACK_NAVIGATION_MAP: Record<string, string> = {
}
  // League-based views go back to league hub
  &apos;TEAM_HUB&apos;: &apos;LEAGUE_HUB&apos;,
  &apos;ANALYTICS_HUB&apos;: &apos;TEAM_HUB&apos;,
  &apos;WEEKLY_REPORT&apos;: &apos;TEAM_HUB&apos;,
  &apos;WAIVER_WIRE&apos;: &apos;TEAM_HUB&apos;,
  &apos;PERFORMANCE_TRENDS&apos;: &apos;TEAM_HUB&apos;,
  &apos;POWER_RANKINGS&apos;: &apos;TEAM_HUB&apos;,
  &apos;PLAYOFF_BRACKET&apos;: &apos;TEAM_HUB&apos;,
  &apos;SEASON_STORY&apos;: &apos;TEAM_HUB&apos;,
  &apos;START_SIT_TOOL&apos;: &apos;TEAM_HUB&apos;,
  
  // League management views
  &apos;LEAGUE_RULES&apos;: &apos;LEAGUE_HUB&apos;,
  &apos;LEAGUE_STATS&apos;: &apos;LEAGUE_HUB&apos;,
  &apos;LEAGUE_NEWSPAPER&apos;: &apos;LEAGUE_HUB&apos;,
  &apos;TROPHY_ROOM&apos;: &apos;LEAGUE_HUB&apos;,
  &apos;LEAGUE_HISTORY&apos;: &apos;LEAGUE_HUB&apos;,
  &apos;COMMISSIONER_TOOLS&apos;: &apos;LEAGUE_HUB&apos;,
  
  // Draft views
  &apos;DRAFT_PREP_CENTER&apos;: &apos;LEAGUE_HUB&apos;,
  &apos;DRAFT_ROOM&apos;: &apos;LEAGUE_HUB&apos;,
  
  // Archive/historical views
  &apos;SEASON_REVIEW&apos;: &apos;SEASON_ARCHIVE&apos;,
  &apos;HISTORICAL_ANALYTICS&apos;: &apos;DASHBOARD&apos;,
  
  // Video/media views
  &apos;WEEKLY_RECAP_VIDEO&apos;: &apos;WEEKLY_REPORT&apos;,
  
  // Settings and profile
  &apos;PROFILE&apos;: &apos;DASHBOARD&apos;,
  &apos;SETTINGS&apos;: &apos;DASHBOARD&apos;,
  
  // Special Oracle views
  &apos;PROJECT_VIEW&apos;: &apos;DASHBOARD&apos;,
  &apos;PROJECT_INTEGRITY_VIEW&apos;: &apos;DASHBOARD&apos;,
  
  // Default fallback
  &apos;DEFAULT&apos;: &apos;DASHBOARD&apos;,
};

// Get the appropriate back navigation route
export const getBackRoute = (currentRoute: string): string => {
}
  return BACK_NAVIGATION_MAP[currentRoute] || BACK_NAVIGATION_MAP.DEFAULT;
};

// Create a standardized back button handler
export const createBackHandler = (
  dispatch: React.Dispatch<any>,
  currentRoute: string,
  customBackRoute?: string
) => {
}
  const backRoute = customBackRoute || getBackRoute(currentRoute);
  return createNavigationHandler(dispatch, backRoute);
};

// Breadcrumb navigation helper
export interface BreadcrumbItem {
}
  label: string;
  route: string;
  isActive?: boolean;
}

export const generateBreadcrumbs = (
  currentRoute: string,
  leagueName?: string,
  teamName?: string
): BreadcrumbItem[] => {
}
  const breadcrumbs: BreadcrumbItem[] = [];
  
  // Always start with dashboard
  breadcrumbs.push({ label: &apos;Dashboard&apos;, route: &apos;DASHBOARD&apos; });
  
  // Add league-specific breadcrumbs
  if (leagueName && currentRoute !== &apos;DASHBOARD&apos;) {
}
    breadcrumbs.push({ label: leagueName, route: &apos;LEAGUE_HUB&apos; });
    
    if (teamName && [&apos;TEAM_HUB&apos;, &apos;ANALYTICS_HUB&apos;, &apos;WEEKLY_REPORT&apos;, &apos;WAIVER_WIRE&apos;].includes(currentRoute)) {
}
      breadcrumbs.push({ label: teamName, route: &apos;TEAM_HUB&apos; });
    }
  }
  
  // Add current route as active
  const routeLabels: Record<string, string> = {
}
    &apos;ANALYTICS_HUB&apos;: &apos;Analytics&apos;,
    &apos;WEEKLY_REPORT&apos;: &apos;Weekly Report&apos;,
    &apos;WAIVER_WIRE&apos;: &apos;Waiver Wire&apos;,
    &apos;DRAFT_PREP_CENTER&apos;: &apos;Draft Prep&apos;,
    &apos;COMMISSIONER_TOOLS&apos;: &apos;Commissioner Tools&apos;,
    &apos;HISTORICAL_ANALYTICS&apos;: &apos;Historical Analytics&apos;,
    &apos;PROJECT_VIEW&apos;: &apos;Project Overview&apos;,
    &apos;PROJECT_INTEGRITY_VIEW&apos;: &apos;System Status&apos;,
  };
  
  if (currentRoute !== &apos;DASHBOARD&apos; && currentRoute !== &apos;LEAGUE_HUB&apos; && currentRoute !== &apos;TEAM_HUB&apos;) {
}
    breadcrumbs.push({ 
}
      label: routeLabels[currentRoute] || currentRoute, 
      route: currentRoute, 
      isActive: true 
    });
  }
  
  return breadcrumbs;
};
