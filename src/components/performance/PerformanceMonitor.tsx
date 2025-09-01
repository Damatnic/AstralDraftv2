/**
 * Performance Monitor - Real-time Performance Tracking and Optimization
 * Implements Core Web Vitals monitoring, performance budgets, and automated optimization
 */

import React, { useState, useEffect, useCallback, useRef, FC, MouseEvent } from 'react';
import { performanceOptimizer, webVitalsMonitor } from '../../utils/performanceOptimizer';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  threshold: {
    good: number;
    poor: number;
  };
}

interface PerformanceBudget {
  metric: string;
  budget: number;
  current: number;
  status: 'within-budget' | 'approaching-limit' | 'over-budget';
}

interface PerformanceReport {
  score: number;
  metrics: PerformanceMetric[];
  budgets: PerformanceBudget[];
  recommendations: string[];
  timestamp: number;
}

const PERFORMANCE_THRESHOLDS = {
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
  FID: { good: 100, poor: 300 },   // First Input Delay
  CLS: { good: 0.1, poor: 0.25 },  // Cumulative Layout Shift
  TTFB: { good: 800, poor: 1800 }  // Time to First Byte
};

const PERFORMANCE_BUDGETS = [
  { metric: 'Bundle Size', budget: 500 * 1024, type: 'bytes' }, // 500KB
  { metric: 'Images Size', budget: 1000 * 1024, type: 'bytes' }, // 1MB
  { metric: 'API Response Time', budget: 1000, type: 'ms' }, // 1s
  { metric: 'Memory Usage', budget: 50 * 1024 * 1024, type: 'bytes' }, // 50MB
  { metric: 'DOM Nodes', budget: 1500, type: 'count' }
];

interface PerformanceMonitorProps {
  enabled?: boolean;
  showWidget?: boolean;
  onPerformanceIssue?: (issue: PerformanceMetric) => void;
}

export const PerformanceMonitor: FC<PerformanceMonitorProps> = ({
  enabled = true,
  showWidget = import.meta.env.DEV,
  onPerformanceIssue
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [budgets, setBudgets] = useState<PerformanceBudget[]>([]);
  const [score, setScore] = useState<number>(100);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [autoOptimize, setAutoOptimize] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  const calculateRating = useCallback((metric: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
    const threshold = PERFORMANCE_THRESHOLDS[metric as keyof typeof PERFORMANCE_THRESHOLDS];
    if (!threshold) return 'good';
    
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }, []);

  const collectWebVitals = useCallback(() => {
    const vitalsMetrics = webVitalsMonitor.getMetrics();
    const newMetrics: PerformanceMetric[] = [];

    vitalsMetrics.forEach((value, name) => {
      const threshold = PERFORMANCE_THRESHOLDS[name as keyof typeof PERFORMANCE_THRESHOLDS];
      if (threshold) {
        const metric: PerformanceMetric = {
          name,
          value,
          timestamp: Date.now(),
          rating: calculateRating(name, value),
          threshold
        };
        newMetrics.push(metric);

        // Trigger callback for performance issues
        if (metric.rating === 'poor' && onPerformanceIssue) {
          onPerformanceIssue(metric);
        }
      }
    });

    return newMetrics;
  }, [calculateRating, onPerformanceIssue]);

  const collectCustomMetrics = useCallback(() => {
    const customMetrics: PerformanceMetric[] = [];

    // Memory usage
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      customMetrics.push({
        name: 'Memory Usage',
        value: memory.usedJSHeapSize,
        timestamp: Date.now(),
        rating: memory.usedJSHeapSize > 50 * 1024 * 1024 ? 'poor' : 'good',
        threshold: { good: 25 * 1024 * 1024, poor: 50 * 1024 * 1024 }
      });
    }

    // DOM complexity
    const domNodes = document.querySelectorAll('*').length;
    customMetrics.push({
      name: 'DOM Nodes',
      value: domNodes,
      timestamp: Date.now(),
      rating: domNodes > 1500 ? 'poor' : domNodes > 800 ? 'needs-improvement' : 'good',
      threshold: { good: 800, poor: 1500 }
    });

    // Bundle size estimation
    const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const jsSize = resourceEntries
      .filter(entry => entry.name.includes('.js'))
      .reduce((sum, entry) => sum + (entry.transferSize || 0), 0);

    if (jsSize > 0) {
      customMetrics.push({
        name: 'Bundle Size',
        value: jsSize,
        timestamp: Date.now(),
        rating: jsSize > 500 * 1024 ? 'poor' : jsSize > 250 * 1024 ? 'needs-improvement' : 'good',
        threshold: { good: 250 * 1024, poor: 500 * 1024 }
      });
    }

    return customMetrics;
  }, []);

  const calculateBudgetStatus = useCallback(() => {
    const currentMetrics = [...metrics];
    const budgetStatus: PerformanceBudget[] = [];

    PERFORMANCE_BUDGETS.forEach(budget => {
      const metric = currentMetrics.find(m => m.name === budget.metric);
      const currentValue = metric?.value || 0;
      
      let status: 'within-budget' | 'approaching-limit' | 'over-budget';
      if (currentValue > budget.budget) {
        status = 'over-budget';
      } else if (currentValue > budget.budget * 0.8) {
        status = 'approaching-limit';
      } else {
        status = 'within-budget';
      }

      budgetStatus.push({
        metric: budget.metric,
        budget: budget.budget,
        current: currentValue,
        status
      });
    });

    return budgetStatus;
  }, [metrics]);

  const calculatePerformanceScore = useCallback(() => {
    if (metrics.length === 0) return 100;

    const scores = metrics.map(metric => {
      switch (metric.rating) {
        case 'good': return 100;
        case 'needs-improvement': return 70;
        case 'poor': return 30;
        default: return 100;
      }
    });

    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }, [metrics]);

  const updateMetrics = useCallback(() => {
    if (!enabled) return;

    const webVitals = collectWebVitals();
    const customMetrics = collectCustomMetrics();
    const allMetrics = [...webVitals, ...customMetrics];

    setMetrics(allMetrics);
    setBudgets(calculateBudgetStatus());
    setScore(calculatePerformanceScore());

    // Auto-optimization
    if (autoOptimize) {
      performAutoOptimizations(allMetrics);
    }
  }, [enabled, collectWebVitals, collectCustomMetrics, calculateBudgetStatus, calculatePerformanceScore, autoOptimize]);

  const performAutoOptimizations = useCallback((currentMetrics: PerformanceMetric[]) => {
    currentMetrics.forEach(metric => {
      if (metric.rating === 'poor') {
        switch (metric.name) {
          case 'LCP':
            // Optimize images and preload critical resources
            performanceOptimizer.optimizeForMobile();
            console.log('🚀 Auto-optimization: Optimizing for LCP');
            break;
          case 'CLS':
            // Add size attributes to images
            document.querySelectorAll('img:not([width]):not([height])').forEach(img => {
              if (img instanceof HTMLImageElement) {
                img.style.aspectRatio = '16/9'; // Prevent layout shift
              }
            });
            console.log('🚀 Auto-optimization: Preventing layout shift');
            break;
          case 'Memory Usage':
            // Clear caches if memory usage is high
            if ('memory' in performance && (performance as any).memory.usedJSHeapSize > 100 * 1024 * 1024) {
              performanceOptimizer.updateConfig({ enableMemoryOptimization: true });
              console.log('🚀 Auto-optimization: Clearing memory caches');
            }
            break;
        }
      }
    });
  }, []);

  const formatMetricValue = useCallback((metric: PerformanceMetric) => {
    if (metric.name.includes('Size') || metric.name.includes('Memory')) {
      return `${(metric.value / 1024 / 1024).toFixed(2)} MB`;
    }
    if (metric.name === 'DOM Nodes') {
      return metric.value.toString();
    }
    if (metric.name === 'CLS') {
      return metric.value.toFixed(3);
    }
    return `${Math.round(metric.value)} ms`;
  }, []);

  const getScoreColor = useCallback((score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  }, []);

  const getRatingColor = useCallback((rating: string) => {
    switch (rating) {
      case 'good': return 'text-green-600';
      case 'needs-improvement': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }, []);

  const getBudgetColor = useCallback((status: string) => {
    switch (status) {
      case 'within-budget': return 'text-green-600';
      case 'approaching-limit': return 'text-yellow-600';
      case 'over-budget': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }, []);

  const exportReport = useCallback(() => {
    const report: PerformanceReport = {
      score,
      metrics,
      budgets,
      recommendations: generateRecommendations(),
      timestamp: Date.now()
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-report-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [score, metrics, budgets]);

  const generateRecommendations = useCallback(() => {
    const recommendations: string[] = [];

    metrics.forEach(metric => {
      if (metric.rating === 'poor') {
        switch (metric.name) {
          case 'LCP':
            recommendations.push('Optimize images and use modern formats (WebP/AVIF)');
            recommendations.push('Preload critical resources');
            recommendations.push('Optimize server response times');
            break;
          case 'FCP':
            recommendations.push('Reduce render-blocking resources');
            recommendations.push('Minimize CSS and JavaScript');
            break;
          case 'CLS':
            recommendations.push('Add explicit dimensions to images and embeds');
            recommendations.push('Reserve space for dynamic content');
            break;
          case 'FID':
            recommendations.push('Reduce JavaScript execution time');
            recommendations.push('Use web workers for heavy computations');
            break;
          case 'Bundle Size':
            recommendations.push('Implement code splitting and lazy loading');
            recommendations.push('Remove unused dependencies');
            break;
          case 'Memory Usage':
            recommendations.push('Implement virtual scrolling for large lists');
            recommendations.push('Clean up event listeners and timers');
            break;
        }
      }
    });

    return [...new Set(recommendations)]; // Remove duplicates
  }, [metrics]);

  useEffect(() => {
    if (!enabled) return;

    // Initial measurement
    updateMetrics();

    // Set up periodic monitoring
    intervalRef.current = setInterval(updateMetrics, 5000); // Every 5 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, updateMetrics]);

  if (!showWidget || !enabled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] max-w-sm">
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 ${isCollapsed ? 'w-16 h-16' : 'w-80'}`}>
        
        {/* Header / Collapsed State */}
        <div 
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${score >= 90 ? 'bg-green-500' : score >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`} />
            {!isCollapsed && (
              <div>
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                  Performance
                </h3>
                <p className={`text-xs ${getScoreColor(score)}`}>
                  Score: {score}/100
                </p>
              </div>
            )}
          </div>
          
          {!isCollapsed && (
            <div className="flex space-x-2">
              <button
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  setAutoOptimize(!autoOptimize);
                }}
                className={`p-1 rounded ${autoOptimize ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                title="Auto-optimize"
              >
                ⚡
              </button>
              
              <button
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  exportReport();
                }}
                className="p-1 text-gray-400 hover:text-gray-600"
                title="Export report"
              >
                📊
              </button>
            </div>
          )}
        </div>

        {/* Expanded Content */}
        {!isCollapsed && (
          <div className="px-4 pb-4 space-y-4 max-h-96 overflow-y-auto">
            
            {/* Core Web Vitals */}
            <div>
              <h4 className="font-medium text-xs text-gray-700 dark:text-gray-300 mb-2">
                Core Web Vitals
              </h4>
              <div className="space-y-2">
                {metrics.filter(m => ['FCP', 'LCP', 'FID', 'CLS'].includes(m.name)).map(metric => (
                  <div key={metric.name} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">{metric.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className={getRatingColor(metric.rating)}>
                        {formatMetricValue(metric)}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${
                        metric.rating === 'good' ? 'bg-green-500' :
                        metric.rating === 'needs-improvement' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Budgets */}
            <div>
              <h4 className="font-medium text-xs text-gray-700 dark:text-gray-300 mb-2">
                Performance Budgets
              </h4>
              <div className="space-y-2">
                {budgets.map(budget => (
                  <div key={budget.metric} className="text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{budget.metric}</span>
                      <span className={getBudgetColor(budget.status)}>
                        {Math.round((budget.current / budget.budget) * 100)}%
                      </span>
                    </div>
                    <div className="mt-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full ${
                          budget.status === 'within-budget' ? 'bg-green-500' :
                          budget.status === 'approaching-limit' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, (budget.current / budget.budget) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-2">
              <button
                onClick={updateMetrics}
                className="flex-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
              >
                Refresh
              </button>
              <button
                onClick={() => performanceOptimizer.optimizeForMobile()}
                className="flex-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200"
              >
                Optimize
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

// Hook for performance monitoring
export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [score, setScore] = useState<number>(100);

  const measurePerformance = useCallback(() => {
    const vitalsMetrics = webVitalsMonitor.getMetrics();
    const performanceMetrics: PerformanceMetric[] = [];

    vitalsMetrics.forEach((value, name) => {
      const threshold = PERFORMANCE_THRESHOLDS[name as keyof typeof PERFORMANCE_THRESHOLDS];
      if (threshold) {
        performanceMetrics.push({
          name,
          value,
          timestamp: Date.now(),
          rating: value <= threshold.good ? 'good' : 
                  value <= threshold.poor ? 'needs-improvement' : 'poor',
          threshold
        });
      }
    });

    setMetrics(performanceMetrics);
    
    const avgScore = performanceMetrics.length > 0 
      ? performanceMetrics.reduce((sum, metric) => 
          sum + (metric.rating === 'good' ? 100 : metric.rating === 'needs-improvement' ? 70 : 30), 0
        ) / performanceMetrics.length
      : 100;
    
    setScore(Math.round(avgScore));

    return { metrics: performanceMetrics, score: Math.round(avgScore) };
  }, []);

  return {
    metrics,
    score,
    measurePerformance
  };
};

export default PerformanceMonitor;