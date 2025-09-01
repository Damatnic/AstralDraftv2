import { motion, HTMLMotionProps } from &apos;framer-motion&apos;;

interface ButtonProps extends Omit<HTMLMotionProps<"button">, &apos;children&apos;> {
}
  variant?: &apos;primary&apos; | &apos;secondary&apos; | &apos;danger&apos; | &apos;success&apos; | &apos;ghost&apos; | &apos;outline&apos;;
  size?: &apos;xs&apos; | &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos; | &apos;xl&apos;;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: &apos;left&apos; | &apos;right&apos;;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
}
  variant = &apos;primary&apos;,
  size = &apos;md&apos;,
  loading = false,
  disabled,
  icon,
  iconPosition = &apos;left&apos;,
  fullWidth = false,
  children,
  className = &apos;&apos;,
  ...props
}: any) => {
}
  // Premium base classes with enhanced styling
  const baseClasses = `
    relative inline-flex items-center justify-center gap-2 
    font-semibold tracking-wide rounded-xl 
    transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900
    disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
    overflow-hidden isolate
    ${fullWidth ? &apos;w-full&apos; : &apos;&apos;}
  `;
  
  // Premium variant styles with enhanced gradients and effects
  const variantClasses = {
}
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
}
    xs: &apos;px-3 py-1.5 text-xs min-h-[32px]&apos;,
    sm: &apos;px-4 py-2 text-sm min-h-[36px]&apos;,
    md: &apos;px-5 py-2.5 text-base min-h-[44px]&apos;,
    lg: &apos;px-6 py-3 text-lg min-h-[52px]&apos;,
    xl: &apos;px-8 py-4 text-xl min-h-[60px]&apos;
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    </div>
  );

  // Premium shimmer and glow effects
  const PremiumEffects = () => (
    <>
      {/* Shimmer effect */}
      {(variant === &apos;primary&apos; || variant === &apos;success&apos; || variant === &apos;danger&apos;) && !disabled && !loading && (
}
        <div className="absolute inset-0 -top-px rounded-xl overflow-hidden -z-10">
          <div className="absolute inset-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent 
                          transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
        </div>
      )}
      
      {/* Glow effect on hover */}
      {variant === &apos;primary&apos; && !disabled && !loading && (
}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-20">
          <div className="absolute inset-0 rounded-xl bg-primary-500/20 blur-xl" />
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
      
      <span className={`relative flex items-center gap-2 ${loading ? &apos;opacity-0&apos; : &apos;&apos;}`}>
        {icon && iconPosition === &apos;left&apos; && (
}
          <span className="flex-shrink-0">{icon}</span>
        )}
        {children}
        {icon && iconPosition === &apos;right&apos; && (
}
          <span className="flex-shrink-0">{icon}</span>
        )}
      </span>
      
      {loading && <LoadingSpinner />}
    </motion.button>
  );
};