/**
 * Trash Talk Board Component
 * League banter and friendly competition
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../../contexts/AppContext';

interface TrashTalkPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  teamName: string;
  message: string;
  timestamp: Date;
  type: 'general' | 'victory' | 'prediction' | 'callout' | 'meme';
  targetUserId?: string;
  targetUserName?: string;
  reactions: {
    [emoji: string]: string[]; // emoji: array of user IDs
  };
  replies: TrashTalkReply[];
  isSticky?: boolean;
  moderatorNote?: string;
}

interface TrashTalkReply {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  message: string;
  timestamp: Date;
  reactions: {
    [emoji: string]: string[];
  };
}

const TrashTalkBoard: React.FC = () => {
  const { state, dispatch } = useAppState();
  const [newPost, setNewPost] = useState('');
  const [postType, setPostType] = useState<'general' | 'victory' | 'prediction' | 'callout' | 'meme'>('general');
  const [targetUser, setTargetUser] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'general' | 'victory' | 'prediction' | 'callout' | 'meme'>('all');
  const [showReplyInput, setShowReplyInput] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const currentUser = state.user;
  const league = state.leagues[0];

  // Simulate trash talk posts
  const trashTalkPosts = useMemo((): TrashTalkPost[] => {
    return [
      {
        id: 'post-1',
        userId: 'user-1',
        userName: 'Nick Damato',
        userAvatar: '👑',
        teamName: 'Astral Aces',
        message: 'Just dropped 167 points this week! 🔥 Who said my draft was weak? Time to eat some crow! 🐦‍⬛',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        type: 'victory',
        reactions: {
          '🔥': ['user-2', 'user-3'],
          '👑': ['user-4'],
          '😤': ['user-5', 'user-6']
        },
        replies: [
          {
            id: 'reply-1',
            userId: 'user-2',
            userName: 'Jon Kornbeck',
            userAvatar: '⚡',
            message: 'One good week doesn\'t make a season, champ! 😏',
            timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
            reactions: {
              '😂': ['user-3', 'user-7'],
              '👀': ['user-1']
            }
          }
        ],
        isSticky: true
      },
      {
        id: 'post-2',
        userId: 'user-3',
        userName: 'Cason Minor',
        userAvatar: '🔥',
        teamName: 'Gridiron Giants',
        message: 'Calling it now: Thunder Bolts are going to choke in the playoffs. They always do! ⚡💥',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        type: 'prediction',
        targetUserId: 'user-2',
        targetUserName: 'Jon Kornbeck',
        reactions: {
          '🍿': ['user-1', 'user-4', 'user-8'],
          '😱': ['user-2'],
          '🎯': ['user-9']
        },
        replies: []
      },
      {
        id: 'post-3',
        userId: 'user-4',
        userName: 'Brittany Bergrum',
        userAvatar: '💪',
        teamName: 'Storm Chasers',
        message: 'Y\'all are fighting for second place while I\'m over here building a dynasty! 💎👸',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        type: 'general',
        reactions: {
          '💅': ['user-5', 'user-8'],
          '🙄': ['user-1', 'user-2', 'user-3'],
          '👸': ['user-7']
        },
        replies: [
          {
            id: 'reply-2',
            userId: 'user-1',
            userName: 'Nick Damato',
            userAvatar: '👑',
            message: 'Dynasty? You\'re 4-4! 😂',
            timestamp: new Date(Date.now() - 5.5 * 60 * 60 * 1000),
            reactions: {
              '💀': ['user-2', 'user-3', 'user-6'],
              '🔥': ['user-9']
            }
          },
          {
            id: 'reply-3',
            userId: 'user-4',
            userName: 'Brittany Bergrum',
            userAvatar: '💪',
            message: 'Quality over quantity, honey! My team is peaking at the right time 📈',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
            reactions: {
              '💯': ['user-8'],
              '🤔': ['user-1', 'user-2']
            }
          }
        ]
      },
      {
        id: 'post-4',
        userId: 'user-7',
        userName: 'Larry McCaigue',
        userAvatar: '⭐',
        teamName: 'Cosmic Crushers',
        message: 'Anyone else notice how quiet @David Jarvey has been since his team started tanking? 🤐📉',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        type: 'callout',
        targetUserId: 'user-9',
        targetUserName: 'David Jarvey',
        reactions: {
          '👀': ['user-1', 'user-2', 'user-3', 'user-5'],
          '💀': ['user-6', 'user-8'],
          '🔥': ['user-10']
        },
        replies: []
      },
      {
        id: 'post-5',
        userId: 'user-10',
        userName: 'Nick Hartley',
        userAvatar: '🎮',
        teamName: 'Digital Destroyers',
        message: 'Me watching everyone fight while I quietly climb the standings 🍿👀 #UnderTheRadar',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        type: 'meme',
        reactions: {
          '😂': ['user-1', 'user-2', 'user-4', 'user-6'],
          '🎯': ['user-3', 'user-5'],
          '🤫': ['user-7', 'user-8']
        },
        replies: []
      }
    ];
  }, []);

  const filteredPosts = useMemo(() => {
    if (filterType === 'all') return trashTalkPosts;
    return trashTalkPosts.filter((post: any) => post.type === filterType);
  }, [trashTalkPosts, filterType]);

  const handlePostSubmit = () => {
    if (!newPost.trim() || !currentUser) return;

    const post: TrashTalkPost = {
      id: `post-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      teamName: league?.teams?.find((t: any) => t.owner.id === currentUser.id)?.name || 'Unknown Team',
      message: newPost.trim(),
      timestamp: new Date(),
      type: postType,
      targetUserId: targetUser || undefined,
      targetUserName: targetUser ? league?.teams?.find((t: any) => t.id === targetUser)?.owner.name : undefined,
      reactions: {},
      replies: []
    };


    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        message: 'Trash talk posted! 🔥',
        type: 'SUCCESS'
      }
    });

    setNewPost('');
    setPostType('general');
    setTargetUser('');
  };

  const handleReply = (postId: string) => {
    if (!replyText.trim() || !currentUser) return;

    const reply: TrashTalkReply = {
      id: `reply-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      message: replyText.trim(),
      timestamp: new Date(),
      reactions: {}
    };


    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        message: 'Reply posted! 💬',
        type: 'SUCCESS'
      }
    });

    setReplyText('');
    setShowReplyInput(null);
  };

  const handleReaction = (postId: string, emoji: string, isReply = false, replyId?: string) => {
    if (!currentUser) return;


    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        message: 'Reaction added! 😊',
        type: 'INFO'
      }
    });
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'victory': return '🏆';
      case 'prediction': return '🔮';
      case 'callout': return '🎯';
      case 'meme': return '😂';
      default: return '💬';
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'victory': return 'border-yellow-500 bg-yellow-900/20';
      case 'prediction': return 'border-purple-500 bg-purple-900/20';
      case 'callout': return 'border-red-500 bg-red-900/20';
      case 'meme': return 'border-green-500 bg-green-900/20';
      default: return 'border-slate-600 bg-slate-700/50';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const reactionEmojis = ['🔥', '😂', '💀', '👀', '🍿', '💯', '🎯', '👑', '💪', '🤔'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Trash Talk Board</h2>
          <p className="text-slate-400">League banter and friendly competition</p>
        </div>
        
        <div className="text-right">
          <div className="text-white font-semibold">Keep it Fun!</div>
          <div className="text-sm text-slate-400">Moderated for good vibes</div>
        </div>
      </div>

      {/* Post Creation */}
      <div className="card">
        <h3 className="text-lg font-bold text-white mb-4">🔥 Drop Some Heat</h3>
        
        <div className="space-y-4">
          {/* Post Type Selection */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'general', label: 'General', icon: '💬' },
              { id: 'victory', label: 'Victory Lap', icon: '🏆' },
              { id: 'prediction', label: 'Prediction', icon: '🔮' },
              { id: 'callout', label: 'Call Out', icon: '🎯' },
              { id: 'meme', label: 'Meme', icon: '😂' }
            ].map((type: any) => (
              <button
                key={type.id}
                onClick={() => setPostType(type.id as any)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  postType === type.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {type.icon} {type.label}
              </button>
            ))}
          </div>

          {/* Target User (for callouts) */}
          {postType === 'callout' && (
            <select
              value={targetUser}
              onChange={(e: any) => setTargetUser(e.target.value)}
              className="form-input"
            >
              <option value="">Select target (optional)</option>
              {league?.teams?.filter((t: any) => t.owner.id !== currentUser?.id).map((team: any) => (
                <option key={team.id} value={team.id}>
                  {team.owner.name} ({team.name})
                </option>
              ))}
            </select>
          )}

          {/* Message Input */}
          <textarea
            value={newPost}
            onChange={(e: any) => setNewPost(e.target.value)}
            placeholder="What's on your mind? Keep it spicy but respectful! 🌶️"
            className="form-input h-24 resize-none"
            maxLength={280}
          />

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">
              {280 - newPost.length} characters remaining
            </span>
            <button
              onClick={handlePostSubmit}
              disabled={!newPost.trim()}
              className="btn btn-primary"
            >
              🔥 Post Trash Talk
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-800/50 rounded-lg p-2">
        {[
          { id: 'all', label: 'All Posts', icon: '📋' },
          { id: 'general', label: 'General', icon: '💬' },
          { id: 'victory', label: 'Victory', icon: '🏆' },
          { id: 'prediction', label: 'Predictions', icon: '🔮' },
          { id: 'callout', label: 'Call Outs', icon: '🎯' },
          { id: 'meme', label: 'Memes', icon: '😂' }
        ].map((filter: any) => (
          <button
            key={filter.id}
            onClick={() => setFilterType(filter.id as any)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              filterType === filter.id
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            {filter.icon} {filter.label}
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`card ${getPostTypeColor(post.type)} ${
                post.isSticky ? 'ring-2 ring-yellow-500' : ''
              }`}
            >
              {/* Post Header */}
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">{post.userAvatar}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-semibold">{post.userName}</span>
                    <span className="text-slate-400 text-sm">({post.teamName})</span>
                    <span className="px-2 py-1 bg-slate-600 text-white text-xs rounded-full">
                      {getPostTypeIcon(post.type)} {post.type}
                    </span>
                    {post.isSticky && (
                      <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded-full">
                        📌 Pinned
                      </span>
                    )}
                  </div>
                  <span className="text-slate-400 text-sm">{formatTimestamp(post.timestamp)}</span>
                </div>
              </div>

              {/* Target User (for callouts) */}
              {post.targetUserName && (
                <div className="mb-3 p-2 bg-red-900/20 border border-red-600/30 rounded-lg">
                  <span className="text-red-400 text-sm">🎯 Calling out: @{post.targetUserName}</span>
                </div>
              )}

              {/* Post Message */}
              <p className="text-slate-300 mb-4 text-lg leading-relaxed">{post.message}</p>

              {/* Post Reactions */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1">
                  {Object.entries(post.reactions).map(([emoji, userIds]) => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(post.id, emoji)}
                      className={`px-2 py-1 rounded-full text-sm transition-colors ${
                        userIds.includes(currentUser?.id || '')
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                      }`}
                    >
                      {emoji} {userIds.length}
                    </button>
                  ))}
                </div>
                
                {/* Add Reaction Dropdown */}
                <div className="relative group">
                  <button className="text-slate-400 hover:text-white transition-colors px-2 py-1">
                    <span className="text-lg">😊+</span>
                  </button>
                  <div className="absolute bottom-full left-0 mb-2 hidden group-hover:flex bg-slate-800 rounded-lg p-2 gap-1 shadow-xl border border-slate-600 z-10">
                    {reactionEmojis.map((emoji: any) => (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(post.id, emoji)}
                        className="hover:bg-slate-700 p-1 rounded transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowReplyInput(showReplyInput === post.id ? null : post.id)}
                  className="text-slate-400 hover:text-white transition-colors px-2 py-1 text-sm"
                >
                  💬 Reply
                </button>
              </div>

              {/* Replies */}
              {post.replies.length > 0 && (
                <div className="space-y-3 pl-6 border-l-2 border-slate-600">
                  {post.replies.map((reply: any) => (
                    <div key={reply.id} className="p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{reply.userAvatar}</span>
                        <span className="text-white font-medium">{reply.userName}</span>
                        <span className="text-slate-400 text-sm">{formatTimestamp(reply.timestamp)}</span>
                      </div>
                      <p className="text-slate-300 mb-2">{reply.message}</p>
                      <div className="flex gap-1">
                        {Object.entries(reply.reactions).map(([emoji, userIds]) => (
                          <button
                            key={emoji}
                            onClick={() => handleReaction(post.id, emoji, true, reply.id)}
                            className={`px-2 py-1 rounded-full text-xs transition-colors ${
                              userIds.includes(currentUser?.id || '')
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                            }`}
                          >
                            {emoji} {userIds.length}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Input */}
              {showReplyInput === post.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-slate-600"
                >
                  <div className="flex gap-3">
                    <span className="text-lg">{currentUser?.avatar}</span>
                    <div className="flex-1">
                      <textarea
                        value={replyText}
                        onChange={(e: any) => setReplyText(e.target.value)}
                        placeholder="Fire back with a reply..."
                        className="form-input h-16 resize-none mb-2"
                        maxLength={200}
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">
                          {200 - replyText.length} characters
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowReplyInput(null)}
                            className="btn btn-secondary btn-sm"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleReply(post.id)}
                            disabled={!replyText.trim()}
                            className="btn btn-primary btn-sm"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Community Guidelines */}
      <div className="card">
        <h4 className="text-lg font-bold text-white mb-3">🛡️ Community Guidelines</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="text-green-400 font-semibold mb-2">✅ Encouraged</h5>
            <ul className="text-slate-400 space-y-1">
              <li>• Friendly competition and banter</li>
              <li>• Creative trash talk and memes</li>
              <li>• Victory celebrations (within reason)</li>
              <li>• Predictions and bold claims</li>
              <li>• Good-natured ribbing</li>
            </ul>
          </div>
          <div>
            <h5 className="text-red-400 font-semibold mb-2">❌ Not Allowed</h5>
            <ul className="text-slate-400 space-y-1">
              <li>• Personal attacks or harassment</li>
              <li>• Offensive language or slurs</li>
              <li>• Real-life threats or doxxing</li>
              <li>• Spam or excessive posting</li>
              <li>• Anything that crosses the line</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-600/30 rounded-lg">
          <p className="text-blue-300 text-sm">
            <strong>Remember:</strong> This is all in good fun! Keep it competitive but respectful. 
            The commissioner reserves the right to moderate content that goes too far.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrashTalkBoard;