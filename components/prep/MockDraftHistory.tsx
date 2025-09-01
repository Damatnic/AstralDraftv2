
import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo } from &apos;react&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;

const MockDraftHistory: React.FC = () => {
}
    const { state, dispatch } = useAppState();

    const mockDrafts = state.leagues.filter((l: any) => l.isMock);

    const handleViewDraft = (leagueId: string) => {
}
        dispatch({ type: &apos;SET_ACTIVE_LEAGUE&apos;, payload: leagueId });
        dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;DRAFT_ROOM&apos; });

    return (
        <div className="glass-pane p-4 rounded-xl sm:px-4 md:px-6 lg:px-8">
            <h3 className="font-bold mb-2 sm:px-4 md:px-6 lg:px-8">My Mock Drafts</h3>
            {mockDrafts.length === 0 ? (
}
                <p className="text-sm text-gray-400 text-center py-8 sm:px-4 md:px-6 lg:px-8">You haven&apos;t completed any mock drafts yet.</p>
            ) : (
                <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                    {mockDrafts.map((league: any) => (
}
                        <div key={league.id} className="p-3 bg-white/5 rounded-md flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                            <div>
                                <p className="font-semibold sm:px-4 md:px-6 lg:px-8">{league.name}</p>
                                <p className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">{league.settings.teamCount} Teams - {new Date(parseInt(league.id.split(&apos;_&apos;)[1])).toLocaleDateString()}</p>
                            </div>
                            {/* In a real app, this would link to a recap or a read-only board */}
                            <button className="px-3 py-1 text-xs font-bold bg-cyan-500/10 text-cyan-300 rounded-md hover:bg-cyan-500/20 sm:px-4 md:px-6 lg:px-8" disabled aria-label="Action button">
                                View Results
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const MockDraftHistoryWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <MockDraftHistory {...props} />
  </ErrorBoundary>
);

export default React.memo(MockDraftHistoryWithErrorBoundary);
