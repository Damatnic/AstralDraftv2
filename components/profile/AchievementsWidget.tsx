import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo } from &apos;react&apos;;
import type { Badge } from &apos;../../types&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { TrophyIcon } from &apos;../icons/TrophyIcon&apos;;
import { MedalIcon } from &apos;../icons/MedalIcon&apos;;
import { FlameIcon } from &apos;../icons/FlameIcon&apos;;

const badgeIcons: Record<Badge[&apos;type&apos;], React.ReactNode> = {
}
    CHAMPION: <TrophyIcon />,
    TOP_SCORER: <MedalIcon />,
    WIN_STREAK_3: <FlameIcon />,
};

const badgeColors: Record<Badge[&apos;type&apos;], string> = {
}
    CHAMPION: &apos;border-yellow-400/50 bg-yellow-500/10 text-yellow-300&apos;,
    TOP_SCORER: &apos;border-purple-400/50 bg-purple-500/10 text-purple-300&apos;,
    WIN_STREAK_3: &apos;border-orange-400/50 bg-orange-500/10 text-orange-300&apos;,
};

const AchievementsWidget: React.FC<{ badges: Badge[] }> = ({ badges }: any) => {
}
    if (!badges || badges.length === 0) {
}
        return null; // Don&apos;t show the widget if there are no badges
    }

    return (
        <Widget title="Achievements" icon={<TrophyIcon />}>
            <div className="p-4 space-y-2 sm:px-4 md:px-6 lg:px-8">
                {badges.map((badge: Badge) => (
}
                    <div key={badge.id} className={`flex items-center gap-3 p-2 rounded-lg border-l-4 ${badgeColors[badge.type] || &apos;border-gray-400/50 bg-gray-500/10 text-gray-300&apos;}`}>
                        <div className="text-xl sm:px-4 md:px-6 lg:px-8">{badgeIcons[badge.type] || <MedalIcon />}</div>
                        <div>
                             <p className="font-semibold text-sm text-white sm:px-4 md:px-6 lg:px-8">{badge.text}</p>
                             <p className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">{badge.season}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Widget>
    );
};

const AchievementsWidgetWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <AchievementsWidget {...props} />
  </ErrorBoundary>
);

export default React.memo(AchievementsWidgetWithErrorBoundary);