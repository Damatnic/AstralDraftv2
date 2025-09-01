/**
 * Mobile Touch System - Advanced Touch Interactions and Gestures
 * Professional mobile-first design with haptic feedback, gestures, and accessibility
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useMemo, useState, useRef, useEffect, ReactNode, TouchEvent, MouseEvent } from 'react';
import { motion, PanInfo, useMotionValue, useTransform, animate } from 'framer-motion';

// =========================================
// TYPES & INTERFACES
// =========================================

interface TouchFeedbackOptions {
  haptic?: boolean;
  visual?: boolean;
  audio?: boolean;
  intensity?: 'light' | 'medium' | 'heavy';

}

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;

interface GestureConfig {
  threshold?: number;
  velocity?: number;
  preventDefaultTouches?: boolean;
  enablePinch?: boolean;
  enableRotate?: boolean;

// =========================================
// HAPTIC FEEDBACK SYSTEM
// =========================================

}

export class HapticManager {
  private static instance: HapticManager;
  private isSupported: boolean;
  private isEnabled: boolean = true;

  constructor() {
    this.isSupported = 'vibrate' in navigator;

  static getInstance(): HapticManager {
    if (!HapticManager.instance) {
      HapticManager.instance = new HapticManager();

    return HapticManager.instance;

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;

  trigger(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error'): void {
    if (!this.isSupported || !this.isEnabled) return;

    const patterns = {
  const [isLoading, setIsLoading] = React.useState(false);
      light: [10],
      medium: [50],
      heavy: [100],
      success: [50, 50, 50],
      warning: [100, 50, 100],
      error: [100, 100, 100]
    };

    navigator.vibrate(patterns[type]);

  async triggerPattern(pattern: number[]): Promise<void> {
    if (!this.isSupported || !this.isEnabled) return;
    navigator.vibrate(pattern);


export const haptic = HapticManager.getInstance();

// =========================================
// ENHANCED TOUCH BUTTON
// =========================================

interface TouchButtonProps {
  children: ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  feedback?: TouchFeedbackOptions;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  rippleColor?: string;
  pressScale?: number;
  longPressDuration?: number;

}

export const TouchButton: React.FC<TouchButtonProps> = ({
  children,
  onPress,
  onLongPress,
  feedback = { haptic: true, visual: true, intensity: 'medium' },
  disabled = false,
  className = '',
  style = {},
  rippleColor = 'rgba(255, 255, 255, 0.3)',
  pressScale = 0.95,
  longPressDuration = 500
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const pressTimer = useRef<NodeJS.Timeout>();
  const longPressTriggered = useRef(false);

  const handleTouchStart = (e: TouchEvent) => {
    if (disabled) return;
    
    setIsPressed(true);
    longPressTriggered.current = false;

    if (feedback.haptic) {
      haptic.trigger(feedback.intensity || 'medium');

    if (feedback.visual) {
      const touch = e.touches[0];
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      const id = Date.now();

      setRipples(prev => [...prev, { id, x, y }]);
      setTimeout(() => {
        setRipples(prev => prev.filter((ripple: any) => ripple.id !== id));
      }, 600);

    if (onLongPress) {
      pressTimer.current = setTimeout(() => {
        longPressTriggered.current = true;
        haptic.trigger('heavy');
        onLongPress();
      }, longPressDuration);

  };

  const handleTouchEnd = () => {
    if (disabled) return;
    
    setIsPressed(false);

    if (pressTimer.current) {
      clearTimeout(pressTimer.current);

    if (onPress && !longPressTriggered.current) {
      onPress();

  };

  const handleMouseDown = (e: MouseEvent) => {
    if (disabled) return;
    
    setIsPressed(true);
    longPressTriggered.current = false;

    if (feedback.visual) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();

      setRipples(prev => [...prev, { id, x, y }]);
      setTimeout(() => {
        setRipples(prev => prev.filter((ripple: any) => ripple.id !== id));
      }, 600);

    if (onLongPress) {
      pressTimer.current = setTimeout(() => {
        longPressTriggered.current = true;
        onLongPress();
      }, longPressDuration);

  };

  const handleMouseUp = () => {
    if (disabled) return;
    
    setIsPressed(false);

    if (pressTimer.current) {
      clearTimeout(pressTimer.current);

    if (onPress && !longPressTriggered.current) {
      onPress();

  };

  useEffect(() => {
    return () => {
      if (pressTimer.current) {
        clearTimeout(pressTimer.current);

    };
  }, []);

  return (
    <motion.button
      className={`
        relative overflow-hidden outline-none select-none
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      style={style}
      disabled={disabled}
      onTouchStart={handleTouchStart}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      animate={{
        scale: isPressed ? pressScale : 1
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
    >
      {children}
      
      {/* Ripple Effects */}
      {ripples.map((ripple: any) => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full pointer-events-none sm:px-4 md:px-6 lg:px-8"
          style={{
            left: ripple.x,
            top: ripple.y,
            backgroundColor: rippleColor
          }}
          initial={{ width: 0, height: 0, opacity: 0.7 }}
          animate={{ 
            width: 200, 
            height: 200, 
            opacity: 0,
            x: -100,
            y: -100
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </motion.button>
  );
};

// =========================================
// SWIPE GESTURE HANDLER
// =========================================

interface SwipeGestureProps {
  children: ReactNode;
  handlers?: SwipeHandlers;
  config?: GestureConfig;
  className?: string;

}

export const SwipeGesture: React.FC<SwipeGestureProps> = ({
  children,
  handlers = {},
  config = {},
  className = ''
}) => {
  const {
    threshold = 50,
    velocity = 0.3,
    preventDefaultTouches = true
  } = config;

  const handlePan = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity: vel } = info;

    // Check if movement meets threshold and velocity requirements
    if (Math.abs(offset.x) > threshold && Math.abs(vel.x) > velocity) {
      if (offset.x > 0 && handlers.onSwipeRight) {
        haptic.trigger('light');
        handlers.onSwipeRight();
      } else if (offset.x < 0 && handlers.onSwipeLeft) {
        haptic.trigger('light');
        handlers.onSwipeLeft();


    if (Math.abs(offset.y) > threshold && Math.abs(vel.y) > velocity) {
      if (offset.y > 0 && handlers.onSwipeDown) {
        haptic.trigger('light');
        handlers.onSwipeDown();
      } else if (offset.y < 0 && handlers.onSwipeUp) {
        haptic.trigger('light');
        handlers.onSwipeUp();


  };

  return (
    <motion.div
      className={className}
      drag
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      dragElastic={0.1}
      onPanEnd={handlePan}
      style={{
        touchAction: preventDefaultTouches ? 'none' : 'auto'
      }}
    >
      {children}
    </motion.div>
  );
};

// =========================================
// PULL TO REFRESH
// =========================================

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
  className?: string;
  refreshIndicator?: ReactNode;

}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  threshold = 100,
  className = '',
  refreshIndicator
}: any) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, threshold], [0, 1]);
  const scale = useTransform(y, [0, threshold], [0.8, 1]);

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 0 && window.scrollY === 0) {
      setPullDistance(info.offset.y);

  };

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > threshold && !isRefreshing && window.scrollY === 0) {
      setIsRefreshing(true);
      haptic.trigger('success');
      
      try {

        await onRefresh();
      
    `relative ${className}`}>
      {showValue && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 sm:px-4 md:px-6 lg:px-8">
          <motion.div
            className="bg-dark-800 text-white px-2 py-1 rounded text-xs font-medium sm:px-4 md:px-6 lg:px-8"
            animate={{ scale: isDragging ? 1.1 : 1 }}
          >
            {value}
          </motion.div>
        </div>
      )}
      
      <div
        ref={constraintsRef}
        className={`relative h-6 bg-glass-light rounded-full ${trackClassName}`}
      >
        {/* Progress Track */}
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full sm:px-4 md:px-6 lg:px-8"
          style={{ width: `${percentage}%` }}
        />
        
        {/* Thumb */}
        <motion.div
          className={`
            absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2
            w-6 h-6 bg-white rounded-full shadow-lg cursor-pointer
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${thumbClassName}
          `}
          style={{ left: `${percentage}%` }}
          drag="x"
          dragConstraints={constraintsRef}
          dragElastic={0}
          dragMomentum={false}
          onDrag={handleDrag}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          whileDrag={{ scale: 1.2 }}
          animate={{ scale: isDragging ? 1.2 : 1 }}
        />
      </div>
    </div>
  );
};

// =========================================
// TOUCH CARD STACK
// =========================================

interface TouchCardStackProps {
  children: ReactNode[];
  onSwipe?: (direction: 'left' | 'right', index: number) => void;
  className?: string;

}

export const TouchCardStack: React.FC<TouchCardStackProps> = ({
  children,
  onSwipe,
  className = ''
}: any) => {
  const [cards, setCards] = useState(children.map((child, index) => ({ child, id: index })));

  const handleSwipe = (direction: 'left' | 'right', cardId: number) => {
    setCards(prev => prev.filter((card: any) => card.id !== cardId));
    onSwipe?.(direction, cardId);
    haptic.trigger('medium');
  };

  return (
    <div className={`relative ${className}`} style={{ height: '400px' }}>
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          className="absolute inset-0 sm:px-4 md:px-6 lg:px-8"
          initial={{ scale: 1 - index * 0.05, y: index * 10, z: -index }}
          animate={{ scale: 1 - index * 0.05, y: index * 10, z: -index }}
          drag="x"
          dragConstraints={{ left: -200, right: 200 }}
          onDragEnd={(event, info) => {
            const threshold = 100;
            if (info.offset.x > threshold) {
              handleSwipe('right', card.id);
            } else if (info.offset.x < -threshold) {
              handleSwipe('left', card.id);

          }}
          style={{
            zIndex: cards.length - index
          }}
        >
          {card.child}
        </motion.div>
      ))}
    </div>
  );
};

// =========================================
// MOBILE SCROLL UTILITIES
// =========================================

export const useMobileScroll = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  
  const lastScrollY = useRef(0);
  const scrollTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setIsScrolling(true);
      setScrollPosition(currentScrollY);
      
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection('up');

      lastScrollY.current = currentScrollY;

      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);

      scrollTimer.current = setTimeout(() => {
        setIsScrolling(false);
        setScrollDirection(null);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);

    };
  }, []);

  return {
    isScrolling,
    scrollPosition,
    scrollDirection
  };
};

// =========================================
// TOUCH SAFE AREA
// =========================================

export const useSafeArea = () => {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  });

  useEffect(() => {
    const updateSafeArea = () => {
      if ('CSS' in window && 'supports' in window.CSS) {
        const supportsEnv = window.CSS.supports('top: env(safe-area-inset-top)');
        
        if (supportsEnv) {
          const getEnvValue = (property: string) => {
            const div = document.createElement('div');
            div.style.cssText = `position: fixed; top: env(${property}); visibility: hidden;`;
            document.body.appendChild(div);
            const value = parseInt(getComputedStyle(div).top) || 0;
            document.body.removeChild(div);
            return value;
          };

          setSafeArea({
            top: getEnvValue('safe-area-inset-top'),
            bottom: getEnvValue('safe-area-inset-bottom'),
            left: getEnvValue('safe-area-inset-left'),
            right: getEnvValue('safe-area-inset-right')
          });


    };

    updateSafeArea();
    window.addEventListener('orientationchange', updateSafeArea);
    
    return () => {
      window.removeEventListener('orientationchange', updateSafeArea);
    };
  }, []);

  return safeArea;
};

// =========================================
// EXPORTS
// =========================================

export default {
  TouchButton,
  SwipeGesture,
  PullToRefresh,
  TouchSlider,
  TouchCardStack,
  HapticManager,
  haptic,
  useMobileScroll,
  useSafeArea
};