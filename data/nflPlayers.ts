/**
 * NFL Players Database for 2024-2025 Season
 * Comprehensive player data with stats, projections, and fantasy relevance
 */

import { Player } from '../types';

// NFL Teams mapping
export const NFL_TEAMS = {
  'ARI': { name: 'Arizona Cardinals', conference: 'NFC', division: 'West', color: '#97233F' },
  'ATL': { name: 'Atlanta Falcons', conference: 'NFC', division: 'South', color: '#A71930' },
  'BAL': { name: 'Baltimore Ravens', conference: 'AFC', division: 'North', color: '#241773' },
  'BUF': { name: 'Buffalo Bills', conference: 'AFC', division: 'East', color: '#00338D' },
  'CAR': { name: 'Carolina Panthers', conference: 'NFC', division: 'South', color: '#0085CA' },
  'CHI': { name: 'Chicago Bears', conference: 'NFC', division: 'North', color: '#0B162A' },
  'CIN': { name: 'Cincinnati Bengals', conference: 'AFC', division: 'North', color: '#FB4F14' },
  'CLE': { name: 'Cleveland Browns', conference: 'AFC', division: 'North', color: '#311D00' },
  'DAL': { name: 'Dallas Cowboys', conference: 'NFC', division: 'East', color: '#003594' },
  'DEN': { name: 'Denver Broncos', conference: 'AFC', division: 'West', color: '#FB4F14' },
  'DET': { name: 'Detroit Lions', conference: 'NFC', division: 'North', color: '#0076B6' },
  'GB': { name: 'Green Bay Packers', conference: 'NFC', division: 'North', color: '#203731' },
  'HOU': { name: 'Houston Texans', conference: 'AFC', division: 'South', color: '#03202F' },
  'IND': { name: 'Indianapolis Colts', conference: 'AFC', division: 'South', color: '#002C5F' },
  'JAX': { name: 'Jacksonville Jaguars', conference: 'AFC', division: 'South', color: '#006778' },
  'KC': { name: 'Kansas City Chiefs', conference: 'AFC', division: 'West', color: '#E31837' },
  'LV': { name: 'Las Vegas Raiders', conference: 'AFC', division: 'West', color: '#000000' },
  'LAC': { name: 'Los Angeles Chargers', conference: 'AFC', division: 'West', color: '#0080C6' },
  'LAR': { name: 'Los Angeles Rams', conference: 'NFC', division: 'West', color: '#003594' },
  'MIA': { name: 'Miami Dolphins', conference: 'AFC', division: 'East', color: '#008E97' },
  'MIN': { name: 'Minnesota Vikings', conference: 'NFC', division: 'North', color: '#4F2683' },
  'NE': { name: 'New England Patriots', conference: 'AFC', division: 'East', color: '#002244' },
  'NO': { name: 'New Orleans Saints', conference: 'NFC', division: 'South', color: '#D3BC8D' },
  'NYG': { name: 'New York Giants', conference: 'NFC', division: 'East', color: '#0B2265' },
  'NYJ': { name: 'New York Jets', conference: 'AFC', division: 'East', color: '#125740' },
  'PHI': { name: 'Philadelphia Eagles', conference: 'NFC', division: 'East', color: '#004C54' },
  'PIT': { name: 'Pittsburgh Steelers', conference: 'AFC', division: 'North', color: '#FFB612' },
  'SF': { name: 'San Francisco 49ers', conference: 'NFC', division: 'West', color: '#AA0000' },
  'SEA': { name: 'Seattle Seahawks', conference: 'NFC', division: 'West', color: '#002244' },
  'TB': { name: 'Tampa Bay Buccaneers', conference: 'NFC', division: 'South', color: '#D50A0A' },
  'TEN': { name: 'Tennessee Titans', conference: 'AFC', division: 'South', color: '#0C2340' },
  'WAS': { name: 'Washington Commanders', conference: 'NFC', division: 'East', color: '#5A1414' }
};

// Top Fantasy Players for 2024-2025 Season
export const NFL_PLAYERS_2024: Player[] = [
  // QUARTERBACKS
  {
    id: 1001,
    name: 'Josh Allen',
    position: 'QB',
    team: 'BUF',
    jerseyNumber: 17,
    age: 28,
    height: '6\'5"',
    weight: 237,
    college: 'Wyoming',
    experience: 7,
    fantasyRank: 1,
    adp: 1.2,
    projectedPoints: 385.5,
    lastSeasonPoints: 378.2,
    injuryStatus: 'HEALTHY',
    isRookie: false,
    byeWeek: 12,
    stats: {
      passingYards: 4306,
      passingTDs: 29,
      interceptions: 18,
      rushingYards: 524,
      rushingTDs: 15,
      completionPercentage: 62.3
    }
  },
  {
    id: 1002,
    name: 'Lamar Jackson',
    position: 'QB',
    team: 'BAL',
    jerseyNumber: 8,
    age: 27,
    height: '6\'2"',
    weight: 212,
    college: 'Louisville',
    experience: 7,
    fantasyRank: 2,
    adp: 2.1,
    projectedPoints: 375.8,
    lastSeasonPoints: 365.4,
    injuryStatus: 'HEALTHY',
    isRookie: false,
    byeWeek: 14,
    stats: {
      passingYards: 3678,
      passingTDs: 24,
      interceptions: 7,
      rushingYards: 821,
      rushingTDs: 5,
      completionPercentage: 65.7
    }
  },
  {
    id: 1003,
    name: 'Jalen Hurts',
    position: 'QB',
    team: 'PHI',
    jerseyNumber: 1,
    age: 25,
    height: '6\'1"',
    weight: 223,
    college: 'Oklahoma',
    experience: 4,
    fantasyRank: 3,
    adp: 3.5,
    projectedPoints: 365.2,
    lastSeasonPoints: 342.1,
    injuryStatus: 'HEALTHY',
    isRookie: false,
    byeWeek: 5,
    stats: {
      passingYards: 3858,
      passingTDs: 23,
      interceptions: 15,
      rushingYards: 605,
      rushingTDs: 13,
      completionPercentage: 65.4
    }
  },
  {
    id: 1004,
    name: 'Patrick Mahomes',
    position: 'QB',
    team: 'KC',
    jerseyNumber: 15,
    age: 29,
    height: '6\'3"',
    weight: 230,
    college: 'Texas Tech',
    experience: 8,
    fantasyRank: 4,
    adp: 4.2,
    projectedPoints: 358.7,
    lastSeasonPoints: 334.8,
    injuryStatus: 'HEALTHY',
    isRookie: false,
    byeWeek: 10,
    stats: {
      passingYards: 4183,
      passingTDs: 27,
      interceptions: 14,
      rushingYards: 389,
      rushingTDs: 4,
      completionPercentage: 67.2
    }
  },
  {
    id: 1005,
    name: 'Dak Prescott',
    position: 'QB',
    team: 'DAL',
    jerseyNumber: 4,
    age: 31,
    height: '6\'2"',
    weight: 238,
    college: 'Mississippi State',
    experience: 9,
    fantasyRank: 5,
    adp: 8.3,
    projectedPoints: 325.4,
    lastSeasonPoints: 318.9,
    injuryStatus: 'HEALTHY',
    isRookie: false,
    byeWeek: 7,
    stats: {
      passingYards: 4516,
      passingTDs: 36,
      interceptions: 9,
      rushingYards: 105,
      rushingTDs: 2,
      completionPercentage: 69.5
    }
  },

  // RUNNING BACKS
  {
    id: 2001,
    name: 'Christian McCaffrey',
    position: 'RB',
    team: 'SF',
    jerseyNumber: 23,
    age: 28,
    height: '5\'11"',
    weight: 205,
    college: 'Stanford',
    experience: 8,
    fantasyRank: 1,
    adp: 1.8,
    projectedPoints: 285.6,
    lastSeasonPoints: 278.3,
    injuryStatus: 'HEALTHY',
    isRookie: false,
    byeWeek: 9,
    stats: {
      rushingYards: 1459,
      rushingTDs: 14,
      receptions: 67,
      receivingYards: 564,
      receivingTDs: 7,
      totalTouchdowns: 21
    }
  },
  {
    id: 2002,
    name: 'Austin Ekeler',
    position: 'RB',
    team: 'WAS',
    jerseyNumber: 30,
    age: 29,
    height: '5\'10"',
    weight: 200,
    college: 'Western Colorado',
    experience: 8,
    fantasyRank: 2,
    adp: 12.4,
    projectedPoints: 245.8,
    lastSeasonPoints: 198.7,
    injuryStatus: 'HEALTHY',
    isRookie: false,
    byeWeek: 14,
    stats: {
      rushingYards: 628,
      rushingTDs: 5,
      receptions: 51,
      receivingYards: 436,
      receivingTDs: 5,
      totalTouchdowns: 10
    }
  },
  {
    id: 2003,
    name: 'Derrick Henry',
    position: 'RB',
    team: 'BAL',
    jerseyNumber: 22,
    age: 30,
    height: '6\'3"',
    weight: 247,
    college: 'Alabama',
    experience: 9,
    fantasyRank: 3,
    adp: 15.7,
    projectedPoints: 235.4,
    lastSeasonPoints: 224.1,
    injuryStatus: 'HEALTHY',
    isRookie: false,
    byeWeek: 14,
    stats: {
      rushingYards: 1167,
      rushingTDs: 12,
      receptions: 20,
      receivingYards: 214,
      receivingTDs: 1,
      totalTouchdowns: 13
    }
  },
  {
    id: 2004,
    name: 'Saquon Barkley',
    position: 'RB',
    team: 'PHI',
    jerseyNumber: 26,
    age: 27,
    height: '6\'0"',
    weight: 233,
    college: 'Penn State',
    experience: 7,
    fantasyRank: 4,
    adp: 8.9,
    projectedPoints: 258.3,
    lastSeasonPoints: 181.2,
    injuryStatus: 'HEALTHY',
    isRookie: false,
    byeWeek: 5,
    stats: {
      rushingYards: 962,
      rushingTDs: 10,
      receptions: 41,
      receivingYards: 280,
      receivingTDs: 4,
      totalTouchdowns: 14
    }
  },
  {
    id: 2005,
    name: 'Jonathan Taylor',
    position: 'RB',
    team: 'IND',
    jerseyNumber: 28,
    age: 25,
    height: '5\'10"',
    weight: 226,
    college: 'Wisconsin',
    experience: 5,
    fantasyRank: 5,
    adp: 18.2,
    projectedPoints: 225.7,
    lastSeasonPoints: 156.8,
    injuryStatus: 'HEALTHY',
    isRookie: false,
    byeWeek: 14,
    stats: {
      rushingYards: 741,
      rushingTDs: 7,
      receptions: 38,
      receivingYards: 223,
      receivingTDs: 1,
      totalTouchdowns: 8
    }
  },

  // WIDE RECEIVERS
  {
    id: 3001,
    name: 'Tyreek Hill',
    position: 'WR',
    team: 'MIA',
    jerseyNumber: 10,
    age: 30,
    height: '5\'10"',
    weight: 185,
    college: 'West Alabama',
    experience: 9,
    fantasyRank: 1,
    adp: 5.3,
    projectedPoints: 275.8,
    lastSeasonPoints: 268.4,
    injuryStatus: 'HEALTHY',
    isRookie: false,
    byeWeek: 6,
    stats: {
      receptions: 119,
      receivingYards: 1799,
      receivingTDs: 13,
      rushingYards: 31,
      rushingTDs: 1,
      totalTouchdowns: 14
    }
  },
  {
    id: 3002,
    name: 'CeeDee Lamb',
    position: 'WR',
    team: 'DAL',
    jerseyNumber: 88,
    age: 25,
    height: '6\'2"',
    weight: 198,
    college: 'Oklahoma',
    experience: 5,
    fantasyRank: 2,
    adp: 6.1,
    projectedPoints: 268.9,
    lastSeasonPoints: 256.7,
    injuryStatus: 'HEALTHY',
    isRookie: false,
    byeWeek: 7,
    stats: {
      receptions: 135,
      receivingYards: 1749,
      receivingTDs: 12,
      rushingYards: 15,
      rushingTDs: 0,
      totalTouchdowns: 12
    }
  },
  {
    id: 3003,
    name: 'Ja\'Marr Chase',
    position: 'WR',
    team: 'CIN',
    jerseyNumber: 1,
    age: 24,
    height: '6\'0"',
    weight: 201,
    college: 'LSU',
    experience: 4,
    fantasyRank: 3,
    adp: 7.2,
    projectedPoints: 265.4,
    lastSeasonPoints: 241.8,
    injuryStatus: 'HEALTHY',
    isRookie: false,
    byeWeek: 12,
    stats: {
      receptions: 100,
      receivingYards: 1216,
      receivingTDs: 7,
      rushingYards: 12,
      rushingTDs: 0,
      totalTouchdowns: 7
    }
  },
  {
    id: 3004,
    name: 'Amon-Ra St. Brown',
    position: 'WR',
    team: 'DET',
    jerseyNumber: 14,
    age: 25,
    height: '6\'0"',
    weight: 197,
    college: 'USC',
    experience: 4,
    fantasyRank: 4,
    adp: 9.8,
    projectedPoints: 258.7,
    lastSeasonPoints: 245.3,
    injuryStatus: 'HEALTHY',
    isRookie: false,
    byeWeek: 5,
    stats: {
      receptions: 119,
      receivingYards: 1515,
      receivingTDs: 10,
      rushingYards: 37,
      rushingTDs: 1,
      totalTouchdowns: 11
    }
  },
  {
    id: 3005,
    name: 'A.J. Brown',
    position: 'WR',
    team: 'PHI',
    jerseyNumber: 11,
    age: 27,
    height: '6\'0"',
    weight: 226,
    college: 'Ole Miss',
    experience: 6,
    fantasyRank: 5,
    adp: 11.4,
    projectedPoints: 252.1,
    lastSeasonPoints: 238.9,
    injuryStatus: 'HEALTHY',
    isRookie: false,
    byeWeek: 5,
    stats: {
      receptions: 106,
      receivingYards: 1456,
      receivingTDs: 7,
      rushingYards: 21,
      rushingTDs: 0,
      totalTouchdowns: 7
    }
  },

  // TIGHT ENDS
  {
    id: 4001,
    name: 'Travis Kelce',
    position: 'TE',
    team: 'KC',
    jerseyNumber: 87,
    age: 35,
    height: '6\'5"',
    weight: 250,
    college: 'Cincinnati',
    experience: 12,
    fantasyRank: 1,
    adp: 25.3,
    projectedPoints: 195.8,
    lastSeasonPoints: 188.4,
    injuryStatus: 'HEALTHY',
    isRookie: false,
    byeWeek: 10,
    stats: {
      receptions: 93,
      receivingYards: 984,
      receivingTDs: 5,
      rushingYards: 0,
      rushingTDs: 0,
      totalTouchdowns: 5
    }
  },
  {
    id: 4002,
    name: 'Mark Andrews',
    position: 'TE',
    team: 'BAL',
    jerseyNumber: 89,
    age: 29,
    height: '6\'5"',
    weight: 256,
    college: 'Oklahoma',
    experience: 7,
    fantasyRank: 2,
    adp: 45.7,
    projectedPoints: 165.2,
    lastSeasonPoints: 142.8,
    injuryStatus: 'HEALTHY',
    isRookie: false,
    byeWeek: 14,
    stats: {
      receptions: 45,
      receivingYards: 544,
      receivingTDs: 6,
      rushingYards: 0,
      rushingTDs: 0,
      totalTouchdowns: 6
    }
  },
  {
    id: 4003,
    name: 'Sam LaPorta',
    position: 'TE',
    team: 'DET',
    jerseyNumber: 87,
    age: 23,
    height: '6\'4"',
    weight: 249,
    college: 'Iowa',
    experience: 2,
    fantasyRank: 3,
    adp: 38.9,
    projectedPoints: 175.4,
    lastSeasonPoints: 172.1,
    injuryStatus: 'HEALTHY',
    isRookie: false,
    byeWeek: 5,
    stats: {
      receptions: 86,
      receivingYards: 889,
      receivingTDs: 10,
      rushingYards: 0,
      rushingTDs: 0,
      totalTouchdowns: 10
    }
  },

  // KICKERS
  {
    id: 5001,
    name: 'Justin Tucker',
    position: 'K',
    team: 'BAL',
    jerseyNumber: 9,
    age: 35,
    height: '6\'1"',
    weight: 183,
    college: 'Texas',
    experience: 13,
    fantasyRank: 1,
    adp: 145.2,
    projectedPoints: 135.8,
    lastSeasonPoints: 131.0,
    injuryStatus: 'HEALTHY',
    isRookie: false,
    byeWeek: 14,
    stats: {
      fieldGoalsMade: 30,
      fieldGoalsAttempted: 35,
      extraPointsMade: 41,
      extraPointsAttempted: 42,
      fieldGoalPercentage: 85.7
    }
  },

  // DEFENSES
  {
    id: 6001,
    name: 'San Francisco 49ers',
    position: 'DST',
    team: 'SF',
    jerseyNumber: 0,
    age: 0,
    height: '',
    weight: 0,
    college: '',
    experience: 0,
    fantasyRank: 1,
    adp: 125.4,
    projectedPoints: 145.2,
    lastSeasonPoints: 142.8,
    injuryStatus: 'HEALTHY',
    isRookie: false,
    byeWeek: 9,
    stats: {
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
  return NFL_PLAYERS_2024.filter(player => player.position === position);
}

export function getPlayersByTeam(team: string): Player[] {
  return NFL_PLAYERS_2024.filter(player => player.team === team);
}

export function searchPlayers(query: string): Player[] {
  const searchTerm = query.toLowerCase();
  return NFL_PLAYERS_2024.filter(player => 
    player.name.toLowerCase().includes(searchTerm) ||
    player.team.toLowerCase().includes(searchTerm) ||
    player.position.toLowerCase().includes(searchTerm)
  );
}

export function getTopPlayersByPosition(position: string, count: number = 10): Player[] {
  return getPlayersByPosition(position)
    .sort((a, b) => a.fantasyRank - b.fantasyRank)
    .slice(0, count);
}

export function getPlayerById(id: number): Player | undefined {
  return NFL_PLAYERS_2024.find(player => player.id === id);
}

// Position groups for roster management
export const POSITION_GROUPS = {
  QB: { name: 'Quarterback', slots: 1, maxRoster: 3 },
  RB: { name: 'Running Back', slots: 2, maxRoster: 6 },
  WR: { name: 'Wide Receiver', slots: 2, maxRoster: 6 },
  TE: { name: 'Tight End', slots: 1, maxRoster: 3 },
  FLEX: { name: 'Flex (RB/WR/TE)', slots: 1, maxRoster: 0 },
  K: { name: 'Kicker', slots: 1, maxRoster: 2 },
  DST: { name: 'Defense/Special Teams', slots: 1, maxRoster: 2 },
  BENCH: { name: 'Bench', slots: 6, maxRoster: 6 },
  IR: { name: 'Injured Reserve', slots: 2, maxRoster: 2 }
};

// Draft tiers for better draft strategy
export const DRAFT_TIERS = {
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