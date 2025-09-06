
import { ErrorBoundary } from './ErrorBoundary';

interface EmptyStateProps {
    icon?: React.ReactNode;
    illustration?: React.ReactNode;
    message: string;
    children?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, illustration, message, children }: any) => {
    return (
        <div className="text-center py-4 px-2 text-sm text-gray-500 sm:px-4 md:px-6 lg:px-8">
            {illustration && <div className="text-gray-600 w-24 h-24 mx-auto mb-2 sm:px-4 md:px-6 lg:px-8">{illustration}</div>}
            {icon && !illustration && <div className="text-gray-600 w-8 h-8 mx-auto mb-2 sm:px-4 md:px-6 lg:px-8">{icon}</div>}
            <p>{message}</p>
            {children && <div className="mt-2 sm:px-4 md:px-6 lg:px-8">{children}</div>}
        </div>
    );
};

const EmptyStateWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <EmptyState {...props} />
  </ErrorBoundary>
);

export default React.memo(EmptyStateWithErrorBoundary);
