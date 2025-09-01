/**
 * Lazy Load Wrapper Component
 * Provides lazy loading with loading states, error boundaries, and performance tracking
 */

import React, { Suspense, lazy, ComponentType, useEffect, useState } from &apos;react&apos;;
import { performanceService } from &apos;../../services/performanceService&apos;;

interface LazyLoadWrapperProps {
}
  children: React.ReactNode;
  fallback?: React.ComponentType;
  errorFallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  componentName?: string;
  minDelay?: number; // Minimum loading time to prevent flashing
}

interface LazyComponentProps {
}
  loader: () => Promise<{ default: ComponentType<any> }>;
  componentName: string;
  fallback?: React.ComponentType;
  errorFallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  minDelay?: number;
  [key: string]: any;
}

// Default loading fallback
const DefaultLoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-[200px] bg-gray-900/50 rounded-lg border border-cyan-500/20 backdrop-blur-sm">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-8 h-8 border-4 border-cyan-500/30 rounded-full"></div>
        <div className="absolute inset-0 w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-sm text-gray-400 animate-pulse">Loading component...</p>
    </div>
  </div>
);

// Default error fallback
const DefaultErrorFallback: React.FC<{ error: Error; retry: () => void }> = ({ error, retry }: any) => (
  <div className="flex items-center justify-center min-h-[200px] bg-red-900/20 rounded-lg border border-red-500/30 backdrop-blur-sm">
    <div className="text-center p-6">
      <div className="text-red-400 text-4xl mb-4">⚠️</div>
      <h3 className="text-lg font-semibold text-red-300 mb-2">Component Failed to Load</h3>
      <p className="text-sm text-red-400 mb-4">{error.message}</p>
      <button
        onClick={retry}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
      >
        Retry Loading
      </button>
    </div>
  </div>
);

// Enhanced error boundary for lazy components
class LazyLoadErrorBoundary extends React.Component<
  { 
}
    children: React.ReactNode; 
    fallback: React.ComponentType<{ error: Error; retry: () => void }>;
    componentName?: string;
    onRetry: () => void;
  },
  { hasError: boolean; error: Error | null }
> {
}
  constructor(props: any) {
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
    // Log error with performance service
    performanceService.recordMetric(&apos;lazy_component_error&apos;, 1, {
}
      component: this.props.componentName,
      error: error.message,
      stack: error.stack,
//       errorInfo
    });

    // Send to error tracking service if available
    if (window.errorTrackingService) {
}
      window.errorTrackingService.captureError(error, {
}
        component: &apos;lazy-load-boundary&apos;,
        severity: &apos;medium&apos;,
        context: {
}
          componentName: this.props.componentName,
//           errorInfo 
        }
      });
    }
  }

  retry = () => {
}
    this.setState({ hasError: false, error: null });
    this.props.onRetry();
  }

  render() {
}
    if (this.state.hasError && this.state.error) {
}
      const FallbackComponent = this.props.fallback;
      return <FallbackComponent error={this.state.error} retry={this.retry} />;
    }

    return this.props.children;
  }
}

// Lazy load wrapper with performance tracking
export const LazyLoadWrapper: React.FC<LazyLoadWrapperProps> = ({
}
  children,
  fallback: FallbackComponent = DefaultLoadingFallback,
  errorFallback: ErrorFallbackComponent = DefaultErrorFallback,
  componentName = &apos;unknown&apos;,
  minDelay = 0
}) => {
}
  const [showContent, setShowContent] = useState(minDelay === 0);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
}
    if (minDelay > 0) {
}
      const timer = setTimeout(() => setShowContent(true), minDelay);
      return () => clearTimeout(timer);
    }
  }, [minDelay]);

  const handleRetry = () => {
}
    setRetryKey(prev => prev + 1);
  };

  if (!showContent) {
}
    return <FallbackComponent />;
  }

  return (
    <LazyLoadErrorBoundary>
      key={retryKey}
      fallback={ErrorFallbackComponent}
      componentName={componentName}
      onRetry={handleRetry}
    >
      <Suspense fallback={<FallbackComponent />}>
        {children}
      </Suspense>
    </LazyLoadErrorBoundary>
  );
};

// Factory function to create lazy components with performance tracking
export const createLazyComponent = <P extends object = {}>({
}
  loader,
  componentName,
  fallback,
  errorFallback,
  minDelay,
  ...defaultProps
}: LazyComponentProps): React.ComponentType<P> => {
}
  const LazyComponent = lazy(async () => {
}
    const startTime = performance.now();
    
    try {
}
      performanceService.recordMetric(&apos;lazy_component_load_start&apos;, startTime, {
}
        component: componentName
      });

      const module = await loader();
      
      performanceService.measureAsyncOperation(
        `lazy_load_${componentName}`,
        startTime,
//         true
      );

      return module;
    } catch (error) {
}
      performanceService.measureAsyncOperation(
        `lazy_load_${componentName}`,
        startTime,
//         false
      );

      throw error;
    }
  });

  const WrappedComponent: React.ComponentType<P> = (props: any) => (
    <LazyLoadWrapper>
      fallback={fallback}
      errorFallback={errorFallback}
      componentName={componentName}
      minDelay={minDelay}
    >
      <LazyComponent {...defaultProps} {...props} />
    </LazyLoadWrapper>
  );

  WrappedComponent.displayName = `Lazy(${componentName})`;
  return WrappedComponent;
};

// Pre-built lazy components for common heavy features
export const LazyDraftRoom = createLazyComponent({
}
  loader: () => import(&apos;../../views/DraftRoomView&apos;),
  componentName: &apos;DraftRoomView&apos;,
  minDelay: 100 // Prevent flashing for fast loads
});

export const LazyAnalyticsDashboard = createLazyComponent({
}
  loader: () => import(&apos;../../components/analytics/AdvancedAnalyticsDashboard&apos;),
  componentName: &apos;AdvancedAnalyticsDashboard&apos;
});

export const LazyAIAssistant = createLazyComponent({
}
  loader: () => import(&apos;../../components/ai/AIFantasyAssistant&apos;),
  componentName: &apos;AIFantasyAssistant&apos;
});

export const LazyCommissionerTools = createLazyComponent({
}
  loader: () => import(&apos;../../views/EnhancedCommissionerToolsView&apos;),
  componentName: &apos;EnhancedCommissionerToolsView&apos;
});

export const LazyPlayerDetailModal = createLazyComponent({
}
  loader: () => import(&apos;../../components/player/PlayerDetailModal&apos;),
  componentName: &apos;PlayerDetailModal&apos;
});

export default LazyLoadWrapper;