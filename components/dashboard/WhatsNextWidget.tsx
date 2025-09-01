import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { ArrowRightIcon } from &apos;../icons/ArrowRightIcon&apos;;
import { SparklesIcon } from &apos;../icons/SparklesIcon&apos;;

const WhatsNextWidget: React.FC = () => {
}
    const { state, dispatch } = useAppState();
    
    // Find the most relevant league (active, or first non-mock, or first mock)
    const activeLeague = state.leagues.find((l: any) => l.id === state.activeLeagueId);
    const primaryLeague = activeLeague || state.leagues.find((l: any) => !l.isMock) || state.leagues[0];

    let action = {
}
        title: "Welcome to Astral Draft!",
        description: "Create a new league or start a mock draft to begin your journey.",
        buttonText: "Create League",
        onClick: () => { /* This should open the create league modal, handled in DashboardView */ }
    };

    if (primaryLeague) {
}
        switch (primaryLeague?.status) {
}
            case &apos;PRE_DRAFT&apos;:
                action = {
}
                    title: `Prepare for your draft in ${primaryLeague.name}!`,
                    description: "Head to the league hub to check settings and get ready for the big day.",
                    buttonText: "Go to League Hub",
                    onClick: () => {
}
                        dispatch({ type: &apos;SET_ACTIVE_LEAGUE&apos;, payload: primaryLeague.id });
                        dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;LEAGUE_HUB&apos; });

                };
                break;
            case &apos;DRAFTING&apos;:
                action = {
}
                    title: `Draft is live in ${primaryLeague.name}!`,
                    description: "Your draft is currently in progress. Enter the draft room to make your picks.",
                    buttonText: "Enter Draft Room",
                    onClick: () => {
}
                        dispatch({ type: &apos;SET_ACTIVE_LEAGUE&apos;, payload: primaryLeague.id });
                        dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;DRAFT_ROOM&apos; });

                };
                break;
            case &apos;IN_SEASON&apos;:
            case &apos;PLAYOFFS&apos;:
                const myTeam = primaryLeague.teams.find((t: any) => t.owner.id === state.user?.id);
                const matchup = primaryLeague.schedule.find((m: any) => m.week === primaryLeague.currentWeek && (m.teamA.teamId === myTeam?.id || m.teamB.teamId === myTeam?.id));
                const opponent = primaryLeague.teams.find((t: any) => t.id === (matchup?.teamA.teamId === myTeam?.id ? matchup?.teamB.teamId : matchup?.teamA.teamId));

                action = {
}
                    title: `Week ${primaryLeague.currentWeek}: vs. ${opponent?.name || &apos;Opponent&apos;}`,
                    description: "It&apos;s game week! Set your lineup, check the waiver wire, and prepare for victory.",
                    buttonText: "Go to My Team",
                    onClick: () => {
}
                         dispatch({ type: &apos;SET_ACTIVE_LEAGUE&apos;, payload: primaryLeague.id });
                         dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;TEAM_HUB&apos; });

                };
                break;
             case &apos;DRAFT_COMPLETE&apos;:
                 action = {
}
                    title: `Draft Complete in ${primaryLeague.name}!`,
                    description: "Your draft is finished. Check out the analytics to see your grade and review the results.",
                    buttonText: "View Draft Analytics",
                    onClick: () => {
}
                         dispatch({ type: &apos;SET_ACTIVE_LEAGUE&apos;, payload: primaryLeague.id });
                         dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;ANALYTICS_HUB&apos; });

                };
                break;
            case &apos;COMPLETE&apos;:
                 action = {
}
                    title: `Season Complete in ${primaryLeague.name}!`,
                    description: "The season is over. Relive the glory by checking out the season summary and awards.",
                    buttonText: "View Season Review",
                    onClick: () => {
}
                         dispatch({ type: &apos;SET_ACTIVE_LEAGUE&apos;, payload: primaryLeague.id });
                         dispatch({ type: &apos;SET_SEASON_REVIEW_YEAR&apos;, payload: new Date().getFullYear() - 1 });
                         dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;SEASON_REVIEW&apos; });

                };
                break;


    return (
        <Widget title="What&apos;s Next" icon={<SparklesIcon />} className="row-span-2 sm:px-4 md:px-6 lg:px-8">
            <div className="p-4 flex flex-col justify-between h-full sm:px-4 md:px-6 lg:px-8">
                <div>
                    <h3 className="font-bold text-lg text-white sm:px-4 md:px-6 lg:px-8">{action.title}</h3>
                    <p className="text-sm text-gray-300 mt-1 sm:px-4 md:px-6 lg:px-8">{action.description}</p>
                </div>
                <button 
                    onClick={action.onClick}
                    className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg btn-primary sm:px-4 md:px-6 lg:px-8"
                 aria-label="Action button">
                    {action.buttonText}
                    <ArrowRightIcon />
                </button>
            </div>
        </Widget>
    );
};

const WhatsNextWidgetWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <WhatsNextWidget {...props} />
  </ErrorBoundary>
);

export default React.memo(WhatsNextWidgetWithErrorBoundary);