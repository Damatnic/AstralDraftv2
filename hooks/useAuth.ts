/**
 * Authentication Hook - Enhanced with JWT Simulation and Security
 * Manages user authentication state with robust error handling
 */

import React from 'react';
import { useAppState } from './useAppState';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: 'user' | 'commissioner' | 'admin';
  leagueIds?: string[];
  createdAt?: string;
  lastLogin?: string;
}

interface AuthError {
  code: string;
  message: string;
  details?: any;
}

interface UseAuthReturn {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyToken: () => boolean;
}

// Simulated JWT token functions
const generateToken = (user: AuthUser): string => {
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role || 'user',
    iat: Date.now(),
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
  return btoa(JSON.stringify(payload));
};

const decodeToken = (token: string): any => {
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
};

const isTokenValid = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return false;
  return decoded.exp > Date.now();
};

// Default test users with enhanced profiles
const DEFAULT_TEST_USERS = [
  {
    id: '1',
    email: 'commissioner@astraldraft.com',
    password: process.env.VITE_TEST_USER_PASSWORD || 'test-password-placeholder',
    name: 'Commissioner Mike',
    avatar: '👨‍💼',
    role: 'commissioner' as const,
    leagueIds: ['league-1'],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'player@astraldraft.com',
    password: process.env.VITE_TEST_USER_PASSWORD || 'test-password-placeholder',
    name: 'John Football',
    avatar: '🏈',
    role: 'user' as const,
    leagueIds: ['league-1'],
    createdAt: '2024-02-01T00:00:00Z'
  },
  {
    id: '3',
    email: 'demo@astraldraft.com',
    password: process.env.VITE_TEST_USER_PASSWORD || 'test-password-placeholder',
    name: 'Demo User',
    avatar: '🎮',
    role: 'user' as const,
    leagueIds: ['league-1'],
    createdAt: '2024-03-01T00:00:00Z'
  }
];

export const useAuth = (): UseAuthReturn => {
  const { state, dispatch } = useAppState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<AuthError | null>(null);
  
  // Initialize test users on first load
  React.useEffect(() => {
    const existingUsers = localStorage.getItem('testUsers');
    if (!existingUsers) {
      localStorage.setItem('testUsers', JSON.stringify(DEFAULT_TEST_USERS));
    }
  }, []);
  
  // Check for existing session on mount with token validation
  React.useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const storedUser = localStorage.getItem('currentUser');
        const authToken = localStorage.getItem('authToken');
        
        if (storedUser && authToken && isTokenValid(authToken)) {
          const user = JSON.parse(storedUser);
          // Update last login
          user.lastLogin = new Date().toISOString();
          localStorage.setItem('currentUser', JSON.stringify(user));
          dispatch({ type: 'SET_USER', payload: user });
        } else {
          // Clear invalid session
          localStorage.removeItem('currentUser');
          localStorage.removeItem('authToken');
        }
      } catch (err) {
        console.error('Session check failed:', err);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, [dispatch]);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get test users
      const testUsers = JSON.parse(localStorage.getItem('testUsers') || '[]');
      const userRecord = testUsers.find((u: any) => 
        u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (!userRecord) {
        throw new Error('User not found');
      }
      
      if (userRecord.password !== password) {
        throw new Error('Invalid password');
      }
      
      // Create user object without password
      const user: AuthUser = {
        id: userRecord.id,
        email: userRecord.email,
        name: userRecord.name,
        avatar: userRecord.avatar,
        role: userRecord.role || 'user',
        leagueIds: userRecord.leagueIds || [],
        createdAt: userRecord.createdAt,
        lastLogin: new Date().toISOString()
      };
      
      // Generate and store token
      const token = generateToken(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('authToken', token);
      
      // Update app state
      dispatch({ type: 'SET_USER', payload: user });
      
      // Track login event
      console.log('User logged in successfully:', user.email);
      
    } catch (err: any) {
      const authError: AuthError = {
        code: 'AUTH_LOGIN_FAILED',
        message: err.message || 'Login failed',
        details: { email }
      };
      setError(authError);
      throw authError;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      // Clear all auth data
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
      sessionStorage.clear();
      
      // Reset app state
      dispatch({ type: 'LOGOUT' });
      
      // Clear error
      setError(null);
      
      console.log('User logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate input
      if (!email || !password || !name) {
        throw new Error('All fields are required');
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }
      
      // Validate password strength
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if user already exists
      const testUsers = JSON.parse(localStorage.getItem('testUsers') || '[]');
      const existingUser = testUsers.find((u: any) => 
        u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      // Create new user
      const newUser: AuthUser = {
        id: `user-${Date.now()}`,
        email,
        name,
        avatar: '🏈',
        role: 'user',
        leagueIds: [],
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      // Save to storage
      testUsers.push({ ...newUser, password });
      localStorage.setItem('testUsers', JSON.stringify(testUsers));

      // Auto-login the new user
      const token = generateToken(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      localStorage.setItem('authToken', token);
      
      // Update app state
      dispatch({ type: 'SET_USER', payload: newUser });
      
      console.log('User signed up successfully:', newUser.email);
      
    } catch (err: any) {
      const authError: AuthError = {
        code: 'AUTH_SIGNUP_FAILED',
        message: err.message || 'Signup failed',
        details: { email }
      };
      setError(authError);
      throw authError;
    } finally {
      setIsLoading(false);
    }
  };
  
  const refreshToken = async () => {
    setIsLoading(true);
    try {
      const currentToken = localStorage.getItem('authToken');
      const currentUser = localStorage.getItem('currentUser');
      
      if (!currentToken || !currentUser) {
        throw new Error('No active session');
      }
      
      const user = JSON.parse(currentUser);
      
      // Generate new token
      const newToken = generateToken(user);
      localStorage.setItem('authToken', newToken);
      
      console.log('Token refreshed successfully');
    } catch (err: any) {
      setError({
        code: 'AUTH_REFRESH_FAILED',
        message: err.message || 'Token refresh failed'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateProfile = async (updates: Partial<AuthUser>) => {
    setIsLoading(true);
    try {
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) {
        throw new Error('No authenticated user');
      }
      
      const user = JSON.parse(currentUser);
      const updatedUser = { ...user, ...updates };
      
      // Save updated user
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Update in test users if needed
      const testUsers = JSON.parse(localStorage.getItem('testUsers') || '[]');
      const userIndex = testUsers.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        testUsers[userIndex] = { ...testUsers[userIndex], ...updates };
        localStorage.setItem('testUsers', JSON.stringify(testUsers));
      }
      
      // Update app state
      dispatch({ type: 'SET_USER', payload: updatedUser });
      
      console.log('Profile updated successfully');
    } catch (err: any) {
      setError({
        code: 'AUTH_UPDATE_FAILED',
        message: err.message || 'Profile update failed'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      // Validate email
      if (!email) {
        throw new Error('Email is required');
      }
      
      // Simulate sending reset email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Password reset email sent to:', email);
    } catch (err: any) {
      setError({
        code: 'AUTH_RESET_FAILED',
        message: err.message || 'Password reset failed'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const verifyToken = (): boolean => {
    const token = localStorage.getItem('authToken');
    return token ? isTokenValid(token) : false;
  };
  
  return {
    user: state.user as AuthUser | null,
    isAuthenticated: !!state.user && verifyToken(),
    isLoading,
    error,
    login,
    logout,
    signup,
    refreshToken,
    updateProfile,
    resetPassword,
    verifyToken
  };
};

export default useAuth;