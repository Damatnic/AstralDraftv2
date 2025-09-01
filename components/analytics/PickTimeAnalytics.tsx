
import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import type { League } from &apos;../../types&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { Avatar } from &apos;../ui/Avatar&apos;;

interface PickTimeAnalyticsProps {
}
    league: League;

}

const PickTimeAnalytics: React.FC<PickTimeAnalyticsProps> = ({ league }: any) => {
}
    const analyticsData = React.useMemo(() => {
}
        const pickTimes: { [teamId: number]: number[] } = {};

        const sortedPicks = [...league.draftPicks]
            .filter((p: any) => p.timestamp)
            .sort((a, b) => a.overall - b.overall);

        for (let i = 1; i < sortedPicks.length; i++) {
}
            const currentPick = sortedPicks[i];
            const prevPick = sortedPicks[i - 1];
            
            if (currentPick.teamId && currentPick.timestamp && prevPick.timestamp) {
}
                const timeDiff = (currentPick.timestamp - prevPick.timestamp) / 1000; // in seconds
                
                if (!pickTimes[currentPick.teamId]) {
}
                    pickTimes[currentPick.teamId] = [];

                pickTimes[currentPick.teamId].push(timeDiff);


        return league.teams.map((team: any) => {
}
            const times = pickTimes[team.id] || [];
            const avgTime = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
            return {
}
                team,
                avgTime,
            };
        }).sort((a, b) => a.avgTime - b.avgTime);

    }, [league]);

    return (
        <Widget title="Average Pick Time">
            <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                <p className="text-xs text-gray-400 mb-4 sm:px-4 md:px-6 lg:px-8">See which managers were the most decisive during the draft. Time is measured from the previous pick to their own.</p>
                <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                    {analyticsData.map(({ team, avgTime }, index) => (
                        <div key={team.id} className="flex items-center justify-between p-2 bg-black/10 rounded-md sm:px-4 md:px-6 lg:px-8">
                            <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                                <span className="font-bold text-lg w-6 text-center sm:px-4 md:px-6 lg:px-8">{index + 1}</span>
                                <Avatar avatar={team.avatar} className="w-8 h-8 rounded-md sm:px-4 md:px-6 lg:px-8" />
                                <div>
                                    <p className="font-semibold text-sm sm:px-4 md:px-6 lg:px-8">{team.name}</p>
                                </div>
                            </div>
                            <p className="font-bold text-lg font-mono sm:px-4 md:px-6 lg:px-8">
                                {avgTime > 0 ? avgTime.toFixed(1) + &apos;s&apos; : &apos;N/A&apos;}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </Widget>
    );
};

const PickTimeAnalyticsWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <PickTimeAnalytics {...props} />
  </ErrorBoundary>
);

export default React.memo(PickTimeAnalyticsWithErrorBoundary);