/**
 * Scoring Service
 * Handles real-time fantasy scoring and matchup management
 */

import { apiService } from './apiService';
import { socketService } from './socketService';

export interface Matchup {
  id: string;
  leagueId: string;
  week: number;
  season: number;
  matchupType: 'REGULAR_SEASON' | 'PLAYOFF' | 'CHAMPIONSHIP' | 'CONSOLATION';
  homeTeam: {
    teamId: string;
    score: number;
    projectedScore: number;
    lineup: LineupPlayer[];
    benchPoints: number;
  };
  awayTeam: {
    teamId: string;
    score: number;
    projectedScore: number;
    lineup: LineupPlayer[];
    benchPoints: number;
  };
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'FINAL' | 'POSTPONED';
  winner?: {
    teamId: string;
    margin: number;
    isTie: boolean;
  };
  gameStart: string;
  gameEnd?: string;
  lastUpdated: string;
  playoffInfo?: {
    round: number;
    seed: {
      home: number;
      away: number;
    };
    isElimination: boolean;
  };
  stats: {
    totalPoints: number;
    highestScoringPlayer?: {
      playerId: string;
      points: number;
      team: 'HOME' | 'AWAY';
    };
    lowestScoringPlayer?: {
      playerId: string;
      points: number;
      team: 'HOME' | 'AWAY';
    };
    benchHighScore: number;
    projectionAccuracy: number;
  };
  tiebreaker?: {
    method: 'BENCH_POINTS' | 'QB_POINTS' | 'SEASON_RECORD';
    winner: string;
    details: string;
  };
}

export interface LineupPlayer {
  player: string;
  position: string;
  points: number;
  projectedPoints: number;
  isStarter: boolean;
}

export interface ScoreUpdate {
  matchupId: string;
  week: number;
  homeTeam: {
    teamId: string;
    score: number;
    projectedScore: number;
  };
  awayTeam: {
    teamId: string;
    score: number;
    projectedScore: number;
  };
  status: string;
  lastUpdated: string;
}

export interface ScoringStats {
  isUpdating: boolean;
  lastUpdateTime: string;
  cacheSize: number;
  activeIntervals: number;
  isGameTime: boolean;
  currentNFLWeek: number;
}

class ScoringService {
  private scoreUpdateCallbacks: Map<string, (update: ScoreUpdate) => void> = new Map();

  constructor() {
    this.initializeSocketListeners();
  }

  /**
   * Initialize WebSocket listeners for real-time score updates
   */
  private initializeSocketListeners(): void {
    socketService.on('score:update', (update: ScoreUpdate) => {
      this.handleScoreUpdate(update);
    });

    socketService.on('matchup:finalized', (data: { matchupId: string; winner: any; finalizedBy: string }) => {
      this.handleMatchupFinalized(data);
    });
  }

  /**
   * Handle real-time score updates
   */
  private handleScoreUpdate(update: ScoreUpdate): void {
    // Notify all registered callbacks
    this.scoreUpdateCallbacks.forEach((callback) => {
      callback(update);
    });

    // Update local storage cache if needed
    this.updateLocalScoreCache(update);
  }

  /**
   * Handle matchup finalization
   */
  private handleMatchupFinalized(data: { matchupId: string; winner: any; finalizedBy: string }): void {
    console.log(`Matchup ${data.matchupId} finalized by ${data.finalizedBy}`);
    // Trigger UI updates for finalized matchup
  }

  /**
   * Subscribe to score updates for a specific matchup
   */
  subscribeToScoreUpdates(matchupId: string, callback: (update: ScoreUpdate) => void): void {
    this.scoreUpdateCallbacks.set(matchupId, callback);
  }

  /**
   * Unsubscribe from score updates
   */
  unsubscribeFromScoreUpdates(matchupId: string): void {
    this.scoreUpdateCallbacks.delete(matchupId);
  }

  /**
   * Get weekly matchups for a league
   */
  async getWeeklyMatchups(leagueId: string, week: number): Promise<Matchup[]> {
    const response = await apiService.get(`/matchups/league/${leagueId}/week/${week}`);
    return response.data.matchups;
  }

  /**
   * Get current week matchups for a league
   */
  async getCurrentMatchups(leagueId: string): Promise<Matchup[]> {
    const response = await apiService.get(`/matchups/league/${leagueId}/current`);
    return response.data.matchups;
  }

  /**
   * Get all matchups for a specific team
   */
  async getTeamMatchups(teamId: string, season?: number): Promise<Matchup[]> {
    const params = season ? { season } : {};
    const response = await apiService.get(`/matchups/team/${teamId}`, { params });
    return response.data.matchups;
  }

  /**
   * Get specific matchup details
   */
  async getMatchupDetails(matchupId: string): Promise<Matchup> {
    const response = await apiService.get(`/matchups/${matchupId}`);
    return response.data.matchup;
  }

  /**
   * Create weekly matchups for a league (commissioner only)
   */
  async createWeeklyMatchups(leagueId: string, week: number): Promise<Matchup[]> {
    const response = await apiService.post('/matchups/create', { leagueId, week });
    return response.data.matchups;
  }

  /**
   * Update matchup score (commissioner only)
   */
  async updateMatchupScore(
    matchupId: string,
    teamId: string,
    score: number,
    lineup?: LineupPlayer[]
  ): Promise<Matchup> {
    const response = await apiService.post(`/matchups/${matchupId}/update-score`, {
      teamId,
      score,
      lineup
    });
    return response.data.matchup;
  }

  /**
   * Finalize a matchup (commissioner only)
   */
  async finalizeMatchup(matchupId: string): Promise<Matchup> {
    const response = await apiService.post(`/matchups/${matchupId}/finalize`);
    return response.data.matchup;
  }

  /**
   * Update live scores for all matchups in a league/week
   */
  async updateLiveScores(leagueId: string, week: number): Promise<{
    updatedMatchups: number;
  }> {
    const response = await apiService.post(`/matchups/update-scores/${leagueId}/${week}`);
    return response.data.result;
  }

  /**
   * Get playoff matchups for a league
   */
  async getPlayoffMatchups(leagueId: string, round?: number): Promise<Matchup[]> {
    const params = round ? { round } : {};
    const response = await apiService.get(`/matchups/playoffs/${leagueId}`, { params });
    return response.data.matchups;
  }

  /**
   * Get scoring engine statistics (admin only)
   */
  async getScoringStats(): Promise<ScoringStats> {
    const response = await apiService.get('/matchups/scoring-stats');
    return response.data.stats;
  }

  /**
   * Calculate fantasy points for player stats
   */
  calculateFantasyPoints(
    stats: {
      passing?: {
        yards: number;
        touchdowns: number;
        interceptions: number;
      };
      rushing?: {
        yards: number;
        touchdowns: number;
        fumbles: number;
      };
      receiving?: {
        yards: number;
        touchdowns: number;
        receptions: number;
        fumbles: number;
      };
      kicking?: {
        fieldGoalsMade: number;
        extraPointsMade: number;
      };
      defense?: {
        sacks: number;
        interceptions: number;
        fumbleRecoveries: number;
        defensiveTouchdowns: number;
        safeties: number;
        pointsAllowed: number;
      };
    },
    scoringType: 'standard' | 'ppr' | 'half-ppr' = 'ppr'
  ): number {
    let points = 0;

    // Passing points
    if (stats.passing) {
      points += (stats.passing.yards || 0) * 0.04; // 1 point per 25 yards
      points += (stats.passing.touchdowns || 0) * 4;
      points += (stats.passing.interceptions || 0) * -2;
    }

    // Rushing points
    if (stats.rushing) {
      points += (stats.rushing.yards || 0) * 0.1; // 1 point per 10 yards
      points += (stats.rushing.touchdowns || 0) * 6;
      points += (stats.rushing.fumbles || 0) * -2;
    }

    // Receiving points
    if (stats.receiving) {
      points += (stats.receiving.yards || 0) * 0.1; // 1 point per 10 yards
      points += (stats.receiving.touchdowns || 0) * 6;
      points += (stats.receiving.fumbles || 0) * -2;

      // PPR bonus
      if (scoringType === 'ppr') {
        points += (stats.receiving.receptions || 0) * 1;
      } else if (scoringType === 'half-ppr') {
        points += (stats.receiving.receptions || 0) * 0.5;
      }
    }

    // Kicking points
    if (stats.kicking) {
      points += (stats.kicking.fieldGoalsMade || 0) * 3;
      points += (stats.kicking.extraPointsMade || 0) * 1;
    }

    // Defense/Special Teams points
    if (stats.defense) {
      points += (stats.defense.sacks || 0) * 1;
      points += (stats.defense.interceptions || 0) * 2;
      points += (stats.defense.fumbleRecoveries || 0) * 2;
      points += (stats.defense.defensiveTouchdowns || 0) * 6;
      points += (stats.defense.safeties || 0) * 2;

      // Points allowed (for DST)
      const pointsAllowed = stats.defense.pointsAllowed || 0;
      if (pointsAllowed === 0) points += 10;
      else if (pointsAllowed <= 6) points += 7;
      else if (pointsAllowed <= 13) points += 4;
      else if (pointsAllowed <= 20) points += 1;
      else if (pointsAllowed <= 27) points += 0;
      else if (pointsAllowed <= 34) points += -1;
      else points += -4;
    }

    return Math.round(points * 100) / 100;
  }

  /**
   * Format score for display
   */
  formatScore(score: number): string {
    return score.toFixed(1);
  }

  /**
   * Get matchup status display
   */
  getMatchupStatusDisplay(matchup: Matchup): {
    status: string;
    color: string;
    description: string;
  } {
    switch (matchup.status) {
      case 'SCHEDULED':
        return {
          status: 'Scheduled',
          color: 'gray',
          description: `Starts ${new Date(matchup.gameStart).toLocaleDateString()}`
        };
      case 'IN_PROGRESS':
        return {
          status: 'Live',
          color: 'green',
          description: 'Game in progress'
        };
      case 'FINAL':
        return {
          status: 'Final',
          color: 'blue',
          description: 'Game completed'
        };
      case 'POSTPONED':
        return {
          status: 'Postponed',
          color: 'yellow',
          description: 'Game postponed'
        };
      default:
        return {
          status: 'Unknown',
          color: 'gray',
          description: 'Status unknown'
        };
    }
  }

  /**
   * Get win probability based on current scores and projections
   */
  calculateWinProbability(matchup: Matchup): {
    homeTeamWinProbability: number;
    awayTeamWinProbability: number;
  } {
    if (matchup.status === 'FINAL') {
      return {
        homeTeamWinProbability: matchup.homeTeam.score > matchup.awayTeam.score ? 100 : 0,
        awayTeamWinProbability: matchup.awayTeam.score > matchup.homeTeam.score ? 100 : 0
      };
    }

    const homeScore = matchup.homeTeam.score;
    const awayScore = matchup.awayTeam.score;
    const homeProjected = matchup.homeTeam.projectedScore;
    const awayProjected = matchup.awayTeam.projectedScore;

    // Simple probability calculation based on current score and remaining projection
    const scoreDiff = homeScore - awayScore;
    const projectedDiff = homeProjected - awayProjected;
    
    // Combine current performance with projections
    const totalDiff = scoreDiff + (projectedDiff * 0.3);
    
    // Convert to probability (sigmoid function)
    const probability = 1 / (1 + Math.exp(-totalDiff / 10));
    
    return {
      homeTeamWinProbability: Math.round(probability * 100),
      awayTeamWinProbability: Math.round((1 - probability) * 100)
    };
  }

  /**
   * Update local score cache
   */
  private updateLocalScoreCache(update: ScoreUpdate): void {
    const cacheKey = `matchup_${update.matchupId}_scores`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      const data = JSON.parse(cached);
      data.lastUpdate = update.lastUpdated;
      data.homeScore = update.homeTeam.score;
      data.awayScore = update.awayTeam.score;
      localStorage.setItem(cacheKey, JSON.stringify(data));
    }
  }

  /**
   * Get cached scores for offline viewing
   */
  getCachedScores(matchupId: string): {
    homeScore: number;
    awayScore: number;
    lastUpdate: string;
  } | null {
    const cacheKey = `matchup_${matchupId}_scores`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }
    
    return null;
  }

  /**
   * Check if it's currently NFL game time
   */
  isGameTime(): boolean {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 4 = Thursday, 1 = Monday
    const hour = now.getHours();

    // Thursday Night Football (8 PM - 12 AM)
    if (day === 4 && hour >= 20) return true;
    
    // Sunday games (1 PM - 12 AM)
    if (day === 0 && hour >= 13) return true;
    
    // Monday Night Football (8 PM - 12 AM)
    if (day === 1 && hour >= 20 && hour <= 23) return true;

    return false;
  }

  /**
   * Get current NFL week
   */
  getCurrentNFLWeek(): number {
    const now = new Date();
    const seasonStart = new Date(now.getFullYear(), 8, 1); // September 1st
    const weeksSinceStart = Math.floor((now.getTime() - seasonStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
    return Math.min(Math.max(weeksSinceStart + 1, 1), 18);
  }
}

export const scoringService = new ScoringService();