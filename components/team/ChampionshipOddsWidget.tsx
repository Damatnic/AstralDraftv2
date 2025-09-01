
import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo } from &apos;react&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { TrophyIcon } from &apos;../icons/TrophyIcon&apos;;
import SparklineChart from &apos;../ui/SparklineChart&apos;;
import type { Team, League } from &apos;../../types&apos;;

interface ChampionshipOddsWidgetProps {
}
    team: Team;
    league: League;
    dispatch: React.Dispatch<any>;

}

const ChampionshipOddsWidget: React.FC<ChampionshipOddsWidgetProps> = ({ team, league, dispatch }: any) => {
}
    const history = team.championshipProbHistory || [];
    const currentProb = history.length > 0 ? history[history.length - 1].probability : 0;
    const dataPoints = history.map((h: any) => h.probability);

    return (
        <Widget title="Championship Odds" icon={<TrophyIcon />}>
            <div className="p-3 sm:px-4 md:px-6 lg:px-8">
                <div className="text-center sm:px-4 md:px-6 lg:px-8">
                    <p className="font-display text-4xl font-bold text-yellow-300 sm:px-4 md:px-6 lg:px-8">{currentProb.toFixed(2)}%</p>
                    <p className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Current probability to win the league</p>
                </div>
                {dataPoints.length > 1 && (
}
                    <div className="h-16 mt-2 sm:px-4 md:px-6 lg:px-8">
                        <SparklineChart data={dataPoints} />
                    </div>
                )}
                <button
                    onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;CHAMPIONSHIP_ODDS&apos; }}
                    className="w-full mt-2 py-1.5 text-xs font-bold bg-cyan-500/10 text-cyan-300 rounded-md hover:bg-cyan-500/20 sm:px-4 md:px-6 lg:px-8"
                >
                    View Full Analytics
                </button>
            </div>
        </Widget>
    );
};

const ChampionshipOddsWidgetWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <ChampionshipOddsWidget {...props} />
  </ErrorBoundary>
);

export default React.memo(ChampionshipOddsWidgetWithErrorBoundary);