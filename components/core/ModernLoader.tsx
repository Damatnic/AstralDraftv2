/**
 * Modern Loading Components
 * Beautiful loading states for the app
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo } from &apos;react&apos;;
import { motion } from &apos;framer-motion&apos;;
import { StarIcon } from &apos;lucide-react&apos;;

// Full Page Loader
export const FullPageLoader: React.FC<{ message?: string }> = ({ message = &apos;Loading...&apos; }: any) => {
}
  return (
    <div className="fixed inset-0 bg-[var(--bg-primary)] flex items-center justify-center z-50 sm:px-4 md:px-6 lg:px-8">
      <div className="text-center sm:px-4 md:px-6 lg:px-8">
        <motion.div
          animate={{
}
            rotate: 360,
          }}
          transition={{
}
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
          className="inline-block mb-4 sm:px-4 md:px-6 lg:px-8"
        >
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
            <StarIcon className="w-8 h-8 text-white sm:px-4 md:px-6 lg:px-8" />
          </div>
        </motion.div>
        
        <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
          <h2 className="text-xl font-semibold gradient-text sm:px-4 md:px-6 lg:px-8">Astral Draft</h2>
          <p className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">{message}</p>
        </div>
        
        <div className="mt-4 flex justify-center gap-1 sm:px-4 md:px-6 lg:px-8">
          {[0, 1, 2].map((i: any) => (
}
            <motion.div
              key={i}
              animate={{
}
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
}
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2 h-2 rounded-full bg-[var(--primary)] sm:px-4 md:px-6 lg:px-8"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Inline Spinner
export const Spinner: React.FC<{ size?: &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos;; className?: string }> = ({
}
  size = &apos;md&apos;,
  className = &apos;&apos;
}: any) => {
}
  const sizes = {
}
    sm: &apos;w-4 h-4&apos;,
    md: &apos;w-6 h-6&apos;,
    lg: &apos;w-8 h-8&apos;
  };

  return (
    <div className={`${sizes[size]} ${className}`}>
      <svg
        className="animate-spin sm:px-4 md:px-6 lg:px-8"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25 sm:px-4 md:px-6 lg:px-8"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75 sm:px-4 md:px-6 lg:px-8"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

// Skeleton Loader
interface SkeletonProps {
}
  className?: string;
  variant?: &apos;text&apos; | &apos;circular&apos; | &apos;rectangular&apos;;
  width?: string | number;
  height?: string | number;
  animation?: &apos;pulse&apos; | &apos;wave&apos;;

}

export const Skeleton: React.FC<SkeletonProps> = ({
}
  className = &apos;&apos;,
  variant = &apos;text&apos;,
  width,
  height,
  animation = &apos;pulse&apos;
}: any) => {
}
  const variantClasses = {
}
    text: &apos;h-4 rounded&apos;,
    circular: &apos;rounded-full&apos;,
    rectangular: &apos;rounded-lg&apos;
  };

  const animationClasses = {
}
    pulse: &apos;animate-pulse&apos;,
    wave: &apos;skeleton&apos;
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === &apos;number&apos; ? `${width}px` : width;
  if (height) style.height = typeof height === &apos;number&apos; ? `${height}px` : height;

  return (
    <div
      className={`bg-[var(--bg-tertiary)] ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
};

// Card Skeleton
export const CardSkeleton: React.FC = () => {
}
  return (
    <div className="bg-[var(--surface-primary)] rounded-xl p-6 border border-[var(--border-primary)] sm:px-4 md:px-6 lg:px-8">
      <div className="flex items-center gap-4 mb-4 sm:px-4 md:px-6 lg:px-8">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
          <Skeleton width="60%" className="mb-2 sm:px-4 md:px-6 lg:px-8" />
          <Skeleton width="40%" />
        </div>
      </div>
      <Skeleton className="mb-2 sm:px-4 md:px-6 lg:px-8" />
      <Skeleton className="mb-2 sm:px-4 md:px-6 lg:px-8" />
      <Skeleton width="80%" />
    </div>
  );
};

// List Skeleton
export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }: any) => {
}
  return (
    <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-[var(--surface-primary)] rounded-lg sm:px-4 md:px-6 lg:px-8">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
            <Skeleton width="70%" className="mb-2 sm:px-4 md:px-6 lg:px-8" />
            <Skeleton width="40%" />
          </div>
          <Skeleton width={60} height={24} />
        </div>
      ))}
    </div>
  );
};

// Progress Bar
interface ProgressBarProps {
}
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: &apos;primary&apos; | &apos;success&apos; | &apos;warning&apos; | &apos;danger&apos;;
  size?: &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos;;
  animated?: boolean;

}

export const ProgressBar: React.FC<ProgressBarProps> = ({
}
  value,
  max = 100,
  label,
  showPercentage = false,
  color = &apos;primary&apos;,
  size = &apos;md&apos;,
  animated = true
}: any) => {
}
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const colors = {
}
    primary: &apos;from-[var(--primary)] to-[var(--secondary)]&apos;,
    success: &apos;from-green-400 to-green-600&apos;,
    warning: &apos;from-yellow-400 to-yellow-600&apos;,
    danger: &apos;from-red-400 to-red-600&apos;
  };

  const sizes = {
}
    sm: &apos;h-1&apos;,
    md: &apos;h-2&apos;,
    lg: &apos;h-3&apos;
  };

  return (
    <div className="w-full sm:px-4 md:px-6 lg:px-8">
      {(label || showPercentage) && (
}
        <div className="flex justify-between items-center mb-2 sm:px-4 md:px-6 lg:px-8">
          {label && <span className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">{label}</span>}
          {showPercentage && (
}
            <span className="text-sm font-medium sm:px-4 md:px-6 lg:px-8">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-[var(--bg-tertiary)] rounded-full overflow-hidden ${sizes[size]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 0.5 : 0, ease: &apos;easeOut&apos; }}
          className={`h-full bg-gradient-to-r ${colors[color]} rounded-full`}
        />
      </div>
    </div>
  );
};

// Loading Button
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
}
  loading?: boolean;
  loadingText?: string;
  variant?: &apos;primary&apos; | &apos;secondary&apos; | &apos;glass&apos;;

export const LoadingButton: React.FC<LoadingButtonProps> = ({
}
  loading = false,
  loadingText = &apos;Loading...&apos;,
  variant = &apos;primary&apos;,
  children,
  disabled,
  className = &apos;&apos;,
  ...props
}: any) => {
}
  const variants = {
}
    primary: &apos;btn btn-primary&apos;,
    secondary: &apos;btn btn-secondary&apos;,
    glass: &apos;btn btn-glass&apos;
  };

  return (
    <button
      className={`${variants[variant]} ${className} ${loading || disabled ? &apos;opacity-50 cursor-not-allowed&apos; : &apos;&apos;}`}
      disabled={loading || disabled}
      {...props}
     aria-label="Action button">
      {loading ? (
}
        <div className="flex items-center justify-center gap-2 sm:px-4 md:px-6 lg:px-8">
          <Spinner size="sm" />
          <span>{loadingText}</span>
        </div>
      ) : (
//         children
      )}
    </button>
  );
};

export default {
}
  FullPageLoader,
  Spinner,
  Skeleton,
  CardSkeleton,
  ListSkeleton,
  ProgressBar,
//   LoadingButton
};