/**
 * Roster Management Component
 * Comprehensive roster interface for managing team players
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../../contexts/AppContext';
import { Player, Team } from '../../types';
import { POSITION_GROUPS, NFL_TEAMS } from '../../data/nflPlayers';
import PlayerSearch from '../players/PlayerSearch';

interface RosterManagementProps {
  team: Team;
  isOwner?: boolean;
  showAddDropButtons?: boolean;

}

interface RosterSlot {
  position: string;
  player: Player | null;
  isStarter: boolean;
  isLocked?: boolean;

const RosterManagement: React.FC<RosterManagementProps> = ({
  team,
  isOwner = false,
  showAddDropButtons = false
}) => {
  const { state, dispatch } = useAppState();
  const [showPlayerSearch, setShowPlayerSearch] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [rosterView, setRosterView] = useState<'starters' | 'bench' | 'all'>('all');

  const league = state.leagues[0];
  
  // Create roster slots based on league settings
  const createRosterSlots = (): RosterSlot[] => {
    const slots: RosterSlot[] = [];
    const rosterFormat = league.settings.rosterFormat;
    
    // Starting lineup slots
    Object.entries(rosterFormat).forEach(([position, count]) => {
      if (position === 'BENCH' || position === 'IR') return;
      
      for (let i = 0; i < count; i++) {
        const player = team.roster.find((p: any) => 
          p.position === position && 
          !slots.some((slot: any) => slot.player?.id === p.id)
        ) || null;
        
        slots.push({
          position,
          player,
          isStarter: true,
          isLocked: false
        });

    });
    
    // Bench slots
    const benchPlayers = team.roster.filter((p: any) => 
      !slots.some((slot: any) => slot.player?.id === p.id)
    );
    
    for (let i = 0; i < rosterFormat.BENCH; i++) {
      slots.push({
        position: 'BENCH',
        player: benchPlayers[i] || null,
        isStarter: false,
        isLocked: false
      });

    // IR slots
    for (let i = 0; i < (rosterFormat.IR || 0); i++) {
      slots.push({
        position: 'IR',
        player: null, // IR players would be handled separately
        isStarter: false,
        isLocked: false
      });

    return slots;
  };

  const rosterSlots = createRosterSlots();
  const starterSlots = rosterSlots.filter((slot: any) => slot.isStarter);
  const benchSlots = rosterSlots.filter((slot: any) => slot.position === 'BENCH');
  const irSlots = rosterSlots.filter((slot: any) => slot.position === 'IR');

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'QB': return 'bg-red-600';
      case 'RB': return 'bg-green-600';
      case 'WR': return 'bg-blue-600';
      case 'TE': return 'bg-yellow-600';
      case 'FLEX': return 'bg-purple-600';
      case 'K': return 'bg-pink-600';
      case 'DST': return 'bg-gray-600';
      case 'BENCH': return 'bg-slate-600';
      case 'IR': return 'bg-red-800';
      default: return 'bg-gray-500';

  };

  const getInjuryStatusColor = (status: string) => {
    switch (status) {
      case 'HEALTHY': return 'text-green-400';
      case 'QUESTIONABLE': return 'text-yellow-400';
      case 'DOUBTFUL': return 'text-orange-400';
      case 'OUT': return 'text-red-400';
      case 'IR': return 'text-red-600';
      default: return 'text-gray-400';

  };

  const handleAddPlayer = (position: string) => {
    setSelectedPosition(position);
    setShowPlayerSearch(true);
  };

  const handlePlayerSelect = (player: Player) => {
    // Add player to roster
    dispatch({
      type: 'ADD_PLAYER_TO_ROSTER',
      payload: { teamId: team.id, player }
    });
    
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        message: `${player.name} added to ${team.name}!`,
        type: 'SUCCESS'

    });
    
    setShowPlayerSearch(false);
    setSelectedPosition('');
  };

  const handleDropPlayer = (player: Player) => {
    if (window.confirm(`Are you sure you want to drop ${player.name}?`)) {
      dispatch({
        type: 'REMOVE_PLAYER_FROM_ROSTER',
        payload: { teamId: team.id, playerId: player.id }
      });
      
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: `${player.name} dropped from ${team.name}`,
          type: 'INFO'

      });

  };

  const RosterSlotComponent: React.FC<{ slot: RosterSlot; index: number }> = ({ slot, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`p-4 rounded-lg border-2 ${
        slot.player 
          ? 'bg-slate-700/50 border-slate-600 hover:border-slate-500' 
          : 'bg-slate-800/50 border-dashed border-slate-600 hover:border-slate-500'
      } transition-colors`}
    >
      {/* Position Label */}
      <div className="flex items-center justify-between mb-3 sm:px-4 md:px-6 lg:px-8">
        <div className={`${getPositionColor(slot.position)} text-white text-xs font-bold px-2 py-1 rounded`}>
          {slot.position}
        </div>
        {slot.isStarter && (
          <span className="text-xs text-green-400 font-medium sm:px-4 md:px-6 lg:px-8">STARTER</span>
        )}
      </div>

      {slot.player ? (
        /* Player Card */
        <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-start justify-between sm:px-4 md:px-6 lg:px-8">
            <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
              <h4 className="text-white font-semibold text-sm mb-1 sm:px-4 md:px-6 lg:px-8">
                {slot.player.name}
              </h4>
              <div className="flex items-center gap-2 text-xs text-slate-400 sm:px-4 md:px-6 lg:px-8">
                <span>{NFL_TEAMS[slot.player.team as keyof typeof NFL_TEAMS]?.name || slot.player.team}</span>
                <span>•</span>
                <span>#{slot.player.jerseyNumber}</span>
                <span className={getInjuryStatusColor(slot.player.injuryStatus)}>
                  ●
                </span>
              </div>
            </div>
            
            {showAddDropButtons && isOwner && (
              <button
                onClick={() => handleDropPlayer(slot.player!)}
              >
                Drop
              </button>
            )}
          </div>

          {/* Player Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs sm:px-4 md:px-6 lg:px-8">
            <div className="text-center p-2 bg-slate-800/50 rounded sm:px-4 md:px-6 lg:px-8">
              <div className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">#{slot.player.fantasyRank}</div>
              <div className="text-slate-400 sm:px-4 md:px-6 lg:px-8">Rank</div>
            </div>
            <div className="text-center p-2 bg-slate-800/50 rounded sm:px-4 md:px-6 lg:px-8">
              <div className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">{slot.player.projectedPoints.toFixed(1)}</div>
              <div className="text-slate-400 sm:px-4 md:px-6 lg:px-8">Proj</div>
            </div>
          </div>

          {/* Bye Week Warning */}
          {slot.player.byeWeek && (
            <div className="text-xs text-yellow-400 text-center sm:px-4 md:px-6 lg:px-8">
              Bye Week {slot.player.byeWeek}
            </div>
          )}
        </div>
      ) : (
        /* Empty Slot */
        <div className="text-center py-6 sm:px-4 md:px-6 lg:px-8">
          <div className="text-slate-500 text-2xl mb-2 sm:px-4 md:px-6 lg:px-8">+</div>
          <div className="text-slate-400 text-sm mb-3 sm:px-4 md:px-6 lg:px-8">Empty Slot</div>
          {showAddDropButtons && isOwner && (
            <button
              onClick={() => handleAddPlayer(slot.position)}
            >
              Add Player
            </button>
          )}
        </div>
      )}
    </motion.div>
  );

  const filteredSlots = () => {
    switch (rosterView) {
      case 'starters':
        return starterSlots;
      case 'bench':
        return [...benchSlots, ...irSlots];
      default:
        return rosterSlots;

  };

  return (
    <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
        <div>
          <h3 className="text-xl font-bold text-white sm:px-4 md:px-6 lg:px-8">
            {team.name} Roster
          </h3>
          <p className="text-slate-400 sm:px-4 md:px-6 lg:px-8">
            {team.roster.length} / {Object.values(league.settings.rosterFormat).reduce((a, b) => a + b, 0)} players
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex bg-slate-800 rounded-lg p-1 sm:px-4 md:px-6 lg:px-8">
          {(['all', 'starters', 'bench'] as const).map((view: any) => (
            <button
              key={view}
              onClick={() => setRosterView(view)}`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredSlots().map((slot, index) => (
          <RosterSlotComponent key={`${slot.position}-${index}`} slot={slot} index={index} />
        ))}
      </div>

      {/* Team Stats Summary */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 sm:px-4 md:px-6 lg:px-8">
        <h4 className="text-lg font-semibold text-white mb-4 sm:px-4 md:px-6 lg:px-8">Team Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center sm:px-4 md:px-6 lg:px-8">
            <div className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">
              {team.roster.reduce((sum, player) => sum + player.projectedPoints, 0).toFixed(1)}
            </div>
            <div className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">Total Projected Points</div>
          </div>
          <div className="text-center sm:px-4 md:px-6 lg:px-8">
            <div className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">
              {team.record.wins}-{team.record.losses}
            </div>
            <div className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">Record</div>
          </div>
          <div className="text-center sm:px-4 md:px-6 lg:px-8">
            <div className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">
              ${team.faab}
            </div>
            <div className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">FAAB Remaining</div>
          </div>
          <div className="text-center sm:px-4 md:px-6 lg:px-8">
            <div className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">
              {team.roster.filter((p: any) => p.injuryStatus === 'HEALTHY').length}
            </div>
            <div className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">Healthy Players</div>
          </div>
        </div>
      </div>

      {/* Player Search Modal */}
      <AnimatePresence>
        {showPlayerSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sm:px-4 md:px-6 lg:px-8"
            onClick={() => setShowPlayerSearch(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto sm:px-4 md:px-6 lg:px-8"
              onClick={(e: any) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 sm:px-4 md:px-6 lg:px-8">
                <h3 className="text-xl font-bold text-white sm:px-4 md:px-6 lg:px-8">
                  Add Player {selectedPosition && `(${selectedPosition})`}
                </h3>
                <button
                  onClick={() => setShowPlayerSearch(false)}
                >
                  ×
                </button>
              </div>
              
              <PlayerSearch
                onPlayerSelect={handlePlayerSelect}
                filterPosition={selectedPosition === 'FLEX' ? '' : selectedPosition}
                excludePlayerIds={team.roster.map((p: any) => p.id)}
                showAddButton={true}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const RosterManagementWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <RosterManagement {...props} />
  </ErrorBoundary>
);

export default React.memo(RosterManagementWithErrorBoundary);