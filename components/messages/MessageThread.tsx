import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback } from 'react';
import { useAppState } from '../../contexts/AppContext';
import { Avatar } from '../ui/Avatar';
import { SendIcon } from '../icons/SendIcon';
import type { User } from '../../types';
import EmptyState from '../ui/EmptyState';
import { UsersIcon } from 'lucide-react';

interface MessageThreadProps {
    userId: string | null;
    onUserSelected?: (userId: string) => void;

}

const MessageThread: React.FC<MessageThreadProps> = ({ userId, onUserSelected }) => {
  const [isLoading, setIsLoading] = React.useState(false);
    const { state, dispatch } = useAppState();
    const [text, setText] = React.useState('');
    const [tempUser, setTempUser] = React.useState<User | null>(null);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    const otherUser = userId ? state.leagues.flatMap(l => l.members).find((m: any) => m.id === userId) : null;
    const finalUser = otherUser || tempUser;

    React.useEffect(() => {
        if (userId) {
            dispatch({ type: 'MARK_CONVERSATION_AS_READ', payload: { userId } });
        }
    }, [userId, dispatch]);

    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [userId, state.directMessages]);
    
    const handleSend = () => {
        if (!text.trim() || !finalUser) return;
        dispatch({ type: 'SEND_DIRECT_MESSAGE', payload: { toUserId: finalUser.id, text } });
        setText('');
    };

    const messages = state.directMessages.filter(
        dm => (dm.fromUserId === state.user?.id && dm.toUserId === userId) || (dm.fromUserId === userId && dm.toUserId === state.user?.id)
    );
    
    const allUsers = React.useMemo(() => {
        const userMap = new Map<string, User>();
        state.leagues.forEach((league: any) => {
            league.members.forEach((member: any) => {
                if (member.id !== state.user?.id) {
                    userMap.set(member.id, member);
                }
            });
        });
        return Array.from(userMap.values());
    },[state.leagues, state.user?.id]);

    if (!userId && onUserSelected) {
         return (
            <div className="h-full flex flex-col sm:px-4 md:px-6 lg:px-8">
                <div className="p-2 border-b border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                     <p className="p-2 text-sm sm:px-4 md:px-6 lg:px-8">Select a user to start a conversation:</p>
                </div>
                <div className="flex-grow overflow-y-auto p-2 space-y-1 sm:px-4 md:px-6 lg:px-8">
                    {allUsers.map((user: any) => (
                        <button key={user.id} onClick={() => onUserSelected(user.id)}>
                            <Avatar avatar={user.avatar} className="w-8 h-8 rounded-full mr-2 sm:px-4 md:px-6 lg:px-8"/>
                            {user.name}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    if (!finalUser) {
        return <div />;
    }

    return (
        <div className="h-full flex flex-col sm:px-4 md:px-6 lg:px-8">
            <header className="p-3 border-b border-[var(--panel-border)] flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                <Avatar avatar={finalUser.avatar} className="w-8 h-8 text-xl rounded-full sm:px-4 md:px-6 lg:px-8" />
                <h3 className="font-bold text-lg sm:px-4 md:px-6 lg:px-8">{finalUser.name}</h3>
            </header>
            <main className="flex-grow p-4 space-y-4 overflow-y-auto sm:px-4 md:px-6 lg:px-8">
                {messages.map((msg: any) => (
                    <div key={msg.id} className={`flex items-start gap-2.5 text-sm ${msg.fromUserId === state.user?.id ? 'justify-end' : ''}`}>
                        {msg.fromUserId !== state.user?.id && <Avatar avatar={finalUser.avatar} className="w-8 h-8 text-xl rounded-full sm:px-4 md:px-6 lg:px-8" />}
                        <div className={`p-2 rounded-lg max-w-[70%] ${msg.fromUserId === state.user?.id ? 'bg-cyan-600' : 'bg-black/20'}`}>
                            <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
                 <div ref={messagesEndRef} />
            </main>
            <footer className="p-3 border-t border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                <div className="flex gap-2 sm:px-4 md:px-6 lg:px-8">
                    <input
                        type="text"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder={`Message ${finalUser.name}...`}
                        className="flex-grow bg-black/20 p-2 rounded-md border border-white/10 focus:outline-none focus:ring-1 focus:ring-cyan-400 sm:px-4 md:px-6 lg:px-8"
                    />
                    <button onClick={handleSend} disabled={!text.trim()} className="p-2 bg-cyan-500 text-black rounded-md disabled:opacity-50 sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                        <SendIcon />
                    </button>
                </div>
            </footer>
        </div>
    );
};

const MessageThreadWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <MessageThread {...props} />
  </ErrorBoundary>
);

export default React.memo(MessageThreadWithErrorBoundary);