/**
 * Enhanced Notification Service
 * Comprehensive notification system for draft alerts, Oracle predictions, and league updates
 */

import { authService } from &apos;./authService&apos;;

// Enhanced notification types
export type EnhancedNotificationType = 
    | &apos;DRAFT&apos; 
    | &apos;TRADE&apos; 
    | &apos;WAIVER&apos; 
    | &apos;SYSTEM&apos; 
    | &apos;ORACLE_PREDICTION&apos; 
    | &apos;ORACLE_RESULT&apos; 
    | &apos;DRAFT_PICK&apos; 
    | &apos;DRAFT_START&apos; 
    | &apos;DRAFT_PAUSE&apos; 
    | &apos;LEAGUE_UPDATE&apos; 
    | &apos;ACHIEVEMENT&apos; 
    | &apos;REMINDER&apos; 
    | &apos;SOCIAL&apos;
    | &apos;MATCHUP_UPDATE&apos;;

export type NotificationPriority = &apos;low&apos; | &apos;medium&apos; | &apos;high&apos; | &apos;urgent&apos;;

export interface EnhancedNotification {
}
    id: string;
    title: string;
    message: string;
    type: EnhancedNotificationType;
    priority: NotificationPriority;
    userId: string;
    leagueId?: string;
    data?: any;
    isRead: boolean;
    isArchived: boolean;
    createdAt: Date;
    scheduledFor?: Date;
    expiresAt?: Date;
    actionUrl?: string;
    actionText?: string;
    imageUrl?: string;
    category: &apos;draft&apos; | &apos;oracle&apos; | &apos;league&apos; | &apos;system&apos;;
}

export interface NotificationPreferences {
}
    userId: string;
    enablePushNotifications: boolean;
    enableInAppNotifications: boolean;
    enableEmailNotifications: boolean;
    enableSoundNotifications: boolean;
    categories: {
}
        draft: {
}
            enabled: boolean;
            pushEnabled: boolean;
            emailEnabled: boolean;
            pickReminders: boolean;
            draftStart: boolean;
            draftEnd: boolean;
            autopickWarnings: boolean;
        };
        oracle: {
}
            enabled: boolean;
            pushEnabled: boolean;
            emailEnabled: boolean;
            predictionUpdates: boolean;
            challengeReminders: boolean;
            resultsAvailable: boolean;
            achievementUnlocked: boolean;
        };
        league: {
}
            enabled: boolean;
            pushEnabled: boolean;
            emailEnabled: boolean;
            tradeProposals: boolean;
            waiverResults: boolean;
            matchupUpdates: boolean;
            leagueAnnouncements: boolean;
        };
        system: {
}
            enabled: boolean;
            pushEnabled: boolean;
            emailEnabled: boolean;
            maintenanceAlerts: boolean;
            featureUpdates: boolean;
            securityAlerts: boolean;
        };
    };
    quietHours: {
}
        enabled: boolean;
        startTime: string; // "22:00"
        endTime: string;   // "08:00"
        timezone: string;
    };
    maxNotificationsPerDay: number;
}

export interface NotificationChannel {
}
    id: string;
    name: string;
    type: &apos;push&apos; | &apos;email&apos; | &apos;in-app&apos; | &apos;webhook&apos;;
    enabled: boolean;
    config: any;
}

export interface NotificationTemplate {
}
    id: string;
    type: EnhancedNotificationType;
    title: string;
    messageTemplate: string;
    variables: string[];
    defaultPriority: NotificationPriority;
}

export interface NotificationStats {
}
    totalSent: number;
    totalRead: number;
    readRate: number;
    averageReadTime: number;
    topTypes: { type: EnhancedNotificationType; count: number }[];
    engagementByCategory: { [category: string]: number };
}

class EnhancedNotificationService {
}
    private readonly notifications: Map<string, EnhancedNotification[]> = new Map();
    private readonly userPreferences: Map<string, NotificationPreferences> = new Map();
    private notificationChannels: NotificationChannel[] = [];
    private readonly templates: Map<string, NotificationTemplate> = new Map();
    private offlineQueue: EnhancedNotification[] = [];
    private isOnline: boolean = navigator.onLine;
    private serviceWorker: ServiceWorkerRegistration | null = null;
    private readonly eventListeners: Map<string, Function[]> = new Map();

    constructor() {
}
        this.setupNetworkListeners();
        this.loadDefaultTemplates();
        
        // Initialize async operations
        setTimeout(() => {
}
            this.initializeService();
            this.setupServiceWorker();
        }, 0);
    }

    private async initializeService(): Promise<void> {
}
        try {
}
            // Load user preferences from storage
            await this.loadUserPreferences();
            
            // Setup notification channels
            this.setupNotificationChannels();
            
            // Setup periodic cleanup
            this.setupCleanupSchedule();
            
            console.log(&apos;📱 Enhanced Notification Service initialized&apos;);
        } catch (error) {
}
            console.error(&apos;Failed to initialize notification service:&apos;, error);
        }
    }

    private async setupServiceWorker(): Promise<void> {
}
        if (&apos;serviceWorker&apos; in navigator) {
}
            try {
}
                this.serviceWorker = await navigator.serviceWorker.ready;
                console.log(&apos;🔧 Service Worker ready for notifications&apos;);
            } catch (error) {
}
                console.error(&apos;Service Worker setup failed:&apos;, error);
            }
        }
    }

    private setupNetworkListeners(): void {
}
        window.addEventListener(&apos;online&apos;, () => {
}
            this.isOnline = true;
            this.processOfflineQueue();
        });

        window.addEventListener(&apos;offline&apos;, () => {
}
            this.isOnline = false;
        });
    }

    private loadDefaultTemplates(): void {
}
        const defaultTemplates: NotificationTemplate[] = [
            {
}
                id: &apos;draft-pick-reminder&apos;,
                type: &apos;DRAFT_PICK&apos;,
                title: &apos;Your Turn to Pick!&apos;,
                messageTemplate: &apos;It\&apos;s your turn to pick in the {{leagueName}} draft. Time remaining: {{timeRemaining}}&apos;,
                variables: [&apos;leagueName&apos;, &apos;timeRemaining&apos;],
                defaultPriority: &apos;urgent&apos;
            },
            {
}
                id: &apos;oracle-prediction-update&apos;,
                type: &apos;ORACLE_PREDICTION&apos;,
                title: &apos;Oracle Prediction Updated&apos;,
                messageTemplate: &apos;Oracle updated prediction for {{question}} - Confidence: {{confidence}}%&apos;,
                variables: [&apos;question&apos;, &apos;confidence&apos;],
                defaultPriority: &apos;medium&apos;
            },
            {
}
                id: &apos;trade-proposal&apos;,
                type: &apos;TRADE&apos;,
                title: &apos;New Trade Proposal&apos;,
                messageTemplate: &apos;{{fromTeam}} sent you a trade proposal in {{leagueName}}&apos;,
                variables: [&apos;fromTeam&apos;, &apos;leagueName&apos;],
                defaultPriority: &apos;medium&apos;
            },
            {
}
                id: &apos;league-announcement&apos;,
                type: &apos;LEAGUE_UPDATE&apos;,
                title: &apos;League Announcement&apos;,
                messageTemplate: &apos;New announcement from {{commissionerName}} in {{leagueName}}: {{announcement}}&apos;,
                variables: [&apos;commissionerName&apos;, &apos;leagueName&apos;, &apos;announcement&apos;],
                defaultPriority: &apos;medium&apos;
            },
            {
}
                id: &apos;achievement-unlocked&apos;,
                type: &apos;ACHIEVEMENT&apos;,
                title: &apos;Achievement Unlocked! 🏆&apos;,
                messageTemplate: &apos;You unlocked {{achievementName}}: {{achievementDescription}}&apos;,
                variables: [&apos;achievementName&apos;, &apos;achievementDescription&apos;],
                defaultPriority: &apos;low&apos;
            }
        ];

        defaultTemplates.forEach((template: any) => {
}
            this.templates.set(template.id, template);
        });
    }

    private setupNotificationChannels(): void {
}
        this.notificationChannels = [
            {
}
                id: &apos;push&apos;,
                name: &apos;Push Notifications&apos;,
                type: &apos;push&apos;,
                enabled: true,
                config: {}
            },
            {
}
                id: &apos;in-app&apos;,
                name: &apos;In-App Notifications&apos;,
                type: &apos;in-app&apos;,
                enabled: true,
                config: {}
            }
        ];
    }

    private setupCleanupSchedule(): void {
}
        // Clean up old notifications every hour
        setInterval(() => {
}
            this.cleanupExpiredNotifications();
        }, 60 * 60 * 1000);
    }

    // Core notification methods
    async sendNotification(
        userId: string,
        type: EnhancedNotificationType,
        title: string,
        message: string,
        options: Partial<EnhancedNotification> = {}
    ): Promise<EnhancedNotification> {
}
        const notification: EnhancedNotification = {
}
            id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
            title,
            message,
            type,
            priority: options.priority || &apos;medium&apos;,
            userId,
            leagueId: options.leagueId,
            data: options.data,
            isRead: false,
            isArchived: false,
            createdAt: new Date(),
            scheduledFor: options.scheduledFor,
            expiresAt: options.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            actionUrl: options.actionUrl,
            actionText: options.actionText,
            imageUrl: options.imageUrl,
            category: this.getCategoryFromType(type)
        };

        // Check user preferences
        const preferences = await this.getUserPreferences(userId);
        if (!this.shouldSendNotification(notification, preferences)) {
}
            return notification;
        }

        // Store notification
        await this.storeNotification(notification);

        // Send through appropriate channels
        if (this.isOnline) {
}
            await this.deliverNotification(notification, preferences);
        } else {
}
            this.offlineQueue.push(notification);
        }

        // Emit event for real-time updates
        this.emitNotificationEvent(&apos;new&apos;, notification);

        return notification;
    }

    async sendFromTemplate(
        templateId: string,
        userId: string,
        variables: { [key: string]: string },
        options: Partial<EnhancedNotification> = {}
    ): Promise<EnhancedNotification | null> {
}
        const template = this.templates.get(templateId);
        if (!template) {
}
            console.error(`Template not found: ${templateId}`);
            return null;
        }

        let message = template.messageTemplate;
        template.variables.forEach((variable: any) => {
}
            const value = variables[variable] || &apos;&apos;;
            message = message.replace(new RegExp(`{{${variable}}}`, &apos;g&apos;), value);
        });

        return this.sendNotification(
            userId,
            template.type,
            template.title,
            message,
            {
}
                priority: template.defaultPriority,
                ...options
            }
        );
    }

    async scheduleNotification(
        userId: string,
        type: EnhancedNotificationType,
        title: string,
        message: string,
        scheduledFor: Date,
        options: Partial<EnhancedNotification> = {}
    ): Promise<EnhancedNotification> {
}
        return this.sendNotification(userId, type, title, message, {
}
            ...options,
//             scheduledFor
        });
    }

    // Draft-specific notifications
    async sendDraftPickReminder(
        userId: string,
        leagueId: string,
        timeRemaining: number,
        pickNumber: number
    ): Promise<void> {
}
        const timeText = this.formatTimeRemaining(timeRemaining);
        
        await this.sendFromTemplate(&apos;draft-pick-reminder&apos;, userId, {
}
            leagueName: &apos;Draft League&apos;,
            timeRemaining: timeText
        }, {
}
            leagueId,
            priority: &apos;urgent&apos;,
            actionUrl: `/draft/${leagueId}`,
            actionText: &apos;Make Pick&apos;,
            data: { pickNumber, timeRemaining }
        });
    }

    async sendDraftStartAlert(
        userIds: string[],
        leagueId: string,
        startTime: Date
    ): Promise<void> {
}
        const promises = userIds.map((userId: any) =>
            this.sendNotification(
                userId,
                &apos;DRAFT_START&apos;,
                &apos;Draft Starting Soon! 🏈&apos;,
                `Your draft is starting in 15 minutes. Get ready!`,
                {
}
                    leagueId,
                    priority: &apos;high&apos;,
                    actionUrl: `/draft/${leagueId}`,
                    actionText: &apos;Join Draft&apos;,
                    scheduledFor: new Date(startTime.getTime() - 15 * 60 * 1000)
                }
            )
        );

        await Promise.all(promises);
    }

    // Oracle-specific notifications
    async sendOraclePredictionUpdate(
        userId: string,
        predictionId: string,
        question: string,
        confidence: number,
        reasoning?: string
    ): Promise<void> {
}
        await this.sendFromTemplate(&apos;oracle-prediction-update&apos;, userId, {
}
            question,
            confidence: confidence.toString()
        }, {
}
            priority: &apos;medium&apos;,
            actionUrl: `/oracle/predictions/${predictionId}`,
            actionText: &apos;View Prediction&apos;,
            data: { predictionId, confidence, reasoning }
        });
    }

    async sendOracleResultNotification(
        userId: string,
        challengeId: string,
        result: &apos;won&apos; | &apos;lost&apos;,
        points: number
    ): Promise<void> {
}
        const title = result === &apos;won&apos; ? &apos;Oracle Challenge Won! 🎉&apos; : &apos;Oracle Challenge Complete&apos;;
        const message = result === &apos;won&apos; 
            ? `Congratulations! You earned ${points} points.`
            : `Challenge complete. Better luck next time!`;

        await this.sendNotification(
            userId,
            &apos;ORACLE_RESULT&apos;,
            title,
            message,
            {
}
                priority: result === &apos;won&apos; ? &apos;medium&apos; : &apos;low&apos;,
                actionUrl: `/oracle/challenges/${challengeId}`,
                actionText: &apos;View Result&apos;,
                data: { challengeId, result, points }
            }
        );
    }

    // League-specific notifications
    async sendTradeProposal(
        userId: string,
        fromTeamName: string,
        leagueId: string,
        tradeId: string
    ): Promise<void> {
}
        await this.sendFromTemplate(&apos;trade-proposal&apos;, userId, {
}
            fromTeam: fromTeamName,
            leagueName: &apos;League&apos;
        }, {
}
            leagueId,
            priority: &apos;medium&apos;,
            actionUrl: `/league/${leagueId}/trades/${tradeId}`,
            actionText: &apos;Review Trade&apos;,
            data: { tradeId, fromTeamName }
        });
    }

    async sendLeagueAnnouncement(
        userIds: string[],
        leagueId: string,
        commissionerName: string,
        announcement: string
    ): Promise<void> {
}
        const promises = userIds.map((userId: any) =>
            this.sendFromTemplate(&apos;league-announcement&apos;, userId, {
}
                commissionerName,
                leagueName: &apos;League&apos;,
                announcement: announcement.substring(0, 100) + (announcement.length > 100 ? &apos;...&apos; : &apos;&apos;)
            }, {
}
                leagueId,
                priority: &apos;medium&apos;,
                actionUrl: `/league/${leagueId}/announcements`,
                actionText: &apos;View Details&apos;,
                data: { announcement, commissionerName }
            })
        );

        await Promise.all(promises);
    }

    // Notification management
    async getNotifications(
        userId: string,
        options: {
}
            category?: string;
            limit?: number;
            offset?: number;
            unreadOnly?: boolean;
        } = {}
    ): Promise<EnhancedNotification[]> {
}
        const userNotifications = this.notifications.get(userId) || [];
        
        let filtered = userNotifications;
        
        if (options.category) {
}
            filtered = filtered.filter((n: any) => n.category === options.category);
        }
        
        if (options.unreadOnly) {
}
            filtered = filtered.filter((n: any) => !n.isRead);
        }
        
        // Sort by priority and creation date
        filtered.sort((a, b) => {
}
            const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
            const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
            if (priorityDiff !== 0) return priorityDiff;
            return b.createdAt.getTime() - a.createdAt.getTime();
        });
        
        const offset = options.offset || 0;
        const limit = options.limit || 50;
        
        return filtered.slice(offset, offset + limit);
    }

    async markAsRead(userId: string, notificationId: string): Promise<void> {
}
        const userNotifications = this.notifications.get(userId) || [];
        const notification = userNotifications.find((n: any) => n.id === notificationId);
        
        if (notification && !notification.isRead) {
}
            notification.isRead = true;
            await this.saveNotifications(userId);
            this.emitNotificationEvent(&apos;read&apos;, notification);
        }
    }

    async markAllAsRead(userId: string, category?: string): Promise<void> {
}
        const userNotifications = this.notifications.get(userId) || [];
        
        userNotifications.forEach((notification: any) => {
}
            if (!notification.isRead && (!category || notification.category === category)) {
}
                notification.isRead = true;
                this.emitNotificationEvent(&apos;read&apos;, notification);
            }
        });
        
        await this.saveNotifications(userId);
    }

    async archiveNotification(userId: string, notificationId: string): Promise<void> {
}
        const userNotifications = this.notifications.get(userId) || [];
        const notification = userNotifications.find((n: any) => n.id === notificationId);
        
        if (notification) {
}
            notification.isArchived = true;
            await this.saveNotifications(userId);
            this.emitNotificationEvent(&apos;archived&apos;, notification);
        }
    }

    async deleteNotification(userId: string, notificationId: string): Promise<void> {
}
        const userNotifications = this.notifications.get(userId) || [];
        const index = userNotifications.findIndex(n => n.id === notificationId);
        
        if (index !== -1) {
}
            const notification = userNotifications[index];
            userNotifications.splice(index, 1);
            await this.saveNotifications(userId);
            this.emitNotificationEvent(&apos;deleted&apos;, notification);
        }
    }

    // Preferences management
    async getUserPreferences(userId: string): Promise<NotificationPreferences> {
}
        let preferences = this.userPreferences.get(userId);
        
        if (!preferences) {
}
            preferences = this.getDefaultPreferences(userId);
            this.userPreferences.set(userId, preferences);
            await this.saveUserPreferences(userId);
        }
        
        return preferences;
    }

    async updateUserPreferences(
        userId: string,
        updates: Partial<NotificationPreferences>
    ): Promise<void> {
}
        const current = await this.getUserPreferences(userId);
        const updated = { ...current, ...updates };
        
        this.userPreferences.set(userId, updated);
        await this.saveUserPreferences(userId);
        
        this.emitNotificationEvent(&apos;preferencesUpdated&apos;, updated);
    }

    // Utility methods
    private getCategoryFromType(type: EnhancedNotificationType): &apos;draft&apos; | &apos;oracle&apos; | &apos;league&apos; | &apos;system&apos; {
}
        if ([&apos;DRAFT_PICK&apos;, &apos;DRAFT_START&apos;, &apos;DRAFT_PAUSE&apos;].includes(type)) {
}
            return &apos;draft&apos;;
        }
        if ([&apos;ORACLE_PREDICTION&apos;, &apos;ORACLE_RESULT&apos;, &apos;ACHIEVEMENT&apos;].includes(type)) {
}
            return &apos;oracle&apos;;
        }
        if ([&apos;TRADE&apos;, &apos;WAIVER&apos;, &apos;LEAGUE_UPDATE&apos;, &apos;MATCHUP_UPDATE&apos;].includes(type)) {
}
            return &apos;league&apos;;
        }
        return &apos;system&apos;;
    }

    private shouldSendNotification(
        notification: EnhancedNotification,
        preferences: NotificationPreferences
    ): boolean {
}
        // Check if notifications are enabled for this category
        const categoryPrefs = preferences.categories[notification.category];
        if (!categoryPrefs.enabled) return false;

        // Check quiet hours
        if (this.isQuietHours(preferences)) return false;

        // Check daily limit (implement more sophisticated counting later if needed)
        return true;
    }

    private isQuietHours(preferences: NotificationPreferences): boolean {
}
        if (!preferences.quietHours.enabled) return false;

        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, &apos;0&apos;)}:${now.getMinutes().toString().padStart(2, &apos;0&apos;)}`;
        
        const start = preferences.quietHours.startTime;
        const end = preferences.quietHours.endTime;
        
        if (start <= end) {
}
            return currentTime >= start && currentTime <= end;
        } else {
}
            // Quiet hours span midnight
            return currentTime >= start || currentTime <= end;
        }
    }

    private async deliverNotification(
        notification: EnhancedNotification,
        preferences: NotificationPreferences
    ): Promise<void> {
}
        const categoryPrefs = preferences.categories[notification.category];

        // Push notification
        if (categoryPrefs.pushEnabled && preferences.enablePushNotifications) {
}
            await this.sendPushNotification(notification);
        }

        // In-app notification (always sent for immediate display)
        this.sendInAppNotification(notification);
    }

    private async sendPushNotification(notification: EnhancedNotification): Promise<void> {
}
        if (!this.serviceWorker) return;

        try {
}
            await this.serviceWorker.showNotification(notification.title, {
}
                body: notification.message,
                icon: notification.imageUrl || &apos;/favicon.svg&apos;,
                badge: &apos;/favicon.svg&apos;,
                tag: notification.id,
                data: {
}
                    notificationId: notification.id,
                    actionUrl: notification.actionUrl,
                    category: notification.category
                },
                requireInteraction: notification.priority === &apos;urgent&apos;
            });
        } catch (error) {
}
            console.error(&apos;Failed to send push notification:&apos;, error);
        }
    }

    private sendInAppNotification(notification: EnhancedNotification): void {
}
        // Emit event for in-app notification display
        this.emitNotificationEvent(&apos;display&apos;, notification);
    }

    private formatTimeRemaining(seconds: number): string {
}
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ${minutes % 60}m`;
    }

    private getDefaultPreferences(userId: string): NotificationPreferences {
}
        return {
}
            userId,
            enablePushNotifications: true,
            enableInAppNotifications: true,
            enableEmailNotifications: false,
            enableSoundNotifications: true,
            categories: {
}
                draft: {
}
                    enabled: true,
                    pushEnabled: true,
                    emailEnabled: false,
                    pickReminders: true,
                    draftStart: true,
                    draftEnd: true,
                    autopickWarnings: true
                },
                oracle: {
}
                    enabled: true,
                    pushEnabled: true,
                    emailEnabled: false,
                    predictionUpdates: true,
                    challengeReminders: true,
                    resultsAvailable: true,
                    achievementUnlocked: true
                },
                league: {
}
                    enabled: true,
                    pushEnabled: true,
                    emailEnabled: false,
                    tradeProposals: true,
                    waiverResults: true,
                    matchupUpdates: true,
                    leagueAnnouncements: true
                },
                system: {
}
                    enabled: true,
                    pushEnabled: false,
                    emailEnabled: false,
                    maintenanceAlerts: true,
                    featureUpdates: false,
                    securityAlerts: true
                }
            },
            quietHours: {
}
                enabled: true,
                startTime: &apos;22:00&apos;,
                endTime: &apos;08:00&apos;,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            maxNotificationsPerDay: 50
        };
    }

    // Storage methods
    private async storeNotification(notification: EnhancedNotification): Promise<void> {
}
        const userNotifications = this.notifications.get(notification.userId) || [];
        userNotifications.unshift(notification);
        
        // Keep only last 100 notifications per user
        if (userNotifications.length > 100) {
}
            userNotifications.splice(100);
        }
        
        this.notifications.set(notification.userId, userNotifications);
        await this.saveNotifications(notification.userId);
    }

    private async saveNotifications(userId: string): Promise<void> {
}
        try {
}
            const notifications = this.notifications.get(userId) || [];
            localStorage.setItem(`astral_notifications_${userId}`, JSON.stringify(notifications));
        } catch (error) {
}
            console.error(&apos;Failed to save notifications:&apos;, error);
        }
    }

    private async loadUserPreferences(): Promise<void> {
}
        try {
}
            const user = authService.getCurrentUser();
            if (user) {
}
                const storedPrefs = localStorage.getItem(`astral_notification_prefs_${user.id}`);
                if (storedPrefs) {
}
                    const preferences = JSON.parse(storedPrefs);
                    this.userPreferences.set(user.id.toString(), preferences);
                }
            }
        } catch (error) {
}
            console.error(&apos;Failed to load user preferences:&apos;, error);
        }
    }

    private async saveUserPreferences(userId: string): Promise<void> {
}
        try {
}
            const preferences = this.userPreferences.get(userId);
            if (preferences) {
}
                localStorage.setItem(`astral_notification_prefs_${userId}`, JSON.stringify(preferences));
            }
        } catch (error) {
}
            console.error(&apos;Failed to save user preferences:&apos;, error);
        }
    }

    private cleanupExpiredNotifications(): void {
}
        const now = new Date();
        
        this.notifications.forEach((userNotifications, userId) => {
}
            const filtered = userNotifications.filter((notification: any) => 
                !notification.expiresAt || notification.expiresAt > now
            );
            
            if (filtered.length !== userNotifications.length) {
}
                this.notifications.set(userId, filtered);
                this.saveNotifications(userId);
            }
        });
    }

    private async processOfflineQueue(): Promise<void> {
}
        if (this.offlineQueue.length === 0) return;

        const queue = [...this.offlineQueue];
        this.offlineQueue = [];

        for (const notification of queue) {
}
            try {
}
                const preferences = await this.getUserPreferences(notification.userId);
                await this.deliverNotification(notification, preferences);
            } catch (error) {
}
                console.error(&apos;Failed to process offline notification:&apos;, error);
                // Re-queue on failure
                this.offlineQueue.push(notification);
            }
        }
    }

    // Event handling
    addEventListener(event: string, callback: Function): void {
}
        if (!this.eventListeners.has(event)) {
}
            this.eventListeners.set(event, []);
        }
        const listeners = this.eventListeners.get(event);
        if (listeners) {
}
            listeners.push(callback);
        }
    }

    removeEventListener(event: string, callback: Function): void {
}
        const listeners = this.eventListeners.get(event);
        if (listeners) {
}
            const index = listeners.indexOf(callback);
            if (index !== -1) {
}
                listeners.splice(index, 1);
            }
        }
    }

    private emitNotificationEvent(event: string, data: any): void {
}
        const listeners = this.eventListeners.get(event) || [];
        listeners.forEach((callback: any) => {
}
            try {
}
                callback(data);
            } catch (error) {
}
                console.error(&apos;Notification event callback error:&apos;, error);
            }
        });
    }

    // Stats and analytics
    async getNotificationStats(userId: string): Promise<NotificationStats> {
}
        const notifications = this.notifications.get(userId) || [];
        const read = notifications.filter((n: any) => n.isRead);
        
        const typeCount = notifications.reduce((acc, n) => {
}
            acc[n.type] = (acc[n.type] || 0) + 1;
            return acc;
        }, {} as { [type: string]: number });

        const topTypes = Object.entries(typeCount)
            .map(([type, count]) => ({ type: type as EnhancedNotificationType, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        const categoryCount = notifications.reduce((acc, n) => {
}
            acc[n.category] = (acc[n.category] || 0) + 1;
            return acc;
        }, {} as { [category: string]: number });

        return {
}
            totalSent: notifications.length,
            totalRead: read.length,
            readRate: notifications.length > 0 ? (read.length / notifications.length) * 100 : 0,
            averageReadTime: 0, // Will be implemented with read time tracking in future
            topTypes,
            engagementByCategory: categoryCount
        };
    }
}

// Export singleton instance
export const enhancedNotificationService = new EnhancedNotificationService();
export default enhancedNotificationService;
