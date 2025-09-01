/**
 * API Service
 * Handles all HTTP requests to the backend API
 */

import axios, { AxiosInstance } from &apos;axios&apos;;

interface ApiResponse<T = unknown> {
}
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface User {
}
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar?: string;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

interface League {
}
  id: string;
  name: string;
  description: string;
  commissionerId: string;
  inviteCode: string;
  status: &apos;DRAFT&apos; | &apos;ACTIVE&apos; | &apos;COMPLETED&apos; | &apos;ARCHIVED&apos;;
  season: number;
  settings: unknown;
  currentWeek: number;
  isPublic: boolean;
  createdAt: string;
  userTeam?: unknown;
  teams?: unknown[];
  isCommissioner?: boolean;
}

interface Player {
}
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  position: string;
  team: string;
  jerseyNumber?: number;
  status: string;
  injuryStatus: {
}
    designation: string;
    description: string;
    updatedAt: string;
  };
  rankings: {
}
    overall?: number;
    position?: number;
    adp?: number;
    tier?: number;
  };
  projections: unknown;
  stats: unknown;
  photoUrl?: string;
}

class ApiService {
}
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
}
    const baseURL = import.meta.env.VITE_API_BASE_URL || &apos;http://localhost:3001/api&apos;;
    
    this.client = axios.create({
}
      baseURL,
      timeout: 10000,
      headers: {
}
        &apos;Content-Type&apos;: &apos;application/json&apos;,
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config: any) => {
}
        if (this.token) {
}
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error: any) => {
}
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
}
        if (error.response?.status === 401) {
}
          // Token expired or invalid
          this.clearToken();
          // Redirect to login or emit event
          window.dispatchEvent(new CustomEvent(&apos;auth:logout&apos;));
        }
        return Promise.reject(error);
      }
    );

    // Load token from localStorage
    this.loadToken();
  }

  private loadToken(): void {
}
    const token = localStorage.getItem(&apos;astral_session_token&apos;);
    if (token) {
}
      this.token = token;
    }
  }

  private saveToken(token: string): void {
}
    this.token = token;
    localStorage.setItem(&apos;astral_session_token&apos;, token);
  }

  private clearToken(): void {
}
    this.token = null;
    localStorage.removeItem(&apos;astral_session_token&apos;);
    localStorage.removeItem(&apos;astral_user&apos;);
  }

  // Authentication methods
  async register(userData: {
}
    username: string;
    email: string;
    password: string;
    displayName?: string;
  }): Promise<{ user: User; token: string }> {
}
    const response = await this.client.post<ApiResponse<{ user: User; session_token: string }>>(&apos;/auth/register&apos;, userData);
    
    if (response.data.success && response.data.data) {
}
      const { user, session_token } = response.data.data;
      this.saveToken(session_token);
      localStorage.setItem(&apos;astral_user&apos;, JSON.stringify(user));
      return { user, token: session_token };
    }
    
    throw new Error(response.data.error || &apos;Registration failed&apos;);
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
}
    const response = await this.client.post<ApiResponse<{ user: User; session_token: string }>>(&apos;/auth/login&apos;, {
}
      email,
      password,
    });
    
    if (response.data.success && response.data.data) {
}
      const { user, session_token } = response.data.data;
      this.saveToken(session_token);
      localStorage.setItem(&apos;astral_user&apos;, JSON.stringify(user));
      return { user, token: session_token };
    }
    
    throw new Error(response.data.error || &apos;Login failed&apos;);
  }

  async logout(): Promise<void> {
}
    try {
}
      await this.client.post(&apos;/auth/logout&apos;);
    } catch (error) {
}
      // Continue with logout even if API call fails
      console.warn(&apos;Logout API call failed:&apos;, error);
    } finally {
}
      this.clearToken();
    }
  }

  async getCurrentUser(): Promise<User> {
}
    const response = await this.client.get<ApiResponse<{ user: User }>>(&apos;/auth/me&apos;);
    
    if (response.data.success && response.data.data) {
}
      return response.data.data.user;
    }
    
    throw new Error(response.data.error || &apos;Failed to get user&apos;);
  }

  async verifyEmail(token: string): Promise<void> {
}
    const response = await this.client.post<ApiResponse>(&apos;/auth/verify-email&apos;, { token });
    
    if (!response.data.success) {
}
      throw new Error(response.data.error || &apos;Email verification failed&apos;);
    }
  }

  async forgotPassword(email: string): Promise<void> {
}
    const response = await this.client.post<ApiResponse>(&apos;/auth/forgot-password&apos;, { email });
    
    if (!response.data.success) {
}
      throw new Error(response.data.error || &apos;Password reset request failed&apos;);
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
}
    const response = await this.client.post<ApiResponse>(&apos;/auth/reset-password&apos;, {
}
      token,
      newPassword,
    });
    
    if (!response.data.success) {
}
      throw new Error(response.data.error || &apos;Password reset failed&apos;);
    }
  }

  // League methods
  async getMyLeagues(): Promise<League[]> {
}
    const response = await this.client.get<ApiResponse<{ leagues: League[] }>>(&apos;/leagues&apos;);
    
    if (response.data.success && response.data.data) {
}
      return response.data.data.leagues;
    }
    
    return [];
  }

  async createLeague(leagueData: {
}
    name: string;
    description?: string;
    maxTeams?: number;
    scoringType?: string;
    draftType?: string;
    isPublic?: boolean;
    password?: string;
    settings?: unknown;
  }): Promise<League> {
}
    const response = await this.client.post<ApiResponse<{ league: League }>>(&apos;/leagues&apos;, leagueData);
    
    if (response.data.success && response.data.data) {
}
      return response.data.data.league;
    }
    
    throw new Error(response.data.error || &apos;Failed to create league&apos;);
  }

  async joinLeague(inviteCode: string, teamName: string, password?: string): Promise<{ league: League; team: unknown }> {
}
    const response = await this.client.post<ApiResponse<{ league: League; team: unknown }>>(&apos;/leagues/join&apos;, {
}
      inviteCode,
      teamName,
      password,
    });
    
    if (response.data.success && response.data.data) {
}
      return response.data.data;
    }
    
    throw new Error(response.data.error || &apos;Failed to join league&apos;);
  }

  async getLeague(leagueId: string): Promise<League> {
}
    const response = await this.client.get<ApiResponse<{ league: League }>>(`/leagues/${leagueId}`);
    
    if (response.data.success && response.data.data) {
}
      return response.data.data.league;
    }
    
    throw new Error(response.data.error || &apos;Failed to get league&apos;);
  }

  async updateLeague(leagueId: string, updates: Partial<League>): Promise<League> {
}
    const response = await this.client.put<ApiResponse<{ league: League }>>(`/leagues/${leagueId}`, updates);
    
    if (response.data.success && response.data.data) {
}
      return response.data.data.league;
    }
    
    throw new Error(response.data.error || &apos;Failed to update league&apos;);
  }

  async deleteLeague(leagueId: string): Promise<void> {
}
    const response = await this.client.delete<ApiResponse>(`/leagues/${leagueId}`);
    
    if (!response.data.success) {
}
      throw new Error(response.data.error || &apos;Failed to delete league&apos;);
    }
  }

  async leaveLeague(leagueId: string): Promise<void> {
}
    const response = await this.client.post<ApiResponse>(`/leagues/${leagueId}/leave`);
    
    if (!response.data.success) {
}
      throw new Error(response.data.error || &apos;Failed to leave league&apos;);
    }
  }

  async getLeagueStandings(leagueId: string): Promise<unknown[]> {
}
    const response = await this.client.get<ApiResponse<{ standings: unknown[] }>>(`/leagues/${leagueId}/standings`);
    
    if (response.data.success && response.data.data) {
}
      return response.data.data.standings;
    }
    
    return [];
  }

  async getPublicLeagues(page = 1, limit = 20): Promise<{ leagues: League[]; pagination: unknown }> {
}
    const response = await this.client.get<ApiResponse<{ leagues: League[]; pagination: unknown }>>(&apos;/leagues/public&apos;, {
}
      params: { page, limit },
    });
    
    if (response.data.success && response.data.data) {
}
      return response.data.data;
    }
    
    return { leagues: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } };
  }

  // Player methods
  async searchPlayers(query: string, position?: string, team?: string, limit = 50): Promise<Player[]> {
}
    const response = await this.client.get<ApiResponse<{ players: Player[] }>>(&apos;/players/search&apos;, {
}
      params: { query, position, team, limit },
    });
    
    if (response.data.success && response.data.data) {
}
      return response.data.data.players;
    }
    
    return [];
  }

  async getPlayerRankings(position?: string, scoringType = &apos;ppr&apos;, limit = 100): Promise<Player[]> {
}
    const response = await this.client.get<ApiResponse<{ players: Player[] }>>(&apos;/players/rankings&apos;, {
}
      params: { position, scoringType, limit },
    });
    
    if (response.data.success && response.data.data) {
}
      return response.data.data.players;
    }
    
    return [];
  }

  async getPlayer(playerId: string): Promise<Player> {
}
    const response = await this.client.get<ApiResponse<{ player: Player }>>(`/players/${playerId}`);
    
    if (response.data.success && response.data.data) {
}
      return response.data.data.player;
    }
    
    throw new Error(response.data.error || &apos;Failed to get player&apos;);
  }

  async getPlayerStats(playerId: string, week: number): Promise<unknown> {
}
    const response = await this.client.get<ApiResponse<{ stats: unknown }>>(`/players/${playerId}/stats/${week}`);
    
    if (response.data.success && response.data.data) {
}
      return response.data.data.stats;
    }
    
    throw new Error(response.data.error || &apos;Failed to get player stats&apos;);
  }

  async getPlayersByPosition(position: string, limit = 100): Promise<Player[]> {
}
    const response = await this.client.get<ApiResponse<{ players: Player[] }>>(`/players/position/${position}`, {
}
      params: { limit },
    });
    
    if (response.data.success && response.data.data) {
}
      return response.data.data.players;
    }
    
    return [];
  }

  async getPlayersByTeam(team: string): Promise<Player[]> {
}
    const response = await this.client.get<ApiResponse<{ players: Player[] }>>(`/players/team/${team}`);
    
    if (response.data.success && response.data.data) {
}
      return response.data.data.players;
    }
    
    return [];
  }

  async getAvailablePlayers(leagueId: string, position?: string, limit = 100): Promise<Player[]> {
}
    const response = await this.client.get<ApiResponse<{ players: Player[] }>>(`/players/available/${leagueId}`, {
}
      params: { position, limit },
    });
    
    if (response.data.success && response.data.data) {
}
      return response.data.data.players;
    }
    
    return [];
  }

  async getPlayerNews(playerId: string, limit = 10): Promise<unknown[]> {
}
    const response = await this.client.get<ApiResponse<{ news: unknown[] }>>(`/players/news/${playerId}`, {
}
      params: { limit },
    });
    
    if (response.data.success && response.data.data) {
}
      return response.data.data.news;
    }
    
    return [];
  }

  // Health check
  async healthCheck(): Promise<unknown> {
}
    const response = await this.client.get(&apos;/health&apos;);
    return response.data;
  }

  // Utility methods
  isAuthenticated(): boolean {
}
    return !!this.token;
  }

  getToken(): string | null {
}
    return this.token;
  }

  setToken(token: string): void {
}
    this.saveToken(token);
  }
}

// Create singleton instance
export const apiService = new ApiService();
export default apiService;

// Export types
export type { User, League, Player, ApiResponse };