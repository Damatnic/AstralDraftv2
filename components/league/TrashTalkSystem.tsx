/**
 * Trash Talk Enhancement System - Make league interactions legendary
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Flame, Trophy, Target, Zap, Laughing } from 'lucide-react';

interface TrashTalkMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  targetUserId?: string;
  targetUserName?: string;
  timestamp: Date;
  reactions: { emoji: string; count: number; users: string[] }[];
  type: 'general' | 'matchup_specific' | 'waiver_burn' | 'trade_roast';
  spicyLevel: 1 | 2 | 3 | 4 | 5; // Spice meter for content

interface TrashTalkSystemProps {
  leagueId: string;
  currentUserId: string;
  currentUserName: string;
  leagueMembers: Array<{
    id: string;
    name: string;
    teamName: string;
    avatar?: string;
  }>;

const TrashTalkSystem: React.FC<TrashTalkSystemProps> = ({ leagueId,
  currentUserId,
  currentUserName,
  leagueMembers
 }: any) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [messages, setMessages] = useState<TrashTalkMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [messageType, setMessageType] = useState<TrashTalkMessage['type']>('general');
  const [showGifSelector, setShowGifSelector] = useState(false);
  const [spicyLevel, setSpicyLevel] = useState<TrashTalkMessage['spicyLevel']>(3);

  // Predefined trash talk templates for inspiration
  const trashTalkTemplates = {
    waiver_burn: [
      "Congrats on picking up that player... who got dropped last week 😂",
      "Your waiver wire strategy is as weak as your lineup decisions",
      "Even my grandmother could've made a better pickup",
      "That player? Really? Bold strategy, Cotton."
    ],
    matchup_specific: [
      "Prepare for total domination this week!",
      "Your team is about to meet their maker",
      "I've seen stronger lineups in preseason",
      "Time to send you back to the cellar where you belong"
    ],
    trade_roast: [
      "That trade was highway robbery... and you were the victim",
      "I've seen more balanced trades at a kindergarten lunch table",
      "Your trade evaluation skills need work",
      "Thanks for making the rest of us look like geniuses"
    ],
    general: [
      "Your fantasy knowledge is as reliable as a weather forecast",
      "I'm not saying your team is bad, but...",
      "May your players stay healthy and your scores stay low",
      "Your team name is the best part of your roster"

  };

  // Spice level indicators
  const spiceIndicators = [
    { level: 1, emoji: '😊', label: 'Friendly Banter', color: 'green' },
    { level: 2, emoji: '😏', label: 'Light Roasting', color: 'yellow' },
    { level: 3, emoji: '🔥', label: 'Spicy Takes', color: 'orange' },
    { level: 4, emoji: '🌶️', label: 'Hot Sauce', color: 'red' },
    { level: 5, emoji: '💀', label: 'Nuclear', color: 'purple' }
  ];

  // Popular GIF reactions for fantasy football
  const gifReactions = [
    { id: 'touchdown_dance', url: '/gifs/touchdown-dance.gif', name: 'Touchdown Dance' },
    { id: 'crying_jordan', url: '/gifs/crying-jordan.gif', name: 'Crying Jordan' },
    { id: 'celebration', url: '/gifs/celebration.gif', name: 'Victory Celebration' },
    { id: 'facepalm', url: '/gifs/facepalm.gif', name: 'Facepalm' },
    { id: 'mic_drop', url: '/gifs/mic-drop.gif', name: 'Mic Drop' },
    { id: 'fire', url: '/gifs/fire.gif', name: 'This is Fine' }
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: TrashTalkMessage = {
      id: Date.now().toString(),
      userId: currentUserId,
      userName: currentUserName,
      message: newMessage,
      targetUserId: selectedTarget || undefined,
      targetUserName: selectedTarget ? leagueMembers.find((m: any) => m.id === selectedTarget)?.name : undefined,
      timestamp: new Date(),
      reactions: [],
      type: messageType,
      spicyLevel
    };

    setMessages(prev => [message, ...prev]);
    setNewMessage('');
    setSelectedTarget('');

    // TODO: Send to backend/websocket service
    // await trashTalkService.sendMessage(leagueId, message);
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map((msg: any) => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions.find((r: any) => r.emoji === emoji);
        if (existingReaction) {
          if (existingReaction.users.includes(currentUserId)) {
            // Remove reaction
            existingReaction.count--;
            existingReaction.users = existingReaction.users.filter((u: any) => u !== currentUserId);
            if (existingReaction.count === 0) {
              msg.reactions = msg.reactions.filter((r: any) => r.emoji !== emoji);

          } else {
            // Add reaction
            existingReaction.count++;
            existingReaction.users.push(currentUserId);

        } else {
          // New reaction
          msg.reactions.push({
            emoji,
            count: 1,
            users: [currentUserId]
          });


      return msg;
    }));
  };

  const getSpiceColor = (level: number) => {
    const colors = ['text-green-400', 'text-yellow-400', 'text-orange-400', 'text-red-400', 'text-purple-400'];
    return colors[level - 1];
  };

  const getMessageIcon = (type: TrashTalkMessage['type']) => {
    switch (type) {
      case 'matchup_specific': return <Target className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />;
      case 'waiver_burn': return <Zap className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />;
      case 'trade_roast': return <Flame className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />;
      default: return <MessageSquare className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />;

  };

  return (
    <div className="bg-dark-800 rounded-xl p-6 border border-gray-700 sm:px-4 md:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6 sm:px-4 md:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
          <Flame className="w-6 h-6 text-orange-400 sm:px-4 md:px-6 lg:px-8" />
          Trash Talk Hall of Fame
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">
          <Trophy className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
          10-Man League Banter
        </div>
      </div>

      {/* Message Composer */}
      <div className="mb-6 p-4 bg-dark-700 rounded-lg border border-gray-600 sm:px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Message Type Selector */}
          <select
            value={messageType}
            onChange={(e: any) => setMessageType(e.target.value as TrashTalkMessage['type'])}
          >
            <option value="general">General Banter</option>
            <option value="matchup_specific">Matchup Trash Talk</option>
            <option value="waiver_burn">Waiver Wire Roast</option>
            <option value="trade_roast">Trade Criticism</option>
          </select>

          {/* Target Player Selector */}
          <select
            value={selectedTarget}
            onChange={(e: any) => setSelectedTarget(e.target.value)}
          >
            <option value="">Everyone</option>
            {leagueMembers.filter((m: any) => m.id !== currentUserId).map((member: any) => (
              <option key={member.id} value={member.id}>
                @ {member.name}
              </option>
            ))}
          </select>

          {/* Spice Level Selector */}
          <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
            <span className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Spice:</span>
            {spiceIndicators.map((indicator: any) => (
              <button
                key={indicator.level}
                onClick={() => setSpicyLevel(indicator.level)}`}
                title={indicator.label}
              >
                {indicator.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Template Suggestions */}
        <div className="mb-4 sm:px-4 md:px-6 lg:px-8">
          <div className="text-sm text-gray-400 mb-2 sm:px-4 md:px-6 lg:px-8">Quick fire templates:</div>
          <div className="flex flex-wrap gap-2 sm:px-4 md:px-6 lg:px-8">
            {trashTalkTemplates[messageType].map((template, index) => (
              <button
                key={index}
                onClick={() => setNewMessage(template)}
              >
                {template.substring(0, 30)}...
              </button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="flex gap-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
            <textarea
              value={newMessage}
              onChange={(e: any) => setNewMessage(e.target.value)}...` : 
                'Drop some fire trash talk...'

              className="w-full bg-dark-600 border border-gray-500 rounded-lg px-4 py-3 text-white placeholder-gray-400 resize-none sm:px-4 md:px-6 lg:px-8"
              rows={3}
            />
          </div>
          <div className="flex flex-col gap-2 sm:px-4 md:px-6 lg:px-8">
            <button
              onClick={() => setShowGifSelector(!showGifSelector)}
              title="Add GIF"
            >
              <Laughing className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="p-3 bg-primary-600 hover:bg-primary-500 disabled:bg-gray-600 text-white rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8"
             aria-label="Action button">
              <Flame className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
            </button>
          </div>
        </div>

        {/* GIF Selector */}
        <AnimatePresence>
          {showGifSelector && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 grid grid-cols-3 md:grid-cols-6 gap-2"
            >
              {gifReactions.map((gif: any) => (
                <button
                  key={gif.id}
                  onClick={() = aria-label="Action button"> {
                    setNewMessage(prev => prev + ` [GIF: ${gif.name}]`);
                    setShowGifSelector(false);
                  }}
                  className="aspect-square bg-dark-600 rounded-lg p-2 hover:bg-dark-500 transition-colors text-xs text-gray-300 flex items-center justify-center sm:px-4 md:px-6 lg:px-8"
                >
                  {gif.name}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Messages Feed */}
      <div className="space-y-4 max-h-96 overflow-y-auto sm:px-4 md:px-6 lg:px-8">
        <AnimatePresence>
          {messages.map((message: any) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 bg-dark-700 rounded-lg border border-gray-600 sm:px-4 md:px-6 lg:px-8"
            >
              <div className="flex items-start justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                  {getMessageIcon(message.type)}
                  <span className="font-semibold text-white sm:px-4 md:px-6 lg:px-8">{message.userName}</span>
                  {message.targetUserName && (
                    <>
                      <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">→</span>
                      <span className="font-semibold text-primary-400 sm:px-4 md:px-6 lg:px-8">@{message.targetUserName}</span>
                    </>
                  )}
                  <div className="flex items-center gap-1 ml-2 sm:px-4 md:px-6 lg:px-8">
                    <span className={`text-lg ${getSpiceColor(message.spicyLevel)}`}>
                      {spiceIndicators[message.spicyLevel - 1].emoji}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              
              <p className="text-gray-200 mb-3 sm:px-4 md:px-6 lg:px-8">{message.message}</p>
              
              {/* Reactions */}
              <div className="flex items-center gap-2 flex-wrap sm:px-4 md:px-6 lg:px-8">
                {message.reactions.map((reaction: any) => (
                  <button
                    key={reaction.emoji}
                    onClick={() => addReaction(message.id, reaction.emoji)}`}
                  >
                    {reaction.emoji} {reaction.count}
                  </button>
                ))}
                
                {/* Quick reaction buttons */}
                {['🔥', '😂', '💀', '👑', '🤡'].map((emoji: any) => (
                  <button
                    key={emoji}
                    onClick={() => addReaction(message.id, emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const TrashTalkSystemWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <TrashTalkSystem {...props} />
  </ErrorBoundary>
);

export default React.memo(TrashTalkSystemWithErrorBoundary);