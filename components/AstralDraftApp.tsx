import { ErrorBoundary } from '../ui/ErrorBoundary';
/**
 * Main App Component wrapper - Imports from OracleOnlyApp for backwards compatibility
 */

import OracleOnlyApp from &apos;./OracleOnlyApp&apos;;

const OracleOnlyAppWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <OracleOnlyApp {...props} />
  </ErrorBoundary>
);

export default React.memo(OracleOnlyAppWithErrorBoundary);
