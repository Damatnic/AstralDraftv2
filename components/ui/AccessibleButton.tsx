/**
 * Accessible Button Component
 * Enhanced with proper ARIA attributes, keyboard navigation, and mobile touch targets
 */

import { ErrorBoundary } from &apos;./ErrorBoundary&apos;;
import React, { useCallback } from &apos;react&apos;;
import { motion } from &apos;framer-motion&apos;;
import { getButtonA11yProps, useAnnouncer } from &apos;../../utils/accessibility&apos;;

export interface AccessibleButtonProps {
}
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: &apos;button&apos; | &apos;submit&apos; | &apos;reset&apos;;
  variant?: &apos;primary&apos; | &apos;secondary&apos; | &apos;danger&apos; | &apos;ghost&apos;;
  size?: &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos;;
  className?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  isLoading?: boolean;
  loadingText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  // For toggle buttons
  pressed?: boolean;
  // For dropdown/expandable buttons
  expanded?: boolean;
  // Announcement settings
  announceOnClick?: string;
  announceOnDisabled?: string;

}

const variantClasses = {
}
  primary: &apos;bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700&apos;,
  secondary: &apos;bg-gray-600 hover:bg-gray-700 text-white border-gray-600 hover:border-gray-700&apos;,
  danger: &apos;bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700&apos;,
  ghost: &apos;bg-transparent hover:bg-gray-100 text-gray-700 border-transparent hover:border-gray-300&apos;
};

const sizeClasses = {
}
  sm: &apos;px-3 py-1.5 text-sm&apos;,
  md: &apos;px-4 py-2 text-base&apos;,
  lg: &apos;px-6 py-3 text-lg&apos;
};

const disabledClasses = &apos;opacity-50 cursor-not-allowed pointer-events-none&apos;;

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
}
  children,
  onClick,
  disabled = false,
  type = &apos;button&apos;,
  variant = &apos;primary&apos;,
  size = &apos;md&apos;,
  className = &apos;&apos;,
  ariaLabel,
  ariaDescribedBy,
  isLoading = false,
  loadingText = &apos;Loading...&apos;,
  startIcon,
  endIcon,
  pressed,
  expanded,
  announceOnClick,
//   announceOnDisabled
}: any) => {
}
  const { announce } = useAnnouncer();

  const handleClick = () => {
}
    if (disabled || isLoading) {
}
      if (announceOnDisabled) {
}
        announce(announceOnDisabled, &apos;polite&apos;);

      return;

    if (onClick) {
}
      onClick();

    if (announceOnClick) {
}
      announce(announceOnClick, &apos;polite&apos;);

  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
}
    // Handle Enter and Space key activation
    if (e.key === &apos;Enter&apos; || e.key === &apos; &apos;) {
}
      e.preventDefault();
      handleClick();

  };

  const buttonContent = isLoading ? (
    <>
      <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2 sm:px-4 md:px-6 lg:px-8" />
      {loadingText}
    </>
  ) : (
    <>
      {startIcon && <span className="mr-2 sm:px-4 md:px-6 lg:px-8">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-2 sm:px-4 md:px-6 lg:px-8">{endIcon}</span>}
    </>
  );

  const a11yProps = getButtonA11yProps(
    ariaLabel || (typeof children === &apos;string&apos; ? children : &apos;&apos;),
    disabled || isLoading,
    pressed,
//     expanded
  );

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled || isLoading}
      className={`
}
        mobile-touch-target inline-flex items-center justify-center
        font-medium rounded-lg border transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled || isLoading ? disabledClasses : &apos;&apos;}
        ${className}
      `}
      whileHover={disabled || isLoading ? {} : { scale: 1.02 }}
      whileTap={disabled || isLoading ? {} : { scale: 0.98 }}
      aria-describedby={ariaDescribedBy}
      {...a11yProps}
    >
      {buttonContent}
    </motion.button>
  );
};

/**
 * Icon Button - optimized for mobile touch targets
 */
export interface AccessibleIconButtonProps {
}
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel: string; // Required for icon buttons
  ariaDescribedBy?: string;
  size?: &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos;;
  variant?: &apos;primary&apos; | &apos;secondary&apos; | &apos;danger&apos; | &apos;ghost&apos;;
  className?: string;
  isLoading?: boolean;
  pressed?: boolean;
  expanded?: boolean;
  announceOnClick?: string;

}

export const AccessibleIconButton: React.FC<AccessibleIconButtonProps> = ({
}
  icon,
  onClick,
  disabled = false,
  ariaLabel,
  ariaDescribedBy,
  size = &apos;md&apos;,
  variant = &apos;ghost&apos;,
  className = &apos;&apos;,
  isLoading = false,
  pressed,
  expanded,
//   announceOnClick
}: any) => {
}
  const { announce } = useAnnouncer();

  const handleClick = () => {
}
    if (disabled || isLoading) return;

    if (onClick) {
}
      onClick();

    if (announceOnClick) {
}
      announce(announceOnClick, &apos;polite&apos;);

  };

  const iconSizeClasses = {
}
    sm: &apos;w-4 h-4&apos;,
    md: &apos;w-5 h-5&apos;, 
    lg: &apos;w-6 h-6&apos;
  };

  const buttonSizeClasses = {
}
    sm: &apos;p-1.5&apos;,
    md: &apos;p-2&apos;,
    lg: &apos;p-3&apos;
  };

  const a11yProps = getButtonA11yProps(ariaLabel, disabled || isLoading, pressed, expanded);

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`
}
        mobile-touch-target inline-flex items-center justify-center
        rounded-full transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${variantClasses[variant]}
        ${buttonSizeClasses[size]}
        ${disabled || isLoading ? disabledClasses : &apos;&apos;}
        ${className}
      `}
      whileHover={disabled || isLoading ? {} : { scale: 1.05 }}
      whileTap={disabled || isLoading ? {} : { scale: 0.95 }}
      aria-describedby={ariaDescribedBy}
      {...a11yProps}
    >
      {isLoading ? (
}
        <div className={`animate-spin border-2 border-current border-t-transparent rounded-full ${iconSizeClasses[size]}`} />
      ) : (
        <span className={iconSizeClasses[size]}>{icon}</span>
      )}
    </motion.button>
  );
};

const AccessibleButtonWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <AccessibleButton {...props} />
  </ErrorBoundary>
);

export default React.memo(AccessibleButtonWithErrorBoundary);
