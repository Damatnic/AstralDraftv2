/**
 * Enhanced Authentication Service
 * Secure authentication with session management, refresh tokens, and security monitoring
 */

import { SimpleUser } from &apos;./simpleAuthService&apos;;
import { logger } from &apos;./loggingService&apos;;
// Mock imports until backend is properly set up
const databaseService = {
}
    createUser: async (data: Record<string, unknown>) => ({ success: true, user: data }),
    getUser: async (_id: string) => null,
    updateUser: async (_id: string, _data: Record<string, unknown>) => ({ success: true }),
    authenticateUser: async (playerNumber: number, pin: string) => {
}
        // Mock authentication
        if (playerNumber === 1 && pin === &apos;1234&apos;) {
}
            return {
}
                id: 1,
                username: &apos;player1&apos;,
                displayName: &apos;Player 1&apos;,
                email: &apos;player1@example.com&apos;,
                isAdmin: false,
                colorTheme: &apos;#3B82F6&apos;,
                emoji: &apos;👤&apos;,
                lastLoginAt: new Date().toISOString()
            };
        }
        return null;
    },
    updateLastLogin: async (_userId: number) => ({ success: true }),
    createSession: async (sessionData: Record<string, unknown>) => ({ success: true, sessionId: sessionData.sessionId }),
    getSessionByRefreshToken: async (token: string) => {
}
        // Mock session
        return {
}
            sessionId: &apos;mock-session-id&apos;,
            userId: 1,
            accessToken: &apos;mock-access-token&apos;,
            refreshToken: token,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            refreshExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };
    },
    getUserById: async (userId: number) => {
}
        // Mock user
        return {
}
            id: userId,
            username: &apos;player1&apos;,
            displayName: &apos;Player 1&apos;,
            email: &apos;player1@example.com&apos;,
            isAdmin: false,
            colorTheme: &apos;#3B82F6&apos;,
            emoji: &apos;👤&apos;,
            lastLoginAt: new Date().toISOString()
        };
    },
    updateSessionToken: async (_sessionId: string, _accessToken: string, _expiresAt: string) => ({ success: true }),
    deleteSessionByToken: async (_token: string) => ({ success: true }),
    deleteAllUserSessions: async (_userId: number) => ({ success: true }),
    getSessionByAccessToken: async (_token: string) => {
}
        // Mock session
        return {
}
            sessionId: &apos;mock-session-id&apos;,
            userId: 1,
            accessToken: _token,
            refreshToken: &apos;mock-refresh-token&apos;,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            refreshExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };
    },
    validateUserPin: async (_userId: number, _pin: string) => {
}
        // Mock validation
        return true;
    },
    updateUserPin: async (_userId: number, _newPin: string) => ({ success: true }),
    deleteExpiredSessions: async () => ({ deleted: 0 }),
    getActiveSessionCount: async () => 0,
    getFailedAttemptsToday: async () => 0
};

const getRow = async (_query: string, _params?: unknown[]) => null;

const recordSecurityAttempt = async (_req: Record<string, unknown>, _type: string, _success: boolean, _userId?: number) => {};
const isAccountLocked = (_userId: number): boolean => false;
const lockAccount = async (_userId: number, _reason?: string) => {};
const unlockAccount = async (_userId: number) => {};
const validatePinSecurity = (pin: string): { valid: boolean; errors: string[] } => {
}
    const errors: string[] = [];
    
    if (!pin || pin.length < 4) {
}
        errors.push(&apos;PIN must be at least 4 characters&apos;);
    }
    
    if (pin.length > 20) {
}
        errors.push(&apos;PIN must be no more than 20 characters&apos;);
    }
    
    // Check for common weak PINs
    const weakPins = [&apos;0000&apos;, &apos;1111&apos;, &apos;2222&apos;, &apos;3333&apos;, &apos;4444&apos;, &apos;5555&apos;, &apos;6666&apos;, &apos;7777&apos;, &apos;8888&apos;, &apos;9999&apos;, &apos;1234&apos;, &apos;4321&apos;];
    if (weakPins.includes(pin)) {
}
        errors.push(&apos;PIN is too common and easily guessed&apos;);
    }
    
    return {
}
        valid: errors.length === 0,
//         errors
    };
};

const crypto = typeof window !== &apos;undefined&apos; && window.crypto ? window.crypto : null;

// Types for enhanced auth
export interface SecureSession {
}
    sessionId: string;
    accessToken: string;
    refreshToken: string;
    user: Record<string, unknown>;
    expiresAt: number;
    refreshExpiresAt: number;
}

export interface LoginAttempt {
}
    playerNumber: number;
    pin: string;
    rememberMe?: boolean;
    userAgent?: string;
    ipAddress?: string;
}

export interface AuthResponse {
}
    success: boolean;
    session?: SecureSession;
    error?: string;
    code?: string;
    lockedUntil?: number;
}

class EnhancedAuthService {
}
    private static readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
    private static readonly REFRESH_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days
    private static readonly REMEMBER_ME_DURATION = 90 * 24 * 60 * 60 * 1000; // 90 days

    /**
     * Secure login with enhanced security checks
     */
    static async secureLogin(attempt: LoginAttempt): Promise<AuthResponse> {
}
        try {
}
            // Check for account lockout
            if (isAccountLocked(attempt.playerNumber)) {
}
                await recordSecurityAttempt(
                    { ip: attempt.ipAddress, get: () => attempt.userAgent } as Record<string, unknown>,
                    &apos;login&apos;,
                    false,
                    attempt.playerNumber
                );

                return {
}
                    success: false,
                    error: &apos;Account temporarily locked due to too many failed attempts&apos;,
                    code: &apos;ACCOUNT_LOCKED&apos;
                };
            }

            // Validate PIN security requirements
            const pinValidation = validatePinSecurity(attempt.pin);
            if (!pinValidation.valid) {
}
                return {
}
                    success: false,
                    error: pinValidation.errors.join(&apos;, &apos;),
                    code: &apos;WEAK_PIN&apos;
                };
            }

            // Authenticate with database
            const user = await databaseService.authenticateUser(attempt.playerNumber, attempt.pin);
            
            if (!user) {
}
                // Record failed attempt
                await recordSecurityAttempt(
                    { ip: attempt.ipAddress, get: () => attempt.userAgent } as Record<string, unknown>,
                    &apos;login&apos;,
                    false,
                    attempt.playerNumber
                );

                // Check if we should lock the account
                const failedAttempts = await this.getRecentFailedAttempts(attempt.playerNumber);
                if (failedAttempts >= 4) { // Lock after 5 failed attempts
}
                    await lockAccount(attempt.playerNumber);
                }

                return {
}
                    success: false,
                    error: &apos;Invalid player number or PIN&apos;,
                    code: &apos;INVALID_CREDENTIALS&apos;
                };
            }

            // Create secure session
            const session = await this.createSecureSession(user, attempt.rememberMe);

            // Record successful login
            await recordSecurityAttempt(
                { ip: attempt.ipAddress, get: () => attempt.userAgent } as Record<string, unknown>,
                &apos;login&apos;,
                true,
                attempt.playerNumber
            );

            // Unlock account if it was locked
            await unlockAccount(attempt.playerNumber);

            // Update last login time
            await databaseService.updateLastLogin(user.id);

            return {
}
                success: true,
//                 session
            };

        } catch (error) {
}
            logger.error(&apos;Secure login error:&apos;, error);
            return {
}
                success: false,
                error: &apos;Authentication service error&apos;,
                code: &apos;SERVICE_ERROR&apos;
            };
        }
    }

    /**
     * Create a secure session with access and refresh tokens
     */
    private static async createSecureSession(
        user: Record<string, unknown>, 
        rememberMe: boolean = false
    ): Promise<SecureSession> {
}
        const sessionId = this.generateSecureId();
        const accessToken = this.generateSecureId();
        const refreshToken = this.generateSecureId();
        
        const now = Date.now();
        const sessionDuration = rememberMe ? this.REMEMBER_ME_DURATION : this.SESSION_DURATION;
        const refreshDuration = rememberMe ? this.REMEMBER_ME_DURATION : this.REFRESH_DURATION;
        
        const expiresAt = now + sessionDuration;
        const refreshExpiresAt = now + refreshDuration;

        // Store session in database
        await databaseService.createSession({
}
            sessionId,
            userId: user.id,
            accessToken,
            refreshToken,
            expiresAt: new Date(expiresAt).toISOString(),
            refreshExpiresAt: new Date(refreshExpiresAt).toISOString(),
            userAgent: &apos;&apos;, // Will be filled by caller
            ipAddress: &apos;&apos; // Will be filled by caller
        });

        return {
}
            sessionId,
            accessToken,
            refreshToken,
            user,
            expiresAt,
//             refreshExpiresAt
        };
    }

    /**
     * Refresh access token using refresh token
     */
    static async refreshSession(refreshToken: string): Promise<AuthResponse> {
}
        try {
}
            const session = await databaseService.getSessionByRefreshToken(refreshToken);
            
            if (!session || new Date(session.refreshExpiresAt) < new Date()) {
}
                return {
}
                    success: false,
                    error: &apos;Invalid or expired refresh token&apos;,
                    code: &apos;REFRESH_EXPIRED&apos;
                };
            }

            const user = await databaseService.getUserById(session.userId);
            if (!user) {
}
                return {
}
                    success: false,
                    error: &apos;User not found&apos;,
                    code: &apos;USER_NOT_FOUND&apos;
                };
            }

            // Generate new access token
            const newAccessToken = this.generateSecureId();
            const newExpiresAt = Date.now() + this.SESSION_DURATION;

            // Update session in database
            await databaseService.updateSessionToken(session.sessionId, newAccessToken, new Date(newExpiresAt).toISOString());

            // Map database user to SimpleUser format
            const simpleUser: SimpleUser = {
}
                id: user.id.toString(),
                username: user.username,
                displayName: user.displayName || user.username,
                pin: &apos;&apos;, // PIN is not exposed for security
                email: user.email,
                isAdmin: user.isAdmin,
                customization: {
}
                    backgroundColor: user.colorTheme || &apos;#3B82F6&apos;,
                    textColor: &apos;#FFFFFF&apos;,
                    emoji: user.emoji || &apos;👤&apos;
                },
                createdAt: user.lastLoginAt || new Date().toISOString(),
                lastLogin: user.lastLoginAt
            };

            return {
}
                success: true,
                session: {
}
                    sessionId: session.sessionId,
                    accessToken: newAccessToken,
                    refreshToken: session.refreshToken,
                    user: simpleUser as unknown as Record<string, unknown>,
                    expiresAt: newExpiresAt,
                    refreshExpiresAt: new Date(session.refreshExpiresAt).getTime()
                }
            };

        } catch (error) {
}
            logger.error(&apos;Refresh session error:&apos;, error);
            return {
}
                success: false,
                error: &apos;Session refresh failed&apos;,
                code: &apos;REFRESH_ERROR&apos;
            };
        }
    }

    /**
     * Secure logout with session cleanup
     */
    static async secureLogout(accessToken: string): Promise<{ success: boolean }> {
}
        try {
}
            await databaseService.deleteSessionByToken(accessToken);
            return { success: true };
        } catch (error) {
}
            logger.error(&apos;Logout error:&apos;, error);
            return { success: false };
        }
    }

    /**
     * Logout from all devices
     */
    static async logoutAllDevices(userId: number): Promise<{ success: boolean }> {
}
        try {
}
            await databaseService.deleteAllUserSessions(userId);
            return { success: true };
        } catch (error) {
}
            logger.error(&apos;Logout all devices error:&apos;, error);
            return { success: false };
        }
    }

    /**
     * Validate access token and get user
     */
    static async validateToken(accessToken: string): Promise<{ valid: boolean; user?: Record<string, unknown> }> {
}
        try {
}
            const session = await databaseService.getSessionByAccessToken(accessToken);
            
            if (!session || new Date(session.expiresAt) < new Date()) {
}
                return { valid: false };
            }

            const user = await databaseService.getUserById(session.userId);
            return { 
}
                valid: !!user, 
//                 user 
            };

        } catch (error) {
}
            logger.error(&apos;Token validation error:&apos;, error);
            return { valid: false };
        }
    }

    /**
     * Change PIN with security validation
     */
    static async changePin(
        userId: number, 
        currentPin: string, 
        newPin: string,
        userAgent?: string,
        ipAddress?: string
    ): Promise<AuthResponse> {
}
        try {
}
            // Validate current PIN
            const user = await databaseService.getUserById(userId);
            if (!user) {
}
                return {
}
                    success: false,
                    error: &apos;User not found&apos;,
                    code: &apos;USER_NOT_FOUND&apos;
                };
            }

            const isCurrentPinValid = await databaseService.validateUserPin(userId, currentPin);
            if (!isCurrentPinValid) {
}
                recordSecurityAttempt(
                    { ip: ipAddress, get: () => userAgent } as Record<string, unknown>,
                    &apos;pin_change&apos;,
                    false,
//                     userId
                );

                return {
}
                    success: false,
                    error: &apos;Current PIN is incorrect&apos;,
                    code: &apos;INVALID_CURRENT_PIN&apos;
                };
            }

            // Validate new PIN security
            const pinValidation = validatePinSecurity(newPin);
            if (!pinValidation.valid) {
}
                return {
}
                    success: false,
                    error: pinValidation.errors.join(&apos;, &apos;),
                    code: &apos;WEAK_NEW_PIN&apos;
                };
            }

            // Update PIN in database
            const success = await databaseService.updateUserPin(userId, newPin);
            
            if (success) {
}
                await recordSecurityAttempt(
                    { ip: ipAddress, get: () => userAgent } as Record<string, unknown>,
                    &apos;pin_change&apos;,
                    true,
//                     userId
                );

                // Invalidate all existing sessions for security
                await this.logoutAllDevices(userId);

                return {
}
                    success: true
                };
            } else {
}
                return {
}
                    success: false,
                    error: &apos;Failed to update PIN&apos;,
                    code: &apos;UPDATE_FAILED&apos;
                };
            }

        } catch (error) {
}
            logger.error(&apos;Change PIN error:&apos;, error);
            return {
}
                success: false,
                error: &apos;PIN change failed&apos;,
                code: &apos;CHANGE_ERROR&apos;
            };
        }
    }

    /**
     * Get recent failed login attempts for an account
     */
    private static async getRecentFailedAttempts(playerNumber: number): Promise<number> {
}
        try {
}
            const result = await getRow(`
                SELECT COUNT(*) as failed_count
                FROM security_audit_log
                WHERE user_identifier = ?
                AND event_type = &apos;failed_login&apos;
                AND created_at >= datetime(&apos;now&apos;, &apos;-1 hour&apos;)
            `, [playerNumber.toString()]);
            
            return result ? Number((result as Record<string, unknown>).failed_count) : 0;
        } catch (error) {
}
            logger.error(&apos;Error getting failed login attempts:&apos;, error);
            return 0;
        }
    }

    /**
     * Generate cryptographically secure ID
     */
    private static generateSecureId(): string {
}
        if (crypto && &apos;getRandomValues&apos; in crypto) {
}
            const array = new Uint8Array(32);
            crypto.getRandomValues(array);
            return Array.from(array, byte => byte.toString(16).padStart(2, &apos;0&apos;)).join(&apos;&apos;);
        } else {
}
            // Fallback for non-browser environments
            return Math.random().toString(36).substring(2) + Date.now().toString(36);
        }
    }

    /**
     * Cleanup expired sessions
     */
    static async cleanupExpiredSessions(): Promise<void> {
}
        try {
}
            await databaseService.deleteExpiredSessions();
        } catch (error) {
}
            logger.error(&apos;Session cleanup error:&apos;, error);
        }
    }

    /**
     * Get security statistics for monitoring
     */
    static async getSecurityStats(): Promise<{
}
        activeSessions: number;
        failedAttemptsToday: number;
        lockedAccounts: number;
    }> {
}
        try {
}
            const activeSessions = await databaseService.getActiveSessionCount();
            const failedAttemptsToday = await databaseService.getFailedAttemptsToday();
            
            return {
}
                activeSessions,
                failedAttemptsToday,
                lockedAccounts: 0 // Would come from accountLocks map in enhanced security middleware
            };
        } catch (error) {
}
            logger.error(&apos;Security stats error:&apos;, error);
            return {
}
                activeSessions: 0,
                failedAttemptsToday: 0,
                lockedAccounts: 0
            };
        }
    }
}

export default EnhancedAuthService;
