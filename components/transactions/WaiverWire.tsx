/**
 * Waiver Wire Component
 * Manages free agent pickups and waiver claims
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../../hooks/useAppState';
import { useLeague } from '../../hooks/useLeague';
import { players } from '../../data/players';
import { Player } from '../../types';
import { Search, Plus, TrendingUp, Clock, DollarSign } from 'lucide-react';

interface WaiverClaim {
  id: string;
  playerId: number;
  teamId: number;
  bidAmount: number;
  priority: number;
  status: 'pending' | 'processed' | 'failed';
  timestamp: Date;
}

export const WaiverWire: React.FC = () => {
  const { state, dispatch } = useAppState();
  const { league, myTeam } = useLeague();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedPlayer, setSelectedPlayer] = React.useState<Player | null>(null);
  const [bidAmount, setBidAmount] = React.useState(0);
  const [showBidModal, setShowBidModal] = React.useState(false);
  
  // Get available free agents
  const freeAgents = React.useMemo(() => {
    if (!league) return [];
    
    const rosteredPlayerIds = new Set(
      league.teams.flatMap(team => team.roster.map((p: any) => p.id))
    );
    
    return players.filter((p: any) => !rosteredPlayerIds.has(p.id));
  }, [league]);
  
  // Filter free agents based on search
  const filteredPlayers = React.useMemo(() => {
    if (!searchQuery) return freeAgents.slice(0, 50);
    
    const query = searchQuery.toLowerCase();
    return freeAgents.filter((p: any) => 
      p.name.toLowerCase().includes(query) ||
      p.team.toLowerCase().includes(query) ||
      p.position.toLowerCase().includes(query)
    ).slice(0, 50);
  }, [freeAgents, searchQuery]);
  
  // Get trending players (mock data for now)
  const trendingPlayers = React.useMemo(() => {
    return freeAgents
      .sort((a, b) => (b.projectedPoints || 0) - (a.projectedPoints || 0))
      .slice(0, 5);
  }, [freeAgents]);
  
  const handleAddPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setBidAmount(Math.min(10, myTeam?.faabBudget || 0));
    setShowBidModal(true);
  };
  
  const submitWaiverClaim = () => {
    if (!selectedPlayer || !myTeam || !league) return;
    
    const claim = {
      playerId: selectedPlayer.id,
      teamId: myTeam.id,
      bid: bidAmount,
      playerToDropId: undefined
    };
    
    dispatch({
      type: 'ADD_WAIVER_CLAIM',
      payload: {
        leagueId: league.id,
//         claim
      }
    });
    
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        message: `Waiver claim submitted for ${selectedPlayer.name} ($${bidAmount})`,
        type: 'SUCCESS'
      }
    });
    
    setShowBidModal(false);
    setSelectedPlayer(null);
  };
  
  const getFAABRemaining = () => {
    return myTeam?.faabBudget || 0;
  };
  
  return (
    <div className="p-6 space-y-6 sm:px-4 md:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">Waiver Wire</h2>
          <p className="text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
            FAAB Remaining: ${getFAABRemaining()}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
          <Clock className="w-4 h-4 text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8" />
          <span className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
            Waivers process: Wed 3:00 AM ET
          </span>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="relative sm:px-4 md:px-6 lg:px-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8" />
        <input
          type="text"
          placeholder="Search free agents..."
          value={searchQuery}
          onChange={(e: any) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Trending Players */}
      <div className="bg-[var(--panel-bg)] rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-3 sm:px-4 md:px-6 lg:px-8">
          <TrendingUp className="w-5 h-5 text-cyan-400 sm:px-4 md:px-6 lg:px-8" />
          <h3 className="font-semibold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">Trending Players</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          {trendingPlayers.map((player: any) => (
            <button
              key={player.id}
              onClick={() => handleAddPlayer(player)}
            >
              <div className="font-medium text-sm text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                {player.name}
              </div>
              <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                {player.position} - {player.team}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Free Agents List */}
      <div className="bg-[var(--panel-bg)] rounded-lg overflow-hidden sm:px-4 md:px-6 lg:px-8">
        <table className="w-full sm:px-4 md:px-6 lg:px-8">
          <thead>
            <tr className="border-b border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
              <th className="text-left p-3 text-xs font-medium text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">PLAYER</th>
              <th className="text-left p-3 text-xs font-medium text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">POS</th>
              <th className="text-left p-3 text-xs font-medium text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">TEAM</th>
              <th className="text-center p-3 text-xs font-medium text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">PROJ PTS</th>
              <th className="text-center p-3 text-xs font-medium text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">% ROSTERED</th>
              <th className="text-center p-3 text-xs font-medium text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map((player: any) => (
              <tr key={player.id} className="border-b border-[var(--panel-border)] hover:bg-white/5 sm:px-4 md:px-6 lg:px-8">
                <td className="p-3 sm:px-4 md:px-6 lg:px-8">
                  <div className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{player.name}</div>
                </td>
                <td className="p-3 text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">{player.position}</td>
                <td className="p-3 text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">{player.team}</td>
                <td className="p-3 text-center text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                  {player.projectedPoints?.toFixed(1)}
                </td>
                <td className="p-3 text-center text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                  {Math.floor(Math.random() * 40)}%
                </td>
                <td className="p-3 text-center sm:px-4 md:px-6 lg:px-8">
                  <button
                    onClick={() => handleAddPlayer(player)}
                  >
                    <Plus className="w-4 h-4 inline sm:px-4 md:px-6 lg:px-8" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Bid Modal */}
      {showBidModal && selectedPlayer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 sm:px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[var(--panel-bg)] rounded-lg p-6 max-w-md w-full mx-4 sm:px-4 md:px-6 lg:px-8"
          >
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4 sm:px-4 md:px-6 lg:px-8">
              Submit Waiver Claim
            </h3>
            
            <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
              <div className="bg-black/20 rounded p-3 sm:px-4 md:px-6 lg:px-8">
                <div className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                  {selectedPlayer.name}
                </div>
                <div className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                  {selectedPlayer.position} - {selectedPlayer.team}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                  FAAB Bid Amount
                </label>
                <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                  <DollarSign className="w-5 h-5 text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8" />
                  <input
                    type="number"
                    min="0"
                    max={getFAABRemaining()}
                    value={bidAmount}
                    onChange={(e: any) => setBidAmount(Number(e.target.value))}
                  />
                  <span className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                    / ${getFAABRemaining()}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-3 sm:px-4 md:px-6 lg:px-8">
                <button
                  onClick={() => setShowBidModal(false)}
                >
//                   Cancel
                </button>
                <button
                  onClick={submitWaiverClaim}
                  className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 sm:px-4 md:px-6 lg:px-8"
                 aria-label="Action button">
                  Submit Claim
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const WaiverWireWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <WaiverWire {...props} />
  </ErrorBoundary>
);

export default React.memo(WaiverWireWithErrorBoundary);