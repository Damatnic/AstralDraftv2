
import { ErrorBoundary } from '../ui/ErrorBoundary';
import React from 'react';
import { Widget } from '../ui/Widget';
import { FireIcon } from '../icons/FireIcon';

const OnTheHotSeatWidget: React.FC = () => {
    // This is a placeholder component to fix a build error.
    // The full implementation will be added in a future update.
    return (
        <Widget title="On The Hot Seat" icon={<FireIcon />}>
            <div className="p-4 text-center text-xs text-gray-400 h-full flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
                Feature coming soon...
            </div>
        </Widget>
    );
};

const OnTheHotSeatWidgetWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <OnTheHotSeatWidget {...props} />
  </ErrorBoundary>
);

export default React.memo(OnTheHotSeatWidgetWithErrorBoundary);
