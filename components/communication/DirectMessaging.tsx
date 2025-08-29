/**
 * Direct Messaging Component
 * Private conversations between league members
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../../contexts/AppContext';

interface DirectMessage {
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
  messageType: 'text' | 'trade_link' | 'player_link' | 'image';
  attachments?: {
    type: 'trade' | 'player' | 'image';
    data: unknown;
  }[];
}

interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar: string;
    teamName: string;
  }[];
  lastMessage: DirectMessage;
  unreadCount: number;
  isActive: boolean;
}

const DirectMessaging: React.FC = () => {
  const { state, dispatch } = useAppState();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUser = state.user;
  const league = state.leagues[0];

  // Simulate direct messages
  const directMessages = useMemo((): DirectMessage[] => {
    return [
      {
        id: 'dm-1',
        conversationId: 'conv-1',
        senderId: 'user-2',
        senderName: 'Jon Kornbeck',
        senderAvatar: '⚡',
        recipientId: currentUser?.id || '',
        recipientName: currentUser?.name || '',
        message: 'Hey! Saw your trade proposal. I\'m interested but wondering if we can tweak it a bit?',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: false,
        messageType: 'text'
      },
      {
        id: 'dm-2',
        conversationId: 'conv-1',
        senderId: currentUser?.id || '',
        senderName: currentUser?.name || '',
        senderAvatar: currentUser?.avatar || '👑',
        recipientId: 'user-2',
        recipientName: 'Jon Kornbeck',
        message: 'Absolutely! What did you have in mind? I\'m pretty flexible on this one.',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        isRead: true,
        messageType: 'text'
      },
      {
        id: 'dm-3',
        conversationId: 'conv-1',
        senderId: 'user-2',
        senderName: 'Jon Kornbeck',
        senderAvatar: '⚡',
        recipientId: currentUser?.id || '',
        recipientName: currentUser?.name || '',
        message: 'What if we add Tyler Boyd to your side? That would make it more even for both teams.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        isRead: false,
        messageType: 'text'
      },
      {
        id: 'dm-4',
        conversationId: 'conv-2',
        senderId: 'user-4',
        senderName: 'Brittany Bergrum',
        senderAvatar: '💪',
        recipientId: currentUser?.id || '',
        recipientName: currentUser?.name || '',
        message: 'Congrats on the big win this week! Your team is looking scary good 🔥',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        isRead: false,
        messageType: 'text'
      },
      {
        id: 'dm-5',
        conversationId: 'conv-3',
        senderId: 'user-7',
        senderName: 'Larry McCaigue',
        senderAvatar: '⭐',
        recipientId: currentUser?.id || '',
        recipientName: currentUser?.name || '',
        message: 'Dude, did you see what happened in the Rams game? Kupp went down and I\'m panicking! 😰',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        isRead: true,
        messageType: 'text'
      }
    ];
  }, [currentUser]);

  // Generate conversations from messages
  const conversations = useMemo((): Conversation[] => {
    const convMap = new Map<string, Conversation>();

    directMessages.forEach(message => {
      if (!convMap.has(message.conversationId)) {
        const otherParticipant = message.senderId === currentUser?.id 
          ? { id: message.recipientId, name: message.recipientName, avatar: '👤', teamName: 'Unknown Team' }
          : { id: message.senderId, name: message.senderName, avatar: message.senderAvatar, teamName: 'Unknown Team' };

        // Find team name
        const team = league?.teams?.find(t => t.owner.id === otherParticipant.id);
        if (team) {
          otherParticipant.teamName = team.name;
          otherParticipant.avatar = team.avatar;
        }

        convMap.set(message.conversationId, {
          id: message.conversationId,
          participants: [
            {
              id: currentUser?.id || '',
              name: currentUser?.name || '',
              avatar: currentUser?.avatar || '👑',
              teamName: league?.teams?.find(t => t.owner.id === currentUser?.id)?.name || 'Your Team'
            },
            otherParticipant
          ],
          lastMessage: message,
          unreadCount: 0,
          isActive: false
        });
      }

      const conv = convMap.get(message.conversationId)!;
      if (message.timestamp > conv.lastMessage.timestamp) {
        conv.lastMessage = message;
      }
      if (!message.isRead && message.recipientId === currentUser?.id) {
        conv.unreadCount++;
      }
    });

    return Array.from(convMap.values()).sort((a, b) => 
      b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime()
    );
  }, [directMessages, currentUser, league]);

  const selectedConversationMessages = useMemo(() => {
    if (!selectedConversation) return [];
    return directMessages
      .filter(msg => msg.conversationId === selectedConversation)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }, [directMessages, selectedConversation]);

  const selectedConversationData = conversations.find(c => c.id === selectedConversation);
  const otherParticipant = selectedConversationData?.participants.find(p => p.id !== currentUser?.id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversationMessages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation || !currentUser) return;

    // TODO: Implement message creation and sending
    // const message: DirectMessage = {
    //   id: `dm-${Date.now()}`,
    //   conversationId: selectedConversation,
    //   senderId: currentUser.id,
    //   senderName: currentUser.name,
    //   senderAvatar: currentUser.avatar,
    //   recipientId: otherParticipant?.id || '',
    //   recipientName: otherParticipant?.name || '',
    //   message: newMessage.trim(),
    //   timestamp: new Date(),
    //   isRead: false,
    //   messageType: 'text'
    // };

    // Message created successfully

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        message: 'Message sent!',
        type: 'SUCCESS'
      }
    });

    setNewMessage('');
  };

  const handleStartNewConversation = () => {
    if (!selectedRecipient || !currentUser) return;

    const recipient = league?.teams?.find(t => t.id === selectedRecipient);
    if (!recipient) return;

    const newConversationId = `conv-${Date.now()}`;
    
    // Starting new conversation

    setSelectedConversation(newConversationId);
    setShowNewConversation(false);
    setSelectedRecipient('');

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        message: `Started conversation with ${recipient.owner.name}`,
        type: 'SUCCESS'
      }
    });
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const formatMessageTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-[600px] flex bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
      {/* Conversations Sidebar */}
      <div className="w-80 border-r border-slate-700 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-white">Messages</h3>
            <button
              onClick={() => setShowNewConversation(true)}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span className="text-xl">✏️</span>
            </button>
          </div>
          
          {/* Search */}
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-slate-400 mb-3">No conversations yet</p>
              <button
                onClick={() => setShowNewConversation(true)}
                className="btn btn-primary btn-sm"
              >
                Start Chatting
              </button>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {conversations.map(conversation => {
                const participant = conversation.participants.find(p => p.id !== currentUser?.id);
                return (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      selectedConversation === conversation.id
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-slate-700/50 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <span className="text-2xl">{participant?.avatar}</span>
                        {conversation.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold truncate">{participant?.name}</span>
                          <span className="text-xs opacity-75">
                            {formatTimestamp(conversation.lastMessage.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm opacity-75 truncate">
                          {conversation.lastMessage.senderId === currentUser?.id ? 'You: ' : ''}
                          {conversation.lastMessage.message}
                        </p>
                        <p className="text-xs opacity-60">{participant?.teamName}</p>
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
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-700 bg-slate-800/30">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{otherParticipant?.avatar}</span>
                <div>
                  <h4 className="text-white font-semibold">{otherParticipant?.name}</h4>
                  <p className="text-slate-400 text-sm">{otherParticipant?.teamName}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConversationMessages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === currentUser?.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      message.senderId === currentUser?.id ? 'text-blue-200' : 'text-slate-400'
                    }`}>
                      {formatMessageTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-slate-700">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="btn btn-primary"
                >
                  Send
                </button>
              </div>
              
              {/* Quick Actions */}
              <div className="flex gap-2 mt-2">
                <button className="text-slate-400 hover:text-white transition-colors text-sm">
                  📎 Attach
                </button>
                <button className="text-slate-400 hover:text-white transition-colors text-sm">
                  🔗 Share Trade
                </button>
                <button className="text-slate-400 hover:text-white transition-colors text-sm">
                  👤 Share Player
                </button>
              </div>
            </div>
          </>
        ) : (
          /* No Conversation Selected */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <span className="text-6xl mb-4 block">💬</span>
              <h3 className="text-xl font-bold text-white mb-2">Select a Conversation</h3>
              <p className="text-slate-400 mb-4">Choose a conversation to start messaging</p>
              <button
                onClick={() => setShowNewConversation(true)}
                className="btn btn-primary"
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="card w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">New Conversation</h3>
                <button
                  onClick={() => setShowNewConversation(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">Select Recipient</label>
                  <select
                    value={selectedRecipient}
                    onChange={(e) => setSelectedRecipient(e.target.value)}
                    className="form-input"
                  >
                    <option value="">Choose a league member...</option>
                    {league?.teams?.filter(t => t.owner.id !== currentUser?.id).map(team => (
                      <option key={team.id} value={team.id}>
                        {team.avatar} {team.owner.name} ({team.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowNewConversation(false)}
                    className="btn btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStartNewConversation}
                    disabled={!selectedRecipient}
                    className="btn btn-primary flex-1"
                  >
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

export default DirectMessaging;