import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { memo } from 'react';

const TrainingDataManager = memo(() => {
    return (
        <div className="p-4 sm:px-4 md:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-white sm:px-4 md:px-6 lg:px-8">Training Data Manager</h2>
            <p className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Component is being reconstructed...</p>
        </div>
    );
});

const TrainingDataManagerWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <TrainingDataManager {...props} />
  </ErrorBoundary>
);

export default React.memo(TrainingDataManagerWithErrorBoundary);
