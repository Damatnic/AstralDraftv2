/**
 * Schedule Generator Service
 * Generates weekly matchups for the fantasy football season
 */

import type { Team, Matchup } from '../types';

interface ScheduleConfig {
  teams: Team[];
  regularSeasonWeeks: number;
  playoffWeeks: number;
  playoffTeams: number;
}

/**
 * Generate a complete season schedule using round-robin algorithm
 * Ensures each team plays every other team at least once
 */
export function generateRegularSeasonSchedule(config: ScheduleConfig): Matchup[] {
  const { teams, regularSeasonWeeks } = config;
  const matchups: Matchup[] = [];
  const teamCount = teams.length;
  
  if (teamCount % 2 !== 0) {
    throw new Error('League must have an even number of teams');
  }

  // Round-robin schedule generation
  const scheduleMatrix = generateRoundRobinSchedule(teamCount);
  
  // Create matchups for each week
  for (let week = 1; week <= regularSeasonWeeks; week++) {
    const weekIndex = (week - 1) % scheduleMatrix.length;
    const weekMatchups = scheduleMatrix[weekIndex];
    
    weekMatchups.forEach((pairing, index) => {
      const [teamAIndex, teamBIndex] = pairing;
      const teamA = teams[teamAIndex];
      const teamB = teams[teamBIndex];
      
      const matchup: Matchup = {
        id: `week${week}_match${index + 1}`,
        week,
        teamA: {
          teamId: teamA.id,
          score: 0,
          lineup: {
            QB: [],
            RB: [],
            WR: [],
            TE: [],
            FLEX: [],
            K: [],
            DST: [],
            BENCH: []
          },
          benchPoints: 0
        },
        teamB: {
          teamId: teamB.id,
          score: 0,
          lineup: {
            QB: [],
            RB: [],
            WR: [],
            TE: [],
            FLEX: [],
            K: [],
            DST: [],
            BENCH: []
          },
          benchPoints: 0
        },
        isComplete: false,
        isPlayoffs: false
      };
      
      matchups.push(matchup);
    });
  }
  
  return matchups;
}

/**
 * Generate playoff bracket matchups
 */
export function generatePlayoffSchedule(
  config: ScheduleConfig,
  regularSeasonStandings: Team[]
): Matchup[] {
  const { playoffWeeks, playoffTeams } = config;
  const matchups: Matchup[] = [];
  const playoffStartWeek = config.regularSeasonWeeks + 1;
  
  // Get playoff teams (top teams from standings)
  const qualifiedTeams = regularSeasonStandings.slice(0, playoffTeams);
  
  // Week 15: Quarterfinals (if 6 teams, top 2 get bye)
  if (playoffWeeks >= 1) {
    const week15Matchups: Matchup[] = [];
    
    if (playoffTeams === 6) {
      // 3 vs 6
      week15Matchups.push(createPlayoffMatchup(
        playoffStartWeek,
        qualifiedTeams[2],
        qualifiedTeams[5],
        'qf1'
      ));
      
      // 4 vs 5
      week15Matchups.push(createPlayoffMatchup(
        playoffStartWeek,
        qualifiedTeams[3],
        qualifiedTeams[4],
        'qf2'
      ));
    } else if (playoffTeams === 4) {
      // 1 vs 4
      week15Matchups.push(createPlayoffMatchup(
        playoffStartWeek,
        qualifiedTeams[0],
        qualifiedTeams[3],
        'sf1'
      ));
      
      // 2 vs 3
      week15Matchups.push(createPlayoffMatchup(
        playoffStartWeek,
        qualifiedTeams[1],
        qualifiedTeams[2],
        'sf2'
      ));
    }
    
    matchups.push(...week15Matchups);
  }
  
  // Week 16: Semifinals
  if (playoffWeeks >= 2) {
    // This would be populated based on Week 15 results
    // For now, creating placeholder matchups
    const week16Matchups: Matchup[] = [];
    
    if (playoffTeams === 6) {
      // 1 vs lowest remaining seed
      week16Matchups.push(createPlayoffMatchup(
        playoffStartWeek + 1,
        qualifiedTeams[0],
        qualifiedTeams[3], // Placeholder
        'sf1'
      ));
      
      // 2 vs highest remaining seed
      week16Matchups.push(createPlayoffMatchup(
        playoffStartWeek + 1,
        qualifiedTeams[1],
        qualifiedTeams[2], // Placeholder
        'sf2'
      ));
    }
    
    matchups.push(...week16Matchups);
  }
  
  // Week 17: Championship & Consolation
  if (playoffWeeks >= 3) {
    // Championship game
    matchups.push(createPlayoffMatchup(
      playoffStartWeek + 2,
      qualifiedTeams[0], // Placeholder - would be semifinal winners
      qualifiedTeams[1], // Placeholder
      'championship'
    ));
    
    // 3rd place game
    matchups.push(createPlayoffMatchup(
      playoffStartWeek + 2,
      qualifiedTeams[2], // Placeholder - would be semifinal losers
      qualifiedTeams[3], // Placeholder
      'consolation'
    ));
  }
  
  return matchups;
}

/**
 * Create a playoff matchup
 */
function createPlayoffMatchup(
  week: number,
  teamA: Team,
  teamB: Team,
  matchupId: string
): Matchup {
  return {
    id: `week${week}_${matchupId}`,
    week,
    teamA: {
      teamId: teamA.id,
      score: 0,
      lineup: {
        QB: [],
        RB: [],
        WR: [],
        TE: [],
        FLEX: [],
        K: [],
        DST: [],
        BENCH: []
      },
      benchPoints: 0
    },
    teamB: {
      teamId: teamB.id,
      score: 0,
      lineup: {
        QB: [],
        RB: [],
        WR: [],
        TE: [],
        FLEX: [],
        K: [],
        DST: [],
        BENCH: []
      },
      benchPoints: 0
    },
    isComplete: false,
    isPlayoffs: true
  };
}

/**
 * Generate round-robin schedule matrix
 */
function generateRoundRobinSchedule(teamCount: number): number[][][] {
  const rounds: number[][][] = [];
  const teams = Array.from({ length: teamCount }, (_, i) => i);
  
  for (let round = 0; round < teamCount - 1; round++) {
    const pairs: number[][] = [];
    
    for (let i = 0; i < teamCount / 2; i++) {
      const team1 = teams[i];
      const team2 = teams[teamCount - 1 - i];
      pairs.push([team1, team2]);
    }
    
    rounds.push(pairs);
    
    // Rotate teams for next round (keep first team fixed)
    teams.splice(1, 0, teams.pop()!);
  }
  
  // Repeat the schedule if we need more weeks than teams - 1
  const fullSchedule: number[][][] = [];
  const baseRounds = teamCount - 1;
  
  for (let week = 0; week < 14; week++) {
    fullSchedule.push(rounds[week % baseRounds]);
  }
  
  return fullSchedule;
}

/**
 * Get matchups for a specific week
 */
export function getWeekMatchups(
  allMatchups: Matchup[],
  week: number
): Matchup[] {
  return allMatchups.filter((m: any) => m.week === week);
}

/**
 * Get upcoming matchups for a team
 */
export function getTeamUpcomingMatchups(
  allMatchups: Matchup[],
  teamId: number,
  currentWeek: number,
  weeksAhead: number = 3
): Matchup[] {
  return allMatchups
    .filter((m: any) => 
      (m.teamA.teamId === teamId || m.teamB.teamId === teamId) &&
      m.week > currentWeek &&
      m.week <= currentWeek + weeksAhead
    )
    .sort((a, b) => a.week - b.week);
}

/**
 * Calculate strength of schedule for remaining games
 */
export function calculateStrengthOfSchedule(
  allMatchups: Matchup[],
  teamId: number,
  currentWeek: number,
  teamRecords: Map<number, { wins: number; losses: number }>
): number {
  const remainingMatchups = allMatchups.filter((m: any) =>
    (m.teamA.teamId === teamId || m.teamB.teamId === teamId) &&
    m.week > currentWeek &&
    !m.isPlayoffs
  );
  
  let totalOpponentWinPct = 0;
  let opponentCount = 0;
  
  remainingMatchups.forEach((matchup: any) => {
    const opponentId = matchup.teamA.teamId === teamId 
      ? matchup.teamB.teamId 
      : matchup.teamA.teamId;
    
    const opponentRecord = teamRecords.get(opponentId);
    if (opponentRecord) {
      const totalGames = opponentRecord.wins + opponentRecord.losses;
      if (totalGames > 0) {
        totalOpponentWinPct += opponentRecord.wins / totalGames;
        opponentCount++;
      }
    }
  });
  
  return opponentCount > 0 ? totalOpponentWinPct / opponentCount : 0.5;
}

/**
 * Validate schedule for conflicts and fairness
 */
export function validateSchedule(matchups: Matchup[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Group matchups by week
  const weekMap = new Map<number, Matchup[]>();
  matchups.forEach((m: any) => {
    if (!weekMap.has(m.week)) {
      weekMap.set(m.week, []);
    }
    weekMap.get(m.week)!.push(m);
  });
  
  // Check each week
  weekMap.forEach((weekMatchups, week) => {
    const teamsThisWeek = new Set<number>();
    
    weekMatchups.forEach((matchup: any) => {
      // Check for duplicate teams in same week
      if (teamsThisWeek.has(matchup.teamA.teamId)) {
        errors.push(`Team ${matchup.teamA.teamId} scheduled twice in week ${week}`);
      }
      if (teamsThisWeek.has(matchup.teamB.teamId)) {
        errors.push(`Team ${matchup.teamB.teamId} scheduled twice in week ${week}`);
      }
      
      teamsThisWeek.add(matchup.teamA.teamId);
      teamsThisWeek.add(matchup.teamB.teamId);
    });
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
