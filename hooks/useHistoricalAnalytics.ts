import { useState, useEffect, useCallback } from 'react';

// Enhanced interfaces for type safety
export interface OraclePrediction {
  id: string;
  playerId: string;
  week: number;
  season: number;
  projectedPoints: number;
  confidence: number;
  predictionType: PredictionType;
  timestamp: number;
  reasoning?: string[];
}

export interface PredictionType {
  type: 'weekly_points' | 'season_total' | 'matchup_outcome' | 'injury_risk' | 'breakout_candidate';
  category: 'performance' | 'health' | 'trends';
}

export interface HistoricalPredictionRecord {
  id: string;
  prediction: OraclePrediction;
  actualResult?: number;
  userPrediction?: number;
  accuracy: number;
  deviation: number;
  timestamp: number;
  validated: boolean;
}

export interface AccuracyMetrics {
  overall: number;
  byPosition: Record<string, number>;
  byWeek: Record<number, number>;
  bySeason: Record<number, number>;
  byConfidence: Record<string, number>;
  trend: 'improving' | 'stable' | 'declining';
}

export interface TrendAnalysis {
  accuracyTrend: { period: string; accuracy: number }[];
  confidenceTrend: { period: string; avgConfidence: number }[];
  predictionVolume: { period: string; count: number }[];
  topPerformingCategories: { category: string; accuracy: number }[];
  strugglingAreas: { category: string; accuracy: number }[];
}

export interface ComparisonAnalysis {
  currentPeriod: {
    accuracy: number;
    confidence: number;
    volume: number;
    period: string;
  };
  previousPeriod: {
    accuracy: number;
    confidence: number;
    volume: number;
    period: string;
  };
  changes: {
    accuracyChange: number;
    confidenceChange: number;
    volumeChange: number;
  };
  insights: string[];
}

export interface AdvancedInsights {
  streaks: {
    current: { type: 'winning' | 'losing'; length: number };
    longest: { type: 'winning' | 'losing'; length: number };
  };
  seasonalPatterns: {
    earlySeasonAccuracy: number;
    midSeasonAccuracy: number;
    lateSeasonAccuracy: number;
    patterns: string[];
  };
  correlations: {
    confidenceAccuracy: number;
    volumeAccuracy: number;
    categoryPerformance: Record<string, number>;
  };
  recommendations: string[];
}

export type ExportFormat = 'json' | 'csv' | 'xlsx';
export type TimeframeType = 'week' | 'month' | 'season' | 'all';

export interface HistoricalAnalyticsState {
  records: HistoricalPredictionRecord[];
  accuracyMetrics: AccuracyMetrics | null;
  trendAnalysis: TrendAnalysis | null;
  comparisonAnalysis: ComparisonAnalysis | null;
  advancedInsights: AdvancedInsights | null;
  isLoading: boolean;
  error: string | null;
}

export interface HistoricalAnalyticsActions {
  refreshAnalytics: () => Promise<void>;
  recordPrediction: (
    prediction: OraclePrediction,
    actualResult?: number,
    userPrediction?: number
  ) => Promise<void>;
}

  exportData: (format?: ExportFormat, filters?: Record<string, unknown>) => Promise<string>;
  importData: (data: string, format?: ExportFormat) => Promise<{ imported: number; errors: string[] }>;
  analyzeTimeframe: (timeframe: TimeframeType) => Promise<void>;
  comparePerformance: (currentPeriod: string, previousPeriod: string) => Promise<void>;
  filterByType: (types: PredictionType[]) => HistoricalPredictionRecord[];
  getTopPredictions: (limit?: number) => HistoricalPredictionRecord[];
  getWorstPredictions: (limit?: number) => HistoricalPredictionRecord[];
}

interface UseHistoricalAnalyticsParams {
  userId?: string;
  autoLoad?: boolean;
  advancedInsights?: boolean;
  cacheResults?: boolean;
}

export function useHistoricalAnalytics(params: UseHistoricalAnalyticsParams = {}) {
  const { autoLoad = true, advancedInsights = false } = params;

  // State
  const [state, setState] = useState<HistoricalAnalyticsState>({
    records: [],
    accuracyMetrics: null,
    trendAnalysis: null,
    comparisonAnalysis: null,
    advancedInsights: null,
    isLoading: false,
    error: null
  });

  // Load initial data
  useEffect(() => {
    if (autoLoad) {
      loadInitialData();
    }
    // Intentionally minimal dependencies to avoid infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLoad]);

  const loadInitialData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulate loading historical data
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockRecords: HistoricalPredictionRecord[] = [];
      const mockAccuracy: AccuracyMetrics = {
        overall: 0.76,
        byPosition: { QB: 0.82, RB: 0.71, WR: 0.74, TE: 0.69 },
        byWeek: { 1: 0.71, 2: 0.78, 3: 0.73, 4: 0.79 },
        bySeason: { 2023: 0.74, 2024: 0.76 },
        byConfidence: { high: 0.84, medium: 0.73, low: 0.65 },
        trend: 'improving'
      };

      const mockTrends: TrendAnalysis = {
        accuracyTrend: [
          { period: 'Week 1', accuracy: 0.71 },
          { period: 'Week 2', accuracy: 0.78 },
          { period: 'Week 3', accuracy: 0.73 },
          { period: 'Week 4', accuracy: 0.79 }
        ],
        confidenceTrend: [
          { period: 'Week 1', avgConfidence: 0.65 },
          { period: 'Week 2', avgConfidence: 0.71 },
          { period: 'Week 3', avgConfidence: 0.68 },
          { period: 'Week 4', avgConfidence: 0.74 }
        ],
        predictionVolume: [
          { period: 'Week 1', count: 125 },
          { period: 'Week 2', count: 142 },
          { period: 'Week 3', count: 138 },
          { period: 'Week 4', count: 156 }
        ],
        topPerformingCategories: [
          { category: 'QB Performance', accuracy: 0.82 },
          { category: 'WR Targets', accuracy: 0.79 }
        ],
        strugglingAreas: [
          { category: 'TE Consistency', accuracy: 0.64 },
          { category: 'RB Injuries', accuracy: 0.58 }
        ]
      };

      setState(prev => ({
        ...prev,
        records: mockRecords,
        accuracyMetrics: mockAccuracy,
        trendAnalysis: mockTrends,
        isLoading: false
      }));

      if (advancedInsights) {
        await loadAdvancedInsights();
      }

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load analytics',
        isLoading: false
      }));
    }
  }, [advancedInsights]);

  const loadAdvancedInsights = useCallback(async () => {
    try {
      // Simulate loading advanced insights
      await new Promise(resolve => setTimeout(resolve, 500));

      const insights: AdvancedInsights = {
        streaks: {
          current: { type: 'winning', length: 7 },
          longest: { type: 'winning', length: 12 }
        },
        seasonalPatterns: {
          earlySeasonAccuracy: 0.71,
          midSeasonAccuracy: 0.78,
          lateSeasonAccuracy: 0.74,
          patterns: [
            'Accuracy improves mid-season',
            'QB predictions strongest in weeks 6-12',
            'RB predictions decline late season'
          ]
        },
        correlations: {
          confidenceAccuracy: 0.67,
          volumeAccuracy: -0.12,
          categoryPerformance: {
            'weekly_points': 0.76,
            'season_total': 0.71,
            'matchup_outcome': 0.82,
            'injury_risk': 0.59,
            'breakout_candidate': 0.48
          }
        },
        recommendations: [
          'Focus on matchup outcome predictions for highest accuracy',
          'Reduce volume during late season for better accuracy',
          'Implement injury risk model improvements'
        ]
      };

      setState(prev => ({
        ...prev,
        advancedInsights: insights
      }));

    } catch {
      setState(prev => ({
        ...prev,
        error: 'Failed to load advanced insights'
      }));
    }
  }, []);

  // Actions
  const refreshAnalytics = useCallback(async () => {
    await loadInitialData();
  }, [loadInitialData]);

  const recordPrediction = useCallback(async (
    prediction: OraclePrediction,
    actualResult?: number,
    userPrediction?: number
  ) => {
    try {
      // Simulate recording prediction
      const accuracy = actualResult ? 
        Math.max(0, 1 - Math.abs(prediction.projectedPoints - actualResult) / prediction.projectedPoints) : 0;

      const record: HistoricalPredictionRecord = {
        id: `record_${Date.now()}`,
        prediction,
        actualResult,
        userPrediction,
        accuracy,
        deviation: actualResult ? Math.abs(prediction.projectedPoints - actualResult) : 0,
        timestamp: Date.now(),
        validated: !!actualResult
      };

      setState(prev => ({
        ...prev,
        records: [...prev.records, record]
      }));

    `Failed to record prediction: ${error instanceof Error ? error.message : String(error)}`
      }));
    }
  }, []);

  const exportData = useCallback(async (
    format: ExportFormat = 'json',
    filters?: Record<string, unknown>
  ) => {
    try {
      // Simulate data export
      const data = {
        records: state.records,
        metrics: state.accuracyMetrics,
        trends: state.trendAnalysis,
        exportedAt: new Date().toISOString(),
        filters
      };

      if (format === 'json') {
        return JSON.stringify(data, null, 2);
      } else if (format === 'csv') {
        // Simplified CSV export
        const headers = 'ID,Prediction,Actual,Accuracy,Timestamp\n';
        const rows = state.records.map((r: any) => 
          `${r.id},${r.prediction.projectedPoints},${r.actualResult || 'N/A'},${r.accuracy},${new Date(r.timestamp).toISOString()}`
        ).join('\n');
        return headers + rows;
      } else {
        throw new Error('Export format not supported yet');
      }

    `Failed to export data: ${error instanceof Error ? error.message : String(error)}`
      }));
      throw error;
    }
  }, [state.records, state.accuracyMetrics, state.trendAnalysis]);

  const importData = useCallback(async (
    data: string,
    format: ExportFormat = 'json'
  ) => {
    try {
      let imported = 0;
      const errors: string[] = [];

      if (format === 'json') {
        const parsed = JSON.parse(data);
        if (parsed.records && Array.isArray(parsed.records)) {
          setState(prev => ({
            ...prev,
            records: [...prev.records, ...parsed.records]
          }));
          imported = parsed.records.length;
        }
      } else {
        errors.push('Import format not supported yet');
      }

      return { imported, errors };

    `Failed to import data: ${error instanceof Error ? error.message : String(error)}`
      }));
      return { imported: 0, errors: [error instanceof Error ? error.message : String(error)] };
    }
  }, []);

  const analyzeTimeframe = useCallback(async (timeframe: TimeframeType) => {
    try {
      // Simulate timeframe analysis
      await new Promise(resolve => setTimeout(resolve, 300));

      const filteredRecords = state.records.filter((record: any) => {
        const recordDate = new Date(record.timestamp);
        const now = new Date();

        switch (timeframe) {
          case 'week':
            return now.getTime() - recordDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
          case 'month':
            return now.getTime() - recordDate.getTime() <= 30 * 24 * 60 * 60 * 1000;
          case 'season':
            return recordDate.getFullYear() === now.getFullYear();
          case 'all':
          default:
            return true;
        }
      });

      // Recalculate metrics for timeframe
      const accuracy = filteredRecords.length > 0 
        ? filteredRecords.reduce((sum, r) => sum + r.accuracy, 0) / filteredRecords.length 
        : 0;

      setState(prev => ({
        ...prev,
        accuracyMetrics: prev.accuracyMetrics ? {
          ...prev.accuracyMetrics,
          overall: accuracy
        } : null
      }));

    `Failed to analyze timeframe: ${error instanceof Error ? error.message : String(error)}`
      }));
    }
  }, [state.records]);

  const comparePerformance = useCallback(async (currentPeriod: string, previousPeriod: string) => {
    try {
      // Simulate performance comparison
      await new Promise(resolve => setTimeout(resolve, 300));

      const comparison: ComparisonAnalysis = {
        currentPeriod: {
          accuracy: 0.76,
          confidence: 0.71,
          volume: 142,
          period: currentPeriod
        },
        previousPeriod: {
          accuracy: 0.72,
          confidence: 0.68,
          volume: 138,
          period: previousPeriod
        },
        changes: {
          accuracyChange: 0.04,
          confidenceChange: 0.03,
          volumeChange: 4
        },
        insights: [
          'Accuracy improved by 4 percentage points',
          'Confidence levels increased',
          'Prediction volume remained stable'
        ]
      };

      setState(prev => ({
        ...prev,
        comparisonAnalysis: comparison
      }));

    `Failed to compare performance: ${error instanceof Error ? error.message : String(error)}`
      }));
    }
  }, []);

  const filterByType = useCallback((types: PredictionType[]): HistoricalPredictionRecord[] => {
    const typeStrings = types.map((t: any) => t.type);
    return state.records.filter((record: any) => 
      typeStrings.includes(record.prediction.predictionType.type)
    );
  }, [state.records]);

  const getTopPredictions = useCallback((limit = 10): HistoricalPredictionRecord[] => {
    return state.records
      .filter((r: any) => r.validated)
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, limit);
  }, [state.records]);

  const getWorstPredictions = useCallback((limit = 10): HistoricalPredictionRecord[] => {
    return state.records
      .filter((r: any) => r.validated)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, limit);
  }, [state.records]);

  const actions: HistoricalAnalyticsActions = {
    refreshAnalytics,
    recordPrediction,
    exportData,
    importData,
    analyzeTimeframe,
    comparePerformance,
    filterByType,
    getTopPredictions,
    getWorstPredictions
  };

  return [state, actions] as const;
}

export default useHistoricalAnalytics;
