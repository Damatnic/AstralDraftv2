import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useState, useRef, useEffect } from 'react';
import { useAdvancedTouchGestures } from '../../hooks/useAdvancedTouchGestures';

interface MobileGestureNavigationProps {
  onNavigate?: (direction: 'left' | 'right' | 'up' | 'down') => void;
  onMenuToggle?: () => void;
  onQuickAction?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const MobileGestureNavigation: React.FC<MobileGestureNavigationProps> = ({
  onNavigate,
  onMenuToggle,
  onQuickAction,
  className = '',
//   children
}: any) => {
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackPosition, setFeedbackPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showFeedback = (text: string, x: number, y: number) => {
    setFeedbackText(text);
    setFeedbackPosition({ x, y });
    setFeedbackVisible(true);
    
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);

    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedbackVisible(false);
    }, 1500);
  };

  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onLongPress,
    onDoubleTap,
    touchHandlers,
    isGestureActive,
//     gestureState
  } = useAdvancedTouchGestures({
    swipe: {
      threshold: 50,
      velocityThreshold: 0.4,
      direction: 'all',
      preventScroll: false
    },
    longPress: {
      threshold: 15,
      duration: 600
    },
    doubleTap: {
      threshold: 40,
      delay: 400

  });

  // Set up gesture callbacks
  useEffect(() => {
    onSwipeLeft((gesture: any) => {
      if (gesture.startPoint) {
        showFeedback('← Swipe Left', gesture.startPoint.x, gesture.startPoint.y);
        onNavigate?.('left');

    });

    onSwipeRight((gesture: any) => {
      if (gesture.startPoint) {
        showFeedback('Swipe Right →', gesture.startPoint.x, gesture.startPoint.y);
        onNavigate?.('right');

    });

    onSwipeUp((gesture: any) => {
      if (gesture.startPoint) {
        showFeedback('↑ Swipe Up', gesture.startPoint.x, gesture.startPoint.y);
        onNavigate?.('up');

    });

    onSwipeDown((gesture: any) => {
      if (gesture.startPoint) {
        showFeedback('↓ Swipe Down', gesture.startPoint.x, gesture.startPoint.y);
        onNavigate?.('down');

    });

    onLongPress((point: any) => {
      showFeedback('📱 Menu', point.x, point.y);
      onMenuToggle?.();
      
      // Haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(50);

    });

    onDoubleTap((point: any) => {
      showFeedback('⚡ Quick Action', point.x, point.y);
      onQuickAction?.();
      
      // Haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate([25, 25, 25]);

    });
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onLongPress, onDoubleTap, onNavigate, onMenuToggle, onQuickAction]);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);

    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 sm:px-4 md:px-6 lg:px-8"></div>
        <span className="ml-2 sm:px-4 md:px-6 lg:px-8">Loading...</span>
      </div>
    );

  return (
    <div 
      ref={containerRef}
      {...touchHandlers}
      className={`mobile-gesture-navigation relative ${className}`}
      style={{
        touchAction: 'pan-x pan-y', // Allow some scrolling while capturing gestures
      }}
    >
      {/* Visual feedback for active gestures */}
      {isGestureActive && gestureState.startPoint && (
        <div 
          className="absolute pointer-events-none z-50 w-2 h-2 bg-blue-500 rounded-full opacity-60 sm:px-4 md:px-6 lg:px-8"
          style={{
            left: gestureState.startPoint.x - 4,
            top: gestureState.startPoint.y - 4,
            transform: 'scale(1.5)',
            transition: 'transform 0.1s ease-out'
          }}
        />
      )}

      {/* Gesture direction indicator */}
      {isGestureActive && gestureState.direction && gestureState.distance > 20 && (
        <div 
          className="absolute pointer-events-none z-50 text-white bg-gray-800 bg-opacity-75 
                     px-2 py-1 rounded text-xs font-medium sm:px-4 md:px-6 lg:px-8"
          style={{
            left: gestureState.currentPoint?.x || 0,
            top: (gestureState.currentPoint?.y || 0) - 30,
            transform: 'translateX(-50%)'
          }}
        >
          {gestureState.direction === 'left' && '←'}
          {gestureState.direction === 'right' && '→'}
          {gestureState.direction === 'up' && '↑'}
          {gestureState.direction === 'down' && '↓'}
          {Math.round(gestureState.distance)}px
        </div>
      )}

      {/* Gesture feedback popup */}
      {feedbackVisible && (
        <div 
          className="absolute pointer-events-none z-50 bg-gray-900 text-white px-3 py-2 
                     rounded-lg text-sm font-medium shadow-lg animate-pulse sm:px-4 md:px-6 lg:px-8"
          style={{
            left: feedbackPosition.x,
            top: feedbackPosition.y - 50,
            transform: 'translateX(-50%)',
            animation: 'fadeInOut 1.5s ease-in-out'
          }}
        >
          {feedbackText}
          <div 
            className="absolute top-full left-1/2 transform -translate-x-1/2 
                       border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 sm:px-4 md:px-6 lg:px-8"
          />
        </div>
      )}

      {/* Content */}
      {children}

      {/* Gesture hints overlay (only shown when no children) */}
      {!children && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900 
                       border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg sm:px-4 md:px-6 lg:px-8">
          <div className="text-center text-gray-500 dark:text-gray-400 p-8 sm:px-4 md:px-6 lg:px-8">
            <div className="text-2xl mb-4 sm:px-4 md:px-6 lg:px-8">📱</div>
            <h3 className="text-lg font-semibold mb-3 sm:px-4 md:px-6 lg:px-8">Mobile Gestures Active</h3>
            <div className="space-y-2 text-sm sm:px-4 md:px-6 lg:px-8">
              <div>← → ↑ ↓ <span className="font-medium sm:px-4 md:px-6 lg:px-8">Swipe to navigate</span></div>
              <div>📱 <span className="font-medium sm:px-4 md:px-6 lg:px-8">Long press for menu</span></div>
              <div>⚡ <span className="font-medium sm:px-4 md:px-6 lg:px-8">Double tap for quick action</span></div>
            </div>
            <div className="mt-4 text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
              Velocity: {gestureState.velocity.toFixed(2)}px/ms
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateX(-50%) scale(0.8); }
          20% { opacity: 1; transform: translateX(-50%) scale(1.1); }
          80% { opacity: 1; transform: translateX(-50%) scale(1); }
          100% { opacity: 0; transform: translateX(-50%) scale(0.9); }

      `}</style>
    </div>
  );
};

const MobileGestureNavigationWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <MobileGestureNavigation {...props} />
  </ErrorBoundary>
);

export default React.memo(MobileGestureNavigationWithErrorBoundary);
