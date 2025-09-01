/**
 * Real-time Notification Service
 * Handles live updates and notifications for Oracle predictions
 */

import { io, Socket } from &apos;socket.io-client&apos;;

export interface RealtimeNotification {
}
  id: string;
  type: &apos;prediction&apos; | &apos;result&apos; | &apos;challenge&apos; | &apos;achievement&apos; | &apos;system&apos;;
  title: string;
  message: string;
  timestamp: Date;
  priority: &apos;low&apos; | &apos;medium&apos; | &apos;high&apos;;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

// Alias for internal use
type NotificationData = RealtimeNotification;

interface PushSubscription {
}
  endpoint: string;
  keys: {
}
    p256dh: string;
    auth: string;
  };
}

interface NotificationPreferences {
}
  predictions: boolean;
  result: boolean;
  results: boolean;
  challenges: boolean;
  challenge: boolean;
  achievements: boolean;
  achievement: boolean;
  system: boolean;
  prediction: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  emailDigest: &apos;none&apos; | &apos;daily&apos; | &apos;weekly&apos;;
}

class RealtimeNotificationService {
}
  private static instance: RealtimeNotificationService;
  private socket: Socket | null = null;
  private notifications: NotificationData[] = [];
  private unreadCount: number = 0;
  private listeners: Set<(notification: NotificationData) => void> = new Set();
  private connectionRetries: number = 0;
  private maxRetries: number = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isConnected: boolean = false;
  private userId: string | null = null;
  private preferences: NotificationPreferences = {
}
    predictions: true,
    result: true,
    results: true,
    challenge: true,
    challenges: true,
    achievement: true,
    achievements: true,
    prediction: true,
    system: true,
    soundEnabled: true,
    vibrationEnabled: true,
    emailDigest: &apos;daily&apos;
  };
  private pushSubscriptions: Map<string, PushSubscription> = new Map();
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

  private constructor() {
}
    // Check if we&apos;re in a browser environment before accessing localStorage
    if (typeof window !== &apos;undefined&apos; && typeof window.localStorage !== &apos;undefined&apos;) {
}
      this.loadPreferences();
      this.loadNotificationHistory();
      this.initializeNotificationSystem();
    }
  }

  public static getInstance(): RealtimeNotificationService {
}
    if (!RealtimeNotificationService.instance) {
}
      RealtimeNotificationService.instance = new RealtimeNotificationService();
    }
    return RealtimeNotificationService.instance;
  }

  /**
   * Initialize notification system
   */
  private async initializeNotificationSystem(): Promise<void> {
}
    // Only run in browser environment
    if (typeof window === &apos;undefined&apos;) {
}
      return;
    }

    // Request notification permission
    if (&apos;Notification&apos; in window && Notification.permission === &apos;default&apos;) {
}
      await Notification.requestPermission();
    }

    // Initialize service worker for push notifications
    if (&apos;serviceWorker&apos; in navigator && &apos;PushManager&apos; in window) {
}
      try {
}
        const registration = await navigator.serviceWorker.ready;
        this.serviceWorkerRegistration = registration;
        await this.subscribeToPushNotifications();
      } catch (error) {
}
        console.error(&apos;Failed to initialize push notifications:&apos;, error);
      }
    }

    // Load push subscriptions
    this.loadPushSubscriptions();
  }

  /**
   * Connect to notification server
   */
  public connect(userId: string): void {
}
    if (this.socket?.connected) {
}
      console.log(&apos;Already connected to notification service&apos;);
      return;
    }

    this.userId = userId;
    
    // Get WebSocket URL from environment or use default
    const wsUrl = process.env.REACT_APP_WS_URL || &apos;ws://localhost:3001&apos;;
    
    this.socket = io(wsUrl, {
}
      transports: [&apos;websocket&apos;],
      reconnection: true,
      reconnectionAttempts: this.maxRetries,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      auth: {
}
        userId: this.userId
      }
    });

    this.setupSocketListeners();
  }

  /**
   * Setup socket event listeners
   */
  private setupSocketListeners(): void {
}
    if (!this.socket) return;

    this.socket.on(&apos;connect&apos;, () => {
}
      console.log(&apos;Connected to notification service&apos;);
      this.isConnected = true;
      this.connectionRetries = 0;
      
      // Subscribe to user&apos;s notification channels
      this.socket?.emit(&apos;subscribe&apos;, {
}
        userId: this.userId,
        channels: [&apos;predictions&apos;, &apos;results&apos;, &apos;challenges&apos;, &apos;achievements&apos;]
      });
    });

    this.socket.on(&apos;disconnect&apos;, () => {
}
      console.log(&apos;Disconnected from notification service&apos;);
      this.isConnected = false;
      this.scheduleReconnect();
    });

    this.socket.on(&apos;notification&apos;, (data: NotificationData) => {
}
      this.handleNotification(data);
    });

    this.socket.on(&apos;prediction:new&apos;, (data: any) => {
}
      this.handleNotification({
}
        id: `pred-${Date.now()}`,
        type: &apos;prediction&apos;,
        title: &apos;New Oracle Prediction&apos;,
        message: data.title || &apos;A new prediction is available!&apos;,
        timestamp: new Date(),
        priority: &apos;medium&apos;,
        actionUrl: `/oracle/prediction/${data.predictionId}`,
        metadata: data
      });
    });

    this.socket.on(&apos;prediction:resolved&apos;, (data: any) => {
}
      this.handleNotification({
}
        id: `result-${Date.now()}`,
        type: &apos;result&apos;,
        title: &apos;Prediction Resolved&apos;,
        message: `The Oracle prediction "${data.title}" has been resolved!`,
        timestamp: new Date(),
        priority: &apos;high&apos;,
        actionUrl: `/oracle/prediction/${data.predictionId}`,
        metadata: data
      });
    });

    this.socket.on(&apos;challenge:received&apos;, (data: any) => {
}
      this.handleNotification({
}
        id: `challenge-${Date.now()}`,
        type: &apos;challenge&apos;,
        title: &apos;Challenge Received!&apos;,
        message: `${data.challengerName} has challenged your prediction!`,
        timestamp: new Date(),
        priority: &apos;high&apos;,
        actionUrl: `/oracle/challenges`,
        metadata: data
      });
    });

    this.socket.on(&apos;achievement:unlocked&apos;, (data: any) => {
}
      this.handleNotification({
}
        id: `achievement-${Date.now()}`,
        type: &apos;achievement&apos;,
        title: &apos;Achievement Unlocked!&apos;,
        message: data.achievementName || &apos;You\&apos;ve earned a new achievement!&apos;,
        timestamp: new Date(),
        priority: &apos;medium&apos;,
        actionUrl: &apos;/profile/achievements&apos;,
        metadata: data
      });
    });

    this.socket.on(&apos;error&apos;, (error: any) => {
}
      console.error(&apos;Socket error:&apos;, error);
    });
  }

  /**
   * Handle incoming notification
   */
  private handleNotification(notification: NotificationData): void {
}
    // Check if notification type is enabled in preferences
    const typeKey = notification.type === &apos;prediction&apos; ? &apos;predictions&apos; : 
                   notification.type === &apos;result&apos; ? &apos;results&apos; :
                   notification.type === &apos;challenge&apos; ? &apos;challenges&apos; :
                   notification.type === &apos;achievement&apos; ? &apos;achievements&apos; :
                   &apos;system&apos;;
    
    if (!this.preferences[typeKey as keyof NotificationPreferences]) {
}
      return;
    }

    // Add to notifications list
    this.notifications.unshift(notification);
    this.unreadCount++;
    
    // Limit stored notifications
    if (this.notifications.length > 100) {
}
      this.notifications = this.notifications.slice(0, 100);
    }

    // Save to local storage
    this.saveNotificationHistory();

    // Notify listeners
    this.listeners.forEach((listener: any) => listener(notification));

    // Show browser notification if permitted
    this.showBrowserNotification(notification);

    // Play sound if enabled
    if (this.preferences.soundEnabled) {
}
      this.playNotificationSound();
    }

    // Vibrate if enabled and supported
    if (this.preferences.vibrationEnabled && &apos;vibrate&apos; in navigator) {
}
      navigator.vibrate(200);
    }
  }

  /**
   * Show browser notification
   */
  private async showBrowserNotification(notification: NotificationData): Promise<void> {
}
    if (typeof window === &apos;undefined&apos; || !(&apos;Notification&apos; in window)) {
}
      return;
    }

    if (Notification.permission !== &apos;granted&apos;) {
}
      return;
    }

    const options: NotificationOptions = {
}
      body: notification.message,
      icon: &apos;/icons/oracle-icon-192.png&apos;,
      badge: &apos;/icons/oracle-badge-72.png&apos;,
      tag: notification.id,
      requireInteraction: notification.priority === &apos;high&apos;,
      data: {
}
        url: notification.actionUrl,
        notificationId: notification.id
      }
    };

    try {
}
      if (this.serviceWorkerRegistration) {
}
        await this.serviceWorkerRegistration.showNotification(
          notification.title,
//           options
        );
      } else {
}
        new Notification(notification.title, options);
      }
    } catch (error) {
}
      console.error(&apos;Failed to show notification:&apos;, error);
    }
  }

  /**
   * Play notification sound
   */
  private playNotificationSound(): void {
}
    if (typeof window === &apos;undefined&apos;) return;

    try {
}
      const audio = new Audio(&apos;/sounds/notification.mp3&apos;);
      audio.volume = 0.5;
      audio.play().catch(error => {
}
        console.warn(&apos;Could not play notification sound:&apos;, error);
      });
    } catch (error) {
}
      console.warn(&apos;Audio playback not supported:&apos;, error);
    }
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
}
    if (this.connectionRetries >= this.maxRetries) {
}
      console.error(&apos;Max reconnection attempts reached&apos;);
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, this.connectionRetries), 30000);
    this.connectionRetries++;

    this.reconnectTimeout = setTimeout(() => {
}
      console.log(`Attempting to reconnect (${this.connectionRetries}/${this.maxRetries})...`);
      if (this.userId) {
}
        this.connect(this.userId);
      }
    }, delay);
  }

  /**
   * Subscribe to push notifications
   */
  private async subscribeToPushNotifications(): Promise<void> {
}
    if (!this.serviceWorkerRegistration) return;

    try {
}
      const subscription = await this.serviceWorkerRegistration.pushManager.subscribe({
}
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          process.env.REACT_APP_VAPID_PUBLIC_KEY || &apos;&apos;
        ) as BufferSource
      });

      // Send subscription to server
      await this.sendSubscriptionToServer(subscription);
    } catch (error) {
}
      console.error(&apos;Failed to subscribe to push notifications:&apos;, error);
    }
  }

  /**
   * Send push subscription to server
   */
  private async sendSubscriptionToServer(subscription: PushSubscriptionJSON): Promise<void> {
}
    if (!subscription.endpoint) return;

    try {
}
      const response = await fetch(&apos;/api/notifications/subscribe&apos;, {
}
        method: &apos;POST&apos;,
        headers: {
}
          &apos;Content-Type&apos;: &apos;application/json&apos;,
          &apos;Authorization&apos;: `Bearer ${localStorage.getItem(&apos;accessToken&apos;)}`
        },
        body: JSON.stringify({
}
          subscription,
          userId: this.userId
        })
      });

      if (response.ok) {
}
        console.log(&apos;Push subscription sent to server&apos;);
      }
    } catch (error) {
}
      console.error(&apos;Failed to send subscription to server:&apos;, error);
    }
  }

  /**
   * Convert VAPID key
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
}
    const padding = &apos;=&apos;.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, &apos;+&apos;)
      .replace(/_/g, &apos;/&apos;);

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
}
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  /**
   * Get all notifications
   */
  public getNotifications(): NotificationData[] {
}
    return this.notifications;
  }

  /**
   * Get unread count
   */
  public getUnreadCount(): number {
}
    return this.unreadCount;
  }

  /**
   * Mark notification as read
   */
  public markAsRead(notificationId: string): void {
}
    const notification = this.notifications.find((n: any) => n.id === notificationId);
    if (notification) {
}
      this.unreadCount = Math.max(0, this.unreadCount - 1);
      this.saveNotificationHistory();
    }
  }

  /**
   * Mark all as read
   */
  public markAllAsRead(): void {
}
    this.unreadCount = 0;
    this.saveNotificationHistory();
  }

  /**
   * Clear all notifications
   */
  public clearAll(): void {
}
    this.notifications = [];
    this.unreadCount = 0;
    this.saveNotificationHistory();
  }

  /**
   * Add notification listener
   */
  public addListener(callback: (notification: NotificationData) => void): () => void {
}
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Alias for addListener (for compatibility)
   */
  public on(event: string, callback: (notification: NotificationData) => void): void {
}
    if (event === &apos;notification&apos;) {
}
      this.listeners.add(callback);
    }
  }

  /**
   * Remove notification listener (for compatibility)
   */
  public off(event: string, callback: (notification: NotificationData) => void): void {
}
    if (event === &apos;notification&apos;) {
}
      this.listeners.delete(callback);
    }
  }

  /**
   * Update preferences
   */
  public updatePreferences(preferences: Partial<NotificationPreferences>): void {
}
    this.preferences = { ...this.preferences, ...preferences };
    this.savePreferences();
    
    // Update server preferences
    if (this.socket?.connected) {
}
      this.socket.emit(&apos;updatePreferences&apos;, {
}
        userId: this.userId,
        preferences: this.preferences
      });
    }
  }

  /**
   * Get preferences
   */
  public getPreferences(): NotificationPreferences {
}
    return this.preferences;
  }

  /**
   * Load preferences from storage
   */
  private loadPreferences(): void {
}
    if (typeof window === &apos;undefined&apos; || !window.localStorage) return;

    const stored = localStorage.getItem(&apos;notification_preferences&apos;);
    if (stored) {
}
      try {
}
        this.preferences = JSON.parse(stored);
      } catch (error) {
}
        console.error(&apos;Failed to load notification preferences:&apos;, error);
      }
    }
  }

  /**
   * Save preferences to storage
   */
  private savePreferences(): void {
}
    if (typeof window === &apos;undefined&apos; || !window.localStorage) return;

    try {
}
      localStorage.setItem(&apos;notification_preferences&apos;, JSON.stringify(this.preferences));
    } catch (error) {
}
      console.error(&apos;Failed to save notification preferences:&apos;, error);
    }
  }

  /**
   * Load notification history
   */
  private loadNotificationHistory(): void {
}
    if (typeof window === &apos;undefined&apos; || !window.localStorage) return;

    const stored = localStorage.getItem(&apos;notification_history&apos;);
    if (stored) {
}
      try {
}
        const data = JSON.parse(stored);
        this.notifications = data.notifications || [];
        this.unreadCount = data.unreadCount || 0;
      } catch (error) {
}
        console.error(&apos;Failed to load notification history:&apos;, error);
      }
    }
  }

  /**
   * Save notification history
   */
  private saveNotificationHistory(): void {
}
    if (typeof window === &apos;undefined&apos; || !window.localStorage) return;

    try {
}
      localStorage.setItem(&apos;notification_history&apos;, JSON.stringify({
}
        notifications: this.notifications.slice(0, 50), // Keep last 50
        unreadCount: this.unreadCount
      }));
    } catch (error) {
}
      console.error(&apos;Failed to save notification history:&apos;, error);
    }
  }

  /**
   * Load push subscriptions
   */
  private loadPushSubscriptions(): void {
}
    if (typeof window === &apos;undefined&apos; || !window.localStorage) return;

    // Load from storage - simplified for now
    const stored = localStorage.getItem(&apos;push_subscriptions&apos;);
    if (stored) {
}
      try {
}
        const subscriptions = JSON.parse(stored);
        Object.entries(subscriptions).forEach(([id, sub]) => {
}
          this.pushSubscriptions.set(id, sub as PushSubscription);
        });
      } catch (error) {
}
        console.error(&apos;Failed to load push subscriptions:&apos;, error);
      }
    }
  }

  /**
   * Save push subscriptions
   */
  private savePushSubscriptions(): void {
}
    if (typeof window === &apos;undefined&apos; || !window.localStorage) return;

    try {
}
      const subscriptions: Record<string, PushSubscription> = {};
      this.pushSubscriptions.forEach((sub, id) => {
}
        subscriptions[id] = sub;
      });
      localStorage.setItem(&apos;push_subscriptions&apos;, JSON.stringify(subscriptions));
    } catch (error) {
}
      console.error(&apos;Failed to save push subscriptions:&apos;, error);
    }
  }

  /**
   * Send test notification
   */
  public sendTestNotification(): void {
}
    const testNotification: NotificationData = {
}
      id: `test-${Date.now()}`,
      type: &apos;system&apos;,
      title: &apos;Test Notification&apos;,
      message: &apos;This is a test notification to verify your settings.&apos;,
      timestamp: new Date(),
      priority: &apos;low&apos;
    };
    
    this.handleNotification(testNotification);
  }

  /**
   * Disconnect from notification service
   */
  public disconnect(): void {
}
    if (this.reconnectTimeout) {
}
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.socket) {
}
      this.socket.disconnect();
      this.socket = null;
    }
    
    this.isConnected = false;
    this.userId = null;
  }

  /**
   * Check connection status
   */
  public isConnectedToService(): boolean {
}
    return this.isConnected;
  }

  /**
   * Get connection status details
   */
  public getConnectionStatus(): {
}
    connected: boolean;
    retries: number;
    maxRetries: number;
  } {
}
    return {
}
      connected: this.isConnected,
      retries: this.connectionRetries,
      maxRetries: this.maxRetries
    };
  }
}

// Export singleton instance
export const realtimeNotificationService = RealtimeNotificationService.getInstance();

// Export types
export type { NotificationData, NotificationPreferences, PushSubscription };
