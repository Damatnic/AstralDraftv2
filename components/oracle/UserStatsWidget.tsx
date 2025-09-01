/**
 * User Statistics Widget
 * Displays user Oracle prediction performance stats
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo } from &apos;react&apos;;
import { motion } from &apos;framer-motion&apos;;
import { TrophyIcon, TargetIcon, ZapIcon, TrendingUpIcon } from &apos;lucide-react&apos;;
import { useMediaQuery } from &apos;../../hooks/useMediaQuery&apos;;

export interface UserStats {
}
    totalPredictions: number;
    correctPredictions: number;
    accuracy: number;
    streak: number;
    rank: number;

}

interface UserStatsWidgetProps {
}
    stats: UserStats;
    className?: string;
    compact?: boolean;

export const UserStatsWidget: React.FC<UserStatsWidgetProps> = ({ 
}
    stats, 
    className = &apos;&apos;,
    compact = false 
}: any) => {
}
    const isMobile = useMediaQuery(&apos;(max-width: 768px)&apos;);
    
    const statItems = [
        {
}
            label: &apos;Accuracy&apos;,
            value: `${stats.accuracy.toFixed(1)}%`,
            color: &apos;text-blue-400&apos;,
            bgColor: &apos;bg-blue-500/10&apos;,
            icon: TargetIcon
        },
        {
}
            label: &apos;Streak&apos;,
            value: stats.streak.toString(),
            color: &apos;text-green-400&apos;,
            bgColor: &apos;bg-green-500/10&apos;,
            icon: ZapIcon
        },
        {
}
            label: &apos;Total&apos;,
            value: stats.totalPredictions.toString(),
            color: &apos;text-purple-400&apos;,
            bgColor: &apos;bg-purple-500/10&apos;,
            icon: TrendingUpIcon
        },
        {
}
            label: &apos;Rank&apos;,
            value: `#${stats.rank}`,
            color: &apos;text-yellow-400&apos;,
            bgColor: &apos;bg-yellow-500/10&apos;,
            icon: TrophyIcon

    ];

    if (compact) {
}
        return (
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 ${className}`}>
                {statItems.map((item, index) => (
}
                    <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`${item.bgColor} rounded-lg p-3 sm:p-2 text-center min-h-[60px] sm:min-h-[50px] flex flex-col justify-center`}
                    >
                        <div className={`text-sm sm:text-xs font-bold ${item.color} mb-1 sm:mb-0`}>
                            {item.value}
                        </div>
                        <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">{item.label}</div>
                    </motion.div>
                ))}
            </div>
        );

    return (
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 ${className}`}>
            {statItems.map((item, index) => {
}
                const Icon = item.icon;
                return (
                    <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`${item.bgColor} rounded-lg p-4 sm:p-5 text-center min-h-[100px] sm:min-h-[120px] flex flex-col justify-center`}
                    >
                        <div className="flex items-center justify-center mb-2 sm:px-4 md:px-6 lg:px-8">
                            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${item.color}`} />
                        </div>
                        <div className={`text-xl sm:text-2xl font-bold ${item.color} mb-1`}>
                            {item.value}
                        </div>
                        <div className="text-sm sm:text-base text-gray-400">{item.label}</div>
                        
                        {/* Additional context for each stat */}
                        {item.label === &apos;Accuracy&apos; && stats.totalPredictions > 0 && (
}
                            <div className="text-xs sm:text-sm text-gray-500 mt-1">
                                {stats.correctPredictions}/{stats.totalPredictions}
                            </div>
                        )}
                        
                        {item.label === &apos;Streak&apos; && stats.streak > 0 && (
}
                            <div className="text-xs sm:text-sm text-gray-500 mt-1">
                                🔥 On fire!
                            </div>
                        )}
                        
                        {item.label === &apos;Rank&apos; && stats.rank <= 10 && (
}
                            <div className="text-xs text-yellow-400 mt-1 sm:px-4 md:px-6 lg:px-8">
                                Top 10!
                            </div>
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
};

const UserStatsWidgetWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <UserStatsWidget {...props} />
  </ErrorBoundary>
);

export default React.memo(UserStatsWidgetWithErrorBoundary);
