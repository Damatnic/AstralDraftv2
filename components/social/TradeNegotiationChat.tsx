/**
 * Trade Negotiation Chat Component
 * Real-time chat system for trade discussions
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { Player, Team, User } from &apos;../../types&apos;;
import { 
}
    MessageCircleIcon, 
    SendIcon, 
    PaperclipIcon, 
    SmileIcon,
    PhoneIcon,
    VideoIcon,
    InfoIcon,
    XIcon,
    CheckIcon,
    ClockIcon,
    AlertCircleIcon,
    ThumbsUpIcon,
//     ThumbsDownIcon
} from &apos;lucide-react&apos;;

export interface TradeMessage {
}
    id: string;
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    content: string;
    timestamp: Date;
    type: &apos;text&apos; | &apos;trade_proposal&apos; | &apos;counter_offer&apos; | &apos;system&apos; | &apos;reaction&apos;;
    attachments?: TradeAttachment[];
    tradeProposal?: TradeProposal;
    reactions?: MessageReaction[];
    isRead: boolean;
    isEdited?: boolean;
    editedAt?: Date;

}

export interface TradeAttachment {
}
    id: string;
    type: &apos;image&apos; | &apos;player_card&apos; | &apos;stats_comparison&apos; | &apos;projection&apos;;
    url?: string;
    data?: any;
    metadata?: Record<string, any>;

}

export interface TradeProposal {
}
    id: string;
    fromTeamId: number;
    toTeamId: number;
    fromPlayers: Player[];
    toPlayers: Player[];
    status: &apos;pending&apos; | &apos;accepted&apos; | &apos;rejected&apos; | &apos;expired&apos; | &apos;withdrawn&apos;;
    expiresAt: Date;
    fairnessScore?: number;
    notes?: string;

}

export interface MessageReaction {
}
    id: string;
    emoji: string;
    userId: string;
    userName: string;
    timestamp: Date;

}

export interface TradeChatSession {
}
    id: string;
    participants: User[];
    teamIds: number[];
    title: string;
    status: &apos;active&apos; | &apos;completed&apos; | &apos;archived&apos;;
    createdAt: Date;
    lastActivity: Date;
    messageCount: number;
    unreadCount: number;
    currentProposal?: TradeProposal;
    metadata?: {
}
        originalTopic?: string;
        relatedPlayers?: Player[];
        priority?: &apos;low&apos; | &apos;medium&apos; | &apos;high&apos;;
    };

interface TradeNegotiationChatProps {
}
    session: TradeChatSession;
    messages: TradeMessage[];
    currentUser: User & { teamId?: number };
    onSendMessage: (content: string, type?: string, attachments?: TradeAttachment[]) => void;
    onSendTradeProposal: (proposal: Omit<TradeProposal, &apos;id&apos; | &apos;status&apos;>) => void;
    onReactToMessage: (messageId: string, emoji: string) => void;
    onAcceptTrade: (proposalId: string) => void;
    onRejectTrade: (proposalId: string, reason?: string) => void;
    onArchiveChat: () => void;
    isLoading?: boolean;
    className?: string;

const TradeNegotiationChat: React.FC<TradeNegotiationChatProps> = ({
}
    session,
    messages,
    currentUser,
    onSendMessage,
    onSendTradeProposal,
    onReactToMessage,
    onAcceptTrade,
    onRejectTrade,
    onArchiveChat,
    isLoading = false,
    className = &apos;&apos;
}: any) => {
}
    const [newMessage, setNewMessage] = React.useState(&apos;&apos;);
    const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
    const [showTradeBuilder, setShowTradeBuilder] = React.useState(false);
    const [showAttachments, setShowAttachments] = React.useState(false);
    const [isTyping, setIsTyping] = React.useState(false);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom when new messages arrive
    React.useEffect(() => {
}
        messagesEndRef.current?.scrollIntoView({ behavior: &apos;smooth&apos; });
    }, [messages]);

    // Focus input on mount
    React.useEffect(() => {
}
        inputRef.current?.focus();
    }, []);

    const handleSendMessage = (e: React.FormEvent) => {
}
        e.preventDefault();
        if (newMessage.trim() && !isLoading) {
}
            onSendMessage(newMessage.trim());
            setNewMessage(&apos;&apos;);

    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
}
        if (e.key === &apos;Enter&apos; && !e.shiftKey) {
}
            e.preventDefault();
            handleSendMessage(e);

    };

    const formatTimestamp = (timestamp: Date) => {
}
        const now = new Date();
        const diff = now.getTime() - timestamp.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return &apos;Just now&apos;;
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return timestamp.toLocaleDateString();
    };

    const getMessageTypeIcon = (type: string) => {
}
        switch (type) {
}
            case &apos;trade_proposal&apos;:
                return <MessageCircleIcon className="w-4 h-4 text-blue-400 sm:px-4 md:px-6 lg:px-8" />;
            case &apos;counter_offer&apos;:
                return <ClockIcon className="w-4 h-4 text-orange-400 sm:px-4 md:px-6 lg:px-8" />;
            case &apos;system&apos;:
                return <InfoIcon className="w-4 h-4 text-gray-400 sm:px-4 md:px-6 lg:px-8" />;
            default:
                return null;

    };

    const getProposalStatusColor = (status: string) => {
}
        switch (status) {
}
            case &apos;pending&apos;:
                return &apos;text-yellow-400 bg-yellow-500/20&apos;;
            case &apos;accepted&apos;:
                return &apos;text-green-400 bg-green-500/20&apos;;
            case &apos;rejected&apos;:
                return &apos;text-red-400 bg-red-500/20&apos;;
            case &apos;expired&apos;:
                return &apos;text-gray-400 bg-gray-500/20&apos;;
            case &apos;withdrawn&apos;:
                return &apos;text-orange-400 bg-orange-500/20&apos;;
            default:
                return &apos;text-gray-400 bg-gray-500/20&apos;;

    };

    const renderTradeProposal = (proposal: TradeProposal, messageId: string) => (
        <div className="mt-3 p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg sm:px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-3 sm:px-4 md:px-6 lg:px-8">
                <h4 className="font-medium text-blue-400 sm:px-4 md:px-6 lg:px-8">Trade Proposal</h4>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getProposalStatusColor(proposal?.status)}`}>
                    {proposal.status.toUpperCase()}
                </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                    <h5 className="text-sm font-medium text-[var(--text-secondary)] mb-2 sm:px-4 md:px-6 lg:px-8">Offering</h5>
                    <div className="space-y-1 sm:px-4 md:px-6 lg:px-8">
                        {proposal.fromPlayers.map((player: any) => (
}
                            <div key={player.id} className="text-sm text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                {player.name} ({player.position})
                            </div>
                        ))}
                    </div>
                </div>
                
                <div>
                    <h5 className="text-sm font-medium text-[var(--text-secondary)] mb-2 sm:px-4 md:px-6 lg:px-8">Requesting</h5>
                    <div className="space-y-1 sm:px-4 md:px-6 lg:px-8">
                        {proposal.toPlayers.map((player: any) => (
}
                            <div key={player.id} className="text-sm text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                {player.name} ({player.position})
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {proposal.fairnessScore && (
}
                <div className="flex items-center gap-2 mb-3 sm:px-4 md:px-6 lg:px-8">
                    <span className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Fairness Score:</span>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
}
                        proposal.fairnessScore >= 80 ? &apos;text-green-400 bg-green-500/20&apos; :
                        proposal.fairnessScore >= 60 ? &apos;text-yellow-400 bg-yellow-500/20&apos; :
                        &apos;text-red-400 bg-red-500/20&apos;
                    }`}>
                        {proposal.fairnessScore}/100
                    </div>
                </div>
            )}
            
            {proposal.notes && (
}
                <div className="text-sm text-[var(--text-secondary)] mb-3 sm:px-4 md:px-6 lg:px-8">
                    "{proposal.notes}"
                </div>
            )}
            
            {proposal?.status === &apos;pending&apos; && proposal.toTeamId === currentUser.teamId && (
}
                <div className="flex gap-2 sm:px-4 md:px-6 lg:px-8">
                    <button
                        onClick={() => onAcceptTrade(proposal.id)}
                    >
                        <CheckIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
//                         Accept
                    </button>
                    <button
                        onClick={() => onRejectTrade(proposal.id)}
                    >
                        <XIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
//                         Reject
                    </button>
                </div>
            )}
            
            <div className="text-xs text-[var(--text-secondary)] mt-2 sm:px-4 md:px-6 lg:px-8">
                Expires: {new Date(proposal.expiresAt).toLocaleString()}
            </div>
        </div>
    );

    const renderMessage = (message: TradeMessage, index: number) => {
}
        const isOwnMessage = message.senderId === currentUser.id;
        const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;

        return (
            <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex gap-3 ${isOwnMessage ? &apos;flex-row-reverse&apos; : &apos;flex-row&apos;} ${showAvatar ? &apos;mt-4&apos; : &apos;mt-1&apos;}`}
            >
                {showAvatar && !isOwnMessage && (
}
                    <div className="flex-shrink-0 sm:px-4 md:px-6 lg:px-8">
                        <img
                            src={message.senderAvatar || &apos;/default-avatar.png&apos;}
                            alt={message.senderName}
                            className="w-8 h-8 rounded-full sm:px-4 md:px-6 lg:px-8"
                        />
                    </div>
                )}
                
                <div className={`flex-1 max-w-[80%] ${isOwnMessage ? &apos;text-right&apos; : &apos;text-left&apos;}`}>
                    {showAvatar && (
}
                        <div className={`flex items-center gap-2 mb-1 ${isOwnMessage ? &apos;justify-end&apos; : &apos;justify-start&apos;}`}>
                            <span className="text-sm font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                {message.senderName}
                            </span>
                            {getMessageTypeIcon(message.type)}
                            <span className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                {formatTimestamp(message.timestamp)}
                            </span>
                        </div>
                    )}
                    
                    <div className={`inline-block p-3 rounded-lg ${
}
//                         isOwnMessage 
                            ? &apos;bg-blue-500 text-white&apos;
                            : message.type === &apos;system&apos;
                            ? &apos;bg-gray-500/20 text-[var(--text-secondary)]&apos;
                            : &apos;bg-[var(--panel-bg)] border border-[var(--panel-border)] text-[var(--text-primary)]&apos;
                    }`}>
                        <div className="text-sm whitespace-pre-wrap sm:px-4 md:px-6 lg:px-8">{message.content}</div>
                        
                        {message.tradeProposal && renderTradeProposal(message.tradeProposal, message.id)}
                        
                        {message.attachments && message.attachments.length > 0 && (
}
                            <div className="mt-2 space-y-2 sm:px-4 md:px-6 lg:px-8">
                                {message.attachments.map((attachment: any) => (
}
                                    <div key={attachment.id} className="text-xs opacity-75 sm:px-4 md:px-6 lg:px-8">
                                        📎 {attachment.type}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {message.reactions && message.reactions.length > 0 && (
}
                        <div className="flex items-center gap-1 mt-1 flex-wrap sm:px-4 md:px-6 lg:px-8">
                            {Object.entries(
}
                                message.reactions.reduce((acc, reaction) => {
}
                                    acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
                                    return acc;
                                }, {} as Record<string, number>)
                            ).map(([emoji, count]) => (
                                <button
                                    key={emoji}
                                    onClick={() => onReactToMessage(message.id, emoji)}
                                >
                                    <span>{emoji}</span>
                                    <span>{count}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                
                {showAvatar && isOwnMessage && (
}
                    <div className="flex-shrink-0 sm:px-4 md:px-6 lg:px-8">
                        <img
                            src={currentUser.avatar || &apos;/default-avatar.png&apos;}
                            alt={currentUser.name}
                            className="w-8 h-8 rounded-full sm:px-4 md:px-6 lg:px-8"
                        />
                    </div>
                )}
            </motion.div>
        );
    };

    return (
        <div className={`h-full flex flex-col bg-[var(--panel-bg)] ${className}`}>
            {/* Chat Header */}
            <div className="flex-shrink-0 p-4 border-b border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                        <MessageCircleIcon className="w-6 h-6 text-blue-400 sm:px-4 md:px-6 lg:px-8" />
                        <div>
                            <h3 className="font-bold text-lg text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                {session.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                <span>{session.participants.length} participants</span>
                                {session.currentProposal && (
}
                                    <>
                                        <span>•</span>
                                        <span className="text-blue-400 sm:px-4 md:px-6 lg:px-8">Active proposal</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                        <button
                            onClick={() => setShowTradeBuilder(true)}
                            title="Create trade proposal"
                        >
                            <MessageCircleIcon className="w-5 h-5 text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8" />
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                            <PhoneIcon className="w-5 h-5 text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8" />
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                            <VideoIcon className="w-5 h-5 text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8" />
                        </button>
                        <button
                            onClick={onArchiveChat}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8"
                         aria-label="Action button">
                            <XIcon className="w-5 h-5 text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1 sm:px-4 md:px-6 lg:px-8">
                <AnimatePresence>
                    {messages.map((message, index) => renderMessage(message, index))}
                </AnimatePresence>
                
                {isTyping && (
}
                    <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm sm:px-4 md:px-6 lg:px-8">
                        <div className="flex gap-1 sm:px-4 md:px-6 lg:px-8">
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce sm:px-4 md:px-6 lg:px-8"></div>
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce sm:px-4 md:px-6 lg:px-8" style={{ animationDelay: &apos;0.1s&apos; }}></div>
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce sm:px-4 md:px-6 lg:px-8" style={{ animationDelay: &apos;0.2s&apos; }}></div>
                        </div>
                        <span>Someone is typing...</span>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="flex-shrink-0 p-4 border-t border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                <form onSubmit={handleSendMessage}
                    <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-center gap-2 mb-2 sm:px-4 md:px-6 lg:px-8">
                            <button
                                type="button"
                                onClick={() => setShowAttachments(!showAttachments)}
                            >
                                <PaperclipIcon className="w-4 h-4 text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            >
                                <SmileIcon className="w-4 h-4 text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8" />
                            </button>
                        </div>
                        
                        <div className="relative sm:px-4 md:px-6 lg:px-8">
                            <input
                                ref={inputRef}
                                type="text"
                                value={newMessage}
                                onChange={(e: any) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-4 md:px-6 lg:px-8"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || isLoading}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors sm:px-4 md:px-6 lg:px-8"
                     aria-label="Action button">
                        <SendIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
                    </button>
                </form>
            </div>

            {/* Quick Reactions */}
            {showEmojiPicker && (
}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-20 left-4 right-4 bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg p-3 shadow-lg sm:px-4 md:px-6 lg:px-8"
                >
                    <div className="grid grid-cols-8 gap-2 sm:px-4 md:px-6 lg:px-8">
                        {[&apos;👍&apos;, &apos;👎&apos;, &apos;😄&apos;, &apos;😮&apos;, &apos;😢&apos;, &apos;😡&apos;, &apos;❤️&apos;, &apos;🔥&apos;].map((emoji: any) => (
}
                            <button
                                key={emoji}
                                onClick={() = aria-label="Action button"> {
}
                                    // Would add reaction to last message or selected message
                                    setShowEmojiPicker(false);
                                }}
                                className="p-2 hover:bg-white/10 rounded text-xl sm:px-4 md:px-6 lg:px-8"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

const TradeNegotiationChatWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <TradeNegotiationChat {...props} />
  </ErrorBoundary>
);

export default React.memo(TradeNegotiationChatWithErrorBoundary);
