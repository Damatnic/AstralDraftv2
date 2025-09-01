
import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo } from &apos;react&apos;;
import type { LeagueSettings, User, CreateLeaguePayload, AiProfileData } from &apos;../../types&apos;;
import { Modal } from &apos;../ui/Modal&apos;;
import { motion } from &apos;framer-motion&apos;;
import { generateTeamBranding, generateAiTeamProfile } from &apos;../../services/geminiService&apos;;
import { SparklesIcon } from &apos;../icons/SparklesIcon&apos;;
import { Avatar } from &apos;../ui/Avatar&apos;;

interface CreateLeagueModalProps {
}
    onClose: () => void;
    user: User;
    dispatch: React.Dispatch<any>;

}

const CreateLeagueModal: React.FC<CreateLeagueModalProps> = ({ onClose, user, dispatch }: any) => {
}
    const [name, setName] = React.useState(&apos;My Awesome League&apos;);
    const [userTeamName, setUserTeamName] = React.useState(`${user.name}&apos;s Dynasty`);
    const [userTeamAvatar, setUserTeamAvatar] = React.useState(user.avatar);
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const [draftFormat, setDraftFormat] = React.useState<LeagueSettings[&apos;draftFormat&apos;]>(&apos;SNAKE&apos;);
    const [teamCount, setTeamCount] = React.useState<LeagueSettings[&apos;teamCount&apos;]>(12);
    const [scoring, setScoring] = React.useState<LeagueSettings[&apos;scoring&apos;]>(&apos;PPR&apos;);
    const [tradeDeadline, setTradeDeadline] = React.useState<LeagueSettings[&apos;tradeDeadline&apos;]>(10);
    const [playoffFormat, setPlayoffFormat] = React.useState<LeagueSettings[&apos;playoffFormat&apos;]>(&apos;4_TEAM&apos;);
    const [waiverRule, setWaiverRule] = React.useState<LeagueSettings[&apos;waiverRule&apos;]>(&apos;FAAB&apos;);
    const [aiAssistanceLevel, setAiAssistanceLevel] = React.useState<LeagueSettings[&apos;aiAssistanceLevel&apos;]>(&apos;FULL&apos;);

    const handleGenerateBranding = async () => {
}
    try {
}
        setIsGenerating(true);
        const branding = await generateTeamBranding(user.name);
        if (branding) {
}
            setUserTeamName(branding.teamName);
            setUserTeamAvatar(branding.avatar);
        
    `Generating AI managers... this may take a moment.`, type: &apos;SYSTEM&apos; 
    }});

        try {
}
            const aiProfilePromises = Array.from({ length: teamCount - 1 }).map(() => generateAiTeamProfile(name));
            const aiProfiles = (await Promise.all(aiProfilePromises)).filter(Boolean) as AiProfileData[];
            
            if (aiProfiles.length !== teamCount - 1) {
}
                throw new Error("Failed to generate all AI manager profiles.");

            const newLeague: CreateLeaguePayload = {
}
                id: `league_${Date.now()}`,
                name,
                settings: {
}
                    draftFormat,
                    teamCount,
                    scoring,
                    rosterSize: 16, // Hardcode for now
                    tradeDeadline,
                    playoffFormat,
                    waiverRule,
                    aiAssistanceLevel,
                },
                status: &apos;PRE_DRAFT&apos; as const,
                commissionerId: user.id,
                userTeamName,
                userTeamAvatar,
                aiProfiles,
            };
            dispatch({ type: &apos;CREATE_LEAGUE&apos;, payload: newLeague });
            dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: { message: `League "${name}" created!`, type: &apos;SYSTEM&apos; }});
            onClose();

        });
        } finally {
}
            setIsSubmitting(false);

    };

    const inputClasses = "mobile-touch-target w-full bg-black/10 dark:bg-gray-900/50 border border-[var(--panel-border)] rounded-md px-3 py-3 text-sm placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-cyan-400";
    const labelClasses = "block text-sm font-medium text-[var(--text-secondary)] mb-1";
    const buttonGroupButtonClasses = (isActive: boolean) => `flex-1 py-2 text-sm font-bold rounded-md transition-all ${isActive ? &apos;bg-cyan-400 text-black&apos; : &apos;bg-black/10 dark:bg-gray-700/50 hover:bg-black/20 dark:hover:bg-gray-600/50&apos;}`;

    return (
        <Modal isOpen={true} onClose={onClose}>
            <motion.div 
                className="glass-pane rounded-xl shadow-2xl w-full max-w-2xl sm:px-4 md:px-6 lg:px-8"
                role="dialog"
                aria-modal="true"
                aria-labelledby="create-league-title"
                onClick={(e: any) => e.stopPropagation()},
                    animate: { opacity: 1, y: 0, scale: 1 },
                    exit: { opacity: 0, y: 20, scale: 0.95 },
                }}
            >
                <header className="p-6 border-b border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                    <h2 id="create-league-title" className="text-2xl font-bold font-display text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                        Create New League
                    </h2>
                </header>

                <form onSubmit={handleSubmit}
                    <main className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                            <div>
                                <label htmlFor="league-name" className={labelClasses}>League Name</label>
                                <input id="league-name" type="text" value={name} onChange={e => setName(e.target.value)} required autocomplete="off" />
                            </div>
                            
                            <div className="p-3 bg-black/10 rounded-lg space-y-2 border border-cyan-400/20 sm:px-4 md:px-6 lg:px-8">
                                <label className={labelClasses}>Your Team Branding</label>
                                <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                                    <Avatar avatar={userTeamAvatar} className="w-16 h-16 text-4xl rounded-lg flex-shrink-0 sm:px-4 md:px-6 lg:px-8" />
                                    <div className="flex-grow space-y-2 sm:px-4 md:px-6 lg:px-8">
                                        <input id="team-name" type="text" value={userTeamName} onChange={e => setUserTeamName(e.target.value)} required autocomplete="off" />
                                        <p className="text-xs text-gray-500 px-1 sm:px-4 md:px-6 lg:px-8">Enter a team name above, or generate one with AI.</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleGenerateBranding}
                                    disabled={isGenerating}
                                    className="w-full mt-1 flex items-center justify-center gap-2 px-4 py-1.5 bg-transparent border border-cyan-400/50 text-cyan-300 font-bold text-xs rounded-md hover:bg-cyan-400/20 disabled:opacity-50 sm:px-4 md:px-6 lg:px-8"
                                >
                                    {isGenerating ? (
}
                                        <>
                                            <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin sm:px-4 md:px-6 lg:px-8"></div>
                                            <span>Generating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <SparklesIcon />
                                            <span>Generate Logo & Name</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                            <div className="grid grid-cols-2 gap-4 sm:px-4 md:px-6 lg:px-8">
                                <div>
                                    <label className={labelClasses}>AI Assistance</label>
                                    <div className="flex gap-2 sm:px-4 md:px-6 lg:px-8">
                                        <button type="button" onClick={(e: any) => { e.preventDefault(); setAiAssistanceLevel(&apos;FULL&apos;); }} className={buttonGroupButtonClasses(aiAssistanceLevel === &apos;FULL&apos;)}>Full</button>
                                        <button type="button" onClick={(e: any) => { e.preventDefault(); setAiAssistanceLevel(&apos;BASIC&apos;); }} className={buttonGroupButtonClasses(aiAssistanceLevel === &apos;BASIC&apos;)}>Basic</button>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClasses}>Draft Format</label>
                                    <div className="flex gap-2 sm:px-4 md:px-6 lg:px-8">
                                        <button type="button" onClick={(e: any) => { e.preventDefault(); setDraftFormat(&apos;SNAKE&apos;); }} className={buttonGroupButtonClasses(draftFormat === &apos;SNAKE&apos;)}>SNAKE</button>
                                        <button type="button" onClick={(e: any) => { e.preventDefault(); setDraftFormat(&apos;AUCTION&apos;); }} className={buttonGroupButtonClasses(draftFormat === &apos;AUCTION&apos;)}>AUCTION</button>
                                    </div>
                                </div>
                            </div>
                            <div>
                               <label className={labelClasses}>Scoring</label>
                                <div className="flex gap-2 sm:px-4 md:px-6 lg:px-8">
                                    <button type="button" onClick={(e: any) => { e.preventDefault(); setScoring(&apos;PPR&apos;); }} className={`flex-1 px-1 py-2 text-xs font-bold rounded-md transition-all ${scoring === &apos;PPR&apos; ? &apos;bg-cyan-400 text-black&apos; : &apos;bg-black/10 dark:bg-gray-700/50 hover:bg-black/20 dark:hover:bg-gray-600/50&apos;}`}>PPR</button>
                                    <button type="button" onClick={(e: any) => { e.preventDefault(); setScoring(&apos;Half-PPR&apos;); }} className={`flex-1 px-1 py-2 text-xs font-bold rounded-md transition-all ${scoring === &apos;Half-PPR&apos; ? &apos;bg-cyan-400 text-black&apos; : &apos;bg-black/10 dark:bg-gray-700/50 hover:bg-black/20 dark:hover:bg-gray-600/50&apos;}`}>Half-PPR</button>
                                    <button type="button" onClick={(e: any) => { e.preventDefault(); setScoring(&apos;Standard&apos;); }} className={`flex-1 px-1 py-2 text-xs font-bold rounded-md transition-all ${scoring === &apos;Standard&apos; ? &apos;bg-cyan-400 text-black&apos; : &apos;bg-black/10 dark:bg-gray-700/50 hover:bg-black/20 dark:hover:bg-gray-600/50&apos;}`}>Standard</button>
                                </div>
                            </div>

                             <div>
                                <label className={labelClasses}>Playoff Format</label>
                                <div className="flex gap-2 sm:px-4 md:px-6 lg:px-8">
                                    <button type="button" onClick={(e: any) => { e.preventDefault(); setPlayoffFormat(&apos;4_TEAM&apos;); }} className={buttonGroupButtonClasses(playoffFormat === &apos;4_TEAM&apos;)}>4 Teams</button>
                                    <button type="button" onClick={(e: any) => { e.preventDefault(); setPlayoffFormat(&apos;6_TEAM&apos;); }} className={buttonGroupButtonClasses(playoffFormat === &apos;6_TEAM&apos;)}>6 Teams</button>
                                </div>
                            </div>

                             <div>
                                <label htmlFor="team-count" className={labelClasses}>Number of Teams: <span className="font-bold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{teamCount}</span></label>
                                <input id="team-count" type="range" min="8" max="14" step="2" value={teamCount} onChange={e => setTeamCount(Number(e.target.value))}
                            </div>
                        </div>

                    </main>

                    <footer className="p-6 flex justify-end gap-4 border-t border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                        <button type="button" onClick={(e: any) => { e.preventDefault(); onClose(); }} className="mobile-touch-target px-4 py-3 bg-transparent border border-[var(--panel-border)] text-[var(--text-secondary)] font-bold rounded-lg hover:bg-white/10 transition-colors sm:px-4 md:px-6 lg:px-8">
//                             Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mobile-touch-target px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-white font-bold rounded-lg shadow-md hover:from-green-600 hover:to-cyan-600 transition-colors disabled:opacity-60 disabled:cursor-wait sm:px-4 md:px-6 lg:px-8"
                        >
                            {isSubmitting ? &apos;Creating...&apos; : &apos;Create League&apos;}
                        </button>
                    </footer>
                </form>
            </motion.div>
        </Modal>
    );
};

const CreateLeagueModalWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <CreateLeagueModal {...props} />
  </ErrorBoundary>
);

export default React.memo(CreateLeagueModalWithErrorBoundary);
