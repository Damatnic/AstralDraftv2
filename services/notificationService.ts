/**
 * Oracle Notification Service
 * Handles browser notifications, in-app notifications, and notification preferences
 */

export interface OracleNotification {
}
    id: string;
    type: &apos;deadline_warning&apos; | &apos;result_announced&apos; | &apos;accuracy_update&apos; | &apos;streak_milestone&apos; | &apos;ranking_change&apos;;
    title: string;
    message: string;
    predictionId?: string;
    timestamp: string;
    isRead: boolean;
    priority: &apos;low&apos; | &apos;medium&apos; | &apos;high&apos;;
    actionUrl?: string;
    data?: Record<string, any>;
}

export interface NotificationPreferences {
}
    browserNotifications: boolean;
    inAppNotifications: boolean;
    emailNotifications: boolean;
    deadlineWarnings: boolean;
    resultAnnouncements: boolean;
    accuracyUpdates: boolean;
    streakMilestones: boolean;
    rankingChanges: boolean;
    timeBeforeDeadline: number; // minutes
}

class NotificationService {
}
    private static instance: NotificationService;
    private notifications: OracleNotification[] = [];
    private preferences: NotificationPreferences;
    private notificationCallbacks: ((notification: OracleNotification) => void)[] = [];

    private constructor() {
}
        this.preferences = this.loadPreferences();
        this.loadNotifications();
        this.requestNotificationPermission();
    }

    static getInstance(): NotificationService {
}
        if (!NotificationService.instance) {
}
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    // Notification Management
    async addNotification(notification: Omit<OracleNotification, &apos;id&apos; | &apos;timestamp&apos; | &apos;isRead&apos;>): Promise<void> {
}
        const newNotification: OracleNotification = {
}
            ...notification,
            id: this.generateId(),
            timestamp: new Date().toISOString(),
            isRead: false
        };

        this.notifications.unshift(newNotification);
        this.saveNotifications();

        // Send browser notification if enabled and permission granted
        if (this.preferences.browserNotifications && this.shouldSendNotification(notification.type)) {
}
            await this.sendBrowserNotification(newNotification);
        }

        // Trigger in-app notification callbacks
        if (this.preferences.inAppNotifications) {
}
            this.notificationCallbacks.forEach((callback: any) => callback(newNotification));
        }
    }

    getNotifications(): OracleNotification[] {
}
        return [...this.notifications];
    }

    getUnreadNotifications(): OracleNotification[] {
}
        return this.notifications.filter((n: any) => !n.isRead);
    }

    markAsRead(notificationId: string): void {
}
        const notification = this.notifications.find((n: any) => n.id === notificationId);
        if (notification) {
}
            notification.isRead = true;
            this.saveNotifications();
        }
    }

    markAllAsRead(): void {
}
        this.notifications.forEach((n: any) => n.isRead = true);
        this.saveNotifications();
    }

    clearNotifications(): void {
}
        this.notifications = [];
        this.saveNotifications();
    }

    // Prediction-specific notifications
    async notifyPredictionDeadline(predictionId: string, question: string, minutesRemaining: number): Promise<void> {
}
        if (!this.preferences.deadlineWarnings) return;

        await this.addNotification({
}
            type: &apos;deadline_warning&apos;,
            title: &apos;⏰ Prediction Deadline Approaching&apos;,
            message: `"${question}" expires in ${minutesRemaining} minutes`,
            predictionId,
            priority: minutesRemaining <= 15 ? &apos;high&apos; : &apos;medium&apos;,
            actionUrl: `/oracle?prediction=${predictionId}`
        });
    }

    async notifyPredictionResult(predictionId: string, question: string, isCorrect: boolean, pointsEarned: number): Promise<void> {
}
        if (!this.preferences.resultAnnouncements) return;

        await this.addNotification({
}
            type: &apos;result_announced&apos;,
            title: isCorrect ? &apos;🎉 Correct Prediction!&apos; : &apos;📊 Prediction Result&apos;,
            message: `"${question}" - You ${isCorrect ? &apos;were correct&apos; : &apos;missed this one&apos;}. ${pointsEarned > 0 ? `+${pointsEarned} points` : &apos;No points earned&apos;}`,
            predictionId,
            priority: isCorrect ? &apos;high&apos; : &apos;medium&apos;,
            actionUrl: &apos;/oracle/analytics&apos;,
            data: { isCorrect, pointsEarned }
        });
    }

    async notifyAccuracyUpdate(newAccuracy: number, previousAccuracy: number): Promise<void> {
}
        if (!this.preferences.accuracyUpdates) return;

        const isImprovement = newAccuracy > previousAccuracy;
        const change = Math.abs(newAccuracy - previousAccuracy);

        if (change >= 5) { // Only notify for significant changes
}
            await this.addNotification({
}
                type: &apos;accuracy_update&apos;,
                title: isImprovement ? &apos;📈 Accuracy Improved!&apos; : &apos;📉 Accuracy Update&apos;,
                message: `Your prediction accuracy ${isImprovement ? &apos;increased&apos; : &apos;decreased&apos;} to ${newAccuracy.toFixed(1)}%`,
                priority: isImprovement ? &apos;medium&apos; : &apos;low&apos;,
                actionUrl: &apos;/oracle/analytics&apos;,
                data: { newAccuracy, previousAccuracy, change }
            });
        }
    }

    async notifyStreakMilestone(streakCount: number): Promise<void> {
}
        if (!this.preferences.streakMilestones) return;

        const milestones = [3, 5, 10, 15, 20, 25];
        if (milestones.includes(streakCount)) {
}
            await this.addNotification({
}
                type: &apos;streak_milestone&apos;,
                title: &apos;🔥 Streak Milestone!&apos;,
                message: `You&apos;ve reached a ${streakCount}-prediction winning streak!`,
                priority: &apos;high&apos;,
                actionUrl: &apos;/oracle/analytics&apos;,
                data: { streakCount }
            });
        }
    }

    async notifyRankingChange(newRank: number, previousRank: number): Promise<void> {
}
        if (!this.preferences.rankingChanges) return;

        const isImprovement = newRank < previousRank;
        const change = Math.abs(newRank - previousRank);

        if (change >= 1) {
}
            await this.addNotification({
}
                type: &apos;ranking_change&apos;,
                title: isImprovement ? &apos;🏆 Rank Improved!&apos; : &apos;📊 Ranking Update&apos;,
                message: `You ${isImprovement ? &apos;climbed&apos; : &apos;dropped&apos;} to rank #${newRank}`,
                priority: isImprovement ? &apos;medium&apos; : &apos;low&apos;,
                actionUrl: &apos;/oracle/analytics&apos;,
                data: { newRank, previousRank, change }
            });
        }
    }

    // Browser Notifications
    private async requestNotificationPermission(): Promise<void> {
}
        if (!(&apos;Notification&apos; in window)) {
}
            console.warn(&apos;Browser does not support notifications&apos;);
            return;
        }

        if (Notification.permission === &apos;default&apos;) {
}
            await Notification.requestPermission();
        }
    }

    private async sendBrowserNotification(notification: OracleNotification): Promise<void> {
}
        if (!(&apos;Notification&apos; in window) || Notification.permission !== &apos;granted&apos;) {
}
            return;
        }

        const browserNotification = new Notification(notification.title, {
}
            body: notification.message,
            icon: &apos;/favicon.svg&apos;,
            badge: &apos;/favicon.svg&apos;,
            tag: notification.id,
            requireInteraction: notification.priority === &apos;high&apos;,
            data: {
}
                notificationId: notification.id,
                actionUrl: notification.actionUrl
            }
        });

        browserNotification.onclick = () => {
}
            window.focus();
            this.markAsRead(notification.id);
            
            if (notification.actionUrl) {
}
                window.location.href = notification.actionUrl;
            }
            
            browserNotification.close();
        };

        // Auto-close after 10 seconds for non-high priority notifications
        if (notification.priority !== &apos;high&apos;) {
}
            setTimeout(() => {
}
                browserNotification.close();
            }, 10000);
        }
    }

    // Preferences Management
    getPreferences(): NotificationPreferences {
}
        return { ...this.preferences };
    }

    updatePreferences(newPreferences: Partial<NotificationPreferences>): void {
}
        this.preferences = { ...this.preferences, ...newPreferences };
        this.savePreferences();
    }

    private loadPreferences(): NotificationPreferences {
}
        const defaultPreferences: NotificationPreferences = {
}
            browserNotifications: true,
            inAppNotifications: true,
            emailNotifications: false,
            deadlineWarnings: true,
            resultAnnouncements: true,
            accuracyUpdates: true,
            streakMilestones: true,
            rankingChanges: true,
            timeBeforeDeadline: 30 // 30 minutes
        };

        try {
}
            const saved = localStorage.getItem(&apos;oracle_notification_preferences&apos;);
            return saved ? { ...defaultPreferences, ...JSON.parse(saved) } : defaultPreferences;
        } catch {
}
            return defaultPreferences;
        }
    }

    private savePreferences(): void {
}
        try {
}
            localStorage.setItem(&apos;oracle_notification_preferences&apos;, JSON.stringify(this.preferences));
        } catch (error) {
}
            console.warn(&apos;Failed to save notification preferences:&apos;, error);
        }
    }

    private loadNotifications(): void {
}
        try {
}
            const saved = localStorage.getItem(&apos;oracle_notifications&apos;);
            if (saved) {
}
                this.notifications = JSON.parse(saved);
                // Clean up old notifications (older than 7 days)
                const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
                this.notifications = this.notifications.filter((n: any) => n.timestamp > cutoff);
                this.saveNotifications();
            }
        } catch (error) {
}
            console.warn(&apos;Failed to load notifications:&apos;, error);
            this.notifications = [];
        }
    }

    private saveNotifications(): void {
}
        try {
}
            // Only keep the most recent 50 notifications
            const toSave = this.notifications.slice(0, 50);
            localStorage.setItem(&apos;oracle_notifications&apos;, JSON.stringify(toSave));
        } catch (error) {
}
            console.warn(&apos;Failed to save notifications:&apos;, error);
        }
    }

    private shouldSendNotification(type: OracleNotification[&apos;type&apos;]): boolean {
}
        switch (type) {
}
            case &apos;deadline_warning&apos;:
                return this.preferences.deadlineWarnings;
            case &apos;result_announced&apos;:
                return this.preferences.resultAnnouncements;
            case &apos;accuracy_update&apos;:
                return this.preferences.accuracyUpdates;
            case &apos;streak_milestone&apos;:
                return this.preferences.streakMilestones;
            case &apos;ranking_change&apos;:
                return this.preferences.rankingChanges;
            default:
                return true;
        }
    }

    private generateId(): string {
}
        return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Callback Management
    onNotification(callback: (notification: OracleNotification) => void): () => void {
}
        this.notificationCallbacks.push(callback);
        return () => {
}
            const index = this.notificationCallbacks.indexOf(callback);
            if (index > -1) {
}
                this.notificationCallbacks.splice(index, 1);
            }
        };
    }

    // Scheduling for deadline notifications
    scheduleDeadlineNotifications(predictionId: string, question: string, expiresAt: string): void {
}
        const expireTime = new Date(expiresAt).getTime();
        const now = Date.now();

        // Schedule notifications at different intervals
        const intervals = [
            this.preferences.timeBeforeDeadline * 60 * 1000, // User preference
            15 * 60 * 1000, // 15 minutes
            5 * 60 * 1000,  // 5 minutes
            1 * 60 * 1000   // 1 minute
        ];

        intervals.forEach((interval: any) => {
}
            const notificationTime = expireTime - interval;
            if (notificationTime > now) {
}
                const timeoutDuration = notificationTime - now;
                setTimeout(() => {
}
                    const minutesRemaining = Math.floor(interval / (60 * 1000));
                    this.notifyPredictionDeadline(predictionId, question, minutesRemaining);
                }, timeoutDuration);
            }
        });
    }
}

export const notificationService = NotificationService.getInstance();
export default notificationService;
