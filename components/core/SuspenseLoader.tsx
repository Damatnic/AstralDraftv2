/**
 * Simple Suspense Loader Component
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';

interface SuspenseLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';


const SuspenseLoader: React.FC<SuspenseLoaderProps> = ({ 
  message = "Loading...", 
  size = 'md' 
}: any) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex items-center justify-center min-h-[200px] p-8 sm:px-4 md:px-6 lg:px-8">
      <div className="text-center sm:px-4 md:px-6 lg:px-8">
        <div className={`${sizeClasses[size]} border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4`}></div>
        <p className="text-white sm:px-4 md:px-6 lg:px-8">{message}</p>
      </div>
    </div>
  );
};

const SuspenseLoaderWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <SuspenseLoader {...props} />
  </ErrorBoundary>
);

export default React.memo(SuspenseLoaderWithErrorBoundary);