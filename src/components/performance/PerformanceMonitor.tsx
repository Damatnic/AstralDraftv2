/**
 * Performance Monitor - Real-time Performance Tracking and Optimization
 * Implements Core Web Vitals monitoring, performance budgets, and automated optimization
 */

import React, { useState, useEffect, useCallback, useRef, FC, MouseEvent } from &apos;react&apos;;
import { performanceOptimizer, webVitalsMonitor } from &apos;../../utils/performanceOptimizer&apos;;

interface PerformanceMetric {
}
  name: string;
  value: number;
  timestamp: number;
  rating: &apos;good&apos; | &apos;needs-improvement&apos; | &apos;poor&apos;;
  threshold: {
}
    good: number;
    poor: number;
  };
}

interface PerformanceBudget {
}
  metric: string;
  budget: number;
  current: number;
  status: &apos;within-budget&apos; | &apos;approaching-limit&apos; | &apos;over-budget&apos;;
}

interface PerformanceReport {
}
  score: number;
  metrics: PerformanceMetric[];
  budgets: PerformanceBudget[];
  recommendations: string[];
  timestamp: number;
}

const PERFORMANCE_THRESHOLDS = {
}
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
  FID: { good: 100, poor: 300 },   // First Input Delay
  CLS: { good: 0.1, poor: 0.25 },  // Cumulative Layout Shift
  TTFB: { good: 800, poor: 1800 }  // Time to First Byte
};

const PERFORMANCE_BUDGETS = [
  { metric: &apos;Bundle Size&apos;, budget: 500 * 1024, type: &apos;bytes&apos; }, // 500KB
  { metric: &apos;Images Size&apos;, budget: 1000 * 1024, type: &apos;bytes&apos; }, // 1MB
  { metric: &apos;API Response Time&apos;, budget: 1000, type: &apos;ms&apos; }, // 1s
  { metric: &apos;Memory Usage&apos;, budget: 50 * 1024 * 1024, type: &apos;bytes&apos; }, // 50MB
  { metric: &apos;DOM Nodes&apos;, budget: 1500, type: &apos;count&apos; }
];

interface PerformanceMonitorProps {
}
  enabled?: boolean;
  showWidget?: boolean;
  onPerformanceIssue?: (issue: PerformanceMetric) => void;
}

export const PerformanceMonitor: FC<PerformanceMonitorProps> = ({
}
  enabled = true,
  showWidget = import.meta.env.DEV,
//   onPerformanceIssue
}: any) => {
}
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [budgets, setBudgets] = useState<PerformanceBudget[]>([]);
  const [score, setScore] = useState<number>(100);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [autoOptimize, setAutoOptimize] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  const calculateRating = useCallback((metric: string, value: number): &apos;good&apos; | &apos;needs-improvement&apos; | &apos;poor&apos; => {
}
    const threshold = PERFORMANCE_THRESHOLDS[metric as keyof typeof PERFORMANCE_THRESHOLDS];
    if (!threshold) return &apos;good&apos;;
    
    if (value <= threshold.good) return &apos;good&apos;;
    if (value <= threshold.poor) return &apos;needs-improvement&apos;;
    return &apos;poor&apos;;
  }, []);

  const collectWebVitals = useCallback(() => {
}
    const vitalsMetrics = webVitalsMonitor.getMetrics();
    const newMetrics: PerformanceMetric[] = [];

    vitalsMetrics.forEach((value, name) => {
}
      const threshold = PERFORMANCE_THRESHOLDS[name as keyof typeof PERFORMANCE_THRESHOLDS];
      if (threshold) {
}
        const metric: PerformanceMetric = {
}
          name,
          value,
          timestamp: Date.now(),
          rating: calculateRating(name, value),
//           threshold
        };
        newMetrics.push(metric);

        // Trigger callback for performance issues
        if (metric.rating === &apos;poor&apos; && onPerformanceIssue) {
}
          onPerformanceIssue(metric);
        }
      }
    });

    return newMetrics;
  }, [calculateRating, onPerformanceIssue]);

  const collectCustomMetrics = useCallback(() => {
}
    const customMetrics: PerformanceMetric[] = [];

    // Memory usage
    if (&apos;memory&apos; in performance) {
}
      const memory = (performance as any).memory;
      customMetrics.push({
}
        name: &apos;Memory Usage&apos;,
        value: memory.usedJSHeapSize,
        timestamp: Date.now(),
        rating: memory.usedJSHeapSize > 50 * 1024 * 1024 ? &apos;poor&apos; : &apos;good&apos;,
        threshold: { good: 25 * 1024 * 1024, poor: 50 * 1024 * 1024 }
      });
    }

    // DOM complexity
    const domNodes = document.querySelectorAll(&apos;*&apos;).length;
    customMetrics.push({
}
      name: &apos;DOM Nodes&apos;,
      value: domNodes,
      timestamp: Date.now(),
      rating: domNodes > 1500 ? &apos;poor&apos; : domNodes > 800 ? &apos;needs-improvement&apos; : &apos;good&apos;,
      threshold: { good: 800, poor: 1500 }
    });

    // Bundle size estimation
    const resourceEntries = performance.getEntriesByType(&apos;resource&apos;) as PerformanceResourceTiming[];
    const jsSize = resourceEntries
      .filter((entry: any) => entry.name.includes(&apos;.js&apos;))
      .reduce((sum, entry) => sum + (entry.transferSize || 0), 0);

    if (jsSize > 0) {
}
      customMetrics.push({
}
        name: &apos;Bundle Size&apos;,
        value: jsSize,
        timestamp: Date.now(),
        rating: jsSize > 500 * 1024 ? &apos;poor&apos; : jsSize > 250 * 1024 ? &apos;needs-improvement&apos; : &apos;good&apos;,
        threshold: { good: 250 * 1024, poor: 500 * 1024 }
      });
    }

    return customMetrics;
  }, []);

  const calculateBudgetStatus = useCallback(() => {
}
    const currentMetrics = [...metrics];
    const budgetStatus: PerformanceBudget[] = [];

    PERFORMANCE_BUDGETS.forEach((budget: any) => {
}
      const metric = currentMetrics.find((m: any) => m.name === budget.metric);
      const currentValue = metric?.value || 0;
      
      let status: &apos;within-budget&apos; | &apos;approaching-limit&apos; | &apos;over-budget&apos;;
      if (currentValue > budget.budget) {
}
        status = &apos;over-budget&apos;;
      } else if (currentValue > budget.budget * 0.8) {
}
        status = &apos;approaching-limit&apos;;
      } else {
}
        status = &apos;within-budget&apos;;
      }

      budgetStatus.push({
}
        metric: budget.metric,
        budget: budget.budget,
        current: currentValue,
//         status
      });
    });

    return budgetStatus;
  }, [metrics]);

  const calculatePerformanceScore = useCallback(() => {
}
    if (metrics.length === 0) return 100;

    const scores = metrics.map((metric: any) => {
}
      switch (metric.rating) {
}
        case &apos;good&apos;: return 100;
        case &apos;needs-improvement&apos;: return 70;
        case &apos;poor&apos;: return 30;
        default: return 100;
      }
    });

    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }, [metrics]);

  const updateMetrics = useCallback(() => {
}
    if (!enabled) return;

    const webVitals = collectWebVitals();
    const customMetrics = collectCustomMetrics();
    const allMetrics = [...webVitals, ...customMetrics];

    setMetrics(allMetrics);
    setBudgets(calculateBudgetStatus());
    setScore(calculatePerformanceScore());

    // Auto-optimization
    if (autoOptimize) {
}
      performAutoOptimizations(allMetrics);
    }
  }, [enabled, collectWebVitals, collectCustomMetrics, calculateBudgetStatus, calculatePerformanceScore, autoOptimize]);

  const performAutoOptimizations = useCallback((currentMetrics: PerformanceMetric[]) => {
}
    currentMetrics.forEach((metric: any) => {
}
      if (metric.rating === &apos;poor&apos;) {
}
        switch (metric.name) {
}
          case &apos;LCP&apos;:
            // Optimize images and preload critical resources
            performanceOptimizer.optimizeForMobile();
            console.log(&apos;🚀 Auto-optimization: Optimizing for LCP&apos;);
            break;
          case &apos;CLS&apos;:
            // Add size attributes to images
            document.querySelectorAll(&apos;img:not([width]):not([height])&apos;).forEach((img: any) => {
}
              if (img instanceof HTMLImageElement) {
}
                img.style.aspectRatio = &apos;16/9&apos;; // Prevent layout shift
              }
            });
            console.log(&apos;🚀 Auto-optimization: Preventing layout shift&apos;);
            break;
          case &apos;Memory Usage&apos;:
            // Clear caches if memory usage is high
            if (&apos;memory&apos; in performance && (performance as any).memory.usedJSHeapSize > 100 * 1024 * 1024) {
}
              performanceOptimizer.updateConfig({ enableMemoryOptimization: true });
              console.log(&apos;🚀 Auto-optimization: Clearing memory caches&apos;);
            }
            break;
        }
      }
    });
  }, []);

  const formatMetricValue = useCallback((metric: PerformanceMetric) => {
}
    if (metric.name.includes(&apos;Size&apos;) || metric.name.includes(&apos;Memory&apos;)) {
}
      return `${(metric.value / 1024 / 1024).toFixed(2)} MB`;
    }
    if (metric.name === &apos;DOM Nodes&apos;) {
}
      return metric.value.toString();
    }
    if (metric.name === &apos;CLS&apos;) {
}
      return metric.value.toFixed(3);
    }
    return `${Math.round(metric.value)} ms`;
  }, []);

  const getScoreColor = useCallback((score: number) => {
}
    if (score >= 90) return &apos;text-green-600&apos;;
    if (score >= 70) return &apos;text-yellow-600&apos;;
    return &apos;text-red-600&apos;;
  }, []);

  const getRatingColor = useCallback((rating: string) => {
}
    switch (rating) {
}
      case &apos;good&apos;: return &apos;text-green-600&apos;;
      case &apos;needs-improvement&apos;: return &apos;text-yellow-600&apos;;
      case &apos;poor&apos;: return &apos;text-red-600&apos;;
      default: return &apos;text-gray-600&apos;;
    }
  }, []);

  const getBudgetColor = useCallback((status: string) => {
}
    switch (status) {
}
      case &apos;within-budget&apos;: return &apos;text-green-600&apos;;
      case &apos;approaching-limit&apos;: return &apos;text-yellow-600&apos;;
      case &apos;over-budget&apos;: return &apos;text-red-600&apos;;
      default: return &apos;text-gray-600&apos;;
    }
  }, []);

  const exportReport = useCallback(() => {
}
    const report: PerformanceReport = {
}
      score,
      metrics,
      budgets,
      recommendations: generateRecommendations(),
      timestamp: Date.now()
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: &apos;application/json&apos; });
    const url = URL.createObjectURL(blob);
    const a = document.createElement(&apos;a&apos;);
    a.href = url;
    a.download = `performance-report-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [score, metrics, budgets]);

  const generateRecommendations = useCallback(() => {
}
    const recommendations: string[] = [];

    metrics.forEach((metric: any) => {
}
      if (metric.rating === &apos;poor&apos;) {
}
        switch (metric.name) {
}
          case &apos;LCP&apos;:
            recommendations.push(&apos;Optimize images and use modern formats (WebP/AVIF)&apos;);
            recommendations.push(&apos;Preload critical resources&apos;);
            recommendations.push(&apos;Optimize server response times&apos;);
            break;
          case &apos;FCP&apos;:
            recommendations.push(&apos;Reduce render-blocking resources&apos;);
            recommendations.push(&apos;Minimize CSS and JavaScript&apos;);
            break;
          case &apos;CLS&apos;:
            recommendations.push(&apos;Add explicit dimensions to images and embeds&apos;);
            recommendations.push(&apos;Reserve space for dynamic content&apos;);
            break;
          case &apos;FID&apos;:
            recommendations.push(&apos;Reduce JavaScript execution time&apos;);
            recommendations.push(&apos;Use web workers for heavy computations&apos;);
            break;
          case &apos;Bundle Size&apos;:
            recommendations.push(&apos;Implement code splitting and lazy loading&apos;);
            recommendations.push(&apos;Remove unused dependencies&apos;);
            break;
          case &apos;Memory Usage&apos;:
            recommendations.push(&apos;Implement virtual scrolling for large lists&apos;);
            recommendations.push(&apos;Clean up event listeners and timers&apos;);
            break;
        }
      }
    });

    return [...new Set(recommendations)]; // Remove duplicates
  }, [metrics]);

  useEffect(() => {
}
    if (!enabled) return;

    // Initial measurement
    updateMetrics();

    // Set up periodic monitoring
    intervalRef.current = setInterval(updateMetrics, 5000); // Every 5 seconds

    return () => {
}
      if (intervalRef.current) {
}
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, updateMetrics]);

  if (!showWidget || !enabled) {
}
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] max-w-sm">
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 ${isCollapsed ? &apos;w-16 h-16&apos; : &apos;w-80&apos;}`}>
        
        {/* Header / Collapsed State */}
        <div 
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${score >= 90 ? &apos;bg-green-500&apos; : score >= 70 ? &apos;bg-yellow-500&apos; : &apos;bg-red-500&apos;}`} />
            {!isCollapsed && (
}
              <div>
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
//                   Performance
                </h3>
                <p className={`text-xs ${getScoreColor(score)}`}>
                  Score: {score}/100
                </p>
              </div>
            )}
          </div>
          
          {!isCollapsed && (
}
            <div className="flex space-x-2">
              <button
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
}
                  e.stopPropagation();
                  setAutoOptimize(!autoOptimize);
                }}
                className={`p-1 rounded ${autoOptimize ? &apos;bg-blue-100 text-blue-600&apos; : &apos;text-gray-400 hover:text-gray-600&apos;}`}
                title="Auto-optimize"
              >
                ⚡
              </button>
              
              <button
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
}
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
}
          <div className="px-4 pb-4 space-y-4 max-h-96 overflow-y-auto">
            
            {/* Core Web Vitals */}
            <div>
              <h4 className="font-medium text-xs text-gray-700 dark:text-gray-300 mb-2">
                Core Web Vitals
              </h4>
              <div className="space-y-2">
                {metrics.filter((m: any) => [&apos;FCP&apos;, &apos;LCP&apos;, &apos;FID&apos;, &apos;CLS&apos;].includes(m.name)).map((metric: any) => (
}
                  <div key={metric.name} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">{metric.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className={getRatingColor(metric.rating)}>
                        {formatMetricValue(metric)}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${
}
                        metric.rating === &apos;good&apos; ? &apos;bg-green-500&apos; :
                        metric.rating === &apos;needs-improvement&apos; ? &apos;bg-yellow-500&apos; : &apos;bg-red-500&apos;
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
                {budgets.map((budget: any) => (
}
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
}
                          budget.status === &apos;within-budget&apos; ? &apos;bg-green-500&apos; :
                          budget.status === &apos;approaching-limit&apos; ? &apos;bg-yellow-500&apos; : &apos;bg-red-500&apos;
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
//                 Refresh
              </button>
              <button
                onClick={() => performanceOptimizer.optimizeForMobile()}
                className="flex-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200"
              >
//                 Optimize
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
}
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [score, setScore] = useState<number>(100);

  const measurePerformance = useCallback(() => {
}
    const vitalsMetrics = webVitalsMonitor.getMetrics();
    const performanceMetrics: PerformanceMetric[] = [];

    vitalsMetrics.forEach((value, name) => {
}
      const threshold = PERFORMANCE_THRESHOLDS[name as keyof typeof PERFORMANCE_THRESHOLDS];
      if (threshold) {
}
        performanceMetrics.push({
}
          name,
          value,
          timestamp: Date.now(),
          rating: value <= threshold.good ? &apos;good&apos; : 
                  value <= threshold.poor ? &apos;needs-improvement&apos; : &apos;poor&apos;,
//           threshold
        });
      }
    });

    setMetrics(performanceMetrics);
    
    const avgScore = performanceMetrics.length > 0 
      ? performanceMetrics.reduce((sum, metric) => 
          sum + (metric.rating === &apos;good&apos; ? 100 : metric.rating === &apos;needs-improvement&apos; ? 70 : 30), 0
        ) / performanceMetrics.length
      : 100;
    
    setScore(Math.round(avgScore));

    return { metrics: performanceMetrics, score: Math.round(avgScore) };
  }, []);

  return {
}
    metrics,
    score,
//     measurePerformance
  };
};

export default PerformanceMonitor;