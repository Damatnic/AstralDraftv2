import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  variant?: 'spinner' | 'skeleton';
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text,
  variant = 'spinner'
}: any) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  if (variant === 'skeleton') {
    return (
      <div className="animate-pulse">
        <div className="glass-pane p-6 space-y-4">
          <div className="h-4 bg-white/20 rounded w-3/4"></div>
          <div className="h-4 bg-white/20 rounded w-1/2"></div>
          <div className="h-4 bg-white/20 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-6">
      <div className={`${sizeClasses[size]} border-2 border-white/30 border-t-white rounded-full animate-spin`} />
      {text && <p className="text-sm text-[var(--text-secondary)]">{text}</p>}
    </div>
  );
};