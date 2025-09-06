import { ErrorBoundary } from './ErrorBoundary';

export const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 glass-button-primary px-4 py-2 rounded-lg sm:px-4 md:px-6 lg:px-8"
    >
      Skip to main content
    </a>
  );
};

const SkipLinkWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <SkipLink {...props} />
  </ErrorBoundary>
);

export default React.memo(SkipLinkWithErrorBoundary);