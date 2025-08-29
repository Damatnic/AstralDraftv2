/**
 * Oracle Real-Time Hook
 * Real-time Oracle predictions and fantasy football updates
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// Enhanced interfaces for real-time Oracle functionality
export interface OracleRealTimeState {
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastUpdateAt: number;
  pendingUpdates: number;
  latency: number;
  activeSubscriptions: string[];
}

export interface PredictionUpdate {
  id: string;
  playerId: string;
  week: number;
  season: number;
  prediction: {
    projectedPoints: number;
    confidence: number;
    reasoning: string[];
    updatedAt: number;
  };
  metadata: {
    source: string;
    version: string;
    priority: 'low' | 'medium' | 'high';
  };
}

export interface MarketUpdate {
  id: string;
  playerId: string;
  marketData: {
    ownership: number;
    salaryChange: number;
    projectionChange: number;
    trendDirection: 'up' | 'down' | 'stable';
    volume: number;
  };
  timestamp: number;
}

export interface InjuryUpdate {
  id: string;
  playerId: string;
  injuryData: {
    status: 'healthy' | 'questionable' | 'doubtful' | 'out' | 'ir';
    description: string;
    expectedReturn: string | null;
    severity: 'minor' | 'moderate' | 'major';
    affectedGames: number[];
  };
  timestamp: number;
}

export interface WeatherUpdate {
  id: string;
  gameId: string;
  weatherData: {
    temperature: number;
    windSpeed: number;
    precipitation: number;
    conditions: string;
    domeGame: boolean;
    impact: 'positive' | 'negative' | 'neutral';
  };
  timestamp: number;
}

export interface NewsUpdate {
  id: string;
  playerId: string;
  newsData: {
    headline: string;
    summary: string;
    impact: 'positive' | 'negative' | 'neutral';
    reliability: number;
    tags: string[];
  };
  timestamp: number;
}

export interface SubscriptionConfig {
  predictions: boolean;
  injuries: boolean;
  weather: boolean;
  market: boolean;
  news: boolean;
  playerIds: string[];
  teamIds: string[];
}

export interface UserInfo {
  id: string;
  username: string;
  preferences: {
    notifications: boolean;
    autoRefresh: boolean;
    updateFrequency: number;
  };
}

// Default subscription configuration
const DEFAULT_SUBSCRIPTION_CONFIG: SubscriptionConfig = {
  predictions: true,
  injuries: true,
  weather: true,
  market: false,
  news: false,
  playerIds: [],
  teamIds: []
};

/**
 * Main Oracle real-time hook
 */
export function useOracleRealTime(
  userInfo: UserInfo | null,
  config: Partial<SubscriptionConfig> = {}
) {
  const mergedConfig = useMemo(() => ({ 
    ...DEFAULT_SUBSCRIPTION_CONFIG, 
    ...config 
  }), [config]);

  const [state, setState] = useState<OracleRealTimeState>({
    isConnected: false,
    connectionStatus: 'disconnected',
    lastUpdateAt: 0,
    pendingUpdates: 0,
    latency: 0,
    activeSubscriptions: []
  });

  const [recentUpdates, setRecentUpdates] = useState<{
    predictions: PredictionUpdate[];
    injuries: InjuryUpdate[];
    weather: WeatherUpdate[];
    market: MarketUpdate[];
    news: NewsUpdate[];
  }>({
    predictions: [],
    injuries: [],
    weather: [],
    market: [],
    news: []
  });

  const wsRef = useRef<WebSocket | null>(null);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const subscriptionsRef = useRef<Set<string>>(new Set());

  // Connection management
  const connect = useCallback(() => {
    if (!userInfo) return;

    setState(prev => ({ ...prev, connectionStatus: 'connecting' }));

    try {
      const wsEndpoint = process.env.REACT_APP_ORACLE_WS_ENDPOINT || 'ws://localhost:8080/oracle';
      wsRef.current = new WebSocket(`${wsEndpoint}?userId=${userInfo.id}`);

      wsRef.current.onopen = () => {
        setState(prev => ({
          ...prev,
          isConnected: true,
          connectionStatus: 'connected',
          lastUpdateAt: Date.now()
        }));

        // Start heartbeat
        startHeartbeat();
        
        // Subscribe to configured channels
        setupSubscriptions();
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as {
            type: string;
            payload: Record<string, unknown>;
            timestamp: number;
          };
          
          handleMessage(data.type, data.payload, data.timestamp);
        } catch {
          // Invalid message format
        }
      };

      wsRef.current.onclose = () => {
        setState(prev => ({
          ...prev,
          isConnected: false,
          connectionStatus: 'disconnected'
        }));
        
        stopHeartbeat();
      };

      wsRef.current.onerror = () => {
        setState(prev => ({
          ...prev,
          connectionStatus: 'error'
        }));
      };

    } catch {
      setState(prev => ({
        ...prev,
        connectionStatus: 'error'
      }));
    }
  }, [handleMessage, setupSubscriptions, startHeartbeat, stopHeartbeat, userInfo]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    stopHeartbeat();
    subscriptionsRef.current.clear();
    
    setState(prev => ({
      ...prev,
      isConnected: false,
      connectionStatus: 'disconnected',
      activeSubscriptions: []
    }));
  }, [stopHeartbeat]);

  // Heartbeat management
  const startHeartbeat = useCallback(() => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
    
    heartbeatRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'heartbeat',
          timestamp: Date.now()
        }));
      }
    }, 30000);
  }, []);

  const stopHeartbeat = useCallback(() => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
  }, []);

  // Subscription management
  const setupSubscriptions = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    const subscriptions: string[] = [];

    if (mergedConfig.predictions) subscriptions.push('predictions');
    if (mergedConfig.injuries) subscriptions.push('injuries');
    if (mergedConfig.weather) subscriptions.push('weather');
    if (mergedConfig.market) subscriptions.push('market');
    if (mergedConfig.news) subscriptions.push('news');

    // Add player-specific subscriptions
    mergedConfig.playerIds.forEach(playerId => {
      subscriptions.push(`player:${playerId}`);
    });

    // Add team-specific subscriptions
    mergedConfig.teamIds.forEach(teamId => {
      subscriptions.push(`team:${teamId}`);
    });

    wsRef.current.send(JSON.stringify({
      type: 'subscribe',
      subscriptions,
      timestamp: Date.now()
    }));

    subscriptions.forEach(sub => subscriptionsRef.current.add(sub));
    
    setState(prev => ({
      ...prev,
      activeSubscriptions: Array.from(subscriptionsRef.current)
    }));
  }, [mergedConfig]);

  const subscribe = useCallback((channel: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    if (!subscriptionsRef.current.has(channel)) {
      wsRef.current.send(JSON.stringify({
        type: 'subscribe',
        subscriptions: [channel],
        timestamp: Date.now()
      }));

      subscriptionsRef.current.add(channel);
      
      setState(prev => ({
        ...prev,
        activeSubscriptions: Array.from(subscriptionsRef.current)
      }));
    }
  }, []);

  const unsubscribe = useCallback((channel: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    if (subscriptionsRef.current.has(channel)) {
      wsRef.current.send(JSON.stringify({
        type: 'unsubscribe',
        subscriptions: [channel],
        timestamp: Date.now()
      }));

      subscriptionsRef.current.delete(channel);
      
      setState(prev => ({
        ...prev,
        activeSubscriptions: Array.from(subscriptionsRef.current)
      }));
    }
  }, []);

  // Message handling
  const handleMessage = useCallback((messageType: string, payload: Record<string, unknown>, timestamp: number) => {
    const latency = Date.now() - timestamp;
    
    setState(prev => ({
      ...prev,
      lastUpdateAt: Date.now(),
      latency: Math.round((prev.latency + latency) / 2)
    }));

    switch (messageType) {
      case 'prediction_update':
        handlePredictionUpdate(payload as unknown as PredictionUpdate);
        break;
      case 'injury_update':
        handleInjuryUpdate(payload as unknown as InjuryUpdate);
        break;
      case 'weather_update':
        handleWeatherUpdate(payload as unknown as WeatherUpdate);
        break;
      case 'market_update':
        handleMarketUpdate(payload as unknown as MarketUpdate);
        break;
      case 'news_update':
        handleNewsUpdate(payload as unknown as NewsUpdate);
        break;
      case 'heartbeat_response':
        // Heartbeat acknowledged
        break;
      default:
        // Unknown message type
        break;
    }
  }, [handleInjuryUpdate, handleMarketUpdate, handleNewsUpdate, handlePredictionUpdate, handleWeatherUpdate]);

  const handlePredictionUpdate = useCallback((update: PredictionUpdate) => {
    setRecentUpdates(prev => ({
      ...prev,
      predictions: [update, ...prev.predictions.slice(0, 49)]
    }));

    setState(prev => ({
      ...prev,
      pendingUpdates: prev.pendingUpdates + 1
    }));
  }, []);

  const handleInjuryUpdate = useCallback((update: InjuryUpdate) => {
    setRecentUpdates(prev => ({
      ...prev,
      injuries: [update, ...prev.injuries.slice(0, 49)]
    }));
  }, []);

  const handleWeatherUpdate = useCallback((update: WeatherUpdate) => {
    setRecentUpdates(prev => ({
      ...prev,
      weather: [update, ...prev.weather.slice(0, 49)]
    }));
  }, []);

  const handleMarketUpdate = useCallback((update: MarketUpdate) => {
    setRecentUpdates(prev => ({
      ...prev,
      market: [update, ...prev.market.slice(0, 49)]
    }));
  }, []);

  const handleNewsUpdate = useCallback((update: NewsUpdate) => {
    setRecentUpdates(prev => ({
      ...prev,
      news: [update, ...prev.news.slice(0, 49)]
    }));
  }, []);

  // Player-specific operations
  const subscribeToPlayer = useCallback((playerId: string) => {
    subscribe(`player:${playerId}`);
  }, [subscribe]);

  const unsubscribeFromPlayer = useCallback((playerId: string) => {
    unsubscribe(`player:${playerId}`);
  }, [unsubscribe]);

  const requestPlayerUpdate = useCallback((_playerId: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    // Request specific player update
    wsRef.current.send(JSON.stringify({
      type: 'request_update',
      playerId: _playerId,
      timestamp: Date.now()
    }));
  }, []);

  // Team operations
  const subscribeToTeam = useCallback((teamId: string) => {
    subscribe(`team:${teamId}`);
  }, [subscribe]);

  // Clear processed updates
  const clearProcessedUpdates = useCallback(() => {
    setState(prev => ({
      ...prev,
      pendingUpdates: 0
    }));
  }, []);

  // Initialize connection
  useEffect(() => {
    if (userInfo) {
      connect();
    }
    
    return () => {
      disconnect();
    };
  }, [userInfo, connect, disconnect]);

  // Update subscriptions when config changes
  useEffect(() => {
    if (state.isConnected) {
      setupSubscriptions();
    }
  }, [state.isConnected, mergedConfig, setupSubscriptions]);

  return {
    state,
    recentUpdates,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    subscribeToPlayer,
    unsubscribeFromPlayer,
    subscribeToTeam,
    requestPlayerUpdate,
    clearProcessedUpdates,
    isConnected: state.isConnected,
    connectionStatus: state.connectionStatus,
    activeSubscriptions: state.activeSubscriptions
  };
}

/**
 * Hook for Oracle prediction reactions
 */
export function useOracleReactions() {
  const [reactions, setReactions] = useState<{
    [predictionId: string]: {
      likes: number;
      dislikes: number;
      userReaction: 'like' | 'dislike' | null;
    };
  }>({});

  const addReaction = useCallback((predictionId: string, _reactionType: 'like' | 'dislike') => {
    setReactions(prev => ({
      ...prev,
      [predictionId]: {
        likes: 5,
        dislikes: 2,
        userReaction: _reactionType
      }
    }));
  }, []);

  const removeReaction = useCallback((predictionId: string) => {
    setReactions(prev => ({
      ...prev,
      [predictionId]: {
        ...prev[predictionId],
        userReaction: null
      }
    }));
  }, []);

  return {
    reactions,
    addReaction,
    removeReaction
  };
}

export default {
  useOracleRealTime,
  useOracleReactions
};
