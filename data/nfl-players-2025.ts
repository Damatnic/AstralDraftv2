/**
 * NFL Players Database for 2025 Season
 * Complete rosters for fantasy football drafting
 */

import { Player, PlayerPosition } from &apos;../types&apos;;

// Top 200 fantasy-relevant players for 2025 season
export const nflPlayers2025: Player[] = [
  // Quarterbacks
  { id: &apos;1&apos;, name: &apos;Josh Allen&apos;, position: &apos;QB&apos;, team: &apos;BUF&apos;, age: 29, tier: 1, adp: 25.0, rank: 1, value: 85, status: &apos;healthy&apos;, projectedPoints: 380 },
  { id: &apos;2&apos;, name: &apos;Jalen Hurts&apos;, position: &apos;QB&apos;, team: &apos;PHI&apos;, age: 26, tier: 1, adp: 28.0, rank: 2, value: 82, status: &apos;healthy&apos;, projectedPoints: 375 },
  { id: &apos;3&apos;, name: &apos;Lamar Jackson&apos;, position: &apos;QB&apos;, team: &apos;BAL&apos;, age: 28, tier: 1, adp: 35.0, rank: 3, value: 80, status: &apos;healthy&apos;, projectedPoints: 365 },
  { id: &apos;4&apos;, name: &apos;Dak Prescott&apos;, position: &apos;QB&apos;, team: &apos;DAL&apos;, age: 31, tier: 2, adp: 45.0, rank: 4, value: 75, status: &apos;healthy&apos;, projectedPoints: 340 },
  { id: &apos;5&apos;, name: &apos;Patrick Mahomes&apos;, position: &apos;QB&apos;, team: &apos;KC&apos;, age: 29, tier: 1, adp: 40.0, rank: 5, value: 78, status: &apos;healthy&apos;, projectedPoints: 355 },
  { id: &apos;6&apos;, name: &apos;C.J. Stroud&apos;, position: &apos;QB&apos;, team: &apos;HOU&apos;, age: 23, tier: 2, adp: 50.0, rank: 6, value: 72, status: &apos;healthy&apos;, projectedPoints: 330 },
  { id: &apos;7&apos;, name: &apos;Anthony Richardson&apos;, position: &apos;QB&apos;, team: &apos;IND&apos;, age: 23, tier: 2, adp: 55.0, rank: 7, value: 70, status: &apos;healthy&apos;, projectedPoints: 325 },
  { id: &apos;8&apos;, name: &apos;Joe Burrow&apos;, position: &apos;QB&apos;, team: &apos;CIN&apos;, age: 28, tier: 2, adp: 52.0, rank: 8, value: 71, status: &apos;healthy&apos;, projectedPoints: 335 },
  { id: &apos;9&apos;, name: &apos;Jordan Love&apos;, position: &apos;QB&apos;, team: &apos;GB&apos;, age: 26, tier: 2, adp: 60.0, rank: 9, value: 68, status: &apos;healthy&apos;, projectedPoints: 320 },
  { id: &apos;10&apos;, name: &apos;Tua Tagovailoa&apos;, position: &apos;QB&apos;, team: &apos;MIA&apos;, age: 27, tier: 3, adp: 65.0, rank: 10, value: 65, status: &apos;healthy&apos;, projectedPoints: 310 },
  { id: &apos;11&apos;, name: &apos;Trevor Lawrence&apos;, position: &apos;QB&apos;, team: &apos;JAX&apos;, age: 25, tier: 3, adp: 70.0, rank: 11, value: 62, status: &apos;healthy&apos;, projectedPoints: 305 },
  { id: &apos;12&apos;, name: &apos;Justin Herbert&apos;, position: &apos;QB&apos;, team: &apos;LAC&apos;, age: 27, tier: 3, adp: 68.0, rank: 12, value: 63, status: &apos;healthy&apos;, projectedPoints: 308 },

  // Running Backs
  { id: &apos;13&apos;, name: &apos;Christian McCaffrey&apos;, position: &apos;RB&apos;, team: &apos;SF&apos;, age: 29, tier: 1, adp: 1.0, rank: 1, value: 100, status: &apos;healthy&apos;, projectedPoints: 350 },
  { id: &apos;14&apos;, name: &apos;Breece Hall&apos;, position: &apos;RB&apos;, team: &apos;NYJ&apos;, age: 24, tier: 1, adp: 3.0, rank: 2, value: 95, status: &apos;healthy&apos;, projectedPoints: 320 },
  { id: &apos;15&apos;, name: &apos;Bijan Robinson&apos;, position: &apos;RB&apos;, team: &apos;ATL&apos;, age: 23, tier: 1, adp: 4.0, rank: 3, value: 93, status: &apos;healthy&apos;, projectedPoints: 315 },
  { id: &apos;16&apos;, name: &apos;Saquon Barkley&apos;, position: &apos;RB&apos;, team: &apos;PHI&apos;, age: 28, tier: 1, adp: 8.0, rank: 4, value: 88, status: &apos;healthy&apos;, projectedPoints: 300 },
  { id: &apos;17&apos;, name: &apos;Jonathan Taylor&apos;, position: &apos;RB&apos;, team: &apos;IND&apos;, age: 26, tier: 1, adp: 9.0, rank: 5, value: 87, status: &apos;healthy&apos;, projectedPoints: 295 },
  { id: &apos;18&apos;, name: &apos;Jahmyr Gibbs&apos;, position: &apos;RB&apos;, team: &apos;DET&apos;, age: 23, tier: 1, adp: 10.0, rank: 6, value: 85, status: &apos;healthy&apos;, projectedPoints: 290 },
  { id: &apos;19&apos;, name: &apos;Travis Etienne Jr.&apos;, position: &apos;RB&apos;, team: &apos;JAX&apos;, age: 26, tier: 2, adp: 15.0, rank: 7, value: 80, status: &apos;healthy&apos;, projectedPoints: 275 },
  { id: &apos;20&apos;, name: &apos;Derrick Henry&apos;, position: &apos;RB&apos;, team: &apos;BAL&apos;, age: 31, tier: 2, adp: 18.0, rank: 8, value: 78, status: &apos;healthy&apos;, projectedPoints: 270 },
  { id: &apos;21&apos;, name: &apos;Josh Jacobs&apos;, position: &apos;RB&apos;, team: &apos;GB&apos;, age: 27, tier: 2, adp: 20.0, rank: 9, value: 76, status: &apos;healthy&apos;, projectedPoints: 265 },
  { id: &apos;22&apos;, name: &apos;Kenneth Walker III&apos;, position: &apos;RB&apos;, team: &apos;SEA&apos;, age: 24, tier: 2, adp: 22.0, rank: 10, value: 74, status: &apos;healthy&apos;, projectedPoints: 260 },
  { id: &apos;23&apos;, name: &apos;Rachaad White&apos;, position: &apos;RB&apos;, team: &apos;TB&apos;, age: 26, tier: 2, adp: 24.0, rank: 11, value: 72, status: &apos;healthy&apos;, projectedPoints: 255 },
  { id: &apos;24&apos;, name: &apos;Isiah Pacheco&apos;, position: &apos;RB&apos;, team: &apos;KC&apos;, age: 26, tier: 2, adp: 26.0, rank: 12, value: 70, status: &apos;healthy&apos;, projectedPoints: 250 },
  { id: &apos;25&apos;, name: &apos;Joe Mixon&apos;, position: &apos;RB&apos;, team: &apos;HOU&apos;, age: 28, tier: 2, adp: 28.0, rank: 13, value: 68, status: &apos;healthy&apos;, projectedPoints: 245 },
  { id: &apos;26&apos;, name: &apos;De\&apos;Von Achane&apos;, position: &apos;RB&apos;, team: &apos;MIA&apos;, age: 23, tier: 2, adp: 30.0, rank: 14, value: 66, status: &apos;healthy&apos;, projectedPoints: 240 },
  { id: &apos;27&apos;, name: &apos;James Cook&apos;, position: &apos;RB&apos;, team: &apos;BUF&apos;, age: 25, tier: 3, adp: 32.0, rank: 15, value: 64, status: &apos;healthy&apos;, projectedPoints: 235 },

  // Wide Receivers
  { id: &apos;28&apos;, name: &apos;CeeDee Lamb&apos;, position: &apos;WR&apos;, team: &apos;DAL&apos;, age: 26, tier: 1, adp: 2.0, rank: 1, value: 98, status: &apos;healthy&apos;, projectedPoints: 340 },
  { id: &apos;29&apos;, name: &apos;Tyreek Hill&apos;, position: &apos;WR&apos;, team: &apos;MIA&apos;, age: 31, tier: 1, adp: 5.0, rank: 2, value: 92, status: &apos;healthy&apos;, projectedPoints: 325 },
  { id: &apos;30&apos;, name: &apos;Amon-Ra St. Brown&apos;, position: &apos;WR&apos;, team: &apos;DET&apos;, age: 25, tier: 1, adp: 6.0, rank: 3, value: 90, status: &apos;healthy&apos;, projectedPoints: 320 },
  { id: &apos;31&apos;, name: &apos;Justin Jefferson&apos;, position: &apos;WR&apos;, team: &apos;MIN&apos;, age: 26, tier: 1, adp: 7.0, rank: 4, value: 89, status: &apos;healthy&apos;, projectedPoints: 318 },
  { id: &apos;32&apos;, name: &apos;Ja\&apos;Marr Chase&apos;, position: &apos;WR&apos;, team: &apos;CIN&apos;, age: 25, tier: 1, adp: 11.0, rank: 5, value: 84, status: &apos;healthy&apos;, projectedPoints: 310 },
  { id: &apos;33&apos;, name: &apos;A.J. Brown&apos;, position: &apos;WR&apos;, team: &apos;PHI&apos;, age: 28, tier: 1, adp: 12.0, rank: 6, value: 83, status: &apos;healthy&apos;, projectedPoints: 305 },
  { id: &apos;34&apos;, name: &apos;Puka Nacua&apos;, position: &apos;WR&apos;, team: &apos;LAR&apos;, age: 24, tier: 1, adp: 13.0, rank: 7, value: 82, status: &apos;healthy&apos;, projectedPoints: 300 },
  { id: &apos;35&apos;, name: &apos;Garrett Wilson&apos;, position: &apos;WR&apos;, team: &apos;NYJ&apos;, age: 25, tier: 1, adp: 14.0, rank: 8, value: 81, status: &apos;healthy&apos;, projectedPoints: 295 },
  { id: &apos;36&apos;, name: &apos;Chris Olave&apos;, position: &apos;WR&apos;, team: &apos;NO&apos;, age: 25, tier: 2, adp: 16.0, rank: 9, value: 79, status: &apos;healthy&apos;, projectedPoints: 285 },
  { id: &apos;37&apos;, name: &apos;Davante Adams&apos;, position: &apos;WR&apos;, team: &apos;NYJ&apos;, age: 32, tier: 2, adp: 17.0, rank: 10, value: 77, status: &apos;healthy&apos;, projectedPoints: 280 },
  { id: &apos;38&apos;, name: &apos;DK Metcalf&apos;, position: &apos;WR&apos;, team: &apos;SEA&apos;, age: 27, tier: 2, adp: 19.0, rank: 11, value: 75, status: &apos;healthy&apos;, projectedPoints: 275 },
  { id: &apos;39&apos;, name: &apos;Mike Evans&apos;, position: &apos;WR&apos;, team: &apos;TB&apos;, age: 31, tier: 2, adp: 21.0, rank: 12, value: 73, status: &apos;healthy&apos;, projectedPoints: 270 },
  { id: &apos;40&apos;, name: &apos;Brandon Aiyuk&apos;, position: &apos;WR&apos;, team: &apos;SF&apos;, age: 27, tier: 2, adp: 23.0, rank: 13, value: 71, status: &apos;healthy&apos;, projectedPoints: 265 },
  { id: &apos;41&apos;, name: &apos;Stefon Diggs&apos;, position: &apos;WR&apos;, team: &apos;HOU&apos;, age: 31, tier: 2, adp: 25.0, rank: 14, value: 69, status: &apos;healthy&apos;, projectedPoints: 260 },
  { id: &apos;42&apos;, name: &apos;Deebo Samuel&apos;, position: &apos;WR&apos;, team: &apos;SF&apos;, age: 29, tier: 2, adp: 27.0, rank: 15, value: 67, status: &apos;healthy&apos;, projectedPoints: 255 },
  { id: &apos;43&apos;, name: &apos;Marvin Harrison Jr.&apos;, position: &apos;WR&apos;, team: &apos;ARI&apos;, age: 23, tier: 2, adp: 29.0, rank: 16, value: 65, status: &apos;healthy&apos;, projectedPoints: 250 },
  { id: &apos;44&apos;, name: &apos;DJ Moore&apos;, position: &apos;WR&apos;, team: &apos;CHI&apos;, age: 28, tier: 2, adp: 31.0, rank: 17, value: 63, status: &apos;healthy&apos;, projectedPoints: 245 },
  { id: &apos;45&apos;, name: &apos;Nico Collins&apos;, position: &apos;WR&apos;, team: &apos;HOU&apos;, age: 26, tier: 2, adp: 33.0, rank: 18, value: 61, status: &apos;healthy&apos;, projectedPoints: 240 },

  // Tight Ends
  { id: &apos;46&apos;, name: &apos;Travis Kelce&apos;, position: &apos;TE&apos;, team: &apos;KC&apos;, age: 35, tier: 1, adp: 34.0, rank: 1, value: 60, status: &apos;healthy&apos;, projectedPoints: 235 },
  { id: &apos;47&apos;, name: &apos;Sam LaPorta&apos;, position: &apos;TE&apos;, team: &apos;DET&apos;, age: 24, tier: 1, adp: 36.0, rank: 2, value: 58, status: &apos;healthy&apos;, projectedPoints: 220 },
  { id: &apos;48&apos;, name: &apos;Mark Andrews&apos;, position: &apos;TE&apos;, team: &apos;BAL&apos;, age: 30, tier: 2, adp: 42.0, rank: 3, value: 55, status: &apos;healthy&apos;, projectedPoints: 210 },
  { id: &apos;49&apos;, name: &apos;Trey McBride&apos;, position: &apos;TE&apos;, team: &apos;ARI&apos;, age: 25, tier: 2, adp: 45.0, rank: 4, value: 53, status: &apos;healthy&apos;, projectedPoints: 200 },
  { id: &apos;50&apos;, name: &apos;Dalton Kincaid&apos;, position: &apos;TE&apos;, team: &apos;BUF&apos;, age: 25, tier: 2, adp: 48.0, rank: 5, value: 51, status: &apos;healthy&apos;, projectedPoints: 195 },
  { id: &apos;51&apos;, name: &apos;George Kittle&apos;, position: &apos;TE&apos;, team: &apos;SF&apos;, age: 31, tier: 2, adp: 50.0, rank: 6, value: 49, status: &apos;healthy&apos;, projectedPoints: 190 },
  { id: &apos;52&apos;, name: &apos;Kyle Pitts&apos;, position: &apos;TE&apos;, team: &apos;ATL&apos;, age: 24, tier: 3, adp: 55.0, rank: 7, value: 47, status: &apos;healthy&apos;, projectedPoints: 185 },
  { id: &apos;53&apos;, name: &apos;Evan Engram&apos;, position: &apos;TE&apos;, team: &apos;JAX&apos;, age: 30, tier: 3, adp: 60.0, rank: 8, value: 45, status: &apos;healthy&apos;, projectedPoints: 180 },
  { id: &apos;54&apos;, name: &apos;T.J. Hockenson&apos;, position: &apos;TE&apos;, team: &apos;MIN&apos;, age: 28, tier: 3, adp: 62.0, rank: 9, value: 43, status: &apos;healthy&apos;, projectedPoints: 175 },
  { id: &apos;55&apos;, name: &apos;Dallas Goedert&apos;, position: &apos;TE&apos;, team: &apos;PHI&apos;, age: 30, tier: 3, adp: 65.0, rank: 10, value: 41, status: &apos;healthy&apos;, projectedPoints: 170 },

  // More RBs (depth)
  { id: &apos;56&apos;, name: &apos;Aaron Jones&apos;, position: &apos;RB&apos;, team: &apos;MIN&apos;, age: 30, tier: 3, adp: 35.0, rank: 16, value: 62, status: &apos;healthy&apos;, projectedPoints: 230 },
  { id: &apos;57&apos;, name: &apos;Alvin Kamara&apos;, position: &apos;RB&apos;, team: &apos;NO&apos;, age: 30, tier: 3, adp: 37.0, rank: 17, value: 60, status: &apos;healthy&apos;, projectedPoints: 225 },
  { id: &apos;58&apos;, name: &apos;Rhamondre Stevenson&apos;, position: &apos;RB&apos;, team: &apos;NE&apos;, age: 27, tier: 3, adp: 39.0, rank: 18, value: 58, status: &apos;healthy&apos;, projectedPoints: 220 },
  { id: &apos;59&apos;, name: &apos;Tony Pollard&apos;, position: &apos;RB&apos;, team: &apos;TEN&apos;, age: 28, tier: 3, adp: 41.0, rank: 19, value: 56, status: &apos;healthy&apos;, projectedPoints: 215 },
  { id: &apos;60&apos;, name: &apos;James Conner&apos;, position: &apos;RB&apos;, team: &apos;ARI&apos;, age: 30, tier: 3, adp: 43.0, rank: 20, value: 54, status: &apos;healthy&apos;, projectedPoints: 210 },
  { id: &apos;61&apos;, name: &apos;Najee Harris&apos;, position: &apos;RB&apos;, team: &apos;PIT&apos;, age: 27, tier: 3, adp: 44.0, rank: 21, value: 52, status: &apos;healthy&apos;, projectedPoints: 205 },
  { id: &apos;62&apos;, name: &apos;David Montgomery&apos;, position: &apos;RB&apos;, team: &apos;DET&apos;, age: 28, tier: 3, adp: 46.0, rank: 22, value: 50, status: &apos;healthy&apos;, projectedPoints: 200 },
  { id: &apos;63&apos;, name: &apos;Brian Robinson Jr.&apos;, position: &apos;RB&apos;, team: &apos;WAS&apos;, age: 26, tier: 4, adp: 48.0, rank: 23, value: 48, status: &apos;healthy&apos;, projectedPoints: 195 },
  { id: &apos;64&apos;, name: &apos;Jaylen Warren&apos;, position: &apos;RB&apos;, team: &apos;PIT&apos;, age: 26, tier: 4, adp: 51.0, rank: 24, value: 46, status: &apos;healthy&apos;, projectedPoints: 190 },
  { id: &apos;65&apos;, name: &apos;Zack Moss&apos;, position: &apos;RB&apos;, team: &apos;CIN&apos;, age: 27, tier: 4, adp: 53.0, rank: 25, value: 44, status: &apos;healthy&apos;, projectedPoints: 185 },

  // More WRs (depth)
  { id: &apos;66&apos;, name: &apos;Cooper Kupp&apos;, position: &apos;WR&apos;, team: &apos;LAR&apos;, age: 31, tier: 3, adp: 38.0, rank: 19, value: 59, status: &apos;healthy&apos;, projectedPoints: 235 },
  { id: &apos;67&apos;, name: &apos;DeVonta Smith&apos;, position: &apos;WR&apos;, team: &apos;PHI&apos;, age: 26, tier: 3, adp: 40.0, rank: 20, value: 57, status: &apos;healthy&apos;, projectedPoints: 230 },
  { id: &apos;68&apos;, name: &apos;Michael Pittman Jr.&apos;, position: &apos;WR&apos;, team: &apos;IND&apos;, age: 27, tier: 3, adp: 42.0, rank: 21, value: 55, status: &apos;healthy&apos;, projectedPoints: 225 },
  { id: &apos;69&apos;, name: &apos;Calvin Ridley&apos;, position: &apos;WR&apos;, team: &apos;TEN&apos;, age: 30, tier: 3, adp: 44.0, rank: 22, value: 53, status: &apos;healthy&apos;, projectedPoints: 220 },
  { id: &apos;70&apos;, name: &apos;Jaylen Waddle&apos;, position: &apos;WR&apos;, team: &apos;MIA&apos;, age: 26, tier: 3, adp: 46.0, rank: 23, value: 51, status: &apos;healthy&apos;, projectedPoints: 215 },
  { id: &apos;71&apos;, name: &apos;Amari Cooper&apos;, position: &apos;WR&apos;, team: &apos;BUF&apos;, age: 31, tier: 3, adp: 48.0, rank: 24, value: 49, status: &apos;healthy&apos;, projectedPoints: 210 },
  { id: &apos;72&apos;, name: &apos;Keenan Allen&apos;, position: &apos;WR&apos;, team: &apos;CHI&apos;, age: 33, tier: 3, adp: 50.0, rank: 25, value: 47, status: &apos;healthy&apos;, projectedPoints: 205 },
  { id: &apos;73&apos;, name: &apos;Terry McLaurin&apos;, position: &apos;WR&apos;, team: &apos;WAS&apos;, age: 29, tier: 3, adp: 52.0, rank: 26, value: 45, status: &apos;healthy&apos;, projectedPoints: 200 },
  { id: &apos;74&apos;, name: &apos;Drake London&apos;, position: &apos;WR&apos;, team: &apos;ATL&apos;, age: 24, tier: 3, adp: 54.0, rank: 27, value: 43, status: &apos;healthy&apos;, projectedPoints: 195 },
  { id: &apos;75&apos;, name: &apos;Tee Higgins&apos;, position: &apos;WR&apos;, team: &apos;CIN&apos;, age: 26, tier: 3, adp: 56.0, rank: 28, value: 41, status: &apos;healthy&apos;, projectedPoints: 190 },

  // Additional players for depth
  { id: &apos;76&apos;, name: &apos;George Pickens&apos;, position: &apos;WR&apos;, team: &apos;PIT&apos;, age: 24, tier: 4, adp: 58.0, rank: 29, value: 39, status: &apos;healthy&apos;, projectedPoints: 185 },
  { id: &apos;77&apos;, name: &apos;Christian Watson&apos;, position: &apos;WR&apos;, team: &apos;GB&apos;, age: 26, tier: 4, adp: 60.0, rank: 30, value: 37, status: &apos;healthy&apos;, projectedPoints: 180 },
  { id: &apos;78&apos;, name: &apos;Marquise Brown&apos;, position: &apos;WR&apos;, team: &apos;KC&apos;, age: 28, tier: 4, adp: 62.0, rank: 31, value: 35, status: &apos;healthy&apos;, projectedPoints: 175 },
  { id: &apos;79&apos;, name: &apos;Diontae Johnson&apos;, position: &apos;WR&apos;, team: &apos;CAR&apos;, age: 28, tier: 4, adp: 64.0, rank: 32, value: 33, status: &apos;healthy&apos;, projectedPoints: 170 },
  { id: &apos;80&apos;, name: &apos;Zay Flowers&apos;, position: &apos;WR&apos;, team: &apos;BAL&apos;, age: 24, tier: 4, adp: 66.0, rank: 33, value: 31, status: &apos;healthy&apos;, projectedPoints: 165 },

  // Quarterbacks (depth)
  { id: &apos;81&apos;, name: &apos;Kyler Murray&apos;, position: &apos;QB&apos;, team: &apos;ARI&apos;, age: 28, tier: 3, adp: 72.0, rank: 13, value: 60, status: &apos;healthy&apos;, projectedPoints: 300 },
  { id: &apos;82&apos;, name: &apos;Jared Goff&apos;, position: &apos;QB&apos;, team: &apos;DET&apos;, age: 30, tier: 3, adp: 75.0, rank: 14, value: 58, status: &apos;healthy&apos;, projectedPoints: 295 },
  { id: &apos;83&apos;, name: &apos;Brock Purdy&apos;, position: &apos;QB&apos;, team: &apos;SF&apos;, age: 25, tier: 3, adp: 78.0, rank: 15, value: 56, status: &apos;healthy&apos;, projectedPoints: 290 },
  { id: &apos;84&apos;, name: &apos;Caleb Williams&apos;, position: &apos;QB&apos;, team: &apos;CHI&apos;, age: 23, tier: 4, adp: 80.0, rank: 16, value: 54, status: &apos;healthy&apos;, projectedPoints: 285 },
  { id: &apos;85&apos;, name: &apos;Kirk Cousins&apos;, position: &apos;QB&apos;, team: &apos;ATL&apos;, age: 36, tier: 4, adp: 82.0, rank: 17, value: 52, status: &apos;healthy&apos;, projectedPoints: 280 },
  { id: &apos;86&apos;, name: &apos;Aaron Rodgers&apos;, position: &apos;QB&apos;, team: &apos;NYJ&apos;, age: 41, tier: 4, adp: 85.0, rank: 18, value: 50, status: &apos;healthy&apos;, projectedPoints: 275 },
  { id: &apos;87&apos;, name: &apos;Deshaun Watson&apos;, position: &apos;QB&apos;, team: &apos;CLE&apos;, age: 29, tier: 4, adp: 88.0, rank: 19, value: 48, status: &apos;healthy&apos;, projectedPoints: 270 },
  { id: &apos;88&apos;, name: &apos;Jayden Daniels&apos;, position: &apos;QB&apos;, team: &apos;WAS&apos;, age: 24, tier: 4, adp: 90.0, rank: 20, value: 46, status: &apos;healthy&apos;, projectedPoints: 265 },

  // Kickers
  { id: &apos;89&apos;, name: &apos;Justin Tucker&apos;, position: &apos;K&apos;, team: &apos;BAL&apos;, age: 35, tier: 1, adp: 120.0, rank: 1, value: 20, status: &apos;healthy&apos;, projectedPoints: 150 },
  { id: &apos;90&apos;, name: &apos;Harrison Butker&apos;, position: &apos;K&apos;, team: &apos;KC&apos;, age: 29, tier: 1, adp: 125.0, rank: 2, value: 18, status: &apos;healthy&apos;, projectedPoints: 145 },
  { id: &apos;91&apos;, name: &apos;Tyler Bass&apos;, position: &apos;K&apos;, team: &apos;BUF&apos;, age: 28, tier: 2, adp: 130.0, rank: 3, value: 16, status: &apos;healthy&apos;, projectedPoints: 140 },
  { id: &apos;92&apos;, name: &apos;Jake Moody&apos;, position: &apos;K&apos;, team: &apos;SF&apos;, age: 25, tier: 2, adp: 135.0, rank: 4, value: 14, status: &apos;healthy&apos;, projectedPoints: 135 },
  { id: &apos;93&apos;, name: &apos;Brandon Aubrey&apos;, position: &apos;K&apos;, team: &apos;DAL&apos;, age: 29, tier: 2, adp: 140.0, rank: 5, value: 12, status: &apos;healthy&apos;, projectedPoints: 130 },

  // Defenses
  { id: &apos;94&apos;, name: &apos;Baltimore Ravens&apos;, position: &apos;DST&apos;, team: &apos;BAL&apos;, age: 0, tier: 1, adp: 115.0, rank: 1, value: 22, status: &apos;healthy&apos;, projectedPoints: 160 },
  { id: &apos;95&apos;, name: &apos;San Francisco 49ers&apos;, position: &apos;DST&apos;, team: &apos;SF&apos;, age: 0, tier: 1, adp: 118.0, rank: 2, value: 20, status: &apos;healthy&apos;, projectedPoints: 155 },
  { id: &apos;96&apos;, name: &apos;Cleveland Browns&apos;, position: &apos;DST&apos;, team: &apos;CLE&apos;, age: 0, tier: 1, adp: 122.0, rank: 3, value: 18, status: &apos;healthy&apos;, projectedPoints: 150 },
  { id: &apos;97&apos;, name: &apos;Dallas Cowboys&apos;, position: &apos;DST&apos;, team: &apos;DAL&apos;, age: 0, tier: 2, adp: 128.0, rank: 4, value: 16, status: &apos;healthy&apos;, projectedPoints: 145 },
  { id: &apos;98&apos;, name: &apos;New York Jets&apos;, position: &apos;DST&apos;, team: &apos;NYJ&apos;, age: 0, tier: 2, adp: 132.0, rank: 5, value: 14, status: &apos;healthy&apos;, projectedPoints: 140 },

  // More depth players
  { id: &apos;99&apos;, name: &apos;Jonathon Brooks&apos;, position: &apos;RB&apos;, team: &apos;CAR&apos;, age: 22, tier: 4, adp: 95.0, rank: 26, value: 42, status: &apos;healthy&apos;, projectedPoints: 180 },
  { id: &apos;100&apos;, name: &apos;Tyjae Spears&apos;, position: &apos;RB&apos;, team: &apos;TEN&apos;, age: 24, tier: 4, adp: 98.0, rank: 27, value: 40, status: &apos;healthy&apos;, projectedPoints: 175 }
];

// Helper functions for player queries
export const getPlayersByPosition = (position: string): Player[] => {
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