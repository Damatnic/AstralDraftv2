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
}

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
  // Base classes with modern styling
  const baseClasses = `
    relative inline-flex items-center justify-center gap-2 
    font-semibold tracking-wide rounded-xl 
    transition-all duration-300 ease-out
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
    ${fullWidth ? 'w-full' : ''}
  `;
  
  // Modern variant styles with improved contrast and effects
  const variantClasses = {
    primary: `
      bg-gradient-to-br from-primary-500 to-primary-700 
      text-white shadow-lg shadow-primary-500/25
      hover:from-primary-600 hover:to-primary-800 hover:shadow-xl hover:shadow-primary-500/30
      hover:-translate-y-0.5 active:translate-y-0
      focus-visible:ring-blue-500
    `,
    secondary: `
      bg-white/10 backdrop-blur-md
      text-white border border-white/20
      hover:bg-white/15 hover:border-white/30 hover:shadow-lg
      hover:-translate-y-0.5 active:translate-y-0
      focus-visible:ring-white/50
    `,
    danger: `
      bg-gradient-to-br from-danger-500 to-danger-700
      text-white shadow-lg shadow-danger-500/25
      hover:from-danger-600 hover:to-danger-800 hover:shadow-xl hover:shadow-danger-500/30
      hover:-translate-y-0.5 active:translate-y-0
      focus-visible:ring-danger-500
    `,
    success: `
      bg-gradient-to-br from-secondary-500 to-secondary-700
      text-white shadow-lg shadow-secondary-500/25
      hover:from-secondary-600 hover:to-secondary-800 hover:shadow-xl hover:shadow-secondary-500/30
      hover:-translate-y-0.5 active:translate-y-0
      focus-visible:ring-secondary-500
    `,
    ghost: `
      bg-transparent text-gray-300
      hover:bg-white/10 hover:text-white
      focus-visible:ring-white/50
    `,
    outline: `
      bg-transparent border-2 border-primary-500 text-primary-400
      hover:bg-primary-500/10 hover:text-primary-300 hover:border-primary-400
      hover:shadow-lg hover:shadow-primary-500/20
      focus-visible:ring-blue-500
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
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    </div>
  );

  // Shimmer effect for primary buttons
  const ShimmerEffect = () => (
    variant === 'primary' && !disabled && !loading ? (
      <div className="absolute inset-0 -top-px rounded-xl overflow-hidden">
        <div className="absolute inset-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                        transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
      </div>
    ) : null
  );

  return (
    <motion.button
      className={`group ${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      {...props}
    >
      <ShimmerEffect />
      
      <span className={`relative flex items-center gap-2 ${loading ? 'opacity-0' : ''}`}>
        {icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </span>
      
      {loading && <LoadingSpinner />}
    </motion.button>
  );
};