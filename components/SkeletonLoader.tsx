
import { ErrorBoundary } from &apos;./ui/ErrorBoundary&apos;;

interface SkeletonProps {
}
  className?: string;
  variant?: &apos;rect&apos; | &apos;circle&apos; | &apos;text&apos; | &apos;card&apos; | &apos;table&apos; | &apos;chart&apos; | &apos;avatar&apos;;
  width?: string | number;
  height?: string | number;
  rows?: number;
  animation?: &apos;pulse&apos; | &apos;wave&apos; | &apos;none&apos;;

}

const SkeletonLoader: React.FC<SkeletonProps> = ({ 
}
  className = &apos;&apos;, 
  variant = &apos;rect&apos;,
  width,
  height,
  rows = 1,
  animation = &apos;pulse&apos;
}: any) => {
}
  const getBaseClasses = () => {
}
    let animationClass = &apos;&apos;;
    if (animation === &apos;pulse&apos;) {
}
      animationClass = &apos;animate-pulse&apos;;
    } else if (animation === &apos;wave&apos;) {
}
      animationClass = &apos;animate-wave&apos;;
    }

    return `${animationClass} bg-slate-700/80`;
  };

  const getVariantClasses = () => {
}
    switch (variant) {
}
      case &apos;circle&apos;:
        return &apos;rounded-full&apos;;
      case &apos;text&apos;:
        return &apos;rounded h-4&apos;;
      case &apos;card&apos;:
        return &apos;rounded-lg&apos;;
      case &apos;table&apos;:
        return &apos;rounded h-12&apos;;
      case &apos;chart&apos;:
        return &apos;rounded-lg&apos;;
      case &apos;avatar&apos;:
        return &apos;rounded-full w-10 h-10&apos;;
      default:
        return &apos;rounded&apos;;
    }
  };

  const getStyleProps = () => {
}
    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === &apos;number&apos; ? `${width}px` : width;
    if (height) style.height = typeof height === &apos;number&apos; ? `${height}px` : height;
    return style;
  };

  if (variant === &apos;text&apos; && rows > 1) {
}
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: rows }, (_, i) => (
          <div
            key={i}
            className={`${getBaseClasses()} ${getVariantClasses()}`}
            style={{
}
              ...getStyleProps(),
              width: i === rows - 1 ? &apos;75%&apos; : &apos;100%&apos; // Last row is shorter
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div 
      className={`${getBaseClasses()} ${getVariantClasses()} ${className}`}
      style={getStyleProps()}
    />
  );
};

// Specialized skeleton components
export const PlayerCardSkeleton: React.FC = () => (
  <div className="bg-gray-800 rounded-lg p-4 space-y-3 sm:px-4 md:px-6 lg:px-8">
    <div className="flex items-center space-x-3 sm:px-4 md:px-6 lg:px-8">
      <SkeletonLoader variant="avatar" />
      <div className="flex-1 space-y-2 sm:px-4 md:px-6 lg:px-8">
        <SkeletonLoader variant="text" width="60%" />
        <SkeletonLoader variant="text" width="40%" />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-2 sm:px-4 md:px-6 lg:px-8">
      <SkeletonLoader variant="rect" height="24px" />
      <SkeletonLoader variant="rect" height="24px" />
      <SkeletonLoader variant="rect" height="24px" />
    </div>
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ 
}
  rows = 5, 
  cols = 4 
}: any) => (
  <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
    {/* Header */}
    <div className="grid gap-4 sm:px-4 md:px-6 lg:px-8" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {Array.from({ length: cols }, (_, i) => (
        <SkeletonLoader key={`header-${i}`} variant="table" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }, (_, rowIndex) => (
      <div key={`row-${rowIndex}`} className="grid gap-4 sm:px-4 md:px-6 lg:px-8" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }, (_, colIndex) => (
          <SkeletonLoader key={`cell-${rowIndex}-${colIndex}`} variant="rect" height="32px" />
        ))}
      </div>
    ))}
  </div>
);

export const ChartSkeleton: React.FC = () => (
  <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
    <SkeletonLoader variant="text" width="30%" />
    <SkeletonLoader variant="chart" height="200px" />
    <div className="flex justify-center space-x-4 sm:px-4 md:px-6 lg:px-8">
      <SkeletonLoader variant="rect" width="80px" height="20px" />
      <SkeletonLoader variant="rect" width="80px" height="20px" />
      <SkeletonLoader variant="rect" width="80px" height="20px" />
    </div>
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
    {/* Header */}
    <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
      <SkeletonLoader variant="text" width="200px" height="32px" />
      <SkeletonLoader variant="rect" width="120px" height="40px" />
    </div>
    
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="bg-gray-800 rounded-lg p-4 space-y-2 sm:px-4 md:px-6 lg:px-8">
          <SkeletonLoader variant="text" width="60%" />
          <SkeletonLoader variant="text" width="40%" height="28px" />
        </div>
      ))}
    </div>
    
    {/* Main Content */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartSkeleton />
      <TableSkeleton rows={6} cols={3} />
    </div>
  </div>
);

const SkeletonLoaderWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <SkeletonLoader {...props} />
  </ErrorBoundary>
);

export default React.memo(SkeletonLoaderWithErrorBoundary);
