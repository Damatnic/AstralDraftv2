/**
 * League Initialization Service
 * Handles league setup, draft completion, and season start
 */

import type { League, Matchup } from &apos;../types&apos;;
import { generateRegularSeasonSchedule, generatePlayoffSchedule } from &apos;./scheduleGeneratorService&apos;;
import { TEAMS_2025, SEASON_DATES_2025 } from &apos;../data/leagueData&apos;;

/**
 * Initialize league for active season
 * Transitions from draft to active season with generated schedule
 */
export function initializeLeagueForSeason(league: League): League {
}
  // Generate the regular season schedule
  const regularSeasonMatchups = generateRegularSeasonSchedule({
}
    teams: league.teams,
    regularSeasonWeeks: league.settings.regularSeasonWeeks,
    playoffWeeks: league.settings.playoffWeeks,
    playoffTeams: league.settings.playoffTeams
  });

  // Initialize playoff structure (will be populated based on standings)
  const playoffMatchups = generatePlayoffSchedule(
    {
}
      teams: league.teams,
      regularSeasonWeeks: league.settings.regularSeasonWeeks,
      playoffWeeks: league.settings.playoffWeeks,
      playoffTeams: league.settings.playoffTeams
    },
    league.teams // Will use actual standings when playoffs start
  );

  // Combine all matchups
  const fullSchedule = [...regularSeasonMatchups, ...playoffMatchups];

  // Update league with new status and schedule
  return {
}
    ...league,
    status: &apos;IN_SEASON&apos;,
    currentWeek: 1,
    schedule: fullSchedule,
    draftLog: generateMockDraftLog(league), // Add mock draft results
  };
}

/**
 * Generate mock draft log for teams (simulating completed draft)
 */
function generateMockDraftLog(league: League): any[] {
}
  const draftLog: any[] = [];
  const playersPerTeam = 16; // 16 rounds
  const topPlayers = league.allPlayers
    .filter((p: any) => p.adp && p.adp <= 160)
    .sort((a, b) => (a.adp || 999) - (b.adp || 999));

  let pickNumber = 1;
  let playerIndex = 0;

  // Snake draft simulation
  for (let round = 1; round <= playersPerTeam; round++) {
}
    const isEvenRound = round % 2 === 0;
    const teamOrder = isEvenRound ? [...league.teams].reverse() : league.teams;

    teamOrder.forEach((team: any) => {
}
      if (playerIndex < topPlayers.length) {
}
        const player = topPlayers[playerIndex];
        draftLog.push({
}
          pickNumber,
          round,
          teamId: team.id,
          playerId: player.id,
          playerName: player.name,
          position: player.position,
          timestamp: new Date(Date.now() - (160 - pickNumber) * 60000).toISOString() // Simulate draft times
        });
        
        // Add player to team roster
        team.roster.push(player);
        
        pickNumber++;
        playerIndex++;
      }
    });
  }

  return draftLog;
}

/**
 * Get current week matchups
 */
export function getCurrentWeekMatchups(league: League): Matchup[] {
}
  return league.schedule.filter((m: any) => m.week === league.currentWeek);
}

/**
 * Get team&apos;s next matchup
 */
export function getTeamNextMatchup(league: League, teamId: number): Matchup | null {
}
  const currentWeekMatchups = getCurrentWeekMatchups(league);
  return currentWeekMatchups.find((m: any) => 
    m.teamA.teamId === teamId || m.teamB.teamId === teamId
  ) || null;
}

/**
 * Calculate current standings
 */
export function calculateStandings(league: League): any[] {
}
  const standings = league.teams.map((team: any) => {
}
    const teamMatchups = league.schedule.filter((m: any) => 
      (m.teamA.teamId === team.id || m.teamB.teamId === team.id) && 
      m.isComplete
    );

    let wins = 0;
    let losses = 0;
    let ties = 0;
    let pointsFor = 0;
    let pointsAgainst = 0;

    teamMatchups.forEach((matchup: any) => {
}
      const isTeamA = matchup.teamA.teamId === team.id;
      const teamScore = isTeamA ? matchup.teamA.score : matchup.teamB.score;
      const opponentScore = isTeamA ? matchup.teamB.score : matchup.teamA.score;

      pointsFor += teamScore;
      pointsAgainst += opponentScore;

      if (teamScore > opponentScore) {
}
        wins++;
      } else if (teamScore < opponentScore) {
}
        losses++;
      } else {
}
        ties++;
      }
    });

    return {
}
      team,
      wins,
      losses,
      ties,
      pointsFor: Math.round(pointsFor * 10) / 10,
      pointsAgainst: Math.round(pointsAgainst * 10) / 10,
      winPercentage: wins + losses + ties > 0 
        ? wins / (wins + losses + ties) 
        : 0
    };
  });

  // Sort by wins, then by points for
  return standings.sort((a, b) => {
}
    if (b.wins !== a.wins) return b.wins - a.wins;
    return b.pointsFor - a.pointsFor;
  });
}

/**
 * Check if it&apos;s time to advance to next week
 */
export function shouldAdvanceWeek(): boolean {
}
  const now = new Date();
  const dayOfWeek = now.getDay();
  const hour = now.getHours();
  
  // Advance on Tuesday at 4 AM (after Monday Night Football)
  return dayOfWeek === 2 && hour >= 4;
}

/**
 * Get playoff picture
 */
export function getPlayoffPicture(league: League): {
}
  clinched: number[];
  inTheHunt: number[];
  eliminated: number[];
} {
}
  const standings = calculateStandings(league);
  const playoffSpots = league.settings.playoffTeams;
  const weeksRemaining = league.settings.regularSeasonWeeks - league.currentWeek;
  
  const clinched: number[] = [];
  const inTheHunt: number[] = [];
  const eliminated: number[] = [];

  standings.forEach((standing, index) => {
}
    // Simple playoff calculation - can be made more sophisticated
    if (index < playoffSpots && standing.wins >= 8) {
}
      clinched.push(standing.team.id);
    } else if (index < playoffSpots + 2 && weeksRemaining > 0) {
}
      inTheHunt.push(standing.team.id);
    } else if (standing.losses > 10 || (index >= playoffSpots + 3 && weeksRemaining <= 2)) {
}
      eliminated.push(standing.team.id);
    }
  });

  return { clinched, inTheHunt, eliminated };
}

/**
 * Initialize week 1 with current NFL data
 */
export function initializeWeek1(): void {
}
  console.log(&apos;Initializing Week 1 of the 2025 Fantasy Season&apos;);
  console.log(&apos;NFL Season Start:&apos;, SEASON_DATES_2025.seasonStart.toLocaleDateString());
  console.log(&apos;Current Week: 1&apos;);
  console.log(&apos;Games this week: Thursday Night Football, Sunday games, Monday Night Football&apos;);
}