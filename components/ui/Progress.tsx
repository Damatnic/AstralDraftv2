
interface ProgressProps {
}
  value: number;
  max?: number;
  size?: &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos;;
  variant?: &apos;default&apos; | &apos;success&apos; | &apos;warning&apos; | &apos;error&apos;;
  showLabel?: boolean;
  label?: string;
  className?: string;

}

export const Progress: React.FC<ProgressProps> = ({
}
  value,
  max = 100,
  size = &apos;md&apos;,
  variant = &apos;default&apos;,
  showLabel = false,
  label,
  className = &apos;&apos;
}: any) => {
}
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
}
    sm: &apos;h-2&apos;,
    md: &apos;h-3&apos;,
    lg: &apos;h-4&apos;
  };

  const variantClasses = {
}
    default: &apos;bg-[var(--color-primary)]&apos;,
    success: &apos;bg-green-500&apos;,
    warning: &apos;bg-yellow-500&apos;,
    error: &apos;bg-red-500&apos;
  };

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || label) && (
}
        <div className="flex justify-between items-center mb-2 sm:px-4 md:px-6 lg:px-8">
          <span className="text-sm font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
            {label || &apos;Progress&apos;}
          </span>
          <span className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      
      <div className={`w-full bg-gray-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`h-full transition-all duration-300 ease-out ${variantClasses[variant]}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};