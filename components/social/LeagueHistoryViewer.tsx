/**
 * League History Viewer Component
 * Interactive timeline of league events, milestones, and memories
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { Player, Team, User, League } from &apos;../../types&apos;;
import { 
}
    CalendarIcon, 
    TrophyIcon, 
    UsersIcon, 
    ArrowRightIcon,
    StarIcon,
    FlameIcon,
    HeartIcon,
    ThumbsUpIcon,
    MessageCircleIcon,
    ShareIcon,
    FilterIcon,
    SearchIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    PlayIcon,
    ImageIcon,
    BarChartIcon,
    CrownIcon,
    ZapIcon,
//     TrendingUpIcon
} from &apos;lucide-react&apos;;

export interface LeagueEvent {
}
    id: string;
    type: EventType;
    title: string;
    description: string;
    date: Date;
    season: number;
    week?: number;
    participants: EventParticipant[];
    data: EventData;
    media?: EventMedia[];
    stats?: EventStats;
    reactions: EventReaction[];
    comments: EventComment[];
    tags: string[];
    isHighlight: boolean;
    visibility: &apos;public&apos; | &apos;league_only&apos; | &apos;private&apos;;

export type EventType = 
    | &apos;championship&apos; 
    | &apos;trade&apos; 
    | &apos;draft_pick&apos; 
    | &apos;waiver_claim&apos; 
    | &apos;record_broken&apos; 
    | &apos;milestone&apos; 
    | &apos;rivalry_moment&apos; 
    | &apos;comeback&apos; 
    | &apos;upset&apos; 
    | &apos;perfect_week&apos; 
    | &apos;league_creation&apos; 
    | &apos;member_joined&apos; 
    | &apos;season_start&apos;
    | &apos;season_end&apos;
    | &apos;playoffs_start&apos;
    | &apos;trade_deadline&apos;
    | &apos;punishment&apos;
    | &apos;achievement&apos;;

}

export interface EventParticipant {
}
    teamId: number;
    teamName: string;
    userId: string;
    userName: string;
    avatar?: string;
    role: &apos;primary&apos; | &apos;secondary&apos; | &apos;mentioned&apos;;

}

export interface EventData {
}
    [key: string]: any;
    // Flexible structure to accommodate different event types

}

export interface EventMedia {
}
    id: string;
    type: &apos;image&apos; | &apos;video&apos; | &apos;audio&apos; | &apos;gif&apos;;
    url: string;
    caption?: string;
    thumbnail?: string;

}

export interface EventStats {
}
    fantasyPoints?: number;
    winPercentage?: number;
    tradeValue?: number;
    recordValue?: number;
    significance?: number; // 1-10 scale

}

export interface EventReaction {
}
    id: string;
    userId: string;
    userName: string;
    emoji: string;
    timestamp: Date;

}

export interface EventComment {
}
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    content: string;
    timestamp: Date;
    likes: number;
    replies?: EventComment[];

}

export interface LeagueMilestone {
}
    id: string;
    title: string;
    description: string;
    achievedDate: Date;
    achievedBy?: EventParticipant;
    category: &apos;scoring&apos; | &apos;winning&apos; | &apos;trading&apos; | &apos;participation&apos; | &apos;special&apos;;
    rarity: &apos;common&apos; | &apos;rare&apos; | &apos;epic&apos; | &apos;legendary&apos;;
    icon: string;
    value?: number;
    isFirstTime: boolean;

}

export interface TimelineFilter {
}
    seasons: number[];
    eventTypes: EventType[];
    participants: string[];
    tags: string[];
    highlightsOnly: boolean;
    dateRange?: {
}
        start: Date;
        end: Date;
    };

interface LeagueHistoryViewerProps {
}
    league: League;
    events: LeagueEvent[];
    milestones: LeagueMilestone[];
    onEventReaction: (eventId: string, emoji: string) => void;
    onEventComment: (eventId: string, content: string) => void;
    onShareEvent: (eventId: string) => void;
    className?: string;

}

const LeagueHistoryViewer: React.FC<LeagueHistoryViewerProps> = ({
}
    league,
    events,
    milestones,
    onEventReaction,
    onEventComment,
    onShareEvent,
    className = &apos;&apos;
}: any) => {
}
    const [selectedView, setSelectedView] = React.useState<&apos;timeline&apos; | &apos;milestones&apos; | &apos;stats&apos;>(&apos;timeline&apos;);
    const [timelineFilter, setTimelineFilter] = React.useState<TimelineFilter>({
}
        seasons: [],
        eventTypes: [],
        participants: [],
        tags: [],
        highlightsOnly: false
    });
    const [searchQuery, setSearchQuery] = React.useState(&apos;&apos;);
    const [expandedEvent, setExpandedEvent] = React.useState<string | null>(null);
    const [selectedSeason, setSelectedSeason] = React.useState<number | null>(null);
    const [showFilters, setShowFilters] = React.useState(false);

    // Get unique seasons from events
    const availableSeasons = React.useMemo(() => {
}
        const seasons = [...new Set(events.map((event: any) => event.season))];
        return seasons.sort((a, b) => b - a); // Most recent first
    }, [events]);

    // Filter events based on current filters and search
    const filteredEvents = React.useMemo(() => {
}
        let filtered = events;

        // Search filter
        if (searchQuery) {
}
            filtered = filtered.filter((event: any) =>
                event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.participants.some((p: any) => p.teamName.toLowerCase().includes(searchQuery.toLowerCase()))
            );

        // Season filter
        if (selectedSeason) {
}
            filtered = filtered.filter((event: any) => event.season === selectedSeason);

        // Timeline filters
        if (timelineFilter.eventTypes.length > 0) {
}
            filtered = filtered.filter((event: any) => timelineFilter.eventTypes.includes(event.type));

        if (timelineFilter.participants.length > 0) {
}
            filtered = filtered.filter((event: any) =>
                event.participants.some((p: any) => timelineFilter.participants.includes(p.userId))
            );

        if (timelineFilter.highlightsOnly) {
}
            filtered = filtered.filter((event: any) => event.isHighlight);

        return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
    }, [events, searchQuery, selectedSeason, timelineFilter]);

    // Group events by season and month
    const groupedEvents = React.useMemo(() => {
}
        const groups: Record<string, Record<string, LeagueEvent[]>> = {};

        filteredEvents.forEach((event: any) => {
}
            const seasonKey = `Season ${event.season}`;
            const monthKey = event.date.toLocaleDateString(&apos;en-US&apos;, { year: &apos;numeric&apos;, month: &apos;long&apos; });

            if (!groups[seasonKey]) groups[seasonKey] = {};
            if (!groups[seasonKey][monthKey]) groups[seasonKey][monthKey] = [];

            groups[seasonKey][monthKey].push(event);
        });

        return groups;
    }, [filteredEvents]);

    const getEventTypeIcon = (type: EventType) => {
}
        switch (type) {
}
            case &apos;championship&apos;:
                return <TrophyIcon className="w-5 h-5 text-yellow-400 sm:px-4 md:px-6 lg:px-8" />;
            case &apos;trade&apos;:
                return <ArrowRightIcon className="w-5 h-5 text-blue-400 sm:px-4 md:px-6 lg:px-8" />;
            case &apos;record_broken&apos;:
                return <StarIcon className="w-5 h-5 text-purple-400 sm:px-4 md:px-6 lg:px-8" />;
            case &apos;milestone&apos;:
                return <CrownIcon className="w-5 h-5 text-orange-400 sm:px-4 md:px-6 lg:px-8" />;
            case &apos;comeback&apos;:
                return <TrendingUpIcon className="w-5 h-5 text-green-400 sm:px-4 md:px-6 lg:px-8" />;
            case &apos;upset&apos;:
                return <ZapIcon className="w-5 h-5 text-red-400 sm:px-4 md:px-6 lg:px-8" />;
            case &apos;perfect_week&apos;:
                return <FlameIcon className="w-5 h-5 text-orange-500 sm:px-4 md:px-6 lg:px-8" />;
            case &apos;rivalry_moment&apos;:
                return <FlameIcon className="w-5 h-5 text-red-500 sm:px-4 md:px-6 lg:px-8" />;
            default:
                return <CalendarIcon className="w-5 h-5 text-gray-400 sm:px-4 md:px-6 lg:px-8" />;

    };

    const getEventTypeColor = (type: EventType) => {
}
        switch (type) {
}
            case &apos;championship&apos;:
                return &apos;text-yellow-400 bg-yellow-500/20&apos;;
            case &apos;trade&apos;:
                return &apos;text-blue-400 bg-blue-500/20&apos;;
            case &apos;record_broken&apos;:
                return &apos;text-purple-400 bg-purple-500/20&apos;;
            case &apos;milestone&apos;:
                return &apos;text-orange-400 bg-orange-500/20&apos;;
            case &apos;comeback&apos;:
                return &apos;text-green-400 bg-green-500/20&apos;;
            case &apos;upset&apos;:
                return &apos;text-red-400 bg-red-500/20&apos;;
            case &apos;perfect_week&apos;:
                return &apos;text-orange-500 bg-orange-500/20&apos;;
            case &apos;rivalry_moment&apos;:
                return &apos;text-red-500 bg-red-500/20&apos;;
            default:
                return &apos;text-gray-400 bg-gray-500/20&apos;;

    };

    const formatEventDate = (date: Date) => {
}
        return date.toLocaleDateString(&apos;en-US&apos;, {
}
            month: &apos;short&apos;,
            day: &apos;numeric&apos;,
            year: &apos;numeric&apos;
        });
    };

    const renderEventCard = (event: LeagueEvent) => {
}
        const isExpanded = expandedEvent === event.id;

        return (
            <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg p-4 hover:border-blue-400/50 transition-all cursor-pointer ${
}
                    event.isHighlight ? &apos;ring-2 ring-yellow-400/30&apos; : &apos;&apos;
                }`}
                onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
            >
                {/* Event Header */}
                <div className="flex items-start justify-between sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-start gap-3 flex-1 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex-shrink-0 mt-1 sm:px-4 md:px-6 lg:px-8">
                            {getEventTypeIcon(event.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0 sm:px-4 md:px-6 lg:px-8">
                            <div className="flex items-center gap-2 mb-1 sm:px-4 md:px-6 lg:px-8">
                                <h3 className="font-medium text-[var(--text-primary)] truncate sm:px-4 md:px-6 lg:px-8">
                                    {event.title}
                                </h3>
                                {event.isHighlight && (
}
                                    <StarIcon className="w-4 h-4 text-yellow-400 flex-shrink-0 sm:px-4 md:px-6 lg:px-8" />
                                )}
                            </div>
                            
                            <p className="text-sm text-[var(--text-secondary)] mb-2 line-clamp-2 sm:px-4 md:px-6 lg:px-8">
                                {event.description}
                            </p>
                            
                            <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                <span>{formatEventDate(event.date)}</span>
                                {event.week && <span>Week {event.week}</span>}
                                <span className={`px-2 py-1 rounded ${getEventTypeColor(event.type)}`}>
                                    {event.type.replace(&apos;_&apos;, &apos; &apos;)}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                        {isExpanded ? <ChevronDownIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" /> : <ChevronRightIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />}
                    </button>
                </div>

                {/* Event Participants */}
                {event.participants.length > 0 && (
}
                    <div className="flex items-center gap-2 mt-3 sm:px-4 md:px-6 lg:px-8">
                        <UsersIcon className="w-4 h-4 text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8" />
                        <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                            {event.participants.slice(0, 3).map((participant: any) => (
}
                                <div key={`${participant.teamId}-${participant.userId}`} className="flex items-center gap-1 sm:px-4 md:px-6 lg:px-8">
                                    {participant.avatar && (
}
                                        <img
                                            src={participant.avatar}
                                            alt={participant.teamName}
                                            className="w-5 h-5 rounded-full sm:px-4 md:px-6 lg:px-8"
                                        />
                                    )}
                                    <span className="text-sm text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                        {participant.teamName}
                                    </span>
                                </div>
                            ))}
                            {event.participants.length > 3 && (
}
                                <span className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                    +{event.participants.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Expanded Content */}
                <AnimatePresence>
                    {isExpanded && (
}
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: &apos;auto&apos; }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8"
                        >
                            {/* Event Media */}
                            {event.media && event.media.length > 0 && (
}
                                <div className="grid grid-cols-2 gap-2 mb-4 sm:px-4 md:px-6 lg:px-8">
                                    {event.media.slice(0, 4).map((media: any) => (
}
                                        <div key={media.id} className="relative sm:px-4 md:px-6 lg:px-8">
                                            {media.type === &apos;image&apos; && (
}
                                                <img
                                                    src={media.url}
                                                    alt={media.caption}
                                                    className="w-full h-24 object-cover rounded sm:px-4 md:px-6 lg:px-8"
                                                />
                                            )}
                                            {media.type === &apos;video&apos; && (
}
                                                <div className="w-full h-24 bg-gray-500/20 rounded flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
                                                    <PlayIcon className="w-6 h-6 text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8" />
                                                </div>
                                            )}
                                            {media.caption && (
}
                                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b sm:px-4 md:px-6 lg:px-8">
                                                    {media.caption}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Event Stats */}
                            {event.stats && (
}
                                <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-500/10 rounded sm:px-4 md:px-6 lg:px-8">
                                    {event.stats.fantasyPoints && (
}
                                        <div>
                                            <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Fantasy Points</div>
                                            <div className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                                {event.stats.fantasyPoints.toFixed(1)}
                                            </div>
                                        </div>
                                    )}
                                    {event.stats.significance && (
}
                                        <div>
                                            <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Significance</div>
                                            <div className="flex items-center gap-1 sm:px-4 md:px-6 lg:px-8">
                                                {Array.from({ length: event.stats.significance }, (_, i) => (
                                                    <StarIcon key={i} className="w-3 h-3 text-yellow-400 fill-current sm:px-4 md:px-6 lg:px-8" />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Event Tags */}
                            {event.tags.length > 0 && (
}
                                <div className="flex flex-wrap gap-1 mb-4 sm:px-4 md:px-6 lg:px-8">
                                    {event.tags.map((tag: any) => (
}
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs sm:px-4 md:px-6 lg:px-8"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Reactions and Comments */}
                            <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                                <div className="flex items-center gap-4 sm:px-4 md:px-6 lg:px-8">
                                    {/* Quick Reactions */}
                                    <div className="flex items-center gap-1 sm:px-4 md:px-6 lg:px-8">
                                        {[&apos;🔥&apos;, &apos;😂&apos;, &apos;😮&apos;, &apos;👏&apos;].map((emoji: any) => {
}
                                            const count = event.reactions.filter((r: any) => r.emoji === emoji).length;
                                            return (
                                                <button
                                                    key={emoji}
                                                    onClick={(e: any) = aria-label="Action button"> {
}
                                                        e.stopPropagation();
                                                        onEventReaction(event.id, emoji);
                                                    }}
                                                    className="flex items-center gap-1 px-2 py-1 hover:bg-white/10 rounded text-sm sm:px-4 md:px-6 lg:px-8"
                                                >
                                                    <span>{emoji}</span>
                                                    {count > 0 && <span className="text-xs sm:px-4 md:px-6 lg:px-8">{count}</span>}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Comment count */}
                                    <button
                                        onClick={(e: any) = aria-label="Action button"> e.stopPropagation()}
                                        className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8"
                                    >
                                        <MessageCircleIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                        {event.comments.length}
                                    </button>
                                </div>

                                <button
                                    onClick={(e: any) = aria-label="Action button"> {
}
                                        e.stopPropagation();
                                        onShareEvent(event.id);
                                    }}
                                    className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8"
                                >
                                    <ShareIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
//                                     Share
                                </button>
                            </div>

                            {/* Comments Section */}
                            {event.comments.length > 0 && (
}
                                <div className="mt-4 pt-4 border-t border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                                    <div className="space-y-3 max-h-40 overflow-y-auto sm:px-4 md:px-6 lg:px-8">
                                        {event.comments.slice(0, 3).map((comment: any) => (
}
                                            <div key={comment.id} className="flex gap-2 sm:px-4 md:px-6 lg:px-8">
                                                <img
                                                    src={comment.userAvatar || &apos;/default-avatar.png&apos;}
                                                    alt={comment.userName}
                                                    className="w-6 h-6 rounded-full flex-shrink-0 sm:px-4 md:px-6 lg:px-8"
                                                />
                                                <div className="flex-1 min-w-0 sm:px-4 md:px-6 lg:px-8">
                                                    <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                                        <span className="text-sm font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                                            {comment.userName}
                                                        </span>
                                                        <span className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                                            {formatEventDate(comment.timestamp)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-[var(--text-secondary)] mt-1 sm:px-4 md:px-6 lg:px-8">
                                                        {comment.content}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {event.comments.length > 3 && (
}
                                        <button className="text-sm text-blue-400 hover:text-blue-300 mt-2 sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                                            View all {event.comments.length} comments
                                        </button>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        );
    };

    const renderMilestones = () => (
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            {[&apos;legendary&apos;, &apos;epic&apos;, &apos;rare&apos;, &apos;common&apos;].map((rarity: any) => {
}
                const rarityMilestones = milestones.filter((m: any) => m.rarity === rarity);
                if (rarityMilestones.length === 0) return null;

                return (
                    <div key={rarity}>
                        <h3 className={`text-lg font-medium mb-4 capitalize ${
}
                            rarity === &apos;legendary&apos; ? &apos;text-yellow-400&apos; :
                            rarity === &apos;epic&apos; ? &apos;text-purple-400&apos; :
                            rarity === &apos;rare&apos; ? &apos;text-blue-400&apos; :
                            &apos;text-gray-400&apos;
                        }`}>
                            {rarity} Milestones
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {rarityMilestones.map((milestone: any) => (
}
                                <motion.div
                                    key={milestone.id}
                                    whileHover={{ scale: 1.02 }}
                                    className={`p-4 rounded-lg border ${
}
                                        milestone.rarity === &apos;legendary&apos; ? &apos;border-yellow-400/50 bg-yellow-500/10&apos; :
                                        milestone.rarity === &apos;epic&apos; ? &apos;border-purple-400/50 bg-purple-500/10&apos; :
                                        milestone.rarity === &apos;rare&apos; ? &apos;border-blue-400/50 bg-blue-500/10&apos; :
                                        &apos;border-[var(--panel-border)] bg-[var(--panel-bg)]&apos;
                                    }`}
                                >
                                    <div className="flex items-start gap-3 sm:px-4 md:px-6 lg:px-8">
                                        <div className="text-2xl sm:px-4 md:px-6 lg:px-8">{milestone.icon}</div>
                                        <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                                            <h4 className="font-medium text-[var(--text-primary)] mb-1 sm:px-4 md:px-6 lg:px-8">
                                                {milestone.title}
                                            </h4>
                                            <p className="text-sm text-[var(--text-secondary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                                                {milestone.description}
                                            </p>
                                            <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                                                <span className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                                    {formatEventDate(milestone.achievedDate)}
                                                </span>
                                                {milestone.achievedBy && (
}
                                                    <span className="text-xs text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                                        {milestone.achievedBy.teamName}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );

    const renderStats = () => (
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-center gap-2 mb-2 sm:px-4 md:px-6 lg:px-8">
                        <CalendarIcon className="w-5 h-5 text-blue-400 sm:px-4 md:px-6 lg:px-8" />
                        <span className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">Total Events</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-400 sm:px-4 md:px-6 lg:px-8">{events.length}</div>
                </div>
                
                <div className="p-4 bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-center gap-2 mb-2 sm:px-4 md:px-6 lg:px-8">
                        <StarIcon className="w-5 h-5 text-yellow-400 sm:px-4 md:px-6 lg:px-8" />
                        <span className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">Highlights</span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-400 sm:px-4 md:px-6 lg:px-8">
                        {events.filter((e: any) => e.isHighlight).length}
                    </div>
                </div>
                
                <div className="p-4 bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-center gap-2 mb-2 sm:px-4 md:px-6 lg:px-8">
                        <TrophyIcon className="w-5 h-5 text-green-400 sm:px-4 md:px-6 lg:px-8" />
                        <span className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">Milestones</span>
                    </div>
                    <div className="text-2xl font-bold text-green-400 sm:px-4 md:px-6 lg:px-8">{milestones.length}</div>
                </div>
            </div>

            <div className="p-4 bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg sm:px-4 md:px-6 lg:px-8">
                <h3 className="font-medium text-[var(--text-primary)] mb-4 sm:px-4 md:px-6 lg:px-8">Event Distribution</h3>
                <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                    {Object.entries(
}
                        events.reduce((acc, event) => {
}
                            acc[event.type] = (acc[event.type] || 0) + 1;
                            return acc;
                        }, {} as Record<string, number>)
                    )
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 5)
                        .map(([type, count]) => (
                            <div key={type} className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                                <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                    {getEventTypeIcon(type as EventType)}
                                    <span className="capitalize text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                        {type.replace(&apos;_&apos;, &apos; &apos;)}
                                    </span>
                                </div>
                                <span className="text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">{count}</span>
                            </div>
                        ))

                </div>
            </div>
        </div>
    );

    return (
        <div className={`h-full flex flex-col bg-[var(--panel-bg)] ${className}`}>
            {/* Header */}
            <div className="flex-shrink-0 p-4 border-b border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-4 sm:px-4 md:px-6 lg:px-8">
                    <h2 className="text-xl font-bold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">League History</h2>
                    <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <FilterIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
//                             Filters
                        </button>
                    </div>
                </div>

                {/* Search and Season Filter */}
                <div className="flex gap-3 mb-4 sm:px-4 md:px-6 lg:px-8">
                    <div className="flex-1 relative sm:px-4 md:px-6 lg:px-8">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e: any) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8"
                        />
                    </div>
                    <select
                        value={selectedSeason || &apos;&apos;}
                        onChange={(e: any) => setSelectedSeason(e.target.value ? parseInt(e.target.value) : null)}
                    >
                        <option value="">All Seasons</option>
                        {availableSeasons.map((season: any) => (
}
                            <option key={season} value={season}>Season {season}</option>
                        ))}
                    </select>
                </div>

                {/* View Tabs */}
                <div className="flex sm:px-4 md:px-6 lg:px-8">
                    {[
}
                        { id: &apos;timeline&apos;, label: &apos;Timeline&apos;, icon: <CalendarIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" /> },
                        { id: &apos;milestones&apos;, label: &apos;Milestones&apos;, icon: <CrownIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" /> },
                        { id: &apos;stats&apos;, label: &apos;Stats&apos;, icon: <BarChartIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" /> }
                    ].map((tab: any) => (
                        <button
                            key={tab.id}
                            onClick={() => setSelectedView(tab.id as any)}`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:px-4 md:px-6 lg:px-8">
                {selectedView === &apos;timeline&apos; && (
}
                    <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
                        {Object.keys(groupedEvents).length === 0 ? (
}
                            <div className="text-center py-12 text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                <CalendarIcon className="w-16 h-16 mx-auto mb-4 opacity-50 sm:px-4 md:px-6 lg:px-8" />
                                <p className="text-lg font-medium mb-2 sm:px-4 md:px-6 lg:px-8">No events found</p>
                                <p>Try adjusting your search or filters</p>
                            </div>
                        ) : (
                            Object.entries(groupedEvents).map(([season, months]) => (
                                <div key={season}>
                                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 sticky top-0 bg-[var(--panel-bg)] py-2 sm:px-4 md:px-6 lg:px-8">
                                        {season}
                                    </h3>
                                    {Object.entries(months).map(([month, monthEvents]) => (
}
                                        <div key={month} className="mb-6 sm:px-4 md:px-6 lg:px-8">
                                            <h4 className="text-md font-medium text-[var(--text-secondary)] mb-3 sm:px-4 md:px-6 lg:px-8">
                                                {month}
                                            </h4>
                                            <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                                                {monthEvents.map((event: any) => renderEventCard(event))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))
                        )}
                    </div>
                )}

                {selectedView === &apos;milestones&apos; && renderMilestones()}
                {selectedView === &apos;stats&apos; && renderStats()}
            </div>
        </div>
    );
};

const LeagueHistoryViewerWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <LeagueHistoryViewer {...props} />
  </ErrorBoundary>
);

export default React.memo(LeagueHistoryViewerWithErrorBoundary);
