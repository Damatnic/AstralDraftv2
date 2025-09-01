/**
 * Trade Discussion Component
 * Threaded conversations for trade negotiations
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../../contexts/AppContext';

interface TradeComment {
  id: string;
  tradeId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  message: string;
  timestamp: Date;
  isCounterOffer?: boolean;
  counterOfferDetails?: {
    playersOffered: any[];
    playersRequested: any[];
  };
  reactions: {
    [emoji: string]: string[]; // emoji: array of user IDs
  };

interface TradeDiscussionProps {
  tradeId: string;
  isVisible: boolean;
  onClose: () => void;


const TradeDiscussion: React.FC<TradeDiscussionProps> = ({ 
  tradeId, 
  isVisible, 
//   onClose 
}: any) => {
  const { state, dispatch } = useAppState();
  const [newMessage, setNewMessage] = useState('');
  const [showCounterOffer, setShowCounterOffer] = useState(false);

  const currentUser = state.user;

  // Simulate trade discussion comments
  const tradeComments = useMemo((): TradeComment[] => {
    return [
      {
        id: 'comment-1',
        tradeId,
        userId: 'user-1',
        userName: 'Nick Damato',
        userAvatar: '👑',
        message: 'Hey! I think this trade could work for both of us. Henry has been consistent but I really need WR help for the playoffs.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        reactions: {
          '👍': ['user-2'],
          '🤔': ['user-3']

      },
      {
        id: 'comment-2',
        tradeId,
        userId: 'user-2',
        userName: 'Jon Kornbeck',
        userAvatar: '⚡',
        message: 'I like the idea but Kupp has been dealing with that ankle injury. What if we add a bench player to sweeten the deal?',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
        reactions: {
          '💭': ['user-1'],
          '👀': ['user-1', 'user-4']

      },
      {
        id: 'comment-3',
        tradeId,
        userId: 'user-1',
        userName: 'Nick Damato',
        userAvatar: '👑',
        message: 'Good point about the injury. How about I throw in Tyler Boyd as well? He\'s been getting consistent targets.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        isCounterOffer: true,
        counterOfferDetails: {
          playersOffered: [
            { id: 'p1', name: 'Derrick Henry', position: 'RB' },
            { id: 'p2', name: 'Tyler Boyd', position: 'WR' }
          ],
          playersRequested: [
            { id: 'p3', name: 'Cooper Kupp', position: 'WR' }

        },
        reactions: {
          '🔥': ['user-2'],
          '👍': ['user-2', 'user-5']

      },
      {
        id: 'comment-4',
        tradeId,
        userId: 'user-2',
        userName: 'Jon Kornbeck',
        userAvatar: '⚡',
        message: 'Now we\'re talking! That makes it much more fair. Let me think about it overnight and I\'ll get back to you tomorrow.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        reactions: {
          '⏰': ['user-1'],
          '🤝': ['user-1']


    ];
  }, [tradeId]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentUser) return;

    const newComment: TradeComment = {
      id: `comment-${Date.now()}`,
      tradeId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      message: newMessage.trim(),
      timestamp: new Date(),
      reactions: {}
    };

    // In a real app, this would be sent to the backend

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        message: 'Comment posted successfully!',
        type: 'SUCCESS'

    });

    setNewMessage('');
  };

  const handleReaction = (commentId: string, emoji: string) => {
    if (!currentUser) return;

    // In a real app, this would update the backend

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        message: 'Reaction added!',
        type: 'INFO'

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

  const reactionEmojis = ['👍', '👎', '🔥', '���', '😂', '❤️', '🤔', '👀'];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sm:px-4 md:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="card w-full max-w-2xl max-h-[80vh] flex flex-col sm:px-4 md:px-6 lg:px-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-600 sm:px-4 md:px-6 lg:px-8">
          <div>
            <h3 className="text-xl font-bold text-white sm:px-4 md:px-6 lg:px-8">Trade Discussion</h3>
            <p className="text-slate-400 text-sm sm:px-4 md:px-6 lg:px-8">Negotiate and discuss trade details</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors sm:px-4 md:px-6 lg:px-8"
           aria-label="Action button">
            <span className="text-2xl sm:px-4 md:px-6 lg:px-8">×</span>
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-6 sm:px-4 md:px-6 lg:px-8">
          <AnimatePresence>
            {tradeComments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg ${
                  comment.isCounterOffer 
                    ? 'bg-blue-900/20 border border-blue-600/30' 
                    : 'bg-slate-700/50'
                }`}
              >
                {/* Comment Header */}
                <div className="flex items-center gap-3 mb-3 sm:px-4 md:px-6 lg:px-8">
                  <span className="text-2xl sm:px-4 md:px-6 lg:px-8">{comment.userAvatar}</span>
                  <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                      <span className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">{comment.userName}</span>
                      {comment.isCounterOffer && (
                        <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full sm:px-4 md:px-6 lg:px-8">
                          Counter Offer
                        </span>
                      )}
                    </div>
                    <span className="text-slate-400 text-sm sm:px-4 md:px-6 lg:px-8">{formatTimestamp(comment.timestamp)}</span>
                  </div>
                </div>

                {/* Counter Offer Details */}
                {comment.isCounterOffer && comment.counterOfferDetails && (
                  <div className="mb-3 p-3 bg-slate-800/50 rounded-lg sm:px-4 md:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <h5 className="text-blue-400 font-semibold mb-2 sm:px-4 md:px-6 lg:px-8">Offering:</h5>
                        {comment.counterOfferDetails.playersOffered.map((player: any) => (
                          <div key={player.id} className="text-white sm:px-4 md:px-6 lg:px-8">
                            {player.name} ({player.position})
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
                        <span className="text-2xl text-blue-400 sm:px-4 md:px-6 lg:px-8">⇄</span>
                      </div>
                      <div>
                        <h5 className="text-blue-400 font-semibold mb-2 sm:px-4 md:px-6 lg:px-8">For:</h5>
                        {comment.counterOfferDetails.playersRequested.map((player: any) => (
                          <div key={player.id} className="text-white sm:px-4 md:px-6 lg:px-8">
                            {player.name} ({player.position})
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Comment Message */}
                <p className="text-slate-300 mb-3 sm:px-4 md:px-6 lg:px-8">{comment.message}</p>

                {/* Reactions */}
                <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                  <div className="flex gap-1 sm:px-4 md:px-6 lg:px-8">
                    {Object.entries(comment.reactions).map(([emoji, userIds]) => (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(comment.id, emoji)}`}
                      >
                        {emoji} {userIds.length}
                      </button>
                    ))}
                  </div>
                  
                  {/* Add Reaction Dropdown */}
                  <div className="relative group sm:px-4 md:px-6 lg:px-8">
                    <button className="text-slate-400 hover:text-white transition-colors sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                      <span className="text-lg sm:px-4 md:px-6 lg:px-8">😊</span>
                    </button>
                    <div className="absolute bottom-full left-0 mb-2 hidden group-hover:flex bg-slate-800 rounded-lg p-2 gap-1 shadow-xl border border-slate-600 sm:px-4 md:px-6 lg:px-8">
                      {reactionEmojis.map((emoji: any) => (
                        <button
                          key={emoji}
                          onClick={() => handleReaction(comment.id, emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Message Input */}
        <div className="border-t border-slate-600 pt-4 sm:px-4 md:px-6 lg:px-8">
          <div className="flex gap-3 sm:px-4 md:px-6 lg:px-8">
            <span className="text-2xl sm:px-4 md:px-6 lg:px-8">{currentUser?.avatar}</span>
            <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
              <textarea
                value={newMessage}
                onChange={(e: any) => setNewMessage(e.target.value)}
                className="form-input h-20 resize-none mb-3 sm:px-4 md:px-6 lg:px-8"
                onKeyPress={(e: any) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();

                }}
              />
              <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                <div className="flex gap-2 sm:px-4 md:px-6 lg:px-8">
                  <button
                    onClick={() => setShowCounterOffer(!showCounterOffer)}
                  >
                    📝 Counter Offer
                  </button>
                  <button className="btn btn-secondary btn-sm sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                    📎 Attach
                  </button>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="btn btn-primary sm:px-4 md:px-6 lg:px-8"
                 aria-label="Action button">
                  Send Comment
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Counter Offer Builder */}
        {showCounterOffer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg sm:px-4 md:px-6 lg:px-8"
          >
            <h4 className="text-white font-semibold mb-3 sm:px-4 md:px-6 lg:px-8">Create Counter Offer</h4>
            <p className="text-blue-300 text-sm mb-3 sm:px-4 md:px-6 lg:px-8">
              Modify the trade terms and post as a counter offer
            </p>
            <div className="flex gap-3 sm:px-4 md:px-6 lg:px-8">
              <button className="btn btn-primary flex-1 sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                Build Counter Offer
              </button>
              <button
                onClick={() => setShowCounterOffer(false)}
              >
//                 Cancel
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

const TradeDiscussionWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <TradeDiscussion {...props} />
  </ErrorBoundary>
);

export default React.memo(TradeDiscussionWithErrorBoundary);