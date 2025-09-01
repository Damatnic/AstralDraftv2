
import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo } from &apos;react&apos;;
import type { League, Team } from &apos;../../types&apos;;
import { generateTeamNeedsAnalysis } from &apos;../../services/geminiService&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { SparklesIcon } from &apos;../icons/SparklesIcon&apos;;
import LoadingSpinner from &apos;../ui/LoadingSpinner&apos;;

interface TeamNeedsAnalysisProps {
}
    team: Team;
    league: League;
    dispatch: React.Dispatch<any>;

}

const TeamNeedsAnalysis: React.FC<TeamNeedsAnalysisProps> = ({ team, league, dispatch }: any) => {
}
    const [isLoading, setIsLoading] = React.useState(false);
    const needs = team.teamNeeds;

    const handleFetchNeeds = async () => {
}
        setIsLoading(true);
        try {
}
            const fetchedNeeds = await generateTeamNeedsAnalysis(team);
            if (fetchedNeeds) {
}
                dispatch({ type: &apos;SET_TEAM_NEEDS&apos;, payload: { leagueId: league.id, teamId: team.id, needs: fetchedNeeds } });

    } catch (error) {
}
            dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: { message: &apos;Could not analyze team needs.&apos;, type: &apos;SYSTEM&apos; } });
        } finally {
}
            setIsLoading(false);

    };

    React.useEffect(() => {
}
        // Fetch only if needs are not already in state and the season has started
        if (!needs && (league?.status === &apos;IN_SEASON&apos; || league?.status === &apos;PLAYOFFS&apos; || league?.status === &apos;COMPLETE&apos;)) {
}
            handleFetchNeeds();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [team.id, league?.status]);

    return (
        <Widget title="Team Needs Analysis" icon={<SparklesIcon />}>
            <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                {isLoading ? (
}
                    <LoadingSpinner size="sm" text="Analyzing roster..." />
                ) : needs && needs.length > 0 ? (
                    <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                        {needs.map((need, index) => (
}
                            <div key={index} className="bg-black/10 p-3 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                <h4 className="font-bold text-red-400 sm:px-4 md:px-6 lg:px-8">{need.position}</h4>
                                <p className="text-xs italic text-gray-300 sm:px-4 md:px-6 lg:px-8">"{need.rationale}"</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-sm text-gray-400 py-2 sm:px-4 md:px-6 lg:px-8">The Oracle sees a well-balanced team with no glaring needs.</p>
                )}
                <button
                    onClick={handleFetchNeeds}
                    disabled={isLoading}
                    className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-1.5 bg-transparent border border-cyan-400/50 text-cyan-300 font-bold text-xs rounded-md hover:bg-cyan-400/20 disabled:opacity-50 sm:px-4 md:px-6 lg:px-8"
                 aria-label="Action button">
                    {isLoading ? (
}
                        <>
                           <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin sm:px-4 md:px-6 lg:px-8"></div>
                           Analyzing...
                        </>
                    ) : (
                       &apos;Re-Analyze Needs&apos;
                    )}
                </button>
            </div>
        </Widget>
    );
};

const TeamNeedsAnalysisWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <TeamNeedsAnalysis {...props} />
  </ErrorBoundary>
);

export default React.memo(TeamNeedsAnalysisWithErrorBoundary);
