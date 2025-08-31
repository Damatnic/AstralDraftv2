import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  isolateError?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}

// ZERO-ERROR Authentication-Aware Fallback
const DefaultErrorFallback: React.FC<{ error: Error; retry: () => void }> = ({ error, retry }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const errorMessage = error.message.toLowerCase();
  const isAuthError = errorMessage.includes('authentication') ||
                     errorMessage.includes('login') ||
                     errorMessage.includes('session') ||
                     errorMessage.includes('unauthorized');

  const isExtensionError = errorMessage.includes('extension') ||
                          errorMessage.includes('chrome') ||
                          errorMessage.includes('firefox') ||
                          errorMessage.includes('adblock') ||
                          errorMessage.includes('devtools') ||
                          errorMessage.includes('ublock');

  const handleRetry = () => {
    setIsLoading(true);
    setTimeout(() => {
      retry();
      setIsLoading(false);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white">Resolving browser extension conflict...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 p-4">
      <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-lg p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">{isAuthError ? '🔐' : '⚠️'}</div>
        <h2 className="text-2xl font-bold mb-4 text-white">
          {isAuthError ? 'Login System Issue' : 'Application Error'}
        </h2>
        
        {isAuthError ? (
          <div>
            <p className="text-gray-300 mb-6">
              There seems to be an issue with the authentication system. This could be due to a browser extension or network settings.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  // Clear all storage and reload in demo mode
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.href = window.location.origin + '?demo=true';
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                🎮 Demo Mode
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-300 mb-6">
              {isExtensionError 
                ? 'A browser extension might be interfering with the app. Try disabling extensions or using incognito mode.'
                : 'Something went wrong. This might be a temporary issue.'}
            </p>
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                aria-label="Try again button"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                aria-label="Refresh page button"
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Generate unique error ID for tracking
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return { 
      hasError: true, 
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorMessage = error.message.toLowerCase();
    const errorStack = (error.stack || '').toLowerCase();
    
    // Comprehensive error pattern matching for suppression
    const suppressibleErrorPatterns = [
      // Browser extension errors
      'extension', 'chrome-extension', 'moz-extension', 'safari-extension',
      'adblock', 'ublock', 'ghostery', 'privacy badger',
      // DevTools related
      'devtools', 'chrome devtools', 'firefox devtools',
      // Network/Connection issues that auto-resolve
      'network error', 'failed to fetch', 'load failed',
      // Common non-critical React warnings
      'validateproperties', 'unknown event handler', 'unknown prop',
      // Browser compatibility edge cases
      'non-configurable', 'illegal constructor'
    ];

    const isSuppressible = suppressibleErrorPatterns.some(pattern => 
      errorMessage.includes(pattern) || errorStack.includes(pattern)
    );

    if (isSuppressible) {
      // Auto-recover from suppressible errors
      setTimeout(() => {
        this.setState({ hasError: false, error: undefined, errorId: undefined });
      }, 100);
      
      // Log in dev mode for debugging
      if (import.meta.env.DEV) {
        console.log('📝 Error boundary: Auto-recovering from suppressible error:', errorMessage);
      }
      return;
    }

    // Enhanced error logging for real application errors
    const errorDetails = {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      errorInfo: {
        componentStack: errorInfo.componentStack
      },
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      props: this.props.isolateError ? 'isolated' : 'full-app'
    };

    // Log to console in development
    if (import.meta.env.DEV) {
      console.group('🚨 React Error Boundary (Non-Extension Error)');
      console.error('Error caught by ErrorBoundary:', error);
      console.error('Component Stack:', errorInfo.componentStack);
      console.error('Error Details:', errorDetails);
      console.groupEnd();
    }

    // Call custom error handler
    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo);
      } catch (handlerError) {
        console.error('Error in custom error handler:', handlerError);
      }
    }

    // Log to production monitoring service (only for non-extension errors)
    if (import.meta.env.PROD) {
      try {
        if ((window as any).loggingService) {
          (window as any).loggingService.error('React Error Boundary', errorDetails, 'react-error');
        }
      } catch (error) {
        console.error('Failed to log error to monitoring service:', error);
      }
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorId: undefined });
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent 
          error={this.state.error!} 
          retry={this.handleRetry} 
        />
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with ErrorBoundary
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) => {
  const WrappedComponent: React.FC<P> = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Hook for programmatic error reporting
export const useErrorHandler = () => {
  return React.useCallback((error: Error, errorInfo?: { [key: string]: any }) => {
    // Manually trigger error boundary by throwing
    throw Object.assign(error, { errorInfo });
  }, []);
};

const ErrorBoundaryWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <ErrorBoundary {...props} />
  </ErrorBoundary>
);

export default React.memo(ErrorBoundaryWithErrorBoundary);