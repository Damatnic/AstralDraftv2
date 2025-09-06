/**
 * Performance monitoring hook for elite experience
 */
import { useEffect, useRef } from 'react';

export const usePerformanceMonitor = () => {
  const metricsRef = useRef({
    renderCount: 0,
    lastRenderTime: Date.now(),
    avgRenderTime: 0,
  });

  useEffect(() => {
    const startTime = Date.now();
    
    return () => {
      const endTime = Date.now();
      const renderTime = endTime - startTime;
      
      metricsRef.current.renderCount++;
      metricsRef.current.avgRenderTime = 
        (metricsRef.current.avgRenderTime + renderTime) / 2;
      
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Render ${metricsRef.current.renderCount}: ${renderTime}ms (avg: ${metricsRef.current.avgRenderTime.toFixed(2)}ms)`);
      }
    };
  });

  return metricsRef.current;
};
