
import { ErrorBoundary } from '../ui/ErrorBoundary';
import React from 'react';
import { animate } from 'framer-motion';

interface AnimatedNumberProps {
    value: number;

}

const AnimatedNumber = ({ value }) => {
    const ref = React.useRef<HTMLSpanElement>(null);

    React.useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const fromValue = parseFloat(node.textContent || "0");
        const controls = animate(fromValue, value, {
            duration: 0.8,
            ease: "easeOut",
            onUpdate(value) {
                node.textContent = value.toFixed(value % 1 === 0 ? 0 : 1);
            },
        });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 sm:px-4 md:px-6 lg:px-8"></div>
        <span className="ml-2 sm:px-4 md:px-6 lg:px-8">Loading...</span>
      </div>
    );

  return () => controls.stop();
    }, [value]);

    return <span ref={ref}>{value}</span>;
};

const AnimatedNumberWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <AnimatedNumber {...props} />
  </ErrorBoundary>
);

export default React.memo(AnimatedNumberWithErrorBoundary);