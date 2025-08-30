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
  const errorMessage = error.message.toLowerCase();
  const isAuthError = errorMessage.includes('authentication') ||
                     errorMessage.includes('login') ||
                     errorMessage.includes('session') ||
                     errorMessage.includes('token') ||
                     errorMessage.includes('unauthorized');

  const isBrowserExtensionError = errorMessage.includes('chrome-extension') ||
                                 errorMessage.includes('moz-extension') ||
                                 errorMessage.includes('safari-extension') ||
                                 errorMessage.includes('message port closed') ||
                                 errorMessage.includes('runtime.lastError');

  // If it's a browser extension error, auto-recover
  if (isBrowserExtensionError) {
    React.useEffect(() => {
      setTimeout(() => retry(), 100); // Auto-retry extension errors
    }, [retry]);
    
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
        <p className="text-gray-300 mb-4">
          {isAuthError 
            ? 'There was an issue with the authentication system. Let\'s get you signed in!' 
            : 'Something went wrong. The error has been logged and will be investigated.'}
        </p>
        {!isAuthError && (
          <div className="bg-slate-900/50 rounded p-3 mb-6 text-left">
            <p className="text-red-400 font-mono text-sm break-all">
              {error.message || 'Unknown error occurred'}
            </p>
          </div>
        )}
        <div className="space-y-3">
          {isAuthError ? (
            <>
              <button
                onClick={() => {
                  // Clear auth storage and force fresh login
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.href = '/';
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                🔄 Fresh Login
              </button>
              <button
                onClick={() => {
                  // Enable demo mode
                  localStorage.setItem('astral_demo_mode', 'true');
                  window.location.href = '/';
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                🎮 Demo Mode
              </button>
            </>
          ) : (
            <>
              <button
                onClick={retry}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                Refresh Page
              </button>
            </>
          )}
        </div>
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
      'chrome-extension', 'moz-extension', 'safari-extension',
      'message port closed', 'runtime.lasterror', 'tab no longer exists',
      'receiving end does not exist', 'extension context invalidated',
      
      // WebSocket errors that don't affect functionality
      'websocket connection failed', 'websocket error', 'connection refused',
      'websocketunavailable', 'websocket unavailable',
      
      // Network errors that don't break the app
      'network error', 'fetch error', 'cors error',
      
      // Environment/build errors that are recoverable
      'chunk load error', 'loading css chunk', 'loading chunk'
    ];
    
    const isSuppressibleError = suppressibleErrorPatterns.some(pattern =>
      errorMessage.includes(pattern) || errorStack.includes(pattern)
    );
    
    if (isSuppressibleError) {
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
      } catch (loggingError) {
        console.error('Failed to log error to monitoring service:', loggingError);
      }
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  handleRetry = () => {
    // Clear any pending retry
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }

    // Reset error state
    this.setState({ hasError: false, error: undefined, errorId: undefined });

    // If still erroring after retry, prevent infinite retry loop
    this.retryTimeoutId = window.setTimeout(() => {
      if (this.state.hasError) {
        console.warn('Error boundary retry failed, preventing further retries');
      }
    }, 1000);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback component if provided
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      
      return (
        <FallbackComponent 
          error={this.state.error} 
          retry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easy error boundary wrapping
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) => {
  const WrappedComponent = (props: P) => (
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

export default ErrorBoundary;