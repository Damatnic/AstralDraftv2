/**
 * Enhanced Button Component - Premium UI/UX with Advanced Interactions
 * Glassmorphism, micro-animations, accessibility features, and modern design
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useMemo, forwardRef, ReactNode, ButtonHTMLAttributes } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RippleEffect, GlowEffect } from './AnimationLibrary';

// =========================================
// TYPES & INTERFACES
// =========================================

type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'warning' 
  | 'danger' 
  | 'ghost' 
  | 'glass' 
  | 'gradient' 
  | 'neon'
  | 'champion'
  | 'legend';

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type ButtonShape = 'rounded' | 'pill' | 'square' | 'circle';

interface EnhancedButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  glow?: boolean;
  ripple?: boolean;
  fullWidth?: boolean;
  elevated?: boolean;
  children: ReactNode;
  href?: string;
  as?: 'button' | 'a';

// =========================================
// BUTTON COMPONENT
// =========================================

export const EnhancedButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, EnhancedButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    shape = 'rounded',
    loading = false,
    loadingText = 'Loading...',
    leftIcon,
    rightIcon,
    glow = false,
    ripple = true,
    fullWidth = false,
    elevated = false,
    children,
    className = '',
    disabled,
    href,
    as = 'button',
    onClick,
    ...props
  }, ref) => {
    
    // =========================================
    // VARIANT STYLES
    // =========================================
    
    const variantStyles: Record<ButtonVariant, string> = {
      primary: `
        bg-gradient-to-r from-primary-600 to-primary-500 
        text-white border-primary-600 
        hover:from-primary-700 hover:to-primary-600 
        hover:border-primary-700 hover:shadow-lg
        focus:ring-primary-500 focus:ring-opacity-50
        active:from-primary-800 active:to-primary-700
      `,
      
      secondary: `
        bg-glass-medium backdrop-blur-xl 
        text-neutral-200 border-glass-border
        hover:bg-glass-heavy hover:border-glass-border-strong hover:text-white
        focus:ring-primary-500 focus:ring-opacity-50
        active:bg-glass-light
      `,
      
      success: `
        bg-gradient-to-r from-success-600 to-success-500 
        text-white border-success-600
        hover:from-success-700 hover:to-success-600 
        hover:border-success-700
        focus:ring-success-500 focus:ring-opacity-50
        active:from-success-800 active:to-success-700
      `,
      
      warning: `
        bg-gradient-to-r from-warning-600 to-warning-500 
        text-neutral-900 border-warning-600
        hover:from-warning-700 hover:to-warning-600 
        hover:border-warning-700
        focus:ring-warning-500 focus:ring-opacity-50
        active:from-warning-800 active:to-warning-700
      `,
      
      danger: `
        bg-gradient-to-r from-danger-600 to-danger-500 
        text-white border-danger-600
        hover:from-danger-700 hover:to-danger-600 
        hover:border-danger-700
        focus:ring-danger-500 focus:ring-opacity-50
        active:from-danger-800 active:to-danger-700
      `,
      
      ghost: `
        bg-transparent text-neutral-400 border-transparent
        hover:bg-glass-light hover:text-white
        focus:ring-primary-500 focus:ring-opacity-50
        active:bg-glass-medium
      `,
      
      glass: `
        bg-glass-light backdrop-blur-2xl 
        text-white border-glass-border
        hover:bg-glass-medium hover:border-glass-border-strong
        focus:ring-white focus:ring-opacity-20
        active:bg-glass-heavy
        shadow-glass
      `,
      
      gradient: `
        bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500
        text-white border-transparent
        hover:from-primary-600 hover:via-purple-600 hover:to-pink-600
        focus:ring-purple-500 focus:ring-opacity-50
        active:from-primary-700 active:via-purple-700 active:to-pink-700
        bg-size-200 hover:bg-pos-0
      `,
      
      neon: `
        bg-transparent text-brand-neon border-brand-neon
        hover:bg-brand-neon hover:text-dark-900 hover:shadow-neon
        focus:ring-brand-neon focus:ring-opacity-50
        active:bg-opacity-80
        shadow-glow-neon
      `,
      
      champion: `
        bg-gradient-to-r from-champion to-yellow-400
        text-neutral-900 border-yellow-500
        hover:from-yellow-300 hover:to-yellow-400
        hover:shadow-[0_0_30px_rgba(255,215,0,0.6)]
        focus:ring-yellow-500 focus:ring-opacity-50
        active:from-yellow-500 active:to-yellow-600
        font-bold
      `,
      
      legend: `
        bg-gradient-to-r from-legend to-purple-400
        text-white border-purple-500
        hover:from-purple-500 hover:to-purple-400
        hover:shadow-[0_0_30px_rgba(159,122,234,0.6)]
        focus:ring-purple-500 focus:ring-opacity-50
        active:from-purple-600 active:to-purple-500
        font-semibold
      `
    };

    // =========================================
    // SIZE STYLES
    // =========================================
    
    const sizeStyles: Record<ButtonSize, string> = {
      xs: 'px-3 py-1.5 text-xs font-medium min-h-[28px]',
      sm: 'px-4 py-2 text-sm font-medium min-h-[36px]',
      md: 'px-6 py-3 text-base font-semibold min-h-[44px]',
      lg: 'px-8 py-4 text-lg font-semibold min-h-[52px]',
      xl: 'px-10 py-5 text-xl font-bold min-h-[60px]'
    };

    // =========================================
    // SHAPE STYLES
    // =========================================
    
    const shapeStyles: Record<ButtonShape, string> = {
      rounded: 'rounded-lg',
      pill: 'rounded-full',
      square: 'rounded-none',
      circle: 'rounded-full aspect-square p-0'
    };

    // =========================================
    // LOADING SPINNER
    // =========================================
    
    const LoadingSpinner = ({ size: spinnerSize }: { size: ButtonSize }) => {
      const spinnerSizes = {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
        xl: 'w-7 h-7'
      };

      return (
        <motion.div
          className={`${spinnerSizes[spinnerSize]} border-2 border-current border-t-transparent rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      );
    };

    // =========================================
    // COMBINED CLASSES
    // =========================================
    
    const baseClasses = `
      inline-flex items-center justify-center gap-2 
      font-sans font-semibold leading-none
      border border-solid
      transition-all duration-300 ease-out
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
      disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
      relative overflow-hidden
      select-none
    `;

    const classes = [
      baseClasses,
      variantStyles[variant],
      sizeStyles[size],
      shapeStyles[shape],
      fullWidth ? 'w-full' : '',
      elevated ? 'shadow-lg hover:shadow-xl' : '',
      loading ? 'cursor-wait' : '',
      className
    ].filter(Boolean).join(' ');

    // =========================================
    // BUTTON CONTENT
    // =========================================
    
    const buttonContent = (
      <>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center justify-center gap-2 sm:px-4 md:px-6 lg:px-8"
            >
              <LoadingSpinner size={size} />
              {loadingText && <span>{loadingText}</span>}
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center justify-center gap-2 sm:px-4 md:px-6 lg:px-8"
            >
              {leftIcon && (
                <motion.span
                  className="flex-shrink-0 sm:px-4 md:px-6 lg:px-8"
                  whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.3 }}
                >
                  {leftIcon}
                </motion.span>
              )}
              
              <span className="truncate sm:px-4 md:px-6 lg:px-8">{children}</span>
              
              {rightIcon && (
                <motion.span
                  className="flex-shrink-0 sm:px-4 md:px-6 lg:px-8"
                  whileHover={{ scale: 1.1, x: 2 }}
                  transition={{ duration: 0.3 }}
                >
                  {rightIcon}
                </motion.span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );

    // =========================================
    // ENHANCED INTERACTIONS
    // =========================================
    
    const MotionButton = motion.button;
    const MotionAnchor = motion.a;

    const motionProps = {
      whileHover: { 
        scale: 1.02,
        y: -1,
        transition: { duration: 0.2, ease: "easeOut" }
      },
      whileTap: { 
        scale: 0.98,
        y: 0,
        transition: { duration: 0.1 }
      },
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, ease: "easeOut" }
    };

    // =========================================
    // RENDER LOGIC
    // =========================================
    
    const ButtonWrapper: React.FC<{ children: ReactNode }> = ({ children }: any) => {
      let content = children;

      if (ripple && !disabled && !loading) {
        content = <RippleEffect>{content}</RippleEffect>;

      if (glow && !disabled) {
        content = <GlowEffect>{content}</GlowEffect>;

      return <>{content}</>;
    };

    if (as === 'a' && href) {
      return (
        <ButtonWrapper>
          <MotionAnchor
            ref={ref as React.Ref<HTMLAnchorElement>}
            href={href}
            className={classes}
            {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          >
            {buttonContent}
          </MotionAnchor>
        </ButtonWrapper>
      );

    return (
      <ButtonWrapper>
        <MotionButton
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          disabled={disabled || loading}
          onClick={onClick}
          className={classes}
          {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {buttonContent}
        </MotionButton>
      </ButtonWrapper>
    );

);

EnhancedButton.displayName = 'EnhancedButton';

// =========================================
// BUTTON GROUP COMPONENT
// =========================================

interface ButtonGroupProps {
  children: ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'connected' | 'separated';

}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className = '',
  orientation = 'horizontal',
  spacing = 'sm',
  variant = 'separated'
}: any) => {
  const spacingClasses = {
    none: '',
    sm: orientation === 'horizontal' ? 'space-x-2' : 'space-y-2',
    md: orientation === 'horizontal' ? 'space-x-4' : 'space-y-4',
    lg: orientation === 'horizontal' ? 'space-x-6' : 'space-y-6'
  };

  const baseClasses = `
    ${orientation === 'horizontal' ? 'flex flex-row' : 'flex flex-col'}
    ${variant === 'separated' ? spacingClasses[spacing] : ''}
  `;

  if (variant === 'connected') {
    return (
      <div className={`${baseClasses} ${className}`} role="group">
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return child;
          
          const isFirst = index === 0;
          const isLast = index === React.Children.count(children) - 1;
          
          let roundedClasses = '';
          if (orientation === 'horizontal') {
            if (isFirst) roundedClasses = 'rounded-r-none';
            else if (isLast) roundedClasses = 'rounded-l-none';
            else roundedClasses = 'rounded-none';
          } else {
            if (isFirst) roundedClasses = 'rounded-b-none';
            else if (isLast) roundedClasses = 'rounded-t-none';
            else roundedClasses = 'rounded-none';

          return React.cloneElement(child, {
            className: `${child.props.className || ''} ${roundedClasses} ${!isFirst ? 'border-l-0' : ''}`.trim()
          });
        })}
      </div>
    );

  return (
    <div className={`${baseClasses} ${className}`} role="group">
      {children}
    </div>
  );
};

// =========================================
// FLOATING ACTION BUTTON
// =========================================

interface FloatingActionButtonProps extends Omit<EnhancedButtonProps, 'shape' | 'size'> {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'sm' | 'md' | 'lg';
  tooltip?: string;

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  position = 'bottom-right',
  size = 'md',
  tooltip,
  children,
  className = '',
  ...props
}: any) => {
  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6'
  };

  return (
    <div className={`${positionClasses[position]} z-50`}>
      <EnhancedButton
        shape="circle"
        size={size}
        elevated
        glow
        className={`shadow-2xl hover:shadow-3xl ${className}`}
        title={tooltip}
        aria-label={tooltip}
        {...props}
      >
        {children}
      </EnhancedButton>
    </div>
  );
};

// =========================================
// EXPORTS
// =========================================

const EnhancedButtonWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <EnhancedButton {...props} />
  </ErrorBoundary>
);

export default React.memo(EnhancedButtonWithErrorBoundary);

export type {
  ButtonVariant,
  ButtonSize,
  ButtonShape,
  EnhancedButtonProps,
  ButtonGroupProps,
  FloatingActionButtonProps
};