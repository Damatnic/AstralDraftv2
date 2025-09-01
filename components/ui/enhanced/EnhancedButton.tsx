/**
 * Enhanced Button Component - Premium UI/UX with Advanced Interactions
 * Glassmorphism, micro-animations, accessibility features, and modern design
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo, forwardRef, ReactNode, ButtonHTMLAttributes } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { RippleEffect, GlowEffect } from &apos;./AnimationLibrary&apos;;

// =========================================
// TYPES & INTERFACES
// =========================================

type ButtonVariant = 
  | &apos;primary&apos; 
  | &apos;secondary&apos; 
  | &apos;success&apos; 
  | &apos;warning&apos; 
  | &apos;danger&apos; 
  | &apos;ghost&apos; 
  | &apos;glass&apos; 
  | &apos;gradient&apos; 
  | &apos;neon&apos;
  | &apos;champion&apos;
  | &apos;legend&apos;;

type ButtonSize = &apos;xs&apos; | &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos; | &apos;xl&apos;;

type ButtonShape = &apos;rounded&apos; | &apos;pill&apos; | &apos;square&apos; | &apos;circle&apos;;

interface EnhancedButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, &apos;size&apos;> {
}
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
  as?: &apos;button&apos; | &apos;a&apos;;

// =========================================
// BUTTON COMPONENT
// =========================================

export const EnhancedButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, EnhancedButtonProps>(
  ({
}
    variant = &apos;primary&apos;,
    size = &apos;md&apos;,
    shape = &apos;rounded&apos;,
    loading = false,
    loadingText = &apos;Loading...&apos;,
    leftIcon,
    rightIcon,
    glow = false,
    ripple = true,
    fullWidth = false,
    elevated = false,
    children,
    className = &apos;&apos;,
    disabled,
    href,
    as = &apos;button&apos;,
    onClick,
    ...props
  }, ref) => {
}
    
    // =========================================
    // VARIANT STYLES
    // =========================================
    
    const variantStyles: Record<ButtonVariant, string> = {
}
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
}
      xs: &apos;px-3 py-1.5 text-xs font-medium min-h-[28px]&apos;,
      sm: &apos;px-4 py-2 text-sm font-medium min-h-[36px]&apos;,
      md: &apos;px-6 py-3 text-base font-semibold min-h-[44px]&apos;,
      lg: &apos;px-8 py-4 text-lg font-semibold min-h-[52px]&apos;,
      xl: &apos;px-10 py-5 text-xl font-bold min-h-[60px]&apos;
    };

    // =========================================
    // SHAPE STYLES
    // =========================================
    
    const shapeStyles: Record<ButtonShape, string> = {
}
      rounded: &apos;rounded-lg&apos;,
      pill: &apos;rounded-full&apos;,
      square: &apos;rounded-none&apos;,
      circle: &apos;rounded-full aspect-square p-0&apos;
    };

    // =========================================
    // LOADING SPINNER
    // =========================================
    
    const LoadingSpinner = ({ size: spinnerSize }: { size: ButtonSize }) => {
}
      const spinnerSizes = {
}
        xs: &apos;w-3 h-3&apos;,
        sm: &apos;w-4 h-4&apos;,
        md: &apos;w-5 h-5&apos;,
        lg: &apos;w-6 h-6&apos;,
        xl: &apos;w-7 h-7&apos;
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
      fullWidth ? &apos;w-full&apos; : &apos;&apos;,
      elevated ? &apos;shadow-lg hover:shadow-xl&apos; : &apos;&apos;,
      loading ? &apos;cursor-wait&apos; : &apos;&apos;,
//       className
    ].filter(Boolean).join(&apos; &apos;);

    // =========================================
    // BUTTON CONTENT
    // =========================================
    
    const buttonContent = (
      <>
        <AnimatePresence mode="wait">
          {loading ? (
}
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
}
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
}
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
}
      whileHover: {
}
        scale: 1.02,
        y: -1,
        transition: { duration: 0.2, ease: "easeOut" }
      },
      whileTap: {
}
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
}
      let content = children;

      if (ripple && !disabled && !loading) {
}
        content = <RippleEffect>{content}</RippleEffect>;

      if (glow && !disabled) {
}
        content = <GlowEffect>{content}</GlowEffect>;

      return <>{content}</>;
    };

    if (as === &apos;a&apos; && href) {
}
      return (
        <ButtonWrapper>
          <MotionAnchor>
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
        <MotionButton>
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

EnhancedButton.displayName = &apos;EnhancedButton&apos;;

// =========================================
// BUTTON GROUP COMPONENT
// =========================================

interface ButtonGroupProps {
}
  children: ReactNode;
  className?: string;
  orientation?: &apos;horizontal&apos; | &apos;vertical&apos;;
  spacing?: &apos;none&apos; | &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos;;
  variant?: &apos;connected&apos; | &apos;separated&apos;;

}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
}
  children,
  className = &apos;&apos;,
  orientation = &apos;horizontal&apos;,
  spacing = &apos;sm&apos;,
  variant = &apos;separated&apos;
}: any) => {
}
  const spacingClasses = {
}
    none: &apos;&apos;,
    sm: orientation === &apos;horizontal&apos; ? &apos;space-x-2&apos; : &apos;space-y-2&apos;,
    md: orientation === &apos;horizontal&apos; ? &apos;space-x-4&apos; : &apos;space-y-4&apos;,
    lg: orientation === &apos;horizontal&apos; ? &apos;space-x-6&apos; : &apos;space-y-6&apos;
  };

  const baseClasses = `
    ${orientation === &apos;horizontal&apos; ? &apos;flex flex-row&apos; : &apos;flex flex-col&apos;}
    ${variant === &apos;separated&apos; ? spacingClasses[spacing] : &apos;&apos;}
  `;

  if (variant === &apos;connected&apos;) {
}
    return (
      <div className={`${baseClasses} ${className}`} role="group">
        {React.Children.map(children, (child, index) => {
}
          if (!React.isValidElement(child)) return child;
          
          const isFirst = index === 0;
          const isLast = index === React.Children.count(children) - 1;
          
          let roundedClasses = &apos;&apos;;
          if (orientation === &apos;horizontal&apos;) {
}
            if (isFirst) roundedClasses = &apos;rounded-r-none&apos;;
            else if (isLast) roundedClasses = &apos;rounded-l-none&apos;;
            else roundedClasses = &apos;rounded-none&apos;;
          } else {
}
            if (isFirst) roundedClasses = &apos;rounded-b-none&apos;;
            else if (isLast) roundedClasses = &apos;rounded-t-none&apos;;
            else roundedClasses = &apos;rounded-none&apos;;

          return React.cloneElement(child, {
}
            className: `${child.props.className || &apos;&apos;} ${roundedClasses} ${!isFirst ? &apos;border-l-0&apos; : &apos;&apos;}`.trim()
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

interface FloatingActionButtonProps extends Omit<EnhancedButtonProps, &apos;shape&apos; | &apos;size&apos;> {
}
  position?: &apos;bottom-right&apos; | &apos;bottom-left&apos; | &apos;top-right&apos; | &apos;top-left&apos;;
  size?: &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos;;
  tooltip?: string;

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
}
  position = &apos;bottom-right&apos;,
  size = &apos;md&apos;,
  tooltip,
  children,
  className = &apos;&apos;,
  ...props
}: any) => {
}
  const positionClasses = {
}
    &apos;bottom-right&apos;: &apos;fixed bottom-6 right-6&apos;,
    &apos;bottom-left&apos;: &apos;fixed bottom-6 left-6&apos;,
    &apos;top-right&apos;: &apos;fixed top-6 right-6&apos;,
    &apos;top-left&apos;: &apos;fixed top-6 left-6&apos;
  };

  return (
    <div className={`${positionClasses[position]} z-50`}>
      <EnhancedButton>
        shape="circle"
        size={size}
//         elevated
//         glow
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
}
  ButtonVariant,
  ButtonSize,
  ButtonShape,
  EnhancedButtonProps,
  ButtonGroupProps,
//   FloatingActionButtonProps
};