/**
 * Push Notification Service
 * Handles push notification registration, sending, and management
 */

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: any;
  actions?: NotificationAction[];
  requireInteraction?: boolean;
  silent?: boolean;
  timestamp?: number;
  vibrate?: number[];
}

interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

class PushNotificationService {
  private vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HI0DLLuxazjqAKUrXK5acbVRongYXcB-P6RW4O50itsUgGwoRivQC6XzRY'; // Demo key
  private registration: ServiceWorkerRegistration | null = null;
  private subscription: PushSubscription | null = null;

  /**
   * Initialize push notification service
   */
  async initialize(): Promise<boolean> {
    try {
      // Check if service workers are supported
      if (!('serviceWorker' in navigator)) {
        console.warn('Service workers not supported');
        return false;
      }

      // Check if push messaging is supported
      if (!('PushManager' in window)) {
        console.warn('Push messaging not supported');
        return false;
      }

      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js');
      // Service worker registered

      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;

      return true;
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      return false;
    }
  }

  /**
   * Request notification permission from user
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return 'denied';
    }

    let permission = Notification.permission;

    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }

    // Notification permission status
    return permission;
  }

  /**
   * Subscribe to push notifications
   */
  async subscribe(): Promise<PushSubscription | null> {
    try {
      if (!this.registration) {
        throw new Error('Service worker not registered');
      }

      // Check if already subscribed
      this.subscription = await this.registration.pushManager.getSubscription();
      
      if (this.subscription) {
        // Already subscribed to push notifications
        return this.subscription;
      }

      // Subscribe to push notifications
      this.subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
      });

      // Subscribed to push notifications

      // Send subscription to server
      await this.sendSubscriptionToServer(this.subscription);

      return this.subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(): Promise<boolean> {
    try {
      if (!this.subscription) {
        // Not subscribed to push notifications
        return true;
      }

      const success = await this.subscription.unsubscribe();
      
      if (success) {
        // Unsubscribed from push notifications
        this.subscription = null;
        
        // Remove subscription from server
        await this.removeSubscriptionFromServer();
      }

      return success;
    } catch (error) {
      // Failed to unsubscribe from push notifications
      return false;
    }
  }

  /**
   * Show local notification
   */
  async showNotification(payload: NotificationPayload): Promise<void> {
    try {
      if (!this.registration) {
        throw new Error('Service worker not registered');
      }

      const options: NotificationOptions = {
        body: payload.body,
        icon: payload.icon || '/icon-192.png',
        badge: payload.badge || '/badge-72.png',
        image: payload.image,
        tag: payload.tag || 'default',
        data: payload.data,
        actions: payload.actions,
        requireInteraction: payload.requireInteraction || false,
        silent: payload.silent || false,
        timestamp: payload.timestamp || Date.now(),
        vibrate: payload.vibrate || [200, 100, 200]
      };

      await this.registration.showNotification(payload.title, options);
      // Local notification shown
    } catch (error) {
      // Failed to show notification
    }
  }

  /**
   * Get notification templates for different types
   */
  getNotificationTemplate(type: string, data: any): NotificationPayload {
    const templates: { [key: string]: (data: any) => NotificationPayload } = {
      trade_proposal: (data) => ({
        title: '🔄 New Trade Proposal',
        body: `${data.fromTeam} wants to trade with you!`,
        icon: '/icon-trade.png',
        tag: 'trade_proposal',
        data: { type: 'trade_proposal', tradeId: data.tradeId },
        actions: [
          { action: 'view_trade', title: 'View Trade' },
          { action: 'dismiss', title: 'Dismiss' }
        ],
        requireInteraction: true
      }),

      trade_accepted: (data) => ({
        title: '✅ Trade Accepted',
        body: `Your trade with ${data.otherTeam} was accepted!`,
        icon: '/icon-trade.png',
        tag: 'trade_accepted',
        data: { type: 'trade_accepted', tradeId: data.tradeId },
        actions: [
          { action: 'view_team', title: 'View Team' },
          { action: 'dismiss', title: 'Dismiss' }
        ]
      }),

      waiver_result: (data) => ({
        title: data.success ? '✅ Waiver Claim Successful' : '❌ Waiver Claim Failed',
        body: data.success 
          ? `You successfully claimed ${data.playerName}!`
          : `Your claim for ${data.playerName} was unsuccessful.`,
        icon: '/icon-waiver.png',
        tag: 'waiver_result',
        data: { type: 'waiver_result', playerId: data.playerId },
        actions: [
          { action: 'view_team', title: 'View Team' },
          { action: 'view_waivers', title: 'View Waivers' }
        ]
      }),

      score_update: (data) => ({
        title: '🏈 Score Update',
        body: `${data.playerName} just scored! Your team: ${data.currentScore} pts`,
        icon: '/icon-score.png',
        tag: 'score_update',
        data: { type: 'score_update', playerId: data.playerId },
        actions: [
          { action: 'view_scores', title: 'View Scores' },
          { action: 'dismiss', title: 'Dismiss' }
        ],
        vibrate: [100, 50, 100, 50, 100]
      }),

      matchup_reminder: (data) => ({
        title: '⏰ Lineup Reminder',
        body: `Don't forget to set your lineup! Game starts in ${data.timeUntil}.`,
        icon: '/icon-lineup.png',
        tag: 'lineup_reminder',
        data: { type: 'lineup_reminder' },
        actions: [
          { action: 'view_team', title: 'Set Lineup' },
          { action: 'dismiss', title: 'Dismiss' }
        ],
        requireInteraction: true
      }),

      message_received: (data) => ({
        title: '💬 New Message',
        body: `${data.senderName}: ${data.messagePreview}`,
        icon: '/icon-message.png',
        tag: 'message_received',
        data: { type: 'message_received', conversationId: data.conversationId },
        actions: [
          { action: 'view_message', title: 'Reply' },
          { action: 'dismiss', title: 'Dismiss' }
        ]
      }),

      draft_reminder: (data) => ({
        title: '🏈 Draft Starting Soon',
        body: `Your draft starts in ${data.timeUntil}. Get ready!`,
        icon: '/icon-draft.png',
        tag: 'draft_reminder',
        data: { type: 'draft_reminder' },
        actions: [
          { action: 'join_draft', title: 'Join Draft' },
          { action: 'dismiss', title: 'Dismiss' }
        ],
        requireInteraction: true,
        vibrate: [300, 100, 300, 100, 300]
      }),

      weekly_recap: (data) => ({
        title: '📊 Weekly Recap Available',
        body: `Week ${data.week} recap is ready! See how you performed.`,
        icon: '/icon-recap.png',
        tag: 'weekly_recap',
        data: { type: 'weekly_recap', week: data.week },
        actions: [
          { action: 'view_recap', title: 'View Recap' },
          { action: 'dismiss', title: 'Dismiss' }
        ]
      })
    };

    return templates[type]?.(data) || {
      title: 'Astral Draft',
      body: 'You have a new notification',
      icon: '/icon-192.png',
      tag: 'default',
      data: { type: 'default' }
    };
  }

  /**
   * Schedule a notification for later
   */
  async scheduleNotification(payload: NotificationPayload, delay: number): Promise<void> {
    setTimeout(() => {
      this.showNotification(payload);
    }, delay);
  }

  /**
   * Get current subscription status
   */
  async getSubscriptionStatus(): Promise<{
    supported: boolean;
    permission: NotificationPermission;
    subscribed: boolean;
    subscription: PushSubscription | null;
  }> {
    const supported = 'serviceWorker' in navigator && 'PushManager' in window;
    const permission = 'Notification' in window ? Notification.permission : 'denied';
    
    let subscribed = false;
    let subscription = null;

    if (supported && this.registration) {
      subscription = await this.registration.pushManager.getSubscription();
      subscribed = !!subscription;
    }

    return {
      supported,
      permission,
      subscribed,
      subscription
    };
  }

  /**
   * Send subscription to server
   */
  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
      // In a real app, send this to your backend
      const response = await fetch('/api/push-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription,
          userId: this.getCurrentUserId(),
          timestamp: Date.now()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save subscription');
      }

      // Subscription saved to server
    } catch (error) {
      // Failed to send subscription to server
      // Store locally as fallback
      localStorage.setItem('push_subscription', JSON.stringify(subscription));
    }
  }

  /**
   * Remove subscription from server
   */
  private async removeSubscriptionFromServer(): Promise<void> {
    try {
      await fetch('/api/push-subscription', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.getCurrentUserId()
        })
      });

      // Subscription removed from server
    } catch (error) {
      // Failed to remove subscription from server
      // Remove from local storage as fallback
      localStorage.removeItem('push_subscription');
    }
  }

  /**
   * Convert VAPID key to Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  /**
   * Get current user ID (implement based on your auth system)
   */
  private getCurrentUserId(): string {
    // This should return the current user's ID from your auth system
    return localStorage.getItem('user_id') || 'anonymous';
  }
}

// Export singleton instance
export const pushNotificationService = new PushNotificationService();
export default pushNotificationService;