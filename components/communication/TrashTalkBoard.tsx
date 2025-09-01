/**
 * Trash Talk Board Component
 * League banter and friendly competition
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useState, useMemo } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;

interface TrashTalkPost {
}
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  teamName: string;
  message: string;
  timestamp: Date;
  type: &apos;general&apos; | &apos;victory&apos; | &apos;prediction&apos; | &apos;callout&apos; | &apos;meme&apos;;
  targetUserId?: string;
  targetUserName?: string;
  reactions: {
}
    [emoji: string]: string[]; // emoji: array of user IDs
  };
  replies: TrashTalkReply[];
  isSticky?: boolean;
  moderatorNote?: string;

interface TrashTalkReply {
}
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  message: string;
  timestamp: Date;
  reactions: {
}
    [emoji: string]: string[];
  };

const TrashTalkBoard: React.FC = () => {
}
  const { state, dispatch } = useAppState();
  const [newPost, setNewPost] = useState(&apos;&apos;);
  const [postType, setPostType] = useState<&apos;general&apos; | &apos;victory&apos; | &apos;prediction&apos; | &apos;callout&apos; | &apos;meme&apos;>(&apos;general&apos;);
  const [targetUser, setTargetUser] = useState(&apos;&apos;);
  const [filterType, setFilterType] = useState<&apos;all&apos; | &apos;general&apos; | &apos;victory&apos; | &apos;prediction&apos; | &apos;callout&apos; | &apos;meme&apos;>(&apos;all&apos;);
  const [showReplyInput, setShowReplyInput] = useState<string | null>(null);
  const [replyText, setReplyText] = useState(&apos;&apos;);

  const currentUser = state.user;
  const league = state.leagues[0];

  // Simulate trash talk posts
  const trashTalkPosts = useMemo((): TrashTalkPost[] => {
}
    return [
      {
}
        id: &apos;post-1&apos;,
        userId: &apos;user-1&apos;,
        userName: &apos;Nick Damato&apos;,
        userAvatar: &apos;👑&apos;,
        teamName: &apos;Astral Aces&apos;,
        message: &apos;Just dropped 167 points this week! 🔥 Who said my draft was weak? Time to eat some crow! 🐦‍⬛&apos;,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        type: &apos;victory&apos;,
        reactions: {
}
          &apos;🔥&apos;: [&apos;user-2&apos;, &apos;user-3&apos;],
          &apos;👑&apos;: [&apos;user-4&apos;],
          &apos;😤&apos;: [&apos;user-5&apos;, &apos;user-6&apos;]
        },
        replies: [
          {
}
            id: &apos;reply-1&apos;,
            userId: &apos;user-2&apos;,
            userName: &apos;Jon Kornbeck&apos;,
            userAvatar: &apos;⚡&apos;,
            message: &apos;One good week doesn\&apos;t make a season, champ! 😏&apos;,
            timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
            reactions: {
}
              &apos;😂&apos;: [&apos;user-3&apos;, &apos;user-7&apos;],
              &apos;👀&apos;: [&apos;user-1&apos;]


        ],
        isSticky: true
      },
      {
}
        id: &apos;post-2&apos;,
        userId: &apos;user-3&apos;,
        userName: &apos;Cason Minor&apos;,
        userAvatar: &apos;🔥&apos;,
        teamName: &apos;Gridiron Giants&apos;,
        message: &apos;Calling it now: Thunder Bolts are going to choke in the playoffs. They always do! ⚡💥&apos;,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        type: &apos;prediction&apos;,
        targetUserId: &apos;user-2&apos;,
        targetUserName: &apos;Jon Kornbeck&apos;,
        reactions: {
}
          &apos;🍿&apos;: [&apos;user-1&apos;, &apos;user-4&apos;, &apos;user-8&apos;],
          &apos;😱&apos;: [&apos;user-2&apos;],
          &apos;🎯&apos;: [&apos;user-9&apos;]
        },
        replies: []
      },
      {
}
        id: &apos;post-3&apos;,
        userId: &apos;user-4&apos;,
        userName: &apos;Brittany Bergrum&apos;,
        userAvatar: &apos;💪&apos;,
        teamName: &apos;Storm Chasers&apos;,
        message: &apos;Y\&apos;all are fighting for second place while I\&apos;m over here building a dynasty! 💎👸&apos;,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        type: &apos;general&apos;,
        reactions: {
}
          &apos;💅&apos;: [&apos;user-5&apos;, &apos;user-8&apos;],
          &apos;🙄&apos;: [&apos;user-1&apos;, &apos;user-2&apos;, &apos;user-3&apos;],
          &apos;👸&apos;: [&apos;user-7&apos;]
        },
        replies: [
          {
}
            id: &apos;reply-2&apos;,
            userId: &apos;user-1&apos;,
            userName: &apos;Nick Damato&apos;,
            userAvatar: &apos;👑&apos;,
            message: &apos;Dynasty? You\&apos;re 4-4! 😂&apos;,
            timestamp: new Date(Date.now() - 5.5 * 60 * 60 * 1000),
            reactions: {
}
              &apos;💀&apos;: [&apos;user-2&apos;, &apos;user-3&apos;, &apos;user-6&apos;],
              &apos;🔥&apos;: [&apos;user-9&apos;]

          },
          {
}
            id: &apos;reply-3&apos;,
            userId: &apos;user-4&apos;,
            userName: &apos;Brittany Bergrum&apos;,
            userAvatar: &apos;💪&apos;,
            message: &apos;Quality over quantity, honey! My team is peaking at the right time 📈&apos;,
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
            reactions: {
}
              &apos;💯&apos;: [&apos;user-8&apos;],
              &apos;🤔&apos;: [&apos;user-1&apos;, &apos;user-2&apos;]

      },
      {
}
        id: &apos;post-4&apos;,
        userId: &apos;user-7&apos;,
        userName: &apos;Larry McCaigue&apos;,
        userAvatar: &apos;⭐&apos;,
        teamName: &apos;Cosmic Crushers&apos;,
        message: &apos;Anyone else notice how quiet @David Jarvey has been since his team started tanking? 🤐📉&apos;,
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        type: &apos;callout&apos;,
        targetUserId: &apos;user-9&apos;,
        targetUserName: &apos;David Jarvey&apos;,
        reactions: {
}
          &apos;👀&apos;: [&apos;user-1&apos;, &apos;user-2&apos;, &apos;user-3&apos;, &apos;user-5&apos;],
          &apos;💀&apos;: [&apos;user-6&apos;, &apos;user-8&apos;],
          &apos;🔥&apos;: [&apos;user-10&apos;]
        },
        replies: []
      },
      {
}
        id: &apos;post-5&apos;,
        userId: &apos;user-10&apos;,
        userName: &apos;Nick Hartley&apos;,
        userAvatar: &apos;🎮&apos;,
        teamName: &apos;Digital Destroyers&apos;,
        message: &apos;Me watching everyone fight while I quietly climb the standings 🍿👀 #UnderTheRadar&apos;,
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        type: &apos;meme&apos;,
        reactions: {
}
          &apos;😂&apos;: [&apos;user-1&apos;, &apos;user-2&apos;, &apos;user-4&apos;, &apos;user-6&apos;],
          &apos;🎯&apos;: [&apos;user-3&apos;, &apos;user-5&apos;],
          &apos;🤫&apos;: [&apos;user-7&apos;, &apos;user-8&apos;]
        },
        replies: []

    ];
  }, []);

  const filteredPosts = useMemo(() => {
}
    if (filterType === &apos;all&apos;) return trashTalkPosts;
    return trashTalkPosts.filter((post: any) => post.type === filterType);
  }, [trashTalkPosts, filterType]);

  const handlePostSubmit = () => {
}
    if (!newPost.trim() || !currentUser) return;

    const post: TrashTalkPost = {
}
      id: `post-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      teamName: league?.teams?.find((t: any) => t.owner.id === currentUser.id)?.name || &apos;Unknown Team&apos;,
      message: newPost.trim(),
      timestamp: new Date(),
      type: postType,
      targetUserId: targetUser || undefined,
      targetUserName: targetUser ? league?.teams?.find((t: any) => t.id === targetUser)?.owner.name : undefined,
      reactions: {},
      replies: []
    };

    dispatch({
}
      type: &apos;ADD_NOTIFICATION&apos;,
      payload: {
}
        message: &apos;Trash talk posted! 🔥&apos;,
        type: &apos;SUCCESS&apos;

    });

    setNewPost(&apos;&apos;);
    setPostType(&apos;general&apos;);
    setTargetUser(&apos;&apos;);
  };

  const handleReply = (postId: string) => {
}
    if (!replyText.trim() || !currentUser) return;

    const reply: TrashTalkReply = {
}
      id: `reply-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      message: replyText.trim(),
      timestamp: new Date(),
      reactions: {}
    };

    dispatch({
}
      type: &apos;ADD_NOTIFICATION&apos;,
      payload: {
}
        message: &apos;Reply posted! 💬&apos;,
        type: &apos;SUCCESS&apos;

    });

    setReplyText(&apos;&apos;);
    setShowReplyInput(null);
  };

  const handleReaction = (postId: string, emoji: string, isReply = false, replyId?: string) => {
}
    if (!currentUser) return;

    dispatch({
}
      type: &apos;ADD_NOTIFICATION&apos;,
      payload: {
}
        message: &apos;Reaction added! 😊&apos;,
        type: &apos;INFO&apos;

    });
  };

  const getPostTypeIcon = (type: string) => {
}
    switch (type) {
}
      case &apos;victory&apos;: return &apos;🏆&apos;;
      case &apos;prediction&apos;: return &apos;🔮&apos;;
      case &apos;callout&apos;: return &apos;🎯&apos;;
      case &apos;meme&apos;: return &apos;😂&apos;;
      default: return &apos;💬&apos;;

  };

  const getPostTypeColor = (type: string) => {
}
    switch (type) {
}
      case &apos;victory&apos;: return &apos;border-yellow-500 bg-yellow-900/20&apos;;
      case &apos;prediction&apos;: return &apos;border-purple-500 bg-purple-900/20&apos;;
      case &apos;callout&apos;: return &apos;border-red-500 bg-red-900/20&apos;;
      case &apos;meme&apos;: return &apos;border-green-500 bg-green-900/20&apos;;
      default: return &apos;border-slate-600 bg-slate-700/50&apos;;

  };

  const formatTimestamp = (timestamp: Date) => {
}
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return &apos;Just now&apos;;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const reactionEmojis = [&apos;🔥&apos;, &apos;😂&apos;, &apos;💀&apos;, &apos;👀&apos;, &apos;🍿&apos;, &apos;💯&apos;, &apos;🎯&apos;, &apos;👑&apos;, &apos;💪&apos;, &apos;🤔&apos;];

  return (
    <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
        <div>
          <h2 className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">Trash Talk Board</h2>
          <p className="text-slate-400 sm:px-4 md:px-6 lg:px-8">League banter and friendly competition</p>
        </div>
        
        <div className="text-right sm:px-4 md:px-6 lg:px-8">
          <div className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">Keep it Fun!</div>
          <div className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">Moderated for good vibes</div>
        </div>
      </div>

      {/* Post Creation */}
      <div className="card sm:px-4 md:px-6 lg:px-8">
        <h3 className="text-lg font-bold text-white mb-4 sm:px-4 md:px-6 lg:px-8">🔥 Drop Some Heat</h3>
        
        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
          {/* Post Type Selection */}
          <div className="flex flex-wrap gap-2 sm:px-4 md:px-6 lg:px-8">
            {[
}
              { id: &apos;general&apos;, label: &apos;General&apos;, icon: &apos;💬&apos; },
              { id: &apos;victory&apos;, label: &apos;Victory Lap&apos;, icon: &apos;🏆&apos; },
              { id: &apos;prediction&apos;, label: &apos;Prediction&apos;, icon: &apos;🔮&apos; },
              { id: &apos;callout&apos;, label: &apos;Call Out&apos;, icon: &apos;🎯&apos; },
              { id: &apos;meme&apos;, label: &apos;Meme&apos;, icon: &apos;😂&apos; }
            ].map((type: any) => (
              <button
                key={type.id}
                onClick={() => setPostType(type.id as any)}`}
              >
                {type.icon} {type.label}
              </button>
            ))}
          </div>

          {/* Target User (for callouts) */}
          {postType === &apos;callout&apos; && (
}
            <select
              value={targetUser}
              onChange={(e: any) => setTargetUser(e.target.value)}
            >
              <option value="">Select target (optional)</option>
              {league?.teams?.filter((t: any) => t.owner.id !== currentUser?.id).map((team: any) => (
}
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
            className="form-input h-24 resize-none sm:px-4 md:px-6 lg:px-8"
            maxLength={280}
          />

          <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
            <span className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">
              {280 - newPost.length} characters remaining
            </span>
            <button
              onClick={handlePostSubmit}
              disabled={!newPost.trim()}
              className="btn btn-primary sm:px-4 md:px-6 lg:px-8"
             aria-label="Action button">
              🔥 Post Trash Talk
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-800/50 rounded-lg p-2 sm:px-4 md:px-6 lg:px-8">
        {[
}
          { id: &apos;all&apos;, label: &apos;All Posts&apos;, icon: &apos;📋&apos; },
          { id: &apos;general&apos;, label: &apos;General&apos;, icon: &apos;💬&apos; },
          { id: &apos;victory&apos;, label: &apos;Victory&apos;, icon: &apos;🏆&apos; },
          { id: &apos;prediction&apos;, label: &apos;Predictions&apos;, icon: &apos;🔮&apos; },
          { id: &apos;callout&apos;, label: &apos;Call Outs&apos;, icon: &apos;🎯&apos; },
          { id: &apos;meme&apos;, label: &apos;Memes&apos;, icon: &apos;😂&apos; }
        ].map((filter: any) => (
          <button
            key={filter.id}
            onClick={() => setFilterType(filter.id as any)}`}
          >
            {filter.icon} {filter.label}
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
        <AnimatePresence>
          {filteredPosts.map((post, index) => (
}
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`card ${getPostTypeColor(post.type)} ${
}
                post.isSticky ? &apos;ring-2 ring-yellow-500&apos; : &apos;&apos;
              }`}
            >
              {/* Post Header */}
              <div className="flex items-start gap-3 mb-3 sm:px-4 md:px-6 lg:px-8">
                <span className="text-2xl sm:px-4 md:px-6 lg:px-8">{post.userAvatar}</span>
                <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                  <div className="flex items-center gap-2 mb-1 sm:px-4 md:px-6 lg:px-8">
                    <span className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">{post.userName}</span>
                    <span className="text-slate-400 text-sm sm:px-4 md:px-6 lg:px-8">({post.teamName})</span>
                    <span className="px-2 py-1 bg-slate-600 text-white text-xs rounded-full sm:px-4 md:px-6 lg:px-8">
                      {getPostTypeIcon(post.type)} {post.type}
                    </span>
                    {post.isSticky && (
}
                      <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded-full sm:px-4 md:px-6 lg:px-8">
                        📌 Pinned
                      </span>
                    )}
                  </div>
                  <span className="text-slate-400 text-sm sm:px-4 md:px-6 lg:px-8">{formatTimestamp(post.timestamp)}</span>
                </div>
              </div>

              {/* Target User (for callouts) */}
              {post.targetUserName && (
}
                <div className="mb-3 p-2 bg-red-900/20 border border-red-600/30 rounded-lg sm:px-4 md:px-6 lg:px-8">
                  <span className="text-red-400 text-sm sm:px-4 md:px-6 lg:px-8">🎯 Calling out: @{post.targetUserName}</span>
                </div>
              )}

              {/* Post Message */}
              <p className="text-slate-300 mb-4 text-lg leading-relaxed sm:px-4 md:px-6 lg:px-8">{post.message}</p>

              {/* Post Reactions */}
              <div className="flex items-center gap-2 mb-4 sm:px-4 md:px-6 lg:px-8">
                <div className="flex gap-1 sm:px-4 md:px-6 lg:px-8">
                  {Object.entries(post.reactions).map(([emoji, userIds]) => (
}
                    <button
                      key={emoji}
                      onClick={() => handleReaction(post.id, emoji)}`}
                    >
                      {emoji} {userIds.length}
                    </button>
                  ))}
                </div>
                
                {/* Add Reaction Dropdown */}
                <div className="relative group sm:px-4 md:px-6 lg:px-8">
                  <button className="text-slate-400 hover:text-white transition-colors px-2 py-1 sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                    <span className="text-lg sm:px-4 md:px-6 lg:px-8">😊+</span>
                  </button>
                  <div className="absolute bottom-full left-0 mb-2 hidden group-hover:flex bg-slate-800 rounded-lg p-2 gap-1 shadow-xl border border-slate-600 z-10 sm:px-4 md:px-6 lg:px-8">
                    {reactionEmojis.map((emoji: any) => (
}
                      <button
                        key={emoji}
                        onClick={() => handleReaction(post.id, emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowReplyInput(showReplyInput === post.id ? null : post.id)}
                >
                  💬 Reply
                </button>
              </div>

              {/* Replies */}
              {post.replies.length > 0 && (
}
                <div className="space-y-3 pl-6 border-l-2 border-slate-600 sm:px-4 md:px-6 lg:px-8">
                  {post.replies.map((reply: any) => (
}
                    <div key={reply.id} className="p-3 bg-slate-800/50 rounded-lg sm:px-4 md:px-6 lg:px-8">
                      <div className="flex items-center gap-2 mb-2 sm:px-4 md:px-6 lg:px-8">
                        <span className="text-lg sm:px-4 md:px-6 lg:px-8">{reply.userAvatar}</span>
                        <span className="text-white font-medium sm:px-4 md:px-6 lg:px-8">{reply.userName}</span>
                        <span className="text-slate-400 text-sm sm:px-4 md:px-6 lg:px-8">{formatTimestamp(reply.timestamp)}</span>
                      </div>
                      <p className="text-slate-300 mb-2 sm:px-4 md:px-6 lg:px-8">{reply.message}</p>
                      <div className="flex gap-1 sm:px-4 md:px-6 lg:px-8">
                        {Object.entries(reply.reactions).map(([emoji, userIds]) => (
}
                          <button
                            key={emoji}
                            onClick={() => handleReaction(post.id, emoji, true, reply.id)}`}
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
}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: &apos;auto&apos; }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-slate-600 sm:px-4 md:px-6 lg:px-8"
                >
                  <div className="flex gap-3 sm:px-4 md:px-6 lg:px-8">
                    <span className="text-lg sm:px-4 md:px-6 lg:px-8">{currentUser?.avatar}</span>
                    <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                      <textarea
                        value={replyText}
                        onChange={(e: any) => setReplyText(e.target.value)}
                        className="form-input h-16 resize-none mb-2 sm:px-4 md:px-6 lg:px-8"
                        maxLength={200}
                      />
                      <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                        <span className="text-xs text-slate-400 sm:px-4 md:px-6 lg:px-8">
                          {200 - replyText.length} characters
                        </span>
                        <div className="flex gap-2 sm:px-4 md:px-6 lg:px-8">
                          <button
                            onClick={() => setShowReplyInput(null)}
                          >
//                             Cancel
                          </button>
                          <button
                            onClick={() => handleReply(post.id)}
                            className="btn btn-primary btn-sm sm:px-4 md:px-6 lg:px-8"
                          >
//                             Reply
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
      <div className="card sm:px-4 md:px-6 lg:px-8">
        <h4 className="text-lg font-bold text-white mb-3 sm:px-4 md:px-6 lg:px-8">🛡️ Community Guidelines</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="text-green-400 font-semibold mb-2 sm:px-4 md:px-6 lg:px-8">✅ Encouraged</h5>
            <ul className="text-slate-400 space-y-1 sm:px-4 md:px-6 lg:px-8">
              <li>• Friendly competition and banter</li>
              <li>• Creative trash talk and memes</li>
              <li>• Victory celebrations (within reason)</li>
              <li>• Predictions and bold claims</li>
              <li>• Good-natured ribbing</li>
            </ul>
          </div>
          <div>
            <h5 className="text-red-400 font-semibold mb-2 sm:px-4 md:px-6 lg:px-8">❌ Not Allowed</h5>
            <ul className="text-slate-400 space-y-1 sm:px-4 md:px-6 lg:px-8">
              <li>• Personal attacks or harassment</li>
              <li>• Offensive language or slurs</li>
              <li>• Real-life threats or doxxing</li>
              <li>• Spam or excessive posting</li>
              <li>• Anything that crosses the line</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-600/30 rounded-lg sm:px-4 md:px-6 lg:px-8">
          <p className="text-blue-300 text-sm sm:px-4 md:px-6 lg:px-8">
            <strong>Remember:</strong> This is all in good fun! Keep it competitive but respectful. 
            The commissioner reserves the right to moderate content that goes too far.
          </p>
        </div>
      </div>
    </div>
  );
};

const TrashTalkBoardWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <TrashTalkBoard {...props} />
  </ErrorBoundary>
);

export default React.memo(TrashTalkBoardWithErrorBoundary);