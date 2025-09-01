/**
 * Real-time Updates Widget
 * Displays live activity feed for Oracle predictions
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { 
}
    ZapIcon, 
    UsersIcon, 
    AlertTriangleIcon, 
    ClockIcon,
    BrainIcon,
//     ActivityIcon
} from &apos;lucide-react&apos;;
import { Widget } from &apos;../ui/Widget&apos;;

export interface RealtimeUpdate {
}
    id: string;
    type: &apos;PREDICTION_UPDATE&apos; | &apos;USER_JOINED&apos; | &apos;CONSENSUS_CHANGE&apos; | &apos;TIME_WARNING&apos;;
    message: string;
    timestamp: string;
    data?: any;

}

interface RealtimeUpdatesWidgetProps {
}
    updates: RealtimeUpdate[];
    className?: string;
    maxUpdates?: number;
    compact?: boolean;

export const RealtimeUpdatesWidget: React.FC<RealtimeUpdatesWidgetProps> = ({
}
    updates,
    className = &apos;&apos;,
    maxUpdates = 10,
    compact = false
}: any) => {
}
    const displayUpdates = updates.slice(0, maxUpdates);

    const getUpdateIcon = (type: RealtimeUpdate[&apos;type&apos;]) => {
}
        switch (type) {
}
            case &apos;PREDICTION_UPDATE&apos;:
                return BrainIcon;
            case &apos;USER_JOINED&apos;:
                return UsersIcon;
            case &apos;CONSENSUS_CHANGE&apos;:
                return ActivityIcon;
            case &apos;TIME_WARNING&apos;:
                return ClockIcon;
            default:
                return ZapIcon;

    };

    const getUpdateColor = (type: RealtimeUpdate[&apos;type&apos;]) => {
}
        switch (type) {
}
            case &apos;PREDICTION_UPDATE&apos;:
                return &apos;text-blue-400&apos;;
            case &apos;USER_JOINED&apos;:
                return &apos;text-green-400&apos;;
            case &apos;CONSENSUS_CHANGE&apos;:
                return &apos;text-purple-400&apos;;
            case &apos;TIME_WARNING&apos;:
                return &apos;text-yellow-400&apos;;
            default:
                return &apos;text-gray-400&apos;;

    };

    const formatTimestamp = (timestamp: string) => {
}
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);

        if (diffSeconds < 60) {
}
            return &apos;just now&apos;;
        } else if (diffMinutes < 60) {
}
            return `${diffMinutes}m ago`;
        } else {
}
            return date.toLocaleTimeString([], { hour: &apos;2-digit&apos;, minute: &apos;2-digit&apos; });

    };

    if (compact) {
}
        return (
            <div className={`space-y-2 max-h-48 overflow-y-auto ${className}`}>
                <AnimatePresence mode="popLayout">
                    {displayUpdates.length === 0 ? (
}
                        <div className="text-sm text-gray-500 italic text-center py-4 sm:px-4 md:px-6 lg:px-8">
                            No updates yet...
                        </div>
                    ) : (
                        displayUpdates.map((update: any) => {
}
                            const Icon = getUpdateIcon(update.type);
                            const iconColor = getUpdateColor(update.type);
                            
                            return (
                                <motion.div
                                    key={update.id}
                                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-start space-x-2 p-3 md:p-2 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
                                >
                                    <Icon className={`w-5 h-5 md:w-4 md:h-4 mt-0.5 flex-shrink-0 ${iconColor}`} />
                                    <div className="flex-1 min-w-0 sm:px-4 md:px-6 lg:px-8">
                                        <div className="text-sm md:text-xs text-gray-300 leading-tight">
                                            {update.message}
                                        </div>
                                        <div className="text-sm md:text-xs text-gray-500 mt-1">
                                            {formatTimestamp(update.timestamp)}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>
        );

    return (
        <Widget title="Live Updates" className={`bg-gray-900/50 ${className}`}>
            <div className="space-y-3 max-h-64 overflow-y-auto sm:px-4 md:px-6 lg:px-8">
                <AnimatePresence mode="popLayout">
                    {displayUpdates.length === 0 ? (
}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-8 sm:px-4 md:px-6 lg:px-8"
                        >
                            <ActivityIcon className="w-10 h-10 md:w-8 md:h-8 text-gray-600 mx-auto mb-2" />
                            <div className="text-base md:text-sm text-gray-500">
                                Waiting for activity...
                            </div>
                            <div className="text-sm md:text-xs text-gray-600 mt-1">
                                Live updates will appear here
                            </div>
                        </motion.div>
                    ) : (
                        displayUpdates.map((update, index) => {
}
                            const Icon = getUpdateIcon(update.type);
                            const iconColor = getUpdateColor(update.type);
                            
                            return (
                                <motion.div
                                    key={update.id}
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ 
}
                                        duration: 0.4,
                                        delay: index * 0.05,
                                        type: "spring",
                                        damping: 25,
                                        stiffness: 300
                                    }}
                                    className="flex items-start space-x-3 p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-all duration-200 border border-transparent hover:border-gray-700/50 sm:px-4 md:px-6 lg:px-8"
                                >
                                    <div className={`p-2 md:p-1.5 rounded-full bg-gray-900/50 ${iconColor}`}>
                                        <Icon className="w-4 h-4 md:w-3 md:h-3" />
                                    </div>
                                    <div className="flex-1 min-w-0 sm:px-4 md:px-6 lg:px-8">
                                        <div className="text-base md:text-sm text-gray-300 leading-relaxed">
                                            {update.message}
                                        </div>
                                        <div className="flex items-center justify-between mt-2 sm:px-4 md:px-6 lg:px-8">
                                            <div className="text-sm md:text-xs text-gray-500">
                                                {formatTimestamp(update.timestamp)}
                                            </div>
                                            {update.type === &apos;TIME_WARNING&apos; && (
}
                                                <div className="flex items-center space-x-1 text-sm md:text-xs text-yellow-400">
                                                    <AlertTriangleIcon className="w-4 h-4 md:w-3 md:h-3" />
                                                    <span>Urgent</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
                
                {displayUpdates.length >= maxUpdates && (
}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-2 border-t border-gray-800 sm:px-4 md:px-6 lg:px-8"
                    >
                        <div className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">
                            Showing {maxUpdates} most recent updates
                        </div>
                    </motion.div>
                )}
            </div>
        </Widget>
    );
};

const RealtimeUpdatesWidgetWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <RealtimeUpdatesWidget {...props} />
  </ErrorBoundary>
);

export default React.memo(RealtimeUpdatesWidgetWithErrorBoundary);
