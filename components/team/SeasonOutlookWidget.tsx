
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { Widget } from '../ui/Widget';
import { TelescopeIcon } from '../icons/TelescopeIcon';
import { generateSeasonOutlook } from '../../services/geminiService';
import type { League, Team } from '../../types';
import LoadingSpinner from '../ui/LoadingSpinner';

interface SeasonOutlookWidgetProps {
    myTeam: Team;
    league: League;
    dispatch: React.Dispatch<any>;
}

const SeasonOutlookWidget: React.FC<SeasonOutlookWidgetProps> = ({ myTeam, league, dispatch }: any) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const outlook = myTeam.seasonOutlook;

    React.useEffect(() => {
        const fetchOutlook = async () => {
            if (!outlook) {
                setIsLoading(true);
                try {
                    const fetchedOutlook = await generateSeasonOutlook(myTeam);
                    if (fetchedOutlook) {
                        dispatch({ type: 'SET_SEASON_OUTLOOK', payload: { leagueId: league.id, teamId: myTeam.id, outlook: fetchedOutlook } });

    } catch (error) {
                } finally {
                    setIsLoading(false);


        };

        if (league?.status !== 'PRE_DRAFT' && league?.status !== 'DRAFTING') {
            fetchOutlook();

    }, [league?.status, myTeam, league.id, dispatch, outlook]);

    return (
        <Widget title="Season Outlook" icon={<TelescopeIcon />}>
            <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                {isLoading ? (
                    <LoadingSpinner size="sm" text="Peering into the future..." />
                ) : outlook ? (
                    <div className="space-y-2 text-sm text-center sm:px-4 md:px-6 lg:px-8">
                        <p className="italic text-gray-300 sm:px-4 md:px-6 lg:px-8">"{outlook.prediction}"</p>
                        <p className="text-xs text-gray-400 pt-2 border-t border-white/10 sm:px-4 md:px-6 lg:px-8">
                            <strong className="text-yellow-300 sm:px-4 md:px-6 lg:px-8">Key Player:</strong> {outlook.keyPlayer}
                        </p>
                    </div>
                ) : (
                    <p className="text-center text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">
                        The Oracle will reveal your season's fate after the draft is complete.
                    </p>
                )}
            </div>
        </Widget>
    );
};

const SeasonOutlookWidgetWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <SeasonOutlookWidget {...props} />
  </ErrorBoundary>
);

export default React.memo(SeasonOutlookWidgetWithErrorBoundary);
