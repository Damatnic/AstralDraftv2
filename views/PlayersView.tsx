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

  return (
    <div className="min-h-screen p-4">
      {/* Navigation Header */}
      <div className="nav-header mb-4">
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' })}
          className="back-btn"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1>NFL Players</h1>
          <p className="page-subtitle">Browse and search all available players</p>
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
                className="card"
              >
                <div className="text-center mb-6">
                  <div className={`position-badge position-${selectedPlayer.position.toLowerCase()} mb-3`}>
                    {selectedPlayer.position}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {selectedPlayer.name}
                  </h2>
                  
                  <div className="flex items-center justify-center gap-2 text-secondary mb-2">
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
                    <div className="stat-item">
                      <div className="stat-value text-2xl">#{selectedPlayer.fantasyRank}</div>
                      <div className="stat-label">Fantasy Rank</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value text-2xl">{selectedPlayer.projectedPoints.toFixed(1)}</div>
                      <div className="stat-label">Projected Pts</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="stat-item">
                      <div className="stat-value text-lg">{selectedPlayer.age}</div>
                      <div className="stat-label">Age</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value text-lg">Week {selectedPlayer.byeWeek}</div>
                      <div className="stat-label">Bye Week</div>
                    </div>
                  </div>

                  {/* Physical Stats */}
                  <div className="border-t border-slate-600 pt-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Physical</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-secondary">Height:</span>
                        <span className="text-white">{selectedPlayer.height}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary">Weight:</span>
                        <span className="text-white">{selectedPlayer.weight} lbs</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary">College:</span>
                        <span className="text-white">{selectedPlayer.college}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary">Experience:</span>
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
                              <span className="text-secondary">Pass Yards:</span>
                              <span className="text-white">{selectedPlayer.stats.passingYards?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-secondary">Pass TDs:</span>
                              <span className="text-white">{selectedPlayer.stats.passingTDs}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-secondary">INTs:</span>
                              <span className="text-white">{selectedPlayer.stats.interceptions}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-secondary">Rush Yards:</span>
                              <span className="text-white">{selectedPlayer.stats.rushingYards?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-secondary">Rush TDs:</span>
                              <span className="text-white">{selectedPlayer.stats.rushingTDs}</span>
                            </div>
                          </>
                        )}
                        
                        {(selectedPlayer.position === 'RB' || selectedPlayer.position === 'WR' || selectedPlayer.position === 'TE') && (
                          <>
                            {selectedPlayer.stats.rushingYards !== undefined && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-secondary">Rush Yards:</span>
                                  <span className="text-white">{selectedPlayer.stats.rushingYards?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-secondary">Rush TDs:</span>
                                  <span className="text-white">{selectedPlayer.stats.rushingTDs}</span>
                                </div>
                              </>
                            )}
                            <div className="flex justify-between">
                              <span className="text-secondary">Receptions:</span>
                              <span className="text-white">{selectedPlayer.stats.receptions}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-secondary">Rec Yards:</span>
                              <span className="text-white">{selectedPlayer.stats.receivingYards?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-secondary">Rec TDs:</span>
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
                    className="btn w-full mt-6"
                  >
                    Add to Roster
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="card">
                <div className="text-center text-secondary">
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