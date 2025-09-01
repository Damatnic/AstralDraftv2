/**
 * League Management Interface
 * Comprehensive dashboard for league administration and commissioner controls
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo, useState, useEffect } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { 
}
    SettingsIcon, 
    UsersIcon, 
    ShieldIcon, 
    CalendarIcon,
    BarChart3Icon,
    PlusIcon,
//     CrownIcon
} from &apos;lucide-react&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { useAuth } from &apos;../../contexts/AuthContext&apos;;
import { 
}
    leagueManagementService, 
    type League, 
    type LeagueSettings,
    type LeagueInvitation,
    type CommissionerAction
} from &apos;../../services/leagueManagementService&apos;;

interface Props {
}
    leagueId?: string;
    className?: string;

// Helper function to get status badge styles
}

const getStatusBadgeStyles = (status: string): string => {
}
  const [isLoading, setIsLoading] = React.useState(false);
    switch (status) {
}
        case &apos;active&apos;:
            return &apos;bg-green-500/20 text-green-400&apos;;
        case &apos;draft&apos;:
            return &apos;bg-blue-500/20 text-blue-400&apos;;
        case &apos;completed&apos;:
            return &apos;bg-purple-500/20 text-purple-400&apos;;
        default:
            return &apos;bg-gray-500/20 text-gray-400&apos;;

};

type Tab = &apos;overview&apos; | &apos;members&apos; | &apos;settings&apos; | &apos;history&apos; | &apos;commissioner&apos;;

const LeagueManagementInterface: React.FC<Props> = ({ 
}
    leagueId, 
    className = &apos;&apos; 
}: any) => {
}
    const { user, isAuthenticated } = useAuth();
    const [league, setLeague] = useState<League | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>(&apos;overview&apos;);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userLeagues, setUserLeagues] = useState<League[]>([]);
    const [invitations, setInvitations] = useState<LeagueInvitation[]>([]);
    const [editingSettings, setEditingSettings] = useState(false);
    const [pendingAction, setPendingAction] = useState<CommissionerAction | null>(null);

    // Load league data
    useEffect(() => {
}
        if (!isAuthenticated || !user) return;

        const loadData = async () => {
}
            setLoading(true);
            try {
}

                // Load user&apos;s leagues
                const leagues = await leagueManagementService.getUserLeagues(user.id.toString());
                setUserLeagues(leagues);

                // Load invitations
                const userInvites = await leagueManagementService.getUserInvitations(user.email || &apos;&apos;);
                setInvitations(userInvites);

                // Load specific league if provided
                if (leagueId) {
}
                    const leagueData = await leagueManagementService.getLeague(leagueId);
                    setLeague(leagueData);
                } else if (leagues.length > 0) {
}
                    setLeague(leagues[0]);

    } catch (error) {
}
                setError(&apos;Failed to load league information&apos;);
            } finally {
}
                setLoading(false);

        };

        loadData();
    }, [leagueId, isAuthenticated, user]);

    // Check if user is commissioner
    const isCommissioner = league && user && league.commissionerId === user.id.toString();

    // Handle creating new league
    const handleCreateLeague = () => {
}
        // Show placeholder message - full implementation would show creation modal
    };

    // Handle invitation responses
    const handleAcceptInvitation = async (invitationId: string) => {
}
        if (!user) return;
        
        try {
}

            // For now, use placeholder values - in a real app, these would come from a form
            await leagueManagementService.acceptInvitation(
                invitationId, 
                user.id.toString(), 
                user.username || &apos;Player&apos;, 
                `${user.username || &apos;Player&apos;}&apos;s Team`
            );
            // Refresh invitations
            if (user.email) {
}
                const userInvites = await leagueManagementService.getUserInvitations(user.email);
                setInvitations(userInvites);

    } catch (error) {
}
            setError(&apos;Failed to accept invitation&apos;);

    };

    const handleDeclineInvitation = async (invitationId: string) => {
}
        try {
}

            await leagueManagementService.declineInvitation(invitationId);
            // Refresh invitations
            if (user?.email) {
}
                const userInvites = await leagueManagementService.getUserInvitations(user.email);
                setInvitations(userInvites);

    } catch (error) {
}
            setError(&apos;Failed to decline invitation&apos;);

    };

    // Handle setting updates
    const handleSettingsUpdate = async (updates: Partial<LeagueSettings>) => {
}
        if (!league || !user || !isCommissioner) return;

        try {
}

            const updatedLeague = await leagueManagementService.updateLeagueSettings(
                league.id,
                user.id.toString(),
//                 updates
            );
            setLeague(updatedLeague);
            setEditingSettings(false);

    } catch (error) {
}
            setError(&apos;Failed to update league settings&apos;);

    };

    // Handle member invitation
    const handleInviteMember = async (email: string, message?: string) => {
}
        if (!league || !user || !isCommissioner) return;

        try {
}

            await leagueManagementService.inviteMember(league.id, user.id.toString(), email, message);
            // Refresh league data
            const updatedLeague = await leagueManagementService.getLeague(league.id);
            if (updatedLeague) setLeague(updatedLeague);

    } catch (error) {
}
            setError(&apos;Failed to send invitation&apos;);

    };

    // Handle member removal
    const handleRemoveMember = async (memberId: string, reason: string) => {
}
        if (!league || !user || !isCommissioner) return;

        try {
}

            const updatedLeague = await leagueManagementService.removeMember(
                league.id,
                user.id.toString(),
                memberId,
//                 reason
            );
            setLeague(updatedLeague);

    } catch (error) {
}
            setError(&apos;Failed to remove member&apos;);

    };

    // Handle commissioner action
    const handleCommissionerAction = async (action: CommissionerAction) => {
}
        if (!league || !user || !isCommissioner) return;

        try {
}

            const updatedLeague = await leagueManagementService.executeCommissionerAction(
                league.id,
                user.id.toString(),
//                 action
            );
            setLeague(updatedLeague);
            setPendingAction(null);
        
    `league-management-interface ${className}`}>
            {/* League Selector */}
            <Widget title="League Management" className="bg-gray-900/50 mb-6 sm:px-4 md:px-6 lg:px-8">
                <div className="flex flex-wrap items-center justify-between mb-4 sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-center space-x-4 sm:px-4 md:px-6 lg:px-8">
                        <select
                            value={league?.id || &apos;&apos;}
                            onChange={(e: any) => {
}
                                const selectedLeague = userLeagues.find((l: any) => l.id === e.target.value);
                                setLeague(selectedLeague || null);
                            }}
                            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white sm:px-4 md:px-6 lg:px-8"
                        >
                            <option value="">Select a League</option>
                            {userLeagues.map((l: any) => (
}
                                <option key={l.id} value={l.id}>
                                    {l.name} {l.commissionerId === user?.id.toString() && &apos;(Commissioner)&apos;}
                                </option>
                            ))}
                        </select>
                        
                        <button
                            onClick={handleCreateLeague}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8"
                         aria-label="Action button">
                            <PlusIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                            <span>Create League</span>
                        </button>
                    </div>

                    {league && (
}
                        <div className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeStyles(league?.status)}`}>
                                {league.status.toUpperCase()}
                            </div>
                            {isCommissioner && (
}
                                <div className="flex items-center space-x-1 text-yellow-400 sm:px-4 md:px-6 lg:px-8">
                                    <CrownIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                    <span className="text-xs font-medium sm:px-4 md:px-6 lg:px-8">Commissioner</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Pending Invitations */}
                {invitations.length > 0 && (
}
                    <div className="bg-blue-900/20 rounded-lg p-4 mb-4 sm:px-4 md:px-6 lg:px-8">
                        <h3 className="text-lg font-semibold text-blue-400 mb-3 sm:px-4 md:px-6 lg:px-8">
                            Pending Invitations ({invitations.length})
                        </h3>
                        <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                            {invitations.map((invitation: any) => (
}
                                <InvitationCard>
                                    key={invitation.id}
                                    invitation={invitation}
                                    onAccept={() => handleAcceptInvitation(invitation.id)}
                                    onDecline={() => handleDeclineInvitation(invitation.id)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Tab Navigation */}
                {league && (
}
                    <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1 sm:px-4 md:px-6 lg:px-8">
                        {[
}
                            { id: &apos;overview&apos;, label: &apos;Overview&apos;, icon: BarChart3Icon },
                            { id: &apos;members&apos;, label: &apos;Members&apos;, icon: UsersIcon },
                            { id: &apos;settings&apos;, label: &apos;Settings&apos;, icon: SettingsIcon },
                            { id: &apos;history&apos;, label: &apos;History&apos;, icon: CalendarIcon },
                            ...(isCommissioner ? [{ id: &apos;commissioner&apos;, label: &apos;Commissioner&apos;, icon: ShieldIcon }] : [])
                        ].map((tab: any) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as Tab)}`}
                            >
                                <tab.icon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </Widget>

            {/* Tab Content */}
            {league && (
}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === &apos;overview&apos; && (
}
                            <LeagueOverview league={league} />
                        )}
                        
                        {activeTab === &apos;members&apos; && (
}
                            <MembersManagement>
                                league={league}
                                isCommissioner={isCommissioner}
                                onInvite={handleInviteMember}
                                onRemove={handleRemoveMember}
                            />
                        )}
                        
                        {activeTab === &apos;settings&apos; && (
}
                            <LeagueSettingsPanel>
                                league={league}
                                isCommissioner={isCommissioner}
                                editing={editingSettings}
                                onEdit={() => setEditingSettings(true)}
                                onSave={handleSettingsUpdate}
                                onCancel={() => setEditingSettings(false)}
                            />
                        )}
                        
                        {activeTab === &apos;history&apos; && (
}
                            <LeagueHistory league={league} />
                        )}
                        
                        {activeTab === &apos;commissioner&apos; && isCommissioner && (
}
                            <CommissionerPanel>
                                league={league}
                                onAction={handleCommissionerAction}
                                pendingAction={pendingAction}
                                setPendingAction={setPendingAction}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
};

// Sub-components for each tab
const LeagueOverview: React.FC<{ league: League }> = ({ league }: any) => {
}
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* League Info */}
            <Widget title="League Information" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                    <div>
                        <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">League Name</div>
                        <div className="text-white font-medium sm:px-4 md:px-6 lg:px-8">{league.name}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Commissioner</div>
                        <div className="text-white sm:px-4 md:px-6 lg:px-8">{league.commissionerName}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Members</div>
                        <div className="text-white sm:px-4 md:px-6 lg:px-8">{league.members.length}/{league.maxMembers}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Format</div>
                        <div className="text-white sm:px-4 md:px-6 lg:px-8">
                            {league.settings.leagueSize}-team {league.settings.scoringSystem.toUpperCase()}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Season</div>
                        <div className="text-white sm:px-4 md:px-6 lg:px-8">{league.seasonYear}</div>
                    </div>
                </div>
            </Widget>

            {/* Standings Preview */}
            <Widget title="Current Standings" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                    {league.members
}
                        .filter((m: any) => m.record)
                        .sort((a, b) => (b.record?.wins || 0) - (a.record?.wins || 0))
                        .slice(0, 5)
                        .map((member, index) => (
                            <div key={member.userId} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0 sm:px-4 md:px-6 lg:px-8">
                                <div className="flex items-center space-x-3 sm:px-4 md:px-6 lg:px-8">
                                    <span className="text-gray-400 text-sm w-4 sm:px-4 md:px-6 lg:px-8">#{index + 1}</span>
                                    <div>
                                        <div className="text-white font-medium sm:px-4 md:px-6 lg:px-8">{member.teamName}</div>
                                        <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">{member.username}</div>
                                    </div>
                                </div>
                                <div className="text-right sm:px-4 md:px-6 lg:px-8">
                                    <div className="text-white font-medium sm:px-4 md:px-6 lg:px-8">
                                        {member.record?.wins}-{member.record?.losses}
                                    </div>
                                    <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                        {member.record?.pointsFor.toFixed(1)} PF
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </Widget>

            {/* Recent Activity */}
            <Widget title="Recent Activity" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                    {league.history.slice(0, 5).map((event: any) => (
}
                        <div key={event.id} className="py-2 border-b border-gray-700 last:border-b-0 sm:px-4 md:px-6 lg:px-8">
                            <div className="text-sm text-white sm:px-4 md:px-6 lg:px-8">{event.description}</div>
                            <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                {new Date(event.timestamp).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            </Widget>
        </div>
    );
};

const InvitationCard: React.FC<{
}
    invitation: LeagueInvitation;
    onAccept: () => void;
    onDecline: () => void;
}> = ({ invitation, onAccept, onDecline }: any) => {
}
    return (
        <div className="bg-gray-800/50 rounded-lg p-3 flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
            <div>
                <div className="text-white font-medium sm:px-4 md:px-6 lg:px-8">{invitation.leagueName}</div>
                <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">
                    Invited by {invitation.invitedByName}
                </div>
                {invitation.message && (
}
                    <div className="text-xs text-gray-500 mt-1 sm:px-4 md:px-6 lg:px-8">{invitation.message}</div>
                )}
            </div>
            <div className="flex space-x-2 sm:px-4 md:px-6 lg:px-8">
                <button
                    onClick={onAccept}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm sm:px-4 md:px-6 lg:px-8"
                 aria-label="Action button">
//                     Accept
                </button>
                <button
                    onClick={onDecline}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm sm:px-4 md:px-6 lg:px-8"
                 aria-label="Action button">
//                     Decline
                </button>
            </div>
        </div>
    );
};

// Placeholder components for other tabs
const MembersManagement: React.FC<any> = () => <div>Members Management - Coming Soon</div>;
const LeagueSettingsPanel: React.FC<any> = () => <div>League Settings - Coming Soon</div>;
const LeagueHistory: React.FC<any> = () => <div>League History - Coming Soon</div>;
const CommissionerPanel: React.FC<any> = () => <div>Commissioner Panel - Coming Soon</div>;

const LeagueManagementInterfaceWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <LeagueManagementInterface {...props} />
  </ErrorBoundary>
);

export default React.memo(LeagueManagementInterfaceWithErrorBoundary);
