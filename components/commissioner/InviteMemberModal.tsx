import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../../contexts/AppContext';
import { Modal } from '../ui/Modal';
import { UserPlusIcon } from '../icons/UserPlusIcon';
import type { League } from '../../types';
import { ClipboardIcon } from '../icons/ClipboardIcon';
import { CheckIcon } from '../icons/CheckIcon';
import useCopyToClipboard from '../../hooks/useCopyToClipboard';

interface InviteMemberModalProps {
    league: League;
    onClose: () => void;
}

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ league, onClose }: any) => {
    const { dispatch } = useAppState();
    const [email, setEmail] = React.useState('');
    const [copiedLink, setCopiedLink] = React.useState<string | null>(null);
    const { copy } = useCopyToClipboard();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim().includes('@')) {
            dispatch({ type: 'ADD_NOTIFICATION', payload: { message: "Please enter a valid email.", type: 'SYSTEM' } });
            return;
        }

        dispatch({ type: 'INVITE_MEMBER', payload: { leagueId: league.id, invitation: { email, status: 'PENDING', leagueId: league.id } } });
        setEmail('');
    };

    const handleCopy = (link: string) => {
        copy(link);
        setCopiedLink(link);
        setTimeout(() => setCopiedLink(null), 2000);
    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            <motion.div
                className="glass-pane rounded-xl shadow-2xl w-full max-w-lg sm:px-4 md:px-6 lg:px-8"
                onClick={e => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <header className="p-4 border-b border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                    <h2 className="text-xl font-bold font-display flex items-center gap-2 sm:px-4 md:px-6 lg:px-8"><UserPlusIcon /> Invite Members</h2>
                </header>
                <form onSubmit={handleSubmit} className="p-4 space-y-4 sm:px-4 md:px-6 lg:px-8">
                    <label htmlFor="invite-email" className="block text-sm font-medium text-gray-400 mb-1 sm:px-4 md:px-6 lg:px-8">Manager Email</label>
                    <div className="flex gap-2 sm:px-4 md:px-6 lg:px-8">
                        <input
                            id="invite-email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="new.manager@email.com"
                        />
                        <button type="submit" className="px-4 py-2 text-sm font-bold bg-cyan-500 text-black rounded-md sm:px-4 md:px-6 lg:px-8" aria-label="Action button">Send Invite</button>
                    </div>
                </form>
                <div className="p-4 border-t border-[var(--panel-border)] max-h-64 overflow-y-auto sm:px-4 md:px-6 lg:px-8">
                    <h3 className="font-semibold text-sm mb-2 sm:px-4 md:px-6 lg:px-8">Pending Invitations</h3>
                    {league.invitations && league.invitations.length > 0 ? (
                        <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                            {league.invitations.map((inv: any) => (
                                <div key={inv.id} className="p-2 bg-black/10 rounded-md flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                                    <span className="text-sm text-gray-300 sm:px-4 md:px-6 lg:px-8">{inv.email}</span>
                                    <button 
                                        onClick={() => handleCopy(inv.link)}
                                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded"
                                    >
                                        Copy Link
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">No pending invites.</p>
                    )}
                </div>
            </motion.div>
        </Modal>
    );
};

const InviteMemberModalWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <InviteMemberModal {...props} />
  </ErrorBoundary>
);

export default React.memo(InviteMemberModalWithErrorBoundary);