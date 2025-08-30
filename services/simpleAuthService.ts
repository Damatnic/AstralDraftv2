/**
 * Simple Authentication Service
 * Handles 10-player + admin login system with PIN authentication
 */

import { LEAGUE_MEMBERS } from '../data/leagueData';

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

    // Map player IDs to league member IDs
    private static readonly PLAYER_MAPPING = {
        'player1': 'user_1',  // Nick Damato
        'player2': 'user_2',  // Jon Kornbeck
        'player3': 'user_3',  // Cason Minor
        'player4': 'user_4',  // Brittany Bergrum
        'player5': 'user_5',  // Renee McCaigue
        'player6': 'user_6',  // Jack McCaigue
        'player7': 'user_7',  // Larry McCaigue
        'player8': 'user_8',  // Kaity Lorbiecki
        'player9': 'user_9',  // David Jarvey
        'player10': 'user_10', // Nick Hartley
        'admin': 'user_1'     // Nick Damato as admin
    };

    // Default users: 10 players + 1 admin (Nick Damato is both admin and player1)
    private static readonly DEFAULT_USERS: SimpleUser[] = [
        // Admin user (Nick Damato)
        {
            id: 'admin',
            username: 'admin',
            displayName: 'Nick Damato',
            pin: '7347',
            email: LEAGUE_MEMBERS[0].email,
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
            email: LEAGUE_MEMBERS[0].email,
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
            email: LEAGUE_MEMBERS[1].email,
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
            email: LEAGUE_MEMBERS[2].email,
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
            email: LEAGUE_MEMBERS[3].email,
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
            email: LEAGUE_MEMBERS[4].email,
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
            email: LEAGUE_MEMBERS[5].email,
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
            email: LEAGUE_MEMBERS[6].email,
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
            email: LEAGUE_MEMBERS[7].email,
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
            email: LEAGUE_MEMBERS[8].email,
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
            email: LEAGUE_MEMBERS[9].email,
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
        return users.find((user: any) => user.id === id) || null;
    }

    /**
     * Authenticate user with PIN and return proper league member data
     */
    static async authenticateUser(userId: string, pin: string): Promise<AuthSession | null> {
        const users = this.getAllUsers();
        const user = users.find((u: any) => u.id === userId);

        if (!user || user.pin !== pin) {
            return null;
        }

        // Update last login
        user.lastLogin = new Date().toISOString();
        this.updateUser(user);

        // Map to league member ID
        const leagueMemberId = this.PLAYER_MAPPING[userId as keyof typeof this.PLAYER_MAPPING];
        const leagueMember = LEAGUE_MEMBERS.find((m: any) => m.id === leagueMemberId);

        // Create session with proper league member data
        const session: AuthSession = {
            user: {
                ...user,
                id: leagueMemberId || user.id,
                displayName: leagueMember?.name || user.displayName,
                email: leagueMember?.email || user.email
            },
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
}

export default SimpleAuthService;