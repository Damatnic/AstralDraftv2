/**
 * Simple Error Display Component
 */

import React from 'react';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  title = "Something went wrong", 
  message, 
  onRetry 
}) => {
  return (
    <div className="flex items-center justify-center min-h-[200px] p-8">
      <div className="text-center max-w-md">
        <div className="text-red-400 text-4xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-slate-300 mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;