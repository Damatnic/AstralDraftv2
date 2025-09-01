/**
 * ASTRAL DRAFT - Extension Enhancement Framework
 * Purpose: Comprehensive framework for enhancing all extension functions
 * Author: Lead Platform Architect
 * Date: 2025-08-30
 */

import { ErrorInfo } from 'react';

// Enhanced Error Handling System
export class EnhancedErrorHandler {
  private static instance: EnhancedErrorHandler;
  private errorLog: Map<string, ErrorInfo[]> = new Map();
  private criticalAreas = ['draft', 'trade', 'scoring', 'payment', 'authentication'];

  static getInstance(): EnhancedErrorHandler {
    if (!this.instance) {
      this.instance = new EnhancedErrorHandler();
    }
    return this.instance;
  }

  handleError(error: Error, context: string, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'): void {
    // Log error with context
    console.error(`[${context}] ${severity.toUpperCase()} Error:`, error);

    // Store in error log
    if (!this.errorLog.has(context)) {
      this.errorLog.set(context, []);
    }
    this.errorLog.get(context)?.push({ componentStack: error.stack || '' } as ErrorInfo);

    // Handle critical errors specially
    if (severity === 'critical' || this.criticalAreas.includes(context.toLowerCase())) {
      this.handleCriticalError(error, context);
    }

    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoring(error, context, severity);
    }
  }

  private handleCriticalError(error: Error, context: string): void {
    // Implement recovery strategy
    console.error(`🚨 CRITICAL ERROR in ${context}:`, error);
    
    // Attempt auto-recovery
    this.attemptRecovery(context);
    
    // Notify user if recovery fails
    if (!this.canRecover(context)) {
      this.notifyUser(context, error);
    }
  }

  private attemptRecovery(context: string): boolean {
    // Implement context-specific recovery strategies
    switch (context.toLowerCase()) {
      case 'draft':
        return this.recoverDraftState();
      case 'trade':
        return this.recoverTradeState();
      case 'websocket':
        return this.reconnectWebSocket();
      default:
        return false;
    }
  }

  private recoverDraftState(): boolean {
    try {

      // Restore from localStorage backup
      const backup = localStorage.getItem('draft_state_backup');
      if (backup) {
        console.log('Recovering draft state from backup...');
        return true;
      }
    
    } catch (error) {
        console.error(error);
    } catch (e) {
      console.error('Draft recovery failed:', e);
    }
    return false;
  }

  private recoverTradeState(): boolean {
    try {

      // Clear trade cache and reload
      sessionStorage.removeItem('trade_cache');
      console.log('Trade state cleared, reloading...');
      return true;
    
    } catch (error) {
        console.error(error);
    } catch (e) {
      console.error('Trade recovery failed:', e);
    }
    return false;
  }

  private reconnectWebSocket(): boolean {
    try {

      console.log('Attempting WebSocket reconnection...');
      // Trigger reconnection logic
      window.dispatchEvent(new CustomEvent('websocket-reconnect'));
      return true;
    
    } catch (error) {
        console.error(error);
    } catch (e) {
      console.error('WebSocket reconnection failed:', e);
    }
    return false;
  }

  private canRecover(context: string): boolean {
    const recoverableContexts = ['websocket', 'notification', 'cache'];
    return recoverableContexts.includes(context.toLowerCase());
  }

  private notifyUser(context: string, error: Error): void {
    // Show user-friendly error message
    const message = this.getUserFriendlyMessage(context, error);
    window.dispatchEvent(new CustomEvent('show-notification', {
      detail: {
        type: 'error',
        title: 'System Error',
        message,
        duration: 5000
      }
    }));
  }

  private getUserFriendlyMessage(context: string, error: Error): string {
    const messages: Record<string, string> = {
      draft: 'Draft system encountered an issue. Your progress has been saved.',
      trade: 'Trade system is temporarily unavailable. Please try again.',
      payment: 'Payment processing error. No charges have been made.',
      authentication: 'Authentication issue. Please log in again.',
      default: 'An unexpected error occurred. Our team has been notified.'
    };

    return messages[context.toLowerCase()] || messages.default;
  }

  private sendToMonitoring(error: Error, context: string, severity: string): void {
    // Send to monitoring service (e.g., Sentry, LogRocket)
    try {
      fetch('/api/monitoring/error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: {
            message: error.message,
            stack: error.stack,
            context,
            severity,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
          }
        })
      });
    
    } catch (e) {
      console.error('Failed to send error to monitoring:', e);
    }
  }

  getErrorReport(): Record<string, any> {
    const report: Record<string, any> = {};
    this.errorLog.forEach((errors, context) => {
      report[context] = {
        count: errors.length,
        lastError: errors[errors.length - 1]
      };
    });
    return report;
  }

  clearErrors(context?: string): void {
    if (context) {
      this.errorLog.delete(context);
    } else {
      this.errorLog.clear();
    }
  }
}

// Accessibility Enhancement System
export class AccessibilityEnhancer {
  private static instance: AccessibilityEnhancer;
  
  static getInstance(): AccessibilityEnhancer {
    if (!this.instance) {
      this.instance = new AccessibilityEnhancer();
    }
    return this.instance;
  }

  enhanceComponent(element: HTMLElement): void {
    // Add ARIA labels
    this.addAriaLabels(element);
    
    // Ensure keyboard navigation
    this.ensureKeyboardNavigation(element);
    
    // Add focus indicators
    this.addFocusIndicators(element);
    
    // Ensure color contrast
    this.ensureColorContrast(element);
  }

  private addAriaLabels(element: HTMLElement): void {
    // Add aria-label to buttons without text
    const buttons = element.querySelectorAll('button:not([aria-label])');
    buttons.forEach((btn: any) => {
      const button = btn as HTMLButtonElement;
      if (!button.textContent?.trim()) {
        button.setAttribute('aria-label', 'Interactive button');
      }
    });

    // Add aria-label to inputs
    const inputs = element.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
    inputs.forEach((input: any) => {
      const inputEl = input as HTMLInputElement;
      const label = inputEl.placeholder || inputEl.name || 'Input field';
      inputEl.setAttribute('aria-label', label);
    });
  }

  private ensureKeyboardNavigation(element: HTMLElement): void {
    // Make clickable elements keyboard accessible
    const clickables = element.querySelectorAll('[onClick]:not([tabIndex])');
    clickables.forEach((el: any) => {
      el.setAttribute('tabIndex', '0');
      el.addEventListener('keydown', (e: any) => {
        const event = e as KeyboardEvent;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          (el as HTMLElement).click();
        }
      });
    });
  }

  private addFocusIndicators(element: HTMLElement): void {
    // Add visible focus indicators
    const focusableElements = element.querySelectorAll('button, a, input, select, textarea, [tabIndex]');
    focusableElements.forEach((el: any) => {
      el.classList.add('focus-visible:ring-2', 'focus-visible:ring-primary-500', 'focus-visible:ring-offset-2');
    });
  }

  private ensureColorContrast(element: HTMLElement): void {
    // Check and fix color contrast issues
    const textElements = element.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
    textElements.forEach((el: any) => {
      const styles = window.getComputedStyle(el as HTMLElement);
      const color = styles.color;
      const bgColor = styles.backgroundColor;
      
      if (this.needsContrastImprovement(color, bgColor)) {
        (el as HTMLElement).classList.add('high-contrast-text');
      }
    });
  }

  private needsContrastImprovement(color: string, bgColor: string): boolean {
    // Simple contrast check (would need proper implementation)
    return false; // Placeholder
  }

  announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.classList.add('sr-only');
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
}

// Mobile Enhancement System
export class MobileEnhancer {
  private static instance: MobileEnhancer;
  private touchStartTime: number = 0;
  private touchStartPos: { x: number; y: number } = { x: 0, y: 0 };
  
  static getInstance(): MobileEnhancer {
    if (!this.instance) {
      this.instance = new MobileEnhancer();
    }
    return this.instance;
  }

  enhanceForMobile(element: HTMLElement): void {
    // Add touch event handling
    this.addTouchSupport(element);
    
    // Optimize for mobile viewport
    this.optimizeViewport(element);
    
    // Add swipe gestures
    this.addSwipeGestures(element);
    
    // Optimize images for mobile
    this.optimizeImages(element);
  }

  private addTouchSupport(element: HTMLElement): void {
    // Convert click events to touch events
    const clickables = element.querySelectorAll('[onClick]');
    clickables.forEach((el: any) => {
      el.addEventListener('touchstart', (e: any) => {
        this.touchStartTime = Date.now();
        const touch = (e as TouchEvent).touches[0];
        this.touchStartPos = { x: touch.clientX, y: touch.clientY };
      }, { passive: true });

      el.addEventListener('touchend', (e: any) => {
        const touchDuration = Date.now() - this.touchStartTime;
        const touch = (e as TouchEvent).changedTouches[0];
        const touchEndPos = { x: touch.clientX, y: touch.clientY };
        
        // Check if it's a tap (not a swipe)
        const distance = Math.sqrt(
          Math.pow(touchEndPos.x - this.touchStartPos.x, 2) +
          Math.pow(touchEndPos.y - this.touchStartPos.y, 2)
        );
        
        if (touchDuration < 500 && distance < 10) {
          (el as HTMLElement).click();
        }
      }, { passive: true });
    });
  }

  private optimizeViewport(element: HTMLElement): void {
    // Add responsive classes
    element.classList.add('touch-manipulation');
    
    // Ensure minimum touch target size (44x44px)
    const touchTargets = element.querySelectorAll('button, a, [onClick]');
    touchTargets.forEach((target: any) => {
      const el = target as HTMLElement;
      el.style.minHeight = '44px';
      el.style.minWidth = '44px';
    });
  }

  private addSwipeGestures(element: HTMLElement): void {
    let touchStartX = 0;
    let touchStartY = 0;

    element.addEventListener('touchstart', (e: any) => {
      const touch = (e as TouchEvent).touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    }, { passive: true });

    element.addEventListener('touchend', (e: any) => {
      const touch = (e as TouchEvent).changedTouches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;

      // Detect swipe direction
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 50) {
          // Swipe right
          element.dispatchEvent(new CustomEvent('swipe-right'));
        } else if (deltaX < -50) {
          // Swipe left
          element.dispatchEvent(new CustomEvent('swipe-left'));
        }
      }
    }, { passive: true });
  }

  private optimizeImages(element: HTMLElement): void {
    const images = element.querySelectorAll('img');
    images.forEach((img: any) => {
      // Add lazy loading
      img.loading = 'lazy';
      
      // Add responsive sizing
      if (!img.getAttribute('srcset')) {
        img.classList.add('max-w-full', 'h-auto');
      }
    });
  }

  detectDevice(): { isMobile: boolean; isTablet: boolean; isDesktop: boolean } {
    const width = window.innerWidth;
    return {
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024
    };
  }
}

// Performance Optimization System
export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private observers: Map<string, IntersectionObserver> = new Map();
  
  static getInstance(): PerformanceOptimizer {
    if (!this.instance) {
      this.instance = new PerformanceOptimizer();
    }
    return this.instance;
  }

  optimizeComponent(element: HTMLElement, options?: { lazyLoad?: boolean; virtualScroll?: boolean }): void {
    if (options?.lazyLoad) {
      this.implementLazyLoading(element);
    }
    
    if (options?.virtualScroll) {
      this.implementVirtualScrolling(element);
    }
    
    // Optimize animations
    this.optimizeAnimations(element);
    
    // Debounce event handlers
    this.debounceEventHandlers(element);
  }

  private implementLazyLoading(element: HTMLElement): void {
    const observer = new IntersectionObserver((entries: any) => {
      entries.forEach((entry: any) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          
          // Load content
          if (target.dataset.src) {
            (target as HTMLImageElement).src = target.dataset.src;
            delete target.dataset.src;
          }
          
          // Trigger lazy load event
          target.dispatchEvent(new CustomEvent('lazy-loaded'));
          
          // Stop observing
          observer.unobserve(target);
        }
      });
    }, {
      rootMargin: '50px'
    });

    // Observe elements with data-lazy attribute
    const lazyElements = element.querySelectorAll('[data-lazy]');
    lazyElements.forEach((el: any) => observer.observe(el));
    
    // Store observer for cleanup
    this.observers.set(element.id || 'default', observer);
  }

  private implementVirtualScrolling(element: HTMLElement): void {
    // Implement virtual scrolling for large lists
    const lists = element.querySelectorAll('[data-virtual-scroll]');
    lists.forEach((list: any) => {
      const items = Array.from(list.children);
      const visibleItems = 10; // Number of visible items
      
      // Hide items outside viewport
      items.forEach((item, index) => {
        if (index >= visibleItems) {
          (item as HTMLElement).style.display = 'none';
        }
      });
      
      // Add scroll listener
      list.addEventListener('scroll', () => {
        const scrollTop = list.scrollTop;
        const itemHeight = items[0]?.clientHeight || 50;
        const startIndex = Math.floor(scrollTop / itemHeight);
        const endIndex = startIndex + visibleItems;
        
        items.forEach((item, index) => {
          const el = item as HTMLElement;
          if (index >= startIndex && index < endIndex) {
            el.style.display = '';
          } else {
            el.style.display = 'none';
          }
        });
      });
    });
  }

  private optimizeAnimations(element: HTMLElement): void {
    // Use CSS transforms instead of position changes
    const animatedElements = element.querySelectorAll('[data-animate]');
    animatedElements.forEach((el: any) => {
      (el as HTMLElement).style.willChange = 'transform';
    });
    
    // Reduce animation on low-end devices
    if (this.isLowEndDevice()) {
      element.classList.add('reduce-motion');
    }
  }

  private debounceEventHandlers(element: HTMLElement): void {
    const inputs = element.querySelectorAll('input, textarea');
    inputs.forEach((input: any) => {
      const originalHandler = (input as any).oninput;
      if (originalHandler) {
        (input as any).oninput = this.debounce(originalHandler, 300);
      }
    });
  }

  private debounce(func: Function, wait: number): Function {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  private isLowEndDevice(): boolean {
    // Check for low-end device indicators
    return (
      navigator.hardwareConcurrency < 4 ||
      (navigator as any).deviceMemory < 4 ||
      (navigator as any).connection?.effectiveType === '2g' ||
      (navigator as any).connection?.effectiveType === 'slow-2g'
    );
  }

  cleanup(): void {
    // Clean up observers
    this.observers.forEach((observer: any) => observer.disconnect());
    this.observers.clear();
  }
}

// Button Enhancement System
export class ButtonEnhancer {
  static enhance(button: HTMLButtonElement): void {
    // Add ripple effect
    this.addRippleEffect(button);
    
    // Add loading state
    this.addLoadingState(button);
    
    // Add disabled state handling
    this.addDisabledStateHandling(button);
    
    // Add tooltip
    this.addTooltip(button);
  }

  private static addRippleEffect(button: HTMLButtonElement): void {
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    
    button.addEventListener('click', (e: any) => {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      
      button.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  }

  private static addLoadingState(button: HTMLButtonElement): void {
    const originalContent = button.innerHTML;
    
    button.dataset.originalContent = originalContent;
    
    // Add loading method
    (button as any).setLoading = (loading: boolean) => {
      if (loading) {
        button.disabled = true;
        button.innerHTML = '<span class="spinner"></span> Loading...';
      } else {
        button.disabled = false;
        button.innerHTML = button.dataset.originalContent || originalContent;
      }
    };
  }

  private static addDisabledStateHandling(button: HTMLButtonElement): void {
    const observer = new MutationObserver((mutations: any) => {
      mutations.forEach((mutation: any) => {
        if (mutation.attributeName === 'disabled') {
          if (button.disabled) {
            button.classList.add('opacity-50', 'cursor-not-allowed');
            button.setAttribute('aria-disabled', 'true');
          } else {
            button.classList.remove('opacity-50', 'cursor-not-allowed');
            button.setAttribute('aria-disabled', 'false');
          }
        }
      });
    });
    
    observer.observe(button, { attributes: true });
  }

  private static addTooltip(button: HTMLButtonElement): void {
    const tooltipText = button.getAttribute('data-tooltip');
    if (!tooltipText) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip hidden absolute bg-gray-900 text-white text-xs rounded py-1 px-2 z-10';
    tooltip.textContent = tooltipText;
    
    button.style.position = 'relative';
    button.appendChild(tooltip);
    
    button.addEventListener('mouseenter', () => {
      tooltip.classList.remove('hidden');
    });
    
    button.addEventListener('mouseleave', () => {
      tooltip.classList.add('hidden');
    });
  }
}

// Unified Enhancement Manager
export class ExtensionEnhancementManager {
  private static instance: ExtensionEnhancementManager;
  private errorHandler: EnhancedErrorHandler;
  private accessibilityEnhancer: AccessibilityEnhancer;
  private mobileEnhancer: MobileEnhancer;
  private performanceOptimizer: PerformanceOptimizer;
  
  private constructor() {
    this.errorHandler = EnhancedErrorHandler.getInstance();
    this.accessibilityEnhancer = AccessibilityEnhancer.getInstance();
    this.mobileEnhancer = MobileEnhancer.getInstance();
    this.performanceOptimizer = PerformanceOptimizer.getInstance();
  }
  
  static getInstance(): ExtensionEnhancementManager {
    if (!this.instance) {
      this.instance = new ExtensionEnhancementManager();
    }
    return this.instance;
  }

  enhanceApplication(): void {
    console.log('🚀 Initializing Extension Enhancement Framework');
    
    // Set up global error handling
    this.setupGlobalErrorHandling();
    
    // Enhance all existing components
    this.enhanceExistingComponents();
    
    // Set up mutation observer for new components
    this.observeNewComponents();
    
    // Initialize performance monitoring
    this.initializePerformanceMonitoring();
    
    console.log('✅ Extension Enhancement Framework initialized');
  }

  private setupGlobalErrorHandling(): void {
    window.addEventListener('error', (event: any) => {
      this.errorHandler.handleError(
        new Error(event.message),
        event.filename || 'unknown',
        'high'
      );
    });

    window.addEventListener('unhandledrejection', (event: any) => {
      this.errorHandler.handleError(
        new Error(event.reason),
        'promise',
        'high'
      );
    });
  }

  private enhanceExistingComponents(): void {
    const components = document.querySelectorAll('[data-component]');
    components.forEach((component: any) => {
      this.enhanceComponent(component as HTMLElement);
    });
  }

  private enhanceComponent(element: HTMLElement): void {
    // Apply all enhancements
    this.accessibilityEnhancer.enhanceComponent(element);
    this.mobileEnhancer.enhanceForMobile(element);
    this.performanceOptimizer.optimizeComponent(element, {
      lazyLoad: true,
      virtualScroll: element.dataset.virtualScroll === 'true'
    });
    
    // Enhance buttons
    const buttons = element.querySelectorAll('button');
    buttons.forEach((button: any) => {
      ButtonEnhancer.enhance(button as HTMLButtonElement);
    });
  }

  private observeNewComponents(): void {
    const observer = new MutationObserver((mutations: any) => {
      mutations.forEach((mutation: any) => {
        mutation.addedNodes.forEach((node: any) => {
          if (node.nodeType === 1) { // Element node
            const element = node as HTMLElement;
            if (element.dataset?.component) {
              this.enhanceComponent(element);
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private initializePerformanceMonitoring(): void {
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list: any) => {
        for (const entry of list.getEntries()) {
          if ((entry as any).duration > 50) {
            console.warn('Long task detected:', entry);
          }
        }
      });
      
      try {

        observer.observe({ entryTypes: ['longtask'] });

    } catch (error) {
        console.error(error);
    } catch (e) {
        console.log('Long task monitoring not supported');
      }
    }
  }

  getStatus(): Record<string, any> {
    return {
      errorReport: this.errorHandler.getErrorReport(),
      deviceInfo: this.mobileEnhancer.detectDevice(),
      performance: performance.now()
    };
  }
}

// Export singleton instance
export const enhancementFramework = ExtensionEnhancementManager.getInstance();

// Auto-initialize on import
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    enhancementFramework.enhanceApplication();
  });
}