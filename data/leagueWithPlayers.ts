/**
 * League data with NFL players integrated
 */

import { MAIN_LEAGUE } from './leagueData';
import { NFL_PLAYERS_2024 } from './nflPlayers';
import { League } from '../types';

// Create league with NFL players
export const LEAGUE_WITH_PLAYERS: League = {
  ...MAIN_LEAGUE,
  allPlayers: NFL_PLAYERS_2024
};

export default LEAGUE_WITH_PLAYERS;