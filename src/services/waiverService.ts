/**
 * Waiver Service
 * Handles waiver wire claims, FAAB bidding, and waiver management
 */

import { apiService } from './apiService';

export interface WaiverClaim {
  id: string;
  leagueId: string;
  teamId: string;
  week: number;
  season: number;
  type: 'ADD' | 'DROP' | 'ADD_DROP';
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'CANCELLED';
  addPlayer?: {
    playerId: string;
    playerName: string;
    position: string;
    team: string;
  };
  dropPlayer?: {
    playerId: string;
    playerName: string;
    position: string;
    team: string;
  };
  bidAmount: number;
  priority?: number;
  claimDetails: {
    submittedAt: string;
    expiresAt: string;
    notes: string;
    isBlindBid: boolean;
  };
  processingResults?: {
    finalBidAmount?: number;
    winningBid: boolean;
    competingClaims: number;
    highestBid?: number;
    processingOrder?: number;
  };
  failureReason?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;

export interface WaiverBudget {
  total: number;
  remaining: number;
  spent: number;
  pendingBids: number;
  available: number;

export interface ProcessingTime {
  nextProcessing: string;
  timeUntilProcessing: number;
  hoursUntilProcessing: number;
  pendingClaims: number;
  waiverSettings: {
    type: 'faab' | 'priority';
    budget?: number;
    minBid?: number;
    processDay: string;
  };

export interface AvailablePlayer {
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
    description?: string;
  };
  rankings: {
    overall?: number;
    position?: number;
  };
  projections?: {
    weekly?: Array<{
      week: number;
      fantasyPoints: {
        standard: number;
        ppr: number;
        halfPpr: number;
      };
    }>;
  };
  photoUrl?: string;
  pendingClaims: number;

export interface WaiverReport {
  claims: WaiverClaim[];
  summary: {
    totalClaims: number;
    successful: number;
    failed: number;
    totalFaabSpent: number;
    averageBid: number;
    topBids: Array<{
      playerName: string;
      teamName: string;
      bidAmount: number;
    }>;
  };
  week?: number;

class WaiverService {
  /**
   * Submit a waiver claim
   */
  async submitClaim(claimData: {
    type: 'ADD' | 'DROP' | 'ADD_DROP';
    addPlayerId?: string;
    dropPlayerId?: string;
    bidAmount: number;
    notes?: string;
  }): Promise<{ waiver: WaiverClaim; processingTime: string }> {
    const response = await apiService.post('/waivers/claim', claimData);
    return response.data;
  }

  /**
   * Get user's waiver claims
   */
  async getMyClaims(status?: 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'CANCELLED'): Promise<WaiverClaim[]> {
    const params = status ? { status } : {};
    const response = await apiService.get('/waivers/my-claims', { params });
    return response.data.claims;
  }

  /**
   * Get all waiver claims for a league
   */
  async getLeagueClaims(leagueId: string, status?: string): Promise<WaiverClaim[]> {
    const params = status ? { status } : {};
    const response = await apiService.get(`/waivers/league/${leagueId}`, { params });
    return response.data.claims;
  }

  /**
   * Cancel a pending waiver claim
   */
  async cancelClaim(waiverClaimId: string): Promise<void> {
    await apiService.post(`/waivers/${waiverClaimId}/cancel`);
  }

  /**
   * Get available players for waiver claims
   */
  async getAvailablePlayers(
    leagueId: string,
    options: {
      position?: string;
      limit?: number;
      search?: string;
    } = {}
  ): Promise<AvailablePlayer[]> {
    const params = {
      position: options.position,
      limit: options.limit || 50,
      search: options.search
    };
    
    const response = await apiService.get(`/waivers/available/${leagueId}`, { params });
    return response.data.players;
  }

  /**
   * Get next waiver processing time
   */
  async getProcessingTime(leagueId: string): Promise<ProcessingTime> {
    const response = await apiService.get(`/waivers/processing-time/${leagueId}`);
    return response.data;
  }

  /**
   * Process waivers for a league (commissioner only)
   */
  async processWaivers(leagueId: string): Promise<{
    processed: number;
    successful: number;
    failed: number;
  }> {
    const response = await apiService.post(`/waivers/process/${leagueId}`);
    return response.data.results;
  }

  /**
   * Get waiver processing report
   */
  async getWaiverReport(leagueId: string, week?: number): Promise<WaiverReport> {
    const params = week ? { week } : {};
    const response = await apiService.get(`/waivers/report/${leagueId}`, { params });
    return response.data;
  }

  /**
   * Get team's FAAB budget information
   */
  async getFaabBudget(teamId: string): Promise<{
    budget: WaiverBudget;
    pendingClaims: number;
  }> {
    const response = await apiService.get(`/waivers/budget/${teamId}`);
    return response.data;
  }

  /**
   * Get waiver wire recommendations (AI-powered)
   */
  async getWaiverRecommendations(leagueId: string, limit: number = 10): Promise<{
    success: boolean;
    recommendations: {
      type: string;
      analysis: string;
      week: number;
      topTargets: Array<{
        name: string;
        priority: string;
      }>;
      generatedAt: string;
      source: string;
    };
  }> {
    const response = await apiService.post('/oracle/waiver-recommendations', {
      leagueId,
//       limit
    });
    return response.data;
  }

  /**
   * Calculate recommended bid amount
   */
  calculateRecommendedBid(
    player: AvailablePlayer,
    budget: WaiverBudget,
    competingClaims: number = 0
  ): {
    conservative: number;
    aggressive: number;
    recommended: number;
    reasoning: string;
  } {
    const available = budget.available;
    const playerRank = player.rankings.overall || 999;
    
    // Base bid calculation
    let baseBid = 1;
    
    if (playerRank <= 50) baseBid = Math.min(available * 0.3, 50); // Top 50 players
    else if (playerRank <= 100) baseBid = Math.min(available * 0.2, 30); // Top 100 players
    else if (playerRank <= 200) baseBid = Math.min(available * 0.15, 20); // Top 200 players
    else baseBid = Math.min(available * 0.1, 10); // Others
    
    // Adjust for competition
    const competitionMultiplier = 1 + (competingClaims * 0.2);
    baseBid *= competitionMultiplier;
    
    // Ensure minimum bid
    baseBid = Math.max(baseBid, 1);
    
    const conservative = Math.floor(baseBid * 0.7);
    const aggressive = Math.floor(baseBid * 1.5);
    const recommended = Math.floor(baseBid);
    
    let reasoning = `Based on player ranking (#${playerRank})`;
    if (competingClaims > 0) {
      reasoning += ` and ${competingClaims} competing claims`;
    }
    reasoning += `. Conservative: $${conservative}, Aggressive: $${aggressive}`;
    
    return {
      conservative: Math.max(conservative, 1),
      aggressive: Math.min(aggressive, available),
      recommended: Math.min(recommended, available),
//       reasoning
    };
  }

  /**
   * Format time until processing
   */
  formatTimeUntilProcessing(timeUntilProcessing: number): string {
    if (timeUntilProcessing <= 0) return 'Processing now';
    
    const hours = Math.floor(timeUntilProcessing / (1000 * 60 * 60));
    const minutes = Math.floor((timeUntilProcessing % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days}d ${remainingHours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  /**
   * Get waiver priority explanation
   */
  getWaiverPriorityExplanation(type: 'faab' | 'priority'): string {
    if (type === 'faab') {
      return 'FAAB (Free Agent Acquisition Budget) - Highest bid wins. Ties go to earlier submission time.';
    } else {
      return 'Priority-based - Claims processed in waiver priority order. Priority resets weekly based on standings.';
    }
  }

  /**
   * Validate waiver claim
   */
  validateClaim(claimData: {
    type: 'ADD' | 'DROP' | 'ADD_DROP';
    addPlayerId?: string;
    dropPlayerId?: string;
    bidAmount: number;
    availableBudget: number;
    minBid: number;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check bid amount
    if (claimData.bidAmount < claimData.minBid) {
      errors.push(`Minimum bid is $${claimData.minBid}`);
    }

    if (claimData.bidAmount > claimData.availableBudget) {
      errors.push(`Insufficient FAAB budget. Available: $${claimData.availableBudget}`);
    }

    // Check required players
    if ((claimData.type === 'ADD' || claimData.type === 'ADD_DROP') && !claimData.addPlayerId) {
      errors.push('Player to add is required');
    }

    if ((claimData.type === 'DROP' || claimData.type === 'ADD_DROP') && !claimData.dropPlayerId) {
      errors.push('Player to drop is required');
    }

    return {
      isValid: errors.length === 0,
//       errors
    };
  }

export const waiverService = new WaiverService();