

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo } from &apos;react&apos;;
import { AnimatePresence, motion } from &apos;framer-motion&apos;;
import type { Team, DraftPick, Player } from &apos;../../types&apos;;
import { players } from &apos;../../data/players&apos;;
import { Avatar } from &apos;../ui/Avatar&apos;;

interface TeamColumnProps {
}
  team: Team;
  picks: DraftPick[];
  currentPick?: number;
  onPlayerSelect: (player: Player) => void;
  draftFormat: &apos;SNAKE&apos; | &apos;AUCTION&apos;;
  isMyTeam?: boolean;
  isOnTheClock?: boolean;

}

const positionColor: Record<string, string> = {
}
    QB: &apos;bg-red-500/70&apos;,
    RB: &apos;bg-green-500/70&apos;,
    WR: &apos;bg-blue-500/70&apos;,
    TE: &apos;bg-orange-500/70&apos;,
    DST: &apos;bg-purple-500/70&apos;,
    K: &apos;bg-yellow-500/70&apos;
};

const TeamColumn: React.FC<TeamColumnProps> = ({ team, picks, currentPick, onPlayerSelect, draftFormat, isMyTeam, isOnTheClock }: any) => {
}
    const getSnakePickDisplay = (pick: DraftPick) => {
}
    return `${pick.round}.${pick.pickInRound}`;
    const displayItems = draftFormat === &apos;AUCTION&apos;
    ? team.roster.map((player, index) 
} {
}
        const pick = picks.find((p: any) => p.playerId === player.id);
        return {
}
            key: player.id,
            player,
            price: pick?.price,
            isCurrent: false,
            display: &apos;&apos;
        };
    })
    : picks.map((pick: any) => {
}
        const player = players.find((p: any) => p.id === pick.playerId);
        return {
}
            key: pick.overall,
            player,
            price: undefined,
            isCurrent: pick.overall === currentPick,
            display: getSnakePickDisplay(pick)

    });

  const columnClasses = [
      &apos;w-24 sm:w-32 flex-shrink-0 flex flex-col items-center gap-0.5 sm:gap-1 rounded-lg transition-all duration-300&apos;,
      isMyTeam ? &apos;bg-cyan-500/10&apos; : &apos;&apos;,
      isOnTheClock ? &apos;shadow-lg shadow-yellow-300/40 ring-2 ring-yellow-300&apos; : &apos;&apos;
  ].join(&apos; &apos;);

  return (
    <div className={columnClasses}>
      <div className="h-10 sm:h-12 flex-shrink-0 flex flex-col items-center justify-center w-full bg-black/10 dark:bg-gray-800/50 rounded-t-lg border-b-2 border-transparent">
        <Avatar avatar={team.avatar} className="w-6 h-6 sm:w-8 sm:h-8 text-lg sm:text-2xl rounded-md" />
        <p className="text-[10px] sm:text-xs font-bold truncate w-full text-center px-0.5 sm:px-1">{team.name}</p>
         {draftFormat === &apos;AUCTION&apos; && <p className="text-[10px] sm:text-xs font-bold text-green-400">${team.budget}</p>}
      </div>
      <AnimatePresence>
      {displayItems.map((item: any) => {
}
        const WrapperComponent = item.player ? motion.button : motion.div;
        const bgColor = item.player ? positionColor[item.player.position] : &apos;bg-slate-200/50 dark:bg-gray-800/30&apos;;
        const textColor = item.player ? &apos;text-white&apos; : &apos;text-gray-500&apos;;

        return (
          <WrapperComponent>
            key={item.key}
            onClick={() => item.player && onPlayerSelect(item.player)},
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0 },
                transition: { duration: 0.3 },
            }}
            className={`h-6 sm:h-8 flex-shrink-0 w-full rounded-md flex items-center justify-center text-[10px] sm:text-xs transition-all duration-300 mobile-touch-target
}
              ${item.isCurrent ? &apos;ring-2 ring-offset-2 ring-offset-black/50 ring-yellow-300 scale-105 shadow-lg shadow-cyan-500/20&apos; : &apos;&apos;}
              ${item.player ? &apos;font-semibold hover:ring-2 hover:ring-cyan-400&apos; : &apos;border border-dashed border-gray-400/30 dark:border-gray-600/50&apos;}
              ${bgColor} ${textColor}
            `}
          >
            {item.player ? (
}
              <div className="flex items-center gap-1 sm:gap-1.5 w-full px-1 sm:px-1.5 overflow-hidden">
                <span className="truncate flex-grow text-left text-shadow-sm sm:px-4 md:px-6 lg:px-8">{item.player.name}</span>
                 {draftFormat === &apos;AUCTION&apos; && item.price && (
}
                    <span className="font-bold text-yellow-300/90 text-[9px] sm:text-xs">${item.price}</span>
                )}
              </div>
            ) : (
              <span>{item.display}</span>
            )}
          </WrapperComponent>
        );
      })}
      </AnimatePresence>
    </div>
  );
};

const TeamColumnWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <TeamColumn {...props} />
  </ErrorBoundary>
);

export default React.memo(TeamColumnWithErrorBoundary);