/**
 * Mobile Offline Indicator
 * Shows offline status and sync progress for mobile users
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { mobileOfflineService } from &apos;../../services/mobileOfflineService&apos;;
import { useMediaQuery } from &apos;../../hooks/useMediaQuery&apos;;
import {
}
    announceToScreenReader,
    useReducedMotion,
} from &apos;../../utils/mobileAccessibilityUtils&apos;;

import {
}
//     VisuallyHidden
} from &apos;../../utils/mobileAccessibilityComponents&apos;;
import {
}
    WifiOffIcon,
    WifiIcon,
    RefreshCwIcon,
    CheckCircleIcon,
//     ClockIcon
} from &apos;lucide-react&apos;;

interface OfflineIndicatorProps {
}
    className?: string;
    position?: &apos;top&apos; | &apos;bottom&apos;;
    showDetails?: boolean;

}

const MobileOfflineIndicator: React.FC<OfflineIndicatorProps> = ({ className = &apos;&apos;,
}
    position = &apos;top&apos;,
    showDetails = false
 }: any) => {
}
  const [isLoading, setIsLoading] = React.useState(false);
    const isMobile = useMediaQuery(&apos;(max-width: 768px)&apos;);
    const [offlineState, setOfflineState] = React.useState(mobileOfflineService.getState());
    const [showBanner, setShowBanner] = React.useState(false);
    const [lastOnlineTime, setLastOnlineTime] = React.useState<Date | null>(null);
    const prefersReducedMotion = useReducedMotion();

    // Announce status changes to screen readers
    React.useEffect(() => {
}
        const unsubscribe = mobileOfflineService.subscribe((state: any) => {
}
            const previousOfflineStatus = offlineState.isOffline;
            setOfflineState(state);
            
            // Announce status changes
            if (state.isOffline !== previousOfflineStatus) {
}
                const message = state.isOffline 
                    ? &apos;Connection lost. You are now offline. Draft data will be saved locally and synced when reconnected.&apos;
                    : &apos;Connection restored. You are now online. Syncing pending changes.&apos;;
                announceToScreenReader(message, &apos;assertive&apos;);

            // Show banner when going offline or coming back online
            if (state.isOffline !== previousOfflineStatus) {
}
                setShowBanner(true);
                
                if (!state.isOffline) {
}
                    setLastOnlineTime(new Date());
                    // Hide banner after successful reconnection
                    setTimeout(() => setShowBanner(false), 3000);
                } else {
}
                    // Keep banner visible while offline
                    setShowBanner(true);


        });

        return unsubscribe;
    }, [offlineState.isOffline]);

    React.useEffect(() => {
}
        // Auto-hide banner after 5 seconds when going offline
        if (offlineState.isOffline && showBanner) {
}
            const timer = setTimeout(() => setShowBanner(false), 5000);
            return () => clearTimeout(timer);
    }
  }, [offlineState.isOffline, showBanner]);

    const getStatusIcon = () => {
}
        if (offlineState.syncInProgress) {
}
            return <RefreshCwIcon className={`w-4 h-4 ${!prefersReducedMotion ? &apos;animate-spin&apos; : &apos;&apos;}`} />;

        if (offlineState.isOffline) {
}
            return <WifiOffIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />;

        if (offlineState.pendingActions.length > 0) {
}
            return <ClockIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />;

        return <WifiIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />;
    };

    const getStatusText = () => {
}
        if (offlineState.syncInProgress) {
}
            return &apos;Syncing...&apos;;

        if (offlineState.isOffline) {
}
            return &apos;Offline Mode&apos;;

        if (offlineState.pendingActions.length > 0) {
}
            return `${offlineState.pendingActions.length} pending`;

        return &apos;Online&apos;;
    };

    const getStatusColor = () => {
}
        if (offlineState.syncInProgress) {
}
            return &apos;text-blue-400 bg-blue-500/20&apos;;

        if (offlineState.isOffline) {
}
            return &apos;text-red-400 bg-red-500/20&apos;;

        if (offlineState.pendingActions.length > 0) {
}
            return &apos;text-yellow-400 bg-yellow-500/20&apos;;

        return &apos;text-green-400 bg-green-500/20&apos;;
    };

    const getStatusDescription = () => {
}
        if (offlineState.isOffline) {
}
            return offlineState.hasOfflineData 
                ? &apos;You can continue drafting. Changes will sync when reconnected.&apos;
                : &apos;Limited functionality available. Try to reconnect.&apos;;

        if (offlineState.pendingActions.length > 0) {
}
            return `Syncing ${offlineState.pendingActions.length} pending changes...`;

        return &apos;All changes have been synced successfully.&apos;;
    };

    const getBannerTitle = () => {
}
        return offlineState.isOffline ? &apos;You\&apos;re offline&apos; : &apos;Back online!&apos;;
    };

    const formatLastSync = () => {
}
        if (!offlineState.lastSync) return &apos;Never&apos;;
        
        const now = new Date();
        const diff = now.getTime() - offlineState.lastSync.getTime();
        const minutes = Math.floor(diff / 60000);
        
        if (minutes < 1) return &apos;Just now&apos;;
        if (minutes < 60) return `${minutes}m ago`;
        
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    const handleBannerClick = () => {
}
        if (!offlineState.isOffline && offlineState.pendingActions.length > 0) {
}
            mobileOfflineService.syncPendingActions();
            announceToScreenReader(&apos;Manually syncing pending changes&apos;, &apos;polite&apos;);
    }
  };

    const handleSyncNow = (e: React.MouseEvent) => {
}
        e.stopPropagation();
        mobileOfflineService.syncPendingActions();
        announceToScreenReader(&apos;Manual sync initiated&apos;, &apos;polite&apos;);
    };

    // Don&apos;t show on desktop unless specifically requested
    if (!isMobile && !showDetails) {
}
        return null;

    const animationProps = prefersReducedMotion 
        ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
        : { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 } };

    const bannerAnimationProps = prefersReducedMotion
        ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
        : { 
}
            initial: { y: position === &apos;top&apos; ? -100 : 100, opacity: 0 },
            animate: { y: 0, opacity: 1 },
            exit: { y: position === &apos;top&apos; ? -100 : 100, opacity: 0 }
        };

    return (
        <>
            {/* Persistent Status Indicator */}
            <output
                className={`fixed ${position === &apos;top&apos; ? &apos;top-4&apos; : &apos;bottom-4&apos;} right-4 z-50 ${className}`}
                aria-label={`Connection status: ${getStatusText()}`}
            >
                <motion.div
                    {...animationProps}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full border border-[var(--panel-border)] ${getStatusColor()}`}
                >
                    {getStatusIcon()}
                    <VisuallyHidden>
                        Connection status: {getStatusText()}
                        {offlineState.pendingActions.length > 0 && 
}
                            `, ${offlineState.pendingActions.length} actions pending sync`

                    </VisuallyHidden>
                    {showDetails && (
}
                        <span className="text-xs font-medium sm:px-4 md:px-6 lg:px-8">
                            {getStatusText()}
                        </span>
                    )}
                </motion.div>
            </output>

            {/* Status Change Banner */}
            <AnimatePresence>
                {showBanner && (
}
                    <motion.div
                        {...bannerAnimationProps}
                        className={`fixed ${position === &apos;top&apos; ? &apos;top-0&apos; : &apos;bottom-0&apos;} left-0 right-0 z-40`}
                    >
                        <button
                            onClick={handleBannerClick}
                            onKeyDown={(e: any) => {
}
                                if (e.key === &apos;Enter&apos; || e.key === &apos; &apos;) {
}
                                    e.preventDefault();
                                    handleBannerClick();

                            }}
                            disabled={!(!offlineState.isOffline && offlineState.pendingActions.length > 0)}
                            className={`mx-4 my-2 p-4 rounded-lg border border-[var(--panel-border)] bg-[var(--panel-bg)] w-full text-left mobile-focus-ring ${
}
                                (!offlineState.isOffline && offlineState.pendingActions.length > 0) 
                                    ? &apos;cursor-pointer hover:bg-[var(--panel-bg-hover)] transition-colors&apos; 
                                    : &apos;cursor-default&apos;
                            }`}
                            aria-label={`Connection status: ${getBannerTitle()}. ${getStatusDescription()}. ${
}
                                (!offlineState.isOffline && offlineState.pendingActions.length > 0) 
                                    ? &apos;Press to sync pending changes.&apos; 
                                    : &apos;&apos;
                            }`}
                        >
                            <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                                <div className={`p-2 rounded-full ${getStatusColor()}`}>
                                    {getStatusIcon()}
                                </div>
                                
                                <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                                    <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                                        <h3 className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                            {getBannerTitle()}
                                        </h3>
                                        
                                        {!offlineState.isOffline && lastOnlineTime && (
}
                                            <CheckCircleIcon className="w-5 h-5 text-green-400 sm:px-4 md:px-6 lg:px-8" aria-hidden="true" />
                                        )}
                                    </div>
                                    
                                    <p className="text-sm text-[var(--text-secondary)] mt-1 sm:px-4 md:px-6 lg:px-8">
                                        {getStatusDescription()}
                                    </p>
                                    
                                    {showDetails && (
}
                                        <div className="grid grid-cols-2 gap-4 mt-3 text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                            <div>
                                                <span className="block font-medium sm:px-4 md:px-6 lg:px-8">Last Sync</span>
                                                <span>{formatLastSync()}</span>
                                            </div>
                                            
                                            <div>
                                                <span className="block font-medium sm:px-4 md:px-6 lg:px-8">Pending Actions</span>
                                                <span>{offlineState.pendingActions.length}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                {(offlineState.pendingActions.length > 0 && !offlineState.isOffline) && (
}
                                    <button
                                        onClick={handleSyncNow}
                                        onKeyDown={(e: any) => {
}
                                            if (e.key === &apos;Enter&apos; || e.key === &apos; &apos;) {
}
                                                e.preventDefault();
                                                handleSyncNow(e as any);

                                        }}
                                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600 transition-colors mobile-focus-ring sm:px-4 md:px-6 lg:px-8"
                                        aria-label="Manually sync pending changes now"
                                    >
                                        Sync Now
                                    </button>
                                )}
                            </div>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Detailed Status Panel for Settings/Debug */}
            {showDetails && (
}
                <div className="bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg p-4 mt-4 sm:px-4 md:px-6 lg:px-8">
                    <h4 className="font-medium text-[var(--text-primary)] mb-3 sm:px-4 md:px-6 lg:px-8">Offline Status Details</h4>
                    
                    <div className="space-y-3 text-sm sm:px-4 md:px-6 lg:px-8">
                        <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                            <span className="text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Connection Status:</span>
                            <span className={offlineState.isOffline ? &apos;text-red-400&apos; : &apos;text-green-400&apos;}>
                                {offlineState.isOffline ? &apos;Offline&apos; : &apos;Online&apos;}
                            </span>
                        </div>
                        
                        <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                            <span className="text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Offline Data Available:</span>
                            <span className={offlineState.hasOfflineData ? &apos;text-green-400&apos; : &apos;text-red-400&apos;}>
                                {offlineState.hasOfflineData ? &apos;Yes&apos; : &apos;No&apos;}
                            </span>
                        </div>
                        
                        <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                            <span className="text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Pending Actions:</span>
                            <span className={offlineState.pendingActions.length > 0 ? &apos;text-yellow-400&apos; : &apos;text-green-400&apos;}>
                                {offlineState.pendingActions.length}
                            </span>
                        </div>
                        
                        <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                            <span className="text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Last Sync:</span>
                            <span className="text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                {formatLastSync()}
                            </span>
                        </div>
                        
                        <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                            <span className="text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Sync in Progress:</span>
                            <span className={offlineState.syncInProgress ? &apos;text-blue-400&apos; : &apos;text-green-400&apos;}>
                                {offlineState.syncInProgress ? &apos;Yes&apos; : &apos;No&apos;}
                            </span>
                        </div>
                    </div>
                    
                    {offlineState.pendingActions.length > 0 && (
}
                        <div className="mt-4 pt-3 border-t border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                            <h5 className="font-medium text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">Pending Actions:</h5>
                            <div className="space-y-1 text-xs sm:px-4 md:px-6 lg:px-8">
                                {offlineState.pendingActions.map((action, index) => (
}
                                    <div key={action.id} className="flex justify-between text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                        <span>{action.type}</span>
                                        <span>Retry {
}
action.retryCount
    } catch (error) {
}
        console.error(error);
    }/{action.maxRetries}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

const MobileOfflineIndicatorWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <MobileOfflineIndicator {...props} />
  </ErrorBoundary>
);

export default React.memo(MobileOfflineIndicatorWithErrorBoundary);
