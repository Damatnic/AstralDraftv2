/**
 * Team Hub View Component
 * Clean rewrite focusing on core team management functionality
 */

import React, { useState } from 'react';
import { useAppState } from '../contexts/AppContext';

// Simple interfaces for this view
interface TeamHubViewProps {
  className?: string;
}

interface TeamData {
  id: string;
  name: string;
  owner: string;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
}

interface LeagueData {
  id: string;
  name: string;
  status: string;
  currentWeek: number;
}

/**
 * Team Hub View - Main team management interface
 */
const TeamHubView: React.FC<TeamHubViewProps> = ({ className = '' }) => {
  const { dispatch } = useAppState();
  const [activeTab, setActiveTab] = useState<'roster' | 'matchup' | 'trades' | 'analytics'>('roster');

  // Mock data for demonstration
  const teamData: TeamData = {
    id: 'team-1',
    name: 'The Championship Chasers',
    owner: 'Team Manager',
    wins: 8,
    losses: 4,
    pointsFor: 1456.75,
    pointsAgainst: 1234.25
  };

  const leagueData: LeagueData = {
    id: 'league-1',
    name: 'Fantasy Football League',
    status: 'IN_SEASON',
    currentWeek: 13
  };

  const handleTabChange = (tab: 'roster' | 'matchup' | 'trades' | 'analytics') => {
    setActiveTab(tab);
  };

  const handleNavigateTo = (_view: string) => {
    // Navigate to different view
    dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'roster':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Team Roster</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((player) => (
                <div key={player} className="bg-white p-4 rounded-lg shadow border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">P{player}</span>
                    </div>
                    <div>
                      <p className="font-medium">Player {player}</p>
                      <p className="text-sm text-gray-600">Position • Team</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'matchup':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Current Matchup</h3>
            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="font-medium">{teamData.name}</p>
                  <p className="text-2xl font-bold text-blue-600">0.00</p>
                  <p className="text-sm text-gray-600">Projected: 125.5</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Week {leagueData.currentWeek}</p>
                  <p className="text-lg font-medium">VS</p>
                  <p className="text-sm text-gray-600">In Progress</p>
                </div>
                <div className="text-center">
                  <p className="font-medium">Opponent Team</p>
                  <p className="text-2xl font-bold text-red-600">0.00</p>
                  <p className="text-sm text-gray-600">Projected: 118.2</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'trades':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Trade Center</h3>
            <div className="bg-white p-6 rounded-lg shadow border">
              <p className="text-gray-600 mb-4">Manage your trades and proposals</p>
              <div className="space-y-3">
                <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Propose New Trade
                </button>
                <button className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  View Trade History
                </button>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Team Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow border">
                <h4 className="font-medium mb-2">Season Stats</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Wins:</span>
                    <span className="font-medium">{teamData.wins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Losses:</span>
                    <span className="font-medium">{teamData.losses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Points For:</span>
                    <span className="font-medium">{teamData.pointsFor}</span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border">
                <h4 className="font-medium mb-2">Performance</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>League Rank:</span>
                    <span className="font-medium">3rd</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Playoff Odds:</span>
                    <span className="font-medium text-green-600">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Power Ranking:</span>
                    <span className="font-medium">2nd</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`team-hub-view p-6 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{teamData.name}</h1>
              <p className="text-gray-600 mt-1">
                {teamData.wins}-{teamData.losses} • {leagueData.name}
              </p>
            </div>
            <button
              onClick={() => handleNavigateTo('DASHBOARD')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'roster' as const, label: 'Roster' },
                { id: 'matchup' as const, label: 'Matchup' },
                { id: 'trades' as const, label: 'Trades' },
                { id: 'analytics' as const, label: 'Analytics' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-96">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default TeamHubView;
