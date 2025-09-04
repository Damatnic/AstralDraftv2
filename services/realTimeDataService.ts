/**
 * Real-Time Data Service
 * WebSocket-based live score updates, player tracking, and push notifications
 * Exceeding ESPN/Yahoo real-time capabilities
 */

export interface LiveScore {
  gameId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  quarter: number;
  timeRemaining: string;
  status: 'pre-game' | 'in-progress' | 'halftime' | 'final' | 'overtime';
  lastUpdated: Date;
}

export interface PlayerPerformance {
  playerId: string;
  playerName: string;
  position: string;
  team: string;
  gameId: string;
  stats: {
    passingYards?: number;
    passingTouchdowns?: number;
    interceptions?: number;
    rushingYards?: number;
    rushingTouchdowns?: number;
    receivingYards?: number;
    receivingTouchdowns?: number;
    receptions?: number;
    fieldGoalsMade?: number;
    fieldGoalsAttempted?: number;
    extraPointsMade?: number;
    tackles?: number;
    sacks?: number;
    defensiveTouchdowns?: number;
  };
  fantasyPoints: number;
  projectedPoints: number;
  lastUpdated: Date;
}

export interface MatchupAlert {
  id: string;
  userId: string;
  type: 'score_update' | 'player_touchdown' | 'injury_update' | 'game_final' | 'close_matchup';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  data?: any;
}

class RealTimeDataService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnected = false;

  // Event listeners
  private liveScoreListeners: ((scores: LiveScore[]) => void)[] = [];
  private playerPerformanceListeners: ((performances: PlayerPerformance[]) => void)[] = [];
  private matchupAlertListeners: ((alert: MatchupAlert) => void)[] = [];
  private connectionStatusListeners: ((status: boolean) => void)[] = [];

  // Local data cache
  private liveScores: Map<string, LiveScore> = new Map();
  private playerPerformances: Map<string, PlayerPerformance> = new Map();
  private recentAlerts: MatchupAlert[] = [];

  constructor() {
    this.connect();
  }

  /**
   * Establish WebSocket connection for real-time updates
   */
  private connect(): void {
    try {
      // In production, this would be your real WebSocket endpoint
      // For development, we'll simulate with a mock connection
      const wsUrl = process.env.NODE_ENV === 'production' 
        ? 'wss://api.astraldraft.com/ws'
        : 'ws://localhost:8080/ws';

      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        console.log('🔗 Real-time connection established');
        this.notifyConnectionStatus(true);
        
        // Subscribe to real-time feeds
        this.subscribeToFeeds();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleRealtimeMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        console.log('🔌 Real-time connection closed');
        this.notifyConnectionStatus(false);
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnected = false;
        this.notifyConnectionStatus(false);
      };

    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
      // Fallback to polling mode for development
      this.startPollingMode();
    }
  }

  /**
   * Handle incoming real-time messages
   */
  private handleRealtimeMessage(data: any): void {
    switch (data.type) {
      case 'live_scores':
        this.updateLiveScores(data.scores);
        break;
      
      case 'player_performance':
        this.updatePlayerPerformances(data.performances);
        break;
      
      case 'matchup_alert':
        this.processMatchupAlert(data.alert);
        break;
      
      case 'bulk_update':
        // Handle bulk updates efficiently
        if (data.scores) this.updateLiveScores(data.scores);
        if (data.performances) this.updatePlayerPerformances(data.performances);
        break;
        
      default:
        console.warn('Unknown message type:', data.type);
    }
  }

  /**
   * Subscribe to real-time data feeds
   */
  private subscribeToFeeds(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const subscription = {
      type: 'subscribe',
      feeds: ['live_scores', 'player_performance', 'matchup_alerts'],
      filters: {
        leagues: ['nfl'], // Could be expanded to other sports
        season: '2024',
        week: this.getCurrentWeek()
      }
    };

    this.ws.send(JSON.stringify(subscription));
  }

  /**
   * Update live scores and notify listeners
   */
  private updateLiveScores(scores: LiveScore[]): void {
    scores.forEach(score => {
      score.lastUpdated = new Date();
      this.liveScores.set(score.gameId, score);
    });

    // Notify all listeners
    this.liveScoreListeners.forEach(listener => {
      listener(Array.from(this.liveScores.values()));
    });
  }

  /**
   * Update player performances and notify listeners
   */
  private updatePlayerPerformances(performances: PlayerPerformance[]): void {
    performances.forEach(performance => {
      performance.lastUpdated = new Date();
      this.playerPerformances.set(performance.playerId, performance);
    });

    // Notify all listeners
    this.playerPerformanceListeners.forEach(listener => {
      listener(Array.from(this.playerPerformances.values()));
    });
  }

  /**
   * Process matchup alerts and notifications
   */
  private processMatchupAlert(alert: MatchupAlert): void {
    alert.timestamp = new Date();
    this.recentAlerts.unshift(alert);
    
    // Keep only recent alerts (last 100)
    if (this.recentAlerts.length > 100) {
      this.recentAlerts = this.recentAlerts.slice(0, 100);
    }

    // Notify listeners
    this.matchupAlertListeners.forEach(listener => {
      listener(alert);
    });

    // Trigger browser notification for high priority alerts
    if (alert.priority === 'high' || alert.priority === 'critical') {
      this.sendBrowserNotification(alert);
    }
  }

  /**
   * Send browser push notification
   */
  private sendBrowserNotification(alert: MatchupAlert): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(alert.title, {
        body: alert.message,
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        tag: alert.id,
        requireInteraction: alert.priority === 'critical'
      });
    }
  }

  /**
   * Attempt to reconnect with exponential backoff
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached. Switching to polling mode.');
      this.startPollingMode();
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * Fallback polling mode for when WebSocket fails
   */
  private startPollingMode(): void {
    console.log('🔄 Starting polling mode for real-time updates');
    
    // Poll for updates every 30 seconds
    setInterval(() => {
      this.fetchLatestData();
    }, 30000);
  }

  /**
   * Fetch latest data via REST API (fallback)
   */
  private async fetchLatestData(): Promise<void> {
    try {
      // Simulate API calls for development
      const mockScores = this.generateMockLiveScores();
      const mockPerformances = this.generateMockPlayerPerformances();
      
      this.updateLiveScores(mockScores);
      this.updatePlayerPerformances(mockPerformances);
    } catch (error) {
      console.error('Failed to fetch latest data:', error);
    }
  }

  /**
   * Public API: Subscribe to live score updates
   */
  public onLiveScores(callback: (scores: LiveScore[]) => void): () => void {
    this.liveScoreListeners.push(callback);
    
    // Immediately send current data
    if (this.liveScores.size > 0) {
      callback(Array.from(this.liveScores.values()));
    }
    
    // Return unsubscribe function
    return () => {
      const index = this.liveScoreListeners.indexOf(callback);
      if (index > -1) {
        this.liveScoreListeners.splice(index, 1);
      }
    };
  }

  /**
   * Public API: Subscribe to player performance updates
   */
  public onPlayerPerformance(callback: (performances: PlayerPerformance[]) => void): () => void {
    this.playerPerformanceListeners.push(callback);
    
    // Immediately send current data
    if (this.playerPerformances.size > 0) {
      callback(Array.from(this.playerPerformances.values()));
    }
    
    // Return unsubscribe function
    return () => {
      const index = this.playerPerformanceListeners.indexOf(callback);
      if (index > -1) {
        this.playerPerformanceListeners.splice(index, 1);
      }
    };
  }

  /**
   * Public API: Subscribe to matchup alerts
   */
  public onMatchupAlerts(callback: (alert: MatchupAlert) => void): () => void {
    this.matchupAlertListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.matchupAlertListeners.indexOf(callback);
      if (index > -1) {
        this.matchupAlertListeners.splice(index, 1);
      }
    };
  }

  /**
   * Public API: Subscribe to connection status changes
   */
  public onConnectionStatus(callback: (isConnected: boolean) => void): () => void {
    this.connectionStatusListeners.push(callback);
    
    // Immediately send current status
    callback(this.isConnected);
    
    // Return unsubscribe function
    return () => {
      const index = this.connectionStatusListeners.indexOf(callback);
      if (index > -1) {
        this.connectionStatusListeners.splice(index, 1);
      }
    };
  }

  /**
   * Public API: Request browser notification permission
   */
  public async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  /**
   * Public API: Get current connection status
   */
  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  /**
   * Public API: Get recent alerts
   */
  public getRecentAlerts(): MatchupAlert[] {
    return [...this.recentAlerts];
  }

  /**
   * Utility: Notify connection status listeners
   */
  private notifyConnectionStatus(status: boolean): void {
    this.connectionStatusListeners.forEach(listener => {
      listener(status);
    });
  }

  /**
   * Utility: Get current NFL week
   */
  private getCurrentWeek(): number {
    // This would calculate the current NFL week based on the date
    // For demo purposes, return week 1
    return 1;
  }

  /**
   * Development: Generate mock live scores
   */
  private generateMockLiveScores(): LiveScore[] {
    return [
      {
        gameId: 'game1',
        homeTeam: 'Chiefs',
        awayTeam: 'Bills',
        homeScore: 21,
        awayScore: 17,
        quarter: 3,
        timeRemaining: '8:45',
        status: 'in-progress',
        lastUpdated: new Date()
      },
      {
        gameId: 'game2',
        homeTeam: 'Cowboys',
        awayTeam: 'Giants',
        homeScore: 14,
        awayScore: 7,
        quarter: 2,
        timeRemaining: '2:30',
        status: 'in-progress',
        lastUpdated: new Date()
      }
    ];
  }

  /**
   * Development: Generate mock player performances
   */
  private generateMockPlayerPerformances(): PlayerPerformance[] {
    return [
      {
        playerId: 'player1',
        playerName: 'Patrick Mahomes',
        position: 'QB',
        team: 'KC',
        gameId: 'game1',
        stats: {
          passingYards: 245,
          passingTouchdowns: 2,
          interceptions: 0,
          rushingYards: 15
        },
        fantasyPoints: 18.5,
        projectedPoints: 22.3,
        lastUpdated: new Date()
      },
      {
        playerId: 'player2',
        playerName: 'Josh Allen',
        position: 'QB',
        team: 'BUF',
        gameId: 'game1',
        stats: {
          passingYards: 198,
          passingTouchdowns: 1,
          interceptions: 1,
          rushingYards: 32,
          rushingTouchdowns: 1
        },
        fantasyPoints: 16.8,
        projectedPoints: 21.7,
        lastUpdated: new Date()
      }
    ];
  }

  /**
   * Cleanup: Disconnect and clean up resources
   */
  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.liveScoreListeners.length = 0;
    this.playerPerformanceListeners.length = 0;
    this.matchupAlertListeners.length = 0;
    this.connectionStatusListeners.length = 0;
  }
}

// Export singleton instance
const realTimeDataService = new RealTimeDataService();
export default realTimeDataService;
