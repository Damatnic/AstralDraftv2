/**
 * Oracle API Client
 * Handles communication with the enhanced Oracle backend API
 */

// Data types for Oracle predictions and responses
export interface DataPoint {
  source: string;
  value: number | string;
  timestamp: string;
  confidence: number;
  weight: number;
}

export interface PredictionMetadata {
  difficulty: number;
  category: string;
  tags: string[];
  gameId?: string;
  playerId?: string;
  teamId?: string;
  [key: string]: unknown;
}

export interface UserSubmission {
  choice: number;
  confidence: number;
  submittedAt: string;
  reasoning?: string;
}

export interface PlayerPrediction {
  choice: number;
  confidence: number;
  submittedAt: string;
  reasoning?: string;
}

// Re-export types needed by components
export interface PredictionResponse {
  id: string;
  week: number;
  season: number;
  type: string;
  question: string;
  options: string[];
  oracleChoice: number;
  oracleConfidence: number;
  oracleReasoning: string;
  dataPoints: DataPoint[];
  expiresAt?: string;
  status?: string;
  participantsCount?: number;
  consensusChoice?: number;
  consensusConfidence?: number;
  userSubmission?: UserSubmission;
  playerPrediction?: PlayerPrediction;
}

export interface CreateOraclePredictionRequest {
  id: string;
  week: number;
  season?: number;
  type: string;
  category?: string;
  question: string;
  description?: string;
  options: string[];
  oracleChoice: number;
  oracleConfidence: number;
  oracleReasoning: string;
  dataPoints: DataPoint[];
  difficultyLevel?: number;
  pointsMultiplier?: number;
  expiresAt: string;
  tags?: string[];
  metadata?: PredictionMetadata;
}

export interface SubmitPredictionRequest {
  predictionId: string;
  playerNumber: number;
  choice: number;
  confidence: number;
  reasoning?: string;
}

export interface OracleApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface WeeklyPredictionsResponse {
  success: boolean;
  data: PredictionResponse[];
  week: number;
  season: number;
  count: number;
}

export interface UserStatsResponse {
  totalPredictions: number;
  correctPredictions: number;
  accuracy: number;
  points: number;
  rank: number;
  weeklyStats: Record<number, {
    predictions: number;
    correct: number;
    points: number;
  }>;
  typeStats: Record<string, {
    predictions: number;
    correct: number;
    accuracy: number;
  }>;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  points: number;
  accuracy: number;
  totalPredictions: number;
  rank: number;
  trend: 'up' | 'down' | 'same';
}

export interface LeaderboardResponse {
  success: boolean;
  data: LeaderboardEntry[];
  week: number;
  season: number;
  totalUsers: number;
}

export interface PredictionHistoryResponse {
  success: boolean;
  data: {
    predictions: Array<{
      id: string;
      question: string;
      userChoice: number;
      oracleChoice: number;
      isCorrect: boolean;
      points: number;
      submittedAt: string;
      resolvedAt: string;
    }>;
    totalCount: number;
    page: number;
    limit: number;
  };
}

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  headers: Record<string, string>;
}

class OracleApiClient {
  private readonly config: ApiConfig;
  private readonly BASE_URL: string;

  constructor() {
    this.config = {
      baseUrl: process.env.REACT_APP_ORACLE_API_URL || 'http://localhost:3001/api',
      timeout: 10000,
      retryAttempts: 3,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    this.BASE_URL = this.config.baseUrl;
  }

  /**
   * Make HTTP request with retry logic
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<OracleApiResponse<T>> {
    const url = `${this.BASE_URL}${endpoint}`;
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...this.config.headers,
        ...options.headers
      }
    };

    for (let attempt = 0; attempt < this.config.retryAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const response = await fetch(url, {
          ...requestOptions,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json() as T;
        return {
          success: true,
          data
        };
      } catch (error) {
        if (attempt === this.config.retryAttempts - 1) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
          };
        }
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    return {
      success: false,
      error: 'Max retry attempts reached'
    };
  }

  /**
   * Get weekly predictions
   */
  async getWeeklyPredictions(week: number, season: number = 2024): Promise<WeeklyPredictionsResponse> {
    const response = await this.makeRequest<PredictionResponse[]>(
      `/predictions/week/${week}?season=${season}`
    );

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
        week,
        season,
        count: response.data.length
      };
    }

    return {
      success: false,
      data: [],
      week,
      season,
      count: 0
    };
  }

  /**
   * Get specific prediction by ID
   */
  async getPrediction(predictionId: string): Promise<OracleApiResponse<PredictionResponse>> {
    return this.makeRequest<PredictionResponse>(`/predictions/${predictionId}`);
  }

  /**
   * Create a new Oracle prediction
   */
  async createPrediction(request: CreateOraclePredictionRequest): Promise<OracleApiResponse<PredictionResponse>> {
    return this.makeRequest<PredictionResponse>('/predictions', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  }

  /**
   * Submit user prediction
   */
  async submitPrediction(request: SubmitPredictionRequest): Promise<OracleApiResponse<{ points: number; isCorrect?: boolean }>> {
    return this.makeRequest<{ points: number; isCorrect?: boolean }>('/predictions/submit', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId: string, season?: number): Promise<OracleApiResponse<UserStatsResponse>> {
    const params = season ? `?season=${season}` : '';
    return this.makeRequest<UserStatsResponse>(`/users/${userId}/stats${params}`);
  }

  /**
   * Get leaderboard
   */
  async getLeaderboard(week?: number, season: number = 2024, limit: number = 100): Promise<LeaderboardResponse> {
    const params = new URLSearchParams({
      season: season.toString(),
      limit: limit.toString()
    });
    
    if (week !== undefined) {
      params.append('week', week.toString());
    }

    const response = await this.makeRequest<LeaderboardEntry[]>(`/leaderboard?${params}`);

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
        week: week || 0,
        season,
        totalUsers: response.data.length
      };
    }

    return {
      success: false,
      data: [],
      week: week || 0,
      season,
      totalUsers: 0
    };
  }

  /**
   * Get user prediction history
   */
  async getPredictionHistory(
    userId: string,
    page: number = 1,
    limit: number = 20,
    season?: number
  ): Promise<PredictionHistoryResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    if (season) {
      params.append('season', season.toString());
    }

    const response = await this.makeRequest<PredictionHistoryResponse['data']>(
      `/users/${userId}/predictions?${params}`
    );

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data
      };
    }

    return {
      success: false,
      data: {
        predictions: [],
        totalCount: 0,
        page,
        limit
      }
    };
  }

  /**
   * Update Oracle prediction with actual result
   */
  async updatePredictionResult(
    predictionId: string,
    actualResult: number,
    resolvedAt?: string
  ): Promise<OracleApiResponse<PredictionResponse>> {
    return this.makeRequest<PredictionResponse>(`/predictions/${predictionId}/resolve`, {
      method: 'PUT',
      body: JSON.stringify({
        actualResult,
        resolvedAt: resolvedAt || new Date().toISOString()
      })
    });
  }

  /**
   * Get Oracle performance analytics
   */
  async getOracleAnalytics(timeframe?: 'week' | 'month' | 'season'): Promise<OracleApiResponse<{
    accuracy: number;
    totalPredictions: number;
    confidenceCalibration: number;
    typeBreakdown: Record<string, { accuracy: number; count: number }>;
    weeklyTrends: Array<{ week: number; accuracy: number; count: number }>;
  }>> {
    const params = timeframe ? `?timeframe=${timeframe}` : '';
    return this.makeRequest(`/oracle/analytics${params}`);
  }

  /**
   * Bulk update predictions
   */
  async bulkUpdatePredictions(updates: Array<{
    id: string;
    actualResult: number;
    resolvedAt?: string;
  }>): Promise<OracleApiResponse<{ updated: number; failed: number }>> {
    return this.makeRequest('/predictions/bulk-resolve', {
      method: 'PUT',
      body: JSON.stringify({ updates })
    });
  }

  /**
   * Get prediction trends and insights
   */
  async getPredictionTrends(
    type?: string,
    weeks?: number
  ): Promise<OracleApiResponse<{
    accuracy: number;
    volume: number;
    difficulty: number;
    userEngagement: number;
    trends: Array<{
      week: number;
      accuracy: number;
      volume: number;
      avgConfidence: number;
    }>;
  }>> {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (weeks) params.append('weeks', weeks.toString());
    
    const query = params.toString() ? `?${params}` : '';
    return this.makeRequest(`/predictions/trends${query}`);
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<OracleApiResponse<{ status: string; timestamp: string; version: string }>> {
    return this.makeRequest('/health');
  }

  /**
   * Get API configuration
   */
  getConfig(): ApiConfig {
    return { ...this.config };
  }

  /**
   * Update API configuration
   */
  updateConfig(newConfig: Partial<ApiConfig>): void {
    Object.assign(this.config, newConfig);
  }
}

// Export singleton instance
export const oracleApiClient = new OracleApiClient();
export default oracleApiClient;
