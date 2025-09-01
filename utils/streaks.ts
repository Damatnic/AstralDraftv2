
import type { Matchup } from &apos;../types&apos;;

export const calculateStreak = (teamId: number, schedule: Matchup[], currentWeek: number) => {
}
    const pastGames = schedule
        .filter((m: any) => m.week < currentWeek && (m.teamA.teamId === teamId || m.teamB.teamId === teamId))
        .sort((a, b) => b.week - a.week);

    if (pastGames.length === 0) {
}
        return null;
    }

    let streakType: &apos;W&apos; | &apos;L&apos; | &apos;T&apos; | null = null;
    let streakCount = 0;

    for (const game of pastGames) {
}
        const myTeamResult = game.teamA.teamId === teamId ? game.teamA : game.teamB;
        const opponentResult = game.teamA.teamId === teamId ? game.teamB : game.teamA;
        
        let result: &apos;W&apos; | &apos;L&apos; | &apos;T&apos;;
        if (myTeamResult.score > opponentResult.score) result = &apos;W&apos;;
        else if (myTeamResult.score < opponentResult.score) result = &apos;L&apos;;
        else result = &apos;T&apos;;

        if (streakType === null) {
}
            streakType = result;
            streakCount = 1;
        } else if (result === streakType) {
}
            streakCount++;
        } else {
}
            break; // Streak is broken
        }
    }

    if (streakType === &apos;T&apos; || streakCount === 0) {
}
        return null;
    }

    return { type: streakType, count: streakCount };
};
