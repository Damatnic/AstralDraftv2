
import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  variant?: 'spinner' | 'skeleton';
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text,
  variant = 'spinner',
  className = ''
}: LoadingProps) => {
  const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const containerClasses = `sm:px-4 md:px-6 lg:px-8 ${className}`.trim();

  if (variant === 'skeleton') {
    return (
      <div className={`animate-pulse ${containerClasses}`} role="status" aria-label="Loading content">
        <div className="glass-pane p-6 space-y-4">
          <div className="h-4 bg-white/20 rounded w-3/4" aria-hidden="true"></div>
          <div className="h-4 bg-white/20 rounded w-1/2" aria-hidden="true"></div>
          <div className="h-4 bg-white/20 rounded w-5/6" aria-hidden="true"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 p-6 ${containerClasses}`}
      role="status"
      aria-live="polite"
      aria-label={text || 'Loading'}
    >
      <div
        className={`${sizeClasses[size]} border-2 border-white/30 border-t-white rounded-full animate-spin`}
        aria-hidden="true"
      />
      {text && (
        <p className="text-sm text-[var(--text-secondary)]">
          {text}
        </p>
      )}
    </div>
  );
};