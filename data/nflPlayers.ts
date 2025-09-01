/**
 * NFL Players Database for 2024-2025 Season
 * Comprehensive player data with stats, projections, and fantasy relevance
 */

import { Player } from &apos;../types&apos;;

// NFL Teams mapping
export const NFL_TEAMS = {
}
  &apos;ARI&apos;: { name: &apos;Arizona Cardinals&apos;, conference: &apos;NFC&apos;, division: &apos;West&apos;, color: &apos;#97233F&apos; },
  &apos;ATL&apos;: { name: &apos;Atlanta Falcons&apos;, conference: &apos;NFC&apos;, division: &apos;South&apos;, color: &apos;#A71930&apos; },
  &apos;BAL&apos;: { name: &apos;Baltimore Ravens&apos;, conference: &apos;AFC&apos;, division: &apos;North&apos;, color: &apos;#241773&apos; },
  &apos;BUF&apos;: { name: &apos;Buffalo Bills&apos;, conference: &apos;AFC&apos;, division: &apos;East&apos;, color: &apos;#00338D&apos; },
  &apos;CAR&apos;: { name: &apos;Carolina Panthers&apos;, conference: &apos;NFC&apos;, division: &apos;South&apos;, color: &apos;#0085CA&apos; },
  &apos;CHI&apos;: { name: &apos;Chicago Bears&apos;, conference: &apos;NFC&apos;, division: &apos;North&apos;, color: &apos;#0B162A&apos; },
  &apos;CIN&apos;: { name: &apos;Cincinnati Bengals&apos;, conference: &apos;AFC&apos;, division: &apos;North&apos;, color: &apos;#FB4F14&apos; },
  &apos;CLE&apos;: { name: &apos;Cleveland Browns&apos;, conference: &apos;AFC&apos;, division: &apos;North&apos;, color: &apos;#311D00&apos; },
  &apos;DAL&apos;: { name: &apos;Dallas Cowboys&apos;, conference: &apos;NFC&apos;, division: &apos;East&apos;, color: &apos;#003594&apos; },
  &apos;DEN&apos;: { name: &apos;Denver Broncos&apos;, conference: &apos;AFC&apos;, division: &apos;West&apos;, color: &apos;#FB4F14&apos; },
  &apos;DET&apos;: { name: &apos;Detroit Lions&apos;, conference: &apos;NFC&apos;, division: &apos;North&apos;, color: &apos;#0076B6&apos; },
  &apos;GB&apos;: { name: &apos;Green Bay Packers&apos;, conference: &apos;NFC&apos;, division: &apos;North&apos;, color: &apos;#203731&apos; },
  &apos;HOU&apos;: { name: &apos;Houston Texans&apos;, conference: &apos;AFC&apos;, division: &apos;South&apos;, color: &apos;#03202F&apos; },
  &apos;IND&apos;: { name: &apos;Indianapolis Colts&apos;, conference: &apos;AFC&apos;, division: &apos;South&apos;, color: &apos;#002C5F&apos; },
  &apos;JAX&apos;: { name: &apos;Jacksonville Jaguars&apos;, conference: &apos;AFC&apos;, division: &apos;South&apos;, color: &apos;#006778&apos; },
  &apos;KC&apos;: { name: &apos;Kansas City Chiefs&apos;, conference: &apos;AFC&apos;, division: &apos;West&apos;, color: &apos;#E31837&apos; },
  &apos;LV&apos;: { name: &apos;Las Vegas Raiders&apos;, conference: &apos;AFC&apos;, division: &apos;West&apos;, color: &apos;#000000&apos; },
  &apos;LAC&apos;: { name: &apos;Los Angeles Chargers&apos;, conference: &apos;AFC&apos;, division: &apos;West&apos;, color: &apos;#0080C6&apos; },
  &apos;LAR&apos;: { name: &apos;Los Angeles Rams&apos;, conference: &apos;NFC&apos;, division: &apos;West&apos;, color: &apos;#003594&apos; },
  &apos;MIA&apos;: { name: &apos;Miami Dolphins&apos;, conference: &apos;AFC&apos;, division: &apos;East&apos;, color: &apos;#008E97&apos; },
  &apos;MIN&apos;: { name: &apos;Minnesota Vikings&apos;, conference: &apos;NFC&apos;, division: &apos;North&apos;, color: &apos;#4F2683&apos; },
  &apos;NE&apos;: { name: &apos;New England Patriots&apos;, conference: &apos;AFC&apos;, division: &apos;East&apos;, color: &apos;#002244&apos; },
  &apos;NO&apos;: { name: &apos;New Orleans Saints&apos;, conference: &apos;NFC&apos;, division: &apos;South&apos;, color: &apos;#D3BC8D&apos; },
  &apos;NYG&apos;: { name: &apos;New York Giants&apos;, conference: &apos;NFC&apos;, division: &apos;East&apos;, color: &apos;#0B2265&apos; },
  &apos;NYJ&apos;: { name: &apos;New York Jets&apos;, conference: &apos;AFC&apos;, division: &apos;East&apos;, color: &apos;#125740&apos; },
  &apos;PHI&apos;: { name: &apos;Philadelphia Eagles&apos;, conference: &apos;NFC&apos;, division: &apos;East&apos;, color: &apos;#004C54&apos; },
  &apos;PIT&apos;: { name: &apos;Pittsburgh Steelers&apos;, conference: &apos;AFC&apos;, division: &apos;North&apos;, color: &apos;#FFB612&apos; },
  &apos;SF&apos;: { name: &apos;San Francisco 49ers&apos;, conference: &apos;NFC&apos;, division: &apos;West&apos;, color: &apos;#AA0000&apos; },
  &apos;SEA&apos;: { name: &apos;Seattle Seahawks&apos;, conference: &apos;NFC&apos;, division: &apos;West&apos;, color: &apos;#002244&apos; },
  &apos;TB&apos;: { name: &apos;Tampa Bay Buccaneers&apos;, conference: &apos;NFC&apos;, division: &apos;South&apos;, color: &apos;#D50A0A&apos; },
  &apos;TEN&apos;: { name: &apos;Tennessee Titans&apos;, conference: &apos;AFC&apos;, division: &apos;South&apos;, color: &apos;#0C2340&apos; },
  &apos;WAS&apos;: { name: &apos;Washington Commanders&apos;, conference: &apos;NFC&apos;, division: &apos;East&apos;, color: &apos;#5A1414&apos; }
};

// Top Fantasy Players for 2024-2025 Season
export const NFL_PLAYERS_2024: Player[] = [
  // QUARTERBACKS
  {
}
    id: 1001,
    name: &apos;Josh Allen&apos;,
    position: &apos;QB&apos;,
    team: &apos;BUF&apos;,
    jerseyNumber: 17,
    age: 28,
    height: &apos;6\&apos;5"&apos;,
    weight: 237,
    college: &apos;Wyoming&apos;,
    experience: 7,
    fantasyRank: 1,
    adp: 1.2,
    projectedPoints: 385.5,
    lastSeasonPoints: 378.2,
    injuryStatus: &apos;healthy&apos;,
    isRookie: false,
    byeWeek: 12,
    stats: {
}
      passingYards: 4306,
      passingTouchdowns: 29,
      interceptions: 18,
      rushingYards: 524,
      rushingTouchdowns: 15,
      completionPercentage: 62.3
    }
  },
  {
}
    id: 1002,
    name: &apos;Lamar Jackson&apos;,
    position: &apos;QB&apos;,
    team: &apos;BAL&apos;,
    jerseyNumber: 8,
    age: 27,
    height: &apos;6\&apos;2"&apos;,
    weight: 212,
    college: &apos;Louisville&apos;,
    experience: 7,
    fantasyRank: 2,
    adp: 2.1,
    projectedPoints: 375.8,
    lastSeasonPoints: 365.4,
    injuryStatus: &apos;healthy&apos;,
    isRookie: false,
    byeWeek: 14,
    stats: {
}
      passingYards: 3678,
      passingTouchdowns: 24,
      interceptions: 7,
      rushingYards: 821,
      rushingTouchdowns: 5,
      completionPercentage: 65.7
    }
  },
  {
}
    id: 1003,
    name: &apos;Jalen Hurts&apos;,
    position: &apos;QB&apos;,
    team: &apos;PHI&apos;,
    jerseyNumber: 1,
    age: 25,
    height: &apos;6\&apos;1"&apos;,
    weight: 223,
    college: &apos;Oklahoma&apos;,
    experience: 4,
    fantasyRank: 3,
    adp: 3.5,
    projectedPoints: 365.2,
    lastSeasonPoints: 342.1,
    injuryStatus: &apos;healthy&apos;,
    isRookie: false,
    byeWeek: 5,
    stats: {
}
      passingYards: 3858,
      passingTouchdowns: 23,
      interceptions: 15,
      rushingYards: 605,
      rushingTouchdowns: 13,
      completionPercentage: 65.4
    }
  },
  {
}
    id: 1004,
    name: &apos;Patrick Mahomes&apos;,
    position: &apos;QB&apos;,
    team: &apos;KC&apos;,
    jerseyNumber: 15,
    age: 29,
    height: &apos;6\&apos;3"&apos;,
    weight: 230,
    college: &apos;Texas Tech&apos;,
    experience: 8,
    fantasyRank: 4,
    adp: 4.2,
    projectedPoints: 358.7,
    lastSeasonPoints: 334.8,
    injuryStatus: &apos;healthy&apos;,
    isRookie: false,
    byeWeek: 10,
    stats: {
}
      passingYards: 4183,
      passingTouchdowns: 27,
      interceptions: 14,
      rushingYards: 389,
      rushingTouchdowns: 4,
      completionPercentage: 67.2
    }
  },
  {
}
    id: 1005,
    name: &apos;Dak Prescott&apos;,
    position: &apos;QB&apos;,
    team: &apos;DAL&apos;,
    jerseyNumber: 4,
    age: 31,
    height: &apos;6\&apos;2"&apos;,
    weight: 238,
    college: &apos;Mississippi State&apos;,
    experience: 9,
    fantasyRank: 5,
    adp: 8.3,
    projectedPoints: 325.4,
    lastSeasonPoints: 318.9,
    injuryStatus: &apos;healthy&apos;,
    isRookie: false,
    byeWeek: 7,
    stats: {
}
      passingYards: 4516,
      passingTouchdowns: 36,
      interceptions: 9,
      rushingYards: 105,
      rushingTouchdowns: 2,
      completionPercentage: 69.5
    }
  },

  // RUNNING BACKS
  {
}
    id: 2001,
    name: &apos;Christian McCaffrey&apos;,
    position: &apos;RB&apos;,
    team: &apos;SF&apos;,
    jerseyNumber: 23,
    age: 28,
    height: &apos;5\&apos;11"&apos;,
    weight: 205,
    college: &apos;Stanford&apos;,
    experience: 8,
    fantasyRank: 1,
    adp: 1.8,
    projectedPoints: 285.6,
    lastSeasonPoints: 278.3,
    injuryStatus: &apos;healthy&apos;,
    isRookie: false,
    byeWeek: 9,
    stats: {
}
      rushingYards: 1459,
      rushingTouchdowns: 14,
      receptions: 67,
      receivingYards: 564,
      receivingTouchdowns: 7,
      totalTouchdowns: 21
    }
  },
  {
}
    id: 2002,
    name: &apos;Austin Ekeler&apos;,
    position: &apos;RB&apos;,
    team: &apos;WAS&apos;,
    jerseyNumber: 30,
    age: 29,
    height: &apos;5\&apos;10"&apos;,
    weight: 200,
    college: &apos;Western Colorado&apos;,
    experience: 8,
    fantasyRank: 2,
    adp: 12.4,
    projectedPoints: 245.8,
    lastSeasonPoints: 198.7,
    injuryStatus: &apos;healthy&apos;,
    isRookie: false,
    byeWeek: 14,
    stats: {
}
      rushingYards: 628,
      rushingTouchdowns: 5,
      receptions: 51,
      receivingYards: 436,
      receivingTouchdowns: 5,
      totalTouchdowns: 10
    }
  },
  {
}
    id: 2003,
    name: &apos;Derrick Henry&apos;,
    position: &apos;RB&apos;,
    team: &apos;BAL&apos;,
    jerseyNumber: 22,
    age: 30,
    height: &apos;6\&apos;3"&apos;,
    weight: 247,
    college: &apos;Alabama&apos;,
    experience: 9,
    fantasyRank: 3,
    adp: 15.7,
    projectedPoints: 235.4,
    lastSeasonPoints: 224.1,
    injuryStatus: &apos;healthy&apos;,
    isRookie: false,
    byeWeek: 14,
    stats: {
}
      rushingYards: 1167,
      rushingTouchdowns: 12,
      receptions: 20,
      receivingYards: 214,
      receivingTouchdowns: 1,
      totalTouchdowns: 13
    }
  },
  {
}
    id: 2004,
    name: &apos;Saquon Barkley&apos;,
    position: &apos;RB&apos;,
    team: &apos;PHI&apos;,
    jerseyNumber: 26,
    age: 27,
    height: &apos;6\&apos;0"&apos;,
    weight: 233,
    college: &apos;Penn State&apos;,
    experience: 7,
    fantasyRank: 4,
    adp: 8.9,
    projectedPoints: 258.3,
    lastSeasonPoints: 181.2,
    injuryStatus: &apos;healthy&apos;,
    isRookie: false,
    byeWeek: 5,
    stats: {
}
      rushingYards: 962,
      rushingTouchdowns: 10,
      receptions: 41,
      receivingYards: 280,
      receivingTouchdowns: 4,
      totalTouchdowns: 14
    }
  },
  {
}
    id: 2005,
    name: &apos;Jonathan Taylor&apos;,
    position: &apos;RB&apos;,
    team: &apos;IND&apos;,
    jerseyNumber: 28,
    age: 25,
    height: &apos;5\&apos;10"&apos;,
    weight: 226,
    college: &apos;Wisconsin&apos;,
    experience: 5,
    fantasyRank: 5,
    adp: 18.2,
    projectedPoints: 225.7,
    lastSeasonPoints: 156.8,
    injuryStatus: &apos;healthy&apos;,
    isRookie: false,
    byeWeek: 14,
    stats: {
}
      rushingYards: 741,
      rushingTouchdowns: 7,
      receptions: 38,
      receivingYards: 223,
      receivingTouchdowns: 1,
      totalTouchdowns: 8
    }
  },

  // WIDE RECEIVERS
  {
}
    id: 3001,
    name: &apos;Tyreek Hill&apos;,
    position: &apos;WR&apos;,
    team: &apos;MIA&apos;,
    jerseyNumber: 10,
    age: 30,
    height: &apos;5\&apos;10"&apos;,
    weight: 185,
    college: &apos;West Alabama&apos;,
    experience: 9,
    fantasyRank: 1,
    adp: 5.3,
    projectedPoints: 275.8,
    lastSeasonPoints: 268.4,
    injuryStatus: &apos;healthy&apos;,
    isRookie: false,
    byeWeek: 6,
    stats: {
}
      receptions: 119,
      receivingYards: 1799,
      receivingTouchdowns: 13,
      rushingYards: 31,
      rushingTouchdowns: 1,
      totalTouchdowns: 14
    }
  },
  {
}
    id: 3002,
    name: &apos;CeeDee Lamb&apos;,
    position: &apos;WR&apos;,
    team: &apos;DAL&apos;,
    jerseyNumber: 88,
    age: 25,
    height: &apos;6\&apos;2"&apos;,
    weight: 198,
    college: &apos;Oklahoma&apos;,
    experience: 5,
    fantasyRank: 2,
    adp: 6.1,
    projectedPoints: 268.9,
    lastSeasonPoints: 256.7,
    injuryStatus: &apos;healthy&apos;,
    isRookie: false,
    byeWeek: 7,
    stats: {
}
      receptions: 135,
      receivingYards: 1749,
      receivingTouchdowns: 12,
      rushingYards: 15,
      rushingTouchdowns: 0,
      totalTouchdowns: 12
    }
  },
  {
}
    id: 3003,
    name: &apos;Ja\&apos;Marr Chase&apos;,
    position: &apos;WR&apos;,
    team: &apos;CIN&apos;,
    jerseyNumber: 1,
    age: 24,
    height: &apos;6\&apos;0"&apos;,
    weight: 201,
    college: &apos;LSU&apos;,
    experience: 4,
    fantasyRank: 3,
    adp: 7.2,
    projectedPoints: 265.4,
    lastSeasonPoints: 241.8,
    injuryStatus: &apos;healthy&apos;,
    isRookie: false,
    byeWeek: 12,
    stats: {
}
      receptions: 100,
      receivingYards: 1216,
      receivingTouchdowns: 7,
      rushingYards: 12,
      rushingTouchdowns: 0,
      totalTouchdowns: 7
    }
  },
  {
}
    id: 3004,
    name: &apos;Amon-Ra St. Brown&apos;,
    position: &apos;WR&apos;,
    team: &apos;DET&apos;,
    jerseyNumber: 14,
    age: 25,
    height: &apos;6\&apos;0"&apos;,
    weight: 197,
    college: &apos;USC&apos;,
    experience: 4,
    fantasyRank: 4,
    adp: 9.8,
    projectedPoints: 258.7,
    lastSeasonPoints: 245.3,
    injuryStatus: &apos;healthy&apos;,
    isRookie: false,
    byeWeek: 5,
    stats: {
}
      receptions: 119,
      receivingYards: 1515,
      receivingTouchdowns: 10,
      rushingYards: 37,
      rushingTouchdowns: 1,
      totalTouchdowns: 11
    }
  },
  {
}
    id: 3005,
    name: &apos;A.J. Brown&apos;,
    position: &apos;WR&apos;,
    team: &apos;PHI&apos;,
    jerseyNumber: 11,
    age: 27,
    height: &apos;6\&apos;0"&apos;,
    weight: 226,
    college: &apos;Ole Miss&apos;,
    experience: 6,
    fantasyRank: 5,
    adp: 11.4,
    projectedPoints: 252.1,
    lastSeasonPoints: 238.9,
    injuryStatus: &apos;healthy&apos;,
    isRookie: false,
    byeWeek: 5,
    stats: {
}
      receptions: 106,
      receivingYards: 1456,
      receivingTouchdowns: 7,
      rushingYards: 21,
      rushingTouchdowns: 0,
      totalTouchdowns: 7
    }
  },

  // TIGHT ENDS
  {
}
    id: 4001,
    name: &apos;Travis Kelce&apos;,
    position: &apos;TE&apos;,
    team: &apos;KC&apos;,
    jerseyNumber: 87,
    age: 35,
    height: &apos;6\&apos;5"&apos;,
    weight: 250,
    college: &apos;Cincinnati&apos;,
    experience: 12,
    fantasyRank: 1,
    adp: 25.3,
    projectedPoints: 195.8,
    lastSeasonPoints: 188.4,
    injuryStatus: &apos;healthy&apos;,
    isRookie: false,
    byeWeek: 10,
    stats: {
}
      receptions: 93,
      receivingYards: 984,
      receivingTouchdowns: 5,
      rushingYards: 0,
      rushingTouchdowns: 0,
      totalTouchdowns: 5
    }
  },
  {
}
    id: 4002,
    name: &apos;Mark Andrews&apos;,
    position: &apos;TE&apos;,
    team: &apos;BAL&apos;,
    jerseyNumber: 89,
    age: 29,
    height: &apos;6\&apos;5"&apos;,
    weight: 256,
    college: &apos;Oklahoma&apos;,
    experience: 7,
    fantasyRank: 2,
    adp: 45.7,
    projectedPoints: 165.2,
    lastSeasonPoints: 142.8,
    injuryStatus: &apos;healthy&apos;,
    isRookie: false,
    byeWeek: 14,
    stats: {
}
      receptions: 45,
      receivingYards: 544,
      receivingTouchdowns: 6,
      rushingYards: 0,
      rushingTouchdowns: 0,
      totalTouchdowns: 6
    }
  },
  {
}
    id: 4003,
    name: &apos;Sam LaPorta&apos;,
    position: &apos;TE&apos;,
    team: &apos;DET&apos;,
    jerseyNumber: 87,
    age: 23,
    height: &apos;6\&apos;4"&apos;,
    weight: 249,
    college: &apos;Iowa&apos;,
    experience: 2,
    fantasyRank: 3,
    adp: 38.9,
    projectedPoints: 175.4,
    lastSeasonPoints: 172.1,
    injuryStatus: &apos;healthy&apos;,
    isRookie: false,
    byeWeek: 5,
    stats: {
}
      receptions: 86,
      receivingYards: 889,
      receivingTouchdowns: 10,
      rushingYards: 0,
      rushingTouchdowns: 0,
      totalTouchdowns: 10
    }
  },

  // KICKERS
  {
}
    id: 5001,
    name: &apos;Justin Tucker&apos;,
    position: &apos;K&apos;,
    team: &apos;BAL&apos;,
    jerseyNumber: 9,
    age: 35,
    height: &apos;6\&apos;1"&apos;,
    weight: 183,
    college: &apos;Texas&apos;,
    experience: 13,
    fantasyRank: 1,
    adp: 145.2,
    projectedPoints: 135.8,
    lastSeasonPoints: 131.0,
    injuryStatus: &apos;healthy&apos;,
    isRookie: false,
    byeWeek: 14,
    stats: {
}
      fieldGoalsMade: 30,
      fieldGoalsAttempted: 35,
      extraPointsMade: 41,
      extraPointsAttempted: 42,
      fieldGoalPercentage: 85.7
    }
  },

  // DEFENSES
  {
}
    id: 6001,
    name: &apos;San Francisco 49ers&apos;,
    position: &apos;DST&apos;,
    team: &apos;SF&apos;,
    jerseyNumber: 0,
    age: 0,
    height: &apos;&apos;,
    weight: 0,
    college: &apos;&apos;,
    experience: 0,
    fantasyRank: 1,
    adp: 125.4,
    projectedPoints: 145.2,
    lastSeasonPoints: 142.8,
    injuryStatus: &apos;healthy&apos;,
    isRookie: false,
    byeWeek: 9,
    stats: {
}
      sacks: 48,
      interceptions: 22,
      fumbleRecoveries: 12,
      defensiveTouchdowns: 3,
      safeties: 1,
      pointsAllowed: 298
    }
  }
];

// Helper functions
export function getPlayersByPosition(position: string): Player[] {
}
  return NFL_PLAYERS_2024.filter((player: Player) => player.position === position);
}

export function getPlayersByTeam(team: string): Player[] {
}
  return NFL_PLAYERS_2024.filter((player: Player) => player.team === team);
}

export function searchPlayers(query: string): Player[] {
}
  const searchTerm = query.toLowerCase();
  return NFL_PLAYERS_2024.filter((player: Player) => 
    player.name.toLowerCase().includes(searchTerm) ||
    player.team.toLowerCase().includes(searchTerm) ||
    player.position.toLowerCase().includes(searchTerm)
  );
}

export function getTopPlayersByPosition(position: string, count: number = 10): Player[] {
}
  return getPlayersByPosition(position)
    .sort((a, b) => a.fantasyRank - b.fantasyRank)
    .slice(0, count);
}

export function getPlayerById(id: number): Player | undefined {
}
  return NFL_PLAYERS_2024.find((player: Player) => player.id === id);
}

// Position groups for roster management
export const POSITION_GROUPS = {
}
  QB: { name: &apos;Quarterback&apos;, slots: 1, maxRoster: 3 },
  RB: { name: &apos;Running Back&apos;, slots: 2, maxRoster: 6 },
  WR: { name: &apos;Wide Receiver&apos;, slots: 2, maxRoster: 6 },
  TE: { name: &apos;Tight End&apos;, slots: 1, maxRoster: 3 },
  FLEX: { name: &apos;Flex (RB/WR/TE)&apos;, slots: 1, maxRoster: 0 },
  K: { name: &apos;Kicker&apos;, slots: 1, maxRoster: 2 },
  DST: { name: &apos;Defense/Special Teams&apos;, slots: 1, maxRoster: 2 },
  BENCH: { name: &apos;Bench&apos;, slots: 6, maxRoster: 6 },
  IR: { name: &apos;Injured Reserve&apos;, slots: 2, maxRoster: 2 }
};

// Draft tiers for better draft strategy
export const DRAFT_TIERS = {
}
  QB: [
    { tier: 1, players: [1001, 1002, 1003, 1004] }, // Elite QBs
    { tier: 2, players: [1005] }, // QB1s
  ],
  RB: [
    { tier: 1, players: [2001] }, // Elite RB1
    { tier: 2, players: [2002, 2003, 2004] }, // RB1s
    { tier: 3, players: [2005] }, // High-end RB2s
  ],
  WR: [
    { tier: 1, players: [3001, 3002, 3003] }, // Elite WR1s
    { tier: 2, players: [3004, 3005] }, // WR1s
  ],
  TE: [
    { tier: 1, players: [4001] }, // Elite TE1
    { tier: 2, players: [4002, 4003] }, // TE1s
  ]
};