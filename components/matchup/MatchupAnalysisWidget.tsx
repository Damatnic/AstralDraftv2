
import { ErrorBoundary } from '../ui/ErrorBoundary';
import type { Team, MatchupAnalysis } from '../../types';
import { getMatchupAnalysis } from '../../services/geminiService';
import { PercentIcon } from '../icons/PercentIcon';
import { CrosshairIcon } from '../icons/CrosshairIcon';
import { Tooltip } from '../ui/Tooltip';

interface MatchupAnalysisWidgetProps {
    myTeam: Team;
    opponentTeam: Team;
}

const MatchupAnalysisWidget: React.FC<MatchupAnalysisWidgetProps> = ({ myTeam, opponentTeam }: any) => {
    const [analysis, setAnalysis] = React.useState<MatchupAnalysis | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchAnalysis = async () => {
            setIsLoading(true);
            try {
                const result = await getMatchupAnalysis(myTeam, opponentTeam);
                setAnalysis(result);
            } catch (error) {
                console.error('Error fetching matchup analysis:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAnalysis();
    }, [myTeam.id, opponentTeam.id]);

    const myWinPct = analysis ? analysis.winProbability : 50;
    const opponentWinPct = 100 - myWinPct;

    if (isLoading) {
        return <div className="p-2 bg-black/20 rounded-lg text-xs text-center sm:px-4 md:px-6 lg:px-8">Analyzing matchup...</div>;
    }

    if (!analysis) {
        return null;
    }

    return (
        <div className="glass-pane p-3 rounded-xl flex-grow flex flex-col gap-2 sm:px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between text-xs font-bold sm:px-4 md:px-6 lg:px-8">
                <span className="text-cyan-300 sm:px-4 md:px-6 lg:px-8">My Win %</span>
                <span>Opponent Win %</span>
            </div>
            <Tooltip content={`The Oracle predicts a ${myWinPct}% chance for you to win.`}>
                <div className="w-full h-4 bg-red-500/50 rounded-full flex overflow-hidden sm:px-4 md:px-6 lg:px-8">
                    <div className="bg-cyan-500 sm:px-4 md:px-6 lg:px-8" style={{ width: `${myWinPct}%` }}></div>
                </div>
            </Tooltip>
            <div className="flex items-center justify-between text-xs font-bold sm:px-4 md:px-6 lg:px-8">
                <span className="text-cyan-300 text-lg sm:px-4 md:px-6 lg:px-8">{myWinPct}%</span>
                <span className="text-lg sm:px-4 md:px-6 lg:px-8">{opponentWinPct}%</span>
            </div>
            <div className="pt-2 border-t border-white/10 text-xs sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center gap-2 text-green-300 font-semibold sm:px-4 md:px-6 lg:px-8">
                    <CrosshairIcon /> My Key Player: <span className="text-white sm:px-4 md:px-6 lg:px-8">{analysis.keyPlayerMyTeam}</span>
                </div>
                <div className="flex items-center gap-2 text-red-300 font-semibold sm:px-4 md:px-6 lg:px-8">
                     <CrosshairIcon /> Opponent's Key Player: <span className="text-white sm:px-4 md:px-6 lg:px-8">{analysis.keyPlayerOpponent}</span>
                </div>
            </div>
        </div>
    );
};

const MatchupAnalysisWidgetWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <MatchupAnalysisWidget {...props} />
  </ErrorBoundary>
);

export default React.memo(MatchupAnalysisWidgetWithErrorBoundary);
