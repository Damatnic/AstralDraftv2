/**
 * Enhanced Member Management Widget
 * Comprehensive member administration with advanced controls
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { UsersIcon } from &apos;../icons/UsersIcon&apos;;
import { UserPlusIcon } from &apos;../icons/UserPlusIcon&apos;;
import { UserRemoveIcon } from &apos;../icons/UserRemoveIcon&apos;;
import { CrownIcon } from &apos;../icons/CrownIcon&apos;;
import { ShieldCheckIcon } from &apos;../icons/ShieldCheckIcon&apos;;
import { PencilIcon } from &apos;../icons/PencilIcon&apos;;
import { XIcon } from &apos;../icons/XIcon&apos;;
import { CheckIcon } from &apos;../icons/CheckIcon&apos;;
import { League, User } from &apos;../../types&apos;;

interface EnhancedMemberManagementProps {
}
    league: League;
    dispatch: React.Dispatch<any>;

}

interface MemberAction {
}
    type: &apos;PROMOTE_TO_COMMISSIONER&apos; | &apos;REMOVE_MEMBER&apos; | &apos;EDIT_TEAM_NAME&apos; | &apos;CHANGE_AVATAR&apos; | &apos;TOGGLE_ADMIN&apos;;
    memberId: string;
    data?: any;}

const EnhancedMemberManagement: React.FC<EnhancedMemberManagementProps> = ({ league, dispatch }: any) => {
}
    const [selectedMember, setSelectedMember] = React.useState<string | null>(null);
    const [editMode, setEditMode] = React.useState<{ memberId: string; field: string } | null>(null);
    const [editValue, setEditValue] = React.useState(&apos;&apos;);
    const [showConfirmAction, setShowConfirmAction] = React.useState<MemberAction | null>(null);

    // Mock members data - in real app this would come from league.members
    const members = [
        { id: &apos;1&apos;, name: &apos;Alice Johnson&apos;, teamName: "Alice&apos;s Aces", isCommissioner: true, isCoCommissioner: false, avatar: &apos;👩‍💼&apos;, joinDate: &apos;2024-08-01&apos;, record: &apos;8-4&apos;, points: 1245.6, activity: &apos;Active&apos; },
        { id: &apos;2&apos;, name: &apos;Bob Smith&apos;, teamName: &apos;Smithtown Stallions&apos;, isCommissioner: false, isCoCommissioner: true, avatar: &apos;🤠&apos;, joinDate: &apos;2024-08-01&apos;, record: &apos;7-5&apos;, points: 1198.2, activity: &apos;Active&apos; },
        { id: &apos;3&apos;, name: &apos;Carol Davis&apos;, teamName: &apos;Thunder Bolts&apos;, isCommissioner: false, isCoCommissioner: false, avatar: &apos;⚡&apos;, joinDate: &apos;2024-08-02&apos;, record: &apos;6-6&apos;, points: 1087.3, activity: &apos;Inactive (3 days)&apos; },
        { id: &apos;4&apos;, name: &apos;David Wilson&apos;, teamName: &apos;Wilson Warriors&apos;, isCommissioner: false, isCoCommissioner: false, avatar: &apos;⚔️&apos;, joinDate: &apos;2024-08-01&apos;, record: &apos;9-3&apos;, points: 1312.7, activity: &apos;Active&apos; }
    ];

    const handleMemberAction = (action: MemberAction) => {
}
        setShowConfirmAction(action);
    };

    const confirmAction = () => {
}
        if (!showConfirmAction) return;

        switch (showConfirmAction.type) {
}
            case &apos;REMOVE_MEMBER&apos;:
                dispatch({ 
}
                    type: &apos;REMOVE_LEAGUE_MEMBER&apos;, 
                    payload: { leagueId: league.id, memberId: showConfirmAction.memberId } 
                });
                dispatch({ 
}
                    type: &apos;ADD_NOTIFICATION&apos;, 
                    payload: { message: &apos;Member removed from league&apos;, type: &apos;SYSTEM&apos; } 
                });
                break;
            case &apos;PROMOTE_TO_COMMISSIONER&apos;:
                dispatch({ 
}
                    type: &apos;TRANSFER_COMMISSIONER&apos;, 
                    payload: { leagueId: league.id, newCommissionerId: showConfirmAction.memberId } 
                });
                dispatch({ 
}
                    type: &apos;ADD_NOTIFICATION&apos;, 
                    payload: { message: &apos;Commissioner role transferred&apos;, type: &apos;SYSTEM&apos; } 
                });
                break;
            case &apos;TOGGLE_ADMIN&apos;:
                dispatch({ 
}
                    type: &apos;TOGGLE_CO_COMMISSIONER&apos;, 
                    payload: { leagueId: league.id, memberId: showConfirmAction.memberId } 
                });
                break;

        setShowConfirmAction(null);
    };

    const startEdit = (memberId: string, field: string, currentValue: string) => {
}
        setEditMode({ memberId, field });
        setEditValue(currentValue);
    };

    const saveEdit = () => {
}
        if (!editMode) return;
        
        dispatch({ 
}
            type: &apos;UPDATE_MEMBER_INFO&apos;, 
            payload: {
}
                leagueId: league.id, 
                memberId: editMode.memberId, 
                field: editMode.field,
                value: editValue 

        });
        setEditMode(null);
        setEditValue(&apos;&apos;);
    };

    const cancelEdit = () => {
}
        setEditMode(null);
        setEditValue(&apos;&apos;);
    };

    return (
        <Widget title="Enhanced Member Management" icon={<UsersIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />}>
            <div className="p-4 space-y-4 sm:px-4 md:px-6 lg:px-8">
                {/* Member Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-500/20 p-3 rounded-lg text-center sm:px-4 md:px-6 lg:px-8">
                        <div className="text-2xl font-bold text-blue-400 sm:px-4 md:px-6 lg:px-8">{members.length}</div>
                        <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Total Members</div>
                    </div>
                    <div className="bg-green-500/20 p-3 rounded-lg text-center sm:px-4 md:px-6 lg:px-8">
                        <div className="text-2xl font-bold text-green-400 sm:px-4 md:px-6 lg:px-8">{members.filter((m: any) => m.activity === &apos;Active&apos;).length}</div>
                        <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Active</div>
                    </div>
                    <div className="bg-yellow-500/20 p-3 rounded-lg text-center sm:px-4 md:px-6 lg:px-8">
                        <div className="text-2xl font-bold text-yellow-400 sm:px-4 md:px-6 lg:px-8">{members.filter((m: any) => m.activity.includes(&apos;Inactive&apos;)).length}</div>
                        <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Inactive</div>
                    </div>
                    <div className="bg-purple-500/20 p-3 rounded-lg text-center sm:px-4 md:px-6 lg:px-8">
                        <div className="text-2xl font-bold text-purple-400 sm:px-4 md:px-6 lg:px-8">{members.filter((m: any) => m.isCommissioner || m.isCoCommissioner).length}</div>
                        <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Admins</div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 mb-4 sm:px-4 md:px-6 lg:px-8">
                    <button 
                        onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;INVITE_MEMBERS&apos; }}
                        className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm sm:px-4 md:px-6 lg:px-8"
                    >
                        <UserPlusIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                        Invite Members
                    </button>
                    <button 
                        onClick={() => dispatch({ type: &apos;EXPORT_MEMBER_LIST&apos;, payload: league.id }}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm sm:px-4 md:px-6 lg:px-8"
                    >
                        📋 Export List
                    </button>
                    <button 
                        onClick={() => dispatch({ type: &apos;BULK_MESSAGE_MEMBERS&apos;, payload: league.id }}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm sm:px-4 md:px-6 lg:px-8"
                    >
                        📢 Send Message
                    </button>
                </div>

                {/* Members List */}
                <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                    {members.map((member: any) => (
}
                        <motion.div
                            key={member.id}
//                             layout
                            className={`p-4 border rounded-lg transition-all ${
}
                                selectedMember === member.id 
                                    ? &apos;border-blue-500 bg-blue-500/10&apos; 
                                    : &apos;border-[var(--panel-border)] hover:border-gray-500&apos;
                            }`}
                        >
                            <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                                <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                                    <div className="text-2xl sm:px-4 md:px-6 lg:px-8">{member.avatar}</div>
                                    <div>
                                        <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                            <h4 className="font-semibold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                                {member.name}
                                            </h4>
                                            {member.isCommissioner && (
}
                                                <span title="Commissioner">
                                                    <CrownIcon className="w-4 h-4 text-yellow-500 sm:px-4 md:px-6 lg:px-8" />
                                                </span>
                                            )}
                                            {member.isCoCommissioner && (
}
                                                <span title="Co-Commissioner">
                                                    <ShieldCheckIcon className="w-4 h-4 text-blue-500 sm:px-4 md:px-6 lg:px-8" />
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                            {editMode?.memberId === member.id && editMode?.field === &apos;teamName&apos; ? (
}
                                                <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                                    <input
                                                        type="text"
                                                        value={editValue}
                                                        onChange={(e: any) => setEditValue(e.target.value)}
//                                                         autoFocus
                                                    />
                                                    <button onClick={saveEdit} className="text-green-500 hover:text-green-400 sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                                                        <CheckIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                                    </button>
                                                    <button onClick={cancelEdit} className="text-red-500 hover:text-red-400 sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                                                        <XIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                                    <span className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                                        {member.teamName}
                                                    </span>
                                                    <button 
                                                        onClick={() => startEdit(member.id, &apos;teamName&apos;, member.teamName)}
                                                    >
                                                        <PencilIcon className="w-3 h-3 sm:px-4 md:px-6 lg:px-8" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 sm:px-4 md:px-6 lg:px-8">
                                    {/* Member Stats */}
                                    <div className="text-right text-sm sm:px-4 md:px-6 lg:px-8">
                                        <div className="text-[var(--text-primary)] font-medium sm:px-4 md:px-6 lg:px-8">{member.record}</div>
                                        <div className="text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">{member.points} pts</div>
                                    </div>

                                    {/* Actions Dropdown */}
                                    <div className="relative sm:px-4 md:px-6 lg:px-8">
                                        <button 
                                            onClick={() => setSelectedMember(selectedMember === member.id ? null : member.id)}
                                        >
                                            ⋮
                                        </button>
                                        
                                        <AnimatePresence>
                                            {selectedMember === member.id && (
}
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="absolute right-0 top-full mt-1 bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg shadow-lg z-10 min-w-[200px] sm:px-4 md:px-6 lg:px-8"
                                                >
                                                    <div className="py-1 sm:px-4 md:px-6 lg:px-8">
                                                        {!member.isCommissioner && (
}
                                                            <>
                                                                <button 
                                                                    onClick={() = aria-label="Action button"> handleMemberAction({ 
}
                                                                        type: &apos;TOGGLE_ADMIN&apos;, 
                                                                        memberId: member.id 
                                                                    })}
                                                                    className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8"
                                                                >
                                                                    <ShieldCheckIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                                                    {member.isCoCommissioner ? &apos;Remove Admin&apos; : &apos;Make Admin&apos;}
                                                                </button>
                                                                <button 
                                                                    onClick={() = aria-label="Action button"> handleMemberAction({ 
}
                                                                        type: &apos;PROMOTE_TO_COMMISSIONER&apos;, 
                                                                        memberId: member.id 
                                                                    })}
                                                                    className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8"
                                                                >
                                                                    <CrownIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                                                    Make Commissioner
                                                                </button>
                                                            </>
                                                        )}
                                                        <button 
                                                            onClick={() => dispatch({ type: &apos;VIEW_MEMBER_PROFILE&apos;, payload: member.id }}
                                                            className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 sm:px-4 md:px-6 lg:px-8"
                                                        >
                                                            👤 View Profile
                                                        </button>
                                                        <button 
                                                            onClick={() => dispatch({ type: &apos;MESSAGE_MEMBER&apos;, payload: member.id }}
                                                            className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 sm:px-4 md:px-6 lg:px-8"
                                                        >
                                                            💬 Send Message
                                                        </button>
                                                        <hr className="my-1 border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8" />
                                                        {!member.isCommissioner && (
}
                                                            <button 
                                                                onClick={() = aria-label="Action button"> handleMemberAction({ 
}
                                                                    type: &apos;REMOVE_MEMBER&apos;, 
                                                                    memberId: member.id 
                                                                })}
                                                                className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 text-red-400 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8"
                                                            >
                                                                <UserRemoveIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                                                Remove from League
                                                            </button>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>

                            {/* Activity Status */}
                            <div className="mt-2 flex items-center justify-between text-xs sm:px-4 md:px-6 lg:px-8">
                                <span className="text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                    Joined: {new Date(member.joinDate).toLocaleDateString()}
                                </span>
                                <span className={`px-2 py-1 rounded-full ${
}
                                    member.activity === &apos;Active&apos; 
                                        ? &apos;bg-green-500/20 text-green-400&apos; 
                                        : &apos;bg-yellow-500/20 text-yellow-400&apos;
                                }`}>
                                    {member.activity}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Confirmation Modal */}
                <AnimatePresence>
                    {showConfirmAction && (
}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 sm:px-4 md:px-6 lg:px-8"
                            onClick={(e: any) => e.target === e.currentTarget && setShowConfirmAction(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg shadow-xl p-6 max-w-md w-full sm:px-4 md:px-6 lg:px-8"
                            >
                                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 sm:px-4 md:px-6 lg:px-8">
                                    Confirm Action
                                </h3>
                                <p className="text-[var(--text-secondary)] mb-6 sm:px-4 md:px-6 lg:px-8">
                                    {showConfirmAction.type === &apos;REMOVE_MEMBER&apos; && &apos;Are you sure you want to remove this member from the league?&apos;}
                                    {showConfirmAction.type === &apos;PROMOTE_TO_COMMISSIONER&apos; && &apos;Are you sure you want to transfer commissioner rights to this member?&apos;}
                                    {showConfirmAction.type === &apos;TOGGLE_ADMIN&apos; && &apos;Are you sure you want to change this member\&apos;s admin status?&apos;}
                                </p>
                                <div className="flex gap-3 justify-end sm:px-4 md:px-6 lg:px-8">
                                    <button
                                        onClick={() => setShowConfirmAction(null)}
                                    >
//                                         Cancel
                                    </button>
                                    <button
                                        onClick={confirmAction}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg sm:px-4 md:px-6 lg:px-8"
                                     aria-label="Action button">
//                                         Confirm
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Widget>
    );
};

const EnhancedMemberManagementWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <EnhancedMemberManagement {...props} />
  </ErrorBoundary>
);

export default React.memo(EnhancedMemberManagementWithErrorBoundary);
