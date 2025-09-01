
import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo } from &apos;react&apos;;
import type { Team, DraftPickAsset } from &apos;../../types&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { ArchiveIcon } from &apos;../icons/ArchiveIcon&apos;;

interface FuturePicksWidgetProps {
}
    team: Team;

}

const FuturePicksWidget: React.FC<FuturePicksWidgetProps> = ({ team }: any) => {
}
    const picksBySeason = (team.futureDraftPicks || []).reduce((acc, pick) => {
}
        if (!acc[pick.season]) {
}
            acc[pick.season] = [];
    acc[pick.season].push(pick.round);
        acc[pick.season].sort((a, b) 
} a - b);
        return acc;
    }, {} as Record<number, number[]>);

    return (
        <Widget title="Future Draft Picks" icon={<ArchiveIcon />}>
            <div className="p-3 space-y-3 sm:px-4 md:px-6 lg:px-8">
                {Object.keys(picksBySeason).length > 0 ? Object.entries(picksBySeason).map(([season, rounds]) => (
}
                    <div key={season}>
                        <h4 className="font-bold text-sm text-cyan-300 mb-1 sm:px-4 md:px-6 lg:px-8">{season} Draft</h4>
                        <div className="flex flex-wrap gap-1 sm:px-4 md:px-6 lg:px-8">
                            {rounds.map((round: any) => (
}
                                <span key={round} className="text-xs bg-black/20 px-2 py-1 rounded-full font-mono sm:px-4 md:px-6 lg:px-8">
                                    R{round}
                                </span>
                            ))}
                        </div>
                    </div>
                )) : (
                    <p className="text-center text-xs text-gray-400 py-4 sm:px-4 md:px-6 lg:px-8">No future draft picks available.</p>
                )}
            </div>
        </Widget>
    );
};

const FuturePicksWidgetWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <FuturePicksWidget {...props} />
  </ErrorBoundary>
);

export default React.memo(FuturePicksWidgetWithErrorBoundary);
