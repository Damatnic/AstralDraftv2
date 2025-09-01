
import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;
import { useLeague } from &apos;../../hooks/useLeague&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { SwordIcon } from &apos;../icons/SwordIcon&apos;;
import { detectTopRivalry } from &apos;../../services/geminiService&apos;;
import { Avatar } from &apos;../ui/Avatar&apos;;
import LoadingSpinner from &apos;../ui/LoadingSpinner&apos;;

const RivalryWidget: React.FC = () => {
}
    const { state, dispatch } = useAppState();
    const { league } = useLeague();
    const [isLoading, setIsLoading] = React.useState(false);

    const rivalry = league?.topRivalry;

    React.useEffect(() => {
}
        if (league && !rivalry && (league?.status === &apos;IN_SEASON&apos; || league?.status === &apos;PLAYOFFS&apos; || league?.status === &apos;COMPLETE&apos;)) {
}
            const fetchRivalry = async () => {
}
                try {
}
                    setIsLoading(true);
                    const result = await detectTopRivalry(league);
                    if (result) {
}
                        dispatch({ type: &apos;SET_TOP_RIVALRY&apos;, payload: { leagueId: league.id, rivalry: result } });
                    }
                } catch (error) {
}
                    console.error(&apos;Error in fetchRivalry:&apos;, error);
                } finally {
}
                    setIsLoading(false);
                }
            };
            fetchRivalry();
        }
    }, [league, rivalry, dispatch]);

    if (!league || !(league?.status === &apos;IN_SEASON&apos; || league?.status === &apos;PLAYOFFS&apos; || league?.status === &apos;COMPLETE&apos;)) {
}
        return null;
    }

    const teamA = rivalry ? league.teams.find((t: any) => t.id === rivalry.teamAId) : null;
    const teamB = rivalry ? league.teams.find((t: any) => t.id === rivalry.teamBId) : null;

    return (
        <Widget title="Top Rivalry" icon={<SwordIcon />}>
            <div className="p-3 sm:px-4 md:px-6 lg:px-8">
                {isLoading ? <LoadingSpinner size="sm" text="Detecting rivalries..." /> :
}
                 rivalry && teamA && teamB ? (
                    <div>
                        <div className="flex items-center justify-center gap-4 mb-2 sm:px-4 md:px-6 lg:px-8">
                             <div className="text-center sm:px-4 md:px-6 lg:px-8">
                                <Avatar avatar={teamA.avatar} className="w-10 h-10 mx-auto text-2xl rounded-lg sm:px-4 md:px-6 lg:px-8" />
                                <p className="text-xs font-bold mt-1 sm:px-4 md:px-6 lg:px-8">{teamA.name}</p>
                            </div>
                            <span className="font-bold text-red-400 text-lg sm:px-4 md:px-6 lg:px-8">VS</span>
                             <div className="text-center sm:px-4 md:px-6 lg:px-8">
                                <Avatar avatar={teamB.avatar} className="w-10 h-10 mx-auto text-2xl rounded-lg sm:px-4 md:px-6 lg:px-8" />
                                <p className="text-xs font-bold mt-1 sm:px-4 md:px-6 lg:px-8">{teamB.name}</p>
                            </div>
                        </div>
                        <p className="text-xs italic text-gray-300 sm:px-4 md:px-6 lg:px-8">"{rivalry.narrative}"</p>
                    </div>
                ) : (
                    <p className="text-center text-xs text-gray-400 py-2 sm:px-4 md:px-6 lg:px-8">No significant rivalries detected yet.</p>
                )}
            </div>
        </Widget>
    );
};

const RivalryWidgetWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <RivalryWidget {...props} />
  </ErrorBoundary>
);

export default React.memo(RivalryWidgetWithErrorBoundary);
