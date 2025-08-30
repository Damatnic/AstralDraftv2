/**
 * Oracle Live Data Integration Service
 * Provides real-time intelligence updates for fantasy football decisions
 */

export interface OracleIntelligenceUpdate {
  id: string;
  timestamp: Date;
  type: 'injury' | 'weather' | 'lineup' | 'trend' | 'breaking_news';
  playerId?: string;
  teamId?: string;
  gameId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  impact: {
    fantasyPoints: number;
    recommendation: string;
    alternativePlayers?: string[];
  };
  message: string;
  source: string;
  metadata?: Record<string, unknown>;
}

export interface OracleGamePrediction {
  gameId: string;
  homeTeam: string;
  awayTeam: string;
  predictedScore: {
    home: number;
    away: number;
  };
  confidence: number;
  keyFactors: string[];
  playerProjections: Map<string, number>;
}

class OracleLiveDataIntegrationService {
  private updates: OracleIntelligenceUpdate[] = [];
  private predictions: Map<string, OracleGamePrediction> = new Map();
  private subscribers: Set<(update: OracleIntelligenceUpdate) => void> = new Set();

  /**
   * Subscribe to oracle intelligence updates
   */
  subscribe(callback: (update: OracleIntelligenceUpdate) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  /**
   * Process real-time game event and generate intelligence
   */
  async processGameEvent(event: any): Promise<OracleIntelligenceUpdate | null> {
    // Analyze event and generate intelligence
    const intelligence = this.analyzeEvent(event);
    
    if (intelligence) {
      this.updates.push(intelligence);
      this.notifySubscribers(intelligence);
      return intelligence;
    }
    
    return null;
  }

  /**
   * Analyze player performance trends
   */
  async analyzePlayerTrends(playerId: string): Promise<OracleIntelligenceUpdate[]> {
    // Mock implementation - would connect to real analytics
    return this.updates.filter(u => u.playerId === playerId);
  }

  /**
   * Get game predictions
   */
  getGamePrediction(gameId: string): OracleGamePrediction | undefined {
    return this.predictions.get(gameId);
  }

  /**
   * Update game predictions based on live data
   */
  updatePredictions(gameId: string, prediction: OracleGamePrediction): void {
    this.predictions.set(gameId, prediction);
  }

  /**
   * Get recent intelligence updates
   */
  getRecentUpdates(limit = 10): OracleIntelligenceUpdate[] {
    return this.updates.slice(-limit);
  }

  /**
   * Clear old updates to manage memory
   */
  clearOldUpdates(hoursToKeep = 24): void {
    const cutoff = new Date(Date.now() - hoursToKeep * 60 * 60 * 1000);
    this.updates = this.updates.filter(u => u.timestamp > cutoff);
  }

  private analyzeEvent(event: any): OracleIntelligenceUpdate | null {
    // Simplified analysis logic
    if (!event) return null;

    const update: OracleIntelligenceUpdate = {
      id: `oracle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      type: this.determineEventType(event),
      playerId: event.playerId,
      teamId: event.teamId,
      gameId: event.gameId,
      severity: this.calculateSeverity(event),
      confidence: this.calculateConfidence(event),
      impact: {
        fantasyPoints: this.estimateFantasyImpact(event),
        recommendation: this.generateRecommendation(event),
      },
      message: this.generateMessage(event),
      source: 'Oracle AI Analysis',
      metadata: event.metadata,
    };

    return update;
  }

  private determineEventType(event: any): OracleIntelligenceUpdate['type'] {
    if (event.type?.includes('injury')) return 'injury';
    if (event.type?.includes('weather')) return 'weather';
    if (event.type?.includes('lineup')) return 'lineup';
    if (event.type?.includes('news')) return 'breaking_news';
    return 'trend';
  }

  private calculateSeverity(event: any): OracleIntelligenceUpdate['severity'] {
    // Logic to determine severity based on event impact
    const impact = event.impact || 0;
    if (impact > 15) return 'critical';
    if (impact > 10) return 'high';
    if (impact > 5) return 'medium';
    return 'low';
  }

  private calculateConfidence(event: any): number {
    // Calculate confidence score (0-1)
    return event.confidence || 0.75;
  }

  private estimateFantasyImpact(event: any): number {
    // Estimate fantasy point impact
    return event.fantasyImpact || 0;
  }

  private generateRecommendation(event: any): string {
    // Generate actionable recommendation
    if (event.type?.includes('injury')) {
      return `Consider benching player due to ${event.severity} injury risk`;
    }
    return 'Monitor situation closely';
  }

  private generateMessage(event: any): string {
    // Generate human-readable message
    return event.message || 'Oracle has detected a significant event';
  }

  private notifySubscribers(update: OracleIntelligenceUpdate): void {
    this.subscribers.forEach(callback => {
      try {
        callback(update);
      } catch (error) {
        console.error('Error notifying subscriber:', error);
      }
    });
  }
}

// Export singleton instance
export const oracleLiveDataIntegrationService = new OracleLiveDataIntegrationService();