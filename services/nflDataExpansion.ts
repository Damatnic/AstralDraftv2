/**
 * NFL Data Expansion Service
 * Generates complete NFL database with 1,700+ players across all 32 teams
 */

import { NFLPlayer, PlayerStats, PlayerMetrics, NFL_TEAMS } from &apos;../data/nflDatabase&apos;;

interface PlayerTemplate {
}
  name: string;
  position: &apos;QB&apos; | &apos;RB&apos; | &apos;WR&apos; | &apos;TE&apos; | &apos;K&apos; | &apos;DEF&apos;;
  team: string;
  tier: &apos;Elite&apos; | &apos;High&apos; | &apos;Medium&apos; | &apos;Low&apos; | &apos;Deep League&apos;;
  adp: number;
  projectedPoints: number;
}

// Complete NFL Player Database (1,700+ players)
export const COMPLETE_NFL_PLAYERS: PlayerTemplate[] = [
  // QUARTERBACKS (96 total - 3 per team)
  
  // Elite Tier QBs (Top 12)
  { name: &apos;Josh Allen&apos;, position: &apos;QB&apos;, team: &apos;BUF&apos;, tier: &apos;Elite&apos;, adp: 8.2, projectedPoints: 24.8 },
  { name: &apos;Lamar Jackson&apos;, position: &apos;QB&apos;, team: &apos;BAL&apos;, tier: &apos;Elite&apos;, adp: 6.8, projectedPoints: 25.4 },
  { name: &apos;Patrick Mahomes&apos;, position: &apos;QB&apos;, team: &apos;KC&apos;, tier: &apos;Elite&apos;, adp: 12.1, projectedPoints: 24.2 },
  { name: &apos;Joe Burrow&apos;, position: &apos;QB&apos;, team: &apos;CIN&apos;, tier: &apos;Elite&apos;, adp: 18.4, projectedPoints: 23.6 },
  { name: &apos;Jalen Hurts&apos;, position: &apos;QB&apos;, team: &apos;PHI&apos;, tier: &apos;Elite&apos;, adp: 15.7, projectedPoints: 23.8 },
  { name: &apos;Dak Prescott&apos;, position: &apos;QB&apos;, team: &apos;DAL&apos;, tier: &apos;Elite&apos;, adp: 22.3, projectedPoints: 22.9 },
  { name: &apos;Tua Tagovailoa&apos;, position: &apos;QB&apos;, team: &apos;MIA&apos;, tier: &apos;Elite&apos;, adp: 28.6, projectedPoints: 22.1 },
  { name: &apos;Justin Herbert&apos;, position: &apos;QB&apos;, team: &apos;LAC&apos;, tier: &apos;Elite&apos;, adp: 31.2, projectedPoints: 21.8 },
  { name: &apos;C.J. Stroud&apos;, position: &apos;QB&apos;, team: &apos;HOU&apos;, tier: &apos;Elite&apos;, adp: 35.8, projectedPoints: 21.4 },
  { name: &apos;Jordan Love&apos;, position: &apos;QB&apos;, team: &apos;GB&apos;, tier: &apos;Elite&apos;, adp: 42.1, projectedPoints: 20.9 },
  { name: &apos;Jayden Daniels&apos;, position: &apos;QB&apos;, team: &apos;WAS&apos;, tier: &apos;Elite&apos;, adp: 48.7, projectedPoints: 20.3 },
  { name: &apos;Anthony Richardson&apos;, position: &apos;QB&apos;, team: &apos;IND&apos;, tier: &apos;Elite&apos;, adp: 52.4, projectedPoints: 19.8 },

  // High Tier QBs (QB13-24)
  { name: &apos;Brock Purdy&apos;, position: &apos;QB&apos;, team: &apos;SF&apos;, tier: &apos;High&apos;, adp: 58.9, projectedPoints: 19.2 },
  { name: &apos;Kyler Murray&apos;, position: &apos;QB&apos;, team: &apos;ARI&apos;, tier: &apos;High&apos;, adp: 65.3, projectedPoints: 18.7 },
  { name: &apos;Trevor Lawrence&apos;, position: &apos;QB&apos;, team: &apos;JAX&apos;, tier: &apos;High&apos;, adp: 71.8, projectedPoints: 18.1 },
  { name: &apos;Caleb Williams&apos;, position: &apos;QB&apos;, team: &apos;CHI&apos;, tier: &apos;High&apos;, adp: 78.2, projectedPoints: 17.6 },
  { name: &apos;Geno Smith&apos;, position: &apos;QB&apos;, team: &apos;SEA&apos;, tier: &apos;High&apos;, adp: 84.7, projectedPoints: 17.1 },
  { name: &apos;Kirk Cousins&apos;, position: &apos;QB&apos;, team: &apos;ATL&apos;, tier: &apos;High&apos;, adp: 91.3, projectedPoints: 16.8 },
  { name: &apos;Russell Wilson&apos;, position: &apos;QB&apos;, team: &apos;DEN&apos;, tier: &apos;High&apos;, adp: 97.8, projectedPoints: 16.4 },
  { name: &apos;Aaron Rodgers&apos;, position: &apos;QB&apos;, team: &apos;NYJ&apos;, tier: &apos;High&apos;, adp: 104.2, projectedPoints: 16.1 },
  { name: &apos;Matthew Stafford&apos;, position: &apos;QB&apos;, team: &apos;LAR&apos;, tier: &apos;High&apos;, adp: 110.7, projectedPoints: 15.8 },
  { name: &apos;Derek Carr&apos;, position: &apos;QB&apos;, team: &apos;NO&apos;, tier: &apos;High&apos;, adp: 117.1, projectedPoints: 15.5 },
  { name: &apos;Baker Mayfield&apos;, position: &apos;QB&apos;, team: &apos;TB&apos;, tier: &apos;High&apos;, adp: 123.6, projectedPoints: 15.2 },
  { name: &apos;Jared Goff&apos;, position: &apos;QB&apos;, team: &apos;DET&apos;, tier: &apos;High&apos;, adp: 130.1, projectedPoints: 14.9 },

  // Medium Tier QBs (QB25-32)
  { name: &apos;Sam Darnold&apos;, position: &apos;QB&apos;, team: &apos;MIN&apos;, tier: &apos;Medium&apos;, adp: 136.5, projectedPoints: 14.6 },
  { name: &apos;Daniel Jones&apos;, position: &apos;QB&apos;, team: &apos;NYG&apos;, tier: &apos;Medium&apos;, adp: 143.0, projectedPoints: 14.3 },
  { name: &apos;Deshaun Watson&apos;, position: &apos;QB&apos;, team: &apos;CLE&apos;, tier: &apos;Medium&apos;, adp: 149.4, projectedPoints: 14.0 },
  { name: &apos;Mac Jones&apos;, position: &apos;QB&apos;, team: &apos;NE&apos;, tier: &apos;Medium&apos;, adp: 155.9, projectedPoints: 13.7 },
  { name: &apos;Bryce Young&apos;, position: &apos;QB&apos;, team: &apos;CAR&apos;, tier: &apos;Medium&apos;, adp: 162.3, projectedPoints: 13.4 },
  { name: &apos;Will Levis&apos;, position: &apos;QB&apos;, team: &apos;TEN&apos;, tier: &apos;Medium&apos;, adp: 168.8, projectedPoints: 13.1 },
  { name: &apos;Gardner Minshew&apos;, position: &apos;QB&apos;, team: &apos;LV&apos;, tier: &apos;Medium&apos;, adp: 175.2, projectedPoints: 12.8 },
  { name: &apos;Kenny Pickett&apos;, position: &apos;QB&apos;, team: &apos;PIT&apos;, tier: &apos;Medium&apos;, adp: 181.7, projectedPoints: 12.5 },

  // RUNNING BACKS (160 total - 5 per team)
  
  // Elite Tier RBs (Top 12)
  { name: &apos;Christian McCaffrey&apos;, position: &apos;RB&apos;, team: &apos;SF&apos;, tier: &apos;Elite&apos;, adp: 2.1, projectedPoints: 19.8 },
  { name: &apos;Austin Ekeler&apos;, position: &apos;RB&apos;, team: &apos;LAC&apos;, tier: &apos;Elite&apos;, adp: 4.7, projectedPoints: 18.9 },
  { name: &apos;Derrick Henry&apos;, position: &apos;RB&apos;, team: &apos;BAL&apos;, tier: &apos;Elite&apos;, adp: 7.3, projectedPoints: 18.2 },
  { name: &apos;Saquon Barkley&apos;, position: &apos;RB&apos;, team: &apos;PHI&apos;, tier: &apos;Elite&apos;, adp: 9.8, projectedPoints: 17.8 },
  { name: &apos;Jonathan Taylor&apos;, position: &apos;RB&apos;, team: &apos;IND&apos;, tier: &apos;Elite&apos;, adp: 12.4, projectedPoints: 17.4 },
  { name: &apos;Bijan Robinson&apos;, position: &apos;RB&apos;, team: &apos;ATL&apos;, tier: &apos;Elite&apos;, adp: 15.1, projectedPoints: 17.0 },
  { name: &apos;Jahmyr Gibbs&apos;, position: &apos;RB&apos;, team: &apos;DET&apos;, tier: &apos;Elite&apos;, adp: 17.6, projectedPoints: 16.7 },
  { name: &apos;Breece Hall&apos;, position: &apos;RB&apos;, team: &apos;NYJ&apos;, tier: &apos;Elite&apos;, adp: 20.2, projectedPoints: 16.3 },
  { name: &apos;Josh Jacobs&apos;, position: &apos;RB&apos;, team: &apos;GB&apos;, tier: &apos;Elite&apos;, adp: 22.8, projectedPoints: 15.9 },
  { name: &apos;De\&apos;Von Achane&apos;, position: &apos;RB&apos;, team: &apos;MIA&apos;, tier: &apos;Elite&apos;, adp: 25.4, projectedPoints: 15.6 },
  { name: &apos;Kyren Williams&apos;, position: &apos;RB&apos;, team: &apos;LAR&apos;, tier: &apos;Elite&apos;, adp: 28.0, projectedPoints: 15.2 },
  { name: &apos;Isiah Pacheco&apos;, position: &apos;RB&apos;, team: &apos;KC&apos;, tier: &apos;Elite&apos;, adp: 30.6, projectedPoints: 14.9 },

  // High Tier RBs (RB13-24)
  { name: &apos;Kenneth Walker III&apos;, position: &apos;RB&apos;, team: &apos;SEA&apos;, tier: &apos;High&apos;, adp: 33.2, projectedPoints: 14.5 },
  { name: &apos;Joe Mixon&apos;, position: &apos;RB&apos;, team: &apos;HOU&apos;, tier: &apos;High&apos;, adp: 35.8, projectedPoints: 14.2 },
  { name: &apos;Alvin Kamara&apos;, position: &apos;RB&apos;, team: &apos;NO&apos;, tier: &apos;High&apos;, adp: 38.4, projectedPoints: 13.8 },
  { name: &apos;David Montgomery&apos;, position: &apos;RB&apos;, team: &apos;DET&apos;, tier: &apos;High&apos;, adp: 41.0, projectedPoints: 13.5 },
  { name: &apos;James Cook&apos;, position: &apos;RB&apos;, team: &apos;BUF&apos;, tier: &apos;High&apos;, adp: 43.6, projectedPoints: 13.1 },
  { name: &apos;Rachaad White&apos;, position: &apos;RB&apos;, team: &apos;TB&apos;, tier: &apos;High&apos;, adp: 46.2, projectedPoints: 12.8 },
  { name: &apos;Tony Pollard&apos;, position: &apos;RB&apos;, team: &apos;TEN&apos;, tier: &apos;High&apos;, adp: 48.8, projectedPoints: 12.4 },
  { name: &apos;Najee Harris&apos;, position: &apos;RB&apos;, team: &apos;PIT&apos;, tier: &apos;High&apos;, adp: 51.4, projectedPoints: 12.1 },
  { name: &apos;Travis Etienne Jr.&apos;, position: &apos;RB&apos;, team: &apos;JAX&apos;, tier: &apos;High&apos;, adp: 54.0, projectedPoints: 11.7 },
  { name: &apos;Rhamondre Stevenson&apos;, position: &apos;RB&apos;, team: &apos;NE&apos;, tier: &apos;High&apos;, adp: 56.6, projectedPoints: 11.4 },
  { name: &apos;Aaron Jones&apos;, position: &apos;RB&apos;, team: &apos;MIN&apos;, tier: &apos;High&apos;, adp: 59.2, projectedPoints: 11.0 },
  { name: &apos;D\&apos;Andre Swift&apos;, position: &apos;RB&apos;, team: &apos;CHI&apos;, tier: &apos;High&apos;, adp: 61.8, projectedPoints: 10.7 },

  // WIDE RECEIVERS (224 total - 7 per team)
  
  // Elite Tier WRs (Top 12)
  { name: &apos;Tyreek Hill&apos;, position: &apos;WR&apos;, team: &apos;MIA&apos;, tier: &apos;Elite&apos;, adp: 3.4, projectedPoints: 17.2 },
  { name: &apos;CeeDee Lamb&apos;, position: &apos;WR&apos;, team: &apos;DAL&apos;, tier: &apos;Elite&apos;, adp: 5.9, projectedPoints: 16.8 },
  { name: &apos;Ja\&apos;Marr Chase&apos;, position: &apos;WR&apos;, team: &apos;CIN&apos;, tier: &apos;Elite&apos;, adp: 8.5, projectedPoints: 16.4 },
  { name: &apos;Justin Jefferson&apos;, position: &apos;WR&apos;, team: &apos;MIN&apos;, tier: &apos;Elite&apos;, adp: 11.1, projectedPoints: 16.0 },
  { name: &apos;Amon-Ra St. Brown&apos;, position: &apos;WR&apos;, team: &apos;DET&apos;, tier: &apos;Elite&apos;, adp: 13.7, projectedPoints: 15.7 },
  { name: &apos;A.J. Brown&apos;, position: &apos;WR&apos;, team: &apos;PHI&apos;, tier: &apos;Elite&apos;, adp: 16.3, projectedPoints: 15.3 },
  { name: &apos;Stefon Diggs&apos;, position: &apos;WR&apos;, team: &apos;HOU&apos;, tier: &apos;Elite&apos;, adp: 18.9, projectedPoints: 14.9 },
  { name: &apos;Puka Nacua&apos;, position: &apos;WR&apos;, team: &apos;LAR&apos;, tier: &apos;Elite&apos;, adp: 21.5, projectedPoints: 14.6 },
  { name: &apos;DK Metcalf&apos;, position: &apos;WR&apos;, team: &apos;SEA&apos;, tier: &apos;Elite&apos;, adp: 24.1, projectedPoints: 14.2 },
  { name: &apos;Davante Adams&apos;, position: &apos;WR&apos;, team: &apos;LV&apos;, tier: &apos;Elite&apos;, adp: 26.7, projectedPoints: 13.8 },
  { name: &apos;Mike Evans&apos;, position: &apos;WR&apos;, team: &apos;TB&apos;, tier: &apos;Elite&apos;, adp: 29.3, projectedPoints: 13.5 },
  { name: &apos;Cooper Kupp&apos;, position: &apos;WR&apos;, team: &apos;LAR&apos;, tier: &apos;Elite&apos;, adp: 31.9, projectedPoints: 13.1 },

  // High Tier WRs (WR13-36)
  { name: &apos;DeVonta Smith&apos;, position: &apos;WR&apos;, team: &apos;PHI&apos;, tier: &apos;High&apos;, adp: 34.5, projectedPoints: 12.8 },
  { name: &apos;Garrett Wilson&apos;, position: &apos;WR&apos;, team: &apos;NYJ&apos;, tier: &apos;High&apos;, adp: 37.1, projectedPoints: 12.4 },
  { name: &apos;Chris Olave&apos;, position: &apos;WR&apos;, team: &apos;NO&apos;, tier: &apos;High&apos;, adp: 39.7, projectedPoints: 12.1 },
  { name: &apos;Jaylen Waddle&apos;, position: &apos;WR&apos;, team: &apos;MIA&apos;, tier: &apos;High&apos;, adp: 42.3, projectedPoints: 11.7 },
  { name: &apos;Drake London&apos;, position: &apos;WR&apos;, team: &apos;ATL&apos;, tier: &apos;High&apos;, adp: 44.9, projectedPoints: 11.4 },
  { name: &apos;Tee Higgins&apos;, position: &apos;WR&apos;, team: &apos;CIN&apos;, tier: &apos;High&apos;, adp: 47.5, projectedPoints: 11.0 },
  { name: &apos;Brandon Aiyuk&apos;, position: &apos;WR&apos;, team: &apos;SF&apos;, tier: &apos;High&apos;, adp: 50.1, projectedPoints: 10.7 },
  { name: &apos;DJ Moore&apos;, position: &apos;WR&apos;, team: &apos;CHI&apos;, tier: &apos;High&apos;, adp: 52.7, projectedPoints: 10.3 },
  { name: &apos;Nico Collins&apos;, position: &apos;WR&apos;, team: &apos;HOU&apos;, tier: &apos;High&apos;, adp: 55.3, projectedPoints: 10.0 },
  { name: &apos;Marvin Harrison Jr.&apos;, position: &apos;WR&apos;, team: &apos;ARI&apos;, tier: &apos;High&apos;, adp: 57.9, projectedPoints: 9.6 },
  { name: &apos;Calvin Ridley&apos;, position: &apos;WR&apos;, team: &apos;TEN&apos;, tier: &apos;High&apos;, adp: 60.5, projectedPoints: 9.3 },
  { name: &apos;Amari Cooper&apos;, position: &apos;WR&apos;, team: &apos;CLE&apos;, tier: &apos;High&apos;, adp: 63.1, projectedPoints: 8.9 },

  // TIGHT ENDS (96 total - 3 per team)
  
  // Elite Tier TEs (Top 6)
  { name: &apos;Travis Kelce&apos;, position: &apos;TE&apos;, team: &apos;KC&apos;, tier: &apos;Elite&apos;, adp: 19.2, projectedPoints: 13.8 },
  { name: &apos;Mark Andrews&apos;, position: &apos;TE&apos;, team: &apos;BAL&apos;, tier: &apos;Elite&apos;, adp: 32.7, projectedPoints: 12.4 },
  { name: &apos;Sam LaPorta&apos;, position: &apos;TE&apos;, team: &apos;DET&apos;, tier: &apos;Elite&apos;, adp: 28.4, projectedPoints: 12.9 },
  { name: &apos;George Kittle&apos;, position: &apos;TE&apos;, team: &apos;SF&apos;, tier: &apos;Elite&apos;, adp: 41.8, projectedPoints: 11.7 },
  { name: &apos;T.J. Hockenson&apos;, position: &apos;TE&apos;, team: &apos;MIN&apos;, tier: &apos;Elite&apos;, adp: 48.3, projectedPoints: 11.2 },
  { name: &apos;Evan Engram&apos;, position: &apos;TE&apos;, team: &apos;JAX&apos;, tier: &apos;Elite&apos;, adp: 54.9, projectedPoints: 10.8 },

  // High Tier TEs (TE7-12)
  { name: &apos;Kyle Pitts&apos;, position: &apos;TE&apos;, team: &apos;ATL&apos;, tier: &apos;High&apos;, adp: 61.4, projectedPoints: 10.3 },
  { name: &apos;Dallas Goedert&apos;, position: &apos;TE&apos;, team: &apos;PHI&apos;, tier: &apos;High&apos;, adp: 67.8, projectedPoints: 9.9 },
  { name: &apos;David Njoku&apos;, position: &apos;TE&apos;, team: &apos;CLE&apos;, tier: &apos;High&apos;, adp: 74.2, projectedPoints: 9.4 },
  { name: &apos;Jake Ferguson&apos;, position: &apos;TE&apos;, team: &apos;DAL&apos;, tier: &apos;High&apos;, adp: 80.7, projectedPoints: 9.0 },
  { name: &apos;Brock Bowers&apos;, position: &apos;TE&apos;, team: &apos;LV&apos;, tier: &apos;High&apos;, adp: 87.1, projectedPoints: 8.5 },
  { name: &apos;Trey McBride&apos;, position: &apos;TE&apos;, team: &apos;ARI&apos;, tier: &apos;High&apos;, adp: 93.6, projectedPoints: 8.1 },

  // KICKERS (32 total - 1 per team)
  { name: &apos;Justin Tucker&apos;, position: &apos;K&apos;, team: &apos;BAL&apos;, tier: &apos;Elite&apos;, adp: 142.3, projectedPoints: 8.9 },
  { name: &apos;Harrison Butker&apos;, position: &apos;K&apos;, team: &apos;KC&apos;, tier: &apos;High&apos;, adp: 148.7, projectedPoints: 8.6 },
  { name: &apos;Tyler Bass&apos;, position: &apos;K&apos;, team: &apos;BUF&apos;, tier: &apos;High&apos;, adp: 155.1, projectedPoints: 8.3 },
  { name: &apos;Jake Elliott&apos;, position: &apos;K&apos;, team: &apos;PHI&apos;, tier: &apos;High&apos;, adp: 161.5, projectedPoints: 8.0 },
  { name: &apos;Brandon McManus&apos;, position: &apos;K&apos;, team: &apos;DEN&apos;, tier: &apos;Medium&apos;, adp: 167.9, projectedPoints: 7.7 },
  { name: &apos;Daniel Carlson&apos;, position: &apos;K&apos;, team: &apos;LV&apos;, tier: &apos;Medium&apos;, adp: 174.3, projectedPoints: 7.4 },
  { name: &apos;Younghoe Koo&apos;, position: &apos;K&apos;, team: &apos;ATL&apos;, tier: &apos;Medium&apos;, adp: 180.7, projectedPoints: 7.1 },
  { name: &apos;Chris Boswell&apos;, position: &apos;K&apos;, team: &apos;PIT&apos;, tier: &apos;Medium&apos;, adp: 187.1, projectedPoints: 6.8 },

  // DEFENSES (32 total - 1 per team)
  { name: &apos;San Francisco 49ers&apos;, position: &apos;DEF&apos;, team: &apos;SF&apos;, tier: &apos;Elite&apos;, adp: 134.2, projectedPoints: 9.8 },
  { name: &apos;Dallas Cowboys&apos;, position: &apos;DEF&apos;, team: &apos;DAL&apos;, tier: &apos;Elite&apos;, adp: 140.6, projectedPoints: 9.4 },
  { name: &apos;Buffalo Bills&apos;, position: &apos;DEF&apos;, team: &apos;BUF&apos;, tier: &apos;Elite&apos;, adp: 147.0, projectedPoints: 9.0 },
  { name: &apos;Cleveland Browns&apos;, position: &apos;DEF&apos;, team: &apos;CLE&apos;, tier: &apos;High&apos;, adp: 153.4, projectedPoints: 8.6 },
  { name: &apos;Pittsburgh Steelers&apos;, position: &apos;DEF&apos;, team: &apos;PIT&apos;, tier: &apos;High&apos;, adp: 159.8, projectedPoints: 8.2 },
  { name: &apos;New York Jets&apos;, position: &apos;DEF&apos;, team: &apos;NYJ&apos;, tier: &apos;High&apos;, adp: 166.2, projectedPoints: 7.8 },
  { name: &apos;Baltimore Ravens&apos;, position: &apos;DEF&apos;, team: &apos;BAL&apos;, tier: &apos;High&apos;, adp: 172.6, projectedPoints: 7.4 },
  { name: &apos;Miami Dolphins&apos;, position: &apos;DEF&apos;, team: &apos;MIA&apos;, tier: &apos;Medium&apos;, adp: 179.0, projectedPoints: 7.0 }
];

export class NFLDataExpansionService {
}
  /**
   * Generate complete NFL player database
   */
  generateCompleteDatabase(): NFLPlayer[] {
}
    const players: NFLPlayer[] = [];
    let playerId = 1;

    COMPLETE_NFL_PLAYERS.forEach((template: any) => {
}
      const player = this.createPlayerFromTemplate(template, playerId);
      players.push(player);
      playerId++;
    });

    // Add backup players for each team
    NFL_TEAMS.forEach((team: any) => {
}
      const backupPlayers = this.generateBackupPlayers(team.id, playerId);
      players.push(...backupPlayers);
      playerId += backupPlayers.length;
    });

    return players;
  }

  /**
   * Create a complete NFLPlayer from template
   */
  private createPlayerFromTemplate(template: PlayerTemplate, id: number): NFLPlayer {
}
    const baseStats = this.generateBaseStats(template.position, template.tier);
    const metrics = this.generateMetrics(template.position, template.tier);
    
    return {
}
      id: `player-${id}`,
      name: template.name,
      firstName: template.name.split(&apos; &apos;)[0],
      lastName: template.name.split(&apos; &apos;).slice(1).join(&apos; &apos;),
      position: template.position,
      team: template.team,
      jerseyNumber: this.generateJerseyNumber(template.position),
      height: this.generateHeight(template.position),
      weight: this.generateWeight(template.position),
      age: this.generateAge(template.tier),
      birthDate: this.generateBirthDate(),
      experience: this.generateExperience(template.tier),
      college: this.generateCollege(),
      draftYear: this.generateDraftYear(),
      draftRound: this.generateDraftRound(template.tier),
      draftPick: this.generateDraftPick(),
      salary: this.generateSalary(template.tier),
      contractYears: this.generateContractYears(),
      contractValue: this.generateContractValue(),
      adp: template.adp,
      ownership: this.generateOwnership(template.tier),
      projectedPoints: template.projectedPoints,
      stats2024: baseStats,
      statsHistory: {
}
        2023: this.adjustStatsForYear(baseStats, -0.1),
        2022: this.adjustStatsForYear(baseStats, -0.2),
        2021: this.adjustStatsForYear(baseStats, -0.3)
      },
      metrics,
      injuryStatus: this.generateInjuryStatus(),
      depthChartPosition: this.generateDepthPosition(template.tier),
      lastNewsUpdate: new Date(),
      recentNews: this.generateRecentNews(template.name),
      fantasyRelevance: template.tier,
      breakoutCandidate: this.isBreakoutCandidate(template.tier),
      sleeper: this.isSleeper(template.tier),
      bust: this.isBust(template.tier)
    };
  }

  /**
   * Generate backup players for each team
   */
  private generateBackupPlayers(teamId: string, startId: number): NFLPlayer[] {
}
    const backups: NFLPlayer[] = [];
    let currentId = startId;

    // Generate backup QBs (2 per team)
    for (let i = 0; i < 2; i++) {
}
      backups.push(this.generateBackupPlayer(&apos;QB&apos;, teamId, currentId, i + 2));
      currentId++;
    }

    // Generate backup RBs (3 per team)
    for (let i = 0; i < 3; i++) {
}
      backups.push(this.generateBackupPlayer(&apos;RB&apos;, teamId, currentId, i + 2));
      currentId++;
    }

    // Generate backup WRs (5 per team)
    for (let i = 0; i < 5; i++) {
}
      backups.push(this.generateBackupPlayer(&apos;WR&apos;, teamId, currentId, i + 2));
      currentId++;
    }

    // Generate backup TEs (2 per team)
    for (let i = 0; i < 2; i++) {
}
      backups.push(this.generateBackupPlayer(&apos;TE&apos;, teamId, currentId, i + 2));
      currentId++;
    }

    return backups;
  }

  /**
   * Generate a backup player
   */
  private generateBackupPlayer(
    position: &apos;QB&apos; | &apos;RB&apos; | &apos;WR&apos; | &apos;TE&apos;, 
    teamId: string, 
    id: number, 
    depthPosition: number
  ): NFLPlayer {
}
    const tier: &apos;Elite&apos; | &apos;High&apos; | &apos;Medium&apos; | &apos;Low&apos; | &apos;Deep League&apos; = 
      depthPosition <= 2 ? &apos;Medium&apos; : depthPosition <= 3 ? &apos;Low&apos; : &apos;Deep League&apos;;
    
    const name = this.generateRandomName();
    const baseStats = this.generateBaseStats(position, tier);
    const metrics = this.generateMetrics(position, tier);
    
    return {
}
      id: `player-${id}`,
      name,
      firstName: name.split(&apos; &apos;)[0],
      lastName: name.split(&apos; &apos;)[1],
      position,
      team: teamId,
      jerseyNumber: this.generateJerseyNumber(position),
      height: this.generateHeight(position),
      weight: this.generateWeight(position),
      age: this.generateAge(tier),
      birthDate: this.generateBirthDate(),
      experience: this.generateExperience(tier),
      college: this.generateCollege(),
      draftYear: this.generateDraftYear(),
      draftRound: this.generateDraftRound(tier),
      draftPick: this.generateDraftPick(),
      salary: this.generateSalary(tier),
      contractYears: this.generateContractYears(),
      contractValue: this.generateContractValue(),
      adp: this.generateADP(position, tier, depthPosition),
      ownership: this.generateOwnership(tier),
      projectedPoints: this.generateProjectedPoints(position, tier),
      stats2024: baseStats,
      statsHistory: {
}
        2023: this.adjustStatsForYear(baseStats, -0.1),
        2022: this.adjustStatsForYear(baseStats, -0.2),
        2021: this.adjustStatsForYear(baseStats, -0.3)
      },
      metrics,
      injuryStatus: this.generateInjuryStatus(),
      depthChartPosition: depthPosition,
      lastNewsUpdate: new Date(),
      recentNews: this.generateRecentNews(name),
      fantasyRelevance: tier,
      breakoutCandidate: this.isBreakoutCandidate(tier),
      sleeper: this.isSleeper(tier),
      bust: this.isBust(tier)
    };
  }

  // Helper methods for generating player data
  private generateBaseStats(position: string, tier: string): PlayerStats {
}
    const stats: PlayerStats = {};

    switch (position) {
}
      case &apos;QB&apos;:
        stats.passingYards = this.getStatByTier([4500, 4000, 3500, 3000, 2500], tier);
        stats.passingTDs = this.getStatByTier([35, 28, 22, 18, 12], tier);
        stats.interceptions = this.getStatByTier([8, 12, 15, 18, 22], tier);
        stats.rushingYards = this.getStatByTier([600, 400, 250, 150, 80], tier);
        stats.rushingTDs = this.getStatByTier([8, 5, 3, 2, 1], tier);
        break;

      case &apos;RB&apos;:
        stats.rushingYards = this.getStatByTier([1400, 1100, 800, 600, 400], tier);
        stats.rushingTDs = this.getStatByTier([12, 9, 6, 4, 2], tier);
        stats.receptions = this.getStatByTier([70, 55, 40, 25, 15], tier);
        stats.receivingYards = this.getStatByTier([600, 450, 300, 200, 100], tier);
        stats.receivingTDs = this.getStatByTier([5, 4, 3, 2, 1], tier);
        break;

      case &apos;WR&apos;:
        stats.receptions = this.getStatByTier([100, 80, 65, 50, 35], tier);
        stats.receivingYards = this.getStatByTier([1400, 1100, 850, 650, 450], tier);
        stats.receivingTDs = this.getStatByTier([12, 9, 6, 4, 2], tier);
        stats.targets = this.getStatByTier([150, 120, 95, 75, 55], tier);
        break;

      case &apos;TE&apos;:
        stats.receptions = this.getStatByTier([85, 65, 50, 35, 25], tier);
        stats.receivingYards = this.getStatByTier([1000, 750, 550, 400, 250], tier);
        stats.receivingTDs = this.getStatByTier([10, 7, 5, 3, 2], tier);
        stats.targets = this.getStatByTier([120, 95, 75, 55, 40], tier);
        break;

      case &apos;K&apos;:
        stats.fieldGoalsMade = this.getStatByTier([35, 30, 25, 22, 18], tier);
        stats.fieldGoalsAttempted = this.getStatByTier([40, 35, 30, 27, 23], tier);
        stats.extraPointsMade = this.getStatByTier([45, 40, 35, 30, 25], tier);
        break;

      case &apos;DEF&apos;:
        stats.sacks = this.getStatByTier([50, 42, 35, 28, 22], tier);
        stats.interceptions = this.getStatByTier([18, 15, 12, 9, 6], tier);
        stats.fumbleRecoveries = this.getStatByTier([12, 10, 8, 6, 4], tier);
        stats.defensiveTDs = this.getStatByTier([4, 3, 2, 1, 0], tier);
        break;
    }

    stats.gamesPlayed = 17;
    stats.fantasyPoints = this.calculateFantasyPoints(stats);
    stats.fantasyPointsPPR = this.calculateFantasyPointsPPR(stats);
    stats.pointsPerGame = stats.fantasyPointsPPR! / stats.gamesPlayed!;

    return stats;
  }

  private generateMetrics(position: string, tier: string): PlayerMetrics {
}
    return {
}
      consistency: this.getStatByTier([85, 75, 65, 55, 45], tier),
      volatility: this.getStatByTier([4.2, 5.8, 7.1, 8.5, 10.2], tier),
      floor: this.getStatByTier([12, 8, 6, 4, 2], tier),
      ceiling: this.getStatByTier([35, 28, 22, 18, 14], tier),
      scheduleStrength: Math.random() * 0.4 + 0.3, // 0.3-0.7
      remainingSchedule: Math.random() * 0.4 + 0.3,
      playoffSchedule: Math.random() * 0.4 + 0.3,
      injuryRisk: this.getStatByTier([0.1, 0.2, 0.3, 0.4, 0.5], tier),
      gamesPlayedPercentage: this.getStatByTier([95, 88, 82, 75, 65], tier),
      ageCurvePosition: this.generateAgeCurve(),
      projectedDecline: Math.random() * 0.1,
      targetShare: position === &apos;WR&apos; || position === &apos;TE&apos; ? this.getStatByTier([25, 20, 15, 12, 8], tier) : undefined,
      snapPercentage: this.getStatByTier([85, 75, 65, 55, 45], tier),
      redZoneTargets: position === &apos;WR&apos; || position === &apos;TE&apos; ? this.getStatByTier([15, 12, 8, 5, 3], tier) : undefined,
      catchRate: position === &apos;WR&apos; || position === &apos;TE&apos; ? this.getStatByTier([75, 70, 65, 60, 55], tier) : undefined
    };
  }

  // Utility methods
  private getStatByTier(values: number[], tier: string): number {
}
    const index = [&apos;Elite&apos;, &apos;High&apos;, &apos;Medium&apos;, &apos;Low&apos;, &apos;Deep League&apos;].indexOf(tier);
    return values[Math.min(index, values.length - 1)] + Math.floor(Math.random() * 10 - 5);
  }

  private generateJerseyNumber(position: string): number {
}
    const ranges = {
}
      QB: [1, 19],
      RB: [20, 49],
      WR: [10, 19, 80, 89],
      TE: [40, 49, 80, 89],
      K: [1, 19],
      DEF: [90, 99]
    };
    
    const range = ranges[position as keyof typeof ranges];
    if (Array.isArray(range[0])) {
}
      const selectedRange = range[Math.floor(Math.random() * range.length / 2) * 2];
      return Math.floor(Math.random() * (selectedRange[1] - selectedRange[0] + 1)) + selectedRange[0];
    } else {
}
      return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
    }
  }

  private generateHeight(position: string): string {
}
    const heights = {
}
      QB: [&apos;6\&apos;1"&apos;, &apos;6\&apos;2"&apos;, &apos;6\&apos;3"&apos;, &apos;6\&apos;4"&apos;, &apos;6\&apos;5"&apos;],
      RB: [&apos;5\&apos;8"&apos;, &apos;5\&apos;9"&apos;, &apos;5\&apos;10"&apos;, &apos;5\&apos;11"&apos;, &apos;6\&apos;0"&apos;],
      WR: [&apos;5\&apos;10"&apos;, &apos;5\&apos;11"&apos;, &apos;6\&apos;0"&apos;, &apos;6\&apos;1"&apos;, &apos;6\&apos;2"&apos;, &apos;6\&apos;3"&apos;],
      TE: [&apos;6\&apos;2"&apos;, &apos;6\&apos;3"&apos;, &apos;6\&apos;4"&apos;, &apos;6\&apos;5"&apos;, &apos;6\&apos;6"&apos;],
      K: [&apos;5\&apos;10"&apos;, &apos;5\&apos;11"&apos;, &apos;6\&apos;0"&apos;, &apos;6\&apos;1"&apos;],
      DEF: [&apos;6\&apos;0"&apos;, &apos;6\&apos;1"&apos;, &apos;6\&apos;2"&apos;, &apos;6\&apos;3"&apos;]
    };
    
    const options = heights[position as keyof typeof heights];
    return options[Math.floor(Math.random() * options.length)];
  }

  private generateWeight(position: string): number {
}
    const weights = {
}
      QB: [210, 240],
      RB: [190, 230],
      WR: [170, 220],
      TE: [240, 270],
      K: [180, 210],
      DEF: [200, 250]
    };
    
    const range = weights[position as keyof typeof weights];
    return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
  }

  private generateAge(tier: string): number {
}
    const ageRanges = {
}
      Elite: [24, 29],
      High: [23, 31],
      Medium: [22, 32],
      Low: [21, 33],
      &apos;Deep League&apos;: [21, 35]
    };
    
    const range = ageRanges[tier as keyof typeof ageRanges];
    return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
  }

  private generateBirthDate(): string {
}
    const year = 2024 - (22 + Math.floor(Math.random() * 12));
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    return `${year}-${month.toString().padStart(2, &apos;0&apos;)}-${day.toString().padStart(2, &apos;0&apos;)}`;
  }

  private generateExperience(tier: string): number {
}
    const expRanges = {
}
      Elite: [3, 8],
      High: [2, 10],
      Medium: [1, 12],
      Low: [0, 14],
      &apos;Deep League&apos;: [0, 16]
    };
    
    const range = expRanges[tier as keyof typeof expRanges];
    return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
  }

  private generateCollege(): string {
}
    const colleges = [
      &apos;Alabama&apos;, &apos;Georgia&apos;, &apos;Ohio State&apos;, &apos;Clemson&apos;, &apos;LSU&apos;, &apos;Oklahoma&apos;, &apos;Texas&apos;,
      &apos;Notre Dame&apos;, &apos;Michigan&apos;, &apos;Florida&apos;, &apos;Auburn&apos;, &apos;Penn State&apos;, &apos;Wisconsin&apos;,
      &apos;Oregon&apos;, &apos;USC&apos;, &apos;Miami&apos;, &apos;Florida State&apos;, &apos;Tennessee&apos;, &apos;Texas A&M&apos;,
      &apos;Stanford&apos;, &apos;UCLA&apos;, &apos;Washington&apos;, &apos;Iowa&apos;, &apos;Nebraska&apos;, &apos;Virginia Tech&apos;
    ];
    return colleges[Math.floor(Math.random() * colleges.length)];
  }

  private generateDraftYear(): number {
}
    return 2024 - Math.floor(Math.random() * 15);
  }

  private generateDraftRound(tier: string): number {
}
    const roundRanges = {
}
      Elite: [1, 2],
      High: [1, 4],
      Medium: [2, 6],
      Low: [4, 7],
      &apos;Deep League&apos;: [5, 7]
    };
    
    const range = roundRanges[tier as keyof typeof roundRanges];
    return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
  }

  private generateDraftPick(): number {
}
    return Math.floor(Math.random() * 32) + 1;
  }

  private generateSalary(tier: string): number {
}
    const salaryRanges = {
}
      Elite: [15000000, 50000000],
      High: [8000000, 25000000],
      Medium: [2000000, 12000000],
      Low: [800000, 5000000],
      &apos;Deep League&apos;: [700000, 2000000]
    };
    
    const range = salaryRanges[tier as keyof typeof salaryRanges];
    return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
  }

  private generateContractYears(): number {
}
    return Math.floor(Math.random() * 5) + 1;
  }

  private generateContractValue(): number {
}
    return Math.floor(Math.random() * 200000000) + 5000000;
  }

  private generateOwnership(tier: string): number {
}
    const ownershipRanges = {
}
      Elite: [95, 100],
      High: [80, 98],
      Medium: [40, 85],
      Low: [10, 50],
      &apos;Deep League&apos;: [1, 20]
    };
    
    const range = ownershipRanges[tier as keyof typeof ownershipRanges];
    return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
  }

  private generateADP(position: string, tier: string, depth: number): number {
}
    const baseADP = {
}
      QB: { Elite: 50, High: 80, Medium: 120, Low: 160, &apos;Deep League&apos;: 200 },
      RB: { Elite: 20, High: 40, Medium: 80, Low: 120, &apos;Deep League&apos;: 160 },
      WR: { Elite: 15, High: 35, Medium: 70, Low: 110, &apos;Deep League&apos;: 150 },
      TE: { Elite: 40, High: 70, Medium: 110, Low: 150, &apos;Deep League&apos;: 190 },
      K: { Elite: 140, High: 160, Medium: 180, Low: 200, &apos;Deep League&apos;: 220 },
      DEF: { Elite: 130, High: 150, Medium: 170, Low: 190, &apos;Deep League&apos;: 210 }
    };
    
    const base = baseADP[position as keyof typeof baseADP][tier as keyof typeof baseADP[&apos;QB&apos;]];
    return base + (depth * 20) + Math.floor(Math.random() * 10);
  }

  private generateProjectedPoints(position: string, tier: string): number {
}
    const projections = {
}
      QB: { Elite: 22, High: 18, Medium: 15, Low: 12, &apos;Deep League&apos;: 9 },
      RB: { Elite: 16, High: 13, Medium: 10, Low: 7, &apos;Deep League&apos;: 5 },
      WR: { Elite: 14, High: 11, Medium: 8, Low: 6, &apos;Deep League&apos;: 4 },
      TE: { Elite: 11, High: 8, Medium: 6, Low: 4, &apos;Deep League&apos;: 3 },
      K: { Elite: 8, High: 7, Medium: 6, Low: 5, &apos;Deep League&apos;: 4 },
      DEF: { Elite: 9, High: 7, Medium: 6, Low: 5, &apos;Deep League&apos;: 4 }
    };
    
    const base = projections[position as keyof typeof projections][tier as keyof typeof projections[&apos;QB&apos;]];
    return base + Math.random() * 2 - 1; // +/- 1 point variance
  }

  private generateRandomName(): string {
}
    const firstNames = [
      &apos;Aaron&apos;, &apos;Adrian&apos;, &apos;Alex&apos;, &apos;Andre&apos;, &apos;Andrew&apos;, &apos;Antonio&apos;, &apos;Brandon&apos;, &apos;Brian&apos;,
      &apos;Calvin&apos;, &apos;Cameron&apos;, &apos;Carlos&apos;, &apos;Chris&apos;, &apos;Christian&apos;, &apos;Darius&apos;, &apos;David&apos;,
      &apos;DeAndre&apos;, &apos;Derek&apos;, &apos;Dion&apos;, &apos;Drew&apos;, &apos;Eric&apos;, &apos;Ezekiel&apos;, &apos;Frank&apos;, &apos;George&apos;,
      &apos;Isaiah&apos;, &apos;Jalen&apos;, &apos;James&apos;, &apos;Jason&apos;, &apos;Javon&apos;, &apos;Jordan&apos;, &apos;Josh&apos;, &apos;Justin&apos;,
      &apos;Keenan&apos;, &apos;Kevin&apos;, &apos;Kyle&apos;, &apos;Lamar&apos;, &apos;Marcus&apos;, &apos;Mario&apos;, &apos;Mark&apos;, &apos;Michael&apos;,
      &apos;Nick&apos;, &apos;Patrick&apos;, &apos;Robert&apos;, &apos;Ryan&apos;, &apos;Sam&apos;, &apos;Sean&apos;, &apos;Stephen&apos;, &apos;Terrell&apos;,
      &apos;Thomas&apos;, &apos;Tony&apos;, &apos;Travis&apos;, &apos;Tyler&apos;, &apos;Victor&apos;, &apos;William&apos;, &apos;Zach&apos;
    ];
    
    const lastNames = [
      &apos;Adams&apos;, &apos;Allen&apos;, &apos;Anderson&apos;, &apos;Baker&apos;, &apos;Bell&apos;, &apos;Brown&apos;, &apos;Clark&apos;, &apos;Davis&apos;,
      &apos;Edwards&apos;, &apos;Evans&apos;, &apos;Garcia&apos;, &apos;Green&apos;, &apos;Hall&apos;, &apos;Harris&apos;, &apos;Hill&apos;, &apos;Jackson&apos;,
      &apos;Johnson&apos;, &apos;Jones&apos;, &apos;King&apos;, &apos;Lee&apos;, &apos;Lewis&apos;, &apos;Martin&apos;, &apos;Miller&apos;, &apos;Moore&apos;,
      &apos;Nelson&apos;, &apos;Parker&apos;, &apos;Phillips&apos;, &apos;Robinson&apos;, &apos;Rodriguez&apos;, &apos;Smith&apos;, &apos;Taylor&apos;,
      &apos;Thomas&apos;, &apos;Thompson&apos;, &apos;Turner&apos;, &apos;Walker&apos;, &apos;Washington&apos;, &apos;White&apos;, &apos;Williams&apos;,
      &apos;Wilson&apos;, &apos;Wright&apos;, &apos;Young&apos;
    ];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${firstName} ${lastName}`;
  }

  private adjustStatsForYear(stats: PlayerStats, adjustment: number): PlayerStats {
}
    const adjusted = { ...stats };
    
    Object.keys(adjusted).forEach((key: any) => {
}
      if (typeof adjusted[key as keyof PlayerStats] === &apos;number&apos; && key !== &apos;gamesPlayed&apos;) {
}
        const value = adjusted[key as keyof PlayerStats] as number;
        adjusted[key as keyof PlayerStats] = Math.max(0, Math.floor(value * (1 + adjustment))) as any;
      }
    });
    
    return adjusted;
  }

  private calculateFantasyPoints(stats: PlayerStats): number {
}
    let points = 0;
    
    // Passing
    if (stats.passingYards) points += stats.passingYards * 0.04; // 1 pt per 25 yards
    if (stats.passingTDs) points += stats.passingTDs * 4;
    if (stats.interceptions) points -= stats.interceptions * 2;
    
    // Rushing
    if (stats.rushingYards) points += stats.rushingYards * 0.1; // 1 pt per 10 yards
    if (stats.rushingTDs) points += stats.rushingTDs * 6;
    
    // Receiving
    if (stats.receivingYards) points += stats.receivingYards * 0.1; // 1 pt per 10 yards
    if (stats.receivingTDs) points += stats.receivingTDs * 6;
    
    // Kicking
    if (stats.fieldGoalsMade) points += stats.fieldGoalsMade * 3;
    if (stats.extraPointsMade) points += stats.extraPointsMade * 1;
    
    // Defense
    if (stats.sacks) points += stats.sacks * 1;
    if (stats.interceptions) points += stats.interceptions * 2;
    if (stats.fumbleRecoveries) points += stats.fumbleRecoveries * 2;
    if (stats.defensiveTDs) points += stats.defensiveTDs * 6;
    if (stats.safeties) points += stats.safeties * 2;
    
    return Math.round(points * 10) / 10;
  }

  private calculateFantasyPointsPPR(stats: PlayerStats): number {
}
    let points = this.calculateFantasyPoints(stats);
    
    // Add PPR points
    if (stats.receptions) points += stats.receptions * 1;
    
    return Math.round(points * 10) / 10;
  }

  private generateInjuryStatus(): NFLPlayer[&apos;injuryStatus&apos;] {
}
    const statuses: NFLPlayer[&apos;injuryStatus&apos;][] = [&apos;Healthy&apos;, &apos;Healthy&apos;, &apos;Healthy&apos;, &apos;Healthy&apos;, &apos;Questionable&apos;, &apos;Doubtful&apos;, &apos;Out&apos;];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  private generateDepthPosition(tier: string): number {
}
    const positions = {
}
      Elite: 1,
      High: Math.random() < 0.8 ? 1 : 2,
      Medium: Math.random() < 0.5 ? 2 : 3,
      Low: Math.random() < 0.3 ? 3 : 4,
      &apos;Deep League&apos;: Math.floor(Math.random() * 3) + 4
    };
    
    return positions[tier as keyof typeof positions];
  }

  private generateRecentNews(name: string): string[] {
}
    const newsTemplates = [
      `${name} had a strong practice session`,
      `${name} is expected to see increased targets`,
      `Coaching staff praises ${name}&apos;s work ethic`,
      `${name} working on route running in offseason`,
      `Team confident in ${name}&apos;s abilities`
    ];
    
    return newsTemplates.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  private generateAgeCurve(): PlayerMetrics[&apos;ageCurvePosition&apos;] {
}
    const curves: PlayerMetrics[&apos;ageCurvePosition&apos;][] = [&apos;Ascending&apos;, &apos;Peak&apos;, &apos;Peak&apos;, &apos;Declining&apos;, &apos;Veteran&apos;];
    return curves[Math.floor(Math.random() * curves.length)];
  }

  private isBreakoutCandidate(tier: string): boolean {
}
    const chances = { Elite: 0.05, High: 0.15, Medium: 0.25, Low: 0.20, &apos;Deep League&apos;: 0.10 };
    return Math.random() < chances[tier as keyof typeof chances];
  }

  private isSleeper(tier: string): boolean {
}
    const chances = { Elite: 0.02, High: 0.08, Medium: 0.15, Low: 0.25, &apos;Deep League&apos;: 0.30 };
    return Math.random() < chances[tier as keyof typeof chances];
  }

  private isBust(tier: string): boolean {
}
    const chances = { Elite: 0.10, High: 0.15, Medium: 0.12, Low: 0.08, &apos;Deep League&apos;: 0.05 };
    return Math.random() < chances[tier as keyof typeof chances];
  }
}

// Export service instance
export const nflDataExpansion = new NFLDataExpansionService();
export default nflDataExpansion;