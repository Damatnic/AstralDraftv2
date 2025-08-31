import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'children'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  className = '',
  ...props
}) => {
  // Premium base classes with enhanced styling
  const baseClasses = `
    relative inline-flex items-center justify-center gap-2 
    font-semibold tracking-wide rounded-xl 
    transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900
    disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
    overflow-hidden isolate
    ${fullWidth ? 'w-full' : ''}
  `;
  
  // Premium variant styles with enhanced gradients and effects
  const variantClasses = {
    primary: `
      bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 
      text-white shadow-xl shadow-primary-500/30
      hover:from-primary-400 hover:via-primary-500 hover:to-primary-600
      hover:shadow-2xl hover:shadow-primary-500/40
      hover:-translate-y-1 hover:scale-[1.02]
      active:translate-y-0 active:scale-[0.98]
      focus-visible:ring-primary-400
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
      before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700
    `,
    secondary: `
      glass-card
      text-white border border-white/15
      hover:bg-white/10 hover:border-white/25 hover:shadow-xl
      hover:-translate-y-1 hover:scale-[1.02]
      active:translate-y-0 active:scale-[0.98]
      focus-visible:ring-white/50
    `,
    danger: `
      bg-gradient-to-r from-red-500 via-red-600 to-red-700
      text-white shadow-xl shadow-red-500/30
      hover:from-red-400 hover:via-red-500 hover:to-red-600
      hover:shadow-2xl hover:shadow-red-500/40
      hover:-translate-y-1 hover:scale-[1.02]
      active:translate-y-0 active:scale-[0.98]
      focus-visible:ring-red-400
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
      before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700
    `,
    success: `
      bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700
      text-white shadow-xl shadow-emerald-500/30
      hover:from-emerald-400 hover:via-emerald-500 hover:to-emerald-600
      hover:shadow-2xl hover:shadow-emerald-500/40
      hover:-translate-y-1 hover:scale-[1.02]
      active:translate-y-0 active:scale-[0.98]
      focus-visible:ring-emerald-400
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
      before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700
    `,
    ghost: `
      bg-transparent text-gray-300
      hover:bg-white/5 hover:text-white hover:backdrop-blur-sm
      focus-visible:ring-white/30
      transition-all duration-200
    `,
    outline: `
      bg-transparent border-2 border-primary-400/50 text-primary-300
      hover:bg-primary-500/10 hover:text-primary-200 hover:border-primary-400
      hover:shadow-xl hover:shadow-primary-500/20
      hover:backdrop-blur-sm
      focus-visible:ring-primary-400
      transition-all duration-200
    `
  };
  
  // Improved size classes with better proportions
  const sizeClasses = {
    xs: 'px-3 py-1.5 text-xs min-h-[32px]',
    sm: 'px-4 py-2 text-sm min-h-[36px]',
    md: 'px-5 py-2.5 text-base min-h-[44px]',
    lg: 'px-6 py-3 text-lg min-h-[52px]',
    xl: 'px-8 py-4 text-xl min-h-[60px]'
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="absolute inset-0 flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin sm:px-4 md:px-6 lg:px-8" />
    </div>
  );

  // Premium shimmer and glow effects
  const PremiumEffects = () => (
    <>
      {/* Shimmer effect */}
      {(variant === 'primary' || variant === 'success' || variant === 'danger') && !disabled && !loading && (
        <div className="absolute inset-0 -top-px rounded-xl overflow-hidden -z-10 sm:px-4 md:px-6 lg:px-8">
          <div className="absolute inset-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent 
                          transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 sm:px-4 md:px-6 lg:px-8" />
        </div>
      )}
      
      {/* Glow effect on hover */}
      {variant === 'primary' && !disabled && !loading && (
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-20 sm:px-4 md:px-6 lg:px-8">
          <div className="absolute inset-0 rounded-xl bg-primary-500/20 blur-xl sm:px-4 md:px-6 lg:px-8" />
        </div>
      )}
    </>
  );

  return (
    <motion.button
      className={`group ${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      {...props}
    >
      <PremiumEffects />
      
      <span className={`relative flex items-center gap-2 ${loading ? 'opacity-0' : ''}`}>
        {icon && iconPosition === 'left' && (
          <span className="flex-shrink-0 sm:px-4 md:px-6 lg:px-8">{icon}</span>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <span className="flex-shrink-0 sm:px-4 md:px-6 lg:px-8">{icon}</span>
        )}
      </span>
      
      {loading && <LoadingSpinner />}
    </motion.button>
  );
};