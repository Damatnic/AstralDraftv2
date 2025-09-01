/* eslint-disable react-refresh/only-export-components */
/**
 * Production Authentication Context
 * Comprehensive JWT-based authentication system with email verification,
 * password reset, user profiles, and secure session management
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from &apos;react&apos;;
import { jwtDecode } from &apos;jwt-decode&apos;;

// Types
export interface User {
}
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  subscription: &apos;free&apos; | &apos;premium&apos; | &apos;oracle_pro&apos;;
  isAdmin: boolean;
  emailVerified: boolean;
  createdAt: string;
  lastLogin: string;
  customization: {
}
    backgroundColor: string;
    emoji: string;
    theme: &apos;dark&apos; | &apos;light&apos; | &apos;auto&apos;;
  };
  preferences: {
}
    notifications: {
}
      email: boolean;
      push: boolean;
      predictions: boolean;
      leaderboard: boolean;
      weekly_summary: boolean;
    };
    privacy: {
}
      showProfile: boolean;
      showStats: boolean;
      allowFriendRequests: boolean;
    };
  };
  stats: {
}
    totalPredictions: number;
    correctPredictions: number;
    accuracy: number;
    rank: number;
    streak: number;
    points: number;
  };

export interface AuthState {
}
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;

}

export interface LoginCredentials {
}
  email: string;
  password: string;
  rememberMe?: boolean;

}

export interface RegisterData {
}
  email: string;
  username: string;
  displayName: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;

}

export interface ResetPasswordData {
}
  email: string;

}

export interface ChangePasswordData {
}
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;

}

export interface AuthContextType extends AuthState {
}
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  resetPassword: (data: ResetPasswordData) => Promise<{ success: boolean; error?: string }>;
  changePassword: (data: ChangePasswordData) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  verifyEmail: (token: string) => Promise<{ success: boolean; error?: string }>;
  resendVerification: () => Promise<{ success: boolean; error?: string }>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;

// JWT Token Interface
interface JWTPayload {
}
  userId: string;
  email: string;
  subscription: string;
  isAdmin: boolean;
  iat: number;
  exp: number;

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API Base URL
const API_BASE = process.env.NODE_ENV === &apos;production&apos; 
  ? &apos;https://your-api-domain.com/api&apos; 
  : &apos;http://localhost:3001/api&apos;;

// Token Storage Keys
const TOKEN_KEY = &apos;astral_draft_token&apos;;
const REFRESH_TOKEN_KEY = &apos;astral_draft_refresh_token&apos;;

// Helper Functions
}

const getStoredToken = (): string | null => {
}
  try {
}

    return localStorage.getItem(TOKEN_KEY);
  
    } catch (error) {
}
        console.error(error);
    } catch {
}
    return null;

};

const setStoredToken = (token: string): void => {
}
  try {
}

    localStorage.setItem(TOKEN_KEY, token);
  
    } catch (error) {
}
        console.error(error);
    } catch {
}
    // Handle localStorage errors silently

};

const removeStoredToken = (): void => {
}
  try {
}

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  
    } catch (error) {
}
        console.error(error);
    } catch {
}
    // Handle localStorage errors silently

};

const isTokenValid = (token: string): boolean => {
}
  try {
}

    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  
    } catch (error) {
}
        console.error(error);
    } catch {
}
    return false;

};

// API Helper
const apiRequest = async (
  endpoint: string, 
  options: RequestInit = {}
): Promise<any> => {
}
  const token = getStoredToken();
  
  const config: RequestInit = {
}
    headers: {
}
      &apos;Content-Type&apos;: &apos;application/json&apos;,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
}
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
}
      throw new Error(data.message || `HTTP ${response.status}`);

    return data;
  
    } catch (error) {
}
    throw error;

};

// Production Auth Provider
export const ProductionAuthProvider: React.FC<{ children: ReactNode }> = ({ children }: any) => {
}
  const [authState, setAuthState] = useState<AuthState>({
}
    user: null,
    isAuthenticated: false,
    isLoading: true,
    token: null,
  });

  // Initialize authentication state
  useEffect(() => {
}
    const initializeAuth = async () => {
}
      const token = getStoredToken();
      
      if (!token || !isTokenValid(token)) {
}
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;

      try {
}

        // Fetch current user data
        const userData = await apiRequest(&apos;/auth/me&apos;);
        
        setAuthState({
}
          user: userData,
          isAuthenticated: true,
          isLoading: false,
          token,
        });
      
    } catch (error) {
}
        removeStoredToken();
        setAuthState(prev => ({ ...prev, isLoading: false }));

    };

    initializeAuth();
  }, []);

  // Auto-refresh token
  useEffect(() => {
}
    if (!authState.token || !authState.isAuthenticated) return;

    const refreshInterval = setInterval(async () => {
}
      try {
}

        const decoded = jwtDecode<JWTPayload>(authState.token!);
        const timeUntilExpiry = decoded.exp * 1000 - Date.now();
        
        // Refresh if token expires in less than 5 minutes
        if (timeUntilExpiry < 5 * 60 * 1000) {
}
          await refreshToken();

    } catch (error) {
}

    }, 60000); // Check every minute

    return () => clearInterval(refreshInterval);
  }, [authState.token, authState.isAuthenticated]);

  // Login
  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
}
    try {
}

      setAuthState(prev => ({ ...prev, isLoading: true }));

      const response = await apiRequest(&apos;/auth/login&apos;, {
}
        method: &apos;POST&apos;,
        body: JSON.stringify(credentials),
      });

      const { user, token, refreshToken } = response;

      setStoredToken(token);
      if (refreshToken) {
}
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

      setAuthState({
}
        user,
        isAuthenticated: true,
        isLoading: false,
        token,
      });

      return { success: true };
    
    } catch (error) {
}
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: error.message || &apos;Login failed&apos; };

  };

  // Register
  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
}
    try {
}

      setAuthState(prev => ({ ...prev, isLoading: true }));

      await apiRequest(&apos;/auth/register&apos;, {
}
        method: &apos;POST&apos;,
        body: JSON.stringify(data),
      });

      setAuthState(prev => ({ ...prev, isLoading: false }));

      return { 
}
        success: true
      };
    
    } catch (error) {
}
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: error.message || &apos;Registration failed&apos; };

  };

  // Logout
  const logout = useCallback(() => {
}
    removeStoredToken();
    setAuthState({
}
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,
    });

    // Optional: Call logout endpoint to invalidate server-side session
    apiRequest(&apos;/auth/logout&apos;, { method: &apos;POST&apos; }).catch(() => {
}
      // Ignore errors - local logout should still work
    });
  }, []);

  // Refresh Token
  const refreshToken = useCallback(async (): Promise<boolean> => {
}
    try {
}
      const refreshTokenValue = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshTokenValue) {
}
        throw new Error(&apos;No refresh token available&apos;);

      const response = await apiRequest(&apos;/auth/refresh&apos;, {
}
        method: &apos;POST&apos;,
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
      });

      const { token, user } = response;

      setStoredToken(token);
      setAuthState(prev => ({
}
        ...prev,
        token,
        user,
      }));

      return true;
    
    } catch (error) {
}
      logout();
      return false;

  }, [logout]);

  // Reset Password
  const resetPassword = async (data: ResetPasswordData): Promise<{ success: boolean; error?: string }> => {
}
    try {
}

      await apiRequest(&apos;/auth/reset-password&apos;, {
}
        method: &apos;POST&apos;,
        body: JSON.stringify(data),
      });

      return { success: true };
    
    } catch (error) {
}
      return { success: false, error: error.message || &apos;Password reset failed&apos; };

  };

  // Change Password
  const changePassword = async (data: ChangePasswordData): Promise<{ success: boolean; error?: string }> => {
}
    try {
}

      await apiRequest(&apos;/auth/change-password&apos;, {
}
        method: &apos;POST&apos;,
        body: JSON.stringify(data),
      });

      return { success: true };
    
    } catch (error) {
}
      return { success: false, error: error.message || &apos;Password change failed&apos; };

  };

  // Update Profile
  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
}
    try {
}
      const response = await apiRequest(&apos;/auth/profile&apos;, {
}
        method: &apos;PATCH&apos;,
        body: JSON.stringify(updates),
      });

      setAuthState(prev => ({
}
        ...prev,
        user: { ...prev.user, ...response.user },
      }));

      return { success: true };
    `/auth/verify-email/${token}`, {
}
        method: &apos;POST&apos;,
      });

      // Refresh user data to update emailVerified status
      if (authState.isAuthenticated) {
}
        const userData = await apiRequest(&apos;/auth/me&apos;);
        setAuthState(prev => ({ ...prev, user: userData }));

      return { success: true };
    } catch (error: any) {
}
      return { success: false, error: error.message || &apos;Email verification failed&apos; };

  }, [authState.isAuthenticated]);

  // Resend Verification
  const resendVerification = async (): Promise<{ success: boolean; error?: string }> => {
}
    try {
}

      await apiRequest(&apos;/auth/resend-verification&apos;, {
}
        method: &apos;POST&apos;,
      });

      return { success: true };
    
    } catch (error) {
}
      return { success: false, error: error.message || &apos;Failed to resend verification&apos; };

  };

  // Delete Account
  const deleteAccount = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
}
    try {
}

      await apiRequest(&apos;/auth/delete-account&apos;, {
}
        method: &apos;DELETE&apos;,
      });

      logout();
      return { success: true };
    
    } catch (error) {
}
      return { success: false, error: error.message || &apos;Account deletion failed&apos; };

  }, [logout]);

  const contextValue: AuthContextType = useMemo(() => ({
}
    ...authState,
    login,
    register,
    logout,
    refreshToken,
    resetPassword,
    changePassword,
    updateProfile,
    verifyEmail,
    resendVerification,
    deleteAccount,
  }), [authState, login, register, logout, refreshToken, resetPassword, changePassword, updateProfile, verifyEmail, resendVerification, deleteAccount]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useProductionAuth = (): AuthContextType => {
}
  const context = useContext(AuthContext);
  if (!context) {
}
    throw new Error(&apos;useProductionAuth must be used within a ProductionAuthProvider&apos;);

  return context;
};

export default ProductionAuthProvider;
