/**
 * Oracle Collaborative Service
 * Manages collaborative features like group predictions, consensus building, and social interactions
 */

export interface CollaborativeSession {
  id: string;
  name: string;
  description: string;
  hostUserId: string;
  participants: SessionParticipant[];
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  settings: SessionSettings;
  predictions: SessionPrediction[];
  consensus?: ConsensusData;
}

export interface SessionParticipant {
  userId: string;
  username: string;
  joinedAt: Date;
  role: 'host' | 'participant' | 'observer';
  isActive: boolean;
  contributionScore: number;
  lastActivity: Date;
}

export interface SessionSettings {
  maxParticipants: number;
  allowPublicJoin: boolean;
  requireInvitation: boolean;
  votingType: 'majority' | 'weighted' | 'consensus';
  timeLimit?: number;
  discussionEnabled: boolean;
  anonymousVoting: boolean;
}

export interface SessionPrediction {
  id: string;
  sessionId: string;
  predictionId: string;
  question: string;
  options: string[];
  submissions: PredictionSubmission[];
  consensus?: number;
  confidence?: number;
  discussionPoints: DiscussionPoint[];
  status: 'open' | 'voting' | 'completed';
  deadline?: Date;
}

export interface PredictionSubmission {
  userId: string;
  choice: number;
  confidence: number;
  reasoning?: string;
  submittedAt: Date;
  isPublic: boolean;
}

export interface DiscussionPoint {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  likes: number;
  replies: DiscussionReply[];
  isHighlighted: boolean;
}

export interface DiscussionReply {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  likes: number;
}

export interface ConsensusData {
  choice: number;
  confidence: number;
  agreement: number; // 0-1 scale
  participantCount: number;
  methodology: 'simple_majority' | 'weighted_average' | 'delphi_method';
  convergenceMetrics: {
    rounds: number;
    finalVariance: number;
    timeToConsensus: number;
  };
}

export interface CollaborativeInsight {
  type: 'GROUP_THINK' | 'OUTLIER_VALUE' | 'EXPERTISE_ADVANTAGE' | 'CONSENSUS_STRENGTH';
  title: string;
  description: string;
  score: number;
  evidence: Record<string, unknown>;
  recommendations: string[];
}

export interface GroupPerformanceMetrics {
  sessionId: string;
  accuracy: number;
  consensusStrength: number;
  participationRate: number;
  diversityIndex: number;
  expertiseDistribution: Record<string, number>;
  decisionQuality: number;
  timeEfficiency: number;
}

export interface InvitationRequest {
  sessionId: string;
  invitedUserId: string;
  invitedBy: string;
  message?: string;
  expiresAt: Date;
}

class OracleCollaborativeService {
  private sessions = new Map<string, CollaborativeSession>();
  private userSessions = new Map<string, string[]>(); // userId -> sessionIds
  private invitations = new Map<string, InvitationRequest[]>(); // userId -> invitations

  /**
   * Create a new collaborative session
   */
  async createSession(
    hostUserId: string,
    name: string,
    description: string,
    settings: Partial<SessionSettings> = {}
  ): Promise<CollaborativeSession> {
    const sessionId = this.generateSessionId();
    
    const defaultSettings: SessionSettings = {
      maxParticipants: 10,
      allowPublicJoin: false,
      requireInvitation: true,
      votingType: 'majority',
      discussionEnabled: true,
      anonymousVoting: false,
      ...settings
    };

    const session: CollaborativeSession = {
      id: sessionId,
      name,
      description,
      hostUserId,
      participants: [{
        userId: hostUserId,
        username: await this.getUserName(hostUserId),
        joinedAt: new Date(),
        role: 'host',
        isActive: true,
        contributionScore: 0,
        lastActivity: new Date()
      }],
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      settings: defaultSettings,
      predictions: []
    };

    this.sessions.set(sessionId, session);
    this.addUserToSession(hostUserId, sessionId);

    return session;
  }

  /**
   * Join an existing session
   */
  async joinSession(sessionId: string, userId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    // Check if user is already in the session
    if (session.participants.some(p => p.userId === userId)) {
      return true;
    }

    // Check constraints
    if (session.participants.length >= session.settings.maxParticipants) {
      return false;
    }

    if (session.settings.requireInvitation && !this.hasInvitation(userId, sessionId)) {
      return false;
    }

    const participant: SessionParticipant = {
      userId,
      username: await this.getUserName(userId),
      joinedAt: new Date(),
      role: 'participant',
      isActive: true,
      contributionScore: 0,
      lastActivity: new Date()
    };

    session.participants.push(participant);
    session.updatedAt = new Date();

    this.addUserToSession(userId, sessionId);
    this.removeInvitation(userId, sessionId);

    return true;
  }

  /**
   * Leave a session
   */
  async leaveSession(sessionId: string, userId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    const participantIndex = session.participants.findIndex(p => p.userId === userId);
    if (participantIndex === -1) return false;

    // If host leaves, transfer to another participant or close session
    if (session.participants[participantIndex].role === 'host') {
      const activeParticipants = session.participants.filter(p => p.userId !== userId && p.isActive);
      if (activeParticipants.length > 0) {
        activeParticipants[0].role = 'host';
      } else {
        session.status = 'completed';
      }
    }

    session.participants.splice(participantIndex, 1);
    session.updatedAt = new Date();

    this.removeUserFromSession(userId, sessionId);

    return true;
  }

  /**
   * Send invitation to join session
   */
  async sendInvitation(
    sessionId: string,
    invitedUserId: string,
    invitedBy: string,
    message?: string
  ): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    // Check if inviter has permission
    const inviter = session.participants.find(p => p.userId === invitedBy);
    if (!inviter || (inviter.role !== 'host' && inviter.role !== 'participant')) {
      return false;
    }

    const invitation: InvitationRequest = {
      sessionId,
      invitedUserId,
      invitedBy,
      message,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };

    const userInvitations = this.invitations.get(invitedUserId) || [];
    
    // Remove existing invitation for same session
    const filteredInvitations = userInvitations.filter(inv => inv.sessionId !== sessionId);
    filteredInvitations.push(invitation);
    
    this.invitations.set(invitedUserId, filteredInvitations);

    return true;
  }

  /**
   * Add prediction to collaborative session
   */
  async addPredictionToSession(
    sessionId: string,
    predictionId: string,
    question: string,
    options: string[],
    deadline?: Date
  ): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    const sessionPrediction: SessionPrediction = {
      id: this.generatePredictionId(),
      sessionId,
      predictionId,
      question,
      options,
      submissions: [],
      discussionPoints: [],
      status: 'open',
      deadline
    };

    session.predictions.push(sessionPrediction);
    session.updatedAt = new Date();

    return true;
  }

  /**
   * Submit prediction in collaborative session
   */
  async submitCollaborativePrediction(
    sessionId: string,
    sessionPredictionId: string,
    userId: string,
    choice: number,
    confidence: number,
    reasoning?: string,
    isPublic: boolean = true
  ): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    const participant = session.participants.find(p => p.userId === userId);
    if (!participant) return false;

    const prediction = session.predictions.find(p => p.id === sessionPredictionId);
    if (!prediction || prediction.status !== 'open') return false;

    // Remove existing submission from same user
    prediction.submissions = prediction.submissions.filter(s => s.userId !== userId);

    const submission: PredictionSubmission = {
      userId,
      choice,
      confidence,
      reasoning,
      submittedAt: new Date(),
      isPublic
    };

    prediction.submissions.push(submission);
    participant.contributionScore += 1;
    participant.lastActivity = new Date();

    // Calculate consensus if enough submissions
    if (prediction.submissions.length >= Math.ceil(session.participants.length * 0.6)) {
      this.calculateConsensus(prediction, session.settings.votingType);
    }

    session.updatedAt = new Date();
    return true;
  }

  /**
   * Add discussion point
   */
  async addDiscussion(
    sessionId: string,
    sessionPredictionId: string,
    userId: string,
    message: string
  ): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session || !session.settings.discussionEnabled) return false;

    const participant = session.participants.find(p => p.userId === userId);
    if (!participant) return false;

    const prediction = session.predictions.find(p => p.id === sessionPredictionId);
    if (!prediction) return false;

    const discussionPoint: DiscussionPoint = {
      id: this.generateDiscussionId(),
      userId,
      username: participant.username,
      message,
      timestamp: new Date(),
      likes: 0,
      replies: [],
      isHighlighted: false
    };

    prediction.discussionPoints.push(discussionPoint);
    participant.contributionScore += 0.5;
    participant.lastActivity = new Date();

    session.updatedAt = new Date();
    return true;
  }

  /**
   * Get session details
   */
  getSession(sessionId: string): CollaborativeSession | null {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * Get user's sessions
   */
  getUserSessions(userId: string): CollaborativeSession[] {
    const sessionIds = this.userSessions.get(userId) || [];
    return sessionIds
      .map(id => this.sessions.get(id))
      .filter((session): session is CollaborativeSession => session !== undefined);
  }

  /**
   * Get user's invitations
   */
  getUserInvitations(userId: string): InvitationRequest[] {
    const invitations = this.invitations.get(userId) || [];
    const now = new Date();
    
    // Filter out expired invitations
    const validInvitations = invitations.filter(inv => inv.expiresAt > now);
    this.invitations.set(userId, validInvitations);
    
    return validInvitations;
  }

  /**
   * Calculate group performance metrics
   */
  calculateGroupMetrics(sessionId: string): GroupPerformanceMetrics | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const completedPredictions = session.predictions.filter(p => p.status === 'completed');
    if (completedPredictions.length === 0) {
      return {
        sessionId,
        accuracy: 0,
        consensusStrength: 0,
        participationRate: 0,
        diversityIndex: 0,
        expertiseDistribution: {},
        decisionQuality: 0,
        timeEfficiency: 0
      };
    }

    const accuracy = this.calculateGroupAccuracy(completedPredictions);
    const consensusStrength = this.calculateConsensusStrength(completedPredictions);
    const participationRate = this.calculateParticipationRate(session);
    const diversityIndex = this.calculateDiversityIndex(session);
    const expertiseDistribution = this.calculateExpertiseDistribution(session);
    const decisionQuality = this.calculateDecisionQuality(completedPredictions);
    const timeEfficiency = this.calculateTimeEfficiency(completedPredictions);

    return {
      sessionId,
      accuracy,
      consensusStrength,
      participationRate,
      diversityIndex,
      expertiseDistribution,
      decisionQuality,
      timeEfficiency
    };
  }

  /**
   * Generate collaborative insights
   */
  generateCollaborativeInsights(sessionId: string): CollaborativeInsight[] {
    const session = this.sessions.get(sessionId);
    if (!session) return [];

    const insights: CollaborativeInsight[] = [];
    const metrics = this.calculateGroupMetrics(sessionId);
    
    if (!metrics) return insights;

    // Group think detection
    if (metrics.consensusStrength > 0.9 && metrics.diversityIndex < 0.3) {
      insights.push({
        type: 'GROUP_THINK',
        title: 'Potential Groupthink Detected',
        description: 'The group shows very high agreement with low diversity of perspectives.',
        score: 0.8,
        evidence: { consensusStrength: metrics.consensusStrength, diversityIndex: metrics.diversityIndex },
        recommendations: [
          'Encourage devil\'s advocate positions',
          'Invite diverse perspectives',
          'Consider anonymous voting'
        ]
      });
    }

    // Expertise advantage
    if (Object.keys(metrics.expertiseDistribution).length > 0) {
      const expertiseValues = Object.values(metrics.expertiseDistribution);
      const avgExpertise = expertiseValues.reduce((sum, val) => sum + val, 0) / expertiseValues.length;
      
      if (avgExpertise > 0.7) {
        insights.push({
          type: 'EXPERTISE_ADVANTAGE',
          title: 'High Expertise Group',
          description: 'This group demonstrates strong domain expertise.',
          score: avgExpertise,
          evidence: { expertiseDistribution: metrics.expertiseDistribution },
          recommendations: [
            'Leverage expertise in complex decisions',
            'Consider weighted voting',
            'Document reasoning for future reference'
          ]
        });
      }
    }

    return insights;
  }

  /**
   * Private helper methods
   */
  private calculateConsensus(prediction: SessionPrediction, votingType: string): void {
    const submissions = prediction.submissions;
    if (submissions.length === 0) return;

    let consensus: ConsensusData;

    switch (votingType) {
      case 'majority':
        consensus = this.calculateMajorityConsensus(submissions);
        break;
      case 'weighted':
        consensus = this.calculateWeightedConsensus(submissions);
        break;
      case 'consensus':
        consensus = this.calculateDelphiConsensus(submissions);
        break;
      default:
        consensus = this.calculateMajorityConsensus(submissions);
    }

    prediction.consensus = consensus.choice;
    prediction.confidence = consensus.confidence;
  }

  private calculateMajorityConsensus(submissions: PredictionSubmission[]): ConsensusData {
    const choiceCounts: Record<number, number> = {};
    const confidences: number[] = [];

    submissions.forEach(sub => {
      choiceCounts[sub.choice] = (choiceCounts[sub.choice] || 0) + 1;
      confidences.push(sub.confidence);
    });

    const majorityChoice = Object.entries(choiceCounts)
      .reduce((a, b) => choiceCounts[parseInt(a[0])] > choiceCounts[parseInt(b[0])] ? a : b)[0];

    const avgConfidence = confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;
    const agreement = choiceCounts[parseInt(majorityChoice)] / submissions.length;

    return {
      choice: parseInt(majorityChoice),
      confidence: avgConfidence,
      agreement,
      participantCount: submissions.length,
      methodology: 'simple_majority',
      convergenceMetrics: {
        rounds: 1,
        finalVariance: this.calculateVariance(confidences),
        timeToConsensus: 0
      }
    };
  }

  private calculateWeightedConsensus(submissions: PredictionSubmission[]): ConsensusData {
    let weightedSum = 0;
    let totalWeight = 0;
    let confidenceSum = 0;

    submissions.forEach(sub => {
      const weight = sub.confidence;
      weightedSum += sub.choice * weight;
      totalWeight += weight;
      confidenceSum += sub.confidence;
    });

    const weightedChoice = Math.round(weightedSum / totalWeight);
    const avgConfidence = confidenceSum / submissions.length;

    return {
      choice: weightedChoice,
      confidence: avgConfidence,
      agreement: 0.8, // Placeholder calculation
      participantCount: submissions.length,
      methodology: 'weighted_average',
      convergenceMetrics: {
        rounds: 1,
        finalVariance: 0,
        timeToConsensus: 0
      }
    };
  }

  private calculateDelphiConsensus(submissions: PredictionSubmission[]): ConsensusData {
    // Simplified Delphi method - in real implementation would involve multiple rounds
    return this.calculateWeightedConsensus(submissions);
  }

  private calculateGroupAccuracy(_predictions: SessionPrediction[]): number {
    // Placeholder - would need actual results to compare
    return 0.7;
  }

  private calculateConsensusStrength(predictions: SessionPrediction[]): number {
    if (predictions.length === 0) return 0;
    
    const agreements = predictions
      .filter(p => p.consensus !== undefined)
      .map(p => p.consensus || 0);
    
    return agreements.length > 0 ? 
      agreements.reduce((sum, agreement) => sum + agreement, 0) / agreements.length : 0;
  }

  private calculateParticipationRate(session: CollaborativeSession): number {
    const activeParticipants = session.participants.filter(p => p.isActive).length;
    return activeParticipants / session.participants.length;
  }

  private calculateDiversityIndex(session: CollaborativeSession): number {
    // Simplified diversity calculation based on contribution patterns
    const contributions = session.participants.map(p => p.contributionScore);
    const variance = this.calculateVariance(contributions);
    return Math.min(variance / 10, 1); // Normalize to 0-1
  }

  private calculateExpertiseDistribution(session: CollaborativeSession): Record<string, number> {
    // Placeholder - would integrate with user expertise data
    const distribution: Record<string, number> = {};
    session.participants.forEach(p => {
      distribution[p.userId] = Math.random() * 0.5 + 0.5; // Mock expertise 0.5-1.0
    });
    return distribution;
  }

  private calculateDecisionQuality(_predictions: SessionPrediction[]): number {
    // Placeholder - would need actual outcome data
    return 0.75;
  }

  private calculateTimeEfficiency(_predictions: SessionPrediction[]): number {
    // Placeholder - calculate based on time to reach consensus
    return 0.8;
  }

  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
  }

  private async getUserName(userId: string): Promise<string> {
    // Placeholder - would integrate with user service
    return `User_${userId.slice(-6)}`;
  }

  private hasInvitation(userId: string, sessionId: string): boolean {
    const invitations = this.invitations.get(userId) || [];
    return invitations.some(inv => inv.sessionId === sessionId && inv.expiresAt > new Date());
  }

  private removeInvitation(userId: string, sessionId: string): void {
    const invitations = this.invitations.get(userId) || [];
    const filtered = invitations.filter(inv => inv.sessionId !== sessionId);
    this.invitations.set(userId, filtered);
  }

  private addUserToSession(userId: string, sessionId: string): void {
    const userSessions = this.userSessions.get(userId) || [];
    if (!userSessions.includes(sessionId)) {
      userSessions.push(sessionId);
      this.userSessions.set(userId, userSessions);
    }
  }

  private removeUserFromSession(userId: string, sessionId: string): void {
    const userSessions = this.userSessions.get(userId) || [];
    const filtered = userSessions.filter(id => id !== sessionId);
    this.userSessions.set(userId, filtered);
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generatePredictionId(): string {
    return `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateDiscussionId(): string {
    return `disc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const oracleCollaborativeService = new OracleCollaborativeService();
export default oracleCollaborativeService;
