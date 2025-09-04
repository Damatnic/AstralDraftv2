/**
 * Enhanced Authentication Service
 * ESPN/Yahoo-beating authentication with modern features
 */

import { EventEmitter } from 'events';

// Types
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  teamId?: string;
  leagueId?: string;
  preferences: UserPreferences;
  stats: UserStats;
  achievements: Achievement[];
  customization: {
    theme: 'light' | 'dark' | 'auto';
    emoji: string;
    color: string;
    badge: string;
  };
  security: {
    pin: string;
    biometricEnabled: boolean;
    twoFactorEnabled: boolean;
    lastLogin: Date;
    loginHistory: LoginRecord[];
  };
}

export interface UserPreferences {
  notifications: {
    trades: boolean;
    injuries: boolean;
    scoring: boolean;
    news: boolean;
    push: boolean;
    email: boolean;
    sms: boolean;
  };
  display: {
    compactMode: boolean;
    showProjections: boolean;
    autoRefresh: boolean;
    refreshInterval: number;
  };
  privacy: {
    profileVisibility: 'public' | 'league' | 'private';
    showOnlineStatus: boolean;
    allowDirectMessages: boolean;
  };
}

export interface UserStats {
  wins: number;
  losses: number;
  ties: number;
  championships: number;
  playoffAppearances: number;
  totalPoints: number;
  avgPointsPerWeek: number;
  bestWeekScore: number;
  currentStreak: number;
  tradesMade: number;
  waiverPickups: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface LoginRecord {
  timestamp: Date;
  ip: string;
  device: string;
  location: string;
  success: boolean;
}

export interface AuthSession {
  token: string;
  refreshToken: string;
  user: AuthUser;
  expiresAt: Date;
  rememberMe: boolean;
}

interface BiometricCredential {
  userId: string;
  credentialId: string;
  publicKey: string;
  createdAt: Date;
}

class EnhancedAuthService extends EventEmitter {
  private static instance: EnhancedAuthService;
  private currentSession: AuthSession | null = null;
  private sessionTimeout: NodeJS.Timeout | null = null;
  private readonly SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
  private readonly REMEMBER_ME_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days
  private biometricCredentials = new Map<string, BiometricCredential>();
  
  // Mock user database - In production, this would be from a backend
  private users = new Map<string, AuthUser>();

  private constructor() {
    super();
    this.initializeUsers();
    this.initializeFromStorage();
  }

  private initializeUsers(): void {
    // Initialize user data
    const player1: AuthUser = {
      id: 'player1',
      name: 'Nick Damato',
      email: 'nick@astraldraft.com',
      avatar: '👑',
      teamId: 'team1',
      leagueId: 'league1',
      preferences: this.getDefaultPreferences(),
      stats: {
        wins: 127,
        losses: 65,
        ties: 2,
        championships: 3,
        playoffAppearances: 8,
        totalPoints: 18432.5,
        avgPointsPerWeek: 112.8,
        bestWeekScore: 187.3,
        currentStreak: 4,
        tradesMade: 47,
        waiverPickups: 234
      },
      achievements: [
        {
          id: 'champ3x',
          name: 'Three-peat Champion',
          description: 'Won 3 championships',
          icon: '🏆',
          unlockedAt: new Date('2023-12-28'),
          rarity: 'legendary' as const
        },
        {
          id: 'tradeMaster',
          name: 'Trade Master',
          description: 'Completed 40+ trades',
          icon: '💱',
          unlockedAt: new Date('2023-10-15'),
          rarity: 'epic' as const
        }
      ],
      customization: {
        theme: 'dark' as const,
        emoji: '👑',
        color: 'from-blue-500 to-purple-600',
        badge: 'Commissioner'
      },
      security: {
        pin: '0000',
        biometricEnabled: false,
        twoFactorEnabled: false,
        lastLogin: new Date(),
        loginHistory: []
      }
    };

    const admin: AuthUser = {
      id: 'admin',
      name: 'Nick Damato (Admin)',
      email: 'admin@astraldraft.com',
      avatar: '🛡️',
      teamId: 'team1',
      leagueId: 'league1',
      preferences: this.getDefaultPreferences(),
      stats: {
        wins: 127,
        losses: 65,
        ties: 2,
        championships: 3,
        playoffAppearances: 8,
        totalPoints: 18432.5,
        avgPointsPerWeek: 112.8,
        bestWeekScore: 187.3,
        currentStreak: 4,
        tradesMade: 47,
        waiverPickups: 234
      },
      achievements: [],
      customization: {
        theme: 'dark' as const,
        emoji: '🛡️',
        color: 'from-yellow-500 to-orange-600',
        badge: 'Administrator'
      },
      security: {
        pin: '7347',
        biometricEnabled: true,
        twoFactorEnabled: true,
        lastLogin: new Date(),
        loginHistory: []
      }
    };

    // Add users to the Map
    this.users.set('player1', player1);
    this.users.set('admin', admin);

    // Add remaining players
    const otherPlayers = [
      { id: 'player2', name: 'Player 2', emoji: '🎮', color: 'from-green-500 to-teal-600' },
      { id: 'player3', name: 'Player 3', emoji: '🚀', color: 'from-red-500 to-pink-600' },
      { id: 'player4', name: 'Player 4', emoji: '⚡', color: 'from-purple-500 to-indigo-600' },
      { id: 'player5', name: 'Player 5', emoji: '🏈', color: 'from-orange-500 to-yellow-600' },
      { id: 'player6', name: 'Player 6', emoji: '🎯', color: 'from-teal-500 to-cyan-600' },
      { id: 'player7', name: 'Player 7', emoji: '🔥', color: 'from-pink-500 to-rose-600' },
      { id: 'player8', name: 'Player 8', emoji: '💎', color: 'from-indigo-500 to-blue-600' },
      { id: 'player9', name: 'Player 9', emoji: '🌟', color: 'from-amber-500 to-orange-600' },
      { id: 'player10', name: 'Player 10', emoji: '🏆', color: 'from-lime-500 to-green-600' }
    ];

    otherPlayers.forEach(player => {
      const user: AuthUser = {
        id: player.id,
        name: player.name,
        email: `${player.id}@astraldraft.com`,
        avatar: player.emoji,
        teamId: `team_${player.id}`,
        leagueId: 'league1',
        preferences: this.getDefaultPreferences(),
        stats: {
          wins: Math.floor(Math.random() * 100),
          losses: Math.floor(Math.random() * 100),
          ties: Math.floor(Math.random() * 5),
          championships: Math.floor(Math.random() * 3),
          playoffAppearances: Math.floor(Math.random() * 10),
          totalPoints: Math.random() * 20000,
          avgPointsPerWeek: 90 + Math.random() * 40,
          bestWeekScore: 150 + Math.random() * 50,
          currentStreak: Math.floor(Math.random() * 10) - 5,
          tradesMade: Math.floor(Math.random() * 50),
          waiverPickups: Math.floor(Math.random() * 200)
        },
        achievements: [],
        customization: {
          theme: 'dark' as const,
          emoji: player.emoji,
          color: player.color,
          badge: 'League Member'
        },
        security: {
          pin: '0000',
          biometricEnabled: false,
          twoFactorEnabled: false,
          lastLogin: new Date(),
          loginHistory: []
        }
      };
      this.users.set(player.id, user);
    });
  }

  static getInstance(): EnhancedAuthService {
    if (!EnhancedAuthService.instance) {
      EnhancedAuthService.instance = new EnhancedAuthService();
    }
    return EnhancedAuthService.instance;
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      notifications: {
        trades: true,
        injuries: true,
        scoring: true,
        news: true,
        push: true,
        email: false,
        sms: false
      },
      display: {
        compactMode: false,
        showProjections: true,
        autoRefresh: true,
        refreshInterval: 30000
      },
      privacy: {
        profileVisibility: 'league',
        showOnlineStatus: true,
        allowDirectMessages: true
      }
    };
  }

  private initializeFromStorage(): void {
    // Check for remembered session
    const rememberedSession = localStorage.getItem('astral_session');
    if (rememberedSession) {
      try {
        const session = JSON.parse(rememberedSession);
        const expiresAt = new Date(session.expiresAt);
        
        if (expiresAt > new Date()) {
          this.currentSession = session;
          this.emit('sessionRestored', session);
          this.setupSessionTimeout(expiresAt.getTime() - Date.now());
        } else {
          localStorage.removeItem('astral_session');
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
        localStorage.removeItem('astral_session');
      }
    }

    // Load biometric credentials
    const biometrics = localStorage.getItem('astral_biometrics');
    if (biometrics) {
      try {
        const creds = JSON.parse(biometrics);
        creds.forEach((cred: BiometricCredential) => {
          this.biometricCredentials.set(cred.userId, cred);
        });
      } catch (error) {
        console.error('Failed to load biometric credentials:', error);
      }
    }
  }

  /**
   * Authenticate with PIN
   */
  async authenticateWithPin(
    userId: string, 
    pin: string, 
    rememberMe: boolean = false
  ): Promise<AuthSession> {
    const user = this.users.get(userId);
    
    if (!user || user.security.pin !== pin) {
      this.logLoginAttempt(userId, false);
      throw new Error('Invalid credentials');
    }

    return this.createSession(user, rememberMe);
  }

  /**
   * Authenticate with Biometrics (WebAuthn)
   */
  async authenticateWithBiometrics(userId: string): Promise<AuthSession> {
    const user = this.users.get(userId);
    
    if (!user || !user.security.biometricEnabled) {
      throw new Error('Biometric authentication not enabled');
    }

    // In production, this would use WebAuthn API
    const credential = this.biometricCredentials.get(userId);
    if (!credential) {
      throw new Error('No biometric credential found');
    }

    // Simulate biometric verification
    const verified = await this.verifyBiometric(credential);
    if (!verified) {
      this.logLoginAttempt(userId, false);
      throw new Error('Biometric verification failed');
    }

    return this.createSession(user, true);
  }

  /**
   * Enable biometric authentication for a user
   */
  async enableBiometrics(userId: string, pin: string): Promise<void> {
    const user = this.users.get(userId);
    
    if (!user || user.security.pin !== pin) {
      throw new Error('Invalid credentials');
    }

    // In production, this would use WebAuthn to register credential
    const credential: BiometricCredential = {
      userId,
      credentialId: this.generateId(),
      publicKey: this.generateId(), // Mock public key
      createdAt: new Date()
    };

    this.biometricCredentials.set(userId, credential);
    user.security.biometricEnabled = true;
    
    // Save to storage
    const creds = Array.from(this.biometricCredentials.values());
    localStorage.setItem('astral_biometrics', JSON.stringify(creds));
    
    this.emit('biometricsEnabled', userId);
  }

  /**
   * Create a new session
   */
  private async createSession(user: AuthUser, rememberMe: boolean): Promise<AuthSession> {
    const duration = rememberMe ? this.REMEMBER_ME_DURATION : this.SESSION_DURATION;
    const expiresAt = new Date(Date.now() + duration);
    
    const session: AuthSession = {
      token: this.generateToken(),
      refreshToken: this.generateToken(),
      user,
      expiresAt,
      rememberMe
    };

    this.currentSession = session;
    
    // Update user's last login
    user.security.lastLogin = new Date();
    this.logLoginAttempt(user.id, true);
    
    // Save session if remember me is enabled
    if (rememberMe) {
      localStorage.setItem('astral_session', JSON.stringify(session));
    } else {
      sessionStorage.setItem('astral_session', JSON.stringify(session));
    }
    
    // Setup session timeout
    this.setupSessionTimeout(duration);
    
    this.emit('login', session);
    return session;
  }

  /**
   * Setup session timeout
   */
  private setupSessionTimeout(duration: number): void {
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
    }

    this.sessionTimeout = setTimeout(() => {
      this.emit('sessionExpired');
      this.logout();
    }, duration);
  }

  /**
   * Refresh current session
   */
  async refreshSession(): Promise<AuthSession> {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    const newDuration = this.currentSession.rememberMe 
      ? this.REMEMBER_ME_DURATION 
      : this.SESSION_DURATION;
    
    const newExpiresAt = new Date(Date.now() + newDuration);
    
    this.currentSession = {
      ...this.currentSession,
      token: this.generateToken(),
      expiresAt: newExpiresAt
    };

    if (this.currentSession.rememberMe) {
      localStorage.setItem('astral_session', JSON.stringify(this.currentSession));
    } else {
      sessionStorage.setItem('astral_session', JSON.stringify(this.currentSession));
    }

    this.setupSessionTimeout(newDuration);
    this.emit('sessionRefreshed', this.currentSession);
    
    return this.currentSession;
  }

  /**
   * Logout
   */
  logout(): void {
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
      this.sessionTimeout = null;
    }

    this.currentSession = null;
    localStorage.removeItem('astral_session');
    sessionStorage.removeItem('astral_session');
    
    this.emit('logout');
  }

  /**
   * Get current session
   */
  getCurrentSession(): AuthSession | null {
    return this.currentSession;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.currentSession && this.currentSession.expiresAt > new Date();
  }

  /**
   * Request PIN reset
   */
  async requestPinReset(email: string): Promise<void> {
    // Find user by email
    const user = Array.from(this.users.values()).find(u => u.email === email);
    
    if (!user) {
      // Don't reveal if email exists
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
    }

    // In production, send reset email
    console.log(`PIN reset requested for ${email}`);
    this.emit('pinResetRequested', email);
  }

  /**
   * Reset PIN with verification code
   */
  async resetPin(email: string, code: string, newPin: string): Promise<void> {
    // In production, verify the code from email
    const user = Array.from(this.users.values()).find(u => u.email === email);
    
    if (!user || code !== '123456') { // Mock verification
      throw new Error('Invalid reset code');
    }

    user.security.pin = newPin;
    this.emit('pinReset', user.id);
  }

  /**
   * Update user preferences
   */
  async updatePreferences(preferences: Partial<UserPreferences>): Promise<void> {
    if (!this.currentSession) {
      throw new Error('Not authenticated');
    }

    this.currentSession.user.preferences = {
      ...this.currentSession.user.preferences,
      ...preferences
    };

    // Save to storage
    if (this.currentSession.rememberMe) {
      localStorage.setItem('astral_session', JSON.stringify(this.currentSession));
    } else {
      sessionStorage.setItem('astral_session', JSON.stringify(this.currentSession));
    }

    this.emit('preferencesUpdated', this.currentSession.user.preferences);
  }

  /**
   * Helper methods
   */
  private generateToken(): string {
    return Array.from({ length: 32 }, () => 
      Math.random().toString(36).charAt(2)
    ).join('');
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async verifyBiometric(_credential: BiometricCredential): Promise<boolean> {
    // Mock biometric verification
    // In production, would verify the credential
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }

  private logLoginAttempt(userId: string, success: boolean): void {
    const record: LoginRecord = {
      timestamp: new Date(),
      ip: '127.0.0.1', // In production, get real IP
      device: navigator.userAgent,
      location: 'Unknown', // In production, use geolocation
      success
    };

    const user = this.users.get(userId);
    if (user) {
      user.security.loginHistory.unshift(record);
      // Keep only last 10 records
      user.security.loginHistory = user.security.loginHistory.slice(0, 10);
    }
  }
}

export default EnhancedAuthService.getInstance();
