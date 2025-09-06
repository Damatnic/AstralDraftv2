/**
 * Real-Time Social Service
 * Handles live social interactions, notifications, and community features
 */

import { enhancedSportsIOService } from './enhancedSportsIORealTimeService';
import { webSocketManager } from './webSocketManager';

interface SocialNotification {
  id: string;
  type: 'league_invite' | 'prediction_result' | 'debate_update' | 'member_joined' | 'oracle_prediction' | 'live_reaction';
  title: string;
  message: string;
  userId: string;
  entityId?: string; // League ID, Prediction ID, etc.
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

export class RealTimeSocialService {
  private notifications: Map<string, SocialNotification[]> = new Map();
  private activeUsers: Map<string, PresenceInfo> = new Map();
  private recentReactions: LiveReaction[] = [];
  private socialActivity: SocialActivity[] = [];
  private subscriptions: Map<string, any> = new Map();

  constructor() {
    this.initializeRealTimeConnection();
  }

  /**
   * Initialize WebSocket connection for social features
   */
  private async initializeRealTimeConnection(): Promise<void> {
    try {
      await webSocketManager.connect();
      this.setupSocialEventHandlers();
      console.log('🌐 Real-time social service connected');
    } catch (error) {
      console.error('❌ Failed to connect social service:', error);
    }
  }

  /**
   * Setup event handlers for social interactions
   */
  private setupSocialEventHandlers(): void {
    // User presence updates
    webSocketManager.subscribe('user_presence', (data) => {
      this.handlePresenceUpdate(data);
    });

    // Live reactions
    webSocketManager.subscribe('live_reaction', (data) => {
      this.handleLiveReaction(data);
    });

    // Social activity updates
    webSocketManager.subscribe('social_activity', (data) => {
      this.handleSocialActivity(data);
    });

    // League updates
    webSocketManager.subscribe('league_update', (data) => {
      this.handleLeagueUpdate(data);
    });

    // Prediction notifications
    webSocketManager.subscribe('prediction_notification', (data) => {
      this.handlePredictionNotification(data);
    });
  }

  /**
   * Subscribe to real-time notifications for a user
   */
  subscribeToNotifications(userId: string, callback: (notifications: SocialNotification[]) => void): string {
    const subscriptionId = `notifications_${userId}_${Date.now()}`;
    
    this.subscriptions.set(subscriptionId, {
      userId,
      callback,
      type: 'notifications'
    });

    // Send initial notifications
    const userNotifications = this.notifications.get(userId) || [];
    callback(userNotifications);

    return subscriptionId;
  }

  /**
   * Subscribe to live reactions for an entity
   */
  subscribeToReactions(entityType: string, entityId: string, callback: (reactions: LiveReaction[]) => void): string {
    const subscriptionId = `reactions_${entityType}_${entityId}_${Date.now()}`;
    
    this.subscriptions.set(subscriptionId, {
      entityType,
      entityId,
      callback,
      type: 'reactions'
    });

    // Send initial reactions
    const entityReactions = this.recentReactions
      .filter(r => r.entityType === entityType && r.entityId === entityId)
      .slice(-10);
    callback(entityReactions);

    return subscriptionId;
  }

  /**
   * Subscribe to user presence updates
   */
  subscribeToPresence(callback: (activeUsers: PresenceInfo[]) => void): string {
    const subscriptionId = `presence_${Date.now()}`;
    
    this.subscriptions.set(subscriptionId, {
      callback,
      type: 'presence'
    });

    // Send initial presence data
    callback(Array.from(this.activeUsers.values()));

    return subscriptionId;
  }

  /**
   * Subscribe to social activity feed
   */
  subscribeToActivity(callback: (activities: SocialActivity[]) => void): string {
    const subscriptionId = `activity_${Date.now()}`;
    
    this.subscriptions.set(subscriptionId, {
      callback,
      type: 'activity'
    });

    // Send initial activity data
    callback(this.socialActivity.slice(-20));

    return subscriptionId;
  }

  /**
   * Send a live reaction
   */
  async sendReaction(
    userId: string,
    username: string,
    entityType: 'prediction' | 'debate' | 'league',
    entityId: string,
    reaction: string
  ): Promise<void> {
    const liveReaction: LiveReaction = {
      id: `reaction_${Date.now()}_${Math.random()}`,
      userId,
      username,
      entityType,
      entityId,
      reaction,
      timestamp: new Date()
    };

    // Add to recent reactions
    this.recentReactions.unshift(liveReaction);
    this.recentReactions = this.recentReactions.slice(0, 100); // Keep only last 100

    // Broadcast to subscribers
    this.broadcastReactionUpdate(liveReaction);

    // Send to server
    await webSocketManager.send('live_reaction', liveReaction);
  }

  /**
   * Create a notification
   */
  async createNotification(notification: Omit<SocialNotification, 'id' | 'timestamp' | 'read'>): Promise<void> {
    const fullNotification: SocialNotification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random()}`,
      timestamp: new Date(),
      read: false
    };

    // Add to user's notifications
    const userNotifications = this.notifications.get(notification.userId) || [];
    userNotifications.unshift(fullNotification);
    this.notifications.set(notification.userId, userNotifications.slice(0, 50)); // Keep only last 50

    // Broadcast to subscribers
    this.broadcastNotificationUpdate(notification.userId);

    // Show browser notification if permission granted
    await this.showBrowserNotification(fullNotification);
  }

  /**
   * Mark notification as read
   */
  markNotificationRead(userId: string, notificationId: string): void {
    const userNotifications = this.notifications.get(userId) || [];
    const notification = userNotifications.find(n => n.id === notificationId);
    
    if (notification) {
      notification.read = true;
      this.broadcastNotificationUpdate(userId);
    }
  }

  /**
   * Mark all notifications as read
   */
  markAllNotificationsRead(userId: string): void {
    const userNotifications = this.notifications.get(userId) || [];
    userNotifications.forEach(n => n.read = true);
    this.broadcastNotificationUpdate(userId);
  }

  /**
   * Update user presence
   */
  updatePresence(userId: string, username: string, activity?: any): void {
    const presence: PresenceInfo = {
      userId,
      username,
      isOnline: true,
      lastSeen: new Date(),
      currentActivity: activity
    };

    this.activeUsers.set(userId, presence);
    this.broadcastPresenceUpdate();

    // Auto-expire presence after 5 minutes of inactivity
    setTimeout(() => {
      const currentPresence = this.activeUsers.get(userId);
      if (currentPresence && currentPresence.lastSeen.getTime() === presence.lastSeen.getTime()) {
        currentPresence.isOnline = false;
        this.broadcastPresenceUpdate();
      }
    }, 5 * 60 * 1000);
  }

  /**
   * Get unread notification count
   */
  getUnreadCount(userId: string): number {
    const userNotifications = this.notifications.get(userId) || [];
    return userNotifications.filter(n => !n.read).length;
  }

  /**
   * Get recent social activity
   */
  getRecentActivity(limit: number = 20): SocialActivity[] {
    return this.socialActivity.slice(0, limit);
  }

  /**
   * Event Handlers
   */
  private handlePresenceUpdate(data: any): void {
    const presence = data as PresenceInfo;
    this.activeUsers.set(presence.userId, presence);
    this.broadcastPresenceUpdate();
  }

  private handleLiveReaction(data: any): void {
    const reaction = data as LiveReaction;
    this.recentReactions.unshift(reaction);
    this.recentReactions = this.recentReactions.slice(0, 100);
    this.broadcastReactionUpdate(reaction);
  }

  private handleSocialActivity(data: any): void {
    const activity = data as SocialActivity;
    this.socialActivity.unshift(activity);
    this.socialActivity = this.socialActivity.slice(0, 100);
    this.broadcastActivityUpdate();
  }

  private handleLeagueUpdate(data: any): void {
    // Create notifications for league members
    if (data.type === 'member_joined') {
      // Notify existing members
      this.createNotification({
        type: 'member_joined',
        title: 'New League Member',
        message: `${data.username} joined ${data.leagueName}`,
        userId: data.notifyUserId,
        entityId: data.leagueId,
        priority: 'low'
      });
    }
  }

  private handlePredictionNotification(data: any): void {
    this.createNotification({
      type: 'prediction_result',
      title: 'Prediction Result',
      message: data.message,
      userId: data.userId,
      entityId: data.predictionId,
      data: data.result,
      priority: 'medium'
    });
  }

  /**
   * Broadcast Updates
   */
  private broadcastNotificationUpdate(userId: string): void {
    const userNotifications = this.notifications.get(userId) || [];
    
    for (const [id, subscription] of this.subscriptions) {
      if (subscription.type === 'notifications' && subscription.userId === userId) {
        subscription.callback(userNotifications);
      }
    }
  }

  private broadcastReactionUpdate(reaction: LiveReaction): void {
    for (const [id, subscription] of this.subscriptions) {
      if (subscription.type === 'reactions' && 
          subscription.entityType === reaction.entityType && 
          subscription.entityId === reaction.entityId) {
        const entityReactions = this.recentReactions
          .filter(r => r.entityType === reaction.entityType && r.entityId === reaction.entityId)
          .slice(-10);
        subscription.callback(entityReactions);
      }
    }
  }

  private broadcastPresenceUpdate(): void {
    const activeUsers = Array.from(this.activeUsers.values());
    
    for (const [id, subscription] of this.subscriptions) {
      if (subscription.type === 'presence') {
        subscription.callback(activeUsers);
      }
    }
  }

  private broadcastActivityUpdate(): void {
    const activities = this.socialActivity.slice(-20);
    
    for (const [id, subscription] of this.subscriptions) {
      if (subscription.type === 'activity') {
        subscription.callback(activities);
      }
    }
  }

  /**
   * Browser notification support
   */
  private async showBrowserNotification(notification: SocialNotification): Promise<void> {
    if ('Notification' in window && Notification.permission === 'granted' && notification.priority === 'high') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
    }
  }

  /**
   * Request notification permission
   */
  async requestNotificationPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  /**
   * Unsubscribe from updates
   */
  unsubscribe(subscriptionId: string): void {
    this.subscriptions.delete(subscriptionId);
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.subscriptions.clear();
    this.notifications.clear();
    this.activeUsers.clear();
    this.recentReactions = [];
    this.socialActivity = [];
    
    console.log('🧹 Real-time social service cleanup completed');
  }
}

// Export singleton instance
export const realTimeSocialService = new RealTimeSocialService();