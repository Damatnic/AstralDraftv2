

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../../contexts/AppContext';
import { Modal } from '../ui/Modal';
import { MegaphoneIcon } from '../icons/MegaphoneIcon';

interface PostAnnouncementModalProps {
    leagueId: string;
    onClose: () => void;

}

const PostAnnouncementModal: React.FC<PostAnnouncementModalProps> = ({ leagueId, onClose }) => {
    const { dispatch } = useAppState();
    const [title, setTitle] = React.useState('');
    const [content, setContent] = React.useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            dispatch({ type: 'ADD_NOTIFICATION', payload: { message: "Title and content must be filled out.", type: 'SYSTEM' } });
            return;

        dispatch({
            type: 'POST_ANNOUNCEMENT',
            payload: { leagueId, announcement: { title, content } },
        });
        dispatch({ type: 'ADD_NOTIFICATION', payload: { message: "Announcement posted!", type: 'SYSTEM' } });
        onClose();
    };
    
    return (
        <Modal isOpen={true} onClose={onClose}>
            <motion.form
                onSubmit={handleSubmit}
                onClick={e => e.stopPropagation()},
                    animate: { opacity: 1, scale: 1 },
                }}
            >
                <header className="p-4 border-b border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                    <h2 className="text-xl font-bold font-display flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                        <MegaphoneIcon /> Post New Announcement
                    </h2>
                </header>
                <main className="p-4 space-y-4 sm:px-4 md:px-6 lg:px-8">
                    <div>
                        <label htmlFor="announcement-title" className="block text-sm font-medium text-gray-400 mb-1 sm:px-4 md:px-6 lg:px-8">Title</label>
                        <input
                            id="announcement-title"
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="e.g., Trade Deadline Approaching"
                        />
                    </div>
                    <div>
                        <label htmlFor="announcement-content" className="block text-sm font-medium text-gray-400 mb-1 sm:px-4 md:px-6 lg:px-8">Content</label>
                        <textarea
                            id="announcement-content"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            placeholder="Write your announcement here..."
                        />
                    </div>
                </main>
                 <footer className="p-4 flex justify-end gap-2 border-t border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-bold bg-transparent border border-transparent hover:border-[var(--panel-border)] rounded-md sm:px-4 md:px-6 lg:px-8" aria-label="Action button">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-sm font-bold bg-cyan-500 text-black rounded-md sm:px-4 md:px-6 lg:px-8" aria-label="Action button">Post Announcement</button>
                </footer>
            </motion.form>
        </Modal>
    );
};

const PostAnnouncementModalWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <PostAnnouncementModal {...props} />
  </ErrorBoundary>
);

export default React.memo(PostAnnouncementModalWithErrorBoundary);
