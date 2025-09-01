/**
 * Live Scoring Service
 * Real-time fantasy scoring with live NFL game integration
 * Updates scores, standings, and matchups in real-time
 */

import { enhancedWebSocketService } from &apos;./enhancedWebSocketService&apos;;
import { EventEmitter } from &apos;events&apos;;

// Types and Interfaces
export interface GameStatus {
}
  gameId: string;
  week: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  quarter: &apos;PRE&apos; | &apos;1&apos; | &apos;2&apos; | &apos;HALF&apos; | &apos;3&apos; | &apos;4&apos; | &apos;OT&apos; | &apos;FINAL&apos;;
  timeRemaining: string;
  possession?: string;
  redZone?: boolean;
  lastPlay?: string;
  weather?: {
}
    temperature: number;
    wind: number;
    precipitation: string;
  };
}

export interface PlayerGameStats {
}
  playerId: string;
  gameId: string;
  team: string;
  opponent: string;
  stats: {
}
    passing?: {
}
      attempts: number;
      completions: number;
      yards: number;
      touchdowns: number;
      interceptions: number;
      sacks: number;
    };
    rushing?: {
}
      attempts: number;
      yards: number;
      touchdowns: number;
      fumbles: number;
    };
    receiving?: {
}
      targets: number;
      receptions: number;
      yards: number;
      touchdowns: number;
      drops: number;
    };
    kicking?: {
}
      fieldGoalsMade: number;
      fieldGoalsAttempted: number;
      extraPointsMade: number;
      extraPointsAttempted: number;
    };
    defense?: {
}
      tackles: number;
      sacks: number;
      interceptions: number;
      forcedFumbles: number;
      touchdowns: number;
    };
  };
  fantasyPoints: {
}
    standard: number;
    ppr: number;
    halfPpr: number;
    custom?: number;
  };
  projectedPoints?: {
}
    standard: number;
    ppr: number;
    halfPpr: number;
  };
  percentComplete: number; // 0-100 based on game progress
}

export interface LiveMatchup {
}
  matchupId: string;
  week: number;
  team1: TeamScore;
  team2: TeamScore;
  projectedWinner?: string;
  winProbability?: {
}
    team1: number;
    team2: number;
  };
  highestScorer?: {
}
    playerId: string;
    playerName: string;
    points: number;
    team: string;
  };
  closeScore: boolean; // Within 10 points
  blowout: boolean; // > 30 point difference
}

export interface TeamScore {
}
  teamId: string;
  teamName: string;
  managerId: string;
  lineup: LineupSlot[];
  benchPlayers: LineupSlot[];
  totalPoints: number;
  projectedPoints: number;
  pointsFromStarters: number;
  pointsFromBench: number;
  playersYetToPlay: number;
  playersInProgress: number;
  playersComplete: number;
}

export interface LineupSlot {
}
  slotId: string;
  position: string;
  playerId?: string;
  playerName?: string;
  playerTeam?: string;
  opponent?: string;
  gameStatus?: &apos;NOT_STARTED&apos; | &apos;IN_PROGRESS&apos; | &apos;COMPLETE&apos;;
  points: number;
  projectedPoints: number;
  isStarter: boolean;
  isFlex: boolean;
  isEmpty: boolean;
  gameTime?: string;
}

export interface ScoringSettings {
}
  passingYards: number; // points per yard
  passingTouchdowns: number;
  passingInterceptions: number;
  rushingYards: number;
  rushingTouchdowns: number;
  receivingYards: number;
  receivingTouchdowns: number;
  receptions: number; // PPR
  fumbles: number;
  twoPointConversions: number;
  fieldGoalsMade: {
}
    &apos;0-39&apos;: number;
    &apos;40-49&apos;: number;
    &apos;50+&apos;: number;
  };
  extraPoints: number;
  defensiveTouchdowns: number;
  defensiveSacks: number;
  defensiveInterceptions: number;
  bonuses?: {
}
    passing300Yards?: number;
    passing400Yards?: number;
    rushing100Yards?: number;
    rushing200Yards?: number;
    receiving100Yards?: number;
    receiving200Yards?: number;
  };
}

export interface LeagueStandings {
}
  standings: StandingEntry[];
  lastUpdated: number;
  week: number;
}

export interface StandingEntry {
}
  rank: number;
  teamId: string;
  teamName: string;
  managerId: string;
  wins: number;
  losses: number;
  ties: number;
  pointsFor: number;
  pointsAgainst: number;
  streak: string; // W3, L2, etc.
  lastWeekRank?: number;
  rankChange?: number;
  playoffPosition?: number;
  clinched?: &apos;PLAYOFFS&apos; | &apos;BYE&apos; | &apos;DIVISION&apos; | &apos;ELIMINATED&apos;;
}

export interface LiveUpdate {
}
  type: &apos;touchdown&apos; | &apos;fieldGoal&apos; | &apos;bigPlay&apos; | &apos;turnover&apos; | &apos;injury&apos; | &apos;statCorrection&apos;;
  playerId?: string;
  playerName?: string;
  team?: string;
  description: string;
  fantasyImpact?: {
}
    points: number;
    affectedTeams: string[];
  };
  timestamp: number;
  gameId?: string;
  highlight?: boolean;
}

export interface PlayByPlay {
}
  gameId: string;
  plays: Play[];
}

export interface Play {
}
  id: string;
  quarter: string;
  time: string;
  down?: number;
  distance?: number;
  fieldPosition?: number;
  description: string;
  type: &apos;pass&apos; | &apos;run&apos; | &apos;kick&apos; | &apos;punt&apos; | &apos;penalty&apos; | &apos;timeout&apos; | &apos;other&apos;;
  involvedPlayers: Array<{
}
    playerId: string;
    role: &apos;passer&apos; | &apos;receiver&apos; | &apos;rusher&apos; | &apos;kicker&apos; | &apos;defender&apos; | &apos;other&apos;;
    stats?: any;
  }>;
  result: &apos;gain&apos; | &apos;loss&apos; | &apos;touchdown&apos; | &apos;fieldGoal&apos; | &apos;turnover&apos; | &apos;incomplete&apos;;
  yards?: number;
  points?: number;
}

// Main Live Scoring Service
export class LiveScoringService extends EventEmitter {
}
  private ws: typeof enhancedWebSocketService;
  private currentWeek: number = 1;
  private leagueId?: string;
  private scoringSettings?: ScoringSettings;
  private activeGames: Map<string, GameStatus> = new Map();
  private playerStats: Map<string, PlayerGameStats> = new Map();
  private matchups: Map<string, LiveMatchup> = new Map();
  private standings?: LeagueStandings;
  private updateInterval?: NodeJS.Timeout;
  private isMonitoring = false;
  private lastUpdateTime = 0;
  private updateQueue: LiveUpdate[] = [];
  private statCache: Map<string, any> = new Map();

  constructor() {
}
    super();
    this.ws = enhancedWebSocketService;
    this.setupEventHandlers();
  }

  // Initialize Live Scoring
  async initialize(leagueId: string, week: number): Promise<void> {
}
    this.leagueId = leagueId;
    this.currentWeek = week;

    // Load scoring settings
    await this.loadScoringSettings();

    // Connect to WebSocket if needed
    if (!this.ws.isConnected()) {
}
      await this.ws.connect();
    }

    // Subscribe to live scoring channels
    this.ws.subscribeToLiveScoring(leagueId, week);

    // Load initial data
    await this.loadInitialData();

    // Start monitoring
    this.startMonitoring();

    this.emit(&apos;initialized&apos;, {
}
      leagueId,
      week,
      games: Array.from(this.activeGames.values()),
      matchups: Array.from(this.matchups.values())
    });
  }

  // Start Live Monitoring
  startMonitoring(): void {
}
    if (this.isMonitoring) return;

    this.isMonitoring = true;

    // Set up regular polling for updates
    this.updateInterval = setInterval(() => {
}
      this.fetchLiveUpdates();
    }, 10000); // Every 10 seconds

    // Fetch immediate update
    this.fetchLiveUpdates();

    console.log(&apos;📊 Live scoring monitoring started&apos;);
  }

  // Stop Monitoring
  stopMonitoring(): void {
}
    if (this.updateInterval) {
}
      clearInterval(this.updateInterval);
      this.updateInterval = undefined;
    }

    this.isMonitoring = false;
    console.log(&apos;🛑 Live scoring monitoring stopped&apos;);
  }

  // Fetch Live Updates
  private async fetchLiveUpdates(): Promise<void> {
}
    try {
}
      // Fetch game updates
      const games = await this.fetchGameUpdates();
      
      // Fetch player stats
      const stats = await this.fetchPlayerStats();
      
      // Process updates
      this.processGameUpdates(games);
      this.processStatUpdates(stats);
      
      // Calculate fantasy points
      this.calculateFantasyPoints();
      
      // Update matchups
      this.updateMatchups();
      
      // Update standings
      await this.updateStandings();
      
      // Process update queue
      this.processUpdateQueue();
      
      this.lastUpdateTime = Date.now();
      
      this.emit(&apos;update:complete&apos;, {
}
        timestamp: this.lastUpdateTime,
        gamesUpdated: games.length,
        playersUpdated: stats.length
      });

    } catch (error) {
}
      console.error(&apos;Failed to fetch live updates:&apos;, error);
      this.emit(&apos;update:error&apos;, error);
    }
  }

  // Fetch Game Updates
  private async fetchGameUpdates(): Promise<GameStatus[]> {
}
    const response = await fetch(`/api/games/live?week=${this.currentWeek}`);
    return response.json();
  }

  // Fetch Player Stats
  private async fetchPlayerStats(): Promise<PlayerGameStats[]> {
}
    const response = await fetch(`/api/stats/live?week=${this.currentWeek}&leagueId=${this.leagueId}`);
    return response.json();
  }

  // Process Game Updates
  private processGameUpdates(games: GameStatus[]): void {
}
    for (const game of games) {
}
      const existing = this.activeGames.get(game.gameId);
      
      // Check for significant changes
      if (this.hasGameChanged(existing, game)) {
}
        this.activeGames.set(game.gameId, game);
        
        // Emit game update
        this.emit(&apos;game:update&apos;, game);
        
        // Check for special events
        this.checkGameEvents(existing, game);
      }
    }
  }

  // Process Stat Updates
  private processStatUpdates(stats: PlayerGameStats[]): void {
}
    for (const stat of stats) {
}
      const key = `${stat.playerId}-${stat.gameId}`;
      const existing = this.playerStats.get(key);
      
      if (this.hasStatChanged(existing, stat)) {
}
        const pointsDiff = existing ? 
          stat.fantasyPoints.ppr - existing.fantasyPoints.ppr : 0;
        
        this.playerStats.set(key, stat);
        
        // Emit stat update
        this.emit(&apos;stat:update&apos;, {
}
          ...stat,
          pointsChange: pointsDiff
        });
        
        // Check for significant plays
        if (Math.abs(pointsDiff) > 5) {
}
          this.addLiveUpdate({
}
            type: pointsDiff > 0 ? &apos;bigPlay&apos; : &apos;statCorrection&apos;,
            playerId: stat.playerId,
            playerName: stat.playerId, // Would need player name lookup
            team: stat.team,
            description: `${pointsDiff > 0 ? &apos;+&apos; : &apos;&apos;}${pointsDiff.toFixed(1)} points`,
            fantasyImpact: {
}
              points: pointsDiff,
              affectedTeams: this.getAffectedTeams(stat.playerId)
            },
            timestamp: Date.now(),
            gameId: stat.gameId,
            highlight: Math.abs(pointsDiff) > 10
          });
        }
      }
    }
  }

  // Calculate Fantasy Points
  private calculateFantasyPoints(): void {
}
    if (!this.scoringSettings) return;

    this.playerStats.forEach((stats, key) => {
}
      const points = this.calculatePlayerPoints(stats);
      stats.fantasyPoints = points;
    });
  }

  private calculatePlayerPoints(stats: PlayerGameStats): typeof stats.fantasyPoints {
}
    const s = this.scoringSettings!;
    let standard = 0;
    let ppr = 0;
    let halfPpr = 0;

    // Passing stats
    if (stats.stats.passing) {
}
      const passingStats = stats.stats.passing;
      const passingPoints = 
        (passingStats.yards * s.passingYards) +
        (passingStats.touchdowns * s.passingTouchdowns) +
        (passingStats.interceptions * s.passingInterceptions);
      
      standard += passingPoints;
      ppr += passingPoints;
      halfPpr += passingPoints;
      
      // Bonuses
      if (s.bonuses) {
}
        if (passingStats.yards >= 400 && s.bonuses.passing400Yards) {
}
          standard += s.bonuses.passing400Yards;
          ppr += s.bonuses.passing400Yards;
          halfPpr += s.bonuses.passing400Yards;
        } else if (passingStats.yards >= 300 && s.bonuses.passing300Yards) {
}
          standard += s.bonuses.passing300Yards;
          ppr += s.bonuses.passing300Yards;
          halfPpr += s.bonuses.passing300Yards;
        }
      }
    }

    // Rushing stats
    if (stats.stats.rushing) {
}
      const rushingStats = stats.stats.rushing;
      const rushingPoints = 
        (rushingStats.yards * s.rushingYards) +
        (rushingStats.touchdowns * s.rushingTouchdowns) +
        (rushingStats.fumbles * s.fumbles);
      
      standard += rushingPoints;
      ppr += rushingPoints;
      halfPpr += rushingPoints;
      
      // Bonuses
      if (s.bonuses) {
}
        if (rushingStats.yards >= 200 && s.bonuses.rushing200Yards) {
}
          standard += s.bonuses.rushing200Yards;
          ppr += s.bonuses.rushing200Yards;
          halfPpr += s.bonuses.rushing200Yards;
        } else if (rushingStats.yards >= 100 && s.bonuses.rushing100Yards) {
}
          standard += s.bonuses.rushing100Yards;
          ppr += s.bonuses.rushing100Yards;
          halfPpr += s.bonuses.rushing100Yards;
        }
      }
    }

    // Receiving stats
    if (stats.stats.receiving) {
}
      const rec = stats.stats.receiving;
      const receivingYardPoints = 
        (rec.yards * s.receivingYards) +
        (rec.touchdowns * s.receivingTouchdowns);
      
      standard += receivingYardPoints;
      ppr += receivingYardPoints + (rec.receptions * s.receptions);
      halfPpr += receivingYardPoints + (rec.receptions * s.receptions * 0.5);
      
      // Bonuses
      if (s.bonuses) {
}
        if (rec.yards >= 200 && s.bonuses.receiving200Yards) {
}
          standard += s.bonuses.receiving200Yards;
          ppr += s.bonuses.receiving200Yards;
          halfPpr += s.bonuses.receiving200Yards;
        } else if (rec.yards >= 100 && s.bonuses.receiving100Yards) {
}
          standard += s.bonuses.receiving100Yards;
          ppr += s.bonuses.receiving100Yards;
          halfPpr += s.bonuses.receiving100Yards;
        }
      }
    }

    // Kicking stats
    if (stats.stats.kicking) {
}
      const k = stats.stats.kicking;
      let kickingPoints = k.extraPointsMade * s.extraPoints;
      
      // Field goals (simplified - would need distance data)
      kickingPoints += k.fieldGoalsMade * s.fieldGoalsMade[&apos;0-39&apos;];
      
      standard += kickingPoints;
      ppr += kickingPoints;
      halfPpr += kickingPoints;
    }

    return {
}
      standard: Math.round(standard * 10) / 10,
      ppr: Math.round(ppr * 10) / 10,
      halfPpr: Math.round(halfPpr * 10) / 10
    };
  }

  // Update Matchups
  private updateMatchups(): void {
}
    this.matchups.forEach((matchup, id) => {
}
      // Update team scores
      this.updateTeamScore(matchup.team1);
      this.updateTeamScore(matchup.team2);
      
      // Calculate win probability
      matchup.winProbability = this.calculateWinProbability(matchup);
      
      // Determine projected winner
      matchup.projectedWinner = 
        matchup.team1.totalPoints + matchup.team1.projectedPoints > 
        matchup.team2.totalPoints + matchup.team2.projectedPoints ?
        matchup.team1.teamId : matchup.team2.teamId;
      
      // Check for close score or blowout
      const diff = Math.abs(matchup.team1.totalPoints - matchup.team2.totalPoints);
      matchup.closeScore = diff <= 10;
      matchup.blowout = diff > 30;
      
      // Find highest scorer
      const allPlayers = [
        ...matchup.team1.lineup,
        ...matchup.team2.lineup
      ].filter((p: any) => !p.isEmpty);
      
      const highest = allPlayers.reduce((max, player) => 
        player.points > (max?.points || 0) ? player : max, 
        allPlayers[0]
      );
      
      if (highest) {
}
        matchup.highestScorer = {
}
          playerId: highest.playerId!,
          playerName: highest.playerName!,
          points: highest.points,
          team: matchup.team1.lineup.includes(highest) ? 
            matchup.team1.teamName : matchup.team2.teamName
        };
      }
      
      this.emit(&apos;matchup:update&apos;, matchup);
    });
  }

  private updateTeamScore(team: TeamScore): void {
}
    team.totalPoints = 0;
    team.projectedPoints = 0;
    team.pointsFromStarters = 0;
    team.pointsFromBench = 0;
    team.playersYetToPlay = 0;
    team.playersInProgress = 0;
    team.playersComplete = 0;

    // Update lineup scores
    [...team.lineup, ...team.benchPlayers].forEach((slot: any) => {
}
      if (!slot.isEmpty && slot.playerId) {
}
        const stats = this.getPlayerStats(slot.playerId);
        
        if (stats) {
}
          slot.points = stats.fantasyPoints.ppr; // Use league scoring
          slot.projectedPoints = stats.projectedPoints?.ppr || 0;
          
          if (slot.isStarter) {
}
            team.pointsFromStarters += slot.points;
            team.totalPoints += slot.points;
            team.projectedPoints += slot.projectedPoints;
          } else {
}
            team.pointsFromBench += slot.points;
          }
          
          // Update game status counts
          if (slot.gameStatus === &apos;NOT_STARTED&apos;) {
}
            team.playersYetToPlay++;
          } else if (slot.gameStatus === &apos;IN_PROGRESS&apos;) {
}
            team.playersInProgress++;
          } else if (slot.gameStatus === &apos;COMPLETE&apos;) {
}
            team.playersComplete++;
          }
        }
      }
    });
  }

  private calculateWinProbability(matchup: LiveMatchup): typeof matchup.winProbability {
}
    const team1Current = matchup.team1.totalPoints;
    const team1Projected = matchup.team1.projectedPoints;
    const team2Current = matchup.team2.totalPoints;
    const team2Projected = matchup.team2.projectedPoints;
    
    // Simple probability based on current + projected
    const team1Total = team1Current + team1Projected;
    const team2Total = team2Current + team2Projected;
    
    if (team1Total + team2Total === 0) {
}
      return { team1: 50, team2: 50 };
    }
    
    const team1Prob = (team1Total / (team1Total + team2Total)) * 100;
    
    return {
}
      team1: Math.round(team1Prob),
      team2: Math.round(100 - team1Prob)
    };
  }

  // Update Standings
  private async updateStandings(): Promise<void> {
}
    try {
}
      const response = await fetch(`/api/leagues/${this.leagueId}/standings`);
      const standings: LeagueStandings = await response.json();
      
      // Check for changes
      if (this.standings) {
}
        standings.standings.forEach((entry: any) => {
}
          const prev = this.standings!.standings.find((s: any) => s.teamId === entry.teamId);
          if (prev) {
}
            entry.lastWeekRank = prev.rank;
            entry.rankChange = prev.rank - entry.rank;
          }
        });
      }
      
      this.standings = standings;
      this.emit(&apos;standings:update&apos;, standings);
      
    } catch (error) {
}
      console.error(&apos;Failed to update standings:&apos;, error);
    }
  }

  // Check for Game Events
  private checkGameEvents(oldGame: GameStatus | undefined, newGame: GameStatus): void {
}
    if (!oldGame) return;

    // Quarter changes
    if (oldGame.quarter !== newGame.quarter) {
}
      this.emit(&apos;game:quarter&apos;, {
}
        gameId: newGame.gameId,
        quarter: newGame.quarter,
        game: newGame
      });
    }

    // Score changes
    if (oldGame.homeScore !== newGame.homeScore || oldGame.awayScore !== newGame.awayScore) {
}
      const scoringTeam = oldGame.homeScore !== newGame.homeScore ? 
        newGame.homeTeam : newGame.awayTeam;
      
      const points = Math.abs(
        (newGame.homeScore - oldGame.homeScore) || 
        (newGame.awayScore - oldGame.awayScore)
      );
      
      this.emit(&apos;game:score&apos;, {
}
        gameId: newGame.gameId,
        team: scoringTeam,
        points,
        game: newGame
      });
    }

    // Game completion
    if (oldGame.quarter !== &apos;FINAL&apos; && newGame.quarter === &apos;FINAL&apos;) {
}
      this.emit(&apos;game:final&apos;, {
}
        gameId: newGame.gameId,
        game: newGame
      });
      
      // Trigger final stat updates
      this.fetchFinalStats(newGame.gameId);
    }

    // Red zone
    if (!oldGame.redZone && newGame.redZone) {
}
      this.emit(&apos;game:redzone&apos;, {
}
        gameId: newGame.gameId,
        team: newGame.possession,
        game: newGame
      });
    }
  }

  // Add Live Update to Queue
  private addLiveUpdate(update: LiveUpdate): void {
}
    this.updateQueue.push(update);
    
    // Keep queue size manageable
    if (this.updateQueue.length > 100) {
}
      this.updateQueue.shift();
    }
    
    // Emit immediately for high-priority updates
    if (update.highlight || update.type === &apos;touchdown&apos; || update.type === &apos;injury&apos;) {
}
      this.emit(&apos;live:update&apos;, update);
    }
  }

  // Process Update Queue
  private processUpdateQueue(): void {
}
    while (this.updateQueue.length > 0) {
}
      const update = this.updateQueue.shift()!;
      this.emit(&apos;live:update:processed&apos;, update);
    }
  }

  // Subscribe to Player
  subscribeToPlayer(playerId: string): void {
}
    this.ws.subscribeToPlayer(playerId);
    
    // Set up player-specific handlers
    this.ws.on(`player:${playerId}:stats`, (data: any) => {
}
      this.handlePlayerStatUpdate(playerId, data);
    });
    
    this.ws.on(`player:${playerId}:injury`, (data: any) => {
}
      this.handlePlayerInjury(playerId, data);
    });
  }

  // Unsubscribe from Player
  unsubscribeFromPlayer(playerId: string): void {
}
    this.ws.unsubscribeFromPlayer(playerId);
    this.ws.off(`player:${playerId}:stats`);
    this.ws.off(`player:${playerId}:injury`);
  }

  // WebSocket Event Handlers
  private setupEventHandlers(): void {
}
    this.ws.on(&apos;scoring:update&apos;, (update: any) => {
}
      this.handleScoringUpdate(update);
    });

    this.ws.on(&apos;scoring:final&apos;, (data: any) => {
}
      this.handleScoringFinal(data);
    });

    this.ws.on(&apos;player:stats&apos;, (data: any) => {
}
      this.handlePlayerStatUpdate(data.playerId, data);
    });

    this.ws.on(&apos;player:injury&apos;, (data: any) => {
}
      this.handlePlayerInjury(data.playerId, data);
    });
  }

  private handleScoringUpdate(update: any): void {
}
    // Process real-time scoring update
    this.emit(&apos;realtime:scoring&apos;, update);
  }

  private handleScoringFinal(data: any): void {
}
    // Process final scoring
    this.emit(&apos;realtime:final&apos;, data);
  }

  private handlePlayerStatUpdate(playerId: string, data: any): void {
}
    // Update player stats in cache
    const key = `${playerId}-${data.gameId}`;
    const existing = this.playerStats.get(key);
    
    if (existing) {
}
      Object.assign(existing, data);
      this.playerStats.set(key, existing);
    }
    
    this.emit(&apos;player:stat:update&apos;, { playerId, ...data });
  }

  private handlePlayerInjury(playerId: string, data: any): void {
}
    this.addLiveUpdate({
}
      type: &apos;injury&apos;,
      playerId,
      playerName: data.playerName,
      team: data.team,
      description: `${data.playerName} ${data.status}: ${data.description}`,
      timestamp: Date.now(),
      highlight: true
    });
    
    this.emit(&apos;player:injury:update&apos;, { playerId, ...data });
  }

  // Helper Methods
  private async loadScoringSettings(): Promise<void> {
}
    const response = await fetch(`/api/leagues/${this.leagueId}/scoring`);
    this.scoringSettings = await response.json();
  }

  private async loadInitialData(): Promise<void> {
}
    // Load games
    const games = await this.fetchGameUpdates();
    games.forEach((game: any) => this.activeGames.set(game.gameId, game));
    
    // Load matchups
    const matchupsResponse = await fetch(
      `/api/leagues/${this.leagueId}/matchups?week=${this.currentWeek}`
    );
    const matchups = await matchupsResponse.json();
    matchups.forEach((m: LiveMatchup) => this.matchups.set(m.matchupId, m));
    
    // Load initial stats
    const stats = await this.fetchPlayerStats();
    stats.forEach((stat: any) => {
}
      const key = `${stat.playerId}-${stat.gameId}`;
      this.playerStats.set(key, stat);
    });
    
    // Load standings
    await this.updateStandings();
  }

  private async fetchFinalStats(gameId: string): Promise<void> {
}
    try {
}
      const response = await fetch(`/api/games/${gameId}/final-stats`);
      const stats = await response.json();
      
      // Update player stats with final values
      stats.forEach((stat: PlayerGameStats) => {
}
        const key = `${stat.playerId}-${gameId}`;
        this.playerStats.set(key, stat);
      });
      
      this.emit(&apos;game:stats:final&apos;, { gameId, stats });
      
    } catch (error) {
}
      console.error(&apos;Failed to fetch final stats:&apos;, error);
    }
  }

  private hasGameChanged(oldGame: GameStatus | undefined, newGame: GameStatus): boolean {
}
    if (!oldGame) return true;
    
    return (
      oldGame.homeScore !== newGame.homeScore ||
      oldGame.awayScore !== newGame.awayScore ||
      oldGame.quarter !== newGame.quarter ||
      oldGame.possession !== newGame.possession ||
      oldGame.redZone !== newGame.redZone
    );
  }

  private hasStatChanged(oldStat: PlayerGameStats | undefined, newStat: PlayerGameStats): boolean {
}
    if (!oldStat) return true;
    
    return (
      oldStat.fantasyPoints.ppr !== newStat.fantasyPoints.ppr ||
      JSON.stringify(oldStat.stats) !== JSON.stringify(newStat.stats)
    );
  }

  private getPlayerStats(playerId: string): PlayerGameStats | undefined {
}
    // Find stats for current week
    for (const [key, stats] of this.playerStats) {
}
      if (stats.playerId === playerId) {
}
        return stats;
      }
    }
    return undefined;
  }

  private getAffectedTeams(playerId: string): string[] {
}
    const teams: string[] = [];
    
    this.matchups.forEach((matchup: any) => {
}
      const inTeam1 = matchup.team1.lineup.some((s: any) => s.playerId === playerId);
      const inTeam2 = matchup.team2.lineup.some((s: any) => s.playerId === playerId);
      
      if (inTeam1) teams.push(matchup.team1.teamId);
      if (inTeam2) teams.push(matchup.team2.teamId);
    });
    
    return teams;
  }

  // Public API
  getGameStatus(gameId: string): GameStatus | undefined {
}
    return this.activeGames.get(gameId);
  }

  getAllGames(): GameStatus[] {
}
    return Array.from(this.activeGames.values());
  }

  getPlayerGameStats(playerId: string, gameId: string): PlayerGameStats | undefined {
}
    return this.playerStats.get(`${playerId}-${gameId}`);
  }

  getMatchup(matchupId: string): LiveMatchup | undefined {
}
    return this.matchups.get(matchupId);
  }

  getAllMatchups(): LiveMatchup[] {
}
    return Array.from(this.matchups.values());
  }

  getStandings(): LeagueStandings | undefined {
}
    return this.standings;
  }

  getLiveUpdates(): LiveUpdate[] {
}
    return [...this.updateQueue];
  }

  getScoringSettings(): ScoringSettings | undefined {
}
    return this.scoringSettings;
  }

  isActive(): boolean {
}
    return this.isMonitoring;
  }

  getLastUpdateTime(): number {
}
    return this.lastUpdateTime;
  }

  // Cleanup
  destroy(): void {
}
    this.stopMonitoring();
    this.activeGames.clear();
    this.playerStats.clear();
    this.matchups.clear();
    this.statCache.clear();
    this.updateQueue = [];
    this.removeAllListeners();
  }
}

// Singleton instance
export const liveScoringService = new LiveScoringService();
export default liveScoringService;