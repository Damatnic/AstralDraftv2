/**
 * Trading System Component
 * Complete trade proposal, review, and management system
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useState, useMemo } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;

interface TradeProposal {
}
  id: string;
  fromTeamId: string;
  toTeamId: string;
  fromTeamName: string;
  toTeamName: string;
  playersOffered: any[];
  playersRequested: any[];
  status: &apos;pending&apos; | &apos;accepted&apos; | &apos;rejected&apos; | &apos;countered&apos; | &apos;expired&apos;;
  createdAt: Date;
  expiresAt: Date;
  message?: string;
  fairnessScore: number;
  analysis: {
}
    winner: &apos;team_a&apos; | &apos;team_b&apos; | &apos;even&apos;;
    summary: string;
    teamAGrade: string;
    teamBGrade: string;
  };
}

const TradingSystem: React.FC = () => {
}
  const { state, dispatch } = useAppState();
  const [activeTab, setActiveTab] = useState<&apos;propose&apos; | &apos;pending&apos; | &apos;history&apos; | &apos;block&apos;>(&apos;propose&apos;);
  const [selectedTeam, setSelectedTeam] = useState<string>(&apos;&apos;);
  const [offeredPlayers, setOfferedPlayers] = useState<any[]>([]);
  const [requestedPlayers, setRequestedPlayers] = useState<any[]>([]);
  const [tradeMessage, setTradeMessage] = useState(&apos;&apos;);
  const [showTradeAnalysis, setShowTradeAnalysis] = useState(false);

  const league = state.leagues[0];
  const currentUser = state.user;
  const userTeam = league?.teams?.find((team: any) => team.owner.id === currentUser?.id);

  // Simulate existing trade proposals
  const tradeProposals: TradeProposal[] = [
    {
}
      id: &apos;trade-1&apos;,
      fromTeamId: userTeam?.id || &apos;&apos;,
      toTeamId: &apos;team-2&apos;,
      fromTeamName: userTeam?.name || &apos;&apos;,
      toTeamName: &apos;Thunder Bolts&apos;,
      playersOffered: [
        { id: &apos;player-1&apos;, name: &apos;Derrick Henry&apos;, position: &apos;RB&apos;, team: &apos;TEN&apos;, projectedPoints: 15.2 }
      ],
      playersRequested: [
        { id: &apos;player-2&apos;, name: &apos;Cooper Kupp&apos;, position: &apos;WR&apos;, team: &apos;LAR&apos;, projectedPoints: 16.8 }
      ],
      status: &apos;pending&apos;,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      message: &apos;Looking to upgrade at WR. Henry has been solid but I need more ceiling.&apos;,
      fairnessScore: 85,
      analysis: {
}
        winner: &apos;team_b&apos;,
        summary: &apos;This trade slightly favors the team receiving Cooper Kupp due to higher projected points and better playoff schedule.&apos;,
        teamAGrade: &apos;B+&apos;,
        teamBGrade: &apos;A-&apos;
      }
    },
    {
}
      id: &apos;trade-2&apos;,
      fromTeamId: &apos;team-3&apos;,
      toTeamId: userTeam?.id || &apos;&apos;,
      fromTeamName: &apos;Gridiron Giants&apos;,
      toTeamName: userTeam?.name || &apos;&apos;,
      playersOffered: [
        { id: &apos;player-3&apos;, name: &apos;Travis Kelce&apos;, position: &apos;TE&apos;, team: &apos;KC&apos;, projectedPoints: 14.5 }
      ],
      playersRequested: [
        { id: &apos;player-4&apos;, name: &apos;Davante Adams&apos;, position: &apos;WR&apos;, team: &apos;LV&apos;, projectedPoints: 15.8 },
        { id: &apos;player-5&apos;, name: &apos;Tony Pollard&apos;, position: &apos;RB&apos;, team: &apos;DAL&apos;, projectedPoints: 11.2 }
      ],
      status: &apos;pending&apos;,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      message: &apos;Need WR depth for playoffs. Kelce is elite but I have good TE depth.&apos;,
      fairnessScore: 78,
      analysis: {
}
        winner: &apos;team_a&apos;,
        summary: &apos;This trade favors the team receiving Adams and Pollard due to positional value and depth.&apos;,
        teamAGrade: &apos;A&apos;,
        teamBGrade: &apos;B-&apos;
      }
    }
  ];

  // Simulate trade block players
  const tradeBlockPlayers = [
    { id: &apos;tb-1&apos;, name: &apos;Aaron Jones&apos;, position: &apos;RB&apos;, team: &apos;GB&apos;, owner: &apos;Thunder Bolts&apos;, reason: &apos;Surplus at RB&apos; },
    { id: &apos;tb-2&apos;, name: &apos;Mike Evans&apos;, position: &apos;WR&apos;, team: &apos;TB&apos;, owner: &apos;Gridiron Giants&apos;, reason: &apos;Need QB help&apos; },
    { id: &apos;tb-3&apos;, name: &apos;Russell Wilson&apos;, position: &apos;QB&apos;, team: &apos;DEN&apos;, owner: &apos;Storm Chasers&apos;, reason: &apos;Have Mahomes&apos; },
    { id: &apos;tb-4&apos;, name: &apos;T.J. Hockenson&apos;, position: &apos;TE&apos;, team: &apos;MIN&apos;, owner: &apos;Lightning Strikes&apos;, reason: &apos;Have Kelce&apos; }
  ];

  const tabs = [
    { id: &apos;propose&apos;, label: &apos;Propose Trade&apos;, icon: &apos;📝&apos;, description: &apos;Create new trade offers&apos; },
    { id: &apos;pending&apos;, label: &apos;Pending Trades&apos;, icon: &apos;⏳&apos;, description: &apos;Active trade negotiations&apos; },
    { id: &apos;history&apos;, label: &apos;Trade History&apos;, icon: &apos;📚&apos;, description: &apos;Completed trades&apos; },
    { id: &apos;block&apos;, label: &apos;Trade Block&apos;, icon: &apos;🏪&apos;, description: &apos;Available players&apos; }
  ];

  const getStatusColor = (status: string) => {
}
    switch (status) {
}
      case &apos;pending&apos;: return &apos;text-yellow-400 bg-yellow-900/20 border-yellow-600/30&apos;;
      case &apos;accepted&apos;: return &apos;text-green-400 bg-green-900/20 border-green-600/30&apos;;
      case &apos;rejected&apos;: return &apos;text-red-400 bg-red-900/20 border-red-600/30&apos;;
      case &apos;countered&apos;: return &apos;text-blue-400 bg-blue-900/20 border-blue-600/30&apos;;
      case &apos;expired&apos;: return &apos;text-gray-400 bg-gray-900/20 border-gray-600/30&apos;;
      default: return &apos;text-slate-400 bg-slate-900/20 border-slate-600/30&apos;;
    }
  };

  const getFairnessColor = (score: number) => {
}
    if (score >= 90) return &apos;text-green-400&apos;;
    if (score >= 80) return &apos;text-yellow-400&apos;;
    if (score >= 70) return &apos;text-orange-400&apos;;
    return &apos;text-red-400&apos;;
  };

  const handleProposeTrade = () => {
}
    if (!selectedTeam || offeredPlayers.length === 0 || requestedPlayers.length === 0) {
}
      dispatch({
}
        type: &apos;ADD_NOTIFICATION&apos;,
        payload: {
}
          message: &apos;Please select teams and players for the trade&apos;,
          type: &apos;ERROR&apos;
        }
      });
      return;
    }

    // Simulate trade proposal
    const newTrade: TradeProposal = {
}
      id: `trade-${Date.now()}`,
      fromTeamId: userTeam?.id || &apos;&apos;,
      toTeamId: selectedTeam,
      fromTeamName: userTeam?.name || &apos;&apos;,
      toTeamName: league?.teams?.find((t: any) => t.id === selectedTeam)?.name || &apos;&apos;,
      playersOffered: offeredPlayers,
      playersRequested: requestedPlayers,
      status: &apos;pending&apos;,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      message: tradeMessage,
      fairnessScore: Math.floor(Math.random() * 30) + 70, // 70-100
      analysis: {
}
        winner: Math.random() > 0.5 ? &apos;team_a&apos; : &apos;team_b&apos;,
        summary: &apos;Trade analysis will be generated based on player values and team needs.&apos;,
        teamAGrade: &apos;B+&apos;,
        teamBGrade: &apos;B+&apos;
      }
    };

    dispatch({
}
      type: &apos;ADD_NOTIFICATION&apos;,
      payload: {
}
        message: &apos;Trade proposal sent successfully!&apos;,
        type: &apos;SUCCESS&apos;
      }
    });

    // Reset form
    setSelectedTeam(&apos;&apos;);
    setOfferedPlayers([]);
    setRequestedPlayers([]);
    setTradeMessage(&apos;&apos;);
    setActiveTab(&apos;pending&apos;);
  };

  const handleTradeAction = (tradeId: string, action: &apos;accept&apos; | &apos;reject&apos; | &apos;counter&apos;) => {
}
    dispatch({
}
      type: &apos;ADD_NOTIFICATION&apos;,
      payload: {
}
        message: `Trade ${action}ed successfully!`,
        type: action === &apos;accept&apos; ? &apos;SUCCESS&apos; : &apos;INFO&apos;
      }
    });
  };

  const renderTabContent = () => {
}
    switch (activeTab) {
}
      case &apos;propose&apos;:
        return (
          <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            <div className="card sm:px-4 md:px-6 lg:px-8">
              <div className="card-header sm:px-4 md:px-6 lg:px-8">
                <h3 className="card-title sm:px-4 md:px-6 lg:px-8">Propose New Trade</h3>
                <p className="card-subtitle sm:px-4 md:px-6 lg:px-8">Create a trade offer with another team</p>
              </div>

              {/* Team Selection */}
              <div className="mb-6 sm:px-4 md:px-6 lg:px-8">
                <label className="block text-white font-semibold mb-3 sm:px-4 md:px-6 lg:px-8">Select Trading Partner</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {league?.teams?.filter((team: any) => team.id !== userTeam?.id).map((team: any) => (
}
                    <button
                      key={team.id}
                      onClick={() => setSelectedTeam(team.id)}
                      className={`w-full p-3 rounded-lg border transition-all ${
}
                        selectedTeam === team.id
                          ? &apos;bg-blue-900/30 border-blue-500&apos;
                          : &apos;bg-slate-700/30 border-slate-600 hover:bg-slate-700/50&apos;
                      }`}
                    >
                      <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                        <span className="text-2xl sm:px-4 md:px-6 lg:px-8">{team.avatar}</span>
                        <div className="text-left sm:px-4 md:px-6 lg:px-8">
                          <div className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">{team.name}</div>
                          <div className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">{team.owner.name}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Players to Offer */}
              <div className="mb-6 sm:px-4 md:px-6 lg:px-8">
                <label className="block text-white font-semibold mb-3 sm:px-4 md:px-6 lg:px-8">Players You&apos;re Offering</label>
                <div className="bg-slate-700/30 rounded-lg p-4 min-h-[100px] border-2 border-dashed border-slate-600 sm:px-4 md:px-6 lg:px-8">
                  {offeredPlayers.length === 0 ? (
}
                    <p className="text-slate-400 text-center py-4 sm:px-4 md:px-6 lg:px-8">Select players from your roster to offer</p>
                  ) : (
                    <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                      {offeredPlayers.map((player: any) => (
}
                        <div key={player.id} className="flex items-center justify-between p-3 bg-slate-600/50 rounded-lg sm:px-4 md:px-6 lg:px-8">
                          <div>
                            <span className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">{player.name}</span>
                            <span className="text-slate-300 ml-2 sm:px-4 md:px-6 lg:px-8">({player.position} - {player.team})</span>
                          </div>
                          <button
                            onClick={() => setOfferedPlayers(prev => prev.filter((p: any) => p.id !== player.id))}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
//                             Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Players to Request */}
              <div className="mb-6 sm:px-4 md:px-6 lg:px-8">
                <label className="block text-white font-semibold mb-3 sm:px-4 md:px-6 lg:px-8">Players You Want</label>
                <div className="bg-slate-700/30 rounded-lg p-4 min-h-[100px] border-2 border-dashed border-slate-600 sm:px-4 md:px-6 lg:px-8">
                  {requestedPlayers.length === 0 ? (
}
                    <p className="text-slate-400 text-center py-4 sm:px-4 md:px-6 lg:px-8">Select players you want in return</p>
                  ) : (
                    <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                      {requestedPlayers.map((player: any) => (
}
                        <div key={player.id} className="flex items-center justify-between p-3 bg-slate-600/50 rounded-lg sm:px-4 md:px-6 lg:px-8">
                          <div>
                            <span className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">{player.name}</span>
                            <span className="text-slate-300 ml-2 sm:px-4 md:px-6 lg:px-8">({player.position} - {player.team})</span>
                          </div>
                          <button
                            onClick={() => setRequestedPlayers(prev => prev.filter((p: any) => p.id !== player.id))}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
//                             Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Trade Message */}
              <div className="mb-6 sm:px-4 md:px-6 lg:px-8">
                <label className="block text-white font-semibold mb-3 sm:px-4 md:px-6 lg:px-8">Trade Message (Optional)</label>
                <textarea
                  value={tradeMessage}
                  onChange={(e: any) => setTradeMessage(e.target.value)}
                  className="form-input h-24 resize-none sm:px-4 md:px-6 lg:px-8"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 sm:px-4 md:px-6 lg:px-8">
                <button
                  onClick={() => setShowTradeAnalysis(true)}
                  className="btn btn-secondary flex-1 sm:px-4 md:px-6 lg:px-8"
                >
                  Analyze Trade
                </button>
                <button
                  onClick={handleProposeTrade}
                  disabled={!selectedTeam || offeredPlayers.length === 0 || requestedPlayers.length === 0}
                  className="btn btn-primary flex-1 sm:px-4 md:px-6 lg:px-8"
                 aria-label="Action button">
                  Send Trade Proposal
                </button>
              </div>
            </div>
          </div>
        );

      case &apos;pending&apos;:
        return (
          <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
              <h3 className="text-xl font-bold text-white sm:px-4 md:px-6 lg:px-8">Pending Trades</h3>
              <span className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">
                {tradeProposals.filter((t: any) => t.status === &apos;pending&apos;).length} active proposals
              </span>
            </div>

            {tradeProposals.filter((t: any) => t.status === &apos;pending&apos;).length === 0 ? (
}
              <div className="card text-center py-8 sm:px-4 md:px-6 lg:px-8">
                <p className="text-slate-400 mb-4 sm:px-4 md:px-6 lg:px-8">No pending trades</p>
                <button
                  onClick={() => setActiveTab(&apos;propose&apos;)}
                  className="btn btn-primary"
                >
                  Propose a Trade
                </button>
              </div>
            ) : (
              <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                {tradeProposals.filter((t: any) => t.status === &apos;pending&apos;).map((trade: any) => (
}
                  <motion.div
                    key={trade.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card sm:px-4 md:px-6 lg:px-8"
                  >
                    <div className="flex items-center justify-between mb-4 sm:px-4 md:px-6 lg:px-8">
                      <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(trade.status)}`}>
                          {trade.status.toUpperCase()}
                        </span>
                        <span className="text-slate-400 text-sm sm:px-4 md:px-6 lg:px-8">
                          {Math.ceil((trade.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                        </span>
                      </div>
                      <div className={`text-sm font-semibold ${getFairnessColor(trade.fairnessScore)}`}>
                        Fairness: {trade.fairnessScore}%
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                      {/* Offering Team */}
                      <div>
                        <h4 className="text-white font-semibold mb-3 sm:px-4 md:px-6 lg:px-8">{trade.fromTeamName} Offers</h4>
                        <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                          {trade.playersOffered.map((player: any) => (
}
                            <div key={player.id} className="p-3 bg-slate-700/50 rounded-lg sm:px-4 md:px-6 lg:px-8">
                              <div className="text-white font-medium sm:px-4 md:px-6 lg:px-8">{player.name}</div>
                              <div className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">
                                {player.position} - {player.team} • {player.projectedPoints} pts
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Trade Arrow */}
                      <div className="flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
                        <div className="text-4xl text-blue-400 sm:px-4 md:px-6 lg:px-8">⇄</div>
                      </div>

                      {/* Requesting Team */}
                      <div>
                        <h4 className="text-white font-semibold mb-3 sm:px-4 md:px-6 lg:px-8">{trade.toTeamName} Gets</h4>
                        <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                          {trade.playersRequested.map((player: any) => (
}
                            <div key={player.id} className="p-3 bg-slate-700/50 rounded-lg sm:px-4 md:px-6 lg:px-8">
                              <div className="text-white font-medium sm:px-4 md:px-6 lg:px-8">{player.name}</div>
                              <div className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">
                                {player.position} - {player.team} • {player.projectedPoints} pts
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {trade.message && (
}
                      <div className="mb-4 p-3 bg-blue-900/20 border border-blue-600/30 rounded-lg sm:px-4 md:px-6 lg:px-8">
                        <p className="text-blue-300 text-sm sm:px-4 md:px-6 lg:px-8">{trade.message}</p>
                      </div>
                    )}

                    {/* Trade Analysis */}
                    <div className="mb-4 p-4 bg-slate-700/30 rounded-lg sm:px-4 md:px-6 lg:px-8">
                      <h5 className="text-white font-semibold mb-2 sm:px-4 md:px-6 lg:px-8">Trade Analysis</h5>
                      <p className="text-slate-300 text-sm mb-3 sm:px-4 md:px-6 lg:px-8">{trade.analysis.summary}</p>
                      <div className="flex gap-4 sm:px-4 md:px-6 lg:px-8">
                        <span className="text-sm sm:px-4 md:px-6 lg:px-8">
                          <span className="text-slate-400 sm:px-4 md:px-6 lg:px-8">{trade.fromTeamName}:</span>
                          <span className="text-white font-semibold ml-1 sm:px-4 md:px-6 lg:px-8">{trade.analysis.teamAGrade}</span>
                        </span>
                        <span className="text-sm sm:px-4 md:px-6 lg:px-8">
                          <span className="text-slate-400 sm:px-4 md:px-6 lg:px-8">{trade.toTeamName}:</span>
                          <span className="text-white font-semibold ml-1 sm:px-4 md:px-6 lg:px-8">{trade.analysis.teamBGrade}</span>
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 sm:px-4 md:px-6 lg:px-8">
                      {trade.toTeamId === userTeam?.id ? (
}
                        <>
                          <button
                            onClick={() => handleTradeAction(trade.id, &apos;accept&apos;)}
                            className="btn btn-primary flex-1"
                          >
                            Accept Trade
                          </button>
                          <button
                            onClick={() => handleTradeAction(trade.id, &apos;counter&apos;)}
                            className="btn btn-secondary flex-1"
                          >
                            Counter Offer
                          </button>
                          <button
                            onClick={() => handleTradeAction(trade.id, &apos;reject&apos;)}
                            className="btn btn-danger flex-1"
                          >
//                             Reject
                          </button>
                        </>
                      ) : (
                        <div className="flex-1 text-center py-2 text-slate-400 sm:px-4 md:px-6 lg:px-8">
                          Waiting for {trade.toTeamName} to respond...
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        );

      case &apos;history&apos;:
        return (
          <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
            <h3 className="text-xl font-bold text-white sm:px-4 md:px-6 lg:px-8">Trade History</h3>
            <div className="card text-center py-8 sm:px-4 md:px-6 lg:px-8">
              <p className="text-slate-400 mb-4 sm:px-4 md:px-6 lg:px-8">No completed trades yet</p>
              <p className="text-sm text-slate-500 sm:px-4 md:px-6 lg:px-8">Trade history will appear here once trades are completed</p>
            </div>
          </div>
        );

      case &apos;block&apos;:
        return (
          <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
              <h3 className="text-xl font-bold text-white sm:px-4 md:px-6 lg:px-8">Trade Block</h3>
              <p className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">Players available for trade</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tradeBlockPlayers.map((player: any) => (
}
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card hover:border-blue-500 cursor-pointer sm:px-4 md:px-6 lg:px-8"
                >
                  <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                    <div>
                      <h4 className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">{player.name}</h4>
                      <p className="text-slate-400 text-sm sm:px-4 md:px-6 lg:px-8">{player.position} - {player.team}</p>
                      <p className="text-slate-300 text-sm mt-1 sm:px-4 md:px-6 lg:px-8">Owner: {player.owner}</p>
                    </div>
                    <div className="text-right sm:px-4 md:px-6 lg:px-8">
                      <div className="text-xs text-slate-400 mb-2 sm:px-4 md:px-6 lg:px-8">{player.reason}</div>
                      <button className="btn btn-primary btn-sm sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                        Make Offer
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
        <div>
          <h2 className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">Trading Center</h2>
          <p className="text-slate-400 sm:px-4 md:px-6 lg:px-8">Propose trades and manage negotiations</p>
        </div>
        
        <div className="text-right sm:px-4 md:px-6 lg:px-8">
          <div className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">Trade Deadline</div>
          <div className="text-sm text-orange-400 sm:px-4 md:px-6 lg:px-8">Week 12 (Nov 15)</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-800/50 rounded-lg p-2">
        {tabs.map((tab: any) => (
}
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center p-3 rounded-lg transition-all ${
}
              activeTab === tab.id
                ? &apos;bg-blue-900/30 text-blue-400&apos;
                : &apos;bg-slate-700/30 text-slate-400 hover:bg-slate-700/50&apos;
            }`}
          >
            <span className="text-2xl sm:px-4 md:px-6 lg:px-8">{tab.icon}</span>
            <div className="text-center sm:px-4 md:px-6 lg:px-8">
              <div className="font-medium text-sm sm:px-4 md:px-6 lg:px-8">{tab.label}</div>
              <div className="text-xs opacity-75 sm:px-4 md:px-6 lg:px-8">{tab.description}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>

      {/* Trade Rules */}
      <div className="card sm:px-4 md:px-6 lg:px-8">
        <h4 className="text-lg font-bold text-white mb-3 sm:px-4 md:px-6 lg:px-8">Trade Rules</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="text-white font-semibold mb-2 sm:px-4 md:px-6 lg:px-8">General Rules</h5>
            <ul className="text-slate-400 space-y-1 sm:px-4 md:px-6 lg:px-8">
              <li>• Trade deadline: Week 12 (November 15)</li>
              <li>• Trades process immediately upon acceptance</li>
              <li>• No trade review period (commissioner approval only)</li>
              <li>• Maximum 7 days for trade response</li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-semibold mb-2 sm:px-4 md:px-6 lg:px-8">Restrictions</h5>
            <ul className="text-slate-400 space-y-1 sm:px-4 md:px-6 lg:px-8">
              <li>• No trading draft picks (redraft league)</li>
              <li>• Players must clear waivers before trading</li>
              <li>• Injured reserve players can be traded</li>
              <li>• No collusion or unfair trades allowed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const TradingSystemWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <TradingSystem {...props} />
  </ErrorBoundary>
);

export default React.memo(TradingSystemWithErrorBoundary);