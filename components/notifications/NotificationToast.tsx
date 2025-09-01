/**
 * Enhanced Notification Toast
 * Modern toast notification component with actions, animations, and real-time updates
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo, useEffect, useState } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { CheckIcon, XIcon, EyeIcon } from &apos;lucide-react&apos;;
import { useNotifications } from &apos;../../contexts/NotificationContext&apos;;

interface NotificationToastProps {
}
    notification: any;
    onDismiss: () => void;
    onMarkAsRead?: () => void;
    autoHideDuration?: number;

}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification,
}
    onDismiss,
    onMarkAsRead,
    autoHideDuration = 5000
 }: any) => {
}
  const [isLoading, setIsLoading] = React.useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
}
        const timer = setTimeout(() => {
}
            setIsVisible(false);
            setTimeout(onDismiss, 300); // Wait for exit animation
    }
  }, autoHideDuration);

        // Progress bar animation
        const progressTimer = setInterval(() => {
}
            setProgress(prev => {
}
                const newProgress = prev - (100 / (autoHideDuration / 100));
                return newProgress <= 0 ? 0 : newProgress;
            });
        }, 100);

        return () => {
}
            clearTimeout(timer);
            clearInterval(progressTimer);
        };
    }, [autoHideDuration, onDismiss]);

    const getNotificationIcon = (type: string) => {
}
        switch (type) {
}
            case &apos;DRAFT_PICK&apos;: return &apos;🏈&apos;;
            case &apos;DRAFT_START&apos;: return &apos;🚀&apos;;
            case &apos;ORACLE_PREDICTION&apos;: return &apos;🔮&apos;;
            case &apos;ORACLE_RESULT&apos;: return &apos;🎯&apos;;
            case &apos;TRADE&apos;: return &apos;🔄&apos;;
            case &apos;LEAGUE_UPDATE&apos;: return &apos;📢&apos;;
            case &apos;ACHIEVEMENT&apos;: return &apos;🏆&apos;;
            default: return &apos;📱&apos;;

    };

    const getPriorityColor = (priority: string) => {
}
        switch (priority) {
}
            case &apos;urgent&apos;: return &apos;border-red-500 bg-red-500/90&apos;;
            case &apos;high&apos;: return &apos;border-orange-500 bg-orange-500/90&apos;;
            case &apos;medium&apos;: return &apos;border-blue-500 bg-blue-500/90&apos;;
            default: return &apos;border-gray-500 bg-gray-500/90&apos;;

    };

    const handleAction = (actionFn?: () => void) => {
}
        if (actionFn) actionFn();
        setIsVisible(false);
        setTimeout(onDismiss, 300);
    };

    return (
        <AnimatePresence>
            {isVisible && (
}
                <motion.div
                    initial={{ opacity: 0, x: 300, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 300, scale: 0.8 }}
                    className={`relative w-80 rounded-lg border-l-4 ${getPriorityColor(notification.priority)} 
                        bg-gray-900/95 backdrop-blur-sm shadow-xl overflow-hidden`}
                >
                    {/* Progress bar */}
                    <div className="absolute top-0 left-0 h-1 bg-white/20 transition-all duration-100 ease-linear sm:px-4 md:px-6 lg:px-8"
                         style={{ width: `${progress}%` }} />
                    
                    <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-start space-x-3 sm:px-4 md:px-6 lg:px-8">
                            <div className="text-2xl flex-shrink-0 sm:px-4 md:px-6 lg:px-8">
                                {getNotificationIcon(notification.type)}
                            </div>
                            
                            <div className="flex-1 min-w-0 sm:px-4 md:px-6 lg:px-8">
                                <h4 className="text-sm font-semibold text-white mb-1 sm:px-4 md:px-6 lg:px-8">
                                    {notification.title}
                                </h4>
                                <p className="text-sm text-gray-300 line-clamp-2 sm:px-4 md:px-6 lg:px-8">
                                    {notification.message}
                                </p>
                                
                                {notification.actionUrl && (
}
                                    <a
                                        href={notification.actionUrl}
                                        onClick={() => handleAction()}
                                        className="inline-block mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors sm:px-4 md:px-6 lg:px-8"
                                    >
                                        {notification.actionText || &apos;View Details&apos;} →
                                    </a>
                                )}
                            </div>
                            
                            <div className="flex items-center space-x-1 flex-shrink-0 sm:px-4 md:px-6 lg:px-8">
                                {!notification.isRead && onMarkAsRead && (
}
                                    <button
                                        onClick={() => handleAction(onMarkAsRead)}
                                        title="Mark as read"
                                    >
                                        <CheckIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                    </button>
                                )}
                                
                                {notification.actionUrl && (
}
                                    <button
                                        onClick={() => window.open(notification.actionUrl, &apos;_blank&apos;)}
                                        title="View details"
                                    >
                                        <EyeIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                    </button>
                                )}
                                
                                <button
                                    onClick={() => handleAction()}
                                    title="Dismiss"
                                >
                                    <XIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Toast Container Component
interface NotificationToastContainerProps {
}
    maxToasts?: number;
    position?: &apos;top-right&apos; | &apos;top-left&apos; | &apos;bottom-right&apos; | &apos;bottom-left&apos;;

}

export const NotificationToastContainer: React.FC<NotificationToastContainerProps> = ({
}
    maxToasts = 3,
    position = &apos;top-right&apos;
}: any) => {
}
    const { notifications, markAsRead } = useNotifications();
    const [displayedToasts, setDisplayedToasts] = useState<string[]>([]);

    // Show newest unread notifications as toasts
    useEffect(() => {
}
        const unreadNotifications = notifications
            .filter((n: any) => !n.isRead && !displayedToasts.includes(n.id))
            .slice(0, maxToasts);

        if (unreadNotifications.length > 0) {
}
            const newToastIds = unreadNotifications.map((n: any) => n.id);
            setDisplayedToasts(prev => [...prev, ...newToastIds].slice(-maxToasts));
    }
  }, [notifications, displayedToasts, maxToasts]);

    const handleDismissToast = (notificationId: string) => {
}
        setDisplayedToasts(prev => prev.filter((id: any) => id !== notificationId));
    };

    const handleMarkAsRead = (notificationId: string) => {
}
        markAsRead(notificationId);
        handleDismissToast(notificationId);
    };

    const getPositionClasses = () => {
}
        switch (position) {
}
            case &apos;top-left&apos;: return &apos;top-4 left-4&apos;;
            case &apos;bottom-left&apos;: return &apos;bottom-4 left-4&apos;;
            case &apos;bottom-right&apos;: return &apos;bottom-4 right-4&apos;;
            default: return &apos;top-4 right-4&apos;;

    };

    const toastsToShow = notifications.filter((n: any) => displayedToasts.includes(n.id));

    return (
        <div className={`fixed ${getPositionClasses()} z-50 space-y-3 pointer-events-none`}>
            <AnimatePresence>
                {toastsToShow.map((notification: any) => (
}
                    <div key={notification.id} className="pointer-events-auto sm:px-4 md:px-6 lg:px-8">
                        <NotificationToast>
                            notification={notification}
                            onDismiss={() => handleDismissToast(notification.id)}
                            onMarkAsRead={() => handleMarkAsRead(notification.id)}
                        />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
};

const NotificationToastWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <NotificationToast {...props} />
  </ErrorBoundary>
);

export default React.memo(NotificationToastWithErrorBoundary);
