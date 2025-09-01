

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback } from &apos;react&apos;;
import { motion } from &apos;framer-motion&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;
import { Modal } from &apos;../ui/Modal&apos;;
import { MegaphoneIcon } from &apos;../icons/MegaphoneIcon&apos;;

interface PostAnnouncementModalProps {
}
    leagueId: string;
    onClose: () => void;

}

const PostAnnouncementModal: React.FC<PostAnnouncementModalProps> = ({ leagueId, onClose }: any) => {
}
    const { dispatch } = useAppState();
    const [title, setTitle] = React.useState(&apos;&apos;);
    const [content, setContent] = React.useState(&apos;&apos;);

    const handleSubmit = (e: React.FormEvent) => {
}
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
}
            dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: { message: "Title and content must be filled out.", type: &apos;SYSTEM&apos; } });
            return;

        dispatch({
}
            type: &apos;POST_ANNOUNCEMENT&apos;,
            payload: { leagueId, announcement: { title, content } },
        });
        dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: { message: "Announcement posted!", type: &apos;SYSTEM&apos; } });
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

const PostAnnouncementModalWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <PostAnnouncementModal {...props} />
  </ErrorBoundary>
);

export default React.memo(PostAnnouncementModalWithErrorBoundary);
