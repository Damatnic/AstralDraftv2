/**
 * Mobile Optimized Container Component
 * Provides touch gestures, mobile-friendly interactions, and responsive design
 */

import React, { useEffect, useState, useRef } from 'react';
import { useAdvancedTouchGestures } from '../../hooks/useAdvancedTouchGestures';

interface MobileOptimizedContainerProps {
  children: React.ReactNode;
  className?: string;
  enableSwipeNavigation?: boolean;
  enablePullToRefresh?: boolean;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onPullToRefresh?: () => Promise<void>;
}

const MobileOptimizedContainer: React.FC<MobileOptimizedContainerProps> = ({
  children,
  className = '',
  enableSwipeNavigation = false,
  enablePullToRefresh = false,
  onSwipeLeft,
  onSwipeRight,
  onPullToRefresh
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768;
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Touch gesture handling
  const touchGestures = useAdvancedTouchGestures({
    swipe: {
      threshold: 50,
      velocityThreshold: 0.3,
      direction: 'horizontal'
    },
    longPress: {
      duration: 300
    }
  });

  // Set up swipe navigation
  useEffect(() => {
    if (enableSwipeNavigation && isMobile) {
      touchGestures.onSwipeLeft((gesture) => {
        if (onSwipeLeft && gesture.velocity > 0.5) {
          // Add haptic feedback if available
          if ('vibrate' in navigator) {
            navigator.vibrate(10);
          }
          onSwipeLeft();
        }
      });

      touchGestures.onSwipeRight((gesture) => {
        if (onSwipeRight && gesture.velocity > 0.5) {
          // Add haptic feedback if available
          if ('vibrate' in navigator) {
            navigator.vibrate(10);
          }
          onSwipeRight();
        }
      });
    }
  }, [enableSwipeNavigation, isMobile, onSwipeLeft, onSwipeRight, touchGestures]);

  // Pull to refresh handling
  const handleTouchStart = (_e: React.TouchEvent) => {
    if (!enablePullToRefresh || !isMobile) return;
    
    // Only trigger if at top of page
    if (window.scrollY === 0) {
      setPullDistance(0);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!enablePullToRefresh || !isMobile || isRefreshing) return;
    
    const touch = e.touches[0];
    const currentY = touch.clientY;
    
    // Calculate pull distance
    if (window.scrollY === 0) {
      const distance = Math.max(0, currentY - (window.innerHeight * 0.1));
      setPullDistance(Math.min(distance, 100));
      
      // Prevent default scrolling if pulling down
      if (distance > 0) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = async () => {
    if (!enablePullToRefresh || !isMobile || isRefreshing) return;
    
    if (pullDistance > 60 && onPullToRefresh) {
      setIsRefreshing(true);
      
      // Add haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([20, 10, 20]);
      }
      
      try {
        await onPullToRefresh();
      } catch (error) {
        console.error('Pull to refresh failed:', error);
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`
        mobile-optimized-container
        ${isMobile ? 'mobile-touch-enabled' : ''}
        ${className}
      `}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: pullDistance > 0 ? `translateY(${pullDistance * 0.5}px)` : undefined,
        transition: isRefreshing || pullDistance === 0 ? 'transform 0.3s ease-out' : 'none'
      }}
    >
      {/* Pull to refresh indicator */}
      {enablePullToRefresh && pullDistance > 20 && (
        <div 
          className="pull-to-refresh-indicator fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-blue-600 text-white py-2"
          style={{
            opacity: Math.min(pullDistance / 60, 1),
            transform: `translateY(${Math.max(-40, -40 + pullDistance)}px)`
          }}
        >
          {isRefreshing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Refreshing...
            </>
          ) : pullDistance > 60 ? (
            '🔄 Release to refresh'
          ) : (
            '↓ Pull to refresh'
          )}
        </div>
      )}
      
      {/* Main content */}
      <div className={`
        ${isMobile ? 'mobile-content' : 'desktop-content'}
        ${isRefreshing ? 'pointer-events-none' : ''}
      `}>
        {children}
      </div>
    </div>
  );
};

export default MobileOptimizedContainer;
