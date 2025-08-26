/**
 * Simple Authentication Service
 * Handles 10-player + admin login system with PIN authentication
 */

export interface SimpleUser {
    id: string;
    username: string;
    displayName: string;
    pin: string;
    email?: string;
    isAdmin: boolean;
    customization: {
        backgroundColor: string;
        textColor: string;
        emoji: string;
    };
    createdAt: string;
    lastLogin?: string;
}

export interface AuthSession {
    user: SimpleUser;
    sessionId: string;
    expiresAt: string;
}

class SimpleAuthService {
    private static readonly STORAGE_KEY = 'astral_draft_users';
    private static readonly SESSION_KEY = 'astral_draft_session';
    private static readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

    // Default users: 10 players + 1 admin (Nick Damato is both admin and player1)
    private static readonly DEFAULT_USERS: SimpleUser[] = [
        // Admin user (Nick Damato)
        {
            id: 'admin',
            username: 'admin',
            displayName: 'Nick Damato',
            pin: '7347',
            isAdmin: true,
            customization: {
                backgroundColor: '#3b82f6',
                textColor: '#ffffff',
                emoji: '👑'
            },
            createdAt: new Date().toISOString()
        },
        // Player users with actual names
        {
            id: 'player1',
            username: 'player1',
            displayName: 'Nick Damato',
            pin: '0000',
            isAdmin: true, // Nick is also admin
            customization: {
                backgroundColor: '#3b82f6',
                textColor: '#ffffff',
                emoji: '👑'
            },
            createdAt: new Date().toISOString()
        },
        {
            id: 'player2',
            username: 'player2',
            displayName: 'Jon Kornbeck',
            pin: '0000',
            isAdmin: false,
            customization: {
                backgroundColor: '#ef4444',
                textColor: '#ffffff',
                emoji: '⚡'
            },
            createdAt: new Date().toISOString()
        },
        {
            id: 'player3',
            username: 'player3',
            displayName: 'Cason Minor',
            pin: '0000',
            isAdmin: false,
            customization: {
                backgroundColor: '#10b981',
                textColor: '#ffffff',
                emoji: '🔥'
            },
            createdAt: new Date().toISOString()
        },
        {
            id: 'player4',
            username: 'player4',
            displayName: 'Brittany Bergrum',
            pin: '0000',
            isAdmin: false,
            customization: {
                backgroundColor: '#f59e0b',
                textColor: '#ffffff',
                emoji: '💪'
            },
            createdAt: new Date().toISOString()
        },
        {
            id: 'player5',
            username: 'player5',
            displayName: 'Renee McCaigue',
            pin: '0000',
            isAdmin: false,
            customization: {
                backgroundColor: '#8b5cf6',
                textColor: '#ffffff',
                emoji: '🎯'
            },
            createdAt: new Date().toISOString()
        },
        {
            id: 'player6',
            username: 'player6',
            displayName: 'Jack McCaigue',
            pin: '0000',
            isAdmin: false,
            customization: {
                backgroundColor: '#06b6d4',
                textColor: '#ffffff',
                emoji: '🚀'
            },
            createdAt: new Date().toISOString()
        },
        {
            id: 'player7',
            username: 'player7',
            displayName: 'Larry McCaigue',
            pin: '0000',
            isAdmin: false,
            customization: {
                backgroundColor: '#84cc16',
                textColor: '#ffffff',
                emoji: '⭐'
            },
            createdAt: new Date().toISOString()
        },
        {
            id: 'player8',
            username: 'player8',
            displayName: 'Kaity Lorbiecki',
            pin: '0000',
            isAdmin: false,
            customization: {
                backgroundColor: '#f97316',
                textColor: '#ffffff',
                emoji: '💎'
            },
            createdAt: new Date().toISOString()
        },
        {
            id: 'player9',
            username: 'player9',
            displayName: 'David Jarvey',
            pin: '0000',
            isAdmin: false,
            customization: {
                backgroundColor: '#ec4899',
                textColor: '#ffffff',
                emoji: '🏆'
            },
            createdAt: new Date().toISOString()
        },
        {
            id: 'player10',
            username: 'player10',
            displayName: 'Nick Hartley',
            pin: '0000',
            isAdmin: false,
            customization: {
                backgroundColor: '#6366f1',
                textColor: '#ffffff',
                emoji: '🎮'
            },
            createdAt: new Date().toISOString()
        }
    ];

    /**
     * Initialize the authentication system
     */
    static initialize(): void {
        const existingUsers = this.getAllUsers();
        if (existingUsers.length === 0) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.DEFAULT_USERS));
        }
    }

    /**
     * Get all users from storage
     */
    static getAllUsers(): SimpleUser[] {
        try {
            const usersJson = localStorage.getItem(this.STORAGE_KEY);
            return usersJson ? JSON.parse(usersJson) : [];
        } catch (error) {
            console.error('Failed to load users:', error);
            return [];
        }
    }

    /**
     * Get user by ID
     */
    static getUserById(id: string): SimpleUser | null {
        const users = this.getAllUsers();
        return users.find(user => user.id === id) || null;
    }

    /**
     * Authenticate user with PIN
     */
    static async authenticateUser(userId: string, pin: string): Promise<AuthSession | null> {
        const users = this.getAllUsers();
        const user = users.find(u => u.id === userId);

        if (!user || user.pin !== pin) {
            return null;
        }

        // Update last login
        user.lastLogin = new Date().toISOString();
        this.updateUser(user);

        // Create session
        const session: AuthSession = {
            user,
            sessionId: this.generateSessionId(),
            expiresAt: new Date(Date.now() + this.SESSION_DURATION).toISOString()
        };

        // Store session
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));

        return session;
    }

    /**
     * Get current session
     */
    static getCurrentSession(): AuthSession | null {
        try {
            const sessionJson = localStorage.getItem(this.SESSION_KEY);
            if (!sessionJson) return null;

            const session: AuthSession = JSON.parse(sessionJson);
            
            // Check if session is expired
            if (new Date() > new Date(session.expiresAt)) {
                this.logout();
                return null;
            }

            return session;
        } catch (error) {
            console.error('Failed to load session:', error);
            return null;
        }
    }

    /**
     * Update user PIN
     */
    static updateUserPin(userId: string, newPin: string): boolean {
        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) return false;

        users[userIndex].pin = newPin;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
        
        return true;
    }

    /**
     * Update user email
     */
    static updateUserEmail(userId: string, email: string): boolean {
        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) return false;

        users[userIndex].email = email;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
        
        return true;
    }

    /**
     * Update user customization
     */
    static updateUserCustomization(userId: string, customization: Partial<SimpleUser['customization']>): boolean {
        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) return false;

        users[userIndex].customization = {
            ...users[userIndex].customization,
            ...customization
        };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
        
        return true;
    }

    /**
     * Update user display name
     */
    static updateUserDisplayName(userId: string, displayName: string): boolean {
        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) return false;

        users[userIndex].displayName = displayName;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
        
        return true;
    }

    /**
     * Update user data
     */
    private static updateUser(updatedUser: SimpleUser): void {
        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.id === updatedUser.id);
        
        if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
        }
    }

    /**
     * Logout current user
     */
    static logout(): void {
        localStorage.removeItem(this.SESSION_KEY);
    }

    /**
     * Generate session ID
     */
    private static generateSessionId(): string {
        return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    }

    /**
     * Reset all users to default (Admin only)
     */
    static resetAllUsers(): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.DEFAULT_USERS));
    }

    /**
     * Export user data for backup
     */
    static exportUserData(): string {
        return JSON.stringify(this.getAllUsers(), null, 2);
    }

    /**
     * Import user data from backup
     */
    static importUserData(data: string): boolean {
        try {
            const users = JSON.parse(data);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
            return true;
        } catch (error) {
            console.error('Failed to import user data:', error);
            return false;
        }
    }
}

export default SimpleAuthService;