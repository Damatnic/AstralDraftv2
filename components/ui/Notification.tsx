

import { ErrorBoundary } from &apos;./ErrorBoundary&apos;;
import { motion } from &apos;framer-motion&apos;;
import type { NotificationType } from &apos;../../types&apos;;
import { CheckIcon } from &apos;../icons/CheckIcon&apos;;
import { ArrowRightLeftIcon } from &apos;../icons/ArrowRightLeftIcon&apos;;
import { PlusCircleIcon } from &apos;../icons/PlusCircleIcon&apos;;
import { SparklesIcon } from &apos;../icons/SparklesIcon&apos;;

interface NotificationProps {
}
  message: string;
  type: NotificationType;

}

const Notification: React.FC<NotificationProps> = ({ message, type }: any) => {
}
  const getIcon = () => {
}
    switch (type) {
}
      case &apos;DRAFT&apos;: return <CheckIcon />;
      case &apos;TRADE&apos;: return <ArrowRightLeftIcon />;
      case &apos;WAIVER&apos;: return <PlusCircleIcon />;
      case &apos;SYSTEM&apos;:
      default:
        return <SparklesIcon className="h-6 w-6 text-cyan-300 sm:px-4 md:px-6 lg:px-8" />;


  return (
    <motion.div
      className="p-3 bg-gray-900/60 border border-cyan-300/30 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-4 min-w-[300px] sm:px-4 md:px-6 lg:px-8"
      {...{
}
        layout: true,
        initial: { opacity: 0, y: 50, scale: 0.3 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 20, scale: 0.5, transition: { duration: 0.4 } },
        transition: { type: "spring", stiffness: 200, damping: 20 },
      }}
    >
        <div className="text-2xl sm:px-4 md:px-6 lg:px-8">{getIcon()}</div>
          <div>
            <p className="font-bold text-white sm:px-4 md:px-6 lg:px-8">{message}</p>
        </div>
    </motion.div>
  );
};

const NotificationWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <Notification {...props} />
  </ErrorBoundary>
);

export default React.memo(NotificationWithErrorBoundary);