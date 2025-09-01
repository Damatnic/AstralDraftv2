/**
 * Oracle Social Features Service
 * Manages leagues, group predictions, debates, and social interactions for Oracle challenges
 */

export type DebateSide = &apos;SIDE_A&apos; | &apos;SIDE_B&apos; | &apos;NEUTRAL&apos;;
export type GroupPredictionType = &apos;CONSENSUS&apos; | &apos;MAJORITY_VOTE&apos; | &apos;WEIGHTED_AVERAGE&apos;;

export interface OracleLeague {
}
    id: string;
    name: string;
    description: string;
    creatorId: string;
    creatorName: string;
    avatar: string;
    isPublic: boolean;
    maxMembers: number;
    currentMembers: number;
    members: LeagueMember[];
    settings: LeagueSettings;
    createdAt: string;
    seasonStartDate: string;
    seasonEndDate: string;
    status: &apos;ACTIVE&apos; | &apos;ENDED&apos; | &apos;PENDING&apos;;
    tags: string[];
    joinCode?: string;
}

export interface LeagueMember {
}
    userId: string;
    username: string;
    avatar: string;
    role: &apos;CREATOR&apos; | &apos;ADMIN&apos; | &apos;MEMBER&apos;;
    joinedAt: string;
    stats: LeagueMemberStats;
    isActive: boolean;
    lastActivity: string;
}

export interface LeagueMemberStats {
}
    totalPoints: number;
    weeklyPoints: number;
    wins: number;
    losses: number;
    winRate: number;
    currentStreak: number;
    longestStreak: number;
    rank: number;
    weeklyRank: number;
    achievements: number;
    badges: number;
}

export interface LeagueSettings {
}
    challengeFrequency: &apos;DAILY&apos; | &apos;WEEKLY&apos; | &apos;BI_WEEKLY&apos;;
    pointsSystem: &apos;STANDARD&apos; | &apos;BOOSTED&apos; | &apos;CUSTOM&apos;;
    allowDebates: boolean;
    allowGroupPredictions: boolean;
    autoStartChallenges: boolean;
    minimumParticipants: number;
    enableTrashtalk: boolean;
    moderationLevel: &apos;OPEN&apos; | &apos;MODERATED&apos; | &apos;STRICT&apos;;
    customRules: string[];
}

export interface GroupPrediction {
}
    id: string;
    leagueId: string;
    challengeId: string;
    title: string;
    description: string;
    type: GroupPredictionType;
    status: &apos;OPEN&apos; | &apos;CLOSED&apos; | &apos;COMPLETED&apos;;
    createdBy: string;
    createdAt: string;
    closesAt: string;
    participants: GroupPredictionParticipant[];
    result?: {
}
        prediction: number;
        confidence: number;
        accuracy?: boolean;
        participantCount: number;
    };
    rewards: {
}
        winnerPoints: number;
        participationPoints: number;
    };
}

export interface GroupPredictionParticipant {
}
    userId: string;
    username: string;
    avatar: string;
    prediction: number;
    confidence: number;
    reasoning?: string;
    submittedAt: string;
    weight?: number; // For weighted average calculations
}

export interface Debate {
}
    id: string;
    leagueId: string;
    challengeId?: string;
    title: string;
    topic: string;
    description: string;
    createdBy: string;
    createdAt: string;
    status: &apos;ACTIVE&apos; | &apos;CLOSED&apos; | &apos;RESOLVED&apos;;
    participants: DebateParticipant[];
    posts: DebatePost[];
    votes: DebateVote[];
    tags: string[];
    moderatorActions: ModeratorAction[];
    resolution?: {
}
        winner: &apos;SIDE_A&apos; | &apos;SIDE_B&apos; | &apos;DRAW&apos;;
        resolvedBy: string;
        resolvedAt: string;
        reasoning: string;
    };
}

export interface DebateParticipant {
}
    userId: string;
    username: string;
    avatar: string;
    side: DebateSide;
    joinedAt: string;
    reputation: number;
    badges: string[];
}

export interface DebatePost {
}
    id: string;
    debateId: string;
    userId: string;
    username: string;
    avatar: string;
    content: string;
    side: DebateSide;
    postedAt: string;
    editedAt?: string;
    reactions: PostReaction[];
    replies: DebateReply[];
    isModerated: boolean;
    isPinned: boolean;
}

export interface DebateReply {
}
    id: string;
    postId: string;
    userId: string;
    username: string;
    avatar: string;
    content: string;
    postedAt: string;
    reactions: PostReaction[];
}

export interface PostReaction {
}
    userId: string;
    type: &apos;👍&apos; | &apos;👎&apos; | &apos;🔥&apos; | &apos;💯&apos; | &apos;🤔&apos; | &apos;😂&apos;;
    timestamp: string;
}

export interface DebateVote {
}
    userId: string;
    side: &apos;SIDE_A&apos; | &apos;SIDE_B&apos;;
    timestamp: string;
    reasoning?: string;
}

export interface ModeratorAction {
}
    id: string;
    moderatorId: string;
    moderatorName: string;
    action: &apos;DELETE_POST&apos; | &apos;EDIT_POST&apos; | &apos;WARN_USER&apos; | &apos;TIMEOUT_USER&apos; | &apos;PIN_POST&apos;;
    targetId: string;
    targetType: &apos;POST&apos; | &apos;REPLY&apos; | &apos;USER&apos;;
    reason: string;
    timestamp: string;
}

export interface SocialNotification {
}
    id: string;
    userId: string;
    type: &apos;LEAGUE_INVITE&apos; | &apos;GROUP_PREDICTION&apos; | &apos;DEBATE_MENTION&apos; | &apos;CHALLENGE_RESULT&apos; | &apos;LEAGUE_UPDATE&apos;;
    title: string;
    message: string;
    data: any;
    isRead: boolean;
    createdAt: string;
    expiresAt?: string;
}

export interface LeagueInvitation {
}
    id: string;
    leagueId: string;
    leagueName: string;
    fromUserId: string;
    fromUsername: string;
    toUserId: string;
    toUsername: string;
    message?: string;
    status: &apos;PENDING&apos; | &apos;ACCEPTED&apos; | &apos;DECLINED&apos; | &apos;EXPIRED&apos;;
    createdAt: string;
    expiresAt: string;
}

export interface SocialChallenge {
}
    id: string;
    leagueId: string;
    type: &apos;HEAD_TO_HEAD&apos; | &apos;MINI_TOURNAMENT&apos; | &apos;SPEED_ROUND&apos;;
    title: string;
    description: string;
    participants: string[];
    settings: {
}
        duration: number; // minutes
        questionCount: number;
        difficultyLevel: &apos;EASY&apos; | &apos;MEDIUM&apos; | &apos;HARD&apos; | &apos;EXPERT&apos;;
        categories: string[];
    };
    status: &apos;SCHEDULED&apos; | &apos;ACTIVE&apos; | &apos;COMPLETED&apos;;
    startTime: string;
    endTime: string;
    results?: {
}
        winner: string;
        scores: Record<string, number>;
        leaderboard: Array<{
}
            userId: string;
            username: string;
            score: number;
            rank: number;
        }>;
    };
}

class OracleSocialService {
}
    private readonly LEAGUES_KEY = &apos;oracleLeagues&apos;;
    private readonly USER_LEAGUES_KEY = &apos;oracleUserLeagues&apos;;
    private readonly GROUP_PREDICTIONS_KEY = &apos;oracleGroupPredictions&apos;;
    private readonly DEBATES_KEY = &apos;oracleDebates&apos;;
    private readonly NOTIFICATIONS_KEY = &apos;oracleSocialNotifications&apos;;
    private readonly INVITATIONS_KEY = &apos;oracleInvitations&apos;;

    // League Management
    /**
     * Create a new Oracle league
     */
    async createLeague(
        name: string,
        description: string,
        settings: LeagueSettings,
        isPublic: boolean = true,
        maxMembers: number = 50
    ): Promise<OracleLeague> {
}
        const league: OracleLeague = {
}
            id: `league-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
            name,
            description,
            creatorId: &apos;current-user&apos;, // Would be actual user ID
            creatorName: &apos;You&apos;,
            avatar: &apos;👤&apos;,
            isPublic,
            maxMembers,
            currentMembers: 1,
            members: [{
}
                userId: &apos;current-user&apos;,
                username: &apos;You&apos;,
                avatar: &apos;👤&apos;,
                role: &apos;CREATOR&apos;,
                joinedAt: new Date().toISOString(),
                stats: {
}
                    totalPoints: 0,
                    weeklyPoints: 0,
                    wins: 0,
                    losses: 0,
                    winRate: 0,
                    currentStreak: 0,
                    longestStreak: 0,
                    rank: 1,
                    weeklyRank: 1,
                    achievements: 0,
                    badges: 0
                },
                isActive: true,
                lastActivity: new Date().toISOString()
            }],
            settings,
            createdAt: new Date().toISOString(),
            seasonStartDate: new Date().toISOString(),
            seasonEndDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months
            status: &apos;ACTIVE&apos;,
            tags: this.generateLeagueTags(name, description),
            joinCode: this.generateJoinCode()
        };

        // Store league
        const leagues = this.getStoredLeagues();
        leagues.push(league);
        this.storeLeagues(leagues);

        // Add to user&apos;s leagues
        const userLeagues = this.getUserLeagueIds();
        userLeagues.push(league.id);
        this.storeUserLeagues(userLeagues);

        return league;
    }

    /**
     * Join a league by ID or join code
     */
    async joinLeague(leagueId: string, joinCode?: string): Promise<boolean> {
}
        const leagues = this.getStoredLeagues();
        const league = leagues.find((l: any) => l.id === leagueId || l.joinCode === joinCode);
        
        if (!league || league.currentMembers >= league.maxMembers) {
}
            return false;
        }

        // Check if user is already a member
        const isAlreadyMember = league.members.some((m: any) => m.userId === &apos;current-user&apos;);
        if (isAlreadyMember) {
}
            return false;
        }

        // Add user as member
        const newMember: LeagueMember = {
}
            userId: &apos;current-user&apos;,
            username: &apos;You&apos;,
            avatar: &apos;👤&apos;,
            role: &apos;MEMBER&apos;,
            joinedAt: new Date().toISOString(),
            stats: {
}
                totalPoints: 0,
                weeklyPoints: 0,
                wins: 0,
                losses: 0,
                winRate: 0,
                currentStreak: 0,
                longestStreak: 0,
                rank: league.currentMembers + 1,
                weeklyRank: league.currentMembers + 1,
                achievements: 0,
                badges: 0
            },
            isActive: true,
            lastActivity: new Date().toISOString()
        };

        league.members.push(newMember);
        league.currentMembers += 1;

        // Update stored leagues
        this.storeLeagues(leagues);

        // Add to user&apos;s leagues
        const userLeagues = this.getUserLeagueIds();
        userLeagues.push(league.id);
        this.storeUserLeagues(userLeagues);

        return true;
    }

    /**
     * Get user&apos;s leagues
     */
    async getUserLeagues(): Promise<OracleLeague[]> {
}
        const userLeagueIds = this.getUserLeagueIds();
        const allLeagues = this.getStoredLeagues();
        return allLeagues.filter((league: any) => userLeagueIds.includes(league.id));
    }

    /**
     * Get public leagues available to join
     */
    async getPublicLeagues(limit: number = 20): Promise<OracleLeague[]> {
}
        const allLeagues = this.getStoredLeagues();
        return allLeagues
            .filter((league: any) => league.isPublic && league.currentMembers < league.maxMembers)
            .slice(0, limit);
    }

    // Group Predictions
    /**
     * Create a group prediction for a challenge
     */
    async createGroupPrediction(
        leagueId: string,
        challengeId: string,
        title: string,
        description: string,
        type: GroupPrediction[&apos;type&apos;] = &apos;MAJORITY_VOTE&apos;,
        closesInHours: number = 24
    ): Promise<GroupPrediction> {
}
        const groupPrediction: GroupPrediction = {
}
            id: `group-pred-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
            leagueId,
            challengeId,
            title,
            description,
            type,
            status: &apos;OPEN&apos;,
            createdBy: &apos;current-user&apos;,
            createdAt: new Date().toISOString(),
            closesAt: new Date(Date.now() + closesInHours * 60 * 60 * 1000).toISOString(),
            participants: [],
            rewards: {
}
                winnerPoints: 100,
                participationPoints: 25
            }
        };

        const groupPredictions = this.getStoredGroupPredictions();
        groupPredictions.push(groupPrediction);
        this.storeGroupPredictions(groupPredictions);

        return groupPrediction;
    }

    /**
     * Submit a prediction to a group prediction
     */
    async submitGroupPrediction(
        groupPredictionId: string,
        prediction: number,
        confidence: number,
        reasoning?: string
    ): Promise<boolean> {
}
        const groupPredictions = this.getStoredGroupPredictions();
        const groupPred = groupPredictions.find((gp: any) => gp.id === groupPredictionId);

        if (!groupPred || groupPred.status !== &apos;OPEN&apos;) {
}
            return false;
        }

        // Check if user already participated
        const existingParticipant = groupPred.participants.find((p: any) => p.userId === &apos;current-user&apos;);
        if (existingParticipant) {
}
            // Update existing prediction
            existingParticipant.prediction = prediction;
            existingParticipant.confidence = confidence;
            existingParticipant.reasoning = reasoning;
            existingParticipant.submittedAt = new Date().toISOString();
        } else {
}
            // Add new participant
            groupPred.participants.push({
}
                userId: &apos;current-user&apos;,
                username: &apos;You&apos;,
                avatar: &apos;👤&apos;,
                prediction,
                confidence,
                reasoning,
                submittedAt: new Date().toISOString(),
                weight: 1.0 // Default weight
            });
        }

        this.storeGroupPredictions(groupPredictions);
        return true;
    }

    /**
     * Get group predictions for a league
     */
    async getLeagueGroupPredictions(leagueId: string): Promise<GroupPrediction[]> {
}
        const groupPredictions = this.getStoredGroupPredictions();
        return groupPredictions.filter((gp: any) => gp.leagueId === leagueId);
    }

    // Debate System
    /**
     * Create a new debate
     */
    async createDebate(
        leagueId: string,
        title: string,
        topic: string,
        description: string,
        challengeId?: string
    ): Promise<Debate> {
}
        const debate: Debate = {
}
            id: `debate-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
            leagueId,
            challengeId,
            title,
            topic,
            description,
            createdBy: &apos;current-user&apos;,
            createdAt: new Date().toISOString(),
            status: &apos;ACTIVE&apos;,
            participants: [],
            posts: [],
            votes: [],
            tags: this.generateDebateTags(title, topic, description),
            moderatorActions: []
        };

        const debates = this.getStoredDebates();
        debates.push(debate);
        this.storeDebates(debates);

        return debate;
    }

    /**
     * Join a debate
     */
    async joinDebate(debateId: string, side: &apos;SIDE_A&apos; | &apos;SIDE_B&apos; | &apos;NEUTRAL&apos;): Promise<boolean> {
}
        const debates = this.getStoredDebates();
        const debate = debates.find((d: any) => d.id === debateId);

        if (!debate || debate.status !== &apos;ACTIVE&apos;) {
}
            return false;
        }

        // Check if user is already participating
        const existingParticipant = debate.participants.find((p: any) => p.userId === &apos;current-user&apos;);
        if (existingParticipant) {
}
            existingParticipant.side = side;
        } else {
}
            debate.participants.push({
}
                userId: &apos;current-user&apos;,
                username: &apos;You&apos;,
                avatar: &apos;👤&apos;,
                side,
                joinedAt: new Date().toISOString(),
                reputation: 100, // Default reputation
                badges: []
            });
        }

        this.storeDebates(debates);
        return true;
    }

    /**
     * Post in a debate
     */
    async postInDebate(
        debateId: string,
        content: string,
        side: &apos;SIDE_A&apos; | &apos;SIDE_B&apos; | &apos;NEUTRAL&apos;
    ): Promise<DebatePost | null> {
}
        const debates = this.getStoredDebates();
        const debate = debates.find((d: any) => d.id === debateId);

        if (!debate || debate.status !== &apos;ACTIVE&apos;) {
}
            return null;
        }

        const post: DebatePost = {
}
            id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
            debateId,
            userId: &apos;current-user&apos;,
            username: &apos;You&apos;,
            avatar: &apos;👤&apos;,
            content,
            side,
            postedAt: new Date().toISOString(),
            reactions: [],
            replies: [],
            isModerated: false,
            isPinned: false
        };

        debate.posts.push(post);
        this.storeDebates(debates);

        return post;
    }

    /**
     * Get debates for a league
     */
    async getLeagueDebates(leagueId: string): Promise<Debate[]> {
}
        const debates = this.getStoredDebates();
        return debates.filter((d: any) => d.leagueId === leagueId);
    }

    /**
     * Vote in a debate
     */
    async voteInDebate(debateId: string, side: &apos;SIDE_A&apos; | &apos;SIDE_B&apos;, reasoning?: string): Promise<boolean> {
}
        const debates = this.getStoredDebates();
        const debate = debates.find((d: any) => d.id === debateId);

        if (!debate || debate.status !== &apos;ACTIVE&apos;) {
}
            return false;
        }

        // Remove existing vote if any
        debate.votes = debate.votes.filter((v: any) => v.userId !== &apos;current-user&apos;);

        // Add new vote
        debate.votes.push({
}
            userId: &apos;current-user&apos;,
            side,
            timestamp: new Date().toISOString(),
//             reasoning
        });

        this.storeDebates(debates);
        return true;
    }

    /**
     * Reply to a debate post
     */
    async replyToPost(postId: string, content: string): Promise<DebateReply | null> {
}
        const debates = this.getStoredDebates();
        
        for (const debate of debates) {
}
            const post = debate.posts.find((p: any) => p.id === postId);
            if (post) {
}
                const reply: DebateReply = {
}
                    id: `reply-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
                    postId,
                    userId: &apos;current-user&apos;,
                    username: &apos;You&apos;,
                    avatar: &apos;👤&apos;,
                    content,
                    postedAt: new Date().toISOString(),
                    reactions: []
                };

                post.replies.push(reply);
                this.storeDebates(debates);
                return reply;
            }
        }

        return null;
    }

    /**
     * Add reaction to a post
     */
    async addReaction(postId: string, reactionType: &apos;👍&apos; | &apos;👎&apos; | &apos;🔥&apos; | &apos;💯&apos; | &apos;🤔&apos; | &apos;😂&apos;): Promise<boolean> {
}
        const debates = this.getStoredDebates();
        
        for (const debate of debates) {
}
            const post = debate.posts.find((p: any) => p.id === postId);
            if (post) {
}
                // Remove existing reaction from this user
                post.reactions = post.reactions.filter((r: any) => r.userId !== &apos;current-user&apos;);
                
                // Add new reaction
                post.reactions.push({
}
                    userId: &apos;current-user&apos;,
                    type: reactionType,
                    timestamp: new Date().toISOString()
                });

                this.storeDebates(debates);
                return true;
            }
        }

        return false;
    }

    /**
     * Moderate a post (delete, edit, pin, etc.)
     */
    async moderatePost(
        postId: string, 
        action: &apos;DELETE_POST&apos; | &apos;EDIT_POST&apos; | &apos;WARN_USER&apos; | &apos;TIMEOUT_USER&apos; | &apos;PIN_POST&apos;,
        reason?: string
    ): Promise<boolean> {
}
        const debates = this.getStoredDebates();
        
        for (const debate of debates) {
}
            const post = debate.posts.find((p: any) => p.id === postId);
            if (post) {
}
                const moderatorAction: ModeratorAction = {
}
                    id: `mod-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
                    moderatorId: &apos;current-user&apos;,
                    moderatorName: &apos;You&apos;,
                    action,
                    targetId: postId,
                    targetType: &apos;POST&apos;,
                    reason: reason || &apos;&apos;,
                    timestamp: new Date().toISOString()
                };

                debate.moderatorActions.push(moderatorAction);

                // Apply the moderation action
                switch (action) {
}
                    case &apos;DELETE_POST&apos;:
                        debate.posts = debate.posts.filter((p: any) => p.id !== postId);
                        break;
                    case &apos;PIN_POST&apos;:
                        post.isPinned = true;
                        break;
                    case &apos;EDIT_POST&apos;:
                        post.isModerated = true;
                        break;
                }

                this.storeDebates(debates);
                return true;
            }
        }

        return false;
    }

    /**
     * Resolve a debate
     */
    async resolveDebate(
        debateId: string, 
        winner: &apos;SIDE_A&apos; | &apos;SIDE_B&apos; | &apos;DRAW&apos;, 
        reasoning: string
    ): Promise<boolean> {
}
        const debates = this.getStoredDebates();
        const debate = debates.find((d: any) => d.id === debateId);

        if (!debate) {
}
            return false;
        }

        debate.status = &apos;RESOLVED&apos;;
        debate.resolution = {
}
            winner,
            resolvedBy: &apos;current-user&apos;,
            resolvedAt: new Date().toISOString(),
//             reasoning
        };

        this.storeDebates(debates);
        return true;
    }

    // Social Features
    /**
     * Send league invitation
     */
    async sendLeagueInvitation(
        leagueId: string,
        toUsername: string,
        message?: string
    ): Promise<LeagueInvitation> {
}
        const invitation: LeagueInvitation = {
}
            id: `invite-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
            leagueId,
            leagueName: this.getStoredLeagues().find((l: any) => l.id === leagueId)?.name || &apos;Unknown League&apos;,
            fromUserId: &apos;current-user&apos;,
            fromUsername: &apos;You&apos;,
            toUserId: &apos;target-user&apos;,
            toUsername: toUsername,
            message,
            status: &apos;PENDING&apos;,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        };

        const invitations = this.getStoredInvitations();
        invitations.push(invitation);
        this.storeInvitations(invitations);

        return invitation;
    }

    /**
     * Get league leaderboard
     */
    async getLeagueLeaderboard(leagueId: string): Promise<LeagueMember[]> {
}
        const leagues = this.getStoredLeagues();
        const league = leagues.find((l: any) => l.id === leagueId);
        
        if (!league) return [];

        return [...league.members].sort((a, b) => b.stats.totalPoints - a.stats.totalPoints);
    }

    // Helper Methods
    private generateJoinCode(): string {
}
        return Math.random().toString(36).substring(2, 10).toUpperCase();
    }

    private generateLeagueTags(name: string, description: string): string[] {
}
        const tags: string[] = [];
        const text = `${name} ${description}`.toLowerCase();
        
        if (text.includes(&apos;fantasy&apos;)) tags.push(&apos;fantasy&apos;);
        if (text.includes(&apos;nfl&apos;)) tags.push(&apos;nfl&apos;);
        if (text.includes(&apos;competitive&apos;)) tags.push(&apos;competitive&apos;);
        if (text.includes(&apos;casual&apos;)) tags.push(&apos;casual&apos;);
        if (text.includes(&apos;friends&apos;)) tags.push(&apos;friends&apos;);
        if (text.includes(&apos;expert&apos;)) tags.push(&apos;expert&apos;);
        
        return tags;
    }

    private generateDebateTags(title: string, topic: string, description: string): string[] {
}
        const tags: string[] = [];
        const text = `${title} ${topic} ${description}`.toLowerCase();
        
        if (text.includes(&apos;trade&apos;)) tags.push(&apos;trades&apos;);
        if (text.includes(&apos;draft&apos;)) tags.push(&apos;draft&apos;);
        if (text.includes(&apos;waiver&apos;)) tags.push(&apos;waivers&apos;);
        if (text.includes(&apos;lineup&apos;)) tags.push(&apos;lineups&apos;);
        if (text.includes(&apos;injury&apos;)) tags.push(&apos;injuries&apos;);
        if (text.includes(&apos;prediction&apos;)) tags.push(&apos;predictions&apos;);
        
        return tags;
    }

    // Storage Methods
    private getStoredLeagues(): OracleLeague[] {
}
        try {
}
            const stored = localStorage.getItem(this.LEAGUES_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
}
            console.error(&apos;Failed to load leagues:&apos;, error);
            return [];
        }
    }

    private storeLeagues(leagues: OracleLeague[]): void {
}
        try {
}
            localStorage.setItem(this.LEAGUES_KEY, JSON.stringify(leagues));
        } catch (error) {
}
            console.error(&apos;Failed to store leagues:&apos;, error);
        }
    }

    private getUserLeagueIds(): string[] {
}
        try {
}
            const stored = localStorage.getItem(this.USER_LEAGUES_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
}
            console.error(&apos;Failed to load user leagues:&apos;, error);
            return [];
        }
    }

    private storeUserLeagues(leagueIds: string[]): void {
}
        try {
}
            localStorage.setItem(this.USER_LEAGUES_KEY, JSON.stringify(leagueIds));
        } catch (error) {
}
            console.error(&apos;Failed to store user leagues:&apos;, error);
        }
    }

    private getStoredGroupPredictions(): GroupPrediction[] {
}
        try {
}
            const stored = localStorage.getItem(this.GROUP_PREDICTIONS_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
}
            console.error(&apos;Failed to load group predictions:&apos;, error);
            return [];
        }
    }

    private storeGroupPredictions(predictions: GroupPrediction[]): void {
}
        try {
}
            localStorage.setItem(this.GROUP_PREDICTIONS_KEY, JSON.stringify(predictions));
        } catch (error) {
}
            console.error(&apos;Failed to store group predictions:&apos;, error);
        }
    }

    private getStoredDebates(): Debate[] {
}
        try {
}
            const stored = localStorage.getItem(this.DEBATES_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
}
            console.error(&apos;Failed to load debates:&apos;, error);
            return [];
        }
    }

    private storeDebates(debates: Debate[]): void {
}
        try {
}
            localStorage.setItem(this.DEBATES_KEY, JSON.stringify(debates));
        } catch (error) {
}
            console.error(&apos;Failed to store debates:&apos;, error);
        }
    }

    private getStoredInvitations(): LeagueInvitation[] {
}
        try {
}
            const stored = localStorage.getItem(this.INVITATIONS_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
}
            console.error(&apos;Failed to load invitations:&apos;, error);
            return [];
        }
    }

    private storeInvitations(invitations: LeagueInvitation[]): void {
}
        try {
}
            localStorage.setItem(this.INVITATIONS_KEY, JSON.stringify(invitations));
        } catch (error) {
}
            console.error(&apos;Failed to store invitations:&apos;, error);
        }
    }
}

// Export singleton instance
export const oracleSocialService = new OracleSocialService();
export default oracleSocialService;
