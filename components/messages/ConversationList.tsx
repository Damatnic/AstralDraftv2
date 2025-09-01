import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;
import type { User } from &apos;../../types&apos;;
import { Avatar } from &apos;../ui/Avatar&apos;;
import { PlusCircleIcon } from &apos;../icons/PlusCircleIcon&apos;;

interface ConversationListProps {
}
    selectedUserId: string | null;
    onSelectUser: (userId: string) => void;
    onStartNewMessage: () => void;
    isNewMessageActive: boolean;

}

const ConversationList: React.FC<ConversationListProps> = ({ selectedUserId, onSelectUser, onStartNewMessage, isNewMessageActive }: any) => {
}
    const { state } = useAppState();

    const conversations = React.useMemo(() => {
}
        const userMap = new Map<string, User>();
        state.leagues.forEach((league: any) => {
}
            league.members.forEach((member: any) => {
}
                if (member.id !== state.user?.id) {
}
                    userMap.set(member.id, member);
                }
            });
        });

        const lastMessageTimes: { [userId: string]: number } = {};
        const unreadCounts: { [userId: string]: number } = {};
        
        state.directMessages.forEach((dm: any) => {
}
            const otherUserId = dm.fromUserId === state.user?.id ? dm.toUserId : dm.fromUserId;
            if (!lastMessageTimes[otherUserId] || dm.timestamp > lastMessageTimes[otherUserId]) {
}
                lastMessageTimes[otherUserId] = dm.timestamp;
            }

            if (dm.toUserId === state.user?.id && !dm.isRead) {
}
                unreadCounts[otherUserId] = (unreadCounts[otherUserId] || 0) + 1;
            }
        });

        return Array.from(userMap.values())
            .map((user: any) => ({
}
                user,
                lastMessage: lastMessageTimes[user.id] || 0,
                unreadCount: unreadCounts[user.id] || 0,
            }))
            .sort((a, b) => b.lastMessage - a.lastMessage);

    }, [state.leagues, state.directMessages, state.user?.id]);

    return (
        <div className="h-full flex flex-col sm:px-4 md:px-6 lg:px-8">
            <div className="p-4 border-b border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                <button
                    onClick={onStartNewMessage}
                    className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-bold rounded-lg transition-colors ${
}
                        isNewMessageActive ? &apos;bg-cyan-500 text-black&apos; : &apos;bg-white/10 hover:bg-white/20&apos;
                    }`}
                 aria-label="Action button">
                    <PlusCircleIcon /> New Message
                </button>
            </div>
            <div className="flex-grow overflow-y-auto p-2 space-y-1 sm:px-4 md:px-6 lg:px-8">
                {conversations.map(({ user, unreadCount }: any) => (
                    <button
                        key={user.id}
                        onClick={() => onSelectUser(user.id)}
                    >
                        <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                            <Avatar avatar={user.avatar} className="w-10 h-10 text-2xl rounded-full sm:px-4 md:px-6 lg:px-8" />
                            <span className="font-semibold text-sm sm:px-4 md:px-6 lg:px-8">{user.name}</span>
                        </div>
                        {unreadCount > 0 && (
}
                            <span className="w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

const ConversationListWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <ConversationList {...props} />
  </ErrorBoundary>
);

export default React.memo(ConversationListWithErrorBoundary);