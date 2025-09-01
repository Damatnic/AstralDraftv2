
import type { League, Player, PlayerPosition, User } from &apos;../types&apos;;
import { players } from &apos;../data/players&apos;;
import { getAiDraftPick } from &apos;../services/geminiService&apos;;
import useSound from &apos;./useSound&apos;;
import { useAppState } from &apos;../contexts/AppContext&apos;;
import { showNotification } from &apos;../utils/notifications&apos;;

const DRAFT_SPEED_MS = 3000; // Increased speed slightly to account for API latency
const USER_PICK_TIME_LIMIT_MS = 60000;

export const useRealtimeDraft = (
    league: League | undefined, 
    isPaused: boolean,
    user: User, 
    dispatch: React.Dispatch<any>
) => {
}
    const { state } = useAppState();
    const playDraftSound = useSound(&apos;draft&apos;, 0.5);
    const playYourTurnSound = useSound(&apos;yourTurn&apos;, 0.3);

    const teams = league?.teams ?? [];
    const draftPicks = league?.draftPicks ?? [];
    const status = league?.status;

    const currentPick = draftPicks.filter((p: any) => p.playerId).length + 1;
    const availablePlayers = players.filter((p: any) => !draftPicks.some((dp: any) => dp.playerId === p.id));
    const myTeamId = teams.find((t: any) => t.owner.id === user.id)?.id;
    const teamOnClockId = league ? league.draftPicks[currentPick - 1]?.teamId : null;
    const isMyTurn = myTeamId === teamOnClockId;
    
    // Play sound on user&apos;s turn
    React.useEffect(() => {
}
        if (!league || isPaused || status !== &apos;DRAFTING&apos;) return;
        if (isMyTurn) {
}
            playYourTurnSound();
            showNotification("It&apos;s your turn to draft!", {
}
                body: `You are on the clock in ${league.name}.`,
                tag: `turn-notification-${league.id}`
            });
        }
    }, [isMyTurn, user.id, league, isPaused, status, playYourTurnSound]);

    React.useEffect(() => {
}
        if (!league || status !== &apos;DRAFTING&apos; || isPaused || currentPick > league.draftPicks.length) {
}
            return;
        }

        const teamOnTheClock = league.teams.find((t: any) => t.id === teamOnClockId);

        if (!teamOnTheClock) return;

        // AI Pick Logic
        if (teamOnTheClock.owner.id.startsWith(&apos;ai_&apos;)) {
}
            const pickTimer = setTimeout(async () => {
}
                const currentPicksInHook = league.draftPicks.filter((p: any) => p.playerId).length;
                
                if ((currentPicksInHook + 1) !== currentPick) return;

                const availablePlayersNow = players.filter((p: any) => !league.draftPicks.some((dp: any) => dp.playerId === p.id));
                const recommendedPlayerName = await getAiDraftPick(teamOnTheClock, availablePlayersNow);
                let playerToDraft = recommendedPlayerName ? availablePlayersNow.find((p: any) => p.name === recommendedPlayerName) : undefined;

                if (!playerToDraft) {
}
                    console.warn("Gemini pick failed or was invalid. Using fallback logic.");
                    const rosterCount = (pos: Player[&apos;position&apos;]) => teamOnTheClock.roster.filter((rp: any) => rp.position === pos).length;
                    const ROSTER_LIMITS: { [key in PlayerPosition]: number } = { QB: 2, RB: 5, WR: 6, TE: 2, K: 1, DST: 1 };
                    const neededPlayers = availablePlayersNow.filter((p: any) => rosterCount(p.position) < ROSTER_LIMITS[p.position]);
                    playerToDraft = neededPlayers[0] || availablePlayersNow[0];
                }

                if (playerToDraft) {
}
                    dispatch({ type: &apos;DRAFT_PLAYER&apos;, payload: { teamId: teamOnTheClock.id, player: playerToDraft } });
                    dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: { message: `${teamOnTheClock.name} drafted ${playerToDraft.name}`, type: &apos;DRAFT&apos; }});
                    playDraftSound();
                }
            }, DRAFT_SPEED_MS);

            return () => clearTimeout(pickTimer);
        }
        
        // User Auto-Draft Logic
        if (isMyTurn) {
}
             const autoDraftTimer = setTimeout(() => {
}
                const myQueue = state.playerQueues[league.id] || [];
                const availablePlayersNow = players.filter((p: any) => !league.draftPicks.some((dp: any) => dp.playerId === p.id));
                const availablePlayerIds = new Set(availablePlayersNow.map((p: any) => p.id));
                const playerToDraftFromQueue = myQueue.map((pid: any) => players.find((p: any) => p.id === pid)).find((p: any) => p && availablePlayerIds.has(p.id));

                if (playerToDraftFromQueue) {
}
                    dispatch({ type: &apos;DRAFT_PLAYER&apos;, payload: { teamId: myTeamId, player: playerToDraftFromQueue } });
                    dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: { message: `Auto-drafted ${playerToDraftFromQueue.name} from your queue.`, type: &apos;SYSTEM&apos; }});
                    playDraftSound();
                } else if(availablePlayersNow.length > 0) {
}
                     // Fallback: draft best available player if queue is empty/exhausted
                    dispatch({ type: &apos;DRAFT_PLAYER&apos;, payload: { teamId: myTeamId, player: availablePlayersNow[0] } });
                    dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: { message: `Auto-drafted ${availablePlayersNow[0].name} (Best Available).`, type: &apos;SYSTEM&apos; }});
                    playDraftSound();
                }
            }, USER_PICK_TIME_LIMIT_MS);
            
            return () => clearTimeout(autoDraftTimer);
        }

    }, [currentPick, league, status, isPaused, dispatch, playDraftSound, isMyTurn, myTeamId, state.playerQueues, teamOnClockId]);

    const draftPlayer = React.useCallback((player: Player) => {
}
        if (!league) return;
        
        const internalCurrentPick = league.draftPicks.filter((p: any) => p.playerId).length + 1;
        const currentTeamId = league.draftPicks[internalCurrentPick - 1]?.teamId;

        if (myTeamId === currentTeamId) {
}
            dispatch({ type: &apos;DRAFT_PLAYER&apos;, payload: { teamId: myTeamId, player } });
            dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: { message: `You drafted ${player.name}!`, type: &apos;DRAFT&apos; }});
            playDraftSound();
        } else {
}
            dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: { message: "It&apos;s not your turn!", type: &apos;SYSTEM&apos; } });
        }
    }, [league, myTeamId, dispatch, playDraftSound]);

    const latestPickOverall = draftPicks.filter((p: any) => p.playerId).length;
    const latestPick = draftPicks.find((p: any) => p.overall === latestPickOverall);
    const latestPlayer = latestPick ? players.find((p: any) => p.id === latestPick.playerId) : null;

    return {
}
        teams,
        draftPicks,
        availablePlayers,
        currentPick,
        latestPick: latestPlayer && latestPick ? { ...latestPick, player: latestPlayer } : null,
//         draftPlayer
    };
};
