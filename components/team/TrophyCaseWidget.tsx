
import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo } from &apos;react&apos;;
import type { Team, League } from &apos;../../types&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { TrophyIcon } from &apos;../icons/TrophyIcon&apos;;

interface TrophyCaseWidgetProps {
}
    team: Team;
    league: League;

}

const TrophyCaseWidget: React.FC<TrophyCaseWidgetProps> = ({ team, league }: any) => {
}
    const awards = team.awards || [];

    return (
        <Widget title="Trophy Case" icon={<TrophyIcon />}>
            <div className="p-3 sm:px-4 md:px-6 lg:px-8">
                {awards.length === 0 ? (
}
                    <p className="text-center text-xs text-gray-400 py-4 sm:px-4 md:px-6 lg:px-8">No awards yet. Go win some matchups!</p>
                ) : (
                    <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                        {awards.map((award, index) => (
}
                            <div key={index} className="flex items-center gap-3 p-2 bg-black/10 rounded-md sm:px-4 md:px-6 lg:px-8">
                                <div className="text-yellow-400 sm:px-4 md:px-6 lg:px-8"><TrophyIcon /></div>
                                <div>
                                    <p className="font-semibold text-sm sm:px-4 md:px-6 lg:px-8">{award.title}</p>
                                    <p className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Week {award.week}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Widget>
    );
};

const TrophyCaseWidgetWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <TrophyCaseWidget {...props} />
  </ErrorBoundary>
);

export default React.memo(TrophyCaseWidgetWithErrorBoundary);
