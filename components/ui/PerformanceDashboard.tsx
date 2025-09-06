/**
 * Performance Dashboard Component
 * Displays real-time performance metrics and Web Vitals
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import performanceService from '../../services/performanceService';

interface PerformanceMetric {
  name: string;
  value?: number;
  budget: number;
  status: 'good' | 'needs-improvement' | 'poor';
  unit: string;
  description: string;
}

export const PerformanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    // Initialize performance monitoring for dev mode too
    if (process.env.NODE_ENV === 'development') {
      performanceService.initialize();
    }

    const updateMetrics = () => {
      const summary = performanceService.getPerformanceSummary();
      if (summary) {
        setSummary(summary);
        
        const webVitalMetrics: PerformanceMetric[] = [
          {
            name: 'FCP',
            value: summary.webVitals.fcp?.value,
            budget: summary.webVitals.fcp?.budget || 1800,
            status: summary.webVitals.fcp?.status || 'poor',
            unit: 'ms',
            description: 'First Contentful Paint'
          },
          {
            name: 'LCP',
            value: summary.webVitals.lcp?.value,
            budget: summary.webVitals.lcp?.budget || 2500,
            status: summary.webVitals.lcp?.status || 'poor',
            unit: 'ms',
            description: 'Largest Contentful Paint'
          },
          {
            name: 'FID',
            value: summary.webVitals.fid?.value,
            budget: summary.webVitals.fid?.budget || 100,
            status: summary.webVitals.fid?.status || 'poor',
            unit: 'ms',
            description: 'First Input Delay'
          },
          {
            name: 'CLS',
            value: summary.webVitals.cls?.value,
            budget: summary.webVitals.cls?.budget || 0.1,
            status: summary.webVitals.cls?.status || 'poor',
            unit: '',
            description: 'Cumulative Layout Shift'
          }
        ];
        
        setMetrics(webVitalMetrics);
      }
    };

    // Update metrics periodically
    const interval = setInterval(updateMetrics, 5000);
    updateMetrics(); // Initial update

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'needs-improvement': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'poor': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return '✅';
      case 'needs-improvement': return '⚠️';
      case 'poor': return '🔴';
      default: return '⚪';
    }
  };

  const formatValue = (value?: number, unit?: string) => {
    if (value === undefined) return 'N/A';
    return `${value.toFixed(unit === '' ? 3 : 0)}${unit}`;
  };

  if (!isVisible) {
    return (
      <motion.button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-300 text-sm transition-colors z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        📊 Performance
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-4 right-4 w-80 bg-black/80 backdrop-blur-md border border-white/20 rounded-xl p-4 text-white z-50"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-lg">📊</span>
          <h3 className="text-sm font-semibold">Performance Metrics</h3>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <span className="text-xs">{getStatusIcon(metric.status)}</span>
              <div>
                <div className="text-sm font-medium">{metric.name}</div>
                <div className="text-xs text-gray-400">{metric.description}</div>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`text-sm font-mono ${getStatusColor(metric.status).split(' ')[0]}`}>
                {formatValue(metric.value, metric.unit)}
              </div>
              <div className="text-xs text-gray-500">
                Budget: {formatValue(metric.budget, metric.unit)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {summary?.customMetrics && (
        <div className="mt-4 pt-3 border-t border-white/10">
          <h4 className="text-xs font-semibold text-gray-300 mb-2">Custom Metrics</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {summary.customMetrics.loadTime && (
              <div>
                <span className="text-gray-400">Load Time:</span>
                <span className="ml-1 font-mono">{summary.customMetrics.loadTime.toFixed(0)}ms</span>
              </div>
            )}
            {summary.customMetrics.bundleSize && (
              <div>
                <span className="text-gray-400">Bundle:</span>
                <span className="ml-1 font-mono">{(summary.customMetrics.bundleSize / 1024).toFixed(0)}KB</span>
              </div>
            )}
            {summary.customMetrics.memoryUsage && (
              <div>
                <span className="text-gray-400">Memory:</span>
                <span className="ml-1 font-mono">{summary.customMetrics.memoryUsage.toFixed(1)}MB</span>
              </div>
            )}
            <div>
              <span className="text-gray-400">Route:</span>
              <span className="ml-1 font-mono text-blue-300">{summary.context?.route || '/'}</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-3 pt-2 border-t border-white/10 flex justify-between text-xs text-gray-400">
        <span>Auto-refresh: 5s</span>
        <span>Web Vitals 2024</span>
      </div>
    </motion.div>
  );
};

export default PerformanceDashboard;