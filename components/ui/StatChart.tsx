

import { ErrorBoundary } from './ErrorBoundary';
import React from 'react';
import { motion } from 'framer-motion';

interface StatChartProps {
  label: string;
  value: number;
  maxValue: number;
  prefix?: string;
  color?: string;

}

const StatChart: React.FC<StatChartProps> = ({ label, value, maxValue, prefix = '', color = 'bg-cyan-500' }) => {
  const percentage = (value / maxValue) * 100;

  return (
    <div className="bg-white/5 p-3 rounded-lg w-full sm:px-4 md:px-6 lg:px-8">
      <div className="flex justify-between items-baseline mb-1 sm:px-4 md:px-6 lg:px-8">
        <p className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">{label}</p>
        <p className="text-lg font-bold text-white sm:px-4 md:px-6 lg:px-8">{prefix}{value}</p>
      </div>
      <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden sm:px-4 md:px-6 lg:px-8">
        <motion.div
          className={`h-full rounded-full ${color}`}
          {...{
            initial: { width: 0 },
            animate: { width: `${percentage}%` },
            transition: { duration: 0.8, ease: 'easeOut' },
          }}
        />
      </div>
    </div>
  );
};

const StatChartWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <StatChart {...props} />
  </ErrorBoundary>
);

export default React.memo(StatChartWithErrorBoundary);