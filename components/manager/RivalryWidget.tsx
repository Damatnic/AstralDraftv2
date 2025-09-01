
import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { SwordIcon } from &apos;../icons/SwordIcon&apos;;
import { calculateHeadToHeadRecord } from &apos;../../utils/careerStats&apos;;

interface RivalryWidgetProps {
}
    opponentManagerId: string;

}

const RivalryWidget: React.FC<RivalryWidgetProps> = ({ opponentManagerId }: any) => {
}
    const { state } = useAppState();

    const record = React.useMemo(() => {
}
        return calculateHeadToHeadRecord(state.user?.id || &apos;guest&apos;, opponentManagerId, state.leagues);
    }, [state.user?.id, opponentManagerId, state.leagues]);

    const { regularSeason, playoffs } = record;
    const totalWins = regularSeason.wins + playoffs.wins;
    const totalLosses = regularSeason.losses + playoffs.losses;
    const totalTies = regularSeason.ties + playoffs.ties;

    const getRecordColor = (wins: number, losses: number) => {
}
        if (wins > losses) return &apos;text-green-400&apos;;
        if (losses > wins) return &apos;text-red-400&apos;;
        return &apos;text-yellow-400&apos;;
    };

    return (
        <Widget title="Rivalry" icon={<SwordIcon />}>
            <div className="p-4 text-center sm:px-4 md:px-6 lg:px-8">
                <p className="text-sm text-gray-300 sm:px-4 md:px-6 lg:px-8">All-Time Head-to-Head</p>
                <p className={`font-display text-4xl font-bold my-2 ${getRecordColor(totalWins, totalLosses)}`}>
                    {totalWins}-{totalLosses}{totalTies > 0 ? `-${totalTies}` : &apos;&apos;}
                </p>
                <div className="text-xs text-gray-400 space-y-1 sm:px-4 md:px-6 lg:px-8">
                    <p>Regular Season: {regularSeason.wins}-{regularSeason.losses}{regularSeason.ties > 0 ? `-${regularSeason.ties}` : &apos;&apos;}</p>
                    <p>Playoffs: {playoffs.wins}-{playoffs.losses}{playoffs.ties > 0 ? `-${playoffs.ties}` : &apos;&apos;}</p>
                </div>
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
