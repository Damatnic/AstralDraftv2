/**
 * Elite typing definitions for enhanced functionality
 */

export interface EliteUser {
  id: string;
  displayName: string;
  email: string;
  avatar?: string;
  badge: string;
  isAdmin: boolean;
  preferences?: {
    notifications: boolean;
    analytics: boolean;
    aiInsights: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
  stats?: {
    winRate: number;
    rank: number;
    pointsFor: number;
    tradesMade: number;
  };
}

export interface EliteNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
  read: boolean;
  actionUrl?: string;
}

export interface AIInsight {
  id: string;
  type: 'player_recommendation' | 'trade_suggestion' | 'waiver_pickup' | 'lineup_optimization';
  title: string;
  description: string;
  confidence: number; // 0-100
  impact: 'high' | 'medium' | 'low';
  playerIds?: string[];
  timestamp: number;
}

export interface EliteAnalytics {
  pageViews: number;
  sessionDuration: number;
  featuresUsed: string[];
  lastActiveTime: number;
  performanceMetrics: {
    loadTime: number;
    renderTime: number;
    interactionCount: number;
  };
}

export interface Command {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: () => void;
  category: string;
  keywords: string[];
  shortcut?: string;
}

export interface EliteSettings {
  notifications: boolean;
  autoRefresh: boolean;
  animations: boolean;
  analytics: boolean;
  aiInsights: boolean;
  darkMode: boolean;
  keyboardShortcuts: boolean;
  realTimeUpdates: boolean;
}
