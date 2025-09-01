
import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo } from &apos;react&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;
import { useLeague } from &apos;../../hooks/useLeague&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { ClipboardListIcon } from &apos;../icons/ClipboardListIcon&apos;;

const WeeklyPollWidget: React.FC = () => {
}
    const { state, dispatch } = useAppState();
    const { league } = useLeague();
    
    if (!league) return null;

    const poll = (state.leaguePolls[league.id] || [])[0];
    const myVote = poll?.options.find((opt: any) => opt.votes.includes(state.user?.id))?.id;
    const totalVotes = poll?.options.reduce((acc, opt) => acc + opt.votes.length, 0) || 0;

    const handleVote = (optionId: string) => {
}
        if (!poll) return;
        dispatch({
}
            type: &apos;SUBMIT_POLL_VOTE&apos;,
            payload: { leagueId: league.id, pollId: poll.id, optionId },
        });
    };

    if (!poll) {
}
        return (
            <Widget title="Weekly Poll" icon={<ClipboardListIcon />}>
                <div className="p-4 text-center text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">
                    No active poll. The commissioner can create one.
                </div>
            </Widget>
        );
    }

    return (
        <Widget title="Weekly Poll" icon={<ClipboardListIcon />}>
            <div className="p-3 sm:px-4 md:px-6 lg:px-8">
                <p className="font-semibold text-sm mb-2 sm:px-4 md:px-6 lg:px-8">{poll.question}</p>
                <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                    {poll.options.map((option: any) => {
}
                        const isMyVote = myVote === option.id;
                        const voteCount = option.votes.length;
                        const votePercentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;

                        return myVote ? (
                            <div key={option.id} className={`p-2 rounded-md ${isMyVote ? &apos;bg-cyan-500/20&apos; : &apos;bg-black/10&apos;}`}>
                                <div className="flex justify-between items-center text-xs font-bold sm:px-4 md:px-6 lg:px-8">
                                    <span>{option.text}</span>
                                    <span>{votePercentage.toFixed(0)}% ({voteCount})</span>
                                </div>
                                <div className="w-full bg-black/20 h-1.5 rounded-full mt-1 sm:px-4 md:px-6 lg:px-8">
                                    <div className="h-full bg-cyan-400 rounded-full sm:px-4 md:px-6 lg:px-8" style={{ width: `${votePercentage}%` }} />
                                </div>
                            </div>
                        ) : (
                            <button
                                key={option.id}
                                onClick={() => handleVote(option.id)}
                            >
                                {option.text}
                            </button>
                        );
                    })}
                </div>
            </div>
        </Widget>
    );
};

const WeeklyPollWidgetWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <WeeklyPollWidget {...props} />
  </ErrorBoundary>
);

export default React.memo(WeeklyPollWidgetWithErrorBoundary);
