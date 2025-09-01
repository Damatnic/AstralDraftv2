/**
 * Netlify Functions Authentication Service
 * Modern authentication service for Astral Draft
 */

interface User {
}
  id: number;
  username: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

interface AuthTokens {
}
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
}
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthResponse {
}
  user?: User;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}

class NetlifyAuthService {
}
  private state: AuthState = {
}
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: false
  };

  private listeners: Set<(state: AuthState) => void> = new Set();
  private refreshTimer: NodeJS.Timeout | null = null;
  
  // Use Netlify Functions endpoint
  private readonly API_URL = &apos;/.netlify/functions/api&apos;;
  
  constructor() {
}
    this.initializeAuth();
  }

  /**
   * Initialize authentication from stored tokens
   */
  private async initializeAuth() {
}
    const storedTokens = this.getStoredTokens();
    if (storedTokens) {
}
      this.state.isLoading = true;
      this.notifyListeners();
      
      try {
}
        const user = await this.fetchCurrentUser(storedTokens.accessToken);
        if (user) {
}
          this.state = {
}
            user,
            tokens: storedTokens,
            isAuthenticated: true,
            isLoading: false
          };
          this.scheduleTokenRefresh();
        } else {
}
          // Try to refresh token
          await this.refreshAccessToken();
        }
      } catch (error) {
}
        console.error(&apos;Auth initialization failed:&apos;, error);
        this.clearAuth();
      }
      
      this.state.isLoading = false;
      this.notifyListeners();
    }
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
}
    try {
}
      this.state.isLoading = true;
      this.notifyListeners();

      const response = await fetch(`${this.API_URL}/auth/login`, {
}
        method: &apos;POST&apos;,
        headers: { &apos;Content-Type&apos;: &apos;application/json&apos; },
        body: JSON.stringify({ email, password })
      });

      const data: AuthResponse = await response.json();

      if (!response.ok) {
}
        throw new Error(data.error || &apos;Login failed&apos;);
      }

      if (data.user && data.accessToken && data.refreshToken) {
}
        this.state = {
}
          user: data.user,
          tokens: {
}
            accessToken: data.accessToken,
            refreshToken: data.refreshToken
          },
          isAuthenticated: true,
          isLoading: false
        };

        if (this.state.tokens) {
}
          this.storeTokens(this.state.tokens);
        }
        this.scheduleTokenRefresh();
        this.notifyListeners();

        return { success: true };
      }

      throw new Error(&apos;Invalid response from server&apos;);
    } catch (error) {
}
      this.state.isLoading = false;
      this.notifyListeners();
      
      const errorMessage = error instanceof Error ? error.message : &apos;Login failed&apos;;
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Register a new user
   */
  async register(email: string, username: string, password: string): Promise<{ success: boolean; error?: string }> {
}
    try {
}
      this.state.isLoading = true;
      this.notifyListeners();

      const response = await fetch(`${this.API_URL}/auth/register`, {
}
        method: &apos;POST&apos;,
        headers: { &apos;Content-Type&apos;: &apos;application/json&apos; },
        body: JSON.stringify({ email, username, password })
      });

      const data: AuthResponse = await response.json();

      if (!response.ok) {
}
        throw new Error(data.error || &apos;Registration failed&apos;);
      }

      if (data.user && data.accessToken && data.refreshToken) {
}
        this.state = {
}
          user: data.user,
          tokens: {
}
            accessToken: data.accessToken,
            refreshToken: data.refreshToken
          },
          isAuthenticated: true,
          isLoading: false
        };

        if (this.state.tokens) {
}
          this.storeTokens(this.state.tokens);
        }
        this.scheduleTokenRefresh();
        this.notifyListeners();

        return { success: true };
      }

      throw new Error(&apos;Invalid response from server&apos;);
    } catch (error) {
}
      this.state.isLoading = false;
      this.notifyListeners();
      
      const errorMessage = error instanceof Error ? error.message : &apos;Registration failed&apos;;
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Logout the current user
   */
  async logout() {
}
    try {
}
      if (this.state.tokens?.accessToken) {
}
        await fetch(`${this.API_URL}/auth/logout`, {
}
          method: &apos;POST&apos;,
          headers: {
}
            &apos;Authorization&apos;: `Bearer ${this.state.tokens.accessToken}`
          }
        });
      }
    } catch (error) {
}
      console.error(&apos;Logout error:&apos;, error);
    } finally {
}
      this.clearAuth();
    }
  }

  /**
   * Refresh the access token
   */
  private async refreshAccessToken(): Promise<boolean> {
}
    const tokens = this.getStoredTokens();
    if (!tokens?.refreshToken) {
}
      this.clearAuth();
      return false;
    }

    try {
}
      const response = await fetch(`${this.API_URL}/auth/refresh`, {
}
        method: &apos;POST&apos;,
        headers: { &apos;Content-Type&apos;: &apos;application/json&apos; },
        body: JSON.stringify({ refreshToken: tokens.refreshToken })
      });

      const data: AuthResponse = await response.json();

      if (response.ok && data.accessToken && data.refreshToken) {
}
        const newTokens = {
}
          accessToken: data.accessToken,
          refreshToken: data.refreshToken
        };

        this.state.tokens = newTokens;
        this.storeTokens(newTokens);
        this.scheduleTokenRefresh();
        
        // Fetch updated user data
        const user = await this.fetchCurrentUser(newTokens.accessToken);
        if (user) {
}
          this.state.user = user;
          this.state.isAuthenticated = true;
          this.notifyListeners();
          return true;
        }
      }
    } catch (error) {
}
      console.error(&apos;Token refresh failed:&apos;, error);
    }

    this.clearAuth();
    return false;
  }

  /**
   * Fetch current user data
   */
  private async fetchCurrentUser(accessToken: string): Promise<User | null> {
}
    try {
}
      const response = await fetch(`${this.API_URL}/auth/me`, {
}
        headers: {
}
          &apos;Authorization&apos;: `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
}
        const data = await response.json();
        return data.user;
      }
    } catch (error) {
}
      console.error(&apos;Failed to fetch user:&apos;, error);
    }

    return null;
  }

  /**
   * Schedule automatic token refresh
   */
  private scheduleTokenRefresh() {
}
    if (this.refreshTimer) {
}
      clearTimeout(this.refreshTimer);
    }

    // Refresh token 1 minute before expiry (assuming 15 min expiry)
    this.refreshTimer = setTimeout(() => {
}
      this.refreshAccessToken();
    }, 14 * 60 * 1000); // 14 minutes
  }

  /**
   * Clear authentication state
   */
  private clearAuth() {
}
    this.state = {
}
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false
    };

    if (this.refreshTimer) {
}
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }

    this.clearStoredTokens();
    this.notifyListeners();
  }

  /**
   * Token storage management
   */
  private storeTokens(tokens: AuthTokens) {
}
    try {
}
      localStorage.setItem(&apos;astral_auth&apos;, JSON.stringify(tokens));
    } catch (error) {
}
      console.error(&apos;Failed to store tokens:&apos;, error);
    }
  }

  private getStoredTokens(): AuthTokens | null {
}
    try {
}
      const stored = localStorage.getItem(&apos;astral_auth&apos;);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
}
      console.error(&apos;Failed to retrieve tokens:&apos;, error);
      return null;
    }
  }

  private clearStoredTokens() {
}
    try {
}
      localStorage.removeItem(&apos;astral_auth&apos;);
    } catch (error) {
}
      console.error(&apos;Failed to clear tokens:&apos;, error);
    }
  }

  /**
   * State management
   */
  subscribe(listener: (state: AuthState) => void): () => void {
}
    this.listeners.add(listener);
    listener(this.state); // Call immediately with current state
    
    return () => {
}
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
}
    this.listeners.forEach((listener: any) => {
}
      try {
}
        listener(this.state);
      } catch (error) {
}
        console.error(&apos;Listener error:&apos;, error);
      }
    });
  }

  /**
   * Get current state
   */
  getState(): AuthState {
}
    return { ...this.state };
  }

  /**
   * Get auth headers for API requests
   */
  getAuthHeaders(): Record<string, string> {
}
    if (this.state.tokens?.accessToken) {
}
      return {
}
        &apos;Authorization&apos;: `Bearer ${this.state.tokens.accessToken}`
      };
    }
    return {};
  }

  /**
   * Make authenticated API request
   */
  async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
}
    const authHeaders = this.getAuthHeaders();
    
    const response = await fetch(url, {
}
      ...options,
      headers: {
}
        ...authHeaders,
        ...options.headers
      }
    });

    // If unauthorized, try to refresh token and retry
    if (response.status === 401 && this.state.tokens) {
}
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
}
        const newAuthHeaders = this.getAuthHeaders();
        return fetch(url, {
}
          ...options,
          headers: {
}
            ...newAuthHeaders,
            ...options.headers
          }
        });
      }
    }

    return response;
  }
}

// Export singleton instance
export const netlifyAuth = new NetlifyAuthService();
export type { User, AuthState, AuthTokens };