
import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo } from &apos;react&apos;;
import type { Team, MatchupTeam, MatchupPlayer, GamedayEvent } from &apos;../../types&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import PlayerRow from &apos;./PlayerRow&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;

interface MatchupRosterViewProps {
}
    team: Team;
    matchupTeam: MatchupTeam;
    isLive: boolean;
    week: number;
    matchupId: string;

}

const MatchupRosterView: React.FC<MatchupRosterViewProps> = ({ team, matchupTeam, isLive, week, matchupId }: any) => {
}
    const { state } = useAppState();
    const latestEvent = (state.gamedayEvents[matchupId] || []).slice(-1)[0];

    const getDisplayRoster = (): MatchupPlayer[] => {
}
        if (matchupTeam.roster.length > 0 && !isLive) {
}
            return matchupTeam.roster;
        }

        // For live or future weeks, merge roster data with live/projected scores
        return team.roster.slice(0, 9).map((player: any) => {
}
            const liveData = matchupTeam.roster.find((p: any) => p.player.id === player.id);
            const projectedScore = parseFloat((player.stats.weeklyProjections[week] || player.stats.projection / 17).toFixed(2));
            return {
}
                player,
                projectedScore,
                actualScore: liveData?.actualScore || 0,
                isHot: liveData?.isHot || false,
            };
        });
    };

    const displayRoster = getDisplayRoster();

    return (
        <Widget title={team.name}>
            <div className="p-2 space-y-1 sm:px-4 md:px-6 lg:px-8">
                <div className="grid grid-cols-[3rem_1fr_4rem_4rem] gap-2 text-xs text-gray-400 px-2 py-1 sm:px-4 md:px-6 lg:px-8">
                    <span>POS</span>
                    <span>PLAYER</span>
                    <span className="text-right sm:px-4 md:px-6 lg:px-8">PROJ</span>
                    <span className="text-right sm:px-4 md:px-6 lg:px-8">SCORE</span>
                </div>
                {displayRoster.map((playerData, index) => (
}
                   <PlayerRow>
                        key={playerData.player.id}
                        playerData={playerData}
                        position={[&apos;QB&apos;, &apos;RB&apos;, &apos;RB&apos;, &apos;WR&apos;, &apos;WR&apos;, &apos;TE&apos;, &apos;FLEX&apos;, &apos;DST&apos;, &apos;K&apos;][index]}
                        latestEvent={latestEvent}
                   />
                ))}
            </div>
        </Widget>
    );
};

const MatchupRosterViewWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <MatchupRosterView {...props} />
  </ErrorBoundary>
);

export default React.memo(MatchupRosterViewWithErrorBoundary);
