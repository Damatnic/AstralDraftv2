import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo, useState, useEffect } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { 
}
    MessageCircleIcon, 
    MessageSquareIcon,
    TrophyIcon,
    FlameIcon,
    UserIcon,
    PlusIcon,
    ThumbsUpIcon,
    ThumbsDownIcon,
    ReplyIcon,
    TrendingUpIcon,
//     StarIcon
} from &apos;lucide-react&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { useAuth } from &apos;../../contexts/AuthContext&apos;;
import { 
}
    socialInteractionService,
    type Message,
    type ForumTopic,
    type TrashTalkPost,
    type UserSocialProfile,
    type CommunityActivity,
    type Rivalry,
    type ForumCategory
} from &apos;../../services/socialInteractionService&apos;;

interface Props {
}
    leagueId: string;
    className?: string;

type SocialTab = &apos;feed&apos; | &apos;messages&apos; | &apos;forum&apos; | &apos;comparisons&apos; | &apos;trash_talk&apos; | &apos;rivalries&apos; | &apos;profile&apos;;

// Helper functions for styling
}

const getActivityTypeStyles = (activityType: string): string => {
}
    switch (activityType) {
}
        case &apos;message&apos;:
            return &apos;bg-blue-500/20 text-blue-400&apos;;
        case &apos;forum_post&apos;:
            return &apos;bg-green-500/20 text-green-400&apos;;
        case &apos;trash_talk&apos;:
            return &apos;bg-orange-500/20 text-orange-400&apos;;
        default:
            return &apos;bg-gray-500/20 text-gray-400&apos;;

};

const getTopicCategoryStyles = (category: string): string => {
}
    switch (category) {
}
        case &apos;announcements&apos;:
            return &apos;bg-red-500/20 text-red-400&apos;;
        case &apos;trades&apos;:
            return &apos;bg-green-500/20 text-green-400&apos;;
        case &apos;trash_talk&apos;:
            return &apos;bg-orange-500/20 text-orange-400&apos;;
        default:
            return &apos;bg-blue-500/20 text-blue-400&apos;;

};

const getSeverityStyles = (severity: string): string => {
}
    switch (severity) {
}
        case &apos;friendly&apos;:
            return &apos;bg-green-500/20 text-green-400&apos;;
        case &apos;competitive&apos;:
            return &apos;bg-yellow-500/20 text-yellow-400&apos;;
        default:
            return &apos;bg-red-500/20 text-red-400&apos;;

};

const getRivalryLevelStyles = (level: string): string => {
}
    switch (level) {
}
        case &apos;legendary&apos;:
            return &apos;text-purple-400&apos;;
        case &apos;intense&apos;:
            return &apos;text-red-400&apos;;
        case &apos;moderate&apos;:
            return &apos;text-orange-400&apos;;
        default:
            return &apos;text-yellow-400&apos;;

};

const getBadgeRarityStyles = (rarity: string): string => {
}
    switch (rarity) {
}
        case &apos;legendary&apos;:
            return &apos;border-purple-500 bg-purple-500/20&apos;;
        case &apos;epic&apos;:
            return &apos;border-blue-500 bg-blue-500/20&apos;;
        case &apos;rare&apos;:
            return &apos;border-green-500 bg-green-500/20&apos;;
        default:
            return &apos;border-gray-500 bg-gray-500/20&apos;;

};

const SocialHub: React.FC<Props> = ({ 
}
    leagueId, 
    className = &apos;&apos; 
}: any) => {
}
    const { user, isAuthenticated } = useAuth();
    const [activeTab, setActiveTab] = useState<SocialTab>(&apos;feed&apos;);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Data state
    const [messages, setMessages] = useState<Message[]>([]);
    const [forumTopics, setForumTopics] = useState<ForumTopic[]>([]);
    const [trashTalkPosts, setTrashTalkPosts] = useState<TrashTalkPost[]>([]);
    const [userProfile, setUserProfile] = useState<UserSocialProfile | null>(null);
    const [communityActivity, setCommunityActivity] = useState<CommunityActivity[]>([]);
    const [rivalries, setRivalries] = useState<Rivalry[]>([]);

    // UI state
    const [selectedCategory, setSelectedCategory] = useState<ForumCategory | &apos;all&apos;>(&apos;all&apos;);
    const [newMessage, setNewMessage] = useState(&apos;&apos;);
    const [newTopicTitle, setNewTopicTitle] = useState(&apos;&apos;);
    const [newTopicContent, setNewTopicContent] = useState(&apos;&apos;);
    const [showNewTopicModal, setShowNewTopicModal] = useState(false);

    useEffect(() => {
}
        if (!isAuthenticated || !user) return;
        loadSocialData();
    }, [isAuthenticated, user, leagueId, activeTab]);

    const loadSocialData = async () => {
}
        if (!user) return;
        
        setLoading(true);
        setError(null);
        
        try {
}
            // Load data based on active tab
            switch (activeTab) {
}
                case &apos;feed&apos;: {
}
                    const activity = await socialInteractionService.getCommunityActivity(leagueId);
                    setCommunityActivity(activity);
                    break;

                case &apos;messages&apos;: {
}
                    const userMessages = await socialInteractionService.getMessages({
}
                        userId: user.id.toString(),
                        leagueId,
                        limit: 50
                    });
                    setMessages(userMessages);
                    break;

                case &apos;forum&apos;: {
}
                    const topics = await socialInteractionService.getForumTopics(
                        leagueId, 
                        selectedCategory === &apos;all&apos; ? undefined : selectedCategory
                    );
                    setForumTopics(topics);
                    break;

                case &apos;trash_talk&apos;: {
}
                    const trashTalk = await socialInteractionService.getTrashTalkPosts(leagueId);
                    setTrashTalkPosts(trashTalk);
                    break;

                case &apos;rivalries&apos;: {
}
                    const leagueRivalries = await socialInteractionService.getRivalries(leagueId);
                    setRivalries(leagueRivalries);
                    break;

                case &apos;profile&apos;: {
}
                    const profile = await socialInteractionService.getUserSocialProfile(user.id.toString());
                    setUserProfile(profile);
                    break;


    } catch (error) {
}
            setError(&apos;Failed to load social data&apos;);
        } finally {
}
            setLoading(false);

    };

    const handleSendMessage = async () => {
}
        if (!user || !newMessage.trim()) return;

        try {
}

            await socialInteractionService.sendMessage(
                user.id.toString(),
                user.username || &apos;User&apos;,
                newMessage,
                &apos;league&apos;,
                { leagueId }
            );
            setNewMessage(&apos;&apos;);
            await loadSocialData(); // Refresh messages

    } catch (error) {
}
            setError(&apos;Failed to send message&apos;);

    };

    const handleCreateTopic = async () => {
}
        if (!user || !newTopicTitle.trim() || !newTopicContent.trim()) return;

        try {
}

            await socialInteractionService.createForumTopic(
                leagueId,
                user.id.toString(),
                user.username || &apos;User&apos;,
                newTopicTitle,
                newTopicContent,
                &apos;general&apos;
            );
            setNewTopicTitle(&apos;&apos;);
            setNewTopicContent(&apos;&apos;);
            setShowNewTopicModal(false);
            await loadSocialData(); // Refresh topics

    } catch (error) {
}
            setError(&apos;Failed to create forum topic&apos;);

    };

    const handlePostTrashTalk = (content: string, targetId?: string, targetName?: string) => {
}
        if (!user || !content.trim()) return;

        socialInteractionService.postTrashTalk(
            leagueId,
            user.id.toString(),
            user.username || &apos;User&apos;,
            content,
            { targetId, targetName, context: &apos;general&apos;, severity: &apos;friendly&apos; }
        ).then(() => {
}
    
            loadSocialData(); // Refresh trash talk
        
    return ).catch(err ;
  } {
}
            setError(&apos;Failed to post trash talk&apos;);
        });
    };

    const handleReactToMessage = async (messageId: string, emoji: string) => {
}
        if (!user) return;

        try {
}

            await socialInteractionService.addMessageReaction(
                messageId,
                user.id.toString(),
                user.username || &apos;User&apos;,
//                 emoji
            );
            await loadSocialData(); // Refresh to show updated reactions

    } catch (error) {
}

    };

    if (!isAuthenticated || !user) {
}
        return (
            <Widget title="Social Hub" className={className}>
                <div className="text-center py-8 sm:px-4 md:px-6 lg:px-8">
                    <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4 sm:px-4 md:px-6 lg:px-8" />
                    <p className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Please log in to access social features</p>
                </div>
            </Widget>
        );

    const tabs = [
        { id: &apos;feed&apos;, label: &apos;Activity Feed&apos;, icon: TrendingUpIcon },
        { id: &apos;messages&apos;, label: &apos;Messages&apos;, icon: MessageCircleIcon },
        { id: &apos;forum&apos;, label: &apos;Forum&apos;, icon: MessageSquareIcon },
        { id: &apos;comparisons&apos;, label: &apos;Comparisons&apos;, icon: TrophyIcon },
        { id: &apos;trash_talk&apos;, label: &apos;Trash Talk&apos;, icon: FlameIcon },
        { id: &apos;rivalries&apos;, label: &apos;Rivalries&apos;, icon: StarIcon },
        { id: &apos;profile&apos;, label: &apos;Profile&apos;, icon: UserIcon }
    ];

    const forumCategories: Array<{ id: ForumCategory | &apos;all&apos;, label: string }> = [
        { id: &apos;all&apos;, label: &apos;All Topics&apos; },
        { id: &apos;general&apos;, label: &apos;General&apos; },
        { id: &apos;trades&apos;, label: &apos;Trades&apos; },
        { id: &apos;waiver_wire&apos;, label: &apos;Waiver Wire&apos; },
        { id: &apos;matchup_discussion&apos;, label: &apos;Matchups&apos; },
        { id: &apos;strategy&apos;, label: &apos;Strategy&apos; },
        { id: &apos;trash_talk&apos;, label: &apos;Trash Talk&apos; },
        { id: &apos;announcements&apos;, label: &apos;Announcements&apos; }
    ];

    const renderActivityFeed = () => (
        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
            {communityActivity.map((activity: any) => (
}
                <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800 rounded-lg p-4 border border-gray-700 sm:px-4 md:px-6 lg:px-8"
                >
                    <div className="flex items-start space-x-3 sm:px-4 md:px-6 lg:px-8">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
                            <span className="text-xs font-bold text-white sm:px-4 md:px-6 lg:px-8">
                                {activity.userName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                            <div className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                                <span className="font-medium text-white sm:px-4 md:px-6 lg:px-8">{activity.userName}</span>
                                <span className="text-gray-400 text-sm sm:px-4 md:px-6 lg:px-8">
                                    {activity.timestamp.toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-300 text-sm mt-1 sm:px-4 md:px-6 lg:px-8">{activity.description}</p>
                            <div className="flex items-center space-x-2 mt-2 sm:px-4 md:px-6 lg:px-8">
                                <span className={`px-2 py-1 rounded-full text-xs ${
}
                                    activity.activityType === &apos;message&apos; ? &apos;bg-blue-500/20 text-blue-400&apos; :
                                    activity.activityType === &apos;forum_post&apos; ? &apos;bg-green-500/20 text-green-400&apos; :
                                    activity.activityType === &apos;trash_talk&apos; ? &apos;bg-orange-500/20 text-orange-400&apos; :
                                    &apos;bg-gray-500/20 text-gray-400&apos;
                                }`}>
                                    {activity.activityType.replace(&apos;_&apos;, &apos; &apos;)}
                                </span>
                                <span className="text-gray-400 text-xs sm:px-4 md:px-6 lg:px-8">+{activity.points} points</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );

    const renderMessages = () => (
        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
            {/* Message composer */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 sm:px-4 md:px-6 lg:px-8">
                <div className="flex space-x-3 sm:px-4 md:px-6 lg:px-8">
                    <textarea
                        value={newMessage}
                        onChange={(e: any) => setNewMessage(e.target.value)}
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 resize-none sm:px-4 md:px-6 lg:px-8"
                        rows={3}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg h-fit sm:px-4 md:px-6 lg:px-8"
                     aria-label="Action button">
//                         Send
                    </button>
                </div>
            </div>

            {/* Messages list */}
            {messages.map((message: any) => (
}
                <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800 rounded-lg p-4 border border-gray-700 sm:px-4 md:px-6 lg:px-8"
                >
                    <div className="flex items-start space-x-3 sm:px-4 md:px-6 lg:px-8">
                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
                            <span className="text-sm font-bold text-white sm:px-4 md:px-6 lg:px-8">
                                {message.senderName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                            <div className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                                <span className="font-medium text-white sm:px-4 md:px-6 lg:px-8">{message.senderName}</span>
                                <span className="text-gray-400 text-sm sm:px-4 md:px-6 lg:px-8">
                                    {message.timestamp.toLocaleDateString()} at {message.timestamp.toLocaleTimeString()}
                                </span>
                            </div>
                            <p className="text-gray-300 mt-2 sm:px-4 md:px-6 lg:px-8">{message.content}</p>
                            
                            {/* Reactions */}
                            <div className="flex items-center space-x-4 mt-3 sm:px-4 md:px-6 lg:px-8">
                                <div className="flex space-x-2 sm:px-4 md:px-6 lg:px-8">
                                    {[&apos;👍&apos;, &apos;❤️&apos;, &apos;😂&apos;, &apos;😮&apos;].map((emoji: any) => (
}
                                        <button
                                            key={emoji}
                                            onClick={() => handleReactToMessage(message.id, emoji)}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                                {message.reactions.length > 0 && (
}
                                    <div className="flex space-x-1 sm:px-4 md:px-6 lg:px-8">
                                        {message.reactions.map((reaction: any) => (
}
                                            <span key={reaction.id} className="text-sm sm:px-4 md:px-6 lg:px-8">
                                                {reaction.emoji} {reaction.userName}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );

    const renderForum = () => (
        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
            {/* Forum controls */}
            <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                <div className="flex space-x-2 sm:px-4 md:px-6 lg:px-8">
                    <select
                        value={selectedCategory}
                        onChange={(e: any) => setSelectedCategory(e.target.value as ForumCategory | &apos;all&apos;)}
                    >
                        {forumCategories.map((cat: any) => (
}
                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={() => setShowNewTopicModal(true)}
                >
                    <PlusIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                    <span>New Topic</span>
                </button>
            </div>

            {/* Forum topics */}
            {forumTopics.map((topic: any) => (
}
                <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 cursor-pointer sm:px-4 md:px-6 lg:px-8"
                >
                    <div className="flex items-start justify-between sm:px-4 md:px-6 lg:px-8">
                        <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                            <div className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                                {topic.isSticky && <StarIcon className="w-4 h-4 text-yellow-400 sm:px-4 md:px-6 lg:px-8" />}
                                <h3 className="font-medium text-white sm:px-4 md:px-6 lg:px-8">{topic.title}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs ${
}
                                    topic.category === &apos;announcements&apos; ? &apos;bg-red-500/20 text-red-400&apos; :
                                    topic.category === &apos;trades&apos; ? &apos;bg-green-500/20 text-green-400&apos; :
                                    topic.category === &apos;trash_talk&apos; ? &apos;bg-orange-500/20 text-orange-400&apos; :
                                    &apos;bg-blue-500/20 text-blue-400&apos;
                                }`}>
                                    {topic.category.replace(&apos;_&apos;, &apos; &apos;)}
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm mt-1 sm:px-4 md:px-6 lg:px-8">{topic.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                <span>By {topic.creatorName}</span>
                                <span>{topic.messageCount} replies</span>
                                <span>{topic.views} views</span>
                                <span>Last: {topic.lastActivity.toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );

    const renderTrashTalk = () => (
        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
            {/* Trash talk composer */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 sm:px-4 md:px-6 lg:px-8">
                <button
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8"
                 aria-label="Action button">
                    <FlameIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                    <span>Post Trash Talk</span>
                </button>
            </div>

            {/* Trash talk posts */}
            {trashTalkPosts.map((post: any) => (
}
                <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800 rounded-lg p-4 border border-gray-700 sm:px-4 md:px-6 lg:px-8"
                >
                    <div className="flex items-start space-x-3 sm:px-4 md:px-6 lg:px-8">
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
                            <FlameIcon className="w-5 h-5 text-white sm:px-4 md:px-6 lg:px-8" />
                        </div>
                        <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                            <div className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                                <span className="font-medium text-white sm:px-4 md:px-6 lg:px-8">{post.authorName}</span>
                                {post.targetName && (
}
                                    <>
                                        <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">→</span>
                                        <span className="text-orange-400 sm:px-4 md:px-6 lg:px-8">{post.targetName}</span>
                                    </>
                                )}
                                <span className="text-gray-400 text-sm sm:px-4 md:px-6 lg:px-8">
                                    {post.timestamp.toLocaleDateString()}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs ${
}
                                    post.severity === &apos;friendly&apos; ? &apos;bg-green-500/20 text-green-400&apos; :
                                    post.severity === &apos;competitive&apos; ? &apos;bg-yellow-500/20 text-yellow-400&apos; :
                                    &apos;bg-red-500/20 text-red-400&apos;
                                }`}>
                                    {post.severity}
                                </span>
                            </div>
                            <p className="text-gray-300 mt-2 sm:px-4 md:px-6 lg:px-8">{post.content}</p>
                            
                            <div className="flex items-center space-x-4 mt-3 sm:px-4 md:px-6 lg:px-8">
                                <button className="flex items-center space-x-1 text-green-400 hover:text-green-300 sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                                    <ThumbsUpIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                    <span>{post.likes}</span>
                                </button>
                                <button className="flex items-center space-x-1 text-red-400 hover:text-red-300 sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                                    <ThumbsDownIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                    <span>{post.dislikes}</span>
                                </button>
                                <button className="flex items-center space-x-1 text-gray-400 hover:text-gray-300 sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                                    <ReplyIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                    <span>Reply ({post.replies.length})</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );

    const renderRivalries = () => (
        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
            <div className="text-center py-4 sm:px-4 md:px-6 lg:px-8">
                <h3 className="text-lg font-bold text-white mb-2 sm:px-4 md:px-6 lg:px-8">League Rivalries</h3>
                <p className="text-gray-400 sm:px-4 md:px-6 lg:px-8">The hottest competitions in your league</p>
            </div>
            
            {rivalries.map((rivalry: any) => (
}
                <motion.div
                    key={rivalry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800 rounded-lg p-4 border border-gray-700 sm:px-4 md:px-6 lg:px-8"
                >
                    <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-center space-x-4 sm:px-4 md:px-6 lg:px-8">
                            <div className="text-center sm:px-4 md:px-6 lg:px-8">
                                <div className="text-white font-bold sm:px-4 md:px-6 lg:px-8">{rivalry.user1Name}</div>
                                <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                    {rivalry.headToHeadRecord.user1Wins}W - {rivalry.headToHeadRecord.user2Wins}L
                                </div>
                            </div>
                            <div className="text-2xl sm:px-4 md:px-6 lg:px-8">⚡</div>
                            <div className="text-center sm:px-4 md:px-6 lg:px-8">
                                <div className="text-white font-bold sm:px-4 md:px-6 lg:px-8">{rivalry.user2Name}</div>
                                <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                    {rivalry.headToHeadRecord.user2Wins}W - {rivalry.headToHeadRecord.user1Wins}L
                                </div>
                            </div>
                        </div>
                        <div className="text-right sm:px-4 md:px-6 lg:px-8">
                            <div className={`text-lg font-bold ${
}
                                rivalry.rivalryLevel === &apos;legendary&apos; ? &apos;text-purple-400&apos; :
                                rivalry.rivalryLevel === &apos;intense&apos; ? &apos;text-red-400&apos; :
                                rivalry.rivalryLevel === &apos;moderate&apos; ? &apos;text-orange-400&apos; :
                                &apos;text-yellow-400&apos;
                            }`}>
                                {rivalry.rivalryLevel.toUpperCase()}
                            </div>
                            <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                {rivalry.rivalryScore} rivalry points
                            </div>
                            <div className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">
                                {rivalry.trashTalkCount} trash talks
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );

    const renderUserProfile = () => (
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            {userProfile ? (
}
                <>
                    {/* Profile header */}
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-start space-x-4 sm:px-4 md:px-6 lg:px-8">
                            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
                                <span className="text-xl font-bold text-white sm:px-4 md:px-6 lg:px-8">
                                    {userProfile.username.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                                <h2 className="text-xl font-bold text-white sm:px-4 md:px-6 lg:px-8">{userProfile.username}</h2>
                                {userProfile.bio && <p className="text-gray-400 mt-1 sm:px-4 md:px-6 lg:px-8">{userProfile.bio}</p>}
                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                    <span>Joined {userProfile.joinDate.toLocaleDateString()}</span>
                                    {userProfile.favoriteTeam && <span>Fan of {userProfile.favoriteTeam}</span>}
                                    <span>Reputation: {userProfile.reputation}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700 sm:px-4 md:px-6 lg:px-8">
                            <div className="text-2xl font-bold text-blue-400 sm:px-4 md:px-6 lg:px-8">{userProfile.totalMessages}</div>
                            <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Messages</div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700 sm:px-4 md:px-6 lg:px-8">
                            <div className="text-2xl font-bold text-green-400 sm:px-4 md:px-6 lg:px-8">{userProfile.totalForumPosts}</div>
                            <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Forum Posts</div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700 sm:px-4 md:px-6 lg:px-8">
                            <div className="text-2xl font-bold text-orange-400 sm:px-4 md:px-6 lg:px-8">{userProfile.totalTrashTalks}</div>
                            <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Trash Talks</div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700 sm:px-4 md:px-6 lg:px-8">
                            <div className="text-2xl font-bold text-purple-400 sm:px-4 md:px-6 lg:px-8">{userProfile.engagementPoints}</div>
                            <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Points</div>
                        </div>
                    </div>

                    {/* Badges */}
                    {userProfile.badges.length > 0 && (
}
                        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 sm:px-4 md:px-6 lg:px-8">
                            <h3 className="text-lg font-bold text-white mb-3 sm:px-4 md:px-6 lg:px-8">Badges</h3>
                            <div className="flex flex-wrap gap-2 sm:px-4 md:px-6 lg:px-8">
                                {userProfile.badges.map((badge: any) => (
}
                                    <div
                                        key={badge.id}
                                        className={`flex items-center space-x-2 px-3 py-2 rounded-full border ${
}
                                            badge.rarity === &apos;legendary&apos; ? &apos;border-purple-500 bg-purple-500/20&apos; :
                                            badge.rarity === &apos;epic&apos; ? &apos;border-blue-500 bg-blue-500/20&apos; :
                                            badge.rarity === &apos;rare&apos; ? &apos;border-green-500 bg-green-500/20&apos; :
                                            &apos;border-gray-500 bg-gray-500/20&apos;
                                        }`}
                                    >
                                        <span className="text-lg sm:px-4 md:px-6 lg:px-8">{badge.icon}</span>
                                        <span className="text-sm font-medium text-white sm:px-4 md:px-6 lg:px-8">{badge.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-8 sm:px-4 md:px-6 lg:px-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto sm:px-4 md:px-6 lg:px-8"></div>
                    <span className="ml-2 text-gray-400 sm:px-4 md:px-6 lg:px-8">Loading profile...</span>
                </div>
            )}
        </div>
    );

    return (
        <div className={`space-y-6 ${className}`}>
            <Widget title="Social Hub" className="overflow-visible sm:px-4 md:px-6 lg:px-8">
                {/* Tab navigation */}
                <div className="flex space-x-1 mb-6 bg-gray-800 p-1 rounded-lg sm:px-4 md:px-6 lg:px-8">
                    {tabs.map((tab: any) => {
}
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as SocialTab)}`}
                            >
                                <Icon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                <span className="text-sm font-medium sm:px-4 md:px-6 lg:px-8">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {error && (
}
                    <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6 sm:px-4 md:px-6 lg:px-8">
                        <p className="text-red-400 sm:px-4 md:px-6 lg:px-8">{error}</p>
                    </div>
                )}

                {/* Tab content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {loading ? (
}
                            <div className="flex items-center justify-center py-8 sm:px-4 md:px-6 lg:px-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 sm:px-4 md:px-6 lg:px-8"></div>
                                <span className="ml-2 text-gray-400 sm:px-4 md:px-6 lg:px-8">Loading...</span>
                            </div>
                        ) : (
                            <>
                                {activeTab === &apos;feed&apos; && renderActivityFeed()}
                                {activeTab === &apos;messages&apos; && renderMessages()}
                                {activeTab === &apos;forum&apos; && renderForum()}
                                {activeTab === &apos;trash_talk&apos; && renderTrashTalk()}
                                {activeTab === &apos;rivalries&apos; && renderRivalries()}
                                {activeTab === &apos;profile&apos; && renderUserProfile()}
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            </Widget>

            {/* New Topic Modal */}
            {showNewTopicModal && (
}
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 sm:px-4 md:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700 sm:px-4 md:px-6 lg:px-8"
                    >
                        <h3 className="text-lg font-bold text-white mb-4 sm:px-4 md:px-6 lg:px-8">Create New Topic</h3>
                        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                            <input
                                type="text"
                                value={newTopicTitle}
                                onChange={(e: any) => setNewTopicTitle(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 sm:px-4 md:px-6 lg:px-8"
                            />
                            <textarea
                                value={newTopicContent}
                                onChange={(e: any) => setNewTopicContent(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 resize-none sm:px-4 md:px-6 lg:px-8"
                                rows={4}
                            />
                            <div className="flex justify-end space-x-3 sm:px-4 md:px-6 lg:px-8">
                                <button
                                    onClick={() => setShowNewTopicModal(false)}
                                >
//                                     Cancel
                                </button>
                                <button
                                    onClick={handleCreateTopic}
                                    disabled={!newTopicTitle.trim() || !newTopicContent.trim()}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg sm:px-4 md:px-6 lg:px-8"
                                 aria-label="Action button">
                                    Create Topic
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

const SocialHubWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <SocialHub {...props} />
  </ErrorBoundary>
);

export default React.memo(SocialHubWithErrorBoundary);
