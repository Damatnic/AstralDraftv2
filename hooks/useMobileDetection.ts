/**
 * Enhanced Mobile Detection Hook
 * Comprehensive mobile device and interaction detection
 */

import { useState, useEffect } from &apos;react&apos;;

interface MobileDetection {
}
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  isPWA: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  screenSize: &apos;small&apos; | &apos;medium&apos; | &apos;large&apos; | &apos;xlarge&apos;;
  viewportWidth: number;
  viewportHeight: number;
  hasNotch: boolean;
  supportsHover: boolean;
}

export const useMobileDetection = (): MobileDetection => {
}
  const [detection, setDetection] = useState<MobileDetection>({
}
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouchDevice: false,
    isPortrait: false,
    isLandscape: true,
    isPWA: false,
    isIOS: false,
    isAndroid: false,
    screenSize: &apos;large&apos;,
    viewportWidth: 1024,
    viewportHeight: 768,
    hasNotch: false,
    supportsHover: true
  });

  useEffect(() => {
}
    const updateDetection = () => {
}
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Device type detection
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;
      
      // Touch detection
      const isTouchDevice = &apos;ontouchstart&apos; in window || 
                           navigator.maxTouchPoints > 0 ||
                           (navigator as any).msMaxTouchPoints > 0;
      
      // Orientation detection
      const isPortrait = height > width;
      const isLandscape = width > height;
      
      // PWA detection
      const isPWA = window.matchMedia(&apos;(display-mode: standalone)&apos;).matches ||
                   (window.navigator as any).standalone ||
                   document.referrer.includes(&apos;android-app://&apos;);
      
      // Platform detection
      const userAgent = navigator.userAgent.toLowerCase();
      const isIOS = /iphone|ipad|ipod/.test(userAgent) ||
                   (navigator.userAgent.includes(&apos;Mac&apos;) && navigator.maxTouchPoints > 1);
      const isAndroid = /android/.test(userAgent);
      
      // Screen size categorization
      let screenSize: &apos;small&apos; | &apos;medium&apos; | &apos;large&apos; | &apos;xlarge&apos;;
      if (width < 480) screenSize = &apos;small&apos;;
      else if (width < 768) screenSize = &apos;medium&apos;;
      else if (width < 1280) screenSize = &apos;large&apos;;
      else screenSize = &apos;xlarge&apos;;
      
      // Notch detection (iOS safe area)
      const hasNotch = isIOS && (
        CSS.supports(&apos;padding: env(safe-area-inset-top)&apos;) ||
        CSS.supports(&apos;padding: constant(safe-area-inset-top)&apos;)
      );
      
      // Hover support detection
      const supportsHover = window.matchMedia(&apos;(hover: hover)&apos;).matches;
      
      setDetection({
}
        isMobile,
        isTablet,
        isDesktop,
        isTouchDevice,
        isPortrait,
        isLandscape,
        isPWA,
        isIOS,
        isAndroid,
        screenSize,
        viewportWidth: width,
        viewportHeight: height,
        hasNotch,
//         supportsHover
      });
    };

    // Initial detection
    updateDetection();
    
    // Listen for changes
    window.addEventListener(&apos;resize&apos;, updateDetection);
    window.addEventListener(&apos;orientationchange&apos;, updateDetection);
    
    // Listen for PWA installation
    window.addEventListener(&apos;appinstalled&apos;, updateDetection);
    
    return () => {
}
      window.removeEventListener(&apos;resize&apos;, updateDetection);
      window.removeEventListener(&apos;orientationchange&apos;, updateDetection);
      window.removeEventListener(&apos;appinstalled&apos;, updateDetection);
    };
  }, []);

  return detection;
};

// Enhanced media query hook with mobile-specific breakpoints
export const useResponsiveBreakpoint = () => {
}
  const [breakpoint, setBreakpoint] = useState<&apos;xs&apos; | &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos; | &apos;xl&apos;>(&apos;lg&apos;);

  useEffect(() => {
}
    const updateBreakpoint = () => {
}
      const width = window.innerWidth;
      
      if (width < 480) setBreakpoint(&apos;xs&apos;);      // Extra small phones
      else if (width < 640) setBreakpoint(&apos;sm&apos;); // Small phones
      else if (width < 768) setBreakpoint(&apos;md&apos;); // Large phones / small tablets
      else if (width < 1024) setBreakpoint(&apos;lg&apos;); // Tablets / small laptops
      else setBreakpoint(&apos;xl&apos;);                   // Desktops
    };

    updateBreakpoint();
    window.addEventListener(&apos;resize&apos;, updateBreakpoint);
    
    return () => window.removeEventListener(&apos;resize&apos;, updateBreakpoint);
  }, []);

  return breakpoint;
};

// Mobile gesture detection hook
export const useMobileGestures = () => {
}
  const [isSwipeEnabled, setIsSwipeEnabled] = useState(false);
  const [isPullToRefreshEnabled, setIsPullToRefreshEnabled] = useState(false);
  const detection = useMobileDetection();

  useEffect(() => {
}
    setIsSwipeEnabled(detection.isTouchDevice);
    setIsPullToRefreshEnabled(detection.isMobile && detection.isTouchDevice);
  }, [detection.isTouchDevice, detection.isMobile]);

  return {
}
    isSwipeEnabled,
    isPullToRefreshEnabled,
    isTouchDevice: detection.isTouchDevice
  };
};

// Virtual keyboard detection hook
export const useVirtualKeyboard = () => {
}
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
}
    const handleResize = () => {
}
      const windowHeight = window.innerHeight;
      const screenHeight = window.screen.height;
      const threshold = screenHeight * 0.75;
      
      const keyboardOpen = windowHeight < threshold;
      setIsKeyboardOpen(keyboardOpen);
      
      if (keyboardOpen) {
}
        setKeyboardHeight(screenHeight - windowHeight);
      } else {
}
        setKeyboardHeight(0);
      }
    };

    const handleVisualViewport = () => {
}
      if (&apos;visualViewport&apos; in window && window.visualViewport) {
}
        const viewport = window.visualViewport;
        const initialHeight = window.screen.height;
        
        const keyboardOpen = viewport.height < initialHeight * 0.75;
        setIsKeyboardOpen(keyboardOpen);
        setKeyboardHeight(keyboardOpen ? initialHeight - viewport.height : 0);
      }
    };

    window.addEventListener(&apos;resize&apos;, handleResize);
    if (&apos;visualViewport&apos; in window && window.visualViewport) {
}
      window.visualViewport.addEventListener(&apos;resize&apos;, handleVisualViewport);
    }

    return () => {
}
      window.removeEventListener(&apos;resize&apos;, handleResize);
      if (&apos;visualViewport&apos; in window && window.visualViewport) {
}
        window.visualViewport.removeEventListener(&apos;resize&apos;, handleVisualViewport);
      }
    };
  }, []);

  return { isKeyboardOpen, keyboardHeight };
};

// Network detection for PWA offline support
export const useNetworkStatus = () => {
}
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState<string>(&apos;unknown&apos;);

  useEffect(() => {
}
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    
    const updateConnectionType = () => {
}
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection;
      
      if (connection) {
}
        setConnectionType(connection.effectiveType || connection.type || &apos;unknown&apos;);
      }
    };

    window.addEventListener(&apos;online&apos;, updateOnlineStatus);
    window.addEventListener(&apos;offline&apos;, updateOnlineStatus);
    
    updateConnectionType();
    
    return () => {
}
      window.removeEventListener(&apos;online&apos;, updateOnlineStatus);
      window.removeEventListener(&apos;offline&apos;, updateOnlineStatus);
    };
  }, []);

  return { isOnline, connectionType };
};
