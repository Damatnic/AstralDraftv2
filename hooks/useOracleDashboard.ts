/**
 * Oracle Dashboard Integration Hook
 * Connects dashboard components with Oracle performance services
 */

import { useState, useEffect, useCallback } from &apos;react&apos;;
import { oracleUserDashboardService, UserDashboardStats, PersonalizedInsight, UserPredictionHistory } from &apos;../services/oracleUserDashboardService&apos;;

export interface DashboardData {
}
    stats: UserDashboardStats | null;
    insights: PersonalizedInsight[];
    history: UserPredictionHistory[];
    isLoading: boolean;
    error: string | null;
}

export interface DashboardFilters {
}
    timeframe: &apos;week&apos; | &apos;month&apos; | &apos;season&apos; | &apos;all&apos;;
    category: string;
    onlyResolved: boolean;
}

export const useOracleDashboard = (userId: string, season: number = 2024) => {
}
    const [data, setData] = useState<DashboardData>({
}
        stats: null,
        insights: [],
        history: [],
        isLoading: true,
        error: null
    });

    const [filters, setFilters] = useState<DashboardFilters>({
}
        timeframe: &apos;season&apos;,
        category: &apos;all&apos;,
        onlyResolved: false
    });

    const loadDashboardData = useCallback(async () => {
}
        try {
}

            setData(prev => ({ ...prev, isLoading: true, error: null }));

            const [stats, insights, historyData] = await Promise.all([
                oracleUserDashboardService.getUserDashboardStats(userId, season),
                oracleUserDashboardService.getPersonalizedInsights(userId, season),
                oracleUserDashboardService.getUserPredictionHistory(userId, {
}
                    limit: 20,
                    category: filters.category,
                    timeframe: filters.timeframe,
                    onlyResolved: filters.onlyResolved
                })
            ]);

            setData({
}
                stats,
                insights,
                history: historyData.predictions,
                isLoading: false,
                error: null
            });

    } catch (error) {
}
        console.error(error);
    } catch (error) {
}
            console.error(&apos;Failed to load dashboard data:&apos;, error);
            setData(prev => ({
}
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : &apos;Failed to load dashboard data&apos;
            }));
        }
    }, [userId, season, filters]);

    const updateFilters = useCallback((newFilters: Partial<DashboardFilters>) => {
}
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    const refreshData = useCallback(() => {
}
        loadDashboardData();
    }, [loadDashboardData]);

    const clearCache = useCallback(() => {
}
        oracleUserDashboardService.clearUserCache(userId, season);
        refreshData();
    }, [userId, season, refreshData]);

    // Load data on mount and when dependencies change
    useEffect(() => {
}
        loadDashboardData();
    }, [loadDashboardData]);

    return {
}
        data,
        filters,
        updateFilters,
        refreshData,
        clearCache,
        isLoading: data.isLoading,
        error: data.error
    };
};

/**
 * Performance calculation utilities
 */
export const DashboardUtils = {
}
    /**
     * Calculate accuracy color based on percentage
     */
    getAccuracyColor: (accuracy: number): string => {
}
        if (accuracy >= 70) return &apos;text-green-500&apos;;
        if (accuracy >= 60) return &apos;text-yellow-500&apos;;
        return &apos;text-red-500&apos;;
    },

    /**
     * Calculate trend direction
     */
    getTrendDirection: (current: number, previous: number): &apos;up&apos; | &apos;down&apos; | &apos;stable&apos; => {
}
        const diff = current - previous;
        if (Math.abs(diff) < 1) return &apos;stable&apos;;
        return diff > 0 ? &apos;up&apos; : &apos;down&apos;;
    },

    /**
     * Format confidence level
     */
    formatConfidence: (confidence: number): string => {
}
        if (confidence >= 80) return &apos;Very High&apos;;
        if (confidence >= 60) return &apos;High&apos;;
        if (confidence >= 40) return &apos;Medium&apos;;
        if (confidence >= 20) return &apos;Low&apos;;
        return &apos;Very Low&apos;;
    },

    /**
     * Calculate streak emoji
     */
    getStreakEmoji: (streak: number, type: &apos;correct&apos; | &apos;incorrect&apos;): string => {
}
        if (streak === 0) return &apos;⚪&apos;;
        if (type === &apos;correct&apos;) {
}
            if (streak >= 10) return &apos;🔥🔥🔥&apos;;
            if (streak >= 5) return &apos;🔥🔥&apos;;
            if (streak >= 3) return &apos;🔥&apos;;
            return &apos;✅&apos;;
        } else {
}
            if (streak >= 5) return &apos;❄️❄️&apos;;
            if (streak >= 3) return &apos;❄️&apos;;
            return &apos;❌&apos;;
        }
    },

    /**
     * Get insight priority color
     */
    getInsightPriorityColor: (priority: &apos;high&apos; | &apos;medium&apos; | &apos;low&apos;): string => {
}
        switch (priority) {
}
            case &apos;high&apos;: return &apos;border-red-500 bg-red-500/10&apos;;
            case &apos;medium&apos;: return &apos;border-yellow-500 bg-yellow-500/10&apos;;
            case &apos;low&apos;: return &apos;border-blue-500 bg-blue-500/10&apos;;
            default: return &apos;border-gray-500 bg-gray-500/10&apos;;
        }
    },

    /**
     * Calculate performance grade
     */
    getPerformanceGrade: (accuracy: number): { grade: string; color: string } => {
}
        if (accuracy >= 80) return { grade: &apos;A+&apos;, color: &apos;text-green-400&apos; };
        if (accuracy >= 75) return { grade: &apos;A&apos;, color: &apos;text-green-500&apos; };
        if (accuracy >= 70) return { grade: &apos;B+&apos;, color: &apos;text-lime-500&apos; };
        if (accuracy >= 65) return { grade: &apos;B&apos;, color: &apos;text-yellow-400&apos; };
        if (accuracy >= 60) return { grade: &apos;B-&apos;, color: &apos;text-yellow-500&apos; };
        if (accuracy >= 55) return { grade: &apos;C+&apos;, color: &apos;text-orange-400&apos; };
        if (accuracy >= 50) return { grade: &apos;C&apos;, color: &apos;text-orange-500&apos; };
        if (accuracy >= 45) return { grade: &apos;C-&apos;, color: &apos;text-red-400&apos; };
        if (accuracy >= 40) return { grade: &apos;D&apos;, color: &apos;text-red-500&apos; };
        return { grade: &apos;F&apos;, color: &apos;text-red-600&apos; };
    },

    /**
     * Format time ago
     */
    timeAgo: (date: Date): string => {
}
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return &apos;Just now&apos;;
    }
};

export default useOracleDashboard;
