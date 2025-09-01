/**
 * Image Optimizer - Advanced Image Loading and Optimization System
 * Implements modern image formats, responsive loading, and intelligent optimization
 */

interface ImageOptimizationOptions {
}
  quality?: number; // 0-100
  format?: &apos;webp&apos; | &apos;avif&apos; | &apos;jpeg&apos; | &apos;png&apos; | &apos;auto&apos;;
  sizes?: string;
  lazy?: boolean;
  blur?: boolean;
  placeholder?: &apos;blur&apos; | &apos;empty&apos; | &apos;skeleton&apos;;
  priority?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

interface ResponsiveImageSet {
}
  src: string;
  srcSet: string;
  sizes: string;
  placeholder?: string;
  blurDataURL?: string;
}

interface ImageMetrics {
}
  totalImages: number;
  loadedImages: number;
  failedImages: number;
  averageLoadTime: number;
  totalDataSaved: number;
}

class ImageOptimizer {
}
  private static instance: ImageOptimizer;
  private observer: IntersectionObserver | null = null;
  private loadingImages: Map<string, Promise<HTMLImageElement>> = new Map();
  private imageCache: Map<string, HTMLImageElement> = new Map();
  private metrics: ImageMetrics = {
}
    totalImages: 0,
    loadedImages: 0,
    failedImages: 0,
    averageLoadTime: 0,
    totalDataSaved: 0
  };
  private formatSupport: Map<string, boolean> = new Map();

  static getInstance(): ImageOptimizer {
}
    if (!ImageOptimizer.instance) {
}
      ImageOptimizer.instance = new ImageOptimizer();
    }
    return ImageOptimizer.instance;
  }

  constructor() {
}
    if (typeof window !== &apos;undefined&apos;) {
}
      this.initializeFormatSupport();
      this.setupIntersectionObserver();
      this.setupPerformanceMonitoring();
    }
  }

  private async initializeFormatSupport() {
}
    // Test WebP support
    const webpSupport = await this.testImageFormat(&apos;data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA&apos;);
    this.formatSupport.set(&apos;webp&apos;, webpSupport);

    // Test AVIF support
    const avifSupport = await this.testImageFormat(&apos;data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=&apos;);
    this.formatSupport.set(&apos;avif&apos;, avifSupport);

    console.log(&apos;Image format support:&apos;, Object.fromEntries(this.formatSupport));
  }

  private testImageFormat(dataURL: string): Promise<boolean> {
}
    return new Promise((resolve: any) => {
}
      const img = new Image();
      img.onload = () => resolve(img.width > 0 && img.height > 0);
      img.onerror = () => resolve(false);
      img.src = dataURL;
    });
  }

  private setupIntersectionObserver() {
}
    if (&apos;IntersectionObserver&apos; in window) {
}
      this.observer = new IntersectionObserver(
        (entries: any) => {
}
          entries.forEach((entry: any) => {
}
            if (entry.isIntersecting) {
}
              const img = entry.target as HTMLImageElement;
              this.loadLazyImage(img);
              this.observer?.unobserve(img);
            }
          });
        },
        {
}
          rootMargin: &apos;50px&apos;,
          threshold: 0.01
        }
      );
    }
  }

  private setupPerformanceMonitoring() {
}
    if (&apos;PerformanceObserver&apos; in window) {
}
      const observer = new PerformanceObserver((list: any) => {
}
        list.getEntries().forEach((entry: any) => {
}
          if (entry.entryType === &apos;resource&apos; && 
              (entry.name.includes(&apos;.jpg&apos;) || 
               entry.name.includes(&apos;.png&apos;) || 
               entry.name.includes(&apos;.webp&apos;) || 
               entry.name.includes(&apos;.avif&apos;))) {
}
            this.recordImageLoadMetric(entry as PerformanceResourceTiming);
          }
        });
      });
      
      observer.observe({ entryTypes: [&apos;resource&apos;] });
    }
  }

  private recordImageLoadMetric(entry: PerformanceResourceTiming) {
}
    const loadTime = entry.responseEnd - entry.requestStart;
    const transferSize = entry.transferSize || 0;

    this.metrics.totalImages++;
    this.metrics.averageLoadTime = 
      (this.metrics.averageLoadTime * (this.metrics.loadedImages) + loadTime) / 
      (this.metrics.loadedImages + 1);
    this.metrics.loadedImages++;

    // Estimate data saved if modern format used
    if (entry.name.includes(&apos;.webp&apos;) || entry.name.includes(&apos;.avif&apos;)) {
}
      this.metrics.totalDataSaved += Math.round(transferSize * 0.3); // Assume 30% savings
    }

    if (import.meta.env.DEV) {
}
      console.log(`Image loaded: ${entry.name.split(&apos;/&apos;).pop()} (${loadTime.toFixed(2)}ms, ${Math.round(transferSize/1024)}KB)`);
    }
  }

  private async loadLazyImage(img: HTMLImageElement) {
}
    const src = img.dataset.src;
    if (!src) return;

    try {
}
      const optimizedSrc = this.getOptimizedImageSrc(src, {
}
        format: &apos;auto&apos;,
        quality: 85
      });

      await this.loadImage(optimizedSrc);
      img.src = optimizedSrc;
      img.classList.add(&apos;loaded&apos;);
      img.removeAttribute(&apos;data-src&apos;);
    } catch (error) {
}
      console.warn(&apos;Failed to load lazy image:&apos;, src, error);
      this.metrics.failedImages++;
      img.classList.add(&apos;error&apos;);
    }
  }

  public getOptimizedImageSrc(
    src: string, 
    options: ImageOptimizationOptions = {}
  ): string {
}
    const {
}
      quality = 85,
      format = &apos;auto&apos;
    } = options;

    // If it&apos;s already a data URL or external URL, return as-is
    if (src.startsWith(&apos;data:&apos;) || src.startsWith(&apos;http&apos;)) {
}
      return src;
    }

    // Get optimal format
    const optimalFormat = this.getOptimalFormat(format);
    
    // Build optimized URL (this would typically point to an image optimization service)
    const params = new URLSearchParams({
}
      q: quality.toString(),
      f: optimalFormat,
      ...(options.sizes && { w: this.extractWidthFromSizes(options.sizes) })
    });

    return `${src}?${params.toString()}`;
  }

  private getOptimalFormat(requested: string): string {
}
    if (requested === &apos;auto&apos;) {
}
      if (this.formatSupport.get(&apos;avif&apos;)) return &apos;avif&apos;;
      if (this.formatSupport.get(&apos;webp&apos;)) return &apos;webp&apos;;
      return &apos;jpeg&apos;;
    }
    
    if (this.formatSupport.get(requested)) {
}
      return requested;
    }
    
    return &apos;jpeg&apos;; // Fallback
  }

  private extractWidthFromSizes(sizes: string): string {
}
    // Extract the largest width from sizes string
    const matches = sizes.match(/(\d+)px/g);
    if (!matches) return &apos;800&apos;;
    
    const widths = matches.map((m: any) => parseInt(m.replace(&apos;px&apos;, &apos;&apos;)));
    return Math.max(...widths).toString();
  }

  public createResponsiveImageSet(
    src: string,
    options: ImageOptimizationOptions = {}
  ): ResponsiveImageSet {
}
    const baseUrl = src.replace(/\.(jpg|jpeg|png|webp|avif)$/i, &apos;&apos;);
    const extension = src.match(/\.(jpg|jpeg|png|webp|avif)$/i)?.[1] || &apos;jpg&apos;;
    
    // Common breakpoints
    const breakpoints = [320, 640, 768, 1024, 1280, 1536];
    const format = this.getOptimalFormat(options.format || &apos;auto&apos;);
    
    // Generate srcSet
    const srcSet = breakpoints.map((width: any) => {
}
      const params = new URLSearchParams({
}
        w: width.toString(),
        q: (options.quality || 85).toString(),
        f: format
      });
      return `${baseUrl}.${extension}?${params.toString()} ${width}w`;
    }).join(&apos;, &apos;);

    // Generate sizes
    const sizes = options.sizes || `
      (max-width: 640px) 100vw,
      (max-width: 1024px) 80vw,
//       60vw
    `.replace(/\s+/g, &apos; &apos;).trim();

    // Generate optimized src
    const optimizedSrc = this.getOptimizedImageSrc(src, {
}
      ...options,
      quality: options.quality || 85
    });

    return {
}
      src: optimizedSrc,
      srcSet,
      sizes,
      placeholder: this.generatePlaceholder(src, options.placeholder),
      blurDataURL: options.blur ? this.generateBlurDataURL(src) : undefined
    };
  }

  private generatePlaceholder(src: string, type: ImageOptimizationOptions[&apos;placeholder&apos;] = &apos;skeleton&apos;): string {
}
    switch (type) {
}
      case &apos;blur&apos;:
        return this.generateBlurDataURL(src);
      case &apos;empty&apos;:
        return &apos;data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InRyYW5zcGFyZW50Ii8+PC9zdmc+&apos;;
      case &apos;skeleton&apos;:
      default:
        return this.generateSkeletonPlaceholder();
    }
  }

  private generateBlurDataURL(src: string): string {
}
    // In a real implementation, this would generate a low-quality blur
    // For now, return a simple gray placeholder
    return &apos;data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9IiNmM2Y0ZjYiLz48L3N2Zz4=&apos;;
  }

  private generateSkeletonPlaceholder(): string {
}
    return `data:image/svg+xml;base64,${btoa(`
}
      <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <rect x="20" y="20" width="60%" height="20" fill="#e5e7eb" rx="4">
          <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite"/>
        </rect>
        <rect x="20" y="50" width="80%" height="15" fill="#e5e7eb" rx="4">
          <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" begin="0.3s"/>
        </rect>
        <rect x="20" y="75" width="40%" height="15" fill="#e5e7eb" rx="4">
          <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" begin="0.6s"/>
        </rect>
      </svg>
    `)}`;
  }

  public async loadImage(src: string): Promise<HTMLImageElement> {
}
    // Check cache first
    if (this.imageCache.has(src)) {
}
      return this.imageCache.get(src)!;
    }

    // Check if already loading
    if (this.loadingImages.has(src)) {
}
      return this.loadingImages.get(src)!;
    }

    const loadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
}
      const img = new Image();
      const startTime = performance.now();

      img.onload = () => {
}
        const loadTime = performance.now() - startTime;
        this.recordImageLoadTime(src, loadTime);
        this.imageCache.set(src, img);
        resolve(img);
      };

      img.onerror = () => {
}
        this.metrics.failedImages++;
        reject(new Error(`Failed to load image: ${src}`));
      };

      img.src = src;
    });

    // Cache the promise to prevent duplicate requests
    this.loadingImages.set(src, loadPromise);

    try {
}
      const img = await loadPromise;
      return img;
    } finally {
}
      this.loadingImages.delete(src);
    }
  }

  private recordImageLoadTime(src: string, loadTime: number) {
}
    if (import.meta.env.DEV) {
}
      console.log(`Image load time: ${src.split(&apos;/&apos;).pop()} - ${loadTime.toFixed(2)}ms`);
    }
  }

  public optimizeExistingImages() {
}
    const images = document.querySelectorAll(&apos;img:not([data-optimized])&apos;);
    
    images.forEach((img: any) => {
}
      this.optimizeImageElement(img as HTMLImageElement);
    });
  }

  private optimizeImageElement(img: HTMLImageElement) {
}
    // Mark as optimized to prevent reprocessing
    img.dataset.optimized = &apos;true&apos;;

    // Add lazy loading if not already present
    if (!img.hasAttribute(&apos;loading&apos;) && !img.hasAttribute(&apos;data-priority&apos;)) {
}
      const rect = img.getBoundingClientRect();
      if (rect.top > window.innerHeight) {
}
        img.loading = &apos;lazy&apos;;
      }
    }

    // Add proper sizing attributes if missing
    if (!img.hasAttribute(&apos;width&apos;) || !img.hasAttribute(&apos;height&apos;)) {
}
      img.addEventListener(&apos;load&apos;, () => {
}
        if (!img.hasAttribute(&apos;width&apos;)) {
}
          img.setAttribute(&apos;width&apos;, img.naturalWidth.toString());
        }
        if (!img.hasAttribute(&apos;height&apos;)) {
}
          img.setAttribute(&apos;height&apos;, img.naturalHeight.toString());
        }
      }, { once: true });
    }

    // Set up lazy loading observer
    if (img.dataset.src && this.observer) {
}
      this.observer.observe(img);
    }
  }

  public preloadImage(src: string, options: ImageOptimizationOptions = {}): Promise<HTMLImageElement> {
}
    const optimizedSrc = this.getOptimizedImageSrc(src, options);
    return this.loadImage(optimizedSrc);
  }

  public preloadImages(sources: string[], options: ImageOptimizationOptions = {}): Promise<HTMLImageElement[]> {
}
    const promises = sources.map((src: any) => this.preloadImage(src, options));
    return Promise.all(promises);
  }

  public getMetrics(): ImageMetrics {
}
    return { ...this.metrics };
  }

  public clearCache() {
}
    this.imageCache.clear();
    this.loadingImages.clear();
  }

  public destroy() {
}
    if (this.observer) {
}
      this.observer.disconnect();
      this.observer = null;
    }
    this.clearCache();
  }
}

// React component for optimized images
interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
}
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: &apos;webp&apos; | &apos;avif&apos; | &apos;jpeg&apos; | &apos;png&apos; | &apos;auto&apos;;
  lazy?: boolean;
  priority?: boolean;
  placeholder?: &apos;blur&apos; | &apos;empty&apos; | &apos;skeleton&apos;;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  sizes?: string;
  className?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
}
  src,
  alt,
  width,
  height,
  quality = 85,
  format = &apos;auto&apos;,
  lazy = true,
  priority = false,
  placeholder = &apos;skeleton&apos;,
  onLoad,
  onError,
  sizes,
  className = &apos;&apos;,
  ...props
}: any) => {
}
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const [placeholderSrc, setPlaceholderSrc] = React.useState<string>(&apos;&apos;);
  const imgRef = React.useRef<HTMLImageElement>(null);
  const optimizer = ImageOptimizer.getInstance();

  React.useEffect(() => {
}
    if (placeholder) {
}
      const placeholderUrl = optimizer.generatePlaceholder(src, placeholder);
      setPlaceholderSrc(placeholderUrl);
    }
  }, [src, placeholder]);

  const responsiveSet = React.useMemo(() => {
}
    return optimizer.createResponsiveImageSet(src, {
}
      quality,
      format,
      sizes,
      lazy,
      placeholder,
//       priority
    });
  }, [src, quality, format, sizes, lazy, placeholder, priority]);

  const handleLoad = React.useCallback(() => {
}
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = React.useCallback(() => {
}
    setHasError(true);
    onError?.(new Error(`Failed to load image: ${src}`));
  }, [src, onError]);

  // Preload if priority
  React.useEffect(() => {
}
    if (priority) {
}
      optimizer.preloadImage(src, { quality, format });
    }
  }, [src, priority, quality, format]);

  if (hasError) {
}
    return (
      <div 
        className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-400 text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {/* Placeholder */}
      {!isLoaded && placeholderSrc && (
}
        <img
          src={placeholderSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
      )}
      
      {/* Main image */}
      <img
        ref={imgRef}
        src={responsiveSet.src}
        srcSet={responsiveSet.srcSet}
        sizes={responsiveSet.sizes}
        alt={alt}
        width={width}
        height={height}
        loading={lazy && !priority ? &apos;lazy&apos; : &apos;eager&apos;}
        onLoad={handleLoad}
        onError={handleError}
        className={`
}
          transition-opacity duration-300
          ${isLoaded ? &apos;opacity-100&apos; : &apos;opacity-0&apos;}
          ${!isLoaded && &apos;absolute inset-0&apos;}
          w-full h-full object-cover
        `}
        {...props}
      />
      
      {/* Loading indicator */}
      {!isLoaded && !placeholderSrc && (
}
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}
    </div>
  );
};

// Hook for image optimization
export const useImageOptimization = () => {
}
  const optimizer = ImageOptimizer.getInstance();

  const optimizeImage = React.useCallback((
    src: string, 
    options: ImageOptimizationOptions = {}
  ) => {
}
    return optimizer.getOptimizedImageSrc(src, options);
  }, [optimizer]);

  const preloadImage = React.useCallback((
    src: string, 
    options: ImageOptimizationOptions = {}
  ) => {
}
    return optimizer.preloadImage(src, options);
  }, [optimizer]);

  const getMetrics = React.useCallback(() => {
}
    return optimizer.getMetrics();
  }, [optimizer]);

  return {
}
    optimizeImage,
    preloadImage,
//     getMetrics
  };
};

export default ImageOptimizer.getInstance();