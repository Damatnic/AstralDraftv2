/**
 * Community Hub Integration Component
 * Central integration point for all social features
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback } from &apos;react&apos;;
import { motion } from &apos;framer-motion&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import LeagueHistoryViewer from &apos;./LeagueHistoryViewer&apos;;
import SocialFeed from &apos;./SocialFeed&apos;;
import { Player, Team, User, League } from &apos;../../types&apos;;
import { 
}
    MessageSquareIcon, 
    BookOpenIcon, 
    HistoryIcon, 
    RssIcon,
    UsersIcon,
    HeartIcon,
    SparklesIcon,
    TrendingUpIcon,
//     CalendarIcon
} from &apos;lucide-react&apos;;

export interface CommunityHubProps {
}
    league: League;
    currentUser: User;
    teams: Team[];
    users: User[];
    players: Player[];
    onTradeProposal: (trade: any) => void;
    onStoryPublish: (story: any) => void;
    onSocialInteraction: (type: string, data: any) => void;
    className?: string;

type SocialFeatureTab = &apos;feed&apos; | &apos;trade_chat&apos; | &apos;stories&apos; | &apos;history&apos; | &apos;community&apos;;

}

interface SocialActivity {
}
    id: string;
    type: &apos;trade_completed&apos; | &apos;story_published&apos; | &apos;milestone_achieved&apos; | &apos;comment_posted&apos; | &apos;reaction_added&apos;;
    userId: string;
    userName: string;
    teamName?: string;
    description: string;
    timestamp: Date;
    relatedId?: string;

interface CommunityStats {
}
    totalMembers: number;
    activeToday: number;
    storiesThisWeek: number;
    tradesThisMonth: number;
    interactionsToday: number;
    engagementScore: number;

}

const CommunityHubIntegration: React.FC<CommunityHubProps> = ({
}
    league,
    currentUser,
    teams,
    users,
    players,
    onTradeProposal,
    onStoryPublish,
    onSocialInteraction,
    className = &apos;&apos;
}: any) => {
}
    const [activeTab, setActiveTab] = React.useState<SocialFeatureTab>(&apos;feed&apos;);
    const [recentActivity, setRecentActivity] = React.useState<SocialActivity[]>([]);
    const [communityStats] = React.useState<CommunityStats>({
}
        totalMembers: users.length,
        activeToday: Math.floor(users.length * 0.6),
        storiesThisWeek: 12,
        tradesThisMonth: 8,
        interactionsToday: 45,
        engagementScore: 87
    });

    // Mock data for demonstration
    const mockFeedItems = React.useMemo(() => [
        {
}
            id: &apos;1&apos;,
            type: &apos;trade_announcement&apos; as const,
            userId: users[0]?.id || &apos;user1&apos;,
            userName: users[0]?.name || &apos;Manager 1&apos;,
            userAvatar: users[0]?.avatar,
            teamId: teams[0]?.id,
            teamName: teams[0]?.name || &apos;Team 1&apos;,
            content: {
}
                text: &apos;Just completed a huge trade! Really excited about the depth this adds to my roster. What do you all think about the value?&apos;,
                data: {
}
                    tradeId: &apos;trade_123&apos;,
                    playersGiven: [&apos;Player A&apos;, &apos;Player B&apos;],
                    playersReceived: [&apos;Player C&apos;]

            },
            timestamp: new Date(Date.now() - 3600000),
            reactions: [
                { id: &apos;r1&apos;, userId: &apos;user2&apos;, userName: &apos;User 2&apos;, emoji: &apos;🔥&apos;, timestamp: new Date() }
            ],
            comments: [
                {
}
                    id: &apos;c1&apos;,
                    userId: &apos;user3&apos;,
                    userName: &apos;User 3&apos;,
                    content: &apos;Great move! That player fits your team perfectly.&apos;,
                    timestamp: new Date(Date.now() - 1800000),
                    reactions: [],
                    isEdited: false,
                    isPinned: false

            ],
            shares: 2,
            views: 28,
            isPinned: false,
            isHighlighted: true,
            visibility: &apos;league_only&apos; as const,
            tags: [&apos;trade&apos;, &apos;depth&apos;, &apos;strategy&apos;],
            mentions: []
        },
        {
}
            id: &apos;2&apos;,
            type: &apos;team_story&apos; as const,
            userId: users[1]?.id || &apos;user2&apos;,
            userName: users[1]?.name || &apos;Manager 2&apos;,
            userAvatar: users[1]?.avatar,
            teamId: teams[1]?.id,
            teamName: teams[1]?.name || &apos;Team 2&apos;,
            content: {
}
                text: &apos;Check out my season recap! It\&apos;s been quite the journey from last place to playoff contention. Here\&apos;s how we turned it around...&apos;,
                media: [
                    { id: &apos;m1&apos;, type: &apos;image&apos; as const, url: &apos;/story-image.jpg&apos;, caption: &apos;Key moment from Week 8&apos; }

            },
            timestamp: new Date(Date.now() - 7200000),
            reactions: [
                { id: &apos;r2&apos;, userId: &apos;user1&apos;, userName: &apos;User 1&apos;, emoji: &apos;👏&apos;, timestamp: new Date() },
                { id: &apos;r3&apos;, userId: &apos;user3&apos;, userName: &apos;User 3&apos;, emoji: &apos;❤️&apos;, timestamp: new Date() }
            ],
            comments: [],
            shares: 1,
            views: 15,
            isPinned: false,
            isHighlighted: false,
            visibility: &apos;league_only&apos; as const,
            tags: [&apos;story&apos;, &apos;comeback&apos;, &apos;playoffs&apos;],
            mentions: []

    ], [users, teams]);

    const mockLeagueEvents = React.useMemo(() => [
        {
}
            id: &apos;event1&apos;,
            type: &apos;championship&apos; as const,
            title: &apos;Season 2023 Championship&apos;,
            description: &apos;Epic championship battle between the top two teams. Came down to Monday Night Football!&apos;,
            date: new Date(&apos;2023-12-18&apos;),
            season: 2023,
            week: 16,
            participants: [
                {
}
                    teamId: teams[0]?.id || 1,
                    teamName: teams[0]?.name || &apos;Team 1&apos;,
                    userId: users[0]?.id || &apos;user1&apos;,
                    userName: users[0]?.name || &apos;Manager 1&apos;,
                    role: &apos;primary&apos; as const
                },
                {
}
                    teamId: teams[1]?.id || 2,
                    teamName: teams[1]?.name || &apos;Team 2&apos;,
                    userId: users[1]?.id || &apos;user2&apos;,
                    userName: users[1]?.name || &apos;Manager 2&apos;,
                    role: &apos;secondary&apos; as const

            ],
            data: {
}
                finalScore: { team1: 145.6, team2: 142.3 },
                margin: 3.3,
                clinchingPlayer: &apos;Travis Kelce&apos;
            },
            stats: {
}
                fantasyPoints: 145.6,
                significance: 10
            },
            reactions: [
                { id: &apos;r1&apos;, userId: &apos;user3&apos;, userName: &apos;User 3&apos;, emoji: &apos;🔥&apos;, timestamp: new Date() }
            ],
            comments: [
                {
}
                    id: &apos;c1&apos;,
                    userId: &apos;user4&apos;,
                    userName: &apos;User 4&apos;,
                    content: &apos;What an incredible finish! One of the best championship games we\&apos;ve ever had.&apos;,
                    timestamp: new Date(),
                    likes: 5

            ],
            tags: [&apos;championship&apos;, &apos;thriller&apos;, &apos;2023&apos;],
            isHighlight: true,
            visibility: &apos;league_only&apos; as const

    ], [teams, users]);

    const mockMilestones = React.useMemo(() => [
        {
}
            id: &apos;milestone1&apos;,
            title: &apos;Perfect Week Achievement&apos;,
            description: &apos;Started the optimal lineup and scored the highest weekly total in league history&apos;,
            achievedDate: new Date(&apos;2023-10-15&apos;),
            achievedBy: {
}
                teamId: teams[0]?.id || 1,
                teamName: teams[0]?.name || &apos;Team 1&apos;,
                userId: users[0]?.id || &apos;user1&apos;,
                userName: users[0]?.name || &apos;Manager 1&apos;,
                role: &apos;primary&apos; as const
            },
            category: &apos;scoring&apos; as const,
            rarity: &apos;legendary&apos; as const,
            icon: &apos;🏆&apos;,
            value: 187.4,
            isFirstTime: true
        },
        {
}
            id: &apos;milestone2&apos;,
            title: &apos;Trade Master&apos;,
            description: &apos;Completed 10 successful trades in a single season&apos;,
            achievedDate: new Date(&apos;2023-11-01&apos;),
            achievedBy: {
}
                teamId: teams[1]?.id || 2,
                teamName: teams[1]?.name || &apos;Team 2&apos;,
                userId: users[1]?.id || &apos;user2&apos;,
                userName: users[1]?.name || &apos;Manager 2&apos;,
                role: &apos;primary&apos; as const
            },
            category: &apos;trading&apos; as const,
            rarity: &apos;epic&apos; as const,
            icon: &apos;🤝&apos;,
            value: 10,
            isFirstTime: false

    ], [teams, users]);

    const handleSocialAction = (action: string, data: any) => {
}
        onSocialInteraction(action, data);
        
        // Update activity feed
        const newActivity: SocialActivity = {
}
            id: `activity_${Date.now()}`,
            type: action as any,
            userId: currentUser.id,
            userName: currentUser.name,
            teamName: teams.find((t: any) => t.owner.id === currentUser.id)?.name,
            description: getActivityDescription(action, data),
            timestamp: new Date(),
            relatedId: data.id
        };
        
        setRecentActivity(prev => [newActivity, ...prev.slice(0, 9)]);
    };

    const getActivityDescription = (action: string, data: any): string => {
}
        switch (action) {
}
            case &apos;trade_proposal&apos;:
                return &apos;proposed a new trade&apos;;
            case &apos;story_publish&apos;:
                return &apos;published a team story&apos;;
            case &apos;event_reaction&apos;:
                return &apos;reacted to a league event&apos;;
            case &apos;event_comment&apos;:
                return &apos;commented on a league event&apos;;
            default:
                return &apos;performed an action&apos;;

    };

    const tabs = [
        { 
}
            id: &apos;feed&apos;, 
            label: &apos;Social Feed&apos;, 
            icon: <RssIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />,
            description: &apos;League activity and interactions&apos;
        },
        { 
}
            id: &apos;trade_chat&apos;, 
            label: &apos;Trade Hub&apos;, 
            icon: <MessageSquareIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />,
            description: &apos;Trade negotiations and discussions&apos;
        },
        { 
}
            id: &apos;stories&apos;, 
            label: &apos;Team Stories&apos;, 
            icon: <BookOpenIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />,
            description: &apos;Share your fantasy journey&apos;
        },
        { 
}
            id: &apos;history&apos;, 
            label: &apos;League History&apos;, 
            icon: <HistoryIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />,
            description: &apos;Memorable moments and milestones&apos;
        },
        { 
}
            id: &apos;community&apos;, 
            label: &apos;Community&apos;, 
            icon: <UsersIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />,
            description: &apos;League stats and member activity&apos;

    ];

    const renderCommunityOverview = () => (
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            {/* Community Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-center gap-2 mb-2 sm:px-4 md:px-6 lg:px-8">
                        <UsersIcon className="w-5 h-5 text-blue-400 sm:px-4 md:px-6 lg:px-8" />
                        <span className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">Total Members</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-400 sm:px-4 md:px-6 lg:px-8">{communityStats.totalMembers}</div>
                </div>
                
                <div className="p-4 bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-center gap-2 mb-2 sm:px-4 md:px-6 lg:px-8">
                        <SparklesIcon className="w-5 h-5 text-green-400 sm:px-4 md:px-6 lg:px-8" />
                        <span className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">Active Today</span>
                    </div>
                    <div className="text-2xl font-bold text-green-400 sm:px-4 md:px-6 lg:px-8">{communityStats.activeToday}</div>
                </div>
                
                <div className="p-4 bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-center gap-2 mb-2 sm:px-4 md:px-6 lg:px-8">
                        <TrendingUpIcon className="w-5 h-5 text-purple-400 sm:px-4 md:px-6 lg:px-8" />
                        <span className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">Engagement</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-400 sm:px-4 md:px-6 lg:px-8">{communityStats.engagementScore}%</div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="p-4 bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg sm:px-4 md:px-6 lg:px-8">
                <h3 className="font-medium text-[var(--text-primary)] mb-4 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                    <CalendarIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
                    Recent Community Activity
                </h3>
                <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                    {recentActivity.length === 0 ? (
}
                        <p className="text-[var(--text-secondary)] text-center py-4 sm:px-4 md:px-6 lg:px-8">
                            No recent activity. Be the first to engage!
                        </p>
                    ) : (
                        recentActivity.slice(0, 5).map((activity: any) => (
                            <div key={activity.id} className="flex items-start gap-3 p-2 hover:bg-white/5 rounded sm:px-4 md:px-6 lg:px-8">
                                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0 sm:px-4 md:px-6 lg:px-8" />
                                <div className="flex-1 min-w-0 sm:px-4 md:px-6 lg:px-8">
                                    <p className="text-sm text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                        <span className="font-medium sm:px-4 md:px-6 lg:px-8">{activity.userName}</span>
                                        {activity.teamName && (
}
                                            <span className="text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8"> ({activity.teamName})</span>
                                        )}
                                        {&apos; &apos;}{activity.description}
                                    </p>
                                    <p className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                        {activity.timestamp.toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setActiveTab(&apos;trade_chat&apos;)}
                    className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/50 rounded-lg text-left sm:px-4 md:px-6 lg:px-8"
                >
                    <div className="flex items-center gap-3 mb-2 sm:px-4 md:px-6 lg:px-8">
                        <MessageSquareIcon className="w-6 h-6 text-blue-400 sm:px-4 md:px-6 lg:px-8" />
                        <span className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">Start Trade Chat</span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                        Begin trade negotiations with league members
                    </p>
                </motion.button>
                
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setActiveTab(&apos;stories&apos;)}
                    className="p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/50 rounded-lg text-left sm:px-4 md:px-6 lg:px-8"
                >
                    <div className="flex items-center gap-3 mb-2 sm:px-4 md:px-6 lg:px-8">
                        <BookOpenIcon className="w-6 h-6 text-green-400 sm:px-4 md:px-6 lg:px-8" />
                        <span className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">Share Your Story</span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                        Document your fantasy football journey
                    </p>
                </motion.button>
            </div>
        </div>
    );

    const renderActiveTab = () => {
}
        switch (activeTab) {
}
            case &apos;feed&apos;:
                return (
                    <SocialFeed>
                        feedItems={mockFeedItems}
                        currentUser={currentUser}
                        onReaction={(itemId, emoji) => handleSocialAction(&apos;feed_reaction&apos;, { itemId, emoji })}
                        onComment={(itemId, content) => handleSocialAction(&apos;feed_comment&apos;, { itemId, content })}
                        onShare={(itemId: any) => handleSocialAction(&apos;feed_share&apos;, { itemId })}
                        onPin={(itemId: any) => handleSocialAction(&apos;feed_pin&apos;, { itemId })}
                        onReport={(itemId, reason) => handleSocialAction(&apos;feed_report&apos;, { itemId, reason })}
                        onVote={(pollId, optionId) => handleSocialAction(&apos;poll_vote&apos;, { pollId, optionId })}
                    />
                );
                
            case &apos;trade_chat&apos;:
                // For now, return a placeholder since we need proper chat session data
                return (
                    <div className="p-8 text-center text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                        <MessageSquareIcon className="w-16 h-16 mx-auto mb-4 opacity-50 sm:px-4 md:px-6 lg:px-8" />
                        <h3 className="text-lg font-medium mb-2 sm:px-4 md:px-6 lg:px-8">Trade Chat Coming Soon</h3>
                        <p>Advanced trade negotiation features will be available here.</p>
                        <p className="text-sm mt-2 sm:px-4 md:px-6 lg:px-8">Real-time chat, proposal sharing, and trade analytics.</p>
                    </div>
                );
                
            case &apos;stories&apos;:
                // For now, return a placeholder since we need proper story templates
                return (
                    <div className="p-8 text-center text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                        <BookOpenIcon className="w-16 h-16 mx-auto mb-4 opacity-50 sm:px-4 md:px-6 lg:px-8" />
                        <h3 className="text-lg font-medium mb-2 sm:px-4 md:px-6 lg:px-8">Team Stories Coming Soon</h3>
                        <p>Rich story creation tools will be available here.</p>
                        <p className="text-sm mt-2 sm:px-4 md:px-6 lg:px-8">Templates, multimedia support, and narrative building.</p>
                    </div>
                );
                
            case &apos;history&apos;:
                return (
                    <LeagueHistoryViewer>
                        league={league}
                        events={mockLeagueEvents}
                        milestones={mockMilestones}
                        onEventReaction={(eventId, emoji) => handleSocialAction(&apos;event_reaction&apos;, { eventId, emoji })}
                        onEventComment={(eventId, content) => handleSocialAction(&apos;event_comment&apos;, { eventId, content })}
                        onShareEvent={(eventId: any) => handleSocialAction(&apos;event_share&apos;, { eventId })}
                    />
                );
                
            case &apos;community&apos;:
                return renderCommunityOverview();
                
            default:
                return null;

    };

    return (
        <Widget title="Community Hub" className={`h-full flex flex-col ${className}`}>
            {/* Header with Tab Navigation */}
            <div className="flex-shrink-0 border-b border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                <div className="p-4 pb-0 sm:px-4 md:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                        <HeartIcon className="w-6 h-6 text-red-400 sm:px-4 md:px-6 lg:px-8" />
                        Community Hub
                    </h1>
                </div>
                
                <div className="flex overflow-x-auto sm:px-4 md:px-6 lg:px-8">
                    {tabs.map((tab: any) => (
}
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as SocialFeatureTab)}`}
                            title={tab.description}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden sm:px-4 md:px-6 lg:px-8">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="h-full sm:px-4 md:px-6 lg:px-8"
                >
                    {renderActiveTab()}
                </motion.div>
            </div>
        </Widget>
    );
};

const CommunityHubIntegrationWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <CommunityHubIntegration {...props} />
  </ErrorBoundary>
);

export default React.memo(CommunityHubIntegrationWithErrorBoundary);
