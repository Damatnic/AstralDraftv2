/**
 * Mobile Performance Optimizations
 * Handles touch performance, battery optimization, and network efficiency
 */

export interface MobilePerformanceConfig {
  enableTouchOptimization: boolean;
  enableBatteryOptimization: boolean;
  enableNetworkAdaptation: boolean;
  enableHapticFeedback: boolean;
  enableGestureOptimization: boolean;
  reducedMotionSupport: boolean;
}

export interface NetworkInfo {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

export interface BatteryInfo {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
}

/**
 * Touch Performance Optimizer
 */
export class TouchOptimizer {
  private touchElements = new WeakMap<Element, TouchHandler>();
  private passiveSupported = this.detectPassiveSupport();

  private detectPassiveSupport(): boolean {
    let passiveSupported = false;
    try {
      const options = {
        get passive() {
          passiveSupported = true;
          return false;
        }
      };
      window.addEventListener('testPassive', () => {}, options);
      window.removeEventListener('testPassive', () => {}, options);
    } catch (err) {
      passiveSupported = false;
    }
    return passiveSupported;
  }

  public optimizeTouchElement(element: Element): void {
    if (this.touchElements.has(element)) return;

    const handler = new TouchHandler(element, {
      passive: this.passiveSupported,
      enableFastClick: true,
      preventScrolling: false
    });

    this.touchElements.set(element, handler);
  }

  public enableHapticFeedback(intensity: 'light' | 'medium' | 'heavy' = 'light'): void {
    if ('vibrate' in navigator && 'ontouchstart' in window) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      };

      document.addEventListener('touchstart', (e: any) => {
        const target = e.target as Element;
        if (target.matches('button, [role="button"], .interactive')) {
          navigator.vibrate(patterns[intensity]);
        }
      }, { passive: true });
    }
  }

  public destroy(): void {
    this.touchElements = new WeakMap();
  }
}

class TouchHandler {
  private element: Element;
  private options: any;
  private startTime = 0;
  private startPos = { x: 0, y: 0 };

  constructor(element: Element, options: any) {
    this.element = element;
    this.options = options;
    this.init();
  }

  private init(): void {
    const touchOptions = this.options.passive ? { passive: true } : false;

    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), touchOptions);
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), touchOptions);
    
    if (this.options.enableFastClick) {
      this.element.addEventListener('click', this.handleClick.bind(this), true);
    }
  }

  private handleTouchStart(e: TouchEvent): void {
    this.startTime = performance.now();
    const touch = e.touches[0];
    this.startPos = { x: touch.clientX, y: touch.clientY };

    // Add visual feedback
    this.element.classList.add('touch-active');
  }

  private handleTouchEnd(e: TouchEvent): void {
    const endTime = performance.now();
    const duration = endTime - this.startTime;

    // Remove visual feedback
    setTimeout(() => {
      this.element.classList.remove('touch-active');
    }, 150);

    // Fast click implementation
    if (this.options.enableFastClick && duration < 200) {
      const touch = e.changedTouches[0];
      const distance = Math.abs(touch.clientX - this.startPos.x) + Math.abs(touch.clientY - this.startPos.y);
      
      if (distance < 10) {
        e.preventDefault();
        // Dispatch synthetic click
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        this.element.dispatchEvent(clickEvent);
      }
    }
  }

  private handleClick(e: MouseEvent): void {
    if (this.options.enableFastClick) {
      // Prevent ghost clicks
      if (performance.now() - this.startTime < 300) {
        return;
      }
    }
  }
}

/**
 * Network Adaptation Manager
 */
export class NetworkAdapter {
  private networkInfo: NetworkInfo | null = null;
  private callbacks = new Set<(info: NetworkInfo) => void>();

  constructor() {
    this.initNetworkMonitoring();
  }

  private initNetworkMonitoring(): void {
    // Modern Network Information API
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.updateNetworkInfo(connection);
      
      connection.addEventListener('change', () => {
        this.updateNetworkInfo(connection);
      });
    }

    // Fallback: Monitor network speed via timing
    this.measureNetworkSpeed();
  }

  private updateNetworkInfo(connection: any): void {
    this.networkInfo = {
      effectiveType: connection.effectiveType || '4g',
      downlink: connection.downlink || 1.5,
      rtt: connection.rtt || 100,
      saveData: connection.saveData || false
    };

    this.notifyCallbacks();
  }

  private async measureNetworkSpeed(): Promise<void> {
    try {
      const startTime = performance.now();
      // Use a small test resource
      await fetch('/favicon.svg', { cache: 'no-cache' });
      const endTime = performance.now();
      
      const duration = endTime - startTime;
      const estimatedSpeed = duration < 100 ? 'fast' : duration < 300 ? 'medium' : 'slow';
      
      if (!this.networkInfo) {
        this.networkInfo = {
          effectiveType: estimatedSpeed === 'fast' ? '4g' : estimatedSpeed === 'medium' ? '3g' : '2g',
          downlink: estimatedSpeed === 'fast' ? 2.0 : estimatedSpeed === 'medium' ? 1.0 : 0.5,
          rtt: duration,
          saveData: false
        };
        this.notifyCallbacks();
      }
    } catch (error) {
      console.warn('Network speed measurement failed:', error);
    }
  }

  private notifyCallbacks(): void {
    if (this.networkInfo) {
      this.callbacks.forEach((callback: any) => callback(this.networkInfo!));
    }
  }

  public subscribe(callback: (info: NetworkInfo) => void): () => void {
    this.callbacks.add(callback);
    if (this.networkInfo) {
      callback(this.networkInfo);
    }
    return () => this.callbacks.delete(callback);
  }

  public getNetworkInfo(): NetworkInfo | null {
    return this.networkInfo;
  }

  public isSlowNetwork(): boolean {
    if (!this.networkInfo) return false;
    return this.networkInfo.effectiveType === '2g' || 
           this.networkInfo.effectiveType === 'slow-2g' ||
           this.networkInfo.downlink < 0.5;
  }

  public shouldReduceQuality(): boolean {
    return this.isSlowNetwork() || (this.networkInfo?.saveData ?? false);
  }
}

/**
 * Battery Optimization Manager
 */
export class BatteryOptimizer {
  private batteryInfo: BatteryInfo | null = null;
  private callbacks = new Set<(info: BatteryInfo) => void>();
  private optimizationActive = false;

  constructor() {
    this.initBatteryMonitoring();
  }

  private async initBatteryMonitoring(): Promise<void> {
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        this.updateBatteryInfo(battery);
        
        battery.addEventListener('chargingchange', () => this.updateBatteryInfo(battery));
        battery.addEventListener('levelchange', () => this.updateBatteryInfo(battery));
      } catch (error) {
        console.warn('Battery API not available:', error);
      }
    }
  }

  private updateBatteryInfo(battery: any): void {
    this.batteryInfo = {
      charging: battery.charging,
      chargingTime: battery.chargingTime,
      dischargingTime: battery.dischargingTime,
      level: battery.level
    };

    this.notifyCallbacks();
    this.checkOptimizationNeeded();
  }

  private checkOptimizationNeeded(): void {
    if (!this.batteryInfo) return;

    const lowBattery = !this.batteryInfo.charging && this.batteryInfo.level < 0.2;
    
    if (lowBattery && !this.optimizationActive) {
      this.activateOptimizations();
    } else if (!lowBattery && this.optimizationActive) {
      this.deactivateOptimizations();
    }
  }

  private activateOptimizations(): void {
    this.optimizationActive = true;
    
    // Reduce animation frequency
    document.documentElement.style.setProperty('--animation-duration', '0.1s');
    
    // Disable non-critical animations
    document.body.classList.add('battery-saver');
    
    // Reduce background tasks
    this.throttleBackgroundTasks();
    
    console.log('🔋 Battery optimization activated');
  }

  private deactivateOptimizations(): void {
    this.optimizationActive = false;
    
    // Restore normal animations
    document.documentElement.style.removeProperty('--animation-duration');
    document.body.classList.remove('battery-saver');
    
    console.log('🔋 Battery optimization deactivated');
  }

  private throttleBackgroundTasks(): void {
    // Reduce fetch frequency, disable auto-refresh, etc.
    window.dispatchEvent(new CustomEvent('battery-optimization', {
      detail: { active: true, level: this.batteryInfo?.level }
    }));
  }

  private notifyCallbacks(): void {
    if (this.batteryInfo) {
      this.callbacks.forEach((callback: any) => callback(this.batteryInfo!));
    }
  }

  public subscribe(callback: (info: BatteryInfo) => void): () => void {
    this.callbacks.add(callback);
    if (this.batteryInfo) {
      callback(this.batteryInfo);
    }
    return () => this.callbacks.delete(callback);
  }

  public getBatteryInfo(): BatteryInfo | null {
    return this.batteryInfo;
  }

  public isOptimizing(): boolean {
    return this.optimizationActive;
  }
}

/**
 * Gesture Optimization Manager
 */
export class GestureOptimizer {
  private swipeThreshold = 50;
  private velocityThreshold = 0.3;

  public enableSwipeGestures(element: Element): void {
    let startX = 0;
    let startY = 0;
    let startTime = 0;

    element.addEventListener('touchstart', (e: any) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      startTime = Date.now();
    }, { passive: true });

    element.addEventListener('touchend', (e: any) => {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      const deltaTime = Date.now() - startTime;
      
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      
      if (absX > this.swipeThreshold || absY > this.swipeThreshold) {
        const velocity = Math.max(absX, absY) / deltaTime;
        
        if (velocity > this.velocityThreshold) {
          const direction = absX > absY ? 
            (deltaX > 0 ? 'right' : 'left') : 
            (deltaY > 0 ? 'down' : 'up');
          
          element.dispatchEvent(new CustomEvent('swipe', {
            detail: { direction, velocity, deltaX, deltaY }
          }));
        }
      }
    }, { passive: true });
  }

  public enablePullToRefresh(element: Element, callback: () => void): void {
    let startY = 0;
    let pulling = false;
    const pullThreshold = 100;

    element.addEventListener('touchstart', (e: any) => {
      if (element.scrollTop === 0) {
        startY = e.touches[0].clientY;
        pulling = true;
      }
    }, { passive: true });

    element.addEventListener('touchmove', (e: any) => {
      if (pulling && element.scrollTop === 0) {
        const deltaY = e.touches[0].clientY - startY;
        if (deltaY > 0) {
          e.preventDefault();
          // Add visual feedback
          element.style.transform = `translateY(${Math.min(deltaY / 2, pullThreshold / 2)}px)`;
        }
      }
    });

    element.addEventListener('touchend', (e: any) => {
      if (pulling) {
        const deltaY = e.changedTouches[0].clientY - startY;
        element.style.transform = '';
        
        if (deltaY > pullThreshold) {
          callback();
        }
        
        pulling = false;
      }
    }, { passive: true });
  }
}

/**
 * Main Mobile Performance Manager
 */
export class MobilePerformanceManager {
  private touchOptimizer: TouchOptimizer;
  private networkAdapter: NetworkAdapter;
  private batteryOptimizer: BatteryOptimizer;
  private gestureOptimizer: GestureOptimizer;
  private config: MobilePerformanceConfig;

  constructor(config: Partial<MobilePerformanceConfig> = {}) {
    this.config = {
      enableTouchOptimization: true,
      enableBatteryOptimization: true,
      enableNetworkAdaptation: true,
      enableHapticFeedback: false,
      enableGestureOptimization: true,
      reducedMotionSupport: true,
      ...config
    };

    this.touchOptimizer = new TouchOptimizer();
    this.networkAdapter = new NetworkAdapter();
    this.batteryOptimizer = new BatteryOptimizer();
    this.gestureOptimizer = new GestureOptimizer();

    this.init();
  }

  private init(): void {
    // Respect user's motion preferences
    if (this.config.reducedMotionSupport) {
      this.handleReducedMotion();
    }

    // Enable haptic feedback if supported and requested
    if (this.config.enableHapticFeedback) {
      this.touchOptimizer.enableHapticFeedback('light');
    }

    // Monitor network changes
    if (this.config.enableNetworkAdaptation) {
      this.networkAdapter.subscribe((info: any) => {
        this.adaptToNetwork(info);
      });
    }

    // Monitor battery changes
    if (this.config.enableBatteryOptimization) {
      this.batteryOptimizer.subscribe((info: any) => {
        this.adaptToBattery(info);
      });
    }
  }

  private handleReducedMotion(): void {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      document.body.classList.add('reduced-motion');
    }

    // Listen for changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e: any) => {
      if (e.matches) {
        document.body.classList.add('reduced-motion');
      } else {
        document.body.classList.remove('reduced-motion');
      }
    });
  }

  private adaptToNetwork(info: NetworkInfo): void {
    if (this.networkAdapter.shouldReduceQuality()) {
      document.body.classList.add('low-bandwidth');
      // Reduce image quality, disable auto-play videos, etc.
      window.dispatchEvent(new CustomEvent('network-adaptation', {
        detail: { quality: 'low', info }
      }));
    } else {
      document.body.classList.remove('low-bandwidth');
      window.dispatchEvent(new CustomEvent('network-adaptation', {
        detail: { quality: 'high', info }
      }));
    }
  }

  private adaptToBattery(info: BatteryInfo): void {
    // Battery adaptation is handled internally by BatteryOptimizer
    window.dispatchEvent(new CustomEvent('battery-status', {
      detail: info
    }));
  }

  public optimizeTouchElement(element: Element): void {
    if (this.config.enableTouchOptimization) {
      this.touchOptimizer.optimizeTouchElement(element);
    }
  }

  public enableSwipeGestures(element: Element): void {
    if (this.config.enableGestureOptimization) {
      this.gestureOptimizer.enableSwipeGestures(element);
    }
  }

  public enablePullToRefresh(element: Element, callback: () => void): void {
    if (this.config.enableGestureOptimization) {
      this.gestureOptimizer.enablePullToRefresh(element, callback);
    }
  }

  public getNetworkInfo(): NetworkInfo | null {
    return this.networkAdapter.getNetworkInfo();
  }

  public getBatteryInfo(): BatteryInfo | null {
    return this.batteryOptimizer.getBatteryInfo();
  }

  public updateConfig(newConfig: Partial<MobilePerformanceConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  public destroy(): void {
    this.touchOptimizer.destroy();
  }
}

// Export singleton instance
export const mobilePerformanceManager = new MobilePerformanceManager();