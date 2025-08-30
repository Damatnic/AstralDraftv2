/**
 * League Data for 2025 Season
 * 10-person league with draft on 8/31/2025
 */

import { League, Team, User } from '../types';

// League Members
export const LEAGUE_MEMBERS: User[] = [
  { id: 'user_1', name: 'Nick Damato', email: 'nick@example.com', avatar: '👑' },
  { id: 'user_2', name: 'Jon Kornbeck', email: 'jon@example.com', avatar: '⚡' },
  { id: 'user_3', name: 'Cason Minor', email: 'cason@example.com', avatar: '🔥' },
  { id: 'user_4', name: 'Brittany Bergrum', email: 'brittany@example.com', avatar: '💪' },
  { id: 'user_5', name: 'Renee McCaigue', email: 'renee@example.com', avatar: '🎯' },
  { id: 'user_6', name: 'Jack McCaigue', email: 'jack@example.com', avatar: '🚀' },
  { id: 'user_7', name: 'Larry McCaigue', email: 'larry@example.com', avatar: '⭐' },
  { id: 'user_8', name: 'Kaity Lorbiecki', email: 'kaity@example.com', avatar: '💎' },
  { id: 'user_9', name: 'David Jarvey', email: 'david@example.com', avatar: '🏆' },
  { id: 'user_10', name: 'Nick Hartley', email: 'nickh@example.com', avatar: '🎮' }
];

// Team configurations
export const TEAMS_2025: Team[] = [
  {
    id: 1,
    name: "Damato's Dynasty",
    owner: LEAGUE_MEMBERS[0],
    avatar: '👑',
    roster: [],
    budget: 200,
    faab: 100,
    record: { wins: 0, losses: 0, ties: 0 },
    futureDraftPicks: []
  },
  {
    id: 2,
    name: "Kornbeck's Crushers",
    owner: LEAGUE_MEMBERS[1],
    avatar: '⚡',
    roster: [],
    budget: 200,
    faab: 100,
    record: { wins: 0, losses: 0, ties: 0 },
    futureDraftPicks: []
  },
  {
    id: 3,
    name: "Minor's Maulers",
    owner: LEAGUE_MEMBERS[2],
    avatar: '🔥',
    roster: [],
    budget: 200,
    faab: 100,
    record: { wins: 0, losses: 0, ties: 0 },
    futureDraftPicks: []
  },
  {
    id: 4,
    name: "Bergrum's Blitz",
    owner: LEAGUE_MEMBERS[3],
    avatar: '💪',
    roster: [],
    budget: 200,
    faab: 100,
    record: { wins: 0, losses: 0, ties: 0 },
    futureDraftPicks: []
  },
  {
    id: 5,
    name: "Renee's Raiders",
    owner: LEAGUE_MEMBERS[4],
    avatar: '🎯',
    roster: [],
    budget: 200,
    faab: 100,
    record: { wins: 0, losses: 0, ties: 0 },
    futureDraftPicks: []
  },
  {
    id: 6,
    name: "Jack's Juggernauts",
    owner: LEAGUE_MEMBERS[5],
    avatar: '🚀',
    roster: [],
    budget: 200,
    faab: 100,
    record: { wins: 0, losses: 0, ties: 0 },
    futureDraftPicks: []
  },
  {
    id: 7,
    name: "Larry's Legends",
    owner: LEAGUE_MEMBERS[6],
    avatar: '⭐',
    roster: [],
    budget: 200,
    faab: 100,
    record: { wins: 0, losses: 0, ties: 0 },
    futureDraftPicks: []
  },
  {
    id: 8,
    name: "Lorbiecki's Lions",
    owner: LEAGUE_MEMBERS[7],
    avatar: '💎',
    roster: [],
    budget: 200,
    faab: 100,
    record: { wins: 0, losses: 0, ties: 0 },
    futureDraftPicks: []
  },
  {
    id: 9,
    name: "Jarvey's Giants",
    owner: LEAGUE_MEMBERS[8],
    avatar: '🏆',
    roster: [],
    budget: 200,
    faab: 100,
    record: { wins: 0, losses: 0, ties: 0 },
    futureDraftPicks: []
  },
  {
    id: 10,
    name: "Hartley's Heroes",
    owner: LEAGUE_MEMBERS[9],
    avatar: '🎮',
    roster: [],
    budget: 200,
    faab: 100,
    record: { wins: 0, losses: 0, ties: 0 },
    futureDraftPicks: []
  }
];

// Main League Configuration
export const MAIN_LEAGUE: League = {
  id: 'league_2025',
  name: 'Astral Draft League 2025',
  logoUrl: '/favicon.svg',
  commissionerId: 'user_1', // Nick Damato is commissioner
  status: 'PRE_DRAFT',
  currentWeek: 0,
  settings: {
    teamCount: 10,
    playoffTeams: 6,
    regularSeasonWeeks: 14,
    playoffWeeks: 3,
    scoringFormat: 'PPR', // Full PPR scoring
    rosterFormat: {
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
    draftFormat: 'SNAKE',
    draftDate: '2025-08-31T19:00:00Z', // August 31, 2025 at 7 PM
    draftRounds: 16,
    draftSecondsPerPick: 90,
    waiverType: 'FAAB',
    waiverBudget: 100,
    waiverProcessDay: 3, // Wednesday
    tradeDeadline: 11, // Week 11
    keeperCount: 0, // No keepers for now
    aiAssistanceLevel: 'ADVANCED',
    scoringRules: {
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
    amount: 50,
    paid: {},
    deadline: '2025-08-30'
  },
  payouts: {
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
  'user_1', 'user_2', 'user_3', 'user_4', 'user_5',
  'user_6', 'user_7', 'user_8', 'user_9', 'user_10'
];

// Important dates for 2025 season
export const SEASON_DATES_2025 = {
  draftDate: new Date('2025-08-31T19:00:00Z'),
  seasonStart: new Date('2025-09-04T00:00:00Z'), // Thursday after Labor Day
  regularSeasonEnd: new Date('2025-12-21T23:59:59Z'),
  playoffStart: new Date('2025-12-22T00:00:00Z'),
  championship: new Date('2026-01-04T00:00:00Z'),
  tradeDeadline: new Date('2025-11-15T23:59:59Z')
};

// Helper function to get days until draft
export function getDaysUntilDraft(): number {
  const now = new Date();
  const draft = SEASON_DATES_2025.draftDate;
  const diffTime = Math.abs(draft.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Helper function to check if user is in league
export function isUserInLeague(userId: string): boolean {
  return LEAGUE_MEMBERS.some((member: any) => member.id === userId);
}

// Helper function to get user's team
export function getUserTeam(userId: string): Team | null {
  return TEAMS_2025.find((team: any) => team.owner.id === userId) || null;
}