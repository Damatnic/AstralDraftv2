

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback } from &apos;react&apos;;
import { motion } from &apos;framer-motion&apos;;
import type { Team } from &apos;../../types&apos;;
import { Modal } from &apos;../ui/Modal&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;
import { generateTeamSlogan } from &apos;../../services/geminiService&apos;;
import TeamBrandingCard from &apos;../team/TeamBrandingCard&apos;;
import useCopyToClipboard from &apos;../../hooks/useCopyToClipboard&apos;;
import { ClipboardIcon } from &apos;../icons/ClipboardIcon&apos;;
import { CheckIcon } from &apos;../icons/CheckIcon&apos;;
import { Share2Icon } from &apos;../icons/Share2Icon&apos;;
import LoadingSpinner from &apos;../ui/LoadingSpinner&apos;;

interface ShareTeamCardModalProps {
}
    team: Team;
    onClose: () => void;

}

const ShareTeamCardModal: React.FC<ShareTeamCardModalProps> = ({ team, onClose }: any) => {
}
    const { state, dispatch } = useAppState();
    const [slogan, setSlogan] = React.useState<string | null>(team.motto || state.teamSlogans[team.id] || null);
    const [isLoadingSlogan, setIsLoadingSlogan] = React.useState(!slogan);
    const [isCopied, setIsCopied] = React.useState(false);
    const cardRef = React.useRef<HTMLDivElement>(null);
    const { copy } = useCopyToClipboard();

    React.useEffect(() => {
}
        if (!slogan) {
}
            setIsLoadingSlogan(true);
            generateTeamSlogan(team).then(generatedSlogan => {
}
                if (generatedSlogan) {
}
                    setSlogan(generatedSlogan);
                    dispatch({ type: &apos;SET_TEAM_SLOGAN&apos;, payload: { teamId: team.id, slogan: generatedSlogan } });
                }
                setIsLoadingSlogan(false);
            });
        }
    }, [slogan, team, dispatch]);

    const handleCopy = () => {
}
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
}
                        <div className="w-full max-w-sm aspect-[2/1] flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
                            <LoadingSpinner text="Generating slogan..." />
                        </div>
                    ) : (
                        <div ref={cardRef}>
                            <TeamBrandingCard team={team} slogan={slogan || &apos;Your Epic Slogan Here&apos;} />
                        </div>
                    )}
                </main>
                <footer className="p-4 flex justify-center gap-4 border-t border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                    <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                        {isCopied ? <CheckIcon /> : <ClipboardIcon />} {isCopied ? &apos;Copied!&apos; : &apos;Copy Info&apos;}
                    </button>
                </footer>
            </motion.div>
        </Modal>
    );
};

const ShareTeamCardModalWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <ShareTeamCardModal {...props} />
  </ErrorBoundary>
);

export default React.memo(ShareTeamCardModalWithErrorBoundary);
