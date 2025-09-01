/**
 * Mobile Layout Container
 * Responsive layout with safe area support and mobile optimizations
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useState, useEffect } from &apos;react&apos;;
import { motion } from &apos;framer-motion&apos;;
import MobileNavigation from &apos;./MobileNavigation&apos;;
import PWAInstallPrompt from &apos;./PWAInstallPrompt&apos;;
import { useMediaQuery } from &apos;../../hooks/useMediaQuery&apos;;

interface Props {
}
  children: React.ReactNode;
  activeView: string;
  onViewChange: (view: string) => void;
  showNavigation?: boolean;
  showPWAPrompt?: boolean;
  notificationCount?: number;
  className?: string;

}

const MobileLayout: React.FC<Props> = ({ children,
}
  activeView,
  onViewChange,
  showNavigation = true,
  showPWAPrompt = true,
  notificationCount = 0,
  className = &apos;&apos;
 }: any) => {
}
  const [isLoading, setIsLoading] = React.useState(false);
  const isMobile = useMediaQuery(&apos;(max-width: 768px)&apos;);
  const isTablet = useMediaQuery(&apos;(min-width: 769px) and (max-width: 1023px)&apos;);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // Handle virtual keyboard on mobile
  useEffect(() => {
}
    if (!isMobile) return;

    const handleResize = () => {
}
      // Detect virtual keyboard by comparing viewport height
      const windowHeight = window.innerHeight;
      const screenHeight = window.screen.height;
      const threshold = screenHeight * 0.75; // 75% of screen height
      
      setIsKeyboardOpen(windowHeight < threshold);
    };

    const handleVisualViewport = () => {
}
      if (&apos;visualViewport&apos; in window) {
}
        const viewport = window.visualViewport as any;
        const initialHeight = window.innerHeight;
        setIsKeyboardOpen(viewport.height < initialHeight * 0.75);
    }
  };

    window.addEventListener(&apos;resize&apos;, handleResize);
    if (&apos;visualViewport&apos; in window && window.visualViewport) {
}
      window.visualViewport.addEventListener(&apos;resize&apos;, handleVisualViewport);

    return () => {
}
      window.removeEventListener(&apos;resize&apos;, handleResize);
      if (&apos;visualViewport&apos; in window && window.visualViewport) {
}
        window.visualViewport.removeEventListener(&apos;resize&apos;, handleVisualViewport);

    };
  }, [isMobile]);

  // Add viewport meta tag for better mobile support
  useEffect(() => {
}
    const viewportMeta = document.querySelector(&apos;meta[name="viewport"]&apos;);
    if (viewportMeta) {
}
      viewportMeta.setAttribute(
        &apos;content&apos;,
        &apos;width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover&apos;
      );
    }
  }, []);

  const getLayoutClasses = () => {
}
    const baseClasses = &apos;min-h-screen bg-gray-900 text-white relative&apos;;
    
    if (isMobile) {
}
      return `${baseClasses} ${showNavigation ? &apos;pb-20&apos; : &apos;&apos;} ${isKeyboardOpen ? &apos;keyboard-open&apos; : &apos;&apos;}`;

    if (isTablet) {
}
      return `${baseClasses} ${showNavigation ? &apos;pt-16&apos; : &apos;&apos;}`;

    return baseClasses;
  };

  const getContentClasses = () => {
}
    const baseClasses = &apos;relative z-10&apos;;
    
    if (isMobile) {
}
      return `${baseClasses} safe-area-content mobile-content`;

    return baseClasses;
  };

  return (
    <div className={`${getLayoutClasses()} ${className}`}>
      {/* Safe area top spacing for mobile devices */}
      {isMobile && (
}
        <div 
          className="safe-area-top bg-gray-900 sm:px-4 md:px-6 lg:px-8" 
          style={{ height: &apos;env(safe-area-inset-top)&apos; }}
        />
      )}

      {/* Main content area */}
      <motion.main
        className={getContentClasses()}
        style={{
}
          paddingLeft: isMobile ? &apos;env(safe-area-inset-left)&apos; : undefined,
          paddingRight: isMobile ? &apos;env(safe-area-inset-right)&apos; : undefined,
          minHeight: isMobile ? &apos;calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))&apos; : &apos;100vh&apos;
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>

      {/* Mobile Navigation */}
      {showNavigation && (isMobile || isTablet) && (
}
        <MobileNavigation>
          activeView={activeView}
          onViewChange={onViewChange}
          notificationCount={notificationCount}
          className={isKeyboardOpen ? &apos;hidden&apos; : &apos;&apos;}
        />
      )}

      {/* PWA Install Prompt */}
      {showPWAPrompt && isMobile && (
}
        <PWAInstallPrompt>
          className={isKeyboardOpen ? &apos;hidden&apos; : &apos;&apos;}
        />
      )}
    </div>
  );
};

const MobileLayoutWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <MobileLayout {...props} />
  </ErrorBoundary>
);

export default React.memo(MobileLayoutWithErrorBoundary);
