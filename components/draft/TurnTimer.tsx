
import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import type { Team, DraftPick } from &apos;../../types&apos;;

interface TurnTimerProps {
}
    currentPick: number;
    teams: Team[];
    draftPicks: DraftPick[];
    isMyTurn: boolean;
    isPaused: boolean;}

const PICK_TIME_SECONDS = 60;

}

const TurnTimer: React.FC<TurnTimerProps> = ({ currentPick, teams, draftPicks, isMyTurn, isPaused }: any) => {
}
    const [timeLeft, setTimeLeft] = React.useState(PICK_TIME_SECONDS);
    
    const isDraftComplete = draftPicks.length > 0 && currentPick > draftPicks.length;
    
    React.useEffect(() => {
}
        if (isDraftComplete) return;

        setTimeLeft(PICK_TIME_SECONDS);

        const interval = setInterval(() => {
}
            if (!isPaused) {
}
                setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }
  }, 1000);

        return () => clearInterval(interval);
    }, [currentPick, isPaused, isDraftComplete]);
    
    const teamOnTheClockId = !isDraftComplete ? draftPicks[currentPick - 1]?.teamId : null;
    const teamOnTheClock = teams.find((t: any) => t.id === teamOnTheClockId);
    const progress = (timeLeft / PICK_TIME_SECONDS) * 100;

  if (isLoading) {
}
    return (
      <div className="flex justify-center items-center p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 sm:px-4 md:px-6 lg:px-8"></div>
        <span className="ml-2 sm:px-4 md:px-6 lg:px-8">Loading...</span>
      </div>
    );

  return (
        <>
            {isDraftComplete ? (
}
                 <div className="glass-pane p-3 rounded-xl flex items-center justify-center bg-gradient-to-r from-green-500 to-cyan-500 sm:px-4 md:px-6 lg:px-8">
                    <p className="font-bold text-lg text-white sm:px-4 md:px-6 lg:px-8">DRAFT COMPLETE!</p>
                </div>
            ) : (
                <div className="glass-pane p-3 rounded-xl flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                    <div>
                        <p className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">ON THE CLOCK (PICK {currentPick})</p>
                        <p className="font-bold text-lg text-white sm:px-4 md:px-6 lg:px-8">{teamOnTheClock?.name || &apos;...&apos;}</p>
                    </div>
                    <div className="flex items-center gap-4 sm:px-4 md:px-6 lg:px-8">
                        {isMyTurn && !isPaused &&
}
                            <span className="px-3 py-1 bg-green-500/80 text-white font-bold rounded-full text-sm animate-pulse sm:px-4 md:px-6 lg:px-8">
                                YOUR PICK!
                            </span>

                        {isPaused &&
}
                            <span className="px-3 py-1 bg-yellow-500/80 text-white font-bold rounded-full text-sm sm:px-4 md:px-6 lg:px-8">
//                                 PAUSED
                            </span>

                        <div className="w-24 h-8 bg-gray-800/50 rounded-full relative overflow-hidden sm:px-4 md:px-6 lg:px-8">
                            <div 
                                className="h-full bg-gradient-to-r from-green-400 to-cyan-400 transition-all duration-1000 linear sm:px-4 md:px-6 lg:px-8"
                                style={{ width: `${progress}%` }}
                            ></div>
                            <span className="absolute inset-0 flex items-center justify-center font-mono font-bold text-lg text-white sm:px-4 md:px-6 lg:px-8">
                                0:{timeLeft.toString().padStart(2, &apos;0&apos;)}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const TurnTimerWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <TurnTimer {...props} />
  </ErrorBoundary>
);

export default React.memo(TurnTimerWithErrorBoundary);