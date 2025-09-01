/**
 * Draft Order Component
 * Display and manage draft order for the league
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo, useState } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;
import { Team } from &apos;../../types&apos;;

interface DraftOrderProps {
}
  showRandomizeButton?: boolean;
  isCommissioner?: boolean;

}

const DraftOrder: React.FC<DraftOrderProps> = ({ 
}
  showRandomizeButton = false, 
  isCommissioner = false 
}: any) => {
}
  const { state, dispatch } = useAppState();
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [draftOrder, setDraftOrder] = useState<Team[]>([]);

  const league = state.leagues[0];
  
  // Initialize draft order if not set
  React.useEffect(() => {
}
    if (draftOrder.length === 0 && league?.teams) {
}
      // Use existing order or randomize
      setDraftOrder([...league.teams]);
    }
  }, [league?.teams, draftOrder.length]);

  const randomizeDraftOrder = async () => {
}
    try {
}
      if (!league?.teams) return;
      
      setIsRandomizing(true);
      
      // Animate the randomization process
      const teams = [...league.teams];
      
      // Show shuffling animation
      for (let i = 0; i < 10; i++) {
}
        await new Promise(resolve => setTimeout(resolve, 100));
        const shuffled = [...teams].sort(() => Math.random() - 0.5);
        setDraftOrder(shuffled);
      }
      
      // Final randomization
      const finalOrder = [...teams].sort(() => Math.random() - 0.5);
      setDraftOrder(finalOrder);
      
      setIsRandomizing(false);
      
      dispatch({
}
        type: &apos;ADD_NOTIFICATION&apos;,
        payload: {
}
          message: &apos;Draft order has been randomized!&apos;,
          type: &apos;SUCCESS&apos;
        }
      });
    } catch (error) {
}
      console.error(&apos;Error in randomizeDraftOrder:&apos;, error);
    }
  };

  const getDraftPosition = (teamId: number): number => {
}
    return draftOrder.findIndex(team => team.id === teamId) + 1;
  };

  const getSnakePickNumbers = (position: number, totalRounds: number = 16): number[] => {
}
    const picks: number[] = [];
    for (let round = 1; round <= totalRounds; round++) {
}
      if (round % 2 === 1) {
}
        // Odd rounds: normal order
        picks.push((round - 1) * 10 + position);
      } else {
}
        // Even rounds: reverse order (snake)
        picks.push((round - 1) * 10 + (11 - position));
      }
    }
    return picks;
  };

  return (
    <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
        <div>
          <h3 className="text-xl font-bold text-white sm:px-4 md:px-6 lg:px-8">Draft Order</h3>
          <p className="text-slate-400 sm:px-4 md:px-6 lg:px-8">
            Snake draft format - 16 rounds, 10 teams
          </p>
        </div>
        
        {showRandomizeButton && isCommissioner && (
}
          <button
            onClick={randomizeDraftOrder}
            disabled={isRandomizing}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
}
//               isRandomizing
                ? &apos;bg-gray-600 text-gray-300 cursor-not-allowed&apos;
                : &apos;bg-blue-600 hover:bg-blue-700 text-white&apos;
            }`}
           aria-label="Action button">
            {isRandomizing ? (
}
              <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin sm:px-4 md:px-6 lg:px-8"></div>
                Randomizing...
              </div>
            ) : (
              &apos;🎲 Randomize Order&apos;
            )}
          </button>
        )}
      </div>

      {/* Draft Order List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {draftOrder.map((team, index) => {
}
            const position = index + 1;
            const snakePicks = getSnakePickNumbers(position);

            return (
              <motion.div
                key={team.id}
//                 layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`p-4 rounded-lg border-2 transition-all ${
}
//                   isRandomizing
                    ? &apos;border-blue-400 bg-blue-900/20&apos;
                    : &apos;border-slate-600 bg-slate-700/50 hover:border-slate-500&apos;
                }`}
              >
                <div className="flex items-center justify-between mb-3 sm:px-4 md:px-6 lg:px-8">
                  <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
}
                      position <= 3 ? &apos;bg-yellow-600&apos; : 
                      position <= 6 ? &apos;bg-blue-600&apos; : &apos;bg-slate-600&apos;
                    }`}>
                      {position}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white sm:px-4 md:px-6 lg:px-8">{team.name}</h4>
                      <p className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">{team.owner.name}</p>
                    </div>
                  </div>
                  <span className="text-2xl sm:px-4 md:px-6 lg:px-8">{team.avatar}</span>
                </div>

                {/* Snake Pick Preview */}
                <div className="border-t border-slate-600 pt-3 sm:px-4 md:px-6 lg:px-8">
                  <p className="text-xs text-slate-400 mb-2 sm:px-4 md:px-6 lg:px-8">Pick Numbers (Snake):</p>
                  <div className="flex flex-wrap gap-1 sm:px-4 md:px-6 lg:px-8">
                    {snakePicks.slice(0, 8).map((pickNum, pickIndex) => (
}
                      <span
                        key={pickIndex}
                        className={`px-2 py-1 text-xs rounded ${
}
                          pickIndex < 3
                            ? &apos;bg-green-600/20 text-green-400 border border-green-600/30&apos;
                            : &apos;bg-slate-600/20 text-slate-400 border border-slate-600/30&apos;
                        }`}
                      >
                        {pickNum}
                      </span>
                    ))}
                    {snakePicks.length > 8 && (
}
                      <span className="px-2 py-1 text-xs rounded bg-slate-600/20 text-slate-400 border border-slate-600/30 sm:px-4 md:px-6 lg:px-8">
                        +{snakePicks.length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Draft Format Explanation */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 sm:px-4 md:px-6 lg:px-8">
        <h4 className="font-semibold text-white mb-2 sm:px-4 md:px-6 lg:px-8">Snake Draft Format</h4>
        <div className="text-sm text-slate-400 space-y-1 sm:px-4 md:px-6 lg:px-8">
          <p>• <strong>Round 1:</strong> Pick order 1-10 (normal order)</p>
          <p>• <strong>Round 2:</strong> Pick order 10-1 (reverse order)</p>
          <p>• <strong>Round 3:</strong> Pick order 1-10 (normal order)</p>
          <p>• Pattern continues for all 16 rounds</p>
          <p>• Total picks per team: 16 players</p>
          <p>• Draft date: <strong>August 31, 2025 at 7:00 PM</strong></p>
        </div>
      </div>

      {/* Draft Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-slate-700/50 rounded-lg sm:px-4 md:px-6 lg:px-8">
          <div className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">10</div>
          <div className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">Teams</div>
        </div>
        <div className="text-center p-4 bg-slate-700/50 rounded-lg sm:px-4 md:px-6 lg:px-8">
          <div className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">16</div>
          <div className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">Rounds</div>
        </div>
        <div className="text-center p-4 bg-slate-700/50 rounded-lg sm:px-4 md:px-6 lg:px-8">
          <div className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">160</div>
          <div className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">Total Picks</div>
        </div>
        <div className="text-center p-4 bg-slate-700/50 rounded-lg sm:px-4 md:px-6 lg:px-8">
          <div className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">90s</div>
          <div className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">Per Pick</div>
        </div>
      </div>
    </div>
  );
};

const DraftOrderWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <DraftOrder {...props} />
  </ErrorBoundary>
);

export default React.memo(DraftOrderWithErrorBoundary);