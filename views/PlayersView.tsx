/**
 * Players View - Browse and search all NFL players
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../contexts/AppContext';
import PlayerSearch from '../components/players/PlayerSearch';
import { Player } from '../types';
import { NFL_TEAMS } from '../data/nflPlayers';

const PlayersView: React.FC = () => {
  const { state, dispatch } = useAppState();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const league = state.leagues[0];
  const userTeam = league?.teams.find(team => team.owner.id === state.user?.id);

  const handlePlayerSelect = (player: Player) => {
    setSelectedPlayer(player);
  };

  const handleAddToRoster = (player: Player) => {
    if (userTeam) {
      dispatch({
        type: 'ADD_PLAYER_TO_ROSTER',
        payload: { teamId: userTeam.id, player }
      });
      
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: `${player.name} added to your roster!`,
          type: 'SUCCESS'
        }
      });
    }
  };

  const getInjuryStatusColor = (status: string) => {
    switch (status) {
      case 'HEALTHY': return 'text-green-400';
      case 'QUESTIONABLE': return 'text-yellow-400';
      case 'DOUBTFUL': return 'text-orange-400';
      case 'OUT': return 'text-red-400';
      case 'IR': return 'text-red-600';
      default: return 'text-gray-400';
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'QB': return 'bg-red-600';
      case 'RB': return 'bg-green-600';
      case 'WR': return 'bg-blue-600';
      case 'TE': return 'bg-yellow-600';
      case 'K': return 'bg-purple-600';
      case 'DST': return 'bg-gray-600';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' })}
            className="mb-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            ← Back to Dashboard
          </button>
          
          <h1 className="text-4xl font-bold text-white mb-2">NFL Players</h1>
          <p className="text-slate-300">Browse and search all available players</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Player Search */}
          <div className="lg:col-span-2">
            <PlayerSearch
              onPlayerSelect={handlePlayerSelect}
              showAddButton={true}
            />
          </div>

          {/* Player Details */}
          <div className="lg:col-span-1">
            {selectedPlayer ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
              >
                <div className="text-center mb-6">
                  <div className={`${getPositionColor(selectedPlayer.position)} text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-3`}>
                    {selectedPlayer.position}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {selectedPlayer.name}
                  </h2>
                  
                  <div className="flex items-center justify-center gap-2 text-slate-400 mb-2">
                    <span>{NFL_TEAMS[selectedPlayer.team as keyof typeof NFL_TEAMS]?.name || selectedPlayer.team}</span>
                    <span>•</span>
                    <span>#{selectedPlayer.jerseyNumber}</span>
                  </div>
                  
                  <div className={`${getInjuryStatusColor(selectedPlayer.injuryStatus)} font-medium`}>
                    {selectedPlayer.injuryStatus}
                  </div>
                </div>

                {/* Player Stats */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                      <div className="text-2xl font-bold text-white">#{selectedPlayer.fantasyRank}</div>
                      <div className="text-sm text-slate-400">Fantasy Rank</div>
                    </div>
                    <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                      <div className="text-2xl font-bold text-white">{selectedPlayer.projectedPoints.toFixed(1)}</div>
                      <div className="text-sm text-slate-400">Projected Pts</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                      <div className="text-lg font-bold text-white">{selectedPlayer.age}</div>
                      <div className="text-sm text-slate-400">Age</div>
                    </div>
                    <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                      <div className="text-lg font-bold text-white">Week {selectedPlayer.byeWeek}</div>
                      <div className="text-sm text-slate-400">Bye Week</div>
                    </div>
                  </div>

                  {/* Physical Stats */}
                  <div className="border-t border-slate-600 pt-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Physical</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Height:</span>
                        <span className="text-white">{selectedPlayer.height}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Weight:</span>
                        <span className="text-white">{selectedPlayer.weight} lbs</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">College:</span>
                        <span className="text-white">{selectedPlayer.college}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Experience:</span>
                        <span className="text-white">{selectedPlayer.experience} years</span>
                      </div>
                    </div>
                  </div>

                  {/* 2023 Stats */}
                  {selectedPlayer.stats && (
                    <div className="border-t border-slate-600 pt-4">
                      <h3 className="text-lg font-semibold text-white mb-3">2023 Stats</h3>
                      <div className="space-y-2 text-sm">
                        {selectedPlayer.position === 'QB' && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Pass Yards:</span>
                              <span className="text-white">{selectedPlayer.stats.passingYards?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Pass TDs:</span>
                              <span className="text-white">{selectedPlayer.stats.passingTDs}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">INTs:</span>
                              <span className="text-white">{selectedPlayer.stats.interceptions}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Rush Yards:</span>
                              <span className="text-white">{selectedPlayer.stats.rushingYards?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Rush TDs:</span>
                              <span className="text-white">{selectedPlayer.stats.rushingTDs}</span>
                            </div>
                          </>
                        )}
                        
                        {(selectedPlayer.position === 'RB' || selectedPlayer.position === 'WR' || selectedPlayer.position === 'TE') && (
                          <>
                            {selectedPlayer.stats.rushingYards !== undefined && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Rush Yards:</span>
                                  <span className="text-white">{selectedPlayer.stats.rushingYards?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Rush TDs:</span>
                                  <span className="text-white">{selectedPlayer.stats.rushingTDs}</span>
                                </div>
                              </>
                            )}
                            <div className="flex justify-between">
                              <span className="text-slate-400">Receptions:</span>
                              <span className="text-white">{selectedPlayer.stats.receptions}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Rec Yards:</span>
                              <span className="text-white">{selectedPlayer.stats.receivingYards?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Rec TDs:</span>
                              <span className="text-white">{selectedPlayer.stats.receivingTDs}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={() => handleAddToRoster(selectedPlayer)}
                    className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Add to Roster
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <div className="text-center text-slate-400">
                  <div className="text-4xl mb-4">👈</div>
                  <p>Select a player to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayersView;