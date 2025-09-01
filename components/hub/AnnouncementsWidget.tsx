
import { ErrorBoundary } from '../ui/ErrorBoundary';
import React from 'react';
import { useAppState } from '../../contexts/AppContext';
import { useLeague } from '../../hooks/useLeague';
import { Widget } from '../ui/Widget';
import { MegaphoneIcon } from '../icons/MegaphoneIcon';
import { formatRelativeTime } from '../../utils/time';

const AnnouncementsWidget: React.FC = () => {
    const { state } = useAppState();
    const { league } = useLeague();
    
    if (!league) return null;
    
    const announcement = (state.leagueAnnouncements[league.id] || [])[0];

    if (!announcement) {
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
