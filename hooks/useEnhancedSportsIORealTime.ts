/**
 * Enhanced Sports.io Real-Time Hook
 * React hook for easy integration with live NFL data
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { enhancedSportsIOService } from '../services/enhancedSportsIORealTimeService';
import { Player } from '../types';

interface LivePlayerData {
  playerId: string;
  stats: any;
  fantasyPoints: number;
  lastPlay?: string;
  gameContext: {
    gameId: string;
    quarter: number;
    timeRemaining: string;
  };
  timestamp: Date;
}

interface LiveGameData {
  gameId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  quarter: number;
  timeRemaining: string;
  status: string;
  lastUpdate: Date;
}

interface UseRealTimePlayersOptions {
  playerIds?: string[];
  updateInterval?: number;
  autoSubscribe?: boolean;
}

interface UseRealTimeGamesOptions {
  gameIds?: string[];
  activeOnly?: boolean;
  updateInterval?: number;
}

/**
 * Hook for real-time player updates
 */
export function useRealTimePlayers(options: UseRealTimePlayersOptions = {}) {
  const {
    playerIds = [],
    updateInterval = 5000,
    autoSubscribe = true
  } = options;

  const [players, setPlayers] = useState<Map<string, LivePlayerData>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  const subscriptionIds = useRef<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle real-time player updates
  const handlePlayerUpdate = useCallback((updateData: any) => {
    if (updateData.type === 'player_update') {
      setPlayers(prev => {
        const newPlayers = new Map(prev);
        newPlayers.set(updateData.data.playerId, updateData.data);
        return newPlayers;
      });
      setLastUpdate(new Date());
    }
  }, []);

  // Subscribe to player updates
  const subscribeToPlayer = useCallback((playerId: string) => {
    const subscriptionId = enhancedSportsIOService.subscribeToUpdates(
      'player',
      handlePlayerUpdate,
      playerId
    );
    subscriptionIds.current.push(subscriptionId);
    return subscriptionId;
  }, [handlePlayerUpdate]);

  // Unsubscribe from player updates
  const unsubscribeFromPlayer = useCallback((playerId: string) => {
    const index = subscriptionIds.current.findIndex(id => id.includes(playerId));
    if (index !== -1) {
      const subscriptionId = subscriptionIds.current[index];
      enhancedSportsIOService.unsubscribe(subscriptionId);
      subscriptionIds.current.splice(index, 1);
    }
  }, []);

  // Fetch live player data
  const fetchPlayerData = useCallback(async (playerId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const liveData = await enhancedSportsIOService.getLivePlayerStats(playerId);
      if (liveData) {
        setPlayers(prev => {
          const newPlayers = new Map(prev);
          newPlayers.set(playerId, liveData);
          return newPlayers;
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch player data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch multiple players
  const fetchMultiplePlayers = useCallback(async (ids: string[]) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const promises = ids.map(id => enhancedSportsIOService.getLivePlayerStats(id));
      const results = await Promise.allSettled(promises);
      
      const newPlayers = new Map<string, LivePlayerData>();
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          newPlayers.set(ids[index], result.value);
        }
      });
      
      setPlayers(newPlayers);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch players data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-subscribe to players on mount
  useEffect(() => {
    if (autoSubscribe && playerIds.length > 0) {
      playerIds.forEach(playerId => {
        subscribeToPlayer(playerId);
      });
      
      // Initial data fetch
      fetchMultiplePlayers(playerIds);
    }

    return () => {
      // Cleanup subscriptions
      subscriptionIds.current.forEach(id => {
        enhancedSportsIOService.unsubscribe(id);
      });
      subscriptionIds.current = [];
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoSubscribe, playerIds, subscribeToPlayer, fetchMultiplePlayers]);

  // Periodic updates
  useEffect(() => {
    if (updateInterval > 0 && playerIds.length > 0) {
      intervalRef.current = setInterval(() => {
        fetchMultiplePlayers(playerIds);
      }, updateInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updateInterval, playerIds, fetchMultiplePlayers]);

  return {
    players: Array.from(players.values()),
    playersMap: players,
    isLoading,
    error,
    lastUpdate,
    subscribeToPlayer,
    unsubscribeFromPlayer,
    fetchPlayerData,
    fetchMultiplePlayers,
    refreshAll: () => fetchMultiplePlayers(playerIds)
  };
}

/**
 * Hook for real-time game updates
 */
export function useRealTimeGames(options: UseRealTimeGamesOptions = {}) {
  const {
    gameIds = [],
    activeOnly = true,
    updateInterval = 10000
  } = options;

  const [games, setGames] = useState<Map<string, LiveGameData>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  const subscriptionIds = useRef<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle real-time game updates
  const handleGameUpdate = useCallback((updateData: any) => {
    if (updateData.type === 'game_update') {
      setGames(prev => {
        const newGames = new Map(prev);
        newGames.set(updateData.data.gameId, updateData.data);
        return newGames;
      });
      setLastUpdate(new Date());
    }
  }, []);

  // Fetch active games
  const fetchActiveGames = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const activeGames = await enhancedSportsIOService.getActiveGames();
      const gamesMap = new Map<string, LiveGameData>();
      
      activeGames.forEach(game => {
        gamesMap.set(game.gameId, game);
      });
      
      setGames(gamesMap);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch games');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Subscribe to game updates
  const subscribeToGame = useCallback((gameId: string) => {
    const subscriptionId = enhancedSportsIOService.subscribeToUpdates(
      'game',
      handleGameUpdate,
      gameId
    );
    subscriptionIds.current.push(subscriptionId);
    return subscriptionId;
  }, [handleGameUpdate]);

  // Subscribe to all updates
  const subscribeToAllUpdates = useCallback(() => {
    const subscriptionId = enhancedSportsIOService.subscribeToUpdates(
      'all',
      handleGameUpdate
    );
    subscriptionIds.current.push(subscriptionId);
    return subscriptionId;
  }, [handleGameUpdate]);

  // Initialize
  useEffect(() => {
    if (activeOnly) {
      fetchActiveGames();
      subscribeToAllUpdates();
    } else if (gameIds.length > 0) {
      gameIds.forEach(gameId => {
        subscribeToGame(gameId);
      });
    }

    return () => {
      // Cleanup subscriptions
      subscriptionIds.current.forEach(id => {
        enhancedSportsIOService.unsubscribe(id);
      });
      subscriptionIds.current = [];
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeOnly, gameIds, fetchActiveGames, subscribeToGame, subscribeToAllUpdates]);

  // Periodic updates for active games
  useEffect(() => {
    if (updateInterval > 0 && activeOnly) {
      intervalRef.current = setInterval(() => {
        fetchActiveGames();
      }, updateInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updateInterval, activeOnly, fetchActiveGames]);

  return {
    games: Array.from(games.values()),
    gamesMap: games,
    activeGames: Array.from(games.values()).filter(game => game.status === 'in_progress'),
    isLoading,
    error,
    lastUpdate,
    subscribeToGame,
    subscribeToAllUpdates,
    fetchActiveGames,
    refreshAll: fetchActiveGames
  };
}

/**
 * Hook for comprehensive real-time updates
 */
export function useRealTimeUpdates() {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  const [totalUpdates, setTotalUpdates] = useState(0);
  const [lastActivityTime, setLastActivityTime] = useState<Date | null>(null);
  
  const subscriptionId = useRef<string | null>(null);

  // Handle all real-time updates
  const handleAllUpdates = useCallback((updateData: any) => {
    setTotalUpdates(prev => prev + 1);
    setLastActivityTime(new Date());
    setConnectionStatus('connected');
  }, []);

  // Subscribe to all updates for monitoring
  useEffect(() => {
    setConnectionStatus('connecting');
    
    subscriptionId.current = enhancedSportsIOService.subscribeToUpdates(
      'all',
      handleAllUpdates
    );

    // Set connected after a short delay if no errors
    const timer = setTimeout(() => {
      setConnectionStatus('connected');
    }, 1000);

    return () => {
      if (subscriptionId.current) {
        enhancedSportsIOService.unsubscribe(subscriptionId.current);
      }
      clearTimeout(timer);
    };
  }, [handleAllUpdates]);

  return {
    connectionStatus,
    totalUpdates,
    lastActivityTime,
    isConnected: connectionStatus === 'connected'
  };
}