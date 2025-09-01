/**
 * Players View - Professional NFL player browsing experience
 * Features advanced filtering, beautiful cards, and smooth animations
 */

import React, { useState, useMemo, useEffect } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { useAppState } from &apos;../contexts/AppContext&apos;;
import { Player } from &apos;../types&apos;;
import { NFL_TEAMS, searchPlayers } from &apos;../data/nflPlayers&apos;;
import { SearchIcon } from &apos;../components/icons/SearchIcon&apos;;
import { TrendingUpIcon } from &apos;../components/icons/TrendingUpIcon&apos;;
import { TrendingDownIcon } from &apos;../components/icons/TrendingDownIcon&apos;;
import { StarIcon } from &apos;../components/icons/StarIcon&apos;;
import { FireIcon } from &apos;../components/icons/FireIcon&apos;;
import { InjuryIcon } from &apos;../components/icons/InjuryIcon&apos;;
import { ChartBarIcon } from &apos;../components/icons/ChartBarIcon&apos;;
import { AdjustmentsIcon as FilterIcon } from &apos;../components/icons/AdjustmentsIcon&apos;;
import { LayoutIcon as GridIcon } from &apos;../components/icons/LayoutIcon&apos;;
import { ListChecksIcon as ListIcon } from &apos;../components/icons/ListChecksIcon&apos;;
import PlayerDetailModal from &apos;../components/player/PlayerDetailModal&apos;;
import { sportsIOPlayerService } from &apos;../services/sportsIOPlayerService&apos;;

const PlayersView: React.FC = () => {
}
  const { state, dispatch } = useAppState();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [searchQuery, setSearchQuery] = useState(&apos;&apos;);
  const [selectedPosition, setSelectedPosition] = useState(&apos;ALL&apos;);
  const [selectedTeam, setSelectedTeam] = useState(&apos;ALL&apos;);
  const [injuryFilter, setInjuryFilter] = useState(&apos;ALL&apos;);
  const [sortBy, setSortBy] = useState<&apos;rank&apos; | &apos;name&apos; | &apos;team&apos; | &apos;points&apos; | &apos;trending&apos;>(&apos;rank&apos;);
  const [viewMode, setViewMode] = useState<&apos;grid&apos; | &apos;list&apos;>(&apos;grid&apos;);
  const [showFilters, setShowFilters] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [comparePlayers, setComparePlayers] = useState<Player[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });

  const league = state.leagues[0];
  const userTeam = league?.teams.find((team: any) => team.owner.id === state.user?.id);
  const allPlayers = league?.allPlayers || [];

  // Load live player data from Sports.io API
  useEffect(() => {
}
    const loadLivePlayerData = async () => {
}
      if (!league) return;
      
      try {
}
        console.log(&apos;🚀 Loading live player data from Sports.io...&apos;);
        const livePlayers = await sportsIOPlayerService.getAllPlayers();
        
        if (livePlayers && livePlayers.length > 0) {
}
          dispatch({
}
            type: &apos;UPDATE_LEAGUE_PLAYERS&apos;,
            payload: {
}
              leagueId: league.id,
              players: livePlayers
            }
          });
          
          dispatch({
}
            type: &apos;ADD_NOTIFICATION&apos;,
            payload: {
}
              message: `✅ Loaded ${livePlayers.length} players from Sports.io API`,
              type: &apos;SUCCESS&apos;
            }
          });
        }
      } catch (error) {
}
        console.error(&apos;Error loading player data:&apos;, error);
        dispatch({
}
          type: &apos;ADD_NOTIFICATION&apos;,
          payload: {
}
            message: &apos;Failed to load player data&apos;,
            type: &apos;ERROR&apos;
          }
        });
      }
    };

    loadLivePlayerData();
  }, [league, dispatch]);

  // Player Card Component
  const PlayerCard = ({ player, index }: { player: Player; index: number }) => {
}
    const config = getPositionConfig(player.position);
    const injuryConfig = getInjuryConfig(player.injuryStatus);
    const trendingScore = getTrendingScore(player);
    const isSelected = selectedPlayer?.id === player.id;
    const isComparing = comparePlayers.find((p: any) => p.id === player.id);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ delay: index * 0.02 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        onClick={() => handlePlayerSelect(player)}
        className="group cursor-pointer"
      >
        {/* Card Container with Glassmorphism */}
        <div className={`
}
          relative overflow-hidden rounded-2xl
          bg-gradient-to-br from-slate-800/40 to-slate-900/40
          backdrop-blur-xl border transition-all duration-300
          ${isSelected ? &apos;border-blue-400/50 shadow-[0_0_30px_rgba(59,130,246,0.3)]&apos; : &apos;border-white/5 hover:border-white/10&apos;}
          ${isComparing ? &apos;ring-2 ring-yellow-400/50&apos; : &apos;&apos;}
          ${viewMode === &apos;grid&apos; ? &apos;p-6&apos; : &apos;p-4&apos;}
        `}>
          {/* Background Gradient Overlay */}
          <div className={`
}
            absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
            bg-gradient-to-br ${config.color}
          `} style={{ opacity: 0.05 }} />

          {/* Trending Badge */}
          {trendingScore > 75 && (
}
            <div className="absolute top-3 right-3 z-10">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"
              >
                <FireIcon className="h-3 w-3" />
//                 HOT
              </motion.div>
            </div>
          )}

          {viewMode === &apos;grid&apos; ? (
}
            // Grid View Card
            <>
              {/* Position Badge */}
              <div className="flex justify-between items-start mb-4">
                <div className={`
}
                  px-3 py-1 rounded-lg font-bold text-sm
                  bg-gradient-to-r ${config.color} text-white shadow-lg
                `}>
                  {player.position}
                </div>
                <div className="text-2xl">{config.icon}</div>
              </div>

              {/* Player Info */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                  {player.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="font-medium">{NFL_TEAMS[player.team as keyof typeof NFL_TEAMS]?.name || player.team}</span>
                  <span>•</span>
                  <span>#{player.jerseyNumber}</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className={`p-3 rounded-lg ${config.bgColor} border ${config.borderColor}`}>
                  <div className="text-2xl font-bold text-white">#{player.fantasyRank}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Rank</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="text-2xl font-bold text-white">{player.projectedPoints.toFixed(0)}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Proj Pts</div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Age</span>
                  <span className="text-white font-medium">{player.age} years</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Bye Week</span>
                  <span className="text-white font-medium">Week {player.byeWeek}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Status</span>
                  <span className={`font-medium flex items-center gap-1 ${injuryConfig.color}`}>
                    <span className="text-xs">{injuryConfig.icon}</span>
                    {player.injuryStatus}
                  </span>
                </div>
              </div>

              {/* Trending Indicator */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                <div className="flex items-center gap-2">
                  {trendingScore > 60 ? (
}
                    <TrendingUpIcon className="h-4 w-4 text-green-400" />
                  ) : trendingScore < 40 ? (
                    <TrendingDownIcon className="h-4 w-4 text-red-400" />
                  ) : (
                    <div className="h-4 w-4 rounded-full bg-gray-600" />
                  )}
                  <span className="text-xs text-gray-400">Trending</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
}
                    <StarIcon>
                      key={i} 
                      className={`h-3 w-3 ${i < Math.floor(player.fantasyRank / 20) ? &apos;text-yellow-400&apos; : &apos;text-gray-600&apos;}`} 
                    />
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-slate-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={(e: any) => {
}
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddToRoster(player);
                  }}
                  className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm transition-colors"
                  autoComplete="off"
                  data-form="false"
                >
                  Add to Roster
                </button>
              </div>
            </>
          ) : (
            // List View Card
            <div className="flex items-center gap-4">
              {/* Position & Icon */}
              <div className="flex items-center gap-3">
                <div className="text-2xl">{config.icon}</div>
                <div className={`
}
                  px-2 py-1 rounded font-bold text-xs
                  bg-gradient-to-r ${config.color} text-white
                `}>
                  {player.position}
                </div>
              </div>

              {/* Player Info */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                  {player.name}
                </h3>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <span>{NFL_TEAMS[player.team as keyof typeof NFL_TEAMS]?.name || player.team}</span>
                  <span>#{player.jerseyNumber}</span>
                  <span className={`${injuryConfig.color}`}>{player.injuryStatus}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-xl font-bold text-white">#{player.fantasyRank}</div>
                  <div className="text-xs text-gray-400">Rank</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{player.projectedPoints.toFixed(0)}</div>
                  <div className="text-xs text-gray-400">Proj</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{player.byeWeek}</div>
                  <div className="text-xs text-gray-400">Bye</div>
                </div>
              </div>

              {/* Actions */}
              <button
                type="button"
                onClick={(e: any) => {
}
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddToRoster(player);
                }}
                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg font-medium text-sm transition-colors border border-blue-500/30"
                autoComplete="off"
                data-form="false"
              >
//                 Add
              </button>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 p-4">
        {/* Navigation Header */}
        <div className="nav-header mb-4">
          <button
            onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;DASHBOARD&apos; })}
            className="back-btn"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  Player Universe
                </h1>
                <p className="text-gray-400 text-lg">
                  Discover elite talent • Advanced analytics • Real-time insights
                </p>
              </div>
              <div className="flex items-center gap-4">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-white/10 backdrop-blur-xl"
                >
                  <div className="text-2xl font-bold text-white">{filteredPlayers.length}</div>
                  <div className="text-xs text-gray-400">Available Players</div>
                </motion.div>
              </div>
            </div>

            {/* Advanced Search Bar */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, team, college, or position..."
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
}
                <button
                  onClick={() => setSearchQuery(&apos;&apos;)}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {/* Position Filter */}
              <select
                value={selectedPosition}
                onChange={(e: any) => setSelectedPosition(e.target.value)}
              >
                <option value="ALL">All Positions</option>
                {Object.keys(positionConfig).map((pos: any) => (
}
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>

              {/* Team Filter */}
              <select
                value={selectedTeam}
                onChange={(e: any) => setSelectedTeam(e.target.value)}
              >
                <option value="ALL">All Teams</option>
                {Object.entries(NFL_TEAMS).map(([key, team]) => (
}
                  <option key={key} value={key}>{team.name}</option>
                ))}
              </select>

              {/* Injury Filter */}
              <select
                value={injuryFilter}
                onChange={(e: any) => setInjuryFilter(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="HEALTHY">Healthy</option>
                <option value="QUESTIONABLE">Questionable</option>
                <option value="DOUBTFUL">Doubtful</option>
                <option value="OUT">Out</option>
                <option value="IR">IR</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value as any)}
              >
                <option value="rank">Fantasy Rank</option>
                <option value="points">Projected Points</option>
                <option value="trending">Trending</option>
                <option value="name">Name</option>
                <option value="team">Team</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => setViewMode(&apos;grid&apos;)}
                >
                  <GridIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode(&apos;list&apos;)}
                >
                  <ListIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Compare Mode Toggle */}
              <button
                onClick={() => {
}
                  setCompareMode(!compareMode);
                  setComparePlayers([]);
                }}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
}
//                   compareMode 
                    ? &apos;bg-yellow-500/20 text-yellow-400 border border-yellow-500/30&apos; 
                    : &apos;bg-slate-800/50 text-gray-400 border border-white/10 hover:border-white/20&apos;
                }`}
              >
                {compareMode ? `Comparing (${comparePlayers.length}/3)` : &apos;Compare Players&apos;}
              </button>
            </div>
          </motion.div>

          {/* Player Grid/List */}
          <div className={`
}
            ${viewMode === &apos;grid&apos; 
}
              ? &apos;grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6&apos; 
              : &apos;space-y-3&apos;}
            mb-8
          `}>
            <AnimatePresence mode="popLayout">
              {filteredPlayers.slice(0, 50).map((player, index) => (
}
                <PlayerCard key={player.id} player={player} index={index} />
              ))}
            </AnimatePresence>
          </div>

          {/* No Results */}
          {filteredPlayers.length === 0 && (
}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">No Players Found</h3>
              <p className="text-gray-400">Try adjusting your filters or search query</p>
            </motion.div>
          )}

          {/* Compare Panel */}
          {compareMode && comparePlayers.length > 0 && (
}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
            >
              <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-4">Player Comparison</h3>
                <div className="flex items-center gap-4">
                  {comparePlayers.map((player: any) => (
}
                    <div key={player.id} className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg">
                      <span className="text-white font-medium">{player.name}</span>
                      <button
                        onClick={() => setComparePlayers(comparePlayers.filter((p: any) => p.id !== player.id))}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {comparePlayers.length >= 2 && (
}
                    <button
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                      onClick={() => {
}
                        // Open comparison modal
                      }}
                    >
                      Compare Now
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Player Detail Modal */}
      {selectedPlayer && (
}
        <PlayerDetailModal>
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          playerNotes={state.playerNotes || {}}
          dispatch={dispatch}
          league={league}
          playerAvatars={state.playerAvatars || {}}
        />
      )}
    </div>
  );
};

export default PlayersView;