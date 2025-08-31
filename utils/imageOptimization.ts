/**
 * Image Optimization Utilities
 * Handles responsive images, lazy loading, and format optimization
 */

export interface ImageOptimizationOptions {
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
  sizes?: string;
  loading?: 'lazy' | 'eager';
  placeholder?: 'blur' | 'empty';
  priority?: boolean;
}

export interface ResponsiveImageSizes {
  sm: number;  // Mobile
  md: number;  // Tablet
  lg: number;  // Desktop
  xl: number;  // Large desktop
}

// Default responsive breakpoints
const DEFAULT_BREAKPOINTS: ResponsiveImageSizes = {
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
  const { quality = 80, format = 'auto' } = options;
  
  const formats = format === 'auto' ? ['webp', 'jpg'] : [format];
  const srcsetEntries: string[] = [];
  
  Object.entries(sizes).forEach(([breakpoint, width]) => {
    formats.forEach(fmt => {
      // For now, return original src with width parameter
      // In production, this would integrate with image CDN
      const optimizedSrc = `${baseSrc}?w=${width}&q=${quality}&f=${fmt}`;
      srcsetEntries.push(`${optimizedSrc} ${width}w`);
    });
  });
  
  return srcsetEntries.join(', ');
};

/**
 * Generate sizes attribute for responsive images
 */
export const generateSizes = (
  breakpoints: ResponsiveImageSizes = DEFAULT_BREAKPOINTS
): string => {
  return `(max-width: ${breakpoints.sm}px) ${breakpoints.sm}px, (max-width: ${breakpoints.md}px) ${breakpoints.md}px, (max-width: ${breakpoints.lg}px) ${breakpoints.lg}px, ${breakpoints.xl}px`;
};

/**
 * Optimized Image Component Props
 */
export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
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
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

/**
 * Check if AVIF is supported
 */
export const isAVIFSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  try {
    return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
  } catch {
    return false;
  }
};

/**
 * Get optimal image format based on browser support
 */
export const getOptimalFormat = (): 'avif' | 'webp' | 'jpg' => {
  if (isAVIFSupported()) return 'avif';
  if (isWebPSupported()) return 'webp';
  return 'jpg';
};

/**
 * Preload critical images
 */
export const preloadImage = (src: string, options: ImageOptimizationOptions = {}): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    
    // Apply optimizations
    if (options.sizes) {
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
  private observer: IntersectionObserver | null = null;
  private images: Set<HTMLImageElement> = new Set();

  constructor(options: IntersectionObserverInit = {}) {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          this.loadImage(img);
          this.observer?.unobserve(img);
          this.images.delete(img);
        }
      });
    }, {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    });
  }

  observe(img: HTMLImageElement): void {
    if (!this.observer) {
      // Fallback: load immediately if no Intersection Observer
      this.loadImage(img);
      return;
    }

    this.images.add(img);
    this.observer.observe(img);
  }

  unobserve(img: HTMLImageElement): void {
    if (this.observer) {
      this.observer.unobserve(img);
      this.images.delete(img);
    }
  }

  private loadImage(img: HTMLImageElement): void {
    const dataSrc = img.dataset.src;
    const dataSrcset = img.dataset.srcset;
    const dataSizes = img.dataset.sizes;

    if (dataSrc) {
      img.src = dataSrc;
      img.removeAttribute('data-src');
    }

    if (dataSrcset) {
      img.srcset = dataSrcset;
      img.removeAttribute('data-srcset');
    }

    if (dataSizes) {
      img.sizes = dataSizes;
      img.removeAttribute('data-sizes');
    }

    img.classList.remove('lazy');
    img.classList.add('loaded');
  }

  destroy(): void {
    if (this.observer) {
      this.images.forEach(img => this.observer?.unobserve(img));
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
export const generatePlaceholder = (width: number, height: number, color = '#f3f4f6'): string => {
  if (typeof window === 'undefined') {
    return `data:image/svg+xml;base64,${btoa(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${color}"/></svg>`)}`;
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = width;
  canvas.height = height;
  
  if (ctx) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
  }
  
  return canvas.toDataURL();
};

/**
 * Blur placeholder for smooth loading
 */
export const generateBlurPlaceholder = (width: number, height: number): string => {
  const smallWidth = Math.max(1, Math.floor(width / 10));
  const smallHeight = Math.max(1, Math.floor(height / 10));
  
  return generatePlaceholder(smallWidth, smallHeight, '#e5e7eb');
};

/**
 * Performance monitoring for images
 */
export class ImagePerformanceMonitor {
  private metrics: Map<string, number> = new Map();

  startLoading(src: string): void {
    this.metrics.set(src, performance.now());
  }

  endLoading(src: string): number {
    const startTime = this.metrics.get(src);
    if (!startTime) return 0;
    
    const loadTime = performance.now() - startTime;
    this.metrics.delete(src);
    
    // Log slow loading images in development
    if (process.env.NODE_ENV === 'development' && loadTime > 1000) {
      console.warn(`Slow image load: ${src} took ${loadTime.toFixed(2)}ms`);
    }
    
    return loadTime;
  }

  getAverageLoadTime(): number {
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
  const { quality = 0.8, maxWidth = 1920, maxHeight = 1080, format = 'image/jpeg' } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        format,
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image for compression'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Critical image preloading for above-the-fold content
 */
export const preloadCriticalImages = async (images: string[]): Promise<void> => {
  const preloadPromises = images.map(src => preloadImage(src, { priority: true }));
  
  try {
    await Promise.allSettled(preloadPromises);
  } catch (error) {
    console.warn('Some critical images failed to preload:', error);
  }
};

/**
 * Image optimization configuration
 */
export const ImageConfig = {
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
  LAZY_ROOT_MARGIN: '50px',
  LAZY_THRESHOLD: 0.1
} as const;