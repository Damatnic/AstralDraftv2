/**
 * Component Optimization Utilities
 * React component performance optimization helpers
 */

import React, { memo, ComponentType, forwardRef, ForwardedRef } from &apos;react&apos;;
import { isEqual } from &apos;lodash&apos;;

// Deep memo with custom comparison
export function deepMemo<T extends ComponentType<any>>(
  Component: T,
  customCompare?: (prevProps: any, nextProps: any) => boolean
): T {
}
  return memo(Component, customCompare || isEqual) as T;
}

// Shallow memo for simple props
export function shallowMemo<T extends ComponentType<any>>(Component: T): T {
}
  return memo(Component, (prevProps, nextProps) => {
}
    const prevKeys = Object.keys(prevProps);
    const nextKeys = Object.keys(nextProps);
    
    if (prevKeys.length !== nextKeys.length) return false;
    
    for (const key of prevKeys) {
}
      if (prevProps[key] !== nextProps[key]) return false;
    }
    
    return true;
  }) as T;
}

// Props memo that ignores specific props
export function memoIgnoring<T extends ComponentType<any>>(
  Component: T,
  ignoreProps: string[]
): T {
}
  return memo(Component, (prevProps, nextProps) => {
}
    const prevFiltered = { ...prevProps };
    const nextFiltered = { ...nextProps };
    
    ignoreProps.forEach(prop => {
}
      delete prevFiltered[prop];
      delete nextFiltered[prop];
    });
    
    return isEqual(prevFiltered, nextFiltered);
  }) as T;
}

// Memo only specific props
export function memoOnly<T extends ComponentType<any>>(
  Component: T,
  onlyProps: string[]
): T {
}
  return memo(Component, (prevProps, nextProps) => {
}
    for (const prop of onlyProps) {
}
      if (prevProps[prop] !== nextProps[prop]) return false;
    }
    return true;
  }) as T;
}

// Stable ref wrapper
export function withStableRef<T, P>(
  Component: ComponentType<P & { ref?: React.Ref<T> }>
) {
}
  return forwardRef<T, P>((props, ref) => {
}
    return <Component {...props} ref={ref} />;
  });
}

// HOC for error boundaries
export function withErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  ErrorComponent?: ComponentType<{ error: Error; resetError: () => void }>,
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
) {
}
  class ErrorBoundaryWrapper extends React.Component<
    P,
    { hasError: boolean; error: Error | null }
  > {
}
    constructor(props: P) {
}
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
}
      return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
}
      onError?.(error, errorInfo);
    }

    resetError = () => {
}
      this.setState({ hasError: false, error: null });
    };

    render() {
}
      if (this.state.hasError && this.state.error) {
}
        if (ErrorComponent) {
}
          return <ErrorComponent error={this.state.error} resetError={this.resetError} />;
        }
        return <div>Something went wrong: {this.state.error.message}</div>;
      }

      return <Component {...this.props} />;
    }
  }

  return ErrorBoundaryWrapper;
}

// HOC for loading states
export function withLoading<P extends { loading?: boolean }>(
  Component: ComponentType<P>,
  LoadingComponent: ComponentType = () => <div>Loading...</div>
) {
}
  return (props: P) => {
}
    if (props.loading) {
}
      return <LoadingComponent />;
    }
    return <Component {...props} />;
  };
}

// HOC for conditional rendering
export function withConditional<P extends object>(
  Component: ComponentType<P>,
  condition: (props: P) => boolean,
  FallbackComponent?: ComponentType<P>
) {
}
  return (props: P) => {
}
    if (condition(props)) {
}
      return <Component {...props} />;
    }
    return FallbackComponent ? <FallbackComponent {...props} /> : null;
  };
}

// Performance measurement HOC
export function withPerformanceTracking<P extends object>(
  Component: ComponentType<P>,
  componentName: string
) {
}
  return (props: P) => {
}
    React.useEffect(() => {
}
      const startTime = performance.now();
      
      return () => {
}
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        
        if (renderTime > 16) { // More than one frame
}
          console.warn(`${componentName} took ${renderTime.toFixed(2)}ms to render`);
        }
        
        // Send to performance monitoring if available
        if (&apos;performance&apos; in window && &apos;measure&apos; in performance) {
}
          performance.mark(`${componentName}-render-end`);
          performance.measure(
            `${componentName}-render`,
            `${componentName}-render-start`,
            `${componentName}-render-end`
          );
        }
      };
    });

    React.useEffect(() => {
}
      if (&apos;performance&apos; in window && &apos;mark&apos; in performance) {
}
        performance.mark(`${componentName}-render-start`);
      }
    });

    return <Component {...props} />;
  };
}

// Lazy loading with preload capability
export function createLazyComponent<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: {
}
    fallback?: React.ComponentType;
    preload?: boolean;
    onError?: (error: Error) => void;
  } = {}
) {
}
  const LazyComponent = React.lazy(importFn);
  
  // Preload if requested
  if (options.preload) {
}
    importFn().catch(options.onError || console.error);
  }
  
  const WrappedComponent = (props: P) => (
    <React.Suspense fallback={options.fallback ? <options.fallback /> : <div>Loading...</div>}>
      <LazyComponent {...props} />
    </React.Suspense>
  );
  
  // Add preload method
  (WrappedComponent as any).preload = importFn;
  
  return WrappedComponent;
}

// Intersection observer for lazy mounting
export function withIntersectionObserver<P extends object>(
  Component: ComponentType<P>,
  options: IntersectionObserverInit = {},
  placeholder?: ComponentType
) {
}
  return (props: P) => {
}
    const [isIntersecting, setIsIntersecting] = React.useState(false);
    const [hasIntersected, setHasIntersected] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
}
      const element = ref.current;
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
}
          if (entry.isIntersecting) {
}
            setIsIntersecting(true);
            setHasIntersected(true);
          } else {
}
            setIsIntersecting(false);
          }
        },
//         options
      );

      observer.observe(element);

      return () => {
}
        observer.disconnect();
      };
    }, []);

    if (!hasIntersected) {
}
      return (
        <div ref={ref} style={{ minHeight: 100 }}>
          {placeholder ? <placeholder /> : null}
        </div>
      );
    }

    return <Component {...props} />;
  };
}

// Bundle size optimized dynamic imports
export function createDynamicImport<T>(
  importFn: () => Promise<T>,
  options: {
}
    timeout?: number;
    retries?: number;
    fallback?: T;
  } = {}
) {
}
  const { timeout = 10000, retries = 3, fallback } = options;
  
  let attemptCount = 0;
  
  const loadWithRetry = async (): Promise<T> => {
}
    try {
}
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(&apos;Import timeout&apos;)), timeout)
      );
      
      const result = await Promise.race([importFn(), timeoutPromise]);
      return result;
    } catch (error) {
}
      attemptCount++;
      
      if (attemptCount <= retries) {
}
        // Exponential backoff
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, attemptCount - 1) * 1000)
        );
        return loadWithRetry();
      }
      
      if (fallback) {
}
        console.warn(&apos;Dynamic import failed, using fallback:&apos;, error);
        return fallback;
      }
      
      throw error;
    }
  };
  
  return loadWithRetry;
}

// Component props validator (development only)
export function withPropValidation<P extends object>(
  Component: ComponentType<P>,
  validator: (props: P) => string | null
) {
}
  if (process.env.NODE_ENV === &apos;production&apos;) {
}
    return Component;
  }
  
  return (props: P) => {
}
    const error = validator(props);
    if (error) {
}
      console.error(`Prop validation error in ${Component.displayName || Component.name}:`, error);
    }
    return <Component {...props} />;
  };
}

// Render props pattern helper
export function createRenderProp<TProps, TRenderProps>(
  useHook: (props: TProps) => TRenderProps
) {
}
  return (props: TProps & { children: (renderProps: TRenderProps) => React.ReactNode }) => {
}
    const { children, ...hookProps } = props;
    const renderProps = useHook(hookProps as TProps);
    return <>{children(renderProps)}</>;
  };
}

// Component composition helper
export function compose<P>(...hocs: Array<(component: ComponentType<any>) => ComponentType<any>>) {
}
  return (Component: ComponentType<P>) => {
}
    return hocs.reduce((acc, hoc) => hoc(acc), Component);
  };
}

// Display name setter for better debugging
export function setDisplayName<T extends ComponentType<any>>(
  Component: T, 
  name: string
): T {
}
  Component.displayName = name;
  return Component;
}

// Export commonly used patterns
export const memoizedComponent = <P extends object>(Component: ComponentType<P>) =>
  setDisplayName(deepMemo(Component), `Memoized(${Component.displayName || Component.name})`);

export const lazyComponent = <P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  fallback?: React.ComponentType
) => createLazyComponent(importFn, { fallback });

export const errorSafeComponent = <P extends object>(
  Component: ComponentType<P>,
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
) => withErrorBoundary(Component, undefined, onError);