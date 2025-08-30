/**
 * League Memory & Photo Sharing System - Capture and share legendary moments
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Image, Heart, MessageCircle, Trophy, Calendar, Users, Star, Upload, Filter } from 'lucide-react';

interface LeagueMemory {
  id: string;
  type: 'photo' | 'video' | 'meme' | 'celebration' | 'draft_moment';
  title: string;
  description: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  uploadedBy: {
    userId: string;
    userName: string;
    teamName: string;
  };
  uploadedAt: Date;
  tags: string[];
  week?: number;
  season: number;
  likes: Array<{
    userId: string;
    userName: string;
  }>;
  comments: Array<{
    id: string;
    userId: string;
    userName: string;
    comment: string;
    timestamp: Date;
  }>;
  featured: boolean;
  category: 'draft' | 'game_day' | 'celebration' | 'trash_talk' | 'general';
}

interface LeagueMemorySystemProps {
  leagueId: string;
  userId: string;
  userName: string;
  onUpload?: (memory: Omit<LeagueMemory, 'id' | 'uploadedAt' | 'likes' | 'comments'>) => void;
}

const LeagueMemorySystem: React.FC<LeagueMemorySystemProps> = ({
  leagueId,
  userId,
  userName,
  onUpload
}) => {
  const [memories, setMemories] = useState<LeagueMemory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | LeagueMemory['category']>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<LeagueMemory | null>(null);
  const [newComment, setNewComment] = useState('');

  // Generate mock memories for demonstration
  const generateMockMemories = (): LeagueMemory[] => {
    const mockMemories: LeagueMemory[] = [
      {
        id: '1',
        type: 'photo',
        title: 'Draft Day Domination',
        description: 'The moment Mike secured CMC with the first pick! Look at that smile of confidence.',
        mediaUrl: '/memories/draft-day-1.jpg',
        uploadedBy: {
          userId: 'user1',
          userName: 'Sarah Chen',
          teamName: 'Gridiron Gladiators'
        },
        uploadedAt: new Date('2024-08-25'),
        tags: ['draft', 'first-pick', 'cmc', 'confidence'],
        season: 2024,
        likes: [
          { userId: 'user2', userName: 'Alex Rodriguez' },
          { userId: 'user3', userName: 'Jordan Smith' }
        ],
        comments: [
          {
            id: 'c1',
            userId: 'user2',
            userName: 'Alex Rodriguez',
            comment: 'That pick is going to haunt you! 😂',
            timestamp: new Date('2024-08-25T14:30:00')
          }
        ],
        featured: true,
        category: 'draft'
      },
      {
        id: '2',
        type: 'meme',
        title: 'When you realize you left 40 points on the bench',
        description: 'Taylor\'s face when they saw their bench outscored their starting lineup',
        mediaUrl: '/memories/bench-meme.jpg',
        uploadedBy: {
          userId: 'user4',
          userName: 'Casey Wilson',
          teamName: 'Touchdown Titans'
        },
        uploadedAt: new Date('2024-09-15'),
        tags: ['bench', 'lineup-mistakes', 'funny', 'relatable'],
        week: 2,
        season: 2024,
        likes: [
          { userId: 'user1', userName: 'Mike Johnson' },
          { userId: 'user5', userName: 'Morgan Davis' },
          { userId: 'user6', userName: 'Riley Martinez' }
        ],
        comments: [
          {
            id: 'c2',
            userId: 'user5',
            userName: 'Taylor Brown',
            comment: 'Why would you do me like this? 😭',
            timestamp: new Date('2024-09-15T20:15:00')
          },
          {
            id: 'c3',
            userId: 'user1',
            userName: 'Mike Johnson',
            comment: 'We\'ve all been there! Classic fantasy football pain',
            timestamp: new Date('2024-09-15T20:45:00')
          }
        ],
        featured: false,
        category: 'general'
      },
      {
        id: '3',
        type: 'celebration',
        title: 'Championship Celebration 2023',
        description: 'The moment Quinn lifted the trophy after an incredible comeback season!',
        mediaUrl: '/memories/championship-2023.jpg',
        uploadedBy: {
          userId: 'user10',
          userName: 'Quinn Anderson',
          teamName: 'Draft Day Demons'
        },
        uploadedAt: new Date('2023-12-20'),
        tags: ['championship', 'trophy', 'celebration', 'comeback', '2023'],
        season: 2023,
        likes: [
          { userId: 'user1', userName: 'Mike Johnson' },
          { userId: 'user2', userName: 'Sarah Chen' },
          { userId: 'user3', userName: 'Alex Rodriguez' },
          { userId: 'user4', userName: 'Jordan Smith' }
        ],
        comments: [
          {
            id: 'c4',
            userId: 'user2',
            userName: 'Sarah Chen',
            comment: 'Well deserved! What a season!',
            timestamp: new Date('2023-12-20T22:30:00')
          }
        ],
        featured: true,
        category: 'celebration'
      },
      {
        id: '4',
        type: 'photo',
        title: 'Live Draft Board 2024',
        description: 'Our beautiful physical draft board in action. Nothing beats the in-person draft experience!',
        mediaUrl: '/memories/draft-board-2024.jpg',
        uploadedBy: {
          userId: 'user7',
          userName: 'Morgan Davis',
          teamName: 'Victory Vampires'
        },
        uploadedAt: new Date('2024-08-25'),
        tags: ['draft', 'in-person', 'draft-board', 'tradition'],
        season: 2024,
        likes: [
          { userId: 'user8', userName: 'Riley Martinez' },
          { userId: 'user9', userName: 'Avery Thompson' }
        ],
        comments: [],
        featured: false,
        category: 'draft'
      }
    ];

    return mockMemories;
  };

  const [allMemories] = useState<LeagueMemory[]>(generateMockMemories());

  useEffect(() => {
    const filtered = selectedCategory === 'all' 
      ? allMemories 
      : allMemories.filter(m => m.category === selectedCategory);
    setMemories(filtered);
  }, [selectedCategory, allMemories]);

  const handleLike = (memoryId: string) => {
    setMemories(prev => prev.map(memory => {
      if (memory.id === memoryId) {
        const isLiked = memory.likes.some(like => like.userId === userId);
        return {
          ...memory,
          likes: isLiked
            ? memory.likes.filter(like => like.userId !== userId)
            : [...memory.likes, { userId, userName }]
        };
      }
      return memory;
    }));
  };

  const handleComment = (memoryId: string, comment: string) => {
    if (!comment.trim()) return;

    setMemories(prev => prev.map(memory => {
      if (memory.id === memoryId) {
        return {
          ...memory,
          comments: [...memory.comments, {
            id: `c${Date.now()}`,
            userId,
            userName,
            comment: comment.trim(),
            timestamp: new Date()
          }]
        };
      }
      return memory;
    }));

    setNewComment('');
  };

  const getTypeIcon = (type: LeagueMemory['type']) => {
    switch (type) {
      case 'photo': return <Image className="w-4 h-4" />;
      case 'meme': return <Star className="w-4 h-4" />;
      case 'celebration': return <Trophy className="w-4 h-4" />;
      case 'video': return <Camera className="w-4 h-4" />;
      default: return <Image className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: LeagueMemory['category']) => {
    switch (category) {
      case 'draft': return 'text-purple-400 bg-purple-500/20';
      case 'game_day': return 'text-green-400 bg-green-500/20';
      case 'celebration': return 'text-yellow-400 bg-yellow-500/20';
      case 'trash_talk': return 'text-red-400 bg-red-500/20';
      default: return 'text-blue-400 bg-blue-500/20';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="bg-dark-800 rounded-xl p-6 border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Camera className="w-6 h-6 text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">League Memory Bank</h2>
            <p className="text-gray-400">Capture and share the best moments</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {(['all', 'draft', 'game_day', 'celebration', 'trash_talk', 'general'] as const).map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-dark-700 text-gray-400 hover:text-white hover:bg-dark-600'
                }`}
              >
                {category === 'all' ? 'All' : category.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Memory
          </button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-400">
          {memories.length} memories found
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-dark-700 text-gray-400 hover:text-white'
            }`}
          >
            <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
            </div>
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'timeline' ? 'bg-primary-600 text-white' : 'bg-dark-700 text-gray-400 hover:text-white'
            }`}
          >
            <div className="w-4 h-4 flex flex-col gap-0.5">
              <div className="bg-current h-1 rounded-sm"></div>
              <div className="bg-current h-1 rounded-sm"></div>
              <div className="bg-current h-1 rounded-sm"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Memories Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memories.map(memory => (
            <motion.div
              key={memory.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`bg-dark-700 rounded-lg overflow-hidden border ${
                memory.featured ? 'border-gold-500' : 'border-gray-600'
              } hover:border-primary-500/50 transition-all cursor-pointer`}
              onClick={() => setSelectedMemory(memory)}
            >
              {/* Featured Badge */}
              {memory.featured && (
                <div className="absolute top-2 left-2 z-10 bg-gold-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                  ⭐ FEATURED
                </div>
              )}

              {/* Media Preview */}
              <div className="aspect-video bg-dark-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl opacity-20">
                    {memory.type === 'photo' ? '📷' : 
                     memory.type === 'meme' ? '😂' : 
                     memory.type === 'celebration' ? '🏆' : '🎥'}
                  </div>
                </div>
                
                {/* Type Badge */}
                <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-black/60 px-2 py-1 rounded-full text-xs text-white">
                  {getTypeIcon(memory.type)}
                  {memory.type.toUpperCase()}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-white text-sm">{memory.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${getCategoryColor(memory.category)}`}>
                    {memory.category.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                <p className="text-gray-300 text-xs mb-3 line-clamp-2">{memory.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {memory.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-dark-600 text-gray-400 text-xs rounded">
                      #{tag}
                    </span>
                  ))}
                  {memory.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{memory.tags.length - 3} more</span>
                  )}
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <span>{memory.uploadedBy.userName}</span>
                    {memory.week && <span>• Week {memory.week}</span>}
                  </div>
                  <span>{formatTimeAgo(memory.uploadedAt)}</span>
                </div>

                {/* Engagement */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-600">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(memory.id);
                      }}
                      className={`flex items-center gap-1 text-xs transition-colors ${
                        memory.likes.some(like => like.userId === userId)
                          ? 'text-red-400 hover:text-red-300'
                          : 'text-gray-500 hover:text-red-400'
                      }`}
                    >
                      <Heart className={`w-3 h-3 ${
                        memory.likes.some(like => like.userId === userId) ? 'fill-current' : ''
                      }`} />
                      {memory.likes.length}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMemory(memory);
                      }}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-400 transition-colors"
                    >
                      <MessageCircle className="w-3 h-3" />
                      {memory.comments.length}
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">{memory.season}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        // Timeline View
        <div className="space-y-6">
          {memories.map(memory => (
            <motion.div
              key={memory.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-4 p-4 bg-dark-700 rounded-lg border border-gray-600"
            >
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-dark-600 rounded-lg flex items-center justify-center">
                  <div className="text-2xl">
                    {memory.type === 'photo' ? '📷' : 
                     memory.type === 'meme' ? '😂' : 
                     memory.type === 'celebration' ? '🏆' : '🎥'}
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-white">{memory.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>{memory.uploadedBy.userName}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(memory.uploadedAt)}</span>
                      {memory.week && (
                        <>
                          <span>•</span>
                          <span>Week {memory.week}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(memory.category)}`}>
                    {memory.category.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                <p className="text-gray-300 mb-3">{memory.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {memory.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-dark-600 text-gray-400 text-xs rounded">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Engagement */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(memory.id)}
                    className={`flex items-center gap-1 text-sm transition-colors ${
                      memory.likes.some(like => like.userId === userId)
                        ? 'text-red-400 hover:text-red-300'
                        : 'text-gray-500 hover:text-red-400'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${
                      memory.likes.some(like => like.userId === userId) ? 'fill-current' : ''
                    }`} />
                    {memory.likes.length} likes
                  </button>
                  <button
                    onClick={() => setSelectedMemory(memory)}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-400 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {memory.comments.length} comments
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Memory Detail Modal */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1100] p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">{selectedMemory.title}</h2>
                  <button
                    onClick={() => setSelectedMemory(null)}
                    className="text-gray-400 hover:text-white text-xl"
                  >
                    ✕
                  </button>
                </div>

                {/* Media Display */}
                <div className="aspect-video bg-dark-700 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-8xl opacity-50">
                    {selectedMemory.type === 'photo' ? '📷' : 
                     selectedMemory.type === 'meme' ? '😂' : 
                     selectedMemory.type === 'celebration' ? '🏆' : '🎥'}
                  </div>
                </div>

                <p className="text-gray-300 mb-4">{selectedMemory.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedMemory.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-primary-600/20 text-primary-300 text-sm rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Engagement */}
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-700">
                  <button
                    onClick={() => handleLike(selectedMemory.id)}
                    className={`flex items-center gap-2 transition-colors ${
                      selectedMemory.likes.some(like => like.userId === userId)
                        ? 'text-red-400 hover:text-red-300'
                        : 'text-gray-500 hover:text-red-400'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${
                      selectedMemory.likes.some(like => like.userId === userId) ? 'fill-current' : ''
                    }`} />
                    {selectedMemory.likes.length} likes
                  </button>
                  <span className="text-gray-500">{selectedMemory.comments.length} comments</span>
                </div>

                {/* Comments */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-white">Comments</h3>
                  
                  {selectedMemory.comments.map(comment => (
                    <div key={comment.id} className="p-3 bg-dark-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-white text-sm">{comment.userName}</span>
                        <span className="text-xs text-gray-500">{formatTimeAgo(comment.timestamp)}</span>
                      </div>
                      <p className="text-gray-300 text-sm">{comment.comment}</p>
                    </div>
                  ))}

                  {/* Add Comment */}
                  <div className="flex gap-3">
                    <input
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 bg-dark-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleComment(selectedMemory.id, newComment);
                        }
                      }}
                    />
                    <button
                      onClick={() => handleComment(selectedMemory.id, newComment)}
                      disabled={!newComment.trim()}
                      className="bg-primary-600 hover:bg-primary-500 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1100] p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-800 rounded-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Upload Memory</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    placeholder="Give your memory a title..."
                    className="w-full bg-dark-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    placeholder="Tell the story behind this moment..."
                    className="w-full bg-dark-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select className="w-full bg-dark-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                    <option value="general">General</option>
                    <option value="draft">Draft</option>
                    <option value="game_day">Game Day</option>
                    <option value="celebration">Celebration</option>
                    <option value="trash_talk">Trash Talk</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Upload File</label>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <div className="text-gray-400 text-sm">
                      Drop your photo/video here or click to browse
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 bg-primary-600 hover:bg-primary-500 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Upload Memory
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LeagueMemorySystem;