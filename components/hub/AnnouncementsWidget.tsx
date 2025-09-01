
import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;
import { useLeague } from &apos;../../hooks/useLeague&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { MegaphoneIcon } from &apos;../icons/MegaphoneIcon&apos;;
import { formatRelativeTime } from &apos;../../utils/time&apos;;

const AnnouncementsWidget: React.FC = () => {
}
    const { state } = useAppState();
    const { league } = useLeague();
    
    if (!league) return null;
    
    const announcement = (state.leagueAnnouncements[league.id] || [])[0];

    if (!announcement) {
}
        return (
            <Widget title="Announcements" icon={<MegaphoneIcon />}>
                <div className="p-4 text-center text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">
                    No recent announcements from the commissioner.
                </div>
            </Widget>
        );
    }

    return (
        <Widget title="Announcements" icon={<MegaphoneIcon />}>
             <div className="p-3 sm:px-4 md:px-6 lg:px-8">
                <p className="font-semibold text-sm sm:px-4 md:px-6 lg:px-8">{announcement.title}</p>
                <p className="text-xs text-gray-300 mt-1 whitespace-pre-wrap sm:px-4 md:px-6 lg:px-8">{announcement.content}</p>
                <p className="text-right text-xs text-gray-500 mt-2 sm:px-4 md:px-6 lg:px-8">{formatRelativeTime(announcement.timestamp)}</p>
             </div>
        </Widget>
    );
};

const AnnouncementsWidgetWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <AnnouncementsWidget {...props} />
  </ErrorBoundary>
);

export default React.memo(AnnouncementsWidgetWithErrorBoundary);
