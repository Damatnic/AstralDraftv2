
import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import type { User } from '../../types';
import { Modal } from '../ui/Modal';
import { PencilIcon } from '../icons/PencilIcon';
import { Avatar } from '../ui/Avatar';

interface EditProfileModalProps {
  user: User;
  dispatch: React.Dispatch<any>;
  onClose: () => void;

}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, dispatch, onClose }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [name, setName] = React.useState(user.name);
  const [avatar, setAvatar] = React.useState(user.avatar);
  const [bio, setBio] = React.useState(user.bio || '');
  const [isDirty, setIsDirty] = React.useState(false);

  React.useEffect(() => {
    setIsDirty(name !== user.name || avatar !== user.avatar || bio !== (user.bio || ''));
  }, [name, avatar, bio, user]);

  const handleSave = () => {
    dispatch({
      type: 'UPDATE_USER_PROFILE',
      payload: { name, avatar, bio },
    });
    dispatch({ type: 'ADD_NOTIFICATION', payload: { message: 'Profile updated!', type: 'SYSTEM' } });
    onClose();
  };
  
  const inputClasses = "mobile-touch-target w-full bg-black/10 dark:bg-gray-900/50 border border-[var(--panel-border)] rounded-md px-3 py-3 text-sm placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-cyan-400";
  const labelClasses = "block text-sm font-medium text-[var(--text-secondary)] mb-1";

  return (
    <Modal isOpen={true} onClose={onClose}>
      <motion.div
        className="glass-pane rounded-xl shadow-2xl w-full max-w-lg sm:px-4 md:px-6 lg:px-8"
        onClick={(e: any) => e.stopPropagation()}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <header className="p-4 border-b border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
          <h2 className="text-xl font-bold font-display flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
            <PencilIcon />
            Edit Profile
          </h2>
        </header>
        <main className="p-6 space-y-4 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-4 sm:px-4 md:px-6 lg:px-8">
            <Avatar avatar={avatar} className="w-24 h-24 text-6xl rounded-lg flex-shrink-0 sm:px-4 md:px-6 lg:px-8" />
            <div className="flex-grow space-y-4 sm:px-4 md:px-6 lg:px-8">
              <div>
                <label htmlFor="user-name" className={labelClasses}>Display Name</label>
                <input id="user-name" type="text" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="user-avatar" className={labelClasses}>Avatar (Emoji or Image URL)</label>
                <input id="user-avatar" type="text" value={avatar} onChange={e => setAvatar(e.target.value)} required placeholder="😎 or https://..." />
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="user-bio" className={labelClasses}>Bio</label>
            <textarea
              id="user-bio"
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="h-24 resize-none form-input"
              placeholder="Tell everyone a little about your management style..."
              maxLength={150}
            />
            <p className="text-xs text-right text-gray-500 sm:px-4 md:px-6 lg:px-8">{bio.length}/150</p>
          </div>
        </main>
        <footer className="p-4 flex justify-end gap-2 border-t border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
          <button onClick={onClose} className="px-4 py-2 text-sm font-bold bg-transparent border border-transparent hover:border-[var(--panel-border)] rounded-md sm:px-4 md:px-6 lg:px-8" aria-label="Action button">Cancel</button>
          <button onClick={handleSave} disabled={!isDirty} className="px-6 py-2 text-sm font-bold bg-cyan-500 text-black rounded-md disabled:opacity-50 disabled:cursor-not-allowed sm:px-4 md:px-6 lg:px-8" aria-label="Action button">Save Changes</button>
        </footer>
      </motion.div>
    </Modal>
  );
};

const EditProfileModalWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <EditProfileModal {...props} />
  </ErrorBoundary>
);

export default React.memo(EditProfileModalWithErrorBoundary);
