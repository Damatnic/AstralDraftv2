import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useMemo, useState, useRef } from 'react';
import { useAdvancedTouchGestures } from '../../hooks/useAdvancedTouchGestures';

interface GestureExampleComponentProps {
  className?: string;

}

export const GestureExampleComponent: React.FC<GestureExampleComponentProps> = ({ 
  className = '' 
}) => {
  const [gestureLog, setGestureLog] = useState<string[]>([]);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const addToLog = (message: string) => {
    setGestureLog(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onLongPress,
    onDoubleTap,
    onPinch,
    touchHandlers,
    isGestureActive,
    gestureState
  } = useAdvancedTouchGestures({
    swipe: {
      threshold: 30,
      velocityThreshold: 0.3,
      direction: 'all',
      preventScroll: true
    },
    longPress: {
      threshold: 10,
      duration: 800
    },
    doubleTap: {
      threshold: 30,
      delay: 300
    },
    pinch: {
      threshold: 1.1,
      preventZoom: true

  });

  // Set up gesture callbacks
  React.useEffect(() => {
    onSwipeLeft(() => {
      addToLog('Swiped Left');
      setPosition(prev => ({ ...prev, x: prev.x - 50 }));
    });

    onSwipeRight(() => {
      addToLog('Swiped Right');
      setPosition(prev => ({ ...prev, x: prev.x + 50 }));
    });

    onSwipeUp(() => {
      addToLog('Swiped Up');
      setPosition(prev => ({ ...prev, y: prev.y - 50 }));
    });

    onSwipeDown(() => {
      addToLog('Swiped Down');
      setPosition(prev => ({ ...prev, y: prev.y + 50 }));
    });

    onLongPress((point: any) => {
      addToLog(`Long Press at (${Math.round(point.x)}, ${Math.round(point.y)})`);
      setPosition({ x: 0, y: 0 });
      setScale(1);
    });

    onDoubleTap((point: any) => {
      addToLog(`Double Tap at (${Math.round(point.x)}, ${Math.round(point.y)})`);
      setScale(prev => prev === 1 ? 1.5 : 1);
    });

    onPinch((newScale, center) => {
      addToLog(`Pinch Scale: ${newScale.toFixed(2)}`);
      setScale(newScale);
    });
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onLongPress, onDoubleTap, onPinch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 sm:px-4 md:px-6 lg:px-8"></div>
        <span className="ml-2 sm:px-4 md:px-6 lg:px-8">Loading...</span>
      </div>
    );

  return (
    <div className={`gesture-example-container ${className}`}>
      <div className="gesture-header mb-4 sm:px-4 md:px-6 lg:px-8">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 sm:px-4 md:px-6 lg:px-8">
          Advanced Touch Gestures Demo
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">
          Try swiping, long press, double tap, or pinch gestures
        </p>
      </div>

      {/* Gesture Status */}
      <div className="gesture-status mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
          <span className="text-sm font-medium sm:px-4 md:px-6 lg:px-8">
            Status: {isGestureActive ? '🤏 Active' : '⚪ Idle'}
          </span>
          <span className="text-sm sm:px-4 md:px-6 lg:px-8">
            Distance: {Math.round(gestureState.distance)}px
          </span>
        </div>
        {gestureState.direction && (
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 sm:px-4 md:px-6 lg:px-8">
            Direction: {gestureState.direction} | 
            Velocity: {gestureState.velocity.toFixed(2)}px/ms
          </div>
        )}
      </div>

      {/* Interactive Area */}
      <div
        ref={containerRef}
        {...touchHandlers}
        className="gesture-area relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 
                   border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-xl 
                   h-64 overflow-hidden touch-none select-none sm:px-4 md:px-6 lg:px-8"
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          touchAction: 'none'
        }}
      >
        {/* Moveable Element */}
        <div
          className="absolute top-1/2 left-1/2 w-12 h-12 bg-blue-500 rounded-full 
                     flex items-center justify-center text-white font-bold 
                     transition-transform duration-200 shadow-lg sm:px-4 md:px-6 lg:px-8"
          style={{
            transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${scale})`
          }}
        >
          🎯
        </div>

        {/* Gesture Instructions */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none sm:px-4 md:px-6 lg:px-8">
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm sm:px-4 md:px-6 lg:px-8">
            <div>Swipe to move • Long press to reset</div>
            <div>Double tap to zoom • Pinch to scale</div>
          </div>
        </div>
      </div>

      {/* Gesture Log */}
      <div className="gesture-log mt-4 sm:px-4 md:px-6 lg:px-8">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">
          Gesture Log:
        </h4>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 min-h-[80px] max-h-[120px] overflow-y-auto sm:px-4 md:px-6 lg:px-8">
          {gestureLog.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm italic sm:px-4 md:px-6 lg:px-8">
              Perform gestures to see activity...
            </p>
          ) : (
            <div className="space-y-1 sm:px-4 md:px-6 lg:px-8">
              {gestureLog.map((entry, index) => (
                <div key={`${entry}-${index}`} className="text-xs font-mono text-gray-600 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">
                  {entry}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={() = aria-label="Action button"> {
          setPosition({ x: 0, y: 0 });
          setScale(1);
          setGestureLog([]);
          addToLog('Reset');
        }}
        className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium 
                   rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 
                   focus:ring-blue-500 focus:ring-offset-2 sm:px-4 md:px-6 lg:px-8"
      >
        Reset Demo
      </button>
    </div>
  );
};

const GestureExampleComponentWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <GestureExampleComponent {...props} />
  </ErrorBoundary>
);

export default React.memo(GestureExampleComponentWithErrorBoundary);
