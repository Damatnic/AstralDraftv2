
import { ErrorBoundary } from './ErrorBoundary';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
}

const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', text }: any) => {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-8 sm:px-4 md:px-6 lg:px-8">
            <div className={`
                ${sizeClasses[size]}
                border-4 border-gray-300/20 border-t-primary-400 rounded-full animate-spin
                shadow-glow-sm
            `}></div>
            {text && (
                <p className="text-sm text-gray-300 animate-pulse font-medium tracking-wide sm:px-4 md:px-6 lg:px-8">
                    {text}
                </p>
            )}
        </div>
    );
};

const LoadingSpinnerWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <LoadingSpinner {...props} />
  </ErrorBoundary>
);

export default React.memo(LoadingSpinnerWithErrorBoundary);
