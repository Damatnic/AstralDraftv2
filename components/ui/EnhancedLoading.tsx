
import React from 'react';

interface EnhancedLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
  className?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

const EnhancedLoading: React.FC<EnhancedLoadingProps> = ({
  size = 'md',
  text = 'Loading...',
  fullScreen = false,
  className = '',
  priority = 'medium'
}: EnhancedLoadingProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const priorityColors = {
    low: 'border-blue-400',
    medium: 'border-primary-500',
    high: 'border-orange-500',
    critical: 'border-red-500'
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'
    : 'flex items-center justify-center p-4';

  const combinedClasses = `${containerClasses} ${className}`.trim();

  return (
    <div
      className={combinedClasses}
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      <div className="flex flex-col items-center space-y-3 bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
        <div
          className={`animate-spin rounded-full border-2 border-transparent ${priorityColors[priority]} ${sizeClasses[size]}`}
          style={{ borderTopColor: 'transparent' }}
          aria-hidden="true"
        />
        <span className="text-sm font-medium text-white/90">
          {text}
        </span>
      </div>
    </div>
  );
};

export default EnhancedLoading;
