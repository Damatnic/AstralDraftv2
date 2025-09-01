/**
 * Roster Management Component
 * Comprehensive roster interface for managing team players
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo, useState } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;
import { Player, Team } from &apos;../../types&apos;;
import { POSITION_GROUPS, NFL_TEAMS } from &apos;../../data/nflPlayers&apos;;
import PlayerSearch from &apos;../players/PlayerSearch&apos;;

interface RosterManagementProps {
}
  team: Team;
  isOwner?: boolean;
  showAddDropButtons?: boolean;

}

interface RosterSlot {
}
  position: string;
  player: Player | null;
  isStarter: boolean;
  isLocked?: boolean;
}

const RosterManagement: React.FC<RosterManagementProps> = ({
}
  team,
  isOwner = false,
  showAddDropButtons = false
}: any) => {
}
  const { state, dispatch } = useAppState();
  const [showPlayerSearch, setShowPlayerSearch] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<string>(&apos;&apos;);
  const [rosterView, setRosterView] = useState<&apos;starters&apos; | &apos;bench&apos; | &apos;all&apos;>(&apos;all&apos;);

  const league = state.leagues[0];
  
  // Create roster slots based on league settings
  const createRosterSlots = (): RosterSlot[] => {
}
    const slots: RosterSlot[] = [];
    const rosterFormat = league.settings.rosterFormat;
    
    // Starting lineup slots
    Object.entries(rosterFormat).forEach(([position, count]) => {
}
      if (position === &apos;BENCH&apos; || position === &apos;IR&apos;) return;
      
      for (let i = 0; i < count; i++) {
}
        const player = team.roster.find((p: any) => 
          p.position === position && 
          !slots.some((slot: any) => slot.player?.id === p.id)
        ) || null;
        
        slots.push({
}
          position,
          player,
          isStarter: true,
          isLocked: false
        });
      }
    });
    
    // Bench slots
    const benchPlayers = team.roster.filter((p: any) => 
      !slots.some((slot: any) => slot.player?.id === p.id)
    );
    
    for (let i = 0; i < rosterFormat.BENCH; i++) {
}
      slots.push({
}
        position: &apos;BENCH&apos;,
        player: benchPlayers[i] || null,
        isStarter: false,
        isLocked: false
      });
    }

    // IR slots
    for (let i = 0; i < (rosterFormat.IR || 0); i++) {
}
      slots.push({
}
        position: &apos;IR&apos;,
        player: null, // IR players would be handled separately
        isStarter: false,
        isLocked: false
      });
    }

    return slots;
  };

  const rosterSlots = createRosterSlots();
  const starterSlots = rosterSlots.filter((slot: any) => slot.isStarter);
  const benchSlots = rosterSlots.filter((slot: any) => slot.position === &apos;BENCH&apos;);
  const irSlots = rosterSlots.filter((slot: any) => slot.position === &apos;IR&apos;);

  const getPositionColor = (position: string) => {
}
    switch (position) {
}
      case &apos;QB&apos;: return &apos;bg-red-600&apos;;
      case &apos;RB&apos;: return &apos;bg-green-600&apos;;
      case &apos;WR&apos;: return &apos;bg-blue-600&apos;;
      case &apos;TE&apos;: return &apos;bg-yellow-600&apos;;
      case &apos;FLEX&apos;: return &apos;bg-purple-600&apos;;
      case &apos;K&apos;: return &apos;bg-pink-600&apos;;
      case &apos;DST&apos;: return &apos;bg-gray-600&apos;;
      case &apos;BENCH&apos;: return &apos;bg-slate-600&apos;;
      case &apos;IR&apos;: return &apos;bg-red-800&apos;;
      default: return &apos;bg-gray-500&apos;;
    }
  };

  const getInjuryStatusColor = (status: string) => {
}
    switch (status) {
}
      case &apos;HEALTHY&apos;: return &apos;text-green-400&apos;;
      case &apos;QUESTIONABLE&apos;: return &apos;text-yellow-400&apos;;
      case &apos;DOUBTFUL&apos;: return &apos;text-orange-400&apos;;
      case &apos;OUT&apos;: return &apos;text-red-400&apos;;
      case &apos;IR&apos;: return &apos;text-red-600&apos;;
      default: return &apos;text-gray-400&apos;;
    }
  };

  const handleAddPlayer = (position: string) => {
}
    setSelectedPosition(position);
    setShowPlayerSearch(true);
  };

  const handlePlayerSelect = (player: Player) => {
}
    // Add player to roster
    dispatch({
}
      type: &apos;ADD_PLAYER_TO_ROSTER&apos;,
      payload: { teamId: team.id, player }
    });
    
    dispatch({
}
      type: &apos;ADD_NOTIFICATION&apos;,
      payload: {
}
        message: `${player.name} added to ${team.name}!`,
        type: &apos;SUCCESS&apos;
      }
    });
    
    setShowPlayerSearch(false);
    setSelectedPosition(&apos;&apos;);
  };

  const handleDropPlayer = (player: Player) => {
}
    if (window.confirm(`Are you sure you want to drop ${player.name}?`)) {
}
      dispatch({
}
        type: &apos;REMOVE_PLAYER_FROM_ROSTER&apos;,
        payload: { teamId: team.id, playerId: player.id }
      });
      
      dispatch({
}
        type: &apos;ADD_NOTIFICATION&apos;,
        payload: {
}
          message: `${player.name} dropped from ${team.name}`,
          type: &apos;INFO&apos;
        }
      });
    }
  };

  const RosterSlotComponent: React.FC<{ slot: RosterSlot; index: number }> = ({ slot, index }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`p-4 rounded-lg border-2 ${
}
        slot.player 
          ? &apos;bg-slate-700/50 border-slate-600 hover:border-slate-500&apos; 
          : &apos;bg-slate-800/50 border-dashed border-slate-600 hover:border-slate-500&apos;
      } transition-colors`}
    >
      {/* Position Label */}
      <div className="flex items-center justify-between mb-3 sm:px-4 md:px-6 lg:px-8">
        <div className={`${getPositionColor(slot.position)} text-white text-xs font-bold px-2 py-1 rounded`}>
          {slot.position}
        </div>
        {slot.isStarter && (
}
          <span className="text-xs text-green-400 font-medium sm:px-4 md:px-6 lg:px-8">STARTER</span>
        )}
      </div>

      {slot.player ? (
}
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
}
              <button
                onClick={() => handleDropPlayer(slot.player!)}
              >
//                 Drop
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
}
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
}
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
}
    switch (rosterView) {
}
      case &apos;starters&apos;:
        return starterSlots;
      case &apos;bench&apos;:
        return [...benchSlots, ...irSlots];
      default:
        return rosterSlots;
    }
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
          {([&apos;all&apos;, &apos;starters&apos;, &apos;bench&apos;] as const).map((view: any) => (
}
            <button
              key={view}
              onClick={() => setRosterView(view)}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredSlots().map((slot, index) => (
}
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
              {team.roster.filter((p: any) => p.injuryStatus === &apos;HEALTHY&apos;).length}
            </div>
            <div className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">Healthy Players</div>
          </div>
        </div>
      </div>

      {/* Player Search Modal */}
      <AnimatePresence>
        {showPlayerSearch && (
}
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
              
              <PlayerSearch>
                onPlayerSelect={handlePlayerSelect}
                filterPosition={selectedPosition === &apos;FLEX&apos; ? &apos;&apos; : selectedPosition}
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

const RosterManagementWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <RosterManagement {...props} />
  </ErrorBoundary>
);

export default React.memo(RosterManagementWithErrorBoundary);