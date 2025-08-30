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
      } catch (e) {
        // Long task API not supported
      }
    }
  }

  private initializeLazyLoading(): void {
    if (!this.config.enableLazyLoading) return;

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            this.loadElement(element);
            this.intersectionObserver?.unobserve(element);
          }
        });
      },
      {
        rootMargin: this.isSlowConnection() ? '50px' : '100px',
        threshold: 0.1
      }
    );
  }

  private initializeImageOptimization(): void {
    if (!this.config.enableImageOptimization) return;

    // Automatically optimize images for mobile
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[data-optimize]');
      images.forEach((img) => this.optimizeImage(img as HTMLImageElement));
    };

    // Run optimization on DOM changes
    const observer = new MutationObserver(optimizeImages);
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Initial optimization
    optimizeImages();
  }

  private adjustPerformanceForNetwork(): void {
    const isSlowNetwork = this.isSlowConnection();
    
    // Adjust image quality and lazy loading thresholds
    if (isSlowNetwork) {
      this.reduceImageQuality();
      this.increaseLazyLoadingThreshold();
      this.disableNonCriticalAnimations();
    } else {
      this.restoreImageQuality();
      this.decreaseLazyLoadingThreshold();
      this.enableAnimations();
    }
  }

  private adjustPerformanceForBattery(): void {
    if (this.isLowBatteryMode) {
      this.enableBatterySaverMode();
    } else {
      this.disableBatterySaverMode();
    }
  }

  private enableBatterySaverMode(): void {
    // Reduce animation frequency
    document.documentElement.style.setProperty('--animation-duration', '0.5s');
    
    // Disable non-essential features
    this.disableNonCriticalAnimations();
    this.reduceUpdateFrequency();
    
    // Emit event for app components to adjust
    window.dispatchEvent(new CustomEvent('batterySaverMode', { detail: { enabled: true } }));
  }

  private disableBatterySaverMode(): void {
    document.documentElement.style.removeProperty('--animation-duration');
    this.enableAnimations();
    this.restoreUpdateFrequency();
    
    window.dispatchEvent(new CustomEvent('batterySaverMode', { detail: { enabled: false } }));
  }

  private triggerMemoryCleanup(): void {
    // Clear unnecessary caches
    this.clearImageCache();
    this.clearComponentCache();
    
    // Force garbage collection if available
    if ('gc' in window) {
      (window as any).gc();
    }
    
    // Emit memory warning event
    window.dispatchEvent(new CustomEvent('memoryWarning', { 
      detail: { 
        usedMemory: (performance as any).memory?.usedJSHeapSize 
      } 
    }));
  }

  private optimizeForLongTasks(): void {
    // Implement time slicing for heavy operations
    this.enableTimeSlicing();
    
    // Reduce render frequency temporarily
    this.temporarilyReduceRenderFrequency();
  }

  private loadElement(element: HTMLElement): void {
    // Smart loading based on network and battery conditions
    const priority = this.calculateLoadPriority(element);
    
    if (priority === 'high' || (!this.isSlowConnection() && !this.isLowBatteryMode)) {
      this.immediateLoad(element);
    } else {
      this.deferredLoad(element);
    }
  }

  private optimizeImage(img: HTMLImageElement): void {
    if (!img.dataset.optimize) return;
    
    const devicePixelRatio = window.devicePixelRatio || 1;
    const isRetina = devicePixelRatio >= 2;
    const isSlowNetwork = this.isSlowConnection();
    
    // Calculate optimal image dimensions
    const rect = img.getBoundingClientRect();
    const optimalWidth = Math.ceil(rect.width * (isRetina && !isSlowNetwork ? 2 : 1));
    const optimalHeight = Math.ceil(rect.height * (isRetina && !isSlowNetwork ? 2 : 1));
    
    // Set optimal format based on browser support
    const supportedFormats = this.getSupportedImageFormats();
    let format = 'webp';
    
    if (!supportedFormats.includes('webp')) {
      format = 'jpg';
    }
    
    // Update image source with optimized parameters
    const originalSrc = img.dataset.optimize;
    const optimizedSrc = this.buildOptimizedImageUrl(originalSrc, {
      width: optimalWidth,
      height: optimalHeight,
      format,
      quality: isSlowNetwork ? 70 : 85
    });
    
    img.src = optimizedSrc;
    img.removeAttribute('data-optimize');
  }

  private buildOptimizedImageUrl(src: string, params: any): string {
    // This would integrate with your image optimization service
    const urlParams = new URLSearchParams({
      w: params.width.toString(),
      h: params.height.toString(),
      f: params.format,
      q: params.quality.toString()
    });
    
    return `${src}?${urlParams.toString()}`;
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