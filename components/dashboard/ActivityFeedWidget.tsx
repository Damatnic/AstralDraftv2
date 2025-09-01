
import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo } from &apos;react&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import type { ActivityItem } from &apos;../../types&apos;;
import { ArrowRightLeftIcon } from &apos;../icons/ArrowRightLeftIcon&apos;;
import { PlusCircleIcon } from &apos;../icons/PlusCircleIcon&apos;;
import { formatRelativeTime } from &apos;../../utils/time&apos;;
import { ActivityIcon } from &apos;lucide-react&apos;;

const activityIcons: { [key in ActivityItem[&apos;type&apos;]]: React.ReactNode } = {
}
    TRADE: <ArrowRightLeftIcon className="h-4 w-4 text-purple-400 sm:px-4 md:px-6 lg:px-8" />,
    WAIVER: <PlusCircleIcon className="h-4 w-4 text-green-400 sm:px-4 md:px-6 lg:px-8" />,
    DRAFT: <div />, // Draft handled elsewhere
};

const ActivityFeedWidget: React.FC = () => {
}
    const { state } = useAppState();

    const feed = state.activityFeed;

    return (
        <Widget title="League Activity">
            <div className="p-3 space-y-3 sm:px-4 md:px-6 lg:px-8">
                {feed.length === 0 ? (
}
                    <p className="text-center text-xs text-gray-400 py-4 sm:px-4 md:px-6 lg:px-8">No recent activity.</p>
                ) : (
                    feed.map((item: any) => (
                        <div key={item.id} className="flex items-start gap-3 sm:px-4 md:px-6 lg:px-8">
                            <div className="mt-1 sm:px-4 md:px-6 lg:px-8">{activityIcons[item.type as keyof typeof activityIcons] || <ActivityIcon className="h-4 w-4 text-gray-400 sm:px-4 md:px-6 lg:px-8" />}</div>
                            <div>
                                <p className="text-xs text-gray-300 sm:px-4 md:px-6 lg:px-8">{item.content}</p>
                                <p className="text-[10px] text-gray-500 sm:px-4 md:px-6 lg:px-8">{formatRelativeTime(item.timestamp)}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Widget>
    );
};

const ActivityFeedWidgetWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <ActivityFeedWidget {...props} />
  </ErrorBoundary>
);

export default React.memo(ActivityFeedWidgetWithErrorBoundary);
