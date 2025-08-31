// Mobile Performance Optimization Suite
export interface MobilePerformanceConfig {
  enableImageOptimization?: boolean;
  enableLazyLoading?: boolean;
  enablePrefetching?: boolean;
  networkAwareLoading?: boolean;
  batteryOptimization?: boolean;
  memoryManagement?: boolean;
  renderOptimization?: boolean;
}

export class MobilePerformanceOptimizer {
  private static instance: MobilePerformanceOptimizer;
  private config: Required<MobilePerformanceConfig>;
  private connectionType: string = 'unknown';
  private isLowBatteryMode: boolean = false;
  private performanceObserver?: PerformanceObserver;
  private intersectionObserver?: IntersectionObserver;
  private memoryThreshold: number = 100 * 1024 * 1024; // 100MB

  private constructor(config: MobilePerformanceConfig = {}) {
    this.config = {
      enableImageOptimization: true,
      enableLazyLoading: true,
      enablePrefetching: true,
      networkAwareLoading: true,
      batteryOptimization: true,
      memoryManagement: true,
      renderOptimization: true,
      ...config
    };

    this.initialize();
  }

  static getInstance(config?: MobilePerformanceConfig): MobilePerformanceOptimizer {
    if (!MobilePerformanceOptimizer.instance) {
      MobilePerformanceOptimizer.instance = new MobilePerformanceOptimizer(config);
    }
    return MobilePerformanceOptimizer.instance;
  }

  private initialize(): void {
    if (typeof window === 'undefined') return;

    this.initializeNetworkDetection();
    this.initializeBatteryOptimization();
    this.initializeMemoryManagement();
    this.initializeRenderOptimization();
    this.initializeLazyLoading();
    this.initializeImageOptimization();
  }

  private initializeNetworkDetection(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.connectionType = connection.effectiveType || connection.type || 'unknown';
      
      connection.addEventListener('change', () => {
        this.connectionType = connection.effectiveType || connection.type || 'unknown';
        this.adjustPerformanceForNetwork();
      });
    }
  }

  private initializeBatteryOptimization(): void {
    if (!this.config.batteryOptimization) return;

    // Modern battery API detection
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBatteryStatus = () => {
          this.isLowBatteryMode = battery.level < 0.2 || battery.chargingTime === Infinity;
          this.adjustPerformanceForBattery();
        };

        battery.addEventListener('levelchange', updateBatteryStatus);
        battery.addEventListener('chargingchange', updateBatteryStatus);
        updateBatteryStatus();
      });
    }
  }

  private initializeMemoryManagement(): void {
    if (!this.config.memoryManagement) return;

    // Monitor memory usage
    const checkMemoryUsage = () => {
      if ('memory' in performance) {
        const memoryInfo = (performance as any).memory;
        const usedMemory = memoryInfo.usedJSHeapSize;
        
        if (usedMemory > this.memoryThreshold) {
          this.triggerMemoryCleanup();
        }
      }
    };

    // Check memory usage every 30 seconds
    setInterval(checkMemoryUsage, 30000);
  }

  private initializeRenderOptimization(): void {
    if (!this.config.renderOptimization) return;

    // Performance observer for render optimizations
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'longtask' && entry.duration > 50) {
            console.warn(`Long task detected: ${entry.duration}ms`, entry);
            this.optimizeForLongTasks();
          }
        }
      });

      try {

        this.performanceObserver.observe({ entryTypes: ['longtask'] });

    } catch (error) {
        console.error(error);
    `${src}?${urlParams.toString()}`;
  }

  private getSupportedImageFormats(): string[] {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const formats: string[] = [];
    
    // Test WebP support
    if (canvas.toDataURL('image/webp').startsWith('data:image/webp')) {
      formats.push('webp');
    }
    
    // Test AVIF support
    if (canvas.toDataURL('image/avif').startsWith('data:image/avif')) {
      formats.push('avif');
    }
    
    formats.push('jpg', 'png');
    return formats;
  }

  private isSlowConnection(): boolean {
    return ['slow-2g', '2g', '3g'].includes(this.connectionType);
  }

  private calculateLoadPriority(element: HTMLElement): 'high' | 'medium' | 'low' {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Above fold = high priority
    if (rect.top < viewportHeight) return 'high';
    
    // Near viewport = medium priority
    if (rect.top < viewportHeight * 2) return 'medium';
    
    return 'low';
  }

  private immediateLoad(element: HTMLElement): void {
    element.classList.add('loading-immediate');
    this.performLoad(element);
  }

  private deferredLoad(element: HTMLElement): void {
    element.classList.add('loading-deferred');
    requestIdleCallback(() => this.performLoad(element));
  }

  private performLoad(element: HTMLElement): void {
    // Implement actual loading logic based on element type
    if (element.tagName === 'IMG') {
      this.loadImage(element as HTMLImageElement);
    } else if (element.dataset.component) {
      this.loadComponent(element);
    }
  }

  private loadImage(img: HTMLImageElement): void {
    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }
  }

  private loadComponent(element: HTMLElement): void {
    // Trigger component loading
    const event = new CustomEvent('lazyLoad', { detail: { element } });
    element.dispatchEvent(event);
  }

  // Utility methods for performance adjustments
  private reduceImageQuality(): void {
    document.documentElement.style.setProperty('--image-quality', '70');
  }

  private restoreImageQuality(): void {
    document.documentElement.style.setProperty('--image-quality', '85');
  }

  private increaseLazyLoadingThreshold(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      // Reinitialize with smaller threshold
      this.initializeLazyLoading();
    }
  }

  private decreaseLazyLoadingThreshold(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.initializeLazyLoading();
    }
  }

  private disableNonCriticalAnimations(): void {
    document.documentElement.classList.add('reduce-animations');
  }

  private enableAnimations(): void {
    document.documentElement.classList.remove('reduce-animations');
  }

  private reduceUpdateFrequency(): void {
    window.dispatchEvent(new CustomEvent('reduceUpdateFrequency'));
  }

  private restoreUpdateFrequency(): void {
    window.dispatchEvent(new CustomEvent('restoreUpdateFrequency'));
  }

  private enableTimeSlicing(): void {
    window.dispatchEvent(new CustomEvent('enableTimeSlicing'));
  }

  private temporarilyReduceRenderFrequency(): void {
    document.documentElement.classList.add('reduced-render-frequency');
    
    setTimeout(() => {
      document.documentElement.classList.remove('reduced-render-frequency');
    }, 5000);
  }

  private clearImageCache(): void {
    // Clear cached images
    const images = document.querySelectorAll('img[data-cached]');
    images.forEach(img => {
      img.removeAttribute('data-cached');
    });
  }

  private clearComponentCache(): void {
    // Clear component caches
    window.dispatchEvent(new CustomEvent('clearComponentCache'));
  }

  // Public API methods
  public observeElement(element: HTMLElement): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.observe(element);
    }
  }

  public unobserveElement(element: HTMLElement): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.unobserve(element);
    }
  }

  public getNetworkInfo(): { type: string; isSlowConnection: boolean } {
    return {
      type: this.connectionType,
      isSlowConnection: this.isSlowConnection()
    };
  }

  public getBatteryInfo(): { isLowBatteryMode: boolean } {
    return {
      isLowBatteryMode: this.isLowBatteryMode
    };
  }

  public updateConfig(newConfig: Partial<MobilePerformanceConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Initialize the optimizer
export const mobilePerformanceOptimizer = MobilePerformanceOptimizer.getInstance();

// React hook for performance optimization
export const useMobilePerformance = () => {
  const [networkInfo, setNetworkInfo] = React.useState(
    mobilePerformanceOptimizer.getNetworkInfo()
  );
  
  const [batteryInfo, setBatteryInfo] = React.useState(
    mobilePerformanceOptimizer.getBatteryInfo()
  );

  React.useEffect(() => {
    const handleNetworkChange = () => {
      setNetworkInfo(mobilePerformanceOptimizer.getNetworkInfo());
    };

    const handleBatteryChange = (e: CustomEvent) => {
      setBatteryInfo({ isLowBatteryMode: e.detail.enabled });
    };

    window.addEventListener('networkchange', handleNetworkChange);
    window.addEventListener('batterySaverMode', handleBatteryChange as EventListener);

    return () => {
      window.removeEventListener('networkchange', handleNetworkChange);
      window.removeEventListener('batterySaverMode', handleBatteryChange as EventListener);
    };
  }, []);

  return { networkInfo, batteryInfo, optimizer: mobilePerformanceOptimizer };
};

export default mobilePerformanceOptimizer;