/**
 * AccessibleButton Component
 * WCAG 2.1 Level AA Compliant Button
 */

import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { isActivationKey, KEYBOARD_KEYS } from '../../../utils/accessibility';

interface AccessibleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  ariaLabel?: string;
  ariaPressed?: boolean;
  ariaExpanded?: boolean;
  ariaControls?: string;
  ariaDescribedBy?: string;
  ariaBusy?: boolean;
  announceOnClick?: string;

const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      icon,
      iconPosition = 'left',
      disabled,
      onClick,
      className = '',
      ariaLabel,
      ariaPressed,
      ariaExpanded,
      ariaControls,
      ariaDescribedBy,
      ariaBusy,
      announceOnClick,
      type = 'button',
      ...rest
    },
//     ref
  ) => {
    // Variant styles with proper contrast ratios
    const variantStyles = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
      danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
      ghost: 'bg-transparent hover:bg-gray-700 text-gray-100 border border-gray-600 focus:ring-gray-500'
    };

    // Size styles with minimum touch target of 44x44px
    const sizeStyles = {
      sm: 'px-3 py-2 text-sm min-h-[44px] min-w-[44px]',
      md: 'px-4 py-2.5 text-base min-h-[44px] min-w-[44px]',
      lg: 'px-6 py-3 text-lg min-h-[48px] min-w-[48px]'
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) {
        e.preventDefault();
        return;
      }

      // Announce to screen reader if specified
      if (announceOnClick) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = announceOnClick;
        document.body.appendChild(announcement);
        setTimeout(() => document.body.removeChild(announcement), 1000);
      }

      onClick?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      // Prevent default space scrolling behavior
      if (e.key === KEYBOARD_KEYS.SPACE) {
        e.preventDefault();
      }
    };

    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        className={`
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          inline-flex items-center justify-center
          font-medium rounded-lg
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
          transform active:scale-95
          ${className}
        `}
        disabled={isDisabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
        aria-pressed={ariaPressed}
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
        aria-describedby={ariaDescribedBy}
        aria-busy={ariaBusy || loading}
        aria-disabled={isDisabled}
        {...rest}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {icon && iconPosition === 'left' && (
          <span className="mr-2" aria-hidden="true">
            {icon}
          </span>
        )}
        
        {children}
        
        {icon && iconPosition === 'right' && (
          <span className="ml-2" aria-hidden="true">
            {icon}
          </span>
        )}
      </button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';

export default AccessibleButton;