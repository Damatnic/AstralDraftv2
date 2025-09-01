/**
 * Mobile Viewport Manager
 * Handles mobile viewport optimization, orientation changes, and safe areas
 */

import React, { useEffect, useState, useCallback } from &apos;react&apos;;

export interface ViewportInfo {
}
  width: number;
  height: number;
  orientation: &apos;portrait&apos; | &apos;landscape&apos;;
  isStandalone: boolean;
  safeAreaInsets: {
}
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  devicePixelRatio: number;
  touchCapable: boolean;
}

export interface MobileViewportConfig {
}
  preventZoom: boolean;
  fixedViewport: boolean;
  statusBarStyle: &apos;default&apos; | &apos;light-content&apos; | &apos;dark-content&apos;;
  homeIndicatorAutoHidden: boolean;
}

const DEFAULT_CONFIG: MobileViewportConfig = {
}
  preventZoom: true,
  fixedViewport: true,
  statusBarStyle: &apos;dark-content&apos;,
  homeIndicatorAutoHidden: false
};

export const useMobileViewport = (config: Partial<MobileViewportConfig> = {}) => {
}
  const [viewportInfo, setViewportInfo] = useState<ViewportInfo>({
}
    width: window.innerWidth,
    height: window.innerHeight,
    orientation: window.innerWidth > window.innerHeight ? &apos;landscape&apos; : &apos;portrait&apos;,
    isStandalone: window.matchMedia(&apos;(display-mode: standalone)&apos;).matches,
    safeAreaInsets: { top: 0, right: 0, bottom: 0, left: 0 },
    devicePixelRatio: window.devicePixelRatio || 1,
    touchCapable: &apos;ontouchstart&apos; in window
  });

  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  // Get safe area insets from CSS environment variables
  const getSafeAreaInsets = useCallback(() => {
}
    const testEl = document.createElement(&apos;div&apos;);
    testEl.style.position = &apos;fixed&apos;;
    testEl.style.top = &apos;0&apos;;
    testEl.style.left = &apos;0&apos;;
    testEl.style.visibility = &apos;hidden&apos;;
    document.body.appendChild(testEl);

    const computedStyle = getComputedStyle(testEl);
    
    // Try to get safe area insets
    const safeAreaTop = computedStyle.getPropertyValue(&apos;env(safe-area-inset-top)&apos;) || &apos;0px&apos;;
    const safeAreaRight = computedStyle.getPropertyValue(&apos;env(safe-area-inset-right)&apos;) || &apos;0px&apos;;
    const safeAreaBottom = computedStyle.getPropertyValue(&apos;env(safe-area-inset-bottom)&apos;) || &apos;0px&apos;;
    const safeAreaLeft = computedStyle.getPropertyValue(&apos;env(safe-area-inset-left)&apos;) || &apos;0px&apos;;

    document.body.removeChild(testEl);

    return {
}
      top: parseInt(safeAreaTop) || 0,
      right: parseInt(safeAreaRight) || 0,
      bottom: parseInt(safeAreaBottom) || 0,
      left: parseInt(safeAreaLeft) || 0
    };
  }, []);

  // Update viewport info
  const updateViewportInfo = useCallback(() => {
}
    setViewportInfo({
}
      width: window.innerWidth,
      height: window.innerHeight,
      orientation: window.innerWidth > window.innerHeight ? &apos;landscape&apos; : &apos;portrait&apos;,
      isStandalone: window.matchMedia(&apos;(display-mode: standalone)&apos;).matches,
      safeAreaInsets: getSafeAreaInsets(),
      devicePixelRatio: window.devicePixelRatio || 1,
      touchCapable: &apos;ontouchstart&apos; in window
    });
  }, [getSafeAreaInsets]);

  // Set up viewport meta tag
  const setupViewportMeta = useCallback(() => {
}
    let viewportMeta = document.querySelector(&apos;meta[name="viewport"]&apos;) as HTMLMetaElement;
    
    if (!viewportMeta) {
}
      viewportMeta = document.createElement(&apos;meta&apos;);
      viewportMeta.name = &apos;viewport&apos;;
      document.head.appendChild(viewportMeta);
    }

    const contentParts = [
      &apos;width=device-width&apos;,
      &apos;initial-scale=1.0&apos;
    ];

    if (mergedConfig.preventZoom) {
}
      contentParts.push(&apos;maximum-scale=1.0&apos;, &apos;user-scalable=no&apos;);
    }

    if (mergedConfig.fixedViewport) {
}
      contentParts.push(&apos;viewport-fit=cover&apos;);
    }

    viewportMeta.content = contentParts.join(&apos;, &apos;);
  }, [mergedConfig]);

  // Set up iOS specific meta tags
  const setupIOSMeta = useCallback(() => {
}
    // Status bar style
    let statusBarMeta = document.querySelector(&apos;meta[name="apple-mobile-web-app-status-bar-style"]&apos;) as HTMLMetaElement;
    if (!statusBarMeta) {
}
      statusBarMeta = document.createElement(&apos;meta&apos;);
      statusBarMeta.name = &apos;apple-mobile-web-app-status-bar-style&apos;;
      document.head.appendChild(statusBarMeta);
    }
    statusBarMeta.content = mergedConfig.statusBarStyle;

    // Web app capable
    let webAppMeta = document.querySelector(&apos;meta[name="apple-mobile-web-app-capable"]&apos;) as HTMLMetaElement;
    if (!webAppMeta) {
}
      webAppMeta = document.createElement(&apos;meta&apos;);
      webAppMeta.name = &apos;apple-mobile-web-app-capable&apos;;
      webAppMeta.content = &apos;yes&apos;;
      document.head.appendChild(webAppMeta);
    }

    // Home indicator auto-hidden
    if (mergedConfig.homeIndicatorAutoHidden) {
}
      const indicatorMeta = document.querySelector(&apos;meta[name="apple-mobile-web-app-status-bar-style"]&apos;) as HTMLMetaElement;
      if (indicatorMeta) {
}
        indicatorMeta.content = &apos;black-translucent&apos;;
      }
    }
  }, [mergedConfig]);

  // Handle orientation change
  const handleOrientationChange = useCallback(() => {
}
    // Small delay to ensure dimensions are updated
    setTimeout(() => {
}
      updateViewportInfo();
      
      // Trigger a custom event for components to listen to
      window.dispatchEvent(new CustomEvent(&apos;orientationchange-complete&apos;, {
}
        detail: {
}
          orientation: window.innerWidth > window.innerHeight ? &apos;landscape&apos; : &apos;portrait&apos;,
          width: window.innerWidth,
          height: window.innerHeight
        }
      }));
    }, 100);
  }, [updateViewportInfo]);

  // Prevent double-tap zoom on iOS
  const preventDoubleTabZoom = useCallback(() => {
}
    if (!mergedConfig.preventZoom) return;

    let lastTouchEnd = 0;
    
    const handleTouchEnd = (e: TouchEvent) => {
}
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
}
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    document.addEventListener(&apos;touchend&apos;, handleTouchEnd, { passive: false });
    
    return () => {
}
      document.removeEventListener(&apos;touchend&apos;, handleTouchEnd);
    };
  }, [mergedConfig.preventZoom]);

  // Handle focus on inputs (prevent zoom on iOS)
  const handleInputFocus = useCallback(() => {
}
    if (!mergedConfig.preventZoom) return;

    const handleFocus = (e: FocusEvent) => {
}
      const target = e.target as HTMLElement;
      if (target.tagName === &apos;INPUT&apos; || target.tagName === &apos;TEXTAREA&apos;) {
}
        // Temporarily disable zoom
        const viewport = document.querySelector(&apos;meta[name="viewport"]&apos;) as HTMLMetaElement;
        if (viewport) {
}
          const originalContent = viewport.content;
          viewport.content = originalContent + &apos;, maximum-scale=1.0&apos;;
          
          const handleBlur = () => {
}
            viewport.content = originalContent;
            target.removeEventListener(&apos;blur&apos;, handleBlur);
          };
          
          target.addEventListener(&apos;blur&apos;, handleBlur);
        }
      }
    };

    document.addEventListener(&apos;focusin&apos;, handleFocus);
    
    return () => {
}
      document.removeEventListener(&apos;focusin&apos;, handleFocus);
    };
  }, [mergedConfig.preventZoom]);

  // Update CSS custom properties for safe areas
  const updateSafeAreaCSS = useCallback(() => {
}
    const { safeAreaInsets } = viewportInfo;
    const root = document.documentElement;
    
    root.style.setProperty(&apos;--safe-area-inset-top&apos;, `${safeAreaInsets.top}px`);
    root.style.setProperty(&apos;--safe-area-inset-right&apos;, `${safeAreaInsets.right}px`);
    root.style.setProperty(&apos;--safe-area-inset-bottom&apos;, `${safeAreaInsets.bottom}px`);
    root.style.setProperty(&apos;--safe-area-inset-left&apos;, `${safeAreaInsets.left}px`);
    
    // Also set viewport dimensions
    root.style.setProperty(&apos;--viewport-width&apos;, `${viewportInfo.width}px`);
    root.style.setProperty(&apos;--viewport-height&apos;, `${viewportInfo.height}px`);
  }, [viewportInfo]);

  // Initialize on mount
  useEffect(() => {
}
    setupViewportMeta();
    setupIOSMeta();
    updateViewportInfo();
    
    const cleanupDoubleTab = preventDoubleTabZoom();
    const cleanupInputFocus = handleInputFocus();
    
    return () => {
}
      cleanupDoubleTab?.();
      cleanupInputFocus?.();
    };
  }, [setupViewportMeta, setupIOSMeta, updateViewportInfo, preventDoubleTabZoom, handleInputFocus]);

  // Listen for viewport changes
  useEffect(() => {
}
    window.addEventListener(&apos;resize&apos;, updateViewportInfo);
    window.addEventListener(&apos;orientationchange&apos;, handleOrientationChange);
    
    return () => {
}
      window.removeEventListener(&apos;resize&apos;, updateViewportInfo);
      window.removeEventListener(&apos;orientationchange&apos;, handleOrientationChange);
    };
  }, [updateViewportInfo, handleOrientationChange]);

  // Update CSS properties when viewport info changes
  useEffect(() => {
}
    updateSafeAreaCSS();
  }, [updateSafeAreaCSS]);

  return {
}
    viewportInfo,
    isPortrait: viewportInfo.orientation === &apos;portrait&apos;,
    isLandscape: viewportInfo.orientation === &apos;landscape&apos;,
    isMobile: viewportInfo.width < 768,
    isTablet: viewportInfo.width >= 768 && viewportInfo.width < 1024,
    isDesktop: viewportInfo.width >= 1024,
    isStandalone: viewportInfo.isStandalone,
    safeAreaInsets: viewportInfo.safeAreaInsets,
//     updateViewportInfo
  };
};

/**
 * Component to handle mobile viewport setup
 */
export default useMobileViewport;
