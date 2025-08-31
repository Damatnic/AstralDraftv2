/**
 * Responsive Layout System - Advanced Mobile-First Design
 * Comprehensive responsive utilities, breakpoint management, and adaptive layouts
 */

import React, { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// =========================================
// BREAKPOINT SYSTEM
// =========================================

export const breakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  '3xl': '1920px',
  '4xl': '2560px'
} as const;

export type Breakpoint = keyof typeof breakpoints;

// =========================================
// RESPONSIVE HOOKS
// =========================================

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

export const useBreakpoint = (breakpoint: Breakpoint): boolean => {
  return useMediaQuery(`(min-width: ${breakpoints[breakpoint]})`);
};

export const useCurrentBreakpoint = (): Breakpoint => {
  const isXs = useBreakpoint('xs');
  const isSm = useBreakpoint('sm');
  const isMd = useBreakpoint('md');
  const isLg = useBreakpoint('lg');
  const isXl = useBreakpoint('xl');
  const is2xl = useBreakpoint('2xl');
  const is3xl = useBreakpoint('3xl');
  const is4xl = useBreakpoint('4xl');

  if (is4xl) return '4xl';
  if (is3xl) return '3xl';
  if (is2xl) return '2xl';
  if (isXl) return 'xl';
  if (isLg) return 'lg';
  if (isMd) return 'md';
  if (isSm) return 'sm';
  if (isXs) return 'xs';
  return 'xs'; // fallback for mobile
};

export const useViewportSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// =========================================
// RESPONSIVE CONTAINERS
// =========================================

interface ContainerProps {
  children: ReactNode;
  maxWidth?: Breakpoint | 'full' | 'none';
  padding?: boolean;
  center?: boolean;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = 'xl',
  padding = true,
  center = true,
  className = ''
}) => {
  const maxWidthClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-full',
    none: ''
  };

  const classes = [
    'w-full',
    maxWidth !== 'none' ? maxWidthClasses[maxWidth] : '',
    center ? 'mx-auto' : '',
    padding ? 'px-4 sm:px-6 lg:px-8' : '',
    className
  ].filter(Boolean).join(' ');

  return <div className={classes}>{children}</div>;
};

// =========================================
// RESPONSIVE GRID SYSTEM
// =========================================

interface GridProps {
  children: ReactNode;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  } | number;
  className?: string;
}

export const ResponsiveGrid: React.FC<GridProps> = ({
  children,
  cols = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 4,
  className = ''
}) => {
  const colClasses = [];
  const gapClasses = [];

  // Handle columns
  Object.entries(cols).forEach(([breakpoint, colCount]) => {
    if (breakpoint === 'xs') {
      colClasses.push(`grid-cols-${colCount}`);
    } else {
      colClasses.push(`${breakpoint}:grid-cols-${colCount}`);
    }
  });

  // Handle gap
  if (typeof gap === 'number') {
    gapClasses.push(`gap-${gap}`);
  } else {
    Object.entries(gap).forEach(([breakpoint, gapSize]) => {
      if (breakpoint === 'xs') {
        gapClasses.push(`gap-${gapSize}`);
      } else {
        gapClasses.push(`${breakpoint}:gap-${gapSize}`);
      }
    });
  }

  const classes = [
    'grid',
    ...colClasses,
    ...gapClasses,
    className
  ].filter(Boolean).join(' ');

  return <div className={classes}>{children}</div>;
};

// =========================================
// RESPONSIVE SHOW/HIDE
// =========================================

interface ShowProps {
  children: ReactNode;
  above?: Breakpoint;
  below?: Breakpoint;
  only?: Breakpoint | Breakpoint[];
}

export const Show: React.FC<ShowProps> = ({
  children,
  above,
  below,
  only
}) => {
  const currentBreakpoint = useCurrentBreakpoint();
  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];
  
  let shouldShow = true;

  if (above) {
    const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
    const aboveIndex = breakpointOrder.indexOf(above);
    shouldShow = currentIndex >= aboveIndex;
  }

  if (below) {
    const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
    const belowIndex = breakpointOrder.indexOf(below);
    shouldShow = currentIndex <= belowIndex;
  }

  if (only) {
    const onlyBreakpoints = Array.isArray(only) ? only : [only];
    shouldShow = onlyBreakpoints.includes(currentBreakpoint);
  }

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const Hide: React.FC<ShowProps> = (props) => {
  const { children, above, below, only } = props;
  
  // Invert the logic for Hide component
  const invertedProps: ShowProps = { children };
  
  if (above) {
    // Hide above becomes show below the previous breakpoint
    const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];
    const aboveIndex = breakpointOrder.indexOf(above);
    if (aboveIndex > 0) {
      invertedProps.below = breakpointOrder[aboveIndex - 1];
    }
  } else if (below) {
    // Hide below becomes show above the next breakpoint
    const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];
    const belowIndex = breakpointOrder.indexOf(below);
    if (belowIndex < breakpointOrder.length - 1) {
      invertedProps.above = breakpointOrder[belowIndex + 1];
    }
  } else if (only) {
    // Hide only these breakpoints - show all others
    const allBreakpoints: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];
    const onlyBreakpoints = Array.isArray(only) ? only : [only];
    const otherBreakpoints = allBreakpoints.filter(bp => !onlyBreakpoints.includes(bp));
    invertedProps.only = otherBreakpoints;
  }
  
  return <Show {...invertedProps} />;
};

// =========================================
// ADAPTIVE COMPONENTS
// =========================================

interface ResponsiveValueProps<T> {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
  '3xl'?: T;
  '4xl'?: T;
}

export const useResponsiveValue = <T,>(values: ResponsiveValueProps<T>): T | undefined => {
  const currentBreakpoint = useCurrentBreakpoint();
  const breakpointOrder: Breakpoint[] = ['4xl', '3xl', '2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
  
  // Find the current breakpoint index
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
  
  // Look for a value at current breakpoint or fallback to smaller breakpoints
  for (let i = currentIndex; i < breakpointOrder.length; i++) {
    const breakpoint = breakpointOrder[i];
    if (values[breakpoint] !== undefined) {
      return values[breakpoint];
    }
  }
  
  return undefined;
};

// =========================================
// RESPONSIVE TEXT
// =========================================

interface ResponsiveTextProps {
  children: ReactNode;
  size?: ResponsiveValueProps<'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl'>;
  weight?: ResponsiveValueProps<'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'>;
  className?: string;
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  size,
  weight,
  className = ''
}) => {
  const currentSize = size ? useResponsiveValue(size) : undefined;
  const currentWeight = weight ? useResponsiveValue(weight) : undefined;

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl',
    '7xl': 'text-7xl',
    '8xl': 'text-8xl',
    '9xl': 'text-9xl'
  };

  const weightClasses = {
    thin: 'font-thin',
    extralight: 'font-extralight',
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
    black: 'font-black'
  };

  const classes = [
    currentSize ? sizeClasses[currentSize] : '',
    currentWeight ? weightClasses[currentWeight] : '',
    className
  ].filter(Boolean).join(' ');

  return <span className={classes}>{children}</span>;
};

// =========================================
// MOBILE-FIRST UTILITIES
// =========================================

export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < parseInt(breakpoints.md);
};

export const isTablet = (): boolean => {
  if (typeof window === 'undefined') return false;
  const width = window.innerWidth;
  return width >= parseInt(breakpoints.md) && width < parseInt(breakpoints.lg);
};

export const isDesktop = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= parseInt(breakpoints.lg);
};

// =========================================
// RESPONSIVE SPACING
// =========================================

interface ResponsiveSpacingProps {
  children: ReactNode;
  m?: ResponsiveValueProps<number>;
  mx?: ResponsiveValueProps<number>;
  my?: ResponsiveValueProps<number>;
  mt?: ResponsiveValueProps<number>;
  mb?: ResponsiveValueProps<number>;
  ml?: ResponsiveValueProps<number>;
  mr?: ResponsiveValueProps<number>;
  p?: ResponsiveValueProps<number>;
  px?: ResponsiveValueProps<number>;
  py?: ResponsiveValueProps<number>;
  pt?: ResponsiveValueProps<number>;
  pb?: ResponsiveValueProps<number>;
  pl?: ResponsiveValueProps<number>;
  pr?: ResponsiveValueProps<number>;
  className?: string;
}

export const ResponsiveSpacing: React.FC<ResponsiveSpacingProps> = ({
  children,
  m, mx, my, mt, mb, ml, mr,
  p, px, py, pt, pb, pl, pr,
  className = ''
}) => {
  const currentBreakpoint = useCurrentBreakpoint();
  const spacingClasses: string[] = [];

  const addSpacingClass = (
    property: string,
    values: ResponsiveValueProps<number> | undefined
  ) => {
    if (!values) return;
    
    Object.entries(values).forEach(([breakpoint, value]) => {
      if (value !== undefined) {
        const prefix = breakpoint === 'xs' ? '' : `${breakpoint}:`;
        spacingClasses.push(`${prefix}${property}-${value}`);
      }
    });
  };

  addSpacingClass('m', m);
  addSpacingClass('mx', mx);
  addSpacingClass('my', my);
  addSpacingClass('mt', mt);
  addSpacingClass('mb', mb);
  addSpacingClass('ml', ml);
  addSpacingClass('mr', mr);
  addSpacingClass('p', p);
  addSpacingClass('px', px);
  addSpacingClass('py', py);
  addSpacingClass('pt', pt);
  addSpacingClass('pb', pb);
  addSpacingClass('pl', pl);
  addSpacingClass('pr', pr);

  const classes = [
    ...spacingClasses,
    className
  ].filter(Boolean).join(' ');

  return <div className={classes}>{children}</div>;
};

// =========================================
// ASPECT RATIO COMPONENT
// =========================================

interface AspectRatioProps {
  children: ReactNode;
  ratio?: number | string;
  className?: string;
}

export const AspectRatio: React.FC<AspectRatioProps> = ({
  children,
  ratio = '16/9',
  className = ''
}) => {
  const aspectRatioValue = typeof ratio === 'number' 
    ? `${ratio * 100}%` 
    : `calc(100% / (${ratio}))`;

  return (
    <div className={`relative w-full ${className}`} style={{ paddingBottom: aspectRatioValue }}>
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  );
};

// =========================================
// RESPONSIVE IMAGE
// =========================================

interface ResponsiveImageProps {
  src: string;
  alt: string;
  sizes?: string;
  srcSet?: string;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  sizes = '(min-width: 768px) 50vw, 100vw',
  srcSet,
  className = '',
  objectFit = 'cover',
  loading = 'lazy',
  priority = false
}) => {
  const objectFitClasses = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down'
  };

  const classes = [
    'w-full h-full',
    objectFitClasses[objectFit],
    className
  ].filter(Boolean).join(' ');

  return (
    <img
      src={src}
      alt={alt}
      sizes={sizes}
      srcSet={srcSet}
      className={classes}
      loading={priority ? 'eager' : loading}
      decoding="async"
    />
  );
};

// =========================================
// BREAKPOINT DEBUGGER (Development Only)
// =========================================

export const BreakpointDebugger: React.FC = () => {
  const currentBreakpoint = useCurrentBreakpoint();
  const { width, height } = useViewportSize();

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-black bg-opacity-80 text-white px-3 py-2 rounded-lg text-sm font-mono">
      <div>Breakpoint: <strong className="text-green-400">{currentBreakpoint}</strong></div>
      <div>Size: <strong className="text-blue-400">{width}×{height}</strong></div>
    </div>
  );
};

// =========================================
// EXPORTS
// =========================================

export default {
  Container,
  ResponsiveGrid,
  Show,
  Hide,
  ResponsiveText,
  ResponsiveSpacing,
  AspectRatio,
  ResponsiveImage,
  BreakpointDebugger,
  useMediaQuery,
  useBreakpoint,
  useCurrentBreakpoint,
  useViewportSize,
  useResponsiveValue,
  isMobile,
  isTablet,
  isDesktop,
  breakpoints
};