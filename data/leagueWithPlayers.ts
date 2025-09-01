/**
 * League data with NFL players integrated
 */

import { MAIN_LEAGUE, TEAMS_2025 } from &apos;./leagueData&apos;;
import { NFL_PLAYERS_2024 } from &apos;./nflPlayers&apos;;
import { League } from &apos;../types&apos;;
import { generateRegularSeasonSchedule, generatePlayoffSchedule } from &apos;../services/scheduleGeneratorService&apos;;

// Generate the full season schedule
const regularSeasonMatchups = generateRegularSeasonSchedule({
}
  teams: TEAMS_2025,
  regularSeasonWeeks: 14,
  playoffWeeks: 3,
  playoffTeams: 6
});

const playoffMatchups = generatePlayoffSchedule(
  {
}
    teams: TEAMS_2025,
    regularSeasonWeeks: 14,
    playoffWeeks: 3,
    playoffTeams: 6
  },
  TEAMS_2025 // Will use actual standings when playoffs start
);

// Combine all matchups
const fullSchedule = [...regularSeasonMatchups, ...playoffMatchups];

// Generate mock draft results for teams
const mockDraftLog = generateMockDraftLog();

function generateMockDraftLog(): any[] {
}
  const draftLog: any[] = [];
  const playersPerTeam = 16;
  const topPlayers = NFL_PLAYERS_2024
    .filter((p: any) => p.adp && p.adp <= 160)
    .sort((a, b) => (a.adp || 999) - (b.adp || 999));

  let pickNumber = 1;
  let playerIndex = 0;

  // Snake draft simulation
  for (let round = 1; round <= playersPerTeam; round++) {
}
    const isEvenRound = round % 2 === 0;
    const teamOrder = isEvenRound ? [...TEAMS_2025].reverse() : TEAMS_2025;

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
          timestamp: new Date(Date.now() - (160 - pickNumber) * 60000).toISOString()
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

// Create league with NFL players and schedule
export const LEAGUE_WITH_PLAYERS: League = {
}
  ...MAIN_LEAGUE,
  allPlayers: NFL_PLAYERS_2024,
  schedule: fullSchedule,
  draftLog: mockDraftLog,
  status: &apos;IN_SEASON&apos;, // Override to IN_SEASON
  currentWeek: 1 // Start at week 1
};

export default LEAGUE_WITH_PLAYERS;