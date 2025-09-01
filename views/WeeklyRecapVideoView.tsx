
import { useAppState } from &apos;../contexts/AppContext&apos;;
import { useLeague } from &apos;../hooks/useLeague&apos;;
import { generateWeeklyRecapVideoScript } from &apos;../services/geminiService&apos;;
import type { RecapVideoScene } from &apos;../types&apos;;
import ErrorDisplay from &apos;../components/core/ErrorDisplay&apos;;
import LoadingSpinner from &apos;../components/ui/LoadingSpinner&apos;;
import RecapVideoPlayer from &apos;../components/reports/RecapVideoPlayer&apos;;

export const WeeklyRecapVideoView: React.FC = () => {
}
    const { state, dispatch } = useAppState();
    const { league } = useLeague();
    const [script, setScript] = React.useState<RecapVideoScene[] | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const week = league ? (league.currentWeek > 1 ? league.currentWeek - 1 : 1) : 1;
    const scriptCacheKey = league ? `${league.id}_${week}` : &apos;&apos;;

    React.useEffect(() => {
}
        if (!league || !scriptCacheKey) return;

        const cachedScript = state.weeklyRecapScripts[scriptCacheKey];
        if (cachedScript) {
}
            setScript(cachedScript);
            setIsLoading(false);
            return;

        setIsLoading(true);
        setError(null);
        generateWeeklyRecapVideoScript(league, week)
            .then(data => {
}
                if (data) {
}
                    setScript(data);
                    dispatch({ type: &apos;SET_WEEKLY_RECAP_SCRIPT&apos;, payload: { key: scriptCacheKey, script: data } });
                } else {
}
                    setError("The Oracle could not produce a video script for this week.");

            })
            .catch(() => setError("An error occurred while consulting the Oracle."))
            .finally(() => setIsLoading(false));

    }, [league, week, scriptCacheKey, state.weeklyRecapScripts, dispatch]);

    if (!league) {
}
        return <ErrorDisplay title="Error" message="No active league found." onRetry={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;DASHBOARD&apos; })} />;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-secondary)]/5">
            <div className="w-full max-w-4xl aspect-video bg-black rounded-2xl shadow-2xl shadow-black/50 overflow-hidden relative glass-pane">
                {isLoading && <LoadingSpinner text="Generating your weekly highlight reel..." />}
                {error && <ErrorDisplay message={error} />}
                {script && <RecapVideoPlayer script={script} league={league} />}
            </div>
            <button
                onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;WEEKLY_REPORT&apos; })
                className="glass-button mt-6"
            >
                Back to Report
            </button>
        </div>
    );
};

export default WeeklyRecapVideoView;