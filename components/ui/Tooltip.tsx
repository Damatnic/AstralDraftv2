import React, { useState } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;

interface TooltipProps {
}
  content: string;
  children: React.ReactNode;
  position?: &apos;top&apos; | &apos;bottom&apos; | &apos;left&apos; | &apos;right&apos;;
  delay?: number;

}

export const Tooltip: React.FC<TooltipProps> = ({
}
  content,
  children,
  position = &apos;top&apos;,
  delay = 500
}: any) => {
}
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
}
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
}
    if (timeoutId) {
}
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const positionClasses = {
}
    top: &apos;bottom-full left-1/2 transform -translate-x-1/2 mb-2&apos;,
    bottom: &apos;top-full left-1/2 transform -translate-x-1/2 mt-2&apos;,
    left: &apos;right-full top-1/2 transform -translate-y-1/2 mr-2&apos;,
    right: &apos;left-full top-1/2 transform -translate-y-1/2 ml-2&apos;
  };

  return (
    <div
      className="relative inline-block sm:px-4 md:px-6 lg:px-8"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`absolute z-50 px-2 py-1 text-sm text-white bg-black/90 rounded whitespace-nowrap ${positionClasses[position]}`}
            role="tooltip"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};