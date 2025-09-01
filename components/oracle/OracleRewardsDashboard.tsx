import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import { motion } from &apos;framer-motion&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { ZapIcon } from &apos;../icons/ZapIcon&apos;;
import { oracleRewardsService, type UserRewards, type Achievement, type Badge } from &apos;../../services/oracleRewardsService&apos;;

interface ProgressBarProps {
}
    current: number;
    max: number;
    color?: string;
    showLabel?: boolean;

}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, 
}
    max, 
    color = &apos;bg-blue-500&apos;,
    showLabel = true 
 }: any) => {
}
  const [isLoading, setIsLoading] = React.useState(false);
    const percentage = Math.min((current / max) * 100, 100);
    
    return (
        <div className="w-full sm:px-4 md:px-6 lg:px-8">
            <div className="w-full bg-gray-700 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    className={`${color} h-2 rounded-full`}
                />
            </div>
            {showLabel && (
}
                <div className="flex justify-between text-xs text-gray-400 mt-1 sm:px-4 md:px-6 lg:px-8">
                    <span>{current}</span>
                    <span>{max}</span>
                </div>
            )}
        </div>
    );
};

interface AchievementCardProps {
}
    achievement: Achievement;
    isUnlocked: boolean;

}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, isUnlocked }: any) => {
}
    const getDifficultyColor = (difficulty: Achievement[&apos;difficulty&apos;]) => {
}
        switch (difficulty) {
}
            case &apos;BRONZE&apos;:
                return &apos;border-amber-600 bg-amber-600/10&apos;;
            case &apos;SILVER&apos;:
                return &apos;border-gray-400 bg-gray-400/10&apos;;
            case &apos;GOLD&apos;:
                return &apos;border-yellow-500 bg-yellow-500/10&apos;;
            case &apos;PLATINUM&apos;:
                return &apos;border-purple-500 bg-purple-500/10&apos;;
            case &apos;LEGENDARY&apos;:
                return &apos;border-red-500 bg-red-500/10&apos;;
            default:
                return &apos;border-gray-500 bg-gray-500/10&apos;;

    };

    const getCategoryIcon = (category: Achievement[&apos;category&apos;]) => {
}
        switch (category) {
}
            case &apos;PREDICTION&apos;:
                return &apos;🎯&apos;;
            case &apos;STREAK&apos;:
                return &apos;🔥&apos;;
            case &apos;ACCURACY&apos;:
                return &apos;📊&apos;;
            case &apos;PARTICIPATION&apos;:
                return &apos;🏃&apos;;
            case &apos;SEASONAL&apos;:
                return &apos;🏆&apos;;
            case &apos;MILESTONE&apos;:
                return &apos;💎&apos;;
            default:
                return &apos;⭐&apos;;

    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`border rounded-lg p-4 ${getDifficultyColor(achievement.difficulty)} ${
}
                isUnlocked ? &apos;&apos; : &apos;opacity-50 grayscale&apos;
            }`}
        >
            <div className="flex items-start justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                    <span className="text-2xl sm:px-4 md:px-6 lg:px-8">{achievement.icon}</span>
                    <span className="text-xs sm:px-4 md:px-6 lg:px-8">{getCategoryIcon(achievement.category)}</span>
                </div>
                <div className="text-right sm:px-4 md:px-6 lg:px-8">
                    <span className="text-xs text-gray-400 capitalize sm:px-4 md:px-6 lg:px-8">
                        {achievement.difficulty.toLowerCase()}
                    </span>
                    <div className="text-sm font-bold text-yellow-400 sm:px-4 md:px-6 lg:px-8">
                        +{achievement.points} pts
                    </div>
                </div>
            </div>
            <h4 className="font-semibold text-white text-sm mb-1 sm:px-4 md:px-6 lg:px-8">
                {achievement.title}
            </h4>
            <p className="text-xs text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">
                {achievement.description}
            </p>
            {isUnlocked ? (
}
                <div className="text-xs text-green-400 sm:px-4 md:px-6 lg:px-8">
                    ✅ Unlocked {achievement.unlockedAt ? 
}
                        new Date(achievement.unlockedAt).toLocaleDateString() : &apos;Recently&apos;

                </div>
            ) : (
                <div className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">
                    🔒 Locked
                </div>
            )}
        </motion.div>
    );
};

interface BadgeDisplayProps {
}
    badge: Badge;
    size?: &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos;;

}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ badge, size = &apos;md&apos; }: any) => {
}
    const getSizeClasses = () => {
}
        switch (size) {
}
            case &apos;sm&apos;:
                return &apos;w-8 h-8 text-xs&apos;;
            case &apos;lg&apos;:
                return &apos;w-16 h-16 text-2xl&apos;;
            default:
                return &apos;w-12 h-12 text-lg&apos;;

    };

    const getRarityGlow = (rarity: Badge[&apos;rarity&apos;]) => {
}
        switch (rarity) {
}
            case &apos;LEGENDARY&apos;:
                return &apos;shadow-lg shadow-yellow-500/50 animate-pulse&apos;;
            case &apos;EPIC&apos;:
                return &apos;shadow-lg shadow-purple-500/30&apos;;
            case &apos;RARE&apos;:
                return &apos;shadow-lg shadow-blue-500/20&apos;;
            default:
                return &apos;&apos;;

    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${badge.color} rounded-full flex items-center justify-center ${getSizeClasses()} ${getRarityGlow(badge.rarity)}`}
            title={`${badge.name}: ${badge.description}`}
        >
            <span>{badge.icon}</span>
        </motion.div>
    );
};

interface LevelDisplayProps {
}
    level: number;
    currentPoints: number;
    nextLevelPoints: number;

}

const LevelDisplay: React.FC<LevelDisplayProps> = ({ level, currentPoints, nextLevelPoints }: any) => {
}
    const pointsInCurrentLevel = currentPoints % 500;
    
    return (
        <div className="text-center sm:px-4 md:px-6 lg:px-8">
            <div className="relative sm:px-4 md:px-6 lg:px-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:px-4 md:px-6 lg:px-8">
                    <span className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">{level}</span>
                </div>
                <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-yellow-400 rounded-full mx-auto sm:px-4 md:px-6 lg:px-8"
                    style={{
}
                        borderTopColor: nextLevelPoints < 50 ? &apos;#fbbf24&apos; : &apos;transparent&apos;
                    }}
                />
            </div>
            <div className="text-lg font-bold text-white sm:px-4 md:px-6 lg:px-8">Level {level}</div>
            <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">
                {nextLevelPoints} points to level {level + 1}
            </div>
            <div className="mt-2 sm:px-4 md:px-6 lg:px-8">
                <ProgressBar>
                    current={pointsInCurrentLevel}
                    max={500}
                    color="bg-gradient-to-r from-blue-500 to-purple-500"
                    showLabel={false}
                />
            </div>
        </div>
    );
};

interface RewardNotificationProps {
}
    rewards: {
}
        points: number;
        newAchievements: Achievement[];
        newBadges: Badge[];
        levelUp?: boolean;
    };
    onClose: () => void;

const RewardNotification: React.FC<RewardNotificationProps> = ({ rewards, onClose }: any) => {
}
    React.useEffect(() => {
}
        const timer = setTimeout(onClose, 5000); // Auto-close after 5 seconds
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-gray-800 border border-gray-600 rounded-lg p-4 max-w-sm z-50 sm:px-4 md:px-6 lg:px-8"
        >
            <div className="flex items-center justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
                <h4 className="font-bold text-white sm:px-4 md:px-6 lg:px-8">Rewards Earned!</h4>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white sm:px-4 md:px-6 lg:px-8"
                 aria-label="Action button">
                    ✕
                </button>
            </div>
            
            <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                {rewards.points > 0 && (
}
                    <div className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                        <span className="text-yellow-400 sm:px-4 md:px-6 lg:px-8">💰</span>
                        <span className="text-sm text-white sm:px-4 md:px-6 lg:px-8">+{rewards.points} points</span>
                    </div>
                )}
                
                {rewards.levelUp && (
}
                    <div className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                        <span className="text-purple-400 sm:px-4 md:px-6 lg:px-8">⬆️</span>
                        <span className="text-sm text-white sm:px-4 md:px-6 lg:px-8">Level up!</span>
                    </div>
                )}
                
                {rewards.newAchievements.map((achievement: any) => (
}
                    <div key={achievement.id} className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                        <span className="text-2xl sm:px-4 md:px-6 lg:px-8">{achievement.icon}</span>
                        <span className="text-sm text-white sm:px-4 md:px-6 lg:px-8">{achievement.title}</span>
                    </div>
                ))}
                
                {rewards.newBadges.map((badge: any) => (
}
                    <div key={badge.id} className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                        <BadgeDisplay badge={badge} size="sm" />
                        <span className="text-sm text-white sm:px-4 md:px-6 lg:px-8">{badge.name}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export const OracleRewardsDashboard: React.FC = () => {
}
    const [userRewards, setUserRewards] = React.useState<UserRewards | null>(null);
    const [allAchievements, setAllAchievements] = React.useState<Achievement[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedCategory, setSelectedCategory] = React.useState<&apos;ALL&apos; | Achievement[&apos;category&apos;]>(&apos;ALL&apos;);

    React.useEffect(() => {
}
        const loadRewards = async () => {
}
            try {
}

                setLoading(true);
                const rewards = await oracleRewardsService.getUserRewards();
                const achievements = oracleRewardsService.getAvailableAchievements();
                
                setUserRewards(rewards);
                setAllAchievements(achievements);
  } finally {
}
                setLoading(false);

    `px-3 py-1 rounded-md text-sm font-medium transition-all ${
}
                                    selectedCategory === category
                                        ? &apos;bg-blue-500 text-white&apos;
                                        : &apos;bg-gray-700 text-gray-300 hover:bg-gray-600&apos;
                                }`}
                            >
                                {category === &apos;ALL&apos; ? &apos;All&apos; : category.charAt(0) + category.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAchievements.map((achievement: any) => {
}
                        const isUnlocked = unlockedAchievements.some((ua: any) => ua.id === achievement.id);
                        return (
                            <AchievementCard>
                                key={achievement.id}
                                achievement={achievement}
                                isUnlocked={isUnlocked}
                            />
                        );
                    })}
                </div>
            </Widget>
        </div>
    );
};

const OracleRewardsDashboardWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <OracleRewardsDashboard {...props} />
  </ErrorBoundary>
);

export default React.memo(OracleRewardsDashboardWithErrorBoundary);
