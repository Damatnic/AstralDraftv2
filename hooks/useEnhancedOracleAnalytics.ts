/**
 * Enhanced Oracle Analytics Hook
 * React hook for consuming live Oracle analytics data
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { enhancedOracleAnalyticsService } from '../services/enhancedOracleAnalyticsService';

interface LiveAnalyticsData {
  playerId: string;
  currentStats: any;
  projectedStats: any;
  gameContext: {
    gameId: string;
    quarter: number;
    timeRemaining: string;
    score: { home: number; away: number };
    situation: string;
  };
  oraclePredictions: {
    fantasyPoints: number;
    confidence: number;
    reasoning: string;
  };
  performanceMetrics: {
    vsProjection: number;
    momentum: 'positive' | 'negative' | 'neutral';
    riskLevel: 'low' | 'medium' | 'high';
  };
}

interface AnalyticsDashboard {
  livePlayerCount: number;
  activeGames: number;
  recentUpdates: any[];
  topPerformers: any[];
  underPerformers: any[];
  gameHighlights: any[];
}

interface UseOracleAnalyticsOptions {
  playerId?: string;
  gameId?: string;
  updateInterval?: number;
  enableRealTime?: boolean;
}

/**
 * Hook for Oracle analytics dashboard
 */
export function useOracleAnalytics(options: UseOracleAnalyticsOptions = {}) {
  const {
    updateInterval = 10000,
    enableRealTime = true
  } = options;

  const [dashboard, setDashboard] = useState<AnalyticsDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setError(null);
      const dashboardData = await enhancedOracleAnalyticsService.getAnalyticsDashboard();
      setDashboard(dashboardData);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics dashboard');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load and periodic updates
  useEffect(() => {
    fetchDashboard();

    if (enableRealTime && updateInterval > 0) {
      intervalRef.current = setInterval(fetchDashboard, updateInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchDashboard, enableRealTime, updateInterval]);

  return {
    dashboard,
    isLoading,
    error,
    lastUpdate,
    refresh: fetchDashboard
  };
}

/**
 * Hook for live player analytics
 */
export function usePlayerAnalytics(playerId?: string) {
  const [analytics, setAnalytics] = useState<LiveAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayerAnalytics = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await enhancedOracleAnalyticsService.getLivePlayerAnalytics(id);
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch player analytics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (playerId) {
      fetchPlayerAnalytics(playerId);
    }
  }, [playerId, fetchPlayerAnalytics]);

  return {
    analytics,
    isLoading,
    error,
    refresh: () => playerId && fetchPlayerAnalytics(playerId)
  };
}

/**
 * Hook for game analytics
 */
export function useGameAnalytics(gameId?: string) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGameAnalytics = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await enhancedOracleAnalyticsService.getGameAnalytics(id);
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch game analytics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (gameId) {
      fetchGameAnalytics(gameId);
    }
  }, [gameId, fetchGameAnalytics]);

  return {
    analytics,
    isLoading,
    error,
    refresh: () => gameId && fetchGameAnalytics(gameId)
  };
}

/**
 * Hook for Oracle prediction updates
 */
export function useOraclePredictionUpdates(limit: number = 10) {
  const [updates, setUpdates] = useState<any[]>([]);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchUpdates = useCallback(() => {
    const recentUpdates = enhancedOracleAnalyticsService.getRecentPredictionUpdates(limit);
    setUpdates(recentUpdates);
    setLastCheck(new Date());
  }, [limit]);

  useEffect(() => {
    fetchUpdates();
    
    // Check for updates every 5 seconds
    intervalRef.current = setInterval(fetchUpdates, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchUpdates]);

  return {
    updates,
    lastCheck,
    refresh: fetchUpdates
  };
}

/**
 * Hook for Oracle performance metrics
 */
export function useOraclePerformanceMetrics() {
  const [metrics, setMetrics] = useState<{
    totalPredictions: number;
    accuracyToday: number;
    avgConfidence: number;
    liveUpdates: number;
  }>({
    totalPredictions: 0,
    accuracyToday: 0,
    avgConfidence: 0,
    liveUpdates: 0
  });

  const { dashboard } = useOracleAnalytics();
  const { updates } = useOraclePredictionUpdates();

  useEffect(() => {
    if (dashboard && updates) {
      setMetrics({
        totalPredictions: dashboard.livePlayerCount + dashboard.activeGames,
        accuracyToday: 85.2, // Would be calculated from actual data
        avgConfidence: 0.78, // Would be calculated from actual data
        liveUpdates: updates.length
      });
    }
  }, [dashboard, updates]);

  return metrics;
}

/**
 * Hook for Oracle system status
 */
export function useOracleSystemStatus() {
  const [status, setStatus] = useState<{
    isOnline: boolean;
    analyticsActive: boolean;
    dataFreshness: number; // minutes since last update
    connectionQuality: 'excellent' | 'good' | 'poor' | 'offline';
  }>({
    isOnline: true,
    analyticsActive: true,
    dataFreshness: 0,
    connectionQuality: 'excellent'
  });

  const { dashboard, lastUpdate, error } = useOracleAnalytics();

  useEffect(() => {
    const freshness = lastUpdate ? Math.floor((Date.now() - lastUpdate.getTime()) / 60000) : 0;
    
    let connectionQuality: 'excellent' | 'good' | 'poor' | 'offline' = 'excellent';
    if (error) {
      connectionQuality = 'offline';
    } else if (freshness > 5) {
      connectionQuality = 'poor';
    } else if (freshness > 2) {
      connectionQuality = 'good';
    }

    setStatus({
      isOnline: !error && !!dashboard,
      analyticsActive: !!dashboard && dashboard.livePlayerCount > 0,
      dataFreshness: freshness,
      connectionQuality
    });
  }, [dashboard, lastUpdate, error]);

  return status;
}