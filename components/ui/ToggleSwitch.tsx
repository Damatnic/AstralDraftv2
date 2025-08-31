

import { ErrorBoundary } from './ErrorBoundary';
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { XCircleIcon } from '../icons/XCircleIcon';

interface ToggleSwitchProps {
    id?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;

}

const spring = {
    type: "spring" as const,
    stiffness: 700,
    damping: 30
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ id, checked, onChange }) => {
    return (
        <div 
            id={id}
            onClick={() = tabIndex={0}> onChange(!checked)}
            className={`flex-shrink-0 flex items-center h-8 w-16 rounded-full cursor-pointer p-1 transition-colors duration-300 ease-in-out ${checked ? 'bg-green-500 justify-end' : 'bg-gray-600 justify-start'}`}
            role="switch"
            aria-checked={checked}
        >
            <motion.div 
                className="h-6 w-6 bg-white rounded-full shadow-md flex items-center justify-center sm:px-4 md:px-6 lg:px-8"
                {...{
                    layout: true,
                    transition: spring,
                }}
            >
                {checked ? <CheckCircleIcon /> : <XCircleIcon />}
            </motion.div>
        </div>
    );
};

const ToggleSwitchWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <ToggleSwitch {...props} />
  </ErrorBoundary>
);

export default React.memo(ToggleSwitchWithErrorBoundary);