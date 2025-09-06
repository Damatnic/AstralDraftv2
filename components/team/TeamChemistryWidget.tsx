
import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback } from 'react';
import { useAppState } from '../../contexts/AppContext';
import { Widget } from '../ui/Widget';
import { SparklesIcon } from '../icons/SparklesIcon';
import { generateTeamChemistryReport } from '../../services/geminiService';
import type { League, Team } from '../../types';

interface TeamChemistryWidgetProps {
    myTeam: Team;
    league: League;
    dispatch: React.Dispatch<any>;
}

const TeamChemistryWidget: React.FC<TeamChemistryWidgetProps> = ({ myTeam, league, dispatch }: any) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const report = myTeam.chemistryReport;

    const handleFetchReport = async () => {
        if(isLoading) return;
        setIsLoading(true);
        try {
            const fetchedReport = await generateTeamChemistryReport(myTeam);
            if(fetchedReport) {
                dispatch({ type: 'SET_TEAM_CHEMISTRY', payload: { leagueId: league.id, teamId: myTeam.id, report: fetchedReport } });

    } catch (error) {
            dispatch({ type: 'ADD_NOTIFICATION', payload: 'Could not fetch chemistry report.' });
        } finally {
            setIsLoading(false);


    return (
        <Widget title="Team Chemistry" icon={<SparklesIcon />}>
            <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                {report ? (
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
                        <>
                            <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin sm:px-4 md:px-6 lg:px-8"></div>
                            <span>Analyzing...</span>
                        </>
                    ) : (
                        <>
                            <SparklesIcon />
                            <span>{report ? 'Re-analyze Chemistry' : 'Analyze My Team'}</span>
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
