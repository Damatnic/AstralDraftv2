import { useAppState } from &apos;../contexts/AppContext&apos;;
import type { League } from &apos;../types&apos;;
import { players } from &apos;../data/players&apos;;
import { generateDraftPickCommentary } from &apos;../services/geminiService&apos;;

export const useDraftCommentary = (league: League | undefined) => {
}
    const { dispatch } = useAppState();
    const picksSoFar = league?.draftPicks.filter((p: any) => p.playerId).length || 0;
    const prevPicksCount = React.useRef(picksSoFar);
    
    React.useEffect(() => {
}
        const currentPicksCount = league?.draftPicks.filter((p: any) => p.playerId).length || 0;

        if (league && currentPicksCount > prevPicksCount.current) {
}
            const latestPick = league.draftPicks.filter((p: any) => p.playerId).sort((a,b) => b.overall - a.overall)[0];
            if (!latestPick) return;

            const player = players.find((p: any) => p.id === latestPick.playerId);
            const team = league.teams.find((t: any) => t.id === latestPick.teamId);

            if (player && team) {
}
                generateDraftPickCommentary(player, team, latestPick.overall, latestPick.round, league).then(commentaryText => {
}
                    if (commentaryText) {
}
                        dispatch({
}
                            type: &apos;ADD_DRAFT_COMMENTARY&apos;,
                            payload: {
}
                                leagueId: league.id,
                                commentary: {
}
                                    pickNumber: latestPick.overall,
                                    text: commentaryText,
                                }
                            }
                        });
                    }
                });
            }
        }
        prevPicksCount.current = currentPicksCount;

    }, [picksSoFar, league, dispatch]);
};
