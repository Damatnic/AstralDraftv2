/**
 * Performance Monitor Component
 * Tracks app performance metrics and provides optimization insights
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PerformanceMetrics {
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
  id: string;
  type: 'warning' | 'error' | 'info';
  category: 'performance' | 'memory' | 'network' | 'accessibility';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  suggestion: string;
  metric?: number;
  threshold?: number;

const PerformanceMonitor: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [issues, setIssues] = useState<PerformanceIssue[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only show in development or when explicitly enabled
    const showMonitor = process.env.NODE_ENV === 'development' || 
                       localStorage.getItem('show_performance_monitor') === 'true';
    
    if (showMonitor) {
      collectInitialMetrics();
      startPerformanceMonitoring();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);

    };
  }, []);

  const collectInitialMetrics = async () => {
    try {
      setIsCollecting(true);
      
      // Wait for page to be fully loaded
      if (document.readyState !== 'complete') {
        await new Promise(resolve => {
          window.addEventListener('load', resolve, { once: true });
        });

      const performanceMetrics = await gatherPerformanceMetrics();
      setMetrics(performanceMetrics);
      
      const detectedIssues = analyzePerformance(performanceMetrics);
      setIssues(detectedIssues);
      
      setIsCollecting(false);
    
    } catch (error) {
      setIsCollecting(false);

  };

  const startPerformanceMonitoring = () => {
    // Update metrics every 30 seconds
    intervalRef.current = setInterval(async () => {
      const updatedMetrics = await gatherPerformanceMetrics();
      setMetrics(updatedMetrics);
      
      const updatedIssues = analyzePerformance(updatedMetrics);
      setIssues(updatedIssues);
    }, 30000);
  };

  const gatherPerformanceMetrics = async (): Promise<PerformanceMetrics> => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    const resources = performance.getEntriesByType('resource');
    
    // Core Web Vitals
    const lcp = await getLCP();
    const fid = await getFID();
    const cls = await getCLS();
    
    // Navigation Timing
    const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.navigationStart;
    const loadComplete = navigation.loadEventEnd - navigation.navigationStart;
    const firstPaint = paint.find((p: any) => p.name === 'first-paint')?.startTime || 0;
    const firstContentfulPaint = paint.find((p: any) => p.name === 'first-contentful-paint')?.startTime || 0;
    
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
    const connectionType = connection.type || 'unknown';
    const effectiveType = connection.effectiveType || 'unknown';
    const downlink = connection.downlink || 0;
    const rtt = connection.rtt || 0;

    return {
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
      rtt
    };
  };

  const analyzePerformance = (metrics: PerformanceMetrics): PerformanceIssue[] => {
    const issues: PerformanceIssue[] = [];

    // LCP Analysis
    if (metrics.lcp && metrics.lcp > 2500) {
      issues.push({
        id: 'lcp-slow',
        type: metrics.lcp > 4000 ? 'error' : 'warning',
        category: 'performance',
        title: 'Slow Largest Contentful Paint',
        description: `LCP is ${Math.round(metrics.lcp)}ms, which is ${metrics.lcp > 4000 ? 'poor' : 'needs improvement'}`,
        impact: metrics.lcp > 4000 ? 'high' : 'medium',
        suggestion: 'Optimize images, reduce server response times, and eliminate render-blocking resources',
        metric: metrics.lcp,
        threshold: 2500
      });

    // FID Analysis
    if (metrics.fid && metrics.fid > 100) {
      issues.push({
        id: 'fid-slow',
        type: metrics.fid > 300 ? 'error' : 'warning',
        category: 'performance',
        title: 'High First Input Delay',
        description: `FID is ${Math.round(metrics.fid)}ms, which affects interactivity`,
        impact: metrics.fid > 300 ? 'high' : 'medium',
        suggestion: 'Reduce JavaScript execution time and break up long tasks',
        metric: metrics.fid,
        threshold: 100
      });

    // CLS Analysis
    if (metrics.cls && metrics.cls > 0.1) {
      issues.push({
        id: 'cls-high',
        type: metrics.cls > 0.25 ? 'error' : 'warning',
        category: 'performance',
        title: 'High Cumulative Layout Shift',
        description: `CLS is ${metrics.cls.toFixed(3)}, causing visual instability`,
        impact: metrics.cls > 0.25 ? 'high' : 'medium',
        suggestion: 'Add size attributes to images and reserve space for dynamic content',
        metric: metrics.cls,
        threshold: 0.1
      });

    // Memory Usage Analysis
    const memoryUsagePercent = metrics.totalJSHeapSize > 0 ? 
      (metrics.usedJSHeapSize / metrics.totalJSHeapSize) * 100 : 0;
    
    if (memoryUsagePercent > 80) {
      issues.push({
        id: 'memory-high',
        type: memoryUsagePercent > 90 ? 'error' : 'warning',
        category: 'memory',
        title: 'High Memory Usage',
        description: `Memory usage is at ${Math.round(memoryUsagePercent)}%`,
        impact: memoryUsagePercent > 90 ? 'high' : 'medium',
        suggestion: 'Check for memory leaks and optimize component lifecycle',
        metric: memoryUsagePercent,
        threshold: 80
      });

    // Cache Hit Rate Analysis
    if (metrics.cacheHitRate < 50) {
      issues.push({
        id: 'cache-low',
        type: 'warning',
        category: 'network',
        title: 'Low Cache Hit Rate',
        description: `Only ${Math.round(metrics.cacheHitRate)}% of resources are cached`,
        impact: 'medium',
        suggestion: 'Implement better caching strategies for static assets',
        metric: metrics.cacheHitRate,
        threshold: 50
      });

    // Load Time Analysis
    if (metrics.loadComplete > 3000) {
      issues.push({
        id: 'load-slow',
        type: metrics.loadComplete > 5000 ? 'error' : 'warning',
        category: 'performance',
        title: 'Slow Page Load',
        description: `Page load took ${Math.round(metrics.loadComplete)}ms`,
        impact: metrics.loadComplete > 5000 ? 'high' : 'medium',
        suggestion: 'Optimize bundle size, enable compression, and use code splitting',
        metric: metrics.loadComplete,
        threshold: 3000
      });

    return issues;
  };

  // Core Web Vitals measurement functions
  const getLCP = (): Promise<number | null> => {
    return new Promise((resolve: any) => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list: any) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
          observer.disconnect();
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Timeout after 10 seconds
        setTimeout(() => {
          observer.disconnect();
          resolve(null);
        }, 10000);
      } else {
        resolve(null);

    });
  };

  const getFID = (): Promise<number | null> => {
    return new Promise((resolve: any) => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list: any) => {
          const entries = list.getEntries();
          const firstEntry = entries[0];
          resolve(firstEntry.processingStart - firstEntry.startTime);
          observer.disconnect();
        });
        observer.observe({ entryTypes: ['first-input'] });
        
        // Timeout after 30 seconds
        setTimeout(() => {
          observer.disconnect();
          resolve(null);
        }, 30000);
      } else {
        resolve(null);

    });
  };

  const getCLS = (): Promise<number | null> => {
    return new Promise((resolve: any) => {
      if ('PerformanceObserver' in window) {
        let clsValue = 0;
        const observer = new PerformanceObserver((list: any) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;


        });
        observer.observe({ entryTypes: ['layout-shift'] });
        
        // Resolve after 10 seconds
        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 10000);
      } else {
        resolve(null);

    });
  };

  const getIssueIcon = (issue: PerformanceIssue) => {
    switch (issue.type) {
      case 'error': return '🔴';
      case 'warning': return '🟡';
      case 'info': return '🔵';
      default: return '⚪';

  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-slate-400';

  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatMs = (ms: number) => {
    return `${Math.round(ms)}ms`;
  };

  // Don't render in production unless explicitly enabled
  if (process.env.NODE_ENV === 'production' && 
      localStorage.getItem('show_performance_monitor') !== 'true') {
    return null;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        title="Performance Monitor"
      >
        <span className="text-lg sm:px-4 md:px-6 lg:px-8">⚡</span>
      </button>

      {/* Performance Monitor Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: -400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -400 }}
            className="fixed left-4 bottom-32 z-50 w-96 max-h-96 overflow-y-auto bg-slate-800/95 backdrop-blur-sm rounded-xl border border-slate-600 shadow-2xl sm:px-4 md:px-6 lg:px-8"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-600 sm:px-4 md:px-6 lg:px-8">
              <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                <h3 className="text-lg font-bold text-white sm:px-4 md:px-6 lg:px-8">⚡ Performance Monitor</h3>
                <button
                  onClick={() => setIsVisible(false)}
                >
                  ×
                </button>
              </div>
              {isCollecting && (
                <div className="mt-2 text-sm text-blue-400 sm:px-4 md:px-6 lg:px-8">Collecting metrics...</div>
              )}
            </div>

            {/* Metrics */}
            {metrics && (
              <div className="p-4 space-y-4 sm:px-4 md:px-6 lg:px-8">
                {/* Core Web Vitals */}
                <div>
                  <h4 className="text-white font-semibold mb-2 sm:px-4 md:px-6 lg:px-8">Core Web Vitals</h4>
                  <div className="grid grid-cols-3 gap-2 text-xs sm:px-4 md:px-6 lg:px-8">
                    <div className="bg-slate-700/50 p-2 rounded sm:px-4 md:px-6 lg:px-8">
                      <div className="text-slate-400 sm:px-4 md:px-6 lg:px-8">LCP</div>
                      <div className={`font-bold ${metrics.lcp && metrics.lcp > 2500 ? 'text-red-400' : 'text-green-400'}`}>
                        {metrics.lcp ? formatMs(metrics.lcp) : 'N/A'}
                      </div>
                    </div>
                    <div className="bg-slate-700/50 p-2 rounded sm:px-4 md:px-6 lg:px-8">
                      <div className="text-slate-400 sm:px-4 md:px-6 lg:px-8">FID</div>
                      <div className={`font-bold ${metrics.fid && metrics.fid > 100 ? 'text-red-400' : 'text-green-400'}`}>
                        {metrics.fid ? formatMs(metrics.fid) : 'N/A'}
                      </div>
                    </div>
                    <div className="bg-slate-700/50 p-2 rounded sm:px-4 md:px-6 lg:px-8">
                      <div className="text-slate-400 sm:px-4 md:px-6 lg:px-8">CLS</div>
                      <div className={`font-bold ${metrics.cls && metrics.cls > 0.1 ? 'text-red-400' : 'text-green-400'}`}>
                        {metrics.cls ? metrics.cls.toFixed(3) : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Load Times */}
                <div>
                  <h4 className="text-white font-semibold mb-2 sm:px-4 md:px-6 lg:px-8">Load Times</h4>
                  <div className="space-y-1 text-xs sm:px-4 md:px-6 lg:px-8">
                    <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                      <span className="text-slate-400 sm:px-4 md:px-6 lg:px-8">DOM Content Loaded:</span>
                      <span className="text-white sm:px-4 md:px-6 lg:px-8">{formatMs(metrics.domContentLoaded)}</span>
                    </div>
                    <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                      <span className="text-slate-400 sm:px-4 md:px-6 lg:px-8">Load Complete:</span>
                      <span className="text-white sm:px-4 md:px-6 lg:px-8">{formatMs(metrics.loadComplete)}</span>
                    </div>
                    <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                      <span className="text-slate-400 sm:px-4 md:px-6 lg:px-8">First Paint:</span>
                      <span className="text-white sm:px-4 md:px-6 lg:px-8">{formatMs(metrics.firstPaint)}</span>
                    </div>
                  </div>
                </div>

                {/* Memory Usage */}
                <div>
                  <h4 className="text-white font-semibold mb-2 sm:px-4 md:px-6 lg:px-8">Memory Usage</h4>
                  <div className="space-y-1 text-xs sm:px-4 md:px-6 lg:px-8">
                    <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                      <span className="text-slate-400 sm:px-4 md:px-6 lg:px-8">Used:</span>
                      <span className="text-white sm:px-4 md:px-6 lg:px-8">{formatBytes(metrics.usedJSHeapSize)}</span>
                    </div>
                    <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                      <span className="text-slate-400 sm:px-4 md:px-6 lg:px-8">Total:</span>
                      <span className="text-white sm:px-4 md:px-6 lg:px-8">{formatBytes(metrics.totalJSHeapSize)}</span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                      <div 
                        className="bg-blue-500 h-2 rounded-full sm:px-4 md:px-6 lg:px-8" 
                        style={{ 
                          width: `${metrics.totalJSHeapSize > 0 ? (metrics.usedJSHeapSize / metrics.totalJSHeapSize) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Network Info */}
                <div>
                  <h4 className="text-white font-semibold mb-2 sm:px-4 md:px-6 lg:px-8">Network</h4>
                  <div className="space-y-1 text-xs sm:px-4 md:px-6 lg:px-8">
                    <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                      <span className="text-slate-400 sm:px-4 md:px-6 lg:px-8">Connection:</span>
                      <span className="text-white sm:px-4 md:px-6 lg:px-8">{metrics.effectiveType}</span>
                    </div>
                    <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                      <span className="text-slate-400 sm:px-4 md:px-6 lg:px-8">Cache Hit Rate:</span>
                      <span className="text-white sm:px-4 md:px-6 lg:px-8">{Math.round(metrics.cacheHitRate)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Issues */}
            {issues.length > 0 && (
              <div className="p-4 border-t border-slate-600 sm:px-4 md:px-6 lg:px-8">
                <h4 className="text-white font-semibold mb-2 sm:px-4 md:px-6 lg:px-8">Issues ({issues.length})</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto sm:px-4 md:px-6 lg:px-8">
                  {issues.map((issue: any) => (
                    <div key={issue.id} className="p-2 bg-slate-700/50 rounded text-xs sm:px-4 md:px-6 lg:px-8">
                      <div className="flex items-center gap-2 mb-1 sm:px-4 md:px-6 lg:px-8">
                        <span>{getIssueIcon(issue)}</span>
                        <span className="text-white font-medium sm:px-4 md:px-6 lg:px-8">{issue.title}</span>
                        <span className={`text-xs ${getImpactColor(issue.impact)}`}>
                          {issue.impact}
                        </span>
                      </div>
                      <div className="text-slate-400 mb-1 sm:px-4 md:px-6 lg:px-8">{issue.description}</div>
                      <div className="text-slate-300 sm:px-4 md:px-6 lg:px-8">{issue.suggestion}</div>
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

const PerformanceMonitorWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <PerformanceMonitor {...props} />
  </ErrorBoundary>
);

export default React.memo(PerformanceMonitorWithErrorBoundary);