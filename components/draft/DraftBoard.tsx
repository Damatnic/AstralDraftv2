

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo } from &apos;react&apos;;
import type { Team, DraftPick, Player } from &apos;../../types&apos;;
import TeamColumn from &apos;./TeamColumn&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;

interface DraftBoardProps {
}
  teams: Team[];
  draftPicks: DraftPick[];
  currentPick?: number; // Optional for auction
  onPlayerSelect: (player: Player) => void;
  draftFormat: &apos;SNAKE&apos; | &apos;AUCTION&apos;;
  teamOnClockId?: number;

}

const DraftBoard: React.FC<DraftBoardProps> = ({ teams, draftPicks, currentPick, onPlayerSelect, draftFormat, teamOnClockId }: any) => {
}
  const { state } = useAppState();
  const myTeamId = teams.find((t: any) => t.owner.id === state.user?.id)?.id;
  const rounds = draftFormat === &apos;SNAKE&apos; ? 16 : teams[0]?.roster.length || 16;
  
  return (
    <div 
        className="glass-pane flex flex-col bg-[var(--panel-bg)] border-[var(--panel-border)] rounded-lg sm:rounded-2xl h-full shadow-2xl shadow-black/50"
    >
      <div className="flex-shrink-0 p-2 sm:p-3 text-center border-b border-[var(--panel-border)]">
        <h2 className="font-display text-base sm:text-lg md:text-xl font-bold text-[var(--text-primary)] tracking-wider">LIVE DRAFT BOARD</h2>
      </div>
      <div className="flex-grow flex overflow-x-auto p-1 sm:p-2">
        <div className="flex gap-0.5 sm:gap-1">
          {/* Round Numbers Column - Hide on very small screens */}
          {draftFormat === &apos;SNAKE&apos; && (
}
            <div className="hidden sm:flex flex-shrink-0 w-6 sm:w-8 flex-col">
                <div className="h-10 sm:h-12 flex-shrink-0"></div>
                {Array.from({ length: rounds }).map((_, i) => (
                    <div key={i} className="h-6 sm:h-8 flex-shrink-0 flex items-center justify-center font-bold text-cyan-300/50 text-xs">
                        {i + 1}
                    </div>
                ))}
            </div>
          )}
          {teams.map((team: any) => (
}
            <TeamColumn>
              key={team.id}
              team={team}
              picks={draftPicks.filter((p: any) => p.teamId === team.id)}
              currentPick={currentPick}
              onPlayerSelect={onPlayerSelect}
              draftFormat={draftFormat}
              isMyTeam={team.id === myTeamId}
              isOnTheClock={team.id === teamOnClockId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const DraftBoardWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <DraftBoard {...props} />
  </ErrorBoundary>
);

export default React.memo(DraftBoardWithErrorBoundary);