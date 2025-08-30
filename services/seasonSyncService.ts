/**
 * Season Sync Service
 * Handles real-time synchronization with NFL game data and scoring updates
 */

import type { League, Matchup, Player } from '../types';
import { getCurrentNFLWeek, SEASON_DATES_2025 } from '../data/leagueData';

interface GameUpdate {
  gameId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  quarter: string;
  timeRemaining: string;
  isComplete: boolean;
}

interface PlayerStatUpdate {
  playerId: number;
  stats: {
    passingYards?: number;
    passingTouchdowns?: number;
    rushingYards?: number;
    rushingTouchdowns?: number;
    receptions?: number;
    receivingYards?: number;
    receivingTouchdowns?: number;
    fantasyPoints?: number;
  };
}

/**
 * Sync league with current NFL week
 */
export function syncLeagueWithNFLWeek(league: League): League {
  const currentNFLWeek = getCurrentNFLWeek();
  
  if (league.currentWeek !== currentNFLWeek && currentNFLWeek > 0) {
    console.log(`Syncing league to NFL Week ${currentNFLWeek}`);
    return {
      ...league,
      currentWeek: currentNFLWeek
    };
  }
  
  return league;
}

/**
 * Update matchup scores based on player performances
 */
export function updateMatchupScores(
  matchup: Matchup,
  playerStats: Map<number, PlayerStatUpdate>,
  teams: any[]
): Matchup {
  const teamA = teams.find(t => t.id === matchup.teamA.teamId);
  const teamB = teams.find(t => t.id === matchup.teamB.teamId);
  
  if (!teamA || !teamB) return matchup;
  
  // Calculate Team A score
  let teamAScore = 0;
  Object.values(matchup.teamA.lineup).flat().forEach((playerId: any) => {
    const stats = playerStats.get(playerId);
    if (stats?.stats.fantasyPoints) {
      teamAScore += stats.stats.fantasyPoints;
    }
  });
  
  // Calculate Team B score
  let teamBScore = 0;
  Object.values(matchup.teamB.lineup).flat().forEach((playerId: any) => {
    const stats = playerStats.get(playerId);
    if (stats?.stats.fantasyPoints) {
      teamBScore += stats.stats.fantasyPoints;
    }
  });
  
  return {
    ...matchup,
    teamA: {
      ...matchup.teamA,
      score: Math.round(teamAScore * 10) / 10
    },
    teamB: {
      ...matchup.teamB,
      score: Math.round(teamBScore * 10) / 10
    }
  };
}

/**
 * Get live game updates (mock data for now)
 */
export function getLiveGameUpdates(week: number): GameUpdate[] {
  // In production, this would fetch from a real NFL data API
  const games: GameUpdate[] = [
    {
      gameId: 'game1',
      homeTeam: 'Kansas City Chiefs',
      awayTeam: 'Detroit Lions',
      homeScore: 21,
      awayScore: 17,
      quarter: '3rd',
      timeRemaining: '8:45',
      isComplete: false
    },
    {
      gameId: 'game2',
      homeTeam: 'Buffalo Bills',
      awayTeam: 'Miami Dolphins',
      homeScore: 28,
      awayScore: 24,
      quarter: '4th',
      timeRemaining: '2:15',
      isComplete: false
    },
    {
      gameId: 'game3',
      homeTeam: 'San Francisco 49ers',
      awayTeam: 'Dallas Cowboys',
      homeScore: 31,
      awayScore: 14,
      quarter: 'Final',
      timeRemaining: '0:00',
      isComplete: true
    }
  ];
  
  return games;
}

/**
 * Get player stat updates (mock data for now)
 */
export function getPlayerStatUpdates(week: number): PlayerStatUpdate[] {
  // In production, this would fetch from a real NFL stats API
  // For now, generate some mock updates for top players
  const updates: PlayerStatUpdate[] = [
    {
      playerId: 1, // Patrick Mahomes
      stats: {
        passingYards: 287,
        passingTouchdowns: 3,
        fantasyPoints: 24.5
      }
    },
    {
      playerId: 5, // Tyreek Hill
      stats: {
        receptions: 8,
        receivingYards: 112,
        receivingTouchdowns: 1,
        fantasyPoints: 22.2
      }
    },
    {
      playerId: 10, // Christian McCaffrey
      stats: {
        rushingYards: 95,
        rushingTouchdowns: 1,
        receptions: 5,
        receivingYards: 42,
        fantasyPoints: 21.7
      }
    }
  ];
  
  return updates;
}

/**
 * Calculate time until next game slate
 */
export function getTimeUntilNextGameSlate(): {
  days: number;
  hours: number;
  minutes: number;
  slateType: 'Thursday' | 'Sunday Early' | 'Sunday Late' | 'Sunday Night' | 'Monday';
} {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const hour = now.getHours();
  
  let targetDate = new Date(now);
  let slateType: 'Thursday' | 'Sunday Early' | 'Sunday Late' | 'Sunday Night' | 'Monday';
  
  // Determine next game slate
  if (dayOfWeek === 0 && hour < 13) {
    // Sunday before 1 PM - next is Sunday early games
    targetDate.setHours(13, 0, 0, 0);
    slateType = 'Sunday Early';
  } else if (dayOfWeek === 0 && hour < 16) {
    // Sunday before 4 PM - next is Sunday late games
    targetDate.setHours(16, 25, 0, 0);
    slateType = 'Sunday Late';
  } else if (dayOfWeek === 0 && hour < 20) {
    // Sunday before 8 PM - next is Sunday night game
    targetDate.setHours(20, 20, 0, 0);
    slateType = 'Sunday Night';
  } else if (dayOfWeek === 1 && hour < 20) {
    // Monday before 8 PM - next is Monday night game
    targetDate.setHours(20, 15, 0, 0);
    slateType = 'Monday';
  } else if (dayOfWeek < 4 || (dayOfWeek === 4 && hour < 20)) {
    // Before Thursday 8 PM - next is Thursday night game
    const daysUntilThursday = (4 - dayOfWeek + 7) % 7 || 7;
    targetDate.setDate(now.getDate() + daysUntilThursday);
    targetDate.setHours(20, 20, 0, 0);
    slateType = 'Thursday';
  } else {
    // After Thursday or late in week - next is Sunday early games
    const daysUntilSunday = (7 - dayOfWeek) % 7 || 7;
    targetDate.setDate(now.getDate() + daysUntilSunday);
    targetDate.setHours(13, 0, 0, 0);
    slateType = 'Sunday Early';
  }
  
  const diff = targetDate.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { days, hours, minutes, slateType };
}

/**
 * Check if games are currently live
 */
export function areGamesLive(): boolean {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const hour = now.getHours();
  
  // Thursday night (8 PM - 11:30 PM ET)
  if (dayOfWeek === 4 && hour >= 20 && hour <= 23) return true;
  
  // Sunday games (1 PM - 11:30 PM ET)
  if (dayOfWeek === 0 && hour >= 13 && hour <= 23) return true;
  
  // Monday night (8 PM - 11:30 PM ET)
  if (dayOfWeek === 1 && hour >= 20 && hour <= 23) return true;
  
  return false;
}

/**
 * Get scoring period status
 */
export function getScoringPeriodStatus(week: number): {
  isActive: boolean;
  isComplete: boolean;
  percentComplete: number;
} {
  const gamesLive = areGamesLive();
  const now = new Date();
  const dayOfWeek = now.getDay();
  
  // Scoring period is complete after Monday night
  const isComplete = dayOfWeek === 2 || dayOfWeek === 3;
  
  // Calculate approximate completion percentage
  let percentComplete = 0;
  if (dayOfWeek === 0) {
    // Sunday - most games played
    percentComplete = now.getHours() >= 16 ? 75 : 50;
  } else if (dayOfWeek === 1) {
    // Monday
    percentComplete = now.getHours() >= 23 ? 100 : 90;
  } else if (isComplete) {
    percentComplete = 100;
  } else if (dayOfWeek === 4 && now.getHours() >= 23) {
    // After Thursday night game
    percentComplete = 10;
  }
  
  return {
    isActive: gamesLive,
    isComplete,
    percentComplete
  };
}

/**
 * Initialize season sync intervals
 */
export function initializeSeasonSync(
  onUpdate: (updates: any) => void,
  intervalMs: number = 60000 // Update every minute
): () => void {
  const interval = setInterval(() => {
    if (areGamesLive()) {
      const currentWeek = getCurrentNFLWeek();
      const gameUpdates = getLiveGameUpdates(currentWeek);
      const playerUpdates = getPlayerStatUpdates(currentWeek);
      
      onUpdate({
        week: currentWeek,
        games: gameUpdates,
        players: playerUpdates,
        timestamp: new Date().toISOString()
      });
    }
  }, intervalMs);
  
  // Return cleanup function
  return () => clearInterval(interval);
}