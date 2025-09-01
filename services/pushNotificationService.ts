/**
 * Push Notification Service
 * Handles push notification registration, sending, and management
 */

interface NotificationPayload {
}
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
}
  action: string;
  title: string;
  icon?: string;
}

class PushNotificationService {
}
  private vapidPublicKey = &apos;BEl62iUYgUivxIkv69yViEuiBIa40HI0DLLuxazjqAKUrXK5acbVRongYXcB-P6RW4O50itsUgGwoRivQC6XzRY&apos;; // Demo key
  private registration: ServiceWorkerRegistration | null = null;
  private subscription: PushSubscription | null = null;

  /**
   * Initialize push notification service
   */
  async initialize(): Promise<boolean> {
}
    try {
}
      // Check if service workers are supported
      if (!(&apos;serviceWorker&apos; in navigator)) {
}
        console.warn(&apos;Service workers not supported&apos;);
        return false;
      }

      // Check if push messaging is supported
      if (!(&apos;PushManager&apos; in window)) {
}
        console.warn(&apos;Push messaging not supported&apos;);
        return false;
      }

      // Register service worker
      this.registration = await navigator.serviceWorker.register(&apos;/sw.js&apos;);
      console.log(&apos;Service worker registered:&apos;, this.registration);

      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;

      return true;
    } catch (error) {
}
      console.error(&apos;Failed to initialize push notifications:&apos;, error);
      return false;
    }
  }

  /**
   * Request notification permission from user
   */
  async requestPermission(): Promise<NotificationPermission> {
}
    if (!(&apos;Notification&apos; in window)) {
}
      console.warn(&apos;Notifications not supported&apos;);
      return &apos;denied&apos;;
    }

    let permission = Notification.permission;

    if (permission === &apos;default&apos;) {
}
      permission = await Notification.requestPermission();
    }

    console.log(&apos;Notification permission:&apos;, permission);
    return permission;
  }

  /**
   * Subscribe to push notifications
   */
  async subscribe(): Promise<PushSubscription | null> {
}
    try {
}
      if (!this.registration) {
}
        throw new Error(&apos;Service worker not registered&apos;);
      }

      // Check if already subscribed
      this.subscription = await this.registration.pushManager.getSubscription();
      
      if (this.subscription) {
}
        console.log(&apos;Already subscribed to push notifications&apos;);
        return this.subscription;
      }

      // Subscribe to push notifications
      this.subscription = await this.registration.pushManager.subscribe({
}
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
      });

      console.log(&apos;Subscribed to push notifications:&apos;, this.subscription);

      // Send subscription to server
      await this.sendSubscriptionToServer(this.subscription);

      return this.subscription;
    } catch (error) {
}
      console.error(&apos;Failed to subscribe to push notifications:&apos;, error);
      return null;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(): Promise<boolean> {
}
    try {
}
      if (!this.subscription) {
}
        console.log(&apos;Not subscribed to push notifications&apos;);
        return true;
      }

      const success = await this.subscription.unsubscribe();
      
      if (success) {
}
        console.log(&apos;Unsubscribed from push notifications&apos;);
        this.subscription = null;
        
        // Remove subscription from server
        await this.removeSubscriptionFromServer();
      }

      return success;
    } catch (error) {
}
      console.error(&apos;Failed to unsubscribe from push notifications:&apos;, error);
      return false;
    }
  }

  /**
   * Show local notification
   */
  async showNotification(payload: NotificationPayload): Promise<void> {
}
    try {
}
      if (!this.registration) {
}
        throw new Error(&apos;Service worker not registered&apos;);
      }

      const options: NotificationOptions = {
}
        body: payload.body,
        icon: payload.icon || &apos;/icon-192.png&apos;,
        badge: payload.badge || &apos;/badge-72.png&apos;,
        image: payload.image,
        tag: payload.tag || &apos;default&apos;,
        data: payload.data,
        actions: payload.actions,
        requireInteraction: payload.requireInteraction || false,
        silent: payload.silent || false,
        timestamp: payload.timestamp || Date.now(),
        vibrate: payload.vibrate || [200, 100, 200]
      };

      await this.registration.showNotification(payload.title, options);
      console.log(&apos;Local notification shown:&apos;, payload.title);
    } catch (error) {
}
      console.error(&apos;Failed to show notification:&apos;, error);
    }
  }

  /**
   * Get notification templates for different types
   */
  getNotificationTemplate(type: string, data: any): NotificationPayload {
}
    const templates: { [key: string]: (data: any) => NotificationPayload } = {
}
      trade_proposal: (data: any) => ({
}
        title: &apos;🔄 New Trade Proposal&apos;,
        body: `${data.fromTeam} wants to trade with you!`,
        icon: &apos;/icon-trade.png&apos;,
        tag: &apos;trade_proposal&apos;,
        data: { type: &apos;trade_proposal&apos;, tradeId: data.tradeId },
        actions: [
          { action: &apos;view_trade&apos;, title: &apos;View Trade&apos; },
          { action: &apos;dismiss&apos;, title: &apos;Dismiss&apos; }
        ],
        requireInteraction: true
      }),

      trade_accepted: (data: any) => ({
}
        title: &apos;✅ Trade Accepted&apos;,
        body: `Your trade with ${data.otherTeam} was accepted!`,
        icon: &apos;/icon-trade.png&apos;,
        tag: &apos;trade_accepted&apos;,
        data: { type: &apos;trade_accepted&apos;, tradeId: data.tradeId },
        actions: [
          { action: &apos;view_team&apos;, title: &apos;View Team&apos; },
          { action: &apos;dismiss&apos;, title: &apos;Dismiss&apos; }
        ]
      }),

      waiver_result: (data: any) => ({
}
        title: data.success ? &apos;✅ Waiver Claim Successful&apos; : &apos;❌ Waiver Claim Failed&apos;,
        body: data.success 
          ? `You successfully claimed ${data.playerName}!`
          : `Your claim for ${data.playerName} was unsuccessful.`,
        icon: &apos;/icon-waiver.png&apos;,
        tag: &apos;waiver_result&apos;,
        data: { type: &apos;waiver_result&apos;, playerId: data.playerId },
        actions: [
          { action: &apos;view_team&apos;, title: &apos;View Team&apos; },
          { action: &apos;view_waivers&apos;, title: &apos;View Waivers&apos; }
        ]
      }),

      score_update: (data: any) => ({
}
        title: &apos;🏈 Score Update&apos;,
        body: `${data.playerName} just scored! Your team: ${data.currentScore} pts`,
        icon: &apos;/icon-score.png&apos;,
        tag: &apos;score_update&apos;,
        data: { type: &apos;score_update&apos;, playerId: data.playerId },
        actions: [
          { action: &apos;view_scores&apos;, title: &apos;View Scores&apos; },
          { action: &apos;dismiss&apos;, title: &apos;Dismiss&apos; }
        ],
        vibrate: [100, 50, 100, 50, 100]
      }),

      matchup_reminder: (data: any) => ({
}
        title: &apos;⏰ Lineup Reminder&apos;,
        body: `Don&apos;t forget to set your lineup! Game starts in ${data.timeUntil}.`,
        icon: &apos;/icon-lineup.png&apos;,
        tag: &apos;lineup_reminder&apos;,
        data: { type: &apos;lineup_reminder&apos; },
        actions: [
          { action: &apos;view_team&apos;, title: &apos;Set Lineup&apos; },
          { action: &apos;dismiss&apos;, title: &apos;Dismiss&apos; }
        ],
        requireInteraction: true
      }),

      message_received: (data: any) => ({
}
        title: &apos;💬 New Message&apos;,
        body: `${data.senderName}: ${data.messagePreview}`,
        icon: &apos;/icon-message.png&apos;,
        tag: &apos;message_received&apos;,
        data: { type: &apos;message_received&apos;, conversationId: data.conversationId },
        actions: [
          { action: &apos;view_message&apos;, title: &apos;Reply&apos; },
          { action: &apos;dismiss&apos;, title: &apos;Dismiss&apos; }
        ]
      }),

      draft_reminder: (data: any) => ({
}
        title: &apos;🏈 Draft Starting Soon&apos;,
        body: `Your draft starts in ${data.timeUntil}. Get ready!`,
        icon: &apos;/icon-draft.png&apos;,
        tag: &apos;draft_reminder&apos;,
        data: { type: &apos;draft_reminder&apos; },
        actions: [
          { action: &apos;join_draft&apos;, title: &apos;Join Draft&apos; },
          { action: &apos;dismiss&apos;, title: &apos;Dismiss&apos; }
        ],
        requireInteraction: true,
        vibrate: [300, 100, 300, 100, 300]
      }),

      weekly_recap: (data: any) => ({
}
        title: &apos;📊 Weekly Recap Available&apos;,
        body: `Week ${data.week} recap is ready! See how you performed.`,
        icon: &apos;/icon-recap.png&apos;,
        tag: &apos;weekly_recap&apos;,
        data: { type: &apos;weekly_recap&apos;, week: data.week },
        actions: [
          { action: &apos;view_recap&apos;, title: &apos;View Recap&apos; },
          { action: &apos;dismiss&apos;, title: &apos;Dismiss&apos; }
        ]
      })
    };

    return templates[type]?.(data) || {
}
      title: &apos;Astral Draft&apos;,
      body: &apos;You have a new notification&apos;,
      icon: &apos;/icon-192.png&apos;,
      tag: &apos;default&apos;,
      data: { type: &apos;default&apos; }
    };
  }

  /**
   * Schedule a notification for later
   */
  async scheduleNotification(payload: NotificationPayload, delay: number): Promise<void> {
}
    setTimeout(() => {
}
      this.showNotification(payload);
    }, delay);
  }

  /**
   * Get current subscription status
   */
  async getSubscriptionStatus(): Promise<{
}
    supported: boolean;
    permission: NotificationPermission;
    subscribed: boolean;
    subscription: PushSubscription | null;
  }> {
}
    const supported = &apos;serviceWorker&apos; in navigator && &apos;PushManager&apos; in window;
    const permission = &apos;Notification&apos; in window ? Notification.permission : &apos;denied&apos;;
    
    let subscribed = false;
    let subscription = null;

    if (supported && this.registration) {
}
      subscription = await this.registration.pushManager.getSubscription();
      subscribed = !!subscription;
    }

    return {
}
      supported,
      permission,
      subscribed,
//       subscription
    };
  }

  /**
   * Send subscription to server
   */
  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
}
    try {
}
      // In a real app, send this to your backend
      const response = await fetch(&apos;/api/push-subscription&apos;, {
}
        method: &apos;POST&apos;,
        headers: {
}
          &apos;Content-Type&apos;: &apos;application/json&apos;,
        },
        body: JSON.stringify({
}
          subscription,
          userId: this.getCurrentUserId(),
          timestamp: Date.now()
        })
      });

      if (!response.ok) {
}
        throw new Error(&apos;Failed to save subscription&apos;);
      }

      console.log(&apos;Subscription saved to server&apos;);
    } catch (error) {
}
      console.error(&apos;Failed to send subscription to server:&apos;, error);
      // Store locally as fallback
      localStorage.setItem(&apos;push_subscription&apos;, JSON.stringify(subscription));
    }
  }

  /**
   * Remove subscription from server
   */
  private async removeSubscriptionFromServer(): Promise<void> {
}
    try {
}
      await fetch(&apos;/api/push-subscription&apos;, {
}
        method: &apos;DELETE&apos;,
        headers: {
}
          &apos;Content-Type&apos;: &apos;application/json&apos;,
        },
        body: JSON.stringify({
}
          userId: this.getCurrentUserId()
        })
      });

      console.log(&apos;Subscription removed from server&apos;);
    } catch (error) {
}
      console.error(&apos;Failed to remove subscription from server:&apos;, error);
      // Remove from local storage as fallback
      localStorage.removeItem(&apos;push_subscription&apos;);
    }
  }

  /**
   * Convert VAPID key to Uint8Array
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
   * Get current user ID (implement based on your auth system)
   */
  private getCurrentUserId(): string {
}
    // This should return the current user&apos;s ID from your auth system
    return localStorage.getItem(&apos;user_id&apos;) || &apos;anonymous&apos;;
  }
}

// Export singleton instance
export const pushNotificationService = new PushNotificationService();
export default pushNotificationService;