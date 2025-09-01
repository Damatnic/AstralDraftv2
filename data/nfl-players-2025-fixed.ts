/**
 * NFL Players Database for 2025 Season - Fixed Types
 * Complete rosters for fantasy football drafting
 */

import { Player, PlayerPosition } from &apos;../types&apos;;

// Helper to create a player with proper types
const createPlayer = (
  id: number,
  name: string,
  position: PlayerPosition,
  team: string,
  rank: number,
  adp: number,
  bye: number,
  tier: number,
  age: number,
  auctionValue: number,
  projectedPoints: number
): Player => ({
}
  id,
  name,
  position,
  team,
  rank,
  adp,
  bye,
  tier,
  age,
  auctionValue,
  projectedPoints,
  consistency: &apos;medium&apos; as const,
  upside: &apos;medium&apos; as const,
  injuryStatus: &apos;healthy&apos; as const,
  injuryHistory: &apos;minimal&apos; as const,
  yearsExperience: 3,
  situationChange: &apos;same&apos; as const,
  role: &apos;starter&apos; as const,
  stats: {
}
    projection: projectedPoints,
    lastYear: projectedPoints * 0.95,
    vorp: projectedPoints / 10,
    weeklyProjections: {}
  }
});

// Top 200 fantasy-relevant players for 2025 season
export const nflPlayers2025: Player[] = [
  // Quarterbacks
  createPlayer(1, &apos;Josh Allen&apos;, &apos;QB&apos;, &apos;BUF&apos;, 1, 25.0, 13, 1, 29, 85, 380),
  createPlayer(2, &apos;Jalen Hurts&apos;, &apos;QB&apos;, &apos;PHI&apos;, 2, 28.0, 10, 1, 26, 82, 375),
  createPlayer(3, &apos;Lamar Jackson&apos;, &apos;QB&apos;, &apos;BAL&apos;, 3, 35.0, 14, 1, 28, 80, 365),
  createPlayer(4, &apos;Dak Prescott&apos;, &apos;QB&apos;, &apos;DAL&apos;, 4, 45.0, 7, 2, 31, 75, 340),
  createPlayer(5, &apos;Patrick Mahomes&apos;, &apos;QB&apos;, &apos;KC&apos;, 5, 40.0, 6, 1, 29, 78, 355),
  createPlayer(6, &apos;C.J. Stroud&apos;, &apos;QB&apos;, &apos;HOU&apos;, 6, 50.0, 14, 2, 23, 72, 330),
  createPlayer(7, &apos;Anthony Richardson&apos;, &apos;QB&apos;, &apos;IND&apos;, 7, 55.0, 14, 2, 23, 70, 325),
  createPlayer(8, &apos;Joe Burrow&apos;, &apos;QB&apos;, &apos;CIN&apos;, 8, 52.0, 12, 2, 28, 71, 335),
  createPlayer(9, &apos;Jordan Love&apos;, &apos;QB&apos;, &apos;GB&apos;, 9, 60.0, 10, 2, 26, 68, 320),
  createPlayer(10, &apos;Tua Tagovailoa&apos;, &apos;QB&apos;, &apos;MIA&apos;, 10, 65.0, 6, 3, 27, 65, 310),
  createPlayer(11, &apos;Trevor Lawrence&apos;, &apos;QB&apos;, &apos;JAX&apos;, 11, 70.0, 12, 3, 25, 62, 305),
  createPlayer(12, &apos;Justin Herbert&apos;, &apos;QB&apos;, &apos;LAC&apos;, 12, 68.0, 5, 3, 27, 63, 308),

  // Running Backs
  createPlayer(13, &apos;Christian McCaffrey&apos;, &apos;RB&apos;, &apos;SF&apos;, 1, 1.0, 9, 1, 29, 100, 350),
  createPlayer(14, &apos;Breece Hall&apos;, &apos;RB&apos;, &apos;NYJ&apos;, 2, 3.0, 7, 1, 24, 95, 320),
  createPlayer(15, &apos;Bijan Robinson&apos;, &apos;RB&apos;, &apos;ATL&apos;, 3, 4.0, 11, 1, 23, 93, 315),
  createPlayer(16, &apos;Saquon Barkley&apos;, &apos;RB&apos;, &apos;PHI&apos;, 4, 8.0, 10, 1, 28, 88, 300),
  createPlayer(17, &apos;Jonathan Taylor&apos;, &apos;RB&apos;, &apos;IND&apos;, 5, 9.0, 14, 1, 26, 87, 295),
  createPlayer(18, &apos;Jahmyr Gibbs&apos;, &apos;RB&apos;, &apos;DET&apos;, 6, 10.0, 5, 1, 23, 85, 290),
  createPlayer(19, &apos;Travis Etienne Jr.&apos;, &apos;RB&apos;, &apos;JAX&apos;, 7, 15.0, 12, 2, 26, 80, 275),
  createPlayer(20, &apos;Derrick Henry&apos;, &apos;RB&apos;, &apos;BAL&apos;, 8, 18.0, 14, 2, 31, 78, 270),
  createPlayer(21, &apos;Josh Jacobs&apos;, &apos;RB&apos;, &apos;GB&apos;, 9, 20.0, 10, 2, 27, 76, 265),
  createPlayer(22, &apos;Kenneth Walker III&apos;, &apos;RB&apos;, &apos;SEA&apos;, 10, 22.0, 10, 2, 24, 74, 260),
  createPlayer(23, &apos;Rachaad White&apos;, &apos;RB&apos;, &apos;TB&apos;, 11, 24.0, 11, 2, 26, 72, 255),
  createPlayer(24, &apos;Isiah Pacheco&apos;, &apos;RB&apos;, &apos;KC&apos;, 12, 26.0, 6, 2, 26, 70, 250),
  createPlayer(25, &apos;Joe Mixon&apos;, &apos;RB&apos;, &apos;HOU&apos;, 13, 28.0, 14, 2, 28, 68, 245),
  createPlayer(26, &apos;De\&apos;Von Achane&apos;, &apos;RB&apos;, &apos;MIA&apos;, 14, 30.0, 6, 2, 23, 66, 240),
  createPlayer(27, &apos;James Cook&apos;, &apos;RB&apos;, &apos;BUF&apos;, 15, 32.0, 13, 3, 25, 64, 235),

  // Wide Receivers
  createPlayer(28, &apos;CeeDee Lamb&apos;, &apos;WR&apos;, &apos;DAL&apos;, 1, 2.0, 7, 1, 26, 98, 340),
  createPlayer(29, &apos;Tyreek Hill&apos;, &apos;WR&apos;, &apos;MIA&apos;, 2, 5.0, 6, 1, 31, 92, 325),
  createPlayer(30, &apos;Amon-Ra St. Brown&apos;, &apos;WR&apos;, &apos;DET&apos;, 3, 6.0, 5, 1, 25, 90, 320),
  createPlayer(31, &apos;Justin Jefferson&apos;, &apos;WR&apos;, &apos;MIN&apos;, 4, 7.0, 13, 1, 26, 89, 318),
  createPlayer(32, &apos;Ja\&apos;Marr Chase&apos;, &apos;WR&apos;, &apos;CIN&apos;, 5, 11.0, 12, 1, 25, 84, 310),
  createPlayer(33, &apos;A.J. Brown&apos;, &apos;WR&apos;, &apos;PHI&apos;, 6, 12.0, 10, 1, 28, 83, 305),
  createPlayer(34, &apos;Puka Nacua&apos;, &apos;WR&apos;, &apos;LAR&apos;, 7, 13.0, 10, 1, 24, 82, 300),
  createPlayer(35, &apos;Garrett Wilson&apos;, &apos;WR&apos;, &apos;NYJ&apos;, 8, 14.0, 7, 1, 25, 81, 295),
  createPlayer(36, &apos;Chris Olave&apos;, &apos;WR&apos;, &apos;NO&apos;, 9, 16.0, 11, 2, 25, 79, 285),
  createPlayer(37, &apos;Davante Adams&apos;, &apos;WR&apos;, &apos;NYJ&apos;, 10, 17.0, 7, 2, 32, 77, 280),
  createPlayer(38, &apos;DK Metcalf&apos;, &apos;WR&apos;, &apos;SEA&apos;, 11, 19.0, 10, 2, 27, 75, 275),
  createPlayer(39, &apos;Mike Evans&apos;, &apos;WR&apos;, &apos;TB&apos;, 12, 21.0, 11, 2, 31, 73, 270),
  createPlayer(40, &apos;Brandon Aiyuk&apos;, &apos;WR&apos;, &apos;SF&apos;, 13, 23.0, 9, 2, 27, 71, 265),
  createPlayer(41, &apos;Stefon Diggs&apos;, &apos;WR&apos;, &apos;HOU&apos;, 14, 25.0, 14, 2, 31, 69, 260),
  createPlayer(42, &apos;Deebo Samuel&apos;, &apos;WR&apos;, &apos;SF&apos;, 15, 27.0, 9, 2, 29, 67, 255),
  createPlayer(43, &apos;Marvin Harrison Jr.&apos;, &apos;WR&apos;, &apos;ARI&apos;, 16, 29.0, 14, 2, 23, 65, 250),
  createPlayer(44, &apos;DJ Moore&apos;, &apos;WR&apos;, &apos;CHI&apos;, 17, 31.0, 7, 2, 28, 63, 245),
  createPlayer(45, &apos;Nico Collins&apos;, &apos;WR&apos;, &apos;HOU&apos;, 18, 33.0, 14, 2, 26, 61, 240),

  // Tight Ends
  createPlayer(46, &apos;Travis Kelce&apos;, &apos;TE&apos;, &apos;KC&apos;, 1, 34.0, 6, 1, 35, 60, 235),
  createPlayer(47, &apos;Sam LaPorta&apos;, &apos;TE&apos;, &apos;DET&apos;, 2, 36.0, 5, 1, 24, 58, 220),
  createPlayer(48, &apos;Mark Andrews&apos;, &apos;TE&apos;, &apos;BAL&apos;, 3, 42.0, 14, 2, 30, 55, 210),
  createPlayer(49, &apos;Trey McBride&apos;, &apos;TE&apos;, &apos;ARI&apos;, 4, 45.0, 14, 2, 25, 53, 200),
  createPlayer(50, &apos;Dalton Kincaid&apos;, &apos;TE&apos;, &apos;BUF&apos;, 5, 48.0, 13, 2, 25, 51, 195),
  createPlayer(51, &apos;George Kittle&apos;, &apos;TE&apos;, &apos;SF&apos;, 6, 50.0, 9, 2, 31, 49, 190),
  createPlayer(52, &apos;Kyle Pitts&apos;, &apos;TE&apos;, &apos;ATL&apos;, 7, 55.0, 11, 3, 24, 47, 185),
  createPlayer(53, &apos;Evan Engram&apos;, &apos;TE&apos;, &apos;JAX&apos;, 8, 60.0, 12, 3, 30, 45, 180),
  createPlayer(54, &apos;T.J. Hockenson&apos;, &apos;TE&apos;, &apos;MIN&apos;, 9, 62.0, 13, 3, 28, 43, 175),
  createPlayer(55, &apos;Dallas Goedert&apos;, &apos;TE&apos;, &apos;PHI&apos;, 10, 65.0, 10, 3, 30, 41, 170),

  // More depth players
  createPlayer(56, &apos;Aaron Jones&apos;, &apos;RB&apos;, &apos;MIN&apos;, 16, 35.0, 13, 3, 30, 62, 230),
  createPlayer(57, &apos;Alvin Kamara&apos;, &apos;RB&apos;, &apos;NO&apos;, 17, 37.0, 11, 3, 30, 60, 225),
  createPlayer(58, &apos;Rhamondre Stevenson&apos;, &apos;RB&apos;, &apos;NE&apos;, 18, 39.0, 14, 3, 27, 58, 220),
  createPlayer(59, &apos;Tony Pollard&apos;, &apos;RB&apos;, &apos;TEN&apos;, 19, 41.0, 5, 3, 28, 56, 215),
  createPlayer(60, &apos;James Conner&apos;, &apos;RB&apos;, &apos;ARI&apos;, 20, 43.0, 14, 3, 30, 54, 210),

  // Kickers
  createPlayer(89, &apos;Justin Tucker&apos;, &apos;K&apos;, &apos;BAL&apos;, 1, 120.0, 14, 1, 35, 20, 150),
  createPlayer(90, &apos;Harrison Butker&apos;, &apos;K&apos;, &apos;KC&apos;, 2, 125.0, 6, 1, 29, 18, 145),
  createPlayer(91, &apos;Tyler Bass&apos;, &apos;K&apos;, &apos;BUF&apos;, 3, 130.0, 13, 2, 28, 16, 140),

  // Defenses
  createPlayer(94, &apos;Baltimore Ravens&apos;, &apos;DST&apos;, &apos;BAL&apos;, 1, 115.0, 14, 1, 0, 22, 160),
  createPlayer(95, &apos;San Francisco 49ers&apos;, &apos;DST&apos;, &apos;SF&apos;, 2, 118.0, 9, 1, 0, 20, 155),
  createPlayer(96, &apos;Cleveland Browns&apos;, &apos;DST&apos;, &apos;CLE&apos;, 3, 122.0, 10, 1, 0, 18, 150),
];

// Helper functions for player queries
export const getPlayersByPosition = (position: PlayerPosition): Player[] => {
}
  return nflPlayers2025.filter((p: any) => p.position === position);
};

export const getPlayersByTier = (tier: number): Player[] => {
}
  return nflPlayers2025.filter((p: any) => p.tier === tier);
};

export const getTopPlayers = (count: number = 10): Player[] => {
}
  return nflPlayers2025.slice(0, count);
};

export const searchPlayers = (query: string): Player[] => {
}
  const lowerQuery = query.toLowerCase();
  return nflPlayers2025.filter((p: any) => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.team.toLowerCase().includes(lowerQuery) ||
    p.position.toLowerCase().includes(lowerQuery)
  );
};

export default nflPlayers2025;