/**
 * Deployment Error Boundary
 * Specialized error boundary for catching and handling deployment-specific issues
 */

import React, { Component, ReactNode } from &apos;react&apos;;

interface Props {
}
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
}
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  retryCount: number;
}

class DeploymentErrorBoundary extends Component<Props, State> {
}
  private retryTimeouts: NodeJS.Timeout[] = [];

  constructor(props: Props) {
}
    super(props);
    this.state = {
}
      hasError: false,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
}
    return {
}
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
}
    console.error(&apos;Deployment Error Boundary caught an error:&apos;, error, errorInfo);
    
    this.setState({
}
      error,
      errorInfo,
    });

    // Track deployment errors
    if (typeof window !== &apos;undefined&apos; && window.errorTrackingService) {
}
      try {
}
        window.errorTrackingService.captureError(error, {
}
          component: &apos;deployment-error-boundary&apos;,
          severity: &apos;critical&apos;,
          context: {
}
            ...errorInfo,
            retryCount: this.state.retryCount,
            userAgent: navigator.userAgent,
            url: window.location.href,
          },
        });
      } catch (trackingError) {
}
        console.warn(&apos;Failed to track deployment error:&apos;, trackingError);
      }
    }
  }

  componentWillUnmount() {
}
    // Clear any pending retry timeouts
    this.retryTimeouts.forEach((timeout: any) => clearTimeout(timeout));
  }

  handleRetry = () => {
}
    const { retryCount } = this.state;
    
    // Allow up to 3 retries with exponential backoff
    if (retryCount < 3) {
}
      const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
      
      const timeout = setTimeout(() => {
}
        this.setState({
}
          hasError: false,
          error: undefined,
          errorInfo: undefined,
          retryCount: retryCount + 1,
        });
      }, delay);
      
      this.retryTimeouts.push(timeout);
    }
  };

  handleReload = () => {
}
    window.location.reload();
  };

  render() {
}
    if (this.state.hasError) {
}
      // Use custom fallback if provided
      if (this.props.fallback) {
}
        return this.props.fallback;
      }

      // Default deployment error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center p-4">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8 max-w-lg w-full text-center space-y-6">
            <div className="text-6xl">🚀</div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">
                Deployment Issue Detected
              </h1>
              <p className="text-slate-300">
                We&apos;re experiencing a temporary issue with the application startup.
              </p>
            </div>

            {this.state.error && (
}
              <div className="bg-slate-900/50 rounded-lg p-4 text-left">
                <h3 className="text-sm font-medium text-slate-200 mb-2">Error Details:</h3>
                <p className="text-xs text-red-400 font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex gap-3 justify-center">
                {this.state.retryCount < 3 && (
}
                  <button
                    onClick={this.handleRetry}
                    className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                    disabled={this.retryTimeouts.length > 0}
                  >
                    {this.retryTimeouts.length > 0 ? &apos;Retrying...&apos; : `Retry (${3 - this.state.retryCount} left)`}
                  </button>
                )}
                
                <button
                  onClick={this.handleReload}
                  className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                >
                  Reload Page
                </button>
              </div>

              <p className="text-xs text-slate-400">
                If this problem persists, the issue may be temporary. 
                Try refreshing in a few moments or check your internet connection.
              </p>
            </div>

            {/* Environment info for debugging */}
            {import.meta.env.DEV && this.state.error?.stack && (
}
              <details className="text-left">
                <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-300">
                  Stack Trace (Development)
                </summary>
                <pre className="text-xs text-red-400 font-mono mt-2 p-2 bg-slate-900 rounded overflow-auto max-h-40">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default DeploymentErrorBoundary;