/**
 * API Response Types
 * Standardized response interfaces for all API endpoints
 */

// ==================== BASE RESPONSE TYPES ====================

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  requestId: string;
  version: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  field?: string; // For validation errors
  stack?: string; // Only in development
}

export interface ErrorResponse {
  success: false;
  error: ApiError;
  timestamp: string;
  requestId: string;
  version: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextPage?: number;
  prevPage?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
  filters?: Record<string, any>;
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

// ==================== AUTHENTICATION RESPONSES ====================

export interface LoginResponse extends ApiResponse {
  data: {
    user: {
      id: string;
      username: string;
      email: string;
      profile: {
        firstName: string;
        lastName: string;
        avatar: string;
      };
      role: string;
      subscription: {
        tier: string;
        features: string[];
      };
    };
    tokens: {
      access: string;
      refresh: string;
      expiresAt: string;
    };
    session: {
      id: string;
      expiresAt: string;
    };
  };
}

export interface RefreshTokenResponse extends ApiResponse {
  data: {
    access: string;
    refresh: string;
    expiresAt: string;
  };
}

export interface RegisterResponse extends ApiResponse {
  data: {
    user: {
      id: string;
      username: string;
      email: string;
      emailVerified: boolean;
    };
    verificationRequired: boolean;
    verificationToken?: string;
  };
}

// ==================== USER RESPONSES ====================

export interface UserProfileResponse extends ApiResponse {
  data: {
    id: string;
    username: string;
    email: string;
    profile: {
      firstName: string;
      lastName: string;
      displayName: string;
      bio?: string;
      avatar: string;
      banner?: string;
      location?: {
        city: string;
        state: string;
        country: string;
      };
    };
    stats: {
      totalLeagues: number;
      leaguesWon: number;
      winPercentage: number;
      averageDraftGrade: string;
    };
    achievements: Array<{
      id: string;
      name: string;
      icon: string;
      unlockedAt: string;
    }>;
    preferences: {
      theme: string;
      notifications: Record<string, boolean>;
      privacy: Record<string, any>;
    };
  };
}

export interface UserStatsResponse extends ApiResponse {
  data: {
    career: {
      totalLeagues: number;
      activeLeagues: number;
      leaguesWon: number;
      winPercentage: number;
      totalTrades: number;
      totalWaiverClaims: number;
    };
    currentSeason: {
      record: {
        wins: number;
        losses: number;
        ties: number;
      };
      pointsFor: number;
      pointsAgainst: number;
      rank: number;
    };
    records: Array<{
      category: string;
      value: number | string;
      season?: number;
      week?: number;
    }>;
  };
}

// ==================== LEAGUE RESPONSES ====================

export interface LeagueListResponse extends PaginatedResponse<{
  id: string;
  name: string;
  avatar: string;
  status: string;
  teamCount: number;
  currentWeek: number;
  myTeam: {
    id: string;
    name: string;
    record: {
      wins: number;
      losses: number;
      ties: number;
    };
    rank: number;
  };
  commissioner: {
    id: string;
    username: string;
    avatar: string;
  };
  lastActivity: string;
}> {}

export interface LeagueDetailResponse extends ApiResponse {
  data: {
    league: {
      id: string;
      name: string;
      description?: string;
      avatar: string;
      status: string;
      type: string;
      settings: {
        teamCount: number;
        scoring: string;
        roster: {
          starters: Record<string, number>;
          bench: number;
          ir: number;
        };
        draftSettings: {
          type: string;
          date?: string;
          timePerPick: number;
        };
      };
      commissioner: {
        id: string;
        username: string;
        profile: {
          displayName: string;
          avatar: string;
        };
      };
      teams: Array<{
        id: string;
        name: string;
        owner: {
          id: string;
          username: string;
          profile: {
            displayName: string;
            avatar: string;
          };
        };
        record: {
          wins: number;
          losses: number;
          ties: number;
        };
        pointsFor: number;
        pointsAgainst: number;
      }>;
      currentWeek: number;
      draftCompleted: boolean;
    };
    userTeam: {
      id: string;
      name: string;
      roster: any[]; // Will be typed more specifically
      startingLineup: Record<string, string | null>;
      bench: any[];
    };
    permissions: {
      canManageLeague: boolean;
      canManageRoster: boolean;
      canTrade: boolean;
      canUseWaivers: boolean;
    };
  };
}

export interface CreateLeagueResponse extends ApiResponse {
  data: {
    league: {
      id: string;
      name: string;
      inviteCode: string;
      status: string;
    };
    team: {
      id: string;
      name: string;
    };
    inviteLinks: string[];
  };
}

// ==================== DRAFT RESPONSES ====================

export interface DraftStateResponse extends ApiResponse {
  data: {
    draft: {
      id: string;
      leagueId: string;
      status: string;
      settings: {
        format: string;
        rounds: number;
        timePerPick: number;
        teamCount: number;
      };
      currentPick: number;
      currentRound: number;
      currentTeam: {
        id: string;
        name: string;
        owner: {
          username: string;
          avatar: string;
        };
      };
      timer: {
        timeRemaining: number;
        state: string;
        overTime: number;
      };
      draftOrder: string[];
    };
    picks: Array<{
      pick: number;
      round: number;
      teamId: string;
      playerId?: string;
      player?: {
        id: string;
        name: string;
        position: string;
        team: string;
      };
      timestamp?: string;
      timeUsed: number;
      type: string;
    }>;
    availablePlayers: any[]; // Will be typed more specifically
    myTeam: {
      id: string;
      roster: any[];
      queue: string[];
      budget?: number;
    };
    recommendations: Array<{
      player: any;
      type: string;
      reasoning: string;
      priority: number;
    }>;
  };
}

export interface DraftPickResponse extends ApiResponse {
  data: {
    pick: {
      pick: number;
      round: number;
      teamId: string;
      playerId: string;
      player: {
        id: string;
        name: string;
        position: string;
        team: string;
      };
      timestamp: string;
      timeUsed: number;
    };
    nextPick: {
      pick: number;
      round: number;
      teamId: string;
      timeRemaining: number;
    };
    updatedRosters: Record<string, any[]>;
    draftCompleted: boolean;
  };
}

// ==================== PLAYER RESPONSES ====================

export interface PlayerListResponse extends PaginatedResponse<{
  id: string;
  name: string;
  position: string;
  team: string;
  rank: number;
  tier: number;
  adp: number;
  projectedPoints: number;
  status: string;
  injuryStatus?: string;
  byeWeek: number;
}> {}

export interface PlayerDetailResponse extends ApiResponse {
  data: {
    player: {
      id: string;
      name: string;
      position: string;
      team: {
        id: string;
        name: string;
        abbreviation: string;
      };
      bio: {
        age: number;
        height: string;
        weight: number;
        college: string;
        experience: number;
      };
      stats: {
        current: Record<string, number>;
        projected: Record<string, number>;
        historical: Array<{
          season: number;
          stats: Record<string, number>;
        }>;
      };
      rankings: {
        overall: number;
        position: number;
        tier: number;
        adp: number;
      };
      schedule: {
        nextGame: {
          week: number;
          opponent: string;
          isHome: boolean;
          gameTime: string;
        };
        byeWeek: number;
        strength: string;
      };
      news: Array<{
        id: string;
        headline: string;
        summary: string;
        source: string;
        publishedAt: string;
        impact: string;
      }>;
    };
    ownership: {
      isOwned: boolean;
      ownedBy?: {
        teamId: string;
        teamName: string;
        owner: string;
      };
      availability: string;
    };
    comparisons: Array<{
      playerId: string;
      name: string;
      similarityScore: number;
    }>;
  };
}

export interface PlayerStatsResponse extends ApiResponse {
  data: {
    playerId: string;
    season: number;
    weeks: Array<{
      week: number;
      stats: Record<string, number>;
      opponent: string;
      gameResult: 'W' | 'L' | 'T';
      fantasyPoints: number;
    }>;
    seasonTotals: Record<string, number>;
    averages: Record<string, number>;
    trends: {
      last4Weeks: number;
      last8Weeks: number;
      homeVsAway: {
        home: Record<string, number>;
        away: Record<string, number>;
      };
    };
  };
}

// ==================== MATCHUP RESPONSES ====================

export interface MatchupResponse extends ApiResponse {
  data: {
    matchup: {
      id: string;
      week: number;
      season: number;
      status: string;
      isPlayoff: boolean;
      homeTeam: {
        id: string;
        name: string;
        score: number;
        projected: number;
        lineup: Array<{
          position: string;
          player: {
            id: string;
            name: string;
            position: string;
          };
          score: number;
          projected: number;
          status: string;
        }>;
      };
      awayTeam: {
        id: string;
        name: string;
        score: number;
        projected: number;
        lineup: Array<{
          position: string;
          player: {
            id: string;
            name: string;
            position: string;
          };
          score: number;
          projected: number;
          status: string;
        }>;
      };
    };
    analysis: {
      winProbability: number;
      keyMatchups: Array<{
        position: string;
        homePlayer: string;
        awayPlayer: string;
        advantage: 'HOME' | 'AWAY' | 'EVEN';
      }>;
      recommendations: string[];
    };
  };
}

export interface StandingsResponse extends ApiResponse {
  data: {
    standings: Array<{
      rank: number;
      team: {
        id: string;
        name: string;
        owner: {
          username: string;
          avatar: string;
        };
      };
      record: {
        wins: number;
        losses: number;
        ties: number;
        percentage: number;
      };
      points: {
        for: number;
        against: number;
        differential: number;
      };
      streak: {
        type: 'W' | 'L' | 'T';
        count: number;
      };
      playoffOdds: number;
      clinched?: string;
      eliminated?: boolean;
    }>;
    divisions?: Array<{
      name: string;
      teams: Array<any>;
    }>;
    wildCard?: {
      cutoff: number;
      teams: Array<any>;
    };
  };
}

// ==================== TRADE RESPONSES ====================

export interface TradeListResponse extends PaginatedResponse<{
  id: string;
  status: string;
  proposedAt: string;
  expiresAt: string;
  fromTeam: {
    id: string;
    name: string;
    owner: string;
  };
  toTeam: {
    id: string;
    name: string;
    owner: string;
  };
  itemsOffered: Array<{
    type: 'PLAYER' | 'PICK' | 'FAAB';
    item: any;
  }>;
  itemsRequested: Array<{
    type: 'PLAYER' | 'PICK' | 'FAAB';
    item: any;
  }>;
}> {}

export interface TradeAnalysisResponse extends ApiResponse {
  data: {
    tradeId: string;
    analysis: {
      fairnessScore: number;
      winner: 'TEAM_A' | 'TEAM_B' | 'FAIR';
      teamA: {
        value: number;
        need: number;
        risk: number;
        summary: string;
      };
      teamB: {
        value: number;
        need: number;
        risk: number;
        summary: string;
      };
    };
    recommendation: 'ACCEPT' | 'REJECT' | 'COUNTER';
    reasoning: string;
    alternativeOffers?: Array<{
      description: string;
      itemsToOffer: any[];
      itemsToRequest: any[];
    }>;
  };
}

// ==================== WAIVER RESPONSES ====================

export interface WaiverListResponse extends PaginatedResponse<{
  id: string;
  playerId: string;
  player: {
    name: string;
    position: string;
    team: string;
  };
  teamId: string;
  team: {
    name: string;
    owner: string;
  };
  bid: number;
  status: string;
  processedAt?: string;
  priority: number;
}> {}

export interface WaiverAdviceResponse extends ApiResponse {
  data: {
    playerId: string;
    player: {
      name: string;
      position: string;
    };
    advice: {
      suggestedBid: number;
      bidRange: {
        min: number;
        max: number;
      };
      priority: 'HIGH' | 'MEDIUM' | 'LOW';
      reasoning: string;
      riskLevel: string;
      alternatives: Array<{
        playerId: string;
        name: string;
        reasoning: string;
      }>;
    };
    roster: {
      droppablePlayers: Array<{
        playerId: string;
        name: string;
        dropPriority: number;
        reasoning: string;
      }>;
      needsAnalysis: string;
    };
  };
}

// ==================== ANALYTICS RESPONSES ====================

export interface AnalyticsResponse extends ApiResponse {
  data: {
    timeframe: string;
    metrics: Record<string, number>;
    trends: Array<{
      date: string;
      value: number;
    }>;
    comparisons: {
      leagueAverage: number;
      percentile: number;
      rank: number;
    };
    insights: string[];
  };
}

export interface PredictionResponse extends ApiResponse {
  data: {
    playerId: string;
    week: number;
    prediction: {
      points: number;
      confidence: number;
      range: {
        floor: number;
        ceiling: number;
      };
    };
    factors: Record<string, number>;
    scenario: string;
    lastUpdated: string;
  };
}

// ==================== HEALTH CHECK ====================

export interface HealthCheckResponse extends ApiResponse {
  data: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: string;
    uptime: number;
    version: string;
    environment: string;
    services: {
      database: 'up' | 'down';
      cache: 'up' | 'down';
      external: 'up' | 'down';
    };
    metrics: {
      responseTime: number;
      memoryUsage: number;
      cpuUsage: number;
    };
  };
}

// ==================== GENERIC OPERATION RESPONSES ====================

export interface CreateResponse<T = any> extends ApiResponse<T> {
  data: T & {
    id: string;
    createdAt: string;
  };
}

export interface UpdateResponse<T = any> extends ApiResponse<T> {
  data: T & {
    id: string;
    updatedAt: string;
  };
}

export interface DeleteResponse extends ApiResponse {
  data: {
    id: string;
    deletedAt: string;
    success: boolean;
  };
}

// ==================== EXPORT ALL ====================

export type {
  ApiResponse,
  ApiError,
  ErrorResponse,
  PaginationMeta,
  PaginatedResponse,
  LoginResponse,
  RefreshTokenResponse,
  RegisterResponse,
  UserProfileResponse,
  UserStatsResponse,
  LeagueListResponse,
  LeagueDetailResponse,
  CreateLeagueResponse,
  DraftStateResponse,
  DraftPickResponse,
  PlayerListResponse,
  PlayerDetailResponse,
  PlayerStatsResponse,
  MatchupResponse,
  StandingsResponse,
  TradeListResponse,
  TradeAnalysisResponse,
  WaiverListResponse,
  WaiverAdviceResponse,
  AnalyticsResponse,
  PredictionResponse,
  HealthCheckResponse,
  CreateResponse,
  UpdateResponse,
  DeleteResponse,
};