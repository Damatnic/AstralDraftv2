/**
 * Authentication Hook - Enhanced with JWT Simulation and Security
 * Manages user authentication state with robust error handling
 */

import React from &apos;react&apos;;
import { useAppState } from &apos;./useAppState&apos;;

interface AuthUser {
}
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: &apos;user&apos; | &apos;commissioner&apos; | &apos;admin&apos;;
  leagueIds?: string[];
  createdAt?: string;
  lastLogin?: string;
}

interface AuthError {
}
  code: string;
  message: string;
  details?: any;
}

interface UseAuthReturn {
}
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
}
  const payload = {
}
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role || &apos;user&apos;,
    iat: Date.now(),
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
  return btoa(JSON.stringify(payload));
};

const decodeToken = (token: string): any => {
}
  try {
}
    return JSON.parse(atob(token));
  } catch {
}
    return null;
  }
};

const isTokenValid = (token: string): boolean => {
}
  const decoded = decodeToken(token);
  if (!decoded) return false;
  return decoded.exp > Date.now();
};

// Default test users with enhanced profiles
const DEFAULT_TEST_USERS = [
  {
}
    id: &apos;1&apos;,
    email: &apos;commissioner@astraldraft.com&apos;,
    password: process.env.VITE_TEST_USER_PASSWORD || &apos;test-password-placeholder&apos;,
    name: &apos;Commissioner Mike&apos;,
    avatar: &apos;👨‍💼&apos;,
    role: &apos;commissioner&apos; as const,
    leagueIds: [&apos;league-1&apos;],
    createdAt: &apos;2024-01-01T00:00:00Z&apos;
  },
  {
}
    id: &apos;2&apos;,
    email: &apos;player@astraldraft.com&apos;,
    password: process.env.VITE_TEST_USER_PASSWORD || &apos;test-password-placeholder&apos;,
    name: &apos;John Football&apos;,
    avatar: &apos;🏈&apos;,
    role: &apos;user&apos; as const,
    leagueIds: [&apos;league-1&apos;],
    createdAt: &apos;2024-02-01T00:00:00Z&apos;
  },
  {
}
    id: &apos;3&apos;,
    email: &apos;demo@astraldraft.com&apos;,
    password: process.env.VITE_TEST_USER_PASSWORD || &apos;test-password-placeholder&apos;,
    name: &apos;Demo User&apos;,
    avatar: &apos;🎮&apos;,
    role: &apos;user&apos; as const,
    leagueIds: [&apos;league-1&apos;],
    createdAt: &apos;2024-03-01T00:00:00Z&apos;
  }
];

export const useAuth = (): UseAuthReturn => {
}
  const { state, dispatch } = useAppState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<AuthError | null>(null);
  
  // Initialize test users on first load
  React.useEffect(() => {
}
    const existingUsers = localStorage.getItem(&apos;testUsers&apos;);
    if (!existingUsers) {
}
      localStorage.setItem(&apos;testUsers&apos;, JSON.stringify(DEFAULT_TEST_USERS));
    }
  }, []);
  
  // Check for existing session on mount with token validation
  React.useEffect(() => {
}
    const checkSession = async () => {
}
      setIsLoading(true);
      try {
}
        const storedUser = localStorage.getItem(&apos;currentUser&apos;);
        const authToken = localStorage.getItem(&apos;authToken&apos;);
        
        if (storedUser && authToken && isTokenValid(authToken)) {
}
          const user = JSON.parse(storedUser);
          // Update last login
          user.lastLogin = new Date().toISOString();
          localStorage.setItem(&apos;currentUser&apos;, JSON.stringify(user));
          dispatch({ type: &apos;SET_USER&apos;, payload: user });
        } else {
}
          // Clear invalid session
          localStorage.removeItem(&apos;currentUser&apos;);
          localStorage.removeItem(&apos;authToken&apos;);
        }
      } catch (err) {
}
        console.error(&apos;Session check failed:&apos;, err);
        localStorage.removeItem(&apos;currentUser&apos;);
        localStorage.removeItem(&apos;authToken&apos;);
      } finally {
}
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, [dispatch]);
  
  const login = async (email: string, password: string) => {
}
    setIsLoading(true);
    setError(null);
    
    try {
}
      // Validate input
      if (!email || !password) {
}
        throw new Error(&apos;Email and password are required&apos;);
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
}
        throw new Error(&apos;Invalid email format&apos;);
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get test users
      const testUsers = JSON.parse(localStorage.getItem(&apos;testUsers&apos;) || &apos;[]&apos;);
      const userRecord = testUsers.find((u: any) => 
        u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (!userRecord) {
}
        throw new Error(&apos;User not found&apos;);
      }
      
      if (userRecord.password !== password) {
}
        throw new Error(&apos;Invalid password&apos;);
      }
      
      // Create user object without password
      const user: AuthUser = {
}
        id: userRecord.id,
        email: userRecord.email,
        name: userRecord.name,
        avatar: userRecord.avatar,
        role: userRecord.role || &apos;user&apos;,
        leagueIds: userRecord.leagueIds || [],
        createdAt: userRecord.createdAt,
        lastLogin: new Date().toISOString()
      };
      
      // Generate and store token
      const token = generateToken(user);
      localStorage.setItem(&apos;currentUser&apos;, JSON.stringify(user));
      localStorage.setItem(&apos;authToken&apos;, token);
      
      // Update app state
      dispatch({ type: &apos;SET_USER&apos;, payload: user });
      
      // Track login event
      console.log(&apos;User logged in successfully:&apos;, user.email);
      
    } catch (err: any) {
}
      const authError: AuthError = {
}
        code: &apos;AUTH_LOGIN_FAILED&apos;,
        message: err.message || &apos;Login failed&apos;,
        details: { email }
      };
      setError(authError);
      throw authError;
    } finally {
}
      setIsLoading(false);
    }
  };

  const logout = () => {
}
    try {
}
      // Clear all auth data
      localStorage.removeItem(&apos;currentUser&apos;);
      localStorage.removeItem(&apos;authToken&apos;);
      sessionStorage.clear();
      
      // Reset app state
      dispatch({ type: &apos;LOGOUT&apos; });
      
      // Clear error
      setError(null);
      
      console.log(&apos;User logged out successfully&apos;);
    } catch (err) {
}
      console.error(&apos;Logout error:&apos;, err);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
}
    setIsLoading(true);
    setError(null);
    
    try {
}
      // Validate input
      if (!email || !password || !name) {
}
        throw new Error(&apos;All fields are required&apos;);
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
}
        throw new Error(&apos;Invalid email format&apos;);
      }
      
      // Validate password strength
      if (password.length < 6) {
}
        throw new Error(&apos;Password must be at least 6 characters&apos;);
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if user already exists
      const testUsers = JSON.parse(localStorage.getItem(&apos;testUsers&apos;) || &apos;[]&apos;);
      const existingUser = testUsers.find((u: any) => 
        u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (existingUser) {
}
        throw new Error(&apos;User with this email already exists&apos;);
      }
      
      // Create new user
      const newUser: AuthUser = {
}
        id: `user-${Date.now()}`,
        email,
        name,
        avatar: &apos;🏈&apos;,
        role: &apos;user&apos;,
        leagueIds: [],
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      // Save to storage
      testUsers.push({ ...newUser, password });
      localStorage.setItem(&apos;testUsers&apos;, JSON.stringify(testUsers));

      // Auto-login the new user
      const token = generateToken(newUser);
      localStorage.setItem(&apos;currentUser&apos;, JSON.stringify(newUser));
      localStorage.setItem(&apos;authToken&apos;, token);
      
      // Update app state
      dispatch({ type: &apos;SET_USER&apos;, payload: newUser });
      
      console.log(&apos;User signed up successfully:&apos;, newUser.email);
      
    } catch (err: any) {
}
      const authError: AuthError = {
}
        code: &apos;AUTH_SIGNUP_FAILED&apos;,
        message: err.message || &apos;Signup failed&apos;,
        details: { email }
      };
      setError(authError);
      throw authError;
    } finally {
}
      setIsLoading(false);
    }
  };
  
  const refreshToken = async () => {
}
    setIsLoading(true);
    try {
}
      const currentToken = localStorage.getItem(&apos;authToken&apos;);
      const currentUser = localStorage.getItem(&apos;currentUser&apos;);
      
      if (!currentToken || !currentUser) {
}
        throw new Error(&apos;No active session&apos;);
      }
      
      const user = JSON.parse(currentUser);
      
      // Generate new token
      const newToken = generateToken(user);
      localStorage.setItem(&apos;authToken&apos;, newToken);
      
      console.log(&apos;Token refreshed successfully&apos;);
    } catch (err: any) {
}
      setError({
}
        code: &apos;AUTH_REFRESH_FAILED&apos;,
        message: err.message || &apos;Token refresh failed&apos;
      });
      throw err;
    } finally {
}
      setIsLoading(false);
    }
  };
  
  const updateProfile = async (updates: Partial<AuthUser>) => {
}
    setIsLoading(true);
    try {
}
      const currentUser = localStorage.getItem(&apos;currentUser&apos;);
      if (!currentUser) {
}
        throw new Error(&apos;No authenticated user&apos;);
      }
      
      const user = JSON.parse(currentUser);
      const updatedUser = { ...user, ...updates };
      
      // Save updated user
      localStorage.setItem(&apos;currentUser&apos;, JSON.stringify(updatedUser));
      
      // Update in test users if needed
      const testUsers = JSON.parse(localStorage.getItem(&apos;testUsers&apos;) || &apos;[]&apos;);
      const userIndex = testUsers.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
}
        testUsers[userIndex] = { ...testUsers[userIndex], ...updates };
        localStorage.setItem(&apos;testUsers&apos;, JSON.stringify(testUsers));
      }
      
      // Update app state
      dispatch({ type: &apos;SET_USER&apos;, payload: updatedUser });
      
      console.log(&apos;Profile updated successfully&apos;);
    } catch (err: any) {
}
      setError({
}
        code: &apos;AUTH_UPDATE_FAILED&apos;,
        message: err.message || &apos;Profile update failed&apos;
      });
      throw err;
    } finally {
}
      setIsLoading(false);
    }
  };
  
  const resetPassword = async (email: string) => {
}
    setIsLoading(true);
    try {
}
      // Validate email
      if (!email) {
}
        throw new Error(&apos;Email is required&apos;);
      }
      
      // Simulate sending reset email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(&apos;Password reset email sent to:&apos;, email);
    } catch (err: any) {
}
      setError({
}
        code: &apos;AUTH_RESET_FAILED&apos;,
        message: err.message || &apos;Password reset failed&apos;
      });
      throw err;
    } finally {
}
      setIsLoading(false);
    }
  };
  
  const verifyToken = (): boolean => {
}
    const token = localStorage.getItem(&apos;authToken&apos;);
    return token ? isTokenValid(token) : false;
  };
  
  return {
}
    user: state.user as AuthUser | null,
    isAuthenticated: !!state.user && verifyToken(),
    isLoading,
    error,
    login,
    logout,
    signup,
    refreshToken,
    updateProfile,
    resetPassword,// 
    verifyToken
  };
};

export default useAuth;