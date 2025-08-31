/**
 * Commissioner Tools Component
 * Administrative tools for league management
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../../contexts/AppContext';
import { Team, Player } from '../../types';

interface CommissionerToolsProps {
  isCommissioner?: boolean;

}

const CommissionerTools: React.FC<CommissionerToolsProps> = ({ isCommissioner = false }) => {
  const { state, dispatch } = useAppState();
  const [activeTab, setActiveTab] = useState<'teams' | 'settings' | 'players' | 'schedule'>('teams');
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [newTeamName, setNewTeamName] = useState('');

  const league = state.leagues[0];

  if (!isCommissioner) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 text-center sm:px-4 md:px-6 lg:px-8">
        <div className="text-4xl mb-4 sm:px-4 md:px-6 lg:px-8">🔒</div>
        <h3 className="text-xl font-bold text-white mb-2 sm:px-4 md:px-6 lg:px-8">Access Denied</h3>
        <p className="text-slate-400 sm:px-4 md:px-6 lg:px-8">You must be the league commissioner to access these tools.</p>
      </div>
    );

  const handleTeamNameUpdate = (team: Team) => {
    if (newTeamName.trim() && newTeamName !== team.name) {
      dispatch({
        type: 'UPDATE_TEAM_NAME',
        payload: { teamId: team.id, name: newTeamName.trim() }
      });
      
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: `Team name updated to "${newTeamName.trim()}"`,
          type: 'SUCCESS'

      });

    setEditingTeam(null);
    setNewTeamName('');
  };

  const handleForcePlayerAdd = (teamId: number, player: Player) => {
    dispatch({
      type: 'ADD_PLAYER_TO_ROSTER',
      payload: { teamId, player }
    });
    
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        message: `Commissioner added ${player.name} to roster`,
        type: 'INFO'

    });
  };

  const handleForcePlayerDrop = (teamId: number, playerId: number) => {
    const team = league.teams.find((t: any) => t.id === teamId);
    const player = team?.roster.find((p: any) => p.id === playerId);
    
    if (player && window.confirm(`Force drop ${player.name}?`)) {
      dispatch({
        type: 'REMOVE_PLAYER_FROM_ROSTER',
        payload: { teamId, playerId }
      });
      
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: `Commissioner dropped ${player.name}`,
          type: 'INFO'

      });

  };

  const tabs = [
    { id: 'teams', label: 'Team Management', icon: '👥' },
    { id: 'settings', label: 'League Settings', icon: '⚙️' },
    { id: 'players', label: 'Player Management', icon: '🏈' },
    { id: 'schedule', label: 'Schedule', icon: '📅' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'teams':
        return (
          <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
              <h3 className="text-xl font-bold text-white sm:px-4 md:px-6 lg:px-8">Team Management</h3>
              <p className="text-slate-400 sm:px-4 md:px-6 lg:px-8">Manage team names, rosters, and settings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {league.teams.map((team: any) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 sm:px-4 md:px-6 lg:px-8"
                >
                  <div className="flex items-center justify-between mb-3 sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                      <span className="text-2xl sm:px-4 md:px-6 lg:px-8">{team.avatar}</span>
                      <div>
                        {editingTeam?.id === team.id ? (
                          <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                            <input
                              type="text"
                              value={newTeamName}
                              onChange={(e: any) => setNewTeamName(e.target.value)}
                              placeholder={team.name}
                              autoFocus
                            />
                            <button
                              onClick={() => handleTeamNameUpdate(team)}
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingTeam(null);
                                setNewTeamName('');
                              }}
                              className="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded sm:px-4 md:px-6 lg:px-8"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <h4 className="font-semibold text-white sm:px-4 md:px-6 lg:px-8">{team.name}</h4>
                        )}
                        <p className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">{team.owner.name}</p>
                      </div>
                    </div>
                    
                    {editingTeam?.id !== team.id && (
                      <button
                        onClick={() => {
                          setEditingTeam(team);
                          setNewTeamName(team.name);
                        }}
                        className="text-blue-400 hover:text-blue-300 text-sm sm:px-4 md:px-6 lg:px-8"
                      >
                        Edit Name
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-sm sm:px-4 md:px-6 lg:px-8">
                    <div className="text-center p-2 bg-slate-800/50 rounded sm:px-4 md:px-6 lg:px-8">
                      <div className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">{team.roster.length}</div>
                      <div className="text-slate-400 sm:px-4 md:px-6 lg:px-8">Players</div>
                    </div>
                    <div className="text-center p-2 bg-slate-800/50 rounded sm:px-4 md:px-6 lg:px-8">
                      <div className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">
                        {team.record.wins}-{team.record.losses}
                      </div>
                      <div className="text-slate-400 sm:px-4 md:px-6 lg:px-8">Record</div>
                    </div>
                    <div className="text-center p-2 bg-slate-800/50 rounded sm:px-4 md:px-6 lg:px-8">
                      <div className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">${team.faab}</div>
                      <div className="text-slate-400 sm:px-4 md:px-6 lg:px-8">FAAB</div>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2 sm:px-4 md:px-6 lg:px-8">
                    <button className="flex-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                      View Roster
                    </button>
                    <button className="flex-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                      Force Trade
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
              <h3 className="text-xl font-bold text-white sm:px-4 md:px-6 lg:px-8">League Settings</h3>
              <p className="text-slate-400 sm:px-4 md:px-6 lg:px-8">Modify league configuration</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Settings */}
              <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 sm:px-4 md:px-6 lg:px-8">
                <h4 className="font-semibold text-white mb-3 sm:px-4 md:px-6 lg:px-8">Basic Settings</h4>
                <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                  <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                    <span className="text-slate-300 sm:px-4 md:px-6 lg:px-8">League Name</span>
                    <span className="text-white font-medium sm:px-4 md:px-6 lg:px-8">{league.name}</span>
                  </div>
                  <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                    <span className="text-slate-300 sm:px-4 md:px-6 lg:px-8">Scoring Format</span>
                    <span className="text-white font-medium sm:px-4 md:px-6 lg:px-8">{league.settings.scoringFormat}</span>
                  </div>
                  <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                    <span className="text-slate-300 sm:px-4 md:px-6 lg:px-8">Team Count</span>
                    <span className="text-white font-medium sm:px-4 md:px-6 lg:px-8">{league.settings.teamCount}</span>
                  </div>
                  <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                    <span className="text-slate-300 sm:px-4 md:px-6 lg:px-8">Playoff Teams</span>
                    <span className="text-white font-medium sm:px-4 md:px-6 lg:px-8">{league.settings.playoffTeams}</span>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                  Edit Basic Settings
                </button>
              </div>

              {/* Draft Settings */}
              <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 sm:px-4 md:px-6 lg:px-8">
                <h4 className="font-semibold text-white mb-3 sm:px-4 md:px-6 lg:px-8">Draft Settings</h4>
                <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                  <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                    <span className="text-slate-300 sm:px-4 md:px-6 lg:px-8">Draft Format</span>
                    <span className="text-white font-medium sm:px-4 md:px-6 lg:px-8">{league.settings.draftFormat}</span>
                  </div>
                  <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                    <span className="text-slate-300 sm:px-4 md:px-6 lg:px-8">Draft Date</span>
                    <span className="text-white font-medium sm:px-4 md:px-6 lg:px-8">Aug 31, 2025</span>
                  </div>
                  <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                    <span className="text-slate-300 sm:px-4 md:px-6 lg:px-8">Seconds Per Pick</span>
                    <span className="text-white font-medium sm:px-4 md:px-6 lg:px-8">{league.settings.draftSecondsPerPick}s</span>
                  </div>
                  <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                    <span className="text-slate-300 sm:px-4 md:px-6 lg:px-8">Draft Rounds</span>
                    <span className="text-white font-medium sm:px-4 md:px-6 lg:px-8">{league.settings.draftRounds}</span>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                  Edit Draft Settings
                </button>
              </div>

              {/* Waiver Settings */}
              <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 sm:px-4 md:px-6 lg:px-8">
                <h4 className="font-semibold text-white mb-3 sm:px-4 md:px-6 lg:px-8">Waiver Settings</h4>
                <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                  <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                    <span className="text-slate-300 sm:px-4 md:px-6 lg:px-8">Waiver Type</span>
                    <span className="text-white font-medium sm:px-4 md:px-6 lg:px-8">{league.settings.waiverType}</span>
                  </div>
                  <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                    <span className="text-slate-300 sm:px-4 md:px-6 lg:px-8">FAAB Budget</span>
                    <span className="text-white font-medium sm:px-4 md:px-6 lg:px-8">${league.settings.waiverBudget}</span>
                  </div>
                  <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                    <span className="text-slate-300 sm:px-4 md:px-6 lg:px-8">Process Day</span>
                    <span className="text-white font-medium sm:px-4 md:px-6 lg:px-8">Wednesday</span>
                  </div>
                  <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                    <span className="text-slate-300 sm:px-4 md:px-6 lg:px-8">Trade Deadline</span>
                    <span className="text-white font-medium sm:px-4 md:px-6 lg:px-8">Week {league.settings.tradeDeadline}</span>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                  Edit Waiver Settings
                </button>
              </div>

              {/* Prize Pool */}
              <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 sm:px-4 md:px-6 lg:px-8">
                <h4 className="font-semibold text-white mb-3 sm:px-4 md:px-6 lg:px-8">Prize Pool</h4>
                <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                  <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                    <span className="text-slate-300 sm:px-4 md:px-6 lg:px-8">Entry Fee</span>
                    <span className="text-white font-medium sm:px-4 md:px-6 lg:px-8">${league.dues?.amount || 50}</span>
                  </div>
                  <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                    <span className="text-slate-300 sm:px-4 md:px-6 lg:px-8">1st Place</span>
                    <span className="text-green-400 font-medium sm:px-4 md:px-6 lg:px-8">${league.payouts.firstPlace}</span>
                  </div>
                  <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                    <span className="text-slate-300 sm:px-4 md:px-6 lg:px-8">2nd Place</span>
                    <span className="text-blue-400 font-medium sm:px-4 md:px-6 lg:px-8">${league.payouts.secondPlace}</span>
                  </div>
                  <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                    <span className="text-slate-300 sm:px-4 md:px-6 lg:px-8">3rd Place</span>
                    <span className="text-orange-400 font-medium sm:px-4 md:px-6 lg:px-8">${league.payouts.thirdPlace}</span>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                  Edit Prize Pool
                </button>
              </div>
            </div>
          </div>
        );

      case 'players':
        return (
          <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
              <h3 className="text-xl font-bold text-white sm:px-4 md:px-6 lg:px-8">Player Management</h3>
              <p className="text-slate-400 sm:px-4 md:px-6 lg:px-8">Add, remove, or modify players</p>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600 sm:px-4 md:px-6 lg:px-8">
              <h4 className="font-semibold text-white mb-4 sm:px-4 md:px-6 lg:px-8">Quick Actions</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-center sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                  <div className="text-2xl mb-2 sm:px-4 md:px-6 lg:px-8">➕</div>
                  <div className="text-sm sm:px-4 md:px-6 lg:px-8">Add Player</div>
                </button>
                <button className="p-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-center sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                  <div className="text-2xl mb-2 sm:px-4 md:px-6 lg:px-8">➖</div>
                  <div className="text-sm sm:px-4 md:px-6 lg:px-8">Remove Player</div>
                </button>
                <button className="p-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors text-center sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                  <div className="text-2xl mb-2 sm:px-4 md:px-6 lg:px-8">🏥</div>
                  <div className="text-sm sm:px-4 md:px-6 lg:px-8">Injury Update</div>
                </button>
                <button className="p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-center sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                  <div className="text-2xl mb-2 sm:px-4 md:px-6 lg:px-8">🔄</div>
                  <div className="text-sm sm:px-4 md:px-6 lg:px-8">Force Move</div>
                </button>
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600 sm:px-4 md:px-6 lg:px-8">
              <h4 className="font-semibold text-white mb-4 sm:px-4 md:px-6 lg:px-8">Player Database Stats</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">{league.allPlayers.length}</div>
                  <div className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">Total Players</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">
                    {league.allPlayers.filter((p: any) => p.position === 'QB').length}
                  </div>
                  <div className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">Quarterbacks</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">
                    {league.allPlayers.filter((p: any) => p.position === 'RB').length}
                  </div>
                  <div className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">Running Backs</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">
                    {league.allPlayers.filter((p: any) => p.position === 'WR').length}
                  </div>
                  <div className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">Wide Receivers</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'schedule':
        return (
          <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
              <h3 className="text-xl font-bold text-white sm:px-4 md:px-6 lg:px-8">Schedule Management</h3>
              <p className="text-slate-400 sm:px-4 md:px-6 lg:px-8">Manage matchups and season schedule</p>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600 text-center sm:px-4 md:px-6 lg:px-8">
              <div className="text-4xl mb-4 sm:px-4 md:px-6 lg:px-8">📅</div>
              <h4 className="text-lg font-semibold text-white mb-2 sm:px-4 md:px-6 lg:px-8">Schedule Coming Soon</h4>
              <p className="text-slate-400 mb-4 sm:px-4 md:px-6 lg:px-8">
                Schedule generation and management tools will be available after the draft.
              </p>
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                Generate Schedule
              </button>
            </div>
          </div>
        );

      default:
        return null;

  };

  return (
    <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
        <div>
          <h2 className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">Commissioner Tools</h2>
          <p className="text-slate-400 sm:px-4 md:px-6 lg:px-8">Administrative controls for {league.name}</p>
        </div>
        <div className="flex items-center gap-2 text-yellow-400 sm:px-4 md:px-6 lg:px-8">
          <span className="text-xl sm:px-4 md:px-6 lg:px-8">👑</span>
          <span className="font-medium sm:px-4 md:px-6 lg:px-8">Commissioner Access</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-slate-800/50 rounded-lg p-1 sm:px-4 md:px-6 lg:px-8">
        {tabs.map((tab: any) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}`}
          >
            <span>{tab.icon}</span>
            <span className="font-medium sm:px-4 md:px-6 lg:px-8">{tab.label}</span>
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
    </div>
  );
};

const CommissionerToolsWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <CommissionerTools {...props} />
  </ErrorBoundary>
);

export default React.memo(CommissionerToolsWithErrorBoundary);