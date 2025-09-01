/**
 * Enhanced Waiver Wire System
 * FAAB bidding system with waiver claims and free agency
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../../contexts/AppContext';
import PlayerSearch from '../PlayerSearch';

interface WaiverClaim {
  id: string;
  playerId: string;
  playerName: string;
  position: string;
  team: string;
  claimingTeamId: string;
  claimingTeamName: string;
  bidAmount: number;
  dropPlayerId?: string;
  dropPlayerName?: string;
  priority: number;
  status: 'pending' | 'successful' | 'failed';
  processedAt?: Date;

}

interface WaiverPeriod {
  isActive: boolean;
  nextProcessing: Date;
  currentPeriod: 'waiver' | 'free_agency';
}

const EnhancedWaiverWire: React.FC = () => {
  const { state, dispatch } = useAppState();
  const [selectedTab, setSelectedTab] = useState<'available' | 'claims' | 'faab'>('available');
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [bidAmount, setBidAmount] = useState(0);
  const [dropPlayer, setDropPlayer] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('ALL');

  const league = state.leagues[0];
  const currentUser = state.user;
  const userTeam = league?.teams?.find((team: any) => team.owner.id === currentUser?.id);

  // Simulate waiver period
  const waiverPeriod: WaiverPeriod = {
    isActive: true,
    nextProcessing: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    currentPeriod: 'waiver'
  };

  // Simulate FAAB budgets
  const faabBudgets = useMemo(() => {
    if (!league?.teams) return {};
    
    const budgets: { [teamId: string]: { remaining: number; spent: number } } = {};
    league.teams.forEach((team: any) => {
      budgets[team.id] = {
        remaining: Math.floor(Math.random() * 50) + 50, // $50-$100 remaining
        spent: 100 - (Math.floor(Math.random() * 50) + 50)
      };
    });
    return budgets;
  }, [league?.teams]);

  // Simulate available players (not on any roster)
  const availablePlayers = useMemo(() => {
    const players = [
      { id: 'waiver-1', name: 'Gus Edwards', position: 'RB', team: 'BAL', projectedPoints: 8.5, addPercentage: 45, ownership: 55 },
      { id: 'waiver-2', name: 'Tyler Boyd', position: 'WR', team: 'CIN', projectedPoints: 7.2, addPercentage: 38, ownership: 62 },
      { id: 'waiver-3', name: 'Jamaal Williams', position: 'RB', team: 'NO', projectedPoints: 6.8, addPercentage: 42, ownership: 58 },
      { id: 'waiver-4', name: 'Hunter Renfrow', position: 'WR', team: 'LV', projectedPoints: 6.5, addPercentage: 35, ownership: 65 },
      { id: 'waiver-5', name: 'Tyler Higbee', position: 'TE', team: 'LAR', projectedPoints: 5.8, addPercentage: 28, ownership: 72 },
      { id: 'waiver-6', name: 'Jalen Tolbert', position: 'WR', team: 'DAL', projectedPoints: 5.2, addPercentage: 52, ownership: 48 },
      { id: 'waiver-7', name: 'Justice Hill', position: 'RB', team: 'BAL', projectedPoints: 4.8, addPercentage: 31, ownership: 69 },
      { id: 'waiver-8', name: 'Deon Jackson', position: 'RB', team: 'IND', projectedPoints: 4.5, addPercentage: 29, ownership: 71 },
      { id: 'waiver-9', name: 'Greg Dulcich', position: 'TE', team: 'DEN', projectedPoints: 4.2, addPercentage: 25, ownership: 75 },
      { id: 'waiver-10', name: 'Robbie Anderson', position: 'WR', team: 'MIA', projectedPoints: 4.0, addPercentage: 22, ownership: 78 },
      { id: 'waiver-11', name: 'Mason Rudolph', position: 'QB', team: 'PIT', projectedPoints: 12.5, addPercentage: 15, ownership: 85 },
      { id: 'waiver-12', name: 'Cairo Santos', position: 'K', team: 'CHI', projectedPoints: 7.8, addPercentage: 18, ownership: 82 },
      { id: 'waiver-13', name: 'New York Giants', position: 'DEF', team: 'NYG', projectedPoints: 6.2, addPercentage: 33, ownership: 67 },
      { id: 'waiver-14', name: 'Trey Sermon', position: 'RB', team: 'PHI', projectedPoints: 3.8, addPercentage: 27, ownership: 73 },
      { id: 'waiver-15', name: 'Kendrick Bourne', position: 'WR', team: 'NE', projectedPoints: 3.5, addPercentage: 24, ownership: 76 }
    ];

    return players.filter((player: any) => {
      const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPosition = positionFilter === 'ALL' || player.position === positionFilter;
      return matchesSearch && matchesPosition;
    });
  }, [searchTerm, positionFilter]);

  // Simulate existing waiver claims
  const waiverClaims: WaiverClaim[] = [
    {
      id: 'claim-1',
      playerId: 'waiver-1',
      playerName: 'Gus Edwards',
      position: 'RB',
      team: 'BAL',
      claimingTeamId: userTeam?.id || '',
      claimingTeamName: userTeam?.name || '',
      bidAmount: 15,
      dropPlayerId: 'drop-1',
      dropPlayerName: 'Deon Jackson',
      priority: 1,
      status: 'pending'
    },
    {
      id: 'claim-2',
      playerId: 'waiver-2',
      playerName: 'Tyler Boyd',
      position: 'WR',
      team: 'CIN',
      claimingTeamId: 'team-2',
      claimingTeamName: 'Team 2',
      bidAmount: 12,
      priority: 2,
      status: 'pending'
    }
  ];

  const userBudget = faabBudgets[userTeam?.id || ''] || { remaining: 100, spent: 0 };

  const handlePlaceBid = () => {
    if (!selectedPlayer || !userTeam) return;

    // Simulate placing a waiver claim
    const newClaim: WaiverClaim = {
      id: `claim-${Date.now()}`,
      playerId: selectedPlayer.id,
      playerName: selectedPlayer.name,
      position: selectedPlayer.position,
      team: selectedPlayer.team,
      claimingTeamId: userTeam.id,
      claimingTeamName: userTeam.name,
      bidAmount,
      dropPlayerId: dropPlayer?.id,
      dropPlayerName: dropPlayer?.name,
      priority: waiverClaims.length + 1,
      status: 'pending'
    };

    // In a real app, this would be sent to the backend
    
    setShowBidModal(false);
    setSelectedPlayer(null);
    setBidAmount(0);
    setDropPlayer(null);
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'QB': return 'text-red-400 bg-red-900/20';
      case 'RB': return 'text-green-400 bg-green-900/20';
      case 'WR': return 'text-blue-400 bg-blue-900/20';
      case 'TE': return 'text-yellow-400 bg-yellow-900/20';
      case 'K': return 'text-orange-400 bg-orange-900/20';
      case 'DEF': return 'text-gray-400 bg-gray-900/20';
      default: return 'text-white bg-slate-900/20';
    }
  };

  const getClaimStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-900/20';
      case 'successful': return 'text-green-400 bg-green-900/20';
      case 'failed': return 'text-red-400 bg-red-900/20';
      default: return 'text-slate-400 bg-slate-900/20';
    }
  };

  const tabs = [
    { id: 'available', label: 'Available Players', icon: '👥' },
    { id: 'claims', label: 'My Claims', icon: '📋' },
    { id: 'faab', label: 'FAAB Budgets', icon: '💰' }
  ];

  return (
    <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
        <div>
          <h2 className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">Waiver Wire</h2>
          <p className="text-slate-400 sm:px-4 md:px-6 lg:px-8">
            {waiverPeriod.currentPeriod === 'waiver' ? 'Waiver Period' : 'Free Agency'} • 
            Next Processing: {waiverPeriod.nextProcessing.toLocaleDateString()}
          </p>
        </div>
        
        <div className="text-right sm:px-4 md:px-6 lg:px-8">
          <div className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">FAAB Budget</div>
          <div className="text-2xl font-bold text-green-400 sm:px-4 md:px-6 lg:px-8">${userBudget.remaining}</div>
          <div className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">of $100 remaining</div>
        </div>
      </div>

      {/* Waiver Status */}
      <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse sm:px-4 md:px-6 lg:px-8"></div>
            <div>
              <div className="text-blue-400 font-semibold sm:px-4 md:px-6 lg:px-8">
                {waiverPeriod.currentPeriod === 'waiver' ? 'Waiver Period Active' : 'Free Agency Open'}
              </div>
              <div className="text-sm text-blue-300 sm:px-4 md:px-6 lg:px-8">
                {waiverPeriod.currentPeriod === 'waiver' 
                  ? 'Submit FAAB bids until Tuesday 11:59 PM'
                  : 'Add players immediately (first come, first served)'}
              </div>
            </div>
          </div>
          
          <div className="text-right sm:px-4 md:px-6 lg:px-8">
            <div className="text-blue-400 font-semibold sm:px-4 md:px-6 lg:px-8">
              {Math.ceil((waiverPeriod.nextProcessing.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
            </div>
            <div className="text-sm text-blue-300 sm:px-4 md:px-6 lg:px-8">until processing</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-slate-800/50 rounded-lg p-1 sm:px-4 md:px-6 lg:px-8">
        {tabs.map((tab: any) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
          >
            <span>{tab.icon}</span>
            <span className="font-medium sm:px-4 md:px-6 lg:px-8">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {selectedTab === 'available' && (
          <motion.div
            key="available"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4 sm:px-4 md:px-6 lg:px-8"
          >
            {/* Search and Filters */}
            <div className="flex gap-4 sm:px-4 md:px-6 lg:px-8">
              <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                <input
                  type="text"
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(e: any) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select
                value={positionFilter}
                onChange={(e: any) => setPositionFilter(e.target.value)}
              >
                <option value="ALL">All Positions</option>
                <option value="QB">QB</option>
                <option value="RB">RB</option>
                <option value="WR">WR</option>
                <option value="TE">TE</option>
                <option value="K">K</option>
                <option value="DEF">DEF</option>
              </select>
            </div>

            {/* Available Players List */}
            <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
              {availablePlayers.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors sm:px-4 md:px-6 lg:px-8"
                >
                  <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-center gap-4 sm:px-4 md:px-6 lg:px-8">
                      <div className={`px-2 py-1 rounded text-xs font-bold ${getPositionColor(player.position)}`}>
                        {player.position}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                          <h4 className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">{player.name}</h4>
                          <span className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">{player.team}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">
                          <span>Proj: {player.projectedPoints} pts</span>
                          <span>Add: {player.addPercentage}%</span>
                          <span>Own: {player.ownership}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setSelectedPlayer(player);
                        setShowBidModal(true);
                      }}
                      aria-label="Action button"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8"
                    >
                      {waiverPeriod.currentPeriod === 'waiver' ? 'Place Bid' : 'Add Player'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {selectedTab === 'claims' && (
          <motion.div
            key="claims"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4 sm:px-4 md:px-6 lg:px-8"
          >
            <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
              <h3 className="text-lg font-bold text-white sm:px-4 md:px-6 lg:px-8">My Waiver Claims</h3>
              <span className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">
                {waiverClaims.filter((c: any) => c.claimingTeamId === userTeam?.id).length} active claims
              </span>
            </div>

            {waiverClaims.filter((c: any) => c.claimingTeamId === userTeam?.id).length === 0 ? (
              <div className="text-center py-8 sm:px-4 md:px-6 lg:px-8">
                <p className="text-slate-400 sm:px-4 md:px-6 lg:px-8">No active waiver claims</p>
                <p className="text-sm text-slate-500 mt-2 sm:px-4 md:px-6 lg:px-8">
                  Browse available players to place a bid
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                {waiverClaims
                  .filter((c: any) => c.claimingTeamId === userTeam?.id)
                  .map((claim, index) => (
                    <motion.div
                      key={claim.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 sm:px-4 md:px-6 lg:px-8"
                    >
                      <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-center gap-4 sm:px-4 md:px-6 lg:px-8">
                          <div className="text-center sm:px-4 md:px-6 lg:px-8">
                            <div className="text-lg font-bold text-white sm:px-4 md:px-6 lg:px-8">#{claim.priority}</div>
                            <div className="text-xs text-slate-400 sm:px-4 md:px-6 lg:px-8">Priority</div>
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${getPositionColor(claim.position)}`}>
                                {claim.position}
                              </span>
                              <h4 className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">{claim.playerName}</h4>
                              <span className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">{claim.team}</span>
                            </div>
                            
                            {claim.dropPlayerName && (
                              <div className="text-sm text-slate-400 mt-1 sm:px-4 md:px-6 lg:px-8">
                                Drop: {claim.dropPlayerName}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right sm:px-4 md:px-6 lg:px-8">
                          <div className="text-xl font-bold text-green-400 sm:px-4 md:px-6 lg:px-8">
                            ${claim.bidAmount}
                          </div>
                          <div className={`px-2 py-1 rounded text-xs font-medium ${getClaimStatusColor(claim.status)}`}>
                            {claim.status.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}
          </motion.div>
        )}

        {selectedTab === 'faab' && (
          <motion.div
            key="faab"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4 sm:px-4 md:px-6 lg:px-8"
          >
            <h3 className="text-lg font-bold text-white sm:px-4 md:px-6 lg:px-8">FAAB Budgets</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {league?.teams?.map((team, index) => {
                const budget = faabBudgets[team.id] || { remaining: 100, spent: 0 };
                const isUserTeam = team.id === userTeam?.id;
                
                return (
                  <motion.div
                    key={team.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-slate-800/50 rounded-lg p-4 border ${
                      isUserTeam ? 'border-blue-500 bg-blue-900/10' : 'border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3 sm:px-4 md:px-6 lg:px-8">
                      <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                        <span className="text-2xl sm:px-4 md:px-6 lg:px-8">{team.avatar}</span>
                        <div>
                          <h4 className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">{team.name}</h4>
                          <p className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">{team.owner.name}</p>
                        </div>
                      </div>
                      
                      {isUserTeam && (
                        <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded sm:px-4 md:px-6 lg:px-8">
                          YOU
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                      <div className="flex justify-between text-sm sm:px-4 md:px-6 lg:px-8">
                        <span className="text-slate-400 sm:px-4 md:px-6 lg:px-8">Remaining</span>
                        <span className="text-green-400 font-semibold sm:px-4 md:px-6 lg:px-8">${budget.remaining}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm sm:px-4 md:px-6 lg:px-8">
                        <span className="text-slate-400 sm:px-4 md:px-6 lg:px-8">Spent</span>
                        <span className="text-red-400 font-semibold sm:px-4 md:px-6 lg:px-8">${budget.spent}</span>
                      </div>
                      
                      <div className="w-full bg-slate-700 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-500 sm:px-4 md:px-6 lg:px-8"
                          style={{ width: `${budget.remaining}%` }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bid Modal */}
      {showBidModal && selectedPlayer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sm:px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700 sm:px-4 md:px-6 lg:px-8"
          >
            <h3 className="text-xl font-bold text-white mb-4 sm:px-4 md:px-6 lg:px-8">
              Place FAAB Bid
            </h3>
            
            <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
              {/* Player Info */}
              <div className="bg-slate-700/50 rounded-lg p-3 sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${getPositionColor(selectedPlayer.position)}`}>
                    {selectedPlayer.position}
                  </span>
                  <div>
                    <h4 className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">{selectedPlayer.name}</h4>
                    <p className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">{selectedPlayer.team}</p>
                  </div>
                </div>
              </div>
              
              {/* Bid Amount */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 sm:px-4 md:px-6 lg:px-8">
                  Bid Amount (${userBudget.remaining} available)
                </label>
                <input
                  type="number"
                  min="0"
                  max={userBudget.remaining}
                  value={bidAmount}
                  onChange={(e: any) => setBidAmount(Number(e.target.value))}
                  placeholder="Enter bid amount"
                />
              </div>
              
              {/* Drop Player (optional) */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 sm:px-4 md:px-6 lg:px-8">
                  Drop Player (optional)
                </label>
                <select
                  value={dropPlayer?.id || ''}
                  onChange={(e: any) => {
                    const player = userTeam?.roster?.find((p: any) => p.id === e.target.value);
                    setDropPlayer(player || null);
                  }}
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none sm:px-4 md:px-6 lg:px-8"
                >
                  <option value="">Select player to drop</option>
                  {userTeam?.roster?.map((player: any) => (
                    <option key={player.id} value={player.id}>
                      {player.name} ({player.position})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6 sm:px-4 md:px-6 lg:px-8">
              <button
                onClick={() => setShowBidModal(false)}
              >
                Cancel
              </button>
              <button
                onClick={handlePlaceBid}
                disabled={bidAmount <= 0 || bidAmount > userBudget.remaining}
                aria-label="Action button"
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:text-slate-400 text-white rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8"
              >
                Place Bid
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const EnhancedWaiverWireWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <EnhancedWaiverWire {...props} />
  </ErrorBoundary>
);

export default React.memo(EnhancedWaiverWireWithErrorBoundary);