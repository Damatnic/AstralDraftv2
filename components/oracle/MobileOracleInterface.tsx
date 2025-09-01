/**
 * Mobile Oracle Interface
 * Mobile-optimized Oracle prediction interface with touch interactions
 * Designed for mobile-first experience with responsive design
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { ZapIcon } from &apos;../icons/ZapIcon&apos;;
import { TrophyIcon } from &apos;../icons/TrophyIcon&apos;;
import { ChevronLeftIcon, ChevronRightIcon, ClockIcon } from &apos;lucide-react&apos;;
import { oracleMobileService, type MobileOracleChallenge, type MobileNotificationConfig } from &apos;../../services/oracleMobileService&apos;;
import { useMediaQuery } from &apos;../../hooks/useMediaQuery&apos;;

interface MobileOracleInterfaceProps {
}
    week: number;
    onSubmitPrediction: (challengeId: string, optionIndex: number) => void;
    onViewAnalytics: () => void;
    onViewRewards: () => void;

}

interface SwipeDirection {
}
    deltaX: number;
    deltaY: number;}

const MobileOracleInterface: React.FC<MobileOracleInterfaceProps> = ({ week,
}
    onSubmitPrediction,
    onViewAnalytics,
//     onViewRewards
 }: any) => {
}
  const [isLoading, setIsLoading] = React.useState(false);
    const [challenges, setChallenges] = React.useState<MobileOracleChallenge[]>([]);
    const [currentChallengeIndex, setCurrentChallengeIndex] = React.useState(0);
    const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [notificationConfig, setNotificationConfig] = React.useState<MobileNotificationConfig | null>(null);
    const [touchStart, setTouchStart] = React.useState<{ x: number; y: number } | null>(null);
    const [showInstallPrompt, setShowInstallPrompt] = React.useState(false);
    
    const isMobile = useMediaQuery(&apos;(max-width: 768px)&apos;);
    const isTouch = useMediaQuery(&apos;(pointer: coarse)&apos;);

    // Load challenges and setup mobile service
    React.useEffect(() => {
}
        const loadChallenges = async () => {
}
    try {
}

            const mobileChallenges = await oracleMobileService.getMobileChallenges(week);
            setChallenges(mobileChallenges);

    } catch (error) {
}
      console.error(&apos;Error in loadChallenges:&apos;, error);

  };

        loadChallenges();
        setNotificationConfig(oracleMobileService.getNotificationConfig());
        setShowInstallPrompt(oracleMobileService.isInstallable() && !oracleMobileService.isInstalled());

        // Setup custom event listeners for mobile navigation
        const handleOracleNavigate = (event: CustomEvent) => {
}
            if (event.detail.direction === &apos;next&apos;) {
}
                handleNextChallenge();
            } else if (event.detail.direction === &apos;previous&apos;) {
}
                handlePreviousChallenge();

        };

        const handleQuickSubmit = () => {
}
            if (selectedOption !== null) {
}
                handleSubmitPrediction();
    }
  };

        document.addEventListener(&apos;oracle-navigate&apos;, handleOracleNavigate as EventListener);
        document.addEventListener(&apos;oracle-quick-submit&apos;, handleQuickSubmit);

        return () => {
}
            document.removeEventListener(&apos;oracle-navigate&apos;, handleOracleNavigate as EventListener);
            document.removeEventListener(&apos;oracle-quick-submit&apos;, handleQuickSubmit);
        };
    }, [week, selectedOption]);

    const currentChallenge = challenges[currentChallengeIndex];

    const handleNextChallenge = () => {
}
        setCurrentChallengeIndex(prev => Math.min(prev + 1, challenges.length - 1));
        setSelectedOption(null);
    };

    const handlePreviousChallenge = () => {
}
        setCurrentChallengeIndex(prev => Math.max(prev - 1, 0));
        setSelectedOption(null);
    };

    const handleSubmitPrediction = async () => {
}
        if (!currentChallenge || selectedOption === null) return;

        setIsSubmitting(true);
        try {
}
            onSubmitPrediction(currentChallenge.id, selectedOption);
            
            // Show haptic feedback
            oracleMobileService.vibrate([50, 100, 50]);
            
            // Auto-advance to next challenge
            setTimeout(() => {
}
                if (currentChallengeIndex < challenges.length - 1) {
}
                    handleNextChallenge();

            }, 1000);
    } catch (error) {
}
        } finally {
}
            setIsSubmitting(false);

    };

    const handleTouchStart = (e: React.TouchEvent) => {
}
        setTouchStart({
}
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        });
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
}
        if (!touchStart) return;

        const deltaX = e.changedTouches[0].clientX - touchStart.x;
        const deltaY = e.changedTouches[0].clientY - touchStart.y;
        const minSwipeDistance = 50;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
}
            if (deltaX > 0) {
}
                handlePreviousChallenge();
            } else {
}
                handleNextChallenge();

            oracleMobileService.vibrate([25]); // Light haptic feedback

        setTouchStart(null);
    };

    const handleInstallPWA = async () => {
}
    try {
}

        const installed = await oracleMobileService.promptInstall();
        if (installed) {
}
            setShowInstallPrompt(false);
        
    } catch (error) {
}
      console.error(&apos;Error in handleInstallPWA:&apos;, error);

    } catch (error) {
}
        console.error(error);
    }};

    const handleEnableNotifications = async () => {
}
    try {
}

        const granted = await oracleMobileService.requestNotificationPermission();
        if (granted) {
}
            setNotificationConfig(oracleMobileService.getNotificationConfig());
        
    } catch (error) {
}
      console.error(&apos;Error in handleEnableNotifications:&apos;, error);

    } catch (error) {
}
        console.error(error);
    }};

    const formatTimeRemaining = (milliseconds: number): string => {
}
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 0) {
}
            return `${hours}h ${minutes}m`;

        return `${minutes}m`;
    };

    const getDifficultyColor = (difficulty: string): string => {
}
        switch (difficulty) {
}
            case &apos;easy&apos;: return &apos;text-green-400 bg-green-500/20&apos;;
            case &apos;medium&apos;: return &apos;text-yellow-400 bg-yellow-500/20&apos;;
            case &apos;hard&apos;: return &apos;text-red-400 bg-red-500/20&apos;;
            default: return &apos;text-gray-400 bg-gray-500/20&apos;;

    };

    if (!currentChallenge) {
}
        return (
            <Widget title="Oracle Challenges" icon={<ZapIcon />}>
                <div className="p-6 text-center sm:px-4 md:px-6 lg:px-8">
                    <div className="text-gray-400 mb-4 sm:px-4 md:px-6 lg:px-8">🔮</div>
                    <p className="text-gray-400 sm:px-4 md:px-6 lg:px-8">No challenges available for Week {week}</p>
                </div>
            </Widget>
        );

    return (
        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
            {/* Install PWA Prompt */}
            <AnimatePresence>
                {showInstallPrompt && (
}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-lg p-3 sm:px-4 md:px-6 lg:px-8"
                    >
                        <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                            <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                                <p className="text-sm font-semibold text-blue-300 sm:px-4 md:px-6 lg:px-8">Install Oracle App</p>
                                <p className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Get offline access and push notifications</p>
                            </div>
                            <div className="flex gap-2 sm:px-4 md:px-6 lg:px-8">
                                <button
                                    onClick={() => setShowInstallPrompt(false)}
                                >
//                                     Dismiss
                                </button>
                                <button
                                    onClick={handleInstallPWA}
                                 aria-label="Action button">
//                                     Install
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Notification Settings */}
            <AnimatePresence>
                {notificationConfig && !notificationConfig.enabled && (
}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-lg p-3 sm:px-4 md:px-6 lg:px-8"
                    >
                        <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                            <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                                <p className="text-sm font-semibold text-yellow-300 sm:px-4 md:px-6 lg:px-8">Enable Notifications</p>
                                <p className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Get alerts for new challenges and results</p>
                            </div>
                            <button
                                onClick={handleEnableNotifications}
                             aria-label="Action button">
//                                 Enable
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Challenge Interface */}
            <Widget title="Oracle Challenges" icon={<ZapIcon />} className="oracle-challenge-card sm:px-4 md:px-6 lg:px-8">
                <div
                    className="relative overflow-hidden sm:px-4 md:px-6 lg:px-8"
                    onTouchStart={isTouch ? handleTouchStart : undefined}
                >
                    {/* Challenge Header */}
                    <div className="p-4 border-b border-gray-700/50 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-3 sm:px-4 md:px-6 lg:px-8">
                            <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                <div className={`px-2 py-1 rounded-full text-xs font-bold ${getDifficultyColor(currentChallenge.difficulty)}`}>
                                    {currentChallenge.difficulty.toUpperCase()}
                                </div>
                                {currentChallenge.isUrgent && (
}
                                    <div className="px-2 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 animate-pulse sm:px-4 md:px-6 lg:px-8">
                                        ⚡ URGENT
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                <ClockIcon className="w-3 h-3 sm:px-4 md:px-6 lg:px-8" />
                                {formatTimeRemaining(currentChallenge.timeRemaining)}
                            </div>
                        </div>

                        <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                            <div className="flex items-center gap-2 text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                <TrophyIcon className="w-3 h-3 sm:px-4 md:px-6 lg:px-8" />
                                {currentChallenge.pointsAvailable} pts
                            </div>
                            <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                {currentChallengeIndex + 1} of {challenges.length}
                            </div>
                        </div>
                    </div>

                    {/* Challenge Question */}
                    <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                        <h3 className="text-lg font-bold text-white mb-4 leading-tight sm:px-4 md:px-6 lg:px-8">
                            {currentChallenge.question}
                        </h3>

                        {/* Options */}
                        <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                            {currentChallenge.options.map((option, index) => (
}
                                <motion.button
                                    key={`option-${currentChallenge.id}-${index}`}
                                    onClick={() => setSelectedOption(index)}`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                                        <span className="font-medium sm:px-4 md:px-6 lg:px-8">{option}</span>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
}
                                            selectedOption === index
                                                ? &apos;border-cyan-400 bg-cyan-400&apos;
                                                : &apos;border-gray-500&apos;
                                        }`}>
                                            {selectedOption === index && (
}
                                                <div className="w-2 h-2 bg-white rounded-full sm:px-4 md:px-6 lg:px-8" />
                                            )}
                                        </div>
                                    </div>
                                </motion.button>
                            ))}
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            onClick={handleSubmitPrediction}
                            className={`w-full mt-6 py-4 rounded-lg font-bold text-lg transition-all duration-200 ${
}
                                selectedOption !== null && !isSubmitting
                                    ? &apos;bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-400 hover:to-purple-500 shadow-lg&apos;
                                    : &apos;bg-gray-700/50 text-gray-500 cursor-not-allowed&apos;
                            }`}
                            whileHover={selectedOption !== null ? { scale: 1.02 } : {}}
                            whileTap={selectedOption !== null ? { scale: 0.98 } : {}}
                        >
                            {(() => {
}
                                if (isSubmitting) {
}
                                    return (
                                        <div className="flex items-center justify-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin sm:px-4 md:px-6 lg:px-8" />
                                            Submitting...
                                        </div>
                                    );

                                if (selectedOption !== null) {
}
                                    return &apos;Submit Prediction&apos;;

                                return &apos;Select an Option&apos;;
                            })()}
                        </motion.button>

                        {/* Swipe Hint */}
                        {isTouch && challenges.length > 1 && (
}
                            <p className="text-center text-xs text-gray-500 mt-3 sm:px-4 md:px-6 lg:px-8">
                                ← Swipe to navigate between challenges →
                            </p>
                        )}
                    </div>

                    {/* Navigation Buttons for Non-Touch Devices */}
                    {!isTouch && challenges.length > 1 && (
}
                        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none sm:px-4 md:px-6 lg:px-8">
                            <button
                                onClick={handlePreviousChallenge}
                                className="ml-2 p-2 bg-black/50 backdrop-blur-sm rounded-full pointer-events-auto disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/70 sm:px-4 md:px-6 lg:px-8"
                             aria-label="Action button">
                                <ChevronLeftIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
                            </button>
                            <button
                                onClick={handleNextChallenge}
                                className="mr-2 p-2 bg-black/50 backdrop-blur-sm rounded-full pointer-events-auto disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/70 sm:px-4 md:px-6 lg:px-8"
                             aria-label="Action button">
                                <ChevronRightIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
                            </button>
                        </div>
                    )}
                </div>
            </Widget>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 sm:px-4 md:px-6 lg:px-8">
                <button
                    onClick={onViewAnalytics}
                 aria-label="Action button">
                    <div className="text-2xl font-bold text-blue-300 sm:px-4 md:px-6 lg:px-8">78%</div>
                    <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Accuracy</div>
                </button>
                <button
                    onClick={onViewRewards}
                 aria-label="Action button">
                    <div className="text-2xl font-bold text-purple-300 sm:px-4 md:px-6 lg:px-8">1,250</div>
                    <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Points</div>
                </button>
            </div>

            {/* Mobile-Optimized Tips */}
            {isMobile && (
}
                <div className="bg-gray-800/30 border border-gray-600/30 rounded-lg p-3 sm:px-4 md:px-6 lg:px-8">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">💡 Mobile Tips</h4>
                    <ul className="text-xs text-gray-400 space-y-1 sm:px-4 md:px-6 lg:px-8">
                        <li>• Swipe left/right to navigate challenges</li>
                        <li>• Long press options for quick submission</li>
                        <li>• Install the app for offline access</li>
                        <li>• Enable notifications for alerts</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

const MobileOracleInterfaceWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <MobileOracleInterface {...props} />
  </ErrorBoundary>
);

export default React.memo(MobileOracleInterfaceWithErrorBoundary);
