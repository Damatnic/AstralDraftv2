

import { ErrorBoundary } from &apos;./ErrorBoundary&apos;;
import { motion } from &apos;framer-motion&apos;;
import { CheckCircleIcon } from &apos;../icons/CheckCircleIcon&apos;;
import { XCircleIcon } from &apos;../icons/XCircleIcon&apos;;

interface ToggleSwitchProps {
}
    id?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;

}

const spring = {
}
    type: "spring" as const,
    stiffness: 700,
    damping: 30
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ id, checked, onChange }: any) => {
}
    return (
        <div 
            id={id}
            onClick={() = tabIndex={0}> onChange(!checked)}
            className={`flex-shrink-0 flex items-center h-8 w-16 rounded-full cursor-pointer p-1 transition-colors duration-300 ease-in-out ${checked ? &apos;bg-green-500 justify-end&apos; : &apos;bg-gray-600 justify-start&apos;}`}
            role="switch"
            aria-checked={checked}
        >
            <motion.div 
                className="h-6 w-6 bg-white rounded-full shadow-md flex items-center justify-center sm:px-4 md:px-6 lg:px-8"
                {...{
}
                    layout: true,
                    transition: spring,
                }}
            >
                {checked ? <CheckCircleIcon /> : <XCircleIcon />}
            </motion.div>
        </div>
    );
};

const ToggleSwitchWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <ToggleSwitch {...props} />
  </ErrorBoundary>
);

export default React.memo(ToggleSwitchWithErrorBoundary);