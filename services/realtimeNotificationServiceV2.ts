/**
 * Real-Time Notification Service V2
 * Comprehensive notification system with push notifications, in-app alerts, and email integration
 */

import { enhancedWebSocketService } from './enhancedWebSocketService';
import { EventEmitter } from 'events';

// Types and Interfaces
export interface NotificationSettings {
  enabled: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  inAppNotifications: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  categories: {
    trades: boolean;
    waivers: boolean;
    injuries: boolean;
    scoring: boolean;
    league: boolean;
    draft: boolean;
    chat: boolean;
    news: boolean;
  };
  quietHours?: {
    enabled: boolean;
    start: string; // "22:00"
    end: string; // "08:00"
  };
  frequency?: 'instant' | 'batch' | 'digest';
  channels?: {
    push?: boolean;
    email?: boolean;
    sms?: boolean;
    inApp?: boolean;
  };
}

export interface Notification {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  icon?: string;
  image?: string;
  data?: any;
  actions?: NotificationAction[];
  timestamp: number;
  read: boolean;
  seen: boolean;
  dismissed: boolean;
  expiresAt?: number;
  groupId?: string;
  threadId?: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export type NotificationType = 
  | 'trade_proposed'
  | 'trade_accepted'
  | 'trade_rejected'
  | 'trade_countered'
  | 'trade_expired'
  | 'waiver_claim'
  | 'waiver_processed'
  | 'waiver_failed'
  | 'player_injured'
  | 'player_activated'
  | 'player_news'
  | 'score_update'
  | 'score_final'
  | 'matchup_close'
  | 'league_announcement'
  | 'league_poll'
  | 'league_rule_change'
  | 'draft_starting'
  | 'draft_turn'
  | 'draft_complete'
  | 'chat_message'
  | 'chat_mention'
  | 'system_update'
  | 'achievement_earned'
  | 'weekly_recap';

export type NotificationCategory = 
  | 'trades'
  | 'waivers'
  | 'injuries'
  | 'scoring'
  | 'league'
  | 'draft'
  | 'chat'
  | 'news'
  | 'system';

export interface NotificationAction {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'danger';
  action: string; // URL or action identifier
  icon?: string;
}

export interface NotificationGroup {
  id: string;
  title: string;
  notifications: Notification[];
  count: number;
  unreadCount: number;
  latestTimestamp: number;
  collapsed: boolean;
}

export interface NotificationThread {
  id: string;
  subject: string;
  participants: string[];
  notifications: Notification[];
  lastActivity: number;
  unreadCount: number;}

export interface NotificationStats {
  total: number;
  unread: number;
  unseen: number;
  byCategory: Record<NotificationCategory, number>;
  byPriority: Record<string, number>;
  todayCount: number;
  weekCount: number;}

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  expirationTime?: number | null;
}

// Notification Templates
export const NotificationTemplates = {
  trade_proposed: {
    title: 'New Trade Proposal',
    message: '{{sender}} has proposed a trade with you',
    icon: '🔄',
    actions: [
      { id: 'view', label: 'View Trade', type: 'primary' as const, action: '/trades/{{tradeId}}' },
      { id: 'quick_reject', label: 'Reject', type: 'danger' as const, action: 'trade:reject:{{tradeId}}' }
    ]
  },
  player_injured: {
    title: 'Injury Alert',
    message: '{{playerName}} ({{team}}) is {{status}}',
    icon: '🚑',
    actions: [
      { id: 'view', label: 'View Details', type: 'primary' as const, action: '/players/{{playerId}}' },
      { id: 'find_replacement', label: 'Find Replacement', type: 'secondary' as const, action: '/waivers?position={{position}}' }
    ]
  },
  score_update: {
    title: 'Score Update',
    message: '{{team1}} {{score1}} - {{score2}} {{team2}}',
    icon: '📊',
    actions: [
      { id: 'view', label: 'View Matchup', type: 'primary' as const, action: '/matchup/{{matchupId}}' }
    ]
  },
  draft_turn: {
    title: 'Your Turn to Draft!',
    message: 'You\'re on the clock with pick #{{pickNumber}}',
    icon: '⏰',
    priority: 'critical' as const,
    actions: [
      { id: 'draft', label: 'Go to Draft', type: 'primary' as const, action: '/draft/{{draftId}}' }
    ]
  }
};

// Main Real-Time Notification Service
export class RealTimeNotificationService extends EventEmitter {
  private ws: typeof enhancedWebSocketService;
  private settings: NotificationSettings;
  private notifications: Map<string, Notification> = new Map();
  private groups: Map<string, NotificationGroup> = new Map();
  private threads: Map<string, NotificationThread> = new Map();
  private pushSubscription?: PushSubscription;
  private notificationPermission: NotificationPermission = 'default';
  private soundPool: Map<string, HTMLAudioElement> = new Map();
  private badgeCount = 0;
  private isInitialized = false;
  private userId?: string;
  private deviceToken?: string;

  constructor() {
    super();
    
    this.ws = enhancedWebSocketService;
    
    this.settings = this.loadSettings();
    this.setupEventHandlers();
    this.initializeSounds();
    this.checkNotificationPermission();
  }

  // Initialize Service
  async initialize(userId: string): Promise<void> {
    if (this.isInitialized) return;

    this.userId = userId;

    try {
      // Connect to WebSocket with timeout
      if (!this.ws.isConnected()) {
        console.log('🔗 Connecting to WebSocket for notifications...');
        await this.ws.connect();
      }

      // Enable notifications on WebSocket
      this.ws.enableNotifications(this.settings);

      // Load stored notifications
      await this.loadStoredNotifications();

      // Register for push notifications if enabled
      if (this.settings.pushNotifications) {
        await this.registerPushNotifications();
      }

      // Subscribe to notification events
      this.subscribeToNotificationEvents();

      this.isInitialized = true;

      console.log('✅ Notification service initialized successfully');

      this.emit('initialized', {
        userId,
        notificationCount: this.notifications.size,
        unreadCount: this.getUnreadCount()
      });
    } catch (error) {
      console.error('❌ Failed to initialize notification service:', error);
      
      // Set up fallback mode - notifications will work without WebSocket
      this.isInitialized = true;
      
      this.emit('initialized', {
        userId,
        notificationCount: this.notifications.size,
        unreadCount: this.getUnreadCount(),
        fallbackMode: true,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Send Notification
  async sendNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read' | 'seen' | 'dismissed'>): Promise<void> {
    const fullNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: Date.now(),
      read: false,
      seen: false,
      dismissed: false
    };

    // Check if notifications are enabled for this category
    if (!this.shouldShowNotification(fullNotification)) {
      return;
    }

    // Check quiet hours
    if (this.isInQuietHours()) {
      // Queue for later or send silently
      if (fullNotification.priority !== 'critical') {
        this.queueForLater(fullNotification);
        return;
      }
    }

    // Store notification
    this.storeNotification(fullNotification);

    // Process based on priority and settings
    await this.processNotification(fullNotification);

    // Emit events
    this.emit('notification:received', fullNotification);
    this.emit(`notification:${fullNotification.type}`, fullNotification);
  }

  // Process Notification
  private async processNotification(notification: Notification): Promise<void> {
    // Group notifications if applicable
    if (notification.groupId) {
      this.addToGroup(notification);
    }

    // Add to thread if applicable
    if (notification.threadId) {
      this.addToThread(notification);
    }

    // Update badge count
    this.updateBadgeCount();

    // Show based on channels
    const promises: Promise<void>[] = [];

    if (this.settings.inAppNotifications) {
      promises.push(this.showInAppNotification(notification));
    }

    if (this.settings.pushNotifications && notification.priority !== 'low') {
      promises.push(this.showPushNotification(notification));
    }

    if (this.settings.emailNotifications && notification.priority === 'critical') {
      promises.push(this.sendEmailNotification(notification));
    }

    if (this.settings.soundEnabled) {
      this.playNotificationSound(notification);
    }

    if (this.settings.vibrationEnabled && 'vibrate' in navigator) {
      this.vibrateDevice(notification);
    }

    await Promise.all(promises);
  }

  // Show In-App Notification
  private async showInAppNotification(notification: Notification): Promise<void> {
    // Create toast/banner notification
    this.emit('notification:show', notification);

    // Auto-dismiss low priority after 5 seconds
    if (notification.priority === 'low') {
      setTimeout(() => {
        this.dismissNotification(notification.id);
      }, 5000);
    }
  }

  // Show Push Notification
  private async showPushNotification(notification: Notification): Promise<void> {
    if (this.notificationPermission !== 'granted') {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      const options: NotificationOptions = {
        body: notification.message,
        icon: notification.icon || '/icon-192x192.png',
        badge: '/badge-72x72.png',
        image: notification.image,
        tag: notification.id,
        renotify: notification.priority === 'critical',
        requireInteraction: notification.priority === 'critical',
        silent: notification.priority === 'low',
        data: {
          notificationId: notification.id,
          type: notification.type,
          data: notification.data
        },
        actions: notification.actions?.slice(0, 2).map((a: any) => ({
          action: a.id,
          title: a.label,
          icon: a.icon
        }))
      };

      await registration.showNotification(notification.title, options);

    } catch (error) {
      console.error('Failed to show push notification:', error);
    }
  }

  // Send Email Notification
  private async sendEmailNotification(notification: Notification): Promise<void> {
    try {
      await fetch('/api/notifications/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.userId,
//           notification
        })
      });
    } catch (error) {
      console.error('Failed to send email notification:', error);
    }
  }

  // Mark as Read
  markAsRead(notificationId: string): void {
    const notification = this.notifications.get(notificationId);
    if (notification && !notification.read) {
      notification.read = true;
      notification.seen = true;
      this.updateNotification(notification);
      this.updateBadgeCount();
      this.emit('notification:read', notification);
    }
  }

  // Mark All as Read
  markAllAsRead(category?: NotificationCategory): void {
    this.notifications.forEach((notification: any) => {
      if (!category || notification.category === category) {
        if (!notification.read) {
          notification.read = true;
          notification.seen = true;
        }
      }
    });
    
    this.saveNotifications();
    this.updateBadgeCount();
    this.emit('notifications:all-read', { category });
  }

  // Dismiss Notification
  dismissNotification(notificationId: string): void {
    const notification = this.notifications.get(notificationId);
    if (notification) {
      notification.dismissed = true;
      this.updateNotification(notification);
      this.emit('notification:dismissed', notification);
    }
  }

  // Delete Notification
  deleteNotification(notificationId: string): void {
    const notification = this.notifications.get(notificationId);
    if (notification) {
      this.notifications.delete(notificationId);
      this.removeFromGroups(notification);
      this.removeFromThreads(notification);
      this.saveNotifications();
      this.updateBadgeCount();
      this.emit('notification:deleted', notification);
    }
  }

  // Clear All Notifications
  clearAll(category?: NotificationCategory): void {
    if (category) {
      Array.from(this.notifications.values())
        .filter((n: any) => n.category === category)
        .forEach((n: any) => this.deleteNotification(n.id));
    } else {
      this.notifications.clear();
      this.groups.clear();
      this.threads.clear();
      this.saveNotifications();
      this.updateBadgeCount();
    }
    
    this.emit('notifications:cleared', { category });
  }

  // Group Management
  private addToGroup(notification: Notification): void {
    if (!notification.groupId) return;

    let group = this.groups.get(notification.groupId);
    
    if (!group) {
      group = {
        id: notification.groupId,
        title: notification.title,
        notifications: [],
        count: 0,
        unreadCount: 0,
        latestTimestamp: notification.timestamp,
        collapsed: false
      };
      this.groups.set(notification.groupId, group);
    }

    group.notifications.push(notification);
    group.count++;
    if (!notification.read) {
      group.unreadCount++;
    }
    group.latestTimestamp = Math.max(group.latestTimestamp, notification.timestamp);

    this.emit('notification:grouped', { notification, group });
  }

  private removeFromGroups(notification: Notification): void {
    if (!notification.groupId) return;

    const group = this.groups.get(notification.groupId);
    if (group) {
      const index = group.notifications.findIndex(n => n.id === notification.id);
      if (index > -1) {
        group.notifications.splice(index, 1);
        group.count--;
        if (!notification.read) {
          group.unreadCount--;
        }
        
        if (group.count === 0) {
          this.groups.delete(notification.groupId);
        }
      }
    }
  }

  // Thread Management
  private addToThread(notification: Notification): void {
    if (!notification.threadId) return;

    let thread = this.threads.get(notification.threadId);
    
    if (!thread) {
      thread = {
        id: notification.threadId,
        subject: notification.title,
        participants: [],
        notifications: [],
        lastActivity: notification.timestamp,
        unreadCount: 0
      };
      this.threads.set(notification.threadId, thread);
    }

    thread.notifications.push(notification);
    thread.lastActivity = Math.max(thread.lastActivity, notification.timestamp);
    if (!notification.read) {
      thread.unreadCount++;
    }

    this.emit('notification:threaded', { notification, thread });
  }

  private removeFromThreads(notification: Notification): void {
    if (!notification.threadId) return;

    const thread = this.threads.get(notification.threadId);
    if (thread) {
      const index = thread.notifications.findIndex(n => n.id === notification.id);
      if (index > -1) {
        thread.notifications.splice(index, 1);
        if (!notification.read) {
          thread.unreadCount--;
        }
        
        if (thread.notifications.length === 0) {
          this.threads.delete(notification.threadId);
        }
      }
    }
  }

  // Settings Management
  updateSettings(settings: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...settings };
    this.saveSettings();
    
    // Update WebSocket preferences
    this.ws.emit('notifications:preferences', this.settings);
    
    // Re-register push if needed
    if (settings.pushNotifications !== undefined) {
      if (settings.pushNotifications) {
        this.registerPushNotifications();
      } else {
        this.unregisterPushNotifications();
      }
    }
    
    this.emit('settings:updated', this.settings);
  }

  private loadSettings(): NotificationSettings {
    const stored = localStorage.getItem('notificationSettings');
    
    const defaultSettings: NotificationSettings = {
      enabled: true,
      pushNotifications: false,
      emailNotifications: false,
      inAppNotifications: true,
      soundEnabled: true,
      vibrationEnabled: true,
      categories: {
        trades: true,
        waivers: true,
        injuries: true,
        scoring: true,
        league: true,
        draft: true,
        chat: true,
        news: true
      },
      frequency: 'instant'
    };
    
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
  }

  private saveSettings(): void {
    localStorage.setItem('notificationSettings', JSON.stringify(this.settings));
  }

  // Push Notification Registration
  private async registerPushNotifications(): Promise<void> {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        // Request permission
        const permission = await Notification.requestPermission();
        this.notificationPermission = permission;
        
        if (permission !== 'granted') {
          console.log('Push notification permission denied');
          return;
        }

        // Get service worker registration
        const registration = await navigator.serviceWorker.ready;

        // Subscribe to push
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(
            import.meta.env.VITE_VAPID_PUBLIC_KEY || ''
          )
        });

        // Save subscription
        this.pushSubscription = subscription.toJSON() as PushSubscription;

        // Send to server
        await this.sendSubscriptionToServer(this.pushSubscription);

        console.log('✅ Push notifications registered');

      } catch (error) {
        console.error('Failed to register push notifications:', error);
      }
    }
  }

  private async unregisterPushNotifications(): Promise<void> {
    if ('serviceWorker' in navigator && this.pushSubscription) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        
        if (subscription) {
          await subscription.unsubscribe();
          await this.removeSubscriptionFromServer();
        }
        
        this.pushSubscription = undefined;
        console.log('Push notifications unregistered');
        
      } catch (error) {
        console.error('Failed to unregister push notifications:', error);
      }
    }
  }

  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: this.userId,
//         subscription
      })
    });
  }

  private async removeSubscriptionFromServer(): Promise<void> {
    await fetch('/api/notifications/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: this.userId
      })
    });
  }

  // Sound Management
  private initializeSounds(): void {
    const sounds = {
      default: '/sounds/notification.mp3',
      trade: '/sounds/trade.mp3',
      injury: '/sounds/injury.mp3',
      score: '/sounds/score.mp3',
      critical: '/sounds/critical.mp3'
    };

    Object.entries(sounds).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      this.soundPool.set(key, audio);
    });
  }

  private playNotificationSound(notification: Notification): void {
    if (!this.settings.soundEnabled) return;

    let soundKey = 'default';
    
    if (notification.priority === 'critical') {
      soundKey = 'critical';
    } else if (notification.category === 'trades') {
      soundKey = 'trade';
    } else if (notification.category === 'injuries') {
      soundKey = 'injury';
    } else if (notification.category === 'scoring') {
      soundKey = 'score';
    }

    const audio = this.soundPool.get(soundKey);
    if (audio) {
      audio.play().catch(console.error);
    }
  }

  // Vibration
  private vibrateDevice(notification: Notification): void {
    if (!this.settings.vibrationEnabled || !('vibrate' in navigator)) return;

    let pattern: number[] = [200]; // Default vibration

    if (notification.priority === 'critical') {
      pattern = [200, 100, 200, 100, 200]; // Triple vibration
    } else if (notification.priority === 'high') {
      pattern = [200, 100, 200]; // Double vibration
    }

    navigator.vibrate(pattern);
  }

  // Badge Management
  private updateBadgeCount(): void {
    this.badgeCount = this.getUnreadCount();
    
    // Update app badge if supported
    if ('setAppBadge' in navigator) {
      (navigator as any).setAppBadge(this.badgeCount);
    }
    
    // Update favicon badge
    this.updateFaviconBadge();
    
    this.emit('badge:update', this.badgeCount);
  }

  private updateFaviconBadge(): void {
    // Implementation for favicon badge update
    // This would involve canvas manipulation to add badge to favicon
  }

  // Storage
  private async loadStoredNotifications(): Promise<void> {
    try {
      const stored = localStorage.getItem(`notifications_${this.userId}`);
      if (stored) {
        const notifications = JSON.parse(stored) as Notification[];
        
        // Filter out expired notifications
        const now = Date.now();
        const valid = notifications.filter((n: any) => 
          !n.expiresAt || n.expiresAt > now
        );
        
        valid.forEach((n: any) => this.notifications.set(n.id, n));
        
        // Rebuild groups and threads
        valid.forEach((n: any) => {
          if (n.groupId) this.addToGroup(n);
          if (n.threadId) this.addToThread(n);
        });
      }
    } catch (error) {
      console.error('Failed to load stored notifications:', error);
    }
  }

  private saveNotifications(): void {
    try {
      const notifications = Array.from(this.notifications.values())
        .slice(-500); // Keep last 500 notifications
      
      localStorage.setItem(
        `notifications_${this.userId}`,
        JSON.stringify(notifications)
      );
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  }

  private storeNotification(notification: Notification): void {
    this.notifications.set(notification.id, notification);
    this.saveNotifications();
  }

  private updateNotification(notification: Notification): void {
    this.notifications.set(notification.id, notification);
    this.saveNotifications();
  }

  // WebSocket Event Handlers
  private setupEventHandlers(): void {
    this.ws.on('notification', (notification: any) => {
      this.handleIncomingNotification(notification);
    });

    this.ws.on('notification:trade', (data: any) => {
      this.handleTradeNotification(data);
    });

    this.ws.on('notification:injury', (data: any) => {
      this.handleInjuryNotification(data);
    });

    this.ws.on('notification:score', (data: any) => {
      this.handleScoreNotification(data);
    });
  }

  private subscribeToNotificationEvents(): void {
    // Subscribe to various notification channels
    this.ws.emit('notifications:subscribe', {
      userId: this.userId,
      preferences: this.settings
    });
  }

  private handleIncomingNotification(data: any): void {
    this.sendNotification(data);
  }

  private handleTradeNotification(data: any): void {
    const template = NotificationTemplates.trade_proposed;
    
    this.sendNotification({
      type: 'trade_proposed',
      category: 'trades',
      priority: 'high',
      title: template.title,
      message: this.interpolateTemplate(template.message, data),
      icon: template.icon,
      actions: template.actions.map((a: any) => ({
        ...a,
        action: this.interpolateTemplate(a.action, data)
      })),
//       data
    });
  }

  private handleInjuryNotification(data: any): void {
    const template = NotificationTemplates.player_injured;
    
    this.sendNotification({
      type: 'player_injured',
      category: 'injuries',
      priority: data.severity === 'OUT' ? 'high' : 'medium',
      title: template.title,
      message: this.interpolateTemplate(template.message, data),
      icon: template.icon,
      actions: template.actions.map((a: any) => ({
        ...a,
        action: this.interpolateTemplate(a.action, data)
      })),
//       data
    });
  }

  private handleScoreNotification(data: any): void {
    const template = NotificationTemplates.score_update;
    
    this.sendNotification({
      type: 'score_update',
      category: 'scoring',
      priority: 'low',
      title: template.title,
      message: this.interpolateTemplate(template.message, data),
      icon: template.icon,
      actions: template.actions.map((a: any) => ({
        ...a,
        action: this.interpolateTemplate(a.action, data)
      })),
//       data
    });
  }

  // Helper Methods
  private shouldShowNotification(notification: Notification): boolean {
    if (!this.settings.enabled) return false;
    
    const categoryEnabled = this.settings.categories[notification.category];
    if (!categoryEnabled) return false;
    
    return true;
  }

  private isInQuietHours(): boolean {
    if (!this.settings.quietHours?.enabled) return false;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = this.settings.quietHours.start.split(':').map(Number);
    const [endHour, endMin] = this.settings.quietHours.end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;
    
    if (startTime < endTime) {
      return currentTime >= startTime && currentTime < endTime;
    } else {
      // Quiet hours span midnight
      return currentTime >= startTime || currentTime < endTime;
    }
  }

  private queueForLater(notification: Notification): void {
    // Store for delivery after quiet hours
    const queued = JSON.parse(localStorage.getItem('queuedNotifications') || '[]');
    queued.push(notification);
    localStorage.setItem('queuedNotifications', JSON.stringify(queued));
  }

  private checkNotificationPermission(): void {
    if ('Notification' in window) {
      this.notificationPermission = Notification.permission;
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private interpolateTemplate(template: string, data: any): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || match;
    });
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Public API
  getNotifications(filter?: {
    category?: NotificationCategory;
    unreadOnly?: boolean;
    limit?: number;
  }): Notification[] {
    let notifications = Array.from(this.notifications.values());
    
    if (filter?.category) {
      notifications = notifications.filter((n: any) => n.category === filter.category);
    }
    
    if (filter?.unreadOnly) {
      notifications = notifications.filter((n: any) => !n.read);
    }
    
    // Sort by timestamp descending
    notifications.sort((a, b) => b.timestamp - a.timestamp);
    
    if (filter?.limit) {
      notifications = notifications.slice(0, filter.limit);
    }
    
    return notifications;
  }

  getGroups(): NotificationGroup[] {
    return Array.from(this.groups.values())
      .sort((a, b) => b.latestTimestamp - a.latestTimestamp);
  }

  getThreads(): NotificationThread[] {
    return Array.from(this.threads.values())
      .sort((a, b) => b.lastActivity - a.lastActivity);
  }

  getStats(): NotificationStats {
    const notifications = Array.from(this.notifications.values());
    const now = Date.now();
    const dayAgo = now - 24 * 60 * 60 * 1000;
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
    
    const byCategory: Record<NotificationCategory, number> = {
      trades: 0,
      waivers: 0,
      injuries: 0,
      scoring: 0,
      league: 0,
      draft: 0,
      chat: 0,
      news: 0,
      system: 0
    };
    
    const byPriority: Record<string, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    };
    
    notifications.forEach((n: any) => {
      byCategory[n.category]++;
      byPriority[n.priority]++;
    });
    
    return {
      total: notifications.length,
      unread: notifications.filter((n: any) => !n.read).length,
      unseen: notifications.filter((n: any) => !n.seen).length,
      byCategory,
      byPriority,
      todayCount: notifications.filter((n: any) => n.timestamp > dayAgo).length,
      weekCount: notifications.filter((n: any) => n.timestamp > weekAgo).length
    };
  }

  getUnreadCount(): number {
    return Array.from(this.notifications.values())
      .filter((n: any) => !n.read && !n.dismissed).length;
  }

  getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  getBadgeCount(): number {
    return this.badgeCount;
  }

  getInitializationStatus(): boolean {
    return this.isInitialized;
  }

  // Cleanup
  destroy(): void {
    this.stopListening();
    this.notifications.clear();
    this.groups.clear();
    this.threads.clear();
    this.soundPool.clear();
    this.removeAllListeners();
  }

  private stopListening(): void {
    this.ws.off('notification');
    this.ws.off('notification:trade');
    this.ws.off('notification:injury');
    this.ws.off('notification:score');
  }
}

// Singleton instance
export const realtimeNotificationServiceV2 = new RealTimeNotificationService();
export const realTimeNotificationService = realtimeNotificationServiceV2; // Backward compatibility
export default realtimeNotificationServiceV2;