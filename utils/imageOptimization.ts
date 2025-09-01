/**
 * Image Optimization Utilities
 * Handles responsive images, lazy loading, and format optimization
 */

export interface ImageOptimizationOptions {
}
  quality?: number;
  format?: &apos;webp&apos; | &apos;avif&apos; | &apos;auto&apos;;
  sizes?: string;
  loading?: &apos;lazy&apos; | &apos;eager&apos;;
  placeholder?: &apos;blur&apos; | &apos;empty&apos;;
  priority?: boolean;
}

export interface ResponsiveImageSizes {
}
  sm: number;  // Mobile
  md: number;  // Tablet
  lg: number;  // Desktop
  xl: number;  // Large desktop
}

// Default responsive breakpoints
const DEFAULT_BREAKPOINTS: ResponsiveImageSizes = {
}
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280
};

/**
 * Generate responsive image srcset
 */
export const generateSrcSet = (
  baseSrc: string,
  sizes: ResponsiveImageSizes = DEFAULT_BREAKPOINTS,
  options: ImageOptimizationOptions = {}
): string => {
}
  const { quality = 80, format = &apos;auto&apos; } = options;
  
  const formats = format === &apos;auto&apos; ? [&apos;webp&apos;, &apos;jpg&apos;] : [format];
  const srcsetEntries: string[] = [];
  
  Object.entries(sizes).forEach(([breakpoint, width]) => {
}
    formats.forEach((fmt: any) => {
}
      // For now, return original src with width parameter
      // In production, this would integrate with image CDN
      const optimizedSrc = `${baseSrc}?w=${width}&q=${quality}&f=${fmt}`;
      srcsetEntries.push(`${optimizedSrc} ${width}w`);
    });
  });
  
  return srcsetEntries.join(&apos;, &apos;);
};

/**
 * Generate sizes attribute for responsive images
 */
export const generateSizes = (
  breakpoints: ResponsiveImageSizes = DEFAULT_BREAKPOINTS
): string => {
}
  return `(max-width: ${breakpoints.sm}px) ${breakpoints.sm}px, (max-width: ${breakpoints.md}px) ${breakpoints.md}px, (max-width: ${breakpoints.lg}px) ${breakpoints.lg}px, ${breakpoints.xl}px`;
};

/**
 * Optimized Image Component Props
 */
export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
}
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: ResponsiveImageSizes;
  optimization?: ImageOptimizationOptions;
  fallback?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Check if WebP is supported
 */
export const isWebPSupported = (): boolean => {
}
  if (typeof window === &apos;undefined&apos;) return false;
  
  const canvas = document.createElement(&apos;canvas&apos;);
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL(&apos;image/webp&apos;).indexOf(&apos;data:image/webp&apos;) === 0;
};

/**
 * Check if AVIF is supported
 */
export const isAVIFSupported = (): boolean => {
}
  if (typeof window === &apos;undefined&apos;) return false;
  
  const canvas = document.createElement(&apos;canvas&apos;);
  canvas.width = 1;
  canvas.height = 1;
  try {
}
    return canvas.toDataURL(&apos;image/avif&apos;).indexOf(&apos;data:image/avif&apos;) === 0;
  } catch {
}
    return false;
  }
};

/**
 * Get optimal image format based on browser support
 */
export const getOptimalFormat = (): &apos;avif&apos; | &apos;webp&apos; | &apos;jpg&apos; => {
}
  if (isAVIFSupported()) return &apos;avif&apos;;
  if (isWebPSupported()) return &apos;webp&apos;;
  return &apos;jpg&apos;;
};

/**
 * Preload critical images
 */
export const preloadImage = (src: string, options: ImageOptimizationOptions = {}): Promise<void> => {
}
  return new Promise((resolve, reject) => {
}
    const img = new Image();
    
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    
    // Apply optimizations
    if (options.sizes) {
}
      img.srcset = generateSrcSet(src, options.sizes, options);
      img.sizes = generateSizes(options.sizes);
    }
    
    img.src = src;
  });
};

/**
 * Lazy load images with Intersection Observer
 */
export class LazyImageLoader {
}
  private observer: IntersectionObserver | null = null;
  private images: Set<HTMLImageElement> = new Set();

  constructor(options: IntersectionObserverInit = {}) {
}
    if (typeof window === &apos;undefined&apos; || !(&apos;IntersectionObserver&apos; in window)) {
}
      return;
    }

    this.observer = new IntersectionObserver((entries: any) => {
}
      entries.forEach((entry: any) => {
}
        if (entry.isIntersecting) {
}
          const img = entry.target as HTMLImageElement;
          this.loadImage(img);
          this.observer?.unobserve(img);
          this.images.delete(img);
        }
      });
    }, {
}
      rootMargin: &apos;50px&apos;,
      threshold: 0.1,
      ...options
    });
  }

  observe(img: HTMLImageElement): void {
}
    if (!this.observer) {
}
      // Fallback: load immediately if no Intersection Observer
      this.loadImage(img);
      return;
    }

    this.images.add(img);
    this.observer.observe(img);
  }

  unobserve(img: HTMLImageElement): void {
}
    if (this.observer) {
}
      this.observer.unobserve(img);
      this.images.delete(img);
    }
  }

  private loadImage(img: HTMLImageElement): void {
}
    const dataSrc = img.dataset.src;
    const dataSrcset = img.dataset.srcset;
    const dataSizes = img.dataset.sizes;

    if (dataSrc) {
}
      img.src = dataSrc;
      img.removeAttribute(&apos;data-src&apos;);
    }

    if (dataSrcset) {
}
      img.srcset = dataSrcset;
      img.removeAttribute(&apos;data-srcset&apos;);
    }

    if (dataSizes) {
}
      img.sizes = dataSizes;
      img.removeAttribute(&apos;data-sizes&apos;);
    }

    img.classList.remove(&apos;lazy&apos;);
    img.classList.add(&apos;loaded&apos;);
  }

  destroy(): void {
}
    if (this.observer) {
}
      this.images.forEach((img: any) => this.observer?.unobserve(img));
      this.observer.disconnect();
      this.images.clear();
    }
  }
}

/**
 * Create a singleton lazy loader instance
 */
export const lazyImageLoader = new LazyImageLoader();

/**
 * Image placeholder utilities
 */
export const generatePlaceholder = (width: number, height: number, color = &apos;#f3f4f6&apos;): string => {
}
  if (typeof window === &apos;undefined&apos;) {
}
    return `data:image/svg+xml;base64,${btoa(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${color}"/></svg>`)}`;
  }

  const canvas = document.createElement(&apos;canvas&apos;);
  const ctx = canvas.getContext(&apos;2d&apos;);
  
  canvas.width = width;
  canvas.height = height;
  
  if (ctx) {
}
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
  }
  
  return canvas.toDataURL();
};

/**
 * Blur placeholder for smooth loading
 */
export const generateBlurPlaceholder = (width: number, height: number): string => {
}
  const smallWidth = Math.max(1, Math.floor(width / 10));
  const smallHeight = Math.max(1, Math.floor(height / 10));
  
  return generatePlaceholder(smallWidth, smallHeight, &apos;#e5e7eb&apos;);
};

/**
 * Performance monitoring for images
 */
export class ImagePerformanceMonitor {
}
  private metrics: Map<string, number> = new Map();

  startLoading(src: string): void {
}
    this.metrics.set(src, performance.now());
  }

  endLoading(src: string): number {
}
    const startTime = this.metrics.get(src);
    if (!startTime) return 0;
    
    const loadTime = performance.now() - startTime;
    this.metrics.delete(src);
    
    // Log slow loading images in development
    if (process.env.NODE_ENV === &apos;development&apos; && loadTime > 1000) {
}
      console.warn(`Slow image load: ${src} took ${loadTime.toFixed(2)}ms`);
    }
    
    return loadTime;
  }

  getAverageLoadTime(): number {
}
    const times = Array.from(this.metrics.values());
    if (times.length === 0) return 0;
    
    const total = times.reduce((sum, time) => sum + time, 0);
    return total / times.length;
  }
}

export const imagePerformanceMonitor = new ImagePerformanceMonitor();

/**
 * Image compression utilities (for user uploads)
 */
export const compressImage = (
  file: File,
  options: { quality?: number; maxWidth?: number; maxHeight?: number; format?: string } = {}
): Promise<Blob> => {
}
  const { quality = 0.8, maxWidth = 1920, maxHeight = 1080, format = &apos;image/jpeg&apos; } = options;

  return new Promise((resolve, reject) => {
}
    const canvas = document.createElement(&apos;canvas&apos;);
    const ctx = canvas.getContext(&apos;2d&apos;);
    const img = new Image();

    img.onload = () => {
}
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth) {
}
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
}
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob: any) => {
}
          if (blob) {
}
            resolve(blob);
          } else {
}
            reject(new Error(&apos;Failed to compress image&apos;));
          }
        },
        format,
//         quality
      );
    };

    img.onerror = () => reject(new Error(&apos;Failed to load image for compression&apos;));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Critical image preloading for above-the-fold content
 */
export const preloadCriticalImages = async (images: string[]): Promise<void> => {
}
  const preloadPromises = images.map((src: any) => preloadImage(src, { priority: true }));
  
  try {
}
    await Promise.allSettled(preloadPromises);
  } catch (error) {
}
    console.warn(&apos;Some critical images failed to preload:&apos;, error);
  }
};

/**
 * Image optimization configuration
 */
export const ImageConfig = {
}
  // Sizes for different use cases
  AVATAR_SIZES: { sm: 32, md: 64, lg: 128, xl: 256 },
  THUMBNAIL_SIZES: { sm: 150, md: 300, lg: 600, xl: 1200 },
  HERO_SIZES: { sm: 640, md: 1024, lg: 1920, xl: 2560 },
  CARD_SIZES: { sm: 280, md: 400, lg: 600, xl: 800 },
  
  // Default optimization settings
  DEFAULT_QUALITY: 80,
  THUMBNAIL_QUALITY: 75,
  HERO_QUALITY: 85,
  
  // Lazy loading settings
  LAZY_ROOT_MARGIN: &apos;50px&apos;,
  LAZY_THRESHOLD: 0.1
} as const;