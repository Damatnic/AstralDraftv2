/**
 * Responsive Layout System - Advanced Mobile-First Design
 * Comprehensive responsive utilities, breakpoint management, and adaptive layouts
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, ReactNode, useEffect, useState } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;

// =========================================
// BREAKPOINT SYSTEM
// =========================================

export const breakpoints = {
}
  const [isLoading, setIsLoading] = React.useState(false);
  xs: &apos;475px&apos;,
  sm: &apos;640px&apos;,
  md: &apos;768px&apos;,
  lg: &apos;1024px&apos;,
  xl: &apos;1280px&apos;,
  &apos;2xl&apos;: &apos;1536px&apos;,
  &apos;3xl&apos;: &apos;1920px&apos;,
  &apos;4xl&apos;: &apos;2560px&apos;
} as const;

export type Breakpoint = keyof typeof breakpoints;

// =========================================
// RESPONSIVE HOOKS
// =========================================

export const useMediaQuery = (query: string): boolean => {
}
  const [matches, setMatches] = useState(false);

  useEffect(() => {
}
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
}
      setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener(&apos;change&apos;, listener);
    
    return () => media.removeEventListener(&apos;change&apos;, listener);
    }
  }, [matches, query]);

  return matches;
};

export const useBreakpoint = (breakpoint: Breakpoint): boolean => {
}
  return useMediaQuery(`(min-width: ${breakpoints[breakpoint]})`);
};

export const useCurrentBreakpoint = (): Breakpoint => {
}
  const isXs = useBreakpoint(&apos;xs&apos;);
  const isSm = useBreakpoint(&apos;sm&apos;);
  const isMd = useBreakpoint(&apos;md&apos;);
  const isLg = useBreakpoint(&apos;lg&apos;);
  const isXl = useBreakpoint(&apos;xl&apos;);
  const is2xl = useBreakpoint(&apos;2xl&apos;);
  const is3xl = useBreakpoint(&apos;3xl&apos;);
  const is4xl = useBreakpoint(&apos;4xl&apos;);

  if (is4xl) return &apos;4xl&apos;;
  if (is3xl) return &apos;3xl&apos;;
  if (is2xl) return &apos;2xl&apos;;
  if (isXl) return &apos;xl&apos;;
  if (isLg) return &apos;lg&apos;;
  if (isMd) return &apos;md&apos;;
  if (isSm) return &apos;sm&apos;;
  if (isXs) return &apos;xs&apos;;
  return &apos;xs&apos;; // fallback for mobile
};

export const useViewportSize = () => {
}
  const [windowSize, setWindowSize] = useState({
}
    width: typeof window !== &apos;undefined&apos; ? window.innerWidth : 0,
    height: typeof window !== &apos;undefined&apos; ? window.innerHeight : 0,
  });

  useEffect(() => {
}
    const handleResize = () => {
}
      setWindowSize({
}
        width: window.innerWidth,
        height: window.innerHeight,
      });

    window.addEventListener(&apos;resize&apos;, handleResize);
    return () => {
}
      window.removeEventListener(&apos;resize&apos;, handleResize);
    };
  }, []);

  return windowSize;
};

// =========================================
// RESPONSIVE CONTAINERS
// =========================================

interface ContainerProps {
}
  children: ReactNode;
  maxWidth?: Breakpoint | &apos;full&apos; | &apos;none&apos;;
  padding?: boolean;
  center?: boolean;
  className?: string;

}

export const Container: React.FC<ContainerProps> = ({
}
  children,
  maxWidth = &apos;xl&apos;,
  padding = true,
  center = true,
  className = &apos;&apos;
}: any) => {
}
  const maxWidthClasses = {
}
    xs: &apos;max-w-xs&apos;,
    sm: &apos;max-w-sm&apos;,
    md: &apos;max-w-md&apos;,
    lg: &apos;max-w-lg&apos;,
    xl: &apos;max-w-xl&apos;,
    &apos;2xl&apos;: &apos;max-w-2xl&apos;,
    &apos;3xl&apos;: &apos;max-w-3xl&apos;,
    &apos;4xl&apos;: &apos;max-w-4xl&apos;,
    full: &apos;max-w-full&apos;,
    none: &apos;&apos;
  };

  const classes = [
    &apos;w-full&apos;,
    maxWidth !== &apos;none&apos; ? maxWidthClasses[maxWidth] : &apos;&apos;,
    center ? &apos;mx-auto&apos; : &apos;&apos;,
    padding ? &apos;px-4 sm:px-6 lg:px-8&apos; : &apos;&apos;,
//     className
  ].filter(Boolean).join(&apos; &apos;);

  return <div className={classes}>{children}</div>;
};

// =========================================
// RESPONSIVE GRID SYSTEM
// =========================================

interface GridProps {
}
  children: ReactNode;
  cols?: {
}
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    &apos;2xl&apos;?: number;
  };
  gap?: {
}
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    &apos;2xl&apos;?: number;
  } | number;
  className?: string;

export const ResponsiveGrid: React.FC<GridProps> = ({
}
  children,
  cols = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 4,
  className = &apos;&apos;
}) => {
}
  const colClasses = [];
  const gapClasses = [];

  // Handle columns
  Object.entries(cols).forEach(([breakpoint, colCount]) => {
}
    if (breakpoint === &apos;xs&apos;) {
}
      colClasses.push(`grid-cols-${colCount}`);
    } else {
}
      colClasses.push(`${breakpoint}:grid-cols-${colCount}`);

  });

  // Handle gap
  if (typeof gap === &apos;number&apos;) {
}
    gapClasses.push(`gap-${gap}`);
  } else {
}
    Object.entries(gap).forEach(([breakpoint, gapSize]) => {
}
      if (breakpoint === &apos;xs&apos;) {
}
        gapClasses.push(`gap-${gapSize}`);
      } else {
}
        gapClasses.push(`${breakpoint}:gap-${gapSize}`);

    });

  const classes = [
    &apos;grid&apos;,
    ...colClasses,
    ...gapClasses,
//     className
  ].filter(Boolean).join(&apos; &apos;);

  return <div className={classes}>{children}</div>;
};

// =========================================
// RESPONSIVE SHOW/HIDE
// =========================================

interface ShowProps {
}
  children: ReactNode;
  above?: Breakpoint;
  below?: Breakpoint;
  only?: Breakpoint | Breakpoint[];

}

export const Show: React.FC<ShowProps> = ({
}
  children,
  above,
  below,
//   only
}: any) => {
}
  const currentBreakpoint = useCurrentBreakpoint();
  const breakpointOrder: Breakpoint[] = [&apos;xs&apos;, &apos;sm&apos;, &apos;md&apos;, &apos;lg&apos;, &apos;xl&apos;, &apos;2xl&apos;, &apos;3xl&apos;, &apos;4xl&apos;];
  
  let shouldShow = true;

  if (above) {
}
    const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
    const aboveIndex = breakpointOrder.indexOf(above);
    shouldShow = currentIndex >= aboveIndex;

  if (below) {
}
    const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
    const belowIndex = breakpointOrder.indexOf(below);
    shouldShow = currentIndex <= belowIndex;

  if (only) {
}
    const onlyBreakpoints = Array.isArray(only) ? only : [only];
    shouldShow = onlyBreakpoints.includes(currentBreakpoint);

  return (
    <AnimatePresence>
      {shouldShow && (
}
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

export const Hide: React.FC<ShowProps> = (props: any) => {
}
  const { children, above, below, only } = props;
  
  // Invert the logic for Hide component
  const invertedProps: ShowProps = { children };
  
  if (above) {
}
    // Hide above becomes show below the previous breakpoint
    const breakpointOrder: Breakpoint[] = [&apos;xs&apos;, &apos;sm&apos;, &apos;md&apos;, &apos;lg&apos;, &apos;xl&apos;, &apos;2xl&apos;, &apos;3xl&apos;, &apos;4xl&apos;];
    const aboveIndex = breakpointOrder.indexOf(above);
    if (aboveIndex > 0) {
}
      invertedProps.below = breakpointOrder[aboveIndex - 1];

  } else if (below) {
}
    // Hide below becomes show above the next breakpoint
    const breakpointOrder: Breakpoint[] = [&apos;xs&apos;, &apos;sm&apos;, &apos;md&apos;, &apos;lg&apos;, &apos;xl&apos;, &apos;2xl&apos;, &apos;3xl&apos;, &apos;4xl&apos;];
    const belowIndex = breakpointOrder.indexOf(below);
    if (belowIndex < breakpointOrder.length - 1) {
}
      invertedProps.above = breakpointOrder[belowIndex + 1];

  } else if (only) {
}
    // Hide only these breakpoints - show all others
    const allBreakpoints: Breakpoint[] = [&apos;xs&apos;, &apos;sm&apos;, &apos;md&apos;, &apos;lg&apos;, &apos;xl&apos;, &apos;2xl&apos;, &apos;3xl&apos;, &apos;4xl&apos;];
    const onlyBreakpoints = Array.isArray(only) ? only : [only];
    const otherBreakpoints = allBreakpoints.filter((bp: any) => !onlyBreakpoints.includes(bp));
    invertedProps.only = otherBreakpoints;

  return <Show {...invertedProps} />;
};

// =========================================
// ADAPTIVE COMPONENTS
// =========================================

interface ResponsiveValueProps<T> {
}
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  &apos;2xl&apos;?: T;
  &apos;3xl&apos;?: T;
  &apos;4xl&apos;?: T;

export const useResponsiveValue = <T,>(values: ResponsiveValueProps<T>): T | undefined => {
}
  const currentBreakpoint = useCurrentBreakpoint();
  const breakpointOrder: Breakpoint[] = [&apos;4xl&apos;, &apos;3xl&apos;, &apos;2xl&apos;, &apos;xl&apos;, &apos;lg&apos;, &apos;md&apos;, &apos;sm&apos;, &apos;xs&apos;];
  
  // Find the current breakpoint index
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
  
  // Look for a value at current breakpoint or fallback to smaller breakpoints
  for (let i = currentIndex; i < breakpointOrder.length; i++) {
}
    const breakpoint = breakpointOrder[i];
    if (values[breakpoint] !== undefined) {
}
      return values[breakpoint];


  return undefined;
};

// =========================================
// RESPONSIVE TEXT
// =========================================

interface ResponsiveTextProps {
}
  children: ReactNode;
  size?: ResponsiveValueProps<&apos;xs&apos; | &apos;sm&apos; | &apos;base&apos; | &apos;lg&apos; | &apos;xl&apos; | &apos;2xl&apos; | &apos;3xl&apos; | &apos;4xl&apos; | &apos;5xl&apos; | &apos;6xl&apos; | &apos;7xl&apos; | &apos;8xl&apos; | &apos;9xl&apos;>;
  weight?: ResponsiveValueProps<&apos;thin&apos; | &apos;extralight&apos; | &apos;light&apos; | &apos;normal&apos; | &apos;medium&apos; | &apos;semibold&apos; | &apos;bold&apos; | &apos;extrabold&apos; | &apos;black&apos;>;
  className?: string;

}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
}
  children,
  size,
  weight,
  className = &apos;&apos;
}: any) => {
}
  const currentSize = size ? useResponsiveValue(size) : undefined;
  const currentWeight = weight ? useResponsiveValue(weight) : undefined;

  const sizeClasses = {
}
    xs: &apos;text-xs&apos;,
    sm: &apos;text-sm&apos;,
    base: &apos;text-base&apos;,
    lg: &apos;text-lg&apos;,
    xl: &apos;text-xl&apos;,
    &apos;2xl&apos;: &apos;text-2xl&apos;,
    &apos;3xl&apos;: &apos;text-3xl&apos;,
    &apos;4xl&apos;: &apos;text-4xl&apos;,
    &apos;5xl&apos;: &apos;text-5xl&apos;,
    &apos;6xl&apos;: &apos;text-6xl&apos;,
    &apos;7xl&apos;: &apos;text-7xl&apos;,
    &apos;8xl&apos;: &apos;text-8xl&apos;,
    &apos;9xl&apos;: &apos;text-9xl&apos;
  };

  const weightClasses = {
}
    thin: &apos;font-thin&apos;,
    extralight: &apos;font-extralight&apos;,
    light: &apos;font-light&apos;,
    normal: &apos;font-normal&apos;,
    medium: &apos;font-medium&apos;,
    semibold: &apos;font-semibold&apos;,
    bold: &apos;font-bold&apos;,
    extrabold: &apos;font-extrabold&apos;,
    black: &apos;font-black&apos;
  };

  const classes = [
    currentSize ? sizeClasses[currentSize] : &apos;&apos;,
    currentWeight ? weightClasses[currentWeight] : &apos;&apos;,
//     className
  ].filter(Boolean).join(&apos; &apos;);

  return <span className={classes}>{children}</span>;
};

// =========================================
// MOBILE-FIRST UTILITIES
// =========================================

export const isMobile = (): boolean => {
}
  if (typeof window === &apos;undefined&apos;) return false;
  return window.innerWidth < parseInt(breakpoints.md);
};

export const isTablet = (): boolean => {
}
  if (typeof window === &apos;undefined&apos;) return false;
  const width = window.innerWidth;
  return width >= parseInt(breakpoints.md) && width < parseInt(breakpoints.lg);
};

export const isDesktop = (): boolean => {
}
  if (typeof window === &apos;undefined&apos;) return false;
  return window.innerWidth >= parseInt(breakpoints.lg);
};

// =========================================
// RESPONSIVE SPACING
// =========================================

interface ResponsiveSpacingProps {
}
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
}
  children,
  m, mx, my, mt, mb, ml, mr,
  p, px, py, pt, pb, pl, pr,
  className = &apos;&apos;
}: any) => {
}
  const currentBreakpoint = useCurrentBreakpoint();
  const spacingClasses: string[] = [];

  const addSpacingClass = (
    property: string,
    values: ResponsiveValueProps<number> | undefined
  ) => {
}
    if (!values) return;
    
    Object.entries(values).forEach(([breakpoint, value]) => {
}
      if (value !== undefined) {
}
        const prefix = breakpoint === &apos;xs&apos; ? &apos;&apos; : `${breakpoint}:`;
        spacingClasses.push(`${prefix}${property}-${value}`);

    });
  };

  addSpacingClass(&apos;m&apos;, m);
  addSpacingClass(&apos;mx&apos;, mx);
  addSpacingClass(&apos;my&apos;, my);
  addSpacingClass(&apos;mt&apos;, mt);
  addSpacingClass(&apos;mb&apos;, mb);
  addSpacingClass(&apos;ml&apos;, ml);
  addSpacingClass(&apos;mr&apos;, mr);
  addSpacingClass(&apos;p&apos;, p);
  addSpacingClass(&apos;px&apos;, px);
  addSpacingClass(&apos;py&apos;, py);
  addSpacingClass(&apos;pt&apos;, pt);
  addSpacingClass(&apos;pb&apos;, pb);
  addSpacingClass(&apos;pl&apos;, pl);
  addSpacingClass(&apos;pr&apos;, pr);

  const classes = [
    ...spacingClasses,
//     className
  ].filter(Boolean).join(&apos; &apos;);

  return <div className={classes}>{children}</div>;
};

// =========================================
// ASPECT RATIO COMPONENT
// =========================================

interface AspectRatioProps {
}
  children: ReactNode;
  ratio?: number | string;
  className?: string;

}

export const AspectRatio: React.FC<AspectRatioProps> = ({
}
  children,
  ratio = &apos;16/9&apos;,
  className = &apos;&apos;
}: any) => {
}
  const aspectRatioValue = typeof ratio === &apos;number&apos; 
    ? `${ratio * 100}%` 
    : `calc(100% / (${ratio}))`;

  return (
    <div className={`relative w-full ${className}`} style={{ paddingBottom: aspectRatioValue }}>
      <div className="absolute inset-0 sm:px-4 md:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
};

// =========================================
// RESPONSIVE IMAGE
// =========================================

interface ResponsiveImageProps {
}
  src: string;
  alt: string;
  sizes?: string;
  srcSet?: string;
  className?: string;
  objectFit?: &apos;cover&apos; | &apos;contain&apos; | &apos;fill&apos; | &apos;none&apos; | &apos;scale-down&apos;;
  loading?: &apos;lazy&apos; | &apos;eager&apos;;
  priority?: boolean;

}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
}
  src,
  alt,
  sizes = &apos;(min-width: 768px) 50vw, 100vw&apos;,
  srcSet,
  className = &apos;&apos;,
  objectFit = &apos;cover&apos;,
  loading = &apos;lazy&apos;,
  priority = false
}) => {
}
  const objectFitClasses = {
}
    cover: &apos;object-cover&apos;,
    contain: &apos;object-contain&apos;,
    fill: &apos;object-fill&apos;,
    none: &apos;object-none&apos;,
    &apos;scale-down&apos;: &apos;object-scale-down&apos;
  };

  const classes = [
    &apos;w-full h-full&apos;,
    objectFitClasses[objectFit],
//     className
  ].filter(Boolean).join(&apos; &apos;);

  return (
    <img
      src={src}
      alt={alt}
      sizes={sizes}
      srcSet={srcSet}
      className={classes}
      loading={priority ? &apos;eager&apos; : loading}
      decoding="async"
    />
  );
};

// =========================================
// BREAKPOINT DEBUGGER (Development Only)
// =========================================

export const BreakpointDebugger: React.FC = () => {
}
  const currentBreakpoint = useCurrentBreakpoint();
  const { width, height } = useViewportSize();

  if (process.env.NODE_ENV === &apos;production&apos;) {
}
    return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-black bg-opacity-80 text-white px-3 py-2 rounded-lg text-sm font-mono sm:px-4 md:px-6 lg:px-8">
      <div>Breakpoint: <strong className="text-green-400 sm:px-4 md:px-6 lg:px-8">{currentBreakpoint}</strong></div>
      <div>Size: <strong className="text-blue-400 sm:px-4 md:px-6 lg:px-8">{width}×{height}</strong></div>
    </div>
  );
};

// =========================================
// EXPORTS
// =========================================

export default {
}
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
//   breakpoints
};