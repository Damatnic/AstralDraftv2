
import React, { useCallback } from &apos;react&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { PawPrintIcon } from &apos;../icons/PawPrintIcon&apos;;
import { generateTeamMascot } from &apos;../../services/geminiService&apos;;
import type { League, Team } from &apos;../../types&apos;;
import LoadingSpinner from &apos;../ui/LoadingSpinner&apos;;
import { LazyImage } from &apos;../ui/LazyImage&apos;;

interface MascotWidgetProps {
}
    team: Team;
    league: League;
    dispatch: React.Dispatch<any>;

}

export const MascotWidget: React.FC<MascotWidgetProps> = ({ team, league, dispatch }: any) => {
}
    const [isLoading, setIsLoading] = React.useState(false);
    const mascotUrl = team.mascotUrl;

    const handleGenerate = async () => {
}
        setIsLoading(true);
        try {
}
            const newMascotUrl = await generateTeamMascot(team);
            if (newMascotUrl) {
}
                dispatch({
}
                    type: &apos;SET_TEAM_MASCOT&apos;,
                    payload: { leagueId: league.id, teamId: team.id, mascotUrl: newMascotUrl }
                });
                dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: { message: &apos;Mascot generated!&apos;, type: &apos;SYSTEM&apos; }});
            } else {
}
                 dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: { message: &apos;Could not generate a mascot.&apos;, type: &apos;SYSTEM&apos; }});

    } catch (error) {
}
            dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: { message: &apos;An error occurred while generating the mascot.&apos;, type: &apos;SYSTEM&apos; }});
        } finally {
}
            setIsLoading(false);

    };

    return (
        <Widget title="Team Mascot" icon={<PawPrintIcon />}>
            <div className="p-4 flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
                {isLoading ? (
}
                    <LoadingSpinner size="sm" text="The Oracle is sketching..." />
                ) : mascotUrl ? (
                    <LazyImage>
                      src={mascotUrl} 
                      alt={`${team.name} Mascot`} 
                      className="w-32 h-32 rounded-lg object-cover sm:px-4 md:px-6 lg:px-8"
                      loading="lazy"
                    />
                ) : (
                    <div className="text-center sm:px-4 md:px-6 lg:px-8">
                        <p className="text-xs text-gray-400 mb-2 sm:px-4 md:px-6 lg:px-8">Your team doesn&apos;t have a mascot yet. Let the Oracle create one for you!</p>
                        <button
                            onClick={handleGenerate}
                            className="px-4 py-1.5 text-xs font-bold bg-cyan-500/10 text-cyan-300 rounded-md hover:bg-cyan-500/20 sm:px-4 md:px-6 lg:px-8"
                         aria-label="Action button">
                            Generate AI Mascot
                        </button>
                    </div>
                )}
            </div>
        </Widget>
    );
};
