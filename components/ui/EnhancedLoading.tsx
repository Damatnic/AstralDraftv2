
interface LoadingProps {
}
  size?: &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos;;
  text?: string;
  fullScreen?: boolean;
  className?: string;

}

const EnhancedLoading: React.FC<LoadingProps> = ({
}
  size = &apos;md&apos;,
  text = &apos;Loading...&apos;,
  fullScreen = false,
  className = &apos;&apos;
}: any) => {
}
  const sizeClasses = {
}
    sm: &apos;h-4 w-4&apos;,
    md: &apos;h-8 w-8&apos;,
    lg: &apos;h-12 w-12&apos;
  };

  const containerClasses = fullScreen 
    ? &apos;fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50&apos;
    : &apos;flex items-center justify-center p-4&apos;;

  return (
    <div 
      className={containerClasses + &apos; &apos; + className}
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      <div className="flex flex-col items-center space-y-2">
        <div 
          className={`animate-spin rounded-full border-b-2 border-primary-500 ${sizeClasses[size]}`}
          aria-hidden="true"
        />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {text}
        </span>
      </div>
    </div>
  );
};

export default EnhancedLoading;
