

import { ErrorBoundary } from &apos;./ErrorBoundary&apos;;
import { AnimatePresence } from &apos;framer-motion&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;
import Notification from &apos;./Notification&apos;;
import useSound from &apos;../../hooks/useSound&apos;;

const NotificationManager: React.FC = () => {
}
  const [isLoading, setIsLoading] = React.useState(false);
    const { state, dispatch } = useAppState();
    const playNotificationSound = useSound(&apos;notification&apos;, 0.4);

    const currentNotification = state.notifications.length > 0 ? state.notifications[0] : null;

    React.useEffect(() => {
}
        if (currentNotification) {
}
            playNotificationSound();
            const timer = setTimeout(() => {
}
                dispatch({ type: &apos;REMOVE_NOTIFICATION&apos;, payload: currentNotification.id });
            }, 4500); // Display for 4.5 seconds

            return () => clearTimeout(timer);

    }, [currentNotification, dispatch, playNotificationSound]);

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none sm:px-4 md:px-6 lg:px-8">
            <AnimatePresence>
                {currentNotification && (
}
                    <Notification key={currentNotification.id} message={currentNotification.message} type={currentNotification.type} />
                )}
            </AnimatePresence>
        </div>
    );
};

const NotificationManagerWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <NotificationManager {...props} />
  </ErrorBoundary>
);

export default React.memo(NotificationManagerWithErrorBoundary);