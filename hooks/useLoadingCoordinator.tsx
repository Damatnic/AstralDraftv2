import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

// Types for loading coordination
interface LoadingState {
  id: string;
  message?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
}

interface LoadingCoordinatorContextType {
  isAnyLoading: boolean;
  activeLoadings: LoadingState[];
  startLoading: (id: string, message?: string, priority?: LoadingState['priority']) => void;
  stopLoading: (id: string) => void;
  getLoadingState: (id: string) => LoadingState | undefined;
  clearAllLoading: () => void;
  getPrimaryLoading: () => LoadingState | undefined;
}

// Context
const LoadingCoordinatorContext = createContext<LoadingCoordinatorContextType | undefined>(undefined);

// Provider component
export const LoadingCoordinatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState<Map<string, LoadingState>>(new Map());
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const startLoading = useCallback((id: string, message?: string, priority: LoadingState['priority'] = 'medium') => {
    // Clear any existing timeout for this ID
    const existingTimeout = timeoutRefs.current.get(id);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    setLoadingStates(prev => {
      const newMap = new Map(prev);
      newMap.set(id, {
        id,
        message,
        priority,
        timestamp: Date.now()
      });
      return newMap;
    });

    // Auto-cleanup after 30 seconds to prevent memory leaks
    const timeout = setTimeout(() => {
      stopLoading(id);
    }, 30000);
    timeoutRefs.current.set(id, timeout);
  }, []);

  const stopLoading = useCallback((id: string) => {
    // Clear timeout
    const timeout = timeoutRefs.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutRefs.current.delete(id);
    }

    setLoadingStates(prev => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  }, []);

  const getLoadingState = useCallback((id: string) => {
    return loadingStates.get(id);
  }, [loadingStates]);

  const clearAllLoading = useCallback(() => {
    // Clear all timeouts
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current.clear();
    
    setLoadingStates(new Map());
  }, []);

  const getPrimaryLoading = useCallback((): LoadingState | undefined => {
    const states = Array.from(loadingStates.values());
    if (states.length === 0) return undefined;

    // Sort by priority (critical > high > medium > low) then by timestamp
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    states.sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return a.timestamp - b.timestamp; // Earlier timestamp wins
    });

    return states[0];
  }, [loadingStates]);

  const activeLoadings = Array.from(loadingStates.values());
  const isAnyLoading = activeLoadings.length > 0;

  const value: LoadingCoordinatorContextType = {
    isAnyLoading,
    activeLoadings,
    startLoading,
    stopLoading,
    getLoadingState,
    clearAllLoading,
    getPrimaryLoading
  };

  return (
    <LoadingCoordinatorContext.Provider value={value}>
      {children}
    </LoadingCoordinatorContext.Provider>
  );
};

// Hook for using loading coordinator
export const useLoadingCoordinator = () => {
  const context = useContext(LoadingCoordinatorContext);
  if (!context) {
    throw new Error('useLoadingCoordinator must be used within a LoadingCoordinatorProvider');
  }
  return context;
};

// Custom hook for individual component loading management
export const useCoordinatedLoading = (componentId: string) => {
  const { startLoading, stopLoading, getLoadingState } = useLoadingCoordinator();
  
  const isLoading = !!getLoadingState(componentId);
  
  const setLoading = useCallback((loading: boolean, message?: string, priority?: LoadingState['priority']) => {
    if (loading) {
      startLoading(componentId, message, priority);
    } else {
      stopLoading(componentId);
    }
  }, [componentId, startLoading, stopLoading]);

  const setIsLoading = useCallback((loading: boolean) => {
    setLoading(loading);
  }, [setLoading]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      stopLoading(componentId);
    };
  }, [componentId, stopLoading]);

  return { isLoading, setLoading, setIsLoading };
};

// Hook for async operations with automatic loading management
export const useAsyncWithLoading = <T,>(
  asyncFn: () => Promise<T>,
  componentId: string,
  options?: {
    message?: string;
    priority?: LoadingState['priority'];
    onSuccess?: (result: T) => void;
    onError?: (error: Error) => void;
  }
) => {
  const { setLoading } = useCoordinatedLoading(componentId);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<T | null>(null);

  const execute = useCallback(async () => {
    try {
      setError(null);
      setLoading(true, options?.message, options?.priority);
      
      const result = await asyncFn();
      setResult(result);
      options?.onSuccess?.(result);
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [asyncFn, setLoading, options]);

  return { execute, error, result };
};