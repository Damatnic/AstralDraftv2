/**
 * Enhanced Analytics Hook
 * React hook for comprehensive analytics data management
 */

import { useState, useEffect, useCallback } from &apos;react&apos;;
import { useAuth } from &apos;../contexts/AuthContext&apos;;
import { enhancedAnalyticsService, type AnalyticsReport, type PredictiveInsight, type EnhancedAnalyticsMetrics } from &apos;../services/enhancedAnalyticsService&apos;;

export interface UseEnhancedAnalyticsOptions {
}
  timeRange?: number; // Days
  autoRefresh?: boolean;
  refreshInterval?: number; // Milliseconds
}

export interface UseEnhancedAnalyticsReturn {
}
  // Data
  report: AnalyticsReport | null;
  metrics: EnhancedAnalyticsMetrics | null;
  insights: PredictiveInsight[];
  charts: AnalyticsReport[&apos;charts&apos;];
  
  // Status
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  
  // Actions
  refresh: () => Promise<void>;
}

  exportData: (format?: &apos;json&apos; | &apos;csv&apos;) => Promise<string>;
  clearCache: () => void;
  
  // Configuration
  setTimeRange: (days: number) => void;
  timeRange: number;
}

export const useEnhancedAnalytics = (options: UseEnhancedAnalyticsOptions = {}): UseEnhancedAnalyticsReturn => {
}
  const {
}
    timeRange: initialTimeRange = 30,
    autoRefresh = false,
    refreshInterval = 5 * 60 * 1000 // 5 minutes
  } = options;

  const { user, isAuthenticated } = useAuth();
  
  // State
  const [report, setReport] = useState<AnalyticsReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [timeRange, setTimeRangeState] = useState<number>(initialTimeRange);

  // Load analytics data
  const loadAnalytics = useCallback(async (force = false) => {
}
    if (!isAuthenticated || !user) {
}
      setError(&apos;User not authenticated&apos;);
      return;
    }

    if (loading && !force) return; // Prevent duplicate requests

    setLoading(true);
    setError(null);

    try {
}

      const analyticsReport = await enhancedAnalyticsService.generateAnalyticsReport(timeRange);
      setReport(analyticsReport);
      setLastUpdated(new Date().toISOString());
    
    } catch (error) {
}
        console.error(error);
    } catch (err) {
}
      const errorMessage = err instanceof Error ? err.message : &apos;Failed to load analytics&apos;;
      setError(errorMessage);
      console.error(&apos;Enhanced analytics error:&apos;, err);
    } finally {
}
      setLoading(false);
    }
  }, [isAuthenticated, user, timeRange, loading]);

  // Refresh data
  const refresh = useCallback(async () => {
}
    await loadAnalytics(true);
  }, [loadAnalytics]);

  // Export data
  const exportData = useCallback(async (format: &apos;json&apos; | &apos;csv&apos; = &apos;json&apos;): Promise<string> => {
}
    try {
}

      return await enhancedAnalyticsService.exportAnalyticsData(format);

    } catch (error) {
}
        console.error(error);
    } catch (err) {
}
      const errorMessage = err instanceof Error ? err.message : &apos;Failed to export data&apos;;
      throw new Error(errorMessage);
    }
  }, []);

  // Clear cache
  const clearCache = useCallback(() => {
}
    enhancedAnalyticsService.clearCache();
  }, []);

  // Set time range
  const setTimeRange = useCallback((days: number) => {
}
    setTimeRangeState(days);
    // Clear current data to trigger reload
    setReport(null);
  }, []);

  // Load data on mount and when dependencies change
  useEffect(() => {
}
    if (isAuthenticated && user) {
}
      loadAnalytics();
    }
  }, [isAuthenticated, user, timeRange, loadAnalytics]);

  // Auto-refresh effect
  useEffect(() => {
}
    if (!autoRefresh || !isAuthenticated) return;

    const interval = setInterval(() => {
}
      loadAnalytics();
    }
  }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, isAuthenticated, refreshInterval, loadAnalytics]);

  // Clear data when user logs out
  useEffect(() => {
}
    if (!isAuthenticated) {
}
      setReport(null);
      setError(null);
      setLastUpdated(null);
    }
  }, [isAuthenticated]);

  // Derived values
  const metrics = report?.metrics || null;
  const insights = report?.insights || [];
  const charts = report?.charts || [];

  return {
}
    // Data
    report,
    metrics,
    insights,
    charts,
    
    // Status
    loading,
    error,
    lastUpdated,
    
    // Actions
    refresh,
    exportData,
    clearCache,
    
    // Configuration
    setTimeRange,
//     timeRange
  };
};

export default useEnhancedAnalytics;
