import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class SmartErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('SmartErrorBoundary caught an error:', error, errorInfo);
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Store error info for debugging
    this.setState({ errorInfo });

    // Auto-retry for certain types of recoverable errors
    if (this.isRecoverableError(error) && this.retryCount < this.maxRetries) {
      this.scheduleRetry();
    }
  }

  private isRecoverableError(error: Error): boolean {
    // Check if error might be recoverable (network issues, temporary failures)
    return error.message.includes('Network') || 
           error.message.includes('timeout') ||
           error.message.includes('Loading chunk failed');
  }

  private scheduleRetry = () => {
    this.retryCount++;
    setTimeout(() => {
      this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    }, 1000 * this.retryCount); // Progressive backoff
  };

  private handleManualRetry = () => {
    this.retryCount = 0;
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI or use provided fallback
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 p-4"
        >
          <div className="glass-card max-w-md w-full text-center space-y-6 p-8">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto border-4 border-red-500/30 border-t-red-500 rounded-full"
            />
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">
                Oops! Something went wrong
              </h2>
              
              <p className="text-gray-300">
                {this.isRecoverableError(this.state.error!) && this.retryCount < this.maxRetries
                  ? `Attempting to recover... (${this.retryCount}/${this.maxRetries})`
                  : "We're having trouble loading this content."
                }
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left text-xs bg-red-900/20 rounded p-3 border border-red-500/20">
                  <summary className="cursor-pointer text-red-400 font-medium">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 text-red-300 whitespace-pre-wrap">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={this.handleManualRetry}
                className="flex-1 btn-primary"
              >
                Try Again
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="flex-1 btn-secondary"
              >
                Reload Page
              </button>
            </div>

            <p className="text-xs text-gray-400">
              If the problem persists, please refresh the page or contact support.
            </p>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

export default SmartErrorBoundary;