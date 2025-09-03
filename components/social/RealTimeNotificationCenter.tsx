/**
 * Real-Time Notification Center Component
 * Displays live social notifications and interactions
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocialNotifications, useUserPresence, useSocialActivity } from '../../hooks/useRealTimeSocial';
import { useAuth } from '../../contexts/SimpleAuthContext';
import { BellIcon } from '../icons/BellIcon';
import { XIcon } from '../icons/XIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { UsersIcon } from '../icons/UsersIcon';
import { ActivityIcon } from '../icons/ActivityIcon';

interface RealTimeNotificationCenterProps {
  className?: string;
}

const RealTimeNotificationCenter: React.FC<RealTimeNotificationCenterProps> = ({
  className = ''
}) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'notifications' | 'activity' | 'presence'>('notifications');

  // Real-time hooks
  const { notifications, unreadCount, markAsRead, markAllAsRead, requestPermission } = useSocialNotifications(user?.id);
  const { activeUsers, onlineCount } = useUserPresence(user?.id, user?.username);
  const { activities, isLoading: activitiesLoading } = useSocialActivity();

  // Request notification permission on mount
  useEffect(() => {
    if (user) {
      requestPermission();
    }
  }, [user, requestPermission]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'league_invite': return '🏆';
      case 'prediction_result': return '🎯';
      case 'debate_update': return '💬';
      case 'member_joined': return '👋';
      case 'oracle_prediction': return '🔮';
      case 'live_reaction': return '❤️';
      default: return '📢';
    }
  };

  const getNotificationColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-400 bg-red-500/5';
      case 'medium': return 'border-l-yellow-400 bg-yellow-500/5';
      case 'low': return 'border-l-blue-400 bg-blue-500/5';
      default: return 'border-l-gray-400 bg-gray-500/5';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (!user) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white transition-colors"
        aria-label="Notifications"
      >
        <BellIcon className="w-5 h-5" />
        
        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 top-12 w-96 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">Notifications</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded hover:bg-slate-700 text-gray-400 hover:text-white transition-colors"
                  aria-label="Close notifications"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`flex items-center gap-2 px-3 py-1 rounded text-sm font-medium transition-colors ${
                    activeTab === 'notifications'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <BellIcon className="w-4 h-4" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('activity')}
                  className={`flex items-center gap-2 px-3 py-1 rounded text-sm font-medium transition-colors ${
                    activeTab === 'activity'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <ActivityIcon className="w-4 h-4" />
                  Activity
                </button>

                <button
                  onClick={() => setActiveTab('presence')}
                  className={`flex items-center gap-2 px-3 py-1 rounded text-sm font-medium transition-colors ${
                    activeTab === 'presence'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <UsersIcon className="w-4 h-4" />
                  Online ({onlineCount})
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-80 overflow-y-auto">
              {activeTab === 'notifications' && (
                <div className="p-4">
                  {/* Mark All Read Button */}
                  {unreadCount > 0 && (
                    <div className="mb-3">
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        <CheckIcon className="w-3 h-3" />
                        Mark all as read
                      </button>
                    </div>
                  )}

                  {/* Notifications List */}
                  <div className="space-y-2">
                    {notifications.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <BellIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No notifications yet</p>
                        <p className="text-xs mt-1">You'll see updates here when they arrive</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-3 rounded-lg border-l-2 cursor-pointer transition-colors ${
                            getNotificationColor(notification.priority)
                          } ${
                            notification.read ? 'opacity-60' : 'hover:bg-slate-700/50'
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="text-sm font-medium text-white truncate">
                                    {notification.title}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {notification.message}
                                  </p>
                                </div>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1 flex-shrink-0"></div>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-2">
                                {formatTimeAgo(notification.timestamp)}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="p-4">
                  <div className="space-y-2">
                    {activitiesLoading ? (
                      <div className="text-center py-8 text-gray-500">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p>Loading activity...</p>
                      </div>
                    ) : activities.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <ActivityIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No recent activity</p>
                      </div>
                    ) : (
                      activities.map((activity) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                              {activity.username.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-white">
                                <span className="font-medium">{activity.username}</span>{' '}
                                {activity.description}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatTimeAgo(activity.timestamp)}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'presence' && (
                <div className="p-4">
                  <div className="space-y-2">
                    {activeUsers.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <UsersIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No users online</p>
                      </div>
                    ) : (
                      activeUsers.map((user) => (
                        <motion.div
                          key={user.userId}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/30 transition-colors"
                        >
                          <div className="relative">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                              {user.username.slice(0, 2).toUpperCase()}
                            </div>
                            <div
                              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-800 ${
                                user.isOnline ? 'bg-green-400' : 'bg-gray-400'
                              }`}
                            ></div>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">{user.username}</p>
                            <p className="text-xs text-gray-500">
                              {user.isOnline ? (
                                user.currentActivity ? (
                                  `${user.currentActivity.type.replace('_', ' ')}`
                                ) : (
                                  'Online'
                                )
                              ) : (
                                `Last seen ${formatTimeAgo(user.lastSeen)}`
                              )}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default RealTimeNotificationCenter;