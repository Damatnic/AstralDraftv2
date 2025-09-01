
import { useAppState } from &apos;../contexts/AppContext&apos;;
import { liveDataService } from &apos;../services/liveDataService&apos;;
import type { League, Team, GamedayEvent, LiveNewsItem } from &apos;../types&apos;;

export const useLiveData = (league?: League, myTeam?: Team, opponentTeam?: Team) => {
}
    const { state, dispatch } = useAppState();
    const [latestNews, setLatestNews] = React.useState<LiveNewsItem | null>(null);

    React.useEffect(() => {
}
        // Only start the service if we are on the MATCHUP view and have all the data.
        if (state.currentView === &apos;MATCHUP&apos; && league && myTeam && opponentTeam) {
}
            const handleEvent = (event: GamedayEvent | LiveNewsItem) => {
}
                if (&apos;type&apos; in event && &apos;player&apos; in event) { // It&apos;s a GamedayEvent
}
                    const matchup = league.schedule.find((m: any) =>
                        m.week === league.currentWeek &&
                        (m.teamA.teamId === myTeam.id || m.teamB.teamId === myTeam.id)
                    );
                    if (matchup) {
}
                        dispatch({
}
                            type: &apos;ADD_GAMEDAY_EVENT&apos;,
                            payload: { matchupId: matchup.id, event }
                        });
                    }
                } else { // It&apos;s a LiveNewsItem
}
                    setLatestNews(event as LiveNewsItem);
                }
            };
            
            liveDataService.subscribe(handleEvent);
            liveDataService.start(league, myTeam, opponentTeam);

            return () => {
}
                liveDataService.unsubscribe(handleEvent);
                liveDataService.stop();
            };
        } else {
}
             // Ensure the service is stopped if we navigate away or data is missing.
             liveDataService.stop();
        }
    }, [league, myTeam, opponentTeam, dispatch, state.currentView]);

    return { latestNews };
};
