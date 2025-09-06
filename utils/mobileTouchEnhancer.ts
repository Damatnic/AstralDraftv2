// Enhanced Mobile Touch Interactions
export interface TouchEnhancerConfig {
  tapDebounceMs?: number;
  longPressMs?: number;
  swipeThreshold?: number;
  hapticFeedback?: boolean;
  preventDoubleTouch?: boolean;}

export class MobileTouchEnhancer {
  private static instance: MobileTouchEnhancer;
  private config: Required<TouchEnhancerConfig>;
  private touchStartTime = 0;
  private touchStartPosition = { x: 0, y: 0 };
  private lastTapTime = 0;
  private isLongPressActive = false;
  private longPressTimer: NodeJS.Timeout | null = null;

  private constructor(config: TouchEnhancerConfig = {}) {
    this.config = {
      tapDebounceMs: 150,
      longPressMs: 500,
      swipeThreshold: 50,
      hapticFeedback: true,
      preventDoubleTouch: true,
      ...config
    };

    this.initializeGlobalListeners();
  }

  static getInstance(config?: TouchEnhancerConfig): MobileTouchEnhancer {
    if (!MobileTouchEnhancer.instance) {
      MobileTouchEnhancer.instance = new MobileTouchEnhancer(config);
    }
    return MobileTouchEnhancer.instance;
  }

  private initializeGlobalListeners(): void {
    if (typeof window === 'undefined') return;

    // Enhanced touch handling for all interactive elements
    document.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    document.addEventListener('touchend', this.handleTouchEnd, { passive: false });
    document.addEventListener('touchcancel', this.handleTouchCancel);
    
    // Prevent iOS bounce on body
    document.body.addEventListener('touchmove', (e: any) => {
      if ((e.target as Element)?.closest('.scrollable') === null) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  private handleTouchStart = (e: TouchEvent): void => {
    const touch = e.touches[0];
    const target = e.target as Element;
    
    this.touchStartTime = Date.now();
    this.touchStartPosition = { x: touch.clientX, y: touch.clientY };
    
    // Add visual feedback immediately
    if (this.isInteractiveElement(target)) {
      this.addTouchFeedback(target);
      
      // Haptic feedback for supported devices
      if (this.config.hapticFeedback && 'vibrate' in navigator) {
        navigator.vibrate(10);
      }
      
      // Set up long press detection
      this.longPressTimer = setTimeout(() => {
        this.handleLongPress(target, touch);
      }, this.config.longPressMs);
    }
  };

  private handleTouchEnd = (e: TouchEvent): void => {
    const touch = e.changedTouches[0];
    const target = e.target as Element;
    const touchDuration = Date.now() - this.touchStartTime;
    const currentTime = Date.now();
    
    // Clear long press timer
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
    
    // Remove visual feedback
    this.removeTouchFeedback(target);
    
    // Check for double tap prevention
    if (this.config.preventDoubleTouch) {
      const timeSinceLastTap = currentTime - this.lastTapTime;
      if (timeSinceLastTap < this.config.tapDebounceMs) {
        e.preventDefault();
        return;
      }
      this.lastTapTime = currentTime;
    }
    
    // Calculate swipe distance
    const deltaX = touch.clientX - this.touchStartPosition.x;
    const deltaY = touch.clientY - this.touchStartPosition.y;
    const swipeDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Handle swipe vs tap
    if (swipeDistance > this.config.swipeThreshold) {
      this.handleSwipe(target, deltaX, deltaY);
    } else if (touchDuration < this.config.longPressMs && !this.isLongPressActive) {
      this.handleTap(target, touch);
    }
    
    this.isLongPressActive = false;
  };

  private handleTouchCancel = (e: TouchEvent): void => {
    const target = e.target as Element;
    this.removeTouchFeedback(target);
    
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
    
    this.isLongPressActive = false;
  };

  private handleTap(target: Element, touch: Touch): void {
    // Enhanced tap handling with better targeting
    const rect = target.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    
    // Dispatch custom tap event with precise coordinates
    const tapEvent = new CustomEvent('enhancedTap', {
      detail: { x: touchX, y: touchY, timestamp: Date.now() },
      bubbles: true
    });
    
    target.dispatchEvent(tapEvent);
  }

  private handleLongPress(target: Element, touch: Touch): void {
    this.isLongPressActive = true;
    
    // Stronger haptic feedback for long press
    if (this.config.hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate([20, 10, 20]);
    }
    
    // Add long press visual feedback
    target.classList.add('touch-long-press');
    
    const longPressEvent = new CustomEvent('enhancedLongPress', {
      detail: { x: touch.clientX, y: touch.clientY, timestamp: Date.now() },
      bubbles: true
    });
    
    target.dispatchEvent(longPressEvent);
  }

  private handleSwipe(target: Element, deltaX: number, deltaY: number): void {
    const direction = this.getSwipeDirection(deltaX, deltaY);
    
    const swipeEvent = new CustomEvent('enhancedSwipe', {
      detail: {
        direction, 
        deltaX, 
        deltaY, 
        distance: Math.sqrt(deltaX * deltaX + deltaY * deltaY),
        timestamp: Date.now()
      },
      bubbles: true
    });
    
    target.dispatchEvent(swipeEvent);
  }

  private getSwipeDirection(deltaX: number, deltaY: number): string {
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    
    if (absDeltaX > absDeltaY) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  }

  private isInteractiveElement(target: Element): boolean {
    const interactiveTags = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'];
    const interactiveRoles = ['button', 'link', 'tab', 'menuitem'];
    const interactiveClasses = ['mobile-touch-target', 'interactive', 'clickable'];
    
    return (
      interactiveTags.includes(target.tagName) ||
      interactiveRoles.includes(target.getAttribute('role') || '') ||
      interactiveClasses.some((cls: any) => target.classList.contains(cls)) ||
      target.hasAttribute('onclick') ||
      target.hasAttribute('data-interactive')
    );
  }

  private addTouchFeedback(target: Element): void {
    target.classList.add('touch-active');
    
    // Add ripple effect for enhanced visual feedback
    const ripple = document.createElement('div');
    ripple.className = 'touch-ripple';
    target.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 300);
  }

  private removeTouchFeedback(target: Element): void {
    target.classList.remove('touch-active', 'touch-long-press');
  }

  // Public methods for custom implementations
  public enableHapticFeedback(enabled: boolean): void {
    this.config.hapticFeedback = enabled;
  }

  public updateConfig(newConfig: Partial<TouchEnhancerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  public addCustomTouchHandler(
    element: Element,
    handlers: {
      onTap?: (e: CustomEvent) => void;
      onLongPress?: (e: CustomEvent) => void;
      onSwipe?: (e: CustomEvent) => void;
    }
  ): void {
    if (handlers.onTap) {
      element.addEventListener('enhancedTap', handlers.onTap);
    }
    if (handlers.onLongPress) {
      element.addEventListener('enhancedLongPress', handlers.onLongPress);
    }
    if (handlers.onSwipe) {
      element.addEventListener('enhancedSwipe', handlers.onSwipe);
    }
    
    // Mark element as having custom handlers
    element.setAttribute('data-interactive', 'true');
  }
}

// Initialize the enhancer
export const touchEnhancer = MobileTouchEnhancer.getInstance();

// React hook for easy integration
export const useTouchEnhancer = (
  ref: React.RefObject<HTMLElement>,
  handlers?: {
    onTap?: (e: CustomEvent) => void;
    onLongPress?: (e: CustomEvent) => void;
    onSwipe?: (e: CustomEvent) => void;
  }
) => {
  React.useEffect(() => {
    const element = ref.current;
    if (!element || !handlers) return;
    
    touchEnhancer.addCustomTouchHandler(element, handlers);
    
    // Cleanup is handled by the global listeners
  }, [ref, handlers]);
};

export default touchEnhancer;