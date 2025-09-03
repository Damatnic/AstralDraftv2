/**
 * Mobile Performance Optimization Utilities
 * Provides tools for optimizing mobile performance and user experience
 */

// Viewport height fix for mobile browsers
export const setViewportHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

// Initialize viewport height fix
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', () => {
  setTimeout(setViewportHeight, 100);
});
setViewportHeight();

// Mobile device detection
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768;
};

// Touch device detection
export const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// iOS device detection
export const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

// Android device detection
export const isAndroid = () => {
  return /Android/.test(navigator.userAgent);
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  if ('performance' in window) {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
  } else {
    fn();
  }
};

// Debounced resize handler
export const createDebouncedResize = (callback: () => void, delay = 100) => {
  let timeoutId: NodeJS.Timeout;
  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, delay);
  };
};

// Throttled scroll handler
export const createThrottledScroll = (callback: () => void, delay = 16) => {
  let isThrottled = false;
  return () => {
    if (!isThrottled) {
      callback();
      isThrottled = true;
      setTimeout(() => {
        isThrottled = false;
      }, delay);
    }
  };
};

// Lazy loading for images
export const setupLazyLoading = () => {
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

    document.querySelectorAll('img[data-src]').forEach((img) => {
      imageObserver.observe(img);
    });
  }
};

// Haptic feedback for mobile devices
export const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  if ('vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30, 10, 30]
    };
    navigator.vibrate(patterns[type]);
  }
};

// Prevent zoom on input focus (iOS)
export const preventZoomOnInputFocus = () => {
  if (isIOS()) {
    document.addEventListener('focusin', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
          viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        }
      }
    });

    document.addEventListener('focusout', () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover');
      }
    });
  }
};

// Memory management for mobile
export const cleanupUnusedElements = () => {
  // Remove elements that are far outside the viewport
  const elements = document.querySelectorAll('[data-cleanup="true"]');
  elements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight * 2 && rect.bottom > -window.innerHeight;
    
    if (!isVisible) {
      const placeholder = document.createElement('div');
      placeholder.style.height = `${rect.height}px`;
      placeholder.dataset.placeholder = 'true';
      element.parentNode?.replaceChild(placeholder, element);
    }
  });
};

// Battery status monitoring
export const monitorBatteryStatus = (onLowBattery?: () => void) => {
  if ('getBattery' in navigator) {
    (navigator as any).getBattery().then((battery: any) => {
      const handleBatteryChange = () => {
        if (battery.level < 0.2 && !battery.charging) {
          onLowBattery?.();
        }
      };
      
      battery.addEventListener('levelchange', handleBatteryChange);
      battery.addEventListener('chargingchange', handleBatteryChange);
    });
  }
};

// Network status monitoring
export const monitorNetworkStatus = () => {
  const updateNetworkStatus = () => {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (connection) {
      const networkInfo = {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };
      
      // Dispatch custom event with network info
      document.dispatchEvent(new CustomEvent('networkchange', { detail: networkInfo }));
    }
  };

  if ('connection' in navigator) {
    (navigator as any).connection.addEventListener('change', updateNetworkStatus);
    updateNetworkStatus(); // Initial check
  }
};

// Initialize mobile optimizations
export const initializeMobileOptimizations = () => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    console.warn('Mobile optimizations skipped - not in browser environment');
    return;
  }

  try {
    setViewportHeight();
    setupLazyLoading();
    preventZoomOnInputFocus();
    monitorNetworkStatus();
    
    // Add mobile-specific classes to body
    if (isMobileDevice()) {
      document.body.classList.add('mobile-device');
    }
    
    if (isTouchDevice()) {
      document.body.classList.add('touch-device');
    }
    
    if (isIOS()) {
      document.body.classList.add('ios-device');
    }
    
    if (isAndroid()) {
      document.body.classList.add('android-device');
    }
    
    // Low battery optimizations - wrap in try/catch as this API might not be available
    try {
      monitorBatteryStatus(() => {
        document.body.classList.add('low-battery-mode');
        // Reduce animations and effects
      });
    } catch (batteryError) {
      console.warn('Battery monitoring not available:', batteryError);
    }
    
    console.log('Mobile optimizations initialized successfully');
  } catch (error) {
    console.error('Error initializing mobile optimizations:', error);
  }
};

// Export all utilities
export default {
  setViewportHeight,
  isMobileDevice,
  isTouchDevice,
  isIOS,
  isAndroid,
  measurePerformance,
  createDebouncedResize,
  createThrottledScroll,
  setupLazyLoading,
  triggerHapticFeedback,
  preventZoomOnInputFocus,
  cleanupUnusedElements,
  monitorBatteryStatus,
  monitorNetworkStatus,
  initializeMobileOptimizations
};
