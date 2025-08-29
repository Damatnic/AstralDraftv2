/**
 * Trading System Component
 * Complete trade proposal, review, and management system
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../../contexts/AppContext';

interface TradeProposal {
  id: string;
  fromTeamId: string;
  toTeamId: string;
  fromTeamName: string;
  toTeamName: string;
  playersOffered: any[];
  playersRequested: any[];
  status: 'pending' | 'accepted' | 'rejected' | 'countered' | 'expired';
  createdAt: Date;
  expiresAt: Date;
  message?: string;
  fairnessScore: number;
  analysis: {
    winner: 'team_a' | 'team_b' | 'even';
    summary: string;
    teamAGrade: string;
    teamBGrade: string;
  };
}

const TradingSystem: React.FC = () => {
  const { state, dispatch } = useAppState();
  const [activeTab, setActiveTab] = useState<'propose' | 'pending' | 'history' | 'block'>('propose');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [offeredPlayers, setOfferedPlayers] = useState<any[]>([]);
  const [requestedPlayers, setRequestedPlayers] = useState<any[]>([]);
  const [tradeMessage, setTradeMessage] = useState('');

  const league = state.leagues[0];
  const currentUser = state.user;
  const userTeam = league?.teams?.find(team => team.owner.id === currentUser?.id);

  // Simulate existing trade proposals
  const tradeProposals: TradeProposal[] = [
    {
      id: 'trade-1',
      fromTeamId: userTeam?.id || '',
      toTeamId: 'team-2',
      fromTeamName: userTeam?.name || '',
      toTeamName: 'Thunder Bolts',
      playersOffered: [
        { id: 'player-1', name: 'Derrick Henry', position: 'RB', team: 'TEN', projectedPoints: 15.2 }
      ],
      playersRequested: [
        { id: 'player-2', name: 'Cooper Kupp', position: 'WR', team: 'LAR', projectedPoints: 16.8 }
      ],
      status: 'pending',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      message: 'Looking to upgrade at WR. Henry has been solid but I need more ceiling.',
      fairnessScore: 85,
      analysis: {
        winner: 'team_b',
        summary: 'This trade slightly favors the team receiving Cooper Kupp due to higher projected points and better playoff schedule.',
        teamAGrade: 'B+',
        teamBGrade: 'A-'
      }
    },
    {
      id: 'trade-2',
      fromTeamId: 'team-3',
      toTeamId: userTeam?.id || '',
      fromTeamName: 'Gridiron Giants',
      toTeamName: userTeam?.name || '',
      playersOffered: [
        { id: 'player-3', name: 'Travis Kelce', position: 'TE', team: 'KC', projectedPoints: 14.5 }
      ],
      playersRequested: [
        { id: 'player-4', name: 'Davante Adams', position: 'WR', team: 'LV', projectedPoints: 15.8 },
        { id: 'player-5', name: 'Tony Pollard', position: 'RB', team: 'DAL', projectedPoints: 11.2 }
      ],
      status: 'pending',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      message: 'Need WR depth for playoffs. Kelce is elite but I have good TE depth.',
      fairnessScore: 78,
      analysis: {
        winner: 'team_a',
        summary: 'This trade favors the team receiving Adams and Pollard due to positional value and depth.',
        teamAGrade: 'A',
        teamBGrade: 'B-'
      }
    }
  ];

  // Simulate trade block players
  const tradeBlockPlayers = [
    { id: 'tb-1', name: 'Aaron Jones', position: 'RB', team: 'GB', owner: 'Thunder Bolts', reason: 'Surplus at RB' },
    { id: 'tb-2', name: 'Mike Evans', position: 'WR', team: 'TB', owner: 'Gridiron Giants', reason: 'Need QB help' },
    { id: 'tb-3', name: 'Russell Wilson', position: 'QB', team: 'DEN', owner: 'Storm Chasers', reason: 'Have Mahomes' },
    { id: 'tb-4', name: 'T.J. Hockenson', position: 'TE', team: 'MIN', owner: 'Lightning Strikes', reason: 'Have Kelce' }
  ];

  const tabs = [
    { id: 'propose', label: 'Propose Trade', icon: '📝', description: 'Create new trade offers' },
    { id: 'pending', label: 'Pending Trades', icon: '⏳', description: 'Active trade negotiations' },
    { id: 'history', label: 'Trade History', icon: '📚', description: 'Completed trades' },
    { id: 'block', label: 'Trade Block', icon: '🏪', description: 'Available players' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-900/20 border-yellow-600/30';
      case 'accepted': return 'text-green-400 bg-green-900/20 border-green-600/30';
      case 'rejected': return 'text-red-400 bg-red-900/20 border-red-600/30';
      case 'countered': return 'text-blue-400 bg-blue-900/20 border-blue-600/30';
      case 'expired': return 'text-gray-400 bg-gray-900/20 border-gray-600/30';
      default: return 'text-slate-400 bg-slate-900/20 border-slate-600/30';
    }
  };

  const getFairnessColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-yellow-400';
    if (score >= 70) return 'text-orange-400';
    return 'text-red-400';
  };

  const handleProposeTrade = () => {
    if (!selectedTeam || offeredPlayers.length === 0 || requestedPlayers.length === 0) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: 'Please select teams and players for the trade',
          type: 'ERROR'
        }
      });
      return;
    }

    // Simulate trade proposal
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        message: 'Trade proposal sent successfully!',
        type: 'SUCCESS'
      }
    });

    // Reset form
    setSelectedTeam('');
    setOfferedPlayers([]);
    setRequestedPlayers([]);
    setTradeMessage('');
    setActiveTab('pending');
  };

  const handleTradeAction = (tradeId: string, action: 'accept' | 'reject' | 'counter') => {
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        message: `Trade ${action}ed successfully!`,
        type: action === 'accept' ? 'SUCCESS' : 'INFO'
      }
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'propose':
        return (
          <div className="space-y-6">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Propose New Trade</h3>
                <p className="card-subtitle">Create a trade offer with another team</p>
              </div>

              {/* Team Selection */}
              <div className="mb-6">
                <label className="block text-white font-semibold mb-3">Select Trading Partner</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {league?.teams?.filter(team => team.id !== userTeam?.id).map(team => (
                    <button
                      key={team.id}
                      onClick={() => setSelectedTeam(team.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedTeam === team.id
                          ? 'border-blue-500 bg-blue-900/20'
                          : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{team.avatar}</span>
                        <div className="text-left">
                          <div className="text-white font-semibold">{team.name}</div>
                          <div className="text-sm text-slate-400">{team.owner.name}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Players to Offer */}
              <div className="mb-6">
                <label className="block text-white font-semibold mb-3">Players You&apos;re Offering</label>
                <div className="bg-slate-700/30 rounded-lg p-4 min-h-[100px] border-2 border-dashed border-slate-600">
                  {offeredPlayers.length === 0 ? (
                    <p className="text-slate-400 text-center py-4">Select players from your roster to offer</p>
                  ) : (
                    <div className="space-y-2">
                      {offeredPlayers.map(player => (
                        <div key={player.id} className="flex items-center justify-between p-3 bg-slate-600/50 rounded-lg">
                          <div>
                            <span className="text-white font-semibold">{player.name}</span>
                            <span className="text-slate-300 ml-2">({player.position} - {player.team})</span>
                          </div>
                          <button
                            onClick={() => setOfferedPlayers(prev => prev.filter(p => p.id !== player.id))}
                            className="text-red-400 hover:text-red-300"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Players to Request */}
              <div className="mb-6">
                <label className="block text-white font-semibold mb-3">Players You Want</label>
                <div className="bg-slate-700/30 rounded-lg p-4 min-h-[100px] border-2 border-dashed border-slate-600">
                  {requestedPlayers.length === 0 ? (
                    <p className="text-slate-400 text-center py-4">Select players you want in return</p>
                  ) : (
                    <div className="space-y-2">
                      {requestedPlayers.map(player => (
                        <div key={player.id} className="flex items-center justify-between p-3 bg-slate-600/50 rounded-lg">
                          <div>
                            <span className="text-white font-semibold">{player.name}</span>
                            <span className="text-slate-300 ml-2">({player.position} - {player.team})</span>
                          </div>
                          <button
                            onClick={() => setRequestedPlayers(prev => prev.filter(p => p.id !== player.id))}
                            className="text-red-400 hover:text-red-300"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Trade Message */}
              <div className="mb-6">
                <label className="block text-white font-semibold mb-3">Trade Message (Optional)</label>
                <textarea
                  value={tradeMessage}
                  onChange={(e) => setTradeMessage(e.target.value)}
                  placeholder="Explain your trade reasoning..."
                  className="form-input h-24 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowTradeAnalysis(true)}
                  disabled={offeredPlayers.length === 0 || requestedPlayers.length === 0}
                  className="btn btn-secondary flex-1"
                >
                  Analyze Trade
                </button>
                <button
                  onClick={handleProposeTrade}
                  disabled={!selectedTeam || offeredPlayers.length === 0 || requestedPlayers.length === 0}
                  className="btn btn-primary flex-1"
                >
                  Send Trade Proposal
                </button>
              </div>
            </div>
          </div>
        );

      case 'pending':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Pending Trades</h3>
              <span className="text-sm text-slate-400">
                {tradeProposals.filter(t => t.status === 'pending').length} active proposals
              </span>
            </div>

            {tradeProposals.filter(t => t.status === 'pending').length === 0 ? (
              <div className="card text-center py-8">
                <p className="text-slate-400 mb-4">No pending trades</p>
                <button
                  onClick={() => setActiveTab('propose')}
                  className="btn btn-primary"
                >
                  Propose a Trade
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {tradeProposals.filter(t => t.status === 'pending').map(trade => (
                  <motion.div
                    key={trade.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(trade.status)}`}>
                          {trade.status.toUpperCase()}
                        </span>
                        <span className="text-slate-400 text-sm">
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
                        <h4 className="text-white font-semibold mb-3">{trade.fromTeamName} Offers</h4>
                        <div className="space-y-2">
                          {trade.playersOffered.map(player => (
                            <div key={player.id} className="p-3 bg-slate-700/50 rounded-lg">
                              <div className="text-white font-medium">{player.name}</div>
                              <div className="text-sm text-slate-400">
                                {player.position} - {player.team} • {player.projectedPoints} pts
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Trade Arrow */}
                      <div className="flex items-center justify-center">
                        <div className="text-4xl text-blue-400">⇄</div>
                      </div>

                      {/* Requesting Team */}
                      <div>
                        <h4 className="text-white font-semibold mb-3">{trade.toTeamName} Gets</h4>
                        <div className="space-y-2">
                          {trade.playersRequested.map(player => (
                            <div key={player.id} className="p-3 bg-slate-700/50 rounded-lg">
                              <div className="text-white font-medium">{player.name}</div>
                              <div className="text-sm text-slate-400">
                                {player.position} - {player.team} • {player.projectedPoints} pts
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {trade.message && (
                      <div className="mb-4 p-3 bg-blue-900/20 border border-blue-600/30 rounded-lg">
                        <p className="text-blue-300 text-sm">{trade.message}</p>
                      </div>
                    )}

                    {/* Trade Analysis */}
                    <div className="mb-4 p-4 bg-slate-700/30 rounded-lg">
                      <h5 className="text-white font-semibold mb-2">Trade Analysis</h5>
                      <p className="text-slate-300 text-sm mb-3">{trade.analysis.summary}</p>
                      <div className="flex gap-4">
                        <span className="text-sm">
                          <span className="text-slate-400">{trade.fromTeamName}:</span>
                          <span className="text-white font-semibold ml-1">{trade.analysis.teamAGrade}</span>
                        </span>
                        <span className="text-sm">
                          <span className="text-slate-400">{trade.toTeamName}:</span>
                          <span className="text-white font-semibold ml-1">{trade.analysis.teamBGrade}</span>
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      {trade.toTeamId === userTeam?.id ? (
                        <>
                          <button
                            onClick={() => handleTradeAction(trade.id, 'accept')}
                            className="btn btn-success flex-1"
                          >
                            Accept Trade
                          </button>
                          <button
                            onClick={() => handleTradeAction(trade.id, 'counter')}
                            className="btn btn-secondary flex-1"
                          >
                            Counter Offer
                          </button>
                          <button
                            onClick={() => handleTradeAction(trade.id, 'reject')}
                            className="btn btn-danger flex-1"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <div className="flex-1 text-center py-2 text-slate-400">
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

      case 'history':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Trade History</h3>
            <div className="card text-center py-8">
              <p className="text-slate-400 mb-4">No completed trades yet</p>
              <p className="text-sm text-slate-500">Trade history will appear here once trades are completed</p>
            </div>
          </div>
        );

      case 'block':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Trade Block</h3>
              <p className="text-sm text-slate-400">Players available for trade</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tradeBlockPlayers.map(player => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card hover:border-blue-500 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-semibold">{player.name}</h4>
                      <p className="text-slate-400 text-sm">{player.position} - {player.team}</p>
                      <p className="text-slate-300 text-sm mt-1">Owner: {player.owner}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400 mb-2">{player.reason}</div>
                      <button className="btn btn-primary btn-sm">
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Trading Center</h2>
          <p className="text-slate-400">Propose trades and manage negotiations</p>
        </div>
        
        <div className="text-right">
          <div className="text-white font-semibold">Trade Deadline</div>
          <div className="text-sm text-orange-400">Week 12 (Nov 15)</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-800/50 rounded-lg p-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center justify-center gap-2 py-4 px-4 rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <span className="text-2xl">{tab.icon}</span>
            <div className="text-center">
              <div className="font-medium text-sm">{tab.label}</div>
              <div className="text-xs opacity-75">{tab.description}</div>
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
      <div className="card">
        <h4 className="text-lg font-bold text-white mb-3">Trade Rules</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="text-white font-semibold mb-2">General Rules</h5>
            <ul className="text-slate-400 space-y-1">
              <li>• Trade deadline: Week 12 (November 15)</li>
              <li>• Trades process immediately upon acceptance</li>
              <li>• No trade review period (commissioner approval only)</li>
              <li>• Maximum 7 days for trade response</li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-semibold mb-2">Restrictions</h5>
            <ul className="text-slate-400 space-y-1">
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

export default TradingSystem;