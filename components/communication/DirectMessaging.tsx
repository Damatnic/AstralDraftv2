/**
 * Direct Messaging Component
 * Private conversations between league members
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useState, useMemo, useRef, useEffect } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;

interface DirectMessage {
}
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  recipientId: string;
  recipientName: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  messageType: &apos;text&apos; | &apos;trade_link&apos; | &apos;player_link&apos; | &apos;image&apos;;
  attachments?: {
}
    type: &apos;trade&apos; | &apos;player&apos; | &apos;image&apos;;
    data: any;
  }[];

interface Conversation {
}
  id: string;
  participants: {
}
    id: string;
    name: string;
    avatar: string;
    teamName: string;
  }[];
  lastMessage: DirectMessage;
  unreadCount: number;
  isActive: boolean;

const DirectMessaging: React.FC = () => {
}
  const [isLoading, setIsLoading] = React.useState(false);
  const { state, dispatch } = useAppState();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState(&apos;&apos;);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState(&apos;&apos;);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUser = state.user;
  const league = state.leagues[0];

  // Simulate direct messages
  const directMessages = useMemo((): DirectMessage[] => {
}
    return [
      {
}
        id: &apos;dm-1&apos;,
        conversationId: &apos;conv-1&apos;,
        senderId: &apos;user-2&apos;,
        senderName: &apos;Jon Kornbeck&apos;,
        senderAvatar: &apos;⚡&apos;,
        recipientId: currentUser?.id || &apos;&apos;,
        recipientName: currentUser?.name || &apos;&apos;,
        message: &apos;Hey! Saw your trade proposal. I\&apos;m interested but wondering if we can tweak it a bit?&apos;,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: false,
        messageType: &apos;text&apos;
      },
      {
}
        id: &apos;dm-2&apos;,
        conversationId: &apos;conv-1&apos;,
        senderId: currentUser?.id || &apos;&apos;,
        senderName: currentUser?.name || &apos;&apos;,
        senderAvatar: currentUser?.avatar || &apos;👑&apos;,
        recipientId: &apos;user-2&apos;,
        recipientName: &apos;Jon Kornbeck&apos;,
        message: &apos;Absolutely! What did you have in mind? I\&apos;m pretty flexible on this one.&apos;,
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        isRead: true,
        messageType: &apos;text&apos;
      },
      {
}
        id: &apos;dm-3&apos;,
        conversationId: &apos;conv-1&apos;,
        senderId: &apos;user-2&apos;,
        senderName: &apos;Jon Kornbeck&apos;,
        senderAvatar: &apos;⚡&apos;,
        recipientId: currentUser?.id || &apos;&apos;,
        recipientName: currentUser?.name || &apos;&apos;,
        message: &apos;What if we add Tyler Boyd to your side? That would make it more even for both teams.&apos;,
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        isRead: false,
        messageType: &apos;text&apos;
      },
      {
}
        id: &apos;dm-4&apos;,
        conversationId: &apos;conv-2&apos;,
        senderId: &apos;user-4&apos;,
        senderName: &apos;Brittany Bergrum&apos;,
        senderAvatar: &apos;💪&apos;,
        recipientId: currentUser?.id || &apos;&apos;,
        recipientName: currentUser?.name || &apos;&apos;,
        message: &apos;Congrats on the big win this week! Your team is looking scary good 🔥&apos;,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        isRead: false,
        messageType: &apos;text&apos;
      },
      {
}
        id: &apos;dm-5&apos;,
        conversationId: &apos;conv-3&apos;,
        senderId: &apos;user-7&apos;,
        senderName: &apos;Larry McCaigue&apos;,
        senderAvatar: &apos;⭐&apos;,
        recipientId: currentUser?.id || &apos;&apos;,
        recipientName: currentUser?.name || &apos;&apos;,
        message: &apos;Dude, did you see what happened in the Rams game? Kupp went down and I\&apos;m panicking! 😰&apos;,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        isRead: true,
        messageType: &apos;text&apos;

    ];
  }, [currentUser]);

  // Generate conversations from messages
  const conversations = useMemo((): Conversation[] => {
}
    const convMap = new Map<string, Conversation>();

    directMessages.forEach((message: any) => {
}
      if (!convMap.has(message.conversationId)) {
}
        const otherParticipant = message.senderId === currentUser?.id 
          ? { id: message.recipientId, name: message.recipientName, avatar: &apos;👤&apos;, teamName: &apos;Unknown Team&apos; }
          : { id: message.senderId, name: message.senderName, avatar: message.senderAvatar, teamName: &apos;Unknown Team&apos; };

        // Find team name
        const team = league?.teams?.find((t: any) => t.owner.id === otherParticipant.id);
        if (team) {
}
          otherParticipant.teamName = team.name;
          otherParticipant.avatar = team.avatar;

        convMap.set(message.conversationId, {
}
          id: message.conversationId,
          participants: [
            {
}
              id: currentUser?.id || &apos;&apos;,
              name: currentUser?.name || &apos;&apos;,
              avatar: currentUser?.avatar || &apos;👑&apos;,
              teamName: league?.teams?.find((t: any) => t.owner.id === currentUser?.id)?.name || &apos;Your Team&apos;
            },
//             otherParticipant
          ],
          lastMessage: message,
          unreadCount: 0,
          isActive: false
        });

      const conv = convMap.get(message.conversationId)!;
      if (message.timestamp > conv.lastMessage.timestamp) {
}
        conv.lastMessage = message;

      if (!message.isRead && message.recipientId === currentUser?.id) {
}
        conv.unreadCount++;

    });

    return Array.from(convMap.values()).sort((a, b) => 
      b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime()
    );
  }, [directMessages, currentUser, league]);

  const selectedConversationMessages = useMemo(() => {
}
    if (!selectedConversation) return [];
    return directMessages
      .filter((msg: any) => msg.conversationId === selectedConversation)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }, [directMessages, selectedConversation]);

  const selectedConversationData = conversations.find((c: any) => c.id === selectedConversation);
  const otherParticipant = selectedConversationData?.participants.find((p: any) => p.id !== currentUser?.id);

  useEffect(() => {
}
    messagesEndRef.current?.scrollIntoView({ behavior: &apos;smooth&apos; });
  }, [selectedConversationMessages]);

  const handleSendMessage = () => {
}
    if (!newMessage.trim() || !selectedConversation || !currentUser) return;

    const message: DirectMessage = {
}
      id: `dm-${Date.now()}`,
      conversationId: selectedConversation,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      recipientId: otherParticipant?.id || &apos;&apos;,
      recipientName: otherParticipant?.name || &apos;&apos;,
      message: newMessage.trim(),
      timestamp: new Date(),
      isRead: false,
      messageType: &apos;text&apos;
    };

    dispatch({
}
      type: &apos;ADD_NOTIFICATION&apos;,
      payload: {
}
        message: &apos;Message sent!&apos;,
        type: &apos;SUCCESS&apos;

    });

    setNewMessage(&apos;&apos;);
  };

  const handleStartNewConversation = () => {
}
    if (!selectedRecipient || !currentUser) return;

    const recipient = league?.teams?.find((t: any) => t.id === selectedRecipient);
    if (!recipient) return;

    const newConversationId = `conv-${Date.now()}`;

    setSelectedConversation(newConversationId);
    setShowNewConversation(false);
    setSelectedRecipient(&apos;&apos;);

    dispatch({
}
      type: &apos;ADD_NOTIFICATION&apos;,
      payload: {
}
        message: `Started conversation with ${recipient.owner.name}`,
        type: &apos;SUCCESS&apos;

    });
  };

  const formatTimestamp = (timestamp: Date) => {
}
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return &apos;Just now&apos;;
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const formatMessageTime = (timestamp: Date) => {
}
    return timestamp.toLocaleTimeString([], { hour: &apos;2-digit&apos;, minute: &apos;2-digit&apos; });
  };

  return (
    <div className="h-[600px] flex bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden sm:px-4 md:px-6 lg:px-8">
      {/* Conversations Sidebar */}
      <div className="w-80 border-r border-slate-700 flex flex-col sm:px-4 md:px-6 lg:px-8">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-700 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-3 sm:px-4 md:px-6 lg:px-8">
            <h3 className="text-lg font-bold text-white sm:px-4 md:px-6 lg:px-8">Messages</h3>
            <button
              onClick={() => setShowNewConversation(true)}
            >
              <span className="text-xl sm:px-4 md:px-6 lg:px-8">✏️</span>
            </button>
          </div>
          
          {/* Search */}
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:border-blue-500 focus:outline-none sm:px-4 md:px-6 lg:px-8"
          />
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto sm:px-4 md:px-6 lg:px-8">
          {conversations.length === 0 ? (
}
            <div className="p-4 text-center sm:px-4 md:px-6 lg:px-8">
              <p className="text-slate-400 mb-3 sm:px-4 md:px-6 lg:px-8">No conversations yet</p>
              <button
                onClick={() => setShowNewConversation(true)}
              >
                Start Chatting
              </button>
            </div>
          ) : (
            <div className="space-y-1 p-2 sm:px-4 md:px-6 lg:px-8">
              {conversations.map((conversation: any) => {
}
                const participant = conversation.participants.find((p: any) => p.id !== currentUser?.id);
                return (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}`}
                  >
                    <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                      <div className="relative sm:px-4 md:px-6 lg:px-8">
                        <span className="text-2xl sm:px-4 md:px-6 lg:px-8">{participant?.avatar}</span>
                        {conversation.unreadCount > 0 && (
}
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                          <span className="font-semibold truncate sm:px-4 md:px-6 lg:px-8">{participant?.name}</span>
                          <span className="text-xs opacity-75 sm:px-4 md:px-6 lg:px-8">
                            {formatTimestamp(conversation.lastMessage.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm opacity-75 truncate sm:px-4 md:px-6 lg:px-8">
                          {conversation.lastMessage.senderId === currentUser?.id ? &apos;You: &apos; : &apos;&apos;}
                          {conversation.lastMessage.message}
                        </p>
                        <p className="text-xs opacity-60 sm:px-4 md:px-6 lg:px-8">{participant?.teamName}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col sm:px-4 md:px-6 lg:px-8">
        {selectedConversation ? (
}
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-700 bg-slate-800/30 sm:px-4 md:px-6 lg:px-8">
              <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                <span className="text-2xl sm:px-4 md:px-6 lg:px-8">{otherParticipant?.avatar}</span>
                <div>
                  <h4 className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">{otherParticipant?.name}</h4>
                  <p className="text-slate-400 text-sm sm:px-4 md:px-6 lg:px-8">{otherParticipant?.teamName}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 sm:px-4 md:px-6 lg:px-8">
              {selectedConversationMessages.map((message: any) => (
}
                <div
                  key={message.id}
                  className={`flex ${
}
                    message.senderId === currentUser?.id ? &apos;justify-end&apos; : &apos;justify-start&apos;
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
}
                      message.senderId === currentUser?.id
                        ? &apos;bg-blue-600 text-white&apos;
                        : &apos;bg-slate-700 text-slate-300&apos;
                    }`}
                  >
                    <p className="text-sm sm:px-4 md:px-6 lg:px-8">{message.message}</p>
                    <p className={`text-xs mt-1 ${
}
                      message.senderId === currentUser?.id ? &apos;text-blue-200&apos; : &apos;text-slate-400&apos;
                    }`}>
                      {formatMessageTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-slate-700 sm:px-4 md:px-6 lg:px-8">
              <div className="flex gap-3 sm:px-4 md:px-6 lg:px-8">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e: any) => setNewMessage(e.target.value)}
                  className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none sm:px-4 md:px-6 lg:px-8"
                  onKeyPress={(e: any) => {
}
                    if (e.key === &apos;Enter&apos;) {
}
                      handleSendMessage();

                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="btn btn-primary sm:px-4 md:px-6 lg:px-8"
                 aria-label="Action button">
//                   Send
                </button>
              </div>
              
              {/* Quick Actions */}
              <div className="flex gap-2 mt-2 sm:px-4 md:px-6 lg:px-8">
                <button className="text-slate-400 hover:text-white transition-colors text-sm sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                  📎 Attach
                </button>
                <button className="text-slate-400 hover:text-white transition-colors text-sm sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                  🔗 Share Trade
                </button>
                <button className="text-slate-400 hover:text-white transition-colors text-sm sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                  👤 Share Player
                </button>
              </div>
            </div>
          </>
        ) : (
          /* No Conversation Selected */
          <div className="flex-1 flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
            <div className="text-center sm:px-4 md:px-6 lg:px-8">
              <span className="text-6xl mb-4 block sm:px-4 md:px-6 lg:px-8">💬</span>
              <h3 className="text-xl font-bold text-white mb-2 sm:px-4 md:px-6 lg:px-8">Select a Conversation</h3>
              <p className="text-slate-400 mb-4 sm:px-4 md:px-6 lg:px-8">Choose a conversation to start messaging</p>
              <button
                onClick={() => setShowNewConversation(true)}
              >
                Start New Conversation
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New Conversation Modal */}
      <AnimatePresence>
        {showNewConversation && (
}
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sm:px-4 md:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="card w-full max-w-md sm:px-4 md:px-6 lg:px-8"
            >
              <div className="flex items-center justify-between mb-4 sm:px-4 md:px-6 lg:px-8">
                <h3 className="text-lg font-bold text-white sm:px-4 md:px-6 lg:px-8">New Conversation</h3>
                <button
                  onClick={() => setShowNewConversation(false)}
                >
                  <span className="text-xl sm:px-4 md:px-6 lg:px-8">×</span>
                </button>
              </div>

              <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                <div>
                  <label className="block text-white font-medium mb-2 sm:px-4 md:px-6 lg:px-8">Select Recipient</label>
                  <select
                    value={selectedRecipient}
                    onChange={(e: any) => setSelectedRecipient(e.target.value)}
                  >
                    <option value="">Choose a league member...</option>
                    {league?.teams?.filter((t: any) => t.owner.id !== currentUser?.id).map((team: any) => (
}
                      <option key={team.id} value={team.id}>
                        {team.avatar} {team.owner.name} ({team.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 sm:px-4 md:px-6 lg:px-8">
                  <button
                    onClick={() => setShowNewConversation(false)}
                  >
//                     Cancel
                  </button>
                  <button
                    onClick={handleStartNewConversation}
                    disabled={!selectedRecipient}
                    className="btn btn-primary flex-1 sm:px-4 md:px-6 lg:px-8"
                   aria-label="Action button">
                    Start Chat
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DirectMessagingWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <DirectMessaging {...props} />
  </ErrorBoundary>
);

export default React.memo(DirectMessagingWithErrorBoundary);