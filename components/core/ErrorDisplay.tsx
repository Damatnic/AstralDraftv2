/**
 * Simple Error Display Component
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;

interface ErrorDisplayProps {
}
  title?: string;
  message: string;
  onRetry?: () => void;

}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
}
  title = "Something went wrong", 
  message, 
//   onRetry 
}: any) => {
}
  return (
    <div className="flex items-center justify-center min-h-[200px] p-8 sm:px-4 md:px-6 lg:px-8">
      <div className="text-center max-w-md sm:px-4 md:px-6 lg:px-8">
        <div className="text-red-400 text-4xl mb-4 sm:px-4 md:px-6 lg:px-8">⚠️</div>
        <h3 className="text-xl font-semibold text-white mb-2 sm:px-4 md:px-6 lg:px-8">{title}</h3>
        <p className="text-slate-300 mb-4 sm:px-4 md:px-6 lg:px-8">{message}</p>
        {onRetry && (
}
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8"
           aria-label="Action button">
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

const ErrorDisplayWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <ErrorDisplay {...props} />
  </ErrorBoundary>
);

export default React.memo(ErrorDisplayWithErrorBoundary);