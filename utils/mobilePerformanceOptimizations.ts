/**
 * Mobile Performance Optimizations
 * Handles touch performance, battery optimization, and network efficiency
 */

export interface MobilePerformanceConfig {
}
  enableTouchOptimization: boolean;
  enableBatteryOptimization: boolean;
  enableNetworkAdaptation: boolean;
  enableHapticFeedback: boolean;
  enableGestureOptimization: boolean;
  reducedMotionSupport: boolean;
}

export interface NetworkInfo {
}
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

export interface BatteryInfo {
}
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
}

/**
 * Touch Performance Optimizer
 */
export class TouchOptimizer {
}
  private touchElements = new WeakMap<Element, TouchHandler>();
  private passiveSupported = this.detectPassiveSupport();

  private detectPassiveSupport(): boolean {
}
    let passiveSupported = false;
    try {
}
      const options = {
}
        get passive() {
}
          passiveSupported = true;
          return false;
        }
      };
      window.addEventListener(&apos;testPassive&apos;, () => {}, options);
      window.removeEventListener(&apos;testPassive&apos;, () => {}, options);
    } catch (err) {
}
      passiveSupported = false;
    }
    return passiveSupported;
  }

  public optimizeTouchElement(element: Element): void {
}
    if (this.touchElements.has(element)) return;

    const handler = new TouchHandler(element, {
}
      passive: this.passiveSupported,
      enableFastClick: true,
      preventScrolling: false
    });

    this.touchElements.set(element, handler);
  }

  public enableHapticFeedback(intensity: &apos;light&apos; | &apos;medium&apos; | &apos;heavy&apos; = &apos;light&apos;): void {
}
    if (&apos;vibrate&apos; in navigator && &apos;ontouchstart&apos; in window) {
}
      const patterns = {
}
        light: [10],
        medium: [20],
        heavy: [30]
      };

      document.addEventListener(&apos;touchstart&apos;, (e: any) => {
}
        const target = e.target as Element;
        if (target.matches(&apos;button, [role="button"], .interactive&apos;)) {
}
          navigator.vibrate(patterns[intensity]);
        }
      }, { passive: true });
    }
  }

  public destroy(): void {
}
    this.touchElements = new WeakMap();
  }
}

class TouchHandler {
}
  private element: Element;
  private options: any;
  private startTime = 0;
  private startPos = { x: 0, y: 0 };

  constructor(element: Element, options: any) {
}
    this.element = element;
    this.options = options;
    this.init();
  }

  private init(): void {
}
    const touchOptions = this.options.passive ? { passive: true } : false;

    this.element.addEventListener(&apos;touchstart&apos;, this.handleTouchStart.bind(this), touchOptions);
    this.element.addEventListener(&apos;touchend&apos;, this.handleTouchEnd.bind(this), touchOptions);
    
    if (this.options.enableFastClick) {
}
      this.element.addEventListener(&apos;click&apos;, this.handleClick.bind(this), true);
    }
  }

  private handleTouchStart(e: TouchEvent): void {
}
    this.startTime = performance.now();
    const touch = e.touches[0];
    this.startPos = { x: touch.clientX, y: touch.clientY };

    // Add visual feedback
    this.element.classList.add(&apos;touch-active&apos;);
  }

  private handleTouchEnd(e: TouchEvent): void {
}
    const endTime = performance.now();
    const duration = endTime - this.startTime;

    // Remove visual feedback
    setTimeout(() => {
}
      this.element.classList.remove(&apos;touch-active&apos;);
    }, 150);

    // Fast click implementation
    if (this.options.enableFastClick && duration < 200) {
}
      const touch = e.changedTouches[0];
      const distance = Math.abs(touch.clientX - this.startPos.x) + Math.abs(touch.clientY - this.startPos.y);
      
      if (distance < 10) {
}
        e.preventDefault();
        // Dispatch synthetic click
        const clickEvent = new MouseEvent(&apos;click&apos;, {
}
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
}
    if (this.options.enableFastClick) {
}
      // Prevent ghost clicks
      if (performance.now() - this.startTime < 300) {
}
        return;
      }
    }
  }
}

/**
 * Network Adaptation Manager
 */
export class NetworkAdapter {
}
  private networkInfo: NetworkInfo | null = null;
  private callbacks = new Set<(info: NetworkInfo) => void>();

  constructor() {
}
    this.initNetworkMonitoring();
  }

  private initNetworkMonitoring(): void {
}
    // Modern Network Information API
    if (&apos;connection&apos; in navigator) {
}
      const connection = (navigator as any).connection;
      this.updateNetworkInfo(connection);
      
      connection.addEventListener(&apos;change&apos;, () => {
}
        this.updateNetworkInfo(connection);
      });
    }

    // Fallback: Monitor network speed via timing
    this.measureNetworkSpeed();
  }

  private updateNetworkInfo(connection: any): void {
}
    this.networkInfo = {
}
      effectiveType: connection.effectiveType || &apos;4g&apos;,
      downlink: connection.downlink || 1.5,
      rtt: connection.rtt || 100,
      saveData: connection.saveData || false
    };

    this.notifyCallbacks();
  }

  private async measureNetworkSpeed(): Promise<void> {
}
    try {
}
      const startTime = performance.now();
      // Use a small test resource
      await fetch(&apos;/favicon.svg&apos;, { cache: &apos;no-cache&apos; });
      const endTime = performance.now();
      
      const duration = endTime - startTime;
      const estimatedSpeed = duration < 100 ? &apos;fast&apos; : duration < 300 ? &apos;medium&apos; : &apos;slow&apos;;
      
      if (!this.networkInfo) {
}
        this.networkInfo = {
}
          effectiveType: estimatedSpeed === &apos;fast&apos; ? &apos;4g&apos; : estimatedSpeed === &apos;medium&apos; ? &apos;3g&apos; : &apos;2g&apos;,
          downlink: estimatedSpeed === &apos;fast&apos; ? 2.0 : estimatedSpeed === &apos;medium&apos; ? 1.0 : 0.5,
          rtt: duration,
          saveData: false
        };
        this.notifyCallbacks();
      }
    } catch (error) {
}
      console.warn(&apos;Network speed measurement failed:&apos;, error);
    }
  }

  private notifyCallbacks(): void {
}
    if (this.networkInfo) {
}
      this.callbacks.forEach((callback: any) => callback(this.networkInfo!));
    }
  }

  public subscribe(callback: (info: NetworkInfo) => void): () => void {
}
    this.callbacks.add(callback);
    if (this.networkInfo) {
}
      callback(this.networkInfo);
    }
    return () => this.callbacks.delete(callback);
  }

  public getNetworkInfo(): NetworkInfo | null {
}
    return this.networkInfo;
  }

  public isSlowNetwork(): boolean {
}
    if (!this.networkInfo) return false;
    return this.networkInfo.effectiveType === &apos;2g&apos; || 
           this.networkInfo.effectiveType === &apos;slow-2g&apos; ||
           this.networkInfo.downlink < 0.5;
  }

  public shouldReduceQuality(): boolean {
}
    return this.isSlowNetwork() || (this.networkInfo?.saveData ?? false);
  }
}

/**
 * Battery Optimization Manager
 */
export class BatteryOptimizer {
}
  private batteryInfo: BatteryInfo | null = null;
  private callbacks = new Set<(info: BatteryInfo) => void>();
  private optimizationActive = false;

  constructor() {
}
    this.initBatteryMonitoring();
  }

  private async initBatteryMonitoring(): Promise<void> {
}
    if (&apos;getBattery&apos; in navigator) {
}
      try {
}
        const battery = await (navigator as any).getBattery();
        this.updateBatteryInfo(battery);
        
        battery.addEventListener(&apos;chargingchange&apos;, () => this.updateBatteryInfo(battery));
        battery.addEventListener(&apos;levelchange&apos;, () => this.updateBatteryInfo(battery));
      } catch (error) {
}
        console.warn(&apos;Battery API not available:&apos;, error);
      }
    }
  }

  private updateBatteryInfo(battery: any): void {
}
    this.batteryInfo = {
}
      charging: battery.charging,
      chargingTime: battery.chargingTime,
      dischargingTime: battery.dischargingTime,
      level: battery.level
    };

    this.notifyCallbacks();
    this.checkOptimizationNeeded();
  }

  private checkOptimizationNeeded(): void {
}
    if (!this.batteryInfo) return;

    const lowBattery = !this.batteryInfo.charging && this.batteryInfo.level < 0.2;
    
    if (lowBattery && !this.optimizationActive) {
}
      this.activateOptimizations();
    } else if (!lowBattery && this.optimizationActive) {
}
      this.deactivateOptimizations();
    }
  }

  private activateOptimizations(): void {
}
    this.optimizationActive = true;
    
    // Reduce animation frequency
    document.documentElement.style.setProperty(&apos;--animation-duration&apos;, &apos;0.1s&apos;);
    
    // Disable non-critical animations
    document.body.classList.add(&apos;battery-saver&apos;);
    
    // Reduce background tasks
    this.throttleBackgroundTasks();
    
    console.log(&apos;🔋 Battery optimization activated&apos;);
  }

  private deactivateOptimizations(): void {
}
    this.optimizationActive = false;
    
    // Restore normal animations
    document.documentElement.style.removeProperty(&apos;--animation-duration&apos;);
    document.body.classList.remove(&apos;battery-saver&apos;);
    
    console.log(&apos;🔋 Battery optimization deactivated&apos;);
  }

  private throttleBackgroundTasks(): void {
}
    // Reduce fetch frequency, disable auto-refresh, etc.
    window.dispatchEvent(new CustomEvent(&apos;battery-optimization&apos;, {
}
      detail: { active: true, level: this.batteryInfo?.level }
    }));
  }

  private notifyCallbacks(): void {
}
    if (this.batteryInfo) {
}
      this.callbacks.forEach((callback: any) => callback(this.batteryInfo!));
    }
  }

  public subscribe(callback: (info: BatteryInfo) => void): () => void {
}
    this.callbacks.add(callback);
    if (this.batteryInfo) {
}
      callback(this.batteryInfo);
    }
    return () => this.callbacks.delete(callback);
  }

  public getBatteryInfo(): BatteryInfo | null {
}
    return this.batteryInfo;
  }

  public isOptimizing(): boolean {
}
    return this.optimizationActive;
  }
}

/**
 * Gesture Optimization Manager
 */
export class GestureOptimizer {
}
  private swipeThreshold = 50;
  private velocityThreshold = 0.3;

  public enableSwipeGestures(element: Element): void {
}
    let startX = 0;
    let startY = 0;
    let startTime = 0;

    element.addEventListener(&apos;touchstart&apos;, (e: any) => {
}
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      startTime = Date.now();
    }, { passive: true });

    element.addEventListener(&apos;touchend&apos;, (e: any) => {
}
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      const deltaTime = Date.now() - startTime;
      
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      
      if (absX > this.swipeThreshold || absY > this.swipeThreshold) {
}
        const velocity = Math.max(absX, absY) / deltaTime;
        
        if (velocity > this.velocityThreshold) {
}
          const direction = absX > absY ? 
            (deltaX > 0 ? &apos;right&apos; : &apos;left&apos;) : 
            (deltaY > 0 ? &apos;down&apos; : &apos;up&apos;);
          
          element.dispatchEvent(new CustomEvent(&apos;swipe&apos;, {
}
            detail: { direction, velocity, deltaX, deltaY }
          }));
        }
      }
    }, { passive: true });
  }

  public enablePullToRefresh(element: Element, callback: () => void): void {
}
    let startY = 0;
    let pulling = false;
    const pullThreshold = 100;

    element.addEventListener(&apos;touchstart&apos;, (e: any) => {
}
      if (element.scrollTop === 0) {
}
        startY = e.touches[0].clientY;
        pulling = true;
      }
    }, { passive: true });

    element.addEventListener(&apos;touchmove&apos;, (e: any) => {
}
      if (pulling && element.scrollTop === 0) {
}
        const deltaY = e.touches[0].clientY - startY;
        if (deltaY > 0) {
}
          e.preventDefault();
          // Add visual feedback
          element.style.transform = `translateY(${Math.min(deltaY / 2, pullThreshold / 2)}px)`;
        }
      }
    });

    element.addEventListener(&apos;touchend&apos;, (e: any) => {
}
      if (pulling) {
}
        const deltaY = e.changedTouches[0].clientY - startY;
        element.style.transform = &apos;&apos;;
        
        if (deltaY > pullThreshold) {
}
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
}
  private touchOptimizer: TouchOptimizer;
  private networkAdapter: NetworkAdapter;
  private batteryOptimizer: BatteryOptimizer;
  private gestureOptimizer: GestureOptimizer;
  private config: MobilePerformanceConfig;

  constructor(config: Partial<MobilePerformanceConfig> = {}) {
}
    this.config = {
}
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
}
    // Respect user&apos;s motion preferences
    if (this.config.reducedMotionSupport) {
}
      this.handleReducedMotion();
    }

    // Enable haptic feedback if supported and requested
    if (this.config.enableHapticFeedback) {
}
      this.touchOptimizer.enableHapticFeedback(&apos;light&apos;);
    }

    // Monitor network changes
    if (this.config.enableNetworkAdaptation) {
}
      this.networkAdapter.subscribe((info: any) => {
}
        this.adaptToNetwork(info);
      });
    }

    // Monitor battery changes
    if (this.config.enableBatteryOptimization) {
}
      this.batteryOptimizer.subscribe((info: any) => {
}
        this.adaptToBattery(info);
      });
    }
  }

  private handleReducedMotion(): void {
}
    const prefersReducedMotion = window.matchMedia(&apos;(prefers-reduced-motion: reduce)&apos;).matches;
    
    if (prefersReducedMotion) {
}
      document.body.classList.add(&apos;reduced-motion&apos;);
    }

    // Listen for changes
    window.matchMedia(&apos;(prefers-reduced-motion: reduce)&apos;).addEventListener(&apos;change&apos;, (e: any) => {
}
      if (e.matches) {
}
        document.body.classList.add(&apos;reduced-motion&apos;);
      } else {
}
        document.body.classList.remove(&apos;reduced-motion&apos;);
      }
    });
  }

  private adaptToNetwork(info: NetworkInfo): void {
}
    if (this.networkAdapter.shouldReduceQuality()) {
}
      document.body.classList.add(&apos;low-bandwidth&apos;);
      // Reduce image quality, disable auto-play videos, etc.
      window.dispatchEvent(new CustomEvent(&apos;network-adaptation&apos;, {
}
        detail: { quality: &apos;low&apos;, info }
      }));
    } else {
}
      document.body.classList.remove(&apos;low-bandwidth&apos;);
      window.dispatchEvent(new CustomEvent(&apos;network-adaptation&apos;, {
}
        detail: { quality: &apos;high&apos;, info }
      }));
    }
  }

  private adaptToBattery(info: BatteryInfo): void {
}
    // Battery adaptation is handled internally by BatteryOptimizer
    window.dispatchEvent(new CustomEvent(&apos;battery-status&apos;, {
}
      detail: info
    }));
  }

  public optimizeTouchElement(element: Element): void {
}
    if (this.config.enableTouchOptimization) {
}
      this.touchOptimizer.optimizeTouchElement(element);
    }
  }

  public enableSwipeGestures(element: Element): void {
}
    if (this.config.enableGestureOptimization) {
}
      this.gestureOptimizer.enableSwipeGestures(element);
    }
  }

  public enablePullToRefresh(element: Element, callback: () => void): void {
}
    if (this.config.enableGestureOptimization) {
}
      this.gestureOptimizer.enablePullToRefresh(element, callback);
    }
  }

  public getNetworkInfo(): NetworkInfo | null {
}
    return this.networkAdapter.getNetworkInfo();
  }

  public getBatteryInfo(): BatteryInfo | null {
}
    return this.batteryOptimizer.getBatteryInfo();
  }

  public updateConfig(newConfig: Partial<MobilePerformanceConfig>): void {
}
    this.config = { ...this.config, ...newConfig };
  }

  public destroy(): void {
}
    this.touchOptimizer.destroy();
  }
}

// Export singleton instance
export const mobilePerformanceManager = new MobilePerformanceManager();