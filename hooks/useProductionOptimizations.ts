/**
 * Production Optimizations Hook
 * TypeScript-compatible production optimizations
 */

import { useEffect } from 'react';

// Simple production performance monitoring
const useProductionOptimizations = () => {
  useEffect(() => {
    // Only run in production and in browser environment
    if (process.env.NODE_ENV !== 'production' || typeof window === 'undefined') {
      return;
    }

    console.log('🚀 Production optimizations active');

    // Performance monitoring
    const monitorPerformance = () => {
      // Core Web Vitals monitoring
      if ('PerformanceObserver' in window) {
        try {
          // Largest Contentful Paint
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            if (lastEntry && lastEntry.startTime > 2500) {
              console.warn('⚠️ Poor LCP performance:', lastEntry.startTime + 'ms');
            }
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // First Input Delay
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              const fid = entry.processingStart - entry.startTime;
              if (fid > 100) {
                console.warn('⚠️ Poor FID performance:', fid + 'ms');
              }
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });

          // Cumulative Layout Shift
          const clsObserver = new PerformanceObserver((list) => {
            let clsValue = 0;
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            });
            if (clsValue > 0.25) {
              console.warn('⚠️ Poor CLS performance:', clsValue);
            }
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (error) {
          console.warn('Performance Observer not fully supported');
        }
      }

      // Memory monitoring
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const memoryUsagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
        if (memoryUsagePercent > 80) {
          console.warn('⚠️ High memory usage:', memoryUsagePercent.toFixed(1) + '%');
        }
      }
    };

    // Service Worker management - NEW VERSION without CSS interception
    const manageServiceWorker = () => {
      if ('serviceWorker' in navigator) {
        // First clean up any old problematic Service Workers
        navigator.serviceWorker.getRegistrations().then(registrations => {
          const oldRegistrations = registrations.filter(reg => 
            reg.scope.includes('sw.js.disabled') || 
            !reg.scope.includes('sw.js') ||
            reg.active?.scriptURL.includes('sw.js.disabled')
          );
          
          if (oldRegistrations.length > 0) {
            console.log('🧹 Cleaning up old Service Workers');
            oldRegistrations.forEach(registration => {
              registration.unregister().catch(error => {
                console.warn('⚠️ Failed to unregister old Service Worker:', error);
              });
            });
          }
        }).catch(error => {
          console.warn('Error checking existing Service Worker registrations:', error);
        });

        // Register new PWA-only Service Worker
        navigator.serviceWorker.register('/sw.js', { 
          scope: '/',
          updateViaCache: 'none' 
        }).then(registration => {
          console.log('📱 Service Worker registered successfully for PWA features');
          console.log('✅ New Service Worker avoids CSS/JS interception issues');
          
          // Handle Service Worker updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('🔄 New Service Worker available, will activate on next page load');
                }
              });
            }
          });
          
        }).catch(error => {
          console.warn('⚠️ Service Worker registration failed:', error);
        });
      } else {
        console.log('📱 Service Worker not supported in this browser');
      }
    };

    // Image lazy loading setup
    const setupLazyLoading = () => {
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
              }
            }
          });
        });

        // Observe existing lazy images
        document.querySelectorAll('img[data-src]').forEach((img) => {
          imageObserver.observe(img);
        });
      }
    };

    // Resource prefetching
    const prefetchResources = () => {
      const criticalResources = [
        { href: '/api/user', as: 'fetch' },
        { href: '/api/leagues', as: 'fetch' }
      ];

      criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = resource.href;
        link.as = resource.as;
        document.head.appendChild(link);
      });
    };

    // Initialize optimizations
    monitorPerformance();
    manageServiceWorker(); // Registers new PWA-only Service Worker
    setupLazyLoading();
    prefetchResources();

    // Performance report after load
    window.addEventListener('load', () => {
      setTimeout(() => {
        console.log('📊 Production app loaded successfully');
      }, 2000);
    });

  }, []);
};

export default useProductionOptimizations;
