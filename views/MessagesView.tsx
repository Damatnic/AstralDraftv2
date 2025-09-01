import { useAppState } from &apos;../contexts/AppContext&apos;;
import { MailIcon } from &apos;../components/icons/MailIcon&apos;;
import ConversationList from &apos;../components/messages/ConversationList&apos;;
import MessageThread from &apos;../components/messages/MessageThread&apos;;
import EmptyState from &apos;../components/ui/EmptyState&apos;;
import { InboxIcon } from &apos;../components/icons/InboxIcon&apos;;

const MessagesView: React.FC = () => {
}
    const { state, dispatch } = useAppState();
    const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null);
    const [showNewMessage, setShowNewMessage] = React.useState(false);

    const handleSelectUser = (userId: string) => {
}
    
        setSelectedUserId(userId);
        setShowNewMessage(false);
    };
    
    const handleStartNewMessage = () => {
}
        setSelectedUserId(null);
        setShowNewMessage(true);
    };
    
    // Auto-select first user with unread messages
    React.useEffect(() => {
}
        const firstUnread = state.directMessages.find((dm: any) => dm.toUserId === state.user?.id && !dm.isRead);
        if (firstUnread) {
}
            setSelectedUserId(firstUnread.fromUserId);
        }
    }, []);

    return (
        <div className="min-h-screen">
            {/* Navigation Header */}
            <div className="nav-header">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="flex items-center gap-3">
                            <MailIcon />
//                             MESSAGES
                        </h1>
                    </div>
                    <button 
                        onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;DASHBOARD&apos; })} 
                        className="back-btn"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4">
                <main className="card overflow-hidden flex" style={{ height: &apos;80vh&apos; }}>
                    <div className="w-1/3 border-r border-slate-600 flex flex-col">
                        <ConversationList>
                            selectedUserId={selectedUserId} 
                            onSelectUser={handleSelectUser}
                            onStartNewMessage={handleStartNewMessage}
                            isNewMessageActive={showNewMessage}
                        />
                    </div>
                    <div className="w-2/3">
                        {selectedUserId ? (
}
                            <MessageThread userId={selectedUserId} />
                        ) : showNewMessage ? (
                             <MessageThread userId={null} onUserSelected={handleSelectUser}/>
                        ) : (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center text-secondary">
                                    <InboxIcon />
                                    <p className="mt-4">Select a conversation or start a new one.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MessagesView;