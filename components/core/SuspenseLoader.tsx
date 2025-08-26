/**
 * Simple Suspense Loader Component
 */

import React from 'react';

interface SuspenseLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SuspenseLoader: React.FC<SuspenseLoaderProps> = ({ 
  message = "Loading...", 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex items-center justify-center min-h-[200px] p-8">
      <div className="text-center">
        <div className={`${sizeClasses[size]} border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4`}></div>
        <p className="text-white">{message}</p>
      </div>
    </div>
  );
};

export default SuspenseLoader;