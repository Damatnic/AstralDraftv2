/**
 * DYNASTY & KEEPER LEAGUE SERVICE
 * Complete dynasty and keeper league management system
 * Supports contracts, rookie drafts, multi-year tracking, and taxi squads
 */

import { Player, Team, League, DraftPick } from '../../types';
import { fantasyDataService } from './FantasyDataService';
import { logger } from '../loggingService';

/**
 * Contract structure for dynasty leagues
 */
export interface PlayerContract {
  playerId: string;
  teamId: string;
  yearsRemaining: number;
  salary: number;
  deadCapIfCut: number;
  canFranchiseTag: boolean;
  canRestructure: boolean;
  signedDate: Date;
  expiryYear: number;
  contractType: 'rookie' | 'veteran' | 'franchise' | 'transition';
}

/**
 * Keeper settings for leagues
 */
export interface KeeperSettings {
  maxKeepers: number;
  keeperCostIncrease: number; // Percentage or round penalty
  keeperDeadline: Date;
  allowTradingKeeperRights: boolean;
  keeperCostType: 'auction' | 'draft-round' | 'fixed';
  minYearsOnRoster: number; // Minimum years before keeper eligible
}

/**
 * Dynasty league settings
 */
export interface DynastySettings {
  salaryCap: number;
  contractYearLimits: {
    rookie: number;
    veteran: number;
    max: number;
  };
  taxiSquadSize: number;
  taxiSquadEligibility: 'rookies-only' | 'second-year' | 'custom';
  tradableDraftPicks: {
    enabled: boolean;
    maxYearsOut: number;
  };
  rookieDraft: {
    enabled: boolean;
    rounds: number;
    timePerPick: number;
    linearOrder: boolean; // vs snake
  };
  franchiseTagsPerTeam: number;
  injuredReserveSlots: number;
}

/**
 * Rookie draft configuration
 */
export interface RookieDraft {
  id: string;
  leagueId: string;
  year: number;
  status: 'scheduled' | 'in-progress' | 'completed';
  draftOrder: string[]; // Team IDs in order
  picks: RookieDraftPick[];
  startTime: Date;
  currentPick?: number;
}

/**
 * Rookie draft pick
 */
export interface RookieDraftPick {
  pickNumber: number;
  round: number;
  originalTeam: string;
  currentOwner: string;
  player?: Player;
  timestamp?: Date;
  traded: boolean;
  compensatory?: boolean;
}

/**
 * Taxi squad member
 */
export interface TaxiSquadMember {
  playerId: string;
  teamId: string;
  eligibleUntil: Date;
  activationDeadline?: Date;
  yearOnTaxi: number;
}

/**
 * Multi-year team history
 */
export interface TeamDynastyHistory {
  teamId: string;
  seasons: {
    year: number;
    record: { wins: number; losses: number; ties?: number };
    playoffResult?: 'missed' | 'wildcard' | 'division' | 'conference' | 'champion';
    roster: Player[];
    trades: number;
    draftGrade: string;
  }[];
  allTimeRecord: { wins: number; losses: number; ties?: number };
  championships: number;
  playoffAppearances: number;
  bestFinish: number;
  worstFinish: number;
}

/**
 * Trade involving draft picks
 */
export interface DraftPickTrade {
  tradeId: string;
  picks: {
    year: number;
    round: number;
    originalOwner: string;
    condition?: string; // e.g., "Top 5 protected"
  }[];
  players: Player[];
  faabAmount?: number;
}

/**
 * DYNASTY LEAGUE SERVICE CLASS
 */
export class DynastyLeagueService {
  private contracts: Map<string, PlayerContract[]>;
  private keeperSelections: Map<string, Set<string>>;
  private taxiSquads: Map<string, TaxiSquadMember[]>;
  private dynastySettings: Map<string, DynastySettings>;
  private teamHistories: Map<string, TeamDynastyHistory>;

  constructor() {
    this.contracts = new Map();
    this.keeperSelections = new Map();
    this.taxiSquads = new Map();
    this.dynastySettings = new Map();
    this.teamHistories = new Map();
  }

  // ===============================
  // CONTRACT MANAGEMENT
  // ===============================

  /**
   * Sign a player to a contract
   */
  async signPlayerContract(
    playerId: string,
    teamId: string,
    contract: Omit<PlayerContract, 'playerId' | 'teamId' | 'signedDate'>
  ): Promise<PlayerContract> {
    try {
      const player = await fantasyDataService.getPlayerDetails(playerId);
      const leagueSettings = await this.getDynastySettings(teamId);

      // Validate contract terms
      if (contract.yearsRemaining > leagueSettings.contractYearLimits.max) {
        throw new Error(`Contract exceeds maximum years (${leagueSettings.contractYearLimits.max})`);
      }

      // Check salary cap
      const teamSalary = await this.getTeamSalary(teamId);
      if (teamSalary + contract.salary > leagueSettings.salaryCap) {
        throw new Error('Contract would exceed salary cap');
      }

      const newContract: PlayerContract = {
        playerId,
        teamId,
        ...contract,
        signedDate: new Date()
      };

      // Store contract
      const teamContracts = this.contracts.get(teamId) || [];
      teamContracts.push(newContract);
      this.contracts.set(teamId, teamContracts);

      logger.info('Player contract signed', { playerId, teamId, contract });
      return newContract;
    } catch (error) {
      logger.error('Failed to sign player contract', error);
      throw error;
    }
  }

  /**
   * Restructure an existing contract
   */
  async restructureContract(
    playerId: string,
    teamId: string,
    newTerms: Partial<PlayerContract>
  ): Promise<PlayerContract> {
    const teamContracts = this.contracts.get(teamId) || [];
    const contractIndex = teamContracts.findIndex(c => c.playerId === playerId);

    if (contractIndex === -1) {
      throw new Error('Contract not found');
    }

    const existingContract = teamContracts[contractIndex];
    if (!existingContract.canRestructure) {
      throw new Error('Contract cannot be restructured');
    }

    const updatedContract: PlayerContract = {
      ...existingContract,
      ...newTerms,
      canRestructure: false // Can only restructure once
    };

    teamContracts[contractIndex] = updatedContract;
    this.contracts.set(teamId, teamContracts);

    logger.info('Contract restructured', { playerId, teamId, newTerms });
    return updatedContract;
  }

  /**
   * Apply franchise tag to a player
   */
  async applyFranchiseTag(
    playerId: string,
    teamId: string,
    leagueId: string
  ): Promise<PlayerContract> {
    const settings = await this.getDynastySettings(leagueId);
    const teamContracts = this.contracts.get(teamId) || [];
    
    // Check franchise tag limit
    const currentTags = teamContracts.filter((c: any) => c.contractType === 'franchise').length;
    if (currentTags >= settings.franchiseTagsPerTeam) {
      throw new Error('Franchise tag limit reached');
    }

    // Calculate franchise tag salary (top 5 average at position)
    const salary = await this.calculateFranchiseTagSalary(playerId, leagueId);

    return this.signPlayerContract(playerId, teamId, {
      yearsRemaining: 1,
      salary,
      deadCapIfCut: 0,
      canFranchiseTag: false,
      canRestructure: false,
      expiryYear: new Date().getFullYear() + 1,
      contractType: 'franchise'
    });
  }

  /**
   * Cut a player and handle dead cap
   */
  async cutPlayer(playerId: string, teamId: string): Promise<void> {
    const teamContracts = this.contracts.get(teamId) || [];
    const contractIndex = teamContracts.findIndex(c => c.playerId === playerId);

    if (contractIndex === -1) {
      throw new Error('Player not under contract');
    }

    const contract = teamContracts[contractIndex];
    
    // Apply dead cap penalty
    if (contract.deadCapIfCut > 0) {
      await this.applyDeadCap(teamId, contract.deadCapIfCut, contract.yearsRemaining);
    }

    // Remove contract
    teamContracts.splice(contractIndex, 1);
    this.contracts.set(teamId, teamContracts);

    logger.info('Player cut', { playerId, teamId, deadCap: contract.deadCapIfCut });
  }

  // ===============================
  // KEEPER MANAGEMENT
  // ===============================

  /**
   * Select keepers for next season
   */
  async selectKeepers(
    teamId: string,
    playerIds: string[],
    leagueId: string
  ): Promise<void> {
    const settings = await this.getKeeperSettings(leagueId);
    
    if (playerIds.length > settings.maxKeepers) {
      throw new Error(`Cannot keep more than ${settings.maxKeepers} players`);
    }

    // Validate keeper eligibility
    for (const playerId of playerIds) {
      const eligible = await this.isKeeperEligible(playerId, teamId, settings);
      if (!eligible) {
        throw new Error(`Player ${playerId} is not keeper eligible`);
      }
    }

    // Store keeper selections
    this.keeperSelections.set(teamId, new Set(playerIds));
    
    logger.info('Keepers selected', { teamId, playerIds });
  }

  /**
   * Check if player is keeper eligible
   */
  private async isKeeperEligible(
    playerId: string,
    teamId: string,
    settings: KeeperSettings
  ): Promise<boolean> {
    // Check years on roster
    const rosterHistory = await this.getPlayerRosterHistory(playerId, teamId);
    if (rosterHistory.yearsOnTeam < settings.minYearsOnRoster) {
      return false;
    }

    // Check other eligibility criteria
    // This would include checking if player was drafted, traded for, etc.
    return true;
  }

  /**
   * Calculate keeper cost for next season
   */
  async calculateKeeperCost(
    playerId: string,
    teamId: string,
    leagueId: string
  ): Promise<number | string> {
    const settings = await this.getKeeperSettings(leagueId);
    
    switch (settings.keeperCostType) {
      case 'auction':
        // Increase auction value by percentage
        const currentValue = await this.getPlayerAuctionValue(playerId);
        return currentValue * (1 + settings.keeperCostIncrease / 100);
        
      case 'draft-round':
        // Move up draft rounds as penalty
        const draftedRound = await this.getPlayerDraftRound(playerId, teamId);
        return Math.max(1, draftedRound - settings.keeperCostIncrease);
        
      case 'fixed':
        // Fixed cost per keeper
        return settings.keeperCostIncrease;
        
      default:
        return 0;
    }
  }

  // ===============================
  // ROOKIE DRAFT MANAGEMENT
  // ===============================

  /**
   * Initialize rookie draft
   */
  async initializeRookieDraft(
    leagueId: string,
    year: number
  ): Promise<RookieDraft> {
    const settings = await this.getDynastySettings(leagueId);
    
    if (!settings.rookieDraft.enabled) {
      throw new Error('Rookie draft not enabled for this league');
    }

    // Determine draft order (worst to first for dynasty)
    const standings = await fantasyDataService.getStandings(leagueId);
    const draftOrder = standings
      .sort((a, b) => a.wins - b.wins)
      .map((team: any) => team.id);

    // Create draft picks
    const picks: RookieDraftPick[] = [];
    for (let round = 1; round <= settings.rookieDraft.rounds; round++) {
      for (let i = 0; i < draftOrder.length; i++) {
        const teamId = settings.rookieDraft.linearOrder 
          ? draftOrder[i] 
          : (round % 2 === 1 ? draftOrder[i] : draftOrder[draftOrder.length - 1 - i]);
        
        picks.push({
          pickNumber: (round - 1) * draftOrder.length + i + 1,
          round,
          originalTeam: teamId,
          currentOwner: teamId,
          traded: false
        });
      }
    }

    const draft: RookieDraft = {
      id: `${leagueId}_${year}_rookie`,
      leagueId,
      year,
      status: 'scheduled',
      draftOrder,
      picks,
      startTime: new Date() // Would be set to actual draft date
    };

    logger.info('Rookie draft initialized', { leagueId, year });
    return draft;
  }

  /**
   * Make rookie draft pick
   */
  async makeRookiePick(
    draftId: string,
    pickNumber: number,
    playerId: string
  ): Promise<RookieDraftPick> {
    // This would update the draft state and assign the rookie to the team
    logger.info('Rookie pick made', { draftId, pickNumber, playerId });
    
    // Return updated pick
    return {
      pickNumber,
      round: Math.ceil(pickNumber / 10), // Assuming 10 teams
      originalTeam: 'team1',
      currentOwner: 'team1',
      player: await fantasyDataService.getPlayerDetails(playerId),
      timestamp: new Date(),
      traded: false
    };
  }

  // ===============================
  // TAXI SQUAD MANAGEMENT
  // ===============================

  /**
   * Add player to taxi squad
   */
  async addToTaxiSquad(
    playerId: string,
    teamId: string,
    leagueId: string
  ): Promise<TaxiSquadMember> {
    const settings = await this.getDynastySettings(leagueId);
    const teamTaxi = this.taxiSquads.get(teamId) || [];
    
    if (teamTaxi.length >= settings.taxiSquadSize) {
      throw new Error('Taxi squad is full');
    }

    // Validate eligibility
    const eligible = await this.isTaxiEligible(playerId, settings);
    if (!eligible) {
      throw new Error('Player not eligible for taxi squad');
    }

    const taxiMember: TaxiSquadMember = {
      playerId,
      teamId,
      eligibleUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      yearOnTaxi: 1
    };

    teamTaxi.push(taxiMember);
    this.taxiSquads.set(teamId, teamTaxi);

    logger.info('Player added to taxi squad', { playerId, teamId });
    return taxiMember;
  }

  /**
   * Promote player from taxi squad to active roster
   */
  async promoteFromTaxiSquad(
    playerId: string,
    teamId: string
  ): Promise<void> {
    const teamTaxi = this.taxiSquads.get(teamId) || [];
    const memberIndex = teamTaxi.findIndex(m => m.playerId === playerId);
    
    if (memberIndex === -1) {
      throw new Error('Player not on taxi squad');
    }

    // Remove from taxi squad
    teamTaxi.splice(memberIndex, 1);
    this.taxiSquads.set(teamId, teamTaxi);

    // Add to active roster (would integrate with roster management)
    logger.info('Player promoted from taxi squad', { playerId, teamId });
  }

  // ===============================
  // DRAFT PICK TRADING
  // ===============================

  /**
   * Trade draft picks
   */
  async tradeDraftPicks(
    trade: {
      teamA: string;
      teamB: string;
      teamAPicks: { year: number; round: number }[];
      teamBPicks: { year: number; round: number }[];
      teamAPlayers?: string[];
      teamBPlayers?: string[];
    }
  ): Promise<DraftPickTrade> {
    // Validate picks exist and are tradeable
    // Update pick ownership
    // Record trade

    const tradeRecord: DraftPickTrade = {
      tradeId: `trade_${Date.now()}`,
      picks: [
        ...trade.teamAPicks.map((p: any) => ({ ...p, originalOwner: trade.teamA })),
        ...trade.teamBPicks.map((p: any) => ({ ...p, originalOwner: trade.teamB }))
      ],
      players: [], // Would fetch player details
      faabAmount: 0
    };

    logger.info('Draft picks traded', trade);
    return tradeRecord;
  }

  // ===============================
  // HISTORICAL TRACKING
  // ===============================

  /**
   * Get team dynasty history
   */
  async getTeamDynastyHistory(teamId: string): Promise<TeamDynastyHistory> {
    if (this.teamHistories.has(teamId)) {
      return this.teamHistories.get(teamId)!;
    }

    // Build history from stored data
    const history: TeamDynastyHistory = {
      teamId,
      seasons: [], // Would fetch from database
      allTimeRecord: { wins: 0, losses: 0, ties: 0 },
      championships: 0,
      playoffAppearances: 0,
      bestFinish: 1,
      worstFinish: 10
    };

    this.teamHistories.set(teamId, history);
    return history;
  }

  /**
   * Record season results
   */
  async recordSeasonResults(
    leagueId: string,
    year: number,
    results: any
  ): Promise<void> {
    // Store season results for historical tracking
    logger.info('Season results recorded', { leagueId, year });
  }

  // ===============================
  // HELPER METHODS
  // ===============================

  private async getDynastySettings(leagueId: string): Promise<DynastySettings> {
    if (this.dynastySettings.has(leagueId)) {
      return this.dynastySettings.get(leagueId)!;
    }

    // Default settings
    const settings: DynastySettings = {
      salaryCap: 200000000, // $200M
      contractYearLimits: {
        rookie: 4,
        veteran: 5,
        max: 7
      },
      taxiSquadSize: 4,
      taxiSquadEligibility: 'rookies-only',
      tradableDraftPicks: {
        enabled: true,
        maxYearsOut: 3
      },
      rookieDraft: {
        enabled: true,
        rounds: 5,
        timePerPick: 120,
        linearOrder: true
      },
      franchiseTagsPerTeam: 1,
      injuredReserveSlots: 3
    };

    this.dynastySettings.set(leagueId, settings);
    return settings;
  }

  private async getKeeperSettings(leagueId: string): Promise<KeeperSettings> {
    // Would fetch from database
    return {
      maxKeepers: 3,
      keeperCostIncrease: 2, // 2 round penalty
      keeperDeadline: new Date('2025-08-15'),
      allowTradingKeeperRights: true,
      keeperCostType: 'draft-round',
      minYearsOnRoster: 1
    };
  }

  private async getTeamSalary(teamId: string): Promise<number> {
    const contracts = this.contracts.get(teamId) || [];
    return contracts.reduce((total, c) => total + c.salary, 0);
  }

  private async calculateFranchiseTagSalary(
    playerId: string,
    leagueId: string
  ): Promise<number> {
    // Would calculate based on top 5 salaries at position
    return 25000000; // $25M placeholder
  }

  private async applyDeadCap(
    teamId: string,
    amount: number,
    years: number
  ): Promise<void> {
    // Would track dead cap over multiple years
    logger.info('Dead cap applied', { teamId, amount, years });
  }

  private async getPlayerRosterHistory(
    playerId: string,
    teamId: string
  ): Promise<{ yearsOnTeam: number }> {
    // Would query historical roster data
    return { yearsOnTeam: 2 };
  }

  private async getPlayerAuctionValue(playerId: string): Promise<number> {
    // Would fetch from auction values
    return 25;
  }

  private async getPlayerDraftRound(
    playerId: string,
    teamId: string
  ): Promise<number> {
    // Would fetch from draft history
    return 5;
  }

  private async isTaxiEligible(
    playerId: string,
    settings: DynastySettings
  ): Promise<boolean> {
    // Check player eligibility based on settings
    const player = await fantasyDataService.getPlayerDetails(playerId);
    
    if (settings.taxiSquadEligibility === 'rookies-only') {
      // Check if player is a rookie
      return true; // Placeholder
    }
    
    return true;
  }
}

// Export singleton instance
export const dynastyLeagueService = new DynastyLeagueService();