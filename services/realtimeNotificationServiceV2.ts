/**
 * Real-Time Notification Service V2
 * Comprehensive notification system with push notifications, in-app alerts, and email integration
 */

import { enhancedWebSocketService } from &apos;./enhancedWebSocketService&apos;;
import { EventEmitter } from &apos;events&apos;;

// Types and Interfaces
export interface NotificationSettings {
}
  enabled: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  inAppNotifications: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  categories: {
}
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
}
    enabled: boolean;
    start: string; // "22:00"
    end: string; // "08:00"
  };
  frequency?: &apos;instant&apos; | &apos;batch&apos; | &apos;digest&apos;;
  channels?: {
}
    push?: boolean;
    email?: boolean;
    sms?: boolean;
    inApp?: boolean;
  };
}

export interface Notification {
}
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  priority: &apos;critical&apos; | &apos;high&apos; | &apos;medium&apos; | &apos;low&apos;;
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
}
    id: string;
    name: string;
    avatar?: string;
  };
}

export type NotificationType = 
  | &apos;trade_proposed&apos;
  | &apos;trade_accepted&apos;
  | &apos;trade_rejected&apos;
  | &apos;trade_countered&apos;
  | &apos;trade_expired&apos;
  | &apos;waiver_claim&apos;
  | &apos;waiver_processed&apos;
  | &apos;waiver_failed&apos;
  | &apos;player_injured&apos;
  | &apos;player_activated&apos;
  | &apos;player_news&apos;
  | &apos;score_update&apos;
  | &apos;score_final&apos;
  | &apos;matchup_close&apos;
  | &apos;league_announcement&apos;
  | &apos;league_poll&apos;
  | &apos;league_rule_change&apos;
  | &apos;draft_starting&apos;
  | &apos;draft_turn&apos;
  | &apos;draft_complete&apos;
  | &apos;chat_message&apos;
  | &apos;chat_mention&apos;
  | &apos;system_update&apos;
  | &apos;achievement_earned&apos;
  | &apos;weekly_recap&apos;;

export type NotificationCategory = 
  | &apos;trades&apos;
  | &apos;waivers&apos;
  | &apos;injuries&apos;
  | &apos;scoring&apos;
  | &apos;league&apos;
  | &apos;draft&apos;
  | &apos;chat&apos;
  | &apos;news&apos;
  | &apos;system&apos;;

export interface NotificationAction {
}
  id: string;
  label: string;
  type: &apos;primary&apos; | &apos;secondary&apos; | &apos;danger&apos;;
  action: string; // URL or action identifier
  icon?: string;
}

export interface NotificationGroup {
}
  id: string;
  title: string;
  notifications: Notification[];
  count: number;
  unreadCount: number;
  latestTimestamp: number;
  collapsed: boolean;
}

export interface NotificationThread {
}
  id: string;
  subject: string;
  participants: string[];
  notifications: Notification[];
  lastActivity: number;
  unreadCount: number;
}

export interface NotificationStats {
}
  total: number;
  unread: number;
  unseen: number;
  byCategory: Record<NotificationCategory, number>;
  byPriority: Record<string, number>;
  todayCount: number;
  weekCount: number;
}

export interface PushSubscription {
}
  endpoint: string;
  keys: {
}
    p256dh: string;
    auth: string;
  };
  expirationTime?: number | null;
}

// Notification Templates
export const NotificationTemplates = {
}
  trade_proposed: {
}
    title: &apos;New Trade Proposal&apos;,
    message: &apos;{{sender}} has proposed a trade with you&apos;,
    icon: &apos;🔄&apos;,
    actions: [
      { id: &apos;view&apos;, label: &apos;View Trade&apos;, type: &apos;primary&apos; as const, action: &apos;/trades/{{tradeId}}&apos; },
      { id: &apos;quick_reject&apos;, label: &apos;Reject&apos;, type: &apos;danger&apos; as const, action: &apos;trade:reject:{{tradeId}}&apos; }
    ]
  },
  player_injured: {
}
    title: &apos;Injury Alert&apos;,
    message: &apos;{{playerName}} ({{team}}) is {{status}}&apos;,
    icon: &apos;🚑&apos;,
    actions: [
      { id: &apos;view&apos;, label: &apos;View Details&apos;, type: &apos;primary&apos; as const, action: &apos;/players/{{playerId}}&apos; },
      { id: &apos;find_replacement&apos;, label: &apos;Find Replacement&apos;, type: &apos;secondary&apos; as const, action: &apos;/waivers?position={{position}}&apos; }
    ]
  },
  score_update: {
}
    title: &apos;Score Update&apos;,
    message: &apos;{{team1}} {{score1}} - {{score2}} {{team2}}&apos;,
    icon: &apos;📊&apos;,
    actions: [
      { id: &apos;view&apos;, label: &apos;View Matchup&apos;, type: &apos;primary&apos; as const, action: &apos;/matchup/{{matchupId}}&apos; }
    ]
  },
  draft_turn: {
}
    title: &apos;Your Turn to Draft!&apos;,
    message: &apos;You\&apos;re on the clock with pick #{{pickNumber}}&apos;,
    icon: &apos;⏰&apos;,
    priority: &apos;critical&apos; as const,
    actions: [
      { id: &apos;draft&apos;, label: &apos;Go to Draft&apos;, type: &apos;primary&apos; as const, action: &apos;/draft/{{draftId}}&apos; }
    ]
  }
};

// Main Real-Time Notification Service
export class RealTimeNotificationService extends EventEmitter {
}
  private ws: typeof enhancedWebSocketService;
  private settings: NotificationSettings;
  private notifications: Map<string, Notification> = new Map();
  private groups: Map<string, NotificationGroup> = new Map();
  private threads: Map<string, NotificationThread> = new Map();
  private pushSubscription?: PushSubscription;
  private notificationPermission: NotificationPermission = &apos;default&apos;;
  private soundPool: Map<string, HTMLAudioElement> = new Map();
  private badgeCount = 0;
  private isInitialized = false;
  private userId?: string;
  private deviceToken?: string;

  constructor() {
}
    super();
    
    this.ws = enhancedWebSocketService;
    
    this.settings = this.loadSettings();
    this.setupEventHandlers();
    this.initializeSounds();
    this.checkNotificationPermission();
  }

  // Initialize Service
  async initialize(userId: string): Promise<void> {
}
    if (this.isInitialized) return;

    this.userId = userId;

    try {
}
      // Connect to WebSocket with timeout
      if (!this.ws.isConnected()) {
}
        console.log(&apos;🔗 Connecting to WebSocket for notifications...&apos;);
        await this.ws.connect();
      }

      // Enable notifications on WebSocket
      this.ws.enableNotifications(this.settings);

      // Load stored notifications
      await this.loadStoredNotifications();

      // Register for push notifications if enabled
      if (this.settings.pushNotifications) {
}
        await this.registerPushNotifications();
      }

      // Subscribe to notification events
      this.subscribeToNotificationEvents();

      this.isInitialized = true;

      console.log(&apos;✅ Notification service initialized successfully&apos;);

      this.emit(&apos;initialized&apos;, {
}
        userId,
        notificationCount: this.notifications.size,
        unreadCount: this.getUnreadCount()
      });
    } catch (error) {
}
      console.error(&apos;❌ Failed to initialize notification service:&apos;, error);
      
      // Set up fallback mode - notifications will work without WebSocket
      this.isInitialized = true;
      
      this.emit(&apos;initialized&apos;, {
}
        userId,
        notificationCount: this.notifications.size,
        unreadCount: this.getUnreadCount(),
        fallbackMode: true,
        error: error instanceof Error ? error.message : &apos;Unknown error&apos;
      });
    }
  }

  // Send Notification
  async sendNotification(notification: Omit<Notification, &apos;id&apos; | &apos;timestamp&apos; | &apos;read&apos; | &apos;seen&apos; | &apos;dismissed&apos;>): Promise<void> {
}
    const fullNotification: Notification = {
}
      ...notification,
      id: this.generateId(),
      timestamp: Date.now(),
      read: false,
      seen: false,
      dismissed: false
    };

    // Check if notifications are enabled for this category
    if (!this.shouldShowNotification(fullNotification)) {
}
      return;
    }

    // Check quiet hours
    if (this.isInQuietHours()) {
}
      // Queue for later or send silently
      if (fullNotification.priority !== &apos;critical&apos;) {
}
        this.queueForLater(fullNotification);
        return;
      }
    }

    // Store notification
    this.storeNotification(fullNotification);

    // Process based on priority and settings
    await this.processNotification(fullNotification);

    // Emit events
    this.emit(&apos;notification:received&apos;, fullNotification);
    this.emit(`notification:${fullNotification.type}`, fullNotification);
  }

  // Process Notification
  private async processNotification(notification: Notification): Promise<void> {
}
    // Group notifications if applicable
    if (notification.groupId) {
}
      this.addToGroup(notification);
    }

    // Add to thread if applicable
    if (notification.threadId) {
}
      this.addToThread(notification);
    }

    // Update badge count
    this.updateBadgeCount();

    // Show based on channels
    const promises: Promise<void>[] = [];

    if (this.settings.inAppNotifications) {
}
      promises.push(this.showInAppNotification(notification));
    }

    if (this.settings.pushNotifications && notification.priority !== &apos;low&apos;) {
}
      promises.push(this.showPushNotification(notification));
    }

    if (this.settings.emailNotifications && notification.priority === &apos;critical&apos;) {
}
      promises.push(this.sendEmailNotification(notification));
    }

    if (this.settings.soundEnabled) {
}
      this.playNotificationSound(notification);
    }

    if (this.settings.vibrationEnabled && &apos;vibrate&apos; in navigator) {
}
      this.vibrateDevice(notification);
    }

    await Promise.all(promises);
  }

  // Show In-App Notification
  private async showInAppNotification(notification: Notification): Promise<void> {
}
    // Create toast/banner notification
    this.emit(&apos;notification:show&apos;, notification);

    // Auto-dismiss low priority after 5 seconds
    if (notification.priority === &apos;low&apos;) {
}
      setTimeout(() => {
}
        this.dismissNotification(notification.id);
      }, 5000);
    }
  }

  // Show Push Notification
  private async showPushNotification(notification: Notification): Promise<void> {
}
    if (this.notificationPermission !== &apos;granted&apos;) {
}
      return;
    }

    try {
}
      const registration = await navigator.serviceWorker.ready;
      
      const options: NotificationOptions = {
}
        body: notification.message,
        icon: notification.icon || &apos;/icon-192x192.png&apos;,
        badge: &apos;/badge-72x72.png&apos;,
        image: notification.image,
        tag: notification.id,
        renotify: notification.priority === &apos;critical&apos;,
        requireInteraction: notification.priority === &apos;critical&apos;,
        silent: notification.priority === &apos;low&apos;,
        data: {
}
          notificationId: notification.id,
          type: notification.type,
          data: notification.data
        },
        actions: notification.actions?.slice(0, 2).map((a: any) => ({
}
          action: a.id,
          title: a.label,
          icon: a.icon
        }))
      };

      await registration.showNotification(notification.title, options);

    } catch (error) {
}
      console.error(&apos;Failed to show push notification:&apos;, error);
    }
  }

  // Send Email Notification
  private async sendEmailNotification(notification: Notification): Promise<void> {
}
    try {
}
      await fetch(&apos;/api/notifications/email&apos;, {
}
        method: &apos;POST&apos;,
        headers: { &apos;Content-Type&apos;: &apos;application/json&apos; },
        body: JSON.stringify({
}
          userId: this.userId,
//           notification
        })
      });
    } catch (error) {
}
      console.error(&apos;Failed to send email notification:&apos;, error);
    }
  }

  // Mark as Read
  markAsRead(notificationId: string): void {
}
    const notification = this.notifications.get(notificationId);
    if (notification && !notification.read) {
}
      notification.read = true;
      notification.seen = true;
      this.updateNotification(notification);
      this.updateBadgeCount();
      this.emit(&apos;notification:read&apos;, notification);
    }
  }

  // Mark All as Read
  markAllAsRead(category?: NotificationCategory): void {
}
    this.notifications.forEach((notification: any) => {
}
      if (!category || notification.category === category) {
}
        if (!notification.read) {
}
          notification.read = true;
          notification.seen = true;
        }
      }
    });
    
    this.saveNotifications();
    this.updateBadgeCount();
    this.emit(&apos;notifications:all-read&apos;, { category });
  }

  // Dismiss Notification
  dismissNotification(notificationId: string): void {
}
    const notification = this.notifications.get(notificationId);
    if (notification) {
}
      notification.dismissed = true;
      this.updateNotification(notification);
      this.emit(&apos;notification:dismissed&apos;, notification);
    }
  }

  // Delete Notification
  deleteNotification(notificationId: string): void {
}
    const notification = this.notifications.get(notificationId);
    if (notification) {
}
      this.notifications.delete(notificationId);
      this.removeFromGroups(notification);
      this.removeFromThreads(notification);
      this.saveNotifications();
      this.updateBadgeCount();
      this.emit(&apos;notification:deleted&apos;, notification);
    }
  }

  // Clear All Notifications
  clearAll(category?: NotificationCategory): void {
}
    if (category) {
}
      Array.from(this.notifications.values())
        .filter((n: any) => n.category === category)
        .forEach((n: any) => this.deleteNotification(n.id));
    } else {
}
      this.notifications.clear();
      this.groups.clear();
      this.threads.clear();
      this.saveNotifications();
      this.updateBadgeCount();
    }
    
    this.emit(&apos;notifications:cleared&apos;, { category });
  }

  // Group Management
  private addToGroup(notification: Notification): void {
}
    if (!notification.groupId) return;

    let group = this.groups.get(notification.groupId);
    
    if (!group) {
}
      group = {
}
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
}
      group.unreadCount++;
    }
    group.latestTimestamp = Math.max(group.latestTimestamp, notification.timestamp);

    this.emit(&apos;notification:grouped&apos;, { notification, group });
  }

  private removeFromGroups(notification: Notification): void {
}
    if (!notification.groupId) return;

    const group = this.groups.get(notification.groupId);
    if (group) {
}
      const index = group.notifications.findIndex(n => n.id === notification.id);
      if (index > -1) {
}
        group.notifications.splice(index, 1);
        group.count--;
        if (!notification.read) {
}
          group.unreadCount--;
        }
        
        if (group.count === 0) {
}
          this.groups.delete(notification.groupId);
        }
      }
    }
  }

  // Thread Management
  private addToThread(notification: Notification): void {
}
    if (!notification.threadId) return;

    let thread = this.threads.get(notification.threadId);
    
    if (!thread) {
}
      thread = {
}
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
}
      thread.unreadCount++;
    }

    this.emit(&apos;notification:threaded&apos;, { notification, thread });
  }

  private removeFromThreads(notification: Notification): void {
}
    if (!notification.threadId) return;

    const thread = this.threads.get(notification.threadId);
    if (thread) {
}
      const index = thread.notifications.findIndex(n => n.id === notification.id);
      if (index > -1) {
}
        thread.notifications.splice(index, 1);
        if (!notification.read) {
}
          thread.unreadCount--;
        }
        
        if (thread.notifications.length === 0) {
}
          this.threads.delete(notification.threadId);
        }
      }
    }
  }

  // Settings Management
  updateSettings(settings: Partial<NotificationSettings>): void {
}
    this.settings = { ...this.settings, ...settings };
    this.saveSettings();
    
    // Update WebSocket preferences
    this.ws.emit(&apos;notifications:preferences&apos;, this.settings);
    
    // Re-register push if needed
    if (settings.pushNotifications !== undefined) {
}
      if (settings.pushNotifications) {
}
        this.registerPushNotifications();
      } else {
}
        this.unregisterPushNotifications();
      }
    }
    
    this.emit(&apos;settings:updated&apos;, this.settings);
  }

  private loadSettings(): NotificationSettings {
}
    const stored = localStorage.getItem(&apos;notificationSettings&apos;);
    
    const defaultSettings: NotificationSettings = {
}
      enabled: true,
      pushNotifications: false,
      emailNotifications: false,
      inAppNotifications: true,
      soundEnabled: true,
      vibrationEnabled: true,
      categories: {
}
        trades: true,
        waivers: true,
        injuries: true,
        scoring: true,
        league: true,
        draft: true,
        chat: true,
        news: true
      },
      frequency: &apos;instant&apos;
    };
    
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
  }

  private saveSettings(): void {
}
    localStorage.setItem(&apos;notificationSettings&apos;, JSON.stringify(this.settings));
  }

  // Push Notification Registration
  private async registerPushNotifications(): Promise<void> {
}
    if (&apos;serviceWorker&apos; in navigator && &apos;PushManager&apos; in window) {
}
      try {
}
        // Request permission
        const permission = await Notification.requestPermission();
        this.notificationPermission = permission;
        
        if (permission !== &apos;granted&apos;) {
}
          console.log(&apos;Push notification permission denied&apos;);
          return;
        }

        // Get service worker registration
        const registration = await navigator.serviceWorker.ready;

        // Subscribe to push
        const subscription = await registration.pushManager.subscribe({
}
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(
            import.meta.env.VITE_VAPID_PUBLIC_KEY || &apos;&apos;
          )
        });

        // Save subscription
        this.pushSubscription = subscription.toJSON() as PushSubscription;

        // Send to server
        await this.sendSubscriptionToServer(this.pushSubscription);

        console.log(&apos;✅ Push notifications registered&apos;);

      } catch (error) {
}
        console.error(&apos;Failed to register push notifications:&apos;, error);
      }
    }
  }

  private async unregisterPushNotifications(): Promise<void> {
}
    if (&apos;serviceWorker&apos; in navigator && this.pushSubscription) {
}
      try {
}
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        
        if (subscription) {
}
          await subscription.unsubscribe();
          await this.removeSubscriptionFromServer();
        }
        
        this.pushSubscription = undefined;
        console.log(&apos;Push notifications unregistered&apos;);
        
      } catch (error) {
}
        console.error(&apos;Failed to unregister push notifications:&apos;, error);
      }
    }
  }

  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
}
    await fetch(&apos;/api/notifications/subscribe&apos;, {
}
      method: &apos;POST&apos;,
      headers: { &apos;Content-Type&apos;: &apos;application/json&apos; },
      body: JSON.stringify({
}
        userId: this.userId,
//         subscription
      })
    });
  }

  private async removeSubscriptionFromServer(): Promise<void> {
}
    await fetch(&apos;/api/notifications/unsubscribe&apos;, {
}
      method: &apos;POST&apos;,
      headers: { &apos;Content-Type&apos;: &apos;application/json&apos; },
      body: JSON.stringify({
}
        userId: this.userId
      })
    });
  }

  // Sound Management
  private initializeSounds(): void {
}
    const sounds = {
}
      default: &apos;/sounds/notification.mp3&apos;,
      trade: &apos;/sounds/trade.mp3&apos;,
      injury: &apos;/sounds/injury.mp3&apos;,
      score: &apos;/sounds/score.mp3&apos;,
      critical: &apos;/sounds/critical.mp3&apos;
    };

    Object.entries(sounds).forEach(([key, url]) => {
}
      const audio = new Audio(url);
      audio.preload = &apos;auto&apos;;
      this.soundPool.set(key, audio);
    });
  }

  private playNotificationSound(notification: Notification): void {
}
    if (!this.settings.soundEnabled) return;

    let soundKey = &apos;default&apos;;
    
    if (notification.priority === &apos;critical&apos;) {
}
      soundKey = &apos;critical&apos;;
    } else if (notification.category === &apos;trades&apos;) {
}
      soundKey = &apos;trade&apos;;
    } else if (notification.category === &apos;injuries&apos;) {
}
      soundKey = &apos;injury&apos;;
    } else if (notification.category === &apos;scoring&apos;) {
}
      soundKey = &apos;score&apos;;
    }

    const audio = this.soundPool.get(soundKey);
    if (audio) {
}
      audio.play().catch(console.error);
    }
  }

  // Vibration
  private vibrateDevice(notification: Notification): void {
}
    if (!this.settings.vibrationEnabled || !(&apos;vibrate&apos; in navigator)) return;

    let pattern: number[] = [200]; // Default vibration

    if (notification.priority === &apos;critical&apos;) {
}
      pattern = [200, 100, 200, 100, 200]; // Triple vibration
    } else if (notification.priority === &apos;high&apos;) {
}
      pattern = [200, 100, 200]; // Double vibration
    }

    navigator.vibrate(pattern);
  }

  // Badge Management
  private updateBadgeCount(): void {
}
    this.badgeCount = this.getUnreadCount();
    
    // Update app badge if supported
    if (&apos;setAppBadge&apos; in navigator) {
}
      (navigator as any).setAppBadge(this.badgeCount);
    }
    
    // Update favicon badge
    this.updateFaviconBadge();
    
    this.emit(&apos;badge:update&apos;, this.badgeCount);
  }

  private updateFaviconBadge(): void {
}
    // Implementation for favicon badge update
    // This would involve canvas manipulation to add badge to favicon
  }

  // Storage
  private async loadStoredNotifications(): Promise<void> {
}
    try {
}
      const stored = localStorage.getItem(`notifications_${this.userId}`);
      if (stored) {
}
        const notifications = JSON.parse(stored) as Notification[];
        
        // Filter out expired notifications
        const now = Date.now();
        const valid = notifications.filter((n: any) => 
          !n.expiresAt || n.expiresAt > now
        );
        
        valid.forEach((n: any) => this.notifications.set(n.id, n));
        
        // Rebuild groups and threads
        valid.forEach((n: any) => {
}
          if (n.groupId) this.addToGroup(n);
          if (n.threadId) this.addToThread(n);
        });
      }
    } catch (error) {
}
      console.error(&apos;Failed to load stored notifications:&apos;, error);
    }
  }

  private saveNotifications(): void {
}
    try {
}
      const notifications = Array.from(this.notifications.values())
        .slice(-500); // Keep last 500 notifications
      
      localStorage.setItem(
        `notifications_${this.userId}`,
        JSON.stringify(notifications)
      );
    } catch (error) {
}
      console.error(&apos;Failed to save notifications:&apos;, error);
    }
  }

  private storeNotification(notification: Notification): void {
}
    this.notifications.set(notification.id, notification);
    this.saveNotifications();
  }

  private updateNotification(notification: Notification): void {
}
    this.notifications.set(notification.id, notification);
    this.saveNotifications();
  }

  // WebSocket Event Handlers
  private setupEventHandlers(): void {
}
    this.ws.on(&apos;notification&apos;, (notification: any) => {
}
      this.handleIncomingNotification(notification);
    });

    this.ws.on(&apos;notification:trade&apos;, (data: any) => {
}
      this.handleTradeNotification(data);
    });

    this.ws.on(&apos;notification:injury&apos;, (data: any) => {
}
      this.handleInjuryNotification(data);
    });

    this.ws.on(&apos;notification:score&apos;, (data: any) => {
}
      this.handleScoreNotification(data);
    });
  }

  private subscribeToNotificationEvents(): void {
}
    // Subscribe to various notification channels
    this.ws.emit(&apos;notifications:subscribe&apos;, {
}
      userId: this.userId,
      preferences: this.settings
    });
  }

  private handleIncomingNotification(data: any): void {
}
    this.sendNotification(data);
  }

  private handleTradeNotification(data: any): void {
}
    const template = NotificationTemplates.trade_proposed;
    
    this.sendNotification({
}
      type: &apos;trade_proposed&apos;,
      category: &apos;trades&apos;,
      priority: &apos;high&apos;,
      title: template.title,
      message: this.interpolateTemplate(template.message, data),
      icon: template.icon,
      actions: template.actions.map((a: any) => ({
}
        ...a,
        action: this.interpolateTemplate(a.action, data)
      })),
//       data
    });
  }

  private handleInjuryNotification(data: any): void {
}
    const template = NotificationTemplates.player_injured;
    
    this.sendNotification({
}
      type: &apos;player_injured&apos;,
      category: &apos;injuries&apos;,
      priority: data.severity === &apos;OUT&apos; ? &apos;high&apos; : &apos;medium&apos;,
      title: template.title,
      message: this.interpolateTemplate(template.message, data),
      icon: template.icon,
      actions: template.actions.map((a: any) => ({
}
        ...a,
        action: this.interpolateTemplate(a.action, data)
      })),
//       data
    });
  }

  private handleScoreNotification(data: any): void {
}
    const template = NotificationTemplates.score_update;
    
    this.sendNotification({
}
      type: &apos;score_update&apos;,
      category: &apos;scoring&apos;,
      priority: &apos;low&apos;,
      title: template.title,
      message: this.interpolateTemplate(template.message, data),
      icon: template.icon,
      actions: template.actions.map((a: any) => ({
}
        ...a,
        action: this.interpolateTemplate(a.action, data)
      })),
//       data
    });
  }

  // Helper Methods
  private shouldShowNotification(notification: Notification): boolean {
}
    if (!this.settings.enabled) return false;
    
    const categoryEnabled = this.settings.categories[notification.category];
    if (!categoryEnabled) return false;
    
    return true;
  }

  private isInQuietHours(): boolean {
}
    if (!this.settings.quietHours?.enabled) return false;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = this.settings.quietHours.start.split(&apos;:&apos;).map(Number);
    const [endHour, endMin] = this.settings.quietHours.end.split(&apos;:&apos;).map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;
    
    if (startTime < endTime) {
}
      return currentTime >= startTime && currentTime < endTime;
    } else {
}
      // Quiet hours span midnight
      return currentTime >= startTime || currentTime < endTime;
    }
  }

  private queueForLater(notification: Notification): void {
}
    // Store for delivery after quiet hours
    const queued = JSON.parse(localStorage.getItem(&apos;queuedNotifications&apos;) || &apos;[]&apos;);
    queued.push(notification);
    localStorage.setItem(&apos;queuedNotifications&apos;, JSON.stringify(queued));
  }

  private checkNotificationPermission(): void {
}
    if (&apos;Notification&apos; in window) {
}
      this.notificationPermission = Notification.permission;
    }
  }

  private generateId(): string {
}
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private interpolateTemplate(template: string, data: any): string {
}
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
}
      return data[key] || match;
    });
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
}
    const padding = &apos;=&apos;.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, &apos;+&apos;)
      .replace(/_/g, &apos;/&apos;);

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
}
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Public API
  getNotifications(filter?: {
}
    category?: NotificationCategory;
    unreadOnly?: boolean;
    limit?: number;
  }): Notification[] {
}
    let notifications = Array.from(this.notifications.values());
    
    if (filter?.category) {
}
      notifications = notifications.filter((n: any) => n.category === filter.category);
    }
    
    if (filter?.unreadOnly) {
}
      notifications = notifications.filter((n: any) => !n.read);
    }
    
    // Sort by timestamp descending
    notifications.sort((a, b) => b.timestamp - a.timestamp);
    
    if (filter?.limit) {
}
      notifications = notifications.slice(0, filter.limit);
    }
    
    return notifications;
  }

  getGroups(): NotificationGroup[] {
}
    return Array.from(this.groups.values())
      .sort((a, b) => b.latestTimestamp - a.latestTimestamp);
  }

  getThreads(): NotificationThread[] {
}
    return Array.from(this.threads.values())
      .sort((a, b) => b.lastActivity - a.lastActivity);
  }

  getStats(): NotificationStats {
}
    const notifications = Array.from(this.notifications.values());
    const now = Date.now();
    const dayAgo = now - 24 * 60 * 60 * 1000;
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
    
    const byCategory: Record<NotificationCategory, number> = {
}
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
}
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    };
    
    notifications.forEach((n: any) => {
}
      byCategory[n.category]++;
      byPriority[n.priority]++;
    });
    
    return {
}
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
}
    return Array.from(this.notifications.values())
      .filter((n: any) => !n.read && !n.dismissed).length;
  }

  getSettings(): NotificationSettings {
}
    return { ...this.settings };
  }

  getBadgeCount(): number {
}
    return this.badgeCount;
  }

  getInitializationStatus(): boolean {
}
    return this.isInitialized;
  }

  // Cleanup
  destroy(): void {
}
    this.stopListening();
    this.notifications.clear();
    this.groups.clear();
    this.threads.clear();
    this.soundPool.clear();
    this.removeAllListeners();
  }

  private stopListening(): void {
}
    this.ws.off(&apos;notification&apos;);
    this.ws.off(&apos;notification:trade&apos;);
    this.ws.off(&apos;notification:injury&apos;);
    this.ws.off(&apos;notification:score&apos;);
  }
}

// Singleton instance
export const realtimeNotificationServiceV2 = new RealTimeNotificationService();
export const realTimeNotificationService = realtimeNotificationServiceV2; // Backward compatibility
export default realtimeNotificationServiceV2;