
interface ErrorBoundaryState {
}
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;

}

interface ErrorBoundaryProps {
}
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error }>;

class EnhancedErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
}
  constructor(props: ErrorBoundaryProps) {
}
    super(props);
    this.state = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
}
    return { hasError: true, error };

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
}
    this.setState({ errorInfo });
    
    // Log error to monitoring service
    console.error(&apos;Error Boundary caught an error:&apos;, error, errorInfo);

  render() {
}
    if (this.state.hasError) {
}
      if (this.props.fallback) {
}
        return <this.props.fallback error={this.state.error} />;

      return (
        <div 
          className="p-6 text-center bg-red-50 border border-red-200 rounded-lg"
          role="alert"
          aria-live="assertive"
        >
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-red-600 mb-4">
            We encountered an error while loading this content.
          </p>
          <button
            onClick={() => window.location.reload()}
            aria-label="Reload page"
          >
            Reload Page
          </button>
        </div>
      );

    return this.props.children;


export default EnhancedErrorBoundary;
