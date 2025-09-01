
interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
  className?: string;


const EnhancedLoading: React.FC<LoadingProps> = ({
  size = 'md',
  text = 'Loading...',
  fullScreen = false,
  className = ''
}: any) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
    : 'flex items-center justify-center p-4';

  return (
    <div 
      className={containerClasses + ' ' + className}
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
