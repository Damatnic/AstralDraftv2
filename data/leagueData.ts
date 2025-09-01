/**
 * League Data for 2025 Season
 * 10-person league with draft on 8/31/2025
 */

import { League, Team, User } from &apos;../types&apos;;

// League Members
export const LEAGUE_MEMBERS: User[] = [
  { id: &apos;user_1&apos;, name: &apos;Nick Damato&apos;, email: &apos;nick@example.com&apos;, avatar: &apos;👑&apos; },
  { id: &apos;user_2&apos;, name: &apos;Jon Kornbeck&apos;, email: &apos;jon@example.com&apos;, avatar: &apos;⚡&apos; },
  { id: &apos;user_3&apos;, name: &apos;Cason Minor&apos;, email: &apos;cason@example.com&apos;, avatar: &apos;🔥&apos; },
  { id: &apos;user_4&apos;, name: &apos;Brittany Bergrum&apos;, email: &apos;brittany@example.com&apos;, avatar: &apos;💪&apos; },
  { id: &apos;user_5&apos;, name: &apos;Renee McCaigue&apos;, email: &apos;renee@example.com&apos;, avatar: &apos;🎯&apos; },
  { id: &apos;user_6&apos;, name: &apos;Jack McCaigue&apos;, email: &apos;jack@example.com&apos;, avatar: &apos;🚀&apos; },
  { id: &apos;user_7&apos;, name: &apos;Larry McCaigue&apos;, email: &apos;larry@example.com&apos;, avatar: &apos;⭐&apos; },
  { id: &apos;user_8&apos;, name: &apos;Kaity Lorbiecki&apos;, email: &apos;kaity@example.com&apos;, avatar: &apos;💎&apos; },
  { id: &apos;user_9&apos;, name: &apos;David Jarvey&apos;, email: &apos;david@example.com&apos;, avatar: &apos;🏆&apos; },
  { id: &apos;user_10&apos;, name: &apos;Nick Hartley&apos;, email: &apos;nickh@example.com&apos;, avatar: &apos;🎮&apos; }
];

// Team configurations
export const TEAMS_2025: Team[] = [
  {
}
    id: 1,
    name: "Damato&apos;s Dynasty",
    owner: LEAGUE_MEMBERS[0],
    avatar: &apos;👑&apos;,
    roster: [],
    budget: 200,
    faab: 100,
    record: { wins: 0, losses: 0, ties: 0 },
    futureDraftPicks: []
  },
  {
}
    id: 2,
    name: "Kornbeck&apos;s Crushers",
    owner: LEAGUE_MEMBERS[1],
    avatar: &apos;⚡&apos;,
    roster: [],
    budget: 200,
    faab: 100,
    record: { wins: 0, losses: 0, ties: 0 },
    futureDraftPicks: []
  },
  {
}
    id: 3,
    name: "Minor&apos;s Maulers",
    owner: LEAGUE_MEMBERS[2],
    avatar: &apos;🔥&apos;,
    roster: [],
    budget: 200,
    faab: 100,
    record: { wins: 0, losses: 0, ties: 0 },
    futureDraftPicks: []
  },
  {
}
    id: 4,
    name: "Bergrum&apos;s Blitz",
    owner: LEAGUE_MEMBERS[3],
    avatar: &apos;💪&apos;,
    roster: [],
    budget: 200,
    faab: 100,
    record: { wins: 0, losses: 0, ties: 0 },
    futureDraftPicks: []
  },
  {
}
    id: 5,
    name: "Renee&apos;s Raiders",
    owner: LEAGUE_MEMBERS[4],
    avatar: &apos;🎯&apos;,
    roster: [],
    budget: 200,
    faab: 100,
    record: { wins: 0, losses: 0, ties: 0 },
    futureDraftPicks: []
  },
  {
}
    id: 6,
    name: "Jack&apos;s Juggernauts",
    owner: LEAGUE_MEMBERS[5],
    avatar: &apos;🚀&apos;,
    roster: [],
    budget: 200,
    faab: 100,
    record: { wins: 0, losses: 0, ties: 0 },
    futureDraftPicks: []
  },
  {
}
    id: 7,
    name: "Larry&apos;s Legends",
    owner: LEAGUE_MEMBERS[6],
    avatar: &apos;⭐&apos;,
    roster: [],
    budget: 200,
    faab: 100,
    record: { wins: 0, losses: 0, ties: 0 },
    futureDraftPicks: []
  },
  {
}
    id: 8,
    name: "Lorbiecki&apos;s Lions",
    owner: LEAGUE_MEMBERS[7],
    avatar: &apos;💎&apos;,
    roster: [],
    budget: 200,
    faab: 100,
    record: { wins: 0, losses: 0, ties: 0 },
    futureDraftPicks: []
  },
  {
}
    id: 9,
    name: "Jarvey&apos;s Giants",
    owner: LEAGUE_MEMBERS[8],
    avatar: &apos;🏆&apos;,
    roster: [],
    budget: 200,
    faab: 100,
    record: { wins: 0, losses: 0, ties: 0 },
    futureDraftPicks: []
  },
  {
}
    id: 10,
    name: "Hartley&apos;s Heroes",
    owner: LEAGUE_MEMBERS[9],
    avatar: &apos;🎮&apos;,
    roster: [],
    budget: 200,
    faab: 100,
    record: { wins: 0, losses: 0, ties: 0 },
    futureDraftPicks: []
  }
];

// Main League Configuration
export const MAIN_LEAGUE: League = {
}
  id: &apos;league_2025&apos;,
  name: &apos;Astral Draft League 2025&apos;,
  logoUrl: &apos;/favicon.svg&apos;,
  commissionerId: &apos;user_1&apos;, // Nick Damato is commissioner
  status: &apos;IN_SEASON&apos;, // Changed from PRE_DRAFT to IN_SEASON - draft is complete
  currentWeek: 1, // Week 1 of the regular season
  settings: {
}
    teamCount: 10,
    playoffTeams: 6,
    regularSeasonWeeks: 14,
    playoffWeeks: 3,
    scoringFormat: &apos;PPR&apos;, // Full PPR scoring
    rosterFormat: {
}
      QB: 1,
      RB: 2,
      WR: 2,
      TE: 1,
      FLEX: 1,
      K: 1,
      DST: 1,
      BENCH: 6,
      IR: 2
    },
    draftFormat: &apos;SNAKE&apos;,
    draftDate: &apos;2025-08-31T19:00:00Z&apos;, // August 31, 2025 at 7 PM
    draftRounds: 16,
    draftSecondsPerPick: 90,
    waiverType: &apos;FAAB&apos;,
    waiverBudget: 100,
    waiverProcessDay: 3, // Wednesday
    tradeDeadline: 11, // Week 11
    keeperCount: 0, // No keepers for now
    aiAssistanceLevel: &apos;ADVANCED&apos;,
    scoringRules: {
}
      // Passing
      passingYards: 0.04, // 1 point per 25 yards
      passingTouchdowns: 4,
      passingInterceptions: -2,
      passing2PointConversions: 2,
      
      // Rushing
      rushingYards: 0.1, // 1 point per 10 yards
      rushingTouchdowns: 6,
      rushing2PointConversions: 2,
      
      // Receiving
      receptions: 1, // Full PPR
      receivingYards: 0.1, // 1 point per 10 yards
      receivingTouchdowns: 6,
      receiving2PointConversions: 2,
      
      // Kicking
      fieldGoalMade0to39: 3,
      fieldGoalMade40to49: 4,
      fieldGoalMade50Plus: 5,
      fieldGoalMissed: -1,
      extraPointMade: 1,
      extraPointMissed: -1,
      
      // Defense/Special Teams
      defensiveSack: 1,
      defensiveInterception: 2,
      defensiveFumbleRecovery: 2,
      defensiveTouchdown: 6,
      defensiveSafety: 2,
      defensiveBlockedKick: 2,
      kickoffReturnTouchdown: 6,
      puntReturnTouchdown: 6,
      defensivePointsAllowed0: 10,
      defensivePointsAllowed1to6: 7,
      defensivePointsAllowed7to13: 4,
      defensivePointsAllowed14to20: 1,
      defensivePointsAllowed21to27: 0,
      defensivePointsAllowed28to34: -1,
      defensivePointsAllowed35Plus: -4,
      
      // Miscellaneous
      fumbleLost: -2,
      fumbleRecoveryTouchdown: 6
    }
  },
  members: LEAGUE_MEMBERS,
  teams: TEAMS_2025,
  draftPicks: [],
  draftLog: [],
  chatMessages: [],
  tradeOffers: [],
  waiverClaims: [],
  schedule: [],
  draftCommentary: [],
  dues: {
}
    amount: 50,
    paid: {},
    deadline: &apos;2025-08-30&apos;
  },
  payouts: {
}
    firstPlace: 300,
    secondPlace: 150,
    thirdPlace: 50
  },
  playerAwards: [],
  sideBets: [],
  allPlayers: [] // Will be populated with NFL player data
};

// Draft order (will be randomized closer to draft date)
export const DRAFT_ORDER_2025 = [
  &apos;user_1&apos;, &apos;user_2&apos;, &apos;user_3&apos;, &apos;user_4&apos;, &apos;user_5&apos;,
  &apos;user_6&apos;, &apos;user_7&apos;, &apos;user_8&apos;, &apos;user_9&apos;, &apos;user_10&apos;
];

// Important dates for 2025 season
export const SEASON_DATES_2025 = {
}
  draftDate: new Date(&apos;2025-08-31T19:00:00Z&apos;), // Draft has been completed
  seasonStart: new Date(&apos;2025-09-05T00:00:00Z&apos;), // September 5, 2025 - NFL Kickoff Thursday
  regularSeasonEnd: new Date(&apos;2025-12-28T23:59:59Z&apos;), // Week 17 ends
  playoffStart: new Date(&apos;2025-12-29T00:00:00Z&apos;), // Fantasy playoffs begin Week 15-17
  championship: new Date(&apos;2026-01-04T00:00:00Z&apos;), // Week 17 championship
  tradeDeadline: new Date(&apos;2025-11-22T23:59:59Z&apos;) // Week 12 trade deadline
};

// Helper function to get days until next game week
export function getDaysUntilNextWeek(): number {
}
  const now = new Date();
  const nextThursday = new Date(now);
  nextThursday.setDate(now.getDate() + ((4 - now.getDay() + 7) % 7 || 7)); // Get next Thursday
  const diffTime = Math.abs(nextThursday.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Helper function to check if we&apos;re in season
export function isSeasonActive(): boolean {
}
  const now = new Date();
  return now >= SEASON_DATES_2025.seasonStart && now <= SEASON_DATES_2025.regularSeasonEnd;
}

// Helper function to get current NFL week
export function getCurrentNFLWeek(): number {
}
  const now = new Date();
  const seasonStart = SEASON_DATES_2025.seasonStart;
  if (now < seasonStart) return 0;
  
  const weeksSinceStart = Math.floor((now.getTime() - seasonStart.getTime()) / (1000 * 60 * 60 * 24 * 7));
  return Math.min(weeksSinceStart + 1, 18); // Max 18 weeks in NFL season
}

// Helper function to check if user is in league
export function isUserInLeague(userId: string): boolean {
}
  return LEAGUE_MEMBERS.some((member: any) => member.id === userId);
}

// Helper function to get user&apos;s team
export function getUserTeam(userId: string): Team | null {
}
  return TEAMS_2025.find((team: any) => team.owner.id === userId) || null;
}