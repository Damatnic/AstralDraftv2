/**
 * Real-Time Social Hooks
 * React hooks for social features with real-time updates
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { realTimeSocialService } from '../services/realTimeSocialService';

interface SocialNotification {
  id: string;
  type: 'league_invite' | 'prediction_result' | 'debate_update' | 'member_joined' | 'oracle_prediction' | 'live_reaction';
  title: string;
  message: string;
  userId: string;
  entityId?: string;
  data?: any;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface LiveReaction {
  id: string;
  userId: string;
  username: string;
  entityType: 'prediction' | 'debate' | 'league';
  entityId: string;
  reaction: string;
  timestamp: Date;
}

interface PresenceInfo {
  userId: string;
  username: string;
  isOnline: boolean;
  lastSeen: Date;
  currentActivity?: {
    type: 'viewing_prediction' | 'in_debate' | 'browsing_leagues';
    entityId?: string;
  };
}

interface SocialActivity {
  id: string;
  type: 'user_joined' | 'prediction_submitted' | 'debate_started' | 'league_created' | 'milestone_reached';
  userId: string;
  username: string;
  description: string;
  entityId?: string;
  timestamp: Date;
  data?: any;
}

/**
 * Hook for user notifications
 */
export function useSocialNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<SocialNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const subscriptionId = useRef<string | null>(null);

  const markAsRead = useCallback((notificationId: string) => {
    if (userId) {
      realTimeSocialService.markNotificationRead(userId, notificationId);
    }
  }, [userId]);

  const markAllAsRead = useCallback(() => {
    if (userId) {
      realTimeSocialService.markAllNotificationsRead(userId);
    }
  }, [userId]);

  const requestPermission = useCallback(async () => {
    return await realTimeSocialService.requestNotificationPermission();
  }, []);

  useEffect(() => {
    if (userId) {
      subscriptionId.current = realTimeSocialService.subscribeToNotifications(
        userId,
        (newNotifications) => {
          setNotifications(newNotifications);
          setUnreadCount(realTimeSocialService.getUnreadCount(userId));
        }
      );
    }

    return () => {
      if (subscriptionId.current) {
        realTimeSocialService.unsubscribe(subscriptionId.current);
      }
    };
  }, [userId]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    requestPermission
  };
}

/**
 * Hook for live reactions on an entity
 */
export function useLiveReactions(
  entityType: 'prediction' | 'debate' | 'league',
  entityId: string,
  currentUserId?: string,
  currentUsername?: string
) {
  const [reactions, setReactions] = useState<LiveReaction[]>([]);
  const subscriptionId = useRef<string | null>(null);

  const sendReaction = useCallback(async (reaction: string) => {
    if (currentUserId && currentUsername) {
      await realTimeSocialService.sendReaction(
        currentUserId,
        currentUsername,
        entityType,
        entityId,
        reaction
      );
    }
  }, [currentUserId, currentUsername, entityType, entityId]);

  const getReactionCounts = useCallback(() => {
    const counts: { [key: string]: number } = {};
    reactions.forEach(reaction => {
      counts[reaction.reaction] = (counts[reaction.reaction] || 0) + 1;
    });
    return counts;
  }, [reactions]);

  const getUserReaction = useCallback(() => {
    if (!currentUserId) return null;
    const userReaction = reactions.find(r => r.userId === currentUserId);
    return userReaction?.reaction || null;
  }, [reactions, currentUserId]);

  useEffect(() => {
    if (entityType && entityId) {
      subscriptionId.current = realTimeSocialService.subscribeToReactions(
        entityType,
        entityId,
        setReactions
      );
    }

    return () => {
      if (subscriptionId.current) {
        realTimeSocialService.unsubscribe(subscriptionId.current);
      }
    };
  }, [entityType, entityId]);

  return {
    reactions,
    sendReaction,
    getReactionCounts,
    getUserReaction
  };
}

/**
 * Hook for user presence
 */
export function useUserPresence(currentUserId?: string, currentUsername?: string) {
  const [activeUsers, setActiveUsers] = useState<PresenceInfo[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const subscriptionId = useRef<string | null>(null);

  const updateActivity = useCallback((activity: any) => {
    if (currentUserId && currentUsername) {
      realTimeSocialService.updatePresence(currentUserId, currentUsername, activity);
    }
  }, [currentUserId, currentUsername]);

  const setOffline = useCallback(() => {
    if (currentUserId && currentUsername) {
      realTimeSocialService.updatePresence(currentUserId, currentUsername);
    }
  }, [currentUserId, currentUsername]);

  useEffect(() => {
    subscriptionId.current = realTimeSocialService.subscribeToPresence((users) => {
      setActiveUsers(users);
      setOnlineCount(users.filter(u => u.isOnline).length);
    });

    // Update presence on mount
    if (currentUserId && currentUsername) {
      realTimeSocialService.updatePresence(currentUserId, currentUsername);
    }

    // Update presence periodically
    const presenceInterval = setInterval(() => {
      if (currentUserId && currentUsername) {
        realTimeSocialService.updatePresence(currentUserId, currentUsername);
      }
    }, 60000); // Every minute

    // Set offline on unmount
    return () => {
      if (subscriptionId.current) {
        realTimeSocialService.unsubscribe(subscriptionId.current);
      }
      clearInterval(presenceInterval);
      setOffline();
    };
  }, [currentUserId, currentUsername, setOffline]);

  return {
    activeUsers,
    onlineCount,
    updateActivity
  };
}

/**
 * Hook for social activity feed
 */
export function useSocialActivity() {
  const [activities, setActivities] = useState<SocialActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const subscriptionId = useRef<string | null>(null);

  const refresh = useCallback(() => {
    const recentActivities = realTimeSocialService.getRecentActivity(20);
    setActivities(recentActivities);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    subscriptionId.current = realTimeSocialService.subscribeToActivity((newActivities) => {
      setActivities(newActivities);
      setIsLoading(false);
    });

    // Initial load
    refresh();

    return () => {
      if (subscriptionId.current) {
        realTimeSocialService.unsubscribe(subscriptionId.current);
      }
    };
  }, [refresh]);

  return {
    activities,
    isLoading,
    refresh
  };
}

/**
 * Hook for creating notifications
 */
export function useCreateNotification() {
  const createNotification = useCallback(async (
    type: SocialNotification['type'],
    title: string,
    message: string,
    userId: string,
    options?: {
      entityId?: string;
      data?: any;
      priority?: 'low' | 'medium' | 'high';
    }
  ) => {
    await realTimeSocialService.createNotification({
      type,
      title,
      message,
      userId,
      entityId: options?.entityId,
      data: options?.data,
      priority: options?.priority || 'medium'
    });
  }, []);

  return { createNotification };
}

/**
 * Hook for comprehensive social stats
 */
export function useSocialStats() {
  const [stats, setStats] = useState({
    totalNotifications: 0,
    unreadNotifications: 0,
    onlineUsers: 0,
    recentActivityCount: 0
  });

  const { notifications, unreadCount } = useSocialNotifications();
  const { onlineCount } = useUserPresence();
  const { activities } = useSocialActivity();

  useEffect(() => {
    setStats({
      totalNotifications: notifications.length,
      unreadNotifications: unreadCount,
      onlineUsers: onlineCount,
      recentActivityCount: activities.length
    });
  }, [notifications.length, unreadCount, onlineCount, activities.length]);

  return stats;
}