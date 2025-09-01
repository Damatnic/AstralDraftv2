/**
 * Oracle Error Boundary
 * Catches and handles errors in Oracle prediction components
 */

import React, { Component, ReactNode } from &apos;react&apos;;
import { AlertTriangleIcon, RefreshCwIcon, HomeIcon } from &apos;lucide-react&apos;;
import { Widget } from &apos;../ui/Widget&apos;;

interface Props {
}
    children: ReactNode;
    fallbackTitle?: string;
    onRetry?: () => void;
    onReset?: () => void;

}

interface State {
}
    hasError: boolean;
    error: Error | null;
    errorInfo: any;
    retryCount: number;

export class OracleErrorBoundary extends Component<Props, State> {
}
    private readonly maxRetries = 3;

    constructor(props: Props) {
}
        super(props);
        this.state = {
}
            hasError: false,
            error: null,
            errorInfo: null,
            retryCount: 0
        };

    static getDerivedStateFromError(error: Error): Partial<State> {
}
        return {
}
            hasError: true,
//             error
        };

    componentDidCatch(error: Error, errorInfo: any) {
}
        
        this.setState({
}
            error,
//             errorInfo
        });

        // Report to error tracking service in production
        if (process.env.NODE_ENV === &apos;production&apos;) {
}


    handleRetry = () => {
}
        const { onRetry } = this.props;
        const { retryCount } = this.state;

        if (retryCount < this.maxRetries) {
}
            this.setState({
}
                hasError: false,
                error: null,
                errorInfo: null,
                retryCount: retryCount + 1
            });

            if (onRetry) {
}
                onRetry();


    };

    handleReset = () => {
}
        const { onReset } = this.props;
        
        this.setState({
}
            hasError: false,
            error: null,
            errorInfo: null,
            retryCount: 0
        });

        if (onReset) {
}
            onReset();

    };

    render() {
}
        const { hasError, error, retryCount } = this.state;
        const { children, fallbackTitle = &apos;🔮 Oracle Error&apos; } = this.props;

        if (hasError) {
}
            const canRetry = retryCount < this.maxRetries;
            
            return (
                <Widget title={fallbackTitle} className="bg-red-900/20 border-red-800/50 sm:px-4 md:px-6 lg:px-8">
                    <div className="text-center py-8 sm:px-4 md:px-6 lg:px-8">
                        <AlertTriangleIcon className="w-12 h-12 text-red-400 mx-auto mb-4 sm:px-4 md:px-6 lg:px-8" />
                        
                        <h3 className="text-lg font-semibold text-red-400 mb-2 sm:px-4 md:px-6 lg:px-8">
                            Something went wrong
                        </h3>
                        
                        <p className="text-gray-400 mb-4 max-w-md mx-auto sm:px-4 md:px-6 lg:px-8">
                            The Oracle prediction interface encountered an unexpected error. 
                            {canRetry ? &apos; You can try again or reset the component.&apos; : &apos; Please reset the component to continue.&apos;}
                        </p>

                        {/* Error details in development */}
                        {process.env.NODE_ENV === &apos;development&apos; && error && (
}
                            <details className="text-left bg-gray-900/50 rounded-lg p-4 mb-4 text-sm sm:px-4 md:px-6 lg:px-8">
                                <summary className="cursor-pointer text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">
                                    Error Details (Development)
                                </summary>
                                <div className="text-red-300 font-mono whitespace-pre-wrap sm:px-4 md:px-6 lg:px-8">
                                    {error.toString()}
                                </div>
                                {error.stack && (
}
                                    <div className="text-gray-400 font-mono text-xs mt-2 whitespace-pre-wrap sm:px-4 md:px-6 lg:px-8">
                                        {error.stack}
                                    </div>
                                )}
                            </details>
                        )}

                        <div className="flex items-center justify-center space-x-4 sm:px-4 md:px-6 lg:px-8">
                            {canRetry && (
}
                                <button
                                    onClick={this.handleRetry}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8"
                                 aria-label="Action button">
                                    <RefreshCwIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                    <span>Try Again ({this.maxRetries - retryCount} left)</span>
                                </button>
                            )}
                            
                            <button
                                onClick={this.handleReset}
                                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8"
                             aria-label="Action button">
                                <HomeIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                <span>Reset</span>
                            </button>
                        </div>

                        {retryCount > 0 && (
}
                            <div className="mt-4 text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">
                                Retry attempts: {retryCount}/{this.maxRetries}
                            </div>
                        )}
                    </div>
                </Widget>
            );

        return children;


const OracleErrorBoundaryWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <OracleErrorBoundary {...props} />
  </ErrorBoundary>
);

export default React.memo(OracleErrorBoundaryWithErrorBoundary);
