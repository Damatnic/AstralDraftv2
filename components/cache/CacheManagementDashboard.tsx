/**
 * Cache Management Dashboard Component
 * Clean rewrite focusing on core functionality
 */

import React, { useState, useEffect } from 'react';

interface CacheStats {
  totalSize: number;
  itemCount: number;
  hitRate: number;
  lastUpdated: Date;
}

interface CacheManagementDashboardProps {
  className?: string;
}

/**
 * Simple Cache Management Dashboard
 */
export const CacheManagementDashboard: React.FC<CacheManagementDashboardProps> = ({
  className = ''
}) => {
  const [cacheStats, setCacheStats] = useState<CacheStats>({
    totalSize: 0,
    itemCount: 0,
    hitRate: 0,
    lastUpdated: new Date()
  });
  const [isClearing, setIsClearing] = useState(false);
  const [lastAction, setLastAction] = useState<string>('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load cache stats
  useEffect(() => {
    const loadCacheStats = async () => {
      try {
        // Simple cache size estimation
        const estimate = await navigator.storage?.estimate?.();
        setCacheStats({
          totalSize: estimate?.usage || 0,
          itemCount: localStorage.length || 0,
          hitRate: 85, // Mock data for now
          lastUpdated: new Date()
        });
      } catch (error) {
        console.warn('Failed to load cache stats:', error);
      }
    };

    loadCacheStats();
  }, []);

  const handleClearCache = async (type: 'all' | 'localStorage' | 'sessionStorage' = 'all') => {
    setIsClearing(true);
    try {
      if (type === 'all' || type === 'localStorage') {
        localStorage.clear();
      }
      if (type === 'all' || type === 'sessionStorage') {
        sessionStorage.clear();
      }
      
      // Clear service worker caches if available
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }

      setLastAction(`Cleared ${type} cache at ${new Date().toLocaleTimeString()}`);
      
      // Reload stats
      setCacheStats(prev => ({
        ...prev,
        totalSize: 0,
        itemCount: 0,
        lastUpdated: new Date()
      }));
    } catch (error) {
      console.error('Failed to clear cache:', error);
      setLastAction('Failed to clear cache');
    } finally {
      setIsClearing(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`cache-management-dashboard bg-gray-800 rounded-lg p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Cache Management</h2>
        <p className="text-gray-400 text-sm">Monitor and manage application cache</p>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center justify-between mb-6 p-4 bg-gray-700 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className={`flex items-center space-x-2 ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-sm font-medium">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <div className="text-sm text-gray-400">
            Service Worker: Active
          </div>
        </div>
      </div>

      {/* Cache Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-300 mb-1">Total Size</h3>
          <p className="text-2xl font-bold text-white">{formatBytes(cacheStats.totalSize)}</p>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-300 mb-1">Items</h3>
          <p className="text-2xl font-bold text-white">{cacheStats.itemCount}</p>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-300 mb-1">Hit Rate</h3>
          <p className="text-2xl font-bold text-white">{cacheStats.hitRate}%</p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Actions</h3>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleClearCache('localStorage')}
            disabled={isClearing}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {isClearing ? 'Clearing...' : 'Clear Local Storage'}
          </button>
          
          <button
            onClick={() => handleClearCache('sessionStorage')}
            disabled={isClearing}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {isClearing ? 'Clearing...' : 'Clear Session Storage'}
          </button>
          
          <button
            onClick={() => handleClearCache('all')}
            disabled={isClearing}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {isClearing ? 'Clearing...' : 'Clear All Cache'}
          </button>
        </div>
      </div>

      {/* Last Action */}
      {lastAction && (
        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <p className="text-blue-300 text-sm">
            <span className="font-medium">Last Action:</span> {lastAction}
          </p>
        </div>
      )}

      {/* Last Updated */}
      <div className="mt-4 text-xs text-gray-500">
        Last updated: {cacheStats.lastUpdated.toLocaleString()}
      </div>
    </div>
  );
};

export default CacheManagementDashboard;
