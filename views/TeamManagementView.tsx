/**
 * Comprehensive Team Management Interface
 * Advanced roster editing, lineup optimization, and player transaction history
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiTrendingUp, FiClock, FiBarChart, FiChevronLeft } from 'react-icons/fi';
import { logger } from '../services/loggingService';

// Type definitions
export interface Player {
  id: string;
  name: string;
  position: string;
  team: string;
  projectedPoints: number;
  averagePoints: number;
  isStarting: boolean;
  injuryStatus?: string;
}

export interface Team {
  id: string;
  name: string;
  owner: string;
  roster: Player[];
  record: { wins: number; losses: number; ties: number };
  totalPoints: number;

export interface League {
  id: string;
  name: string;
  teams: Team[];
  currentWeek: number;
  settings: Record<string, unknown>;


export interface Transaction {
  id: string;
  type: 'add' | 'drop' | 'trade' | 'waiver';
  player: Player;
  timestamp: string;
  description: string;}

export type TabType = 'roster' | 'lineup' | 'transactions' | 'analytics';
}

interface TeamManagementViewProps {
  onBack?: () => void;}

const TeamManagementView: React.FC<TeamManagementViewProps> = ({ onBack }: any) => {
  // State management
  const [activeTab, setActiveTab] = useState<TabType>('roster');
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [league] = useState<League>({
    id: 'league-1',
    name: 'Sample League',
    currentWeek: 1,
    teams: generateMockTeams(),
    settings: {}
  });

  // Get selected team
  const selectedTeam = selectedTeamId 
    ? league.teams.find((team: any) => team.id === selectedTeamId)
    : league.teams[0];

  // Mock data generation
  function generateMockTeams(): Team[] {
    return [
      {
        id: 'team-1',
        name: 'Team Alpha',
        owner: 'User 1',
        record: { wins: 3, losses: 1, ties: 0 },
        totalPoints: 450.5,
        roster: generateMockRoster()
      },
      {
        id: 'team-2',
        name: 'Team Beta',
        owner: 'User 2',
        record: { wins: 2, losses: 2, ties: 0 },
        totalPoints: 425.0,
        roster: generateMockRoster()

    ];

  function generateMockRoster(): Player[] {
    return [
      {
        id: 'player-1',
        name: 'Josh Allen',
        position: 'QB',
        team: 'BUF',
        projectedPoints: 24.5,
        averagePoints: 22.3,
        isStarting: true
      },
      {
        id: 'player-2',
        name: 'Christian McCaffrey',
        position: 'RB',
        team: 'SF',
        projectedPoints: 18.2,
        averagePoints: 19.1,
        isStarting: true
      },
      {
        id: 'player-3',
        name: 'Cooper Kupp',
        position: 'WR',
        team: 'LAR',
        projectedPoints: 15.8,
        averagePoints: 16.5,
        isStarting: true,
        injuryStatus: 'Questionable'
      },
      {
        id: 'player-4',
        name: 'Travis Kelce',
        position: 'TE',
        team: 'KC',
        projectedPoints: 14.2,
        averagePoints: 13.8,
        isStarting: true

    ];

  // Tab handlers
  const handleTabChange = (tab: TabType): void => {
    setActiveTab(tab);
    logger.info(`Switched to ${tab} tab`);
  };

  const handleTeamSelect = (teamId: string): void => {
    setSelectedTeamId(teamId);
    logger.info(`Selected team: ${teamId}`);
  };

  // Render functions
  const renderRosterTab = (): React.ReactNode => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Starting Lineup</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedTeam?.roster.filter((player: any) => player.isStarting).map((player: any) => (
            <div key={player.id} className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">{player.name}</h4>
                <span className="text-xs px-2 py-1 bg-blue-600 text-white rounded">
                  {player.position}
                </span>
              </div>
              <div className="text-sm text-gray-300 mb-2">{player.team}</div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Proj: {player.projectedPoints}</span>
                <span className="text-gray-400">Avg: {player.averagePoints}</span>
              </div>
              {player.injuryStatus && (
                <div className="mt-2 text-xs text-yellow-400">
                  {player.injuryStatus}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Bench Players</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {selectedTeam?.roster.filter((player: any) => !player.isStarting).map((player: any) => (
            <div key={player.id} className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-white font-medium text-sm">{player.name}</div>
              <div className="text-xs text-gray-300">{player.position} - {player.team}</div>
              <div className="text-xs text-gray-400">Proj: {player.projectedPoints}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderLineupTab = (): React.ReactNode => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
    >
      <h3 className="text-xl font-bold text-white mb-4">Lineup Optimizer</h3>
      <p className="text-gray-300 mb-6">
        Optimize your lineup for maximum points based on projections and matchups.
      </p>
      
      <div className="space-y-4">
        <button className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
          Generate Optimal Lineup
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Current Projected Points</h4>
            <div className="text-2xl font-bold text-white">
              {selectedTeam?.roster
                .filter((p: any) => p.isStarting)
                .reduce((sum, p) => sum + p.projectedPoints, 0)
                .toFixed(1)}
            </div>
          </div>
          
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Optimal Projected Points</h4>
            <div className="text-2xl font-bold text-green-400">
              {selectedTeam?.roster
                .sort((a, b) => b.projectedPoints - a.projectedPoints)
                .slice(0, 9)
                .reduce((sum, p) => sum + p.projectedPoints, 0)
                .toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderTransactionsTab = (): React.ReactNode => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
    >
      <h3 className="text-xl font-bold text-white mb-4">Recent Transactions</h3>
      <div className="space-y-3">
        {generateMockTransactions().map((transaction: any) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
            <div>
              <div className="text-white font-medium">{transaction.description}</div>
              <div className="text-sm text-gray-400">
                {new Date(transaction.timestamp).toLocaleDateString()}
              </div>
            </div>
            <span className={`px-2 py-1 rounded text-xs ${
              transaction.type === 'add' ? 'bg-green-600 text-white' :
              transaction.type === 'drop' ? 'bg-red-600 text-white' :
              transaction.type === 'trade' ? 'bg-blue-600 text-white' :
              'bg-yellow-600 text-white'
            }`}>
              {transaction.type.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderAnalyticsTab = (): React.ReactNode => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h4 className="text-white font-medium mb-2">Team Record</h4>
          <div className="text-2xl font-bold text-white">
            {selectedTeam?.record.wins}-{selectedTeam?.record.losses}-{selectedTeam?.record.ties}
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h4 className="text-white font-medium mb-2">Total Points</h4>
          <div className="text-2xl font-bold text-white">
            {selectedTeam?.totalPoints.toFixed(1)}
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h4 className="text-white font-medium mb-2">Average Points</h4>
          <div className="text-2xl font-bold text-white">
            {((selectedTeam?.totalPoints || 0) / 4).toFixed(1)}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Position Strength</h3>
        <div className="space-y-3">
          {['QB', 'RB', 'WR', 'TE'].map((position: any) => {
            const positionPlayers = selectedTeam?.roster.filter((p: any) => p.position === position) || [];
            const avgPoints = positionPlayers.reduce((sum, p) => sum + p.averagePoints, 0) / positionPlayers.length || 0;
            
            return (
              <div key={position} className="flex items-center justify-between">
                <span className="text-white font-medium">{position}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (avgPoints / 20) * 100)}%` }}
                    />
                  </div>
                  <span className="text-gray-300 text-sm w-12">{avgPoints.toFixed(1)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );

  function generateMockTransactions(): Transaction[] {
    const mockPlayer: Player = {
      id: 'temp-player',
      name: 'Sample Player',
      position: 'RB',
      team: 'NYJ',
      projectedPoints: 12.0,
      averagePoints: 11.5,
      isStarting: false
    };

    return [
      {
        id: 'trans-1',
        type: 'add',
        player: mockPlayer,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        description: 'Added Sample Player from waivers'
      },
      {
        id: 'trans-2',
        type: 'drop',
        player: mockPlayer,
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        description: 'Dropped Sample Player to waivers'

    ];

  // Tab configuration
  const tabs = [
    { id: 'roster' as TabType, label: 'Roster', icon: FiUsers },
    { id: 'lineup' as TabType, label: 'Lineup', icon: FiTrendingUp },
    { id: 'transactions' as TabType, label: 'Transactions', icon: FiClock },
    { id: 'analytics' as TabType, label: 'Analytics', icon: FiBarChart }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              {onBack && (
                <button
                  onClick={onBack}
                >
                  <FiChevronLeft className="w-6 h-6" />
                </button>
              )}
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Team Management
                </h1>
                <p className="text-gray-300">
                  Manage your roster, optimize lineups, and track performance
                </p>
              </div>
            </div>
            
            {/* Team Selector */}
            <select
              value={selectedTeamId || league.teams[0]?.id || ''}
              onChange={(e: any) => handleTeamSelect(e.target.value)}
            >
              {league.teams.map((team: any) => (
                <option key={team.id} value={team.id}>
                  {team.name} ({team.owner})
                </option>
              ))}
            </select>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-xl">
            {tabs.map((tab: any) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <div key={activeTab}>
            {activeTab === 'roster' && renderRosterTab()}
            {activeTab === 'lineup' && renderLineupTab()}
            {activeTab === 'transactions' && renderTransactionsTab()}
            {activeTab === 'analytics' && renderAnalyticsTab()}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TeamManagementView;
