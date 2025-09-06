import React from 'react';
import { useLoadingCoordinator } from '../../hooks/useLoadingCoordinator';
import EnhancedLoading from './EnhancedLoading';

interface UnifiedLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fallbackText?: string;
  showPrimary?: boolean;
}

export const UnifiedLoading: React.FC<UnifiedLoadingProps> = ({
  size = 'md',
  className = '',
  fallbackText = 'Loading...',
  showPrimary = true
}) => {
  const { isAnyLoading, getPrimaryLoading, activeLoadings } = useLoadingCoordinator();

  if (!isAnyLoading) {
    return null;
  }

  if (showPrimary) {
    const primaryLoading = getPrimaryLoading();
    if (primaryLoading) {
      return (
        <EnhancedLoading
          size={size}
          text={primaryLoading.message || fallbackText}
          priority={primaryLoading.priority}
          className={className}
          fullScreen={primaryLoading.priority === 'critical'}
        />
      );
    }
  }

  // Show count of active loadings if multiple
  const loadingCount = activeLoadings.length;
  const text = loadingCount > 1 
    ? `${fallbackText} (${loadingCount} operations)`
    : fallbackText;

  return (
    <EnhancedLoading
      size={size}
      text={text}
      className={className}
    />
  );
};

export default UnifiedLoading;