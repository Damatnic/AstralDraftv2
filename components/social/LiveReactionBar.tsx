/**
 * Live Reaction Bar Component
 * Real-time reactions for predictions, debates, and leagues
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveReactions } from '../../hooks/useRealTimeSocial';
import { useAuth } from '../../contexts/SimpleAuthContext';

interface LiveReactionBarProps {
  entityType: 'prediction' | 'debate' | 'league';
  entityId: string;
  className?: string;
  compact?: boolean;
}

const REACTION_EMOJIS = ['👍', '👎', '🔥', '💯', '🤔', '😂', '❤️', '🎯'];

const LiveReactionBar: React.FC<LiveReactionBarProps> = ({
  entityType,
  entityId,
  className = '',
  compact = false
}) => {
  const { user } = useAuth();
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  
  const {
    reactions,
    sendReaction,
    getReactionCounts,
    getUserReaction
  } = useLiveReactions(entityType, entityId, user?.id, user?.username);

  const reactionCounts = getReactionCounts();
  const userReaction = getUserReaction();
  const totalReactions = reactions.length;

  const handleReactionClick = async (emoji: string) => {
    if (user) {
      await sendReaction(emoji);
      setShowReactionPicker(false);
    }
  };

  const getTopReactions = () => {
    return Object.entries(reactionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, compact ? 3 : 6);
  };

  const topReactions = getTopReactions();

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2 flex-wrap">
        {/* Existing Reactions */}
        <AnimatePresence>
          {topReactions.map(([emoji, count]) => (
            <motion.button
              key={emoji}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleReactionClick(emoji)}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all ${
                userReaction === emoji
                  ? 'bg-blue-500/20 border border-blue-400/50 text-blue-300'
                  : 'bg-slate-700/50 hover:bg-slate-600/50 text-gray-300 hover:text-white border border-slate-600/30'
              }`}
              title={`${count} reaction${count !== 1 ? 's' : ''}`}
            >
              <span className="text-sm">{emoji}</span>
              {!compact && <span>{count}</span>}
            </motion.button>
          ))}
        </AnimatePresence>

        {/* Add Reaction Button */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-700/50 hover:bg-slate-600/50 text-gray-400 hover:text-white border border-slate-600/30 transition-all text-xs font-medium"
            disabled={!user}
            title={user ? 'Add reaction' : 'Login to react'}
          >
            <span>😊</span>
            {!compact && <span>React</span>}
          </motion.button>

          {/* Reaction Picker */}
          <AnimatePresence>
            {showReactionPicker && user && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="absolute bottom-full mb-2 left-0 bg-slate-800 rounded-lg shadow-xl border border-slate-700 p-2 z-50"
              >
                <div className="grid grid-cols-4 gap-1">
                  {REACTION_EMOJIS.map((emoji) => (
                    <motion.button
                      key={emoji}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleReactionClick(emoji)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-colors ${
                        userReaction === emoji
                          ? 'bg-blue-500/20 border border-blue-400/50'
                          : 'hover:bg-slate-700 border border-transparent'
                      }`}
                      title={`React with ${emoji}`}
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Total Count (compact mode) */}
        {compact && totalReactions > 0 && (
          <div className="text-xs text-gray-500">
            {totalReactions} reaction{totalReactions !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Recent Reactions Stream (non-compact) */}
      {!compact && reactions.length > 0 && (
        <div className="mt-3">
          <div className="text-xs text-gray-500 mb-2">Recent reactions:</div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <AnimatePresence>
              {reactions.slice(0, 8).map((reaction) => (
                <motion.div
                  key={reaction.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-700/30 border border-slate-600/30 text-xs whitespace-nowrap"
                >
                  <span>{reaction.reaction}</span>
                  <span className="text-gray-400">{reaction.username}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Backdrop for reaction picker */}
      {showReactionPicker && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowReactionPicker(false)}
        />
      )}
    </div>
  );
};

export default LiveReactionBar;