

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import type { Team } from '../../types';
import { Modal } from '../ui/Modal';
import { useAppState } from '../../contexts/AppContext';
import { generateTeamSlogan } from '../../services/geminiService';
import TeamBrandingCard from '../team/TeamBrandingCard';
import useCopyToClipboard from '../../hooks/useCopyToClipboard';
import { ClipboardIcon } from '../icons/ClipboardIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { Share2Icon } from '../icons/Share2Icon';
import LoadingSpinner from '../ui/LoadingSpinner';

interface ShareTeamCardModalProps {
    team: Team;
    onClose: () => void;

}

const ShareTeamCardModal: React.FC<ShareTeamCardModalProps> = ({ team, onClose }) => {
    const { state, dispatch } = useAppState();
    const [slogan, setSlogan] = React.useState<string | null>(team.motto || state.teamSlogans[team.id] || null);
    const [isLoadingSlogan, setIsLoadingSlogan] = React.useState(!slogan);
    const [isCopied, setIsCopied] = React.useState(false);
    const cardRef = React.useRef<HTMLDivElement>(null);
    const { copy } = useCopyToClipboard();

    React.useEffect(() => {
        if (!slogan) {
            setIsLoadingSlogan(true);
            generateTeamSlogan(team).then(generatedSlogan => {
                if (generatedSlogan) {
                    setSlogan(generatedSlogan);
                    dispatch({ type: 'SET_TEAM_SLOGAN', payload: { teamId: team.id, slogan: generatedSlogan } });
                }
                setIsLoadingSlogan(false);
            });
        }
    }, [slogan, team, dispatch]);

    const handleCopy = () => {
        const textToCopy = `${team.name} - ${slogan}\nRecord: ${team.record.wins}-${team.record.losses}-${team.record.ties}`;
        copy(textToCopy);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            <motion.div
                className="glass-pane rounded-xl shadow-2xl w-full max-w-md sm:px-4 md:px-6 lg:px-8"
                onClick={e => e.stopPropagation()}
                animate={{ opacity: 1, scale: 1 }}
            >
                <header className="p-4 border-b border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                    <h2 className="text-xl font-bold font-display flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                        <Share2Icon /> Share Team Card
                    </h2>
                </header>
                <main className="p-4 flex flex-col items-center justify-center sm:px-4 md:px-6 lg:px-8">
                    {isLoadingSlogan ? (
                        <div className="w-full max-w-sm aspect-[2/1] flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
                            <LoadingSpinner text="Generating slogan..." />
                        </div>
                    ) : (
                        <div ref={cardRef}>
                            <TeamBrandingCard team={team} slogan={slogan || 'Your Epic Slogan Here'} />
                        </div>
                    )}
                </main>
                <footer className="p-4 flex justify-center gap-4 border-t border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                    <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                        {isCopied ? <CheckIcon /> : <ClipboardIcon />} {isCopied ? 'Copied!' : 'Copy Info'}
                    </button>
                </footer>
            </motion.div>
        </Modal>
    );
};

const ShareTeamCardModalWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <ShareTeamCardModal {...props} />
  </ErrorBoundary>
);

export default React.memo(ShareTeamCardModalWithErrorBoundary);
