/**
 * Enhanced Waiver Wire System
 * FAAB bidding system with waiver claims and free agency
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useState, useMemo } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;
import PlayerSearch from &apos;../PlayerSearch&apos;;

interface WaiverClaim {
}
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
  status: &apos;pending&apos; | &apos;successful&apos; | &apos;failed&apos;;
  processedAt?: Date;

}

interface WaiverPeriod {
}
  isActive: boolean;
  nextProcessing: Date;
  currentPeriod: &apos;waiver&apos; | &apos;free_agency&apos;;
}

const EnhancedWaiverWire: React.FC = () => {
}
  const { state, dispatch } = useAppState();
  const [selectedTab, setSelectedTab] = useState<&apos;available&apos; | &apos;claims&apos; | &apos;faab&apos;>(&apos;available&apos;);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [bidAmount, setBidAmount] = useState(0);
  const [dropPlayer, setDropPlayer] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState(&apos;&apos;);
  const [positionFilter, setPositionFilter] = useState(&apos;ALL&apos;);

  const league = state.leagues[0];
  const currentUser = state.user;
  const userTeam = league?.teams?.find((team: any) => team.owner.id === currentUser?.id);

  // Simulate waiver period
  const waiverPeriod: WaiverPeriod = {
}
    isActive: true,
    nextProcessing: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    currentPeriod: &apos;waiver&apos;
  };

  // Simulate FAAB budgets
  const faabBudgets = useMemo(() => {
}
    if (!league?.teams) return {};
    
    const budgets: { [teamId: string]: { remaining: number; spent: number } } = {};
    league.teams.forEach((team: any) => {
}
      budgets[team.id] = {
}
        remaining: Math.floor(Math.random() * 50) + 50, // $50-$100 remaining
        spent: 100 - (Math.floor(Math.random() * 50) + 50)
      };
    });
    return budgets;
  }, [league?.teams]);

  // Simulate available players (not on any roster)
  const availablePlayers = useMemo(() => {
}
    const players = [
      { id: &apos;waiver-1&apos;, name: &apos;Gus Edwards&apos;, position: &apos;RB&apos;, team: &apos;BAL&apos;, projectedPoints: 8.5, addPercentage: 45, ownership: 55 },
      { id: &apos;waiver-2&apos;, name: &apos;Tyler Boyd&apos;, position: &apos;WR&apos;, team: &apos;CIN&apos;, projectedPoints: 7.2, addPercentage: 38, ownership: 62 },
      { id: &apos;waiver-3&apos;, name: &apos;Jamaal Williams&apos;, position: &apos;RB&apos;, team: &apos;NO&apos;, projectedPoints: 6.8, addPercentage: 42, ownership: 58 },
      { id: &apos;waiver-4&apos;, name: &apos;Hunter Renfrow&apos;, position: &apos;WR&apos;, team: &apos;LV&apos;, projectedPoints: 6.5, addPercentage: 35, ownership: 65 },
      { id: &apos;waiver-5&apos;, name: &apos;Tyler Higbee&apos;, position: &apos;TE&apos;, team: &apos;LAR&apos;, projectedPoints: 5.8, addPercentage: 28, ownership: 72 },
      { id: &apos;waiver-6&apos;, name: &apos;Jalen Tolbert&apos;, position: &apos;WR&apos;, team: &apos;DAL&apos;, projectedPoints: 5.2, addPercentage: 52, ownership: 48 },
      { id: &apos;waiver-7&apos;, name: &apos;Justice Hill&apos;, position: &apos;RB&apos;, team: &apos;BAL&apos;, projectedPoints: 4.8, addPercentage: 31, ownership: 69 },
      { id: &apos;waiver-8&apos;, name: &apos;Deon Jackson&apos;, position: &apos;RB&apos;, team: &apos;IND&apos;, projectedPoints: 4.5, addPercentage: 29, ownership: 71 },
      { id: &apos;waiver-9&apos;, name: &apos;Greg Dulcich&apos;, position: &apos;TE&apos;, team: &apos;DEN&apos;, projectedPoints: 4.2, addPercentage: 25, ownership: 75 },
      { id: &apos;waiver-10&apos;, name: &apos;Robbie Anderson&apos;, position: &apos;WR&apos;, team: &apos;MIA&apos;, projectedPoints: 4.0, addPercentage: 22, ownership: 78 },
      { id: &apos;waiver-11&apos;, name: &apos;Mason Rudolph&apos;, position: &apos;QB&apos;, team: &apos;PIT&apos;, projectedPoints: 12.5, addPercentage: 15, ownership: 85 },
      { id: &apos;waiver-12&apos;, name: &apos;Cairo Santos&apos;, position: &apos;K&apos;, team: &apos;CHI&apos;, projectedPoints: 7.8, addPercentage: 18, ownership: 82 },
      { id: &apos;waiver-13&apos;, name: &apos;New York Giants&apos;, position: &apos;DEF&apos;, team: &apos;NYG&apos;, projectedPoints: 6.2, addPercentage: 33, ownership: 67 },
      { id: &apos;waiver-14&apos;, name: &apos;Trey Sermon&apos;, position: &apos;RB&apos;, team: &apos;PHI&apos;, projectedPoints: 3.8, addPercentage: 27, ownership: 73 },
      { id: &apos;waiver-15&apos;, name: &apos;Kendrick Bourne&apos;, position: &apos;WR&apos;, team: &apos;NE&apos;, projectedPoints: 3.5, addPercentage: 24, ownership: 76 }
    ];

    return players.filter((player: any) => {
}
      const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPosition = positionFilter === &apos;ALL&apos; || player.position === positionFilter;
      return matchesSearch && matchesPosition;
    });
  }, [searchTerm, positionFilter]);

  // Simulate existing waiver claims
  const waiverClaims: WaiverClaim[] = [
    {
}
      id: &apos;claim-1&apos;,
      playerId: &apos;waiver-1&apos;,
      playerName: &apos;Gus Edwards&apos;,
      position: &apos;RB&apos;,
      team: &apos;BAL&apos;,
      claimingTeamId: userTeam?.id || &apos;&apos;,
      claimingTeamName: userTeam?.name || &apos;&apos;,
      bidAmount: 15,
      dropPlayerId: &apos;drop-1&apos;,
      dropPlayerName: &apos;Deon Jackson&apos;,
      priority: 1,
      status: &apos;pending&apos;
    },
    {
}
      id: &apos;claim-2&apos;,
      playerId: &apos;waiver-2&apos;,
      playerName: &apos;Tyler Boyd&apos;,
      position: &apos;WR&apos;,
      team: &apos;CIN&apos;,
      claimingTeamId: &apos;team-2&apos;,
      claimingTeamName: &apos;Team 2&apos;,
      bidAmount: 12,
      priority: 2,
      status: &apos;pending&apos;
    }
  ];

  const userBudget = faabBudgets[userTeam?.id || &apos;&apos;] || { remaining: 100, spent: 0 };

  const handlePlaceBid = () => {
}
    if (!selectedPlayer || !userTeam) return;

    // Simulate placing a waiver claim
    const newClaim: WaiverClaim = {
}
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
      status: &apos;pending&apos;
    };

    // In a real app, this would be sent to the backend
    
    setShowBidModal(false);
    setSelectedPlayer(null);
    setBidAmount(0);
    setDropPlayer(null);
  };

  const getPositionColor = (position: string) => {
}
    switch (position) {
}
      case &apos;QB&apos;: return &apos;text-red-400 bg-red-900/20&apos;;
      case &apos;RB&apos;: return &apos;text-green-400 bg-green-900/20&apos;;
      case &apos;WR&apos;: return &apos;text-blue-400 bg-blue-900/20&apos;;
      case &apos;TE&apos;: return &apos;text-yellow-400 bg-yellow-900/20&apos;;
      case &apos;K&apos;: return &apos;text-orange-400 bg-orange-900/20&apos;;
      case &apos;DEF&apos;: return &apos;text-gray-400 bg-gray-900/20&apos;;
      default: return &apos;text-white bg-slate-900/20&apos;;
    }
  };

  const getClaimStatusColor = (status: string) => {
}
    switch (status) {
}
      case &apos;pending&apos;: return &apos;text-yellow-400 bg-yellow-900/20&apos;;
      case &apos;successful&apos;: return &apos;text-green-400 bg-green-900/20&apos;;
      case &apos;failed&apos;: return &apos;text-red-400 bg-red-900/20&apos;;
      default: return &apos;text-slate-400 bg-slate-900/20&apos;;
    }
  };

  const tabs = [
    { id: &apos;available&apos;, label: &apos;Available Players&apos;, icon: &apos;👥&apos; },
    { id: &apos;claims&apos;, label: &apos;My Claims&apos;, icon: &apos;📋&apos; },
    { id: &apos;faab&apos;, label: &apos;FAAB Budgets&apos;, icon: &apos;💰&apos; }
  ];

  return (
    <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
        <div>
          <h2 className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">Waiver Wire</h2>
          <p className="text-slate-400 sm:px-4 md:px-6 lg:px-8">
            {waiverPeriod.currentPeriod === &apos;waiver&apos; ? &apos;Waiver Period&apos; : &apos;Free Agency&apos;} • 
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
                {waiverPeriod.currentPeriod === &apos;waiver&apos; ? &apos;Waiver Period Active&apos; : &apos;Free Agency Open&apos;}
              </div>
              <div className="text-sm text-blue-300 sm:px-4 md:px-6 lg:px-8">
                {waiverPeriod.currentPeriod === &apos;waiver&apos; 
}
                  ? &apos;Submit FAAB bids until Tuesday 11:59 PM&apos;
                  : &apos;Add players immediately (first come, first served)&apos;}
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
}
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
        {selectedTab === &apos;available&apos; && (
}
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
}
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
}
                        setSelectedPlayer(player);
                        setShowBidModal(true);
                      }}
                      aria-label="Action button"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8"
                    >
                      {waiverPeriod.currentPeriod === &apos;waiver&apos; ? &apos;Place Bid&apos; : &apos;Add Player&apos;}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {selectedTab === &apos;claims&apos; && (
}
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
}
              <div className="text-center py-8 sm:px-4 md:px-6 lg:px-8">
                <p className="text-slate-400 sm:px-4 md:px-6 lg:px-8">No active waiver claims</p>
                <p className="text-sm text-slate-500 mt-2 sm:px-4 md:px-6 lg:px-8">
                  Browse available players to place a bid
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                {waiverClaims
}
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
}
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

        {selectedTab === &apos;faab&apos; && (
}
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
}
                const budget = faabBudgets[team.id] || { remaining: 100, spent: 0 };
                const isUserTeam = team.id === userTeam?.id;
                
                return (
                  <motion.div
                    key={team.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-slate-800/50 rounded-lg p-4 border ${
}
                      isUserTeam ? &apos;border-blue-500 bg-blue-900/10&apos; : &apos;border-slate-700&apos;
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
}
                        <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded sm:px-4 md:px-6 lg:px-8">
//                           YOU
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
}
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
                  value={dropPlayer?.id || &apos;&apos;}
                  onChange={(e: any) => {
}
                    const player = userTeam?.roster?.find((p: any) => p.id === e.target.value);
                    setDropPlayer(player || null);
                  }}
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none sm:px-4 md:px-6 lg:px-8"
                >
                  <option value="">Select player to drop</option>
                  {userTeam?.roster?.map((player: any) => (
}
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
//                 Cancel
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