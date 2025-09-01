import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { useAppState } from &apos;../contexts/AppContext&apos;;
import { ChevronLeftIcon } from &apos;../components/icons/ChevronLeftIcon&apos;;
import { Widget } from &apos;../components/ui/Widget&apos;;
import LeagueSettingsEditor from &apos;../components/commissioner/LeagueSettingsEditor&apos;;
import EnhancedMemberManagement from &apos;../components/commissioner/EnhancedMemberManagement&apos;;
import SeasonManagement from &apos;../components/commissioner/SeasonManagement&apos;;
import type { League } from &apos;../types&apos;;
import { useLeague } from &apos;../hooks/useLeague&apos;;
import { ShieldAlertIcon } from &apos;../components/icons/ShieldAlertIcon&apos;;
import { PencilIcon } from &apos;../components/icons/PencilIcon&apos;;
import { PauseIcon } from &apos;../components/icons/PauseIcon&apos;;
import { ClipboardListIcon } from &apos;../components/icons/ClipboardListIcon&apos;;
import { MegaphoneIcon } from &apos;../components/icons/MegaphoneIcon&apos;;
import CreatePollModal from &apos;../components/commissioner/CreatePollModal&apos;;
import PostAnnouncementModal from &apos;../components/commissioner/PostAnnouncementModal&apos;;
import { ArrowRightLeftIcon } from &apos;../components/icons/ArrowRightLeftIcon&apos;;
import ManageTradesModal from &apos;../components/commissioner/ManageTradesModal&apos;;
import { UserPlusIcon } from &apos;../components/icons/UserPlusIcon&apos;;
import InviteMemberModal from &apos;../components/commissioner/InviteMemberModal&apos;;
import MemberManagementWidget from &apos;../components/commissioner/MemberManagementWidget&apos;;
import { SettingsIcon } from &apos;../components/icons/SettingsIcon&apos;;
import { CalendarIcon } from &apos;../components/icons/CalendarIcon&apos;;
import { FileTextIcon } from &apos;../components/icons/FileTextIcon&apos;;

const CommissionerToolsContent: React.FC<{ league: League; dispatch: React.Dispatch<any> }> = ({ league, dispatch }: any) => {
}
    const { state } = useAppState();
    const [isPollModalOpen, setIsPollModalOpen] = React.useState(false);
    const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = React.useState(false);
    const [isManageTradesModalOpen, setIsManageTradesModalOpen] = React.useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState<&apos;tools&apos; | &apos;members&apos; | &apos;season&apos;>(&apos;tools&apos;);
    
    const isDrafting = league?.status === &apos;DRAFTING&apos;;
    const isPostDraft = league && league.status !== &apos;PRE_DRAFT&apos; && league.status !== &apos;DRAFTING&apos;;

    const handleAdvanceWeek = () => {
}
        if(window.confirm(`Are you sure you want to advance to Week ${league.currentWeek + 1}? This cannot be undone.`)) {
}
            dispatch({ type: &apos;ADVANCE_WEEK&apos;, payload: { leagueId: league.id } });
            dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: { message: `Manually advancing to Week ${league.currentWeek + 1}...`, type: &apos;SYSTEM&apos; } });

    };

    const tabs = [
        { id: &apos;tools&apos;, label: &apos;Commissioner Tools&apos;, icon: &apos;🔧&apos; },
        { id: &apos;members&apos;, label: &apos;Member Management&apos;, icon: &apos;👥&apos; },
        { id: &apos;season&apos;, label: &apos;Season Management&apos;, icon: &apos;📅&apos; }
    ];

    const renderTabContent = () => {
}
        switch (activeTab) {
}
            case &apos;members&apos;:
                return <EnhancedMemberManagement league={league} dispatch={dispatch} />;
            case &apos;season&apos;:
                return <SeasonManagement league={league} dispatch={dispatch} />;
            default:
                return renderToolsTab();

    };

    const renderToolsTab = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4 sm:space-y-6">
                <Widget title="Communication">
                    <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                        <button onClick={() => setIsPollModalOpen(true)}
                            <h3 className="font-semibold text-white flex items-center gap-2 text-sm sm:text-base"><ClipboardListIcon /> Create Poll</h3>
                            <p className="text-xs text-gray-400 mt-1">Poll league members on important decisions.</p>
                        </button>
                        <button onClick={() => setIsAnnouncementModalOpen(true)}
                            <h3 className="font-semibold text-white flex items-center gap-2 text-sm sm:text-base"><MegaphoneIcon /> Post Announcement</h3>
                            <p className="text-xs text-gray-400 mt-1">Send league-wide announcements.</p>
                        </button>
                    </div>
                </Widget>
                <Widget title="League Settings">
                    <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                        <button 
                            onClick={() => setIsSettingsModalOpen(true)}
                        >
                            <h3 className="font-semibold text-white flex items-center gap-2 text-sm sm:text-base">
                                <SettingsIcon className="w-4 h-4" /> League Settings
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">Configure league rules and settings.</p>
                        </button>
                        <button onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;EDIT_SCORING&apos; }) className="w-full p-3 bg-white/5 rounded-lg text-left hover:bg-white/10 mobile-touch-target">
                            <h3 className="font-semibold text-white flex items-center gap-2 text-sm sm:text-base"><PencilIcon /> Edit Scoring Rules</h3>
                            <p className="text-xs text-gray-400 mt-1">Customize your league&apos;s scoring system.</p>
                        </button>
                        <button onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;SCHEDULE_MANAGEMENT&apos; }) disabled={!isPostDraft} className="w-full p-3 bg-white/5 rounded-lg text-left hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed mobile-touch-target">
                            <h3 className="font-semibold text-white flex items-center gap-2 text-sm sm:text-base"><CalendarIcon /> Edit Schedule</h3>
                            <p className="text-xs text-gray-400 mt-1">View and manually adjust weekly matchups.</p>
                        </button>
                         <button onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;LEAGUE_CONSTITUTION&apos; }) className="w-full p-3 bg-white/5 rounded-lg text-left hover:bg-white/10 mobile-touch-target">
                            <h3 className="font-semibold text-white flex items-center gap-2 text-sm sm:text-base"><FileTextIcon /> Generate Constitution</h3>
                            <p className="text-xs text-gray-400 mt-1">Create a formal league constitution document.</p>
                        </button>
                    </div>
                </Widget>
                <MemberManagementWidget league={league} dispatch={dispatch} />
            </div>
            <div className="space-y-4 sm:space-y-6">
                 <Widget title="In-Season Management">
                     <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                         <button onClick={() => setIsManageTradesModalOpen(true)} className="w-full p-3 bg-white/5 rounded-lg text-left hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed mobile-touch-target">
                            <h3 className="font-semibold text-white flex items-center gap-2 text-sm sm:text-base"><ArrowRightLeftIcon /> Manage Trades</h3>
                            <p className="text-xs text-gray-400 mt-1">Review, force, or veto pending trades in the league.</p>
                        </button>
                         <button onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;EDIT_ROSTER&apos; }) disabled={!isPostDraft} className="w-full p-3 bg-white/5 rounded-lg text-left hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed mobile-touch-target">
                            <h3 className="font-semibold text-white flex items-center gap-2 text-sm sm:text-base"><PencilIcon /> Edit Rosters</h3>
                            <p className="text-xs text-gray-400 mt-1">Manually add or remove players from any team&apos;s roster.</p>
                        </button>
                         <button onClick={() => dispatch({ type: &apos;PAUSE_DRAFT&apos;, payload: !state.isDraftPaused })} disabled={!isDrafting} className="w-full p-3 bg-white/5 rounded-lg text-left hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed mobile-touch-target">
                            <h3 className="font-semibold text-white flex items-center gap-2 text-sm sm:text-base"><PauseIcon /> {state.isDraftPaused ? &apos;Resume Draft&apos; : &apos;Pause Draft&apos;}</h3>
                            <p className="text-xs text-gray-400 mt-1">Temporarily pause or unpause a live draft.</p>
                        </button>
                        <button onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;FINANCE_TRACKER&apos; }) className="w-full p-3 bg-white/5 rounded-lg text-left hover:bg-white/10 mobile-touch-target">
                            <h3 className="font-semibold text-white flex items-center gap-2 text-sm sm:text-base"><PencilIcon /> Financials</h3>
                            <p className="text-xs text-gray-400 mt-1">Track league dues and payouts.</p>
                        </button>
                     </div>
                </Widget>
                <Widget title="Membership">
                    <div className="p-3 sm:p-4">
                         <button onClick={() => setIsInviteModalOpen(true)}
                            <h3 className="font-semibold text-white flex items-center gap-2 text-sm sm:text-base"><UserPlusIcon /> Invite Members</h3>
                            <p className="text-xs text-gray-400 mt-1">Add new managers to your league.</p>
                        </button>
                    </div>
                </Widget>
                 <Widget title="Danger Zone">
                    <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                         <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                            <h3 className="font-semibold text-red-300 text-sm sm:text-base">Advance Week</h3>
                            <p className="text-xs text-gray-400 mt-1 mb-2">Manually process the results of the current week and advance the league to the next week. Use with caution.</p>
                            <button onClick={handleAdvanceWeek}
                                Force Advance to Week {league.currentWeek + 1}
                            </button>
                        </div>
                         <div className="p-3 bg-gray-800/50 border border-gray-600/50 rounded-lg">
                            <h3 className="font-semibold text-white flex items-center gap-2"><ShieldAlertIcon /> Project Integrity</h3>
                            <p className="text-xs text-gray-400 mt-1 mb-2">Run a diagnostic scan on the application codebase to check for potential issues.</p>
                            <button
                                onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;PROJECT_INTEGRITY&apos; })
                                className="px-4 py-2 bg-gray-600/80 text-white font-bold text-sm rounded-lg hover:bg-gray-500"
                            >
                                Run Integrity Scan
                            </button>
                        </div>
                    </div>
                </Widget>
            </div>
        </div>
    );

    return (
        <div className="w-full h-full flex flex-col p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto">
            <header className="flex-shrink-0 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;DASHBOARD&apos; })
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        aria-label="Back to Dashboard"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">Commissioner Tools</h1>
                        <p className="text-sm text-[var(--text-secondary)]">Manage {league.name}</p>
                    </div>
                </div>
            </header>

            {/* Tab Navigation */}
            <div className="flex border-b border-[var(--panel-border)] mb-6">
                {tabs.map((tab: any) => (
}
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as &apos;tools&apos; | &apos;members&apos; | &apos;season&apos;)}`}
                    >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <main className="flex-1 overflow-y-auto">
                {renderTabContent()}
            </main>

            {/* Modals */}
            <AnimatePresence>
                {isPollModalOpen && (
}
                    <CreatePollModal leagueId={league.id} onClose={() => setIsPollModalOpen(false)} />
                )}
                {isAnnouncementModalOpen && (
}
                    <PostAnnouncementModal leagueId={league.id} onClose={() => setIsAnnouncementModalOpen(false)} />
                )}
                {isManageTradesModalOpen && (
}
                    <ManageTradesModal league={league} onClose={() => setIsManageTradesModalOpen(false)} />
                )}
                {isInviteModalOpen && (
}
                    <InviteMemberModal league={league} onClose={() => setIsInviteModalOpen(false)} />
                )}
                {isSettingsModalOpen && (
}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75"
                        onClick={(e: any) => e.target === e.currentTarget && setIsSettingsModalOpen(false)}
                        <LeagueSettingsEditor>
                            league={league} 
                            onClose={() => setIsSettingsModalOpen(false)}
                            onSave={(settings: any) => {
}
                                dispatch({ type: &apos;UPDATE_LEAGUE_SETTINGS&apos;, payload: { leagueId: league.id, settings } });
                                setIsSettingsModalOpen(false);
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const CommissionerToolsView: React.FC = () => {
}
    const { state, dispatch } = useAppState();
    const { league } = useLeague();
    
    if (!league || state.user?.id !== league.commissionerId) {
}
        return (
            <div className="p-8 text-center w-full h-full flex flex-col items-center justify-center">
                <p className="text-red-400">Access Denied. You are not the commissioner of this league.</p>
                <button onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;DASHBOARD&apos; }) className="btn btn-primary mt-4">
                    Back to Dashboard
                </button>
            </div>
        );

    return <CommissionerToolsContent league={league} dispatch={dispatch} />;
};

export default CommissionerToolsView;