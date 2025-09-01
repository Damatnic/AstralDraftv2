/**
 * Performance Monitor Component
 * Tracks app performance metrics and provides optimization insights
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo, useState, useEffect, useRef } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { useSafeInterval, useMemoryCleanup, useSafeEventListener } from &apos;../../hooks/useMemoryCleanup&apos;;
import { memoryManager } from &apos;../../utils/memoryCleanup&apos;;

interface PerformanceMetrics {
}
  // Core Web Vitals
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  
  // Navigation Timing
  domContentLoaded: number;
  loadComplete: number;
  firstPaint: number;
  firstContentfulPaint: number;
  
  // Resource Timing
  totalResources: number;
  totalSize: number;
  cacheHitRate: number;
  
  // Memory Usage
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  
  // Network Information
  connectionType: string;
  effectiveType: string;
  downlink: number;
  rtt: number;
}

interface PerformanceIssue {
}
  id: string;
  type: &apos;warning&apos; | &apos;error&apos; | &apos;info&apos;;
  category: &apos;performance&apos; | &apos;memory&apos; | &apos;network&apos; | &apos;accessibility&apos;;
  title: string;
  description: string;
  impact: &apos;low&apos; | &apos;medium&apos; | &apos;high&apos;;
  suggestion: string;
  metric?: number;
  threshold?: number;
}

const PerformanceMonitor: React.FC = () => {
}
  const [isLoading, setIsLoading] = React.useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [issues, setIssues] = useState<PerformanceIssue[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);
  const { setInterval, clearInterval } = useSafeInterval();
  const memoryScope = useMemoryCleanup();
  const observersRef = useRef<PerformanceObserver[]>([]);

  useEffect(() => {
}
    // Only show in development or when explicitly enabled
    const showMonitor = process.env.NODE_ENV === &apos;development&apos; || 
                       localStorage.getItem(&apos;show_performance_monitor&apos;) === &apos;true&apos;;
    
    if (showMonitor) {
}
      collectInitialMetrics();
      startPerformanceMonitoring();
    }

    return () => {
}
      // Clean up all observers
      observersRef.current.forEach((observer: any) => {
}
        try {
}
          observer.disconnect();
        } catch (error) {
}
          console.error(&apos;Failed to disconnect observer:&apos;, error);
        }
      });
      observersRef.current = [];
    };
  }, []);

  const collectInitialMetrics = async () => {
}
    try {
}
      setIsCollecting(true);
      
      // Wait for page to be fully loaded with cleanup
      if (document.readyState !== &apos;complete&apos;) {
}
        await new Promise(resolve => {
}
          const cleanup = memoryScope.addEventListener(
            window,
            &apos;load&apos;,
            resolve as EventListener,
            { once: true }
          );
          // Cleanup will be handled automatically by memoryScope
        });
      }

      const performanceMetrics = await gatherPerformanceMetrics();
      setMetrics(performanceMetrics);
      
      const detectedIssues = analyzePerformance(performanceMetrics);
      setIssues(detectedIssues);
      
      setIsCollecting(false);
    } catch (error) {
}
      console.error(&apos;Failed to collect performance metrics:&apos;, error);
      setIsCollecting(false);
    }
  };

  const startPerformanceMonitoring = () => {
}
    // Update metrics every 30 seconds with managed interval
    setInterval(async () => {
}
      const updatedMetrics = await gatherPerformanceMetrics();
      setMetrics(updatedMetrics);
      
      const updatedIssues = analyzePerformance(updatedMetrics);
      setIssues(updatedIssues);
    }, 30000);
  };

  const gatherPerformanceMetrics = async (): Promise<PerformanceMetrics> => {
}
    const navigation = performance.getEntriesByType(&apos;navigation&apos;)[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType(&apos;paint&apos;);
    const resources = performance.getEntriesByType(&apos;resource&apos;);
    
    // Core Web Vitals
    const lcp = await getLCP();
    const fid = await getFID();
    const cls = await getCLS();
    
    // Navigation Timing
    const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.navigationStart;
    const loadComplete = navigation.loadEventEnd - navigation.navigationStart;
    const firstPaint = paint.find((p: any) => p.name === &apos;first-paint&apos;)?.startTime || 0;
    const firstContentfulPaint = paint.find((p: any) => p.name === &apos;first-contentful-paint&apos;)?.startTime || 0;
    
    // Resource Timing
    const totalResources = resources.length;
    const totalSize = resources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0);
    const cachedResources = resources.filter((r: any) => r.transferSize === 0).length;
    const cacheHitRate = totalResources > 0 ? (cachedResources / totalResources) * 100 : 0;
    
    // Memory Usage
    const memory = (performance as any).memory || {};
    const usedJSHeapSize = memory.usedJSHeapSize || 0;
    const totalJSHeapSize = memory.totalJSHeapSize || 0;
    const jsHeapSizeLimit = memory.jsHeapSizeLimit || 0;
    
    // Network Information
    const connection = (navigator as any).connection || {};
    const connectionType = connection.type || &apos;unknown&apos;;
    const effectiveType = connection.effectiveType || &apos;unknown&apos;;
    const downlink = connection.downlink || 0;
    const rtt = connection.rtt || 0;

    return {
}
      lcp,
      fid,
      cls,
      domContentLoaded,
      loadComplete,
      firstPaint,
      firstContentfulPaint,
      totalResources,
      totalSize,
      cacheHitRate,
      usedJSHeapSize,
      totalJSHeapSize,
      jsHeapSizeLimit,
      connectionType,
      effectiveType,
      downlink,
//       rtt
    };
  };

  const analyzePerformance = (metrics: PerformanceMetrics): PerformanceIssue[] => {
}
    const issues: PerformanceIssue[] = [];

    // LCP Analysis
    if (metrics.lcp && metrics.lcp > 2500) {
}
      issues.push({
}
        id: &apos;lcp-slow&apos;,
        type: metrics.lcp > 4000 ? &apos;error&apos; : &apos;warning&apos;,
        category: &apos;performance&apos;,
        title: &apos;Slow Largest Contentful Paint&apos;,
        description: `LCP is ${Math.round(metrics.lcp)}ms, which is ${metrics.lcp > 4000 ? &apos;poor&apos; : &apos;needs improvement&apos;}`,
        impact: metrics.lcp > 4000 ? &apos;high&apos; : &apos;medium&apos;,
        suggestion: &apos;Optimize images, reduce server response times, and eliminate render-blocking resources&apos;,
        metric: metrics.lcp,
        threshold: 2500
      });
    }

    // FID Analysis
    if (metrics.fid && metrics.fid > 100) {
}
      issues.push({
}
        id: &apos;fid-slow&apos;,
        type: metrics.fid > 300 ? &apos;error&apos; : &apos;warning&apos;,
        category: &apos;performance&apos;,
        title: &apos;High First Input Delay&apos;,
        description: `FID is ${Math.round(metrics.fid)}ms, which affects interactivity`,
        impact: metrics.fid > 300 ? &apos;high&apos; : &apos;medium&apos;,
        suggestion: &apos;Reduce JavaScript execution time and break up long tasks&apos;,
        metric: metrics.fid,
        threshold: 100
      });
    }

    // CLS Analysis
    if (metrics.cls && metrics.cls > 0.1) {
}
      issues.push({
}
        id: &apos;cls-high&apos;,
        type: metrics.cls > 0.25 ? &apos;error&apos; : &apos;warning&apos;,
        category: &apos;performance&apos;,
        title: &apos;High Cumulative Layout Shift&apos;,
        description: `CLS is ${metrics.cls.toFixed(3)}, causing visual instability`,
        impact: metrics.cls > 0.25 ? &apos;high&apos; : &apos;medium&apos;,
        suggestion: &apos;Add size attributes to images and reserve space for dynamic content&apos;,
        metric: metrics.cls,
        threshold: 0.1
      });
    }

    // Memory Usage Analysis
    const memoryUsagePercent = metrics.totalJSHeapSize > 0 ? 
      (metrics.usedJSHeapSize / metrics.totalJSHeapSize) * 100 : 0;
    
    if (memoryUsagePercent > 80) {
}
      issues.push({
}
        id: &apos;memory-high&apos;,
        type: memoryUsagePercent > 90 ? &apos;error&apos; : &apos;warning&apos;,
        category: &apos;memory&apos;,
        title: &apos;High Memory Usage&apos;,
        description: `Memory usage is at ${Math.round(memoryUsagePercent)}%`,
        impact: memoryUsagePercent > 90 ? &apos;high&apos; : &apos;medium&apos;,
        suggestion: &apos;Check for memory leaks and optimize component lifecycle&apos;,
        metric: memoryUsagePercent,
        threshold: 80
      });
    }

    // Cache Hit Rate Analysis
    if (metrics.cacheHitRate < 50) {
}
      issues.push({
}
        id: &apos;cache-low&apos;,
        type: &apos;warning&apos;,
        category: &apos;network&apos;,
        title: &apos;Low Cache Hit Rate&apos;,
        description: `Only ${Math.round(metrics.cacheHitRate)}% of resources are cached`,
        impact: &apos;medium&apos;,
        suggestion: &apos;Implement better caching strategies for static assets&apos;,
        metric: metrics.cacheHitRate,
        threshold: 50
      });
    }

    // Load Time Analysis
    if (metrics.loadComplete > 3000) {
}
      issues.push({
}
        id: &apos;load-slow&apos;,
        type: metrics.loadComplete > 5000 ? &apos;error&apos; : &apos;warning&apos;,
        category: &apos;performance&apos;,
        title: &apos;Slow Page Load&apos;,
        description: `Page load took ${Math.round(metrics.loadComplete)}ms`,
        impact: metrics.loadComplete > 5000 ? &apos;high&apos; : &apos;medium&apos;,
        suggestion: &apos;Optimize bundle size, enable compression, and use code splitting&apos;,
        metric: metrics.loadComplete,
        threshold: 3000
      });
    }

    return issues;
  };

  // Core Web Vitals measurement functions
  const getLCP = (): Promise<number | null> => {
}
    return new Promise((resolve: any) => {
}
      if (&apos;PerformanceObserver&apos; in window) {
}
        const observer = new PerformanceObserver((list: any) => {
}
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
          observer.disconnect();
        });
        observer.observe({ entryTypes: [&apos;largest-contentful-paint&apos;] });
        
        // Track observer for cleanup
        observersRef.current.push(observer);
        
        // Timeout after 10 seconds with managed timer
        const timeout = memoryManager.registerTimer(() => {
}
          observer.disconnect();
          // Remove from tracking
          const index = observersRef.current.indexOf(observer);
          if (index > -1) {
}
            observersRef.current.splice(index, 1);
          }
          resolve(null);
        }, 10000);
      } else {
}
        resolve(null);
      }
    });
  };

  const getFID = (): Promise<number | null> => {
}
    return new Promise((resolve: any) => {
}
      if (&apos;PerformanceObserver&apos; in window) {
}
        const observer = new PerformanceObserver((list: any) => {
}
          const entries = list.getEntries();
          const firstEntry = entries[0];
          resolve(firstEntry.processingStart - firstEntry.startTime);
          observer.disconnect();
        });
        observer.observe({ entryTypes: [&apos;first-input&apos;] });
        
        // Track observer for cleanup
        observersRef.current.push(observer);
        
        // Timeout after 30 seconds with managed timer
        const timeout = memoryManager.registerTimer(() => {
}
          observer.disconnect();
          // Remove from tracking
          const index = observersRef.current.indexOf(observer);
          if (index > -1) {
}
            observersRef.current.splice(index, 1);
          }
          resolve(null);
        }, 30000);
      } else {
}
        resolve(null);
      }
    });
  };

  const getCLS = (): Promise<number | null> => {
}
    return new Promise((resolve: any) => {
}
      if (&apos;PerformanceObserver&apos; in window) {
}
        let clsValue = 0;
        const observer = new PerformanceObserver((list: any) => {
}
          for (const entry of list.getEntries()) {
}
            if (!(entry as any).hadRecentInput) {
}
              clsValue += (entry as any).value;
            }
          }
        });
        observer.observe({ entryTypes: [&apos;layout-shift&apos;] });
        
        // Track observer for cleanup
        observersRef.current.push(observer);
        
        // Resolve after 10 seconds with managed timer
        const timeout = memoryManager.registerTimer(() => {
}
          observer.disconnect();
          // Remove from tracking
          const index = observersRef.current.indexOf(observer);
          if (index > -1) {
}
            observersRef.current.splice(index, 1);
          }
          resolve(clsValue);
        }, 10000);
      } else {
}
        resolve(null);
      }
    });
  };

  const getIssueIcon = (issue: PerformanceIssue) => {
}
    switch (issue.type) {
}
      case &apos;error&apos;: return &apos;🔴&apos;;
      case &apos;warning&apos;: return &apos;🟡&apos;;
      case &apos;info&apos;: return &apos;🔵&apos;;
      default: return &apos;⚪&apos;;
    }
  };

  const getImpactColor = (impact: string) => {
}
    switch (impact) {
}
      case &apos;high&apos;: return &apos;text-red-400&apos;;
      case &apos;medium&apos;: return &apos;text-yellow-400&apos;;
      case &apos;low&apos;: return &apos;text-green-400&apos;;
      default: return &apos;text-slate-400&apos;;
    }
  };

  const formatBytes = (bytes: number) => {
}
    if (bytes === 0) return &apos;0 B&apos;;
    const k = 1024;
    const sizes = [&apos;B&apos;, &apos;KB&apos;, &apos;MB&apos;, &apos;GB&apos;];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + &apos; &apos; + sizes[i];
  };

  const formatMs = (ms: number) => {
}
    return `${Math.round(ms)}ms`;
  };

  // Don&apos;t render in production unless explicitly enabled
  if (process.env.NODE_ENV === &apos;production&apos; && 
      localStorage.getItem(&apos;show_performance_monitor&apos;) !== &apos;true&apos;) {
}
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        title="Performance Monitor"
        className="fixed bottom-4 left-4 z-40 bg-slate-800/90 hover:bg-slate-700/90 text-white px-3 py-2 rounded-full shadow-lg transition-colors"
        aria-label="Toggle Performance Monitor">
        <span className="text-lg">⚡</span>
      </button>

      {/* Performance Monitor Panel */}
      <AnimatePresence>
        {isVisible && (
}
          <motion.div
            initial={{ opacity: 0, x: -400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -400 }}
            className="fixed left-4 bottom-32 z-50 w-96 max-h-96 overflow-y-auto bg-slate-800/95 backdrop-blur-sm rounded-xl border border-slate-600 shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-600">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">⚡ Performance Monitor</h3>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-white hover:text-gray-300 text-xl font-bold"
                  aria-label="Close Performance Monitor">
                  ×
                </button>
              </div>
              {isCollecting && (
}
                <div className="mt-2 text-sm text-blue-400">Collecting metrics...</div>
              )}
            </div>

            {/* Metrics */}
            {metrics && (
}
              <div className="p-4 space-y-4">
                {/* Core Web Vitals */}
                <div>
                  <h4 className="text-white font-semibold mb-2">Core Web Vitals</h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-slate-700/50 p-2 rounded">
                      <div className="text-slate-400">LCP</div>
                      <div className={`font-bold ${metrics.lcp && metrics.lcp > 2500 ? &apos;text-red-400&apos; : &apos;text-green-400&apos;}`}>
                        {metrics.lcp ? formatMs(metrics.lcp) : &apos;N/A&apos;}
                      </div>
                    </div>
                    <div className="bg-slate-700/50 p-2 rounded">
                      <div className="text-slate-400">FID</div>
                      <div className={`font-bold ${metrics.fid && metrics.fid > 100 ? &apos;text-red-400&apos; : &apos;text-green-400&apos;}`}>
                        {metrics.fid ? formatMs(metrics.fid) : &apos;N/A&apos;}
                      </div>
                    </div>
                    <div className="bg-slate-700/50 p-2 rounded">
                      <div className="text-slate-400">CLS</div>
                      <div className={`font-bold ${metrics.cls && metrics.cls > 0.1 ? &apos;text-red-400&apos; : &apos;text-green-400&apos;}`}>
                        {metrics.cls ? metrics.cls.toFixed(3) : &apos;N/A&apos;}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Load Times */}
                <div>
                  <h4 className="text-white font-semibold mb-2">Load Times</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">DOM Content Loaded:</span>
                      <span className="text-white">{formatMs(metrics.domContentLoaded)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Load Complete:</span>
                      <span className="text-white">{formatMs(metrics.loadComplete)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">First Paint:</span>
                      <span className="text-white">{formatMs(metrics.firstPaint)}</span>
                    </div>
                  </div>
                </div>

                {/* Memory Usage */}
                <div>
                  <h4 className="text-white font-semibold mb-2">Memory Usage</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Used:</span>
                      <span className="text-white">{formatBytes(metrics.usedJSHeapSize)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total:</span>
                      <span className="text-white">{formatBytes(metrics.totalJSHeapSize)}</span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ 
}
                          width: `${metrics.totalJSHeapSize > 0 ? (metrics.usedJSHeapSize / metrics.totalJSHeapSize) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Network Info */}
                <div>
                  <h4 className="text-white font-semibold mb-2">Network</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Connection:</span>
                      <span className="text-white">{metrics.effectiveType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Cache Hit Rate:</span>
                      <span className="text-white">{Math.round(metrics.cacheHitRate)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Issues */}
            {issues.length > 0 && (
}
              <div className="p-4 border-t border-slate-600">
                <h4 className="text-white font-semibold mb-2">Issues ({issues.length})</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {issues.map((issue: any) => (
}
                    <div key={issue.id} className="p-2 bg-slate-700/50 rounded text-xs">
                      <div className="flex items-center gap-2 mb-1">
                        <span>{getIssueIcon(issue)}</span>
                        <span className="text-white font-medium">{issue.title}</span>
                        <span className={`text-xs ${getImpactColor(issue.impact)}`}>
                          {issue.impact}
                        </span>
                      </div>
                      <div className="text-slate-400 mb-1">{issue.description}</div>
                      <div className="text-slate-300">{issue.suggestion}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const PerformanceMonitorWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <PerformanceMonitor {...props} />
  </ErrorBoundary>
);

export default React.memo(PerformanceMonitorWithErrorBoundary);