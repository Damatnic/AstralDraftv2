/**
 * API Service
 * Handles all HTTP requests to the backend API
 */

import axios, { AxiosInstance } from 'axios';

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface User {
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
  id: string;
  name: string;
  description: string;
  commissionerId: string;
  inviteCode: string;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
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
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  position: string;
  team: string;
  jerseyNumber?: number;
  status: string;
  injuryStatus: {
    designation: string;
    description: string;
    updatedAt: string;
  };
  rankings: {
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
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
    
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config: any) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.clearToken();
          // Redirect to login or emit event
          window.dispatchEvent(new CustomEvent('auth:logout'));
        }
        return Promise.reject(error);
      }
    );

    // Load token from localStorage
    this.loadToken();
  }

  private loadToken(): void {
    const token = localStorage.getItem('astral_session_token');
    if (token) {
      this.token = token;
    }
  }

  private saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('astral_session_token', token);
  }

  private clearToken(): void {
    this.token = null;
    localStorage.removeItem('astral_session_token');
    localStorage.removeItem('astral_user');
  }

  // Authentication methods
  async register(userData: {
    username: string;
    email: string;
    password: string;
    displayName?: string;
  }): Promise<{ user: User; token: string }> {
    const response = await this.client.post<ApiResponse<{ user: User; session_token: string }>>('/auth/register', userData);
    
    if (response.data.success && response.data.data) {
      const { user, session_token } = response.data.data;
      this.saveToken(session_token);
      localStorage.setItem('astral_user', JSON.stringify(user));
      return { user, token: session_token };
    }
    
    throw new Error(response.data.error || 'Registration failed');
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await this.client.post<ApiResponse<{ user: User; session_token: string }>>('/auth/login', {
      email,
      password,
    });
    
    if (response.data.success && response.data.data) {
      const { user, session_token } = response.data.data;
      this.saveToken(session_token);
      localStorage.setItem('astral_user', JSON.stringify(user));
      return { user, token: session_token };
    }
    
    throw new Error(response.data.error || 'Login failed');
  }

  async logout(): Promise<void> {
    try {
      await this.client.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      this.clearToken();
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<ApiResponse<{ user: User }>>('/auth/me');
    
    if (response.data.success && response.data.data) {
      return response.data.data.user;
    }
    
    throw new Error(response.data.error || 'Failed to get user');
  }

  async verifyEmail(token: string): Promise<void> {
    const response = await this.client.post<ApiResponse>('/auth/verify-email', { token });
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Email verification failed');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const response = await this.client.post<ApiResponse>('/auth/forgot-password', { email });
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Password reset request failed');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const response = await this.client.post<ApiResponse>('/auth/reset-password', {
      token,
      newPassword,
    });
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Password reset failed');
    }
  }

  // League methods
  async getMyLeagues(): Promise<League[]> {
    const response = await this.client.get<ApiResponse<{ leagues: League[] }>>('/leagues');
    
    if (response.data.success && response.data.data) {
      return response.data.data.leagues;
    }
    
    return [];
  }

  async createLeague(leagueData: {
    name: string;
    description?: string;
    maxTeams?: number;
    scoringType?: string;
    draftType?: string;
    isPublic?: boolean;
    password?: string;
    settings?: unknown;
  }): Promise<League> {
    const response = await this.client.post<ApiResponse<{ league: League }>>('/leagues', leagueData);
    
    if (response.data.success && response.data.data) {
      return response.data.data.league;
    }
    
    throw new Error(response.data.error || 'Failed to create league');
  }

  async joinLeague(inviteCode: string, teamName: string, password?: string): Promise<{ league: League; team: unknown }> {
    const response = await this.client.post<ApiResponse<{ league: League; team: unknown }>>('/leagues/join', {
      inviteCode,
      teamName,
      password,
    });
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error(response.data.error || 'Failed to join league');
  }

  async getLeague(leagueId: string): Promise<League> {
    const response = await this.client.get<ApiResponse<{ league: League }>>(`/leagues/${leagueId}`);
    
    if (response.data.success && response.data.data) {
      return response.data.data.league;
    }
    
    throw new Error(response.data.error || 'Failed to get league');
  }

  async updateLeague(leagueId: string, updates: Partial<League>): Promise<League> {
    const response = await this.client.put<ApiResponse<{ league: League }>>(`/leagues/${leagueId}`, updates);
    
    if (response.data.success && response.data.data) {
      return response.data.data.league;
    }
    
    throw new Error(response.data.error || 'Failed to update league');
  }

  async deleteLeague(leagueId: string): Promise<void> {
    const response = await this.client.delete<ApiResponse>(`/leagues/${leagueId}`);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to delete league');
    }
  }

  async leaveLeague(leagueId: string): Promise<void> {
    const response = await this.client.post<ApiResponse>(`/leagues/${leagueId}/leave`);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to leave league');
    }
  }

  async getLeagueStandings(leagueId: string): Promise<unknown[]> {
    const response = await this.client.get<ApiResponse<{ standings: unknown[] }>>(`/leagues/${leagueId}/standings`);
    
    if (response.data.success && response.data.data) {
      return response.data.data.standings;
    }
    
    return [];
  }

  async getPublicLeagues(page = 1, limit = 20): Promise<{ leagues: League[]; pagination: unknown }> {
    const response = await this.client.get<ApiResponse<{ leagues: League[]; pagination: unknown }>>('/leagues/public', {
      params: { page, limit },
    });
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    return { leagues: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } };
  }

  // Player methods
  async searchPlayers(query: string, position?: string, team?: string, limit = 50): Promise<Player[]> {
    const response = await this.client.get<ApiResponse<{ players: Player[] }>>('/players/search', {
      params: { query, position, team, limit },
    });
    
    if (response.data.success && response.data.data) {
      return response.data.data.players;
    }
    
    return [];
  }

  async getPlayerRankings(position?: string, scoringType = 'ppr', limit = 100): Promise<Player[]> {
    const response = await this.client.get<ApiResponse<{ players: Player[] }>>('/players/rankings', {
      params: { position, scoringType, limit },
    });
    
    if (response.data.success && response.data.data) {
      return response.data.data.players;
    }
    
    return [];
  }

  async getPlayer(playerId: string): Promise<Player> {
    const response = await this.client.get<ApiResponse<{ player: Player }>>(`/players/${playerId}`);
    
    if (response.data.success && response.data.data) {
      return response.data.data.player;
    }
    
    throw new Error(response.data.error || 'Failed to get player');
  }

  async getPlayerStats(playerId: string, week: number): Promise<unknown> {
    const response = await this.client.get<ApiResponse<{ stats: unknown }>>(`/players/${playerId}/stats/${week}`);
    
    if (response.data.success && response.data.data) {
      return response.data.data.stats;
    }
    
    throw new Error(response.data.error || 'Failed to get player stats');
  }

  async getPlayersByPosition(position: string, limit = 100): Promise<Player[]> {
    const response = await this.client.get<ApiResponse<{ players: Player[] }>>(`/players/position/${position}`, {
      params: { limit },
    });
    
    if (response.data.success && response.data.data) {
      return response.data.data.players;
    }
    
    return [];
  }

  async getPlayersByTeam(team: string): Promise<Player[]> {
    const response = await this.client.get<ApiResponse<{ players: Player[] }>>(`/players/team/${team}`);
    
    if (response.data.success && response.data.data) {
      return response.data.data.players;
    }
    
    return [];
  }

  async getAvailablePlayers(leagueId: string, position?: string, limit = 100): Promise<Player[]> {
    const response = await this.client.get<ApiResponse<{ players: Player[] }>>(`/players/available/${leagueId}`, {
      params: { position, limit },
    });
    
    if (response.data.success && response.data.data) {
      return response.data.data.players;
    }
    
    return [];
  }

  async getPlayerNews(playerId: string, limit = 10): Promise<unknown[]> {
    const response = await this.client.get<ApiResponse<{ news: unknown[] }>>(`/players/news/${playerId}`, {
      params: { limit },
    });
    
    if (response.data.success && response.data.data) {
      return response.data.data.news;
    }
    
    return [];
  }

  // Health check
  async healthCheck(): Promise<unknown> {
    const response = await this.client.get('/health');
    return response.data;
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  setToken(token: string): void {
    this.saveToken(token);
  }
}

// Create singleton instance
export const apiService = new ApiService();
export default apiService;

// Export types
export type { User, League, Player, ApiResponse };