
import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback } from &apos;react&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { SparklesIcon } from &apos;../icons/SparklesIcon&apos;;
import { generateTeamChemistryReport } from &apos;../../services/geminiService&apos;;
import type { League, Team } from &apos;../../types&apos;;

interface TeamChemistryWidgetProps {
}
    myTeam: Team;
    league: League;
    dispatch: React.Dispatch<any>;

}

const TeamChemistryWidget: React.FC<TeamChemistryWidgetProps> = ({ myTeam, league, dispatch }: any) => {
}
    const [isLoading, setIsLoading] = React.useState(false);
    const report = myTeam.chemistryReport;

    const handleFetchReport = async () => {
}
        if(isLoading) return;
        setIsLoading(true);
        try {
}
            const fetchedReport = await generateTeamChemistryReport(myTeam);
            if(fetchedReport) {
}
                dispatch({ type: &apos;SET_TEAM_CHEMISTRY&apos;, payload: { leagueId: league.id, teamId: myTeam.id, report: fetchedReport } });

    } catch (error) {
}
            dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: &apos;Could not fetch chemistry report.&apos; });
        } finally {
}
            setIsLoading(false);


    return (
        <Widget title="Team Chemistry" icon={<SparklesIcon />}>
            <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                {report ? (
}
                     <p className="text-sm text-gray-300 italic sm:px-4 md:px-6 lg:px-8">"{report}"</p>
                ) : (
                    <p className="text-center text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">The Oracle can analyze your roster for strategic balance and player synergy.</p>
                )}
               
                <button
                    onClick={handleFetchReport}
                    disabled={isLoading}
                    className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-1.5 bg-transparent border border-cyan-400/50 text-cyan-300 font-bold text-xs rounded-md hover:bg-cyan-400/20 disabled:opacity-50 sm:px-4 md:px-6 lg:px-8"
                 aria-label="Action button">
                    {isLoading ? (
}
                        <>
                            <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin sm:px-4 md:px-6 lg:px-8"></div>
                            <span>Analyzing...</span>
                        </>
                    ) : (
                        <>
                            <SparklesIcon />
                            <span>{report ? &apos;Re-analyze Chemistry&apos; : &apos;Analyze My Team&apos;}</span>
                        </>
                    )}
                </button>
            </div>
        </Widget>
    );
};

const TeamChemistryWidgetWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <TeamChemistryWidget {...props} />
  </ErrorBoundary>
);

export default React.memo(TeamChemistryWidgetWithErrorBoundary);
